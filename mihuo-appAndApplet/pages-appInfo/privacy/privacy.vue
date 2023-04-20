<template>
	<view>
		<web-view :src="privacy"></web-view>
	</view>
</template>
<script>
	export default {
		components: {
			
		},
		data() {
			return {
				privacy:'https://www.51mihuo.com/Privacy.html',
			}
		},
		onLoad() {
			// 计算出可用高度

		}
	}
</script>
