<template>
	<view class="insurance-record">
		<view class="list-contain" v-if="list.length > 0">
			<view class="item-contian" v-for="(item,index) in list" :key="index" @click="getDetails(item)">
				<view class="other-contain">
					<view class="item-top">
						<text class="item-name">{{item.setmealAmount}}元起{{item.setmealName}} </text>
						<text class="item-status">{{setOrderStatus(item)}}</text>
					</view>
					<view class="item-term">
						<view class="item-label">保险期限</view>
						<view class="item-value">{{item.insuranceTime}} <text
								class="item-status-other">{{setOtherOrderStatus(item)}}</text></view>
					</view>
					<view class="item-time item-term">
						<view class="item-label">下单时间</view>
						<view class="item-value">{{item.createTime}}</view>
					</view>
				</view>
				<view class="button-contain">
					<view class="item-contain" v-for="(en,index) in setButton()" :key="index"
						@click.stop="getButton(item)">
						{{en.name}}
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="没有记录～～" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				defaultCompanyId: '',
				list: [],
				pageSize: 20,
				current: 1,
				total: 0,
				otherCurrent: 0,
				button: [{
					name: '联系客服'
				}]
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {
			this.getInsuranceSetmealOrderList()
		},
		onLoad(option) {
			this.option = option
			this.setCurrentCompanyId()
		},
		onReachBottom() {
			if (this.list.length < this.total) {
				this.current++
				this.getInsuranceSetmealOrderList()
			}
		},
		methods: {
			getInsuranceSetmealOrderList() {
				this.$httpApi.getInsuranceSetmealOrderList({
					size: this.pageSize,
					current: this.current
				}).then(res => {
					if (res) {
						this.total = res.total
						if (this.current > 1) {
							if (this.otherCurrent !== this.current) {
								this.list = this.list.concat(res.records)
								this.otherCurrent = this.current
							}
						} else {
							this.list = res.records
							this.otherCurrent = this.current
						}
					}
				})
			},
			setCurrentCompanyId() {
				this.$http.get(`admin/cityoperator/${uni.getStorageSync('cityOperatorId')}`).then(res => {
					if (res) {
						this.defaultCompanyId = res.id
					}
				})
			},
			setButton() {
				return this.button
			},
			setOrderStatus(item) {
				const tempResultMap = {
					0: '未支付',
					1: '已支付',
					2: '待生效',
					3: '生效中',
					4: '已过保',
				}
				return tempResultMap[item.insuranceStatus]
			},
			setOtherOrderStatus(item) {
				// refundStatus 0=未退款； 1=已申请； 2=已审核待退款； 3=已退款；4=退款失败
				const tempResultMap = {
					1: '已申请',
					2: '已审核待退款',
					3: '已退款',
					4: '退款失败',
				}
				return tempResultMap[item.refundStatus]
			},
			getButton(item) {
				this.$util.goToChat(this.defaultCompanyId, '', 'insurance', item.id, 1)
			},
			getDetails(item) {
				this.toPage(`/pages/mine/Insurance/recordDetails?id=${item.id}&type=详情&orderCode=${item.orderCode}`)
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.insurance-record {
		padding: 8rpx 20rpx 100rpx 20rpx;

		.item-contian {
			padding: 38rpx;
			border-radius: 16rpx;
			background: #FFFFFF;
			margin-bottom: 28rpx;

			.item-top {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item-name {
					color: #303133;
					font-size: $middleFontSize;
				}

				.item-status {
					color: #002FA5;
					font-size: $middleFontSize;
				}

			}


			.item-term {
				margin-top: 14rpx;
				display: flex;
				align-items: center;

				.item-label {
					color: #909199;
					font-size: 26rpx;
					margin-right: 10rpx;
				}

				.item-value {
					color: $seconFontColor;
					font-size: 26rpx;
					display: flex;
					flex: 1;
					justify-content: space-between;
					align-items: center;
				}

				.item-status-other {
					color: #303133;
					font-size: $middleFontSize;
					// margin-right: 10rpx;
				}
			}

			.button-contain {
				margin-top: 26rpx;
				border-top: 1px solid #F6F6F6;
				padding-top: 30rpx;
				display: flex;

				.item-contain {
					width: 140rpx;
					height: 54rpx;
					line-height: 54rpx;
					text-align: center;
					border: 1rpx solid #002FA5;
					border-radius: 10rpx;
					margin-right: 22rpx;
					font-size: 24rpx;
					color: #002FA5;
				}
			}

		}
	}
</style>
