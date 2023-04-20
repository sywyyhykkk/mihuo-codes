<template>
	<view class="main-container">
		<z-nav-bar type="transparent" fontColor="#FFFFFF">
			<view class="page-title" slot="default">觅活预付款</view>
		</z-nav-bar>
		<view class="header-bg"></view>
		<view class="header-container flex-center">
			<view class="top-warp flex-center">
				<view class="center flex-center">
					<view class="title">
						当前余额(元)
					</view>
					<view class="amount">
						{{ prePaymentAmount }}
					</view>
				</view>
				<view class="right flex-center" @click="prepaymentRefund">
					<view class="button">
						申请退款
					</view>
				</view>
			</view>
		</view>
		<scroll-view class="record-list" scroll-y @scrolltolower="loadMore">
			<view class="record-item flex-center" v-for="item, index in prepaymentList" :key="index"
				@click="goToDetail(item)"
				:style="{ borderRadius: index === 0 ? '20rpx 20rpx 0 0' : index === prepaymentList.length - 1 ? '0 0 20rpx 20rpx' : '' }">
				<view class="left flex-center">
					<view class="item-name flex-center">
						<view class="base-type"
							:style="{ background: `${item.type === 1 ? '#000000' : item.type === 2 ? '#ED3832' : item.type === 3 ? '#ED3832' : '#FE6E32'}` }">
							{{ item.type === 1 ? '充值' : item.type === 2 ? '提现' : item.type === 3 ? '消费' : '退款' }}
						</view>
						{{ item.summary }}
					</view>
					<view @click="viewRefundDetail(item)" class="item-des" v-if="item.refundStatus !== null">
						{{ item.refundStatus === 0 ? '申请提现中' : item.refundStatus === 1 ? '已审核' : item.refundStatus === 2 ? '提现成功' : '提现失败' }}
						<uni-icons type="right" size="12" color="#808080"></uni-icons>
					</view>
					<view class="item-time">
						{{ item.createTime }}
					</view>
				</view>
				<view class="right">
					<view class="amount">
						{{ item.type === 1 ? '+' : item.type === 2 ? '-' : item.type === 3 ? '-' : '+' }}
						{{ item.amount }}
					</view>
					<view class="total-amount">
						当前余额: {{ item.totalAmount }}
					</view>
				</view>
			</view>
		</scroll-view>
		<mihuo-popup ref="refundPopup" title="提现进度">
			<view class="refund-detail">
				<view class="refund-title flex-center">
					<view class="left">
						提现总金额
					</view>
					<view class="right">
						<text style="font-size: 28rpx;">¥</text>
						<text>
							{{ Math.floor(currentItem.amount) }}
						</text>
						<text style="font-size: 28rpx;">
							{{ currentItem.amount | priceFormat }}
						</text>
					</view>
				</view>
				<view class="order-sn flex-center">
					交易单号: {{ currentItem.prepaymentSn }}
					<text class="copy" @click="copyOrderSn">复制单号</text>
				</view>
				<!-- 0=申请中 1=已审核 2=提现成功 3=提现失败 -->
				<view class="status-item flex-center" v-if="currentItem.refundStatus > 1">
					<view class="refund-status flex-center">
						<view class="circle"></view>
						<view class="status-name" style="font-weight: bold;">
							{{ currentItem.refundStatus === 2 ? '提现成功' : currentItem.refundStatus === 3 ? '提现失败' : '提现结果' }}
							<text class="status-time">
								{{ currentItem.refundExecuteTime }}
							</text>
						</view>
					</view>
					<view class="refund-des flex-center">
						{{ currentItem.refundExecuteReason || '提现失败' }}
						<text class="refund-des-button" @click="contactCustomService">
							联系客服
						</text>
					</view>
				</view>
				<view class="status-item flex-center" v-if="currentItem.refundStatus === 0">
					<view class="refund-status flex-center">
						<view class="circle"></view>
						<view class="status-name">
							提现审核中
							<text class="status-time">
								{{ currentItem.refundViewTime }}
							</text>
						</view>
					</view>
					<view class="refund-des flex-center">
						提现审核需要2-3个工作日，请耐心等候。
					</view>
				</view>
				<view class="status-item flex-center" v-if="currentItem.refundStatus === 0">
					<view class="refund-status flex-center">
						<view class="circle"></view>
						<view class="status-name">
							申请提现
							<text class="status-time">
								{{ currentItem.refundApplyTime }}
							</text>
						</view>
					</view>
					<view class="refund-des flex-center" style="border: none;">
						{{ currentItem.refundApplyReason }}
					</view>
				</view>
			</view>
		</mihuo-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 1,
				total: 10,
				prepaymentList: [], // 预付款记录
				prePaymentAmount: 0, // 预付款余额
				currentItem: {},
			}
		},
		onLoad() {
			this.getPrepaymentAmount()
			this.getPrepaymentRecord()
		},
		methods: {
			// 复制单号
			copyOrderSn() {
				this.$tools.copy(this.currentItem.prepaymentSn)
			},
			// 联系客服
			contactCustomService() {
				this.$util.goToWeixin()
			},
			// 查看退款详情
			viewRefundDetail(item) {
				this.currentItem = item
				this.$refs.refundPopup.open()
			},
			// 跳转到订单详情
			goToDetail(item) {
				if (item.bizId) {
					const id = JSON.parse(item.bizId)[0]
					this.toPage(`/pages-order/orderDetails?id=${id}`)
				}
			},
			// 预付款退款
			prepaymentRefund() {
				this.toPage(`/pages-mine/mihuoPrepayment/prepaymentRefund?amount=${this.prePaymentAmount}`)
			},
			// 获取预付款余额
			getPrepaymentAmount() {
				this.$httpApi.getUserPrepaymentAmount().then(res => {
					this.prePaymentAmount = res
				})
			},
			loadMore() {
				if (this.prepaymentList.length === this.total) {
					return
				}
				this.current++
				this.getPrepaymentRecord()
			},
			// 获取预付款记录
			getPrepaymentRecord() {
				this.$httpApi.getPrepaymentRecord({
					current: this.current,
					size: 10
				}).then(res => {
					this.total = res.total
					if (this.current === 1) {
						this.prepaymentList = res.records
					} else {
						this.prepaymentList.push(...res.records)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main-container {
		padding-bottom: 40rpx;
	}

	.page-title {
		font-size: 32rpx;
		font-family: HuXiaoBo-NanShen;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 34rpx;
	}

	.header-bg {
		width: 100vw;
		height: 350rpx;
		background: linear-gradient(-90deg, #0D0D0D, #404040);
		border-radius: 0 0 30rpx 30rpx;
	}

	.header-container {
		width: 690rpx;
		height: 320rpx;
		margin: -200rpx 30rpx 0 30rpx;
		/* #ifdef APP-PLUS */
		margin: -156rpx 30rpx 0 30rpx;
		/* #endif */
		background: linear-gradient(-90deg, #FFC285, #FFE5CC);
		box-shadow: 0 10rpx 20rpx 0 rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
		padding: 30rpx;

		.title {
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #000000;
		}

		.amount {
			margin-top: 20rpx;
			font-size: 48rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
		}

		.top-warp {
			width: 100%;
			align-items: flex-start;
			justify-content: flex-end;

			.center {
				width: 50%;
				flex-direction: column;
				justify-content: center;
			}

			.right {
				width: 25%;
				justify-content: center;
				margin-top: -60rpx;

				.button {
					width: 112rpx;
					height: 44rpx;
					text-align: center;
					background: rgba(255, 255, 255, 0.4);
					border-radius: 22rpx;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #ED3832;
					line-height: 44rpx;
				}
			}
		}
	}

	.record-list {
		width: 690rpx;
		height: calc(100vh - 188rpx - 350rpx);
		/* #ifdef APP-PLUS */
		height: calc(100vh - 188rpx - 420rpx);
		/* #endif */
		margin: 30rpx 30rpx 0 30rpx;

		.record-item {
			width: 690rpx;
			background: #FEFEFE;
			margin-bottom: 4rpx;
			justify-content: space-between;
			padding: 30rpx;

			.left {
				width: 70%;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;

				.item-name {
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #000000;
					line-height: 36rpx;

					.base-type {
						width: 66rpx;
						height: 36rpx;
						border-radius: 18rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						line-height: 36rpx;
						color: #FFFFFF;
						text-align: center;
						margin-right: 10rpx;
					}
				}

				.item-des {
					margin-top: 12rpx;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #808080;
					line-height: 34rpx;
				}

				.item-time {
					margin-top: 12rpx;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #808080;
					line-height: 34rpx;
				}
			}

			.right {
				width: 30%;

				.amount {
					font-size: 32rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #000000;
					line-height: 34rpx;
					text-align: right;
				}

				.total-amount {
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #A8A8A8;
					line-height: 34rpx;
					text-align: right;
					margin-top: 10rpx;
				}
			}
		}
	}

	.refund-detail {
		width: 100vw;
		padding: 30rpx;

		.refund-title {

			.left,
				{
				font-size: 36rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #ED3832;
				line-height: 34rpx;
			}

			.right {
				flex: 1;
				text-align: right;

				text {
					font-size: 36rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #ED3832;
					line-height: 34rpx;
				}
			}
		}

		.order-sn {
			width: 100%;
			height: 46rpx;
			margin: 30rpx 0;
			line-height: 46rpx;
			font-size: 26rpx;
			color: #A8A8A8;

			.copy {
				width: max-content;
				height: 46rpx;
				padding: 0 10rpx;
				font-size: 24rpx;
				text-align: center;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #FE6E32;
				line-height: 46rpx;
				background: #FFFFFF;
				border: 2rpx solid #FE6E32;
				border-radius: 23rpx;
				margin-left: 10rpx;
			}
		}

		.status-item {
			width: 100%;
			flex-direction: column;
			align-items: center;

			.refund-status {
				width: 100%;

				.circle {
					width: 18rpx;
					height: 18rpx;
					background: #FEFEFE;
					border: 2rpx solid #FE6E32;
					border-radius: 50%;
					margin-right: 14rpx;
				}

				.status-name {
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					color: #000000;
					line-height: 34rpx;
				}

				.status-time {
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #999999;
					line-height: 34rpx;
					margin-left: 10rpx;
				}
			}

			.refund-des {
				width: calc(100% - 14rpx);
				height: 60rpx;
				padding-left: 20rpx;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #999999;
				line-height: 60rpx;
				border-left: 1px #FE6E32 solid;

				.refund-des-button {
					width: max-content;
					height: 46rpx;
					padding: 0 10rpx;
					font-size: 24rpx;
					text-align: center;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #FE6E32;
					line-height: 46rpx;
					background: #FFFFFF;
					border: 2rpx solid #FE6E32;
					border-radius: 23rpx;
					margin-left: 10rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>

<style>
	page {
		background-color: #F7F7F7;
	}
</style>
