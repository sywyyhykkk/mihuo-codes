<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar"> 修改昵称 </view>
		</z-nav-bar>
		<view class="input-area">
			<uni-easyinput focus :placeholderStyle="`font-size: 30rpx;`" maxlength="20" :inputBorder="true"
				v-model="nickname" :clearable="true" />
		</view>
		<view class="des"> 昵称要求2-20个字符以内，仅能包含中文，英文，数字及下划线。 </view>
		<view :style="{ opacity: disabled ? '0.3' : '1.0' }">
			<bottom-button title="完成" @click="saveChange"></bottom-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: '',
				disabled: true
			}
		},
		onLoad(option) {
			this.nickname = option.nickname
		},
		watch: {
			nickname() {
				const reg = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}$/
				if (reg.test(this.nickname)) {
					this.disabled = false
				} else {
					this.disabled = true
				}
			}
		},
		methods: {
			saveChange() {
				if (this.disabled) return
				this.$httpApi.changeNickname(this.nickname).then(res => {
					if (res) {
						const localUser = JSON.parse(JSON.stringify(uni.getStorageSync('userData')))
						const newUser = {
							...localUser
						}
						newUser['sysUser'].nickName = this.nickname
						uni.setStorageSync('userData', newUser)
						this.$util.toast('修改成功!')
						setTimeout(() => {
							this.goBack()
						}, 500)
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

	.des {
		width: 100%;
		color: grey;
		font-size: 24rpx;
		padding: 0 30rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
