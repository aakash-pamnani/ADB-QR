import * as vscode from "vscode";
import { connectWithPairedDevice } from "./service/connectWithPairedDevice";
import { connectWithPairingCode } from "./service/connectWithPairingCode";
import { connectWithQr } from "./service/connectWithQr";

//TODO: add l10n to all files
//TODO: extract string to constant in all files
export function activate(context: vscode.ExtensionContext) {
  // const readmePath = context.asAbsolutePath("README.md");
  // vscode.commands.executeCommand(
  //   "markdown.showPreview",
  //   vscode.Uri.file(readmePath)
  // );

  //Command to connect with QR Code
  let connectWithQrDisposible = vscode.commands.registerCommand(
    "adb-qr.connect_with_qr",
    async function () {
      const message = vscode.l10n.t("Hello");
      vscode.window.showInformationMessage(message);
      console.log(context.extensionUri);
      connectWithQr();
    }
  );

  //Command to connect with Pairing code
  let connectWithCodeDisposible = vscode.commands.registerCommand(
    "adb-qr.connect_with_pairing_code",
    function () {
      connectWithPairingCode();
    }
  );

  //Command to connect Paired Devices
  let connectWithpairedDeviceDisposible = vscode.commands.registerCommand(
    "adb-qr.connect_with_paired_device",
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
