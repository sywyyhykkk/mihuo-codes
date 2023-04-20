<template>
	<view>
		<view class="step">
			<view class="step-top">
				<image src="../../static/icon/Group8813.png" class="group_image"></image>
				<view class="step_title">{{workerView.skillName}}</view>
				<view class="top-right" @click="cutArrow">
					<view class="right-text">{{arrowStatus?'点击收起':'点击展开'}}</view>
					<image :src="'../../static/icon/home/home_button9.png'"
						:class="arrowStatus?'right-image':'right-image2'"></image>
				</view>
			</view>
			<view class="step-plan">
				<view class="plan-person" v-if="workerView.personVOList && workerView.personVOList.length > 0">
					<u-avatar size="48" v-for="(item,index) in workerView.personVOList" :key="index"
						:src="$util.thumbnailImage(item.avatar,false)" mode="circle" class="portrait">
					</u-avatar>
					<view class="person-text" style="margin-left: 30rpx;">
						{{workerView.personVOList&&workerView.personVOList.length>1?'...':''}}
					</view>
					<view class="person-text">
						{{
						workerView.personVOList ? workerView.personVOList.length > 1 ? `${workerView.personVOList[0].name}等${workerView.personVOList.length}人努力搬砖中`
						: `${workerView.personVOList[0].name}努力搬砖中`:'暂无人员'
						}}
					</view>
				</view>
				<view class="empty-text" v-else>
					暂时还没有指派人~
				</view>
				<view class="finish-plan">
					<view class="finish-text">完成进度</view>
					<view class="finish-number">
						<view class="num-text"
							:style="`margin-left:calc((${Number(workerView.percent)>80?80:Number(workerView.percent)}/100) * 474rpx)`">
							{{workerView.percent?workerView.percent+'%':''}}
						</view>
						<view class="num" v-if="workerView.percent"
							:style="`width:calc((${workerView.percent}/100) * 474rpx)`"></view>
					</view>
				</view>
			</view>
			<view class="step-dot" v-for="(item,index) in workerView.nodeList" v-if="arrowStatus" :key="index">
				<view class="dot-index">{{index<9?'0'+(index+1):index+1}}</view>
				<view class="dot-title">{{item.nodeName}}</view>
				<!-- <view class="dot-status">已完成</view> -->
				<view class="dot-status3"
					v-if="(item.status<=1&&item.businessType!='1002')||(item.status==0&&item.businessType=='1002')">
					未开始</view>
				<view class="dot-status2" v-if="item.status==2">进行中</view>
				<view class="dot-status" v-if="item.status==3||(item.status==1&&item.businessType=='1002')">已完成</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		props: {
			workerView: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				arrowStatus: false
			}
		},
		mounted() {
			console.log(this.workerView)
		},
		methods: {
			cutArrow() {
				this.arrowStatus = !this.arrowStatus
			}

		}
	}
</script>

<style scoped lang="scss">
	.step {
		margin: 20rpx;
		padding: 40rpx 30rpx 0rpx 30rpx;
		background: #FFFFFF;
		border-radius: 16rpx;

		.step-dot {
			display: flex;
			height: 110rpx;
			margin: 0 10rpx 0 16rpx;
			align-items: center;
			border-top: 2rpx solid #F6F6F6;

			.dot-index {
				font-weight: bold;
				font-size: 26rpx;
				color: #D5D5D5;
			}

			.dot-title {
				font-weight: normal;
				font-size: 26rpx;
				color: #303133;
				margin-left: 10rpx;
			}

			.dot-status {
				background: #D5FFEE;
				border-radius: 50rpx;
				font-weight: normal;
				font-size: 20rpx;
				line-height: 40rpx;
				color: #10C57D;
				padding-left: 10rpx;
				padding-right: 10rpx;
				margin-left: 20rpx;
			}

			.dot-status3 {
				line-height: 40rpx;
				padding-left: 10rpx;
				padding-right: 10rpx;
				background: #EFEFEF;
				border-radius: 40rpx;
				font-size: 20rpx;
				color: #909199;
				margin-left: 16rpx;
			}

			.dot-status2 {
				line-height: 40rpx;
				padding-left: 10rpx;
				padding-right: 10rpx;
				background: #FAD0A0;
				opacity: 0.3;
				border-radius: 40rpx;
				font-size: 20rpx;
				color: #FF5D35;
				margin-left: 16rpx;
			}



		}

		.step-plan {
			padding-left: 20rpx;
			padding-bottom: 20rpx;

			.finish-plan {
				display: flex;
				align-items: center;
				height: 36rpx;

				.finish-text {
					font-weight: normal;
					font-size: 26rpx;
					color: #606166;
					margin-right: 20rpx;
				}

				.finish-number {
					width: 474rpx;
					height: 8rpx;
					background: #E4E4E4;
					border-radius: 72rpx;

				}

				.num-text {
					font-weight: bold;
					font-size: 26rpx;
					line-height: 36rpx;
					color: #013E75;
					margin-top: -36rpx;
				}

				.num {
					height: 8rpx;
					border-radius: 72rpx;
					background: linear-gradient(90deg, #0E6ABC 0%, #013E75 100%);
				}
			}

			.empty-text {
				font-weight: normal;
				font-size: 24rpx;
				color: #909199;
				margin: 20rpx 0;
			}
			
			.plan-person {
				display: flex;
				align-items: center;
				height: 100rpx;

				.person-text {
					font-weight: normal;
					font-size: 24rpx;
					color: #909199;
					margin-left: 10rpx;
				}

				.person-image {
					width: 48rpx;
					height: 48rpx;
					border-radius: 48rpx;
					margin-right: -20rpx;

				}
			}
		}

		.step-top {
			display: flex;
			height: 44rpx;
			align-items: center;

			.top-right {
				display: flex;
				height: 44rpx;
				align-items: center;

				.right-text {
					font-size: 26rpx;
					color: #A7A7A7;
				}

				.right-image {
					width: 16rpx;
					height: 16rpx;
					margin-left: 10rpx;
					transform: rotate(90deg);
					-ms-transform: rotate(90deg);
					/* IE 9 */
					-moz-transform: rotate(90deg);
					/* Firefox */
					-webkit-transform: rotate(90deg);
					/* Safari and Chrome */
					-o-transform: rotate(90deg);
					/* Opera */
					transition: all .2s;
				}

				.right-image2 {
					width: 16rpx;
					height: 16rpx;
					margin-left: 10rpx;
				}
			}


			.step_title {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #303133;
				flex: 1;
			}

			.group_image {
				height: 32rpx;
				width: 44rpx;
				margin-right: 10rpx;

			}
		}

	}
</style>
