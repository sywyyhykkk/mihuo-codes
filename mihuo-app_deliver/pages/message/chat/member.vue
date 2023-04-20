<template>
	<view class="container">
		<!--列表-->
		<view style="background-color: #fff;">
			<u-grid :border="false" col="6">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex">
					<im-avatar :imId="listItem.ImId" class="avatar"></im-avatar>
					<text class="grid-text">{{listItem.Name}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" />
		</view>
		<view class="content">
			<view class="push_item" v-for="(item,index) in pushList" :key="index">
				<view class="left">
					<view class="title">{{item.title}}</view>
					<view class="sub_title">{{item.subTitle}}</view>
				</view>
				<view class="switch">
					<u-switch @change="(event)=>change(event,item)" :active-color="$styleColor.themeColor"
						inactive-color="#C4C4C4" size=26 v-model="item.open" />
				</view>
			</view>
		</view>
		<view style="margin-top: 15rpx;">
			<menu-item title="举报" @click="()=>goToReport(0)"></menu-item>
		</view>
		<!-- <view class="driver"></view> -->
	</view>
</template>

<script>
	import emoji from '../../../plugins/emoji.js'
	import imsdk from '@/plugins/im/imsdk.js';
	import myVoice from '../../../components/self-voice/index.vue'
	import {
		tabSqls
	} from '@/plugins/im/tabSqls.js'
	import storage from '@/plugins/storage.js'
	import tabInit from '@/plugins/im/tabInit.js';
	export default {
		data() {
			return {
				list: [],
				pushList: [{
						title: '拉黑该用户',
						subTitle: '',
						open: false,
					},
					{
						title: '屏蔽该用户信息',
						subTitle: '',
						open: false
					}
				]
			}
		},
		onLoad(option) {
			tabInit.getImUserInfo(tabSqls['ImUser'],
				`where ImId = ${option.id}`).then(res => {
				this.list = res;
			})
		},
		onShow() {

		},
		methods: {
			goToReport() {
				this.toPage(`/pages/message/chat/report?id=${0}`)
			},
			change(e, data) {
				this.$util.toast(data.title+"成功")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.grid-text {
			font-size: 24rpx;
			color: $fontColor99;
			margin-top: 10rpx;
			max-width: 120rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.driver {
			background-color: aliceblue;
			height: 15rpx;
		}
	}

	.content {
		background: #FFFFFF;
		margin-top: 20rpx;

		.push_item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx 20rpx 24rpx;
			border-bottom: 1px solid #F6F6F6;

			.left {
				font-weight: 400;

				.title {
					font-size: $middleFontSize;
					color: $seconFontColor;
				}

				.sub_title {
					margin-top: 10rpx;
					font-size: $smallFontSize;
					color: $viceFontColor;
				}
			}
		}
	}
</style>
