<template>
	<view class="checkbox">
		<view class="checkbox-item" 
			:class="{
				active:checkbox?curArr.indexOf(item) !=-1:currentIndex===index
			}" 
			v-for="(item,index) in value"
			@click="clickTap(item,index)"
			:key="index">
			<!-- #ifdef APP-PLUS -->
			<image v-if="checkbox && curArr.indexOf(item) !=-1" class="img" mode="aspectToFit" src="@/pages-homeCall/static/icon/jb_26x22.png"/>
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<mihuo-image v-if="checkbox && curArr.indexOf(item) !=-1" class="img" src="https://www.51mihuo.com/static/icon/home_v3/jb_26x22.png"/>
			<!-- #endif -->
			<text class="checkbox-item_lable">{{item.label || ''}}</text>
			<!-- <u-lazy-load v-if="item.icon" height="60"
				:style="{ width: '60rpx' }" 
				imgMode="aspectFill"
				:image="$util.thumbnailImage(item.icon,true)">
			</u-lazy-load> -->
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			value:{
				type:Array,
				default:()=>[]
			},
			checkbox:{
				type:Boolean,
				default:()=>false
			}
		},
		data() {
			return {
				currentIndex:0,
				curArr:[]
			}
		},
		mounted() {
			if(this.value && this.value.length){
				// this.curArr = [this.value[0]]
				// this.$emit('click',this.curArr)
				this.clickTap(this.value[0],0)
			}
		},
		methods: {
			clickTap(data,index){
				if(this.checkbox){
					let repeatArr=[];		//重复元素计算
					this.curArr.push(data);
					for (var i = 0; i < this.curArr.length; i++) {
						if (this.curArr[i] == data) {
							repeatArr.push(data)
						}
					}
					if((repeatArr.length)%2===0){
						for (var i = 0; i < this.curArr.length; i++) {
							if (this.curArr[i] == data) {
								this.curArr.splice(i,1);
								i--
							}
						}
					}else{
						this.curArr = Array.from(new Set(this.curArr))
					}
					this.$emit('click',this.curArr)
				}else{
					this.currentIndex = index;
					this.$emit("click",data)
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.checkbox{
	display: flex;
	flex-flow: row nowrap;
	width: 690rpx;
	overflow-x: scroll;
	.checkbox-item{
		line-height: 72rpx;
		padding: 0 30rpx;
		background: #F7F7F7;
		margin-right: 20rpx;
		border-radius: 16rpx;
		border: 1rpx solid #F7F7F7;
		display: flex;
		align-items: center;
		position: relative;
		border-radius: 60rpx;
		&:last-child{
			margin-right: 0;
		}
		.img{
			position: absolute;
			width: 26rpx;
			height: 22rpx;
			right: 0;
			top: 0rpx;
			z-index: 99;
		}
		.checkbox-item_lable{
			color: #808080;
			font-size: 28rpx;
			font-family: NotoSansHans-Regular;
			white-space:nowrap;
			// margin-right: 16rpx;
		}
		.checkbox-item_img{
			width: 56rpx;
			height: 60rpx;
		}
	}
	.active{
		// background: #FFFFFF;
		background: #000000;
		border: 1rpx solid #000000;
		.checkbox-item_lable{
			color: #FFFFFF;
			font-weight: bold;
		}
	}
}
.flex-box{
	display: flex;
	justify-items: center;
}
</style>
