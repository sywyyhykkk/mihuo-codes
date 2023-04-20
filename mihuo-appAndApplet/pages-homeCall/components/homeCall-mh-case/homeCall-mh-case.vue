<template>
	<view class="case">
		<view class="case-item" v-for="(item, index) in value" :key="index"
			@click="getCaseDetais(item)">
			<view class="case-tag">{{ item.way }} </view>
			<view class="case-img">
				<mihuo-image border-radius="10" v-if="item.coverPic && item.coverPic.length" :bottom-radius="true" :upper-radius="true" :key="index"
					:src="$util.thumbnailImage(item.coverPic[0], true)" mode="aspectFill"></mihuo-image>
			</view>
			<view class="case-buttom">
				<view class="case-style flex-center">
					<text class="style-item" style="padding-right:5rpx;">{{ item.houseType }}</text>
					<text class="style-item">·&nbsp;{{ item.houseArea }}㎡</text>
				</view>
				<view class="case-box">￥
					<text>{{ Math.floor(item.totalPrice) || 0 }}</text>
					<text style="font-size: 20rpx">{{item.totalPrice | priceFormat }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			value:{
				type:Array,
				default:()=>[]
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			getCaseDetais(val) {
				this.toPage(`/pages-common/case/recommend/detail?id=${val.id}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
.case{
	display: flex;
	flex-flow: row nowrap;
	width: 690rpx;
	overflow-x: scroll;
	.case-item {
		width: 300rpx;
		height: 300rpx;
		display: inline-block;
		background-color: #f5f5f5;
		margin-right: 20rpx;
		border-radius: 20rpx;
		position: relative;
		.case-tag {
			width: max-content;
			z-index: 99;
			line-height: 30rpx;
			font-size: 20rpx;
			padding: 2rpx 10rpx;
			color: #ffffff;
			background-color: #000000;
			border-radius: 6rpx;
			position: absolute;
			top: 20rpx;
			left: 20rpx;
		}
		.case-img {
			width: 300rpx;
			height: 300rpx;
			border-radius: 10rpx;
		}
		.case-box {
			display: flex;
			justify-content: space-between;
			color: #ffffff;
			font-size: 20rpx;
			align-items: baseline;
			view {
				font-size: 20rpx;
				color: #ffffff;
			}
			text {
				color: #ffffff;
				font-size: 28rpx;
				font-weight: bold;
			}
		}
		.case-buttom{
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: absolute;
			bottom: 20rpx;
			right: 20rpx;
			left: 20rpx;
			.case-style {
				width: 100%;
				height: 28rpx;
				display: flex;
				align-items: center;
				.style-item {
					font-size: 16rpx;
					color: #ffffff;
					font-family: NotoSansHans-Medium;
				}
			}
		}
	}
}
</style>
