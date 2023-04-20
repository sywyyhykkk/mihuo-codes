<template>
	<view class="decoration">
		<z-nav-bar :scrollTop="scrollTop" type="transparentFixed" bgColor="#FFFFFF">
			<view slot="default" class="nav-bar">{{ options.title || '' }}</view>
		</z-nav-bar>
		<view class="decoration-header">
			<view class="header-top">
				<swiper class="flex-center-item" :indicator-dots="false" :autoplay="false" @change="onSwiperChange"
					v-if="dataObject">
					<swiper-item v-for="(item, index) in dataObject.banner" :key="index" class="flex-center-item"
						@click="goToSomePage(item)">
						<img-cache-temporary class="flex-center-item" mode="aspectFill" :fade-show="false" :key="index"
							:src="$util.thumbnailImage(item.imgUrl, true)" />
					</swiper-item>
				</swiper>
				<text class="dots"
					v-if="dataObject.banner && dataObject.banner.length">{{curIndex}}/{{dataObject.banner.length}}</text>
			</view>
			<view class="header-main"
				v-if="dataObject.estimateCost && dataObject.estimateCost.questions && dataObject.estimateCost.questions.length">
				<homeCall-mh-checkbox :value="dataObject.estimateCost.questions"
					:checkbox="options.type == 'home_service_1'?false:true" @click="checkbox" />
				<div class="main-radio">
					<view v-if="options.type == 'home_service_1'">
						<homeCall-mh-radio @click="radio" :default-checked="1" :value="dataObject.estimateCost.items" />
					</view>
					<!-- 户型选择弹窗 -->
					<homeCall-mh-house-type v-else @change="houseInput" :value="dataObject.estimateCost.items" />
				</div>
				<div class="main-estimate flex-box">
					<view class="main-estimate_left">
						<view class="flex-box main-estimate_price">
							<view>预估费用</view>
							<view class="price">￥<text>{{ price || 0}}</text>元</view>
						</view>
						<view class="main-estimate_remark">{{ content.estimateCostDes || ''}}</view>
					</view>
					<view class="main-estimate_right" @click="bid">AI精准报价</view>
				</div>
			</view>
		</view>
		<view class="decoration-main common" v-if="dataObject.decorationFlow && dataObject.decorationFlow.length">
			<homeCall-mh-decoration-main :item="dataObject.decorationFlow" @click="serviceShow" />
		</view>
		<!-- 案例 -->
		<view class="decoration-case common" v-if="caseList && caseList.length">
			<view class="case-title">精选案例</view>
			<homeCall-mh-case :value="caseList" />
		</view>
		<!-- 底部按钮 -->
		<homeCall-mh-decoration-button @clickButton="goToPage" />
		<!-- 工种简介 -->
		<master-worker-detail v-model="showDetail" :data="curMaster" @cancel="cancel" @findMasterNow="findMasterHome" />
		<!-- 呼叫师傅 -->
		<call-master v-model="isCallMaster" :data="curMaster" />
	</view>
</template>

<script>
	import {
		masterAvatar
	} from '@/plugins/orderStatus'
	var checkbox = []
	var radio = []
	var houses = []
	export default {
		data() {
			return {
				scrollTop: 0,
				showDetail: false,
				isCallMaster: false,
				curMaster: {},
				masterStatus: [],
				curIndex: 1,
				caseList: [],
				dataObject: {
					banner: [],
					estimateCost: null,
					decorationFlow: [],
				},
				options: {},
				price: 0,
				content: {}
			}
		},
		onLoad(options) {
			this.options = options;
			if (options.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('首页服务', url, this.options.userId)
			}
			this.getDataObject()
			this.getCaseList()
		},
		onShareAppMessage() {
			let shareTitle = ''
			switch (this.options.title) {
				case '全屋装修':
					shareTitle = '风月都好看 家里最浪漫'
					break
				case '旧房局改':
					shareTitle = '物有所爱 人有所归'
					break
				case '精装改造':
					shareTitle = '房子不必大 住好才是家'
					break
				default:
					shareTitle = '觅活'
					break
			}
			const coverImg = ''
			const path = `/pages/home/home?isFromShare=1`
			const result = this.$util.shareToWechat(shareTitle, coverImg, path, '首页呼叫服务', true, 1)
			return result
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			getDataObject() {
				let params = {
					cityOperatorId: uni.getStorageSync('cityOperatorId') || -1,
					code: this.options.type
				}
				this.$httpApi.getDecorationType(params).then(res => {
					if (res) {
						res.content = res.content ? JSON.parse(res.content) : ''
						let obj = res.content;
						// 顶部图层
						this.dataObject.banner = obj.serviceBanner ? obj.serviceBanner : []
						// 预估费用
						this.dataObject.estimateCost = obj.estimateCost || ''
						// 服务流程
						this.dataObject.decorationFlow = obj.decorationProcess || []
						this.content = obj
					}
				})
			},
			getCaseList() {
				this.$httpApi
					.getConstructionCase({
						cityOperatorId: uni.getStorageSync('cityOperatorId') || -1,
						size: 5,
						recommendStatus: 1,
						name: '新房'

					})
					.then((res) => {
						res.records.some((item) => {
							item.coverPic = item.coverPic && JSON.parse(item.coverPic)
						})
						this.caseList = res.records

					})
			},
			checkbox(data) {
				checkbox = data;
				if (radio && radio.value && this.options.type == 'home_service_1') {
					this.price = this.$math.floatMul(Number(data.value), Number(radio.value))
				}
				if (this.options.type != 'home_service_1') {
					this.otherComputer(data, this.houses)
				}
			},
			radio(data) {
				radio = data;
				if (checkbox && checkbox.value) {
					this.price = this.$math.floatMul(Number(data.value), Number(checkbox.value))
				}
			},
			houseInput(data) {
				this.houses = data;
				this.otherComputer(checkbox, data)
			},
			getArrEqual(arr1, arr2) {
				let newArr = [];
				for (let i = 0; i < arr2.length; i++) {
					for (let j = 0; j < arr1.length; j++) {
						if (arr1[j].label === arr2[i].label) {
							newArr.push(arr1[j]);
						}
					}
				}
				return newArr;
			},
			bid() {
				if (!this.content.aiPrice) {
					this.$util.toast("未配置该类型AI报价")
					return
				}
				this.toPage(`/pages-valuation/valuation?id=${this.content.aiPrice}`)
			},
			otherComputer(data, input) {
				let checkd = data || [];
				let house = input || [];
				let numCount = 0
				if (checkd.length && house.length) {
					house.forEach((item) => {
						item.price = this.$math.floatMul(Number(item.value), Number(item.extra));
						item.items = this.getArrEqual((item.relatedItems || []), checkd);
						item.itemNum = item.items && item.items.reduce((pre, cur) => {
							return pre + Number(cur.value);
						}, 0)
						let num = this.$math.floatMul(Number(item.itemNum), Number(item.price));
						numCount = this.$math.floatAdd(Number(numCount), Number(num));
					})
					this.price = numCount;
				} else {
					this.price = 0;
				}
			},
			onSwiperChange(e) {
				this.curIndex = e.detail.current + 1
			},
			getPreview(url) {
				let tempCover = this.dataObject.banner.map(item => {
					return this.$util.thumbnailImage(item, false)
				})
				uni.previewImage({
					current: url,
					urls: tempCover
				})
			},
			async getCommonDesign(jobCode) {
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
							res.forEach(item => {
								if (item.jobCode == jobCode) {
									this.curMaster = item
								}
								masterAvatar.some((v, i) => {
									if (item.skillName.indexOf(v.name) != -1) {
										item.img = v.img
									}
								})
							})
							if (this.masterStatus && this.masterStatus.length) {
								this.masterStatus.map(item => {
									res.forEach(ele => {
										if (item?.skillId == ele.skillId) {
											ele.isServe = true // true:代表服务中
										}
									})
								})
							}
							this.showDetail = true
						}
					})
			},
			// 取消订单
			cancel(id) {
				this.showDetail = false
				uni.showModal({
					title: '确认操作',
					content: '是否确认取消呼叫',
					cancelText: '再等等',
					confirmText: '确认',
					confirmColor: '#FE6E32',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '取消中',
								mask: true
							})
							this.$http
								.post('order/capp/biz_order/cancelCall?skillId=' + id)
								.then(res => {
									if (res) {
										this.$util.toast('取消呼叫成功')
										this.isCallMaster = true
									}
								})
						}
						if (res.cancel) {
							this.showDetail = true
						}
					}
				})
			},
			findMasterHome() {
				this.showDetail = false
				setTimeout(() => {
					this.isCallMaster = true
				}, 200)
			},
			goToPage(type) {
				if (!uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					return
				}
				switch (type) {
					case "客服":
						this.$util.goToWeixin();
						break;
					case "设计师":
						this.getCommonDesign("JOB_DESIGNER")
						break;
					case "管家":
						this.getCommonDesign("JOB_MANAGER")
						break;

					default:
						break;
				}
			},
			serviceShow(data) {
				if (data.content && data.content != "[]") {
					setTimeout(() => {
						uni.$emit("content", data);
					}, 500)
					this.toPage(`/pages-homeCall/typeOfDecoration/contentPage`);
				}
			},
			// 点击banner图跳转
			goToSomePage(data) {
				this.$httpApi
					.getCMSContentById({
						id: data.url
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
		}
	}
</script>
<style>
	page {
		background-color: #F7F7F7;
	}
</style>
<style lang="scss" scoped>
	.decoration {
		padding-bottom: 90rpx;

		.decoration-header {
			background: #FFFFFF;

			.header-top {
				position: relative;
			}

			.flex-center-item {
				border-radius: 0 0 50rpx 50rpx;
				height: 320rpx;
				// padding-top: var(--status-bar-height);
			}

			.dots {
				position: absolute;
				right: 30rpx;
				bottom: 20rpx;
				font-family: NotoSansHans-Regular;
				font-size: 20rpx;
				color: #FFFFFF;
				background: rgba(0, 0, 0, .5);
				padding: 0 16rpx;
				line-height: 40rpx;
				border-radius: 20rpx;
			}

			.header-main {
				padding: 30rpx 30rpx 0;
				background: #FFFFFF;

				.main-radio {
					padding: 30rpx 0;
				}

				.main-estimate {
					justify-content: space-between;
					padding: 30rpx 0;
					border-top: 2rpx solid #F0F0F0;

					.main-estimate_left {
						flex: 1;
						padding-right: 20rpx;
						box-sizing: border-box;

						.main-estimate_remark {
							font-family: NotoSansHans-Regular;
							font-size: 20rpx;
							color: #999999;
							margin-top: 10rpx;
						}

						.main-estimate_price {
							view {
								font-family: NotoSansHans-Medium;
								color: #333333;
								font-size: 24rpx;
								font-weight: bold;
							}

							.price {
								padding-left: 10rpx;
								color: #ED3832;

								text {
									font-size: 30rpx;
									color: #ED3832;
								}
							}
						}
					}

					.main-estimate_right {
						font-family: NotoSansHans-Medium;
						font-size: 28rpx;
						color: #000000;
						font-weight: bold;
						line-height: 80rpx;
						background: #FE6E32;
						border-radius: 40rpx;
						width: 230rpx;
						text-align: center;
					}
				}
			}
		}

		.decoration-main {}

		.decoration-case {
			margin-bottom: 40rpx;

			.case-title {
				color: #141414;
				font-size: 28rpx;
				font-family: NotoSansHans-Medium;
				font-weight: bold;
				padding-bottom: 25rpx;
			}
		}
	}

	.common {
		margin-top: 20rpx;
		background: #FFFFFF;
		padding: 40rpx 30rpx;
	}

	.flex-box {
		display: flex;
		align-items: center;
	}
</style>
