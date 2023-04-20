<template>
	<view>
		<view class="nav-bar" style="padding-top: 20rpx;" v-if="typeName">
			{{ typeName }}
		</view>
		<view class="cat-top">
			<view class="item-input">
				<mihuo-input v-if="details" v-model="form.baseQuantity" type="number" placeholder="请输入面积"
					unit="m²">
				</mihuo-input>
			</view>
			<!-- #ifndef APP-PLUS -->
			<view class="desc">每增加1m²，价格增加{{details.additionPrice}}元</view>
			<!-- #endif -->
		</view>
		<view class="set-meal-contain">
			<!-- #ifdef APP-PLUS -->
			<scroll-view scroll-y="true" class="scroll-view">
				<view v-if="details" class="set-meal-list">
					<view class="type" v-for="(item, index) in list" :key="index">
						<text class="type-name">
							{{item.name}}
						</text>
						<view class="group" v-for="(item2, index2) in item.children" :key="index2">
							<text class="group-name">
								{{item2.type}}
							</text>
							<view class="group-list">
								<view class="item-grop" v-for="(item3, index3) in item2.products" :key="index3">
									<view v-if="item3.show">
										<u-lazy-load @click="getCheckbox(item3, item2)"
											:image="$util.thumbnailImage(item3.productImg)" height="200" :key="index3">
										</u-lazy-load>
										<view class="item-checkbox">
											<u-checkbox :disabled="item2.products.length > 1 ? false : true"
												v-model="item3.checkbox" shape="circle" @change="checkboxChange">
											</u-checkbox>
										</view>
									</view>
								</view>
							</view>
							<view v-if="item2.products && item2.products.length > 3" class="more-contain display-center">
								<view class="text-more display-center" @click="getMore(item2)">
									<text>
										{{ item2.show ? '收起' : '更多' }}
									</text>
									<u-icon :name=" item2.show? 'arrow-up':'arrow-down' " color="#FE6E32" size="24">
									</u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
				<mh-empty v-if="!details" title="这里空荡荡哒～" />
			</scroll-view>
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<view>
				<view v-if="details" class="set-meal-list">
					<view class="type" v-for="(item, index) in list" :key="index">
						<text class="type-name">
							{{item.name}}
						</text>
						<view class="group" v-for="(item2, index2) in item.children" :key="index2">
							<text class="group-name">
								{{item2.type}}
							</text>
							<view class="group-list">
								<view class="item-grop" v-for="(item3, index3) in item2.products" :key="index3">
									<view v-if="item3.show">
										<u-lazy-load @click="getCheckbox(item3, item2)"
											:image="$util.thumbnailImage(item3.productImg)" height="200" :key="index3">
										</u-lazy-load>
										<view class="item-checkbox">
											<u-checkbox :disabled="item2.products && item2.products.length > 1 ? false : true"
												v-model="item3.checkbox" shape="circle" @change="checkboxChange">
											</u-checkbox>
										</view>
									</view>
								</view>
							</view>
							<view v-if="item2.products && item2.products.length > 3" class="more-contain display-center">
								<view class="text-more display-center" @click="getMore(item2)">
									<text>
										{{ item2.show ? '收起' : '更多' }}
									</text>
									<u-icon :name=" item2.show? 'arrow-up':'arrow-down' " color="#FE6E32" size="24">
									</u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
				<mh-empty v-if="!details" title="这里空荡荡哒～" />
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="set-meal">
				<view class="left">
					<view class="price">
						<view class="symbol">￥</view>
						<view class="item-price">{{ totalPrice }}</view>
					</view>
					<view class="desc">每增加1m²，价格增加{{details.additionPrice}}元</view>
					<!-- <view class="desc">每增加1{{details.unit}}，价格增加{{details.additionPrice}}元</view> -->
				</view>
				<view class="right" @click="submitPackage()">
					{{ buttonType === 2 ? '加入购物车' : '立即购买' }}
				</view>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		props: {
			buttonType: {
				type: [String, Number],
				default: 2
			},
			detailId: {
				type: [String, Number],
				default: ''
			},
			treeList: {
				type: Array,
				default: function() {
					return []
				}
			},
			typeName: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				packageInfo: [],
				option: {},
				showPopup: false,
				checkbox: false,
				details: '',
				treeCodeList: [],
				list: [],
				resultList: [],
				form: {
					baseQuantity: '', // 套餐基础数量
					basePrice: '', // 套餐基础价格
				}
			}
		},
		computed: {
			totalPrice() {
				if (this.form.baseQuantity == this.details.baseQuantity) {
					return this.form.basePrice
				}
				// 1.输入的值大于基础数量，则通过增项单价重新计算，反之亦然
				let diff = operation.floatSub(this.form.baseQuantity, this.details.baseQuantity),
					resultDiff = Math.abs(diff),
					total = '',
					resultTotal = ''
				if (diff > 0) {
					// 套餐增项金额
					if (this.details.additionPrice) {
						total = operation.floatMul(resultDiff, this.details.additionPrice)
					}
					// 加法
					resultTotal = operation.floatAdd(this.form.basePrice, total)
				} else if (diff < 0) {
					// 套餐减项金额
					if (this.details.additionPrice) {
						total = operation.floatMul(resultDiff, this.details.reducePrice)
					}
					// 减法
					resultTotal = operation.floatSub(this.form.basePrice, total)
				}
				if (resultTotal < 0) {
					return 0
				}
				return resultTotal
			}
		},
		mounted() {
			this.getTypeList()
		},
		methods: {
			getTypeList() {
				this.treeCodeList = this.treeList.map(item => {
					return {
						treeCode: item.treeCode,
						name: item.name
					}
				})
				this.getSkuDetails()
			},
			/**
			 * @description 查询商品详情
			 * */
			getSkuDetails() {
				if (!this.detailId) {
					return
				}
				this.$httpApi.getCommodityOverView({
					id: this.detailId,
				}).then(res => {
					if (res) {
						this.details = res
						this.form.baseQuantity = this.details.baseQuantity // 套餐基础数量
						this.form.basePrice = this.details.basePrice // 套餐基础价格
						this.list = this.$util.group(this.details.productPackageList, this.treeCodeList)
						this.initCheckbox()
					}
				})
			},
			getCheckbox(item3, item2) {
				this.checkboxChange({
					name: item3.id
				}, item2)
			},
			checkboxChange(ev, item) {
				item.products && item.products.forEach(item3 => {
					if (item3.id !== ev.name) {
						item3.checkbox = false
					} else {
						item3.checkbox = true
					}
				})
				this.$forceUpdate()
			},
			getMore(item2) {
				item2.show = !item2.show
				item2.products && item2.products.forEach((el, index) => {
					if (index > 2) {
						el.show = item2.show
					}
				})
				this.$forceUpdate()
			},
			// 确认选择套餐
			submitPackage() {
				if (!this.verification()) {
					return
				}
				const skuStocksId = this.details.skuStocks[0] && this.details.skuStocks[0].id
				const pagIds = this.resultList.map(item => {
					return item.id
				})
				const result = {
					skuId: skuStocksId,
					selectNum: 1,
					packageInfo: {
						packageId: this.details.id, // 主套餐商品id
						productPackageIds: (pagIds && pagIds.length) ? pagIds.join(',') : '', // 套餐内数据id
						metric: this.form.baseQuantity, // 客户输入计量
					}
				}
				this.packageInfo = result
				this.$emit('submit', this.packageInfo)
			},
			verification() {
				let verification = true
				this.resultList = []
				try {
					this.list.forEach(item => {
						item.children.forEach(item2 => {
							item2.checkboxList = item2.products?.filter(item3 => item3.checkbox)
							item2.products?.forEach(item4 => {
								if (item4.checkbox) {
									this.resultList.push(item4)
								}
							})
							if (item2.checkboxList?.length == 0) {
								throw item2
							}
						})
					})

				} catch (e) {
					verification = false
					this.$util.toast(`${e.type}请至少选择一个商品~`)
				}
				return verification
			},
			initCheckbox() {
				if (!this.details) {
					return
				}
				// 1.默认显示前三个数据
				// 2.该分类下只有一个数据时，默认选中
				this.list.forEach(item => {
					item.children?.forEach(item2 => {
						item2.products?.forEach((item3, index3) => {
							if (index3 > 2) {
								item3.show = false
							} else {
								if (item2.products?.length == 1) {
									item3.checkbox = true
								}
							}
						})
					})
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	/deep/ .u-empty {
		margin-top: 0rpx !important;
	}

	.cat-top {
		padding: 0rpx 36rpx 0;
	}

	.set-meal-contain {
		padding-top: 30rpx;
		@include safearea();
		
		.scroll-view {
			height: 660rpx;
		}

		.set-meal-list {
			padding: 20rpx 36rpx;

			.group {
				margin-top: 20rpx;
			}

			.type-name {
				font-size: 30rpx;
				font-weight: bold;
			}

			.group-name {
				display: inline-block;
				border-radius: 16rpx 0rpx 16rpx 0rpx;
				background: rgba(254, 110, 50, 0.1);
				font-size: 28rpx;
				padding: 0 24rpx;
				line-height: 50rpx;
				color: $themeColor;
			}
		}

		.group-list {
			display: flex;
			margin-top: 8rpx;
			flex-wrap: wrap;
		}

		.text-more {
			width: 152rpx;
			height: 66rpx;
			border-radius: 70rpx;
			background: rgba(254, 110, 50, 0.1);

			text {
				color: #FE6E32;
				font-size: 28rpx;
				line-height: 66rpx;
				margin-right: 8rpx;
			}
		}

		.item-grop {
			width: 200rpx;
			position: relative;
			margin-right: 30rpx;
			margin-bottom: 20rpx;

			&:nth-of-type(3n) {
				margin-right: 0rpx;
			}

			.record-item-img {
				width: 200rpx;
				height: 200rpx;
			}

			.item-checkbox {
				position: absolute;
				top: 0rpx;
				left: 10rpx;
				z-index: 9;
				height: 50rpx;
				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				/deep/ .u-checkbox__icon-wrap {
					border: 2rpx solid #fff;
					background-color: #fff;
				}

				/deep/ .u-checkbox__label {
					margin-right: 0rpx !important;
				}

				/deep/.u-checkbox__icon-wrap--checked {
					background-color: #FE6E32;
				}
			}
		}
	}
	
	.desc {
		color: #909199;
		font-size: 24rpx;
	}

	.set-meal {
		width: 100%;
		display: flex;
		height: 104rpx;
		box-shadow: 0px -4px 4px 0px rgba(201, 201, 201, 0.25);

		.left {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 14rpx 0rpx 18rpx 30rpx;

			.price {
				display: flex;
			}

			text {
				color: #EA3B3B;
				font-size: $middleAddFontSize;
				font-weight: bold;
			}

			.symbol {
				transform: scale(0.9);
				transform-origin: bottom;
				font-size: 24rpx;
				color: $errorFontColor;
			}

			.item-price {
				color: $errorFontColor;
			}
		}

		.right {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #FFF;
			background-color: #FE6E32;
			font-size: 28rpx;
			width: 274rpx;
			border-top-left-radius: 70rpx;
			font-weight: bold;
		}
	}

	.item-input {
		height: 88rpx;
	}

	.display-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
