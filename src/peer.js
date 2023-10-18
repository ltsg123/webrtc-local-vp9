import { log, getRandomString } from "../utils/utils.js";
import "../utils/sdp_parser.js";

const { parse, print } = window["sdp-parser"];
const CODEC = "VP9";

const PeerConnection =
  self.RTCPeerConnection ||
  self.mozRTCPeerConnection ||
  self.webkitRTCPeerConnection;
!PeerConnection && console.error("浏览器不支持WebRTC！");

export class Peer {
  peer = new PeerConnection();
  socket;
  channel;
  isFirst = false;
  answer;
  remoteSDP;
  enc = new TextEncoder();
  transceiverMap = new Map();
  constructor(type, element, remoteEl) {
    this.type = type;
    this.element = element;
    if (type === "answer") {
      this.peer.ontrack = (e) => {
        if (e && e.streams) {
          const tracks = this.peer
            .getTransceivers()
            .map((trans) => trans.receiver.track);
          const mediastream = new MediaStream([tracks[tracks.length - 1]]);

          log("收到对方音频/视频流数据...");
          remoteEl.srcObject = mediastream;
        }
      };
    }

    this.peer.onicecandidate = (e) => {
      if (e.candidate) {
        log("搜集并发送候选人", `${type}_ice`);
        this.type === "offer"
          ? answerPeer.peer.addIceCandidate(e.candidate)
          : offerPeer.peer.addIceCandidate(e.candidate);
      } else {
        log("候选人收集完成！");
      }
    };

    this.peer.onconnectionstatechange = (state) => {
      if (this.peer.connectionState === "connected") {
        this.peer.onicecandidate = null;
        console.log("[webapp] pc connected");
      }
    };
  }

  async pubVideo() {
    log("尝试调取本地摄像头");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    log("摄像头获取成功！");
    const videoTrack = stream.getVideoTracks()[0];
    this.element.srcObject = stream;
    this.peer.addTransceiver(videoTrack, {
      direction: "sendonly",
    });
    this.startLive();
  }

  async connect() {
    const videoTransceiver = this.peer.addTransceiver("video", {
      direction: "sendonly",
    });
    const audioTransceiver = this.peer.addTransceiver("audio", {
      direction: "sendonly",
    });
    await this.startLive();
  }

  async startLive(offerSdp) {
    if (!offerSdp) {
      log("创建本地SDP");
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      const sessionDesc = parse(offer.sdp);
      offer.sdp = print(sessionDesc);
      log(`传输发起方本地SDP`, offer);

      answerPeer.startLive(offer);
    } else {
      log("接收到发送方SDP");
      await this.peer.setRemoteDescription(offerSdp);

      log("创建接收方（应答）SDP");
      const answer = await this.peer.createAnswer();
      answer.sdp = this.selectCodec(answer.sdp);

      log(`传输接收方（应答）SDP`, answer);
      await this.peer.setLocalDescription(answer);
      const sessionDesc = parse(answer.sdp);
      answer.sdp = print(sessionDesc);
      offerPeer.peer.setRemoteDescription(answer);
      log("sdp之后", this.peer.connectionState);
    }
  }

  async sendMedia(track, kind) {
    if (this.transceiverMap.has(kind)) {
      throw new Error(`has track in kind ${kind}`);
    }
    const transceiver = this.peer.addTransceiver(track, {
      direction: "sendonly",
    });
    this.transceiverMap.set(kind, transceiver);
    this.startLive();
  }

  async stopSend(kind) {
    const transceiver = this.transceiverMap.get(kind);
    if (transceiver) {
      transceiver.stop();
      this.transceiverMap.delete(kind);
      log("stop send kind", kind);
      this.startLive();
    }
  }

  selectCodec(sdp) {
    const codec = document.querySelector("#videoCodec").value ?? CODEC;
    log("select codec : ", codec);
    const sdpParser = parse(sdp);
    const mediaDesc = sdpParser.mediaDescriptions.find(
      (ms) => ms.media.mediaType === "video"
    );
    if (!mediaDesc) {
      return sdp;
    }

    const codecIndex = mediaDesc.attributes.payloads.findIndex(
      (py) => py.rtpMap?.encodingName === codec.toUpperCase()
    );

    if (codecIndex === -1) {
      log("cannot find codec :" + codec);
      return sdp;
    }
    const mediaIndex = mediaDesc.media.fmts.findIndex(
      (pt) => +pt === mediaDesc.attributes.payloads[codecIndex].payloadType
    );

    if (mediaIndex === -1) {
      log("cannot find media :" + codec);
      return sdp;
    }
    const temp = mediaDesc.attributes.payloads[0];
    mediaDesc.attributes.payloads[0] =
      mediaDesc.attributes.payloads[codecIndex];
    mediaDesc.attributes.payloads[codecIndex] = temp;

    const temp2 = mediaDesc.media.fmts[0];
    mediaDesc.media.fmts[0] = mediaDesc.media.fmts[mediaIndex];
    mediaDesc.media.fmts[mediaIndex] = temp2;

    return print(sdpParser);
  }
}
