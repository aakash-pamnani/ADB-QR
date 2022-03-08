import bonjour = require("bonjour");
import { Readable, Stream } from "stream";
import { AdbConnect, AdbPair } from "./adbService";
import { MdnsDeviceData } from "./mdnsDeviceData";
import { showError, showProgress } from "./utils";
import * as vscode from 'vscode'

// Mdns Scanning for QR code connection pairing.
async function startMdnsScanQr(
  password: String,
  panel: vscode.WebviewPanel,
  resolve?: Function
): Promise<void> {
  //Timer variable to dispose everything if no device connect within 30 sec.
  var timer: NodeJS.Timeout;

  // Event if panel is closed by user.
  panel?.onDidDispose((e)=>{
    resolve!();
    scanner.stop();
    bonjour().destroy();
    clearTimeout(timer);
  })

  var scanner: bonjour.Browser = bonjour().find(
    { type: "adb-tls-pairing" },
    async function (service: any) {
      console.log(service);
      if (!(service.addresses[0] == undefined)) {
        var device = new MdnsDeviceData(
          service.name,
          service.addresses[0],
          service.port
        );

        var isPaired;
        await showProgress("ADB-QR:Pairing...", () =>
          isPaired = AdbPair(device, password)
        );
        console.log(isPaired);
        if (isPaired) {
          resolve!();
          showProgress("ADB-QR:Waiting to Connect...", async () => {
            await new Promise<void>(async (resolve) => {
              panel.dispose();
              await AdbConnect(panel, resolve);
              clearTimeout(timer);
              scanner.stop();
              bonjour().destroy();
            });
          });
        }
        else{
          resolve!();
          showError("ADB QR: Unable to pair device")
        }
      }
    }
  );

  scanner.addListener('up',()=>{
    console.log("QR Scanning Stopped...");
  })

  scanner.on('up',()=>{
    console.log("up");
  })

  timer = setTimeout(() => {
    scanner.stop();
    bonjour().destroy();
    panel.dispose();
    showError("ADB QR: TimeOut: No Device Found");
    resolve!();
  }, 30000);
}

async function startMdnsScanPairingCode(
  resolve?: Function
): Promise<{ stream: Readable; dispose: Function }> {
  var timer: NodeJS.Timeout;

  var stream = new Readable();

  var scanner = bonjour().find(
    { type: "adb-tls-pairing" },
    function (service: any) {
      console.log(service);
      if (!(service.addresses[0] == undefined)) {
        var device = new MdnsDeviceData(
          service.name,
          service.addresses[0],
          service.port
        );
        stream.emit("data", device);
      }
    }
  );

  timer = setTimeout(() => {
    scanner.stop();
    bonjour().destroy();
    stream.destroy();
    showError("ADB QR: TimeOut: Scanning Stopped");
    resolve!();
  }, 30000);

  var dispose: Function = () => {
    scanner.stop();
    bonjour().destroy();
    stream.destroy();
    clearTimeout(timer);
    resolve!();
  };
  return { stream, dispose };
}

export { startMdnsScanQr, startMdnsScanPairingCode };
