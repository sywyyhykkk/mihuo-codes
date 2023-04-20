<template>
	<view class="calendar-page">

		<public-module></public-module>
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
					<view class="day"
						:class="[day.day === selectedDay? 'day-select':'',dayCurrent  == '' ? '': dayCurrent == day.day ?  'day-active':'' ]"
						v-for="(day, index) in isShowMore? getMonth : getWeek" @click="checkTodo(day)" :key="index">
						<text class="item-day">{{day.day}}</text>
						<text class="item-spot" v-if="day.day"></text>
						<view v-if="day.day === selectedDay " class="item-text">
							今
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
			}
		},
		computed: {
			getWeek() {
				let select = {};
				let todayIndex = -1;
				this.month.forEach((item, index) => {
					if (item.day === this.selectedDay) {
						select = item;
						todayIndex = index
						return;
					}
				});
				let thisWeek = [];
				var startOfWeek = moment(`${this.displayYear}-${this.displayMonth}-${this.selectedDay}`, 'yyyy-MM-DD')
					.local().startOf('isoWeek');
				var endOfWeek = moment(`${this.displayYear}-${this.displayMonth}-${this.selectedDay}`, 'yyyy-MM-DD').endOf(
					'isoWeek');
				var days = [];
				var day = startOfWeek;
				while (day <= endOfWeek) {
					days.push(day.toDate().format('yyyy-MM-dd'));
					day = day.clone().add(1, 'd');
				}
				days.forEach(dayItem => {
					let year = dayItem.split('-')[0];
					let month = dayItem.split('-')[1];
					let day = dayItem.split('-')[2];
					if (Number(year) === this.displayYear && Number(month) === this.displayMonth) {
						thisWeek.push({
							day: Number(day),
							weekday: moment(dayItem).isoWeekday(),
							hasTodo: true
						})
					}
				});
				thisWeek.forEach(item => {
					for (let i = 0; i < this.month.length; i++) {
						if (this.month[i].day === item.day) {
							item.hasTodo = this.month[i].hasTodo
						}
					}
				})
				if (thisWeek.length !== 0 && thisWeek[0].weekday != 7) {
					let list = [];
					for (let i = thisWeek[0].weekday - 1; i > 0; i--) {
						list.push({
							day: '',
							weekday: 0,
							hasTodo: false
						});
					}
					let newList = list.concat(thisWeek);
					return newList;
				} else {
					return thisWeek;
				}
			},
			getMonth() {
				if (this.month[0].weekday != 1) {
					let list = [];
					for (let i = this.month[0].weekday - 1; i > 0; i--) {
						list.push({
							day: '',
							weekday: 0,
							hasTodo: false
						});
					}
					let thisMonth = list.concat(this.month);
					return thisMonth;
				} else {
					return this.month;
				}
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.displayMonth = this.currentMonth;
			this.getMonthDay();
		},
		methods: {
			getData() {
				let yearMonthDay =
					`${this.displayYear}-${this.displayMonth < 10? '0'+this.displayMonth : this.displayMonth}-${this.selectedDay< 10 ? '0'+this.selectedDay:this.selectedDay}`;
				this.$http.request({
					url: 'order/biz_order/calendar',
					method: 'GET',
					data: {
						yearMonthDay
					}
				}).then(res => {
					this.monthTodo = res.monthWaitingConstructions;
					this.todayTodo = res.todayWaitingConstructions;
					this.todayDoing = res.constructions;
					this.todayDone = res.waitingSettlements;
					this.getMonthDay();
				}).catch(e => console.log(e));
			},
			getMonthDay() {
				let month = [];
				let weekday = moment(`${this.displayYear}-${this.displayMonth}-1`, 'yyyy-MM-dd').isoWeekday();
				for (let i = 0; i < moment(`${this.displayYear}-${this.displayMonth}`, 'yyyy-MM').daysInMonth(); i++) {
					if (weekday > 7) {
						weekday = 1;
					}
					month.push({
						day: i + 1,
						weekday,
						hasTodo: false
					});
					weekday++;
				}
				month.forEach(day => {
					this.monthTodo.forEach(item => {
						if (!item.date) return;
						if (day.day === Number(item.date.split('-')[2])) {
							day.hasTodo = true;
						}
					})
				})
				this.month = month;
			},
			lastMonth() {
				if (this.maxLast > this.maximumQueryMonth) {
					uni.showToast({
						title: `最多显示前后${this.maximumQueryMonth}个月以内的打卡记录`,
						icon: 'none'
					});
					return;
				}
				this.maxLast++;
				if (this.displayMonth - 1 < 1) {
					this.displayYear--;
					this.displayMonth = 12;
				} else {
					this.displayMonth--;
				}
				this.getMonthDay();
				this.maxNext--;
				this.alwaysShowMore();
				this.getState();
				this.$emit('getRecord', this.yearMonthDay);
			},
			nextMonth() {
				if (this.maxNext > this.maximumQueryMonth) {
					uni.showToast({
						title: `最多显示前后${this.maximumQueryMonth}个月以内的考勤`,
						icon: 'none'
					});
					return;
				}
				this.maxNext++;
				if (this.displayMonth + 1 > 12) {
					this.displayYear++;
					this.displayMonth = 1;
				} else {
					this.displayMonth++;
				}

				this.getMonthDay();
				this.maxLast--;
				this.alwaysShowMore();
				this.getState();
				this.$emit('getRecord', this.yearMonthDay)
			},
			alwaysShowMore() {
				this.isShowMore = true;
			},
			getState() {
				
			},
			checkTodo(day) {
				if(!day.day){
					return
				}
				this.dayCurrent = day.day;
				this.toPage('/pages/toDoList/calendarDetails')
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.text-time {
		color: #364250;
		font-size: 34rpx;
		font-weight: bold;
	}

	.align-center {
		display: flex;
		align-items: center;
	}

	.calendar-contian {
		background-color: #fff;
		margin-top: 2rpx;
		padding-bottom: 40rpx;
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

	.right-contian {
		width: 100rpx;
		display: flex;
		align-items: center;

		.left {
			margin-right: 32rpx;
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
