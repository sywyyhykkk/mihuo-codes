<template>
	<view class="price-information">
		<view class="item-contain">
			<text class="item-label">商品总价</text>
			<text class="item-value">￥{{info.itemTotalAmount}}</text>
		</view>
		<view class="item-contain" v-if="info.freightAmount">
			<text class="item-label">运费</text>
			<text class="item-value">￥{{info.freightAmount}}</text>
		</view>
		<view class="item-contain" v-if="info.freightInstallationAmount">
			<text class="item-label">入户/安装</text>
			<text class="item-value">￥{{info.freightInstallationAmount}}</text>
		</view>
		<view class="item-contain" v-if="info.freightStairwayAmount">
			<text class="item-label">搬运上楼</text>
			<text class="item-value">￥{{info.freightStairwayAmount}}</text>
		</view>
		<view class="item-contain" v-if="info.couponAmount">
			<text class="item-label">优惠券</text>
			<text class="item-value">￥-{{info.couponAmount}}</text>
		</view>
		<view class="item-contain" v-if="info.diffAmount || info.replenishmentAmount ">
			<view class="item-label-const " @click="getCost()">
				补齐费用
				<image src="/static/images/help-circle.png" mode=""></image>
			</view>
			<text class="item-value item-warning">{{info.diffAmount || info.replenishmentAmount}}</text>
		</view>
		
		<view class="item-contain">
			<text class="item-label">总计金额</text>
			<text class="item-value item-warning">{{info.payAmount}}</text>
		</view>

		<u-modal v-model="costShow" width="540" :async-close="true" :mask-close-able="true" :show-confirm-button="false"
			:show-title="false">
			<view class="model-contain">
				<view class="text-title">补齐费用说明</view>
				<view class="text-desc">该订单最低购买金额为{{info.itemTotalAmount + info.diffAmount}}元，当前订单商品金额为{{info.itemTotalAmount}}元，须补{{info.diffAmount}}元</view>
				<view class="button" @click.stop="getConfirm()">确认</view>
			</view>
		</u-modal>
	</view>


</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		name: 'price-information',
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			typeName:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				option: {},
				costShow: false,
			}
		},
		computed: {
			getProductPrice() {
				let price = []
				if(this.info.orderItemList[0].orderItemList){
					this.info.orderItemList.forEach(item =>{
						item.orderItemList.forEach(item1 =>{
							price.push(item1.productPrice)
						})
					})
				}else{
					price = this.info.orderItemList.map(item =>{
						return item.productPrice
					})
				}
				let resultPrice = 0
				price.forEach(item =>{
					resultPrice =  item + resultPrice
				})
				return resultPrice
			},
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getCost() {
				this.costShow = !this.costShow
			},
			getConfirm() {
				this.costShow = !this.costShow
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.price-information {
		background-color: #fff;

		.item-contain {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.item-label {
				color: #606166;
				font-size: 28rpx;
			}

			.item-value {
				color: #606166;
				font-size: 30rpx;
			}

			.item-warning {
				color: $errorFontColor;
			}

			.item-label-const {
				color: #606166;
				font-size: 28rpx;
				display: flex;
				align-items: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-left: 10rpx;
				}
			}
		}

		.model-contain {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-bottom: 40rpx;

			.text-title {
				color: #303133;
				font-size: 28rpx;
				font-weight: bold;
				padding: 36rpx 0rpx 22rpx 0rpx;
				text-align: center;
			}

			.text-desc {
				padding: 0rpx 64rpx;
				color: #606166;
				font-size: 26rpx;
				margin-bottom: 28rpx;
				min-height: 78rpx;
				text-align: center;
			}

			.button {
				width: 216rpx;
				height: 72rpx;
				display: flex;
				padding: 18rpx 46rpx;
				border-radius: 10rpx;
				background: #C8D8FF;
				justify-content: center;
				align-items: center;
				color: $themeColor;
				font-size: 26rpx;
			}
		}

	}
</style>
