<template>
	<view class="form-item flex-center">
		<view class="label" :style="{color: labelColor}">
			<text v-if="required" class="required">*</text>
			{{ label }}
		</view>
		<view class="input-container" :style="{ '--display-none' : mode !== 'input' ? 'inline' : 'none' }">
			<!-- <u-input class="input-area" :style="{ backgroundColor: backgroundColor, color: textColor }"
				style="padding: 7rpx 26rpx; border-radius: 12rpx" v-model="modelValue"
				:placeholder-style="`color: ${textColor}`" :type="type" :disabled="getIsDisabled" :maxlength="maxLength"
				:placeholder="getPlaceholder" @click="clickInput" @input="onInput" /> -->
			<u-input class="input-area" :style="{ backgroundColor: backgroundColor, color: textColor }" v-model="modelValue"
				:custom-style="{
					borderRadius:'12rpx',
					padding:'7rpx 26rpx'
				}"
				:placeholder-style="`color: ${textColor}`" :type="type" :disabled="getIsDisabled" :maxlength="maxLength"
				:placeholder="getPlaceholder" @click="clickInput" @input="onInput" />
		</view>
		<u-picker v-model="isShowTimePicker" mode="time" :params="params" @confirm="confirmTime">
		</u-picker>
	</view>
</template>

<script>
	export default {
		name: "app-form-item",
		props: {
			// 表单类型
			mode: {
				type: String,
				default:()=> 'input',
				validator: (value) => {
					return ['input', 'address', 'date', 'datetime'].indexOf(value) !== -1;
				}
			},
			// 默认值
			defaultValue: {
				type: String,
				default: '',
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 是否必须
			required: {
				type: Boolean,
				default: true
			},
			// 表单标签名称
			label: {
				type: String,
				default: '标签名称'
			},
			// 表单绑定值字段名
			model: {
				type: String,
				default: 'model'
			},
			placeholder: {
				type: String,
				default: ''
			},
			maxLength: {
				type: Number,
				default: 9999
			},
			// input type
			type: {
				type: String,
				default: 'text'
			},
			// 字体颜色
			textColor: {
				type: String,
				default: '#141414'
			},
			// 标签颜色
			labelColor: {
				type: String,
				default: '#141414'
			},
			// 输入区域背景颜色
			backgroundColor: {
				type: String,
				default: '#F7F7F7'
			},
			reset: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				isShowTimePicker: false,
				modelValue: '',
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
				},
			};
		},
		computed: {
			getIsDisabled() {
				if (this.mode === 'address' || this.mode === 'datetime' || this.mode === 'date') {
					return true
				} else {
					return this.disabled
				}
			},
			getPlaceholder() {
				if (this.placeholder) {
					return this.placeholder
				}
				return `请${this.mode !== 'input' ? '选择' : '输入'}${this.label}`
			}
		},
		mounted() {
			if(this.defaultValue){
				this.modelValue = this.defaultValue
			}
			if(this.mode === 'date'){
				this.params['hour'] = false
				this.params['minute'] = false
			}
		},
		deactivated() {
			if(this.reset){
				this.modelValue = this.defaultValue || ''
			}
		},
		methods: {
			onInput(e) {
				this.modelValue = e
				this.$emit('input', e, this.model)
			},
			clickInput(e) {
				if (this.disabled) {
					return
				} else if (this.mode === 'datetime' || this.mode === 'date') {
					this.isShowTimePicker = true
				}
			},
			confirmTime(value) {
				if(this.mode === 'date'){
					const date = value.year + "-" + value.month + "-" + value.day
					this.modelValue = date
					this.$emit('input', date, this.model)
				} else {
					const datetime = value.year + "-" + value.month + "-" + value.day + ' ' + value.hour + ':' + value.minute
					this.modelValue = datetime
					this.$emit('input', datetime, this.model)
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-input__right-icon{
		margin-right: 10rpx;
	}
	.form-item {
		width: calc(100vw - 80rpx);
		align-items: flex-start;
		flex-direction: column;
		margin: 0 40rpx;
		margin-bottom: 40rpx;
		.label {
			width: 100%;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #141414;
			line-height: 34rpx;

			.required {
				font-size: 16rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FF0000;
				line-height: 34rpx;
				margin-right: 10rpx;
			}
		}

		.input-container {
			width: 100%;
			height: max-content;
			margin-top: 22rpx;
			--display-none: 'inline';
			/*  #ifdef MP-WEIXIN */
			background: #F7F7F7;
			/*  #endif  */
			.input-area {
				width: 100%;
				height: max-content;
				font-size: 26rpx;
				font-family: PingFang SC;
				color: #141414;
				line-height: 34rpx;

				&::after {
					display: var(--display-none);
					content: '';
					position: absolute;
					right: 40rpx;
					margin-top: 25rpx;
					border: solid #808080;
					border-width: 0 3rpx 3rpx 0;
					padding: 6rpx;
					transform: rotate(45deg);
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	/deep/ .uni-input-input {
		color: #141414;
	}
</style>
