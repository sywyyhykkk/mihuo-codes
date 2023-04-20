<template>
	<view class="payment-contain">
		<view class="payment-qr-code" :class="[option.pageType ? 'payment-qr-code-no':'']">
			<view class="item-code">
				<view class="item-title">
					{{option.pageType ? '微信':''}}扫一扫，{{option.pageType ? '查看详情':'向我付款'}}
				</view>
				<view class="item-code-contain" v-if="!wxCode">
					<view class="item-code-contain-all" v-if="payInfoCodeShow && payInfoCode" :key="payInfoCodeKey">
						<uqrcode ref="qrcode" canvas-id="qrcode" :size="uQrcodeSize" :value="payInfoCode"></uqrcode>
					</view>
				</view>
				<image v-else class="item-code-contain" :src="wxCode" @longtap="saveCode">
				</image>
				<view class="item-button" v-if="orderStatusShow && !option.pageType ">
					<view class="item-left">
						<view class="item-pay-list" v-for="(item ,index) in setPaymentMethodList" :key="index">
							<image :src="item.image" class="balance"></image>
							<text>{{item.name}}</text>
						</view>
					</view>
					<view class="item-right" @click="getReplace()">
						<text>更换</text>
						<u-icon name="arrow-down" color="#C0C0C0" size="24"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	// import UQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.vue'
	import {
		mapState,
	} from 'vuex'
	import baseConfig from '@/config/common.js'
	export default {
		data() {
			return {
				option: {},
				paymentMethodList: [{
					name: '支付宝支付',
					image: '/static/images/order_details/large_ali.png',
					value: 4
				}, {
					name: '微信支付',
					image: '/static/images/order_details/large_wx.png',
					value: 1
				}],
				codeUrl: '',
				pageList: [{
					name: '快速开单',
					url: 'pages-mall/submitOrder/submitOrder'
				}, {
					name: '预付款',
					url: 'pages-order/orderDetails'
				}],
				payInfoCodeShow: false,
				payInfoCodeKey: 0,
				payInfoCode: '',
				orderStatus: '',
				wxCode: '',
				wxCodeData: '',
				orderStatusShow: true,
				timer: null,
				uQrcodeSize: 225,
				payMethod: '' // 支付方式：1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额。
			}
		},
		computed: {
			...mapState(['orderInfo', 'shoppingCart']),
			setPaymentMethodList() {
				return this.paymentMethodList.filter(item => item.value == this.payMethod)
			}
		},
		mounted() {

		},
		onShow() {
			this.setTiming()
			this.setuQrcodeSize()
			if (this.option.pageType) {
				uni.setNavigationBarTitle({
					title: '扫码查看'
				})
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getCode()
		},
		onUnload() {

		},
		methods: {
			setuQrcodeSize() {
				// #ifdef APP-PLUS
				let tempPx = uni.upx2px(450); // 450rpx
				let device = uni.getSystemInfoSync();
				let width = device.windowWidth;
				let wid = width / 375;
				this.uQrcodeSize = 225 * wid
				// #endif
			},
			setParameter() {
				this.payMethod = this.option.payType
			},
			getReplace() {
				if (this.option.pageType) { // 快速开单
					if (this.payMethod == 1) {
						this.payMethod = 4
						this.wxCode = ''
						this.payInfoCode =
							`/pages-mall/submitOrder/submitOrder?id=${this.option.detailId}&shareType=2`
						this.payInfoCodeShow = true
						this.payInfoCodeKey++
					} else {
						this.payMethod = 1
						if (this.wxCodeData) {
							this.wxCode = this.wxCodeData
						} else {
							this.getWxMaQrcode()
						}
					}
				} else {
					if (this.payMethod == 1) {
						this.payMethod = 4
					} else {
						this.payMethod = 1
					}
					this.getCode()
				}
			},
			getCode() {
				if (this.option.pageType) {
					if (this.option.payType == 1) {
						this.getWxMaQrcode()
					} else {
						this.payInfoCode =
							`/pages-mall/submitOrder/submitOrder?id=${this.option.detailId}&shareType=2`
						this.payInfoCodeShow = true
						this.payInfoCodeKey++
					}
					return
				}
				let orderIds = JSON.parse(this.option.orderId)
				this.$httpApi.carOrderPay({
					orderIds: orderIds,
					payMethod: this.payMethod,
					bizType: 90
				}).then(res => {
					if (res) {
						this.payInfoCodeKey++
						this.payInfoCodeShow = true
						this.payInfoCode = res.payInfo
						this.$forceUpdate()
					}
				})
			},
			getWxMaQrcode() {
				if (!this.option.detailId) {
					return
				}
				let page = this.pageList.find(item => item.name == this.option.pageType)
				let url = page?.url
				let scene = this.option.pageType == '预付款' ? this.option.detailId :
					`id=${this.option.detailId}&shareType=1`
				this.$httpApi.getWxMaQrcode({
					clientId: 'cmini', // 觅活应用Id
					page: url, //  页面 page
					scene: scene,
					envVersion: baseConfig.envVersion,
					type: 'MINI' // 账号类型
				}).then(res => {
				 if (res) {
						this.wxCodeData = 'data:image/png;base64,' + res
						this.wxCode = this.wxCodeData
					}
				})
			},
			setTiming() {
				if (this.option.pageType) {
					return
				}
				this.getDetails()
			},
			getDetails() {
				let orderIds = JSON.parse(this.option.orderId)
				if (!orderIds[0]) {
					return
				}
				this.$httpApi.statusByOrder({
					orderId: orderIds[0]
				}).then(res => {
					if (res) {
						if (Number(res) > 0) {
							this.orderStatusShow = false
							uni.setNavigationBarTitle({
								title: '已支付'
							})
						}
					}
				})
			},
			saveCode() {
				this.saveBaseImgFile()
			},
			sheet() {
				uni.showActionSheet({
					title: "请选择",
					itemList: this.setUploadType,
					success: (res) => {
						let typeName = this.uploadType[res.tapIndex]
						switch (typeName) {
							case '保存到相册':
								this.saveBaseImgFile()
								break
								// case '分享到微信':
								// 	break
						}
					}
				})
			},
			saveBaseImgFile() {
				let base64 = this.wxCode;
				const bitmap = new plus.nativeObj.Bitmap("base64");
				bitmap.loadBase64Data(base64, function() {
					const url = "_doc/" + new Date().getTime() + ".png";
					bitmap.save(url, {
						overwrite: true, // 是否覆盖
						// quality: 'quality'  // 图片清晰度
					}, (i) => {
						uni.saveImageToPhotosAlbum({
							filePath: url,
							success: function() {
								uni.showToast({
									title: '图片保存成功',
									icon: 'none'
								})
								bitmap.clear()
							}
						});
					}, (e) => {
						console.log('saveHeadImgFile', url)
						uni.showToast({
							title: '图片保存失败',
							icon: 'none'
						})
						bitmap.clear()
					});
				}, (e) => {
					uni.showToast({
						title: '图片保存失败',
						icon: 'none'
					})
					bitmap.clear()
				});
			}
		}
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #646C93;



	}
</style>

<style lang="scss" scoped>
	.balance {
		width: 40rpx;
		height: 40rpx;
	}

	.payment-contain {
		height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	/* @import url(); 引入css类 */
	.payment-qr-code {
		width: 628rpx;
		height: 786rpx;
		border-radius: 30rpx;
		background: #FFFFFF;
		margin-top: -280rpx;

		.item-title {
			padding: 56rpx 0rpx 46rpx 0rpx;
			text-align: center;
			color: #303133;
			font-size: 32rpx;
		}

		.item-code-contain {
			border-radius: 5px;
			background: #D8D8D8;
			margin: 0 auto;
			width: 450rpx;
			height: 450rpx;

			.item-code-contain-all {}

		}

		.item-button {
			display: flex;
			justify-content: space-between;
			padding: 0 46rpx;
			margin-top: 58rpx;

			.item-left {

				.item-pay-list {
					display: flex;
					align-items: center;
				}

				text {
					margin-left: 10rpx;
					color: #333333;
					font-size: 30rpx;
				}
			}

			.item-right {
				display: flex;
				align-items: center;

				text {
					margin-right: 10rpx;
					color: #909199;
					font-size: 26rpx;
				}
			}
		}

	}

	.payment-qr-code-no {
		height: 700rpx;
	}
</style>
