<template>
	<view>
		<image class="not-include" src="@/pages-mall/static/product/not_include.png" />
	</view>
</template>

<script>
	export default {
		name: 'editNotInclude',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		}
	}
</script>

<style scoped lang="scss">
	.not-include {
		width: 93rpx;
		height: 37rpx;
		margin-top: 60rpx;
	}
</style>
