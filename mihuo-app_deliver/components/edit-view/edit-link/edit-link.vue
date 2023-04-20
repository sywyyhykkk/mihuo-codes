<template>
	<view class="editImages flex-center">
		<!-- #ifdef APP-PLUS -->
		<img-cache-fun mode="widthFix" class="image"  v-for="item in jsondata.listdata" :key="item.name" @click="toPageImage(item)"
			 :src="$util.thumbnailImage(item.url,true)"/>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<img mode="widthFix" class="image"  v-for="item in jsondata.listdata" :key="item.name" @click="toPageImage(item)"
			 :src="$util.thumbnailImage(item.url,true)"/>
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
				let data=item.listdata[0];
				switch (item.appPage){
					case '/pages/mall/productDetail/productDetail':
					  this.toPage(item.appPage+`?data=${JSON.stringify(data)}`)
					  break;
					case '/pages/home/article':
					  this.toPage(item.appPage+`?title=${data.typeName}&typeTreeCode=${data.typeTreeCode}`)
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
