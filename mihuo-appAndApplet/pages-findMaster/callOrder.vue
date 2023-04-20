<template>
	<view class="call">
		<z-nav-bar backState="1000" fontColor="#141414" bgColor="#F5F5F5">
			<view class="nav-bar-title" slot="default">呼叫记录</view>
		</z-nav-bar>
		<view class="call-nav">
			<view class="call-tabs">
				<view class="call-tabs_flex" v-for="(item,index) in tabList" :key="index"
					:class="{buttonClick:curTabs===index}" @click="clickTabs(item,index)">
					<text class="tabs_flex-title">{{ item.tabsName }}</text>
					<!-- <text v-if="item.count" class="tabs_flex-tips"></text> -->
				</view>
			</view>
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="160" :topbar="true" :down="downOption"
			:up="upOption" @down="downCallback" @up="upCallback">
			<scroll-view scroll-y="true" class="scroll-container" @scrolltolower="upCallback">
				<view class="tabs-content" v-for="(item,index) in orderList" :key="index" @click="lookDetail(item)">
					<call-order-item :item="item"></call-order-item>
				</view>
				<mh-empty marginTop="0" style="padding-top:200rpx" v-if="orderList.length === 0 " title="暂无订单～～" />
				<u-loadmore v-else :status="status" />
			</scroll-view>
		</mescroll-uni>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/**
				 * 订单状态
				 * 10：已发布/待确认
				 * 20：已确认/待付款
				 * 30：已付款/服务中
				 * 35：已申请/待验收
				 * 40：待结算
				 * 50：已完成/待评价
				 * 51：已完成/已评价
				 * -1：已取消
				 */
				tabList: [{
						tabsName: '全部订单',
						orderStatus: '',
					},
					{
						tabsName: '待确认',
						orderStatus: 10
					},
					{
						tabsName: '待付款',
						orderStatus: 20
					},
					{
						tabsName: '服务中',
						orderStatus: 30
					},
					{
						tabsName: '待验收',
						orderStatus: 35
					},
				],
				record: [10, 20, 30, 35],
				curTabs: 0,
				pageObj: {
					current: 1,
					pageSize: 10,
					total: 0,
					pages: 0,
				},
				latitude: uni.getStorageSync('latitude') || 0,
				longitude: uni.getStorageSync('longitude') || 0,
				orderList: [],
				status: 'nomore',
				orderStatus: '',
				scrollTop: 0,
				mescroll:null,
				downOption: {
					auto: false
				},
				upOption: {
					auto: false,
					use: false,
					onScroll: true
				},
			}
		},
		onLoad(options) {
			this.getListData();
		},
		onShow() {
			/** 整体页面刷新 */
			uni.$once('refresh', (data) => {
				this.getListData();
			})
		},
		// 滚动到底部加载更多
		// onReachBottom() {
		// 	if (this.orderList.length === Number(this.pageObj.total)) {
		// 		this.status = 'nomore'
		// 		return
		// 	} else {
		// 		this.status = 'loading'
		// 		this.pageObj.pageSize += 10
		// 		setTimeout(() => {
		// 			this.getListData()
		// 		}, 200)
		// 	}
		// },
		methods: {
			upCallback(){
				if (this.orderList.length === Number(this.pageObj.total)) {
					this.status = 'nomore'
					return
				} else {
					this.status = 'loading'
					this.pageObj.pageSize += 10
					setTimeout(() => {
						this.getListData()
					}, 200)
				}
			},
			downCallback() {
				this.getListData()
				setTimeout(() => {
					this.mescroll.endBySize(10, true)
				}, 500)
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			goBackPage() {
				uni.navigateBack();
			},
			clickTabs(tabs, index) {
				this.curTabs = index;
				this.orderStatus = tabs.orderStatus;
				this.getListData(tabs.orderStatus)
			},
			// 获取列表
			getListData() {
				uni.showLoading({
					mask: true
				});
				this.$http.get('order/biz_order/self/publish', {
					current: this.pageObj.current,
					size: this.pageObj.pageSize,
					latitude: this.latitude,
					longitude: this.longitude,
					orderStatus: this.orderStatus,
				}).then(res => {
					this.pageObj.total = res.total;
					this.orderList = res.records;
					// this.orderList.push(...res.records);
					if (this.orderList.length >= res.total) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
				}).finally(() => {
					uni.hideLoading();
				})
			},
			// 判断是否有记录
			isRecord(data) {
				if (this.curTabs == 0) {
					let arr = [];
					if (data && data.length) {
						data.forEach(ele => {
							arr.push(ele.orderStatus)
						});
					}
					this.record = Array.from(new Set(arr))
				}
			},
			/**
			 * 价格计算
			 * @total 总价
			 * @paidAmount 已收款金额
			 */
			priceCalc(total, paidAmount) {
				let num = (Number(total) || 0) - (Number(paidAmount) || 0)
				return Number(num.toFixed(2))
			},
			// 详情
			lookDetail(data) {
				this.toPage('/pages-order/callOrderDetails?id=' + data.id)
			},
		}
	}
</script>
<style lang="scss">
	page {
		background: #F5F5F5;
	}
</style>
<style scoped lang="scss">
	.call {
		padding: 0 30rpx;
		box-sizing: border-box;
		// height: 100vh;
		overflow: scroll;
		width: 100%;
		background: #F5F5F5;

		.nav-bar-title {
			font-weight: bold;
			color: #141414;
		}

		.header_icon {
			width: 20px;
			height: 20px;
			margin-left: 20rpx;
		}

		.call-nav {
			width: 690rpx;
			box-sizing: border-box;
			height: 130rpx;
			z-index: 999;

			.call-tabs {
				width: 690rpx;
				background: #F5F5F5;
				position: fixed;
				z-index: 999;
				// top: calc(86rpx + var(--status-bar-height));
				display: flex;
				// justify-content: space-between;
				height: 100rpx;
				line-height: 100rpx;

				.call-tabs_flex {
					flex: 1;
					text-align: center;
					font-family: PingFang-SC-Medium;
					position: relative;

					.tabs_flex-title {
						color: #808080;
						font-size: $fontSize26;
					}

					.tabs_flex-tips {
						width: 10rpx;
						height: 10rpx;
						border-radius: 50%;
						background: #FE6E32;
						display: inline-block;
						position: absolute;
						top: 40rpx;
						right: 15rpx;
					}
				}

				.buttonClick {
					position: relative;

					.tabs_flex-title {
						color: #141414;
					}

					&::before {
						content: '';
						width: 30rpx;
						height: 10rpx;
						border-radius: 10rpx;
						position: absolute;
						bottom: 20rpx;
						left: 50%;
						transform: translateX(-50%);
						background: -webkit-linear-gradient(to right, #FE6E32, #FFFFFF);
						/* Safari 5.1 - 6.0 */
						background: -o-linear-gradient(to right, #FE6E32, #FFFFFF);
						/* Opera 11.1 - 12.0 */
						background: -moz-linear-gradient(to right, #FE6E32, #FFFFFF);
						/* Firefox 3.6 - 15 */
						background: linear-gradient(to right, #FE6E32, #FFFFFF);
						/* 标准的语法（必须放在最后） */
					}
				}
			}
		}

		.tabs-content {
			padding: 30rpx;
			box-sizing: border-box;
			border-radius: 24rpx;
			background: #FFFFFF;
			margin-bottom: 20rpx;
		}
		
		.scroll-container {
			padding: 30rpx;
			height: calc(100vh - var(--status-bar-height) - 88rpx - 50rpx);
		}
	}
	
</style>
