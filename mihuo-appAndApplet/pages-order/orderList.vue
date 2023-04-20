<template>
	<view class="order-page">
		<z-nav-bar backState="1000" type="fixed">
			<view class="nav-bar" slot="default">我的订单</view>
		</z-nav-bar>
		<view class="order-classification">
			<u-tabs :list="orderTypeList" bgColor="#FFFFFF" :show-bar="false" font-size="28" :gutter="0"
				inactive-color="#909299" active-color="#FF5D35" :is-scroll="false" :current="currentNew"
				@change="changeStatus">
			</u-tabs>
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="mescrollTop" :topbar="false" :down="downOption"
			:up="upOption" @down="downCallback" @up="upCallback">
			<view class="order-list">
				<scroll-view class="order-contain" scroll-y="true" @scrolltolower="scrollToLower"
					v-if="orderList.length != 0">
					<view v-for="(orderEntity, index) in orderList" :key="index">
						<!-- 商城订单 -->
						<!-- 未拆分成多个支付订单 -->
						<order-mh-mall-order v-if="orderEntity.orderType != 3" :orderEntity="orderEntity" @share="shareToWechat" @updateList="changeStatus">
						</order-mh-mall-order>
						<!-- 拆分成多个支付订单 -->
						<order-mh-mall-order-pay v-else :orderEntity="orderEntity" @updateList="changeStatus">
						</order-mh-mall-order-pay>
					</view>
					<view style="margin: 20rpx 0; height: 80rpx;">
						<u-loadmore :status="status" />
					</view>
				</scroll-view>
				<view v-if="orderList.length == 0 && isShowEmpty" style="padding-top: 8rpx;">
					<order-mh-empty icon="https://www.51mihuo.com/static/images/no_recommend.png"
						title="您还没有任何订单记录～～" />
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		getMallStatusName
	} from "@/plugins/orderStatus.js";

	export default {
		data() {
			return {
				mescrollTop: '164',
				isShowPage: false,
				status: 'loadmore',
				tabIndex: 0,
				option: {},
				orderId: '',
				// groupType 0=全部 1=待确认 2=待付款 3=待发货 4=服务中/待验收 5=已完成 6=待拼团 7=退款/售后
				// tfs #25254
				orderTypeList: [{
						value: '0',
						name: '全部',
						count: ''
					},
					{
						value: '2',
						name: '待付款',
						count: ''
					},
					{
						value: '6',
						name: '待拼团',
						count: ''
					},
					{
						value: '3',
						name: '待发货',
						count: ''
					},
					{
						value: '4',
						name: '待收货',
						count: ''
					},
				],
				orderList: [],
				currentNew: 0,
				current: 1,
				orderStatus: 0,
				downOption: {
					auto: false
				},
				upOption: {
					auto: false,
					use: false,
					toTop: {
						src: ''
					},
					textColor: '#D2D2D2'
				},
				isShowEmpty: true,
				shareOrder: {}, // 分享至微信的订单
			}
		},
		onLoad(option) {
			this.option = option
			this.currentNew = Number(option.index) + 1
			this.orderStatus = option.status
			this.changeStatus(this.currentNew)
			// #ifndef H5
			this.mescrollTop = '264'
			// #endif
			uni.$on('shouldUpdateList', () => {
				this.changeStatus(this.currentNew)
			})
		},
		onUnload() {
			uni.$off('shouldUpdateList')
		},
		onShareAppMessage(e) {
			const title = `[仅剩${1}个名额]我${this.shareOrder.totalAmount}元拼了${this.shareOrder.orderItemList[0].productName}`
			const coverImg = this.$util.thumbnailImage(
				this.shareOrder.orderItemList[0].productPic,
				true,
				750
			)
			const path = `/pages-mall/productDetail/productDetail?id=${this.shareOrder.orderItemList[0].productId}`
			const result = this.$util.shareToWechat(
				title,
				coverImg,
				path,
				'商品详情页',
				true,
				1
			)
			return result
		},
		onShow() {
			if(this.orderStatus == '2'){
				// 刷新付款状态
				this.changeStatus(this.currentNew)
			}
		},
		methods: {
			shareToWechat(order){
				this.shareOrder = order
			},
			upCallback() {},
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			downCallback() {
				this.isShowEmpty = false
				this.changeStatus(this.currentNew)
			},
			scrollToLower() {
				if (this.status === 'nomore') return
				this.status = 'loading';
				this.current += 1
				this.getOrderData()
			},
			changeStatus(index) {
				this.current = 1
				if (index != 'child') {
					this.currentNew = index
					this.orderStatus = this.orderTypeList[this.currentNew].value
				}
				// 暂时隐藏全屏加载动画
				// #ifdef APP-PLUS
				uni.setLoadingVisible(false)
				// #endif
				this.getOrderData()
				// 停止重载动画
				setTimeout(() => {
					if (this.orderList.length === 0) {
						this.isShowEmpty = true
					}
					this.mescroll.endBySize(10, true)
					// #ifdef APP-PLUS
					uni.setLoadingVisible(true)
					// #endif
				}, 1000)
			},
			getOrderData() {
				// groupType 0=全部 1=待确认 2=待付款 3=待发货 4=服务中/待验收 5=已完成 6=待评价 7=退款/售后
				// orderType 1=施工订单 2=商城订单
				this.$httpApi.getAllOrder({
					current: this.current,
					size: 10,
					groupType: this.orderStatus,
					longitude: uni.getStorageSync('longitude'),
					latitude: uni.getStorageSync('latitude'),
				}).then(res => {
					this.isShowPage = false
					if (res) {
						if (res.records.length == 0) {
							if (this.current === 1) {
								this.orderList = []
							}
							this.status = 'nomore'
							return
						}
						if (res.records.length == 10) {
							// 有下一页
							this.status = 'loadmore'
						}
						// TFS 29538
						this.orderList = this.current > 1 ? this.orderList.concat(res.records) : res.records
						this.mescroll.endBySize(10, true)
						this.isShowPage = true
						this.isShowEmpty = true
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-page {
		background-color: #F7F7F7;

		.order-classification {
			width: 100vw;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			position: fixed;
		}

		.order-list {
			height: calc(100vh - 60rpx - var(--status-bar-height) - env(safe-area-inset-bottom));

			.order-contain {
				width: 100vw;
				height: calc(100vh - 60rpx - var(--status-bar-height) - env(safe-area-inset-bottom));
				background-color: #F7F7F7;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
