<template>
	<view class="quotation-list" v-if="list.length > 0 && bidStatus !== 0">
		<view class="quotation-item-list-contain">
			<view class="item-title-contain">
				<view class="item-left">
					报价清单
				</view>
				<view class="item-right" v-if="getAcceptanceReport()" @click="acceptanceReport()">
					验收报告
					<image src="/static/images/bottom-icon.png" class="icon-jian">
					</image>
				</view>
			</view>

			<!-- 人工费 -->
			<view class="listing-list-contian" v-if="setArtificialList.length > 0">
				<view class="material-cost-title">
					<view class="item-cost-left">
						<view class="icon-image-bg">
							<image class="icon-image" src="/static/images/qin_dan.png" mode=""></image>
						</view>
						<text class="item-title-name">人工</text>
					</view>
					<view class="item-cost-total">
						总计 {{artificialCost}}
					</view>
				</view>

				<view class="listing-contian" v-for="(item,index) in setArtificialList" :key="index">
					<view class="item-title-contian">
						<view class="item-title-left">
							<text class="item-skill-name">{{item.businessId == '-1'? '自定义': item.businessName}}</text>
							<!-- 暂时隐藏 -->
							<!-- <view class="item-construction-records" v-if="item.relationOrderId " @click="getRecords(item)">
								<text class="item-records">施工记录</text>
								<image src="/static/images/bottom-icon.png" class="icon-jian">
								</image>
							</view> -->
						</view>
						<view class="item-title-right">
							<!-- 暂时隐藏 -->
							<!-- <text class="item-active"
								@click="getButton(setTypeName(item),item)">{{setTypeName(item)}}</text>
							<image v-if="item.skillId != '-1' && pageType == '接单' && setTypeName(item)"
								src="/static/images/bottom-icon.png" class="icon-jian">
							</image> -->
						</view>
					</view>

					<view class="quotation-contain-list">
						<view class="list-contain">
							<view class="item-quotation-contain" v-for="(el,num) in item.products" :key="num">
								<view class="left">
									<image class="icon-zf" src="/static/images/zhengfangx.png" mode=""></image>
									<text class="item-name" @click="getAcceptanceCriteria(el)">{{el.productName}}</text>
								</view>
							</view>
						</view>
						<view class="item-quotation-right">
							<text class="item-price">{{item.totalAmount}}</text>
							<text class="item-unit">元</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 材料费 -->
			<view class="material-cost-cotain" v-if="setMaterialList.length > 0">
				<view class="material-cost-title">
					<view class="item-cost-left">
						<view class="icon-image-bg">
							<image class="icon-image" src="/static/images/qin_dan.png" mode=""></image>
						</view>
						<text class="item-title-name">材料</text>
					</view>
					<view class="item-cost-total">
						总计 {{materialCost}}
					</view>
				</view>
				<view class="material-cost" v-for="(item,index) in setMaterialList" :key="item.id">
					<view class="item-title-contian">
						<view class="item-title-left">
							<view class="icon-image-bg icon-image-dian-pu">
								<image class="dian-pu" src="/static/images/dian_pu.png" mode=""></image>
							</view>
							<text class="item-skill-name">{{item.businessName}}</text>
						</view>
						<view class="item-title-right">
							<text class="item-total-price">{{item.totalAmount}}</text>
							<text class="item-unit">元</text>
						</view>
					</view>
					<view class="item-quotation-contain" v-for="(el,num) in item.products" :key="el.id">
						<view class="item-quotation" v-if="el.sourceType == 1003">
							<view class="left" v-if="el.name">
								<text class="item-index">0{{num+1}}.</text>
								<text class="item-material-name">{{el.productName}}</text>
								<text class="item-specifications">{{el.price}}X{{el.budgetNum}}</text>
							</view>
							<view class="right" v-if="el.name">
								{{ setFloatMul(el.price,el.budgetNum)}}
							</view>
						</view>
						<view class="item-quotation" v-else>
							<view class="left">
								<text class="item-index">0{{num+1}}.</text>
								<text class="item-material-name">{{el.productName}}</text>
								<text class="item-specifications">{{el.price}}X{{el.budgetNum}}</text>
							</view>
							<view class="right">
								{{ setFloatMul(el.price,el.budgetNum)}}
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="item-total-contain">
				<view class="item-total-left">
					共计{{setTotalNum}}个项目
				</view>
				<view class="item-total-right">
					<text class="item-text">合计</text>
					<text class="item-price">{{setTotalPrice}}</text>
					<text class="item-unit">元</text>
				</view>
			</view>

		</view>

		<u-popup v-model="showPopup" border-radius="30" height="1000" mode="bottom" :safe-area-inset-bottom="true"
			:closeable="true">
			<view class="criteria-contian">
				<view class="tittle">
					验收标准
				</view>
				<view class="list-contain">
					<scroll-view :scroll-y="true" class="scroll-Y">
						<view class="sku-acceptance" v-if="acceptanceList.length > 0">
							<view class="item-acceptance" v-for="(item,index) in acceptanceList" :key="index">
								<view class="item-product-name">
									<image src="/static/images/standard.png" mode=""></image>
									<text class="item-product-name-text">{{item.productName}}</text>
								</view>
								<view class="item-checkStandard" v-for="(ev,num) in item.checkStandard" :key="num">
									<view class="item-other">
										<view class="item-index">0{{num+1}}</view>
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
	import operation from '@/plugins/mathoperation.js'
	export default {
		name: 'quotation-list',
		props: {
			list: { // 人工费
				type: Array,
				default: function() {
					return []
				},
			},
			spaceMaterialList: { // 材料费
				type: Array,
				default: function() {
					return []
				},
			},
			orderStatus: {
				type: Number,
				default: 0
			},
			pageType: {
				type: String,
				default: '接单'
			},
			beforeOrderId: {
				type: String,
				default: ''
			},
			bidStatus: {
				type: Number,
				default: 0
			},
			orderId: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				option: {},
				setType: false,
				showPopup: false,
				detailsShow: false,
				details: {},
				acceptanceList: []
			}
		},
		computed: {
			setMaterialList() {
				// businessType 业务分类 1人工，2材料 
				return this.list.filter(item => item.businessType == 2)
			},
			setArtificialList() {
				
				console.log("this.list",this.list)
				
				return this.list.filter(item => item.businessType == 1)
			},
			artificialCost() {
				let tempPice = []
				this.list.map(item => {
					if (item.businessType == 1) {
						tempPice.push(Number(item.totalAmount))
					}
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice || 0
			},
			materialCost() {
				let tempPice = []
				this.list.map(item => {
					if (item.businessType == 2) {
						tempPice.push(Number(item.totalAmount))
					}
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice || 0
			},
			setTotalPrice() {
				return operation.funCalc([this.artificialCost, this.materialCost])
			},
			setTotalNum() {
				return this.list.length
			}
		},
		mounted() {
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			setOperation() {
				// 如果主订单已经提交验收了，则不允许再找人接单
				if (this.orderStatus >= 35) {
					return false
				} else {
					return true
				}
			},
			setTypeShow(item) {
				// 如果有前置id了，则说明已经转包过一次，则不允选再次转包(之前转包支持议价、竞价、一口价，现在只支持一口价)
				if (this.beforeOrderId) {
					return false
				}
				if (this.pageType == '接单' && this.orderStatus >= 30 && item.skillId != -1) {

					return true
				} else {
					return false
				}
			},
			setTypeName(item) {
				// orderStatus 订单状态: 10=已发布/待确认； 15已报价待确认,  20=已确认/待付款；30=已付款/服务中；35=已申请/待验收；40=待结算；50=已完成/待评价；51=已完成/已评价；-1=已取消
				// bidStatus: 2  接单方、发单方操作状态 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受 4=发单方拒绝 5=发单方取消报价 6=接单放取消订单 7=关闭竞价订单
				// 1.只有接单方才显示相应文字，发单方则不显示
				// 2.业主(发单方)选择接单方，并付款之后才根据状态显示:查看订单、找人接单，其它情况显示:待确认
				// 3.自定义材料不支持转发
				if (this.setTypeShow(item)) {
					if (item.relationOrderId) {
						this.setType = true
						switch (item.relationOrderStatus) {
							case 15:
								return '待确认'
							case 35:
								return '待验收'
							case 40:
								return '待结算'
							case 50:
								return '待评价'
							case 51:
								return '已评价'
							case -1:
								return '重新找人'
							default:
								return '查看订单'
						}
					} else {
						if (this.bidStatus == 3) {
							this.setType = true
							if (this.setOperation()) {
								return '找人接单'
							} else {
								return ''
							}
						}
					}
				} else {
					this.setType = false
					// 自定义材料不支持转包
					if (item.skillId == -1) {
						return ''
					} else {
						if (this.pageType == '接单') {
							if (this.orderStatus == 20) {
								return '待付款'
							} else {
								return '待确认'
							}
						} else {
							return ''
						}
					}
				}
			},
			getButton(val, item) {
				if (!this.setType) {
					return
				}
				if (val == '找人接单') {
					if (item.productJson) {
						let tempList = item.productJson && JSON.parse(item.productJson)
						this.$store.commit('setServiceGoodsList', tempList)
						if (item.relationOrderStatus > 10) {
							// 转发的单，有人接受之后就跳转详情
							this.getDetails(item)
						} else {
							if (!this.setOperation()) {
								return
							}
							if (item.relationOrderId) {
								this.toPage(
									`/pages/publishTask/IssueOrder?type=update&id=${item.relationOrderId}&listing=清单&skillId=${item.skillId}&deailsId=${item.id}&skillName=${item.skillName}&relationOrderIdName=编辑`
								)
							} else {
								this.toPage(
									`/pages/publishTask/IssueOrder?id=${item.orderId}&listing=清单&skillId=${item.skillId}&deailsId=${item.id}&skillName=${item.skillName}`
								)
							}
						}
					}
				} else if (val == '重新找人') {
					let tempList = item.productJson && JSON.parse(item.productJson)
					this.$store.commit('setServiceGoodsList', tempList)
					if (item.relationOrderId) {
						this.toPage(
							`/pages/publishTask/IssueOrder?id=${item.orderId}&listing=清单&skillId=${item.skillId}&deailsId=${item.id}&skillName=${item.skillName}`
						)
					}
				} else {
					this.getDetails(item)
				}
			},
			getDetails(item) { // 跳转详情
				if (item.relationOrderId) {
					this.toPage(`/pages/orderReceiving/listingOrderDetails?pageType=发单&id=${item.relationOrderId}`)
				}
			},

			acceptanceReport() {
				this.getSubsetOrderId()
				return
				if (item.relationOrderId) {
					this.toPage(`/pages/orderReceiving/acceptance/acceptanceRecord?id=${1}`)
				}
			},
			/**
			 * @description 判断是否有验收报告
			 */
			getAcceptanceReport() {
				let tempIds = []
				this.list.forEach((el, index) => {
					if (el.relationOrderId && el.relationOrderStatus >= 50) {
						tempIds.push(el.relationOrderId)
					}
				})
				if (tempIds.length > 0) {
					return true
				} else {
					return false
				}
			},
			/**
			 * @description 查看验收报告
			 * 1.获取到所有子订单id
			 * 2.通过循环调用 order/customer/bizorderacceptance/getByOrderId接口获取验收项id
			 * 3.将验收项id传递过去
			 */
			getSubsetOrderId() {
				let tempIds = [],
					acceptanceIds = []

				this.list.forEach((el, index) => {
					if (el.relationOrderId) {
						tempIds.push(el.relationOrderId)
					}
				})
				this.$customForeach(tempIds, async (el, index) => {
					await this.$http.get("order/customer/bizorderacceptance/getByOrderId", {
						orderId: el
					}).then(res => {
						if (res) {
							res.forEach(item => {
								acceptanceIds.push({
									itemId: item.id,
									skillId: item.applySkillId,
									skillName: item.applySkillName
								})
							})
							if (tempIds.length == acceptanceIds.length) {
								uni.navigateTo({
									url: `/pages/orderReceiving/acceptance/acceptanceDetails?acceptanceIds=${JSON.stringify(acceptanceIds)}`
								})
							}
						}
					})
				})
			},

			getRecords(item) {
				let tempData = {
					id: item.relationOrderId,
					viewType: '查看'
				}
				this.toPage(
					`/pages/orderReceiving/acceptance/constructionLog?orderDetails=${JSON.stringify(tempData)}`
				)
			},
			clearCur() {

			},
			confirmSubmit() {
				this.showPopup = !this.showPopup
			},
			getAcceptanceCriteria(el) {
				this.showPopup = !this.showPopup
				if (el.productId) {
					this.$httpApi.getProductAcceptanceList({
						productIds: el.productId,
					}).then(res => {
						if (res) {
							// this.details = res[0]
							res.map(el => {
								el.checkStandard = el.checkStandard !== '' && JSON.parse(el.checkStandard)
							})
							this.acceptanceList = res
							// this.detailsShow = true
						}
					})
				}
			},
			preview(url) {
				let tempUrl = this.$util.thumbnailImage(url, false)
				uni.previewImage({
					urls: [tempUrl],
				})
			},
			setFloatMul(price, num) {
				return operation.floatMul(price || 0, num)
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	
	/deep/ .u-drawer{
		z-index: 990 !important;
	}

	.quotation-list {
		padding: 0rpx !important;
	}

	.icon-jian {
		width: 16rpx;
		height: 14rpx;
	}

	.icon-zf {
		width: 26rpx;
		height: 26rpx;
	}

	.quotation-item-list-contain {
		margin-top: 22rpx;

		.item-title {
			color: $seconFontColor;
			font-size: $smiddleFontSize;
			font-weight: bold;
			margin-bottom: 22rpx;
		}

		.item-title-contain {
			margin-bottom: 16rpx;
			display: flex;
			justify-content: space-between;

			.item-left {
				font-size: 28rpx;
				color: #303133;
				font-weight: bold;
			}

			.item-right {
				font-size: 28rpx;
				color: #002FA5;
				display: flex;
				align-items: center;

				.icon-jian {
					margin-left: 4rpx;
				}
			}
		}



		.item-quotation {
			margin-bottom: 26rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

		}

		.listing-contian,
		.material-cost {

			.item-title-contian {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;
			}

			.quotation-contain-list {
				margin-bottom: 20rpx;
				display: flex;
				justify-content: space-between;

				.list-contain {
					display: flex;
					flex-wrap: wrap;
					max-width: 560rpx;
				}

			}

			.item-title-left {
				display: flex;
				align-items: center;

				.item-skill-name {
					color: #000000;
					font-size: 28rpx;
				}

				.item-construction-records {
					display: flex;
					align-items: center;
					margin-left: 8rpx;

					.item-records {
						color: #909199;
						font-size: 24rpx;
						margin-right: 6rpx;
					}
				}
			}

			.item-title-right {

				.item-total-price {
					font-weight: bold;
					font-size: 28rpx;
					color: #303133;
					margin-right: 4rpx;
				}

				.item-unit {
					font-size: 28rpx;
					color: #303133;
				}
			}

			.item-title-right {
				display: flex;
				align-items: center;

				.item-active {
					font-size: 26rpx;
					color: #002FA5;
					margin-right: 6rpx;
				}
			}

			.item-quotation-contain {

				margin-bottom: 16rpx;

				.item-quotation {
					display: flex;
					justify-content: space-between;
				}

				.left {
					display: flex;
					align-items: center;

					.item-index {
						color: $viceFontColor;
						font-size: $smallFontSize;
						margin-right: 4rpx;
					}

					.item-name {
						color: #606166;
						font-size: $middleFontSize;
						margin-right: 8rpx;
						margin-left: 4rpx;
						border-bottom: 2rpx solid $seconFontColor;
						padding-bottom: 2rpx;
					}

					.item-material-name {
						color: #606166;
						font-size: $middleFontSize;
						margin-right: 16rpx;
					}

					.item-specifications {
						color: $viceFontColor;
						font-size: $smallFontSize;
					}
				}

				.right {
					font-size: $middleFontSize;
					color: #606166;
				}
			}

			.item-quotation-right {
				display: flex;

				.item-price {
					font-size: 28rpx;
					color: #303133;
					margin-right: 4rpx;
				}

				.item-unit {
					font-size: 24rpx;
					color: #303133;
				}
			}
		}

		.item-total-contain {
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

		.icon-image-bg {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			display: flex;
			margin-right: 6rpx;
			align-items: center;
			justify-content: center;
			background-color: #EBEBEB;
		}

		.icon-image {
			width: 32rpx;
			height: 30rpx;
		}

		.icon-image-dian-pu {
			width: 36rpx;
			height: 36rpx;
			border-radius: 50%;
			display: flex;
			margin-right: 6rpx;
			align-items: center;
			justify-content: center;
			background-color: #F6F6F6;

			.dian-pu {
				width: 26rpx;
				height: 26rpx;
			}
		}

		.listing-list-contian {
			border-bottom: 2rpx solid #F6F6F6;
			margin-bottom: 40rpx;
		}


		.material-cost-cotain,
		.listing-list-contian {

			.material-cost-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 28rpx;


				.item-cost-left {
					display: flex;

					.item-title-name {
						margin-left: 12rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #000000;
					}
				}

				.item-cost-total {
					font-size: 28rpx;
					color: #FF5D35;
				}
			}

			.material-cost {
				margin-bottom: 24rpx;
			}
		}
	}

	.scroll-y {
		height: 100%;
	}

	/deep/.uni-scroll-view {
		background-color: #fff !important;
	}


	.criteria-contian {
		height: 100%;

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
					// flex-direction: column;

					.item-other {
						display: flex;
						flex-direction: row;
						margin-bottom: 14rpx;
					}
					.item-description{
						margin-bottom: 14rpx;
						padding-left: 40rpx;
					}

					.image-contain {
						padding-left: 40rpx;
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

		.item-button-contain {
			position: fixed;
			display: flex;
			justify-content: center;
			width: 100%;

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
			}
		}
	}
</style>
