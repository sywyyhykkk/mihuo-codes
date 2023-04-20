<template>
	<view class="evaluation-records">
		<view class="u-tabs-contain">
			<u-tabs :list="tabList" font-size="26" :is-scroll="false" inactive-color="#909199" bar-height="4"
				:current="current" @change="change"></u-tabs>
		</view>
		<view class="evaluation-list">
			<view class="item-contain-all" v-for="(item,index) in  list">
				<view class="item-contain" :key="index" v-if="item.replyFlag">
					<evaluation-item :info="item.orderReply"></evaluation-item>
				</view>
				<view class="waiting-contain" v-else>
					<view class="item-contain">
						<view class="top-contain">
							<u-avatar size="64" :src="$util.thumbnailImage(item.avatar,true)" mode="circle">
							</u-avatar>
							<view class="personnel-contain">
								<view class="left">
									<text v-if="item.name">{{item.name}}({{item.skillName}})</text>
								</view>
								<view class="right">
									<text class="status">待评价</text>
								</view>
							</view>
						</view>
						<view class="desc">评价晒图得10积分，首次写评奖励翻倍</view>
						<view class="bottom-contain" @click="getEvaluation(item)">
							<text>评价</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-show="list.length === 0 " icon="/static/images/no_recommend.png" title="您还没有数据～～" />
	</view>
</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	export default {
		data() {
			return {
				current: 0,
				rateNum: 5,
				list: [],
				noEvaluationList: [],
				total: 0,
				size: 5,
				pageCurrent: 1,
				status: -1,
				tabList: [{
					name: '全部',
					value: -1,
				}, {
					name: '已评价',
					value: 1,
				}, {
					name: '待评价',
					value: 0,
				}],
				tempPersonIdListNew: [],
				listUser: [],
				projectId:'',
				nodeId:''
			}
		},
		onLoad() {

		},
		onShow() {
			this.noEvaluationList = []
			this.list = []
			this.current = 0
			this.status = -1
			this.pageCurrent = 1
			this.setParameter()

		},
		onReachBottom() {
			if (this.list.length === this.total) return
			this.pageCurrent += 1
			this.getUserList()
		},
		computed: {
		   ...mapState(['projectInfo','nodeInfo'])
		  },
		methods: {
			setParameter(){
				this.projectId =this.projectInfo.projectId
				this.nodeId = this.nodeInfo.nodeId
				this.getUserList()
			},
			change(index) {
				this.current = index
				this.status = this.tabList[index].value
				this.pageCurrent = 1
				this.getUserList()
			},
			getUserList() {
				if(!this.projectId){
					return
				}

				this.$httpApi.bizorderreplyPage({
					projectId: this.projectId,
					nodeId: this.nodeId,
					status: this.status
				}).then(res => {
					res.map(item => {
						if (item.replyFlag) {
							item.orderReply['jobName'] = item.skillName
							item.orderReply['name'] = item.name
							item.orderReply['avatar'] = item.avatar
							item.orderReply['dealRealName'] = ''
							item.orderReply['dealJobName'] = ''
							item.orderReply['dealAvatar'] = ''
							item.orderReply.execPersonId = item.personId
							item.orderReply.labelsList = item.orderReply && item.orderReply.labels && item
								.orderReply.labels.split(',')
							this.tempPersonIdListNew.push(item.orderReply.dealPersonId)
						}
					})
					this.list = res
					this.getEvaluationPeople()
				})
			},
			getEvaluationPeople() { // 获取评价人信息
				if (this.tempPersonIdListNew.length > 0) {
					this.tempPersonIdListNew = [...new Set(this.tempPersonIdListNew)]
					this.$getPersonIdUser(this.tempPersonIdListNew, (res) => {
						this.listUser = res
						// 初始化人员信息
						this.setInitializeUser()
					})
				}
			},
			setInitializeUser() {
				this.list.map(item => {
					this.listUser.map(el => {
						if (item.replyFlag) {
							item.orderReply.dealRealName = el.name
							item.orderReply.dealJobName = el.skillName
							item.orderReply.dealAvatar = el.avatar
						}
					})
				})
			},
			getEvaluation(item) {
				uni.navigateTo({
					url: '/pages/construction/evaluation/evaluationForm',
					success(res) {
						 res.eventChannel.emit('acceptDataFromOpenerPage', item);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-tabs {
		border-top-left-radius: $miniBorderRadius;
		border-top-right-radius: $miniBorderRadius;
	}



	.evaluation-records {
		padding-top: 16rpx;
		padding-bottom: 80rpx;

		.u-tabs-contain {

			margin: 0rpx 20rpx 2rpx 20rpx;
		}

		.evaluation-list {
			.item-contain {
				margin-bottom: 6rpx;
			}
		}

		.waiting-contain {
			.item-contain {
				margin: 0rpx 20rpx 4rpx 20rpx;
				padding: 36rpx 58rpx 28rpx 46rpx;
				background-color: $bgColor;

				.top-contain {
					display: flex;
					align-items: center;
					margin-bottom: 22rpx;

					.personnel-contain {
						padding-left: 12rpx;
						display: flex;
						align-items: center;
						width: 100%;
						justify-content: space-between;

						.left {
							text {
								font-size: $middleFontSize;
								font-weight: bold;
							}
						}

						.right {
							text {
								font-size: $smiddleFontSize;
								color: $errorFontColor;
								padding-right: 6rpx;
							}
						}
					}
				}

				.desc {
					font-size: $smiddleFontSize;
					color: $errorFontColor;
					margin-bottom: 30rpx;
				}

				.bottom-contain {
					display: flex;
					justify-content: flex-end;

					text {
						font-size: $middleFontSize;
						padding: 12rpx 38rpx;
						color: $mainFontColor;
						border: 1px solid #EEEEEE;
						border-radius: $miniBorderRadius;
					}
				}
			}
		}
	}
</style>
