<template>
	<view class="radio">
		<view class="radio-item" 
			:class="{active:currentIndex===index}" 
			v-for="(item,index) in value"
			@click="clickTap(item,index)"
			:key="index">
			<text class="radio-item_lable">{{item.label || ''}}</text>
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
			// 默认选中值下标
			defaultChecked:{
				type:[Number,String],
				default:()=> null
			}
		},
		data() {
			return {
				currentIndex: this.defaultChecked,
			}
		},
		mounted() {
			if(this.value && this.value.length){
				if(this.defaultChecked && this.defaultChecked<this.value.length)
				return this.$emit("click",this.value[this.defaultChecked])
			}
			this.$emit("click",{})
		},
		methods: {
			clickTap(data,index){
				this.currentIndex = index;
				this.$emit("click",data)
			}
		}
	}
</script>

<style lang="scss" scoped>
.radio{
	display: flex;
	flex-flow: row nowrap;
	width: 690rpx;
	overflow-x: scroll;
	.radio-item{
		line-height: 54rpx;
		padding: 0 26rpx;
		background: #F7F7F7;
		margin-right: 20rpx;
		border-radius: 27rpx;
		border: 1rpx solid #F7F7F7;
		&:last-child{
			margin-right: 0;
		}
		.radio-item_lable{
			color: #808080;
			font-size: 24rpx;
			font-family: NotoSansHans-Regular;
			white-space:nowrap
		}
	}
	.active{
		background: #FFFFFF;
		color: #000000;
		border: 1rpx solid #000000;
		.radio-item_lable{
			color: #000000;
		}
	}
}
</style>
