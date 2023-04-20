<template>
	<view style="background-color:#f4f4f4;">
		<view style="height: 20rpx;background-color: #f4f4f4;"></view>
		<view class="page-content">
			<myHome-mh-userinfo :userInfo="userInfo">
				<text class="date-label">{{getNoticeDate(userInfo.realEndTime || '')}}发起</text>
			</myHome-mh-userinfo>
			<view v-for="item in distriInfo" :key="item.id">
				<view v-for="mini, index in item.children" :key="index">
					<view v-for="miniItem, index2 in mini.children" :key="index2">
						<myHome-mh-form-item :label="mini.attributeValue+  miniItem.attributeName"
							:value="miniItem.attributeValue + miniItem.attributeUnit" border />
					</view>
				</view>

			</view>
			<view class="hourse">
				<view class="image-label">户型图</view>
				<view class="image-content">
					<image-show v-if="roomImg" :imgSrc="roomImg" />
				</view>
			</view>
		</view>
		<myHome-mh-form-bottom-button v-if="nodeData.status == 0" @onCancel="()=>goSure(1)" @onSure="()=>goSure(2)" />
	</view>
</template>

<script>
	import {
		getNoticeDate
	} from '@/static/js/chat.js'
	export default {
		data() {
			return {
				distriInfo: [],
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
				this.$util.readNotice(option.noticeId);
			}
			this.getDistribute()
			this.getHousePage()
			this.getUserInfo()
		},
		onShow() {
			console.log("复古风格发挥好")
			this.getNode()
		},
		methods: {
			getNoticeDate(date) {
				return getNoticeDate(date)
			},
			getUserInfo() {
				this.$http.get(`order/project/node?nodeId=${this.nodeId}`).then(res => {
					this.userInfo = res;
				})
			},
			getDistribute() {
				this.$http.get(`order/bizroomareaattribute/getRoomTypeAndSpaceList?id=${this.projectId}`).then(res => {
					console.log(res);
					this.distriInfo = res;
				})
			},
			getHousePage() {
				this.$http.get(`order/project/${this.projectId}`).then(res => {
					this.roomImg = res.roomImg;
				})
			},
			goSure(status) {
				this.toPage(`/pages-myHome/commonHandleTodo?reviewId=${this.reviewId}&status=${status}&nodeId=${this.nodeId}`)
			},
			// 查询节点信息
			getNode() {
				this.$httpApi.getCheckNode(this.reviewId).then((res => {
					this.nodeData = res;
				}))
			},
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
</style>
