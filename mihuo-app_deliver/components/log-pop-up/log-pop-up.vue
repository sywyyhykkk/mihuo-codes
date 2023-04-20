<template>
	<u-popup v-model="showPopup" border-radius="30" height="800" mode="bottom" @close="close"
		:safe-area-inset-bottom="false" :closeable="true">
		<view class="criteria-contian">
			<view class="tittle">
				{{title}}
			</view>
			<view class="list-contain">
				<scroll-view :scroll-y="true" class="scroll-Y">
					<view class="rejection-record">
						<view class="list-rejection-contain" v-if="logList.length > 0">
							<view class="item-record-cotain" v-for="(item,index) in logList" :key="index">
								<view class="item-left">
									<view class="node">
									</view>
								</view>
								<view class="item-right">
									<view  v-if="type == '待确认' " class="item-right-contain">
										<view class="item-top">
											<text class="refuse-title">第{{index +1}}次催办</text>
										</view>
										<view class="item-bottom">
											{{item.time}}
										</view>
									</view>
									<view v-if="type == '订单列表' " class="item-right-contain">
										<view class="item-top">
											<text class="refuse-title">订单{{setLogTitleName(item)}}</text>
											<text class="refuse-time">{{item.timeNew}}</text>
										</view>
										<view class="item-bottom">
											{{item.created && item.created}}
											{{setLog(item)}}
										</view>
									</view>
									<view v-if="type == '订单详情' " class="item-right-contain">
										<view class="item-name">
											<text class="left">已结算金额</text>
											<text class="right">￥{{item.preAcceptanceAmount}}</text>
										</view>
										<view class="item-time">{{item.created}}</view>
										<view class="item-bottom">
											{{item.preAcceptanceRemark}}
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- <mh-empty v-else title="这里空荡荡哒～" /> -->
					</view>
				</scroll-view>
			</view>
			<view class="item-button-contain" @click="close">
				<view class="item-button">
					我知道了
				</view>
			</view>
		</view>
	</u-popup>
</template>
<script>
	/**
	 * 引用的地方：
	 * 1.订单列表(操作日志) pages/order/newOrder
	 * 2.订单详情(已结费用) pages/orderReceiving/releaseOrderDetails 
	 * 
	 */
	export default {
		props: {
			title: {
				type: String,
				default: '操作记录'
			},
			logList: {
				type: Array,
				default: function() {
					return []
				}
			},
			value: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: '订单列表'
			}

		},
		data() {
			return {
				showPopup: false
			}
		},
		computed: {

		},
		watch: {
			value(val) {
				if (val) {
					this.open();
				} else if (!this.showPopup) {
					this.close();
				}
				this.showPopup = false;
			}
		},
		mounted() {
			this.value && this.open();
		},
		methods: {
			open() {
				this.$nextTick(() => {
					this.showPopup = true
					this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('close')
					this.showPopup = false
				})
			},
			setLog(item) {
				return this.$getLogTypeName(item.type)
			},
			setLogTitleName(item) {
				if (!item.type) {
					return
				}
				let tempName
				switch (item.type) {
					case 'assign':
						tempName = '已指派'
						break
					case 'change':
						tempName = '已变更'
						break
					case 'change_pay':
						tempName = '变更支付'
						break
					case 'no_order_offer':
						tempName = '工人未报价'
						break
					case 'no_confirm_order_offer':
						tempName = '业主未确认报价'
						break
					case 'no_risk_order_offer':
						tempName = '业主确认报价,未确认风险'
						break
					case 'no_pay_order_offer':
						tempName = '业主确认报价,未付款'
						break
					case 'no_again_order_offer':
						tempName = '业主不确认报价，价格不合理，重新商讨'
						break
					case 'modify_order_offer':
						tempName = '修改报价'
						break
					case 'cancel_order_offer':
						tempName = '取消报价'
						break
					case 'submit_acceptance':
						tempName = '工人提交验收'
						break
					case 'confirm_acceptance':
						tempName = '业主确认验收'
						break
					case 'c_reply':
						tempName = '业主评价'
						break
					default:
						break
				}
				return tempName
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.criteria-contian {
		height: 100%;
		background-color: #FFF;

		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			margin: 0 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.list-contain {
			height: calc(100% - 220rpx);
			padding: 40rpx;
		}

		.scroll-Y {
			height: 100%;
		}


		.item-button-contain {
			position: fixed;
			display: flex;
			justify-content: center;
			width: 100%;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.item-button {
				position: relative;
				width: 624rpx;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				color: #002FA5;
				font-size: 24rpx;
				border: 2rpx solid #002FA5;
				border-radius: 10rpx;
				bottom: 20rpx;
			}
		}

		.rejection-record {
			padding: 20rpx;

			.mh-empty-page {
				/deep/ .u-empty {
					margin-top: 50rpx !important;
				}
			}

			.item-record-cotain {
				display: flex;

				&:last-child {
					.item-bottom {
						margin-bottom: 0rpx !important;
					}
				}

				.item-left {
					width: 40rpx;
					border-left: 2rpx dashed #C4C4C4;
					position: relative;

					.node {
						position: absolute;
						left: -14rpx;
						width: 26rpx;
						height: 26rpx;
						background-color: #fff;
						border-radius: 50%;
						border: 6rpx solid #D9D9D9;
					}
				}

				.item-right {
					display: flex;
					flex-direction: column;
					flex: 1;


					.item-top {
						display: flex;
						justify-content: space-between;
						margin-bottom: 20rpx;
						margin-left: -6rpx;
						margin-top: -6rpx;

						.refuse-title {
							font-size: 28rpx;
							color: #303133;

						}

						.refuse-time {
							font-size: 24rpx;
							color: #909199;
						}
					}

					.item-name {
						line-height: 38rpx;
						margin-top: -6rpx;

						.left {
							color: #303133;
							font-size: 28rpx;
							margin-right: 14rpx;
						}

						.right {
							color: #FF5D35;
							font-size: 30rpx;
						}
					}

					.item-time {
						color: #909199;
						font-size: 26rpx;
						margin-bottom: 28rpx;
						line-height: 38rpx;
					}

					.item-bottom {
						padding: 26rpx;
						background: #F6F6F6;
						border-radius: 20rpx;
						font-size: 26rpx;
						color: #303133;
						margin-bottom: 40rpx;
					}
				}
			}
		}
	}
</style>
