<template>
	<view class="portfolio-price">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#fff" class="z-nav-bar">
			<view slot="right" class="nav-bar-title">
				<view class="search">
					<u-icon name="search" color="#999999" size="28"></u-icon>
					<u-input confirm-type="确定" class="describe-input" v-model="search" @confirm="getSearch" height="72"
						type="text" :clearable="false" placeholder-style="fontSize:26rpx;color:#999999"
						placeholder="请输入关键字搜索" :border="false" />
					<view class="item-search-button" @click="getSearch"> 搜索 </view>
				</view>
			</view>
		</z-nav-bar>
		<view class="details-contain">
			<view class="top-contain" :class="[isProjectBudget ? 'top-contain-f5' : 'top-contain-ff']">
				<view class="type-left" :class="[isProjectBudget ? 'type-left-82' : 'type-left-100']">
					<u-tabs item-width="187" active-color="#002FA5" height="72" inactive-color="#787878" font-size="28"
						:list="tabList" :is-scroll="true" :current="current" :active-item-style="activeItemStyle"
						@change="change" bar-width="28" bar-height="6" :bg-color="isProjectBudget ? '#f5f5f5' : '#fff'">
					</u-tabs>
				</view>
				<view v-if="isProjectBudget" class="type-right" @click="getAdd()">
					<image src="/static/images/add-house.png" mode=""></image>
					<text class="item-typa-add">添加</text>
				</view>
			</view>
			<view class="middle-contain">
				<view class="enterprise-services">
					<view v-if="!iscustomData" class="left-contain">
						<scroll-view class="left-nav-bar" :scroll-y="true">
							<view class="item-contain">
								<view class="item-list"
									v-if="setPlatformcategoryList.includes(tabSelectName) && !isBudgetSource">
									<view class="item-type" @click="getType(item, index)"
										:id="'u-tab-item-type-' + index" v-for="(item, index) in getTypeListBar"
										:key="index">
										<view class="item-bar" :class="[typeActive === index ? 'item-bar-active' : '']">
										</view>
										<view class="service-name"
											:class="[typeActive === index ? 'item-type-active' : '']">
											{{ item.name }}
										</view>
										<text class="num" v-if="item.selectNum">{{ item.selectNum }}</text>
									</view>
								</view>
								<view class="item-list" v-if="isBudgetSource">
									<view class="item-type" @click="getBudgetType(item, index)"
										:id="'u-tab-item-type-' + index" v-for="(item, index) in getBudgetBarList"
										:key="index">
										<view class="item-bar"
											:class="[budgetBarListActive === index ? 'item-bar-active' : '']"></view>
										<view class="service-name"
											:class="[budgetBarListActive === index ? 'item-type-active' : '']">
											{{ item.name }}
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="right-contain">
						<view v-if="moreTypeList && moreTypeList.length > 0 && !isBudgetSource" class="more-type">
							<text class="left">{{ moreTypeName }}</text>
							<view class="right" @click="getMoreType()">
								<image src="@/static/images/screening_1.png" mode=""></image>
								<text>筛选</text>
							</view>
						</view>

						<scroll-view class="right-nav-bar"
							:class="[moreTypeList.length == 0 && 'right-nav-bar-padding', isBudgetSource && 'right-nav-bar-padding', iscustomData ? 'right-nav-bar-100' : 'right-nav-bar-80']"
							:scroll-y="true" :style="{ height: resultHeight }" @scrolltolower="scrolltolower">
							<!-- 材料数据 -->
							<view class="item-material-list-all"
								v-if="setPlatformcategoryList.includes(tabSelectName) && !isBudgetSource && !iscustomData">
								<view class="item-material-list" v-if="groupsMaterialList.length > 0">
									<view class="item-gropus" v-for="(item1, index1) in groupsMaterialList"
										:key="index1">
										<view class="item-gropus_name">{{ item1.typeName }}</view>
										<view class="item-material" v-for="(item, index) in item1.list" :key="index">
											<view class="item-select-other">
												<image-lazy-load :image="item.data.coverImg" :key="index" height="120">
												</image-lazy-load>
												<view class="item-right-material">
													<view class="material-name">
														{{ item.data.name }}
													</view>
													<view class="material-other">
														<view class="left">
															<text v-if="item.data.isSetMealStatus"
																class="set-meal-sku">{{
																$isJSON(item.data.productSku) &&
																JSON.parse(item.data.productSku)[0] &&
																JSON.parse(item.data.productSku)[0].value
															}}</text>
															<!-- 套餐 -->
															<text v-if="item.setMealName && !item.isSetMealStatus"
																class="set-meal-name">{{ item.setMealName }}</text>
															<text v-if="item.data.tempPrice" class="unit">￥{{
																item.data.tempPrice }}
																<text v-if="item.data.unit">/</text>{{ item.data.unit
																}}</text>
														</view>
														<view class="right">
															<view v-if="item.data.isAddSetMeal" class="add-display">
																套餐已选
															</view>
															<view v-else class="add-listing" @click="addListing(item)">
																加入清单
															</view>
														</view>
													</view>
												</view>
											</view>
											<!-- 已选sku -->
											<view
												v-if="item.skuList && item.skuList.length > 0 && !item.isSetMealStatus"
												class="select-sku-contain">
												<view class="sku-all">
													<view class="item-sku" v-for="(ev, num) in item.skuList" :key="num">
														<view v-if="ev.operationShow || ev.choose"
															class="item-sku_contain">
															<text class="item-text">{{ ev.data.skuName || ev.data.name
															}}</text>
															<add-and-subtract :info="ev" v-model="ev.choose"
																@calculate="calculate"></add-and-subtract>
														</view>
														<!-- 备注，预付款商品不显示备注 -->
														<view v-if="
															item.skuList &&
															item.skuList.length > 0 && (ev.operationShow || ev.choose)
														" class="input-contain_textarea">
															<textarea class="input_textarea" @blur="syncRemark('list')"
																v-model="ev.data.remark" maxlength="100"
																placeholder="请输入说明"
																placeholder-style="color:#909199;font-size: 13px" />
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view v-else class="no-material-list">
									<mh-empty title="这里空荡荡哒～" />
								</view>
							</view>
							<!-- 预算来源 -->
							<budget-source v-if="isBudgetSource && !iscustomData" :list="budgetList"
								@addBudgetSource="addBudgetSource" @budgetCalculate="budgetCalculate"></budget-source>

							<!-- 自定义数据	 -->
							<custom-data v-if="iscustomData" :list="customServiceList" :typeName="tabSelectName"
								@addCustomData="addCustomData" @customDataCalculate="customDataCalculate"></custom-data>

						</scroll-view>
					</view>
				</view>
			</view>

			<!-- 底部按钮 -->
			<shop-cat-button @openShopCat="viewServices" @submit="addResult" ref="shopCatButton"
				@setMakeUpExpensesStatus="setMakeUpExpensesStatus"></shop-cat-button>
		</view>


		<!-- 购物车 -->
		<shop-cat-pop v-model="shopCatPopShow" @close="shopCatPopShow = false"
			:makeUpExpensesStatus="makeUpExpensesStatus" :typeList="selectMaterialType" @submit="addResult"
			@syncList="syncList" @setPackageFlagSwitch="setPackageFlagSwitch" ref="shopCatPop" @syncRemark="syncRemark">
		</shop-cat-pop>

		<!-- sku选择 -->
		<material-sku-popup v-model="materialSkuPopupShow" typeName="开单" ref="materialSkuPopup"
			@saveMaterial="saveMaterial" :detailId="detailId">
		</material-sku-popup>

		<!-- 更多分类 -->
		<mihuo-popup ref="mihuoPopup" :title="productCategoryTreeCodeName || '三级分类'" :typeList="getMoreTypeList"
			:singleStatus="true" type="list" height="600" v-model="showPopup" @close="showPopup = false"
			@click="getPopupClick">
		</mihuo-popup>

		<!-- 套餐弹框 -->
		<set-meal-poup v-model="setMealPoup" typeName="开单" @close="setMealPoup = false" @submit="setMealSubmit"
			:detailId="detailId" :treeList="treeList">
		</set-meal-poup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		deepClone
	} from '@/plugins/utils.js'
	import operation from '@/plugins/mathoperation.js'
	import product from './product.js'
	export default {
		data() {
			return {
				search: '',
				current: 0,
				typeActive: 0,
				typeList: [],
				materialList: [],
				materialPageSize: 1,
				materialCurrentPageSize: 1,
				materialTotal: 0,
				productCategoryTreeCode: '',
				materialSkuPopupShow: false,
				option: {},
				detailId: '',
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '30rpx'
				},
				resultList: [],
				tabList: [],
				tabSelectName: '主材库',
				budgetList: [],
				budgetDataList: [],
				materialCategory: ['1001'],
				setMealcustomCategory: ['1003'],
				selectMaterialType: [],
				budgetBarListActive: 0,
				budgetBarListActiveName: '',
				budgetBarList: [],
				platformcategoryList: [],
				productCategoryTreeCode: '',
				productCategoryTreeCodeName: '',
				selectMaterilaActive: {},
				currentProduct: {},
				makeUpExpensesStatus: false,
				customType: ['预算来源'],
				pageTypeList: ['快速预算', '快速开单','预算'],
				getBudgetTypeList: ['项目预算'],
				customUserType: [{
					name: '自定义',
					value: '3'
				}, {
					name: '常用',
					value: '2'
				}],
				shopCatPopShow: false,
				treeList: [],
				moreTypeName: '全部',
				moreTypeNameIndex: 0,
				moreTypeList: [],
				showPopup: false,
				resultHeight: '1240rpx',
				groupsMaterialList: [],
				setMealPoup: false,
				setMealList: [],
				pageList: [],
				budgetName: '',
				productList: [],
				customServiceList: [], // 自定义商品
				commonlyUserList: [] // 常用商品
			}
		},
		onLoad(option) {
			this.option = option
			this.getTypeList()
			this.mulationQuoteDetails()
		},
		computed: {
			...mapState([
				'shoppingCart',
				'serviceCityOperatorId',
				'projectInfo',
				'orderInfo',
				'nodeInfo'
			]),
			/**
			 * @description 购物车价格统计
			 * */
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
			 * @description 顶部分类
			 * */
			setPlatformcategoryList() {
				let tempList = []
				this.platformcategoryList.forEach((el) => {
					tempList.push(el.name)
				})
				return tempList
			},
			/**
			 * @description 预算搜索
			 * */
			getBudgetBarList() {
				if (this.search) {
					return [{
						name: '搜索结果'
					}]
				} else {
					return this.budgetBarList
				}
			},
			/**
			 * @description 普通材料搜索
			 * */
			getTypeListBar() {
				if (this.search) {
					return [{
						name: '搜索结果'
					}]
				} else {
					return this.typeList
				}
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
			},
			getMoreTypeList() {
				let tempList = this.tabList[this.current]
				if (tempList && tempList.customCategory) {
					return []
				}
				this.moreTypeList =
					(this.typeList[this.typeActive] &&
						this.typeList[this.typeActive].children) || []
				let result = [{
					name: '全部',
					value: '-1'
				}]
				this.moreTypeList.forEach((el) => {
					result.push({
						name: el.name,
						value: el.treeCode
					})
				})
				return result || []
			},
			isBudgetSource() {
				return ['预算来源'].includes(this.tabSelectName) ? true : false
			},
			isProjectBudget() {
				// 现在的不支持选择自定义商品
				return this.getBudgetTypeList.includes(this.option.pageType) ? false : false
			},
			iscustomData() {
				// 现在的不支持选择自定义商品
				return ['常用', '自定义'].includes(this.tabSelectName) && this.isProjectBudget ? false : false
			},
		},
		watch: {
			search: {
				handler(newVal, oldVal) {
					this.debounce(() => {
						this.getSearchType()
						this.moreTypeNameIndex = 0
					}, 100)
				}
			}
		},
		onShow() {
			this.getBudgetList()
			this.getCustomServiceList()
			this.getSelectCommonlyUser()
		},
		methods: {
			/**
			 * @description 查询平台分类
			 * */
			getTypeList() {
				this.$httpApi.getListByTreeCodeTree({}).then((res) => {
					if (res) {
						// 源数据
						this.treeList = deepClone(res)
						// 套餐用到
						uni.setStorageSync('treeList', this.treeList)
						res.forEach((el) => {
							if (!this.customType.includes(el.name)) {
								el.name = el.name + '库'
							}
						})
						if (!this.pageTypeList.includes(this.option.pageType)) {
							res.push({
								name: '预算来源',
								value: 10
							})
							this.budgetBarList = this.treeList
						}

						if (this.isProjectBudget) {
							this.customUserType.forEach((el) => {
								res.push({
									name: el.name,
									value: el.value
								})
							})
						}

						// 顶部分类
						this.tabList = res
						if (this.option.treeCode) {
							res.forEach((item, index) => {
								if (item.treeCode == this.option.treeCode) {
									this.current = index
								}
							})
						}

						this.initType()
						this.initPageSize()
						this.initTreeCode()
						this.initMoreTypeList()

						this.selectSetMealList()
						this.selectMaterialList()
					}
				})
			},
			/**
			 * @description 设置分类
			 * */
			initType() {
				// 购物车商品分类
				this.selectMaterialType = this.treeList
				this.selectMaterialType.unshift({
					name: '全部'
				})
				// 顶部分类
				this.platformcategoryList = this.tabList
			},
			/**
			 *@description 查询预算来源数据
			 * */
			getBudgetList() {
				if (this.pageTypeList.includes(this.option.pageType)) {
					return
				}
				this.$httpApi
					.typeByCondition({
						// orderId: this.orderInfo.orderId,
						source: 3, // 组合报价来源（1订单，2变更订单，3项目预算，4材料管理）
						topName: '',
						projectId: this.projectInfo.projectId,
						keyword: this.search,
						nodeId: uni.getStorageSync('clientBilling') ?
							this.nodeInfo.nodeId : ''
					})
					.then((res) => {
						if (res) {
							if (res.length > 0) {
								// 预算量赋值给选择数量
								res.forEach((el) => {
									if (el.groupPrices) {
										el.groupPrices.forEach((ev) => {
											ev.products.forEach((en) => {
												// en['type'] = ev.topName
												// en['tempPrice'] = en.price
												// 备注默认隐藏 (当前选择数量与预算量不一致时显示)
												ev['selectNum'] = 0
												en['selectNum'] = 0
												if (!en.quantity && en.orderStatus == 0) {
													en.quantity = en.budgetNum
												}
											})
										})
									}
								})
								this.budgetDataList = res
								this.setTotalPrice()
								this.setBudgetDataList()
								this.budgetList = this.budgetDataList
							}
						} else {
							this.budgetList = []
						}
					})
			},
			/**
			 *@description 设置分页默认值
			 * */
			initPageSize() {
				this.tabList.forEach((item) => {
					if (!this.customType.includes(item.name)) {
						if (this.setPlatformcategoryList.includes(this.tabSelectName)) {
							item['materialPageSize'] = 1
							item['materialCurrentPageSize'] = 1
							item['materialTotal'] = 0
						}
					}
				})
			},
			/**
			 * @description
			 * 设置 productCategoryTreeCode、productCategoryTreeCodeNam
			 * */
			initTreeCode() {
				if (!this.isBudgetSource) {
					if (this.tabList.length > 0) {
						this.typeList = (this.tabList[this.current] && this.tabList[this.current].children) || []
					}
					if (this.typeList.length > 0) {
						this.typeList.map((item) => {
							item['selectNum'] = 0
						})
						this.contrastIsSelect()
						let typeActive = this.typeList[this.typeActive]
						if (typeActive) {
							if (this.productCategoryTreeCode) {
								return
							}
							this.productCategoryTreeCode = typeActive.treeCode
							this.productCategoryTreeCodeName = typeActive.name
						}
					} else {
						this.productCategoryTreeCode = this.tabList[this.current] && this.tabList[this.current].treeCode
						this.productCategoryTreeCodeName = this.tabList[this.typeActive] && this.tabList[this.typeActive]
							.name

					}
				}
			},
			/**
			 * @description
			 * 设置 moreTypeList
			 * */
			initMoreTypeList() {
				this.moreTypeList = (this.typeList[this.current] && this.typeList[this.current].children) || []
			},
			/**
			 * @description 显示当前类型下材料数量
			 * */
			contrastIsSelect() {
				if (this.shoppingCart.length > 0) {
					if (this.typeList && this.typeList.length > 0) {
						let treeCodeList = this.shoppingCart.map(item1 => {
							return item1.treeCode
						})
						this.typeList.forEach(item => {
							item['selectNum'] = 0
							treeCodeList.forEach(el => {
								if (el && el.includes(item.treeCode)) {
									item['selectNum']++
								}
							})
						})
					}
				} else {
					if (this.typeList) {
						this.typeList.map((item) => {
							item['selectNum'] = 0
						})
					}
				}
			},
			/**
			 * @description 查询材料数据
			 * */
			selectMaterialList() {
				let tempParameter = {
					productCategoryTreeCode: this.search ?
						this.productCategoryTreeCode.split('-')[0] : this.productCategoryTreeCode,
					keyword: this.search,
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					cityOperatorFlag: 2, // 	1=仅运营商商品，2=运营商及其下企业商品
					size: 15,
					verifyStatus: 1, // 审核通过
					current: this.materialPageSize || 1,
					onlineState: 0
				}
				this.$httpApi.selectCustomerPage(tempParameter).then((res) => {
					if (res) {
						// 过滤掉线下材料 1010
						// res.records = res.records.filter(item => item.customCategory !== '1010')
						res.records.map((item) => {
							item['tempPrice'] = item.price
							item['remark'] = '' // 选择材料备注
						})
						let itemTab = this.tabList.find(
							(item) => item.name == this.tabSelectName
						)
						if (itemTab) {
							itemTab.materialTotal = res.total
						}
						if (this.materialPageSize > 1) {
							if (this.materialPageSize !== this.materialCurrentPageSize) {
								this.materialList = this.materialList.concat(res.records)
								this.materialCurrentPageSize = this.materialPageSize
							}
						} else {
							this.materialList = res.records
							this.materialCurrentPageSize = this.materialPageSize
						}
						this.initSorting()
						this.contrastIsSelect()
						this.setGroupsMaterial()
						this.getRightHeight()
					}
				})
			},
			/**
			 * @description  对已选择的数据，进行排序
			 * */
			initSorting() {
				this.shoppingCart.map((item) => {
					this.materialList.map((el) => {
						// if (item.id == el.id) {
						// 	el['selectNum'] = item.selectNum
						// }
						if (el.selectNum) {
							el['sorting'] = 2
						} else {
							el['sorting'] = 1
						}
					})
				})
				this.materialList.sort(this.sortArr('sorting'))
			},
			/**
			 * @description 创建商品
			 * */
			createProduct(item) {
				return {
					data: item,
					skuList: [],
					getTotalPrice: (list) => {
						let totalList = list.map(item => {
							return operation.floatMul(item.price, item.choose)
						})
						return operation.funCalc(totalList)
					}
				}
			},
			/**
			 * @description 列表添加sku商品
			 * */
			addListSkuProduct(event) {
				// 已经添加过了，直接修改数量
				if (!this.isListAddSkuProduct(event)) {
					try {
						this.groupsMaterialList.forEach((item1, index) => {
							let hashTable = this.createHashList(item1.list);
							let target = event.productId;
							let obj = hashTable[target];
							if (obj) {
								let tempSku = obj.skuList.find(item3 => item3.data.skuId == event.skuId)
								if (tempSku) {
									throw {
										details: tempSku,
										type: 1 // 数据相加
									}
								} else {
									throw {
										details: event,
										type: 0 // 添加一个新数据
									}
								}
							} else {
								// throw {
								// 	details: event,
								// 	type: 0 // 添加一个新数据
								// }
								// this.initSkuProduct(event)
							}
						})
					} catch (even) {
						if (even.type) {
							this.skuIncrease(even.details)
						} else {
							this.initSkuProduct(even.details)
						}
					}
				} else {
					this.initSkuProduct(event)
				}
			},
			/**
			 * @description 列表添加sku商品
			 * */
			addShopSkuProduct(event) {
				// 已经添加过了，直接修改数量
				if (!this.isShopAddSkuProduct(event)) {
					const hashTable = this.createHashShop(this.shoppingCart);
					const target = event.skuId;
					const obj = hashTable[target];
					if (obj) {
						obj.selectNum = obj.selectNum + event.selectNum
					}
				} else {
					// for (let i = 0; i < 1000; i++) {
					// 	if (i > 1) {
					// 		event.skuId = Number(event.skuId) + i
					// 	}
					// 	this.saveProduct(event)
					// }
					this.saveProduct(event)
				}
			},
			/**
			 * @description sku加
			 * */
			skuIncrease(item) {
				item.increase()
			},
			/**
			 * @description sku减
			 * */
			skuDecrease(item) {
				item.decrease()
			},
			/**
			 * @description 初始化sku商品
			 * */
			initSkuProduct(item) {
				item.choose = item.selectNum
				let tempSku = item.productSku && JSON.parse(item.productSku)[0] && JSON.parse(item.productSku)[0].value
				item['skuName'] = tempSku
				let skuProduct = new product(item)
				this.currentProduct.skuList.push(skuProduct)
			},
			/**
			 * @description 设置sku 数量
			 * */
			setChoose(skuProduct) {
				skuProduct.setChoose(skuProduct.choose)
			},
			/**
			 * @description 列表是否添加过该sku商品
			 * */
			isListAddSkuProduct(even) {
				let isBoolean = true
				try {
					this.groupsMaterialList.forEach(item => {
						const hashTable = this.createHashList(item.list);
						const target = even.productId;
						const obj = hashTable[target];
						if (obj.data.id == even.id && obj.skuList.length) {
							throw item
						}
					})
				} catch (e) {
					isBoolean = false
				}
				return isBoolean
			},
			/**
			 * @description 购物车是否添加过该sku商品
			 * */
			isShopAddSkuProduct(even) {
				let isBoolean = true
				try {
					const hashTable = this.createHashShop(this.shoppingCart);
					const target = even.skuId;
					const obj = hashTable[target];
					if (obj) {
						if (obj.skuId == even.skuId) {
							throw obj
						}
					}
				} catch (e) {
					isBoolean = false
				}
				return isBoolean
			},
			getSearch() {
				this.getSearchType()
			},
			/**
			 * 触发搜索时，左侧分类数据只显示一个 搜索type
			 * */
			getSearchType() {
				let treeCode = this.tabList[this.current].treeCode
				// 查询所有分类的材料
				if (this.setPlatformcategoryList.includes(this.tabSelectName)) {
					this.materialPageSize = 1
					this.selectMaterialList()
				} else {
					this.getBudgetList()
				}
			},
			setTotalPrice() {
				let tempPice = []
				this.budgetDataList.forEach((item) => {
					item['totalPriceList'] = []
					if (item.groupPrices) {
						item.groupPrices.forEach((el) => {
							item['totalPriceList'].push(Number(el.totalPrice))
						})
					}
				})

				this.budgetDataList.forEach((item) => {
					item['totalPrice'] = operation.funCalc(item.totalPriceList)
				})
			},
			getBudgetType(item, index) {
				this.budgetBarListActive = index
				let activeName = this.budgetBarList[index].name
				let treeCode =
					this.budgetBarList[index] && this.budgetBarList[index].treeCode
				this.budgetBarListActiveName = activeName
				if (activeName !== '全部') {
					if (activeName == '人工') {
						this.budgetList = this.budgetDataList.filter((item) =>
							item.name.includes(activeName)
						)
					} else {
						this.budgetList = this.budgetDataList.filter(
							(item) => item.type == treeCode
						)
					}
				} else {
					this.budgetList = this.budgetDataList
				}
			},
			/**
			 * 主材、辅材、人工配置自己的materialPageSize
			 * */
			scrolltolower() {
				let itemTab = this.tabList.find((item) => item.name == this.tabSelectName)
				if (itemTab) {
					if (this.materialList.length < itemTab.materialTotal) {
						itemTab.materialPageSize++
						this.materialPageSize = itemTab.materialPageSize
						this.selectMaterialList()
					}
				}
			},
			/**
			 *
			 * @description 切换左侧type
			 * */
			getType(item, index) {
				this.typeActive = index
				if (item.customCategory) {
					this.setGroupsMaterialList()
				} else {
					this.moreTypeList = this.typeList[this.typeActive].children || []
					this.productCategoryTreeCode = item.treeCode
					this.productCategoryTreeCodeName = item.name
					this.initPageSize()
					this.materialPageSize = 1
					this.moreTypeNameIndex = 0
					this.selectMaterialList()
				}
			},
			sortArr(attr) {
				return function(a, b) {
					return a[attr] - b[attr]
				}
			},
			viewServices() {
				if (this.shoppingCart.length == 0) {
					this.$util.toast('请添加商品')
					return
				}
				this.shopCatPopShow = !this.shopCatPopShow
			},
			change(index) {
				this.tabSelectName = this.tabList[index].name
				this.current = index
				this.typeActive = 0
				this.moreTypeNameIndex = 0
				if (this.isBudgetSource) {
					if (this.budgetBarListActiveName) {
						if (this.budgetBarListActiveName == '全部') {
							this.budgetList = this.budgetDataList
						} else {
							this.budgetList = this.budgetDataList.filter((item) =>
								item.name.includes(this.budgetBarListActiveName)
							)
						}
					}
					this.getRightHeight()
				} else {
					let tempList = this.tabList[index]
					// 套餐内材料
					if (tempList.customCategory) {
						this.setSetMealTypeList()
						this.setGroupsMaterialList()
						// this.setSpecifications()
					} else {
						this.typeList = tempList.children || []
						let tempResult =
							tempList.children &&
							tempList.children.length > 0 &&
							tempList.children[0]
						if (tempResult) {
							this.productCategoryTreeCode = tempResult.treeCode
							this.productCategoryTreeCodeName = tempResult.name
						} else {
							this.productCategoryTreeCode = this.tabList[index].treeCode
							this.productCategoryTreeCodeName = this.tabList[index].name
						}
						this.initPageSize()
						this.materialPageSize = 1
						this.selectMaterialList()
					}
				}
			},

			/**
			 * @description 更新预算选择数量
			 * */
			setBudgetDataList() {
				if (this.pageTypeList.includes(this.option.pageType)) {
					return
				}
				let tempList = JSON.parse(JSON.stringify(this.shoppingCart))
				this.budgetDataList.forEach((item) => {
					if (item.groupPrices) {
						item.groupPrices.forEach((el) => {
							el.products.forEach((ev) => {
								tempList.forEach((en) => {
									if (ev.skuId == en.skuId) {
										ev['selectNum'] = en.selectNum
									}
								})
							})
						})
					}
				})
			},
			/**
			 *
			 * @description 设置列表sku数据、设置购物车sku数据
			 * */
			saveMaterial(item) {
				// 材料列表
				this.addListSkuProduct(item)
				// 设置购物车
				item['productName'] = item.name
				item['price'] = item.materialSkuPic
				// 如果是套内材料，则价格为设置为0
				if (this.isPackageFlag(item)) {
					item['price'] = 0
				}
				this.addShopSkuProduct(item)
				// 左侧列表
				this.contrastIsSelect()
				// 补齐费用
				this.calculateMakeUpExpenses()
				// 备注
				this.syncRemark('list')
			},
			/**
			 *
			 * @description 添加商品
			 * */
			saveProduct(item) {
				let tempList = JSON.parse(JSON.stringify(this.shoppingCart))
				let result = {
					name: item.productName,
					coverImg: item.coverImg,
					productSku: item.productSku,
					skuId: item.skuId,
					productId: item.productId,
					unit: item.unit,
					price: item.price,
					priceBack: item.price,
					selectNum: item.selectNum, // 选择数量
					treeCode: item.platformTreeCode, // 用于顶部类型筛选
					itemShow: true, // 控制是否显示
					makeExpensesShow: false, // 显示补齐价格
					makeExpenses: '', // 补齐价格
					customCategory: item.customCategory, // 商品分类 1001=材料 1002=服务 1003=套餐 1010=线下材料
					packageFlag: item.packageFlag ? item.packageFlag : 0, // 套餐内商品标识：0-非套餐内，1-套餐内
					packageFlagSwitch: item.packageFlag ? true : false,
					isPackageList: this.pageList.length ? true : false, // 判断是否开过套餐，用于显示switch开关
					remark: '' // 选材备注
				}
				tempList.push(result)
				this.$store.commit('setShoppingCart', tempList)
			},
			/**
			 * @description 向购物车添加预算数据
			 * @param {Object} item  当前列表数据 
			 * */
			addBudgetSource(item) {
				const hashTable = this.createHashShop(this.shoppingCart);
				const target = item.skuId;
				const obj = hashTable[target];
				if (obj) {
					obj.selectNum = item.selectNum ? item.selectNum : 1
					this.syncBudgetListProduct(obj)
				} else {
					item['coverImg'] = item.productImg
					item.selectNum = item.orderNum ? 1 : item.budgetNum - item.orderNum ? item.budgetNum - item
						.orderNum : 1
					this.saveProduct(item)
					this.syncBudgetListProduct(item)
				}
				// console.log('budgetList',this.budgetList)
				// this.calculateMakeUpExpenses()
				// this.contrastIsSelect()
			},
			/**
			 * @description 向购物车添加自定义材料
			 * @param {Object} even  当前列表数据 
			 * */
			addCustomData(even) {
				const hashTable = this.createHashShop(this.shoppingCart);
				const target = even.id;
				const obj = hashTable[target];
				if (obj) {
					obj.selectNum = even.selectNum ? even.selectNum : 1
					this.syncCustomServiceList(obj)
				} else {
					even['productName'] = even.name
					even['selectNum'] = 1
					even['skuId'] = even.id
					// 自定义类型
					even['platformTreeCode'] = '3000'
					this.saveProduct(even)
					this.syncCustomServiceList(even)
				}
			},
			addListing(item) {
				if (item.data.isSetMealStatus) {
					let tempStatus = this.shoppingCart.find(
						(item1) => item1.skuId == item.data.skuId
					)
					if (tempStatus) {
						this.addPage(item.data)
						let product = item.skuList.find(item1 => item1.data.skuId == item.data.skuId)
						if (product) {
							this.skuIncrease(product)
						}
					} else {
						// 如果是套餐内商品，则直接加入购物车，不需要弹出框
						item.data['id'] = item.data.productId
						// 更新列表SKU数据	
						if (item.skuList.length == 0) {
							item.data.choose = item.data.selectNum
							let skuProduct = new product(item.data)
							item.skuList.push(skuProduct)
						}
						// 向购物车添加商品
						this.saveProduct(item.data)
					}
				} else {
					// 添加套餐
					if (this.setMealcustomCategory.includes(item.data.customCategory)) {
						this.detailId = item.data.id
						this.setMealPoup = !this.setMealPoup
					} else {
						this.selectMaterilaActive = item.data
						this.currentProduct = item
						this.getSku()
					}
				}
			},
			getSku() {
				this.detailId = this.selectMaterilaActive.id
				this.materialSkuPopupShow = true

				// setTimeout(() => {
				// 	this.$refs.materialSkuPopup.show()
				// }, 50)
			},
			setInput(even, item) {
				this.debounce(() => {
					even = even.replace(/[^\d]/g, '')
					this.calculate('输入', item, Number(even))
				}, 200)
			},
			/**
			 * @description 材料数量加减
			 * @param type 加、减、手动输入
			 * @param even 当前实例
			 * @param operationNumber 手动输入的数据
			 * @param operationName 标记，用于区分是在购物车中加减、还是在材料列表中加减
			 * */
			calculate(type, even, operationNumber) {
				if (type == '加') {
					this.skuIncrease(even)
				} else if (type == '减') {
					this.skuDecrease(even)
				} else {
					if (!operationNumber) {
						even['operationShow'] = true
						operationNumber = ''
					}
					even.choose = operationNumber
					this.setChoose(even)
				}
				this.syncListShopCat(even)
				this.syncProductList(even)
				this.contrastIsSelect()
				this.calculateMakeUpExpenses()
			},
			/**
			 * @description 加工
			 * */
			process(type, even, operationNumber) {
				if (type == '加') {
					even.selectNum++
				} else if (type == '减') {
					if (even.selectNum === 0) {
						return
					}
					even.selectNum--
				} else {
					if (!operationNumber) {
						even['operationShow'] = true
						operationNumber = ''
					}
					even.selectNum = operationNumber
				}
				return even
			},
			/**
			 * @description 购物车中材料数量加减
			 * @param type 加、减、手动输入
			 * @param even 当前实例
			 * @param operationNumber 手动输入的数据
			 * @param operationName 标记，用于区分是在购物车中加减、还是在材料列表中加减
			 * */
			budgetCalculate(type, even, operationNumber) {
				let result = this.process(type, even, operationNumber)
				this.syncListShopCat(result)
			},
			customDataCalculate(type, even, operationNumber) {
				let result = this.process(type, even, operationNumber)
				this.syncCustomDataListShopCat(result)
			},
			/**
			 * @description 初始化预算来源数据中的选择数量
			 * */
			initSelectNum(tempList) {
				if (this.isBudgetSource) {
					this.budgetDataList.forEach((en) => {
						if (en.groupPrices) {
							en.groupPrices.forEach((el) => {
								el.products.forEach((ev) => {
									if (tempList.length > 0) {
										tempList.map((item) => {
											if (item.skuId == ev.skuId) {
												ev['selectNum'] = item.selectNum
											}
										})
									} else {
										ev['selectNum'] = 0
									}
								})
							})
						}
					})
					this.budgetList = this.budgetDataList
					this.budgetList = this.budgetDataList.filter((item) =>
						item.name.includes(this.budgetBarListActiveName)
					)
				}
			},
			setBudgetList(item) {
				if (this.budgetList.length == 0) {
					return
				}
				this.budgetList.forEach((en) => {
					if (en.groupPrices) {
						en.groupPrices.forEach((el) => {
							el.products.forEach((ev) => {
								if (item.skuId == ev.skuId) {
									ev['quantity'] = 0
									ev['selectNum'] = 0
								}
							})
						})
					}
				})
			},
			/**
			 * @description
			 * 入口：1.项目经理、项目管家报价  2.其他工种报价  3.sop 预算报价
			 *
			 * */
			getJumbBillingDetails() {
				let tempShoppingCartist = JSON.parse(JSON.stringify(this.shoppingCart))
				if (tempShoppingCartist.length == 0) {
					this.$util.toast('请选择商品')
					return
				}
				let tempResult = []
				tempShoppingCartist.forEach((el) => {
					tempResult.push({
						skuId: el.skuId,
						packageFlag: el.packageFlag,
						quantity: el.selectNum,
						memberReceiveAddressId: this.projectInfo.addressId,
						enableDiffAmount: this.makeUpExpensesStatus,
						companyId: '',
						packageInfo: el.packageInfo ? el.packageInfo : null, // 套参材料
						packageProductId: el.packageFlag ? el.productId : null, // 套内材料
						remark: el.remark
					})
				})
				this.$store.commit('setSkuIdList', tempResult)
				this.toPage(
					`/pages/construction/clientBilling/billingDetails?isDiff=${this.makeUpExpensesStatus ? 1 : 0}`
				)
			},
			/**
			 * @description 判断是否是套内材料
			 * */
			isPackageFlag(item) {
				let packageFlag = 0
				if (this.pageList.length) {
					try {
						this.pageList.forEach((item1) => {
							if (item1.skuId == item.skuId) {
								throw e
							}
						})
					} catch (e) {
						packageFlag = 1
					}
				}
				return packageFlag
			},
			addResult() {
				if (this.pageTypeList.includes(this.option.pageType)) {
					this.addBudget()
				} else {
					if (this.option.pageType == '预算') {
						this.addByCondition()
					} else {
						this.getJumbBillingDetails()
					}
				}
			},
			/**
			 * @description 做快速预算
			 * */
			addBudget() {
				let tempShoppingCartist = JSON.parse(JSON.stringify(this.shoppingCart))
				if (tempShoppingCartist.length == 0) {
					this.$util.toast('请选择商品')
					return
				}
				let tempResult = []
				tempShoppingCartist.forEach((el) => {
					tempResult.push({
						skuId: el.skuId,
						count: el.selectNum,
						packageInfo: el.packageInfo ? el.packageInfo : null,
						remark: el.remark
					})
				})
				// this.getGroupName()
				// return
				if (this.option.pageType == '快速开单') {
					this.quickBilling(tempResult)
				} else {
					this.$httpApi.addOrderGroupPrice(tempResult).then((res) => {
						if (res) {
							this.addMulationQuote(res)
						}
					})
				}
			},
			/**
			 * @description 快速开单
			 * */
			quickBilling(skus) {
				let tempShoppingCartist = JSON.parse(JSON.stringify(this.shoppingCart))
				let parameterAll = {
					companyId: tempShoppingCartist[0] && tempShoppingCartist[0].companyId, // 公司id
					companyName: tempShoppingCartist[0] && tempShoppingCartist[0].companyName, // 公司名称
					coverImg: tempShoppingCartist[0] && tempShoppingCartist[0].coverImg, // 公司名称
					groupName: this.getGroupName(), // 组合报价名称
					price: this.selectServicePice // 金额
				}
				let parameter = {
					id: this.option.detailId || '',
					type: 1,
					name: uni.getStorageSync('billingName'),
					skus: JSON.stringify(skus),
					...parameterAll
				}
				this.$httpApi.addMulationQuote(parameter).then((res) => {
					this.$util.toast(`开单成功`)
					setTimeout(() => {
						this.$store.commit('setShoppingCart', [])
						let pages = getCurrentPages()
						let prevPage = pages[pages.length - 2]
						prevPage.$vm.option['detailId'] = res.id
						uni.navigateBack({
							delta: 1
						})
					}, 500)
				})
			},

			/**
			 * @description 新增模拟报价
			 * */
			addMulationQuote(res) {
				let tempShoppingCartist = JSON.parse(JSON.stringify(this.shoppingCart))
				let parameterAll = {
					companyId: tempShoppingCartist[0] && tempShoppingCartist[0].companyId, // 公司id
					companyName: tempShoppingCartist[0] && tempShoppingCartist[0].companyName, // 公司名称
					coverImg: tempShoppingCartist[0] && tempShoppingCartist[0].coverImg, // 公司名称
					groupName: this.getGroupName(), // 组合报价名称
					price: this.selectServicePice, // 金额
					name: this.budgetName
				}
				if (res.length > 0) {
					let groupPrices = res.map((item) => {
						return item.id
					})
					groupPrices = groupPrices.join(',')
					let parameter = this.option.groupPricesId ? {
						id: this.option.groupPricesId,
						groupPrices: groupPrices,
						type: 0,
						...parameterAll
					} : {
						groupPrices: groupPrices,
						type: 0,
						...parameterAll
					}
					this.$httpApi.addMulationQuote(parameter).then((res) => {
						this.$util.toast(
							`${this.option.pageType == '快速开单' ? '开单' : '保存'}成功`
						)
						setTimeout(() => {
							this.$store.commit('setShoppingCart', [])
							let pages = getCurrentPages()
							let prevPage = pages[pages.length - 2]
							prevPage.$vm.option['detailId'] = res.id
							uni.navigateBack({
								delta: 1
							})
						}, 500)
					})
				}
			},
			/**
			 * @description 计算补齐费用
			 * 加、减
			 * */
			calculateMakeUpExpenses() {
				this.$refs.shopCatButton && this.$refs.shopCatButton.switchChange()
			},
			/**
			 * @description 返回快速预算的 组合报价名称 例如  人工:2 主材:3  辅材:4
			 * */
			getGroupName() {
				const tempShoppingCartist = JSON.parse(JSON.stringify(this.shoppingCart))
				// console.log('tempShoppingCartist',tempShoppingCartist);
				// 1.对人工费(customCategoryType 1002)进行统计
				// 2.其他数据按照treeCode分组
				let laborCost = [],
					laborCostIndex = 0,
					otherIndex = 0,
					otherList = [],
					tempResultList = [],
					tempList = []
				tempShoppingCartist.forEach((el) => {
					if ([1002].includes(Number(el.customCategory))) {
						laborCost = []
						tempList.push(el)
						laborCost.push({
							topName: '人工费',
							num: ++laborCostIndex,
							treeCode: el.treeCode
						})
					} else if ([1003].includes(Number(el.customCategory))) {
						laborCost.push({
							topName: '套餐',
							num: ++otherIndex,
							treeCode: el.treeCode
						})
					} else {
						otherList.push(el)
					}
				})
				otherList.forEach((item) => {
					item['treeCode'] = item.treeCode.split('-')[0]
				})
				let resultOtherList = this.setMaterialType(otherList, 'treeCode')
				resultOtherList.forEach((el) => {
					tempResultList.push({
						topName: '',
						num: el.list.length,
						treeCode: el.type
					})
				})
				this.treeList.forEach((item) => {
					tempResultList.forEach((item2) => {
						if (item.treeCode == item2.treeCode) {
							item2.topName = item.name
						}
					})
				})
				const resultList = [...laborCost, ...tempResultList]
				return JSON.stringify(resultList)
			},
			/**
			 * @description 分组 
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
			getPopupClick(event) {
				let {
					item,
					index
				} = event
				let treeCode =
					item.name == '全部' &&
					this.typeList[this.typeActive] &&
					this.typeList[this.typeActive].treeCode
				this.productCategoryTreeCode = item.name == '全部' ? treeCode : item.value
				this.initPageSize()
				this.materialPageSize = 1
				this.moreTypeNameIndex = index
				this.selectMaterialList()
			},
			getMoreType() {
				if (this.getMoreTypeList.length > 0) {
					this.showPopup = true
				}
			},
			/**
			 * @description 设置材料列表高度
			 * */
			getRightHeight() {
				let screenHeight = uni.getSystemInfoSync().screenHeight
				let offest = 4
				this.$nextTick(() => {
					// 导航栏高度
					let classResult = '.header_fixed, .top-contain, .bottom-contain '
					if (this.moreTypeList.length > 0) {
						classResult += ', .more-type'
					}
					uni
						.createSelectorQuery()
						.selectAll(classResult)
						.boundingClientRect((res) => {
							if (res) {
								let total = 0
								res.forEach((el) => {
									total += el.height
								})
								let result = screenHeight - total - offest
								this.resultHeight = this.$util.pxToRpx(result) + 'rpx'
							}
						})
						.exec()
				})
			},
			/**
			 * @description 根据platformTreeCode 进行数据分组 
			 * */
			setGroupsMaterial() {
				this.groupsMaterialList = this.setMaterialType(
					this.materialList,
					'platformTreeCode',
					'platformCategoryName'
				)
				this.setMealName()
				this.setMoreTypeName()
				this.setGroupsMaterialList()
			},
			/**
			 * @description 设置当前选中的三级分类名称
			 * */
			setMoreTypeName() {
				if (this.moreTypeNameIndex) {
					this.moreTypeName = this.getMoreTypeList[this.moreTypeNameIndex].name
				} else {
					this.moreTypeName = '全部'
				}
			},
			/**
			 * @description 查询套餐数据
			 * */
			selectSetMealList() {
				if (!this.projectInfo.projectId) {
					return
				}
				this.$httpApi
					.queryPackageOrderItems({
						projectId: this.projectInfo.projectId
					})
					.then((res) => {
						if (res) {
							this.setMealList = []
							this.pageList = []

							// 初始化字段
							res.forEach((item1) => {
								if (item1.packageInfo) {
									item1['name'] = item1.productName
									if (item1.packageInfo.packageProduct) {
										item1.packageInfo.packageProduct.forEach((item, index) => {
											item['packageFlag'] = 1 // 套餐内商品标识：0-非套餐内，1-套餐内
											item['setMealNameBack'] = item1.name
											item['name'] = item.productName
											item['coverImg'] = item.productImg
											item['unit'] = ''
											item['price'] = 0
											item['selectNum'] = 1
											item['platformTreeCode'] = ''
											item['treeCode'] = '' // 暂时不知怎么获取
											item['isSetMealStatus'] = true // 是否是套餐内材料
											item['customCategory'] = item.category
											item['packageFlagSwitch'] = true // 默认打开
											item['remark'] = '' // 选择材料备注
											item['id'] = item.productId
											this.pageList.push(item)
										})
									}
								}
							})

							// 设置数据结构
							res.forEach((item) => {
								let packageProduct = this.groupByFields(
									item.packageInfo.packageProduct,
									['category', 'type']
								)
								this.setMealList.push({
									name: item.name,
									list: packageProduct,
									id: item.productId
								})
							})

							// 设置套餐数据左侧分类名称
							this.setMealList.forEach((item) => {
								item.list.forEach((item1) => {
									this.treeList.forEach((item2) => {
										// 初始化左侧分类
										if (item1.type == item2.treeCode) {
											item1['name'] = item2.name
											item1['customCategory'] = '1003'
										}
									})
								})
							})
							if (this.setMealList.length) {
								this.setSetMealTablist()
								this.setSetMealTypeList()
								this.setGroupsMaterialList()
								this.setMealName()
							}
						}
					})
			},
			/**
			 * @description 设置套餐tab
			 * */
			setSetMealTablist() {
				this.setMealList.forEach((item, index) => {
					this.tabList.splice(index, 0, {
						name: item.name,
						customCategory: '1003'
					})
					this.setPlatformcategoryList.unshift(item.name)
				})
				this.tabSelectName = this.setPlatformcategoryList[0]
				this.initTreeCode()
				this.initMoreTypeList()
			},
			/**
			 * @description 初始化套餐左侧分类
			 * */
			setSetMealTypeList() {
				if (this.setMealList[this.current]) {
					this.typeList = this.setMealList[this.current].list
				}
			},
			/**
			 * @description 初始化套餐右侧数据
			 * */
			setGroupsMaterialList() {
				if (this.setMealList[this.current]) {
					let resultList =
						(this.setMealList[this.current].list &&
							this.setMealList[this.current].list[this.typeActive].list) || []
					resultList.forEach((item) => {
						item['typeName'] = item.type
						item['list'] = item.list
					})
					let tempList = []
					resultList.forEach(item => {
						let par = {
							key: item.key,
							type: item.type,
							typeName: item.typeName,
							list: []
						}
						item.list.forEach(item2 => {
							par.list.push(this.createProduct(item2))
						})
						tempList.push(par)
					})
					this.groupsMaterialList = tempList
				}
				this.moreTypeList = []
				this.setMealSubmit()
				this.setListSkuProduct()
			},
			/**
			 * @description 在列表数据中显示套餐名称
			 * */
			setMealName() {
				if (!this.isBudgetSource) {
					let result = deepClone(this.pageList)
					result.forEach((item) => {
						item['setMealName'] = item.setMealNameBack
					})
					this.groupsMaterialList.forEach((item3) => {
						item3.list.forEach((item) => {
							result.forEach((item2) => {
								if (item.id == item2.productId) {
									item['setMealName'] = item2.setMealName
								}
							})
						})
					})
				}
			},
			/**
			 * @description 提交套餐
			 * */
			setMealSubmit() {
				let productIds = this.shoppingCart.map((item) => {
					return item.productId
				})
				this.setMealList.forEach((item) => {
					productIds.push(item.id)
				})
				if (productIds.length == 0) {
					this.groupsMaterialList.forEach((item2) => {
						item2.list.forEach((item3) => {
							item3.data['isAddSetMeal'] = false
						})
					})
					return
				}
				this.groupsMaterialList.forEach((item2) => {
					if (item2.list) {
						item2.list.forEach((item3) => {
							if (
								productIds.includes(item3.data.id) &&
								item3.data.customCategory == '1003'
							) {
								item3.data['isAddSetMeal'] = true
							} else {
								item3.data['isAddSetMeal'] = false
							}
						})
					}
				})
			},
			addPage(even) {
				const hashTableShop = this.createHashShop(this.shoppingCart);
				const targetShop = even.skuId;
				const objShop = hashTableShop[targetShop];
				objShop.selectNum++

			},
			groupByFields(data, properties) {
				if (properties.length === 0) {
					return data
				}
				const [property, ...rest] = properties
				const groups = data.reduce((acc, item) => {
					const key = item[property]
					const group = acc.find((g) => g.key === key)
					if (group) {
						group.list.push(item)
					} else {
						acc.push({
							key,
							type: key,
							list: [item]
						})
					}
					return acc
				}, [])
				return groups.map((group) => ({
					...group,
					list: this.groupByFields(group.list, rest)
				}))
			},
			/**
			 * @description 更新套餐材料的swich开关
			 * @param {string} type  materialList(更新材料列表)  shop(更新购物车)
			 * */
			setPackageFlagSwitch(even, type) {
				if (type == 'materialList' && this.pageList.length > 0) {
					this.groupsMaterialList.forEach((item) => {
						item.list.forEach((item1) => {
							if (item1.skuId == even.skuId) {
								item1.packageFlagSwitch = even.packageFlagSwitch
								item1.packageFlag = even.packageFlagSwitch ? 1 : 0
							}
						})
					})
				} else {
					if (this.shoppingCart.length > 0) {
						const hashTableShop = this.createHashShop(this.shoppingCart);
						const targetShop = even.skuId;
						const objShop = hashTableShop[targetShop];
						if (objShop) {
							objShop.data.packageFlagSwitch = even.packageFlagSwitch
							objShop.data.packageFlag = even.packageFlagSwitch ? 1 : 0
						}
					}
				}
			},
			/**
			 * @description 同步remark
			 * @param {string} type  materialList(更新材料列表)  shop(更新购物车)
			 * */
			syncRemark(type) {
				if (type == 'list') {
					// 列表赋值到购物车
					this.groupsMaterialList.forEach(item => {
						item.list.forEach(item2 => {
							item2.skuList.forEach(item1 => {
								const hashTableShop = this.createHashShop(this.shoppingCart);
								const targetShop = item1.data.skuId;
								const objShop = hashTableShop[targetShop];
								if (objShop) {
									objShop['remark'] = item1.data.remark
								}
							})
						})
					})
				} else {
					// 购物车 赋值搭到列表
					this.shoppingCart.forEach((item3) => {
						this.groupsMaterialList.forEach((item) => {
							const hashTable = this.createHashList(item.list);
							const target = item3.productId;
							const obj = hashTable[target];
							if (obj) {
								obj.skuList.forEach(item2 => {
									if (item2.data.skuId == item3.skuId) {
										item2.data['remark'] = item3.remark
									}
								})
							}
						})
					})
				}
			},
			/**
			 * @description 设置快速预算的开单名称 budgetName 
			 * */
			mulationQuoteDetails() {
				if (!this.pageTypeList.includes('快速预算')) {
					return
				}
				if (!this.option.groupPricesId) {
					return
				}
				this.$httpApi.mulationQuoteDetails({
					id: this.option.groupPricesId
				}).then(res => {
					if (res) {
						this.budgetName = res.name
					}
				})
			},
			/**
			 * @description 同步商品列表数据
			 * @param {Object} even  当前购物车数据 
			 * @param {String} type  减价、删除
			 * */
			syncList(even, type) {
				this.groupsMaterialList.forEach(item => {
					const hashTable = this.createHashList(item.list);
					const target = even.productId;
					const obj = hashTable[target];
					if (obj) {
						if (type == 'delete') {
							obj.skuList = obj.skuList.filter(item2 => item2.data.skuId !== even.skuId)
							// 处理套餐商品
							if (obj.skuList.length == 0 && obj.data.isAddSetMeal) {
								obj.data.isAddSetMeal = false
							}
						} else {
							obj.skuList.forEach(item2 => {
								if (item2.data.skuId == even.skuId) {
									item2.choose = even.selectNum
									this.setChoose(item2)
								}
							})
						}
					}
				})

				this.syncBudgetList(even, type)
				this.syncCustomServiceList(even)
				if (type == 'delete') {
					this.contrastIsSelect()
				}

			},
			/**
			 * @description 同步预算数据
			 * @param {Object} even  当前购物车数据 
			 * @param {String} type  减价、删除
			 * */
			syncBudgetList(even, type) {
				if (this.budgetList.length == 0) {
					return
				}

				this.budgetList.forEach(item => {
					item.groupPrices.forEach(item3 => {
						const hashTable = this.createHashShop(item3.products);
						const target = even.skuId;
						const obj = hashTable[target];
						if (obj) {
							obj.selectNum = type == 'delete' ? 0 : even.selectNum
							if (type == 'delete') {
								obj.operationShow = even.selectNum ? true : false
							}
						}
					})
				})

			},
			/**
			 * @description 创建列表数据的hash表
			 * @param {Array} arr  列表数据 
			 * */
			createHashList(arr) {
				let hashTable = {};
				for (const obj of arr) {
					hashTable[obj.data.id] = obj;
				}
				return hashTable;
			},
			/**
			 * @description 创建购物车数据的hash表
			 * @param {Array} arr  购物车数据 
			 * */
			createHashShop(arr) {
				const hashTable = {};
				for (const obj of arr) {
					hashTable[obj.skuId] = obj;
				}
				return hashTable;
			},
			/**
			 * @description 同步购物车数据
			 * @param {Object} even  当前列表数据 
			 * */
			syncListShopCat(even) {
				if (even.choose == 0 || even.selectNum == 0) {
					let shoppingCart
					if (even.operationShow) {
						const hashTableShop = this.createHashShop(this.shoppingCart);
						const targetShop = this.isBudgetSource ? even.skuId : even.data.skuId;
						const objShop = hashTableShop[targetShop];
						if (objShop) {
							objShop.selectNum = 0
						}
						shoppingCart = this.shoppingCart
					} else {
						if (this.isBudgetSource) {
							shoppingCart = this.shoppingCart.filter(item1 => item1.skuId !== even.skuId)
						} else {
							shoppingCart = this.shoppingCart.filter(item1 => item1.skuId !== even.data.skuId)
						}
					}
					this.$store.commit('setShoppingCart', shoppingCart)
				} else {
					const hashTable = this.createHashShop(this.shoppingCart);
					if (this.isBudgetSource) {
						const target = even.skuId;
						const obj = hashTable[target];
						if (obj) {
							obj.selectNum = even.selectNum
						}
					} else {
						const target = even.data.skuId;
						const obj = hashTable[target];
						if (obj) {
							obj.selectNum = even.choose
						}
					}

				}
			},
			/**
			 * @description 设置材料列表的sku数据
			 * */
			setListSkuProduct() {
				this.shoppingCart.forEach(event => {
					this.groupsMaterialList.forEach(item1 => {
						const hashTable = this.createHashList(item1.list);
						const target = event.productId;
						const obj = hashTable[target];
						if (obj && obj.skuList.length == 0) {
							// 创建sku商品对象
							event.choose = event.selectNum
							let skuProduct = new product(event)
							obj.skuList.push(skuProduct)
						}
					})
				})
			},
			/**
			 * @description 同步商品列表数据
			 * @param {Object} even  当前列表数据 
			 * */
			syncProductList(even) {
				if (even.choose == 0) {
					this.groupsMaterialList.forEach(item => {
						const hashTable = this.createHashList(item.list);
						const target = even.data.productId;
						const obj = hashTable[target];
						if (obj) {
							if (even.operationShow) {
								obj.skuList.forEach(item2 => {
									if (item2.data.skuId == even.data.skuId) {
										item2.choose = ''
									}
								})
							} else {
								obj.skuList = obj.skuList.filter(item2 => item2.data.skuId !== even.data.skuId)
							}
						}
					})
				}
			},
			/**
			 * @description 同步预算数据
			 * @param {Object} even  当前列表数据 
			 * */
			syncBudgetListProduct(even) {
				if (this.budgetList.length == 0) {
					return
				}
				this.budgetList.forEach(item => {
					item.groupPrices.forEach(item3 => {
						const hashTable = this.createHashShop(item3.products);
						const target = even.skuId;
						const obj = hashTable[target];
						if (obj) {
							obj.selectNum = even.selectNum
						}
					})
				})
			},
			/**
			 * @description 同步自定义材料数据
			 * @param {Object} event  当前列表数据 
			 * */
			syncCustomServiceList(event) {
				if (this.customServiceList.length == 0) {
					return
				}
				this.customServiceList.forEach(item => {
					if (item.id == event.skuId) {
						item.selectNum = event.selectNum
					}
				})
			},
			/**
			 * @description 同步自定义商品数据到购物车
			 * @param {Object} even  当前列表数据 
			 * */
			syncCustomDataListShopCat(even) {
				if (even.selectNum == 0) {
					let shoppingCart
					if (even.operationShow) {
						const hashTableShop = this.createHashShop(this.shoppingCart);
						const targetShop = even.skuId;
						const objShop = hashTableShop[targetShop];
						if (objShop) {
							objShop.selectNum = 0
						}
						shoppingCart = this.shoppingCart
					} else {
						shoppingCart = this.shoppingCart.filter(item1 => item1.skuId !== even.skuId)
					}
					this.$store.commit('setShoppingCart', shoppingCart)
				} else {
					const hashTable = this.createHashShop(this.shoppingCart);
					const target = even.skuId;
					const obj = hashTable[target];
					if (obj) {
						obj.selectNum = even.selectNum
					}
				}
			},
			/**
			 * @description 添加自定义商品
			 * */
			getAdd() {
				this.toPage('/pages/publishTask/addWorkItem')
			},
			setMakeUpExpensesStatus(item) {
				this.makeUpExpensesStatus = item
			},
			addByCondition() {
				let tempShoppingCartist = JSON.parse(JSON.stringify(this.shoppingCart))
				if (tempShoppingCartist.length == 0) {
					this.$util.toast('请选择商品')
					return
				}
				let tempResult = []
				tempShoppingCartist.forEach((el) => {
					tempResult.push({
						skuId: el.skuId,
						count: el.selectNum,
						remark: el.remark
					})
				})

				this.$httpApi.addByCondition({
					isDiff: 0, // 	是否补齐费用（1补齐，0未补齐）
					// orderId: this.orderInfo.orderId,
					personId: this.userPersonId,
					projectId: this.projectInfo.projectId,
					skuOrderInputs: tempResult,
					source: 3, // 组合报价来源（1订单，2变更订单，3项目预算，4材料管理，5案例, 6我的报价）
					type: 0, // 类型：0-发单方报价；1-接单方报价
					userId: uni.getStorageSync('userData').sysUser.userId,
					isOverride: 1 // 是否覆盖 
				}).then(res => {
					if (res) {
						this.$util.toast("选择成功,将返回上一页面");
						setTimeout(() => {
							this.goBack()
							this.$store.commit('setShoppingCart', [])
						}, 1500)
					}
				})
			},
			/**
			 * @description 查询自定义材料
			 * */
			getCustomServiceList() {
				if (!this.isProjectBudget) {
					return
				}
				// mall/pmscustomservicepack/getPage
				this.$httpApi.selectCustomService({
					current: 1,
					size: 99
				}).then(res => {
					if (res) {
						res.records.map(item => {
							item['tempPrice'] = item.price
							item['selectNum'] = 0
							item['name'] = item.title
						})
						this.customServiceList = res.records
					}
				})
			},
			/**
			 * @description 常用商品
			 * */
			getSelectCommonlyUser() {
				if (!this.isProjectBudget) {
					return
				}
				let tempList = uni.getStorageSync('CommonlyUserList')
				if (tempList.length > 0) {
					// mall/product/customer/getList
					this.$httpApi.selectCommonlyUser(tempList).then(res => {
						if (res) {
							res.map(item => {
								item['tempPrice'] = item.price
							})
							this.commonlyUserList = res

						}
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-tab-bar {
		border-radius: 16rpx !important;
	}

	.nav-bar-title {
		.u-icon {
			margin-right: 28rpx;
		}

		.search {
			display: flex;
			margin-right: 46rpx;
			padding-left: 38rpx;
			border-radius: 50rpx;
			width: 618rpx;
			background: #f4f4f4;

			.item-search-button {
				justify-content: center;
				border-radius: 0 40rpx 40rpx 0;
				width: 108rpx;
				background-color: $themeColor;
				line-height: 72rpx;
				text-align: center;
				font-size: 28rpx;
				color: #fff;
			}
		}
	}

	.public-input-contain {
		margin: 0 2rpx;
		border: .5px solid #eee;
		// background-color: #F6F6F6;
		border-radius: 4rpx;
		width: 68rpx;
		height: 52rpx;
		font-size: 24rpx;

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
			font-size: $middleFontSize;
			color: $seconFontColor;
		}

		.item-operation {
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1rpx solid #eee;
			border-radius: 4rpx;
			width: 52rpx;
			height: 52rpx;
			background-color: #fff;
		}

		.item-operation-active {
			background-color: $themeColor;
		}

		.item-operation-border-active {
			border-color: $themeColor;
		}
	}

	.add-listing {
		padding: 8rpx 16rpx;
		border-radius: $miniBorderRadius;
		background: $themeColor;
		font-weight: 400;
		font-size: $smallFontSize;
		color: #fff;
	}

	.add-display {
		padding: 8rpx 16rpx;
		border-radius: $miniBorderRadius;
		background: #e3e1e1;
		font-weight: 400;
		font-size: $smallFontSize;
		color: #fff;
	}

	.details-contain {
		.top-contain {
			display: flex;
			// padding-bottom: 20rpx;
			padding: 10rpx 0rpx;
			// width: 100%;


			.type-left {

				/deep/ .u-scroll-box {
					height: 72rpx;
				}
			}

			.type-left-82 {
				width: 82%;
			}

			.type-left-100 {
				width: 100%;
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

		.top-contain-ff {
			background-color: #fff;
		}

		.middle-contain {
			display: flex;
			margin-top: 6rpx;

			.enterprise-services {
				display: flex;
			}

			.left-contain {
				margin-right: 2rpx;
				height: calc(100vh - 284rpx);
				background-color: $bgColor;

				.left-nav-bar {
					width: 202rpx;
					height: 95%;

					.item-contain {
						display: flex;
						flex-direction: row;
						// justify-content: center;
						padding: 50rpx 0rpx 0rpx 20rpx;
						height: 100%;

						.item-bar {
							margin-right: 8rpx;
							border-radius: 10rpx;
							width: 6rpx;
							// transition-duration: 0.5s;
							height: 16rpx;
							opacity: 1;
						}

						.item-bar-active {
							background-color: rgb(0, 47, 165);
						}

						.item-list {
							.item-type {
								display: flex;
								position: relative;
								align-items: center;
								margin-bottom: 66rpx;

								.num {
									display: flex;
									position: absolute;
									right: -20rpx;
									top: -8rpx;
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

							.service-name {
								max-width: 120rpx;
								font-size: $smiddleFontSize;
								color: $mainFontColor;
							}

							.item-type-active {
								font-weight: bold;
								font-size: 30rpx;
								color: #303133;
								transition: transform .4s ease-in-out;
							}
						}
					}
				}
			}

			.right-contain {
				// height: calc(100vh - 380rpx);
				background-color: $bgColor;

				.batch-add {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx 32rpx 0rpx;

					.item-left {
						font-size: 26rpx;
						color: #606166;
					}

					.item-right {
						display: flex;
						align-items: center;
					}

					text {
						margin-right: 10rpx;
						font-size: 24rpx;
						color: #002fa5;
					}

					image {
						width: 20rpx;
						height: 20rpx;
					}
				}

				.right-nav-bar {
					padding: 0rpx 32rpx 0rpx 26rpx;

					height: 95%;

					.item-material-list {
						.item-gropus_name {
							padding-bottom: 20rpx;
							font-size: 28rpx;
							color: $mainFontColor;
						}

						.item-material {
							display: flex;
							flex-direction: column;
							margin-bottom: 28rpx;
							padding-bottom: 30rpx;
							border-bottom: 2rpx solid #f3f3f3;

							.item-select-other {
								display: flex;
							}

							.item-specifications {
								margin-top: 20rpx;

								.item-name {
									font-size: $smallFontSize;
									color: #303133;
								}

								.specifications {
									margin-bottom: 4rpx;
									height: 30rpx;
									font-size: $smallFontSize;
									color: $viceFontColor;
								}
							}

							.select-sku-contain {
								display: flex;
								flex-direction: column;
								margin-top: 20rpx;

								.item-left {
									display: flex;
									flex: 1;
									font-size: 24rpx;
									color: #606166;
									white-space: nowrap;
								}

								.sku-all {
									margin-top: 10rpx;
									width: 100%;

									.item-sku {
										margin-bottom: 12rpx;

										&:last-child {
											margin-bottom: 0rpx;
										}

										.item-sku_contain {
											display: flex;
											justify-content: space-between;
											align-items: center;
											padding: 20rpx;
											border-radius: 10rpx;
											background-color: #f5f6f7;
										}

										.item-text {
											font-size: 24rpx;
											color: #606166;
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
									margin-bottom: 10rpx;
									font-size: $middleFontSize;
									color: $seconFontColor;
								}

								.material-other {
									display: flex;
									justify-content: space-between;

									.set-meal-name {
										font-size: $smallFontSize;
										color: $themeColor;
									}

									.set-meal-sku {
										font-size: $smallFontSize;
										color: $viceFontColor;
										@include bov();
									}

									.left {
										display: flex;
										flex-direction: column;
										max-width: 500rpx;

										.specifications {
											margin-bottom: 4rpx;
											height: 30rpx;
											font-size: $smallFontSize;
											color: $viceFontColor;

										}

										.unit {
											font-size: $smiddleFontSize;
											color: $errorFontColor;

											text {
												font-size: $smiddleFontSize;
												color: $errorFontColor;
											}
										}
									}

									.right {
										display: flex;
										align-items: flex-end;
										white-space: nowrap;
										margin-left: 10rpx;
									}
								}
							}
						}
					}

					.no-material-list {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 60%;

						.item-no {
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
						}

						image {
							margin-bottom: 40rpx;
							width: 142rpx;
							height: 142rpx;
						}

						.desc {
							display: flex;
							flex-direction: column;
							justify-content: center;
						}

						.no-text {
							text-align: center;
							font-size: $middleFontSize;
							color: $seconFontColor;
						}

						.try-text {
							font-size: $smallFontSize;
							color: $viceFontColor;
						}
					}


				}

				.right-nav-bar-80 {
					width: calc(100vw - 200rpx);
				}

				.right-nav-bar-100 {
					width: 100vw;
				}

				.right-nav-bar-padding {
					padding: 30rpx 32rpx 0rpx 26rpx;
				}

				.right-nav-bar_width {
					width: 100vw;
				}
			}
		}
	}

	.item-statistical-specifications {
		display: block;
		overflow: hidden;
		width: 100%;
		text-overflow: ellipsis;
		font-size: 26rpx;
		color: #999;
		white-space: nowrap;
	}


	.more-type {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 32rpx 20rpx 26rpx;

		.left {
			font-size: 28rpx;
			color: #3d3d3d;
			font-weight: bold;
		}

		.right {
			display: flex;
			align-items: center;

			text {
				font-size: 24rpx;
				color: #606166;
			}

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}
	}

	.package-contain {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.switch-contain {
			display: flex;
			align-items: center;
			margin-top: 30rpx;

			.switch-name {
				margin-right: 10rpx;
				font-size: $middleFontSize;
				color: $mainFontColor;
			}
		}

		.item-sku {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.item-text {
				font-size: 24rpx;
				color: #606166;
			}
		}
	}

	.input-contain_textarea {
		margin-top: 12rpx;
		padding: 10rpx 16rpx;
		border-radius: 10rpx;
		background-color: #f6f7f9;

		/deep/ .u-input__input {
			color: #303133;
		}

		.input_textarea {
			border-radius: 8rpx;
			width: 100%;
			height: 100rpx;
			background: #f7f7f7;
			font-size: 28rpx;
		}
	}
</style>
