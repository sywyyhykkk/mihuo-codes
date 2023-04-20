<template>
	<view class="sop-information" @click="$emit('click',info)">
		<view class="sop-top">
			<view class="item-left">
				<view class="item-sop_name">
					<text class="sop-status_name"
						:class="getNodeStatus(info) && getNodeStatus(info).class">{{getNodeStatus(info).text}}</text>
					<text class="sop-name"
						:class="[getNodeNameiNdent(info.nodeName) ? 'item-time-indent':'']">{{info.nodeName}}</text>

				</view>
				<view class="item-sop_time">
					<text v-if="info.expectFinishTime"
						class="item-time">{{info.expectStartTimeTemp}}-{{info.expectFinishTimeTemp}}</text>
					<text v-if="info.expectFinishTime && info.diffTime" class="item-time_num">共{{info.diffTime}}天</text>

					<text v-if="info.planDay !== 0 && info.status != 3 && getDateNumber(
										info.expectFinishTime,
										info.realEndTime,
										getStatus(info)
									  ).time &&  getNodeStatus(info) && getNodeStatus(info).text !== '等待中' "
						:class="[getDateNumber(info.expectFinishTime, info.realEndTime).status ? 'default-time' : 'beyond-the']">
						{{
									  getDateNumber(
										info.expectFinishTime,
										info.realEndTime,
										getStatus(info)
									  ).time
									}}
					</text>
				</view>
			</view>
			<view class="item-right">
				<image v-if="show" src="@/static/icon/arrow.png" class="right-icon">
				</image>
				<image v-else src="@/static/images/icon_arrow/arrow_1.png" class="right-icon_1" mode=""></image>
			</view>
		</view>
		<view class="sop-bottom">
			<view class="item-sop-bottom" v-if="getNodeStatus(info).text == '未开始'">
				<text class="item-time">预计</text>
				<text class="item-time-warring">{{info.expectStartTime && info.expectStartTimeTemp}}</text>
				<text class="item-time">开始</text>
			</view>
			<view class="item-sop-bottom" v-if="getNodeStatus(info).text == '已完成'">
				<text class="item-time">已于</text>
				<text class="item-time-success">{{info.realEndTimeTemp}}</text>
				<text class="item-time">完成</text>
			</view>
			<view class="item-sop-bottom" v-if="getNodeStatus(info).text == '已开始'">
				<text class="item-time"
					:class="[getNodeNameiNdent(info.nodeName) ? 'item-time-indent':'']">{{info.nodeName}}</text>
				<text class="item-time-warring">{{info.realStartTimeTemp}}</text>
				<text class="item-time">已开始</text>
				<text class="item-time" v-if="info.expectFinishTime">，预计{{info.expectFinishTimeTemp}}完成</text>
			</view>
			<view class="item-sop-bottom" v-if="getNodeStatus(info).text == '等待中'">
				<text class="item-time item-time-success">
					<text class="item-time">等待</text>
					{{getTips(info,'preNodes')}}
					<text class="item-time">完成后开始</text>
				</text>
			</view>
			<view class="item-sop-bottom" v-if="getNodeStatus(info).text == '待审核'">
				<text class="item-time" v-for="(item2,index2) in info.reviews" :key="index2">
					<text class="item-time">{{item2.userType == 1 ? '业主': item2.skillName + item2.personName}}</text>
					<text class="item-time">{{item2.reviewTime ? getReviewTime(item2.reviewTime):''}}</text>
					<text class="item-time item-time-warring">{{getStatusName(item2.status)}}</text>
					{{index2+1 == info.reviews.length ? '':'，' }}
				</text>
			</view>
			<view class="item-sop-bottom" v-if="getNodeStatus(info).text == '待整改'">
				<text class="item-time">
					{{getTips(info,'acceptanceInfos')}}
				</text>
			</view>
			<view class="item-sop-bottom" v-if="getNodeStatus(info).text == '审核失败'">
				<text class="item-time">
					{{getTips(info,'reviewsError')}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	export default {
		name: 'sop-information',
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			show: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				option: {}
			}
		},
		computed: {

		},
		mounted() {

		},
		methods: {
			getNodeNameiNdent(name) {
				if (name.indexOf('【') !== -1) {
					return true
				} else {
					return false
				}
			},
			getStatus(item) {
				if (item.status == 3 || (item.status == 1 && item.taskType == '1002')) {
					return true
				} else {
					return false
				}
			},
			getNodeStatus(item) {
				let tempResult = {
					text: '',
					class: ''
				}
				if (item.businessType == 1005) {
					switch (item.checkStatus) {
						case 0:
							tempResult = this.setTempResult(item)
							break;
						case 1:
							tempResult = {
								text: '可验收',
								class: 'task-check'
							}
							break;
						case 2:
							tempResult = {
								text: '待整改',
								class: 'task-status4'
							}
							break;
						case 3:
							tempResult = this.setTempResult(item)
							break;
						default:
							tempResult = this.setTempResult(item)
							break
					}
				} else {
					tempResult = this.setTempResult(item)
				}
				return tempResult
			},
			setTempResult(item) {
				// 任务状态 0=未开始；1=等待中 2=执行中 3=执行结束（完工）4=异常 5=待审查 6=审核失败  10=等待中(有前置节点)
				const tempResultMap = {
					1: {
						text: '等待中',
						class: 'task-waiting'
					},
					2: {
						text: '已开始',
						class: 'task-status2'
					},
					3: {
						text: '已完成',
						class: 'task-status3'
					},
					5: item.reviewFlag && {
						text: '待审核',
						class: 'task-status2'
					},
					6: {
						text: '审核失败',
						class: 'task-status2'
					},
					10: {
						text: '等待中',
						class: 'task-waiting'
					},
					0: {
						text: '未开始',
						class: 'task-waiting'
					}
				}
				return tempResultMap[item.status] ?? {
					text: '未开始',
					class: 'task-waiting'
				}
				// return tempResultMap[item.status] ?? {
				// 	text: '未开始',
				// 	class: 'task-waiting'
				// }
			},

			getReviewTime(time) {
				return moment(time).format('MMMDo')
			},
			getStatusName(status) {
				let tempMap = {
					1: '审查不通过',
					2: '审查通过',
					0: '确认中'
				}
				return tempMap[status] ?? ''
			},
			getTips(item, type) {
				let result = ''
				switch (type) {
					case 'preNodes':
						if (item.preNodes) {
							let resultName = ''
							item.preNodes.forEach((ev, index) => {
								resultName +=
									`${ev.nodeName}${index+1 == item.preNodes.length ? '':'、'  }`
							})
							result = `${resultName}共${item.preNodes.length}项工作`
						} else {
							result = ''
						}
						break
					case 'reviews':
						if (item.reviews) {
							item.reviews.forEach((ev, index) => {
								result +=
									`${ev.userType == 1 ? '业主': ev.skillName + ev.personName }${ev.reviewTime ? this.getReviewTime(ev.reviewTime):''}${this.getStatusName(ev.status)}${index+1 == item.reviews.length ? '':'，'  }`
							})
						} else {
							result = ''
						}
						break
					case 'acceptanceInfos':
						if (item.acceptanceInfos) {
							let acceptanceInfo = item.acceptanceInfos[0]
							if (acceptanceInfo) {
								result =
									`${acceptanceInfo.acceptanceCreateTime}${acceptanceInfo.statusFlag==2 ? '验收不通过':''}有${acceptanceInfo.unqualifiedCount}个事项待整改`
							} else {
								result = ''
							}
						} else {
							result = ''
						}
						break
					case 'reviewsError':
						if (item.reviews) {
							let resultList = []
							item.reviews.forEach((ev, index) => {
								if (ev.status == 1) {
									resultList.push(ev)
								}
							})
							resultList.forEach((ev, index) => {
								result +=
									`${ev.userType == 1 ? '业主': ev.skillName + ev.personName }${ev.reviewTime ? this.getReviewTime(ev.reviewTime):''}${this.getStatusName(ev.status)}${index+1 == resultList.length ? '':'，'  }`
							})
						} else {
							result = ''
						}
						break
				}

				return result
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.item-time-indent {
		text-indent: -0.5em;
	}

	.right-icon {
		width: 48rpx;
		height: 48rpx;
	}

	.right-icon_1 {
		width: 32rpx;
		height: 32rpx;
	}

	.task-status2 {
		background: rgba(250, 208, 160, 0.3);
		color: #ff5d35;
	}

	.task-waiting {
		background: rgba(218, 218, 218, 0.3);
		color: #909199;
	}


	.task-status3 {
		background: #d5ffee;
		color: #10c57d;
	}


	.task-check {
		background: rgba(0, 47, 165, 0.1);
		color: #002FA5;
	}

	.task-status4 {
		background: linear-gradient(180deg, rgba(253, 131, 139, 0.1) -5%, rgba(252, 103, 101, 0.1) 100%);
		color: #EB3D32;
	}

	.sop-top {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.item-sop_name {
			margin-bottom: 8rpx;

			.sop-name {
				color: #303133;
				font-size: 28rpx;
				line-height: 36rpx;
			}

		}


		.beyond-the {
			margin-left: 20rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 26rpx;
			line-height: 36rpx;
			color: $errorColor;
			white-space: nowrap;
		}

		.default-time {
			margin-left: 20rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 26rpx;
			line-height: 36rpx;
			color: $themeColor;
		}



		.sop-status_name {
			// line-height: 34rpx;
			padding: 2rpx 8rpx;
			border-radius: 8rpx;
			font-size: 24rpx;
			margin-right: 2rpx;
			white-space: nowrap;
			margin-left: -8rpx;

			transform: scale(0.85);
			display: inline-block;
			transform-origin: center;
		}

		.item-sop_time {
			color: #606166;
			font-size: 26rpx;
			line-height: 36rpx;


			.item-time {
				color: #606166;
				font-size: 24rpx;
			}

			.item-time_num {
				color: #606166;
				font-size: 24rpx;
				margin-left: 16rpx;
			}
		}
	}

	.sop-bottom {
		margin-top: 10rpx;

		.item-sop-bottom {
			display: flex;
			align-items: center;
			transform: scale(0.9);
			transform-origin: left;
			flex-wrap: wrap;
		}

		.item-time {
			color: #909199;
			font-size: 24rpx;
			line-height: 36rpx;
		}

		.item-time-warring {
			color: #FF5D35;
			font-size: 24rpx;
			line-height: 36rpx;
		}

		.item-time-success {
			color: #10c57d;
			font-size: 24rpx;
			line-height: 36rpx;
		}
	}
</style>
