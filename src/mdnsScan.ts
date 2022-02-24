import bonjour = require("bonjour");
import { ReadStream, WriteStream } from "fs";
import { Readable, Stream } from "stream";
import { AdbConnect, AdbPair } from "./adbService";
import { MdnsDeviceData } from "./mdnsDeviceData";
import { showError, showProgress } from "./utils";

function startMdnsScanQr(password: String, panel: any) {
  var timer: NodeJS.Timeout;
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
        scanner.stop();
        if (AdbPair(device, password)) {
          clearTimeout(timer);
          panel.dispose();
          AdbConnect(panel);
        }
      }
    }
  );

  timer = setTimeout(() => {
    scanner.stop();
    panel.dispose();
    showError("ADB QR: TimeOut: No Device Found");
  }, 30000);
}

function startMdnsScanPairingCode(): {stream:Readable,dispose:Function} {
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
  }, 30000);

  var dispose:Function = ()=>{
    scanner.stop();
    stream.destroy();
    clearTimeout(timer);
  }
  return {stream,dispose};
}

export { startMdnsScanQr, startMdnsScanPairingCode };
