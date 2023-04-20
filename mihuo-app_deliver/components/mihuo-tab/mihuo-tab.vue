<template>
	<view class="mihuo-tab">
		<u-tabs :list="tabList" :active-item-style="activeItemStyle" :bar-style="barStyle" :is-scroll="false"
			:current="selectedTab || current" bar-width="42" @change="changeTabs" active-color="#002FA5"
			inactive-color="#606166" font-size="28" class="skill-tab">
		</u-tabs>
	</view>
</template>

<script>
	export default {
		name: "mihuo-tab",
		props: {
			current: {
				type: [Number, String],
				default: 0
			},
			tabList: {
				type: Array,
				default: () => {
					return [{
						name: '服务订单'
					}, {
						name: '需求市场'
					}, {
						name: '更多功能'
					}]
				}
			}
		},
		data() {
			return {
				selectedTab: 0,
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '30rpx'
				},
				barStyle: {
					bottom: '-10rpx',
					// height:'4rpx',
					borderRadius: '12rpx'
				}
			};
		},
		watch: {
			current: {
				handler(newVal, oldVal) {
					this.selectedTab = newVal;
				},
				deep: true
			}
		},
		methods: {
			changeTabs(index) {
				this.selectedTab = index;
				this.$emit('changeTab', index);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mihuo-tab {
		// width: 750rpx;
		width: 372rpx;
		height: 88rpx;
		background-color: #FFFFFF;
		// box-shadow: 0 6rpx 8rpx rgba(183, 183, 183, 0.25);

		.tab-item {
			width: 33.3%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;

			.title {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 108rpx;
				text-align: center;
				color: #303133;
				display: flex;
				flex-direction: column;
			}

			.title-a {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 108rpx;
				text-align: center;
				color: $themeColor;
				display: flex;
				flex-direction: column;
			}
		}
	}

	/deep/.u-scroll-view {
		height: 88rpx;
	}
</style>
