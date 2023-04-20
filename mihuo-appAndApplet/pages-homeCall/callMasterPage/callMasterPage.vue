<template>
	<view class="call">
		<z-nav-bar :scrollTop="scrollTop" type="transparentFixed" bgColor="#FFFFFF">
			<view slot="default" class="nav-bar">{{ options.title + '服务'}}</view>
		</z-nav-bar>
		<view class="call-header">
			<swiper class="flex-center-item" :indicator-dots="false" :autoplay="false">
				<swiper-item v-for="(item, index) in masterContent.serviceBanner" :key="index" class="flex-center-item">
					<img-cache-temporary class="flex-center-item" mode="aspectFill" :fade-show="false" :key="index"
						:customStyle="{
							borderRadius: '0 0 50rpx 50rpx'
						}" :src="$util.thumbnailImage(item, true)" />
				</swiper-item>
			</swiper>
		</view>
		<view class="call-main-top" v-if="masterContent">
			<view class="call-main_item">
				<view v-if="masterContent.serviceFlow && masterContent.serviceFlow !='[]'">
					<view class="call_title">服务流程</view>
					<edit-view v-model="masterContent.serviceFlow"></edit-view>
				</view>
				<view v-if="masterContent.suitableRequirement && masterContent.suitableRequirement != '[]'">
					<view class="call_title">适用需求</view>
					<edit-view v-model="masterContent.suitableRequirement"></edit-view>
				</view>
				<view v-if="masterContent.serviceStage && masterContent.serviceStage.length">
					<view class="flex-center content-contain">
						<view v-for="(item, index) in masterContent.serviceStage" :key="index"
							class="tabs-item flex-center" :class="{'tabs-active':currentTab === index}"
							@click="tapFlow(item,index)">
							{{ item.stageName || ''}}
						</view>
					</view>
					<view class="call-stage" v-for="(item,index) in masterContent.serviceStage[currentTab].products"
						:key="index" @click="toProduct(item)">
						<view class="flex-center">
							<!-- #ifdef APP-PLUS -->
							<mihuo-image class="image-product" mode="aspectToFit"
								src="/static/app-plus/home_v3/shop-24x24.png" />
							<!-- #endif -->
							<!-- #ifndef APP-PLUS -->
							<mihuo-image class="image-product" mode="aspectToFit"
								src="https://www.51mihuo.com/static/icon/home_v3/shop-24x24.png" />
							<!-- #endif -->
							<text>{{ item.name || '' }}</text>
						</view>
						<view class="row">
							<text>￥</text>
							<view>
								<text
									style="font-size:24rpx;font-weight: bold;">{{ Math.floor(item.price) || 0 }}</text>
								<text>{{ item.price | priceFormat }}</text>
							</view>
							<text style="color:#999999;padding:0 8rpx">/&nbsp;{{ item.unit ||'' }}</text>
							<u-icon name="arrow-right" size="20" color="#000000"></u-icon>
						</view>
					</view>
					<view class="call-stage_tips"
						v-if="masterContent.serviceStage[currentTab] && masterContent.serviceStage[currentTab].des">
						{{ masterContent.serviceStage[currentTab].des }}
					</view>
				</view>
			</view>
		</view>
		<view class="call-main-buttom" v-if="masterContent.serviceComment">
			<view class="call-main-buttom_title flex-center">
				<view class="call_title">业主评价</view>
				<!-- <view class="more-icon">
					MORE
					<uni-icons type="right" size="8" />
				</view> -->
			</view>
			<homeCall-mh-owner-evaluate v-model="masterContent.serviceComment" />
		</view>
		<view class="call-main-buttom" v-if="masterContent.serviceManager && masterContent.serviceManager.length">
			<view class="call_title">明星{{options.title || ''}}</view>
			<homeCall-mh-star-master v-model="masterContent.serviceManager" :options="options" />
		</view>
		<view class="call-footer" v-if="masterContent.serviceContent && masterContent.serviceContent != '[]'">
			<edit-view v-model="masterContent.serviceContent" />
		</view>
		<!-- 上门报价师傅 -->
		<call-master v-model="isCallMaster" :data="curMaster" :completeAddress="completeAddress"
			@isOK="getPlatformWorkType"></call-master>
		<homeCall-mh-call-button :btnBg="curMaster.isServe?'#424242':'#000000'" :title="title" @click="callMaster">
		</homeCall-mh-call-button>
	</view>
</template>

<script>
	import {
		masterAvatar
	} from '@/plugins/orderStatus'
	export default {
		data() {
			return {
				scrollTop: 0,
				options: {},
				currentTab: 0,
				isCallMaster: false,
				curMaster: {},
				masterStatus: [],
				ipImage: masterAvatar,
				completeAddress: {},
				masterContent: {},
				title: ''
			}
		},
		onLoad(options) {
			this.options = options;
			this.getData()
			if (options.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('呼叫师傅', url, this.options.userId)
			}
		},
		onShareAppMessage() {
			const coverImg = ''
			let shareTitle = ''
			switch (this.options.title) {
				case '管家':
					shareTitle = '不用成为“行家里手” 轻松找个家装管家'
					break
				case '设计':
					shareTitle = '无设计 不装修'
					break
				default:
					shareTitle = '踏实夯实专业 认真搞好装修'
					break
			}
			const path =
				`/pages-homeCall/callMasterPage/callMasterPage?title=${this.options.title}&skillId=${this.options.skillId}&isFromShare=1`
			const result = this.$util.shareToWechat(shareTitle, coverImg, path, '呼叫师傅', true, 1)
			return result
		},
		onShow() {
			uni.$on('roomAddress', (data) => {
				if (data) {
					this.completeAddress = data
				}
			})
			this.getPlatformWorkType()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			getData() {
				let params = {
					cityOperatorId: uni.getStorageSync('cityOperatorId') || -1,
					skillId: this.options.skillId
				}
				this.$httpApi.callMaster(params).then((res) => {
					if (res) {
						this.masterContent = JSON.parse(res.content)
						this.masterContent.serviceBanner = this.masterContent.serviceBanner ? this.masterContent
							.serviceBanner.split(",") : []
					} else {
						// this.callMaster()
					}
				})
			},
			tapFlow(data, index) {
				this.currentTab = index;
			},
			// 取消订单
			cancel(id) {
				uni.showModal({
					title: '确认操作',
					content: '正在呼叫中，是否取消呼叫',
					cancelText: '再等等',
					confirmText: '确认',
					confirmColor: '#FE6E32',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '取消中',
								mask: true
							})
							this.$http
								.post('order/capp/biz_order/cancelCall?skillId=' + id)
								.then((res) => {
									if (res) {
										this.$util.toast('取消呼叫成功')
										// this.getPlatformWorkType(true)
										this.isCallMaster = true
									}
								})
								.finally(() => {
									uni.hideLoading()
								})
						}
					}
				})
			},
			// 获取平台工种
			async getPlatformWorkType(type) {
				//  登录后获取呼工人呼叫状态
				if (uni.getStorageSync('userData')) {
					this.masterStatus = await this.$httpApi.getOrderSkillTypeStatus()
				}
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
							if (this.masterStatus && this.masterStatus.length) {
								this.masterStatus.map((item) => {
									res.forEach((ele) => {
										if (item?.skillId == ele.skillId) {
											ele.isServe = true // true:代表服务中
										}
									})
								})
							}
							this.curMaster = res.find((item) => item.skillId == this.options.skillId)
							if (this.curMaster.isServe) {
								this.title = `正在呼叫${this.options.title}中...`
							} else {
								this.title = `呼叫${this.options.title}`
							}
							// if (type==true) {
							// 	this.isCallMaster = true
							// }
						}
					})
			},
			// 呼叫师傅
			callMaster() {
				// 呼叫师傅必须登录
				if (!uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					return
				}
				if (this.curMaster.isServe) {
					this.cancel(this.curMaster.skillId)
				} else {
					this.isCallMaster = true
				}
			},
			toProduct(v) {
				if (v.id) this.toPage(`/pages-mall/productDetail/productDetail?id=${v.id}`)
			}
		}
	}
</script>

<style>
	page {
		background-color: #F7F7F7;
	}
</style>

<style lang="scss" scoped>
	.call {
		padding-bottom: 140rpx;
	}

	.call-header {
		background: #FFFFFF;
		height: 320rpx;

		.flex-center-item {
			height: 100%;
		}
	}

	.call-main-top {
		background: #FFFFFF;

		.call-main_item {
			padding: 0 30rpx;

			.content-contain {
				width: 690rpx;
				white-space: nowrap;
				flex-flow: row nowrap;
				overflow-x: scroll;
				overflow-y: hidden;
				padding-bottom: 30rpx;

				.tabs-item {
					background: #F7F7F7;
					text-align: center;
					border-radius: 10rpx;
					padding: 20rpx 24rpx;
					position: relative;
					color: #808080;
					font-family: NotoSansHans-Regular;
					font-size: 28rpx;
					margin-right: 20rpx;

					&:last-child {
						margin-right: 0;
					}
				}

				.tabs-active {
					background: #FE6E32;
					position: relative;
					color: #000000;
					font-weight: bold;
				}
			}

			.call-stage {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 10rpx;

				&:last-child {
					padding-bottom: 20rpx;
				}

				text {
					color: #000000;
					font-size: 20rpx;
					font-family: NotoSansHans-Regular;
				}

				.row {
					display: flex;
					align-items: baseline;
				}

				.image-product {
					width: 24rpx;
					height: 24rpx;
					margin-right: 10rpx;
				}
			}

			.call-stage_tips {
				padding: 24rpx 0;
				border-top: 2rpx solid #F0F0F0;
				color: #ED3832;
				font-size: 24rpx;
				font-family: NotoSansHans-Medium;
			}
		}
	}

	.call-main-buttom {
		margin-top: 20rpx;
		background: #FFFFFF;
		padding: 0 30rpx;

		.call-main-buttom_title {
			justify-content: space-between;

			.more-icon {
				border: 2rpx solid #000000;
				border-radius: 30rpx;
				padding: 12rpx 16rpx;
				font-size: 18rpx;
				color: #000000;
			}
		}
	}

	.call-footer {
		margin-top: 20rpx;
		background: #FFFFFF;
		padding: 30rpx;
	}

	.call_title {
		color: #262626;
		font-family: NotoSansHans-Medium;
		font-size: 28rpx;
		font-weight: bold;
		padding: 30rpx 0;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
