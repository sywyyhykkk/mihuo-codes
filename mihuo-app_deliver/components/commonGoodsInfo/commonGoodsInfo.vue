<template>
	<view v-if="option">
		<view class="header">
			<view class="header-info" v-if="factory && factory.sysSupplier">
				<image :src="$util.thumbnailImage(factory.sysSupplier.companyLogo,true)" mode=""></image>
				<!-- <u-lazy-load class="item-image" height="40" :style="{ width: '40rpx' }" @click="preview()"
					imgMode="aspectFill" border-radius="20"
					:image="$util.thumbnailImage(factory.sysSupplier.companyLogo,true)">
				</u-lazy-load> -->
				<view class="header-title title">
					{{factory.sysSupplier.supplierName}}
				</view>
			</view>
			<view class="header-info" v-else>
				<image src="" mode=""></image>
				<view class="header-title title"></view>
			</view>
			<view class="order">
				<view class="header-title orders">
					{{option.orderSn}}
				</view>
				<image src="/static/icon/copy.png" @tap="copy(option.orderSn)" mode=""></image>
			</view>
		</view>
		<view class="centent">
			<!-- <u-lazy-load class="item-image" height="146" :style="{ width: '146rpx' }"
				@click="getLookImg($util.thumbnailImage(option.coverImg,true))" imgMode="aspectFill" border-radius="10"
				:image="$util.thumbnailImage(option.coverImg,true)">
			</u-lazy-load> -->
			<image 
				@click="getLookImg($util.thumbnailImage(option.coverImg,true))" 
				:src="$util.thumbnailImage(option.coverImg,true)" 
				mode="aspectFill"></image>
			<view class="centent-info">
				<view class="text">
					<text class="tag">{{option.productCategoryName}}</text>
					{{option.name}}
				</view>
				<view class="text-button">
					<text>已选：{{option.productAttrValue}}</text>
					<text><text class="number">x{{option.productQuantity}}</text>{{option.unit}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"commonGoodsInfo",
		data() {
			return {
				factory:{}
			};
		},
		props:{
			option:{
				type:Object,
				default:()=>{}
			}
		},
		mounted() {
			if(this.option && this.option.companyId && this.option.orderId ){
				this.$httpApi.getMaterialDetail(this.option.companyId,this.option.orderId)
				.then(res=>{
					this.factory = res
				})
			}
		},
		watch:{
			// option(newv){
			// 	if(newv){
			// 		this.getFactory(newv.companyId,newv.orderId)
			// 	}
			// }
			option:{
				handler(newv){
					if(newv){
						this.getFactory(newv.companyId,newv.orderId)
					}
				},
				immediate: true
			}
		},
		methods:{
			getFactory(companyId,orderId){
				if(companyId && orderId ){
					this.$httpApi.getMaterialDetail(companyId, orderId)
					.then(res=>{
						this.factory = res
					})
				}
			},
			copy(data){
				uni.setClipboardData({
					data:data,//要被复制的内容
					success:()=>{//复制成功的回调函数
					  this.$util.toast("复制成功");
					}
				});
			},
			getLookImg(url){
				uni.previewImage({
					urls: [url],
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.header{
	padding: 0;
	border-bottom: 1px dashed $borderColor;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 102rpx;
	.header-info{
		height: 100%;
		display: flex;
		align-items: center;
		.title{
			padding-left: 10rpx;
			font-size: $smiddleFontSize;
		}
		image{
			@include ic(40rpx,40rpx)
			border-radius: 50%;
			background-color: #E5E5E5;
		}
	}
	.order{
		display: flex;
		align-items: center;
		font-size: $smiddleFontSize;
		.orders{
			padding-right: 10rpx;
		}
		image{
			height: 28rpx;
			width: 28rpx;
		}
	}
}
.centent{
	height: 210rpx;
	display: flex;
	align-items: center;
	image{
		@include ic(146rpx,146rpx)
		border-radius: $middleBorderRadius;
		background-size: cover !important;
	}
	.centent-info{
		flex: 1;
		margin: 0 20rpx;
		.tag{
			display: inline-block;
			padding: 5rpx 10rpx;
			margin-right: 10rpx;
			background-color: #EFF6FF;
			color: $themeColor;
			font-size: $vsmallFontSize;
			border-top-right-radius: $middleBorderRadius;
			border-bottom-left-radius: $middleBorderRadius;
		}
		.text{
			@include bov(2);
			font-size: $middleFontSize;
		}
		.text-button{
			display: flex;
			justify-content: space-between;
			text{
				color: $fontColor99;
				font-size: $smallFontSize;
				height: 50rpx;
				line-height: 50rpx;
				.number{
					color: $mainFontColor;
					margin-right: 10rpx;
				}
			}
		}
	}
}
.header-title{
	color: $fontColor99;
	font-size: $middleFontSize;
}
</style>
