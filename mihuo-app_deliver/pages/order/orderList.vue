<template>
	<view class="order-page">
		<z-nav-bar :bgColor="['$themeColor','$themeColor']" fontColor="#FFF" :title="title">
			<view v-if="tabIndex == 0" slot="right" class="nav-refresh" @click="navRefresh">
				一键刷新
			</view>
			<view v-if="tabIndex == 1" slot="right" class="nav-refresh" @click="getNavcalendar">
				施工日历
			</view>
		</z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="order-management">
			<view class="order-top">
			</view>
			<view class="order-classification">
				<view class="order-status-list">
					<u-tabs :list="orderStatusList" :show-bar="false" font-size="28" :gutter="60"
						inactive-color="#909299" active-color="$themeColor" :is-scroll="false" :current="currentNew"
						@change="changeStatus">
					</u-tabs>
				</view>
			</view>
			<view v-if="tabIndex == 0" class="order-contain">
				<order-item v-for="(item,index) in releaseList" :formDate="item" :key="index" @orderCancel="orderCancel"
					@toViewOffer="toViewOffer(item)">
				</order-item>
			</view>
			<view v-else-if="tabIndex == 1" class="order-contain">
				<order-item v-for="(item,index) in list" :key="index" :formDate="item" :tabIndex="tabIndex"
					@updateOrderOffer="updateOrderOffer" @orderCancel="orderCancel"
					@toViewOffer="toViewOffer(item)" @communicationIm="communicationIm"></order-item>
			</view>
			<mh-empty v-if="releaseList.length === 0 && tabIndex == 0 " icon="/static/images/no_recommend.png"
				title="您还没有任何任务记录～～" />
			<mh-empty v-if="list.length === 0 &&  tabIndex == 1 " icon="/static/images/no_recommend.png"
				title="您还没有任何任务记录～～" />
		</view>
		<order-cancel-reason v-if="tabIndex == 0" :orderId="orderId" ref="orderCancelReason" @cancelReason="cancelReason">
		</order-cancel-reason>
		<mihuo-protocol v-if="isShowProtocol" protocolType="IM" @hide-modal="hideModal"></mihuo-protocol>
		<u-popup border-radius="30" class="refresh-contain" v-model="refreshShow" mode="center">
			<view class="refresh-title">今日所有订单已刷新</view>
			<view class="refresh-operation" @click="refreshShow = false">确定</view>
		</u-popup>
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
				isShowProtocol: false,
				bidUser: {},
				show: true,
				tabIndex: 0,
				option: {},
				statusIndex: 2,
				title: '',
				buttonList: this.$tabBarList.tabBarList,
				orderId: '',
				orderStatusList: [],
				releaseorderStatus: [{
						value: '',
						name: '全部',
						count: ''
					},
					{
						value: 2,
						name: '待报价',
						count: ''
					},
					{
						value: 3,
						name: '待确认',
						count: ''
					},
					{
						value: 4,
						name: '待付款',
						count: ''
					},
					{
						value: 5,
						name: '待开工',
						count: ''
					},
					{
						value: 6,
						name: '开工中',
						count: ''
					},
					{
						value: 7,
						name: '待验收',
						count: ''
					},
					{
						value: 8,
						name: '待结算',
						count: ''
					},
					{
						value: 11,
						name: '待售后',
						count: ''
					},
					{
						value: 10,
						name: '已完成',
						count: ''
					},
				],
				acceptOrderStatus: [{
						value: '',
						name: '全部',
						count: ''
					},
					{
						value: 0,
						name: '已报价',
						count: ''
					},
					{
						value: 2,
						name: '待确认',
						count: ''
					},
					{
						value: 5,
						name: '待开工',
						count: ''
					},
					{
						value: 8,
						name: '待结算',
						count: ''
					},
					{
						value: 6,
						name: '开工中',
						count: ''
					},
					{
						value: 7,
						name: '待验收',
						count: ''
					},
					{
						value: 11,
						name: '待售后',
						count: ''
					},
					{
						value: 9,
						name: '待评价',
						count: ''
					},
					{
						value: 10,
						name: '已完成',
						count: ''
					},
				],
				currentNew: 2,
				total: 0,
				current: 1,
				selfCurrent: 1,
				selfTotal: 0,
				list: [],
				releaseList: [],
				refreshShow:false,
			}
		},
		onLoad(option) {
			this.option = option
			this.getType()
		},
		onShow() {
			//uni.hideTabBar();
		},
		onReachBottom() {
			if (this.tabIndex) {
				if (this.list.length < this.selfTotal) {
					this.selfCurrent++
					this.getOrderReceive()
				}
			} else {
				if (this.releaseList.length < this.total) {
					this.current++
					this.getOrderPublish()
				}
			}
		},
		onPullDownRefresh: function() {
			if (this.tabIndex) {
				this.getOrderReceive()
			} else {
				this.getOrderPublish()
			}

		},
		methods: {
			getType() {
				this.title = this.option.TypeName === '接受' ? '我接受的订单' : '我发布的订单'
				this.currentNew = Number(this.option.index) + 1
				if (this.option.TypeName === '接受') {
					this.tabIndex = 1
					this.statusIndex = this.option.orderStatus
					let receiveList  = uni.getStorageSync('receivehOrderStatusList');
					this.acceptOrderStatus.map(item =>{
						receiveList.map(el =>{
							if(item.value === Number(el.key)){
								item.count = el.value
							}
						})

					})
					this.orderStatusList = this.acceptOrderStatus
					this.getOrderReceive()
				} else {
					let publishList  = uni.getStorageSync('publishOrderStatusList');
					this.releaseorderStatus.map(item =>{
						publishList.map(el =>{
							if(item.value === Number(el.key)){
								item.count = el.value
							}
						})
					})
					this.orderStatusList = this.releaseorderStatus
					this.tabIndex = 0
					this.statusIndex = this.option.orderStatus
					this.getOrderPublish()
				}
			},
			getOrderPublish() {
				this.$http.get(`order/biz_order/self/publish`, {
					current: this.current,
					orderStatus: this.statusIndex,
					size: 5,
					currentPointId: this.current > 1 ? this.releaseList[this.releaseList.length - 1].id : 0
				}).then(res => {
					let records = this.getImageUrl(res.records)
					this.releaseList = this.current > 0 ? this.releaseList.concat(records) : records
					this.total = res.total
					uni.stopPullDownRefresh()
				});
			},
			getOrderReceive() {
				this.$http.get(`order/biz_order/self/receive`, {
					current: 1,
					orderStatus: this.statusIndex,
					size: 5,
					currentPointId: this.selfCurrent > 1 ? this.list[this.list.length - 1].orderOfferId : 0
				}).then(res => {
					let records = this.getImageUrl(res.records)
					this.list = this.selfCurrent > 0 ? this.list.concat(records) : records
					this.selfTotal = res.total
					uni.stopPullDownRefresh()
				});
			},
			changeStatus(index) {
				this.currentNew = index
				if (this.tabIndex) {
					this.statusIndex = this.acceptOrderStatus[index].value
				} else {
					this.statusIndex = this.releaseorderStatus[index].value
				}
				this.getRefresh()
			},
			cancelReason() {
				if (this.tabIndex) {
					this.selfCurrent = 1
					this.getOrderReceive()
				} else {
					this.current = 1
					this.getOrderPublish()
				}
			},
			getImageUrl(list) {
				let tempList = list
				tempList.map(item => {
					item['attachments'] = item['attachments'] && typeof item['attachments'] == 'string' && JSON
						.parse(item['attachments'])
				})
				tempList.map(item => {
					if (item['attachments'] && item['attachments'].length > 0) {
						if (item['attachmentsCover'] = item['attachments'].filter(el => el && el.type ===
								'img')[0]) {
							item['attachmentsCover'] = item['attachments'].filter(el => el && el.type ===
								'img')[0].fileList
							item['attachmentsCoverNew'] = item['attachmentsCover'] && this.$image.imageGlobal +
								item[
									'attachmentsCover'].replace('/admin/sys-file/mihuo-test/', '')
						}
					}
				})
				return tempList
			},
			getRefresh() {
				this.current = 1
				this.selfCurrent = 1
				this.list = []
				this.releaseList = []
				if (this.tabIndex) {
					this.getOrderReceive()
				} else {
					this.getOrderPublish()
				}
			},
			orderCancel(id) {
				this.orderId = id
				this.$refs.orderCancelReason.open()
			},
			updateOrderOffer(item) {
				this.toPage(`/pages/orderReceiving/orderReceiving?id=${item.id}&typeName=接单`)
			},
			toViewOffer(item) {
				if (this.tabIndex === 1) {
					this.toPage(`/pages/orderReceiving/orderReceiving?id=${item.id}`)
				} else {
					this.toPage(`/pages/orderReceiving/orderReceiving?id=${item.id}&typeName=发单详情`)
				}
			},
			navRefresh(){
				this.$http.put(`order/biz_order/refreshAll`).then(res => {
					this.refreshShow = !this.refreshShow
				});
			},
			getNavcalendar(){
				uni.navigateTo({
					url: '/pages/calendar/calendar'
				});
			},
			communicationIm(item) {
				// this.isShowProtocol = true;
				this.bidUser = item;
				// 这里不需要再同意用户协议了
				this.hideModal(true)
			},
			hideModal(isConfirm) {
				if(!isConfirm){
					return
				}
				// 沟通协议同意 有群id直接跳转 没有则去建群跳转
				console.log(this.orderList.contactName)
				this.isShowProtocol = false;
				if (this.bidUser.groupId) {
					this.$store.commit('WEBSOCKET_GROUP', {
						targetId: this.bidUser.groupId
					});
					console.log(
						`/pages/message/orderChat/orderChat?toUserId=${this.bidUser.groupId}&bidId=${this.bidUser.id}&toUserName=${this.orderList.contactName}的服务群`
					)
					uni.navigateTo({
						url: `/pages/message/orderChat/orderChat?toUserId=${this.bidUser.groupId}&bidId=${this.bidUser.id}&toUserName=${this.orderList.contactName}的服务群`
					})
					return;
				}
				console.log(this.bidUser.id);
				this.$http.post('order/bidorder/createGroup', {
					"customField": "",
					"id": this.bidUser.id,
					"isConfirm": false,
					"name": `${this.orderList.contactName}的服务群`
				}).then(res => {
					console.log(res);
					uni.navigateTo({
						url: `/pages/message/orderChat/orderChat?toUserId=${res.groupId}&bidId=${this.bidUser.id}&toUserName=${this.orderList.contactName}的服务群`
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-line-1 {
		overflow: inherit;
		white-space: inherit;
		text-overflow: inherit;
		margin-right: 40rpx;
	}

	/deep/ .u-badge {
		right:-28rpx !important;
		top: 0 !important;
		background: $themeColor;
		width: 32rpx;
		height: 32rpx;
		line-height: 30rpx;
		border-radius: 50%;
		padding: 20rpx;

	}

	.order-page {
		.nav-refresh{
			font-size: 26rpx;
			color: #FFFFFF;
			margin-right: 34rpx;
		}
		.order-top {
			height: 122rpx;
			background: linear-gradient(90deg, $themeColor 10%, $themeColor 100%);
		}

		.order-management {

			.order-classification {
				margin: -60rpx 20rpx 24rpx 20rpx;
				background-color: #FFFFFF;
				border-radius: 16rpx;
				position: -webkit-sticky;
				position: sticky;
				z-index: 99;
				// top: calc(var(--window-top));
				// top: 160rpx;
				top: 88rpx;

			}

			.order-contain {
				padding-bottom: 2rpx;
			}

			.order-tab {
				display: flex;
				background-color: #EDEDED;
				border-top-right-radius: 20rpx;
				border-top-left-radius: 20rpx;

				.activeTab {
					color: $themeColor;
					background-color: #FFFFFF !important;
					border-top-right-radius: 20rpx;
					transform: .3s;
				}

				.tab-item-release {
					flex: 1;
					font-size: 30rpx;
					padding: 24rpx 114rpx 22rpx 116rpx;
				}

				.tab-item {
					padding: 24rpx 114rpx 22rpx 116rpx;
					flex: 1;
					font-size: 30rpx;
					background-color: #EDEDED;
					border-top-right-radius: 20rpx;
					border-top-left-radius: 20rpx;
				}

			}

			.order-status-list {
				padding: 44rpx 44rpx 52rpx 36rpx;
				// display: flex;
				// overflow-x: auto;

				.orderStatusActive {
					color: $themeColor !important;
				}

				.order-item {
					white-space: nowrap;
					font-size: 28rpx;
					// margin-right: 38rpx;
					color: #909299;

					&:last-child {
						margin-right: 0
					}
				}

			}
		}

		.refresh-contain{

			.refresh-title{
				text-align: center;
				padding: 48rpx 112rpx 44rpx 110rpx;
				border: 2rpx solid #EEEEEE;
				color: #909299;
				font-size: 30rpx;
			}
			.refresh-operation{
				text-align: center;
				font-size: 28rpx;
				padding: 18rpx 0 22rpx 0 ;
				color: $themeColor;
			}
			/deep/ .u-drawer-content{
				background-color: initial !important;
			}
		}
	}
</style>
