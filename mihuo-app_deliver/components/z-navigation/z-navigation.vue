<template>
	<view class="z-navigation">
		<!-- <u-tabbar @midButtonClick="midButtonClick" icon-size="34" activeColor="$themeColor" inactiveColor="#999"
			v-model="current" :list="tabbar" :mid-button="true"></u-tabbar> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				tabbar: [{
						iconPath: "/static/images/index.png",
						selectedIconPath: "/static/images/Select_index.png",
						text: '首页',
						pagePath: "/pages/home/home"
					},
					{
						iconPath: "/static/images/order.png",
						selectedIconPath: "/static/images/Select_order.png",
						text: '订单',
						pagePath: "/pages/order/newOrder"
					},
					{
						iconPath: "/static/images/release.png",
						selectedIconPath: "/static/images/release.png",
						text: '发布任务',
						midButton: true,
						pagePath: "/pages/publishTask/sendOrder"
					},
					{
						iconPath: "/static/images/message.png",
						selectedIconPath: "/static/images/Select_message.png",
						text: '消息',
						pagePath: "/pages/message/index"
					},
					{
						iconPath: "/static/images/icon_user/icon_user_3.png",
						selectedIconPath: "/static/images/Select_user.png",
						text: '我的',
						pagePath: "/pages/mine/personalCenter"
					},
				]
			};
		},
		methods: {

		},
		mounted() {

		},
		methods: {
			midButtonClick() {
				this.$emit('middleButtonClick');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.z-navigation {
		color: #007AFF;
	}

	;
</style>
