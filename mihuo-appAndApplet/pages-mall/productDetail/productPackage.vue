<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">
				套餐配置清单
			</view>
		</z-nav-bar>
		<view class="main-container">
			<view class="header-info flex-center">
				<view class="left">
					<view class="package-name">
						{{ commodity.name }}
					</view>
					<view class="package-des" @click="viewRules">
						查看计价方式 <uni-icons type="right" color="#000000" size="10"></uni-icons>
					</view>
				</view>
				<view class="right" v-if="commodity.basePrice">
					<text style="font-size: 24rpx;">¥</text>
					<text style="font-size: 40rpx;">{{ Math.floor(commodity.basePrice) }}</text>
					<text style="font-size: 24rpx;">{{ commodity.basePrice | priceFormat }}</text>
				</view>
			</view>
			<view class="package-category flex-center">
				<view class="flex-center" v-for="item, index in categoryList" :class="currentTab === index ? 'category-item-active' : 'category-item'"
					@click="selectCategory(index, 1)" :key="index">
					{{ item.name }}
				</view>
			</view>
			<view class="package-content flex-center" v-if="categoryList.length !== 0">
				<scroll-view class="left-bar" scroll-y>
					<view class="base-item bar-item flex-center" :class="[{ 'bar-item-active': currentBar === index }]"
						v-for="item, index in categoryList[currentTab].barItems" :key="index" @click="selectCategory(index, 2, item)">
						<view class="nav-bar-border" v-if="currentBar === index"></view>
						{{ item ? item.substring(0, 7) : '' }}
					</view>
				</scroll-view>
				<scroll-view class="right-product" scroll-y>
					<view class="product-item flex-center" v-for="item, index in categoryList[currentTab].products.filter(p => p.type === currentBarName)" :key="index">
						<u-lazy-load height="150" class="product-img" :style="{ width: '150rpx' }" imgMode="aspectFill"
							border-radius="10" :image="$util.thumbnailImage(item.productImg, true, 300)">
						</u-lazy-load>
						<view class="product-info">
							<view class="name">
								{{ item.productName }}
							</view>
							<view class="des">
								{{ getSkuStr(item.productSku) }}
							</view>
							<view class="label">
								不限
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 质保/计价内容弹窗 -->
		<mihuo-popup ref="isShowContent" title="计价方式">
			<view class="popup-container">
				<!-- 公用说明 -->
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						计价说明
					</view>
					<view v-if="checkIsShow('计价', true) && commodity.pricingRules" class="popup-text"
						v-html="commodity.pricingRules.replace(/\n/g, '<br/>')" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						质保说明
					</view>
					<view v-if="checkIsShow('质保', true) && commodity.qualityAssurance" class="popup-text"
						v-html="commodity.qualityAssurance.replace(/\n/g, '<br/>')" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						最低消费
					</view>
					<view v-if="checkIsShow('最低消费', true) && commodity.minAmountDescription" class="popup-text"
						v-html="commodity.minAmountDescription.replace(/\n/g, '<br/>')" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<!-- 材料类型说明 -->
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						配置说明
					</view>
					<view v-if="checkIsShow('配置', true) && commodity.configuration"
						v-html="commodity.configuration.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						定额说明
					</view>
					<view v-if="checkIsShow('定额', true) && commodity.quoteDescription"
						v-html="commodity.quoteDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						发货说明
					</view>
					<view v-if="checkIsShow('发货', true) && commodity.deliveryDescription"
						v-html="commodity.deliveryDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						退货说明
					</view>
					<view v-if="checkIsShow('退货', true) && commodity.refundDescription"
						v-html="commodity.refundDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<!-- 服务类型说明 -->
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						适用说明
					</view>
					<view v-if="checkIsShow('适用', true) && commodity.applicable"
						v-html="commodity.applicable.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						发包说明
					</view>
					<view v-if="checkIsShow('发包', true) && commodity.issueDescription"
						v-html="commodity.issueDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						工时说明
					</view>
					<view v-if="checkIsShow('工时', true) && commodity.hoursDescription"
						v-html="commodity.hoursDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						计费说明
					</view>
					<view v-if="checkIsShow('计费', true) && commodity.billingDescription"
						v-html="commodity.billingDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						结算说明
					</view>
					<view v-if="checkIsShow('结算', true) && commodity.settlementDescription"
						v-html="commodity.settlementDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-for="(attr, idx) in extraAttrs" :key="idx">
					<view v-if="attr.productAttributeId" class="popup-title flex-center">
						<view class="title-icon"></view>
						{{ getAttrName(attr.productAttributeId) }}
					</view>
					<view v-if="attr.value" v-html="attr.value.replace(/\n/g, '<br/>')" class="popup-text" />
				</view>
			</view>
		</mihuo-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				emptyDescription: '当前还没有该项说明~', // 无属性说明时显示的默认说明
				extraAttrs: [],
				categoryList: [
					{
						name: '人工',
						treeCode: '1003',
						products: [], // 商品列表
						barItems: [] // 左侧分类
					},
					{
						name: '主材',
						treeCode: '1001',
						products: [], // 商品列表
						barItems: [] // 左侧分类
					},
					{
						name: '辅材',
						treeCode: '1002',
						products: [], // 商品列表
						barItems: [], // 左侧分类
					}
				],
				currentTab: 0, // 当前选中的一级分类
				currentBar: 0, // 当前选中的二级分类
				currentBarName: '', // 当前选中的二级分类名称
				commodityId: '', // 商品ID
				commodity: {}
			}
		},
		onLoad(options) {
			this.commodityId = options.id
			this.getData()
		},
		methods: {
			// 菜单项显示状态
			checkIsShow(type, optional = false) {
				// 服务/材料都显示的菜单项
				const commonMenuItems = ['选择', '计价', '最低', '质保', '最低消费']
				// 材料类型显示的菜单项
				const materialMenuItems = [
					...commonMenuItems,
					'配送',
					'配置',
					'定额',
					'发货',
					'退货',
					'运费',
					'安装费'
				]
				if (optional) {
					const flag = (this.currentViewType === type || this.currentViewType === '属性')
					return materialMenuItems.includes(type) && flag
				} else {
					return materialMenuItems.includes(type)
				}
			},
			// 获取spu名称
			getAttrName(id) {
				if (!this.commodity.id) return ''
				return this.commodity.productAttributeList.find(item => item.id === id)?.name
			},
			getSkuStr(item){
				let sku = JSON.parse(item)
				let skuStr = ""
				sku.forEach((each, index) => {
					skuStr += `${each.value}${index == sku.length - 1 ? '' : '/'}`
				})
				return skuStr
			},
			// 查看计价方式
			viewRules() {
				this.$refs.isShowContent.open()
			},
			// 选择一级分类/二级分类
			selectCategory(index, type, name = '') {
				if (type === 1) {
					this.currentTab = index
					this.currentBar = 0
					const set = this.categoryList[this.currentTab].barItems
					this.currentBarName = [...set][0]
				} else if (type === 2) {
					this.currentBar = index
					this.currentBarName = name
				}
			},
			// 获取套餐信息
			getData() {
				this.$httpApi.getCommodityOverView({
					id: this.commodityId,
				}).then(res => {
					this.commodity = res
					this.extraAttrs = this.commodity.productAttributeValueList
					if(res.productPackageList){
						res.productPackageList.forEach(item => {
							this.categoryList.forEach(category => {
								if(item.category === category.treeCode){
									category.products.push(item)
									category.barItems.push(item.type)
								}
							})
						})
						this.categoryList.forEach(category => {
							category.barItems = new Set(...[category.barItems])
						})
						this.selectCategory(0, 1, '')
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main-container {
		width: 750rpx;
		margin-top: 30rpx;

		.header-info {
			width: 750rpx;
			height: 100rpx;
			padding: 0 30rpx;
			justify-content: space-between;
			margin-top: 30rpx;

			.left {
				width: 70%;

				.package-name {
					font-size: 36rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
					@include toe();
				}

				.package-des {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: normal;
					color: #000000;
					line-height: 34rpx;
					margin-top: 30rpx;
				}
			}

			.right {
				width: 30%;
				text-align: right;

				text {
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #ED3832;
					line-height: 34rpx;
				}
			}
		}

		.package-category {
			width: 750rpx;
			padding: 0 30rpx;
			justify-content: space-between;
			margin-top: 20rpx;

			.category-item {
				height: 70rpx;
				justify-content: center;
				flex: 1;
				text-align: center;
				font-size: 30rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #808080;
				line-height: 36rpx;
				transition: color ease 1s;
			}

			.category-item-active {
				height: 70rpx;
				justify-content: center;
				flex: 1;
				text-align: center;
				font-size: 32rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 36rpx;
				background-image: url(https://www.51mihuo.com/static/icon/tab_bottom.png);
				background-position: center 60rpx;
				background-repeat: no-repeat;
				background-size: 60rpx;
				transition: color ease 1s;
			}
		}

		.package-content {
			width: 750rpx;
			margin-top: 20rpx;

			.left-bar {
				width: 250rpx;
				height: calc(100vh - 200rpx - 132rpx);
				background: #F7F7F7;

				.base-item {
					width: 250rpx;
					height: 100rpx;
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					font-weight: normal;
					line-height: 100rpx;
					justify-content: center;
					@include toe();
				}

				.bar-item {
					color: #898989;
				}

				.bar-item-active {
					font-weight: 500;
					color: #000000;
					background-color: #FFFFFF;
				}

				.nav-bar-border {
					width: 4rpx;
					height: 20rpx;
					margin-right: 26rpx;
					background-color: #000000;
					border-radius: 2rpx;
				}
			}

			.right-product {
				width: 500rpx;
				height: calc(100vh - 200rpx - 132rpx);
				padding: 0 20rpx;

				.product-item {
					width: 460rpx;
					height: 150rpx;
					margin-bottom: 20rpx;

					.product-info {
						width: 290rpx;
						margin-left: 20rpx;

						.name {
							@include toe();
							font-size: 28rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 400;
							color: #000000;
							line-height: 34rpx;
						}

						.des {
							@include bov(2);
							margin-top: 20rpx;
							font-size: 20rpx;
							font-family: Noto Sans S Chinese;
							font-weight: normal;
							color: #808080;
							line-height: 30rpx;
						}

						.label {
							margin-top: 10rpx;
							font-size: 20rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #000000;
							line-height: 34rpx;
						}
					}
				}
			}
		}
	}
	
	
	.popup-container {
		width: 100vw;
		padding: 30rpx;
		background-color: #ffffff;
		/* #ifdef APP-PLUS */
		padding-bottom: 140rpx;
		/* #endif */
	
		.content-item {
			margin-bottom: 20rpx;
	
			.popup-title {
				width: 100%;
				text-align: left;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 32rpx;
				line-height: 40rpx;
				color: #000000;
	
				.title-icon {
					width: 20rpx;
					height: 20rpx;
					background: #fe6e32;
					border: 6rpx solid #fcd9ca;
					border-radius: 50%;
					margin-right: 8rpx;
				}
			}
	
			.popup-text {
				font-family: PingFang SC;
				font-style: normal;
				font-size: 24rpx;
				line-height: 40rpx;
				color: #000000;
				margin-top: 20rpx;
			}
		}
	}
	
	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
