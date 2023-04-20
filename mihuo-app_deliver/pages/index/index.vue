<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title" @click="areaChoose">{{title}}</text>
		</view>
		<view class="box" v-if="e">
			{{e}}
		</view>
		<area-select ref='areaChoose' @areaComplete='areaComplete'></area-select>
	</view>
</template>

<script>
	import areaSelect from '@/components/area-choose/area-choose.vue'
	export default {
		components: {
			areaSelect
		},
		data() {
			return {
				title: 'Hello,click',
				e:''
			}
		},
		onLoad() {

		},
		methods: {
			areaComplete(e) {
				console.log(e);
				this.e=e
			},
			areaChoose() {
				this.$refs.areaChoose.show()
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
