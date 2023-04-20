<template>
	<view class="change-records-page">
		<view class="list-contain" v-if="recordsList.length > 0">
			<view class="item-contain" v-for="(item,index) in recordsList" :key="index" @click.stop="getDetails(item)">
				<view class="item-top">
					<view class="item-desc">
						{{item.alterationReason}}
					</view>
					<text class="item-status item-status-default">
						{{setStatus(item)}}
					</text>
				</view>
				<view class="item-pice">
					<text class="num-default"
						:class="[item.customerAlterationList[0].status == 1 ? 'reduce':'add']">{{Math.abs(item.alterationMoney)}}</text>
					<text class="unit">元{{item.customerAlterationList[0].status == 1 ? '退':'补'}}款</text>
				</view>
				<view class="item-button-list" v-if="option.pageType !== '接单' ">
					<view v-if="item.payStatus == 0" @click.stop="submit('拒绝',item)"
						class="item-button item-button-default">
						拒绝
					</view>
					<view v-if="item.payStatus == 0" @click.stop="submit('确认',item)"
						class="item-button-active item-button-default">
						确认
					</view>
					<view v-if="item.customerAlterationList[0].status !== 1 && item.payStatus == 1"
						class="item-button-active item-button-default" @click.stop="submit( '去付款',item)">
						去付款
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="recordsList.length === 0" icon="/static/images/no_recommend.png" title="还没有记录～～" />
		<view class="bottom-button" v-if="recordsList.length > 0">
			<view class="item-button" @click="getJump('联系客服')">
				联系客服
			</view>
			<view class="item-button" @click="getJump('联系师傅')" v-if="option.pageType !== '接单'">
				联系师傅
			</view>
		</view>

		<u-popup v-model="detailsShow" border-radius="30" height="1000" mode="bottom" :safe-area-inset-bottom="true"
			:closeable="true">
			<view class="details-contain">
				<scroll-view :scroll-y="true" class="scroll-Y">
					<view class="item-status" v-if="changeDetails.status == 1">
						{{changeDetails.payStatus !== 0 ? '已退款':'等待退款'}}
					</view>
					<view class="item-status " v-else>
						{{changeDetails.payStatus !== 0 ? '已付款':'等待付款'}}
					</view>
					<view class="item-pice">
						<text class="num">{{Math.abs(changeDetails.alterationMoney)}}</text>
						<text class="unit">元</text>
					</view>
					<view class="item-time">
						变更时间 {{changeDetails.alterationTime}}
					</view>
					<view class="item-desc-contain">
						<view class="item-desc-title">
							变更说明
						</view>
						<view class="item-desc">
							{{changeDetails.alterationReason }}
						</view>
					</view>
					
					<view class="image-contain">
						<image-show
							:imgSrc="changeDetails.customerAlterationList && changeDetails.customerAlterationList[0] && changeDetails.customerAlterationList[0].pics"
							width="192" height="192"></image-show>
					</view>
					<view class="audio-contain" v-if="orderDetails.voice">
						<mihuo-audio
							:formData="changeDetails.customerAlterationList && changeDetails.customerAlterationList[0] && changeDetails.customerAlterationList[0].audio"
							class="voice" />
					</view>
					<quotation-list :list="changeDetails.groupPrice" pageType="发单">
					</quotation-list>
				</scroll-view>
				<view class="button-list" v-if="option.pageType !== '接单' && changeDetails.payStatus == 0 ">
					<view class="item-default item-button" @click="submit('拒绝',changeDetails,'弹出')">
						拒绝
					</view>
					<view v-if="changeDetails.payStatus == 0" @click="submit('确认',changeDetails)"
						class="item-default item-button-active">
						确认
					</view>
					<view v-if="changeDetails.status == 0 && changeDetails.payStatus == 1"
						@click="submit('去付款',changeDetails)" class="item-default item-button-active">
						确认支付
					</view>
				</view>
			</view>
		</u-popup>

		<order-pay-popup v-model="showPopupPay" @callback="payConfirm" :money="orderDetails.alterationMoney">
		</order-pay-popup>

		<!-- 支付成功 -->
		<!-- <pay-success :orderInfo="orderDetails" @setPayFinish="setPayFinish" :paySuccessData="paySuccessData"
			v-if="finished" /> -->
	</view>
</template>

<script>
	import customeType from '@/plugins/im/customeType.js'
	export default {
		data() {
			return {
				recordsList: [],
				showPopupPay: false,
				detailsShow: false,
				orderDetails: {},
				option: {},
				finished: false,
				changeDetails: {}

			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.getList()

		},
		methods: {
			setStatus(item) {
				// 增项 初始状态 待确认（待支付）0，->已支付2
				// 减项 初始状态 待确认（待支付）0 ,-> 已确认 1，-> 已拒绝3
				if (item.customerAlterationList[0].status == 1) {
					// 减项
					switch (item.payStatus) {
						case 0:
							return '待确认'
						case 1:
							return '已确认'
						case 3:
							return '已拒绝'
					}
				} else {
					// 增项
					switch (item.payStatus) {
						case 0:
							return '待确认'
						case 1:
							return '待支付'
						case 2:
							return '已付款'
					}
				}
			},
			getDetails(item) {
				this.$httpApi.getUpdateAlterationItem({
					id: item.id
				}).then(res => {
					if (res) {
						res.groupPrice.map(el => {
							el['productJsonList'] = el.productJson && JSON.parse(el.productJson)
						})
						res['totalPrice'] = res.groupPrice && res.groupPrice.totalPrice
						this.changeDetails = res
						this.detailsShow = !this.detailsShow
					}
				})
			},
			getList() {
				this.$httpApi.selectChangeList({
					orderCode: this.option.orderCode,
					orderId: this.option.orderId,
					size: 999
				}).then(res => {
					if (res) {
						this.recordsList = res.records
						this.getPaySuccessData()
					}
				})
			},
			submit(type, item, typeName) {
				// 批量提交 大于等于0  去支付
				// 批量提交 小于0 不去支付 
				switch (type) {
					case '拒绝':
						this.$httpApi.updateAlterationItem({
							id: item.id,
							payStatus: 3
						}).then(res => {
							if (res) {
								this.$util.toast("操作成功");
								this.getList()
							}
						})
						if (typeName) {
							this.detailsShow = !this.detailsShow
						}
						break
					case '去付款':
						this.orderDetails = item
						this.showPopupPay = true
						break
					case '确认退款':
						this.$httpApi.updateAlterationItem({
							id: item.id,
							payStatus: 1
						}).then(res => {
							if (res) {
								this.$util.toast("操作成功");
								this.getList()
							}
						})
						break
					case '确认':
						this.$httpApi.updateAlterationItem({
							id: item.id,
							payStatus: 1
						}).then(res => {
							if (res) {
								this.$util.toast("操作成功");
								this.getList()
							}
						})
						break
				}
			},
			payConfirm(data) {
				let param = {
						payType: data.payType,
						ids: [this.orderDetails.id],
						payAmount: this.orderDetails.alterationMoney,
						clientId: 'bmini'
					},
					payType = '';
				if (data.payType === 3) {
					plus.share.getServices((res) => {
						let sweixin = null
						for (let i in res) {
							if (res[i].id == 'weixin') {
								sweixin = res[i]
							}
						}
						//唤醒微信小程序
						if (sweixin) {
							this.$util.requestPay(data.payType, this.orderDetails.id, 'workOrder')
						}
					})
				} else {
					this.$http.post('order/customer/pay/alteration', param).then((res) => {
						if (res && res.payInfo) {
							this.$util.requestPay(data.payType, res.payInfo, 'workOrder')
						}
					})
				}
			},
			setPayFinish(val) {
				this.finished = val;
				this.showPopupPay = false;
				this.getList()
			},

			getJump(type) {
				if (type == '联系客服') {
					this.$util.goToWeixin()
				} else {
					this.toPage(
						`/pages/message/chat/index?type=${customeType.constructionOrderKey}&orderId=${this.option.orderId}&toUserId=${this.option.toUserId}&toUserName=${this.option.toUserName}`
					)
				}
			},
			// 获取订单支付信息
			getPaySuccessData() {
				// if (uni.getStorageSync('curOrder') != this.orderDetails.id) {
				if (this.orderDetails.id) {
					this.$http.get("order/orderpaylog/getOrderByBusinessId", {
						businessId: this.orderDetails.id
					}).then(res => {
						if (res) {
							uni.setStorageSync('changeItem', this.orderDetails.id);
							this.paySuccessData = res;
							this.finished = true;
						} else {
							this.finished = false;
						}
					})
				}
				// }
			},
		},
	}
</script>

<style lang="scss" scoped>
	.change-records-page {

		.list-contain {
			padding-bottom: 160rpx;

			.item-contain {
				background-color: #fff;
				border-radius: 16rpx;
				margin-bottom: 16rpx;
				padding: 52rpx 68rpx 42rpx 46rpx;

				.item-top {
					display: flex;
					justify-content: space-between;

					.item-desc {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: #000000;
						font-size: $middleFontSize;
						margin-right: 50rpx;

					}

					.item-status-default {
						white-space: nowrap;
						font-size: $smallFontSize;
					}

					.item-status {
						color: $viceFontColor;
					}

					.item-status-active {
						color: $themeColor;
					}

					.item-status-waring {
						color: $errorFontColor;
					}
				}

				.item-pice {
					margin-top: 10rpx;

					.reduce {
						color: #303133;
					}

					.num-default {
						font-size: 46rpx;
						margin-right: 4rpx;
					}

					.add {
						color: $errorFontColor;
					}

					.unit {
						color: $mainFontColor;
						font-size: $smallFontSize;
					}
				}

				.item-button-list {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					margin-top: 26rpx;

					.item-button-default {
						width: 180rpx;
						height: 64rpx;
						line-height: 64rpx;
						text-align: center;
						font-size: $smallFontSize;
						border-radius: 110rpx;
						margin-right: 14rpx;

						&:last-child {
							margin-right: 0rpx;
						}
					}


					.item-button {
						border: 1rpx solid #909199;
						color: $seconFontColor;
					}

					.item-button-active {
						background-color: $themeColor;
						color: #fff;
					}
				}
			}
		}

		.bottom-button {
			position: fixed;
			width: 100%;
			display: flex;
			bottom: 0rpx;
			justify-content: flex-end;
			align-items: center;
			background-color: #fff;
			padding: 28rpx 38rpx;

			.item-button {
				border: 2rpx solid #EBEBEB;
				border-radius: $miniBorderRadius;
				padding: 24rpx 36rpx;
				font-size: $middleFontSize;
				color: $mainFontColor;
				margin-right: 16rpx;

				&:last-child {
					margin-right: 0rpx;
				}
			}

		}
	}

	.details-contain {
		height: 100%;
		background-color: #fff;
		padding: 54rpx 58rpx 130rpx 58rpx;

		.scroll-Y {
			height: 100%;

			.item-status {
				color: #333333;
				font-size: $middleAddFontSize;
				font-weight: bold;
			}

			.item-pice {
				margin-top: 4rpx;

				.num {
					color: $errorFontColor;
					font-size: 46rpx;
					margin-right: 6rpx;
				}

				.reduce {
					color: #303133 !important;
				}

				.unit {
					color: $seconFontColor;
					font-size: $smallFontSize;
				}
			}

			.item-time {
				margin-top: 8rpx;
				color: $viceFontColor;
				font-size: $smallFontSize;
			}

			.item-desc-contain {
				margin-top: 32rpx;

				.item-desc-title {
					color: $seconFontColor;
					font-size: $middleFontSize;
					font-weight: bold;

				}

				.item-desc {
					margin-top: 8rpx;
					color: $seconFontColor;
					font-size: $smiddleFontSize;
				}
			}

			.image-contain {
				margin-top: 20rpx;

				.image-show-contain {

					/deep/ .item-image-all {
						&:nth-of-type(3n+0) {
							margin-right: 0rpx !important;
						}
					}
				}

			}
		}


		.button-list {
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx 0rpx;

			.item-default {
				height: 84rpx;
				line-height: 84rpx;
				text-align: center;
				border-radius: 10rpx;
				font-size: $middleFontSize;
			}

			.item-button {
				width: 204rpx;
				color: #909299;
				border: 1rpx solid #EBEBEB;
				margin-right: 32rpx;
			}

			.item-button-active {
				color: #fff;
				background-color: $themeColor;
				width: 438rpx;
			}
		}

		.quotation-list-contain {
			.item-title {
				font-size: $middleFontSize;
				color: $seconFontColor;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.quotation-item-list-contain {

				.item-quotation {
					margin-bottom: 26rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-quotation-contain {
						display: flex;
						justify-content: space-between;

						.left {
							.item-index {
								color: $viceFontColor;
								font-size: $smallFontSize;
								margin-right: 4rpx;
							}

							.item-name {
								color: $seconFontColor;
								font-size: $middleFontSize;
								margin-right: 8rpx;
							}

							.item-specifications {
								color: $viceFontColor;
								font-size: $smallFontSize;
							}
						}

						.right {
							font-size: $middleFontSize;
							color: $errorFontColor;
						}
					}
				}
			}

			.quotation-list-total {
				display: flex;
				justify-content: space-between;
				margin-top: 32rpx;
				border-top: 2rpx solid #EEEEEE;
				padding-top: 32rpx;

				.left {
					color: $viceFontColor;
					font-size: $smallFontSize;
				}

				.right {
					.text {
						color: $viceFontColor;
						font-size: $smallFontSize;
						margin-right: 16rpx;
					}

					.pice {
						color: $errorFontColor;
						font-size: 46rpx;
					}

					.unit {
						color: $errorFontColor;
						font-size: $smallFontSize;
					}
				}
			}
		}
	}
</style>
