<style lang="scss" scoped>
	.nav-bar-right {
		image {
			width: 36rpx;
			height: 36rpx;
			margin-right: 28rpx;
		}
	}

	.mihuo-order-information-page {
		background-color: #fff;
		margin: 0rpx 0rpx 10rpx 0rpx;
		border-radius: 10rpx;
		padding: 32rpx 28rpx 20rpx 28rpx;
		min-height: 196rpx;

		.item-project-name {
			font-size: $middleFontSize;
			color: $seconFontColor;
			font-weight: bold;
		}

		.item-address {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-top: 14rpx;

			.item-left {
				display: flex;
				align-items: flex-start;

				.address-text {
					font-size: $smiddleFontSize;
					max-width: 470rpx;
					color: $seconFontColor;
				}
			}

		}

		.item-phone {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 16rpx;

			.item-left {
				.name {
					color: $viceFontColor;
					font-size: $smiddleFontSize;
					margin-right: 4rpx;
				}

				.phone {
					color: $seconFontColor;
					font-size: $middleFontSize;
				}
			}

		}

		.item-left {
			display: flex;
			align-items: center;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 6rpx;
			}
		}

		.item-right {
			display: flex;
			flex-direction: row;
			align-items: center;
			white-space: nowrap;

			image {
				width: 24rpx;
				height: 28rpx;
				margin-right: 4rpx;
			}

			.item-text {
				color: $viceFontColor;
				font-size: $smallFontSize;
			}
		}
	}

	.quick-billing-details {
		padding-bottom: 100rpx;
	}

	.order-list-contain {
		margin-top: 10rpx;
		border-radius: 10rpx;

		.order-list {

			margin-bottom: 16rpx;
		}

		.mulation-quote-list {
			.order-title-type {
				background-color: #fff;
				padding: 20rpx 20rpx 0rpx 20rpx;
			}

			.mulation-quote-information {
				display: flex;
				flex-direction: column;
				padding: 16rpx 40rpx 26rpx 40rpx;



				.top {
					display: flex;

					.item-left {
						position: relative;
						margin-right: 24rpx;

						.item-type {
							position: absolute;
							z-index: 1;
							left: 0rpx;
							top: 0rpx;
							padding: 3rpx 13rpx;
							background-color: $themeColor;
							border-radius: 10rpx 0rpx 20rpx;
							text-align: center;

							.item-node-text {
								transform: scale(0.85);
								font-size: 24rpx;
								color: #fff;
							}
						}

					}

					.item-right {
						width: 100%;
						display: flex;
						justify-content: center;
						flex-direction: column;
					}

					.public-between {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 12rpx;

						.item-name {
							color: #303133;
							font-size: 28rpx;
							font-weight: bold;
							line-height: 38rpx;

						}

						.item-price {
							color: #303133;
							font-size: 24rpx;
						}

						.item-attr {
							font-size: 24rpx;
							color: #909199;
							line-height: 32rpx;
							// margin-bottom: 26rpx;
						}

						.item-unit {
							color: #303133;
							font-size: 26rpx;
							line-height: 36rpx;
						}
					}
				}

				.bottom {
					display: flex;
					justify-content: flex-end;
					margin-top: 18rpx;

					.item-label {
						color: #303133;
						font-size: 28rpx;
						margin-right: 20rpx;
					}

					.item-value {
						color: #FF5D35;
						font-size: 30rpx;
						font-weight: bold;
					}
				}
			}
		}

		.item-top {
			padding: 30rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx dashed #EEEEEE;
			background-color: #fff;
			border-radius: 10rpx 10rpx 0rpx 0rpx;
			justify-content: space-between;

			.item-name {
				margin-left: 10rpx;
				color: #303133;
				font-size: 30rpx;
			}

			.item-name_warring {
				color: #FF5D35;
				font-size: 28rpx;
			}

			.item-name_success {
				color: #319D75;
				font-size: 28rpx;
			}
		}

		.master-order {
			margin-bottom: 2rpx;
		}

		.order-list-all {
			margin-bottom: 20rpx;
			background-color: #fff;

		}

		.mulation-quote {
			padding: 20rpx;
		}

	}
</style>

<template>
	<view class="quick-billing-details">
		<view class="order-list-contain">
			<view class="mihuo-order-information-page">
				<view class="item-project-name" v-if="receiverDetails.address">
					{{receiverDetails.address}}
				</view>
				<view class="item-address">
					<view class="item-left" v-if="receiverDetails && receiverDetails.receiverPoiName">
						<image src="/static/images/icon-address/weizhi.png" mode=""></image>
						<view class="address-text">{{receiverDetails.receiverPoiName}}</view>
					</view>
					<view class="item-right" @click="navigation"
						v-if="receiverDetails && receiverDetails.receiverLatitude">
						<image src="/static/images/icon-address/address-1.png" mode=""></image>
						<view class="item-text">导航</view>
					</view>
				</view>
				<view class="item-phone">
					<view class="item-left" v-if="receiverDetails.receiverName">
						<image src="/static/images/icon-phone/call-1.png" mode=""></image>
						<text class="name">{{receiverDetails.receiverName}}</text>
						<text
							class="phone">{{receiverDetails.receiverPhone?receiverDetails.receiverPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'):''}}</text>
					</view>
					<view class="item-right" v-if="receiverDetails.receiverName"
						@click="callPhone(receiverDetails.receiverPhone)">
						<image src="/static/images/icon-phone/call.png" mode=""></image>
						<text class="item-text">电话</text>
					</view>
				</view>
			</view>


			<view class="order-list mulation-quote-list">
				<view class="c" v-for="(item,index) in orderList" :key="index">
					<view class="item-top">
						<view class="item-top_left">
							<u-avatar v-if="item.company" class="icon-image"
								:src="$util.thumbnailImage(item.company.companyLogo,true)" size="40">
							</u-avatar>
							<text v-if="item.company" class="item-name">{{item.company.companyShortName}}</text>
							<u-avatar v-if="item.cityOperator" class="icon-image"
								:src="$util.thumbnailImage(item.cityOperator.operatorLogo,true)" size="40">
							</u-avatar>
							<text v-if="item.cityOperator" class="item-name">{{item.cityOperator.shortName}}</text>
						</view>
						<view class="item-top_right">
							<text class="item-name_warring" v-if="item.status == 0">待付款</text>
							<text class="item-name_success" v-if="item.status !== 0">已付款</text>
						</view>
					</view>
					<view class="master-order" v-for="(item1,index1) in item.orderItemList" :key="index1">
						<view class="order-list-all">
							<view class="mulation-quote-information">
								<view class="top">
									<view class="item-left">
										<view class="item-type" v-if="item1.customProductCategoryName">
											<view class="item-node-text">
												{{item1.customProductCategoryName}}
											</view>
										</view>
										<u-lazy-load class="item-image" height="176" :style="{ width: '176rpx' }"
											@click="preview($util.thumbnailImage(item1.productPic,false))"
											imgMode="aspectFill" border-radius="10"
											:image="$util.thumbnailImage(item1.productPic,true)">
										</u-lazy-load>
									</view>
									<view class="item-right">
										<view class="public-between">
											<text class="item-name">{{item1.productName}}</text>
											<text class="item-price">￥{{item1.productPrice}}</text>
										</view>
										<view class="public-between">
											<text class="item-attr">{{item1.productAttrValue}}</text>
										</view>
										<view class="public-between">
											<text class="item-unit">￥{{item1.productPrice}}/{{item1.productUnit}}</text>
											<text class="item-unit">x{{item1.productQuantity}}</text>
										</view>
									</view>
								</view>
								<view class="bottom">
									<text class="item-label">总价</text>
									<text class="item-value">￥{{item1.totalAmount}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		data() {
			return {
				option: {},
				receiverDetails: {},
				addressDetails: {},
				orderList: []
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {
			this.getOrderPage()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			setOrderType(item) {
				switch (item.orderType) {
					case 0:
						return '商品'
					case 1:
						return `${item.skillName}服务`
					case 2:
						// return '协作'
						return `${item.skillName}服务`
				}
			},
			getOrderPage() {
				this.$httpApi.selectMallOrderPage({
					quoteId: this.option.detailId,
					size: 90
				}).then(res => {
					if (res) {
						// this.list = res.records
						res.records.forEach(item => {
							this.receiverDetails['receiverName'] = item.receiverName
							this.receiverDetails['receiverPhone'] = item.receiverPhone
							this.receiverDetails['address'] = item.receiverProvince + item
								.receiverCity + item
								.receiverRegion + item.receiverLatAddress
							this.receiverDetails['receiverPoiName'] = item.receiverPoiName
							this.receiverDetails['receiverLatitude'] = item.receiverLatitude
							this.receiverDetails['receiverLongitude'] = item.receiverLongitude

							item.orderItemList.forEach(item2 => {
								if (this.$isJSON(item2.productAttr)) {
									item2.productAttr = JSON.parse(item2.productAttr)
									item2.productAttrValue = item2.productAttr[0] && item2
										.productAttr[0].value
								}
							})
						})
						this.orderList = res.records
					}
				})
			},
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			navigation() {
				let {
					receiverLatitude,
					receiverLongitude
				} = this.receiverDetails
				if (receiverLatitude === null && receiverLongitude === null) {
					this.$util.toast('当前项目未维护地址信息, 请维护地址后重试')
					return
				}
				if (receiverLatitude === 0 && receiverLongitude === 0) {
					this.$util.toast('当前项目未维护地址信息, 请维护地址后重试')
					return
				}
				// 获取位置的经纬度
				uni.openLocation({
					latitude: parseFloat(receiverLatitude),
					longitude: parseFloat(receiverLongitude),
					scale: 15
				})
			},
			preview(url) {
				uni.previewImage({
					urls: [url],
				})
			}
		}
	}
</script>
