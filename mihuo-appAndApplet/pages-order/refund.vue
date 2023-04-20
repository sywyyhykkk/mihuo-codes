<template>
	<view class="order-page">
		<z-nav-bar backState="1000" type="fixed">
			<view class="nav-bar" slot="default">我的退款</view>
		</z-nav-bar>
		<view class="order-classification">
			<view class="order-status-list">
				<u-tabs :list="optionList" :show-bar="false" font-size="28" :gutter="60" inactive-color="#909299"
					active-color="#FF5D35" :is-scroll="false" :current="refundStatus" @change="changeStatus">
				</u-tabs>
			</view>
		</view>
		<view class="refund-top"></view>
		<view class="list-contain">
			<view v-for="(item, index) in refundList" :key="index" @click="goToOrderDetail(item)">
				<view class="order-middle">
					<view class="order-middle-contain">
						<view class="order-attachments-cover">
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
										{{ item.productPrice.toFixed(0) }}
									</text>
									<text class="price" style="font-size: 28rpx;">
										{{ item.productPrice | priceFormat }}
									</text>
								</view>
							</view>
							<view class="order-brand-contain">
								<view class="order-brand">{{ getSkuStr(item.productAttr) }}</view>
								<view class="order-num">x{{ item.productQuantity }}</view>
							</view>
							<view class="order-status">
								 {{ getRefundStatusName(item.refundStatus) }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore style="margin: 30rpx 0;" v-if="refundListStatus" :status="status" />
		</view>
		<order-mh-empty v-if="refundList.length === 0 " icon="https://www.51mihuo.com/static/images/no_recommend.png" title="暂无订单～～" />
	</view>
</template>

<script>
	import {
		getMallStatusName
	} from '@/plugins/orderStatus.js'
	
	export default {
		data() {
			return {
				option: {},
				refundList: [],
				total: 0,
				current: 1,
				refundListStatus: false,
				status: 'loadmore',
				refundStatus: 0,
				optionList: [
					{
						name: '已申请/待退款',
						value: 1
					},
					{
						name: '已退款',
						value: 2
					}
				]
			}
		},
		onLoad(option) {
			this.option = option
			this.getRefundList()
		},
		methods: {
			goToOrderDetail(item){
				this.toPage(`/pages-order/orderDetails?id=${item.orderId}`)
			},
			goToProductDetail(productId){
				this.toPage(`/pages-mall/productDetail/productDetail?id=${productId}`)
			},
			getRefundStatusName(status){
				switch(status){
					case 0:
						return '未退款'
					case 1:
						return '已申请'
					case 2:
						return '已审核/待退款'
					case 3:
						return '已退款'
					default:
						return ''
				}
			},
			changeStatus(e){
				this.refundStatus = e
				this.current = 1
				this.refundList = []
				this.total = 0
				this.status = 'loadmore'
				this.getRefundList()
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
			getRefundList() {
				// refundStatus 0=未退款 1=已申请 2=已审核待退款 3=已退款
				this.$httpApi.getRefundOrder({
					refundStatus: this.refundStatus == 0 ? 1 : 3,
					current: this.current
				}).then(res => {
					if (res) {
						this.refundList = this.current > 1 ? this.refundList.concat(res.records) : res.records
						this.total = res.total
						if (this.refundList.length > 0) {
							this.refundListStatus = true
						}
						if (this.refundList.length < this.total) {
							this.status = 'loadmore'
						} else {
							this.status = 'nomore'
						}
					}
					this.$forceUpdate();
					uni.stopPullDownRefresh();
				})
			},
		},
		onReachBottom() {
			if (this.refundList.length === this.total) return
			this.status = 'loading';
			this.current += 1
			this.getRefundList()
		}
	}
</script>

<style lang="scss" scoped>
	.order-page {
		width: 100vw;
		height: max-content;
		background-color: #F7F7F7;
	}
	
	.order-classification {
		width: 100vw;
		background-color: #FFFFFF;
		border-radius: 16rpx;
	}
	
	.list-contain {
		width: 750rpx;
		padding: 0 30rpx;
		overflow: scroll;
		height: calc(100vh - 180rpx - var(--status-bar-height) - env(safe-area-inset-bottom));
		background-color: #F7F7F7;
		margin-top: 30rpx;
	}
	
	.order-middle {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		margin-bottom: 30rpx;
		padding: 20rpx;
		border-radius: 30rpx;
		
		.order-middle-contain {
			display: flex;
			margin-bottom: 18rpx;
			
			.order-attachments-cover {
				position: relative;
				
				.order-middle-image {
					margin-right: 28rpx;
					width: 176rpx;
					height: 176rpx;
				}
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
					
					.order-brand {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						max-width: 352rpx;
						color: #909299;
						font-size: 28rpx;
					}
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
				
				.order-status {
					width: 100%;
					text-align: right;
					margin-top: 40rpx;
					color: #999999;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
