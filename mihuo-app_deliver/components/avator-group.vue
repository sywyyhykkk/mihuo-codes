<template>
	<view class="avator-wrapper">
		<view class="avator" v-if="type == 2">
			<img class="img" :src="avator[0]" >
		</view>
		<view class="avator-group" v-if="type == 3">
			<block  v-for="(it,i) of avator" :key="i">
				<img class="img" :src="it" >
			</block>
		</view>
		<view class="avator-text" v-if="type == 4">
			<text>张</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'avator_group',
		props: {
			avator: Array,//头像组
			type: Number | String, //2单个头像，3群组聊天头像组，4默认头像提取文字
			text: String,//提取名称的一个字
		}
	}
</script>

<style lang="scss" scoped="true">
	.avator-wrapper{
		width: 100rpx;
		height: 100rpx;
	}
	.avator{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hiideen;
		background: #f1f1f1;
		.img{
			width:100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.avator-group{
		display:flex;
		flex-wrap:wrap;
		.img{
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
		}
	}
	.avator-text{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hiideen;
		background: #e5e5e5;
		line-height: 100rpx;
		text-align: center;
		font-size: 40rpx;
		color: #fff;
	}
</style>