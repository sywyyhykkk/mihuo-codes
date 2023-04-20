<template>
	<view>
		<sku-popup @input="closeSku" v-model="showPay" title="" align="left" height="75%"
			:styleObj="{background:'#fff'}" @clearCur="clearCur">
			<view class="content-sku">
				<view class="head_price">
					<view class="title">待支付</view>
					<view class="price"><text>￥</text>{{ setMoney() }}</view>
				</view>
				<!-- 暂时影藏 -->
			<!-- 	<view class="payment-schedule" v-if="[1,2].includes(isPayPlan)">
					<view class="item-top">
						<view class="item-title">
							<view class="icon-package-bg">
								<image src="/static/images/package.png" class="icon-package" mode=""></image>
							</view>
							<text>付款计划</text>
						</view>
						<view class="item-desc" v-if="isPayPlan == 2">
							<text class="item-left">按比例付款</text>
							<text class="item-right">按{{setContain()}}比例进行付款</text>
						</view>
					</view>
					<view class="payment-schedule-list" v-if="isPayPlan == 2">
						<view class="item-payment" v-for="(item,index) in paymentList" :key="index"
							@click="getPayment(item,index,'比例')">
							<view class="item-left">
								<text class="item-name"
									v-if="item.amount">{{item.templateItemName}}{{item.ratio * 100 }}%</text>
								<view class="payment-status-default"
									:class="{'payment-status-contain-active':item.payStatus == 2 }">
									<text class="item-payment-status">{{item.payStatus == 2? '已支付':'待支付'}}</text>
								</view>
							</view>
							<view class="item-right">
								<text class="item-price">{{item.amount}}元</text>
								<view class="radio2" v-if="item.payStatus !== 2"
									:class="[item.selectActive ? 'radioSelect2':'']"></view>
							</view>
						</view>
					</view>
					<view class="payment-schedule-list" v-if="isPayPlan == 1">
						<view class="item-payment" v-for="(item,index) in paymentGroupPrices" :key="index"
							@click="getPayment(item,index,'工种')">
							<view class="item-left">
								<text class="item-name">{{item.skillName}}</text>
								<view class="payment-status-default"
									:class="{'payment-status-contain-active':item.payStatus == 2 }">
									<text class="item-payment-status">{{item.payStatus == 2? '已支付':'待支付'}}</text>
								</view>
							</view>
							<view class="item-right">
								<text class="item-price">{{item.totalPrice}}元</text>
								<view class="radio2" v-if="item.payStatus !== 2"
									:class="[item.selectActive ? 'radioSelect2':'']"></view>
							</view>
						</view>
					</view>
				</view> -->
				<view class="ordinary-pay">
					<view class="type_title">支付方式</view>
					<view class="content-main">
						<view class="content-main_res pay_item" @click="changePayRadio(item,index)"
							v-for="(item,index) in payTypeList" :key="index">
							<view class="reason2">
								<view class="pay">
									<image class="pay_icon" :src="item.icon" />
									<view class="name">{{item.name}}</view>
								</view>
								<view>{{item.tips}}</view>
							</view>
							<view class="radio2" :class="{radioSelect2:curIndex === index}"></view>
						</view>
					</view>
				</view>

				<bottom-button title="确认支付" color="#fff" :styleObj="{background:'#424242'}" @click="confirm" />
			</view>
		</sku-popup>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		props: {
			// 支付金额
			money: {
				type: [Number, String],
				default: 0,
			},
			// 支付弹窗调用
			value: {
				type: Boolean,
				default: false
			},
			// 付款计划
			paymentList: {
				type: Array,
				default () {
					return []
				}
			},
			// 组合价格
			paymentGroupPrices: {
				type: Array,
				default () {
					return []
				}
			},
			// 分期支付2、按工种付款1 
			isPayPlan: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				showPay: false,
				curIndex: 0,
				payTypeList: [{
						value: 4,
						name: '支付宝支付',
						// tips: '使用支付宝支付',
						tips: '',
						icon: '/static/images/order_details/small_ali.png'
					}, {
						value: 3,
						name: '微信小程序支付',
						// tips: '使用微信小程序支付',
						tips: '',
						icon: '/static/images/order_details/small_wx.png'
					},
					// {
					// 	name: '银联支付',
					// 	tips: '使用银联宝支付',
					// 	icon: '/static/images/order_details/small_union.png'
					// },
				],
				// this.payType = this.payTypeList[this.curIndex].value,
				currentMoney: '',
				formData: {
					payType: 4,
					payPlanItemIds: [], //工种Id或比例模板子项Id
					payPlanTemplateId: '' // 比例模板Id
				}
			}
		},
		mounted() {
		},
		computed: {

		},
		watch: {
			value(newVal) {
				this.showPay = newVal
			},
		},
		methods: {
			setMoney() {
				if (this.currentMoney) {
					return this.currentMoney
				} else {
					return Math.abs(this.money)
				}
			},
			closeSku() {
				this.showPay = false;
				this.$emit("input", false)
			},
			clearCur() {
				this.curIndex = 0
			},
			// 确认支付
			confirm() {
				this.formData.mode = this.money > 0 ? '支付' : '退款';
				this.$emit('callback', this.formData)
			},
			changePayRadio(data, index) {
				this.formData.payType = data.value;
				this.curIndex = index
			},
			// 成功回调
			successCallback() {
				this.showPay = false;
				this.$emit('refresh');
			},
			setContain(){
				let tempContain = ''
				let tempList = JSON.parse(JSON.stringify(this.paymentList))
				tempList.forEach((ev, index) => {
					ev.ratio = Math.round(ev.ratio * 10)
					tempContain += ev.ratio + (index + 1 < this.paymentList.length ?
						':' : '')
				})
				return tempContain
			},
			getPayment(item, index, type) {
				if (item.payStatus !== 2) {
					item.selectActive = !item.selectActive
				}
				if (type == '工种') {
					this.formData.payPlanItemIds = []
					let tempPric = []
					this.paymentGroupPrices.forEach(el => {
						if (el.selectActive) {
							tempPric.push(el.totalPrice)
							this.formData.payPlanItemIds.push(el.skillId)
						}
					})
					this.currentMoney = operation.funCalc(tempPric)
				} else {
					this.formData.payPlanItemIds = []
					this.formData.payPlanTemplateId = item.templateId
					let tempPric = []
					this.paymentList.forEach(el => {
						if (el.selectActive) {
							tempPric.push(el.amount)
							this.formData.payPlanItemIds.push(el.id)
						}
					})
					this.currentMoney = operation.funCalc(tempPric)
				}
				this.setContain()
				this.$forceUpdate()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-sku {
		.content-main {
			overflow: hidden;

			.content-main_res {
				display: flex;
				align-items: center;
				margin-top: 40rpx;
				border-bottom: 1rpx solid #f8f8f8;

				.radio2 {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					border: 4rpx solid #BDBDBD;
					margin-right: 30rpx;
				}

				.radioSelect2 {
					border: 4rpx solid #002FA5;
					position: relative;

					&::before {
						content: '✔';
						position: absolute;
						color: #002FA5;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.reason2 {
					flex: 1;

					&>view {
						color: #141414;
						font-size: 26rpx;

						&:last-child {
							color: #808080;
							font-size: 24rpx;
							padding-top: 10rpx;
						}
					}

					.pay {
						display: flex;
						align-items: center;

						.name {
							color: #141414;
							font-size: 28rpx;
						}

						.pay_icon {
							width: 40rpx;
							height: 40rpx;
							margin-right: 27rpx;
						}
					}

				}
			}
		}

		.pay_item {
			display: flex;
			align-items: center;
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 28rpx 0 28rpx 0rpx;
			margin-top: 15rpx !important;
		}

		.type_title {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #808080;
		}

		.head_price {
			text-align: center;

			.title {
				font-size: 24rpx;
				font-weight: 500;
				color: #808080;
			}

			.price {
				font-size: 77rpx;
				font-weight: bold;
				color: #141414;
				margin: 42rpx 0 72rpx;

				text {
					font-size: 33rpx;
					font-weight: bold;
				}
			}
		}

		.icon-package {
			width: 24rpx;
			height: 24rpx;
		}

		.payment-schedule {
			margin-bottom: 40rpx;

			.item-title {
				display: flex;
				margin-bottom: 20rpx;

				.icon-package-bg {
					width: 40rpx;
					height: 40rpx;
					border-radius: 10rpx;
					background: rgba(0, 47, 165, 0.1);
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 10rpx;
				}

				text {
					font-size: 28rpx;
					color: #303133;
				}
			}

			.item-desc {

				.item-left {
					font-size: 26rpx;
					margin-right: 10rpx;
					color: #909199;
				}

				.item-right {
					font-size: 24rpx;
				}
			}

			.item-top {
				margin-bottom: 30rpx;
			}

			.payment-schedule-list {

				.item-payment {
					display: flex;
					justify-content: space-between;
					margin-bottom: 34rpx;

					.item-left {
						display: flex;
						align-items: center;

						.item-name {
							color: #303133;
							font-size: 26rpx;
							margin-right: 10rpx;
						}

						.payment-status-default {
							width: 76rpx;
							height: 34rpx;
							background: rgba(144, 145, 153, 0.1);
							border-radius: 0px 8px;
							margin-left: 8rpx;

							.item-payment-status {
								display: inline-block;
								color: #909199;
								font-size: 24rpx;
								transform: scale(0.85);
							}
						}

						.payment-status-contain-active {
							background: rgba(255, 93, 53, 0.1);

							.item-payment-status {
								color: #FF5D35;
							}
						}

					}

					.item-right {
						display: flex;
						align-items: center;

						.item-price {
							font-size: 26rpx;
							color: #303133;
							margin-right: 60rpx;
						}

						.radio2 {
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
							border: 4rpx solid #BDBDBD;
							margin-right: 30rpx;
						}

						.radioSelect2 {
							border: 4rpx solid #002FA5;
							position: relative;

							&::before {
								content: '✔';
								position: absolute;
								color: #002FA5;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
							}
						}
					}
				}
			}
		}
	}
</style>
