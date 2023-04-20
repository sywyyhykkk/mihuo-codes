<template>
	<u-popup mode="bottom" v-model="phraseListShow" close-icon-pos="top-right" border-radius="14">
		<view class="type-contain">
			<view class="type-title">
				<text class="text-item">取消订单原因</text>
				<image src="/static/images/icon_close/close.png" class="close-img" mode=""
					@click="phraseListShow=false"></image>
			</view>
			<view class="workers-type-item-value">
				<u-radio-group v-model="orderCancelReasonValue" @change="radioGroupChange">
					<u-radio active-color="$themeColor" v-for="(item, index) in orderCancelReasonList" :key="index"
						:name="item.label" :disabled="item.disabled">
						{{item.label}}
					</u-radio>
				</u-radio-group>
			</view>
			<view class="input-contain">
				<view class="public-item-bottom">
					<u-input v-model="orderCancelReasonValue" class="describe-input" maxlength="200" height="140" type="textarea"
						placeholder="请输入原因" :border="true" />
				</view>
			</view>


			<view class="button-determine" @click="saveReason">确定</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			orderId: {
				type: String,
			},
			pageType: {
				type: String,
				default: ''
			},
			orderOfferId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				phraseListShow: false,
				orderCancelReasonValue: '',
				reason: '',
				apiStr: '',
				orderCancelReasonList: []
			}
		},
		mounted() {},
		methods: {
			// 获取取消原因
			orderCancelReason() {
				let typeName = this.pageType == '接单' ? 'order_receivin_cancel_reason' : 'order_cancel_reason'
				if (!typeName) {
					return
				}
				this.$httpApi.getDicType({
					type: typeName
				}).then(res => {
					this.orderCancelReasonList = res
				})
			},
			// 取消订单
			saveReason() {
				if (!this.orderCancelReasonValue) {
					uni.showToast({
						title: '请填写取消订单原因',
						icon: 'none'
					});
				} else {
					if (this.pageType == '接单') {
						this.$httpApi.getCancelOrderOffer({
							id: this.orderOfferId,
							reason: this.orderCancelReasonValue,
						}).then(res => {
							if (res) {
								uni.hideLoading()
								uni.showToast({
									title: '操作成功~',
									icon: 'none'
								});
								this.phraseListShow = !this.phraseListShow
								this.$emit('cancelReason')
							}

						})
					} else {
						this.$httpApi.cancelOrder({
							id: this.orderId,
							reason: this.orderCancelReasonValue,
						}).then(res => {
							if (res) {
								uni.showToast({
									title: '取消成功',
									icon: 'none'
								});
								this.phraseListShow = !this.phraseListShow
								this.$emit('cancelReason')
							}
						})
					}

				}
			},
			radioGroupChange(val) {
				this.orderCancelReasonValue = val
			},
			open() {
				this.phraseListShow = true
				this.orderCancelReason()
			}
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-radio-group {
		flex-direction: column;
	}

	.input-contain {
		padding: 40rpx;

		.public-item-bottom {
			background-color: #F7F7F7;

			.u-input {
				border: 0rpx;
			}
		}
	}



	.type-contain {
		border: 2rpx #FFFFFF solid;
		padding-top: 42rpx;
		background-color: #FFFFFF;

		.type-title {
			font-size: 32rpx;
			color: #303133;
			margin: 0 20rpx;
			line-height: 1;
			padding-bottom: 36rpx;
			border-bottom: 2rpx solid #EEEEEE;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}

		.workers-type-item-value {
			padding: 40rpx;
			display: flex;
			flex-wrap: wrap;
		}

		.u-radio {
			margin-bottom: 40rpx;
			font-size: 28rpx;
			line-height: 1;
			color: #606266;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.button-determine {
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			text-align: center;
			padding: 24rpx 284rpx;
			white-space: nowrap;
			margin: 0 64rpx 54rpx 62rpx;
		}

		.close-img {
			width: 42rpx;
			height: 42rpx;
		}

		.text-item {
			margin-right: 220rpx;
		}
	}
</style>
