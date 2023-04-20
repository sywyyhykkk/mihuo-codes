<template>
	<view class="measuring-room-page">
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<!-- 节点相关信息	 -->
		<node-information ref="nodeInformation"></node-information>
		<!-- 节点审核信息 -->
		<sop-node-check ref="nodeCheck"></sop-node-check>
		<!-- 手动开始、结束填写的数据 -->
		<sop-operation-detail ref="sopOperationDetail" :iconShow="false"></sop-operation-detail>
		<view class="details-contain public-bg-mg" :class="[detailsShow ? '':'top-contain-radius']">
			<view v-if="!detailsShow" class="no-data">
				<view class="no-data-item">
					<custom-no-data title="还没有录入量房信息"></custom-no-data>
				</view>
				<text v-if="$permissionRouting.getInstance().isShow()" class="x6-button" :class="[$setNodeSkipStatus('class')]"
					@click="getJumpPage('录入量房信息')">录入量房信息</text>
			</view>
			<view v-else class="information-contain">
				<measuring-room-information :key="roomKey" ref="measuring"></measuring-room-information>
			</view>
		</view>
		<!-- 手动开始、手动结束 -->
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
				details: {},
				detailsShow: false,
				projectId: '', //项目编号
				roomKey: 0,
			}
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo','preNodeStatus'])
		},
		onLoad() {},
		onShow() {
			this.getShow()
			this.setNodeDetails()
		},
		methods: {
			getShow() {
				this.roomKey++
				this.projectId = this.projectInfo.projectId
				if (this.projectId) {
					this.$httpApi.getCheckExist({
						id: this.projectId
					}).then(res => {
						if (res) {
							this.detailsShow = res.existFlag
						}
					})
				}
			},
			getJumpPage(val) {
				if (!this.$setNodeSkipStatus('status')) {
					return
				}
				this.toPage(`/pages/construction/measuringRoom/measuringRoomForm`)
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
		}
	}
</script>

<style lang="scss" scoped>
	.public-flex {
		display: flex;
		align-items: center;
	}

	.public-flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.public-flex-space-between {
		justify-content: space-between;
	}

	.public-bg-mg {
		margin: 0 20rpx;
		background-color: $bgColor;
	}

	.measuring-room-page {
		padding-bottom: 40rpx;

		.top-contain-bottom-no-radius {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		.top-contain-radius {
			border-radius: $miniBorderRadius;
		}

		.top-contain {
			border-top-left-radius: $miniBorderRadius;
			border-top-right-radius: $miniBorderRadius;
			padding: 36rpx 42rpx 46rpx 50rpx;

			.bottom-item,
			.top-item {
				justify-content: space-between;

			}

			.top-item {
				margin-bottom: 14rpx;

				.left {
					font-size: $middleFontSize;
					color: $seconFontColor;
					font-weight: bold;
				}

				.right {
					font-size: $smallFontSize;
					color: $themeColor;
				}
			}

			.bottom-item {
				.left {
					.label {
						font-size: $middleFontSize;
						color: $viceFontColor;
						margin-right: 30rpx;
					}
				}

				.right {
					font-size: $smallFontSize;
					color: $errorFontColor;
				}
			}
		}


		.details-contain {
			text-align: center;
			border-bottom-left-radius: $miniBorderRadius;
			border-bottom-right-radius: $miniBorderRadius;

			.no-data {
				text-align: center;
				padding-bottom: 102rpx;

				.no-data-item {
					margin-bottom: 36rpx;
				}

			}

			.information-contain {
				margin-top: 8rpx;
			}

		}
	}

	.x6-button {
		width: 210rpx;
		display: inline-block;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		color: $themeColor;
		font-size: 26rpx;
		background: $bgColor;
		border: 1px solid $themeColor;
		border-radius: $miniBorderRadius;
	}
</style>
