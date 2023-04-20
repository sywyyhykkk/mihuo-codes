<template>
	<view class="speak_btn" id="myAudio" >
		<view class="speak_btn-item" @click="operation">
			<!-- <mihuo-image class="image" src="https://www.51mihuo.com/static/images/myHome/sound.png" /> -->
			<u-icon name="wifi" class="image"></u-icon>
			<text>{{time}}″</text>
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
			styleObj: {
				type: Object,
				default: function() {
					return {};
				},
			},
			isShow:{
				type:Boolean,
				default:()=>true
			}
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
		margin-top: 20rpx;
		display: flex;
		width: 100%;
		position: relative;
		.speak_btn-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #FE6E32;
			padding: 10rpx 20rpx;
			border-radius: 40rpx;
			width: 150rpx;
		}
		.speak-delete{
			position: absolute;
			top: 0;
			right:0;
			padding: 20rpx;
		}
		.image{
			width: 30rpx;
			height: 30rpx;
			transform: rotate(90deg);
		}
		text{
			font-size: $smallFontSize;
			font-family: PingFang SC;
			color: #000000;
		}
	}
</style>
