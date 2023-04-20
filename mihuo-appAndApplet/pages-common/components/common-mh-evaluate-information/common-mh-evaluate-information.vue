<template>
	<view class="log">
		<view class="log-item" v-for="(item,index) in evaluateList" :key="index">
			<view class="flex-box">
				<u-avatar class="avatar" size="80" :src="$util.avatarImage(item.userId)"/>
				<view class="log-top">
					<view>
						<view>
							<text class="log_name">{{ item.personName }}</text>
							<text class="log_skill-name">{{ item.personSkillName }}</text>
						</view>
						<view class="submit_title">{{item.time || ''}}</view>
					</view>
					<view>
						<u-rate size="24" :current="item.stars" disabled></u-rate>
						<text class="rate-num">{{ item.stars }}分</text>
					</view>
				</view>
			</view>
			<view class="submit_title">{{item.comment || ''}}</view>
			<view class="image_show" v-if="item.pics && item.pics.length">
				<image v-for="(v,i) in item.pics" 
				:key="i" :src="$util.thumbnailImage(v, false)"
				@click="preview(item.pics , $util.thumbnailImage(v, false))"
				class="image_show-item"></image>
			</view>
		</view>
		<view class="open_btn" v-if="data.length>2">
			<view class="open_btn-is" @click="fold(true)">
				<text>{{isOpen?"关闭":"查看"}}更多评论</text>
				<image src="https://www.51mihuo.com/static/images/order_details/open_arrow.png" :style="isOpen?'transform:rotate(-180deg);':''" />
			</view>
		</view>
		<!-- <view class="open_btn" @click="fold(true)" v-if="data.length>2">
			<view class="btn_title">{{isOpen?'收起':'展开'}}</view>
			<image src="https://www.51mihuo.com/static/images/order_details/open_arrow.png" :style="isOpen?'transform:rotate(-180deg);':''" />
		</view> -->
		<!-- <view class="open_btn">
			<text>查看评价</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		name:"evaluate-information",
		props:{
			data:{
				type:Array,
				default:()=> []
			}
		},
		data() {
			return {
				evaluateList:[],
				isOpen:false
			};
		},
		mounted() {
			if(this.data && this.data.length){
				this.data.map(item=>{
					if(item.pics){
						item.pics = item.pics.split(',')
					}
				})
			}
			this.fold(false);
		},
		methods: {
			fold(flag){
				if(flag){
					this.isOpen = !this.isOpen;
				}
				if(this.isOpen){
					this.evaluateList = this.data;
				}else{
					this.evaluateList = this.data.slice(0,2);
				}
			},
			preview(data,url){
				if(data && data.length){
					let images = data.map(item => {
						return this.$util.thumbnailImage(item, false)
					})
					uni.previewImage({
						current: url,
						urls: images,
					});
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
.log{
	margin: 30rpx 0;
	border-bottom: 1.5rpx solid #E6E6E6;
	&:last-child{
		border: none;
	}
	.log-item{
		margin-bottom: 60rpx;
	}
	.log-top{
		margin-left: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		.log_name{
			color: #141414;
			font-size: 28rpx;
			font-weight: bold;
			padding-right:20rpx;
		}
		.log_skill-name{
			color: #FE6E32;
			border: 2rpx solid #FE6E32;
			font-size: 22rpx;
			font-weight: 800;
			padding: 0 10rpx;
			border-radius: 6rpx;
		}
		.rate-num{
			color: #FE6E32;
			font-size: 22rpx;
			padding-left: 10rpx;
		}
	}
	.submit_title{
		margin-top: 20rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #808080;
	}
	.log-type{
		color: #000000;
		font-size: 24rpx;
		margin-top: 7rpx;
	}
	.describe{
		font-size: $fontSize26;
		font-family: PingFang SC;
		font-weight: 500;
		color: $mainFontColor14;
		@include bov(3);
	}
	.image_show{
		margin-top: 20rpx;
	}
	.open_btn {
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		border-radius: $miniBorderRadius;
		.btn_title {
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $fontColor80;
		}
		image {
			width: 14rpx;
			height: 8rpx;
			transition: all .2s;
			margin-left: 12rpx;
		}
		text{
			color: #141414;
			font-size: 20rpx;
			border: 1rpx solid #141414;
			border-radius: 40rpx;
			padding: 10rpx 20rpx;
			font-weight: bold;
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
}
.flex-box{
	display: flex;
	align-items: center;
}
</style>