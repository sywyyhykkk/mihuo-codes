<template>
	<view class="sop-node-check">
		<custom-title title="审查结果" v-if="examineList.length > 0"></custom-title>
		<view class="list-contain" v-if="examineList.length > 0">
			<view class="item-list">
				<view class="item-left">
					<view class="item-contain" v-for="(item,index) in examineList" :key="index">
						<view class="item-top">
							<text
								v-if="item.userType !== 1 ">{{ item.status == 0 ?'等待':'' }}{{item.personName}}({{item.skillName}}){{getStatusName(item.status)}}</text>
							<text v-else>{{ item.status == 0 ?'等待':'' }}业主{{getStatusName(item.status)}}</text>
						</view>
						<view class="item-time">{{item.reviewTime && item.reviewTime.substring(0,16)}}</view>
					</view>
				</view>
				<view class="item-rght" v-if="examineType == '发起方' && currentExamine">
					<view v-if="currentExamine.status == 0" class="item-button item-no" @click="getExamine('催办')">
						催办
					</view>
				</view>
			</view>
			<view class="view-details" @click="getExamine('查看详情')">
				<text>查看详情</text>
				<image src="/static/images/bottom-icon.png" class="icon-jian"></image>
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
		data() {
			return {
				option: {},
				examineList: [],
				cuiBanShow: false,
				currentExamine: ''
			}
		},
		computed: {
			...mapState(['nodeInfo', 'examineType']),
		},
		mounted() {
			this.getReviewList()
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getReviewList() {
				if(!this.nodeInfo.nodeId){
					return
				}
				this.$httpApi.getReviewList({
					nodeId: this.nodeInfo.nodeId
				}).then(res => {
					if (res) {
						// 见tfs 27863,如果数据中有一条未审核通过的,就只显示这一条数据
						// 1 = '审查不通过' 2='审查通过' 0='审查中'
						let reviewSstatus = false
						res.forEach(el =>{
							if(el.status == 1){
								reviewSstatus = true
							}
						})
						if(reviewSstatus){
							res = res.filter(item =>item.status == 1)
						}
						this.examineList = res
						this.currentExamine = res.find(item => item.personId == this.userPersonId)
						this.$emit('setReviewStatus', this.currentExamine)
					}
				})
			},
			getStatusName(status) {
				let tempMap = {
					1: '审查不通过',
					2: '审查通过',
					0: '确认中'
				}
				return tempMap[status] ?? ''
			},
			getExamine(type) {
				this.debounce(() => {
					if (type == '催办') {
						this.$httpApi.setUrgeReview({
							reviewId: this.currentExamine.id
						}).then(res => {
							if (res) {
								this.cuiBanShow = !this.cuiBanShow
							}
						})
					} else {
						this.toPage(`/pages/construction/examineDetails`)
					}
				}, 200)
			},
			getConfirm() {
				this.cuiBanShow = !this.cuiBanShow
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.icon-jian {
		width: 16rpx;
		height: 14rpx;
	}

	.view-details {
		display: flex;
		align-items: center;
		justify-content: center;

		text {
			color: $themeColor;
			margin-right: 12rpx;
			font-size: 24rpx;
		}

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

	.list-contain {
		display: flex;
		flex-direction: column;
		padding: 36rpx 40rpx 40rpx 40rpx;
		border-radius: 10rpx;
		background: #FFFFFF;
		margin: 10rpx 20rpx;

		.item-list {
			display: flex;
			justify-content: space-between;


		}

		.item-contain {
			margin-bottom: 28rpx;

			.item-top {
				text {
					color: #303133;
					font-size: 28rpx;
					line-height: 32rpx;
					margin-bottom: 4rpx;
				}
			}

			.item-time {
				color: #909199;
				font-size: 24rpx;
				line-height: 32rpx;
				margin-top: 8rpx;
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
</style>
