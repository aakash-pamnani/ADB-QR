import { AndroidKeyCodes } from "../AndroidKeyCodes";
import { DeviceController } from "../deviceController";
import { DevicePushButtonAction } from "./DevicePushButtonAction";

class DeviceVolumeUpButtonAction extends DevicePushButtonAction {
  public static KEY: string = "VOLUME_UP";
  constructor(controller: DeviceController) {
    super(controller, AndroidKeyCodes.AKEYCODE_VOLUME_UP);
  }
}

export { DeviceVolumeUpButtonAction };
