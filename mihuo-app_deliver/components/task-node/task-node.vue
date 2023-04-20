<template>
	<view>
		<view class="order-info">
			<view class="info-item">
				<view class="item-title">{{nodeInfo.nodeName}}</view>
				<view class="item-content" v-if="nodeInfo.status !== 3 "> {{nodeInfo.expectFinishTime}}截止</view>
			</view>
			<view class="pre-node-info" v-if="preNodeInfo">
				<view class="pre-node-info-contain">
					{{preNodeInfo.nodeName + '未完成'}}
				</view>
			</view>
			<view class="info-item2">
				<view class="item-title2">{{nodeInfo.remark}}</view>
				<view class="item-content2">
					{{remainingDays}}
				</view>
			</view>
			<view class="info-item info-other" v-if="pageType=='派单'">
				<view class="item-item">
					<view class="item-worker">所需岗位</view>
					<view class="worker-type">{{nodeInfo.skillName}}</view>
				</view>
				<view class="item-price" v-if="false">期望1000元</view>
			</view>
			<view v-if="pageType=='派单'">
				<view class="info-item info-other item-other">
					<view class="item-item">
						<view class="item-worker">预计人数</view>
						<view class="worker-type">{{nodeInfo.personNumber}}人</view>
					</view>
					<view class="item-item">
						<view class="item-worker">实际人数</view>
						<view class="worker-type">{{ peopleLength }}人</view>
					</view>

				</view>
				<view class="info-item info-other item-other" v-if="false">
					<view class="item-item">
						<view class="item-worker">预计工费</view>
						<view class="worker-type">{{nodeInfo.costs}}元</view>
					</view>
					<view class="item-item">
						<view class="item-worker">实际工费</view>
						<view class="worker-type">0元</view>
					</view>
				</view>
			</view>
			<view v-if="pageType=='验收'">
				<view class="info-item info-other item-other">
					<view class="item-item">
						<view class="item-worker">验收类型</view>
						<view class="worker-type">{{nodeInfo.checkType==1?'施工验收':'工地验收'}}</view>
					</view>

				</view>
				<view class="item-user" v-if="nodeInfo.checkType==1">
					<view class="item-label">
						验收工种
					</view>
					<view class="item-user-other">
						<view class="item-user-list">
							<view class="item-user-contain" v-for="(item,index) in executePersonList" :key="index">
								<u-avatar size="36" :src="$util.thumbnailImage(item.avatar,false)" mode="circle"
									class="portrait">
								</u-avatar>
								<view class="item-other">
									{{item.name}}({{item.skillName}})
								</view>
							</view>
						</view>
						<view class="item-control-contain" v-if="viewShow" >
							<view class="item-control" @click="clickOpen()">
								<text>{{showStatus ? '展开':'收起'}}</text>
								<image :class="[showStatus ? 'public-block':'public-none']" src="/static/images/bottom-icon.png"
									class="public-arrow"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="pageType=='施工'">
				<!-- <view class="item-user" >
					<view class="item-label">执行岗位</view>
					<view class="item-user-list">
						<view class="item-user-contain" v-for="(item,index) in executePersonList">
							<u-avatar size="36" :src="$util.thumbnailImage('',false)" mode="circle" class="portrait">
							</u-avatar>
							<view class="item-other">
								{{item.name}}({{item.skillName}})
							</view>
						</view>
					</view>
				</view> -->
				<view class="item-user">
					<view class="item-label">
						执行岗位
					</view>
					<view class="item-user-other">
						<view class="item-user-list">
							<view class="item-user-contain" v-for="(item,index) in executePersonList" :key="index">
								<u-avatar size="36" :src="$util.thumbnailImage(item.avatar,false)" mode="circle"
									class="portrait">
								</u-avatar>
								<view class="item-other">
									{{item.name}}({{item.skillName}})
								</view>
							</view>
						</view>
						<view class="item-control-contain" v-if="viewShow" >
							<view class="item-control" @click="clickOpen()">
								<text>{{showStatus ? '展开':'收起'}}</text>
								<image :class="[showStatus ? 'public-block':'public-none']" src="/static/images/bottom-icon.png"
									class="public-arrow"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		props: {
			pageType: {
				type: String,
				default: '派单'
			},
			nodeInfo: {
				type: Object,
				default: {}
			},
			// 当前实际已指派人数
			peopleLength: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				executePersonList: [],
				showStatus: false,
				viewShow:false,
				preNodeInfo: ''
			}
		},
		mounted() {
			this.setUser()
			this.getFrontNode()
		},
		computed: {
			...mapState(['orderInfo', 'remainingDays', 'projectInfo'])
		},
		methods: {
			setUser() {
				this.$httpApi.getExecutePerson({
					nodeId: this.nodeInfo.nodeId,
					projectId: this.projectInfo.projectId
				}).then(res => {
					if (res) {
						let tempList = []
						res.map(item => {
							tempList.push({
								skillName: item.skillName,
								avatar: item.avatar,
								name: item.name
							})
						})
						if (tempList.length > 0) {
							this.executePersonList = tempList
							this.resultList = tempList
							
							if (tempList.length > 2) {
								this.showStatus = true
								this.viewShow = true
								this.executePersonList = this.executePersonList.slice(0, 2)
							}else{
								this.viewShow = false
							}
						}
					}
				})
			},
			clickOpen() {
				this.showStatus = !this.showStatus
				if(this.showStatus){
					this.executePersonList = this.resultList.slice(0, 2)
				}else{
					this.executePersonList = this.resultList
				}
			},
			getFrontNode() { // 查询前置节点信息
				if (this.nodeInfo.preNode) {
					this.$httpApi.sopNodeTemplate({
						templateNodeId: this.nodeInfo.preNode,
						projectId: this.projectInfo.projectId
					}).then(res => {
						if (res) {
							// 任务状态： 0=未开始；1=(保留状态，未使用) 2=执行中 3=执行结束（完工）4=异常
							if (res.status < 3) {
								this.preNodeInfo = res
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.public-arrow {
		margin-left: 10rpx;
		width: 16rpx;
		height: 16rpx;
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
	
	.item-label {
		font-size: 28rpx;
		color: $viceFontColor;
	}
	
	.item-user {
		margin-top: 14rpx;
		display: flex;
		padding: 0rpx 10rpx 0rpx 0rpx;
		flex-direction: column;
	
		.item-label {
			min-width: 72rpx;
			margin-right: 12rpx;
		}
	
		.item-user-other {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
		}
	
		.item-user-list {
			display: flex;
			flex-wrap: wrap;
	
			.item-user-contain {
				display: flex;
				align-items: center;
				white-space: nowrap;
				margin-right: 20rpx;
				margin-bottom: 26rpx;
	
				.item-other {
					font-size: $smallFontSize;
					color: $viceFontColor;
					margin-left: 4rpx;
				}
			}
		}
	
		.item-control-contain {
	
	
			.item-control {
				display: flex;
				white-space: nowrap;
				align-items: center;
			}
	
			text {
				color: #909199;
				font-size: 26rpx;
			}
		}
	}


	.order-info {
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 36rpx 28rpx 20rpx 28rpx;
		margin: 20rpx;

		.info-other {
			margin-top: 20rpx;
		}

		.item-other {
			display: flex;
			height: 40rpx;
			justify-content: flex-start !important;
			align-items: center;
		}

		.info-item {
			display: flex;
			justify-content: space-between;
			height: 40rpx;
			align-items: center;

			.item-price {
				font-weight: normal;
				font-size: 24rpx;
				color: #FF5D35;

			}

			.item-item {
				display: flex;
				width: 45%;

				.item-worker {
					font-weight: normal;
					font-size: 28rpx;
					color: #909199;
				}

				.worker-type {
					font-weight: normal;
					font-size: 28rpx;
					color: #333333;
					margin-left: 20rpx;
				}
			}

			.item-title {
				font-weight: bold;
				font-size: 28rpx;
				color: #303133;
			}

			.item-content {
				font-weight: normal;
				font-size: 24rpx;
				color: $themeColor;

			}
		}

		.info-item2 {
			display: flex;
			justify-content: space-between;
			height: 40rpx;
			align-items: center;

			.item-title2 {
				font-weight: bold;
				font-size: 24rpx;
				color: $themeColor;
			}

			.item-content2 {
				font-weight: normal;
				font-size: 24rpx;
				color: #FF5D35;
			}
		}
	}
	
	.pre-node-info {
		max-width: 640rpx;
		@include toe();
	
		.pre-node-info-contain {
			font-size: 22rpx;
			color: #FF5D35;
			background: linear-gradient(90deg, #FCE5E3 0%, rgba(255, 255, 255, 0) 100%);
			border-radius: 4rpx;
			height: 43rpx;
			display: inline-block;
			line-height: 43rpx;
			margin-bottom: 10rpx;
			padding-left: 20rpx;
			margin-top: 15rpx;
			position: relative;
			min-width: 320rpx;
	
			&::before {
				content: '';
				position: absolute;
				z-index: 10;
				width: 0;
				height: 0;
				top: -20rpx;
				width: 0px;
				height: 0px;
				border: 10rpx solid #FFF2E9;
				border-top-color: transparent;
				border-bottom-color: #FFF2E9;
				border-left-color: transparent;
				border-right-color: transparent;
			}
	
		}
	}
</style>
