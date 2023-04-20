<template>
	<view>
		<view class="tabs-content-header">
			<view class="header-left">
				<view class="type" v-if="dataObj.skillName">{{ dataObj.skillName }}</view>
				<view class="title">{{ dataObj.requirementName }}</view>
			</view>
			<view v-if="dataObj.orderStatus == 15">
				<text :class="'header-right row_'+ dataObj.orderStatus"
					v-if="dataObj.communicateStatus !=1 && dataObj.bidStatus == 0">待沟通</text>
				<text v-if="dataObj.communicateStatus == 1">
					<text :class="'header-right row_'+ dataObj.orderStatus"
						v-if="dataObj.deliveryType != 1 && dataObj.bidStatus == 0">已沟通-待报价</text>
					<text :class="'header-right row_'+ dataObj.orderStatus"
						v-if="dataObj.deliveryType == 1 && dataObj.bidStatus == 0">已沟通-待确认</text>
				</text>
				<text :class="'header-right row_'+ dataObj.orderStatus" v-if="dataObj.bidStatus == 2">待确认</text>
			</view>
			<text v-else
				:class="'header-right row_'+ dataObj.orderStatus">{{ getStatusName(dataObj.orderStatus).name }}</text>
		</view>
		<view class="tabs-content-main">
			<u-icon name="map" color="#808080"></u-icon>
			<view class="address">
				{{ (dataObj.districtName || '') + (dataObj.latAddress || '') + (dataObj.poiName || '') + (dataObj.address || '') }}
			</view>
		</view>
		<view class="tabs-content-footer">
			<view class="upper">
				<view class="footer-left">
					<view v-if="(dataObj.priceWay == 1)">
						<!-- 整数部分 -->
						<text class="price">{{ dataObj.price.toFixed(0) }}</text>
						<!-- 小数部分 -->
						<text class="price" style="font-size: 28rpx;">{{ dataObj.price | priceFormat }}</text>
						<text>元 /一口价</text>
					</view>
					<view v-if="(dataObj.priceWay == 2) && (dataObj.orderStatus < 20)">
						<!-- 整数部分 -->
						<text class="price">{{ item.price.toFixed(0) }}</text>
						<!-- 小数部分 -->
						<text class="price" style="font-size: 28rpx;">{{ dataObj.price | priceFormat }}</text>
						<text>元/竞价模式</text>
					</view>
					<!-- <text v-if="(dataObj.priceWay == 3) && (dataObj.orderStatus == 10)" class="wait-price">待议价</text> -->
					<view v-if="(dataObj.priceWay != 1) && (dataObj.orderStatus >= 20) && dataObj.offerPrice">
						<!-- 整数部分 -->
						<text class="price">{{ dataObj.offerPrice.toFixed(0) }}</text>
						<!-- 小数部分 -->
						<text class="price" style="font-size: 28rpx;">{{ dataObj.offerPrice | priceFormat }}</text>
						<text>元</text>
					</view>
				</view>
				<view class="footer-right">
					<view v-if="dataObj.orderStatus == 20">
						<text class="tips-text">待付</text>
						<text class="people">{{ item.offerPrice }}</text>
						<text class="tips-text">元</text>
					</view>
					<view v-if="dataObj.orderStatus == 10">
						<view v-if="dataObj.priceWay == 2">
							<text class="people">{{ dataObj.competitionCount }}人</text>
							<text class="status">已报价</text>
						</view>
						<text v-else
							class="tips-text">{{Number(dataObj.competitionCount) > 0 && dataObj.bidStatus != 6 && dataObj.bidStatus != 5 ? '已接单' : ''}}</text>
					</view>
				</view>
			</view>
			<view v-if="getLogContent && getLogContent.length">
				<view v-for="(dataObj,index) in getLogContent" :key="index">
					<view v-if="index === 0" class="footer-content">{{ dataObj.title }}</view>
				</view>
			</view>
			<!-- <view class="footer-content" v-if="item.orderStatus != -1">
				{{ getLogContent }}
			</view> -->
		</view>
		<view class="tabs-button" v-if="(dataObj.pendingList && dataObj.pendingList.length) && dataObj.orderStatus!=-1">
			<view class="button-item custom-service" @click.stop="buttonClick('联系客服')" v-if="dataObj.orderStatus==10">
				联系客服
			</view>
			<view class="button-item" @click.stop="buttonClick('联系师傅')"
				v-if="dataObj.orderStatus==15 &&( buttonStatus==1 ||  buttonStatus==99)">
				联系师傅
			</view>
			<view class="button-item confirm" @click.stop="buttonClick('确认报价')"
				v-if="dataObj.orderStatus==15 && buttonStatus == 2">
				{{ dataObj.priceWay == 1?"确认选TA":"确认报价"}}
			</view>
			<view class="button-item confirm" @click.stop="buttonClick('风险确认')" v-if="buttonStatus == 3">
				风险确认
			</view>
			<view class="button-item confirm" @click.stop="buttonClick('变更确认')" v-if="buttonStatus == 5">
				变更确认
			</view>
			<view class="button-item confirm" @click.stop="buttonClick('确认支付')"
				v-if="dataObj.orderStatus==20 && buttonStatus==4">
				确认支付
			</view>
			<view class="button-item confirm" @click.stop="buttonClick('开单支付')" v-if="buttonStatus==8">
				去支付
			</view>
			<view class="button-item confirm" @click.stop="buttonClick('去验收')"
				v-if="dataObj.orderStatus == 35 && buttonStatus == 6">
				去验收
			</view>
			<view class="button-item confirm" @click.stop="buttonClick('去评价')"
				v-if="dataObj.orderStatus == 40 || dataObj.orderStatus == 50">
				去评价
			</view>
		</view>
		<view class="tabs-button" v-if="dataObj.orderStatus==-1">
			<view class="button-item" @click.stop="buttonClick('重新发布')">
				重新发布
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getStatusName
	} from "@/plugins/orderStatus.js";
	export default {
		name: "call-order-item",
		props: ['item', 'show'],
		data() {
			return {
				getStatusName: getStatusName,
				buttonStatus: null,
				contactUserId: '', // 联系师傅userId
				contactUserName: '', // 联系师傅姓名
				masterOrderId: '',
				dataObj: {}
			};
		},
		watch: {
			item: {
				handler(news) {
					if (news) {
						this.dataObj = news;
					}
				},
				immediate: true
			}
		},
		computed: {
			// 获取订单日志
			getLogContent() {
				this.buttonStatus = null;
				if (!this.item.pendingList) return ''
				this.contactUserId = this.item.pendingList[0].userId;
				this.contactUserName = this.item.pendingList[0].userName;
				this.buttonStatus = 99; // 代表联系师傅
				// 存入类型
				let businessCode = this.item.pendingList.map((item) => {
					return item.businessCode //拿出接口的businessCode值
				})
				let sellerBusinessCode = Array.from(new Set(businessCode));
				if (sellerBusinessCode.find((v => v.indexOf('no_order_offer') != -1)) ||
					sellerBusinessCode.find((v => v.indexOf('no_again_order_offer') != -1))) {
					// 抢单，未报价 || 业主不确认报价
					this.buttonStatus = 1;
				}
				if (sellerBusinessCode.find((v => v.indexOf('confirm_order_offer') != -1)) ||
					sellerBusinessCode.find((v => v.indexOf('modify_order_offer') != -1))) {
					// 修改报价 || 未确认报价
					this.buttonStatus = 2;
				}
				/**  待付款条件下 */
				if (this.item.orderStatus >= 20 || this.item.orderStatus < 40) {
					let flag = sellerBusinessCode.find((v => (v.indexOf('no_risk_order_offer') != -1 || v.indexOf(
						'add_risk') != -1)))
					if (flag) {
						// 有风险项
						this.buttonStatus = 3;
					} else {
						// 去支付
						if (sellerBusinessCode.find((v => v.indexOf('no_pay_order_offer') != -1))) {
							this.buttonStatus = 4;
						}
						// 变更
						if (sellerBusinessCode.find(v => v.indexOf('change') != -1)) {
							this.buttonStatus = 5;
						}
						// 待验收
						if (sellerBusinessCode.find((v => v.indexOf('submit_acceptance') != -1))) {
							this.buttonStatus = 6;
						}
						// 开单支付
						if (sellerBusinessCode.find((v => v.indexOf('materialPayment') != -1))) {
							this.buttonStatus = 8;
							let mater = this.item.pendingList[0].businessCode.split('_');
							this.masterOrderId = mater[1];
						}
					}
				}
				if (sellerBusinessCode.find((v => v.indexOf('confirm_acceptance') != -1))) {
					// 待评价
					this.buttonStatus = 7;
				}
				return this.item.pendingList;
			},
		},
		methods: {
			buttonClick(type) {
				switch (type) {
					case '联系客服':
						this.$util.goToWeixin();
						//this.$util.goToChat(this.item.companyId, this.item.companyName, 'constructionOrder', '', 1);
						break
					case '联系师傅':
						// this.$util.goToChat(
						// 	this.contactUserId,
						// 	this.contactUserName,
						// 	"constructionOrder",
						// 	this.item.id
						// )
						if(this.contactUserId){
							this.$httpApi.getPhoneNumber(this.contactUserId)
							.then(res=>{
								if (res){
									uni.makePhoneCall({
										phoneNumber: res
									})
								}
							})
						}
						break
					case '确认报价':
						this.toPage(`/pages-order/callOrderDetails?id=${this.item.id}&autoCheck=confirmOffer`)
						break
					case '风险确认':
						this.toPage(`/pages-order/callOrderDetails?id=${this.item.id}`)
						break
					case '确认支付':
						this.toPage(`/pages-order/callOrderDetails?id=${this.item.id}&autoCheck=pay`)
						break
					case '开单支付':
						if (this.masterOrderId) {
							this.toPage(`/pages-order/orderDetails?id=${this.masterOrderId}`)
						}
						break
					case '变更确认':
						let url = ''
						if (this.item.projectId && this.item.projectId > 0) {
							url = `/pages-findMaster/changeItemList?projectId=${this.item.projectId}`
						} else {
							url = `/pages-findMaster/changeItemList?orderId=${this.item.id}`
						}
						this.toPage(url)
						break
					case '去评价':
						this.toPage(`/pages-findMaster/serviceEvaluation?id=${this.item.id}`)
						break
					case '去验收':
						this.toPage(`/pages-order/acceptance/acceptance-report?id=${this.item.id}&isDo=true`)
						break
					case '重新发布':
						this.toPage(`/pages-order/callOrderDetails?id=${this.item.id}&autoCheck=again`)
						break
					default:
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs-content-header {
		display: flex;
		justify-content: space-between;

		.header-left {
			display: flex;
			align-items: center;
			flex: 1;
			width: calc(100% - 180rpx);

			.type {
				color: #FE6E32;
				font-size: 22rpx;
				border: 1px solid #FE6E32;
				border-radius: 6rpx;
				padding: 0 10rpx;
				flex-shrink: 0;
				margin-right: 20rpx;
				font-family: CKTKingKong;
			}

			.title {
				flex: 1;
				color: #141414;
				font-size: $middleFontSize;
				font-weight: bold;
				font-family: PingFang-SC-Bold;
				@include toe();
			}
		}

		.header-right {
			color: #FE6E32;
			font-size: 22rpx;
			font-weight: bold;
			width: max-content;
			flex-shrink: 0;
			text-align: right;
			font-family: PingFang-SC-Bold;
			margin-left: 20rpx;

			&.row_40 {
				color: #808080;
			}

			&.row_50 {
				color: #808080;
			}

			&.row_51 {
				color: #808080;
			}

			&.row_-1 {
				color: #CACACA;
			}
		}
	}

	.tabs-content-main {
		width: calc(100% - 10rpx);
		display: flex;
		align-items: center;
		padding: 20rpx 0;

		.u-icon {
			margin-right: 10rpx;
		}

		.address {
			color: #808080;
			font-size: $smallFontSize;
			font-family: PingFang-SC-Medium;
			@include toe();
		}
	}

	.tabs-content-footer {
		.upper {
			display: flex;
			justify-content: space-between;

			.footer-left {

				.price {
					color: #FE6E32;
					font-size: 38rpx;
					font-weight: bold;
					font-family: Arial-BoldMT;
				}

				view {
					text {
						color: #141414;
						font-size: 22rpx;
						font-family: PingFang-SC-Medium;
					}
				}

				.wait-price {
					color: #FE6E32;
					font-size: $middleFontSize;
					font-weight: bold;
					margin-right: 10rpx;
					font-family: CKTKingKong;
				}
			}

			.footer-right {
				.people {
					color: #FE6E32;
					font-size: 26rpx;
					font-weight: bold;
					margin: 0 10rpx;
				}

				.status {
					color: #808080;
					font-size: 22rpx;
				}

				.tips-text {
					color: #141414;
					font-size: $smallFontSize;
				}
			}
		}

		.footer-content {
			width: 100%;
			text-align: left;
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #808080;
			line-height: 34rpx;
			margin-top: 10rpx;
		}
	}

	.tabs-button {
		width: 100%;
		// height: 104rpx;
		padding-top: 20rpx;
		margin-top: 10rpx;
		border-top: 2rpx solid #F0F0F0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 20rpx;

		.button-item {
			width: 165rpx;
			height: 64rpx;
			line-height: 64rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #141414;
			text-align: center;
			border: 2rpx solid #141414;
			border-radius: 12rpx;
			margin-left: 20rpx;

			&.confirm {
				background: #FE6E32;
				color: #FFFFFF;
				border: none;
			}

			&.custom-service {
				background: #F7F7F7;
				color: #141414;
				border: none;
			}
		}
	}
</style>
