<template>
	<u-popup v-model="shows" mode="bottom" :mask-close-able="false" :safe-area-inset-bottom="true" height="80%" border-radius="20">
		<view class="popup">
			<view class="info-close">
				<u-icon @click="closePopup" class="info-close_icon" size="35" name="close"></u-icon>
			</view>
			<view class="info-main">
				<mihuo-image class="image" v-if="curMaster.img" :src="curMaster.img" mode="scaleToFill" />
				<mihuo-image class="image" v-else src="https://www.51mihuo.com/static/icon/work_type/cchu.png" />
				<view class="info-main_content">
					<view class="info-main_content-title">
						<text>{{ curMaster.skillName }}</text>
						<mihuo-image class="image" :src="'https://www.51mihuo.com/static/icon/major.png'" />
					</view>
					<view class="info-main_content-text">{{ curMaster.label}}</view>
				</view>
			</view>
			<scroll-view class="worker-scroll-view" scroll-y>
				<edit-view class="edit_view" v-if="curMaster.description &&  JSON.parse(curMaster.description).length" v-model="curMaster.description" />
				<mh-empty v-else marginTop="0" size="200" style="padding-top:150rpx" title="暂无师傅服务流程简介" />
			</scroll-view>
			<!-- 底部按钮 -->
			<view>
				<view style="height:100rpx;"></view>
				<view class="bottom">
					<view class="know" @click="closePopup">我知道了</view>
					<view class="cancel" v-if="curMaster.isServe" @click="() => $emit('cancel', curMaster.skillId)">取消呼叫</view>
					<view class="cancel" v-else @click="callMaster">呼叫师傅</view>
				</view>
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
				popupHeight: '100%',
				isCall:false,
				curMaster:{}
			}
		},
		mounted() {
			// #ifdef H5
			this.popupHeight = '70%'
			// #endif
		},
		watch: {
			value(val) {
				this.shows = val;
				if(val){
					this.curMaster = this.data;
				}
			}
		},
		methods: {
			closePopup() {
				this.$emit('input', false);
				this.shows = false;
				uni.showTabBar({
					animation: true
				})
				uni.removeStorageSync('hideTabbar')
			},
			// 呼叫师傅
			callMaster() {
				this.$emit('input', false);
				this.shows = false;
				this.$emit('findMasterNow');
			}
		}
	}
</script>

<style scoped lang="scss">
.popup{
	height: 100%;
}
		.info-close {
			display: flex;
			justify-content: flex-end;
			padding: 20rpx 30rpx;
		}

		.worker-scroll-view {
			height: calc(100% - env(safe-area-inset-bottom) - 320rpx);
			overflow: scroll;
			padding: 10rpx 20rpx;
			.edit_view {
				height: 100%;
				width: 100%;
				box-sizing: border-box;
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
		left: 0;
		right: 0;
		bottom: 0;
		height: 120rpx;
		@include safearea();
		z-index: 999;
		padding: 10rpx 20rpx;
		background: #FFFFFF;
		view {
			flex: 1;
			text-align: center;
			font-size: 26rpx;
			font-weight: bold;
			border-radius: 12rpx;
			padding: 30rpx 0;
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
</style>
