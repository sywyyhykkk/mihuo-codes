<template>
	<view>
		<view class="notice-content">
			<view style="display: flex;"><text class="title">{{item.title}}</text>
			</view>
			<view class="datecontent"><text class="date">{{getNoticeDate(item.created)}}</text></view>
			<view style="margin-top: 14rpx;"><text class="content">{{item.content}}</text></view>
		</view>
		</uni-list>
	</view>
</template>

<script>
	import {
		getShowDate,
		getNoticeDate
	} from '@/static/js/chat.js';
	export default {
		data() {
			return {
				downOption: {},
				upOption: {
					use: true,
				},
				mescroll: null,
				title: '',
				item: {},
				id: 0
			}
		},
		onLoad(option) {
			this.title = option.title || '通知';
			this.id = option.id;
			uni.setNavigationBarTitle({
				title:'通知' ||  option.title
			})
			this.getList();
		},
		onUnload() {
		  
		},
		methods: {
			getList() {
				this.$http.get(`basic/basicmessage/${this.id}`).then(res => {
					this.item = res;
					if(!res.readFlag){
						this.setReadStatus(this.id)
					}
				})
			},
			//设置为已读
			setReadStatus(id){
			  	this.$http.get(`basic/basicmessage/updateById/${this.id}`).then(res => {
					uni.$emit('updateNotice',{id:this.id})
			  	})
			},
			getNoticeDate(date) {
				return getNoticeDate(date)
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			downCallback() {
				setTimeout(() => {
					this.mescroll.endBySize(10, true);
				}, 1000);
			},
			upCallback() {

			},
		}
	}
</script>

<style lang="scss" scoped>
	.notice-content {
		background: #fff;
		border-radius: 16rpx;
		padding: 36rpx;
		position: relative;
		border-top: 1px solid #f5f5f5;

		.node {
			position: absolute;
			top: 49%;
			left: 10rpx;
			width: 10rpx;
			height: 10rpx;
			border-radius: 10rpx;
			background-color: $linghtWarningColor;
		}

		.title {
			color: $seconFontColor;
			font-size: 30rpx;
			flex: 1;
			text-align: center;
		}

		.datecontent {
			text-align: center;
		}

		.date {
			color: $viceFontColor;
			font-size: 24rpx;

		}

		.content {
			color: $mainFontColor;
			font-size: 28rpx;
		}

		.delete {
			width: 50rpx;
			height: 50rpx;
		}
	}
</style>
