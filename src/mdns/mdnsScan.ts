import Bonjour, { Service } from "bonjour-service";
import { Readable, Stream } from "stream";
import { AdbConnect, AdbPair } from "../service/adbService";
import { MdnsDeviceData } from "./mdnsDeviceData";
import { showError, showProgress } from "../utils";
import * as vscode from "vscode";
import { Constants } from "../constants/strings";

// Mdns Scanning for QR code connection pairing.
async function startMdnsScanQr(
  password: String,
  panel: vscode.WebviewPanel,
  resolve?: Function
): Promise<void> {
  //Timer variable to dispose everything if no device connect within 30 sec.
  var timer: NodeJS.Timeout;
  var instance = new Bonjour();

  // Event if panel is closed by user.
  panel?.onDidDispose((e) => {
    resolve!();
    scanner.stop();
    instance.destroy();
    clearTimeout(timer);
  });

  var scanner = instance.find(
    { type: Constants.MDNS_PAIRING_TYPE },
    async function (service: Service) {
      console.log(service);
      if (!(service.addresses && service.addresses?.length == 0)) {
        var device: MdnsDeviceData;
        for (let i = 0; i < service.addresses!.length; i++) {
          if (require("net").isIP(service?.addresses![i]) == 4) {
            device = new MdnsDeviceData(
              service.name,
              service.addresses![i],
              service.port
            );
          }
        }

        var isPaired;
        await showProgress(
          vscode.l10n.t("ADB QR:Pairing..."),
          () => (isPaired = AdbPair(device, password))
        );
        console.log(isPaired);
        if (isPaired) {
          resolve!();
          showProgress(
            vscode.l10n.t("ADB QR:Waiting to Connect..."),
            async () => {
              await new Promise<void>(async (resolve) => {
                panel.dispose();
                clearTimeout(timer);
                scanner.stop();
                instance.destroy();
                await AdbConnect(panel, resolve);
              });
            }
          );
        } else {
          resolve!();
          showError(vscode.l10n.t("ADB QR: Unable to Pair With Device"));
        }
      }
    }
  );

  timer = setTimeout(() => {
    scanner.stop();
    instance.destroy();
    panel.dispose();
    showError(vscode.l10n.t("ADB QR: TimeOut: No Device Found"));
    resolve!();
  }, 30000);
}

async function startMdnsScanPairingCode(
  resolve?: Function
): Promise<{ stream: Readable; dispose: Function }> {
  var timer: NodeJS.Timeout;
  var instance = new Bonjour();

  var stream = new Readable();

  var scanner = instance.find(
    { type: Constants.MDNS_PAIRING_TYPE },
    function (service: any) {
      console.log(service);
      if (!(service.addresses && service.addresses?.length == 0)) {
        var device: MdnsDeviceData | null = null;
        for (let i = 0; i < service.addresses!.length; i++) {
          if (require("net").isIP(service?.addresses![i]) == 4) {
            device = new MdnsDeviceData(
              service.name,
              service.addresses![i],
              service.port
            );
          }
        }
        stream.emit("data", device);
      }
    }
  );

  timer = setTimeout(() => {
    scanner.stop();
    instance.destroy();
    stream.destroy();
    showError(vscode.l10n.t("ADB QR: TimeOut: Scanning Stopped"));
    resolve!();
  }, 30000);

  var dispose: Function = () => {
    scanner.stop();
    instance.destroy();
    stream.destroy();
    clearTimeout(timer);
    resolve!();
  };
  return { stream, dispose };
}

export { startMdnsScanQr, startMdnsScanPairingCode };
