<template>
	<!-- #ifndef MP -->
	<view @click="onClick" class="img-style" :style="{
		borderTopLeftRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderTopRightRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderBottomLeftRadius: bottomRadius ? borderRadius + 'rpx' : '',
		borderBottomRightRadius: bottomRadius ? borderRadius + 'rpx' : '',
		}">
		<text :style="{ marginLeft: countMarginLeft + 'rpx' }" class="count" v-if="count">{{ count }}</text>
		<img-cache-fun :src="imgSrc" :mode="mode" class="img-style" :style="{
		borderTopLeftRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderTopRightRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderBottomLeftRadius: bottomRadius ? borderRadius + 'rpx' : '',
		borderBottomRightRadius: bottomRadius ? borderRadius + 'rpx' : '',
		}"></img-cache-fun>
	</view>
	<!-- #endif -->
	<!-- #ifdef MP -->
	<view class="img-style">
		<text :style="{ marginLeft: countMarginLeft + 'rpx' }" class="count" v-if="count">{{ count }}</text>
		<image :src="imgSrc" :mode="mode" class="img-style" @click="onClick" :style="{
		borderTopLeftRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderTopRightRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderBottomLeftRadius: bottomRadius ? borderRadius + 'rpx' : '',
		borderBottomRightRadius: bottomRadius ? borderRadius + 'rpx' : '',
		width: width + 'rpx',
		height: height + 'rpx'
		}"></image>
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		name: "mihuo-image",
		props: {
			// 角标偏移量
			countMarginLeft: {
				type: [String, Number],
				default: '30'
			},
			// 显示角标
			count: {
				type: [String, Number],
				default: ''
			},
			src: {
				type: String,
				default: ''
			},
			mode: {
				type: String,
				default: 'aspectToFit'
			},
			// 左上，右上的圆角
			upperRadius: {
				type: Boolean,
				default: false
			},
			// 左下，右下的圆角
			bottomRadius: {
				type: Boolean,
				default: false
			},
			borderRadius: {
				type: String,
				default: '20rpx'
			},
			width: {
				type: String,
				default: ''
			},
			height: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				imgSrc: ''
			};
		},
		mounted() {
			this.imgSrc = this.src
		},
		methods: {
			onClick() {
				this.$emit('click')
			},
		}
	}
</script>

<style scoped lang="scss">
	.img-style {
		width: 100%;
		height: 100%;
		will-change: transform;
		
		.count {
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			position: absolute;
			background: $themeColor;
			font-size: 20rpx;
			line-height: 30rpx;
			color: #FFFFFF;
			text-align: center;
			z-index: 99;
		}
	}
</style>
