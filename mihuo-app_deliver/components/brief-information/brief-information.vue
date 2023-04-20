<template>
	<view v-if="setDetailedList.length" class="brief-information-pages">
		<view class="list-contian" :class="[ source == 1 ? 'list-contian-no':'' ]">
			<view class="item-contain" v-for="(item,index) in setDetailedList" :key="index" @click="getDetails(item)">
				<text class="item-text">{{item.label}}</text>
				<image class="icon-image" src="/static/images/double_chevron.png" mode=""></image>
			</view>
		</view>

		<!-- 弹框 -->
		<u-popup v-model="showPopup" border-radius="30" height="1000" mode="bottom" :safe-area-inset-bottom="false"
			:closeable="true">
			<view class="criteria-contian">
				<view class="tittle">
					{{title}}
				</view>
				<view class="list-contain">
					<scroll-view :scroll-y="true" class="scroll-Y">
						<view class="price-contain-all" v-if="title == '价格清单'">
							<view class="price-title" v-if="priceList.length > 0 ">
								费用明细
							</view>
							<view class="price-list-contain" v-if="priceList.length > 0 ">
								<view class="list-contain-all" v-for="(item ,index) in priceList" :key="index">
									<view v-if="item.products.length > 0">
										<view class="item-quotation-contain" v-for="(el,num) in item.products"
											:key="num">
											<view class="item-top">
												<view class="top-left">
													<text class="item-index">0{{num+1}}.</text>
													<text class="item-name"
														@click="getAcceptanceCriteria(el)">{{el.productName}}</text>
												</view>
												<view class="top-right">
													<text class="item-specifications"><text
															class="item-symbol">￥</text>{{el.price}}</text>
												</view>
											</view>
											<view class="item-bottom">
												<text class="item-total-price"><text class="item-symbol"
														v-if="setFloatMul(el.price ,el.orderNum)">￥</text>
													{{setFloatMul(el.price ,el.orderNum)}}</text>
												<text class="item-total-num"><text
														class="item-symbol">x</text>{{el.orderNum}}</text>
											</view>

											<!-- <view class="left">
											<text class="item-index">0{{num+1}}.</text>
											<text class="item-name"
												@click="getAcceptanceCriteria(el)">{{el.productName}}</text>
											<text class="item-specifications">{{el.price}}X{{el.quantity}}</text>
										</view>
										<view class="right">
											{{setFloatMul(el.price ,el.quantity)}}
										</view> -->
										</view>
										<view class="item-total">
											<view class="item-total-left">
												共计{{item.products.length}}个项目
											</view>
											<view class="item-total-right">
												<text class="item-text">合计</text>
												<text class="item-price">{{item.totalPrice}}</text>
												<text class="item-unit">元</text>
											</view>
										</view>
									</view>

								</view>
							</view>
							<mh-empty v-else title="这里空荡荡哒～" />
						</view>
						<view class="acceptance-criteria-contian" v-if="title == '验收标准'">
							<view class="sku-acceptance-contain" v-if="skuAcceptance.length > 0">
								<view class="sku-acceptance" v-if="skuAcceptance.length > 0">
									<view class="item-acceptance" v-for="(item,index) in skuAcceptance" :key="index">
										<view class="item-product-name">
											<image src="/static/images/standard.png" mode=""></image>
											<text class="item-product-name-text">{{item.productName}}</text>
										</view>
										<view class="item-checkStandard" v-for="(ev,num) in item.checkStandard"
											:key="num">
											<view class="item—other">
												<view class="item-index">0{{index+1}}</view>
												<text class="item-name">{{ev.title}}</text>
											</view>
											<view class="item-description">
												<text class="item-name">{{ev.description}}</text>
											</view>

											<view class="image-contain">
												<u-lazy-load v-if="ev.processPic" class="item-image" height="188"
													:style="{ width: '188rpx' }" @click="preview(ev.processPic)"
													imgMode="aspectFill" border-radius="10"
													:image="$util.thumbnailImage(ev.processPic ,true)">
												</u-lazy-load>
											</view>
										</view>
									</view>
								</view>
								<mh-empty v-else title="这里空荡荡哒～" />
							</view>
							<view class="sku-acceptance-contain" v-if="acceptanceItemTemplateList.length > 0">
								<view class="sku-acceptance" v-if="acceptanceItemTemplateList.length > 0">
									<view class="item-acceptance" v-for="(item,index) in acceptanceItemTemplateList"
										:key="index">
										<view class="item-checkStandard">
											<view class="item—other">
												<view class="item-index">0{{index+1}}</view>
												<text class="item-name">{{item.itemName}}</text>
											</view>
											<view class="item-description">
												<text class="item-name">{{item.standard}}</text>
											</view>
											<view class="image-contain" v-if="item.standardImg">
												<u-lazy-load v-if="item.standardImg" class="item-image" height="188"
													:style="{ width: '188rpx' }" @click="preview(item.standardImg)"
													imgMode="aspectFill" border-radius="10"
													:image="$util.thumbnailImage(item.standardImg ,true)">
												</u-lazy-load>
											</view>
										</view>
									</view>
								</view>
								<mh-empty v-if="acceptanceItemTemplateList.length == 0" title="这里空荡荡1哒～" />
							</view>
						</view>
						<view class="rejection-record" v-if="title == '拒单记录'">
							<view class="list-rejection-contain" v-if="rejectionRecordList.length > 0">
								<view class="item-record-cotain" v-for="(item,index) in rejectionRecordList"
									:key="index">
									<view class="item-left">
										<view class="node">
										</view>
									</view>
									<view class="item-right">
										<view class="item-top">
											<text class="refuse-title">拒绝{{item.personName}}师傅接单</text>
											<text class="refuse-time">{{item.timeNew}}</text>
										</view>
										<view class="item-bottom">
											拒绝原因:{{item.replaceReason}}
										</view>
									</view>
								</view>
							</view>
							<mh-empty v-else title="这里空荡荡哒～" />
						</view>
					</scroll-view>
				</view>
				<view class="item-button-contain" @click="confirmSubmit">
					<view class="item-button">
						我知道了
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	import operation from '@/plugins/mathoperation.js'
	export default {
		name: 'brief-information',
		props: {
			// priceList: { // 价格清单
			// 	type: Array,
			// 	default: function() {
			// 		return []
			// 	}
			// },
			source: {
				type: [String, Number],
				default: ''
			},
			rejectionRecord: { // 拒单记录
				type: Array,
				default: function() {
					return []
				}
			},
			workAcceptance: { // 工种验收标准
				type: Array,
				default: function() {
					return []
				}
			},
			orderId: {
				type: [String, Number],
				default: ''
			},
			pageType: {
				type: String,
				default: ''
			},
			skillId: {
				type: String,
				default: ''
			},
			projectId: {
				type: String,
				default: ''
			},
			biddingInfo: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				option: {},
				showPopup: false,
				title: '',
				skuAcceptance: [],
				acceptanceItemTemplateList: [],
				rejectionRecordList: [],
				priceList: [],
				priceDataList: [],
				detailedList: [{
					label: '价格清单',
					list: []
				}, {
					label: '拒单记录',
					list: []
				}, {
					label: '验收标准',
					list: []
				}],
			}
		},
		computed: {
			setDetailedList() {
				let resultList = this.detailedList
				if (this.source == 1) {
					resultList = resultList.filter(item => item.label == '拒单记录')
				}
				if(this.rejectionRecordList.length == 0){
					resultList = resultList.filter(item => item.label !== '拒单记录')
				}
				if(this.priceList.length == 0){
					resultList = resultList.filter(item => item.label !== '价格清单')
				}
				return resultList
			},
		},
		mounted() {
			this.getPriceList()
			this.getRejectionRecord()
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			setFloatMul(price, num) {
				if (num) {
					return operation.floatMul(price || 0, num)
				} else {
					return ''
				}
			},
			getPriceList() {
				if (!this.projectId) {
					return
				}
				this.$httpApi.typeByCondition({
					source: 4, // 组合报价来源（1订单，2变更订单，3项目预算，4材料管理）
					businessId: this.skillId,
					businessType: 1, // 人工 服务包 
					projectId: this.projectId,
					nodeId: -1
				}).then(res => {
					if (res) {
						this.priceList = []
						let tempResult = res.filter(item => item.name.includes('人工'))
						if (tempResult) {
							tempResult.forEach(el => {
								if (el.groupPrices) {
									el.groupPrices.forEach(ev => {
										ev.products = ev.products.filter(item => item.orderNum !==
											0)
										// if (ev.businessId == this.skillId) {
										// 	this.priceList.push(ev)
										// }
										// 已开单的数据
										ev.products.forEach(item2 => {
											this.priceDataList.push(item2)
										})
										this.priceList.push(ev)
									})
								}
							})
						}
					}
				})
			},
			
			getList() {
				this.$httpApi.typeByCondition({
					source: 4, // 组合报价来源（1订单，2变更订单，3项目预算，4材料管理）
					topName: '',
					projectId: this.projectId,
				}).then(res => {
					if (res) {

					}
				})
			},
			getDetails(item) {
				// 1.价格清单 =》只有单个工种时，使用底部弹框展示，多个工种时跳转页面展示
				// 2.拒单记录 =》弹框展示
				// 3.验收标准 =》0.1.只有单个sku 时 弹框展示验收标准、施工工艺、施工流程
				//              0.2.有多个商品时只展示sku的验收标准
				// 	            0.3.普通订单时显示工种验收标准
				switch (item.label) {
					case '价格清单':
						if (this.priceDataList.length > 1) {
							this.toPage(
								`/pages/orderReceiving/orderPriceList?orderId=${this.orderId}&pageType=${this.pageType}&skillId=${this.skillId}`
							)
						} else {
							this.showPopup = !this.showPopup
						}

						break
					case '拒单记录':
						this.showPopup = !this.showPopup
						if (this.orderId) {
							this.$httpApi.getOwnerGetByOrderId({
								orderId: this.orderId
							}).then(res => {
								if (res) {
									res.forEach(el => {
										el['timeNew'] = moment(el.updated).format('MMMDo HH:mm')
									})
									this.rejectionRecordList = res
								}
							})
						}
						break
					case '验收标准':
						if (this.priceList.length > 0) {
							this.getTemplate()
						} else {
							this.getWorkAcceptance()
						}
						this.showPopup = !this.showPopup
						break
				}
				this.title = item.label
			},
			getAcceptanceCriteria() {

			},
			getRejectionRecord(){
				if (this.orderId) {
					this.$httpApi.getOwnerGetByOrderId({
						orderId: this.orderId
					}).then(res => {
						if (res) {
							this.rejectionRecordList = res
						}
					})
				}
			},
			getTemplate(productIds) {
				let tempProductIds = []
				this.priceList.forEach(el => {
					if (el.businessId == this.skillId) {
						el.products.forEach(ev => {
							tempProductIds.push(ev.productId)
						})
					}
				})
				if (tempProductIds) {
					this.$httpApi.getProductAcceptanceList({
						productIds: tempProductIds.join(',')
					}).then(res => {
						if (res) {
							res.map(item => {
								item.checkStandard = item.checkStandard !== '' && JSON.parse(item
									.checkStandard)
							})
							this.skuAcceptance = res
						}
					})
				}
			},
			getWorkAcceptance() { // 根据工种id 查询出模板id
				if (this.skillId) {
					this.$httpApi.selectSysjobskill({
						skillId: this.skillId
					}).then(res => {
						if (res) {
							this.$httpApi.getTemplateById({ // 根据模板id查询出验收模板详情
								templateId: res.acceptanceTemplateId
							}).then(res => {
								if (res) {
									this.acceptanceItemTemplateList = res.acceptanceItemTemplateList
								}
							})
						}
					})
				}
			},
			confirmSubmit() {
				this.showPopup = !this.showPopup
			},
			clearCur() {

			},
			preview(url) {
				let tempUrl = this.$util.thumbnailImage(url, false)
				uni.previewImage({
					urls: [tempUrl],
				})
			}

		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.mh-empty-page {

		/deep/ .u-empty {
			padding-top: 80rpx !important;
			margin-top: 0 !important;
		}
	}

	.brief-information-pages {
		margin-top: 20rpx;

		.list-contian {
			display: flex;
			align-items: center;
			// justify-content: center;

			.item-contain {
				width: 204rpx;
				height: 62rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2rpx solid #EEEEEE;
				border-radius: 10rpx;
				margin-right: 16rpx;

				&:last-child {
					margin-right: 0rpx;
				}

				.item-text {
					font-size: 24rpx;
					color: #606166;
				}
			}
		}

		.list-contian-no {
			justify-content: initial;
			padding-left: 40rpx;
		}
	}

	.icon-image {
		width: 28rpx;
		height: 28rpx;
	}


	.criteria-contian {
		height: 100%;
		background-color: #FFF;

		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			margin: 0 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.list-contain {
			height: calc(100% - 220rpx);
			padding: 40rpx;
		}

		.scroll-Y {
			height: 100%;
		}


		.item-button-contain {
			position: fixed;
			display: flex;
			justify-content: center;
			width: 100%;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.item-button {
				position: relative;
				width: 624rpx;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				color: #002FA5;
				font-size: 24rpx;
				border: 2rpx solid #002FA5;
				border-radius: 10rpx;
				bottom: 20rpx;
			}
		}

		.price-contain-all {
			.price-title {
				font-size: 28rpx;
				color: #303133;
				margin-bottom: 20rpx;
			}

			.price-list-contain {

				.item-quotation-contain {
					display: flex;
					// justify-content: space-between;
					flex-direction: column;
					margin-bottom: 16rpx;

					.item-top {
						display: flex;
						justify-content: space-between;
						flex-direction: row;

						.top-left {
							.item-index {
								color: $viceFontColor;
								font-size: $smallFontSize;
								margin-right: 4rpx;
							}

							.item-name {
								color: $seconFontColor;
								font-size: $middleFontSize;
								margin-right: 8rpx;
								// border-bottom: 2rpx solid $seconFontColor;
								// padding-bottom: 2rpx;
								// text-decoration: underline;
							}
						}

						.top-right {
							.item-specifications {
								color: #303133;
								font-size: 28rpx;
							}
						}
					}

					.item-symbol {
						display: inline-block;
						transform: scale(0.85);
						font-size: 24rpx;
					}

					.item-bottom {
						display: flex;
						justify-content: space-between;
						flex-direction: row;
						padding-left: 28rpx;
						margin-top: 12rpx;


						.item-total-price {
							font-size: 30rpx;
							color: #FF5D35;

							.item-symbol {
								color: #FF5D35;
							}
						}

						.item-total-num {
							color: #303133;
							font-size: 24rpx;

							.item-symbol {
								color: #303133;
							}
						}
					}

					.left {
						.item-index {
							color: $viceFontColor;
							font-size: $smallFontSize;
							margin-right: 4rpx;
						}

						.item-name {
							color: $seconFontColor;
							font-size: $middleFontSize;
							margin-right: 8rpx;
							border-bottom: 2rpx solid $seconFontColor;
							padding-bottom: 2rpx;
							// text-decoration: underline;
						}

						.item-specifications {
							color: $viceFontColor;
							font-size: $smallFontSize;
						}
					}

					.right {
						font-size: $middleFontSize;
						color: $errorFontColor;
					}
				}

				.item-total {
					background: #F9F9F9;
					border-radius: 10rpx;
					padding: 0rpx 18rpx;
					height: 84rpx;
					line-height: 84rpx;
					display: flex;
					justify-content: space-between;
					margin-bottom: 20rpx;

					.item-total-left {
						font-size: 24rpx;
						color: #909199;
					}

					.item-total-right {

						.item-text {
							font-size: 24rpx;
							color: #909199;
						}

						.item-price {
							font-size: 46rpx;
							color: #FF5D35;

						}

						.item-unit {
							font-size: 24rpx;
							color: #FF5D35;
						}
					}
				}
			}
		}

		.acceptance-criteria-contian {
			.sku-acceptance {

				.item-acceptance {
					margin-bottom: 60rpx;

					.item-product-name {
						display: flex;
						align-items: center;
						margin-bottom: 26rpx;

						image {
							width: 30rpx;
							height: 30rpx;
							margin-right: 16rpx;
						}

						.item-product-name-text {
							font-size: 28rpx;
							color: #303133;
						}
					}

					.item-checkStandard {
						display: flex;
						margin-bottom: 26rpx;
						flex-direction: column;

						.item—other {
							display: flex;
							margin-bottom: 14rpx;
						}

						.image-contain {
							padding-left: 40rpx;
						}

						.item-description {
							padding-left: 40rpx;
							margin-bottom: 20rpx;
						}

						.item-index {
							font-size: 24rpx;
							color: #909199;
							margin-right: 12rpx;
							padding-top: 6rpx;
						}

						.item-name {
							font-size: 28rpx;
							color: #606166;
						}
					}

				}

			}
		}

		.rejection-record {
			padding: 20rpx;

			.item-record-cotain {
				display: flex;

				&:last-child {
					.item-bottom {
						margin-bottom: 0rpx !important;
					}
				}

				.item-left {
					width: 40rpx;
					border-left: 2rpx dashed #C4C4C4;
					position: relative;

					.node {
						position: absolute;
						left: -14rpx;
						width: 26rpx;
						height: 26rpx;
						background-color: #fff;
						border-radius: 50%;
						border: 6rpx solid #D9D9D9;
					}
				}

				.item-right {
					display: flex;
					flex-direction: column;
					flex: 1;


					.item-top {
						display: flex;
						justify-content: space-between;
						margin-bottom: 20rpx;
						margin-left: -6rpx;
						margin-top: -6rpx;

						.refuse-title {
							font-size: 28rpx;
							color: #303133;

						}

						.refuse-time {
							font-size: 24rpx;
							color: #909199;
						}
					}

					.item-bottom {
						padding: 26rpx;
						background: #F6F6F6;
						border-radius: 20rpx;
						font-size: 26rpx;
						color: #303133;
						margin-bottom: 40rpx;
					}
				}
			}
		}
	}
</style>
