<template>
	<view class="container">
		<z-nav-bar backState="2000">
			<view class="tui-searchbox" slot="left" style="width: 95%;padding:0 3% 20rpx 4%;">
				<view class="tui-search-input">
					<icon type="search" :size='13' color='#333'></icon>
					<input confirm-type="search" placeholder="搜索" :focus="true" auto-focus
						placeholder-class="tui-input-plholder" class="tui-input" v-model.trim="key" @input="inputKey"
						:adjust-position="false" @focus="onFocus" @blur="onBlur" />
					<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
				</view>
				<view class="tui-cancle" @tap="back">取消</view>
			</view>
		</z-nav-bar>
		<view class="tui-search-history">
			<view class="section" v-if="cancat.length">
				<view class="titletype"><text class="title">联系人</text></view>
				<common-mh-session-item v-for="(item,index) in cancat" :key="index" :isSearch="true" :sessionData="item"></common-mh-session-item>
			</view>
			<view class="section" v-if="group.length">
				<view class="titletype"><text class="title">群聊</text></view>
				<common-mh-session-item v-for="(item,index) in group" :key="index" :isSearch="true" :sessionData="item"></common-mh-session-item>
			</view>
			<view class="section" v-if="searchList.length">
				<view class="titletype"><text class="title">聊天记录</text></view>
				<common-mh-session-item v-for="(item,index) in searchList" :key="index" :isSearch="true" :sessionData="item"></common-mh-session-item>
			</view>
		</view>
	</view>
</template>
<script>
	// const util = require("@/utils/util.js")
	import {
		tabSqls
	} from '@/plugins/im/tabSqls.js';
	import tabInit from '@/plugins/im/tabInit.js';
	export default {
		data() {
			return {
				key: "",
				searchList: [],
				cancat: [],
				group: []
			}
		},
		methods: {
			back: function() {
				uni.navigateBack();
			},
			cleanKey: function() {
				this.key = ''
			},
			closeActionSheet: function() {
				this.showActionSheet = false
			},
			openActionSheet: function() {
				this.showActionSheet = true
			},
			itemClick: function(e) {
				let index = e.index;
				if (index == 0) {
					this.showActionSheet = false;
					this.history = []
				}
			},
			onFocus() {
				this.$mp.page.$getAppWebview().setStyle({
					softinputNavBar: 'none'
				})
			},
			onBlur() {
				this.$mp.page.$getAppWebview().setStyle({
					softinputNavBar: 'auto'
				})
			},
			async inputKey(e) {
				this.key = e.detail.value;
				if (!this.key) {
					this.searchList = [];
					this.cancat = [];
					this.group = [];
					return;
				}
				//根据关键词查找
				let arr = [];
				let where = `where TargetName like "%${this.key}%"`;
				const regExp = new RegExp(this.key,"g");
				//实际开发中，根据搜索返回结果集，此处只是做展示提示搜索哪些文字
				this.searchList = await tabInit.getSearchSession(tabSqls.SessionList, where);
				this.searchList = this.searchList.map(item=>({
					...item,
					TargetName:item.TargetName.replace(regExp,`<text style="color:#ef4a4a;">${this.key}</text>`)
				}))
				this.cancat = this.searchList.filter(item=>item.Type === 1);
				this.group = this.searchList.filter(item=>item.Type === 2);
			},
			// 详情
			toDetail(item) {
				// 判断是群聊还是单聊
				if (item.Type == 2) {
					let {
						TargetId,
						TargetName
					} = item;
					this.$store.commit('WEBSOCKET_GROUP', {
						targetId: TargetId
					});
					this.toPage('/pages-message/group/index?toUserId=' + TargetId + '&toUserName=' + "群聊" + TargetId)
				} else {
					let {
						TargetId,
						TargetName
					} = item
					this.$store.commit('WEBSOCKET_NORMAL', {
						targetId: TargetId
					});
					this.toPage('/pages-message/chat/index?toUserId=' + TargetId + '&toUserName=' + "单聊" + TargetId)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #FFFFFF;
	}
    .section{
    	margin-top: 20rpx;
    	.titletype{
    		padding: 20rpx;
    		border-bottom: 1px solid #f5f5f5;
    		background-color: #fff;
    		.title{
    			color: #838181;
				font-size: 26rpx;
    		}
    	}
    }
	.tui-searchbox {
		padding: 30rpx 0;
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
		background: #f2f2f2;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.tui-input {
		flex: 1;
		color: #333;
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
		padding: 30rpx 0;
	}

	.tui-history-content {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.tui-icon-delete {
		padding: 10rpx;
	}

	.tui-search-title {
		font-size: 28rpx;
		font-weight: bold;
	}

	.tui-hot-header {
		padding: 30rpx 0;
	}

	.tui-header {
		padding: 26rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-header-left {
		font-size: 30rpx;
		color: #222;
		border-left: 4rpx solid #EB0909;
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
</style>
