<template>
	<view class="material-sku-popup">
		<u-popup v-model="value" ref="materialSkuPopup" border-radius="30" height="800" mode="bottom"
			:safe-area-inset-bottom="false" :popup="false" :closeable="true" @close="close">
			<view class="material-sku-contain">
				<scroll-view v-if="detailsShow" :scroll-y="true" class="scroll-Y">
					<view class="list-contian">
						<view class="top-contain public-flex">
							<view class="left">
								<image-lazy-load :image="materialSkuDetails.coverImg" :viewStatus="false" height="240">
								</image-lazy-load>
							</view>
							<view class="right">
								<view class="name">{{materialSkuDetails.name}}</view>
								<view class="price" v-if="materialSkuDetails">
									<view class="other">￥</view><text class="num">{{materialSkuPic}}</text>
									<view class="other">元/{{materialSkuPicUnit}}</view>
								</view>
								<view class="item-specifications">已选:
									<text class="sku">
										{{selectSkuValue}}
									</text>
								</view>
							</view>
						</view>
						<view class="specifications">
							<view class="public-title-name">规格</view>
							<view class="list">
								<view v-for="(item,index) in materialSkuDetails.skuStocks" :key="index"
									class="item-contain" :class="[index === selectSkuIndex ?'active-item-contain':'']"
									@click="setSkuStocks(index)">
									<text>{{item.spData[0].value}}</text>
									<image v-if="index === selectSkuIndex" class="select-active"
										src="@/static/images/select-active.png" mode=""></image>
								</view>
							</view>
						</view>

						<view class="sku-list">
							<view class="item-sku-contain" v-for="(item,index) in skuList" :key="index">
								<view class="public-title-name">{{item.name}}</view>
								<view class="list">
									<view v-for="(item2,index2) in item.list" :key="index2" class="item-contain"
										:class="[item2.checked  ?'active-item-contain':'']"
										@click="setChecked(index,index2)">
										<text>{{item2.name}}</text>
										<image v-if="item2.checked" class="select-active"
											src="@/static/images/select-active.png" mode=""></image>
									</view>
								</view>
							</view>
						</view>

						<view class="dosage-contain">
							<view class="left ">数量</view>
							<view class="right">
								<view class="calculate public-flex-center">
									<view class="item-operation public-flex-center" @click="skucalCulate('减','当前')">
										<u-icon size="24" color="#C4C4C4" name="minus"></u-icon>
									</view>
									<view class="public-input-contain">
										<u-input class="public-input-num" input-align="center" height="50"
											@blur="setBlur" @input="setInput($event)" :clearable="false"
											v-model="selectNum" type="number" placeholder="" :border="false" />
									</view>
									<view class="item-operation public-flex-center" @click="skucalCulate('加','当前')">
										<u-icon size="24" color="#3A3838" name="plus"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-if="detailsShow" class="operation-button">
					<view class="determine" @click="saveMaterial()">确定</view>
				</view>
				<mh-empty v-if="!detailsShow" title="这里空荡荡哒～" />
			</view>
		</u-popup>
	</view>

</template>

<script>
	import {
		mapState
	} from 'vuex'
	import operation from '@/plugins/mathoperation.js'
	export default {
		props: {
			detailId: {
				type: String,
				default: ''
			},
			typeName: {
				type: String,
				default: ''
			},
			value: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				option: {},
				materialSkuShow: false,
				materialSkuDetails: {},
				selectSkuIndex: 0,
				materialSkuPicUnit: '',
				materialSkuPic: '',
				selectMaterial: {},
				materialSkuId: '',
				selectSkuValue: '',
				selectNum: 1,
				spData: '',
				detailsShow: false,
				skuList: []
			}
		},
		computed: {
			...mapState(['serviceGoodsList', 'shoppingCart']),
		},
		watch: {
			value(val) {
				if (val) {
					this.init();
				} else {
					this.close();
				}
			}
		},
		mounted() {

		},
		created() {

		},
		methods: {
			init() {
				this.selectNum = 1
				this.getskuDetails()
			},
			setInput(event) {
				this.selectNum = event.replace(/[^\d]/g, "")
			},
			setBlur(event) {
				this.selectNum = event.replace(/[^\d]/g, "")
			},
			show() {
				this.$refs.materialSkuPopup && this.$refs.materialSkuPopup.open();
			},
			close() {
				this.$emit('input', false);
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
						this.detailsShow = true
						res.skuStocks.map(item => {
							item.spData = item.spData !== '' && JSON.parse(item.spData)
							item['statusIndex'] = 0
						})
						this.materialSkuDetails = res
						this.materialSkuPicUnit = res.unit
						let tempSku = this.materialSkuDetails.skuStocks[0]
						if (tempSku) {
							this.materialSkuPic = tempSku.price
							this.materialSkuId = tempSku.id
							this.selectSkuValue = tempSku.spData.length > 0 ? tempSku.spData[0].value : ''
							this.spData = tempSku.spData
						}
						this.materialSkuShow = true

						this.initSkuList()
					}
				})
			},
			setChecked(index1, index2) {
				let currentSku = this.skuList[index1].list[index2]
				this.skuList[index1].list.forEach((item, i) => {
					if (index2 == i) {
						item.checked = !item.checked
					} else {
						item.checked = false
					}
				})
				
				this.materialSkuPic = currentSku.price
				this.materialSkuId = currentSku.id
				this.selectSkuValue = currentSku.name
				console.log('currentSku',currentSku);
				
				// this.spData = this.materialSkuDetails.skuStocks[index].spData
			},
			/**
			 * @description 初始化sku列表
			 * */
			initSkuList() {
				return
				const skuMap = this.getSkuMap(this.materialSkuDetails.skuStocks)
				this.skuList = []
				skuMap.forEach(skuEle => {
					const obj = {
						name: skuEle[0],
						checked: false,
						list: []
					}
					skuEle[1].forEach((ele, index) => {
						const itemObj = {
							name: ele,
							id: '',
							price: '',
							checked: index ? false : true,
						}
						obj['list'].push(itemObj)
					})
					this.skuList.push(obj)
				})
				this.bindingSkuId()
			},
			/**
			 * @description 绑定skuId、price
			 * */
			bindingSkuId() {
				let skuStocks = []
				this.materialSkuDetails.skuStocks.forEach(item => {
					item.spData.forEach(item1 => {
						skuStocks.push({
							id: item.id,
							price: item.price,
							...item1
						})
					})
				})

				this.skuList.forEach(item => {
					item.list.forEach(item1 => {
						skuStocks.forEach(item3 => {
							if (item1.name == item3.value) {
								item1.id = item3.id
								item1.price = item3.price
							}
						})
					})
				})
			},
			getSkuMap(sku) {
				const skuResult = []
				sku.forEach(item => {
					let obj = item.spData
					obj.forEach((each, index) => {
						skuResult.push(each)
					});
				})
				let map = new Map();
				for (let item of skuResult) {
					if (!map.has(item.key)) {
						let m = new Array()
						m.push(item.value)
						map.set(item.key, m);
					} else {
						let m2 = map.get(item.key)
						if (m2.indexOf(item.value) === -1) {
							m2.push(item.value)
						}
					}
				}
				return [...map]
			},
			skucalCulate(typeName, type, index) {
				if (type === '当前') {
					if (typeName === '加') {
						this.selectNum++
					} else {
						if (this.selectNum > 0) {
							this.selectNum--
						}
					}
				}
				this.$forceUpdate()
			},
			setSkuStocks(index) {
				this.selectSkuIndex = index
				this.materialSkuPic = this.materialSkuDetails.skuStocks[index].price
				this.materialSkuId = this.materialSkuDetails.skuStocks[index].id
				this.spData = this.materialSkuDetails.skuStocks[index].spData
				if (this.materialSkuDetails.skuStocks[index].spData.length > 0) {
					this.selectSkuValue = this.materialSkuDetails.skuStocks[index].spData[0].value
				}
			},
			saveMaterial() {
				if (this.selectNum) {
					if (this.typeName == '开单') {
						this.$emit('saveMaterial', {
							detailId: this.detailId,
							materialSkuId: this.materialSkuId,
							skuId: this.materialSkuId,
							materialSkuPic: this.materialSkuPic,
							selectNum: this.selectNum,
							itemShow: true,
							productId: this.materialSkuDetails.id,
							productSku: Array.isArray(this.spData) ? JSON.stringify(this.spData) : '',
							...this.materialSkuDetails
						})
						this.$refs.materialSkuPopup && this.$refs.materialSkuPopup.close();
						this.selectSkuIndex = 0
					} else {
						let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
						let tempSku = tempList.find(item => item.skuId == this.materialSkuId)
						if (tempSku) {
							tempList.forEach(el => {
								if (el.skuId == this.materialSkuId) {
									el.selectNum = Number(el.selectNum) + Number(this.selectNum)
									el['productId'] = this.materialSkuDetails.id

									el['productSku'] = Array.isArray(this.spData) ? JSON.stringify(this.spData) :
										this
										.spData
									el['totalPice'] = operation.floatMul(el.selectNum, el.materialSkuPic || 0)
								}
							})
							this.$store.commit('setServiceGoodsList', tempList)
							this.$emit('saveMaterial', {
								typeName: '累加',
							})
						} else {
							this.$emit('saveMaterial', {
								typeName: '新增',
								detailId: this.detailId,
								materialSkuId: this.materialSkuId,
								skuId: this.materialSkuId,
								materialSkuPic: this.materialSkuPic,
								selectNum: this.selectNum,
								itemShow: true,
								productId: this.materialSkuDetails.id,
								productSku: Array.isArray(this.spData) ? JSON.stringify(this.spData) : '',
								...this.materialSkuDetails
							})
						}
						this.$refs.materialSkuPopup && this.$refs.materialSkuPopup.close();
						this.selectSkuIndex = 0
					}

				} else {
					this.$util.toast("请选择数量");
				}
			},

		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	/deep/ .u-drawer__scroll-view {
		background: #FFFFFF !important;
	}

	.select-active {
		width: 26rpx;
		height: 26rpx;
	}

	.public-input-contain {
		width: 168rpx;
		background-color: #F6F6F6;
		border-radius: 4rpx;
		font-size: 24rpx;
		height: 50rpx;
		margin: 0 2rpx 0 2rpx;


		/deep/ .uni-input-input {
			color: #909199;
		}

		/deep/ .u-input__right-icon {
			padding-right: 0rpx !important;
		}
	}

	.public-flex {
		display: flex;
	}

	.public-flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.public-title-name {
		margin-bottom: 16rpx;
		font-size: 28rpx;
	}

	.material-sku-contain {
		background-color: #FFFFFF;
		height: calc(100% - 110rpx);
		padding: 40rpx 0rpx 30rpx 0rpx;
		
		.scroll-Y {
			height: 100%;
			padding: 0rpx 30rpx;
		}

		.top-contain {
			min-height: 320rpx;
			min-height: 280rpx;
			padding-top: 40rpx;

			.left {
				position: relative;


				.num {
					width: 146rpx;
					height: 38rpx;
					display: flex;
					color: #FFF;
					background-color: rgba(0, 0, 0, 0.5);
					position: absolute;
					bottom: 4rpx;
					left: 4rpx;
					font-size: 10rpx;
					align-items: center;
					justify-content: center;
					// transform: scale(0.83);
					// display: inline-block;
				}

			}

			.right {
				margin: 0rpx 30rpx 0 22rpx;

				.name {
					font-size: $middleFontSize;
					color: $seconFontColor;
					margin-bottom: 20rpx;
				}

				.price {
					margin-bottom: 10rpx;

					.other {
						color: $errorFontColor;
						font-size: 20rpx;
						transform: scale(0.83);
						display: inline-block;
					}

					.num {
						font-size: $middleAddFontSize;
						color: $errorFontColor;
					}
				}

				.item-specifications {
					font-size: $smallFontSize;
					color: $viceFontColor;

					text {
						font-size: $smallFontSize;
						color: $viceFontColor;
					}
				}
			}
		}

		.sku-list {
			margin-top: 30rpx;

			.item-sku-contain {
				margin-bottom: 30rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}

			.list {
				display: flex;
				flex-wrap: wrap;
			}


			.item-contain {
				padding: 10rpx 22rpx;
				border: 1px solid #EEEEEE;
				margin-right: 16rpx;
				margin-bottom: 10rpx;
				border-radius: $miniBorderRadius;

				text {
					font-size: $smiddleFontSize;
					color: $mainFontColor;
				}
			}

			.active-item-contain {
				position: relative;
				border: 2rpx solid $themeColor;

				text {
					font-size: $smiddleFontSize;
					color: $themeColor;
				}

				image {
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		}

		.specifications {
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			// min-height: 120rpx;

			.list {
				display: flex;
				flex-wrap: wrap;
			}

			.item-contain {
				padding: 10rpx 22rpx;
				border: 1px solid #EEEEEE;
				margin-right: 16rpx;
				margin-bottom: 10rpx;
				border-radius: $miniBorderRadius;

				text {
					font-size: $smiddleFontSize;
					color: $mainFontColor;
				}
			}

			.active-item-contain {
				position: relative;
				border: 2rpx solid $themeColor;

				text {
					font-size: $smiddleFontSize;
					color: $themeColor;
				}

				image {
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}

		}

		.dosage-contain {
			// padding: 0rpx 30rpx 60rpx 28rpx;
			margin-top: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-height: 40rpx;

			.left {
				font-size: 28rpx;
			}

			.right {
				display: flex;


				.calculate {
					margin-right: 22rpx;

					.item-operation {
						background-color: #F6F6F6;
						width: 62rpx;
						height: 50rpx;
						border-radius: 4rpx;
					}

					.num {
						font-weight: bold;
						background-color: #F6F6F6;
						width: 68rpx;
						height: 40rpx;
						border-radius: 2px;
						font-size: $smallFontSize;
						color: $viceFontColor;
						margin: 0 2rpx 0 2rpx;

					}
				}

				text {
					color: $mainFontColor;
					font-size: $smiddleFontSize;
				}
			}
		}

		.bottom-add {}

		.operation-button {
			display: flex;
			position: fixed;
			width: 100%;
			padding: 0rpx 30rpx;
			background-color: #FFF;
			bottom: 20rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.determine {
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				font-size: $middleFontSize;
				height: 70rpx;
				color: #FFFFFF;
				background: $themeColor;
				border-radius: 50rpx;
			}

		}
	}
</style>
