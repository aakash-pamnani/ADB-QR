import * as vscode from "vscode";

function showProgress(title: string, fun: Function): Thenable<any> {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: title,
    },
    async () => {
      await fun();
    }
  );
}
function showNotification(message: string) {
  var noti = vscode.window.showInformationMessage(message);
}

function showError(message: string) {
  vscode.window.showErrorMessage(message);
}

export { showProgress, showError, showNotification };
