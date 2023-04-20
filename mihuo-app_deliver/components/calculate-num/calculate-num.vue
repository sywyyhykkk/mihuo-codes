<template>
	<view class="house-type-list " :key="index">
		<view class="type-item public-flex-center">
			<view class="left">{{fieldName}}</view>
			<view class="right">
				<view class="item-operation public-flex-center" @click="calculate('减')">
					<u-icon size="24" color="#C4C4C4" name="minus"></u-icon>
				</view>
				<text class="num">{{num}}</text>
				<view class="item-operation public-flex-center" @click="calculate('加')">
					<u-icon size="24" color="#3A3838" name="plus"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 展示数量
	 * @property {String}			  fieldName    字段名称
	 * @property {String | Number}	  value
	 */
	export default {
		name:'calculate-num',
		props: {
			fieldName: {
				type: String,
				default: '卧室',
			},
			value: {
				type: [String, Number],
				default: 0
			},
			index: {
				type: [String, Number],
				default: 0
			}
		},
		data() {
			return {
				num: 0,
			};
		},
		mounted() {
			this.num = this.value
		},
		methods: {
			calculate(val) {
				this.debounce(()=>{
					if (val === '加') {
						this.num++
					} else {
						if (this.num <= 0) {
							this.num = 0
							return
						}
						this.num--
					}
					this.$emit('input', this.num)
					this.$emit('calculate',val)
				},200)
			}
		},
	};
</script>

<style lang="scss" scoped>
	.public-flex {
		display: flex;
		align-items: center;
	}

	.public-flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.house-type-list {


		&:last-child {
			border-bottom-left-radius: 10rpx;

			.type-item {
				border-bottom: 0;
			}
		}

		.type-item {
			justify-content: space-between;
			padding: 34rpx 0rpx 40rpx 18rpx;
			margin: 0 38rpx 0 38rpx;
			border-bottom: 2rpx dashed #EEEEEE;


			.left {
				color: $seconFontColor;
				font-size: $middleFontSize;
			}

			.right {
				display: flex;
				align-items: center;

				.item-operation {
					background-color: #F6F6F6;
					width: 38rpx;
					height: 56rpx;
					border-radius: 4rpx;
				}

				.num {
					font-weight: bold;
					font-size: $smallFontSize;
					color: $viceFontColor;
					margin: 0 28rpx 0 28rpx;

				}

			}
		}
	}
</style>
