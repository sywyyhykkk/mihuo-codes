<template>
	<view class="swiper">
		<view class="swiper-item">
			<swiper class="swiper-image" :indicator-dots="false" :autoplay="false" @change="onSwiperChange">
				<swiper-item v-for="(item,index) in srcList" :key="index"
				@click="getPreview($util.thumbnailImage(item,false))"
				>
					<image lazy-load class="swiper-image" mode="aspectFill"
						:src="$util.thumbnailImage(item,true)">
				</swiper-item>
			</swiper>
			<text class="swiper-dots">{{ current }}/{{srcList.length}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current:1
			}
		},
		props:{
			srcList:{
				type:Array,
				default:()=> []
			}
		},
		methods: {
			onSwiperChange(e){
				this.current = e.detail.current + 1;
			},
			getPreview(url) {
				let images = this.srcList.map(item => {
					return this.$util.thumbnailImage(item, false)
				})
				uni.previewImage({
					current: url,
					urls: images,
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.swiper-item{
	position: relative;
	.swiper-image{
		width: 100%;
		height: 400rpx;
		border-radius: 20rpx;
	}
	.swiper-dots{
		position: absolute;
		background: rgba(0,0,0,.3);
		color: #FFF;
		bottom: 20rpx;
		right: 20rpx;
		padding: 5rpx 10rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
	}
}
</style>
