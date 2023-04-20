<template>
	<view class="house-type-list" :style="{'backgroundColor':bgColor}">
		<view class="type-item public-flex-center">
			<view class="left"><text v-if="requiredFlag && Number(requiredFlag) !== 0" class="mandatory">*</text>
				{{fieldName}}
			</view>
			<view class="right">
				<u-input class="input-contain" :clearable="false" @blur="blur" input-align="right" placeholder="请输入"
					trim v-model="num" :border="border" />
				<text class="unit">{{unit}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 展示数量
	 * @property {String}			  fieldName    字段名称
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
			bgColor: {
				type: String,
				default: '#fff',
			},
			requiredFlag: {
				type: [String, Number],
				default: 0
			}
		},
		data() {
			return {
				num: 0,
				border: false,
			};
		},
		watch: {
			num(val) {
				// this.$emit('input', val)
			}
		},
		mounted() {
			this.num = this.value
		},
		methods: {
			blur() {
				if (!isNaN(parseFloat(this.num)) && isFinite(this.num)) {
					this.num = Math.abs(this.num)
				}
				this.$emit('input', this.num)
			}
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.uni-input-input {
		padding-top: 6rpx;
		color: #999999;
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

		&:last-child {
			border-bottom-left-radius: 10rpx;

			// .type-item {
			// 	border-bottom: 0;
			// }
		}

		.type-item {
			justify-content: space-between;
			padding: 24rpx 0rpx 30rpx 18rpx;
			margin: 0 38rpx 0 38rpx;
			border-bottom: 2rpx dashed #EEEEEE;


			.left {
				color: $seconFontColor;
				font-size: $middleFontSize;
				position: relative;

				.mandatory {
					color: $errorColor;
				}
			}

			.right {
				display: flex;
				align-items: center;

				.unit {
					margin-left: 32rpx;
					max-width: 100rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.input-contain {}

			}
		}
	}
</style>
