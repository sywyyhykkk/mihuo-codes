<template>
	<view>
		<u-popup v-model="isShowPopup" mode="bottom" :safe-area-inset-bottom="true" border-radius="30"
			:mask-close-able="maskCloseAble">
			<view class="header-container flex-center">
				<view class="title">
					{{ title }}
				</view>
				<view class="icon" @click="close">
					<uni-icons type="closeempty" color="#000000"></uni-icons>
				</view>
			</view>
			<scroll-view class="content-container" scroll-y :style="{ height: (isShowButton ? containerHeigt : containerHeigt + 127) + 'rpx' }">
				<slot></slot>
			</scroll-view>
			<view v-if="isShowButton" class="button-container flex-center">
				<view class="button-item cancel" @click="cancel">
					{{ buttonsText[0] }}
				</view>
				<view class="button-item confirm" @click="confirm">
					{{ buttonsText[1] }}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "mihuo-popup",
		props: {
			title: {
				type: String,
				default: '一个弹窗'
			},
			isShowButton: {
				type: Boolean,
				default: false
			},
			buttonsText: {
				type: Array,
				default: () => {
					return ['取消', '确定']
				}
			},
			maskCloseAble: {
				type: Boolean,
				default: true
			}
		},
		data() {
			let containerHeigt = 962 - 118 - 127
			let itemHeight = 962 - 118 - 127 - 20
			// #ifdef MP-WEIXIN
			containerHeigt += 40
			itemHeight += 40
			// #endif
			return {
				containerHeigt,
				itemHeight,
				isShowPopup: false,
			}
		},
		mounted() {},
		methods: {
			open() {
				this.isShowPopup = true
			},
			close() {
				this.isShowPopup = false
			},
			cancel() {
				this.$emit('cancel')
			},
			confirm() {
				this.$emit('confirm')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.header-container {
		width: 100vw;
		height: 118rpx;
		justify-content: space-between;
		padding: 0 30rpx;

		.title {
			height: 118rpx;
			line-height: 118rpx;
			font-size: 30rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
		}
	}

	.content-container {
		width: 100vw;
		border-top: #F7F7F7 20rpx solid;
	}

	.button-container {
		width: 100vw;
		height: 127rpx;
		justify-content: space-around;

		.button-item {
			width: 335rpx;
			height: 88rpx;
			background: #F0F0F0;
			border-radius: 44rpx;
			text-align: center;
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			line-height: 88rpx;
		}

		.cancel {
			background: #F0F0F0;
			color: #666666;
		}

		.confirm {
			background: #FE6E32;
			color: #FFFFFF;
		}
	}
	
	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
