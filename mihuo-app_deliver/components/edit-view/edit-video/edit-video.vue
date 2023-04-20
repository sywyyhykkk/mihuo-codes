<template>
	<view class="editVideo flex-center" :class="jsondata.options.classname">
		<view v-for="item in jsondata.listdata" :key="item.url">
			<video style="width: 100%;" model="widthFix"
				:src="$image.imageGlobal+item.url.replace('/admin/sys-file/mihuo-test/', '')" />
		</view>
	</view>
</template>

<script>
	export default {
		name: "edit-video",
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
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
				fontStyle: fontStyle,
				voicePlayingId:0
			};
		}
	}
</script>

<style lang="scss" scoped>

</style>
