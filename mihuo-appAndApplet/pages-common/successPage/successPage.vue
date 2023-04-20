<template>
	<view class="success">
		<view class="success-header">
			<view class="header-top">
				<u-icon name="checkmark-circle-fill" size="40"></u-icon>
				<view class="tips-title">{{ curDo.mode == '1'?'验收成功': curDo.mode == '2'?'评价成功':''}}</view>
			</view>
			<view class="header-button">
				<view @click="goHome">返回首页</view>
				<!-- <view v-if="curDo.mode == '2'" @click="goDo('查看评价',{id:curDo.id})">查看评价</view> -->
				<view class="ys" v-if="curDo.mode == '1'" @click="goDo('立即评价',{id:curDo.id})">立即评价</view>
			</view>
		</view>
		<view class="success-main">
			<view v-if="(curDo.mode == '2')">
				<view class="main-miyou marginButton ">
					<view class="main-miyou_left">
						<image src="@/pages-common/static/images/miyou.png" />
						<text>分享评价到密友圈，帮助更多人</text>
					</view>
					<view class="main-miyou_right">点此分享</view>
				</view>
				<view class="main-evaluate" v-if="evaluateList.length">
					<view class="main-evaluate_top titleTop">
						<image src="@/pages-common/static/images/evaluate_star.png" />
						<text>这些订单也在等待评价</text>
					</view>
					<view class="main-evaluate_main">
						<view class="main-content" v-for="(item,index) in evaluateList.slice(0,2)" :key="index">
							<view class="main-content_left">
								<view class="left-top">
									<view class="tags">{{ item.skillName }}</view>
									<view class="title">{{ item.requirementDesc}}</view>
								</view>
								<view class="right-postios">
									<u-icon name="map" size="30"></u-icon>
									<view class="address">
										{{ (item.provinceName || '') + (item.cityName==item.provinceName?'': item.cityName|| '') + (item.districtName || '') + (item.latAddress || '') + (item.poiName || '') + (item.address || '') }}
									</view>
								</view>
							</view>
							<view class="main-content_right">
								<text @click="goDo('立即评价',item)">去评价</text>
							</view>
						</view>
					</view>
					<view class="main-evaluate_main" v-show="isOpen">
						<view class="main-content" v-for="(item,index) in evaluateList.slice(2)" :key="index">
							<view class="main-content_left">
								<view class="left-top">
									<view class="tags">{{ item.skillName }}</view>
									<view class="title">{{ item.requirementDesc}}</view>
								</view>
								<view class="right-postios">
									<u-icon name="map" size="30"></u-icon>
									<view class="address">
										{{ (item.provinceName || '') + (item.cityName==item.provinceName?'': item.cityName|| '') + (item.districtName || '') + (item.latAddress || '') + (item.poiName || '') + (item.address || '') }}
									</view>
								</view>
							</view>
							<view class="main-content_right">
								<text @click="goDo('立即评价',item)">去评价</text>
							</view>
						</view>
					</view>
					<view class="main-more" @click="()=> isOpen = !isOpen"
						v-if="evaluateList.slice(2) && evaluateList.slice(2).length">
						<text>{{isOpen?'关闭更多':'查看更多'}}</text>
						<u-icon :name="isOpen?'arrow-up':'arrow-down'" size="20" color="#808080"></u-icon>
					</view>
				</view>
			</view>
			<view v-if="(curDo.mode == '2') && miyouList.length">
				<view class="main-friends">
					<view class="main-friends_top">
						<view class="titleTop">
							<image src="@/pages-common/static/images/miyou_star.png" />
							<text>更多精彩好评就在觅友圈</text>
						</view>
						<view class="main-more" @click="goMore('觅友圈')">
							<text>更多</text>
							<u-icon name="arrow-right" color="#808080" size="24"></u-icon>
						</view>
					</view>
					<view class="main-friends_content">
						<view class="content" v-for="(item,index) in miyouList" :key="index">
							<view class="content-img">
								<u-swiper :list="item.image" :autoplay="true" :interval="5000" :duration="1000"
									:circular="true" img-mode="widthFix" height="100%" @click="lookMiYou(item)">
								</u-swiper>
							</view>
							<view class="title">{{ item.topic }}</view>
							<view class="user">
								<view class="user-left">
									<u-avatar v-if="item.userId" :src="$util.avatarImage(item.userId)" size="28">
									</u-avatar>
									<text>{{ item.userName }}</text>
								</view>
								<view class="user-right" @click="giveSupport(item)">
									<u-icon name="heart" size="24"></u-icon>
									<text>{{ item.collection }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="(curDo.mode == '1') && flowList.length">
				<view class="main-friends marginButton">
					<view class="main-friends_top">
						<view class="titleTop">
							<image src="@/pages-common/static/images/server_star.png" />
							<text>觅活精选服务推荐</text>
						</view>
						<view class="main-more" @click="goMore('更多服务')">
							<text>更多</text>
							<u-icon name="arrow-right" color="#808080" size="24"></u-icon>
						</view>
					</view>
					<view class="main-friends_content">
						<view class="content" v-for="(item,index) in flowList" :key="index" @click="server(item)">
							<view class="content-img">
								<image v-if="item.coverImg" :src="$util.thumbnailImage(item.coverImg, false)" />
							</view>
							<view class="title title_s">{{ item.name }}</view>
							<view class="title one">{{ item.subTitle }}</view>
							<view class="price">
								<view class="price_m">￥{{ item.price || 0 }}</view>
								<view class="price_s">{{ item.unit?('/'+item.unit): '起'}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="success-footer">
			<image :src="require('@/pages-common/static/icon/work_type/go-bottom.png')" />
			<text>~别拽了到底了~</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curDo: {},
				isOpen: false,
				miyouList: [],
				curOperator: null,
				flowList: [],
				evaluateList: [],
				latitude: uni.getStorageSync('latitude') || 0,
				longitude: uni.getStorageSync('longitude') || 0,
				pageObj: {
					current: 1,
					pageSize: 20,
					total: 0,
					pages: 0,
				},
				status: 'nomore',
			}
		},
		// 再次呼叫
		onNavigationBarButtonTap(e) {
			this.toPage('/pages-findMaster/findMasterWorker')
		},
		// 滚动到底部加载更多
		onReachBottom() {
			// if (this.evaluateList.length === Number(this.pageObj.total)) {
			// 	this.status = 'nomore'
			// 	return
			// } else {
			// 	this.status = 'loading'
			// 	this.pageObj.current++
			// 	setTimeout(() => {
			// 		this.getEvaluateList()
			// 	}, 200)
			// }
		},
		onLoad(option) {
			if (option) {
				/**
				 * mode: 1(验收)| 2(评价) //模式
				 * personId：工人
				 * id: 订单id
				 * orderCode: 订单code
				 */
				this.curDo = option;
			}
		},
		onShow() {
			this.getMiYouList();
			this.getEvaluateList();
			if (uni.getStorageSync('oldLocation')) {
				this.curOperator = uni.getStorageSync('oldLocation');
				this.getFuWu()
			}
		},
		methods: {
			goBack() {
				this.toPage(`/pages-order/callOrderDetails?id=${this.curDo.id}`)
			},
			goHome() {
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			goMore(type) {
				switch (type) {
					case '觅友圈':
						this.toPage('/pages-user/miyou/miyou')
						break;
					case '更多服务':
						uni.switchTab({
							url: '/pages/category/category'
						})
						break;
					default:
						break;
				}
			},
			getMiYouList() {
				this.$httpApi.getMiYouList({
					size: 6,
					current: 1
				}).then(res => {
						if (res && res.records && res.records.length) {
							if (res.records && res.records.length) {
								res.records.map(v => {
									if (v.image) {
										v.image = JSON.parse(v.image)
										v.image.some(item => {
											if (item.fileType == 'video') {
												item.image =
													'@/pages-common/static/images/video-start.png'
											} else {
												item.image = this.$image.imageGlobal + item.url
											}
										})
									}
								})
							}
							this.miyouList = res.records;
						}
					})
			},
			videoPlay(url) {
				// uni.$emit("videoUpdate", {url: url});
				this.toPage(`/pages-common/full-screen/full-screen?url=${url}`);
			},
			lookMiYou(data) {
				this.toPage(`/pages-user/miyou/miyouDetail?miyouId=${data.id}`)
			},
			preview(imgArr) {
				if (imgArr.length == 0) {
					return
				}
				let photoList = [];
				imgArr.forEach(item => {
					if (item.fileType === "img") {
						photoList.push(this.$util.thumbnailImage(item.fileList, false))
					}
				})
				if (photoList.length === 0) {
					return;
				}
				uni.previewImage({
					current: 0,
					urls: photoList,
					loop: true,
					indicator: 'number'
				});
			},
			// 点赞
			giveSupport(data) {
				this.$httpApi.collectMiYou(data.id).then(res => {
					this.$httpApi.getMiYouById(data.id).then(result => {
						if (result) {
							this.$util.toast(`${result.collectionFlag ? '收藏成功' : '已取消收藏'}！`)
							this.getMiYouList()
						}
					})
				})
			},
			// 获取服务
			getFuWu() {
				this.$httpApi.getMallData({
					current: 1,
					cityOperatorId: this.curOperator.id,
					cityOperatorFlag: 2,
					type: '1002'
				}).then(res => {
					this.flowList = res.records
				})
			},
			server(data) {
				this.toPage('/pages-mall/productDetail/productDetail?id=' + data.id)
			},
			goDo(type, data) {
				switch (type) {
					case '立即评价':
						this.toPage('/pages-findMaster/serviceEvaluation?id=' + data.id + '&toCur=2')
						break;
					case '查看评价':
						this.$util.toast('查看评价')
						break;
					default:
						break;
				}
			},
			// 获取未评价列表
			getEvaluateList() {
				uni.showLoading({
					mask: true
				});
				this.$http.get('order/biz_order/self/publish', {
					current: this.pageObj.current,
					size: this.pageObj.pageSize,
					latitude: this.latitude,
					longitude: this.longitude,
					orderStatus: 50,
					size:10
				}).then(res => {
					this.pageObj.total = res.total;
					this.evaluateList = res.records;
					// if (this.evaluateList.length >= res.total) {
					// 	this.status = 'nomore'
					// } else {
					// 	this.status = 'loadmore'
					// }
				}).finally(() => {
					uni.hideLoading();
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.success {
		padding-top: var(--status-bar-height) + 120rpx;
		padding: 0 30rpx;
		.success-header {
			padding: 60rpx 0;

			.header-top {
				display: flex;
				justify-content: center;
				align-items: center;
				color: #141414;
				font-size: 34rpx;
				font-weight: bold;
				font-family: PingFang-SC;
				padding: 20rpx 0;

				.tips-title {
					padding-left: 24rpx;
				}
			}

			.header-button {
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				view {
					padding: 20rpx 40rpx;
					border: 1px solid #141414;
					color: #141414;
					font-size: 24rpx;
					font-weight: bold;
					border-radius: 80rpx;

					&:first-child {
						margin-right: 25rpx;
					}

					&.ys {
						background: #000000;
						color: #F1F1F1;
					}
				}
			}
		}

		.success-main {
			.main-miyou {
				padding: 14rpx 12rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.main-miyou_right {
					color: #FE6E32;
					font-size: 22rpx;
				}

				.main-miyou_left {
					display: flex;
					align-items: center;

					text {
						color: #141414;
						font-size: 26rpx;
					}

					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
				}
			}

			.main-evaluate {
				.main-evaluate_top {
					padding-bottom: 30rpx;
				}

				.main-evaluate_main {
					.main-content {
						padding-bottom: 30rpx;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.main-content_left {
							width: calc(100% - 150rpx);

							.left-top {
								display: flex;
								align-items: center;
								margin-bottom: 10rpx;

								.tags {
									color: #FE6E32;
									font-weight: bold;
									font-family: CKTKingKong;
									font-size: 20rpx;
									padding: 0 5rpx 5rpx;
									border-radius: 6rpx;
									border: 1px solid #FE6E32;
									margin-right: 10rpx;
									white-space: nowrap;
								}

								.title {
									font-size: 28rpx;
									@include toe();
								}
							}

							.right-postios {
								display: flex;
								align-items: center;

								.address {
									color: #141414;
									font-size: 24rpx;
									@include toe();
								}
							}
						}

						.main-content_right {
							width: 150rpx;
							flex-shrink: 0;
							text-align: right;

							text {
								color: #FE6E32;
								font-size: 22rpx;
								font-weight: bold;
								padding: 8rpx 10rpx;
								border-radius: 30rpx;
								border: 1px solid #FE6E32;
							}
						}
					}
				}

				.main-more {
					display: flex;
					justify-content: center;
					align-items: center;

					text {
						font-size: 24rpx;
						color: #808080;
						padding-right: 10rpx;
					}
				}
			}

			.main-friends {
				.main-friends_top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-bottom: 30rpx;

					.main-more {
						text {
							color: #808080;
							font-size: 24rpx;
						}
					}
				}

				.main-friends_content {
					display: flex;
					flex-flow: row wrap;
					justify-content: space-between;

					.content {
						width: calc(50% - 15rpx);
						margin-bottom: 20rpx;
						margin-top: 20rpx;

						.content-img {
							height: 300rpx;
							background: #F1F1F1;
							display: flex;
							justify-content: center;
							align-items: center;
							border-top-left-radius: 12rpx;
							border-top-right-radius: 12rpx;

							image {
								border-radius: 12rpx;
								width: 100%;
								height: 100%;
							}

							.video {
								width: 80rpx;
								height: 80rpx;
							}

							.u-swiper-wrap {
								width: 100%;
								height: 100%;

								::v-deep .u-swiper-image {
									height: 100% !important;
								}
							}
						}

						.title {
							padding: 10rpx 0;
							font-size: 24rpx;

							&.title_s {
								font-weight: bold;
							}

							&.one {
								padding-top: 0;
								@include toe();
							}
						}

						.price {
							display: flex;
							align-items: baseline;

							.price_m {
								color: #FE6E32;
								font-size: 30rpx;
								font-weight: bold;
								font-family: PingFang-SC-Bold;
							}

							.price_s {
								color: #111144;
								font-size: 20rpx;
								padding-left: 5rpx;
							}
						}

						.user {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.user-left {
								display: flex;
								align-items: center;

								text {
									color: #5C5C5C;
									font-size: 20rpx;
									margin-left: 7rpx;
								}
							}

							.user-right {
								display: flex;
								align-items: center;

								text {
									color: #5C5C5C;
									font-size: 22rpx;
									margin-left: 7rpx;
								}
							}
						}
					}
				}
			}
		}

		.success-footer {
			height: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				height: 20rpx;
				width: 20rpx;
			}

			text {
				color: #D2D2D2;
				font-size: 22rpx;
				margin-left: 10rpx;
			}
		}
	}

	.marginButton {
		margin-bottom: 15rpx;
		background: #FFFFFF;
		padding: 17rpx;
		border-radius: 12rpx;
	}

	.titleTop {
		color: #141414;
		font-size: 30rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		font-family: PingFang-SC-Bold;

		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}
	}
</style>
