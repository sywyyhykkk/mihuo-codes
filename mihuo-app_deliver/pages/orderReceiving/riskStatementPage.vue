<template>
	<view class="risk-statement-page">
		<view class="risk-statement-list" v-if="list.length > 0">
			<view class="item-title">
				风险提示
			</view>
			<view class="item-list" v-for="(item,index) in list" :key="index">
				<view class="item-other">
					<text class="item-index">{{index +1}}.</text>
					<text class="item-name">{{item.name}}</text>
				</view>
				<view class="image-contian" v-if="item.attachments !== '[]'">
					<image-show width="110" height="110" :imgSrc="item.attachments"></image-show>
				</view>
			</view>
		</view>
		<mh-empty v-else title="这里空荡荡哒～" />
		<bottom-button title="新增风险项" @click="addRisk()"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				list: []
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {
			this.getList()
		},
		onLoad(option) {
			this.option = option

		},
		methods: {
			addRisk() {
				this.toPage(
					`/pages/orderReceiving/addRiskStatement?orderId=${this.option.orderId}&beforeOrderId=${this.option.beforeOrderId}`
				)
			},
			getList() {
				this.$httpApi.getOrderRisk({
					id: this.option.beforeOrderId  !== 'undefined' ? this.option.beforeOrderId : this.option.orderId,
				}).then(res => {
					if (res) {
						this.list = res
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/deep/.u-empty{
		padding-top: 260rpx;
		margin-top: 0rpx !important;
	}
	
	.risk-statement-page {
		background: #FFFFFF;
		border-radius: 10rpx;
		min-height: 80vh;
		margin: 20rpx;

		.risk-statement-list {
			padding: 40rpx;

			.item-title {
				font-size: 28rpx;
				color: #303133;
				margin-bottom: 16rpx;
			}

			.item-list {
				margin-bottom: 30rpx;

				.item-other {

					.item-index,
					.item-name {
						font-size: 28rpx;
						color: #606166;
					}
				}
				
				.image-contian{
					margin-top: 16rpx;
				}
			}
		}
	}

	/* @import url(); 引入css类 */
</style>
