<template>
	<view>
		<view class="flex-box row">
			<view class="title-tips">验房人</view>
			<view class="flex-box check-info" v-if="data.userId">
				<u-avatar class="avatar" size="50" :src="$util.avatarImage(data.userId)"/>
				<view class="check-name">{{ data.personName }}</view>
			</view>
			<text>{{ data.personSkillName }}</text>
		</view>
		<view class="flex-box row" style="padding:20rpx 0">
			<view class="title-tips">验房时间</view>
			<view>{{ data.time }}</view>
		</view>
		<view class="image_show">
			<image v-for="(v,i) in data.pics" 
			:key="i" :src="$util.thumbnailImage(v, false)"
			@click="preview(data.pics, $util.thumbnailImage(v, false))"
			class="image_show-item"></image>
		</view>
		<view class="open_btn" v-if="isShow">
			<text class="open_btn-is" @click="goToPage()">查看验房报告</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			data:{
				type:Object,
				default:()=>{}
			},
			isShow:{
				type:Boolean,
				default:()=>false
			}
		},
		methods: {
			goToPage(){
				this.$emit('goToPage',"验房报告")
			}
		}
	}
</script>

<style lang="scss" scoped>
.flex-box{
	display: flex;
	align-items: center;
}
	.row{
		view{
			font-size: 24rpx;
			color: #000000;
		}
		text{
			margin-left: 10rpx;
			color: #FE6E32;
			border-radius: 6rpx;
			border: 2rpx solid #FE6E32;
			font-size: 16rpx;
			padding: 0 5rpx 5rpx;
			font-weight: 600;
		}
		.title-tips{
			color: #808080;
			width: 120rpx;
		}
		.check-info{
			background: #F7F7F7;
			border-radius: 100px;
			.check-name{
				padding: 0 10rpx;
			}
		}
	}
	.image_show{
		display: flex;
		flex-wrap: wrap;
		.image_show-item{
			width: 210rpx;
			height: 210rpx;
			margin: 0 20rpx 20rpx 0;
			border-radius: 10rpx;
		}
	}
	.open_btn {
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		border-radius: $miniBorderRadius;
		.open_btn-is{
			border: 1rpx solid #141414;
			border-radius: 40rpx;
			padding: 16rpx 25rpx;
			display: flex;
			align-items: center;
			color: #141414;
			font-size: 20rpx;
			font-weight: bold;
		}
	}
</style>
