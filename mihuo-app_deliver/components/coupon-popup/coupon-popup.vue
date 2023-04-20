<template>
	<mihuo-popup ref="mihuoPopup" title="优惠券" height="1000" mode="bottom" v-model="showPopup" @close="close()"
		:buttonShow="true" @confirm="confirm" buttonShow :buttonList="buttonList">
		<view class="coupon-list" slot="other">
			<view class="item-coupon" v-for="(item,index) in list" :key="index">
				<view v-if="item.coupon" class="left display-center">
					<!-- 优惠券类型；0->满减；1->折扣 -->
					<view v-if="item.coupon.type == 0" class="item-top">
						<view class="item-other">
							<text class="character">¥</text>
							<text class="price">{{item.coupon.amount}}</text>
						</view>
						<view class="tips">
							满{{ item.coupon.minPoint }}可用
						</view>
					</view>
					<view v-if="item.coupon.type == 1" class="item-top">
						<text class="price">{{ Number(item.coupon.amount) * 10 }}</text>
						<text class="unit">折</text>
					</view>
				</view>
				<view v-if="item.coupon" class="right">
					<view class="item-name">
						<text class="name">{{item.coupon.name}}</text>
						<text v-if="item.coupon.endTime" class="time">有效期 {{ item.coupon.startTime }}至
							{{item.coupon.endTime}}</text>
						<view class="color-text">
							{{ item.coupon.useType === 0 ? '全场通用' : item.coupon.useType === 1 ? '指定分类可用' : '指定商品可用' }}
							<text class="limitation">
								{{ item.coupon.minPoint ? `满${item.coupon.minPoint}元可用` : '无门槛' }}
							</text>
						</view>
					</view>
					<view class="select">
						<u-checkbox shape="circle" v-model="item.checkbox" @change="checkboxChange(item)">
						</u-checkbox>
					</view>
				</view>
			</view>
		</view>
	</mihuo-popup>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => []
			},
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				option: {},
				showPopup: false,
				checkbox: false,
				buttonList: [{
					name: '确认'
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
			},
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			init() {
				this.showPopup = true
			},
			open() {
				this.$nextTick(() => {
					this.init()
					this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('close')
					this.showPopup = false
				})
			},
			checkboxChange(event) {
				this.list.forEach(item => {
					if (item.id !== event.id) {
						item.checkbox = false
					} else {
						item.checkbox = true
					}
				})
				
				this.$forceUpdate()
				
			},
			confirm() {
				let result = this.list.find(item => item.checkbox)
				let resutlId = result ? result.coupon.id : ''
				this.$emit('confirm', resutlId)
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.coupon-list {
		padding: 40rpx 16rpx;
	}

	.item-coupon {
		display: flex;
		margin-bottom: 16rpx;
		border: 2rpx solid #F6F6F6;

		&:last-child {
			margin-bottom: 0rpx;
		}

		.left {
			width: 220rpx;
			height: 232rpx;
			background-color: #FDF3F2;

			.item-top {

				.character {
					font-size: $middleFontSize;
					color: #E14636;
				}

				.tips {
					color: #E14636;
					font-size: 24rpx;
				}

				.price {
					font-size: 50rpx;
					color: #E14636;
				}

				.unit {
					font-size: 34rpx;
					color: #E14636;
					margin-left: 4rpx;
				}
			}


		}

		.right {
			padding: 34rpx 32rpx;
			display: flex;
			flex: 1;
			justify-content: space-between;
			// width: 100%;

			.item-name {
				display: flex;
				flex-direction: column;

				.name {
					color: $seconFontColor;
					font-size: 30rpx;
				}

				.time {
					margin-top: 8rpx;
					color: $viceFontColor;
					font-size: $fontSize26;
				}

				.color-text {
					margin-top: 8rpx;

					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #ED3832;

					.limitation {
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #999999;
						margin-left: 20rpx;
					}
				}
			}

			.select {
				display: flex;
				align-items: center;
			}
		}

	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
