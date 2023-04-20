<template>
	<view style="background-color:#f4f4f4;">
		<view style="height: 20rpx;background-color: #f4f4f4;"></view>
		<view class="page-content">
			<myHome-mh-userinfo :userInfo="distriInfo">
				<text class="date-label">{{getNoticeDate(distriInfo.realEndTime)}}发起</text>
			</myHome-mh-userinfo>
			<myHome-mh-form-item label="接单工匠" border>
				<myHome-mh-userinfo :userInfo="personInfo" style="float: right;" />

			</myHome-mh-form-item>
			<myHome-mh-form-item label="从业年限" :value="personInfo.skillYearNum || ''" border />
			<myHome-mh-form-item label="好评率" :value="`${(orderOfferList.goodRate || '100')+'%'}`" border />
			<myHome-mh-form-item label="资质技能" :value="personInfo.certificateFlag" border />
			<view class="hourse">
				<view v-for="item, index in certificateFlag" :key="index">
					<image-show :imgSrc="item" />
				</view>
			</view>
		</view>
		<myHome-mh-form-bottom-button v-if="nodeData.status == 0" @onCancel="()=>goSure(1)" @onSure = "()=>goSure(2)" />
	</view>
</template>

<script>
	import {
		getNoticeDate
	} from '@/static/js/chat.js'
	export default {
		data() {
			return {
				distriInfo: {},
				personInfo: {},
				orderOfferList: {},
				certificateFlag: [],
				nodeId: '',
				reviewId: '',
				projectId: '',
				nodeData:{}
			}
		},
		onLoad(option) {
			this.nodeId = option.nodeId;
			this.reviewId = option.reviewId;
			this.projectId = option.projectId
			if(option.noticeId){
				this.$util.readNotice(option.noticeId)
			}
			this.getDistribute();
			this.getWorker();
		},
		onShow() {
			if(this.reviewId){
				this.getNode();
			}
		},
		methods: {
			// 查询节点信息
			getNode(){
				this.$httpApi.getCheckNode(this.reviewId).then((res=>{
					this.nodeData = res;
				}))
			},
			getNoticeDate(date) {
				return getNoticeDate(date)
			},
			getDistribute() {
				this.$http.get(`order/project/node?nodeId=${this.nodeId}`).then(res => {
					this.distriInfo = res;
				})
			},
			getWorker() {
				this.$http.get(`order/biz_order/project/order?nodeId=${this.nodeId}&projectId=${this.projectId}`).then(
					res => {
						this.personInfo = res.length ? res[0].orderOfferList ? res[0].orderOfferList[0].personInfo :
							{} : {};
						this.orderOfferList = res.length ? res[0].orderOfferList : {},
							this.certificateFlag = this.personInfo && this.personInfo.certificateImage ? this
							.personInfo.certificateImage.split(',') : []
					})
			},
			goSure(status){
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
	}

	.date-label {
		font-size: 20rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 400;
		color: #A8A8A8;
		line-height: 34px;
		margin: 0 0 0 9rpx;
	}
</style>
