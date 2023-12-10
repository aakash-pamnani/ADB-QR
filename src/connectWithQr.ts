import { isAdbInstalled, isAdbVersionSupported } from "./adbService";
import { startMdnsScanQr } from "./mdnsScan";
import { showError, showProgress } from "./utils";

import * as vscode from "vscode";
import * as qrCode from "qrcode";

var panel: vscode.WebviewPanel;
var password: String;

async function connectWithQr() {
  //check if adb is installed in system or not
  if (!isAdbInstalled()) {
    showError("ADB is not installed or PATH is not Configured");
  } else if (!isAdbVersionSupported()) {
    showError("ADB is not updated. Please update to version 32 or later");
  } else {
    showProgress("ADB QR: Generating QR Code", async () => {
      await showQrCodePage();
    }).then(() => {
      showProgress("ADB QR: Waiting for device to Pair...", async () => {
        await new Promise<void>((resolve) => {
          return startMdnsScanQr(password, panel, resolve);
        });
      });
    });
  }
}

async function showQrCodePage() {
  try {
    var code: String = "";

    password = Math.floor(Math.random() * 1000000 + 1).toString();
    var text = "WIFI:T:ADB;S:ADBQR-connectPhoneOverWifi;P:" + password + ";;";

    code = await qrCode.toDataURL(text, {
      type: "image/webp",
      rendererOpts: { quality: 1 },
    });

    panel = vscode.window.createWebviewPanel(
      "ADB QR",
      "ADB QR",
      vscode.ViewColumn.One,
      {}
    );

    panel.webview.html =
      '<html><body><div style="background-color:black; text-align:center; padding: 5px; height:100vh; width:100vw;">' +
      '<img margin="auto" width="20%" min-width="300px" src=' +
      code +
      ">" +
      "<br>" +
      "Scan QrCode From Android Device in <br> Settings>Developer Options>Wireless Debugging>Connect With QRCode <br> Turn Off MobileData if enabled";
    ("</div></body></html>");
    return panel;
  } catch (e) {
    console.log(e);
  }
}

export { connectWithQr, showQrCodePage };
