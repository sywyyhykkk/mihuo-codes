<template>
	<view class="select align-items">
		<view class="label" :style="{'fontSize':styleObj.fontSize}">{{styleObj.label}}</view>
		<view class="select_con" @click="gotoSelect">
			<text class="text_type">
				{{value !== '' ? value : styleObj.selectInfo}}
			</text>
			<image src="../../static/icon/arrow_select.png" class="arrow_right" mode="aspectFill" />
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			styleObj:{
				type:Object,
				default(){
					return {}
				}
			},
			value: {
				type: String,
				default:''
			},
			multiple: {
				type: Boolean,
				default: false
			}
		},

		methods: {
			gotoSelect() {
				this.$emit("setIdentId")
				uni.navigateTo({
					url: `/pages/publishTask/selectPick?pageType=${'团队成员'}&multiple=${this.multiple}&assign=1`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.select {
		.label {
			width: 50%;
			font-weight: bold;
			font-size: 21.5rpx;
			color: $fontColor33;
		}
				
		.select_con {
			margin-left: 11rpx;
				
			.text_type {
				padding-right: 26rpx;
				font-size: 20rpx;
				color: $fontColor99;
			}
				
			.arrow_right {
				display: inline-block;
				width: 12rpx;
				height: 21.5rpx;
			}
		}
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
