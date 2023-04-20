<template>
	<view>
        <view
		:class="{
			'other_bid':orderInfo.priceWay != 2 || orderInfo.orderStatus >=20
		}"
		>
            <view class="display-felx" v-if="item.personInfo && item.personInfo.skillId">
                <view class="left_avater display-felx">
                    <u-avatar class="avatar" size="100" :src="$util.avatarImage(item.personInfo.userId)"
                        v-if="item.personInfo" />
                    <view class="ident_V">V{{item.personInfo.level}}</view>
                </view>
                <view class="right_info">
                    <view class="top">
                        <view class="left">
                            <text class="name">{{item.personInfo.name}}</text>
                            <text class="skill_name">{{item.personInfo.skillName}}</text>
                            <view class="display-felx">
                                <mihuo-image @click="callPhone(item)"
                                src="https://www.51mihuo.com/static/icon/work_type/phone.png" class="image" />
                                <mihuo-image  @click="contactMe(item)" src="https://www.51mihuo.com/static/images/order_details/chat.png" class="image" />
                            </view>
                        </view>
                        <view class="choice_worker" @click="()=>$emit('orderReceiving')"
                            v-if="orderInfo.orderStatus===10&&orderInfo.priceWay===2&&item.bidStatus ==2">
                            选TA
                        </view>
                    </view>
                    <view class="center display-left">
                        <view class="display-left display-left_price" v-if="orderInfo.priceWay === 1">
							<text class="price" >{{ item.bidPrice }}</text>
                            <text>元</text>
                        </view>
                        <text class="bid_status">{{ item.bidStatus==0 ?'未报价':item.bidStatus>=2?'已报价':''}}</text>
                    </view>
                    <!-- 清单入口确认选报价之后展示-->
                    <view class="detailed_list display-center"
                        v-if="item.bidStatus !==0  && item.groupPrices && item.groupPrices.length && orderInfo.orderStatus<20">
                        <view class="left_list display-left">
                            <view class="list_item display-left" v-for="(v,i) in item.groupPrices" :key="i">
                                <text class="skill_name-item" v-if="v.businessName && i<=3">{{v.businessName}}</text>
                            </view>
                        </view>
                        <view class="right_ent display-left" style="letter-spacing: 3rpx;" @click="()=>$emit('orderReceiving')">
                            <text class="text">查看清单</text>
                            <mihuo-image src="https://www.51mihuo.com/static/images/order_details/orange_right_arrow.png" mode="" />
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="bottom_bid" v-if="orderInfo.priceWay != 2 || orderInfo.orderStatus>=20">
            <view  @click="goTo('沟通')">
				<text>沟通记录</text>
			</view>
            <view @click="goTo('打卡记录')" v-if="orderInfo.orderStatus>=30">
				<text>打卡记录</text>
				<text class="order_tips" v-if="orderInfo.newScheduleCount">{{ orderInfo.newScheduleCount }}</text>
			</view>
            <view @click="goTo('服务日志')" v-if="orderInfo.orderStatus>=30">
				<text>服务日志</text>
				<text class="order_tips" v-if="orderInfo.newConstructionJournalCount">{{ orderInfo.newConstructionJournalCount }}</text>
			</view>
            <view @click="goTo('报价')">
				<text>报价记录</text>
			</view>
        </view>
		<!-- 联系师傅 -->
		<order-mh-contact-me v-model="contactPopup" :orderId="orderInfo.id" :data="masterInfo"></order-mh-contact-me>
	</view>
</template>

<script>
	export default {
		props: {
			orderInfo: {
				type: Object,
				default: () => ({})
			},
			item: {
				type: Object,
				default: () => ({})
			},
		},
		data() {
			return {
				contactPopup: false,
				masterInfo: {},
			}
		},
		methods: {
			// 联系我
			contactMe(data) {
                if(data.bidStatus == 4){
                    return
                }
				this.masterInfo = data;
				this.contactPopup = true
			},
			callPhone(data) {
                if(data.bidStatus == 4){
                    return
                }
				uni.makePhoneCall({
					phoneNumber: data.phone
				})
			},
			goTo(type){
				if(this.item.bidStatus == 4){
                    return
                }
				switch (type) {
					case '沟通':
						this.toPage(`/pages-order/communicationRecord?orderId=${this.item.orderId}`)
						break;
					case '拒单':
						this.toPage(`/pages-order/rejectionRecord?userId=${this.item.personInfo && this.item.personInfo.userId}&userName=${this.item.personName}`)
						break;
					case '报价':
						this.toPage(`/pages-order/recordRecord?orderId=${this.item.orderId}&userId=${this.item.personInfo && this.item.personInfo.userId}&skillName=${this.item.skillName}`)
						break;
					case "打卡记录":
						this.toPage(`/pages-order/punchInRecord?orderId=${this.item.orderId}&personId=${this.item.personId}&projectId=${this.item.projectId}&skillName=${this.item.skillName || ''}`)
						break;
					case "服务日志":
						this.toPage(`/pages-order/constructionLog?orderId=${this.item.orderId}&projectId=${this.item.projectId}&skillName=${this.item.skillName || ''}&deliveryType=${this.orderInfo.deliveryType}`)
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.left_avater {
		margin-right: 38rpx;
		position: relative;
		.ident_V {
			position: absolute;
			top: 0;
			right: -10rpx;
			font-size: 15rpx;
			font-family: FZRuiZhengHei_GBK;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
            padding: 5rpx 10rpx 0rpx;
			background: linear-gradient(90deg, #333333, #666666);
			border-radius: 10rpx 0;
            font-style: italic;
		}
	}

	.right{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-top: 20rpx;
		.mode {
			font-size: $smallFontSize;
			color: $mainFontColor14;
			font-family: PingFang SC;
			font-weight: 500;
			padding-bottom: 20rpx;
		}
		.price {
			font-size: $fontSize36;
			color: $fontColorPrice;
			font-family: FZGDCTiS;
			font-weight: 500;
			margin-left: 6rpx;
		}
		view{
			border: 2rpx solid #141414;
			padding: 10rpx 20rpx;
			border-radius: 12rpx;
			position: relative;
			.title{
				color: #141414;
				font-size: 24rpx;
				font-weight: bold;
			}
			.badge{
				position: absolute;
				right: -10rpx;
				top: -10rpx;
				background: #FE6E32;
				font-size: 24rpx;
				color: #FFFFFF;
				padding:5rpx 10rpx;
				border-radius: 100rpx;
			}
		}
		.margin-re{
			margin:0 20rpx;
		}
	}

	.right_info {
		width: 100%;
		.top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .choice_worker {
				width: 100rpx;
				background: #FE6E32;
				border-radius: 8rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
				text-align: center;
                padding: 10rpx 0;
			}
			.left {
				display: flex;
				.name {
					font-size: $middleFontSize;
					color: $mainFontColor14;
					font-family: PingFang SC;
					font-weight: bold;
					margin-right: 17rpx;
				}

				.skill_name {
					font-size: $fontSize22;
					color: $fontColorPrice;
					font-family: FZRuiZhengHei_GBK;
					font-weight: 800;
					display: inline-block;
					line-height: 34rpx;
					padding: 0 8rpx;
					text-align: center;
					border: 2rpx solid $fontColorPrice;
					border-radius: 6rpx;
				}

				.image {
					width: 35rpx;
					height: 35rpx;
					margin-left: 20rpx;
				}
			}

		}
        .center{
            padding: 10rpx 0;
            .price{
                color: #FE6E32;
                font-weight: bold;
                font-size: 32rpx;
                font-family: Arial-BoldMT;
            }
            text{
                font-size: 24rpx;
            }
			.display-left_price{
				margin-right: 20rpx;
			}
            .bid_status{
                background: #FE6E32;
                color: #FFFFFF;
                font-size: 16rpx;
                font-weight: bold;
                font-family: NotoSansHans;
                padding: 5rpx 8rpx;
                border-radius: 10rpx 0;
            }
        }
		.see_btn {
			width: 111rpx;
			height: 38rpx;
			text-align: center;
			line-height: 36rpx;
			border: 1rpx solid #141414;
			border-radius: 6rpx;
			font-size: 21rpx;
			color: #141414;
		}

		.text {
			font-size: $smallFontSize;
			color: $fontColor80;
			font-family: PingFang SC;
			font-weight: 500;
		}

		.bottom {
			margin-top: 17rpx;
		}
	}

	.detailed_list {
        margin-top: 10rpx;
		.left_list {
			.list_item {
				margin-right: 20rpx;
				.skill_name-item {
					background: #000000;
					color: #FFFFFF;
					font-size: 18rpx;
					padding: 4rpx 10rpx;
					border-radius: 10rpx 0;
				}

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 12rpx;
					border-radius: 4rpx;
				}
			}
		}
	}

	.right_ent {
		.text {
			font-size: $fontSize22;
			font-family: PingFang SC;
			font-weight: bold;
			color: $fontColorPrice;
			white-space:nowrap;
		}

		image {
			width: 7rpx;
			height: 13rpx;
			margin-left: 9rpx;
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
    .display-felx{
        display: flex;
    }
    .other_bid{
        padding: 30rpx;
    }
    .bottom_bid{
        border-top: 2rpx solid #F0F0F0;
        display: flex;
        justify-content: flex-end;
        padding: 20rpx 20rpx 0;
		&>view{
			padding: 10rpx 20rpx;
            border-radius: 10rpx;
			background: #F7F7F7;
			position: relative;
			margin-left: 20rpx;
			.order_tips{
				position: absolute;
				display: block;
				top: -10rpx;
				right: -10rpx;
				padding:2rpx 8rpx 0;
				border-radius: 40rpx;
				background: #FE6E32;
				color: #FFFFFF;
				font-size: 18rpx;
			}
		}
        text{
            color: #141414;
            font-size: 24rpx;
            font-family: PingFang-SC;
        }
		.marginPadding{
			margin-right: 20rpx;
		}
    }
</style>
