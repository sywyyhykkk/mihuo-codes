<template>
	<view>
		<public-module></public-module>
		<z-nav-bar fontColor="white" :bgColor="[$styleColor.themeColor,$styleColor.themeColor]">
			<view class="nav-bar" slot="default">{{pageType==='我的积分'?'积分':'收支'}}明细</view>
		</z-nav-bar>
		<view class="title_back"></view>
		<view class="tabs_title">
			<view :class="idx===index?'tabs_text':'tabs_text2'" v-for="(item,index) in tabs" :key="index"
				@click="cutTab(index)">
				{{item}}
			</view>
		</view>

		<view class="list_title">
			<view class="text_type" @click="selectTime">{{time}}</view>
			<image src="/static/images/mine/arrowDown.png" class="arrow_down" />
			<view class="income_expense" v-if="pageType!=='我的积分'">收入 ￥{{income/100}}</view>
			<view class="income_expense" v-if="pageType!=='我的积分'">支出 ￥{{expenditure/100}}</view>
			<view class="income_expense" v-if="pageType==='我的积分'">收入 0</view>
			<view class="income_expense" v-if="pageType==='我的积分'">支出 0</view>
			<view style="clear:both;"></view>
		</view>
		<view class="text_list" v-if="recordList.length">
			<scroll-view class="scroll-con" scroll-y @scrolltolower="onRefresh">
				<view class="order_list" v-for="item in recordList" :key="item.id" @click="getDetails(item)">
					<view class="order_list_left">
						<view class="order_title">{{item.summary}}</view>
						<view class="order_number">订单编号:{{item.orderNo}}</view>
						<view class="order_desc">{{item.description}}</view>
						<view class="order_number">{{item.createTime}}</view>
					</view>
					<view :class="item.changeType?'order_list_right2':'order_list_right'">
						{{item.changeType?'':'+'}}{{item.amount/100}}
						
						<u-icon name="arrow-right" v-if="item.bizOrderId" color="#B4B6BA"></u-icon>
					</view>
				</view>
			</scroll-view>
		</view>
		<mh-empty v-if="recordList.length === 0" icon="/static/images/no_recommend.png" title="没有数据～～" />
		<u-picker v-model="timePickerShow" mode="time" :params="params" @confirm="confirm"></u-picker>
	</view>
</template>

<script>
	import moment from "@/static/js/moment.js"
	export default {
		data() {
			return {
				pageType: '',
				expenditure: '',
				income: '',
				timePickerShow: false,
				tabs: ['全部', '收入', '支出'],
				idx: 0,
				time: moment().format('YYYY-MM'),
				endTime: moment().endOf('month').format("YYYY-MM-DD"),
				startTime: moment().startOf('month').format("YYYY-MM-DD"),
				changeType: '', //0-收入，1-支出
				current: 1,
				total: 0,
				size: 10,
				recordList: [],
				params: {
					year: true,
					month: true,
				},

			}
		},

		onLoad(option) {
			this.idx = option.pageType === '累计收入' ? 1 : 0
			this.changeType = option.pageType === '累计收入' ? 0 : ''
			this.pageType = option.pageType
			this.getTotal()
			this.getIncomeExpenditure()
		},

		methods: {
			onRefresh() {
				if (this.recordList.length == this.total) return
				this.getIncomeExpenditure()
			},
			//获取总收入总支出
			getTotal() {
				if (this.pageType !== '我的积分') {
					this.$httpApi.incomeExpenditureTotal({
						endCreateTime: this.endTime,
						startCreateTime: this.startTime,
					}).then(res => {
						if (res) {
							this.income = res.incomeAmount
							this.expenditure = res.payAmount
						}
					})
				}
			},
			getIncomeExpenditure() {
				if (this.pageType !== '我的积分') {
					// 收支明细
					this.$httpApi.incomeExpenditure({
						changeType: this.changeType,
						endCreateTime: this.endTime,
						startCreateTime: this.startTime,
						current: this.current,
						total: this.total,
						size: this.size,
					}).then(res => {
						if (res) {
							this.total = res.total
							this.recordList = this.current > 1 ? this.recordList.concat(res.records) : res.records
							this.current += 1
						}
					}).catch(err => console.log(err))
				} else {
					//积分记录
				}

			},
			confirm(e) {
				this.time = e.year + '-' + e.month;
				this.startTime = moment(e).subtract(1, 'months').startOf('month').format("YYYY-MM-DD");
				this.endTime = moment(e).subtract(1, 'months').endOf('month').format("YYYY-MM-DD");
				this.current = 1;
				this.getIncomeExpenditure()
				this.getTotal()
			},
			selectTime() {
				this.timePickerShow = !this.timePickerShow
			},
			cutTab(index) {
				this.idx = index;
				this.current = 1;
				this.changeType = index === 0 ? '' : index === 1 ? 0 : 1;
				this.getIncomeExpenditure()
			},
			getDetails(item) {
				if (item.bizOrderId) {
					this.toPage(`/pages/orderReceiving/releaseOrderDetails?pageType=接单&id=${item.bizOrderId}`)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: #FFFFFF;
	}

	.title_back {
		/* position: absolute; */
		width: 100vw;
		height: 126rpx;
		background: linear-gradient(90deg, $themeColor 10%, $themeColor 100%);
		border-radius: 0rpx 0rpx 30rpx 30rpx;
		padding: 26rpx 0 0 0;
	}

	.text_list {
		margin: 162rpx 20rpx 40rpx 20rpx;
		background: #FFFFFF;
		border-radius: 0 0 16rpx 16rpx;
		width: calc(100vw - 40rpx);
		height: calc(100vh - 480rpx);
		position: fixed;

		.scroll-con {
			height: calc(100vh - 480rpx);
		}

		.order_list {
			// height: 156rpx;
			padding: 20rpx;
			border-bottom: solid 2rpx #f3f3f3;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.order_list_left{
				display: flex;
				flex-direction: column;
			}

			.order_list_right {
				font-weight: 700;
				font-size: 36rpx;
				line-height: 116rpx;
				text-align: right;
				color: $errorFontColor;
				margin-right: 10rpx;
				display: flex;
				// flex: 1;
			}

			.order_list_right2 {
				font-weight: 700;
				font-size: 36rpx;
				line-height: 116rpx;
				text-align: right;
				color: $seconFontColor;
				margin-right: 10rpx;
				display: flex;
				// flex: 1;
			}

			.order_title {
				// width: 80%;
				font-weight: 400;
				font-size: $middleAddFontSize;
				line-height: 42rpx;
				color: #2C2C51;
				@include bov(2)
			}

			.order_number {
				font-weight: 400;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #B4B6BA;
			}

			.order_desc {
				font-weight: 400;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #B4B6BA;
				@include bov(2)
			}
		}

	}

	.list_title {
		height: 104rpx;
		border-bottom: solid 2rpx #f3f3f3;
		padding: 0 0 20rpx 20rpx;
		margin: 60rpx 0 0 0;
		// width: calc(100vw -40rpx);
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 0 0;
		position: fixed;
		right: 20rpx;
		left: 20rpx;

		.text_type {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			color: #32324E;
			font-size: 30rpx;
			line-height: 104rpx;
			float: left;
		}

		.arrow_down {
			width: 24rpx;
			height: 14rpx;
			margin-top: 45rpx;
			margin-left: 10rpx;
			float: left;
		}

		.income_expense {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #909199;
			float: right;
			margin-left: 40rpx;
			margin-right: 20rpx;
			line-height: 104rpx;

		}
	}

	.tabs_title {
		margin: -96rpx 20rpx 0 20rpx;
		height: 140rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		position: fixed;
		width: calc(100% - 40rpx);

		.tabs_text {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 32rpx;
			line-height: 140rpx;
			text-align: center;
			color: $themeColor;
			width: 33.3%;
			float: left;
		}

		.tabs_text2 {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 32rpx;
			line-height: 140rpx;
			text-align: center;
			color: #909299;
			width: 33.3%;
			float: left;
		}

	}
</style>
