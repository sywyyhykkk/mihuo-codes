<template>
	<view class="container">
		<view v-for="index in modeCount" class="container-arrow">
		</view>
		<view class="item-list"  v-for="(item, index) in itemList">
			<view class="item"
				@click="clicked(item)">
				<view :class="selected.title === item.title? 'item-title-active':'item-title'">
					{{item.title}}
				</view>
			</view>
			<view class="divider" v-if="index !== itemList.length - 1"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "mihuo-filter-mini",
		props: {
			modeCount: {
				type: Number,
				default: 2
			},
			itemList: {
				type: Array,
				default: {
					title: '标题',
					value: 'value',
					prop: ''
				}
			},
			selectedFilter: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				show: true,
				selected: {
					title: '标题',
					value: 'value',
					prop: ''
				}
			};
		},
		methods: {
			clicked(item) {
				this.selected = item;
				this.$emit('clicked', item)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		width: 180rpx;
		height: max-content;
		background-color: #fff;
		border-radius: 10rpx;
		border: 2rpx solid #eeeeee;

		.container-arrow {
			height: 20rpx;
			width: 20rpx;
			background-color: #fff;
			position: absolute;
			top: 0rpx;
			border-left: 1px solid #eeeeee;
			border-top: 1px solid #eeeeee;
			transform: translate(50%, -50%) rotate(45deg);
			left: 70rpx;
		}

		.item-list {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.divider {
				width: 156rpx;
				border: 2rpx dashed #eeeeee;
			}

			.item {
				width: 178rpx;
				height: 60rpx;
				background: #FFFFFF;
				border-radius: 10rpx;
				text-align: center;
				padding: 10rpx 0rpx;

				.item-title {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 26rpx;
					line-height: 40rpx;
					color: #606166;
				}

				.item-title-active {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 26rpx;
					line-height: 40rpx;
					color: $themeColor;
				}
			}
		}
	}
</style>
