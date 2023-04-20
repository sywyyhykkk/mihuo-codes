<template>
	<view class="btn_box">
		<button class="item-button" :loading="loading" @click='onclick' :style="btnStyle">{{title}}</button>
	</view>
</template>

<script>
	export default {
		name: "mh-primary-button",
		props: {
			title: {
				default: '',
				type: String,
			},
			onclick: {
				type: Function
			},
			loading: {
				type: Boolean,
				default: false
			},
			btnStyle: {
				type: Object,
				default:function(){
					return {}
				}
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.btn_box {
		button {
			@include theme('btn_bg');
			color: #fff;
			border-radius: 8rpx;
			height: 70rpx;
			line-height: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
