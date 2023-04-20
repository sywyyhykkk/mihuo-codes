<style lang="scss" scoped>
	.nav-bar-right {
		image {
			width: 36rpx;
			height: 36rpx;
			margin-right: 28rpx;
		}
		
		.image-down{
			margin-right: 40rpx;
		}
	}

	/deep/ .u-input__input {
		color: #303133;
	}

	/* @import url(); 引入css类 */
	.mihuo-order-information-page {
		background-color: #fff;
		margin: 10rpx 0rpx;
		border-radius: 10rpx;
		padding: 32rpx 28rpx 20rpx 28rpx;
		min-height: 196rpx;

		.item-project-name {
			font-size: $middleFontSize;
			color: $seconFontColor;
			font-weight: bold;
		}

		.item-address {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-top: 14rpx;

			.item-left {
				display: flex;
				align-items: flex-start;

				.address-text {
					font-size: $smiddleFontSize;
					max-width: 470rpx;
					color: $seconFontColor;
				}
			}

			.item-right {}
		}

		.item-phone {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 16rpx;

			.item-left {
				.name {
					color: $viceFontColor;
					font-size: $smiddleFontSize;
					margin-right: 4rpx;
				}

				.phone {
					color: $seconFontColor;
					font-size: $middleFontSize;
				}
			}

			.item-right {}
		}

		.item-left {
			display: flex;
			align-items: center;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 6rpx;
			}
		}

		.item-right {
			display: flex;
			flex-direction: row;
			align-items: center;
			white-space: nowrap;

			image {
				width: 24rpx;
				height: 28rpx;
				margin-right: 4rpx;
			}

			.item-text {
				color: $viceFontColor;
				font-size: $smallFontSize;
			}
		}
	}

	.public-arrow {
		width: 12rpx;
		height: 14rpx;
	}

	.nav-bar-right {
		padding-right: 20rpx;
		font-size: $middleFontSize;
		color: $viceFontColor;
		display: flex;
		align-items: center;

		.select-name {
			color: #303133;
			font-size: 28rpx;
		}
	}

	.icon-no-data {
		width: 190rpx;
		height: 156rpx;
	}

	.public-item-bottom {
		display: flex;
		align-items: center;
		margin-top: 160rpx;
		flex-direction: column;

		text {
			font-size: 30rpx;
			color: #909199;
			margin-top: 20rpx;
		}
	}

	.quoted-price-page {
		margin-top: 12rpx;

		.item-form-contian {
			margin-bottom: 10rpx;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 34rpx 40rpx;
			margin-top: 10rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.item-label {
				color: #303133;
				font-size: 28rpx;
				line-height: 38rpx;
				font-weight: bold;
			}

			.item-other {
				display: flex;
				align-items: center;
			}

			.item-value {
				margin-top: 12rpx;
				background-color: #f6f7f9;
				border-radius: 10rpx;
				height: 88rpx;
				display: flex;
				align-items: center;
				padding: 0rpx 26rpx;
				flex: 1;
			}
		}

		.price-list {
			padding-bottom: 150rpx;
		}

		.material-data-contain {
			padding: 34rpx 40rpx 0rpx 40rpx;
			background-color: #fff;
			border-bottom: 2rpx solid #f5f5f5;
			// margin-bottom: 20rpx;

			&:last-child {
				border-bottom: 0rpx;
				margin-bottom: 0rpx;
			}

			.top-contain {
				margin-bottom: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item-left {
					.item-text-user {
						color: #303133;
						font-size: 30rpx;
						margin-right: 12rpx;
					}

					.item-price {
						font-size: 32rpx;
						color: $errorFontColor;
					}

					.item-unit {
						font-size: 24rpx;
						color: #303133;
					}
				}

				.item-right {
					display: flex;
					align-items: center;

					text {
						color: $themeColor;
						font-size: 24rpx;
						margin-right: 6rpx;
					}
				}
			}

			.item-list-contain {
				margin-bottom: 30rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}

			.item-price-contain {
				padding-bottom: 50rpx;
				padding: 0rpx 0rpx 50rpx 0rpx;

				.item-grouping {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 20rpx;
					height: 80rpx;
					background-color: #f6f6f6;
					border-radius: 16rpx;
					padding: 0rpx 16rpx 0rpx 26rpx;

					.item-left {
						.item-skill-name {
							color: #303133;
							font-size: 24rpx;
						}
					}

					.item-right {
						.item-total {
							color: #909199;
							font-size: 24rpx;
							margin-right: 10rpx;
						}

						.total-price {
							color: #303133;
							font-size: 28rpx;
						}
					}
				}

				.item-product-contain {
					align-items: center;
					margin-bottom: 22rpx;

					.item-product-all {
						display: flex;
					}

					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-right {
						margin-left: 22rpx;
						width: 100%;

						.item-top {
							display: flex;
							align-items: center;
							justify-content: space-between;

							.item-material-name {
								color: #303133;
								font-size: 28rpx;
								line-height: 38rpx;
							}

							.item-total-price {
								color: #303133;
								font-size: 28rpx;
								line-height: 38rpx;
							}
						}

						.item-specification {
							.item-material-calculate {
								color: #909199;
								font-size: 24rpx;
								line-height: 32rpx;
							}
						}

						.item-price-num {
							display: flex;
							align-items: center;
							justify-content: space-between;

							.item-price {
								display: flex;

								.item-price-text {
									color: #ff5d35;
									font-size: 28rpx;
								}

								.item-symbol {
									color: #ff5d35;
								}
							}

							.item-num {
								color: #909199;
								font-size: 28rpx;
								display: flex;
								align-items: center;

								.item-price-text {
									color: #909199;
									font-size: 28rpx;
								}
							}

							.item-symbol {
								color: #909199;
								font-size: 24rpx;
								display: block;
								transform: scale(0.85);
								transform-origin: bottom;
							}
						}
					}
				}
			}
		}

		.bottom-contain {
			width: 100%;
			position: fixed;
			bottom: 0rpx;
			// height: 96rpx;
			// height: 136rpx;
			background-color: #fff;
			display: flex;
			z-index: 10;
			box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.left {
				display: flex;
				flex: 1;
				height: 96rpx;
				align-items: center;
				padding-left: 40rpx;

				.item-text {
					color: #909199;
					font-size: 24rpx;
					margin-right: 6rpx;
				}

				.num {
					color: #ff5d35;
					font-size: 40rpx;
					margin-right: 6rpx;
				}

				.item-unit {
					font-size: 24rpx;
					color: #ff5d35;
				}
			}

			.left-center {
				justify-content: center;
			}

			.right {
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				background-color: $themeColor;
				font-size: $middleFontSize;
				width: 236rpx;
				border-top-left-radius: 70rpx;
				font-weight: bold;
				height: 96rpx;
			}
		}
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

	.cat-list {
		padding: 36rpx 24rpx;
		border-radius: 10rpx;
		background-color: #fff;
	}

	.desc {
		color: #909199;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
</style>

<template>
	<view class="billing-details">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#fff" fontColor="#979797">
			<view slot="default" class="nav-bar-title"> 预算详情 </view>
			<view slot="right" class="nav-bar-right">
				<image src="@/static/images/icon_down/down_1.png" class="image-down" v-if="option.detailId" @click="downFile" mode=""></image>
				<image src="@/static/images/getShare.png" v-if="option.detailId" @click="shareCase" mode=""></image>
			</view>
		</z-nav-bar>
		<view class="quoted-price-page">
			<view class="item-form-contian" v-if="option.detailId">
				<text class="item-label">预算详情</text>
				<view class="item-value" v-if="!option.shareType">
					<u-input placeholder=" 请输入预算名称" placeholder-style="color:#909199" height="52" v-model="budgetName"
						:clearable="false" type="text" :border="false" @blur="getBlur" />
				</view>
			</view>

			<view class="price-list">
				<view class="material-data-contain" v-for="(en, index) in resultList" :key="index">
					<view class="top-contain">
						<view class="item-left">
							<text class="item-text-user">{{ en.name }}</text>
							<text class="item-price">{{ en.totalPrice }}</text>
							<text class="item-unit" v-if="en.totalPrice">元</text>
						</view>
						<view class="item-right" @click="cutView(en)" v-if="!option.shareType">
							<text>{{ en.name }}{{ option.detailId ? '编辑' : '选择' }}</text>
							<image src="/static/images/bottom-icon.png" class="public-arrow"></image>
						</view>
					</view>
					<view class="item-price-contain" v-if="en.groupPrices.length > 0">
						<view class="item-list-contain" v-for="(item, index) in en.groupPrices" :key="index">
							<view class="item-grouping">
								<view class="item-left">
									<view class="item-skill-name">
										{{ item.businessName }}
									</view>
								</view>
								<view class="item-right">
									<text class="item-total">总计</text>
									<text class="total-price">{{ item.totalPrice }}元</text>
								</view>
							</view>
							<view class="item-product-contain" v-for="(el, num) in item.products" :key="num">
								<view class="item-product-all">
									<view class="item-left">
										<image-lazy-load :image="el.productImg" :key="num" height="116">
										</image-lazy-load>
									</view>
									<view class="item-right">
										<view class="item-top">
											<text class="item-material-name">{{
                        el.productName || el.name
                      }}</text>
											<text class="item-total-price">{{
                        setFloatMul(el.price, el.quantity)
                      }}</text>
										</view>
										<view class="item-specification" v-if="el.sourceType == 1003">
											<text class="item-material-calculate"
												v-if="el.productSku">{{ el.productSku }}</text>
										</view>
										<view class="item-specification">
											<text class="item-material-calculate" v-if="el.productSku">{{
                          $isJSON(el.productSku) &&
                          JSON.parse(el.productSku)[0] &&
                          JSON.parse(el.productSku)[0].value
                        }}</text>
										</view>
										<view class="item-price-num">
											<view class="item-price">
												<text class="item-symbol">￥</text>
												<text class="item-price-text">{{ el.price }}</text>
											</view>
											<view class="item-num">
												<text class="item-symbol">X</text>
												<text class="item-price-text">{{ el.quantity }}</text>
											</view>
										</view>
									</view>
								</view>
								<view v-if="el.remark" class="desc">
									{{ el.remark }}
								</view>
							</view>
						</view>
					</view>
					<view class="public-item-bottom" v-else>
						<image class="icon-no-data" src="/static/images/no_order_2.png" mode=""></image>
						<text>暂无材料</text>
					</view>
				</view>
				<!-- 套餐列表 -->
				<!-- <view class="cat-list">
					<item-set-meal v-for="(item ,index) in 2" :key="index" @click="getSetMealDetails">
					</item-set-meal>
				</view> -->
			</view>
			<!-- v-if="spaceMaterialList.length > 0 || artificialCostList.length > 0" -->
			<view class="bottom-contain" v-if="option.detailId">
				<view class="left">
					<text class="item-text">总报价</text>
					<text class="num">{{ totalPrice }}</text>
					<text class="item-unit">元</text>
				</view>
				<view class="right" @click="addResult()">
					{{ option.shareType ? '保存预算' : '开服务单' }}
				</view>
			</view>
		</view>
		<!-- 分享弹框 -->
		<share-pop-up v-model="shareShow" @close="shareShow = false" @click="getShare"></share-pop-up>

		<!-- 角色弹框 -->
		<role-pop-up v-model="roleShowPopup" @close="roleShowPopup = false" @click="getClick"></role-pop-up>
		<!-- 认证弹框 -->
		<modal-new :shutDown="true" v-model="certificationShowPrompt" @click="confirm()" @cancel="modalCancel()"
			titleText="温馨提示" cancelText="取消认证" confirmText="去认证">
			<view class="modal-label-contain">
				<view class="label">完成{{ this.isRealName ? '技能' : '实名' }}认证后才能开单</view>
				<view class="label">是否去认证？</view>
			</view>
		</modal-new>

	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	import baseConfig from '@/config/common.js'
	import moment from '@/static/js/moment.js'
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	export default {
		data() {
			return {
				option: {},
				artificialCostList: [],
				spaceMaterialList: [],
				materialList: [],
				shareShow: false,
				resultList: [{
						name: '人工费',
						groupPrices: []
					},
					{
						name: '材料费',
						type: '1002',
						groupPrices: []
					}
				],
				offerTotalPrice: '',
				makeUpExpensesStatus: false,
				roleShowPopup: false,
				certificationShowPrompt: false,
				isRealName: false,
				screenTreeCode: ['1001', '1002', '1003'],
				details: '',
				sourceType: '', // 材料来源 1001->扫码选材 1002->材料库选材 1003->自购
				budgetName: '',
				shareSkillName: '',
				workTypeList: [],
				showPopup: false,
				buttonList: [{
					name: '关闭',
					active: false
				}]
			}
		},
		computed: {
			artificialCostPrice() {
				let tempPice = []
				this.artificialCostList.map((item) => {
					tempPice.push(Number(item.totalPrice))
					// 应补费用
					// if (Number(item.diffAmount) > 0 && this.makeUpExpensesStatus) {
					// 	tempPice.push(item.diffAmount)
					// }
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice
			},
			materialPrice() {
				let tempPice = []
				this.spaceMaterialList.map((item) => {
					tempPice.push(Number(item.totalPrice))
					// 应补费用
					// if (Number(item.diffAmount) > 0 && this.makeUpExpensesStatus) {
					// 	tempPice.push(item.diffAmount)
					// }
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice
			},
			totalPrice() {
				let tempPice = []
				this.resultList.forEach((el) => {
					tempPice.push(el.totalPrice)
				})
				return operation.funCalc(tempPice)
			}
		},
		mounted() {},
		onShow() {
			this.mulationQuoteDetails()
		},
		onUnload() {
			this.$store.commit('setShoppingCart', [])
			uni.setStorageSync('clientBilling', '')
			this.getBlur()
		},
		onLoad(option) {
			this.option = option
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.usedIsReal()
			this.getPersonInfo()
		},
		methods: {
			mulationQuoteDetails() {
				if (!this.option.detailId) {
					return
				}
				this.$httpApi
					.mulationQuoteDetails({
						id: this.option.detailId
					})
					.then((res) => {
						uni.hideLoading()
						if (res) {
							this.details = res
							if (res.typeGPOutputs) {
								this.resultList = res.typeGPOutputs
								// this.artificialCostList = res.typeGPOutputs.filter(item => ['1003'].includes(item.topId))
								// this.spaceMaterialList = res.typeGPOutputs.filter(item => ['1001', '1002'].includes(item
								// 	.topId))
							}
							this.budgetName = res.name ?
								res.name :
								moment().format('YYYY-MM-DD HH:mm')
						}
					})
			},
			setFloatMul(price, num) {
				return operation.floatMul(price || 0, num)
			},
			/**
			 * @description 判断是否实名
			 * */
			usedIsReal() {
				this.$httpApi.payPwdStatus().then((res) => {
					uni.hideLoading();
					if (res) {
						this.isRealName = res.idCard
					}
				})
			},
			confirm() {
				this.modalCancel()
				if (!this.isRealName) {
					this.toPage('/pages/user/realName')
				} else {
					this.toPage('/pages/setting/skillCertification/skillCertificationPage')
				}
			},
			modalCancel() {
				this.certificationShowPrompt = false
			},
			downFile(){
				let down_url = `${baseConfig.apiUrl}order/bizsimulationquote/downloadBudgetExcel/${this.option.detailId}`
				let fileName = this.budgetName + new Date().getTime() + '.xlsx'
				this.$util.downFileStream(down_url, fileName, 'xlsx')
			},
			addResult() {
				if (this.option.shareType) {
					// bearer
					this.$httpApi
						.copyMulationQuote({
							id: this.option.detailId
						})
						.then((res) => {
							if (res) {
								this.$util.toast('保存成功~')
								setTimeout(() => {
									uni.redirectTo({
										url: `/pages/quickBilling/billingList`
									})
								}, 500)
							}
						})
				} else {
					this.roleShowPopup = true
				}
			},
			cutView(even) {
				let tempList = []
				this.resultList.forEach((item0) => {
					item0.groupPrices.forEach((el) => {
						el.products.forEach((item) => {
							let result = {
								name: item.productName,
								coverImg: item.productImg,
								productSku: item.productSku,
								skuId: item.skuId,
								productId: item.productId,
								unit: item.unit,
								price: item.price,
								selectNum: item.quantity, // 选择数量
								treeCode: item.platformTreeCode, // 用于顶部类型筛选
								itemShow: true, // 控制是否显示
								makeExpensesShow: false, // 显示补齐价格
								makeExpenses: '', // 补齐价格
								customCategory: item
									.customCategory, // 商品分类 1001=材料 1002=服务 1003=服务包 1010=线下材料
								remark: item.remark
							}
							tempList.push(result)
						})
					})
				})
				this.$store.commit('setShoppingCart', tempList)
				// this.toPage(`/pages/publishTask/portfolioPrice?typeName=预算报价`)

				let treeCode = even.name == '人工费' ? '1003' : even.type
				if (this.option.detailId) {
					this.toPage(
						`/pages/construction/clientBilling/materialWarehouse?pageType=${'快速预算'}&groupPricesId=${
            this.option.detailId
          }&treeCode=${treeCode}`
					)
				} else {
					this.toPage(
						`/pages/construction/clientBilling/materialWarehouse?pageType=${'快速预算'}&treeCode=${treeCode}`
					)
				}
			},
			getClick(item) {
				// 审核状态（0已提交、1未通过、2已通过）
				if (this.resultList.length == 0) {
					this.$util.toast('单据不能为空~')
					return
				}
				if (item.auditStatus == 2) {
					let tempResult = []
					this.resultList.forEach((el) => {
						el.groupPrices.forEach((ev) => {
							// 选择当前工种、并且是协作订单 // 1003 服务包  1004服务
							if (ev.businessId == item.skillId && ev.businessType == 1) {
								tempResult.push(ev)
							}
						})
					})
					if (tempResult.length == 0) {
						this.$util.toast(`单据中没有${item.skillName}服务，请选择相应服务~`)
						return
					}

					let skillName = item.skillName
					if (skillName.indexOf('管家') !== -1) {
						skillName = '管家服务'
					} else if (skillName.indexOf('设计') !== -1) {
						skillName = '设计服务'
					}
					this.toPage(
						`/pages/construction/clientBilling/billingDetails?pageType=${1}&groupPricesId=${this.option.detailId}&skillId=${item.skillId}&detailId=${this.option.detailId}`
					)
				} else {
					this.certificationShowPrompt = true
				}
			},
			shareCase() {
				this.shareShow = true
			},
			getShare(item) {
				if (!this.option.detailId) {
					return
				}
				if (item.name == '分享到微信') {
					const userData = uni.getStorageSync('userData')
					const coverImg = this.$util.thumbnailImage(this.details.coverImg, true, 750)
					const tempSkillName = this.shareSkillName.join('、')
					// const title =
					// 	`${userData.sysUser.nickName}(${tempSkillName})给您分享了一份预算报价，总金额:${this.details.price.toFixed(2)}`
					const title =
						`￥${this.details.price.toFixed(2)} | ${userData.sysUser.nickName}（${tempSkillName}）给您分享的《${this.budgetName}》报价`
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					// 保存分享数据
					this.$httpApi.shareById({
						id: this.option.detailId,
						sourceName: uni.getStorageSync('userData').sysUser.nickName
					}).then(item => {
						uni.hideLoading();
						uni.share({
							provider: 'weixin',
							scene: 'WXSceneSession',
							type: 5, // 微信小程序
							imageUrl: 'https://www.51mihuo.com/static/images/mihuo-share.JPG',
							title: title,
							miniProgram: {
								id: 'gh_d70e3f34c452', // c端小程序原始id
								path: `/pages-myHome/decorationMaterials/decorationMaterials?id=${item.id}&shareType=快速预算&userId=${userData.sysUser.userId}`, // 分享到小程序的页面
								type: baseConfig.appletVersion, // 小程序版本  0-正式版； 1-开发版； 2-体验版。
								webUrl: 'https://www.51mihuo.com/' // 兼容低版本的网页链接
							},
							success: res => {
								// this.$util.toast('分享成功~')
							}
						})
					})
				} else {
					this.$httpApi.shareById({
						id: this.option.detailId,
						sourceName: uni.getStorageSync('userData').sysUser.nickName
					}).then(item => {
						this.$util.createWordLink(`${item.id}`, '/pages/quickBilling/billingDetails')
					})
				}
			},
			/**
			 * 
			 * @description 保存开单名称
			 * 
			 * */
			getBlur(item) {
				// console.log('item',item,this.budgetName);
				if (this.option.detailId) {
					this.$httpApi.addMulationQuote({
						id: this.option.detailId,
						name: this.budgetName
					}).then(res => {})
				}
			},
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.shareSkillName = []
						let resultList = []
						res.personageList.map(item => {
							if (item.auditStatus == 2) {
								if (item.skillName) {
									resultList.push(item)
								}
							}
						})

						this.$httpApi
							.getWorkType({
								type: 1,
								clientType: 'platform',
								size: 90
							})
							.then((res) => {
								if (res) {
									resultList.forEach((el) => {
										res.records.forEach((ev) => {
											if (['JOB_MANAGER', 'JOB_DESIGNER'].includes(ev
													.jobCode)) {
												if (ev.skillId == el.skillId) {
													this.shareSkillName.push(el.skillName)
												}
											}
										})
									})
								}
							})
					}
				})
			},
			getSetMealDetails() {
				this.showPopup = !this.showPopup
			}
		}
	}
</script>
