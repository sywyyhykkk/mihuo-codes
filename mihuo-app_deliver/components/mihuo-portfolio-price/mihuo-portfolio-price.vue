<template>
	<view class="mihuo-portfolio-price">
		<view class="select-material" v-if="serviceGoodsList.length > 0">
			<view class="left">
				<scroll-view :scroll-x="true" class="scroll-X">
					<view class="material-list">
						<view class="item-select-material" v-for="(item,index) in serviceGoodsList" :key="index">
							<u-lazy-load v-if="item.coverImg" class="item-image" height="120" :style="{ width: '120rpx' }"
								@click="preview(index)" imgMode="aspectFill" border-radius="10"
								:image="$util.thumbnailImage(item.coverImg,true)">
							</u-lazy-load>
							<image @click="preview(index)" v-else class="item-image-default" src="/static/images/no_price.jpg" mode=""></image>
							<view class="material-name">
								{{item.name}}
							</view>
							<image v-if="isEditor" class="icon-image" src="/static/images/icon_close/price-close.png"
								mode="" @click="getDelete(item)"></image>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="right" @click="getJump()">
				<view class="item-pice">
					<text class="symbol">￥</text>{{selectServicePice}}
				</view>
				<view class="item-num">
					共{{selectService}}件
				</view>
			</view>
		</view>
		<u-popup v-model="selectMaterialListShow" border-radius="30" height="1000" mode="bottom"
			:safe-area-inset-bottom="false" :closeable="true">
			<view class="select-material-list">
				<view class="tittle">
					已选服务
				</view>
				<view class="list-contain">
					<scroll-view :scroll-y="true" class="scroll-Y">
						<view class="item-select-material" v-for="(item,index) in serviceGoodsList" :key="index">
							<view class="item-left">
								<view class="item-name">{{item.name}}</view>
								<view class="item-specifications"></view>
								<view class="item-unit">￥{{item.price}}/{{item.unit}}</view>
							</view>
							<view class="item-right">
								<image v-if="isEditor" src="/static/images/delete_icon/delete-service.png" mode=""
									@click="getDelete(item)">
								</image>
								<view class="item-price">￥{{item.totalPice}}
								</view>
								<view class="public-item-calculate" v-if="isEditor">
									<view class="item-operation" @click="calculate('减',item)">
										<u-icon size="24" color="#C4C4C4" name="minus"></u-icon>
									</view>
									<!-- <text class="calculate-num">{{item.selectNum}}</text> -->
									<view class="public-input-contain">
										<u-input  @input="setInput($event,item,item.type)" class="public-input-num"
											input-align="center" height="52" v-model="item.selectNum"
											:clearable="false" type="number" placeholder="" :border="false" />
									</view>
									<view class="item-operation" @click="calculate('加',item)">
										<u-icon size="24" color="#3A3838" name="plus"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="bottom-add">
					<view class="item-add" @click="addResult()">
						确定
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'mihuo-portfolio-price',
		props: {
			value: {
				type: Object,
				default () {
					return {};
				}
			},
			isEditor: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				selectMaterialListShow: false
			}
		},
		watch: {
			serviceGoodsList: {
				handler(newVal, oldVal) {
					this.getUpdate()
				},
				deep: true
			}
		},
		computed: {
			...mapState(['serviceGoodsList']),
			selectServicePice() {
				let tempPice = []
				console.log('this.serviceGoodsList',this.serviceGoodsList);
				this.serviceGoodsList.map(item => {
					tempPice.push(operation.floatMul(item.budgetNum || item.selectNum, item.price ||0))
									
				})
				let resultPice = operation.funCalc(tempPice)
				return resultPice
			},
			selectService() {
				let tempNum = 0
				this.serviceGoodsList.map(item => {
					if (item.selectNum) {
						tempNum += Number(item.selectNum)
					}

				})
				return tempNum
			},
			setProductJson() {
				let tempList = []
				let resultList = this.analysisData(this.serviceGoodsList)
				resultList.map(item => {
					tempList.push({
						skillType: item.skillType,
						skillTypeName: item.skillTypeName,
						skillId: item.skillType,
						skillName: item.skillTypeName,
						totalPrice: item.totalPrice,
						productJson: []
					})
				})
				resultList.map(ev => {
					tempList.map(el => {
						if (ev.skillType == el.skillType) {
							ev.list.map(item => {
								el.productJson.push({
									name: item.name,
									selectNum: item.selectNum,
									price: item.tempPrice,
									tempPrice: item.tempPrice,
									totalPice: item.totalPice,
									unit: item.unit,
									id: item.id,
									type: item.type,
									coverImg: item.coverImg || '',
									skillType: item.skillType,
									skillTypeName: item.skillTypeName,
									skillId: item.skillType,
									skillName: item.skillTypeName,
									platformTreeCode: item.platformTreeCode
								})
							})
						}
					})
				})
				tempList.map(item => {
					item.productJson = JSON.stringify(item.productJson)
				})
				if (tempList.length > 0) {
					return tempList // 组合报价商品信息
				} else {
					return ''
				}
			},
			setGroupPrices(){
				let tempList = []
				let materialList = []
				let tempArtificialList = []
				let tempMaterialList = []
				let resutlArtificialList = [] //  材料数据
				let resutlMaterialListList = [] // 人工 (人工、服务、自定义)
				
				// 1.按分类 主材、辅材、人工 分组
				let dataAll = this.setMaterialType(this.serviceGoodsList, 'type')
				if (dataAll.length > 0) {
					tempArtificialList = dataAll.filter(item => ['人工', '服务', '自定义'].includes(item.type))
					tempMaterialList = dataAll.filter(item => ['主材', '辅材'].includes(item.type))
					if (tempArtificialList.length > 0) {
						tempArtificialList.forEach(el => {
							el.list.forEach(ev => {
								resutlArtificialList.push(ev)
							})
						})
					}
					if (tempMaterialList.length > 0) {
						tempMaterialList.forEach(el => {
							el.list.forEach(ev => {
								resutlMaterialListList.push(ev)
							})
						})
					}
					// 2.按材料类型分组(例如：地砖、吊灯)
					materialList = this.setMaterialType(resutlMaterialListList, 'productCategoryName')
					// 3.按材料类型统计价格
					materialList = this.setMaterialPrice(materialList)
				}
				// 4.按工种分组(人工、服务、服务包)
				let resultList = this.analysisData(resutlArtificialList)
				
				resultList.map(item => {
					tempList.push({
						skillType: item.skillType,
						skillTypeName: item.skillTypeName,
						totalPrice: item.totalPrice,
						businessName: item.businessName,
						businessTypeName: item.businessTypeName,
						topId:item.topId,
						products: [],
					})
				})
				
				resultList.map(ev => {
					tempList.map(el => {
						if (ev.skillType == el.skillType) {
							ev.list.map(item => {
								el.products.push({
									type: item.type,
									productName: item.name,
									productId: item.id,
									budgetNum: item.selectNum,
									price: item.tempPrice,
									totalPice: item.totalPice,
									productImg: item.coverImg,
									platformTreeCode: item.platformTreeCode,
									categroyId: item.categroyId,
									categroyName: item.categroyName,
								})
							})
						}
					})
				})
				
				let resultOfferList = []
				if (tempList.length > 0) {
					//添加人工相关
					tempList.forEach(el => {
						resultOfferList.push({
							businessId: el.skillType, // 业务id			
							businessName: el.skillTypeName || '其他', // 业务名称			
							businessType: 1, //	业务分类 1人工，2材料    人工包含人工、服务、服务包		
							products: el.products,
							source: 4, // 1订单，2变更订单，3项目预算，4材料管理）
							totalPrice: el.totalPrice,
							topName: el.businessTypeName,
							topId: el.topId,
							type: 1 // 0-发单方报价；1-接单方报价 
						})
					})
				}
				
				// 材料
				if (materialList.length > 0) {
					materialList.forEach(el => {
						resultOfferList.push({
							businessId: el.businessTypeId, // 业务id			
							businessName: el.businessTypeName, // 业务名称			
							businessType: 2, // 业务分类 1人工，2材料   
							productJson: '', // 商品json
							products: [],
							productList: el.list,
							source: 4, // 1订单，2变更订单，3项目预算，4材料管理）
							totalPrice: el.totalPrice,
							topName: el.materialType,
							topId: el.topId,
							type: 1, // 0-发单方报价；1-接单方报价 
				
						})
					})
				}
				// 材料
				resultOfferList.forEach(el => {
					if (el.businessType == 2) {
						el.productList.forEach(item => {
							el.products.push({
								id: item.id,
								price: item.price,
								productId: item.id,
								budgetNum: item.selectNum, // 预算数量
								categroyId: item.categroyId, // 分类id
								categroyName: item.categroyName,
								platformTreeCode: item.platformTreeCode,
								productName: item.name,
								productImg: item.coverImg,
								totalPrice: operation.floatMul(item.selectNum, item.price ||
									0),
							})
						})
					}
				})
				resultOfferList.forEach(el => {
					el.productList = []
				})
				
				return resultOfferList
			}
		},
		mounted() {
			this.getUpdate()
		},
		methods: {
			setMaterialType(result, itemType) {
				let map = {}
				let dest = []
				let resultList = []
				result.forEach(item => {
					if (!map[item[itemType]]) {
						dest.push({
							type: item[itemType],
							materialType: item.type,
							topId: item.topId,
							totalPrice: '',
							businessTypeName: item[itemType],
							businessTypeId: item.platformCategoryId,
							allTotalPiceList: [],
							list: [item]
						})
						map[item[itemType]] = item
					} else {
						dest.forEach(el => {
							if (el.type == item[itemType]) {
								el.list.push(item)
							}
						})
					}
			
				})
				resultList = [...dest]
				return resultList
			},
			analysisData(list) {
				// 按工种组装数据，自定义服务默认为自定义分组
				if (list.length > 0) {
					let tempList = JSON.parse(JSON.stringify(list))
					tempList.map(item => {
						item['allTotalPiceList'] = []
						if (!item.skillType) {
							// item['skillType'] = -1
							item.type = '自定义'
						}
						if (item.type == '自定义') {
							item['skillType'] = -1
						}
						
					})
					let tempListResult = this.setAnalysisData(tempList)
					// 根据工种统计价格
					tempListResult.map(item => {
						if (item.list.length > 0) {
							item.list.map(ev => {
								// 1.数量*价格
								item['allTotalPiceList'].push(operation.floatMul(ev.selectNum, ev
									.tempPrice || 0))
							})
							// 2.价格相加
							item['totalPrice'] = operation.funCalc(item.allTotalPiceList)

						}
					})
					return tempListResult
				} else {
					return []
				}
			},
			setAnalysisData(result) {
				let map = {}
				let dest = []
				let resultList = []
				result.forEach(item => {
					if (!map[item.skillType]) {
						dest.push({
							skillType: item.skillType,
							skillTypeName: item.skillTypeName,
							totalPrice: '',
							topId: item.topId,
							businessTypeName: item.type,
							allTotalPiceList: [],
							list: [item]
						})
						map[item.skillType] = item
					} else {
						dest.forEach(el => {
							if (el.skillType == item.skillType) {
								el.list.push(item)
							}
						})
					}
				
				})
				resultList = [...dest]
				return resultList
			},
			getUpdate() {
				this.$emit('input', {
					totalPrice: this.selectServicePice,
					productJson: this.setProductJson,
					groupPrices:this.setGroupPrices,
				})
			},
			getDelete(item) {
				let tempList = this.serviceGoodsList
				tempList = tempList.filter(ev => ev.id !== item.id)
				this.$store.commit('setServiceGoodsList', tempList)
				this.getUpdate()
			},
			setInput(even, item, typeName) {
				this.debounce(() => {
					this.calculate('', item, Number(even))
				}, 200)
			},
			calculate(type, item,operationNumber) {
				let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
				let tempSelect = tempList.find(ev => ev.id == item.id)
				if (tempSelect) {
					if (type == '加') {
						tempSelect.selectNum++
					} else {
						if(type == '减'){
							if (tempSelect.selectNum > 0) {
								tempSelect.selectNum--
							}
						}else{
							if (!operationNumber) {
								operationNumber = ''
							}
							tempSelect.selectNum = operationNumber
						}
					}
				}
				tempList.map(item => {
					if (item.id == tempSelect.id) {
						item.selectNum = tempSelect.selectNum
						item.totalPice = operation.floatMul(tempSelect.selectNum, tempSelect.tempPrice || 0)
					}
				})
				this.$store.commit('setServiceGoodsList', tempList)
				// this.$forceUpdate()
			},
			getJump() {
				if (!this.isEditor) {
					return
				}

				this.toPage('/pages/publishTask/portfolioPrice')
			},
			preview(url) {
				// uni.previewImage({
				// 	current: 0,
				// 	urls: [url],
				// 	loop: true,
				// 	indicator: 'number'
				// });
				this.selectMaterialListShow = true
			},
			addResult() {
				let tempList = JSON.parse(JSON.stringify(this.serviceGoodsList))
				tempList = tempList.filter(item => item.selectNum != 0)
				this.$store.commit('setServiceGoodsList', tempList)
				this.selectMaterialListShow = false
			},
			setMaterialPrice(list) {
				list.map(item => {
					if (item.list.length > 0) {
						item.list.map(ev => {
							item['allTotalPiceList'].push(operation.floatMul(ev.selectNum, ev
								.tempPrice || 0))
						})
						item['totalPrice'] = operation.funCalc(item.allTotalPiceList)
					}
				})
				return list
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.public-input-contain {
		width: 68rpx;
		// background-color: #F6F6F6;
		border-radius: 4rpx;
		font-size: 24rpx;
		height: 52rpx;
		margin: 0 2rpx 0 2rpx;
		border: 0.5px solid #EEEEEE;
		// display: flex;
		// align-items: center;
		// line-height: 52rpx;
	
	
		/deep/ .uni-input-input {
			color: #909199;
		}
	
		/deep/ .u-input__right-icon {
			padding-right: 0rpx !important;
		}
	}
	
	.public-item-calculate {
		display: flex;
		align-items: center;

		.calculate-num {
			margin: 0rpx 16rpx;
			color: $seconFontColor;
			font-size: $middleFontSize;
		}

		.item-operation {
			width: 52rpx;
			height: 52rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 0.5px solid #EEEEEE;
			border-radius: 2px;
		}
	}

	.select-material {
		display: flex;
		justify-content: space-between;
		width: 100%;

		.left {
			.material-list {
				padding-top: 10rpx;
				width: 500rpx;
				display: flex;
			}

			.item-select-material {
				margin-right: 14rpx;
				position: relative;

				.material-name {
					margin-top: 8rpx;
					width: 120rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					color: $viceFontColor;
					white-space: nowrap;
					font-size: $smiddleFontSize;
				}

				.icon-image {
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					width: 30rpx;
					height: 30rpx;
					z-index: 10;
				}
				
				.item-image-default{
					width: 120rpx;
					height: 120rpx;
					border-radius: 20rpx;
				}
			}
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 100%;
			align-items: flex-end;

			.item-pice {
				font-size: 32rpx;
				font-weight: bold;
				color: $errorFontColor;
			}

			.symbol {
				font-size: 24rpx;
				color: $errorFontColor;
			}

			.item-num {
				font-size: 30rpx;
				color: $viceFontColor;
			}

		}

	}

	.select-material-list {
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
			height: calc(100% - 280rpx);

			.scroll-Y {
				height: 100%;
			}
			
			

			.item-select-material {
				display: flex;
				justify-content: space-between;
				padding: 46rpx 42rpx 46rpx 62rpx;
				border-bottom: 1rpx solid #EEEEEE;
				
				
				// touch-action: none;

				.item-left {
					.item-name {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-bottom: 4rpx;
					}

					.item-specifications {
						font-size: $smallFontSize;
						color: $viceFontColor;
						margin-bottom: 20rpx;
					}

					.item-unit {
						color: $seconFontColor;
						font-size: $smallFontSize;
					}

				}

				.item-right {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					margin-top: -20rpx;

					.calculate-num {
						display: flex;
						align-items: center;
						height: 52rpx;
						border: 0.5px solid #EEEEEE;
						border-radius: 2px;
						padding: 0 32rpx;
						margin: 0rpx 4rpx;
					}

					image {
						width: 32rpx;
						height: 34rpx;
						margin-bottom: 20rpx;
					}

					.item-price {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-bottom: 16rpx;
					}
				}
			}
		}

		.bottom-add {
			position: fixed;
			bottom: 30rpx;
			display: flex;
			justify-content: center;
			width: 100%;

			.item-add {
				width: 624rpx;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: $themeColor;
				border-radius: $miniBorderRadius;
				color: #fff;

			}
		}
	}
</style>
