<template>
	<view>
		<public-module></public-module>
		<view class="top-nav-bar">
			<view class="nav-view">
				<image class="arrow_back" src="/static/icon/arrow_back.png" mode="" @click="goBack" />
				<view v-if="position === 'R_PROJECT_MANAGER'">
					<message-tabs :items="items" :current="current" @clickItem="onClickItem" />
				</view>
				<view class="message-tab" v-else>{{pageType==='我的罚款记录'?'奖惩':'处罚'}}记录</view>
			</view>
		</view>

		<swiper :class="setSwiperClass()" duration="200" :current="current" @change="swiperChange"
			:disable-touch="true">
			<swiper-item>
				<scroll-view class="scroll-con" scroll-y @scrolltolower="onRefresh">
					<view class="i_punish" v-show="punishList && punishList.length > 0">
						<view class="i_punish_item" v-for="(item,index) in punishList" :key="item.id">
							<view class="project_name">{{item.projectAddress}}</view>
							<view class="personnel_info align-center">
								<view class="left align-center">
									<u-avatar class="avatar" size="88"
										:src="$util.avatarImage(item.person && item.person.userId)" />
									<view class="info">
										<view class="name">{{item.person && item.person.name}}</view>
										<view class="job">{{item.person && item.person.skillName}}</view>
									</view>
								</view>
								<view class="right" @click="toPunishDetailed(item)">
									<text class="see_detail">查看明细</text>
									<image class="arrow_right" src="/static/icon/arrow_right.png" mode="aspectFill">
									</image>
								</view>
							</view>

							<view class="punish_detail">
								<view class="total">总计</view>
								<view class="public">
									金额 <text>{{item.total.totalMoney}} 元</text>
								</view>
								<view class="public">
									积分 <text>{{item.total.totalIntegral}} 分</text>
								</view>
								<view class="public">
									订单 <text>{{item.total.totalDay}} 天</text>
								</view>
							</view>
						</view>
						<u-loadmore :status="status" v-if="loadmoreShow" />
					</view>
					<view v-show="punishList.length === 0" style="overflow: hidden;">
						<mh-empty icon="/static/images/no_recommend.png" title="您还没有数据～～" />
					</view>
				</scroll-view>
			</swiper-item>

			<swiper-item>
				<scroll-view class="scroll-con" scroll-y @scrolltolower="onRefresh"
					v-show="punishList && punishList.length > 0">
					<view class="punish_me">
						<view class="punish_me_item" @click="toPunishDetails(tm)" v-for="(tm,ind) in punishList"
							:key="tm.id">
							<view class="project_name align-center">
								<view class="left">{{tm.projectAddress}}</view>
								<view class="right" @click="goPlead(tm.id)">
									<text class="text" :class="setClass(tm.applyStatus)">
										{{setState(tm.applyStatus)}}</text>
									<image v-if="tm.applyStatus === 0" class="go_right" src="/static/icon/go_right.png">
									</image>
								</view>
							</view>
							<view class="top">{{tm.reason}}</view>
							<view class="staff_info align-center">
								<view class="myself">
									<u-avatar class="avatar" size="60"
										:src="$util.avatarImage(tm.person && tm.person.userId)" />
									<text
										class="name_job">{{tm.person && tm.person.name}}（{{tm.person && tm.person.skillName}}）</text>
									<text class="time">{{tm.created}}</text>
								</view>
								<view class="fail_money" :class="tm.applyStatus === 2?'success_money':''"
									v-if="position !== 'R_PROJECT_MANAGER'">
									{{'-'+tm.total.totalMoney}}
								</view>
							</view>
							<view class="punish_detail" v-if="position === 'R_PROJECT_MANAGER'">
								<view class="total">总计</view>
								<view class="public">
									金额 <text>{{tm.total.totalMoney}} 元</text>
								</view>
								<view class="public">
									积分 <text>{{tm.total.totalIntegral}} 分</text>
								</view>
								<view class="public">
									订单 <text>{{tm.total.totalDay}} 天</text>
								</view>
							</view>
						</view>
					</view>
					<u-loadmore :status="status" v-if="loadmoreShow" />
				</scroll-view>
				<mh-empty v-show="punishList.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
			</swiper-item>
		</swiper>

		<mihuo-bottom-button v-show="position==='R_PROJECT_MANAGER'&&current===0&&pageType!=='我的罚款记录'"
			:buttonList="buttonList" @click="toPunish()"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				loadmoreShow: true,
				position: '',
				items: ['我处罚的', '处罚我的'],
				current: 0,
				page: 1,
				size: 10,
				pages: 0,
				total: 0,
				status: 'loadmore',
				punishList: [],
				imageGlobal: this.$image.imageGlobal,
				option: {},
				projectId: '',
				pageType: '',
				buttonList: [{
					name: '新增处罚',
					status: true
				}],
				userId: uni.getStorageSync('userData').sysUser.userId
			}
		},
		onLoad(option) {
			this.option = option
			this.pageType = option.pageType
		},
		onShow() {
			this.parameterType()
			if (this.position === 'R_PROJECT_MANAGER') {
				this.current = 0
			} else {
				this.current = 1
			}
		},

		onReachBottom() {
			this.onRefresh();
		},
		onPullDownRefresh() {
			this.reload();
		},
		computed: {
			...mapState(['projectInfo', 'userRole', 'userPersonInfo', 'userPersonId'])
		},
		methods: {
			setSwiperClass() {
				if ((this.current === 0 && this.pageType === '我的罚款记录') || this.current === 1) {
					return 'swiper'
				} else if (this.current === 0 && this.pageType !== '我的罚款记录') {
					return 'swiper2'
				}
			},
			parameterType() {
				if (this.option.type === '处罚') {
					if (!this.option.noticeType) {
						this.$notificationsJump(this.option)
					}
					this.projectId = this.option.projectId
				} else {
					this.projectId = this.projectInfo.projectId
				}
				this.position = this.userRole
				this.getPunishData(this.page)
			},
			goPlead(id) {
				if (id === 0) {
					uni.setStorageSync('typeName', '申述')
					this.toPage(`/pages/construction/complaint/complaintForm?punishment=罚款&id=${id}`)
				} else {
					return false
				}
			},
			setClass(state) {
				switch (state) {
					case 0:
						return 'normal';
						break;
					case 1:
						return 'fail';
						break;
					case 2:
						return 'success';
						break;
				}
			},
			setState(state) {
				// 申诉状态:-1->全部 0->待处理 1->已发起 2->撤销 3->同意 4->驳回
				switch (state) {
					case 0:
						return '去申述';
						break;
					case 1:
						return '待审核';
						break;
					case 2:
						return '申述成功';
						break;
				}
			},
			//下拉刷新
			reload() {
				this.page = 1;
				setTimeout(() => {
					this.getPunishData(this.page)
					uni.stopPullDownRefresh();
					uni.showToast({
						title: "刷新成功",
						icon: "none",
					});
				}, 500);
			},
			//上拉加载数据
			onRefresh() {
				if (this.punishList.length === this.total) {
					return;
				}
				this.status = "loading";
				setTimeout(() => {
					this.page = this.page + 1;
					this.getPunishData(this.page)
				}, 1000)
			},
			personId() {
				if (this.position === 'R_PROJECT_MANAGER' && this.current === 0) {
					return ''
				} else if ((this.position !== 'R_PROJECT_MANAGER' && this.current === 0) || this.current === 1) {
					return Number(this.userPersonInfo.personId)
				}
			},
			dealPersonId() {
				//这里返回的userPersonId是从我的界面来的
				if (this.pageType === '我的罚款记录') {
					if (this.position === 'R_PROJECT_MANAGER' && this.current === 0) {
						return this.userPersonId
					} else if (this.position !== 'R_PROJECT_MANAGER' && this.current === 0) {
						return ''
					}
				}
				if (this.position === 'R_PROJECT_MANAGER' && this.current === 0) {
					return Number(this.userPersonInfo.personId)
				} else if (this.position !== 'R_PROJECT_MANAGER' && this.current === 0) {
					return ''
				}
			},
			getPunishData(currentPage) {
				let params = {
					userId: this.pageType === '我的罚款记录' ? this.userId : '',
					dealPersonId: this.dealPersonId(),
					personId: this.personId() || '',
					projectId: this.pageType !== '我的罚款记录' ? this.projectId : '',
					current: currentPage,
					size: this.size,
				}
				this.$http.get("order/bizorderforfeit/page", params).then(res => {
					this.pages = res.pages;
					this.total = res.total;
					if (res.records.length !== 0) {
						if (currentPage === 1) {
							this.punishList = res.records;
						} else {
							this.punishList = this.punishList.concat(res.records);
						}
						if (currentPage == res.pages) {
							this.loadmoreShow = false
							this.status = "nomore";
						} else {
							this.status = "loadmore";
						}
					} else {
						this.status = "nomore";
					}
				}).catch(err => this.status = "nomore")
			},
			toPunishDetails(item) {
				uni.navigateTo({
					url: `./punishDetails?detailId=${item.id}`
				})
			},
			toPunishDetailed(item) {
				uni.navigateTo({
					url: `./punishDetailed?detailId=${item.id}`
				})
			},
			toPunish() {
				uni.navigateTo({
					url: './addPunish'
				})
			},
			getAvatar(url) {
				if (!url) return;
				return this.imageGlobal + url.replace(
					'/admin/sys-file/mihuo-test/', '');
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
					this.punishList = [];
					this.page = 1;
					this.getPunishData(this.page)
				}
			},
			swiperChange(c, s) {
				if (this.current !== c.target.current) {
					this.current = c.target.current;
				}
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.top-nav-bar {
		width: 100%;
		background: #FFFFFF;
		position: fixed;
		top: 0;
		z-index: 20;

		.nav-view {
			position: relative;

			.arrow_back {
				position: absolute;
				top: calc(14rpx + var(--status-bar-height));
				left: 0;
				width: 44rpx;
				height: 44rpx;
				z-index: 999;
				margin-left: 24rpx;
			}

			.message-tab {
				font-weight: bold;
				color: $fontColor33;
				text-align: center;
				padding: calc(10rpx + var(--status-bar-height)) 0 30rpx 0;
			}
		}
	}

	.swiper {
		height: 100vh;
		padding-top: calc(88rpx + var(--status-bar-height));
	}

	.swiper2 {
		height: calc(100vh - 190rpx);
		padding-top: calc(88rpx + var(--status-bar-height));
	}

	.scroll-con {
		height: 100%;
	}

	.i_punish {
		margin: 14rpx 20rpx;

		.i_punish_item {
			// height: 224rpx;
			padding: 32rpx 32rpx 28rpx 24rpx;
			margin-bottom: 8rpx;
			background: #FFFFFF;
			border-radius: 10rpx;

			.project_name {
				width: 100%;
				font-size: 30rpx;
				color: #303133;
				@include toe() padding-bottom: 28rpx;
				border-bottom: 2rpx dashed #EEEEEE;
			}

			.personnel_info {
				padding-bottom: 24rpx;
				margin-top: 30rpx;

				.left {
					.info {
						margin-left: 12rpx;

						.name {
							font-weight: bold;
							font-size: 26rpx;
							color: #333333;
						}

						.job {
							font-size: 24rpx;
							color: #909199;
						}
					}
				}

				.right {
					.see_detail {
						font-size: 24rpx;
						color: #909199;
						margin-right: 26rpx;
					}

					.arrow_right {
						display: inline-block;
						width: 11rpx;
						height: 20rpx;
					}
				}
			}
		}
	}

	.punish_detail {
		display: flex;
		padding-top: 20rpx;

		.total {
			color: #606166;
			font-size: 26rpx;
			margin-right: 24rpx;
		}

		.public {
			font-size: 24rpx;
			color: #606166;
			margin-right: 17px;

			text {
				margin-left: 4rpx;
				font-size: 26rpx;
				font-weight: bold;
				color: #ff5d35;
			}
		}
	}

	.punish_me {
		overflow-y: auto;
		margin: 12rpx 20rpx;

		.punish_me_item {
			padding: 32rpx 38rpx;
			margin-bottom: 8rpx;
			background: #FFFFFF;
			border-radius: 16rpx;

			.project_name {
				padding-bottom: 28rpx;
				border-bottom: 2rpx dashed #EEEEEE;

				.left {
					width: 70%;
					font-size: 30rpx;
					color: #303133;
					@include toe()
				}

				.right {
					margin-right: 22rpx;

					.text {
						font-size: 22rpx;
						margin-right: 16rpx;
					}

					.go_right {
						display: inline-block;
						width: 16rpx;
						height: 16rpx;
					}

					.normal {
						color: $themeColor;
					}

					.success {
						color: #10BF78;
					}

					.fail {
						color: #FF5D35;
					}
				}
			}

			.top {
				width: 100%;
				margin-top: 24rpx;
				font-size: 26rpx;
				color: $seconFontColor;
				@include toe()
			}

			.staff_info {
				.fail_money {
					margin-right: 22rpx;
					font-weight: bold;
					font-size: $middleFontSize;
					color: #FF5D35;
				}

				.success_money {
					font-weight: bold;
					font-size: $middleFontSize;
					text-decoration-line: line-through;
					color: #909199;
				}
			}

			.myself {
				display: flex;
				align-items: center;
				margin-top: 14rpx;

				.avatar {
					margin-right: 6rpx;
				}

				.name_job {
					font-size: 22rpx;
					color: #606166;
				}

				.time {
					font-size: 22rpx;
					color: #909199;
				}
			}
		}
	}

	.align-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
