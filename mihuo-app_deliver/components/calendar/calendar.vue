<template>
	<view>
		<view class="calendar">
			<view class="title-container align-center">
				<view class="left" @click="lastMonth">
					<image src="../../static/icon/arrow_left.png" style="height: 32rpx; width: 18rpx;"></image>
				</view>
				<view class="text">
					{{displayYear}}年{{displayMonth}}月
				</view>
				<view class="right" @click="nextMonth">
					<image src="../../static/icon/arrow_right.png" style="height: 32rpx; width: 18rpx;"></image>
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
					<view :class="[day.hasTodo ? 'day-active' : day.abnormal ? 'attendance-abnormal' : 'day',
						day.day === selectedDay ? 'day-select' : '']" v-for="(day, index) in isShowMore ? getMonth : getWeek"
							@click="checkTodo(day)" :key="index">
							{{day.day}}
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
	import moment from "@/static/js/moment.js"
	export default {
		name:"calendar",
		props:{
			todayState1: {
				type: Boolean,
				default: false
			},
			orderDetails: {
				type: Object,
				default: ()=>{}
			}
		},
		data(){
			return{
				personId: '',
				todayState: uni.getStorageSync('todayState'),
				recordStates:[],
				isShowMore: true,
				month: [],
				currentMonth: moment().month() + 1,
				displayMonth: -1,
				displayYear: moment().year(),
				selectedDay: moment().date(),
				maxLast: 1,
				maxNext: 1,
				maximumQueryMonth: 3,
				yearMonthDay: moment().format().slice(0,10),
			}
		},
		mounted() {
			this.displayMonth = this.currentMonth;
			this.getState()
		},
		computed: {
			 ...mapState(['projectInfo','nodeInfo','userPersonInfo','remainingDays','orderInfo']),
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
							hasTodo: true,
							abnormal: true
						})
					}
				});
				thisWeek.forEach(item => {
					for (let i = 0; i < this.month.length; i++) {
						if (this.month[i].day === item.day) {
							item.hasTodo = this.month[i].hasTodo
							item.abnormal = this.month[i].abnormal
						}
					}
				})
				if (thisWeek.length !== 0 && thisWeek[0].weekday != 7) {
					let list = [];
					for (let i = thisWeek[0].weekday - 1; i > 0; i--) {
						list.push({
							day: '',
							weekday: 0,
							hasTodo: false,
							abnormal: false
						});
					}
					let newList = list.concat(thisWeek);
					return newList;
				} else {
					return thisWeek;
				}
			},
			getMonth() {
				if (this.month[0] && this.month[0].weekday != 1) {
					let list = [];
					for (let i = this.month[0].weekday - 1; i > 0; i--) {
						list.push({
							day: '',
							weekday: 0,
							hasTodo: false,
							abnormal: false
						});
					}
					let thisMonth = list.concat(this.month);
					return thisMonth;
				} else {
					return this.month;
				}
			}
		},
		methods:{
			getState() {
				 this.yearMonthDay =
					`${this.displayYear}-${this.displayMonth < 10? '0' +
						this.displayMonth : this.displayMonth}-${this.selectedDay
							< 10 ? '0'+this.selectedDay:this.selectedDay}`;
				this.personId = this.temUserId = this.orderDetails&&this.orderDetails.bizOrderOffer&&this.orderDetails.bizOrderOffer.personId
				let data = {
					queryDate:this.yearMonthDay.slice(0,7),
					personId:this.personId?this.personId:this.userPersonInfo.personId,
					projectId:this.orderDetails&&this.orderDetails.id?0:this.projectInfo.projectId,
					orderCode:this.orderDetails&&this.orderDetails.orderCode?this.orderDetails.id:this.orderInfo.orderCode,
					orderId:this.orderDetails&&this.orderDetails.id?this.orderDetails.id:this.orderInfo.orderId
				}
				this.$httpApi.getDkState(data).then(res => {
					this.recordStates = res.records;
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
						hasTodo: false,
						abnormal: false
					});
					weekday++;
				}
				month.forEach(day => {
					// 当天的状态后台没给需要自己判断
					let today = Number(moment().format().slice(8,10));
					let newMonth = Number(moment().format().slice(6,7));
					if(this.displayMonth === newMonth && day.day === today && (this.todayState||this.todayState1)){
						day.hasTodo = true;
					}
					this.recordStates.forEach(item => {
						if (!item.created && !item.status) return;
						//后台给的时间是第二天凌晨0点统计的时间，状态展示会相差一天，所以item.created要减去一天的时间
						let timeStamp = moment(item.created).unix()*1000//当前时间戳
						let lastDay = moment(timeStamp - 24*60*60*1000).format()//当前时间戳（毫秒）- 1天毫秒数 = 前一天时间戳
						if (day.day === Number(lastDay.slice(8,10))) {
							// 状态：1001正常；1002迟到；1003早退；1004缺卡；1005旷工；1006外勤；1007事假；1008加班
							switch(item.status){
								case 1001:
									day.hasTodo = true;
								break;
								case 1002:
								case 1003:
								case 1004:
								case 1005:
								case 1006:
								case 1007:
								case 1008:
									day.abnormal = true;
								break;
							}
						};
					})
				})
				this.month = month;
			},
			checkTodo(day) {
				this.selectedDay = day.day;
				this.getState();
				this.$emit('getRecord',this.yearMonthDay);

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
				this.$emit('getRecord',this.yearMonthDay);
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
				this.$emit('getRecord',this.yearMonthDay)
				
				console.log('getMonth',this.getMonth);
				console.log('getWeek',this.getWeek);
			},
			alwaysShowMore() {
				this.isShowMore = true;
			},
		},

	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.calendar {
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 6rpx 20rpx;
		overflow: hidden;
		height: max-content;
		padding: 44rpx 0 64rpx 0;

		.title-container {
			justify-content: center;
			height: 80rpx;
			color: #606166;

			.text {
				margin: 0rpx 20rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 900;
				font-size: 40rpx;
				line-height: 56rpx;
				color: #606166;
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
			color: #606166;
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
			color: #909199;
			flex-direction: column;
			display: flex;
			align-items: center;
		}
		.attendance-abnormal{
			width: 50rpx;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 50rpx;
			flex-direction: column;
			display: flex;
			align-items: center;

			&:after {
				content: '';
				background-color: #FF6A32;
				height: 10rpx;
				width: 10rpx;
				border-radius: 50%;
				display: inline-block;
			}
		}

		.day-active {
			width: 50rpx;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 50rpx;
			flex-direction: column;
			display: flex;
			align-items: center;

			&:after {
				content: '';
				background-color: $themeColor;
				height: 10rpx;
				width: 10rpx;
				border-radius: 50%;
				display: inline-block;
			}
		}

		.day-select {
			width: 50rpx;
			height: 50rpx;
			background-color: $themeColor;
			color: #FFFFFF;
			border-radius: 50%;
		}
		.align-center {
			display: flex;
			align-items: center;
		}
	}
</style>
