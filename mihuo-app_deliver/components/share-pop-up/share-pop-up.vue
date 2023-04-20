<template>
	<u-popup v-model="showPopup" border-radius="30" height="400" mode="bottom" @close="close"
		:safe-area-inset-bottom="false" :closeable="true">
		<view class="criteria-contian">
			<view class="tittle">
				分享
			</view>
			<view class="list-contain">
				<view class="item-share" v-for="(item,index) in shareList" :key="index" @click="getShare(item)">
					<u-image width="56rpx" height="56rpx" class="icon" :src='item.icon'>
					</u-image>
					<text class="name">{{item.name}}</text>
				</view>
				
			</view>
		</view>
	</u-popup>
</template>
<script>
	export default {
		props: {
			title: {
				type: String,
				default: '选择我的角色'
			},
			logList: {
				type: Array,
				default: function() {
					return []
				}
			},
			value: {
				type: Boolean,
				default: false
			},

		},
		data() {
			return {
				showPopup: false,
				shareList: [{
					name: '分享到微信',
					icon: '/static/images/share-weixin.png'
				}, {
					name: '复制口令',
					icon: '/static/images/share-link.png'
				}]
			}
		},
		computed: {

		},
		watch: {
			value(val) {
				if (val) {
					this.open();
				} else if (!this.showPopup) {
					this.close();
				}
				this.showPopup = false;
			}
		},
		mounted() {
			this.value && this.open();
		},
		methods: {
			open() {
				this.$nextTick(() => {
					this.showPopup = true
					this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('close')
					this.showPopup = false
				})
			},
			setImage(item) {
				let tempUrl = this.imageList.find(el => item.skillName.includes(el.value))
				if (tempUrl) {
					return tempUrl.url
				} else {
					return '/static/images/skill_icon/skill_cc.png'
				}
			},
			getShare(item){
				this.$emit('click', item)
				this.close()
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.criteria-contian {
		height: 100%;
		background-color: #FFF;

		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			margin: 0 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.list-contain {
			padding: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin-top: 50rpx;

			.item-share {
				display: flex;
				align-items: center;
				flex-direction: column;

				text {
					font-size: 28rpx;
					font-weight: bold;
					color: #303133;
					margin-top: 10rpx;
				}
			}
		}

		.scroll-Y {
			height: 100%;
		}

		.rejection-record {
			padding: 20rpx;

			.mh-empty-page {
				/deep/ .u-empty {
					margin-top: 50rpx !important;
				}
			}

			.item-record-cotain {
				display: flex;

				&:last-child {
					.item-bottom {
						margin-bottom: 0rpx !important;
					}
				}

				.item-left {
					width: 40rpx;
					border-left: 2rpx dashed #C4C4C4;
					position: relative;

					.node {
						position: absolute;
						left: -14rpx;
						width: 26rpx;
						height: 26rpx;
						background-color: #fff;
						border-radius: 50%;
						border: 6rpx solid #D9D9D9;
					}
				}

				.item-right {
					display: flex;
					flex-direction: column;
					flex: 1;


					.item-top {
						display: flex;
						justify-content: space-between;
						margin-bottom: 20rpx;
						margin-left: -6rpx;
						margin-top: -6rpx;

						.refuse-title {
							font-size: 28rpx;
							color: #303133;

						}

						.refuse-time {
							font-size: 24rpx;
							color: #909199;
						}
					}

					.item-name {
						line-height: 38rpx;
						margin-top: -6rpx;

						.left {
							color: #303133;
							font-size: 28rpx;
							margin-right: 14rpx;
						}

						.right {
							color: #FF5D35;
							font-size: 30rpx;
						}
					}

					.item-time {
						color: #909199;
						font-size: 26rpx;
						margin-bottom: 28rpx;
						line-height: 38rpx;
					}

					.item-bottom {
						padding: 26rpx;
						background: #F6F6F6;
						border-radius: 20rpx;
						font-size: 26rpx;
						color: #303133;
						margin-bottom: 40rpx;
					}
				}
			}
		}
	}


	.public-images {
		width: 116rpx;
		height: 116rpx;
		border-radius: 50%;
		background-color: #E9EFFF;
		margin-bottom: 10rpx;

	}

	.list-skill-contain {
		display: flex;
		// flex-wrap: wrap;
		padding: 0rpx 60rpx 0rpx 60rpx;
		justify-content: space-around;

		.item-skill-contain {
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 40rpx;
			// margin-right: 82rpx;
			margin-bottom: 16rpx;

		}

		.item-bottom {
			display: flex;
			flex-direction: column;

			.item-text {
				font-size: 28rpx;
				color: #303133;
				white-space: nowrap;
			}

			.item-time {
				font-size: 24rpx;
				color: #909199;
			}
		}
	}
</style>
