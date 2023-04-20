<template>
	<view v-if="service">
		<z-nav-bar bgColor="#FFFFFF" :title="service.name"></z-nav-bar>
		<edit-view v-model="service.content"></edit-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				service:{}
			}
		},
		onShow() {
			var _this = this
			uni.$on('content', (data) => {
				_this.service = data;
			})
		},
		onHide() {
			uni.$off('content')
		}
	}
</script>

<style lang="scss" scoped>

</style>
