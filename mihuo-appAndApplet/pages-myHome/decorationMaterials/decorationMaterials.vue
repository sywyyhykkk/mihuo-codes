<template>
	<view class="materials">
		<!-- 顶部导航栏 -->
		<z-nav-bar>
			<view slot="default" class="nav-bar">
				装修用料
			</view>
		</z-nav-bar>
		<view v-if="masterList && masterList.length">
			<view class="cost-total flex-box" v-if="option.shareType == '快速预算'">
				<view class="cost-total_left">当前总金额：￥
					<text>{{ Math.floor(budgetTotalPrice)  }}</text>
					<text style="font-size: 24rpx">{{ budgetTotalPrice | priceFormat }}</text>
				</view>
			</view>
			<view class="materials-list">
				<view class="materials-left" v-if="option.shareType !== '快速预算'">
					<view v-for="(item,index) in masterList" :key="index" class="tabs"
						:class="{active:curIndex === index}" @click="tabClick(item,index)">{{item.name}}</view>
				</view>

				<view class="cost-list_left" v-if="option.shareType == '快速预算'">
					<view v-for="(item,index) in masterList" :key="index" class="item-tabs"
						:class="{active:curIndex === index}" @click="tabClick(item,index)">
						<view>{{ item.name }}</view>
						<view v-if="item.totalPrice">（￥{{ item.totalPrice || "-"}}）</view>
						<view v-else>/</view>
					</view>
				</view>

				<view class="materials-right">
					<view v-if="sukList && sukList.length">
						<view v-for="(item,index) in sukList" :key="index">
							<view class="sku-type">
								<text class="sku-type_title">{{ item.businessName }}</text>
								<view v-if="option.shareType !== '快速预算'">
									￥<text style="font-size: 28rpx">{{ item.payAmount.toFixed(0) || '' }}</text>
									<text>{{ item.payAmount | priceFormat }}</text>
								</view>
								<view v-if="option.shareType == '快速预算'">
									￥<text style="font-size: 28rpx">{{ item.totalPrice.toFixed(0) || '' }}</text>
									<text>{{ item.totalPrice | priceFormat }}</text>
								</view>
							</view>
							<view v-if="item.products && item.products.length" class="sku">
								<view v-for="(v,i) in item.products" :key="i" class="sku-item">
									<view class="sku-list">
										<u-lazy-load v-if="v.productImg" height="120" :style="{ width: '120rpx' }"
											@click="preview($util.thumbnailImage(v.productImg,false))"
											imgMode="aspectFill" border-radius="10"
											:image="$util.thumbnailImage(v.productImg,true)">
										</u-lazy-load>
										<view class="sku-list_right">
											<view class="sku-title">{{ v.productName }}</view>
											<view class="sku-num">
												<text v-if="option.shareType !== '快速预算'">预算量
													{{ v.budgetNum || 0}}</text>
												<text v-if="option.shareType !== '快速预算'">开单量 {{ v.orderNum || 0}}</text>
												<text v-if="option.shareType == '快速预算'">预算量 {{ v.quantity || 0}}</text>
												<!-- <text>未付款:{{ v.quantity || 0}}</text> -->
											</view>
											<view class="sku-price">
												<text>￥{{ v.price }}</text>
												<text v-if="option.shareType == '快速预算'" class="products-total_price">￥{{v.totalPrice}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<mh-empty v-else title="暂无该类型装修用料～～" />
				</view>
			</view>
			<view class="sku-total" v-if="option.shareType !== '快速预算'">
				<view class="sku-total_tips">合计费用</view>
				<view class="sku-total_price">￥
					<text style="font-size:36rpx">{{ totalPrice.toFixed(0) || ''}}</text>
					<text>{{ totalPrice | priceFormat }}</text>
					<text class="sku-unit">元</text>
				</view>
			</view>
		</view>
		<mh-empty v-else title="暂无装修用料～～" />
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		data() {
			return {
				option: {},
				masterList: [],
				sukList: [],
				curIndex: 0,
				curSkuType: {},
				totalPrice: 0,
				budgetTotalPrice: 0,
				budgetTotalPriceToFixed: ','
			}
		},
		computed: {

		},
		onLoad(option) {
			this.option = option;
			this.getListData();
			this.getShare()
		},
		methods: {
			/**
			 * @deprecated 打开分享的预算清单
			 * 
			 * */
			getShare() {
				if (this.option.shareType !== '快速预算') {
					return
				}
				if (!this.option.id) {
					return
				}
				this.$httpApi.mulationQuoteDetails({
					id: this.option.id
				}).then(res => {
					if (res) {
						let skuArr = [];
						this.masterList = res.typeGPOutputs;
						res.typeGPOutputs?.map((item) => {
							if (item.groupPrices && item.groupPrices.length) {
								skuArr = skuArr.concat(item.groupPrices)
								item.groupPrices.some((v) => {
									this.totalPrice = this.$math.floatAdd(this.totalPrice, v
										.totalPrice)
								})
							}
						})
						if (this.masterList.length) {
							this.masterList.unshift({
								name: '全部'
							})
						}
						this.curSkuType = this.masterList[0];
						this.sukList = skuArr;
						let tempPice = []
						this.masterList.map(item => {
							tempPice.push(Number(item.totalPrice))
						})
						this.budgetTotalPrice = Number(this.$math.funCalc(tempPice))
					}
				})
			},
			getListData() {
				let skuArr = [];
				this.totalPrice = 0;
				if (!this.option.offerId) {
					return
				}
				let params = {
					projectId: this.option.offerId,
					source: 4
				}
				this.$httpApi.getBillRecord(params).then(res => {
					if (res && res.length) {
						this.masterList = res;
						res.map((item) => {
							if (item.groupPrices && item.groupPrices.length) {
								skuArr = skuArr.concat(item.groupPrices)
								item.groupPrices.some((v) => {
									this.totalPrice = this.$math.floatAdd(this.totalPrice, v
										.payAmount)
								})
							}
						})
						if (this.masterList.length) {
							this.masterList.unshift({
								name: '全部'
							})
						}
						this.curSkuType = this.masterList[0];
						this.sukList = skuArr;
					}
				})
			},
			tabClick(data, index) {
				this.curSkuType = data;
				this.curIndex = index;
				this.totalPrice = 0;
				let sku = [];
				if (data.name == '全部') {
					if (this.option.shareType == '快速预算') {
						this.getShare()
					} else {
						this.getListData();
					}
				} else {
					sku = sku.concat(data.groupPrices);
					data.groupPrices.some((v) => {
						this.totalPrice = this.$math.floatAdd(this.totalPrice, v.totalPrice)
						// sku = sku.concat(v.products);
					})
					// sku = sku.filter((item)=> item.orderNum)
					this.sukList = sku;
				}
			},
			preview(url) {
				uni.previewImage({
					current: 0,
					urls: [url],
					loop: true,
					indicator: 'number'
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.materials {

		.cost-total {
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 30rpx;

			.cost-total_left {
				font-size: 28rpx;
				color: #141414;
				font-family: NotoSansHans-Medium;
				font-weight: bold;
			}

			.cost-total_right {
				font-size: 24rpx;
				color: #141414;
				font-family: NotoSansHans-Medium;
			}
		}

		.materials-list {
			display: flex;
			height: calc(100vh - var(--status-bar-height) - 188rpx);

			.materials-left {
				width: 180rpx;
				overflow-y: scroll;
				padding: 0 40rpx;
			}



			.cost-list_left {
				width: 200rpx;
				overflow-y: scroll;

				.item-tabs {
					background: #FFFFFF;
					padding: 30rpx;

					view {
						text-align: center;
						font-size: 24rpx;
						color: #8C8C8C;
					}
				}

				.active {
					background: #F7F7F7;
					position: relative;

					&::before {
						content: '';
						position: absolute;
						top: 30rpx;
						bottom: 30rpx;
						left: 0rpx;
						width: 7rpx;
						background: #FE6E32;
						border-radius: 20rpx;
					}

					view {
						color: #000000;
						font-weight: bold;
						font-weight: bold;
					}
				}

			}

			.materials-right {
				flex: 1;
				overflow-y: scroll;
				padding: 0 30rpx;
				background: #F7F7F7;

				.sku {
					background: #FFFFFF;
					border-radius: 20rpx;
					padding: 0 20rpx;

					.sku-item {
						padding: 20rpx 0;
						border-bottom: 2rpx solid #F0F0F0;

						&:last-child {
							border-bottom: none;
							margin-bottom: 30rpx;
						}
					}

					.sku-list {
						display: flex;
					}
				}

				.sku-type {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 30rpx 0;

					.sku-type_title {
						color: #000000;
						font-size: 28rpx;
						font-family: NotoSansHans-Medium;
					}

					view {
						color: #ED3832;
						font-size: 20rpx;

						text {
							color: #ED3832;
							font-size: 20rpx;
						}
					}
				}

				.sku-list_right {
					margin-left: 20rpx;
					flex: 1;

					.sku-title {
						color: #000000;
						font-size: 24rpx;
						font-family: NotoSansHans-Medium;
						font-weight: bold;
					}

					.sku-num {
						display: flex;
						padding: 15rpx 0;

						text {
							font-size: 20rpx;
							color: #808080;
							margin-right: 20rpx;
						}
					}

					.sku-price {
						font-size: 20rpx;
						color: #000000;
						display: flex;
						justify-content: space-between;

						text {
							color: #000000;
							font-weight: bold;
							font-size: 20rpx;
						}
						
						.products-total_price{
							font-weight: bold;
							font-size: 24rpx;
						}
					}
				}
			}
		}

		.sku-total {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 30rpx;

			.sku-total_tips {
				font-size: 28rpx;
				color: #000000;
				font-size: 28rpx;
				font-family: NotoSansHans-Medium;
				font-weight: bold;
			}

			.sku-total_price {
				font-size: 24rpx;
				color: #FE6E32;

				text {
					font-size: 24rpx;
					color: #FE6E32;
					font-weight: bold;
				}

				.sku-unit {
					font-weight: normal;
					padding-left: 6rpx;
				}
			}
		}
	}

	.tabs {
		margin: 40rpx 0;
		font-size: 24rpx;
		color: #8C8C8C;
		font-family: NotoSansHans-Regular;
	}

	.active {
		font-size: 28rpx;
		color: #000000;
		position: relative;
		font-family: NotoSansHans-Medium;
		font-weight: bold;

		&::before {
			content: '';
			position: absolute;
			top: 8rpx;
			bottom: 8rpx;
			left: -15rpx;
			width: 6rpx;
			background: #000000;
			border-radius: 20rpx;
		}
	}

	.flex-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
