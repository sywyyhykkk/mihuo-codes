<template>
	<!-- 订单详情 -->
	<view class="order-contain">
		<z-nav-bar type="transparent" fontColor="#FFFFFF" :backState="3000" @backClick="goBack">
			<view class="nav-bar" slot="default">订单详情</view>
		</z-nav-bar>
		<view class="order-header">
			<view class="order-information">
				<view class="order-status">{{ getOrderStatus() }}</view>
			</view>
			<image class="image-status" src="https://www.51mihuo.com/static/images/order_details/ds.png" mode="">
			</image>
		</view>
		<mh-skeleton :loading="!payOrders.length" :imgTitleHeight="300" :row="15">
			<view v-for="detail, index in payOrders" :key="index">
				<view class="order-basic-information public-bm" v-if="detail.status !== 4 && detail.status != 7">
					<view class="basic-item" v-if="index === 0" style="margin-top: -100rpx;">
						<view class="basic-item-contain">
							<image class="order-basic-item-image"
								src="https://www.51mihuo.com/static/images/order_details/car.png" mode="">
							</image>
							<view class="basic-contain" v-if="orderTrends.length !== 0">
								<view class="sent-address">{{ orderTrends[0].content }}</view>
								<view class="time">{{ orderTrends[0].created }}</view>
							</view>
							<view class="basic-contain" v-else>
								<view class="sent-address">
									{{ detail.status === 0 ? '暂未发货' : '处理中...' }}
								</view>
							</view>
						</view>
					</view>
					<view class="basic-item" v-if="index === 0">
						<view class="basic-item-contain">
							<image class="order-basic-item-image"
								src="https://www.51mihuo.com/static/images/order_details/adders.png" mode="">
							</image>
							<view class="basic-contain">
								<view class="name-contain flex-center">
									<view class="left flex-center">
										<view class="user-info">
											{{ detail.receiverName + ' ' + detail.receiverPhone }}
										</view>
									</view>
								</view>
								<view class="address">
									{{
							(detail.receiverProvince || '') + (detail.receiverCity == detail.receiverProvince ? '' : detail.receiverCity || '') +
							(detail.receiverRegion || '') + (detail.receiverLatAddress || '') + (detail.receiverPoiName || '') + 
							(detail.receiverDetailAddress || '')
						 }}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="all-info" v-if="index === 0">
					<view class="info-item flex-center">
						<view class="left-date">
							下单时间 {{ detail.createTime }}
						</view>
						<view class="right-tag" v-if="detail.sourceType == 4">
							项目管家开单
						</view>
					</view>
					<view class="info-item">
						<view class="pic-item">
							<text class="item-lable"
								style="font-weight: bold;">{{ detail.status == 0 ? '应付' : '实付' }}金额</text>
							<text class="item-value actual" style="color: #ED3832">
								￥{{ totalPayAmount }}
							</text>
						</view>
					</view>
				</view>
				<view style="width: 100vw; height: 30rpx; background-color: #F7F7F7;"></view>
				<view class="public-bm public-order">
					<view class="order-top order-item" @click="goShop(detail.company)" v-if="detail.company"
						style="border-radius: 15rpx 15rpx 0 0;">
						<view class="order-code flex-center">
							<text class="order-title">{{ detail.company.companyName }}</text>
							<text class="order-sn"> {{ detail.orderSn }} </text>
							<image class="order-copy" src="https://www.51mihuo.com/static/images/order_details/cp.png"
								mode="" @click.stop="getCopy(detail.orderSn)">
							</image>
						</view>
					</view>
					<view class="order-top order-item" @click="goShop(detail.cityOperator)" v-if="detail.cityOperator">
						<view class="order-code flex-center">
							<text class="order-title">{{ detail.cityOperator.name }}</text>
							<text class="order-sn"> {{ detail.orderSn }} </text>
							<image class="order-copy" src="https://www.51mihuo.com/static/images/order_details/cp.png"
								mode="" @click.stop="getCopy(detail.orderSn)">
							</image>
						</view>
					</view>
					<view class="order-item-page order-item" v-for="(item, index2) in detail.orderItemList"
						:key="index2" @click="goToProductDetail(item)">
						<view class="order-middle">
							<view class="order-middle-contain">
								<view class="order-attachments-coverNew">
									<image class="order-middle-image" border-radius="10" height="176" mode="aspectFill"
										:src="$util.thumbnailImage(item.productPic, true)">
									</image>
								</view>
								<view class="order-information">
									<view class="skill-type-contain">
										<view class="skill-type-all">
											<text class="order-name">{{ item.productName }}</text>
										</view>
										<view class="order-offer">
											<text class="price-symbol">¥</text>
											<text class="price">
												{{ item.productPrice }}
											</text>
										</view>
									</view>
									<view class="order-brand-contain">
										<view class="order-brand">{{ getSkuStr(item.productAttr) }}</view>
										<view class="order-num">x{{ item.productQuantity }}</view>
									</view>
								</view>
							</view>
							<view class="order-pic-statistical-length">
								<text class="gray-value" v-if="item.totalAmount">总价￥{{ item.totalAmount }}</text>
								<text class="gray-value"
									v-if="item.totalPreferentialAmount">,优惠￥-{{ item.totalPreferentialAmount }},</text>
								<text
									v-if="item.payAmount">{{ detail.status == 0 ? '应' : '实' }}付款￥{{ item.payAmount }}</text>
							</view>
							<view class="order-remark">{{ item.remark || ''}}</view>
						</view>
					</view>
					<view class="item-button flex-center" style="border-radius: 0 0 15rpx 15rpx;">
						<text class="item-left" v-if="detail.skillId"
							@click="lookAgreement(detail)">{{agreementObj.name}}</text>
						<view class="item-right" @click="getIm">
							联系卖家
						</view>
					</view>
				</view>
				<view style="width: 100vw; height: 30rpx; background-color: #F7F7F7;"
					v-if="index === payOrders.length - 1"></view>
				<view class="order-pic-statistical" v-if="index === payOrders.length - 1">
					<view class="pic-item" v-if="detail.totalAmount != 0">
						<text class="item-lable">商品总价</text>
						<text class="item-value">￥{{ detail.totalAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.diffAmount != 0">
						<text class="item-lable">补齐费用</text>
						<text class="item-value">￥{{ detail.diffAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.freightAmount != 0">
						<text class="item-lable">运费</text>
						<text class="item-value">￥{{ detail.freightAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.freightInstallationAmount != 0">
						<text class="item-lable">安装费</text>
						<text class="item-value">￥{{ detail.freightInstallationAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.freightStairwayAmount != 0">
						<text class="item-lable">上楼费</text>
						<text class="item-value">￥{{ detail.freightStairwayAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.couponAmount != 0">
						<text class="item-lable">优惠券</text>
						<text class="item-value">-￥{{ detail.couponAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.promotionAmount">
						<text class="item-lable">优惠</text>
						<text
							class="item-value">{{ Number(detail.promotionAmount) > 0 ? `-￥${detail.promotionAmount}` : '￥' + 0 }}</text>
					</view>
					<view class="pic-item">
						<text class="item-lable" style="color: #000000;">{{ detail.status == 0 ? '应付' : '实付' }}金额</text>
						<text class="item-value actual">￥{{ totalPayAmount }}</text>
					</view>
				</view>
				<view style="width: 100vw; height: 100rpx; background-color: #F7F7F7;"
					v-if="index === payOrders.length - 1"></view>
			</view>
		</mh-skeleton>
		<view class="order-details-bottom iphonex-bottom" v-if="payOrders.length && payOrders[0].status === 0">
			<text class="order-bottom-item button-default" @click="orderBottom('取消订单')">
				取消订单
			</text>
			<text class="order-bottom-item button-default" @click="orderBottom('立即付款')">
				立即付款
			</text>
		</view>
		<u-action-sheet @click="confirmPayType" :list="payTypeList" v-model="isShowSheet"
			:safe-area-inset-bottom="true">
		</u-action-sheet>
		<!-- 服务协议 -->
		<mh-agreement v-if="isAgreement" v-model="isAgreement" :info="agreementInfo"></mh-agreement>
	</view>
</template>

<script>
	import {
		copy
	} from '@/plugins/utils.js'
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				curUser: uni.getStorageSync('userData').sysUser,
				isShowSheet: false,
				payTypeList: [{
					text: '支付宝支付',
				}, {
					text: '微信小程序支付'
				}],
				isPay: false, // 是否发起过支付
				isService: false, // 是否是服务订单
				orderTrends: [], // 订单动态
				option: {},
				detail: {},
				orderId: '',
				orderItemListLength: 0,
				agreementObj: {
					name: "服务协议",
					jobCode: ""
				},
				agreementInfo: {},
				agreement: true,
				isAgreement: false,
				isPay: false,
				isRefresh: false,
				payOrderNo: '', // 支付订单号
				payOrderInfo: {}, // 支付订单信息
				payOrders: [], // 多张订单合并支付
				ids: []
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.getOrderDetails()
		},
		computed: {
			totalPayAmount() {
				if (this.payOrders.length) {
					return this.payOrders.reduce((pre, cur) => {
						return this.$math.floatAdd(pre, cur.payAmount)
					}, 0)
				}
				return 0
			}
		},
		methods: {
			// 跳转到商品详情页
			goToProductDetail(item) {
				if (this.detail.orderType === 4) {
					return
				}
				this.toPage(`/pages-mall/productDetail/productDetail?id=${item.productId}`)
			},
			goBack() {
				uni.navigateBack();
				if (this.isRefresh) uni.$emit('refresh');
			},
			// sku信息
			getSkuStr(productAttr) {
				let sku = JSON.parse(productAttr);
				let skuStr = '';
				if (!sku) return skuStr
				sku.forEach((each, index) => {
					skuStr += `${each.value}${index == sku.length - 1 ? '' : '/'}`
				})
				return skuStr;
			},
			confirmPayType(e) {
				let payType = 0
				if (e === 0) {
					payType = 4
				} else if (e === 1) {
					payType = 3
				}
				this.applyPay(payType)
			},
			async applyPay(payType) {
				if (payType == 4) {
					// 支付宝支付
					const payRes = await this.$httpApi.payOrder({
						orderIds: this.ids,
						payMethod: payType
					})
					if (payRes.splitFlag) {

					} else if (payRes.payStatus === 'SUCCESS') {
						// 金额为0的直接支付成功
						this.getOrderDetails()
					} else if (payRes.payInfo) {
						// isPay为true但不代表支付成功了，只是发起了支付
						this.isPay = true
						this.$util.requestPay(payType, {
							orderId: payRes.payInfo
						}, 'mallOrder', () => {
							this.getOrderDetails()
						})
					}
				} else {
					this.$util.requestPay(payType, {
						orderId: {
							orderIds: this.ids
						}
					}, 'mallOrder', () => {
						this.getOrderDetails()
					})
				}
			},
			getCopy(orderSn) {
				copy(orderSn, '复制成功')
			},
			getOrderDetails() {
				this.$httpApi.getMallOrderDetailById(this.option.id).then((res) => {
					if (res) {
						this.payOrders = res
						this.ids = []
						this.payOrders.forEach(item => {
							this.ids.push(item.id)
						})
						if (res.status > 0) {
							this.isRefresh = true
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						}
					} else {
						this.$util.toast('订单不存在或已被删除，即将返回上一页');
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}
				})
			},
			// 点击页面底部按钮
			orderBottom(val) {
				switch (val) {
					case '取消订单':
						this.$httpApi.cancelMallOrderBatch(this.ids).then(res => {
							this.$util.toast('取消成功')
							setTimeout(() => {
								this.goBack()
							}, 1500)
						})
						break
					case '立即付款':
						if (!this.agreement) {
							this.$util.toast('请先同意服务协议')
						} else {
							if (this.totalPayAmount === 0) {
								// 默认为4 支付宝支付 这里不会跳转到支付宝
								this.applyPay(4)
								return
							}
							// #ifndef MP
							this.isShowSheet = true
							// #endif
							// #ifdef MP-WEIXIN
							this.applyPay(3)
							// #endif
						}
						break
				}
			},
			// 获取协议名字
			async getAgreementName(skillId) {
				if (!skillId) return
				let res = await this.$httpApi.getPlatformSkills({
					type: '',
					clientType: 'platform'
				})
				if (res && res.length) {
					let item = res.find((item) => item.skillId == skillId);
					if (item.jobCode == "JOB_MANAGER") {
						this.agreementObj.name = "管家服务协议";
						this.detail.jobCode = "JOB_MANAGER";
					}
					if (item.jobCode == "JOB_DESIGNER") {
						this.agreementObj.name = "设计服务协议";
						this.detail.jobCode = "JOB_DESIGNER";
					}
					if (item.jobCode == "JOB_SUPERVISION") {
						this.agreementObj.name = "监理服务协议";
						this.detail.jobCode = "JOB_SUPERVISION";
					}
					if (item.jobCode == "JOB_WORKER") {
						this.agreementObj.name = "服务用工协议";
						this.detail.jobCode = "JOB_WORKER";
					}
				}
			},
			// 委托内容
			getEntrustContent(data) {
				let name = "";
				if (data) {
					let info = data.map((item) => {
						return item.productName
					})
					name = info.join(",")
				}
				this.detail.requirementName = name;
				return name;
			},
			// 联系卖家
			getIm() {
				this.$util.goToWeixin()
			},
			getOrderStatus() {
				if (!this.payOrders.length) return ''
				if (this.payOrders && this.payOrders[0].status === 0) {
					return '等待支付'
				} else {
					return '服务中'
				}
			},
			// 进店逛逛
			goShop(data) {
				if (data.companyId) {
					this.toPage(`/pages-mall/shopInformation/shopInformation?companyId=${data.companyId}`)
				} else {
					const obj = {
						companyLogo: data.operatorLogo,
						companyShortName: data.name,
						completeAddress: data.address,
						contactTel: data.contactTel
					}
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?cityOperatorId=${data.id}&data=${JSON.stringify(obj)}`
					)
				}
			},
			// 查看协议
			lookAgreement(order) {
				this.agreementInfo.address = (order.receiverProvince || '') + (order.receiverCity == order
						.receiverProvince ? '' : order.receiverCity || '') +
					(order.receiverRegion || '') + (order.receiverLatAddress || '') + (order.receiverPoiName || '') +
					(order.receiverDetailAddress || '')
				this.agreementInfo.requirementName = this.getEntrustContent(order.orderItemList);
				this.agreementInfo.bName = order?.createServer.userName;
				this.agreementInfo.bPhone = order?.createServer.phone;
				this.agreementInfo.name = this.curUser.realName || this.curUser.nickName;
				this.agreementInfo.phone = this.curUser.phone;
				this.agreementInfo.amount = order?.totalAmount;
				this.agreementInfo.created = order?.createTime;
				this.agreementInfo.bidCreated = moment(new Date()).format("YYYY-MM-DD");
				this.agreementInfo.jobCode = order.jobCode;
				this.isAgreement = true;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.public-bm {
		background-color: #ffffff;
		margin: 0 30rpx 0rpx 30rpx;
	}

	.public-order {
		width: 100vw;
		margin: 0 !important;
		background-color: #f7f7f7;

		.order-item {
			width: 690rpx;
			padding: 30rpx;
			margin: 0 30rpx;
			background-color: #ffffff;
		}

		.item-button {
			width: 690rpx;
			height: 100rpx;
			margin: 0 30rpx;
			background-color: #ffffff;
			justify-content: flex-end;
			padding: 0 30rpx;
			border-top: 2rpx solid #f3f3f3;

			.item-left {
				width: max-content;
				height: 50rpx;
				padding: 0 20rpx;
				background: #FFFFFF;
				border: 2rpx solid #FE6E32;
				border-radius: 25rpx;
				text-align: center;
				line-height: 50rpx;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #FE6E32;
				line-height: 50rpx;
			}

			.item-right {
				width: max-content;
				height: 50rpx;
				padding: 0 20rpx;
				background: #FFFFFF;
				border: 2rpx solid #CCCCCC;
				border-radius: 25rpx;
				text-align: center;
				line-height: 50rpx;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #666666;
				line-height: 50rpx;
				margin-left: 40rpx;
			}
		}
	}

	.public-radius {
		border-radius: 15rpx;
	}

	.order-contain {
		padding-bottom: 182rpx;
		color: #F7F7F7;

		.nav-bar {
			color: #ffffff;
			font-weight: 700;
		}

		.order-header {
			background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
			display: flex;
			padding: calc(var(--status-bar-height) + 120rpx) 60rpx 120rpx 40rpx;
			justify-content: space-between;

			.order-information {
				display: flex;
				flex-direction: column;

				.order-status,
				.order-describe {
					color: #ffffff;
					font-weight: bold;
				}

				.order-status {
					font-size: 40rpx;
				}

				.order-describe {
					font-size: 28rpx;
				}
			}

			.image-status {
				width: 130rpx;
				height: 106rpx;
			}
		}

		.order-basic-information {
			border-radius: 15px 15px 5px 5px;
			padding: 0rpx 30rpx 0 30rpx;

			.basic-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #f3f3f3;
				padding: 26rpx 0 26rpx 0;

				&:last-child {
					border-bottom: 0px;
				}

				.basic-item-contain {
					display: flex;
					align-items: center;
				}

				.order-basic-item-image {
					width: 64rpx;
					height: 64rpx;
					margin-right: 28rpx;
				}

				.basic-contain {
					width: 550rpx;

					.sent-address {
						font-weight: bold;
						font-size: 32rpx;
						line-height: 44rpx;
						color: #ff5d35;
						@include bov(2);
					}

					.time {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #999999;
					}

					.name-contain {
						width: 100%;
						height: 44rpx;
						justify-content: space-between;

						.left {
							.user-info {
								width: max-content;
								height: 44rpx;
								max-width: 400rpx;
								font-weight: bold;
								font-size: 32rpx;
								line-height: 44rpx;
								color: #303133;
								margin-right: 20rpx;
								@include toe();
							}
						}
					}

					.address {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #999999;
						max-width: 540rpx;
						margin-top: 20rpx;
					}
				}
			}
		}

		.order-copy {
			width: 28rpx;
			height: 28rpx;
			margin-left: 10rpx;
		}

		.order-information-detalis {
			width: 100vw;
			min-height: auto;
			padding: 30rpx;
			background-color: #F7F7F7;

			.detalis-header {
				padding-bottom: 24rpx;
				border-bottom: 2rpx solid #eeeeee;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #303133;
			}

			.detalis-middle {
				padding: 40rpx 0 40rpx 0;
				border-bottom: 2rpx solid #eeeeee;
				position: relative;

				.details-item {
					margin-bottom: 28rpx;

					&:nth-last-child(2) {
						margin-bottom: 0;
					}

					text {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #666666;
					}
				}
			}

			.order-agreement_item {
				view {
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}
			}

			.order-agreement {
				display: flex;
				align-items: center;
				padding-bottom: 10rpx;

				.order-agreement_title {
					color: #000000;
					font-size: 32rpx;
				}

				.checkbox {
					display: block;
					margin-right: 10rpx;
				}

				text {
					color: #FE6E32;
					font-size: 32rpx;
				}
			}

			.flex-box {
				display: flex;
				align-items: flex-start;
			}

			.detalis-bottom {
				padding-top: 40rpx;
				text-align: center;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #909199;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					display: inline-block;
					width: 54rpx;
					height: 54rpx;
					margin-right: 16rpx;
				}
			}
		}
	}


	.all-info {
		width: 100vw;
		padding: 0 30rpx;

		.info-item {
			width: 100%;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.left-date {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #000000;
				line-height: 34rpx;
			}
		}
	}

	.pic-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 26rpx;

		.item-lable {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #999999;
		}

		.item-value {
			font-size: 30rpx;
			color: #606166;
		}

		.actual {
			color: #ff5d35;
		}
	}

	.order-pic-statistical {
		width: 690rpx;
		margin: 0rpx 30rpx;
		padding: 0 30rpx;
		padding-top: 30rpx;
	}

	.order-remark {
		font-size: 24rpx;
		color: #909199;
		padding-top: 20rpx;
	}

	.order-pic-statistical-length {
		text-align: right;

		.gray-value {
			color: #909199;
			margin-right: 8rpx;
		}

		text {
			font-size: 24rpx;
		}
	}

	.order-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 26rpx 0;
		margin-bottom: 28rpx;

		.order-code {
			font-size: 28rpx;

			.order-title {
				font-weight: bold;
				font-size: 30rpx;
				line-height: 42rpx;
				color: #303133;
			}

			.order-sn {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #000000;
				line-height: 42rpx;
				margin-left: 20rpx;
			}
		}

		.order-status {
			font-size: 32rpx;
			color: #ff5d35;
			font-weight: bold;
		}
	}

	.right-tag {
		width: max-content;
		padding: 4rpx 10rpx;
		font-size: 18rpx;
		color: $themeColor;
		background-color: #ffece5;
		border-radius: 16rpx;
	}

	.order-item-page {
		background-color: #ffffff;
		margin: 0 30rpx 0rpx 30rpx;
		padding: 30rpx;

		.order-middle {
			padding-bottom: 22rpx;
			display: flex;
			flex-direction: column;

			.order-middle-contain {
				display: flex;
				margin-bottom: 18rpx;
			}

			.order-middle-image {
				margin-right: 28rpx;
				width: 176rpx;
				height: 176rpx;
			}

			.order-attachments-coverNew {
				position: relative;
			}

			.order-information {
				display: flex;
				flex-direction: column;
				flex: 1;

				.skill-type-contain {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 8rpx;
					margin-top: 10rpx;

					.skill-type {
						margin-top: 6rpx;
					}

					.skill-type-all {
						display: flex;
						flex-direction: row;
					}

					.order-offer {
						.price {
							font-size: 36rpx;
							color: #ff5d35;
							font-weight: bold;
						}

						.price-symbol {
							font-size: 24rpx;
							margin-right: 4rpx;
							color: #ff5d35;
						}
					}
				}

				.order-brand-contain {
					display: flex;
					width: 100%;
					align-items: center;
					margin-bottom: 10rpx;
					justify-content: space-between;

					.order-num {
						font-weight: bold;
						font-size: 24rpx;
						line-height: 34rpx;
						text-align: center;
						color: #303133;
					}
				}

				.order-brand {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					max-width: 352rpx;
					color: #909299;
					font-size: 28rpx;
				}

				.order-name {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #303133;
					max-width: 300rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.item-image {
					&:first-child {
						margin-left: 0;
					}

					margin-left: -10rpx;
				}

				.offer-personnel {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.offer-personnel-contain {
					display: flex;
				}

				.personnel-num {
					color: #999999;
					font-size: 28rpx;
					margin-left: 4rpx;
				}
			}
		}
	}

	.order-details-bottom {
		height: 162rpx;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		z-index: 10;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 20rpx;

		text {
			text-align: center;
			display: inline-block;
			padding: 24rpx;
			border-radius: 10rpx;
		}

		.button-default {
			border: 2rpx solid #ebebeb;
			margin-right: 14rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #303133;

			&:last-child {
				margin-right: 0;
				color: #ffffff;
				background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
			}
		}

		.view-list {
			background: none !important;
			background-color: #000000 !important;
			color: #FFFFFF !important;
		}

		.button-orange {
			color: #ffffff;
			background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	/deep/ .u-checkbox {
		margin-right: 8rpx;
	}

	/deep/ .u-checkbox__label {
		display: none;
	}

	.service-contain {
		.item-service {
			position: relative;
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 40rpx;
		}

		.item-contian {
			padding-top: 30rpx;

			.check-contain {
				display: flex;
				align-items: center;

				.item-name {
					color: #303133;
					font-size: 28rpx;
				}
			}

			.item-text-contain {
				.item-title {
					margin-top: 24rpx;
					color: #606166;
					font-size: 26rpx;
					line-height: 40rpx;
					margin-bottom: 10rpx;
				}

				.item-form {
					display: flex;

					.item-label {
						white-space: nowrap;
					}
				}

				.item-address {
					@include toe();
				}

				.item-context {
					@include bov(2);
				}

				text {
					color: #606166;
					font-size: 26rpx;
					line-height: 40rpx;
				}
			}
		}

		.item-mask {
			text-align: center;
			position: absolute;
			width: 660rpx;
			height: 256rpx;
			top: 150rpx;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, #F1F1F1 80%);
			box-sizing: border-box;

			.item-bottom {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				bottom: 28rpx;
				left: 50%;
				transform: translateX(-50%);
			}

			text {
				color: #95886A;
				font-size: 26rpx;
			}

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	::v-deep .u-drawer-content {
		// background-color: transparent !important;
	}

	::v-deep .uni-progress-bar {
		border-radius: 10px;
	}

	::v-deep .uni-progress-inner-bar {
		border-radius: 10px;
	}
</style>
