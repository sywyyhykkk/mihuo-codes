<template>
	<!-- 播放器显示区域 -->
	<view class="video-play-contian">
		<!-- 播放器最终在view的子级显示 -->
		<view class="video-js vjs-big-play-centered" :video="videoInfo" :change:video="video.updateData" ref="video">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//视频播放器
				videoPlayer: null,
				//是否正在播放
				isPlaying: false,
				option: {},
				videoInfo: {

				},
			}
		},
		computed: {

		},
		onReady() {},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getUrl()
		},
		methods: {
			playVideo() {

			},
			getUrl() {
				this.videoInfo.url = this.option.url
				return
				this.videoInfo = {
					url: 'https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/a8aea0e2d59349cca902e4eb67d27f21.mp4', // 地址
					duration: '', // 渲染开始时间/结束时间对象
				}
			}
		}
	}
</script>

<script module="video" lang="renderjs">
	// videojs 引入
	// https://www.jianshu.com/p/5bbe79c68a07
	// import Videojs from 'video.js'
	// import 'videojs-flash'
	// import 'video.js/dist/video-js.css';
	export default {
		data() {
			return {}
		},
		methods: {
			// 监听从从外部传递进来的数据
			updateData(newValue, oldValue, ownerInstance, instance) {
				if (newValue !== oldValue) {
					// 监听 service 层数据变更
					this.$nextTick(() => {
						this.initVideo(newValue.url, newValue.duration)
					})
				}
			},
			// 初始化视频
			initVideo(url, duration) {
				// 清空已存在是vidoejs
				if (this.videoDom) {
					this.videoDom.dispose();
					this.videoDom = null;
				}
				// 创建video并且添加属性
				var video = document.createElement('video')
				
				video.id = 'video'
				video.style = 'width: 100%;' // 不设置高度，让视频自动撑开
				video.setAttribute("class", "video-js vjs-default-skin vjs-big-play-centered");
				video.controls = true

				this.$refs.video && this.$refs.video.$el.appendChild(video)

				// 设置option
				let option = {
					controls: true,
					muted: false, // 静音切换
					autoplay: false,
					fluid: true, //宽高自适应
					preload: "auto",
					loop: false, //循坏播放
					sources: [{
							type: "video/mp4", // mp4格式
							src: url
						},
						{
							type: "video/webm", // webm格式
							src: url
						}
					],
					controlBar: {
						volumePanel: false, // 音量控制
						timeDivider: true, // 时间分割线
						durationDisplay: true, // 总时间
						progressControl: true, // 进度条
						remainingTimeDisplay: true, //当前以播放时间
						fullscreenToggle: true, //全屏按钮
						pictureInPictureToggle: false, //画中画
					},
				};
				let _this = this
				// 创建videojs实例
				this.videoDom = Videojs(video, option, function onPlayerReady() {
					this.on("loadstart", function() {
						console.log("开始请求数据 ");
					})
					this.on("progress", function() {
						console.log("正在请求数据 ");
					})
					this.on("loadedmetadata", function() {
						console.log("获取资源长度完成 ")
					})
					this.on("canplaythrough", function() {
						console.log("视频源数据加载完成")
					})
					this.on("waiting", function() {
						console.log("等待数据")
					});
					this.on("play", function() {
						console.log("视频开始播放")
					});
					this.on("playing", function() {
						console.log("视频播放中")
					});
					this.on("pause", function() {
						console.log("视频暂停播放")
					});
					this.on("ended", function() {
						console.log("视频播放结束");
					});
					this.on("error", function() {
						console.log("加载错误")
					});
					this.on("seeking", function() {
						console.log("视频跳转中");
					})
					this.on("seeked", function() {
						console.log("视频跳转结束");
					})
					this.on("ratechange", function() {
						console.log("播放速率改变")
					});
					this.on("timeupdate", function() {
						console.log("播放时长改变");
					})
					this.on("volumechange", function() {
						console.log("音量改变");
					})
					this.on("stalled", function() {
						console.log("网速异常");
					})
					
					// this.on("exitFullscreen", function() {
					// 	uni.navigateBack({
					// 		delta: 1
					// 	});
					// })
				});

				console.log('this.videoDom', this.videoDom);
				this.videoDom.requestFullscreen()

				// this.videoDom.exitFullscreen(()=>{
				// 	console.log('退出。。');
				// })
				// 截取时间播放
				// this.videoDom.offset({
				// 	start: duration.start,
				// 	end: duration.end,
				// })

			},

		}
	}
</script>


<style lang="scss" scoped>
	// @import 'video.js/dist/video-js.css';

	.video-play-contian {}

	.video-js {}

	/deep/ .vjs-icon-placeholder:before {
		font-size: 1.4em !important;
	}
</style>
