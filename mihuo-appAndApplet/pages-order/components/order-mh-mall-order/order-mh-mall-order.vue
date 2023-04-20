<template>
	<view class="order-item">
		<!-- 订单头部(企业信息 订单状态) -->
		<view class="order-top flex-center">
			<view class="company-name flex-center" v-if="orderEntity.order.company"
				@click="goShop(orderEntity.order.company)">
				<u-avatar size="40" v-if="orderEntity.order.company"
					:src="$util.thumbnailImage(orderEntity.order.company.companyLogo, true)">
				</u-avatar>
				<text class="company-title" v-if="orderEntity.order.company">
					{{ orderEntity.order.company.companyShortName }}
				</text>
				<image @click.stop="goToShopMessage(orderEntity.order)" class="icon-2"
					src="https://www.51mihuo.com/static/icon/shop_msg-25x25.png"></image>
			</view>
			<view class="company-name flex-center" v-if="orderEntity.order.cityOperator"
				@click="goShop(orderEntity.order.cityOperator)">
				<u-avatar size="40" v-if="orderEntity.order.cityOperator"
					:src="$util.thumbnailImage(orderEntity.order.cityOperator.operatorLogo, true)">
				</u-avatar>
				<text class="company-title" v-if="orderEntity.order.cityOperator">
					{{ orderEntity.order.cityOperator.shortName }}
				</text>
				<image class="icon-1" src="https://www.51mihuo.com/static/icon/self_hold-76x30.png"></image>
				<image @click.stop="goToShopMessage(orderEntity.order)" class="icon-2"
					src="https://www.51mihuo.com/static/icon/shop_msg-25x25.png"></image>
			</view>
			<view class="order-status" :style="{ color: orderEntity.order.status == 7 ? '#909299' : '#FE6E32' }">
				{{ getOrderStatus(orderEntity.order.status, orderEntity.order) }}
			</view>
		</view>
		<!-- 订单中部(订单商品信息) -->
		<!-- 未拆分成多个订单 -->
		<view style="margin-bottom: 30rpx;" @click="goToMallOrderDetail(orderEntity.order)">
			<!-- orderItemList只有一项 显示商品名称、sku等信息  -->
			<view class="order-middle flex-center"
				v-if="orderEntity.order.orderItemList && orderEntity.order.orderItemList.length === 1">
				<image class="order-product-image" border-radius="20" height="176" imgMode="aspectFill"
					:src="$util.thumbnailImage(orderEntity.order.orderItemList[0].productPic, true)">
				</image>
				<view class="order-information flex-center">
					<view class="product-info flex-center">
						<view class="product-name">
							{{ orderEntity.order.orderItemList[0].productName }}
						</view>
						<!-- 	<view class="product-price">
							<text class="price" style="font-size: 24rpx;">¥</text>
							<text class="price">{{ Math.floor(orderEntity.order.orderItemList[0].productPrice) }}</text>
							<text class="price" style="font-size: 24rpx;">{{ orderEntity.order.orderItemList[0].productPrice | priceFormat }}</text>
						</view> -->
					</view>
					<view class="product-sku flex-center">
						<view class="sku-label">{{ getSkuStr(orderEntity.order.orderItemList[0].productAttr) }}</view>
						<!-- <view class="product-num" v-show="orderEntity.order.orderItemList[0].productQuantity">
							x{{ orderEntity.order.orderItemList[0].productQuantity }}
						</view> -->
					</view>
					<view class="product-sku flex-center" v-if="orderEntity.order.orderItemList[0].refundStatus">
						<view class="sku-label">
							{{ getRefundStatusName(orderEntity.order.orderItemList[0].refundStatus) }}
						</view>
					</view>
					<view class="product-sku flex-center" v-if="orderEntity.order.groupBuyFlag === 1">
						<view class="group-deal flex-center" v-if="groupLeft > 0">
							<view class="tag">拼</view>
							<view class="user-avatar flex-center" v-for="user, uIndex in orderEntity.order.groupUsers"
								:key="uIndex">
								<u-avatar :src="$util.avatarImage(user.userId)" size="32"></u-avatar>
							</view>
							<view class="user-circle" v-for="circle, cIndex in groupLeft" :key="'c_' + circle">
								?
							</view>
							<view class="deal-status">
								{{ getGroupOrderStatus }}
							</view>
						</view>
					</view>
					<!-- <view class="fill-amount flex-center" v-if="orderEntity.order.diffAmount">
					<text class="label">
						补齐费用
					</text>
					<text class="price" style="font-size: 24rpx; margin-top: 4rpx;">¥</text>
					<text class="price"> {{ orderEntity.order.diffAmount }}</text>
				</view> -->
				</view>
			</view>
			<!-- orderItemList有多个商品 显示封面图 -->
			<view v-else class="order-middle flex-center" style="justify-content: space-between;">
				<view class="flex-center">
					<image v-for="(item, index2) in getImageList().slice(0, 3)" :key="index2"
						class="order-product-image" border-radius="20" height="176" imgMode="aspectFill"
						:src="$util.thumbnailImage(item.productPic, true)">
					</image>
				</view>
				<view class="order-amount flex-center">
					<view class="left">
						共{{ getImageList().length }}件
					</view>
				</view>
			</view>
			<view class="product-refund" v-if="orderEntity.order.orderItemList[0].refundStatus == 4">
				<view>拒绝时间：{{ orderEntity.order.orderItemList[0].rejectRefundTime || '' }}</view>
				<view>拒绝理由：{{ orderEntity.order.orderItemList[0].rejectRefundReason || '' }}</view>
			</view>
			<!-- 订单底部(总价信息) -->
			<view class="order-bottom flex-center">
				<view class="left">
					<view class="left-tag" v-if="orderEntity.order.sourceType == 4">
						{{ orderEntity.order.createServer.skillName || '项目管家' }}开单
					</view>
				</view>
				<view class="right flex-center" v-if="orderEntity.order.paySplitFlag != 1">
					<!-- <view class="gray-value" v-show="orderEntity.order.payAmount">
						总价￥{{ orderEntity.order.payAmount }}
					</view> -->
					<view class="pay-price" v-if="orderEntity.order.status != 7">
						<!-- <text class="price-label">
							{{ orderEntity.order.status == 0 ? '应' : '实' }}付款
						</text> -->
						<text class="price" style="font-size: 24rpx;">￥</text>
						<text class="price">{{ Math.floor(orderEntity.order.payAmount) }}</text>
						<text class="price" v-if="orderEntity.order.payAmount > 0"
							style="font-size: 24rpx;">{{ orderEntity.order.payAmount | priceFormat }}</text>
					</view>
				</view>
			</view>
			<view class="order-pay-stages" v-if="orderEntity.order.payStages && orderEntity.order.payStages.length">
				<order-mh-pay-stages :dataList="orderEntity.order.payStages"
					@payOrder="buttonClick('继续付款', orderEntity.order)"></order-mh-pay-stages>
			</view>
			<view class="order-split-info" v-if="orderEntity.order.paySplitFlag == 1 && installmentOrders.length">
				<view class="amount-info flex-center">
					<text class="price-label">
						实付款
					</text>
					<view class="left">
						<text style="font-size: 24rpx;">
							¥
						</text>
						<text style="font-size: 36rpx;">
							{{ Math.floor(getPaidAmount['amount'] / 100) }}
						</text>
						<text style="font-size: 24rpx;">
							{{ getPaidAmount['amount'] / 100 | priceFormat}}
						</text>
					</view>
					<view class="right">
						<text style="font-size: 24rpx;">
							/¥
						</text>
						<text style="font-size: 36rpx;">
							{{ Math.floor(orderEntity.order.payAmount) }}
						</text>
						<text style="font-size: 24rpx;">
							{{ orderEntity.order.payAmount | priceFormat }}
						</text>
					</view>
				</view>
				<view class="installment-item flex-center" v-for="item, index in installmentOrders" :key="index">
					<view class="item-count">
						第{{ getBigNumber(index + 1) }}笔
					</view>
					<view class="item-amount" v-if="item.amount">
						<text style="font-size: 20rpx;">¥</text>
						<text style="font-size: 30rpx;">{{ Math.floor(item.amount / 100) }}</text>
						<text style="font-size: 20rpx;">{{ item.amount / 100 | priceFormat }}</text>
					</view>
					<view class="item-status unpay" v-if="item.payStatus === 'pending'"
						:style="{ backgroundImage: 'url(../static/images/unpay.png)' }">
						未支付
					</view>
					<view class="item-status paid" v-else
						:style="{ backgroundImage: 'url(../static/images/paid.png)' }">
						已支付
					</view>
					<view class="item-time" v-if="item.payTime">
						{{ item.payTime.split('-')[1] + '-' + item.payTime.split('-')[2] }}
					</view>
					<view class="item-button" v-else @click="payInstallmentItem(item)">
						去支付
					</view>
				</view>
			</view>
		</view>
		<!-- 订单操作按钮 -->
		<view class="order-buttons flex-center">
			<!-- orderEntity.order.orderType 0=商品订单 1=服务订单 2=协作订单 -->
			<view class="button-item active"
				v-if="orderEntity.order.groupBuyFlag === 1 && orderEntity.order.status === 12 && orderEntity.order.orderItemList[0].refundStatus !== 1"
				@click.stop="buttonClick('分享拼单', orderEntity.order)">
				邀请好友拼单
			</view>
			<view class="button-item active" v-if="orderEntity.order.status == 0"
				@click.stop="buttonClick('继续付款', orderEntity.order)">
				继续付款
			</view>
			<view class="button-item active" v-if="orderEntity.order.status == 4 && orderEntity.order.replyStatus != 2"
				@click.stop="buttonClick('评价', orderEntity.order)">
				评价
			</view>
			<view class="button-item active" v-if="orderEntity.order.status == 2 && orderEntity.order.orderType == 0"
				@click.stop="buttonClick('确认收货', orderEntity.order)">
				确认收货
			</view>
			<view class="button-item" v-if="orderEntity.order.status == 0"
				@click.stop="buttonClick('取消订单', orderEntity.order)">
				取消订单
			</view>
			<view class="button-item"
				v-if="orderEntity.order.status != 7 && orderEntity.order.status > 0 && checkRefundStatus(orderEntity.order)"
				@click.stop="buttonClick('申请退款', orderEntity.order)">
				申请退款
			</view>
			<view class="button-item" v-if="orderEntity.order.status == 8"
				@click.stop="buttonClick('撤销申请', orderEntity.order)">
				撤销申请
			</view>
			<view class="button-item" v-if="orderEntity.order.status == 7"
				@click.stop="buttonClick('删除订单', orderEntity.order)">
				删除订单
			</view>
			<view class="button-item"
				v-if="orderEntity.order.status == 3 && orderEntity.order.constructionOrderId && orderEntity.order.constructionOrderId != '0' && orderEntity.order.sourceType != 4"
				@click.stop="buttonClick('去验收', orderEntity.order)">
				去验收
			</view>
		</view>
		<u-popup v-model="isShowSharePopup" mode="center" closeIconSize="24" closeable closeIconColor="#000000"
			borderRadius="30">
			<view class="share-popup">
				<view class="title">
					还差<text class="color-text">{{ groupLeft }}</text>人
				</view>
				<view class="sub-title">
					邀请好友拼单共享优惠!
				</view>
				<view class="group-member flex-center">
					<view class="avatar-item flex-center" v-for="user, uIndex in orderEntity.order.groupUsers"
						:key="uIndex">
						<u-avatar :src="$util.avatarImage(user.userId)" size="60"></u-avatar>
						<view class="user-name">
							{{ user.nickName }}
						</view>
					</view>
					<view class="avatar-item circle">
						?
					</view>
				</view>
				<view class="bottom-buttons flex-center">
					<!-- #ifndef MP-WEIXIN -->
					<!-- <view class="share-button flex-center"
						style="background-color: #FFFFFF; border: 2rpx solid #0ABC64;">
						<image class="icon" src="../../static/icon/wechat_timeline.png"></image>
						<view class="text" style="color: #0ABC64;" @click="shareToTimeline">
							分享到朋友圈
						</view>
					</view> -->
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<!-- 	<view class="share-button flex-center"
						style="background-color: #FFFFFF; border: 2rpx solid #0ABC64;">
						<image class="icon" src="../../static/icon/wechat_timeline.png"></image>
						<button class="text" style="color: #0ABC64;" open-type="share" @click="shareToWechat">分享到朋友圈</button>
					</view> -->
					<!-- #endif -->
					<view class="share-button flex-center" style="background-color: #0ABC64;">
						<image class="icon" src="../../static/icon/wechat_friend.png"></image>
						<!-- #ifndef MP-WEIXIN -->
						<view class="text" style="color: #FFFFFF;" @click="shareToWechat">
							邀好友拼单
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button class="text" style="color: #FFFFFF;" open-type="share"
							@click="shareToWechat">邀好友拼单</button>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getMallStatusName
	} from "@/plugins/orderStatus.js"
	// 0=全部 1=待确认 2=待付款 3=待发货 4=服务中/待验收 5=已完成 6=待评价 7=退款/售后
	export default {
		props: {
			orderEntity: {
				Type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				groupLeft: 0, // 拼团订单剩余人数
				isShowSharePopup: false,
				installmentOrders: [] // 订单拆分单
			}
		},
		mounted() {
			if (this.orderEntity.order.groupBuyFlag === 1) {
				this.groupLeft = this.orderEntity.order.groupUserCount - this.orderEntity.order.groupUsers?.length
			}
			if (this.orderEntity.order.paySplitFlag == 1) {
				this.getPayInstallmentOrder()
			}
		},
		computed: {
			getPaidAmount() {
				const result = {
					amount: 0,
					percent: 0
				}
				if (!this.installmentOrders.length) return result
				const arr = this.installmentOrders.filter(item => item.payStatus === 'success')
				if (!arr.length) return result
				result.amount = arr.reduce((pre, cur) => {
					return Number(pre) + Number(cur.amount || 0)
				}, 0)
				result.percent = (result.amount / this.orderEntity.order.payAmount) * 100
				return result
			},
			// 获取拼团状态
			getGroupOrderStatus() {
				const status = this.orderEntity.order.status
				if (this.orderEntity.order.groupBuyFlag === 1) {
					return status == 12 ? '待拼团' : status == 7 ? '拼团失败' : '拼团成功'
				}
				return ''
			},
		},
		methods: {
			getImageList() {
				if (!this.orderEntity) return []
				const result = []
				this.orderEntity.order.orderItemList.forEach(orderItem => {
					result.push(orderItem)
				})
				return result
			},
			// 分享至朋友圈
			shareToTimeline() {
				const product = this.orderEntity.order.orderItemList[0]
				// #ifdef APP-PLUS
				const title =
					`[仅剩${this.groupLeft}个名额]我${this.orderEntity.order.totalAmount}元拼了${product.productName}`
				const href = 'https://www.51mihuo.com/'
				this.$util.shareToWechatTimeLine(title, href, '订单列表', true)
				// #endif
				this.isShowSharePopup = false
			},
			// 分享至微信
			shareToWechat() {
				const product = this.orderEntity.order.orderItemList[0]
				// #ifdef MP-WEIXIN
				this.$emit('share', this.orderEntity.order)
				// #endif
				// #ifdef APP-PLUS
				const title =
					`[仅剩${this.groupLeft}个名额]我${this.orderEntity.order.totalAmount}元拼了${product.productName}`
				const coverImg = this.$util.thumbnailImage(
					product.productPic,
					true,
					750
				)
				const path =
					`/pages-mall/productDetail/productDetail?id=${product.productId}&groupId=${this.orderEntity.order.groupId}`
				this.$util.shareToWechat(
					title,
					coverImg,
					path,
					'商品详情页',
					true,
					2
				)
				// #endif
				this.isShowSharePopup = false
			},
			getBigNumber(number) {
				return this.$util.getBigNumber(number)
			},
			// 获取订单拆分单
			getPayInstallmentOrder() {
				// 已废弃
				return
				this.$httpApi.getInstallmentPaymentOrder({
					payOrderNo: this.orderEntity.order.payOrderNo
				}).then(res => {
					let isFinished = false
					for (const item of res) {
						if (item.payStatus === 'success') {
							isFinished = true
						} else {
							isFinished = false
						}
					}
					this.installmentOrders = res
				})
			},
			// 支付拆分单
			payInstallmentItem(item) {
				if (item.payStatus !== 'pending') return
				// #ifdef APP-PLUS || H5
				const data = {
					payMethod: this.orderEntity.order.payType,
					payOrderNo: item.bizOrderNo
				}
				this.$httpApi.confirmPayInstallmentOrder(data).then(payRes => {
					if (payRes.payInfo) {
						// isPay为true但不代表支付成功了，只是发起了支付
						this.isPay = true
						this.$util.requestPay(this.orderEntity.order.payType, payRes.payInfo, 'mallOrder', () => {
							this.getPayInstallmentOrder()
						})
					}
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.login({
					success: (res) => {
						const data = {
							clientId: 'cmini',
							code: res.code,
							payOrderNo: item.bizOrderNo
						}
						this.$httpApi.confirmPayInstallmentOrder(data).then(payRes => {
							const data = JSON.parse(payRes.payInfo);
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(res) {
									// 支付成功
									uni.hideLoading()
									that.getPayInstallmentOrder()
								},
								fail: function(err) {
									that.getPayInstallmentOrder()
									console.log('fail:' + JSON.stringify(err));
								}
							});
						})
					}
				})
				// #endif
			},
			goToShopMessage(order) {
				this.$util.goToWeixin()
			},
			// 点击按钮
			buttonClick(type, item) {
				// 0=待付款；1=待发货；2=已发货；3=待验收 4=交易成功/待评价；5=待售后，6=售后完成，7=已关闭；8=退款；9=无效订单
				const orderId = item.id
				const orderSn = item.orderSn
				switch (type) {
					case '分享拼单':
						this.isShowSharePopup = true
						break
					case '去验收':
						this.toPage(`/pages-order/callOrderDetails?id=${item.constructionOrderId}`)
						break
					case '继续付款':
						this.goToMallOrderDetail(item, 'pay')
						this.$emit('updateList', 'child')
						break
					case '评价':
						uni.$once('updateAfterReply', () => {
							this.$emit('updateList', 'child')
						})
						this.toPage(`/pages-mine/evaluation?id=${orderId}&orderSn=${orderSn}`)
						break
					case '确认收货':
						this.$httpApi.confirmReceiveOrder(orderId).then(res => {
							if (res) {
								this.$util.toast('收货成功')
								this.$emit('updateList', 'child')
								setTimeout(() => {
									this.toPage(`/pages-mine/evaluation?id=${orderId}&orderSn=${orderSn}`)
								}, 1000)
							}
						})
						break
					case '取消订单':
						uni.showModal({
							title: "确认操作",
							content: "确认取消该订单？",
							cancelText: "取消",
							confirmText: "确认",
							confirmColor: "#FE6E32",
							success: (res) => {
								if (res.confirm) {
									this.$httpApi.cancelMallOrder(orderId).then(res => {
										this.$util.toast('取消成功')
										this.$emit('updateList', 'child')
									})
								}
							},
						});
						break
					case '申请退款':
						if (item.orderItemList.length === 1) {
							// 单个商品直接跳转申请退款页面
							this.toPage(
								`/pages-order/applyRefund?id=${item.id}&orderSn=${item.orderSn}&itemId=${item.orderItemList[0].id}`
							)
						} else {
							this.goToMallOrderDetail(item)
						}
						break
					case '删除订单':
						uni.showModal({
							title: "确认操作",
							content: "确认删除该订单？",
							cancelText: "取消",
							confirmText: "确认",
							confirmColor: "#FE6E32",
							success: (res) => {
								if (res.confirm) {
									this.$httpApi.deleteMallOrder(orderId).then(response => {
										if (response) {
											this.$util.toast('删除成功')
											this.$emit('updateList', 'child')
										}
									})
								}
							},
						});
						break
					default:
						break
				}
			},
			// 获取sku信息
			getSkuStr(productAttr) {
				let sku = JSON.parse(productAttr);
				let skuStr = '';
				if (!sku || !sku.length || typeof sku === 'string') return skuStr
				sku.forEach((each, index) => {
					skuStr += `${each.value}${index == sku.length - 1 ? '' : '/'}`
				})
				return skuStr;
			},
			// 进店
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
			// 获取退款状态
			getRefundStatusName(status) {
				switch (status) {
					case 0:
						return ''
					case 1:
						return '已申请退款'
					case 2:
						return '退款已审核/待退款'
					case 3:
						return '已退款'
					default:
						return ''
				}
			},
			// 跳转订单详情
			goToMallOrderDetail(formData, type = '') {
				this.toPage(`/pages-order/orderDetails?id=${formData.id}&type=${type}`)
			},
			getOrderStatus(status, formData) {
				// orderType 1=施工订单 2=商城订单
				return getMallStatusName(status, formData.orderType != 0, formData.replyStatus)
			},
			// 检查是否所有子项商品退款状态
			checkRefundStatus(order) {
				let flag = 1
				order.orderItemList.forEach(item => {
					flag *= Number(item.refundStatus)
				})
				return flag !== 1
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-item {
		width: 690rpx;
		background-color: #FFFFFF;
		margin: 30rpx 30rpx 0rpx 30rpx;
		border-radius: 30rpx;
		padding: 30rpx 20rpx;
		padding-bottom: 0;

		.order-top {
			justify-content: space-between;
			margin-bottom: 30rpx;

			.company-name {
				font-size: 28rpx;

				.company-title {
					@include toe();
					width: max-content;
					max-width: 400rpx;
					font-weight: bold;
					font-size: 30rpx;
					line-height: 42rpx;
					color: #303133;
					margin-left: 14rpx;
				}

				.icon-1 {
					width: 76rpx;
					height: 30rpx;
					margin-left: 14rpx;
				}

				.icon-2 {
					width: 25rpx;
					height: 25rpx;
					margin-left: 10rpx;
				}
			}

			.order-status {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #FE6E32;
				line-height: 34rpx;
			}
		}

		.order-middle {
			width: 100%;
			height: 140rpx;
			margin-bottom: 30rpx;

			.order-product-image {
				width: 140rpx;
				height: 140rpx;
				margin-right: 20rpx;
				border-radius: 10px;
			}

			.order-amount {
				padding-right: 20rpx;

				.left {
					font-size: 24rpx;
					font-weight: 400;
				}
			}

			.order-information {
				width: 490rpx;
				height: 140rpx;
				flex-direction: column;

				.price {
					font-size: 30rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #000000;
					line-height: 34rpx;
				}

				.product-info {
					width: 100%;
					justify-content: space-between;
					margin-top: 10rpx;

					.product-name {
						width: 70%;
						height: 34rpx;
						font-size: 28rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						color: #000000;
						line-height: 34rpx;
						@include toe();
					}
				}

				.product-sku {
					width: 100%;
					height: 34rpx;
					justify-content: space-between;
					margin-top: 10rpx;

					.group-deal {
						width: 100%;
						height: 34rpx;

						.tag {
							width: max-content;
							height: 34rpx;
							padding: 0 6rpx;
							text-align: center;
							line-height: 34rpx;
							font-size: 20rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #FFFFFF;
							background: linear-gradient(90deg, #FFB54D, #FF3A33);
							border-radius: 6rpx;
						}

						.user-avatar {
							margin-left: 10rpx;
							gap: 10rpx;
						}

						.user-circle {
							width: 32rpx;
							height: 32rpx;
							text-align: center;
							line-height: 32rpx;
							font-weight: 400;
							font-size: 24rpx;
							background: rgba(255, 255, 255, 0);
							border: 2rpx solid #CCCCCC;
							border-radius: 50%;
							color: #CCCCCC;
							margin-left: 10rpx;
						}

						.deal-status {
							font-size: 24rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #000000;
							line-height: 34rpx;
							margin-left: 10rpx;
						}
					}

					.sku-label {
						width: 70%;
						height: 34rpx;
						font-size: 24rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #999999;
						line-height: 34rpx;
						@include toe();
					}

					.product-num {
						height: 34rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #999999;
						line-height: 34rpx;
					}
				}

				.fill-amount {
					width: 100%;
					height: 34rpx;
					justify-content: flex-end;
					margin-top: 10rpx;

					.label {
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						color: #999999;
						margin-right: 22rpx;
						margin-top: 6rpx;
					}
				}
			}
		}

		.order-bottom {
			justify-content: space-between;

			.left,
			.right {
				width: 50%;

				.left-tag {
					width: max-content;
					padding: 4rpx 10rpx;
					font-size: 18rpx;
					color: $themeColor;
					background-color: #ffece5;
					border-radius: 16rpx;
				}
			}

			.right {
				justify-content: flex-end;
			}

			.gray-value {
				color: #909199;
				margin-right: 8rpx;
				font-size: 24rpx;
			}

			.pay-price {
				.price-label {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
					margin-right: 10rpx;
				}

				.price {
					font-size: 36rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					line-height: 34rpx;
					color: #ED3832;
				}
			}
		}

		.order-pay-stages {
			width: 100%;
			border-top: 2rpx #F0F0F0 solid;
			margin-top: 30rpx;
		}

		.order-split-info {
			height: max-content;
			padding-top: 30rpx;

			.amount-info {
				width: 100%;
				height: 34rpx;
				justify-content: flex-end;
				padding-bottom: 30rpx;
				border-bottom: 2rpx #F0F0F0 solid;

				.price-label {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
					margin-right: 10rpx;
				}

				.left {
					text {
						color: #ED3832;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						line-height: 34rpx;
					}
				}

				.right {
					text {
						color: #000000;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						line-height: 34rpx;
					}
				}
			}

			.installment-item {
				width: 100%;
				margin: 30rpx 0;
				justify-content: space-between;

				.item-count {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #808080;
					line-height: 34rpx;
				}

				.item-amount {
					text {
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						color: #000000;
						line-height: 34px;
					}
				}

				.item-status {
					width: 108rpx;
					height: 30rpx;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					line-height: 30rpx;
					padding-left: 24rpx;
					text-align: center;
					background-position: center;
					background-repeat: no-repeat;
					background-size: cover;
				}

				.unpay {
					color: #B3B3B3;
				}

				.paid {
					color: #FE6E32;
				}

				.item-time {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #B3B3B3;
					line-height: 34rpx;
				}

				.item-button {
					width: 130rpx;
					height: 60rpx;
					border-radius: 30rpx;
					background-color: #000000;
					color: #FFFFFF;
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 60rpx;
					text-align: center;
				}
			}
		}

		.order-buttons {
			width: 100%;
			height: 104rpx;
			border-top: 2rpx #F0F0F0 solid;
			justify-content: flex-start;
			margin-top: 30rpx;
			flex-direction: row-reverse;

			.button-item {
				min-width: 160rpx;
				width: max-content;
				padding: 0 30rpx;
				height: 64rpx;
				border-radius: 32rpx;
				text-align: center;
				border: 2rpx solid #F0F0F0;
				line-height: 64rpx;
				font-size: 26rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #808080;
				margin-left: 20rpx;
			}

			.active {
				color: #000000;
				background: #FE6E32;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.product-refund {
		font-family: Noto Sans S Chinese;
		color: #909199;
		font-size: 26rpx;
		padding-bottom: 10rpx;
	}

	.share-popup {
		width: 630rpx;
		height: 446rpx;
		background: #FFFFFF;
		border-radius: 30rpx;
		padding: 40rpx 30rpx 30rpx 30rpx;

		.title {
			width: 100%;
			text-align: center;
			font-size: 36rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
			line-height: 48rpx;

			.color-text {
				font-size: 36rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #da493d;
				line-height: 48rpx;
			}
		}

		.sub-title {
			width: 100%;
			text-align: center;
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
			line-height: 48rpx;
			margin-top: 10rpx;
		}

		.group-member {
			width: 100%;
			justify-content: center;
			align-items: flex-start;
			gap: 30rpx;
			margin-top: 30rpx;

			.avatar-item {
				margin-top: 10rpx;
				flex-direction: column;
				justify-content: center;

				.user-name {
					width: 80rpx;
					text-align: center;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #4D4D4D;
					line-height: 34rpx;
					@include toe();
					margin-top: 6rpx;
				}
			}

			.circle {
				width: 60rpx;
				height: 60rpx;
				text-align: center;
				line-height: 60rpx;
				font-weight: 400;
				font-size: 32rpx;
				background: rgba(255, 255, 255, 0);
				border: 2rpx solid #CCCCCC;
				border-radius: 50%;
				color: #CCCCCC;
			}
		}

		.bottom-buttons {
			width: 100%;
			margin-top: 50rpx;
			// justify-content: space-between;
			justify-content: center;

			.share-button {
				width: 275rpx;
				height: 84rpx;
				border-radius: 10rpx;
				justify-content: center;

				.icon {
					width: 34rpx;
					height: 34rpx;
					margin-right: 20rpx;
				}

				.text {
					height: 84rpx;
					background-color: transparent;
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					line-height: 84rpx;
				}
			}
		}
	}
</style>
