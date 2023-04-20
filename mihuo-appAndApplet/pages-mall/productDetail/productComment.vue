<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">
				评价
			</view>
		</z-nav-bar>
		<u-tabs itemWidth="350" :list="tabList" :gutter="8" inactiveColor="#808080" font-size="28"
			:is-show-count="true" bg-color="rgba(0, 0, 0, 0)" active-color="#000000" :current="currentTab"
			@change="onChangeTab" />
		<mh-empty style="margin-top: -100rpx;" v-if="!commodityComments.length" title="暂时还没有评价～"></mh-empty>
		<view v-else>
			<!-- <view class="comment-info flex-center">
				<view class="comment-left">
					<view class="number">
						{{ commodity.goodRating || 100 }}
						<text class="text" style="margin-left: 10rpx;">%</text>
					</view>
					<view class="text">好评率</view>
				</view>
				<view class="comment-right">
					<view class="right-top flex-center">
						<u-rate disabled :current="commodity.score" :allow-half="true" size="36"
							active-color="#EC7744" />
						<text class="score" v-if="commodity.score">
							{{ commodity.score.toFixed(2) }}分
						</text>
					</view>
					<view class="right-bottom flex-center">
						<view class="comment-tag" v-for="tag, key, tIndex in commodity.tagsStatistics" :key="tIndex">
							{{ key }} {{ tag }}
						</view>
					</view>
				</view>
			</view> -->
			<view class="comment-items">
				<view class="comment-item" v-for="item, index in commodityComments" :key="index"
					@click="goToCommentDetail(item)">
					<view class="comment-header flex-center">
						<view class="left flex-center">
							<u-avatar :src="$util.thumbnailImage(item.memberAvatar, true, 80)" size="80"></u-avatar>
							<view class="comment-user">
								<view>
									<view class="name">
										{{ item.memberName || '未知用户' }}
									</view>
								</view>
								<view class="flex-center">
									<u-rate class="rating" disabled :current="item.productScore" :allow-half="true" size="24"
										active-color="#EC7744" />
									<text class="score" v-if="item.productScore">
										{{ item.productScore.toFixed(2) }}
									</text>
									<view class="divider-line" v-if="item.pmsSkuStock"></view>
									<view class="comment-sku" v-if="item.pmsSkuStock">
										{{ $tools.getSkuStr(item.pmsSkuStock.spData) }}
									</view>
								</view>
							</view>
						</view>
						<view class="right flex-center">
							<view class="time">
								{{ item.createTime }}
							</view>
						</view>
					</view>
					<view class="comment-text">
						{{ item.comment }}
					</view>
					<view class="comment-images flex-center" v-if="item.pics">
						<u-lazy-load class="img-item" borderRadius="15" height="216"
							v-for="img, index2 in getItemPics(item.pics)"
							@click="previewImg(getItemPics(item.pics), index2)" :key="index2"
							:image="$util.thumbnailImage(img, true, 864)"></u-lazy-load>
					</view>
					<view class="comment-counts flex-center">
						<view class="count-item flex-center">
							<image src="https://www.51mihuo.com/static/icon/capp/love.png" class="icon"></image>
							{{ item.likes }}
						</view>
						<view class="count-item flex-center" style="margin-left: 40rpx;">
							<image src="https://www.51mihuo.com/static/icon/capp/comment.png" class="icon"></image>
							{{ item.replyCount }}
						</view>
					</view>
					<view class="comment-reply" v-if="item.replyCount && item.reply">
						<view class="reply-item" v-if="!item.isShow">
							<text class="bold">
								{{ item.reply.roleType === 0 ? item.reply.memberName : '商家' }}
							</text>
							<text class="reply">
								{{ item.reply.roleType === 1 ? '回复' : '评论' }}({{ item.reply.updateTime }}):
							</text>
							<text class="bold">
								{{ item.reply.comment }}
							</text>
						</view>
						<view v-else>
							<view class="reply-item" v-for="rItem, rIndex in item.comments" :key="rIndex">
								<text class="bold">
									{{ rItem.roleType === 0 ? rItem.memberName : '商家' }}
								</text>
								<text class="reply">
									{{ rItem.roleType === 1 ? '回复' : '评论' }}({{ rItem.updateTime }}):
								</text>
								<text class="bold">
									{{ rItem.comment }}
								</text>
							</view>
						</view>
						<view class="expand-comment" v-if="item.replyCount > 1"
							@click.stop="expandComment(item, index)">
							{{ item.isShow ? '收起' : '展开' }}
						</view>
					</view>
				</view>
				<view style="padding-bottom: 20rpx;">
					<u-loadmore v-if="commodityComments.length > 0 " :status="status" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serviceType: 0,
				currentTab: 0,
				commodityId: '',
				commodity: {}, // 商品
				commodityComments: [], // 商品评价
				current: 1,
				total: 0,
				status: 'loadmore',
				tabList: [{
						name: '全部',
						count: '0'
					},
					{
						name: '有图',
						count: '0'
					}
				]
			}
		},
		onLoad(options) {
			this.commodityId = options.id
			this.serviceType = options.serviceType
			this.tabList[0].count = options.total
			this.tabList[1].count = options.picsTotal
			if (options.type === '2') {
				this.onChangeTab(1)
			} else {
				this.getCommodityData()
			}
		},
		onReachBottom() {
			if (this.commodityComments.length === +this.total) {
				this.status = 'nomore'
				return
			} else {
				this.current++
				this.getCommodityComments()
			}
		},
		methods: {
			// 跳转到评论详情
			goToCommentDetail(item) {
				this.toPage(`/pages-mall/productDetail/commentDetail?id=${item.id}&productId=${this.commodityId}&serviceType=${this.serviceType}`)
			},
			// 切换全部/无图
			onChangeTab(e) {
				this.currentTab = e
				this.current = 1
				this.status = 'loarmore'
				this.commodityComments = []
				this.getCommodityComments()
			},
			// 图片预览
			previewImg(imgs, index) {
				uni.previewImage({
					current: index,
					urls: imgs.map(item => this.$util.thumbnailImage(item))
				})
			},
			getItemPics(pics) {
				try {
					const images = JSON.parse(pics)
					return images.map(item => item = item.url)
				} catch (e) {
					return pics.split(',')
				}
			},
			// 展开评论
			expandComment(item) {
				if (item.comments.length != 0) {
					// 展开状态，显示评论
					item.isShow = !item.isShow
				} else {
					// 收起状态，加载评论
					this.$httpApi.getCommentReplyById({
						commentId: item.id,
						status: 1
					}).then(res => {
						item.comments = res.records
						item.isShow = !item.isShow
					})
				}
			},
			getCommodityData() {
				this.$httpApi.getCommodityOverView({
					id: this.commodityId,
					holdUid: uni.getStorageSync('userData') &&
						uni.getStorageSync('userData').sysUser.userId
				}).then(res => {
					if (res) {
						this.commodity = res
						this.getCommodityComments()
					}
				})
			},
			getCommodityComments() {
				// 获取商品评论
				this.$httpApi.getProductComments({
					productId: this.commodityId,
					status: 1,
					current: this.current,
					'orders[0].asc': false,
					'orders[0].column': 'curation',
					'orders[1].asc': false,
					'orders[1].column': 'create_time',
					isPics: this.currentTab === 1 // 0 = 全部 1 = 有图
				}).then((res) => {
					if (res && res.records.length != 0) {
						this.total = res.total
						const arr = res.records.map(item => {
							return {
								...item,
								isShow: false,
								comments: []
							}
						})
						this.commodityComments = this.commodityComments.concat(arr)
						if (this.commodityComments.length === Number(this.total)) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore'
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.score {
		font-size: 22rpx;
		font-family: PingFang;
		font-weight: 800;
		color: #EC7744;
		line-height: 46rpx;
		margin-left: 6rpx;
	}
	
	.rating {
		margin-left: -4rpx;
		margin-top: -8rpx;
	}

	.divider-line {
		width: 2rpx;
		height: 16rpx;
		margin: 0 10rpx;
		background-color: #E6E6E6;
	}
	
	.comment-sku {
		font-size: 20rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 400;
		color: #B3B3B3;
		line-height: 34rpx;
	}
	
	.comment-info {
		width: 100vw;
		padding: 30rpx 50rpx;
		align-items: flex-start !important;
		justify-content: space-between;

		.comment-left {
			width: 168rpx;
			height: 192rpx;
			padding-top: 10rpx;
			background-image: url('../static/images/goodRating-168x192.png');
			background-size: 168rpx 192rpx;
			background-position: center;
			background-repeat: no-repeat;
			text-align: center;

			.number {
				font-size: 62rpx;
				font-family: Arial;
				font-weight: bold;
				color: #EC7744;
				line-height: 117rpx;
			}

			.text {
				font-size: 24rpx;
				font-family: PingFang;
				font-weight: 500;
				color: #141414;
				line-height: 47rpx;
			}
		}

		.comment-right {
			width: 65%;

			.right-bottom {
				margin-top: 30rpx;
				flex-wrap: wrap;

				.comment-tag {
					width: max-content;
					flex-shrink: 0;
					height: 42rpx;
					padding: 0 10rpx;
					background: #f8f8f8;
					border-radius: 8rpx;
					font-size: 22rpx;
					font-family: PingFang;
					font-weight: 500;
					color: #666666;
					line-height: 42rpx;
					margin-bottom: 20rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	.comment-items {
		width: 100vw;
		height: max-content;
		margin-top: 30rpx;

		.comment-item {
			padding: 30rpx;
			border-top: 2rpx #F7F7F7 solid;
			
			.comment-header {
				justify-content: space-between;
				align-items: flex-start;
				
				.left {
					align-items: center;					
					
					.comment-user {
						margin-left: 20rpx;
						flex: 1;
						
						.name {
							padding-top: 6rpx;
							font-size: 28rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #000000;
							line-height: 34rpx;
						}
					}
				}
				
				.right {
					.time {
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #808080;
						line-height: 34rpx;
					}
				}
			}

			.comment-text {
				margin-top: 30rpx;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #333333;
				line-height: 36rpx;
			}

			.comment-images {
				margin-top: 30rpx;
				align-items: flex-start;
				flex-wrap: wrap;
				gap: 20rpx;

				.img-item {
					width: 216rpx;
					height: 216rpx;
					border-radius: 15rpx;
				}
			}

			.comment-counts {
				justify-content: flex-end;
				margin-top: 30rpx;
				
				.count-item {
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #141414;
					line-height: 27rpx;
				}
				
				.icon {
					width: 34rpx;
					height: 34rpx;
					margin-right: 10rpx;
				}
			}

			.comment-reply {
				width: 690rpx;
				height: max-content;
				margin-top: 30rpx;
				background: #F7F7F7;
				border-radius: 10rpx;
				padding: 10rpx 20rpx;

				.reply-item {
					.bold {
						font-size: 24rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #000000;
						line-height: 34rpx;
					}

					.reply {
						flex-shrink: 0;
						margin: 0 10rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #999999;
						line-height: 34rpx;
					}
				}

				.expand-comment {
					margin-top: 10rpx;
					text-align: right;
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #FE6E32;
					line-height: 34rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
