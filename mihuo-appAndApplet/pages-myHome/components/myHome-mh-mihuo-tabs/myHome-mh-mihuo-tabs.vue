<template>
	<view class="mihuo-tabs" 
		:style="{
			background:bg,
			position:fixed?'fixed':'static',
		}">
		<view 
			class="mihuo-tabs_flex" 
			v-for="(item,index) in data" 
			:key="index"
			:class="{buttonClick:curLab===index}" 
			@click="clickTabs(item,index)"
			>
			<text class="mihuo-flex_title" :style="[titleStyle]">{{item[value]}}</text>
			<text class="mihuo-flex_tips" :style="[subStyle]"></text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mihuo-tabs",
		props:{
			data:{
				type:Array,
				default:()=>[]
			},
			value:{
				type:String,
				default:()=>'name'
			},
			bg:{
				type:String,
				default:()=>'#fff'
			},
			fixed:{
				type:Boolean,
				default:()=>false
			},
			index:{
				type:[String,Number],
				default:()=>0
			},
			// 标题样式
			titleStyle:{
				type:Object,
				default:()=>{}
			},
			// 下标样式
			subStyle:{
				type:Object,
				default:()=>{}
			}
			
		},
		data() {
			return {
				curLab:0,
			};
		},
		watch:{
			index(newv){
				this.curLab = newv;
			}
		},
		methods: {
			clickTabs(data,index){
				this.curLab = index;
				this.$emit('click',data,index)
			},
		},
	}
</script>

<style lang="scss" scoped>
.mihuo-tabs{
	display: flex;
	flex-flow: row nowrap;
	overflow-x: auto;
	position: absolute;
	right: 0rpx;
	left: 0rpx;
	width: 100%;
	z-index: 9;
	.mihuo-tabs_flex{
		flex: 1;
		text-align: center;
		padding: 20rpx;
		font-family: PingFang-SC;
		white-space:nowrap;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.mihuo-flex_title{
			color: #000000;
			font-size: 30rpx;
		}
		.mihuo-flex_tips{
			margin-top: 10rpx;
			width: 40rpx;
			height: 10rpx;
			border-radius: 10rpx;
		}
	}
	.buttonClick{
		position: relative;
		.mihuo-flex_title{
			color: #FE6E32;
		}
		.mihuo-flex_tips{
			margin-top: 10rpx;
			width: 40rpx;
			height: 10rpx;
			border-radius: 10rpx;
			background: -webkit-linear-gradient(to right,#FE6E32, #FFFFFF); /* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(to right,#FE6E32, #FFFFFF); /* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(to right,#FE6E32, #FFFFFF); /* Firefox 3.6 - 15 */
			background: linear-gradient(to right,#FE6E32, #FFFFFF); /* 标准的语法（必须放在最后） */
		}
	}
}
</style>