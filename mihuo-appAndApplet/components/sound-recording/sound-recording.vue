<template>
	<view class="content-sound">
		<view v-if="iconIsChange" style="display:flex;flex-direction: column;">
			<view class="get-sound" v-if="!isConfirmed" style="width:80%;margin-left: 20%;" @click="showRecording">
				<u-image class="sound-icon" style="float:right" width="26rpx" height="26rpx"
					src="https://www.51mihuo.com/static/images/microphone.png">
				</u-image>
			</view>
			<view class="record-file" v-else @click="showRecording"
				style="width: 100%;justify-content: space-between;padding: 0 20rpx;margin-top: 0;">
				<image v-if="!playing" src="https://www.51mihuo.com/static/images/record/play_icon.png"
					class="play-icon" @click.stop="playVoice">
				</image>
				<image v-else src="https://www.51mihuo.com/static/images/record/pause_icon.png" class="play-icon"
					@click.stop="pauseVoice" />
				<view class="record-mini">
					<view class="mini-line" :class="{'mini-line-active': playing}" v-for="item in 11" :key="item">
					</view>
				</view>
				<view class="text" v-if="isConfirmed">
					{{ confirmedLeftTime.toFixed(1) + 's' }}
				</view>
				<image src="https://www.51mihuo.com/static/images/record/delete.png" class="delete-icon"
					@click.stop="clear"></image>
			</view>
		</view>
		<view v-else>
			<view class="get-sound" v-if="!isConfirmed" @click="showRecording">
				<u-image class="sound-icon" width="26rpx" height="26rpx"
					src="https://www.51mihuo.com/static/images/microphone.png">
				</u-image>
				<text class="button-text">上传录音</text>
			</view>
			<view class="record-file" v-else @click="showRecording"
				style="width: 100%;justify-content: space-between;padding: 0 20rpx;margin-top: 0;">
				<image v-if="!playing" src="https://www.51mihuo.com/static/images/record/play_icon.png"
					class="play-icon" @click.stop="playVoice">
				</image>
				<image v-else src="https://www.51mihuo.com/static/images/record/pause_icon.png" class="play-icon"
					@click.stop="pauseVoice" />
				<view class="record-mini">
					<view class="mini-line" :class="{'mini-line-active': playing}" v-for="item in 11" :key="item">
					</view>
				</view>
				<view class="text" v-if="isConfirmed">
					{{ confirmedLeftTime.toFixed(1) + 's' }}
				</view>
				<image src="https://www.51mihuo.com/static/images/record/delete.png" class="delete-icon"
					@click.stop="clear"></image>
			</view>
		</view>
		<u-popup v-model="isShow" mode="bottom" border-radius="20" closeable close-icon="close-circle" :duration="0"
			:maskCustomStyle="{background: 'rgba(0, 0, 0, 0.6)'}" close-icon-size="48" :safe-area-inset-bottom="true"
			@close="onClose" height="450">
			<view class="popup">
				<view class="popup-title">
					{{ currentTitle }}
				</view>
				<view class="record-container">
					<!-- 未开始录音 -->
					<image src="https://www.51mihuo.com/static/images/record/record.png" class="record-img"
						v-if="currentStatus === 0" @click="buttonClick">
					</image>
					<!-- 正在录音 -->
					<view class="record-animation" v-if="currentStatus === 1">
						<view class="record-line record-line-active" v-for="item in 17" :key="item"></view>
					</view>
					<!-- 录音结束 -->
					<view class="file-container" v-if="currentStatus === 2">
						<view class="record-file">
							<image v-if="!playing" src="https://www.51mihuo.com/static/images/record/play_icon.png"
								class="play-icon" @click="playVoice"></image>
							<image v-else src="https://www.51mihuo.com/static/images/record/pause_icon.png"
								class="play-icon" @click="pauseVoice">
							</image>
							<view class="record-mini">
								<view class="mini-line" :class="{'mini-line-active': playing}" v-for="item in 11"
									:key="item">
								</view>
							</view>
							<view class="text">
								{{ leftTime.toFixed(1) + 's' }}
							</view>
							<image src="https://www.51mihuo.com/static/images/record/delete.png" class="delete-icon"
								@click="clear"></image>
						</view>
					</view>
					<view class="record-button" v-if="currentStatus !== 0" @click="buttonClick"
						:class="{'active': currentStatus === 2}">
						{{ currentButton }}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		gotoAppPermissionSetting
	} from '@/plugins/permission'
	
	export default {
		name: "sound-recording",
		props: {
			value: {
				type: [Object, String],
				default: () => {}
			},
			// 改变图标 针对首页呼叫
			iconIsChange: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				isConfirmed: false, // 是否确认语音
				currentStatus: 0, // 0 未录音， 1 = 正在录音， 2 = 录完
				currentButton: '',
				currentTitle: '点击开始录音',
				recorderManager: null, // 录音实例
				innerAudioContext: null, // 语音播放实例
				isShow: false,
				inquiryResults: -1,
				flag: null,
				voicePath: '{}',
				isRecording: false, // 是否正在录音
				datetime: 0, // 当前时间
				startTime: 0, // 开始录音的时间
				endTime: 0, // 结束录音的时间
				playing: false, //是否在试听语音
				leftTime: 0, // 试听语音时语音的剩余时间
				confirmedTime: 0, // 最后确认时的语音时长
				confirmedPath: '{}',
				confirmedLeftTime: 0,
				isProps: false, // 是否有初始语音
				allowMicrophone: uni.getStorageSync('allowMicrophone') || 0,
			};
		},
		mounted() {
			this.allowMicrophone = uni.getStorageSync('allowMicrophone') || 0
			this.recordManegerInit()
			setTimeout(() => {
				if (this.value && JSON.stringify(this.value) != '{}') {
					this.confirmedPath = this.value.url
					this.confirmedTime = this.value.timeLength
					this.confirmedLeftTime = this.value.timeLength
					this.currentStatus = 2
					this.isConfirmed = true
					this.isProps = true
				}
			}, 1000)
		},
		methods: {
			// 播放语音init
			innerAudioContextInit() {
				this.innerAudioContext = uni.createInnerAudioContext()
				// 准备播放语音
				this.innerAudioContext.onCanplay(() => {
					if (!this.isConfirmed) {
						this.leftTime = this.datetime
					}
					if (this.isConfirmed) {
						this.confirmedLeftTime = this.confirmedTime
					}
				})
				// 更新语音剩余时间
				this.innerAudioContext.onTimeUpdate(() => {
					let time = this.innerAudioContext.currentTime
					this.leftTime = this.datetime - time
					this.confirmedLeftTime = this.confirmedTime - time
					if (!this.isConfirmed && this.leftTime <= 0) {
						// 当leftTime小于0时，说明语音播放完毕，直接把leftTime赋值成datetime
						// 不然有时候leftTime会显示负值，不好看
						this.playing = false
						this.leftTime = this.datetime
					} else if (this.isConfirmed && this.confirmedLeftTime <= 0) {
						this.playing = false
						this.confirmedLeftTime = this.confirmedTime
					}
				})
				// 语音播放完以后
				this.innerAudioContext.onEnded(() => {
					this.playing = false
					this.leftTime = this.datetime
					if (!this.isConfirmed) {
						this.leftTime = this.datetime
					}
					if (this.isConfirmed) {
						this.confirmedLeftTime = this.confirmedTime
					}
				})
			},
			// 录音init
			recordManegerInit() {
				// #ifdef APP-PLUS
				const {
					microphoneAuthorized
				} = uni.getAppAuthorizeSetting()
				if (microphoneAuthorized == 'authorized') {
					this.allowMicrophone = 1
					uni.setStorageSync('allowMicrophone', 1)
				} else if (microphoneAuthorized == 'denied') {
					if (uni.getStorageSync('allowMicrophone') != 0) {
						this.allowMicrophone = 0
						uni.setStorageSync('allowMicrophone', 0)
					} else {
						this.allowMicrophone = -1
						uni.setStorageSync('allowMicrophone', -1)
						uni.showModal({
							title: "提示",
							content: "您暂未开启麦克风使用权限，是否立即设置？",
							confirmText: "去设置",
							cancelText: "暂时不设置",
							confirmColor: "#FF9A52",
							success: (data) => {
								if (data.confirm) {
									gotoAppPermissionSetting();
								}
							}
						});
					}
				} else if (microphoneAuthorized == 'not determined') {
					this.allowMicrophone = 0
				}
				// #endif
				this.recorderManager = null
				this.recorderManager = uni.getRecorderManager()
				// 开始录音
				this.recorderManager.onStart(() => {
					this.datetime = 0
					this.flag = setInterval(() => {
						this.datetime += 0.5;
					}, 500);
				})
				// 结束录音
				this.recorderManager.onStop((res) => {
					if (this.datetime <= 1) {
						this.datetime = 0
						this.endTime = 0;
						this.startTime = 0;
						this.isRecording = false;
						this.currentStatus = 0
						this.leftTime = 0
						return
					}
					if ((this.endTime - this.startTime) < 900) {
						this.datetime = 0
						this.endTime = 0;
						this.startTime = 0;
						this.isRecording = false;
						this.currentStatus = 0
						this.leftTime = 0
						return;
					}
					// 更新语音文件url
					this.onEndCallback(res)
				});
			},
			buttonClick() {
				// 0 未录音， 1 = 正在录音， 2 = 录完
				switch (this.currentStatus) {
					case 0:
						// #ifdef MP-WEIXIN
						uni.authorize({
							scope: 'scope.record',
							success: (res) => {
								this.recordManegerInit()
								this.startVoice()
							},
							fail: (err) => {
								// authorize:fail auth deny
								console.log(err);
							}
						})
						// #endif
						// #ifndef MP
						// 点击后开始录音
						this.startVoice()
						// #endif
						break
					case 1:
						// 点击后结束录音
						this.currentButton = '确认'
						this.currentTitle = '播放语音'
						this.currentStatus = 2
						this.leftTime = this.datetime
						this.endVoice()
						break
					case 2:
						// 点击后发送，回写临时路径
						this.confirmRecord()
						break
					default:
						break
				}
			},
			showRecording() {
				if (!this.isShow) {
					// 如果是从隐藏 -> 显示就重新init一次
					this.innerAudioContextInit()
					this.recordManegerInit()
					if (this.confirmedTime && this.confirmedPath) {
						this.voicePath = this.confirmedPath
						this.datetime = this.confirmedTime
					}
				}
				this.isShow = !this.isShow
			},
			// 点击开始录音
			startVoice() {
				// #ifdef APP-PLUS
				if (this.allowMicrophone == 0) {
					this.recorderManager.start();
					this.recorderManager.stop();
					this.datetime = 0
					this.endTime = 0;
					this.startTime = 0;
					this.isRecording = false;
					this.currentStatus = 0
					this.leftTime = 0
					this.recordManegerInit()
					return
				}
				if (this.allowMicrophone == -1) {
					this.$util.toast('麦克风权限未开启！')
					return
				}
				// #endif
				// 点击开始录音的时候请求权限
				this.startTime = new Date().getTime()
				this.isRecording = true;
				this.recorderManager.start();
				this.currentButton = '说完了'
				this.currentTitle = '正在录音'
				this.currentStatus = 1
			},
			// 点击结束录音
			endVoice() {
				this.endTime = new Date().getTime()
				this.isRecording = false
				clearInterval(this.flag)
				this.flag = null
				this.recorderManager.stop();
			},
			onEndCallback(res) {
				const voicePath = res.tempFilePath
				if (voicePath) {
					this.voicePath = voicePath
					this.flag = null;
				}
			},
			// 点击播放语音
			playVoice() {
				if (this.voicePath === '{}' && this.confirmedPath === '{}') {
					return
				} else {
					this.playing = true;
					if (this.isConfirmed) {
						// 播放最终确认的语音
						if (this.isProps) {
							this.innerAudioContextInit()
							this.innerAudioContext.src = this.$image.imageGlobal + this.confirmedPath;
						} else {
							this.innerAudioContext.src = this.confirmedPath;
						}
					} else {
						// 试听语音
						this.innerAudioContext.src = this.voicePath;
					}
				}
				this.innerAudioContext.play()
			},
			// 点击暂停语音
			pauseVoice() {
				if (this.playing) {
					this.playing = false
					this.innerAudioContext.pause()
				}
			},
			clear() {
				this.confirmedTime = 0
				this.isConfirmed = false
				this.currentStatus = 0
				this.currentButton = ''
				this.currentTitle = '点击开始录音'
				this.voicePath = "{}";
				this.datetime = 0;
				this.leftTime = 0
				this.isRecording = false;
				this.currentStatus = 0
				this.startTime = 0;
				this.endTime = 0;
				this.flag && clearInterval(this.flag)
				this.$emit('input', {
					path: this.voicePath,
					duration: this.datetime,
					buttonType: 'clear'
				});
				this.$emit('chooseVoice', {
					path: this.voicePath,
					duration: this.datetime,
					buttonType: 'clear'
				});
				this.innerAudioContext.stop()
			},
			onClose() {
				this.flag && clearInterval(this.flag)
				this.confirmedPath = this.voicePath
				this.voicePath = '{}'
				if (this.playing) {
					this.playing = false
					this.innerAudioContext.stop()
				}
				if (this.isRecording) {
					this.isRecording = false
					this.recorderManager.stop()
				}
				this.$emit('close')
			},
			confirmRecord() {
				this.isConfirmed = true
				this.confirmedTime = this.datetime
				this.confirmedLeftTime = this.datetime
				this.showRecording()
				this.innerAudioContext.stop()
				this.$emit('input', {
					path: this.voicePath,
					duration: this.datetime,
				});
				this.$emit('chooseVoice', {
					path: this.voicePath,
					duration: this.datetime,
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.content-sound {
		position: relative;
	}

	.button-text {
		display: inline-block;
		vertical-align: middle;
		font-size: 24rpx;
		font-weight: bold;
	}

	.sound-icon {
		display: inline-block;
		vertical-align: middle;
		margin-right: 15rpx;
	}

	.get-sound {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: $middleFontSize;
		color: $fontColor66;
		background: #F6F7F9;
		border-radius: 10rpx;
		cursor: pointer;
		overflow: hidden;
		border: 0;
		outline: none;
		background-size: 35rpx 35rpx;
		background-repeat: no-repeat;
		background-position: 20rpx 30rpx;
	}

	.get-sound::before {
		content: ' ';
		width: 100rpx;
		height: 100rpx;
		background-color: #000;
	}

	.record-file {
		width: 440rpx;
		height: 88rpx;
		margin: 0 auto;
		margin-top: 40rpx;
		background: #EFEFEF;
		border-radius: 88px;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.play-icon {
			width: 62rpx;
			height: 60rpx;
		}

		.record-mini {
			width: 120rpx;
			height: 32rpx;
			display: flex;
			align-items: center;

			@keyframes miniline {
				0% {
					transform: scaleY(100%);
				}

				50% {
					transform: scaleY(50%);
				}

				100% {
					transform: scaleY(100%);
				}
			}

			.mini-line-active {

				&:nth-of-type(1),
				&:nth-of-type(11) {
					animation: miniline .4s infinite ease;
				}

				&:nth-of-type(2),
				&:nth-of-type(10) {
					animation: miniline .4s infinite ease;
				}

				&:nth-of-type(3),
				&:nth-of-type(9) {
					animation: miniline .6s infinite ease;
				}

				&:nth-of-type(4),
				&:nth-of-type(8) {
					animation: miniline .8s infinite ease;
				}

				&:nth-of-type(5),
				&:nth-of-type(7) {
					animation: miniline 1s infinite ease;
				}

				&:nth-of-type(6) {
					animation: miniline 1.2s infinite ease;
				}
			}

			.mini-line {
				width: 20rpx;
				height: 20rpx;
				margin: 0 5rpx;
				background: #ff5d35;
				border-radius: 4rpx;

				&:nth-of-type(1),
				&:nth-of-type(11) {
					height: 10rpx;
				}

				&:nth-of-type(2),
				&:nth-of-type(10) {
					height: 15rpx;
				}

				&:nth-of-type(3),
				&:nth-of-type(9) {
					height: 20rpx;
				}

				&:nth-of-type(4),
				&:nth-of-type(8) {
					height: 30rpx;
				}

				&:nth-of-type(5),
				&:nth-of-type(7) {
					height: 35rpx;
				}

				&:nth-of-type(6) {
					height: 40rpx;
				}
			}
		}

		.delete-icon {
			width: 32rpx;
			height: 34rpx;
		}

		.text {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #FF9A52;
		}
	}

	.popup {
		width: 100vw;
		height: 100%;
		background-color: #FFFFFF;
		padding-top: 40rpx;
		z-index: 10000;

		.popup-title {
			width: 100%;
			height: 42rpx;
			text-align: center;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #303133;
		}

		.record-container {
			width: 100%;

			.record-img {
				width: 142rpx;
				height: 142rpx;
				margin: 20rpx auto;
				margin-top: 50rpx;
			}

			.record-animation {
				width: 100%;
				height: 142rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 20rpx;

				.record-line {
					width: 10rpx;
					height: 10rpx;
					margin: 0 5rpx;
					background: #ff5d35;
					border-radius: 4rpx;
					transition: all 0.2s ease;

					&:nth-of-type(5),
					&:nth-of-type(13) {
						height: 18rpx;
					}

					&:nth-of-type(6),
					&:nth-of-type(12) {
						height: 36rpx;
					}

					&:nth-of-type(7),
					&:nth-of-type(11) {
						height: 48rpx;
					}

					&:nth-of-type(8),
					&:nth-of-type(10) {
						height: 72rpx;
					}

					&:nth-of-type(9) {
						height: 108rpx;
					}
				}

				.record-line-active {
					&:nth-of-type(5) {
						height: 14rpx;
					}

					&:nth-of-type(5),
					&:nth-of-type(13) {
						height: 18rpx;
					}

					&:nth-of-type(6),
					&:nth-of-type(12) {
						height: 36rpx;
						animation: recording36 .4s infinite ease;
					}

					&:nth-of-type(7),
					&:nth-of-type(11) {
						height: 48rpx;
						animation: recording48 .6s infinite ease;
					}

					&:nth-of-type(8),
					&:nth-of-type(10) {
						height: 72rpx;
						animation: recording72 .8s infinite ease;
					}

					&:nth-of-type(9) {
						animation: recording108 1s infinite ease;
					}
				}

				@keyframes recording108 {
					0% {
						height: 108rpx;
					}

					50% {
						height: 54rpx;
					}

					100% {
						height: 108rpx;
					}
				}

				@keyframes recording72 {
					0% {
						height: 72rpx;
					}

					50% {
						height: 36rpx;
					}

					100% {
						height: 72rpx;
					}
				}

				@keyframes recording48 {
					0% {
						height: 48rpx;
					}

					50% {
						height: 24rpx;
					}

					100% {
						height: 48rpx;
					}
				}

				@keyframes recording36 {
					0% {
						height: 36rpx;
					}

					50% {
						height: 18rpx;
					}

					100% {
						height: 36rpx;
					}
				}
			}

			.file-container {
				width: 100%;
				height: 142rpx;
			}

			.record-button {
				width: 170rpx;
				height: 88rpx;
				margin: 40rpx auto;
				margin-top: 20rpx;
				border: 2rpx solid #ff5d35;
				border-radius: 10rpx;
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 400;
				font-size: 28rpx;
				line-height: 88rpx;
				text-align: center;
				color: #ff5d35;

				&.active {
					width: 400rpx;
					font-weight: 500;
					background: #ff5d35;
					border-radius: 50rpx;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
