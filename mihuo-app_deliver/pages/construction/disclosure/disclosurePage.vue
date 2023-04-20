<template>
	<view class="disclosure-page-all">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				{{pageTitle}}
			</view>
			<view slot="right" class="nav-bar-right" @click="cutView">
				执行记录
			</view>
		</z-nav-bar>
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<view class="disclosure-page">
			<!-- 节点相关信息	 -->
			<node-information ref="nodeInformation"></node-information>
			<!-- 节点审核信息 -->
			<sop-node-check ref="nodeCheck"></sop-node-check>
			<!-- 手动开始、结束填写的内容 -->
			<sop-operation-detail ref="sopOperationDetail" :iconShow="false"></sop-operation-detail>

			<custom-title v-if="notifyFlag" title="通知"><text v-if="notifyDetails" class="notice-status">已通知</text>
			</custom-title>
			<view class="notice-contain" v-if="notifyFlag">
				<view class="no-data" v-if="!notifyDetails">
					<view class="no-data-item">
						<custom-no-data title="还没有发起交底通知"></custom-no-data>
					</view>
					<text v-if="$permissionRouting.getInstance().isShow()" class="x6-button" :class="[$setNodeSkipStatus('class')]"
						@click="getJumpPage('发起通知')">发起通知</text>
				</view>
				<view v-else class="data-contain">
					<view class="x6-information">
						<view class="top" v-if="notifyDetails">
							<u-avatar class="node" size="36" :src="$util.avatarImage(notifyDetails.createBy)">
							</u-avatar>
							<view class="personnel-contain">
								<text>{{notifyDetails.createPersonName}}</text>
								<text v-if="notifyDetails.createSkillName">({{notifyDetails.createSkillName}})</text>
								<text
									v-if="notifyDetails.createTime">{{notifyDetails.createTime.substring(0,16)}}</text>
								<text>发起通知</text>
							</view>
						</view>
						<view class="bottom" v-if="notifyDetails.ccPersons && notifyDetails.ccPersons.length > 0">
							<text class="title">发送至</text>
							<view class="personnel-item-contain">
								<view class="personnel-item" v-for="(ev,index) in notifyDetails.ccPersons" :key="index">
									<u-avatar class="node" size="36" :src="$util.avatarImage(ev.handleUserId)">
									</u-avatar>
									<text class="name">{{ev.handleSkillName}}({{ev.handlePersonName}}) </text>
									<text class="item-status" v-if="Number(ev.readFlag) !== 0">[已读]</text>
									<text class="item-status-error" v-else>[未读]</text>
								</view>
							</view>
						</view>
					</view>
					<view class="data-notice-contain-all">
						<view class="data-notice-contain-new">
							<view class="title">{{notifyDetails.notifyTitle}}</view>
							<view class="time" v-if="notifyDetails.notifyDate">交底日期
								{{notifyDetails.notifyDate.substring(0,10)}}
							</view>
							<view class="desc-contain"><text class="label">内容描述</text><text
									class="desc">{{notifyDetails.notifyContent}}</text></view>
						</view>
					</view>
					<view class="x6-bottom-contain" @click="getJumpPage('通知')">
						<text class="left"></text>
						<view class="right"><text class="details">查看详情</text>
							<image src="/static/images/bottom-icon.png"></image>
						</view>
					</view>
				</view>
			</view>
			<custom-title :title="nodeInfo.nodeName"><text v-if="discloseList.length > 0"
					class="clarificaiton-status">已完成</text></custom-title>
			<view class="disclose-contain">
				<view class="no-data" v-if="discloseList.length === 0">
					<view class="no-data-item">
						<custom-no-data :title="setTitle"></custom-no-data>
					</view>
					<text v-if="$permissionRouting.getInstance().isShow()" class="x6-button" :class="[$setNodeSkipStatus('class')]"
						@click="getJumpPage('主持交底')">{{nodeInfo.nodeName}}</text>
				</view>
				<view v-else class="disclose-all-contain">
					<view class="data-contain-all" v-for="(item,index) in discloseList" :key="index"
						@click.stop="getJumpPage('内容',item)">
						<view class="x6-information">
							<view class="top">
								<u-avatar class="node" size="36" :src="$util.avatarImage(item.createBy)">
								</u-avatar>
								<view class="personnel-contain">
									<text>{{item.execPersonName}}</text>
									<text v-if="item.execSkillName">({{item.execSkillName}})</text>
									<text v-if="item.discloseDate">{{item.discloseDate.substring(0,16)}}</text>
									<!-- <text>{{index > 0 ? '编辑了交底':'发起交底'}}</text> -->
									<text>发起</text>
								</view>
							</view>
							<view class="bottom" v-if=" item.ccPersons && item.ccPersons.length > 0">
								<text class="title">发送至</text>
								<view class="personnel-item-contain">
									<view class="personnel-item" v-for="(ev,index) in item.ccPersons" :key="index">
										<u-avatar class="node" size="36" :src="$util.avatarImage(ev.handleUserId)">
										</u-avatar>
										<text class="name">{{ev.handleSkillName}}({{ev.handlePersonName}}) </text>
										<text class="item-status" v-if="Number(ev.readFlag) !== 0">[已读]</text>
										<text class="item-status-error" v-else>[未读]</text>
									</view>
								</view>
							</view>
						</view>
						<view class="data-notice-contain ">
							<view class="title">{{item.discloseTitle}}内容</view>
							<view class="time" v-if="item.discloseDate">交底日期 {{item.discloseDate.substring(0,10)}}
							</view>
							<view v-if="item.remark" class="desc-contain"><text class="label">内容描述</text><text
									class="desc">{{item.remark}}</text></view>
							<view v-if="item.attachmentsListImage !== '[]'" class="file-contain">
								<image-show :imgSrc="item.attachmentsListImage" right="20"></image-show>
							</view>
							<view v-if="item.attachmentsListAudio" class="mihuo-audio-contain">
								<mihuo-audio :formData="item.attachmentsListAudio"></mihuo-audio>
							</view>
						</view>
						<view class="x6-bottom-contain  x6-bottom-contain-new" @click="getJumpPage('内容',item)">
							<text class="left"><text class="item-text">共{{item.addCount}}条补充</text></text>
							<view class="right"><text class="details">查看详情</text>
								<image src="/static/images/bottom-icon.png"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<sop-operation ref="sopOperation"></sop-operation>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				list: [],
				listUser: [],
				details: {
					notifyStatusFlag: 0,
					discloseStatusFlag: 0,
				},
				notifyCCUsersList: [],
				discloseCCUsersList: [],
				notifyExecPersonIdAll: {},
				discloseExecPersonIdALL: {},
				discloseList: [],
				notifyDetails: '',
				pageTitle: '',
				fileUrl: '',
				projectId: '',
				personId: ''
			}
		},
		onLoad() {

		},
		onShow() {
			this.setParameters()
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo']),
			setTitle() {
				return '还没有主持' + this.nodeInfo.nodeName
			}
		},
		methods: {

			setParameters() {
				this.projectId = this.projectInfo.projectId
				this.pageTitle = this.nodeInfo.nodeName || '交底中间页'
				this.nodeId = this.nodeInfo.nodeId
				this.personId = this.userPersonInfo.personId
				this.notifyFlag = this.nodeInfo.notifyFlag
				this.getDetails()
				this.setNodeDetails()
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
			getJumpPage(val, item) {
				if (!this.$setNodeSkipStatus('status')) {
					return
				}
				switch (val) {
					case '主持交底':
						this.toPage(`/pages/construction/disclosure/addDisclosure`)
						break
					case '发起通知':
						this.toPage(`/pages/construction/disclosure/initiatePage`)
						break
					case '通知':
						let notifyId = this.notifyDetails.ccPersons.find(ev => ev.handlePersonId == this.personId)
						if (notifyId) {
							this.toPage(`/pages/construction/disclosure/viewDisclosureNotice?notifyId=${notifyId.id}`)
						} else {
							this.toPage(`/pages/construction/disclosure/viewDisclosureNotice`)
						}
						break
					case '内容':
						let notifyIdNew = item.ccPersons.find(ev => ev.handlePersonId == this.personId)
						if (notifyIdNew) {
							this.toPage(
								`/pages/construction/disclosure/viewDisclosureText?notifyId=${notifyIdNew.id}&detailsId=${item.id}`
							)
						} else {
							this.toPage(`/pages/construction/disclosure/viewDisclosureText?detailsId=${item.id}`)
						}
						break
				}
			},
			getDetails() {
				if (!this.nodeInfo.nodeId) {
					return
				}
				this.$httpApi.selectDiscloseList({
					nodeId: this.nodeInfo.nodeId
				}).then(res => {
					if (res) {
						this.discloseList = res.splice(0, 1)
						this.discloseList.map(item => {
							if (this.$isJSON(item.attachments)) {
								item['attachmentsListImage'] = JSON.stringify(JSON.parse(item.attachments)
									.filter(item => item.type == 'img' || item.type == 'video'))
								item['attachmentsListAudio'] = JSON.parse(item.attachments)
									.find(item => item.type == 'audio')
							}
						})
					}
				})

				this.$httpApi.selectNotifyList({
					nodeId: this.nodeInfo.nodeId
				}).then(res => {
					if (res) {
						this.notifyDetails = res
					}
				})
			},
			cutView() {
				this.toPage(`/pages/construction/disclosure/disclosureRecord`)
			}
		}

	}
</script>

<style lang="scss" scoped>
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

	.x6-button {
		// width: 210rpx;
		display: inline-block;
		// height: 72rpx;
		padding: 16rpx 52rpx;
		// line-height: 72rpx;
		text-align: center;
		color: $themeColor;
		font-size: 26rpx;
		background: $bgColor;
		border: 1px solid $themeColor;
		border-radius: $miniBorderRadius;
	}

	.x6-information {
		// min-height: 98rpx;

		.top {
			display: flex;
			margin-bottom: 18rpx;

			.node {
				margin-right: 10rpx;
			}

			.personnel-contain {
				text {
					font-size: $smiddleFontSize;
					color: $mainFontColor;
				}

			}
		}

		.bottom {
			display: flex;
			align-items: center;
			position: relative;
			display: flex;
			align-items: flex-start;
			margin-bottom: 26rpx;

			.title {
				// position: absolute;
				font-size: $smallFontSize;
				color: $viceFontColor;
				margin-right: 14rpx;
				flex-wrap: nowrap;
				white-space: nowrap;
			}

			.personnel-item-contain {
				display: flex;
				flex-wrap: wrap;

				.personnel-item {
					display: flex;
					align-items: center;
					margin-right: 16rpx;
					margin-bottom: 8rpx;
					// white-space: nowrap;

					.name {
						font-size: $smallFontSize;
						color: $seconFontColor;
						margin-right: 6rpx;
					}

					.item-status {
						font-size: 20rpx;
						color: $viceFontColor;
					}

					.item-status-error {
						font-size: 20rpx;
						color: #FF5D35;
					}
				}
			}

		}
	}

	.x6-bottom-contain {
		display: flex;
		justify-content: space-between;
		padding-right: 34rpx;

		.left {
			.item-text {
				font-size: $smiddleFontSize;
				color: $viceFontColor;
			}
		}

		.right {
			display: flex;
			flex-direction: row;
			align-items: center;

			text {
				font-size: $smallFontSize;
				color: $themeColor;
				margin-right: 12rpx;
			}

			image {
				width: 16rpx;
				height: 14rpx;
			}
		}
	}

	.x6-bottom-contain-new {
		padding-right: 0rpx;
		margin-right: 40rpx;
	}

	.clarificaiton-status {
		font-weight: bold;
		font-size: $smiddleFontSize;
		color: $successNewFontColor;
	}

	.notice-status {
		font-weight: bold;
		font-size: $smiddleFontSize;
		color: $themeColor;
	}

	.disclosure-page-all {
		padding-bottom: 100rpx;
	}

	.disclosure-page {
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
				}

				.value {
					font-size: $middleFontSize;
					color: $seconFontColor;
				}
			}
		}

		.notice-contain {
			margin: 0 20rpx;
			min-height: 404rpx;
			background: $bgColor;
			border-radius: $miniBorderRadius;

			.no-data-item {
				margin-bottom: 34rpx;
			}

			.no-data {
				text-align: center;
				padding-bottom: 60rpx;
			}
		}

		.disclose-contain {
			min-height: 404rpx;


			.no-data-item {
				margin-bottom: 34rpx;
			}

			.no-data {
				margin: 0 20rpx;
				text-align: center;
				padding-bottom: 60rpx;
				border-radius: $miniBorderRadius;
				background: $bgColor;
			}
		}

		.data-contain,
		.disclose-all-contain {
			padding: 44rpx 0rpx 26rpx 42rpx;

			.data-notice-contain-all {
				padding-right: 40rpx;
			}

			.data-notice-contain-new {
				margin-right: 0rpx !important;

			}


			.data-notice-contain,
			.data-notice-contain-new {
				box-shadow: 0px 0px 8px rgba(158, 156, 156, 0.25);
				border-radius: $miniBorderRadius;
				// max-width: 628rpx;
				display: flex;

				flex-direction: column;
				padding: 32rpx 0rpx 46rpx 38rpx;
				margin-bottom: 34rpx;
				margin-right: 40rpx;

				.title {
					color: $seconFontColor;
					font-size: $middleFontSize;
					margin-bottom: 8rpx;
					font-weight: bold;
				}

				.time {
					font-size: $smallFontSize;
					color: $viceFontColor;
					
				}

				.desc-contain {
					padding-right: 38rpx;
					margin-top: 8rpx;

					.label {
						color: $viceFontColor;
						font-size: $middleFontSize;
						margin-right: 18rpx;
					}

					.desc {
						color: $seconFontColor;
					}

					text {
						font-size: $middleFontSize;
					}
				}

				.file-contain {
					margin-top: 22rpx;
					margin-bottom: 20rpx;
				}

				.mihuo-audio-contain {
					padding-right: 40rpx;
				}

			}


		}

		.disclose-all-contain {
			padding: 0rpx;

			.data-contain-all {
				background-color: #fff;
				border-radius: $miniBorderRadius;
				margin: 0rpx 20rpx 20rpx 20rpx;
				padding: 44rpx 0rpx 26rpx 42rpx;
			}
		}
	}
</style>
