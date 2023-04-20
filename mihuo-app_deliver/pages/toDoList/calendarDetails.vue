<template>
	<view class="calendar-details">

		<z-nav-bar backState="1000" bgColor="#fff" fontColor="#979797">
			<view slot="default" class="nav-bar">
				<view class="text-time">
					{{displayYear}}年{{displayMonth}}月
				</view>
			</view>
			<view slot="right">
				<view class="right-contian">
					<view class="left" @click="lastMonth">
						<image src="@/static/images/vector_1.png" style="height: 32rpx; width: 18rpx;"></image>
					</view>
					<view class="right" @click="nextMonth">
						<image src="@/static/images/vector_2.png" style="height: 32rpx; width: 18rpx;"></image>
					</view>
				</view>
			</view>
		</z-nav-bar>

		<view class="calendar-contian">
			<view class="align-center" style="justify-content: center; flex-direction: column;">
				<!-- 星期 -->
				<view class="weekday">
					<view class="day">
						一
					</view>
					<view class="day">
						二
					</view>
					<view class="day">
						三
					</view>
					<view class="day">
						四
					</view>
					<view class="day">
						五
					</view>
					<view class="day">
						六
					</view>
					<view class="day">
						日
					</view>
				</view>
				<view class="days">
					<!-- <view class="day"
						:class="[day.day === selectedDay? 'day-select':'',dayCurrent  == '' ? '': dayCurrent == day.day ?  'day-active':'' ]"
						v-for="(day, index) in isShowMore? getMonth : getWeek" @click="checkTodo(day)" :key="index">
						<text class="item-day">{{day.day}}</text>
						<text class="item-spot" v-if="day.day"></text>
						<view v-if="day.day === selectedDay " class="item-text">
							今
						</view>
					</view> -->
				</view>
			</view>
			
			<view class="item-statistics">
				<text class="item-text">在做项目2 </text>
				<text class="item-text">在做任务12</text>
			</view>
			<view class="project-contain">
				<view class="project-list" v-for="(item,index) in 3">
					<view class="project-title">
						<view class="item-title">昆明市西山区龙湖锦粼天序2202</view>
						<view class="item-sign">
							<view class="item-weekend">
								<view class="item-text-weekend">
									周末不施工
								</view>
							</view>
							<view class="item-other">
								<view class="item-text-other">
									节假日施工
								</view>
							</view>
						</view>
					</view>

					<view class="node-contain">
						<view class="node-list" v-for="(item,index) in 2" :class="setColor(index)">
							<text class="item-left">量房</text>
							<text class="item-right">未开始</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from "@/static/js/moment.js"
	export default {
		data() {
			return {
				option: {},
				isShowMore: true,
				month: [],
				currentMonth: moment().month() + 1,
				displayMonth: -1,
				displayYear: moment().year(),
				selectedDay: moment().date(),
				maxLast: 1,
				maxNext: 1,
				todayTodo: [], //待开工
				todayDoing: [], //开工中
				todayDone: [], //待结算
				monthTodo: [], //月度待开工
				showTodayTodo: true,
				showTodayDoing: true,
				showTodayDone: true,
				dayCurrent: '',
				maximumQueryMonth: 3, //搜索范围前后3个月以内
				nodeStatusList: [{
					status: 1,
					background: `linear-gradient(270deg, #FFF3F3 47%, rgba(243,246,255,0.00) 98%)`,
					class:'item-default'
				},
				{
					status: 2,
					background: `linear-gradient(270deg, #F3F6FF 5%, rgba(243,246,255,0.00) 97%)`,
					class:'item-waring'
				},
				]
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.displayMonth = this.currentMonth;
		},
		methods: {
			setColor(event) {
				let temp = this.nodeStatusList.find(item => item.status == event)
				if(temp){
					return temp.class
				}else{
					return this.nodeStatusList[1].class
				}
			}
		}
	}
</script>
<style>
	page {
		background-color: #fff;
	}
</style>


<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	
	
	.right-contian {
		width: 100rpx;
		display: flex;
		align-items: center;
	
		.left {
			margin-right: 32rpx;
		}
	}
	
	.calendar-details {

		.calendar-contian {
			
			.align-center {
				display: flex;
				align-items: center;
			}
			
			.weekday {
				margin-top: 20rpx;
				height: 80rpx;
				width: 660rpx;
				display: grid;
				grid-template-columns: repeat(auto-fill, 50rpx);
				grid-column-gap: 50rpx;
			
				.day {
					font-size: 24rpx;
					color: #C8D2E3;
			
				}
			}
			

			.item-statistics {

				display: flex;
				padding-left: 36rpx;

				.item-text {
					color: #8EA0B6;
					font-size: 30rpx;

					&:nth-of-type(2) {
						margin-left: 24rpx;
					}
				}
			}

			.project-contain {
				padding: 0 36rpx;
				margin-top: 40rpx;

				.project-list {
					margin-bottom: 40rpx;

					.project-title {

						.item-title {
							color: #303133;
							font-size: 30rpx;
							line-height: 40rpx;
						}

						.item-sign {
							display: flex;

							.item-weekend {
								height: 40rpx;
								border-radius: 10rpx;
								background: #FFEBE6;
								margin-right: 10rpx;
								padding: 0rpx 6rpx;

							}

							.item-text-weekend {
								line-height: 40rpx;
								font-size: 20rpx;
								transform: scale(0.85);
								color: #FF5D35;
							}

							.item-other {
								height: 40rpx;
								border-radius: 10rpx;
								background: #E1E9FF;
								margin-right: 10rpx;
								padding: 0rpx 6rpx;
							}

							.item-text-other {
								line-height: 40rpx;
								font-size: 20rpx;
								transform: scale(0.85);
								color: #002FA5;
							}
						}
					}

					.node-contain {
						margin-top: 30rpx;

						.node-list {
							border-radius: 16rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							padding: 26rpx 32rpx;
							margin-bottom: 6rpx;

							.item-left {
								font-size: 30rpx;
								color: #82868B;
							}

							.item-right {
								font-size: 24rpx;
							}
						}
						
						.item-default{
							background: linear-gradient(270deg, #F3F6FF 5%, rgba(243,246,255,0.00) 97%);
							.item-right{
								color: #82868B;
							}
						}
						
						.item-waring{
							color: #FF5D35;
							background: linear-gradient(270deg, #FFF3F3 47%, rgba(243,246,255,0.00) 98%);
							.item-right{
								color: #FF5D35;
							}
						}
					}
				}
			}


		}
	}
	
	.days {
		width: 660rpx;
		display: grid;
		grid-template-columns: repeat(auto-fill, 50rpx);
		grid-row-gap: 4rpx;
		grid-column-gap: 50rpx;
	
		.day {
			width: 80rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			flex-direction: row;
			justify-content: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			color: #364250;
			flex-direction: column;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
	
			.item-day {
				color: #364250;
				font-size: 30rpx;
			}
	
			.item-spot {
				width: 8rpx;
				height: 8rpx;
				border-radius: 50%;
				background-color: #C8D2E3;
				margin-top: 10rpx;
			}
	
		}
	
		.day-select {
			background-color: $themeColor;
			background-color: #F3F6FF;
			position: relative;
	
			.item-text {
				position: absolute;
				top: -9rpx;
				right: -9rpx;
				width: 36rpx;
				height: 36rpx;
				border-radius: 50%;
				background-color: #002FA5;
				color: #fff;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	
		.day-active {
			background-color: #002FA5;
	
	
			.item-day {
				color: #fff;
			}
	
			.item-spot {
				background-color: #009AFF;
			}
		}
	}
</style>
