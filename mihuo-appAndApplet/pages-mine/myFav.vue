<template>
	<view>
		<z-nav-bar backState="1000" color="#fff">
			<view slot="default" class="nav-bar-title">
				我的收藏
			</view>
			<!-- 	<view slot="right" class="navbar-right flex-center">
				<image src="https://www.51mihuo.com/static/icon/search_btn.png" class="icon"></image>
				管理
			</view> -->
		</z-nav-bar>
		<view class="tabs">
			<u-subsection :list="tabsList" :current="current" buttonColor="#f2f2f2" bg-color="#f2f2f2"
				activeColor="#FF5D35" @change="changeTab"></u-subsection>
		</view>
		<!-- 商品 -->
		<view class="list-product">
			<uni-swipe-action v-if="current === 0">
				<uni-swipe-action-item v-for="item,index in list" :key="index" @click="optionsActive($event, item.id)"
					:right-options="options">
					<view class="content flex-center" @click="getDetails(item)">
						<view class="item-contain">
							<u-lazy-load class="left" border-radius="10" height="204" imgMode="widthFix"
								:image="$util.thumbnailImage(item.coverImg, true)">
							</u-lazy-load>
							<view class="right flex-center">
								<view class="info">
									<view class="topper">
										{{item.name}}
									</view>
									<view class="lower">
										{{ item.holdNum }}人收藏
									</view>
									<view class="price">
										¥{{ item.price }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<!-- 店铺 -->
			<view class="shopping-list" v-if="current === 1 && list.length > 0">
				<mine-mh-shop-info :shop-list="list" @callBack="goShop"></mine-mh-shop-info>
			</view>
			<!-- 工人 -->
			<view class="master" v-if="current === 2 && list.length > 0">
				<view class="master-list flex-center" v-for="(item,index) in list" :key="index">
					<u-avatar class="avatar" size="122" :src="$util.avatarImage(item.userId)" v-if="item.userId" />
					<view class="master-item">
						<view class="master-item_top">
							<text class="master_name">{{ item.name}}</text>
							<text class="skill_name">{{ item.skillName}}</text>
						</view>
						<view class="master-item_buttom">
							{{item.skillYearNum}}<text class="text">工作经验</text>
							{{item.evaluationRate || '100%'}}<text class="text">好评</text>
						</view>
					</view>
					<u-icon :custom-style="{
						transform:'rotate(90deg)',
						padding:'20rpx'
					}" @click="moreNews(item)" name="more-dot-fill"></u-icon>
				</view>
			</view>
			<!-- 案例 -->
			<uni-swipe-action v-if="current === 3">
				<uni-swipe-action-item v-for="item,index in list" :key="index" @click="optionsActive($event, item.id)"
					:right-options="options">
					<view class="content flex-center" v-if="item">
						<view class="item-contain" @click="getDetails(item)">
							<u-lazy-load v-if="item && item.imgLeft" class="left" border-radius="10" height="204"
								imgMode="aspectFill" :image="$util.thumbnailImage(item.imgLeft,true)">
							</u-lazy-load>
							<view class="right flex-center">
								<view class="info">
									<view class="topper">
										{{ item.name }}
									</view>
									<view class="lower">
										{{ item.collectNum }}人收藏
									</view>
								</view>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<!-- 密友圈 -->
			<view class="waterfall" v-if="current === 4 && list.length > 0">
				<u-waterfall v-model="list" ref="waterfall">
					<template v-slot:left="{ leftList }">
						<mh-miyou-card v-for="item,index in leftList" :key="index" :miyouItem="item">
						</mh-miyou-card>
					</template>
					<template v-slot:right="{ rightList }">
						<mh-miyou-card v-for="item,index in rightList" :key="index" :miyouItem="item">
						</mh-miyou-card>
					</template>
				</u-waterfall>
			</view>
		</view>
		<mine-mh-empty v-if="list.length === 0 " title="暂无收藏～～" />
		<view style="margin: 20rpx 0; height: 80rpx;" v-else>
			<u-loadmore :status="status" :loadText="{nomore:'别滑了，就这么多'}" />
		</view>
		<!-- 收藏师傅信息 -->
		<mine-mh-contact-me v-model="contactPopup" :data="curMaster" @cancel="cancelCollection"></mine-mh-contact-me>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				size: 10,
				page: 1,
				total: 0,
				options: [{
						text: '删除',
						color: '#fff',
						style: {
							backgroundColor: '#FE4B00',
						}
					},
					// {
					// 	text: '分享',
					// 	color: '#fff',
					// 	style: {
					// 		backgroundColor: '#FE6E32',
					// 	}
					// }
				],
				tabsList: [{
					name: '商品',
				}, {
					name: '店铺',
				}, {
					name: '工人',
				}, {
					name: '案例',
				}, {
					name: '觅友圈',
				}, ],
				list: [],
				userId: uni.getStorageSync('userData').sysUser.userId,
				contactPopup: false,
				curMaster: {},
				status: 'loadmore',
			};
		},
		onShow() {
			this.changeTab(this.current)
		},
		methods: {
			optionsActive(e, id) {
				switch (e.index) {
					case 0:
						this.deleteFav(id)
						break
					case 1:
						console.log('share')
						break
				}
			},
			changeTab(index) {
				this.list = [];
				this.page = 1;
				this.total = 0;
				this.current = index;
				switch (index) {
					case 0:
						this.getMallList()
						break
					case 1:
						this.getShopping()
						break
					case 2:
						this.getMasterList()
						break
					case 3:
						this.getCaseList()
						break
					case 4:
						this.getMiyouList()
						break

				}
			},
			// 取消收藏，页面更行
			cancelCollection() {
				this.contactPopup = false;
				this.changeTab(2);
			},
			getDetails(item) {
				switch (this.current) {
					case 0:
						this.toPage(`/pages-mall/productDetail/productDetail?id=${item.id}`);
						break
					case 3:
						this.toPage(`/pages-common/case/recommend/detail?id=${item.id}`)
						break
					case 2:
						this.toPage(`/pages-user/miyou/miyouDetail?miyouId=${item.id}`)
						break
				}
			},
			deleteFav(dataId) {
				uni.showModal({
					title: '确认',
					content: '是否删除收藏?',
					success: res => {
						if (res.cancel) return
						switch (this.current) {
							case 0:
								// 取消收藏商品
								this.$httpApi.addItemToFav({
									id: dataId,
									operation: 6
								}).then(res => {
									if (res) {
										this.total = 0
										this.page = 1
										this.getMallList()
									}
								})
								break
							case 1:
								// 取消收藏案例
								this.$httpApi.addItemToFav({
									id: dataId,
									operation: 4
								}).then(res => {
									if (res) {
										this.total = 0
										this.page = 1
										this.getCaseList()
									}
								})
								break
							case 2:
								// 取消收藏觅友圈
								break
						}
					}
				})
			},
			// 获取收藏的案例
			getCaseList() {
				this.$httpApi.getFavCase({
					current: this.page,
					size: this.size,
				}).then(res => {
					if (res) {
						res.records.map(item => {
							if (item && item.coverPic) {
								item.coverPic = JSON.parse(item.coverPic)
								item["imgLeft"] = item.coverPic.length && item.coverPic[0];
							}
						})
						if (this.page == 1) {
							this.list = res.records
						} else {
							this.list = this.list.concat(res.records)
						}
						this.total = res.total
					}
				})
			},
			// 获取收藏的店铺
			getShopping() {
				this.$httpApi.getFavShop().then(res => {
					if (res) {
						this.list = res;
					}
				})
			},
			// 获取收藏的商品
			getMallList() {
				this.$httpApi.getFavProduct({
					current: this.page,
					size: this.size,
				}).then(res => {
					if (res) {
						if (this.page == 1) {
							this.list = res.records
						} else {
							this.list = this.list.concat(res.records)
						}
						this.total = res.total
					}
				})
			},
			// 获取收藏的觅友圈
			getMiyouList() {
				this.$httpApi.getMiYouList({
					current: this.page,
					size: this.size,
					collectFlag: true,
					userId: this.userId
				}).then(res => {
					if (res) {
						if (this.page == 1) {
							this.list = res.records
						} else {
							this.list = this.list.concat(res.records)
						}
						this.total = res.total
					}
				})
			},
			// 获取工人收藏
			getMasterList() {
				this.$httpApi.getFavMaster().then(res => {
					if (res) {
						this.list = res;
					}
				})
			},
			moreNews(data) {
				this.curMaster = data;
				this.contactPopup = true;
			},
			// 进店
			goShop(data) {
				if (data.companyId != -1) {
					this.toPage(`/pages-mall/shopInformation/shopInformation?companyId=${data.companyId}`)
				} else {
					const obj = {
						companyLogo: data.companyLogo,
						companyShortName: data.companyName,
						completeAddress: data.completeAddress,
						contactTel: data.companyTel
					}
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?cityOperatorId=${data.cityOperatorId}&data=${JSON.stringify(obj)}`
					)
				}
			},
		},
		onReachBottom() {
			if (this.list.length >= Number(this.total)) {
				this.status = 'nomore';
				return
			}
			this.status = 'loadmore';
			this.page += 1
			switch (this.current) {
				case 0:
					this.getMallList()
					break
				case 1:
					this.getCaseList()
					break
				case 2:
					this.getMiyouList()
					break
				case 3:
					this.getMasterList()
					break
			}
		},
	}
</script>

<style lang="scss" scoped>
	.navbar-right {
		margin-right: 40rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #909299;

		.icon {
			width: 30rpx;
			max-height: 30rpx;
			margin-right: 20rpx;
		}
	}

	.tabs {
		width: 710rpx;
		height: 80rpx;
		margin: 0 20rpx;
		padding: 20rpx 0;
		position: fixed;
		top:88rpx + var(--status-bar-height);
		z-index: 99;
		background: #fff;
	}

	.contain-all {}

	.content {
		width: 100vw;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		position: relative;

		.item-contain {
			display: flex;
		}

		.left {
			width: 204rpx;
			height: 204rpx;
			margin-right: 30rpx;
		}

		.right {
			width: calc(100vw - 274rpx);
			height: 204rpx;

			.info {
				width: calc(100vw - 274rpx);

				.topper {
					width: calc(100vw - 274rpx);
					@include bov(2);
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 900;
					font-size: 32rpx;
					line-height: 44rpx;
					color: #333333;
				}

				.lower {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 24rpx;
					line-height: 34px;
					color: #909199;
				}

				.price {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #FE6E32;
				}
			}
		}
	}
	.list-product{
		margin-top: 90rpx;
	}
	.waterfall {
		width: 690rpx;
		margin: 0 auto;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.master {
		.master-list {
			padding: 20rpx 0;
			margin: 0 30rpx;
			border-bottom: 2rpx solid #E6E6E6;

			&:last-child {
				border-bottom: 0;
			}

			.master-item {
				flex: 1;
				padding-left: 30rpx;

				.master-item_top {
					display: flex;
					align-items: center;

					.master_name {
						color: #141414;
						font-size: 28rpx;
						font-family: PingFang-SC;
						font-weight: bold;
						margin-right: 20rpx;
					}

					.skill_name {
						color: #FE6E32;
						border-radius: 6rpx;
						border: 2rpx solid #FE6E32;
						font-size: 21rpx;
						padding: 1rpx 10rpx;
						font-weight: 600;

						&:last-child {
							margin-right: 0;
						}
					}

				}

				.master-item_buttom {
					font-size: 24rpx;
					padding-top: 10rpx;

					.text {
						padding: 0 10rpx;
						color: #808080;
						font-size: 24rpx;
					}
				}
			}
		}
	}

	.shopping-list {
		padding: 0 30rpx 0;
	}
</style>
