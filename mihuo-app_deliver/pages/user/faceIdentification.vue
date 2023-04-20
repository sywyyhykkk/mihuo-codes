<template>
	<view class="content">

		<z-nav-bar title="人脸识别" fontColor="#333333" bgColor="#FFFFFF">
			<view class="icon_setUp" slot="right">

			</view>
		</z-nav-bar>
		<view class="my_back">
			<view class="face_title">人脸识别服务</view>
			<view class="face_title_info">获得更便捷的服务体验</view>


			<image src="../../static/images/user/face1.png" class="gaiimg" id="gaiimg" @click="goFace"></image>
			<view class="bottom_info">请把你的脸部放在识别的指示框架里面，<br />
				以便于准确识别个人信息</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				pusher: null
			}
		},
		methods: {
			goFace() {
				// 创建直播推流控件
				this.pusher = new plus.video.LivePusher('gaiimg', {
					url: 'rtmp://testlivesdk.v0.upaiyun.com/live/upyunb'
				});
				this.pusher.preview();

				this.pusher.start(()=> {
					console.log('Start pusher success!');
				}, (e)=> {
					console.log('Start pusher failed: ' + JSON.stringify(e));
				});
				
				this.pusher.snapshot((e)=> {
					plus.nativeUI.alert("snapshot success: " + JSON.stringify(e));
				}, (e)=> {
					plus.nativeUI.alert("snapshot error: " + JSON.stringify(e));
				})
			// 	// 监听状态变化事件
			// 	this.pusher.addEventListener('statechange', function(e) {
			// 		console.log('statechange: ' + JSON.stringify(e));
			// 	}, false);
			

			}

		},onShow(){
		this.goFace()
	}

	}
</script>

<style lang="scss" scoped>
	.my_back {
		// background-color: #FFFFFF;
		height: calc(100vh - 220rpx);
		margin-top: 20rpx;
		padding-top: 116rpx;

		.face_title {
			font-weight: bold;
			font-size: 36rpx;
			text-align: center;
			color: $seconFontColor;

		}

		.face_title_info {
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			text-align: center;
			color: #909199;

		}

		.gaiimg {
			margin-top: 50rpx;
			width: 410rpx;
			height: 530rpx;
			margin-left: calc((100% - 410rpx)/2);

		}

		.bottom_info {
			margin-top: 88rpx;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			text-align: center;
			color: #909199;

		}
	}
</style>
