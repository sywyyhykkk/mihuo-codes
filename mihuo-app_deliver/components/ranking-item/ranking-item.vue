<template>
	<view class="item flex-center">
		<view class="rank flex-center">
			<view class="rank-text" v-if="data.rank > 3">
				<text> {{ data.rank }} </text>
			</view>
			<image v-if="data.rank === 1" src="../../static/icon/first_place.png" class="icon"></image>
			<image v-if="data.rank === 2" src="../../static/icon/second_place.png" class="icon"></image>
			<image v-if="data.rank === 3" src="../../static/icon/third_place.png" class="icon"></image>
		</view>
		<view class="name-container flex-center">
			<u-avatar size="64" :src="$image.imageGlobal + data.avatar"></u-avatar>
			<view class="name">
				{{data.name || ''}}
			</view>
			<skill-level-tag :level="data.level" :title="data.skillName" :textColor="'#002FA5'" :bgColor="'rgba(0, 47, 165, .1)'"></skill-level-tag>
		</view>
		<view class="index">
			{{data.trustScore || data.money || 0}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "ranking-item",
		props: ['data'],
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		width: 660rpx;
		height: 110rpx;
		background: #F6FCFF;
		border-radius: 10rpx;
		margin: 10rpx 0;

		.rank {
			width: 20%;
			height: 100%;
			justify-content: center;

			.rank-text {
				width: 68rpx;
				height: 68rpx;
				text-align: center;	
				text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 900;
					font-size: 28rpx;
					line-height: 68rpx;
					color: #303133;
				}
			}

			.icon {
				width: 68rpx;
				height: 72rpx;
			}
		}

		.name-container {
			min-width: 60%;
			width: max-content;
			height: 100%;

			.name {
				width: max-content;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 24rpx;
				line-height: 110rpx;
				color: #333333;
				margin: 0 14rpx;
			}
		}

		.index {
			width: 20%;
			height: 100%;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 900;
			font-size: 36rpx;
			line-height: 110rpx;
			text-align: center;
			color: #FF5D35;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
