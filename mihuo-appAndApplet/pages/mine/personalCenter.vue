<template>
	<view style="padding-bottom: 40rpx;">
		<view class="header-container flex-center">
			<mihuo-image src="https://www.51mihuo.com/static/icon/personal_center_v2/button_2.png" class="setting-icon"
				@click="goToSetting">
			</mihuo-image>
			<view class="info flex-center">
				<view class="avatar flex-center" @click.stop="changeAvatar" v-if="isLogin">
					<u-avatar size="100" v-if="personInfo.userId" :src="userAvatar" @loadError="loadError" />
				</view>
				<view class="avatar flex-center" @click.stop="changeAvatar" v-else>
					<mihuo-image src="https://www.51mihuo.com/static/images/personal_center_v2/default_avatar.png"
						class="img"></mihuo-image>
				</view>
				<view class="personal-info flex-center" @click.stop="goToSetting" v-if="isLogin">
					<view class="name">
						<text class="user-name">{{ nickName || userName }}</text>
						<text class="user-status" v-if="!isRealName">未实名</text>
					</view>
					<view class="view-text"> 查看编辑个人资料 </view>
				</view>
				<view class="personal-info flex-center" @click.stop="goToSetting(false)" v-else>
					<view class="name"> 未登录 </view>
					<view class="view-text"> 期待与你一同寻觅美好 </view>
				</view>
			</view>
		</view>
		<view class="my-call">
			<div class="my-call_item" @click="myCall">
				<div class="item-left flex-center">
					<!-- #ifdef APP-PLUS -->
					<mihuo-image class="item-left_icon" src="/static/app-plus/my_call.png">
					</mihuo-image>
					<!-- #endif -->
					<!-- #ifndef APP-PLUS -->
					<mihuo-image class="item-left_icon"
						src="https://www.51mihuo.com/static/images/personal_center_v2/my_call.png">
					</mihuo-image>
					<!-- #endif -->
					<text class="item-left_title">我的呼叫</text>
				</div>
				<div class="item-right flex-center">
					<text class="item-right_num"
						v-if="masterStatus && masterStatus.length">{{ masterStatus.length }}</text>
					<u-icon name="arrow-right" color="#000000" size="24"></u-icon>
				</div>
			</div>
		</view>
		<view class="my-order">
			<view class="my-order-header">
				<text class="header-left">我的订单</text>
				<view class="header-right flex-center" @click="viewOrderAll">
					<mihuo-image class="more-icon" src="https://www.51mihuo.com/static/icon/home_v3/more.png">
					</mihuo-image>
				</view>
			</view>
			<view class="order-type">
				<view class="order-type-item" v-for="(item, index) in orderTypelist" :key="index"
					@click="getViewOrderType(index, item)">
					<text class="text-num" v-if="item.num"
						:style="{ right: `${index === orderTypelist.length - 1 ? '16rpx' : ''}`}">
						{{ item.num }}
					</text>
					<mihuo-image :src="item.image" class="order-img"></mihuo-image>
					<text>{{ item.title }}</text>
				</view>
			</view>
		</view>
		<view class="u_swiper" v-if="imagelist.length > 0">
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="2000" :duration="500">
				<swiper-item v-for="(item, index) in imagelist" :key="index">
					<view class="swiper_image">
						<mihuo-image :upperRadius="true" height="148" :bottomRadius="true" borderRadius="16"
							:src="item"></mihuo-image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="center-buttons flex-center">
			<view class="button-item flex-center" @click="buttonClick('预付款')">
				<view class="left">
					<view class="title">
						预付款
					</view>
					<view class="label">
						{{ prePaymentAmount }} <text class="small-text">元</text>
					</view>
				</view>
				<image src="https://www.51mihuo.com/static/icon/mine/my-coupon-2.png" class="right-icon"></image>
			</view>
			<view class="button-item flex-center" @click="buttonClick('优惠券')">
				<view class="left">
					<view class="title">
						优惠券
					</view>
					<view class="label">
						{{ couponCount }}<text class="small-text">张</text>
					</view>
				</view>
				<image src="https://www.51mihuo.com/static/icon/mine/my-coupon-1.png" class="right-icon"></image>
			</view>
		</view>
		<view class="function-module">
			<view class="module" v-for="item, index in moduleList" :key="item.title" @click="goToPage(item)">
				<view class="module-image">
					<mihuo-image :src="item.image"></mihuo-image>
				</view>
				<view class="module-text">{{ item.title }}</view>
				<view class="module-count" v-if="index == 1 && evaluateOrder">
					{{ evaluateOrder }}
				</view>
			</view>
		</view>
		<view class="menu-item" @click="toPage('/pages-mine/recommendMihuo/recommendMihuo')">
			<menu-item titleIcon="https://www.51mihuo.com/static/icon/personal_center_v2/button_16.png" title="推荐觅活"
				height="90" :isShowArrow="false"></menu-item>
		</view>
		<view class="menu-item" @click="toPage('/pages-mine/helpCenter')">
			<menu-item titleIcon="https://www.51mihuo.com/static/icon/personal_center_v2/button_14.png" title="帮助中心"
				height="90" :isShowArrow="false"></menu-item>
		</view>
		<view class="menu-item" @click="goToCMS()">
			<menu-item titleIcon="https://www.51mihuo.com/static/icon/personal_center_v2/button_15.png" title="关于我们"
				height="90" :isShowArrow="false"></menu-item>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				errorUrl: '',
				nickName: '',
				userName: '',
				isLogin: false,
				imagelist: [],
				personInfo: {}, // 用户信息
				orderTypelist: [{
						title: '待付款',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_4.png',
						status: [2],
						value: 'payment',
						num: 0
					},
					{
						title: '待拼团', 
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_17.png',
						status: [6],
						value: 'grouping',
						num: 0
					},
					{
						title: '待发货',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_5.png',
						status: [3],
						value: 'shipment',
						num: 0
					},
					{
						title: '待收货',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_6.png',
						status: [4],
						value: 'shipping',
						num: 0
					},
					// {
					// 	title: '待评价',
					// 	image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_7.png',
					// 	status: [5],
					// 	value: 'evaluate',
					// 	num: 0
					// },
					{
						title: '退款/售后',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_8.png',
						status: [7],
						value: 'aftersale',
						num: 0
					}
				],
				moduleList: [{
						title: '地址管理',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_9.png',
						url: '/pages-common/addressList/addressList'
					},
					{
						title: '我的评价',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_10.png',
						url: '/pages-mine/myEvaluation'
					},
					{
						title: '购物车',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_11.png',
						url: '/pages-mall/shoppingCart/shoppingCart'
					},
					{
						title: '我的收藏',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_12.png',
						url: '/pages-mine/myFav'
					},
					{
						title: '我的足迹',
						image: 'https://www.51mihuo.com/static/icon/personal_center_v2/button_13.png',
						url: '/pages-mine/history'
					}
				],
				isRealName: false,
				loginTime: 0,
				evaluateOrder: 0, // 待评价订单数量
				masterStatus: [], //我正在呼叫的记录
				prePaymentAmount: 0, // 预付款余额
				couponCount: 0, // 优惠券数量
			}
		},
		onLoad() {},
		async onShow() {
			if (uni.getStorageSync('userInfo') && uni.getStorageSync('userData')) {
				this.getPersonInfo()
				this.getOrderStatus()
				this.getPrepaymentAmount()
				this.getCouponCount()
				this.nickName = uni.getStorageSync('userData').sysUser.nickName;
				this.userName = uni.getStorageSync('userData').sysUser.username;
			} else {
				this.userName = "未登录"
				this.isLogin = false
			}
			this.getBannerList();
			this.getPayPwdStatus();
			if (uni.getStorageSync('userData')) {
				let res = await this.$httpApi.getOrderSkillTypeStatus();
				if (res && res.length) {
					this.masterStatus = res
				}
			}
		},
		onTabItemTap(event) {
			const {
				index,
				pagePath
			} = event
			if (index > 1) {
				if (!uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					uni.setStorageSync('navigatePage', '/' + pagePath)
				}
			}
		},
		onHide() {},
		computed: {
			userAvatar() {
				if (!this.personInfo) return
				return (
					this.$util.avatarImage(this.personInfo.userId) +
					'?time=' +
					new Date().getTime()
				)
			}
		},
		methods: {
			// 获取优惠券数量
			getCouponCount() {
				this.$httpApi.getCouponCount().then(res => {
					this.couponCount = res.allCount
				})
			},
			// 获取预付款余额
			getPrepaymentAmount() {
				this.$httpApi.getUserPrepaymentAmount().then(res => {
					this.prePaymentAmount = res
				})
			},
			// 跳转预付款/优惠券
			buttonClick(type) {
				if (type === '预付款') {
					this.toPage('/pages-mine/mihuoPrepayment/mihuoPrepayment')
				} else if (type === '优惠券') {
					this.toPage('/pages-mine/mihuoCoupon/mihuoCoupon')
				}
			},
			// 获取订单状态角标
			getOrderStatus() {
				this.$httpApi.getOrderStatusCount().then(res => {
					if (res) {
						if (res['evaluate']) {
							this.evaluateOrder = res['evaluate'] // 待评价订单
						} else {
							this.evaluateOrder = 0
						}
						// 加上呼叫订单待评价数量
						this.evaluateOrder += Number(res.bizOrderEvaluate)
						if (Number(this.evaluateOrder) > 99) {
							this.evaluateOrder = '...'
						}
						this.orderTypelist.forEach(item => {
							item['num'] = res[item.value] ? (res[item.value] > 99 ? '...' : res[item
								.value]) : 0
						})
					}
				})
			},
			// 关于我们
			goToCMS() {
				this.$httpApi
					.getCMSContent({
						typeTreeCode: 1008
					})
					.then((res) => {
						if (res.records) {
							uni.navigateTo({
								url: '/pages-mine/cms?id=' + res.records[0].id
							})
						}
					})
			},
			loadError(value) {
				this.errorUrl = value
			},
			// 获取banner
			getBannerList() {
				this.$httpApi
					.getBannerList({
						clientType: 'capp',
						cityOperatorId: uni.getStorageSync('cityOperatorId')
					})
					.then((res) => {
						if (res) {
							this.imagelist = res.records.filter(
								(item) => item.description === '我的'
							)
							this.imagelist = this.imagelist.map(
								(item) => this.$image.imageGlobal + item.imgUrl
							)
						}
					})
			},
			// 点击头像
			changeAvatar() {
				this.toPage('/pages-user/setting/personalInfo')
			},
			// 查看全部订单
			viewOrderAll() {
				this.toPage(`/pages-order/orderList?index=-1&status=0`)
			},
			// 按状态查看订单
			getViewOrderType(index, item) {
				if (!uni.getStorageSync('userData') || !uni.getStorageSync('userInfo')) {
					this.$util.goToLoginPage()
					return
				}
				if (['退款/售后'].indexOf(item.title) !== -1) {
					this.toPage(`/pages-order/refund?title=${item.title}`)
				} else {
					this.toPage(
						`/pages-order/orderList?status=${item.status}&index=${index}`
					)
				}
			},
			// 点击功能区按钮
			goToPage(item) {
				this.toPage(item.url)
			},
			// 获取个人信息
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then((res) => {
					if (res) {
						this.isLogin = true
						if (JSON.stringify(this.personInfo) != JSON.stringify(res)) {
							this.personInfo = res
						}
					}
				})
			},
			// 设置
			goToSetting(type = true) {
				if (type) {
					this.toPage('/pages-user/setting/setting')
				} else {
					if (!this.isLogin) {
						this.$util.goToLoginPage()
					} else {
						this.toPage('/pages-user/setting/setting')
					}
				}
			},
			// 判断是否实名
			getPayPwdStatus() {
				this.$httpApi.payPwdStatus().then(res => {
					if (res) {
						this.isRealName = res.idCard
					}
				})
			},
			// 我的呼叫
			myCall() {
				this.toPage('/pages-findMaster/callOrder')
			},
		}
	}
</script>

<style lang="scss">
	@import '@/style/mixin.scss';

	page {
		background-color: #f7f7f7;
	}

	.header-container {
		width: 100vw;
		height: max-content;
		flex-direction: column;
		/* #ifndef MP-TOUTIAO */
		padding: 20rpx 0 0 0;

		/* #endif */
		.setting-icon {
			width: 36rpx;
			height: 36rpx;
			position: absolute;
			/* #ifndef MP-TOUTIAO */
			top: 100rpx;
			/* #endif */
			/* #ifdef MP-TOUTIAO */
			top: 50rpx;
			/* #endif */
			/* #ifdef MP */
			left: 30rpx;
			/* #endif */
			/* #ifndef MP */
			right: 30rpx;
			/* #endif */
		}

		.info {
			width: 100%;
			height: 330rpx;
			/* #ifndef APP-PLUS */
			background-image: url('https://www.51mihuo.com/static/images/personal_center_v2/mine_bg.png');
			/* #endif */
			/* #ifdef APP-PLUS */
			background-image: url('@/static/app-plus/mine_bg.png');
			/* #endif */
			background-repeat: no-repeat;
			background-position: bottom right 70rpx;
			background-size: 62rpx 106rpx;
			padding-top: 40rpx;

			.avatar {
				margin-left: 30rpx;
				justify-content: center;

				.img {
					width: 114rpx;
					height: 114rpx;
					border-radius: 50%;
				}

				.img-icon {
					width: 32rpx;
					height: 32rpx;
					position: absolute;
					padding: 4rpx;
					top: 200rpx;
					left: 114rpx;
					border-radius: 50%;
					background-color: #ff7237;
				}
			}

			.personal-info {
				flex: 1;
				max-width: 500rpx;
				flex-direction: column;
				padding-top: 6rpx;
				margin-left: 30rpx;

				.name {
					width: 100%;
					height: 40rpx;
					display: flex;
					align-items: center;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 36rpx;
					line-height:  40rpx;
					color: #333333;
					@include toe();

					.user-name {
						color: #333333;
						font-style: normal;
						font-weight: bold;
						font-size: 36rpx;
						margin-right: 10rpx;
					}

					.user-status {
						font-size: 18rpx;
						color: #ffffff;
						background: #ff5d35;
						padding: 2rpx 10rpx;
						border-radius: 4rpx;
					}
				}

				.view-text {
					width: 100%;
					margin-top: 20rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #666666;
				}
			}
		}
	}

	.my-call {
		width: 690rpx;
		border-radius: 20rpx;
		/* #ifdef APP-PLUS */
		background: url('/static/app-plus/my_call_bg.png') no-repeat;
		/* #endif */
		/* #ifndef APP-PLUS */
		background: url('https://www.51mihuo.com/static/images/personal_center_v2/my_call_bg.png') no-repeat;
		/* #endif */
		background-size: 690rpx 120rpx;
		line-height: 120rpx;
		margin: 0 30rpx 20rpx;

		.my-call_item {
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;

			.item-left_icon {
				width: 42rpx;
				height: 42rpx;
				margin-right: 20rpx;
			}

			.item-left_title {
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
				font-family: NotoSansHans-Bold;
			}

			.item-right {
				.item-right_num {
					background: #ED3832;
					height: 32rpx;
					min-width: 32rpx;
					border-radius: 32rpx;
					line-height: 32rpx;
					margin-right: 20rpx;
					color: #FFFFFF;
					font-family: NotoSansHans-Regular;
					font-size: 20rpx;
					text-align: center;
				}
			}
		}
	}

	.my-order {
		width: 690rpx;
		min-height: 258rpx;
		margin: 0rpx 30rpx 14rpx 30rpx;
		padding: 40rpx 0rpx;
		border-radius: 20rpx;
		background-color: #ffffff;

		.my-order-header {
			padding: 0 30rpx;
			margin-bottom: 50rpx;
			display: flex;
			justify-content: space-between;

			.header-left {
				font-weight: bold;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #303133;
			}

			.header-right {
				font-weight: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909199;

				.more-icon {
					width: 68rpx;
					height: 18rpx;
				}
			}
		}

		.order-type {
			display: flex;
			justify-content: space-between;

			.order-type-item {
				width: 20%;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;

				.text-num {
					height: 32rpx;
					width: 32rpx;
					top: -8rpx;
					left: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					font-weight: bold;
					font-size: 22rpx;
					line-height: 30rpx;
					color: #ffffff;
					position: absolute;
					background: #ff5d35;
					z-index: 10;
				}

				.order-img {
					height: 48rpx;
					width: 48rpx;
					margin-bottom: 20rpx;
				}

				text {
					font-size: 24rpx;
					line-height: 24rpx;
					color: #000000;
				}
			}
		}
	}

	.center-buttons {
		width: 690rpx;
		margin: 20rpx 30rpx 0rpx 30rpx;
		justify-content: space-between;

		.button-item {
			width: 335rpx;
			height: 122rpx;
			background-color: #FFFFFF;
			justify-content: space-between;
			border-radius: 20rpx;
			padding: 20rpx 30rpx;

			.left {
				.title {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: normal;
					color: #000000;
					line-height: 36rpx;
				}

				.label {
					height: 36rpx;
					font-size: 32rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 36rpx;
					margin-top: 20rpx;
					@include toe();

					.small-text {
						height: 36rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						line-height: 36rpx;
						color: #000000;
						margin-left: 10rpx;
					}
				}
			}

			.right-icon {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}

	.function-module {
		margin: 20rpx 30rpx 0rpx 30rpx;
		background-color: #ffffff;
		display: flex;
		flex-wrap: wrap;
		padding: 45rpx 0rpx;
		border-radius: 16rpx;
		margin-bottom: 10rpx;

		.module {
			width: 20%;

			.module-image {
				width: 40rpx;
				height: 40rpx;
				margin: 0 auto;
				margin-bottom: 20rpx;
			}

			.module-text {
				margin-top: 14rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-size: 24rpx;
				line-height: 24rpx;
				text-align: center;
				color: #a8a8a8;
			}

			.module-count {
				height: 32rpx;
				width: 32rpx;
				margin-left: 80rpx;
				margin-top: -90rpx;
				text-align: center;
				border-radius: 50%;
				font-weight: bold;
				font-size: 22rpx;
				line-height: 32rpx;
				color: #ffffff;
				position: absolute;
				background: #ff5d35;
				z-index: 10;
			}
		}
	}

	.menu-item {
		width: 690rpx;
		border-radius: 20rpx;
		margin: 0 15rpx;
		margin-top: 20rpx;
	}

	.u_swiper {
		width: 690rpx;
		margin: 20rpx 30rpx 12rpx 30rpx;

		.swiper {
			height: 148rpx;

			.swiper_image {
				width: 690rpx;
				height: 148rpx;
				border-radius: 16rpx;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
