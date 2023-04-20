<template>
	<view class="edit-sorted">
		<view>
			<!--      <view class="point">-->
			<!--        POINT-->
			<!--      </view>-->
			<view class="edit-sorted-title">
				<text class="edit-sorted-title">{{ jsondata.data.sortIndex ? jsondata.data.sortIndex : '' }}</text>
				{{ jsondata.data.content || jsondata.content }}
			</view>
			<!--      <view class="edit-sorted-bottom"></view>-->
		</view>
	</view>
</template>

<script>
	export default {
		name: 'edit-sorted',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		}
	}
</script>

<style scoped lang="scss">
	.edit-sorted {
		display: flex;

		.point {
			font-size: 12rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #141414;
		}

		.edit-sorted-title {
			margin-top: 10rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #808080;
			line-height: 43rpx;
		}


	}
</style>
