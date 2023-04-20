<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				我的评价
			</view>
		</z-nav-bar>
		<u-tabs :list="commentType" bgColor="#FFFFFF" :show-bar="true" font-size="28" :gutter="60"
			inactive-color="#808080" active-color="#000000" :is-scroll="false" :current="currentType"
			@change="changeCommentType">
		</u-tabs>
		<scroll-view class="tab-list" scroll-y="true" v-if="orderList.length || callOrderList.length"
			@scrolltolower="scrollToLower">
			<view v-for="(orderEntity, index) in orderList" :key="index">
				<!-- 待评价商城订单 -->
				<view class="order-item" v-if="currentType == 0">
					<!-- 订单头部(企业信息 订单状态) -->
					<view class="order-top flex-center">
						<view class="company-name flex-center" v-if="orderEntity.order.company"
							@click="goShop(orderEntity.order.company)">
							<u-avatar size="40" v-if="orderEntity.order.company"
								:src="$util.thumbnailImage(orderEntity.order.company.companyLogo, true, 80)">
							</u-avatar>
							<text class="company-title"
								v-if="orderEntity.order.company">{{ orderEntity.order.company.companyShortName }}</text>
							<image class="icon-1" src="https://www.51mihuo.com/static/icon/self_hold-76x30.png"></image>
							<image @click.stop="goToShopMessage(orderEntity.order)" class="icon-2"
								src="https://www.51mihuo.com/static/icon/shop_msg-25x25.png"></image>
						</view>
						<view class="order-status"
							:style="{ color: orderEntity.order.status == 7 ? '#909299' : '#FE6E32' }">
							{{ getOrderStatus(orderEntity.order.status, orderEntity.order) }}
						</view>
					</view>
					<!-- 订单中部(订单商品信息) -->
					<view class="order-middle flex-center" v-for="(item, index2) in orderEntity.order.orderItemList"
						:key="index2">
						<image class="order-product-image" border-radius="20" height="176" imgMode="aspectFill"
							:src="$util.thumbnailImage(item.productPic, true)">
						</image>
						<view class="order-information flex-center">
							<view class="product-info flex-center">
								<view class="product-name">
									{{ item.productName }}
								</view>
								<view class="product-price">
									<text class="price" style="font-size: 24rpx;">¥</text>
									<text class="price">{{ item.productPrice.toFixed(0) }}</text>
									<text class="price"
										style="font-size: 24rpx;">{{ item.productPrice | priceFormat }}</text>
								</view>
							</view>
							<view class="product-sku flex-center">
								<view class="sku-label">{{ getSkuStr(item.productAttr) }}</view>
								<view class="product-num" v-show="item.productQuantity">
									x{{item.productQuantity}}
								</view>
							</view>
							<view class="fill-amount flex-center" v-if="orderEntity.order.diffAmount">
								<text class="label">
									补齐费用
								</text>
								<text class="price" style="font-size: 24rpx; margin-top: 4rpx;">¥</text>
								<text class="price"> {{ orderEntity.order.diffAmount }}</text>
							</view>
						</view>
					</view>
					<!-- 订单底部(总价信息) -->
					<view class="order-bottom flex-center">
						<view class="left">
							<view class="left-tag" v-if="orderEntity.order.sourceType == 4">
								{{ orderEntity.order.createServer.skillName || '项目管家' }}开单
							</view>
						</view>
						<view class="right flex-center">
							<view class="pay-price">
								<text class="price-label">
									{{ orderEntity.order.status == 0 ? '应' : '实' }}付款
								</text>
								<text class="price" style="font-size: 24rpx;">￥</text>
								<text class="price">{{ orderEntity.order.payAmount }}</text>
								<text class="price" v-if="orderEntity.order.payAmount > 1"
									style="font-size: 24rpx;">{{ orderEntity.order.payAmount | priceFormat }}</text>
							</view>
						</view>
					</view>
					<!-- 订单操作按钮 -->
					<view class="order-buttons flex-center">
						<view v-if="currentType == 0" class="button-item active"
							@click.stop="goEvaluation(orderEntity.order)">
							评价
						</view>
					</view>
				</view>
				<!-- 已评价订单 -->
				<view class="order-item-reply" v-if="orderEntity.reply && orderEntity.order && currentType === 2">
					<view class="reply-header flex-center">
						<view class="left flex-center">
							<u-avatar
								:src="$util.avatarImage(orderEntity.reply.memberId || orderEntity.reply.dealUserId)"
								size="80"></u-avatar>
							<view class="reply-info">
								<!-- 商城单返回的是orderEntity.reply -->
								<!-- 呼叫订单返回的是orderEntity.order -->
								<view class="name" v-if="orderEntity.orderType == 1">
									{{ orderEntity.order.receiverName || orderEntity.order.contactName || orderEntity.reply.userName }}
								</view>
								<view class="name" v-else>
									{{ orderEntity.reply.memberName || orderEntity.order.userName }}
								</view>
								<view class="time">
									{{ orderEntity.reply.createTime || orderEntity.reply.created }}
								</view>
							</view>
						</view>
						<view class="right">
							<u-rate style="margin-right: 16rpx;"
								:current="orderEntity.reply.productScore || orderEntity.reply.nodeScore" disabled
								:allow-half="true" size="24"></u-rate>
							{{ orderEntity.reply.productScore || orderEntity.reply.nodeScore }}分
						</view>
					</view>
					<view class="reply-content">
						{{ orderEntity.reply.comment || orderEntity.reply.contents }}
					</view>
					<view class="reply-images flex-center" v-if="getReplyImages(orderEntity.reply.pics).length != 0">
						<u-lazy-load v-for="imgItem, index3 in getReplyImages(orderEntity.reply.pics)" :key="index3"
							class="reply-img" border-radius="20" height="203" imgMode="aspectFill"
							:image="$util.thumbnailImage(imgItem.url || imgItem, true)">
						</u-lazy-load>
					</view>
					<view class="reply-product" v-if="orderEntity.orderType != 1 && orderEntity.order">
						<!-- 商城订单 -->
						<view class="product-item flex-center" v-if="orderEntity.product"
							@click="goToProductDetail(orderEntity.product)">
							<u-lazy-load :key="index" class="product-img" border-radius="10" height="100"
								imgMode="aspectFill" :image="$util.thumbnailImage(orderEntity.product.coverImg, true)">
							</u-lazy-load>
							<view class="product-info">
								<view class="upper">
									{{ orderEntity.product.name }}
								</view>
								<view class="lower">
									{{ getSkuStr(orderEntity.order.orderItemList[0].productAttr) }}
								</view>
							</view>
						</view>
					</view>
					<view class="reply-order flex-center" v-if="orderEntity.orderType == 1 && orderEntity.order">
						<!-- 施工订单 -->
						<image :src="getWorkerImage(orderEntity.order.skillName)" class="des-img" mode="aspectFit">
						</image>
						<view class="right">
							<view class="des-title">
								{{ orderEntity.order.requirementName }}
							</view>
							<view class="skill-name">
								{{ orderEntity.order.skillName }}
							</view>
							<view class="des-text">
								{{ orderEntity.order.requirementDesc }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 待评价呼叫师傅订单 -->
			<view class="call-order" v-if="currentType === 1 && callOrderList.length">
				<call-order-item class="call-order-item" v-for="item, index in callOrderList" :key="index" @click.native="goToCallOrder(item)"
					:item="item">
				</call-order-item>
			</view>
			<view style="margin: 20rpx 0; height: 80rpx;">
				<u-loadmore :status="status" />
			</view>
		</scroll-view>
		<mine-mh-empty v-else title="还没有相关订单～"></mine-mh-empty>
	</view>
</template>

<script>
	import {
		getMallStatusName
	} from "@/plugins/orderStatus.js";
	import {
		masterAvatar
	} from '@/plugins/orderStatus'

	export default {
		data() {
			return {
				groupType: 5, // 查询待评价订单
				status: 'loadmore',
				commentType: [{
						name: '商城订单',
						value: '5'
					},
					{
						name: '呼叫订单',
						value: '50'
					}, {
						name: '已评价',
						value: ''
					}
				],
				lastReplyItems: [{
						replyId: 0,
						orderType: 1
					},
					{
						replyId: 0,
						orderType: 2
					},
				], // 用于已评价订单分页查询的最后一条施工订单和商城订单
				lastItems: [{
						orderId: 0,
						orderType: 1
					},
					{
						orderId: 0,
						orderType: 2
					}
				], // 用于分页查询的最后一条施工订单和商城订单
				isShowPage: false,
				orderList: [], // 商城订单
				callOrderList: [], // 呼叫订单
				current: 1,
				currentType: 0
			};
		},
		onLoad(option) {
			if (option.type == '2') {
				// 查看已评价
				this.changeCommentType(2)
			}
			this.getData()
		},
		onShow() {
			this.getOrderCount()
		},
		onUnload() {
			uni.$off('updateAfterReply')
		},
		methods: {
			// 跳转到呼叫订单详情
			goToCallOrder(item){
				this.toPage(`/pages-findMaster/serviceEvaluation?id=${item.id}`)
			},
			// 跳转到商品详情
			goToProductDetail(product) {
				this.toPage(`/pages-mall/productDetail/productDetail?id=${product.id}`)
			},
			// 获取呼叫订单
			getCallOrderData() {
				this.$http.get('order/biz_order/self/publish', {
					current: this.current,
					orderStatus: 50,
				}).then(res => {
					this.isShowPage = false
					if (res.records.length == 0) {
						this.status = 'nomore'
						return
					}
					if (res.records.length == 10) {
						this.status = 'loadmore'
					}
					if (res.records.length < 10) {
						this.status = 'nomore'
					}
					this.callOrderList = this.current > 1 ? this.callOrderList.concat(res.records) : res.records
					this.isShowPage = true
				})
			},
			// 获取订单工种图片
			getWorkerImage(skillName) {
				if (!skillName) return
				return masterAvatar.find(item => item.name === skillName)?.img
			},
			// 查看施工订单详情
			lookDetail(data) {
				this.toPage('/pages-order/callOrderDetails?id=' + data.id)
			},
			// 获取评价图片
			getReplyImages(str) {
				try {
					return JSON.parse(str) || []
				} catch {
					return str.split(',')
				}
			},
			// 获取待评价订单数量
			getOrderCount() {
				this.$httpApi.getOrderStatusCount().then(res => {
					if (res) {
						this.commentType[1].name = `呼叫订单(${res.bizOrderEvaluate})`
						if (res['evaluate']) {
							this.commentType[0].name = `商城订单(${res['evaluate']})`
						}
					}
				})
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
					case 4:
						return '已拒绝退款'
					default:
						return ''
				}
			},
			// 进店
			goShop(data) {
				if (data.companyId != -1) {
					this.toPage(`/pages-mall/shopInformation/shopInformation?companyId=${data.companyId}`)
				} else {
					const obj = {
						companyLogo: data.companyLogo,
						companyShortName: data.companyName,
						completeAddress: data.completeAddress,
						contactTel: data.companyTel
					}
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?cityOperatorId=${data.cityOperatorId}&data=${JSON.stringify(obj)}`
					)
				}
			},
			getOrderStatus(status, formData) {
				// orderType 1=施工订单 2=商城订单
				return getMallStatusName(status, formData.orderType != 0, formData.replyStatus)
			},
			changeCommentType(e) {
				this.currentType = e
				this.current = 1
				this.orderList = []
				this.lastItems = [{
						orderId: 0,
						orderType: 1
					},
					{
						orderId: 0,
						orderType: 2
					}
				]
				this.lastReplyItems = [{
						replyId: 0,
						orderType: 1
					},
					{
						replyId: 0,
						orderType: 2
					},
				]
				if (e == 0) {
					// 获取待评价订单
					this.getData()
				} else if (e == 2) {
					// 获取已评价订单
					this.getReplyData()
				} else if (e == 1) {
					this.getCallOrderData()
				}
			},
			scrollToLower() {
				if (this.status === 'nomore') return
				this.status = 'loading';
				this.current += 1
				if (this.currentType == 0) {
					// 获取待评价订单
					this.getData()
				} else if (this.currentType == 2) {
					// 获取已评价订单
					this.getReplyData()
				} else if (this.currentType == 1) {
					this.getCallOrderData()
				}
			},
			// 获取已评价订单
			getReplyData() {
				this.$httpApi.getAllReplyOrder({
					current: this.current,
					size: 10,
					lastItems: this.lastReplyItems,
					longitude: uni.getStorageSync('longitude'),
					latitude: uni.getStorageSync('latitude'),
				}).then(res => {
					if (res) {
						this.isShowPage = false
						if (res.length == 0) {
							this.status = 'nomore'
							return
						}
						if (res.length == 10) {
							this.status = 'loadmore'
						}
						if (res.length < 10) {
							this.status = 'nomore'
						}
						this.orderList = this.current > 1 ? this.orderList.concat(res) : res
						let lastConsOrders = res.filter(ele => {
							if (ele.orderType == 1) return ele
						})
						let lastMallOrders = res.filter(ele => {
							if (ele.orderType == 2) return ele
						})
						const lastItems = []
						const lastConsOrder = lastConsOrders.length ? lastConsOrders[lastConsOrders.length - 1] :
							null;
						const lastMallOrder = lastMallOrders.length ? lastMallOrders[lastMallOrders.length - 1] :
							null;
						lastItems[0] = {
							orderType: 1,
							replyId: lastConsOrder ? lastConsOrder.replyId || 0 : 0
						}
						lastItems[1] = {
							orderType: 2,
							replyId: lastMallOrder ? lastMallOrder.replyId || 0 : 0
						}

						// console.log(lastItems)
						this.lastReplyItems = lastItems
						this.isShowPage = true
					}
				})
			},
			// 获取待评价订单
			getData() {
				this.$httpApi.getAllOrder({
					current: this.current,
					size: 10,
					groupType: this.groupType,
					lastItems: this.lastItems,
					longitude: uni.getStorageSync('longitude'),
					latitude: uni.getStorageSync('latitude'),
				}).then(res => {
					if (res) {
						this.isShowPage = false
						if (res.records.length == 0) {
							this.status = 'nomore'
							return
						}
						if (res.records.length == 10) {
							this.status = 'loadmore'
						}
						if (res.records.length < 10) {
							this.status = 'nomore'
						}
						const lastItems = this.lastItems
						this.orderList = this.current > 1 ? this.orderList.concat(res.records) : res.records
						let lastConsOrders = res.records.filter(ele => ele.orderType == 1)
						let lastMallOrders = res.records.filter(ele => ele.orderType == 2)
						let lastConsOrder = lastConsOrders.length ? lastConsOrders[lastConsOrders.length - 1] :
							null
						let lastMallOrder = lastMallOrders.length ? lastMallOrders[lastMallOrders.length - 1] :
							null
						if (lastConsOrder) {
							lastItems[0] = {
								orderType: 1,
								orderId: lastConsOrder.orderId
							}
						}
						if (lastMallOrder) {
							lastItems[1] = {
								orderType: 2,
								orderId: lastMallOrder.orderId
							}
						}
						this.lastItems = lastItems
						this.isShowPage = true
					}
				})
			},
			// 跳转到商城订单评价页
			goEvaluation(item) {
				uni.$once('updateAfterReply', () => {
					this.changeCommentType(0)
					this.getOrderCount()
				})
				this.toPage(`/pages-mine/evaluation?id=${item.id}&orderSn=${item.orderSn}`)
			}
		}
	};
</script>

<style scoped lang="scss">
	.call-order {
		width: 690rpx;
		margin: 30rpx 30rpx 20rpx 30rpx;
		
		.call-order-item {
			padding: 30rpx;
			margin-bottom: 20rpx;
			background: #FFFFFF;
			border-radius: 30rpx;
		}
	}

	.tab-list {
		width: 100%;
		height: calc(100vh - 168rpx - env(safe-area-inset-bottom));
		background-color: #F7F7F7;

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

			.order-buttons {
				width: 100%;
				height: 104rpx;
				border-top: 1rpx solid #F0F0F0;
				justify-content: flex-start;
				margin-top: 30rpx;
				flex-direction: row-reverse;

				.button-item {
					width: 160rpx;
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

		.order-item-reply {
			width: 690rpx;
			height: max-content;
			background-color: #FFFFFF;
			margin: 30rpx 30rpx 0rpx 30rpx;
			border-radius: 30rpx;
			padding: 30rpx 0rpx;

			.reply-header {
				padding: 0 20rpx;

				.left {
					width: 50%;

					.reply-info {
						margin-left: 19rpx;

						.name {
							font-size: 28rpx;
							font-family: Adobe Heiti Std;
							font-weight: normal;
							color: #000000;
							line-height: 36rpx;
						}

						.time {
							font-size: 20rpx;
							font-family: Adobe Heiti Std;
							font-weight: normal;
							color: #808080;
							line-height: 36rpx;
							margin-top: 20rpx;
						}
					}
				}

				.right {
					width: 50%;
					font-size: 22rpx;
					font-family: PingFang;
					font-weight: 800;
					color: #FE6E32;
					line-height: 36rpx;
					text-align: right;
				}
			}

			.reply-content {
				width: 100%;
				max-height: 144rpx;
				padding: 0 20rpx;
				margin-top: 30rpx;
				word-wrap: break-word;
				@include bov(4);
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #333333;
				line-height: 36rpx;
			}

			.reply-images {
				width: 100%;
				padding: 0 20rpx;
				margin-top: 30rpx;
				flex-wrap: wrap;
				gap: 20rpx;

				.reply-img {
					width: 203rpx;
					height: 203rpx;
					border-radius: 20rpx;
				}
			}

			.reply-product {
				width: 100%;
				height: max-content;
				min-height: 180rpx;
				margin-top: 30rpx;
				padding: 0rpx 20rpx;
				border-top: 1rpx #F0F0F0 solid;

				.product-item {
					width: 650rpx;
					height: 140rpx;
					background: #F7F7F7;
					border-radius: 20px;
					margin-top: 20rpx;
					padding: 20rpx;

					.product-img {
						width: 100rpx;
						height: 100rpx;
						border-radius: 10rpx;
					}

					.product-info {
						margin-left: 20rpx;
						width: 500rpx;
						@include bov(2);

						.upper {
							font-size: 24rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #000000;
							line-height: 36rpx;
						}

						.lower {
							font-size: 20rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 400;
							color: #999999;
							line-height: 36rpx;
						}
					}
				}
			}

			.reply-order {
				width: 100%;
				height: max-content;
				margin-top: 30rpx;
				padding: 20rpx 20rpx 0;
				border-top: 1rpx #F0F0F0 solid;

				.des-img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 10rpx;
				}

				.right {
					margin-left: 20rpx;

					.des-title {
						font-size: 24rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						color: #000000;
						line-height: 36rpx;
					}

					.skill-name {
						font-size: 19rpx;
						font-family: HuXiaoBo;
						font-weight: normal;
						color: #FE6E32;
						line-height: 36rpx;
					}

					.des-text {
						width: 500rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #999999;
						line-height: 36rpx;
						@include toe();
					}
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
