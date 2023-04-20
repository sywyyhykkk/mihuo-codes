<template>
	<div class="shop">
		<z-nav-bar>
			<view slot="right" @click="goToSearchPage" class="search-box flex-center">
				<image class="icon" src="https://www.51mihuo.com/static/icon/home_v3/search-26x26.png"></image>
				<text>{{ formData.keyword || "搜索" }}</text>
			</view>
		</z-nav-bar>
		<view class="shop-info" v-if="shop">
			<view class="shop-item">
				<image class="shop_logo" :src="$util.thumbnailImage(shop.companyLogo)" mode="aspectFit"></image>
				<view class="shop_news">
					<view class="shop_news-name" >
						<view class="shop_name">{{ shop.companyShortName }}</view>
						<u-icon v-if="shop.companyId" size="38" :name="isCollect?'star-fill':'star'" :custom-style="{
							padding:'10rpx 20rpx'
						}" @click="collectShop" :color="isCollect?'#FE6E32':''"></u-icon>
					</view>
					<view class="shop_detail">{{ shop.completeAddress || '暂无'}}</view>
					<view class="shop_call">
						<u-icon label="联系客服" name="chat-fill" @click="goChart(shop,'客服')" :custom-style="styleObj">
						</u-icon>
						<u-icon label="电话" name="phone-fill" @click="goChart(shop,'电话')"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view id="shop-search" :class="{
			'search_sticky':false
		}">
			<u-dropdown border-bottom active-color="#FE6E32" ref="uDropdown" :customIndex="3"
				@customCallback="changeSearch($event,'价格')">
				<u-dropdown-item class="dropdown-menu" v-model="generalQuery" :title="titleObj.compreName"
					:options="searchList.compreList" @change="changeSearch($event,'综合')">
				</u-dropdown-item>
				<u-dropdown-item class="dropdown-menu" v-model="formData.productCategoryTreeCode"
					:title="titleObj.categoryName">
					<view class="slot-content" style="background-color: #FFFFFF;">
						<scroll-view scroll-y="true">
							<mall-mh-tree :data="searchList.categoryList" @click="checkNode"></mall-mh-tree>
						</scroll-view>
					</view>
				</u-dropdown-item>
				<u-dropdown-item class="dropdown-menu" height="400rpx" v-model="formData.brandId"
					:title="titleObj.brandName" :options="searchList.brandList" @change="changeSearch($event,'品牌')">
				</u-dropdown-item>
				<u-dropdown-item class="dropdown-menu" v-model="generalQuery" :title="titleObj.priceName"
					:options="searchList.priceList">
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view id="sku_list" class="shop-mall" v-if="mallList && mallList.length">
			<view class="mall-list flex-center">
				<mall-mh-u-waterfall v-model="mallList" ref="waterfall">
					<template  v-slot:left="{ leftList }">
						<view class="mall-item" :key="index" v-for="(item, index) in leftList">
							<commodity-card :commodity="item" :isShowCompanyInfo="false" />
						</view>
					</template>
					<template v-slot:right="{ rightList }">
						<view class="mall-item flex-center" style="justify-content: flex-end" :key="index"
							v-for="(item, index) in rightList">
							<commodity-card :commodity="item" :isShowCompanyInfo="false" />
						</view>
					</template>
				</mall-mh-u-waterfall>
			</view>
			<u-loadmore :status="status" />
		</view>
		<mh-empty v-if="mallList.length === 0 " title="暂无商品信息～～" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				generalQuery: '',
				options: {},
				formData: {},
				shop: {},
				styleObj: {
					marginRight: '40rpx'
				},
				isCollect: false,
				isSticky: false,
				searchHeight: 0,
				height: 0,
				mallList: [],
				pageObj: {
					currentPage: 1,
					size: 20,
					total: 0
				},
				status: 'nomore',
				searchList: { //检索条件
					compreList: [{
							label: '综合排序',
							value: ''
						},
						{
							label: '销量优先',
							value: 'SALE'
						},
					], //综合
					brandList: [], //品牌列表
					categoryList: [], //品牌分类列表
					priceList: [{
							label: '全部',
							value: ''
						},
						{
							label: '从高到低',
							value: 'PRICE_DESC'
						},
						{
							label: '从低到高',
							value: 'PRICE_ASC'
						},
					], //价格
				},
				titleObj: {
					compreName: '综合',
					categoryName: '分类',
					brandName: '品牌',
					priceName: '价格',
				},
				titleObjBack: {
					compreName: '综合',
					categoryName: '分类',
					brandName: '品牌',
					priceName: '价格',
				},
				curTitleIndex: null,
				isCityOperatorProduct: false
			};
		},
		onLoad(options) {
			this.options = options;
			if (options.cityOperatorId) {
				// 运营商商品
				this.isCityOperatorProduct = true
				this.shop = JSON.parse(options.data)
			} else {
				// 获取企业信息
				this.getShopInfo()
				// 查询是否已经收藏
				this.getIsCollect()
			}
			// 获取商品列表
			this.getListData()
			// 获取品牌列表
			this.getBrandList()
			// 获取分类列表
			this.getCategoryList()
		},
		onShow() {
			uni.$once('search', (data) => {
				if (data) {
					this.changeSearch(data.searchText, '关键字')
				}
			})
			if (uni.getStorageSync('shopSticky')) {
				this.isSticky = uni.getStorageSync('shopSticky')
			}
		},
		mounted() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query.select('#shop-search').boundingClientRect(data => {
					this.searchHeight = data.height + 88
				}).exec()
			})
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			this.isSticky = this.scrollTop > this.searchHeight ? true : false;
			// 记录是否吸顶
			uni.removeStorageSync('shopSticky');
			uni.setStorageSync('shopSticky', this.isSticky)
		},
		// 滚动到底部加载更多
		onReachBottom() {
			if (this.mallList.length === Number(this.pageObj.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pageObj.size += 20
				setTimeout(() => {
					this.getListData()
				}, 200)
			}
		},
		methods: {
			// 查看是否关注过店铺
			getIsCollect() {
				if (!uni.getStorageSync('userData')) return
				this.$httpApi.getFavShopCollect(this.options.companyId)
					.then(res => {
						this.isCollect = res == 1 ? true : false
					})
			},
			goToSearchPage() {
				this.toPage("/pages-common/searchPage/searchPage?type=shop");
			},
			changeSearch(e, type) {
				this.titleObj = Object.assign({}, this.titleObjBack);
				this.formData = {};
				switch (type) {
					case '综合':
						this.generalQuery = e;
						if (e) {
							this.titleObj.compreName = this.searchList.compreList.find(
								(item) => item.value === e
							).label
						} else {
							this.titleObj.compreName = type;
						}
						break;
					case '分类':
						this.formData.productCategoryTreeCode = e.treeCode;
						if (e.treeCode) {
							this.titleObj.categoryName = e.name
						} else {
							this.titleObj.categoryName = type;
						}
						break;
					case '品牌':
						this.formData.brandId = e;
						if (e) {
							this.titleObj.brandName = this.searchList.brandList.find(
								(item) => item.value === e
							).label
						} else {
							this.titleObj.brandName = type;
						}
						break;
					case '价格':
						if (e == 0) {
							this.titleObj.priceName = '价格'
							this.generalQuery = ''
						} else {
							this.titleObj.priceName = e == 1 ? '从低到高' : '从高到低';
							this.generalQuery = e == 1 ? 'PRICE_ASC' : 'PRICE_DESC';
						}
						break;
					case '关键字':
						this.formData.keyword = e;
						break;
					default:
						break;
				}
				this.$refs.waterfall && this.$refs.waterfall.clear();
				this.mallList = [];
				this.getListData();
			},
			// 获取店铺详情
			getShopInfo() {
				this.$httpApi.getShopNews({
					companyIds: this.options.companyId
				}).then(res => {
					if (res && res.length) {
						this.shop = res[0];
					}
				})
			},
			collectShop() {
				if (uni.getStorageSync('userData')) {
					let url = ''
					let title = '收藏店铺成功'
					if (this.isCollect) {
						url = `admin/company/cancleFocus/${this.shop.companyId}`,
							title = '取消收藏成功'
					} else {
						url = `admin/company/focus/${this.shop.companyId}`,
							title = '收藏店铺成功'
					}
					this.$http.get(url).then(res => {
						if (res) {
							this.$util.toast(title)
						}
					})
					this.isCollect = !this.isCollect;
				} else {
					this.$util.goToLoginPage()
				}
			},
			goChart(data, type) {
				switch (type) {
					case '客服':
						this.$util.goToWeixin();
						break;
					case '电话':
						if (!data.contactTel) {
							this.$util.toast("该店铺暂未设置联系电话")
						} else {
							uni.makePhoneCall({
								phoneNumber: data.contactTel,
							});
						}
						break;
					default:
						break;
				}
			},
			// 获取品牌列表
			getBrandList() {
				let params
				if (this.isCityOperatorProduct) {
					params = {
						cityOperatorId: this.options.cityOperatorId,
					}
				} else {
					params = {
						companyId: this.options.companyId
					}
				}
				this.$httpApi.getAllBrand(params).then(res => {
						res.map(v => {
							v.label = v.name;
							v.value = v.id;
						})
						res.unshift({
							label: '全部',
							value: ''
						})
						this.searchList.brandList = res;
					})
			},
			// 获取品牌分类
			getCategoryList() {
				let params
				if (this.isCityOperatorProduct) {
					params = {
						cityOperatorId: this.options.cityOperatorId,
					}
				} else {
					params = {
						companyId: this.options.companyId
					}
				}
				this.$httpApi.getAllCategory(params)
					.then(res => {
						if (res) {
							res.unshift({
								name: '全部',
								treeCode: ''
							})
							this.searchList.categoryList = res
						}
					})
			},
			// 获取店铺商品列表
			getListData() {
				let params
				if (this.isCityOperatorProduct) {
					params = {
						size: this.pageObj.size,
						cityOperatorFlag: 1,
						cityOperatorId: this.options.cityOperatorId,
						platformType: 2,
						'orders[0].column': this.generalQuery,
						...this.formData
					}
				} else {
					params = {
						size: this.pageObj.size,
						companyId: this.options.companyId,
						platformType: 2,
						'orders[0].column': this.generalQuery,
						...this.formData
					}
				}
				this.$httpApi.getMallData(params)
					.then((res) => {
						if (res && res.records) {
							this.mallList = res.records;
							this.pageObj.total = res.total
						}
					})
			},
			checkNode(data) {
				this.$refs.uDropdown.close();
				this.changeSearch(data, '分类')
			}
		},
	};
</script>

<style scoped lang="scss">
	.search_sticky {
		position: fixed;
		top: calc(78rpx + var(--status-bar-height));
		right: 0;
		left: 0;
		background: #FFFFFF;
		z-index: 99;
	}

	.shop {
		// padding: 0 30rpx;
		box-sizing: border-box;
	}

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

	.flex-center {
		display: flex;
		align-items: center;
	}

	.shop-info {
		padding: 20rpx 30rpx;
		box-sizing: border-box;

		.shop-item {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.shop_logo {
				max-height: 75rpx;
				max-width: 75rpx;
				border-radius: 12rpx;
			}

			.shop_news {
				flex: 1;
				padding-left: 20rpx;

				.shop_news-name {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.shop_name {
						font-size: 32rpx;
						font-weight: bold;
					}

					.shop_go {
						color: #A8A8A8;
						font-size: 26rpx;
						flex-shrink: 0;
					}
				}

				.shop_detail {
					font-size: 26rpx;
					color: #808080;
					padding-bottom: 10rpx;
				}
			}
		}
	}

	.shop-mall {
		width: 690rpx;
		margin: 0 30rpx;
		flex-direction: column;

		.mall-list {
			width: 690rpx;
			margin-top: 30rpx;
			flex-direction: row;
			justify-content: space-between;

			.mall-item {
				width: 345rpx;
			}
		}
	}

	.shop-search {
		width: 100%;
		height: 60rpx;

		.search-List {
			display: flex;
			align-items: center;
			text-align: center;

			.search-List_item {
				flex: 1;
			}
		}
	}

	.dropdown-menu {
		background-color: #ffffff;
		border-radius: 0 0 10rpx 10rpx;
	}

	.u-dropdown {
		width: initial;
	}
</style>
