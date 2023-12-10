import { AndroidKeyCodes } from "../AndroidKeyCodes";
import { DeviceController } from "../deviceController";
import { DevicePushButtonAction } from "./DevicePushButtonAction";

class DeviceHomeButtonAction extends DevicePushButtonAction {
  public static KEY: string = "HOME";
  constructor(controller: DeviceController) {
    super(controller, AndroidKeyCodes.AKEYCODE_HOME);
  }
}

export { DeviceHomeButtonAction };
