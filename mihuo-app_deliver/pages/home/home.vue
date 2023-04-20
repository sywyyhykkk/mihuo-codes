<template>
	<view class="home-page">
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="2000">
			<view slot="left" class="address-select flex-center" @click="chooseAddress">
				<text class="title">{{ selectedAddressCity || '选择' }}</text>
				<u-icon class="icon" name="arrow-down-fill" color="#B8B9BC" size="24"></u-icon>
			</view>
			<view slot="right">
				<view @click="goToSearchPage">
					<mihuo-search class="search-box" :mode="2" button="inside" :disabled="true"></mihuo-search>
				</view>
			</view>
		</z-nav-bar>
		<view class="location-permissions" v-if="isLocationPermissionsShow">
			<text>开启定位，为您推荐周边优质订单</text>
			<view class="location-right" @click="openLocationPermissions()">
				<view class="item-button">
					开启
				</view>
				<image src="/static/images/icon_close/close_1.png" mode="" @click="isLocationPermissionsShow = false">
				</image>
			</view>
		</view>
		<mihuo-tab class="sticky-content" @changeTab="changeTab" :current="currentTab"></mihuo-tab>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" top="190" :topbar="true" :down="downOption" :up="upOption"
			@down="downCallback" @up="upCallback">
			<swiper class="main-swiper" :class="[ workCardStatus? '':'main-swiper-display']" @change="changeSwiper"
				:current="currentTab">
				<!-- 找活页面 -->
				<swiper-item>
					<scroll-view :scroll-y="workCardStatus" :scroll-into-view="scrollIntoView"
						:scroll-with-animation="true" @scrolltolower="scrollToLower" @scroll="getScroll"
						class="scroll-container">
						<!-- 找活轮播图 -->
						<view class="swiper-contain">
							<u-swiper class="swiper" img-mode="aspectFill" height="200" :list="swiperImgListMini"
								:autoplay="true" :interval="3000" :duration="500" :circular="true"
								:showIndicator="false" @click="goToSomePage($event, 2)">
							</u-swiper>
						</view>
						<!-- 交易快报 -->
						<view class="notice-bar flex-center" id="coordinates_0">
							<image class="img" src="../../static/images/notice_list_title.png"></image>
							<swiper :vertical="true" class="content" :indicator-dots="false" :autoplay="true"
								:interval="3000" :duration="1000" :circular="true">
								<swiper-item class="swiper-item" v-for="(item, index) in expressData" :key="index">
									<text class="nickname">
										{{ getExpressItem(item) }}刚刚在平台上赚了
									</text>
									<text class="price">{{ item.price }}元</text>
								</swiper-item>
							</swiper>
						</view>
						<!-- 列表标题 -->
						<view class="list-header flex-center">
							<view class="left flex-center">
								<image src="../../static/icon/home/home_button21.png" class="icon-left"></image>
								<text class="list-header-text"> 我要找活 </text>
							</view>
							<view class="right flex-center" @click="goToViewMore({ skillId: '-1', skillName: '' })">
								更多
								<image src="../../static/icon/home/home_button9.png" class="icon-right"></image>
							</view>
						</view>

						<!-- 列表主体 -->
						<view>
							<view class="u-dropdown-custom" id="u-dropdown-custom_0">
								<u-dropdown active-color="#002FA5" :isMaskHeight="false" height="92" ref="uDropdown"
									@open="getOpen('找活')" class="dropdown-menu" @close="getClose('找活')" title-size="26">
									<u-dropdown-item v-model="screenWorkType.optionModel1"
										:title="screenWorkType.title1" :options="screenWorkType.options1"
										@change="selectClick($event, 1)">
									</u-dropdown-item>
									<u-dropdown-item height="800" v-model="screenWorkType.optionModel2"
										:title="screenWorkType.title2" :options="screenWorkType.options2"
										@change="selectClick($event, 2)">
									</u-dropdown-item>
									<u-dropdown-item height="800" v-model="screenWorkType.optionModel3"
										:title="screenWorkType.title3" :options="screenWorkType.options3"
										@change="selectClick($event, 3)">
									</u-dropdown-item>
									<u-dropdown-item v-model="screenWorkType.optionModel4"
										:title="screenWorkType.title4" :options="screenWorkType.options4"
										@change="selectClick($event, 4)">
									</u-dropdown-item>
								</u-dropdown>
							</view>


							<!-- 添加判断，若为空显示空状态 -->
							<block v-if="orders && orders.length">
								<work-card :work="item" v-for="(item, index) in orders" :key="item.id + index"
									@clicked="goOrderReceiving"></work-card>
								<view style="height: 80rpx">
									<u-loadmore margin-top="20" icon-color="#002FA5" :status="orderPageStatus"
										color="#909199" :load-text="orderLoadText" />
								</view>
							</block>
							<mh-empty style="padding-bottom: 40rpx" v-else title="当前区域暂无匹配的订单~"></mh-empty>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 找人页面 -->
				<swiper-item>
					<scroll-view scroll-y="true" @scrolltolower="scrollToLower" @scroll="getScroll"
						class="scroll-container">
						<!-- 找人轮播图 -->
						<view class="swiper-contain">
							<u-swiper class="swiper" img-mode="aspectFill" height="200" :list="swiperImgListMini2"
								:autoplay="true" :interval="3000" :duration="500" :circular="true"
								:showIndicator="false" @click="goToSomePage($event, 2)">
							</u-swiper>
						</view>

						<view class="sort-view">
							<view class="sort-item" @click="gotoSort(item.sort,index)" v-for="(item,index) in sortList"
								:key="index">
								<view class="label">{{item.name}}</view>
								<view class="sort-btn" v-if="item.desc">
									<image src="/static/icon/home/up.png" />
									<image src="/static/icon/home/select_down.png" />
								</view>
								<view class="sort-btn" v-else>
									<image src="/static/icon/home/select_up.png" />
									<image src="/static/icon/home/down.png" />
								</view>
							</view>
						</view>
						<!-- 新的列表主体 -->
						<view style="padding: 0 20rpx;">
							<block v-if="people && people.length">
								<view v-for="(itm,ind) in people" :key="itm.id">
									<demand-item :item="itm" :demandLocationInfo="demandLocationInfo" />
								</view>
								<view style="height: 80rpx">
									<u-loadmore icon-color="#002FA5" margin-top="20" :status="peoplePageStatus"
										color="#909199" :load-text="peopleLoadText" />
								</view>
							</block>
							<mh-empty style="padding-bottom: 40rpx" v-else title="当前区域暂无需求发布~"></mh-empty>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 更多功能 -->
				<swiper-item>
					<scroll-view scroll-y="true" @scrolltolower="scrollToLower" class="scroll-container">
						<view class="main-container">
							<view class="card flex-center">
								<view class="title-container flex-center">
									<view class="title">
										个人
										<text>觅活可靠 安全有保障</text>
									</view>
								</view>
								<view class="card-items flex-center">
									<view class="item flex-center" v-for="(item,index) in commonList" :key="index"
										@click="buttonOperation(item)">
										<view class="icon-warpper flex-center">
											<image class="icon" :src="item.icon"></image>
										</view>
										{{item.name}}
									</view>
								</view>
							</view>
							<view class="card flex-center">
								<view class="title-container flex-center">
									<view class="title">
										施工
										<text>施工小助手</text>
									</view>
								</view>
								<view class="card-items flex-center">
									<view class="item flex-center" v-for="(item,index) in siteListButton"
										@click="buttonOperation(item)">
										<view class="icon-warpper flex-center">
											<image class="icon" :src="item.icon"></image>
										</view>
										{{item.name}}
									</view>
								</view>
							</view>

							<view class="swiper">
								<u-swiper height="240" :showIndicator="true" :list="swiperImgListBottom"
									:autoplay="true" :interval="7000" :duration="500" :circular="true"
									@click="goToSomePage($event, 0)">
								</u-swiper>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mescroll-uni>
		<mihuo-refresh ref="refresh" @refresh="refresh" v-if="refreshStatus"></mihuo-refresh>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	import moment from '@/static/js/moment.js'
	import {
		judgePermission,
		gotoAppPermissionSetting
	} from '@/plugins/permission';
	import DemandItem from "../demandMarket/demand-item.vue";
	export default {
		components: {
			DemandItem
		},
		data() {
			return {
				commonList: [{
						name: '余额提现',
						icon: '/static/icon/home/withdrawal.png',
						path: '../mine/personalCenter'
					},
					{
						name: '我的保险',
						icon: '/static/icon/home/insurance.png',
						path: '/pages/mine/Insurance/InsurancePage'
					},
					{
						name: '更改密码',
						icon: '/static/icon/home/password.png',
						path: '../setting/resetLoginPwd'
					},
					{
						name: '更多认证',
						icon: '/static/icon/home/authen.png',
						path: '/pages/setting/skillCertification/skillCertificationPage'
					},
					{
						name: '施工知识',
						icon: '/static/icon/home/knowledge.png',
						path: '/pages/home/processstabdard?typeName=施工知识'
					},
					{
						name: '工费申请',
						icon: '/static/icon/home/cost.png'
					},
					{
						name: '快速预算',
						icon: '/static/images/budget.png',
						path: '/pages/quickBilling/billingList'
					},
					{
						name: '快速开单',
						icon: '/static/icon/home/kskd.png',
						path: '/pages/quickBilling/billingList?pageType=快速开单'
					},
					{
						name: '预付款充值',
						icon: '/static/icon/home/kskd.png',
						path: '/pages/paymentInAdvance/payment'
					}
				],
				siteList: [{
						name: '施工日历',
						icon: '/static/icon/home/calendar.png',
						show: true,
					},
					{
						name: '发起验收',
						icon: '/static/icon/home/check.png',
						show: true,
					},
					{
						name: '全部工地',
						icon: '/static/images/type_3.png',
						path: '/pages/site/siteList',
						show: false,
					}
				],
				sortList: [{
						name: '距离',
						sort: 'distance',
						desc: true
					},
					{
						name: '浏览量',
						sort: 'views',
						desc: true
					},
					{
						name: '发布时间',
						sort: 'created',
						desc: true
					}
				],
				tabList: [{
					name: '找活'
				}, {
					name: '找人'
				}, {
					name: '更多功能'
				}],
				allowLocation: -1,
				refreshTop: 0,
				screenPeopletType: {
					title1: '人才类型',
					title2: '工作经验',
					title3: '筛选',
					optionModel1: '', // 人才类型
					optionModel2: '', // 工作经验
					optionModel3: '', // 工人等级
					options1: [],
					options2: [{
							label: '全部',
							value: ''
						},
						{
							label: '一到三年',
							value: '一到三年' // 用中文value值匹配数据库里的数据
						},
						{
							label: '三到五年',
							value: '三到五年' // 用中文value值匹配数据库里的数据
						},
						{
							label: '五年以上',
							value: '五年以上' // 用中文value值匹配数据库里的数据
						}
					],
					options3: [{
							label: '全部',
							value: ''
						},
						{
							label: '一星工匠',
							value: '1'
						},
						{
							label: '二星工匠',
							value: '2'
						},
						{
							label: '三星工匠',
							value: '3'
						},
						{
							label: '四星工匠',
							value: '4'
						},
						{
							label: '五星工匠',
							value: '5'
						}
					]
				},
				screenWorkType: {
					title1: '定价类型',
					title2: '订单类型',
					title3: '技能要求',
					title4: '排序',
					optionModel1: '', // 定价类型
					optionModel2: '', // 订单类型
					optionModel3: '', // 技能要求
					optionModel4: '', // 排序
					options1: [{
							label: '全部',
							value: ''
						},
						{
							label: '一口价',
							value: 1
						},
						{
							label: '议价',
							value: 2
						}
					],
					options2: [],
					options3: [],
					options4: [{
							label: '默认排序',
							value: ''
						},
						{
							label: '距我最近',
							value: 'DISTANCE'
						},
						{
							label: '金额最高',
							value: 'AMOUNT'
						}
					]
				},
				orderPageStatus: 'loadmore',
				peoplePageStatus: 'loadmore',
				refreshStatus: true,
				orderLoadText: {
					loadmore: '加载更多',
					nomore: '已经到底了',
					loading: '加载中'
				},
				peopleLoadText: {
					loadmore: '加载更多',
					nomore: '已经到底了',
					loading: '加载中'
				},
				workTypeList: [], // 工种列表
				downOption: {
					use: true,
					auto: false
				},
				upOption: {
					use: false, // 上滑加载更多不使用mescroll实现
					toTop: {
						src: ''
					},
				},
				mescroll: null,
				cityOperatorId: uni.getStorageSync('cityOperatorId') || -1, // 运营商ID
				latitude: uni.getStorageSync('latitude') || 0, // 纬度
				longitude: uni.getStorageSync('longitude') || 0, // 经度
				expressData: [], // 交易快报
				currentTab: 0,
				people: [], // 工人列表
				orders: [], // 订单列表
				currentOrderPage: 1, // 找活当前页
				currentPersonPage: 1, // 找人当前页
				recordCurrentOrderPage: 1,
				recordCurrentPersonPage: 1,
				pageSize: 10,
				scrollIntoView: '',
				refreshIndex: 0,
				toSearchPageStatus: true,
				serviceInfo: {},
				serviceType: '',
				userAddressStr: uni.getStorageSync('oldLocation') ?
					uni.getStorageSync('oldLocation').address : '',
				swiperImgListMini: [{
					image: 'https://mihuo.obs.cn-east-3.myhuaweicloud.com/ed5b284aaa7848f9810718e44c25588b.jpg?x-image-process=image/resize,m_fixed,w_120'
				}], // 找活页面的mini banner
				swiperImgList: [{
					image: 'https://mihuo.obs.cn-east-3.myhuaweicloud.com/804c56c5182045b8aa73a08032623069.JPG'
				}], // 找活页面的竖屏banner
				swiperImgListMini2: [{
					image: 'https://mihuo.obs.cn-east-3.myhuaweicloud.com/86a35e4e83fc4020a93bd7495d33d9c8.JPG'
				}], // 找人页面的mini banner
				swiperImgList2: [{
					image: 'https://mihuo.obs.cn-east-3.myhuaweicloud.com/a053ba62152948dfa73b4fc068198a61.JPG'
				}], // 找人页面的竖屏banner
				swiperImgListBottom: [], // 更多功能的banner
				peopleTotal: 0,
				ordersTotal: 0,
				flagIndex: 0,
				isLocationPermissionsShow: false,
				demandLocationInfo: {},
				orderDetails: {},
				workCardStatus: true,
				personSettingInfo: []
			}
		},
		onLoad() {
			// 获取找人和找活的筛选条件
			this.getOptionsList()

			if (!uni.getStorageSync('cityOperatorId')) {
				this.getCityOperators()
			} else {
				this.getAddress(() => {
					this.reload(true)
				})
			}

		},
		onShow() {
			this.initParameter()
			uni.$once('operatorSelected', (data) => {
				this.refreshIndex++
				if (data) {
					const flag = data.id == this.cityOperatorId
					this.setUserAddress(data)
					this.userAddressStr = data.address || ''
					uni.setStorageSync('cityOperatorId', data.id)
					uni.setStorageSync('oldLocation', data)
					this.cityOperatorId = data.id || -1
					this.getAddress(() => {
						this.reload(!flag)
					})
				}
			})

			// 如果点击切换城市，则不调用此处接口
			if (this.toSearchPageStatus) {
				this.getDemandData()
				this.fetchOrderData()
			}
			this.isLocationPermissions()
			this.selectSiteShow()
		},
		onUnload() {

		},
		computed: {
			// 运营商位置处理
			selectedAddressCity() {
				if (!this.userAddressStr) {
					return '请选择'
				}
				let cities = ['北京市', '天津市', '上海市', '重庆市']
				let userProvince =
					(this.userAddressStr && this.userAddressStr.split(' ')[0]) ||
					this.userAddressStr // 省份名称
				let userCity =
					(this.userAddressStr && this.userAddressStr.split(' ')[1]) ||
					this.userAddressStr // 城市名称
				if (cities.indexOf(userProvince) !== -1) {
					// 如果是直辖市, 则使用省份名称
					return userProvince
				}
				return userCity
			},
			siteListButton() {
				return this.siteList.filter(item => item.show)
			},

		},
		methods: {
			...mapMutations(['setUserAddress']),
			initParameter() {
				this.allowLocation = uni.getStorageSync('allowLocation')
				this.userAddressStr = uni.getStorageSync('oldLocation') ?
					uni.getStorageSync('oldLocation').address :
					''
				this.latitude = uni.getStorageSync('latitude') || 0
				this.longitude = uni.getStorageSync('longitude') || 0
				this.cityOperatorId = uni.getStorageSync('cityOperatorId')
			},
			isLocationPermissions() {
				if (this.allowLocation != 1) {
					// sb小米审核过不掉 不能在首页进去就直接弹权限框
					return
				}
				// 是否打开了位置权限
				// #ifdef APP-PLUS
				judgePermission('location', (res) => {
					// 未请求，1 = 已允许，0 = 拒绝 null 未请求 -1 已经拒绝
					if (res) {
						this.isLocationPermissionsShow = res > 0 ? false : true
						this.demandLocationInfo['distanceShow'] = res //控制需求市场的位置显示
						uni.getLocation({
							type: 'gcj02',
							success: res2 => {
								this.demandLocationInfo['latitude'] = res2.latitude
								this.demandLocationInfo['longitude'] = res2.longitude
								this.reload(true)
							},
							fail: (err) => {
								console.log("位置信息获取失败");
							}
						});
					}
				})
				// #endif
			},
			openLocationPermissions() {
				if (this.isLocationPermissionsShow) {
					gotoAppPermissionSetting();
				}
			},
			gotoSort(e, i) {
				this.sortList[i].desc = !this.sortList[i].desc
				this.getDemandData(this.sortList[i].desc, e)
			},
			getOptionsList() {
				this.screenPeopletType.options1 = []
				this.screenWorkType.options2 = []
				this.screenWorkType.options3 = []
				this.screenPeopletType.options1.unshift({
					label: '全部',
					value: ''
				})
				this.screenWorkType.options3.unshift({
					label: '全部',
					value: ''
				})
				this.screenWorkType.options2.unshift({
					label: '全部',
					value: ''
				})
				this.getWorkType() // 获取工种类型
				this.getRequirementType() // 获取需求类型
			},
			getAddress(callback) {
				if (this.allowLocation == 1) {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: (res) => {
							if (res) {
								uni.setStorageSync('latitude', res.latitude)
								uni.setStorageSync('longitude', res.longitude)
								this.latitude = res.latitude
								this.longitude = res.longitude
							}
						},
						fail: (error) => {},
						complete: (end) => {
							callback && callback()
						}
					})
				} else {
					callback && callback()
				}
			},
			// 获取运营商
			getCityOperators(provinceCity) {
				this.$httpApi.getCityOperator().then((res) => {
					this.$httpApi.getCityOperator().then(res => {
						if (res) {
							// 默认选择第一个
							const data = res[0]
							this.setUserAddress(data)
							this.userAddressStr = data.address || ''
							uni.setStorageSync('cityOperatorId', data.id)
							uni.setStorageSync('oldLocation', data)
							this.cityOperatorId = data.id || -1
							this.getAddress(() => {
								this.reload(true)
							})
						}
					})
				})
			},
			// 更多功能页面的功能跳转
			buttonOperation(item) {
				if (item.path) {
					let switchList = ['余额提现']
					if (switchList.includes(item.name)) {
						uni.switchTab({
							url: item.path
						})
					} else {
						this.$storeSetProjectInfo({})
						this.$store.commit('setUserPersonInfo', {})
						this.$store.commit('setNodeInfo', {})
						this.$store.commit('setUserPersonInfo', {})
						this.toPage(item.path)
					}
				} else {
					this.toPage(`../emptyPage/emptyPage?title=${item.name}`)
				}
			},
			// mescroll组件init
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			// 获取工种列表
			getWorkType() {
				this.$httpApi
					.getWorkType({
						clientType: 'platform'
					})
					.then((res) => {
						if (res) {
							this.workTypeList = res.records
							res.records.forEach((item) => {
								this.screenPeopletType.options1.push({
									label: item.skillName,
									value: item.skillId
								})
								this.screenWorkType.options3.push({
									label: item.skillName,
									value: item.skillId
								})
							})
						}
					})
			},
			getRequirementType() {
				this.$httpApi
					.getOrderType({
						size: 99
					})
					.then((res) => {
						if (res) {
							res.forEach((item) => {
								this.screenWorkType.options2.push({
									label: item.label,
									value: item.value
								})
							})
						}
					})
			},
			// 重载所有数据
			reload(isLoad = false) {
				if (isLoad) {
					// 重新加载订单和工人
					// uni.showLoading()
					this.currentPersonPage = 1
					this.currentOrderPage = 1
					// setTimeout(() => {
					// 	uni.hideLoading()
					// }, 500)
				}

				// 获取需求类型
				this.getDemandData()
				// 获取订单
				this.fetchOrderData()
				// 查询banner图
				this.fetchBannerData()
				// 查询交易快报
				this.fetchExpressData()
				// 刷新工地权限
				this.selectSiteShow()
			},
			// 下拉时重新刷新
			downCallback() {
				if (this.currentTab === 2) {
					//  当前tab为更多功能时不重新加载
				} else {
					this.reload(true)
				}
				// 停止重载动画
				setTimeout(() => {
					this.mescroll.endBySize(10, true)
				}, 1000)
			},
			upCallback() {},
			// 上滑加载更多
			scrollToLower() {
				if (this.currentTab === 0) {
					// 加载订单列表
					if (this.orders.length >= this.ordersTotal) {
						this.orderPageStatus = 'nomore'
						return
					} else {
						this.orderPageStatus = 'loading'
						setTimeout(() => {
							this.currentOrderPage++
							this.fetchOrderData()
						}, 200)
					}
				} else if (this.currentTab === 1) {
					// 加载工人列表
					if (this.people.length >= this.peopleTotal) {
						this.peoplePageStatus = 'nomore'
						return
					} else {
						this.peoplePageStatus = 'loading'
						setTimeout(() => {
							this.currentPersonPage++
							this.getDemandData()
						}, 200)
					}
				}
			},
			// 交易快报内容处理
			getExpressItem(item) {
				return item.skillName ? item.skillName + item.nickName.slice(0, 1) + Array(item.nickName.length).join(
						'*') :
					item.nickName.slice(0, 1) + Array(item.nickName.length).join('*')
			},
			// 跳转cms二级页
			goProcess(type) {
				uni.navigateTo({
					url: `/pages/home/processstabdard?typeName=${type}`
				})
			},
			// 跳转订单
			goToSendOrder() {
				uni.navigateTo({
					url: '/pages/publishTask/sendOrder'
				})
			},
			// 赚钱英雄榜/明星工人榜
			getRank() {
				// currentTab = 0 -> 赚钱英雄榜 currentTab = 1 -> 明星工人榜

			},
			// 跳转找人/找活二级页面
			goToViewMore(item) {
				if (this.currentTab === 0) {
					// 我要找活
					this.toPage(
						`/pages/home/moreWork?typeId=${item.skillId}&typeName=${item.skillName}`
					)
				} else {
					// 我要找人
					let url
					if (item.skillId === '') {
						// 查找工人
						url = `/pages/home/morePeople?jobCode=JOB_WORKER`
					} else if (item.skillId === '-1') {
						// 查找所有
						url = `/pages/home/morePeople`
					} else {
						// 查找特定岗位
						url = `/pages/home/morePeople?typeId=${item.skillId}&typeName=${item.skillName}`
					}
					this.toPage(url)
				}
			},
			// 跳转搜索页
			goToSearchPage() {
				this.toSearchPageStatus = false
				uni.navigateTo({
					url: '/pages/searchPage/searchPage'
				})
			},
			// 获取Banner信息
			fetchBannerData() {
				this.$httpApi
					.getBannerList({
						clientType: 'app',
						cityOperatorId: this.cityOperatorId
					})
					.then((res) => {
						// TODO 以前的banner和现在的banner结构不同 需要重构
						if (!res && res.records) return
						this.swiperImgList = []
						this.swiperImgListMini = []
						this.swiperImgList2 = []
						this.swiperImgListMini2 = []
						this.swiperImgListBottom = []
						res.records.forEach((each) => {
							switch (each.sizeType) {
								case 0: // 横屏
									if (each.description === '更多功能') {
										this.swiperImgListBottom.push({
											image: this.$image.imageGlobal + each.imgUrl,
											...each
										})
									}
									if (each.description === '找活') {
										this.swiperImgListMini.push({
											image: this.$image.imageGlobal + each.imgUrl,
											...each
										})
									}
									if (each.description === '找人') {
										this.swiperImgListMini2.push({
											image: this.$image.imageGlobal + each.imgUrl,
											...each
										})
									}
									break
								case 1: // 竖屏
									if (each.description === '找活') {
										// 找活-竖屏
										this.swiperImgList.push({
											image: this.$image.imageGlobal + each.imgUrl,
											...each
										})
									} else if (each.description === '找人') {
										// 找人-竖屏
										this.swiperImgList2.push({
											image: this.$image.imageGlobal + each.imgUrl,
											...each
										})
									}
									break
								case 2: // mini屏
									if (each.description === '找活') {
										// 找活-mini屏
										this.swiperImgListMini.push({
											image: this.$util.thumbnailImage(each.imgUrl, true),
											...each
										})
									} else if (each.description === '找人') {
										// 找人-mini屏
										// this.swiperImgListMini2.push({
										// 	image: this.$image.imageGlobal + each.imgUrl,
										// 	...each
										// })
									} else if (each.description === '需求') {
										this.swiperImgListMini2.push({
											image: this.$image.imageGlobal + each.imgUrl,
											...each
										})
									}
									break
							}
						})
					})
			},
			// 获取交易快报信息
			fetchExpressData() {
				this.$httpApi
					.getExpressList({
						cityOperatorId: this.cityOperatorId,
						size: 99
					})
					.then((res) => {
						if (!res) {
							return
						}
						this.expressData = res.records.filter((item) => {
							return item.status === '0'
						})
					})
			},
			// 获取需求信息
			getDemandData(is, type) {
				this.$httpApi.getDemandPage({
						cityOperatorId: uni.getStorageSync('cityOperatorId') || uni.getStorageSync('userAddress')
							.areaCode || -1,
						current: this.currentPersonPage,
						size: this.pageSize,
						status: 1,
						latitude: type == 'distance' ? this.latitude : '',
						longitude: type == 'distance' ? this.longitude : '',
						'orders[0].asc': !is ? false : true,
						'orders[0].column': type ? type : 'id'
					})
					.then((res) => {
						if (!res) {
							return
						}

						res.records.map(item => {
							item['serviceNum'] = 0
						})
						// res.records = this.setServiceNum(res.records)
						this.peopleTotal = res.total
						if (this.currentPersonPage > 1) {
							if (this.currentPersonPage != this.recordCurrentPersonPage) {
								this.people = this.people.concat(res.records)
								this.recordCurrentPersonPage = this.currentPersonPage
							}
						} else {
							this.recordCurrentPersonPage = this.currentPersonPage
							this.people = res.records
						}
						if (this.people.length == this.peopleTotal) {
							this.peoplePageStatus = 'nomore'
						}
						if (this.peopleTotal == 0) {
							this.peoplePageStatus = 'nomore'
						}
					})
			},
			// 获取工人信息
			fetchPersonData() {
				this.$httpApi
					.getPeopleList({
						current: this.currentPersonPage,
						size: this.pageSize,
						skillId: this.screenPeopletType.optionModel1,
						skillYearNum: this.screenPeopletType.optionModel2,
						level: this.screenPeopletType.optionModel3
					})
					.then((res) => {
						if (!res) {
							return
						}
						res.records.map(item => {
							item['serviceNum'] = 0
						})
						res.records = this.setServiceNum(res.records)
						this.peopleTotal = res.total
						if (this.currentPersonPage > 1) {
							// this.people = [...this.people, ...res.records]
							if (this.currentPersonPage !== this.recordCurrentPersonPage) {
								this.people = this.people.concat(res.records)
								this.recordCurrentPersonPage = this.currentPersonPage
							}
						} else {
							this.recordCurrentPersonPage = this.currentPersonPage
							this.people = res.records
						}
						if (this.people.length === Number(this.peopleTotal)) {
							this.peoplePageStatus = 'nomore'
						}
						if (this.peopleTotal == 0) {
							this.peoplePageStatus = 'nomore'
						}
						// }, 200)
					})
			},
			setServiceNum(list) {
				if (list.length > 0) {
					let tempUserId = []
					list.map(item => {
						tempUserId.push(item.userId)
					})
					tempUserId = [...new Set(tempUserId)]
					if (tempUserId.length > 0) {
						this.$httpApi.getUseridsServing(tempUserId).then(res => {
							if (res) {
								if (res.length > 0) {
									list.map(item => {
										res.map(el => {
											if (item.userId == el.userId && item.skillId == el
												.skillId) {
												++item.serviceNum
											}
										})
									})
								}
							}
						})
						return list
					}
				}
			},
			// 获取订单信息
			fetchOrderData() {
				this.getAddress(() => {
					if (!this.cityOperatorId) {
						return
					}
					this.$httpApi
						.getOrderList({
							cityOperatorId: this.cityOperatorId,
							latitude: this.latitude,
							longitude: this.longitude,
							current: this.currentOrderPage,
							size: this.pageSize,
							priceWay: this.screenWorkType.optionModel1, // 议价类型
							requirementType: this.screenWorkType.optionModel2, // 需求类型
							skillType: this.screenWorkType.optionModel3, // 技能要求
							'orders[0].asc': this.screenWorkType.optionModel4 === 'AMOUNT' ? false : true,
							'orders[0].column': this.screenWorkType.optionModel4 // 金额正序或距离倒序
						})
						.then((res) => {
							if (!res) {
								return
							}
							res.records.map((item) => {
								item['timeNew'] = moment(item.created).format('MMMDo HH:mm')
								item['beforeTime'] = moment(item.created).startOf('minute').fromNow()
							})
							
							this.ordersTotal = res.total
							if (this.currentOrderPage > 1) {
								if (this.currentOrderPage !== this.recordCurrentOrderPage) {
									this.orders = this.orders.concat(res.records)
									this.recordCurrentOrderPage = this.currentOrderPage
								}
							} else {
								this.orders = res.records
								this.recordCurrentOrderPage = this.currentOrderPage
							}
							if (this.orders.length === Number(this.ordersTotal)) {
								this.orderPageStatus = 'nomore'
							}
							if (this.ordersTotal == 0) {
								this.orderPageStatus = 'nomore'
							}
							// this.orders.map((item) => {
							// 	item['timeNew'] = moment(item.created).format('MMMDo HH:mm')
							// 	item['beforeTime'] = moment(item.created).startOf('minute').fromNow()
							// 	this.$util.conversionUnit(item.latitude, item.longitude,(res)=>{
							// 		item.distanceNew = res
							// 	})
							// })
						})
				})

			},
			chooseAddress() {
				uni.navigateTo({
					url: '/pages/operatorSelectCity/operatorSelectCity'
				})
			},
			// 点击轮播图的跳转
			goToSomePage(index, type) {
				let target = []
				if (type === 1) {
					// 竖屏
					target =
						this.currentTab === 0 ? this.swiperImgList : this.swiperImgList2
				} else if (type === 2) {
					// mini
					target =
						this.currentTab === 0 ?
						this.swiperImgListMini :
						this.swiperImgListMini2
				} else if (type === 0) {
					// 横屏
					target = this.swiperImgListBottom
				}
				if (!target[index].url) return
				this.$httpApi
					.getCMSContentById({
						id: target[index].url
					})
					.then((res) => {
						if (res) {
							let data = JSON.parse(res.content)[0]
							let type = data.type
							if (type === 'link') {
								// 跳转app页面
								uni.navigateTo({
									url: data.listdata[0].appPage
								})
							} else {
								// 跳转内容页面
								uni.navigateTo({
									url: '/pages/mine/cms?list=' + JSON.stringify(res)
								})
							}
						}
					})
			},
			// swiper滑动
			changeSwiper(e) {
				this.currentTab = e.detail.current
				this.getScroll(e.detail.current)
			},
			// 找活=0 找人=1 更多功能=2
			changeTab(index) {
				this.currentTab = index
				this.getScroll(index)
			},
			// 跳转到订单详情页面
			goOrderReceiving(item) {
				this.toPage(
					`/pages/orderReceiving/releaseOrderDetails?id=${item.id}`
				)
			},
			selectClick(e, type) {
				this.current = 1
				// this.getDataList()
				if (this.currentTab) {
					switch (type) {
						case 1:
							// 人才类型
							if (e !== '') {
								this.screenPeopletType.title1 =
									this.screenPeopletType.options1.find(
										(item) => item.value === e
									).label
							} else {
								this.screenPeopletType.title1 = '人才类型'
							}
							break
						case 2:
							if (e !== '') {
								this.screenPeopletType.title2 =
									this.screenPeopletType.options2.find(
										(item) => item.value === e
									).label
							} else {
								this.screenPeopletType.title2 = '工作经验'
							}
							break
						case 3:
							if (e !== '') {
								this.screenPeopletType.title3 =
									this.screenPeopletType.options3.find(
										(item) => item.value === e
									).label
							} else {
								this.screenPeopletType.title3 = '筛选'
							}
							break
					}
					this.getDemandData()
				} else {
					switch (type) {
						case 1:
							// 定价类型
							if (e !== '') {
								this.screenWorkType.title1 = this.screenWorkType.options1.find(
									(item) => item.value === e
								).label
							} else {
								this.screenWorkType.title1 = '定价类型'
							}
							break
						case 2:
							// 订单类型
							if (e !== '') {
								this.screenWorkType.title2 = this.screenWorkType.options2.find(
									(item) => item.value === e
								).label
							} else {
								this.screenWorkType.title2 = '订单类型'
							}
							break
						case 3:
							// 技能要求
							if (e !== '') {
								this.screenWorkType.title3 = this.screenWorkType.options3.find(
									(item) => item.value === e
								).label
							} else {
								this.screenWorkType.title3 = '技能要求'
							}
							break
						case 4:
							// 排序
							if (e !== '') {
								this.screenWorkType.title4 = this.screenWorkType.options4.find(
									(item) => item.value === e
								).label
							} else {
								this.screenWorkType.title4 = '排序'
							}
							break
					}
					this.fetchOrderData()
				}
			},
			getClose() {
				// #ifdef APP-PLUS
				uni.showTabBar({
					animation: true
				})
				// #endif
				this.workCardStatus = true
				setTimeout(() => {
					this.refreshStatus = true
				}, 500)
			},
			getOpen(type) {
				if (type == '找活') {
					this.$nextTick(() => {
						this.scrollIntoView = 'u-dropdown-custom_0'
					})

					this.refreshStatus = false
					// #ifdef APP-PLUS
					uni.hideTabBar({
						animation: true
					})
					// #endif

					// 提前修改高度，避免动画卡顿
					this.$refs.uDropdown && this.$refs.uDropdown.updateContentHeight()
					setTimeout(() => {
						this.scrollIntoView = ''
						this.$refs.uDropdown && this.$refs.uDropdown.setIsMaskHeight()
						this.workCardStatus = false
					}, 500)
					// let rectInfo = await uni.$u.getRect('.u-dropdown__menu')
				}
			},
			getScroll(index) {
				if (index == 2) {
					this.$refs.refresh && this.$refs.refresh.getHidden()
				} else {
					this.$refs.refresh && this.$refs.refresh.getShow()
					return
					this.getAccording()
					this.$refs.refresh && this.$refs.refresh.getRoll()
				}
			},
			getAccording() {
				this.debounce(() => {
					if (!this.flagIndex) {
						let timer = setTimeout(() => {
							let query1 = uni.createSelectorQuery().in(this);
							let selectId = this.currentTab == 0 ? '#coordinates_0' : '#coordinates_1'
							query1.select(selectId).boundingClientRect((data) => {
								this.refreshTop = data.top
								this.$refs.refresh && this.$refs.refresh.getShow(data.top)
								this.flagIndex = 0
								clearTimeout(timer);
							}).exec()
						}, 1000)
					}
					this.flagIndex = 1
				}, 200)
			},
			refresh() {
				if ([0, 1].includes(this.currentTab)) {
					if (this.currentTab) {
						this.getDemandData()
					} else {
						this.fetchOrderData()
					}
				}
			},
			
			/**
			 * @description 根据城市id,查询运营商id，判断是否有查看工地的权限
			 * */
			selectSiteShow() {
				if (!uni.getStorageSync('userInfo') || !uni.getStorageSync('cityOperatorId')) {
					return
				}
				this.$httpApi.hasPermission({
					permission: 'order_bizproject_view',
					cityOperatorId: uni.getStorageSync('cityOperatorId')
				}).then(res => {
					if (res) {
						this.siteList.forEach(item => {
							item['show'] = true
						})
					}
				})

			}
		}
	}
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.right-contian {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: calc(100vw - 220rpx);

		.icon-serach {
			margin-right: 36rpx;
			width: 44rpx;
			height: 44rpx;
		}
	}

	.address-select {
		z-index: 999;
		justify-content: center;
		margin-left: 20rpx;
		width: 140rpx;
		height: 44rpx;

		.title {
			width: max-content;
			max-width: 160rpx;
			line-height: 32rpx;
			text-align: center;
			font-family: "PingFang SC";
			font-style: normal;
			font-weight: bold;
			font-size: 24rpx;
			color: #333;
			@include toe();
		}

		.icon {
			margin-left: 10rpx;
			margin-top: 4rpx;
			width: 23rpx;
			height: 13rpx;
		}
	}

	.location-permissions {
		display: flex;
		position: absolute;
		left: 32rpx;
		top: 158rpx;
		z-index: 999;
		justify-content: space-between;
		align-items: center;
		padding: 0rpx 16rpx 0rpx 30rpx;
		border-radius: 10rpx;
		width: 686rpx;
		height: 82rpx;
		background-color: rgba(0, 0, 0, .6);

		&::before {
			position: absolute;
			left: 34rpx;
			top: -32rpx;
			z-index: -1;
			border-left: 18rpx solid transparent;
			border-right: 18rpx solid transparent;
			border-top: 16rpx solid transparent;
			border-bottom: 16rpx solid rgba(0, 0, 0, .5);
			width: 0;
			height: 0;
			content: '';
		}

		text {
			font-size: 28rpx;
			color: #FFF;
		}

		.location-right {
			display: flex;
			align-items: center;

			.item-button {
				margin-right: 20rpx;
				border-radius: 10rpx;
				width: 90rpx;
				height: 46rpx;
				background-color: #002FA5;
				line-height: 46rpx;
				text-align: center;
				font-size: 24rpx;
				color: #fff;
			}
		}

		image {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.search-box {
		margin-right: 40rpx;
		// width: 480rpx;
		width: 536rpx;
	}

	.nav-bar-right {
		flex-direction: column;
		margin-right: 20rpx;
		width: 100rpx;
		line-height: 34rpx;
		font-family: "PingFang SC";
		font-style: normal;
		font-weight: bold;
		font-size: $smallFontSize;
		color: $themeColor;

		.icon {
			width: 40rpx;
			height: 38rpx;
		}
	}

	.header_left_box {}

	.swiper-contain {
		// margin: 0 20rpx;
	}

	.notice-bar {
		justify-content: space-around;
		margin: 12rpx 0rpx 0rpx;
		border-radius: 10rpx;
		// width: 100vw;
		height: 108rpx;
		background: #fff;

		.img {
			width: 120rpx;
			height: 28rpx;
			// margin-left: 60rpx;
		}

		.content {
			width: 500rpx;
			height: 108rpx;

			.swiper-item {
				height: 108rpx;

				.nickname {
					line-height: 108rpx;
					font-family: "PingFang SC";
					font-style: normal;
					font-size: 28rpx;
					color: #666;
				}

				.price {
					margin: auto 20rpx auto auto;
					line-height: 108rpx;
					font-family: "PingFang SC";
					font-style: normal;
					font-size: 28rpx;
					color: $themeColor;
				}
			}
		}
	}

	.banner-container {
		flex-direction: column;
		justify-content: space-between;
		margin-top: 4rpx;
		// height: 850rpx;
		padding: 20rpx;
		width: 100vw;
		background-color: #fff;

		.left {
			width: 48%;
			height: 640rpx;

			.swiper {
				border-radius: 10rpx;
				width: 100%;
				height: 640rpx;
			}
		}

		.right {
			flex-direction: column;
			width: 48%;
			height: 640rpx;

			.upper {
				width: 100%;
				height: 46%;

				.swiper {
					border-radius: 10rpx;
					width: 100%;
					height: 100%;
				}
			}

			.middle {
				margin-bottom: 20rpx;
				width: 100%;
				height: 8%;
				line-height: 8%;
				font-family: "PingFang SC";
				font-style: normal;
				font-size: 28rpx;
				color: $seconFontColor;

				text {
					margin-left: 20rpx;
					line-height: 8%;
					font-family: "PingFang SC";
					font-style: normal;
					font-size: 26rpx;
					color: $fontColor99;
				}
			}

			.lower {
				flex-direction: column;
				width: 100%;
				height: 46%;

				.button-row {
					justify-content: space-between;
					align-items: flex-start;
					width: 100%;
					height: 50%;

					.button-item {
						flex-direction: column;
						justify-content: center;
						border-radius: 10rpx;
						width: 162rpx;
						height: 130rpx;
						line-height: 40rpx;
						text-align: center;
						font-family: "PingFang SC";
						font-style: normal;
						font-size: 25rpx;
						color: $seconFontColor;

						.icon {
							margin-bottom: 20rpx;
							width: 44rpx;
							height: 44rpx;
						}
					}
				}
			}
		}

		.bottom {
			justify-content: space-around;
			margin: 20rpx auto 0;
			border-radius: 10rpx;
			width: 100%;
			height: 172rpx;

			.button-item {
				justify-content: space-around;
				border-radius: 10rpx;
				width: 330rpx;
				height: 132rpx;

				.left {
					flex-direction: column;
					align-items: flex-start;
					width: 160rpx;
					height: 84rpx;

					.upper {
						line-height: 42rpx;
						font-family: "PingFang SC";
						font-style: normal;
						font-size: $middleFontSize;
					}

					.lower {
						.icon {
							margin-left: 10rpx;
							width: 28rpx;
							height: 26rpx;
						}

						text {
							line-height: 36rpx;
							font-family: "PingFang SC";
							font-style: normal;
							font-weight: 500;
							font-size: 26rpx;
						}
					}
				}

				.right {
					width: 80rpx;
					height: 80rpx;
				}
			}
		}
	}

	.new-order-btn {
		justify-content: center;
		margin: 10rpx 20rpx 0;
		border-radius: 10rpx;
		width: 710rpx;
		height: 108rpx;
		background-color: #fff;
		line-height: 108px;
		text-align: center;
		font-family: "PingFang SC";
		font-style: normal;
		font-weight: bold;
		font-size: 30rpx;
		color: $themeColor;

		.icon {
			margin-right: 10rpx;
			width: 44rpx;
			height: 44rpx;
		}
	}

	.sticky-content {
		// position: -webkit-sticky;
		position: fixed;
		top: calc(88rpx + var(--status-bar-height));
		z-index: 99;
		// position: sticky;
		width: 100%;
	}

	.mescroll-uni-warp {
		height: calc(100vh - var(--status-bar-height) - 88rpx - 88rpx - 10rpx);
	}

	.main-swiper-display {
		position: fixed;
	}

	.main-swiper,
	.scroll-container {
		width: 100vw;
		height: calc(100vh - var(--status-bar-height) - 88rpx - 88rpx - 10rpx);
		// height: calc(100vh - var(--status-bar-height) - 108rpx - 88rpx);
		// 100vh - 状态栏高度 - 顶部导航栏高度 - 筛选tab高度 - 底部导航栏高度 -轮播图padding
	}

	.list-header {
		justify-content: space-between;
		margin: 20rpx 0rpx;
		padding: 0 20rpx;
		// width: 710rpx;
		height: 60rpx;

		.list-header-text {
			line-height: 42rpx;
			font-family: "PingFang SC";
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			color: $seconFontColor;
			white-space: nowrap;
		}

		.left {
			width: 85%;
			height: 42rpx;

			.icon-left {
				margin-right: 10rpx;
				width: 32rpx;
				height: 24rpx;
			}
		}

		.right {
			justify-content: flex-end;
			width: 15%;
			height: 42rpx;
			line-height: 36rpx;
			font-family: "PingFang SC";
			font-style: normal;
			font-weight: 500;
			font-size: 26rpx;
			color: #999;

			.icon-right {
				margin-left: 10rpx;
				width: 16rpx;
				height: 16rpx;
			}
		}
	}

	.main-container {
		padding-bottom: 40rpx;
		border-radius: 10rpx;
		width: 100vw;
		height: max-content;

		.card {
			flex-direction: column;
			margin: 0 20rpx;
			margin-top: 20rpx;
			padding: 20rpx;
			padding-bottom: 0;
			border-radius: 10rpx;
			width: 710rpx;
			height: max-content;
			background-color: #fff;

			.title-container {
				justify-content: flex-start;
				padding: 0 20rpx;
				width: 100%;
				height: 44rpx;

				.icon {
					margin-right: 10rpx;
					width: 32rpx;
					height: 24rpx;
				}

				.title {
					line-height: 44rpx;
					font-family: "PingFang SC";
					font-style: normal;
					font-weight: bold;
					font-size: 32rpx;
					color: $seconFontColor;
				}

				text {
					margin-left: 10rpx;
					line-height: 44rpx;
					font-family: "PingFang SC";
					font-style: normal;
					font-weight: 500;
					font-size: 26rpx;
					color: #303133;
				}
			}

			.card-items {
				flex-wrap: wrap;
				margin-top: 20rpx;
				padding: 20rpx;
				padding-bottom: 0;
				width: 100%;
				height: max-content;

				.item {
					flex-direction: column;
					justify-content: center;
					margin-bottom: 40rpx;
					width: 25%;
					height: 140rpx;
					line-height: 40rpx;
					font-family: "PingFang SC";
					font-style: normal;
					font-weight: 400;
					font-size: 28rpx;
					color: $seconFontColor;

					.icon-warpper {
						justify-content: center;
						margin-bottom: 20rpx;
						border-radius: 50%;
						width: 84rpx;
						height: 84rpx;
						background: #fbf8f9;

						.icon {
							width: 40rpx;
							height: 40rpx;
						}
					}
				}
			}
		}

		.swiper {
			margin: 10rpx 20rpx 0rpx;
			border-radius: 10rpx;
			width: 710rpx;
			height: 240rpx;
		}
	}

	.commodity-water-fall {
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		width: 710rpx;
		height: max-content;
		background-color: #fff;
	}

	.bottom-container {
		justify-content: center;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		height: 88rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.dropdown-menu {
		// margin: 0rpx 20rpx 2rpx 20rpx;
		border-radius: 10rpx;
		background-color: #fff;
	}

	.u-dropdown {
		width: initial;
	}

	.home-page {
		height: 100%;
	}

	.u-dropdown-custom {
		position: sticky;
		position: sticky;
		// top: calc(88rpx + var(--status-bar-height));
		// top: calc(var(--status-bar-height));
		top: 0rpx;
		z-index: 99;
		width: 100%;
	}

	.mask-contain {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: 9;
		width: 100%;
		background: rgba(0, 0, 0, .3);
		// height: 100vh;
	}

	.sort-view {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 92rpx;

		.sort-item {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 30%;

			.label {
				margin-right: 12rpx;
				font-size: 26rpx;
				color: #606166;
			}

			.sort-btn {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				image {
					width: 14rpx;
					height: 8rpx;
				}
			}
		}
	}
</style>
