<template>
	<view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				record: {}
			}
		},
		onLoad(option) {
			this.record = option.data
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
