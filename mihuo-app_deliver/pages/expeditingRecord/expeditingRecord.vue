<template>
	<view class="expediting-record">
		<view class="page-top"></view>
		<view class="rejection-record">
			<view class="list-rejection-contain">
				<view class="item-record-cotain" v-for="(item,index) in 2" :key="index">
					<view class="item-left">
						<view class="node">
						</view>
					</view>
					<view class="item-right">
						<view class="item-right-contain">
							<view class="item-top">
								<text class="refuse-title">第3次催办</text>
							</view>
							<view class="item-user_contian">
								<u-avatar size="32" src="" />
								<text class="item-text">付刚(项目管家)2022-10-31 15:32发起催办</text>
							</view>
							<view class="item-bottom">
								是大法师的萨达分
								sdfsdfsdfs
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <mh-empty v-else title="这里空荡荡哒～" /> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {}
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {

		}
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #fff;
	}
</style>


<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.expediting-record {
		.page-top {
			height: 10rpx;
			background-color: #f5f5f5;
		}

		.rejection-record {
			padding: 40rpx 48rpx;

			.mh-empty-page {
				/deep/ .u-empty {
					margin-top: 50rpx !important;
				}
			}

			.item-record-cotain {
				display: flex;

				&:last-child {
					.item-bottom {
						margin-bottom: 0rpx !important;
					}
				}

				.item-left {
					width: 40rpx;
					border-left: 2rpx dashed #C4C4C4;
					position: relative;

					.node {
						position: absolute;
						left: -14rpx;
						width: 26rpx;
						height: 26rpx;
						background-color: #fff;
						border-radius: 50%;
						border: 6rpx solid #D9D9D9;
					}
				}

				.item-right {
					display: flex;
					flex-direction: column;
					flex: 1;


					.item-top {
						display: flex;
						justify-content: space-between;
						margin-bottom: 20rpx;
						margin-left: -6rpx;
						margin-top: -6rpx;

						.refuse-title {
							font-size: 28rpx;
							color: #303133;

						}

						.refuse-time {
							font-size: 24rpx;
							color: #909199;
						}
					}

					.item-user_contian {
						margin-bottom: 28rpx;
						display: flex;
						align-items: center;

						.item-text {
							color: #909199;
							font-size: 26rpx;
							line-height: 38rpx;
						}
					}

					.item-name {
						line-height: 38rpx;
						margin-top: -6rpx;

						.left {
							color: #303133;
							font-size: 28rpx;
							margin-right: 14rpx;
						}

						.right {
							color: #FF5D35;
							font-size: 30rpx;
						}
					}

					.item-time {
						color: #909199;
						font-size: 26rpx;
						margin-bottom: 28rpx;
						line-height: 38rpx;
					}

					.item-bottom {
						padding: 26rpx;
						background: #F6F6F6;
						border-radius: 20rpx;
						font-size: 26rpx;
						color: #303133;
						margin-bottom: 40rpx;
					}
				}
			}
		}
	}
</style>
