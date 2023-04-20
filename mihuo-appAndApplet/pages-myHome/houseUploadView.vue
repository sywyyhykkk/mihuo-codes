<template>
	<view>
		<z-nav-bar fontColor="#000" bgColor="#F7F7F7">
			<view class="nav-bar" slot="default">上传文件</view>
		</z-nav-bar>
		<view class="main-container">
			<view class="report-info" v-for="(item, index) in fileList" :key="index">
				<view v-for="(itemObj, index2) in item.sopUploadList" :key="index2">
					<view class="report-header flex-center">
						<u-avatar :src="$util.avatarImage(itemObj.creatorId) +'?time=' + new Date().getTime()" size="50">
						</u-avatar>
						<view class="report-creator">
							{{ itemObj.creatorName }}
						</view>
						<view class="creator-skill-name" v-if="itemObj.skillName">
							{{ itemObj.skillName }}
						</view>
						<view class="report-time">
							{{ itemObj.created }} 发起
						</view>
					</view>
					<view class="report-content">
						<view class="content-title">
							{{ itemObj.groupName }}
						</view>
						<view class="img-content">
							<image-show :num="999" :imgSrc="JSON.stringify(itemObj.uploadItemList)" />
						</view>
						<view class="content-des">
							{{ itemObj.remark }}
						</view>
					</view>
				</view>
			</view>
			<!-- status 0=未确认 1=业主确认 2=业主不确认 -->
			<myHome-mh-form-bottom-button v-if="nodeData.status == 0" bgColor="#f7f7f7" @onCancel="reject" @onSure="confirm">
			</myHome-mh-form-bottom-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nodeId: '',
				projectId: '',
				fileList: [],
				nodeData: {},
				options: {}
			}
		},
		onLoad(options) {
			this.options = options;
			this.nodeId = options.nodeId
			this.projectId = options.projectId;
			if(options.noticeId){
				this.$util.readNotice(options.noticeId)
			}
			this.getData()
		},
		onShow() {
			if(this.options.reviewId){
				this.getNode()
			}
		},
		methods: {
			getData() {
				this.$httpApi.getUploadFileByNodeId({
					nodeId: this.nodeId,
					projectId: this.projectId
				}).then(res => {
					if (res) {
						this.fileList = res
					}
				})
			},
			// 查询节点信息
			getNode() {
				this.$httpApi.getCheckNode(this.options.reviewId).then((res => {
					this.nodeData = res;
				}))
			},
			// 不确认待办
			reject() {
				this.toPage(`/pages-myHome/commonHandleTodo?reviewId=${this.options.reviewId}&status=1&nodeId=${this.options.nodeId}`)
			},
			// 确认待办
			confirm() {
				this.toPage(`/pages-myHome/commonHandleTodo?reviewId=${this.options.reviewId}&status=2&nodeId=${this.options.nodeId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main-container {
		width: 100vw;
		height: 100vh;
		padding-bottom: calc(env(safe-area-inset-bottom));
		background-color: #F7F7F7;

		.report-info {
			width: 100vw;
			height: max-content;
			padding: 30rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx 20rpx 0 0;

			.report-header {
				.report-creator {
					margin-left: 14rpx;
					font-size: 25rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #000000;
					line-height: 35rpx;
				}

				.creator-skill-name {
					width: max-content;
					height: 35rpx;
					padding: 0 10rpx;
					background: rgba(255, 236, 230, 1.0);
					border-radius: 10px 2px 10px 0px;
					font-size: 19rpx;
					font-family: HuXiaoBo-NanShen;
					font-weight: 400;
					color: #FE6E32;
					line-height: 35rpx;
					margin-left: 14rpx;
				}

				.report-time {
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #A8A8A8;
					line-height: 35rpx;
					margin-left: 14rpx;
				}
			}

			.report-content {
				margin-top: 30rpx;

				.content-title {
					font-size: 32rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 35rpx;
				}

				.img-content {
					margin-top: 30rpx;
				}

				.content-des {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #4D4D4D;
					line-height: 35rpx;
					margin-top: 30rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
