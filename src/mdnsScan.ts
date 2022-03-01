import bonjour = require("bonjour");
import { ReadStream, WriteStream } from "fs";
import { resolve } from "path";
import { Readable, Stream } from "stream";
import { AdbConnect, AdbPair } from "./adbService";
import { MdnsDeviceData } from "./mdnsDeviceData";
import { showError, showNotification, showProgress } from "./utils";

async function startMdnsScanQr(
  password: String,
  panel: any,
  resolve?: Function
): Promise<void> {
  var timer: NodeJS.Timeout;

  var scanner = bonjour().find(
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

  timer = setTimeout(() => {
    scanner.stop();
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
    stream.destroy();
    showError("ADB QR: TimeOut: Scanning Stopped");
    resolve!();
  }, 30000);

  var dispose: Function = () => {
    scanner.stop();
    stream.destroy();
    clearTimeout(timer);
    resolve!();
  };
  return { stream, dispose };
}

export { startMdnsScanQr, startMdnsScanPairingCode };
