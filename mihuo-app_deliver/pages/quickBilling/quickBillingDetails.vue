<style lang="scss" scoped>
	.nav-bar-right {
		image {
			width: 36rpx;
			height: 36rpx;
			margin-right: 28rpx;
		}
	}

	.mihuo-order-information-page {
		background-color: #fff;
		margin: 0rpx 0rpx 10rpx 0rpx;
		border-radius: 10rpx;
		padding: 32rpx 28rpx 20rpx 28rpx;
		min-height: 196rpx;

		.item-project-name {
			font-size: $middleFontSize;
			color: $seconFontColor;
			font-weight: bold;
		}

		.item-address {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-top: 14rpx;

			.item-left {
				display: flex;
				align-items: flex-start;

				.address-text {
					font-size: $smiddleFontSize;
					max-width: 470rpx;
					color: $seconFontColor;
				}
			}

			.item-right {}
		}

		.item-phone {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 16rpx;

			.item-left {
				.name {
					color: $viceFontColor;
					font-size: $smiddleFontSize;
					margin-right: 4rpx;
				}

				.phone {
					color: $seconFontColor;
					font-size: $middleFontSize;
				}
			}

			.item-right {}
		}

		.item-left {
			display: flex;
			align-items: center;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 6rpx;
			}
		}

		.item-right {
			display: flex;
			flex-direction: row;
			align-items: center;
			white-space: nowrap;

			image {
				width: 24rpx;
				height: 28rpx;
				margin-right: 4rpx;
			}

			.item-text {
				color: $viceFontColor;
				font-size: $smallFontSize;
			}
		}
	}

	.quick-billing-details {}

	.order-list-contain {
		margin-top: 10rpx;
		border-radius: 10rpx;

		.order-list {

			margin-bottom: 16rpx;
		}

		.mulation-quote-list {
			.order-title-type {
				background-color: #fff;
				padding: 20rpx 20rpx 0rpx 20rpx;
			}

			.mulation-quote-information {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 16rpx 40rpx 26rpx 40rpx;

				.item-label {
					color: #606166;
					font-size: 28rpx;
				}

				.item-value {
					color: #606166;
					font-size: 30rpx;
				}
			}
		}

		.item-top {
			padding: 30rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx dashed #EEEEEE;
			background-color: #fff;
			border-radius: 10rpx 10rpx 0rpx 0rpx;

			.item-name {
				margin-left: 10rpx;
				color: #303133;
				font-size: 30rpx;

			}
		}

		.master-order {
			margin-bottom: 2rpx;
		}

		.order-list-all {
			margin-bottom: 20rpx;
			background-color: #fff;

		}

		.mulation-quote {
			padding: 20rpx;
		}

		.goods-contain-list {
			margin-bottom: 20rpx;
			border-bottom: 1px dashed #EEEEEE;
			padding: 20rpx 40rpx;

			&:last-child {
				padding-bottom: 0rpx;
				margin-bottom: 0rpx;
				border-bottom: 0rpx;
			}

			.goods-contain-list-other {
				.order-title-type {
					padding: 20rpx 0rpx;
				}

				/deep/.goods-list {
					margin-bottom: 20rpx;
				}
			}
		}

		.price-information-all {
			padding: 20rpx 40rpx;
			background-color: #fff;
			margin-top: 2rpx;
			border-radius: 0rpx 0rpx 10rpx 10rpx;
		}

	}

	.model-contain {
		padding-bottom: 52rpx;

		.balance {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}

		.text-title {
			font-size: 30rpx;
			color: #909299;
			height: 116rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-bottom: 2rpx solid #F6F6F6;
		}

		.item-settlement-way {
			background: #FFFFFF;
			border-radius: 5px 5px 0px 0px;
			// margin-bottom: 2rpx;
			padding: 42rpx 2rpx;
			margin: 0 32rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: 2rpx solid #F6F6F6;

			&:last-child {
				margin-bottom: 0rpx;
				border-bottom: 0px;
			}

			.way-left {
				display: flex;

			}

			/deep/ .u-checkbox {
				display: initial;
			}
		}

		.item-button {
			margin: 0rpx 44rpx;
			width: 460rpx;
			height: 72rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10rpx;
			background-color: #C8D8FF;
			font-size: 26rpx;
			color: #002FA5;
		}
	}

	.order-title-type {
		padding: 20rpx;

		.order-type {
			min-width: 124rpx;
			padding: 10rpx 20rpx;
			height: 50rpx;
			line-height: 50rpx;
			border-radius: 16rpx 0rpx 16rpx 0rpx;
			background-color: #002FA5;
			font-size: 28rpx;
			color: #fff;

		}
	}
</style>

<template>
	<view class="quick-billing-details">

		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#fff" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				{{pageTitle}}
			</view>
			<view slot="right" class="nav-bar-right">
				<image src="@/static/images/getShare.png" @click="orderShare" mode=""></image>
			</view>
		</z-nav-bar>

		<view class="order-list-contain">
			<view class="mihuo-order-information-page">
				<view class="item-project-name" v-if="receiverDetails.address">
					{{receiverDetails.address}}
				</view>
				<view class="item-address">
					<view class="item-left" v-if="addressDetails && addressDetails.poiName">
						<image src="/static/images/icon-address/weizhi.png" mode=""></image>
						<view class="address-text">{{addressDetails.poiName}}</view>
					</view>
					<view class="item-right" @click="navigation" v-if="addressDetails && addressDetails.latAddress">
						<image src="/static/images/icon-address/address-1.png" mode=""></image>
						<view class="item-text">导航</view>
					</view>
				</view>
				<view class="item-phone">
					<view class="item-left" v-if="receiverDetails.receiverName">
						<image src="/static/images/icon-phone/call-1.png" mode=""></image>
						<text class="name">{{receiverDetails.receiverName}}</text>
						<text
							class="phone">{{receiverDetails.receiverPhone?receiverDetails.receiverPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'):''}}</text>
					</view>
					<view class="item-right" v-if="receiverDetails.receiverName"
						@click="callPhone(receiverDetails.receiverPhone)">
						<image src="/static/images/icon-phone/call.png" mode=""></image>
						<text class="item-text">电话</text>
					</view>
				</view>
			</view>


			<view class="order-list mulation-quote-list">
				<view class="c" v-for="(item,index) in quickBillingList" :key="index">
					<view class="item-top">
						<u-avatar class="icon-image" :src="$util.thumbnailImage(item.companyLogo,true)" size="40">
						</u-avatar>
						<text class="item-name">{{item.companyName}}</text>
					</view>
					<view class="master-order" v-for="(ev,num) in item.orders" :key="num">
						<view class="order-title-type">
							<text class="order-type">
								{{setOrderType(ev)}}
							</text>
						</view>
						<view class="order-list-all" v-for="(eve,nu) in ev.orderItemList" :key="nu">
							<mulation-quote :info="eve" @calculate="calculate($event,eve)" :inputStatus="false"
								@click="getDetails(eve)">
							</mulation-quote>
							<view class="mulation-quote-information">
								<text class="item-label">商品总价</text>
								<text class="item-value">￥{{eve.totalAmount}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 支付方式 -->
		<u-modal v-model="paymentMethodShow" width="546" :async-close="true" :mask-close-able="true"
			:show-confirm-button="false" :show-title="false">
			<view class="model-contain">
				<view class="text-title">选择支付方式</view>
				<view class="list-contain">
					<view class="item-settlement-way" v-for="(item,index) in paymentMethodList" :key="index">
						<view class="way-left">
							<image :src="item.image" class="balance"></image>
							<text>{{item.name}}</text>
						</view>
						<u-checkbox v-model="item.checkbox" shape="circle" :name="item.value" size="40rpx"
							@change="getCheckbox">
						</u-checkbox>
					</view>
				</view>
				<view class="item-button" @click.stop="getConfirm()">确认</view>
			</view>
		</u-modal>

		<!-- 套餐详情 -->
		<mihuo-popup ref="mihuoPopup" height="1000" v-model="showPopup" @close="showPopup = false"
			:buttonList="buttonListPoup" :titleShow="false" buttonShow :closeable="false">
			<view slot="other">
				<set-meal-details :info="setMealDetails"></set-meal-details>
			</view>
		</mihuo-popup>

		<mihuo-bottom-button :buttonList="buttonList" @click="getButton"></mihuo-bottom-button>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	import {
		deepClone
	} from '@/plugins/utils.js'
	import baseConfig from '@/config/common.js'
	export default {
		data() {
			return {
				option: {},
				mulationQuote: '',
				serviceName: '',
				paymentMethodShow: false,
				activePayName: '支付宝支付',
				pageTitle: '订单信息',
				payType: 4,
				currentSkillName: '',
				budgetName: '',
				paymentMethodList: [{
					name: '支付宝支付',
					value: 4,
					image: '/static/images/order_details/large_ali.png',
					checkbox: true
				}, {
					name: '微信支付',
					value: 1,
					image: '/static/images/order_details/large_wx.png',
					checkbox: false
				}],
				quickBillingList: [],
				buttonList: [{
					name: '编辑',
					status: false
				}, {
					name: '扫码查看',
					status: true
				}],
				addressDetails: {
					poiName: ''
				},
				details: {},
				shareSkillName: [],
				receiverDetails: {
					receiverName: '',
					receiverPhone: '',
					address: ''
				},
				setMealDetails: '',
				showPopup: false,
				buttonListPoup: [{
					name: '关闭',
					active: false
				}]
			}
		},
		computed: {
			setTotalPrice() {
				let tempPice = []
				let result = deepClone(this.quickBillingList)
				result.forEach(item => {
					item.orders.forEach(item2 => {
						item2.orderItemList.forEach(item3 => {
							tempPice.push(operation.floatMul(item3.productQuantity, item3
								.productPrice || 0))
						})
					})
				})
				return operation.funCalc(tempPice)
			}
		},
		mounted() {

		},
		onShow() {
			this.standardOrderGenerateForQuote()
		},
		onLoad(option) {
			this.option = option
			this.getPersonInfo()
		},
		methods: {
			setOrderType(item) {
				switch (item.orderType) {
					case 0:
						return '商品'
					case 1:
						return `${item.skillName}服务`
					case 2:
						// return '协作'
						return `${item.skillName}服务`
					case 3:
						if (item.packageFlag == 1) {
							return `套餐内订单`
						} else {
							return `套餐订单`
						}
				}
			},
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.shareSkillName = []
						let resultList = []
						res.personageList.map(item => {
							if (item.auditStatus == 2) {
								if (item.skillName) {
									resultList.push(item)
								}
							}
						})

						this.$httpApi.getWorkType({
							type: 1,
							clientType: 'platform',
							size: 90
						}).then(res => {
							if (res) {
								resultList.forEach(el => {
									res.records.forEach(ev => {
										if (['JOB_MANAGER', 'JOB_DESIGNER'].includes(ev
												.jobCode)) {
											if (ev.skillId == el.skillId) {
												this.shareSkillName.push(el.skillName)
											}
										}
									})
								})

							}
						})
					}
				})
			},
			standardOrderGenerateForQuote() {
				if (!this.option.detailId) {
					return
				}
				this.$httpApi.standardOrderGenerateForQuote({
					id: this.option.detailId
				}).then(res => {
					if (res) {
						this.details = res
						// 初始化字段
						this.addressDetails = res.createServer.address
						res.companyOrders.forEach(item => {
							// 过滤出当前工种的数据
							item.orders.forEach(item2 => {
								this.receiverDetails['receiverName'] = item2.receiverName
								this.receiverDetails['receiverPhone'] = item2.receiverPhone
								this.receiverDetails['address'] = item2.receiverProvince + item2
									.receiverCity + item2
									.receiverRegion + item2.receiverLatAddress

								item2.orderItemList.forEach(item3 => {
									item3['productImg'] = item3.productPic
									item3['productSku'] = item3.productAttr
									item3['price'] = item3.productPrice
									item3['unit'] = item3.productUnit
									item3['quantity'] = item3.productQuantity
								})
							})
						})
						this.quickBillingList = res.companyOrders
					}
				})
			},
			getCheckbox(item) {
				this.paymentMethodList.forEach(el => {
					if (el.value !== item.name) {
						el.checkbox = false
					} else {
						this.activePayName = el.name
						this.payType = el.value
					}
				})
			},
			getButton(item) {
				if (item.name == '编辑') {
					this.toPage(
						`/pages/construction/clientBilling/billingDetails?pageType=2&detailId=${this.details.quoteId}&edit=true`
					)
				} else {
					if (!this.option.detailId) {
						return
					}
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					this.$httpApi.shareById({
						id: this.option.detailId,
						sourceName: null
					}).then(res => {
						uni.hideLoading();
						if (res) {
							// this.paymentMethodShow = true
							this.shareId = res.id
							this.toPage(
								`/pages/construction/clientBilling/paymentQrCode?payType=${1}&detailId=${this.shareId}&pageType=快速开单`
							)
						}
					})
				}
			},
			getConfirm() {
				if (!this.activePayName) {
					this.$util.toast("请选择支付方式");
					return
				}
				this.toPage(
					`/pages/construction/clientBilling/paymentQrCode?payType=${this.payType}&detailId=${this.shareId}&pageType=快速开单`
				)
			},
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			navigation() {
				let {
					latitude,
					longitude
				} = this.addressDetails
				if (latitude === null && longitude === null) {
					this.$util.toast('当前项目未维护地址信息, 请维护地址后重试')
					return
				}
				if (latitude === 0 && longitude === 0) {
					this.$util.toast('当前项目未维护地址信息, 请维护地址后重试')
					return
				}
				// 获取位置的经纬度
				uni.openLocation({
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
					scale: 15
				})
			},
			orderShare() {
				const userData = uni.getStorageSync('userData')
				let tempCoverImg = []
				const totalPrice = this.setTotalPrice && Number(this.setTotalPrice).toFixed(2)
				const tempSkillName = this.shareSkillName.join('、')
				const title =
					`￥${totalPrice} | ${userData.sysUser.nickName}（${tempSkillName}）给您分享的订单`
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				// 保存分享数据	
				this.$httpApi.shareById({
					id: this.option.detailId,
					sourceName: null
				}).then(item => {
					uni.hideLoading();
					uni.share({
						provider: 'weixin',
						scene: 'WXSceneSession',
						type: 5, // 微信小程序
						imageUrl: 'https://www.51mihuo.com/static/images/mihuo-share.JPG',
						title: title,
						miniProgram: {
							id: 'gh_d70e3f34c452', // c端小程序原始id
							path: `/pages-mall/submitOrder/submitOrder?id=${item.id}&shareType=1&userId=${userData.sysUser.userId}`, // 分享到小程序的页面
							type: baseConfig.appletVersion, // 小程序版本  0-正式版； 1-开发版； 2-体验版。
							webUrl: 'https://www.51mihuo.com/' // 兼容低版本的网页链接
						},
						success: res => {
							// this.$util.toast('分享成功~')
						}
					})
				})
			},
			getDetails(e) {
				if (e.serviceType == 1003) {
					this.setMealDetails = e
					this.showPopup = !this.showPopup
				}
			}
		}
	}
</script>
