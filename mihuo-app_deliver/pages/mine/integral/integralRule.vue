<template>
	<view class="integral-rule" :class="[list.length > 0? '':'integral-rule-default' ]">
		<public-module v-if="list.length == 0"></public-module>
		<z-nav-bar v-if="list.length == 0" backState="1000" bgColor="#fff" class="z-nav-bar" @backClick="goBackPage()">
			<view slot="default" class="nav-bar-title">
				工匠等级
			</view>
			<view slot="right" @click="getRule()" class="nav-bar-right">积分规则</view>
		</z-nav-bar>

		<view class="rule-top" v-if="list.length > 0">
			<view class="item-back">
				<image src="@/static/images/back.png" mode="" @click="goBack"></image>
				<view class="item-right">
					工匠等级
					<text class="item-rule" @click="getRule()">积分规则</text>
				</view>
			</view>
			<view class="carousel-cotain">
				<vear-carousel :img-list="list" :autoplay="false" @selected="selectedBanner"
					@swiperChange="swiperChange" :current="current" :key="vearCarouselIndex"></vear-carousel>
			</view>
		</view>
		<view class="explain-contain" v-if="getDetails.length > 0">
			<view class="item-paragraph">
				<view class="item-contain">
					<text class="item-title">权益说明</text>
					<view class="item-list">
						<view class="item-details" v-for="(item,index) in getDetails" :key="index">
							<u-lazy-load class="item-image" @click="preview($util.thumbnailImage(item,false))"
								imgMode="aspectFill" border-radius="10" :image="$util.thumbnailImage(item,true)">
							</u-lazy-load>
						</view>
					</view>
				</view>
			</view>
		</view>


		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				duration: 500,
				option: {},
				list: [],
				swiperIndex: 0,
				current: 0,
				vearCarouselIndex: 0,
				imgList: [{
					name: '新手'
				}, {
					name: '新秀'
				}, {
					name: '精英'
				}, {
					name: '明星'
				}, {
					name: '大师'
				}, {
					name: '王者'
				}]
			}
		},
		computed: {
			getDetails() {
				let temp = this.list[this.swiperIndex]
				if (temp) {
					if (this.$isJSON(temp.levelPic)) {
						return temp.levelPic && temp.levelPic.split(',')
					} else {
						return []
					}
				} else {
					return []
				}
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getSkillConfigInfo()
		},
		methods: {
			swiperChange(index) {
				this.swiperIndex = index
			},
			selectedBanner(event, index) {
				// console.log('event,index', event, index);
			},
			getRule() {
				this.toPage('/pages/mine/integral/IntegralRuleList')
			},
			getSkillConfigInfo() {
				this.$httpApi.getSkillConfigInfo({
					skillId: this.option.skillId
				}).then(res => {
					if (res) {
						this.list = res
						this.list.forEach((el, index) => {
							// 初始化当前岗位总积分
							el['integral'] = this.option.integral !== 'null' ? this.option.integral : 0
							// 初始化当前岗位对应等级的通知信息
							el['notice'] = ''
							// 判断当前岗位处以哪个等级
							if (this.option.levelName) {
								if (el.levelName.includes(this.option.levelName)) {
									this.current = index
								}
							}
						})

						this.userInfOgetPersonMsg()
					}
				})
			},
			preview(url) {
				uni.previewImage({
					current: 0,
					urls: [url],
					loop: true,
					indicator: 'number'
				});
			},
			userInfOgetPersonMsg() {
				if (this.option.personId) {
					this.$httpApi.userInfOgetPersonMsg({
						personId: this.option.personId
					}).then(res => {
						if (res) {
							this.list.forEach((el, index) => {
								// 如果还没有积分，则所有等级都赋值notice
								if (el.integral > 0) {
									if (this.current == index) {
										el['notice'] = res
									}
								} else {
									el['notice'] = res
								}
							})
						}
						this.vearCarouselIndex++
					})
				}
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
		background-color: rgba(32, 32, 40, 1.000);
	}
</style>

<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.nav-bar-right {
		font-size: 24rpx;
		padding-right: 30rpx;
	}



	.integral-rule {
		padding-bottom: 80rpx;
		display: flex;
		flex-direction: column;

		.rule-top {
			background-image: url('@/static/images/grade.png');
			background-color: rgba(28, 23, 20, 1);
			height: 442rpx;
			width: 750rpx;
			background-repeat: no-repeat;
			background-size: contain;
			margin-bottom: 48rpx;

			.item-back {
				display: flex;
				align-items: center;
				padding-left: 24rpx;
				padding-top: var(--status-bar-height);
				// height:var(--status-bar-height);

				.item-right {
					color: #fff;
					font-size: 36rpx;
					display: flex;
					flex: 1;
					justify-content: center;
					position: relative;

					.item-rule {
						right: 40rpx;
						font-size: 24rpx;
						color: #fff;
						top: 10rpx;
						position: absolute;

					}
				}

				image {
					width: 44rpx;
					height: 44rpx;
				}
			}

		}

		.carousel-cotain {
			width: 750rpx;
			margin-top: 42rpx;

			.scroll-x {
				white-space: nowrap;
				width: 100%;
			}


			.list-contain {
				width: 100%;
			}

			.item-carousel {
				display: inline-block;
				margin: 0 10rpx;
				background-color: #fff;
				width: 670rpx;
				height: 264rpx;
				border-radius: 10rpx;

				&:nth-of-type(1) {
					margin-left: 20rpx;
				}

				&:last-child {
					margin-right: 20rpx;
				}
			}
		}



		.explain-contain {
			border-radius: 16rpx;
			background-color: #fff;
			padding: 40rpx 36rpx;
			margin: 48rpx 18rpx 0rpx 18rpx;

			.item-contain {
				margin-bottom: 42rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}

			.item-title {
				color: #303133;
				font-size: 30rpx;
				display: inline-block;
				margin-bottom: 24rpx;
				font-weight: bold;
			}

			.item-details {
				color: #606166;
				font-size: 28rpx;
				line-height: 44rpx;
				letter-spacing: 0px;

				.item-image {
					margin-bottom: 40rpx;
				}

			}
		}
	}

	.integral-rule-default {
		background-color: #fff;
		height: 100vh;
	}
</style>
