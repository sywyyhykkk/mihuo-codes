<template>
	<view class="tabs center-item align-center">
		<view :class="{itemActive: currentTab===0, item: currentTab!==0}" @click="changeTab(0)">
			{{leftButton}}
		</view>
		<view :class="{itemActive: currentTab===1, item: currentTab!==1}" @click="changeTab(1)">
			{{rightButton}}
		</view>
	</view>
</template>

<script>
	//必传参数 leftButton, rightButton
	export default {
		name: "mihuo-button-group",
		props: {
			leftButton: {
				type: String,
				default: 'button-1'
			},
			rightButton: {
				type: String,
				default: 'button-2'
			},
		},
		data() {
			return {
				currentTab: 0
			};
		},
		methods: {
			changeTab(index){
				this.currentTab = index;
				this.$emit('click', index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs {
		justify-content: space-evenly;
		height: 88rpx;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 32rpx;
		line-height: 44rpx;
		text-align: center;
		background: linear-gradient(to bottom, #ededed 50%, #fff 50%);
		margin-top: -70rpx;

		.item {
			&:nth-of-type(2) {
				border-top-left-radius: 0rpx;
				border-top-right-radius: 10rpx;
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 10rpx;
			}

			color: #606266;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 0rpx;
			border-bottom-left-radius: 10rpx;
			border-bottom-right-radius: 20rpx;
			width: 50%;
			height: 100%;
			line-height: 88rpx;
			text-align: center;
			background-color: #EDEDED;
		}

		.itemActive {
			&:nth-of-type(2) {
				border-top-left-radius: 20rpx;
				border-top-right-radius: 10rpx;
				border-bottom-left-radius: 0rpx;
				border-bottom-right-radius: 10rpx;
				z-index: 2;
				background-color: #fff;
			}

			color: $themeColor;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 20rpx;
			border-bottom-left-radius: 10rpx;
			border-bottom-right-radius: 0rpx;
			width: 50%;
			height: 100%;
			line-height: 88rpx;
			text-align: center;
			background-color: #fff;
		}
	}

	.center-item {
		display: flex;
	}

	.align-center {
		align-items: center;
	}
</style>
