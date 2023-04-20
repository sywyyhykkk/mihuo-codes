<template>
	<view class="set-meal-details">
		<view v-if="detailsShow">
			<item-set-meal :viewShow="false" :info="info"></item-set-meal>
			<view class="type-contain" v-for="(item,index) in list" :key="index">
				<view class="type-name display-justify_between" @click="item.show = !item.show">
					<text class="left">{{item.name}}</text>
					<text class="right">
						<text class="num-name">数量</text>
						<text class="num">{{item.children.length}}</text>
						<u-icon class="icon" :name="item.show ? 'arrow-down':'arrow-up' " color="#909199" size="24">
						</u-icon>
					</text>
				</view>
				<view v-if="item.show" class="type-list">
					<view class="group" v-for="(item2,index2) in item.children" :key="index2">
						<text class="group-name">{{item2.type}}</text>
						<view class="group-list">
							<view class="item-grop" v-for="(item3,index3) in item2.products" :key="index3">
								<view class="left">
									<text>{{index3 +1}}</text>
									<image-lazy-load :viewStatus="false" :image="item3.productImg" height="90">
									</image-lazy-load>
								</view>
								<view class="right">
									<text class="name">{{item3.productName}}</text>
									<text v-if="$isJSON(item3.productSku)"
										class="sku-name">{{getSkuName(item3.productSku)}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="!detailsShow" title="这里空荡荡哒～" />
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				option: {},
				list: [],
				detailsShow: false,
			}
		},
		computed: {

		},
		mounted() {
			this.getTypeList()
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getTypeList() {
				if (uni.getStorageSync('treeList')) {
					this.treeList = uni.getStorageSync('treeList')
					this.detailsShow = true
					this.list = this.group()
				} else {
					this.$httpApi.getListByTreeCodeTree({}).then(res => {
						if (res) {
							this.treeList = res
							this.detailsShow = true
							this.list = this.group()
						}
					})
				}
			},
			group() {
				if (!this.info.packageInfo) {
					return
				}
				let result = this.$util.group(this.info.packageInfo.packageProduct, this.treeList)
				
				console.log('result',result);
				
				return result
			},
			getSkuName(item) {
				if (item) {
					let name = JSON.parse(item)
					return name[0] ? name[0].value : ''
				}
				return ''
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.set-meal-details {
		padding: 40rpx 30rpx;


		.type-name {
			background: #F5F6F9;
			height: 90rpx;
			padding: 20rpx 24rpx;
			align-items: center;
			border-radius: 10rpx;

			.left {
				color: $seconFontColor;
				font-size: 30rpx;
			}

			.right {

				.num-name {
					color: $viceFontColor;
					font-size: $smallFontSize;
					margin-right: 14rpx;
				}

				.num {
					color: #3D3D3D;
					font-size: $middleFontSize;
					margin-right: 20rpx;
				}
			}

		}

		.type-contain {
			margin-bottom: 20rpx;
		}

		.type-list {
			margin-top: 20rpx;


			.group-name {
				display: inline-block;
				border-radius: 16rpx 0rpx 16rpx 0rpx;
				background: rgba(0, 47, 165, 0.2);
				font-size: 28rpx;
				padding: 0 24rpx;
				line-height: 50rpx;
				color: $themeColor;
			}

			.group {
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

			}

			.group-list {
				margin-top: 20rpx;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}

			.record-item-img {
				width: 90rpx;
				height: 90rpx;
				margin-right: 20rpx;
			}

			.item-grop {
				display: flex;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.left {
					display: flex;
					flex-direction: row;

					text {
						color: rgba(48, 49, 51, 0.3);
						font-size: 30rpx;
						margin-right: 20rpx;
					}
				}

				.right {
					display: flex;
					flex-direction: column;
					margin-left: 20rpx;

					.name {
						color: $seconFontColor;
						font-size: 28rpx;
						line-height: 40rpx;
					}

					.sku-name {
						color: $viceFontColor;
						font-size: $fontSize26;
					}
				}

			}


		}
	}
</style>
