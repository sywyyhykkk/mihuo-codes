<template>
	<view>
		<web-view :src="webViewUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webViewUrl: ''
			}
		},
		onLoad(option) {
			// agreements
			switch (option.type) {
				case '1':
					// 用户协议
					this.webViewUrl = 'https://www.51mihuo.com/Server.html'
					break
				case '2':
					// 隐私协议
					this.webViewUrl = 'https://www.51mihuo.com/Privacy.html'
					break
				case '3':
					// 觅活知识产权协议
					this.webViewUrl = 'https://www.51mihuo.com/agreements/觅活知识产权协议.html'
					break
				case '4':
					// 觅活账户注销须知
					this.webViewUrl = 'https://www.51mihuo.com/agreements/觅活账户注销须知.html'
					break
				case '5':
					// 觅活用户行为规范
					this.webViewUrl = 'https://www.51mihuo.com/agreements/觅活用户行为规范.html'
					break
				case '6':
					// 觅活平台企业用户协议
					this.webViewUrl = 'https://www.51mihuo.com/agreements/觅活平台企业用户协议.html'
					break
				case '7':
					// 觅活平台工匠协议
					this.webViewUrl = 'https://www.51mihuo.com/agreements/觅活平台工匠协议.html'
					break
				case '8':
					// 觅活平台服务者协议主要审核部分
					this.webViewUrl = 'https://www.51mihuo.com/agreements/觅活平台服务者协议主要审核部分.html'
					break
				case '9':
					// 觅活服务行为规范
					this.webViewUrl = 'https://www.51mihuo.com/agreements/觅活服务行为规范.html'
					break
				case '10':
					// 觅活反商业贿赂协议
					this.webViewUrl = 'https://www.51mihuo.com/agreements/觅活反商业贿赂协议.html'
					break
			}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
