import * as vscode from "vscode";
import { DevicePushButtonAction } from "../device/actions/DevicePushButtonAction";
import { DeviceBackButtonAction } from "../device/actions/DeviceBackButtonAction";
import { DeviceController } from "../device/deviceController";
import { DeviceHomeButtonAction } from "../device/actions/DeviceHomeButtonAction";
import { DeviceOverviewButtonAction } from "../device/actions/DeviceOverviewButtonAction";
import { DevicePowerButtonAction } from "../device/actions/DevicePowerButtonAction";
import { DeviceVolumeUpButtonAction } from "../device/actions/DeviceVolumeUpButtonAction";
import { DeviceVolumeDownButtonAction } from "../device/actions/DeviceVolumeDownButtonAction";

function attachListenerToPanel(
  panel: vscode.WebviewPanel,
  deviceController: DeviceController
) {
  var backButtonAction: DevicePushButtonAction = new DeviceBackButtonAction(
    deviceController
  );
  var homeButtonAction: DevicePushButtonAction = new DeviceHomeButtonAction(
    deviceController
  );
  var overviewButtonAction: DeviceOverviewButtonAction =
    new DeviceOverviewButtonAction(deviceController);
  var powerButtonAction: DevicePushButtonAction = new DevicePowerButtonAction(
    deviceController
  );
  var volumeUpButtonAction: DevicePushButtonAction =
    new DeviceVolumeUpButtonAction(deviceController);
  var volumeDownButtonAction: DevicePushButtonAction =
    new DeviceVolumeDownButtonAction(deviceController);

  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case DeviceBackButtonAction.KEY:
        backButtonAction.buttonPressedAndReleased();
        break;
      case DeviceHomeButtonAction.KEY:
        homeButtonAction.buttonPressedAndReleased();
        break;
      case DeviceOverviewButtonAction.KEY:
        overviewButtonAction.buttonPressedAndReleased();
        break;
      case DevicePowerButtonAction.KEY:
        powerButtonAction.buttonPressedAndReleased();
        break;
      case DeviceVolumeUpButtonAction.KEY:
        volumeUpButtonAction.buttonPressedAndReleased();
        break;
      case DeviceVolumeDownButtonAction.KEY:
        volumeDownButtonAction.buttonPressedAndReleased();
        break;
    }
  });
}

export { attachListenerToPanel };
