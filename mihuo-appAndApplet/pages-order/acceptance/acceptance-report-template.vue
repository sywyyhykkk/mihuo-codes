<template>
	<view class="acceptance">
		<z-nav-bar fontColor="#141414" bgColor="#F5F5F5">
			<view class="nav-bar-title" slot="default">{{ title }}</view>
		</z-nav-bar>
		<view v-if="accepptQust" style="margin-bottom:60rpx">
			<!-- 验收发起内容 -->
			<view class="acceptance-info">
				<view class="acceptance-info_remark">{{ accepptQust.checkDesc || '' }}</view>
				<view v-if="accepptQust.voiceFiles">
					<audio-play :formDate="JSON.parse(accepptQust.voiceFiles)"></audio-play>
				</view>
				<view class="img-contain" v-if="accepptQust.picFiles && accepptQust.picFiles!='[]'">
					<image-show :num="99" :imgSrc="accepptQust.picFiles" right="20" width="210" height="210">
					</image-show>
				</view>
			</view>
			<view class="acceptance-tj">
				<text
					:class="'pass pass_'+ accepptQust.statusFlag">{{ accepptQust.statusFlag == 0?'待验收':accepptQust.statusFlag == 1?"通过":"未通过"}}</text>
				<text class="pass">{{accepptQust.qualifiedCount}}项合格</text>
				<text class="no-pass">{{accepptQust.unqualifiedCount}}项不合格</text>
				<text class="no-check">{{accepptQust.notCount}}项待验收</text>
			</view>
			<view class="acceptance-time">
				<text class="time">提交时间</text>
				<text>{{accepptQust.acceptanceCreateTime}}</text>
			</view>
			<view v-if="accepptQust.items && accepptQust.items.length" class="acceptance-content">
				<view v-for="(item,index) in accepptQust.items" :key="index" class="content-item">
					<view class="items-title">{{ index + 1}}、{{item.itemName}}</view>
					<view class="items-content marginLeft">{{ item.standard}}</view>
					<text
						:class="'passFlag marginLeft passFlag_'+item.passFlag">{{ item.passFlag == -1?'未验收':item.passFlag==1?'通过':'不通过'}}</text>
					<view v-if="item && item.passFlag==0" class="ques-item marginLeft">
						<view v-if="item.appendQues">
							<view class="ques-item_title">存在问题</view>
							<view class="ques-item_content">{{item.appendQues || ''}}</view>
							<view v-if="item.appendPicFiles && item.appendPicFiles!='[]'">
								<image-show :num="99" :imgSrc="item.appendPicFiles" right="20" />
							</view>
							<view v-if="item.appendVoiceFile" class="ques-item_voice">
								<audio-play :formDate="JSON.parse(item.appendVoiceFile)"></audio-play>
							</view>
						</view>
						<view v-if="item.appendPlan">
							<view class="items-title">整改方案</view>
							<view class="ques-item_content">{{item.appendPlan}}</view>
						</view>
					</view>
				</view>
			</view>
			<order-mh-empty v-else size="200" title="暂无验收回复～～" />
		</view>
		<order-mh-empty v-else size="200" title="暂无验收报告～～" />
		<bottom-button title="确认" @click="confirm" v-if="options.isDo && accepptQust.statusFlag == 0"></bottom-button>
		<bottom-button title="下载报告" @click="download" v-else></bottom-button>
	</view>
</template>

<script>
	/**
	 * 多工种验收模板展示
	 */
	import common from '@/config/common.js'
	export default {
		name: "acceptance-report",
		data() {
			return {
				options: {},
				checkedData: {},
				accepptQust: {},
				title: "验收报告",
				reportId: ''
			};
		},
		onLoad(options) {
			this.options = options;
			if (options.skillName) {
				this.title = `${options.skillName || ''}验收报告`
			}
			if (options.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('验收报告', url, this.options.userId)
			}
		},
		onShow() {
			if (this.options.nodeId) {
				this.getCheckedData()
			}
			if (this.options.id) {
				this.getAcceptance(this.options.id)
			}
		},
		methods: {
			//通过nodeId获取节点验收报告
			getCheckedData() {
				this.$http.get(`order/bizorderacceptance/getAcceptancesByTaskId/${this.options.nodeId}`)
					.then((res) => {
						if (res && res.length) {
							// 获取最后一天记录
							this.checkedData = res[0];
							this.getAcceptance(res[0].id)
							this.reportId = res[0].id
						}
					})
			},
			// 获取验收报告
			getAcceptance(id) {
				this.$http.get(`order/bizorderacceptance/getAcceptance/${id}`).then(res => {
					if (res) {
						res.items = res.items
						this.accepptQust = res;
						this.title = res.name
					}
				})
			},
			// 下载pdf
			download() {
				const fileName = this.accepptQust.name + '-' + this.accepptQust.poiName + this.accepptQust.address
				// 变更=1 交底=2 验收=3 巡检=4
				this.$util.downloadPdfReport(this.reportId, 3, fileName)
			},
			confirm() {
				this.$httpApi.handleToDoPending({
					id: this.options.reviewId,
					status: 2
				}).then(res => {
					if (res) {
						this.$util.toast('处理成功')
						setTimeout(() => {
							uni.navigateBack();
						}, 500)
					}
				}).catch(err => {
					// #ifdef MP-WEIXIN
					// 微信小程序不显示错误提示信息只能在这单独加了
					if (err.statusCode === 0 || err.statusCode) {
						uni.showToast({
							title: err.errMsg,
							icon: "none"
						});
					}
					// #endif
				})
			},
			getShare() {
				const path = `pages/order/acceptance/acceptance-report-template?nodeId=${this.options.nodeId}`
				this.$util.shareToWechat('我给你分享了一个验收报告, 请查看', '', path, '验收报告', true, 2)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.acceptance {
		padding: 30rpx;

		.acceptance-info {
			padding-bottom: 30rpx;
			border-top-right-radius: 40rpx;
			border-top-left-radius: 40rpx;
			background: #FFFFFF;

			.acceptance-info_remark {
				color: #4D4D4D;
				font-size: 28rpx;
				font-family: NotoSansHans-Regular;
			}

			.img-contain {
				padding-top: 20rpx;
			}
		}

		.acceptance-time {
			text {
				color: #808080;
				font-size: 22rpx;
			}

			.time {
				margin-right: 10rpx;
			}
		}

		.acceptance-tj {
			display: flex;
			align-items: center;
			padding-bottom: 20rpx;

			text {
				font-family: PingFang-SC;
				font-size: 22rpx;
				padding: 10rpx 20rpx;
				border-radius: 30rpx;
				margin-right: 20rpx;
				color: #FFFFFF;

				&.pass {
					background: #000000;
				}

				&.no-pass {
					background: #ED3832;
				}

				&.no-check {
					background: #909399;
				}
			}

			.pass {
				&.pass_1 {
					color: #187518;
					background: #E7F1E7;
				}

				&.pass_2 {
					color: #ED3832;
					background: #F7E9E9;
				}

				&.pass_0 {
					color: #909399;
					background: #F5F5F5;
				}
			}

			.pass_no {
				color: #ED3832;
			}

		}

		.acceptance-content {
			.content-item {
				padding: 20rpx 0;
				border-bottom: 1px solid #F3F4F8;

				&:last-child {
					border: none;
				}

				.items-title {
					color: #303133;
					font-size: 28rpx;
					font-family: MicrosoftYaHei;
				}

				.items-content {
					color: #909399;
					font-size: 24rpx;
					font-family: MicrosoftYaHei;
					padding: 20rpx 0;
				}

				.passFlag {
					color: #FE6E32;
					font-size: 26rpx;
					font-family: MicrosoftYaHei;
					border-radius: 8rpx;
					padding: 5rpx 10rpx;
					background: #FFF0EA;

					&.passFlag_1 {
						color: #187518;
						background: #E7F1E7;
					}

					&.passFlag_-1 {
						color: #909399;
						background: #F5F5F5;
					}
				}
			}

			.ques-item {
				margin-top: 20rpx;

				.ques-item_title {
					color: #303133;
					font-size: 28rpx;
					font-family: MicrosoftYaHei;
				}

				.ques-item_content {
					color: #909399;
					font-size: 24rpx;
					font-family: MicrosoftYaHei;
					padding: 20rpx 0;
				}

				.ques-item_voice {
					padding-bottom: 20rpx
				}
			}
		}
	}

	.marginLeft {
		margin-left: 40rpx;
	}

	.nav-bar-title {
		font-weight: bold;
		color: #141414;
	}

	.nav-bar-share {
		width: 34rpx;
		height: 33rpx;
		margin-right: 30rpx;
	}
</style>
