import { isAdbInstalled, isAdbVersionSupported } from "./adbService";
import { startMdnsScanQr } from "../mdns/mdnsScan";
import { showError, showProgress } from "../utils";

import * as vscode from "vscode";
import * as qrCode from "qrcode";

var panel: vscode.WebviewPanel;
var password: String;

async function connectWithQr() {
  //check if adb is installed in system or not
  if (!isAdbInstalled()) {
    showError(vscode.l10n.t("ADB is not installed or PATH is not Configured"));
  } else if (!isAdbVersionSupported()) {
    showError(
      vscode.l10n.t("ADB is not updated. Please update to version 32 or later")
    );
  } else {
    showProgress(vscode.l10n.t("ADB QR: Generating QR Code"), async () => {
      await showQrCodePage();
    }).then(() => {
      showProgress(
        vscode.l10n.t("ADB QR: Waiting for device to Pair..."),
        async () => {
          await new Promise<void>((resolve) => {
            return startMdnsScanQr(password, panel, resolve);
          });
        }
      );
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
      vscode.l10n.t("ADB QR"),
      vscode.l10n.t("ADB QR"),
      vscode.ViewColumn.One,
      {}
    );

    panel.webview.html = Constants.WEBVIEW_HTML(code);
    return panel;
  } catch (e) {
    console.log(e);
  }
}

export { connectWithQr, showQrCodePage };
