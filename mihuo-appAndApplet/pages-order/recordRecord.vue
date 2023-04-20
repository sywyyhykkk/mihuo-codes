<template>
	<view class="record">
		<view v-if="dataList.length">
			<view class="record-item" v-for="(item,index) in dataList" :key="index">
				<u-avatar class="avatar" size="70" :src="$util.avatarImage(item.creatorId)"/>
				<view class="record-item_right">
					<view class="record-item_top">
						<text class="name">{{item.creatorName}}</text>
						<text class="skill_name">{{options.skillName || ''}}</text>
					</view>
					<view class="record-item_center">{{ item.created || ''}}</view>
					<view class="record-item_bottom">
						<text>{{ item.content || ''}}</text>
						<!-- <text>此次报价为</text>
						<text class="price">{{item.bidPrice || ''}}元</text> -->
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-else title="暂无报价记录~~"></mh-empty>
		<u-loadmore v-if="dataList.length" :status="status" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList:[],
				options:{},
				status: 'nomore',
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
				let prarms = {
					orderId: this.options.orderId,
					userId: this.options.userId,
				}
				this.$httpApi.getOfferRecord(prarms).then(res => {
					this.dataList = res;
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
.record{
	padding: 0 30rpx;
	.record-item{
		padding: 20rpx 0;
		display: flex;
		border-bottom: 2rpx solid #E6E6E6;
		&:nth-last-child(1){
			border: none;
		}
		.record-item_right{
			padding-left: 20rpx;
		}
		.record-item_top{
			display: flex;
			align-items: center;
			height: 70rpx;
			line-height: 70rpx;
			.name {
				font-size: $middleFontSize;
				color: $mainFontColor14;
				font-family: PingFang SC;
				font-weight: bold;
				margin-right: 17rpx;
			}
			.skill_name {
				font-size: $fontSize22;
				color: $fontColorPrice;
				font-family: FZRuiZhengHei_GBK;
				font-weight: 800;
				display: inline-block;
				line-height: 34rpx;
				padding: 0 8rpx;
				text-align: center;
				border: 2rpx solid $fontColorPrice;
				border-radius: 6rpx;
			}
		}
		.record-item_center{
			padding-bottom: 10rpx;
			font-size: 24rpx;
			color: #808080;
		}
		.record-item_bottom{
			text{
				color: #000000;
				font-size: 28rpx;
			}
			.price{
				color: #FE6E32;
				font-size: 32rpx;
				font-weight: bold;
				margin-left: 10rpx;
			}
		}
	}
}
</style>
