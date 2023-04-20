<template>
	<view class="rejection">
		<view v-if="dataList.length">
			<view class="rejection-item" v-for="(item,index) in dataList" :key="index">
				<u-avatar class="avatar" size="70" :src="$util.avatarImage(item.bidUserId)" />
				<view class="rejection-item_right">
					<view class="rejection-item_top">
						<text class="name">{{item.personName}}</text>
						<text class="skill_name">{{item.skillName}}</text>
					</view>
					<view class="rejection-item_center">{{ item.updated || ''}}</view>
					<view class="rejection-item_bottom">拒单</view>
				</view>
			</view>
		</view>
		<u-loadmore v-if="dataList.length" :status="status" />
		<mh-empty v-else title="暂无拒单记录~~"></mh-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				status: 'nomore',
				pageObj: {
					current: 1,
					pageSize: 10,
					total: 0,
					pages: 0,
				},
				options: {}
			};
		},
		onLoad(options) {
			this.options = options;
		},
		// 滚动到底部加载更多
		onReachBottom() {
			if (this.orderList.length === Number(this.pageObj.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pageObj.current++
				setTimeout(() => {
					this.getListData()
				}, 200)
			}
		},
		onShow() {
			this.getListData()
		},
		methods: {
			getListData() {
				let params = {
					current: this.pageObj.current,
					size: this.pageObj.pageSize,
					bidStatus: 6,
					bidUserId: this.options.userId
				}
				this.$httpApi.getBidOrderList(params).then(res => {
					this.pageObj.total = res.total;
					this.dataList.push(...res.records);
					if (this.dataList.length >= res.total) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.rejection {
		padding: 0 30rpx;

		.rejection-item {
			padding: 20rpx 0;
			display: flex;
			border-bottom: 2rpx solid #E6E6E6;

			&:nth-last-child(1) {
				border: none;
			}

			.rejection-item_right {
				padding-left: 20rpx;
			}

			.rejection-item_top {
				display: flex;
				align-items: center;
				height: 70rpx;
				line-height: 70rpx;

				.name {
					font-size: $middleFontSize;
					color: $mainFontColor14;
					font-family: PingFang SC;
					font-weight: bold;
					margin-right: 17rpx;
				}

				.skill_name {
					font-size: $fontSize22;
					color: $fontColorPrice;
					font-family: FZRuiZhengHei_GBK;
					font-weight: 800;
					display: inline-block;
					line-height: 34rpx;
					padding: 0 8rpx;
					text-align: center;
					border: 2rpx solid $fontColorPrice;
					border-radius: 6rpx;
				}
			}

			.rejection-item_center {
				padding-bottom: 10rpx;
				font-size: 24rpx;
				color: #808080;
			}

			.rejection-item_bottom {
				color: #000000;
				font-size: 28rpx;
			}
		}
	}
</style>
