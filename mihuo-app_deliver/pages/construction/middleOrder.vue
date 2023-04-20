<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				{{nodeInfo.nodeName}}
			</view>
			<view slot="right" class="nav-bar-right" @click="goServiceTeam">
				服务团队
			</view>
		</z-nav-bar>
		<mihuo-order-information :projectId="projectInfo.projectId"></mihuo-order-information>
		<!-- 节点相关信息	 -->
		<node-information ref="nodeInformation"></node-information>
		<!-- 节点审核信息 -->
		<sop-node-check ref="nodeCheck"></sop-node-check>
		<!-- 手动开始、结束填写的数据 -->
		<sop-operation-detail ref="sopOperationDetail" :iconShow="false"></sop-operation-detail>

		<custom-title title="派单信息"></custom-title>
		<view class="send-info" v-if="offerList && offerList.length === 0">
			<image src="../../static/icon/noData2.png" class="info-data"></image>
			<view class="info-text">你还没有派单哦，快去派单吧</view>
		</view>
		<view v-else>
			<send-info class="send-info" v-if="nodeOrderData.bizOrder" :orderData="nodeOrderData.bizOrder"></send-info>
			<!-- bidStatus 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受4=发单方拒绝 5=发单方取消报价6=接单放取消订单 7=关闭竞价订单 -->
			<view v-if="offerList" class="send-info" v-for="(item, index) in offerList" :key="index">
				<work-people :workerData="item" :bidId="item.bidId" :workerStatus="item.bidStatus === 3 ? 1 : 0"
					:buttonStatus="item.bidStatus" selectTypeName="派单" style="padding: 0; margin-top: 20rpx;"
					:multiple="true" :statisticsType="false" :imType="false" :tagitem="true" :rightIm="true"
					@confirmPerson="confirmPerson">
				</work-people>
			</view>
			<view class="info-text" v-else>暂无已报价的师傅哦~</view>
		</view>

		<!-- 手动开始、手动结束 -->
		<sop-operation ref="sopOperation" :addButtonList="setAddButtonList" @getButton="getButton"></sop-operation>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				nodeOrderData: {}, // node订单信息
				offerList: [], // 已报价/指派人员
			}
		},
		onLoad() {},
		onShow() {
			this.offerList = []
			this.setParameter()
			this.getSendInfo()
			this.getOrderData()
			this.setNodeDetails()
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'remainingDays']),
			// 获取当前node实际人数
			getOfferPeopleLength() {
				let confirmedPeople = 0
				if (this.offerList) {
					this.offerList.forEach(item => {
						if (item.bidStatus === 3) {
							confirmedPeople += 1
						}
					})
				}
				return confirmedPeople
			},
			setAddButtonList() {
				if (this.offerList.length === 0) {
					return [{
						name: '去派单'
					}]
				} else {
					// source 来源：0=无；1=推广渠道 2=订单自动生成的项目
					// 见tfs 26559
					if (this.projectInfo.source == 2) {
						return []
					} else {
						return [{
							name: '加派'
						}]
					}
				}
			}
		},
		methods: {
			setParameter() {

			},
			setNodeDetails() {
				// 刷新节点审核信息
				this.$refs.nodeInformation && this.$refs.nodeInformation.getReviewList()
				
				this.$refs.nodeCheck && this.$refs.nodeCheck.getReviewList()
				// 更新node详情  
				this.$getNodeDetails(() => {
					// 刷新 手动添加的内容
					this.$refs.sopOperationDetail && this.$refs.sopOperationDetail.getDetails()
					// 刷新按钮禁用
					this.$refs.sopOperation && this.$refs.sopOperation.getDetails()
					setTimeout(() => {
						// 刷新按钮显示
						this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
					}, 200)
				})
			},
			getButton(type) {
				this.goSendOrder(type)
			},
			// 确认选择报价人员
			confirmPerson(person, bidId, bidPrice) {
				// 判断当前任务是否指派过给同一人
				for (let item of this.offerList) {
					if (person.personId === item.personId && item.bidStatus === 3) {
						// 当前任务已经指派过给同一人
						this.$util.toast(`当前任务已经指派过给${item.name}~`)
						return
					}
				}
				this.$httpApi.assignByOfferId(bidId).then(res => {
					if (res) {
						this.getSendInfo()
					}
				}).catch(e => {
					console.log(e);
				})
			},
			// 获取报价信息/已指派人员
			getSendInfo() {
				uni.showLoading()
				if (!this.projectInfo.projectId) {
					return
				}
				if (!this.nodeInfo.nodeId) {
					return
				}
				this.$httpApi.getPersonByProjectNode({
					nodeId: this.nodeInfo.nodeId,
					projectId: this.projectInfo.projectId
				}).then(res => {
					if (res) {
						this.offerList = []
						res.forEach(order => {
							if (order.orderOfferList) {
								order.orderOfferList.forEach(offer => {
									let obj = {
										bidPrice: offer.bidPrice,
										bidId: offer.id,
										bidStatus: offer.bidStatus,
										...offer.personInfo
									}
									this.offerList.push(obj)
								})
							}
						})
						uni.hideLoading()
					}
				})
			},
			// 获取订单信息
			getOrderData() {
				if (this.nodeInfo.orderId) {
					this.$httpApi.getOfferPeopleList({
						orderId: this.nodeInfo.orderId
					}).then(res => {
						if (res) {
							this.nodeOrderData = res
						}
					})
				}
			},
			goServiceTeam() {
				uni.navigateTo({
					url: 'assignmentDetail/common/serviceTeam'
				})
			},
			goSendOrder(title) {
				if (title == '去派单') {
					uni.navigateTo({
						url: `/pages/publishTask/orderRelease?pageType=${'去派单'}`
					})
				} else {
					uni.setStorageSync('nodeOrderData', this.offerList.filter(item => item.bidStatus === 3))
					uni.navigateTo({
						url: `/pages/publishTask/orderRelease?pageType=${'加派'}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.send-info {
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 30rpx 30rpx 40rpx 50rpx;
		margin: 0rpx 20rpx 20rpx 20rpx;

		.info-text {
			font-weight: normal;
			font-size: 26rpx;
			line-height: 36rpx;
			text-align: center;
			color: #A9B9DE;
			margin-top: 10rpx;
		}

		.info-data {
			width: 248rpx;
			height: 248rpx;
			margin-top: 60rpx;
			margin-left: calc((100% - 248rpx)/2);
		}
	}

	.nav-bar-right {
		font-size: 28rpx;
		text-align: center;
		color: #909199;
		margin-right: 50rpx;
	}

	.nav-bar-title {
		@include nav-bar-title(#333333)
	}
</style>
