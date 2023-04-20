<template>
	<view class="button-content" style="height: 190rpx;">
		<view class="bottom-button" :class="disable ? 'bottom-button-disable':''">
			<view :class="buttonType==1?'add-text':'add-text2'" @click="goSendOrder">
				{{title}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	export default {
		props: {
			title: {
				type: String || Number,
				default: ''
			},
			buttonType: {
				type: Number,
				default: 1
			},
			disable: {
				type: Boolean,
				default: false
			}

		},
		computed: {
		   ...mapState(['netStatus'])
		  },
		data() {
			return {
				saveLoading: false,
				timer: null
			}
		},
		methods: {
			/**
			 * @description 点击的时候开启定时器 监听是否发起了接口请求，是添加Loading
			 * */
			goSendOrder() {
				// this.saveLoading = true
				// this.saveTiming()
				// 1.限制连续多次点击 2.判断网络情况
				this.debounce(() => {
					if(this.netStatus){
						this.$emit('click')
					}else{
						uni.showToast({
							title: '网络不给力，请检查网络',
							icon: "none"
						})
					}
				}, 200)
			},
			saveTiming() {
				this.timer = setInterval(() => {

					// uni.$emit('saveTiming')

					uni.$once('saveLoading', () => {
						this.eliminateTiming()
					})
				}, 500)
				uni.setStorageSync('eliminateTiming', this.timer)
			},
			eliminateTiming() {
				clearInterval(this.timer);
				this.timer = null
			},
			/**
			 * @description 监听网络状态变化
			 * */
			weakNetwork(){
				uni.onNetworkStatusChange(function (res) {
					if(!res.isConnected){
						
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.button-content {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.bottom-button {
		// width: 100vw;
		background: #FFFFFF;
		position: fixed;
		left: 0;
		right: 0;
		@include buttonsafearea();
		z-index: 900;
	}


	.add-text2 {
		border-radius: 10rpx;
		margin: 10rpx 60rpx 0rpx 60rpx;
		font-size: 28rpx;
		text-align: center;
		border: 2rpx solid #013E75;
		color: #013E75;
		line-height: 90rpx;
	}

	.add-text {
		font-weight: bold;
		font-size: 28rpx;
		line-height: 90rpx;
		text-align: center;
		background: #002FA5;
		border-radius: 10rpx;
		color: #FFFFFF;
		margin: 10rpx 60rpx 0rpx 60rpx;
	}

	.bottom-button-disable {
		.add-text {
			// background-color: #f5f5f5;
			opacity: 0.5;
		}
	}
</style>
