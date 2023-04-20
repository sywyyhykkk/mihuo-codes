<template>
	<view class="construction">
		<z-nav-bar fontColor="#141414" bgColor="#F5F5F5">
			<view class="nav-bar-title" slot="default">{{ title }}</view>
			<image slot="right" src="https://www.51mihuo.com/static/images/order_details/share.png"
				class="nav-bar-share" @click="getShare" />
		</z-nav-bar>
		<!-- 师傅信息 -->
		<view class="construction-master">
			<view class="master borderButtom">
				<view class="title">
					<text>师傅信息</text>
					<text class="tips">{{ getStatusName(orderStatus) && getStatusName(orderStatus).name }}</text>
				</view>
				<order-worker-item :item="workerData" @orderReceiving="()=>choiceWorkerPopup=true" />
				<!-- 组合报价 -->
				<view class="construction-com">
					<view v-if="orderInfo.groupPrices && orderInfo.groupPrices.length">
						<!-- 关闭状态 -->
						<view class="groupPrices" v-if="!isCollse">
							<view>
								<view v-if="JSON.parse(orderInfo.groupPrices[0].productJson).length"
									class="productJson">
									<view class="item_list"
										v-for="(v,i) in JSON.parse(orderInfo.groupPrices[0].productJson)" :key="i">
										<image class="image" :src="$util.thumbnailImage(v.coverImg)" />
										<view>{{ v.name }}</view>
									</view>
								</view>
							</view>
							<view class="groupPrices_collse" @click="()=>isCollse = true">
								<text>展开</text>
								<u-icon name="arrow-down" color="#FE6E32" size="22"></u-icon>
							</view>
						</view>
						<!-- 展开状态 -->
						<view v-else class="groupPrices-up">
							<view v-if="JSON.parse(orderInfo.groupPrices[0].productJson).length">
								<view v-for="(v,i) in JSON.parse(orderInfo.groupPrices[0].productJson)" :key="i"
									class="productJson">
									<view class="item_list">
										<image class="image" :src="$util.thumbnailImage(v.coverImg)" />
										<view>{{ v.name }}</view>
										<text>{{ v.selectNum+'/'+v.unit }}</text>
									</view>
									<view class="price">{{ v.totalPice }}</view>
								</view>
							</view>
							<view class="groupPrices_collse" @click="()=>isCollse = false">
								<text>关闭</text>
								<u-icon name="arrow-up" color="#FE6E32" size="22"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="construction-req borderButtom">
				<view class="detailed_buttom">
					<view @click="workdo('打卡记录')">打卡记录</view>
					<!-- <view @click="workdo('施工日志')">施工日志</view> -->
				</view>
			</view>
			<!-- 施工日志 -->
			<view>
				<build-log :data="buildLogData" />
				<u-loadmore v-if="buildLogData.length" :status="status" />
			</view>
		</view>
		<!-- 选择师傅接单详情 -->
		<mh-order-receiving v-model="choiceWorkerPopup" :orderInfo="orderInfo" :workerInfo="workerData" />
	</view>
</template>

<script>
	import {
		getStatusName
	} from "@/plugins/orderStatus.js";
	export default {
		data() {
			return {
				workerData: {},
				title: '服务情况',
				orderStatus: '',
				getStatusName: getStatusName,
				id: "",
				orderId: "",
				choiceWorkerPopup: false,
				orderInfo: {},
				isCollapse: false,
				accepptQust: {},
				workflow: {},
				isCollse: false,
				buildLogData: [],
				pageObj: {
					current: 1,
					pageSize: 10,
					total: 0,
					pages: 0,
				},
				status: 'nomore',
			}
		},

		onLoad(option) {
			this.id = option.id;
			this.orderId = option.orderId;
		},
		// 滚动到底部加载更多
		onReachBottom() {
			if (this.buildLogData.length === Number(this.pageObj.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pageObj.current++
				setTimeout(() => {
					this.getBuildLogList()
				}, 200)
			}
		},
		onShow() {
			this.getWorkerInfo();
		},
		methods: {
			// 获取订单信息
			getWorkerInfo() {
				uni.showLoading({
					mask: true,
				});
				this.$http.get(`order/bidorder/list?orderId=${this.orderId}`).then(res => {
					if (res) {
						this.orderInfo = res.bizOrder;
						this.orderStatus = res.bizOrder.orderStatus;
						if (res.offerList && res.offerList.length) {
							this.workerData = res.offerList[0];
							this.title = `${this.workerData.skillName || ''}`;
							this.getWorkFlow(this.workerData.skillId)
						}
						this.getBuildLogList();
					}
				}).finally(() => {
					uni.hideLoading();
				})
			},
			getShare() {

			},
			//获取施工日志
			getBuildLogList() {
				this.$httpApi
					.getBuildLog({
						orderId: this.orderId,
						current: this.pageObj.current,
						size: this.pageObj.pageSize,
					})
					.then((res) => {
						if (res) {
							this.buildLogData.push(...res.records);
							this.pageObj.total = res.total;
						}
					})
			},
			// 获取工作流程
			getWorkFlow(skillId) {
				this.$http.get(`admin/sysjobskill/${skillId}`).then(res => {
					if (res) {
						this.workflow = res
					}
				})
			},
			collapse() {
				this.isCollapse = !this.isCollapse
			},
			workdo(name) {
				switch (name) {
					case "打卡记录":
						this.toPage(
							`/pages-order/punchInRecord?orderId=${this.workerData.orderId}&orderCode=${this.workerData.orderCode}&personId=${this.workerData.personId}&projectId=${this.workerData.projectId}&skillName=${this.workerData.skillName || ''}`
							)
						break;
					case "服务日志":
						this.toPage(
							`/pages-order/constructionLog?orderId=${this.workerData.orderId}&orderCode=${this.workerData.orderCode}&personId=${this.workerData.personId}&projectId=${this.workerData.projectId}&skillName=${this.workerData.skillName || ''}`
							)
						break;
					default:
						break;
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.construction {
		height: 100vh;
		background-color: #F5F5F5;

		.nav-bar-title {
			font-weight: bold;
			color: #141414;
		}

		.nav-bar-share {
			width: 34rpx;
			height: 33rpx;
			margin-right: 30rpx;
		}

		.construction-master {
			position: absolute;
			right: 0;
			left: 0;
			bottom: 0;
			top: calc(88rpx + var(--status-bar-height));
			background: #FFFFFF;
			border-radius: 18rpx 18rpx 0 0;
			padding: 0 30rpx 20rpx;
			box-sizing: border-box;

			.construction-com {
				margin: 20rpx 0 0 180rpx;

				.groupPrices {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.productJson {
						display: flex;
						align-items: center;
						width: 340rpx;
						@include toe();

						.item_list {
							display: flex;
							align-items: center;
							padding-right: 20rpx;

							.image {
								width: 26rpx;
								height: 26rpx;
								margin-right: 5rpx;
							}

							view {
								color: #000000;
								font-size: 22rpx;
								width: 130rpx;
								@include toe();
							}
						}
					}
				}

				.groupPrices-up {
					.productJson {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.item_list {
							display: flex;
							align-items: center;
							padding-bottom: 10rpx;

							.image {
								width: 26rpx;
								height: 26rpx;
							}

							view {
								color: #000000;
								font-size: 22rpx;
								padding: 0 10rpx;
							}

							text {
								font-size: $smallFontSize;
								color: #808080;
							}
						}

						.price {
							color: #808080;
							font-size: $smallFontSize;
						}
					}
				}

				.groupPrices_collse {
					display: flex;
					justify-content: flex-end;

					text {
						color: #FE6E32;
						font-size: 22rpx;
						margin-right: 5rpx;
					}
				}
			}

			.construction-req {
				.detailed_buttom {
					display: flex;
					justify-content: flex-end;
					margin-top: 20rpx;

					view {
						color: #141414;
						font-size: 24rpx;
						font-weight: bold;
						border: 2rpx solid #141414;
						padding: 20rpx 40rpx;
						border-radius: 12rpx;
					}
				}

				.construction-content {
					.submit_time {
						font-size: 22rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #808080;
					}

					.describe {
						font-size: $fontSize26;
						font-family: PingFang SC;
						font-weight: 500;
						color: $mainFontColor14;
						margin-top: 10rpx;
						@include bov(3);
					}

					.image_show {
						margin-top: 20rpx;
					}
				}
			}
		}

		.standard-collapse {
			background: #F8F8F8;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 6rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.collapse-title {
				color: #808080;
				font-size: 22rpx;
				margin-right: 10rpx;
			}
		}
	}

	.title {
		padding: 20rpx 0;
		color: #141414;
		font-size: 30rpx;
		font-weight: bold;
		font-family: PingFang-SC-Bold;

		.tips {
			color: #808080;
			font-size: 22rpx;
			margin-left: 10rpx;
		}
	}

	.borderButtom {
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #E6E6E6;
	}
</style>
