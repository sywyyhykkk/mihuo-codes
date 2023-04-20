<template>
	<view>
		<view class="accept">
			<view class="accept-top">
				<view class="top-title">
					{{data.acceptanceCreatePersonName}}(第{{data.times}}次){{nodeInfo.nodeName}}验收
				</view>
				<view class="ite-right">
					<view class="top-number">{{data.score}}分</view>
					<view class="top-status" style="color:#FF5D35" v-if="data.statusFlag==0"> 待验收</view>
					<view class="top-status" v-if="data.statusFlag==1">验收通过</view>
					<view class="top-status" style="color:#FF5D35" v-if="data.statusFlag==2">未通过</view>
				</view>
			</view>
			<view class="accept-item">
				<!-- 内部验收 -->
				<view class="accept-item-contain" :class="[Number(data.checkType) === 1 && 'internal']"
					v-if="Number(data.checkType) === 1">
					<view class="accept-item-contain-all">
						<u-avatar class="node" size="36" :src="$util.thumbnailImage(data.acceptanceAvatar,true)">
						</u-avatar>
						<view class="item-name">{{data.acceptanceName}}({{data.acceptanceSkillName}})</view>
						<view class="item-date" v-if="data.applyTime">{{data.applyTime.substring(0,16)}}发起验收</view>
					</view>
					<view class="item-applyDesc">{{data.applyDesc}}</view>
				</view>

				<view class="accept-item-contain" v-else>
					<u-avatar class="node" size="36" :src="$util.thumbnailImage(data.avatar,true)"></u-avatar>
					<view class="item-name">{{data.acceptanceCreatePersonName}}({{data.skillName}})</view>
					<view class="item-date" v-if="data.acceptanceCreateTime">
						{{data.acceptanceCreateTime.substring(0,16)}}发起验收
					</view>
				</view>
			</view>
			<!-- <view class="accept-text" v-if="data.checkDesc">{{data.checkDesc}}</view> -->
			<view class="content-text2">
				<view class="item-count">
					<view class="status-dot1" v-if="data.qualifiedCount+data.unqualifiedCount">
						{{data.qualifiedCount+data.unqualifiedCount+data.notCount}}项验收
					</view>
					<view class="status-dot2" v-if="data.qualifiedCount">{{data.qualifiedCount}}项合格</view>
					<view class="status-dot3" v-if="data.unqualifiedCount">{{data.unqualifiedCount}}项不合格</view>
					<view class="status-dot4" v-if="data.notCount">{{data.notCount}}项未验收</view>
				</view>
				<view class="list-right" @click="goAcceptDetial(data.id)" v-if="data.statusFlag!=0">
					<view class="right-status">查看详情</view>
					<image :src="'../../static/images/shouqi.png'" class="right-image"></image>
				</view>
			</view>
			<view class="accept-bottom" v-if="data.statusFlag==0" @click="goAccept(data)">
				<view class="right-status">去验收</view>
				<image :src="'../../static/images/shouqi.png'" class="right-image"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		props: {
			data: {
				type: Object,
				default: {}
			},
			bottomType: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {

			}
		},
		computed: {
			...mapState(['nodeInfo']),
		},
		mounted() {
		},
		methods: {
			goAccept(data) {
				let parameter ={
					id:data.id,
					applyPersonId:data.applyPersonId,
					avatar:data.acceptanceAvatar,
					skillName:data.acceptanceSkillName,
					name:data.acceptanceName,
					time:data.applyTime,
					skillId:data.skillId
				}
				uni.navigateTo({
					url: '/pages/construction/acceptance/acceptanceManagement',
					success: (res) => {
						res.eventChannel.emit('getAcceptanceManagement', parameter);
					}
				})
			},
			goAcceptDetial(id) {
				this.toPage(`/pages/construction/acceptance/acceptanceDetails?detialId=${id}`)
			}

		}
	}
</script>

<style lang="scss" scoped>
	.right-status {
		font-weight: normal;
		font-size: 24rpx;
		text-align: right;
		color: #002FA5;
	}

	.right-image {
		width: 16rpx;
		height: 16rpx;
		transform: rotate(-90deg);
		margin-left: 10rpx;
	}

	.content-text2 {
		font-weight: bold;
		font-size: 26rpx;
		color: #303133;
		flex: 1;
		display: flex;
		margin-top: 10rpx;

		.item-count {
			flex: 1;
			display: flex;
			flex-wrap: wrap;
		}

		.list-right {
			float: right;
			margin-left: 40rpx;
			height: 40rpx;
			display: flex;
			align-items: center;

		}

		.status-dot1 {
			background: #EFF6FF;
			border-radius: 50rpx;
			line-height: 40rpx;
			font-weight: 500;
			font-size: 20rpx;
			color: $themeColor;
			padding-left: 10rpx;
			padding-right: 10rpx;
			margin-right: 20rpx;
			margin-bottom: 8rpx;

		}

		.status-dot2 {
			background: #D8FFF0;
			border-radius: 50rpx;
			line-height: 40rpx;
			font-weight: 500;
			font-size: 20rpx;
			color: #3BC548;
			padding-left: 10rpx;
			padding-right: 10rpx;
			margin-right: 20rpx;
			margin-bottom: 8rpx;

		}

		.status-dot3 {
			background: #FFF2E9;
			border-radius: 50rpx;
			line-height: 40rpx;
			font-weight: 500;
			font-size: 20rpx;
			color: #FF5D35;
			padding-left: 10rpx;
			padding-right: 10rpx;
			margin-right: 20rpx;
			margin-bottom: 8rpx;
		}

		.status-dot4 {
			background: #f5f5f5;
			border-radius: 50rpx;
			line-height: 40rpx;
			font-weight: 500;
			font-size: 20rpx;
			color: #aaa4a4;
			padding-left: 10rpx;
			padding-right: 10rpx;
			margin-right: 20rpx;
		}
	}

	.accept {
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 0rpx 20rpx;
		padding: 50rpx 30rpx 30rpx 50rpx;

		.accept-bottom {
			padding-top: 30rpx;
			font-weight: normal;
			font-size: 24rpx;
			color: #002FA5;
			border-top: 2rpx dashed #EEEEEE;
			margin-top: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.accept-text {
			margin-top: 20rpx;
			font-weight: normal;
			font-size: 26rpx;
			line-height: 36rpx;
			color: #303133;
		}

		.accept-item {
			display: flex;
			align-items: center;
			padding-top: 20rpx;

			.internal {
				flex-direction: column !important;
			}

			.accept-item-contain {
				display: flex;
				align-items: center;
				flex: 1;
				flex-direction: row;
				justify-content: flex-start;

				.accept-item-contain-all {
					display: flex;
					align-items: center;
					flex-direction: row;
					margin-bottom: 22rpx;
					width: 100%;

				}

				.item-applyDesc {
					font-size: 26rpx;
					color: #303133;
					display: flex;
					width: 100%;
					margin-bottom: 14rpx;
				}

			}

			.item-name {
				font-weight: normal;
				font-size: 24rpx;
				color: #606166;
				margin-left: 10rpx;
			}

			.item-date {
				font-weight: normal;
				font-size: 24rpx;
				color: #909199;
				margin-left: 20rpx;
			}

			.item-image {
				width: 32rpx;
				height: 32rpx;
				border-radius: 32rpx;
			}
		}

		.accept-top {
			display: flex;
			justify-content: space-between;

			.ite-right {
				display: flex;
			}

			.top-title {
				font-weight: bold;
				font-size: 30rpx;
				color: #333333;
				max-width: 460rpx;

			}

			.top-number {
				font-weight: bold;
				font-size: 28rpx;
				text-align: right;
				color: #002FA5;
				margin-right: 20rpx;
				min-width: 80rpx;
			}

			.top-status {
				font-weight: normal;
				font-size: 26rpx;
				text-align: right;
				color: #10C57D;
				min-width: 104rpx;
				white-space: nowrap;

			}
		}
	}
</style>
