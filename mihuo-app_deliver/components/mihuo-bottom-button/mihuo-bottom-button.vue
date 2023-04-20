<template>
	<view class="button-content" style="height: 190rpx;">
		<view class="bottom-button">
			<view class="item-button"
				:class="[item.status ? 'item-button-active':'',item.display ? 'item-button-display':'']"
				v-for="(item,index) in bottomList" :key="index" @click="getButton(item)">
				{{item.name}}
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
			buttonList: {
				type: Array,
				default: function() {
					return []
				}
			},
		},
		computed: {
			...mapState(['netStatus']),
			bottomList() {
				let isShow = this.$permissionRouting.getInstance().isShow()
				if(isShow){
					return this.buttonList
				}
				return []
			}
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
			getButton(item) {
				this.debounce(() => {
					if (this.netStatus) {
						this.$emit('click', item)
					} else {
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
			weakNetwork() {
				uni.onNetworkStatusChange(function(res) {
					if (!res.isConnected) {

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
		width: 100vw;
		background: #FFFFFF;
		position: fixed;
		left: 0;
		right: 0;
		@include buttonsafearea();
		z-index: 999;
		display: flex;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.item-button {
		display: flex;
		flex: 1;
		justify-content: center;
		height: 88rpx;
		text-align: center;
		line-height: 88rpx;
		color: #002FA5;
		background-color: #fff;
		font-size: 24rpx;
		border-radius: 10rpx;
		border: 2rpx solid #002FA5;
		font-weight: bold;
		margin-top: 10rpx;
		margin-right: 20rpx;
		margin-bottom: 6rpx;

		&:last-child {
			margin-right: 0rpx;
		}
	}

	.item-button-active {
		background-color: #002FA5;
		color: #fff;
		// margin-left: 8rpx;
		font-weight: bold;
	}

	.item-button-display {
		background-color: #dedfe1;
		border-color: #dedfe1;
		color: #999999;
	}
</style>
