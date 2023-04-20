<template>
	<view class="editImages flex-center">
		<!-- #ifdef APP-PLUS -->
		 <image mode="widthFix" class="image" v-for="item in jsondata.listdata" :key="item.id"
		 	@click="gotopage(item)"
		 	:src="$util.thumbnailImage(item.coverImg,true)" />
		<!-- #endif -->
		<!-- #ifdef H5 -->
		 <image class="image" v-for="item in jsondata.listdata" :key="item.id"
		 	@click="gotopage(item)"
		 	:src="$util.thumbnailImage(item.coverImg,true)" />
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name: "edit-product",
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			gotopage(item) {

				this.toPage(`/`)
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
		background-color: #000000;
		background-color: #fff;
		border-radius: 5rpx;
		overflow: hidden;
		.image {
			width: 100%;
		}
	}
</style>
