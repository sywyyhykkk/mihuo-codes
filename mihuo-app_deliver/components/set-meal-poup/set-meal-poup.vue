<template>
	<u-popup v-model="value" border-radius="20" height="1100" mode="bottom" @close="close"
		:safe-area-inset-bottom="true" :popup="false" :closeable="true">
		<view class="cat-top">
			<view class="default-tittle">
				<text>{{details.name || '套餐名称'}}</text>
			</view>
			<view class="item-input">
				<mihuo-input v-if="details" v-model="form.baseQuantity" type="number" integer placeholder="请输入"
					:unit="details.unit">
				</mihuo-input>
			</view>
		</view>
		<view class="set-meal-contain" :style="{'height': listHeight + 'rpx'}">
			<scroll-view :scroll-y="true" class="scroll-Y">
				<view v-if="details" class="set-meal-list">
					<view class="type" v-for="(item,index) in list" :key="index">
						<text class="type-name">{{item.name}}</text>
						<view class="group" v-for="(item2,index2) in item.children" :key="index2">
							<text class="group-name">{{item2.type}}</text>
							<view class="group-list">
								<view class="item-grop" v-for="(item3,index3) in item2.products" :key="index3">
									<view v-if="item3.show">
										<image-lazy-load @click="getCheckbox(item3,item2)" :viewStatus="false"
											:image="item3.productImg" height="200" :key="index3">
										</image-lazy-load>
										<view class="item-checkbox">
											<u-checkbox :disabled="item2.products.length > 1 ? false :true"
												shape="circle" v-model="item3.checkbox" :name="item3.id"
												@change="checkboxChange($event,item2)">
											</u-checkbox>
										</view>
									</view>
								</view>
							</view>
							<view v-if="item2.products.length > 3" class="more-contain display-center">
								<view class="text-more display-center" @click="getMore(item2)">
									<text>{{ item2.show ? '收起':'更多'}}</text>
									<u-icon :name=" item2.show? 'arrow-up':'arrow-down' " color="#002FA5" size="24">
									</u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
				<mh-empty v-if="!details" title="这里空荡荡哒～" />
			</scroll-view>
		</view>
		<view class="set-meal">
			<view class="left">
				<view class="price">
					<view v-if="totalPrice" class="symbol">￥</view>
					<view v-if="totalPrice" class="item-price">{{totalPrice}}</view>
				</view>
				<view v-if="details" class="dsec">每增加1{{details.unit}}，价格增加{{details.additionPrice}}元</view>
			</view>
			<view class="right" @click="add()">
				加入购物车
			</view>
		</view>
	</u-popup>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import operation from '@/plugins/mathoperation.js'
	export default {
		props: {
			value: {
				type: Boolean,
				default: false
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
			},
		},
		data() {
			return {
				option: {},
				showPopup: false,
				checkbox: false,
				details: '',
				treeCodeList: [],
				list: [],
				resultList: [],
				listHeight: 300,
				form: {
					baseQuantity: '', // 套餐基础数量
					basePrice: '', // 套餐基础价格
				}
			}
		},
		watch: {

		},
		computed: {
			...mapState(['shoppingCart', 'serviceGoodsList', 'projectInfo']),
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
					//减分
					resultTotal = operation.floatSub(this.form.basePrice, total)
				}
				if (resultTotal < 0) {
					return 0
				}
				return resultTotal
			}
		},
		mounted() {

		},
		watch: {
			value(val) {
				if (val) {
					this.open();
					this.getHeight()
				} else {
					this.close();
				}
			}
		},
		methods: {

			getTypeList() {
				this.treeCodeList = this.treeList.map(item => {
					return {
						treeCode: item.treeCode,
						name: item.name
					}
				})
				this.getskuDetails()
			},
			/**
			 * @description 查询商品详情
			 * */
			getskuDetails() {
				if (!this.detailId) {
					return
				}
				this.$httpApi.selectProductDetails({
					id: this.detailId,
				}).then(res => {
					if (res) {
						this.details = res
						this.form.baseQuantity = this.details.baseQuantity // 套餐基础数量
						this.form.basePrice = this.details.basePrice // 套餐基础价格
						this.list = this.group()
						this.initCheckbox()
					}
				})
			},
			open() {
				this.$nextTick(() => {
					this.$emit('open')
					this.getTypeList()
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('input', false)
				})
			},
			getCheckbox(item3, item2) {
				this.checkboxChange({
					name: item3.id
				}, item2)
			},
			checkboxChange(ev, item) {
				item.products.forEach(item3 => {
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
				item2.products.forEach((el, index) => {
					if (index > 2) {
						el.show = item2.show
					}
				})
				this.$forceUpdate()
			},
			add() {
				if (!this.details) {
					return
				}

				if (!this.verification()) {
					return
				}
				let tempList = JSON.parse(JSON.stringify(this.shoppingCart))
				let totalNum = this.resultList.length > 0 ? `包含${this.resultList.length}件商品` : ''
				let pagIds = this.resultList.map(item => {
					return item.id
				})

				let skuStocksId = this.details.skuStocks[0] && this.details.skuStocks[0].id
				let result = {
					name: this.details.name,
					coverImg: this.details.coverImg,
					productSku: '',
					skuId: skuStocksId,
					productId: this.details.id,
					unit: this.details.unit,
					price: this.totalPrice,
					totalNum: totalNum,
					selectNum: 1, // 选择数量
					treeCode: '3000', // 用于顶部类型筛选
					itemShow: true, // 控制是否显示
					makeExpensesShow: false, // 显示补齐价格
					makeExpenses: '', // 补齐价格
					customCategory: 1003, // 商品分类 1001=材料 1002=服务 1003=套餐 1010=线下材料
					packageInfo: { // 套餐信息
						packageId: this.details.id, // 主套餐商品id
						productPackageIds: pagIds.length ? pagIds.join(',') : '', // 套餐内数据id
						metric: this.form.baseQuantity, // 客户输入计量
						projectId: this.projectInfo.projectId, // 订单项目id
						packageId: this.details.id, // 主套餐商品id
					}
				}
				tempList.push(result)
				this.$store.commit('setShoppingCart', tempList)
				this.$emit('submit')
				this.close()
			},
			verification() {
				let verification = true
				this.resultList = []
				try {
					this.list.forEach(item => {
						item.children.forEach(item2 => {
							item2.checkboxList = item2.products.filter(item3 => item3.checkbox)
							item2.products.forEach(item4 => {
								if (item4.checkbox) {
									this.resultList.push(item4)
								}
							})
							if (item2.checkboxList.length == 0) {
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
					item.children.forEach(item2 => {
						item2.products.forEach((item3, index3) => {
							if (index3 > 2) {
								item3.show = false
							} else {
								if (item2.products.length == 1) {
									item3.checkbox = true
								}
							}
						})
					})
				})
			},
			group() {
				if (!this.details) {
					return
				}
				return this.$util.group(this.details.productPackageList, this.treeCodeList)
			},
			getHeight() {
				this.$nextTick(() => {
					let classStr = '',
						classStrList = ['.cat-top', '.set-meal']
					classStr = classStrList.join(', ')
					uni.createSelectorQuery().selectAll(classStr)
						.boundingClientRect(res => {
							if (res) {
								let total = 0
								res.forEach(el => {
									total += el.height
								})
								// let platform = uni.getSystemInfoSync().platform
								// let height = platform == "android" ? 1000 : 1000
								let result = Number(uni.upx2px(1000)) - total
								this.listHeight = this.$util.pxToRpx(result)
							}
						}).exec()
				})
			},

		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	/deep/.u-drawer-content {
		background-color: #fff;
	}

	/deep/ .u-empty {
		margin-top: 0rpx !important;
	}

	.cat-top {
		padding: 0rpx 36rpx;
	}

	.set-meal-contain {

		// border-bottom: 40rpx solid #F5F6F9;
		.scroll-Y {
			height: 100%;
		}

		.set-meal-list {
			padding: 20rpx 36rpx;
			height: 100%;

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
				background: rgba(0, 47, 165, 0.2);
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

		.more-contain {
			// margin-top: 10rpx;
		}

		.text-more {
			width: 152rpx;
			height: 66rpx;
			border-radius: 70rpx;
			background: rgba(0, 47, 165, 0.1);


			text {
				color: #002FA5;
				font-size: 28rpx;
				line-height: 66rpx;
				margin-right: 8rpx;
			}
		}

		.item-grop {
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
					background-color: #002FA5;
				}
			}

		}

	}

	.set-meal {
		position: absolute;
		width: 100%;
		display: flex;
		bottom: 0rpx;
		height: 104rpx;
		box-shadow: 0px -4px 4px 0px rgba(201, 201, 201, 0.25);
		background-color: #fff;
		z-index: 10;
		


		.left {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 14rpx 0rpx 18rpx 30rpx;


			.price {
				display: flex;
			}


			text {
				color: $errorFontColor;
				font-size: $middleAddFontSize;
				font-weight: bold;
			}

			.dsec {
				color: #909199;
				font-size: 24rpx;
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
			background-color: #002FA5;
			font-size: 28rpx;
			width: 274rpx;
			border-top-left-radius: 35px;
			font-weight: bold;
		}
	}

	.item-input {
		// height: 88rpx;
	}

	.default-tittle {
		overflow: hidden;
		margin: 0 20rpx;
		padding: 36rpx 0rpx;
		text-overflow: ellipsis;
		text-align: center;

		text {
			display: inline-block;
			overflow: hidden;
			max-width: 260px;
			text-overflow: ellipsis;
			font-size: 32rpx;
			color: $seconFontColor;
			white-space: nowrap;
		}
	}
</style>
