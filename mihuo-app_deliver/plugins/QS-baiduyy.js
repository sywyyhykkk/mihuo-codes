import configdata from "@/config/common.js"
const innerAudioContext = uni.createInnerAudioContext();
export default function playVoice(url) {
	innerAudioContext.autoplay = true;
	innerAudioContext.src = configdata.imageGlobal+url;
	console.log(innerAudioContext.src)
	innerAudioContext.onPlay(() => {
	  //console.log('开始播放');
	});
	innerAudioContext.onError((res) => {
	  console.log(res);
	});
}