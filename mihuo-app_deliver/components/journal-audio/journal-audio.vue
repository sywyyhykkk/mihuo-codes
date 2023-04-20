<template>
	<view class="speak_btn" id="myAudio" @click="operation">
		<image src="../../static/icon/listen.png" mode=""></image>
		<view>
			<text v-if="!playStatus">点击收听语音</text>
			<text v-if="playStatus" >点击暂停语音</text>
			<text v-if="time">{{time}}s</text>
		</view>
	</view>
</template>

<script>
	// 音频播放
	export default {
		props: {
			formDate: {
				type: Object,
				default: function() {
					return {};
				},
			},
		},
		data() {
			return {
				key: '',
				videoContext: '',
				playStatus: false,
				time: '',
				randomTimer: null
			}
		},
		mounted() {
			if(!this.$props.formDate){
				return
			}
			this.time = this.$props.formDate.timeLength;
			this.videoContext = uni.createInnerAudioContext('myAudio');
		},
		
		destroyed() {
			this.videoContext.stop();
			this.videoContext.destroy();
		},
		
		methods: {
			operation(){
				if(!this.$props.formDate){
					return
				}
				this.playStatus = !this.playStatus;
				if(this.playStatus){
					this.audioPlay()
				}else{
					this.audioStop()
				}
			},
			audioPlay() {
				if(!this.$props.formDate){
					return
				}
				this.videoContext.src = this.$image.imageGlobal + this.$props.formDate.url;
				this.videoContext.play();
				// this.playStatus = !this.playStatus;
				this.randomTimer = setInterval(() => {
					if(this.time === 0 || this.time === 0.5){
						clearInterval(this.randomTimer);
						this.time = this.$props.formDate.timeLength
						this.playStatus = !this.playStatus
					}else{
						this.time--
					}
				}, 1000);
			},
			audioStop() {
				if(!this.$props.formDate){
					return
				}
				this.videoContext.pause();
				clearInterval(this.randomTimer);
				this.time = this.$props.formDate.timeLength
				// this.playStatus = !this.playStatus
			}
		},
	}
</script>

<style lang="scss" scoped>
	.speak_btn{
		margin-top: 26rpx;
		box-sizing: border-box;
		border-radius: 14rpx;
		height: 88rpx;
		background: #EFF6FF;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 40rpx;
			height: 40rpx;
			margin-right: 14rpx;
		}
		text{
			font-weight: bold;
			font-size: 26rpx;
			line-height: 18px;
			color: $themeColor;
	
		}
	}
</style>
