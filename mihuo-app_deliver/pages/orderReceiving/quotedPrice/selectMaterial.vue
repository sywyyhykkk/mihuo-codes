<template>
	<view class="select-material-page">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#fff" class="z-nav-bar">
			<view slot="right" class="nav-bar-title">
				<view class="search">
					<u-icon name="search" color="#999999" size="28"></u-icon>
					<u-input confirm-type="确定" class="describe-input" v-model="search" @confirm="getSearch" height="72"
						type="text" :clearable="false" placeholder-style="fontSize:26rpx;color:#999999"
						placeholder="请输入关键字搜索" :border="false" />
					<view class="item-search-button">
						搜索
					</view>
				</view>
			</view>
		</z-nav-bar>

		<view class="top-contain" v-if="leftBarList.length > 0">
			<view class="type-left">
				<u-tabs item-width="147" active-color="#002FA5" height="72" inactive-color="#787878" font-size="28"
					:list="leftBarList" :is-scroll="true" :current="current" :active-item-style="activeItemStyle"
					@change="changeNavBarItem" bar-width="28" bar-height="6" bg-color="#fff"></u-tabs>
			</view>
			<view class="type-right" @click="getAdd()">
				<image src="/static/images/add-house.png" mode=""></image>
				<text class="item-typa-add">添加空间</text>
			</view>
		</view>

		<view class="list-contain"  :class="[setSys() ? 'list-contain-ios':'']">
			<view class="material-list-contain">
				<scroll-view class="right-nav-bar" :scroll-y="true">
					<view class="item-list-all">
						<view v-for="(item,index) in rightList" :key="index" class="item-material-contain">
							<view class="purchase-material" v-if="item.sourceType == 1003">
								<view class="item-material-details" v-if="item.name ">
									<select-material-details :info="item" offerType="报价"
										@deleteMaterial="deleteMaterial" @select="getTypeList()"
										@getOperation="getOperation">
									</select-material-details>
								</view>
								<view class="item-top" v-else="item">
									<view class="item-title-contain">
										<view class="left">
											<view class="left-name">
												<text class="name">{{item.type}}</text>
												<text class="no-name" v-if="item.materialChecked"></text>
											</view>
											<view class="switch-contain">
												<text class="no-need" v-if="item.materialChecked">无需选材</text>
												<u-switch v-model="item.materialChecked"
													:active-value="item.materialChecked" active-color="#002FA5"
													inactive-color="#C4C4C4" :inactive-value="item.materialChecked"
													@change="switchChange(item)" size="30"></u-switch>
											</view>
										</view>
									</view>
									<view class="item-operation-contain" v-if="!item.materialChecked">
										<view class="item-contain">
											<view class="item-operation" v-for="(en,index) in operationList"
												:key="index" @click="getOperation(en,item)">
												<image :src="en.url"></image>
												<text>{{en.label}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="no-purchase-material" v-if="item.sourceType !== 1003">
								<view class="item-material-details"
									v-if="Number(item.productId) !== 0 || item.sourceType == 1003 ">
									<select-material-details @deleteMaterial="deleteMaterial" offerType="报价"
										:info="item" @select="getTypeList()" @getOperation="getOperation">
									</select-material-details>
								</view>
								<view class="item-top" v-else="item">
									<view class="item-title-contain"
										:class="[item.materialChecked ? 'item-title-contain-active':'']">
										<view class="left">
											<view class="left-name">
												<text class="name">{{item.type}}</text>
												<text class="no-name" v-if="item.materialChecked"></text>
											</view>
											<view class="switch-contain">
												<text class="no-need" v-if="item.materialChecked">无需选材</text>
												<u-switch v-model="item.materialChecked"
													:active-value="item.materialChecked" active-color="#002FA5"
													inactive-color="#C4C4C4" :inactive-value="item.materialChecked"
													@change="switchChange(item)" size="30"></u-switch>
											</view>
										</view>
									</view>
									<view class="item-operation-contain" v-if="!item.materialChecked">
										<view class="item-contain">
											<view class="item-operation" v-for="(en,index) in operationList"
												:key="index" @click="getOperation(en,item)">
												<image :src="en.url"></image>
												<text>{{en.label}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<mh-empty v-if="rightList.length === 0" icon="/static/images/no_recommend.png" title="还没有材料～" />
				</scroll-view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="item-button-contian">
			<view class="add-area-right public-flex-center" @click="addMaterial">
				<image src="/static/images/add-new.png"></image>
				<text>添加材料</text>
			</view>
			<view class="item-button">
				<view class="item-operation" @click="getSumbit()">
					确认
				</view>
			</view>
		</view>

		<!-- 添加区域 -->
		<add-space-popup ref="addSpacePopup" offerType="报价" :offerId="option.offerId"></add-space-popup>

		<!-- 添加材料 -->
		<add-material-popup ref="addMaterialPopup" :custom="custom" @getOperation="getOperation"></add-material-popup>

		<modal-new :shutDown="true" v-model="deleteMaterialShow" @click="deleteConfirm" @cancel="deleteModalCancel">
			<view class="label">是否删除材料</view>
		</modal-new>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				search: '',
				current: 0,
				leftBarList: [],
				rightList: [],
				materialType: [],
				typeList: [],
				leftNavBarIndex: 0,
				typeMaterialListIndex: 0,
				deleteMaterialShow: false,
				deleteMaterialId: '', // 删除材料id
				custom: null,
				projectId: '',
				addMaterialShow: false,
				operationList: [{
						name: '扫码',
						label: '扫码',
						url: '/static/images/scan-code.png',
						sourceType: '1001'
					},
					{
						name: '材料库',
						label: '材料库',
						url: '/static/images/material-library.png',
						sourceType: '1002'
					},
					{
						name: '业主自购',
						label: '业主自购',
						url: '/static/images/shopping-cart.png',
						sourceType: '1003'
					}
				],
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '30rpx'
				},
				tabList: [{
					name: '客厅',
					value: 1
				}, {
					name: '客厅',
					value: 1
				}, {
					name: '客厅',
					value: 1
				}, {
					name: '客厅',
					value: 1
				}, {
					name: '客厅',
					value: 1
				}],
			}
		},
		computed: {},
		mounted() {

		},
		onShow() {
			// this.leftNavBarIndex = 0
			this.setParameters()
			this.getTypeList()
			// 刷新页面
			uni.$on('refreshMaterialPage', () => {
				this.getTypeList()
			})
		},
		onUnload() {
			uni.$off('refreshMaterialPage')
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getAdd() {
				this.$refs.addSpacePopup.show()
			},
			setParameters() {
				this.projectId = this.option.offerId
			},
			getTypeList() { // 查询空间
				this.areaList = []
				if (!this.projectId) {
					return
				}
				this.$httpApi.getBizRoomGroupByOfferId({
					offerId: this.projectId
				}).then(res => {
					if (res) {
						if (res.length === 0) {
							return
						}

						let tempCategoryIdList = []
						res.map((item, index) => {
							item['name'] = item.areaName
							item['materialIdList'] = []
							item['attributeName'] = item.areaName
							item['categoryIdList'] = []
							item.materialList.map(el => {
								el['materialChecked'] = el.typeHiddenStatus == 0 ? false : true
								if (el.attributeValue === '') {
									el.attributeValue = 0
								}
								// 判断是否已开单
								if (el.orderStatus) {
									this.setIsOrderStatus = true
								}
								el['categoryIdList'] = el.rangeCategory !== '' && el.rangeCategory
									.split(',') // 选材范围
								el['productSku'] = el.productSku !== '' && JSON.parse(
									el.productSku)

							})
							// 初始化空间选材范围
							if (Number(this.option.attributeId) === Number(item['id'])) {
								this.leftNavBarIndex = index
								this.categoryIdList = item.categoryIdList
							}
						})
						// 初始化其他数据
						this.leftBarList = res
						this.rightList = res[this.leftNavBarIndex].materialList
						
						this.rightList.forEach(el =>{
							el['operationType'] = '替换'
						})
						
						this.materialType = res[0].materialType // 材料类型 0 主材 1辅材
					}
				})
			},
			getSearch() {

			},
			changeNavBarItem(index) {
				this.leftNavBarIndex = index
				this.current = index
				this.categoryIdList = this.leftBarList[index].categoryIdList
				this.rightList = this.leftBarList[this.leftNavBarIndex].materialList
				this.materialType = this.leftBarList[index].materialType
			},
			/**
			 * @description 删除材料弹框
			 * 
			 */
			deleteMaterial(item) {
				this.deleteMaterialId = item
				this.deleteMaterialShow = !this.deleteMaterialShow
			},
			/**
			 * @description 删除材料确认
			 * 
			 */
			deleteConfirm(id) {
				this.deleteMaterialShow = !this.deleteMaterialShow
				this.$httpApi.removeProductById({
					id: this.deleteMaterialId
				}).then(res => {
					if (res) {
						this.getTypeList()
						this.$util.toast("操作成功");
					}
				})
			},
			deleteModalCancel() {
				this.deleteMaterialShow = !this.deleteMaterialShow
			},
			modalCancel() {
				this.modalShow = !this.modalShow
			},
			/**
			 * @description 添加材料
			 * 
			 */
			addMaterial() {
				this.addMaterialShow = true
				this.$refs.addMaterialPopup.show()
			},
			/**
			 * @description 添加空间
			 * 
			 */
			addSpace() {
				this.$refs.addSpacePopup.show()
			},
			/**
			 * @description 材料选择跳转
			 */
			getOperation(item, ev) {
				uni.setStorageSync('sourceType', item.sourceType)
				let that = this
				switch (item.name) {
					case '扫码':
						break
					case '材料库':
						this.$store.commit('setMaterialParameter', {
							custom: that.custom, // 自定义标识
							categoryIdList: ev.type === '其他' ? that.categoryIdList : ev.categoryIdList, // 筛选范围
							areaList: that.leftBarList, // 所有空间、
							currentAttributeName: that.leftBarList[that.leftNavBarIndex].areaName, // 当前区域name
							currentAttributeId: that.leftBarList[that.leftNavBarIndex].attributeId, // 当前区域id
							currentSpaceId: that.leftBarList[that.leftNavBarIndex].id, // 当前空间id
							configurationTypeName: ev.type, // 后台配置的材料名称
							operationType: ev.operationType, // 替换
							operationId: ev.operationId || '',
							express: ev.express, // 计算公式
							materialType: that.materialType, // 材料类型
							selectMaterialType: ev.type, // 选材类型
							typeName: '',
							viewType: '',
							addMaterialShowName: this.addMaterialShow ? '底部添加' : '',
							selectProductId: Number(ev.productId) === 0 ? ev.id : ev
								.operationId, //材料记录id
							configId: ev.configId // 选材类型id
						})
						this.addMaterialShow = false
						this.toPage(`/pages/construction/selectMaterial/materialStorage`)
						break
					case '业主自购':
						uni.navigateTo({
							url: '/pages/construction/selectMaterial/selfBuying',
							success(res) {
								// 解决选择材料时显示其他区域
								res.eventChannel.emit('selfBuying', {
									attributeId: that.leftBarList[that.leftNavBarIndex].id,
									currentAreaName: that.leftBarList[that.leftNavBarIndex].attributeName,
									selectMaterialType: ev.type,
									areaList: that.leftBarList, // 所有空间、
									selectProductId: ev.id,
									offerType: '报价'
								});
							}
						})
						break
				}
			},
			switchChange(item) {
				this.$httpApi.editHiddenStatus({
					id: item.id
				}).then(res => {
					if (res) {
						this.getTypeList()
					}
				})
			},
			getSumbit() {
				this.goBack()
			},
			setSys() {
				// #ifdef H5
				return false
				// #endif
				
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == 'ios') {
					return true
				} else {
					return false
				}
				// #endif
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.label {
		color: #999999;
		font-size: $middleFontSize;
		text-align: center;
	}

	.nav-bar-title {
		.u-icon {
			margin-right: 28rpx;
		}

		.search {
			width: 618rpx;
			;
			display: flex;
			background: #F4F4F4;
			border-radius: 50rpx;
			padding-left: 38rpx;
			margin-right: 46rpx;

			/* .u-input{
				padding-right: 20rpx !important;
			}
			
			/deep/ .u-input__right-icon{
				padding-right: 0rpx !important;
			} */

			.item-search-button {
				text-align: center;
				line-height: 72rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				width: 108rpx;
				border-radius: 0px 40rpx 40rpx 0px;
				background-color: $themeColor;
				justify-content: center;
			}
		}
	}

	.select-material-page {
		.top-contain {
			display: flex;
			padding-bottom: 20rpx;
			background: #FFFFFF;
			margin-bottom: 8rpx;

			.type-left {
				width: 75%;

				/deep/ .u-scroll-box {
					height: 72rpx;
				}
			}

			.type-right {
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				padding-right: 28rpx;

				border-radius: 50rpx 0rpx 0rpx 50rpx;
				// width: 220rpx;

				image {
					width: 18rpx;
					height: 18rpx;
					margin-right: 12rpx;
				}

				.item-typa-add {
					font-size: 28rpx;
					font-weight: bold;
					color: #002FA5;
				}
			}
		}

		.list-contain {
			height: calc(100vh - 420rpx);

			.material-list-contain {
				height: 100%;


				.right-nav-bar {
					height: 100%;

					.item-list-all {}
				}

				.item-material-contain {
					background-color: #fff;
					margin-bottom: 2rpx;

					.select-material-details {
						border-bottom: 0rpx;
					}
				}

				.item-top {
					padding: 24rpx 34rpx 0rpx 28rpx;

					.item-title-contain-active {
						border-bottom: 2rpx dashed #EEEEEE;
					}

					.item-title-contain {
						display: flex;

						.left {
							display: flex;
							justify-content: space-between;
							flex: 1;
							margin-bottom: 34rpx;

							.left-name {
								display: flex;
								flex-direction: column;

								.name {
									font-weight: bold;
									font-size: $smallFontSize;
									color: $seconFontColor;

								}

								.no-name {
									font-size: $smiddleFontSize;
									color: $mainFontColor;
									margin-top: 10rpx;
								}

							}

							.switch-contain {
								display: flex;
								justify-content: flex-end;
								min-width: 170rpx;

								.no-need {
									color: $viceFontColor;
									font-size: $smallFontSize;
									margin-right: 10rpx;
								}
							}
						}
					}

					.item-operation-contain {
						padding-bottom: 36rpx;

						.item-contain {
							display: flex;
							justify-content: space-between;
						}

						.item-operation {
							display: flex;
							align-items: center;

							text {
								font-size: 22rpx;
								color: $themeColor;
							}

							image {
								width: 26rpx;
								height: 26rpx;
								margin-right: 12rpx;
							}
						}
					}
				}

				.item-material-details {
					// margin-bottom: 28rpx;
					padding: 24rpx 34rpx 0 28rpx;
				}
			}
		}

		.list-contain-ios {
			height: calc(100vh - 500rpx);
		}


	}

	.item-button-contian {
		position: fixed;
		bottom: 0px;
		width: 100%;

		.add-area-right {
			width: 100%;
			display: flex;
			justify-content: center;
			height: 80rpx;
			align-items: center;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-bottom: 6rpx;
				margin-right: 12rpx;
			}

			text {
				color: $themeColor;
				font-size: $smiddleFontSize;
			}
		}

		.item-button {
			background-color: #FFFFFF;
			padding: 30rpx 60rpx;
			height: 144rpx;

			.item-operation {
				background: #002FA5;
				border-radius: 5px;
				font-size: 32rpx;
				color: #FFFFFF;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
			}
		}
	}
</style>
