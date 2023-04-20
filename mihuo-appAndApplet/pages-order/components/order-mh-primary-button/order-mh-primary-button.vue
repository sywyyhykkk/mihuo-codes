<template>
	<view class="btn_box">
		<button :loading="loading" @click='clickEvent'>{{title}}</button>
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
			loading: {
				type: Boolean,
				default: false
			}
		},
		methods:{
		   clickEvent(){
			   this.$emit("onclick")
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
			border-radius: 80rpx;
			height: 70rpx;
			line-height: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
		}
	}
</style>
