<template>
	<view class="deposit-page">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#fff" fontColor="#333333">
			<view slot="default" class="nav-bar-title">
				质保金管理
			</view>
			<view slot="right" class="nav-bar-right" @click="cutView()">
				<!-- 质保金说明 -->
			</view>
		</z-nav-bar>

		<view class="statistics-contain">
			<view class="top-contain">
				<view class="top-left">
					<view class="name">总金额(元)</view>
					<view class="tag" v-if="setPrice() > 0">未缴清</view>
				</view>
				<view class="top-right">
					<text class="name">缴费工种:{{userDetails.maxRetentionSkillName}}</text>
				</view>
			</view>
			<view class="price-contain">
				<text class="price-text">{{userDetails.retentionAmount}}</text>
				<text class="price-no">(未缴{{setPrice()}})</text>
			</view>
			<view class="button-contian">
				<view class="item-button" v-for="(item,index) in buttonList"
					:class="[item.display ? 'item-button-display':'']" :key="index" @click="getButton(item)">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="data-contain">
			<view class="tab-list">
				<view class="item-tab" :class="[current == index ? 'item-tab-active':'']"
					v-for="(item,index) in tabList" @click="getTab(index,item)" :key="index">
					{{item.name}}
				</view>
			</view>
			<view class="list-contain">
				<view class="item-contain" v-for="(item,index) in list" :key="index">
					<view class="item-top">
						<u-avatar class="icon-image" :src="$util.avatarImage(item.userId)" size="24">
						</u-avatar>
						<text class="item-name">{{getUserName(item)}}</text>
					</view>
					<view class="item-middle">
						<text class="item-left">{{item.summary}}</text>
						<text class="item-right"
							:class="[item.type > 0 ? 'item-right-warning':'']">{{item.amount}}</text>
					</view>
					<view class="item-bottom">
						<text class="item-time">{{item.applyTime}}</text>
						<text class="item-status-name">{{setOrderStatus(item)}}</text>
					</view>
				</view>
				<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="没有记录～～" />
			</view>
		</view>

	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		data() {
			return {
				buttonList: [{
					name: '申请退款',
					display: false,
				}, {
					name: '质保金充值',
					display: false,
				}],
				option: {},
				current: 0,
				userDetails: '',
				list: [],
				status: 0,
				tabList: [{
					name: '全部',
					value: 0
				}, {
					name: '转入',
					value: 1
				}, {
					name: '转出',
					value: 2
				}, {
					name: '退款中',
					value: 3
				}]
			}
		},
		computed: {


		},
		mounted() {

		},
		onShow() {
			this.retentionAccount()
			this.getMyRetentionRecords()
			
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			setButtonList() {
				if (this.userDetails.maxRetentionAmount <= this.userDetails.retentionAmount) {
					this.buttonList.forEach(el => {
						if (el.name == '质保金充值') {
							el.display = true
						}
					})
				}
			},
			getUserName(item) {
				// 类型 (1=用户充值，2=管理员充值，3=工费扣除，-1=用户申请退款，-2=管理员申请退款，其它=全部)
				if (uni.getStorageSync('userData').sysUser.userId = item.userId) {
					return '本人'
				} else {
					return '平台'
				}
			},
			setOrderStatus(item) {
				const tempResultMap = {
					0: '已申请',
					1: '已申请',
					2: '已完成',
					3: '已拒绝',
				}
				return tempResultMap[item.status]
			},
			setPrice() {
				if (this.userDetails.maxRetentionAmount > this.userDetails.retentionAmount) {
					return operation.floatSub(this.userDetails.maxRetentionAmount, this.userDetails.retentionAmount)
				} else {
					return 0
				}
			},
			getButton(item) {
				if (item.display) {
					this.$util.toast("质保金已缴清~");
					return
				}

				if (this.userDetails) {
					this.toPage(
						`/pages/mine/deposit/recharge?typeName=${item.name}&amount=${this.setPrice()}&retentionAmount=${this.userDetails.retentionAmount}`
					)
				}

			},
			getTab(index, item) {
				this.current = index
				this.status = item.value
				this.getMyRetentionRecords()
			},
			retentionAccount() {
				this.$httpApi.retentionAccount().then(res => {
					if (res) {
						this.userDetails = res
						this.setButtonList()
					}
				})
			},
			getMyRetentionRecords() {
				this.$httpApi.getMyRetentionRecords({
					status: this.status,
					size: 20
				}).then(res => {
					if (res) {
						this.list = res.records
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.deposit-page {
		padding-bottom: 100rpx;

		.nav-bar-right {
			font-size: 28rpx;
			color: #333333;
			padding-right: 34rpx;
		}

		.statistics-contain {
			margin-top: 12rpx;
			border-radius: 10rpx;
			background: #FFFFFF;
			padding: 48rpx 42rpx 46rpx 42rpx;

			.top-contain {
				display: flex;
				justify-content: space-between;

				.top-left {
					display: flex;
					align-items: center;

					.name {
						color: #909199;
						font-size: 28rpx;
						margin-right: 4rpx;
					}

					.tag {
						margin-left: 4rpx;
						font-size: 24rpx;
						color: #FF5D35;
						display: inline-block;
						border: 1rpx solid #FF5D35;
						width: 90rpx;
						height: 34rpx;
						text-align: center;
						line-height: 34rpx;
						border-radius: 4rpx;
					}
				}

				.top-right {
					.name {
						color: #909199;
						font-size: 28rpx;
					}

					image {
						width: 32rpx;
						height: 32rpx;
					}
				}
			}

			.price-contain {
				margin-top: 7rpx;
				margin-bottom: 32rpx;

				.price-text {
					color: #303133;
					font-size: 32rpx;
				}

				.price-no {
					color: #909199;
					font-size: 24rpx;
					margin-left: 6rpx;
				}
			}

			.button-contian {
				display: flex;
				justify-content: space-between;

				.item-button {
					width: 252rpx;
					height: 64rpx;
					text-align: center;
					line-height: 64rpx;
					font-size: 28rpx;
					border-radius: 10rpx;

					&:nth-of-type(1) {
						background-color: rgba(0, 47, 165, 0.1);
						color: #002FA5;
					}

					&:nth-of-type(2) {
						background-color: #002FA5;
						color: #fff;
					}
				}

				.item-button-display {
					opacity: 0.5;
				}
			}
		}

		.data-contain {
			margin-top: 12rpx;

			.tab-list {
				padding: 50rpx 44rpx;
				border-radius: 16rpx 16rpx 0rpx 0rpx;
				display: flex;
				justify-content: space-between;
				background-color: #fff;

				.item-tab {
					color: #909299;
					font-size: 30rpx;
				}

				.item-tab-active {
					color: #002FA5;
					font-size: 30rpx;
				}

			}

			.list-contain {
				margin-top: 2rpx;

				.item-contain {
					padding: 32rpx 60rpx 30rpx 30rpx;
					display: flex;
					flex-direction: column;
					margin-top: 2rpx;
					margin-bottom: 4rpx;
					background-color: #fff;

					.item-top {
						display: flex;
						align-items: center;

						.item-name {
							color: #B4B6BA;
							font-size: 24rpx;
							margin-left: 8rpx;
						}
					}

					.item-middle {
						display: flex;
						justify-content: space-between;
						margin-top: 24rpx;
						margin-bottom: 4rpx;

						.item-left {
							font-size: 28rpx;
							color: #303133;
						}

						.item-right {
							font-size: 36rpx;
							color: #303133;
							font-weight: bold;
						}

						.item-right-warning {
							font-size: 28rpx;
							color: #FF5D35;
						}
					}

					.item-bottom {
						display: flex;
						justify-content: space-between;

						.item-time {
							font-size: 26rpx;
							color: #B4B6BA;

						}

						.item-status-name {
							font-size: 26rpx;
							color: #909199;
						}
					}
				}
			}
		}

	}
</style>
