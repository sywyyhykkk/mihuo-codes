<template>
	<view class="container">
		<!--列表-->
		<view style="background-color: #fff;">
			<u-grid :border="false" col="6">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex">
					<message-mh-im-avatar  :imId="listItem.ImId"  class="avatar"></message-mh-im-avatar>
					<text class="grid-text">{{listItem.Name}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" />
		</view>
		<view style="margin-top: 15rpx;">
			<message-mh-menu-item title="举报" @click="()=>goToReport(0)"></message-mh-menu-item>
		</view>
		<!-- <view class="driver"></view> -->
	</view>
</template>

<script>
	import emoji from '@/plugins/emoji.js'
	import imsdk from '@/plugins/im/imsdk.js';
	import {
		tabSqls
	} from '@/plugins/im/tabSqls.js'
	import storage from '@/plugins/storage.js'
	import tabInit from '@/plugins/im/tabInit.js';
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad(option) {
			tabInit.getImUserInfo(tabSqls['ImUser'],
				`where ImId = ${option.id}`).then(res => {
				this.list = res;
			})
		},
		onShow() {

		},
		methods: {
           goToReport(){
			   this.toPage(`/pages-message/chat/report?id=${0}`)
		   }
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		.grid-text{
			font-size: 24rpx;
			color:$fontColor99;
			margin-top: 10rpx;
		}
		.driver{
			background-color: aliceblue;
			height: 15rpx;
		}
	}
</style>
