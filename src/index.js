import { Peer } from "./peer.js";
import { log } from "../utils/utils.js";
import { getQueryVariable } from "../utils/utils.js";

const type = getQueryVariable("type");

const localVideo = document.querySelector("#local-video");
const remoteVideo = document.querySelector("#remote-video");
const button = document.querySelector(".start-button");

localVideo.onloadeddata = () => {
  log("播放本地视频");
  localVideo.play();
};
remoteVideo.onloadeddata = () => {
  log("播放对方视频");
  remoteVideo.play();
};
let offerPeer, answerPeer;
window.offerPeer = offerPeer;
window.answerPeer = answerPeer;

export async function startLive() {
  log("type", type);
  if (type === "offer") {
    offerPeer = new Peer("offer", localVideo, remoteVideo);
    await offerPeer.initWebsocket();
  } else {
    answerPeer = new Peer("answer", localVideo, remoteVideo);
    await answerPeer.initWebsocket();
  }
  button.style.display = "none";
}

export async function sendVideo() {
  try {
    log("尝试调取本地摄像头");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    log("摄像头获取成功！");
    const videoTrack = stream.getVideoTracks()[0];
    localVideo.srcObject = stream;
    offerPeer.peer.addTransceiver(videoTrack, {
      direction: "sendonly",
    });
    (offerPeer ?? answerPeer).startLive();
  } catch (e) {
    console.error("摄像头获取失败！", e);
    return;
  }
}

export async function sendAudio() {
  try {
    console.log("尝试调取本地麦克风");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    console.log("麦克风获取成功！", stream);
    const audioTrack = stream.getAudioTracks()[0];
    offerPeer.peer.addTransceiver(audioTrack, {
      direction: "sendonly",
    });
    startLive();
  } catch (e) {
    console.error("麦克风获取失败！", e);
    return;
  }
}
