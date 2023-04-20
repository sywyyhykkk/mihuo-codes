<template>
	<view class="mihuo-input">
		<view class="input-top display-justify_between">
			<text v-if="label" class="item-label"><text v-if="required" class="star">*</text>{{label}}</text>
			<text v-if="labelRight" class="label-right">{{labelRight}}</text>
		</view>
		<view class="item-value">
			<view v-if="type == 'textarea'" class="public-input_textarea">
				<u-input @input="handleInput" v-model="formValue" maxlength="200" height="140" type="textarea"
					:placeholder="placeholder" :border="false" />
			</view>
			<view v-if="type == 'select'" class="select" :style="[getStyle]" @click="selectClick">
				<view class="select-contain display-justify_between">
					<text class="right" :class="[value && 'active-select']">
						{{value ? value:placeholder}}
					</text>
					<u-icon name="arrow-right" size="24" color="#D9D9D9"></u-icon>
				</view>
			</view>
		</view>
		<view v-if="types.includes(type)" class="public-input_text">
			<view class="input_value">
				<u-input v-model="formValue" :placeholder="placeholder" @input="handleInput"
					placeholder-style="color:#909199" :height="height" :clearable="false" :type="type"
					:border="false" />
			</view>
			<view v-if="unit" class="item-unit">{{unit}}</view>
		</view>
		<!-- <view v-if="type == 'number'" class="public-input_text">
			<view class="input_value">
				<u-input v-model="formValue" :placeholder="placeholder" @input="handleInput"
					placeholder-style="color:#909199" :height="height" :clearable="false" type="number"
					:border="false" />
			</view>
			<view v-if="unit" class="item-unit">{{unit}}</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		props: {
			// 输入框的类型，textarea，text，number
			type: {
				type: String,
				default: 'text'
			},
			label: {
				type: String,
				default: ''
			},
			labelRight: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: '请输入内容'
			},
			// 高度，单位rpx
			height: {
				type: [Number, String],
				default: '88'
			},
			// 是否必填
			required: {
				type: Boolean,
				default: false
			},
			value: {
				type: [String, Number],
				default: ''
			},
			unit: {
				type: String,
				default: ''
			},
			integer: { // 正整数
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				option: {},
				selectShow: false,
				selectValue: '',
				formValue: '',
				types: ['text', 'number']
			}
		},
		watch: {
			value(val) {
				this.formValue = val
				this.$emit('input', val);
			},
			formValue(val) {
				if (this.integer) {
					this.setInput(val)
				}
			},
		},
		computed: {
			getStyle() {
				let style = {};
				style.height = this.height + 'rpx'
				// style = Object.assign(style, this.customStyle);
				return style;
			}
		},
		mounted() {
			this.formValue = this.value
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			handleInput(event) {
				this.debounce(() => {
					this.$emit('input', event);
				}, 200)
			},
			selectClick() {
				this.$emit('click');
			},
			setInput(even) {
				this.debounce(() => {
					if (even) {
						even = even + ''
						even = even.replace(/[^\d]/g, '')
						this.formValue = this.convertToPositiveInteger(even)
						this.$emit('input', this.formValue);
					}
				}, 200)
			},
			convertToPositiveInteger(num) {
				num = Math.abs(num);
				num = Math.floor(num);
				return num;
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	/deep/ .u-input__input {
		color: #303133;
	}

	.mihuo-input {
		// margin-bottom: 26rpx;

		&:last-child {
			margin-bottom: 0rpx;
		}

		.star {
			color: $errorColor;
			height: 28rpx;
			vertical-align: middle;
			display: inline-block;
		}

		.item-label {
			color: #303133;
			font-size: 28rpx;
			line-height: 38rpx;
			font-weight: bold;

		}

		.input-top {

			.label-right {
				color: $themeColor;
				font-size: $smallFontSize;
			}
		}

		.public-input_text {
			display: flex;
		}

		.input_value {
			padding: 0rpx 26rpx;
			background-color: #F6F7F9;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			flex: 1;
		}

		.item-value {
			margin-top: 12rpx;
			background-color: #F6F7F9;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			flex: 1;

			.public-input_textarea {
				margin-top: 12rpx;
				background-color: #F6F7F9;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				padding: 0rpx 26rpx;
				flex: 1;
			}


			.select {
				display: flex;
				flex: 1;

				.select-contain {
					display: flex;
					flex: 1;
					align-items: center;
					padding: 20rpx 30rpx;
					background-color: #F5F6F9;
					border-radius: 10rpx;
					color: $viceFontColor99;
					font-size: $fontSize26;

					.right {
						color: $viceFontColor99;
						font-size: $fontSize26;
					}

					.active-select {
						color: #303133;
					}
				}
			}
		}

		.item-unit {
			background-color: #F6F7F9;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #303133;
			min-width: 100rpx;
			margin-left: 10rpx;
		}
	}
</style>
