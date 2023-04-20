<template>
	<view class="video-play-contain" v-if="value">
		<video :src="videoSrc" controls :autoplay="autoplay" :muted="muted" id="myVideo"
			@fullscreenchange="screenChange"></video>
	</view>
</template>

<script>
	export default {
		name: 'video-play',
		props: {
			// 视频路径
			videoSrc: {
				type: String,
				default: ''
			},
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				autoplay: true, // 是否自动播放
				muted: true, //是否静音播放
			}
		},
		watch: {
			videoSrc: {
				handler(newVal, oldVal) {},
				deep: true
			},
			value: {
				handler(newVal, oldVal) {
					console.log("newVal", newVal)
					if (newVal) {
						this.getPlay()
					}
				},
				deep: true
			}
		},
		mounted() {

		},
		methods: {
			getPlay() {
				this.videoContext = uni.createVideoContext("myVideo");
				// this.videoContext.requestFullScreen();
				this.videoContext.play()
			},
			screenChange(e) {
				// let fullScreen = e.detail.fullScreen;
				// if (!fullScreen) {
				// 	this.$emit('input', false)
				// }
			},
		},
	}
</script>

<style lang="scss" scoped>
	.video-play-contain {
		position: absolute;
		z-index: 10;
		width: 100%;
	}
</style>
