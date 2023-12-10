import * as beamcoder from "beamcoder";

var packet: beamcoder.Packet;
var pendingPacket: beamcoder.Packet;
var hasPendingPacket: boolean = false;

function prepareVideo(dec: beamcoder.Decoder, pac: beamcoder.Packet) {
  packet = pac;
  packet = buildPacket(false);
  decodeVideo(dec, packet);
  afterDecode(dec);
}

async function decodeVideo(dec: beamcoder.Decoder, packet: beamcoder.Packet) {
  // Create a demuxer for the data\
  try {
    let decResult = await dec.decode(packet); // Decode the frame
    if (decResult.frames.length === 0) {
      // Frame may be buffered, so flush it out

      decResult = await dec.flush();
      return;
    }
    // Filtering could be used to transform the picture here, e.g. scaling
    let enc = beamcoder.encoder({
      // Create an encoder for JPEG data
      name: "mjpeg", // FFmpeg does not have an encoder called 'jpeg'
      width: dec.width,
      height: dec.height,
      pix_fmt: dec.pix_fmt!.indexOf("422") >= 0 ? "yuvj422p" : "yuvj420p",
      time_base: [1, 1],
    });
    enc.encode(decResult.frames[0]);
    let jpegResult = enc.encode(decResult.frames[0]).then((jpegResult) => {
      enc.flush(); // Tidy the encoder // Set the Content-Type of the data
      var buffer: Buffer = Buffer.from(jpegResult.packets[0].data);
      console.log(buffer.toString("base64"));
      // console.log(jpegResult.packets[0].data.toString("base64"));
    }); // Encode the frame
  } catch (e) {
    console.log("Error in decoding");
    console.log(e);
  }
}
export { prepareVideo };

function buildPacket(isConfig: boolean): beamcoder.Packet {
  var packetToProcess = packet;
  var offset: number;

  // A config packet must not be decoded immediately (it contains no frame).
  // Instead, it must be concatenated with the future data packet.
  if (hasPendingPacket || isConfig) {
    if (hasPendingPacket) {
      // offset = pendingPacket.size()
      // if (av_grow_packet(pendingPacket, packet.size()) != 0) {
      //   throw VideoDecoderException("Could not grow packet")
      // }
    } else {
      offset = 0;
      // if (av_new_packet(pendingPacket, packet.size()) != 0) {
      //   throw VideoDecoderException("Could not create packet")
      // }
      hasPendingPacket = true;
    }
    // memcpy(pendingPacket.data().position(offset.toLong()), packet.data(), packet.size().toLong())
    var newSize = pendingPacket.size + packet.size;
    var newBuffer: Buffer = Buffer.alloc(newSize);
    newBuffer.fill(pendingPacket.data);
    newBuffer.fill(packet.data, pendingPacket.size);
    pendingPacket = packet;
    pendingPacket.data = newBuffer;
    pendingPacket.size = newSize;
    if (!isConfig) {
      // Prepare the concatenated packet to send to the decoder.
      pendingPacket.pts = packet.pts;
      pendingPacket.dts = packet.dts;
      // pendingPacket.flags(packet.flags())
      packetToProcess = pendingPacket;
    }
  }
  return packetToProcess;
}

function afterDecode(dec: beamcoder.Decoder) {
  if (hasPendingPacket) {
    // The pending packet must be discarded.
    hasPendingPacket = false;
    if (pendingPacket != packet) {
      // pendingPacket=null;
    }
  }
}
