<template>
	<view class="belonging-page">
		<view class="apply-contain" v-if="statusName === 'applyContain'">
			<view class="title">您还没有加入企业，完善资料申请加入</view>
			<view class="item-type">
				<view class="left">企业编号/名称</view>
				<view class="right">
					<text>请输入</text>
				</view>
			</view>
			<view class="item-type">
				<view class="left">结算类型</view>
				<view class="right">
					<text>请选择</text>
					<u-icon name="arrow-right" class="x6-icon" color="#d1d1d1" size="28"></u-icon>
				</view>
			</view>
			<view class="desc-contain">
				<view class="title-desc">备注</view>
				<view class="input-contain">
					<view class="input-contain-item">
						<u-input v-model="desc" type="textarea" placeholder="请输入备注" height="168" />
					</view>
				</view>
			</view>
		</view>
		<view class="button-contain" v-if="statusName === 'applyContain'">
			<view class="cancel item-button">取消</view>
			<view class="determine item-button">申请</view>
		</view>
		<view class="apply-success" v-if="statusName === 'applySuccess'">
			<image src="/static/images/success.png" mode=""></image>
			<view class="success-text">申请成功</view>
			<view class="success-prompt">
				您已申请成为唐卡装饰有限公司水电工
				请等待审核
			</view>
			<view class="item-line"></view>
			<view class="item-type">
				<view class="left">工种类型</view>
				<view class="right">水电工</view>
			</view>
			<view class="item-type">
				<view class="left">企业联系电话</view>
				<view class="right">1388888888</view>
			</view>
		</view>
		<view class="apply-success-details" v-if="statusName === 'applySuccessDetails'">
			<view class="item-type">
				<view class="left">企业名称</view>
				<view class="right">水电工</view>
			</view>
			<view class="item-type">
				<view class="left">企业编号</view>            
				<view class="right">88888888</view>
			</view>
			<view class="item-type">
				<view class="left">工种类型</view>
				<view class="right">水电工</view>
			</view>
			<view class="item-type">
				<view class="left">企业联系电话</view>
				<view class="right">1388888888</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				desc: '',
				statusName: 'applyContain', // applyContain 表单  applySuccess 成功页面  applySuccessDetails 成功详情页面 
			}
		},
		methods: {
			name() {

			}
		},
	}
</script>

<style lang="scss" scoped>
	.belonging-page {}

	.apply-contain {
		margin: 0 20rpx;

		.title {
			color: $errorFontColor;
			font-size: $smiddleFontSize;
			padding: 40rpx 0 24rpx 0rpx;
			text-align: center;
		}

		.item-type {
			padding: 42rpx 0rpx 42rpx 48rpx;
			background: #FFFFFF;
			border-radius: 5px;
			margin-bottom: 2rpx;
			display: flex;
			justify-content: space-between;

			&:nth-of-type(2) {
				padding-right: 100rpx;
			}

			&:nth-of-type(3) {
				padding-right: 42rpx;
			}

			.x6-icon {
				margin-left: 26rpx;
			}

			.left,
			.right-active {
				font-size: $middleFontSize;
				color: #46464E;
			}

			.right {
				text {
					font-size: $middleFontSize;
					color: #999999;
				}
			}

		}

		.desc-contain {
			background-color: #FFFFFF;
			border-radius: 5px;
			padding: 32rpx 0 40rpx 0rpx;

			.title-desc {
				color: $seconFontColor;
				font-size: $middleFontSize;
				padding-left: 52rpx;
				margin-bottom: 16rpx;
			}

			.input-contain {
				background: #F7F7F7;
				border: 1px solid #FFFFFF;
				box-sizing: border-box;
				border-radius: 5px;
				margin: 0 26rpx;
			}

			.input-contain-item {
				padding: 4rpx 24rpx;
			}
		}
	}

	.button-contain {
		position: fixed;
		bottom: 290rpx;
		display: flex;
		justify-content: center;
		width: 100%;
		margin-bottom: 20rpx;

		.item-button {
			width: 268rpx;
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			border-radius: 5px;
			font-size: $middleFontSize;
		}

		.cancel {
			background-color: #FFFFFF;
			border: 1px solid #E0E0E0;
			margin-right: 24rpx;
		}

		.determine {
			color: #FFFFFF;
			background-color: #002FA5;
		}
	}

	.apply-success {
		height: 92vh;
		background-color: #FFFFFF;
		margin-top: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 134rpx;

		image {
			width: 100rpx;
			height: 100rpx;
			margin-bottom: 12rpx;
		}

		.success-text {
			color: $seconFontColor;
			font-size: $middleFontSize;
		}

		.success-prompt {
			font-size: $middleFontSize;
			color: $viceFontColor;
			margin-bottom: 42rpx;
		}

		.item-line {
			border-bottom: 2rpx solid #F6F6F6;
			width: 98%;
			margin-bottom: 42rpx;
		}

		.item-type {
			display: flex;
			align-items: center;
			margin-bottom: 28rpx;

			.left {
				font-size: $middleFontSize;
				color: #909199;
				min-width: 200rpx;
			}

			.right {
				min-width: 200rpx;
				font-size: $middleFontSize;
			}
		}
	}

	.apply-success-details {
		height: 92vh;
		background-color: #FFFFFF;
		margin-top: 16rpx;
		padding-top: 64rpx;
		padding-left: 86rpx;
		
		.item-type {
			display: flex;
			align-items: center;
			margin-bottom: 28rpx;

			.left {
				font-size: $middleFontSize;
				color: #909199;
				min-width: 200rpx;
			}

			.right {
				min-width: 200rpx;
				font-size: $middleFontSize;
			}
		}
	}
</style>
