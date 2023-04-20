<template>
	<view class="demand_des" v-if="checkedData.id">
		<view class="display-left">
			<view class="des_title">验收报告</view>
			<view class="check_state" v-if="[1,2,3].indexOf(checkedData.statusFlag)!==-1">
				{{checkedData.statusFlag===0?'待验收':checkedData.statusFlag===1?'已验收':checkedData.statusFlag===2?'未通过':''}}
			</view>
		</view>
		<view class="submit_time">提交时间 {{checkedData.applyTime || ''}}</view>
		<view class="describe">{{checkedData&&checkedData.applyDesc}}</view>
		<view class="image_show" v-if="checkedData.picFiles">
			<order-mh-image-show :imgSrc="checkedData&&checkedData.picFiles" width="196" height="196" right="12" />
		</view>
		<view v-if="checkedData.voiceFiles&&checkedData.voiceFiles[0]">
			<order-mh-mihuo-audio :formDate="checkedData.voiceFiles&&checkedData.voiceFiles[0]" />
		</view>
	</view>
</template>

<script>
	/*
		statusFlag:验收状态 0、待验收 1、通过 2、未通过
	*/
	export default{
		props:{
			checkedData:{
				type:Object,
				default:()=>{}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.des_title{
		font-size: $fontSize30;
		font-family: PingFang SC;
		font-weight: bold;
		color: $mainFontColor14;
		margin-right: 25rpx;
		@include toe();
	}
	.check_state{
		width: 72rpx;
		height: 28rpx;
		background: #FE6E32;
		line-height: 28rpx;
		text-align: center;
		font-size: 18rpx;
		font-family: FZRuiZhengHei_GBK;
		font-weight: bold;
		color: #FFFFFF;
		border-radius: 10rpx 2rpx 10rpx 0px;
	}
	.submit_time{
		margin-top: 38rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #808080;
	}
	.address_view{
		margin-top: 20rpx;
		.address_icon{
			width: 25rpx;
			height: 29rpx;
			margin-right: 25rpx;
		}
		.address{
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $mainFontColor14;
			@include toe();
		}
	}
	
	.demand_des{
		// margin: 53rpx 0 30rpx;
		padding: 20rpx 0 30rpx;
		.describe{
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $mainFontColor14;
			margin-top: 18rpx;
			line-height: 40rpx;
			@include bov(3);
		}
		.image_show{
			margin-top: 37rpx;
		}
	}
	.display-left{
		display: flex;
		align-items: center;
	}
</style>
