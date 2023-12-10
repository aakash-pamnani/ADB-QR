import { AndroidKeyCodes } from "../AndroidKeyCodes";
import { DeviceController } from "../deviceController";
import { DevicePushButtonAction } from "./DevicePushButtonAction";

class DeviceBackButtonAction extends DevicePushButtonAction {
  public static KEY: string = "BACK";
  constructor(controller: DeviceController) {
    super(controller, AndroidKeyCodes.AKEYCODE_BACK);
  }
}

export { DeviceBackButtonAction };
