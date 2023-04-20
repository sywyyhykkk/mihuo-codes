<template>
	<view>
		<view v-for="item, index in dataList" :key="index">
			<editVideo v-if="item.type=='video'" :jsondata="item" />
			<editIcontitle v-if="item.type=='icontitle'" :jsondata="item" />
			<editSorted v-if="item.type=='sorted'" :jsondata="item" />
			<editImages v-if="item.type=='images'" :jsondata="item" />
			<editWord v-if="item.type=='word'" :jsondata="item" />
			<editUnsorted v-if="item.type=='unsorted'" :jsondata="item" />
			<editNotInclude v-if="item.type=='notInclude'" :jsondata="item" />
		</view>
	</view>
</template>

<script>
	import editIcontitle from './edit-icontitle.vue'
	import editNotInclude from './edit-notInclude.vue'
	import editWord from './edit-word.vue'
	import editSorted from './edit-sorted.vue'
	import editImages from './edit-images.vue'
	import editUnsorted from './edit-unsorted.vue'
	import editVideo from './edit-video.vue'
	export default {
		name: 'richTextParsing',
		components: {
			editIcontitle,
			editNotInclude,
			editWord,
			editSorted,
			editVideo,
			editUnsorted,
			editImages
		},
		props: {
			data: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				dataList: []
			}
		},
		mounted() {
			this.dataList = JSON.parse(this.data)
		},
		watch: {
			data(newval, oldVal) {
				this.dataList = newval ? JSON.parse(newval) : []
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
