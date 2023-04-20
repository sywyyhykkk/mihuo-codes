<template>
	<view>
		<public-module></public-module>
		<!-- <order-user-information :projectId="projectId" /> -->
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<view v-show="patrolList && patrolList.length > 0">
			<scroll-view class="list-scroll-content" scroll-y @scrolltolower="onRefresh">
				<view class="manager_change_item" v-for="(item,index) in patrolList" :key="item.id">
					<view class="btm_view" @click="toPatrolDetails(item.id)">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<view class="user align-items-left">
								<u-avatar class="avatar" size="64" :src="$util.avatarImage(item.person.userId,true)"
									v-if="item.person" />
								<text v-if="item.person && item.person.name"
									class="name">{{ item.person.name}}({{ item.person.skillName}})
									{{item.created.substr(0,item.created.length - 3)}}</text>
							</view>
							<text class="reason">{{item.content}}</text>
							<view class="left_btm align-items-left">
								<view class="public totals">{{item.json.total}}项问题</view>
								<view class="public already">{{item.json.done}}项已整改</view>
								<view class="public not">{{item.json.notDone}}项未整改</view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="loadmoreShow" />
			</scroll-view>
		</view>
		<mh-empty v-show="patrolList.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
		<mihuo-bottom-button :buttonList="buttonList" @click="goAdd()"></mihuo-bottom-button>
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
				patrolList: [],
				status: 'loadmore',
				page: 1,
				size: 10,
				pages: 0,
				total: 0,
				projectId: '',
				buttonList: [{
					name: '添加巡检',
					status: true
				}],
			}
		},
		onShow() {
			this.setParameter()
			this.getPatrolList(this.page)
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'remainingDays'])
		},
		methods: {
			setParameter() {
				this.projectId = this.projectInfo.projectId
			},
			toPatrolDetails(itemId) {
				uni.navigateTo({
					url: `/pages/construction/patrolInspection/patrolDetails?itemId=${itemId}`
				})
			},
			onRefresh() {
				if (this.patrolList.length === this.total) {
					return;
				}
				this.status = "loading";
				setTimeout(() => {
					this.page = this.page + 1;
					this.getPatrolList(this.page)
				}, 1000)
			},
			getPatrolList(currentPage) {
				this.$http.get("order/sopinspect/page", {
					projectId: Number(this.projectId),
					current: currentPage,
					size: this.size
				}).then(res => {
					this.pages = res.pages;
					this.total = res.total;
					if (res.records.length !== 0) {
						if (currentPage === 1) {
							this.patrolList = res.records;
						} else {
							this.patrolList = this.patrolList.concat(res.records);
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
				})
			},
			goAdd() {
				uni.navigateTo({
					url: "/pages/construction/patrolInspection/patrolInspection"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.list-scroll-content {
		height: 1125rpx;
	}

	.manager_change_item {
		padding: 26rpx 46rpx;
		margin: 6rpx 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.btm_view {
			.left {
				.title {
					font-weight: bold;
					font-size: 30rpx;
					color: #303133;
				}

				.user {
					.avatar {
						margin: 14rpx 6rpx 14rpx 0;
					}

					.name {
						font-size: 24rpx;
						color: #909199
					}
				}

				.reason {
					font-size: 26rpx;
					color: #606166;
				}

				.left_btm {
					margin-top: 22rpx;

					.public {
						// width: 92rpx;
						padding: 4rpx 8rpx;
						line-height: 38rpx;
						font-size: 19rpx;
						text-align: center;
						border-radius: 50rpx;
						margin-right: 16rpx;
					}

					.totals {
						background: #E1EEFF;
						color: $themeColor;
					}

					.already {
						background: #D8FFF0;
						color: #3BC548;
					}

					.not {
						background: #FFF2E9;
						color: #FF5D35;
					}
				}
			}
		}
	}

	.align-items-left {
		display: flex;
		align-items: center;
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
