<template>
	<view class="billing-details-page">
		<!-- 快速预算、快速开单 -->
		<view class="order-information" v-if="pageTypeList.includes(option.pageType)">
			<view>
				<view class="item-form-contian">
					<text class="item-label">{{
            option.pageType == 2 ? '开单名称' : '预算名称'
          }}</text>
					<view class="item-value">
						<u-input :placeholder="
                option.pageType == 2 ? '请输入开单名称' : '请输入预算名称'
              " placeholder-style="color:#909199" height="52" v-model="budgetName" :clearable="false" type="text"
							:border="false" />
					</view>
				</view>
				<view class="item-form-contian">
					<text class="item-label">客户名称</text>
					<view class="item-value">
						<u-input placeholder="请输入客户名称" v-model="addressForm.name" placeholder-style="color:#909199"
							height="52" :clearable="false" type="text" :border="false" />
					</view>
				</view>
				<view class="item-form-contian">
					<text class="item-label">客户电话</text>
					<view class="item-value">
						<u-input v-model="addressForm.phoneNumber" placeholder="请输入电话" placeholder-style="color:#909199"
							height="52" :clearable="false" type="number" :border="false" />
					</view>
				</view>
				<view class="item-form-contian">
					<text class="item-label">客户地址</text>
					<!-- publishTask/constructionStie -->
					<view class="item-value">
						<view class="item-address-input" @click="getConstructionSite()">
							<view v-if="addressForm.longitude" class="address-value-active">
								{{ addressForm.province }}{{ addressForm.city
                }}{{ addressForm.region }}
							</view>
							<view v-else class="address-value">请选择省、市、区</view>
						</view>
						<u-icon name="arrow-right" size="24" color="#D9D9D9"></u-icon>
					</view>

					<view class="item-value">
						<view class="item-address-input" @click="getConstructionSite()">
							<view v-if="addressForm.longitude" class="address-value-active">
								{{ addressForm.latAddress }}{{ addressForm.poiName }}
							</view>
							<view v-else class="address-value">请选择详细地址</view>
						</view>
						<u-icon name="arrow-right" size="24" color="#D9D9D9"></u-icon>
					</view>
					<view class="item-value">
						<view class="item-address-input">
							<u-input placeholder="请输入楼栋房号" v-model="addressForm.floorNum"
								placeholder-style="color:#909199" height="52" :clearable="false" :border="false" />
						</view>
					</view>
				</view>
				<view class="item-form-contian">
					<text class="item-label">房屋面积</text>
					<view class="item-other">
						<view class="item-value">
							<u-input placeholder="请输入面积" v-model="addressForm.area" placeholder-style="color:#909199"
								height="52" :clearable="false" type="number" :border="false" @blur="blur" />
						</view>
						<view class="item-unit">平米</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 快速预算订单列表 -->
		<view class="order-contain" v-if="mulationQuote">
			<view class="order-list-contain">
				<view class="order-list mulation-quote-list">
					<view class="item-top">
						<u-avatar class="icon-image" :src="$util.thumbnailImage(mulationQuote.companyLogo, true)"
							size="40">
						</u-avatar>
						<text class="item-name">{{ mulationQuote.companyName }}</text>
					</view>
					<!-- 主订单 -->
					<view class="order-title-type">
						<text class="order-type">
							{{ serviceName }}
						</text>
					</view>
					<view class="master-order" v-for="(ev, num) in mulationQuote.typeGPOutputs" :key="num">
						<view class="order-list-all" v-for="(eve, nu) in ev.groupPrices" :key="nu">
							<view class="goods-contain-list" v-for="(en, nums) in eve.products" :key="nums">
								<mulation-quote :info="en" @calculate="calculate($event, en)"></mulation-quote>
							</view>

							<view class="mulation-quote-information">
								<text class="item-label">商品总价</text>
								<text class="item-value">￥{{ eve.totalPrice }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 快速开单无数据时 -->
		<view class="public-item-bottom-no" v-if="['2'].includes(option.pageType) && quickBillingList.length == 0"
			@click="getSelectMaterial()">
			<image class="icon-no-data" src="/static/images/no_order_2.png" mode=""></image>
			<text>还没有选择材料，点击 <text class="text-active">选择材料</text>开单
			</text>
		</view>



		<!-- 快速开单有数据时 -->
		<view class="order-contain" v-if="['2'].includes(option.pageType) && quickBillingList.length > 0">
			<view class="order-list-contain" v-for="(item, index) in quickBillingList" :key="index">
				<view class="order-list mulation-quote-list">
					<view class="item-top">
						<u-avatar class="icon-image" :src="$util.thumbnailImage(item.companyLogo, true)" size="40">
						</u-avatar>
						<text class="item-name">{{ item.companyName }}</text>
					</view>
					<!-- 主订单 -->

					<view class="master-order" v-for="(ev, num) in item.orders" :key="num">
						<view class="order-title-type">
							<text class="order-type">
								{{ setOrderType(ev) }}
							</text>
						</view>
						<view class="order-list-all" v-for="(eve, nu) in ev.orderItemList" :key="nu">
							<mulation-quote :info="eve" @calculate="calculate($event, eve)" @click="getDetails(eve)">
							</mulation-quote>
							<view class="mulation-quote-information">
								<text class="item-label">商品总价</text>
								<text class="item-value">￥{{ eve.totalAmount }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 项目内开单 -->
		<view class="billing-top" v-if="!pageTypeList.includes(option.pageType)">
			<view class="item-title">开单名称</view>
			<view class="item-input">
				<u-input placeholder="请输入开单名称" height="52" v-model="form.orderName" :clearable="false" type="text"
					:border="false" />
			</view>
		</view>

		<view class="order-contain" v-if="showOrderList.length > 0">
			<view class="order-list-contain">
				<view class="order-list" v-for="(item, index) in showOrderList" :key="index">
					<view class="item-top">
						<u-avatar class="icon-image" :src="$util.thumbnailImage(item.companyLogo, true)" size="40">
						</u-avatar>
						<text class="item-name">{{ item.companyName }}</text>
					</view>
					<!-- 主订单 -->
					<view class="master-order" v-for="(ev, num) in item.orders" :key="num">
						<view class="order-title-type" v-if="ev.orderType !== 0">
							<text class="order-type">
								{{ setOrderType(ev) }}
							</text>
						</view>
						<view class="order-list-all">
							<view class="goods-contain">
								<view class="goods-contain-list" v-for="(en, nums) in ev.orderItemList" :key="nums">
									<!-- 商品订单 -->
									<view class="goods-contain-list-other" v-if="ev.orderType == 0">
										<view class="order-title-type">
											<text class="order-type">
												{{ en.platformCategoryTwoName }}
											</text>
										</view>
										<view class="other-list" v-for="(e, n) in en.orderItemList" :key="n">
											<order-information :info="e" @click="getDetails(e)"></order-information>
										</view>
									</view>

									<!-- 不是商品订单 -->
									<order-information v-else :info="en" @click="getDetails(en)"></order-information>
								</view>
							</view>
							<!-- 主订单价格信息 -->
							<view class="price-information-all">
								<price-information :info="ev" typeName="开单"></price-information>
							</view>
							
							<!-- 分期付款 -->
							<payInformation :info="ev" type="开单"></payInformation>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="input-contain">
			<view class="item-title">
				备注内容
			</view>
			<view class="public-item-bottom ">
				<u-input class="describe-input" maxlength="200" height="160" v-model="form.desc" type="textarea"
					placeholder="请输入服务描述内容" :border="true" />
			</view>

			<view class="img-contain">
				<image-upload-new :uploadType="uploadType" v-model="images" />
			</view>
		</view> -->

		<!-- 优惠券提示 -->
		<item-coupon :list="couponHistoryDetailList" @click="couponPopup = !couponPopup" :couponId="couponId">
		</item-coupon>

		<!-- 服务协议 -->
		<view class="service-contain">
			<view class="item-service" v-for="(item, index) in serviceTypeList" :key="index">
				<view class="item-contian">
					<view class="check-contain">
						<u-checkbox v-model="item.checkbox" shape="circle" size="30rpx" @change="getCheckbox">
						</u-checkbox>
						<text class="item-name">我已阅读并同意 </text>
						<text class="item-bock" @click="getBook(item)">《{{ item.typeName }}》</text>
					</view>
					<view class="item-text-contain">
						<view class="item-title">【协议概述】</view>
						<view class="item-form">
							<text class="item-label">甲方：</text>
							<text class="item-value">{{ item.contactName }} {{ item.contactPhone }}</text>
						</view>
						<view class="item-form">
							<text class="item-label">乙方：</text>
							<text class="item-value">{{ item.workerName }} {{ item.workerPhone }}</text>
						</view>
						<view class="item-form">
							<text class="item-label">工程详细地址：</text>
							<text class="item-value item-address">{{ item.address }}</text>
						</view>
						<view class="item-form">
							<text class="item-label">委托任务内容：</text>
							<text class="item-value item-context">{{ item.typeName }}</text>
						</view>
					</view>
				</view>
				<view class="item-mask">
					<view class="item-bottom" @click="getBook(item)">
						<text>查看完整协议</text>
						<image src="@/static/images/jiantou.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom-contain">
			<view class="top" @click="getEditMaterial()"
				v-if="['2'].includes(option.pageType) && quickBillingList.length > 0">
				选择材料
			</view>
			<view class="top" @click="getEditMaterial()"
				v-if="['3'].includes(option.pageType) && showOrderList.length > 0">
				选择材料
			</view>
			<view class="other-contain" :class="[getSubmitDisplay() ? '' : 'bottom-contain-display']">
				<view class="left" @click="viewServices()">
					<view class="other">
						<view class="select-num">
							<view class="symbol item-price">￥</view>
							<!-- 项目内开单 -->
							<view class="item-price" v-if="!pageTypeList.includes(option.pageType)">
								{{ orderDetails.ordersPayAmount }}
							</view>
							<!-- 快速开单、快速预算 -->
							<view class="item-price" v-if="pageTypeList.includes(option.pageType)">
								{{setTotalPrice}}
							</view>
						</view>
						<view class="select-text">共{{ selectServiceNum }}件商品</view>
					</view>
				</view>
				<view class="right" @click="addResult()"> 确认开单 </view>
			</view>
		</view>

		<!-- 服务协议弹框 -->
		<service-agreement-popup v-if="serviceAgreementPopupStatus" v-model="serviceAgreementPopupStatus"
			@close="getServiceClose" @submit="confirm" :info="serviceInfo" :typeName="serviceType"
			:checkboxStatus="checkboxStatus">
		</service-agreement-popup>

		<!-- 套餐详情 -->
		<mihuo-popup ref="mihuoPopup" height="1000" v-model="showPopup" @close="showPopup = false"
			:buttonList="buttonList" :titleShow="false" buttonShow :closeable="false">
			<view slot="other">
				<set-meal-details :info="setMealDetails"></set-meal-details>
			</view>
		</mihuo-popup>

		<!-- 优惠券弹框 -->
		<coupon-popup v-model="couponPopup" @close="couponPopup = false" :list="couponHistoryDetailList"
			@confirm="couponConfirm"></coupon-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import moment from '@/static/js/moment.js'
	import operation from '@/plugins/mathoperation.js'
	import {
		deepClone
	} from '@/plugins/utils.js'
	import baseConfig from '@/config/common.js'
	export default {
		data() {
			return {
				option: {},
				uploadType: ['图片'],
				orderList: [],
				showOrderList: [],
				images: '[]',
				orderDetails: {},
				serviceTypeList: [],
				serviceAgreementPopupStatus: false,
				serviceInfo: {},
				serviceType: '',
				shareShow: false,
				checkboxStatus: true,
				setMealDetails: '',
				form: {
					orderName: '',
					desc: '',
					attachment: []
				},
				mulationQuote: '',
				addressFormStatus: false,
				budgetName: '',
				shareSkillName: '',
				currentSkillName: '',
				serviceName: '',
				pageTypeList: ['1', '2'], // 1 快速预算  2快速开单 
				payClientBilling: ['2'], // 快速开单
				quickBillingList: [],
				updateBySkusList: [],
				details: {},
				memberUserId: '', // 开快速预算使用到
				addressForm: {
					userName: '',
					poiName: '', //
					province: '', // 省份
					city: '', // 城市
					region: '', // 区
					detailAddress: '', // 详细地址
					latAddress: '', // 道路地址信息
					latitude: '', // 经度
					longitude: '', // 纬度
					adcode: '',
					defaultStatus: 1, // 1,是否为默认：0=是，1=否
					// isHome: 1, //是否是我的家，0=是；1=否
					floorNum: '', // 	楼层房号
					area: '',
					name: '', // 收货人名称
					phoneNumber: '' // 收货人电话
				},
				showPopup: false,
				buttonList: [{
					name: '关闭',
					active: false
				}],
				couponPopup: false,
				couponHistoryDetailList: [], // 优惠卷列表
				couponId: '', // 优惠卷id
				advancePayForm: {
					phone: ''
				}
			}
		},
		computed: {
			...mapState([
				'shoppingCart',
				'serviceCityOperatorId',
				'projectInfo',
				'orderInfo',
				'skuIdList',
				'createGroupPrice',
				'nodeInfo',
				'userPersonInfo'
			]),
			selectService() {
				return ''
			},
			selectServiceNum() {
				let tempPice = []
				if (['1', '2'].includes(this.option.pageType)) {
					// 快速开单
					if (['2'].includes(this.option.pageType)) {
						this.quickBillingList.forEach((item1) => {
							item1.orders.forEach((item2) => {
								item2.orderItemList.forEach((item3) => {
									tempPice.push(item3.totalAmount)
								})
							})
						})
					} else {
						// 快速预算
						if (this.mulationQuote && this.mulationQuote.typeGPOutputs) {
							this.mulationQuote.typeGPOutputs.forEach((en) => {
								en.groupPrices.forEach((item) => {
									item.products.forEach((ev) => {
										tempPice.push(ev)
									})
								})
							})
						}
					}
				} else {
					this.orderList.forEach((item) => {
						item.orders.forEach((el) => {
							el.orderItemList.forEach((ev) => {
								tempPice.push(ev)
							})
						})
					})
				}
				return tempPice.length
			},
			/**
			 * @description 如果有一个商品失效则不能再开单
			 * */
			setOpacity() {
				let tempStatus = false
				this.orderList.map((item) => {
					item.orders.forEach((el) => {
						el.orderItemList.forEach((ev) => {
							if (this.setInvalidStatus(ev)) {
								tempStatus = true
							}
						})
					})
				})
				return tempStatus
			},
			setTotalPrice() {
				let tempPice = []
				// 快速开单
				if (['2'].includes(this.option.pageType)) {
					this.quickBillingList.forEach((item1) => {
						item1.orders.forEach((item2) => {
							item2.orderItemList.forEach((item3) => {
								tempPice.push(item3.totalAmount)
							})
						})
					})
					return operation.funCalc(tempPice)
				} else {
					// 快速预算
					let result = deepClone(this.mulationQuote)
					if (result && result.typeGPOutputs) {
						result.typeGPOutputs.forEach((en) => {
							en.groupPrices.forEach((item) => {
								item.products.forEach((ev) => {
									tempPice.push(operation.floatMul(ev.quantity, ev.price || 0))
								})
							})
						})
						return operation.funCalc(tempPice)
					}
				}
				return 0
			}
		},
		watch: {
			addressForm: {
				handler(newVal, oldVal) {
					this.setServiceTypeList()
					const checkList = [
						'name',
						'phoneNumber',
						'latitude',
						'floorNum',
						'area'
					]
					let checkListStatus = true
					try {
						checkList.forEach((el) => {
							if (!this.addressForm[el]) {
								throw el
							}
						})
					} catch (e) {
						checkListStatus = false
					}
					this.addressFormStatus = checkListStatus
				},
				deep: true
			},
			advancePayForm: {
				handler(newVal, oldVal) {
					this.setServiceTypeList()
					const checkList = ['phone']
					let checkListStatus = true
					try {
						checkList.forEach((el) => {
							if (this.advancePayForm[el]) {
								throw el
							}
						})
					} catch (e) {
						if (this.$base.phoneRegular.test(this.advancePayForm.phone)) {
							checkListStatus = true
						} else {
							checkListStatus = false
						}
					}
					this.addressFormStatus = checkListStatus
				},
				deep: true
			}
		},
		mounted() {},
		onUnload() {
			uni.$off('updateData')
			this.$store.commit('setSkuIdList', [])
		},
		onShow() {
			if (this.option.edit) {
				uni.setNavigationBarTitle({
					title: '编辑开单'
				})
			}
			/**
			 *
			 * @description 客户地址
			 * */
			uni.$once('updateData', (data) => {
				if (JSON.stringify(data) !== '{}') {
					// 这里的adcode应该和首页选择的运营商的cityId一致
					// that.form.cityId = data.adcode.substring(0, 2)
					this.getCityId(data, (res) => {
						if (res) {
							this.addressForm.poiName = data.name
							this.addressForm.province = data.pname
							this.addressForm.city = data.cityname
							this.addressForm.region = data.adname
							this.addressForm.latAddress = data.address
							this.addressForm.latitude = data.location.lat
							this.addressForm.longitude = data.location.lng
							this.addressForm.adcode = data.adcode
						}
					})
				}
			})
			this.getList()
			this.standardOrderGenerateForQuote()
		},
		onLoad(option) {
			this.option = option
			if (this.pageTypeList.includes(this.option.pageType)) {
				this.mulationQuoteDetails()
			}
			this.getServiceName()
		},
		methods: {
			/**
			 * @description 根据skillId 返回服务名称
			 * */
			getServiceName() {
				this.$httpApi.getPersonSettingInfo().then((res) => {
					if (res) {
						let result
						if (res.personageList && res.personageList.length > 0) {
							result = res.personageList.find(
								(item) => item.skillId == this.option.skillId
							)
							if (result) {
								this.currentSkillName = result.skillName
								if (result.skillName.includes('项目管家')) {
									result.skillName = '管家'
								} else if (result.skillName.includes('设计师')) {
									result.skillName = '设计'
								}
								this.serviceName = result.skillName + '服务'
							}
						}
					}
				})
			},
			getCityId(data, callback) {
				let tempAdcode = data.adcode.substring(0, 4)
				this.$http
					.post(`admin/cityoperator/getbyareacode/${tempAdcode}`)
					.then((res) => {
						if (res) {
							callback && callback(true)
						} else {
							this.$util.toast('您的房屋地址未匹配到运营商,请重新选择')
							callback && callback(false)
						}
					})
			},
			/**
			 * @description 选择施工地点
			 *
			 * */
			getConstructionSite() {
				uni.navigateTo({
					url: '/pages/mapChoose/mapChoose',
					animationType: 'slide-in-bottom'
				})
			},
			/**
			 * @description 面积校验
			 *
			 * */
			blur() {
				// if (!isNaN(parseFloat(this.num)) && isFinite(this.num)) {
				// 	this.num = Math.abs(this.num)
				// }
			},
			setInvalidStatus(info) {
				// 发货状态freightStatus. 1-可以发货, 2-不能发货
				// 上架状态publishStatus：0->下架；1->上架
				if (info.freightStatus == 1 && info.publishStatus == 1) {
					return false
				}
				if (info.freightStatus == null || info.publishStatus == null) {
					return false
				}
				return true
			},
			getCheckbox(ev) {
				if (this.pageTypeList.includes(this.option.pageType)) {
					// if (ev.value) {
					// 	this.addressFormStatus = true
					// } else {
					// 	this.addressFormStatus = false
					// }
				}
				this.getSubmitDisplay()
				this.$forceUpdate()
			},
			/**
			 * 如果有服务协议未勾选，则按钮禁用
			 *
			 * */
			getSubmitDisplay() {
				let tempStatus = true
				if (this.pageTypeList.includes(this.option.pageType)) {
					if (this.addressFormStatus) {
						tempStatus = true
					} else {
						tempStatus = false
					}
				}
				this.serviceTypeList.forEach((el) => {
					if (!el.checkbox) {
						tempStatus = false
					}
				})

				if (
					['2'].includes(this.option.pageType) &&
					this.quickBillingList.length == 0
				) {
					tempStatus = false
				}

				if (
					['3'].includes(this.option.pageType) &&
					this.showOrderList.length == 0
				) {
					tempStatus = false
				}

				return tempStatus
			},
			getBook(item) {
				this.serviceInfo = item
				this.serviceType = item.skillName
				this.checkboxStatus = item.checkbox
				this.serviceAgreementPopupStatus = !this.serviceAgreementPopupStatus
			},
			getServiceClose(item) {
				this.serviceAgreementPopupStatus = !this.serviceAgreementPopupStatus
				this.serviceTypeList.forEach((ev) => {
					if (ev.typeName == item.typeName) {
						ev.checkbox = item.checkbox
					}
				})
				this.getSubmitDisplay()
			},
			confirm() {
				this.getServiceClose()
			},
			/**
			 * @description 项目内开单
			 * */
			getList() {
				if (this.skuIdList.length > 0) {
					let tempProducts = []
					this.skuIdList.forEach((el) => {
						tempProducts.push({
							skuId: el.skuId,
							count: el.quantity,
							packageFlag: el.packageFlag ? el.packageFlag : 0,
							packageInfo: el.packageInfo ? el.packageInfo : null,
							packageProductId: el.packageProductId ? el.packageProductId : null,
							remark: el.remark
						})
					})
					if (tempProducts.length == 0) {
						return
					}

					let tempParameter = {
						enableDiffAmount: this.skuIdList[0].enableDiffAmount,
						memberReceiveAddressId: this.skuIdList[0].memberReceiveAddressId,
						products: tempProducts,
						sourceType: 4, // 4=B端组合报价订单； 5=快速预算-模拟报价
						projectId: this.projectInfo.projectId || null

					}

					this.$httpApi.standardGenerateOrder(tempParameter).then((res) => {
						if (res) {
							this.orderList = res.companyOrders
							this.setOrderName()
							this.showOrderList = JSON.parse(JSON.stringify(res.companyOrders))
							this.showOrderList.forEach((el) => {
								el.orders.forEach((ev, num) => {
									if (ev.orderItemList && ev.orderItemList.length > 0) {
										// 商品
										if ([0].includes(ev.orderType)) {
											ev.orderItemList = this.setAnalysisData(ev
												.orderItemList)
										}
									}
								})
							})

							this.orderDetails = res
							this.orderDetails['projectId'] = this.projectInfo.projectId
							this.orderDetails['createServer'] = {
								personId: this.userPersonInfo.personId,
								phone: this.userPersonInfo.phone,
								skillId: this.userPersonInfo.skillId,
								skillName: this.userPersonInfo.skillName,
								userId: this.userPersonInfo.userId,
								userName: this.userPersonInfo.name
							}
							this.orderDetails['name'] = this.form.orderName
							this.orderDetails['nodeId'] = uni.getStorageSync('clientBilling') ?
								this.nodeInfo.nodeId :
								null

							this.getServiceTypeList(this.orderList)

							if (
								res.couponHistoryDetailList &&
								res.couponHistoryDetailList.length
							) {
								res.couponHistoryDetailList.forEach((item) => {
									item['checkbox'] = false
								})
								this.couponHistoryDetailList = res.couponHistoryDetailList
							}
						}
					})
				}
			},
			/**
			 * @description 设置开单名称 见tfs 29517
			 * */
			setOrderName() {
				if (this.nodeInfo.nodeName) {
					this.form.orderName = this.nodeInfo.nodeName
				} else {
					let productNameList = []
					this.orderList.forEach((item1) => {
						item1.orders.forEach((item2) => {
							if (item2.orderItemList && item2.orderItemList.length > 0) {
								item2.orderItemList.forEach((item3, index) => {
									productNameList.push(item3.productName)
								})
							}
						})
					})
					if (productNameList.length > 2) {
						let tempList = productNameList.slice(0, 2)
						this.form.orderName =
							tempList.join('、') + `...等${productNameList.length}项`
					} else {
						this.form.orderName = productNameList.join('、')
					}
				}
			},
			/**
			 *
			 * @description 快速开单，查询预览单
			 *
			 * */
			standardOrderGenerateForQuote() {
				if (['2', '1'].includes(this.option.pageType)) {
					if (!this.option.detailId) {
						return
					}
					this.$httpApi
						.standardOrderGenerateForQuote({
							id: this.option.detailId
						})
						.then((res) => {
							if (res) {
								// 初始化字段
								this.details = res
								res.companyOrders.forEach((item) => {
									// 过滤出当前工种的数据
									// item.orders = item.orders.filter(ev => ev.skillId == this.option.skillId)
									item.orders.forEach((item2) => {
										item2.orderItemList.forEach((item3) => {
											item3['productImg'] = item3.productPic
											item3['productSku'] = item3.productAttr
											item3['price'] = item3.productPrice
											item3['unit'] = item3.productUnit
											item3['quantity'] = item3.productQuantity
										})
									})
								})
								this.quickBillingList = res.companyOrders

								this.getServiceTypeList(this.quickBillingList)
								this.setTreeCodeName()
								this.setAddressForm()
							}
						})
				}
			},
			/**
			 * description 编辑快速开单时地址信息回显
			 * */
			setAddressForm() {
				// if (this.option.edit) {
				if (this.details.createServer && this.details.createServer.address) {
					let resultAddress = this.details.createServer.address
					Object.keys(this.addressForm).forEach((key1) => {
						Object.keys(resultAddress).forEach((key2) => {
							if (key1 == key2) {
								this.addressForm[key1] = resultAddress[key2]
							}
						})
					})
					this.addressForm['floorNum'] = resultAddress['detailAddress']
					this.budgetName = uni.getStorageSync('billingName')
				}
				// }
			},
			setTreeCodeName() {
				this.$httpApi.getListByTreeCodeTree({}).then((res) => {
					this.quickBillingList.forEach((item1) => {
						item1.orders.forEach((item2) => {
							item2.orderItemList.forEach((item3) => {
								let tempTreeCode = item3.platformTreeCode.split('-')[0]
								res.forEach((item4) => {
									if (item4.treeCode == tempTreeCode) {
										item3['type'] = item4.name
										item3['topName'] = item4.name
									}
								})
							})
						})
					})
				})
			},
			setAnalysisData(result) {
				let map = {}
				let dest = []
				let resultList = []
				result.forEach((item) => {
					if (!map[item.platformCategoryTwoId]) {
						dest.push({
							platformCategoryTwoId: item.platformCategoryTwoId,
							platformCategoryTwoName: item.platformCategoryTwoName,
							orderItemList: [item]
						})
						map[item.platformCategoryTwoId] = item
					} else {
						dest.forEach((el) => {
							if (el.platformCategoryTwoId == item.platformCategoryTwoId) {
								el.orderItemList.push(item)
							}
						})
					}
				})
				resultList = [...dest]

				return resultList
			},
			getServiceTypeList(list) {
				// 1.工人=》工匠服务协议
				// 2.管家=》管家服务协议
				// 3.设计=》设计服务协议
				let tempUserData =
					uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser
				let tempParameter = {
					typeName: '',
					contactName: '', // 甲方联系名称
					contactPhone: '', // 甲方联系电话
					workerName: tempUserData.realName || '', // 乙方联系名称
					workerPhone: tempUserData.phone || '', // 乙方联系电话
					address: '', // 工程详细地址
					checkbox: true,
					skillName: '',
					amount: '',
					ewntrustedContent: '',
					time: moment().format('YYYY-MM-DD'),
					pageType: '开单'
				}
				let resultList = []

				list.forEach((item) => {
					item.orders.forEach((el) => {
						// 服务订单
						tempParameter.skillName = el.skillName || ''
						// 甲方信息
						tempParameter.contactName = el.receiverName || ''
						tempParameter.contactPhone =
							(el.receiverPhone &&
								el.receiverPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')) ||
							''
						tempParameter.address =
							el.receiverProvince +
							el.receiverCity +
							el.receiverRegion +
							el.receiverLatAddress +
							el.receiverPoiName +
							''
						// 地址
						tempParameter.address = tempParameter.address.replace('undefined', '')
						if (el.skillName) {
							if (['管家', '项目管家'].includes(el.skillName)) {
								resultList.push({
									...tempParameter,

									typeName: '管家服务协议',
									ewntrustedContent: this.setEwntrustedContent(el)
								})
							} else if (el.skillName.includes('设计')) {
								resultList.push({
									...tempParameter,
									typeName: '设计服务协议',
									ewntrustedContent: this.setEwntrustedContent(el)
								})
							} else {
								resultList.push({
									...tempParameter,
									typeName: '工匠服务协议',
									ewntrustedContent: this.setEwntrustedContent(el)
								})
							}
						}
					})
				})
				resultList = this.unique(resultList, 'typeName')
				this.serviceTypeList = resultList
				this.setServiceTypeList()
			},
			setServiceTypeList() {
				if (this.option.pageType && this.serviceTypeList.length > 0) {
					this.serviceTypeList.forEach((el) => {
						el.contactName = this.addressForm.name // 甲方联系名称
						el.contactPhone = this.addressForm.phoneNumber // 甲方联系电话
						el.address =
							`${this.addressForm.province}${this.addressForm.city}${this.addressForm.region}${this.addressForm.latAddress}${this.addressForm.poiName}${this.addressForm.floorNum}` // 工程详细地址
					})
				}
			},
			unique(arr, key) {
				// 数据去重
				let map = new Map()
				arr.forEach((item, index) => {
					if (!map.has(item[key])) {
						map.set(item[key], item)
					}
				})
				return [...map.values()]
			},
			setEwntrustedContent(item) {
				let tempContent = item.orderItemList.map((ev) => {
					return ev.productName
				})
				return tempContent.join('，')
			},
			setMulationContent() {
				let resultList = []
				if (['2', '3'].includes(this.option.pageType)) {
					// 快速开单
					this.quickBillingList.forEach((item1) => {
						item1.orders.forEach((item2) => {
							item2.orderItemList.forEach((item3) => {
								resultList.push(item3.productName)
							})
						})
					})
				} else {
					// 快速预算
					this.mulationQuote.typeGPOutputs.forEach((item) => {
						item.groupPrices.forEach((el) => {
							el.products.forEach((ev) => {
								resultList.push(ev.productName)
							})
						})
					})
				}
				return resultList.join('，')
			},
			setOrderType(item) {
				switch (item.orderType) {
					case 0:
						return '商品'
					case 1:
						return `${item.skillName}服务`
					case 2:
						// return '协作'
						return `${item.skillName}服务`
					case 3:
						if (item.packageFlag == 1) {
							return `套餐内订单`
						} else {
							return `套餐订单`
						}
				}
			},
			viewServices() {},
			addResult() {
				this.debounce(() => {
					if (this.pageTypeList.includes(this.option.pageType)) {
						if (!this.addressForm.name) {
							this.$util.toast('请输入客户名称')
							return
						}
						if (!this.addressForm.phoneNumber) {
							this.$util.toast('手机号码不能为空')
							return
						}
						if (!this.$base.phoneRegular.test(this.addressForm.phoneNumber)) {
							uni.showToast({
								title: '手机号码格式不正确',
								icon: 'none'
							})
							return
						}
						if (!this.addressForm.latitude) {
							this.$util.toast('请选择地址')
							return
						}
						
						if (!this.addressForm.floorNum) {
							this.$util.toast('请输入楼栋号')
							return
						}
						
						if (!this.addressForm.area) {
							this.$util.toast('请输入房屋面积')
							return
						}
						
						if (
							this.option.pageType == 2 &&
							this.quickBillingList.length == 0
						) {
							this.$util.toast('请选择材料')
							return
						}
						
						if (!this.getSubmitDisplay()) {
							this.$util.toast('请勾选服务协议')
							return
						}
						
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						this.addAddress()
						
						return
					}

					if (!this.getSubmitDisplay()) {
						this.$util.toast('请勾选服务协议')
						return
					}

					if (this.setOpacity) {
						this.$util.toast('商品已失效，不能开单')
						return
					}
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					this.orderDetails['name'] = this.form.orderName
					if (this.couponId) {
						this.orderDetails.couponId = this.couponId
					}
					this.$httpApi
						.standardOrderSave(this.orderDetails)
						.then((res) => {
							if (res) {
								this.$store.commit('setShoppingCart', [])
								this.setCreateGroupPrice()
								uni.redirectTo({
									url: `/pages/construction/clientBilling/recordHistoryDetails?orderIds=${JSON.stringify(  res.orderIds)}&type=开单`
								})
							}
						})
						.finally(() => {
							uni.hideLoading()
						})
				}, 200)
			},
			/**
			 *
			 * @description 添加地址
			 * */
			addAddress() {
				let tempR = {
					userName: '',
					poiName: '云纺国际商厦',
					province: '云南省',
					city: '昆明市',
					region: '西山区',
					detailAddress: '11',
					latAddress: '环城南路668号',
					latitude: '25.020705',
					longitude: '102.709499',
					adcode: '530112',
					defaultStatus: 1,
					isHome: 1,
					floorNum: '11',
					area: '200',
					name: '快乐',
					phoneNumber: '18550898420'
				}
				this.addressForm.detailAddress = this.addressForm.floorNum
				this.$httpApi.addAddress(this.addressForm).then((res) => {
					if (res) {
						this.addMulationQuote(res)
					}
				})
			},
			/**
			 *
			 * @description 添加模拟报价
			 * */
			addMulationQuote(item) {
				let tempSku = []
				const userData = uni.getStorageSync('userData')
				let tempPerson
				// 快速开单
				if (this.option.pageType == 2) {
					this.quickBillingList.forEach((item) => {
						// item.orders = item.orders.filter(ev => ev.skillId == this.option.skillId)
						item.orders.forEach((item2) => {
							item2.orderItemList.forEach((item3) => {
								tempSku.push({
									skuId: item3.skuStock.id,
									count: item3.quantity,
									remark: item3.remark
								})
							})
						})
					})
				} else {
					// 快速预算
					tempPerson = userData.persons.find(
						(item) => item.skillId == this.option.skillId
					).personId
					this.mulationQuote.typeGPOutputs.forEach((item) => {
						item.groupPrices.forEach((el) => {
							el.products.forEach((ev) => {
								tempSku.push({
									skuId: ev.skuId,
									count: ev.quantity,
									remark: ev.remark
								})
							})
						})
					})
				}
				// ${this.addressForm.province}${this.addressForm.city}${this.addressForm.region}
				let customerAddress =
					`${this.addressForm.latAddress}${this.addressForm.poiName}${this.addressForm.floorNum}`
				this.$httpApi
					.addMulationQuote({
						addressId: item.id,
						skillId: this.option.skillId,
						id: this.option.pageType == 2 ?
							this.option.detailId : this.option.groupPricesId,
						personId: this.option.pageType == 2 ? 0 : tempPerson,
						skillName: this.currentSkillName,
						skus: JSON.stringify(tempSku),
						name: this.budgetName,
						price: this.option.pageType == 2 ? this.details.ordersPayAmount : '',
						// status: 1,
						customerAddress: customerAddress, // 客户地址信息
						customerName: this.addressForm.name, //	客户姓名
						customerPhone: this.addressForm.phoneNumber // 客户电话
					})
					.then((res) => {
						uni.hideLoading()
						if (res) {
							if (this.option.pageType == '2') {
								// 快速开单
								if (this.option.edit) {
									// 编辑时返回上一页
									let pages = getCurrentPages()
									let prevPage = pages[pages.length - 2]
									prevPage.$vm.option['detailId'] = this.option.detailId
									uni.navigateBack({
										delta: 1
									})
								} else {
									uni.redirectTo({
										url: `/pages/quickBilling/quickBillingDetails?detailId=${res.id}`
									})
								}
							} else {
								this.$util.toast('开单成功，将分享到微信')
								setTimeout(() => {
									this.orderShare(res)
								}, 300)
							}
						}
					})
			},
			/**
			 * @description 提交快速预算时分享到微信好友
			 * */
			orderShare(res) {
				// this.shareShow = true
				const userData = uni.getStorageSync('userData')
				let tempCoverImg = []
				const totalPrice =
					this.setTotalPrice && Number(this.setTotalPrice).toFixed(2)
				const title =
					`￥${totalPrice} | ${userData.sysUser.nickName}（${this.currentSkillName}）给您分享的《${this.budgetName}》订单`
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				// 保存分享数据
				this.$httpApi
					.shareById({
						id: res.id,
						sourceName: uni.getStorageSync('userData').sysUser.nickName
					})
					.then((item) => {
						uni.hideLoading()
						uni.share({
							provider: 'weixin',
							scene: 'WXSceneSession',
							type: 5, // 微信小程序
							imageUrl: 'https://www.51mihuo.com/static/images/mihuo-share.JPG',
							title: title,
							miniProgram: {
								id: 'gh_d70e3f34c452', // c端小程序原始id
								path: `/pages-mall/submitOrder/submitOrder?id=${item.id}&shareType=1&userId=${userData.sysUser.userId}`, // 分享到小程序的页面
								type: baseConfig.appletVersion, // 小程序版本  0-正式版； 1-开发版； 2-体验版。
								webUrl: 'https://www.51mihuo.com/' // 兼容低版本的网页链接
							},
							success: (res) => {
								// this.$util.toast('分享成功~')
							}
						})
					})
			},
			/**
			 *
			 * @description 查询报价详情，筛选出属于 当前岗位的服务
			 * */
			mulationQuoteDetails() {
				if (!this.option.groupPricesId) {
					return
				}
				this.$httpApi
					.mulationQuoteDetails({
						id: this.option.groupPricesId
					})
					.then((res) => {
						if (res) {
							res.typeGPOutputs.forEach((el) => {
								el.groupPrices = el.groupPrices.filter(
									(item) =>
									item.businessId == this.option.skillId &&
									item.businessType == 1
								)
								// el.groupPrices = el.groupPrices.filter(item => item.businessId == this.option.skillId && item.businessType == 1)
							})
							this.mulationQuote = res
							if (res.name) {
								this.budgetName = res.name
							} else {
								this.budgetName = moment().format('YYYY-MM-DD HH:mm')
							}

							// 初始化字段，用于添加xx服务协议
							let resultList = deepClone(this.mulationQuote.typeGPOutputs)
							resultList.forEach((item1) => {
								item1.groupPrices.forEach((item2) => {
									item2['skillName'] = item2.businessName
									item2['orderItemList'] = item2.products
								})
								item1['orders'] = item1.groupPrices
							})
							this.getServiceTypeList(resultList)
						}
					})
			},
			setCreateGroupPrice() {
				this.$store.commit('setCreateGroupPrice', {})
			},
			setFileType(item) {
				let suffix = item.substring(item.lastIndexOf('.'))
				if (['.mp3', '.mp4', '.3gp'].includes(suffix)) {
					return 'video'
				} else {
					return 'img'
				}
			},
			/**
			 *
			 * @description 修改数量
			 *
			 * */
			getUpdateBySkusList() {
				this.updateBySkusList = []
				this.quickBillingList.forEach((item) => {
					// item.orders = item.orders.filter(ev => ev.skillId == this.option.skillId)
					item.orders.forEach((item2) => {
						item2.orderItemList.forEach((item3) => {
							this.updateBySkusList.push({
								skuId: item3.skuStock.id,
								count: item3.quantity
							})
						})
					})
				})
				this.updateBySkusList = this.updateBySkusList.filter((item) => item.count)
				if (this.updateBySkusList.length > 0) {
					this.$httpApi
						.getUpdateBySkus({
							id: this.option.detailId,
							skus: JSON.stringify(this.updateBySkusList)
						})
						.then((res) => {
							if (res) {
								this.standardOrderGenerateForQuote()
							}
						})
				}
			},
			/**
			 *
			 * @description 快速预算、快速开单加减数量
			 * */
			calculate(itemType, item) {
				// 快速开单
				if (['2'].includes(this.option.pageType)) {
					this.quickBillingList.forEach((item1) => {
						item1.orders.forEach((item2) => {
							item2.orderItemList.forEach((item3) => {
								if (item3.skuStock.id == item.skuStock.id) {
									if (itemType.type == '加') {
										item3.quantity++
									} else if (itemType.type == '减') {
										if (item3.quantity > 0) {
											if (item3.quantity == 1) {
												this.$util.toast('数量不能为0')
												return
											}
											item3.quantity--
										}
									} else {
										item3.quantity = itemType.num
									}
									item3['totalAmount'] = operation.floatMul(
										item3.quantity,
										item3.productPrice || 0
									)
								}
							})
						})
					})
					this.getUpdateBySkusList()
				} else {
					// 快速预算
					this.mulationQuote.typeGPOutputs.forEach((eve) => {
						eve.groupPrices.forEach((el) => {
							if (el.products) {
								el['totalPriceList'] = []
								el.products.forEach((ev) => {
									if (ev.id == item.id) {
										if (itemType.type == '加') {
											ev.quantity++
										} else if (itemType.type == '减') {
											if (ev.quantity > 0) {
												ev.quantity--
											}
										} else {
											ev.quantity = itemType.num
										}
									}
									ev.payAmount = operation.floatMul(ev.quantity, ev.price || 0)
									el['totalPriceList'].push(ev.payAmount)
								})
							}
						})
					})

					this.mulationQuote.typeGPOutputs.forEach((eve) => {
						eve.groupPrices.forEach((el) => {
							if (el.products) {
								el.totalPrice = operation.funCalc(el['totalPriceList'])
							}
						})
					})
				}
			},
			getEditMaterial() {
				this.setShoppingCartMaterial()
				this.toPage(
					`/pages/construction/clientBilling/materialWarehouse?pageType=快速开单&detailId=${this.option.detailId}`
				)
			},
			getSelectMaterial() {
				this.toPage(
					`/pages/construction/clientBilling/materialWarehouse?pageType=快速开单`
				)
			},
			setShoppingCartMaterial() {
				let tempList = []
				let resultList = deepClone(this.quickBillingList)
				resultList.forEach((item1) => {
					item1.orders.forEach((item2) => {
						item2.orderItemList.forEach((item3) => {
							let result = {
								name: item3.productName,
								coverImg: item3.productPic,
								productSku: item3.productSku,
								skuId: item3.productSkuId,
								productId: item3.productId,
								unit: item3.productUnit,
								price: item3.price,
								selectNum: item3.quantity, // 选择数量
								treeCode: item3.platformTreeCode, // 用于顶部类型筛选
								itemShow: true, // 控制是否显示
								makeExpensesShow: false, // 显示补齐价格
								makeExpenses: '', // 补齐价格
								remark: item3.remark,
								customCategory: item3
									.customCategory // 商品分类 1001=材料 1002=服务 1003=服务包 1010=线下材料
							}
							tempList.push(result)
						})
					})
				})
				this.$store.commit('setShoppingCart', tempList)
			},
			getDetails(e) {
				if (e.serviceType == 1003) {
					this.setMealDetails = e
					this.showPopup = !this.showPopup
				}
			},
			couponConfirm(item) {
				this.couponId = item
				this.couponPopup = !this.couponPopup
			},
			phoneInput(event) {
				if (this.$base.phoneRegular.test(event)) {
					this.debounce(() => {
						this.$httpApi.userDetails(event).then((res) => {
							if (res) {
								this.memberUserId = res.userId
							}
						})
					}, 200)
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	/deep/ .u-input__input {
		color: #303133;
	}
	.icon-arrow {
		width: 14rpx;
		height: 26rpx;
	}
	.bottom-contain {
		display: flex;
		position: fixed;
		bottom: 0rpx;
		z-index: 10;
		flex-direction: column;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		width: 100%;
		// height: 136rpx;
		background-color: #fff;
		box-shadow: 0 -8rpx 8rpx rgba(201, 201, 201, .25);
		.top {
			padding: 20rpx 0rpx;
			border-bottom: 2rpx solid #f5f5f5;
			text-align: center;
			font-size: 28rpx;
			color: #002fa5;
		}
		.other-contain {
			display: flex;
		}
		.left {
			display: flex;
			flex: 1;
			padding: 12rpx 0 6rpx 66rpx;
			image {
				width: 88rpx;
				height: 88rpx;
			}
			.item-left {
				position: relative;
				margin-right: 52rpx;
				.num {
					display: flex;
					position: absolute;
					right: -20rpx;
					top: 10rpx;
					justify-content: center;
					align-items: center;
					border-radius: 50%;
					width: 32rpx;
					height: 32rpx;
					background-color: $errorFontColor;
					font-size: $smallFontSize;
					color: #fff;
				}
			}
			.other {
				.select-num {
					display: flex;
					color: $errorFontColor;

					// font-size: $middleFontSize;
					text {
						font-weight: bold;
						font-size: $middleAddFontSize;
						color: #ff5d35;
					}
					.item-price {
						color: #ff5d35;
					}
					.symbol {
						font-size: $smallFontSize;
						color: #ff5d35;
						transform: scale(.9);
						transform-origin: bottom;
					}
				}
				.select-text {
					position: relative;
					left: -14rpx;
					font-size: $smallFontSize;
					color: $viceFontColor;
					transform: scale(.85);
				}
			}
		}
		.right {
			display: flex;
			justify-content: center;
			align-items: center;
			border-top-left-radius: 70rpx;
			width: 274rpx;
			height: 106rpx;
			background-color: $themeColor;
			font-weight: bold;
			font-size: $middleFontSize;
			color: #fff;
		}
	}
	.bottom-contain-display {
		background-color: #f0f1f2;
		.left {
			.item-price {
				color: #adadad !important;
			}
			background-color: #f5f5f5;
		}
		.right {
			background-color: #2e2e2e;
		}
	}
	.public-item-bottom {
		border-radius: 5px;
		// padding: 24rpx;
		background: #f7f7f7;
		// height: 140rpx;
	}
	.describe-input {
		border: 0;
	}
	/deep/ .u-checkbox {
		margin-right: 8rpx;
	}
	/deep/ .u-checkbox__label {
		display: none;
	}
	.service-contain {
		.item-service {
			position: relative;
			margin-bottom: 40rpx;
			border-radius: 10rpx;
			background-color: #fff;
		}
		.item-contian {
			padding: 44rpx 50rpx 0rpx;
			.check-contain {
				display: flex;
				align-items: center;
				.item-name {
					font-size: 28rpx;
					color: #303133;
				}
				.item-bock {
					font-size: 28rpx;
					color: #002fa5;
				}
			}
			.item-text-contain {
				.item-title {
					margin-top: 24rpx;
					margin-bottom: 10rpx;
					line-height: 40rpx;
					font-size: 26rpx;
					color: #606166;
				}
				.item-form {
					display: flex;
					.item-label {
						white-space: nowrap;
					}
				}
				.item-address {
					display: -webkit-box; //定义为盒子模型显示
					overflow: hidden; //多出的隐藏
					-webkit-line-clamp: 1; //用来限制在一个块元素显示的文本的行数
					text-overflow: ellipsis; //多出部分用...代替
					-webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒
				}
				.item-context {
					display: -webkit-box; //定义为盒子模型显示
					overflow: hidden; //多出的隐藏
					-webkit-line-clamp: 2; //用来限制在一个块元素显示的文本的行数
					text-overflow: ellipsis; //多出部分用...代替
					-webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒
				}
				text {
					line-height: 40rpx;
					font-size: 26rpx;
					color: #606166;
				}
			}
		}
		.item-mask {
			position: absolute;
			top: 104rpx;
			box-sizing: border-box;
			width: 748rpx;
			height: 256rpx;
			background: linear-gradient(180deg,
			rgba(255, 255, 255, .3) 0%,
			#f1f1f1 80%);
			text-align: center;
			.item-bottom {
				display: flex;
				position: absolute;
				left: 50%;
				bottom: 28rpx;
				justify-content: center;
				align-items: center;
				transform: translateX(-50%);
			}
			text {
				font-size: 26rpx;
				color: #95886a;
			}
			image {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
	.order-title-type {
		padding: 20rpx;
		background-color: #fff;
		.order-type {
			padding: 10rpx 20rpx;
			border-radius: 16rpx 0rpx;
			min-width: 124rpx;
			height: 50rpx;
			background-color: #002fa5;
			line-height: 50rpx;
			font-size: 28rpx;
			color: #fff;
		}
	}
	.billing-details-page {
		padding-bottom: 260rpx;
		.order-information {
			margin-top: 20rpx;
			padding: 34rpx 40rpx;
			border-radius: 10rpx;
			background-color: #fff;
			.item-form-contian {
				margin-bottom: 26rpx;
				&:last-child {
					margin-bottom: 0rpx;
				}
				.item-label {
					line-height: 38rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: #303133;
				}
				.item-other {
					display: flex;
					align-items: center;
				}
				.item-value {
					display: flex;
					align-items: center;
					flex: 1;
					margin-top: 12rpx;
					padding: 0rpx 26rpx;
					border-radius: 10rpx;
					height: 88rpx;
					background-color: #f6f7f9;
					.item-address-input {
						display: flex;
						align-items: center;
						width: 100%;
						.address-value {
							font-size: 26rpx;
							color: #909199;
						}
						.address-value-active {
							font-size: 26rpx;
							color: #303133;
						}
					}
				}
				.item-unit {
					display: flex;
					justify-content: center;
					align-items: center;
					margin-left: 10rpx;
					margin-top: 12rpx;
					border-radius: 10rpx;
					width: 132rpx;
					height: 88rpx;
					background-color: #f6f7f9;
					font-size: 26rpx;
					color: #303133;
				}
			}
		}
		.mulation-quote {
			margin-top: 0rpx;
			padding: 20rpx;
		}
		.billing-top {
			border-radius: 10rpx;
			.item-title {
				margin: 20rpx 32rpx;
				font-size: 15px;
				color: #303133;
			}
			.item-input {
				padding: 20rpx;
				background-color: #fff;
			}
		}
		.order-contain {
			margin-top: 20rpx;
			.order-title {
				padding-left: 32rpx;
				font-size: 30rpx;
				color: #303133;
			}
			.order-list-contain {
				margin-top: 20rpx;
				border-radius: 10rpx;
				.order-list {
					margin-bottom: 16rpx;
				}
				.mulation-quote-list {
					.order-title-type {
						padding: 20rpx 20rpx 0rpx;
						background-color: #fff;
					}
					.mulation-quote-information {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 16rpx 40rpx 26rpx;
						.item-label {
							font-size: 28rpx;
							color: #606166;
						}
						.item-value {
							font-size: 30rpx;
							color: #606166;
						}
					}
				}
				.item-top {
					display: flex;
					align-items: center;
					padding: 30rpx;
					border-bottom: 2rpx dashed #eee;
					border-radius: 30rpx 30rpx 0rpx 0rpx;
					background-color: #fff;
					.item-name {
						margin-left: 10rpx;
						font-size: 30rpx;
						color: #303133;
					}
				}
				.master-order {
					margin-bottom: 2rpx;
					// background-color: #fff;
				}
				.goods-contain {
					// padding: 20rpx 40rpx;
					padding: 0rpx 20rpx 20rpx;
					background-color: #fff;
					.goods-contain-list {
						margin-bottom: 20rpx;
						padding-bottom: 20rpx;
						border-bottom: 1px dashed #eee;
						&:last-child {
							margin-bottom: 0rpx;
							padding-bottom: 0rpx;
							border-bottom: 0rpx;
						}
						.goods-contain-list-other {
							.order-title-type {
								padding: 20rpx 0rpx;
							}
							/deep/.goods-list {
								margin-bottom: 20rpx;
							}
						}
					}
				}
				.price-information-all {
					margin-top: 2rpx;
					padding: 20rpx 40rpx;
					border-radius: 0rpx 0rpx 10rpx 10rpx;
					background-color: #fff;
				}
			}
		}
		.input-contain {
			margin-top: 2rpx;
			padding: 20rpx 40rpx;
			border-radius: 10rpx;
			background-color: #fff;
			.item-title {
				margin-bottom: 20rpx;
				font-size: 30rpx;
				color: #46464e;
			}
			.img-contain {
				margin-top: 20rpx;
			}
		}
	}
	.public-item-bottom-no {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 10rpx;
		padding: 100rpx 0rpx;
		border-radius: 10rpx;
		background-color: #fff;
		.icon-no-data {
			width: 190rpx;
			height: 156rpx;
		}
		text {
			margin-top: 20rpx;
			font-size: 30rpx;
			color: #909199;
		}
		.text-active {
			color: #002fa5;
		}
	}
	.cat-list {
		padding: 36rpx 24rpx;
		border-radius: 10rpx;
	}
</style>
