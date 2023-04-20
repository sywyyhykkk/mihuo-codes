<template>
	<view class="hot">
		<view class="hot-item" v-for="(v,i) in data" :key="i">
			<view class="hot-item_top flex-box">
				<view class="flex-box">
					<u-lazy-load height="60" style="lazy-img" v-if="v.logo"
						:style="{ width: '60rpx' }" imgMode="aspectFill"
						border-radius="6" :image="$util.thumbnailImage(v.logo,true)">
					</u-lazy-load>
					<view class="hot-name">{{ v.name }}</view>
					<view class="flex-box right_T">
						<image
							class="img"
							src="@/pages-common/static/images/siht_mini.png"
							mode="aspectFill"
						/>
						<text>精选品牌</text>
					</view>
				</view>
				<view class="go-more" @click="()=>$emit('goTOdetail','品牌',v)">
					<text class="hot-shop">逛一逛</text>
					<uni-icons type="right" size="10" color="#FFFFFF"></uni-icons>
				</view>
			</view>
			<view class="hot-item_buttom" v-if="v.products">
				<view v-for="(item,index) in v.products" :key="index" class="hot-buttom_item">
					<view class="hot-item_img"  v-if="index<3" @click="()=>$emit('goTOdetail','商品',item )">
						<image
							:src="$util.thumbnailImage(item.coverImg,true)"
							mode="aspectFill"
							:class="'hot-img hot-img_'+index"/>
						<text class="hot-many">￥{{ item.price || 0 }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			data:{
				type:Array,
				default:()=>[]
			}
		},
	}
</script>

<style lang="scss" scoped>
.hot{
	width: 100%;
	.hot-item{
		margin-bottom: 30rpx;
		&:last-child{
			margin-bottom: 0;
		}
		.hot-item_top{
			height: 100rpx;
			width: 100%;
			background-image: url("@/pages-common/static/images/brand_bg.png");
			background-size: 100%;
			justify-content: space-between;
			padding: 20rpx;
			border-radius: 6rpx 6rpx 0 0;
			.hot-shop{
				color: #FFFFFF;
				font-size: 20rpx;
				font-family: NotoSansHans-Regular;
			}
			.right_T{
				border-radius: 20rpx;
				border: 2rpx solid #FEE0BB;
				padding: 7rpx 10rpx;
				.img{
					width: 16rpx;
					height: 16rpx;
					margin-right: 7rpx;
				}
				text{
					color: #FEE0BB;
					font-size: 20rpx;
					font-family: NotoSansHans-Light;
				}
			}
			.hot-name{
				padding: 0 10rpx 0 20rpx;
				font-size: 28rpx;
				font-family: NotoSansHans-Medium;
				color: #FFFFFF;
				font-weight: bold;
			}
			.go-more{
				display: flex;
				align-items: baseline;
			}
		}
		.hot-item_buttom{
			background: #F6F6F6;
			padding:20rpx;
			border-radius: 0 0 6rpx 6rpx;
			display: flex;
			.hot-buttom_item{
				margin-right: 10rpx;
				&:last-child{
					margin-right: 0;
				}
			}
			.hot-item_img{
				position: relative;
				display: flex;
				height: 205rpx;
				width: 205rpx;
				.hot-img{
					width: 100%;
					height: 100%;
					&.hot-img_0{
						border-radius: 10rpx 0 0 10rpx;
					}
					&.hot-img_2{
						border-radius: 0 10rpx 10rpx 0;
					}
				}
				.hot-many{
					position: absolute;
					color: #000000;
					font-size: 24rpx;
					font-family: NotoSansHans-Medium;
					font-weight: bold;
					background: rgba(255,255,255,.5);
					padding: 5rpx 15rpx;
					bottom: 10rpx;
					right: 10rpx;
					border-radius: 50rpx;
				}
			}
		}
	}
}
.flex-box{
	display: flex;
	align-items: center;
}
</style>
