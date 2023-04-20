<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.page-top {
		position: -webkit-sticky;
		position: sticky;
		width: 100%;
		top: 0rpx;
		z-index: 99;
		// top: calc(88rpx + var(--status-bar-height));

	}

	.custom-search {
		background-color: #fff;
		padding: 20rpx 30rpx;

		/deep/ .serach {
			width: 100%;

			.content {
				height: 72rpx;
			}
		}

	}

	.flex-align-contain {
		display: flex;
		align-items: center;
	}

	.flex-contain {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.type-contian {
		position: -webkit-sticky;
		position: sticky;
		width: 100%;
		// top: calc(88rpx + var(--status-bar-height));
		// top: calc(var(--status-bar-height));
		top: 0rpx;
		z-index: 99;
		justify-content: space-around;
		background-color: #fff;
	}

	.list-contian {
		margin-top: 14rpx;

		.swipe-action {
			margin-bottom: 6rpx;
		}

		.item-details {
			border-radius: 10rpx;
			background: #FFFFFF;
			display: flex;
			flex-direction: column;
			padding: 40rpx 46rpx;


			.price-unit {
				font-size: 24rpx;
				color: #FF5D35;
			}

			.order-name {
				margin-bottom: 10rpx;
				display: flex;
				justify-content: space-between;

				.item-left {
					font-size: 32rpx;
					color: #303133;
					max-width: 500rpx;
					font-weight: bold;
				}



				.total-price {
					color: #FF5D35;
					font-size: 36rpx;
					line-height: 40rpx;
				}
			}

			.top {
				justify-content: space-between;
				margin-bottom: 10rpx;

				.item-name {
					font-size: 26rpx;
					color: #303133;
					margin-right: 12rpx;
				}

				.item-Address {
					font-size: 26rpx;
					color: #303133;
				}


				.total-default {
					font-size: 24rpx;
					white-space: nowrap;
					// margin-left: 20rpx;
				}

				.total-success {
					color: #319D75;
				}

				.total-warring {
					color: #FF5D35;
				}

				.item-right {
					display: flex;
					align-items: center;
					margin-left: 20rpx;
				}

			}

			.middle {
				margin-bottom: 12rpx;
				display: flex;
				justify-content: space-between;

				.item-created {
					color: #909199;
					font-size: 26rpx;
					line-height: 32rpx;
				}


			}

			.bottom {
				// justify-content: space-between;

				.item-price {
					vertical-align: bottom;

					.price-name {
						color: #909199;
						font-size: 28rpx;
						margin-right: 8rpx;
					}

					.price-unm {
						color: #303133;
						font-size: 28rpx;

					}
				}
			}

		}
	}

	.icon-right {
		width: 12rpx;
		height: 14rpx;
	}

	.item-other {
		// flex: 1;
		width: 220rpx;
	}

	.public-arrow {
		width: 12rpx;
		height: 14rpx;
		margin-left: 10rpx;
	}

	.modal-label-contain {
		display: flex;
		justify-content: center;
		flex-direction: column;

		.label {
			display: flex;
			justify-content: center;
			font-size: 28rpx;
			color: #999999;
		}
	}
</style>

<template>
	<view class="billing-list">
		<view class="page-top">
			<view class="custom-search">
				<mihuo-search button="inside" @search="getSearch"></mihuo-search>
			</view>
			<view class="type-contian " v-if="!option.pageType">
				<u-tabs :list="typeList" :is-scroll="false" :current="typeListIndex" @change="getType"
					active-color="#002FA5" inactive-color="#606166" font-size="26"></u-tabs>
			</view>
		</view>
		<view class="list-contian">
			<uni-swipe-action>
				<uni-swipe-action-item class="swipe-action" v-for="(item, index) in list" :right-options="options"
					@click="clickOption($event,index)">
					<view class="title-wrap item-details" @click="getDetails(item)">
						<view class="order-name">
							<text class="item-left" v-if="item.name">{{item.name}}</text>
							<view class="item-price">
								<text class="total-price">{{item.price}}</text>
								<text class="price-unit">元</text>
							</view>
						</view>
						<view class="top flex-align-contain">
							<view class="item-left">
								<text class="item-name">{{item.customerName }}</text>
								<text class="item-Address">{{item.customerAddress }}</text>
							</view>
							<!-- 支付状态(0未支付<默认>，1已支付，2待支付) -->
							<view class="item-right">
								<!-- 快速预算 -->
								<text v-if="!option.pageType" class="total-default total-success"
									:class="[item.status == 0 ? 'total-warring':'']">{{item.status == 0 ? '未开单':'已开单'}}</text>
								<!-- 快速开单 -->
								<text v-if="option.pageType == '快速开单' && item.payStatus == 0 " class="total-default "
									:class="[item.payStatus == 0 ? 'total-warring':'total-success']">{{item.payStatus == 0 ? '未开单':'已开单'}}</text>
								<text v-if="option.pageType == '快速开单' && item.payStatus !== 0 " class="total-default "
									:class="[item.payStatus == 2 ? 'total-warring':'total-success']">{{
										item.payStatus == 2 ? '待支付':'已开单'
									}}</text>
								<image v-if="option.pageType == '快速开单' && item.payStatus !== 0 "
									src="/static/images/bottom-icon.png" class="public-arrow"></image>
							</view>
						</view>
						<view class="middle">
							<text class="item-created">{{item.created}}</text>
							<!-- <text class="total-default total-success"
								:class="[item.status == 0 ? 'total-warring':'']">{{item.status == 0 ? '未开单':'已开单'}}</text> -->
						</view>
						<view class="bottom flex-align-contain" v-if="item.groupNameList">
							<view class="item-price flex-align-contain item-other"
								v-for="(en,num) in item.groupNameList" :key="num">
								<text class="price-name ">{{en.topName}}</text>
								<text class="price-num ">{{en.num}}</text>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<mihuo-bottom-button :buttonList="setButtonList" @click="getAdd()"></mihuo-bottom-button>
		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="没有记录～～" />


		<!-- 角色弹框 -->
		<role-pop-up v-model="roleShowPopup" @close="roleShowPopup = false" @click="getClick"></role-pop-up>
		<!-- 认证弹框 -->
		<modal-new :shutDown="true" v-model="certificationShowPrompt" @click="confirm()" @cancel="modalCancel()"
			titleText="温馨提示" cancelText="取消认证" confirmText="去认证">
			<view class="modal-label-contain">
				<view class="label">完成{{this.isRealName ? '技能':'实名'}}认证后才能开单</view>
				<view class="label">是否去认证？</view>
			</view>
		</modal-new>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				typeListIndex: 0,
				pageSize: 20,
				pageCurrent: 1,
				backupPageCurrent: 1,
				total: 0,
				status: 'nomore',
				typeStatus: '',
				list: [],
				options: [{
					text: '复制',
					style: {
						backgroundColor: '#002FA5'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				buttonList: [{
					name: '新增预算',
					status: true
				}],
				typeList: [{
					name: '全部',
					value: ''
				}, {
					name: '已开单',
					value: 1
				}, {
					name: '未开单',
					value: 0
				}],
				search: '',
				roleShowPopup: false,
				certificationShowPrompt: false,
				isRealName: false
			}
		},
		computed: {
			setButtonList() {
				if (this.option.pageType) {
					return [{
						name: '新增开单',
						status: true
					}]
				} else {
					return [{
						name: '新增预算',
						status: true
					}]
				}
			}
		},
		mounted() {

		},
		onShow() {
			setTimeout(() => {
				this.getList()
			}, 200)
			this.setTitle()
		},
		onLoad(option) {
			this.setStore()
			this.option = option
		},
		onUnload() {
			// this.$store.commit('setSkuIdList', [])
			uni.setStorageSync('billingName', '')
			this.$store.commit('setShoppingCart', [])
		},
		onReachBottom() {
			if (this.list.length < this.total) {
				this.pageCurrent++
				this.getList()
			}
		},
		methods: {
			setStore() {
				this.$storeSetProjectInfo({})
				this.$storeOrderInfo({})
				this.$store.commit('setUserRole', '')
			},
			getSearch(search) {
				this.search = search == '请输入关键字搜索' ? '' : search
				this.getList()
			},
			setTitle() {
				if (this.option.pageType) {
					uni.setNavigationBarTitle({
						title: '快速开单'
					})
				}
			},
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			clickOption(content, index) {
				if (content.index) { // 删除
					if (this.list[index].id) {
						if (this.option.pageType) {
							if (this.list[index].payStatus !== 0) {
								this.$util.toast('已开单的不能删除~')
								return
							}
						} else {
							if (this.list[index].status == 1) {
								this.$util.toast('已开单的不能删除~')
								return
							}
						}
						this.$httpApi.deleteMulationQuote({
							id: this.list[index].id
						}).then(res => {
							if (res) {
								this.getList()
							}
						})
					}
				} else { // 复制
					this.$httpApi.copyMulationQuote({
						id: this.list[index].id
					}).then(res => {
						if (res) {
							this.getList()
						}
					})
				}
			},
			getType(index) {
				this.typeListIndex = index
				this.typeStatus = this.typeList[index].value
				this.getList()
			},
			getList() {
				const parameter = this.typeStatus === '' ? {
					size: this.pageSize,
					current: this.pageCurrent,
					name: this.search,
					type: this.option.pageType ? 1 : 0, // 类型（0快速预算<默认>，1快速开单）
					'orders[0].column': 'created',
					'orders[0].asc': false
				} : {
					size: this.pageSize,
					status: this.typeStatus,
					current: this.pageCurrent,
					name: this.search,
					type: this.option.pageType ? 1 : 0, // 类型（0快速预算<默认>，1快速开单）
					'orders[0].column': 'created',
					'orders[0].asc': false
				}
				this.$httpApi.mulationQuotePage(parameter).then(res => {
					if (res) {
						this.total = res.total
						if (this.option.pageType) {
							res.records = res.records.filter(item => item.addressId != 0)
						}
						res.records.forEach(el => {
							el['show'] = false
							if (this.$isJSON(el.groupName)) {
								el['groupNameList'] = JSON.parse(el.groupName)
							}
						})
						if (this.pageCurrent > 1) {
							if (this.pageCurrent !== this.backupPageCurrent) {
								this.list = this.list.concat(res.records)
								this.backupPageCurrent = this.pageCurrent
							}
						} else {
							this.list = res.records
							this.backupPageCurrent = this.pageCurrent
						}
					}
				})
			},
			getAdd() {
				if (this.option.pageType) {
					this.toPage(
						`/pages/construction/clientBilling/billingDetails?pageType=${this.option.pageType ? 2 : 1 }`
					)
					// this.roleShowPopup = true
					// this.toPage(`/pages/quickBilling/billingDetails?pageType=${this.option.pageType}`)
				} else {
					this.toPage(`/pages/quickBilling/billingDetails`)
				}
			},
			/**
			 * @param {Number} type 类型（0快速预算<默认>，1快速开单）
			 * @param {Number} status   状态(0未确认<默认>，1已确认)
			 * @param {Number} payStatus   支付状态(0未支付<默认>，1已支付，2待支付)
			 * */
			getDetails(item) {
				if (item.type == 1) {
					if (item.payStatus !== 0) {
						this.toPage(`/pages/quickBilling/billingRecord?detailId=${item.id}`)
					} else {
						uni.setStorageSync('billingName', item.name)
						this.toPage(
							`/pages/quickBilling/quickBillingDetails?detailId=${item.id}`)
					}
				} else {
					uni.setStorageSync('billingName', item.name)
					this.toPage(`/pages/quickBilling/billingDetails?detailId=${item.id}`)
				}
			},
			getClick(item) {
				if (item.auditStatus == 2) {
					this.toPage(
						`/pages/construction/clientBilling/billingDetails?pageType=${this.option.pageType ? 2 : 1 }&skillId=${item.skillId}`
					)
				} else {
					this.certificationShowPrompt = true
				}
			}
		}
	}
</script>
