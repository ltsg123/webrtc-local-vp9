import { log } from "../utils/utils.js";
import "../utils/sdp_parser.js";

const { parse, print } = window["sdp-parser"];
const CODEC = "H265";

let WEBSOCKET = "ws://localhost:8080";

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
  constructor(type, element, remoteEl) {
    this.type = type;
    this.element = element;
    this.peer.ontrack = (e) => {
      if (e && e.streams) {
        const tracks = this.peer
          .getTransceivers()
          .map((trans) => trans.receiver.track);
        const mediastream = new MediaStream();
        const remoteTrack = tracks[tracks.length - 1];
        remoteTrack.onended = () => {
          console.error("onended", remoteTrack.readyState);
        };
        mediastream.addTrack(remoteTrack);
        log("收到对方音频/视频流数据...");
        remoteEl.srcObject = mediastream;
      }
    };

    this.peer.onicecandidate = (e) => {
      if (e.candidate) {
        log("搜集并发送候选人", `${type}_ice`);
        this.socket.send(
          JSON.stringify({
            type: `${this.type}_ice`,
            iceCandidate: e.candidate,
          })
        );
      } else {
        log("候选人收集完成！");
      }
    };
  }

  async initWebsocket() {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(
        document.querySelector("#wsUrl").value ?? WEBSOCKET
      );
      this.socket = socket;
      socket.onopen = () => {
        log("信令通道创建成功！");
        resolve();
      };
      socket.onerror = () => {
        log("信令通道创建失败！");
        reject("信令通道创建失败！");
      };
      socket.onmessage = (e) => {
        log("收到消息", e.data);
        const { type, sdp, iceCandidate } = JSON.parse(e.data);
        if (type === "answer") {
          this.peer.setRemoteDescription(
            new RTCSessionDescription({ type, sdp })
          );
        } else if (type === "answer_ice") {
          this.peer.addIceCandidate(iceCandidate);
        } else if (type === "offer") {
          this.startLive(new RTCSessionDescription({ type, sdp }));
        } else if (type === "offer_ice") {
          this.peer.addIceCandidate(iceCandidate);
        } else if (type === "start_live" && this.type === "offer") {
          this.pubVideo();
        }
      };
    });
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

  async startLive(offerSdp) {
    if (!offerSdp) {
      log("创建本地SDP");
      const offer = await this.peer.createOffer();
      offer.sdp = this.selectCodec(offer.sdp);
      await this.peer.setLocalDescription(offer);

      log(`传输发起方本地SDP`, offer);
      this.socket.send(JSON.stringify(offer));
    } else {
      log("接收到发送方SDP");
      await this.peer.setRemoteDescription(offerSdp);

      log("创建接收方（应答）SDP");
      const answer = await this.peer.createAnswer();
      answer.sdp = this.selectCodec(answer.sdp);

      log(`传输接收方（应答）SDP`, answer);
      this.socket.send(JSON.stringify(answer));
      await this.peer.setLocalDescription(answer);
      log("sdp之后", this.peer.connectionState);
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
