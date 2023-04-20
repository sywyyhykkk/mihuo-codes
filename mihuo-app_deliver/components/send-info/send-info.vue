<template>
	<view class="">
		<view class="item-bottom">
			<view class="info-item">
				<view class="item-title">订单编号</view>
				<view class="item-text">{{orderData.orderCode}}</view>
			</view>
			<view class="info-item">
				<view class="item-title">计价类型</view>
				<view class="item-text">{{ orderData.priceWay === 1 ? '直接指派(一口价)' : '议价' }}</view>
			</view>
			<view class="info-item">
				<view class="item-title">预计工期</view>
				<view class="item-text">
					{{nodeInfo.expectStartTime}}至{{nodeInfo.expectFinishTime}}&nbsp;共{{getDateNumber(nodeInfo.expectStartTime,nodeInfo.expectFinishTime).timeNum}}天
				</view>
			</view>
			<view class="info-item">
				<u-avatar size="32" :src="$util.avatarImage(orderData.userId)" />
				<view class="item-name">{{projectInfo.pioneerName}}({{projectInfo.pioneerJobName}})
				</view>
				<view class="item-date">{{projectInfo.created}} 派单</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	export default {
		props: {
			orderData: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
			}
		},
		computed: {
		   ...mapState(['projectInfo','nodeInfo'])
		  },
		mounted() {},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.item-bottom {}

	.info-item {
		display: flex;
		align-items: center;
		height: 60rpx;

		.item-name {
			font-weight: normal;
			font-size: 24rpx;
			color: #606166;
			margin-left: 10rpx;
		}

		.item-date {
			font-weight: normal;
			font-size: 24rpx;
			color: #909199;
			margin-left: 20rpx;
		}

		.item-title {
			font-weight: normal;
			font-size: 28rpx;
			color: #909199;

		}

		.item-text {
			font-weight: normal;
			font-size: 28rpx;
			color: #333333;
			margin-left: 30rpx;
		}
	}
</style>
