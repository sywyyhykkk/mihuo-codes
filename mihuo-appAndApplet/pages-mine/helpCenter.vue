<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar-title" slot="default">帮助中心</view>
		</z-nav-bar>
		<view class="main-container">
			<view class="self_help">
				<view class="title" style="margin-left: 30rpx">问题分类</view>
				<view class="self_help_con">
					<view class="item" v-for="(item, index) in selfHelp" :key="index" @click="goToType(item)">
						<image class="icon" :src="iconList[index]" />
						<view class="label">{{ item.typeName }}</view>
					</view>
				</view>
			</view>
			<view class="search_view align-center">
				<view class="title">常见问题</view>
				<view class="right flex-center" @click="viewMore">
					查看更多
					<uni-icons type="right" size="12" color="#fc4429" class="icon-right"></uni-icons>
				</view>
			</view>
			<view class="help_center">
				<view class="list" v-for="(item, index) in itemList" :key="index" @click="open(index)">
					<view class="top_view">
						<view class="dot" />
						<view class="title">{{ item.title }}</view>
						<u-icon size="22" class="arrow" :name="item.open ?'arrow-down':'arrow-up'"></u-icon>
					</view>
					<view class="content-body" v-if="item.open && item.content">
						<view class="content" v-for="content, index in JSON.parse(item.content)" :key="index">
							{{ content.content }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="buttons align-center">
			<view class="left align-center" @click="buttonClicked(1)">
				<image src="https://www.51mihuo.com/static/images/mine/sb4.png" class="icon"></image>
				意见反馈
			</view>
			<view class="right align-center" @click="buttonClicked(2)">
				<uni-icons type="phone" color="#909199" style="margin-right: 8rpx"></uni-icons>
				联系客服
			</view>
		</view>
		<u-action-sheet :safe-area-inset-bottom="true" v-model="isShowSheet" :list="actionList" @click="confirmAction"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				actionList: [{
						text: '19988450915'
					},
					{
						text: '13880286443'
					}
				],
				isShowSheet: false,
				iconList: [
					'https://www.51mihuo.com/static/images/mine/order_related.png', // 订单相关
					'https://www.51mihuo.com/static/images/mine/issues.png', // 交易问题
					'https://www.51mihuo.com/static/images/mine/report.png', // 投诉举报
					'https://www.51mihuo.com/static/images/mine/capital.png', // 资金中心
					'https://www.51mihuo.com/static/images/mine/account.png', // 账户问题
					'https://www.51mihuo.com/static/images/mine/evaluate.png' // 评价相关
				],
				selfHelp: [], // 问题分类列表
				itemList: [],
				typeTreeCode: ''
			}
		},
		onLoad() {
			this.getCMSType()
		},
		methods: {
			// 获取CMS类型
			getCMSType() {
				this.$httpApi
					.getCmsContentType({
						typeName: '帮助中心-c端',
						typeTreeCodeExtra: 'SUB_ONLY',
						size: 99
					})
					.then((res) => {
						if (res && res.records.length !== 0) {
							this.typeTreeCode = res.records[0].typeTreeCode.substring(0, 4)
							this.getCMSData()
							res.records.forEach((item) => {
								this.selfHelp.push({
									...item
								})
							})
						}
					})
			},
			// 获取CMS内容
			// TODO cityOperatorId
			getCMSData() {
				this.$httpApi
					.getCMSContent({
						size: 4,
						cityOperatorId: -1,
						typeTreeCode: this.typeTreeCode
					})
					.then((res) => {
						if (res) {
							res.records.forEach((item) => {
								this.itemList.push({
									open: false,
									...item
								})
							})
						}
					})
			},
			goToType(item) {
				this.toPage(
					`/pages-user/setting/helpCenterMore?typeTreeCode=${item.typeTreeCode}&typeName=${item.typeName}`
				)
			},
			buttonClicked(type) {
				if (type === 1) {
					// 意见反馈
					uni.navigateTo({
						url: '/pages-mine/feedback'
					})
				} else {
					// 联系客服
					this.isShowSheet = true
				}
			},
			confirmAction(e){
				uni.makePhoneCall({
					phoneNumber: this.actionList[e].text
				})
			},
			viewMore() {
				uni.navigateTo({
					url: `/pages-user/setting/helpCenterMore?typeTreeCode=${this.typeTreeCode}`
				})
			},
			open(i) {
				this.itemList[i].open = !this.itemList[i].open
			}
		}
	}
</script>

<style lang="scss" scoped>

	.title {
		font-weight: 700;
		font-size: $middleAddFontSize;
		color: $seconFontColor;
	}

	.main-container {
		width: 100vw;
		height: calc(100vh - 172rpx - 144rpx);
		overflow-y: auto;
	}

	.self_help {
		margin-top: 2rpx;
		padding: 56rpx 0;
		background: #ffffff;
		border-radius: $miniBorderRadius;

		.self_help_con {
			display: flex;
			flex-wrap: wrap;

			.item {
				margin-top: 46rpx;
				width: 33.3%;
				text-align: center;

				.icon {
					display: inline-block;
					width: 48rpx;
					height: 48rpx;
				}

				.label {
					font-weight: 400;
					font-size: $middleFontSize;
					text-align: center;
					color: $mainFontColor;
				}
			}
		}
	}

	.search_view {
		height: max-content;
		margin-top: 10rpx;
		padding: 40rpx 30rpx 20rpx;
		background: #ffffff;
		justify-content: space-between;

		.right {
			width: 25%;
			height: 42rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 26rpx;
			line-height: 36rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			color: $themeColor;

			.icon-right {
				margin-left: 4rpx;
			}
		}
	}

	.help_center {
		height: max-content;
		background: #ffffff;
		padding: 0 64rpx 0;

		.list {
			padding: 40rpx 0;
			border-bottom: 1px dashed #e7e7e7;

			&:nth-last-child(1) {
				border-bottom: none;
			}

			.top_view {
				display: flex;
				align-items: center;

				.dot {
					width: 12rpx;
					height: 12rpx;
					margin-right: 12rpx;
					border-radius: 50%;
					background: $themeColor;
				}

				.title {
					width: calc(100% - 12rpx - 16rpx);
					font-weight: 400;
					font-size: $middleFontSize;
					color: $seconFontColor;
					@include toe();
				}

				.arrow {
					// width: 13rpx;
					// height: 24rpx;
					transition: all 0.2s;
				}
			}

			.content-body {
				margin: 26rpx 28rpx 0 12rpx;
				
				.content {
					font-size: $smiddleFontSize;
					line-height: 36rpx;
					color: $viceFontColor;
				}
			}
		}
	}

	.buttons {
		width: 100vw;
		height: 144rpx;
		background-color: #ffffff;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;

		.left,
		.right {
			width: 50%;
			height: 62rpx;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 62rpx;
			text-align: center;
			color: #606166;
			justify-content: center;
		}

		.icon {
			width: 30rpx;
			height: 30rpx;
			margin-right: 8rpx;
		}

		.left {
			border-right: 2rpx #eaeaea solid;
		}
	}

	.align-center {
		display: flex;
		align-items: center;
	}
</style>
