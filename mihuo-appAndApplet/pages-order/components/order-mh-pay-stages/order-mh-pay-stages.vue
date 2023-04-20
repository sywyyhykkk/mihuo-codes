<template>
	<view>
		<view class="pay-stages" v-if="type == '1'">
			<view class="stage-item flex-center" v-for="item, index in dataList" :key="index">
				<view class="name item" style="width: 20%;">
					{{ item.name }}
				</view>
				<view class="amount item" v-if="item.finalType == 1" style="width: 30%;">
					<!-- 尾款 -->
					<text class="text" style="font-size: 20rpx;">
						¥
					</text>
					<text class="text">
						{{ Math.floor(item.payAmount) }}
					</text>
					<text class="text" style="font-size: 20rpx;">
						{{ item.payAmount | priceFormat }}
					</text>
				</view>
				<view class="amount item" v-else-if="item.type === 0" style="width: 30%;">
					<!-- 定额 -->
					<text class="text" style="font-size: 20rpx;">
						¥
					</text>
					<text class="text">
						{{ Math.floor(item.payAmount) }}
					</text>
					<text class="text" style="font-size: 20rpx;">
						{{ item.payAmount | priceFormat }}
					</text>
				</view>
				<view class="amount item" v-else-if="item.type === 1" style="width: 30%;">
					<!-- 百分比 -->
					<text class="text">
						{{ item.ratio * 100 }}%(¥{{ item.payAmount }})
					</text>
				</view>
				<view class="status item">
					<view class="item-status unpay" v-if="item.payStatus !== 'success'">
						未支付
					</view>
					<view class="item-status paid" v-else>
						已支付
					</view>
				</view>
				<view class="info item flex-center">
					<text class="pay-time" v-if="item.payStatus === 'success' && item.payTime">
						{{ item.payTime.substring(5, 16) }}
					</text>
					<text class="pay-button" v-if="item.payStatus !== 'success' && showButton" @click.stop="payOrder">
						去支付
					</text>
					<!-- <text>
					未到时间
				</text> -->
				</view>
			</view>
		</view>
		<view class="pay-stages" v-if="type == '2'">
			<view class="stage-item flex-center" v-for="item, index in dataList" :key="index">
				<text class="stage-name" :style="{ color: (index < getCurrentStage) ? '#FE6E32' : '#999999',
							  '--activity-color': (index + 1 < getCurrentStage) ? '#FE6E32' : '#999999',
							  '--display-line': (index === dataList.length - 1) ? 'none' : ''
							}">
					{{ item.name }}
				</text>
				<view class="stage-dot"
					:style="{ '--activity-color': (index < getCurrentStage) ? '#FE6E32' : '#999999' }">
				</view>
				<view class="item-status unpay" v-if="item.payStatus !== 'success'" style="margin-left: 20rpx;">
					未支付
				</view>
				<view class="item-status paid" v-else style="margin-left: 20rpx;">
					已支付
				</view>
				<text class="pay-time" v-if="item.payStatus === 'success' && item.payTime" style="margin-left: 20rpx;">
					{{ item.payTime.substring(5, 16) }}
				</text>
				<text class="pay-amount" :style="{ color: item.payStatus === 'success' ? '#ED3832' : '#999999' }">
					{{ item.payAmount }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			type: {
				type: String || Number,
				default: '1'
			},
			dataList: {
				type: Array,
				default: () => {
					return []
				}
			},
			showButton: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {

			}
		},
		computed: {
			getCurrentStage() {
				const lastIndex = this.$tools.findLastIndex(this.dataList, item => item.payStatus === 'success')
				return lastIndex + 1
			}
		},
		methods: {
			payOrder() {
				this.$emit('payOrder')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pay-stages {
		width: 100%;
		height: max-content;
		padding-top: 30rpx;

		.stage-item {
			width: 660rpx;
			height: 60rpx;
			position: relative;

			.item {
				width: 25%;
				@include toe();
			}

			.name {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #808080;
				line-height: 60rpx;
			}

			.amount {
				.text {
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 60rpx;
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
				background-image: url(../../static/images/unpay.png);
			}

			.paid {
				color: #FE6E32;
				background-image: url(../../static/images/paid.png);
			}

			.pay-time {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #B3B3B3;
				line-height: 60rpx;
			}

			.info {
				.pay-button {
					width: 130rpx;
					height: 50rpx;
					padding: 0 20rpx;
					background: #000000;
					border-radius: 30rpx;
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 50rpx;
					text-align: center;
				}
			}

			.stage-dot {
				width: 12rpx;
				height: 12rpx;
				background: #FE6E32;
				border-radius: 50%;
				position: absolute;
				left: -23rpx;
				top: 25rpx;
				background-color: var(--activity-color);
			}

			.stage-name {
				width: max-content;
				height: 60rpx;
				max-width: 100rpx;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				line-height: 60rpx;
				position: relative;
				color: #FE6E32;

				::before {
					content: '';
					width: 4rpx;
					height: 54rpx;
					background-color: var(--activity-color);
					position: absolute;
					left: -20rpx;
					top: 32rpx;
					display: var(--display-line);
				}
			}
			
			.pay-amount {
				flex: 1;
				text-align: right;
				font-size: 30rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				line-height: 34rpx;
				padding-right: 30rpx;
				
				::before {
					content: '¥';
					font-size: 20rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
