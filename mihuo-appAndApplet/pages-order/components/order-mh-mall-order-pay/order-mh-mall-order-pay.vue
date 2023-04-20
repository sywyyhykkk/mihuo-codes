<template>
	<view class="order-item">
		<!-- 订单头部(企业信息 订单状态) -->
		<view class="order-top flex-center">
			<view class="company-name flex-center" v-if="orderEntity.order[0].company"
				@click="goShop(orderEntity.order[0].company)">
				<!-- <u-avatar size="40" v-if="orderEntity.order[0].company"
					:src="$util.thumbnailImage(orderEntity.order[0].company.companyLogo, true)"
				</u-avatar>
				<text class="company-title" v-if="orderEntity.order[0].company">
					{{ orderEntity.order[0].company.companyShortName }}
				</text>
				<image @click.stop="goToShopMessage(orderEntity.order[0])" class="icon-2"
					src="https://www.51mihuo.com/static/icon/shop_msg-25x25.png"></image> -->
			</view>
			<view class="order-status" :style="{ color: orderEntity.order.status == 7 ? '#909299' : '#FE6E32' }">
				待付款
			</view>
		</view>
		<!-- 订单中部(订单商品信息) -->
		<!-- 拆分成多个订单 -->
		<view class="order-items flex-center" @click="goToPayOrderDetail">
			<view class="order-middle flex-center">
				<image v-for="(item, index2) in getImageList().slice(0, 3)" :key="index2" class="order-product-image" border-radius="20"
					height="176" imgMode="aspectFill" :src="$util.thumbnailImage(item.productPic, true)">
				</image>
			</view>
			<view class="order-amount flex-center">
				<view class="left">
					共{{ getImageList().length }}件
				</view>
				<view class="right">
					<text style="font-size: 20rpx;">¥</text>
					<text style="font-size: 32rpx;">
						{{ Math.floor(getOrderMoney) }}
					</text>
					<text style="font-size: 20rpx;">
						{{ getOrderMoney | priceFormat }}
					</text>
				</view>
			</view>
		</view>
		<!-- 订单操作按钮 -->
		<view class="order-buttons flex-center">
			<!-- orderEntity.order.orderType 0=商品订单 1=服务订单 2=协作订单 3=待支付的合并支付订单-->
			<view class="button-item active" @click.stop="buttonClick('继续付款', orderEntity.order)">
				继续付款
			</view>
			<view class="button-item" @click.stop="buttonClick('取消订单', orderEntity.order)">
				取消订单
			</view>
		</view>
	</view>
</template>

<script>
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
			return {}
		},
		computed: {
			getOrderMoney(){
				let result = 0
				this.orderEntity.order.forEach(item => {
					item.orderItemList.forEach(orderItem => {
						result = this.$math.floatAdd(result, orderItem.payAmount)
					})
				})
				return result
			}
		},
		methods: {
			getImageList() {
				if (!this.orderEntity) return []
				const result = []
				this.orderEntity.order.forEach(item => {
					item.orderItemList.forEach(orderItem => {
						result.push(orderItem)
					})
				})
				return result
			},
			goToShopMessage(order) {
				this.$util.goToWeixin()
			},
			// 点击按钮
			buttonClick(type, item) {
				// 0=待付款；1=待发货；2=已发货；3=待验收 4=交易成功/待评价；5=待售后，6=售后完成，7=已关闭；8=退款；9=无效订单
				const orderId = item[0].id
				const orderSn = item[0].orderSn
				switch (type) {
					case '继续付款':
						this.goToPayOrderDetail()
						this.$emit('updateList', 'child')
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
					default:
						break
				}
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
			// 跳转订单详情
			goToPayOrderDetail() {
				this.toPage('/pages-order/payOrderDetails?id=' + this.orderEntity.orderId)
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
		
		.order-items {
			justify-content: space-between;
			
			.order-middle {
				width: 65%;
				height: 120rpx;
				margin-bottom: 30rpx;
				
				.order-product-image {
					width: 120rpx;
					height: 120rpx;
					margin-right: 20rpx;
					border-radius: 10px;
				}
			}
			
			.order-amount {
				padding-right: 20rpx;
				
				.left {
					font-size: 24rpx;
					font-weight: 400;
				}
				
				.right {
					font-size: 32rpx;
					font-weight: bold;
					margin-left: 20rpx;
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

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
