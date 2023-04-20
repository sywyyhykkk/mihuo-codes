<template>
	<view class="house-type-list ">
		<view class="type-item public-flex-center">
			<view class="left">{{fieldName}}</view>
			<view class="right">
				<u-input class="input-contain" :clearable="false" type="digit"input-align="right" placeholder="请输入"
					trim v-model="num" :border="border" />
				<text class="unit" >{{unit}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 展示数量
	 * @property {String}			  fieldName    字段名称
	 * @property {String, Number}	  value
	 * @property {String}			  unit          单位
	 */
	export default {
		props: {
			fieldName: {
				type: String,
				default: '卧室',
			},
			value: {
				type: [String, Number],
				default: 0
			},
			unit: {
				type: String,
				default: '㎡',
			},
		},
		data() {
			return {
				num: 0,
				border: false,
			};
		},
		watch: {
			num: {
				handler(newVal, oldVal) {
					this.$emit('input', newVal)
				},
				deep: true
			}
		},
		mounted() {
			this.num = this.value
		},
		methods: {
			calculate(val) {
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

			}
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.uni-input-input {
		padding-top: 6rpx;
	}

	/deep/ .uni-input-placeholder {
		padding-top: 6rpx;
	}

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
		background-color: $bgColor;
		border-radius: $miniBorderRadius;
		margin-bottom: 2rpx;

		.type-item {
			justify-content: space-between;
			padding: 24rpx 0rpx 30rpx 18rpx;
			margin: 0 38rpx 0 38rpx;


			.left {
				color: $seconFontColor;
				font-size: $middleFontSize;
			}

			.right {
				display: flex;
				align-items: center;

				.unit {
					margin-left: 10rpx;
				}

				.input-contain {}

			}
		}
	}
</style>
