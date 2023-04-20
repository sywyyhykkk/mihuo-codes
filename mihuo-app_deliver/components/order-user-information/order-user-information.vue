<template>
	<view class="all">
		<view v-if="JSON.stringify(projectDetails) == '{}'" class="no-data-list order-no-data-list">
			<image class="no-image" src="/static/images/no_recommend.png" mode=""></image>
			<view class="no-title">暂无数据</view>
		</view>
		<view v-else class="order-user-information-contain">
			<view class="user-information-contain">
				<view class="user-address item">{{projectDetails.poiName}}{{projectDetails.address}}{{projectDetails.skillName}}{{setRole()}}
				</view>
				<view class="order-details" v-if="bottomType &&  Number(orderInfo.price) !== 0" >
					<view class="left">{{setUserRole()}}:</view>
					<view class="right">
						<text class="num">{{setAmount()}}元</text>
					</view>
				</view>
				<view class="item-latAddress" @click="navigation(projectDetails)">
					<view class="item-left">
						<image class="image-1" src="/static/images/icon-address/weizhi_1.png" mode=""></image>
						<view class="putlic-item-text item-lat-address">{{projectDetails.latAddress}}</view>
					</view>
					<view class="item-right">
						<image class="image-2" src="/static/images/icon-address/weizhi_2.png" mode=""></image>
						<text class="putlic-item-text">导航</text>
					</view>
				</view>
				<view class="user-information item-phone-contain">
					<view class="item-left">
						<image class="image-1" src="/static/images/icon-phone/call_4.png" mode=""></image>
						<text class="putlic-item-text item-customer-name">{{projectDetails.customerName}}</text>
						<text class="putlic-item-text item-text-phone"
							@click="callPhone(projectDetails.customerPhone)">{{projectDetails.customerPhone?projectDetails.customerPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'):''}}</text>
					</view>
					<image class="image-2" src="/static/images/icon-phone/call_5.png" mode=""></image>
				</view>
				<view class="construction-time item">
					<view class="item-left" v-if="setTime()">
						<image class="image-2" src="/static/images/time_2.png" mode=""></image>
						<text class="putlic-item-text putlic-item-text-time">合同工期</text>
						<text
							class="putlic-item-text">{{projectDetails && projectDetails.contractStartDate}}至{{projectDetails && projectDetails.contractFinishDate}}</text>
						<text class="putlic-item-text item-time">共{{setTime()}}天</text>
					</view>

				</view>
			</view>
			<!-- 默认project_status=0开工 project_status=1停工 project_status=2复工 project_status=3完工 -->
			<image src="/static/images/shutdown-status.png" v-if="projectDetails && projectDetails.projectStatus == 1"
				class="shutdown-status">
			</image>
			<slot></slot>
			<!-- <view class="flex-center" v-if="bottomType && projectDetails.statisticsDTO">
				<view class="item-contain">
					<view style="color: #FE4444" class="tag">
						{{projectDetails.statisticsDTO.dangerNum == 0?'--':projectDetails.statisticsDTO.dangerNum}}
					</view>
					<view class="text">风险</view>
				</view>
				<view class="item-contain">
					<view style="color: #FF9B26" class="tag ">
						{{Number(projectDetails.statisticsDTO.unfinishNum) !== 0?projectDetails.statisticsDTO.unfinishNum:'--'}}
					</view>
					<view class="text">未完成</view>
				</view>
				<view class="item-contain">
					<view style="color: #10BF78" class="tag ">
						{{projectDetails.statisticsDTO.finishNum == null ?'--':projectDetails.statisticsDTO.finishNum}}
					</view>
					<view class="text">已完成</view>
				</view>
				<view class="item-contain">
					<view style="color: #002FA5" class="tag " v-if="projectDetails.statisticsDTO.allNum">
						{{projectDetails.statisticsDTO.allNum}}
					</view>
					<view class="text">全部</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	export default {
		name:'order-user-information',
		props: {
			formDate: {
				type: Object,
				default: function() {
					return {};
				},
			},
			bottomType: {
				type: Boolean,
				default: false
			},
			projectId: {
				type: [String, Number],
				default: ''
			},
		},
		data() {
			return {
				communication: require("@/static/images/communication.png"),
				call: require("@/static/icon/Call.png"),
				positioning: require("@/static/images/icon-address/address-6.png"),
				projectDetails: {}
			}
		},
		mounted() {
			this.getProjectDetails()
		},
		computed: {
			...mapState(['orderInfo', 'projectInfo', 'userRole'])
		},
		methods: {
			getProjectDetails() {
				if (this.projectId || this.projectInfo.projectId) {
					this.$httpApi.getProjectDetails({
						id: this.projectId || this.projectInfo.projectId
					}).then(res => {
						if (res) {
							this.projectDetails = res
						}
					})
				}
			},
			setUserRole() {
				if (this.userRole == 'R_WORKER') {
					return '工费'
				} else {
					return '服务金额'
				}
			},
			setAmount() {
				return this.orderInfo.price || 0
			},
			navigation(user) {
				let {
					latitude,
					longitude
				} = this.projectDetails
				if (latitude === null && longitude === null) {
					this.$util.toast('当前项目未维护地址信息, 请维护地址后重试')
					return
				}
				if (latitude === 0 && longitude === 0) {
					this.$util.toast('当前项目未维护地址信息, 请维护地址后重试')
					return
				}
				// 获取位置的经纬度
				uni.openLocation({
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
					scale: 15
				})
			},
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			communicationIm() {
				this.$emit('communicationIm', this.formDate)
			},
			setRole() {
				switch (this.projectDetails.jobCode) {
					case 'JOB_MANAGER':
						return '服务'
					case 'JOB_SUPERVISION':
						return '服务'
					case 'JOB_DESIGNER':
						return '服务'
					case 'JOB_WORKER':
						return '施工'
				}
			},
			setTime() {
				let time = moment(this.projectDetails.contractStartDate).diff(this.projectDetails.contractFinishDate,'day')
				return  Math.abs(time) + 1  || 0
			}
		}
	}
</script>

<style lang="scss" scoped>
	.all {
		width: 100%;
	}

	.no-data-list {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 20rpx 0;
		background-color: #FFFFFF;
		margin: 8rpx 20rpx;
		border-radius: 10rpx;

		.no-image {
			width: 234rpx;
			height: 208rpx;
			margin-bottom: 18rpx;
		}

		.no-title {
			font-weight: 400;
			font-size: 13px;
			color: #A9B9DE;
		}
	}

	.flex-center {
		margin-top: 20rpx;
		align-items: center;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		// line-height: 100rpx;
		// grid-template-columns: auto auto auto auto;
		.item-contain {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.text {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 26rpx;
			line-height: 36rpx;
			text-align: center;
			color: #606166;
		}

		.tag {
			margin: 0 auto;
		}
	}
	
	.item-time{
		margin-left: 6rpx;
	}

	.shutdown-status {
		position: absolute;
		right: 34rpx;
		width: 80rpx;
		height: 80rpx;
		top: 116rpx;
	}

	.order-user-information-contain {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		// margin: 10rpx 20rpx;
		padding: 30rpx;
		position: relative;

		.header-title {
			border-bottom: 2rpx solid #EEEEEE;
			padding-bottom: 26rpx;
			display: flex;
			// justify-content: space-between;
			align-items: center;

			.date-con {
				font-size: 20rpx;
				text-align: center;
				border-radius: 10rpx;
				padding-left: 10rpx;
				padding-right: 10rpx;
				background: rgba($themeColor, 0.1);
				color: $themeColor;
				line-height: 40rpx;
				margin-left: 10rpx;
			}

			.date-con2 {
				font-size: 20rpx;
				text-align: center;
				border-radius: 10rpx;
				padding-left: 10rpx;
				padding-right: 10rpx;
				background: rgba(#FF5D35, 0.3);
				color: #FF5D35;
				line-height: 40rpx;
				margin-left: 10rpx;
			}

			.title-left {
				font-weight: 900;
				font-size: 30rpx;
				line-height: 42rpx;
				color: #303133;
				margin-right: 10rpx;
			}

			.title-right {
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #666666;
				display: flex;

				text {
					font-weight: 400;
					font-size: $middleFontSize;
					color: $fontColor66;
				}
			}
		}

		.user-information-contain {
			// padding-top: 26rpx;

			.item {
				margin-bottom: 10rpx;
				display: flex;
				align-items: center;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}

			.putlic-item-text {
				font-size: 26rpx;
				color: #606166;
				
			
				
			}

			.user-address {
				font-weight: bold;
				font-size: 30rpx;
				line-height: 42rpx;
				color: #303133;
			}

			.item-latAddress {
				display: flex;
				align-content: center;
				flex-direction: row;
				justify-content: space-between;
				margin-bottom: 14rpx;

				.item-lat-address {
					max-width: 552rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.item-left {
					display: flex;
					align-items: center;
				}

				.item-right {
					display: flex;
					align-items: center;
				}

				.image-1 {
					width: 32rpx;
					height: 32rpx;
					margin-right: 10rpx;
				}

				.image-2 {
					width: 24rpx;
					height: 22rpx;
					margin-right: 4rpx;
				}
			}

			.item-phone-contain {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				.item-left {
					display: flex;
					align-items: center;
				}

				.image-1 {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
				}

				.image-2 {
					width: 34rpx;
					height: 36rpx;
				}

				.item-customer-name {
					margin-right: 8rpx;
					line-height: 100%;

				}

				.item-text-phone {
					margin-right: 8rpx;
					line-height: 100%;
				}
			}

			.construction-time {
				display: flex;
				align-content: center;

				.item-left {
					display: flex;
					align-items: center;
				}

				.image-2 {
					margin-right: 10rpx;
					width: 30rpx;
					height: 30rpx;
				}

				.putlic-item-text-time{
					margin-right: 8rpx;
				}
			}

			.order-details {
				display: flex;
				margin-bottom: 18rpx;

				.left {
					color: #999999;
					font-weight: 400;
					font-size: 13px;
					margin-right: 10rpx;
				}

				.right {
					display: flex;

					image {
						width: 16rpx;
						height: 14rpx;
					}

					.num {
						font-weight: 400;
						font-size: 13px;
						color: #FF5D35;
						margin-right: 10rpx;
					}

					.text-details {
						display: flex;
						flex-direction: row;
						align-items: center;

						text {
							font-weight: 400;
							font-size: 12px;
							color: #002FA5;
							margin-right: 10rpx;
						}
					}
				}
			}

		}

		.public-label {
			flex: 1.7;
			color: #999999;
			font-size: 26rpx;
			line-height: 36rpx;
			white-space: nowrap;
			margin-right: 10rpx;
		}

		.public-value {
			flex: 8.3;
			display: flex;
			align-items: center;

			text {
				color: #999999;
				line-height: 36rpx;
				font-size: 26rpx;
			}

			.middle {
				max-width: 340rpx;
				@include bov(1);
			}

			.item-right {
				margin-right: 16rpx;
			}
		}

		.positioning {
			width: 40rpx;
			height: 40rpx;
		}

		.call {
			width: 28rpx;
			height: 28rpx;
		}
	}

	.task-statistics {
		background: #fff;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 20rpx;
		flex-direction: row;
	}
</style>
