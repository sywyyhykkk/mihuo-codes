<template>
	<view class="results-page">
		<z-nav-bar backState="3000" @backClick="goBackPage" bgColor="#002FA5" fontColor="#FFFFFF">
			<view slot="default" class="nav-bar-title">
				技能认证
			</view>
		</z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="contain">
			<view class="image-contain">
				<image src="../../static/images/wait_examine.png" class="image-success" mode=""></image>
			</view>
			<view class="text-success">提交成功</view>
			<view class="text-success-audit">
				<p class="itme">平台正在审核中，审核通过后</p>
				<p class="itme"> 将通过短信通知您~</p>
			</view>
			<view class="save-back" @click="back">返回首页</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			goBackPage(){
				uni.navigateBack({
					delta: 2
				})
			},
			back() {
				uni.reLaunch({
					url: '/pages/home/home'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.nav-bar-title {
		@include nav-bar-title
	}
	
	.results-page {
		height: 100vh;
		background: #FFFFFF;

		.contain {
			border-top: 16rpx solid #f5f5f5;
			text-align: center;
		}

		.image-contain {
			display: flex;
			justify-content: center;
			padding-top: 104rpx;
		}

		.image-success {
			width: 208px;
			height: 166px;
		}

		.text-success {
			font-weight: bold;
			font-size: 36rpx;
			color: $themeColor;
			margin-bottom: 8rpx;
		}

		.text-success-audit {
			color: #999999;
			font-size: 28rpx;
		}

		.save-back {
			color: #FFFFFF;
			background-color: $themeColor;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 88rpx;
			margin: 68rpx 64rpx;
			font-size: 28rpx;
			border-radius: 10rpx
		}
	}
</style>
