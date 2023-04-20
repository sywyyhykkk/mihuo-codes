<template>
	<view class="personal-page">
		<public-module></public-module>
		<!-- <z-nav-bar backState="2000" fontColor="white" :bgColor="['$themeColor','$themeColor']" title=""></z-nav-bar> -->
		<view class="head_bg">
			<view class="head_bgm">
				<view class="title_back">
					<!-- 这里如果用户是企业添加, 用的是默认头像, 则通过$util.avatarImage拿不到用户头像 -->
					<u-avatar size="114" v-if="personInfo.userId" :src="userAvatar()" @click.native="seeAvatar()"
						@loadError="loadError" />
					<image v-else class="head_image" src="../../static/logo.png"></image>
					<view class="head_info">
						<view class="head_name">
							<view class="name" v-if="personInfo.userId">
								{{ userRealName }}
							</view>
							<view class="name" v-else @click="gotoPhone"> 请先登录 </view>
							<view class="select_type" v-if="personInfo.userId">
								<picker class="select_type-contain" @change="bindPickerChange" :value="index"
									:range="skillTypeList">
									<view class="text_type">{{ skillTypeList[index] }}</view>
								</picker>
								<image src="../../static/images/down_drop.png" class="arrow_down"></image>
							</view>
							<!-- 有交质保金就显示 -->
							<view class="deposit-tag" v-if="userDetails && userDetails.retentionAmount">
								<image src="@/static/images/zhi_bao_1.png" mode=""></image>
							</view>
						</view>
						<view class="evaluation-signature" v-if="personInfo.userId">
							{{ selfSignature || '要不是生活所迫，谁愿意一身才华' }}
						</view>
						<image @click="goToSetting" src="../../static/images/set.png" class="set_image"></image>
						<!-- <image @click="scanQRCode" src="../../static/images/scan.png" class="set_image2"></image> -->

						<!-- <view class="rate" v-if="personInfo.userId">
							<view class="item-rate-contain">
								<u-rate :disabled="true" :count="rateValue" active-color="#002FA5"
									inactive-color="#D2D9E6" v-model="rateValue"></u-rate>
								<span class="rate_value">{{ rateValue }}.0分</span>
							</view>
						</view> -->

						<view class="levelName-contain" v-if="personInfo.userId && getLevelName" @click="getIntegral()">
							<view class="item-left">
								<text>{{getLevelName}}</text>
							</view>
							<view class="item-right">
								<text>等级将更新</text>
								<image class="icon_right" src="/static/images/mine/icon_right.png" />
							</view>
						</view>
					</view>
				</view>
				<view class="account_bank" @click="goBalanceAccount('绑卡')" v-if="!isBind">
					<view class="left_label">您还未绑定银行卡</view>
					<view class="right">
						<view class="label">去绑定</view>
						<image class="icon_right" src="/static/images/mine/icon_right.png" />
					</view>
				</view>

				<!-- 积分规则 -->
				<view class="integral-moudel" v-if="listIntegral.length > 0" @click="getIntegral()">
					<!-- <text class="item-left">距本季度工匠等级积分结算还剩3天，您当...</text> -->
					<u-notice-bar speed="100" :volume-icon="false" :list="listIntegral"></u-notice-bar>
					<view class="item-right">查看规则</view>
					<image src="@/static/images/rule.png" mode=""></image>
				</view>

				<view class="pice_moudel">
					<view class="pice_moudel_left">
						<view class="align-center">
							<view class="account_balance">账户余额<text>（元）</text></view>
							<image class="eye" :src="
                  !displayMoney
                    ? '/static/images/mine/eye2.png'
                    : '/static/images/mine/close_eye.png'
                " @click="clickDisplay" />
						</view>

						<view class="balance_see">
							<view class="money">{{
                !displayMoney ? balance : '******'
              }}</view>
						</view>
					</view>
					<view class="detial_button" @click="goBalanceAccount('详情')">
						<view class="detial">详情</view>
						<image class="icon_right" src="/static/images/mine/icon_right.png" />
					</view>
					<!-- <view class="withdraw_button" @click="goBalanceWithdrawal()">提现</view> -->
					<view style="clear: both"></view>
					<view class="income_points">
						<view class="bottom_left_module" @click="goIncomeExpense('累计收入')">
							<view class="bottom_text">累计收入</view>
							<view class="bottom_value">{{ totalIncome / 100 }}</view>
						</view>
						<view class="bottom_right_module" @click="goIncomeExpense('我的积分')">
							<view class="bottom_text">我的积分</view>
							<view class="bottom_value">{{getMyPoints}}</view>
							<!-- <view class="bottom_value">0</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mine_release">
			<view class="left_label">我的发布</view>
			<view class="right" @click="moreRelease">
				<view class="label">查看</view>
				<image class="icon_right" src="/static/images/mine/icon_right.png" />
			</view>
		</view>
		<view class="moduel-contain" v-if="moduleList.length > 0">
			<view class="item-title">其他服务</view>
			<view class="item-moduel-list">
				<view class="item-moduel" v-for="(item, index) in moduleList" :key="index" @click="goToPage(item)">
					<image :src="item.icon" mode=""></image>
					<text class="item-text">{{item.title}}</text>
					<view class="item-tag" v-if="item.title == '实名认证'">
						<text class="tag-text">{{isRealName ? '已实名' : '未实名'}}</text>
					</view>
					<view class="item-tag" v-if="item.title === '开启觅活小店' || item.title === '觅活小店'">
						<text class="tag-text">赚更多</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="functaion_moduel">
			<view class="menu" v-for="(item, index) in moduleList2" :key="index">
				<menu-item :title="item.title" :leftIcon="item.image" :height="96" @click="  goToPage(item)"
					:border="false" background="transparent">
				</menu-item>
			</view>
		</view>
	</view>
</template>

<script>
	import base from '@/config/common.js'
	import common from '@/config/common.js'
	export default {
		data() {
			return {
				displayMoney: true,
				balance: 0,
				userRealName: '',
				isRealName: false,
				personId: '',
				selfSignature: '',
				rateValue: 5, // 工种星级
				imagelist: [],
				indicatorDots: false,
				autoplay: true,
				interval: 5000,
				duration: 500,
				index: 0,
				personInfo: {},
				skillTypeList: [],
				personageList: [],
				moduleList: [],
				listIntegral: [],
				moduleDataList: [{
						title: '技能认证',
						image: '@/static/images/mine/skill.png',
						// url: '/pages/sopFileUpload/sopFileUpload',
						url: '/pages/setting/skillCertification/skillCertificationPage',
						icon: '/static/images/icon_personal/icon_1.png'
					},
					{
						title: '开启觅活小店',
						image: '/static/images/mine/icon_1.png',
						url: '/pages/mine/shop/agreement',
						icon: '/static/images/icon_personal/icon_2.png'
					},
					{
						title: '觅活小店',
						image: '/static/images/mine/icon_1.png',
						url: '/pages/mine/shop/shopPage',
						icon: '/static/images/icon_personal/icon_2.png'
					},
					{
						title: '质保金管理',
						image: '@/static/images/mine/skill.png',
						url: '/pages/mine/deposit/depositPage',
						icon: '/static/images/icon_personal/icon_3.png'
					},
					{
						title: '团队管理',
						image: '@/static/images/mine/skill.png',
						url: '/pages/user/userTeam',
						icon: '/static/images/icon_personal/icon_4.png'
					},
					{
						title: '我的保险',
						image: '/static/images/mine/icon_1.png',
						url: '/pages/mine/Insurance/InsurancePage',
						icon: '/static/images/icon_personal/icon_5.png'
					},

					// {
					// 	title: '我的申述',
					// 	image: '../../static/images/mine/icon_2.png',
					// 	url: '/pages/construction/complaint/complaintList'
					// },
					{
						title: '奖罚记录',
						image: '@/static/images/mine/wallet.png',
						url: '/pages/construction/punish/punishIndex?pageType=我的罚款记录',
						icon: '/static/images/icon_personal/icon_6.png'
					},
					{
						title: '实名认证',
						image: '/static/images/mine/real_name.png',
						url: '/pages/user/realName',
						icon: '/static/images/icon_personal/icon_7.png'
					},
					// {
					// 	title: '验收记录',
					// 	image: '/static/images/mine/icon_5.png',
					// 	url: '/pages/construction/materialManagement/materialDetail'
					// },
					// {
					// 	title: '账号设置',
					// 	image: '@/static/images/mine/account_set.png',
					// 	url: '/pages/setting/setting',
					// 	icon: '/static/images/icon_personal/icon_8.png'
					// },
					{
						title: '常驻地设置',
						image: '@/static/images/mine/account_set.png',
						url: '/pages/permanentResidence/permanentResidence',
						icon: '/static/images/icon_personal/icon_8.png'
					}
				],
				moduleList2: [{
						title: '帮助中心',
						image: '@/static/images/mine/help.png',
						url: '/pages/setting/helpCenter'
					},
					{
						title: '意见反馈',
						image: '@/static/images/mine/opinion.png',
						url: '/pages/mine/feedback'
					},
					{
						title: '账号设置',
						image: '@/static/images/mine/account_set.png',
						url: '/pages/setting/setting',
						icon: '/static/images/icon_personal/icon_8.png'
					},
				],
				userStateList: ['接单中', '施工中'],
				userAccountData: {},
				isBind: false,
				totalIncome: 0,
				errorUrl: '',
				userDetails: ''
			}
		},
		computed: {
			getModuleList() {},
			getLevelName() {
				if (this.personageList[this.index]) {
					return this.personageList[this.index].levelName
				}
			},
			getMyPoints() {
				if (this.personageList[this.index]) {
					return this.personageList[this.index].integral
				}
				return 0
			}
		},
		onShow() {
			if (uni.getStorageSync('userInfo')) {
				// 如果接口返回424的错误会跳转到登录页,不用单独处理
				this.getPersonInfo()
				let userData = uni.getStorageSync('userSetting')
				if (userData) {
					if (userData && userData.realName) {
						// 先获取realName
						this.userRealName = userData.realName
					} else if (userData.personageList[0]) {
						// 获取用户信息里第一个工种的姓名
						this.userRealName = userData.personageList[0].skillName
					}
					// 获取不到用户的姓名时, 显示用户的username
					if (this.userRealName === '') {
						this.userRealName = userData.phone
					}
				}
				this.getAccountStatus()
				this.bindCardState()
				this.queryBalance()
				this.getTotalIncome()
				this.usedIsReal()
				this.getUserInfo()
				this.retentionAccount()

				// 觅活小店
				this.myShop()


			}
			this.getBannerList()
		},

		methods: {
			myShop() {
				// return
				this.$httpApi.myShop().then(res => {
					if (res) {
						this.moduleList = this.moduleDataList.filter(item => item.title !== '开启觅活小店')
					} else {
						this.moduleList = this.moduleDataList.filter(item => item.title !== '觅活小店')
					}
				})
			},
			retentionAccount() {
				this.$httpApi.retentionAccount().then(res => {
					if (res) {
						this.userDetails = res
					}
				})
			},
			moreRelease() {
				// this.toPage('/pages/demo/inventedList')
				this.toPage('/pages/demandMarket/mineReleaseDemand')
			},
			getAccountStatus() {
				this.$httpApi.getPaymentAccountStatus().then(res => {
					for (let key in res) {
						if (key == 0) {
							this.$httpApi.registerPaymentAccount().catch(err => console.log(err))
						}
					}
				}).catch(err => console.log(err))
			},
			//是否设置过支付密码（发布订单的时候只验证了手机号没有设置过支付密码的情况）
			usedIsReal() {
				this.$httpApi.payPwdStatus().then(res => {
					if (res) {
						this.isRealName = res.idCard
					}
				})
			},

			gotoPhone() {
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: '/pages/univerifyLogin/univerifyLogin'
				})
				// #endif
				// #ifdef H5
				uni.navigateTo({
					url: '../user/login'
				})
				// #endif
			},
			userAvatar() {
				return (
					this.$util.avatarImage(this.personInfo.userId) +
					'?time=' +
					new Date().getTime()
				)
				// return this.$util.avatarImage(this.personInfo.userId);
			},
			loadError(value) {
				this.errorUrl = value
			},
			// 扫描二维码
			scanQRCode() {

			},
			// 获取累计收入
			getTotalIncome() {
				this.$httpApi
					.incomeExpenditureTotal({}, false)
					.then((res) => {
						if (res) {
							this.totalIncome = res.incomeAmount
						}
					})
					.catch((err) => console.log(err))
			},
			// 点击显示余额
			clickDisplay() {
				this.displayMoney = !this.displayMoney
			},
			// 余额查询（注册支付账户成功之后）
			queryBalance() {
				this.$httpApi
					.getPaymentAccountBalance({}, false)
					.then((res) => {
						if (res) {
							this.balance = res
						}
					})
					.catch((err) => console.log(err))
			},
			// 点击banner跳转
			bannerClick(index) {
				if (!this.imagelist[index].url) return
				this.$httpApi
					.getCMSContent({
						typeTreeCode: this.imagelist[index].url
					})
					.then((res) => {
						if (res.records.length > 0) {
							let data = JSON.parse(res.records[0].content)[0]
							let type = data.type
							if (type === 'link') {
								// 跳转app页面
								uni.navigateTo({
									url: data.listdata[0].appPage
								})
							} else {
								// 跳转富文本页面
								uni.navigateTo({
									url: '/pages/mine/cms?list=' + JSON.stringify(res.records[0])
								})
							}
						} else {
							uni.showToast({
								title: '暂无内容~',
								icon: 'none'
							})
						}
					})
			},
			// 获取banner
			getBannerList() {
				this.imagelist = []
				this.$httpApi
					.getBannerList({
						clientType: 'app',
						cityOperatorId: uni.getStorageSync('userAddress').id || -1
					})
					.then((res) => {
						if (res) {
							res.records.forEach((item) => {
								if (item.description === '我的') {
									this.imagelist.push(item)
								}
							})
						}
					})
			},
			// 查看头像
			seeAvatar() {
				let imageGlobal =
					this.errorUrl ||
					this.$util.avatarImage(this.personInfo.userId) +
					'?time=' +
					new Date().getTime()
				uni.previewImage({
					current: imageGlobal,
					urls: [imageGlobal]
				})
			},

			goToPage(item) {
				//实名认证之后才能去技能认证
				if (!this.isRealName && item.title === '技能认证') {
					uni.showModal({
						title: '确认操作',
						content: '完成实名认证之后才能做技能认证，是否先去实名认证？',
						success: (res) => {
							if (res.confirm) {
								this.toPage('/pages/user/realName?pageType=技能认证')
							}
						}
					})
					return
				}
				if (uni.getStorageSync('userInfo')) {
					// 实名认证
					if (this.isRealName && item.title === '实名认证') {
						uni.showToast({
							title: '您已完成实名认证~',
							icon: 'none'
						})
						return
					}
					uni.navigateTo({
						url: item.url
					})
				} else {
					this.gotoPhone()
				}
			},
			goFindPerson() {
				uni.navigateTo({
					url: '/pages/mine/findPerson'
				})
			},
			// 个人信息
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then((res) => {
					if (res) {
						this.personInfo = res
						this.skillTypeList = []
						this.personageList = []
						res.personageList.forEach((item, index) => {
							if (item.skillName) {
								this.skillTypeList.push(item.skillName)
								this.personageList.push(item)
							}
						})
						if (this.personageList.length > 0) {
							this.$store.commit('setSkillId', this.personageList[0].skillId)
						}

						if (this.personageList.length > 0)
							this.selfSignature = this.personageList[0].servicePromise


						// 横幅
						this.userInfOgetPersonMsg()
					}
				})
			},
			getUserInfo() {
				// 获取个人信息，判断是否实名
				return
				this.$httpApi.getPersonInfo().then((res) => {})
			},
			bindPickerChange(e) {
				this.index = e.target.value
				this.selfSignature = this.personageList[e.target.value].servicePromise
				this.$store.commit(
					'setSkillId',
					this.personageList[e.target.value].skillId
				)
				this.userInfOgetPersonMsg()
				switch (this.personageList[e.target.value].jobCode) {
					case 'JOB_MANAGER':
						this.$store.commit('setUserRole', 'R_PROJECT_MANAGER')
						this.$store.commit(
							'setUserPersonId',
							this.personageList[e.target.value].personId
						)

						break
					case 'JOB_SUPERVISION':
						this.$store.commit('setUserRole', 'R_PROJECT_SUPERVISION')
						this.$store.commit(
							'setUserPersonId',
							this.personageList[e.target.value].personId
						)
						break
					case 'JOB_DESIGNER':
						this.$store.commit('setUserRole', 'R_DESGINER')
						this.$store.commit(
							'setUserPersonId',
							this.personageList[e.target.value].personId
						)
						break
					case 'JOB_WORKER':
						this.$store.commit('setUserRole', 'R_WORKER')
						this.$store.commit(
							'setUserPersonId',
							this.personageList[e.target.value].personId
						)
						break
					default:
						// 不是这几个的默认为设计师
						this.$store.commit('personId', 'R_DESGINER')
				}
			},
			// 是否绑定银行卡
			bindCardState() {
				this.$httpApi
					.getPaymentAccountBankCard({}, false)
					.then((res) => {
						if (!res.length) {
							this.isBind = false
						} else {
							this.isBind = true
						}
					})
					.catch((err) => {})
			},
			// 用户账户状态
			getUserAccountState(type) {
				//方式重复请求
				this.debounce(() => {
					this.$httpApi.getPaymentAccountStatus({}, false).then((res) => {
						if (res) {
							for (let key in res) {
								switch (key) {
									case '0':
									case '1':
										this.toPage('/pages/user/bindPhoneStep')
										break
									case '2':
										this.toPage('/pages/user/realNameStep')
										break
									case '3':
										// 用于判断用户是否绑定了银行卡
										if (!this.isBind) {
											this.toPage('/pages/user/bindCardStep')
										}
										break
									case '4':
										this.toPage('/pages/electronicProtocol/electronicProtocol')
										break
									case '5':
										if (!this.isBind) {
											this.toPage('/pages/user/bindCard')
										} else {
											switch (type) {
												case '提现':
													this.toPage(
														`/pages/mine/balanceWithdrawal?balance=${this.balance}`
													)
													break
												case '详情':
													this.toPage(
														`/pages/mine/balanceAccount?isBind=${this.isBind}`
													)
													break
												case '累计收入':
													this.toPage(
														`/pages/mine/incomeExpense?pageType=${type}`
													)
													break
												case '结算中':
													this.toPage(`/pages/mine/moneyingRecord`)
													break
												case '我的积分':
													this.toPage(
														`/pages/mine/incomeExpense?pageType=${type}`
													)
													break
											}
										}
										break
								}
							}
						}
					})
				}, 300)
			},
			getIntegral() {
				
				

				let tempPersonage = this.personageList[this.index]
				if (tempPersonage) {
					this.toPage(
						`/pages/mine/integral/integralRule?skillId=${tempPersonage.skillId}&levelName=${tempPersonage.levelName}&integral=${tempPersonage.integral}&personId=${tempPersonage.personId}`
					)
				}
			},
			// 详情
			goBalanceAccount(type) {
				this.getUserAccountState(type)
			},
			// 提现
			goBalanceWithdrawal() {
				this.getUserAccountState('提现')
			},
			// 收支明细和积分明细
			goIncomeExpense(type) {
				// this.getUserAccountState(type)
				// return
				if (type == '我的积分') {
					let tempPersonage = this.personageList[this.index]
					this.toPage(`/pages/mine/integral/pointsDetails?personId=${tempPersonage.personId}`)
				} else {
					this.getUserAccountState(type)
				}
			},
			// 设置
			goToSetting() {
				if (uni.getStorageSync('userInfo')) {
					this.toPage('/pages/setting/setting')
				} else {
					this.gotoPhone()
				}
			},
			userInfOgetPersonMsg() {
				// return
				if (this.personageList[this.index] && this.personageList[this.index].personId) {
					this.$httpApi.userInfOgetPersonMsg({
						personId: this.personageList[this.index].personId
					}).then(res => {
						if (res) {
							this.listIntegral = [res]
						} else {
							this.listIntegral = []
						}
					})
				}
			},
			changeTime(event){
				console.log('event',event);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.personal-page {
		padding-bottom: 80rpx;
	}

	.course {
		background-color: #ffffff;
		height: 220rpx;
		margin: 0 20rpx;
		border-radius: 10rpx;

		padding-left: 42rpx;

		.course_title {
			margin-top: 48rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 32rpx;
			line-height: 44rpx;
			color: #333333;
		}

		.course_text {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #999999;
		}

		.course_look_detail {
			line-height: 56rpx;
			width: 160rpx;
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 26rpx;
			text-align: center;
			margin-top: 16rpx;
			color: #ffffff;
		}

		.course_image {
			float: right;
			width: 310rpx;
			height: 200rpx;
		}
	}

	.mine_release {
		height: 100rpx;
		margin: 10rpx 22rpx;
		padding: 0 28rpx;
		background: #ffffff;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left_label {
			font-size: 30rpx;
			color: #303133;
		}

		.right {
			display: flex;
			align-items: center;

			.label {
				font-size: 24rpx;
				color: #909199;
				margin-right: 6rpx;
			}
		}
	}

	.functaion_moduel {
		margin: 10rpx 20rpx;
		padding: 16rpx 0;
		background: #ffffff;
		border-radius: $middleBorderRadius;

		// height: 436rpx;
		.slot-content {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 26rpx;
			line-height: 42rpx;
			color: #909199;
			margin-right: 10rpx;
		}

		.slot-content-shop {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 28rpx;
			line-height: 42rpx;
			color: #ff5d35;
			margin-right: 10rpx;
		}

		.no-real {
			color: $errorFontColor;
		}


	}

	.moduel-contain {
		margin: 10rpx 20rpx 0rpx 20rpx;
		padding-top: 28rpx;
		background: #ffffff;
		border-radius: $middleBorderRadius;

		.item-title {
			color: #303133;
			font-size: 30rpx;
			padding-left: 40rpx;
			margin-bottom: 32rpx;
		}

		.item-moduel-list {
			display: flex;
			flex-wrap: wrap;

		}

		.item-moduel {
			position: relative;
			width: 25%;
			height: 90rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 40rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-bottom: 14rpx;
			}

			.item-text {
				color: #121836;
				font-size: 26rpx;
			}

			.item-tag {
				position: absolute;
				right: -4rpx;
				top: -20rpx;
				width: 72rpx;
				height: 32rpx;
				border-radius: 40rpx 50rpx 50rpx 0rpx;
				background-color: rgba(255, 230, 223, 1.000);
				display: flex;
				align-items: center;

				text {
					font-size: 24rpx;
					transform: scale(0.85);
					transform-origin: center;
					color: #FF5D35;
					display: inline-block;
				}
			}
		}
	}

	.u_swiper {
		margin: 5rpx 20rpx;
		border-radius: 10rpx;

		.swiper {
			height: 148rpx;

			.swiper_image {
				width: 100%;
				height: 148rpx;
			}
		}
	}

	.find_worker {
		padding-left: 10rpx;
		padding-right: 10rpx;
		margin-bottom: 10rpx;
		height: 114rpx;

		.worker_back {
			float: left;
			margin-left: 10rpx;
			margin-right: 10rpx;
			height: 114rpx;
			width: calc(50% - 20rpx);
			border-radius: 10rpx;
			background: linear-gradient(78.53deg,
					rgba(255, 145, 76, 0.2) 2.73%,
					rgba(255, 255, 255, 0) 57.54%);
			padding: 20rpx;

			.find_worker_text {
				margin-left: 20rpx;
				float: left;

				.find_worker_title {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;

					color: $seconFontColor;
				}

				.find_worker_info {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #909199;
				}
			}

			.find_worker_image {
				float: right;
				height: 62rpx;
				width: 56rpx;
				margin-top: 10rpx;
			}

			.find_person_image {
				float: right;
				height: 70rpx;
				width: 64rpx;
			}
		}
	}

	.account_bank {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 72rpx 28rpx 50rpx;

		.left_label {
			font-size: $middleFontSize;
			color: $errorFontColor;
		}

		.right {
			display: flex;
			align-items: center;

			.label {
				font-size: $smallFontSize;
				color: $fontColor66;
			}
		}
	}

	.integral-moudel {
		height: 100rpx;
		opacity: 1;
		background: linear-gradient(90deg, #1A264D 0%, #2D437A 100%);
		margin: 10rpx 22rpx;
		text-align: center;
		display: flex;
		padding: 0rpx 34rpx 0rpx 40rpx;
		align-items: center;
		border-radius: 16rpx;
		position: relative;

		.u-notice-bar-wrap {
			display: flex;
			flex: 1;
		}

		/deep/ .u-type-warning-light-bg {
			z-index: 1;
			position: relative;
			background-color: transparent;
			padding: 0rpx !important;
		}

		image {
			position: absolute;
			width: 104rpx;
			height: 100rpx;
			left: 68rpx;
			top: 4rpx;
		}

		.item-left {
			color: #DAB082;
			font-size: 24rpx;
			white-space: nowrap;
			width: 466rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			position: relative;
			z-index: 1;
		}

		.item-right {
			opacity: 1;
			background: #DAB082;
			color: #2A3F74;
			font-size: 24rpx;
			width: 140rpx;
			height: 44rpx;
			text-align: center;
			line-height: 44rpx;
			border-radius: 20rpx;
			margin-left: 30rpx;
			white-space: nowrap;
		}
	}

	.icon_right {
		width: 12rpx;
		height: 20rpx;
		margin-left: 10rpx;
	}

	.pice_moudel {
		background: #ffffff;
		height: 254rpx;
		margin: 0rpx 20rpx 10rpx 20rpx;
		background-size: cover;
		padding: 40rpx 52rpx 20rpx 52rpx;
		border-radius: $middleBorderRadius;

		.detial_button {
			float: right;
			margin-top: 28rpx;
			margin-left: 40rpx;
			display: flex;
			align-items: center;
		}

		.bottom_text {
			font-family: PingFang SC;
			font-style: normal;
			font-size: $middleFontSize;
			line-height: 40rpx;
			color: $fontColor66;
			text-align: center;
		}

		.bottom_value {
			font-family: PingFang SC;
			font-weight: bold;
			font-style: normal;
			font-size: $mainFontSize;
			line-height: 44rpx;
			text-align: center;
			color: $seconFontColor;
		}

		.income_points {
			margin-top: 22rpx;
			display: flex;
			// justify-content: space-between;
			align-items: center;

			.bottom_right_module {
				margin-left: 46rpx;
			}
		}

		.withdraw_button {
			float: right;
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			width: 126rpx;
			height: 66rpx;
			line-height: 66rpx;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-size: $middleFontSize;
			color: #ffffff;
			margin-top: 10rpx;
		}

		.detial {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: normal;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #666666;
			float: right;
		}

		.pice_moudel_left {
			float: left;
		}

		.account_balance {
			font-family: PingFang SC;
			font-style: normal;
			font-size: 28rpx;
			line-height: 40rpx;
			color: $fontColor33;
			float: left;

			text {
				font-size: 24rpx;
				color: #909199;
			}
		}

		.eye {
			width: 40rpx;
			height: 40rpx;
		}

		.account_account {
			float: left;
			font-family: PingFang SC;
			font-style: normal;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #9d9cab;
			width: 160rpx;
			height: 44rpx;
			margin: -10rpx 0 0 20rpx;
			text-align: center;
			line-height: 44rpx;
			background: #f3f2fa;
			border-radius: 5rpx 5rpx 5rpx 0;
			position: relative;

			.triangle {
				width: 0;
				height: 0;
				border-width: 12rpx;
				border-style: solid;
				border-color: transparent transparent transparent #f3f2fa;
				position: absolute;
				left: 0;
				top: 32rpx;
			}
		}

		.balance_see {
			display: flex;
			align-items: center;

			.money {
				min-width: 130rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 900;
				font-size: 40rpx;
				line-height: 50rpx;
				color: $errorFontColor;
			}
		}
	}

	.head_bg {
		background: linear-gradient(180deg,
				rgba(7, 59, 188, 0.1) 0%,
				rgba(201, 217, 255, 0.1) 30%);
	}

	.head_bgm {
		background-image: url(../../static/images/mine/mine_bgm.png);
		background-position: 100% 15%;
		background-repeat: no-repeat;
		background-size: 424rpx 438rpx;
	}

	.title_back {
		width: 100vw;
		height: 320rpx;
		// background: linear-gradient(180deg, rgba(7, 59, 188, 0.1) 0%, rgba(201, 217, 255, 0.1) 100%);
		// border-radius: 0rpx 0rpx 30rpx 30rpx;
		padding: 140rpx 40rpx 0 24rpx;
		// margin-bottom: 100rpx;
		display: flex;

		.head_image {
			height: 114rpx;
			width: 114rpx;
			border-radius: 114rpx;
			min-width: 114rpx;
		}

		.head_info {
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			position: relative;
			flex: 1;

			.account_tips {
				font-size: $smallFontSize;
				color: $errorColor;
			}

			.evaluation-signature {
				font-weight: 400;
				font-size: $smallFontSize;
				color: rgba(144, 145, 153, 0.8);
				margin-top: 4rpx;
				width: 540rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.head_name {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 36rpx;
				display: flex;
				align-items: center;
			}

			.name {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 50rpx;
				color: $seconFontColor;
			}

			.select_type {
				display: flex;
				align-items: center;
				flex-direction: row;

				.select_type-contain {}

				.text_type {
					font-family: PingFang SC;
					font-style: normal;
					font-size: $smallFontSize;
					color: rgba(48, 49, 51, 0.7);
					float: right;
					opacity: 0.8;
					margin-left: 20rpx;
				}

				.arrow_down {
					width: 24rpx;
					height: 24rpx;
					margin-left: 8rpx;
				}
			}

			.deposit-tag {
				image {
					width: 28rpx;
					height: 30rpx;
					margin-left: 8rpx;
				}
			}

			.worker_type {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #ffffff;
				opacity: 0.7;
				width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.set_image {
			height: 56rpx;
			width: 56rpx;
			position: absolute;
			right: 0rpx;
		}

		.set_image2 {
			height: 56rpx;
			width: 56rpx;
			position: absolute;
			right: 60rpx;
		}

		.rate {
			display: flex;
			justify-content: space-between;

			.item-rate-contain {}

			.rate_value {
				font-family: PingFang SC;
				font-size: 28rpx;
				line-height: 40rpx;
				color: $themeColor;
			}

			.select_type {
				.text_type {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: $middleFontSize;
					color: $themeColor;
				}

				.arrow_down {
					width: 24rpx;
					height: 24rpx;
					margin-left: 14rpx;
					margin-top: 12rpx;
				}
			}
		}

		.levelName-contain {
			display: flex;
			align-items: center;
			margin-top: 8rpx;

			.item-left {
				background: linear-gradient(180deg, #E3E0FC 0%, #CFCCEA 100%);
				// width: 90rpx;
				height: 32rpx;
				padding: 0rpx 8rpx 0rpx 6rpx;
				line-height: 32rpx;
				display: inline-flex;
				text-align: center;
				border-radius: 4rpx 4rpx 16rpx 4rpx;
				margin-right: 10rpx;

				text {
					color: #4F4976;
				}
			}

			.item-right {
				display: flex;
				align-items: center;

				text {
					color: #606166;
				}

				.icon_right {
					margin-left: 0rpx;
					height: 12rpx;
					width: 6rpx;
				}
			}

			text {
				font-size: 12px;
				display: inline-block;
				transform: scale(0.8);
				position: relative;
				transform-origin: center;
			}
		}
	}

	.align-center {
		display: flex;
		align-items: center;
	}
	
	
	
	/deep/ .u-select__header {
		background-color: #FFFFFF;
	}
	
	/deep/ .uni-scroll-view {
		background-color: #FFFFFF;
	}
</style>
