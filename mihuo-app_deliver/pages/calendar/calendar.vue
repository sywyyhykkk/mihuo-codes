<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000" :bgColor="['$themeColor','$themeColor']" fontColor="#fff">
			<view slot="default" class="nav-bar">
				待办事项
			</view>
		</z-nav-bar>
		<view class="calendar">
			<view class="title-container align-center">
				<view class="left" @click="lastMonth">
					<image src="../../static/icon/menu_forward.png" style="height: 20rpx; width: 20rpx;"></image>
				</view>
				<view class="text">
					{{displayYear}}年{{displayMonth}}月
				</view>
				<view class="right" @click="nextMonth">
					<image src="../../static/icon/menu_back_white.png" style="height: 20rpx; width: 20rpx;"></image>
				</view>
			</view>
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
					<view :class="[day.hasTodo? 'day-active': 'day',
					day.day === selectedDay? 'day-select':'']" v-for="(day, index) in isShowMore? getMonth : getWeek"
						@click="checkTodo(day)" :key="index">
						{{day.day}}
					</view>
				</view>
			</view>
		</view>
		<view class="button" @click="showMore">
			<image src="../../static/icon/double_arrow.png" :class="isShowMore? 'img-rotate':'img'"></image>
		</view>
		<view>
			<view class="todo">
				<view class="title">
					今日待办事项
				</view>
				<view class="box align-center">
					<view class="item align-center">
						<view class="colored-text">
							{{todayTodo.length || '0'}}
						</view>
						待开工
					</view>
					<view class="item align-center">
						<view class="colored-text">
							{{todayDoing.length || '0'}}
						</view>
						开工中
					</view>
					<view class="item align-center">
						<view class="colored-text">
							{{todayDone.length || '0'}}
						</view>
						待结算
					</view>
				</view>
			</view>
			<view class="todo-list">
				<view class="todo-item" v-if="showTodayTodo">
					<todo-card v-for="item in todayTodo" key="index" :id="item" @click="click(item)"></todo-card>
				</view>
				<view class="todo-item" v-if="showTodayDoing">
					<todo-card v-for="item in todayDoing" key="index" :id="item" @click="click(item)"></todo-card>
				</view>
				<view class="todo-item" v-if="showTodayDone">
					<todo-card v-for="item in todayDone" key="index" :id="item" @click="click(item)"></todo-card>
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
				isShowMore: false,
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
				maximumQueryMonth: 3, //搜索范围前后3个月以内
			};
		},
		onLoad() {
			this.displayMonth = this.currentMonth;
			this.getData();
		},
		methods: {
			click(item) {
				uni.navigateTo({
					url: `/pages/orderReceiving/orderReceiving?id=${item}`
				});
			},
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
			checkTodo(day) {
				this.selectedDay = day.day;
				this.todayDoing = [];
				this.todayTodo = [];
				this.todayDone = [];
				this.getData();
			},
			lastMonth() {
				if (this.maxLast > this.maximumQueryMonth) {
					uni.showToast({
						title: `最多显示前后${this.maximumQueryMonth}个月以内的订单`,
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
				this.getData();
			},
			nextMonth() {
				if (this.maxNext > this.maximumQueryMonth) {
					uni.showToast({
						title: `最多显示前后${this.maximumQueryMonth}个月以内的订单`,
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
				this.getData();
			},
			showMore() {
				this.isShowMore = !this.isShowMore;
			},
			alwaysShowMore() {
				this.isShowMore = true;
			},
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
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.nav-bar {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 36rpx;
		line-height: 50rpx;
		text-align: center;
		color: #FFFFFF;
	}

	.calendar {
		// background: #FF8544;
		background: $themeColor;
		border-radius: 0rpx 0rpx 16rpx 16rpx;
		overflow: hidden;
		height: max-content;
		padding-bottom: 40rpx;

		.title-container {
			justify-content: center;
			height: 80rpx;

			.text {
				margin: 0rpx 20rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 900;
				font-size: 40rpx;
				line-height: 56rpx;
				color: #FFFFFF;
			}
		}

		.weekday {
			margin-top: 20rpx;
			height: 100rpx;
			width: 660rpx;
			display: grid;
			grid-template-columns: repeat(auto-fill, 50rpx);
			grid-column-gap: 50rpx;
		}

		.days {
			width: 660rpx;
			display: grid;
			grid-template-columns: repeat(auto-fill, 50rpx);
			grid-row-gap: 50rpx;
			grid-column-gap: 50rpx;
		}

		.day {
			width: 50rpx;
			height: 50rpx;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 50rpx;
			color: #FFFFFF;
			flex-direction: column;
			display: flex;
			align-items: center;
		}

		.day-active {
			width: 50rpx;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 50rpx;
			color: #FFFFFF;
			flex-direction: column;
			display: flex;
			align-items: center;

			&:after {
				content: '';
				background-color: #fff;
				height: 10rpx;
				width: 10rpx;
				border-radius: 50%;
				display: inline-block;
			}
		}

		.day-select {
			width: 50rpx;
			height: 50rpx;
			// background: #FFB383;
			background-color: #fff;
			color: $auxiliaryColor;
			border-radius: 50%;
		}
	}

	.button {
		height: 48rpx;
		background-color: #fff;
		background-image: url(../../static/icon/show_rect2.png);
		background-repeat: no-repeat;
		background-size: 120rpx 48rpx;
		background-position: center;
		padding-top: 10rpx;

		.img {
			margin: auto;
			width: 28rpx;
			height: 28rpx;
		}

		.img-rotate {
			margin: auto;
			width: 28rpx;
			height: 28rpx;
			transform: rotate(180deg)
		}
	}


	.todo {
		background-color: #fff;
		height: 300rpx;
		padding-top: 40rpx;
		padding-left: 40rpx;

		.title {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 900;
			font-size: 32rpx;
			line-height: 44rpx;
			color: #606166;
		}

		.box {
			margin-top: 40rpx;
			justify-content: space-around;

			.item {

				flex-direction: column;
				justify-content: center;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #909199;
			}

			.colored-text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 900;
				font-size: 34rpx;
				line-height: 48rpx;
				color: $themeColor;
			}
		}
	}

	.todo-list {
		margin: 20rpx 20rpx 0rpx 20rpx;

		.todo-item {
			margin-bottom: 20rpx;
		}
	}

	.align-center {
		display: flex;
		align-items: center;
	}
</style>
