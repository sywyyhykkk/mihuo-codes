<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<web-view :src="serviceAgreement"></web-view>
		<!-- #endif -->
	</view>
</template>
<script>
	export default {
		components: {
			
		},
		data() {
			return {
				serviceAgreement:'https://www.51mihuo.com/Server.html',
			}
		},
		onLoad() {
			// 计算出可用高度

		}
	}
</script>
