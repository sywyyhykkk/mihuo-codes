<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="right" @click="goToSearchPage" class="search-box flex-center">
				<image class="icon" src="https://www.51mihuo.com/static/icon/home_v3/search-26x26.png"></image>
				<text>{{ pageTitle || "搜索" }}</text>
			</view>
		</z-nav-bar>
		<view class="main-container">
			<view class="header-container">
				<u-swiper v-if="swiperImgList.length !== 0" :list="swiperImgList" :autoplay="true" :interval="5000"
					:duration="500" :circular="true">
				</u-swiper>
			</view>
			<view class="dropdown-container">
				<u-dropdown active-color="#FF5D35" ref="uDropdown" :customIndex="2" @customCallback="changePriceSort">
					<u-dropdown-item v-model="generalParam" :title="title1" :options="genOptions" @change="selectGen">
					</u-dropdown-item>
					<u-dropdown-item height="600" v-model="brandId" :title="title2" :options="brandOptions"
						@change="selectBrand">
					</u-dropdown-item>
					<u-dropdown-item v-model="generalParam" :title="title3" :options="priceOptions">
					</u-dropdown-item>
				</u-dropdown>
			</view>
			<view class="list-container" v-if="dataList.length != 0">
				<scroll-view scroll-y="true" class="content" @scrolltolower="loadMore">
					<mall-mh-u-waterfall v-model="dataList" ref="waterfall">
						<template v-slot:left="{ leftList }">
							<view class="mall-item flex-center" :key="index" v-for="(item, index) in leftList"
								@click="goToProductDetail(item)">
								<mall-mh-commodity-card :commodity="item" />
							</view>
						</template>
						<template v-slot:right="{ rightList }">
							<view class="mall-item flex-center" :key="index" v-for="(item, index) in rightList"
								@click="goToProductDetail(item)">
								<mall-mh-commodity-card :commodity="item" />
							</view>
						</template>
					</mall-mh-u-waterfall>
					<view style="height: 80rpx;">
						<u-loadmore :status="status" />
					</view>
				</scroll-view>
			</view>
			<mh-empty v-else title="暂时没有相关商品~"></mh-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageTitle: '',
				cityOperatorId: uni.getStorageSync('cityOperatorId'),
				dataList: [],
				status: 'loadmore',
				total: 0,
				current: 1,
				categoryId: '',
				treeCode: '',
				swiperImgList: [],
				genOptions: [{
						label: '综合排序',
						value: 'RELATED'
					},
					{
						label: '销量优先',
						value: 'SALE'
					},
				],
				brandOptions: [{
					label: '全部',
					value: ''
				}],
				priceOptions: [{
						label: '从低到高',
						value: 'PRICE_ASC',
					},
					{
						label: '从高到低',
						value: 'PRICE_DESC',
					},
				],
				brandId: '',
				generalParam: 'RELATED',
				searchText: '',
				title1: '综合排序',
				title2: '品牌',
				title3: '价格',
			}
		},
		onShow() {
			this.title1 = '综合排序';
			this.title2 = '品牌';
			this.title3 = '价格';
			const keyword = getApp().globalData.productSearchText
			if (keyword) {
				this.searchText = keyword
				this.pageTitle = keyword
				this.treeCode = ''
				this.brandId = ''
				this.generalParam = 'RELATED'
				this.dataList = [];
				this.$refs.waterfall && this.$refs.waterfall.clear()
			}
		},
		onLoad(options) {
			if (options.data) {
				let data = JSON.parse(decodeURIComponent(options.data));
				if (data.bannerImg) {
					data.bannerImg.split(',').forEach(item => {
						this.swiperImgList.push({
							image: this.$image.imageGlobal + item
						})
					})
				}
				this.brandId = data.brandId || ''
				this.searchText = data.searchText || ''
				this.treeCode = data.treeCode || ''
				this.categoryId = data.categoryId || ''
				this.pageTitle = data.pageTitle
			}
			this.getBrand();
			this.getData();
		},
		methods: {
			// 跳转搜索页
			goToSearchPage() {
				uni.setStorageSync('preSearchPage', 'cateList')
				this.toPage("/pages-common/searchPage/searchPage?type=cateList");
			},
			// 返回上一页
			goBackPage() {
				let pre = uni.getStorageSync('preSearchPage');
				switch (pre) {
					case 'home':
						this.toTab('/pages/home/home');
						break;
					case 'category':
						this.toTab('/pages/category/category');
						break;
					default:
						this.goBack();
						break;
				}
				getApp().globalData.productSearchText = '';
			},
			getBrand() {
				// 获取相关品牌
				this.$httpApi.getBrandsByDataType({
					productCategoryTreeCode: this.treeCode,
					cityOperatorId: this.cityOperatorId,
					keyword: this.searchText,
					brandId: this.brandId
				}).then(res => {
					res.forEach(item => {
						this.brandOptions.push({
							label: item.name,
							value: item.id,
							data: item
						});
					});
				});
			},
			getData() {
				let sort = 0
				if(this.generalParam){
					sort = {
						'RELATED': 0,
						'SALE': 2,
						'PRICE_ASC': 3,
						'PRICE_DESC': 4
					}[this.generalParam]
				} 
				let params = {
					sort,
					productCategoryCode: this.treeCode,
					cityOperatorId: this.cityOperatorId,
					pageSize: 10,
					pageNum: this.current - 1,
					brandId: this.brandId,
					keyword: this.searchText,
					cityOperatorFlag: 2 // 查询运营商旗下所有企业的商品
				}
				// searchProductPage
				this.$httpApi.searchProductPage(params).then(res => {
					getApp().globalData.productSearchText = ''
					this.total = res.total;
					this.dataList = this.current > 0 ? this.dataList.concat(res.records) : res.records
					if (this.dataList.length < this.total) {
						this.status = 'loadmore';
					} else {
						this.status = 'nomore';
					}
				});
			},
			loadMore() {
				if (this.dataList.length === this.total) {
					this.status = 'nomore';
					return;
				}
				this.status = 'loading';
				this.current += 1;
				this.getData();
			},
			// 价格排序
			changePriceSort(item) {
				if (item == 0) {
					this.title3 = '价格'
					this.generalParam = ''
				} else {
					this.title3 = item == 1 ? '从低到高' : '从高到低';
					this.generalParam = item == 1 ? 'PRICE_ASC' : 'PRICE_DESC';
				}
				this.dataList = [];
				this.$refs.waterfall && this.$refs.waterfall.clear()
				this.current = 1
				this.getData();
			},
			// 综合排序
			selectGen(item) {
				this.dataList = [];
				this.$refs.waterfall && this.$refs.waterfall.clear()
				this.generalParam = item;
				this.title1 = item === 'SALE' ? '销量优先' : item === 'SCORE' ? '评分优先' : '综合排序';
				this.current = 1;
				this.getData();
			},
			// 品牌筛选
			selectBrand(item) {
				this.$refs.uDropdown.close();
				if (item) {
					this.brandOptions.forEach(item2 => {
						if (item2.value === item) {
							this.title2 = item2.label;
							this.brandId = item;
						}
					});
				} else {
					this.title2 = '品牌';
					this.brandId = ''
				}
				// TODO 品牌筛选
				this.current = 1
				this.dataList = [];
				this.$refs.waterfall && this.$refs.waterfall.clear()
				this.getData();
			},
			goToProductDetail(item) {
				this.toPage(`/pages-mall/productDetail/productDetail?id=${item.id}`);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search-box {
		width: 450rpx;
		/* #ifndef MP */
		width: 620rpx;
		/* #endif */
		height: 64rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
		padding: 20rpx;
		margin: 0 30rpx;
		position: relative;

		.icon {
			width: 26rpx;
			height: 26rpx;
		}

		text {
			margin-left: 12rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 24rpx;
			line-height: 40rpx;
			color: #999999;
		}
	}

	.main-container {
		width: 100vw;
		height: max-content;
		background-color: #FFFFFF;

		.header-container {
			width: 690rpx;
			margin: 0rpx 30rpx;

			.swiper-img {
				width: 690rpx;
				border-radius: 10rpx;
			}
		}

		.dropdown-container {
			width: 100vw;
			border-radius: 20rpx 20rpx 0 0;
		}

		.list-container {
			width: 100%;
			height: calc(100vh - 176rpx - env(safe-area-inset-bottom));
			/* #ifdef MP */
			height: calc(100vh - 132rpx - env(safe-area-inset-bottom));
			/* #endif */
			background-color: #FFFFFF;
			padding: 0 20rpx;
			padding-bottom: calc(constant(safe-area-inset-bottom));
			padding-bottom: calc(env(safe-area-inset-bottom));

			.content {
				width: 100%;
				height: 100%;

				.mall-item {
					justify-content: center;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
