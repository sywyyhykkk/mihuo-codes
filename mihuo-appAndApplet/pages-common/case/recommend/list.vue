<template>
	<view class="recommend">
		<z-nav-bar fontColor="black" title="客户案例" backState="3000" @backClick="goBack"></z-nav-bar>
		<view @click="goToSearchPage" class="search-box flex-center">
			<image class="icon" src="https://www.51mihuo.com/static/icon/home_v3/search-26x26.png"></image>
			<text>{{ formData.name || "搜索" }}</text>
		</view>
		<u-dropdown border-bottom active-color="#FE6E32" ref="uDropdown">
			<u-dropdown-item class="dropdown-menu" v-model="formData.houseTypeValue"
				:title="titleObj.houseType" :options="searchList.houseTypeList" @change="changeSearch($event,'户型')">
			</u-dropdown-item>
			<u-dropdown-item class="dropdown-menu" v-model="formData.wayValue"
				:title="titleObj.way" :options="searchList.wayList" @change="changeSearch($event,'类型')">
			</u-dropdown-item>
			<u-dropdown-item class="dropdown-menu" v-model="formData.houseStyleValue" height="600"
				:title="titleObj.houseStyle" :options="searchList.houseStyleList"  @change="changeSearch($event,'风格')">
			</u-dropdown-item>
		</u-dropdown>
		<view class="recommend-list">
			<view v-if="recommendList && recommendList.length">
				<common-mh-u-waterfall v-model="recommendList" ref="waterfall">
					<template v-slot:left="{ leftList }">
						<view class="mall-item" :key="index" v-for="(item, index) in leftList">
							<common-mh-case-card :recommendCase="item" :isShowCompanyInfo="false"></common-mh-case-card>
						</view>
					</template>
					<template v-slot:right="{ rightList }">
						<view class="mall-item flex-center" style="justify-content: flex-end" :key="index"
							v-for="(item, index) in rightList">
							<common-mh-case-card :recommendCase="item" :isShowCompanyInfo="false"></common-mh-case-card>
						</view>
					</template>
				</common-mh-u-waterfall>
			</view>
			<u-loadmore style="margin:20rpx 0"  v-if="recommendList.length" :status="status" />
			<mh-empty v-else title="暂无推荐案例～～" />
		</view>
		<u-back-top :scroll-top="scrollTop" icon="arrow-up" tips="顶部" bottom="100"></u-back-top>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recommendList:[],
				formData:{},
				titleObj:{
					houseType:'户型',
					area:'面积',
					way:'类型',
					houseStyle:'风格'
				},
				searchList:{
					houseTypeList:[],
					priceList:[],
					wayList:[],
					houseStyleList:[],
				},
				pageObj: {
					currentPage: 1,
					size: 20,
					total: 0
				},
				status: 'nomore',
				scrollTop:0,
			}
		},
		// 滚动到底部加载更多
		onReachBottom() {
			if (this.recommendList.length === Number(this.pageObj.total)) {
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
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			this.getDictType();
			uni.setStorageSync('caseObjTitle', this.titleObj);
		},
		onShow() {
			uni.$once('search', (data) => {
				if (data) {
					this.formData.name = data.searchText
					this.recommendList  = [];
				}
			});
			this.getListData();
		},
		methods: {
			goBack(){
				uni.removeStorageSync('caseObjTitle');
				uni.navigateBack();
			},
			goToSearchPage() {
				this.toPage("/pages-common/searchPage/searchPage?type=shop");
			},
			changeSearch(e, type){
				this.titleObj = uni.getStorageSync("caseObjTitle");
				this.formData = {};
				switch (type) {
					case '户型':
						this.formData.houseTypeValue = e;
						if (e) {
							this.titleObj.houseType = this.searchList.houseTypeList.find(
								(item) => item.value === e
							).label;
							this.formData.houseType = this.titleObj.houseType
						} else {
							this.titleObj.houseType = type;
						}
						break;
					case '面积':
						
						break;
					case '类型':
						this.formData.wayValue = e;
						if (e) {
							this.titleObj.way = this.searchList.wayList.find(
								(item) => item.value === e
							).label;
							this.formData.way = this.titleObj.way
						} else {
							this.titleObj.way = type;
						}
						break;
					case '风格':
						this.formData.houseStyleValue = e;
						if(e){
							this.titleObj.houseStyle = this.searchList.houseStyleList.find(
								(item) => item.value === e
							).label;
							this.formData.houseStyle = e;
						}else {
							this.titleObj.houseStyle = type;
						}
						break;
					// case '关键字':
					// 	this.formData.name = e;
					// 	break;
					default:
						break;
				}
				this.$refs.waterfall && this.$refs.waterfall.clear();
				this.getListData();
			},
			// 获取案例列表
			getListData() {
				this.$httpApi
				.getConstructionCase({
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					size: this.pageObj.size,
					...this.formData
				})
				.then((res) => {
					if (res && res.records !== 0) {
						res.records.map((item) => {
							item.coverPic = JSON.parse(item.coverPic);
							if(item.tags){
								item.tags = item.tags.split(",");
							}
						})
					}
					this.recommendList = res.records;
					this.pageObj.total = res.total;
				})
			},
			async getDictType(){
				// 户型
				let res = await this.$httpApi.getDictByType({type:"house_type",cityOperatorId: uni.getStorageSync('cityOperatorId') || ''});
				if(res && res.length){
					res.map((item)=>{
						item.label = item.label;
						item.value = item.label;
					})
				}
				this.searchList.houseTypeList = res;
				this.searchList.houseTypeList.unshift({label: '全部',value: ''})
				// 类型
				let res1 = await this.$httpApi.getDictByType({type:"decorate_way",cityOperatorId: uni.getStorageSync('cityOperatorId') || ''});
				if(res1 && res1.length){
					res1.map((item)=>{
						item.label = item.label;
						item.value = item.label;
					})
				}
				this.searchList.wayList = res1;
				this.searchList.wayList.unshift({label: '全部',value: ''})

				// 装修风格
				let res2 = await this.$httpApi.getDictByType({type:"house_style",cityOperatorId: uni.getStorageSync('cityOperatorId') || ''});
				if(res2 && res2.length){
					res2.map((item)=>{
						item.label = item.label;
						item.value = item.label;
					})
				}
				this.searchList.houseStyleList = res2;
				this.searchList.houseStyleList.unshift({label: '全部',value: ''})
			},
		}
	}
</script>

<style lang="scss" scoped>
.recommend{
	.search-box {
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
	.dropdown-menu {
		background-color: #ffffff;
		border-radius: 0 0 10rpx 10rpx;
	}
	.recommend-list{
		padding: 30rpx 30rpx 0;
	}
}
.flex-center {
	display: flex;
	align-items: center;
}
</style>
