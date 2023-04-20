<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">个人资料设置</view>
		</z-nav-bar>
		<view class="main-container">
			<menu-item title="头像" @click="changeAvatar">
				<slot>
					<view class="slot-img" v-if="avatar">
						<u-avatar size="84" :src="avatar" />
					</view>
				</slot>
			</menu-item>
			<menu-item title="姓名" :border="true" @click="changeRealName">
				<view class="slot-content">
					{{ userSetting.realName ? userSetting.realName : '无' }}
				</view>
			</menu-item>
			<menu-item title="性别" :isShowArrow="false" :border="true">
				<view class="slot-content">
					{{ userSetting.gender === '1' ? '女' : '男' }}
				</view>
			</menu-item>
			<menu-item title="银行卡" @click="toBankCard" :border="true">
				<view class="slot-content" :class="!isBindCard ? 'err_font' : ''">
					{{ binkText }}
				</view>
			</menu-item>
			<menu-item title="手机号" @click="changePhone" :border="true">
				<view class="slot-content">
					{{ userSetting.phone || '无' }}
				</view>
			</menu-item>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js'
	import {
		funimgcache as storage
	} from '@/plugins/storage.js'
	export default {
		data() {
			return {
				realName: '',
				binkText: '未绑定',
				isBindCard: false,
				selfSignature: '',
				userSetting: {},
				userAddressStr: '',
				avatar: '',
				isAddressEditable: false, // 是否能修改常住地, 如果没有任何工种认证则不能修改常住地
			}
		},
		onReady() {
			this.getBankCard()
		},
		onShow() {
			uni.$once('uAvatarCropper', async (path) => {
				const imgUrl = await CommonUpload(path, true)
				const avatarUrl =
					this.$image.imageGlobal + imgUrl + '?time=' + new Date().getTime()
				this.avatar = avatarUrl
				this.$httpApi
					.updateByUserId({
						userId: this.userSetting.userId,
						avatar: imgUrl
					})
					.then(async (res) => {
						//将im的头像缓存信息删除
						let imUser = uni.getStorageSync('imUserInfo');
						const url = this.$util.avatarImImage(imUser.imId)
						const [select] = await storage.select({
							url
						}); // 查询缓存是否存在
						select && uni.removeSavedFile({
							filePath: select.local,
							complete: function(res) {
								console.log(res);
							}
						});
						storage.delete(select)
						this.getPersonSetting()
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
					})
			})
			this.getPersonSetting()
			const userAddressInfo = uni.getStorageSync('userAddress')
			if (userAddressInfo) {
				this.userAddressStr = userAddressInfo.address[1];
				this.isAddressEditable = true
			} else {
				this.userSetting = uni.getStorageSync('userSetting')
				if (
					this.userSetting.personageList &&
					this.userSetting.personageList.length !== 0
				) {
					this.userAddressStr = this.userSetting.personageList[0].address ?
						this.userSetting.personageList[0].address.split(' ')[1] :
						''
					this.isAddressEditable = true
				} else {
					this.userAddressStr = '选择'
					this.isAddressEditable = false
				}
			}
		},
		methods: {
			...mapMutations(['setUserAddress']),

			// 修改姓名
			changeRealName() {
				// 只有用户未完成实名验证的时候允许修改姓名
				let flag = uni.getStorageSync('userData').sysUser.userauthFlag
				if (flag === 1) {
					this.$util.toast('您已完成实名认证, 不允许自主修改姓名~')
					return
				}
				// this.$refs.popup.open()
				this.toPage('/pages/setting/eidtName')
			},
			
			// 获取个人信息
			getPersonSetting() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.userSetting = res;
						uni.setStorageSync('userSetting', res);
						if (this.userSetting.userId) {
							this.avatar = this.$util.avatarImage(this.userSetting.userId) + '?time=' + new Date()
								.getTime();
						} else {
							this.avatar = '';
						}
						if (this.userSetting.personageList.length != 0) {
							this.userAddressStr = this.userSetting.personageList[0].address;
							this.isAddressEditable = true
						}
					}
				}).catch(e => console.log(e));
			},
			// 用户银行卡状态
			getBankCard() {
				this.$httpApi
					.getPaymentAccountBankCard()
					.then((res) => {
						if (res.length) {
							this.binkText = '已绑定'
							this.isBindCard = true
						} else {
							this.binkText = '未绑定'
							this.isBindCard = false
						}
					})
					.catch((err) => console.log(err))
			},
			toBankCard() {
				uni.navigateTo({
					url: '/pages/setting/addBankCard'
				})
			},
			changePhone() {
				uni.navigateTo({
					url: '/pages/setting/eidtPhone'
				})
			},
			changeAvatar() {
				this.$u.route({
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					params: {
						destWidth: 400,
						rectWidth: 200,
						fileType: 'jpg'
					}
				})
			},
			back() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 30rpx;
		line-height: 50rpx;
		color: #333333;
	}

	.main-container {
		margin-top: 20rpx;

		.slot-content {
			font-family: PingFang SC;
			font-style: normal;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #909199;
			margin-right: 20rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.err_font {
			color: $errorFontColor;
		}

		input {
			text-align: right;
		}

		.slot-img {
			margin-right: 20rpx;
		}
	}
</style>
