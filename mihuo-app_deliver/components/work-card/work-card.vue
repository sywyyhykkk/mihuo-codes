<template>
	<view class="card" @click.stop="cardClicked">
		<view class="main-container">
			<view class="info">
				<view class="header-content">
					<view class="left">
						<view class="item-work-type-default" :class="setSkillNameLength(work.skillName)">
							<text class="type-text">{{ work.skillName || '其他' }}</text>
						</view>
						<text class="requirement-title">{{ setRequirementTitle}}</text>
					</view>
					<text v-if="work.priceWay == 1" class="right">
						<text class="item-price-title" v-if="setPrice !== '协议价' ">
							一口价
						</text>
						<text class="item-price" v-if="setPrice">
							{{setPrice}}
							<text class="unit" v-if="setPrice !== '协议价' ">
								元
							</text>
						</text>
					</text>
					<text v-else class="right right-other">
						<text class="item-price">
							{{setPrice}}
						</text>
					</text>
				</view>
				<view class="location">
					<view class="left">
						<image src="../../static/icon/work_card/location.png" class="icon"></image>
						<view class="address">{{ work.latAddress || '暂无' }}{{work.poiName}}</view>
					</view>
					<view class="right">{{getDistance}}</view>
				</view>
				<view class="note">
					<view class="left">
						<view class="tag">
							<view class="item-tag">智能推荐</view>
						</view>
						<view class="tag-other" v-if="setPublishType">
							<view class="item-tag-other">{{setPublishType}}</view>
						</view>
						<view class="tag-other-type">
							<view class="item-tag-other">{{work.requirementTypeName}}</view>
						</view>
					</view>
					<view class="right">
						<!-- <view class="colored-text order-grabbing">{{ work.competitionCount || 0 }}人抢单</view> -->
						<view class="colored-text">{{ work.browseCount || 0 }}人</view>查看
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="left">
				<text class="item-time">{{work.timeNew}}</text>
				<text class="item-befor-time">{{work.beforeTime}}</text>
			</view>
			<view class="right" :class="[work.priceWay == 2 ? 'right-active':'']" @click="cardClicked">
				{{work.priceWay == 2 ? '竞价':'抢单'}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getSkillType,
		getRequirementType,
		getDistance,
		getImgByJobCode
	} from "@/plugins/utils.js";

	export default {
		name: "work-card",
		props: {
			work: {},
		},
		data() {
			return {
				attachment: {},
				imgUrl: '',
				imgFileList: [],
			};
		},
		mounted() {
			if (this.work.attachments) {
				const attObj = JSON.parse(this.work.attachments);
				attObj.forEach(item => {
					if (item && item.type === 'img') {
						this.imgFileList.push(this.$util.thumbnailImage(item.url, true, 176));
					}
				})
				this.imgUrl = this.imgFileList[0];
			}
		},
		computed: {
			getSkillType() {
				return getSkillType(this.work.skillType);
			},
			getRequirementType() {
				return getRequirementType(this.work.requirementType);
			},
			getDistance() {
				if (this.work.distance > 10000) {
					return ''
				}
				return getDistance(this.work.distance);
			},
			setUrl() {
				// 没有附件图片时显示默认图片
				return getImgByJobCode(this.work.jobCode);
			},
			setPrice() {
				switch (this.work.priceWay) {
					case 1:
						return this.work.price || 0
					case 2:
						return '竞价'
					case 3:
						return '上门报价'
				}
				return
				if ([2, 3].indexOf(Number(this.work.publishType)) !== -1) {
					if (this.work.price) {
						return this.work.price || 0
					} else {
						return '协议价'
					}
				} else {
					switch (this.work.priceWay) {
						case 1:
							return this.work.price || 0
						case 2:
							return '竞价'
						case 3:
							return '议价'
					}
				}
			},
			setPublishType() {
				switch (this.work.source) {
					case 1:
						return '个人'
					case 2:
						return '服务者'
					case 3:
						return '企业'
					case 4:
						return '平台'
				}
			},
			setRequirementTitle() {
				let temp = this.work.requirementName
				if (temp) {
					if (temp.length > 40) {
						temp = temp.substring(0, 36) + '...'
					}
					// 处理  requirementName 为 null需要null服务 的情况
					if (temp.indexOf('null') !== -1) {
						if (this.work) {
							temp = `${this.work.poiName}需要${this.work.requirementTypeName}${this.work.skillName}`
							if (temp.indexOf('null') !== -1) {
								temp = temp.replace('null', '')
							}
						}
					}
				} else {
					// 25195 默认模板：{POIName}需要{需求类型}{岗位}
					if (this.work) {
						temp = `${this.work.poiName}需要${this.work.requirementTypeName}${this.work.skillName}`
						if (temp.indexOf('null') !== -1) {
							temp = temp.replace('null', '')
						}
					}
				}
				return temp
			}
		},
		methods: {
			cardClicked() {
				this.debounce(() => {
					let userId = uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser.userId
					if (!userId) {
						// #ifdef APP-PLUS
						uni.navigateTo({
							url: '/pages/univerifyLogin/univerifyLogin'
						})
						// #endif
						// #ifdef H5
						uni.navigateTo({
							url: '/pages/user/login'
						})
						// #endif
						return
					}
					uni.showLoading({
						isFullScreen: true
					})
					this.$httpApi.addOrderHistory({
						bizOrderId: this.work.id,
					}).then(res => {
						if (res) {
							uni.hideLoading()
							
							uni.setStorageSync('resutlDistance',this.getDistance)
							
							this.$emit('clicked', this.work);
						}
					}).catch(e => console.log(e));
				}, 200)
			},
			setSkillNameLength(item) {
				if (item) {
					switch (item.length) {
						case 2:
							return 'item-work-type'
						case 3:
							return 'item-work-type-medium'
						case 4:
							return 'item-work-type-big'
						default:
							return 'item-work-type-big'
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-around;
		// height: 344rpx;
		// width: 750rpx;
		margin-bottom: 14rpx;
		flex-direction: column;
		padding: 20rpx 28rpx 0 28rpx;

		.main-container {
			display: flex;
			align-items: center;

			.image-content {
				width: 176rpx;
				height: 176rpx;
				border-radius: 10rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				background-size: cover;
				background-image: url('../../static/images/home_work_bg.jpeg');

				.tag {
					width: 86rpx;
					// padding: 4rpx 8rpx;
					height: 36rpx;
					background-color: rgba(0, 47, 165, 0.2);
					background-size: 86rpx 36rpx;
					border-radius: 10rpx 0rpx 20rpx;
					background-repeat: no-repeat;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 20rpx;
					line-height: 36rpx;
					color: #FFFFFF;
					text-align: center;

					.tag-text {
						transform: scale(0.85);
						font-size: 24rpx;
						color: $themeColor;
					}
				}

				.type {
					background-color: rgba(0, 0, 0, 0.5);
					border-radius: 0px 0px 10rpx 10rpx;
					display: flex;
					justify-content: center;

					text {
						display: inline-block;
						transform: scale(0.85);
						font-family: PingFang SC;
						font-style: normal;
						font-size: 20rpx;
						line-height: 28rpx;
						text-align: center;
						color: #FFFFFF;
					}
				}
			}

			.info {
				width: 100%;
				padding-bottom: 2rpx;

				.header-content {
					width: 100%;
					// height: 58rpx;
					display: flex;
					justify-content: space-between;
					align-items: baseline;

					.left {
						// width: 310rpx;
						// display: flex;
						// align-items: baseline;
						// justify-content: flex-start;

						.item-work-type {
							width: 54rpx;
							background-image: url('../../static/icon/skill-name-1.png');
						}

						.item-work-type-medium {
							width: 76rpx;
							background-image: url('../../static/icon/skill-name-2.png');
						}

						.item-work-type-big {
							min-width: 100rpx;
							background-image: url('../../static/icon/skill-name-3.png');
						}

						.item-work-type-default {
							background-size: cover;
							background-repeat: round;
							height: 32rpx;
							text-align: center;
							line-height: 32rpx;
							margin-right: 4rpx;
							display: inline-flex;

							.type-text {
								white-space: nowrap;
								// text-align: center;
								color: $themeColor;
								font-size: 24rpx;
								display: inline-block;
								transform: scale(0.8);
								position: relative;
								transform-origin: center;
							}
						}



						.requirement-title {
							word-break: break-all;
							font-family: PingFang SC;
							font-style: normal;
							font-weight: 900;
							font-size: 30rpx;
							line-height: 44rpx;
							color: #333333;
						}

						@media screen and (max-width:) {}
					}



					.right {
						// min-width: 140rpx;
						// min-width: 86rpx;
						// display: flex;
						// flex-wrap: wrap;
						// align-items: center;
						text-align: right;
						// justify-content: flex-end;

						.item-price-title {
							font-size: 24rpx;
							color: #606166;
							margin-right: 4rpx;
							white-space: nowrap;
						}


						.item-price {
							font-weight: 900;
							font-size: 32rpx;
							line-height: 44rpx;
							color: $errorFontColor;
							font-family: PingFang SC;
							text-align: right;
							white-space: nowrap;
						}

						.unit {
							color: $errorFontColor;
							font-size: 24rpx;
							transform: scale(0.85);
							display: inline-block;
						}
					}

					.right-other {
						min-width: inherit;
						margin-left: 10rpx;

					}
				}

				.location {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					margin-top: 6rpx;

					.left {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.icon {
							width: 22rpx;
							height: 24rpx;
							margin-right: 4rpx;
						}

						.address {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							max-width: 500rpx;
							font-family: PingFang SC;
							font-style: normal;
							font-size: 26rpx;
							line-height: 36rpx;
							color: #303133;
						}
					}

					.right {
						font-family: PingFang SC;
						font-style: normal;
						font-size: 26rpx;
						line-height: 58rpx;
						color: #999999;
						width: 140rpx;
						text-align: right;
					}
				}

				.note {
					width: 100%;
					// height: 58rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 4rpx;

					.tag {
						width: 96rpx;
						background-color: rgba(255, 93, 53, 0.1);
						border-radius: 4rpx;
						font-family: PingFang SC;
						font-style: normal;
						text-align: center;
						height: 34rpx;
						line-height: 34rpx;

						.item-tag {
							transform: scale(0.85);
							font-size: 24rpx;
							color: #FF5D35;
						}


					}

					.tag-other {
						background-color: #E5EAF6;
						border-radius: 4rpx;
						padding: 0 8rpx;
						text-align: center;
						margin-left: 10rpx;

						.item-tag-other {
							transform: scale(0.85);
							font-size: 24rpx;
							color: #002FA5;
						}
					}

					.tag-other-type {
						background-color: #E5EAF6;
						border-radius: 4rpx;
						text-align: center;
						margin-left: 10rpx;
						padding: 0 8rpx;

						.item-tag-other {
							transform: scale(0.85);
							font-size: 24rpx;
							color: #002FA5;
						}
					}



					.left {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						font-family: PingFang SC;
						font-style: normal;
						font-size: 26rpx;
						color: #999999;
						flex: 1;
					}

					.right {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						font-family: PingFang SC;
						font-style: normal;
						font-size: 26rpx;
						line-height: 58rpx;
						color: #999999;
						// width: 220rpx;
						text-align: right;
					}

					.colored-text {
						font-family: PingFang SC;
						font-style: normal;
						font-size: 26rpx;
						line-height: 58rpx;
						color: #303133;
						margin-left: 12rpx;
					}

					.order-grabbing {
						margin-right: 40rpx;
					}
				}
			}
		}

		.footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// height: 108rpx;
			padding: 20rpx 0rpx;
			margin-top: 10rpx;
			border-top: 2rpx solid #F6F6F6;

			.left {
				.item-time {
					font-family: PingFang SC;
					font-style: normal;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #999999;
				}

				.item-befor-time {
					font-family: PingFang SC;
					font-style: normal;
					margin-left: 16rpx;
					color: #606166;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}

			.right {
				display: flex;
				align-items: center;
				padding: 10rpx 24rpx;
				background-color: #002FA5;
				border-radius: 10rpx;
				text-align: center;
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 400;
				font-size: 26rpx;
				color: #fff;
				justify-content: center;
			}

			.right-active {
				border: 2rpx solid #002FA5;
				background-color: #fff;
				color: #002FA5;
			}
		}
	}

	/deep/ uni-button {
		height: 64rpx !important;
		line-height: initial !important;
		font-size: 14px;
	}
</style>
