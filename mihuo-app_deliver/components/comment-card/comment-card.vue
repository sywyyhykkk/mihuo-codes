<template>
	<view class="card">
		<view class="header-container align-center">
			<view class="left align-center">
				<view class="avatar align-center">
					<u-avatar src="../../static/demo/1.jpg" size="90"></u-avatar>
				</view>
				<view class="content align-center">
					<view class="name">
						腹黑的马里奥
					</view>
					<view class="time">
						2021.07.21 15:30
					</view>
				</view>
			</view>
			<view class="right align-center">
				<view class="star align-center">
					<view v-for="index in 5" :key="index">
						<image src="../../static/icon/star2.png" style="width: 28rpx; height: 28rpx;" />
					</view>
				</view>
				<view class="text">
					5.0分
				</view>
			</view>
		</view>
		<view class="content-container">
			<view class="text">
				房子硬装基本结束了，我的软装也在陆续购买上场了，我也可以好好谈一谈的感受了，四个字总结吧，满意，值得。
			</view>
		</view>
		<view class="image-container align-center">
		<!-- 	<image class="img" src="../../static/images/home_work_bg.jpeg"></image>
			<image class="img" src="../../static/images/home_work_bg.jpeg"></image>
			<image class="img" src="../../static/images/home_work_bg.jpeg"></image> -->
		</view>
	</view>
</template>

<script>
	export default {
		name: "comment-card",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		width: 710rpx;
		height: 560rpx;
		background-color: #fff;
		border-radius: 0rpx 0rpx 10rpx 10rpx;
		margin-bottom: 4rpx;

		.header-container {
			height: 140rpx;
			justify-content: space-between;

			.left {
				width: 500rpx;
				height: 140rpx;

				.avatar {
					margin-left: 20rpx;
					justify-content: center;
					padding: 10rpx;
				}

				.content {
					margin-left: 20rpx;
					flex-direction: column;
					justify-content: space-around;

					.name {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 900;
						font-size: 30rpx;
						line-height: 44rpx;
						color: $fontColor33;
						width: 300rpx;
						text-align: left;
					}

					.time {
						font-family: PingFang SC;
						font-style: normal;
						font-size: $smallFontSize;
						line-height: 34rpx;
						color: $fontColor99;
						width: 300rpx;
						text-align: left;
					}
				}
			}

			.right {
				width: 300rpx;
				align-self: center;
				height: 40rpx;
				margin-top: 10rpx;

				.star {
					margin-right: 10rpx;
				}

				.text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 900;
					font-size: $middleFontSize;
					line-height: 40rpx;
					color: $errorFontColor;
				}
			}
		}

		.content-container {
			height: 150rpx;
			width: 710rpx;
			overflow: scroll;
			text-overflow: ellipsis;

			.text {
				margin: 0rpx 30rpx;
				width: 652rpx;
				height: 144rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-size: $middleFontSize;
				line-height: 48rpx;
				color: $mainFontColor;
			}
		}

		.image-container {
			width: 710rpx;
			height: 240rpx;
			justify-content: space-around;
			padding: 0rpx 20rpx;
			margin: auto;

			.img {
				margin: 10rpx;
				width: 204rpx;
				height: 204rpx;
				border-radius: 10rpx;
			}
		}

		.align-center {
			display: flex;
			align-items: center;
		}
	}
</style>
