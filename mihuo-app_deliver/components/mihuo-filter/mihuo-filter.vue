<template>
	<view class="container">
		<view v-for="index in modeCount" class="container-arrow" :style="getStyle(index)" :key="index">
		</view>
		<view class="item-list">
			<view :class="selected.title === item.title? 'item-active':'item'" v-for="item in itemList" :key="item.title"
				@click="clicked(item)">
				<view :class="selected.title === item.title? 'item-title-active':'item-title'">
					{{item.title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//modeCount表示箭头的数量
	export default {
		name: "mihuo-filter",
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
			getStyle(index) {
				let style = '';
				// 1 找活 -> 定价类型
				// 2 找活 -> 订单类型
				// 3 找活 -> 技能要求
				// 4 找活 -> 排序
				// 5 找人 -> 人才类型
				// 6 找人 -> 工作经验
				// 7 找人 -> 筛选
				// 8 找服务 -> 商品分类
				// 9 找服务 -> 排序
				switch (this.modeCount) {
					case 2:
						if (index === 1 && this.selectedFilter === 8) {
							style = 'left: calc(25% - 30rpx); visibility: visible';
						}
						if (index === 2 && this.selectedFilter === 9) {
							style = 'left: calc(75% - 30rpx); visibility: visible';
						}
						break;
					case 3:
						if (index === 1 && this.selectedFilter === 5) {
							style = 'left: calc(16.5% - 20rpx); visibility: visible';
						}
						if (index === 2 && this.selectedFilter === 6) {
							style = 'left: calc(49.5% - 20rpx); visibility: visible';
						}
						if (index === 3 && this.selectedFilter === 7) {
							style = 'left: calc(82.5% - 20rpx); visibility: visible';
						}
						break;
					case 4:
						if (index === 1 && this.selectedFilter === 1) {
							style = 'left: calc(12.5% - 20rpx); visibility: visible';
						}
						if (index === 2 && this.selectedFilter === 2) {
							style = 'left: calc(37.5% - 30rpx); visibility: visible';
						}
						if (index === 3 && this.selectedFilter === 3) {
							style = 'left: calc(62.5% - 30rpx); visibility: visible';
						}
						if (index === 4 && this.selectedFilter === 4) {
							style = 'left: calc(87.5% - 40rpx); visibility: visible';
						}
						break;
					default:
						break;
				}
				return style;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		margin: 0rpx !important;
		width: 100vw;
		height: max-content;
		background-color: #fff;
		border-radius: 0rpx 0rpx 20rpx 20rpx;

		.container-arrow {
			height: 20rpx;
			width: 20rpx;
			background-color: #fff;
			position: absolute;
			top: 0rpx;
			border-left: 1px solid #fff;
			border-top: 1px solid #fff;
			transform: translate(50%, -50%) rotate(45deg);
			visibility: hidden;
		}

		.item-list {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: stretch;
			padding-left: 20rpx;

			.item {
				margin: 20rpx 20rpx;
				width: 140rpx;
				height: 60rpx;
				background: #FFFFFF;
				border: 1px solid #F6F6F6;
				border-radius: 10rpx;
				text-align: center;

				.item-title {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 26rpx;
					line-height: 60rpx;
					color: #606166;
				}
			}

			.item-active {
				margin: 20rpx 20rpx;
				width: 140rpx;
				height: 60rpx;
				background: #FFFFFF;
				border: 1px solid $themeColor;
				border-radius: 10rpx;
				text-align: center;

				.item-title-active {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 26rpx;
					line-height: 60rpx;
					color: $themeColor;
				}
			}
		}
	}
</style>
