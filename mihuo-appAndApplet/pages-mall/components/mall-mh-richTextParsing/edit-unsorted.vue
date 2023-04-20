<template>
	<view class="view-li">
		<text class="edit-unsorted">
			{{ jsondata.data.content || jsondata.content }}
		</text>
	</view>
</template>

<script>
	export default {
		name: 'editUnsorted',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		}
	}
</script>

<style scoped lang="scss">
	.view-li {
		&::before {
			content: ".";
			color: #FE6E32;
			margin-top: 10rpx;
			margin-left: 54rpx;
			font-size: 60rpx;
			margin-right: 10rpx;
		}
	}

	.edit-unsorted {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #808080 !important;
		line-height: 46rpx;
	}
</style>
