<template>
	<view class="video-play-contain" @click.stop="getJump" v-if="videoShow">
		<video id="myVideo" object-fit="contain" controls :src="videoSrc" :autoplay="autoplay" :muted="muted"
			@fullscreenchange="screenChange"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				videoSrc: '',
				autoplay: true, // 是否自动播放
				muted: true, //是否静音播放
				videoShow:true,
			}
		},
		onReady() {
			this.videoContext = uni.createVideoContext("myVideo", this);
			this.videoContext.requestFullScreen();
		},
		onLoad(option) {
			this.videoSrc = option.url
		},
		onShow() {
		
		},
		methods: {
			otherFun(){
				console.log("sssss");
			},
			screenChange(e) {
				let fullScreen = e.detail && e.detail.fullScreen;
				if (!fullScreen) {
					uni.$off('videoUpdate')
					uni.navigateTo({
						url: "/pages-common/full-screen/blankPages"
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
