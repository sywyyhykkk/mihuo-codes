<template>
	<view class="container">
		<view class='top-tabs' id="tabs">
			<message-tabs :items="items" :current="current" @clickItem="onClickItem" ref="mytabs"></message-tabs>
			<view v-if="current === 0" class="search_content" @tap="search">
				<simulation-search-box />
			</view>
		</view>
		<view v-if="current === 0" :style="{ height: marginHeight + 'px' }"></view>
		<view v-else :style="{ height: marginHeight - 60 + 'px' }"></view>
		<!-- <mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="current === 0 ? '200' : '100'" :topbar="true"
			:down="downOption" :up="upOption" @down="downCallback" @up="upCallback"> -->
		<swiper class="swiper" :style="{ height: swiperHeight + 80 + 'px' }" duration="200" :current="current"
			@change="swiperChange" :disable-touch="true">
			<swiper-item>
				<!--容器-->
				<view scroll-y class="list" id="content-wrap0">
					<view v-if='list && list.length'>
						<uni-swipe-action>
							<uni-swipe-action-item v-for="(item, index) in list" :key="item.TargetId"
								@click="optionsActive($event,index)" @change="swipeChange($event,index)"
								:right-options="item.IsTopMost == 1 || item.IsTopMost =='true'?optionsTop:options">
								<view v-if="item.TargetId">
									<session-item :sessionData="item" :key="item.TargetId"
										@click.native.stop="toDetail(item)" />
									</session-item>
								</view>
							</uni-swipe-action-item>
							<view style="height: 120rpx;"></view>
						</uni-swipe-action>
					</view>
					<mh-empty v-else title="暂无消息记录" />
				</view>
			</swiper-item>
			<swiper-item>
				<view scroll-y class="list" id="content-wrap0" style="margin-top: -10rpx;">
					<view v-if='message.length' class="" id="content-wrap1">
						<view v-for="item in message" :key="message.id">
							<session-item :notice="true" :sessionData="item" @click.native.top="toNotice(item)">
								<view v-if="item.unreadMessage" slot="edget" class="edget">
									<text class="number">{{item.unreadMessage}}</text>
								</view>
							</session-item>
						</view>
					</view>
					<mh-empty v-else title="暂无通知记录" />
				</view>
			</swiper-item>
		</swiper>
		<!-- </mescroll-uni> -->
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
				message: [{
						icon: '/static/icon/message/notice.png',
						title: '系统通知',
						content: '暂无消息',
					}, {
						icon: '/static/icon/message/material.png',
						title: '主辅材料',
						content: '暂无消息',
					}, {
						icon: '/static/icon/message/measure.png',
						title: '定制测量',
						content: '暂无消息',
					}, {
						icon: '/static/icon/message/dispatcher.png',
						title: '人员调度',
						content: '暂无消息',
					}, {
						icon: '/static/icon/message/quality.png',
						title: '质量品控',
						content: '暂无消息',
					}, {
						icon: '/static/icon/message/construction.png',
						title: '施工执行',
						content: '暂无消息',
					},
					{
						icon: '/static/icon/message/other.png',
						title: '其他',
						content: '暂无消息',
					}
				],
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
			this.$store.commit('WEBSOCKET_CHATCLEAR')
			//tabInit.init()
		},
		onLoad() {
			this.messageInit();
		},
		onReady() {
			setTimeout(() => {
				this.messageInit();
			}, 100)

		},
		computed: {
			list() {
				const {
					messageSessionList
				} = this.$store.state;
				if (!uni.getStorageSync('userInfo')) {
					uni.navigateTo({
						url: '/pages/univerifyLogin/univerifyLogin'
					});
					return [];
				}
				return messageSessionList;
			},
			items() {
				const {
					messageSessionList
				} = this.$store.state;
				let unread = 0;
				messageSessionList && messageSessionList.forEach(item => {
					unread += item.UnreadCount;
				})
				let notice = 0;
				this.message.forEach(item => {
					notice += item.unreadMessage || 0
				})
				this.setTabBarBadgeNotice()
				return [`消息(${unread})`, `通知(${notice})`];
			}
		},
		methods: {
			swipeChange(e, index) {
				if (e == "none") {
					setTimeout(() => {
						this.openAction = e;
					}, 500)
					return;
				}
				this.openAction = e;
			},
			messageInit() {
				this.$nextTick(() => {
					let element = "#tabs";
					let query = uni.createSelectorQuery().in(this);
					query.select(element).boundingClientRect();
					query.exec((res) => {
						if (res && res[0]) {
							this.marginHeight = res[0].height;
						}
					});
					this.setSwiperHeight();
				});
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			downCallback() {
				setTimeout(() => {
					this.messageInit();
					this.mescroll.endBySize(10, true);
				}, 1000);
			},
			upCallback() {},
			search() {
				uni.navigateTo({
					url: '/pages/sessionSearchPage/sessionSearchPage'
				});
			},
			toContancts() {
				uni.navigateTo({
					url: '/pages/contacts/index'
				})
			},
			optionsActive(data, dataIndex) {
				let {
					index,
					content
				} = data;
				if (content.text == "取消置顶") {
					this.$store.commit('WEBSOCKET_CANCELTOPSESSIONLIST', this.$store.state.messageSessionList[dataIndex]);
					return;
				}
				if (index == 1) {
					// 删除会话
					this.$store.commit('WEBSOCKET_DELETESESSIONLIST', this.$store.state.messageSessionList[dataIndex]);
				} else {
					// 置顶
					this.$store.commit('WEBSOCKET_SETTOPSESSIONLIST', this.$store.state.messageSessionList[dataIndex]);
				}
				return;
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
							unreadMessage: 0
						}
						return notice;
					})
				})
			},
			toNotice(item) {
				this.toPage(`/pages/notice/notice?title=${item.title || "通知消息"}`)
			},
			// 详情
			toDetail(item) {
				//因为渲染机制的原因这里的会话会有bug
				if (this.openAction && this.openAction != "none") {
					return;
				}
				this.openAction = ''
				// 判断是群聊还是单聊
				if (item.Type == 2) {
					// 群聊
					let {
						TargetId,
						TargetName
					} = item;
					this.$store.commit('WEBSOCKET_GROUP', {
						TargetId
					});
					this.toPage('/pages/message/group/index?toUserId=' + TargetId + '&toUserName=' + TargetName)
				} else {
					// 单聊
					let {
						TargetId,
						TargetName
					} = item
					this.$store.commit('WEBSOCKET_NORMAL', {
						TargetId
					});
					this.toPage('/pages/message/chat/index?toUserId=' + TargetId + '&toUserName=' + TargetName)
				}
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
				this.$nextTick(() => {
					this.setSwiperHeight();
				});
			},
			swiperChange(c, s) {
				if (this.current !== c.target.current) {
					this.current = c.target.current;
				}
				this.$nextTick(() => {
					this.setSwiperHeight();
				});
			},
			setSwiperHeight() {
				let element = "#content-wrap" + this.current;
				let query = uni.createSelectorQuery().in(this);
				query.select(element).boundingClientRect();
				query.exec((res) => {
					if (res && res[0]) {
						this.swiperHeight = res[0].height - this.marginHeight;
					}
				});
			},
			// 设置角标
			setTabBarBadgeNotice() {
				let notice = 0
				// 未读消息
				this.list.forEach(item => {
					notice += item.UnreadCount || 0
				})
				// 未读通知
				this.message.forEach(item => {
					notice += item.unreadMessage || 0
				})
				// #ifdef APP-PLUS
				plus.runtime.setBadgeNumber(+notice)
				// #endif
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
						index: 2,
						text: notice
					})
				} else {
					uni.removeTabBarBadge({
						index: 2
					})
				}
			}
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
		top: 0;
		width: 100%;
		z-index: 9999;
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
	}

	.search_content {
		background-color: #fff;
		padding: 15rpx 0 20rpx 0;
		box-shadow: 5rpx 5rpx 10rpx 0 #e6e6e6;
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
