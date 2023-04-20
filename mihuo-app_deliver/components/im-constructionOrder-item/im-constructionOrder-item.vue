<template>
	<view class="call">
		<view class="tabs-content">
			<view class="tabs-content-header">
				<view class="header-left">
					<view class="type">{{ contructionOrder.skillName }}</view>
					<view class="title">{{ contructionOrder.requirementDesc }}</view>
				</view>
				<text
					:class="'header-right row_'+ contructionOrder.orderStatus">{{ getStatusName(contructionOrder.orderStatus).name }}</text>
			</view>
			<view class="tabs-content-main">
				<u-icon name="map"></u-icon>
				<view class="address">
					{{ (contructionOrder.provinceName || '') + (contructionOrder.cityName==contructionOrder.provinceName?'': contructionOrder.cityName|| '') + (contructionOrder.districtName || '') + (contructionOrder.latAddress || '') + (contructionOrder.poiName || '') + (contructionOrder.address || '') }}
				</view>
			</view>
			<view class="tabs-content-footer">
				<view class="footer-left">
					<view v-if="(contructionOrder.priceWay == 1)">
						<text>{{ contructionOrder.price }}</text>
						<text>元 /一口价</text>
					</view>
					<view v-if="(contructionOrder.priceWay == 2) && (contructionOrder.orderStatus<20)">
						<text>{{ contructionOrder.price }}</text>
						<text>元 /竞价模式</text>
					</view>
					<text v-if="(contructionOrder.priceWay==3)&&(contructionOrder.orderStatus==10)"
						class="wait-price">待议价</text>
					<view v-if="(contructionOrder.priceWay!=1)&&(contructionOrder.orderStatus>=20)">
						<text>{{ contructionOrder.offerPrice }}</text>
						<text>元</text>
					</view>
				</view>
				<view class="footer-right">
					<!-- <view v-if="contructionOrder.orderStatus == '20'">
						<text v-if="priceCalc(contructionOrder.price,contructionOrder.paidAmount) != 0 ">
							<text class="tips-text">{{ priceCalc(contructionOrder.price,contructionOrder.paidAmount)>0?"待付款":"待退款"}}</text>
							<text class="people">{{ priceCalc(contructionOrder.price,contructionOrder.paidAmount) }}</text>
							<text class="tips-text">元</text>
						</text>
					</view> -->
					<view v-if="contructionOrder.orderStatus == 20">
						<text>
							<text class="tips-text">待付</text>
							<text class="people">{{ contructionOrder.offerPrice }}</text>
							<text class="tips-text">元</text>
						</text>
					</view>
					<view v-if="contructionOrder.orderStatus == 10">
						<text v-if="contructionOrder.priceWay == 2">
							<text class="people">{{ contructionOrder.competitionCount }}人</text>
							<text class="status">已报价</text>
						</text>
						<text v-else class="tips-text">{{Number(contructionOrder.competitionCount)>0?'已接单':''}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getStatusName
	} from "@/plugins/orderStatus.js";
	export default {
		props: {
			contructionOrder: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				/**
				 * 订单状态
				 * 10：已发布/待确认
				 * 20：已确认/待付款
				 * 30：已付款/服务中
				 * 35：已申请/待验收
				 * 40：待结算
				 * 50：已完成/待评价
				 * 51：已完成/已评价
				 * -1：已取消
				 */
				record: [10, 20, 30, 35],
				getStatusName: getStatusName,
				curTabs: 0,
				pageObj: {
					current: 1,
					pageSize: 10,
					total: 0,
					pages: 0,
				},
				latitude: uni.getStorageSync('latitude') || 0,
				longitude: uni.getStorageSync('longitude') || 0,
				orderList: [],
				status: 'nomore',
				orderStatus: '',
				scrollTop: 0
			}
		},
		onShow() {
			this.getListData()
		},
		// 滚动到底部加载更多
		onReachBottom() {
			if (this.orderList.length === Number(this.pageObj.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pageObj.pageSize += 10
				setTimeout(() => {
					this.getListData()
				}, 200)
			}
		},
		methods: {
			clickTabs(tabs, index) {
				this.curTabs = index;
				this.orderStatus = tabs.orderStatus;
				this.getListData(tabs.orderStatus)
			},
			// 获取列表
			getListData() {
				uni.showLoading();
				this.$http.get('order/biz_order/self/publish', {
					current: this.pageObj.current,
					size: this.pageObj.pageSize,
					latitude: this.latitude,
					longitude: this.longitude,
					orderStatus: this.orderStatus,
				}).then(res => {
					this.pageObj.total = res.total;
					this.orderList = res.records;
					if (this.pageObj.pageSize >= res.total) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
					this.isRecord(this.orderList)
				}).finally(() => {
					uni.hideLoading();
				})
			},
			// 判断是否有记录
			isRecord(data) {
				if (this.curTabs == 0) {
					let arr = [];
					if (data && data.length) {
						data.forEach(ele => {
							arr.push(ele.orderStatus)
						});
					}
					this.record = Array.from(new Set(arr))
				}
			},
			/**
			 * 价格计算
			 * @total 总价
			 * @paidAmount 已收款金额
			 */
			priceCalc(total, paidAmount) {
				let num = (Number(total) || 0) - (Number(paidAmount) || 0)
				return Number(num.toFixed(2))
			},
			// 详情
			lookDetail(data) {
				this.toPage('/pages/order/callOrderDetails?id=' + data.id)
			}
		}
	}
</script>

<style scoped lang="scss">
	// page{
	// 	height: 100vh;
	// }
	.call {
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 100%;
		width: 100%;

		.nav-bar-title {
			font-weight: bold;
			color: #141414;
		}

		.call-nav {
			width: 710rpx;
			box-sizing: border-box;
			height: 130rpx;
			background: #F1F1F1;
			z-index: 999;

			.call-tabs {
				width: 710rpx;
				background: #F1F1F1;
				position: fixed;
				z-index: 999;
				// top: calc(86rpx + var(--status-bar-height));
				display: flex;
				// justify-content: space-between;
				height: 100rpx;
				line-height: 100rpx;

				.call-tabs_flex {
					flex: 1;
					text-align: center;
					font-family: PingFang-SC-Medium;
					position: relative;

					.tabs_flex-title {
						color: #808080;
						font-size: $fontSize26;
					}

					.tabs_flex-tips {
						width: 10rpx;
						height: 10rpx;
						border-radius: 50%;
						background: #FE6E32;
						display: inline-block;
						position: absolute;
						top: 40rpx;
						right: 15rpx;
					}
				}

				.buttonClick {
					position: relative;

					.tabs_flex-title {
						color: #141414;
					}

					&::before {
						content: '';
						width: 30rpx;
						height: 10rpx;
						border-radius: 10rpx;
						position: absolute;
						bottom: 20rpx;
						left: 50%;
						transform: translateX(-50%);
						background: -webkit-linear-gradient(to right, #FE6E32, #FFFFFF);
						/* Safari 5.1 - 6.0 */
						background: -o-linear-gradient(to right, #FE6E32, #FFFFFF);
						/* Opera 11.1 - 12.0 */
						background: -moz-linear-gradient(to right, #FE6E32, #FFFFFF);
						/* Firefox 3.6 - 15 */
						background: linear-gradient(to right, #FE6E32, #FFFFFF);
						/* 标准的语法（必须放在最后） */
					}
				}
			}
		}

		.tabs-content {
			width: 710rpx;
			padding: 40rpx;
			box-sizing: border-box;
			border-radius: 24rpx;
			background: #FFFFFF;
			margin-bottom: 20rpx;

			.tabs-content-header {
				display: flex;
				justify-content: space-between;

				.header-left {
					display: flex;
					align-items: center;
					width: calc(100% - 100px);

					.type {
						color: #FE6E32;
						font-size: 22rpx;
						border: 1px solid #FE6E32;
						border-radius: 6rpx;
						padding: 0 10rpx;
						flex-shrink: 0;
						margin-right: 20rpx;
						font-family: CKTKingKong;
					}

					.title {
						flex: 1;
						color: #141414;
						font-size: $middleFontSize;
						font-weight: bold;
						font-family: PingFang-SC-Bold;
						@include toe();

					}
				}

				.header-right {
					color: #FE6E32;
					font-size: 22rpx;
					font-weight: bold;
					width: 200rpx;
					flex-shrink: 0;
					text-align: right;
					font-family: PingFang-SC-Bold;

					&.row_40 {
						color: #808080;
					}

					&.row_50 {
						color: #808080;
					}

					&.row_51 {
						color: #808080;
					}

					&.row_-1 {
						color: #CACACA;
					}
				}

				// .header-right1{
				// 	color: #808080;
				// 	font-size: 22rpx;
				// 	font-weight: bold;
				// 	width: 200rpx;
				// 	flex-shrink: 0;
				// 	text-align: right;
				// }
			}

			.tabs-content-main {
				width: calc(100% - 100px);
				display: flex;
				align-items: center;
				padding: 20rpx 0;

				.u-icon {
					margin-right: 10rpx;
				}

				.address {
					color: #141414;
					font-size: $smallFontSize;
					font-family: PingFang-SC-Medium;
					@include toe();
				}
			}

			.tabs-content-footer {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;

				.footer-left {
					view {
						text {
							color: #141414;
							font-size: 22rpx;
							font-family: PingFang-SC-Medium;

							&:first-child {
								color: #FE6E32;
								font-size: 38rpx;
								font-weight: bold;
								margin-right: 10rpx;
								font-family: Arial-BoldMT;
							}
						}
					}

					.wait-price {
						color: #FE6E32;
						font-size: $middleFontSize;
						font-weight: bold;
						margin-right: 10rpx;
						font-family: CKTKingKong;
					}
				}

				.footer-right {
					.people {
						color: #FE6E32;
						font-size: 26rpx;
						font-weight: bold;
						margin: 0 10rpx;
					}

					.status {
						color: #808080;
						font-size: 22rpx;
					}

					.tips-text {
						color: #141414;
						font-size: $smallFontSize;
					}
				}
			}
		}
	}
</style>
