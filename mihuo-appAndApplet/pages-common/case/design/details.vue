<template>
	<view class="case-details-contain">
		<z-nav-bar backState="3000" :scrollTop="scrollTop" type="transparentFixed" bgColor="#FFFFFF" @backClick="back">
			<view slot="default" class="nav-bar">{{ details.name }}</view>
			<!-- #ifdef APP-PLUS -->
			<view slot="right" class="share-mask" @click="shareCase">
				<image src="https://www.51mihuo.com/static/images/order_details/share.png" class="share-icon"></image>
			</view>
			<view slot="transparentFixedRight" class="share-mask-fixed" @click="shareCase">
				<image src="https://www.51mihuo.com/static/images/order_details/share.png" class="share-icon"></image>
			</view>
			<!-- #endif -->
		</z-nav-bar>
		<view class="case-top">
			<view class="right-contain" id="right-contain" :style="{'left':leftNum + 'rpx'}">
				<view class="left-image">
					<swiper class="flex-center-item" :indicator-dots="false" :autoplay="false" @change="onSwiperChange">
						<swiper-item v-for="(item,index) in coverPicList" :key="index">
							<image class="flex-center-item" mode="aspectFill"
								@click="getPreview('图片', $util.thumbnailImage(item,false))"
								:src="$util.thumbnailImage(item,true)">
						</swiper-item>
					</swiper>
				</view>
				<view class="right-image">
					<swiper class="flex-center-item" :indicator-dots="false" :autoplay="false" @change="onSwiperChange">
						<swiper-item v-for="(item, index) in roomPicList" :key="index">
							<image class="flex-center-item" mode="aspectFill"
								@click="getPreview('户型图', $util.thumbnailImage(item,false))"
								:src="$util.thumbnailImage(item,true)" />
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="case-image-num-contain">
				<text
					class="image-num-text">{{imageTypeIndex === 1 ? `${type1Current}/` + coverPicList.length : `${type2Current}/` + roomPicList.length}}</text>
			</view>
			<view class="image-switch">
				<view class="left " :class="[imageTypeIndex === 1?'active':''] " @click="imageSwitch(1,0)">图片</view>
				<view class="right" :class="[imageTypeIndex === 2?'active':''] " @click="imageSwitch(2,-750)">户型图</view>
			</view>
		</view>
		<view class="details-contain">
			<view class="title">{{ details.name }}
				<!-- <view class="focus-on" @click="follow">关注</view> -->
			</view>
			<!-- <view class="company">
				<view class="company-item">
					<u-avatar size="94" :src="$util.thumbnailImage(details.designerAvatar, false)">
					</u-avatar>
					<text class="company-name">{{details.designerName}}</text>
				</view>
			</view> -->
			<view class="details-information">
				<view class="style-item">
					<text class="style-lable">户型</text>
					<text class="style-value" v-show="details.model">{{details.model}}</text>
				</view>
				<view class="style-item">
					<text class="style-lable">面积</text>
					<text class="style-value" v-show="details.area">{{details.area}}m²</text>
				</view>
				<view class="style-item">
					<text class="style-lable">风格</text>
					<text class="style-value" v-show="details.style">{{details.style}}</text>
				</view>
				<!-- <view class="style-item">
					<text class="style-lable">施工用时</text>
					<text class="style-value">45天</text>
				</view> -->
			</view>
			<view class="case-item" v-for="(item,index) in contentList" :key="index">
				<view class="item-top">
					<view class="item-border"></view>
					<view class="text">{{item.title}}</view>
					<view class="text-log">
						{{ getSubtitle(item.title) }}
					</view>
				</view>
				<!-- #ifdef MP -->
				<image v-for="(el,i) in item.url" :key="i" v-show="item.processPic" height="300" mode="widthFix"
					class="case-item-contain" border-radius="10"
					@click="getPreview('详情',$util.thumbnailImage(el,false))" :src="$util.thumbnailImage(el, true, 750)">
				</image>
				<!-- #endif -->
				<!-- #ifndef MP -->
				<common-mh-img-cache-fun v-for="(el,i) in item.url" :key="i" v-show="item.processPic" height="300"
					mode="widthFix" class="case-item-contain" border-radius="10"
					@click="getPreview('详情',$util.thumbnailImage(el,false))" :src="$util.thumbnailImage(el, true, 750)">
				</common-mh-img-cache-fun>
				<!-- #endif -->
				<text v-show="item.description" class="case-describe">
					{{item.description}}
				</text>
			</view>
		</view>
		<view class="case-bottom">
			<view class="item-button button-dz" @click="caseBottom('点赞', !details.likeFlag ? 1 :3)">
				<image v-if="!details.likeFlag" src="@/pages-common/static/images/case/dz_1.png" mode=""></image>
				<image v-if="details.likeFlag" src="@/pages-common/static/images/case/dz_0.png" mode=""></image>
				<text class="item-button-num" v-show="details.likeNum">{{details.likeNum}}</text>
			</view>
			<view class="item-button button-dz" @click="caseBottom('收藏', !details.holdFlag ? 2 :4)">
				<image v-if="!details.holdFlag" src="@/pages-common/static/images/case/sc_1.png" mode=""></image>
				<image v-if="details.holdFlag" src="@/pages-common/static/images/case/sc_0.png" mode=""></image>
				<text class="item-button-num" v-show="details.holdNum">{{details.holdNum}}</text>
			</view>
			<!-- 	<view class="item-button" @click="getDecorate">
				<view class="decorate">我要同款设计</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import baseConfig from '@/config/common.js'
	
	export default {
		data() {
			return {
				type1Current: 1,
				type2Current: 1,
				contentList: [],
				details: {},
				coverPicList: [],
				leftNum: 0,
				imageTypeIndex: 1,
				transStyle: 0,
				roomPicList: [],
				option: {},
				isFromShare: false,
				scrollTop: 0
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		onLoad(option) {
			this.option = option
			if (option.isFromShare == '1') {
				this.isFromShare = true
			}
			this.getDetails()
			this.addToHistory()
		},
		methods: {
			getSubtitle(subtitle) {
				switch (subtitle) {
					case '原始结构图':
						return 'CONSTUCTION'
					case '设计图':
						return 'DESIGN'
					case '客厅':
						return 'LIVING ROOM'
					case '餐厅':
						return 'CANTEEN'
					case '厨房':
						return 'kITCHEN'
					case '主卧':
						return 'MASTER BEDROOM'
					case '侧卧':
						return 'BEDROOM'
					case '次卧':
						return 'BEDROOM'
					case '儿童房':
						return 'KIDS ROOM'
					default:
						return subtitle.substring(0, 10)
				}
			},
			onSwiperChange(e) {
				if (this.imageTypeIndex === 1) {
					this.type1Current = e.detail.current + 1
				} else {
					this.type2Current = e.detail.current + 1
				}
			},
			addToHistory() {
				if (uni.getStorageSync('userData')) {
					this.$httpApi.addItemToHistory({
						dataId: this.option.id,
						dataType: 2
					}).then(res => {});
				}
			},
			getDetails() {
				this.$httpApi.getCaseDetail({
					id: this.option.id,
					userId: uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser.userId
				}).then(res => {
					if (res) {
						let tempList = JSON.parse(res.content) || []
						tempList.map(item => {
							item['url'] = item.processPic.split(',')
						})
						this.roomPicList = res.roomPic !== null ? res.roomPic.split(',') : [],
							this.roomPicList.map(item => {
								item = this.$util.thumbnailImage(item, true)
							})
						this.details = res
						this.coverPicList = res.coverPic && res.coverPic.split(',')
						this.contentList = tempList
					}
				})
			},
			back() {
				if (this.isFromShare) {
					this.toTab('/pages/home/home')
				} else {
					this.goBack()
				}
			},
			caseBottom(val, num) {
				if (!uni.getStorageSync('userInfo') || !uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					return;
				}
				if (val === '分享') {
					this.$util.toast('分享');
					return;
				}
				this.$httpApi.addItemToFav({
					id: this.details.id,
					operation: num
				}).then(res => {
					if (res) {
						this.getDetails()
					}
				})
			},
			// 分享案例到小程序
			shareCase() {
				const coverImg = this.$util.thumbnailImage(this.details.coverPic.split(',')[0], true, 750)
				const path = `/pages-common/case/design/details?id=${this.details.id}&isFromShare=${1}`
				this.$util.shareToWechat(this.miyou.title, coverImg, path, '案例详情', true, 2)
			},
			// TODO
			follow() {
				this.$util.toast('关注');
			},
			imageSwitch(index, num) {
				this.imageTypeIndex = index
				this.leftNum = num
			},
			getPreview(typeName, url) {
				let tempCover = this.coverPicList.map(item => {
					return this.$util.thumbnailImage(item, false)
				})
				let tempRoom = this.roomPicList.map(item => {
					return this.$util.thumbnailImage(item, false)
				})
				uni.previewImage({
					current: url,
					urls: typeName === '图片' ? tempCover : typeName === '详情' ? [url] : tempRoom,
				});
			},
			getDecorate() {
				this.$util.toast('详情请查看分类-服务-设计');
			},
			getPreviews(url) {
				uni.previewImage({
					current: url,
					urls: [url]
				})
			}
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
		//页面下拉刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {},
		//用户点击分享
		onShareAppMessage(e) {
			const coverImg = this.$util.thumbnailImage(this.details.coverPic.split(',')[0], true)
			const path = `/pages-common/case/design/details?id=${this.details.id}&isFromShare=${1}`
			const result = this.$util.shareToWechat(this.miyou.title, coverImg, path, '案例详情', true, 1)
			return result
		},
	}
</script>

<style lang="scss" scoped>
	.case-details-contain {
		.share-mask-fixed {
			width: 70rpx;
			height: 70rpx;
			margin-right: 30rpx;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, .5);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.share-mask {
			width: 70rpx;
			height: 70rpx;
			margin-right: 30rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.share-icon {
			width: 34rpx;
			height: 34rpx;
		}

		.case-top {
			position: relative;
			overflow: hidden;

			.right-contain {
				width: 1500rpx;
				height: 750rpx;
				overflow-y: hidden;
				transition: all .2s;
				position: relative;
				display: flex;
				flex-direction: row;

				.left-image,
				.right-image {
					width: 750rpx;
				}
			}

			.flex-center-item {
				height: 750rpx;
				width: 100%;
			}

			.image-switch {
				width: 192rpx;
				height: 50rpx;
				background-color: #FFFFFF;
				position: absolute;
				bottom: 60rpx;
				left: 40%;
				display: flex;
				flex-direction: row;
				border-radius: 50rpx;

				.left,
				.right {
					flex: 1;
					border-radius: 50rpx;
					text-align: center;
					font-size: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.active {
					background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
					color: #FFFFFF;
				}
			}

			.flex-center {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 75rpx;
				height: 75rpx;
				border-radius: 50%;
				background: rgba(0, 0, 0, 0.2);
			}

			.case-image-num-contain {
				position: absolute;
				bottom: 60rpx;
				right: 20rpx;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 15px;
				display: flex;
				width: 86rpx;
				height: 40rpx;
				align-items: center;
				justify-content: center;

				.image-num-text {
					font-size: 28rpx;
					color: #FFFFFF;
					margin-left: 8rpx;
				}
			}
		}

		.details-contain {
			margin-top: -30rpx;
			border-radius: 30rpx;
			background-color: #FFFFFF;
			position: relative;
			padding: 0 30rpx 160rpx 30rpx;

			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #303133;
				padding: 34rpx 28rpx;

				.focus-on {
					width: 100rpx;
					height: 40rpx;
					text-align: center;
					background: #FFFFFF;
					border-radius: 8rpx;
					font-size: 24rpx;
					line-height: 40rpx;
					color: #FF5D35;
					border: 2rpx solid #FF5D35;
				}
			}

			.company {
				min-height: 148rpx;
				background: #F7F7F7;
				border-radius: 10rpx;
				margin-bottom: 16rpx;
				padding: 28rpx 34rpx 26rpx 34rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.company-item {
					display: flex;
					align-items: center;

					.company-name {
						margin-left: 26rpx;
						font-weight: bold;
						font-size: 32rpx;
						line-height: 44rpx;
						color: #303133;
					}
				}
			}

			.details-information {
				min-height: 148rpx;
				margin-bottom: 26rpx;
				display: flex;
				justify-content: space-between;

				.style-item {
					width: 33.3%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.style-lable {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #666666;
					}

					.style-value {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 28rpx;
						line-height: 44rpx;
						color: #6C2E00;
					}
				}
			}

			.case-item {
				margin-bottom: 40rpx;

				.case-item-contain {
					width: 100vw;
					margin-bottom: 34rpx;
					min-height: 300rpx;
					border-radius: 10rpx;

					.u-lazy-item {
						width: 100%;
					}
				}

				&:last-child {
					margin-bottom: 0;
				}

				.item-top {
					display: flex;
					align-items: center;
					margin-bottom: 28rpx;
					position: relative;

					.item-border {
						width: 8rpx;
						height: 40rpx;
						background: linear-gradient(325.49deg, #FE6E32 14.07%, #FE9432 83.89%);
						border-radius: 16rpx;
					}

					.text {
						margin-left: 12rpx;
						position: relative;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 900;
						font-size: 32rpx;
						line-height: 44rpx;
						color: #303133;
						z-index: 3;
					}

					.text-log {
						position: absolute;
						top: 0rpx;
						margin-left: 40rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 900;
						font-size: 24px;
						line-height: 44px;
						color: #EEEEEE;
						z-index: 2;
					}
				}

				.case-describe {
					font-weight: bold;
					font-size: 30rpx;
					font-family: PingFang SC;
					line-height: 1.5;
					color: #606166;
				}

				.room-image {
					margin-bottom: 14rpx;

					&:last-child {
						margin-bottom: 0;
					}
				}
			}

			.case-construction {
				margin-bottom: 46rpx;
			}
		}

		.case-bottom {
			display: flex;
			position: fixed;
			background-color: #FFFFFF;
			bottom: 0;
			width: 100%;
			z-index: 99;
			padding: 26rpx 20rpx;
			justify-content: flex-end;
			padding-bottom: calc(env(safe-area-inset-bottom));

			.decorate {
				padding: 24rpx 80rpx;
				background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
				border-radius: 10rpx;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #FFFFFF;
			}

			.item-button {
				width: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;

				image {
					width: 46rpx;
					height: 46rpx;
				}

				.item-button-num {
					font-weight: bold;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #FF5D35;
					top: 20rpx;
					margin-bottom: 20rpx;
				}
			}

			.button-share {
				image {
					margin-right: 12rpx;
				}
			}

			.button-sc {
				image {
					margin-right: 12rpx;
				}
			}

			.button-dz {
				image {
					margin-right: 6rpx;
				}
			}
		}
	}
</style>
