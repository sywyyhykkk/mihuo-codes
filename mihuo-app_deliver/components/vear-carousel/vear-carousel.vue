<template>
	<swiper class="image-container" previous-margin="45rpx" next-margin="45rpx" :circular="false"
		:current="currentIndex" :autoplay="autoplay" @change="swiperChange">
		<swiper-item :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'"
			v-for="(item, index) in imgList" :key="index">
			<view class="item-img-default item-img" @click="clickImg(item)" :class="setClass(item.levelName).bg">
				<view class="text-contain" :class="setClass(item.levelName).color">
					<text class="item-name">{{item.levelName}}工匠</text>
					<text class="item-desc">{{getDesc(index,item)}}</text>
					<text class="item-integral">{{getIntegral(index,item)}}</text>
				</view>
				<view class="item-tag" v-if="current == index">当前等级</view>
			</view>
		</swiper-item>
	</swiper>
</template>
<script>
	export default {
		props: {
			imgList: {
				type: Array,
				default () {
					return []
				}
			},
			autoplay: {
				type: Boolean,
				default: true
			},
			urlKey: {
				type: String,
				default () {
					return ''
				}
			},
			current: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				currentIndex: 0,
				dontFirstAnimation: true
			}
		},
		computed: {

		},
		mounted() {
			this.currentIndex = this.current
		},
		methods: {
			getDesc(index, item) {
				if (index == this.current) {
					// 如果达到最大等级，则显示积分
					if (index + 1 == this.imgList.length) {
						return `当前积分${item.integral}`
					} else {
						return item.notice
					}
				} else {
					return `当前积分${item.integral}`
				}
			},
			getIntegral(index, item) {
				if (index == this.current) {
					// 如果达到最大等级，则显示已达最大等级
					let tempNeedIntegral = this.imgList[index + 1] && this.imgList[index + 1].levelIntegral 
					let resultIntegral = tempNeedIntegral - item.integral
					return `当前积分${item.integral}，距离${this.getLevelName(index)}等级还需${resultIntegral}积分`
					// if (index + 1 == this.imgList.length) {
					// 	return '已达最大等级'
					// } else {
					// 	return `当前积分${item.integral}，距离${this.getLevelName(index)}等级还需${item.levelIntegral}积分`
					// }
				} else {
					// 判断是否已经超过该等级
					if (this.current > index) {
						return '当前高于该等级'
					} else {
						return `积分达到${item.levelIntegral}分可升级`
						// if (index + 1 == this.imgList.length) {
						// 	return '已达最大等级'
						// } else {
						// 	return `积分达到${item.levelIntegral}分可升级`
						// }
					}
				}
			},
			getLevelName(index) {
				let item = this.imgList[index + 1]
				if (item) {
					return item.levelName
				} else {
					return this.imgList[index].levelName
				}
			},
			swiperChange(e) {
				this.dontFirstAnimation = false
				this.currentIndex = e.detail.current
				this.$emit('swiperChange', this.currentIndex)
			},
			clickImg(item) {
				this.$emit('selected', item, this.currentIndex)
			},
			setClass(type) {
				let tempName = {
					'新手': 'xs',
					'新秀': 'xx',
					'精英': 'jy',
					'明星': 'mx',
					'大师': 'ds',
					'王者': 'wz',
				}
				let result = {
					bg: `item-img-${tempName[type]}-bg`,
					color: `item-img-${tempName[type]}-text`,
				}
				return result

			}
		}
	}
</script>
<style lang="scss" scoped>
	/deep/ .uni-swiper-slides {
		inset: 0rpx 30rpx !important;
	}

	.image-container {
		width: 750rpx;
		height: 350rpx;
	}

	.item-img-default {
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
		padding: 58rpx 50rpx 50rpx 64rpx;
		position: relative;

		.item-tag {
			position: absolute;
			left: 0rpx;
			top: 0rpx;
			color: #fff;
			font-size: 24rpx;
			width: 120rpx;
			height: 46rpx;
			text-align: center;
			line-height: 46rpx;
			border-radius: 14rpx 0rpx 14rpx 0rpx;
			background: rgba(0, 0, 0, 0.3);

		}
	}


	.item-img {
		width: 670rpx;
		height: 260rpx;
		border-radius: 14rpx;
		/* animation: to-big .3s; */
	}

	.swiper-item {
		width: 630rpx;
		height: 300rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.swiper-item-side {
		width: 630rpx;
		height: 260rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.text-contain {
		display: flex;
		flex-direction: column;
	}

	.item-name {
		font-size: 40rpx;
		margin-bottom: 8rpx;
		font-weight: bold;
	}

	.item-desc {
		font-size: 28rpx;
		margin-bottom: 24rpx;
		@include bov(2)
	}

	.item-integral {
		font-size: 28rpx;
		@include bov(1)
	}

	.item-img-xs-bg {
		background-image: url('@/static/images/icon_fen/fen_1.png'), linear-gradient(90deg, #F8D4C1 0%, #E3B08D 100%);
		;
	}

	.item-img-xs-text {
		text {
			color: #8B5345;
		}
	}

	.item-img-xx-bg {
		background-image: url('@/static/images/icon_fen/fen_1.png'), linear-gradient(90deg, #BFBDD8 0%, #CBC8E2 100%);
	}

	.item-img-xx-text {
		text {
			color: #4F4976;
		}
	}

	.item-img-jy-bg {
		background-image: url('@/static/images/icon_fen/fen_1.png'), linear-gradient(90deg, #F7E2A0 0%, #EFC56D 100%);
	}

	.item-img-jy-text {
		text {
			color: #6B3817;
		}
	}


	.item-img-mx-bg {
		background-image: url('@/static/images/icon_fen/fen_1.png'), linear-gradient(88deg, #C6B1FA 0%, #A999F8 99%);
	}

	.item-img-mx-text {
		text {
			color: #461593;
		}
	}


	.item-img-ds-bg {
		background-image: url('@/static/images/icon_fen/fen_1.png'), linear-gradient(146deg, #781FFD 14%, #A46BFD 34%, #5C4CE2 68%);
	}

	.item-img-ds-text {
		text {
			color: #FFFFFF;
		}
	}

	.item-img-wz-bg {
		background-image: url('@/static/images/icon_fen/fen_1.png'), linear-gradient(105deg, #676786 5%, #29293E 89%);
	}

	.item-img-wz-text {
		text {
			color: #FFFFFF;
		}
	}
</style>
