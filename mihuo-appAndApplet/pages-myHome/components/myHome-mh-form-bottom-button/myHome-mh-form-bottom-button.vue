<template>
	<view class="action" :style="{ backgroundColor: bgColor }">
		<button class="cancel" type="default" @click="cancel">{{cancelText}}</button>
		<button class="sure" type="default" @click="sure">{{sureText}}</button>
	</view>
</template>

<script>
	export default {
		name: "myHome-mh-bottom-button",
		props: {
			label: {
				type: String,
				default: ""
			},
			value: {
				type: String,
				default: ''
			},
			border: {
				type: Boolean,
				default: false
			},
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			cancelText:{
				type:String,
				default: '不确认'
			},
			sureText:{
				type:String,
				default: '确认'
			}
		},
		data() {
			return {
				showSku: true,
			};
		},
		watch: {
			value: {
				handler(val) {
					this.showSku = val
				},
				immediate: true
			}
		},
		methods: {
			cancel() {
				this.$emit("onCancel")
			},
			sure() {
				this.$emit("onSure")
			}
		},
	}
</script>

<style lang="scss" scoped>
	.action {
		width: 100%;
		position: fixed;
		display: flex;
		justify-content: space-around;
		padding-top: 15rpx;
		@include buttonsafearea();

		.cancel,
		.sure {
			width: 44%;
			border: 1rpx solid #000000;
			border-radius: 42rpx;
			line-height: 84rpx;
			font-size: 28rpx;
		}

		.cancel {
			color: #000;
			background: #fff;
		}

		.sure {
			color: #fff;
			background: #000;
		}
	}
</style>
