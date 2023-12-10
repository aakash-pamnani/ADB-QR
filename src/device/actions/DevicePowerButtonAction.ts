import { AndroidKeyCodes } from "../AndroidKeyCodes";
import { DeviceController } from "../deviceController";
import { DevicePushButtonAction } from "./DevicePushButtonAction";

class DevicePowerButtonAction extends DevicePushButtonAction {
  public static KEY: string = "POWER";
  constructor(controller: DeviceController) {
    super(controller, AndroidKeyCodes.AKEYCODE_POWER);
  }
}

export { DevicePowerButtonAction };
