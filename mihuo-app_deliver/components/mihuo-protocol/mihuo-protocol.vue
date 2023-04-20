<template>
	<view>
		<u-mask :show="isShow" :duration="0" :zoom="false">
			<view class="warp">
				<view class="main-container">
					<view class="title-container">
						<view class="left">
						</view>
						<view class="center">
							{{ data.remarks || '协议' }}
						</view>
						<view class="right">
							<u-icon @click="hideModal" size="40" name="close-circle" color="#C4C4C4">
							</u-icon>
						</view>
					</view>
					<scroll-view class="content-container" scroll-y="true">
						<view class="conten-text" v-if="data">
							{{ data.protocolContent }}
						</view>
						<view class="content-text" v-else>
							加载中...
						</view>
					</scroll-view>
					<view class="button-container" v-if="isShowButton">
						<view class="button-style">
							<view class="cancel-style button-sizing" @click="hideModal">拒绝</view>
						</view>
						<view class="button-style">
							<view class="confirm-style button-sizing" @click="confirm">同意</view>
						</view>
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	export default {
		name: "mihuo-protocol",
		props: {
			protocolType: {
				type: String,
				default: "",
			},
			isShowButton: {
				type: Boolean,
				default: true
			}
		},
		mounted() {
			this.$httpApi.getProtocol(this.protocolType).then(res => {
				if(res){
					this.data = res
				}
			}).catch(e => {
				console.log(e)
			});
		},
		data() {
			return {
				data: {},
				isShow: true,
			};
		},
		methods: {
			confirm() {
				this.isShow = false;
				// 用户同意了协议
				this.$emit('hide-modal', true);
			},
			hideModal() {
				this.isShow = false;
				// 用户拒绝了协议
				this.$emit('hide-modal', false);
			}
		},
		computed: {
			getProtocolType() {
				switch (this.protocolType) {
					case "IM":
						return "沟通协议";
					case "JD":
						return "接单协议";
					case "FD":
						return "发单协议";
					case "BD":
						return "榜单规则";
					case "ZX":
						return "账户注销协议";
					default:
						return "其他协议";
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		.main-container {
			width: 80vw;
			max-height: 830rpx;
			height: max-content;
			background: #FFFFFF;
			border-radius: 30rpx;

			.title-container {
				height: 100rpx;
				border-bottom: 2rpx solid #EAEAEA;
				display: flex;
				justify-content: space-between;

				.left {
					width: 25%;
				}

				.right {
					width: 25%;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.center {
					width: 50%;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 36rpx;
					line-height: 100rpx;
					text-align: center;
					color: #303133;
				}
			}

			.content-container {
				padding: 10rpx;
				height: 600rpx;

				.conten-text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #909299;
					word-break: break-all;
				}
			}

			.button-container {
				display: flex;
				border-top: 1px solid #EAEAEA;
				height: 130rpx;

				.button-style {
					display: flex;
					align-items: center;
					width: 50%;

					&:nth-of-type(2) {
						border-left: 1px solid #EAEAEA;
					}
				}

				.confirm-style {
					background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
					color: #FFFFFF;
				}

				.cancel-style {
					color: #909199;
					background: #FFFFFF;
					border: 1px solid #EAEAEA;
				}

				.button-sizing {
					text-align: center;
					margin: auto;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					width: 240rpx;
					height: 88rpx;
					border-radius: 5px;
					line-height: 88rpx;
				}
			}
		}
	}
</style>
