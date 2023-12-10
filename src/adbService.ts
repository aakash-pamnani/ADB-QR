import bonjour = require("bonjour");
import {  spawn, spawnSync } from "child_process";

import { MdnsDeviceData } from "./mdnsDeviceData";
import { showError, showNotification, showProgress } from "./utils";

let devicePath: string = "/data/local/tmp/.studio/";

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

function copyFileToAndroid(path: string): boolean {
  try {
    var commandOutput = executeCommand('adb push "' + path + '" ' + devicePath);
    console.log("Output was:\n", commandOutput);

    if (commandOutput[0] == 0) {
      var output: string = commandOutput[1]?.toString() ?? "";
      return true;
    } else {
      showError("ADB Qr " + commandOutput[2]);
      return false;
    }
  } catch (e) {
    console.log("Unable to transfer jar file", e);
    showError("ADB QR: Something Went Wrong");
    return false;
  }
}

function addReversePortForward(): boolean {
  try {
    var commandOutput = executeCommand(
      "adb reverse localabstract:screen-sharing-agent tcp:1234"
    );
    console.log("Output was:\n", commandOutput);

    if (commandOutput[0] == 0) {
      var output: string = commandOutput[1]?.toString() ?? "";
      return true;
    } else {
      showError("ADB Qr " + commandOutput[2]);
      return false;
    }
  } catch (e) {
    console.log("Unable to reverse port", e);
    showError("ADB QR: Something Went Wrong");
    return false;
  }
}

async function startScreenSharingJarMainClass(): Promise<boolean> {
  try {
    var commandOutput = await executeCommandAsync(
      "adb shell CLASSPATH=/data/local/tmp/.studio/screen-sharing-agent.jar app_process /data/local/tmp/.studio com.android.tools.screensharing.Main"
    );
    console.log("Output was:\n", commandOutput);
    // var terminal = vscode.window.createTerminal({
    //   name: `Ext Terminal +}`,
    //   hideFromUser: false,
    // } as any);

    // terminal.sendText(
    //   "adb shell CLASSPATH=/data/local/tmp/.studio/screen-sharing-agent.jar app_process /data/local/tmp/.studio com.android.tools.screensharing.Main"
    // );

    // console.log(terminal.exitStatus);
    // console.log(terminal.state);

    // if (commandOutput[0] == 0) {
    //   var output: string = commandOutput[1]?.toString() ?? "";
    return true;
    // } else {
    // showError("ADB Qr " + commandOutput[2]);
    // return false;
    // }
  } catch (e) {
    console.log("Unable to reverse port", e);
    showError("ADB QR: Something Went Wrong");
    return false;
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

function executeCommandAsync2(command: string) {
  // return new Promise((resolve, reject) => {
  var data = spawnSync(command);
}

async function executeCommandAsync(command: string) {
  var child;
  try {
    child = await spawn(command, {
      timeout: 3000000,
      shell: true,
    });
  } catch (e) {
    console.log(e);
    showError("ADB-QR: Timeout in executing ADB command Try restarting ADB..");
  }

  return [child ?? 1, child ?? "", child ?? ""];
}

export {
  isAdbVersionSupported,
  isAdbInstalled,
  AdbConnect,
  AdbPair,
  copyFileToAndroid,
  addReversePortForward,
  startScreenSharingJarMainClass,
};
