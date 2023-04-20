<template>
	<view class="editImages">
		<mh-skeleton :loading="isLoading" :titleMarginTop="88" :imgTitleHeight="1280" :row="1" :showTitle="true">
			<!-- #ifdef MP-WEIXIN -->
			<u-lazy-load class="image" v-for="(item, index) in jsondata.listdata" :key="item.name"
				@click="
		  previewImage(
		    $image.imageGlobal +
		      item.url.replace('/admin/sys-file/mihuo-test/', '')
		  )
		" :image="$util.thumbnailImage(item.url, true, 750)"></u-lazy-load>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view v-for="item in jsondata.listdata" :key="item.name">
				<img-cache-fun mode="widthFix" class="image"
					@click="previewImage($image.imageGlobal+item.url.replace('/admin/sys-file/mihuo-test/', ''))"
					:src="$util.thumbnailImage(item.url, true, 750)" />
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<u-lazy-load class="image" v-for="(item, index) in jsondata.listdata" :key="item.name"
				@click="
        previewImage(
          $image.imageGlobal +
            item.url.replace('/admin/sys-file/mihuo-test/', '')
        )
      " :image="$util.thumbnailImage(item.url, true, 750)" />
			<!-- #endif -->
		</mh-skeleton>
	</view>
</template>

<script>
	export default {
		name: 'edit-images',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			},
			treeCode: {
				type: String,
				default: ''
			}
		},
		mounted() {
			setTimeout(() => {
				this.isLoading = false
			}, 600)
		},
		methods: {
			previewImage(url) {
				// 暂时禁用preview
				return
				uni.previewImage({
					current: url,
					urls: [url]
				})
			},
		},
		data() {
			let fontStyle = {}
			const sizeStyle = {}
			const colorStyle = {}
			for (const key in this.jsondata.style.size) {
				sizeStyle[key] =
					key === 'fontWeight' ?
					this.jsondata.style.size[key] :
					this.jsondata.style.size[key] + 'px'
			}
			fontStyle = {
				...sizeStyle,
				...this.jsondata.style.color
			}
			return {
				isLoading: true,
				fontStyle: fontStyle
			}
		},
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
			width: 100%;
		}
	}
</style>
