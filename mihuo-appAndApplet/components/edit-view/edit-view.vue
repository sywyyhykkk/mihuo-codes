<template>
	<view class="editView">
		<view v-for="(item,index) in materialContent" :key="index">
			<view :style="[getStyle(item)]">
				<editword v-if="item.type=='word'" :jsondata="item" />
				<editimages v-if="item.type=='images'" :jsondata="item" />
				<editvideo v-if="item.type=='video'" :jsondata="item" />
				<editaudio v-if="item.type=='audio'" :jsondata="item" />
				<editlink v-if="item.type=='link'" :jsondata="item" />
				<editsorted v-if="item.type=='sorted' || item.type=='unsorted'" :jsondata="item" />
				<editdivider v-if="item.type=='divider'" :jsondata="item" />
				<editicontitle v-if="item.type=='icontitle'" :jsondata="item"></editicontitle>
				<editproduct v-if="item.type=='product'" :jsondata="item" />
			</view>
		</view>
	</view>
</template>
<script>
	// 悲伤的故事component 不能使用 只能条件判断去渲染
	import editword from './edit-word/edit-word.vue';
	import editimages from './edit-images/edit-images.vue';
	import editvideo from './edit-video/edit-video.vue'
	import editaudio from './edit-audio/edit-audio.vue'
	import editlink from './edit-link/edit-link.vue'
	import editsorted from './edit-sorted/edit-sorted.vue'
	import editdivider from './edit-divider/edit-divider.vue'
	import editicontitle from './edit-icontitle/edit-icontitle.vue'
	import editproduct from './edit-product/edit-product.vue'
	export default {
		components: {
			editword,
			editimages,
			editvideo,
			editaudio,
			editlink,
			editsorted,
			editicontitle,
			editdivider,
			editproduct
		},
		name: "edit-view",
		props: {
			value: {
				type: String,
				default: '[]'
			},
		},
		watch:{
			value: {
				handler(val) {
					this.materialContent = JSON.parse(val);
				},
				immediate: true
			},
		},
		methods: {
			getStyle(item) {
				if (!item.layout) return {}
				if (!item.layout.spacing) return {}
				const layoutStyle = {}
				for (const key in item.layout.spacing) {
					layoutStyle[key] = item.layout.spacing[key] * 2 + 'rpx'
				}
				return layoutStyle
			}
		},
		mounted() {
			this.materialContent = JSON.parse(this.value)
		},
		data() {
			return {
				materialContent: JSON.parse(this.value),
				allMiniItem: {
					images: {
						name: '图片',
						icon: 'el-icon-picture',
					},
					divider: {
						name: '分割线',
						icon: 'el-icon-minus',
					},
					word: {
						name: '段落文字',
						icon: 'el-icon-reading',
					},
					video: {
						name: '评分',
						icon: 'el-icon-star-off',
					}
				}
			};
		}
	}
</script>

<style lang="scss" scoped>
	.editView {
		.small {
			font-size: 24rpx;
			line-height: 1.8;
		}

		.default {
			font-size: 28rpx;
			line-height: 1.8;
		}

		.middle {
			font-size: 32rpx;
			line-height: 1.8;
		}

		.large {
			font-size: 36rpx;
			line-height: 1.8;
		}
	}
</style>
