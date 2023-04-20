<template>
	<view class="record-details">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#fff" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				记录详情
			</view>
			<!-- <view slot="right" class="nav-bar-right">
				<image src="@/static/images/getShare.png" v-if="option.orderIds" @click="getShare" mode=""></image>
			</view> -->
		</z-nav-bar>

		<view class="record-all">
			<mihuo-order-information :projectId="projectInfo.projectId"></mihuo-order-information>
		</view>

		<view class="order-contain">
			<view class="order-list-contain">
				<view class="order-list" v-for="(item, index) in orderList" :key="index">
					<view class="item-top">
						<u-avatar v-if="item.company" class="icon-image" :src="$util.thumbnailImage(item.company.companyLogo,true)" size="40">
						</u-avatar>
						<text v-if="item.company" class="item-name">{{ item.company.companyShortName }}</text>
						<u-avatar v-if="item.cityOperator" class="icon-image" :src="$util.thumbnailImage(item.cityOperator.operatorLogo,true)" size="40">
						</u-avatar>
						<text v-if="item.cityOperator" class="item-name">{{ item.cityOperator.name }}</text>
					</view>
					<view class="goods-contain">
						<view class="goods-contain-all" v-for="(even, nums) in item.orders" :key="nums">
							<view class="order-title-type" v-if="even.orderType !== 0">
								<text class="order-type">
									{{ setOrderType(even) }}
								</text>
							</view>
							<view class="item-goods-contain">
								<view class="goods-contain-list" v-for="(en, num) in even.orderItemList" :key="num">
									<!-- 商品订单 -->
									<view class="goods-contain-list-other" v-if="even.orderType == 0">
										<view class="order-title-type">
											<text class="order-type">
												{{ en.platformCategoryTwoName }}
											</text>
										</view>
										<view class="other-list" v-for="(e, n) in en.orderItemList" :key="n">
											<order-information :info="e" typeName="记录" @click="getPagDetails(e)">
											</order-information>
										</view>
									</view>
									<!-- 不是商品订单 -->
									<order-information v-else :info="en" :otherInfo="even" typeName="记录"
										@click="getPagDetails(en, even)"></order-information>
								</view>
							</view>

							<!-- 主订单价格信息 -->
							<view class="price-information-all">
								<view class="price-information-other">
									<price-information :info="even" typeName="记录"></price-information>
								</view>
							</view>
							<!-- 分期支付信息 -->
							<payInformation :info="even"></payInformation>
							<!-- 订单信息：订单编号、支付方式.... -->
							<order-information-text :info="even"></order-information-text>
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
					<view class="item-settlement-way" v-for="(item, index) in paymentMethodList" :key="index">
						<view class="way-left">
							<image :src="item.image" class="balance"></image>
							<text>{{ item.name }}</text>
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
		<mihuo-popup ref="mihuoPopup" height="1000" v-model="showPopup" @close="showPopup = false" :buttonList="buttonList"
			:titleShow="false" buttonShow :closeable="false">
			<view slot="other">
				<set-meal-details :info="setMealDetails"></set-meal-details>
			</view>
		</mihuo-popup>

		<bottom-button v-if="setButtonShow" @click="submit()" title="当面收款"></bottom-button>
	</view>
</template>

<script>
import {
	mapState,
} from 'vuex'
export default {
	data() {
		return {
			option: {},
			paymentMethodShow: false,
			activePayName: '支付宝支付',
			orderDetails: {},
			orderList: [],
			payType: 4,
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
			showPopup: false,
			setMealDetails: '',
			buttonList: [{
				name: '关闭',
				active: false
			}],
			shareSkillName: []

		}
	},
	computed: {
		...mapState(['projectInfo', 'nodeInfo', 'orderInfo']),
		setButtonShow() {
			if (this.orderList.length > 0) {
				let tempStatus = this.orderList[0].orders[0]
				if (tempStatus) {
					if (tempStatus.status < 1) {
						return true
					} else {
						return false
					}
				}
			} else {
				return false
			}
		}
	},
	mounted() {

	},
	onShow() {
		this.getDetails()
		this.getPersonInfo()
	},
	onLoad(option) {
		this.option = option
	},
	onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false;
		}
		// let pages = getCurrentPages()
		// let lastPage = pages[pages.length - 2].route
		// if (lastPage === 'pages/construction/clientBilling/billingDetails') {
		// 	uni.navigateBack({
		// 		delta: 2
		// 	})
		// }
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
		setStatusName() {
			let tempTitle = ''
			switch (this.orderDetails.status) {
				case 0:
					tempTitle = '未支付'
					break;
				case 1:
					tempTitle = '待发货'
					break
				case 2:
					tempTitle = '已发货'
					break
				case 3:
					tempTitle = '待验收'
					break
				case 4:
					tempTitle = '已完成'
					break
				case 5:
					tempTitle = '待售后'
					break
				case 6:
					tempTitle = '售后完成'
					break
				case 7:
					tempTitle = '交易关闭'
					break
				case 8:
					tempTitle = '退款'
					break
				case 9:
					tempTitle = '无效订单'
					break
			}

			// uni.setNavigationBarTitle({
			// 	title: tempTitle
			// })
			uni.setNavigationBarTitle({
				title: '查看订单'
			})
		},
		getDetails() {
			let tempIds = []
			if (this.option.type) {
				tempIds = JSON.parse(this.option.orderIds)
			} else {
				tempIds.push(this.option.orderId)
			}
			if (tempIds.length == 0) {
				return
			}
			this.$httpApi.detailByOrderIds(tempIds).then(res => {
				if (res) {
					res.forEach(el => {
						el.orders.forEach(ev => {
							ev.orderItemList.forEach(en => {
								en['name'] = en.productName
								en['coverImg'] = en.productPic
							})
							ev['productTotalPrice'] = ev.totalAmount // 商品总价
							ev['freightPrice'] = ev.freightAmount // 运费
						})
					})
					this.orderList = res
					this.orderList.forEach(el => {
						el.orders.forEach((ev, num) => {
							if (ev.orderItemList && ev.orderItemList.length > 0) {
								// 商品
								if ([0].includes(ev.orderType)) {
									ev.orderItemList = this.setAnalysisData(ev
										.orderItemList)
								}
							}
						})
					})

					this.setStatusName()
				}
			})
		},
		setAnalysisData(result) {
			let map = {}
			let dest = []
			let resultList = []
			result.forEach(item => {
				if (!map[item.platformCategoryTwoId]) {
					dest.push({
						platformCategoryTwoId: item.platformCategoryTwoId,
						platformCategoryTwoName: item.platformCategoryTwoName,
						orderItemList: [item]
					})
					map[item.platformCategoryTwoId] = item
				} else {
					dest.forEach(el => {
						if (el.platformCategoryTwoId == item.platformCategoryTwoId) {
							el.orderItemList.push(item)
						}
					})
				}
			})
			resultList = [...dest]

			return resultList
		},
		getConfirm() {
			if (!this.activePayName) {
				this.$util.toast("请选择支付方式");
				return
			}
			let tempIds = []
			this.orderList.forEach(el => {
				el.orders.forEach(ev => {
					tempIds.push(ev.id)
				})
			})
			this.toPage(
				`/pages/construction/clientBilling/paymentQrCode?payType=${this.payType}&orderId=${JSON.stringify(tempIds)}`
			)
		},

		submit() {
			this.paymentMethodShow = true
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
		getPagDetails(item, event) {
			if (event.orderType == 3) {
				this.setMealDetails = item
				this.showPopup = !this.showPopup
			}
		},
		getShare() {
			const userData = uni.getStorageSync('userData')
			let tempCoverImg = []
			const totalPrice = this.setTotalPrice && Number(this.setTotalPrice).toFixed(2)
			const tempSkillName = this.shareSkillName.join('、')
			const title =
				`￥${totalPrice} | ${userData.sysUser.nickName}（${tempSkillName}）给您分享的订单`
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
		},
		getPersonInfo() {
			return
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
	}
}
</script>
<style>
page {
	height: 100%;
	background-color: #f5f5f5;
}
</style>

<style lang="scss" scoped>
.nav-bar-right {
	image {
		margin-right: 28rpx;
		width: 36rpx;
		height: 36rpx;
	}
}
.public-item-title {
	padding: 28rpx 0rpx;
	border-bottom: 2rpx dashed #EEE;
}
.model-contain {
	padding-bottom: 52rpx;
	.balance {
		margin-right: 20rpx;
		width: 40rpx;
		height: 40rpx;
	}
	.text-title {
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 2rpx solid #F6F6F6;
		height: 116rpx;
		font-size: 30rpx;
		color: #909299;
	}
	.item-settlement-way {
		display: flex;
		justify-content: space-between;
		margin: 0 32rpx;
		// margin-bottom: 2rpx;
		padding: 42rpx 2rpx;
		border-bottom: 2rpx solid #F6F6F6;
		border-radius: 5px 5px 0 0;
		background: #FFF;
		&:last-child {
			margin-bottom: 0rpx;
			border-bottom: 0;
		}
		.way-left {
			display: flex;

		}
		/deep/ .u-checkbox {
			display: initial;
		}
	}
	.item-button {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0rpx 44rpx;
		border-radius: 10rpx;
		width: 460rpx;
		height: 72rpx;
		background-color: #C8D8FF;
		font-size: 26rpx;
		color: #002FA5;
	}
}
.record-details {
	padding-bottom: 80rpx;
	.record-all {
		border-radius: 0rpx 0rpx 10rpx 10rpx;
		background-color: #fff;
	}
	.order-contain {
		.order-title {
			padding-left: 32rpx;
			font-size: 30rpx;
			color: #303133;
		}
		.order-list-contain {
			border-radius: 10rpx;
			.order-list {
				margin-bottom: 16rpx;
				// background-color: #fff;
				border-radius: 30rpx 30rpx 10rpx 10rpx;
			}
			.item-top {
				display: flex;
				align-items: center;
				padding: 30rpx;
				border-bottom: 2rpx dashed #EEE;
				border-radius: 30rpx 30rpx 10rpx 10rpx;
				background-color: #fff;
				.item-name {
					margin-left: 10rpx;
					font-size: 30rpx;
					color: #303133;

				}
			}
			.goods-contain {

				// padding: 20rpx 40rpx;
				// background-color: #fff;
				.goods-contain-all {
					margin-bottom: 4rpx;
					.goods-contain-list {
						padding: 20rpx;
						border-bottom: 1px dashed #EEE;
						background-color: #fff;
						&:last-child {
							border-bottom: 0rpx;
						}
						.goods-contain-list-other {
							.order-title-type {
								padding: 0rpx 0rpx 20rpx;
							}
							/deep/.goods-list {
								margin-bottom: 20rpx;
							}
						}
					}

				}

			}

		}
	}
	.price-information-all {
		padding: 0rpx 40rpx;
		// margin-top: 2rpx;''
		border-radius: 0rpx 0rpx 10rpx 10rpx;
		border-radius: 8rpx;
		background-color: #fff;
		.price-information-other {
			padding: 20rpx 0rpx;
		}

	}

}
.order-title-type {
	padding: 20rpx 20rpx 0rpx;
	background-color: #fff;
}
.order-type {
	padding: 10rpx 20rpx;
	border-radius: 16rpx 0rpx;
	min-width: 124rpx;
	height: 50rpx;
	background-color: #002FA5;
	line-height: 50rpx;
	font-size: 28rpx;
	color: #fff;

}
.cat-list {
	padding: 36rpx 24rpx;
	border-radius: 10rpx;
	background-color: #fff;
}</style>
