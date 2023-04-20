<template>
	<view class="custom-title-contain">
		<view class="top">
			<image class="item-image" :src="src" mode=""></image>
		</view>
		<view class="bottom">
			<view class="item-title">{{title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 图片上传数量
			title: {
				type: '',
				default: ''
			},
			src:{
				type: String,
				default: '/static/images/no-record.png'
			}
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-title-contain {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.top {

			image {
				width: 208rpx;
				height: 208rpx;
				margin-right: 10rpx;
			}

		}
		.bottom{
			.item-title{
				text-align: center;
				line-height: 1.5;
				max-width: 360rpx;
				font-size: $middleFontSize;
				color: $viceFontColor;
			}

		}
	}
</style>
