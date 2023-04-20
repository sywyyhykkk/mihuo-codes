<template>
	<view class="add-and-subtract">
		<view class="item-operation" @click="calculate('减')">
			<u-icon size="24" color="#C4C4C4" name="minus">
			</u-icon>
		</view>
		<view class="public-input-contain">
			<u-input @input="setInput($event)" class="public-input-num" input-align="center" height="52"
				v-model="formValue" :clearable="false" type="number" placeholder="" :border="false" />
		</view>
		<view class="item-operation" @click="calculate('加')">
			<u-icon size="24" color="#3A3838" name="plus">
			</u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			value: {
				type: [String,Number],
				default: ''
			}
		},
		data() {
			return {
				option: {},
				formValue:''
			}
		},
		watch: {
			value(val) {
				this.formValue = val
				this.$emit('input', val);
			}
		},
		computed: {

		},
		mounted() {
			this.formValue = this.value
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			setInput(even) {
				this.debounce(() => {
					even = even.replace(/[^\d]/g, "")
					this.$emit('calculate', '输入', this.info,Number(even))
				}, 200)
			},
			calculate(type) {
				if(type == '加'){
					this.formValue++
				}else{
					if(this.formValue > 0){
						this.formValue--
					}
				}
				this.$emit('calculate', type, this.info)
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.add-and-subtract {
		display: flex;
		align-items: center;

		.calculate-num {
			margin: 0rpx 16rpx;
			color: $seconFontColor;
			font-size: $middleFontSize;
		}

		.item-operation {
			width: 52rpx;
			height: 52rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1rpx solid #EEEEEE;
			border-radius: 4rpx;
			background-color: #fff;
		}

		.item-operation-active {
			background-color: $themeColor;
		}

		.item-operation-border-active {
			border-color: $themeColor;
		}
		
		.public-input-contain {
			width: 68rpx;
			border-radius: 4rpx;
			font-size: 24rpx;
			height: 52rpx;
			margin: 0 2rpx 0 2rpx;
			border: 0.5px solid #EEEEEE;
		
			/deep/ .uni-input-input {
				color: #909199;
			}
		
			/deep/ .u-input__right-icon {
				padding-right: 0rpx !important;
			}
		}
	}
</style>
