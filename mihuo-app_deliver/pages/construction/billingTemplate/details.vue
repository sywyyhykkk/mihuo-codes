<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.template-page {
		padding-top: 10rpx;
		display: flex;
		// padding-bottom: 180rpx;
	}








	.item-material-list {

		.item-material {
			padding-bottom: 30rpx;
			border-bottom: 2rpx solid #F3F3F3;
			margin-bottom: 28rpx;
			display: flex;
			flex-direction: column;

			.item-select-other {
				display: flex;
			}

			.item-specifications {
				margin-top: 20rpx;

				.item-name {
					color: #303133;
					font-size: $smallFontSize;
				}

				.specifications {
					color: $viceFontColor;
					font-size: $smallFontSize;
					margin-bottom: 4rpx;
					height: 30rpx;
				}
			}

			.select-sku-contain {
				display: flex;
				margin-top: 40rpx;

				.item-left {
					display: flex;
					flex: 1;
					color: #606166;
					font-size: 24rpx;
					white-space: nowrap;
				}

				.item-right {
					width: 100%;

					.item-sku {
						display: flex;
						justify-content: space-between;
						margin-bottom: 12rpx;

						&:last-child {
							margin-bottom: 0rpx;
						}

						.item-text {
							color: #606166;
							font-size: 24rpx;
						}
					}
				}
			}

			.item-right-material {
				display: flex;
				flex-direction: column;
				flex: 1;
				margin-left: 20rpx;

				.material-name {
					color: $seconFontColor;
					font-size: $middleFontSize;
					margin-bottom: 10rpx;
				}

				.material-other {
					display: flex;
					justify-content: space-between;

					.left {
						display: flex;
						flex-direction: column;
						max-width: 500rpx;

						.specifications {
							color: $viceFontColor;
							font-size: $smallFontSize;
							margin-bottom: 4rpx;
							height: 30rpx;
						}

						.unit {
							color: $seconFontColor;
							font-size: $smiddleFontSize;
						}
					}

					.right {
						display: flex;
						align-items: flex-end;
					}





				}
			}
		}
	}

	.no-material-list {
		height: 60%;
		display: flex;
		align-items: center;
		justify-content: center;

		.item-no {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		image {
			width: 142rpx;
			height: 142rpx;
			margin-bottom: 40rpx;
		}

		.desc {
			display: flex;
			justify-content: center;
			flex-direction: column;
		}

		.no-text {
			font-size: $middleFontSize;
			color: $seconFontColor;
			text-align: center;
		}

		.try-text {
			font-size: $smallFontSize;
			color: $viceFontColor;
		}
	}

	.budget-contian-list {
		width: 100%;
		padding-bottom: 140rpx;


		.item-budget-contain {
			margin-bottom: 10rpx;
			background-color: #fff;
			display: flex;
			flex-direction: column;
			width: 100%;
			padding: 32rpx 26rpx;

			.item-title-contain {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.item-left {
					font-size: 30rpx;
					color: $seconFontColor;
					font-weight: bold;

				}

				.item-right {
					text {
						font-size: 24rpx;
						color: $errorFontColor;
					}

					.item-price {
						font-size: 30rpx;
						color: $errorFontColor;
						margin-left: 4rpx;
					}
				}

			}

			.work-list {
				.item-work-contain {
					margin-bottom: 16rpx;
					padding-bottom: 24rpx;
					border-bottom: 2rpx solid #F6F6F6;

					&:last-child {
						border-bottom: 0rpx;
						padding-bottom: 0rpx;
					}

					.work-title {
						display: flex;
						justify-content: space-between;
						margin-bottom: 10rpx;

						.work-left {
							font-size: 24rpx;
							padding: 4rpx 10rpx;
							border-radius: 16rpx 0rpx 16rpx 0rpx;
							background-color: $themeColor;
							color: #fff;
						}

						.work-right {
							.item-label {
								font-size: 24rpx;
								color: #303133;
								margin-right: 8rpx;
							}

							.item-price {
								font-size: 30rpx;
								color: #303133;
							}
						}

					}

					.work-contain-list {}

					.work-contain-all {
						border-bottom: 2rpx solid #F6F6F6;
						padding-bottom: 20rpx;
						margin-bottom: 20rpx;

						&:last-child {
							border-bottom: 0rpx;
							margin-bottom: 0rpx;
							padding-bottom: 0rpx;

						}

						.work-contain {
							display: flex;
							flex-direction: row;


							.item-contain-left {
								margin-left: 16rpx;
								width: 100%;

								.item-name {
									width: 328rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									font-size: 30rpx;
									color: #000000;
									margin-bottom: 10rpx;

								}

								.item-statistical-contain {
									display: flex;
									align-items: center;
									margin-bottom: 18rpx;

									.item-statistical {
										margin-right: 32rpx;
										// white-space: nowrap;

										.item-statistical-lable {
											font-size: 26rpx;
											color: #999999;
											margin-right: 4rpx;
										}

										.item-statistical-num {
											font-size: 26rpx;
											color: #303133;
										}

										.item-statistical-icon {
											color: $errorFontColor;
											transform: scale(0.85);
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
										color: $errorFontColor;
										font-size: 30rpx;
									}
								}
							}
						}

						.work-contain-input {
							background-color: #F9F9F9;
							border-radius: 10rpx;
							height: 84rpx;
							padding: 20rpx;
							margin-top: 20rpx;
						}
					}

				}
			}

		}
	}




	.item-statistical-specifications {
		color: #999999;
		font-size: 26rpx;
		white-space: nowrap;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
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
	}
</style>


<template>
	<view class="template-page">
		<view class="budget-contian-list">
			<view class="item-budget-contain" v-for="(item,index) in materialTemplateItem" :key="index">
				<view class="item-title-contain">
					<text class="item-left">{{item.platformCategoryName}}</text>
					<view class="item-right">
						<text>总计</text>
						<text class="item-price">{{ getMaterialListPrice(item)}}</text>
						<text>元</text>
					</view>
				</view>
				<view class="work-list">
					<view class="item-work-contain" v-for="(ev,num) in item.dataList" :key="num">
						<view class="work-contain-list">
							<view class="work-contain-all">
								<view class="work-contain">
									<image-lazy-load :image="ev.coverImg" :key="index" height="146">
									</image-lazy-load>
									<view class="item-contain-left">
										<view class="item-name">
											{{ev.name}}
										</view>
										<view class="statistical">
											<text v-for="(even,i) in ev.productSku" :key="i"
												class="item-statistical-specifications">
												{{even.key}}/{{even.value}}
											</text>
										</view>
										<view class="item-statistical-contain">
											<text class="item-statistical">
												<text class="item-statistical-lable">预算量</text>
												<text class="item-statistical-lable">{{ev.quantity}}</text>
											</text>
										</view>
										<view class="item-price-contain">
											<text class="item-unit">￥{{ev.price}}</text>
											<add-and-subtract :info="ev" v-model="ev.quantity" @calculate="calculate">
											</add-and-subtract>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<mh-empty v-if="materialTemplateItem.length == 0" title="这里空荡荡哒～" />
		</view>

		<mihuo-bottom-button :buttonList="buttonList" @click="addImport"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import operation from '@/plugins/mathoperation.js'
	export default {
		data() {
			return {
				option: {},
				currentCompanyId: '',
				currentCompany: '',
				orderMaterialTemplateId: '',
				search: '',
				materialTemplateListActive: 0,
				materialTemplateList: [],
				materialTemplateItem: [],
				treeList: [],
				resultList: [],
				tempResultList: [],
				buttonList: [{
					name: '一键导入',
					status: true
				}],
				pageList:[]
			}
		},
		computed: {
			...mapState(['shoppingCart', 'nodeInfo','projectInfo']),
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getTypeList()
			this.getOrderMaterialTemplateItems()
			this.queryPackageOrderItems()
		},
		methods: {
			getTypeList() { // 查询分类
				this.$httpApi.getListByTreeCodeTree({}).then(res => {
					if (res) {
						this.treeList = JSON.parse(JSON.stringify(res))
					}
				})
			},
			getOrderMaterialTemplateItems() {
				this.$httpApi.getOrderMaterialTemplateItems({
					orderMaterialTemplateId: [this.option.id],
					keyword: this.search
				}).then(res => {
					if (res) {
						res.forEach(el => {
							el.dataList.forEach(ev => {
								if (this.$isJSON(ev.productSku)) {
									ev.productSku = JSON.parse(ev.productSku)
								}
							})
						})
						this.materialTemplateItem = res
					}
				})
			},
			getMaterialListPrice(item) {
				let tempList = []
				item.dataList.forEach(el => {
					tempList.push(operation.floatMul(el.quantity + '', el.price || 0))
				})
				let resultPice = operation.funCalc(tempList)
				return resultPice
			},
			/**
			 * @description 材料数量加减
			 * @param type 加、减、手动输入
			 * @param even 当前实例
			 * @param operationNumber 手动输入的数据
			 * */
			calculate(type, item, operationNumber) {
				if (type == '加') {
					item.quantity++
				} else if (type == '减') {
					if (item.quantity > 0) {
						item.quantity--
					}
				} else {
					// 手动输入
					if (!operationNumber) {
						operationNumber = ''
					}
					item.quantity = operationNumber
				}
			},
			addImport() {
				let result = []
				this.tempResultList = []
				this.materialTemplateItem.forEach(el => {
					el.dataList.forEach(ev => {
						if (ev.quantity) {
							result.push({
								details: el,
								childrenDetails: ev
							})
						}
					})
				})
				if (result.length == 0) {
					this.$util.toast("导入数据不能为空");
					return
				}
				result.forEach(el => {
					this.addMaterial(el.childrenDetails, el.details)
				})
				setTimeout(() => {
					this.tempResultList.forEach(el => {
						this.shoppingCart.forEach(ev => {
							if (el.skuId == ev.skuId) {
								ev.treeCode = el.treeCode
							}
						})
					})
				}, 200)
				this.$store.commit('setShoppingCart', this.shoppingCart)
				this.$util.toast("导入成功");
				setTimeout(() => {
					uni.navigateBack({
						delta: 2
					})
				}, 500)
			},
			addMaterial(item, ev) {
				let result = {
					name: item.name,
					coverImg: item.coverImg,
					productSku: JSON.stringify(item.productSku),
					skuId: item.skuId,
					productId: '', //  用于在材料中显示已选材料的sku
					unit: item.unit,
					price: item.price,
					selectNum: item.quantity !== 0 ? item.quantity : 1, // 选择数量
					nodeId: this.nodeInfo.nodeId || '',
					treeCode: '', // 用于顶部类型筛选
					itemShow: true, // 控制是否显示
					makeExpensesShow: false, // 显示补齐价格
					makeExpenses: '', // 补齐价格
					customCategory: item.materialCategoryType, // 商品分类 1001=材料 1002=服务 1003=服务包 1010=线下材料
					packageFlagSwitch: false,
					isPackageList: this.pageList.length ? true : false, 
				}

				// 获取材料对应的treeCode
				item['platformCategoryId'] = ev.platformCategoryId
				this.setMaterialCategoryType(item)
				if (this.shoppingCart.length > 0) {
					let tempSku = this.shoppingCart.find(el => el.skuId == result.skuId)
					if (tempSku) {
						this.shoppingCart.map(ev => {
							if (ev.skuId == result.skuId) {
								//更新购物车
								ev.selectNum = tempSku.selectNum + 1
							}
						})
					} else {
						this.shoppingCart.push(result)
					}
				} else {
					this.shoppingCart.push(result)
				}
			},
			/**
			 * 返回分类名称，因为明确了只到第二层，所以不需要递归
			 * 
			 * */
			setMaterialCategoryType(item) {
				this.getRecursion(this.treeList, item)
			},
			getRecursion(list, item, cabllack) {
				let resultName
				if (list) {
					try {
						list.forEach(ev => {
							if (ev.id == item.platformCategoryId) {
								throw ev
							} else {
								this.getRecursion(ev.children, item)
							}
						})
					} catch (e) {
						this.tempResultList.push({
							skuId: item.skuId,
							treeCode: e.treeCode
						})
					}
				}
			},
			queryPackageOrderItems() {
				if(!this.projectInfo.projectId){
					return
				}
				this.$httpApi.queryPackageOrderItems({
					projectId: this.projectInfo.projectId
				}).then((res) => {
					if (res) {
						// 初始化字段
						res.forEach((item1) => {
							if (item1.packageInfo) {
								if (item1.packageInfo.packageProduct) {
									item1.packageInfo.packageProduct.forEach((item, index) => {
										this.pageList.push(item)
									})
								}
							}
						})
					}
				})
			}
		}
	}
</script>
