<template>
	<view>
		<z-nav-bar backState="3000" @backClick="goBackPage">
			<view slot="default" class="nav-bar">
				我的足迹
			</view>
			<view slot="right" class="nav-bar-right flex-center">
				<view class="text" @click="clearAll">清空</view>
			</view>
		</z-nav-bar>
		<view class="main-container">
			<view v-if="dataList.length">
				<view class="history-item flex-center" v-for="item,index in dataList" :key="index">
					<view class="date">
						{{item.browserDate}}
					</view>
					<view class="content flex-center">
						<view class="item flex-center" v-for="item2, index2 in item.dayRecords" :key="index2" @click="goToPage(item2)">
							<view class="each-item flex-center">
								<image v-if="item2.dataType === 1" class="img"
									:src="$util.thumbnailImage(item2.products[0].coverImg)" mode="aspectFit"></image>
								<image v-if="item2.dataType === 2" class="img"
									:src="$util.thumbnailImage(item2.samples[0].coverPic.split(',')[0])"
									mode="aspectFit"></image>
								<view class="title">
									{{ item2.dataType === 1 ? item2.products[0].name : item2.samples[0].name}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<mine-mh-empty v-else title="还没有您的浏览足迹喔～"></mine-mh-empty>
		</view>
		<u-loadmore v-if="dataList.length !== 0" style="margin: 40rpx 0;" :status="status" />
	</view>
</template>

<script>
	export default {

		data() {
			return {
				dateStr: '',
				dataList: [],
				current: 1,
				total: 0,
				status: "loadmore",
				keywords: "",
				isShowSearch: false,
				showPicker: false,
				placeholderStyle: `
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 26rpx;
					line-height: 36rpx;
					color: #909199;`,
			};
		},
		onShow() {
			this.getHistory();
		},
		onReachBottom() {
			if (this.dataList.length === this.total) {
				this.status = 'nomore';
				return;
			}
			this.status = 'loading';
			this.current += 1;
			this.getHistory();
		},
		methods: {
			goBackPage(){
				this.goBack();
			},
			getHistory() {
				this.$httpApi.getMyHistory({
					current: this.current,
					keywords: this.keywords,
					searchDate: this.dateStr
				}).then(res => {
					if (res) {
						this.total = res.total;
						if (this.current > 1) {
							this.dataList = this.dataList.concat(res.records);
							let result = [];
							this.dataList.forEach((element) => {
								let match = result.find((r) => r.browserDate == element.browserDate);
								if (match) {} else {
									result.push({
										browserDate: element.browserDate,
										dayRecords: []
									});
								}
							});
							result.map((item) => {
								this.dataList.map((e) => {
									if (e.browserDate == item.browserDate) {
										item.dayRecords.push(...e.dayRecords);
									}
								});
							});
							this.dataList = result;
						} else {
							this.dataList = res.records;
						}
						if (this.current < res.pages) {
							this.status = 'loadmore';
						} else {
							this.status = 'nomore';
						}
					}
				}).catch(e => console.log(e));
			},
			clearAll() {
				uni.showModal({
					title: '确认操作',
					content: '确认清空所有足迹？',
					success: res => {
						if (res.confirm) {
							this.$http.delete('mall/pmstrail/all').then(res => {
								this.current = 1;
								this.getHistory();
							});
						}
					}
				});
			},
			confirmSearch() {
				this.dataList = [];
				this.isShowSearch = false;
				this.getHistory();
			},
			cancel() {
				this.keywords = "";
				this.dateStr = "";
				this.isShowSearch = false;
			},
			confirmTime(value) {
				this.dateStr = value.year + "-" + value.month + "-" + value.day;
			},
			getDate() {
				this.showPicker = true;
			},
			goToPage(item) {
				if (item.dataType === 1) {
					this.toPage(`/pages-mall/productDetail/productDetail?id=${item.dataId}`);
				} else {
					this.toPage(`/pages-common/case/design/details?id=${item.dataId}`);
				}
			},
		},
	}
</script>

<style lang="scss" scoped>

	.nav-bar-right {
		margin-right: 40rpx;

		.text {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #606166;
		}
	}

	.main-container {
		width: 710rpx;
		height: max-content;
		margin: 0 20rpx;
		margin-bottom: 20rpx;

		.history-item {
			flex-direction: column;

			.date {
				width: 100%;
				height: 44rpx;
				margin-top: 20rpx;
				padding-left: 10rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 900;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #909199;
			}

			.content {
				width: 100%;
				height: max-content;
				flex-wrap: wrap;

				.item {
					width: 50%;
					height: max-content;
					flex-direction: column;

					.each-item {
						background-color: #fff;
						border-radius: 10rpx;
						padding: 20rpx;
						margin: 10rpx 20rpx;
						flex-direction: column;

						.img {
							width: 300rpx;
							height: 300rpx;
							border-radius: 10rpx;
						}

						.title {
							width: 280rpx;
							height: 44rpx;
							margin-top: 20rpx;
							font-family: PingFang SC;
							font-style: normal;
							font-weight: 900;
							font-size: 32rpx;
							line-height: 44rpx;
							color: #333333;
							display: -webkit-box;
							overflow: hidden;
							text-overflow: ellipsis;
							word-wrap: break-word;
							white-space: normal !important;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
					}
				}
			}
		}
	}

	.popup-item {
		margin: 20rpx;
	}

	.popup-buttons {
		width: 100%;
		height: 88rpx;
		padding: 20rpx 40rpx;
		justify-content: space-between;

		.left {
			width: 50%;
			height: 100%;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 88rpx;
			color: #303133;
		}

		.right {
			width: 50%;
			height: 100%;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 88rpx;
			color: #FF5D35;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
