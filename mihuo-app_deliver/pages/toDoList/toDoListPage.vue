<template>
	<view class="to-do-list-page">
		<view class="tab-contain">
			<u-tabs class="u-tabs-contain" :is-scroll="false" :list="tabList" font-size="26" active-color="#002FA5"
				inactive-color="#606166" bar-height="4" :current="current" @change="change"></u-tabs>
		</view>
		<view class="list-contain">
			<view class="item-list" v-for="(item,index) in  3">
				<view class="item-top-contain">
					<text class="item-left">云纺国际商厦A座1501</text>
					<view class="item-right">
						<view class="item-text">收起</view>
						<image :class="[openShow ? 'public-block' : 'public-none']" src="/static/images/bottom-icon.png"
							class="icon-jian"></image>
					</view>
				</view>

				<view class="subset-contain">
					<view class="subset-list" v-for="(ev,num) in 3" @click="getDetails()">
						<view class="item-left">
							<view class="item-top">
								<view class="text-top">水电工(王一凡)向您发起了申述</view> <text class="item-spot"></text>
							</view>
							<view class="item-bottom">
								2022-07-21 10:10 10分钟前
							</view>
						</view>
						<view class="item-right">
							<image src="@/static/icon/arrow.png" class="right-icon">
							</image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				current: 0,
				openShow: false,
				tabList: [{
					name: '申述',
					value: ''
				}, {
					name: '申请',
					value: ''
				}, {
					name: '整改',
					value: ''
				}, {
					name: '验收',
					value: ''
				}]
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
			change(index) {
				this.current = index
			},
			getDetails(){
				
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.icon-jian {
		width: 16rpx;
		height: 14rpx;
	}

	.public-none {
		transition: all 0.2s;
		transform: rotate(90deg);
	}

	.public-block {
		transition: all 0.2s;
		transform: rotate(-90deg);
	}

	.right-icon {
		width: 48rpx;
		height: 48rpx;
	}


	.to-do-list-page {
		padding-bottom: 40rpx;

		.tab-contain {
			width: 100%;

			position: -webkit-sticky;
			position: sticky;
			width: 100%;
			top: 0rpx;
			top: calc(88rpx + var(--status-bar-height));
			z-index: 99;
		}

		.u-tabs-contain {
			box-shadow: 0rpx 6rpx 8rpx 0px rgba(183, 183, 183, 0.25);
		}

		.list-contain {
			margin-top: 22rpx;

			.item-list {
				background-color: #fff;
				border-radius: 20rpx;
				padding: 40rpx 32rpx 20rpx 20rpx;
				margin-bottom: 14rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.item-top-contain {
					display: flex;
					justify-content: space-between;

					.item-left {
						font-size: 32rpx;
						color: #303133;
					}

					.item-right {
						display: flex;
						align-items: center;

						.item-text {
							color: #002FA5;
							font-size: 24rpx;
							margin-right: 24rpx;
						}
					}
				}

				.subset-contain {
					margin-top: 20rpx;

					.subset-list {
						display: flex;
						justify-content: space-between;
						margin-bottom: 20rpx;

						&:last-child {
							margin-bottom: 0rpx;
							
							.item-left{
								border-bottom: 0rpx solid #F9F9F9;
							}
							
						}

						.item-left {
							padding-bottom: 20rpx;
							border-bottom: 2rpx solid #F9F9F9;
						
							.item-top {
								display: flex;
								align-items: center;

								.text-top {
									font-size: 28rpx;
									color: #303133;
									margin-right: 8rpx;
									line-height: 40rpx;
								}

								.item-spot {
									display: inline-block;
									width: 12rpx;
									height: 12rpx;
									border-radius: 50%;
									background-color: #FF5D35;
									font-size: 28rpx;
									color: #303133;
								}
							}

							.item-bottom {
								color: #909199;
								font-size: 28rpx;
								line-height: 40rpx;
							}
						}

						.item-right {}

					}
				}


			}
		}

	}
</style>
