<template>
	<view class="editImages flex-center">
		<!-- #ifdef APP-PLUS -->
		<findMaster-mh-img-cache-fun mode="widthFix"class="image" :key="jsondata.listdata[0].name"
			@click="toPageImage(jsondata.listdata[0])" :src="$util.thumbnailImage(jsondata.listdata[0].url,true)" />
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<image mode="widthFix" class="image" v-for="item in jsondata.listdata" :key="item.name" @click="toPageImage(item)"
			:src="$util.thumbnailImage(item.url,true)" />
		<!-- #endif -->
	</view>
</template>

<script>
	// 这个单独提出来做一个组件主要是为了 以免后面有其他的跳转好统一处理。
	export default {
		name: "edit-Images",
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			toPageImage(item) {
				switch (item.appPage) {
					case '/pages/home/article':
						this.toPage(item.appPage + `id=${item.linkCms[0].id}&?title=${item.linkCms[0].typeName}`)
						break;
					case '/pages/category/category':
						const data = {
							treeCode: item.link,
						};
						this.toPage(
							`/pages-mall/cateList/cateList?data=${JSON.stringify(data)}`
						);
						// uni.setStorageSync('treeCode', item.link)
						// this.toTab(item.appPage)
						break
					case '/pages-mall/productDetail/productDetail':
					    this.toPage(item.appPage + `?id=${item.linkProduct[0].id}`)
						break;
					default:
					    this.toPage(item.appPage)
						break;
				}
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
		background-color: #fff;
		background-color: #000000;
		width: 100%;
		height: auto;
		background-color: #000000;
		background-color: #fff;
		border-radius: 5rpx;
		overflow: hidden;

		.image {
			width: 100%;
		}
	}
</style>
