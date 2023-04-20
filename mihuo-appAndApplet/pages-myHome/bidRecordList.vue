<template>
	<view>
		<z-nav-bar fontColor="#141414">
			<view class="nav-bar" slot="default">明细清单</view>
		</z-nav-bar>
		<view v-for="item, index in dataList" :key="index" class="order-item flex-center" @click="goToDetail(item)">
			<view class="left flex-center">
				<view class="name">
					<!-- orderType = 0 材料  orderType = 1 服务 -->
					{{ item.orderType == 0 ? item.productName : '服务单' }}
				</view>
				<view class="time">
					{{ item.createTime }}
				</view>
			</view>
			<view class="right flex-center">
				<view class="price">
					<text class="price-symbol">
						¥
					</text>
					{{ item.totalAmount }}
				</view>
				<view class="status" :style="{ color: item.status == 0 ? '#FE6E32' : '#808080' }">
					{{ getOrderStatus(item) }}
				</view>
			</view>
			<view class="arrow flex-center">
				<uni-icons type="right" color="#000000" size="15"></uni-icons>
			</view>
		</view>
		<!-- <u-loadmore v-if="dataList.length" :status="status" /> -->
		<mh-empty v-if="dataList.length == 0" title="暂无开单记录~~"></mh-empty>
	</view>
</template>

<script>
	import {
		getMallStatusName
	} from '@/plugins/orderStatus.js'

	export default {
		data() {
			return {
				dataList: [],
				options: {},
			};
		},
		onLoad(options) {
			this.options = options
		},
		onShow() {
			this.getListData()
		},
		methods: {
			getOrderStatus(item) {
				return getMallStatusName(item.status, item.orderType == 1)
			},
			goToDetail(item) {
				this.toPage(`/pages-order/orderDetails?id=${item.id}`)
			},
			getListData() {
				let params = {};
				if (this.options.projectId > 1) {
					params.projectId = this.options.projectId;
				} else {
					params.addressId = this.options.addressId;
				}
				this.$httpApi.getBillList(params).then(res => {
					this.dataList = res;
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.order-item {
		width: 750rpx;
		height: 135rpx;
		padding: 0 30rpx;
		border-bottom: 2rpx solid #f5f5f5;

		.left {
			width: 80%;
			height: 135rpx;
			padding: 20rpx 0;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;

			.name {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
			}

			.time {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #A8A8A8;
				line-height: 34rpx;
			}
		}

		.right {
			flex-shrink: 0;
			height: 135rpx;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
			padding: 20rpx 0;

			.price {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;

				.price-symbol {
					font-size: 14rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
				}
			}

			.status {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				line-height: 34rpx;
			}
		}

		.arrow {
			width: 10%;
			justify-content: center;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
