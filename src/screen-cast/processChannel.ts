import * as net from "net";
import * as vscode from "vscode";
import { VideoModel } from "./VideoModel";
import * as Beamcoder from "beamcoder";
import { prepareVideo } from "../utils/VideoDecoder";
async function processVideoSocket(
  videoSocket: net.Socket,
  panel: vscode.WebviewPanel
) {
  let isFirstPackage = true;
  var videoModel: VideoModel;
  let dec = Beamcoder.decoder({ name: "vp8" }); // Create a decoder

  // var options: Beamcoder.DemuxerCreateOptions = { iformat: {name:"",} };
  // let dm = await Beamcoder.demuxer("");

  videoSocket.on("data", function (data: Buffer) {
    videoModel = new VideoModel(data);

    if (isFirstPackage) {
      isFirstPackage = false;
      // if (videoModel.header.frameNumber.toString() == "5") {
      // console.log(data.toString("base64"));
      console.log(videoModel);
      // console.log(data.toString("base64"));
      // }
    } else {
      // if (videoModel.header.frameNumber.toString() == "5") {
      //   console.log(data.toString("base64"));
      //   console.log(videoModel.header);
      //   console.log(data.toString("base64"));
      // }
      // console.log(videoModel.header.presentationTimestampUs.toString());
      if (Number(videoModel.header.presentationTimestampUs) == 0) {
        console.log("Config Packet");
        console.log(videoModel.header);
      }
      if (
        videoModel.header.presentationTimestampUs < 0 ||
        videoModel.header.packetSize <= 0
      ) {
        return;
      }

      let packet = Beamcoder.packet({
        data: videoModel.videoBuffer,
        size: videoModel.header.packetSize,
        pts: Number(videoModel.header.presentationTimestampUs),
        frameNumber: Number(videoModel.header.frameNumber),
        height: videoModel.header.height,
        width: videoModel.header.width,
        packetSize: videoModel.header.packetSize,
        // stream_index: Number(videoModel.header.frameNumber),
      });
      prepareVideo(dec, packet);
      if (videoModel.header.frameNumber <= 20) {
      }
      // panel.webview.postMessage({
      //   command: "frame",
      //   data: {
      //     width: videoModel.header.width,
      //     height: videoModel.header.height,
      //     data: videoModel.videoBuffer,
      //   },
      // });
    }
  });
}

function processControlSocket(controlSocket: net.Socket) {
  controlSocket.on("data", function (data: Buffer) {
    console.log("Control Socket : " + controlSocket.remotePort + " " + data);
  });
}

export { processVideoSocket, processControlSocket };
