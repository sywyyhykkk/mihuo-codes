<template>
	<view class="punch">
		<!-- 日历 -->
		<z-nav-bar :backState="3000" @backClick="goBack" title="打卡记录"></z-nav-bar>
		<order-mh-calendar @callback="getRecord" :todayState="nowState" :datas="options"/>
		<view class="punch-list">
			<view v-if="recordList&&recordList.length">
				<view class="punch-list_item" v-for="(item,index) in recordList" :key="index">
					<view class="list_item-left">
						<view class="circular"></view>
					</view>
					<view class="list_item-right">
						<view class="work" v-for="(itm,ind) in item.scheduleList" :key="itm.id">
							<view class="work-top" v-if="ind === 0">
								<view class="title">{{itm.printDate ? itm.printDate.slice(0,10) : ''}}</view>
								<text class="work_title">工作时长</text>
								<text>{{ dataTime }}小时</text>
							</view>
							<view class="title">{{ind === 0 ? '上工' : '下工'}}  {{itm.printDate ? itm.printDate.slice(11,16) : ''}}</view>
							<view :class="'position position_'+ind">
								<u-icon name="map-fill" color="#9897A5"></u-icon>
								<text class="address">{{itm.address}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<order-mh-empty v-else marginTop="0" title="他还没有打卡～～" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nowState:false,
				recordList:[],
				dataTime:0,
				options:{},
				isRefresh:false,
			};
		},
		onLoad(options) {
			options.projectId = (options.projectId >0?options.projectId:0);
			this.options = options;
		},
		onShow() {
			uni.setNavigationBarTitle({ title: `${this.options.skillName || ''}打卡记录` })
		},
		methods: {
			goBack(){
				uni.navigateBack();
				if(this.isRefresh) uni.$emit('refresh');
			},
			getRecord(data){
				let ids = [];
				this.isRefresh = false;
				this.options.queryDate = data;
				this.$http.get('order/sopschedule/list',this.options)
				.then((res) => {
					this.recordList = res
					if(this.recordList[0] && this.recordList[0].scheduleList && this.recordList[0].scheduleList.length){
						this.getWorkLong(this.recordList[0].scheduleList)
						this.recordList[0].scheduleList.map((item) => {
							if(item.viewFlag == 0){
								ids.push(item.id)
							}
						});
						// 设置已读
						if(ids && ids.length){
							this.isRefresh = true;
							this.$httpApi.sopscheduleRead(ids);
						}
					}
				})
			},
			// 计算工作时长
			getWorkLong(data){
				if(data && data.length && data.length==2){
					let dateEnd = data[1].printDate && data[1].printDate.slice(11,13)
					let dateStr = data[0].printDate && data[0].printDate.slice(11,13)
					this.dataTime = this.$math.floatSub(dateEnd,dateStr)
				}
			}
		},
	}
</script>

<style lang="scss">
page{
	background: #F7F7F7;
}
.punch{
	padding: 0 30rpx;
	.punch-list{
		padding: 30rpx;
		border-radius: 10rpx;
		background: #FFFFFF;
		.punch-list_item{
			display: flex;
			.list_item-left{
				border-left: 1rpx solid #E6E6E6;
				width: 20rpx;
				flex-shrink: 0;
				position: relative;
				&::before{
					position: absolute;
					content: '';
					background: #FE6E32;
					width: 8rpx;
					height: 8rpx;
					border-radius: 50%;
					left: -6rpx;
				}
				&::after{
					position: absolute;
					content: '';
					background: #FE6E32;
					width: 8rpx;
					height: 8rpx;
					border-radius: 50%;
					bottom: 0;
					left: -6rpx;
				}
			}
			.list_item-right{
				flex: 1;
				.work{
					.title{
						color: #000000;
						font-size: 28rpx;
					}
					.work-top{
						display: flex;
						align-items: center;
						text{
							color: #000000;
							font-size: 24rpx;
						}
						.work_title{
							padding: 0 10rpx;
							color: #9897A5;
						}
					}
					.position{
						display: flex;
						align-items: center;
						&.position_0{
							margin-bottom: 40rpx;
						}
						.address{
							color: #9897A5;
							font-size: 26rpx;
							padding: 10rpx 0;
						}
					}
				}
			}
		}
	}
}
</style>
