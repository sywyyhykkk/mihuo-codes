<template>
	<view class="case">
		<view class="case-item" @click="getCaseDetais">
			<view class="case-tag">{{ recommendCase.way }} </view>
			<image class="case-img" :src="$util.thumbnailImage(recommendCase.coverPic[0])"
				:key="recommendCase.id" lazy-load="true" mode="aspectFill"></image>
			<view class="case-style flex-center">
				<text class="style-item">{{ recommendCase.houseType }}</text>
				<text class="style-item">·{{ recommendCase.houseArea }}㎡</text>
				<text class="style-item">·{{ recommendCase.houseStyle }}</text>
			</view>
			<view class="case-name">
				{{ recommendCase.name }}
			</view>
			<view class="case-box">
				<view class="case-box_right">￥
					<text>{{ Math.floor(recommendCase.totalPrice) || 0 }}</text>
					<text style="font-size: 20rpx">{{ recommendCase.totalPrice | priceFormat }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"case-card",
		props:{
			recommendCase:{
				type:Object,
				default:()=>{}
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			// 查看案例
			getCaseDetais(){
				this.toPage(`/pages-common/case/recommend/detail?id=${this.recommendCase.id}`)
			}
		},
	}
</script>

<style lang="scss" scoped>
.case{

	.case-item {
		width: 330rpx;
		height: max-content;
		background-color: #f5f5f5;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		padding: 20rpx;
		.case-tag {
			width: max-content;
			height: 38rpx;
			line-height: 38rpx;
			font-size: 20rpx;
			padding: 0 8rpx;
			color: #ffffff;
			background-color: #000000;
			border-radius: 6rpx;
		}
		.case-img {
			width: 294rpx;
			height: 294rpx;
			border-radius: 10rpx;
			margin-top: 20rpx;
		}
		.case-name {
			width: 100%;
			font-size: 24rpx;
			color: #010101;
			margin: 20rpx 0;
			font-weight: 500;
			@include toe();
		}
		.case-style {
			width: 100%;
			height: 28rpx;
			margin-top: 16rpx;
			.style-item {
				font-size: 20rpx;
				color: $themeColor;
			}
		}
		.case-box{
			display: flex;
			justify-content: space-between;
			view{
				font-size: 20rpx;
				color: #ED3832;
			}
			text{
				color: #ED3832;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}
}
.flex-center{
	display: flex;
	align-items: center;
}
</style>