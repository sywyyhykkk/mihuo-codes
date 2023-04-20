<template>
	<u-popup v-model="value" border-radius="20" :height="height" mode="bottom" @close="close"
		:safe-area-inset-bottom="false" :closeable="closeable" :popup="false" :maskCloseAble="maskCloseAble">
		<view class="popup-contian">
			<view class="popup-top">
				<text class="name">选择日期</text>
				<view class="calendar-week_day">
					<view class="calendar-week_day_text" v-for="(item, index) in weekDayZh" :key="index">{{item}}</view>
				</view>
			</view>
			<view class="list-contain" :style="{'height': listHeight + 'rpx'}">
				<scroll-view :scroll-y="true" class="scroll-Y" :scroll-into-view="scrollIntoView">
					<view class="list-contain-all">
						<view class="item-all" v-for="(item,index) in groupList">
							<view :id="'id_'+ item.showId" class="month">{{item.showTitle}}</view>
							<view class="list-content">
								<block v-for="(item1, index2) in item.weekdayArr" :key="index2">
									<view class="u-calendar_content_item"></view>
								</block>
								<view class="u-calendar_content_item" :style="[getColor(index3,1,item)]"
									v-for="(item2,index3) in item.daysArr" :key="index3" @tap="dateClick(item2,item)">
									<view class="inner_text" :style="[getColor(index3,2,item)]">
										{{item2}}
									</view>
									<view class="item-tips" :style="{color:activeColor}"
										v-if="mode == 'range' &&  startDate==`${item.year}-${item.month}-${item2}` && startDate!=endDate">
										{{startText}}
									</view>
									<view class="item-tips" :style="{color:activeColor}"
										v-if="mode == 'range'  && endDate==`${item.year}-${item.month}-${item2}`">
										{{endText}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="bottom-add">
				<view class="top">
					<view v-if="mode == 'range'" class="top-range">
						<view class="item-time">
							<text class="label">开始</text>
							<view class="value">
								<text class="num">{{startMonthNum}}月{{startDayNum}}日</text>
								<text class="num-text">{{startWeekNum}}</text>
							</view>
						</view>
						<view class="among">
							<view class="thread"></view>
						</view>
						<view class="item-time">
							<text class="label">结束</text>
							<view v-if="endMonthNum" class="value">
								<text class="num">{{endMonthNum}}月{{endDayNum}}日</text>
								<text class="num-text">{{endWeekNum}}</text>
							</view>
						</view>
					</view>
					<view v-if="mode == 'date'" class="top-range">
						<text class="num-text">{{activeDate}}</text>
					</view>
				</view>
				<view class="item-button button-active" @click="getButton()">
					确认 <text v-if="diffDay">{{diffDay}}天</text>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import moment from '@/static/js/moment.js'
	export default {
		props: {
			// 是否允许通过点击遮罩关闭Picker
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			// date-单个日期选择，range-开始日期+结束日期选择
			mode: {
				type: String,
				default: 'range'
			},
			title: {
				type: String,
				default: '日式'
			},
			height: {
				type: String,
				default: '1200'
			},
			closeable: {
				type: Boolean,
				default: false
			},
			value: {
				type: Boolean,
				default: false
			},
			// 选中|起始结束日期背景色
			activeBgColor: {
				type: String,
				default: '#002FA5'
			},
			activeColor: {
				type: String,
				default: '#ffffff'
			},
			color: {
				type: String,
				default: '#303133'
			},
			// 范围内日期字体颜色
			rangeColor: {
				type: String,
				default: '#303133'
			},
			// 范围内日期背景色
			rangeBgColor: {
				type: String,
				default: '#E5ECF6'
			},
			// 可切换的最小年份
			minYear: {
				type: [Number, String],
				default: 1950
			},
			// 最小可选日期(不在范围内日期禁用不可选)
			minDate: {
				type: [Number, String],
				default: '1950-01-01'
			},
			maxDate: {
				type: [Number, String],
				default: ''
			},
			startText: {
				type: String,
				default: '开始'
			},
			// mode=range时生效，结束日期自定义文案
			endText: {
				type: String,
				default: '结束'
			},
		},
		data() {
			return {
				option: {},
				listHeight: 1000,
				buttonList: [{
					name: '确认',
					active: true
				}],
				weekDayZh: ['日', '一', '二', '三', '四', '五', '六'],
				weekdayArr: [],
				// 星期几,值为1-7
				weekday: 1,
				year: '',
				month: '',
				daysArr: [],
				showTitle: '',
				resultList: [],
				groupList: [],
				scrollIntoView: '',
				today: '',
				activeDate: '',
				startDate: '',
				endDate: '',
				startDateStr: '',
				endDateStr: '',
				min: null,
				max: null,
				isStart: true,
				startYear: 0,
				startMonth: 0,
				startMonthNum: 0,
				startDay: 0,
				startDayNum: 0,
				endYear: 0,
				endMonth: 0,
				endMonthNum: 0,
				endDay: 0,
				endDayNum: 0,
				startWeekNum: '今天',
				endWeekNum: '',
				diffDay: '',
				standardNum:4 
			}
		},
		watch: {
			value(val) {
				if (val) {
					this.open();
				} else  {
					this.close();
				}
			}
		},
		computed: {

		},
		mounted() {
		},
		created() {
			this.init()
		},
		methods: {
			open() {
				this.$nextTick(() => {
					// this.showPopup = true
					this.init()
					// this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					// this.$emit('close')
					this.$emit('input', false);
					// this.showPopup = false
				})
			},
			getColor(index, type, event) {
				// let color = type == 1 ? '' : this.color;
				let day = index + 1
				let style
				let date = `${event.year}-${event.month}-${day}`
				let timestamp = new Date(date.replace(/\-/g, '/')).getTime();
				let start = this.startDate.replace(/\-/g, '/')
				let end = this.endDate.replace(/\-/g, '/')
				// if (this.activeDate == date || this.startDate == date || this.endDate == date) {
				// 	color = type == 1 ? this.activeBgColor : this.activeColor;
				// } else if (this.endDate && timestamp > new Date(start).getTime() && timestamp < new Date(end).getTime()) {
				// 	color = type == 1 ? this.rangeBgColor : this.rangeColor;
				// }
				if (this.activeDate == date || this.startDate == date || this.endDate == date) {
					style = type == 1 ? {
						backgroundColor: this.activeBgColor,
						borderRadius: '10rpx',
					} : {
						color: this.activeColor
					}
				} else if (this.endDate && timestamp > new Date(start).getTime() && timestamp < new Date(end).getTime()) {
					style = type == 1 ? {
						backgroundColor: this.rangeBgColor,
					} : {
						color: this.rangeColor
					}
				}
				return style
			},
			init() {
				let now = new Date();
				this.year = now.getFullYear();
				this.month = now.getMonth() + 1;
				this.today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
				this.activeDate = this.today;
				this.min = this.initDate(this.minDate);
				this.max = this.initDate(this.maxDate || this.today);
				this.startMonthNum = this.formatNum(this.month)
				this.startDayNum = this.formatNum(now.getDate())
				this.startDate = "";
				this.endDate = "";
				this.getHeight()
				this.groupData()
				this.scrollIntoView = `id_${this.year}-${this.month}`
			},
			//日期处理
			initDate(date) {
				let fdate = date.split('-');
				return {
					year: Number(fdate[0] || 1920),
					month: Number(fdate[1] || 1),
					day: Number(fdate[2] || 1)
				}
			},
			openDisAbled(year, month, day) {
				let bool = true;
				let date = `${year}/${month}/${day}`;
				// let today = this.today.replace(/\-/g, '/');
				let min = `${this.min.year}/${this.min.month}/${this.min.day}`;
				let max = `${this.max.year}/${this.max.month}/${this.max.day}`;
				let timestamp = new Date(date).getTime();
				if (timestamp >= new Date(min).getTime() && timestamp <= new Date(max).getTime()) {
					bool = false;
				}
				return bool;
			},
			getWeekText(date) {
				date = new Date(`${date.replace(/\-/g, '/')} 00:00:00`);
				let week = date.getDay();
				return '周' + ['日', '一', '二', '三', '四', '五', '六'][week];
			},
			formatNum(num) {
				return num < 10 ? '0' + num : num + '';
			},
			dateClick(day, item) {
				if (!this.openDisAbled(item.year, item.month, day)) {
					this.day = day;
					let date = `${item.year}-${item.month}-${day}`;
					let compare = new Date(date.replace(/\-/g, '/')).getTime() < new Date(this.startDate.replace(/\-/g,
						'/')).getTime()
					if (this.mode == 'date') {
						this.activeDate = date;
					} else {
						if (this.isStart || compare) {
							this.startDate = date;
							this.startYear = item.year;
							this.startMonth = item.month;
							this.startDay = this.day;
							this.endYear = 0;
							this.endMonth = 0;
							this.endDay = 0;
							this.endDate = "";
							this.activeDate = "";
							this.isStart = false;
							this.timeNum('start')
						} else {
							this.endDate = date;
							this.endYear = item.year;
							this.endMonth = item.month;
							this.endDay = this.day;
							this.isStart = true;
							this.timeNum('end')
						}
					}
				}
			},
			timeNum(type) {
				if (type == 'end') {
					this.endMonthNum = this.formatNum(this.endMonth)
					this.endDayNum = this.formatNum(this.endDay)
					let endMonth = this.formatNum(this.endMonth);
					let endDay = this.formatNum(this.endDay);
					this.endDateStr = `${this.endYear}-${endMonth}-${endDay}`;
					let endWeek = this.getWeekText(this.endDateStr);
					this.endWeekNum = endWeek
				} else {
					this.startMonthNum = this.formatNum(this.startMonth)
					this.startDayNum = this.formatNum(this.startDay)
					let startMonth = this.formatNum(this.startMonth);
					let startDay = this.formatNum(this.startDay);
					this.startDateStr = `${this.startYear}-${startMonth}-${startDay}`;
					let startWeek = this.getWeekText(this.startDateStr);
					this.startWeekNum = startWeek
				}
				if (this.isStart && this.endDateStr && this.startDateStr) {
					this.diffDay = moment(this.endDateStr).diff(this.startDateStr, 'day') 
				} else {
					this.diffDay = ''
					this.endMonthNum = ''
					this.endDayNum = ''
					this.endWeekNum = ''
				}
			},
			getHeight() {
				this.$nextTick(() => {
					let classStr = '',
						classStrList = ['.popup-top', '.bottom-add']
					classStr = classStrList.join(', ')
					uni.createSelectorQuery().selectAll(classStr)
						.boundingClientRect(res => {
							if (res) {
								let total = 0
								res.forEach(el => {
									total += el.height
								})
								let result = Number(uni.upx2px(this.height)) - total
								this.listHeight = this.$util.pxToRpx(result)
							}
						}).exec()
				})
			},
			generateArray(start, end) {
				return Array.from(new Array(end + 1).keys()).slice(start);
			},
			getWeekday(year, month) {
				let date = new Date(`${year}/${month}/01 00:00:00`);
				return date.getDay();
			},
			//一个月有多少天
			getMonthDay(year, month) {
				let days = new Date(year, month, 0).getDate();
				return days;
			},
			changeData() {
				this.days = this.getMonthDay(this.year, this.month);
				// 每月天数
				this.daysArr = this.generateArray(1, this.days)
				// 空白块个数
				this.weekday = this.getWeekday(this.year, this.month);
				// 每月空白块
				this.weekdayArr = this.generateArray(1, this.weekday)
				// 月份显示
				this.showTitle = `${this.year}年${this.month}月`;
			},
			groupData() {
				// 默认显示当前月，前后三个月的时间，共显示7个月的数据
				const monthTotal = 12
				let year = this.year,
					month = this.month,
					beforeMonth = [],
					afterMonth = [],
					nowMonth = [{
						month: this.month,
						year: this.year
					}]
				this.resultList = []
				// 前三个月
				for (let i = 1; i < this.standardNum; i++) {
					beforeMonth.unshift({
						month: month - i > 0 ? month - i : monthTotal - Math.abs(month - i),
						year: month - i > 0 ? year : year - 1
					})
				}
				// 后三个月
				for (let i = 1; i < this.standardNum; i++) {
					afterMonth.push({
						month: month + i > 12 ? month + i - monthTotal : month + i,
						year: month + i > 12 ? year + 1 : year
					})
				}
				this.resultList = [...beforeMonth, ...nowMonth, ...afterMonth]
				this.initData()
			},
			initData() {
				this.groupList = []
				this.resultList.forEach(item => {
					let days = this.getMonthDay(item.year, item.month);
					let weekday = this.getWeekday(item.year, item.month);
					this.groupList.push({
						month: item.month,
						year: item.year,
						daysArr: this.generateArray(1, days),
						weekdayArr: this.generateArray(1, weekday),
						showTitle: `${item.year}年${item.month}月`,
						showId: `${item.year}-${item.month}`

					})
				})
			},
			getButton() {
				this.close();
				if (this.mode == 'date') {
					let arr = this.activeDate.split('-')
					let year = Number(arr[0]);
					let month = Number(arr[1]);
					let day = Number(arr[2]);
					//当前月有多少天
					let days = this.getMonthDay(year, month);
					let resultStr = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`;
					let weekText = this.getWeekText(resultStr);
					let isToday = false;
					if (`${year}-${month}-${day}` == this.today) {
						isToday = true;
					}
					let result = {
						year: year,
						month: month,
						day: day,
						days: days,
						result: resultStr,
						week: weekText,
						isToday: isToday,
					}
					this.$emit('change', result);
				} else {
					if (!this.startDate || !this.endDate) return;
					let result = {
						startYear: this.startYear,
						startMonth: this.startMonth,
						startDay: this.startDay,
						startDate: this.startDateStr,
						startWeek: this.startWeekNum,
						endYear: this.endYear,
						endMonth: this.endMonth,
						endDay: this.endDay,
						endDate: this.endDateStr,
						endWeek: this.endWeekNum
					}
					this.$emit('change', result);
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.popup-contian {
		position: relative;
		height: 100%;
		background-color: #FFF;

		.popup-top {
			padding: 40rpx 40rpx 24rpx 40rpx;
			border-bottom: 2rpx solid #F6F6F6;

			.name {
				color: #3D3D3D;
				font-size: 30rpx;
				font-weight: bold;

			}

			.calendar-week_day {
				display: flex;
				margin-top: 30rpx;

				.calendar-week_day_text {
					display: flex;
					font-size: 26rpx;
					color: #909199;
					flex: 1;
					margin-left: 80rpx;

					&:nth-of-type(1) {
						margin-left: 0rpx;
						color: #FF5D35;
					}
				}
			}
		}

		.scroll-Y {
			height: 100%;
		}

		.list-contain {
			position: relative;
			overflow: auto;
		}

		.list-contain-all {
			min-height: 900px;
			// padding: 0 28rpx;

			.item-all {
				// margin-bottom: 40rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}

			.month {
				position: sticky;
				padding-left: 28rpx;
				top: 0;
				height: 80rpx;
				line-height: 80rpx;
				font-weight: bold;
				font-size: 28rpx;
				width: 100%;
				// border: 2rpx solid red;
				// margin-bottom: 20rpx;
				background-color: #fff;
			}

			.list-content {
				display: flex;
				flex-wrap: wrap;
			}

			.u-calendar_content_item {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				padding: 12rpx 0rpx;
				// border: 2rpx solid red;
				width: 14.2857%;
				height: 100rpx;

				.item-tips {
					font-size: 24rpx;
				}
			}
		}

		.bottom-add {
			display: flex;
			flex-direction: column;
			position: absolute;
			bottom: 0rpx;
			justify-content: center;
			padding-bottom: 40rpx;
			width: 100%;
			border-top: 2rpx solid #F6F6F6;
			background-color: #fff;
			z-index: 10;

			.top {
				padding: 32rpx;

				.top-range {
					display: flex;
					justify-content: center;
				}

				.item-time {
					display: flex;
					flex: 1;
					flex-direction: column;
					white-space: nowrap;

					.label {
						color: #909199;
						font-size: 28rpx;
						line-height: 34rpx;
					}

					.value {
						margin-top: 8rpx;

						text {
							color: #3D3D3D;
							font-size: 30rpx;
							line-height: 34rpx;
						}

						.num-text {
							margin-left: 14rpx;
						}
					}
				}

				.among {
					display: flex;
					flex: 1;
					align-items: center;
					justify-content: center;

					.thread {
						width: 40rpx;
						height: 4rpx;
						background-color: #303133;
						margin-top: 40rpx;
					}
				}
			}

			.item-button {
				margin: 0 26rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: $miniBorderRadius;
				height: 88rpx;
				font-weight: bold;
				font-size: $fontSize26;

				text {
					font-size: $fontSize26;
					color: #fff;
				}
			}

			.button-cancel {
				border: 2rpx solid $themeColor;
				background: #fff;
				color: $themeColor;
			}

			.button-active {
				background-color: $themeColor;
				color: #fff;
			}

		}

		.bottom-cat {
			height: 104rpx;
		}
	}
</style>
