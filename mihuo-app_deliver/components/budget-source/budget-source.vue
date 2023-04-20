<template>
	<view class="budget-contian-list">
		<view class="item-budget-contain" v-for="(item, index) in list" :key="index">
			<view class="item-title-contain">
				<text class="item-left">{{ item.name }}</text>
				<view class="item-right">
					<text>总计</text>
					<text class="item-price">{{ getBudgeTotalPrice(item) }}</text>
					<text>元</text>
				</view>
			</view>
			<view class="work-list">
				<view class="item-work-contain" v-for="(ev, num) in item.groupPrices" :key="num">
					<view class="work-title">
						<text class="work-left">
							{{ ev.businessName }}
						</text>
					</view>
					<view class="work-contain-list">
						<view class="work-contain-all" v-for="(en, nums) in ev.products" :key="nums">
							<view class="work-contain">
								<image-lazy-load :image="en.productImg" :key="nums" height="146"></image-lazy-load>
								<view class="item-contain-left">
									<view class="item-name">
										{{ en.productName }}
									</view>
									<view class="item-statistical-contain">
										<text class="item-statistical">
											<text class="item-statistical-lable">预估量</text>
											<text class="item-statistical-lable">{{ en.budgetNum }}</text>
										</text>
										<text class="item-statistical">
											<text class="item-statistical-lable">开单量</text>
											<text class="item-statistical-lable">{{ en.orderNum }}</text>
										</text>
									</view>
									<view class="item-price-contain">
										<text class="item-unit">￥{{ en.price }}</text>
										<view v-if="en.operationShow || en.selectNum">
											<add-and-subtract :info="en" v-model="en.selectNum"
												@calculate="budgetCalculate"></add-and-subtract>
										</view>
										<view v-else class="add-listing" @click="$emit('addBudgetSource', en)">
											加入清单
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="list.length == 0" title="这里空荡荡哒～" />
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		name: 'budget-source',
		props: {
			list: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {}
		},
		computed: {

		},
		mounted() {

		},
		methods: {
			/**
			 * @description 预算来源价格统计
			 * */
			getBudgeTotalPrice(item) {
				let tempList = []
				item.groupPrices.forEach((el) => {
					el.products.forEach((ev) => {
						tempList.push(operation.floatMul(ev.budgetNum, ev.price || 0))
					})
				})
				let resultPice = operation.funCalc(tempList)
				return resultPice
			},
			/**
			 * @description 加减、输入操作
			 * @pamar type 1 加 2 减
			 * @pamar even 当前数据
			 * @pamar operationNumber 当前操作的数量
			 * */
			budgetCalculate(type, even, operationNumber) {
				this.$emit('budgetCalculate', type, even, operationNumber)
			}

		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.add-listing {
		padding: 8rpx 16rpx;
		border-radius: $miniBorderRadius;
		background: $themeColor;
		font-weight: 400;
		font-size: $smallFontSize;
		color: #fff;
	}

	.budget-contian-list {
		.item-budget-contain {
			margin-bottom: 40rpx;

			.item-title-contain {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.item-left {
					font-weight: bold;
					font-size: 30rpx;
					color: $seconFontColor;
				}

				.item-right {
					text {
						font-size: 24rpx;
						color: $errorFontColor;
					}

					.item-price {
						margin-left: 4rpx;
						font-size: 30rpx;
						color: $errorFontColor;
					}
				}
			}

			.work-list {
				.item-work-contain {
					margin-bottom: 16rpx;
					padding-bottom: 24rpx;
					border-bottom: 2rpx solid #f6f6f6;

					// &:last-child {
					// 	padding-bottom: 0rpx;
					// 	border-bottom: 0rpx;
					// }

					.work-title {
						display: flex;
						justify-content: space-between;
						margin-bottom: 10rpx;

						.work-left {
							padding: 4rpx 10rpx;
							border-radius: 16rpx 0rpx;
							background-color: $themeColor;
							font-size: 24rpx;
							color: #fff;
						}

						.work-right {
							.item-label {
								margin-right: 8rpx;
								font-size: 24rpx;
								color: #303133;
							}

							.item-price {
								font-size: 30rpx;
								color: #303133;
							}
						}
					}


					.work-contain-all {
						margin-bottom: 20rpx;
						padding-bottom: 20rpx;
						border-bottom: 2rpx solid #f6f6f6;

						&:last-child {
							margin-bottom: 0rpx;
							padding-bottom: 0rpx;
							border-bottom: 0rpx;
						}

						.work-contain {
							display: flex;
							flex-direction: row;

							.item-image {
								margin-right: 16rpx;
							}

							.item-contain-left {
								margin-left: 18rpx;
								width: 330rpx;

								.item-name {
									overflow: hidden;
									margin-bottom: 10rpx;
									width: 328rpx;
									text-overflow: ellipsis;
									font-size: 30rpx;
									color: #000;
									white-space: nowrap;
								}

								.item-statistical-contain {
									display: flex;
									align-items: center;
									margin-bottom: 18rpx;

									.item-statistical {
										margin-right: 32rpx;

										// white-space: nowrap;
										.item-statistical-lable {
											margin-right: 4rpx;
											font-size: 26rpx;
											color: #999;
										}

										.item-statistical-num {
											font-size: 26rpx;
											color: #303133;
										}

										.item-statistical-icon {
											color: $errorFontColor;
											transform: scale(.85);
										}

										.item-price {
											font-size: 32rpx;
											color: $errorFontColor;
										}
									}
								}

								.item-price-contain {
									display: flex;
									justify-content: space-between;

									.item-unit {
										font-size: 30rpx;
										color: $errorFontColor;
									}
								}
							}
						}

						.work-contain-input {
							margin-top: 20rpx;
							padding: 20rpx;
							border-radius: 10rpx;
							height: 84rpx;
							background-color: #f9f9f9;
						}
					}
				}
			}
		}
	}
</style>
