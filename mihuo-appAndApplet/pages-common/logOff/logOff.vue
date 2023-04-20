<template>
	<view>
		<z-nav-bar>
			<view class="nav-bar" slot="default">
				账号注销
			</view>
		</z-nav-bar>
		<view class="title"><text class="title_des">在申请注销前请阅读下面并确认下面信息，保证您的用户信息安全：</text></view>
		<view v-for="(item,index) in infoList" :key="index" class="list_content">
			<view class="icon">
				<image class="images" src="@/pages-common/static/images/icon_title.png"></image>
			</view>
			<view class="list_title">
				<view><text class="info_title">{{item.title}}</text></view>
				<view><text class="info_content">{{item.descript}}</text></view>
			</view>
		</view>
		<view style="margin: 35rpx;text-align: center;color: #999;font-size: 16px;">
			注销前请仔细阅读并同意我们的<text style="color: #ff5d35;font-size: 15px; text-decoration: underline;"
				@click="viewProtocol">《账户注销协议》</text>账号注销后您的<text
				style="color: #ff5d35;font-size: 15px;">用户信息</text>将被<text
				style="font-size: 15px;color: #ff5d35;">清空。</text>
		</view>
		<common-mh-waves rippleBackgroundColor="#e9532d" class="log_off">
			<text class="btn-logo-off" @click="logOff()">确认注销</text>
		</common-mh-waves>
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
			viewProtocol() {
				// 跳转到注销协议web
				uni.navigateTo({
					url: '/pages-common/protocolWebView/protocolWebView?type=4'
				})
			},
			logOff() {
				this.toPage('/pages-common/logOffInput/logOffInput')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		background: #FFFFFF;
		padding: 15rpx 24rpx;

		.title_des {
			font-size: 32rpx;
			color: #b4b3b3;
		}
	}

	.list_content {
		display: flex;
		background: #FFFFFF;
		padding: 15rpx 0;
		justify-content: flex-start;

		.icon {
			.images {
				width: 42rpx;
				height: 32rpx;
				margin: 6rpx 24rpx;
			}
		}

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

	.log_off {
		width: 80vw;
		background: #e74016;
		margin: 0 auto;
		border-radius: 10rpx;
		height: 90rpx;
		line-height: 90rpx;
		display: flex;
		justify-content: center;

		.btn-logo-off {
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
