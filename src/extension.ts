import * as vscode from "vscode";
import { connectWithPairedDevice } from "./connectWithPairedDevice";
import { connectWithPairingCode } from "./connectWithPairingCode";
import { connectWithQr } from "./connectWithQr";

export function activate(context: any) {
  // const readmePath = context.asAbsolutePath("README.md");
  // vscode.commands.executeCommand(
  //   "markdown.showPreview",
  //   vscode.Uri.file(readmePath)
  // );

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

  context.subscriptions.push(connectWithCodeDisposible);
  context.subscriptions.push(connectWithQrDisposible);
  context.subscriptions.push(connectWithpairedDeviceDisposible);
}

// this method is called when your extension is deactivated
export function deactivate() {}
