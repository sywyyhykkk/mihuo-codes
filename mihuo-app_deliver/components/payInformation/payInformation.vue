<template>
	<view v-if="info.payStages && info.payStages.length > 0" class="pay-information">
		<view class="title-name">
			<text class="title">支付信息</text>
		</view>
		<view class="by-stages">
			<view class="item-contain" v-for="(item, index ) in info.payStages" :key="index">
				<view class="name text-overflow"> <text class="item-name">{{item.name}}</text> <text v-if="item.ratio"
						class="item-name">{{ item.ratio * 100 }}% </text></view>
				<view class="pay-price text-overflow">
					<text class="character">￥</text>
					<text class="price">{{item.payAmount | priceFloor}}</text>
					<text class="price-suffix">{{item.payAmount | priceFormat}}</text>
				</view>
				<view v-if="!type" class="status_bar_default text-overflow">
					<view class="item-status" :class="[ item.success == 'success' ? 'status_bar_active':'status_bar']">
						<u-icon v-if="item.success == 'success'" name="checkmark-circle-fill" color="#002FA5" size="34">
						</u-icon>
						<u-icon v-else name="minus-circle-fill" color="#CCCCCC" size="34"></u-icon>
						<text class="status">{{ item.success == 'success' ? '已支付':'未支付' }}</text>
					</view>
				</view>
				<view v-if="item.payStatus == 'success' &&  getPayTime(item) && !type"
					class="time-contain text-overflow">
					<view class="time">
						{{getPayTime(item)}}
					</view>
				</view>
				<view v-if="item.payStatus !== 'success' && !type " class="button" @click="urge()">
					<view class="item-button">
						催款
					</view>
				</view>
				<view v-if="type" class="plan">付款计划</view>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from "@/static/js/moment.js"
	export default {
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			type: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				option: {},
				list: []
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getPayTime(item) {
				if (item.payTime) {
					let result = moment(Number(item.payTime)).format("MMMDo HH:mm")
					return result
				} else {
					return ''
				}
			},
			urge() {
				if (!this.info.id) {
					return
				}
				this.$httpApi.omsOrderPayPending({
					orderId: this.info.id
				}).then(res => {
					if (res) {
						this.$util.toast("催款成功");
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.text-overflow {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pay-information {
		margin-top: 10rpx;
		border-radius: 16rpx;
		background-color: #fff;

		.title-name {
			padding: 28rpx 30rpx;
			border-bottom: 1rpx solid #eee;
			line-height: 40rpx;

			.title {
				font-weight: bold;
				font-size: 28rpx;
				color: #333;
			}
		}

		.by-stages {
			display: flex;
			flex-direction: column;
			padding: 30rpx 40rpx;

			.item-contain {
				display: flex;
				// justify-content: space-between;
				margin-bottom: 34rpx;
				width: 100%;
				align-items: center;



				&:last-child {
					margin-bottom: 0rpx;
				}

				.name {
					width: 25%;

					.item-name {
						font-size: 26rpx;
						color: #333;
					}
				}

				.pay-price {
					width: 25%;
				}

				.price {
					font-size: 26rpx;
					color: $themeColor;
				}

				.character,
				.price-suffix {
					font-size: 24rpx;
					color: $themeColor;
				}

				.status_bar_default {
					display: flex;
					align-items: center;
					border-radius: 50rpx;
					height: 34rpx;
					width: 25%;

					.status_bar_active {
						background-color: rgba(0, 47, 165, .1);

						.status {
							color: $themeColor;
						}
					}

					.status_bar {
						background-color: rgba(144, 145, 153, .1);

						.status {
							color: #909199;
						}
					}


					.item-status {
						display: flex;
						align-items: center;

						.status {
							margin-left: 4rpx;
							padding-right: 14rpx;
							line-height: 32rpx;
							font-size: 24rpx;
						}


					}
				}

				.time-contain {
					width: 25%;
					display: flex;
					justify-content: end;
				}

				.time {
					font-size: 24rpx;
					color: #999;

				}

				.button {
					width: 25%;
					display: flex;
					justify-content: end;
				}

				.item-button {
					background-color: $themeColor;
					font-size: 24rpx;
					color: #fff;
					width: 134rpx;
					height: 50rpx;
					border-radius: 50rpx;
					text-align: center;
					line-height: 50rpx;

				}

				.plan {
					color: #999999;
					font-size: 26rpx;
					width: 55%;
					display: flex;
					justify-content: end;
				}
			}
		}
	}
</style>
