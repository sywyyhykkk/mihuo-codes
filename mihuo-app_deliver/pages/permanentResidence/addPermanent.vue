<template>
	<view>
		<view class="driver"></view>
		<view class="form-col">
			<u-form :model="formData" ref="uForm" labelPosition="top" :labelStyle="{
					fontSize: '28rpx',
					fontWeight: 'bold',
					color:'#141414',
					fontFamily:'PingFang-SC-Bold'
				}" :borderBottom="false">
				<u-form-item label="所在地区" prop="regionAddress" required :borderBottom="false">
					<view class="select-input" @click="selectArea">
						<view class="input">
							<u-input @click="selectArea" v-model="formData.regionAddress" disabled placeholder="请选择"
								:custom-style="{
								padding:'6px 9px',
								color:'#141414',
								flex:1
							}"></u-input>
						</view>
						<u-icon class="map-fill" name="map-fill" color="#808080" :size="22"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="街道地址" prop="address" :borderBottom="false">
					<u-input class="input-border" v-model="formData.address" :custom-style="{
						padding:'6px 9px',
						color:'#141414',
						borderRadius: '12rpx',
					}"></u-input>
				</u-form-item>
				<u-form-item label="所在小区" prop="villageName" required :borderBottom="false">
					<u-input class="input-border"  v-model="formData.villageName" :custom-style="{padding:'6px 9px',color:'#141414',}" />
				</u-form-item>
			</u-form>
		</view>
		<button class="savebuttom" @click="save">保存</button>
		<!-- #ifdef MP -->
		<findMaster-mh-map-popup v-model="mapPopup" :city="selectedAddressCity" @callback="mapAddress"
			:poiName="formData.poiName"></findMaster-mh-map-popup>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					city: '',
					poiName: '',
					// isHome: 0, //新增地址默认为我的家；
					name: uni.getStorageSync('userData').sysUser.realName,
					phoneNumber: uni.getStorageSync('userData').sysUser.phone
				},
				curDo: {}, //当前执行的动作,
				curAddress: uni.getStorageSync('roomAddress'),
				curUser: uni.getStorageSync('userData').sysUser,
				mapPopup: false,
				userAddressStr: uni.getStorageSync('oldLocation') ?
					uni.getStorageSync('oldLocation').address : ''
			}
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
		onLoad(options) {
			this.curDo = options;
			if (options.type == 'edit') {
				this.formData = JSON.parse(options.data);
				let data = this.formData.province + ',' + this.formData.city + ',' + this.formData.region
				this.$set(this.formData, 'regionAddress', data.replace(/,/g, " "));
			}
		},
		onShow() {
			if (this.curDo.type == 'add') {
				uni.setNavigationBarTitle({
					title: "新增常驻"
				});
			} else {
				uni.setNavigationBarTitle({
					title: "编辑常住地"
				});
			};
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
		methods: {
			mapAddress(data) {
				console.log(data)
				if (data) {
					this.formData.adcode = data.adcode ? (data.adcode).substr(0, 4) : ''
					this.$set(this.formData, 'provinceName', data.pname);
					this.$set(this.formData, 'cityName', data.cityname);
					this.$set(this.formData, 'districtName', data.adname);
					this.$set(this.formData, 'address', data.businessarea);
					this.$set(this.formData, 'poiName', data.name);
					this.$set(this.formData, 'longitude', data.location.lng);
					this.$set(this.formData, 'latitude', data.location.lat);
					this.$set(this.formData, 'regionAddress', `${data.pname} ${data.cityname} ${data.adname}`);
				}
			},
			save() {
				if (!this.formData.regionAddress) {
					this.$util.toast("请选择所在地区")
					return false
				}
				if (!this.formData.villageName) {
					this.$util.toast("请填写所在小区")
					return false
				}
				uni.showLoading({
					title: '保存中',
					mask: true
				});
				let data = {
					"address": "",
					"cityName": "",
					"districtName": "",
					"id": 0,
					"latitude": 0,
					"longitude": 0,
					"provinceName": "",
					"villageName": ""
				}
				this.$http.post('admin/user/address/save', this.formData)
					.then(res => {
						if (res) {
							this.$util.toast("保存成功")
							this.goBack()
						}
					}).finally(() => {
						uni.hideLoading();
					})
			},
			// 所在地区选择
			selectArea() {
				// #ifdef APP || H5
				uni.navigateTo({
					url: '/pages/mapSearch/mapSearch?search=' + this.formData.poiName + '&city=' + this.formData
						.city,
					animationType: 'slide-in-bottom',
				})
				// #endif
				// #ifdef MP
				this.mapPopup = true;
				// #endif
			},
			// 地址
			// #ifndef MP
			areaComplete(e) {
				if (e) {
					let data = e.address.join(',').replace(/,/g, " ")
					this.$set(this.formData, 'regionAddress', data);
					this.formData.provinceName = e.address[0] || ''
					this.formData.cityName = e.address[1] || ''
					this.formData.districtName = e.address[2] || ''
				}
			},
			// #endif
		}
	}
</script>
<style>
	page {
	    background-color: #fff;
	}
</style>
<style scoped lang="scss">
	::v-deep .u-input {
		background: #F7F7F7 !important;
	}

	::v-deep .u-input__right-icon {
		padding-right: 10rpx !important;
	}
	.driver{
		height: 8rpx;
		background-color: #fafafa;
	}

	.form-col {
		padding: 0 30rpx;
		height: 100%;

		.u-form {
			.u-form-item {
				.select-input {
					display: flex;
					width: 100%;
					min-height: 70rpx;
					background: #F7F7F7;
					border-radius: 8rpx;

					.input {
						flex: 1;

						.u-input {
							border-top-left-radius: 8rpx;
							border-bottom-left-radius: 8rpx;

						}
					}

					.map-fill {
						padding-right: 20rpx;
					}
				}
			}
		}
	}

	.input-border {
		border-radius: 8rpx;
	}
	.savebuttom{
		background-color: $themeColor;
		color: #fff;
		position: fixed;
		bottom: 240rpx;
		width: 88%;
		margin: 0 6%;
	}
</style>
