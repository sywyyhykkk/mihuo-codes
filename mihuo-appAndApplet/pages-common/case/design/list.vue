<template>
	<view class="case-list-contain">
		<z-nav-bar :bgColor="['#fff','#fff']" fontColor="black" title="案例列表">
			<view slot="right" class="nav-refresh" @click="getSearch">
				<image src="@/pages-common/static/images/search.png" mode=""></image>
			</view>
		</z-nav-bar>
		<view class="case-screening">
			<view class="text">排序</view>
			<view class="text" v-for="(item,index) in screeningList" :key="index" @click="getScreening(item,index)">{{item.title}}
				<u-icon size="20" :name="item.icon"></u-icon>
			</view>
		</view>
		<!-- 案例列表 -->
		<view class="case-list">
			<view class="c-item" v-for="(item,index) in caseList" :key="index" @click="caseDetails(item)">
				<view class="c-contain">
					<image class="c-item-image-left" border-radius="10" height="338" mode="aspectFill"
						:src="$util.thumbnailImage(item.imgLeft,true)">
					</image>
					<view class="c-item-image-right">
						<image class="c-item-image" border-radius="10" height="162" mode="aspectFill"
							:src="$util.thumbnailImage(item.imgTop,true)">
						</image>
						<image class="c-item-image" border-radius="10" height="162" mode="aspectFill"
							:src="$util.thumbnailImage(item.imgBottom,true)">
						</image>
					</view>
				</view>
				<view class="c-item-describe">
					<text class="case-name">{{item.name}}</text>
					<view class="view-details">查看详细<image class="img" src="@/pages-common/static/images/home/more.png"></image>
					</view>
				</view>
			</view>
		</view>
		<common-mh-empty v-if="caseList.length === 0 " title="暂无案例～～" />
		<u-loadmore v-if="caseList.length > 0 " :status="status" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'loadmore',
				size: 6,
				page: 1,
				total: 0,
				option: {},
				orderBy: 'LIKE_ASC',
				screeningList: [{
						title: '点赞',
						status:true,
						up: 'LIKE_ASC',
						dow: 'LIKE_DESC',
						icon: 'arrow-upward',
						upward: 'arrow-upward',
						downward: 'arrow-downward'
					},
					{
						title: '收藏',
						status: true,
						up: 'HOLD_ASC',
						dow: 'HOLD_DESC',
						icon: 'arrow-upward',
						upward: 'arrow-upward',
						downward: 'arrow-downward'
					},
					{
						title: '离我最近'
					}
				],
				caseList: []
			}
		},
		onLoad(option) {
			this.option = option
			this.getCaseList()
		},
		methods: {
			getCaseList() {
				this.$httpApi.getCasePage({
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					current: this.page,
					size: this.size,
					userId: uni.getStorageSync('userData').sysUser.userId,
					orderBy: this.orderBy
				}).then(res => {
					if (res) {
						res.records.map(item => {
							item["imgLeft"] = item.coverPic.split(",")[0];
							item["imgTop"] = item.coverPic.split(",")[1];
							item["imgBottom"] = item.coverPic.split(",")[2];
						})
						this.caseList = this.page > 1 ? this.caseList.concat(res.records) : res.records
						this.total = res.total
						if (this.caseList.length < this.total) {
							this.status = 'loadmore'
						} else {
							this.status = 'nomore'
						}
					}
				})
			},
			caseDetails(item) {
				this.toPage(`/pages-common/case/design/details?id=${item.id}`)
			},
			getScreening(val,index) {
				if(val.status){
					this.orderBy = val.dow
					this.screeningList[index].status = false
					this.screeningList[index].icon = val.downward
				}else{
					this.orderBy = val.up
					this.screeningList[index].status = true
					this.screeningList[index].icon = val.upward
				}
				// if(val.title === '离我最近'){
				// 	this.getCaseList()
				// }
				this.getCaseList()
			},
			getSearch() {
				// this.$util.toast('搜索');
				this.toPage(`/pages-common/emptyPage/index`);
			}
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
		//页面下拉刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {
			if (this.caseList.length === this.total) return
			this.status = 'loading';
			this.page += 1
			this.getCaseList()
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-load-more-wrap {
		padding-bottom: 20rpx;
	}

	.nav-refresh {
		margin-right: 20rpx;

		image {
			width: 44rpx;
			height: 44rpx;
		}
	}

	.case-screening {
		position: sticky;
		z-index: 99;
		top: 88rpx;
		background-color: #FFFFFF;
		padding: 24rpx 30rpx;
		display: flex;
		justify-content: space-between;
		/* #ifdef MP-WEIXIN */
		padding-right: 180rpx;
		/* #endif */

		.text {
			font-weight: bold;
			font-size: 26rpx;
			line-height: 36rpx;
			text-align: center;
			color: #999999;
		}
	}

	.case-list {
		display: flex;
		flex-direction: column;
		margin: 14rpx 20rpx 20rpx;

		.c-item {
			display: flex;
			flex-direction: column;
			margin-bottom: 16rpx;
			padding: 24rpx 20rpx 24rpx 20rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;


			.c-item-describe {
				display: flex;
				justify-content: space-between;

				.case-name {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #303133;
					width: 440rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.view-details {
					font-size: 24rpx;
					line-height: 34rpx;
					text-align: right;
					color: #FF5D35;
					display: flex;
					flex-direction: row;
					align-items: center;

					.img {
						margin-left: 4rpx;
						width: 16rpx;
						height: 16rpx;
					}
				}
			}
		}

		.c-item-image {
			border-radius: 10rpx;
			width: 100%;
			height: 330rpx;
			margin-bottom: 14rpx;
		}

		.c-contain {
			display: flex;
			flex-direction: row;

			.c-item-image-left {
				width: 346rpx;
				height: 338rpx;
				margin-right: 14rpx;
				border-radius: 10rpx;
			}
		}

		.c-item-image-right {
			.c-item-image {
				width: 340rpx;
				height: 162rpx;
			}
		}
	}
</style>
