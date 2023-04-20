<template>
	<view class="order-information-contain" :style="{ opacity : setInvalidStatus ?  '1':'0.5'  }">
		<view class="goods-list">
			<view class="item-goods-list">
				<u-lazy-load class="item-image" height="176" :style="{ width: '176rpx' }"
					@click="preview($util.thumbnailImage(info.productPic,false))" imgMode="aspectFill"
					border-radius="10" :image="$util.thumbnailImage(info.productPic,true)">
				</u-lazy-load>
				<view class="item-other" @click="getClick()">
					<view class="item-name">
						<text class="item-text">{{info.productName}}</text>
						<text class="item-price"
							v-if="typeName !== '记录' && info.serviceType != '1003'">{{ setOperation(info.productQuantity,info.skuStock.price)}}</text>

						<text class="item-show"
							v-if="info.serviceType == '1003' || otherInfo && otherInfo.orderType == '3'  ">查看</text>

						<text class="item-price"
							v-if="typeName == '记录' && otherInfo && otherInfo.orderType != '3'">￥{{info.payAmount}}</text>
					</view>
					<!-- <view class="item-desc" v-if="info.note">
						<text class="public-item">备注:{{info.note}}</text>
					</view> -->
					<view class="item-desc" v-if="typeName !== '记录'">
						<text
							class="public-item">{{$isJSON(info.skuStock.spData) &&　JSON.parse(info.skuStock.spData)[0] && JSON.parse(info.skuStock.spData)[0].value}}</text>
					</view>
					<view class="item-desc" v-if="typeName == '记录'">
						<text
							class="public-item">{{$isJSON(info.productAttr) &&　JSON.parse(info.productAttr)[0] && JSON.parse(info.productAttr)[0].value}}</text>
					</view>
					<view class="item-status-name" v-if="setInvalidStatus">
						{{getRefundStatus(info.refundStatus)}}
					</view>
					<view class="item-status-name status-name-waiting" v-else>
						商品已失效
					</view>
					<!-- <view class="item-cost">
						<text class="public-item">补齐费用</text>
						<text class="item-text-price">￥38</text>
					</view> -->
					<view class="item-specifications">
						<!-- <text class="public-item" >￥108/㎡</text> -->
						<text class="public-item" v-if="typeName !== '记录'">￥{{info.skuStock.price}} <text
								class="public-item" v-if="info.productUnit"> / {{info.productUnit}}</text></text>

						<text class="public-item" v-if="typeName == '记录'">￥{{info.productPrice}} <text
								class="public-item" v-if="info.productUnit"> / {{info.productUnit}}</text> </text>
						<text class="item-num">x{{info.productQuantity}} </text>
					</view>
				</view>
			</view>
			<view v-if="info.remark" class="desc">
				{{info.remark}}
			</view>
		</view>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		name: 'order-information',
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			list: {
				type: Array,
				default: () => []
			},
			typeName: { // 1.通过开单记录进入 2.通过开单详情进入
				type: String,
				default: ''
			},
			otherInfo: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				option: {}
			}
		},
		computed: {
			setInvalidStatus() {
				// 发货状态freightStatus. 1-可以发货, 2-不能发货
				// 上架状态publishStatus：0->下架；1->上架
				if (this.info.freightStatus == 1 && this.info.publishStatus == 1) {
					return true
				}
				if (this.info.freightStatus == null || this.info.publishStatus == null) {
					return true
				}
				return false
			},
		},
		mounted() {
			console.log('info', this.otherInfo);
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			preview(ul) {
				uni.previewImage({
					current: 1,
					urls: [ul],
				})
			},
			setOperation(selectNum, price) {
				return operation.floatMul(selectNum, price || 0)
			},
			getRefundStatus(item) {
				let tempMap = {
					1: '已申请',
					2: '已审核待退款',
					3: '已退款'
				}
				return tempMap[item]
			},
			getClick() {
				this.$emit('click')
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.public-item {
		color: #999999;
		font-size: 26rpx;
	}

	.order-information-contain {

		.goods-list {
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
			border-bottom: 1px dashed #EEEEEE;

			&:last-child {
				padding-bottom: 0rpx;
				margin-bottom: 0rpx;
				border-bottom: 0rpx;
			}

			.item-goods-list {
				display: flex;
			}



			.item-other {
				margin-left: 24rpx;
				display: flex;
				flex: 1;
				flex-direction: column;
				justify-content: space-around;


				.item-name {
					display: flex;
					justify-content: space-between;

					.item-text {
						color: #303133;
						font-size: 28rpx;
					}

					.item-price {
						color: #FF5D35;
						font-size: 28rpx;
					}

					.item-show {
						color: #002FA5;
						font-size: 28rpx;
					}

				}

				.item-cost {

					.item-text-price {
						color: #303133;
						font-size: 26rpx;
						margin-left: 20rpx;
					}
				}

				.item-status-name {
					text-align: right;
					font-size: 28rpx;
					color: #909199;
				}

				.status-name-waiting {
					color: #FF5D35;
				}

				.item-specifications {
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}

	.desc {
		color: #909199;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
</style>
