<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input">
				<icon type="search" :size='13' color='#333'></icon>
				<input confirm-type="search" placeholder="大家都在搜：如何快速找活" :focus="true" auto-focus
					placeholder-class="tui-input-plholder" class="tui-input" @confirm="confirmSearch" v-model.trim="key" @input="inputKey"
					:adjust-position="false" @focus="onFocus" @blur="onBlur" />
				<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
			</view>
			<view class="tui-cancle" @tap="back">取消</view>
		</view>
		<view class="tui-search-history" v-show="history.length>0 && !key">
			<view class="tui-history-header">
				<view class="tui-search-title">搜索历史</view>
			<!-- 	<tui-icon name="delete" :size='14' color='#333' @tap="openActionSheet" class="tui-icon-delete">
				</tui-icon> -->
			</view>
			<view class="tui-history-content">
				<block v-for="(item,index) in history" :key="index">
					<u-tag style="margin:0 24rpx 24rpx 0" :text="item" type="success" />
				</block>
			</view>
		</view>
		<view v-show="key">
			<view class="tui-header">
				<view class="tui-header-left tui-noboredr">搜索 “{{key}}”</view>
			</view>
			<view class="tui-result-box">
				<block v-for="(item,index) in history" :key="index">
					<view class="tui-result-item" hover-class="tui-opcity" :hover-stay-time="150">
						<text>{{item}}</text>
					</view>
				</block>
			</view>
		</view>
		<view v-for="(item, index) in searchList" :key="item.TargetId">
			<session-item :sessionData="item" @click.native="toDetail(item)" />
			</session-item>
		</view>

		<!-- <view class="tui-search-hot">
			<view class="tui-hot-header">
				<view class="tui-search-title">大家正在搜</view>
			</view>
			<view class="tui-hot-content">
				<block v-for="(item,index) in hot" :key="index">
					<tui-tag type="gray" shape="circle">{{item}}</tui-tag>
				</block>
			</view>
		</view> -->
		<!-- <tui-actionsheet :show="showActionSheet" :tips="tips" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet> -->
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
				history: [],
				hot: [],
				key: "",
				showActionSheet: false,
				tips: "确认清空搜索历史吗？",
				searchResult: [],
				searchList: []
			}
		},
		methods: {
			confirmSearch(){
				uni.setStorageSync('searchKeyword', this.key)
				this.key = ''
				this.goBack()
			},
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
				return
				this.$mp.page.$getAppWebview().setStyle({
					softinputNavBar: 'none'
				})
			},
			onBlur() {
				return
				this.$mp.page.$getAppWebview().setStyle({
					softinputNavBar: 'auto'
				})
			},
			async inputKey(e) {
				this.key = e.detail.value;
				if (!this.key) {
					this.searchList = [];
					return;
				}
				//根据关键词查找
				let arr = [];
				let where = `where TargetName like "%${this.key}%"`;
				//实际开发中，根据搜索返回结果集，此处只是做展示提示搜索哪些文字
				this.searchList = await tabInit.getSearchSession(tabSqls.SessionList, where);
			},
			// 详情
			toDetail(item) {
				// 判断是群聊还是单聊
				console.log(item);
				if (item.Type == 2) {
					let {
						TargetId,
						TargetName
					} = item;
					this.$store.commit('WEBSOCKET_GROUP', {
						TargetId: TargetId
					});
					this.toPage('/pages/message/group/index?toUserId=' + TargetId + '&toUserName=' + "群聊" + TargetId)
				} else {
					let {
						TargetId,
						TargetName
					} = item
					console.log(TargetId)
					this.$store.commit('WEBSOCKET_NORMAL', {
						TargetId: TargetId
					});
					this.toPage('/pages/message/chat/index?toUserId=' + TargetId + '&toUserName=' + "单聊" + TargetId)
				}
			}
		}
	}
</script>

<style>
	page {
		color: #333;
		background: #fff;
	}

	.container {
		padding: 0 30rpx 30rpx 30rpx;
		box-sizing: border-box;
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
