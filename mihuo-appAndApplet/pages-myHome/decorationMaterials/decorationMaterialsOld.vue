<template>
	<view class="portfolio-price">
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="3000" @backClick="goBackPage">
			<view slot="default" class="nav-bar">
				装修用料
			</view>
		</z-nav-bar>
		<view class="details-contain" v-if="resultList.length > 0">
			<view class="middle-contain">
				<view class="enterprise-services">
					<view class="left-contain" :class="setSys">
						<scroll-view class="left-nav-bar" :scroll-y="true">
							<view class="item-contain">
								<view class="item-list">
									<view class="item-type" @click="getType(item,index)"
										:id="'u-tab-item-type-' + index" v-for="(item,index) in resultList"
										:key="index">
										<view class="item-bar" :class="[typeActive === index ? 'item-bar-active':'']">
										</view>
										<view class="service-name"
											:class="[typeActive === index ? 'item-type-active':'']">
											{{item.type}}
										</view>
										<!-- <text class="num" v-if="item.selectNum">{{item.selectNum}}</text> -->
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="right-contain" :class="setSys">
						<scroll-view :class="setrightClass" :scroll-y="true">
							<!-- v-if="materialList.length > 0" -->
							<view class="item-material-list">
								<view class="item-material" v-for="(item,index) in setRightResultList" :key="index">
									<view class="item-top">
										<text class="material-type-name">{{item.areaName}}</text>
										<view class="material-status">
											<view class="item-status " v-if="item.sourceType !== 1003"
												:class="[item.orderStatus == 0 ? 'item-status-no':'item-status-active' ]">
												下单
											</view>
											<view class="item-status item-status-active" v-if="item.sourceType == 1003">
												自购
											</view>
										</view>
									</view>
									<view class="item-bottom-contain">
										<u-lazy-load v-if="item.productImg" class="item-image" height="120"
											:style="{ width: '120rpx' }"
											@click="preview($util.thumbnailImage(item.productImg,false))"
											imgMode="aspectFill" border-radius="10"
											:image="$util.thumbnailImage(item.productImg,true)">
										</u-lazy-load>
										<image v-else class="item-image" src="https://www.51mihuo.com/static/images/no_recommend.png" mode="">
										</image>
										<view class="item-right-material">
											<view class="material-left">
												<!-- 名称 -->
												<view class="material-name" v-if="item.sourceType == 1003 && item.name">
													{{ item.name}}
												</view>
												<view class="material-name"
													v-if="item.sourceType != 1003 && item.productName">
													{{ item.productName}}
												</view>
												<!-- 规格 -->
												<view class="material-specifications"
													v-if="item.sourceType == 1003 && item.attributeUnit">
													{{item.attributeUnit}}
												</view>
												<view class="material-specifications"
													v-if="item.sourceType != 1003 && item.productSkuName">
													{{item.productSkuName}}
												</view>
											</view>
											<view class="material-other">
												<view class="material-price">
													<text class="item-price-icon">￥</text>
													<text class="item-price">{{item.price}}</text>
												</view>
												<text class="item-material-num">x{{item.attributeValue}}</text>
											</view>
										</view>
									</view>

								</view>
							</view>
							<!-- <view v-else class="no-material-list">
								<view class="item-no">
									<image src="/static/images/sousuo.png" mode=""></image>
									<view class="desc">
										<view class="no-text">没有找到你要的内容</view>
										<view class="try-text">你可以试试增加自定义工作项</view>
									</view>
								</view>
							</view> -->
						</scroll-view>
						<view class="item-button" @click="getAdd()">
							<u-icon name="plus" class="plus-icon" color="#000" size="24">
							</u-icon>
							添加自购
						</view>
					</view>
				</view>
			</view>
		</view>
		<myHome-mh-empty v-else title="暂无装修用料～～" />
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
				search: '',
				current: 0,
				typeActive: 0,
				typeList: [{
					name: '门'
				}, {
					name: '地砖'
				}],
				materialList: [],
				productCategoryTreeCode: '',
				selectMaterialListShow: false,
				customServiceList: [],
				option: {},
				activeItemStyle: {
					color: '#303133',
					fontSize: '30rpx'
				},
				commonlyUserList: [],
				scrollTop: 6,
				resultList: [],
				currentCompanyId: '-10',
				tabList: [],
				tabSelectName: '',
				decorateMaterialList: [],
			}
		},
		onLoad(option) {
			this.option = option

		},
		computed: {
			...mapState(['serviceGoodsList', 'serviceCityOperatorId']),
			tabBarStyle() {
				// 'transition-duration': `${this.duration}s`,
				let style = {
					transform: `translateY(${this.scrollTop}px)`,

				};
				return style;
			},
			setMaterialList() {
				if (this.current == 1) {
					return this.commonlyUserList
				} else {
					return this.customServiceList
				}
			},
			operationPic() {
				// let tempPice =  operation.funCalc()
			},
			setrightClass() {
				if (this.tabSelectName == '全部') {
					return 'right-nav-bar-all right-nav-bar'
				} else {
					return 'right-nav-bar'
				}
			},
			setPopupHeight() {
				// #ifdef H5
				return '1000'
				// #endif

				// #ifdef APP-PLUS
				let platform = uni.getSystemInfoSync().platform
				let popupHeight = 1000
				if (platform == 'ios') {
					if (this.serviceGoodsList.length == 1) {
						popupHeight = 520
					} else if (this.serviceGoodsList.length == 2) {
						popupHeight = 750
					}
				} else if (platform == 'android') {
					popupHeight = 1000
				}
				return popupHeight.toString()
				// #endif
			},
			setRightResultList() {
				if (this.resultList[this.typeActive]) {
					return this.resultList[this.typeActive].projectMaterialAttributeList
				} else {
					return []
				}
			},
			setSys() {
				// #ifdef H5
				return ''
				// #endif

				// #ifdef APP-PLUS 
				if (uni.getSystemInfoSync().platform == 'ios') {
					console.warn('ios111');
					return 'ios-contain'
				} else {
					return 'ios-contain'
				}
				// #endif
			}
		},
		onShow() {
			this.getTypeList()
		},
		methods: {
			goBackPage() {
				this.goBack()
			},
			setSearch() {
				this.debounce(() => {
					this.current = 0
					this.tabSelectName = '全部'
					this.productCategoryTreeCode = ''
				}, 200)
			},
			getSearch() {
				if (!this.current) {}
			},
			/**
			 * @description 查询装修用料
			 * @param offerId: 报价id
			 */
			getTypeList() {
				if (!this.option.offerId) {
					return
				}
				// 空间分组
				this.$httpApi.getBizRoomGroupDTO({
					id: this.option.offerId,
				}).then(res => {
					if (res) {
						this.decorateMaterialList = res
						this.initializeDecorateMaterialList()
					}
				})

				// 材料分类分组
				this.$httpApi.getMaterialTypeList({
					projectId: this.option.offerId,
				}).then(res => {
					if (res) {
						this.resultList = res
					}
				})
			},
			/**
			 * @description 初始化装修用料数据、按选材类型分组
			 * @param offerId: 报价id
			 */
			initializeDecorateMaterialList() {
				return
				let tempList = []
				this.decorateMaterialList.forEach(el => {
					el.projectMaterialAttributeList.forEach(ev => {
						tempList.push(ev)
					})
				})
				tempList.forEach(el => {
					el['productSkuName'] = el.productSku && JSON.parse(el.productSku)[0] && JSON.parse(el
						.productSku)[0].value
				})
				this.resultList = this.setAnalysisData(tempList)
				console.log('resultList', this.resultList);
			},
			setAnalysisData(result) {
				let map = {}
				let dest = []
				let resultList = []
				result.forEach(item => {
					if (!map[item.type]) {
						dest.push({
							type: item.type,
							list: [item]
						})
						map[item.type] = item
					} else {
						dest.forEach(el => {
							if (el.type == item.type) {
								el.list.push(item)
							}
						})
					}

				})
				resultList = [...dest]
				return resultList
			},
			getType(item, index) {
				this.typeActive = index
				this.getTabRect()
			},
			sortArr(attr) {
				return function(a, b) {
					return a[attr] - b[attr]
				}
			},

			getTabRect() {
				return
				let query = uni.createSelectorQuery().in(this);
				for (let i = 0; i < this.typeList; i++) {
					query.select(`#u-tab-item-type-${i}`).fields({
						size: true,
						rect: true
					});
				}
				query.exec((res) => {});
			},

			getAdd() {
				if (!this.option.offerId) {
					return
				}

				let that = this
				console.log('that.decorateMaterialList', this.decorateMaterialList);

				uni.navigateTo({
					url: '/pages-myHome/decorationMaterials/addSelfPurchase',
					success(res) {
						// 解决选择材料时显示其他区域
						res.eventChannel.emit('selfBuying', {
							attributeId: that.decorateMaterialList[that.typeActive] ? that
								.decorateMaterialList[that.typeActive].id : '',
							currentAreaName: that.decorateMaterialList[that.typeActive] ? that
								.decorateMaterialList[that.typeActive].attributeName : '',
							// selectMaterialType: ev.type,
							offerId: that.option.offerId,
							areaList: that.decorateMaterialList, // 所有空间、
							// selectProductId: ev.id
						});
					}
				})
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
	/deep/.u-tab-bar {
		border-radius: 16rpx !important;
	}

	.nav-bar {
		@include nav-bar-title(#000000);
	}

	.public-input-contain {
		width: 68rpx;
		// background-color: #F6F6F6;
		border-radius: 4rpx;
		font-size: 24rpx;
		height: 52rpx;
		margin: 0 2rpx 0 2rpx;
		border: 0.5px solid #EEEEEE;
		// display: flex;
		// align-items: center;
		// line-height: 52rpx;


		/deep/ .uni-input-input {
			color: #909199;
		}

		/deep/ .u-input__right-icon {
			padding-right: 0rpx !important;
		}
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
			border: 0.5px solid #EEEEEE;
			border-radius: 2px;
		}
	}

	.nav-bar-title {
		.u-icon {
			margin-right: 6rpx;
		}

		.search {
			width: 560rpx;
			display: flex;
			background: #EEEEEE;
			border-radius: 25px;
			padding-left: 38rpx;
		}
	}

	.details-contain {

		.top-contain {
			display: flex;
			margin-bottom: 20rpx;

			.type-left {
				width: 82%;

				/deep/ .u-scroll-box {
					height: 72rpx;
				}
			}

			.type-right {
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				background: #FFFFFF;
				border-radius: 50rpx 0rpx 0rpx 50rpx;
				// width: 220rpx;

				image {
					width: 18rpx;
					height: 18rpx;
					margin-right: 12rpx;
				}

				.item-typa-add {
					font-size: 28rpx;
				}
			}
		}


		.middle-contain {
			display: flex;

			.custom-service {
				display: flex;
				width: 100%;

				.right-contain {
					width: 100%;

					.right-nav-bar {
						width: 100%;
					}
				}
			}

			.enterprise-services {
				display: flex;
			}


			.left-contain {
				height: calc(100vh - 94rpx);
				background-color: #FFF;
				border-right: 2rpx solid #f5f5f5;

				.left-nav-bar {
					width: 202rpx;
					height: 100%;

					.item-contain {
						height: 100%;
						display: flex;
						flex-direction: row;
						// justify-content: center;
						padding: 50rpx 0rpx 0rpx 20rpx;

						.item-bar {
							// transition-duration: 0.5s;
							height: 16rpx;
							width: 6rpx;
							opacity: 1;
							margin-right: 8rpx;
							border-radius: 10rpx;

						}

						.item-bar-active {
							background-color: black;
						}

						.item-list {
							.item-type {
								margin-bottom: 66rpx;
								display: flex;
								align-items: center;
								position: relative;

								.num {
									width: 32rpx;
									height: 32rpx;
									border-radius: 50%;
									position: absolute;
									right: -20rpx;
									top: -8rpx;
									color: #FFFFFF;
									display: flex;
									align-items: center;
									justify-content: center;
									font-size: $smallFontSize;
									background-color: $errorFontColor;
								}

							}

							.service-name {
								max-width: 140rpx;
								font-size: $smiddleFontSize;
								color: $mainFontColor;

							}

							.item-type-active {
								font-size: 30rpx;
								color: black;
								transition: transform .4s ease-in-out;
							}
						}
					}
				}
			}

			.right-contain {
				height: calc(100vh - 140rpx);
				background-color: #FFF;



				.right-nav-bar {
					width: calc(100vw - 212rpx);
					// #ifdef APP-PLUS || H5
					height: 95%;
					// #endif
					 // #ifdef MP-WEIXIN
					height: 87%;
					// #endif
					padding: 50rpx 26rpx 0rpx 26rpx;

					.item-material-list {
						.item-material {
							border-bottom: 2rpx solid #F3F3F3;
							margin-bottom: 28rpx;
							display: flex;
							flex-direction: column;


							.item-top {
								margin-bottom: 20rpx;
								display: flex;

								.material-status {
									display: flex;
									margin-left: 10rpx;
									height: 36rpx;

									.item-status {
										font-size: 24rpx;
										padding: 2rpx 8rpx;
										margin-right: 4rpx;
										border-radius: 14rpx;
										transform: scale(0.85);
									}

									.item-status-active {
										background-color: rgba(254, 110, 50, 0.1);
										color: #fe6e32;
									}

									.item-status-no {
										background-color: #f5f5f5;
										color: #909199;
									}
								}

								.material-type-name {
									color: black;
									max-width: 272rpx;
									font-size: 24rpx;
								}
							}

							.item-bottom-contain {
								display: flex;
								background: #f5f5f5;
								padding: 20rpx;
								border-radius: 20rpx;

								.item-image {
									width: 120rpx;
									height: 129rpx;
									border-radius: 10rpx;
								}
							}

							.item-right-material {
								display: flex;
								// flex-direction: column;
								flex: 1;
								justify-content: space-between;
								margin-left: 20rpx;

								.material-left {
									display: flex;
									flex-direction: column;
									margin-right: 8rpx;

									.material-name {
										color: $seconFontColor;
										font-size: $middleFontSize;
										margin-bottom: 10rpx;
									}

									.material-specifications {
										font-size: 24rpx;
										color: #909199;
									}
								}



								.material-other {
									display: flex;
									flex-direction: column;
									align-items: flex-end;

									.material-price {

										.item-price-icon {
											font-size: 24rpx;
											color: #fe6e32;
										}

										.item-price {
											font-size: 30rpx;
											color: #fe6e32;
										}
									}

									.item-material-num {
										font-size: 24rpx;
										color: #909199;
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
				}

				.item-button {
					background-color: #f5f5f5;
					margin: 20rpx;
					border-radius: 16rpx;
					height: 88rpx;
					line-height: 88rpx;
					text-align: center;
					font-weight: bold;
					font-size: 24rpx;

					.plus-icon {
						margin-right: 10rpx;
					}
				}



				.right-nav-bar-all {
					width: 100vw;
				}
			}

			.ios-contain {
				height: calc(100vh - 260rpx);
			}
		}
	}


	.bottom-contain {
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		height: 136rpx;
		background-color: #FFF;
		display: flex;
		z-index: 10;
		box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);

		.left {
			padding: 12rpx 0 6rpx 66rpx;
			display: flex;
			flex: 1;

			image {
				width: 88rpx;
				height: 88rpx;
			}

			.item-left {
				position: relative;
				margin-right: 52rpx;

				.num {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					position: absolute;
					right: -20rpx;
					top: 10rpx;
					color: #FFFFFF;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: $smallFontSize;
					background-color: $errorFontColor;
				}
			}

			.other {
				.select-num {
					color: $errorFontColor;
					display: flex;

					// font-size: $middleFontSize;
					text {
						color: $seconFontColor;
						font-size: $middleAddFontSize;
						font-weight: bold;
					}

					.symbol {
						transform: scale(0.9);
						transform-origin: bottom;
						font-size: $smallFontSize;
					}
				}

				.select-text {
					font-size: $smallFontSize;
					color: $viceFontColor;
					transform: scale(0.85);
					position: relative;
					left: -14rpx;
				}
			}


		}

		.right {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #FFF;
			background-color: $themeColor;
			font-size: $middleFontSize;
			width: 274rpx;
			border-top-left-radius: 70rpx;
			font-weight: bold;
			height: 96rpx;
		}
	}

	.select-material-list {
		height: 100%;
		background-color: #FFF;

		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			margin: 0 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.list-contain {
			height: calc(100% - 280rpx);

			.scroll-Y {
				height: 100%;
			}

			.item-select-material {
				display: flex;
				justify-content: space-between;
				padding: 46rpx 42rpx 46rpx 62rpx;
				border-bottom: 1rpx solid #EEEEEE;
				// touch-action: none;

				.item-left {
					.item-name {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-bottom: 4rpx;
					}

					.item-specifications {
						font-size: $smallFontSize;
						color: $viceFontColor;
						margin-bottom: 20rpx;
					}

					.item-unit {
						color: $seconFontColor;
						font-size: $smallFontSize;
					}

				}

				.item-right {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					margin-top: -20rpx;

					.calculate-num {
						display: flex;
						align-items: center;
						height: 52rpx;
						border: 0.5px solid #EEEEEE;
						border-radius: 2px;
						padding: 0 32rpx;
						margin: 0rpx 4rpx;
					}

					image {
						width: 32rpx;
						height: 34rpx;
						margin-bottom: 20rpx;
					}

					.item-price {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-bottom: 16rpx;
					}
				}
			}
		}

		.bottom-add {
			position: fixed;
			bottom: 30rpx;
			display: flex;
			justify-content: center;
			width: 100%;

			.item-add {
				width: 624rpx;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: $themeColor;
				border-radius: $miniBorderRadius;
				color: #fff;

			}
		}
	}
</style>
