<template>
	<view>
		<z-nav-bar>
			<view class="nav-bar" slot="default">充值记录</view>
		</z-nav-bar>
		
		<view class="list_title" @click="selectTime">
			<view class="text_type">{{time}}</view>
			<image src="/static/images/mine/arrowDown.png" class="arrow_down"></image>
		</view>
		<view class="text_list" v-if="rechargeList.length">
			<scroll-view class="scroll-con" scroll-y @scrolltolower="onRefresh">
				<view class="order_list" v-for="item in rechargeList" :key="item.id">
					<view class="order_list_left">
						<view class="order_title"> {{item.summary+'('+item.state+')'}}</view>
						<!-- <view class="order_number">订单编号:142653644687</view> -->
						<view class="order_number">{{item.payTime}}</view>
					</view>
					<view :class="item==3?'order_list_right2':'order_list_right'">+{{item.amount/100}}</view>
				</view>
			</scroll-view>
		</view>
		<mh-empty v-if="rechargeList.length === 0" icon="/static/images/no_recommend.png" title="还没有充值记录～～" />
		<u-picker v-model="timePickerShow" mode="time" :params="params" @confirm="confirm"></u-picker>
	</view>
</template>

<script>
	import moment from "@/static/js/moment.js"
	export default{
		data(){
			return{
				timePickerShow: false,
				time: moment().format('YYYY-MM'),
				endTime: moment().endOf('month').format("YYYY-MM-DD"),
				startTime: moment().startOf('month').format("YYYY-MM-DD"),
				current: 1,
				total: 0,
				size: 10,
				rechargeList: [],
				params: {
					year: true,
					month: true,
				},
			}
		},
		
		onLoad() {
			this.getRechargeRecord()
		},
		
		methods:{
			onRefresh(){
				if (this.rechargeList.length == this.total) return
				this.getRechargeRecord()
			},
			//获取充值记录
			getRechargeRecord(){
				this.$httpApi.rechargeRecord({
					endTime: this.endTime,
					startTime: this.startTime,
					current: this.current,
					total: this.total,
					size: this.size,
				}).then(res => {
					if (res) {
						this.total = res.total
						this.rechargeList = this.current > 1 ? this.rechargeList.concat(res.records) : res.records
						this.current += 1
					}
				}).catch(err => console.log(err))
			},
			
			confirm(e) {
				this.time = e.year + '-' + e.month;
				this.startTime = moment(e).subtract(1, 'months').startOf('month').format("YYYY-MM-DD");
				this.endTime = moment(e).subtract(1, 'months').endOf('month').format("YYYY-MM-DD");
				this.current = 1;
				this.getRechargeRecord()
			},
			
			selectTime(){
				this.timePickerShow = !this.timePickerShow
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: $fontColor33;
	}
	.text_list {
		margin: 0 20rpx 40rpx 20rpx;
		background: #FFFFFF;
		border-radius: 0 0 16rpx 16rpx;
		width: calc(100vw - 40rpx);
		height: calc(100vh - 120rpx);
		position: fixed;
	
		.scroll-con{
			height: calc(100vh - 120rpx);
		}
	
		.order_list {
			height: 156rpx;
			padding: 20rpx;
			border-bottom: solid 2rpx #f3f3f3;
			display: flex;
			justify-content: space-between;
			align-items: center;
	
			.order_list_right {
				font-weight: 700;
				font-size: 36rpx;
				line-height: 116rpx;
				text-align: right;
				color: $errorFontColor;
				margin-right: 10rpx;
			}
	
			.order_list_right2 {
				font-weight: 700;
				font-size: 36rpx;
				line-height: 116rpx;
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
				font-size: 24rpx;
				line-height: 34rpx;
				color: #B4B6BA;
			}
		}
	
	}
	
	.list_title {
		height: 104rpx;
		border-bottom: solid 2rpx #f3f3f3;
		padding: 0 0 20rpx 20rpx;
		margin: 16rpx 20rpx 0;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 0 0;
	
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
	}
</style>
