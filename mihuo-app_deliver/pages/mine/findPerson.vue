<template>
	<view>
		<public-module></public-module>
		<!-- <z-nav-bar fontColor="white" :bgColor="['$themeColor','$themeColor']" title=""></z-nav-bar> -->
		<view class="find_pserson"></view>
		<image src="../../static/icon/menu_forward.png" class="back_iamge" @click="goBack()"></image>
		<view class="hint_model">
			<view class="hint_back">你将获得</view>
			<view style="margin-top: 50rpx;">
				<view class="hint_num">1</view>
				<view class="hint_text">海量工人，一应俱全</view>
				<view style="clear: both;"></view>
			</view>
			<view style="margin-top: 50rpx;">
				<view class="hint_num">2</view>
				<view class="hint_text">秒数找活，秒数提现</view>
				<view style="clear: both;"></view>
			</view>
			<view style="margin-top: 50rpx;">
				<view class="hint_num">3</view>
				<view class="hint_text">更多福利等你来发现</view>
				<view style="clear: both;"></view>
			</view>

		</view>

		<view class="my_button">
			<view class="look_around">随便看看</view>
			<view class="move_into">立即入驻</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},methods:{
			goBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my_button {
		padding-left: calc((100% - 540rpx)/2);
		margin-top: 200rpx;

		.look_around {
			width: 240rpx;
			height: 80rpx;
			border: 2rpx solid #EEEEEE;
			box-sizing: border-box;
			border-radius: 10rpx;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 80rpx;
			text-align: center;
			color: #909199;
			float: left;

		}

		.move_into {
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			width: 240rpx;
			height: 80rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 80rpx;
			text-align: center;
			color: #FFFFFF;
			float: left;
			margin-left: 60rpx;
		}
	}


	.find_pserson {
		width: 100%;
		height: 872rpx;
		background: url(../../static/images/mine/find_person.png);
		background-size: cover;
	}

	.back_iamge {
		width: 22rpx;
		height: 40rpx;
		position: fixed;
		top: 110rpx;
		left: 40rpx;
	}

	.hint_model {
		background: #FFFFFF;
		box-shadow: 0 8rpx 14rpx #FFEADD;
		border-radius: 40rpx;
		height: 454rpx;
		margin: -180rpx 40rpx 0 40rpx;

		.hint_back {
			background: url(../../static/images/mine/Rectangle457.png);
			height: 78rpx;
			width: 384rpx;
			background-size: cover;
			background-repeat: no-repeat;
			text-align: center;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 78rpx;
			color: #FFFFFF;
			margin-top: -18rpx;
			margin-left: calc((100% - 384rpx)/2);

		}

		.hint_num {
			background: url(../../static/images/mine/numbg1.png);
			background-size: cover;
			background-repeat: no-repeat;
			height: 52rpx;
			width: 46rpx;
			line-height: 52rpx;
			text-align: center;
			font-weight: bold;
			font-size: 26rpx;
			color: #FFFFFF;
			float: left;
			margin-left: 110rpx;
		}

		.hint_text {
			float: left;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 52rpx;
			color: #606166;
			margin-left: 30rpx;
		}


	}
</style>
