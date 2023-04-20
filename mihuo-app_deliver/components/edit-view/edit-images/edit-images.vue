<template>
	<view class="editImages">
		<!-- #ifdef APP-PLUS -->
		 <img-cache-fun mode="widthFix" class="image" v-for="item in jsondata.listdata" :key="item.url"
		 	@click="previewImage($image.imageGlobal+item.url.replace('/admin/sys-file/mihuo-test/', ''))"
		 	:src="$util.thumbnailImage(item.url,true)" />
		<!-- #endif -->
		<!-- #ifdef H5 -->
		 <u-lazy-load class="image" v-for="item in jsondata.listdata" :key="item.url"
		 	@click="previewImage($image.imageGlobal+item.url.replace('/admin/sys-file/mihuo-test/', ''))"
		 	:image="$util.thumbnailImage(item.url,true)" />
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name: "edit-images",
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			previewImage(url) {
				uni.previewImage({
					current: url,
					urls: [url]
				})
			}
		},
		data() {
			let fontStyle = {}
			const sizeStyle = {}
			const colorStyle = {}
			for (const key in this.jsondata.style.size) {
				sizeStyle[key] = key === 'fontWeight' ? this.jsondata.style.size[key] : this.jsondata.style.size[key] +
					'px'
			}
			fontStyle = {
				...sizeStyle,
				...this.jsondata.style.color
			}
			return {
				fontStyle: fontStyle
			};
		}
	}
</script>

<style lang="scss" scoped>
	.editImages {
		background-color: #000;
		width: 100%;
		background-color: #fff;
		border-radius: 5rpx;
		line-height: 1;
		overflow: hidden;
		.image {
			width: 100vw;
		}
	}
</style>
