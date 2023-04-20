<template>
	<view>
		<public-module></public-module>
		<z-nav-bar fontColor="#333333" bgColor="#ffffff" title="添加银行卡">
		</z-nav-bar>
		<view class="form_list" style="margin-top: 10rpx;">
			<view class="form_list_title">银行卡号</view>
			<input class="form_list_input" placeholder="请输入" />
		</view>
		<view class="form_list">
			<view class="form_list_title">开户行</view>
			<view class="form_list_input"> 请选择开户行</view>
			<image class="form_list_select" src="../../static/demo/icon_right.png"></image>
		</view>
		<view class="form_list">
			<view class="form_list_title">预留手机</view>
			<input class="form_list_input" placeholder="请输入银行预留手机号" />
		</view>
		<view class="form_list">
			<view class="form_list_title">验证码</view>
			<input class="form_list_input2" placeholder="请输入短信验证码" />
			<view class="get_code">获取验证码</view>
		</view>

		<view class="submit" @click="confirmSubmit">确认提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sex: ''
			}
		}
		,methods:{
			confirmSubmit(){
				uni.navigateTo({
					url: '/pages/mine/settingPayPassword'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.submit {
		line-height: 90rpx;
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
		margin-left: 60rpx;
		margin-right: 60rpx;
		margin-top: 400rpx;

	}

	.form_list {
		height: 100rpx;
		width: 100%;
		background: #FFFFFF;
		border-bottom: solid 2rpx #EEEEEE;

		// margin-top: 2rpx;
		.form_list_title {
			float: left;
			width: 160rpx;
			text-align: right;
			line-height: 100rpx;
			font-weight: bold;
			font-size: 30rpx;
			color: $seconFontColor;
		}

		.form_list_input {
			float: left;
			margin-left: 30rpx;
			width: calc(100% - 300rpx);
			height: 100rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #909199;
			line-height: 100rpx;
		}

		.form_list_input2 {
			float: left;
			margin-left: 30rpx;
			width: calc(100% - 480rpx);
			height: 100rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #909199;
			line-height: 100rpx;
		}

		.get_code {
			width: 180rpx;
			line-height: 60rpx;
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			font-weight: bold;
			font-size: 24rpx;
			color: #FFFFFF;
			text-align: center;
			float: right;
			margin-right: 40rpx;
			margin-top: 20rpx;
		}

		.form_list_select {
			float: right;
			width: 35rpx;
			height: 45rpx;
			margin-top: 27rpx;
			margin-right: 40rpx;
		}
	}
</style>
