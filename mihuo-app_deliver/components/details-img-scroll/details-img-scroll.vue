<template>
	<view class="scroll_view">
	    <scroll-view class="scroll" scroll-x="true" @scroll="scroll">
			<view class="img_view" :class="setClass" v-for="(m,x) in imgList" :key="m.url">
				<image class="image" :src="imageGlobal + m.url" mode="aspectFill" @click="seeImage(m.url)"></image>
				<view class="player" v-show="m.type === 'video'" @click="playVideo(m.url)">
					<image class="play_icon" src="../../static/icon/palyer.png" mode=""></image>
				</view>
			</view>
	    </scroll-view>
		<view class="pic_view center" v-if="imgList && imgList.length > 3 && !scrollLeft">
			<image src="../../static/icon/pic_fff.png" mode=""></image>
			<text>{{imgList.length}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		name:"details-img-scroll",
		props:{
			imgList:{
				type:Array,
				default(){
					return []
				}
			},
			size:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				imageGlobal:this.$image.imageGlobal,
				scrollLeft:0,
			}
		},
		
		computed:{
			setClass(){
				if(this.size === 'least'){
					return 'img_view_least'
				}
				if(this.imgList.length === 1){
					return 'img_view_1';
				}else if(this.imgList.length === 2){
					return 'img_view_2'
				}
			}
		},
		
		methods:{
			getAvatar(url) {
				return this.imageGlobal + url.replace(
					'/admin/sys-file/mihuo-test/', '');
			},
			// 滚动图片控制图标提示
			scroll(e) {
				this.scrollLeft = e.target.scrollLeft
			},
			playVideo(){
				
			},
			seeImage(curUrl) {
				let arr = this.imgList,arr2 = [];
				arr.map(item => {
					if(item.type === 'img'){
						arr2.push(this.imageGlobal + item.url);
					}
				})
				uni.previewImage({
					current: this.imageGlobal + curUrl,
					urls: arr2
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.scroll_view{
		width: 100%;
		height: auto;
		margin: 28rpx 0;
		overflow: hidden;
		white-space: nowrap;
		position: relative;
		.pic_view{
			position: absolute;
			right: 8rpx;
			bottom: 16rpx;
			width: 79rpx;
			height: 38rpx;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 28rpx;
			image{
				width: 24rpx;
				height: 24rpx;
				margin-right: 8rpx;
			}
			text{
				color: #FFFFFF;
				font-size: 26rpx;
			}
		}
		.scroll{
			width: 100%;
			height: auto;
			overflow:hidden;
			& :last-child{
				margin-right: 0;
			}
		}
		.img_view{
			width: 31%;
			height: 200rpx;
			margin-right: 24rpx;
			display: inline-block;
			border-radius: 10rpx;
			position: relative;
			.image{
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
			.player{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				text-align: center;
				line-height: 46rpx;
				width: 46rpx;
				height: 46rpx;
				background: rgba(0,0,0,.5);
				border-radius: 50%;
				.play_icon{
					display: inline-block;
					width: 16rpx;
					height: 22rpx;
				}
			}
		}
		.img_view_2{
			width: 48%;
			height: 312rpx;
		}
		.img_view_1{
			width: 100%;
			height: 312rpx;
		}
		.img_view_least{
			width: 76rpx;
			height: 76rpx;
		}
	}
	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
