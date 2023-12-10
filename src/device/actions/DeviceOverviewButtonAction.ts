import { AndroidKeyCodes } from "../AndroidKeyCodes";
import { DeviceController } from "../deviceController";
import { DevicePushButtonAction } from "./DevicePushButtonAction";

class DeviceOverviewButtonAction extends DevicePushButtonAction {
  public static KEY: string = "OVERVIEW";
  constructor(controller: DeviceController) {
    super(controller, AndroidKeyCodes.AKEYCODE_APP_SWITCH);
  }
}

export { DeviceOverviewButtonAction };
