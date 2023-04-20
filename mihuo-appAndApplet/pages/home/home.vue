<template>
	<view>
		<z-nav-bar :showTouTiao="true" backState="2000">
			<view slot="left" class="flex-center address_select" @click="chooseAddress">
				<mihuo-image class="icon" src="https://www.51mihuo.com/static/icon/home_v3/location-24x30.png">
				</mihuo-image>
				<view class="title">{{ selectedAddressCity }}</view>
			</view>
			<view slot="right" class="flex-center right-container">
				<mihuo-search @click="goToSearchPage" class="search-bar" :mode="2" button="none" :disabled="false">
				</mihuo-search>
				<!-- #ifdef APP-PLUS -->
				<mihuo-image @click="goToShoppingCart" class="icon" :count="shoppingCartCount"
					src="/static/app-plus/home_v3/sc-62x62.png" />
				<!-- #endif -->
				<!-- #ifndef APP-PLUS -->
				<mihuo-image @click="goToShoppingCart" class="icon" :count="shoppingCartCount"
					src="https://www.51mihuo.com/static/icon/home_v3/sc-62x62.png" />
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<mihuo-image @click="goToMiyou" class="icon" src="/static/app-plus/home_v3/miyou-62x62.png" />
				<!-- #endif -->
				<!-- #ifndef APP-PLUS -->
				<mihuo-image @click="goToMiyou" class="icon"
					src="https://www.51mihuo.com/static/icon/home_v3/miyou-62x62.png" />
				<!-- #endif -->
				<mihuo-image @click="goToCustomerService" class="icon-2"
					src="https://www.51mihuo.com/static/icon/home_v3/cs-34x34.png" />
			</view>
		</z-nav-bar>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="104" :topbar="true" :down="downOption" :up="upOption"
			@down="downCallback" @up="upCallback">
			<scroll-view scroll-y="true" class="scroll-container" @scrolltolower="scrollToLower" @scroll="scrollRange"
				:scroll-into-view="scrollIntoView">
				<!-- 轮播图 -->
				<view id="scroll-top"></view>
				<view class="header-container">
					<u-swiper height="230" v-if="swiperImgList.length > 0" :list="swiperImgList" :autoplay="true"
						:interval="5000" :duration="500" :circular="true" border-radius="20" img-mode="aspectFill"
						@click="goToSomePage" :effect3d="true" :between="false" slide-between="60">
					</u-swiper>
				</view>

				<!-- 工艺标准、统一工价、品质保障、售后无忧 -->
				<view class="flex-center article-container">
					<view v-for="(item, index) in qualityGuaranteeList" :key="index" class="flex-center guarantee-item"
						@click="qualityGuarantee(item)">
						<!-- #ifdef APP-PLUS -->
						<mihuo-image class="icon" :src="'/static/app-plus' + item.url">
						</mihuo-image>
						<!-- #endif -->
						<!-- #ifndef APP-PLUS -->
						<mihuo-image class="icon" :src="'https://www.51mihuo.com/static/icon' + item.url">
						</mihuo-image>
						<!-- #endif -->
						<view class="text"> {{ item.typeName }} </view>
					</view>
				</view>

				<!-- 全屋装修、精装改造、旧房局改 -->
				<view class="flex-center decoration-contaienr">
					<view v-for="(item, index) in decorationList" :key="index" class="decoration-item"
						@click="goToPage(item)">
						<!-- #ifdef APP-PLUS -->
						<mihuo-image class="bg-image" :src="'/static/app-plus' + item.image">
						</mihuo-image>
						<!-- #endif -->
						<!-- #ifndef APP-PLUS -->
						<mihuo-image class="bg-image" :src="'https://www.51mihuo.com/static/icon' + item.image">
						</mihuo-image>
						<!-- #endif -->
						<view class="text"> {{ item.title }} </view>
					</view>
				</view>

				<!-- 发布需求和AI灵感-->
				<view class="aiAndNeed">
					<view class="entry" @click="toAiInspirtion">
						<image class="image" src="https://www.51mihuo.com/static/images/ai_entry.png" />
						<text class="text">AI找灵感</text>
					</view>
					<view class="flex-center how-much-container" @click="gotoRepairNotFilled">
						<view class="how-much_left">
							<view>免费上门报价&nbsp;&nbsp;一键呼叫</view>
							<text>装修问题，尽在觅活</text>
						</view>
						<view class="how-much_right">
							<text>发布需求</text>
						</view>
					</view>
				</view>

				<!-- 拆除服务、水电服务、泥工服务、木工服务、油漆服务 -->
				<view class="flex-center service-container">
					<view v-for="(item, index) in type2Worker" :key="index" class="flex-center button-item"
						@click="callNowMaster(item)">
						<mihuo-image v-if="item.img" class="icon" :src="item.img">
						</mihuo-image>
						<mihuo-image v-else class="icon" src="https://www.51mihuo.com/static/icon/work_type/cchu.png" />
						<view class="text"> {{ item.skillName }}服务 </view>
					</view>
				</view>

				<!-- 管家服务、设计师服务、装修估价 -->
				<view class="flex-center demand-container">
					<view v-for="(item, index) in type1Worker" :key="index" class="flex-center service-item steward"
						:class="[index === 0 ? 'steward' : 'designer']" @click="callNowMaster(item)">
						<view class="service-text">{{ item.skillName }}服务</view>
						<view class="desc-text">{{ item.remarks }}</view>
					</view>
					<view class="flex-center post-demand" @click="changeToValuation">
						<view class="text">装修估价</view>
						<!-- #ifdef APP-PLUS -->
						<mihuo-image class="icon" src="/static/app-plus/home_v3/AI_log_65x65.png">
						</mihuo-image>
						<!-- #endif -->
						<!-- #ifndef APP-PLUS -->
						<mihuo-image class="icon" src="https://www.51mihuo.com/static/icon/home_v3/AI_log_65x65.png">
						</mihuo-image>
						<!-- #endif -->
					</view>
				</view>

				<!-- 热销商品 -->
				<view class="hot-sale" v-if="false">
					<view class="home-title main-title">
						热销商品
					</view>
					<view class="sale-product flex-center">
						<view class="left-container flex-center">
							<view class="product-item flex-center" v-for="item in 10" :key="item">
								<u-lazy-load imgMode="widthFix" height="178" :hasBottomRadius="true" border-radius="15"
									:image="$util.thumbnailImage('', true, 178)" class="product-img">
								</u-lazy-load>
								<view class="product-info">
									<view class="product-name">
										商品名称
									</view>
									<view class="product-price">
										<text style="font-size: 22rpx; margin-left: 4rpx;">¥</text>
										<text style="font-size: 34rpx;">196</text>
									</view>
								</view>
							</view>
						</view>
						<view class="right-container flex-center">
							<u-lazy-load imgMode="widthFix" height="178" :hasBottomRadius="true" border-radius="15"
								:image="$util.thumbnailImage('', true, 178)" class="package-img">
							</u-lazy-load>
							<view class="package-name">
								套餐名称
							</view>
							<view class="package-price">
								<text class="text" style="font-size: 22rpx; margin-left: 4rpx;">¥</text>
								<text class="text" style="font-size: 34rpx;">19600</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 团购、秒杀 -->
				<view class="mall-activity flex-center">
					<view class="activity-item" style="margin-right: 20rpx;" @click="goToGroupDealList"
						v-if="groupDealList.length">
						<view class="home-title main-title">
							团购享优惠
						</view>
						<view class="product-container flex-center">
							<view class="product-item" v-for="item, index in groupDealList.slice(0, 2)" :key="index"
								@click.stop="goToProductDetail(item)">
								<u-lazy-load imgMode="widthFix" height="137" :hasBottomRadius="true" border-radius="15"
									:image="$util.thumbnailImage(item.productCoverImg, true, 137)" class="item-img">
								</u-lazy-load>
								<view class="item-info">
									<text class="text" style="font-size: 20rpx; margin-left: 4rpx;">¥</text>
									<text class="text" style="font-size: 30rpx;">
										{{ item.flashPromotionPrice }}
									</text>
								</view>
							</view>
						</view>
					</view>
					<view class="activity-item" v-if="flashSaleList.length" @click="goToSeckill">
						<view class="home-title main-title flex-center"
							style="justify-content: space-between; padding-right: 10rpx;">
							秒杀抢低价
							<view class="count-down">
								<u-count-down height="34" v-if="isShowCountDown" :timestamp="flashSaleEndTime"
									:show-border="true" :showDays="false" borderColor="#FE6E32" fontSize="18"
									color="#FFFFFF" bgColor="#FE6E32" separatorColor="#FE6E32"></u-count-down>
							</view>
						</view>
						<view class="product-container flex-center">
							<view class="flash-sale" v-for="item, index in flashSaleList" :key="index"
								@click.stop="goToProductDetail(item)">
								<u-lazy-load imgMode="widthFix" height="137" :hasBottomRadius="true" border-radius="15"
									:image="$util.thumbnailImage(item.productCoverImg, true, 137)" class="item-img">
								</u-lazy-load>
								<view class="item-info">
									<text class="text" style="font-size: 20rpx; margin-left: 4rpx;">¥</text>
									<text class="text" style="font-size: 30rpx;">
										{{ item.skuPrice }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 材料分类 -->
				<view class="flex-center material-container">
					<view v-for="(item, index) in materialTypeList" :key="item.categoryId"
						class="flex-center button-item" @click="changeTabMaterial({ item })">
						<!-- 小程序抽疯了 不这样写item会是undefined -->
						<!-- #ifdef APP-PLUS -->
						<mihuo-image class="icon" :src="'/static/app-plus' + item.icon">
						</mihuo-image>
						<!-- #endif -->
						<!-- #ifndef APP-PLUS -->
						<mihuo-image class="icon" :src="'https://www.51mihuo.com/static/icon' + item.icon">
						</mihuo-image>
						<!-- #endif -->
						<view v-if="index + 1 !== 5" class="text"> {{ item.name }} </view>
						<view v-else class="flex-center btn-more">
							<text class="text">MORE</text>
							<u-icon name="arrow-right" color="#000" size="18"></u-icon>
						</view>
					</view>
				</view>

				<!-- tab分类：案例、推荐、觅友圈 -->
				<view class="tabs-container" id="sticky_id" :class="{ sticky: isSticky }"
					:style="{ top: stickyHeight }">
					<u-tabs-swiper ref="uTabs" name="typeName" :list="tabList" :is-scroll="false" :current="current"
						swiperWidth="750" bgColor="#fff" active-color="#141414" inactive-color="#141414" fontSize="28"
						:bar-style="{ width: '24rpx', height: '10rpx', borderRadius: '5rpx', background: 'linear-gradient(90deg, #FE6E32, #FFDED1)' }"
						:active-item-style="{ fontSize: '32rpx' }" @change="tabsChange" />
					<view class="dropdown-container" v-if="current === 0 && isSticky">
						<u-dropdown active-color="#141414" ref="uDropdown" :customIndex="3"
							@customCallback="changePriceSort">
							<u-dropdown-item ref="houseItemRef" height="1200" v-model="houseValue" :title="houseTitle"
								:options="houseOptions" @change="onChangeHouse">
							</u-dropdown-item>
							<u-dropdown-item ref="areaItemRef" height="1200" v-model="areaValue" :title="areaTitle"
								:options="areaOptions" @change="onChangeArea">
							</u-dropdown-item>
							<u-dropdown-item ref="styleItemRef" height="1200" v-model="styleValue" :title="styleTitle"
								:options="styleOptions" @change="onChangeStyle">
							</u-dropdown-item>
							<u-dropdown-item v-model="priceSort" title="装修费用"></u-dropdown-item>
						</u-dropdown>
					</view>
				</view>

				<!-- 推荐案例 -->
				<view class="decorate-case" v-show="current === 0">
					<u-waterfall v-model="caseList" ref="caseWaterfall">
						<template v-slot:left="{ leftList }">
							<view class="mall-item" :key="index" v-for="(item, index) in leftList">
								<case-card :recommendCase="item" :isShowCompanyInfo="false"></case-card>
							</view>
						</template>
						<template v-slot:right="{ rightList }">
							<view class="mall-item flex-center" style="justify-content: flex-end" :key="index"
								v-for="(item, index) in rightList">
								<case-card :recommendCase="item" :isShowCompanyInfo="false"></case-card>
							</view>
						</template>
					</u-waterfall>
					<view v-if="caseList.length === 0" style="padding: 100rpx 0 400rpx 0">
						<mh-empty title="暂时还没有相关案例～"></mh-empty>
						<view class="all-case" @click="clearCaseParams"> 查看全部 </view>
					</view>
				</view>

				<!-- 精选推荐 -->
				<view class="recommended-mall" v-show="current === 1">
					<view class="flex-center mall-list">
						<u-waterfall v-model="mallList" ref="waterfall">
							<template v-slot:left="{ leftList }">
								<view class="mall-item" :key="index" v-for="(item, index) in leftList">
									<commodity-card :commodity="item"></commodity-card>
								</view>
							</template>
							<template v-slot:right="{ rightList }">
								<view class="flex-center mall-item" style="justify-content: flex-end" :key="index"
									v-for="(item, index) in rightList">
									<commodity-card :commodity="item"></commodity-card>
								</view>
							</template>
						</u-waterfall>
					</view>
				</view>

				<!-- 觅友圈 -->
				<view v-show="current === 2" class="miyou-list">
					<u-waterfall v-model="miyouList" ref="waterfall2">
						<template v-slot:left="{ leftList }">
							<mh-miyou-card v-for="(item, index) in leftList" :key="item.id" :miyouItem="item">
							</mh-miyou-card>
						</template>
						<template v-slot:right="{ rightList }">
							<mh-miyou-card v-for="(item, index) in rightList" :key="item.id" :miyouItem="item">
							</mh-miyou-card>
						</template>
					</u-waterfall>
				</view>
				<view style="height: 80rpx">
					<u-loadmore v-if="caseList.length !== 0 && mallList.length !== 0 && miyouList.length !== 0"
						:custom-icon="true" :is-show-line="false" margin-top="20" icon-color="#FE6E32"
						:status="pageStatus" color="#D2D2D2" :load-text="loadText" fontSize="20" />
				</view>
			</scroll-view>
		</mescroll-uni>
		<uni-popup ref="couponPopup" type="center" :maskClick="false">
			<coupon-popup ref="customPopup" @close="closeCoupon" :couponList="couponList"></coupon-popup>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		masterAvatar
	} from '@/plugins/orderStatus'
	export default {
		data() {
			return {
				groupDealList: [], // 团购列表
				flashSaleList: [], // 秒杀列表
				isShowCountDown: false, // 是否显示秒杀活动倒计时
				flashSaleEndTime: 0, // 秒杀活动倒计时
				houseTitle: '户型',
				areaTitle: '面积',
				styleTitle: '风格',
				houseValue: '', // 案例户型
				areaValue: '', // 案例面积
				styleValue: '', // 案例风格
				priceSort: '', // 案例费用排序
				houseOptions: [], // 案例户型字典
				areaOptions: [{
						label: '全部',
						value: {
							min: 1,
							max: 9999
						}
					},
					{
						label: '70m²以下',
						value: {
							min: 0,
							max: 70
						}
					},
					{
						label: '70-90m²',
						value: {
							min: 70,
							max: 90
						}
					},
					{
						label: '90-120m²',
						value: {
							min: 90,
							max: 120
						}
					},
					{
						label: '120m²以上',
						value: {
							min: 120,
							max: 9999
						}
					}
				], // 案例面积字典
				caseParams: {
					houseType: '', // 户型
					houseStyle: '', // 风格
					maxHouseArea: 9999, // 最大面积
					minHouseArea: 1, // 最小面积
					'orders[0].asc': '',
					'orders[0].column': ''
				}, // 案例筛选条件
				styleOptions: [], // 案例风格字典
				couponList: [], // 可领取的优惠券列表
				stickyHeight: '78rpx',
				shoppingCartCount: 0, // 购物车商品数量
				type1Worker: [], // 项目经理、监理、设计师
				type2Worker: [], // 普通工人
				type3Worker: {}, // 发布需求指定工匠
				ipImage: masterAvatar,
				// 首页呼叫navList 装修服务、维修安装、呼叫工人
				allowLocation: -1,
				pageStatus: 'loadmore',
				loadText: {
					loadmore: '加载更多',
					nomore: '~别拽了到底了~',
					loading: '加载中'
				},
				downOption: {
					auto: false
				},
				upOption: {
					auto: false,
					use: false,
					toTop: {
						src: ''
					},
					textColor: '#D2D2D2'
				},
				mescroll: null,
				latitude: uni.getStorageSync('latitude'),
				longitude: uni.getStorageSync('longitude'),
				bannerData: [{
					activityName: '',
					description: '',
					imgUrl: ''
				}],
				userAddressStr: uni.getStorageSync('oldLocation') ?
					uni.getStorageSync('oldLocation').address : '',
				swiperImgList: [], // Banner
				qualityGuaranteeList: [{
						typeName: '工艺标准',
						desc: '高标准,高工艺',
						typeTreeCode: '1001',
						url: '/home_v3/button_1_1.png'
					},
					{
						typeName: '统一工价',
						desc: '价格透明,消费无忧',
						typeTreeCode: '1002',
						url: '/home_v3/button_4_1.png'
					},
					{
						typeName: '品质保障',
						desc: '装修高质量,品质有保障',
						typeTreeCode: '1003',
						url: '/home_v3/button_2_1.png'
					},
					{
						typeName: '售后无忧',
						desc: '售后无烦恼',
						typeTreeCode: '1004',
						url: '/home_v3/button_3_1.png'
					}
				],
				lookingForList: [{
						title: '工人英雄榜',
						describe: '强技能你信任',
						url: 'https://www.51mihuo.com/static/images/home_v2/img_1.png'
					},
					{
						title: '装修预算DIY',
						describe: '我装修我作主',
						url: 'https://www.51mihuo.com/static/images/home_v2/img_2.png'
					}
				],
				mallList: [], // 推荐商品列表
				mallPage: 1, // 推荐商品分页页码
				total: 0, // 推荐商品分页总计
				caseList: [], // 案例列表
				casePage: 1, // 案例分页页码
				caseTotal: 0, // 案例分页总计
				cityOperatorId: uni.getStorageSync('cityOperatorId') || -1, // 运营商ID
				scrollTop: 0,
				tabHeight: 0,
				isSticky: false,
				clickOtherTabBar: false, // 是否点击其他tab页
				scrollIntoView: '',
				decorationList: [{
						title: '全屋装修',
						image: '/home_v3/qwzx_216x236.png',
						code: 'home_service_1'
					},
					{
						title: '旧房局改',
						image: '/home_v3/jfjg_216x236.png',
						code: 'home_service_3'
					},
					{
						title: '精装改造',
						image: '/home_v3/jzgz_216x236.png',
						code: 'home_service_2'
					}
				],
				materialTypeList: [{
						name: '辅材',
						icon: '/home_v3/fuCai.png',
						treeCode: '1002'
					},
					{
						name: '主材',
						icon: '/home_v3/zhuCai.png',
						treeCode: '1001'
					},
					{
						name: '电器',
						icon: '/home_v3/dianQi.png',
						treeCode: '1458'
					},
					{
						name: '软装',
						icon: '/home_v3/ruanZhuan.png',
						treeCode: '6148'
					},
					{
						name: 'MORE',
						icon: '/home_v3/morePru.png'
					}
				],
				tabList: [{
						typeName: '案例'
					},
					{
						typeName: '推荐'
					},
					{
						typeName: '觅友圈'
					}
				],
				current: 0, // 当前tab 案例/推荐/觅友圈
				currentPage: 1, // 觅友圈分页页码
				mytotal: 0, // 觅友圈分页总计
				miyouList: [], // 觅友圈列表
				options: {},
				userId: uni.getStorageSync('userData') &&
					uni.getStorageSync('userData').sysUser.userId
			}
		},
		onShareAppMessage(e) {
			const coverImg = 'https://www.51mihuo.com/static/images/mihuo-share.JPG'
			const path = `/pages/home/home?isFromShare=1`
			const result = this.$util.shareToWechat(
				'装修更透明，施工更标准，省钱更省心！',
				coverImg,
				path,
				'首页',
				true,
				1
			)
			return result
		},
		// 第一次加载
		onLoad(e) {
			let scene
			if (e.scene && decodeURIComponent(e.scene)) {
				let tempOptions = decodeURIComponent(e.scene)
				let tempOptionsList = tempOptions.split('&')
				let resultOptions = []
				tempOptionsList.forEach(item => {
					resultOptions.push(item.split('='))
				})
				scene = this.getOption(resultOptions)
				this.options = scene
			} else {
				this.options = e
			}
			if (this.options.userId) {
				uni.setStorageSync('shareUserId', this.options.userId)
			}
			if (this.options.isFromShare == '1' || this.options.userId) {
				uni.setStorageSync('invitatonCode', options.invitationCode || options.iCode)
			}
			// #ifdef MP-WEIXIN
			if (this.options.isFromShare == '1' || this.options.userId) {
				wx.reportEvent('enter_app', {
					source_user: Number(this.options.userId) || 0,
					type: 1 // 进入小程序
				})
			}
			uni.getSystemInfo({
				success: (res) => {
					if (
						uni.getSystemInfoSync().platform == 'ios' ||
						uni.getSystemInfoSync().platform === 'devtools'
					) {
						if (res.model.indexOf('14 Pro') !== -1) {
							// 据说ip14 pro 和pro max的状态栏高度会多5px
							this.stickyHeight = '164rpx'
						}
						this.stickyHeight = '154rpx'
					} else {
						if (uni.getSystemInfoSync().platform == "android") {
							this.stickyHeight = '98rpx'
						}
						this.stickyHeight = '88rpx'
					}
				}
			})
			// #endif
			// #ifdef H5
			this.reload(true)
			// #endif
			this.allowLocation = uni.getStorageSync('allowLocation')
			// #ifndef H5
			if (
				!uni.getStorageSync('cityOperatorId') ||
				!uni.getStorageSync('locationCity')
			) {
				this.getCityOperator()
			} else {
				if (this.allowLocation == 1) {
					this.getAddress(() => {
						this.reload(true)
					})
				} else {
					this.reload(true)
				}
			}
			// #endif
			this.getPlatformWorkType()
		},
		onHide() {
			this.clickOtherTabBar = true
			uni.showTabBar()
		},
		// 页面显示
		onShow() {
			// #ifdef H5
			// dev调试使用
			uni.setStorageSync('latitude', 24.8801)
			uni.setStorageSync('longitude', 102.8329)
			// #endif
			this.cityOperatorId = uni.getStorageSync('cityOperatorId')
			this.userAddressStr = uni.getStorageSync('oldLocation') ?
				uni.getStorageSync('oldLocation').address :
				''
			this.latitude = uni.getStorageSync('latitude') || 0
			this.longitude = uni.getStorageSync('longitude') || 0
			this.cityOperatorId = uni.getStorageSync('cityOperatorId')
			uni.$once('operatorSelected', (data) => {
				if (data) {
					const flag = data.id == this.cityOperatorId
					this.setUserAddress(data)
					this.userAddressStr = data.address || ''
					uni.setStorageSync('cityOperatorId', data.id)
					uni.setStorageSync('oldLocation', data)
					this.cityOperatorId = data.id || -1
					// 重新获取所有数据
					this.reload(!flag)
				}
			})
			// 购物车商品数量
			this.getShoppingCartCount()
			// 获取材料类型列表
			// this.getMaterial()
			if (this.current == 2 && uni.getStorageSync('userData')) {
				this.getMiYouData() // 觅友圈
			}
		},
		mounted() {
			// 获取标签距离顶部的高度
			this.$nextTick(() => {
				let moreH = 20
				const query = uni.createSelectorQuery()
				query
					.select('#sticky_id')
					.boundingClientRect((data) => {
						this.tabHeight = data.top - moreH
					})
					.exec()
			})
		},
		watch: {
			'$store.state.netStatus': {
				handler: function(newVal, oldVal) {
					if (newVal) {
						// #ifdef H5
						this.reload(true)
						// #endif
						this.allowLocation = uni.getStorageSync('allowLocation')
						// #ifndef H5
						if (
							!uni.getStorageSync('cityOperatorId') ||
							!uni.getStorageSync('locationCity')
						) {
							this.getCityOperator()
						} else {
							if (this.allowLocation == 1) {
								this.getAddress(() => {
									this.reload(true)
								})
							} else {
								this.reload(true)
							}
						}
						// #endif
					}
				},
				immediate: false,
				deep: true
			}
		},
		onTabItemTap(e) {
			if (!this.clickOtherTabBar) {
				if (this.allowLocation == 1) {
					this.getAddress(() => {
						this.reload(true)
					})
				} else {
					this.reload(true)
				}
				this.scrollIntoView = 'scroll-top'
			}
			this.clickOtherTabBar = false
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
			}
		},
		methods: {
			...mapMutations([
				'setUserAddress',
				'caseCacheList',
				'mallCacheList',
				'miyouCacheList'
			]),
			// 跳转到商品详情
			goToProductDetail(item) {
				this.toPage(`/pages-mall/productDetail/productDetail?id=${item.productId}`)
			},
			// 跳转到秒杀列表
			goToSeckill() {
				this.toPage(`/pages-mall/seckill/seckill`)
			},
			// 获取首页秒杀商品列表
			getProductAvtivity() {
				this.isShowCountDown = false
				this.$httpApi.getProductActivityList({
					cityOperatorId: this.cityOperatorId
				}).then(res => {
					this.groupDealList = res.groupBuyList
					this.flashSaleList = res.flashPromotionList
					if (this.flashSaleList.length) {
						const oneDay = 86400000 // 24小时换算成毫秒
						const firstItem = this.flashSaleList[0]
						const now = new Date().valueOf()
						const end = new Date(firstItem.endDate).valueOf()
						const diff = this.$math.floatSub(end, now)
						if (diff < oneDay) {
							// 活动结束前一天内显示倒计时
							this.flashSaleEndTime = diff / 1000
							this.isShowCountDown = true
						}
					}
				})
			},
			// 跳转到团购列表
			goToGroupDealList() {
				this.toPage('/pages-mall/groupDeal/groupDeal')
			},
			getOption(arr) {
				let obj = {};
				arr.forEach((v) => {
					let key = v[0];
					let value = v[1];
					obj[key] = value;
				});
				return obj;
			},
			// 清空案例筛选条件
			clearCaseParams() {
				this.caseParams = {
					houseType: '', // 户型
					houseStyle: '', // 风格
					maxHouseArea: '', // 最大面积
					minHouseArea: '', // 最小面积
					'orders[0].asc': '',
					'orders[0].column': ''
				}
				this.$refs.houseItemRef && this.$refs.houseItemRef.cellClick(null, {
					label: '全部'
				})
				this.$refs.areaItemRef && this.$refs.areaItemRef.cellClick(null, {
					label: '全部'
				})
				this.$refs.styleItemRef && this.$refs.styleItemRef.cellClick(null, {
					label: '全部'
				})
				this.casePage = 1
				this.caseList = []
				this.getCaseList()
			},
			// 获取案例相关字典
			async getCaseDict() {
				this.houseOptions = []
				this.styleOptions = []
				// 获取案例户型字典
				const houseOptions = await this.$httpApi.getDictByType({
					type: 'house_type'
				})
				this.houseOptions = houseOptions.map((item) => {
					return {
						...item,
						value: item.label
					}
				})
				this.houseOptions.unshift({
					label: '全部',
					value: ''
				})
				// 获取案例风格字典
				const styleOptions = await this.$httpApi.getDictByType({
					type: 'house_style'
				})
				this.styleOptions = styleOptions.map((item) => {
					return {
						...item,
						value: item.label
					}
				})
				this.styleOptions.unshift({
					label: '全部',
					value: ''
				})
			},
			// 案例面积筛选
			onChangeArea(e, item) {
				this.areaTitle = item.label === '全部' ? '面积' : item.label
				this.caseParams.maxHouseArea = (e && e.max) || ''
				this.caseParams.minHouseArea = (e && e.min) || ''
				this.casePage = 1
				this.caseList = []
				this.$refs.caseWaterfall && this.$refs.caseWaterfall.clear()
				this.getCaseList()
			},
			// 案例户型筛选
			onChangeHouse(e, item) {
				this.houseTitle = item.label === '全部' ? '户型' : item.label
				this.caseParams.houseType = e
				this.casePage = 1
				this.caseList = []
				this.$refs.caseWaterfall && this.$refs.caseWaterfall.clear()
				this.getCaseList()
			},
			// 案例风格筛选
			onChangeStyle(e, item) {
				this.styleTitle = item.label === '全部' ? '风格' : item.label
				this.caseParams.houseStyle = e
				this.casePage = 1
				this.caseList = []
				this.$refs.caseWaterfall && this.$refs.caseWaterfall.clear()
				this.getCaseList()
			},
			// 案例装修费用排序
			changePriceSort(e) {
				if (e === 1) {
					// 从低到高
					this.caseParams['orders[0].asc'] = true
					this.caseParams['orders[0].column'] = 'total_price'
				} else if (e === 2) {
					// 从高到低
					this.caseParams['orders[0].asc'] = false
					this.caseParams['orders[0].column'] = 'total_price'
				} else {
					this.caseParams['orders[0].asc'] = ''
					this.caseParams['orders[0].column'] = ''
				}
				this.casePage = 1
				this.caseList = []
				this.$refs.caseWaterfall && this.$refs.caseWaterfall.clear()
				this.getCaseList()
			},
			// 找灵感
			toAiInspirtion() {
				if (uni.getStorageSync('innerGuide')) {
					this.toPage('/pages-common/inspirationText/inspirationText')
				} else {
					this.toPage('/pages-common/inspirationGuide/inspirationGuide')
				}
			},
			// 查询是否有优惠券并弹窗
			checkCoupon() {
				this.$httpApi
					.getAvailableCoupon({
						userId: this.userId,
						cityOperatorId: this.cityOperatorId
					})
					.then((res) => {
						if (res.length) {
							// 弹窗的时候记录时间 一个自然日内再次打开app时不再弹窗
							const now = new Date()
							const today = `${now.getMonth() + 1}-${now.getDate()}`
							let arr = [] // 需要弹窗的结果
							const localItem = uni.getStorageSync('COUPON-ARRAY') || []
							if (localItem.length) {
								// 本地有优惠券 遍历对比相同ID不同日期
								res.forEach(item => {
									localItem.forEach(ele => {
										if (item.id == ele.id && ele.date != today) {
											arr.push({
												...item,
												date: today
											})
										}
									})
								})
							} else {
								// 本地没有优惠券 弹窗显示全部
								arr = res.map(item => {
									return {
										...item,
										date: today
									}
								})
								uni.setStorageSync('COUPON-ARRAY', arr)
							}
							this.couponList = arr
							if (this.couponList.length) {
								// #ifdef APP-PLUS || MP-WEIXIN
								uni.hideTabBar()
								// #endif
								// #ifdef MP-WEIXIN
								this.$refs.customPopup.setData(this.couponList)
								// #endif
								this.$refs.couponPopup.open()
							}
						}
					})
			},
			// 关闭优惠券弹窗
			closeCoupon() {
				this.$refs.couponPopup.close()
				uni.showTabBar()
			},
			// 跳转到全屋装修/旧房局改/精装改造
			goToPage(data) {
				this.toPage(
					`/pages-homeCall/typeOfDecoration/typeOfDecoration?title=${data.title}&type=${data.code}`
				)
			},
			// 监听滚动条高度，吸顶快速找师傅
			scrollRange(e) {
				this.scrollIntoView = ''
				this.scrollTop = e.detail.scrollTop
				this.isSticky = this.scrollTop > this.tabHeight ? true : false
			},
			// 获取购物车商品数量
			getShoppingCartCount() {
				if (uni.getStorageSync('userData')) {
					this.$httpApi.getShoppingCartCount().then((res) => {
						this.shoppingCartCount = res
					})
				} else {
					this.shoppingCartCount = 0
				}
			},
			// 获取平台工种
			getPlatformWorkType() {
				this.$httpApi
					.getPlatformSkills({
						type: '', // 查询全部
						clientType: 'platform'
					})
					.then((res) => {
						if (res) {
							res.forEach((item) => {
								this.ipImage.some((v, i) => {
									if (item.skillName.indexOf(v.name) != -1) {
										item.img = v.img
									}
								})
							})
							this.type1Worker = res.filter(
								(item) =>
								item.jobCode == 'JOB_MANAGER' || item.jobCode == 'JOB_DESIGNER'
							) // 项目经理、监理、设计师
							this.type2Worker = res.filter(
								(item) =>
								item.jobCode == 'JOB_WORKER' &&
								item.quickCallFlag == 1 &&
								(item.skillName.indexOf('维修') == -1 ||
									item.skillName.indexOf('安装') == -1)
							) // 普通工人

							this.type3Worker = res.find((item) => item.jobCode == 'JOB_DEFAULT') // 维修安装工
						}
					})
					.catch((res) => {
						// 没网的时候小程序感觉是直接抛出错误。
						this.type1Worker = uni.getStorageSync('type1Worker') || []
						this.type2Worker = uni.getStorageSync('type2Worker') || []
					})
			},
			// 首页开始呼叫师傅
			callNowMaster(data) {
				this.toPage(
					`/pages-homeCall/callMasterPage/callMasterPage?title=${data.skillName}&skillId=${data.skillId}`
				)
			},
			getCityOperator() {
				this.$httpApi.getCityOperator().then((res) => {
					if (res) {
						// 默认选择第一个
						const data = res[0]
						this.setUserAddress(data)
						this.userAddressStr = data.address || ''
						uni.setStorageSync('cityOperatorId', data.id)
						uni.setStorageSync('oldLocation', data)
						uni.setStorageSync('locationCity', data)
						this.cityOperatorId = data.id || -1
						if (this.allowLocation == 1) {
							this.getAddress(() => {
								this.reload(true)
							})
						} else {
							this.reload(true)
						}
					} else {
						console.log('无数据')
					}
				})
			},
			scrollToLower() {
				if (this.current === 0) {
					if (this.caseList.length === +this.caseTotal) {
						this.pageStatus = 'nomore'
						return
					} else {
						this.pageStatus = 'loadmore'
						this.casePage += 1
						this.getCaseList()
					}
				}
				if (this.current === 1) {
					if (this.mallList.length === +this.total) {
						this.pageStatus = 'nomore'
						return
					} else {
						this.pageStatus = 'loadmore'
						this.mallPage += 1
						this.getMallList()
					}
				} else if (this.current === 2) {
					if (this.miyouList.length === +this.mytotal) {
						this.pageStatus = 'nomore'
						return
					} else {
						this.pageStatus = 'loadmore'
						this.currentPage += 1
						this.getMiYouData()
					}
				}
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			// 获取所有数据
			reload(status) {
				if (status) {
					this.caseParams = {
						houseType: '', // 户型
						houseStyle: '', // 风格
						maxHouseArea: '', // 最大面积
						minHouseArea: '', // 最小面积
						'orders[0].asc': '',
						'orders[0].column': ''
					}
					this.casePage = 1
					this.caseList = []
					this.mallPage = 1
					this.mallList = []
					this.currentPage = 1
					this.miyouList = []
					this.$refs.caseWaterfall && this.$refs.caseWaterfall.clear()
					this.$refs.waterfall && this.$refs.waterfall.clear()
					this.$refs.waterfall2 && this.$refs.waterfall2.clear()
					this.getBannerData() // 首页轮播图
					this.getCaseList() // 推荐案例
					this.pageStatus = 'loadmore'
					this.getPlatformWorkType() // 平台工种
					this.getProductAvtivity() // 秒杀、团购商品列表
				}
				// 获取案例相关字典
				this.getCaseDict()
				// 查询优惠券
				this.checkCoupon()
				this.getMallList() // 获取商品列表
				if (uni.getStorageSync('userData')) {
					this.getMiYouData() // 觅友圈
				}
			},
			downCallback() {
				// 暂时隐藏全屏加载动画
				// 下拉刷新是不是应该也执行
				// #ifdef APP-PLUS
				uni.setLoadingVisible(false)
				// #endif
				this.reload(true)
				// 停止重载动画
				setTimeout(() => {
					this.mescroll.endBySize(10, true)
					// #ifdef APP-PLUS
					uni.setLoadingVisible(true)
					// #endif
				}, 500)
			},
			// 获取更多数据
			upCallback() {
				if (this.current === 0) {
					this.casePage += 1
					this.getCaseList()
				} else if (this.current === 1) {
					this.mallPage += 1
					this.getMallList()
				} else if (this.current === 2) {
					this.currentPage += 1
					if (uni.getStorageSync('userData')) {
						this.getMiYouData() // 觅友圈
					}
				}
			},
			getAddress(callback) {
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
			},
			goToSearchPage() {
				uni.setStorageSync('preSearchPage', 'home')
				this.toPage('/pages-common/searchPage/searchPage?type=home')
			},
			// 获取Banner信息
			getBannerData() {
				this.$httpApi
					.getBannerList({
						clientType: 'capp',
						cityOperatorId: this.cityOperatorId
					})
					.then((res) => {
						this.swiperImgList = []
						// sizeType = 0 首页横屏
						this.bannerData = res.records.filter((item) => item.sizeType === 0)
						this.bannerData.forEach((item) => {
							this.swiperImgList.push({
								image: this.$image.imageGlobal + item.imgUrl,
								data: item
							})
						})
					})
			},
			// 点击选择运营商
			chooseAddress() {
				uni.navigateTo({
					url: '/pages-common/operatorSelectCity/operatorSelectCity'
				})
			},
			// 点击banner图
			goToSomePage(index) {
				this.$httpApi
					.getCMSContentById({
						id: this.bannerData[index].url
					})
					.then((res) => {
						if (res) {
							// 如果内容类型是链接 跳转对应的页面
							const content = JSON.parse(res.content)
							const {
								appPage,
								link
							} = content[0].listdata[0]
							if (content[0].type === 'link' && link) {
								if (appPage.indexOf('category') !== -1) {
									// 跳转分类tab页
									uni.setStorageSync('treeCode', content[0].listdata[0].link)
									this.toTab(appPage)
								} else if (appPage.indexOf('mihuoActivityPoster') !== -1) {
									// 跳转活动报名页面
									this.toPage(`${appPage}?id=${content[0].listdata[0].link}`)
								} else {
									// 跳转分类列表
									const data = {
										treeCode: content[0].listdata[0].link
									}
									this.toPage(`${appPage}?data=${JSON.stringify(data)}`)
								}
							} else {
								// 跳转内容页面
								uni.navigateTo({
									url: '/pages-mine/cms?isShowTitle=0&id=' + res.id
								})
							}
						}
					})
			},
			// 获取案例列表
			getCaseList() {
				this.$httpApi
					.getConstructionCase({
						cityOperatorId: this.cityOperatorId,
						size: 10,
						current: this.casePage,
						recommendStatus: 1,
						...this.caseParams
					})
					.then((res) => {
						if (res && res.records !== 0) {
							res.records.map((item) => {
								item.coverPic = JSON.parse(item.coverPic)
								if (item.tags) {
									item.tags = item.tags.split(',')
								}
							})
							this.caseList.push(...res.records)
							this.$store.commit('setCaseList', this.caseList)
							this.caseTotal = res.total
						}
					})
					.catch((e) => {
						this.caseList = this.$store.state.caseCacheList
					})
			},
			// 获取商品列表
			getMallList() {
				// TODO 这个接口拿不到数据 mall/product/customer/hotsale
				// this.$httpApi.getHotSaleByTreeCode({
				// 	cityOperatorId: this.cityOperatorId,
				// }).then(res => {
				// 	console.log(res)
				// })
				this.$httpApi
					.getMallData({
						size: 10,
						current: this.mallPage,
						// cityOperatorFlag: 2, // 查询运营商和所有企业的商品
						cityOperatorId: this.cityOperatorId,
						'orders[0].column': 'OPERATORSORT',
						'orders[0].asc': false,
						operatorRecommand: 1
					})
					.then((res) => {
						if (res && res.records) {
							this.mallList.push(...res.records)
							this.$store.commit('setMallList', this.mallList)
							this.total = res.total
						}
					})
					.catch((e) => {
						this.mallList = this.$store.state.mallCacheList
					})
			},
			// 觅友圈
			getMiYouData() {
				this.$httpApi
					.getMiYouList({
						size: 10,
						current: this.currentPage
					})
					.then((res) => {
						if (res.records) {
							this.miyouList =
								this.currentPage > 1 ?
								this.miyouList.concat(res.records) :
								res.records
							this.$store.commit('setMiyouList', this.miyouList)
							this.mytotal = res.total
						}
					})
					.catch((e) => {
						this.miyouList = this.$store.state.miyouCacheList
					})
			},
			// 觅友圈more
			goToMiyou() {
				this.toPage('/pages-user/miyou/miyou')
			},
			// 跳转到客服
			goToCustomerService() {
				if (!uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					return
				}
				this.$util.goToWeixin()
			},
			qualityGuarantee(val) {
				switch (val.typeName) {
					case '工艺标准':
						this.toPage(
							`/pages-processstabdard/processstabdard?typeName=${val.typeName}`
						)
						break
					default:
						this.toPage(
							`/pages/home/article?title=${val.typeName}&typeTreeCode=${val.typeTreeCode}`
						)
				}
			},
			// 查看案例
			getCaseDetais(val) {
				this.toPage(`/pages-common/case/recommend/detail?id=${val.id}`)
			},
			// 查看购物车
			goToShoppingCart() {
				this.toPage('/pages-mall/shoppingCart/shoppingCart')
			},
			// 去快速估价
			changeToValuation() {
				this.toPage('/pages-valuation/valuation')
			},
			getMaterial() {
				// 1. 获取分类树
				this.$httpApi
					.getCategoryDataByTreeCode({
						operatorId: this.cityOperatorId
					})
					.then((res) => {
						if (res) {
							if (res.length > 5) {
								this.materialTypeList = res
								this.materialTypeList.length = 5
							} else {
								this.materialTypeList = res
							}
						}
					})
			},
			// 跳转材料分类
			changeTabMaterial(tab) {
				const {
					item
				} = tab
				if (item.treeCode) {
					uni.setStorageSync('treeCodeHome', item.treeCode)
				} else {
					uni.removeStorageSync('treeCodeHome')
				}
				uni.switchTab({
					url: '/pages/category/category'
				})
			},
			// 发布需求
			gotoRepairNotFilled() {
				this.toPage(
					`/pages-homeCall/repairNotFilled/repairNotFilled`
				)
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index
				if (index == 2) {
					if (uni.getStorageSync('userData')) {
						this.getMiYouData() // 觅友圈
					} else {
						this.$util.goToLoginPage()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.address_select {
		width: 160rpx;
		padding-left: 30rpx;

		.title {
			width: max-content;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #333333;
			text-align: center;
			@include toe();
		}

		.icon {
			width: 24rpx;
			height: 30rpx;
			margin-right: 12rpx;
			margin-top: -2rpx;
		}
	}

	.uni-swiper /deep/ .uni-swiper-wrapper {
		overflow: auto;
		position: static;
		min-height: 484rpx !important;
	}

	.right-container {
		width: max-content;
		padding-right: 30rpx;
		/* #ifndef MP-WEIXIN */
		padding-right: 190rpx;
		/* #endif */
		justify-content: flex-end;

		.search-bar {
			width: 126rpx;
			/* #ifndef MP-WEIXIN */
			width: 314rpx;
			/* #endif */
			margin-right: 30rpx;
		}

		.icon {
			width: 62rpx;
			height: 62rpx;
			margin-right: 30rpx;
		}

		.icon-2 {
			width: 34rpx;
			height: 34rpx;
		}
	}

	/deep/ .u-scroll-box {
		position: relative;
		background-color: #f7f7f7;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	/deep/ .u-scroll-box {
		border-top-left-radius: 0px;
		border-top-right-radius: 0px;
	}

	.scroll-container {
		width: 100vw;
		height: calc(100vh - var(--status-bar-height) - 88rpx);
	}

	.header-container {
		width: 690rpx;
		margin: 0rpx 30rpx;

		.swiper-img {
			width: 690rpx;
			border-radius: 10rpx;
		}
	}

	.article-container {
		width: 690rpx;
		margin: 0 30rpx;
		padding: 45rpx 0 33rpx;
		background-color: #fff;

		.guarantee-item {
			width: 25%;
			height: 100%;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: center;

			.text {
				font-size: 20rpx;
				/* #ifdef H5 */
				zoom: calc(20 / 24);
				/* #endif */
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #000000;
			}

			.icon {
				width: 24rpx;
				height: 24rpx;
				margin-right: 13rpx;
			}
		}
	}

	.decoration-contaienr {
		width: 690rpx;
		gap: 20rpx;
		margin: 0 30rpx;
		padding-bottom: 30rpx;
		justify-content: space-between;

		.decoration-item {
			// flex: 1;
			height: 236rpx;
			border-radius: 15rpx;
			// background: #666767;
			overflow: hidden;
			position: relative;
			display: flex;
			justify-content: space-between;

			.text {
				width: 100%;
				color: #ffffff;
				font-size: 32rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				line-height: 51rpx;
				text-align: center;
				position: absolute;
				bottom: 30rpx;
			}

			.bg-image {
				width: 216rpx;
				height: 236rpx;
			}
		}
	}

	.aiAndNeed {
		display: flex;
		margin: 0 0 0 30rpx;

		.entry {
			flex: 1;
			background: linear-gradient(90deg, #e5fff9, #e5e7ff);
			border-radius: 15px;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			vertical-align: middle;
			align-items: center;

			.image {
				width: 50rpx;
				height: 50rpx;
			}

			.text {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				margin: 13rpx 0 0 0;
			}
		}
	}

	.how-much-container {
		flex: 3;
		width: 690rpx;
		height: 120rpx;
		background: #f7f7f7;
		border-radius: 12rpx;
		margin: 0 30rpx 0 20rpx;
		padding: 0 30rpx;
		justify-content: space-between;
		position: relative;
		/* #ifdef APP-PLUS */
		background: url('/static/app-plus/home_v3/AI-bg-690x120.png') no-repeat;
		/* #endif */
		/* #ifndef APP-PLUS */
		background: url('https://www.51mihuo.com/static/icon/home_v3/AI-bg-690x120.png') no-repeat;
		/* #endif */
		background-size: 690rpx 120rpx;

		.how-much_left {
			view {
				color: #000000;
				font-size: 28rpx;
				font-weight: bold;
				font-family: NotoSansHans-Medium;
			}

			text {
				color: #999999;
				font-size: 20rpx;
				font-family: NotoSansHans-Regular;
			}
		}

		.how-much_right {
			flex-shrink: 0;
			/* #ifdef H5 */
			margin-left: 40rpx;

			/* #endif */
			text {
				color: #ffffff;
				font-size: 24rpx;
				// font-weight: bold;
				background: #fe6e32;
				padding: 20rpx 22rpx;
				border-radius: 100rpx;
				font-family: NotoSansHans-Medium;
			}
		}
	}

	.service-container {
		width: 690rpx;
		margin: 0 30rpx;
		padding-top: 66rpx;
		background-color: #fff;

		.button-item {
			flex: 1;
			height: 100%;
			flex-direction: column;

			.icon {
				width: 70rpx;
				height: 70rpx;
				margin-bottom: 24rpx;
			}

			.text {
				color: #000000;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				line-height: 34rpx;
			}
		}
	}

	.demand-container {
		width: 690rpx;
		padding: 40rpx 0 0;
		margin: 0 30rpx;
		gap: 20rpx;

		.service-item {
			flex: 1;
			height: 116rpx;
			border-radius: 15rpx;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			gap: 10rpx;
			padding: 0 20rpx;
			position: relative;

			// 站位边框
			// border: 2px red solid;
			.service-text {
				color: #ffffff;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				line-height: 34rpx;
			}

			.desc-text {
				width: 140rpx;
				color: rgba(255, 255, 255, 0.6);
				font-size: 20rpx;
				/* #ifdef H5 */
				zoom: calc(20 / 24);
				/* #endif */
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				line-height: 34rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.icon {
				width: 68rpx;
				height: 60rpx;
				position: absolute;
				right: 13rpx;
				bottom: 0;
			}
		}

		.steward {
			/* #ifdef APP-PLUS */
			background: url('/static/app-plus/home_v3/manager_266x116.png') no-repeat;
			/* #endif */
			/* #ifndef APP-PLUS */
			background: url('https://www.51mihuo.com/static/icon/home_v3/manager_266x116.png') no-repeat;
			/* #endif */
			background-size: 266rpx 116rpx;
		}

		.designer {
			/* #ifdef APP-PLUS */
			background: url('/static/app-plus/home_v3/design_266x116.png') no-repeat;
			/* #endif */
			/* #ifndef APP-PLUS */
			background: url('https://www.51mihuo.com/static/icon/home_v3/design_266x116.png') no-repeat;
			/* #endif */
			background-size: 266rpx 116rpx;
		}

		.post-demand {
			width: 116rpx;
			height: 116rpx;
			background: #f7f7f7;
			border-radius: 15rpx;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			position: relative;

			.text {
				color: #000000;
				font-size: 20rpx;
				/* #ifdef H5 */
				zoom: calc(20 / 24);
				/* #endif */
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				line-height: 34rpx;
				margin-top: 20rpx;
				/* #ifdef MP-WEIXIN */
				margin-top: 10rpx;
				/* #endif */
			}

			.icon {
				position: absolute;
				bottom: 0;
				width: 65rpx;
				height: 65rpx;
			}
		}
	}

	.home-title {
		width: 100%;
		text-align: left;
	}

	.hot-sale {
		width: 690rpx;
		margin: 40rpx 30rpx 0 30rpx;

		.sale-product {
			justify-content: space-between;
			margin-top: 30rpx;

			.left-container {
				width: calc(690rpx - 198rpx - 20rpx);
				height: 263rpx;
				overflow: scroll;

				.product-item {
					width: 178rpx;
					height: 263rpx;
					flex-direction: column;
					justify-content: space-between;
					padding: 2rpx;
					border-radius: 15rpx;
					margin-right: 20rpx;

					&:nth-child(3n + 1) {
						background: linear-gradient(90deg, #FFF4E5, #FFE6E5);
					}

					&:nth-child(3n + 2) {
						background: linear-gradient(90deg, #E5FFF9, #E5E7FF);
					}

					&:nth-child(3n + 3) {
						background: linear-gradient(90deg, #F5EDFF, #FFE5FC);
					}

					.product-img {
						width: 174rpx;
						height: 178rpx;
						background: #FFFFFF;
					}

					.product-info {
						width: 178rpx;
						height: 85rpx;
						padding: 10rpx 0;

						.product-name {
							width: 100%;
							text-align: center;
							font-size: 20rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 400;
							color: #000000;
							line-height: 34rpx;
							@include toe();
						}

						.product-price {
							width: 100%;
							text-align: center;
							font-size: 20rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #000000;
							line-height: 34rpx;
							margin-top: 4rpx;
						}
					}
				}
			}

			.right-container {
				width: 198rpx;
				height: 263rpx;
				background: linear-gradient(90deg, #FFBF66, #FF6B66);
				border: 2rpx solid #FFFFFF;
				border-radius: 15rpx;
				padding: 2rpx;
				flex-direction: column;
				justify-content: space-between;

				.package-img {
					width: 190rpx;
					height: 178rpx;
					background: linear-gradient(90deg, #FFBF66, #FF6B66);
				}

				.package-name {
					width: 100%;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 34rpx;
					text-align: center;
					@include toe();
				}

				.package-price {
					width: 100%;
					margin-top: 4rpx;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					text-align: center;
					line-height: 34rpx;

					.text {
						color: #FFFFFF;
					}
				}
			}
		}
	}

	.mall-activity {
		width: 690rpx;
		margin: 30rpx 30rpx 0 30rpx;

		.activity-item {
			width: 335rpx;
			height: 283rpx;
			background: #F7F7F7;
			border-radius: 15rpx;
			padding: 30rpx 20rpx;

			.count-down {}

			.product-container {
				margin-top: 30rpx;
				height: 177rpx;

				.product-item {
					width: 137rpx;
					height: 177rpx;
					border-radius: 15rpx;
					background: linear-gradient(90deg, #FFF4E5, #FFE6E5);

					.item-info {
						width: 100%;
						margin-top: 6rpx;
						text-align: center;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						color: #000000;
						line-height: 34rpx;
					}

					&:last-child {
						margin-left: 20rpx;
					}
				}

				.item-img {
					width: 133rpx;
					height: 137rpx;
					margin: 0 2rpx;
				}

				.flash-sale {
					width: 137rpx;
					height: 177rpx;
					border-radius: 15rpx;
					background-color: #FFFFFF;


					.item-info {
						width: 100%;
						height: 40rpx;
						text-align: center;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						background-color: #000000;
						line-height: 40rpx;
						border-radius: 0 0 15rpx 15rpx;

						.text {
							color: #FFFFFF;
						}
					}

					&:last-child {
						margin-left: 20rpx;
					}
				}
			}
		}
	}

	.material-container {
		width: 690rpx;
		margin: 0 30rpx;
		padding-top: 60rpx;
		background-color: #fff;

		.button-item {
			flex: 1;
			height: 100%;
			flex-direction: column;

			.icon {
				width: 90rpx;
				height: 90rpx;
				margin-bottom: 24rpx;
			}

			.text {
				color: #000000;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				line-height: 34rpx;
			}

			.btn-more {
				width: 90rpx;
				height: 36rpx;
				background: #fe6e32;
				border-radius: 18rpx;
				justify-content: center;
				gap: 4rpx;

				.text {
					color: #000000;
					font-size: 18rpx;
					/* #ifdef H5 */
					zoom: calc(18 / 24);
					/* #endif */
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					line-height: 34rpx;
				}
			}
		}
	}

	.dropdown-container {
		width: 690rpx;
		background: #ffffff;
	}

	.tabs-container {
		width: 750rpx;
		padding: 50rpx 30rpx 20rpx;
		background: #ffffff;

		/deep/ .u-tabs-scroll-box {
			justify-content: flex-start !important;

			.u-tabs-item {
				flex: initial !important;
				padding: 0 !important;

				&+.u-tabs-item {
					margin-left: 56rpx;
				}
			}
		}
	}

	.service-not-container {
		width: 690rpx;
		height: 180rpx;
		margin-top: 76rpx;
		background-color: #ffffff;
		padding: 0 20rpx;

		.topper {
			width: 100%;
			height: 24rpx;
			margin-left: 30rpx;
			margin-right: 30rpx;
			justify-content: space-between;

			.service-title {
				width: 324rpx;
				height: 28rpx;
			}

			.more-icon {
				width: 68rpx;
				height: 18rpx;
			}
		}

		.service-button {
			width: 720rpx;
			height: 122rpx;
			margin-top: 40rpx;

			.button-item {
				width: 20%;
				height: 122rpx;
				justify-content: center;
				flex-direction: column;

				.button-icon {
					width: 80rpx;
					height: 80rpx;
				}

				.button-text {
					margin-top: 18rpx;
					line-height: 24rpx;
					font-size: 22rpx;
					/* #ifdef H5 */
					zoom: calc(22 / 24);
					/* #endif */
					color: #111144;
				}
			}
		}
	}

	.design-case {
		width: 690rpx;
		height: max-content;
		margin: 76rpx 30rpx 0rpx 30rpx;

		.map-contain {
			position: relative;
			overflow: hidden;
			border-radius: 10rpx;
			margin-top: 30rpx;

			.recommended-image-contain {
				position: absolute;
				right: 28rpx;
				top: 28rpx;
				z-index: 4;

				.recommended-image {
					width: 182rpx;
					height: 182rpx;
					opacity: 0.8;
					border-radius: 20rpx;
				}

				.recommended-text {
					@include toe();
					width: 182rpx;
					padding: 6rpx 10rpx;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 0px 0px 5px 5px;
					font-weight: bold;
					font-size: 24rpx;
					position: relative;
					bottom: 44rpx;
					text-align: center;
					color: #ffffff;
				}
			}

			.map-cover {
				width: 690rpx;
				height: 250rpx;
				border-radius: 20rpx;
				z-index: 3;
				margin-top: -250rpx;
			}

			.preview-image {
				width: 690rpx;
				height: 250rpx;
				border-radius: 20rpx;
			}

			/deep/ .csssprite {
				display: none;
			}

			.image-contain {
				position: absolute;
				bottom: 20rpx;
				z-index: 99;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}

	.decorate-case {
		width: 690rpx;
		min-height: 80vh;
		height: max-content;
		margin: 10rpx 30rpx 30rpx;
		background-color: #ffffff;

		.all-case {
			width: max-content;
			margin: 0 auto;
			margin-top: 30rpx;
			padding: 10rpx 20rpx;
			text-align: center;
			font-size: 20rpx;
			color: $themeColor;
			border: 2rpx solid $themeColor;
			border-radius: 20rpx;
		}

		.case-contain {
			width: 100%;
			white-space: nowrap;
			/*  #ifdef MP-WEIXIN  */
			margin-top: 30rpx;

			/*  #endif  */
			.case-item {
				width: 320rpx;
				padding: 30rpx 20rpx 20rpx;
				display: inline-block;
				background-color: #f5f5f5;
				margin-right: 20rpx;
				border-radius: 20rpx;
				margin-top: 20rpx;

				.case-tag {
					width: max-content;
					height: 38rpx;
					line-height: 38rpx;
					font-size: 20rpx;
					/* #ifdef H5 */
					zoom: calc(20 / 24);
					/* #endif */
					padding: 0 8rpx;
					color: #ffffff;
					background-color: #000000;
					border-radius: 6rpx;
				}

				.case-img {
					width: 280rpx;
					height: 280rpx;
					margin-top: 20rpx;
					border-radius: 10rpx;
				}

				.case-name {
					width: 100%;
					font-size: 24rpx;
					color: #010101;
					margin: 20rpx 0;
					font-weight: 500;
					@include toe();
				}

				.case-box {
					display: flex;
					justify-content: space-between;

					view {
						font-size: 20rpx;
						/* #ifdef H5 */
						zoom: calc(20 / 24);
						/* #endif */
						color: #ed3832;
					}

					text {
						color: #ed3832;
						font-size: 32rpx;
						font-weight: bold;
					}

					// .case-box_right{
					// 	flex-shrink: 0;
					// 	margin-left: 10rpx;
					// }
					// .case-box_left{
					// 	flex: 1;
					// 	display: flex;
					// 	flex-flow: row wrap;
					// }
				}

				.case-style {
					width: 100%;
					height: 28rpx;
					margin-top: 16rpx;

					.style-item {
						font-size: 20rpx;
						/* #ifdef H5 */
						zoom: calc(20 / 24);
						/* #endif */
						color: $themeColor;
					}
				}
			}
		}
	}

	.public-top {
		width: 690rpx;
		height: 40rpx;
		justify-content: space-between;

		.left {
			font-size: 32rpx;
			line-height: 40rpx;
			font-weight: bold;
			color: #000000;
		}

		.more-container {
			width: 98rpx;
			height: 40rpx;
			justify-content: center;
			border: 2rpx #000 solid;
			border-radius: 50rpx;

			.more-case {
				width: 76rpx;
				height: 24rpx;
				padding-right: 2rpx;
			}
		}
	}

	.recommended-mall {
		width: 690rpx;
		padding: 0 30rpx 0;
		flex-direction: column;

		.mall-list {
			width: 690rpx;
			margin-top: 10rpx;
			flex-direction: row;
			justify-content: space-between;

			.mall-item {
				width: 345rpx;
			}
		}
	}

	.miyou-list {
		width: 690rpx;
		margin: 10rpx 30rpx 0;

		/deep/ .u-waterfall {
			gap: 30rpx !important;
		}
	}

	/deep/ .uni-swiper-dots {
		bottom: 0rpx;

		.uni-swiper-dot {
			width: 22rpx;
			height: 8rpx;
			border-radius: 5px;
			margin-right: 4rpx;
		}

		.uni-swiper-dot-active {
			background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
		}
	}

	/deep/ .header_content {
		justify-content: initial;

		.header_left_box {
			flex: initial;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	/deep/ .uni-swiper-item {
		overflow: auto;
	}

	.flex-box {
		display: flex;
		justify-content: space-between;
	}

	/deep/.uni-swiper-slides {
		inset: 0 !important;
	}

	.sticky {
		z-index: 999;
		position: fixed;
		padding-top: calc(var(--status-bar-height) + 10rpx);
		animation: move 0.2s linear;
	}

	@keyframes move {
		to {
			top: calc(60rpx + var(--status-bar-height));
		}

		from {
			top: 0;
		}
	}

	// /deep/.u-list-image-wrap{
	//   margin: 0 60rpx !important;
	//   width: 750rpx !important;
	// }
</style>
