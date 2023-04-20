<template>
	<view v-html="textData" class="edit-word">
	</view>
</template>

<script>
	export default {
		name: 'editWord',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				textData: ''
			}
		},
		mounted() {
			let data = this.jsondata.content || jsondata.data.content
			//真机不支持replaceAll,换replace解决
			this.textData = data?.replace(/\n/g, '<br/>')
		},
	}
</script>

<style scoped lang="scss">
	.edit-word {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #141414;
		line-height: 36rpx;
	}
</style>
