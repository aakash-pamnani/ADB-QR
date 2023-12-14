import {
  AdbConnect,
  isAdbInstalled,
  isAdbVersionSupported,
} from "./adbService";
import { showError, showProgress } from "../utils";
import * as vscode from "vscode";

function connectWithPairedDevice() {
  if (!isAdbInstalled()) {
    showError(vscode.l10n.t("ADB is not installed or PATH is not Configured"));
  } else if (!isAdbVersionSupported()) {
    showError(
      vscode.l10n.t("ADB is not updated. Please update to version 32 or later")
    );
  } else {
    showProgress(vscode.l10n.t("ADB QR:Connecting..."), async () => {
      await new Promise<void>(async (resolve) => {
        await AdbConnect(null, resolve);
      });
    });
  }
}

export { connectWithPairedDevice };
