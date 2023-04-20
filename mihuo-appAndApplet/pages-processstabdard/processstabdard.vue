<template>
	<!-- 工艺标准、统一工价、品质保障、售后无忧 -->
	<view class="process-contain">
		<z-nav-bar backState="1000" :scrollTop="scrollTop" type="transparentFixed" bgColor="#FFFFFF">
			<view slot="default" class="nav-bar">工艺标准</view>
		</z-nav-bar>
		<image src="@/pages-processstabdard/static/images/home_v2/bg-750x400.png" mode="widthFix" class="header-bg">
		</image>
		<scroll-view id="sticky_id" :class="{'sticky':isSticky}" scroll-x="true" class="content-type flex-center">
			<view v-for="item, index in contentTypeList" :key="index" @click="changeType(index, item)" class="type-item"
				:class="{ 'active': index === currentNew }">
				{{ item.typeName }}
			</view>
		</scroll-view>
		<view class="scroll-list">
			<view class="content-container" v-for="item, index in currentList" :key="index"
				v-if="item.typeName != '全部'">
				<view class="item-title flex-center" :id="`content-${item.typeTreeCode}`">
					<image v-if="iconUrls[item.typeName]" :src="iconUrls[item.typeName]" class="title-icon"></image>
					{{ item.typeName }}
				</view>
				<mh-skeleton :titleMarginTop="30" :hasMargin="false" :loading="!isShow" :imgTitleHeight="120" :imgTitleWidth="335" :row="4" :showTitle="false" :mini="true">
					<view class="content-area flex-center"
						style="display: flex; align-items: center; flex-wrap: wrap; gap: 20rpx; margin-top: 30rpx; justify-content: space-between;">
						<u-lazy-load @click="goToDetail(content)"
							:image="$util.thumbnailImage(content.facePic, true, 335)" class="content-item"
							mode="aspectFill" border-radius="15" height="120" duration="10"
							v-for="content, index2 in getArrByTreeCode(item.typeTreeCode)" :key="index2"></u-lazy-load>
					</view>
				</mh-skeleton>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				scrollTop: 0,
				iconUrls: {
					'打拆工程': 'static/images/home_v2/1.png',
					'木工工程': 'static/images/home_v2/2.png',
					'泥瓦工程': 'static/images/home_v2/3.png',
					'其他工程': 'static/images/home_v2/4.png',
					'水电暖通': 'static/images/home_v2/5.png',
					'贴砖工程': 'static/images/home_v2/6.png',
					'油漆工程': 'static/images/home_v2/7.png'
				},
				option: {},
				currentNew: 0,
				contentTypeList: [{
					typeName: '全部',
				}],
				contentList: [],
				typeTreeCode: '1001', // 工艺标准treeCode
				typeName: '',
				stickHeight: 0,
				isSticky: false,
				currentShow: '',
				currentList: [],
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
			this.isSticky = e.scrollTop + 88 > this.stickHeight ? true : false;
		},
		onShareAppMessage(e) {
			const coverImg = ''
			const path = '/pages-processstabdard/processstabdard?typeName=工艺标准'
			const result = this.$util.shareToWechat('504道严格施工标准，装修更透明，施工更可靠！', coverImg, path, '工艺标准', true, 1)
			return result
		},
		onLoad(option) {
			this.typeName = option.typeName
			if (option.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('工艺标准', url, option.userId)
			}
			this.getCMSType()
		},
		mounted() {
			// 获取标签距离顶部的高度
			const query = uni.createSelectorQuery();
			query.select('#sticky_id').boundingClientRect(data => {
				this.stickHeight = data.top;
			}).exec();
		},
		methods: {
			getArrByTreeCode(treeCode) {
				const result = this.contentList.filter(item => item.typeTreeCode == treeCode)
				return result
			},
			goToDetail(item) {
				uni.navigateTo({
					url: '/pages-mine/cms?id=' + item.id
				})
			},
			changeType(index, item) {
				this.currentNew = index
				if (index == 0) {
					this.currentShow = ''
					this.currentList = this.contentTypeList
				} else {
					this.currentList = this.contentTypeList.filter(item2 => item.typeTreeCode == item2.typeTreeCode)
					uni.pageScrollTo({
						scrollTop: 0,
					})
				}
			},
			// 获取内容分类
			getCMSType() {
				this.$httpApi.getCmsContentType({
					typeName: this.typeName,
					typeTreeCodeExtra: 'SUB_ONLY',
					size: 99,
					'orders[0].asc': false,
					'orders[0].column': 'created'
				}).then(res => {
					if (res && res.records) {
						this.selectCmsDetails()
						this.contentTypeList.push(...res.records)
						this.currentList = this.contentTypeList
					}
				})
			},
			// 获取内容列表
			selectCmsDetails() {
				this.$httpApi.getCMSContent({
					size: 999,
					typeTreeCode: this.typeTreeCode,
				}).then(res => {
					if (res) {
						this.pages = res.pages
						this.contentList = res.records
						setTimeout(() => {
							this.isShow = true
						}, 200)
					}
				})
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.flex-center {
		display: flex;
		align-items: center;
	}

	.sticky {
		position: fixed;
		z-index: 999;
		/* #ifndef MP */
		top: calc(var(--status-bar-height) + 68rpx);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: calc(var(--status-bar-height) + 100rpx);
		/* #endif */
	}

	.process-contain {
		width: 100vw;
		height: 100vh;

		.nav-bar {
			@include nav-bar-title(#000000);
		}

		.header-bg {
			width: 750rpx;
			height: 400rpx;
		}

		.content-type {
			width: 750rpx;
			height: 100rpx;
			margin-top: 10rpx;
			white-space: nowrap;
			padding: 20rpx 0;
			padding-left: 30rpx;
			background-color: #FFFFFF;

			.type-item {
				width: max-content;
				height: 60rpx;
				min-width: 120rpx;
				background-color: rgba(#fe6e32, 0.1);
				color: #000000;
				line-height: 40rpx;
				font-size: 24rpx;
				padding: 10rpx 20rpx;
				display: inline-block;
				text-align: center;
				margin-right: 20rpx;
				border-radius: 6rpx;

				&.active {
					background-color: #fe6e32;
					color: #FFFFFF;
				}
			}
		}

		.scroll-list {
			width: 750rpx;
			height: calc(100vh - var(--status-bar-height) - 480rpx);
			@include safearea();

			.content-container {
				width: 690rpx;
				height: max-content;
				margin: 0rpx 30rpx 0 30rpx;
				padding-top: 40rpx;

				.item-title {
					font-size: 28rpx;
					font-weight: bold;
					color: #000000;

					.title-icon {
						width: 40rpx;
						height: 40rpx;
						margin-right: 12rpx;
					}
				}

				.content-area {
					width: 690rpx;
					height: max-content;
					margin-top: 30rpx;
					flex-wrap: wrap;
					justify-content: space-between;

					.content-item {
						width: 335rpx;
						border-radius: 12rpx;
						margin-bottom: 20rpx;
					}
				}
			}
		}

		.item-content {
			.process-item {
				width: 100vw;
				min-height: 112rpx;
				height: max-content;
				display: flex;
				padding: 20rpx;
				margin-bottom: 20rpx;

				.content {
					flex: 1;
				}

				.image {
					width: 300rpx;
				}
			}

			.process-item-bg {
				width: 100vw;
				height: max-content;
				padding: 20rpx 30rpx;
				margin-bottom: 20rpx;

				.bg-content {
					width: 100%;
					height: 300rpx;
					background-size: cover;
					border-radius: 20rpx;
					margin-bottom: 20rpx;

					.bg-title {
						width: 100%;
						height: 108rpx;
						padding: 10rpx 20rpx;
						color: #FFFFFF;
						font-size: 32rpx;
						text-shadow: 5rpx 5rpx #000000;
						font-weight: bold;
						position: relative;
						left: 40rpx;
						top: 100rpx;
					}
				}

				.bg-des {
					font-size: 24rpx;
					color: #333333;
				}
			}
		}
	}
</style>
