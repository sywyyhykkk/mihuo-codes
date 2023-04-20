<template>
	<view class="container">
		<view class="max-list">
			<view class="c" v-for="(item,index) in 20">
				<view class="list-header">{{index}}</view>
				<view class="list-content">
					<view>Apple</view>
					<view>Artichoke</view>
					<view>Aardvark</view>
					<view>Ant</view>
					<view>Acorn</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {}
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {
					
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			

		}
	}
</script>
<style lang="scss" scoped>
	@supports (position: sticky) {
		.list-header {
			position: sticky;
			top: 0;
		}
	}
	.container {
		overflow: auto;
		margin: 40px auto;
		height: 500px;
	}
	.max-list {
		min-height: 1600px;
		background: #FFF;
	}
	.list-header {
		padding: 10px;
		background: #2D2D2D;
		// position: relative;
		font-weight: bold;
		color: #FFF;
	}
</style>
