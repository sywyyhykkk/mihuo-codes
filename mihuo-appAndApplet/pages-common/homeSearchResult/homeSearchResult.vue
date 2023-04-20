<template>
	<view class="container">
		<z-nav-bar backState="3000" @backClick="onBack">
			<view slot="default" class="nav-bar">
				搜索
			</view>
		</z-nav-bar>
		<view class="tui-searchbox">
			<view class="tui-search-input" @click="back()">
				<image class="search-icon" src="@/pages-common/static/icon/home_v3/search-26x26.png"></image>
				<input placeholder-class="tui-input-plholder" class="tui-input" confirm-type="search" placeholder="搜索"
					:disabled="true" v-model.trim="options.searchText" />
			</view>
		</view>
		<view>
			<view class="search-result">
				<u-tabs :is-scroll="false" class="search-tabs" name="label" :current="curTab" active-color="#000"
					:list="searchTabList" @change="changeTabs($event,true)" inactive-color="#808080" font-size="28">
				</u-tabs>
			</view>
			<view v-if="curTab===0">
				<common-mh-u-waterfall v-model="dataList" ref="waterfall">
					<template v-slot:left="{ leftList }">
						<view class="mall-item" :key="index" v-for="(item, index) in leftList">
							<commodity-card :commodity="item"></commodity-card>
						</view>
					</template>
					<template v-slot:right="{ rightList }">
						<view class="mall-item" :key="index" v-for="(item, index) in rightList">
							<commodity-card :commodity="item"></commodity-card>
						</view>
					</template>
				</common-mh-u-waterfall>
			</view>
			<view v-if="curTab === 1">
				<common-mh-craftsmen-list :data="dataList" />
			</view>
			<view v-if="curTab === 2">
				<view class="case-list">
					<common-mh-u-waterfall v-model="dataList" ref="waterfall">
						<template v-slot:left="{ leftList }">
							<view class="mall-item" :key="index" v-for="(item, index) in leftList">
								<case-card :recommendCase="item" :isShowCompanyInfo="false" />
							</view>
						</template>
						<template v-slot:right="{ rightList }">
							<view class="mall-item flex-center" style="justify-content: flex-end" :key="index"
								v-for="(item, index) in rightList">
								<case-card :recommendCase="item" :isShowCompanyInfo="false" />
							</view>
						</template>
					</common-mh-u-waterfall>
				</view>
			</view>
			<view v-if="curTab===3">
				<common-mh-u-waterfall v-model="dataList" ref="waterfall" addTime="250">
					<template v-slot:left="{ leftList }">
						<mh-miyou-card v-for="(item, index) in leftList" :key="index" :miyouItem="item">
						</mh-miyou-card>
					</template>
					<template v-slot:right="{ rightList }">
						<mh-miyou-card v-for="(item, index) in rightList" :key="index" :miyouItem="item">
						</mh-miyou-card>
					</template>
				</common-mh-u-waterfall>
			</view>
			<view style="height: 80rpx;" v-if="dataList.length">
				<u-loadmore :status="status" />
			</view>
			<mh-empty v-else title="暂无相关内容~~"></mh-empty>
		</view>
		<u-back-top :scroll-top="scrollTop" icon="arrow-up" tips="顶部" bottom="100"></u-back-top>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: "",
				options: {},
				searchTabList: [{
						label: "商品"
					},
					{
						label: "工匠"
					},
					{
						label: "案例"
					},
					{
						label: "觅友圈"
					},
				],
				curTab: 0,
				status: 'loadmore',
				pageObj: {
					total: 0,
					current: 1,
				},
				dataList: [],
				cityOperatorId: uni.getStorageSync('cityOperatorId'),
				scrollTop: 0,
			}
		},
		// onHide() {
		// 	this.dataList = []
		// 	this.$refs.waterfall && this.$refs.waterfall.clear()
		// },
		onLoad(options) {
			this.options = options;
			if (options.searchText.indexOf('商店') != -1) {
				this.curTab = 0;
			}
			if (options.searchText.indexOf('工匠') != -1) {
				this.curTab = 1;
			}
			if (options.searchText.indexOf('案例') != -1) {
				this.curTab = 2;
			}
			if (options.searchText.indexOf('觅友') != -1) {
				this.curTab = 3;
			}
			this.changeTabs(this.curTab);
		},
		onReachBottom() {
			if (this.dataList.length === Number(this.pageObj.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pageObj.current++
				setTimeout(() => {
					this.changeTabs(this.curTab)
				}, 200)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			back() {
				// 用redirectTo 触发onLoad 搜索框自动获取焦点
				uni.redirectTo({
					url: '/pages-common/searchPage/searchPage?type=home'
				})
			},
			onBack() {
				getApp().globalData.productSearchText = ''
				uni.switchTab({
					url: '/pages/home/home'
				});
			},
			searchMaster(item) {
				this.key = item.skillName;
				this.isHomeSearch = true;
				let searchList = uni.getStorageSync('productorSearchHistory') || [];
				if (searchList.indexOf(this.key) === -1) {
					searchList.unshift(this.key)
				}
				uni.setStorageSync('productorSearchHistory', searchList)
				this.changeTabs(0)
			},
			changeTabs(index, flag) {
				if (flag) {
					this.dataList = [];
					this.$refs.waterfall && this.$refs.waterfall.clear()
				}
				this.curTab = index;
				if (this.curTab === 0) {
					this.getProductData();
				}
				if (this.curTab === 1) {
					this.getCraftsmanData()
				}
				if (this.curTab === 2) {
					this.getCaseData();
				}
				if (this.curTab === 3) {
					this.getMiYouData();
				}
			},
			goToDetail(data, type) {
				switch (type) {
					case "商品":
						this.toPage(`/pages-mall/productDetail/productDetail?id=${data.id}`);
						break;
					case "工匠":

						break;
					case "案例":
						this.toPage(`/pages-common/case/recommend/detail?id=${data.id}`)
						break;
					case "觅友圈":
						this.toPage(`/pages-user/miyou/miyouDetail?miyouId=${data.id}`)
						break;
					default:
						break;
				}
			},
			// 获取商品列表
			getProductData() {
				let params = {
					cityOperatorId: this.cityOperatorId,
					pageSize: 10,
					pageNum: this.pageObj.current - 1,
					keyword: this.options.searchText,
					cityOperatorFlag: 2 // 查询运营商旗下所有企业的商品
				}
				this.$httpApi.searchProductPage(params).then(res => {
					this.pageObj.total = res.total;
					this.dataList = this.dataList.concat(res.records);
					if (this.dataList.length < this.pageObj.total) {
						this.status = 'loadmore';
					} else {
						this.status = 'nomore';
					}
				})
			},
			// 获取工匠列表
			getCraftsmanData() {
				let params = {
					auditStatus: 2,
					size: 10,
					current: this.pageObj.current,
					keyword: this.options.searchText
				}
				this.$httpApi.getCraftsmanList(params).then(res => {
					this.pageObj.total = res.total;
					this.dataList = this.dataList.concat(res.records);
					if (this.dataList.length < this.pageObj.total) {
						this.status = 'loadmore';
					} else {
						this.status = 'nomore';
					}
				})
			},
			// 获取案例列表
			getCaseData() {
				this.$httpApi.getConstructionCase({
						cityOperatorId: this.cityOperatorId,
						size: 10,
						current: this.pageObj.current,
						name: this.options.searchText
					})
					.then((res) => {
						if (res && res.records !== 0) {
							res.records.map((item) => {
								item.coverPic = JSON.parse(item.coverPic);
								if (item.tags) {
									item.tags = item.tags.split(",");
								}
							})
						}
						this.dataList = this.dataList.concat(res.records);
						this.pageObj.total = res.total;
						if (this.dataList.length < this.pageObj.total) {
							this.status = 'loadmore';
						} else {
							this.status = 'nomore';
						}
					})
			},
			// 获取密友圈列表
			getMiYouData() {
				let params = {
					size: 10,
					current: this.pageObj.current,
					keyword: this.options.searchText
				}
				this.$httpApi.getMiYouList(params).then(res => {
					this.pageObj.total = res.total;
					this.dataList = this.dataList.concat(res.records);
					if (this.dataList.length < this.pageObj.total) {
						this.status = 'loadmore';
					} else {
						this.status = 'nomore';
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		color: #333;
		background: #fff;
	}

	.nav-bar {
		@include nav-bar-title(#000000);
	}

	.container {
		width: 100vw;
		padding: 20rpx 30rpx 30rpx 30rpx;
		box-sizing: border-box;
		background-color: #fff;
	}

	.tui-searchbox {
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-search-input {
		width: 100%;
		height: 66rpx;
		border-radius: 35rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #F7F7F7;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;

		.search-icon {
			width: 26rpx;
			height: 26rpx;
		}
	}

	.tui-input-plholder {
		font-size: 28rpx;
		color: #b2b2b2;
	}

	.tui-input {
		flex: 1;
		color: #000000;
		background-color: #F7F7F7;
		padding: 0 16rpx;
		font-size: 28rpx;
	}

	.search-result {
		padding: 10rpx 0;
	}

	.search_sticky {
		position: fixed;
		top: calc(78rpx + var(--status-bar-height));
		right: 0;
		left: 0;
		background: #FFFFFF;
		z-index: 99;
	}

	.case-list {
		display: flex;
		flex-direction: column;

		.c-item {
			display: flex;
			flex-direction: column;
			margin-bottom: 16rpx;
			padding: 20rpx 0;
			background-color: #FFFFFF;
			border-radius: 30rpx;


			.c-item-describe {
				display: flex;
				justify-content: space-between;

				.case-name {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #303133;
					width: 440rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.view-details {
					font-size: 24rpx;
					line-height: 34rpx;
					text-align: right;
					color: #FF5D35;
					display: flex;
					flex-direction: row;
					align-items: center;

					.img {
						margin-left: 4rpx;
						width: 16rpx;
						height: 16rpx;
					}
				}
			}
		}

		.c-item-image {
			border-radius: 10rpx;
			width: 100%;
			height: 330rpx;
			margin-bottom: 14rpx;
		}

		.c-contain {
			display: flex;
			flex-direction: row;

			.c-item-image-left {
				width: 346rpx;
				height: 338rpx;
				margin-right: 14rpx;
				border-radius: 10rpx;
			}
		}

		.c-item-image-right {
			.c-item-image {
				width: 340rpx;
				height: 162rpx;
			}
		}
	}
</style>
