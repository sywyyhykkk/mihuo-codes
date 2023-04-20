<template>
	<view class="client-billing-page">
		<public-module></public-module>
		<z-nav-bar backState="3000" bgColor="#fff" class="z-nav-bar" @backClick="goBackPage()">
			<view class="page-title">{{pageTitle}}</view>
			<view slot="right" class="nav-bar-title">
				<view class="search-icon" @click="searchShow = !searchShow">
					<u-icon name="search" color="#999999" size="40"></u-icon>
				</view>
			</view>
		</z-nav-bar>

		<view class="search-contian">
			<view v-if="searchShow" class="search">
				<u-icon name="search" color="#999999" size="28"></u-icon>
				<u-input focus confirm-type="确定" class="describe-input" v-model="search" @confirm="getSearch"
					height="72" type="text" :clearable="false" placeholder-style="fontSize:26rpx;color:#999999"
					placeholder="请输入关键字搜索" :border="false" />
				<view class="item-search-button" @click="getSearch">
					搜索
				</view>
			</view>
		</view>



		<!-- 查询节点是否可跳过信息 -->
		<node-information v-show="false" ref="nodeInformation"></node-information>
		<view class="top-contian">
			<view v-if="barList.length > 0" class="type-left">
				<u-tabs item-width="160" active-color="#002FA5" height="72" inactive-color="#787878" font-size="28"
					:list="barList" :is-scroll="true" :current="current" :active-item-style="activeItemStyle"
					@change="changeNavBarItem" bar-width="28" bar-height="6" bg-color="#fff" :key="uTabsKey"></u-tabs>
			</view>
			<!-- 开单统计 -->
			<view class="statistics-contain">
				<view class="item-other">
					<view class="item-left">
						<image src="/static/images/full-selection.png" mode=""></image>
						<view class="item-other-contai">
							<text class="item-label">已开单金额</text>
							<text class="item-price">{{selectServicePice}}</text>
							<text class="item-unit">元</text>
						</view>
					</view>
					<view class="item-right" @click="getRecord()">
						<text class="item-text">开单记录</text>
						<u-icon name="arrow-right" color="#002FA5" size="28"></u-icon>
					</view>
				</view>
				<view class="item-bottom">
					<text class="item-promotionAmount" v-if="recordDetails.pendAmount > 0">
						未付{{recordDetails.pendAmount}}</text>
					<text class="item-promotionAmount" v-if="recordDetails.promotionAmount > 0">
						优惠{{recordDetails.promotionAmount}}</text>
				</view>
			</view>
		</view>

		<!-- 节点审核信息 -->
		<sop-node-check ref="nodeCheck" v-if="clientBilling"></sop-node-check>
		<!-- 手动开始、结束填写的数据 -->
		<sop-operation-detail ref="sopOperationDetail" v-if="clientBilling" :iconShow="false"></sop-operation-detail>


		<!-- 	<mescroll-uni ref="mescrollRef" @init="mescrollInit" top="360" bottom="88" :topbar="true" :down="downOption"
			:up="upOption" @down="downCallback" @up="upCallback"> -->
		<swiper class="main-swiper" @change="changeSwiper" :current="current">
			<swiper-item v-for="(item,index) in barList" :key="index">
				<scroll-view :scroll-y="true" :scroll-with-animation="true" class="scroll-container">
					<view class="list-contain-all">
						<view class="item-contian" v-for="(item,index) in goodsList" :key="index">
							<view class="title-contian">
								<view class="been-open">
									<text class="grouping-text">{{item.name}}</text>
									<view class="item-been-open" v-if="groupingTotalPrice(item) > 0">
										<text class="item-label">已开</text>
										<text class="grouping-price">{{groupingTotalPrice(item)}}</text>
										<text class="grouping-unit">元</text>
									</view>
								</view>
								<view class="no-open" v-if="setTotalPendAmount(item) > 0">
									（未付{{setTotalPendAmount(item)}}）
								</view>
							</view>
							<view class="work-list">
								<view class="item-work-contain" v-for="(ev,num) in item.groupPrices" :key="num">
									<view class="work-title">
										<text class="work-left">
											{{ev.businessName}}
										</text>
										<view class="work-right">
											<view class="been-open" v-if="getTotalPrice(ev) > 0">
												<text class="item-label">已开</text>
												<text class="item-price">{{ getTotalPrice(ev) }}</text>
												<text class="item-unit">元</text>
											</view>
											<view class="no-open" v-if=" getPendAmount(ev) > 0">
												（未付{{getPendAmount(ev)}}）
											</view>
										</view>
									</view>
									<view class="work-contain-list">
										<view class="work-contain" v-for="(en,nums) in ev.products" :key="nums">
											<image-lazy-load :image="en.productImg" :key="nums" height="120">
											</image-lazy-load>
											<view class="item-contain-left">
												<view class="item-name">
													{{en.productName}}
												</view>
												<view class="item-specifications">
													{{en.productSku}}
												</view>
												<view class="item-statistical-contain">
													<text class="item-statistical">
														<text class="item-statistical-lable">预估量</text>
														<text class="item-statistical-num">{{en.budgetNum}}</text>
													</text>
													<text class="item-statistical">
														<text class="item-statistical-lable">开单量</text>
														<text
															class="item-statistical-num">{{en.orderNum + en.quantity}}</text>
													</text>
													<!-- 	<text class="item-statistical">
															<text class="item-statistical-icon">￥</text>
															<text class="item-price">{{setFloatMul(en.price,en.orderNum)}}</text>
														</text> -->
													<text class="item-statistical">
														<text class="item-statistical-lable"></text>
														<text class="item-statistical-num"></text>
													</text>
													<!-- <text class="item-statistical">
															<text class="item-statistical-lable">未付款</text>
															<text class="item-statistical-num">{{en.quantity}}</text>
														</text> -->
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-if="packageList.length > 0" class="cat-list">
							<item-set-meal v-for="(item ,index) in packageList" :info="item" numShow :key="index"
								@click="getSetMealDetails"></item-set-meal>
						</view>
						<mh-empty v-if="mhEmptyShow" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- </mescroll-uni> -->

		<!-- 套餐列表 -->

		<mihuo-bottom-button v-if="!clientBilling" :buttonList="bottomButton" @click="submit"></mihuo-bottom-button>

		<!-- 手动开始、手动结束 -->
		<sop-operation v-if="clientBilling" ref="sopOperation" :addButtonList="setAddButtonList" @getButton="submit">
		</sop-operation>

		<!-- 套餐详情 -->
		<mihuo-popup ref="mihuoPopup" height="1000" v-model="showPopup" @close="showPopup = false"
			:buttonList="buttonList" :titleShow="false" buttonShow :closeable="false">
			<view slot="other">
				<set-meal-details v-if="setMealDetails" :info="setMealDetails"></set-meal-details>
			</view>
		</mihuo-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import operation from '@/plugins/mathoperation.js'
	import {
		deepClone
	} from '@/plugins/utils.js'
	export default {
		data() {
			return {
				option: {},
				search: '',
				current: 0,
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '30rpx'
				},
				goodsList: [],
				goodsDataList: [],
				recordDetails: {},
				recordList: [],
				clientBilling: uni.getStorageSync('clientBilling'),
				barList: [],
				uTabsKey: 0,
				pageTitle: '项目开单记录',
				searchShow: false,
				downOption: {
					use: false,
					auto: false
				},
				mainSwiperHeight: 0,
				upOption: {
					use: false, // 上滑加载更多不使用mescroll实现
					toTop: {
						src: ''
					},
				},
				packageList: [],
				packageListData: [],
				mescroll: null,
				showPopup: false,
				setMealDetails: '',
				bottomButton: [{
					name: '开单',
					status: true
				}],
				buttonList: [{
					name: '关闭',
					active: false
				}]
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'userRole', 'userPersonInfo', 'nodeInfo']),
			/**
			 *@description  订单状态：-1=其他订单 0=待付款；1=待发货；2=已发货(服务中-服务订单)；3待验收-服务订单 4=已完成；
			 * \n 5=待售后，6售后完成，7=（订单未支付，超时自动关闭，或者用户自己关闭）已关闭；8=退款；9=无效订单
			 * */
			selectServicePice() {
				// let tempPice = [] // 订单金额总计
				// let subtractList = [] // 退款金额
				// this.recordList.map(item => {
				// 	if (item.status < 7) {
				// 		tempPice.push(item.payAmount)
				// 	}
				// 	if (item.status == 8) {
				// 		subtractList.push(item.payAmount)
				// 	}
				// })

				// let resultPice = operation.funCalc(tempPice)
				// let tempDiffer = operation.funCalc(subtractList)
				// // // 开单金额-已退金额
				// return operation.floatSub(resultPice, tempDiffer)
				return operation.floatSub(this.recordDetails.totalAmount, this.recordDetails.refundAmount)
			},
			noSelectServicePice() {
				let tempPice = []
				this.recordList.map(item => {
					if (item.status == 0) {
						tempPice.push(item.payAmount)
					}
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice
			},
			getPromotionAmount() {
				let tempPice = []
				this.recordList.map(item => {
					if (item.status > -1 && item.status < 7) {
						tempPice.push(item.promotionAmount)
					}
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice
			},
			setAddButtonList() {
				return [{
					name: '开单'
				}]
			},
			mhEmptyShow() {
				let list = []
				this.goodsList.forEach(item => {
					list.push(item)
				})
				this.packageList.forEach(item => {
					list.push(item)
				})
				return list.length > 0 ? false : true
			}

		},
		watch: {
			search: {
				handler(newVal, oldVal) {
					this.debounce(() => {
						this.getList()
					}, 100)
				},
			}
		},
		mounted() {

		},
		onShow() {
			this.setBarList()
			this.getAllAmount()
			this.setNodeDetails()
			this.uTabsKey++
			this.queryPackageOrderItems()
		},
		onLoad(option) {
			this.option = option
			this.setPageTitle()
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		},
		onUnload() {
			uni.setStorageSync('clientBilling', '')
			this.$store.commit('setSkuIdList', [])
			this.$store.commit('setShoppingCart', [])
		},
		methods: {
			setPageTitle() {
				this.pageTitle = this.nodeInfo.nodeName ? this.nodeInfo.nodeName : '项目开单记录'
			},
			// mescroll组件init
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			setBarList() {
				this.$httpApi.getListByTreeCodeTree({}).then(res => {
					if (res) {
						// res = res.filter(item => ['1001', '1002', '1003'].includes(item.treeCode))
						// this.barList = res.sort(this.sortArr('treeCode'))
						this.barList = res
						this.barList.unshift({
							name: '全部'
						})
						this.getList()
						this.setBarListName()
					}
				})
			},
			sortArr(attr) {
				return function(a, b) {
					return b[attr] - a[attr]
				}
			},
			setNodeDetails() {
				if (!this.clientBilling) {
					return
				}
				this.$nextTick(() => {
					// 刷新节点审核信息
					this.$refs.nodeCheck && this.$refs.nodeCheck.getReviewList()
					// 更新node详情  
					this.$getNodeDetails(() => {
						// 刷新 手动添加的内容
						this.$refs.sopOperationDetail && this.$refs.sopOperationDetail.getDetails()
						// 刷新按钮禁用
						this.$refs.sopOperation && this.$refs.sopOperation.getDetails()
						// 刷新按钮显示
						this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
					})
				})

			},
			goBackPage() {
				uni.setStorageSync('clientBilling', '')
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * @description 分组统计已开
			 * */
			groupingTotalPrice(item) {
				let tempList = []
				item.groupPrices.forEach(el => {
					el.products.forEach(ev => {
						tempList.push(ev.totalPrice)
						// tempList.push(operation.floatMul(ev.orderNum + ev.quantity, ev.price || 0))
					})
				})
				let resultPice = operation.funCalc(tempList)
				return resultPice
			},
			/**
			 * @description 分组统计未付
			 * */
			setTotalPendAmount(item) {
				let tempList = []
				let tempPayAmount = []
				if (item.groupPrices) {
					item.groupPrices.forEach(el => {
						if (el.products) {
							el.products.forEach(ev => {
								tempList.push(ev.totalPrice)
								tempPayAmount.push(ev.payAmount)
							})
						}
					})
				}
				// 已开
				let resultPice = operation.funCalc(tempList)
				// 已付
				let resultPayAmount = operation.funCalc(tempPayAmount)
				// 已开 - 已付
				let tempPendAmount = operation.floatSub(resultPice, resultPayAmount)
				return tempPendAmount
			},
			/**
			 * @description 按材料分类统计已开
			 * */
			getTotalPrice(item) {
				let tempList = []
				item.products.forEach(el => {
					tempList.push(el.totalPrice)
				})
				let resultPice = operation.funCalc(tempList)
				return resultPice
			},
			/**
			 * @description 按材料分类统计未付
			 * */
			getPendAmount(item) {
				let tempList = []
				let tempPayAmount = []
				item.products.forEach(el => {
					tempList.push(el.totalPrice)
					tempPayAmount.push(el.payAmount)
					// tempList.push(operation.floatMul(el.orderNum + el.quantity, el.price || 0))
				})
				// 已开
				let resultPice = operation.funCalc(tempList)
				// 已付
				let resultPayAmount = operation.funCalc(tempPayAmount)
				// 已开 - 已付
				let tempPendAmount = operation.floatSub(resultPice, resultPayAmount)
				return tempPendAmount
			},
			getSearch() {
				this.getList()
			},
			getAllAmount() {
				this.$httpApi.getAllAmount({
					currentCompanyId: this.orderInfo.companyId, // B端-当前企业编号--必填
					projectId: this.projectInfo.projectId,
					sourceType: 4,
					serveProjectId: this.projectInfo.projectId,
					nodeId: uni.getStorageSync('clientBilling') ? this.nodeInfo.nodeId : -1
				}).then(res => {
					// uni.hideLoading();
					if (res) {
						this.recordDetails = res
					}
				})
			},
			getList() {
				this.$httpApi.typeByCondition({
					source: 4, // 组合报价来源（1订单，2变更订单，3项目预算，4材料管理）
					topName: '',
					projectId: this.projectInfo.projectId,
					keyword: this.search,
					nodeId: uni.getStorageSync('clientBilling') ? this.nodeInfo.nodeId : -1
				}).then(res => {
					uni.hideLoading();
					if (res) {
						res.forEach(ev => {
							ev.groupPrices.forEach(el => {
								el.products.forEach(en => {

									en['productSku'] = en.productSku !== '' && this
										.$isJSON(en.productSku) && JSON.parse(en
											.productSku) && JSON.parse(en.productSku)[0] &&
										JSON.parse(en.productSku)[0].value
								})

							})
						})
						this.goodsDataList = res
						this.setTotalPrice()
						this.goodsList = this.goodsDataList
						this.changeNavBarItem(this.current)
					} else {
						this.goodsList = []
					}
					this.getHeight()
				})
			},
			setTotalPrice() {
				let tempPice = []
				this.goodsDataList.forEach(item => {
					item['totalPriceList'] = []
					if (item.groupPrices) {
						item.groupPrices.forEach(el => {
							item['totalPriceList'].push(Number(el.totalPrice))
						})
					}
				})
				this.goodsDataList.forEach(item => {
					item['totalPrice'] = operation.funCalc(item.totalPriceList)
				})
			},
			setFloatMul(price, num) {
				return operation.floatMul(price || 0, num)
			},

			changeNavBarItem(index) {
				this.current = index
				let activeName = this.barList[index] && this.barList[index].name
				let treeCode = this.barList[index] && this.barList[index].treeCode
				if (activeName !== '全部') {
					if (activeName == '人工') {
						this.goodsList = this.goodsDataList.filter(item => item.name.includes(activeName))
					} else {
						if (activeName == '套餐') {
							this.goodsList = []
							this.packageList = this.packageListData
						} else {
							this.goodsList = this.goodsDataList.filter(item => item.type == treeCode)
							this.packageList = []
						}
					}
				} else {
					this.goodsList = this.goodsDataList
					this.packageList = this.packageListData
				}
				
				console.log('this.goodsList',this.goodsList);
			},
			getRecord() {
				this.toPage('/pages/construction/clientBilling/billingRecordList')
			},
			submit() {
				this.toPage('/pages/construction/clientBilling/materialWarehouse')
			},
			queryPackageOrderItems() {
				if (!this.projectInfo.projectId) {
					return
				}
				this.$httpApi.queryPackageOrderItems({
					projectId: this.projectInfo.projectId
				}).then(res => {
					if (res) {
						this.packageList = res
						this.packageListData = deepClone(res)
					}
				})
			},
			setBarListName() {
				if (this.packageList.length) {
					this.barList.splice(1, 0, {
						name: '套餐',
						treeCode: '3000'
					})
				}
			},
			downCallback() {},
			upCallback() {},
			changeSwiper(e) {
				this.current = e.detail.current
				this.changeNavBarItem(this.current)
			},
			getHeight() {

				return
				let screenHeight = uni.getSystemInfoSync().screenHeight
				let offest = 4 + 88 // tab + (padding、margin)

				this.$nextTick(() => {
					// 导航栏高度
					let classResult = '.header_fixed, .top-contain, .search-contian, .button-content'
					uni.createSelectorQuery().selectAll(classResult)
						.boundingClientRect(res => {
							if (res) {
								let total = 0
								res.forEach(el => {
									total += el.height
								})
								let result = screenHeight - total - offest
								this.mainSwiperHeight = this.$util.pxToRpx(result) + 'rpx'
							}
						}).exec()
				})
			},
			getSetMealDetails(item) {
				this.setMealDetails = item
				this.showPopup = !this.showPopup
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.main-swiper,
	.scroll-container {
		// 屏幕高度 - 导航栏- 顶部top-contian - marginBottom - 底部按钮 - 偏移
		height: calc(100vh - var(--status-bar-height) - 262rpx - 10rpx - 134rpx - 80rpx);
	}

	/deep/.seize-seat {
		height: 0rpx !important;
	}

	.search-icon {
		width: 88rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
	}

	.client-billing-page {
		.page-title {
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			max-width: 550rpx;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.label {
			color: #999999;
			font-size: $middleFontSize;
			text-align: center;
		}

		.nav-bar-title {
			.u-icon {
				margin-right: 28rpx;
			}
		}

		.search-contian {
			background-color: #fff;
			padding: 0 40rpx;

			.search {
				// width: 618rpx;
				display: flex;
				background: #F4F4F4;
				border-radius: 50rpx;
				padding-left: 38rpx;

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

				.u-icon {
					margin-right: 10rpx;
				}
			}
		}



		.top-contian {
			position: -webkit-sticky;
			position: sticky;
			width: 100%;
			top: 0rpx;
			top: calc(88rpx + var(--status-bar-height));
			z-index: 99;
			// margin-top: 10rpx;


			.type-left {
				background-color: #FFFFFF;
				padding: 20rpx 0rpx;

				/deep/ .u-scroll-box {
					height: 72rpx;
				}

				.scroll-view-contain {

					.item-type-list {
						height: 72rpx;
						display: flex;
						flex-wrap: nowrap;

						.item-type {
							color: rgb(120, 120, 120);
							font-size: 28rpx;
							width: 160rpx;
							padding: 0 30rpx;
							white-space: nowrap;
						}
					}
				}
			}

			.statistics-contain {
				display: flex;
				flex-direction: column;
				align-items: center;
				background-color: #FFFFFF;
				padding: 32rpx 32rpx 20rpx 32rpx;
				border-radius: 0rpx 0rpx 10rpx 10rpx;
				margin-bottom: 10rpx;
				border-top: 2rpx solid #f5f5f5;

				.item-other {
					display: flex;
					width: 100%;
					justify-content: space-between;
				}

				.item-bottom {
					width: 100%;
					text-align: left;
					color: #606166;
					font-size: 28rpx;
					margin-top: 16rpx;
				}

				.item-promotionAmount {
					color: #606166;
					font-size: 28rpx;
					margin-left: 20rpx;
				}

				.item-left {
					display: flex;
					align-items: center;

					image {
						width: 36rpx;
						height: 36rpx;
						margin-right: 16rpx;
					}

					.item-label {
						font-size: 32rpx;
						color: #000000;
						margin-right: 16rpx;
					}

					.item-price {
						font-size: 32rpx;
						color: $errorFontColor;

					}

					.item-unit {
						font-size: 30rpx;
						color: $errorFontColor;
					}
				}

				.item-right {
					.item-text {
						font-size: 26rpx;
						color: $themeColor;
						margin-right: 10rpx;
					}
				}
			}
		}

		.list-contain-all {
			position: relative;

			.mh-empty-page {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translateX(-50%) translateY(50%);

				/deep/.u-empty {
					margin-top: 0rpx !important;
				}
			}

			.item-contian {
				display: flex;
				flex-direction: column;
				padding: 26rpx 28rpx;
				border-radius: 10rpx;
				background: #FFFFFF;
				margin-bottom: 10rpx;

				.title-contian {
					margin-bottom: 30rpx;
					display: flex;
					align-items: center;

					.been-open {
						display: flex;
						align-items: center;

						.item-been-open {
							display: flex;
							align-items: center;
						}

						.item-label {
							font-size: 26rpx;
							color: #606166;
							margin-right: 6rpx;
						}
					}

					.no-open {
						color: #606166;
						margin-left: 10rpx;
						font-size: 26rpx;
					}

					.grouping-text {
						font-size: 32rpx;
						color: #303133;
						margin-right: 10rpx;
					}

					.grouping-price {
						font-size: 32rpx;
						color: $errorFontColor;
					}

					.grouping-unit {
						font-size: 26rpx;
						color: $errorFontColor;
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
							// justify-content: space-between;
							margin-bottom: 10rpx;

							.work-left {
								font-size: 24rpx;
								padding: 4rpx 10rpx;
								border-radius: 16rpx 0rpx 16rpx 0rpx;
								background-color: $themeColor;
								color: #fff;
							}

							.work-right {
								display: flex;
								align-items: center;
								padding-left: 10rpx;

								.been-open {
									.item-label {
										font-size: 26rpx;
										color: #606166;
										margin-right: 8rpx;
									}

									.item-price {
										font-size: 30rpx;
										color: #FF5D35;
									}

									.item-unit {
										color: #FF5D35;
										font-size: 24rpx;
										transform: scale(0.85);
									}
								}

								.no-open {
									color: #606166;
									font-size: 26rpx;
								}
							}

						}

						.work-contain-list {}


						.work-contain {
							display: flex;
							flex-direction: row;
							padding-bottom: 20rpx;
							margin-bottom: 20rpx;
							border-bottom: 2rpx solid #F6F6F6;

							&:last-child {
								border-bottom: 0rpx;
								margin-bottom: 0rpx;
								padding-bottom: 0rpx;
							}

							.item-image {
								margin-right: 16rpx;
							}

							.item-contain-left {
								margin-left: 20rpx;

								.item-name {
									width: 530rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									font-size: 30rpx;
									color: #000000;
									margin-bottom: 10rpx;
								}

								.item-specifications {
									font-size: 26rpx;
									color: #999999;
								}

								.item-statistical-contain {
									display: flex;
									justify-content: space-between;
									align-items: center;

									.item-statistical {

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
											color: $lightErrorColor;
											transform: scale(0.85);
										}

										.item-price {
											font-size: 32rpx;
											color: $lightErrorColor;
										}
									}
								}


							}
						}
					}
				}
			}
		}


	}

	.cat-list {
		background-color: #fff;
		padding: 36rpx 24rpx;
		border-radius: 10rpx;
	}
</style>
