<template>
	<view style="background-color:#f4f4f4;">
		<view style="height: 20rpx;background-color: #f4f4f4;"></view>
		<view class="page-content">
			<myHome-mh-userinfo :userInfo="userInfo">
				<text class="date-label">{{getExNoticeDate(userInfo.realEndTime || '')}}发起</text>
			</myHome-mh-userinfo>
			<view class="start" v-if="userInfo.realStartTimee">
				<view class="desc">
					{{userInfo.startRemark || "暂无备注信息"}}
				</view>
				<view class="hourse">
					<view class="image-content">
						<image-show v-if="userInfo.startAttachments" :imgSrc="userInfo.startAttachments" />
					</view>
				</view>
				<view class="startdate">开始时间：{{userInfo.realStartTimee}}</view>
			</view>
			<view class="end">
				<view class="desc">
					{{userInfo.finishRemark || "暂无备注信息"}}
				</view>
				<view class="hourse">
					<view class="image-content">
						<image-show v-if="userInfo.finishAttachments" :imgSrc="userInfo.finishAttachments" />
					</view>
				</view>
				<view class="enddate">结束时间：{{userInfo.realEndTime}}</view>
			</view>
		</view>
		<myHome-mh-form-bottom-button v-if="nodeData.status == 0" @onCancel="goSure(1)" @onSure="goSure(2)" />
	</view>
</template>

<script>
	import {
		getNoticeDate
	} from '@/static/js/chat.js'
	export default {
		data() {
			return {
				personInfo: {},
				orderOfferList: {},
				userInfo: {},
				roomImg: '',
				nodeId: '',
				reviewId: '',
				projectId: '',
				nodeData: {}
			}
		},
		onLoad(option) {
			this.nodeId = option.nodeId;
			this.reviewId = option.reviewId;
			this.projectId = option.projectId;
			if(option.noticeId){
				this.$util.readNotice(option.noticeId)
			}
			this.getUserInfo();
		},
		onShow() {
           this.getNode();
		},
		methods: {
			getExNoticeDate(date) {
				const time = getNoticeDate(date);
				return time
			},
			getNode() {
				this.$httpApi.getCheckNode(this.reviewId).then((res => {
					this.nodeData = res;
				}))
			},
			getUserInfo() {
				this.$http.get(`order/project/node?nodeId=${this.nodeId || 55071}`).then(res => {
					uni.setNavigationBarTitle({
						title:res.nodeName || ''
					})
					this.userInfo = res;
				})
			},
			goSure(status) {
				this.toPage(`/pages-myHome/commonHandleTodo?reviewId=${this.reviewId}&status=${status}&nodeId=${this.nodeId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-content {
		padding: 30rpx 0 180rpx 0;
		background-color: #fff;
		border-top-right-radius: 30rpx;
		border-top-left-radius: 30rpx;

		.date-label {
			font-size: 20rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #A8A8A8;
			line-height: 34px;
			margin: 0 0 0 9rpx;
		}
	}

	.hourse {
		background-color: #fff;

		.image-content {
			margin: 30rpx 30rpx 0 30rpx;
		}

		.image-label {
			font-size: 32rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
			margin: 0 0 0 30rpx;
		}
	}

	.desc {
		padding: 0 30rpx;
		color: #666;
		font-size: 28rpx;
		background-color: #fff;
	}

	.start {
		border-bottom: 1rpx solid #f7f7f7;
		margin-top: 30rpx;
	}

	.end {
		margin-top: 30rpx;
	}

	.startdate,
	.enddate {
		color: #999;
		font-size: 26rpx;
		padding: 0 30rpx 30rpx 30rpx;
	}
</style>
