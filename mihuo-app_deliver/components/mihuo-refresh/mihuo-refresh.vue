<template>
	<!-- v-if="viewShow" -->
	<!-- :class="[isRoll ? 'mihuo_refresh_page_roll':'', viewShow ? 'fade_in':'fade_out',refreshHidden?'refresh_hidden_block':'refresh_hidden_none']" -->
	<view class="mihuo_refresh_page" :class="[refreshHidden?'refresh_hidden_block':'refresh_hidden_none']"
		@click="getRefresh()">
		<image class="icon_refresh" :class="[refreshStatus ? 'icon_refresh_active':'']"
			src="/static/images/icon_refresh/mihuo_refresh_1.png" mode=""></image>
		<!-- <text class="icon_text">刷新</text> -->
	</view>
</template>

<script>
	export default {
		props: {
			top: {
				type: [String, Number],
				default: ''
			}
		},
		data() {
			return {
				refreshStatus: false,
				isRoll: false,
				flagIndex: 0,
				viewShow: false,
				refreshHidden: true,
				coordinates: '',
				option: {

				}
			}
		},
		watch: {
			top(val, oldVal) {
				// console.log("top",top);
			},
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
			getShow(item) {
				return
				// this.coordinates = Math.abs(item)
				if (item > -70) {
					this.viewShow = false
					this.refreshHidden = false
				} else {
					this.refreshHidden = true
					this.viewShow = true
				}
			},
			getRoll() {
				this.isRoll = true
				if (!this.flagIndex) {
					let timer = setTimeout(() => {
						// if (this.coordinates > 248) {
						// 	this.isRoll = false
						// }
						this.isRoll = false
						this.flagIndex = 0
						clearTimeout(timer);
					}, 2000)
				}
				this.flagIndex = 1
			},
			getRefresh() {
				this.debounce(() => {
					this.refreshStatus = true
					setTimeout(() => {
						this.refreshStatus = false
					}, 2000)
					this.$emit('refresh')
				}, 200)
			},
			getHidden() {
				setTimeout(() => {
					this.refreshHidden = false
				}, 1000)
			},
			getShow(){
				setTimeout(() => {
					this.refreshHidden = true
				}, 1000)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mihuo_refresh_page {
		background-color: $themeColor;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		// border-radius: 42rpx 0px 0px 42rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		// bottom: 80rpx;
		bottom: 150rpx;
		right: 20rpx;
		z-index: 99;
		transition: all 1s;
	}

	.mihuo_refresh_page_roll {
		right: -72rpx;
	}

	.icon_refresh {
		width: 30rpx;
		height: 30rpx;
		// margin-right: 2rpx;
	}

	.icon_refresh_active {
		transition: all 1.5s;
		transform: rotateZ(360deg);
	}

	.icon_text {
		font-size: $middleFontSize;
		color: #fff;
	}

	.fade_in {
		animation: fadeIn 1s;
	}

	.fade_out {
		animation: fadeOut 1s;
	}

	.refresh_hidden_block {
		// opacity: 0;
	}

	.refresh_hidden_none {
		opacity: 0;
		animation: infinite;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}

		10% {
			opacity: 0.1;
		}

		20% {
			opacity: 0.2;
		}

		30% {
			opacity: 0.3;
		}

		40% {
			opacity: 0.4;
		}

		50% {
			opacity: 0.5;
		}

		60% {
			opacity: 0.6;
		}

		70% {
			opacity: 0.7;
		}

		80% {
			opacity: 0.8;
		}

		90% {
			opacity: 0.9;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes fadeOut {
		0% {
			opacity: 1;
		}

		10% {
			opacity: 0.9;
		}

		20% {
			opacity: 0.8;
		}

		30% {
			opacity: 0.7;
		}

		40% {
			opacity: 0.6;
		}

		50% {
			opacity: 0.5;
		}

		60% {
			opacity: 0.4;
		}

		70% {
			opacity: 0.3;
		}

		80% {
			opacity: 0.2;
		}

		90% {
			opacity: 0.1;
		}

		100% {
			opacity: 0;
		}
	}

	/* @import url(); 引入css类 */
</style>
