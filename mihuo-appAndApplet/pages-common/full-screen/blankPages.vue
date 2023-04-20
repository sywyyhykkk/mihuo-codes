<template>
	<view class="blankPages"></view>
</template>

<script>
	export default {
		data(){
			return{
				
			}
		},
		onLoad() {
			// uni.navigateBack();
			// uni.navigateBack();
			uni.navigateBack({
				delta: 2
			});
		}
	}
</script>

<style>
</style>
