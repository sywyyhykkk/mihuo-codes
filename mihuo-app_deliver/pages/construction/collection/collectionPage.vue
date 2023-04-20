<template>
	<view class="collection-page">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				收款
			</view>
			<view slot="right" class="nav-bar-right" @click="cutView">
				凭证记录
			</view>
		</z-nav-bar>
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<!-- 节点相关信息	 -->
		<node-information ref="nodeInformation"></node-information>
		<!-- 节点审核信息 -->
		<sop-node-check ref="nodeCheck"></sop-node-check>
		<!-- 手动开始、结束填写的数据 -->
		<sop-operation-detail ref="sopOperationDetail" :iconShow="false"></sop-operation-detail>
		
		<custom-title title="收款记录"></custom-title>
		<view class="list-all-contain">
			<view class="statistical-top">
				<view class="statistical x6-flex">
					<view class="left">共计 <text
							class="num">{{ this.nodeInfo.collectFlag == 1 ? totalPriceNew : orderInfoNew.totalPrice  || 0}}</text>
						<text class="unit">元</text>
					</view>
					<view class="right">已收款{{orderInfoNew.paidAmount || 0}}元</view>
				</view>
				<view class="abstract">
					合同金额{{orderInfoNew.contractAmount || 0}},变更金额{{ orderInfoNew.alterationPrice || 0}}</view>
				<view class="payment-schedule" v-if="orderInfoNew.contractAmount">
					<text class="name">收款进度</text>
					<u-line-progress round active-color="#002FA5" height="8" :show-percent="false" :percent="progress">
					</u-line-progress>
					<text class="percentage">{{progress}}%</text>
				</view>
			</view>
			<view class="list-contain" v-if="list.length > 0">
				<view class="header-contain">
					<text class="item-header">操作/时间</text>
					<text class="item-header payee">收款人</text>
					<text class="item-header">金额/方式</text>
				</view>
				<view class="item-list" v-for="(item,index) in list" :key="index" @click="getDetails(item)">
					<view class="item-list-contain">
						<view class="item-top x6-flex">
							<view class="left">订单编号 20210721967</view>
							<view class="right">
								<image class="copy_icon" src="@/static/images/copy_1.png"
									@click.stop="copy(item.receiptCode)" />
								复制
							</view>
						</view>
						<view class="item-middle">
							<view class="item-contain">
								<text class="value">第{{getNumber2text(index + 1)}}次收款</text>
								<text class="label">{{item.created}}</text>
							</view>
							<view class="item-contain">
								<text class="value">{{item.userName}}</text>
								<text class="label">{{item.skillName}}</text>
							</view>
							<view class="item-contain">
								<text class="value value-num">+{{item.price}}元</text>
								<text class="label">{{item.typeName}}</text>
							</view>
						</view>
					</view>
					<view class="item-line"></view>
				</view>

				<view class="statistical-contain">
					<text class="value">本阶段收款共计</text>
					<text class="label" v-if="receiptPrice">{{receiptPrice}}元</text>
				</view>
			</view>
		</view>
		
		<!-- 手动开始、手动结束 -->
		<sop-operation ref="sopOperation" :addButtonList="setAddButtonList" @getButton="getButton"></sop-operation>
		
		
		<!-- 线上收款时只能催款 -->
		<!-- <view class="button-contain">
			<view class="item-button default" :class="{'item-button-pay':this.nodeInfo.collectFlag == 1}"
				@click="operation(operationName)">{{operationName}}</view>
			<view class="item-button active" v-if="operationName == '录入收款信息'"
				:class="confirmShow ? 'item-button-active':''" @click="operation('收款完成')">
				收款完成</view>
		</view> -->

		<u-modal v-model="modelShow" width="340" :async-close="true" :mask-close-able="true"
			:show-confirm-button="false" :show-title="false">
			<view class="model-contain">
				<view class="text">收款完成</view>
				<view class="button" @click.stop="getConfirm">确认</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import {
		number2text
	} from '@/plugins/utils'
	export default {
		data() {
			return {
				modelShow: false,
				list: [],
				receiptPrice: '',
				projectId: '',
				nodeId: '',
				operationName: '录入收款信息',
				orderInfoNew: {},
				confirmShow: false,
				projectDetails: {},
				totalPriceNew: '',
				buttonList:[{name:'录入收款信息'},{name:'收款完成'}]
			}
		},

		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'orderInfo', 'userPersonInfo']),
			progress() {
				let paidAmount = this.projectDetails.paidAmount // 已收款
				let totalPrice // 总金额

				if (this.nodeInfo.collectFlag == 1) {
					totalPrice = this.totalPriceNew || 0 // 总金额
					if (totalPrice) {
						return Number(((paidAmount / totalPrice).toFixed(3) * 100).toFixed(2))
					} else {
						return 0
					}
				} else {
					totalPrice = this.projectDetails.totalPrice || 0 // 总金额
					if (totalPrice) {
						return Number(((paidAmount / totalPrice).toFixed(3) * 100).toFixed(2))
					} else {
						return 0
					}
				}

			},
			setAddButtonList(){
				// 线上收款时只能催款
				if(this.nodeInfo.collectFlag == 1){
					return [{name:'催款'}]
				}else{
					return this.buttonList
				}
			}
		},
		onLoad() {

		},
		onShow() {
			this.setParameter()
		},
		methods: {
			setParameter() {
				this.projectId = this.projectInfo.projectId
				this.nodeId = this.nodeInfo.nodeId
				this.operationName = this.nodeInfo.collectFlag == 1 ? '催款' : '录入收款信息'
				this.setConfirmShow()
				this.getList()
				this.getReceiveDetail()
				this.getProjectDetails()
				this.getPaymentOnlineMoney()
				this.setNodeDetails()
			},
			setNodeDetails() {
				// 刷新节点审核信息
				this.$refs.nodeInformation && this.$refs.nodeInformation.getReviewList()
				this.$refs.nodeCheck && this.$refs.nodeCheck.getReviewList()
				// 更新node详情  
				this.$getNodeDetails(() => {
					// 刷新 手动添加的内容
					this.$refs.sopOperationDetail && this.$refs.sopOperationDetail.getDetails()
					// 刷新按钮禁用
					this.$refs.sopOperation && this.$refs.sopOperation.getDetails()
					setTimeout(()=>{
						// 刷新按钮显示
						this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
					},200)
				})
			},
			setConfirmShow() {
				if (!this.nodeId) {
					return
				}

				this.$httpApi.sopNodeTemplate({
					nodeId: this.nodeId
				}).then(res => {
					if (res) {
						if (res.status == 3) {
							this.confirmShow = true
						} else {
							this.confirmShow = false
						}
					}
				})
			},
			getNumber2text(index) {
				return number2text(index)
			},
			getProjectDetails() {
				this.$httpApi.getProjectDetails({
					id: this.projectId
				}).then(res => {
					if (res) {
						this.projectDetails = res
					}
				})
			},

			getList() {
				this.$httpApi.sopReceiptRecordsOnePage({
					projectId: this.projectId,
					nodeId: this.nodeId,
				}).then(res => {
					if (res) {
						this.list = res.srrRes
						this.receiptPrice = res.receiptPrice
					}
				})
			},
			getPaymentOnlineMoney() {
				if (this.nodeInfo.collectFlag == 1) {
					this.$httpApi.paymentOnlineMoney({
						nodeId: this.nodeId
					}).then(res => {
						if (res) {
							this.totalPriceNew = res
						}
					})
				}
			},
			getReceiveDetail() {
				this.$httpApi.getProjectDetails({
					id: this.projectId
				}).then(res => {
					if (res) {
						this.orderInfoNew = res;
					}
				})
			},
			cutView() {
				this.toPage(`/pages/construction/collection/collectionRecord`)
			},
			copy(value) {
				uni.setClipboardData({
					data: value,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			},
			getButton(typeName){
				this.debounce(() => {
					switch (typeName) {
						case '录入收款信息':
							this.toPage(`/pages/construction/collection/collectionForm`)
							break
						case '催款':
							this.$httpApi.paymentDunning({
								nodeId: this.nodeId,
								skillName: this.userPersonInfo && this.userPersonInfo.skillName,
								skillId:this.userPersonInfo && this.userPersonInfo.skillId
							}).then(res => {
								if (res) {
									this.$util.toast('催款成功');
								}
							})
							break
						case '收款完成':
							if (!this.confirmShow) {
								this.modelShow = !this.modelShow
							}
							break
					}
				}, 200)
			},
			operation(typeName) {
				this.debounce(() => {
					switch (typeName) {
						case '录入收款信息':
							this.toPage(`/pages/construction/collection/collectionForm`)
							break
						case '催款':
							this.$httpApi.paymentDunning({
								nodeId: this.nodeId,
								skillName: this.userPersonInfo && this.userPersonInfo.skillName,
								skillId:this.userPersonInfo && this.userPersonInfo.skillId || 0
							}).then(res => {
								if (res) {
									this.$util.toast('催款成功');
								}
							})
							break
						case '收款完成':
							if (!this.confirmShow) {
								this.modelShow = !this.modelShow
							}
							break
					}
				}, 200)
			},
			getDetails(item) {
				this.toPage(`/pages/construction/collection/collectionDetails?receiptId=${item.receiptId}`)
			},
			getConfirm() {
				this.modelShow = !this.modelShow
				this.$httpApi.overReceipt({
					nodeId: this.nodeId,
				}).then(res => {
					this.getList()
					this.setConfirmShow()
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.x6-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.collection-page {
		padding-bottom: 138rpx;
	}

	.nav-bar-right {
		font-size: $middleFontSize;
		color: $viceFontColor;
		padding-right: 28rpx;
	}

	.model-contain {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 190rpx;

		image {
			width: 56rpx;
			height: 56rpx;
			margin-bottom: 16rpx;
		}

		.text {
			font-weight: 400;
			font-size: $middleFontSize;
			color: #303133;
			margin-bottom: 24rpx;
		}

		.button {
			background: $themeColor;
			border: 1px solid $themeColor;
			color: #FFFFFF;
			box-sizing: border-box;
			border-radius: 50rpx;
			height: 50rpx;
			left: 50rpx;
			width: 144rpx;
			text-align: center;
			line-height: 50rpx;
			font-size: $smallFontSize;
		}
	}

	.order-partial-information {
		.item-introduction {
			display: flex;
			flex-direction: column;
			margin: 0 20rpx;
			padding: 36rpx 42rpx 42rpx 50rpx;
			background: $bgColor;
			border-radius: $miniBorderRadius;

			.top {
				margin-bottom: 6rpx;

				.left {
					font-weight: bold;
					font-size: $middleFontSize;
					color: $seconFontColor;
				}

				.right {
					font-size: $smallFontSize;
					color: $themeColor;
				}
			}

			.middle {
				margin-bottom: 22rpx;

				.left {
					font-size: $smallFontSize;
					color: $themeColor;
				}

				.right {
					font-size: $smallFontSize;
					color: $errorFontColor;
				}

			}

			.bottom {
				display: flex;

				.label {
					font-size: $middleFontSize;
					color: $fontColor99;
					margin-right: 10rpx;
				}

				.value {
					font-size: $middleFontSize;
					color: $seconFontColor;
				}
			}
		}
	}

	.list-all-contain {
		background-color: #FFFFFF;
		margin: 0 20rpx 0 20rpx;
		border-radius: $miniBorderRadius;

		.statistical-top {
			padding: 28rpx 34rpx 30rpx 44rpx;

			.statistical {

				.left {
					color: #303133;
					font-size: $middleFontSize;

					.num {
						color: $errorFontColor;

					}

					.unit {
						// font-size: $smiddleFontSize;
						font-size: $smallFontSize;
						color: #999999;
					}
				}

				.right {
					color: $themeColor;
					font-size: $middleFontSize;
				}
			}

			.abstract {
				font-size: $middleFontSize;
				color: #999999;
				margin-bottom: 18rpx;
			}

			.payment-schedule {
				display: flex;
				align-items: center;

				.name {
					color: $mainFontColor;
					font-size: $smiddleFontSize;
					min-width: 104rpx;
					margin-right: 26rpx;
				}

				.percentage {
					margin-left: 20rpx;
					color: $themeColor;
					font-weight: 700;
					font-size: $smiddleFontSize;
				}
			}
		}

		.list-contain {
			.payee {
				padding-left: 100rpx;
			}

			.header-contain {
				display: flex;
				justify-content: space-between;
				padding: 24rpx 26rpx;
				margin: 0 26rpx;
				background: #F6F6F6;
				border-radius: 2px;

				.item-header {
					font-size: $smallFontSize;
					color: #909199;
				}
			}

			.item-list {

				&:nth-last-child(2) {
					.item-line {
						height: 2rpx;
					}
				}

				.item-list-contain {
					padding: 0rpx 44rpx 0rpx 48rpx;
					margin: 30rpx 0rpx;

					.item-top {
						border-bottom: 2rpx dashed #F6F6F6;
						padding-bottom: 32rpx;

						image {
							width: 18rpx;
							height: 18rpx;
							margin-right: 4rpx;
						}

						.left {
							font-weight: 400;
							font-size: $smallFontSize;
							color: #909199;
						}

						.right {
							font-weight: 400;
							font-size: $smallFontSize;
							color: #909199;
							display: flex;
							align-items: center;
						}

					}

					.item-middle {
						margin-top: 18rpx;
						display: flex;
						justify-content: space-between;

						.item-contain {
							display: flex;
							flex-direction: column;

							.value {
								color: $seconFontColor;
								font-size: $middleFontSize;
							}

							.value-num {
								color: $errorFontColor;
								font-weight: 700;
							}

							.label {
								color: #909199;
								font-size: $smallFontSize;
							}

						}

					}
				}

				.item-line {
					height: 4rpx;
					margin: 0rpx 12rpx;
					background: #F6F6F6;
					border-radius: $miniBorderRadius;
				}
			}

			.statistical-contain {
				text-align: right;
				padding: 30rpx 44rpx 40rpx 0rpx;

				.value {
					font-size: $middleFontSize;
					margin-right: 8rpx;
				}

				.label {
					font-weight: 700;
					color: $errorFontColor;
				}
			}
		}
	}

	.button-contain {
		position: fixed;
		bottom: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 0rpx;
		background-color: #FFF;


		.item-button {
			width: 268rpx;
			height: 88rpx;
			font-size: $middleFontSize;
			border-radius: $miniBorderRadius;
			text-align: center;
			line-height: 88rpx;
		}

		.item-button-pay {
			width: 600rpx;
		}

		.item-button-active {
			opacity: 0.5;
		}

		.default {
			margin-right: 24rpx;
			background-color: #FFFFFF;
			border: 2rpx solid $themeColor;
			color: $themeColor;
		}

		.active {
			background-color: $themeColor;
			color: #FFFFFF;
		}
	}
</style>
