<template>
	<view>
		<z-nav-bar backState="2000" :showTouTiao="true" color="#fff" style="background: black">
			<view slot="left" @click="goToSearchPage" class="flex-center search-box">
				<image class="icon" src="https://www.51mihuo.com/static/icon/home_v3/search-26x26.png"></image>
				<text>{{ searchText || '搜索' }}</text>
			</view>
			<view slot="right" class="right-icon">
				<view class="count" v-if="shoppingCartCount">
					{{ shoppingCartCount }}
				</view>
				<image @click="goToShoppingCart" class="icon"
					src="https://www.51mihuo.com/static/icon/home_v3/sc-62x62.png"></image>
			</view>
		</z-nav-bar>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="merscrollTop" :down="downOption" :up="upOption"
			@down="downCallback" @up="upCallback">
			<view class="header-container">
				<view class="flex-center tabs">
					<view class="flex-center" :class="currentTab === index ? 'tab-active' : 'tab'"
						v-for="(item, index) in cateList" :key="item.treeCode" @click="changeTab(index, item)">
						{{ item.name }}
					</view>
				</view>
			</view>
			<view class="main-container" v-if="navBarItems.length">
				<scroll-view class="left-nav-bar" :scroll-y="true">
					<view v-for="(item, index) in navBarItems" :key="item.categoryId"
						@click="changeNavBarItem(index, item)"
						:class="[ currentNavBarItem === index ? 'nav-bar-item-active' : 'nav-bar-item' ]"
						class="flex-center">
						<u-lazy-load v-if="item.icon" imgMode="scallToFill" height="40"
							:image="$util.thumbnailImage(item.icon, true, 40)" class="category-icon">
						</u-lazy-load>
						<view class="flex-center nav-bar-title" v-if="item.name">
							<view class="nav-bar-border" v-if="currentNavBarItem === index"></view>
							{{ item.name.substring(0, 4) }}
						</view>
					</view>
				</scroll-view>
				<scroll-view class="right-content" :scroll-y="true">
					<mh-skeleton v-if="!isShowPage" :loading="!isShowPage" :imgTitleHeight="400" :row="6"></mh-skeleton>
					<view v-else>
						<view v-for="(item, index) in richText" :key="index">
							<!-- 文本内容 -->
							<view class="base-item" v-if="item.type === 'word'" :style="[getStyle(item.style)]">
								{{ item.content }}
							</view>
							<!-- 图标标题 -->
							<view v-if="item.type === 'icontitle' && item.style['iconUrl'] !== 'under_line'"
								:class="item.type" :style="[getStyle(item.style)]" class="base-item">
								<view v-if="item.style['size'].textAlign === 'center'" style="margin-right: 20rpx"
									class="divider"></view>
								<u-lazy-load v-if="item.style['iconUrl'] !== 'no_title'"
									:image="getSrc(item.style['iconUrl'])" class="icon" imgMode="widthFix">
								</u-lazy-load>
								<view :style="[getStyle(item.style)]">
									{{ item.content }}
								</view>
								<view v-if="item.style['size'].textAlign === 'center'" style="margin-left: 20rpx"
									class="divider"></view>
							</view>
							<view v-if="item.type === 'icontitle' && item.style['iconUrl'] === 'under_line'"
								:class="item.type" :style="[getStyle(item.style)]" class="base-item">
								<view :style="[getStyle(item.style)]" class="under_line">
									{{ item.content }}
								</view>
							</view>
							<!-- 链接位 -->
							<view v-if="item.type === 'gridImageText'" class="grid-container base-item">
								<view class="grid-item" v-for="(gridItem, gridIndex) in item.data.textContent"
									@click="itemClicked('gridImageText', gridItem)" :key="gridIndex"
									:style="[getGridImageStyle(item.data)]">
									<u-lazy-load :image="$util.thumbnailImage(gridItem.imageUrl, true, 624)"
										duration="0" :isEffect="false" 
										:style="[getImageStyle(item.data)]" imgMode="widthFix"></u-lazy-load>
									<view class="title-container"
										v-if="item.data.titleShow == '1' || item.data.subtitleShow == '1'">
										<view class="title" v-if="item.data.titleShow == '1' && gridItem.title"
											:style="{ textAlign: item.data.subtitleShow == '1' ? 'left' : 'center'}">
											{{ gridItem.title.substring(0, 10) }}
										</view>
										<view class="des" v-if="item.data.subtitleShow == '1'">
											{{ gridItem.subtitle }}
										</view>
									</view>
								</view>
							</view>
							<!-- 九宫格/田字格 -->
							<view v-if="item.type === 'imageGrid'" class="grid-container base-item">
								<view class="grid-item" v-for="(gridItem, gridIndex) in getGridArr(item.data.gridSrc)"
									@click="itemClicked(item.data.gridSrc, gridItem)" :key="gridIndex"
									:style="[getGridStyle(item.data)]">
									<u-lazy-load
										duration="0" :isEffect="false" 
										:image="$util.thumbnailImage(gridItem.logo || gridItem.categoryIcon, true, 624)"
										:style="[getBoxImageStyle(item.data)]" imgMode="widthFix" :is-effect="false">
									</u-lazy-load>
									<view class="title-container">
										<view class="title" v-if="gridItem.categoryName"
											:style="{ textAlign: item.data['gridType'] === 'four' ? 'left' : 'center'}">
											{{ gridItem.categoryName.substring(0, 6) }}
										</view>
										<view class="title" v-if="gridItem.name"
											:style="{ textAlign: item.data['gridType'] === 'four' ? 'left' : 'center' }">
											{{ gridItem.name.substring(0, 6) }}
										</view>
										<view class="des" v-if="item.data['gridType'] === 'four'">
											{{ gridItem.description }}
										</view>
									</view>
								</view>
							</view>
							<!-- 商品 -->
							<view v-if="item.type === 'productItem'" class="base-item">
								<view class="product-item" v-for="(hotSaleItem, hotSaleIndex) in hotSaleProducts"
									:key="hotSaleIndex" @click="itemClicked('product', hotSaleItem)">
									<u-lazy-load border-radius="16" imgMode="scallToFill" height="170"
										:image="$util.thumbnailImage(hotSaleItem.coverImg, true, 232)"
										class="producte-img">
									</u-lazy-load>
									<view class="title-container">
										<view class="product-title"> {{ hotSaleItem.name }} </view>
										<view class="price">
											¥{{ hotSaleItem.price }}
											<text v-if="hotSaleItem.originalPrice" class="origin-price">
												¥{{ hotSaleItem.originalPrice }}</text>
										</view>
									</view>
								</view>
							</view>
							<!-- 案例 -->
							<view v-if="item.type === 'caseItem'" class="base-item">
								<view class="case-item" v-for="(caseItem, caseIndex) in caseList" :key="caseIndex"
									@click="itemClicked('case', caseItem)">
									<u-lazy-load border-radius="16" imgMode="scallToFill" height="170"
										:image="$util.thumbnailImage(caseItem.coverPic.split(',')[0], true, 232)"
										class="case-img">
									</u-lazy-load>
									<view class="case-title"> {{ caseItem.name }} </view>
								</view>
							</view>
							<!-- 图片 -->
							<view v-if="item.type === 'images'" class="base-item" @click="itemClicked('image', item)">
								<image border-radius="16" mode="widthFix"
									v-if="item.listdata[0] && item.listdata[0].url"
									:src="$util.thumbnailImage(item.listdata[0].url, true)" class="image-item">
								</image>
							</view>
							<!-- 链接 -->
							<view v-if="item.type === 'link'" class="base-item" @click="itemClicked('link', item)">
								<u-lazy-load :image="$util.thumbnailImage(item.listdata[0].url, true)" duration="0"
									:isEffect="false" v-if="item.listdata[0] && item.listdata[0].url" class="image-item"
									imgMode="widthFix">
								</u-lazy-load>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<mh-empty v-else :title="(cateList && cateList.length)?'网络不佳,请检查网络设置':'暂无分类内容'"></mh-empty>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		debounce
	} from '@/plugins/utils.js'

	export default {
		data() {
			// #ifdef APP-PLUS
			const top = 144
			// #endif
			// #ifdef H5
			const top = 104
			// #endif
			// #ifdef MP-WEIXIN
			const top = 144
			// #endif
			// #ifdef MP-TOUTIAO
			const top = 80
			// #endif
			return {
				merscrollTop: top,
				downOption: {
					auto: false
				},
				upOption: {
					auto: false,
					use: false
				},
				cateList: [], // 一级分类列表
				currentTab: 0, // 当前所选一级分类
				currentNavBarItem: 0, // 当前所选二级分类
				thirdCategories: [],
				caseList: [], // 案例列表
				hotSaleProducts: [], // 热销商品
				hotSaleBrands: [], // 热销推荐品牌
				treeCode: '',
				searchText: '',
				treeCodeFromBanner: '',
				groups: [], // 栏目
				richText: [],
				iconTitle1: 'https://www.51mihuo.com/static/images/icon_title.png',
				iconTitle2: 'https://www.51mihuo.com/static/images/icon_title2.png',
				iconTitle3: 'https://www.51mihuo.com/static/images/icon_title3.png',
				groupCode: '',
				groupId: '',
				cityOperatorId: uni.getStorageSync('cityOperatorId'),
				isShowPage: true, // 是否显示内容页
				isShowCategoryGrid: false, // 是否显示分类grid
				isShowBrandGrid: false, // 是否显示品牌grid
				categoryId: 0,
				shoppingCartCount: 0,
				currentCategory: {}, // 当前选择的分类
				isLoad: false, // 是否首次加载
				options: {}
			}
		},
		// 删除当前选中进入【分类】tab菜单里的标签index
		onTabItemTap() {
			try {
				uni.removeStorageSync('tabIndex')
			} catch (e) {
				console.error(e.message)
			}
		},
		onShareAppMessage() {
			const category = this.navBarItems[this.currentNavBarItem]
			const coverImg = ''
			const path = `/pages/category/category?isFromShare=1&treeCode=${this.treeCode}`
			const result = this.$util.shareToWechat(category.name, coverImg, path, '商城分类', true, 1, category.description ||
				'')
			return result
		},
		onLoad(options) {
			this.options = options
			this.getCaseList()
			if (this.cateList.length === 0) {
				this.getTree()
				this.isLoad = true
			}
			if (options.isFromShare == '1') {
				this.reportShareLog()
				uni.setStorageSync('treeCode', options.treeCode)
			}
		},
		onShow() {
			const treeCode = uni.getStorageSync('treeCode')
			if (treeCode) {
				this.treeCodeFromBanner = treeCode
				uni.removeStorageSync('treeCode')
				this.getCaseList()
				if (!this.isLoad) {
					this.getTree()
				}
			} else {
				if (this.cityOperatorId != uni.getStorageSync('cityOperatorId')) {
					this.cityOperatorId = uni.getStorageSync('cityOperatorId')
					this.treeCode = ''
					this.categoryId = 0
					this.richText = []
					this.currentNavBarItem = 0
					this.currentTab = 0
					if (!this.isLoad) {
						this.getTree()
					}
				}
			}
			if (uni.getStorageSync('treeCodeHome')) {
				this.treeCode = uni.getStorageSync('treeCodeHome')
				this.getTree()
			}
			this.getShoppingCartCount()
		},
		watch: {
			'$store.state.netStatus': {
				handler: function(newVal, oldVal) {
					if (newVal) {
						this.getTree()
						this.getCaseList()
					}
				},
				immediate: true
			}
		},
		computed: {
			navBarItems() {
				if (this.cateList && this.cateList.length === 0) return []
				return this.cateList[this.currentTab].subCagetories
			}
		},
		methods: {
			// 上报分享链接打开事件
			reportShareLog() {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('商品分类', url, this.options.userId)
			},
			downCallback() {
				this.getData(true)
				this.getCaseList()
				setTimeout(() => {
					this.mescroll.endBySize(10, true)
				}, 500)
			},
			upCallback() {},
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			// 获取购物车商品数量
			getShoppingCartCount() {
				if (uni.getStorageSync('userData')) {
					this.$httpApi.getShoppingCartCount().then(res => {
						this.shoppingCartCount = res
					})
				} else {
					this.shoppingCartCount = 0
				}
			},
			getGridArr(type) {
				return type === 'brand' ? this.hotSaleBrands : this.thirdCategories
			},
			getTree(isRefresh = false) {
				// 1. 获取分类树
				this.$httpApi
					.getCategoryDataByTreeCode({
						operatorId: this.cityOperatorId
					})
					.then(res => {
						if (res) {
							this.cateList = res
							// 首页点击跳转
							const treeCode = uni.getStorageSync('treeCodeHome')
							if (treeCode) {
								res.some((item, index) => {
									if (item.treeCode == treeCode) {
										this.changeTab(index, item);
										uni.removeStorageSync('treeCodeHome');
										return
									}
								})
							} else {
								this.categoryId = res[0].subCagetories[0].categoryId
								this.treeCode = res[0].subCagetories[0].treeCode
								this.currentCategory = res[0].subCagetories[0]
								this.getData(isRefresh)
							}
						}
					})
			},
			// 各种类型item点击事件
			itemClicked(type, item) {
				switch (type) {
					case 'brand':
						uni.setStorageSync('preSearchPage', 'category')
						let brandInfo = {
							brandId: item.id,
							pageTitle: item.name
						}
						let brandStr = encodeURIComponent(JSON.stringify(brandInfo))
						this.toPage(`/pages-mall/cateList/cateList?data=${brandStr}`)
						break
					case 'category':
						uni.setStorageSync('preSearchPage', 'category')
						let categoryInfo = {
							categoryId: item.categoryId,
							treeCode: item.levelTreeCode,
							bannerImg: item.bannerImg,
							pageTitle: item.categoryName
						}
						let categoryStr = encodeURIComponent(JSON.stringify(categoryInfo))
						this.toPage(`/pages-mall/cateList/cateList?data=${categoryStr}`)
						break
					case 'product':
						// 跳转商品详情
						this.toPage(`/pages-mall/productDetail/productDetail?id=${item.id}`)
						break
					case 'case':
						// 跳转到案例详情
						this.toPage(`/pages-common/case/design/details?id=${item.id}`)
						break
					case 'image':
						console.log(item)
						break
					case 'link':
						if (item.listdata[0].linkProduct.length !== 0) {
							// 跳转到商品
							this.toPage(
								`/pages-mall/productDetail/productDetail?id=${item.listdata[0].linkProduct[0].id}`
							)
						} else if (item.listdata[0].linkCms.length !== 0) {
							// 跳转到CMS
							this.toPage(
								`/pages/home/article?id=${item.linkData.linkCms[0].id}&title=${item.listdata[0].linkCms[0].title}}`
							)
						}
						break
					case 'gridImageText':
						if (
							item.title === '品牌专区' ||
							item.linkData.appPage === '/pages-common/brandZone/brandZone'
						) {
							// 跳转品牌专区
							this.toPage(
								`/pages-common/brandZone/brandZone?treeCode=${this.treeCode}&banner=${this.currentCategory.bannerImg}`
							)
							return
						}
						if (item.linkData) {
							if (!item.linkData.appPage) return
							let appPage = item.linkData.appPage.replace(
								'pages/mall',
								'pages-mall'
							)
							if (item.linkData.linkItem && item.linkData.linkItem.length !== 0) {
								this.toPage(appPage + '?id=' + item.linkData.linkItem[0].id)
							} else if (item.linkData.linkCms) {
								this.toPage(
									`/pages/home/article?id=${item.linkData.linkCms[0].id}&title=${item.linkData.linkCms[0].title}`
								)
							} else if (item.linkData.link) {
								if (appPage.includes('brandId')) {
									// 关联品牌
									this.goToCateListFromClick(
										item.linkData.link,
										'brand',
										item.linkData.linkBrand
									)
								} else {
									// 跳到分类列表
									const arr = this.cateList.flatMap(item => item.subCagetories)
									const category = arr.find(cate => cate.treeCode == item.linkData.link)
									if (category && category.categoryId) {
										// 找到treeCode对应的categoryId
										const data = {
											categoryId: category.categoryId,
											treeCode: category.treeCode
										}
										uni.setStorageSync('preSearchPage', 'category')
										this.toPage(`/pages-mall/cateList/cateList?data=${JSON.stringify(data)}`)
									} else {
										this.goToCateListFromClick(item.linkData.link)
									}
								}
								return
								let treeCode = item.linkData.link.split('-')
								if (treeCode.length === 1) {
									// 跳到一级分类，默认选中第一个二级分类
									this.toCategoryTab(treeCode[0])
								} else if (treeCode.length === 2) {
									// 跳到二级分类
									this.toCategoryTab(treeCode[0])
									setTimeout(() => {
										this.toNavbarItem(treeCode.join('-'))
									}, 100)
								} else if (treeCode.length === 3) {
									// 跳到分类列表
									this.goToCateListFromClick(treeCode.join('-'))
								}
							}
						}
						break
					default:
						console.log(type, item)
						break
				}
			},
			toCategoryTab(treeCode) {
				const targetCategory = this.cateList.find(
					item => item.treeCode === treeCode
				)
				const targetIndex = this.cateList.findIndex(
					item => item.treeCode === treeCode
				)
				if (targetCategory && targetIndex) {
					this.changeTab(targetIndex, targetCategory)
				}
			},
			toNavbarItem(treeCode) {
				const targetCategory = this.navBarItems.filter(
					item => item.treeCode === treeCode
				)
				const targetIndex = this.navBarItems.findIndex(
					item => item.treeCode === treeCode
				)
				if (targetCategory && targetCategory[0] && targetIndex) {
					this.changeNavBarItem(targetIndex, targetCategory[0])
				}
			},
			getCaseList() {
				this.$httpApi
					.getCasePage({
						cityOperatorId: this.cityOperatorId
					})
					.then(res => {
						if (res) {
							this.caseList = res.records
						}
					})
			},
			// 获取图标url
			getSrc(url) {
				if (url === 'no_title') {
					return
				}
				switch (url) {
					case 'icon_title1':
						return this.iconTitle1
					case 'icon_title2':
						return this.iconTitle2
					case 'icon_title3':
						return this.iconTitle3
					case '':
						return this.iconTitle1
					default:
						return this.$image.imageGlobal + url
				}
			},
			// 链接位方格样式
			getGridImageStyle(data) {
				let gridStyle = {}
				let column = data['gridNum']
				if (column == '2') {
					// 双图链接
					gridStyle = {
						width: '48%',
						marginTop: '13rpx',
						borderRadius: '8rpx',
						marginRight: '20rpx'
					}
				} else if (column == '3') {
					// 九宫格
					gridStyle = {
						width: '33.3%',
						marginTop: '20rpx',
						padding: '0 10rpx'
					}
				} else if (column == '1') {
					// 单图链接
					gridStyle = {
						width: '100%',
						marginTop: '7rpx',
						borderRadius: '8rpx'
					}
				}
				return gridStyle
			},
			//  链接位图片样式
			getImageStyle(data) {
				let gridStyle = {}
				let column = data['gridNum']
				if (column == '2') {
					// 双图链接
					gridStyle = {
						width: '100%',
						height: '156rpx',
						borderRadius: '8rpx'
					}
				} else if (column == '3') {
					// 九宫格
					gridStyle = {
						width: '100%',
						height: '110rpx'
					}
				} else if (column == '1') {
					// 单图链接
					gridStyle = {
						width: '100%',
						height: '120rpx',
						borderRadius: '8rpx'
					}
				}
				return gridStyle
			},
			// 九宫格图片样式
			getBoxImageStyle(data) {
				let gridStyle = {}
				let column = data['gridType'] === 'nine' ? '3' : '2'
				if (column == '2') {
					// 双图链接
					gridStyle = {
						width: '100%',
						height: '156rpx',
						borderRadius: '8rpx'
					}
				} else if (column == '3') {
					// 九宫格
					gridStyle = {
						width: '100%',
						height: '110rpx'
					}
				}
				return gridStyle
			},
			// 九宫格的样式
			getGridStyle(data) {
				let gridStyle = {}
				if (data['gridType'] === 'nine') {
					// 九宫格
					gridStyle = {
						width: '33.3%',
						marginTop: '40rpx',
						padding: '0 20rpx'
					}
				} else {
					// 田字格
					gridStyle = {
						width: '50%',
						marginTop: '26rpx',
						borderRadius: '8rpx',
						padding: '0 20rpx'
					}
				}
				return gridStyle
			},
			// 图标标题的样式
			getStyle(style) {
				let titleStyle = {}
				if (style['color'].color) {
					titleStyle['color'] = style['color'].color
				}
				if (style['size'].fontWeight) {
					titleStyle['fontWeight'] = style['size'].fontWeight
				}
				if (style['size'].textAlign) {
					let align = style['size'].textAlign
					titleStyle['justifyContent'] =
						align === 'center' ?
						'center' :
						align === 'left' ?
						'flex-start' :
						'flex-end'
					titleStyle['textAlign'] = align
				}
				return titleStyle
			},
			goToCateListFromClick(treeCode, type = '', brandId = '') {
				let data
				if (type == 'brand') {
					data = {
						treeCode,
						brandId
					}
				} else {
					data = {
						treeCode
					}
				}
				uni.setStorageSync('preSearchPage', 'category')
				this.toPage(`/pages-mall/cateList/cateList?data=${JSON.stringify(data)}`)
			},
			async getData(isRefresh = false) {
				if (!this.isShowPage) {
					return
				}
				if (!isRefresh) {
					this.isShowCategoryGrid = false
					this.isShowBrandGrid = false
					this.isShowPage = false
					this.richText = []
				}
				// 1. 指定导航栏
				if (this.treeCodeFromBanner !== '') {
					const tree = this.treeCodeFromBanner.split('-')
					this.treeCode = this.treeCodeFromBanner
					const data = {
						treeCode: this.treeCodeFromBanner
					}
					// this.toPage(
					// 	`/pages-mall/cateList/cateList?data=${JSON.stringify(data)}`
					// );
					if (tree.length == 1 || tree.length == 2) {
						// 一级分类
						this.cateList.forEach((item, index) => {
							if (item.treeCode === tree[0]) {
								this.currentTab = index
								this.categoryId = item.categoryId
							}
						})
						// 二级分类
						this.navBarItems.forEach((item, index) => {
							if (item.treeCode === this.treeCodeFromBanner) {
								this.currentNavBarItem = index
								this.categoryId = item.categoryId
							}
						})
					} else {
						// 三级分类，跳转至分类列表页面
						const data = {
							treeCode: this.treeCodeFromBanner
						}
						this.toPage(
							`/pages-mall/cateList/cateList?data=${JSON.stringify(data)}`
						)
					}
				}
				this.treeCodeFromBanner = ''
				// 2. 获取内容页
				if (this.categoryId) {
					const contentPage = await this.$httpApi.getCategoryContentPageById({
						categoryId: this.categoryId,
						operatorId: this.cityOperatorId
					})
					if (contentPage) {
						if (JSON.stringify(this.richText) != contentPage.content) {
							this.richText = JSON.parse(contentPage.content)
						}
						this.checkGridShow()
					}
				}
				// 3. 获取热销商品
				const hotSales = await this.$httpApi.getHotSaleByTreeCode({
					treeCode: this.treeCode
				})
				if (hotSales) {
					this.hotSaleProducts = hotSales.records
				}
				setTimeout(() => {
					this.isShowPage = true // 所有内容请求完了再渲染
				}, 200)
			},
			// 切换一级分类
			changeTab(index, item) {
				if (index != this.currentTab) {
					this.currentTab = index
					this.currentNavBarItem = 0
					if (item.subCagetories[0]) {
						this.treeCode = item.subCagetories[0].treeCode
						this.currentCategory = item.subCagetories[0]
						this.categoryId = item.subCagetories[0].categoryId
						this.hotSaleProducts = []
						this.hotSaleBrands = []
						this.getData()
					}
				}
			},
			// 切换二级分类
			changeNavBarItem(index, item) {
				if (index != this.currentNavBarItem) {
					this.currentNavBarItem = index
					this.categoryId = item.categoryId
					this.treeCode = item.treeCode
					this.currentCategory = item
					this.getData()
				}
			},
			// 检查九宫格组件数据源
			checkGridShow() {
				this.isShowCategoryGrid = false
				this.isShowBrandGrid = false
				this.hotSaleBrands = []
				this.thirdCategories = []
				this.richText.forEach(item => {
					if (item.type === 'imageGrid') {
						if (item.data.gridSrc === 'category') {
							this.isShowCategoryGrid = true
							// 获取对应的三级分类
							this.$httpApi
								.getThirdCategoryByTreeCode({
									levelTreeCode: this.treeCode
								})
								.then(res => {
									this.thirdCategories = res.levelThirdCategories
								})
						} else if (item.data.gridSrc === 'brand') {
							this.isShowBrandGrid = true
							// 获取对应的推荐品牌
							this.$httpApi
								.getBrandsByTreeCode({
									treeCode: this.treeCode,
									cityOperatorId: this.cityOperatorId
								})
								.then(res => {
									this.hotSaleBrands = res.records
								})
						}
					}
				})
			},
			goToSearchPage() {
				uni.setStorageSync('preSearchPage', 'category')
				this.toPage('/pages-common/searchPage/searchPage')
			},
			goToShoppingCart() {
				this.toPage('/pages-mall/shoppingCart/shoppingCart')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.search-box {
		width: 412rpx;
		/* #ifndef MP-WEIXIN */
		width: 602rpx;
		/* #endif */
		height: 66rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
		padding: 20rpx;
		margin-left: 30rpx;

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

	.right-icon {
		padding-right: 190rpx;
		/* #ifndef MP-WEIXIN */
		padding-right: 30rpx;
		/* #endif */

		.icon {
			width: 62rpx;
			height: 62rpx;
			/* #ifdef MP-WEIXIN */
			margin-left: 30rpx;
			/* #endif */
		}

		.count {
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			position: absolute;
			background: $themeColor;
			font-size: 20rpx;
			line-height: 30rpx;
			color: #ffffff;
			text-align: center;
			z-index: 99;
			margin-left: 30rpx;
			/* #ifdef MP-WEIXIN */
			margin-left: 60rpx;
			/* #endif */
		}
	}

	.header-container {
		width: 100%;
		height: 128rpx;
		padding-top: 20rpx;
		background-color: #fff;

		.tabs {
			width: 690rpx;
			height: 108rpx;
			margin: 0rpx 30rpx;

			.tab {
				height: 108rpx;
				width: 25%;
				font-family: PingFang SC;
				font-style: normal;
				font-size: 28rpx;
				line-height: 108rpx;
				text-align: center;
				color: #000000;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.tab-active {
				width: 25%;
				height: 108rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 108rpx;
				text-align: center;
				color: #fe6e32;
				background-image: url(https://www.51mihuo.com/static/icon/tab_bottom.png);
				background-position: center 90rpx;
				background-repeat: no-repeat;
				background-size: 60rpx;
				justify-content: center;
			}
		}
	}

	/deep/ .mescroll-bottombar {
		height: 0rpx !important;
	}

	.main-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		background-color: #ffffff;

		.left-nav-bar {
			width: 25vw;
			height: calc(100vh - 344rpx);
			/* #ifdef APP-PLUS || MP-WEIXIN */
			height: calc(100vh - 300rpx);
			/* #endif */
			border-right: 2rpx #f0f0f0 solid;
			padding: 0 30rpx;
			padding-top: 28rpx;

			.category-icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}

			.nav-bar-border {
				width: 6rpx;
				height: 20rpx;
				margin-right: 14rpx;
				background-color: #000000;
				border-radius: 4rpx;
			}

			.nav-bar-item {
				width: 100%;
				height: 108rpx;
				justify-content: center;

				.nav-bar-title {
					@include toe();
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 400;
					font-size: 24rpx;
					text-align: center;
					color: #8c8c8c;
				}
			}

			.nav-bar-item-active {
				width: 100%;
				height: 108rpx;
				justify-content: center;

				.nav-bar-title {
					@include toe();
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					text-align: center;
					color: #000000;
				}
			}
		}

		.right-content {
			width: 75vw;
			height: calc(100vh - 344rpx);
			/* #ifdef APP-PLUS || MP-WEIXIN */
			height: calc(100vh - 300rpx);
			/* #endif */
			padding-top: 28rpx;

			.base-item {
				padding: 0 30rpx;
				margin-bottom: 20rpx;
			}

			.icontitle {
				width: 100%;
				display: flex;
				align-items: center;

				.under_line {
					height: max-content;
					position: relative;
					border-bottom: 10rpx #fe6e32 solid;
					border-radius: 10rpx;
				}

				.divider {
					width: 80rpx;
					height: 2rpx;
					background-color: #cccccc;
				}

				.icon {
					width: 42rpx;
					height: 32rpx;
					margin-right: 20rpx;
					object-fit: cover;
				}
			}

			.grid-container {
				height: max-content;
				display: flex;
				flex-wrap: wrap;
				align-items: flex-start;
				justify-content: flex-start;

				.grid-item {
					display: flex;
					flex-direction: column;

					&:last-of-type {
						margin-right: 0rpx !important;
					}

					.title-container {
						width: 100%;
						display: flex;
						justify-content: center;

						.title {
							@include toe();
							width: 50%;
							flex: 1;
							height: 24rpx;
							line-height: 24rpx;
							font-size: 20rpx;
							font-weight: 500;
							color: #141414;
							text-align: left;
							margin-top: 10rpx;
						}

						.des {
							@include toe();
							width: 50%;
							height: 24rpx;
							line-height: 24rpx;
							font-size: 9px;
							font-weight: 400;
							color: #141414;
							text-align: right;
							margin-top: 10rpx;
						}
					}
				}
			}

			.product-item {
				width: 100%;
				height: 170rpx;
				border-radius: 16rpx;
				margin: 20rpx 0;
				display: flex;
				align-items: center;

				.producte-img {
					width: 232rpx;
					height: 170rpx;
					border-radius: 16rpx;
				}

				.title-container {
					width: 220rpx;
					margin-left: 34rpx;

					.product-title {
						@include bov(2);
						height: 104rpx;
						font-size: 22rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #141414;
						line-height: 52rpx;
					}

					.price {
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 800;
						color: #141414;
					}

					.origin-price {
						font-size: 22rpx;
						font-family: PingFang SC;
						font-weight: 500;
						text-decoration: line-through;
						color: #8c8c8c;
						margin-left: 20rpx;
					}
				}
			}

			.case-item {
				width: 100%;
				height: 170rpx;
				border-radius: 16rpx;
				margin: 20rpx 0;
				display: flex;
				align-items: center;

				.case-img {
					width: 232rpx;
					height: 170rpx;
					border-radius: 16rpx;
				}

				.case-title {
					@include bov(2);
					width: 40%;
					height: 104rpx;
					margin-left: 34rpx;
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #141414;
					line-height: 52rpx;
				}
			}

			.image-item {
				width: 100%;
				border-radius: 8rpx;
				margin: 15rpx 0;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
