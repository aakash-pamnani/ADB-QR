import bonjour = require("bonjour");
import { exec, execSync, spawnSync } from "child_process";
import { OutgoingMessage } from "http";

import { MdnsDeviceData } from "./mdnsDeviceData";
import { showError, showNotification } from "./utils";

function isAdbVersionSupported(): boolean {
  try {
    var commandOutput = executeCommand("adb --version");

    const output = commandOutput[1]?.toString();
    const exitCode = commandOutput[0];

    console.log("output is " + output);

    if (exitCode == 0) {
      var versionIndex = output!.lastIndexOf("Version");
      var currentFullVersion = output!.substring(versionIndex + 8);
      var currentVersion = Number.parseInt(
        currentFullVersion.charAt(0) + currentFullVersion.charAt(1)
      );

      if (currentVersion >= 32) {
        return true;
      } else {
        return false;
      }
    } else {
      showError("ADB Qr " + commandOutput[2]);

      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

function isAdbInstalled(): boolean {
  try {
    var commandOutput = executeCommand("adb --version");
    if (commandOutput[0] == 0) {
      return true;
    } else {
      showError("ADB Qr " + commandOutput[2]);
      return false;
    }
  } catch (e) {
    console.log("Someting Went Wrong", e);
    return false;
  }
}

function AdbPair(device: MdnsDeviceData, password: String): boolean {
  try {
    var commandOutput = executeCommand(
      "adb pair " + device.ipAddress + ":" + device.port + " " + password
    );
    console.log("Output was:\n", commandOutput);
    if (commandOutput[0] == 0) {
      return true;
    } else {
      showError("ADB Qr: " + commandOutput[2]);
      return false;
    }
  } catch (e) {
    console.log("Unable to Pair With Device", e);
    showError("ADB QR: Unable to Pair With Device");
    return false;
  }
}

function AdbConnect(panel?: any) {
  var timer: NodeJS.Timeout;

  timer = setTimeout(() => { 
    scanner.stop();
    panel?.dispose();
    showError("ADB QR: TimeOut: Unable to connect with device");
  }, 30000);

  var scanner = bonjour().find(
    { type: "adb-tls-connect" },
    function (service: any) {
      console.log(service);

      try {
        var commandOutput = executeCommand(
          "adb connect " + service.addresses[0] + ":" + service.port
        );

        console.log("Output was:\n", commandOutput);

        if (commandOutput[0] == 0) {
          var deviceName = getDeviceName(service.addresses[0], service.port);

          showNotification("ADB QR:Connected To " + deviceName);
        } else {
          showError("ADB Qr " + commandOutput[2]);
        }

        clearTimeout(timer);
      } catch (e) {
        console.log("Unable to Connect With Device", e);
        showError("ADB QR: Unable to Connect With Device");
        clearTimeout(timer);
      }
    }
  );
}

function getDeviceName(address: string, port: number): string {
  try {
    var commandOutput = executeCommand(
      "adb -s " + address + ":" + port + " shell getprop ro.product.model"
    );
    console.log("Output was:\n", commandOutput);

    if (commandOutput[0] == 0) {
      var output: string = commandOutput[1]?.toString() ?? "";
      return output;
    } else {
      showError("ADB Qr " + commandOutput[2]);
      return "Unable to get device name";
    }
  } catch (e) {
    console.log("Unable to get Device Name", e);
    showError("ADB QR: Something Went Wrong");
    return "";
  }
}

function executeCommand(command: string) {
  const child = spawnSync(command, {
    encoding: "utf-8",
    timeout: 30000,
    shell: true,
  });

  return [child.status, child.stdout, child.stderr];
}

export { isAdbVersionSupported, isAdbInstalled, AdbConnect, AdbPair };
