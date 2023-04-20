<template>
	<view class="card" @click="clicked">
		<view class="main-container">
			<view @tap.stop>
				<view class="image-content" @click="imagePreview"
					:style="{backgroundImage:`url(${getBackgroundImage})`}">
					<view class="tag">
						{{getRequirementType}}
					</view>
					<view class="type">
						{{work.publishType === 1 ? "个人发布" : work.publishType === 2? "企业发布" : "其他"}}
					</view>
				</view>
			</view>
			<view class="info">
				<view class="header-content">
					<view class="left">
						<skill-type-tag :title="getSkillType"></skill-type-tag>
						<view class="requirement-title">{{work.requirementTypeName || '无'}}</view>
					</view>
					<view class="right">
						{{work.price || 0}}元
					</view>
				</view>
				<view class="location">
					<view class="left">
						<u-icon name="map" color="#C2C2C2"></u-icon>
						<view class="address">{{work.address || '暂无'}}</view>
					</view>
					<view class="right">{{getDistance}}</view>
				</view>
				<view class="note">
					<view class="left">
						<u-tag class="tag" text="智能推荐" :closeable="false" color="#8E8E8E" bg-color="#F1F1F1"
							border-color="#E2E2E2" />
						<view class="colored-text">{{work.competitionCount || 0}}</view>人抢单
					</view>
					<view class="right">
						<view class="colored-text">{{work.browseCount || 0}}</view>人查看
					</view>
				</view>
			</view>
		</view>
		<u-divider :use-slot="false" half-width="45%" margin-top="20"></u-divider>
		<view class="footer">
			<view class="left">
				{{lastVisitedTime}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getSkillType,
		getRequirementType,
		getDistance
	} from "@/plugins/utils.js";

	export default {
		name: "work-hisroty-card",
		props: {
			workId: '',
			lastVisitedTime: ''
		},
		data() {
			return {
				work: {},
				attachment: {},
				imgUrl: '',
				imgFileList: [],
				defaultBackgroundImage: 'https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/575612f7078749f98df94508a4e5cb6c.jpeg', //默认图片路径
			};
		},
		mounted() {
			this.$http.get(`order/biz_order/${this.workId}`, {
				latitude: 24.8801,
				longitude: 102.8329,
			}).then(res => {
				this.work = res;
				if (this.work.attachments) {
					const attObj = JSON.parse(this.work.attachments);
					attObj.forEach(item => {
						if (item && item.type === 'img') {
							this.imgFileList.push(this.$image.imageGlobal + item.fileList.replace(
								'/admin/sys-file/mihuo-test/', ''));
						}
					})
					this.imgUrl = this.imgFileList[0];
				}
			}).catch(e => {
				console.log(e);
			});
		},
		computed: {
			getSkillType() {
				return getSkillType(this.work.skillType);
			},
			getRequirementType() {
				return getRequirementType(this.work.requirementType);
			},
			getDistance() {
				return getDistance(this.work.distance);
			},
			getBackgroundImage() {
				return this.imgUrl ? //没有附件图片时显示默认图片
					this.imgUrl : this.defaultBackgroundImage;
			}
		},
		methods: {
			clicked() {
				this.$http.post('order/biztrail/orderTrail', {
					bizOrderId: this.work.id,
				}).then(res => {
					this.toPage(`/pages/orderReceiving/orderReceiving?id=${this.work.id}`)
				}).catch(e => console.log(e));
			},
			imagePreview() {
				uni.previewImage({
					current: 0,
					urls: [this.getBackgroundImage]
				})
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
		height: 344rpx;
		width: 710rpx;
		padding-top: 20rpx;
		margin-bottom: 20rpx;
		flex-direction: column;

		.main-container {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 710rpx;

			.image-content {
				border-radius: 10rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				background-size: cover;
				height: 176rpx;
				width: 176rpx;
				background-image: url('../../static/images/home_work_bg.jpeg');
				margin-left: 24rpx;

				.tag {
					width: 70rpx;
					background-image: url('../../static/icon/work_card/work_card_tag.png');
					background-size: 70rpx;
					background-repeat: no-repeat;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 20rpx;
					line-height: 28rpx;
					color: #FFFFFF;
					text-align: center;
				}

				.type {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 20rpx;
					line-height: 28rpx;
					text-align: center;
					color: #FFFFFF;
					background-color: rgba(0, 0, 0, 0.5);
					border-radius: 0px 0px 10rpx 10rpx;
				}
			}

			.info {
				width: 470rpx;
				height: 176rpx;

				.header-content {
					height: 58rpx;
					width: 470rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-right: 20rpx;

					.left {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						width: 330rpx;

						.requirement-title {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							margin-left: 10rpx;
							font-family: PingFang SC;
							font-style: normal;
							font-weight: 900;
							font-size: 26rpx;
							line-height: 44rpx;
							color: #333333;
							width: 280rpx;
						}
					}

					.right {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 900;
						font-size: 32rpx;
						line-height: 44rpx;
						color: $themeColor;
						width: 100rpx;
						text-align: right;
					}
				}

				.location {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 58rpx;
					width: 470rpx;
					padding-right: 20rpx;

					.left {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.address {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							width: 280rpx;
							font-family: PingFang SC;
							font-style: normal;
							font-weight: bold;
							font-size: 26rpx;
							line-height: 36rpx;
							color: #999999;
						}
					}

					.right {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 26rpx;
						line-height: 58rpx;
						color: #999999;
						width: 140rpx;
						text-align: right;
					}
				}

				.note {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 58rpx;
					width: 470rpx;
					padding-right: 20rpx;

					.tag {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 20rpx;
						text-align: center;
						padding: 5rpx;
						height: 32rpx;
						align-self: center;
					}

					.left {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 26rpx;
						line-height: 58rpx;
						color: #999999;
						width: 200rpx;
					}

					.right {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 26rpx;
						line-height: 58rpx;
						color: #999999;
						width: 220rpx;
						text-align: right;
					}

					.colored-text {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 28rpx;
						line-height: 58rpx;
						color: $themeColor;
						margin-left: 12rpx;
					}
				}
			}
		}

		.footer {
			display: flex;
			justify-content: space-between;
			margin: 0rpx 40rpx;
			align-items: center;
			height: 108rpx;

			.left {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #999999;
			}

			.right {
				width: 126rpx;
			}
		}
	}
</style>
