import {
  AdbConnect,
  AdbPair,
  isAdbInstalled,
  isAdbVersionSupported,
} from "./adbService";
import { startMdnsScanPairingCode } from "./mdnsScan";
import { showError, showNotification, showProgress } from "./utils";
import * as vscode from "vscode";
import { MdnsDeviceData } from "./mdnsDeviceData";
import { Readable } from "stream";

var deviceList: QuickPickTile[] = [];

async function connectWithPairingCode() {
  //check if adb is installed in system or not
  if (!isAdbInstalled()) {
    showError("ADB is not installed or PATH is not Configured");
  } else if (!isAdbVersionSupported()) {
    showError("ADB is not updated. Please update to version 32 or later");
  } else {
    var scanData: { stream: Readable; dispose: Function };
    const quickPick = vscode.window.createQuickPick<QuickPickTile>();
    quickPick.title = "scanning devices...";
    quickPick.placeholder = "Select one device from list";
    quickPick.canSelectMany = false;

    quickPick.onDidChangeSelection((selection) => {
      console.log(selection);
      if (selection[0]) {
        var code: string;
        vscode.window
          .showInputBox({ title: "Enter pairing code", placeHolder: "123456" })
          .then(async (input) => {
            code = input ?? "0";
            var isPaired;
            await showProgress("ADB-QR:Pairing...", () => {
              isPaired = AdbPair(selection[0].device, code);
            });
            if (isPaired) {
              showProgress("ADB-QR:Connecting...", async () => {
                await AdbConnect();
              });
            } else {
              showError("ADB QR: Unable to pair Device");
            }
          });
      }
    });
    quickPick.onDidHide(() => {
      quickPick.dispose();
      deviceList = [];
      scanData["dispose"]();
    });

    quickPick.busy = true;
    quickPick.show();

    showProgress("ADB QR: Scanning...", async () => {
      await new Promise<void>(async (resolve) => {
        scanData = await startMdnsScanPairingCode(resolve);

        scanData["stream"]
          .addListener("data", (data: MdnsDeviceData) => {
            deviceList.push(new QuickPickTile(data));
            quickPick.items = deviceList;
          })
          .addListener("close", () => {
            quickPick.busy = false;
            if (deviceList.length == 0) {
              quickPick.dispose();
            }
          });
      });
    });
  }
}

class QuickPickTile implements vscode.QuickPickItem {
  device: MdnsDeviceData;

  constructor(device: MdnsDeviceData) {
    this.label = device.ipAddress + ":" + device.port;
    this.device = device;
  }
  label: string;
  kind?: vscode.QuickPickItemKind | undefined;
  description?: string | undefined;
  detail?: string | undefined;
  picked?: boolean | undefined;
  alwaysShow?: boolean | undefined;
  buttons?: readonly vscode.QuickInputButton[] | undefined;
}

export { connectWithPairingCode };
