<template>
	<view class="address">
		<view class="tips">最多只能设置三个常驻地址</view>
		<view class="address-list" v-for="(item,index) in addressList" :key="index">
			<image v-if="item.selectActive" class="item-select-images" src="@/static/images/successful_1.png" mode="">
			</image>
			<view @click="selectButton(item,index)" class="address-item">
				<view class="address-list_center">
					<view class="center-top">
						<text>{{(item.address?item.address+'街道':'')}}{{(item.villageName || '')}}</text>
						<!-- <image v-if="item.isHome == 0" :src="require('@/static/icon/my_home.png')" /> -->
					</view>
					<view class="center-bottom">
						<text>{{item.provinceName || ''}}</text>
						<text>{{item.cityName == item.provinceName?'':item.cityName }}</text>
						<text>{{item.districtName || ''}}</text>
					</view>
				</view>
			</view>
			<image @click="()=>del(item.id)" class="delete-icon" src="/static/images/delete_icon/delete-service.png">
			</image>
		</view>
		<mh-empty v-if="addressList.length === 0 " title="暂无地址信息～～" />

		<bottom-button v-if="addressList.length<3" :title="getButtonTitle" @click="address('add',resgion)"
			bgColor="#FFFFFF" :styleObj="{
            background:'#FFFFFF',
            border:'1.5px solid #141414',
        }" color="#000000">
			<template slot="icon-left">
				<u-icon name="plus"></u-icon>
			</template>
		</bottom-button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				curClick: null,
				buttonShow: false,
				curUser: uni.getStorageSync('userData').sysUser,
				addressList: [],
				options: '',
				buttonTitle: '新增地址',
				selectAddresList: [],
				resgion: {
					province: '',
					city: '',
					region: '',
				}
			}
		},
		computed: {
			getButtonTitle() {
				if (this.options && this.options.typeName == '觅活小店' || this.options.typeName == '添加服务') {
					this.buttonShow = true
					if (this.addressList.length > 0 && this.addressList.length < 3) {
						this.buttonTitle = '确定'
					}else{
						this.buttonTitle = '新增地址'
					}
				}else{
					this.buttonTitle = '新增地址'
				}
				return this.buttonTitle
			},
		},
		onLoad(options) {
			this.options = options
			// this.getMyRoom()
		},
		onShow() {
			this.getMyRoom()
			// #ifdef H5
			// window.sessionStorage.setItem('roomAddress', JSON.stringify(this.addressList[0]));
			// #endif

			// #ifndef H5
			// uni.setStorageSync('roomAddress', JSON.stringify(this.addressList[0]))
			// #endif
		},
		onBackPress() {
			uni.$emit('isSku', true)
		},
		methods: {
			
			// 获取地址
			getMyRoom() {
				this.$http.get('admin/user/address/list').then(res => {
					this.addressList = res;
					if (this.addressList.length == 0) {
						uni.removeStorageSync('roomAddress')
					}
					if (uni.getStorageSync('roomAddress')) {
						let data = uni.getStorageSync('roomAddress')
						this.addressList.some((v, i) => {
							if (v.id == data.id) {
								this.curClick = i;
								return
							}
						})
					}
					this.addressList.forEach(el => {
						el['selectActive'] = false
					})

					this.setAddress()
				})
			},
			setAddress() {
				if (this.options.addressIds) {
					let tempAddressIds = this.options.addressIds.split(',')
					this.selectAddresList = []
					this.addressList.forEach(el => {
						el.id = el.id.toString()
						if (tempAddressIds.includes(el.id)) {
							el['selectActive'] = true
							this.selectAddresList.push(el)
						}
					})
				}
			},
			address(type, data) {
				if (this.buttonTitle == '确定') {
					this.getSubmit()
				} else {
					this.toPage('/pages/permanentResidence/addPermanent?type=' + type + '&data=' + JSON.stringify(data))
				}
			},
			selectButton(data, index) {
				if (this.options.type) {
					data.selectActive = !data.selectActive
					this.selectAddresList.push(data)
				}

				this.curClick = index;
				// 直辖市做特殊处理
				if (data.city == data.province) {
					data.city = ''
				}
				this.selectAddresList = this.selectAddresList.filter(item => item.selectActive)
				this.$forceUpdate()
			},
			del(id) {
				uni.showModal({
					title: "确认操作",
					content: "确认删除该地址？",
					cancelText: "取消",
					confirmText: "确认",
					confirmColor: "#FE6E32",
					success: (res) => {
						if (res.confirm) {
							this.$http.post(`admin/user/address/delete/${id}`)
								.then(res => {
									if (res) {
										this.$util.toast("删除成功");
										this.getMyRoom();
									}
								})
						}
					},
				});
			},
			setOption() {
				if (this.option.type == '多选') {

				} else if (this.option.type == '单选') {

				}
				uni.$emit('selectAddress', {})
				uni.navigateBack({
					delta: 1
				})
			},
			getSubmit() {
				if (this.buttonShow) {
					if (!uni.getStorageSync('cityOperatorId')) {
						this.$util.toast("请在首页选择定位~");
						return
					}

					// if (this.selectAddresList.length == 0) {
					// 	this.$util.toast("请选择地址~");
					// 	return
					// }

					if (this.options.typeName == '添加服务') {
						uni.$emit('selectAddress', this.selectAddresList)
						uni.navigateBack({
							delta: 1
						})
						return
					}
					let resultList = []
					this.selectAddresList.forEach(item => {
						resultList.push({
							address: item.provinceName + '-' + item.cityName + '-' +
								item.districtName + '-' + item.address,
							addressIds: item.id
						})
					})
					resultList = this.unique(resultList)
					let tempAddress = resultList.map(item => item.address)
					let tempAddressIds = resultList.map(item => item.addressIds)
					let resultAddress = tempAddress.map(item => item.replace('-null', ''))
					let resultAddressIds = tempAddressIds.join(',')
					let resultAddressForm = resultAddress.join('，')


					this.$httpApi.updateReceiver({
						cityOperatorId: uni.getStorageSync('cityOperatorId'),
						address: resultAddressForm,
						id: this.options.shopId,
						addressIds: resultAddressIds,
					}).then(res => {
						if (res) {
							this.$util.toast("操作成功~");
							setTimeout(() => {
								this.goBack()
							}, 1000)
						}
					})
				}
			},
			unique(arr) {
				const res = new Map()
				return arr.filter((item) => !res.has(item.addressIds) && res.set(item.addressIds, 1))
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #F5F5F5;
	}
</style>
<style scoped lang="scss">
	.tips {
		height: 100rpx;
		font-size: 25rpx;
		font-weight: normal;
		line-height: 100rpx;
		letter-spacing: 0rpx;
		color: $mainFontColor;
		padding-left: 48rpx;
	}

	.address-list {
		display: flex;
		align-items: center;
		padding: 30rpx 50rpx;
		background: #FFFFFF;
		border-bottom: 6rpx solid #FAFAFA;
		justify-content: space-between;

		.item-select-images {
			width: 32rpx;
			height: 32rpx;
			margin-right: 30rpx;
		}

		.delete-icon {
			width: 38rpx;
			height: 38rpx;
		}

		.icon {
			width: 70rpx;
			flex-shrink: 0;
			justify-content: flex-end;
		}

		.address-item {
			flex: 1;
			display: flex;
			align-items: center;
		}

		&:last-child {
			margin-bottom: 0;
		}

		.address-list_left {
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			border: 2px solid #BDBDBD;
			margin-right: 20rpx;
		}

		.buttonClick {
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			border: 2px solid #FF5F00;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				width: 14rpx;
				height: 14rpx;
				background: #FF5F00;
				border-radius: 50%;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.address-list_center {
			flex: 1;

			.center-top {
				font-size: $middleFontSize;
				font-weight: bold;
				display: flex;

				image {
					height: 28rpx;
					width: 56rpx;
					margin-left: 10rpx;
					image-rendering: optimize-contrast;
					image-rendering: -webkit-optimize-contrast;
					flex-shrink: 0;
				}
			}

			.center-bottom {
				color: $fontColor99;

				text {
					font-size: 28rpx;
					padding-right: 10rpx;

					&:last-child {
						padding-right: 0;
					}
				}
			}
		}
	}
</style>
