import {
  addReversePortForward,
  copyFileToAndroid,
  startScreenSharingJarMainClass,
} from "../adbService";
import * as net from "net";
import * as vscode from "vscode";
import * as fs from "fs";

import { DeviceController } from "../device/deviceController";
import { attachListenerToPanel } from "./OnClickAction";
import { processControlSocket, processVideoSocket } from "./processChannel";
import {
  SetMaxVideoResolutionMessage,
  StartVideoStreamMessage,
  StopVideoStreamMessage,
} from "../device/ControlMessage";
import { VideoModel } from "./VideoModel";
class ScreenCast {
  constructor(private assetsPath: string) {}
  static jarFileName: string = "screen-sharing-agent.jar";
  static soFileName: string = "libscreen-sharing-agent.so";

  public async start(context: vscode.ExtensionContext) {
    //TODO: crate terminal and then hide it
    console.log("ScreenCast started");
    // this.assetsPath.replace("\\\\/g", "/");
    copyFileToAndroid(this.assetsPath + ScreenCast.jarFileName);
    copyFileToAndroid(this.assetsPath + ScreenCast.soFileName);
    addReversePortForward();
    //TODO:killreverseforwarding
    // this.startServer(context, this);
    this.createWebView(context);
    fetch("http://localhost:8081/stream/start-server?port=1234");
    var timer: NodeJS.Timeout = setTimeout(() => {
      console.log(startScreenSharingJarMainClass());
    }, 1000);
  }

  public createWebView(context: vscode.ExtensionContext): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      "catCoding", // Identifies the type of the webview. Used internally
      "Cat Coding", // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        // Enable scripts in the webview
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(this.assetsPath)],
      } // Webview options. More on these later.
    );

    var path = context.asAbsolutePath("src/screen-cast/index.html");
    const filePath: vscode.Uri = vscode.Uri.file(path);
    var htmlFile = fs.readFileSync(filePath.fsPath, "utf8");
    panel.webview.html = htmlFile;

    panel.onDidDispose(()=>{
      fetch("http://localhost:8081/stream/stop-server?port=1234");
    });

    return panel;
  }

  public startServer(context: vscode.ExtensionContext, screenCast: ScreenCast) {
    let counter = 0;
    var videoSocket: net.Socket;
    var controlSocket: net.Socket;
    var panel: vscode.WebviewPanel;
    var sockets: Map<string, net.Socket> = new Map<string, net.Socket>();

    var server = net
      .createServer(function (sock: net.Socket) {
        console.log(
          "CONNECTED: " +
            sock.remoteAddress +
            ":" +
            sock.remotePort +
            "Counter : " +
            counter
        );
        sockets.set((sock.remotePort ?? "").toString(), sock);
        var controller: DeviceController;

        sock.once("data", function (data: Buffer) {
          console.log(
            "DATA " + sock.remotePort + " : " + data.toString("base64")
          );
          videoSocket = sock;
          // var videoModel = new VideoModel(data);
          // console.log(videoModel);
          sockets.delete((sock.remotePort ?? "").toString());
          controlSocket = sockets.values().next().value;

          //video socket\
          panel = screenCast.createWebView(context);
          processVideoSocket(videoSocket, panel);

          //control socket
          controller = DeviceController.instance(controlSocket);
          // controller.sendControlMessage(
          //   new SetMaxVideoResolutionMessage(0, 0)
          // );
          controller.sendControlMessage(new StartVideoStreamMessage());
          attachListenerToPanel(panel, controller);
          processControlSocket(controlSocket);
        });

        // Add a 'close' event handler to this instance of socket
        sock.on("close", function (data: any) {
          console.log("CLOSED: " + sock.remoteAddress + " " + sock.remotePort);
        });
      })
      .listen(1234, "127.0.0.1");
    server.maxConnections = 2;
    server.getConnections((err, count) => {
      console.log("Number of concurrent connections to the server : " + count);
    });
    console.log("Server listening on " + 1234 + ":" + "127.0.0.1");
  }

  public stop() {
    console.log("ScreenCast stopped");
  }

  public onDataReceived(data: Buffer) {
    console.log("data received");
  }
}

export { ScreenCast };
