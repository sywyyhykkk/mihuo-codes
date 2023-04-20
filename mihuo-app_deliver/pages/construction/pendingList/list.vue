<template>
	<view class="pending-ist">
		<view v-if="list.length > 0" class="list-contain">
			<view v-for="item in list" :key="item.id" class="notice-content" @click="getTodoItem(item)">
				<view v-if="Number(item.detailStatus) == 0" class="node"></view>
				<view><text class="title">{{ item.skillName }}({{item.userName}}){{ item.title }}</text>
				</view>
				<!-- <view class="date-content">
					类型
				</view> -->
				<view style="margin-top: 14rpx;"><text class="content">{{item.created}}</text></view>
			</view>
		</view>
		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="没有待处理项～～" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				list: [],
				nodeListData: []
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'userRole', 'userPersonInfo']),
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getToDo()
			this.getGroupTask()
		},
		methods: {
			getGroupTask() {
				if (!this.orderInfo.orderId) {
					console.error('订单id不能为空')
					return
				}
				this.$httpApi.selfGroupTask({
					orderId: this.orderInfo.orderId
				}).then((res) => {
					this.nodeListData = []
					if(res.nodes){
						res.nodes.forEach(el=>{
							this.nodeListData.push(el)
						})
					}
					
				})
			},
			getToDo() {
				this.$http.get(`order/bizpending/myPending`, {
					projectId: this.projectInfo.projectId,
					personId: this.userPersonInfo.personId,
					size: 99,
				}).then((res) => {
					if (res) {
						this.list = res.records
					}
				})
			},
			getTodoItem(el) {
				if (!el) {
					return
				}
				if (el.businessCode) {
					let parameter = el.businessCode.split('_')
					if (parameter.length > 0) {
						let typeName = parameter[0]
						let businessId = parameter[1]
						let detailsId = parameter[1]
						if (['disclose', 'discloseNotify', 'check', 'nodeReview', 'custom', 'nodeReviewFail'].includes(
								typeName)) {
							if (typeName == 'custom') {
								this.toPage(
									`/pages/construction/assignForm?toDoType=待办事项&detailId=${el.id}&status=${el.status}&pendingDetailId=${el.pendingDetailId}`
								)
								return
							}
							if (!businessId) {
								return
							}
							if (['nodeReview', 'disclose', 'nodeReviewFail', 'check'].includes(typeName)) {
								businessId = el.businessParams !== '' && JSON.parse(el.businessParams).nodeId || 0
							}
							this.$httpApi.sopNodeTemplate({
								nodeId: businessId
							}).then(res => {
								if (res) {
									this.$store.commit('setNodeInfo', res)
									switch (typeName) {
										case 'disclose':
											this.toPage(
												`/pages/construction/disclosure/viewDisclosureText?toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}&detailsId=${detailsId}`
											)
											break
										case 'discloseNotify':
											this.toPage(
												`/pages/construction/disclosure/viewDisclosureNotice?toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
											)
											break
										case 'check':
											this.$store.commit('setExamineType', '审查方')
											this.$store.commit('setTodo', {
												toDoType: '待办事项',
												bizPendingDetailId: el.pendingDetailId,
											})
											this.toPage(`/pages/construction/middleExternalAccept`)
											break
										case 'nodeReview':
											// 因为收到的待处理项需要跳转到对应的sop节点  见tfs 27794
											this.$store.commit('setExamineType', '审查方')
											let tempNode = this.nodeListData.find(item => item.nodeId ==
												businessId)
											if (tempNode) {
												this.handleAssigenment(tempNode, '审查方')
											} else {
												this.toPage(`/pages/construction/customNodes/customNodesPage`)
											}
											break
										case 'nodeReviewFail':
											// 因为收到的待处理项需要跳转到对应的sop节点  见tfs 27794
											this.$store.commit('setExamineType', '审查方')
											this.$store.commit('setBusinessCode', el.businessCode)
											let tempNodeError = this.nodeListData.find(item => item.nodeId ==
												businessId)
											if (tempNodeError) {
												this.handleAssigenment(tempNodeError, '审查方')
											} else {
												this.toPage(`/pages/construction/customNodes/customNodesPage`)
											}
											break

									}
								}
							})
						} else {
							if (['apply', 'appeal'].includes(typeName)) {
								switch (typeName) {
									case 'apply':
										uni.setStorageSync('typeName', '申请')
										break
									case 'appeal':
										uni.setStorageSync('typeName', '申述')
										break
								}
								this.toPage(
									`/pages/construction/complaint/complaintDetails?id=${businessId}&pageType=发送给我的&toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
								)
							} else if (['acceptanceCorrection', 'inspectCorrection'].includes(typeName)) {
								this.toPage(
									`/pages/construction/rectification/rectificationDetails?id=${businessId}&toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
								)
							}
						}
					}
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.notice-content {
		background: #fff;
		border-radius: 16rpx;
		margin: 20rpx;
		padding: 36rpx;
		position: relative;

		.date-content {
			border-bottom: 2rpx solid $divider;
			padding-bottom: 20rpx;
			margin-top: 3rpx;
			line-height: 100%;
			color: $viceFontColor;
			font-size: 24rpx;
		}

		.node {
			position: absolute;
			top: 49%;
			left: 10rpx;
			width: 10rpx;
			height: 10rpx;
			border-radius: 10rpx;
			background-color: $linghtWarningColor;
		}

		.title {
			color: $seconFontColor;
			font-size: 30rpx;
			flex: 1;
		}

		.content {
			color: $viceFontColor;
			font-size: 26rpx;
		}

		.delete {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
