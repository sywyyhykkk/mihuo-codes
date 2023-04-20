<template>
	<view class="order-page">
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="order-management">
			<view class="order-top">
			</view>
			<view class="order-classification">
				<mihuo-button-group leftButton="我发布的" rightButton="我接受的" @click="changeTab"></mihuo-button-group>
				<view class="order-status-list">
					<view v-show="tabIndex === 0" v-for="(item,index) in myPublishOrder" :key="index" class="order-middle-image">
						<view class="item-contain">
							<text class="item-grouping-title">{{item.title}}</text>
							<view class="item-grouping-contain">
								<view class="item-grouping" v-for="(el,num) in item.orderList" :key="index">
									<text class="release-num" v-show="el.num">{{el.num}}</text>
									<u-image width="96rpx" height="96rpx" class="image-icon" @click="getOrderStatus(el)"
										:src="el.image">
									</u-image>
									<text class="item-text receivee-text">{{el.text}}</text>
								</view>
							</view>
						</view>
					</view>
					<view v-show="tabIndex === 1" v-for="(item,index) in myReceiveOrder" :key="index" class="order-middle-image">
						<view class="item-contain">
							<text class="item-grouping-title">{{item.title}}</text>
							<view class="item-grouping-contain">
								<view class="item-grouping" v-for="(el,num) in item.orderList" :key="index">
									<text class="release-num" v-show="el.num">{{el.num}}</text>
									<u-image width="96rpx" height="96rpx" class="image-icon" @click="getOrderStatus(el)"
										:src="el.image">
									</u-image>
									<text class="item-text receivee-text">{{el.text}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<z-navigation @middleButtonClick="showArchPopup" />
			<arch-popup :list="$tabBarList.tabBarList" v-model="archShow"></arch-popup>
		</view>
	</view>
</template>

<script>
	import {
		certification
	} from "@/plugins/utils.js"
	export default {
		data() {
			return {
				archShow: false,
				tabIndex: 0,
				myPublishOrder: [{
						title: '施工前',
						orderList: [{
								value: 2,
								text: '待报价',
								num: '',
								image: '/static/images/order_status_receive/icon_0.png',
								index: 0,
							},
							{
								value: 3,
								text: '待确认',
								num: '',
								image: '/static/images/order_status_receive/icon_1.png',
								index: 1,
							},
							{
								value: 4,
								text: '待付款',
								num: '',
								image: '/static/images/order_status_receive/icon_2.png',
								index: 2,
							},
						]
					},
					{
						title: '施工中',
						orderList: [{
								value: 5,
								text: '待开工',
								num: '',
								image: '/static/images/order_status_receive/icon_3.png',
								index: 3,
							},
							{
								value: 6,
								text: '开工中',
								num: '',
								image: '/static/images/order_status_receive/icon_4.png',
								index: 4,
							},
							{
								value: 7,
								text: '待验收',
								num: '',
								image: '/static/images/order_status_receive/icon_5.png',
								index: 5,
							},
						]
					},
					{
						title: '施工后',
						orderList: [{
								value: 8,
								text: '待结算',
								num: '',
								image: '/static/images/order_status_receive/icon_6.png',
								index: 6,
							},
							{
								value: 9,
								text: '待确认',
								num: '',
								image: '/static/images/order_status_receive/icon_7.png',
								index: 7,
							},
							{
								value: 10,
								text: '已完成',
								num: '',
								image: '/static/images/order_status_receive/icon_8.png',
								index: 8,
							},
						]
					},
				],
				myReceiveOrder: [{
						title: '施工前',
						orderList: [{
								value: 0,
								text: '已报价',
								num: '',
								image: '/static/images/order_status_release/icon_0.png',
								index: 0,
							},
							{
								value: 2,
								text: '待确认',
								num: '',
								image: '/static/images/order_status_release/icon_1.png',
								index: 1,
							},
							{
								value: 5,
								text: '待开工',
								num: '',
								image: '/static/images/order_status_release/icon_2.png',
								index: 2,
							},
						]
					},
					{
						title: '施工中',
						orderList: [{
								value: 8,
								text: '待结算',
								num: '',
								image: '/static/images/order_status_release/icon_3.png',
								index: 3,
							},
							{
								value: 6,
								text: '开工中',
								num: '',
								image: '/static/images/order_status_release/icon_4.png',
								index: 4,
							},
							{
								value: 7,
								text: '待验收',
								num: '',
								image: '/static/images/order_status_release/icon_5.png',
								index: 5,
							},
						]
					},
					{
						title: '施工后',
						orderList: [{
								value: 11,
								text: '待售后',
								num: '',
								image: '/static/images/order_status_release/icon_6.png',
								index: 6,
							},
							{
								value: 9,
								text: '待评价',
								num: '',
								image: '/static/images/order_status_release/icon_7.png',
								index: 7,
							},
							{
								value: 10,
								text: '已完成',
								num: '',
								image: '/static/images/order_status_release/icon_8.png',
								index: 8,
							},
						]
					},
				],
			}
		},
		onLoad(option) {
			//uni.hideTabBar();
			this.getPublish()
		},
		onShow() {
			//uni.hideTabBar();
		},
		methods: {
			getOrderListType(index) {
				this.tabIndex = index
			},
			changeTab(index) {
				this.tabIndex = index
			},
			showArchPopup() {
				this.archShow = !this.archShow;
			},
			getPublish() {
				this.$http.get(`order/biz_order/self/publish/index`).then(res => {
					uni.setStorageSync('publishOrderStatusList', res);
					res.map(el => {
						this.myPublishOrder.map(item => {
							item.orderList.map(ev => {
								if (el.key === ev.value && el.value !== '0') {
									ev.num = el.value
								}
							})
						})
					})
					this.getReceive()
				});
			},
			getReceive() {
				this.$http.get(`order/biz_order/self/receive/index`).then(res => {
					uni.setStorageSync('receivehOrderStatusList', res);
					res.map(el => {
						this.myReceiveOrder.map(item => {
							item.orderList.map(ev => {
								if (el.key === ev.value && el.value !== '0') {
									ev.num = el.value
								}
							})
						})
					})
				});
			},
			getOrderStatus(item) {
				let tempStr = this.tabIndex === 0 ? '发布' : '接受'
				this.toPage(`/pages/order/orderList?TypeName=${tempStr}&orderStatus=${item.value}&orderStatusName=${item.text}&index=${item.index}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-page {
		.order-top {
			height: 122rpx;
			background: linear-gradient(90deg, $themeColor 10%, $themeColor 100%);
			border-radius: 0rpx 0rpx 16rpx 16rpx;
		}

		.order-management {

			.order-classification {
				margin: -60rpx 20rpx 24rpx 20rpx;
				border-radius: 16rpx;
				position: -webkit-sticky;
				position: sticky;
				z-index: 99;
				height: 1166rpx;
				top: 88rpx;
			}


			.order-status-list {
				.order-middle-image {
					position: relative;
					margin-bottom: 10rpx;
					background-color: #FFFFFF;
					border-radius: 16rpx;
					padding: 32rpx 0 38rpx 0;

					&:first-child {
						border-top-left-radius: 0;
						border-top-right-radius: 0;
					}

					.item-contain {
						display: flex;
						flex-direction: column;
					}

					.item-grouping-title {
						padding: 0 0 24rpx 22rpx;
						// margin-bottom: 34rpx;
						margin: 0 36rpx 34rpx 36rpx;
						border-bottom: 2rpx dashed #F4F4F4;
					}

					.item-grouping-contain {
						display: flex;

						.item-grouping {
							position: relative;
							width: 33.3%;
							text-align: center;
						}

						.image-icon {
							margin: 0 auto;
							margin-bottom: 12rpx;
						}
					}

					.release-num {
						position: absolute;
						z-index: 99;
						right: 52rpx;
						display: flex;
						width: 32rpx;
						height: 32rpx;
						font-size: 20rpx;
						color: #FFFFFF;
						align-items: center;
						justify-content: center;
						border-radius: 50%;
						background: linear-gradient(90deg, #FCBF51 -2.99%, #FF9831 97.01%);
					}

					&:nth-child(3n) {
						margin-right: 0rpx;
					}

					.image-icon {
						margin-bottom: 12rpx;
					}

					.item-text {
						font-size: 30rpx;
						color: #606266;

					}
				}
			}
		}
	}
</style>
