<template>
	<view class="order-price-list">
		<!-- <view class="order-information" v-if="pageType == '接单'">
			<view class="my-offer">
				<view class="item-price">
					<view class="item-top">
						<view class="item-left">
							<text class="item-num">{{orderDetails.bizOrderOffer && orderDetails.bizOrderOffer.bidPrice}}</text>
							<text class="pice">元/</text>
							<text class="pice">我的报价</text>
						</view>
						<view class="item-right" v-if="orderDetails.bizOrderOffer && orderDetails.bizOrderOffer.arrivalPrice">
							<text class="pice">{{orderDetails.bizOrderOffer && orderDetails.bizOrderOffer.arrivalPrice}}元/预计到手</text>
						</view>
					</view>
					<view class="item-other">
						报价时间 {{orderDetails.bizOrderOffer && orderDetails.bizOrderOffer.created}}
					</view>
				</view>
				<view class="quotation-description">
					<text class="item-title"> 报价说明</text>
					<text class="item-desc">
						{{orderDetails.bizOrderOffer &&  orderDetails.bizOrderOffer.bidDescription}}
					</text>
				</view>
			</view>
		</view> -->
		<view class="send-order-quotation" v-if="groupPrices.length > 0">
			<quotation-list :list="groupPrices" :beforeOrderId="orderDetails.beforeOrderId" 
				:bidStatus="orderDetails.bizOrderOffer && orderDetails.bizOrderOffer.bidStatus"
				:orderStatus="orderDetails.orderStatus">
			</quotation-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				orderDetails: '',
				pageType: '',
				groupPrices:[]
			}
		},
		computed: {
			setSourceType() {
				switch (this.orderDetails.source) {
					case 1:
						return '个人发布'
					case 2:
						return '服务者发布'
					case 3:
						return '企业发布'
					case 4:
						return '平台发布'
				}
			},
			setRequirementName() {
				let tempRequirementName = this.orderDetails.requirementName
				if (tempRequirementName) {
					return tempRequirementName
				} else {
					return this.orderDetails &&
						`${this.orderDetails && this.orderDetails.poiName}需要${this.orderDetails.requirementTypeName}${this.orderDetails.skillName}`
				}
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.pageType = this.option.pageType
			this.getDetails()
		},
		methods: {
			getDetails() {
				this.$httpApi.getOrderById(this.option.orderId).then(res => {
					if (!res) {
						return
					}
					// 发单方组合报价
					res.groupPrices = res.groupPrices.filter(item => item.businessId == this.option.skillId)
					this.orderDetails= res
					this.getProjectGroupPriceList(res.projectId)
				})
			},
			setSkillNameLength(item) {
				if (item) {
					switch (item.length) {
						case 2:
							return 'item-work-type'
						case 3:
							return 'item-work-type-medium'
						case 4:
							return 'item-work-type-big'
						default:
							return 'item-work-type-big'
					}
				}
			},
			getProjectGroupPriceList(id) {
				this.$httpApi.createPublisherGroupPrice({
					projectId: id,
					skillId: this.option.skillId
				}).then(res => {
					if (res) {
						this.groupPrices = res
						
						console.log('this.groupPrices',this.groupPrices)
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.order-price-list {
		background-color: #fff;
		padding: 22rpx 0rpx;
	}

	.order-information {}

	.send-order-quotation {
		padding: 0 36rpx;
	}

	.order-information {
		padding: 0 36rpx;

		.my-offer {
			padding-bottom: 20rpx;
			border-bottom: 2rpx solid #F6F6F6;
		}

		.item-price {

			.item-top {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item-left {

					.item-num {
						font-size: 46rpx;
						color: #FF5D35;
					}
				}

				.pice {
					font-size: 24rpx;
					color: #303133;
				}

			}

			.item-other {
				margin-top: 8rpx;
				font-size: 24rpx;
				color: #303133;
			}

		}

		.quotation-description {
			display: flex;
			flex-direction: column;
			margin-top: 36rpx;

			.item-title {
				font-size: 28rpx;
				color: #303133;
				margin-bottom: 8rpx;
			}

			.item-desc {
				font-size: 26rpx;
				color: #303133;
			}
		}
	}
</style>
