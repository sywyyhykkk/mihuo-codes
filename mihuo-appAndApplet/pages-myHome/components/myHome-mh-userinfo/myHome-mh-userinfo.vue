<template>
	<view class="user-content">
		<u-avatar class="avater" :src="$util.avatarImage(userInfo.executeUserId || userInfo.startUserId || userInfo.userId)" size="60"></u-avatar>
		<view style="display: flex;align-items: center;">
			<text class="username">{{userInfo.executePersonName || userInfo.startPersonName || userInfo.name || '名称'}}</text>
			<text class="person-icon1" v-if="userInfo.executeSkillName">{{userInfo.executeSkillName || userInfo.startSkillName || userInfo.skillName || '岗位标签'}}</text>
			<slot></slot>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'myHome-mh-userinfo',
		props: {
			userInfo: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.user-content {
		display: flex;
		align-items: center;
		margin: 0 0 0 30rpx;
        background-color: #fff;
		.avatar {
			margin-right: 30rpx;
		}

		.username {
			font-size: 25rpx;
			color: #000;
			margin: 0 0 0 14rpx;
		}

		.person-icon1 {
			display: block;
			padding: 3rpx 8rpx;
			margin:0 0 0 9rpx;
			font-size: 19rpx;
			font-family: HuXiaoBo-NanShen;
			font-weight: 400;
			color: #FE6E32;
			background: #F8F8F8;
			border-radius: 10rpx 2rpx 10rpx 0px;
		}
	}
</style>
