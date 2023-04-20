<template>
	<view>
		<Verify @success="success" :mode="'pop'" :captchaType="'blockPuzzle'"
			:imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
		<button @click="useVerify">调用验证组件</button>

	</view>

</template>
<script>
	//引入组件
	import Verify from "../components/verify/verify.vue";
	export default {
		name: 'app',
		components: {
			Verify
		},
		methods: {
			success(params) {
				console.log(params)
				// params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
			},
			useVerify() {
				this.$refs.verify.show()
			}
		}
	}
</script>
</script>
