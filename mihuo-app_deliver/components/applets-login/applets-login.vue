<template>
	<view>
		<!-- 登录弹窗 -->
		<view class="loginMask" v-if="loginPopupShow" @click="closePopup"></view>
		<view class="loginPopup" v-if="loginPopupShow">
			<view class="loginBox">
				<image class="logo" :src="base.logoUrl"></image>
				<view class="platformName">{{ base.platformName }}</view>
				<view class="description" v-if="base.description">{{ base.description }}</view>
			</view>
			<button type="primary" hover-class="active" open-type="getUserInfo" @getuserinfo="onAuthorization">授权登录</button>
		</view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import base from '@/config/baseUrl';
// #ifdef MP-WEIXIN
import { getUserInfo } from '@/config/login';
// #endif
let clear;
export default {
	data() {
		return {
			base: base
		};
	},
	computed: {
		...mapState(['userInfo', 'loginPopupShow'])
	},
	methods: {
		...mapMutations(['setUserInfo', 'setLoginPopupShow']),
		//授权登录
		onAuthorization: function(e) {
			if (e.detail.errMsg == 'getUserInfo:ok') {
				var userInfo = e.detail;
				this.setLoginPopupShow(false);
				getUserInfo(userInfo, 'authorized');
			}
		},
		closeLogin() {
			if (this.loginPopupShow && this.userInfo.token) {
				this.setLoginPopupShow(false);
			}
		},
		//关闭弹窗
		closePopup() {
			this.setLoginPopupShow(false);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.loginMask {
	position: fixed;
	top: 0rpx;
	left: 0rpx;
	right: 0rpx;
	bottom: 0rpx;
	background-color: rgba(0, 0, 0, 0.4);
	z-index: 10;
}
.loginPopup {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: 500rpx;
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	z-index: 11;

	.loginBox {
		padding: 30rpx 15rpx 40rpx 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			width: 160rpx;
			height: 160rpx;
			border-radius: 20%;
		}

		.platformName {
			font-size: 24rpx;
			color: #999;
			margin-top: 10rpx;
		}

		.description {
			margin-top: 15rpx;
			font-size: 30rpx;
			color: #333;
		}
	}

	button {
		border-radius: 0rpx;
		background-color: $themeColor;
	}
	.active {
		background-color: $themeColor;
		opacity: 0.8;
	}
}
</style>
