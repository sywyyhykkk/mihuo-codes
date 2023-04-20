<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar-title">个人信息</view>
		</z-nav-bar>
		<view class="main-container">
			<user-mh-menu-item title="头像" @click="changeAvatar">
				<slot>
					<view class="slot-img" v-if="avatar">
						<u-avatar size="84" :src="avatar" />
					</view>
				</slot>
			</user-mh-menu-item>
			<user-mh-menu-item title="昵称" :isShowArrow="true" @click="changeNickname">
				<view class="slot-content"> {{ nickname }} </view>
			</user-mh-menu-item>
			<user-mh-menu-item title="性别" :isShowArrow="false">
				<view class="slot-content"> {{ userSetting.gender === '1' ? '女' : '男' }} </view>
			</user-mh-menu-item>
			<user-mh-menu-item title="手机号" @click="changePhone">
				<view class="slot-content"> {{ userSetting.phone || '无' }} </view>
			</user-mh-menu-item>
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
				nickname: uni.getStorageSync('userData').sysUser.nickName,
				userSetting: {},
				userAddressStr: '',
				avatar: ''
			}
		},
		onShow() {
			this.nickname = uni.getStorageSync('userData').sysUser.nickName
			uni.$once('uAvatarCropper', async path => {
				const imgUrl = await CommonUpload(path, true)
				const avatarUrl = this.$image.imageGlobal + imgUrl + '?time=' + new Date().getTime()
				this.avatar = avatarUrl
				//将im的头像缓存信息删除
				let imUser = uni.getStorageSync('imUserInfo')
				const url = this.$util.avatarImImage(imUser.imId)
				const [select] = await storage.select({
					url
				}) // 查询缓存是否存在
				storage.delete(select)
				uni.showToast({
					title: '修改成功',
					icon: 'none'
				})
				this.getPersonSetting()
			})
			this.getPersonSetting()
		},
		methods: {
			...mapMutations(['setUserAddress']),
			// 修改昵称
			changeNickname() {
				this.toPage(`/pages-user/changeNickname?nickname=${this.nickname}`)
			},
			// 获取个人信息
			getPersonSetting() {
				this.$httpApi
					.getPersonSettingInfo()
					.then(res => {
						if (res) {
							this.userSetting = res
							uni.setStorageSync('userSetting', res)
							if (this.userSetting.userId) {
								this.avatar = this.$util.avatarImage(this.userSetting.userId) + '?time=' + new Date()
									.getTime()
							} else {
								this.avatar = ''
							}
							if (this.userSetting.personageList.length != 0) {
								this.userAddressStr = this.userSetting.personageList[0].address
								this.isAddressEditable = true
							}
						}
					})
					.catch(e => console.log(e))
			},
			areaComplete(data) {
				const addressStr = data.address.join('')
				this.$httpApi
					.updateByUserId({
						userId: this.userSetting.userId,
						address: addressStr
					})
					.then(res => {
						if (res) {
							this.userAddressStr = addressStr
							uni.showToast({
								title: '修改成功',
								icon: 'none'
							})
						}
					})
			},
			changePhone() {
				uni.navigateTo({
					url: '/pages-user/setting/eidtPhone'
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main-container {
		margin-top: 20rpx;

		.slot-content {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #909199;
			margin-right: 20rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.slot-img {
			margin-right: 20rpx;
		}
	}
</style>
