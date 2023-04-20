<template>
	<view class="acceptance">
		<z-nav-bar fontColor="#141414" bgColor="#F5F5F5">
			<view class="nav-bar-title" slot="default">{{ title }}</view>
		</z-nav-bar>
		<view class="acceptance-c" v-if="accepptQust">
			<!-- 验收发起内容 -->
			<view class="acceptance-info"
				v-if="(accepptQust.checkDesc || accepptQust.voiceFiles || accepptQust.picFiles != '[]')">
				<view class="acceptance-info_remark">{{ accepptQust.checkDesc }}</view>
				<view v-if="accepptQust.voiceFiles">
					<audio-play :formDate="JSON.parse(accepptQust.voiceFiles)"></audio-play>
				</view>
				<view class="img-contain" v-if="accepptQust.picFiles">
					<image-show :num="99" :imgSrc="accepptQust.picFiles" right="20" width="210" height="210">
					</image-show>
				</view>
			</view>
			<view class="acceptance-main">
				<view class="acceptance-user">
					<u-avatar class="avatar" size="50" :src="$util.avatarImage(execPersonId.userId)"
						v-if="execPersonId.userId" />
					<text class="name">{{ execPersonId.name }}</text>
					<text class="skill-name">{{ execPersonId.skillName }}</text>
				</view>
				<view class="acceptance-time">
					<text class="time">提交时间</text>
					<text>{{accepptQust.acceptanceCreateTime}}</text>
				</view>
				<view class="acceptance-tj">
					<text
						:class="'pass pass_'+ accepptQust.statusFlag">{{ accepptQust.statusFlag == "1"?"通过":"未通过"}}</text>
					<text class="pass">{{ accepptQust.qualifiedCount || 0 }}项合格</text>
					<text class="pass_no">{{ accepptQust.unqualifiedCount || 0 }}项不合格</text>
					<text class="no-check">{{accepptQust.notCount || 0}}项待验收</text>
				</view>
				<view v-if="accepptQust.items && accepptQust.items.length" class="acceptance-content">
					<view v-for="(item,index) in accepptQust.items" :key="index" class="content-item">
						<view class="items-title">{{ index + 1}}、{{item.itemName}}</view>
						<view class="items-content marginLeft">{{ item.standard}}</view>
						<text :class="'passFlag marginLeft passFlag_'+item.passFlag">
							{{ item.passFlag == -1?'未验收':item.passFlag==1?'通过':'不通过'}}
						</text>
						<view class="items-content marginLeft" v-if="item.appendQues">
							{{ item.appendQues }}
						</view>
						<view class="item-image marginLeft" v-if="item.appendPicFiles">
							<image-show right="20" :imgSrc="item.appendPicFiles"></image-show>
						</view>
					</view>
				</view>
				<mh-empty v-else size="200" title="暂无验收回复～～" />
			</view>
		</view>
		<myHome-mh-empty v-else size="200" title="暂无验收报告～～" />
		<myHome-mh-form-bottom-button v-if="options.isDo && nodeData.status == 0" @onCancel="()=>toDealt(1)"
			@onSure="()=>toDealt(2)" />
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
				execPersonId: {},
				nodeData: {}
			};
		},
		onLoad(options) {
			this.options = options;
			if (options.skillName) {
				this.title = `${options.skillName || ''}验收报告`
			}
		},
		onShow() {
			if (this.options.nodeId) {
				this.getCheckedData()
			}
			// if(this.options.id){
			// 	this.getAcceptance(this.options.id)
			// }
			this.getNode()
		},
		methods: {
			// 查询节点信息
			getNode() {
				this.$httpApi.getCheckNode(this.options.reviewId).then((res => {
					this.nodeData = res;
				}))
			},
			//通过nodeId获取节点验收报告
			getCheckedData() {
				this.$http.get(`order/bizorderacceptance/getAcceptancesByTaskId/${this.options.nodeId}`)
					.then((res) => {
						if (res && res.length) {
							// 获取最后一天记录
							res.some(v => {
								if (v.statusFlag == 1) {
									this.checkedData = v;
									this.getAcceptance(v.id)
								}
							})
						}
					})
			},
			// 获取验收报告
			getAcceptance(id) {
				this.$http.get(`order/bizorderacceptance/getAcceptance/${id}`).then(res => {
					if (res) {
						this.accepptQust = res;
						this.title = res.name;
						if (res.acceptanceCreatePersonId) {
							this.getUserNews(res.acceptanceCreatePersonId)
						}
					}
				})
			},
			// 获取发起验收用户
			getUserNews(personId) {
				this.$getPersonIdUser([personId], (res) => {
					if (res && res.length) {
						this.execPersonId = res[0];
					}
				})
			},
			toDealt(status) {
				this.toPage(
					`/pages-myHome/commonHandleTodo?reviewId=${this.options.reviewId}&status=${status}&nodeId=${this.options.nodeId}`
				)
			},
			// 下载pdf
			download() {
				const fileName = this.accepptQust.name + '-' + this.accepptQust.poiName + this.accepptQust.address
				// 变更=1 交底=2 验收=3 巡检=4
				this.$util.downloadPdfReport(this.checkedData.id, 3, fileName)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.acceptance {
		// padding: 30rpx;
		background: #F5F5F5;

		.acceptance-c {
			padding-bottom: 100rpx;
			// background: #FFFFFF;
		}

		.acceptance-main {
			margin-top: 20rpx;
			background: #FFFFFF;
			padding: 30rpx;
		}

		.acceptance-info {
			padding: 30rpx;
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

		.acceptance-user {
			display: flex;
			align-items: center;

			text {
				font-size: 24rpx;
				font-family: NotoSansHans-Regular;
				color: #909199;
				margin-left: 10rpx;
			}

			.affirm {
				font-size: $fontSize26;
			}

			.name {
				color: #000000;
			}

			.skill-name {
				color: #FE6E32;
				background: #FFF0EA;
				padding: 2rpx 10rpx;
				font-weight: 600;
				border-radius: 10rpx 0;
				font-size: 20rpx;
			}
		}

		.acceptance-time {
			padding: 20rpx 0;

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

			text {
				font-family: PingFang-SC;
				font-size: 22rpx;
				padding: 10rpx 20rpx;
				border-radius: 30rpx;
				color: #FFFFFF;
			}

			.pass {
				color: #187518;

				&.pass_1 {
					color: #187518;
					background: #E7F1E7;
				}

				&.pass_2 {
					color: #ED3832;
					background: #F7E9E9;
				}
			}

			.pass_no {
				color: #ED3832;
			}

			.no-check {
				color: #909399;
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

				.item-image {
					margin-top: 20rpx;
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

	.case-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		padding: 0 30rpx;

		.case-do {
			padding-top: 20rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			background: #FFFFFF;
			display: flex;

			view {
				margin-right: 20rpx;
				flex: 1;

				&:last-child {
					margin-right: 0;
				}

				padding: 20rpx 0;
				text-align: center;
				border-radius: 100rpx;
			}

			.button-confirm {
				color: #FFFFFF;
				background: #000000;
				border: 1.5rpx solid #000000;
			}

			.button-no {
				color: #000000;
				border: 1.5rpx solid #000000;
				background: #FFFFFF;
			}
		}
	}
</style>
