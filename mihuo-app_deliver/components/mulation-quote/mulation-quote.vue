<template>
	<view class="order-information mulation-quote">
		<view class="goods-list" @click="$emit('click',info)">
			<view class="item-goods-list">
				<image-lazy-load :image="info.productImg" height="176"></image-lazy-load>
				<view class="item-other">
					<view class="item-name">
						<text class="item-text">{{info.productName}}</text>
						<text v-if="info.serviceType != '1003'" class="item-price">￥{{info.payAmount}}</text>
						<text v-if="info.serviceType == '1003'" class="item-show">查看</text>
					</view>
					<view class="item-desc">
						<text
							class="public-item">{{$isJSON(info.productSku) &&　JSON.parse(info.productSku)[0] && JSON.parse(info.productSku)[0].value}}</text>
					</view>
					<view class="item-specifications">
						<view class="item-unit">
							<text v-if="info.serviceType != '1003'" class="public-item">￥{{info.price}}</text>
							<text v-if="info.serviceType != '1003' && info.unit" class="public-item" >/{{info.unit}}</text>
				
				
							<text v-if="info.serviceType == '1003'" class="public-price">￥{{info.payAmount}}</text>
						</view>
						<view class="public-item-calculate" v-if="inputStatus && info.serviceType != '1003'">
							<view class="item-operation" :class="[info.quantity == 1 ? 'item-operation-display':'']"
								@click="calculate('减')">
								<u-icon size="24" color="#C4C4C4" name="minus">
								</u-icon>
							</view>
							<view class="public-input-contain">
								<u-input @input="setInput($event)" @blur="setBlur($event)" class="public-input-num"
									input-align="center" height="52" v-model="info.quantity" :clearable="false"
									type="number" placeholder="" :border="false" />
							</view>
							<view class="item-operation" @click="calculate('加')">
								<u-icon size="24" color="#3A3838" name="plus">
								</u-icon>
							</view>
						</view>
						<text v-if="!inputStatus && info.serviceType != '1003'" class="item-num">x{{info.quantity}} </text>
				
					</view>
				</view>
			</view>
			<view v-if="info.remark" class="desc">
				{{info.remark}}
			</view>
			
		</view>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		name: 'order-information',
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			inputStatus: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				option: {}
			}
		},
		computed: {

		},
		mounted() {
			// console.log('info',this.info);
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			calculate(type) {
				this.$emit('calculate', {
					type: type
				})
			},
			setBlur(even) {
				if (!even) {
					this.$emit('calculate', {
						type: '输入',
						num: 1
					})
				}
			},
			setInput(even) {
				this.debounce(() => {
					even = even.replace(/[^\d]/g, "")
					if (even) {
						this.$emit('calculate', {
							type: '输入',
							num: even
						})
					}

				}, 200)
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.public-item {
		color: #999999;
		font-size: 26rpx;
		line-height: 26rpx;
	}

	.order-information {
		
		.item-goods-list{
			display: flex;
		}

		.goods-list {
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
			border-bottom: 1px dashed #EEEEEE;

			&:last-child {
				padding-bottom: 0rpx;
				margin-bottom: 0rpx;
				border-bottom: 0rpx;
			}

			.item-other {
				margin-left: 24rpx;
				display: flex;
				flex: 1;
				flex-direction: column;
				justify-content: space-around;


				.item-name {
					display: flex;
					justify-content: space-between;

					.item-text {
						color: #303133;
						font-size: 28rpx;
					}

					.item-price {
						color: #FF5D35;
						font-size: 28rpx;
					}

				}

				.item-cost {

					.item-text-price {
						color: #303133;
						font-size: 26rpx;
						margin-left: 20rpx;
					}
				}

				.status-name-waiting {
					color: #FF5D35;
				}

				.item-specifications {
					display: flex;
					justify-content: space-between;

					.item-unit {
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}

	.public-input-contain {
		width: 68rpx;
		// background-color: #F6F6F6;
		border-radius: 4rpx;
		font-size: 24rpx;
		height: 52rpx;
		margin: 0 2rpx 0 2rpx;
		border: 0.5px solid #EEEEEE;

		/deep/ .uni-input-input {
			color: #909199;
		}

		/deep/ .u-input__right-icon {
			padding-right: 0rpx !important;
		}
	}

	.public-item-calculate {
		display: flex;
		align-items: center;

		.calculate-num {
			margin: 0rpx 16rpx;
			color: $seconFontColor;
			font-size: $middleFontSize;
		}

		.item-operation {
			width: 52rpx;
			height: 52rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1rpx solid #EEEEEE;
			border-radius: 4rpx;
		}

		.item-operation-active {
			background-color: $themeColor;
		}

		.item-operation-border-active {
			border-color: $themeColor;
		}

		.item-operation-display {
			background-color: #e3e1e1;
			border-color: #e3e1e1;
		}
	}

	.item-show {
		color: #002FA5;
		font-size: 28rpx;
	}
	.public-price{
		color: #FF5D35;
		font-size: 28rpx;
	}
	
	.desc {
		color: #909199;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
</style>
