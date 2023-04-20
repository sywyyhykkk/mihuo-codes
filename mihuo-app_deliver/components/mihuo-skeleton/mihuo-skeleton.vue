<template>
	<view>
		<view class="container u-skeleton">
			<view class="userinfo">
				<block>
					<!--u-skeleton-circle 绘制圆形-->
					<image class="userinfo-avatar u-skeleton-circle" :src="userInfo.avatarUrl"></image>
					<!--u-skeleton-fillet 绘制圆角矩形-->
					<text class="u-skeleton-fillet">{{userInfo.nickName}}</text>
				</block>
			</view>
			<view style="margin: 20px 0">
				<view v-for="(item,index) in lists" :key="index" class="lists">
					<!--u-skeleton-rect 绘制矩形-->
					<text class="u-skeleton-rect">{{item}}</text>
				</view>
			</view>
		</view>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 随意填充一些模拟数据，以撑开元素，供骨架组件查询和模拟块状数据
				userInfo: {
					avatarUrl: 'https://qlogo2.store.qq.com/qzone/1416956117/1416956117/100?1531323520',
					nickName: 'uView'
				},
				lists: [
					
				],
				loading: true, // 是否显示骨架屏组件
			}
		},
		onLoad() {
			this.loading = false;
			// 通过延时模拟向后端请求数据，调隐藏骨架屏
			setTimeout(() => {
				this.loading = false;
			}, 200)
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx 60rpx;
	}

	.userinfo {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.userinfo-avatar {
		width: 128rpx;
		height: 128rpx;
		margin: 20rpx;
		border-radius: 50%;
	}

	.lists {
		margin: 10px 0;
	}
</style>
