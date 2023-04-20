<template>
	<view>
		<z-nav-bar backState="1000" color="#fff">
			<view slot="default" class="navbar-title"> 购物车 </view>
			<view class="navbar-right" slot="right" @click="manageShoppingCart">
				{{ isManage ? '取消' : '管理' }}
			</view>
		</z-nav-bar>
		<view class="main-container">
			<view class="empty-img flex-center" v-if="shoppingCartList.length === 0">
				<image src="https://www.51mihuo.com/static/images/gwc_empty.png" class="img"></image>
				<view class="btn" @click="goToCategory"> 去逛逛 </view>
			</view>
			<view class="address-container flex-center" @click="goToAddressPage" v-if="shoppingCartList.length !== 0">
				<view class="left flex-center">
					<image src="https://www.51mihuo.com/static/icon/address_large.png" class="img"></image>
				</view>
				<view class="center flex-center">
					<view v-if="postAddress" class="upper">
						{{ getPostAddress }}
					</view>
					<view class="lower">
						{{ postAddress ? postAddress.name : '选择地址' }}
						{{ postAddress ? postAddress.phoneNumber : '' }}
					</view>
				</view>
				<view class="right flex-center">
					<image src="https://www.51mihuo.com/static/icon/menu_back.png" class="icon"></image>
				</view>
			</view>
			<view class="card" v-for="(shop, index) in shoppingCartList" :key="index"
				v-if="shoppingCartList.length !== 0">
				<view class="title flex-center">
					<u-checkbox class="title-box" v-model="isSelectShop[index]" @change="selectAll($event, index, shop)"
						shape="circle" size="40" />
					<view class="flex-center" @click="goShop(shop)">
						<image class="company-logo" :src="$util.thumbnailImage(shop.companyLogo)" />
						{{ shop.companyName || '' }}
						<u-icon size="26" name="arrow-right"></u-icon>
					</view>
				</view>
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item, index2) in shop.cartItemList"
						@click="optionsActive($event, item.id)" :right-options="options" :key="item.id">
						<view class="cart-item flex-center" v-if="item.product"
							:style="{ opacity: !getProductStatus(item) ? '0.5' : '1' }">
							<view class="check-box flex-center">
								<u-checkbox v-model="isSelectEach[index][index2]" size="40"
									@change="selectEach($event, item, index, index2)" shape="circle"
									:disabled="!getProductStatus(item)"></u-checkbox>
							</view>
							<image class="img" height="182" imgMode="aspectFit"
								:src="$util.thumbnailImage(item.product.coverImg, true, 182)" @click="goToDetail(item)">
							</image>
							<view class="info flex-center">
								<view class="title" @click="goToDetail(item)">
									{{ item.product.name || '' }}
								</view>
								<view class="sku flex-center" @click="changeSku(item)">
									<view class="sku-str flex-center">
										<view class="text" v-if="!item.invalidSkuStock">
											{{ getSkuStr(item) }}
										</view>
										<view class="text" v-else> 商品已失效 </view>
										<uni-icons type="bottom" size="12" color="#909199"></uni-icons>
									</view>
								</view>
								<view class="footer-container flex-center" v-if="!item.invalidSkuStock">
									<view class="left"> ￥{{ item.skuStock.price }} </view>
									<view class="right" v-if="item.skuStock && item.quantity && item.skuStock.stock">
										<u-number-box input-height="36" :value="Number(item.quantity)"
											:disabled="!getProductStatus(item) && !isManage"
											@change="amountChange($event, item)" :min="1"
											:max="item.skuStock.stock - item.skuStock.lockStock">
										</u-number-box>
									</view>
									<view v-else class="no-stock nav-bar"> 缺货 </view>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
		<view class="bottom-buttons flex-center">
			<view class="radio-button flex-center">
				<u-checkbox class="check-box" v-model="isSelectAllShop" @change="selectAllShop($event)" shape="circle"
					size="40">
				</u-checkbox>
				全选
			</view>
			<view class="right flex-center"
				:style="{ alignItems: (selectedItem.length != 0 && !isManage) ? 'flex-start' : 'center' }">
				<view class="total">
					<view v-if="!isManage">
						<text class="total-text">合计</text>
						<text> ￥{{ total.toFixed(2) }} </text>
					</view>
					<view class="coupon-text" @click="getCoupon" v-if="selectedItem.length != 0 && !isManage">
						可用优惠券
					</view>
				</view>
				<view class="button" @click="goToSubmitOrderPage">
					{{ isManage ? '删除选中' : '立即结算' }}
				</view>
			</view>
		</view>
		<!-- sku选择弹窗 -->
		<mall-mh-sku-popup :isShowNumberBox="false" :key="skuIndex" ref="skuPopup" :amountType="0" v-model="isShowSku"
			border-radius="20" :mode="2" :localdata="goodsInfo" :selected-init="false" addCartText="确认更改"
			:defaultSelect="defaultSelect" @cart="confirmChangeSku">
		</mall-mh-sku-popup>
		<mihuo-popup ref="couponPopup" title="可用优惠券">
			<view class="coupons-container">
				<mall-mh-coupon v-for="(item, index) in couponList" :coupon="item" :key="index" readonly>
				</mall-mh-coupon>
			</view>
		</mihuo-popup>
	</view>
</template>

<script>
	import {
		debounce,
		getGoodsInfo,
		getCommoditySku
	} from '@/plugins/utils.js'

	export default {
		data() {
			return {
				oldSkuId: '', // 更改购物车规格时原skuId
				skuIndex: 0,
				defaultSelect: {}, // 默认选择的sku
				goodsInfo: {}, // 商品sku信息
				isShowSku: false, // 是否显示sku弹窗
				postAddress: {}, // 用户收货地址
				isSelectAllShop: false,
				isSelectShop: [],
				isSelectEach: [],
				selectedItem: [],
				itemList: [],
				shopNames: [],
				total: 0,
				totalByShop: [],
				shoppingCartList: [],
				skuList: [],
				isManage: false,
				options: [{
					text: '删除',
					color: '#fff',
					style: {
						backgroundColor: '#FE4B00'
					}
				}],
				allItemsStatus: [], // 所有商品的状态
				ids: [], // 所有商品的id
				productUnavailable: [], // 不可以下单的商品
				couponList: [] // 优惠券列表
			}
		},
		onLoad() {
			this.getUserAddress(true)
		},
		onShow() {
			this.total = 0
			this.getData()
		},
		computed: {
			// 用户收货地址
			getPostAddress() {
				if (this.postAddress.province) {
					return (
						this.postAddress.province +
						this.postAddress.city +
						this.postAddress.region +
						this.postAddress.poiName +
						this.postAddress.latAddress
					)
				} else {
					return ''
				}
			}
		},
		watch: {
			isSelectEach() {
				let allSelected = true
				this.isSelectEach.forEach((item) => {
					item.forEach((item2) => {
						if (!item2) {
							allSelected = item2
							return
						}
					})
				})
				this.isSelectAllShop = allSelected
			},
			isSelectShop() {
				let allSelected = true
				this.isSelectShop.forEach((item) => {
					if (!item) {
						allSelected = item
						return
					}
				})
				this.isSelectAllShop = allSelected
			}
		},
		methods: {
			// 获取可用优惠券
			getCoupon() {
				let ids = []
				this.selectedItem.forEach(item => {
					item.forEach(item2 => {
						ids.push(Number(item2.id));
					});
				});
				if (!ids.length) {
					this.$util.toast('请选择商品!')
					return
				}
				this.$httpApi.getCouponByProducts(ids.join()).then(res => {
					if (res.length) {
						this.couponList = res
						this.$refs.couponPopup.open()
					}
				})
			},
			// 确认更改sku
			confirmChangeSku(data) {
				this.isShowSku = false
				if (this.oldSkuId == data._id) return
				this.$httpApi
					.editCartItemSku({
						oldSkuId: this.oldSkuId,
						newSkuId: data._id
					})
					.then((res) => {
						if (res) this.getData()
					})
			},
			// 更改sku
			changeSku(cartItem) {
				if (!this.getProductStatus(cartItem)) {
					return
				}
				this.$httpApi.getSkuListByProductId(cartItem.productId).then((res) => {
					if (res) {
						const productItem = cartItem.product
						productItem['skuStocks'] = res
						this.oldSkuId = cartItem.productSkuId
						const skuData = getGoodsInfo(productItem)
						this.goodsInfo = skuData
						this.skuIndex = cartItem.id
						// 如果是首次打开，需要默认选中第一个
						const defaultSku = []
						const skuLabels = JSON.parse(cartItem.productAttr)
						const skuStrs = []
						skuLabels.forEach((each) => {
							skuStrs.push(each.value)
						})
						skuData['spec_list'].forEach((item, index) => {
							defaultSku.push(skuStrs[index])
						})
						this.defaultSelect = {
							sku: defaultSku,
							num: 1
						}
						this.currentProduct = cartItem.product
						this.isShowSku = true
					}
				})
			},
			// 获取收货地址
			getUserAddress(isOnLoad = false) {
				if (isOnLoad) {
					// 首次加载时直接获取默认地址，如果没有就取第一个
					this.$httpApi.getPostAddress().then((res) => {
						if (res && res.length !== 0) {
							const findItem = res.find((item) => item.defaultStatus == 0)
							if (findItem) this.postAddress = findItem
							else this.postAddress = res[0]
							uni.setStorageSync('roomAddress', this.selectedPostAddress)
							uni.setStorageSync("userPostAddress", this.selectedPostAddress)
							this.checkProductStatus()
						}
					})
				}
				// 从本地缓存中获取用户已选收货地址
				// 如果用户没有选择过, 再获取默认地址，如果没有设置过默认地址，再获取第一个地址
				let addressLocal = uni.getStorageSync('userPostAddress')
				const userData = uni.getStorageSync('userData')
				if (addressLocal && userData) {
					if (addressLocal.memberId != userData.sysUser.userId) {
						uni.removeStorageSync('userPostAddress')
						addressLocal = null
					}
				}
				if (addressLocal && addressLocal.id == this.postAddress.id) {
					this.checkProductStatus()
					return
				}
				this.postAddress = addressLocal
				if (!this.postAddress.id) {
					this.$httpApi.getPostAddress().then((res) => {
						if (res && res.length !== 0) {
							const findItem = res.find((item) => item.defaultStatus == 0)
							if (findItem) this.postAddress = findItem
							else this.postAddress = res[0]
							this.checkProductStatus()
						}
					})
				} else {
					this.checkProductStatus()
				}
			},
			goToAddressPage() {
				this.toPage(
					`/pages-common/addressList/addressList?isShow=${true}&lastPage=order`
				)
			},
			// 检查商品状态
			getProductStatus(productItem) {
				if (this.isManage) {
					return true
				}
				let flag = false
				for (const item of this.allItemsStatus) {
					if (item.productId == productItem.product.id) {
						// 检查上下架状态，发货地区限制
						flag =
							item.freightStatus == 1 &&
							item.publishStatus == 1 &&
							!productItem.invalidSkuStock
						break
					}
				}
				// 检查库存
				if (
					!productItem.skuStock ||
					!productItem.skuStock ||
					!productItem.skuStock.stock
				)
					flag = false
				// flag = true 可以购买 flag = false 不可以购买
				return flag
			},
			// 检查商品是否可以下单
			checkProductStatus() {
				if (!this.postAddress.adcode) return
				this.productUnavailable = []
				if (this.ids.length === 0) return
				this.$httpApi
					.checkPlaceOrder({
						areaCode: this.postAddress.adcode,
						productIds: this.ids
					})
					.then((res) => {
						if (!res) return
						// freightStatus 1=可以发货 2=不可以发货
						// publishStatus 1=上架 2=下架
						this.allItemsStatus = res
						this.shoppingCartList.forEach((shop) => {
							shop.cartItemList.forEach((ele) => {
								this.allItemsStatus.forEach((e) => {
									if (ele.product.id == e.productId) {
										if (!this.getProductStatus(ele)) {
											this.productUnavailable.push({
												...ele.product,
												freightStatus: e.freightStatus,
												publishStatus: e.publishStatus,
												disabled: e.freightStatus == 2 || e
													.publishStatus == 2
											})
										}
									}
								})
							})
						})
					})
			},
			// 进店逛逛
			goShop(data) {
				if (data.companyId != -1) {
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?companyId=${data.companyId}`
					)
				} else {
					const obj = {
						companyLogo: data.companyLogo,
						companyShortName: data.companyName,
						completeAddress: data.completeAddress,
						contactTel: data.companyTel
					}
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?cityOperatorId=${
            data.cityOperatorId
          }&data=${JSON.stringify(obj)}`
					)
				}
			},
			// 跳转到商品详情
			goToDetail(item) {
				if (!item.invalidSkuStock) {
					this.toPage(
						`/pages-mall/productDetail/productDetail?id=${item.product.id}&from=shoppingCart`
					)
				}
			},
			// 跳转到分类页面
			goToCategory() {
				this.toTab('/pages/category/category')
			},
			// 删除购物车
			optionsActive(e, dataIndex) {
				let ids = [dataIndex]
				this.$httpApi.deleteShoppingCartItem(ids).then((res) => {
					this.getData()
					this.calTotalAmount()
				})
			},
			manageShoppingCart() {
				this.isManage = !this.isManage
				this.getData(true) // 不用刷新地址
			},
			// 获取列表
			getData(flag = true) {
				// flag = true 获取数据后刷新地址
				this.$httpApi
					.getShoppingCart()
					.then((res) => {
						if (res) {
							this.ids = []
							this.allItemsStatus = []
							this.selectedItem = []
							this.totalByShop = []
							this.isSelectEach = []
							this.itemList = []
							this.shopNames = []
							this.isSelectShop = []
							this.shoppingCartList = res
							this.shoppingCartList.forEach((item) => {
								let arr = []
								this.isSelectShop.push(false)
								this.itemList.push(item.cartItemList)
								this.shopNames.push({
									name: item.companyName || '',
									companyLogo: item.companyLogo,
									isSelected: false
								})
								this.selectedItem.push([])
								this.totalByShop.push([])
								item.cartItemList.forEach((item2, index) => {
									this.ids.push(item2.productId)
									arr.push(false)
								})
								this.isSelectEach.push(arr)
							})
							if (flag) {
								this.getUserAddress(false)
							}
							this.calTotalAmount()
						}
					})
					.catch((e) => console.log(e))
			},
			// 选择所有店铺
			selectAllShop(e) {
				if (e.value) {
					this.itemList = []
					this.shoppingCartList.forEach((item, index) => {
						if (this.isManage) {
							this.itemList.push(item.cartItemList)
						} else {
							const newArr = item.cartItemList.filter((e) => {
								const findIndex = this.productUnavailable.findIndex(
									(ele) => ele.id == e.productId
								)
								if (findIndex == -1) {
									return e
								}
							})
							this.itemList[index] = newArr
						}
					})
					this.selectedItem = this.itemList
					for (let i = 0; i < this.shopNames.length; i++) {
						this.shopNames[i].isSelected = true
					}
				} else {
					for (let i = 0; i < this.selectedItem.length; i++) {
						this.selectedItem[i] = []
					}
					for (let i = 0; i < this.shopNames.length; i++) {
						this.shopNames[i].isSelected = false
					}
				}
				for (let i = 0; i < this.isSelectShop.length; i++) {
					this.isSelectShop[i] = !this.isSelectAllShop
					for (let j = 0; j < this.isSelectEach[i].length; j++)
						this.isSelectEach[i][j] = !this.isSelectAllShop
				}
				this.isSelectAllShop = !this.isSelectAllShop
				this.calTotalAmount()
			},
			// 修改购物车商品数量
			amountChange(e, item) {
				item.quantity = e.value
				debounce(() => {
					this.$httpApi
						.editCartItemQuantity({
							id: item.id,
							quantity: item.quantity
						})
						.then((res) => {
							this.calTotalAmount()
						})
				}, 500)
			},
			// 选择店铺
			selectAll(e, index, shop) {
				if (e.value) {
					if (this.isManage) {
						this.selectedItem[index] = shop.cartItemList
					} else {
						const newArr = shop.cartItemList.filter((e) => {
							const findIndex = this.productUnavailable.findIndex(
								(ele) => ele.id == e.productId
							)
							if (findIndex == -1) {
								return e
							}
						})
						this.selectedItem[index] = newArr
					}
					this.shopNames[index].isSelected = true
				} else {
					this.selectedItem[index] = []
					this.shopNames[index].isSelected = false
				}
				for (let i = 0; i < this.isSelectEach[index].length; i++) {
					this.isSelectEach[index][i] = !this.isSelectShop[index]
				}
				this.calTotalAmount()
			},
			// 选择一项商品
			selectEach(e, item, index, index2) {
				this.isSelectEach[index][index2] = e.value
				if (e.value) {
					this.selectedItem[index].push(item)
					this.shopNames[index].isSelected = true
				} else {
					this.isSelectShop[index] = false
					this.isSelectAllShop = false
					this.shopNames[index].isSelected = false
					this.selectedItem[index] = this.selectedItem[index].filter((el) => {
						return el.id !== item.id
					})
				}
				if (this.selectedItem[index].length === this.isSelectEach[index].length) {
					this.isSelectShop[index] = e.value
				}
				this.calTotalAmount()
			},
			// 计算全部金额
			calTotalAmount() {
				let total = 0
				this.selectedItem.forEach((item, index) => {
					let eachShopTotal = 0
					item.forEach((item2) => {
						eachShopTotal += item2.skuStock.price * item2.quantity
					})
					this.totalByShop[index] = eachShopTotal
					total = this.$math.floatAdd(total, eachShopTotal)
				})
				this.total = total
			},
			// sku信息
			getSkuStr(item) {
				let sku = JSON.parse(item.productAttr)
				let skuStr = ''
				sku.forEach((each, index) => {
					skuStr += `${each.value}${index == sku.length - 1 ? '' : '/'}`
				})
				return skuStr
			},
			// 跳转到提交订单页/管理购物车
			goToSubmitOrderPage() {
				let ids = []
				const products = []
				this.selectedItem.forEach((item) => {
					item.forEach((item2) => {
						products.push({
							count: item2.quantity,
							skuId: item2.skuStock && item2.skuStock.id
						})
						ids.push(Number(item2.id))
					})
				})
				if (this.isManage) {
					// 管理购物车
					if (ids.length === 0) {
						this.$util.toast('请选择要删除的商品!')
					} else {
						uni.showModal({
							title: '确认操作',
							content: '确认删除所选购物车？',
							success: (res) => {
								if (res.confirm) {
									this.$httpApi.deleteShoppingCartItem(ids).then((res) => {
										this.getData()
										this.calTotalAmount()
									})
								}
							}
						})
					}
				} else {
					// 跳转到提交订单页
					if (products.length === 0) {
						this.$util.toast('请选择商品!')
						return
					}
					if (this.total === 0) {
						this.$util.toast('请重新确认数量或金额!')
						return
					}
					if (uni.getStorageSync('userData')) {
						this.$httpApi
							.generateMallOrder({
								shoppingCart: true,
								enableDiffAmount: true,
								memberReceiveAddressId: this.postAddress.id,
								products,
								sourceType: 1 // app订单
							})
							.then((res) => {
								if (res) {
									uni.setStorageSync('orderConfirmInfo', res)
									this.toPage('/pages-mall/submitOrder/submitOrder')
								}
							})
					} else {
						this.$util.goToLoginPage()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar-title {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 36rpx;
		line-height: 50rpx;
		text-align: center;
		color: #333333;
	}

	.navbar-right {
		margin-right: 40rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #909299;
	}

	.main-container {
		height: calc(100vh - var(--status-bar-height) - 88rpx - 144rpx);
		margin-bottom: 20rpx;
		overflow-y: scroll;

		.empty-img {
			width: 690rpx;
			height: 100%;
			margin: 10rpx 30rpx;
			background-color: #fff;
			border-radius: 30rpx 30rpx 10rpx 10rpx;
			justify-content: center;
			flex-direction: column;

			.img {
				width: 138rpx;
				height: 138rpx;
			}

			.btn {
				width: 268rpx;
				height: 88rpx;
				margin-top: 76rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 88rpx;
				text-align: center;
				color: #ffffff;
				text-align: center;
				background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
				border-radius: 12rpx;
			}
		}

		.address-container {
			width: 100%;
			height: 148rpx;
			background-color: #fff;
			justify-content: flex-start;
			margin-top: 16rpx;
			padding: 0 30rpx;

			.left {
				width: 44rpx;
				height: 148rpx;
				justify-content: center;

				.img {
					width: 44rpx;
					height: 44rpx;
				}
			}

			.center {
				width: calc(100% - 84rpx);
				height: 148rpx;
				flex-direction: column;
				justify-content: center;
				margin-left: 20rpx;

				.upper {
					width: 100%;
					height: 50rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 36rpx;
					line-height: 50rpx;
					color: #303133;
					@include toe();
				}

				.lower {
					width: 100%;
					height: 40rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #999999;
					@include toe();
				}
			}

			.right {
				width: 20rpx;
				height: 148rpx;
				justify-content: center;

				.icon {
					width: 11rpx;
					height: 20rpx;
				}
			}
		}

		.card {
			width: 690rpx;
			height: max-content;
			margin: 10rpx 30rpx 0rpx 30rpx;
			padding: 20rpx 10rpx;
			background-color: #fff;
			border-radius: 12rpx;

			.company-logo {
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;
				border-radius: 50%;
			}

			.title {
				justify-content: flex-start;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 42rpx;
				color: #303133;

				.title-box {
					/* #ifndef MP */
					margin-left: 14rpx;
					/* #endif */
				}
			}

			.cart-item {
				margin-top: 30rpx;
				border-radius: 12rpx;

				.check-box {
					width: 60rpx;
					height: 60rpx;
					padding-left: 14rpx;
					justify-content: center;
				}

				.img {
					width: 182rpx;
					height: 182rpx;
					border-radius: 12rpx;
					margin-left: 20rpx;
				}

				.info {
					width: 330rpx;
					height: 180rpx;
					flex-direction: column;
					margin-left: 20rpx;

					.title {
						width: 330rpx;
						height: 72rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 26rpx;
						line-height: 36rpx;
						color: #303133;
						overflow: hidden;
					}

					.sku {
						width: 100%;
						height: 36rpx;
						margin-top: 10rpx;
						justify-content: flex-start;

						.sku-str {
							max-width: 400rpx;
							width: max-content;
							height: 36rpx;
							border-radius: 50rpx;
							padding: 0 20rpx;
							background: #fff7ed;

							.text {
								max-width: 350rpx;
								width: max-content;
								margin-right: 10rpx;
								font-family: PingFang SC;
								font-style: normal;
								font-weight: bold;
								font-size: 22rpx;
								line-height: 36rpx;
								color: #909199;
								@include toe();
							}

							.icon {
								margin-left: 10rpx;
								min-width: 16rpx;
								width: 16rpx;
								height: 8rpx;
							}
						}
					}

					.footer-container {
						width: 100%;
						height: 36rpx;
						flex-direction: row;
						justify-content: space-between;
						margin-top: 10rpx;

						.left {
							font-family: PingFang SC;
							font-style: normal;
							font-weight: bold;
							font-size: 24rpx;
							line-height: 36rpx;
							color: #ff5d35;
							margin-top: 10rpx;
						}

						.right {
							height: 36rpx;
						}
					}
				}
			}
		}
	}

	.bottom-buttons {
		width: 100vw;
		height: 144rpx;
		background-color: #fff;
		justify-content: space-between;
		padding: 0 30rpx;
		position: sticky;
		bottom: 0rpx;

		.radio-button {
			width: max-content;
			height: 40rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			text-align: center;
			color: #909199;

			.check-box {
				width: 44rpx;
				height: 44rpx;
				margin-right: 10rpx;
			}
		}

		.right {
			width: 80%;
			height: 88rpx;

			.total {
				flex: 1;
				height: 44rpx;
				margin-right: 10rpx;
				text-align: right;

				.total-text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 44rpx;
					color: #909199;
				}

				text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 38rpx;
					line-height: 44rpx;
					color: #ff5d35;
				}

				.coupon-text {
					height: 44rpx;
					text-align: right;
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #fe6e32;
					line-height: 44rpx;
				}
			}

			.button {
				width: 230rpx;
				height: 88rpx;
				background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
				border-radius: 60rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 88rpx;
				text-align: center;
				color: #ffffff;
			}
		}
	}

	.coupons-container {
		width: 100vw;
		padding: 30rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
