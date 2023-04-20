<template>
	<u-popup v-model="shows" mode="bottom" @close="closePopup" :safe-area-inset-bottom="true"
		:maskCustomStyle="{ opacity: 0 }" :height="popupHeight">
		<view class="info">
			<view class="info-close">
				<u-icon @click="closePopup" class="info-close_icon" name="close" size="24"></u-icon>
			</view>
			<view class="info-main">
				<findMaster-mh-mihuo-image class="image" v-if="data.img" :src="data.img" mode="scaleToFill" />
				<findMaster-mh-mihuo-image class="image" v-else src="https://www.51mihuo.com/static/icon/work_type/other.png" />
				<view class="info-main_content">
					<view class="info-main_content-title">
						<text>{{ data.skillName }}</text>
						<findMaster-mh-mihuo-image class="image" :src="'https://www.51mihuo.com/static/icon/major.png'" />
					</view>
					<view class="info-main_content-text">{{ data.label}}</view>
				</view>
			</view>
			<scroll-view class="worker-scroll-view" scroll-y>
				<findMaster-mh-edit-view v-if="data.description &&  JSON.parse(data.description).length" class="edit_view"
					v-model="data.description" />
				<findMaster-mh-empty v-else marginTop="0" size="200" style="padding-top: 100rpx" title="暂无师傅服务流程简介" />
			</scroll-view>
			<!-- 底部按钮 -->
			<view class="bottom">
				<view class="know" @click="closePopup">我知道了</view>
				<view class="cancel" v-if="data.isServe" @click="() => $emit('cancel', data.skillId)">取消呼叫</view>
				<view class="cancel" v-else @click="callMaster">呼叫师傅</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'masterWorkerDetail',
		props: {
			value: {
				type: Boolean,
				default: false
			},
			data: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				shows: false,
				popupHeight: '100%'
			}
		},
		mounted() {
			// #ifdef H5
			this.popupHeight = '70%'
			// #endif
		},
		watch: {
			value(val) {
				this.shows = val
			}
		},
		methods: {
			closePopup() {
				this.shows = false
				this.$emit('input', false)
			},
			// 呼叫师傅
			callMaster() {
				this.closePopup()
				this.$emit('findMaster')
			}
		}
	}
</script>

<style scoped lang="scss">
	.info {
		padding: 20rpx 0rpx;
		overflow: hidden;
		position: absolute;
		top: 30%;
		/* #ifdef H5 */
		top: 0;
		/* #endif */
		right: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		box-sizing: border-box;

		.info-close {
			display: flex;
			justify-content: flex-end;
			padding: 0 15rpx;
		}

		.worker-scroll-view {
			height: calc(100% - env(safe-area-inset-bottom) - 240rpx);

			.edit_view {
				padding: 10rpx 20rpx 0;
				height: 100%;
				width: 100%;
			}
		}

		.info-main {
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			border-bottom: 2rpx solid #F0F0F0;
			padding-bottom: 20rpx;

			.image {
				width: 140rpx;
				height: 120rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.info-main_content {
				.info-main_content-title {
					display: flex;

					text {
						color: #141414;
						font-weight: bold;
						font-size: $mainFontSize;
						padding-right: 20rpx;
					}

					.image {
						width: 48rpx;
						height: 26rpx;
						image-rendering: optimize-contrast;
						image-rendering: -webkit-optimize-contrast;
					}
				}

				.info-main_content-text {
					font-size: 26rpx;
				}
			}
		}

		.info-introduce {
			margin-top: 40rpx;

			&>view {
				font-size: $middleFontSize;
				font-weight: bold;
			}
		}

		.title {
			view {
				font-size: $smallFontSize;
				margin: 10rpx 0;
			}

			.title-mian {
				margin: 40rpx 0 20rpx;
				font-size: $smallFontSize;
				font-weight: bold;
				font-family: PingFang-SC-Bold;
			}
		}

		.bottom {
			display: flex;
			align-items: center;
			position: fixed;
			right: 0;
			left: 0;
			bottom: env(safe-area-inset-bottom);
			height: max-content;
			line-height: 80rpx;
			z-index: 999;
			padding: 10rpx 20rpx;
			background: #FFFFFF;

			view {
				flex: 1;
				text-align: center;
				font-size: 26rpx;
				font-weight: bold;
				border-radius: 12rpx;

				&.know {
					border: 1.5rpx solid #141414;
					margin-right: 10rpx;
				}

				&.cancel {
					background: #424242;
					color: #FFFFFF;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
