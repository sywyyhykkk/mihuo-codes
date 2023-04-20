<template>
	<view class="collection-record-page">
		<view class="record-list-contain" v-for="(item,index) in list" :key="index">
			<view class="top-contain">
				<view class="left">{{item.nodeName}}</view>
				<view class="right" @click="clickOpen(index)">
					<text>点击展开</text>
					<image :class="[item.showStatus ? 'public-block':'public-none']"
						src="/static/images/bottom-icon.png" class="public-arrow"></image>
				</view>
			</view>
			<view class="c" :style="{'display':item.showStatus ? 'block':'none' }">
				<view class="collection-record" v-for="(el,num) in item.srrRes" :key="num">
					<view class="left-contain">
						<u-avatar class="node" size="52" :src="$util.avatarImage(el.userId,true,36)">
						</u-avatar>
					</view>
					<view class="right-contain">
						<view class="item-top">
							{{el.skillName}}
							({{el.userName}})
							{{el.created && el.created.substring(0,16)}}
							收款 <text class="num">{{el.price}}</text>元
						</view>
						<view class="details-contain-all">
							<view class="details-contain">
								<view class="item-why">
									<text class="title">凭证信息</text>
									<text class="why-content">{{el.remark}}</text>
								</view>
								<view class="image-contain">
									<image-show :imgSrc="el.attachmentsPics" :key="el.attachmentsPics"></image-show>
								</view>
								<view class="audio-contain" v-if="el.attachmentsVoice">
									<mihuo-audio ref="mihuoAudioList" :refAudioList="refAudioList" :audioIndex="num"
										:formData="el.attachmentsVoice"></mihuo-audio>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				key: '',
				formDate: {},
				list: [],
				refAudioList: []
			}
		},
		onLoad() {

		},
		onShow() {
			this.getList()
		},
		computed: {
			...mapState(['projectInfo']),
		},
		methods: {
			clickOpen(index) {
				this.list[index].showStatus = !this.list[index].showStatus
			},
			getList() {
				this.$httpApi.sopReceiptRecordsOneProjectDetails({
					projectId: this.projectInfo.projectId
				}).then(res => {
					if (res) {
						res.map((item, index) => {
							if (index > 0) {
								item['showStatus'] = false
							} else {
								item['showStatus'] = true
							}
						})
						this.list = res
						setTimeout(() => {
							this.refAudioList = this.$refs.mihuoAudioList
						}, 200)
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.collection-record-page {
		margin: 12rpx 20rpx 2rpx 20rpx;
		padding-bottom: 40rpx;

		.record-list-contain {
			border-radius: $miniBorderRadius;
			margin-bottom: 2rpx;
			background-color: #FFFFFF;
			padding-bottom: 20rpx;
		}
	}

	.top-contain {
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
		padding: 48rpx 32rpx 0rpx 40rpx;


		.left {
			font-size: $middleFontSize;
			color: $seconFontColor;
		}

		.right {
			display: flex;
			align-items: center;

			text {
				font-size: $smiddleFontSize;
				color: #A7A7A7;
			}

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
		}

	}


	.collection-record {
		display: flex;

		padding-left: 76rpx;

		&:last-child {
			.right-contain {
				margin-bottom: 0rpx;
			}
		}

		.left-contain {
			border-left: 1px dashed #C4C4C4;
			width: 40rpx;
			position: relative;

			.node {
				position: absolute;
				left: -28rpx;
				top: -10rpx;
			}
		}

		.right-contain {
			margin-bottom: 20rpx;
			display: flex;
			flex: 1;
			flex-direction: column;

			.item-top {
				font-weight: 400;
				font-size: $smiddleFontSize;
				color: $viceFontColor;
				margin-bottom: 30rpx;
				padding-right: 58rpx;

				.num {
					font-size: $smiddleFontSize;
					color: $errorFontColor;
				}
			}

			.details-contain-all {
				border-radius: $miniBorderRadius;
			}

			.details-contain {
				padding: 0rpx 14rpx 0rpx 0rpx;
				background-color: #FFFFFF;
				border-top-left-radius: 10rpx;
				border-top-right-radius: 10rpx;

				.item-why {
					display: flex;
					flex-direction: column;
					margin-top: 2rpx;

					.title {
						font-weight: 400;
						font-size: $smallFontSize;
						color: #B4B6BA;
						margin-bottom: 10rpx;
					}

					.why-content {
						font-weight: 400;
						padding-right: 58rpx;
						font-size: $middleFontSize;
						color: $seconFontColor;
					}

				}

				.image-contain {
					margin-top: 22rpx;
				}

				.audio-contain {
					padding-right: 54rpx;

					.speak_btn {
						margin-top: 0rpx;
					}
				}
			}


			.results-contain {
				background-color: #FFFFFF;
				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;

				.item-results-contain {
					margin: 0rpx 34rpx 0rpx 34rpx;
					border-top: 2rpx dashed #EEEEEE;
					padding: 26rpx 0rpx 34rpx 0rpx;
				}

				.item-results {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					text {
						margin-left: 10rpx;
						font-weight: 400;
						font-size: $smallFontSize;
						color: $errorFontColor;
					}
				}

				.results-why {
					font-weight: 400;
					font-size: $smallFontSize;
					color: #B4B6BA;
					margin-bottom: 10rpx;
				}

				.results-desc {
					font-weight: 400;
					font-size: $smiddleFontSize;
					color: $seconFontColor;
				}
			}
		}

	}
</style>
