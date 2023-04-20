<template>
	<view class="budget-page" :class="setPadding">
		<mihuo-order-information :projectId="projectInfo.projectId"></mihuo-order-information>
		<!-- 节点相关信息	 -->
		<node-information v-if="option.pageType != 1" ref="nodeInformation"></node-information>
		<!-- 节点审核信息 -->
		<sop-node-check v-if="option.pageType != 1" ref="nodeCheck"></sop-node-check>
		<!-- 手动开始、结束填写的数据 -->
		<sop-operation-detail v-if="option.pageType != 1" ref="sopOperationDetail" :iconShow="false">
		</sop-operation-detail>

		<view class="quoted-price-page">
			<view class="price-list">
				<!-- 人工费 -->
				<view class="material-data-contain" v-for="(item, index) in artificialCostList" :key="index">
					<view class="top-contain">
						<view class="item-left">
							<text class="item-text-user">{{ item.name }}</text>
							<text class="item-price">{{ materialPrice(item.name) }}</text>
							<text class="item-unit">元</text>
						</view>
						<view v-if="isComplete && $permissionRouting.getInstance().isShow()" class="item-right"
							@click="getSelect(`${item.name}选择`)">
							<text>材料选择</text>
							<image src="/static/images/bottom-icon.png" class="public-arrow"></image>
						</view>
					</view>
					<view class="item-price-contain" v-if="item.groupPrices && item.groupPrices.length > 0">
						<view class="item-list-contain" v-for="(ev, index) in item.groupPrices" :key="index">
							<view class="item-grouping">
								<view class="item-left">
									<view class="item-skill-name">
										{{ ev.businessName || '自定义' }}
									</view>
								</view>
								<view class="item-right">
									<text class="item-total">总计</text>
									<text class="total-price">{{ ev.totalPrice }}元</text>
								</view>
							</view>
							<view class="item-other" v-for="(en, num) in ev.products" :key="num">
								<view class="item-name-contain">
									<view class="all">
										<view class="item-left">
											<image class="item-block" :src="$util.thumbnailImage(en.productImg, true)"
												mode=""></image>
											<view class="item-other-text">
												<text class="item-material-name">{{ en.productName }}</text>
												<text class="item-material-calculate">{{ en.price }}X{{ en.quantity }}</text>
											</view>
										</view>
										<view class="item-right">
											{{ en.totalPrice }}
										</view>
									</view>
									<view class="remark">{{ en.remark }}</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="public-item-bottom">
						<image class="icon-no-data" src="/static/images/no_order_2.png" mode=""></image>
						<text>暂无{{ item.name }}</text>
					</view>
				</view>
			</view>

			<view class="bottom-contain-all">
				<view class="bottom-contain" v-if="artificialCostList.length > 0">
					<!-- sop节点设置为 手动开始、结束 -->
					<view v-if="isStartWay" class="item-offer">
						<view class="left left-center">
							<text class="item-text">总报价</text>
							<text class="num">{{ totalPrice }}</text>
							<text class="item-unit">元</text>
						</view>
					</view>

					<view v-if="!isStartWay && nodeInfo.nodeId" class="item-offer">
						<view class="left" :class="!isComplete ? 'left-center' : ''">
							<text class="item-text">总报价</text>
							<text class="num">{{ totalPrice }}</text>
							<text class="item-unit">元</text>
						</view>
						<view class="right" v-if="isComplete" @click="addResult()">
							确认
						</view>
					</view>
					
					<!-- 工作台进入 -->
					<view v-if="!isStartWay && !nodeInfo.nodeId" class="item-offer">
						<view class="left left-center">
							<text class="item-text">总报价</text>
							<text class="num">{{ totalPrice }}</text>
							<text class="item-unit">元</text>
						</view>
					</view>
				</view>
				<!-- 1.手动开始、结束  2.完成之后隐藏-->
				<sop-operation v-if="isStartWay && isSopOperation && option.pageType != 1" ref="sopOperation">
				</sop-operation>
			</view>

		</view>
	</view>
</template>

<script>
import {
	mapState,
} from 'vuex'
import {
	deepClone
} from '@/plugins/utils.js'
import operation from '@/plugins/mathoperation.js'
export default {
	data() {
		return {
			option: {},
			isComplete: false,
			isButtonShow: false,
			isSopOperation: false,
			artificialCostList: [],
			spaceMaterialList: [],
			offerTotalPrice: '',
			sourceType: '', // 材料来源 1001->扫码选材 1002->材料库选材 1003->自购
			pageList: [],
			resutlShoppingCart: [],
			form: {
				nodeId: '',
				projectId: '',
				executePersonId: ''
			}
		}
	},
	computed: {
		...mapState(['projectInfo', 'userPersonInfo', 'nodeInfo', 'isAddCustomSpace', 'userPersonId', 'orderInfo', 'shoppingCart']),
		artificialCostPrice() {
			let tempPice = []
			this.artificialCostList.map(item => {
				tempPice.push(Number(item.totalPrice))
			})
			let resultPice = operation.funCalc(tempPice)
			return resultPice
		},

		totalPrice() {
			let tempPice = []
			this.artificialCostList.forEach(el => {
				if (el.groupPrices) {
					el.groupPrices.forEach(ev => {
						tempPice.push(ev.totalPrice)
					})
				}
			})
			return operation.funCalc(tempPice)
		},
		/**
		 * @description
		 * 1.若配置了手动开始、完成，则使用budget-page-padding
		 * 2.节点完成之后 底部开始、完成按钮不显示
		 * */
		setPadding() {
			if (this.isComplete) {
				return 'budget-page-padding'
			}
			if (this.nodeInfo.startWay == 1) {
				return 'budget-page-padding'
			}
			if (this.nodeInfo.finishWay == 2) {
				return 'budget-page-padding'
			}
		},
		isStartWay() {
			if (this.nodeInfo.startWay == 1) {
				return true
			} else {
				return false
			}
			if (this.nodeInfo.finishWay == 2) {
				return true
			} else {
				return false
			}
		}
	},
	mounted() {

	},
	onShow() {
		this.getArtificialCostList()
		this.setParameter()
		this.setNodeDetails()
		this.setButtonShow()
	},
	onLoad(option) {
		this.option = option
		this.queryPackageOrderItems()
	},
	methods: {
		materialPrice(name) {
			let tempPice = []
			this.artificialCostList.forEach(el => {
				if ([name].includes(el.name) && el.groupPrices) {
					el.groupPrices.forEach(ev => {
						tempPice.push(ev.totalPrice)
					})
				}
			})
			return operation.funCalc(tempPice)
		},
		/**
		 * @description
		 * 1.预算绑定在项目上(业务)
		 * 2.正常情况只会有一个预算节点,若配置了多个预算节点，只要有一个完成，则代表所有的都完成
		 * */
		setButtonShow() {
			// 工作台进入的
			if (this.option.pageType == 1) {
				this.isButtonShow = true
				this.isComplete = true
				return
			}
			if (!this.orderInfo.orderId) {
				console.error('订单id不能为空')
				return
			}
			this.$httpApi.selfTask({
				orderId: this.orderInfo.orderId
			}).then((res) => {
				if (res) {
					let tempStatus = []
					res.forEach(el => {
						if (el.businessType == 1003) {
							tempStatus.push({
								status: el.status,
								nodeId: el.nodeId
							})
						}
					})
					tempStatus.forEach(el => {
						if (el.nodeId == this.nodeInfo.nodeId) {
							if (el.status == 3) {
								this.isComplete = false // 跳转选材、人工费
								this.isSopOperation = false // sop 手动开始、完成
							} else {
								this.isComplete = true
								this.isSopOperation = true
							}
						}
					})
					// console.log('this.isSopOperation', this.isSopOperation);
					this.setNodeDetails()
				}
			})
		},
		setParameter() {
			this.form.nodeId = this.nodeInfo.nodeId
			this.form.projectId = this.projectInfo.projectId
			this.form.executePersonId = this.userPersonId
		},
		setNodeDetails() {
			this.$nextTick(() => {
				// 刷新节点审核信息
				this.$refs.nodeInformation && this.$refs.nodeInformation.getReviewList()
				this.$refs.nodeCheck && this.$refs.nodeCheck.getReviewList()
				// 更新node详情  
				this.$getNodeDetails(() => {
					// 刷新 手动添加的内容
					this.$refs.sopOperationDetail && this.$refs.sopOperationDetail.getDetails()
					this.$refs.sopOperation && this.$refs.sopOperation.getDetails()
					this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
				})
			})
		},
		/**
		 * @description 查询人工费选材情况
		 */
		getArtificialCostList() {
			this.$httpApi.typeByCondition({
				// orderId: this.orderInfo.orderId,
				source: 3, // 组合报价来源（1订单，2变更订单，3项目预算，4材料管理）
				topName: '',
				projectId: this.projectInfo.projectId,
			}).then(res => {
				if (res && res.length !== 0) {
					this.artificialCostList = res
				} else {
					if (this.artificialCostList.length == 0) {
						this.artificialCostList.push({
							name: '人工',
							groupPrices: []
						})
						this.artificialCostList.push({
							name: '主材',
							groupPrices: []
						})
					}
				}
			})
		},
		/**
		 * @description 
		 */
		getSelect() {
			let tempList = []
			this.artificialCostList.forEach(en => {
				if (en.groupPrices) {
					en.groupPrices.forEach(el => {
						el.products.forEach(ev => {
							tempList.push(ev)
						})
					})
				}
			})
			// this.$store.commit('setServiceGoodsList', tempList)
			
			this.resutlShoppingCart = deepClone(this.shoppingCart)
			tempList.forEach(el => {
				this.addMaterial(el)
			})
			this.$store.commit('setShoppingCart', this.resutlShoppingCart)
			this.toPage(`/pages/construction/clientBilling/materialWarehouse?pageType=预算`)
		},
		addResult() {
			if (!this.nodeInfo.nodeId) {
				console.error('nodeId不能为null')
				return
			}
			this.$httpApi.setProjectNodeComplete(this.form).then(res => {
				this.$util.toast("操作成功");
				this.isComplete = false
			})
		},
		setFloatMul(price, num) {
			return operation.floatMul(price || 0, num)
		},
		addMaterial(item) {
			let result = {
				name: item.productName,
				coverImg: item.productImg,
				productSku: item.productSku,
				skuId: item.skuId,
				productId: item.productId, //  用于在材料中显示已选材料的sku
				unit: item.unit,
				price: item.price,
				selectNum: item.quantity, // 选择数量
				treeCode: item.platformTreeCode, // 用于顶部类型筛选
				itemShow: true, // 控制是否显示
				makeExpensesShow: false, // 显示补齐价格
				makeExpenses: '', // 补齐价格
				customCategory: item.materialCategoryType, // 商品分类 1001=材料 1002=服务 1003=服务包 1010=线下材料
				packageFlagSwitch: false,
				isPackageList: this.pageList.length ? true : false,
				remark: item.remark,
			}
			if (this.resutlShoppingCart.length > 0) {
				let tempSku = this.resutlShoppingCart.find(el => el.skuId == result.skuId)
				if (tempSku) {
					this.resutlShoppingCart.map(ev => {
						if (ev.skuId == result.skuId) {
							//更新购物车
							ev.selectNum = tempSku.selectNum 
						}
					})
				} else {
					this.resutlShoppingCart.push(result)
				}
			} else {
				this.resutlShoppingCart.push(result)
			}
		},
		queryPackageOrderItems() {
			if (!this.projectInfo.projectId) {
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
<style lang="scss" scoped>
/* @import url(); 引入css类 */

.public-arrow {
	width: 12rpx;
	height: 14rpx;
}

.icon-no-data {
	width: 190rpx;
	height: 156rpx;
}

.public-item-bottom {
	display: flex;
	align-items: center;
	margin-top: 160rpx;
	flex-direction: column;
	margin-bottom: 20rpx;

	text {
		font-size: 30rpx;
		color: #909199;
		margin-top: 20rpx;
	}
}

.budget-page {
	padding-bottom: 180rpx;
}



.quoted-price-page {
	margin-top: 12rpx;
	border-radius: 10rpx;

	.price-list {
		background-color: #fff;
		padding: 34rpx 40rpx 14rpx 40rpx;
		margin: 10rpx 20rpx;
	}

	.material-data-contain {
		min-height: 200rpx;
		border-bottom: 2rpx solid #f5f5f5;
		margin-bottom: 40rpx;

		&:last-child {
			border-bottom: 0rpx;
			margin-bottom: 0rpx;
		}

		.top-contain {
			margin-bottom: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.item-left {

				.item-text-user {
					color: #303133;
					font-size: 30rpx;
					margin-right: 12rpx;

				}

				.item-price {
					font-size: 32rpx;
					color: $errorFontColor;
				}

				.item-unit {
					font-size: 24rpx;
					color: #303133;
				}
			}

			.item-right {
				display: flex;
				align-items: center;


				text {
					color: $themeColor;
					font-size: 24rpx;
					margin-right: 6rpx;
				}
			}
		}

		.item-price-contain {
			padding-bottom: 50rpx;
			padding: 0rpx 0rpx 50rpx 0rpx;

			.item-grouping {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.item-left {

					.item-skill-name {
						padding: 6rpx 10rpx;
						background: #002FA5;
						border-radius: 20rpx 0px;
						color: #fff;
						font-size: 24rpx;
					}
				}

				.item-right {
					.item-total {
						color: #909199;
						font-size: 24rpx;
						margin-right: 10rpx;
					}

					.item-price {
						color: #303133;
						font-size: 28rpx;
					}
				}
			}


			.item-other {
				// margin-bottom: 30rpx;

				.item-name-contain {
					display: flex;
					flex-direction: column;
					flex: 1;
					justify-content: space-between;
					margin-bottom: 30rpx;

					.all {
						display: flex;
						justify-content: space-between;
					}
				}

				.remark {
					color: #909199;
					font-size: 24rpx;
					margin-top: 20rpx;
				}

				.item-left {
					display: flex;
					align-items: center;

					.item-block {
						width: 46rpx;
						height: 46rpx;
						background: #D9D9D9;
						border-radius: 4rpx;
						margin-right: 14rpx;
					}

					.item-material-name {
						color: #303133;
						font-size: 28rpx;
						margin-right: 16rpx;
						max-width: 510rpx;
					}

					.item-material-calculate {
						font-size: 24rpx;
						color: #909199;
					}

				}

				.item-right {
					font-size: 28rpx;
					color: #606166;
				}


			}
		}
	}


	.bottom-contain {
		// width: 100%;
		// position: fixed;
		// bottom: 0rpx;
		// height: 96rpx;
		// height: 136rpx;
		background-color: #FFF;
		display: flex;
		z-index: 10;
		box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.item-offer {
			display: flex;
			width: 100%;
		}

		.left {
			display: flex;
			flex: 1;
			align-items: center;
			padding-left: 40rpx;
			height: 96rpx;

			.item-text {
				color: #909199;
				font-size: 24rpx;
				margin-right: 6rpx;
			}

			.num {
				color: #FF5D35;
				font-size: 40rpx;
				margin-right: 6rpx;
			}

			.item-unit {
				font-size: 24rpx;
				color: #FF5D35;
			}
		}

		.left-center {
			justify-content: center;
			padding-left: 0rpx;
		}

		.right {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #FFF;
			background-color: $themeColor;
			font-size: $middleFontSize;
			width: 236rpx;
			border-top-left-radius: 70rpx;
			font-weight: bold;
			height: 96rpx;
		}
	}
}


.budget-page-padding {
	padding-bottom: 280rpx;

	/deep/ .seize-seat {
		height: 120rpx;
	}
}

.bottom-contain-all {
	width: 100%;
	position: fixed;
	bottom: 0rpx;
}
</style>
