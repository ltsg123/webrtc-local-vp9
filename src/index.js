import { Peer } from "./peer.js";
import { log } from "../utils/utils.js";
import "../utils/sdp_parser.js";

const type = "offer";

const localVideo = document.querySelector("#local-video");
const remoteVideo = document.querySelector("#remote-video");
const button = document.querySelector(".start-button");
const localTransceivers = [];
let localVideoTrack;

localVideo.onloadeddata = () => {
  log("播放本地视频");
  localVideo.play();
};
remoteVideo.onloadeddata = () => {
  log("播放对方视频");
  remoteVideo.play();
};
let offerPeer, answerPeer;

export async function startLive() {
  log("type", type);
  offerPeer = new Peer("offer", localVideo, remoteVideo);
  answerPeer = new Peer("answer", localVideo, remoteVideo);

  window.offerPeer = offerPeer;
  window.answerPeer = answerPeer;
  // sendMedia();
  sendScreenShare();

  button.style.display = "none";
  monitorStats();
}

let statsTrigger = undefined;
function monitorStats() {
  if (statsTrigger) {
    clearInterval(statsTrigger);
    statsTrigger = undefined;
  }
  const s_frameWidth = document.getElementById("s_frameWidth");
  const s_frameHeight = document.getElementById("s_frameHeight");
  const s_framesPerSecond = document.getElementById("s_framesPerSecond");
  const s_framesSent = document.getElementById("s_framesSent");
  const s_framesEncoded = document.getElementById("s_framesEncoded");

  const c_width = document.getElementById("c_width");
  const c_height = document.getElementById("c_height");
  const c_framesPerSecond = document.getElementById("c_framesPerSecond");

  statsTrigger = window.setInterval(() => {
    offerPeer.peer.getStats().then((stats) => {
      stats.forEach((report) => {
        if (report.type === "outbound-rtp" && report.kind === "video") {
          s_frameWidth.innerHTML = report.frameWidth;
          s_frameHeight.innerHTML = report.frameHeight;
          s_framesPerSecond.innerHTML = report.framesPerSecond;
          s_framesSent.innerHTML = report.framesSent;
          s_framesEncoded.innerHTML = report.framesEncoded;
          console.error("outbound-rtp", report);
        }
        if (report.type === "media-source" && report.kind === "video") {
          c_width.innerHTML = report.width;
          c_height.innerHTML = report.height;
          c_framesPerSecond.innerHTML = report.framesPerSecond;
          console.error("media-source", report);
        }
      });
    });
  }, 500);
}

export function updateScreenShare() {
  if (localVideoTrack) {
    const config = {
      width: +document.getElementById("screenWidth").value || 1280,
      height: +document.getElementById("screenHeight").value || 720,
      frameRate: {
        min: +document.getElementById("ScreenFrameRate_min").value || 15,
        max: +document.getElementById("ScreenFrameRate_max").value || 15,
      },
    };
    log("尝试更新本地屏幕共享", config);
    localVideoTrack.applyConstraints(config);
  }
}

export async function stopSendMedia() {
  try {
    localTransceivers.forEach((tr) => {
      tr.direction = "inactive";
      tr.stop();
    });
    offerPeer.startLive();
  } catch (e) {
    console.error("摄像头,麦克风获取失败！", e);
    return;
  }
}

export async function sendMedia() {
  try {
    log("尝试调取本地摄像头, 麦克风");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    log("摄像头,麦克风获取成功！");
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    localVideo.srcObject = stream;
    const videoTransceiver = offerPeer.peer.addTransceiver(videoTrack, {
      direction: "sendonly",
    });
    const audioTransceiver = offerPeer.peer.addTransceiver(audioTrack, {
      direction: "sendonly",
    });
    localTransceivers.push(videoTransceiver);
    localTransceivers.push(audioTransceiver);

    offerPeer.startLive();
  } catch (e) {
    console.error("摄像头,麦克风获取失败！", e);
    return;
  }
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
    offerPeer.sendMedia(videoTrack, "video");
  } catch (e) {
    console.error("摄像头获取失败！", e);
    return;
  }
}

export async function sendScreenShare() {
  const config = {
    width: +document.getElementById("screenWidth").value || 1280,
    height: +document.getElementById("screenHeight").value || 720,
  };
  log("尝试调取本地屏幕共享", config);
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: config || true,
    audio: false,
  });
  log("屏幕共享获取成功！");
  localVideoTrack = stream.getVideoTracks()[0];
  localVideo.srcObject = stream;
  offerPeer.sendMedia(localVideoTrack, "video");
}

export async function stopSendVideo() {
  try {
    log("try to stopSendVideo");
    offerPeer.stopSend("video");
  } catch (e) {
    console.error("stopSendVideo failed！", e);
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
    offerPeer.sendMedia(audioTrack, "audio");
  } catch (e) {
    console.error("麦克风获取失败！", e);
    return;
  }
}
