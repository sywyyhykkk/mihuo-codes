<template>
	<!-- #ifndef MP -->
	<view @click="onClick" class="img-style" :style="{
		borderTopLeftRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderTopRightRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderBottomLeftRadius: bottomRadius ? borderRadius + 'rpx' : '',
		borderBottomRightRadius: bottomRadius ? borderRadius + 'rpx' : '',
		}">
		<mall-mh-img-cache-fun :src="imgSrc" :mode="mode" class="img-style" :style="{
		borderTopLeftRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderTopRightRadius: upperRadius ? borderRadius + 'rpx' : '',
		borderBottomLeftRadius: bottomRadius ? borderRadius + 'rpx' : '',
		borderBottomRightRadius: bottomRadius ? borderRadius + 'rpx' : '',
		}"></mall-mh-img-cache-fun>
	</view>
	<!-- #endif -->
	<!-- #ifdef MP-WEIXIN -->
	<image :src="imgSrc" :mode="mode" class="img-style" @click="onClick" :style="{
	borderTopLeftRadius: upperRadius ? borderRadius + 'rpx' : '',
	borderTopRightRadius: upperRadius ? borderRadius + 'rpx' : '',
	borderBottomLeftRadius: bottomRadius ? borderRadius + 'rpx' : '',
	borderBottomRightRadius: bottomRadius ? borderRadius + 'rpx' : '',
	width: width + 'rpx',
	height: height + 'rpx'
	}"></image>
	<!-- #endif -->
</template>

<script>
	export default {
		name: "mihuo-image",
		props: {
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
			// // #ifndef MP
			// this.imgSrc = this.src.replace('https://www.51mihuo.com', '')
			// // #endif
			// // #ifdef MP
			// this.imgSrc = this.src.replace('@', 'https://www.51mihuo.com')
			// // #endif
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
	}
</style>
