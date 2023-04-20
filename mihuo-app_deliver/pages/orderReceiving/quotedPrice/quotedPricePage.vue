<template>
	<view class="quoted-price-page">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				报价
			</view>
			<!-- 	<view slot="right" class="nav-bar-right" @click="cutView">
				编辑
			</view> -->
		</z-nav-bar>

		<view class="price-list">
			<!-- 人工费 -->
			<view class="material-data-contain">
				<view class="top-contain">
					<view class="item-left">
						<text class="item-text-user">人工费</text>
						<text class="item-price">{{artificialCostPrice}}</text>
						<text class="item-unit">元</text>
					</view>

					<view class="item-right" @click="cutView('人工选择')">
						<text>人工选择</text>
						<image src="/static/images/bottom-icon.png" class="public-arrow"></image>
					</view>
				</view>
				<view class="item-price-contain" v-if="artificialCostList.length > 0">
					<view class="item-list-contain" v-for="(item,index) in artificialCostList" :key="index">
						<view class="item-grouping">
							<view class="item-left">
								<view class="item-skill-name">
									{{item.businessName || '自定义'}}
								</view>
							</view>
							<view class="item-right">
								<text class="item-total">总计</text>
								<text class="total-price">{{item.totalAmount}}元</text>
							</view>
						</view>
						<view class="item-product-contain" v-for="(el,num) in item.products" :key="num">
							<view class="item-left">
								<u-lazy-load v-if="el.productImg" class="item-image" height="116"
									:style="{ width: '116rpx' }"
									@click="preview($util.thumbnailImage(el.productImg,false))" imgMode="aspectFill"
									border-radius="4" :image="$util.thumbnailImage(el.productImg,true)">
								</u-lazy-load>
							</view>
							<view class="item-right">
								<view class="item-top">
									<text class="item-material-name">{{el.productName}}</text>
									<text class="item-total-price">{{setFloatMul(el.price,el.budgetNum)}}</text>
								</view>
								<view class="item-specification">
									<text class="item-material-calculate"
										v-if="el.productSku">{{JSON.parse(el.productSku) && JSON.parse(el.productSku)[0] && JSON.parse(el.productSku)[0].value}}</text>
								</view>
								<view class="item-price-num">
									<view class="item-price">
										<text class="item-symbol">￥</text>
										<text class="item-price-text">{{el.price}}</text>
									</view>
									<view class="item-num">
										<text class="item-symbol">X</text>
										<text class="item-price-text">{{el.budgetNum}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="public-item-bottom" v-else>
					<image class="icon-no-data" src="/static/images/no_order_2.png" mode=""></image>
					<text>暂无人工</text>
				</view>
			</view>

			<!-- 材料费 -->
			<view class="material-data-contain">
				<view class="top-contain">
					<view class="item-left">
						<text class="item-text-user">材料费</text>
						<text class="item-price">{{materialPrice}}</text>
						<text class="item-unit">元</text>
					</view>
					<view class="item-right" @click="cutView('材料选择')">
						<text>材料选择</text>
						<image src="/static/images/bottom-icon.png" class="public-arrow"></image>
					</view>
				</view>
				<view class="item-price-contain" v-if="spaceMaterialList.length > 0">
					<view class="item-list-contain" v-for="(item,index) in spaceMaterialList" :key="index">
						<view class="item-grouping">
							<view class="item-left">
								<view class="item-skill-name">
									{{item.businessName}}
								</view>
							</view>
							<view class="item-right">
								<text class="item-total">总计</text>
								<text class="total-price">{{item.totalAmount}}元</text>
							</view>
						</view>
						<view class="item-product-contain" v-for="(el,num) in item.products" :key="num">
							<view class="item-left">
								<u-lazy-load v-if="el.productImg" class="item-image" height="116"
									:style="{ width: '116rpx' }"
									@click="preview($util.thumbnailImage(el.productImg,false))" imgMode="aspectFill"
									border-radius="4" :image="$util.thumbnailImage(el.productImg,true)">
								</u-lazy-load>
							</view>
							<view class="item-right">
								<view class="item-top">
									<text class="item-material-name">{{el.productName || el.name}}</text>
									<text class="item-total-price">{{setFloatMul(el.price,el.budgetNum)}}</text>
								</view>
								<!--  自定义材料 -->
								<view class="item-specification" v-if="el.sourceType == 1003">
									<text class="item-material-calculate"
										v-if="el.productSku ">{{el.productSku}}</text>
								</view>
								<view class="item-specification" >
									<text class="item-material-calculate"
										v-if="el.productSku ">{{$isJSON(el.productSku) && JSON.parse(el.productSku)[0] && JSON.parse(el.productSku)[0].value}}</text>
								</view>
								<view class="item-price-num">
									<view class="item-price">
										<text class="item-symbol">￥</text>
										<text class="item-price-text">{{el.price}}</text>
									</view>
									<view class="item-num">
										<text class="item-symbol">X</text>
										<text class="item-price-text">{{el.budgetNum}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="public-item-bottom" v-else>
					<image class="icon-no-data" src="/static/images/no_order_2.png" mode=""></image>
					<text>暂无材料</text>
				</view>
			</view>

		</view>
		<view class="bottom-contain" v-if="spaceMaterialList.length > 0 || artificialCostList.length > 0">
			<view class="left">
				<text class="item-text">总报价</text>
				<text class="num">{{totalPrice}}</text>
				<text class="item-unit">元</text>
			</view>
			<view class="right" @click="addResult()">
				确认
			</view>
		</view>
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
				artificialCostList: [],
				spaceMaterialList: [],
				materialList: [],
				offerTotalPrice: '',
				makeUpExpensesStatus: false,
				sourceType: '' // 材料来源 1001->扫码选材 1002->材料库选材 1003->自购
			}
		},
		computed: {
			...mapState(['offerDetails', 'groupByOfferCost']),
			artificialCostPrice() {
				let tempPice = []
				this.artificialCostList.map(item => {
					tempPice.push(Number(item.totalAmount))

					// 应补费用
					if (Number(item.diffAmount) > 0 && this.makeUpExpensesStatus) {
						tempPice.push(item.diffAmount)
					}
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice
			},
			materialPrice() {
				let tempPice = []
				this.spaceMaterialList.map(item => {
					tempPice.push(Number(item.totalAmount))
					// 应补费用
					if (Number(item.diffAmount) > 0 && this.makeUpExpensesStatus) {
						tempPice.push(item.diffAmount)
					}
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice
			},
			totalPrice() {
				return operation.funCalc([this.materialPrice, this.artificialCostPrice])
			}
		},
		mounted() {

		},
		onShow() {
			this.getArtificialCostList()
			this.getIsDiff()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getIsDiff() {
				if (!this.offerDetails.offerId) {
					return
				}
				this.$httpApi.getIsDiff({
					offerId: this.offerDetails.offerId,
				}).then(res => {
					if (res) {
						this.makeUpExpensesStatus = true
					} else {
						this.makeUpExpensesStatus = false
					}
				})
			},
			/**
			 * @description 查询人工费选材情况
			 */
			getArtificialCostList() {
				if (!this.option.bidId) {
					return
				}
				this.$httpApi.groupPriceByOfferId({
					offerId: this.option.bidId
				}).then(res => {
					if (res) {
						let tempList = this.setAnalysisData(res)
						this.materialList = res
						let tempArtificialCostList = tempList.find(item => item.businessType == 1)
						let tempSpaceMaterialList = tempList.find(item => item.businessType == 2)
						if (tempArtificialCostList) {
							this.artificialCostList = tempArtificialCostList.list
						} else {
							this.artificialCostList = []
						}
						if (tempSpaceMaterialList) {
							this.spaceMaterialList = tempSpaceMaterialList.list
						} else {
							this.spaceMaterialList = []
						}
					}
				})
			},
			viewServices() {

			},
			cutView(type) {
				if (!this.option.bidId) {
					return
				}
				let tempList = []
				this.materialList.forEach(el => {
					el.products.forEach(ev => {
						// ev.id = ev.productId
						// ev['totalPice'] = operation.floatMul(ev.price || 0, ev.budgetNum)
						ev['totalPice'] = operation.floatMul(ev.price || 0, ev.budgetNum)
						// ev['totalAmount'] = operation.floatMul(ev.price || 0, ev.budgetNum)
						ev['type'] = el.topName
						ev['selectNum'] = ev.budgetNum
						ev['tempPrice'] = ev.price
						ev['coverImg'] = ev.productImg
						ev['productCategoryName'] = el.businessName
						ev['platformCategoryId'] = el.businessId
						ev['topId'] = el.topId
						ev['name'] = ev.productName
						ev['skillType'] = el.businessId
						ev['skillTypeName'] = el.businessName
						ev['materialSkuName'] = ev.productSku
						ev['materialSkuId'] = ev.skuId
						ev['materialSkuPic'] = ev.price
						ev['skuId'] = ev.skuId

						// 分组id，编辑时使用	
						ev['groupPricesId'] = el.id
						tempList.push(ev)
					})
				})

				this.$store.commit('setServiceGoodsList', tempList)
				// this.$store.commit('setServiceGoodsList', [])
				this.toPage(`/pages/publishTask/portfolioPrice?type=${type}`)
			},
			addResult() {
				uni.$emit('offerTotalPrice', this.totalPrice)
				this.$util.toast("选择成功,将返回上一页面");
				setTimeout(() => {
					this.goBack()
				}, 1500)
			},
			setFloatMul(price, num) {
				return operation.floatMul(price || 0, num)
			},
			preview(url) {
				uni.previewImage({
					current: 0,
					urls: [url],
					loop: true,
					indicator: 'number'
				});
			},
			setAnalysisData(result) {
				let map = {}
				let dest = []
				let resultList = []
				result.forEach(item => {
					if (!map[item.businessType]) {
						dest.push({
							businessType: item.businessType,
							list: [item]
						})
						map[item.businessType] = item
					} else {
						dest.forEach(el => {
							if (el.businessType == item.businessType) {
								el.list.push(item)
							}
						})
					}

				})
				resultList = [...dest]
				return resultList
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.public-arrow {
		width: 12rpx;
		height: 14rpx;
	}

	.nav-bar-right {
		padding-right: 40rpx;
		font-size: $middleFontSize;
		color: $viceFontColor;
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

		text {
			font-size: 30rpx;
			color: #909199;
			margin-top: 20rpx;
		}
	}

	.quoted-price-page {
		margin-top: 12rpx;

		.price-list {
			padding-bottom: 150rpx;
		}

		.material-data-contain {
			padding: 34rpx 40rpx 0rpx 40rpx;
			background-color: #fff;
			min-height: 500rpx;
			border-bottom: 2rpx solid #f5f5f5;
			// margin-bottom: 20rpx;

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

			.item-list-contain {
				margin-bottom: 30rpx;

				&:last-child {
					margin-bottom: 0rpx;
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
					height: 80rpx;
					background-color: #F6F6F6;
					border-radius: 16rpx;
					padding: 0rpx 16rpx 0rpx 26rpx;

					.item-left {
						.item-skill-name {
							color: #303133;
							font-size: 24rpx;

						}
					}

					.item-right {
						.item-total {
							color: #909199;
							font-size: 24rpx;
							margin-right: 10rpx;
						}

						.total-price {
							color: #303133;
							font-size: 28rpx;
						}
					}
				}

				.item-product-contain {
					display: flex;
					align-items: center;
					margin-bottom: 22rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-right {
						margin-left: 22rpx;
						width: 100%;

						.item-top {
							display: flex;
							align-items: center;
							justify-content: space-between;

							.item-material-name {
								color: #303133;
								font-size: 28rpx;
								line-height: 38rpx;
							}

							.item-total-price {
								color: #303133;
								font-size: 28rpx;
								line-height: 38rpx;
							}
						}


						.item-specification {
							.item-material-calculate {
								color: #909199;
								font-size: 24rpx;
								line-height: 32rpx;
							}
						}

						.item-price-num {
							display: flex;
							align-items: center;
							justify-content: space-between;

							.item-price {
								display: flex;

								.item-price-text {
									color: #FF5D35;
									font-size: 28rpx;
								}

								.item-symbol {
									color: #FF5D35;
								}
							}

							.item-num {
								color: #909199;
								font-size: 28rpx;
								display: flex;
								align-items: center;

								.item-price-text {
									color: #909199;
									font-size: 28rpx;
								}

							}

							.item-symbol {
								color: #909199;
								font-size: 24rpx;
								display: block;
								transform: scale(0.85);
								transform-origin: bottom
							}
						}
					}
				}
			}
		}


		.bottom-contain {
			width: 100%;
			position: fixed;
			bottom: 0rpx;
			// height: 96rpx;
			// height: 136rpx;
			background-color: #FFF;
			display: flex;
			z-index: 10;
			box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.left {
				display: flex;
				flex: 1;
				align-items: center;
				padding-left: 40rpx;

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
</style>
