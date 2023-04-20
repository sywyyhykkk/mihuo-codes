<template>
	<view>
		<z-nav-bar :backState="3000" @backClick="goBack" title="服务日志"></z-nav-bar>
		<view v-if="checkedDataList.length">
			<view class="content" v-for="(item,itemindex) in checkedDataList" :key="item.id">
				<view class="log">
					<mh-order-person-info :personInfo="item" :key="item.id">
						<view>
							<text class="dateInfo">{{item.created || ''}}</text>
							<text class="dateInfo"
								style="color: #000;margin-left: 5rpx;">{{item.productDesc || ''}}</text>
						</view>
					</mh-order-person-info>
					<view class="describe" v-if="item.hasOrderList">今日施工计划</view>
					<view v-if="item.detailList" style="margin: 30rpx 0 0 0;">
						<view v-for="(mini,index) in [item.detailList[0]]" :key="mini.id">
							<view v-for="(mini2,index2) in [item.detailList[0]]" :key="index2">
								<view :class="{ 'active': mini2.status == 1, 'end': mini2.status == 2}">
									<view v-if="item.hasOrderList" class="icon"></view>
									<view v-else class="sort">01</view>
									<text class="conInfo">{{mini2.name || ''}}</text>
									<view v-if="item.hasOrderList" class="label">{{mini2.status > 1?'已完工':'已开工'}}</view>
								</view>
								<view class="image_show" v-if="mini2.pic">
									<order-mh-image-show :imgSrc="mini2&&mini2.pic" width="196" height="196" right="12" />
								</view>
							</view>
							<view class="image_show" v-if="item.pic">
								<order-mh-image-show :imgSrc="item&&item.pic" width="196" height="196" right="12" />
							</view>
						</view>
						<view class="remark">{{item.desc}}</view>
					</view>
					<view class="remark" v-else>{{item.desc}}</view>
					<view class="action">
						<button class="buttonLook" @click="goDetail(item)">查看</button>
					</view>
				</view>
			</view>
		</view>
		<order-mh-empty v-if="checkedDataList.length === 0" title="暂无服务日志～～" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkedDataList: [],
				options: {},
				pageObj: {
					current: 1,
					pageSize: 10,
					total: 0,
					pages: 0,
				},
				status: 'nomore',
				isRefresh: false,
			};
		},

		onLoad(options) {
			this.options = options;
			this.getListData()
		},
		// 滚动到底部加载更多
		onReachBottom() {
			if (this.checkedDataList.length === Number(this.pageObj.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pageObj.current++
				setTimeout(() => {
					this.getListData()
				}, 200)
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: `${this.options.skillName || ''}服务日志`
			})
		},
		methods: {
			goDetail(item) {
				this.toPage(`/pages-order/constructionLogDetail/constructionLogDetail?id=${item.id}`)
			},
			goBack() {
				uni.navigateBack();
				if (this.isRefresh) uni.$emit('refresh');
			},
			//获取施工报告
			getListData() {
				let ids = [];
				this.isRefresh = false;
				let params = {
					current: this.pageObj.current
				}
				if (this.options.projectId < 1) {
					params.orderId = this.options.orderId;
				} else {
					if (this.options.deliveryType == 1) {
						params.projectId = this.options.projectId;
					}
				}
				this.$httpApi.getBuildLog(params)
					.then((res) => {
						if (res) {

							//判断是否是有工序清单的
							const data = res.records.map(item => {
								if (item.detailList) {
									for (let list of item.detailList) {
										if (list.status != -1) {
											item.hasOrderList = 1;
											break;
										}
									}
								}
							})
							this.checkedDataList = this.checkedDataList.concat(res.records);
							console.log(this.checkedDataList)
							this.pageObj.total = res.total;
							if (res.records && res.records.length) {
								res.records.map((item) => {
									if (item.viewFlag == 0) {
										ids.push(item.id)
									}
								});
								// 设置已读
								if (ids && ids.length) {
									this.isRefresh = true;
									this.$httpApi.constructionRead(ids);
								}
							}
						}
					})
			},
		},
	}
</script>
<style>
	page {
		background: #f7f7f7 !important;
	}
</style>
<style lang="scss" scoped>
	.content {
		margin-bottom: 20rpx;
	}

	.log {
		padding: 20rpx 30rpx;
		background: #FFFFFF;

		.sort {
			font-size: 20rpx;
			font-family: HuXiaoBo-NanShen;
			font-weight: 400;
			color: #CCCCCC;
			line-height: 34rpx;
		}

		// border-bottom: 1.5rpx solid #E6E6E6;
		&:last-child {
			border: none;
		}

		.log-top {
			display: flex;
			align-items: center;

			.dateInfo {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #999999;
			}

			.log_name {
				color: #141414;
				font-size: 28rpx;
				font-weight: bold;
				padding: 0 20rpx;
			}

			.log_skill-name {
				color: #FE6E32;
				border: 2rpx solid #FE6E32;
				font-size: 22rpx;
				font-weight: 800;
				padding: 0 10rpx;
				border-radius: 6rpx;
			}
		}

		.submit_time {
			margin: 20rpx 0;
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #808080;
		}

		.describe {
			font-size: $fontSize28;
			font-family: PingFang SC;
			margin: 30rpx 0 0 0;
			color: $mainFontColor14;
			@include bov(3);
		}

		.image_show {
			margin-top: 20rpx;
		}

		.active,
		.end {
			display: flex;
			align-items: center;

			.conInfo {
				font-size: 28rpx;
				font-weight: 500;
				color: #000000;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 12rpx;
				max-width: 500rpx;
			}

			.icon {
				width: 22rpx;
				height: 22rpx;
				background: none;
				border: 4rpx solid #15A50A;
				border-radius: 50%;
			}
		}

		.active {
			.icon {
				border: 4rpx solid #F9703A;
			}

			.label {
				font-size: 20rpx;
				font-weight: 400;
				color: #FFFFFF;
				background: #F9703A;
				border-radius: 32rpx;
				padding: 6rpx 12rpx;
				margin-left: 12rpx;
			}
		}

		.end {
			.icon {
				border: 4rpx solid #15A50A;
			}

			.label {
				margin-left: 12rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: #FFFFFF;
				background: #15A50A;
				border-radius: 32rpx;
				padding: 6rpx 12rpx;
			}
		}

		.remark {
			font-size: 24rpx;
			font-weight: 400;
			color: #808080;
			line-height: 34rpx;
			margin: 20rpx 0 20rpx;
		}
	}

	.action {
		display: flex;
		padding: 20rpx 0 0;
		background-color: #FFFFFF;
		justify-content: flex-end;
		border-top: 1rpx solid #F0F0F0;
		.buttonLook {
			background: #000000;
			border-radius: 30rpx;
			color: #FFFFFF;
			height: 60rpx;
			padding: 0 37rpx;
			line-height: 60rpx;
			font-size: 24rpx;

		}
	}
</style>
