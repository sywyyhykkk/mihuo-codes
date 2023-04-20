<template>
	<view>
		<z-nav-bar fontColor="black">
			<view slot="default" class="nav-bar">装修费用</view>
			<!-- #ifdef APP-PLUS || H5 -->
			<mihuo-image class="share-icon" slot="right"
				src="https://www.51mihuo.com/static/images/order_details/share.png" @click="shareCase" />
			<!-- #endif -->
		</z-nav-bar>
		<view class="cost">
			<view class="cost-total flex-box">
				<view class="cost-total_left">当前总金额：￥
					<text>{{ Math.floor(obj.totalPrice) || 0 }}</text>
					<text style="font-size: 24rpx">{{ obj.totalPrice | priceFormat }}</text>
				</view>
				<view class="cost-total_right" @click="()=>showPopup=true">
					费用分布
					<u-icon name="arrow-right" size="24"></u-icon>
				</view>
			</view>
			<view class="cost-list">
				<view class="cost-list-main">
					<!-- 左菜单 -->
					<view class="cost-list_left">
						<view v-for="(item,index) in stageList" :key="index" class="tabs"
							:class="{active:curLeftIndex === index}" @click="tabClick(index,item)">
							<view>{{ item.stageName }}</view>
							<view v-if="item.price">（￥{{ item.price || "-"}}）</view>
							<view v-else>/</view>
						</view>
					</view>
					<!-- 右内容 -->
					<view class="cost-list_right">
						<view class="cost-stage">
							<view v-for="(item,index) in tabList" :key="index" class="cost-stage_item"
								:class="{activeTop:curTopIndex === index}" @click="tabTopClick(index,item)">
								<view class="stage-item_label">{{ item.name }}</view>
								<text v-if="item.price" class="stage-item_label tips">（￥{{ item.price || "-"}}）</text>
								<text v-else-if="index !=2" class="stage-item_label tips">/</text>
								<text v-else class="stage-item_label tips" style="font-size:20rpx">(业主自购)</text>
							</view>
						</view>
						<view v-if="productList && productList.length" class="sku-right">
							<view v-for="(item,index) in productList" :key="index">
								<view class="sku-type">
									<text class="sku-type_title">{{ item.productCategoryName }}</text>
									<view>
										￥<text style="font-size: 28rpx">{{ item.totalPrice.toFixed(0) || '' }}</text>
										<text>{{ item.totalPrice | priceFormat }}</text>
									</view>
								</view>
								<view v-if="item.skuList && item.skuList.length" class="sku">
									<view v-for="(v,i) in item.skuList" :key="i" class="sku-item">
										<view class="sku-list">
											<view class="sku-list_left">
												<u-lazy-load v-if="v.coverImg && !v.selfBuy" height="120"
													style="lazy-img" :style="{ width: '120rpx' }" imgMode="aspectFill"
													border-radius="10" :image="$util.thumbnailImage(v.coverImg,true)">
												</u-lazy-load>
												<u-lazy-load v-if="v.productCoverPic && v.selfBuy" height="120"
													style="lazy-img" :style="{ width: '120rpx' }" imgMode="aspectFill"
													border-radius="10"
													:image="$util.thumbnailImage(v.productCoverPic,true)">
												</u-lazy-load>
												<text class="row" v-if="v.selfBuy || v.totalPrice<=0">业主自购</text>
											</view>
											<view class="sku-list_right" @click="goToPage(v)">
												<view class="sku-title">{{ v.productName }}</view>
												<view class="sku-num">
													{{ v.skuLabel }}
												</view>
												<view class="sku-num_s">
													数量:{{ v.quantity }}
												</view>
												<view class="sku-price flex-box">
													<text style="color:#FE6E32">￥{{ v.price }}</text>
													<text>￥{{ v.totalPrice }}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<mh-empty v-else title="暂无数据～～" />
					</view>
				</view>
			</view>
			<view class="buttom">
				<view class="buttom-bottom">
					<view class="buttom_do">
						<!-- <view class="buttom_do-left" @click="nextDo('装修报价')">获取装修报价</view> -->
						<view class="buttom_do-right" @click="nextDo('我要同款')">我要同款</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 费用分布 -->
		<sku-popup v-model="showPopup" title="费用分布" align="center" height="70%">
			<view class="content-sku">
				<u-table>
					<u-tr>
						<u-th></u-th>
						<u-th>人工</u-th>
						<u-th>辅材</u-th>
						<u-th>主材</u-th>
						<u-th>小计(元)</u-th>
					</u-tr>
					<u-tr v-for="(item,index) in dataQr" :key="index">
						<u-td style="font-weight: bold;">{{ item.stageName }}</u-td>
						<u-td>{{ item.labor || '/' }}</u-td>
						<u-td>{{ item.auxiliaryMaterials || '/' }}</u-td>
						<u-td>{{ item.mainMaterials || '/' }}</u-td>
						<u-td style="color:#ED3832 !important;font-weight: bold;">{{ item.totalPrice }}</u-td>
					</u-tr>
					<!-- <u-tr>
						<u-td style="font-weight: bold;">小计(元)</u-td>
						<u-td style="color:#ED3832 !important">{{ obj.laborCosts }}</u-td>
						<u-td style="color:#ED3832 !important">{{ obj.mainMaterials }}</u-td>
						<u-td style="color:#ED3832 !important">{{ obj.auxiliaryMaterials }}</u-td>
						<u-td style="color:#ED3832 !important">{{ obj.totalPrice }}</u-td>
					</u-tr> -->
				</u-table>
				<bottom-button title="我知道了" @click="closePopup" color="#141414"
					:styleObj="{ background: '#FFFFFF' ,border:'2rpx solid #000000'}" />
			</view>
		</sku-popup>
		<!-- 工种简介 -->
		<master-worker-detail v-model="showDetail" :data="curMaster" @cancel="cancel" @findMasterNow="findMasterHome" />
		<!-- 我要同款 -->
		<call-master v-model="isCallMaster" :data="curMaster" />
	</view>
</template>

<script>
	import {
		masterAvatar
	} from '@/plugins/orderStatus'
	import baseConfig from '@/config/common.js'

	export default {
		data() {
			return {
				options: {},
				curStage: {},
				productList: [],
				curTopIndex: 0,
				curLeftIndex: 0,
				obj: {
					totalPrice: 0,
					laborCosts: 0,
					mainMaterials: 0,
					auxiliaryMaterials: 0
				},
				tabList: [{
						name: "人工",
						price: 0,
					},
					{
						name: "辅材",
						price: 0,
					},
					{
						name: "主材",
						price: 0,
					},

				],
				showPopup: false,
				dataQr: [],
				stageList: [],
				isCallMaster: false,
				showDetail: false,
				curMaster: {},
				masterStatus: [],
				ipImage: masterAvatar,
				details: {}
			}
		},
		onLoad(options) {
			/**
			 * options.type
			 * 0:人工费
			 * 1:主材费
			 * 2:辅材费
			 */
			this.options = options;
			this.curTopIndex = Number(options.type) || 0;
			this.getDataList();
			if (options.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('费用清单', url, this.options.userId)
			}
		},
		methods: {
			getDataList() {
				let totalPrice = 0;
				let laborCosts = 0;
				let mainMaterials = 0;
				let auxiliaryMaterials = 0;
				let params = {
					id: this.options.id,
				}
				if (uni.getStorageSync('userData')) {
					params.userId = uni.getStorageSync('userData').sysUser.userId
				}
				this.$httpApi.getConstruCaseDetail(params).then(res => {
					if (res) {
						res.stage = JSON.parse(res.stage);
						res.coverPic = JSON.parse(res.coverPic);
						this.details = res;
						this.stageList = res.stage;
						let totalList = [] //总费用
						let laborCostsList = [] //总人工
						let mainMaterialsList = [] //总主材
						let auxiliaryMaterialsList = [] //总辅材
						if (res.stage && res.stage.length) {
							res.stage.map((item) => {
								item.groupList = []
								item.laborCostsList = []
								item.mainMaterialsList = []
								item.auxiliaryMaterialsList = []
								if (item.groupPrice) {
									item.groupList = item.groupList.concat(item.groupPrice.laborCosts ||
										[]).concat(item.groupPrice.auxiliaryMaterials || [])
										.concat(item.groupPrice.mainMaterials || [])
									item.laborCostsList = item.laborCostsList.concat(item.groupPrice
										.laborCosts || [])
									item.mainMaterialsList = item.mainMaterialsList.concat(item.groupPrice
										.mainMaterials || [])
									item.auxiliaryMaterialsList = item.auxiliaryMaterialsList.concat(item
										.groupPrice.auxiliaryMaterials || [])
									totalList = totalList.concat(item.groupPrice.laborCosts || []).concat(
											item.groupPrice.auxiliaryMaterials || [])
										.concat(item.groupPrice.mainMaterials || [])
									laborCostsList = laborCostsList.concat(item.laborCostsList || [])
									mainMaterialsList = mainMaterialsList.concat(item.mainMaterialsList ||
										[])
									auxiliaryMaterialsList = auxiliaryMaterialsList.concat(item
										.auxiliaryMaterialsList || [])
								}
							})
						}
						// 总费用
						if (totalList && totalList.length) {
							totalList.map((item) => {
								let num = this.$math.floatMul(Number(item.price), Number(item.quantity))
								totalPrice = this.$math.floatAdd(totalPrice, num)
							})
						}
						// 各阶段费用
						if (res.stage && res.stage.length) {
							res.stage.map((item) => {
								item.price = 0;
								// 人工费
								item.laborCostsList.some((v) => {
									let num = this.$math.floatMul(Number(v.price), Number(v
										.quantity))
									laborCosts = this.$math.floatAdd(laborCosts, num)
								})
								// 主材
								item.mainMaterialsList.some((v) => {
									let num = this.$math.floatMul(Number(v.price), Number(v
										.quantity))
									mainMaterials = this.$math.floatAdd(mainMaterials, num)
								})
								// 辅材
								item.auxiliaryMaterialsList.some((v) => {
									let num = this.$math.floatMul(Number(v.price), Number(v
										.quantity))
									auxiliaryMaterials = this.$math.floatAdd(auxiliaryMaterials,
										num)
								})
								if (item.groupList && item.groupList.length) {
									item.groupList.some((v) => {
										let num = this.$math.floatMul(Number(v.price), Number(v
											.quantity))
										item.price = this.$math.floatAdd(item.price, num)
									})
								}
							})
						}
						this.obj.totalPrice = this.$math.accuracy(totalPrice);
						this.obj.laborCosts = this.$math.accuracy(laborCosts);
						this.obj.mainMaterials = this.$math.accuracy(mainMaterials);
						this.obj.auxiliaryMaterials = this.$math.accuracy(auxiliaryMaterials);
						res.stage.unshift({
							stageName: "全部",
							price: totalPrice,
							laborCostsList: laborCostsList,
							mainMaterialsList: mainMaterialsList,
							auxiliaryMaterialsList: auxiliaryMaterialsList,
						})
						this.stageList = res.stage;
						this.tabClick(this.curLeftIndex, this.stageList[this.curLeftIndex])
						// 费用分布
						this.distributionCost(this.stageList)
					}
				})
			},
			tabTopClick(index) {
				this.curTopIndex = index;
				switch (index) {
					case 0:
						this.productList = this.dataCombination(this.curStage.laborCostsList || [])
						break;
					case 1:
						this.productList = this.dataCombination(this.curStage.auxiliaryMaterialsList || [])
						break;
					case 2:
						this.productList = this.dataCombination(this.curStage.mainMaterialsList || [])
						break;
					default:
						break;
				}

			},
			tabClick(index, data) {
				this.curStage = data;
				this.curLeftIndex = index;
				this.productList = [];
				let laborCosts = 0;
				let mainMaterials = 0;
				let auxiliaryMaterials = 0;
				if (data) {
					// 人工费
					if (data.laborCostsList && data.laborCostsList.length) {
						data.laborCostsList.map((item) => {
							item.totalPrice = this.$math.floatMul(Number(item.price), Number(item.quantity))
							laborCosts = this.$math.floatAdd(item.totalPrice, laborCosts)
						})
					}
					// 主材费
					if (data.mainMaterialsList && data.mainMaterialsList.length) {
						data.mainMaterialsList.map((item) => {
							item.totalPrice = this.$math.floatMul(Number(item.price), Number(item.quantity))
							mainMaterials = this.$math.floatAdd(item.totalPrice, mainMaterials)
						})
					}
					// 辅材费
					if (data.auxiliaryMaterialsList && data.auxiliaryMaterialsList.length) {
						data.auxiliaryMaterialsList.map((item) => {
							item.totalPrice = this.$math.floatMul(Number(item.price), Number(item.quantity))
							auxiliaryMaterials = this.$math.floatAdd(item.totalPrice, auxiliaryMaterials)
						})
					}
				}
				this.tabList[0].price = this.$math.accuracy(laborCosts);
				this.tabList[1].price = this.$math.accuracy(auxiliaryMaterials);
				this.tabList[2].price = this.$math.accuracy(mainMaterials);
				this.tabTopClick(this.curTopIndex);
			},
			dataCombination(data) {
				let arrCategory = []
				data.map((item) => {
					arrCategory.push({
						productCategoryName: item.productCategoryName,
						skuList: []
					})
				})
				let arrList = this.removeObj(arrCategory)
				arrList.map((item) => {
					item.totalPrice = 0
					data.some((v) => {
						if (item.productCategoryName == v.productCategoryName) {
							item.skuList.push(v)
						}
					})
				})
				arrList.map(item => {
					item.skuList.some((v) => {
						item.totalPrice = this.$math.floatAdd(v.totalPrice, item.totalPrice || 0)
					})
				})
				return arrList
			},
			// 费用分布
			distributionCost(data) {
				let newArr = data.slice(1)
				let arrCategory = []
				newArr.map((item) => {
					arrCategory.push({
						stageName: item.stageName,
						labor: 0,
						laborList: item.groupPrice && item.groupPrice.laborCosts || [],
						mainMaterialsList: item.groupPrice && item.groupPrice.mainMaterials || [],
						mainMaterials: 0,
						auxiliaryMaterialsList: item.groupPrice && item.groupPrice.auxiliaryMaterials ||
						[],
						auxiliaryMaterials: 0,
						totalPrice: 0
					})
				})
				arrCategory.forEach(el => {
					el.laborList.map((v) => {
						let num = this.$math.floatMul(Number(v.price), Number(v.quantity))
						el.labor = this.$math.floatAdd(el.labor, num)
					})
					el.mainMaterialsList.map((v) => {
						let num = this.$math.floatMul(Number(v.price), Number(v.quantity))
						el.mainMaterials = this.$math.floatAdd(el.mainMaterials, num)
					})
					el.auxiliaryMaterialsList.map((v) => {
						let num = this.$math.floatMul(Number(v.price), Number(v.quantity))
						el.auxiliaryMaterials = this.$math.floatAdd(el.auxiliaryMaterials, num)
					})
					let num = this.$math.floatAdd(el.labor, el.mainMaterials)
					el.totalPrice = this.$math.floatAdd(el.auxiliaryMaterials, num)
				});
				this.dataQr = arrCategory;
			},
			removeObj(arr) {
				let obj = {};
				arr = arr.reduce((newArr, next) => {
					obj[next.productCategoryName] ? "" : (obj[next.productCategoryName] = true && newArr.push(
						next));
					return newArr;
				}, []);
				return arr;
			},
			nextDo(val) {
				switch (val) {
					case "装修报价":
						this.toPage(`/pages-valuation/valuation`);
						break;
					case "我要同款":
						if (uni.getStorageSync('userData')) {
							this.getCommonDesign()
						} else {
							this.$util.goToLoginPage()
						}
						break;
					default:
						break;
				}

			},
			async getCommonDesign() {
				//  登陆后获取呼工人呼叫状态
				if (uni.getStorageSync('userData')) {
					this.masterStatus = await this.$httpApi.getOrderSkillTypeStatus()
				}
				this.$httpApi
					.getPlatformSkills({
						type: '', // 查询全部
						clientType: 'platform'
					})
					.then((res) => {
						if (res) {
							res.forEach((item) => {
								if (item.jobCode == 'JOB_MANAGER') {
									this.curMaster = item;
								}
								this.ipImage.some((v, i) => {
									if (item.skillName.indexOf(v.name) != -1) {
										item.img = v.img
									}
								})
							})
							if (this.masterStatus && this.masterStatus.length) {
								this.masterStatus.map((item) => {
									res.forEach((ele) => {
										if (item?.skillId == ele.skillId) {
											ele.isServe = true // true:代表服务中
										}
									})
								})
							}
							this.showDetail = true
						}
					})
			},
			// 取消订单
			cancel(id) {
				this.showDetail = false
				uni.showModal({
					title: '确认操作',
					content: '是否确认取消呼叫',
					cancelText: '再等等',
					confirmText: '确认',
					confirmColor: '#FE6E32',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '取消中',
								mask: true
							})
							this.$http
								.post('order/capp/biz_order/cancelCall?skillId=' + id)
								.then((res) => {
									if (res) {
										this.$util.toast('取消呼叫成功');
										this.isCallMaster = true;
									}
								})
						}
						if (res.cancel) {
							this.showDetail = true
						}
					}
				})
			},
			findMasterHome() {
				this.showDetail = false;
				setTimeout(() => {
					this.isCallMaster = true;
				}, 200)
			},
			closePopup() {
				this.showPopup = false;
				this.$emit('input', false)
			},
			// 分享案例到小程序
			shareCase() {
				const coverImg = this.$util.thumbnailImage(this.details.coverPic[0], true, 750)
				const path = `/pages-common/case/recommend/expensesList?id=${this.details.id}`
				this.$util.shareToWechat(`「${this.details.name}」装修费用清单`, coverImg, path, '费用清单', true, 2)
			},
			// 查看商品详情
			goToPage(v) {
				if (v.productId) this.toPage(`/pages-mall/productDetail/productDetail?id=${v.productId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cost {
		.cost-total {
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 30rpx;

			.cost-total_left {
				font-size: 28rpx;
				color: #141414;
				font-family: NotoSansHans-Medium;
				font-weight: bold;
			}

			.cost-total_right {
				font-size: 24rpx;
				color: #141414;
				font-family: NotoSansHans-Medium;
			}
		}

		.cost-stage {
			display: flex;
			flex-flow: row nowrap;

			// overflow-x: scroll;
			.cost-stage_item {
				padding: 20rpx 0;
				text-align: center;
				flex: 1;

				.stage-item_label {
					white-space: nowrap;
					font-size: 24rpx;
					color: #898989;
				}
			}

			.activeTop {
				position: relative;

				&::before {
					position: absolute;
					content: '';
					bottom: 0;
					width: 50rpx;
					height: 3rpx;
					left: 50%;
					transform: translateX(-50%);
					background: #FE6E32;
					border-radius: 50rpx;
				}

				.stage-item_label {
					color: #FE6E32;
					font-weight: bold;
				}

				.tips {
					font-weight: normal;
				}
			}
		}

		.cost-list {
			height: calc(100vh - var(--status-bar-height) - 270rpx);

			.cost-list-main {
				display: flex;
				height: 100%;
				box-sizing: border-box;
			}

			.cost-list_left {
				width: 200rpx;
				overflow-y: scroll;
				overflow-x: hidden;
				margin-bottom: 30rpx;

				.tabs {
					background: #FFFFFF;
					padding: 30rpx;

					view {
						text-align: center;
						font-size: 24rpx;
						color: #8C8C8C;
					}
				}

				.active {
					background: #F7F7F7;
					position: relative;

					&::before {
						content: '';
						position: absolute;
						top: 30rpx;
						bottom: 30rpx;
						left: 0rpx;
						width: 7rpx;
						background: #FE6E32;
						border-radius: 20rpx;
					}

					view {
						color: #000000;
						font-weight: bold;
						font-weight: bold;
					}
				}

			}

			.cost-list_right {
				background: #F7F7F7;
				height: 100%;
				flex: 1;
				overflow: hidden;

				.sku-right {
					height: calc(100% - 100rpx);
					overflow-y: scroll;
					padding: 0 30rpx 30rpx;
				}

				.sku {
					background: #FFFFFF;
					border-radius: 20rpx;
					padding: 0 20rpx;

					.sku-item {
						padding: 20rpx 0;
						border-bottom: 2rpx solid #F0F0F0;

						&:last-child {
							border-bottom: none;
							margin-bottom: 30rpx;
						}
					}

					.sku-list {
						display: flex;

						.lazy-img {
							flex-shrink: 0;
						}
					}
				}

				.sku-type {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 30rpx 0;

					.sku-type_title {
						color: #000000;
						font-size: 28rpx;
						font-family: NotoSansHans-Medium;
					}

					view {
						color: #ED3832;
						font-size: 20rpx;

						text {
							color: #ED3832;
							font-size: 20rpx;
						}
					}
				}

				.sku-list_left {
					display: flex;
					flex-direction: column;
					align-items: center;

					.row {
						margin-top: 10rpx;
						font-size: 20rpx;
						text-align: center;
						color: #ff5d35;
						font-family: NotoSansHans-Medium;
						background: #FFF0EA;
						padding: 0 10rpx 2rpx;
						border-radius: 8rpx;
					}
				}

				.sku-list_right {
					margin-left: 20rpx;
					flex: 1;
					width: 300rpx;

					.sku-title {
						color: #000000;
						font-size: 24rpx;
						font-family: NotoSansHans-Medium;
						font-weight: bold;
						@include bov(2)
					}

					.sku-num {
						display: flex;
						padding: 10rpx 0;
						font-size: 20rpx;
						color: #808080;
						// @include bov(2)
					}

					.sku-num_s {
						display: flex;
						font-size: 20rpx;
						color: #808080;
						padding-bottom: 10rpx;
					}

					.sku-price {
						font-size: 20rpx;
						color: #000000;

						text {
							color: #000000;
							font-weight: bold;
							font-size: 20rpx;
						}
					}
				}
			}
		}
	}

	.flex-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.buttom {
		height: 100rpx;
		background: #FFFFFF;
	}

	.buttom-bottom {
		z-index: 99;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		@include buttonsafearea();

		.buttom_do {
			display: flex;
			margin: 10rpx 30rpx;

			view {
				flex: 1;
				text-align: center;
				border: 2rpx solid #000000;
				border-radius: 12rpx;
				font-family: PingFang-SC;
				font-size: 28rpx;
				padding: 20rpx;
				font-weight: bold;
			}

			.buttom_do-left {
				margin-right: 10rpx;
			}

			.buttom_do-right {
				background: #141414;
				color: #FFFFFF;
			}
		}
	}

	.content-sku {
		.content-sku_top {
			display: flex;
			align-items: center;

			view {
				flex: 1;
				text-align: center;
				font-size: 24rpx;
			}
		}

		.content-sku_left {
			display: flex;
			flex-direction: column;
			width: 150rpx;

			view {
				font-size: 24rpx;
				padding: 20rpx 0;
			}
		}
	}

	/deep/.u-table {
		border: none !important;

		.u-tr {
			border: none !important;

			.u-th {
				border: none !important;
				background-color: transparent !important;
				color: #141414;
				font-size: 24rpx;
			}

			.u-td {
				border: none !important;
				background-color: transparent !important;
				font-size: 24rpx !important;
				color: #141414 !important;
			}
		}
	}

	.share-icon {
		width: 34rpx;
		height: 34rpx;
		margin-right: 30rpx;
	}
</style>
