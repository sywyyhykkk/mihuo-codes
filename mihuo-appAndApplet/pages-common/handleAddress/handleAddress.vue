<template>
	<view>
		<z-nav-bar backState="1000" :title="title"></z-nav-bar>
		<view class="header-container" v-if="isMyHome">
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
					<view class="placeholder" :class="{
						'model':form.poiName && form.adcode
					}">
						{{ form.poiName ? form.province + (form.city == form.province ?'':form.city) + form.region : '请选择省、市、区' }}
					</view>
					<uni-icons type="right" size="12" style="margin-left: 10rpx;"></uni-icons>
				</view>
			</view>
			<view class="form-item flex-center" @click="selectAddress">
				<view class="left">
					详细地址
				</view>
				<view class="right flex-center">
					<view class="placeholder" :class="{
						'model':form.latAddress
					}">
						{{ form.latAddress ? form.latAddress : '请选择详细地址' }}{{ form.poiName || ''}}
					</view>
					<uni-icons type="right" size="12" style="margin-left: 10rpx;"></uni-icons>
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left">
					楼栋房号
				</view>
				<view class="right flex-center">
					<uni-easyinput :clearable="false" text v-model="form.detailAddress" placeholder="请输入楼栋房号"
						fontColor="#000000" style="text-align: right;" :textRight="true"
						:placeholderStyle="placeholderStyle" :inputBorder="false" />
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left">
					面积
				</view>
				<view class="right flex-center">
					<uni-easyinput :clearable="false" type="number" v-model="form.area" placeholder="请输入面积"
						fontColor="#000000" style="text-align: right;" :textRight="true"
						:placeholderStyle="placeholderStyle" :inputBorder="false" />
					<text class="unit">&#x33A1;</text>
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left" style="width: 20%;">
					户型
				</view>
				<view class="right flex-center" @click="selectModel" style="width: 80%;">
					<view class="placeholder" :class="{
						'model':form.model
					}">
						{{ form.model || '室 厅 厨 卫' }}
					</view>
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left">
					{{isElevator?"有":"无"}}电梯
				</view>
				<view class="right flex-center">
					<u-switch @change="switchElevator" v-model="isElevator" size="36" active-color="#ff5d35"></u-switch>
				</view>
			</view>
			<view class="form-item flex-center" v-if="!isElevator">
				<view class="left">
					楼层
				</view>
				<view class="right flex-center">
					<uni-easyinput :clearable="false" type="number" v-model="form.floor" placeholder="请输入楼层"
						fontColor="#000000" style="text-align: right;" :textRight="true"
						:placeholderStyle="placeholderStyle" :inputBorder="false" />
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left">
					{{ isMyHome?'':'联系人'}}{{'姓名'}}
				</view>
				<view class="right flex-center">
					<uni-easyinput :clearable="false" text v-model="form.name" placeholder="请输入联系人姓名"
						fontColor="#000000" style="text-align: right;" :textRight="true"
						:placeholderStyle="placeholderStyle" :inputBorder="false" />
				</view>
			</view>
			<view class="form-item flex-center" v-if="!isMyHome">
				<view class="left">
					联系人电话
				</view>
				<view class="right flex-center">
					<uni-easyinput :clearable="false" type="number" v-model="form.phoneNumber" placeholder="请输入联系人电话"
						fontColor="#000000" style="text-align: right;" :textRight="true"
						:placeholderStyle="placeholderStyle" :inputBorder="false" />
				</view>
			</view>
			<view class="form-item flex-center">
				<view class="left">
					称谓
				</view>
				<view class="right flex-center">
					<view class="left-gender" @click="changeGender(1)"
						:style="{ borderColor: form.gender == 1 ? '#ff5d35' : '#a8a8a8' }">
						先生
					</view>
					<view class="right-gender" @click="changeGender(2)"
						:style="{ borderColor: form.gender == 2 ? '#ff5d35' : '#a8a8a8' }">
						女士
					</view>
				</view>
			</view>
			<view class="form-item flex-center" v-if="!isMyHome">
				<view class="left">
					是否默认地址
				</view>
				<view class="right flex-center">
					<u-switch v-model="defaultStatus" size="36" active-color="#ff5d35"></u-switch>
				</view>
			</view>
		</view>
		<bottom-button bgColor='#FFFFFF' :styleObj="{opacity: disabled ? '0.3' : '1'}" title="保 存" color="#FFFFFF"
			@click="saveForm">
		</bottom-button>
		<u-select v-model="isShowPicker" mode="mutil-column" :list="modelList" @confirm="confirm"></u-select>
		<!-- #ifdef MP-WEIXIN -->
		<common-mh-map-popup v-model="mapPopup" :city="form.city?form.city:selectedAddressCity" @callback="mapAddress"
			:poiName="form.poiName" @selectAddress="selectArea"></common-mh-map-popup>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userAddressStr: uni.getStorageSync('oldLocation') && uni.getStorageSync('oldLocation').address || '',
				placeholderStyle: 'font-size: 28rpx; font-family: Noto Sans S Chinese;font-weight: 400; color: #909090; line-height: 34rpx;',
				adcode: '',
				form: {
					gender: 0, // 性别 0=未知，1=男，2=女
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
					name: uni.getStorageSync('userData').sysUser.userauthFlag==1?uni.getStorageSync('userData').sysUser.realName:'',
					phoneNumber: uni.getStorageSync('userData').sysUser.phone,
					memberId: uni.getStorageSync('userData').sysUser.userId
				},
				disabled: true,
				poiName: '', // 位置信息
				mapPopup: false,
				isShowPicker: false, // 是否显示选择户型菜单
				isElevator: true, // 是否有电梯
				defaultStatus: false, // 是否默认地址
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
					uni.getStorageSync('oldLocation').address : '',
				options: {},
				title: '地址管理',
				isMyHome: false
			}
		},
		onLoad(options) {
			this.options = options
			if (options.edit == 'true') {
				this.getAddress();
			}
			if (options.myHome) {
				this.title = "我的家";
				this.isMyHome = true
			} else {
				this.isMyHome = false
			}
			this.isEdit = options.edit;
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
						if (!newVal['province'] || !newVal['region'] || !newVal['adcode'] || !newVal['detailAddress'] || !newVal['name']) {
							this.disabled = true;
						} else {
							if (!this.isElevator && (!newVal['floor'] || newVal['floor'] == 0)) {
								this.disabled = true;
							} else {
								this.disabled = false;
							}
						}
					}
				},
				deep: true
			},
		},
		methods: {
			// 更改性别
			changeGender(gender) {
				if (gender == this.form.gender) {
					this.form.gender = 0
				} else {
					this.form.gender = gender
				}
			},
			// 获取地址详情
			getAddress() {
				this.$httpApi.getAddressDetail(this.options.id)
					.then(res => {
						this.form = res;
						// this.form.detailAddress = this.form.detailAddress == 0 ? null : this.form.detailAddress
						this.form.floor = this.form.floor == 0 ? null : this.form.floor
						this.isElevator = this.form.isElevator == 1 ? true : false;
						this.address = this.form.province + this.form.city + this.form.region;
						this.defaultStatus = this.form.defaultStatus === 0 ? true : false;
					})
			},
			// 保存表单并提交
			saveForm() {
				let url = ''
				if (this.disabled) return;
				if (!/^1[3-9]{1}[0-9]{9}$/.test(this.form.phoneNumber)) {
					uni.showToast({
						title: '手机号格式不正确!',
						icon: 'none'
					});
					return;
				}
				const params = {
					...this.form,
					isElevator: this.isElevator ? 1 : 0, // 是否有电梯 0=无 1=有
					defaultStatus: this.defaultStatus ? 0 : 1, // 是否为默认地址 0=是 1=否
				}
				if (this.options.edit && this.options.edit == 'true') {
					url = `mall/member/address/update/${this.options.id}`
				} else {
					url = `mall/member/address/add`
				}
				this.$http.post(url, params).then(res => {
					if (res) {
						this.$util.toast('操作成功~')
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
					this.form.poiName = data.name
					this.form.province = data.pname
					this.form.city = data.cityname
					this.form.region = data.adname
					this.form.latAddress = data.address
					this.form.latitude = data.location.lat
					this.form.longitude = data.location.lng
					this.form.adcode = data.adcode
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
			// 控制是否
			switchElevator(e) {
				this.isElevator = e;
				let newVal = this.form;
				for (const key in newVal) {
					if (!newVal['province'] || !newVal['region'] || !newVal['adcode'] || !newVal['detailAddress']) {
						this.disabled = true;
					} else {
						if (!this.isElevator && (!newVal['floor'] || newVal['floor'] == 0)) {
							this.disabled = true;
						} else {
							this.disabled = false;
						}
					}
				}
			},
			selectArea() {
				uni.navigateTo({
					url: '/pages-common/operatorSelectCity/operatorSelectCity'
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

				.left-gender,
				.right-gender {
					width: 80rpx;
					height: 40rpx;
					border: 2rpx #a8a8a8 solid;
					text-align: center;
					font-size: 20rpx;
					margin: 10rpx;
					border-radius: 10rpx;
				}

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

	.placeholder {
		font-size: 28rpx;
		color: #909090;
	}

	.model {
		color: #000000 !important;
	}
</style>
