<template>
	<view class="container">
		<z-nav-bar title="通讯录">
			<view class="icon_setUp" slot="right" @click="isMenuOpen=!isMenuOpen">
				<image style="height: 50rpx;width: 50rpx;" src="https://www.51mihuo.com@/pages-message/static/images/add_contancts.png"></image>
			</view>
		</z-nav-bar>
		<u-mask :show="isMenuOpen" @click="isMenuOpen = false" :duration="0" :zoom="false">
			<view class="dropdown-warp dropdown-warp-tip">
				<view class="content" @tap.stop>
					<view class="button">
						<image src="https://www.51mihuo.com@/pages-message/static/icon/add_friend.png" class="icon"></image>
						<text class="text">添加工友</text>
					</view>

					<view class="button" @click="goToCreateGroup">
						<image src="https://www.51mihuo.com@/pages-message/static/icon/create_chat.png" class="icon"></image>
						<text class="text">创建群聊</text>
					</view>
				</view>
			</view>
		</u-mask>

		<view class="search_content">
			<u-search v-model="keyword" :show-action="false"></u-search>
			<u-tabs-swiper style="padding-top: 20rpx;" active-color='#FF5D35' ref="uTabs" :list="list"
				:current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		</view>
		<!--容器-->
		<swiper class="listContent" :current="swiperCurrent" @transition="transition"
			@animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<list v-if='contactList.length' scroll-y class="list" @scrolltolower="onreachBottom">
					<view class="item flex-row" @tap="toDetail(item)" v-for="item in contactList" :key='item.userId'>
						<view class="cover flex-row flex-column">
							<u-avatar src="https://img2.baidu.com/it/u=1057544708,3299220796&fm=26&fmt=auto&gp=0.jpg"
								mode="circle"></u-avatar>
						</view>
						<view class="title">
							<view class="main flex-row">
								<!--判断是群聊还是单聊-->
								<text class="text">{{item.userName || item.username}}</text>

							</view>
							<view class="sub text-ellipsis">水电工</view>
						</view>
						<view class="cover flex-row flex-column button-content" @click.stop="()=>setFriend(item)">
							<image style="width: 9rpx;height: 35rpx;" src='https://www.51mihuo.com@/pages-message/static/images/active_Shape.png' />
						</view>
					</view>
				</list>
				<message-mh-empty v-else title="您还没有联系人,去添加吧～" />
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view v-if='workerList.length' scroll-y class="list" @scrolltolower="onreachBottom">
					<view class="item flex-row" @tap="toDetail(item)" v-for="item in workerList" :key='item.userId'>
						<view class="cover flex-row flex-column">
							<u-avatar src="https://img2.baidu.com/it/u=1057544708,3299220796&fm=26&fmt=auto&gp=0.jpg"
								mode="circle"></u-avatar>
						</view>
						<view class="title">
							<view class="main flex-row">
								<!--判断是群聊还是单聊-->
								<text class="text">{{item.userName || item.username}}</text>

							</view>
							<view class="sub text-ellipsis">水电工</view>
						</view>

						<view class="cover flex-row flex-column button-content"><button
								@click.stop="()=>addFriend(item.userId)">添加</button></view>
					</view>
				</scroll-view>
				<message-mh-empty v-else title="您还没有联系人,去添加吧～" />
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view v-if='blockList.length' scroll-y class="list" @scrolltolower="onreachBottom">
					<view class="item flex-row" @tap="toDetail(item)" v-for="item in blockList" :key='item.userId'>
						<view class="cover flex-row flex-column">
							<u-avatar src="https://img2.baidu.com/it/u=1057544708,3299220796&fm=26&fmt=auto&gp=0.jpg"
								mode="circle"></u-avatar>
						</view>
						<view class="title">
							<view class="main flex-row">
								<!--判断是群聊还是单聊-->
								<text class="text">{{item.userName || item.username}}</text>

							</view>
							<view class="sub text-ellipsis">水电工</view>
						</view>
						<view class="cover flex-row flex-column button-content"><button
								@click.stop="()=>removeBloack(item.userId)">解除</button></view>

					</view>
				</scroll-view>
				<message-mh-empty v-else title="您还没有联系人,去添加吧～" />
			</swiper-item>
		</swiper>

		<!--添加好友-->
		<u-popup v-model="setShow" :custom-style="popupStyle" mode="bottom" border-radius="30">
			<view class="titleContent">
				<text class="name">{{waitUser.phone}}</text>
				<view class="close" @click="setShow=!setShow">
					<u-image width="60rpx" height="60rpx" src="https://www.51mihuo.com@/pages-message/static/images/close_icon.png"></u-image>
				</view>
			</view>
			<view class="actionContent">
				<u-row gutter="1" item="center" justify="center">
					<u-col span="4" @click="resolveFriend(0)">
						<view style="text-align: center;">
							<u-image width="96rpx" height="96rpx" class="icon"
								src='https://www.51mihuo.com@/pages-message/static/images/delete_contans.png'>
							</u-image>
							<view>
								<text class="text">删除</text>
							</view>
						</view>
					</u-col>
					<u-col span="3" @click="resolveFriend(1)">
						<view style="text-align: center;">
							<u-image width="96rpx" height="96rpx" class="icon"
								src='https://www.51mihuo.com@/pages-message/static/images/block_contans.png'></u-image>
							<view>
								<text class="text">拉黑</text>
							</view>
						</view>
					</u-col>
					<u-col span="4" @click="resolveFriend(2)">
						<view style="text-align: center;">
							<u-image width="96rpx" height="96rpx" class="icon" src='https://www.51mihuo.com@/pages-message/static/images/follow.png'>
							</u-image>
							<view>
								<text class="text">设为特别关心</text>
							</view>
						</view>
					</u-col>
				</u-row>
			</view>
		</u-popup>
		<!--添加和建群-->

	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				popupStyle: {

				},
				moreShow: false,
				setShow: false,
				posRight: '15px',
				contactList: [],
				workerList: [],
				blockList: [],
				waitUser: {},
				keyword: '',
				telephone: '',
				tabs: [1, 2, 3],
				list: [{
					name: '通讯录'
				}, {
					name: '推荐工友'
				}, {
					name: '黑名单'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				isMenuOpen: false, // 控制右上角菜单显示或隐藏
			}
		},
		onLoad() {
			// #ifdef MP
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.posRight = (menuButtonInfo.width + 20) + 'px'
			// #endif
			this.getContactList();
			this.getWorkertList();
			this.getBlockList();
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			goToCreateGroup() {
				this.isMenuOpen = false;
				this.toPage('/pages-message/group/create');
			},
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				if (this.current == current) return;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				//this.getDataList();
			},
			// scroll-view到底部加载更多
			onreachBottom() {

			},
			// 取消添加
			cancelAdd() {

			},
			//好友设置
			setFriend(user) {
				this.setShow = true;
				this.waitUser = user;
			},
			// 添加好友
			addFriend(userid) {
				console.log('-----------', userid)
				this.$http.get(`admin/user/contact/${userid}`).then(res => {
					this.$util.toast('添加成功');
					this.dataList.splice(this.dataList.findIndex(item => item.userId == userid), 1);
				})
			},
			removeBloack(userid) {
				this.$http.get(`admin/user/removeblack/${userid}`).then(res => {
					this.$util.toast('解除成功');
					this.dataList.splice(this.dataList.findIndex(item => item.userId == userid), 1);
				})
			},
			//好友处理
			resolveFriend(type) {
				let data = this.waitUser;
				let url = type ? type == 1 ? `admin/user/black/${data.userId}` : `admin/user/focus/${data.userId}` :
					`admin/user/removecontact/${data.userId}`;
				this.$http.get(url).then(res => {
					this.setShow = false;
					let text = type ? type == 1 ? '拉黑成功' : '设置成功' : '移除成功';
					this.$util.toast(text);
					type != 2 && this.dataList.splice(this.dataList.findIndex(item => item.userId == data.userId),
						1);
				})
			},
			addFriendAction() {
				if (!this.$validate.isPhone(this.telephone)) {
					return this.$util.toast('手机号格式错误')
				}
				this.$util.loading('添加中')
				uni.request({
					method: 'POST',
					url: this.$api.addFriend,
					data: {
						userId: uni.getStorageSync('userId'),
						telephone: this.telephone
					},
					header: this.$util.getHeader(),
					success: res => {
						uni.hideLoading()
						if (res.data.code) {
							return this.$util.toast(res.data.msg)
						}
						this.$refs.addFriend.close()
						this.telephone = ''
						this.getList()
					},
					fail: err => {
						uni.hideLoading()
						this.$util.toast('添加失败')
					}
				})
			},
			// 详情
			toDetail(item) {
				if (!item.imId) {
					uni.showToast({
						title: '他暂时还不能进行聊天',
						icon: 'none'
					})
					return;
				}
				let {
					imId,
					userName
				} = item;
				this.$store.commit('WEBSOCKET_NORMAL', {
					targetId: imId
				});
				this.toPage('/pages-message/chat/index?toUserId=' + imId + '&toUserName=' + userName)
			},
			// 获取通讯录列表
			getContactList() {
				let url = 'admin/user/contactpage?blackFlag=0';
				this.$http.get(url).then(res => {
					this.contactList = res.records;
				})
			},
			//推荐工友
			getWorkertList() {
				let url = 'admin/user/page'
				this.$http.get(url).then(res => {
					this.workerList = res.records;
				})
			},
			//黑名单
			getBlockList() {
				let url = 'admin/user/contactpage?blackFlag=1';
				this.$http.get(url).then(res => {
					this.blockList = res.records;
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
    page{
		background-color: #000000;
	}
	.search_content {
		background-color: #fff;
		padding: 30rpx 28rpx 20rpx 28rpx;
		box-shadow: 5rpx 5rpx 10rpx 0 #e6e6e6;
		border-radius: 0rpx 0rpx $mainBorderRadius $mainBorderRadius;
	}

	.titleContent {
		margin: 40rpx 40rpx 20rpx 40rpx;
		display: flex;

		.name {
			font-size: 40rpx;
			color: #303133;
			flex: 1;
			font-weight: 600;
		}

		.close {

			text-align: right;
		}
	}

	.actionContent {
		margin-bottom: 20rpx;

		.icon {
			width: 96rpx;
			height: 96rpx;
			margin: 20rpx auto;
		}

		.text {
			color: #5F686F;
			font-size: 28rpx;
		}
	}

	.icon_setUp {
		padding-right: 36rpx;
	}

	.swiper-item {
		background-color: #f5f5f5;
		margin-top: 20rpx;
	}

	.listContent {
		height: calc(100vh - 390rpx);
	}

	.list {
		height: calc(100vh - 390rpx);

		.item {
			width: 100vw;
			padding: 20rpx;
			box-sizing: border-box;
			align-items: flex-start;
			background-color: #fff;
			border-bottom: 1rpx solid #f5f5f5;

			.cover {
				width: 100rpx;
				height: 100rpx;
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
				width: calc(100vw - 130rpx - 150rpx);
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
			}
		}

		.button-content button {
			background-color: rgba(255, 63, 64, 0.15);
			color: $themeColor;
			font-size: 28rpx;
			line-height: 64rpx;
			width: 100rpx;
			border-radius: 10rpx;
		}
	}

	.badge {
		background: #f46f4d;
	}

	.use-user {
		background: #4d9ff3;
		color: #fff;
		box-shadow: 0px 0px 10px 1px #4d9ff3;
	}

	.im-chat-item {
		background-color: #f5f5f5;
		border-radius: 14rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		position: relative;
		overflow: hidden;

		.istop {
			background-color: #4d9ff3;
			border-radius: 100%;
			position: absolute;
			top: -20rpx;
			left: -20rpx;
			width: 60rpx;
			height: 60rpx;

			.iconfont {
				color: #fff;
				font-size: 10px;
				position: absolute;
				right: 12rpx;
				bottom: 6rpx;
			}
		}

		.headimg {
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
		}

		text {
			font-size: 24rpx;
			color: #c0c0c0;
		}
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	}

	.dropdown-warp {
		position: absolute;
		right: 20rpx;
		top: 160rpx;
		margin-top: 20rpx;
		background-color: #fff;
		color: transparent;
		border-radius: 10rpx;

		.content {
			width: 256rpx;
			height: 216rpx;
			background-color: #fff;
			border-radius: 10rpx;
		}

		&:after {
			content: '';
			position: absolute;
			width: 0;
			height: 0;
			border: 12rpx solid;
		}

		.button {
			width: 100%;
			height: 108rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #303133;

			.text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 40rpx;
			}
		}

		.icon {
			width: 40rpx;
			height: 32rpx;
			margin-right: 20rpx;
		}
	}

	.dropdown-warp-tip:after {
		border-bottom-color: #fff;
		right: 32rpx;
		bottom: 100%;
	}
</style>
