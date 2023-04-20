<template>
	<view class="disclosure-page-all">
		<view class="u-tabs-contain">
			<!-- 	<u-tabs :list="drawingsType" font-size="26" :is-scroll="false" inactive-color="#909199" bar-height="4"
				:current="current" @change="change"></u-tabs> -->
		</view>
		<view class="disclosure-list">
			<view class="item-disclosure" v-for="(item, index) in list" :key="index" @click="getViewDeatils(item)">
				<view class="title">
					<text class="left">{{ projectInfo.poiName }}{{ nodeInfo.nodeName
            }}{{ Number(item.typeFlag) == 1 ? '内容' : '通知' }}</text>
					<view class="right"
						:class="[item.typeFlag === '1' ? 'active-status' : 'notice-status']">{{ item.typeFlag === '1' ? '已交底' : '已通知' }}</view>
				</view>
				<view class="user">
					<u-avatar class="node" size="36" :src="$util.avatarImage(item.execUserId)">
					</u-avatar>
					<view class="user-name">
						<text>{{item.execPersonName}}</text>
						<text>({{item.execSkillName}})</text>
					</view>
					<view class="time">{{item.createTime}}</view>
				</view>
				<view class="content" v-if="item.content">{{item.content}}</view>
			</view>
		</view>
		<mh-empty v-show="list.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				current: 0,
				drawingsType: [{
						name: '全部',
						value: -1
					},
					{
						name: '已通知',
						value: 0
					},
					{
						name: '已交底',
						value: 1
					}
				],
				list: [],
				listUser: [],
				size: 10,
				fileUrl: '',
				status: -1,
				pageCurrent: 1,
				total: 0
			}
		},
		onLoad() {},
		onShow() {
			this.pageCurrent = 1
			this.getList()
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'orderInfo'])
		},
		methods: {
			change(index) {
				this.current = index
				this.status = this.drawingsType[index].value
				this.getList()
			},
			getList() {
				let parameter = {}
				if (this.status === -1) {
					parameter = {
						projectId: this.projectInfo.projectId
					}
				} else {
					parameter = {
						projectId: this.projectInfo.projectId,
						status: this.status
					}
				}
				this.$httpApi.getDiscloseRecordList(parameter).then((res) => {
					if (res) {
						this.list = res
						return
						let tempUser = []
						res.map((item) => {
							tempUser.push(item.execPersonId)
						})
						this.listUser = [...new Set(tempUser)]
						this.list = res
						this.setInitializeUser()
					}
				})
			},
			setInitializeUser() {
				if (this.listUser.length === 0) {
					return
				}
				this.$getPersonIdUser(this.listUser, (res) => {
					this.list.map((el) => {
						res.map((item) => {
							if (Number(el.execPersonId) === Number(item.personId)) {
								el['execPersonIdAll'] = item
							}
						})
					})
					this.$forceUpdate()
				})
			},
			getViewDeatils(item) {
				// 状态 0、已通知 1、已交底
				if (Number(item.typeFlag)) {
					this.toPage(`/pages/construction/disclosure/viewDisclosureText?detailsId=${item.id}&type=编辑`)
				} else {
					this.toPage(
						`/pages/construction/disclosure/viewDisclosureNotice?typeName=查看交底内容`
					)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-tabs-contain {
		box-shadow: 0px 3px 4px rgba(183, 183, 183, 0.25);
	}

	.active-status {
		color: $successNewFontColor;
		background-color: $successNewFontColorBg;
	}

	.notice-status {
		color: $themeColor;
		background-color: $mainFontColorBg;
		white-space: nowrap;
	}
	.disclosure-page-all{
		padding-bottom: 80rpx;
	}

	.disclosure-list {
		padding-top: 16rpx;

		.item-disclosure {
			margin: 0 20rpx;
			padding: 52rpx 36rpx 28rpx 46rpx;
			background-color: $bgColor;
			border-radius: $middleBorderRadius;
			margin-bottom: 6rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.title {
				margin-bottom: 10rpx;
				display: flex;
				justify-content: space-between;

				.left {
					color: $seconFontColor;
					font-size: $middleFontSize;
					padding-right: 10rpx;
					font-weight: bold;
				}

				.right {
					padding: 0rpx 14rpx;
					border-radius: 0px 20rpx 20rpx 20rpx;
					font-size: $smallFontSize;
					height: 40rpx;
					line-height: 40rpx;
				}
			}

			.user {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				.user-name {
					margin-left: 6rpx;
					margin-right: 10rpx;

					text {
						color: $mainFontColor;
						font-size: $smallFontSize;
					}
				}

				.time {
					padding-top: 4rpx;
					color: $mainFontColor;
					font-size: $smallFontSize;
				}
			}

			.content {
				color: $mainFontColor;
				font-size: $smiddleFontSize;
			}
		}
	}
</style>
