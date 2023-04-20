<template>
	<view>
		<z-nav-bar>
			<view class="page-title" slot="default">申请提现</view>
		</z-nav-bar>
		<view class="form-container">
			<view class="form-item flex-center" v-if="prePaymentAmount">
				<view class="label">
					当前余额
				</view>
				<view class="right">
					<text style="font-size: 20rpx;">¥</text>
					<text style="font-size: 32rpx;">
						{{ Math.floor(prePaymentAmount) }}
					</text>
					<text style="font-size: 20rpx;">
						{{ prePaymentAmount | priceFormat }}
					</text>
				</view>
			</view>
			<view class="form-item flex-center" v-if="prePaymentAmount">
				<view class="label" style="color: #ED3832;">
					提现金额
				</view>
				<view class="right flex-center">
					<!-- <text style="font-size: 20rpx; color: #ED3832;">¥</text>
					<text style="font-size: 32rpx; color: #ED3832;">
						{{ Math.floor(applyAmount) }}
					</text>
					<text style="font-size: 20rpx; color: #ED3832;">
						{{ applyAmount | priceFormat }}
					</text> -->
					<uni-easyinput text-right fontSize="28rpx" fontColor="#ED3832" type="number" :clearable="false"
						v-model="applyAmount" placeholder="请输入提现金额" :placeholderStyle="placeholderStyle" />
				</view>
			</view>
			<view class="form-item" style="padding: 0;">
				<uni-easyinput :autoHeight="true" fontSize="28rpx" type="textarea" :clearable="false"
					v-model="applyReason" placeholder="请输入提现原因" :placeholderStyle="placeholderStyle" />
			</view>
		</view>
		<bottom-button title="提交" :styleObj="{ backgroundColor: '#000000' }" @click="submitRefund"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				prePaymentAmount: 0, // 当前余额
				applyAmount: 0, // 申请提现金额
				applyReason: '', // 原因
				placeholderStyle: `font-size: 28rpx; padding-left: 10rpx;`
			}
		},
		onLoad(options) {
			this.prePaymentAmount = options.amount
		},
		methods: {
			submitRefund() {
				if (!this.applyAmount) {
					this.$util.toast('请输入提现金额！')
					return
				}
				if (this.applyAmount > this.prePaymentAmount) {
					this.$util.toast('提现金额不能大于当前余额！')
					return
				}
				this.$httpApi.applyPrepaymentRefund({
					refundAmount: Number(this.applyAmount),
					refundReason: this.applyReason || '无理由提现'
				}).then(res => {
					if (res) {
						this.$util.toast('申请成功！请耐心等待审核~')
						setTimeout(() => {
							this.goBack()
						}, 1500)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-container {
		width: 100vw;
		padding: 30rpx;

		.form-item {
			height: 100rpx;
			background: #F7F7F7;
			border-radius: 20rpx;
			padding: 0 30rpx;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.label {
				width: 50%;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
			}

			.right {
				width: 50%;
				height: 100rpx;
				line-height: 100rpx;
				text-align: right;

				text {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 100rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
