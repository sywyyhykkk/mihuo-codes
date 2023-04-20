<template>
	<view class="container">
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				服务通知
			</view>
		</z-nav-bar>
		<view v-if="current === 0" :style="{ height: marginHeight + 'px' }"></view>
		<view v-else :style="{ height: marginHeight-70 + 'px' }"></view>
		<scroll-view scroll-y class="list" id="content-wrap0" style="margin-top: -20rpx;">
			<view v-if='message.length' class="" id="content-wrap1">
				<view v-for="item in message" :key="item.title">
					<session-item :notice="true" :sessionData="item" @click.native.stop="toNotice(item)">
						<view v-if="item.unReadCount" slot="edget" class="edget">
							<text class="number">{{item.unReadCount}}</text>
						</view>
					</session-item>
				</view>
			</view>
			<!-- <message-mh-empty v-else title="暂无通知记录" /> -->
		</scroll-view>
	</view>
</template>
<script>
	import tabInit from '@/plugins/im/tabInit.js';
	import {
		tabSqls
	} from '@/plugins/im/tabSqls.js';
	import {
		getShowDate
	} from '@/static/js/chat.js';

	export default {
		data() {
			return {
				downOption: {},
				upOption: {
					use: true
				},
				mescroll: null,
				message: [
					{
						icon: '/pages-message/static/images/notice_material.png',
						title: '主辅材料',
						content: '暂无消息',
					}, {
						icon: '/pages-message/static/images/notice_measure.png',
						title: '定制测量',
						content: '暂无消息',
					}, {
						icon: '/pages-message/static/images/notice_personnel.png',
						title: '人员调度',
						content: '暂无消息',
					}, {
						icon: '/pages-message/static/images/notice_quality.png',
						title: '质量品控',
						content: '暂无消息',
					}, {
						icon: '/pages-message/static/images/notice_construction.png',
						title: '施工执行',
						content: '暂无消息',
					},
					{
						icon: '/pages-message/static/images/notice_other.png',
						title: '其他',
						content: '暂无消息',
					}
				], // 系统通知
				current: 0,
				archShow: false,
				swiperHeight: 0,
				marginHeight: 0,
				openAction: '',
				optionsTop: [{
					text: '取消置顶',
					color: '#fff',
					style: {
						backgroundColor: 'rgb(199, 198, 205)'
					}
				}, {
					text: '删除',
					color: '#fff',
					style: {
						backgroundColor: 'rgb(255, 58, 49)'
					}
				}],
				options: [{
					text: '置顶',
					color: '#fff',
					style: {
						backgroundColor: 'rgb(199, 198, 205)'
					}
				}, {
					text: '删除',
					color: '#fff',
					style: {
						backgroundColor: 'rgb(255, 58, 49)'
					}
				}],
				posRight: '15px',
				userId: uni.getStorageSync('userId') || '',
				noticeNum: 0,
			}
		},
		onShow() {
			this.openAction = '';
			if (!uni.getStorageSync('userInfo')) {
				return
			}
			this.getNotice();
		},
		onLoad() {
		},
		onReady() {},
		computed: {
			list() {
				const {
					messageSessionList
				} = this.$store.state;
				if (!uni.getStorageSync('userInfo')) {
					return []
				}
				return messageSessionList;
			},
			items() {
				const {
					messageSessionList
				} = this.$store.state;
				let unread = 0;
				messageSessionList.forEach(item => {
					unread += item.UnreadCount;
				})
				let notice = 0;
				this.message.forEach(item => {
					notice += item.unReadCount || 0
				})
				this.setTabBarBadgeNotice()
				return [`消息(${unread})`, `通知(${notice})`];
			}
		},
		methods: {
			// 设置角标
			setTabBarBadgeNotice() {
				let notice = 0
				// 未读消息
				this.list.forEach(item => {
					notice += item.UnreadCount || 0
				})
				// 未读通知
				this.message.forEach(item => {
					notice += item.unReadCount || 0
				})
				if (notice > 0) {
					if (notice > 99) {
						notice = '99+'
					} else {
						notice = notice.toString()
					}
					if (!notice || notice === NaN) {
						notice = '0'
					}
					uni.setTabBarBadge({
						index: 3,
						text: notice
					})
				} else {
					uni.removeTabBarBadge({
						index: 3
					})
				}
			},
			getNotice() {
				this.$http.get('basic/basicmessage/list', {}, {
					header: {
						isShowMessage: false
					}
				}).then(res => {
					if (!res) return;
					this.message = this.message.map(item => {
						const mini = res.find(data => data.classification == item.title)
						const notice = mini ? {
							...item,
							...mini,
							title: item.title
						} : {
							...item,
							created: '',
							content: '暂无消息',
							unReadCount: 0
						}
						return notice;
					})
				})
			},
			toNotice(item) {
				this.toPage(`/pages-common/notice/notice?title=${item.title || "通知消息"}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	page {
		background-color: #fff;
	}

	.marginview {
		height: calc(280rpx);
	}

	.top-tabs {
		position: fixed;
		top: calc(var(--status-bar-height) + 88rpx);
		width: 100%;
		z-index: 9999;
	}

	.nav-bar {
		@include nav-bar-title(#000000)
	}

	.edget {
		width: 28rpx;
		height: 28rpx;
		border-radius: 14rpx;
		color: #fff;
		text-align: center;
		line-height: 28rpx;
		font-size: 12rpx;
		opacity: 0.9;
		position: absolute;
		right: -10rpx;
		top: 10rpx;
		background: #FF5B05;
		z-index: 100;

		.number {
			color: #fff;
			font-size: 14rpx;
			font-weight: 600;
		}
	}

	.swiper {
		min-height: 80vh;
		background-color: #F7F7F7;
	}

	.search_content {
		background-color: #fff;
		padding: 15rpx 30rpx 20rpx 30rpx;
		// box-shadow: 5rpx 5rpx 10rpx 0 #e6e6e6;
		margin-bottom: 15rpx;
		border-radius: 0rpx 0rpx $mainBorderRadius $mainBorderRadius;
	}

	.icon_setUp {
		padding-right: 36rpx;
	}

	.list {
		margin-top: 15rpx;
	}
</style>
