<template>
	<view class="operation-records" :class="[ list.length == 1 ? 'operation-records-default':'' ]">
		<!-- 审查状态 0-待审查 1-审查不通过 2-审查通过 -->
		<!-- <view class="operation-records"> -->
		<view >
			<view class="operation-records-item" v-for="(item,index) in list" :key="index">
				<view class="left-contain">
					<u-avatar class="node" size="52" :src="$util.avatarImage(item.userId)">
					</u-avatar>
				</view>
				<view class="right-contain">
					<view class="item-header">
						<text class="name">{{item.skillName}}({{item.personName}})</text>
						<text class="time" v-if="item.reviewTime">{{item.reviewTime.substring(0,16)}} </text>
						<text class="type-name">{{getStatus(item)}}</text>
					</view>
					<view class="item-records" v-if="item.remark">
						<view class="item-desc">
							<text class="item-title" v-if="item.status == 1">拒绝原因</text>
							<text class="desc-text">
								{{item.remark}}
							</text>
						</view>
						<view v-if="item.signImg" class="signature-image">
							<image-lazy-load :image="item.signImg" height="280" width="550"></image-lazy-load>
						</view>
						<view class="image-contain" v-if="item.imageList">
							<image-show :imgSrc="item.imageList" right="20"></image-show>
						</view>
						<view class="audio-contain" v-if="item.audio">
							<mihuo-audio :formData="item.audio" />
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<mh-empty v-show="list.length === 0" icon="/static/images/no_recommend.png" title="您还没有记录～～" />
		<!-- </view> -->
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
				list: []
			}
		},
		computed: {
			...mapState(['nodeInfo', 'remainingDays', 'projectInfo', 'userPersonId', 'examineType'])
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getList()
		},
		methods: {
			getStatus(item) {
				// 审查状态 0-待审查 1-审查不通过 2-审查通过
				switch (item.status) {
					case 0:
						return '确认中'
					case 1:
						return '拒绝通过'
					case 2:
						return '审查通过'
				}
			},
			getList() {
				if (this.nodeInfo.reviewFlag) {
					this.$httpApi.getReviewList({
						nodeId: this.nodeInfo.nodeId
					}).then(res => {
						if (res) {
							// if (this.examineType == '审查方') {
							// 	res = res.filter(item => item.personId == this.userPersonId)
							// }
							
							res.forEach(el => {
								el['attachmentsNew'] = el.attachments !== '[]' ? JSON.parse(el
									.attachments) : []
							})
							res.forEach(el => {
								if (el['attachmentsNew']) {
									el['imageList'] = JSON.stringify(el['attachmentsNew'].filter(item =>
										item
										.type == 'img' || item.type == 'video'))
									el['audio'] = el['attachmentsNew'].find(item => item.type == 'audio')
								}
							})

							// 如果审核时未填写任何信息，默认添加  备注
							res.map(item => {
								if (!item.remark && (item.attachments == '[]' || !item.attachments)) {
									item.remark = this.getStatus(item)
								}
							})
							// 见tfs 27863,如果数据中有一条未审核通过的,就只显示这一条数据
							// 1 = 审查不通过 2=审查通过 0=审查中
							let reviewSstatus = false
							res.forEach(el => {
								if (el.status == 1) {
									reviewSstatus = true
								}
							})
							if (reviewSstatus) {
								res = res.filter(item => item.status == 1)
							}
							this.list = res
						}
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	
	.signature-image {
		margin-top: 20rpx;
	}
	
	.operation-records-default {

		.operation-records-item {

			.item-records {
				margin-bottom: 0rpx !important
			}
		}
	}

	.operation-records {
		padding: 36rpx 22rpx 130rpx 50rpx;

		.operation-records-item {
			display: flex;
			position: relative;

			&:last-child {
				.item-records {
					margin-bottom: 0rpx !important;
				}
			}


			.left-contain {
				border-left: 2rpx dashed #C4C4C4;
				width: 40rpx;

				.node {
					position: absolute;
					left: -24rpx;
					top: -6rpx;
				}
			}

			.right-contain {
				width: 100%;


				.item-header {
					margin-bottom: 34rpx;

					.time {
						margin-right: 20rpx;
					}

					.name {
						margin-right: 4rpx;
					}

					.time,
					.name,
					.type-name,
					.title {
						font-size: 28rpx;
						color: #909199;
					}

					.shutdown {
						color: #FF5D35;
					}

					.return {
						color: $themeColor;
					}
				}

				.item-records {
					background-color: #FFFFFF;
					padding: 30rpx 44rpx 30rpx 46rpx;
					border-radius: 10rpx;
					margin-bottom: 36rpx;

					.item-title {
						margin-bottom: 28rpx;

						.label {
							font-size: 28rpx;
							color: #909199;
							margin-right: 22rpx;

						}

						.value {
							font-size: 28rpx;
							color: $seconFontColor;
						}
					}

					.text-contain {
						margin-bottom: 28rpx;
						display: flex;
						flex-direction: column;

						.title {
							font-size: 28rpx;
							color: #909199;
							margin-bottom: 12rpx;
						}

						.text-desc {
							font-size: 28rpx;
							color: $seconFontColor;
						}

					}

					.image-contain {
						display: flex;
						flex-wrap: wrap;
						margin-top: 20rpx;

						.record-item-img {
							width: 132rpx;
							margin-right: 10rpx;

							&:last-child {
								margin-right: 0rpx;
							}
						}
					}

					.item-desc {
						display: flex;
						flex-direction: column;

						.item-title {
							font-size: 28rpx;
							color: #303133;
							margin-bottom: 14rpx;
						}

						.desc-text {
							color: #606166;
							font-size: 28rpx;
						}
					}

					.audio-contain {
						margin-top: 22rpx;
					}
				}

			}
		}
	}
</style>
