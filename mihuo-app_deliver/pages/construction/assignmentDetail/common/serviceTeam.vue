<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar-title"> 服务团队 </view>
		</z-nav-bar>
		<!-- 	<view class="bottom-container">
			<view class="title flex-center">
				<view class="left">
					未派工人
				</view>
				<view class="right flex-center">
					<image src="/static/icon/assignment_detail/add.png" class="icon"></image>
					自定义角色
				</view>
			</view>
			<view class="item flex-center">
				<view class="left">
					<text>01.</text>泥工
				</view>
				<view class="right">
					去派工
				</view>
			</view>
			<view class="border"></view>
			<view class="item flex-center">
				<view class="left">
					<text>01.</text>泥工
				</view>
				<view class="right">
					去派工
				</view>
			</view>
		</view> -->
		<view class="list-item" v-for="(item,index) in personList" :key="index">
			<view class="worker-person">
				<image src="../../../../static/icon/Group8813.png" class="title-image"></image>
				<view class="worker-title">{{ item.skillName }}
				</view>
			</view>
			<view class="main-container" style="margin-left: 0rpx">
				<view class="item flex-center item-border" @click="goDetial" v-for="(el,num) in item.members"
					:key="num">
					<view class="left flex-center">
						<view class="info-photo">
							<u-avatar size="96" v-if="el.userId" :src="avatarImage(el.userId)" />
							<view class="photo-text"> 已指派 </view>
						</view>
						<view class="info flex-center">
							<view class="upper">
								<text class="name">{{ el.name }}</text>
								<text class="skill-name" v-if="item.skillName == '工人' ">{{ el.skillName }}</text>
							</view>
							<!-- <view class="lower">
								应结工费 260
							</view> -->
						</view>
					</view>
					<view class="right flex-center">
						<image src="../../../../static/icon/tel.png" class="icon" @click.stop="callPerson(el.phone)">
						</image>
						<image src="../../../../static/icon/chat.png" class="icon" @click.stop="goChat(el)"></image>
						<image src="../../../../static/icon/del.png" class="icon" @click.stop="delPerson(el.personId)"
							v-if="userPersonInfo.jobCode=='JOB_MANAGER'&&userPersonInfo.skillId=='1'&&
							el.personId!=userPersonInfo.personId"
						>
						</image>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="show" :title="title" :content="content" :showCancelButton="true" @confirm="termination" />
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				show: false,
				title: '终止服务',
				content: '确认终止和该人员的服务？消息将发送至该人员',
				membersList: [],
				options: [{
					text: '移除',
					color: '#fff',
					style: {
						backgroundColor: '$themeColor'
					}
				}],
				personList: [],
				personType: [{
						type: 'JOB_SUPERVISION',
						name: '项目监理'
					},
					{
						type: 'JOB_DESIGNER',
						name: '设计师'
					},
					{
						type: 'JOB_WORKER',
						name: '工人'
					}
				],
				skillId: '',
				delPersonId: '',
				offerList: '',
				option: {}
			}
		},
		onShow() {
			this.parameterType()
		},
		onLoad(option) {
			this.option = option
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'remainingDays','orderInfo'])
		},
		methods: {
			avatarImage(userId) {
				return this.$util.avatarImage(userId) + '?time=' + new Date().getTime()
			},
			parameterType() {
				if (this.option.type == '服务团队') {
					if (!this.option.noticeType) {
						this.$notificationsJump(this.option)
					}
					this.projectId = this.option.projectId
				} else {
					this.projectId = this.projectInfo.projectId
				}
				this.getData()
			},
			// 服务人员终止服务
			termination() {
				if (!this.projectId) {
					return
				}

				this.$httpApi.terminationService({
					projectId: this.projectId,
					personId: Number(this.delPersonId)
				}).then((res) => {
					if (res) {
						this.getData()
					}
				})
			},
			goChat(item) {
				if (item.userId == this.$store.state.imUserInfo.appUserId.split('_')[1]) {
					this.$util.toast('您不能给自己发送消息')
					return
				}
				this.toPage(
					`/pages/message/chat/index?type=serviceTeam&toUserId=${item.userId}&toUserName=${item.realName || item.name || item.phone}`
				)
			},
			callPerson(phone) {
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例
				})
			},
			goDetial() {
				return
				uni.navigateTo({
					url: '../../workersDetails'
				})
			},

			getData() {
				if (!this.projectId) {
					return
				}

				this.$httpApi.taskMemberList({
					projectId: this.projectId
				}).then((res) => {
					this.personList = res
					this.personType.map(item => {
						for (let key in res) {
							if (item.type === key) {
								item['skillId'] = res[key][0].skillId
								item['companyId'] = res[key][0].companyId
							}
						}
					})
				})
			},
			delPerson(id) {
				this.show = true
				this.delPersonId = id
			},
			optionsActive(e, dataIndex) {
				uni.showModal({
					title: '确认操作',
					content: '确认移除所选成员？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '删除成功!',
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.info-photo {
		position: relative;
		width: 100rpx;
		margin-right: 20rpx;

		.photo-image {
			height: 100rpx;
			width: 100rpx;
			border-radius: 100rpx;
		}

		.photo-text {
			position: absolute;
			z-index: 10;
			left: 0;
			right: 0;
			margin: -32rpx auto;
			width: 100rpx;
			background: #eff6ff;
			border-radius: 4rpx;
			line-height: 34rpx;
			font-size: 20rpx;
			text-align: center;
			color: $themeColor;
		}

		.photo-text2 {
			background: #EEEEEE;
			color: $fontColor33;
		}
	}

	.list-item {
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.worker-person {
		display: flex;
		height: 120rpx;
		align-items: center;

		.title-image {
			width: 44rpx;
			height: 32rpx;
			margin-left: 28rpx;
		}

		.worker-title {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 900;
			font-size: 32rpx;
			color: #333333;
			margin-left: 17rpx;
		}

		.worker-add {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 26rpx;
			text-align: right;
			flex: 1;
			margin-right: 50rpx;
			color: $themeColor;
		}
	}

	.nav-bar-title {
		@include nav-bar-title(black);
	}

	.main-container {
		width: 710rpx;
		height: max-content;
		overflow-y: scroll;
		margin: 12rpx 20rpx 0 20rpx;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 0rpx 40rpx 0 40rpx;

		.item-personnel {
			border-bottom: 2rpx solid #f2f2f2;
		}

		.item-border {
			border-bottom: 2rpx solid #f2f2f2;
		}

		.item {
			width: 100%;
			height: 160rpx;
			padding: 32rpx 0rpx;


			&:last-child {
				// border-bottom: 0;
			}

			.left,
			.right {
				width: 70%;
				height: 100%;

				.info {
					flex: 1;
					flex-direction: column;
					align-items: flex-start;
					margin-left: 20rpx;

					.upper {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 28rpx;
						line-height: 42r;
						color: #333333;
						display: flex;
						flex-direction: column;

						// text {
						// 	margin-left: 20rpx;
						// 	font-family: PingFang SC;
						// 	font-style: normal;
						// 	font-weight: bold;
						// 	font-size: 26rpx;
						// 	line-height: 42rpx;
						// 	color: #5f686f;
						// }
						.name {
							font-family: PingFang SC;
							font-style: normal;
							font-weight: bold;
							font-size: 26rpx;
							line-height: 42rpx;
							color: #5f686f;
							
						}

						.skill-name {
							font-family: PingFang SC;
							font-style: normal;
							font-weight: bold;
							font-size: 26rpx;
							line-height: 42rpx;
							color: $themeColor;
						}
					}

					.lower {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 26rpx;
						line-height: 36rpx;
						color: $themeColor;
						opacity: 0.7;
					}
				}

				.icon {
					width: 48rpx;
					height: 48rpx;
					margin-left: 20rpx;
				}
			}

			.right {
				width: 30%;
				justify-content: flex-end;
			}
		}
	}

	.bottom-container {
		width: 710rpx;
		height: max-content;
		border-radius: 16rpx;
		background-color: #fff;
		margin: 14rpx 20rpx 0 20rpx;
		padding: 28rpx 40rpx;

		.title {
			width: 100%;
			height: 42rpx;
			justify-content: space-between;

			.left,
			.right {
				width: 50%;
				height: 100%;
			}

			.left {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 42rpx;
				color: $seconFontColor;
			}

			.right {
				justify-content: flex-end;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 26rpx;
				line-height: 42rpx;
				color: $themeColor;

				.icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
			}
		}

		.item {
			width: 100%;
			height: 36rpx;
			margin: 40rpx 0;
			padding: 0 10rpx;
			justify-content: space-between;

			.left {
				width: 50%;
				height: 36rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #606166;

				text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 26rpx;
					line-height: 36rpx;
					color: #909199;
					margin-right: 12rpx;
				}
			}

			.right {
				width: 50%;
				height: 36rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 24rpx;
				line-height: 36rpx;
				color: $themeColor;
				text-align: right;
			}
		}

		.border {
			width: 90%;
			margin: 20rpx auto;
			border: 1px dashed #ebebeb;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
