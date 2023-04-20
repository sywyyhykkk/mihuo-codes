<template>
	<view class="pageContent">
		<image @click="goBack" class="header_icon" src="@/pages-common/static/images/icon_back_black.png" />
		<image class="pageBg" src="https://www.51mihuo.com/static/images/ai_bg.png"></image>
		<button class="buttom" @click="toResolve">开启AI之旅</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			uni.setStorageSync('innerGuide', 1)
		},
		methods: {
			toResolve() {
				this.toPage('/pages-common/inspirationText/inspirationText')
			},
			goBack(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageContent {
		position: absolute;
		width: 100%;
	}
	.header_icon {
		width: 40rpx;
		height: 30rpx;
		position: absolute;
		top: 130rpx;
		left: 30rpx;
		z-index: 20;
	}

	.pageBg {
		width: 100%;
		height: 100vh;
	}

	.buttom {
		position: fixed;
		bottom: 30rpx;
		width: 80%;
		margin: 0 10%;
		color: #fff;
		background-color: #3CE6DA;
		border-radius: 50rpx;
	}
</style>
