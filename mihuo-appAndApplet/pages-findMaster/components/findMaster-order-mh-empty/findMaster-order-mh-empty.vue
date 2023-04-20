<template>
	<view>
		<u-empty class="empty" :margin-top='marginTop' :icon-size='size' :src="icon" :text="title"
			mode="list"></u-empty>
	</view>
</template>

<script>
	export default {
		name: "mh-empty",
		props: {
			icon:{
				type:String,
				default:'https://www.51mihuo.com/static/images/no_recommend.png'
			},
			title:{
              type:String,
			  default:'空空的'
			},
			marginTop:{
				type:String,
				default:'260'
			},
			size:{
				type:String,
				default:'200'
			}
		},
		data() {
			return {

			};
		},
	}
</script>

<style lang="scss" scoped>
.empty{
	display: flex;
	justify-content: center;
}
</style>
