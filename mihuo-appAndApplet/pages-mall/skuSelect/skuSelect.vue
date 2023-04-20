<template>
	<view>
		<mall-mh-sku-popup ref="skuPopup" :groupSku="groupSku" :isGroupProduct="isGroupBuy" :amountType="0" v-model="isShowSku" border-radius="20" :mode="popupType"
			:localdata="goodsInfo" :selected-init="false" :defaultSelect="defaultSelect" @getSkuLabel="getSkuLabel"
			@cart="addToShoppingCart" @buy="submitOrder" @close="onClose">
		</mall-mh-sku-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupType: 1, // 选择规格弹窗的按钮模式
				goodsInfo: {},
				defaultSelect: {}, // 默认选中的sku
				groupSku: [],
				isGroupBuy: false,
				isShowSku: false,
			}
		},
		onLoad() {
			const {
				popupType,
				goodsInfo,
				defaultSelect,
				product,
				groupSku,
				isGroupBuy
			} = uni.getStorageSync('selectSkuInfo')
			this.popupType = popupType
			this.goodsInfo = goodsInfo
			this.defaultSelect = defaultSelect
			this.groupSku = groupSku
			this.isGroupBuy = isGroupBuy
			this.isShowSku = true
			uni.$on('setIsGroupBuy', data => {
				this.isGroupBuy = data
			})
		},
		onUnload() {
			uni.$off('setIsGroupBuy')
		},
		methods: {
			onClose(){
				uni.navigateBack({
					animationType: 'fade-out'
				})
			},
			hidePage(){
				this.isShowSku = false
				uni.removeStorageSync('selectSkuInfo')
				uni.$off('selectSkuCallback')
			},
			getSkuLabel(e, buy_num) {
				const obj = {
					type: 'getSkuLabel',
					data: {
						e,
						buy_num
					}
				}
				uni.$emit('selectSkuCallback', obj)
			},
			addToShoppingCart(selectedData) {
				const obj = {
					type: 'addToShoppingCart',
					data: {
						selectedData
					}
				}
				uni.$emit('selectSkuCallback', obj)
				setTimeout(() => {
					this.hidePage()
					if(!uni.getStorageSync('userInfo') || !uni.getStorageSync('userData')){
						uni.navigateBack()
					}
				}, 10)
			},
			submitOrder(selectedData) {
				const obj = {
					type: 'submitOrder',
					data: {
						selectedData
					}
				}
				uni.$emit('selectSkuCallback', obj)
				setTimeout(() => {
					this.hidePage()
					if(!uni.getStorageSync('userInfo') || !uni.getStorageSync('userData')){
						uni.navigateBack()
					}
				}, 10)
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
	page {
		/* #ifdef APP-PLUS || H5 */
		background: rgba(0, 0, 0, 0.3);
		/* #endif */
	}
</style>
