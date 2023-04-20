<template>
	<view class="main-container">
		<view class="mask" @click="hidePage"></view>
		<view class="package-popup">
			<mall-mh-set-meal-poup typeName="套餐选择" :buttonType="popupType" @submit="getMealList" :detailId="commodityId"
				:treeList="treeList">
			</mall-mh-set-meal-poup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupType: 1,
				treeList: [],
				commodityId: ''
			}
		},
		onLoad() {
			const {
				popupType,
				treeList,
				commodityId
			} = uni.getStorageSync('selectPackageInfo')
			this.popupType = popupType
			this.treeList = treeList
			this.commodityId = commodityId
		},
		methods: {
			getMealList(data) {
				console.log(data)
				uni.$emit('selectPackageCallback', data)
				uni.navigateBack()
			},
			hidePage() {
				uni.$off('selectPackageCallback')
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main-container {
		height: 100vh;
		
		.mask {
			width: 100vw;
			height: 40vh;
			position: fixed;
			top: 0;
		}
		
		.package-popup {
			width: 100vw;
			height: 60vh;
			position: fixed;
			bottom: 0;
			background-color: #FFFFFF;
			border-radius: 20rpx 20rpx 0 0;
		}
	}
</style>

<style lang="scss">
	page {
		/* #ifdef APP-PLUS || H5 */
		background: rgba(0, 0, 0, 0.3);
		/* #endif */
	}
</style>
