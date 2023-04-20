<template>
	<view class="container">
		<z-nav-bar backState="3000" @backClick="goBackPage">
			<view slot="default" class="nav-bar">
				搜索
			</view>
		</z-nav-bar>
		<view class="tui-searchbox">
			<view class="tui-search-input">
				<image class="search-icon" src="@/pages-common/static/icon/home_v3/search-26x26.png"></image>
				<!-- <icon type="search" :size='13' color='#333'></icon> -->
				<input ref="input" confirm-type="search" placeholder="搜索" :focus="isFocus" :auto-blur="true"
					placeholder-class="tui-input-plholder" class="tui-input" v-model.trim="key" @input="inputKey"
					:adjust-position="false" @confirm="confirmSearch" maxlength="20" />
				<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
			</view>
			<!-- <view class="tui-cancle" @tap="back">取消</view> -->
		</view>
		<view class="tui-search-history">
			<view v-show="key">
				<view class="tui-header">
					<view class="tui-header-left tui-noboredr">搜索 “{{key}}”</view>
				</view>
				<view class="tui-result-box">
				</view>
			</view>
			<view class="tui-history-header" v-if="history.length">
				<view class="tui-search-title">历史搜索</view>
				<image class="delete-all" @click="cleanList()" src="@/pages-common/static/icon/home_v3/delete-all.png">
				</image>
			</view>
			<view class="tui-history-content">
				<block v-for="(item, index) in history" :key="index">
					<view style="position: relative; margin: 0 20rpx 20rpx 0;">
						<u-tag @click="setSearchText(item)" :circle="true" :text="item" color="#303133"
							border-color="#F5F5F5" bg-color="#F5F5F5" />
						<!-- <image @click="cleanListItem(index)" class="delete" src="@/pages-common/static/icon/home_v3/delete-one.png"></image> -->
					</view>
				</block>
			</view>
			<view v-if="options.type == 'home'">
				<view class="tui-search-title tui-find">猜你想找</view>
				<view class="tui-master" v-for="(item,index) in keywordList" :key="index">
					<span class="tui-master_item">
						{{ item.groupName }}
					</span>
					<view class="flex-center">
						<view @click="searchMaster(dax)" v-for="(dax,idx) in item.keywords" :key="idx" class="keyword">{{ dax|| ''}}</view>
					</view>
				</view>
			</view>
			<!-- <view class="dele_h" @click="cleanList()" v-if="history.length">
				<image src="@/pages-common/static/icon/home_v3/delete-all.png"></image>
				<text class="cleartext">清空历史记录</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				history: [],
				hot: [],
				key: "",
				tips: "确认清空搜索历史吗？",
				searchResult: [],
				options: {},
				isFocus: false,
				keywordList:[]
			}
		},
		onLoad(options) {
			this.options = options
			//安卓手机的键盘弹起会让有时候会让焦点失去
			//这里监听键盘弹起事件
			this
		},
		onShow() {
			this.$nextTick(()=>{
				this.isFocus = true;
				uni.onKeyboardHeightChange(res => {
				  if(res.height>0){
					  this.isFocus = true;
				  }else{
					  this.isFocus = false;
				  }
				})
			})
			let searchList = uni.getStorageSync('productorSearchHistory') || [];
			this.history = searchList;
			this.getKeywords()
		},
		onHide(){
			uni.hideKeyboard()
			uni.offKeyboardHeightChange(() => {})
		},
		onReachBottom() {
			if (this.dataList.length === Number(this.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.current++
				setTimeout(() => {
					this.getListData()
				}, 200)
			}
		},
		methods: {
			goBackPage(){
				if(uni.getStorageSync('preSearchPage') === 'category'){
					uni.switchTab({
						url: '/pages/category/category'
					})
				} else {
					uni.switchTab({
						url: '/pages/home/home'
					})
				}
			},
			setSearchText(item) {
				this.key = item;
				getApp().globalData.productSearchText = this.key;
				let data = {
					searchText: this.key,
					pageTitle: this.key
				};
				if (this.options.type == 'shop') { //从店铺搜索跳转
					uni.$emit('search', data)
					uni.navigateBack()
				} else if (this.options.type == 'home') {
					uni.redirectTo({
						url: `/pages-common/homeSearchResult/homeSearchResult?searchText=${this.key}`
					})
				} else {
					uni.redirectTo({
						url: `/pages-mall/cateList/cateList?data=${JSON.stringify(data)}`
					})
				}
				this.key = '';
			},
			cleanListItem(index) {
				this.history.splice(index, 1);
				uni.setStorageSync('productorSearchHistory', this.history)
			},
			cleanList() {
				this.history = [];
				uni.removeStorageSync('productorSearchHistory')
			},
			back: function() {
				uni.navigateBack();
			},
			cleanKey: function() {
				this.key = '',
					this.isHomeSearch = false;
				let searchList = uni.getStorageSync('productorSearchHistory') || [];
				this.history = searchList;
			},
			confirmSearch() {
				if (!this.key) return
				let searchList = uni.getStorageSync('productorSearchHistory') || [];
				if (searchList.indexOf(this.key) === -1) {
					searchList.unshift(this.key)
				}
				searchList = searchList.slice(0, 20)
				uni.setStorageSync('productorSearchHistory', searchList)
				getApp().globalData.productSearchText = this.key;
				let data = {
					searchText: this.key,
					pageTitle: this.key
				};
				if (this.options.type == 'shop') { //从店铺搜索跳转
					uni.$emit('search', data)
					uni.navigateBack()
				} else if (this.options.type == 'home') {
					uni.redirectTo({
						url: `/pages-common/homeSearchResult/homeSearchResult?searchText=${this.key}`
					})
				} else {
					uni.redirectTo({
						url: `/pages-mall/cateList/cateList?data=${JSON.stringify(data)}`
					})
				}
				this.key = '';
			},
			async inputKey(e) {
				this.key = e.detail.value;
				if (!this.key) {
					this.searchList = [];
					return;
				}
				getApp().globalData.productSearchText = this.key;
			},
			searchMaster(item) {
				this.key = item;
				this.isHomeSearch = true;
				let searchList = uni.getStorageSync('productorSearchHistory') || [];
				if (searchList.indexOf(this.key) === -1) {
					searchList.unshift(this.key)
				}
				uni.setStorageSync('productorSearchHistory', searchList);
				this.toPage(`/pages-common/homeSearchResult/homeSearchResult?searchText=${this.key}`);
			},
			// 获取搜索关键词
			getKeywords(){
				this.$http.get('basic/basicsearchkeywords/list/public')
				.then(res => {
					this.keywordList = res;
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

	.dele_h {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 25rpx;

		image {
			width: 26rpx;
			height: 26rpx;
		}

		.cleartext {
			color: #999;
			font-size: 24rpx;
			margin-left: 10rpx;
		}
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

	.tui-search-history {}

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

	.tui-input {
		flex: 1;
		color: #000000;
		background-color: #F7F7F7;
		padding: 0 16rpx;
		font-size: 28rpx;
	}

	.tui-input-plholder {
		font-size: 28rpx;
		color: #b2b2b2;
	}

	.tui-cancle {
		color: #888;
		font-size: 28rpx;
		padding-left: 30rpx;
		flex-shrink: 0;
	}

	.tui-history-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 10rpx 24rpx 10rpx;
		color: #000000;
		font-size: 28rpx;

		.delete-all {
			width: 26rpx;
			height: 26rpx;
		}
	}

	.tui-history-content {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 10rpx;

		.delete {
			position: absolute;
			top: -15rpx;
			right: 5rpx;
			width: 24rpx;
			height: 24rpx;
		}
	}

	.tui-icon-delete {
		padding: 10rpx;
	}

	.tui-search-title {
		font-size: 28rpx;
		font-weight: bold;
	}

	.tui-find {
		color: #FE6E32;
		padding-top: 20rpx;
	}

	.tui-master {
		.tui-master_item {
			background: #000000;
			color: #FFFFFF;
			font-family: 'HuXiaoBo-NanShen';
			border-radius: 20rpx;
			font-size: 20rpx;
			padding: 10rpx 20rpx;
			// margin: 20rpx 0;
			margin: 30rpx 0 10rpx;
			display: inline-block;
			i{
				font-style:normal;
				padding-right: 10rpx;
			}
		}
		.keyword{
			color: #000000;
			border: 2rpx solid #000000 ;
			border-radius: 10rpx;
			font-size: 24rpx;
			font-family: NotoSansHans-Regular;
			padding: 15rpx 20rpx;
			margin-right: 20rpx;
			margin-top: 20rpx;
		}
	}

	.tui-hot-header {
		padding: 30rpx 0;
	}

	.tui-header {
		padding-top: 28rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-header-left {
		font-size: 28rpx;
		color: #A8A8A8;
		padding-left: 10rpx;
		word-break: break-all;
	}

	.tui-noboredr {
		border-left: 0 !important;
	}

	.tui-result-box {
		font-size: 28rpx;
	}

	.tui-result-item {
		line-height: 28rpx;
		padding: 28rpx 0;
	}
	.flex-center{
		display: flex;
		align-items: center;
		flex-flow: row wrap;
	}
</style>
