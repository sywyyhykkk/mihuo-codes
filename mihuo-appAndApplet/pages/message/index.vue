<template>
	<view class="container">
		<z-nav-bar backState="2000">
			<view slot="default" class="nav-bar">
				消息
			</view>
		</z-nav-bar>
		<scroll-view scroll-y id="content-wrap0">
			<view id="content-wrap1">
				<view>
					<session-item v-if="systemNotice" :notice="true" :sessionData="systemNotice" :border="false"
						@click.native.top="toNotice(systemNotice)">
						<view v-if="systemNotice.unReadCount" slot="edget" class="edget">
							<text class="number">{{systemNotice.unReadCount}}</text>
						</view>
					</session-item>
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y id="content-wrap0" style="margin-top: 15rpx;">
			<view v-if='list && list.length' style="border-top: 20rpx #F7F7F7 solid;">
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item, index) in list" :key="item.TargetId"
						@click="optionsActive($event,index)" @change="swipeChange($event,index)"
						:right-options="item.IsTopMost == 1 || item.IsTopMost =='true' ? optionsTop : options">
						<view>
							<session-item :sessionData="item" @click.native.stop="toDetail(item)" />
						</view>
						</session-item>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
			<mh-empty v-else title="暂无消息记录" />
		</scroll-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				loginTime: 0,
				skillNameList: [], // 会话列表用户工种信息
				systemNotice: {
					icon: '/static/images/notice_system.png',
					title: '系统通知',
					content: '暂无新消息',
				}, // 系统通知
				serviceNotice: {
					icon: 'https://www.51mihuo.com/static/images/notice_service.png',
					title: '服务通知',
					content: '暂无新消息',
					unReadCount: 0,
					notices: []
				}, // 服务通知
				message: [{
						icon: 'https://www.51mihuo.com/static/images/notice_system.png',
						title: '系统通知',
						content: '暂无消息',
					},
					{
						icon: 'https://www.51mihuo.com/static/images/notice_service.png',
						title: '服务通知',
						content: '暂无消息',
					},
				], // 系统通知
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
			}
		},
		onShow() {
			this.getNotice();
			// #ifdef MP-WEIXIN
			const imUserInfo = uni.getStorageSync('imUserInfo')
			this.$store.commit('WEBSOCKET_INIT', imUserInfo)
			// #endif
			this.$store.commit('WEBSOCKET_CHATCLEAR')
			this.getMessageUserSkill()
		},
		onLoad() {},
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
			}
		},
		onTabItemTap(event) {
			const {
				index,
				pagePath
			} = event
			if (index > 1) {
				if (!uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					uni.setStorageSync('navigatePage', '/' + pagePath)
				}
			}
		},
		methods: {
			// 获取会话列表用户工种信息
			getMessageUserSkill() {
				if (this.list.length == 0) return
				const data = []
				this.list.forEach(item => {
					if (item.Type == 1) {
						data.push(item.TargetId)
					}
				})
				this.$httpApi.getIMPersonsByIMIds(data, {
					header: {
						isShowMessage: false,
						hideLoading: true
					}
				}).then(res => {
					if (res) {
						this.skillNameList = res
						this.$store.commit('SESSION_LIST_SKILLS', res)
					}
				})
			},
			swipeChange(e, index) {
				if (e == "none") {
					setTimeout(() => {
						this.openAction = e;
					}, 500)
					return;
				}
				this.openAction = e;
			},
			search() {
				uni.navigateTo({
					url: '/pages-common/sessionSearchPage/sessionSearchPage'
				});
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
				this.$http.get('basic/notification/group/info', {}, {
					header: {
						isShowMessage: false
					}
				}).then(res => {
					if (!res || !res.length) {
						this.systemNotice = {
							title: "系统通知",
							unReadCount: 0,
							created: '',
							content: '暂无新通知消息',
							icon: 'https://www.51mihuo.com/static/images/notice_system.png'
						}
						this.setTabBarBadgeNotice();
						return;
					};
					let unread = 0
					this.message = res
					this.serviceNotice = []
					res.forEach(item => {
						if (item.group == "SYS") {
							this.systemNotice = {
								...item,
								title: "系统通知" || item.lastNotification.title,
								unReadCount: item.unReadCount,
								created: item.lastNotification ? item.lastNotification.created : '',
								content: item.lastNotification ? item.lastNotification.content : '',
								icon: 'https://www.51mihuo.com/static/images/notice_system.png'
							}
						}
					})
					this.setTabBarBadgeNotice()
				})
			},
			toNotice(item) {
				if (item.title === '服务通知') {
					this.toPage('/pages-message/serviceNotice/serviceNotice')
				} else {
					this.toPage(`/pages-common/notice/notice?title=${item.title || "通知消息"}&group=SYS`)
				}
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
					this.toPage('/pages-message/group/index?toUserId=' + TargetId + '&toUserName=' + TargetName)
				} else {
					// 单聊
					let {
						TargetId,
						TargetName
					} = item
					this.$store.commit('WEBSOCKET_NORMAL', {
						TargetId
					});
					this.toPage('/pages-message/chat/index?toUserId=' + TargetId + '&toUserName=' + TargetName)
				}
			},
			// 设置角标
			setTabBarBadgeNotice() {
				let notice = 0
				// 未读消息
				this.list.forEach(item => {
					notice += (item.UnreadCount || 0);
				})
				// 未读通知
				this.message.forEach(item => {
					notice += (item.unReadCount || 0);
				})
				if (notice > 0) {
					this.$util.setNotice('update', notice)
				} else {
					uni.removeTabBarBadge({
						index: 3
					})
					this.$util.setNotice('update', 0)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.container {
		background-color: #F7F7F7;
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
		z-index: 9;

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
		margin-bottom: 15rpx;
		border-radius: 0rpx 0rpx $mainBorderRadius $mainBorderRadius;
	}

	.icon_setUp {
		padding-right: 36rpx;
	}
</style>
