<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">邀请码</view>
		</z-nav-bar>
		<view class="input-area">
			<uni-easyinput fontColor="#000000" maxlength="8" :styles="{ borderStyle: 'solid', borderColor: '#D8D8D8' }" v-model="inviteCode" placeholder="请输入邀请码" clearable :inputBorder="false" />
		</view>
		<view :style="{ opacity: disabled ? '0.3' : '1.0' }">
			<bottom-button title="完成" @click="submit"></bottom-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inviteCode: uni.getStorageSync('userData').referrerInviteCode || '',
				disabled: true,
			}
		},
		onLoad(option) {},
		watch: {
			inviteCode: {
				handler(val) {
					const reg = /^[a-zA-Z0-9_]{8}$/
					if (reg.test(this.inviteCode)) {
						this.disabled = false
					} else {
						this.disabled = true
					}
				},
				immediate: true
			},
		},
		methods: {
			submit(){
				if(this.disabled) return
				if(this.inviteCode === uni.getStorageSync('userData').sysUser.inviteCode){
					this.$util.toast('请输入合法的邀请码!')
					this.inviteCode = ''
					return
				}
				this.$httpApi.bindInvitationCode(this.inviteCode).then(res => {
					if(res){
						const userData = uni.getStorageSync('userData')
						userData['referrerInviteCode'] = this.inviteCode
						uni.setStorageSync('userData', userData)
						this.$util.toast('绑定成功')
						setTimeout(() => {
							this.goBack()
						}, 1500)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.input-area {
		width: 690rpx;
		height: 108rpx;
		margin: 0 30rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
