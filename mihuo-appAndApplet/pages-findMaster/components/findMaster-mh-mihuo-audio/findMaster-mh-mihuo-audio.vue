<template>
	<view class="speak_btn" id="myAudio" >
		<view class="speak_btn-item" @click="operation" :style="[styleObj]">
			<image src="https://www.51mihuo.com/static/icon/listen.png" />
			<view>
				<text v-if="!playStatus">点击播放</text>
				<text v-if="playStatus">点击暂停</text>
				<text>{{time}}s</text>
			</view>
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
		height: 74rpx;
		margin-top: 29rpx;
		display: flex;
		width: 100%;
		position: relative;
		.speak_btn-item{
			border-radius: 37rpx;
			background: rgba(254, 110, 50, 0.1);
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
		}
		.speak-delete{
			position: absolute;
			top: 0;
			right:0;
			padding: 20rpx;
		}
		image{
			width: 22rpx;
			height: 22rpx;
			margin-right: 14rpx;
		}
		text{
			font-size: $smallFontSize;
			font-family: PingFang SC;
			font-weight: bold;
			color: $fontColorPrice;
		}
	}
</style>
