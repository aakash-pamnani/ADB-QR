import * as net from "net";
import { ControlMessage, KeyEventMessage } from "./ControlMessage";
import { AndroidKeyEventActionType } from "./AndroidKeyEventActionType";

class DeviceController {
  socket: net.Socket;
  private static controller: DeviceController | null = null;

  constructor(socket: net.Socket) {
    this.socket = socket;
  }
  static instance(socket: net.Socket): DeviceController {
    if (this.controller == null) return new DeviceController(socket);
    else return this.controller;
  }
  public sendControlMessage(message: ControlMessage) {
    console.log("sending control message" + message.type);
    message.serialize(this.socket);
  }
}
export { DeviceController };
