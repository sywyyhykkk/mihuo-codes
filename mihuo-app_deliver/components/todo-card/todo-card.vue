<template>
	<view class="card">
		<view class="top-container">
			<view class="id">
				编号
				<text class="number" @longtap="longtap">
					{{work.orderCode || 0}}
				</text>
			</view>
			<view class="status">
				{{getStatus}}
			</view>
		</view>
		<u-divider :use-slot="false" half-width="45%"></u-divider>
		<view class="main-container">
			<view @tap.stop>
				<view class="image-content" @click="imagePreview"
					:style="{backgroundImage:`url(${getBackgroundImage})`}">
					<view class="tag">
						{{getRequirementType}}
					</view>
				</view>
			</view>

			<view class="info">
				<view class="header">
					<view class="left">
						<skill-type-tag :title="getSkillType" class="tag"></skill-type-tag>
						<view class="requirement-title">
							{{work.requirementTypeName || '无'}}
						</view>
					</view>
					<view class="right">
						{{work.price || 0}}元
					</view>
				</view>
				<view class="location">
					<view class="left">
						<u-icon name="map" color="#C2C2C2"></u-icon>
						<view class="address">
							{{work.address || ''}}
						</view>
					</view>
					<view class="right">{{getDistance}}</view>
				</view>
				<view class="note">
					<view class="viewer">
						<view class="left">
							预期工期: {{work.expectDuration || 0}}天
						</view>
						<view class="right">
							所需工种: {{getSkillType}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-divider :use-slot="false" half-width="45%"></u-divider>
		<view class="footer">
			<view class="left"></view>
			<view class="center" @click="clicked">
				查看详情
			</view>
			<view class="right" @click="rightButtonClicked">
				{{getButtonStr}}
			</view>

		</view>
	</view>
</template>

<script>
	import {
		copy,
		getStatus,
		getSkillType,
		getRequirementType,
		getDistance
	} from "@/plugins/utils.js";

	export default {
		name: "todo-card",
		props: {
			id: {
				type: String,
				default: 0
			}
		},
		data() {
			return {
				attachment: {},
				work: {},
				imgUrl: '',
				imgFileList: [],
				defaultBackgroundImage: 'https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/575612f7078749f98df94508a4e5cb6c.jpeg', //默认图片路径
			};
		},
		mounted() {
			this.$http.request({
				url: `order/biz_order/${this.id}`,
				method: 'GET',
				data: {
					latitude: 24.8801,
					longitude: 102.8329,
				}
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
			});
		},
		computed: {
			getStatus() {
				return getStatus(this.work.orderStatus);
			},
			getSkillType() {
				return getSkillType(this.work.skillType);
			},
			getButtonStr() {
				switch (this.work.orderStatus) {
					case 0:
						return '发布订单';
					case 5:
						return '等待报价';
					case 10:
						return '待确认';
					case 15:
						return '待付款';
					case 25:
						return '待开工*';
					case 30:
						return '开工中*';
					case 35:
						return '去验收';
					case 40:
						return '去结算';
					case 45:
						return '去评价';
					case 50:
						return '已完成*';
					case 55:
						return '去售后';
					case 60:
						return '售后中';
					default:
						return '';
				}
			},
			getRequirementType() {
				return getRequirementType(this.work.requirementType)
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
				this.$emit('click');
			},
			rightButtonClicked(){

			},
			longtap() {
				copy(this.work.orderCode);
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
		flex-direction: column;
		height: 444rpx;
		width: 710rpx;

		.top-container {
			height: 111rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.id {
				margin-left: 40rpx;
				display: flex;
				align-items: center;
				width: 300rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #999999;

				.number {
					width: 200rpx;
					margin-left: 20rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333333;
				}
			}

			.status {
				text-align: right;
				margin-right: 40rpx;
				width: 50%;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 44rpx;
				color: $themeColor;
			}
		}

		.main-container {
			width: 100%;
			height: 222rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;

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
			}

			.info {
				width: 488rpx;
				height: 176rpx;
				border-radius: 10rpx;
				margin-left: 24rpx;

				.header {
					height: 58rpx;
					width: 480rpx;
					display: flex;
					align-items: center;

					.left {
						display: flex;
						width: 400rpx;
						margin-left: -30rpx;

						.tag {
							width: 70rpx;
						}

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
							width: 260rpx;
						}
					}

					.right {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 900;
						font-size: 32rpx;
						line-height: 44rpx;
						text-align: right;
						color: $themeColor;
						width: 200rpx;
					}
				}

				.location {
					display: flex;
					justify-content: space-between;
					margin-left: -5rpx;
					height: 58rpx;
					width: 490rpx;

					.left {
						display: flex;
						align-items: center;

						.address {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							width: 300rpx;
							font-family: PingFang SC;
							font-style: normal;
							font-weight: bold;
							font-size: 26rpx;
							line-height: 36rpx;
							color: #999999;
						}
					}

					.right {
						margin-left: 20rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 26rpx;
						line-height: 58rpx;
						color: #999999;
						width: 200rpx;
						text-align: center;
					}
				}

				.note {
					display: flex;
					align-items: center;
					height: 58rpx;
					width: 490rpx;

					.viewer {
						display: flex;
						height: 40rpx;
						justify-content: space-between;
						align-items: center;
						width: 100%;

						.left {
							font-family: PingFang SC;
							font-style: normal;
							font-weight: bold;
							font-size: 26rpx;
							line-height: 58rpx;
							color: #999999;
							width: 210rpx;
							text-align: center;
							margin-left: -10rpx;
						}

						.right {
							font-family: PingFang SC;
							font-style: normal;
							font-weight: bold;
							font-size: 26rpx;
							line-height: 58rpx;
							color: #999999;
							width: 230rpx;
							text-align: center;
						}

						.colored-text {
							font-family: PingFang SC;
							font-style: normal;
							font-weight: bold;
							font-size: 28rpx;
							line-height: 58rpx;
							color: $themeColor;
							margin-left: 10rpx;

						}
					}
				}
			}
		}

		.footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 111rpx;

			.left {
				width: 176rpx;
				height: 64rpx;
			}

			.center {
				width: 176rpx;
				height: 64rpx;
				border: 2rpx solid #EEEEEE;
				box-sizing: border-box;
				border-radius: 10rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 26rpx;
				line-height: 36rpx;
				text-align: center;
				color: #909199;
				display: flex;
				align-items: center;
				text-align: center;
				justify-content: center;
			}

			.right {
				width: 176rpx;
				height: 64rpx;
				background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
				border-radius: 10rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				text-align: center;
				justify-content: center;
				margin-right: 40rpx;
			}
		}
	}
</style>
