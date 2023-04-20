<template>
	<view class="select-material-details">
		<view class="top">
			<text class="name">{{info.type}}</text>
			<view class="status-contain">
				<text class="order-status" v-if="info.orderStatus === 1">已开单</text>
				<text class="order-status" v-if="info.orderStatus === 2">已下单</text>
				<text class="order-error" v-if="info.orderStatus === 0">未下单</text>
			</view>
		</view>
		<view class="middle">
			<view class="middle-top">
				<view class="no-image" v-if="!info.productImg">
					<image src="@/static/images/materia-default.jpg" mode=""></image>
				</view>
				<u-lazy-load v-else class="item-image" height="146" :style="{ width: '146rpx' }" @click="preview($util.thumbnailImage( info.productImg,false))"
					imgMode="aspectFill" border-radius="10" :image="$util.thumbnailImage( info.productImg,true)">
				</u-lazy-load>
				<view class="item-right">
					<view class="item-material-name">
						<text class="item-product-name">{{info.productName || info.name}}</text>
						<view class="item-product-price">
							<text class="item-icon">￥</text>
							<text class="item-text">{{info.attributeValue * info.price}}</text>
						</view>
					</view>
					<view class="item-specifications" v-if="Number(info.sourceType) !== 1003">
						<text v-for="(item,index) in info.productSku" :key="index">
							{{item.value}}
						</text>
					</view>
					<view v-else class="item-specifications-name">
						{{info.name}}
					</view>
					<view class="item-calculate-contain" v-if="info.orderStatus === 0">
						<view class="item-calculate">
							<view class="item-operation public-flex-center" @click="calculate('减')">
								<u-icon size="24" color="#C4C4C4" name="minus"></u-icon>
							</view>
							<text class="calculate public-flex-center">{{info.attributeValue}}</text>
							<view class="item-operation public-flex-center" @click="calculate('加')">
								<u-icon size="24" color="#3A3838" name="plus"></u-icon>
							</view>
						</view>
						<view class="item-unit">{{info.attributeUnit}}</view>
					</view>
					<view class="statistical" v-else>
						<text class="left">数量</text>
						<text class="right" v-if="info.attributeValue">x{{info.attributeValue}}</text>
					</view>
				</view>
			</view>
			<view class="bottom-contain">
				<view class="desc" v-if="info.remark">
					<view class="title">备注</view>
					<text class="desc-text">{{info.remark}}</text>
				</view>
				<view class="operation-icon" v-if="info.orderStatus == 0">
					<view class="item-operation" @click="getOperation(item)" v-for="(item,index) in operationList"
						:key="index">
						<image :src="item.url" :key="index"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- <modal-new v-model="modalShow" @click="confirm" @cancel="modalCancel">
			<view class="label">是否删除材料</view>
		</modal-new> -->
	</view>
</template>

<script>
	// import modalNew from '../modal-new/modal-new.vue'
	/**
	 * @description 选材数据展示
	 */
	export default {
		components: {
			// modalNew
		},
		props: {
			info: {
				type: Object,
				default: function() {
					return {};
				},
			},
		},
		data() {
			return {
				modalShow: false,
				tempInfo: {},
				operationList: [{
						name: '扫码',
						url: '/static/images/scan-code.png',
						sourceType: '1001'
					},
					{
						name: '材料库',
						url: '/static/images/material-library.png',
						sourceType: '1002'
					},
					{
						name: '删除',
						url: '/static/images/delete_icon/material-delete.png',
						sourceType: ''
					}
				],
			};
		},
		mounted() {
			this.tempInfo = JSON.parse(JSON.stringify(this.info))
		},
		methods: {
			calculate(typeName) {
				if (typeName === '加') {
					this.info.attributeValue++
				} else {
					if (this.info.attributeValue == 1) {
						this.$util.toast(`选材数量不能为零`);
						return
					}
					this.info.attributeValue--
				}

				this.debounce(() => {
					let parameter = {
						attributeValue: this.info.attributeValue,
						id: this.info.id,
						skuId: this.info.skuId
					}
					this.$httpApi.updateMaterialRecord(parameter).then(res => {
						if (!res) {
							this.info.attributeValue = this.tempInfo.attributeValue
						}
					})
				}, 200)
			},
			getOperation(item) {
				if (this.info.orderStatus !== 0) {
					this.$util.toast(`该商品已经开单,无法进行其他操作`);
					return
				}
				uni.setStorageSync('sourceType', item.sourceType)
				switch (item.name) {
					case '扫码':
						break
					case '材料库':
						this.$emit('getOperation', {
							sourceType: item.sourceType,
							name: item.name
						}, {
							type: this.info.type,
							operationType: '替换',
							operationId: this.info.id,
							express: this.info.express,
							categoryIdList: this.info.categoryIdList,
							productId: this.info.productId,
							configId: this.info.configId,
						})
						break
					case '删除':
						// this.modalShow = !this.modalShow
						this.$emit('deleteMaterial', this.info.id)
						break
				}
			},
			modalCancel() {
				this.modalShow = !this.modalShow
			},
			confirm() {
				this.$httpApi.removeProductById({
					id: this.info.id
				}).then(res => {
					if (res) {
						this.modalShow = !this.modalShow
						this.$emit('select')
						this.$util.toast("操作成功");
					}
				})
			},
			preview(url){
				uni.previewImage({
					current: url,
					urls: [url]
				})
			}
		},
	};
</script>

<style lang="scss" scoped>
	.public-flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.slot-content {
		padding: 8rpx 0 30rpx 0;

		.label {
			color: #999999;
			font-size: $middleFontSize;
			text-align: center;
		}

	}

	.select-material-details {
		padding-bottom: 34rpx;
		border-bottom: 2rpx dashed #EEEEEE;

		.top {
			display: flex;
			margin-bottom: 16rpx;
			align-items: center;

			.name {
				font-weight: bold;
				font-size: $smallFontSize;
				color: $seconFontColor;
				margin-right: 6rpx;
			}

			.status-contain {
				text {
					font-size: $smallFontSize;
				}

				.order-status {
					background-color: rgba(16, 197, 125, 0.1);
					border-radius: 0px 5px;
					color: $successNewFontColor;
					font-size: 24rpx;
					padding: 2rpx 8rpx;
					display: inline-block;
					transform: scale(0.8);
				}

				.order-error {
					background-color: rgba(255, 93, 53, 0.1);
					border-radius: 0px 5px;
					color: $errorFontColor;
					font-size: 24rpx;
					padding: 2rpx 8rpx;
					display: inline-block;
					transform: scale(0.8);
				}
			}
		}

		.middle {
			.middle-top {
				display: flex;
				margin-bottom: 22rpx;

				.no-image {
					image {
						width: 146rpx;
						height: 146rpx;
					}
				}

				.item-right {
					margin-left: 18rpx;
					flex: 1;
					max-width: 500rpx;

					.item-material-name {
						display: flex;
						justify-content: space-between;

						.item-product-name {
							font-size: 28rpx;
							color: #303133;
						}
						
						.item-product-price {
							.item-text{
								font-size: 30rpx;
								color: #FF5D35;
							}
							
							.item-icon{
								font-size: 24rpx;
								color: #FF5D35;
							}
						}
					}

					.item-name {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-bottom: 8rpx;
					}

					.item-specifications {
						margin-bottom: 10rpx;

						text {
							font-size: $smallFontSize;
							color: #999999;
						}
					}

					.item-specifications-name {
						font-size: $smallFontSize;
						color: #999999;
						margin-bottom: 4rpx;
					}

					.item-calculate-contain {
						display: flex;

						.item-calculate {
							display: flex;
							margin-right: 22rpx;

							.item-operation {
								width: 48rpx;
								height: 48rpx;
								background: #F6F6F6;
								border-radius: 2px;
								margin-right: 2rpx;
							}

							.calculate {
								min-width: 64rpx;
								padding: 0 26rpx;
								height: 48rpx;
								font-weight: bold;
								font-size: $smallFontSize;
								background: #F6F6F6;
								color: #909199;
								border-radius: 2px;
								margin-right: 2rpx;
							}
						}


						.item-unit {
							font-size: $middleFontSize;
							color: #999999;
							display: flex;
							align-items: center;
						}
					}

					.statistical {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.left {
							color: $viceFontColor;
							font-size: $smallFontSize;
						}

						.right {
							color: #333333;
							font-size: $smallFontSize;
						}
					}

				}
			}
		}

		.bottom-contain {
			.desc {
				margin-bottom: 28rpx;
				background: #F9F9F9;
				border-radius: $miniBorderRadius;
				padding: 20rpx;
				display: flex;

				.title {
					font-size: $smallFontSize;
					color: $themeColor;
					opacity: 0.5;
					margin-right: 24rpx;
					white-space: nowrap;
				}

				.desc-text {
					font-size: $smallFontSize;
					color: #909199;
				}
			}

			.operation-icon {
				display: flex;
				justify-content: space-between;

				.item-operation {
					display: flex;
					flex: 1;
					justify-content: center;
				}
			}

			image {
				width: 26rpx;
				height: 26rpx;
			}
		}
	}
</style>
