<template>
	<view>
		<z-nav-bar backState="1000"></z-nav-bar>
		<view class="header-container">
			<view class="title">
				我的家
			</view>
			<view class="sub-title">
				添加我的家，即刻开启装修之旅
			</view>
		</view>
		<view class="form-container">
			<view class="form-item flex-center">
				<view class="left">
					省、市、区
				</view>
				<view class="right flex-center" @click="selectAddress">
					{{ poiName ? form.province + form.city + form.region : '请选择省、市、区' }}
					<uni-icons type="right" size="12" style="margin-left: 10rpx;"></uni-icons>
				</view>
			</view>
			<view class="form-item flex-center" @click="selectAddress">
				<view class="left">
					详细地址
				</view>
				<view class="right flex-center">
					{{ form.latAddress ? form.latAddress : '请选择详细地址' }}
					<uni-icons type="right" size="12" style="margin-left: 10rpx;"></uni-icons>
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left">
					楼栋房号
				</view>
				<view class="right flex-center">
					<uni-easyinput :clearable="false" text v-model="form.detailAddress" placeholder="请输入楼栋房号"
						fontColor="#909090" style="text-align: right;" :textRight="true"
						:placeholderStyle="placeholderStyle" :inputBorder="false" />
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left">
					面积
				</view>
				<view class="right flex-center">
					<uni-easyinput :clearable="false" type="number" v-model="form.area" placeholder="请输入面积"
						fontColor="#909090" style="text-align: right;" :textRight="true"
						:placeholderStyle="placeholderStyle" :inputBorder="false" />
					<text class="unit">&#x33A1;</text>
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left" style="width: 20%;">
					户型
				</view>
				<view class="right flex-center" @click="selectModel" style="width: 80%;">
					{{ form.model || '室 厅 厨 卫' }}
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left">
					有无电梯
				</view>
				<view class="right flex-center">
					<u-switch v-model="hasElevator" size="36" active-color="#ff5d35"></u-switch>
				</view>
			</view>
			<view class="form-item flex-center" v-if="!hasElevator">
				<view class="left">
					楼层
				</view>
				<view class="right flex-center">
					<uni-easyinput :clearable="false" type="number" v-model="form.floor" placeholder="请输入楼层"
						fontColor="#909090" style="text-align: right;" :textRight="true"
						:placeholderStyle="placeholderStyle" :inputBorder="false" />
				</view>
			</view>
		</view>
		<view :style="{ opacity: disabled ? '0.3' : '1' }">
			<bottom-button :styleObj="{backgroundColor: '#000000'}"
				title="保 存" color="#FFFFFF" @click="saveForm">
			</bottom-button>
		</view>
		<u-select v-model="isShowPicker" mode="mutil-column" :list="modelList" @confirm="confirm"></u-select>
		<!-- #ifdef MP-WEIXIN -->
		<myHome-mh-map-popup v-model="mapPopup" :city="selectedAddressCity" @callback="mapAddress" :poiName="poiName">
		</myHome-mh-map-popup>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userAddressStr: uni.getStorageSync('oldLocation').address || '',
				placeholderStyle: 'font-size: 28rpx; font-family: Noto Sans S Chinese;font-weight: 400; color: #909090; line-height: 34rpx;',
				adcode: '',
				form: {
					longitude: 0, // 经度
					latitude: 0, // 纬度
					province: '', // 省份
					city: '', // 城市
					region: '', // 区
					latAddress: '', // 详细地址
					detailAddress: '', // 楼栋房号
					area: '', // 面积
					model: '', // 户型
					floor: '', // 楼层
				},
				disabled: true,
				poiName: '', // 位置信息
				mapPopup: false,
				isShowPicker: false, // 是否显示选择户型菜单
				hasElevator: false, // 是否有电梯
				modelList: [
					[{
							value: 1,
							label: '一室'
						},
						{
							value: 2,
							label: '二室'
						},
						{
							value: 3,
							label: '三室'
						},
						{
							value: 4,
							label: '四室'
						},
						{
							value: 5,
							label: '五室'
						},
						{
							value: -1,
							label: '五室以上'
						}
					],
					[{
							value: 1,
							label: '一厅'
						},
						{
							value: 2,
							label: '二厅'
						},
						{
							value: 3,
							label: '三厅'
						},
						{
							value: -1,
							label: '三厅以上'
						}
					],
					[{
							value: 1,
							label: '一厨'
						},
						{
							value: 2,
							label: '二厨'
						},
						{
							value: -1,
							label: '二厨以上'
						}
					],
					[{
							value: 1,
							label: '一卫'
						},

						{
							value: 2,
							label: '二卫'
						},
						{
							value: 3,
							label: '三卫'
						},
						{
							value: -1,
							label: '三卫以上'
						}
					]
				],
				userAddressStr: uni.getStorageSync('oldLocation') ?
					uni.getStorageSync('oldLocation').address : ''
			}
		},
		onShow() {
			uni.$once('operatorSelected', (data) => {
				if (data) {
					this.userAddressStr = data.address || ''
				}
			})
			// #ifdef APP-PLUS || H5
			uni.$once('updateData', (data) => {
				if (JSON.stringify(data) !== "{}") {
					this.mapAddress(data)
				}
			})
			// #endif
		},
		computed: {
			// 运营商位置处理
			selectedAddressCity() {
				if (!this.userAddressStr) {
					return '请选择'
				}
				let cities = ['北京市', '天津市', '上海市', '重庆市']
				let userProvince =
					(this.userAddressStr && this.userAddressStr.split(' ')[0]) ||
					this.userAddressStr // 省份名称
				let userCity =
					(this.userAddressStr && this.userAddressStr.split(' ')[1]) ||
					this.userAddressStr // 城市名称
				if (cities.indexOf(userProvince) !== -1) {
					// 如果是直辖市, 则使用省份名称
					return userProvince
				}
				return userCity
			}
		},
		watch: {
			form: {
				handler(newVal) {
					for (const key in newVal) {
						if (this.hasElevator) {
							if (key != 'floor') {
								if (!newVal[key]) {
									this.disabled = true
									return
								} else {
									this.disabled = false
								}
							}
						} else {
							if (!newVal[key]) {
								this.disabled = true
								return
							} else {
								this.disabled = false
							}
						}
					}
				},
				deep: true
			},
			hasElevator: {
				handler(newVal) {
					for (const key in this.form) {
						if (this.hasElevator) {
							if (key != 'floor') {
								if (!this.form[key]) {
									this.disabled = true
									return
								} else {
									this.disabled = false
								}
							}
						} else {
							if (!this.form[key]) {
								this.disabled = true
								return
							} else {
								this.disabled = false
							}
						}
					}
				},
				deep: true
			},
		},
		methods: {
			// 保存表单并提交
			saveForm() {
				if (this.disabled) return
				const user = uni.getStorageSync('userData').sysUser
				const form = {
					...this.form,
					poiName: this.poiName,
					isElevator: this.hasElevator ? 1 : 0, // 是否有电梯 0=无 1=有
					defaultStatus: 1, // 是否为默认地址 0=是 1=否
					name: user.realName,
					phoneNumber: user.phone,
					adcode: this.adcode,
					detailAddress: this.form.detailAddress
				}
				this.$httpApi.addPostAddress(form).then(res => {
					if (res) {
						this.$util.toast('添加成功~')
						uni.$emit('updateMyhome')
						setTimeout(() => {
							this.goBack()
						}, 500)
					}
				})
			},
			// 处理接受到的地址
			mapAddress(data) {
				if (data) {
					this.poiName = data.name
					this.form.province = data.pname
					this.form.city = data.cityname
					this.form.region = data.adname
					this.form.latAddress = data.address
					this.form.latitude = data.location.lat
					this.form.longitude = data.location.lng
					this.adcode = data.adcode
				}
			},
			// #ifndef MP
			areaComplete(e) {
				if (e) {
					console.log(e);
				}
			},
			// #endif
			// 选择省市区
			selectAddress() {
				// #ifdef APP-PLUS || H5
				uni.navigateTo({
					url: '/pages-common/mapSearch/mapSearch?search=' + this.poiName + '&city=' + this.form.city,
					animationType: 'slide-in-bottom',
				})
				// #endif
				// #ifdef MP
				this.mapPopup = true;
				// #endif
			},
			selectModel() {
				this.isShowPicker = true
			},
			// 确认选择户型
			confirm(e) {
				this.form.model = ''
				e.forEach(item => {
					this.form.model += ' ' + item.label
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.header-container {
		padding: 60rpx 60rpx 0rpx;

		.title {
			font-size: 48rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
			line-height: 48rpx;
		}

		.sub-title {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #000000;
			line-height: 34rpx;
			margin-top: 26rpx;
		}
	}

	.form-container {
		width: 100vw;
		padding: 0 30rpx;
		margin-top: 30rpx;

		.form-item {
			width: 690rpx;
			height: 100rpx;
			background-color: #F7F7F7;
			border-radius: 20rpx;
			padding: 0 30rpx;
			margin-bottom: 20rpx;

			.left {
				width: 200rpx;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #000000;
				line-height: 34rpx;
				font-weight: bold;
			}

			.right {
				flex: 1;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #909090;
				line-height: 34rpx;
				justify-content: flex-end;
				
				.unit {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #000000;
					line-height: 34rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
