import bonjour = require("bonjour");
import {spawnSync } from "child_process";


import { MdnsDeviceData } from "./mdnsDeviceData";
import { showError, showNotification, showProgress } from "./utils";

function isAdbVersionSupported(): boolean {
  try {
    var commandOutput = executeCommand("adb --version");

    const output = commandOutput[1]?.toString();
    const exitCode = commandOutput[0];

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
      showNotification("ADB-QR: " + commandOutput[1]);
      return true;
    } else {
      showError("ADB-QR: " + commandOutput[2]);
      return false;
    }
  } catch (e) {
    console.log("Unable to Pair With Device", e);
    showError("ADB QR: Unable to Pair With Device");
    return false;
  }
}

async function AdbConnect(panel?: any, resolve?: Function): Promise<void> {
  var timer: NodeJS.Timeout;
  console.log("Started Scanning...");
  var scanner = bonjour().find(
    { type: "adb-tls-connect" },
    function (service: any) {
      scanner.stop();
      bonjour().destroy();
      console.log(service);

      try {
        var commandOutput = executeCommand(
          "adb connect " + service.addresses[0] + ":" + service.port
        );

        console.log("Output was:\n", commandOutput);
        if (commandOutput[0] == 0) {
          showNotification("ADB-QR: " + commandOutput[1]);
          showProgress("ADB QR: Getting Device Name", () => {
            getDeviceName(service.addresses[0], service.port);
          });
        } else {
          showError("ADB QR " + commandOutput[2]);
        }
        clearTimeout(timer);
        if (resolve != null) {
          resolve();
        }
      } catch (e) {
        console.log("Unable to Connect With Device", e);
        showError("ADB QR: Unable to Connect With Device");
        clearTimeout(timer);
        if (resolve != null) {
          resolve();
        }
      }
    }
  );
  timer = setTimeout(() => {
    scanner.stop();
    panel?.dispose();
    showError("ADB QR: TimeOut: Unable to connect with device");
    console.log("ADB QR: TimeOut: Unable to connect with device");
    if (resolve != null) {
      resolve();
    }
  }, 30000);
}

function getDeviceName(address: string, port: number) {
  try {
    var commandOutput = executeCommand(
      "adb -s " + address + ":" + port + " shell getprop ro.product.model"
    );
    console.log("Output was:\n", commandOutput);

    if (commandOutput[0] == 0) {
      var output: string = commandOutput[1]?.toString() ?? "";
      showNotification("ADB QR:Connected To " + output);
    } else {
      showError("ADB Qr " + commandOutput[2]);
    }
  } catch (e) {
    console.log("Unable to get Device Name", e);
    showError("ADB QR: Something Went Wrong");
  }
}

function executeCommand(command: string) {
  var child;
  try {
    child = spawnSync(command, {
      encoding: "utf-8",
      timeout: 30000,
      shell: true,
    });
  } catch (e) {
    console.log(e);
    showError("ADB-QR: Timeout in executing ADB command Try restarting ADB..");
  }

  return [child?.status ?? 1, child?.stdout ?? "", child?.stderr ?? ""];
}

export { isAdbVersionSupported, isAdbInstalled, AdbConnect, AdbPair };
