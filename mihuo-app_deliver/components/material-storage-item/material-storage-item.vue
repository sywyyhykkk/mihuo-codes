<template>
	<view class="material-storage-item" @click.stop="">
		<view class="item-contain">
			<view class="top-contain">
				<view class="left">
					<u-lazy-load  class="item-image" height="146" :style="{ width: '146rpx' }" imgMode="aspectFill"
						border-radius="10" :image="$util.thumbnailImage(info.coverImg ,true)">
					</u-lazy-load>
					<!-- <text>24片/箱</text> -->
				</view>
				<view class="right">
					<view class="top">
						<view class="name">{{info.name}}</view>
						<text class="price" v-if="info.price">￥{{info.price}}</text>
					</view>
					<view class="bottom">
						<!-- <view class="area">
							适用区域:餐厅、客厅、厨房、卧室
						</view> -->
						<view class="specifications" v-if="info.productAttrName">
							{{info.productAttrName}}
						</view>
					</view>
					<view class="add-image">
						<view v-if="typeName ==='选材'">
							<image src="/static/images/add-new.png" mode="" @click="selectMaterial('选材')">
							</image>
						</view>
						<view v-if="typeName ==='开单'">
							<view class="item-operation-contain" v-if="info.addMaterial && info.addMaterial ==='添加材料'">
								<view class="item-operation reduction  public-flex-center" @click="calculate('减')">
									<u-icon size="24" color="#C4C4C4" name="minus"></u-icon>
								</view>
								<view class="num public-flex-center">{{info.quantity}}</view>
								<view class="item-operation add public-flex-center" @click="calculate('加')">
									<u-icon size="24" color="#fff" name="plus"></u-icon>
								</view>
							</view>
							<image v-else src="/static/images/add-new.png" mode="" @click="selectMaterial('开单')">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom-contain" v-if="info.note">
				<view class="note-name">备注</view>
				<text class="note">
					{{info.note}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: function() {
					return {};
				},
			},
			typeName: {
				type: String, // 选材 、开单
				default: '',
			}
		},
		data() {
			return {
				key: ''
			}
		},
		mounted() {
			// console.log("info",this.info)
		},
		methods: {
			selectMaterial(type) {
				// if(type === '选材'){
				// 	this.$emit('selectMaterial', this.info)
				// }
				this.$emit('selectMaterial', this.info)
			},
			calculate(typeName) {
				if (typeName === '加') {
					this.info.quantity++
					this.info.isEditNum = true
				} else {
					if (this.info.quantity > 0) {
						this.info.quantity--
						this.info.isEditNum = true
					}
				}
				if (this.info.quantity === 0) {
					this.setEditCartQuantity()
				}
			},
			setEditCartQuantity() {
				this.$httpApi.cartDelete([Number(this.info.carId)]).then(res => {
					if (res) {
						this.$util.toast("商品已被移除");
						this.$emit('selectCartList')
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.material-storage-item {

		.item-contain {
			display: flex;
			background-color: $bgColor;
			flex-direction: column;
			padding: 28rpx 38rpx 28rpx 26rpx;

			.top-contain {
				display: flex;
				margin-bottom: 26rpx;
			}

			.left {
				position: relative;
				margin-right: 18rpx;

				text {
					position: absolute;
					font-size: 20rpx;
					color: #FFFFFF;
					z-index: 10;
					bottom: 4rpx;
					right: 36rpx;

				}
			}

			.right {
				display: flex;
				flex-direction: column;
				flex: 1;
				position: relative;

				.top {
					display: flex;
					justify-content: space-between;
					margin-bottom: 6rpx;

					.name {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 360rpx;
						font-size: $middleFontSize;
						color: $seconFontColor;
					}

					.price {
						font-weight: bold;
						color: $errorFontColor;
					}
				}

				.bottom {
					.area {
						margin-bottom: 20rpx;
					}

					.area,
					.specifications {
						font-size: $smallFontSize;
						color: #999999;
					}
				}

				.add-image {
					padding-top: 20rpx;

					image {
						position: absolute;
						width: 38rpx;
						height: 38rpx;
						right: 0;
					}

					.item-operation-contain {
						position: absolute;
						right: 0;
						display: flex;
						align-items: center;
						justify-content: flex-end;

						.item-operation {
							width: 40rpx;
							height: 40rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.add {
							background: $themeColor;
							border-radius: 4rpx;
						}

						.reduction {
							background: #F6F6F6;
							border: 1rpx solid $themeColor;
							box-sizing: border-box;
							border-radius: 4rpx;
						}

						.num {
							margin: 0 18rpx;
							font-weight: bold;
							font-size: $smallFontSize;
							color: $viceFontColor;
						}
					}
				}

			}

			.bottom-contain {
				background-color: #F9F9F9;
				padding: 18rpx 14rpx 22rpx 34rpx;
				border-radius: $miniBorderRadius;
				display: flex;

				.note-name {
					color: $themeColor;
					font-size: $smallFontSize;
					opacity: 0.5;
					margin-right: 24rpx;
					white-space: nowrap;
				}

				.note {
					font-size: $smallFontSize;
					color: #909199;
				}
			}
		}
	}
</style>
