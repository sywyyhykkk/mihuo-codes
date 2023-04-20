<template>
	<view class="portfolio-price">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="">
			<view slot="default" class="nav-bar-title">
				<view class="search">
					<u-icon name="search" color="#999999" size="28"></u-icon>
					<u-input confirm-type="确定" class="describe-input" :clearable="false" @confirm="getSearch"
						v-model="search" height="72" type="text" @input="setSearch"
						placeholder-style="fontSize:26rpx;color:#999999" placeholder="请输入关键字搜索" :border="false" />
				</view>
			</view>
		</z-nav-bar>
		<view class="details-contain">
			<view class="top-contain">
				<view class="type-left">
					<u-tabs item-width="140" active-color="#002FA5" height="72" inactive-color="#787878" font-size="28"
						:list="tabList" :is-scroll="true" :current="current" :active-item-style="activeItemStyle"
						@change="change" bar-width="28" bar-height="6" bg-color="#f5f5f5"></u-tabs>
				</view>
				<view class="type-right" @click="getAdd()">
					<image src="/static/images/add-house.png" mode=""></image>
					<text class="item-typa-add">添加</text>
				</view>
			</view>
			<view class="middle-contain">
				<!-- 自定义服务(常用、自定义) -->
				<view class="custom-service" v-if="['常用', '自定义'].includes(tabSelectName)">
					<view class="right-contain">
						<scroll-view class="right-nav-bar" :scroll-y="true">
							<view class="item-material-list" v-if="setMaterialList.length > 0">
								<view class="item-material" v-for="(item, index) in setMaterialList" :key="index">
									<image-lazy-load :image="item.coverImg" :key="index" height="120"></image-lazy-load>
									<view class="item-right-material">
										<view class="material-name">
											{{ item.coverImg ? item.name : item.title }}
										</view>
										<view class="material-other">
											<view class="left">
												<text class="specifications"></text>
												<!-- <text class="specifications">规格 60*60</text> -->
												<text class="unit">￥{{ item.price }}/{{ item.unit }}</text>
											</view>
											<view class="right">
												<view v-if="item.operationShow || item.selectNum"
													class="public-item-calculate">

													<view class="item-operation"
														@click="calculate('减', item, current == 1 ? '常用' : '自定义')">
														<u-icon size="24" color="#C4C4C4" name="minus"></u-icon>
													</view>
													<!-- <text class="calculate-num">{{item.selectNum}}</text> -->
													<view class="public-input-contain">
														<u-input @input="setInput($event, item, current == 1 ? '常用' : '自定义')"
															class="public-input-num" input-align="center" height="52"
															v-model="item.selectNum" :clearable="false" type="number"
															placeholder="" :border="false" />
													</view>
													<view class="item-operation"
														@click="calculate('加', item, current == 1 ? '常用' : '自定义')">
														<u-icon size="24" color="#3A3838" name="plus"></u-icon>
													</view>
												</view>
												<view v-else class="add-listing"
													@click="addListing(item, current == 1 ? '常用' : '自定义')">
													加入清单
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view v-else class="no-material-list">
								<view class="item-no">
									<image src="/static/images/sousuo.png" mode=""></image>
									<view class="desc">
										<view class="no-text">没有找到你要的内容</view>
										<view class="try-text">你可以试试增加自定义工作项</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="enterprise-services" v-else>
					<view class="left-contain" v-if="!['全部'].includes(tabSelectName)">
						<scroll-view class="left-nav-bar" :scroll-y="true">
							<view class="item-contain">
								<view class="item-list">
									<view class="item-type" @click="getType(item, index)" :id="'u-tab-item-type-' + index"
										v-for="(item, index) in getTypeListBar" :key="index">
										<view class="item-bar" :class="[typeActive === index ? 'item-bar-active' : '']">
										</view>
										<view class="service-name" :class="[typeActive === index ? 'item-type-active' : '']">
											{{ item.name }}
										</view>
										<text class="num" v-if="item.selectNum">{{ item.selectNum }}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="right-contain">
						<view v-if="moreTypeList.length > 0" class="more-type">
							<text class="left">{{ moreTypeName }}</text>
							<view class="right" @click="getMoreType()">
								<image src="@/static/images/screening_1.png" mode=""></image>
								<text>筛选</text>
							</view>
						</view>
						<scroll-view class="right-nav-bar"
							:class="[moreTypeList.length == 0 && 'right-nav-bar-padding', ['全部'].includes(this.tabSelectName) && 'right-nav-bar-all']"
							:scroll-y="true" :style="{ 'height': resultHeight }" @scrolltolower="scrolltolower">
							<view class="item-material-list" v-if="materialList.length > 0">
								<view class="item-gropus" v-for="(item1, index1) in groupsMaterialList" :key="index1">
									<view class="item-gropus_name">{{ item1.typeName }}</view>
									<view class="item-material" v-for="(item, index) in item1.list" :key="index">
										<view class="item-select-other">
											<image-lazy-load :image="item.coverImg" :key="index" height="120">
											</image-lazy-load>
											<view class="item-right-material">
												<view class="material-name">
													{{ item.name }}
												</view>
												<view class="material-other">
													<view class="left">
														<text class="specifications"></text>
														<text class="unit">￥{{ item.tempPrice }}/{{ item.unit }}</text>
													</view>
													<view class="right">
														<view v-if="item.isAddSetMeal" class="add-display">
															套餐已选
														</view>
														<view v-else class="add-listing"
															@click="addListing(item, setTypeName(item))">
															加入清单
														</view>
													</view>
												</view>
											</view>
										</view>
										<!-- <view class="item-specifications" v-if="item.selectSpecificationsName">
											<text class="item-name">已选：</text>
											<text class="specifications">{{item.selectSpecificationsName}}</text>
										</view> -->
										<!-- <view v-if="item.selectSpecificationsName" class="input-contain_textarea">
											<textarea class="input_textarea" v-model="item.remark" @blur="syncRemark('list')" maxlength="100"
												placeholder="请输入说明"
												placeholder-style="color:#909199;font-size: 13px" />
										</view> -->

										<!-- 已选sku -->
										<view class="select-sku-contain">
											<view class="sku-all">
												<!-- {{item.selectSkuList}} -->
												<view class="item-sku" v-for="(ev, num) in item.selectSkuList" :key="num">
													<view class="item-sku_contain">
														<text class="item-text">{{ ev.skuName }}</text>
														<view class="add-and-subtract">
															<view class="item-operation" @click="calculate('减', ev, ev.type)">
																<u-icon size="24" color="#C4C4C4" name="minus">
																</u-icon>
															</view>
															<view class="public-input-contain">
																<u-input @input="setInput($event, ev, ev.type)"
																	class="public-input-num" input-align="center"
																	height="52" v-model="ev.selectNum" :clearable="false"
																	type="number" placeholder="" :border="false" />
															</view>
															<view class="item-operation" @click="calculate('加', ev, ev.type)">
																<u-icon size="24" color="#3A3838" name="plus">
																</u-icon>
															</view>
														</view>
													</view>
													<!-- 备注 -->
													<view v-if="item.selectSkuList && item.selectSkuList.length > 0"
														class="input-contain_textarea">
														<textarea class="input_textarea" @blur="syncRemark('list')"
															v-model="ev.remark" maxlength="100" placeholder="请输入说明"
															placeholder-style="color:#909199;font-size: 13px" />
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view v-else class="no-material-list">
								<view class="item-no">
									<image src="/static/images/sousuo.png" mode=""></image>
									<view class="desc">
										<view class="no-text">没有找到你要的内容</view>
										<view class="try-text">你可以试试增加自定义工作项</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<view class="bottom-contain">
				<!-- 补齐费用 -->
				<view class="make-up-expenses">
					<view class="item-make-up-expenses">
						<text> 是否计算最低补齐费用</text>
						<u-switch v-model="makeUpExpensesStatus" @change="switchChange" size="30"
							active-color="#002FA5"></u-switch>
					</view>
				</view>
				<view class="bottom-contain-all">
					<view class="left" @click="viewServices()">
						<view class="item-left">
							<image src="@/static/images/material-shopping-cart.png"></image>
							<text class="num" v-if="serviceGoodsList.length">{{ selectService }}</text>
						</view>
						<view class="other">
							<view class="select-num">
								<view class="symbol">￥</view>
								<view>{{ selectServicePice }}</view>
							</view>
							<view class="select-text">查看已选服务</view>
						</view>
					</view>
					<view class="right" @click="addResult()">
						确定添加
					</view>
				</view>
			</view>

			<!-- 已选服务 -->
			<u-popup v-model="selectMaterialListShow" border-radius="30" height="1000" mode="bottom"
				:safe-area-inset-bottom="false" :closeable="true">
				<view class="select-material-list">
					<view class="tittle">
						已选服务
					</view>
					<view class="list-contain">
						<scroll-view :scroll-y="true" class="scroll-Y" :style="{ 'height': listHeight + 'rpx' }"
							@scroll="scroll" @scrolltolower="scrolltolowerCart">
							<!-- :style="{transform: getTransform}" -->
							<view v-if="showList.length > 0" class="item-all-cotain">
								<view class="item-select-material" v-for="(item, index) in showList" :key="index">
									<view class="item-all">
										<view class="item-left">
											<image-lazy-load :viewStatus="false" :image="item.coverImg" :key="index"
												height="120"></image-lazy-load>
											<view class="item-other">
												<view class="item-name">{{ item.productName || item.name }}</view>
												<!-- <view class="item-specifications">{{item.materialSkuName}}</view> -->
												<view class="item-specifications">
													{{ $isJSON(item.productSku) && JSON.parse(item.productSku)[0] &&
														JSON.parse(item.productSku)[0].value }}
												</view>
												<view class="item-specifications"
													v-if="item.makeExpensesShow && makeUpExpensesStatus && Number(item.diffAmount) > 0">
													应补{{ item.diffAmount }}</view>
												<view class="item-unit">￥{{ item.price }}/{{ item.unit }}</view>
											</view>
										</view>
										<view class="item-right">
											<image src="/static/images/delete_icon/delete-service.png" mode=""
												@click="getDelete(item, item.type)">
											</image>
											<view class="item-price">￥{{ item.totalPice }}
											</view>
											<view class="public-item-calculate">
												<view class="item-operation"
													:class="[item.selectNum == 1 ? 'item-operation-display' : '']"
													@click="calculate('减', item, item.type, '', '购物车')">
													<u-icon size="24" color="#C4C4C4" name="minus"></u-icon>
												</view>
												<!-- <text class="calculate-num">{{item.selectNum}}</text> -->
												<view class="public-input-contain">
													<u-input @input="setInput($event, item, item.type)"
														@blur="setBlur($event, item)" class="public-input-num"
														input-align="center" height="52" v-model="item.selectNum"
														:clearable="false" type="number" placeholder="" :border="false" />
												</view>
												<view class="item-operation" @click="calculate('加', item, item.type)">
													<u-icon size="24" color="#3A3838" name="plus"></u-icon>
												</view>
											</view>
										</view>
									</view>
									<view class="input-contain_textarea">
										<textarea class="input_textarea" v-model="item.remark" @blur="syncRemark()"
											maxlength="100" placeholder="请输入说明"
											placeholder-style="color:#909199;font-size: 13px" />
									</view>
								</view>
							</view>

						</scroll-view>
					</view>
					<view class="bottom-add">
						<view class="item-add" @click="addResult()">
							确定
						</view>
					</view>
				</view>
			</u-popup>

			<!-- sku选择 -->
			<material-sku-popup v-model="materialSkuPopupShow" ref="materialSkuPopup" @saveMaterial="saveMaterial"
				:detailId="detailId">
			</material-sku-popup>

			<mihuo-popup ref="mihuoPopup" :title="productCategoryTreeCodeName || '三级分类'" :typeList="getMoreTypeList"
				:singleStatus="true" type="list" height="600" v-model="showPopup" @close="showPopup = false"
				@click="getPopupClick">
			</mihuo-popup>


			<!-- 套餐弹框 -->
			<set-meal-poup v-model="setMealPoup" typeName="预算" @close="setMealPoup = false" @submit="setMealSubmit"
				:detailId="detailId" :treeList="treeList">
			</set-meal-poup>

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
			search: '',
			current: 0,
			typeActive: 0,
			typeList: [],
			materialList: [],
			productCategoryTreeCode: '',
			productCategoryTreeId: '',
			productCategoryTreeCodeName: '',
			selectMaterialListShow: false,
			detailId: '',
			materialSkuPopupShow: false,
			customServiceList: [],
			showPopup: false,
			option: {},
			activeItemStyle: {
				color: '#303133',
				fontSize: '30rpx'
			},
			commonlyUserList: [],
			resultList: [],
			currentCompanyId: '-10',
			tabList: [],
			selectMaterilaActive: {},
			tabSelectName: '',
			makeUpExpensesStatus: false,
			byOfferList: [],
			materialPageSize: 1,
			materialCurrentPageSize: 1,
			materialTotal: 0,
			moreTypeName: '全部',
			moreTypeList: [],
			resultHeight: '1000rpx',
			groupsMaterialList: [],
			moreTypeNameIndex: 0,
			offerForm: {},
			treeList: [],
			setMealPoup: false,
			setMealcustomCategory: ['1003'],
			listHeight: '1000',
			popupHeight: '1000',
			listAll: [], //所有数据
			showList: [], //可视区域显示的数据				
			itemHeight: 360, //每条数据所占高度
			showNum: 6, //每次加载到可视区域的数量，itemHeight X showNum 要可视区域高度 ，否则页面滚动不了。
			top: 0, //偏移量
			scrollTop: 0, //卷起的高度
			startIndex: 0, //可视区域第一条数据的索引
			endIndex: 0, //可视区域最后一条数据后面那条数据的的索引，因为后面要用slice(start,end)方法取需要的数据，但是slice规定end对应数据不包含在里面	
			showList: [],
			pageSize: 5,
			currentPage: 1,
		}
	},
	onLoad(option) {
		this.option = option

	},
	computed: {
		...mapState(['serviceGoodsList', 'serviceCityOperatorId', 'offerDetails', 'projectInfo', 'userPersonId',
			'orderInfo'
		]),
		setMaterialList() {
			if (this.current == 1) {
				return this.commonlyUserList
			} else {
				return this.customServiceList
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
		selectServicePice() {
			let tempPice = []
			this.serviceGoodsList.map(item => {
				tempPice.push(item.totalPice)
				// 应补费用
				if (Number(item.diffAmount) > 0 && this.makeUpExpensesStatus) {
					tempPice.push(item.diffAmount)
				}
			})
			let resultPice = operation.funCalc(tempPice)
			return resultPice
		},
		selectService() {
			let tempNum = 0
			this.serviceGoodsList.map(item => {
				tempNum++
			})
			return tempNum
		},
		getTypeListBar() {
			if (this.search) {
				return [{
					name: '搜索结果'
				}]
			} else {
				return this.typeList
			}
		},
		getMoreTypeList() {
			this.moreTypeList = this.typeList[this.typeActive] && this.typeList[this.typeActive].children || []
			let result = [{
				name: '全部',
				value: '-1'
			}]
			this.moreTypeList.forEach(el => {
				result.push({
					name: el.name,
					value: el.treeCode
				})
			})
			return result || []
		},
		getTransform() {
			return `translate3d(0,${this.top}px,0)`;
		},
	},
	watch: {
		search: {
			handler(newVal, oldVal) {
				this.debounce(() => {
					this.moreTypeNameIndex = 0
					this.materialPageSize = 1
					this.selectMaterialList()
				}, 100)
			},
		}
	},
	onShow() {
		this.getTypeList()
		this.getCustomServiceList()
		this.getSelectCommonlyUser()
		this.getIsDiff()
		this.getArtificialCostList()
	},
	methods: {
		scroll(e) {
			return
			this.scrollTop = e.detail.scrollTop
			this.getShowList()
		},
		//计算可视区域数据
		getShowList() {
			return
			this.startIndex = Math.floor(this.scrollTop / this.itemHeight); //可视区域第一条数据的索引
			this.endIndex = this.startIndex + this.showNum; //可视区域最后一条数据的后面那条数据的索引
			let result = this.serviceGoodsList.filter(item => item.itemShow)
			this.showList = result.slice(this.startIndex, this
				.endIndex) //可视区域显示的数据，即最后要渲染的数据。实际的数据索引是从this.startIndex到this.endIndex-1
			this.top = this.scrollTop - (this.scrollTop % this
				.itemHeight); //在这需要获得一个可以被itemHeight整除的数来作为item的偏移量，这样随机滑动时第一条数据都是完整显示的
		},
		scrolltolowerCart() {
			if (this.showList.length == this.serviceGoodsList.length) {
				return
			} else {
				this.currentPage++
				let start = (this.currentPage - 1) * this.pageSize
				// 结束位置 = 当前页 x 每页的大小
				let end = this.currentPage * this.pageSize
				let list = this.serviceGoodsList.slice(start, end)
				this.showList = [...this.showList, ...list]
			}
		},
		/**
		 * @description 查询补齐费用是否启用
		 * */
		getIsDiff() {
			if (!this.offerDetails.offerId) {
				return
			}
			this.$httpApi.getIsDiff({
				offerId: Number(this.offerDetails.offerId),
			}).then(res => {
				if (res) {
					this.makeUpExpensesStatus = true
					this.switchChange()
				} else {
					this.makeUpExpensesStatus = false
				}
			})
		},
		/**
		 * @description 给添加的材料赋值type(主材、辅材、服务)
		 * */
		setTypeName(item) {
			// let temp = this.tabList.find(ev => ev.treeCode == item.type)
			let platformTreeCode = item.platformTreeCode && item.platformTreeCode.split('-')[0]
			let temp = this.tabList.find(ev => ev.treeCode == platformTreeCode)
			if (temp) {
				return temp.name
			} else {
				return item.type
			}
		},
		setSearch() {
			return
			this.debounce(() => {
				this.current = 0
				this.tabSelectName = '全部'
				this.productCategoryTreeCode = ''
				this.selectMaterialList()
			}, 200)
		},
		getSearch() {
			if (!this.current) {
				this.selectMaterialList()
			}
		},

		/**
		 * @description 查询分类
		 * 1.自定义tab(自定义、常用、全部)
		 * */
		getTypeList() { // 查询分类
			this.$httpApi.getListByTreeCodeTree().then(res => {
				if (res) {
					this.treeList = res
					// 赋值tab类型
					let tempList = []
					res.map(item => {
						tempList.push(item)
					})
					this.tabList = []
					this.tabList = tempList

					this.current = 1
					let tempCode = []

					if (this.option.type == '人工选择') {
						// tempCode = ['1003']
						this.tabList = this.tabList.filter(item => !['1001', '1002'].includes(item.treeCode))
					} else {
						if (this.option.typeName == '预算报价') {
							tempCode = ['1001', '1002', '1003']
						} else {
							// tempCode = ['1001', '1002']
							this.tabList = this.tabList.filter(item => !['1003'].includes(item.treeCode))
						}
					}
					// 只显示人工、主材、辅材(顶部tab)
					// this.tabList = this.tabList.filter(item => tempCode.includes(item
					// 	.treeCode))

					this.tabList.push({
						name: '自定义',
						value: 3
					})
					this.tabList.push({
						name: '常用',
						value: 2
					})
					this.tabList.unshift({
						name: '全部',
						value: 10
					})

					// 赋值左侧类型
					if (this.option.type == '人工选择') {
						let tempTreeCode = this.tabList.find(item => item.treeCode == 1003)
						this.tabList.forEach((el, index) => {
							if (el.treeCode == 1003) {
								this.current = index
								this.tabSelectName = el.name
							}
						})
						this.typeList = tempTreeCode.children || []
					} else {
						if (this.tabList.length > 0) {
							this.typeList = this.tabList[1].children || []
							this.tabSelectName = this.tabList[1].name
						}
					}

					this.typeList.forEach(item => {
						item['selectNum'] = 0
					})
					this.contrastIsSelect()

					if (this.typeList[this.typeActive]) {
						this.productCategoryTreeCode = this.typeList[this.typeActive].treeCode
						this.productCategoryTreeCodeName = this.typeList[this.typeActive].name
						this.productCategoryTreeId = this.typeList[this.typeActive].id
						this.moreTypeList = this.typeList[this.typeActive].children
					} else {
						this.productCategoryTreeCode = this.tabList[1].treeCode
						this.productCategoryTreeCodeName = this.tabList[1].name
						this.productCategoryTreeId = this.tabList[1].id
					}


					if (this.serviceCityOperatorId) {
						this.selectMaterialList()
					} else {
						this.setCurrentCompanyId()
					}

					// 设置分页默认值
					this.initPageSize()
				}
			})
		},
		/**
		 * @description 根据type 选中相应分类
		 * */
		setOptionType() {

		},
		/**
		 * @description 左侧分类(二级分类)，选择材料个数
		 * */
		contrastIsSelect() {
			let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
			if (tempList.length > 0) {
				if (this.typeList.length > 0) {
					this.typeList.map(item => {
						item['selectNum'] = 0
						this.serviceGoodsList.map(el => {
							if (el.platformTreeCode) {
								if (el.platformTreeCode.includes(item.treeCode)) {
									item['selectNum']++
								}
							}
						})
					})
				}
			} else {
				this.typeList.map(item => {
					item['selectNum'] = 0
				})
			}
		},
		/**
		 * @description 通过城市运营商id，查询出公司id
		 * */
		setCurrentCompanyId() {
			this.$http.get(`admin/cityoperator/${uni.getStorageSync('cityOperatorId')}`).then(res => {
				if (res) {
					this.currentCompanyId = res.id
					this.selectMaterialList()
				}
			})
		},
		/**
		 * @description 修改报价、变更金额时获取订单上的companyId，在退出订单详情时清除serviceCityOperatorId
		 *  sop订单添加变更记录时获取项目上的companyId，后续同上
		 *  服务者发单时取当前城市运营商id	
		 * */
		setCityOperatorId() {
			if (this.serviceCityOperatorId) {
				return this.serviceCityOperatorId
			} else {
				return this.currentCompanyId
			}
		},
		scrolltolower() {
			let itemTab = this.tabList.find(item => item.name == this.tabSelectName)
			if (itemTab) {
				if (this.materialList.length < itemTab.materialTotal) {
					itemTab.materialPageSize++
					this.materialPageSize = itemTab.materialPageSize
					this.selectMaterialList()
				}
			}
		},
		/**
		 * @description 根据分类查询商品
		 * 1.sorting 排序字段
		 * */
		selectMaterialList() { // 根据分类查询商品
			this.$httpApi.selectCustomerPage({
				productCategoryTreeCode: this.search ? this.productCategoryTreeCode.split("-")[0] : this
					.productCategoryTreeCode,
				keyword: this.search,
				// companyId: this.setCityOperatorId(),
				cityOperatorId: uni.getStorageSync('cityOperatorId'),
				cityOperatorFlag: 2, // 	1=仅运营商商品，2=运营商及其下企业商品
				size: 20,
				verifyStatus: 1, // 审核通过
				current: this.materialPageSize || 1,
				// customCategory:'1002',// type=1001商品，type=1002服务、type=1003服务包
				// cityOperatorId: '38'
			}).then(res => {
				if (res) {
					res.records.map(item => {
						item['tempPrice'] = item.price
						item['remark'] = '' // 选择材料备注
					})
					// this.materialList = res.records
					let itemTab = this.tabList.find(item => item.name == this.tabSelectName)
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

					this.serviceGoodsList.map(item => {
						this.materialList.map(el => {
							if (item.id == el.id) {
								el['selectNum'] = item.selectNum
							}
							if (el.selectNum) {
								el['sorting'] = 1
							} else {
								el['sorting'] = 2
							}
						})
					})
					this.materialList.sort(this.sortArr('sorting'))
					this.contrastIsSelect()
					this.setGroupsMaterial()
					this.setSpecifications()
					this.getRightHeight()
				}
			})
		},
		/**
		 * @description 二级分类筛选
		 * */
		getType(item, index) {
			this.typeActive = index
			this.productCategoryTreeCode = item.treeCode
			this.productCategoryTreeCodeName = item.name
			this.getTabRect()
			this.moreTypeName = '全部'
			this.moreTypeList = this.typeList[this.typeActive] && this.typeList[this.typeActive].children || []
			this.initPageSize()
			this.materialPageSize = 1
			this.moreTypeNameIndex = 0
			this.initPageSize()
			this.selectMaterialList()
		},
		sortArr(attr) {
			return function (a, b) {
				return a[attr] - b[attr]
			}
		},
		/**
		 * @description 自定义服务
		 * */
		getCustomServiceList() {
			this.$httpApi.selectCustomService({
				current: 1,
				size: 999
			}).then(res => {
				if (res) {
					res.records.map(item => {
						item['tempPrice'] = item.price
						item['name'] = item.title
					})
					this.customServiceList = res.records
					this.serviceGoodsList.map(item => {
						this.customServiceList.map(el => {
							if (item.type == '自定义') {
								if (item.id == el.id) {
									el['selectNum'] = item.selectNum
								}
								if (el.selectNum) {
									el['sorting'] = 1
								} else {
									el['sorting'] = 2
								}
							}
						})
					})
					this.customServiceList.sort(this.sortArr('sorting'))
				}
			})
		},
		/**
		 * @description 常用商品
		 * */
		getSelectCommonlyUser() {
			let tempList = uni.getStorageSync('CommonlyUserList')
			if (tempList.length > 0) {
				this.$httpApi.selectCommonlyUser(tempList).then(res => {
					if (res) {
						res.map(item => {
							item['tempPrice'] = item.price
						})
						this.commonlyUserList = res
						this.serviceGoodsList.map(item => {
							this.commonlyUserList.map(el => {
								if (item.type == '常用') {
									if (item.id == el.id) {
										el['selectNum'] = item.selectNum
									}
									if (el.selectNum) {
										el['sorting'] = 1
									} else {
										el['sorting'] = 2
									}
								}
							})
						})
						this.commonlyUserList.sort(this.sortArr('sorting'))
					}
				})
			}
		},
		/**
		 * @description 按工种组装数据，自定义服务默认为自定义分组
		 * */
		analysisData(list) {
			if (list.length > 0) {
				let tempList = JSON.parse(JSON.stringify(list))
				tempList.map(item => {
					item['allTotalPiceList'] = []
					item['diffAmountList'] = []
					if (!item.skillType) {
						item.type = '自定义'
					}
					if (item.type == '自定义') {
						item['skillType'] = -1
					}

				})
				let tempListResult = this.setAnalysisData(tempList)
				// 根据工种统计价格
				tempListResult.map(item => {
					if (item.list.length > 0) {
						item.list.map(ev => {
							// 1.数量*价格
							item['allTotalPiceList'].push(operation.floatMul(ev.selectNum, ev
								.tempPrice || 0))
							// 补齐费用
							if (ev.diffAmount) {
								item['diffAmountList'].push(ev.diffAmount)
							}
						})
						// 2.价格相加
						item['totalPrice'] = operation.funCalc(item.allTotalPiceList)
						item['diffAmount'] = operation.funCalc(item.diffAmountList)

					}
				})
				return tempListResult
			} else {
				return []
			}
		},
		/**
		 * @description 按工种分组
		 * */
		setAnalysisData(result) {
			let map = {}
			let dest = []
			let resultList = []
			result.forEach(item => {
				if (!map[item.skillType]) {
					dest.push({
						skillType: item.skillType,
						skillTypeName: item.skillTypeName,
						totalPrice: '',
						topId: item.topId,
						businessTypeName: item.type,
						allTotalPiceList: [],
						diffAmountList: [],
						list: [item],
						groupPricesId: item.groupPricesId,
						totalSkuPic: [operation.floatMul(item.selectNum, item.materialSkuPic)]
					})
					map[item.skillType] = item
				} else {
					dest.forEach(el => {
						if (el.skillType == item.skillType) {
							el.list.push(item)
							el.totalSkuPic.push(operation.floatMul(item.selectNum, item
								.materialSkuPic))
						}
					})
				}

			})
			resultList = [...dest]
			return resultList
		},
		/**
		 * @description 按材料分组
		 * 1.按分类 主材、辅材、人工 分组  type
		 * 2.按材料类型分组(例如：地砖、吊灯) productCategoryName
		 * */
		setMaterialType(result, itemType) {
			let map = {}
			let dest = []
			let resultList = []
			result.forEach(item => {
				if (!map[item[itemType]]) {
					dest.push({
						type: item[itemType],
						materialType: item.type,
						topId: item.topId,
						totalPrice: '',
						businessTypeName: item[itemType],
						businessTypeId: item.platformCategoryId,
						allTotalPiceList: [],
						diffAmountList: [],
						list: [item],
						groupPricesId: item.groupPricesId,
					})
					map[item[itemType]] = item
				} else {
					dest.forEach(el => {
						if (el.type == item[itemType]) {
							el.list.push(item)
						}
					})
				}

			})
			resultList = [...dest]
			return resultList
		},
		viewServices() {
			if (this.serviceGoodsList.length == 0) {
				this.$util.toast('请添加商品')
				return
			}
			this.selectMaterialListShow = !this.selectMaterialListShow
			if (this.selectMaterialListShow) {
				// this.getShowList()
				this.pageSize = 5
				this.currentPage = 1
				this.showList = this.serviceGoodsList.slice(this.currentPage - 1, this.pageSize)
				this.getHeight()
			}
		},
		change(index) {
			this.tabSelectName = this.tabList[index].name
			this.current = index
			this.moreTypeName = '全部'
			this.typeActive = 0
			if (!['常用', '自定义'].includes(this.tabSelectName)) {
				let tempList = this.tabList[index]
				this.typeList = tempList.children || []
				// this.typeList = tempList.children || []
				if (this.tabSelectName == '全部') {
					this.productCategoryTreeCode = ''
					this.productCategoryTreeCodeName = ''
					this.productCategoryTreeId = ''
				} else {
					let tempResult = tempList.children && tempList.children.length > 0 && tempList
						.children[0]
					if (tempResult) {
						this.productCategoryTreeCode = tempResult.treeCode
						this.productCategoryTreeCodeName = tempResult.name
						this.productCategoryTreeId = tempResult.id
					} else {
						this.productCategoryTreeCode = tempList.treeCode
						this.productCategoryTreeCodeName = tempList.name
						this.productCategoryTreeId = tempList.id
					}
				}
				this.materialPageSize = 1
				this.moreTypeNameIndex = 0
				this.initPageSize()
				this.selectMaterialList()
			}
		},
		getTabRect() {
			let query = uni.createSelectorQuery().in(this);
			for (let i = 0; i < this.typeList; i++) {
				query.select(`#u-tab-item-type-${i}`).fields({
					size: true,
					rect: true
				});
			}
			query.exec((res) => { });
		},
		setBlur(even, item) {
			if (!even) {
				this.calculate('', item, item.type, 1)
			}
		},
		setInput(even, item, typeName) {
			this.debounce(() => {
				even = even.replace(/[^\d]/g, "")
				this.calculate('', item, typeName, Number(even))
			}, 200)
		},
		/**
		 * @description 显示当前材料已选的规格
		 * */
		setSpecifications() {
			let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
			this.materialList.map(el => {
				el['selectSpecifications'] = []
				el['selectSpecificationsName'] = ''
				el['selectSkuList'] = []
			})
			// this.serviceGoodsList.map(item => {
			// 	this.materialList.map(el => {
			// 		if (item.productId == el.id) {
			// 			// el['selectSpecifications'].push(`${item.materialSkuName}/${item.selectNum}`)
			// 			el['selectSpecifications'].push(
			// 				`${this.$isJSON(item.productSku) && JSON.parse(item.productSku)[0]&& JSON.parse(item.productSku)[0].value}/${item.selectNum}`
			// 			)
			// 			el['selectSpecificationsName'] = el['selectSpecifications'].join('、')
			// 		}
			// 	})
			// })
			this.serviceGoodsList.map(item => {
				this.groupsMaterialList.map(item2 => {
					item2.list.map(el => {
						// 商品ID相同
						if (item.productId == el.id) {
							let tempSku = item.productSku && JSON.parse(item.productSku)[
								0] && JSON.parse(item
									.productSku)[0].value
							if (item.productSku) {
								el['selectSkuList'].push({
									skuName: tempSku,
									selectNum: item.selectNum,
									skuId: item.skuId,
									type: item.type,
									remark: item.remark,
									materialSkuId: item.skuId
								})
							}
						}
					})
				})
			})

		},
		saveMaterial(item) {
			if (item.typeName == '新增') {
				let tempList = this.serviceGoodsList.length > 0 ? JSON.parse(JSON.stringify(this.serviceGoodsList)) :
					[]
				item['selectNum'] = item.selectNum
				item['totalPice'] = operation.floatMul(item.selectNum, item.materialSkuPic || 0)
				item['type'] = this.selectMaterilaActive.type
				item['price'] = item.materialSkuPic
				item['materialSkuId'] = item.materialSkuId
				item['tempPrice'] = item.materialSkuPic
				item['remark'] = '' // 材料备注
				this.typeList.forEach(el => {
					if (item.platformTreeCode.includes(el.treeCode)) {
						item['categroyId'] = el.id
						item['topId'] = el.treeCode.split("-")[0]
						item['categroyName'] = el.name
					}
				})

				// item['categroyId'] = this.productCategoryTreeId
				// item['topId'] = this.productCategoryTreeCode.split("-")[0]
				// item['categroyName'] = this.productCategoryTreeCodeName

				// 添加新材料时id赋值空，避免编辑出错
				item['id'] = ''
				tempList.push(item)
				this.$store.commit('setServiceGoodsList', tempList)
			}
			this.contrastIsSelect()
			this.setSpecifications()
			this.calculateMakeUpExpenses()
		},
		addListing(item, type) {
			if (type == '自定义') {
				let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
				item['selectNum'] = 1
				item['totalPice'] = 1 * item.tempPrice
				item['type'] = type
				item['operationShow'] = ''

				item['categroyId'] = this.productCategoryTreeId
				item['topId'] = this.productCategoryTreeCode.split("-")[0]
				item['categroyName'] = this.productCategoryTreeCodeName

				tempList.push(item)
				this.$store.commit('setServiceGoodsList', tempList)
				this.contrastIsSelect()
			} else {
				// 套餐
				if (this.setMealcustomCategory.includes(item.customCategory)) {
					if (item.isSetMealStatus) { // 添加套餐内材料
						item['id'] = item.productId
						this.saveProduct(item)
						this.setSpecifications()
					} else {
						this.detailId = item.id
						this.setMealPoup = !this.setMealPoup
					}
				} else {
					item['type'] = type
					item['operationShow'] = ''
					this.selectMaterilaActive = item
					this.getSku()
				}
			}
		},
		getSku() {
			this.materialSkuPopupShow = true
			this.detailId = this.selectMaterilaActive.id
			setTimeout(() => {
				this.$refs.materialSkuPopup.show()
			}, 50)
		},
		calculate(type, even, typeName, operationNumber, operationName) {
			let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
			let tempSelect
			if (typeName == '自定义') {
				tempSelect = tempList.filter(ev => ev.id == even.id)
			} else {
				tempSelect = tempList.filter(ev => ev.materialSkuId == even.materialSkuId)
			}
			if (tempSelect.length > 0) {
				tempSelect = tempSelect.find(el => el.type == typeName)
				if (tempSelect) {
					if (type == '加') {
						tempSelect.selectNum++
						tempSelect['operationShow'] = false
					} else if (type == '减') {
						if (tempSelect.selectNum > 0) {
							// 购物车加减时
							if (operationName) {
								if (tempSelect.selectNum == 1) {
									this.$util.toast("数量不能为0");
									return
								}
							}

							tempSelect.selectNum--
						}
						tempSelect['operationShow'] = false
					} else {
						if (!operationNumber) {
							tempSelect['operationShow'] = true
							operationNumber = ''
						}
						tempSelect.selectNum = operationNumber
					}
				}
			}
			// if (['人工', '主材', '辅材', '服务', '服务包'].includes(typeName)) {
			// 	tempList.forEach(item => {
			// 		this.materialList.forEach(el => {
			// 			if (item.id == el.id && item.type == typeName) {
			// 				el['selectNum'] = item.selectNum
			// 				el['operationShow'] = item.operationShow
			// 			}
			// 		})
			// 	})
			// }
			tempList.map(item => {
				switch (typeName) {
					case '常用':
						this.commonlyUserList.map(el => {
							if (item.materialSkuId == el.materialSkuId && item.type == typeName) {
								el['selectNum'] = item.selectNum
								el['operationShow'] = item.operationShow
							}
						})
						break
					case '自定义':
						this.customServiceList.map(el => {
							if (item.id == el.id && item.type == typeName) {
								el['selectNum'] = item.selectNum
								el['operationShow'] = item.operationShow
							}
						})
						break
				}
				// 购物车
				if (!tempSelect) {
					return
				}
				if (even.materialSkuId == item.materialSkuId) {
					if (item.type == typeName) {
						item.selectNum = tempSelect.selectNum
						item.operationShow = tempSelect.operationShow
						item.totalPice = operation.floatMul(tempSelect.selectNum, tempSelect.tempPrice ||
							0)
					}
				}
			})
			// tempList = tempList.filter(item => item.selectNum != 0)
			tempList = tempList.filter(item => item.operationShow || item.selectNum > 0)
			tempList.forEach(el => {
				el['budgetNum'] = el.selectNum
			})
			this.$store.commit('setServiceGoodsList', tempList)
			this.showList = this.serviceGoodsList.slice(this.currentPage - 1, this.pageSize)


			this.contrastIsSelect()
			this.setSpecifications()
			this.calculateMakeUpExpenses()
			this.$forceUpdate()
		},
		getDelete(item, type) {
			let tempList = this.serviceGoodsList
			if (type == '自定义') {
				tempList.map(ev => {
					if (ev.id == item.id && ev.type == type) {
						ev['delete'] = true
					}
				})
			} else {
				tempList.map(ev => {
					if (ev.materialSkuId == item.materialSkuId && ev.type == type) {
						ev['delete'] = true
					}
				})
			}

			tempList = tempList.filter(ev => ev.delete !== true)

			console.log('tempList', tempList);


			this.$store.commit('setServiceGoodsList', tempList)
			this.showList = this.serviceGoodsList.slice(this.currentPage - 1, this.pageSize)
			this.contrastIsSelect()
			// 自定服务列表
			if (this.customServiceList.length > 0) {
				this.customServiceList.map(el => {
					if (item.type == '自定义') {
						if (item.id === el.id) {
							el['selectNum'] = 0
						}
					}

				})
			}
			// 人工
			if (this.materialList.length > 0) {
				this.materialList.map(el => {
					// if (item.type == '人工') {
					if (item.id == el.id) {
						el['selectNum'] = 0
					}
					// }
				})
			}
			// 常用
			if (this.commonlyUserList.length > 0) {
				this.commonlyUserList.map(el => {
					if (item.type == '常用') {
						if (item.id == el.id) {
							el['selectNum'] = 0
						}
					}
				})
			}

			// 关闭弹框
			if (tempList.length == 0) {
				this.selectMaterialListShow = !this.selectMaterialListShow
			}

			this.contrastIsSelect()
			this.setSpecifications()
			this.switchChange()
		},
		getAdd() {
			this.toPage('/pages/publishTask/addWorkItem')
		},
		/**
		 * @description
		 * 入口：1.项目经理、项目管家报价  2.其他工种报价  3.sop 预算报价
		 * 
		 * */
		addResult() {
			let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
			tempList = tempList.filter(item => item.selectNum != 0)
			if (this.option.typeName == '预算报价') {
				// this.addOffer(tempList)
				this.addByCondition()
			} else {
				if (this.offerDetails.offerId) {
					this.addOffer(tempList)
				} else {
					this.$store.commit('setServiceGoodsList', tempList)
					this.goBack()
				}
			}
		},
		addByCondition() {
			let skuOrderInputs = this.serviceGoodsList.map(item => {
				return {
					count: item.selectNum,
					skuId: item.skuId
				}
			})
			this.$httpApi.addByCondition({
				isDiff: 0, // 	是否补齐费用（1补齐，0未补齐）
				orderId: this.orderInfo.orderId,
				personId: this.userPersonId,
				projectId: this.projectInfo.projectId,
				skuOrderInputs: skuOrderInputs,
				source: 3, // 组合报价来源（1订单，2变更订单，3项目预算，4材料管理，5案例, 6我的报价）
				type: 1, // 类型：0-发单方报价；1-接单方报价
				userId: uni.getStorageSync('userData').sysUser.userId,
				isOverride: 1 // 是否覆盖 
			}).then(res => {
				if (res) {
					this.$util.toast("选择成功,将返回上一页面");
					setTimeout(() => {
						this.goBack()
					}, 1500)
				}
			})
		},
		/**
		 * @description 添加报价信息保存到本地store
		 */
		addOffer(list) {
			let tempList = []
			let materialList = []
			let tempArtificialList = []
			let tempMaterialList = []
			let resutlArtificialList = [] //  材料数据
			let resutlMaterialListList = [] // 人工 (人工、服务、自定义)
			// 1.按分类 主材、辅材、人工 分组
			let dataAll = this.setMaterialType(list, 'type')
			if (dataAll.length > 0) {
				tempArtificialList = dataAll.filter(item => ['人工', '服务', '服务包', '自定义'].includes(item.type))
				tempMaterialList = dataAll.filter(item => ['主材', '辅材', '辅料'].includes(item.type))
				if (tempArtificialList.length > 0) {
					tempArtificialList.forEach(el => {
						el.list.forEach(ev => {
							resutlArtificialList.push(ev)
						})
					})
				}
				if (tempMaterialList.length > 0) {
					tempMaterialList.forEach(el => {
						el.list.forEach(ev => {
							resutlMaterialListList.push(ev)
						})
					})
				}
				// 2.按材料类型分组(例如：地砖、吊灯)
				materialList = this.setMaterialType(resutlMaterialListList, 'productCategoryName')
				// 3.按材料类型统计价格
				materialList = this.setMaterialPrice(materialList)
			}
			// 4.按工种分组(人工、服务、服务包)
			let resultList = this.analysisData(resutlArtificialList)

			// 人工主项相关
			resultList.map(item => {
				tempList.push({
					skillType: item.skillType,
					skillTypeName: item.skillTypeName,
					totalPrice: item.totalPrice,
					businessName: item.businessName,
					businessTypeName: item.businessTypeName,
					topId: item.topId,
					diffAmount: item.diffAmount,
					productSku: item.productSku,
					companyId: item.companyId,
					companyName: item.companyName,
					id: item.groupPricesId, // 编辑时使用
					products: [],
				})
			})


			// 人工相关子项
			resultList.map(ev => {
				tempList.map(el => {
					if (ev.skillType == el.skillType) {
						ev.list.map(item => {
							el.products.push({
								type: item.type, // 人工
								productName: item.name,
								productId: item.productId,
								budgetNum: item.selectNum,
								quantity: 0,
								// quantity: item.selectNum,
								price: item.tempPrice,
								// totalPice: item.totalPice,
								totalPice: 0,
								totalAmount: item.totalPice,
								pendAmount: 0, // 未付金额
								productImg: item.coverImg,
								platformTreeCode: item.platformTreeCode, // 二级分类code
								categroyId: item.categroyId, // 二级分类id
								skuId: item.materialSkuId, // 材料skuId
								// productSku: item.materialSkuName, // sku value
								categroyName: item.categroyName, // 二级分类名称
								id: item.id, // 子项id,编辑时使用
								diffAmount: item.diffAmount, // 补齐金额
								productSku: item.productSku, // sku value
								companyId: item.companyId, // 公司id
								companyName: item.companyName, // 公司名称
								remark: item.remark // 备注
							})
						})
					}
				})
			})

			let tempForm = {
				id: this.offerDetails.offerId,
				groupPrices: tempList
			}

			let resultOfferList = []
			if (tempList.length > 0) {
				//添加人工相关主项
				tempList.forEach(el => {
					resultOfferList.push({
						businessId: el.skillType, // 业务id			
						businessName: el.skillTypeName || '其他', // 业务名称			
						businessType: 1, //	业务分类 1人工，2材料    人工包含人工、服务、服务包		
						products: el.products,
						source: 4, // 1订单，2变更订单，3项目预算，4材料管理）
						// totalPrice: el.totalPrice,
						totalPrice: 0,
						totalAmount: el.totalPrice, // 商品总金额
						pendAmount: 0, // 未付金额
						diffAmount: el.diffAmount, // 补齐金额
						topName: el.businessTypeName,
						topId: el.topId,
						id: el.id, // 编辑时使用
						type: 1 // 0-发单方报价；1-接单方报价 
					})
				})
			}

			// 材料主项
			if (materialList.length > 0) {
				materialList.forEach(el => {
					resultOfferList.push({
						businessId: el.businessTypeId, // 业务id	商品信息上的	platformCategoryId		
						businessName: el.businessTypeName, // 业务名称	商品信息上的	platformCategoryName
						businessType: 2, // 业务分类 1人工，2材料   
						productJson: '', // 商品json
						products: [],
						productList: el.list,
						source: 4, // 1订单，2变更订单，3项目预算，4材料管理）
						// totalPrice: el.totalPrice,
						totalPrice: 0,
						topName: el.materialType,
						topId: el.topId,
						type: 1, // 0-发单方报价；1-接单方报价 
						id: el.groupPricesId, // 编辑时使用
						totalAmount: el.totalAmount, // 商品总金额
						diffAmount: el.diffAmount, // 补齐金额	
						pendAmount: 0, // 未付金额
					})
				})
			}
			// 材料子项
			resultOfferList.forEach(el => {
				if (el.businessType == 2) {
					el.productList.forEach(item => {
						el.products.push({
							id: item.id, // 编辑时使用
							price: item.price,
							productId: item.productId,
							budgetNum: item.selectNum, // 预算数量
							// quantity: item.selectNum,
							quantity: 0,
							categroyId: item.categroyId, // 二级分类id
							categroyName: item.categroyName, // 二级分类name
							platformTreeCode: item.platformTreeCode, // 二级分类code
							productName: item.name,
							productImg: item.coverImg,
							skuId: item.materialSkuId,
							// productSku: item.materialSkuName,
							productSku: item.productSku,
							diffAmount: item.diffAmount, // 补齐金额
							companyId: item.companyId,
							companyName: item.companyName,
							// totalPrice: operation.floatMul(item.selectNum, item.price ||
							// 	0),
							totalPrice: 0,
							pendAmount: 0, // 未付金额
							totalAmount: operation.floatMul(item.selectNum, item.price || 0),
							remark: item.remark // 备注

						})
					})
				}
			})
			resultOfferList.forEach(el => {
				el.productList = []
			})
			// if (resultOfferList.length == 0) {
			// 	this.$util.toast("请选择商品");
			// 	return
			// }

			if (this.option.typeName == '预算报价') {
				resultOfferList.forEach(el => {
					el['personId'] = this.userPersonId
					el['orderId'] = this.orderInfo.orderId
					el['expectedPrice'] = el.totalPrice
					el['source'] = 3
				})

				resultOfferList.forEach(el => {
					el.totalPrice = el.totalAmount
				})

				this.$httpApi.createGroupPrice({
					id: this.projectInfo.projectId,
					groupPrices: resultOfferList,
				}).then(res => {
					if (res) {
						this.$util.toast("选择成功,将返回上一页面");
						setTimeout(() => {
							this.goBack()
						}, 1500)
					}
				})
			} else {
				// 根据竞价id设置是否需要补齐费用
				// debugger
				// return
				this.$httpApi.putIsDiff({
					offerId: Number(this.offerDetails.offerId),
					isDiff: this.makeUpExpensesStatus ? 1 : 0
				}).then(res => {

				})
				this.$httpApi.addGroupPriceByOfferId({
					groupPrices: resultOfferList,
					id: this.offerDetails.offerId,
				}).then(res => {
					if (res) {
						this.$store.commit('setServiceGoodsList', [])
						this.contrastIsSelect()
						setTimeout(() => {
							this.goBack()
						}, 500)
					} else {
						this.$util.toast("选择成功,将返回上一页面");
						setTimeout(() => {
							this.goBack()
						}, 500)
					}
				})
			}
		},
		setMaterialPrice(list) {
			list.map(item => {
				if (item.list.length > 0) {
					item.list.map(ev => {
						item['allTotalPiceList'].push(operation.floatMul(ev.selectNum, ev.price || 0))
						item['diffAmountList'].push(ev.diffAmount)
					})
					// item['totalPrice'] = operation.funCalc(item.allTotalPiceList)
					item['totalPrice'] = 0
					item['totalAmount'] = operation.funCalc(item.allTotalPiceList)
					item['diffAmount'] = operation.funCalc(item.diffAmountList)
				}
			})
			return list
		},
		preview(url) {
			uni.previewImage({
				current: 0,
				urls: [url],
				loop: true,
				indicator: 'number'
			});
		},
		/**
		 * @description 计算补齐费用
		 * 加、减
		 * */
		calculateMakeUpExpenses() {
			this.debounce(() => {
				this.switchChange('calculate')
			}, 200)
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
					this.byOfferList = res
				}
			})
		},
		getPopupClick(event) {
			let {
				item,
				index
			} = event
			let treeCode = item.name == '全部' && this.typeList[this.typeActive] && this.typeList[this.typeActive]
				.treeCode
			this.productCategoryTreeCode = item.name == '全部' ? treeCode : item.value
			this.moreTypeName = item.name
			this.moreTypeNameIndex = index
			this.selectMaterialList()
		},
		/**
		 * @description 补齐费用
		 * 规则见 tfs #26253
		 * 
		 * */
		switchChange(type) {
			let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
			if (type !== 'calculate') {
				if (!this.makeUpExpensesStatus) {
					this.$store.commit('setServiceGoodsList', tempList)
					return
				}
			}
			let tempmaterialList = []
			let ids = []
			let artificial = []
			let maxCostList = []
			let resultList = []

			let materialIds = []
			let artificialIds = []
			tempList.forEach(el => {
				ids.push(el.productId)
			})

			if (tempList.length == 0) {
				this.makeUpExpensesStatus = false
				return
			}

			if (ids.length == 0) {
				return
			}

			this.$httpApi.selectCommonlyUser(ids).then(res => {
				if (res) {
					// 1.材料 =》单个材料的补齐费用 = minAmount - price

					// 1.1初始化字段
					res.forEach(el => {
						el['totalSkuPicList'] = []
						el['totalSkuPic'] = ''
					})

					// 1.2同一个材料商品、不同sku，计算总价
					res.forEach(el => {
						tempList.forEach(ev => {
							if (el.id == ev.productId) {
								el['totalSkuPicList'].push(operation.floatMul(ev.selectNum, ev
									.materialSkuPic))
								el['totalSkuPic'] = operation.funCalc(el['totalSkuPicList'])
							}
						})
					})


					res.forEach(el => {
						tempList.forEach(ev => {
							if (el.id == ev.productId) {
								if (['主材', '辅材', '辅料'].includes(ev.type)) {
									// 商品总价小于商品最低价才显示补齐费用
									if (Number(el.totalSkuPic) < Number(el.minAmount)) {
										if (!artificialIds.includes(el.id)) {
											artificialIds.push(el.id)
											ev['diffAmount'] = operation.floatSub(el.minAmount,
												el.totalSkuPic)
										}
									} else {
										ev['diffAmount'] = ''
									}

								} else if (ev.type == '人工') {
									// 2.人工服务分组
									maxCostList.push({
										id: el.id,
										minAmount: el.minAmount,
										skillType: el.skillType,
										materialSkuPic: ev.materialSkuPic,
										selectNum: ev.selectNum
									})
								}
							}
						})
					})
					// 3.同工种最高补齐价格
					maxCostList = maxCostList.sort(this.sortArr('minAmount'))
					let artificialGrouping = this.analysisData(maxCostList)
					artificialGrouping.forEach(el => {
						if (el.list) {
							resultList.push({
								minAmount: el.list[0].minAmount,
								id: el.list[0].id,
								totalSkuPic: operation.funCalc(el.totalSkuPic)
							})
						}
					})
					tempList.forEach(ev => {
						if (ev.type == '人工') {
							resultList.forEach(el => {
								if (el.id == ev.productId) {
									// 当前工种最高应补价格
									if (el.totalSkuPic < el.minAmount) {
										if (!materialIds.includes(el.id)) {
											materialIds.push(el.id)
											ev['diffAmount'] = operation.floatSub(el.minAmount,
												el.totalSkuPic)
										}
									} else {
										ev['diffAmount'] = ''
									}
								} else {
									// 避免添加时出错
									ev['diffAmount'] = ''
								}
							})
						}
					})

					tempList.map(item => {
						if (Number(item.diffAmount) > 0) {
							item['makeExpensesShow'] = true
							// console.log(
							// 	`${item.name}---补齐费${item.materialSkuPic}--单价${item.price}---数量${item.budgetNum}--工种${item.skillTypeName}--${item.skillType}`
							// );
						}
					})

					this.$store.commit('setServiceGoodsList', tempList)
				}
			})
		},
		sortArr(attr) {
			return function (a, b) {
				return b[attr] - a[attr]
			}
		},
		getMoreType() {
			if (this.getMoreTypeList.length > 0) {
				this.showPopup = true
			}
		},
		getRightHeight() {
			let screenHeight = uni.getSystemInfoSync().screenHeight
			let offest = 4 + 10 // tab + (padding、margin)
			if (this.moreTypeList.length > 0) {
				if (uni.getStorageSync('resultHeight')) {
					this.resultHeight = uni.getStorageSync('resultHeight')
					return
				}
				uni.setStorageSync('resultHeight', this.resultHeight)
			} else {
				if (uni.getStorageSync('resultHeightAll')) {
					this.resultHeight = uni.getStorageSync('resultHeightAll')
					return
				}
			}
			this.$nextTick(() => {
				// 导航栏高度
				let classResult = '.header_fixed, .top-contain, .bottom-contain '
				if (this.moreTypeList.length > 0) {
					classResult += ', .more-type'
				}
				uni.createSelectorQuery().selectAll(classResult)
					.boundingClientRect(res => {
						if (res) {
							let total = 0
							res.forEach(el => {
								total += el.height
							})
							let result = screenHeight - total - offest
							this.resultHeight = this.$util.pxToRpx(result) + 'rpx'
							if (this.moreTypeList.length > 0) {
								uni.setStorageSync('resultHeight', this.resultHeight)
							} else {
								uni.setStorageSync('resultHeightAll', this.resultHeight)
							}

						}
					}).exec()
			})
		},
		setGroupsMaterial() {
			this.groupsMaterialList = this.groupsMaterialType(this.materialList, 'platformTreeCode',
				'platformCategoryName')
			this.setMoreTypeName()
		},
		setMoreTypeName() {
			if (this.moreTypeNameIndex) {
				this.moreTypeName = this.getMoreTypeList[this.moreTypeNameIndex].name
			} else {
				this.moreTypeName = '全部'
			}
		},
		groupsMaterialType(result, itemType, typeName) {
			let map = {}
			let dest = []
			let resultList = []
			result.forEach(item => {
				if (!map[item[itemType]]) {
					dest.push({
						type: item[itemType],
						typeName: item[typeName],
						list: [item]
					})
					map[item[itemType]] = item
				} else {
					dest.forEach(el => {
						if (el.type == item[itemType]) {
							el.list.push(item)
						}
					})
				}

			})
			resultList = [...dest]
			return resultList
		},

		/**
		 * 设置分页默认值
		 * */
		initPageSize() {
			this.tabList.forEach(item => {
				if (['1001', '1002', '1003'].includes(item.treeCode)) {
					item['materialPageSize'] = 1
					item['materialCurrentPageSize'] = 1
					item['materialTotal'] = 0
				}
				if (item.name == '全部') {
					item['materialPageSize'] = 1
					item['materialCurrentPageSize'] = 1
					item['materialTotal'] = 0
				}
			})
		},
		setMealSubmit() {
			// 一个套餐只能选择一次
			this.isAddSetMeal()
		},
		/**
		 * @description 是否选择过套餐
		 * */
		isAddSetMeal() {
			let skuId = this.serviceGoodsList.map(item => {
				return item.skuId
			})
			if (skuId.length == 0) {
				this.groupsMaterialList.forEach(item2 => {
					item2.list.forEach(item3 => {
						item3['isAddSetMeal'] = false
					})
				})
				return
			}
			this.groupsMaterialList.forEach(item2 => {
				item2.list.forEach(item3 => {
					this.serviceGoodsList.forEach(item => {
						if (skuId.includes(item3.id)) {
							item3['isAddSetMeal'] = true
						} else {
							item3['isAddSetMeal'] = false
						}
					})
				})
			})
		},
		syncRemark(type) {
			if (type == 'list') {
				// 列表赋值到购物车
				this.groupsMaterialList.forEach(item => {
					item.list.forEach(item2 => {
						item2.selectSkuList.forEach(item4 => {
							this.serviceGoodsList.forEach(item3 => {
								if (item4.skuId == item3.skuId) {
									item3['remark'] = item4.remark
								}
							})
						})
					})
				})
			} else {
				// 购物车 赋值搭到列表
				this.serviceGoodsList.forEach(item3 => {
					this.groupsMaterialList.forEach(item => {
						item.list.forEach(item2 => {
							item2.selectSkuList && item2.selectSkuList.forEach(item4 => {
								if (item4.skuId == item3.skuId) {
									item4['remark'] = item3.remark
								}
							})
						})
					})
				})
			}
		},
		getHeight() {
			this.$nextTick(() => {
				let classStr = '',
					classStrList = ['.tittle', '.bottom-add']
				classStr = classStrList.join(', ')
				uni.createSelectorQuery().selectAll(classStr)
					.boundingClientRect(res => {
						if (res) {
							let total = 0
							res.forEach(el => {
								total += el.height
							})
							let result = Number(uni.upx2px(this.popupHeight)) - total
							this.listHeight = this.$util.pxToRpx(result)
						}
					}).exec()
			})
		},
	}
}
</script>

<style lang="scss" scoped>
/deep/.u-tab-bar {
	border-radius: 16rpx !important;
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

/deep/ .u-line-1 {
	text-overflow: initial;
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

	.item-operation-display {
		background-color: #e3e1e1;
		border-color: #e3e1e1;
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
			// height: calc(100vh - 284rpx);
			background-color: $bgColor;
			margin-right: 2rpx;

			.left-nav-bar {
				width: 202rpx;
				height: 95%;

				.item-contain {
					height: 100%;
					display: flex;
					flex-direction: row;
					padding: 50rpx 20rpx 0rpx 20rpx;

					.item-bar {
						height: 16rpx;
						width: 6rpx;
						opacity: 1;
						margin-right: 8rpx;
						border-radius: 10rpx;
					}

					.item-bar-active {
						background-color: rgb(0, 47, 165);
					}

					.item-list {
						width: 100%;

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
							max-width: 120rpx;
							font-size: $smiddleFontSize;
							color: $mainFontColor;

						}

						.item-type-active {
							font-size: 30rpx;
							color: #303133;
							transition: transform .4s ease-in-out;
						}
					}
				}
			}
		}

		.right-contain {
			height: calc(100vh - 384rpx);
			background-color: $bgColor;

			.right-nav-bar {
				width: calc(100vw - 200rpx);
				height: 95%;
				padding: 00rpx 32rpx 0rpx 26rpx;

				.item-material-list {

					.item-gropus_name {
						color: #3D3D3D;
						font-size: 28rpx;
						padding-bottom: 20rpx;
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

					.item-material {
						padding-bottom: 30rpx;
						border-bottom: 2rpx solid #F3F3F3;
						margin-bottom: 28rpx;
						display: flex;
						flex-direction: column;

						.item-select-other {
							display: flex;
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

								.add-listing {
									padding: 8rpx 16rpx;
									background: $themeColor;
									border-radius: $miniBorderRadius;
									color: #FFF;
									font-size: $smallFontSize;
									font-weight: 400;
								}

								.add-display {
									padding: 8rpx 16rpx;
									background: #e3e1e1;
									border-radius: $miniBorderRadius;
									color: #FFF;
									font-size: $smallFontSize;
									font-weight: 400;
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

			.right-nav-bar-padding {
				padding: 20rpx 32rpx 0rpx 26rpx;
			}

			.right-nav-bar-all {
				width: 100vw;
			}
		}
	}
}

.more-type {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 32rpx 20rpx 26rpx;

	.left {
		color: #3D3D3D;
		font-size: 28rpx;
	}

	.right {
		display: flex;
		align-items: center;

		text {
			color: #606166;
			font-size: 24rpx;
		}

		image {
			width: 28rpx;
			height: 28rpx;
		}

	}
}


.bottom-contain {
	width: 100%;
	position: fixed;
	bottom: 0rpx;
	// height: 136rpx;
	// height: 224rpx;
	// height: 184rpx;
	background-color: #FFF;
	z-index: 10;
	box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);

	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);

	.bottom-contain-all {
		display: flex;

	}

	.make-up-expenses {
		margin: 0 20rpx 10rpx 20rpx;
		border-bottom: 2rpx solid #F6F6F6;

		.item-make-up-expenses {
			padding: 0 34rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 78rpx;

			text {
				color: #303133;
				font-size: 24rpx;
			}
		}
	}

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
		// height: 96rpx;
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
			position: relative;
		}

		.item-all-cotain {
			position: absolute;
			width: 100%;
		}

		.item-select-material {
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			padding: 46rpx 42rpx 46rpx 62rpx;
			border-bottom: 1rpx solid #EEEEEE;
			// touch-action: none;

			.item-left {
				display: flex;

				.item-other {
					margin-left: 20rpx;

					.item-name {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-bottom: 4rpx;
						width: 300rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
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
		display: flex;
		position: absolute;
		bottom: 0rpx;
		justify-content: center;
		padding: 0 26rpx;
		padding-bottom: 20rpx;
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

.input-contain_textarea {
	margin-top: 12rpx;
	background-color: #F6F7F9;
	border-radius: 10rpx;
	padding: 10rpx 16rpx;

	/deep/ .u-input__input {
		color: #303133;
	}

	.input_textarea {
		border-radius: 8rpx;
		background: #F7F7F7;
		width: 100%;
		height: 100rpx;
		font-size: 28rpx
	}
}

.item-all {
	display: flex;
}


.select-sku-contain {
	display: flex;
	flex-direction: column;
	margin-top: 20rpx;


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
				background-color: #F5F6F7;
				padding: 20rpx;
				border-radius: 10rpx;
			}

			.item-text {
				font-size: 24rpx;
				color: #606166;
			}
		}
	}
}

.add-and-subtract {
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
		background-color: #fff;
	}

	.item-operation-active {
		background-color: $themeColor;
	}

	.item-operation-border-active {
		border-color: $themeColor;
	}

	.public-input-contain {
		width: 68rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
		height: 52rpx;
		margin: 0 2rpx 0 2rpx;
		border: 0.5px solid #EEEEEE;

		/deep/ .uni-input-input {
			color: #909199;
		}

		/deep/ .u-input__right-icon {
			padding-right: 0rpx !important;
		}
	}
}
</style>
