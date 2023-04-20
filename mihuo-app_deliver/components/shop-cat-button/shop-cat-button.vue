<template>
	<view class="bottom-contain">
		<!-- 补齐费用 -->
		<view class="make-up-expenses">
			<view class="item-make-up-expenses">
				<text> 是否计算最低补齐费用</text>
				<u-switch v-model="makeUpExpensesStatus" @change="switchChange" size="30" active-color="#002FA5">
				</u-switch>
			</view>
			<view class="item-right" @click="toPage('/pages/construction/billingTemplate/list?pageType=快速预算')">
				<view class="item-template">导入模板材料</view>
				<u-icon name="download" color="#303133" size="30"></u-icon>
			</view>
		</view>
		<view class="bottom-contain-all">
			<view class="left" @click="$emit('openShopCat')">
				<view class="item-left">
					<image src="@/static/images/material-shopping-cart.png"></image>
					<text class="num" v-if="shoppingCart && shoppingCart.length">{{ getNum }}</text>
				</view>
				<view class="other">
					<view class="select-num">
						<view class="symbol">￥</view>
						<view class="item-price">{{ selectServicePice }}</view>
					</view>
					<view class="select-text">点击查看已选</view>
				</view>
			</view>
			<view class="right" @click="$emit('submit')">
				{{ pageType == '快速预算' ? '保存' : '开单' }}
			</view>
		</view>
	</view>
</view></template>

<script>
import {
	mapState
} from 'vuex'
import operation from '@/plugins/mathoperation.js'
export default {
	props: {
		pageType: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			makeUpExpensesStatus: false,
			serviceCategory: ['1002'],
			materialCategory: ['1001'],
			option: {}
		}
	},
	computed: {
		...mapState([
			'shoppingCart',
		]),
		selectServicePice() {
			let tempPice = []
			this.shoppingCart.map((item) => {
				tempPice.push(operation.floatMul(item.selectNum, item.price || 0))
				// 应补费用
				if (Number(item.makeExpenses) > 0 && this.makeUpExpensesStatus) {
					tempPice.push(item.makeExpenses)
				}
			})
			let resultPice = operation.funCalc(tempPice)
			return resultPice
		},
		/**
		 * @description 商品数量
		 * */
		getNum() {
			let tempNum = 0
			this.shoppingCart.map((item) => {
				tempNum++
			})
			return tempNum
		}
	},
	mounted() {

	},
	onShow() {

	},
	methods: {
		/**
		 * @description 补齐费用
		 * 规则见 tfs #26253
		 * */
		switchChange() {
			this.$emit('setMakeUpExpensesStatus', this.makeUpExpensesStatus)

			let tempList = JSON.parse(JSON.stringify(this.shoppingCart))
			if (!this.makeUpExpensesStatus) {
				this.$store.commit('setShoppingCart', tempList)
				return
			}
			if (tempList.length == 0) {
				this.$util.toast('请选择商品')
				this.makeUpExpensesStatus = false
				return
			}
			let tempmaterialList = [],
				ids = [],
				artificial = [],
				maxCostList = [],
				resultList = [],
				materialIds = [],
				artificialIds = []
			tempList.forEach((el) => {
				ids.push(el.productId || el.skuId)
			})

			if (ids.length == 0) {
				return
			}
			this.$httpApi.selectCommonlyUser(ids).then((res) => {
				if (res) {
					// 1.材料 =》单个材料的补齐费用 = minAmount - materialSkuPic

					// 1.1初始化字段
					res.forEach((el) => {
						el['totalSkuPicList'] = []
						el['totalSkuPic'] = ''
					})

					// 1.2同一个材料商品、不同sku，计算总价
					res.forEach((el) => {
						tempList.forEach((ev) => {
							if (el.id == ev.productId) {
								el['totalSkuPicList'].push(
									operation.floatMul(ev.selectNum, ev.price)
								)
								el['totalSkuPic'] = operation.funCalc(el['totalSkuPicList'])
							}
						})
					})

					console.log('tempList', tempList)

					res.forEach((el) => {
						tempList.forEach((ev) => {
							if (el.id == ev.productId) {
								// 材料
								if (this.materialCategory.includes(ev.customCategory)) {
									// 商品总价小于商品最低价才显示补齐费用
									if (Number(el.totalSkuPic) < Number(el.minAmount)) {
										if (!artificialIds.includes(el.id)) {
											artificialIds.push(el.id)
											// 计算补齐费用( 最低价 - 商品总价)

											// 套餐内商品不计算补齐费用	
											ev['makeExpenses'] = ev.packageFlag ? 0 : operation.floatSub(
												el.minAmount,
												el.totalSkuPic
											)
										}
									} else {
										ev['makeExpenses'] = ''
									}
								} else if (this.serviceCategory.includes(ev.customCategory)) {
									// 服务
									// 2.人工服务分组
									maxCostList.push({
										id: el.id,
										minAmount: el.minAmount,
										skillType: el.skillType,
										price: ev.price,
										selectNum: ev.selectNum,
										skillTypeName: el.skillTypeName
									})
								}
							}
						})
					})

					// 3.同工种最高补齐价格
					maxCostList = maxCostList.sort(this.sortArr('minAmount'))
					// 4.按工种分组
					let artificialGrouping = this.analysisData(maxCostList)

					artificialGrouping.forEach((el) => {
						if (el.list) {
							resultList.push({
								minAmount: el.list[0].data.minAmount,
								id: el.list[0].data.id,
								totalPrice: el.totalPrice
							})
						}
					})

					tempList.forEach((ev) => {
						if (this.serviceCategory.includes(ev.customCategory)) {
							resultList.forEach((el) => {
								if (el.id == ev.productId) {
									// 总价大于最低价才显示补齐费用
									if (el.totalPrice < el.minAmount) {
										if (!materialIds.includes(el.id)) {
											materialIds.push(el.id)
											// 计算补齐费用( 最低价 - 商品总价)
											// 套餐内服务不计算补齐费用	
											ev['makeExpenses'] = ev.packageFlag ? 0 : operation.floatSub(
												el.minAmount,
												el.totalPrice
											)
										}
									} else {
										ev['makeExpenses'] = ''
									}
								} else {
									// 避免添加时出错
									// ev['makeExpenses'] = ''
								}
							})
						}
					})
					tempList.map((item) => {
						if (Number(item.makeExpenses) > 0) {
							item['makeExpensesShow'] = true
						}
					})
					this.$store.commit('setShoppingCart', tempList)
					// debugger
				}
			})
		},
		/**
		 * @description 排序
		 * */
		sortArr(attr) {
			return function (a, b) {
				return a[attr] - b[attr]
			}
		},
		/**
		 * @description // 按工种组装数据，自定义服务默认为自定义分组
		 * 
		 * */
		analysisData(list) {
			if (list.length > 0) {
				let tempList = JSON.parse(JSON.stringify(list))
				let tempListResult = this.setMaterialType(tempList, 'skillType', 'skillTypeName')
				// 根据工种统计价格
				tempListResult.forEach((el) => {
					el['allTotalPiceList'] = []
				})

				console.log('tempListResult', tempListResult);

				tempListResult.map((item) => {
					if (item.list.length > 0) {
						item.list.map((ev) => {
							// 1.数量*价格
							item['allTotalPiceList'].push(
								operation.floatMul(ev.selectNum, ev.price || 0)
							)
						})
						// 2.价格相加
						item['totalPrice'] = operation.funCalc(item.allTotalPiceList)
					}
				})
				return tempListResult
			} else {
				return []
			}
		},
		/**
		 * @description 分组
		 * 
		 * */
		setMaterialType(result, itemType, typeName) {
			let map = {}
			let dest = []
			let resultList = []
			result.forEach((item) => {
				if (!map[item[itemType]]) {
					dest.push({
						type: item[itemType],
						typeName: item[typeName],
						list: [this.createProduct(item)]
					})
					map[item[itemType]] = item
				} else {
					dest.forEach((el) => {
						if (el.type == item[itemType]) {
							el.list.push(this.createProduct(item))
						}
					})
				}
			})
			resultList = [...dest]
			return resultList
		},
		/**
		 * @description 创建商品
		 * */
		createProduct(item) {
			return {
				data: item,
				skuList: [],
				price: item.price,
				selectNum: item.selectNum,
			}
		},

	}
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */


.bottom-contain {
	position: fixed;
	bottom: 0rpx;
	z-index: 10;
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	width: 100%;
	background-color: #fff;
	box-shadow: 0 -8rpx 8rpx rgba(201, 201, 201, .25);

	.bottom-contain-all {
		display: flex;
	}

	.make-up-expenses {
		display: flex;
		align-items: center;
		margin: 0 20rpx 10rpx;
		border-bottom: 2rpx solid #f6f6f6;

		.item-make-up-expenses {
			display: flex;
			align-items: center;
			padding: 0 34rpx;
			// justify-content: space-between;
			height: 78rpx;

			text {
				margin-right: 10rpx;
				font-size: 24rpx;
				color: #303133;
			}
		}

		.item-right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			flex: 1;
			height: 78rpx;

			.item-template {
				font-size: 32rpx;
				color: #303133;
			}
		}
	}

	.left {
		display: flex;
		flex: 1;
		padding: 12rpx 0 6rpx 66rpx;

		image {
			width: 88rpx;
			height: 88rpx;
		}

		.item-left {
			position: relative;
			margin-right: 52rpx;

			.num {
				display: flex;
				position: absolute;
				right: -20rpx;
				top: 10rpx;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				width: 32rpx;
				height: 32rpx;
				background-color: $errorFontColor;
				font-size: $smallFontSize;
				color: #fff;
			}
		}

		.other {
			.select-num {
				display: flex;
				color: $errorFontColor;

				// font-size: $middleFontSize;
				text {
					font-weight: bold;
					font-size: $middleAddFontSize;
					color: $errorFontColor;
				}

				.symbol {
					font-size: 24rpx;
					color: $errorFontColor;
					transform: scale(.9);
					transform-origin: bottom;
				}

				.item-price {
					color: $errorFontColor;
				}
			}

			.select-text {
				position: relative;
				left: -14rpx;
				font-size: $smallFontSize;
				color: $viceFontColor;
				transform: scale(.85);
			}
		}
	}

	.right {
		display: flex;
		justify-content: center;
		align-items: center;
		border-top-left-radius: 70rpx;
		width: 274rpx;
		height: 106rpx;
		background-color: $themeColor;
		font-weight: bold;
		font-size: $middleFontSize;
		color: #fff;
	}
}
</style>
