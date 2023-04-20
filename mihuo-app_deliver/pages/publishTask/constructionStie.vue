<template>
	<view class="construction-stie-page">
		<view class="item-all">
			<view class="item-contain border-top">
				<view class="public-label">
					联系姓名
				</view>
				<view class="user-information">
					<view class="item-name">
						<u-input :border="true" :clearable="false" height="86" v-model="form.contactName"
							placeholder="请输入姓名" style="border: 1rpx solid #EEEEEE;"
							placeholder-style="fontSize:26rpx;color: #999999;" />
					</view>
					<view class="radio-contain">
						<u-radio-group v-model="contactGenderNew" @change="radioGroupChangeRender">
							<u-radio :active-color="themeColor" v-for="(item, index) in genderList" :key="index"
								:name="item.name" :disabled="item.disabled" size="30">
								<text class="name">{{item.name}}</text>
							</u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
			<view class="item-contain">
				<view class="public-label">
					联系电话
				</view>
				<view class="right">
					<u-input height="60" :clearable="false" type="number" maxlength="11" v-model="form.contactPhone"
						:border="false" placeholder="请填写联系电话" placeholder-style="color:#999999" />
				</view>
			</view>
			<view class="item-contain">
				<view class="public-label">
					施工地点
				</view>
				<view class="right" @click="getConstructionSite">
					<view class="public-item-placeholder" v-if="!form.provinceName">请选择施工地点</view>
					<view class="public-item-text" v-if="form.provinceName">
						{{form.provinceName}}{{form.cityName}}{{form.districtName}}
					</view>
					<image class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
				</view>
			</view>
			<view class="item-contain border-bottom">
				<view class="public-label item-street">
					街道
				</view>
				<view class="right" @click="getConstructionSite">
					<view class="public-item-text" v-if="form.latAddress">
						{{form.latAddress}}{{form.poiName}}
					</view>
					<view class="public-item-placeholder" v-if="!form.latAddress">请选择街道</view>
					<image class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
				</view>
			</view>
			<view class="item-contain border-bottom">
				<view class="public-label">
					详细地址
				</view>
				<view class="right">
					<u-input height="60" type="text" :clearable="false" v-model="form.address" :border="false"
						placeholder="请输入栋、单元、门牌号" placeholder-style="color:#999999" />
				</view>
			</view>
		</view>

		<view class="recently-used" v-if="recordAddressList.length > 0">
			<view class="title">
				最近使用
			</view>
			<view class="list-contain">
				<view class="item-contain" v-for="(item,index) in recordAddressList" :key="index">
					<view class="item-left">
						<view class="item-top">
							<text class="name">{{item.contactName}}</text>
							<text class="phone">{{item.contactPhone}}</text>
						</view>
						<view class="item-address">
							<text>{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.latAddress}}{{item.poiName}}{{item.address}}</text>
						</view>
					</view>
					<view class="item-right" @click="getUse(item)">
						使用
					</view>
				</view>
			</view>
		</view>
		<bottom-button title="保存" @click="submit"></bottom-button>
	</view>
</template>

<script>
	import {
		styleColor
	} from "@/style/mixin.js"
	export default {
		data() {
			return {
				themeColor: styleColor.themeColor,
				contactGenderNew: '先生',
				recentlyUsedList: [1],
				genderList: [{
						name: '先生',
						disabled: false
					},
					{
						name: '女士',
						disabled: false
					},
				],
				recordAddressList: [],
				form: {
					cityId: '',
					contactGender: '1', // 联系人性别称谓: 1=先生；2=女士
					contactName: '', // 	联系人名称
					contactPhone: '', // 	联系人电话
					address: '', // 详细地点
					provinceName: '', // 省
					cityName: '', //  城市
					districtName: '', //区
					latAddress: '', //街道
					poiName: '', // 商区地址，街道地址
					longitude: '',
					latitude: ''
				}
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('viewConstructionStie', (data) => {
				this.editDetails(data)
			});
		},
		onShow() {
			uni.$once('updateData', (data) => {
				if (JSON.stringify(data) !== "{}") {
					console.log("data", data);
					// 这里的adcode应该和首页选择的运营商的cityId一致
					// that.form.cityId = data.adcode.substring(0, 2)
					this.getCityId(data, (res) => {
						if (res) {
							this.form.longitude = data.location.lng
							this.form.latitude = data.location.lat
							this.form.provinceName = data.pname
							this.form.cityName = data.cityname
							this.form.districtName = data.adname
							this.form.latAddress = data.address
							this.form.poiName = data.name
						}
					})
				}
			})
			let tempList = uni.getStorageSync('addressList')
			if (tempList && tempList.length > 0) {
				if (uni.getStorageSync('userData').sysUser) {
					this.recordAddressList = tempList.filter(item => item.userId == uni.getStorageSync(
						'userData').sysUser.userId)
					this.recordAddressList = this.recordAddressList.filter(item =>item.cityId)	
				}
			}
			// let temp = {
			// 	"cityId": "38",
			// 	"contactGender": "1",
			// 	"contactName": "付",
			// 	"contactPhone": "18550898420",
			// 	"address": "12",
			// 	"provinceName": "云南省",
			// 	"cityName": "昆明市",
			// 	"districtName": "西山区",
			// 	"latAddress": "海埂路183号",
			// 	"poiName": "臻万百货",
			// 	"longitude": "102.707728",
			// 	"latitude": "25.017872",
			// 	"userId": 92
			// }
			// this.recordAddressList.push(temp)
		},
		onUnload() {
			uni.$off('updateData')
		},
		methods: {
			getCityId(data, callback) {
				let tempAdcode = data.adcode.substring(0,4)
				this.$http.post(`admin/cityoperator/getbyareacode/${tempAdcode}`).then(res => {
					if (res) {
						this.form.cityId = res.id;
						callback && callback(true)
					} else {
						this.$util.toast("您的房屋地址未匹配到运营商,请重新选择")
						callback && callback(false)
					}
				})
			},
			setContactPhone() {
				let phone = uni.getStorageSync('userData').sysUser.phone
				if (phone) {
					this.form.contactPhone = phone
				}
			},
			editDetails(data) {
				let {
					cityId,
					contactGender,
					contactName,
					contactPhone,
					cityName,
					address,
					longitude,
					latitude,
					provinceName, // 省
					districtName, //区
					latAddress, //街道
					poiName, // 商区地址，街道地址
				} = data
				this.form.contactGender = contactGender
				this.form.contactName = contactName
				this.form.contactPhone = contactPhone
				this.form.cityName = cityName
				this.form.address = address
				this.form.latitude = latitude
				this.form.cityId = cityId
				this.form.latitude = latitude

				this.form.provinceName = provinceName
				this.form.districtName = districtName
				this.form.latAddress = latAddress
				this.form.poiName = poiName
				this.contactGenderNew = contactGender == '1' ? '先生' : '女士'
			},
			getUse(item) {
				let tempItem = JSON.parse(JSON.stringify(item))
				console.log('tempItem',tempItem);
				this.form = tempItem
				this.contactGenderNew = tempItem.contactGender == '1' ? '先生' : '女士'
			},
			submit() {
				if (this.form.contactName == '') {
					this.$util.toast('请输入联系姓名');
					return
				}
				if (this.form.contactPhone == '') {
					this.$util.toast('请输入手机号');
					return
				}
				if (!this.$base.phoneRegular.test(this.form.contactPhone)) {
					this.$util.toast('手机号格式不正确');
					return
				}
				if (!this.form.cityName) {
					this.$util.toast('请选择省市区');
					return
				}

				if (!this.form.latAddress) {
					this.$util.toast('请选择街道地址');
					return
				}

				if (!this.form.address) {
					this.$util.toast('请输入详细地址');
					return
				}
				console.log("this.form", this.form);
				this.setAddress()
				uni.$emit('setConstructionStie', this.form)
				this.goBack()
			},
			getConstructionSite() {
				uni.navigateTo({
					url: '/pages/mapChoose/mapChoose',
					animationType: 'slide-in-bottom',
				})
			},
			// 性别
			radioGroupChangeRender(value) {
				this.form.contactGender = value === '先生' ? 1 : 2
			},
			getAddress() {
				this.$refs.addressEl.show();
			},
			setAddress() {
				let tempAddressList = []
				let resultList = uni.getStorageSync('addressList')
				let resultListStatus = false
				let {
					cityId,
					contactGender,
					contactName,
					contactPhone,
					cityName,
					address,
					provinceName, // 省
					districtName, //区
					latAddress, //街道
					poiName, // 商区地址，街道地址
				} = this.form

				let tempContactGender = []
				let tempContactName = []
				let tempContactPhone = []
				let tempCityName = []
				let tempAddress = []
				let tempProvinceName = []
				let tempDistrictName = []
				let tempLatAddress = []
				let tempPoiName = []
				let tempCityId = []
				if (resultList.length > 0) {
					resultList.map(item => {
						tempContactGender.push(item.contactGender)
						tempContactName.push(item.contactName)
						tempContactPhone.push(item.contactPhone)
						tempCityName.push(item.cityName)
						tempAddress.push(item.address)
						tempProvinceName.push(item.provinceName)
						tempDistrictName.push(item.districtName)
						tempLatAddress.push(item.latAddress)
						tempPoiName.push(item.poiName)
						tempCityId.push(item.cityId)
					})

					if (tempContactGender.indexOf(contactGender) == -1) {
						resultListStatus = true
					}
					if (tempContactName.indexOf(contactName) == -1) {
						resultListStatus = true
					}
					if (tempContactPhone.indexOf(contactPhone) == -1) {
						resultListStatus = true
					}
					if (tempCityName.indexOf(cityName) == -1) {
						resultListStatus = true
					}
					if (tempAddress.indexOf(address) == -1) {
						resultListStatus = true
					}
					if (tempProvinceName.indexOf(provinceName) == -1) {
						resultListStatus = true
					}
					if (tempDistrictName.indexOf(districtName) == -1) {
						resultListStatus = true
					}
					if (tempLatAddress.indexOf(latAddress) == -1) {
						resultListStatus = true
					}
					if (tempPoiName.indexOf(poiName) == -1) {
						resultListStatus = true
					}
					if (tempCityId.indexOf(cityId) == -1) {
						resultListStatus = true
					}
					if (resultListStatus) {
						resultList.push({
							...this.form,
							userId: uni.getStorageSync('userData').sysUser.userId
						})
					}
					uni.setStorageSync('addressList', resultList)
				} else {
					tempAddressList.push({
						...this.form,
						userId: uni.getStorageSync('userData').sysUser.userId
					})
					uni.setStorageSync('addressList', tempAddressList)
				}
			}
		},

	}
</script>

<style lang="scss" scoped>
	/deep/ .uni-input-input {
		color: #333333;
	}

	.public-item-text {
		color: #333333;
		font-size: $smiddleFontSize;
		display: flex;
		justify-content: flex-start;
		flex: 1;
	}

	.public-label {
		color: $seconFontColor;
		font-size: $middleFontSize;
		min-width: 112rpx;
	}

	.item-street {
		text-align: justify;
		text-align-last: justify;
	}

	.public-item-placeholder {
		color: #999999;
		font-size: $smiddleFontSize;
		display: flex;
		justify-content: flex-start;
		flex: 1;
	}

	.icon-arrow {
		width: 14rpx;
		height: 26rpx;
	}

	.border-top {
		border-radius: 10rpx 10rpx 0px 0px;
	}

	.border-bottom {
		border-radius: 0px 0px 10rpx 10rpx;
	}

	.construction-stie-page {
		padding: 16rpx 20rpx 140rpx 20rpx;

		.item-all {

			.item-contain {
				background-color: #fff;
				margin-bottom: 2rpx;
				height: 124rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;

				.right {
					display: flex;
					flex: 1;
					align-items: center;
					padding-left: 40rpx;

				}

				.user-information {
					display: flex;
					align-items: center;

					.item-name {
						width: 272rpx;
						height: 86rpx;
						margin-left: 18rpx;
					}

					.radio-contain {
						margin-left: 22rpx;
						display: flex;
						flex: 1;

						.u-radio-group {
							display: flex;
							align-items: center;
							flex-direction: row;
							flex-wrap: nowrap;

							.name {
								font-size: $smiddleFontSize;
								color: $seconFontColor;
							}
						}
					}


				}
			}
		}

		.recently-used {
			margin-top: 44rpx;

			.title {
				font-size: $middleAddFontSize;
				color: #666666;
				margin-bottom: 20rpx;
				padding-left: 38rpx;
			}

			.list-contain {

				.item-contain {
					display: flex;
					background: #FFFFFF;
					padding: 40rpx;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 10rpx;
					border-radius: 10rpx;

					.item-left {

						.name {
							font-size: $middleFontSize;
							color: $seconFontColor;
							margin-right: 20rpx;
						}

						.phone {
							font-size: $middleFontSize;
							color: #999999;
						}

						.item-address {
							max-width: 458rpx;

							text {
								font-size: $middleFontSize;
								color: #666666;
							}

						}
					}

					.item-right {
						width: 102rpx;
						height: 52rpx;
						line-height: 52rpx;
						text-align: center;
						font-size: $smallFontSize;
						color: $themeColor;
						border: 1rpx solid $themeColor;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
</style>
