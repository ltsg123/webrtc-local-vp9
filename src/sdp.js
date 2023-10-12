import "../utils/sdp_parser.js";
const { parse, print } = window["sdp-parser"];

export class RemoteSDP {
  constructor(sdp) {
    const initalSDP = parse(sdp);
    this.video = initalSDP.mediaDescriptions.find(
      (ms) => ms.media.mediaType === "video"
    );
    this.audio = initalSDP.mediaDescriptions.find(
      (ms) => ms.media.mediaType === "audio"
    );
  }
}
