<template>
	<view class="billing-record-list-page">
		<view class="list-contain" v-for="(item,index) in list" :key="index" @click="getDetails(item)">
			<view class="top">
				<view class="item-left">
					<text class="item-name">{{item.name}}</text>
					<u-icon name="arrow-right" color="#C4C4C4" size="28"></u-icon>
				</view>
				<view class="item-right">
					<text class="item-time">{{item.createTime}}</text>
					<view class="item-arrow" @click.stop="getShow(index)">
						<text>{{item.show ? '收起':'展开'}}</text>
						<image :class="[item.show  ? 'public-block':'public-none']"
							src="/static/images/icon-button.png" class="public-arrow"></image>
					</view>
				</view>
			</view>
			<view v-show="item.show" class="bottom">
				<view class="item-top">
					<view class="city">
						<u-avatar class="icon-image"
							:src="$util.thumbnailImage(item.cityOperator && item.cityOperator.companyLogo)" size="36">
						</u-avatar>
						<text class="short-name">{{item.cityOperator && item.cityOperator.shortName}}</text>
					</view>
					<text class="item-status" :class="setStatusClassName(item.status)">{{setStatusName(item) }}</text>
				</view>
				<view class="item-list">
					<view class="item-contain" v-for="(item1,index1) in item.orderItemList">
						<view class="left">
							<image-lazy-load :image="item1.productPic" :key="index1" height="42">
							</image-lazy-load>
							<text class="name">{{item1.productName}}</text>
						</view>
						<view class="right">
							<text class="price">￥{{item1.payAmount}}</text>
						</view>

					</view>
				</view>
			</view>
			<view v-show="item.show" class="other">
				<text class="tips" :class="[item.status != 0 ? 'tips-wa':'tips-active']">{{item.status != 0 ? '实付款':'需付款'}}</text>
				<text class="total-price">
					<text class="icon">￥</text>
					<text class="price">{{setFloatAdd(item)}}</text>
				</text>
			</view>
		</view>
		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="您还没有记录～～" />
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				list: [],
				list: [],
				pageSize: 20,
				total: 0,
				pages: 0,
				contrast: 0,
				status: 'loadmore',
			}
		},
		computed: {
			...mapState(['orderInfo', 'projectInfo', 'nodeInfo']),

		},
		mounted() {

		},
		onShow() {
			this.getList()
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.option = option
		},
		onReachBottom() { //与methods 同级
			if (this.list.length === Number(this.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pages += 1
				this.getList()
			}
		},
		methods: {
			setFloatAdd(item) {
				let tempRefundAmount = []
				item.orderItemList.forEach(el => {
					if (el.refundStatus == 3) {
						tempRefundAmount.push(el.refundAmount)
					}
				})
				let totalRefundAmount = operation.funCalc(tempRefundAmount)
				return operation.floatSub(item.payAmount, totalRefundAmount)
			},
			/**
			 *@description  订单状态：-1=其他订单 0=待付款；1=待发货；2=已发货(服务中-服务订单)；3待验收-服务订单 4=已完成；
			 * \n 5=待售后，6售后完成，7=（订单未支付，超时自动关闭，或者用户自己关闭）已关闭；8=退款；9=无效订单
			 * */
			setStatusName(item) {
				//orderType 订单类型：0=商品订单；1=服务订单 2-协作订单
				switch (item.status) {
					case 0:
						return '未支付'
					case 1:
						if (item.orderType == 1 || item.orderType == 2) {
							return '待服务'
						} else {
							return '待发货'
						}
						case 2:
							if (item.orderType == 1) {
								return '服务中 '
							} else if (item.orderType == 0) {
								return '已发货'
							} else {
								return '已支付'
							}
							case 3:
								return '待验收'
							case 4:
								return '已完成'
							case 5:
								return '待售后'
							case 6:
								return '售后完成'
							case 7:
								return '交易关闭'
							case 8:
								return '退款'
							case 9:
								return '无效订单'
				}
			},
			setStatusClassName(status) {
				switch (status) {
					case 0:
						return 'item-warning'
					default:
						return 'item-success'
						// break
				}
			},
			getDetails(item) {
				this.toPage(`/pages/construction/clientBilling/recordHistoryDetails?orderId=${item.id}`)
			},
			getShow(index) {
				this.list[index].show = !this.list[index].show
			},
			getList() {
				this.$httpApi.selectMallOrderPage({
					currentCompanyId: this.orderInfo.companyId, // B端-当前企业编号--必填
					projectId: this.projectInfo.projectId,
					sourceType: 4,
					serveProjectId: this.projectInfo.projectId,
					nodeId: uni.getStorageSync('clientBilling') ? this.nodeInfo.nodeId : -1,
					current: this.pages,
					size: this.pageSize,
				}).then(res => {
					uni.hideLoading();
					if (!res) {
						return
					}
					res.records.forEach(item =>{
						item['show'] = false
					})
					this.total = res.total
					if (this.pages > 1) {
						if (this.pages !== this.contrast) {
							this.list = [...this.list, ...res.records]
							this.contrast = this.pages
						}
					} else {
						this.list = res.records
						this.contrast = this.pages
					}
					if (this.list.length === Number(this.total)) {
						this.status = 'nomore'
					}
					if (this.total == 0) {
						this.status = 'nomore'
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.billing-record-list-page {
		padding-top: 20rpx;

		.list-contain {
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			padding: 40rpx 30rpx;
			margin-bottom: 2rpx;
			flex-direction: column;

			.top {
				display: flex;
				justify-content: space-between;
				flex-direction: column;
			}

			.item-left {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item-name {
					color: #303133;
					font-size: 28rpx;
					margin-bottom: 4rpx;
				}
				
			}

			.item-right {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 14rpx;
				
				.item-time {
					color: #B4B6BA;
					font-size: 26rpx;
				}
				
				.item-arrow{
					display: flex;
					align-items: center;
					
					text{
						color: #909199;
						font-size: 24rpx;
					}
					
				}
			
				
			}


			.item-status {
				font-size: 26rpx;
				color: #909199;
			}

			.item-warning {
				color: #FF5D35;
			}
			
			.item-success {
				color: #0EBD8D;
			}

			.bottom {

				.item-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 20rpx;
					
					
					.city{
						
						display: flex;
						align-items: center;
						
						.short-name{
							color: #303133;
							font-size: 26rpx;
							margin-left: 6rpx;
						}
						
					}
					
					
				}

				.item-list {
					margin-top: 20rpx;

					.item-contain {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 26rpx;
						
						&:last-child{
							margin-bottom: 0rpx;
						}
					}

					.left {
						display: flex;
						align-items: center;

						.name {
							color: #606166;
							font-size: 24rpx;
							margin-left: 14rpx;
						}
					}

					.right {
						.price {
							color: #303133;
							font-size: 24rpx;
						}
					}
				}
			}
			
			.other{
				display: flex;
				justify-content: end;
				align-items: center;
				margin-top: 14rpx;
				
				
				.tips{
					font-size: 24rpx;
					margin-right: 6rpx;
					color: #606166;
					font-size: 24rpx;
				}
				
				.tips-wa{
					color: #606166;
					font-size: 24rpx;
				}
				
				.icon{
					color: #FF5D35;
					font-size: 24rpx;
				}
				.price{
					color: #FF5D35;
					font-size: 30rpx;
				}
			}
		}
	}
	
	.public-arrow {
		margin-left: 10rpx;
		width: 28rpx;
		height: 28rpx;
		transform: rotate(90deg)
	}
	
	.public-none {
		transition: all .2s;
		transform: rotate(0deg);
	}
	
	.public-block {
		transition: all .2s;
		transform: rotate(90deg);
	}
	
</style>
