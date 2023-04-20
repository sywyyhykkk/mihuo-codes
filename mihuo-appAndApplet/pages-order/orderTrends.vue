<template>
	<view class="trends">
		<z-nav-bar fontColor="#141414" bgColor="#F7F7F7" title="订单动态"></z-nav-bar>
		<view v-if="dataList.length" class="trends-box">
			<view class="trends-item" v-for="(item,index) in dataList" :key="index">
				<view class="trends-item_title">{{ item.content }}</view>
				<view class="trends-item_date">{{ item.created }}</view>
			</view>
		</view>
		<u-loadmore v-if="dataList.length" :status="status" />
		<mh-empty v-else title="暂无订单动态~~"></mh-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList:[],
				status: 'nomore',
				options:{}
			};
		},
		onLoad(options) {
			this.options = options;
		},
		onShow() {
			this.getListData()
		},
		methods: {
			getListData(){
				let params = {
					orderId:this.options.orderId
				}
				this.$httpApi.getOrderLog(params).then(res => {
					this.dataList = res;
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
.trends{
	.trends-item{
		padding: 30rpx;
		border-bottom: 2rpx solid #E6E6E6;
		&:nth-last-child(1){
			border: none;
		}
		&>view{
			font-size: 24rpx;
			font-family: PingFang-SC;
		}
		.trends-item_title{
			color: #000000;
			margin-bottom: 20rpx;
		}
		.trends-item_date{
			color: #808080;
		}
	}
}
</style>
