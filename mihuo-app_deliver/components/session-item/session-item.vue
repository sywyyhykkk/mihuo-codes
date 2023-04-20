<template>
	<view class="sessionData flex-row" :class="{'setTop':sessionData.IsTopMost=='true'}">
		<view class="cover flex-row flex-column">
			<im-avatar v-if="!notice" :imId="sessionData.TargetId"  class="avatar"></im-avatar>
			<u-avatar v-else :src="sessionData.icon" shape="square"></u-avatar>
			<slot name="edget"></slot>
		</view>
		<view v-if="!notice && sessionData.TargetName" class="title">
			<view class="main flex-row">
				<!--判断是群聊还是单聊-->
				<view v-if="!isSearch && sessionData.TargetId" class="targetName">
					<text v-if="sessionData.Type == 2"
						class="text">{{ sessionData.TargetName || '群聊' }}</text>
					<text v-else class="text">{{ sessionData.TargetName || '用户'}}</text>
				</view>
				<text v-else class="text" v-html="sessionData.SearchTargetName"></text>
				<text class="time">{{getDate(sessionData.LastTime)}}</text>
			</view>
			<view class="flex-row">
				<view class="sub text-ellipsis ">{{ sessionData.LastContent }}</view>
				<view class="unreadInfo" v-show="sessionData.UnreadCount">{{sessionData.UnreadCount}}</view>
			</view>
		</view>
		<view v-else class="title">
			<view class="main flex-row">
				<!--判断是群聊还是单聊-->
				<text>{{ sessionData.title }}</text>
				<text class="time">{{getDateNotice(sessionData.created)}}</text>
			</view>
			<view class="flex-row">
				<view class="sub text-ellipsis ">{{ sessionData.content }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getShowDate,
		getNoticeDate
	} from '@/static/js/chat.js';
	import tabInit from '@/plugins/im/tabInit.js';
	import {
		tabSqls
	} from '@/plugins/im/tabSqls.js'
	const xsoftmsdk = require('@/plugins/im/xsoftimsdk.js')
	export default {
		name: 'session-item',
		props: {
			isSearch: {
				type: Boolean,
				default: false
			},
			searchText: {
				type: String,
				default: ''
			},
			sessionData: {
				type: Object,
				default: () => ({})
			},
			notice: {
				type: Boolean,
				default: false
			}
		},
		async created() {
			if (!this.notice) {
				const userId = this.sessionData.TargetId
				const type = this.sessionData.Type == xsoftmsdk.enums.SessionType.Normal?'Normal':'Group';
				this.avator = this.$util.avatarImImage(userId,0,0,type) || '@/static/logo.png';
			}
		},
		data() {
			return {
				TargetName: '',
				avator: ''
			};
		},
		methods: {
			getDate(stamp) {
				return getShowDate(stamp, false);
			},
			getDateNotice(date) {
				return getNoticeDate(date)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.sessionData {
		width: 100vw;
		padding: 20rpx;
		position: relative;
		box-sizing: border-box;
		align-sessionDatas: flex-start;
		background-color: #fff;
		border-bottom: 1px solid $borderColor;
		&.setTop{
			background-color: #eee;
		}
		.targetName{
			flex: 1;
			@include bov(1)
		}
		.avatar{
			border-radius: 10rpx;
		}
		.cover {
			width: 80rpx;
			height: 80rpx;
			border-radius: 10rpx;
			box-sizing: border-box;
			border: 2rpx solid #f9f9f9;
			position: relative;
			.icon {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
			.tag {
				color: #fff;
				width: 30rpx;
				height: 30rpx;
				font-size: 20rpx;
				border-radius: 50%;
				background-color: red;
				position: absolute;
				top: -12rpx;
				right: -12rpx;
				z-index: 9;

				&.empty {
					width: 20rpx;
					height: 20rpx;
					background-color: #F72727;
					top: -6rpx;
					right: -6rpx;
				}
			}
		}

		.title {
			height: 100%;
			box-sizing: border-box;
			width: calc(100vw - 100rpx - 40rpx);
			position: relative;

			.main {
				height: 40rpx;
				margin: 6rpx 0 12rpx;

				.text {
					color: #333;
					font-size: 32rpx;
					font-weight: 600;
				}

				.time {
					color: #666;
					font-size: 24rpx;
				}
			}

			.sub {
				color: #999;
				font-size: 24rpx;
			}

			.unreadInfo {
				color: #999;
				font-size: 24rpx;
				background: #FB8919;
				border-radius: 100%;
				padding: 5rpx;
				color: #fff;
				min-width: 39rpx;
				text-align: center;
			}
		}
	}
</style>
