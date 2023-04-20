<template>
	<view class="audio-page" @click.stop="">
		<view class="audio" :id=" 'myAudio' + audioIndex" @click="operation()">
			<view class="play-animation">
				<view class="play-animation-line" :class="[playAnimation?'play-animation-line-active':'']"
					v-for="item in  5" :key="item">
				</view>
			</view>
			<view v-if="!isPlaying" class="audio_text">点击收听语音</view>
			<view v-if="isPlaying" class="audio_text">点击暂停语音</view>
			<view class="audio_time" v-if="audioContext">{{ leftTime }}s</view>
		</view>
	</view>
</template>

<script>
	// 音频播放
	import {
		mapState,
	} from 'vuex'
	export default {
		props: {
			formData: {
				type: '',
				default: '',
			},
			audioIndex: {
				type: [Number, String],
				default: 0,
			},
			refAudioList: { // 语音实例集合
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				leftTime: 0,
				duration: 0,
				audioContext: null,
				isPlaying: false,
				formDataObject: {},
				playAnimation: false,
				mihuoAudioList: []
			}
		},
		destroyed() {
			if (this.audioContext) {
				this.audioContext.stop();
				this.audioContext.destroy();
				// 取消监听
				this.audioContext.offCanplay()
				this.audioContext.offPlay()
				this.audioContext.offTimeUpdate()
				this.audioContext.offPause()
				this.audioContext.onEnded()
			}
			this.playAnimation = false
		},
		computed: {
		},
		mounted() {
			if (!this.formData) {
				return
			}
			if (typeof this.formData === 'object') {
				this.formDataObject = this.formData
			} else {
				this.formDataObject = this.formData !== '' && JSON.parse(this.formData)
			}
			
			this.audioContext = uni.createInnerAudioContext('myAudio' + this.audioIndex);
			this.audioContext.src = this.$image.imageGlobal + this.formDataObject.url;
			
			// 加载完成
			this.audioContext.onCanplay(() => {
				if(this.audioContext.duration == 'Infinity'){
					// 拿到的录音数据流没有定义长度，所以浏览器无法解析出当前音频的时长。
					this.duration = this.formDataObject.timeLength
					this.leftTime = this.formDataObject.timeLength
				}else{
					this.duration = this.audioContext.duration
					this.leftTime = this.audioContext.duration.toFixed(0) 
				}
				
			})
			// 开始播放
			this.audioContext.onPlay(() => {
				this.isPlaying = true
			})
			// 播放中
			this.audioContext.onTimeUpdate(() => {
				let time = this.audioContext.currentTime
				this.leftTime = (this.duration - time).toFixed(0)
			})
			// 暂停
			this.audioContext.onPause(() => {
				this.isPlaying = false
				this.playAnimation = false
			})
			// 结束播放
			this.audioContext.onEnded(() => {
				this.isPlaying = false
				this.playAnimation = false
				this.leftTime = this.duration.toFixed(0)
			})
			this.getCurrentAudioList()
		},
		methods: {
			getCurrentAudioList() {
				setTimeout(() => {
					this.mihuoAudioList = this.refAudioList
				}, 500)
			},
			operation() {
				if (!this.formDataObject) {
					return
				}
				
				if (this.audioContext.paused) {
					this.audioContext.play()
					this.playAnimation = true
				} else {
					this.audioContext.pause()
					this.playAnimation = false
				}
				this.getCloseAudio()
			},
			getCloseAudio() {
				if (this.mihuoAudioList.length > 0) {
					this.mihuoAudioList.forEach(el => {
						if (el.audioIndex !== this.audioIndex) {
							el.audioContext.stop()
							el.playAnimation = false
							el.leftTime = el.duration.toFixed(0)
							el.isPlaying = false
						} else {
							el.playAnimation = true
						}
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.audio-page {
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 10rpx;
		background: #EFF6FF;


		.audio {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.voice_image {
			width: 40rpx;
			height: 30rpx;
			margin-right: 20rpx;
		}

		.audio_time {
			float: left;
			width: 80rpx;
			text-align: center;
			color: #002FA5;
			font-size: 24rpx;
		}

		.audio_text {
			float: left;
			text-align: center;
			// width: calc(100% - 280rpx);
			color: #002FA5;
			font-size: 26rpx;
		}
	}

	.play-animation {
		margin-right: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.play-animation-line {
			height: 20rpx;
			width: 4rpx;
			margin: 0 5rpx;
			background: #002FA5;
			border-radius: 4rpx;
			transition: all 0.2s ease;

			&:nth-of-type(1),
			&:nth-of-type(3) {
				height: 20rpx;
			}

			&:nth-of-type(2),
			&:nth-of-type(4) {
				height: 38rpx;
			}
		}

		.play-animation-line-active {
			height: 20rpx;
			width: 4rpx;
			margin: 0 5rpx;
			background: #002FA5;
			border-radius: 4rpx;
			transition: all 0.2s ease-in;

			&:nth-of-type(1) {
				height: 20rpx;
				animation: play135 0.8s infinite ease-in;
			}

			&:nth-of-type(3) {
				height: 20rpx;
				animation: play135 1s infinite ease-in;
			}

			&:nth-of-type(5) {
				height: 20rpx;
				animation: play135 1s infinite ease-in;
			}

			&:nth-of-type(2) {
				height: 38rpx;
				animation: play24 0.8s infinite ease-in;
			}

			&:nth-of-type(4) {
				height: 38rpx;
				animation: play24 1s infinite ease-in;
			}

			@keyframes play135 {
				0% {
					height: 20rpx;
				}

				50% {
					height: 36rpx;
				}

				100% {
					height: 20rpx;
				}
			}

			@keyframes play24 {
				0% {
					height: 38rpx;
				}

				50% {
					height: 24rpx;
				}

				100% {
					height: 38rpx;
				}
			}
		}
	}
</style>
