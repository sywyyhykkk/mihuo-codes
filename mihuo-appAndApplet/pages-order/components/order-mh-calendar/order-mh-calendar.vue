<template>
	<view>
		<view class="calendar">
			<view class="title-container">
				<view class="title-top" @click="()=>showCalendar =true">
					<view class="title_date">{{ displayYear + '年' + displayMonth +'月'}}</view>
					<u-icon name="arrow-down-fill" size="16"></u-icon>
				</view>
			</view>
			<view class="align-center" style="justify-content: center; flex-direction: column;">
				<!-- 星期 -->
				<view class="weekday">
					<view class="day">一</view>
					<view class="day">二</view>
					<view class="day">三</view>
					<view class="day">四</view>
					<view class="day">五</view>
					<view class="day">六</view>
					<view class="day">日</view>
				</view>
				<view class="days">
					<view class="days_date" v-for="(day, index) in getMonth" :key="index" @click="checkTodo(day,index)">
						<view 
							:class="{
								'date-tips':true,
								'date-tips_today':(day.day==selectedDay && isToDay),
								'date-tips_click':currentIndex === index,
							}">
							{{(day.day==selectedDay && isToDay)?'今':day.day}}</view>
						<text class="tips" v-if="punchDate.indexOf(day.day) != -1">打卡</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 日期选择 -->
		<u-picker 
			mode="time" 
			v-model="showCalendar" 
			:params="{year: true,month: true}" 
			@confirm="changeDate"
			>
		</u-picker>
	</view>
</template>

<script>
	import moment from "@/static/js/moment.js"
	export default {
		name:"calendar",
		props:{
			todayState1: {
				type: Boolean,
				default: false
			},
			datas: {
				type: Object,
				default: ()=>{}
			},
			personId: {
				type: [String,Number],
				default:''
			}
		},
		data(){
			return{
				todayState: uni.getStorageSync('todayState'),
				recordStates:[],
				isShowMore: true,
				month: [],
				currentMonth: moment().month() + 1,
				displayMonth: -1,
				displayYear: moment().year(),
				selectedDay: moment().date(),
				yearMonthDay: moment().format().slice(0,10),
				showCalendar:false,
				currentIndex:null,
				isToDay:false,
				punchDate:[],
				curData:{}
			}
		},
		mounted() {
			this.displayMonth = this.currentMonth;
			this.curData = this.datas
			this.getState()
			this.nowDate()
			this.checkTodo({
				day:this.selectedDay
			},null)
		},
		computed: {
			getWeek() {
				this.month.forEach((item, index) => {
					if (item.day === this.selectedDay) {
						// select = item;
						// todayIndex = index
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
			// 判断是否为今天
			nowDate(){
				if(this.displayYear == moment().year() && this.displayMonth == (moment().month() + 1)){
					this.isToDay = true
				}else{
					this.isToDay = false
				}
			},
			// 年份切换
			changeDate(date){
				this.currentIndex = null;
				if(date){
					this.displayYear = date.year;
					this.displayMonth = this.zero(date.month);
					this.getState();
				}
			},
			// 去除月份前面的0
			zero(month){
				let strArray = month.split('-');
				strArray = strArray.map(function(val) {
					if (val[0] == '0') {
						return val = val.slice(1);
					}else{
						return val;
					}
				})
				return strArray.join('-');
			},
			getState() {
				let data = {
					queryDate: `${this.displayYear}-${this.displayMonth>9?this.displayMonth:'0'+this.displayMonth}`,
					size:999
				}
				let query = Object.assign(this.curData,data)
				this.$http.get('order/sopschedulestatistics/page',query).then(res => {
					this.recordStates = res.records;
					this.nowDate()
					this.getMonthDay();
				}).catch(e => console.log(e));
			},
			// 判断本月那几天有打卡记录
			getMonthDay() {
				let month = [];
				let punArr = []
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
						//后台给的时间是第二天凌晨0点统计的时间，状态展示会相差一天，所以item.created要减去一天的时间
						if (!item.created && !item.status) return;
						//后台给的时间是第二天凌晨0点统计的时间，状态展示会相差一天，所以item.created要减去一天的时间
						let timeStamp = moment(item.created).unix()*1000//当前时间戳
						let lastDay = moment(timeStamp - 24*60*60*1000).format()//当前时间戳（毫秒）- 1天毫秒数 = 前一天时间戳
						if (day.day === Number(lastDay.slice(8,10))) {
							// 状态：1001正常；1002迟到；1003早退；1004缺卡；1005旷工；1006外勤；1007事假；1008加班
							if(item.status == 1001 ){
								punArr.push(day.day)
							}
						};
					})
					this.punchDate = Array.from(new Set(punArr))
				})
				this.month = month;
			},
			checkTodo(day,index) {
				this.currentIndex = index;
				let month = this.displayMonth>9?this.displayMonth:'0'+this.displayMonth;
				let days = day.day>9?day.day:'0'+day.day;
				let nowDate = `${this.displayYear}-${month}-${days}`
				this.$emit('callback', nowDate)
			},
		},

	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.calendar {
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 20rpx 0;
		// height: max-content;
		.title-container {
			height: 80rpx;
			color: #606166;
			background: #FFEDE5;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			border-radius: 16rpx 16rpx 0 0;
			.title-top{
				display: flex;
				align-items: center;
				.title_date{
					color: #000000;
					font-size: 28rpx;
					margin-right: 20rpx;
				}
			}
		}
		.weekday {
			height: 60rpx;
			width: 690rpx;
			padding: 0 30rpx;
			display: grid;
			grid-template-columns: repeat(auto-fill, 45rpx);
			grid-column-gap: 50rpx;
			background: #FFEDE5;
			.day {
				color: #000000;
				font-size: 20rpx;
				font-weight: Regular;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.days {
			width: 690rpx;
			display: grid;
			grid-template-columns: repeat(auto-fill, 45rpx);
			grid-row-gap: 50rpx;
			grid-column-gap: 50rpx;
			color: #606166;
			padding: 30rpx;
			.days_date{
				.date-tips{
					color: #000000;
					font-size: 28rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 4rpx 0;
					&.date-tips_click{
						color: #FE6E32 !important;
						border-radius: 50%;
						background: #FFFFFF !important;
						border:1.5rpx solid #FE6E32 !important;
					}
					&.date-tips_today{
						background: #FE6E32;
						border-radius: 50%;
						color: #FFFFFF;
					}
				}
				.tips{
					color: #FE6E32;
					font-size: 20rpx;
				}
			}
		}
		.align-center {
			display: flex;
			align-items: center;
		}
	}
</style>
