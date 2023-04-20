<template>
	<view class="site-list">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#fff" fontColor="#979797">
			<view slot="right">
				<view class="search-contain">
					<mihuo-search class="search-box" button="inside" @search="getSearch"></mihuo-search>
				</view>
			</view>
		</z-nav-bar>
		<view class="tab-contain">
			<list-tab itemWidth="150" :list="tabList" @change="changTab"></list-tab>
		</view>
		<view class="list-contain">
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="mescrollTop" :topbar="true" :down="downOption"
				:up="upOption" @down="downCallback" @up="upCallback">
				<scroll-view @scrolltolower="scrollToLower" :scroll-y="true" class="scroll-y">
					<view class="order-list">
						<site-order :info="item" v-for="(item,index) in list" :key="index" @click="getDetails">
						</site-order>
						<mh-empty v-if="list.length === 0" icon="/static/images/no_recommend.png" title="暂时还没有订单～～" />
						<u-loadmore v-else :status="status" />
					</view>
				</scroll-view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				list: [],
				total: 0,
				pages: 1,
				pageSize: 20,
				contrast: [],
				status: 'nomore',
				mescrollTop: 164,
				tabList: [{
						name: '全部',
						value: '',

					}, {
						name: '未开始',
						value: -1
					}, {
						name: '施工中',
						value: 0
					}, {
						name: '已停工',
						value: 1
					},
					{
						name: '已完工',
						value: 3
					}
				],
				projectStatus: null,
				keyWords: '',
				downOption: {
					use: true,
					auto: false,
				},
				upOption: {
					use: false, // 上滑加载更多不使用mescroll实现
					toTop: {
						src: ''
					},
				},
				mescroll: null,
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {
			this.getList()
		},
		onLoad(option) {
			this.option = option
		},
		onUnload() {
			// 关闭按钮校验
			this.$permissionRouting.getInstance().setStartUsing(false)
		},
		methods: {
			upCallback() {},
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			getSearch(val) {
				this.keyWords = val
				this.getList()
			},
			changTab(val) {
				this.pages = 1
				this.projectStatus = this.tabList[val].value
				this.getList()
			},
			getDetails(info) {
				// 打开按钮校验
				this.$permissionRouting.getInstance().setStartUsing(true)
				let project = {}
				this.$storeSetProjectInfo(info)
				this.$storeOrderInfo({})
				this.$store.commit('setUserRole', 'R_PROJECT_MANAGER')
				this.toPage('/pages/construction/assignmentDetail/assignmentDetail?type=1')
			},
			scrollToLower() {
				if (this.list.length === Number(this.total)) {
					this.status = 'nomore'
					return
				} else {
					this.status = 'loading'
					this.pages += 1
					this.getList()
				}
			},
			// 下拉时重新刷新
			downCallback() {
				this.pages = 1
				this.getList()
				setTimeout(() => {
					this.mescroll && this.mescroll.endBySize(10, true)
				}, 1000)
			},
			getList() {
				this.$httpApi.getProjectListWithNodeInfo({
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					current: this.pages,
					size: this.pageSize,
					status: this.projectStatus,
					keyWords: this.keyWords
				}).then((res) => {
					if (!res) {
						return
					}
					this.total = res.total
					if (this.pages > 1) {
						if (this.pages !== this.contrast) {
							this.list = [...this.list, ...res.records]
							this.contrast = this.pages
						}
					} else {
						this.list = res.records
						this.contrast = this.pages
					}
					if (this.list.length === Number(this.total)) {
						this.status = 'nomore'
					}
					if (this.total == 0) {
						this.status = 'nomore'
					}
				})
			}
		},
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	/deep/ .content {
		height: initial !important;
	}



	.site-flex {
		display: flex;
	}

	.search-contain {
		display: flex;
		flex: 1;
	}

	.search-box {
		width: 600rpx;
		margin-right: 40rpx;
	}


	.tab-contain {
		border-radius: 10rpx;
		position: -webkit-sticky;
		position: sticky;
		top: calc(88rpx + var(--status-bar-height));
		z-index: 9;
	}



	.scroll-y {
		height: calc(100vh - var(--status-bar-height) - 80rpx);
	}

	.order-list {
		padding: 12rpx 20rpx;
	}

	.list-contain {
		margin: 20rpx;
		padding-bottom: 40rpx;


	}
</style>
