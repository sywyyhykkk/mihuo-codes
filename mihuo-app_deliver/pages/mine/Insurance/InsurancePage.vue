<template>
	<view class="insurance-page" id="insurance-page-id">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#467CFD" fontColor="#fff">
			<view slot="default" class="nav-bar-title">
			</view>
			<view slot="right" class="nav-bar-right" @click="cutView()">
				投保记录
			</view>
		</z-nav-bar>


		<view class="top-contian">
			<view class="placeholder"></view>
			<view class="item-top">
				<text class="text-big">务工保工人意外险</text>
				<text class="text-min">被保险人:18-60周岁身体健康的人员</text>
			</view>
			<image class="item-insurance-images" src="@/static/images/insurance.png" mode=""></image>
		</view>
		<view class="why-contain">
			<view class="user-contian" v-if="userOrderDetails.surplusDays">
				<view class="left">
					<u-avatar class="icon-image" :src="$util.avatarImage(userOrderDetails.userId)" size="68">
					</u-avatar>
					<view class="item-user">
						<text class="item-name">{{userOrderDetails.userName}}</text>
						<text class="item-time">{{userOrderDetails.insuranceTime}}</text>
					</view>
				</view>
				<view class="right">
					<view class="item-order">
						<text class="item-status">{{getStatusName(userOrderDetails.insuranceStatus)}}</text>
						<text class="item-time"> 剩余{{userOrderDetails.surplusDays}}天</text>
					</view>
				</view>
			</view>
			<view class="why-title">为什么要买务工保？</view>
			<view class="why-list">
				<view class="item-contian">
					<view class="item-images">
						<image src="@/static/images/icon_success/icon_success_1.png" mode=""></image>
					</view>
					<text class="item-value">为500种以上职业提供“务工”意外险；</text>
				</view>
				<view class="item-contian">
					<view class="item-images">
						<image src="@/static/images/icon_success/icon_success_1.png" mode=""></image>
					</view>
					<text class="item-value">4种方案任你选，最高保额60万元；</text>
				</view>
				<view class="item-contian">
					<view class="item-images">
						<image src="@/static/images/icon_success/icon_success_1.png" mode=""></image>
					</view>
					<text class="item-value">意外身故、残疾、医疗均包含，干活更放心；</text>
				</view>
			</view>
		</view>

		<!-- 套餐选择 -->
		<view class="list-contain">

			<scroll-view :scroll-x="true" class="scroll-x">
				<view class="type-list">
					<view v-for="(item,index) in typeList" :key="index"
						:class="[current == index ? 'item-type-active':'item-type']" @click="getType(index)">
						<text class="item-name">{{item.setmealAmount}}元起</text>
						<text class="item-desc">{{item.setmealName}}</text>
					</view>
				</view>
			</scroll-view>

			<view class="item-details">
				<view class="details-contain">
					<view class="details-top">
						<text class="item-name">保障内容</text>
						<!-- <text class="show-details">查看详情</text> -->
					</view>
					<view class="details-other">
						<view class="other-details" v-for="(item,index) in setTypeDetails" :key="index">
							<text class="item-label">{{item.insuranceName}}</text>
							<text class="item-value">{{item.indemnifyManner}}</text>
						</view>
					</view>
				</view>
				<view class="details-bottom">
					<text class="item-text">请阅读</text>
					<text v-once class="item-text-book" v-for="(item,index) in pdfList" :key="index"
						@click="getBook(item)">
						《{{item.name}}》
					</text>
				</view>
			</view>
		</view>

		<!-- 投保type -->
		<view class="explain-contian">
			<view class="explain-type">
				<view class="item-explain-default" :class="[explainIndex == index ? 'item-explain-active':'']"
					v-for="(item,index) in explainType" :key="index" @click="getExplain(index,item)">
					<text>{{item.name}}</text>
					<view class="item-tag"></view>
				</view>
			</view>

			<!-- 投保信息 -->
			<view class="insurance-information" id="insurance-information-id">
				<view class="item-information">
					<text class="item-title">投保信息</text>
					<view class="item-form">
						<view class="item-contain">
							<text class="item-label">被保人姓名</text>
							<text class="item-value">{{userInfo.name}}</text>
						</view>
						<view class="item-contain">
							<text class="item-label">身份证号码</text>
							<text class="item-value">{{userInfo.idcard}}</text>
						</view>
					</view>
				</view>
				<view class="item-information">
					<text class="item-title">购买天数</text>
					<view class="item-form">
						<view class="item-contain">
							<text class="item-label">保障开始时间</text>
							<text class="item-value" @click="getTime()">{{form.insuranceEffectTime}}
								<u-icon class="arrow-right" name="arrow-right" color="#909199" size="24"></u-icon>
							</text>
						</view>
						<view class="item-contain">
							<text class="item-label">保障期限</text>
							<view class="item-calculation">
								<image src="@/static/images/jian.png" mode="" @click="calculation('jian')"></image>
								<text class="item-num">{{form.insuranceDuration}}个月</text>
								<image src="@/static/images/jia.png" mode="" @click="calculation('jia')"></image>
							</view>
						</view>
					</view>
					<view class="item-form-details" v-if="userOrderDetails.surplusDays">
						<view class="item-top">
							{{userOrderDetails.setmealName}}
						</view>
						<view class="item-contain">
							<text class="item-label">{{userOrderDetails.insuranceTime}}</text>
							<text class="item-value"> 剩余{{userOrderDetails.surplusDays}}天</text>
						</view>
					</view>

				</view>
			</view>

			<!-- 产品特色 -->
			<view class="characteristic" id="characteristic-id">
				<!-- <view class="item-title">产品特色</view> -->
				<!-- <image src="@/static/images/bao_x.png" mode=""></image> -->
				<image src="@/static/images/bao_x.png" mode=""></image>
			</view>

			<!-- 理赔说明 -->
			<view class="settlement" id="settlement-id">
				<view class="top">
					<text class="item-left">理赔说明</text>
					<!-- <text class="item-right">查看理赔资料</text> -->
				</view>
				<view class="item-details">
					<text class="item-name">1.提交申请</text>
					<text class="item-desc">拨打平安24小时服务热线95511或全省统一报案电话 0871-63142569进行理赔；</text>
				</view>
				<view class="item-details">
					<text class="item-name">2.理赔审核</text>
					<text class="item-desc">资料准备齐全后，服务专员上门收取；</text>
				</view>
				<view class="item-details">
					<text class="item-name">3.结论通知</text>
					<text class="item-desc">经审核结案后理赔部门通知财务直接将理赔款划入受益人账户，同时短信或邮件通知客户理赔结果；</text>
				</view>
				<view class="item-details">
					<text class="item-name">4.赔付打款</text>
					<text class="item-desc">案件审核通过后，会按照赔付规则确定理赔金额，并向提交申请时确定得收款账户，完成打款赔付；</text>
				</view>
			</view>
		</view>

		<view class="bottom-contain" v-if="typeList.length > 0 ">
			<view class="bottom-contain-all">
				<view class="left">
					<view class="item-user" @click="getIm()">
						<image src="/static/images/icon_user/icon_user_2.png" mode=""></image>
						<text>客服</text>
					</view>
					<view class="item-price">
						<text class="item-num">{{setPrice}}</text>
						<text class="item-unit">元</text>
					</view>
				</view>
				<view class="right" @click="getSubmit()">
					立即投保
				</view>
			</view>

		</view>

		<!-- 保障时间选择 -->
		<u-picker v-model="timeShow" mode="time" :params="params" @confirm="confirmTime" :is-allow-passed-time="false"
			:isLater="true" :isStartTime="setStartTime" :start-year="(new Date().getFullYear())">
		</u-picker>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		data() {
			return {
				option: {},
				current: 0,
				explainIndex: 0,
				timeShow: false,
				defaultCompanyId: '',
				userInfo: {
					name: '',
					idcard: ''
				},
				userOrderDetails: {},
				params: {
					year: true,
					month: true,
					day: true,
				},
				form: {
					insuranceDuration: 1,
					insuranceEffectTime: '请选择',
					setmealId: '',
				},
				setmealAmount: '',
				explainType: [{
					name: '我要投保',
					elementId: 'insurance-information-id',
					top: '',
				}, {
					name: '产品特色',
					elementId: 'characteristic-id',
					top: '',
				}, {
					name: '理赔说明',
					elementId: 'settlement-id',
					top: '',
				}],
				typeList: [],
				typeDetails: {},
				pdfList: [{
					name: '平安附加意外伤害团体医疗保险条款',
					url: 'https://www.51mihuo.com/平安附加意外伤害团体医疗保险条款.pdf'
				}, {
					name: '平安附加意外伤害住院现金补贴团体医疗保险条款',
					url: 'https://www.51mihuo.com/平安附加意外伤害住院现金补贴团体医疗保险条款.pdf'
				}, {
					name: '平安团体意外伤害保险(2013版)条款',
					url: 'https://www.51mihuo.com/平安团体意外伤害保险(2013版)条款.pdf'
				}]
			}
		},
		computed: {
			setTypeDetails() {
				return this.typeList[this.current] && this.typeList[this.current].insuranceInfos || []
			},
			setPrice() {
				return operation.floatMul(this.form.insuranceDuration, this.setmealAmount)
			},
			setStartTime() {
				if (this.userOrderDetails.insuranceStatus == 3) { // 保险生效中
					let tempTimeList = this.userOrderDetails.insuranceTime.split('-')
					return tempTimeList[tempTimeList.length - 1]
				} else {
					return ''
				}

				// 保险生效截止日期下一天
			}
		},
		mounted() {

		},
		onShow() {
			this.getInsuranceSetmealList()
			this.getUserOrderDetails()
		},
		onLoad(option) {
			this.option = option
			this.setCurrentCompanyId()
			this.setUserInfo()
		},
		onPageScroll(event) {
			// console.log('event', event);
		},
		methods: {
			setUserInfo() {
				this.$httpApi.getPersonInfo({}).then(res => {
					if (res) {
						let tempIdCard = res.sysUser
						if (tempIdCard) {
							this.userInfo.idcard = tempIdCard.idcard && tempIdCard.idcard.replace(
								/^(.{4})(?:\d+)(.{4})$/,
								"$1******$2")
							this.userInfo.name = this.noPassByName(tempIdCard.realName)
						}
					}
				})
			},
			noPassByName(str) {
				if (null != str && str != undefined) {
					if (str.length == 2) {
						return str.substring(0, 1) + '*' //截取name 字符串截取第一个字符，
					} else if (str.length == 3) {
						return str.substring(0, 1) + "*" + str.substring(2, 3) //截取第一个和第三个字符
					} else if (str.length > 3) {
						return str.substring(0, 1) + "*" + '*' + str.substring(3, str.length) //截取第一个和大于第4个字符
					}
				} else {
					return "";
				}
			},
			getInsuranceSetmealList() {
				this.$httpApi.getInsuranceSetmealList().then(res => {
					if (res) {
						this.typeList = res
						if (this.typeList.length > 0) {
							this.form.setmealId = this.typeList[this.current].id
							this.setmealAmount = this.typeList[this.current].setmealAmount
						} else {
							this.$util.toast("保险套餐维护中~");
						}
					}
				})
			},
			getUserOrderDetails() {
				this.$httpApi.getUserOrderDetails().then(res => {
					if (res) {
						this.userOrderDetails = res
						this.userOrderDetails['userId'] = uni.getStorageSync('userData').sysUser.userId
					}
				})
			},
			setCurrentCompanyId() {
				this.$http.get(`admin/cityoperator/${uni.getStorageSync('cityOperatorId')}`).then(res => {
					if (res) {
						this.defaultCompanyId = res.id
					}
				})
			},
			getDemo() {
				this.$nextTick(() => {
					this.explainType.forEach(el => {
						uni.createSelectorQuery().select(`#${el.elementId}`).boundingClientRect(
							res => {
								el.top = res.top
								// console.log('res',res);
							}).exec()
					})
				})
			},
			getType(index) {
				this.current = index
				this.form.setmealId = this.typeList[this.current].id
				this.setmealAmount = this.typeList[this.current].setmealAmount
			},
			getExplain(index, item) {
				this.explainIndex = index
				// uni.pageScrollTo({
				// 	scrollTop: item.top,
				// 	duration: 200
				// })
				// return
				uni.createSelectorQuery().select('#insurance-page-id').boundingClientRect(data => {
					uni.createSelectorQuery().select(`#${item.elementId}`).boundingClientRect(res => {
						uni.pageScrollTo({
							scrollTop: res.top - data.top - 50,
							duration: 200
						})
					}).exec()
				}).exec()
			},
			cutView() {
				this.toPage('/pages/mine/Insurance/insuranceRecord')
			},
			getBook(item) {
				// let tempPdf = this.pdfList.find(item =>item.name == name)
				// if(!tempPdf){
				// 	return
				// }
				uni.showLoading({
					title: '加载中'
				});
				uni.downloadFile({
					url: item.url,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success: function(res) {
								// console.log('打开文档成功');
								uni.hideLoading();
							}
						});
					}
				});
			},
			calculation(item) {
				if (item == 'jia') {
					this.form.insuranceDuration++
				} else {
					if (this.form.insuranceDuration > 1) {
						this.form.insuranceDuration--
					}
				}
			},
			getTime() {
				this.timeShow = !this.timeShow
			},
			confirmTime(value) {
				this.form.insuranceEffectTime = `${value.year}-${value.month}-${value.day}`
			},
			getIm() {
				this.$util.goToWeixin()
			},
			getStatusName(item) {
				const tempResultMap = {
					2: '待生效',
					3: '生效中',
					4: '已过保',
				}
				return tempResultMap[item] ?? ''
			},
			getSubmit() {
				if (this.form.insuranceEffectTime == '请选择') {
					this.$util.toast("请选择保障开始时间");
					return
				}
				if (this.form.insuranceEffectTime == '') {
					this.$util.toast("请选择保障开始时间");
					return
				}


				if (!this.userInfo.idcard) {
					this.$util.toast("请完成实名认证");
					return
				}

				this.$httpApi.saveInsuranceSetmealOrder(this.form).then(res => {
					if (res) {
						let temp = res[0]
						if (!temp.id) {
							return
						}
						this.toPage(
							`/pages/mine/Insurance/recordDetails?id=${temp.id}&type=开单&orderCode=${temp.orderCode}`
						)
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.arrow-right {
		margin-left: 6rpx;
	}

	.insurance-page {
		padding-bottom: 220rpx;

		.nav-bar-right {
			color: #fff;
			font-size: 28rpx;
			padding-right: 40rpx;

		}

		.top-contian {

			.placeholder {
				height: 54rpx;
				background-color: #467CFD;
			}

			.item-top {
				display: flex;
				flex-direction: column;
				justify-content: center;
				background-color: #467CFD;
				padding-bottom: 24rpx;
				font-weight: 500;

				.text-big {
					color: #fff;
					font-size: 60rpx;
					text-align: center;
					font-weight: bold;
					margin-bottom: 12rpx;
				}

				.text-min {
					color: #fff;
					font-size: 28rpx;
					text-align: center;
				}
			}

			image {
				width: 750rpx;
				height: 246rpx;
			}
		}

		.why-contain {
			border-radius: 30rpx 30rpx 10rpx 10rpx;
			background: #FFFFFF;
			padding: 40rpx 20rpx 34rpx 20rpx;
			margin-bottom: 8rpx;
			margin-top: -20rpx;
			position: relative;

			.user-contian {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 28rpx;

				.left {
					display: flex;

					.item-user {
						display: flex;
						flex-direction: column;
						margin-left: 8rpx;

						.item-name {
							color: #3D3D3D;
							font-size: 30rpx;
							line-height: 36rpx;
						}

						.item-time {
							color: #909199;
							font-size: 13px;
							line-height: 36rpx;
						}
					}
				}

				.right {
					display: flex;
					flex-direction: column;

					.item-order {
						display: flex;
						flex-direction: column;
						margin-left: 8rpx;

						.item-status {
							color: #002FA5;
							font-size: 30rpx;
							line-height: 36rpx;
						}

						.item-time {
							color: #909199;
							font-size: 13px;
							line-height: 36rpx;
						}
					}
				}

			}


			.why-title {
				font-size: $fontSize30;
				color: $seconFontColor;
				padding-left: 28rpx;
				margin-bottom: 24rpx;
			}

			.why-list {
				padding: 36rpx 20rpx 0 20rpx;
				border-top: 2rpx dashed #EEEEEE;

				.item-contian {
					margin-bottom: 24rpx;
					display: flex;
					align-items: center;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-images {
						width: 28rpx;
						height: 28rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 13rpx;
						background-color: rgba(0, 47, 165, 0.2);

						image {
							width: 14rpx;
							height: 10rpx;
						}

					}

					.item-value {
						color: #303133;
						font-size: 28rpx;
					}
				}

			}
		}


		.list-contain {
			border-radius: 10rpx;
			background-color: #fff;

			.scroll-x {
				white-space: nowrap;
				width: 100%;
			}

			.type-list {
				padding: 56rpx 38rpx 34rpx 38rpx;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #F6F6F6;


				.item-type {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding-right: 20rpx;

					&:last-child {
						// margin-right: 0rpx;
					}

					.item-name {
						font-size: 30rpx;
						color: #303133;
						line-height: 42rpx;
						margin-bottom: 2rpx;
					}

					.item-desc {
						color: #909199;
						font-size: 26rpx;
						line-height: 36rpx;
					}
				}

				.item-type-active {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding-right: 20rpx;

					&:last-child {
						// margin-right: 0rpx;
					}

					.item-name {
						font-size: 30rpx;
						color: #002FA5;
						line-height: 42rpx;
						margin-bottom: 2rpx;
					}

					.item-desc {
						color: #002FA5;
						font-size: 26rpx;
						line-height: 36rpx;
					}
				}
			}

			.item-details {
				padding: 28rpx 40rpx 30rpx 40rpx;

				.details-contain {
					padding-bottom: 28rpx;


					.details-top {
						margin-bottom: 26rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.item-name {
							color: #303133;
							font-size: 30rpx;
						}

						.show-details {
							font-size: 24rpx;
							color: #002FA5;
						}

					}

					.details-other {
						padding-left: 18rpx;
						border-bottom: 2rpx solid #F6F6F6;

						.other-details {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-bottom: 26rpx;

							.item-label {
								color: #303133;
								font-size: 28rpx;
							}

							.item-value {
								color: #303133;
								font-size: 28rpx;
							}
						}
					}
				}

				.details-bottom {
					padding-left: 20rpx;

					.item-text {
						color: #303133;
						font-size: 24rpx;
					}

					.item-text-book {
						color: #002FA5;
						font-size: 24rpx;
					}
				}

			}
		}


		.explain-contian {
			margin-top: 32rpx;

			.explain-type {
				padding: 0rpx 52rpx 20rpx 52rpx;
				display: flex;
				justify-content: space-between;

				.item-explain-default {
					display: flex;
					flex-direction: column;
					margin-bottom: 8rpx;
					justify-content: center;
					align-items: center;

					text {
						color: #303133;
						font-size: 30rpx;
					}

					.item-tag {
						width: 50rpx;
						height: 6rpx;
						border-radius: 110rpx;
						margin-top: 8rpx;
						background: transparent;
					}

				}

				.item-explain-active {

					text {
						color: #002FA5;
						font-size: 30rpx;
					}

					.item-tag {
						width: 50rpx;
						height: 6rpx;
						border-radius: 110rpx;
						margin-top: 8rpx;
						background: linear-gradient(90deg, #002FA5 5%, rgba(255, 255, 255, 0.00) 91%);
					}
				}

			}

			.insurance-information {
				background-color: #fff;
				padding: 36rpx 40rpx 40rpx 36rpx;
				border-radius: 16rpx;
				margin-bottom: 20rpx;

				.item-information {
					.item-title {
						font-size: 30rpx;
						color: #303133;
					}

					.item-form {
						padding: 34rpx 0rpx 34rpx 0rpx;

						.item-contain {
							display: flex;
							justify-content: space-between;
							padding-bottom: 30rpx;
							border-bottom: 2rpx solid #F6F6F6;
							margin-bottom: 26rpx;

							&:last-child {
								margin-bottom: 0rpx;
							}

							.item-label {
								color: #606166;
								font-size: 28rpx;
							}

							.item-value {
								color: #909199;
								font-size: 26rpx;
							}

							.item-calculation {
								display: flex;
								align-items: center;

								text {
									color: #303133;
									font-size: 26rpx;
									margin: 0 14rpx;
								}

								image {
									width: 40rpx;
									height: 40rpx;
								}
							}
						}
					}

					.item-form-details {
						.item-top {
							color: #303133;
							font-size: 30rpx;
							// padding-left: 36rpx;
							margin-bottom: 32rpx;
						}

						.item-contain {
							display: flex;
							justify-content: space-between;

							.item-label {
								font-size: 28rpx;
								color: #303133;
							}

							.item-value {
								font-size: 26rpx;
								color: #606166;
							}
						}
					}
				}
			}

			.characteristic {
				// padding: 20rpx;
				border-radius: 16rpx;
				// background-color: #fff;
				margin-bottom: 20rpx;
				// padding: 0 20rpx;

				.item-title {
					color: #303133;
					font-size: 30rpx;
				}

				image {
					width: 750rpx;
					height: 1800rpx;
				}

			}

			.settlement {
				padding: 40rpx;
				border-radius: 10rpx;
				background-color: #fff;

				.top {
					display: flex;
					justify-content: space-between;
					margin-bottom: 24rpx;

					.item-left {
						font-size: 30rpx;
						color: #303133;
					}

					.item-right {
						font-size: 26rpx;
						color: #002FA5;
					}
				}

				.item-details {
					padding-left: 14rpx;
					display: flex;
					flex-direction: column;
					margin-bottom: 30rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-name {
						letter-spacing: 2rpx;
						font-size: 28rpx;
						color: #303133;
						margin-bottom: 6rpx;
					}

					.item-desc {
						font-size: 26rpx;
						color: #606166;
						letter-spacing: 2rpx;
					}

				}
			}
		}

		.bottom-contain {
			width: 100%;
			position: fixed;
			bottom: 0rpx;
			background-color: #FFF;
			z-index: 10;
			box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			// display: flex;
			// height: 140rpx;
			padding-right: 20rpx;

			.bottom-contain-all {
				padding: 30rpx 0rpx;
				display: flex;
				align-items: center;
			}

			.left {
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;

				.item-user {
					margin-right: 60rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 40rpx;
						height: 40rpx;
					}

					text {
						color: #606166;
						font-size: 28rpx;
					}
				}

				.item-price {
					.item-num {
						color: #FF5D35;
						font-size: 40rpx;
					}

					.item-unit {
						color: #FF5D35;
						font-size: 28rpx;
					}
				}

			}

			.right {
				width: 360rpx;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				border-radius: 10rpx;
				background: #002FA5;
				color: #fff;
				font-size: 28rpx;
			}
		}
	}
</style>
