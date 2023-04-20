<template>
	<view>
		<z-nav-bar>
			<view class="nav-bar" slot="default">
				{{ title }}
			</view>
		</z-nav-bar>
		<mh-empty icon="/static/images/no_recommend.png" title="您当前还没有任何相关记录~" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '开发中~~~'
			}
		},
		onLoad(options) {
			this.title = options.title
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.nav-bar {
		@include nav-bar-title(#333333)
	}
</style>
