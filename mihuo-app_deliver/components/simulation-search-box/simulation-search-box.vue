<template>
	<view class="tui-searchbox">
		<view class="tui-search-input">
			<icon type="search" :size="15" color="#999"></icon>
			<text class="tui-search-text">搜索</text>
		</view>
	</view>
</template>

<script>
	//这是一个模拟的输入框 点击跳转搜索页面
	export default {
		name: 'simulation-search-box',
	}
</script>

<style lang="scss" scoped>
	.tui-searchbox {
		width: 100%;
		height: 80rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.tui-search-input {
		width: 100%;
		height: 72rpx;
		background-color: #fafafa;
		border-radius: 36rpx;
		font-size: 30rpx;
		color: #a8abb8;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-search-text {
		padding-left: 16rpx;
		font-size: 30rpx;
	}
</style>
