import * as vscode from "vscode";

//Method To show Progeress Notification in VSCODE
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
//Method To show Notification in VSCODE
function showNotification(message: string) {
  var noti = vscode.window.showInformationMessage(message);
}
//Method To show error in VSCODE
function showError(message: string) {
  vscode.window.showErrorMessage(message);
}

export { showProgress, showError, showNotification };
