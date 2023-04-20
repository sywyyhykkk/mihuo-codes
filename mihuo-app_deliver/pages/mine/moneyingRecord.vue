<template>
	<view>
		<public-module></public-module>
		<z-nav-bar fontColor="white" :bgColor="[$styleColor.themeColor,$styleColor.themeColor]" title="">
			<view class="nav-bar" slot="default">结算中明细</view>
		</z-nav-bar>
		<view class="title_back"></view>
		<view class="list_title">
			<view class="text_type" @click="selectTime">{{time}}</view>
			<image src="/static/images/mine/arrowDown.png" class="arrow_down"></image>
			<view style="clear:both;"></view>
		</view>
		<view class="text_list" v-if="recordList&&recordList.length">
			<scroll-view class="scroll-con" scroll-y @scrolltolower="onRefresh">
				<view class="order_list" v-for="item in recordList" :key="item.id">
					<view class="order_list_left">
						<view class="order_title"> {{item.remark}}</view>
							<view class="order_number">订单编号:{{item.applyOrderSn}}</view>
						<view class="order_number">{{item.created}}</view>
					</view>
					<view class="order_list_right2">{{item.applyCost}}</view>
				</view>
			</scroll-view>
		</view>
		<mh-empty v-if="recordList&&recordList.length === 0" icon="/static/images/no_recommend.png" title="还没有结算中记录～～" />
		<u-picker v-model="timePickerShow" mode="time" :params="params" @confirm="confirm"></u-picker>
	</view>
</template>

<script>
	import moment from "@/static/js/moment.js"
	export default {
		data() {
			return {
				timePickerShow: false,
				time: moment().format('YYYY-MM'),
				endTime: moment().endOf('month').format("YYYY-MM-DD"),
				startTime: moment().startOf('month').format("YYYY-MM-DD"),
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

		onLoad() {
			this.getMoneyingRecord()
		},

		methods: {
			onRefresh(){
				if (this.recordList.length == this.total) return
				this.getMoneyingRecord()
			},
			getMoneyingRecord() {
				this.$httpApi.getMoneyingOrder({
					endTime: this.endTime,
					startTime: this.startTime,
					current: this.current,
					total: this.total,
					size: this.size,
				}).then(res => {
					if (res) {
						this.total = res.total
						this.recordList = this.current > 1 ? this.recordList.concat(res.data.records) : res.data.records
						this.current += 1
					}
				}).catch(err => console.log(err))
			},
			confirm(e) {
				this.time = e.year + '-' + e.month;
				this.startTime = moment(e).subtract(1, 'months').startOf('month').format("YYYY-MM-DD");
				this.endTime = moment(e).subtract(1, 'months').endOf('month').format("YYYY-MM-DD");
				this.current = 1;
				this.getMoneyingRecord()
			},
			selectTime() {
				this.timePickerShow = !this.timePickerShow
			},
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
		margin: 14rpx 20rpx 40rpx 20rpx;
		background: #FFFFFF;
		border-radius: 0 0 16rpx 16rpx;
		width: calc(100vw - 40rpx);
		height: calc(100vh - 320rpx);
		position: fixed;
		.scroll-con{
			height: calc(100vh - 320rpx);
		}

		.order_list {
			height: 120rpx;
			padding: 20rpx;
			border-bottom: solid 2rpx #f3f3f3;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.order_list_right {
				font-weight: bold;
				font-size: 36rpx;
				line-height: 86rpx;
				text-align: right;
				color: $errorFontColor;
				margin-right: 10rpx;
			}

			.order_list_right2 {
				font-weight: bold;
				font-size: 36rpx;
				line-height: 86rpx;
				text-align: right;
				color: $seconFontColor;
				margin-right: 10rpx;
			}

			.order_title {
				width: 80%;
				font-weight: 400;
				font-size: $middleAddFontSize;
				line-height: 42rpx;
				color: #2C2C51;
				@include bov(2)
			}

			.order_number {
				font-weight: 400;
				font-size: $smallFontSize;
				line-height: 34rpx;
				color: #B4B6BA;
			}
		}

	}

	.list_title {
		height: 104rpx;
		border-bottom: solid 2rpx #f3f3f3;
		padding: 0 0 20rpx 20rpx;
		margin: -90rpx 0 0 0;
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
			font-size: $middleAddFontSize;
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
			font-size: $middleFontSize;
			line-height: 40rpx;
			color: $viceFontColor;
			float: right;
			margin-left: 40rpx;
			margin-right: 40rpx;
			line-height: 104rpx;

		}
	}
</style>
