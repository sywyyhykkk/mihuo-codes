<template>
	<view class="record-details">
		<view class="top-contain">
			<view class="item-top">
				<view class="name">{{details.setmealAmount}}元起{{details.setmealName}}</view>
				<view class="item-details">
					<text class="item-label">被保险人</text>
					<text class="item-value">{{noPassByName(details.userName)}}</text>
				</view>
				<view class="item-details">
					<text class="item-label">保障期限</text>
					<text class="item-value">{{details.insuranceTime}}</text>
				</view>
			</view>
			<view class="item-central-section">
				<view class="item-details">
					<text class="item-label">保单编号</text>
					<text class="item-value">{{details.orderCode}}<text class="item-copy"
							@click="getCopy(details.orderCode)">复制</text>
					</text>
				</view>
				<view class="item-details">
					<text class="item-label">承保公司</text>
					<text class="item-value">中国平安保险有限公司</text>
				</view>
			</view>
			<view class="contact-contain" v-if="option.type == '详情'">
				<view class="item-contact" v-for="(item,index) in contactList" :key="index" @click="getContact(item)">
					<image :src="item.url" mode=""></image>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>

		<view class="details-contain">
			<view class="details-top">
				<text class="item-name">保障内容</text>
				<!-- <text class="show-details">查看更多</text> -->
			</view>
			<view class="details-other" v-if="details">
				<view class="other-details" v-for="(item,index) in details.insuranceInfos" :key="index">
					<text class="item-label">{{item.insuranceName}}</text>
					<text class="item-value">{{item.indemnifyManner}}</text>
				</view>
			</view>
			<view class="item-premium" v-if="option.type == '详情'">
				<view class="other-details">
					<text class="item-label">保费</text>
					<text class="item-value">{{details.setmealAmount}}</text>
				</view>
				<view class="other-details">
					<text class="item-label">缴费方式</text>
					<text class="item-value">{{details.buyPattern}}</text>
				</view>
			</view>
		</view>

		<view class="order-details">
			<view class="item-title">订单信息</view>
			<view class="item-details">
				<view class="item-contain">
					<view class="item-other">
						<text class="item-label">订单编号：</text>
						<text class="item-value">{{details.orderCode}}</text>
					</view>
					<image src="/static/icon/copy.png" class="copy-icon" @click="getCopy(details.orderCode)" mode="">
					</image>
				</view>
				<view class="item-contain">
					<text class="item-label">下单时间：</text>
					<text class="item-value">{{details.createTime}}</text>
				</view>
				<view class="item-contain">
					<text class="item-label">订单金额：</text>
					<text class="item-value">{{details.setmealAmount}}元</text>
				</view>
			</view>
		</view>

		<!-- 退款弹框 -->
		<u-popup v-model="refundShow" border-radius="30" height="600" mode="bottom" :safe-area-inset-bottom="false"
			:closeable="true">
			<view class="refund-desc">
				<view class="title">申请退款</view>
				<view class="input-contain">
					<view class="public-item-bottom">
						<u-input v-model="form.desc" class="describe-input" maxlength="200" height="208" type="textarea"
							placeholder="请填写退款说明" :border="true" />
					</view>
				</view>
				<view class="item-button" @click="getSubmit()">确认提交</view>
			</view>
		</u-popup>

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

		<bottom-button v-if="getButtonShow" :title="setTitle" @click="getRefund()"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				refundShow: false,
				paymentMethodShow: false,
				details: '',
				form: {
					desc: ''
				},
				payMethodName: '',
				contactTel: '',
				payMethod: '',
				defaultCompanyId: '',
				paymentMethodList: [{
					name: '支付宝支付',
					value: 4,
					image: '/static/images/order_details/large_ali.png',
					checkbox: false
				}, {
					name: '微信支付',
					value: 3,
					image: '/static/images/order_details/large_wx.png',
					checkbox: false
				}],
				contactList: [{
						name: '联系客服',
						url: '/static/images/icon_im/ej_2.png'
					},
					{
						name: '申请理赔',
						url: '/static/images/icon-phone/call_7.png'
					},
				]
			}
		},
		computed: {
			setTitle() {
				if (this.details.payStatus == 1) {
					return '申请退款'
				} else {
					return '确认支付'
				}
			},
			/**
			 * 控制底部按钮是否显示
			 * 未支付、待生效显示
			 * */
			getButtonShow() {
				// refundStatus 0=未退款； 1=已申请； 2=已审核待退款； 3=已退款；4=退款失败
				// insuranceStatus 0=未支付；1=已支付；2=待生效；3=生效中；4=已过保；
				const tempResultMap = {
					0: '未支付',
					1: '已支付',
					2: '待生效',
					3: '生效中',
					4: '已过保',
				}
				if ([0, 1, 2].includes(Number(this.details.insuranceStatus))) {
					if ([0, 4].includes(Number(this.details.refundStatus))) {
						return true
					} else {
						return false
					}
				} else {
					return false
				}

			}
		},
		mounted() {

		},
		onShow() {
			this.getInsuranceSetmealOrderDetails()
		},
		onLoad(option) {
			this.option = option
			this.setCurrentCompanyId()
		},
		methods: {
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
			getInsuranceSetmealOrderDetails() {
				this.$httpApi.getInsuranceSetmealOrderDetails({
					orderCode: this.option.orderCode
				}).then(res => {
					if (res) {
						this.details = res
					}
				})
			},
			setCurrentCompanyId() {
				this.$http.get(`admin/cityoperator/${uni.getStorageSync('cityOperatorId')}`).then(res => {
					if (res) {
						this.defaultCompanyId = res.id
						this.contactTel = res.contactTel
					}
				})
			},
			getCopy(data) {
				uni.setClipboardData({
					data,
					success: () => { // 复制成功的回调函数
						this.$util.toast("复制成功");
					}
				});
			},
			getContact(item) {
				if (item.name == '联系客服') {
					this.$util.goToWeixin()
				} else {
					uni.makePhoneCall({
						phoneNumber: this.contactTel
					})
				}
			},
			getRefund() {
				// this.$throttle(()=>{
				// 	console.log('就这。。。');
				// },1000)
				// return
				if (this.setTitle == '确认支付') {
					this.paymentMethodShow = !this.paymentMethodShow
				} else {
					this.refundShow = !this.refundShow
				}
			},
			getSubmit() {
				this.$httpApi.applyRefundOrder({
					orderCode: this.details.orderCode,
					remarks: this.form.desc
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.refundShow = !this.refundShow
						this.getInsuranceSetmealOrderDetails()
					}
				})
			},
			getCheckbox(item) {
				this.paymentMethodList.forEach(el => {
					if (el.value !== item.name) {
						el.checkbox = false
					} else {
						this.payMethodName = el.name
						this.payMethod = el.value
					}
				})
			},
			getConfirm() {
				if (!this.payMethod) {
					this.$util.toast("请选择支付方式~");
					return
				}
				this.paymentMethodShow = !this.paymentMethodShow
				if (this.payMethod == 3) {
					this.$util.requestPay(this.payMethod, {
						orderId: {
							orderIds: [this.details.id]
						}
					}, 'insurance')
				} else {
					this.$httpApi.insurancePay({
						payAmount: this.details.setmealAmount,
						payMethod: this.payMethod,
						id: this.details.id
					}).then(res => {
						if (res) {
							this.$util.requestPay(this.payMethod, res.payInfo, '')
						}
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	/deep/ .u-drawer__scroll-view {
		background: #fff;
	}

	.record-details {
		padding: 10rpx 20rpx;

		.top-contain {
			padding: 40rpx;
			background-color: #fff;
			border-radius: 10rpx;

			.item-top {
				.name {
					color: #303133;
					font-size: 28rpx;
					margin-bottom: 14rpx;
				}

				.item-details {
					margin-bottom: 24rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-label {
						font-size: 26rpx;
						color: #606166;
						margin-right: 20rpx;
					}

					.item-value {
						font-size: 26rpx;
						color: #303133;
					}
				}
			}

			.item-central-section {
				border-top: 2rpx solid #EEEEEE;
				padding-top: 28rpx;
				margin-top: 32rpx;

				.item-details {
					margin-bottom: 16rpx;
					display: flex;
					justify-content: space-between;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-label {
						font-size: 26rpx;
						color: #303133;
					}

					.item-value {
						font-size: 26rpx;
						color: #909199;

						.item-copy {
							margin-left: 8rpx;
							color: #002FA5;
							font-size: 24rpx;
						}
					}
				}
			}

			.contact-contain {
				display: flex;
				justify-content: space-around;
				margin-top: 52rpx;

				.item-contact {
					display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 48rpx;
						height: 48rpx;
						margin-bottom: 6rpx;
					}

					text {
						font-size: 26rpx;
						color: #303133;
					}
				}
			}


		}

		.details-contain {
			padding-bottom: 28rpx;
			background-color: #fff;
			margin-top: 8rpx;
			border-radius: 10rpx;
			padding: 40rpx;

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

			.item-premium {
				padding-top: 32rpx;

				.other-details {
					display: flex;
					justify-content: space-between;
					margin-bottom: 26rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}

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

		.order-details {
			border-radius: 16rpx;
			background-color: #fff;
			margin-top: 6rpx;

			.item-title {
				padding: 28rpx 0rpx;
				margin: 0 34rpx;
				border-bottom: 2rpx solid #F6F6F6;
			}

			.item-details {
				padding: 32rpx 0rpx 44rpx 50rpx;

				.item-contain {
					margin-bottom: 28rpx;
					display: flex;
					align-items: center;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-label {
						color: #909199;
						font-size: 28rpx;
						margin-right: 8rpx;
					}

					.item-value {
						color: #909199;
						font-size: 28rpx;

					}

					.copy-icon {
						width: 44rpx;
						height: 44rpx;
						margin-left: 88rpx;
					}
				}
			}
		}
	}

	.refund-desc {
		.title {
			margin: 0 20rpx;
			padding: 36rpx 0rpx;
			text-align: center;
			color: #303133;
			font-size: 30rpx;
			border-bottom: 2rpx solid #F6F6F6;
		}

		.input-contain {
			padding: 38rpx 60rpx 74rpx 60rpx;

			.public-item-bottom {
				background: #F6F7F9;
				border-radius: 10rpx;
				padding: 8rpx 0rpx;

				.u-input {
					border: 0rpx;
				}
			}
		}

		.item-button {
			width: 624rpx;
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			border: 2rpx solid #002FA5;
			border-radius: 10rpx;
			color: #002FA5;
			margin: 0 auto;
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
</style>
