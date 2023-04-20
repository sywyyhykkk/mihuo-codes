<template>
	<view class="video-play-contain" @click.stop="getJump">
		<video id="myVideo" object-fit="contain" controls v-if="videoShow" :src="videoSrc" :autoplay="autoplay"
			:muted="muted" :direction="direction" @fullscreenchange="screenChange"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				videoSrc: '',
				autoplay: true, // 是否自动播放
				muted: false, //是否静音播放
				videoShow: true,
				direction: 0 // 屏幕方向 固定竖屏
			}
		},
		onReady() {
			this.videoContext = uni.createVideoContext("myVideo", this);
			let platform = uni.getSystemInfoSync().platform
			if (platform == 'android') {
				this.videoContext.requestFullScreen({
					direction: this.direction
				});
			} else {
				// ios延时一下，不然页面会出问题
				setTimeout(() => {
					this.videoContext.requestFullScreen({
						direction: this.direction
					});
				}, 200)
			}
		},
		onLoad(option) {
			this.videoSrc = option.url
		},
		onShow() {

		},
		methods: {
			otherFun() {},
			screenChange(e) {
				let fullScreen = e.detail && e.detail.fullScreen;
				if (!fullScreen) {
					this.videoShow = false
					uni.$off('videoUpdate')
					uni.navigateTo({
						url: "/pages/full-screen/blankPages"
					});
				}
			},
			getJump() {

			},
		}
	}
</script>

<style lang="scss" scoped>
	#myVideo {
		width: 750rpx;
	}

	.video-play-contain {
		display: flex;
		height: 100vh;
		width: 750rpx;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.6);
		transition: all 0.25s linear 0s;
		align-items: center;
	}
</style>
