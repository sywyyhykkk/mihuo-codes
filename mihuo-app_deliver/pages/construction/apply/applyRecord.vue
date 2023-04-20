<template>
	<view>
		<public-module></public-module>
		<view class="content">
			<view class="record_item">
				<view class="top_view align-items">
					<view class="left_title">申请停工</view>
					<view class="right_state">未处理</view>
				</view>
				<text class="main">已发送至项目经理 张一发</text>
				<view class="btm_time align-items">
					<view class="time">2022-01-10 12:56</view>
					<view class="btn" @click="hurryUp">催一下</view>
				</view>
			</view>
			<view class="record_item">
				<view class="top_view align-items">
					<view class="left_title">申请停工</view>
					<view class="right_state red_state">未处理</view>
				</view>
				<text class="main">已发送至项目经理 张一发</text>
				<view class="btm_time align-items">
					<view class="time">2022-01-10 12:56</view>
					<view class="btn">催一下</view>
				</view>
			</view>
		</view>
		<u-popup v-model="tipsShow" mode="center" border-radius=10>
			<view class="popup_con">
				<image class="ssucsses" src="../../../static/images/ssucsses.png" mode=""></image>
				<view class="success_tips">催办成功</view>
				<view class="success_title">催办通知已发送，请耐心等待</view>
				<view class="confirm_btn" @click="tipsShow = false">确认</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				tipsShow: false,
			}
		},
		
		methods:{
			hurryUp(){
				this.tipsShow = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.content{
		margin: 8rpx 20rpx;
		.record_item{
			height: 180rpx;
			padding: 30rpx 34rpx;
			margin-bottom: 2rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			.top_view{
				.left_title{
					font-weight: bold;
					font-size: 28rpx;
					color: #333333;
				}
				.right_state{
					font-size: 26rpx;
					color: $themeColor;
				}
				.red_state{
					color: #FF5D35;
				}
			}
			.main{
				margin: 4rpx 0;
				font-size: 24rpx;
				color: #999999;
			}
			.btm_time{
				margin-top: 2rpx;
				.time{
					color: #999999;
					font-size: 24rpx;
				}
				.btn{
					width: 110rpx;
					line-height: 50rpx;
					text-align: center;
					color: #FFFFFF;
					font-size: 24rpx;
					background: $themeColor;
					border-radius: 50rpx;
				}
			}
		}
	}
	.popup_con{
		width: 460rpx;
		height: 320rpx;
		padding-top: 30rpx;
		text-align: center;
		.ssucsses{
			display: inline-block;
			width: 148rpx;
			height: 104rpx;
		}
		.success_tips{
			font-weight: bold;
			font-size: 28rpx;
			color: $themeColor;
			margin-top: 10rpx;
		}
		.success_title{
			font-size: 26rpx;
			color: #909199;
			margin: 2rpx 0 20rpx 0;
		}
		.confirm_btn{
			display: inline-block;
			width: 150rpx;
			line-height: 50rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 24rpx;
			background-color: $themeColor;
			border-radius: 50rpx;
		}
	}
	.align-items{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
