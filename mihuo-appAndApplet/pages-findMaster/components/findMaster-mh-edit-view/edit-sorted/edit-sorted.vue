<template>
	<view class="sortedContent">
		<text :class="{'sortIndex':jsondata.type=='sorted','unSortIndex':jsondata.type=='unsorted'}">
			{{jsondata.data.sortIndex}}</text>
		<view class="wordInput"><text>{{jsondata.content}}</text></view>
	</view>
</template>

<script>
	export default {
		name: 'edit-sorted',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
	}
</script>

<style scoped lang="scss">
	.sortedContent {
		display: flex;
		align-items: center;
		background-color: #fff;
		.unSortIndex {
			background: #666;
			display: inline-block;
			width: 10rpx;
			height: 10rpx;
			border-radius: 10rpx;
			margin: 0 30rpx;
		}

		.sortIndex {
			outline: none;
			border: none;
			font-size: 30rpx;
			line-height: 42rpx;
			/* identical to box height */
			color: #BFBFBF;
			width: 60rpx;
			text-align: center;
		}
		.wordInput {
			padding: 20rpx 20rpx 20rpx 0;
			border-bottom: 1rpx solid #EBEBEB;
			outline: none;
			flex: 1;
			line-height: 40rpx;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			color: #606166;
		}
	}
</style>
