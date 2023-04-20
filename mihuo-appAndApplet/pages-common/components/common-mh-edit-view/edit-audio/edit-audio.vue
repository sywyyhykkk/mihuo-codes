<template>
	<view style="background-color: #FFFFFF;">
		<view v-if="jsondata.listdata && jsondata.listdata.length > 0">
			<view v-for="item in jsondata.listdata" :key="item.name" class="audioContent" @click="playVoice(item)">
				<image v-if="voicePlayingId==item.name" class="playIcon" src="https://www.51mihuo.com/static/images/play-audio.png" />
				<image v-if="voicePlayingId==item.name" class="playIcon" src="https://www.51mihuo.com/static/images/audio-play-rich.gif">

			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const innerAudioContext = uni.createInnerAudioContext()
	// #endif
	export default {
		name: 'edit-audio',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
		onHide() {
			// #ifdef APP-PLUS
			innerAudioContext.stop()
			// #endif
		},
		onLoad() {
			// 结束播放
			// #ifdef APP-PLUS
			innerAudioContext.onEnded(res => {
				this.voicePlayingId = ''
			})
			// #endif
		},
		methods: {
			playVoice(item) {
				// #ifdef APP-PLUS
				if (this.voicePlayingId) {
					this.voicePlayingId = ''
				} else {
					this.voicePlayingId = item.name;
					innerAudioContext.src = this.$image.imageGlobal + item.url;
					innerAudioContext.play()
				}
				// #endif
				// #ifdef H5
				const audio = new Audio()
				this.voicePlayingId = item.name
				audio.src = `${this.$image.imageGlobal}${item.url}`
				audio.play()
				// #endif
			},
		},
		data() {
			return {
				voicePlayingId: 0
			}
		}

	}
</script>

<style scoped lang="scss">
	.audioContent {
		background: #fbf0e9;
		border-radius: 10rpx;
		padding: 20rpx;

		.playIcon {
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
