<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				{{list.title}}
			</view>
		</z-nav-bar>
		<view class="my_cms">
			<edit-view v-model="content" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: {},
				content: '[]',
				style: [],
				pageType: false,
				id: 0
			}
		},
		onLoad(option) {
			if (option.list) {
				this.list = JSON.parse(option.list)
				this.content = JSON.parse(option.list).content
			}
			if (option.id) {
				this.id = option.id
			}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.my_cms {
		background-color: #FFFFFF;
	}

	.nav-bar {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 32rpx;
		text-align: center;
		color: #333333;
	}
</style>
