<script>
	export default {
		data() {
			return {
				topic: null,
				currentValue: {},
				options: {},
				survey: {}
			}
		},
		onLoad(options) {
			this.options = options;
			if (options.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('装修报价', url, this.options.userId)
			}
		},
		onShow() {
			this.loadData()
		},
		onShareAppMessage(res) {
			const coverImg = 'https://www.51mihuo.com/static/images/ai_share.jpg'
			const path = `pages-valuation/valuation?id=${this.options.id}`
			const result = this.$util.shareToWechat('装修花费，智能估价', coverImg, path, '装修报价', true, 1)
			return result
		},
		methods: {
			loadData() {
				uni.showLoading({
					mask: true
				})
				let url = ''
				if (this.options && this.options.id) {
					url = `basic/standard/survey/public/loadProject?projectId=${this.options.id || ''}`
				} else {
					url = 'basic/standard/survey/public/loadProject'
				}
				this.$http.get(url)
					.then(data => {
						this.survey = data;
						if (data.survey) {
							this.topic = data.survey?.children[0]
						} else {
							this.topic = null
						}
					})
					.catch(e => {
						console.error(e.message)
					})
					.finally(() => {
						uni.hideLoading()
					})
			},

			onBackPage() {
				uni.navigateBack()
			},

			radioGroupChange(evt) {
				this.currentValue = evt.detail
			},

			handleClickRadio(item) {
				this.currentValue = item
			},

			toValuationHistory() {
				uni.navigateTo({
					url: '/pages-valuation/valuation-history'
				})
			},

			toValuationTopics() {
				uni.navigateTo({
					url: `/pages-valuation/valuation-topics?id=${this.currentValue.id}&suryId=${this.survey.id}`
				})
			}
		}
	}
</script>

<template>
	<view class="valuation">
		<image class="bg-image" mode="aspectFill" src="./static/valuation_bg.png" />
		<view class="wrapper">
			<z-nav-bar fontColor="#fff" bgColor="rgba(0,0,0,0)">
				<view class="right-btn" slot="right" @click="toValuationHistory">
					估价历史
				</view>
			</z-nav-bar>
			<view class="content-title">
				<view class="large-text">快速估价</view>
				<view class="medium-text">我家装修要花多少钱</view>
				<view class="mini-text">
					<u-icon name="integral" color="#fff" size="20"></u-icon>
					<text>觅活官方估价</text>
				</view>
			</view>
			<view v-if="!topic" key="topic-status" class="content-box">
				<mh-empty></mh-empty>
			</view>
			<view v-else key="topic-results" class="content-box">
				<image src="./static/mine_bg.png" mode="heightFix" class="content-bg-image"></image>
				<view class="topic-title">{{ topic.title }}</view>
				<view class="topic-options">
					<radio-group v-model="currentValue.title" @change="radioGroupChange">
						<view v-for="item of topic.children" :key="item.id" class="radio-box">
							<radio shape="circle" :value="item.title" class="custom-radio"
								@click="handleClickRadio(item)">
								<text :style="{ color: currentValue.title === item.title ? '#FE6E32' : '#000'}">
									{{ item.title }}
								</text>
							</radio>
						</view>
					</radio-group>
				</view>
				<button :disabled="!currentValue.title" :style="{
            'background-color': currentValue.title ? '#fe6e32' : '#bfbebd'
          }" class="custom-button" @click="toValuationTopics">
					<text class="button-text">获取方案</text>
				</button>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
	.valuation {
		/deep/ .header_fixed {
			background: transparent !important;

			.arrow-leftward {
				width: 38rpx;
				height: 38rpx;
				margin-left: 30rpx;
			}

			.right-btn {
				margin-right: 30rpx;
				color: #fff;
				font-size: 28rpx;
				font-weight: 500;
			}
		}

		.bg-image {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}

		.wrapper {
			position: fixed;
			width: 100%;
			height: 100%;
			padding-bottom: 100rpx;
			overflow-y: scroll;

			.content-title {
				margin: 92rpx 0 0 60rpx;

				.large-text {
					color: #fe6e32;
					font-size: 60.27rpx;
					font-weight: 500;
				}

				.medium-text {
					color: #fe6e32;
					font-size: 28.13rpx;
					margin-top: 29rpx;
				}

				.mini-text {
					margin-top: 41rpx;

					text {
						color: #fff;
						font-size: 20rpx;
						margin-left: 11rpx;
					}
				}
			}

			.content-box {
				position: relative;

				min-height: 580rpx;
				margin: 60rpx 30rpx 0;
				padding: 34rpx 30rpx 30rpx;
				border-radius: 20rpx;

				background: #fff;

				display: flex;
				flex-flow: column nowrap;
				justify-content: space-between;

				box-shadow: 0 30rpx 30rpx 0 rgba(0, 0, 0, 0.5);

				/deep/ .empty {
					margin-top: 80rpx !important;
				}

				/* #ifdef MP-WEIXIN */
				/deep/ .u-empty {
					margin: 0 !important;
				}

				/* #endif */

				.content-bg-image {
					height: 180rpx;

					position: absolute;
					top: -180rpx;
					right: 43rpx;

					/deep/ img {
						opacity: 1;
					}
				}

				.topic-title {
					color: #000;

					font-size: 32rpx;
					font-weight: 400;
					line-height: 34rpx;
				}

				.topic-options {
					min-height: 280rpx;

					.radio-box {
						margin-top: 40rpx;

						/deep/ .custom-radio {
							min-width: 150rpx;

							&::before {
								display: none;
							}

							.uni-radio-wrapper,
							.wx-radio-wrapper {
								text {
									color: #000;
									font-size: 28rpx;
									font-weight: 500;
								}
							}

							.uni-radio-input,
							.wx-radio-input {
								width: 30rpx;
								height: 30rpx;
								margin-right: 23rpx;
								border: 1px solid #e6e6e6;
							}

							.uni-radio-input-checked,
							.wx-radio-input-checked {
								position: relative;
								border-color: #fe6e32 !important;
								background-color: #fff !important;

								&::after {
									content: '';
									position: absolute;
									top: 0;
									left: 0;
									right: 0;
									bottom: 0;
									margin: auto;

									width: 14rpx;
									height: 14rpx;
									border-radius: 50%;

									background-color: #fe6e32;
								}
							}
						}
					}
				}

				.custom-button {
					width: 630rpx;
					height: 84rpx;
					border-radius: 20rpx;
					margin-top: 40rpx;

					display: flex;
					justify-content: center;
					align-items: center;

					.button-text {
						color: #fff;
						font-size: 28rpx;
						font-weight: 500;
					}
				}
			}
		}
	}
</style>
