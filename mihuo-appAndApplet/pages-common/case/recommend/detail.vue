<template>
	<view class="case-details-contain">
		<!-- #ifndef APP-PLUS -->
		<z-nav-bar :scrollTop="scrollTop" type="transparentFixed" bgColor="#FFFFFF">
			<view slot="default" class="nav-bar-title">{{ details.name }}</view>
		</z-nav-bar>
		<!-- #endif -->
		<view id="case_0">
			<view class="case-top">
				<view class="right-contain" id="right-contain" :style="{
					left: leftNum + 'rpx',
					width: bannerWidth + 'rpx' }">
					<view class="case-video" v-if="hasVideo">
						<video @error="error" ref="videoRef" :auto-pause-if-open-native="true"
							:auto-pause-if-navigate="true" v-show="imageTypeIndex === 0" :http-cache="true"
							class="video-item" autoplay muted :controls="true" :enable-progress-gesture="false"
							:src="videoUrl"></video>
					</view>
					<view class="left-image">
						<swiper class="flex-center-item" :indicator-dots="false" :autoplay="false"
							@change="onSwiperChange">
							<swiper-item v-for="(item, index) in coverPicList" :key="index">
								<img-cache-temporary class="flex-center-item" mode="aspectFill" :fade-show="false"
									:key="index" @click.native="getPreview('图片', $util.thumbnailImage(item, true))"
									:src="$util.thumbnailImage(item, true)" />
							</swiper-item>
						</swiper>
					</view>
					<view class="right-image">
						<swiper class="flex-center-item" :indicator-dots="false" :autoplay="false"
							@change="onSwiperChange">
							<swiper-item v-for="(item, index) in roomPicList" :key="index">
								<img-cache-temporary lazy-load class="flex-center-item" mode="aspectFill"
									@click="getPreview('户型图', $util.thumbnailImage(item, true))"
									:src="$util.thumbnailImage(item, true)" />
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="case-image-num-contain">
					<text class="image-num-text">
						{{
							imageTypeIndex === 0
							? '1/1'
							: imageTypeIndex === 1
							? `${type1Current}/` + coverPicList.length
							: `${type2Current}/` + roomPicList.length
						}}
					</text>
				</view>
				<view class="image-switch">
					<view class="left" v-if="hasVideo" :class="[imageTypeIndex === 0 ? 'active' : '']"
						@click="imageSwitch(0, 0)">
						视频
					</view>
					<view class="center " :class="[imageTypeIndex === 1 ? 'active' : '']"
						@click="imageSwitch(1, hasVideo ? -750 : 0)">
						图片
					</view>
					<view class="right" :class="[imageTypeIndex === 2 ? 'active' : '']"
						@click="imageSwitch(2, hasVideo ? -1500 : -750)">
						户型图
					</view>
				</view>
			</view>
			<view class="details-contain">
				<view class="details-title">
					<text class="tips">{{ details.way || '' }}</text>
					<view class="title">{{ details.name || '' }}</view>
				</view>
				<view class="details-information">
					<view class="case_tag case_tag_item" v-if="details.tags && details.tags.length">
						<text v-for="(item, index) in details.tags" :key="index">
							{{ item }}
						</text>
					</view>
					<view class="case-style">
						<view class="flex-box">
							<view class="flex-box case-style_item">
								<text>户型</text>
								<view>{{ details.houseType || '' }}</view>
							</view>
							<view class="flex-box case-style_item">
								<text>面积</text>
								<view>{{ details.houseArea || '' }}㎡</view>
							</view>
						</view>
						<view class="flex-box bottom">
							<view class="flex-box case-style_item">
								<text>风格</text>
								<view>{{ details.houseStyle || '' }}</view>
							</view>
							<view class="flex-box case-style_item">
								<text>费用</text>
								<view>{{ obj.totalPrice }}元</view>
							</view>
						</view>
					</view>
					<view class="case-describe">{{ details.description || '' }}</view>
					<!-- 装修费用 -->
					<view class="case-explain">
						<view class="case-explain_item">
							<view class="case-explain_title">
								<text>装修总费用 <text class="price-symbol">￥</text>
									<text class="case-price">{{ obj.totalPrice }}元</text>
								</text>
								<view @click="lookCotsList('装修总费用', 0)">
									费用明细
									<u-icon name="arrow-right" size="22" color="#FE6E32"></u-icon>
								</view>
							</view>
							<view class="case-explain_specific">
								<view class="explain_specific-item" @click="lookCotsList('人工费', 0)">
									<view class="specific-item_title">人工</view>
									<view class="item">
										<text>￥</text>
										<text style="font-size:28rpx;font-weight: bold;">
											{{ obj.laborCosts }}
										</text>
										<u-icon name="arrow-right" size="20" color="#999999"></u-icon>
									</view>
								</view>
								<view class="explain_specific-item" @click="lookCotsList('辅材费', 1)">
									<view class="specific-item_title">辅材</view>
									<view class="item">
										<text>￥</text>
										<text style="font-size:28rpx;font-weight: bold;">
											{{ obj.auxiliaryMaterials }}
										</text>
										<u-icon name="arrow-right" size="20" color="#999999"></u-icon>
									</view>
								</view>
								<view class="explain_specific-item" @click="lookCotsList('主材费', 2)">
									<view class="my-slfe-main">
										<view class="specific-item_title">主材</view>
										<text class="myslfe">(业主自购)</text>
									</view>
									<view class="item">
										<text>￥</text>
										<text style="font-size:28rpx;font-weight: bold;">{{
										obj.mainMaterials
										}}</text>
										<u-icon name="arrow-right" size="20" color="#999999"></u-icon>
									</view>
									<!-- <view class="item" v-else>
										<text class="myslfe">业主自购</text>
										<u-icon name="arrow-right" size="20" color="#999999"></u-icon>
									</view> -->
								</view>
							</view>
						</view>
					</view>
					<!-- 设计费用 -->
					<view class="case-explain case-design" v-if="details.designPrice">
						<view class="case-explain_title">
							<text>设计费 <text class="price-symbol">￥</text>
								<text class="case-price">{{ details.designPrice }}元</text>
							</text>
						</view>
					</view>
					<view class="case-flow">
						<view class="case-title">服务流程</view>
						<scroll-view class="case-contain flex-box" :scroll-x="true" :enable-flex="true">
							<view class="case-flow_item" v-if="details.stage && details.stage.length">
								<view class="node-item" v-for="(item, index) in details.stage" :key="index">
									<image class="node-icon" v-if="item.status == 3"
										src="https://www.51mihuo.com/static/icon/my-home/node-fin.png">
									</image>
									<mihuo-image v-else class="node-icon"
										src="https://www.51mihuo.com/static/icon/my-home/node-un.png">
									</mihuo-image>
									<text :class="'node-line node-line_' + item.status"
										v-if="index < details.stage.length - 1"></text>
									<view :class="'node-text node-text_' + item.status">
										{{ item.stageName }}
									</view>
									<text class="node-skillName"
										v-if="item.personSkillName && item.status != 1">{{ item.personSkillName }}</text>
									<view class="flex-box" v-if="item.userId && item.status != 1">
										<u-avatar size="28" :src="$util.avatarImage(item.userId)"></u-avatar>
										<text class="node-user">{{ item.personName }}</text>
									</view>
								</view>
							</view>
							<mh-empty marginTop="0" size="100" v-else title="暂无装修流程~~"></mh-empty>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
		<view class="case-tabs">
			<view id="tabs" class="tabs-item" :class="{ 'case-tabs-sticky': isSticky }">
				<text v-for="(item, index) in tabList" @click="changeTab(index)" :key="index"
					:class="{ 'active-tabs': current === index }">
					{{ item.name }}
				</text>
			</view>
			<view class="case-tabs-item" v-if="hasVideo">
				<view class="title">视频</view>
				<view class="case-design">
					<video class="case-video-large" @error="error" :auto-pause-if-open-native="true"
						:auto-pause-if-navigate="true" :show-fullscreen-btn="false" @play="pauseBannerVideo"
						ref="videoRef2" :http-cache="true" muted :controls="true" :enable-progress-gesture="false"
						:src="videoUrl"></video>
				</view>
				<view class="case-tabs-item_img" v-if="details.images && details.images.length">
					<view v-for="(item, index) in details.imagesNew" :key="index">
						<view v-if="index < 2">
							<view class="item_title">
								<text>{{ item.groupName }}</text>
							</view>
							<common-mh-swiper :src-list="item.images" />
						</view>
					</view>
				</view>
				<view class="open_btn" v-if="details.images && details.images.length > 2">
					<view class="open_btn-is" @click="goToPage('图纸')">
						<text>查看全部</text>
					</view>
				</view>
			</view>
			<view class="case-tabs-item" :id="'case_' + getIndex('设计')">
				<view class="title">设计</view>
				<view class="case-design">
					<view class="case-design_item">
						<view>{{ details.houseType || '' }}</view> <text>户型</text>
					</view>
					<view class="case-design_item">
						<view>{{ details.houseArea || '' }}㎡</view> <text>面积</text>
					</view>
					<view class="case-design_item">
						<view>{{ details.houseStyle || '' }}</view> <text>风格</text>
					</view>
				</view>
				<view class="case-tabs-item_img" v-if="details.images && details.images.length">
					<view v-for="(item, index) in details.imagesNew" :key="index">
						<view v-if="index < 2">
							<view class="item_title">
								<text>{{ item.groupName }}</text>
							</view>
							<common-mh-swiper :src-list="item.images" />
						</view>
					</view>
				</view>
				<view class="open_btn" v-if="details.images && details.images.length > 2">
					<view class="open_btn-is" @click="goToPage('图纸')">
						<text>查看全部</text>
					</view>
				</view>
			</view>
			<view class="case-tabs-item" :id="'case_' + getIndex('报告')">
				<view>
					<view class="title">报告</view>
					<view class="case-report" v-if="details.homeInspection && details.homeInspection.length">
						<view class="case-report_top">
							<view class="report_item" v-for="(item, index) in details.reportList" :key="index">
								<text class="report-num">
									{{ (item.reports && item.reports.length) || 0 }}
								</text>
								<text class="report-name">{{ item.label }}</text>
							</view>
						</view>
						<view class="case-report_main" v-if="reportList && reportList.length">
							<view v-for="(item, index) in reportList" :key="index">
								<view class="report-main_content" v-if="index < 4" @click="goToDetail(item.type, item)">
									<text>
										{{ item.report ? item.report.surveyName : item.acceptanceName }}
									</text>
									<u-icon name="arrow-right" size="24"></u-icon>
								</view>
							</view>
						</view>
					</view>
					<view class="open_btn" v-if="reportList && reportList.length">
						<view class="open_btn-is" @click="goToPage('报告')">
							<text>查看全部</text>
						</view>
					</view>
				</view>
			</view>
			<view class="case-tabs-item" :id="'case_' + getIndex('交付')"
				v-if="details.journal && details.journal.length">
				<view class="title">交付</view>
				<common-mh-log-information @goToPage="goToPage" v-if="details.journal && details.journal.length"
					:data="details.journal" />
			</view>
			<view class="case-tabs-item" :id="'case_' + getIndex('验收')" v-if="checkList && checkList.length">
				<view class="title">验收</view>
				<common-mh-case-acceptance @goToPage="goToPage"
					v-if="details.homeInspection && details.homeInspection.length" :data="details.homeInspection"
					:dataId="option.id" />
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<cover-view class="case-bottom">
			<cover-view class="flex-box case-do">
				<cover-view class="bottom bottom-share" @click="nextDo('装修报价')">获取装修报价</cover-view>
				<cover-view class="bottom" @click="nextDo('我要同款')">我要同款</cover-view>
				<cover-view class="bottom-collect" @click="nextDo('收藏')">
					<cover-image class="collect_image" :src="details.isLike
		        ? 'https://www.51mihuo.com/static/icon/work_type/collected.png'
		        : 'https://www.51mihuo.com/static/icon/work_type/collect.png'" />
					<cover-view class="text">{{ details.collectNum || 0 }}</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<view class="case-bottom">
			<view class="flex-box case-do">
				<view class="bottom bottom-share" @click="nextDo('装修报价')">获取装修报价</view>
				<view class="bottom" @click="nextDo('我要同款')">我要同款</view>
				<view class="base bottom-collect" @click="nextDo('收藏')">
					<image :src="'https://www.51mihuo.com/static/icon/capp/'+ 
						(details.isLike?'have_collect.png':'collect.png')" class="collect_image" />
					<text class="text">{{ details.collectNum || 0 }}</text>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	/**
 * 阶段状态
 * {
    label: '未购买',
    value: 1
  },
  {
    label: '服务中',
    value: 2
  },
  {
    label: '已完成',
    value: 3
  }
 */
	export default {
		data() {
			return {
				videoUrl: '',
				bannerWidth: '',
				type1Current: 1,
				type2Current: 1,
				details: {},
				coverPicList: [],
				leftNum: 0,
				imageTypeIndex: 0,
				transStyle: 0,
				roomPicList: [],
				option: {},
				isFromShare: false,
				scrollTop: 0,
				current: 0,
				tabList: [{
						name: '设计'
					},
					{
						name: '报告'
					},
					{
						name: '交付'
					},
					{
						name: '验收'
					}
				],
				scrollInto: '',
				scrollH: null, //描点可视高度
				screenH: null, //屏幕高度
				caseMainH: null, //上半部分高度
				tabsH: null, //tabs高度
				isSticky: false, //是否吸顶
				isCollect: false,
				costList: [],
				obj: {
					totalPrice: 0,
					laborCosts: 0,
					mainMaterials: 0,
					auxiliaryMaterials: 0
				},
				scollChidH: [],
				scrollChildTop: [],
				masterStatus: [],
				reportList: [],
				checkList: [],
				hasVideo: false, // 是否有案例视频
				bannerVideo: null, // banner里的视频
				pageVideo: null, // 页面里的视频
			}
		},
		onNavigationBarButtonTap(e) {
			this.shareCase()
		},
		onShareAppMessage(e) {
			const coverImg = ''
			const path = `/pages-common/case/recommend/detail?id=${this.option.id}`
			const result = this.$util.shareToWechat(this.details.name, coverImg, path, '案例详情', true, 1)
			return result
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
			if (e.scrollTop >= this.scollChidH[0]) {
				this.isSticky = true
			} else {
				this.isSticky = false
			}
			this.debounce(() => {
				this.positionTab(e.scrollTop)
			}, 500)
		},
		onLoad(option) {
			this.option = option
			this.getDetails()
			if (option.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('内容页', url, this.option.userId)
			}
		},
		onHide() {
			this.hasVideo && this.bannerVideo.pause()
			this.hasVideo && this.pageVideo.pause()
		},
		methods: {
			error(e) {
				// 微信小程序bug 必须重新设置一下url
				this.videoUrl = this.$image.imageGlobal + this.details.caseVideo[0]
			},
			// 播放页面视频
			pauseBannerVideo() {
				// 暂停banner里的视频播放
				// #ifdef H5 || MP-WEIXIN
				this.hasVideo && this.$refs.videoRef && this.$refs.videoRef.pause()
				// #endif
				// #ifdef APP-PLUS
				this.hasVideo && this.bannerVideo.pause()
				// #endif
			},
			positionTab(num) {
				var i = 0,
					sum = 0,
					len = this.scollChidH.length
				if (!(len > 0)) {
					return
				}
				for (i == 0; i < len + 1; i++) {
					sum += this.scollChidH[i]
					if (sum >= num) {
						this.current = i
						return
					}
				}
			},
			onSwiperChange(e) {
				if (this.imageTypeIndex === 1) {
					this.type1Current = e.detail.current + 1
				} else if (this.imageTypeIndex === 2) {
					this.type2Current = e.detail.current + 1
				}
			},
			getDetails(flag) {
				let tabH = []
				let params = {
					id: this.option.id
				}
				if (uni.getStorageSync('userData')) {
					params.userId = uni.getStorageSync('userData').sysUser.userId
				}
				this.$httpApi.getConstruCaseDetail(params).then(res => {
					if (res) {
						uni.setNavigationBarTitle({
							title: res.name
						})
						// 案例视频
						// this.bannerWidth = 1500
						// this.imageTypeIndex = 1
						res.caseVideo = res.caseVideo && JSON.parse(res.caseVideo)
						if (res.caseVideo && res.caseVideo.length !== 0 && res.caseVideo[0]) {
							this.bannerVideo = uni.createVideoContext('videoRef')
							this.pageVideo = uni.createVideoContext('videoRef2')
							this.hasVideo = true
							this.bannerWidth = 2250
							this.imageTypeIndex = 0
							this.videoUrl = this.$image.imageGlobal + res.caseVideo[0]
						} else {
							this.bannerWidth = 1500
							this.imageTypeIndex = 1
						}
						res.coverPic = JSON.parse(res.coverPic)
						// 设计
						res.images = JSON.parse(res.images)
						if (res.images && res.images.length) {
							res.images.map(item => {
								item.images = item.images.split(',') || []
							})
						}
						res.imagesNew =
							res.images && res.images.lrngth && res.images.length > 2 ?
							res.images.slice(0, 2) :
							res.images
						// 交付
						res.journal = JSON.parse(res.journal)
						// 户型图
						res.imagesHouseType = JSON.parse(res.imagesHouseType)
						// 阶段
						res.stage = JSON.parse(res.stage)
						// 报告
						res.homeInspection = JSON.parse(res.homeInspection)
						res.reportList = res.homeInspection && res.homeInspection.length > 4 ? res.homeInspection
							.slice(0, 4) : res.homeInspection
						let arrList = []
						// 报告
						if (res.homeInspection && res.homeInspection.length) {
							res.homeInspection.map(item => {
								if (item.reports && item.reports.length) {
									item.reports.forEach(el => {
										el.type = item.type
										el.name = item.label
									})
								}
								arrList = arrList.concat(item.reports)
							})
						}
						this.reportList = arrList
						this.checkList = arrList.filter(item => item.type == 2)
						// 判断是否有交付
						if (!res.journal || res.journal.length == 0) {
							this.tabList = this.tabList.filter(function(item) {
								return item.name != '交付'
							})
						}
						// 判断是否有验收
						if (this.checkList.length == 0) {
							this.tabList = this.tabList.filter(function(item) {
								return item.name != '验收'
							})
						}
						if (res.tags) {
							res.tags = res.tags.split(',')
						}
						this.details = res
						this.coverPicList = res.coverPic
						this.roomPicList = res.imagesHouseType
						this.operation(res)
						setTimeout(() => {
							for (let index = 0; index < this.tabList.length + 1; index++) {
								let query = uni.createSelectorQuery().select('#case_' + index)
								query
									.fields({
											size: true
										},
										data => {
											tabH.push(data?.height)
										}
									)
									.exec()
							}
							this.scollChidH = tabH
						}, 1000)
						if (flag) {
							this.collect()
						}
					}
				})
			},
			operation(res) {
				let totalPrice = 0
				let laborCosts = 0
				let mainMaterials = 0
				let auxiliaryMaterials = 0
				let totalList = [] //总费用
				if (res.stage && res.stage.length) {
					res.stage.map(item => {
						item.groupList = []
						item.laborCostsList = []
						item.mainMaterialsList = []
						item.auxiliaryMaterialsList = []
						if (item.groupPrice) {
							item.groupList = item.groupList
								.concat(item.groupPrice.laborCosts || [])
								.concat(item.groupPrice.auxiliaryMaterials || [])
								.concat(item.groupPrice.mainMaterials || [])
							item.laborCostsList = item.laborCostsList.concat(
								item.groupPrice.laborCosts || []
							)
							item.mainMaterialsList = item.mainMaterialsList.concat(
								item.groupPrice.mainMaterials || []
							)
							item.auxiliaryMaterialsList = item.auxiliaryMaterialsList.concat(
								item.groupPrice.auxiliaryMaterials || []
							)
							totalList = totalList
								.concat(item.groupPrice.laborCosts || [])
								.concat(item.groupPrice.auxiliaryMaterials || [])
								.concat(item.groupPrice.mainMaterials || [])
						}
					})
				}
				// 总费用
				if (totalList && totalList.length) {
					totalList.map(item => {
						let num = this.$math.floatMul(
							Number(item.price),
							Number(item.quantity)
						)
						totalPrice = this.$math.floatAdd(totalPrice, num)
					})
				}
				// 各阶段费用
				if (res.stage && res.stage.length) {
					res.stage.map(item => {
						item.price = 0
						// 人工费
						item.laborCostsList.some(v => {
							let num = this.$math.floatMul(Number(v.price), Number(v.quantity))
							laborCosts = this.$math.floatAdd(laborCosts, num)
						})
						// 主材
						item.mainMaterialsList.some(v => {
							let num = this.$math.floatMul(Number(v.price), Number(v.quantity))
							mainMaterials = this.$math.floatAdd(mainMaterials, num)
						})
						// 辅材
						item.auxiliaryMaterialsList.some(v => {
							let num = this.$math.floatMul(Number(v.price), Number(v.quantity))
							auxiliaryMaterials = this.$math.floatAdd(auxiliaryMaterials, num)
						})
						if (item.groupList && item.groupList.length) {
							item.groupList.some(v => {
								let num = this.$math.floatMul(Number(v.price), Number(v.quantity))
								item.price = this.$math.floatAdd(item.price, num)
							})
						}
					})
				}
				this.obj.totalPrice = this.$math.accuracy(totalPrice)
				this.obj.laborCosts = this.$math.accuracy(laborCosts)
				this.obj.mainMaterials = this.$math.accuracy(mainMaterials)
				this.obj.auxiliaryMaterials = this.$math.accuracy(auxiliaryMaterials)
			},
			// 分享案例到小程序
			shareCase() {
				// #ifdef APP-PLUS
				const coverImg = this.$util.thumbnailImage(
					this.details.coverPic[0],
					true,
					750
				)
				let title =
					'「' +
					this.details.name +
					'」' +
					(this.details.houseStyle || '') +
					',' +
					(this.details.houseType || '') +
					(this.details.houseArea || 0) +
					'㎡,费用' +
					(this.details.totalPrice || 0) +
					'元,看看人家怎么装修'
				const path = `/pages-common/case/recommend/detail?id=${this.details.id}`
				this.$util.shareToWechat(title, coverImg, path, '案例详情', true, 2)
				// #endif
			},
			imageSwitch(index, num) {
				if (index === 0) {
					// #ifdef H5 || MP-WEIXIN
					// 开始播放
					this.hasVideo && this.$refs.videoRef && this.$refs.videoRef.play()
					// 暂停页面内的视频
					this.hasVideo && this.$refs.videoRef2 && this.$refs.videoRef2.pause()
					// #endif
					// #ifdef APP-PLUS
					// // 开始播放
					// this.hasVideo && this.bannerVideo.play()
					// 暂停页面内的视频
					this.hasVideo && this.pageVideo.pause()
					const temp = this.videoUrl
					this.videoUrl = ''
					setTimeout(() => {
						this.videoUrl = temp
					}, 500)
					// #endif
				} else if (this.imageTypeIndex === 0) {
					// 切换到图片 暂停播放
					// #ifdef H5 || MP-WEIXIN
					this.hasVideo && this.$refs.videoRef && this.$refs.videoRef.pause()
					// #endif
					// #ifdef APP-PLUS
					this.hasVideo && this.bannerVideo.pause()
					// #endif
				}
				this.imageTypeIndex = index
				this.leftNum = num
			},
			getPreview(typeName, url) {
				let tempCover = this.coverPicList.map(item => {
					return this.$util.thumbnailImage(item, false)
				})
				let tempRoom = this.roomPicList.map(item => {
					return this.$util.thumbnailImage(item, false)
				})
				uni.previewImage({
					current: url,
					urls: typeName === '图片' ?
						tempCover : typeName === '详情' ? [url] : tempRoom
				})
			},
			changeTab(index) {
				this.current = index
				let height = this.scollChidH.slice(0, index + 1)
				let scrollTop = height.reduce(function(total, value) {
					return total + value
				})
				let shiftHeight = 80 + 22
				uni.pageScrollTo({
					scrollTop: scrollTop - shiftHeight,
					duration: 300
				})
				this.isSticky = true
			},
			nextDo(type) {
				switch (type) {
					case '分享':
						this.shareCase()
						break
					case '装修报价':
						this.toPage(`/pages-valuation/valuation`)
						break
					case '我要同款':
						if (uni.getStorageSync('userData')) {
							this.getCommonDesign()
						} else {
							this.$util.goToLoginPage()
						}
						break
					case '收藏':
						if (uni.getStorageSync('userData')) {
							this.collect()
							// this.getDetails(true)
						} else {
							this.$util.goToLoginPage()
						}
						break
					default:
						break
				}
			},
			async getCommonDesign() {
				//  登陆后获取呼工人呼叫状态
				if (uni.getStorageSync('userData')) {
					this.masterStatus = await this.$httpApi.getOrderSkillTypeStatus()
				}
				this.$httpApi
					.getPlatformSkills({
						type: '', // 查询全部
						clientType: 'platform'
					})
					.then(res => {
						if (res) {
							let MANAGER = res.find((item) => item.jobCode == 'JOB_MANAGER')
							if (MANAGER) {
								this.toPage(
									`/pages-homeCall/callMasterPage/callMasterPage?title=${MANAGER.skillName}&skillId=${MANAGER.skillId}`
								)
							}
						}
					})
			},
			collect() {
				let title = ''
				this.$httpApi
					.postCollectCase({
						caseId: this.details.id,
						isLike: this.details.isLike ? false : true
					})
					.then(res => {
						if (res) {
							if (this.details.isLike) {
								title = '取消收藏'
								this.details.collectNum -= 1;
							} else {
								title = '收藏成功'
								this.details.collectNum += 1;
							}
							this.details.isLike = !this.details.isLike
							this.$util.toast(title)
						}
					})
			},
			preview(data, url) {
				if (data && data.length) {
					let images = data.map(item => {
						return this.$util.thumbnailImage(item, false)
					})
					uni.previewImage({
						current: url,
						urls: images
					})
				}
			},
			// 装修总费用
			lookCotsList(val, type) {
				this.toPage(
					`/pages-common/case/recommend/expensesList?id=${this.option.id}&title=${val}&type=${type}`
				)
			},
			goToPage(val) {
				switch (val) {
					case '验收报告':
						this.toPage(
							`/pages-common/case/recommend/receivingReport?id=${this.option.id}`
						)
						break
					case '验房报告':
						this.toPage(
							`/pages-common/case/recommend/checkRoomReport?id=${this.option.id}`
						)
						break
					case '图纸':
						this.toPage(
							`/pages-common/case/recommend/drawingList?id=${this.option.id}`
						)
						break
					case '报告':
						this.toPage(
							`/pages-common/case/report/reportList?id=${this.option.id}`
						)
						break
					case '交付':
						this.toPage(
							`/pages-common/case/recommend/deliveryList?id=${this.option.id}`
						)
						break
					default:
						break
				}
			},
			goToDetail(type, data) {
				switch (type) {
					case 1:
						this.toPage(
							`/pages-common/case/report/questionnaireTemplate?title=${data.report.surveyName}&id=${this.option.id}`
						)
						break
					case 2:
						this.toPage(
							`/pages-common/case/report/checkTemplate?title=${data.name}&id=${this.option.id}&acceptanceName=${data.acceptanceName}`
						)
						break
					default:
						break
				}
			},
			getIndex(name) {
				let i = null
				this.tabList.some((item, index) => {
					if (item.name == name) {
						i = index + 1
						return true
					}
				})
				return i
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/image {
		border-radius: 0 0 50rpx 50rpx;
		will-change: transform;
	}

	.case-details-contain {
		padding-bottom: 80rpx;

		.share-mask-fixed {
			width: 70rpx;
			height: 70rpx;
			margin-right: 30rpx;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.share-mask {
			width: 70rpx;
			height: 70rpx;
			margin-right: 30rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.share-icon {
			width: 34rpx;
			height: 34rpx;
		}

		.case-top {
			position: relative;
			overflow: hidden;

			.right-contain {
				height: 750rpx;
				overflow-y: hidden;
				transition: all 0.2s;
				position: relative;
				display: flex;
				flex-direction: row;

				.case-video,
				.left-image,
				.right-image {
					width: 750rpx;
				}

				.video-item {
					width: 100%;
					height: 90%;
					/* #ifdef APP-PLUS */
					height: 80%;
					/* #endif */
				}
			}

			.flex-center-item {
				height: 720rpx;
				width: 100%;
				border-radius: 0 0 50rpx 50rpx;
			}

			.image-switch {
				width: 288rpx;
				height: 50rpx;
				background-color: #ffffff;
				position: absolute;
				bottom: 60rpx;
				left: calc(50vw - 144rpx);
				display: flex;
				flex-direction: row;
				border-radius: 50rpx;

				.left,
				.center,
				.right {
					flex: 1;
					border-radius: 50rpx;
					text-align: center;
					font-size: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.active {
					background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
					color: #ffffff;
				}
			}

			.flex-center {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 75rpx;
				height: 75rpx;
				border-radius: 50%;
				background: rgba(0, 0, 0, 0.2);
			}

			.case-image-num-contain {
				position: absolute;
				bottom: 60rpx;
				right: 20rpx;
				background: rgba(0, 0, 0, 0.3);
				border-radius: 15px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 2rpx 10rpx;

				.image-num-text {
					font-size: 28rpx;
					color: #ffffff;
				}
			}
		}

		.details-contain {
			margin-top: -30rpx;
			background-color: #ffffff;
			position: relative;
			padding: 30rpx;

			.details-title {
				display: flex;
				align-items: center;

				.title {
					font-weight: bold;
					font-size: 32rpx;
					color: #010101;
					font-family: NotoSansHans-Medium;
				}

				.tips {
					background: #000000;
					color: #ffffff;
					font-size: 20rpx;
					border-radius: 6rpx;
					padding: 5rpx 10rpx;
					margin-right: 9rpx;
					flex-shrink: 0;
				}
			}

			.details-information {
				padding-top: 30rpx;

				.case-describe {
					font-size: 24rpx;
					color: #4d4d4d;
					padding: 40rpx 0;
					line-height: 44rpx;
				}

				.case_tag {
					display: flex;
					align-items: center;
					flex-flow: row wrap;
					padding-bottom: 40rpx;

					text {
						width: max-content;
						font-size: 20rpx;
						padding: 5rpx 10rpx;
						color: #806a40;
						border-radius: 6rpx;
						margin-right: 20rpx;
						background: #f6f4f0;
					}
				}

				.case-style {
					border: 1rpx solid #f0f0f0;
					border-radius: 20rpx;
					padding: 30rpx;

					.case-style_item {
						flex: 1;

						text {
							color: #999999;
							font-size: 24rpx;
							margin-right: 27rpx;
						}

						view {
							color: #000000;
							font-size: 24rpx;
							font-weight: bold;
						}
					}

					.bottom {
						margin-top: 30rpx;
					}
				}

				.case-explain {
					border-radius: 20rpx;
					margin-bottom: 30rpx;
					border: 2rpx solid #f0f0f0;

					.case-explain_title {
						display: flex;
						align-items: center;
						justify-content: space-between;
						background: #f7f7f7;
						border-top-right-radius: 20rpx;
						border-top-left-radius: 20rpx;
						padding: 30rpx;

						text {
							color: #000000;
							font-size: 24rpx;
							font-family: NotoSansHans;
							font-weight: bold;
						}

						view {
							color: #fe6e32;
							font-size: 20rpx;
							font-family: NotoSansHans;
						}

						.case-price {
							font-size: 32rpx;
							color: #fe6e32;
						}

						.price-symbol {
							padding-left: 20rpx;
							color: #fe6e32;
							font-size: 20rpx;
						}
					}

					view {
						font-size: 26rpx;
					}

					.case-explain_specific {
						display: flex;
						justify-content: space-between;
						padding: 30rpx;

						.explain_specific-item {
							flex: 1;

							.explain_specific-item {
								color: #000000;
								font-size: 24rpx;
								font-family: NotoSansHans;
							}

							text {
								color: #999999;
								font-size: 20rpx;
								font-family: NotoSansHans;
							}

							.item {
								margin-top: 20rpx;
								display: flex;
								align-items: baseline;
							}

							.my-slfe-main {
								display: flex;
								align-items: baseline;
							}

							.myslfe {
								// margin-top: 10rpx;
								font-size: 20rpx;
								text-align: center;
								color: #ff5d35;
								font-family: NotoSansHans-Medium;
								// background: #FFF0EA;
								padding: 0 10rpx 2rpx;
								border-radius: 8rpx;
							}
						}
					}
				}

				.case-design {
					border: none;

					.case-explain_title {
						border-radius: 20rpx;
					}
				}

				.case-contain {
					width: 100%;
					margin-top: 20rpx;
					white-space: nowrap;

					.case-flow_item {
						display: flex;

						.node-item {
							flex-direction: column;
							margin-right: 40rpx;
							/* #ifdef MP-WEIXIN */
							margin-top: 30rpx;
							/* #endif */
							display: flex;
							align-items: center;
							position: relative;

							&:last-of-type {
								margin-right: 0;
							}

							.node-icon {
								width: 40rpx;
								height: 40rpx;
								text-align: center;
							}

							.node-text {
								text-align: center;
								font-size: 24rpx;
								line-height: 20rpx;
								font-family: NotoSansHans;
								margin-top: 20rpx;
								font-weight: bold;
								color: #999999;

								&.node-text_3 {
									color: #000000;
								}
							}

							.node-line {
								position: absolute;
								height: 4rpx;
								width: calc(100% - 20rpx);
								top: 20rpx;
								left: calc(50% + 30rpx);
								border-radius: 4rpx;
								background: #f0f0f0;

								&.node-line_3 {
									background: #fe6e32;
								}
							}

							.node-skillName {
								color: #fe6e32;
								font-size: 16rpx;
								border: 2rpx solid #fe6e32;
								border-radius: 6rpx;
								margin: 15rpx 0;
								padding: 5rpx;
								font-weight: bold;
								font-family: HuXiaoBo-NanShen;
							}

							.node-user {
								color: #999999;
								font-size: 20rpx;
								padding-left: 10rpx;
								font-family: NotoSansHans-Regular;
							}
						}
					}
				}
			}
		}

		.case-bottom {
			width: 100%;
			height: 130rpx;
			position: fixed;
			bottom: 0;
			background-color: #ffffff;
			border-top: 2rpx #f5f5f5 solid;

			.case-do {
				padding-top: 20rpx;
				/* #ifdef APP-PLUS */
				height: 88rpx;
				/* #endif */
				background: #FFFFFF;
				width: 100%;
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
			}

			.bottom {
				background: #141414;
				border-radius: 12rpx;
				padding: 20rpx 0;
				color: #fff;
				text-align: center;
				font-size: 28rpx;
				font-weight: bold;
				flex: 1;
				height: 80rpx;
				font-family: PingFang-SC;
				margin-left: 20rpx;
			}

			.bottom-share {
				border: 2rpx solid #141414;
				color: #141414;
				background: #ffffff;
			}

			.bottom-collect {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				width: 100rpx;

				.collect_image {
					width: 34rpx;
					height: 34rpx;
				}

				.text {
					color: #999999;
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}
		}

		.case-tabs {
			padding-bottom: 120rpx;

			.tabs-item {
				display: flex;
				align-items: center;
				background: #ffffff;
				height: 100rpx;
				line-height: 100rpx;

				text {
					flex: 1;
					text-align: center;
					color: #808080;
					font-size: 28rpx;
				}

				.active-tabs {
					font-weight: bold;
					color: #000000;
					position: relative;

					&::before {
						content: '';
						position: absolute;
						bottom: 10rpx;
						width: 30rpx;
						background: #000000;
						height: 6rpx;
						border-radius: 40rpx;
						left: 50%;
						transform: translate(-50%);
					}
				}
			}

			.case-tabs-item {
				padding: 0 30rpx;

				.case-tabs-item_img {
					.item_title {
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 30rpx 0;

						text {
							color: #000000;
							font-size: 28rpx;
							font-weight: bold;
							padding: 0 12rpx;
							position: relative;

							&::before {
								content: '';
								position: absolute;
								width: 10rpx;
								height: 10rpx;
								top: 0;
								left: 0;
								border-top: 4rpx solid #000000;
								border-left: 4rpx solid #000000;
							}

							&::after {
								content: '';
								position: absolute;
								width: 10rpx;
								height: 10rpx;
								bottom: 0;
								right: 0;
								border-bottom: 4rpx solid #000000;
								border-right: 4rpx solid #000000;
							}
						}
					}
				}

				.title {
					font-size: 36rpx;
					color: #141414;
					font-family: PingFang-SC;
					font-weight: bold;
					padding: 40rpx 0;
				}

				.case-design {
					display: flex;

					.case-video-large {
						width: 100%;
						border-radius: 20rpx;
					}

					.case-design_item {
						flex: 1;

						view {
							color: #000000;
							font-size: 24rpx;
							font-family: NotoSansHans;
							font-weight: bold;
						}

						text {
							color: #808080;
							font-size: 20rpx;
						}
					}
				}
			}
		}

		.case-report {
			border: 2rpx solid #f7f7f7;
			border-radius: 20rpx;

			.case-report_top {
				padding: 50rpx 0;
				border-top-right-radius: 20rpx;
				border-top-left-radius: 20rpx;
				background: #f7f7f7;
				display: flex;
				align-items: center;

				.report_item {
					flex: 1;
					display: flex;
					flex-direction: column;

					text {
						text-align: center;
						color: #141414;
						font-family: PingFang-SC;
						padding-bottom: 20rpx;
					}

					.report-num {
						font-size: 36rpx;
						font-weight: bold;
					}

					.report-name {
						font-size: 20rpx;
					}
				}
			}

			.case-report_main {
				.report-main_content {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 30rpx;

					text {
						font-size: 28rpx;
						color: #000000;
						font-weight: bold;
						font-family: PingFang-SC;
					}
				}
			}
		}

		.case-tabs-sticky {
			position: fixed;
			top: 84rpx;
			/* #ifdef APP-PLUS */
			top: 144rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			top: calc(88rpx + 40rpx);
			/* #endif */
			right: 0;
			left: 0;
			background: #ffffff;
			z-index: 99;
		}
	}

	.flex-box {
		display: flex;
		align-items: center;
	}

	.case-title {
		font-size: 32rpx;
		color: #141414;
		font-family: NotoSansHans;
		font-weight: bold;
		margin: 30rpx 0;
	}

	.open_btn {
		// height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: $miniBorderRadius;
		margin: 20rpx 0 60rpx 0;

		.open_btn-is {
			border: 1rpx solid #141414;
			border-radius: 40rpx;
			padding: 16rpx 25rpx;
			display: flex;
			align-items: center;
			margin-top: 20rpx;
		}

		text {
			color: #141414;
			font-size: 20rpx;
			font-weight: bold;
			font-family: PingFang-SC;
		}
	}
</style>
