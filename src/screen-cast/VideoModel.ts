class VideoModel {
  static HEADER_SIZE: number = 40;
  static FIRST_PACKET_HEADRE_SIZE: number = 20;
  header: PacketHeader;
  videoBuffer: Buffer;

  constructor(private data: Buffer) {
    this.header = PacketHeader.parseHeader(data);
    this.videoBuffer = data.subarray(VideoModel.HEADER_SIZE);
  }
}

class PacketHeader {
  constructor(
    public width: number,
    public height: number,
    public displayOrientation: number,
    public displayOrientationCorrection: number,
    public displayRound: number,
    public packetSize: number,
    public frameNumber: bigint,
    public originationTimestampUs: bigint,
    public presentationTimestampUs: bigint
  ) {}

  static parseHeader(buffer: Buffer) {
    let offset = 0;
    // console.log(decodeURIComponent(data.toString("utf8")) + "  " + data.length);
    // console.log("width : " + buffer.readInt32LE(offset));
    var width = buffer.readInt32LE(offset);
    offset += 4;
    // console.log("height :" + buffer.readInt32LE());
    var height = buffer.readInt32LE(offset);
    offset += 4;
    // console.log("displayOrientation : " + buffer[offset]);
    var displayOrientation = buffer[offset];
    offset += 1;
    // console.log("displayOrientationCorrection : " + buffer[offset]);
    var displayOrientationCorrection = buffer[offset];
    offset += 1;
    // console.log("Display round : " + buffer.readInt16LE(offset));
    var displayRound = buffer.readInt16LE(offset);
    offset += 2;
    // console.log("packet size : " + buffer.readInt32LE(offset));
    var packetSize = buffer.readInt32LE(offset);
    offset += 4;
    // console.log("Frame Number : " + buffer.readBigInt64LE(offset));
    var frameNumber = buffer.readBigInt64LE(offset);
    offset += 8;
    // console.log("originationTimestampUs : " + buffer.readBigInt64LE(offset));
    var originationTimestampUs = buffer.readBigInt64LE(offset);
    offset += 8;
    // console.log("presentationTimestampUs : " + buffer.readBigInt64LE(offset));
    var presentationTimestampUs = buffer.readBigInt64LE(offset);
    offset += 8;

    return new PacketHeader(
      width,
      height,
      displayOrientation,
      displayOrientationCorrection,
      displayRound,
      packetSize,
      frameNumber,
      originationTimestampUs,
      presentationTimestampUs
    );
  }
}

export { VideoModel };
