<template>
	<view>
		<view class="head_info display-center">
			<view class="left display-left">
				<view class="type">{{orderInfo.priceWay===1?'一口价':orderInfo.priceWay===2?
					'竞价模式':orderInfo.priceWay===3?'上门报价':''}}</view>
				<view class="type">{{orderInfo.skillName}}</view>
			</view>
			<view class="right display-left" @click="goEditOrder" v-if="orderInfo.orderStatus===10">
				<image class="edit" src="https://www.51mihuo.com/static/images/order_details/edit.png" />
				<view class="text">编辑</view>
			</view>
		</view>
		<view class="des_title">{{orderInfo.requirementName}}</view>
		<view class="address_view display-left">
			<image class="address_icon" src="https://www.51mihuo.com/static/images/order_details/address_solid.png" />
			<view class="address">
				{{(orderInfo.provinceName || '') + (orderInfo.cityName==orderInfo.provinceName?'': orderInfo.cityName|| '') + 
				(orderInfo.districtName || '') + (orderInfo.latAddress || '') + (orderInfo.poiName || '') + (orderInfo.address || '')}}
			</view>
		</view>
		<!-- 已确认的 -->
		<view class="price_view" v-if="orderInfo.orderStatus!==10&&orderInfo.orderStatus!==-1">
			<!-- 有变更 -->
			<view @click="seeChangeData" v-if="newChangeData.alterationMoney">
				<text class="price">{{orderInfo.priceWay===1?orderInfo.price:masterObj.bidPrice}}</text>元
				<text class="fgx">|</text>{{changeTitle}}
				<text class="refund" :class="newChangeData.status==0?'add_item':''">{{newChangeData.alterationMoney}}</text>元
				<image class="arrow_right" src="https://www.51mihuo.com/static/icon/arrow_right.png" />
			</view>
			<!-- 无变更 -->
			<view v-else>
				<text class="price">{{priceState}}</text>元/
				{{orderInfo.priceWay===1?'一口价':orderInfo.priceWay===2?'师傅报价':orderInfo.priceWay===3?'上门报价':''}}
			</view>
		</view>
		<!-- 没确认的 -->
		<view class="price_view" v-if="orderInfo.orderStatus===10&&orderInfo.priceWay!==1">
			<text class="price">{{JSON.stringify(masterObj)=='{}'?'待报价':masterObj.bidStatus==3?masterObj.bidPrice:'待确认'}}</text>
			<text v-if="masterObj.bidStatus>=3">元/</text>
			{{masterObj.bidStatus>=2?'期望报价':'请等待师傅报价'}}
		</view>
		<!-- 没确认的一口价 -->
		<view class="price_view" v-if="orderInfo.orderStatus===10&&orderInfo.priceWay===1">
			<text class="price">{{priceState}}</text>元/一口价
		</view>
		<!-- 已取消的 -->
		<view class="price_view" v-if="orderInfo.orderStatus===-1">
			<text class="price">{{priceState}}</text>元/
			{{orderInfo.priceWay===1?'一口价':orderInfo.priceWay===2?'师傅报价':orderInfo.priceWay===3?'上门报价':''}}
		</view>

		<!-- 收起的内容 -->
		<view v-if="isOpen">
			<view class="personal_info display-center">
				<view class="info_view">
					<view class="upper">联系人姓名</view>
					<view class="lower">{{orderInfo.contactName}}</view>
				</view>
				<view class="info_view">
					<view class="upper">联系人电话</view>
					<view class="lower">{{orderInfo.contactPhone}}</view>
				</view>
				<view class="info_view">
					<view class="upper">期望上门时间</view>
					<view class="lower">{{orderInfo.expectDate}}</view>
				</view>
			</view>

			<!-- 需求描述 -->
			<view class="demand_des">
				<view class="des_title">需求描述</view>
				<view class="describe">{{orderInfo.requirementDesc}}</view>
				<view class="image_show" v-if="orderInfo.attachments">
					<message-mh-image-show :imgSrc="orderInfo.attachments" />
				</view>
				<message-mh-mihuo-audio v-if="audioObject" :formDate="audioObject" />
			</view>
		</view>
		<view class="open_btn" @click="isOpen = !isOpen">
			<view class="btn_title">{{isOpen?'收起':'展开'}}信息</view>
			<image src="https://www.51mihuo.com/static/images/order_details/open_arrow.png" :style="isOpen?'transform:rotate(-180deg);':''" />
		</view>
	</view>
</template>

<script>
	/*	
	orderInfo.priceWay 1:一口价；2：报价；3：上门报价
	bidStatus 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受4=发单方拒绝 5=发单方取消报价6=接单放取消订单 7=关闭竞价订单
	 */
	export default {
		props: {
			orderInfo: {
				type: Object,
				default: () => ({})
			},
			newChangeData: {
				type: Object,
				default: () => ({})
			},
			// 接单师傅信息
			masterObj: {
				type: Object,
				default: () => ({})
			}
		},

		computed: {
			/* payStatus初始状态：增项 待付款，减项 待确认(0, "待付款/待确认"),
			增项 已支付，减项 已确认(1, "已支付/已确认"),
			增项 减项 确认失败(2, "支付失败/确认失败"),
			增项 减项 不确认(3, "不确认"),
			status 0增项1减项
			 */

			changeTitle() {
				/* orderStatus 订单状态: 10=已发布/待确认；20=已确认/待付款；30=已付款/服务中；35=已申请/待验收；
				40=待结算；50=已完成/待评价；51=已完成/已评价；-1=已取消 */
				if (this.orderInfo.orderStatus === 30 || this.orderInfo.orderStatus === 40) {
					if (this.newChangeData.payStatus == 0 && this.newChangeData.status == 1) {
						return '变更待退款'
					} else if (this.newChangeData.payStatus == 0 && this.newChangeData.status == 0) {
						return '变更待支付'
					}
				} else if (this.orderInfo.orderStatus === 35) {
					if (this.newChangeData.payStatus == 1 && this.newChangeData.status == 1) {
						return '含待退款'
					} else if (this.newChangeData.payStatus == 1 && this.newChangeData.status == 0) {
						return '含变更项'
					}
				} else if (this.orderInfo.orderStatus >= 50) {
					if (this.newChangeData.payStatus == 1 && this.newChangeData.status == 1) {
						return '已退款'
					}
				}
			},
			priceState() {
				if (this.orderInfo.priceWay == 3 && this.masterObj.bidStatus == 3) {
					return this.masterObj.bidPrice
				} else if (this.orderInfo.priceWay == 3 && this.masterObj.bidStatus != 3) {
					return '待议价'
				} else if (this.orderInfo.priceWay == 2 && this.masterObj.bidStatus < 2) {
					return '待报价'
				} else {
					return this.orderInfo.price
				}
			}
		},

		data() {
			return {
				isOpen: false,
				audioObject: null
			}
		},

		watch: {
			orderInfo: {
				handler(data) {
					data.attachments && JSON.parse(data.attachments).map(item => {
						if (item.timeLength) {
							this.audioObject = item
						}
					})
				},
			}
		},
		mounted() {
			this.orderInfo.attachments && JSON.parse(this.orderInfo.attachments).map(item => {
				if (item.timeLength) {
					this.audioObject = item
				}
			})
		},
		methods: {
			//查看变更项
			seeChangeData() {
				let url =''
				if(this.orderInfo.projectId && this.orderInfo.projectId >0){
					url =`/pages-findMaster/changeItemList?projectId=${this.orderInfo.projectId}`
				}else{
					url =`/pages-findMaster/changeItemList?orderId=${this.orderInfo.id}`
				}
				this.toPage(url)
			},
			goEditOrder() {
				this.toPage('/pages-findMaster/issueOrder?type=edit&id=' + this.orderInfo.id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head_info {
		.left {
			.type {
				padding: 8rpx 16rpx;
				margin-right: 24rpx;
				text-align: center;
				font-weight: bold;
				font-family: PingFang SC;
				font-size: 22rpx;
				color: #FE6E32;
				border: 2rpx solid #FE6E32;
				border-radius: 6rpx;
			}
		}

		.right {
			.edit {
				margin-right: 12rpx;
				width: 22rpx;
				height: 22rpx;
			}

			.text {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FE6E32;
			}
		}
	}

	.des_title {
		font-size: $fontSize30;
		font-family: PingFang SC;
		font-weight: bold;
		color: $mainFontColor14;
		margin-top: 29rpx;
		@include toe();
	}

	.address_view {
		margin-top: 20rpx;

		.address_icon {
			width: 25rpx;
			height: 29rpx;
			margin-right: 25rpx;
		}

		.address {
			flex: 1;
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $mainFontColor14;
			@include bov();
		}
	}

	.price_view {
		font-size: $smallFontSize;
		font-family: PingFang SC;
		font-weight: 500;
		color: #141414;
		margin-top: 30rpx;

		.price {
			font-size: $fontSize46;
			font-family: FZGDCTiS;
			font-weight: 500;
			color: $fontColorPrice;
			margin-right: 12rpx;
		}

		.fgx {
			margin: 10rpx;
			font-size: 20rpx;
			color: #e5e5e5;
		}

		.refund {
			font-size: 32rpx;
			font-family: Arial;
			font-weight: bold;
		}

		.add_item {
			color: $fontColorPrice;
		}

		.arrow_right {
			width: 12rpx;
			height: 20rpx;
			margin: 0 0 3rpx 15rpx;
			display: inline-block;
		}
	}

	.open_btn {
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #F8F8F8;
		margin-top: 30rpx;
		border-radius: $miniBorderRadius;

		.btn_title {
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $fontColor80;
		}

		image {
			width: 14rpx;
			height: 8rpx;
			transition: all .2s;
			margin-left: 12rpx;
		}
	}

	.personal_info {
		border-top: 1rpx solid #E6E6E6;
		border-bottom: 1rpx solid #E6E6E6;
		margin: 25rpx 0;

		.info_view {
			width: 33%;
			padding: 28rpx 0;

			.upper {
				font-size: $smallFontSize;
				font-family: PingFang SC;
				font-weight: 500;
				color: $fontColor80;
			}

			.lower {
				font-size: $smallFontSize;
				font-family: PingFang SC;
				font-weight: bold;
				color: $mainFontColor14;
				margin-top: 25rpx;
			}
		}
	}

	.demand_des {
		margin: 30rpx 0;

		.describe {
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $mainFontColor14;
			margin-top: 34rpx;
			@include bov(2);
		}

		.image_show {
			margin-top: 37rpx;
		}
	}

	.display-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.display-left {
		display: flex;
		align-items: center;
	}
	.list-data{
		background: #F8F8F8;
		border-radius: 12rpx;
		padding: 30rpx;
		display: flex;
		margin-bottom: 20rpx;
		&:last-child{
			margin-bottom: 0;
		}
		.list-data_left{
			color: #000000;
			font-size: 28rpx;
			width: 150rpx;
		}
		.list-data_center{
			flex: 1;
			display: flex;
			align-items: center;
			text{
				color: #808080;
			}
			.center_col1{
				font-size: 22rpx;
				margin-right: 5rpx;
			}
			.center_col2{
				font-size: 28rpx;
			}
			.center_col3{
				font-size: 24rpx;
				color: #FE6E32;
				margin-left: 5rpx;
			}
			.bold{
				color: #FE6E32;
				font-weight: bold;
			}
		}
		.list-data_right{
			width: 130rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			flex-shrink: 0;
			text{
				background: #808080;
				border-radius: 10rpx 2rpx;
				padding: 5rpx 10rpx;
				font-size: 18rpx;
				color: #ffffff;
				margin-right: 10rpx;
				&.right_true{
					background: #FE6E32;
				}
			}
		}
	}
</style>
