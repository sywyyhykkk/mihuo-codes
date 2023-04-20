<template>
	<view class="content">
		<view class="con_info">
			<view class="title"><text class="title_des">在申请注销前请阅读下面并确认下面信息，保证您的用户信息安全：</text></view>
			<view v-for="(item,index) in infoList" :key="index" class="list_content">
				<view class="list_title">
					<view><text class="info_title">{{item.title}}</text></view>
					<view><text class="info_content">{{item.descript}}</text></view>
				</view>
			</view>
		</view>
		
		<view class="cancellation_agreement">
			注销前请仔细阅读并同意我们的<text class="agreement" @click="viewProtocol">《账户注销协议》</text>
			账号注销后您的<text class="user_info">用户信息</text>将被
			<text class="user_info">清空。</text>
		</view>
		<view class="log_off" @click="logOff()">
			<waves rippleBackgroundColor="#002FA5">
				<text style="color: #FFFFFF;font-size: 15px;">确认注销</text>
			</waves>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				infoList: [{
						title: '在常用设备上申请注销',
						descript: '请确保你的当前设备是您的常用设备'
					},
					{
						title: '账号处于安全状态',
						descript: '请确保当前操作者是您本人，或是在您的许可下进行的注销操作'
					},
					{
						title: '物流信息已清空',
						descript: '请确保你的物流信息已经清空，如果您还存在未处理或者未完成的物流单据，请先处理物流等单据'
					},
					{
						title: '费用信息已结清',
						descript: '如果您存在未结清的支付单，或是您的账户余额还存在未处理的金额，将不允许注销账号'
					}
				]
			}
		},
		methods: {
			viewProtocol(){
				// 跳转到注销协议web
				uni.navigateTo({
					url: '../protocolWebView/protocolWebView?type=4'
				})
			},
			logOff() {
				uni.navigateTo({
					url: '../logOffInput/logOffInput'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		margin-top: 4rpx;
	}
	.con_info{
		padding: 30rpx 0;
		background: #FFFFFF;
	}
	.title {
		padding: 15rpx 24rpx;

		.title_des {
			font-size: 32rpx;
			color: #b4b3b3;
		}
	}

	.list_content {
		display: flex;
		padding: 15rpx 0;
		justify-content: flex-start;
		padding: 20rpx 40rpx;

		.list_title {
			flex: 1;

			.info_title {
				color: #666;
			}

			.info_content {
				font-size: 28rpx;
				color: #b4b3b3;
			}
		}
	}
	
	.cancellation_agreement{
		margin: 50rpx 35rpx;
		text-align: center;
		color: #999;
		font-size: 16px;
		.agreement{
			color: $themeColor;
			font-size: 15px;
			text-decoration: underline;
		}
		.user_info{
			color: $themeColor;
			font-size: 15px;
		}
	}

	.log_off {
		background: $themeColor;
		margin: 30rpx;
		border-radius: 10rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
	}
</style>
