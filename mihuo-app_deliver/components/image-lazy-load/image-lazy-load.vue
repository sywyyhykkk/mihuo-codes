<template>
	<view class="image-lazy-load">
		<u-lazy-load class="item-image" :style="setStyle" :height="height"
			@click="preview($util.thumbnailImage(image,false))" :imgMode="imgMode" :border-radius="borderRadius"
			:image="$util.thumbnailImage(image,true)">
		</u-lazy-load>
	</view>
</template>

<script>
	export default {
		props: {
			image: {
				type: String,
				default: ''
			},
			// 图片裁剪模式
			imgMode: {
				type: String,
				default: 'aspectFill'
			},
			// 图片高度，单位rpx
			height: {
				type: [Number, String],
				default: '450'
			},
			borderRadius: {
				type: [Number, String],
				default: 10
			},
			viewStatus:{
				type: Boolean,
				default: true
			},
			width: {
				type: [Number, String],
				default: ''
			},
			
		},
		data() {
			return {
				option: {}
			}
		},
		computed: {
			setStyle() {
				return {
					width: this.width ? this.width + 'rpx' :  this.height + 'rpx'
				}
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			preview(url) {
				if(!this.viewStatus){
					this.$emit('click')
					return
				}
				uni.previewImage({
					current: 0,
					urls: [url],
					loop: true,
					indicator: 'number'
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	
</style>
