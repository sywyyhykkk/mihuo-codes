<template>
	<view>
		<!-- 日历 -->
		<calendar @getRecord="getRecord" :orderDetails="orderDetails" />

		<!-- 打卡记录 -->
		<view v-if="recordList&&recordList.length">
			<view class="record_wrap align-center" v-for="(item,index) in recordList" :key="item.id">
				<view class="left">
					<image class="point" src="/static/icon/point.png" />
					<image class="line" src="/static/icon/line.png" />
					<image class="point" src="/static/icon/point.png" />
				</view>
				<view class="right">
					<view class="work" v-for="(itm,ind) in item.scheduleList" :key="itm.id">
						<view class="tip">{{ind === 0 ? '上工' : '下工'}} {{itm.printDate ? itm.printDate.slice(11,16) : ''}}</view>
						<view class="position align-center">
							<image class="image" src="/static/icon/position.png" />
							<text class="address">{{itm.address}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-else icon="/static/images/no_recommend.png" title="您还没有打卡记录～～" />
	</view>
</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	import moment from "@/static/js/moment.js"
	export default {
		data() {
			return {
				recordList: [],//打卡记录
				projectId: 0,
				orderDetails: {}
			};
		},

		onLoad(option) {
			this.orderDetails = JSON.parse(option.orderDetails)
			this.getRecord()
		},
		
		methods: {
			getRecord(yearMonthDay){
				let info = this.orderDetails && this.orderDetails.bizOrderOffer;
				let newYearMonthDay = moment().format().slice(0,10);
				let data = {
					personId:info.personId,
					queryDate:yearMonthDay ? yearMonthDay : newYearMonthDay,
					orderCode: this.orderDetails.orderCode,
					orderId: this.orderDetails.id,
					projectId:this.projectId,
				}
				this.$httpApi.getDkList(data).then(res => {
					this.recordList = res
				}).catch(e => console.log(e));
			},
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
		color: $darkTitle;
	}

	.record_wrap{
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 6rpx 20rpx;
		padding: 20rpx 52rpx;
		.left{
			margin-right: 24rpx;
			image{
				margin: 0 auto;
			}
			.line{
				width: 2rpx;
				height: 130rpx;
				margin: 8rpx auto;
			}
			.point{
				width: 18rpx;
				height: 18rpx;
			}
		}
		.right{
			.work{
				padding-bottom: 36rpx;
				&:last-child{
					padding-bottom: 0rpx;
				}
			}
			.tip{
				font-weight: bold;
				font-size: $mainFontSize;
				color: $seconFontColor;
			}
			.position{
				margin-top: 13rpx;
				.image{
					width: 23rpx;
					height: 27.4rpx;
					margin-right: 8rpx;
				}
				.address{
					font-size: 26rpx;
					color: #606166;
					@include bov(2)
				}
			}
		}
	}

	.align-center {
		display: flex;
		align-items: center;
	}
</style>
