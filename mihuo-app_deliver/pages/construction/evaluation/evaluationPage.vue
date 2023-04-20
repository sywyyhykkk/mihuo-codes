<template>
	<view class="evaluation-form-contain">
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				{{pageTitle}}
			</view>
			<view slot="right" class="nav-bar-right" @click="cutView">
				评价记录
			</view>
		</z-nav-bar>
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<!-- 节点相关信息	 -->
		<node-information ref="nodeInformation"></node-information>
		<!-- 节点审核信息 -->
		<sop-node-check ref="nodeCheck"></sop-node-check>
		<!-- 手动开始、结束填写的内容 -->
		<sop-operation-detail ref="sopOperationDetail" :iconShow="false"></sop-operation-detail>

		<view v-for="(item,index) in orderSendJobList" :key="index">
			<view v-if="!item.replyFlag" class="item-contain">
				<view class="personnel-all">
					<view class="personnel">
						<u-avatar size="120" :src="$util.thumbnailImage(item.avatar,false)" mode="circle">
						</u-avatar>
						<view class="name-text">
							<view class="name">{{item.name}}</view>
							<view class="jobs">{{item.jobName}}</view>
						</view>
					</view>
				</view>
				<view class="body">
					<view class="tab-list">
						<view class="item-tab" v-for="(el,num) in item.tabList" :key="num" @click="getTab(num,index)"
							:class="[el.status === true?'item-tab-active':'']">{{el.label}}</view>
					</view>
					<view class="text-contain">
						<image v-if="imageShow && !item.contents" src="/static/images/icon_edit/editor_1.png" mode="">
						</image>
						<textarea @focus="imageShow = false" confirm-type="send" @blur="imageShow = true"
							v-model="item.contents" placeholder-class="placeholder" class="describe-input"
							maxlength="200" type="textarea" placeholder="从多个角度描写评价，帮助更多有需要的朋友" :border="true" />
					</view>
					<view class="file-contain">
						<custom-file-upload v-model="item.pics"></custom-file-upload>
					</view>
					<view class="bottom">
						<view class="rate-item">
							<mihuo-rate title="按时交付" v-model="item.deliveryScore"></mihuo-rate>
						</view>
						<view class="rate-item">
							<mihuo-rate title="节点完成" v-model="item.nodeScore"></mihuo-rate>
						</view>
						<view class="rate-item">
							<mihuo-rate title="服务态度" v-model="item.serveScore"></mihuo-rate>
						</view>
					</view>
				</view>
				<view class="button-contain iphonex-bottom" v-if="$setNodeSkipStatus('status')">
					<view class="cancel" @click="confirm('取消',item)">取消</view>
					<view class="confirm" @click="confirm('发表评价',item)">发表评价</view>
				</view>
			</view>
		</view>
		<view class="evaluation-item-contain">
			<view class="item" v-for="(item,index) in evaluationLtemList" :key="index">
				<evaluation-item :info="item"></evaluation-item>
			</view>
		</view>
		<u-mask :show="loadingStatus" :duration="400" :zoom="true" :custom-style="{background: 'rgba(0, 0, 0, 0.5)'}">
			<view class="loading-contain">
				<u-loading mode="circle" size="80" :show="loadingStatus"
					color="-webkit-linear-gradient(left, $themeColor 0%, $themeColor 100%)" />
			</view>
		</u-mask>
		<!-- 手动开始、手动结束 -->
		<sop-operation ref="sopOperation"></sop-operation>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	export default {
		data() {
			return {
				key: '',
				option: {},
				imageShow: true,
				loadingStatus: false,
				evaluationLtemList: [],
				orderSendJobList: [],
				originatorUserid: '', // 发起评论人员id
				execPersonAll: [], // 被评论人集合
				jobsName: '',
				pageTitle: '',
				expectFinishTime: '',
				tempPersonIdListNew: [],
				listUser: [],
				projectId: '',
				nodeId: '',
				userPersonId: ''
			}
		},
		onLoad(option) {
			this.option = option
			this.setFieldAssignment()
			this.getUserList()
		},
		onShow() {
			this.setNodeDetails()
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'remainingDays'])
		},
		methods: {
			setFieldAssignment() {
				this.nodeId = this.nodeInfo.nodeId
				this.jobsName = this.nodeInfo.skillName
				this.pageTitle = this.nodeInfo.nodeName || '评价中间页'
				this.expectFinishTime = this.nodeInfo.expectFinishTime
				this.userPersonId = this.userPersonInfo.personId
				this.projectId = this.projectInfo.projectId

			},
			setNodeDetails() {
				// 刷新节点审核信息
				this.$refs.nodeInformation && this.$refs.nodeInformation.getReviewList()
				this.$refs.nodeCheck && this.$refs.nodeCheck.getReviewList()
				// 更新node详情  
				this.$getNodeDetails(() => {
					// 刷新 手动添加的内容
					this.$refs.sopOperationDetail && this.$refs.sopOperationDetail.getDetails()
					this.$refs.sopOperation && this.$refs.sopOperation.getDetails()
					this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
				})
			},
			getUserList() {
				if (!this.projectId) {
					return
				}

				this.$httpApi.bizorderreplyPage({
					projectId: this.projectId,
					nodeId: this.nodeId,
					status: -1
				}).then(res => {
					this.evaluationLtemList = []
					this.orderSendJobList = []
					this.tempPersonIdListNew = []
					if (!res) {
						return
					}
					res.map(item => {
						let tempLabel = item.label !== '' && item.label.split(',')
						let tempLabelList = []
						tempLabel.map(el => {
							tempLabelList.push({
								label: el,
								status: false
							})
						})
						this.orderSendJobList.push({
							contents: '',
							dealPersonId: this.userPersonId, // 进行评论的人员信息
							name: item.name,
							jobName: item.skillName,
							avatar: item.avatar,
							personId: item.personId, // 被评论人id
							projectId: this.projectId, //项目编号
							deliveryScore: 4, // 按时交付分数
							nodeScore: 4, // 按时交付分数
							serveScore: 4, // 服务分数
							pics: '',
							nodeId: this.nodeId, // 任务编号
							labels: [], // 标签
							replyFlag: item.replyFlag,
							tabList: tempLabelList
						})
						if (item.replyFlag) {
							this.evaluationLtemList.push({
								jobName: item.skillName,
								name: item.name,
								avatar: item.avatar,
								...item.orderReply,
								dealRealName: '',
								dealJobName: '',
								dealAvatar: '',
								execPersonId: item.personId,
								labelsList: item.orderReply.labels && item.orderReply.labels.split(
									',')
							})
							this.tempPersonIdListNew.push(item.orderReply.dealPersonId)
						}
					})
					this.getEvaluationPeople()
				})
			},
			getEvaluationPeople() { // 获取评价人信息
				this.tempPersonIdListNew = [...new Set(this.tempPersonIdListNew)]
				if (this.tempPersonIdListNew.length === 0) {
					return
				}
				this.$getPersonIdUser(this.tempPersonIdListNew, (res) => {
					this.listUser = res
					// 初始化人员信息
					this.setInitializeUser()
				})
			},
			setInitializeUser() {
				this.evaluationLtemList.map(item => {
					this.listUser.map(el => {
						item.dealRealName = el.name
						item.dealJobName = el.skillName
						item.dealAvatar = el.avatar
					})
				})
			},
			cutView() {
				this.toPage(`/pages/construction/evaluation/evaluationRecords`)
			},
			getTab(num, index) {
				let tempList = this.orderSendJobList[index]['tabList']
				if (tempList[num].status) {
					tempList[num].status = false
				} else {
					tempList[num].status = true
				}
				this.orderSendJobList[index]['labels'] = []
				tempList.map(item => {
					if (item.status) {
						this.orderSendJobList[index]['labels'].push(item.label)
					}
				})
			},
			confirm(val, item) {
				if (val === '取消') {
					uni.navigateBack();
					return
				}
				item['labels'] = item.labels !== '' && item.labels.join(',')
				this.debounce(() => {
					this.$httpApi.bizorderreplySave(item).then(res => {
						if (res) {
							this.$util.toast("评价成功");
							this.getUserList()
						}
					})
				}, 200)
			},
			cancel() {

			},
		}
	}
</script>

<style lang="scss" scoped>
	.evaluation-form-contain {
		padding-bottom: 120rpx;
	}

	.nav-bar-title {
		font-weight: bold;
	}

	.nav-bar-right {
		font-size: $middleFontSize;
		color: $viceFontColor;
		padding-right: 28rpx;
	}

	.x6-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.evaluation-item-contain {

		.item {
			margin-bottom: 10rpx;
		}
	}

	.introduction-contain {
		margin-bottom: 8rpx;
		border: $miniBorderRadius;

		.item-introduction {
			display: flex;
			flex-direction: column;
			margin: 0 20rpx;
			padding: 36rpx 42rpx 42rpx 50rpx;
			background: $bgColor;
			border-radius: $miniBorderRadius;

			.top {
				margin-bottom: 6rpx;

				.left {
					font-weight: bold;
					font-size: $middleFontSize;
					color: $seconFontColor;
				}

				.right {
					font-size: $smallFontSize;
					color: $themeColor;
				}
			}

			.middle {
				margin-bottom: 22rpx;

				.left {
					font-size: $smallFontSize;
					color: $themeColor;
				}

				.right {
					font-size: $smallFontSize;
					color: $errorFontColor;
				}

			}

			.bottom {
				display: flex;

				.label {
					font-size: $middleFontSize;
					color: $fontColor99;
					margin-right: 20rpx;
				}

				.value {
					font-size: $middleFontSize;
					color: $seconFontColor;
				}
			}
		}
	}

	.loading-contain {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item-contain {
		margin: 0rpx 20rpx;
		border-radius: 30rpx 30rpx 10rpx 10rpx;
		padding: 0rpx 0 68rpx 0;

		&:last-child {
			margin-bottom: 0rpx;
		}

		.personnel-all {
			background-color: #FFFFFF;
			padding-top: 42rpx;
			border-top-left-radius: $miniBorderRadius;
			border-top-right-radius: $miniBorderRadius;
		}

		.personnel {
			// background: #FFFFFF;
			display: flex;
			padding-bottom: 32rpx;
			border-bottom: 2rpx dashed #FFE7E2;
			align-items: center;
			margin: 0 22rpx;

			.name-text {
				display: flex;
				flex-direction: column;
				margin-left: 24rpx;

				.name {
					font-weight: bold;
					font-size: 28rpx;
					color: $seconFontColor;
				}

				.jobs {
					font-weight: bold;
					font-size: 26rpx;
					color: #909199;
				}
			}
		}

		.body {
			margin-bottom: 86rpx;
			background: #FFFFFF;
			padding-bottom: 42rpx;
			border-bottom-left-radius: $miniBorderRadius;
			border-bottom-right-radius: $miniBorderRadius;
		}


		.tab-list {
			padding-top: 36rpx;
			margin: 0 30rpx 20rpx 30rpx;

			.item-tab {
				padding: 8rpx 26rpx;
				border: 2rpx solid #EEEEEE;
				box-sizing: border-box;
				border-radius: 50rpx;
				margin: 0 10rpx 18rpx 0;
				font-size: 24rpx;
				display: inline-block;
			}

			.item-tab-active {
				border: 2rpx solid $themeColor;
				color: $themeColor;

			}
		}

		.text-contain {
			position: relative;
			margin: 0 30rpx;
			padding-left: 20rpx;

			image {
				position: absolute;
				top: 4rpx;
				width: 34rpx;
				height: 34rpx;
			}

			.describe-input {
				margin-bottom: 20rpx;
				border: 0px;
				height: 120rpx;
			}

			.placeholder {
				color: #909199;
				font-size: 12px;
				padding-left: 40rpx;
				padding-top: 4rpx;
			}
		}


		.bottom {
			margin-left: 54rpx;

			.rate-item {
				margin-bottom: 40rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}
		}

		.file-contain {
			padding-bottom: 52rpx;
			margin: 0 54rpx 44rpx 54rpx;
			border-bottom: 2rpx dashed #EEEEEE;
		}

	}

	.button-contain {
		display: flex;
		width: 100%;
		justify-content: center;

		.cancel {
			background: #FFFFFF;
			border: 2rpx solid #E0E0E0;
			border-radius: 10rpx;
			font-size: 28rpx;
			color: #909299;
			padding: 24rpx 106rpx;
			margin-right: 24rpx;
		}

		.confirm {
			background: $themeColor;
			border-radius: 10rpx;
			padding: 24rpx 78rpx;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}
</style>
