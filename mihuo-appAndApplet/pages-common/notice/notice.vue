<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar">
				消息通知
			</view>
			<view slot="right" class="nav-bar-right" @click="readAllMessage">
				全部已读
			</view>
		</z-nav-bar>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" top="88" :down="downOption" :up="upOption"
			@down="downCallback" @up="upCallback">
			<scroll-view scroll-y class="list" v-if="list.length != 0">
				<view v-for="item in list" :key="item.id" class="notice-content" @click="toDetail(item)">
					<view>
						<view v-if="!item.readFlag" class="node"></view>
						<view class="title">
							{{ item.title }}
						</view>
						<image @click.stop="()=>deleteNotice(item)" class="delete"
							src="@/pages-common/static/images/notice_delete.png" />
					</view>
					<view class="date-content">
						{{ getNoticeDate(item.created) }}
					</view>
					<view style="margin-top: 14rpx;"><text class="content">{{item.content}}</text></view>
				</view>
			</scroll-view>
			<mh-empty v-else title="暂时还没有任何系统通知～"></mh-empty>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		getShowDate,
		getNoticeDate
	} from '@/static/js/chat.js';
	export default {
		data() {
			return {
				downOption: {
					auto: false,
					page: {
						num: 1,
						size: 20 // 每页数据的数量,默认10
					}
				},
				upOption: {
					auto: true,
					page: {
						num: 1,
						size: 30 // 每页数据的数量,默认10
					},
					empty: {
						use: false, // 是否显示空布局
					},
					toTop: {
						src: ''
					},
					onScroll: true,
					textNoMore: ''
				},
				mescroll: null,
				title: '系统通知',
				list: [],
			}
		},
		onHide() {
			uni.$off('updateNotice');
		},
		onLoad(option) {
			this.title = option.title;
			this.group = option.group
			uni.$on('updateNotice', (data) => {
				const findIndex = this.list.findIndex(item => item.id == data.id);
				const find = this.list.find(item => item.id == data.id);
				if (this.list[findIndex]) {
					this.list[findIndex].readFlag = 1
				};
			})
		},
		methods: {
			toDetail(item) {
				item.readFlag = true;
				if (!item.paramJson) return;
				const navUrl = JSON.parse(item.paramJson)
				switch (item.type) {
					case "ORDER_HANDLE":
						this.toPage('/pages-order/callOrderDetails?id='+navUrl.orderId+'&noticeId='+item.id)
						break;
					case "OMS_ORDER_HANDLE":
						this.toPage(
							'/pages-order/payOrderDetails?id=' +
							navUrl.omsOrderId+'&noticeId='+item.id);
						break;
					case "NODE_REVIEW":
						this.goToNodeReview(navUrl, item.id);
						break;
					case "IM":
						let messageBody = navUrl.MessageBody;
						this.goToIm(messageBody)
						break;
					case "DISCLOSE_TODO":
						this.toPage(`/pages-myHome/giveNotice?projectId=${navUrl.projectId}`)
						break;
					case "ALTERATION":
						this.toPage(`/pages-myHome/changeRecordPage?businessCodeId=${navUrl.alterationId}`)
						break;
					default:
						return ''
				}

			},
			//消息通知跳转im
			goToIm(payload) {
				if (payload.groupId) {
					let groupId = payload.groupId
					let sourceName = payload.sourceName
					this.$store.commit('WEBSOCKET_GROUP', {
						TargetId: groupId
					})
					this.toPage(
						'/pages-message/group/index?toUserId=' +
						groupId +
						'&toUserName=' +
						sourceName
					)
					return
				}
				if (payload.sourceId) {
					let sourceId = payload.sourceId
					let sourceName = payload.sourceName

					this.$store.commit('WEBSOCKET_NORMAL', {
						TargetId: sourceId
					})
					this.toPage(
						'/pages-message/chat/index?toUserId=' +
						sourceId +
						'&toUserName=' +
						sourceName
					)
					return
				}
			},
			goToNodeReview(data, noticeId) {
				switch (data.nodeType) {
					case "1000": //无类型
						this.toPage(
							`/pages-myHome/otherForm/otherForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break;
					case "1002": //派单
						this.toPage(
							`/pages-myHome/distributeForm/distributeForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break;
					case "1003": //预算
						this.toPage(
							`/pages-myHome/estimated-cost?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break;
					case "1004": //施工
						this.toPage(
							`/pages-myHome/reviewNode/constructionCheck?nodeId=${data.nodeId}&reviewId=${data.reviewId}&noticeId=${noticeId}`
						)
						break;
					case "1005": //验收
						this.toPage(
							`/pages-myHome/reviewNode/checkReport?nodeId=${data.nodeId}&reviewId=${data.reviewId}&noticeId=${noticeId}&isDo=${true}`
						)
						break;
					case "1006": //上传
						this.toPage(
							`/pages-myHome/houseUploadView?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break;
					case "1010": //交底
						this.toPage(
							`/pages-myHome/reviewNode/discloseReport?nodeId=${data.nodeId}&reviewId=${data.reviewId}&noticeId=${noticeId}`
						)
						break;
					case "1011": //量房
						this.toPage(
							`/pages-myHome/measureForm/measureForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break;
					default:
						this.toPage(`/pages-myHome/commonHandleTodo?reviewId=${data.reviewId}&status=2`)
						break;
				}
			},
			getNoticeDate(date) {
				return getNoticeDate(date)
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			async downCallback() {
				const params = {
					pageno: this.downOption.page.num,
					pagesize: this.downOption.page.size
				}
				const data = await this.$http.get(
					`basic/notification/page?classification=${this.title}&current=${params.pageno}&size=${params.pagesize}`
				)
				const records = data.records ? data.records : []
				this.list = records
				this.mescroll && this.mescroll.endSuccess(data.length)
			},
			async upCallback(page) {
				this.upOption.page.num = page.num
				const params = {
					pageno: this.upOption.page.num,
					pagesize: page.size ? page.size : this.upOption.page.size
				}
				const data = await this.$http.get(
					`basic/notification/page?classification=${this.title}&current=${params.pageno}&size=${params.pagesize}`
				)
				const records = data.records ? data.records : []
				this.list = this.list.concat(records)
				this.mescroll && this.mescroll.endSuccess(this.list.length)
			},
			deleteNotice(item) {
				uni.showModal({
					content: "确定删除消息么",
					success: (res) => {
						if (res.confirm) {
							const index = this.list.findIndex(data => data.id == item.id);
							this.$http.get(`basic/notification/delete/${item.id}`).then(res => {
								this.list.splice(index, 1)
								this.upCallback({
									num: this.upOption.page.num += 1
								})
								this.$util.toast("已删除")
							})
						}
					}
				})
			},
			readAllMessage() {
				if (!this.list.length) {
					this.$util.toast('还没有通知消息');
					return;
				}
				this.$http.get(`basic/notification/batchRead?group=${this.group}`).then(async res => {
					const params = {
						pageno: this.downOption.page.num,
						pagesize: this.downOption.page.size
					}
					const data = await this.$http.get(
						`basic/notification/page?classification=${this.title}&current=${params.pageno}&size=${params.pagesize}`
					)
					const records = data.records ? data.records : []
					this.list = records
					let notice = 0
					this.list.map(item => {
						if (item.unReadCount) {
							notice += item.unReadCount
						}
					})
					this.$store.commit("UPDATE_NOTICE");
					this.mescroll && this.mescroll.endSuccess(data.length)
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.nav-bar-right {
		font-size: 24rpx;
		color: #606060;
		margin-right: 30rpx;
	}

	.list {
		margin-top: 40rpx;
		/* #ifdef H5 */
		margin-top: 0rpx;
		/* #endif */
	}

	.notice-content {
		background: #fff;
		border-radius: 16rpx;
		margin: 30rpx;
		/* #ifdef H5 */
		margin-top: 0rpx;
		/* #endif */
		padding: 30rpx 0;
		position: relative;
		border-bottom: 2rpx solid #F0F0F0;

		.title {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
			line-height: 34rpx;
			max-width: 500rpx;
			overflow: hidden;
			/*内容会被修剪，并且其余内容是不可见的*/
			text-overflow: ellipsis;
			/*显示省略符号来代表被修剪的文本。*/
			white-space: nowrap;
		}

		.date-content {
			height: 16rpx;
			margin-top: 19rpx;
			font-size: 20rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #999999;
			line-height: 16rpx;
		}

		.node {
			position: absolute;
			top: 35rpx;
			right: 10rpx;
			width: 8rpx;
			height: 8rpx;
			border-radius: 10rpx;
			background-color: #FE6E32;
			margin-left: 10rpx;
		}

		.content {
			margin-top: 24rpx;
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #000000;
			line-height: 36rpx;
		}

		.delete {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
