<template>
	<view class="mihuo-node-information">
		<view class="item-top">
			<view  class="left" v-if="nodeInfo && nodeInfo.nodeName">
				{{nodeInfo.nodeName}}
			</view>
			<view class="right" v-if="nodeInfo && nodeInfo.expectFinishTime && remainingDays">
				{{nodeInfo.expectFinishTime}}截止
			</view>
		</view>
		<view class="pre-node-info" v-if="preNodeInfo && preNodeInfoNodeName">
			<view class="pre-node-info-contain">
				<view class="pre-node-info-text">
					「{{preNodeInfoNodeName}}」{{setRequired}} 未完成
				</view>
			</view>
		</view>
		<view class="item-desc">
			<view class="left" v-if="nodeInfo && nodeInfo.remark">
				<view class=" item-label_desc text-nowarp">
					备注
				</view>
				<text class="item-label_user">{{nodeInfo.remark}}</text>
			</view>
			<view class="right text-nowarp">
				{{remainingDays}}
			</view>
		</view>
		<view class="item-user" v-if="executePersonList">
			<view class="item-label">
				责任人
			</view>
			<view class="item-user-other">
				<view class="item-user-list">
					<view class="item-user-contain" v-for="(item,index) in executePersonList" :key="index">
						<u-avatar size="36" :src="$util.thumbnailImage(item.avatar,false)" mode="circle"
							class="portrait">
						</u-avatar>
						<view class="item-other item-label_user">
							{{item.name}}({{item.skillName}})
						</view>
					</view>
				</view>
				<view class="item-control-contain" v-if="viewShow">
					<view class="item-control" @click="clickOpen()">
						<text>{{showStatus ? '展开':'收起'}}</text>
						<image :class="[showStatus ? 'public-block':'public-none']" src="/static/images/bottom-icon.png"
							class="public-arrow"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 审查 -->
		<view class="item-examine-contian" v-if="examineList.length > 0 && currentExamine && currentExamine.personId">
			<!-- 审查状态 0-待审查 1-审查不通过 2-审查通过 -->
			<!-- 审查方 -->
			<view class="item-audit" v-if="examineType == '审查方'">
				<view class="item-right" v-if="currentExamine && (![1,2].includes(Number(currentExamine.status)))">
					<text class="item-label">
						审核情况
					</text>
					<view class="item-button-contain">
						<view class="item-button item-no" @click="getExamine('审查不通过')">
							不通过
						</view>
						<view class="item-active item-button" @click="getExamine('审查通过')">
							通过
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 催办弹框 -->
		<u-modal v-model="cuiBanShow" width="520" :async-close="true" :mask-close-able="true"
			:show-confirm-button="false" :show-title="false">
			<view class="model-contain">
				<image class="icon-image" src="/static/images/successful_1.png" mode=""></image>
				<view class="text">催办成功</view>
				<view class="text-label">已催办，请耐心等待结果</view>
				<view class="button" @click.stop="getConfirm">知道了</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		name: 'node-information',
		data() {
			return {
				executePersonList: [],
				resultList: [],
				showStatus: false,
				viewShow: false,
				preNodeInfo: '',
				examineList: [],
				currentExamine: {},
				cuiBanShow: false,
				preNodeInfoNodeName: ''

			}
		},
		mounted() {
			this.setUser()
			this.getFrontNode()
			this.getReviewList()
		},
		computed: {
			...mapState(['nodeInfo', 'remainingDays', 'projectInfo', 'userPersonId', 'examineType']),
			getStatus() {
				// 审查状态 0-待审查 1-审查不通过 2-审查通过
				switch (this.currentExamine.status) {
					case 0:
						return ''
					case 1:
						return '审查不通过'
					case 2:
						return '审查通过'
				}
			},
			setCurrentExamineUser() {
				let resultList = this.examineList

			},
			setRequired() {
				if (this.nodeInfo.skipStatus == 1 && this.nodeInfo.status == 1) {
					return '(不可跳过)'
				} else {
					return ''
				}
			}
		},
		methods: {
			setUser() {
				if (!this.nodeInfo.nodeId || !this.projectInfo.projectId) {
					return
				}
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
							} else {
								this.viewShow = false
							}
						}
					}
				})
			},
			getStatusName(status) {
				let tempMap = {
					1: '审查不通过',
					2: '审查通过',
					0: '审查中'
				}
				return tempMap[status] ?? ''
			},
			clickOpen() {
				this.showStatus = !this.showStatus
				if (this.showStatus) {
					this.executePersonList = this.resultList.slice(0, 2)
				} else {
					this.executePersonList = this.resultList
				}
			},
			getFrontNode() { // 查询前置节点信息
				if (this.nodeInfo.preNode) {
					let tempPreNode = this.nodeInfo.preNode
					let nodeIds = this.nodeInfo.preNode.split(',')

					let preNodeInfoNodeNameList = []
					this.preNodeInfoNodeName = ''
					if (this.nodeInfo.preNode.includes(',')) {
						tempPreNode = tempPreNode.split(',')[0]
					}
					if (nodeIds.length > 0) {
						nodeIds.forEach(async el => {
							let temp = await this.setSopNodeTemplate(el)
							this.preNodeInfo = temp
							// 任务状态： 0=未开始；1=(保留状态，未使用) 2=执行中 3=执行结束（完工）4=异常
							if (temp.status < 3 || temp.status == 10) {
								preNodeInfoNodeNameList.push(temp.nodeName)
							}
							this.preNodeInfoNodeName = preNodeInfoNodeNameList.join('、')

							// 有不可跳过的前置节点的时候，点击按钮应弹出需要弹出相应提示 看见 tfs 28172
							this.$store.commit('setPreNodeStatus', this.preNodeInfoNodeName)
						})
					}
				}
			},
			async setSopNodeTemplate(el) {
				let tempPromise = new Promise((resolve, reject) => {
					this.$httpApi.sopNodeTemplate({
						templateNodeId: el,
						projectId: this.projectInfo.projectId
					}).then(res => {
						if (res) {
							resolve(res)
						}
					})
				})
				return tempPromise
			},
			getReviewList() {
				// reviewFlag 0不需要审核 1审核
				// if (this.nodeInfo.reviewFlag) {
				if (!this.nodeInfo.nodeId) {
					return
				}
				this.$httpApi.getReviewList({
					nodeId: this.nodeInfo.nodeId
				}).then(res => {
					if (res) {
						this.examineList = res
						this.currentExamine = this.examineList.find(item => item.personId == this.userPersonId)
						this.$emit('setReviewStatus', this.currentExamine)
					}
				})
				// }
			},
			getExamine(type) {
				// let tempDetails = this.examineList.find(item => item.personId == this.userPersonId)
				this.debounce(() => {
					let tempDetails = this.currentExamine
					if (this.examineType == '审查方') {
						if (tempDetails) {
							if (type == '查看详情') {
								this.toPage(`/pages/construction/examineDetails`)
							} else {
								this.toPage(`/pages/construction/examine?type=${type}&detailsId=${tempDetails.id}`)
							}
						}
					} else if (this.examineType == '发起方') {
						if (type == '催办') {
							this.$httpApi.setUrgeReview({
								reviewId: tempDetails.id
							}).then(res => {
								if (res) {
									this.cuiBanShow = !this.cuiBanShow
								}
							})
						} else {
							this.toPage(`/pages/construction/examineDetails`)
						}
					}
				}, 200)
			},
			getDetails(item) {
				if (item.status == 1) {
					this.toPage(`/pages/construction/examineDetails`)
				}
			},
			getConfirm() {
				this.cuiBanShow = !this.cuiBanShow
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

	.icon-jian {
		width: 16rpx;
		height: 14rpx;
	}
	
	.text-nowarp{
		white-space: nowrap;
	}


	.mihuo-node-information {
		padding: 28rpx 0rpx 12rpx 0rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 10rpx 20rpx;

		.item-top,
		.item-desc {
			display: flex;
			justify-content: space-between;
			padding: 0rpx 28rpx 0rpx 28rpx;
		}

		.item-top {
			.left {
				color: #303133;
				font-size: $middleFontSize;
				font-weight: bold;
			}

			.right {
				color: $themeColor;
				font-size: $smallFontSize;
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
				margin-left: 28rpx;
				line-height: 43rpx;
				padding-left: 20rpx;
				margin-top: 15rpx;
				position: relative;
				min-width: 320rpx;

				// overflow: hidden;
				.pre-node-info-text {
					font-size: 22rpx;
					color: #FF5D35;
					max-width: 600rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

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



		.item-label {
			font-size: $smallFontSize;
			color: $viceFontColor;
		}



		.item-desc {
			margin-top: 10rpx;

			.left {
				display: flex;
				margin-right: 12rpx;
				// align-items: center;
				justify-content: flex-start;

				.item-label {
					min-width: 72rpx;
				}

				text {
					margin-left: 12rpx;
					font-size: $smallFontSize;
					color: $viceFontColor;
				}
			}

			.right {
				font-size: $smallFontSize;
				color: $errorFontColor;
				flex: 1;
			}
		}

		.item-user {
			margin-top: 14rpx;
			display: flex;
			padding: 0rpx 10rpx 0rpx 28rpx;
			flex-direction: column;

			.item-label {
				min-width: 72rpx;
				margin-right: 12rpx;
			}

			.item-user-other {
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;
				padding-right: 28rpx;
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

		.item-examine-contian {
			display: flex;
			align-items: center;
			justify-content: space-between;
			// border-top: 2rpx dashed #EEEEEE;
			// padding: 20rpx 0rpx;
			margin: 0rpx 28rpx;

			.item-examine-all {
				padding-right: 20rpx;

				.item-examine-list {
					margin-right: 10rpx;
				}

				.item-warning-boder {
					border-bottom: 2rpx solid $errorFontColor;
				}
			}

			.item-audit {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-top: 2rpx dashed #EEEEEE;
				padding: 20rpx 0rpx;
				width: 100%;
			}

			.item-label {
				font-size: 24rpx;
				color: $mainFontColor;
			}

			.item-label-view {
				// text-decoration: underline;
			}

			.item-warning {
				color: $errorFontColor;
			}

			.item-right {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex: 1;
				// width: 124rpx;
				// white-space: nowrap;

				.item-button-contain {
					display: flex;
				}

				.item-button {
					border: 2rpx solid $themeColor;
					border-radius: 6rpx;
					height: 54rpx;
					text-align: center;
					line-height: 54rpx;
					font-size: 24rpx;
					margin-right: 20rpx;

					&:last-child {
						margin-right: 0rpx;
					}
				}

				.item-no {
					color: $themeColor;

					width: 112rpx;
				}

				.item-active {
					width: 96rpx;
					background-color: $themeColor;
					color: #fff;
				}
			}

			.view-details {
				display: flex;
				align-items: center;

				text {
					color: $themeColor;
					margin-right: 12rpx;
					font-size: 24rpx;
				}

			}

		}
	}

	.model-contain {
		display: flex;
		justify-content: center;
		flex-direction: column;
		height: 406rpx;
		padding: 0 46rpx;

		image {
			width: 80rpx;
			height: 80rpx;
			margin: 0 auto;
		}

		.text {
			font-weight: 400;
			font-size: $middleFontSize;
			color: #303133;
			margin: 26rpx 0rpx 10rpx 0rpx;
			text-align: center;
		}

		.text-label {
			font-weight: 400;
			font-size: 26rpx;
			color: #606166;
			margin-bottom: 42rpx;
			text-align: center;
		}

		.button {
			background: #E5ECFF;
			border: 1px solid $themeColor;
			color: $themeColor;
			box-sizing: border-box;
			border-radius: 10rpx;
			height: 72rpx;
			width: 216rpx;
			text-align: center;
			line-height: 72rpx;
			font-size: $smallFontSize;
			margin: 0 auto;
		}
	}

	.item-label_user {
		color: #606166 !important;
		font-size: 26rpx !important;
	}

	.item-label_desc {
		letter-spacing: 24rpx;
		font-size: 24rpx;
		color: $mainFontColor;
	}
</style>
