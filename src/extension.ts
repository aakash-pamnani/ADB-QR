import * as vscode from "vscode";
import { connectWithPairedDevice } from "./connectWithPairedDevice";
import { connectWithPairingCode } from "./connectWithPairingCode";
import { connectWithQr } from "./connectWithQr";
import { ScreenCast } from "./screen-cast/ScreenCast";
export function activate(context: vscode.ExtensionContext) {
  // const readmePath = context.asAbsolutePath("README.md");
  // vscode.commands.executeCommand(
  //   "markdown.showPreview",
  // vscode.Uri.file(readmePath)
  // );

  // set ADB_MDNS_OPENSCREEN=1 on windows to enable mdns
  // export ADB_MDNS_OPENSCREEN=1 on linux,mac to enable mdns
  // adb kill-server
  // adb start-server
  //adb mdns check
  // adb mdns services
  

  var assetsPath = context.asAbsolutePath("./assets/");

  //Command to connect with QR Code
  let connectWithQrDisposible = vscode.commands.registerCommand(
    "adb-qr.connect with qr",
    function () {
      connectWithQr();
    }
  );

  //Command to connect with Pairing code
  let connectWithCodeDisposible = vscode.commands.registerCommand(
    "adb-qr.connect with pairing code",
    function () {
      connectWithPairingCode();
    }
  );

  //Command to connect Paired Devices
  let connectWithpairedDeviceDisposible = vscode.commands.registerCommand(
    "adb-qr.connect with paired device",
    function () {
      connectWithPairedDevice();
    }
  );

  let startStreaming = vscode.commands.registerCommand(
    "adb-qr.strem",
    function () {
      let screenCast = new ScreenCast(assetsPath);
      screenCast.start(context);
    }
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("ADB Qr.createTerminalHideFromUser", () => {
      vscode.window.createTerminal({
        name: `Ext Terminal +}`,
        hideFromUser: false,
      } as any);
    })
  );

  context.subscriptions.push(connectWithCodeDisposible);
  context.subscriptions.push(connectWithQrDisposible);
  context.subscriptions.push(connectWithpairedDeviceDisposible);
  context.subscriptions.push(startStreaming);
}

// this method is called when your extension is deactivated
export function deactivate() {}

//TODO:add linters
//TODO: add localization
//TODO refactor to clean code
