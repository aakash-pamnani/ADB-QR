import * as net from "net";
import { AndroidKeyEventActionType } from "./AndroidKeyEventActionType";

class ControlMessage {
  type: number = 0;

  serialize(socket: net.Socket): Boolean {
    var bu = Buffer.alloc(1);
    bu[0] = this.type;
    return socket.write(bu);
  }
}

class KeyEventMessage extends ControlMessage {
  action: AndroidKeyEventActionType;
  keyCode: number;
  metaState: number;
  type: number = 2;

  constructor(
    action: AndroidKeyEventActionType,
    keyCode: number,
    metaState: number
  ) {
    super();
    this.action = action;
    this.keyCode = keyCode;
    this.metaState = metaState;
  }

  serialize(socket: net.Socket): Boolean {
    super.serialize(socket);
    var bu = Buffer.alloc(1);
    bu[0] = this.action;
    socket.write(bu);
    bu[0] = this.keyCode;
    socket.write(bu);
    bu[0] = this.metaState;
    return socket.write(bu);
  }
}

class StartVideoStreamMessage extends ControlMessage {
  type: number = 6;
}

class StopVideoStreamMessage extends ControlMessage {
  type: number = 7;
}

class SetMaxVideoResolutionMessage extends ControlMessage {
  type: number = 5;

  constructor(public width: number, public height: number) {
    super();
  }

  serialize(socket: net.Socket): Boolean {
    super.serialize(socket);
    var bu = Buffer.alloc(4);
    bu.writeInt32LE(this.width, 0);
    socket.write(bu);
    bu.writeInt32LE(this.height, 0);
    return socket.write(bu);
  }

  toString(): string {
    return "SetMaxVideoResolutionMessage(width=$width, height=$height)";
  }
}

export {
  ControlMessage,
  KeyEventMessage,
  SetMaxVideoResolutionMessage,
  StartVideoStreamMessage,
  StopVideoStreamMessage,
};
