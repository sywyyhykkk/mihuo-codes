<template>
	<view class="container">

	</view>
</template>

<script>
	import tabInit from '@/plugins/im/tabInit.js';
	import {
		tabSqls
	}
	from '@/plugins/im/tabSqls.js';
	import $imHttp from '@/config/imRequest.js';
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
				dataList: [],
				checkedList: [],
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
				swiperCurrent: 0 // swiper组件的current值，表示当前那个swiper-item是活动的
			}
		},
		onLoad() {
			this.getDataList();
		},
		methods: {
			onreachBottom() {

			},
			onSubmit() {
				let imUserInfo = uni.getStorageSync('imUserInfo');
				let userIds = [];
				this.dataList.forEach(item => {
					if (item.selected) {
						userIds.push(item.imId);
					}
				});
				userIds.push(imUserInfo.imId);
				let data = {
					"name": this.$store.state.userInfo.sysUser ? this.$store.state.userInfo.sysUser.username + '的群聊' :
						'群聊',
					"userIds": userIds,
					"isConfirm": false,
					"customField": ""
				};
				$imHttp.post('/api/Group/Create', data).then(res => {
					//创建群聊的会话
					const sessionData = {
						"SessionId": 0,
						"UserId": parseInt(imUserInfo.imId),
						"TargetId": res.groupId,
						"TargetName": res.name,
						"TargetAvatarFileId": res.avatarFileId,
						"Type": 2,
						"LastTime": res.createTime,
						"LastContent": "群组已创建",
						"UnreadCount": 0,
						"IsTopMost": 0,
						"ChangeTime": res.changeTime
					};
					tabInit.updateData(tabSqls.SessionList, sessionData);
				})
			},
			// 获取通讯录列表
			getDataList() {
				let url = this.swiperCurrent == 0 ? 'admin/user/contactpage?blackFlag=0' : this.swiperCurrent == 1 ?
					'admin/user/page' : 'admin/user/contactpage?blackFlag=1';
				this.$http.get(url).then(res => {
					this.dataList = res.records.map(item => ({
						...item,
						selected: false
					}));
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.search_content {
		background-color: #fff;
		padding: 30rpx 28rpx 30rpx 28rpx;
		box-shadow: 5rpx 5rpx 10rpx 0 #e6e6e6;
		border-radius: 0rpx 0rpx $mainBorderRadius $mainBorderRadius;
	}

	.buttonContent {
		height: 100rpx;
		margin: 0 30rpx;
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
		height: calc(100vh - 480rpx);
		margin-top: 20rpx;

		.item {
			width: 100vw;
			padding: 20rpx;
			box-sizing: border-box;
			align-items: center;
			background-color: #fff;
			border-bottom: 1rpx solid #f5f5f5;

			.cover {
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
				box-sizing: border-box;
				border: 2rpx solid #f9f9f9;
				margin: 5rpx 10rpx 0 0;
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
				width: calc(100vw - 200rpx);
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
</style>
