import { AndroidKeyCodes } from "../AndroidKeyCodes";
import { DeviceController } from "../deviceController";
import { DevicePushButtonAction } from "./DevicePushButtonAction";

class DeviceVolumeDownButtonAction extends DevicePushButtonAction {
  public static KEY: string = "VOLUME_DOWN";
  constructor(controller: DeviceController) {
    super(controller, AndroidKeyCodes.AKEYCODE_VOLUME_DOWN);
  }
}

export { DeviceVolumeDownButtonAction };
