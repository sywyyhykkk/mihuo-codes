<template>
	<view class="sendCard" v-if="visibleSync" :style="[style]">
		<view class="card">
			<im--billorder-item v-if="orderDetail.id" :orderDetail="orderDetail" />
			<message-mh-im-material-item v-if="materialDetail.id" :materialDetail="materialDetail" />
			<message-mh-order-info v-if="constructionOrder.id" :orderInfo="constructionOrder" />
			<view class="footer">
				<slot name="actionButton"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "im-material-billorder",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			contentBackgroundColor: {
				type: String,
				default: "#FFF"
			},
			orderDetail: {
				type: Object,
				default: () => ({

				})
			},
			materialDetail: {
				type: Object,
				default: () => ({
			
				})
			},
			constructionOrder: {
				type: Object,
				default: () => ({
			
				})
			},
			duration: {
				type: Number,
				default: 500
			}
		},
		data() {
			return {
				visibleSync: false,
			};
		},
		watch: {
			value(val) {
				if (val) {
					this.visibleSync = true;
				} else {
					this.visibleSync = false;
				}
			}
		},
		computed: {
			style() {
				let style = {};
				style = {
					transform: `translate3D(0px,'100%',0px)`
				}
				if (this.duration) style.transition = `all ${this.duration / 1000}s linear`;
				style.backgroundColor = this.contentBackgroundColor;
				return style;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sendCard {
		position: fixed;
		bottom: 140rpx;
		width: 96%;
		margin: 0 2%;
		border-radius: 10rpx;
	}

	.card {
		background-color: #FFFFFF;
		padding: 24rpx;
		border-radius: 10rpx;

		.status-button {
			background-color: #fff;
			color: #999;
			font-size: 28rpx;
		}

		.actionButton {
			margin-top: 30rpx;
			display: flex;
			height: 60rpx;
			justify-content: center;

			.cancel,
			.sure {
				height: 60rpx;
				line-height: 60rpx;
				width: 120rpx;
				display: inline-block;
			}

			.cancel {
				border: 1px solid #EEEEEE;
				box-sizing: border-box;
				border-radius: 5px;
				color: #666;
			}

			.sure {
				@include theme('btn_bg');
				color: #fff;
				margin-left: 76rpx;
			}
		}

		.title {
			font-size: 30rpx;
			line-height: 42rpx;
			color: #303133;
			margin-bottom: 20rpx;
			display: flex;

			.order-no {
				font-weight: 600;
				flex: 1;
			}

			.material-num {
				color: $themeColor;
				font-size: 28rpx;
			}
		}

		.requestime,
		.orderTime {
			font-size: 24rpx;
			color: #999;

			.date {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
</style>
