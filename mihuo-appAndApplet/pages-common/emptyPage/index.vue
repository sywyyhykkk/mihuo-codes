<template>
	<view>
		<z-nav-bar backState="3000" color="#fff" @backClick="goBackPage">
			<view slot="default">
				该功能还在开发中～
			</view>
		</z-nav-bar>
		<common-mh-empty icon="@/pages-common/static/images/wait_examine.png" title="现在什么都没有" />
	</view>
</template>

<script>
	export default {
		data (){
			return {}
		},
		methods:{
			goBackPage(){
				this.goBack();
			}
		}
	}
</script>
	
<style>
</style>
