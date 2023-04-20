<template>
	<view class="item-content" :class="{'contentBorder':border}">
		<view class="label">
			<text class="label-text">{{label}}</text>
		</view>
		<view class="contract">
			<text v-if="value" class="label-text">{{value}}</text>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "myHome-mh-form-item",
		props: {
			label: {
				type: String,
				default: ""
			},
			value: {
				type: String,
				default: ''
			},
			border:{
				type:Boolean,
				default:false
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
			close() {
				this.showSku = false;
				this.$emit('input', false);
				this.$emit('clearCur')
			}
		},
	}
</script>

<style lang="scss" scoped>
	.item-content{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:36rpx 30rpx;
		background: #fff;
		&.contentBorder{
			border-bottom:1rpx solid #f7f7f7;
		}
		.label{
			.label-text{
				color: #000000;
				font-size: 28rpx;
				font-weight: 600;
			}
		}
		.contract{
			flex: 1;
			text-align: right;
			.label-text{
				color: #000000;
				font-size: 28rpx;
				font-weight: 400;
			}
		}
	}
</style>
