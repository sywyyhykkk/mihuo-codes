<template>
	<view class="item-site" @click="$emit('click',info)">
		<view class="content">
			<view class="name">
				<text class="left" :class="[getOrderStatus(info.projectStatus) ? 'left-max':'left-defautl']">{{info.way}}</text>
				<text v-if="getOrderStatus(info.projectStatus)" class="item-status"
					:style="getStyle(info.projectStatus)">{{getOrderStatus(info.projectStatus)}}</text>
			</view>
			<view class="item-margin_top display-align_center address">
				<image class="icon-image" src="@/static/images/icon-address/weizhi.png" mode="">
				</image>
				<text class="item-value">{{info.poiName}}{{info.address}}</text>
			</view>
			<view class="item-margin_top display-align_center user">
				<image class="icon-image" src="@/static/images/icon_user/icon_user_4.png" mode="">
				</image>
				<text class="item-value">{{info.customerName}} {{$util.phoneConfound(info.customerPhone)}}</text>
			</view>
			<view class="item-margin_top display-align_center time">
				<image class="icon-image" src="@/static/images/time_3.png" mode=""></image>
				<text class="item-value">{{info.contractStartDate}}至{{info.contractFinishDate}}</text>
			</view>
			<view v-if="info.manager || info.designer" class="item-margin_top display-align_center user-list">
				<image class="icon-image" src="@/static/images/icon_user/icon_user_4.png" mode="">
				</image>
				<view class="item-user display-align_center">
					<text v-if="info.manager" class="skill-contain">
						<text class="skill">({{info.manager.skillName}})</text>
						<text class="user-name">{{info.manager.name}} </text>
					</text>
					<text v-if="info.designer" class="skill-contain">
						<text class="skill">({{info.designer.skillName}})</text>
						<text class="user-name">{{info.designer.name}} </text>
					</text>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="item-num" v-for="(item,index1) in taskStatistics" :key="index1">
				<text class="num" :style="{color:item.color}">{{item.value || '--'}}</text>
				<text class="text">{{item.label}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				option: {},
				taskStatisticsList: [{
						label: '风险',
						value: 1,
						color: '#FE4444'
					},
					{
						label: '未完成',
						value: 2,
						color: '#FF9B26'
					},
					{
						label: '已完成',
						value: 3,
						color: '#10BF78'
					},
					{
						label: '全部',
						value: 5,
						color: '#002FA5'
					}
				],
				
				orderStatus: [
					{
						name: '施工中',
						color: '#002FA5',
						background: 'rgba(241, 244, 252, 1)',
						value: 2
					},
					{
						name: '施工中',
						color: '#002FA5',
						background: 'rgba(241, 244, 252, 1)',
						value: 0
					},
					{
						name: '未开始',
						color: '#909199',
						background: 'rgba(245,246,247,1)',
						value: -1
					}, {
						name: '已停工',
						color: '#FF5D35',
						background: 'rgba(251,242,244,1)',
						value: 1
					}, {
						name: '已完工',
						color: '#5AC27F',
						background: 'rgba(237,249,244,1)',
						value: 3
					}
				],
			}
		},
		computed: {
			taskStatistics() {
				if(this.info.statisticsDTO){
					this.taskStatisticsList[0].value = this.info.statisticsDTO.dangerNum
					this.taskStatisticsList[1].value = this.info.statisticsDTO.unfinishNum
					this.taskStatisticsList[2].value = this.info.statisticsDTO.finishNum
					this.taskStatisticsList[3].value = this.info.statisticsDTO.allNum
				}
				return this.taskStatisticsList
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getOrderStatus(index) {
				// project_status=-1 未开工 project_status=0开工 project_status=1停工 project_status=2复工 project_status=3完工
				let resutl = this.orderStatus.find(item => item.value == index)
				return resutl?.name
			},
			getStyle(index) {
				let resutl = this.orderStatus.find(item => item.value == index)
				if (resutl) {
					return `color:${resutl.color};background:${resutl.background}`
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.icon-image {
		width: 32rpx;
		height: 32rpx;
		margin-right: 4rpx;
		vertical-align: middle;
	}

	.item-margin_top {
		margin-top: 14rpx;
	}

	.item-status {
		width: 88rpx;
		height: 42rpx;
		display: inline-block;
		border-radius: 10rpx 0rpx 10rpx 0rpx;
		font-size: 24rpx;
		background: rgba(241, 244, 252, 1);
		color: $themeColor;
		text-align: center;
		line-height: 42rpx;
		white-space: nowrap;
	}

	.item-site {
		display: flex;
		flex-direction: column;
		border-radius: 10rpx;
		margin-bottom: 10rpx;
		padding: 20rpx 20rpx 40rpx 20rpx;
		background-color: #fff;

		&:last-child {
			margin-bottom: 0rpx;
		}

		.item-value {
			color: $seconFontColor;
			font-size: $middleFontSize;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.name {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				color: $seconFontColor;
				font-size: 32rpx;
				font-weight: bold;
			}
			.left-defautl{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.left-max{
				max-width: 540rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			
		}

		.skill-contain {
			margin-right: 20rpx;

			.skill,
			.user-name {
				color: $seconFontColor;
				font-size: $middleFontSize;
			}
		}

		.bottom {
			display: flex;
			margin-top: 40rpx;

			.item-num {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.num {
				font-size: $mainFontSize;
			}

			.text {
				font-size: $smallFontSize;
			}
		}

	}
</style>
