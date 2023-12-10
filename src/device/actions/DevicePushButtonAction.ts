import { AndroidKeyEventActionType } from "../AndroidKeyEventActionType";
import { DeviceController } from "../deviceController";
import { KeyEventMessage } from "../ControlMessage";

class DevicePushButtonAction {
  public static KEY: string = "KEY";
  constructor(private controller: DeviceController, private keyCode: number) {}

  buttonPressed() {
    this.controller.sendControlMessage(
      new KeyEventMessage(
        AndroidKeyEventActionType.ACTION_DOWN,
        this.keyCode,
        0
      )
    );
  }

  buttonReleased() {
    this.controller.sendControlMessage(
      new KeyEventMessage(AndroidKeyEventActionType.ACTION_UP, this.keyCode, 0)
    );
  }

  buttonPressedAndReleased() {
    this.controller.sendControlMessage(
      new KeyEventMessage(
        AndroidKeyEventActionType.ACTION_DOWN_AND_UP,
        this.keyCode,
        0
      )
    );
  }
}
export { DevicePushButtonAction };
