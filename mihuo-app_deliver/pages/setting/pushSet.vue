<template>
	<view class="content">
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">推送内容设置</view>
		</z-nav-bar>
		<u-gap height="12" bg-color="#eee"></u-gap>
		<view class="push_item" v-for="(item,index) in pushList" :key="index">
			<view class="left">
				<view class="title">{{item.title}}</view>
				<view class="sub_title">{{item.subTitle}}</view>
			</view>
			<view class="switch">
				<u-switch :active-color="$styleColor.themeColor" inactive-color="#C4C4C4" size=26 v-model="item.open" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pushList: [{
						title: '聊天信息推送',
						subTitle: '关闭后将不再向您推送聊天消息通知',
						open: true
					},
					{
						title: '报价通知推送',
						subTitle: '关闭后将不再向您推送工人报价通知',
						open: true
					},
					{
						title: '订单状态推送',
						subTitle: '关闭后将不再向您推送订单状态变化通知',
						open: false
					},
					{
						title: '内容互动推送',
						subTitle: '关闭后将不再向您推送互动消息通知',
						open: true
					},
					{
						title: '个性化内容推荐',
						subTitle: '关闭后将不再向您推荐个性化内容',
						open: true
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.nav-bar {
		@include nav-bar-title($fontColor33)
	}

	.content {
		height: 100vh;
		background: #FFFFFF;

		.push_item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx 56rpx 24rpx;
			border-bottom: 1px solid #F6F6F6;

			.left {
				font-weight: 400;

				.title {
					font-size: $middleFontSize;
					color: $seconFontColor;
				}

				.sub_title {
					margin-top: 10rpx;
					font-size: $smallFontSize;
					color: $viceFontColor;
				}
			}
		}
	}
</style>
