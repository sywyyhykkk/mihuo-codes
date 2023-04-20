<template>
	<view class="card-content">
		<view class="cover">
			<image class="images" :src="$util.thumbnailImage(materialDetail.coverImg, true)" mode="aspectFill"></image>
		</view>
		<view class="description">
          <view class="name">{{materialDetail.name}}</view>
		  <view class="platformCategoryName">{{materialDetail.platformCategoryName}}</view>
		  <view class="descript">{{materialDetail.description}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "im-material-billorder-item",
		props: {
			materialDetail: {
				type: Object,
				default: () => ({})
			},
		},
		data() {
			return {

			};
		},
		methods: {
			resolveDate(date) {
				if (!date) return '';
				return date.substr(0, 10)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.card-content {
		background-color: #fff;
		padding: 15rpx 20rpx;
		border-radius: 10rpx;
		display: flex;
		.cover{
			width: 150rpx;
			height: 150rpx;
			.images{
				width: 100%;
				height: 100%;
			}
		}
		.description{
			flex:1;
			.name{
				font-size: 28rpx;
				font-weight: 600;
				@include bov(2);
			}
			.platformCategoryName,.descript{
				font-size: 24rpx;
				color: $fontColor99;
				@include bov(1);
			}
			.descript{
				@include bov(2);
			}
		}
	}
</style>
