<template>
	<view>
		<view class="display-left" v-if="item.personInfo && item.personInfo.skillId">
			<view class="left_avater display-left">
				<u-avatar class="avatar" size="132" :src="$util.avatarImage(item.personInfo.userId)"
					v-if="item.personInfo" />
				<view class="ident_V">V{{item.personInfo.level}}</view>
			</view>
			<view class="right_info">
				<view class="top">
					<view class="left">
						<text class="name">{{item.personInfo.name}}</text>
						<text class="skill_name">{{item.personInfo.skillName}}</text>
						<image @click="callPhone(item.phone)"
							src="https://www.51mihuo.com/static/icon/work_type/phone.png" class="phone" />
					</view>
				</view>
				<view class="middle display-center">
					<view class="left">
						{{item.personInfo.skillYearNum}}<text
							class="text">工作经验</text>{{item.personInfo.evaluationRate || '100%'}}<text
							class="text">好评</text>
					</view>
					<view class="choice_worker" @click="()=>$emit('orderReceiving')"
						v-if="orderInfo.orderStatus===10&&orderInfo.priceWay===2&&item.bidStatus!==3">
						选TA
					</view>
					<view class="contact_worker" @click.stop="contactMe" v-else>
						<mihuo-image src="https://www.51mihuo.com/static/images/order_details/chat.png" class="chat" />
						联系我
					</view>
				</view>
				<view class="bottom text">专业{{item.personInfo.skillName}}，随叫随到</view>
			</view>
		</view>
		<view class="right">
			<text v-if="orderInfo.orderStatus<30">
				<text v-if="item.bidStatus != 0 && item.bidStatus != 8">
					<text class="mode">报价</text>
					<text class="price">{{item.bidPrice}}</text>元
				</text>
				<text v-if="item.bidStatus == 8">
					<text class="price">谈价中...</text>
				</text>
			</text>
			<text v-if="orderInfo.orderStatus>=30">
				<text class="mode">已确认</text>
				<text class="price">{{item.bidPrice}}</text>元
			</text>
			<view class="margin-re" @click="goTo('拒单')">
				<text class="title">拒单记录</text>
				<text class="badge" v-if="badge.bid_num">{{ badge.bid_num>100?'99+':badge.bid_num}}</text>
			</view>
			<view @click="goTo('报价')">
				<text class="title">报价记录</text>
				<text class="badge" v-if="badge.refuse_num">{{ badge.refuse_num>100?'99+':badge.refuse_num}}</text>
			</view>
		</view>
		<!-- 清单入口确认选报价之后展示-->
		<view class="detailed_list display-center"
			v-if="item.bidStatus !==0  && item.groupPrices && item.groupPrices.length && orderInfo.orderStatus<20">
			<view class="left_list display-left">
				<view class="list_item display-left" v-for="(v,i) in item.groupPrices" :key="i">
					<text class="skill_name-item" v-if="v.businessName">{{v.businessName}}</text>
				</view>
			</view>
			<view class="right_ent display-left" style="letter-spacing: 3rpx;" @click="()=>$emit('orderReceiving')">
				<text class="text">查看清单</text>
				<mihuo-image src="https://www.51mihuo.com/static/images/order_details/orange_right_arrow.png" mode="" />
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
				badge:{
					bid_num:0,	//报价数量
					refuse_num:0,	//拒单数量
				}
			}
		},
		methods: {
			// 联系我
			contactMe() {
				this.masterInfo = this.item;
				this.contactPopup = true
			},
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			goTo(type){
				switch (type) {
					case '拒单':
						this.toPage(`/pages-order/rejectionRecord?userId=${this.item.personInfo && this.item.personInfo.userId}&userName=${this.item.personName}`)
						break;
					case '报价':
						this.toPage(`/pages-order/recordRecord?orderId=${this.item.orderId}&userId=${this.item.personInfo && this.item.personInfo.userId}&userName=${this.item.personName}`)
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
		margin-right: 47rpx;
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
			width: 38rpx;
			line-height: 24rpx;
			background: linear-gradient(90deg, #333333, #666666);
			border-radius: 10rpx 2rpx 10rpx 0rpx;
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

				.phone {
					width: 35rpx;
					height: 35rpx;
					margin-left: 20rpx;
				}
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

		.middle {
			margin-top: 24rpx;

			.left {
				font-size: $smallFontSize;
				font-family: FZGDCTiS;
				font-weight: 500;
				color: $mainFontColor14;

				text {
					margin: 0 8rpx;
				}
			}

			.choice_worker {
				width: 100rpx;
				line-height: 43rpx;
				background: rgba(254, 110, 50, 0.05);
				border: 2rpx solid #FE6E32;
				border-radius: 8rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FE6E32;
				text-align: center;
			}

			.contact_worker {
				font-size: $fontSize22;
				font-family: PingFang SC;
				font-weight: 500;
				color: $mainFontColor14;

				.chat {
					width: 25rpx;
					height: 25rpx;
					display: inline-block;
					margin-right: 11rpx;
				}
			}
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
		margin-top: 30rpx;

		.left_list {
			width: 500rpx;
			overflow: hidden;
			@include toe();

			.list_item {
				margin-right: 20rpx;

				// text {
				// 	width: 115rpx;
				// 	font-size: $fontSize22;
				// 	font-family: PingFang SC;
				// 	font-weight: 500;
				// 	// color: $fontColor00;
				// }
				.skill_name-item {
					background: #FE6E32;
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
</style>
