<template>
	<view class="sop-operation-detail">
		<view class="custom-nodes-page-other" v-if="list.length > 0">
			<view class="item-list-contain" v-for="(item,index) in list" :key="index">
				<view class="item-desc">
					{{item.remark}}
				</view>
				<view class="item-images" v-if="item.images !== '[]'">
					<image-show :enable="true" width="192" height="204" quantityPerLine="3" :key="item.images"
						:imgSrc="item.images">
					</image-show>
				</view>
				<view class="item-audio" v-if="item.voiceData">
					<mihuo-audio :formData="item.voiceData" class="voice" :audioIndex="index" />
				</view>
				<view class="item-time-contain">
					<view class="item-time" v-if="item.type == '开始'">
						<text class="time-lable">{{setStartWay}}开始时间</text>
						<text class="time-lable">{{item.time}}</text>
					</view>
					<view class="item-time" v-if="item.type == '完成'">
						<text class="time-lable">结束时间</text>
						<text class="time-lable">{{item.time}}</text>
					</view>
				</view>
			</view>
		</view>

		<mh-empty v-if="iconShow && list.length == 0" title="您还没有数据～～" />
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		name: 'sop-operation-detail',
		props: {
			iconShow: { // 无数据图标是否显示
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				option: {},
				list: []
			}
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'examineType']),
			setStartWay(){
				// if(){}
				return ''
			}
		},
		mounted() {
			this.getDetails()
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getDetails() {
				let res = this.nodeInfo
				this.list = []
				if (res.startRemark) {
					let tempImages
					let tempVoice
					if (res.startAttachments) {
						let tempStartAttachments = res.startAttachments && JSON.parse(res.startAttachments)
						tempImages = tempStartAttachments.filter(item => item.type == 'img' || item.type == 'video')
						tempVoice = tempStartAttachments.find(item => item.type == 'audio')
					}
					this.list.push({
						remark: res.startRemark,
						images: JSON.stringify(tempImages),
						voiceData: tempVoice || '',
						time: res.realStartTime,
						type: '开始'
					})
				}
				if (res.finishRemark) {
					// 完成相关信息
					let tempImages
					let tempVoice
					if (res.finishAttachments) {
						let tempStartAttachments = res.finishAttachments && JSON.parse(res.finishAttachments)
						tempImages = tempStartAttachments.filter(item => item.type == 'img' || item.type == 'video')
						tempVoice = tempStartAttachments.find(item => item.type == 'audio')
					}
					this.list.push({
						remark: res.finishRemark,
						images: JSON.stringify(tempImages),
						voiceData: tempVoice,
						time: res.realEndTime,
						type: '完成'
					})
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.custom-nodes-page-other {
		margin: 10rpx 20rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.item-list-contain {
			padding: 30rpx 0rpx 40rpx 0rpx;
			border-top: 2rpx solid #F6F6F6;
		}

		.item-desc {
			padding: 0rpx 44rpx;
			color: #666666;
			font-size: $middleFontSize;
		}

		.item-images {
			padding-left: 44rpx;
			margin-top: 24rpx;
		}

		.item-audio {
			padding: 0rpx 44rpx;
		}

		.item-time-contain {
			margin-top: 24rpx;
			padding: 0rpx 44rpx;

			.item-time {

				&:last-child {
					margin-top: 20rpx;
				}

				.time-lable {
					font-size: $middleFontSize;
					color: $viceFontColor;
					margin-right: 20rpx;
				}

				.time-value {
					font-size: $middleFontSize;
					color: #666666;
				}
			}
		}
	}
</style>
