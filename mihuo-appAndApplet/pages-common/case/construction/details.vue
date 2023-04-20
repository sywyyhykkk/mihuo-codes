<template>
	<view class="case-details-contain">
		<view class="case-top">
			<view class="img-top">
				<view class="flex-center" @click="back">
					<image style="width: 36rpx; height: 24rpx;" src="@/pages-common/static/icon/icon_back_white.png"></image>
				</view>
				<view class="img-right">
					<view class="flex-center" @click="addToFav">
						<image v-if="!details.isCollect" src="@/pages-common/static/images/case/sc_1.png" mode=""></image>
						<image v-if="details.isCollect" src="@/pages-common/static/images/case/sc_0.png" mode=""></image>
					</view>
					<view class="flex-center" @click="share">
						<image src="@/pages-common/static/icon/share_2.png"></image>
					</view>
				</view>
			</view>
			<view class="right-contain" id="right-contain" :style="{'left':leftNum + 'rpx'}">
				<view class="left-image">
					<swiper class="flex-center-item" :indicator-dots="false" :autoplay="false" @change="onSwiperChange">
						<swiper-item v-for="(item,index) in coverPicList" :key="index">
							<img-cache-temporary class="flex-center-item" mode="aspectFill"
								@click="getPreview('图片', $util.thumbnailImage(item,false))"
								:src="$util.thumbnailImage(item, true)" />
						</swiper-item>
					</swiper>
				</view>
				<view class="right-image">
					<swiper class="flex-center-item" :indicator-dots="false" :autoplay="false" @change="onSwiperChange">
						<swiper-item v-for="(item,index) in roomPicList" :key="index">
							<image class="flex-center-item" mode="aspectFill"
								@click="getPreview('户型图', $util.thumbnailImage(item,false))"
								:src="$util.thumbnailImage(item, true)" />
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
			<view class="details-contain-top public-bm">
				<view class="title">{{ details.name || '案例名称' }}
					<view class="follow" @click="follow">
						关注
					</view>
				</view>
				<view class="details-information">
					<view class="style-item">
						<text class="style-lable">户型</text>
						<text class="style-value">{{ getHouseType }}</text>
					</view>
					<view class="style-item">
						<text class="style-lable">面积</text>
						<text class="style-value">{{ getHouseArea }}</text>
					</view>
					<view class="style-item">
						<text class="style-lable">风格</text>
						<text class="style-value">{{ getStyle }}</text>
					</view>
				</view>
			</view>
			<view class="tab-switch public-bm">
				<view class="switch-contain">
					<text v-for="(item, index) in typeSwitch" :key="index"
						@click="getTypeSwitch(item.name)">{{item.name}}</text>
				</view>
				<common-mh-node-processes v-if="isShowNode" :currentFlowType="details.flowTypeId"></common-mh-node-processes>
			</view>
			<view class="log-header" v-if="caseLog.length !== 0">
				<view class="item-top">
					<image class="img" src="@/pages-common/static/images/home/dian_2.png"></image>
					<view class="text">服务日志</view>
				</view>
			</view>
			<view class="log-all" v-if="caseLog.length !== 0">
				<common-mh-construction-log @updateLog="getCaseLog" :isLast="index === caseLog.length - 1" :titleType="false" v-for="(item, index) in caseLog" :key="item.id" :logItem="item"></common-mh-construction-log>
			</view>
		</view>
		<view class="case-bottom iphonex-bottom">
			<view class="item-button button-dz" @click="caseBottom('点赞')">
				<image v-if="!details.isLike" src="@/pages-common/static/images/case/dz_1.png" mode=""></image>
				<image v-if="details.isLike" src="@/pages-common/static/images/case/dz_0.png" mode=""></image>
				<text class="item-button-text">点赞</text>
				<text class="item-button-num">{{details.likeNum || 0}}</text>
			</view>
			<view class="item-button" @click="getDecorate">
				<view class="decorate">我也要装修</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowNode: true,
				imageTypeIndex: 1,
				leftNum: 0,
				type1Current: 1,
				type2Current: 1,
				details: {},
				caseLog: [], // 施工日志
				coverPicList: [],
				roomPicList: [],
				typeSwitch: [{
					name: '设计图纸'
				}, {
					name: '参考花销'
				}, {
					name: '装修日历'
				}, {
					name: '品质保障'
				}],
				houseType: [],
				houseArea: [],
				houseStyle: [],
				houseStyle: [],
				option: {}
			}
		},
		onLoad(option) {
			this.option = option
			// this.option = {id: '23'}
			this.getDetails()
			this.getCaseLog()
			this.getHouseStyleDict()
			this.getHouseTypeDict()
			this.getHouseAreaDict()
		},
		onShow() {
			this.$forceUpdate()
		},
		computed: {
			getHouseType() {
				let str = ''
				this.houseType.forEach(item => {
					if (item.value === this.details.houseTypeId) {
						str = item.label
					}
				})
				return str
			},
			getHouseArea() {
				let str = ''
				this.houseArea.forEach(item => {
					if (item.value === this.details.houseAreaId) {
						str = item.label
					}
				})
				return str
			},
			getStyle() {
				let str = ''
				this.houseStyle.forEach(item => {
					if (item.value === this.details.houseStyleId) {
						str = item.label
					}
				})
				return str
			}
		},
		methods: {
			getHouseStyleDict() {
				this.$httpApi.getDictByType({
					type:"house_style",
					cityOperatorId: uni.getStorageSync('cityOperatorId') || ''
				}).then(res => {
					if (res) {
						uni.setStorageSync('House_Style', res)
						this.houseStyle = uni.getStorageSync('House_Style')
					}
				})
			},
			getHouseTypeDict() {
				this.$httpApi.getDictByType({
					type:"house_type",
					cityOperatorId: uni.getStorageSync('cityOperatorId') || ''
				}).then(res => {
					if (res) {
						uni.setStorageSync('House_Type', res)
						this.houseType = uni.getStorageSync('House_Type')
					}
				})
			},
			getHouseAreaDict() {
				this.$httpApi.getDictByType({
					type:"area_options",
					cityOperatorId: uni.getStorageSync('cityOperatorId') || ''
				}).then(res => {
					if (res) {
						uni.setStorageSync('House_Area', res)
						this.houseArea = uni.getStorageSync('House_Area')
					}
				})
			},
			getCaseLog(){
				this.$httpApi.getConstructionLogByCaseId({caseId: this.option.id}).then(res => {
					if(res){
						this.caseLog = res.records
					}
				})
			},
			getDetails() {
				this.isShowNode = false
				this.$httpApi.getConstructionById(this.option.id).then(res => {
					if (res) {
						this.details = res
						this.coverPicList = []
						this.roomPicList = []
						if (this.details.coverPic) {
							this.details.coverPic.split(',').forEach(item => {
								this.coverPicList.push(this.$image.imageGlobal + item)
							})
						}
						if (this.details.imagesHouseType) {
							this.details.imagesHouseType.split(',').forEach(item => {
								this.roomPicList.push(this.$image.imageGlobal + item)
							})
						}
						this.isShowNode = true
					}
				})
			},
			onSwiperChange(e) {
				if (this.imageTypeIndex === 1) {
					this.type1Current = e.detail.current + 1
				} else {
					this.type2Current = e.detail.current + 1
				}
			},
			back() {
				this.goBack()
			},
			imageSwitch(index, num) {
				this.imageTypeIndex = index
				this.leftNum = num
			},
			caseBottom(val) {
				if (val === '分享') {
					this.$util.toast('分享');
					return
				}
				// 点赞案例
				if (val === '点赞') {
					this.$httpApi.likeConstructionById({
						caseId:  Number(this.details.id),
						isLike: this.details.isLike ? 0 : 1
					}).then(res => {
						if(res){
							this.getDetails()
						}
					})
				}
			},
			// 收藏案例
			addToFav() {
				this.$httpApi.collectConstructionById({
					caseId: Number(this.details.id),
					isLike: this.details.isCollect ? 0 : 1
				}).then(res => {
					if(res){
						this.getDetails()
					}
				})
			},
			share() {
				// this.$util.toast('分享');
			},
			follow() {
				// this.$util.toast('关注');
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
				// this.$util.toast('装修');
			},
			getTypeSwitch(val) {
				this.$util.toast(val);
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
	}
</script>

<style lang="scss" scoped>
	.case-details-contain {

		.public-bm {
			background-color: #FFFFFF;
			padding-left: 20rpx;
			padding-right: 20rpx;
		}

		.case-top {
			position: relative;
			overflow: hidden;

			.img-top {
				position: absolute;
				z-index: 99;
				width: 100%;
				display: flex;
				justify-content: space-between;
				padding: 0 20rpx 0 20rpx;
				top: var(--status-bar-height);
				margin-top: 20rpx;

				.img-right {
					display: flex;

					.flex-center {
						&:nth-of-type(1) {
							margin-right: 18rpx;
						}
					}

					image {
						width: 40rpx;
						height: 40rpx;

					}
				}
			}

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
				bottom: 100rpx;
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
				z-index: 99;
				bottom: 100rpx;
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
			border-radius: 30rpx;
			position: relative;
			z-index: 99;
			padding: 0 0rpx 160rpx 0rpx;

			.details-contain-top {
				margin-top: -80rpx;
				border-radius: 30rpx 30rpx 10rpx 10rpx;
				padding-bottom: 20rpx;

				.title {
					font-weight: bold;
					font-size: 32rpx;
					line-height: 44rpx;
					color: #303133;
					padding: 34rpx 28rpx 38rpx 28rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.follow {
						width: 100rpx;
						height: 40rpx;
						border-radius: 8rpx;
						border: 2rpx solid #FE6E32;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 24rpx;
						line-height: 40rpx;
						text-align: center;
						color: #FE6E32;
					}
				}

				.details-information {
					background: linear-gradient(90deg, #FFF5E3 -2.99%, #FFEFE0 97.01%);
					border-radius: 10rpx;
					min-height: 148rpx;
					display: flex;
					justify-content: space-around;
					padding: 38rpx 0rpx;

					.style-item {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						.style-lable {
							font-weight: normal;
							font-size: 26rpx;
							line-height: 36rpx;
							color: #CD702C;
						}

						.style-value {
							font-weight: bold;
							font-size: 26rpx;
							line-height: 36rpx;
							color: #6C2E00;
						}

					}
				}
			}

			.tab-switch {
				margin-top: 16rpx;
				border-radius: 30rpx 30rpx 10rpx 10rpx;
				padding-top: 14rpx;

				.switch-contain {
					padding: 38rpx 26rpx;
					box-shadow: 0px 4rpx 8rpx rgba(193, 193, 193, 0.25);
					display: flex;
					justify-content: space-between;
					position: relative;
					margin-bottom: 20rpx;

					text {
						font-weight: bold;
						font-size: 30rx;
						line-height: 42rpx;
						color: #606166;
						position: relative;

						&:nth-of-type(4)::before {
							height: 0rpx;
						}

						&::before {
							content: '';
							border-right: 2rpx solid #DBDBDB;
							height: 24rpx;
							position: absolute;
							top: 10rpx;
							right: -24rpx;
						}
					}
				}
			}
						
			.log-header {
				margin-top: 20rpx;
				
				.item-top {
					display: flex;
					align-items: center;
					position: relative;
					padding-left: 20rpx;
			
					image {
						width: 8rpx;
						height: 40rpx;
					}
			
					.text {
						margin-left: 12rpx;
						position: relative;
						z-index: 2;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 900;
						font-size: 32rpx;
						line-height: 44rpx;
						color: #303133;
						margin-left: 20rpx;
					}
			
					.text-log {
						position: absolute;
						left: 74rpx;
						top: 8rpx;
					}
				}
			}
			
			.log-all {
				margin-top: 20rpx;
			}

			.case-item {
				margin-bottom: 34rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.item-top {
					display: flex;
					align-items: center;
					margin-bottom: 28rpx;
					position: relative;

					image {
						width: 32rpx;
						height: 24rpx;
					}

					.text {
						margin-left: 12rpx;
						position: relative;
						z-index: 99;
					}

					.text-log {
						position: absolute;
						left: 74rpx;
						top: 8rpx;
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
			min-height: 140rpx;
			bottom: 0;
			width: 100%;
			z-index: 99;
			padding: 26rpx 20rpx;
			justify-content: space-between;

			.button-dz {
				flex: 1;
				justify-content: center;
			}

			.item-button {
				display: flex;
				align-items: center;
				position: relative;

				.decorate {
					padding: 24rpx 110rpx;
					background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
					border-radius: 10rpx;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #FFFFFF;
				}

				image {
					width: 46rpx;
					height: 46rpx;
				}

				.item-button-text {
					color: #666666;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
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

			.button-dz {
				image {
					margin-right: 6rpx;
				}
			}
		}
	}
</style>
