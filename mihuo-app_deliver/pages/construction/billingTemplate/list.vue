<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.template-page {
		padding-bottom: 80rpx;
		
		.search-contain {
			margin-bottom: 8rpx;
			position: sticky;
			width: 100%;
			top: 0;
			// top: calc(88rpx + var(--status-bar-height));
			background-color: #fff;
			padding: 28rpx 34rpx;
			z-index: 10;
		}


		.item-contain {
			padding: 28rpx 30rpx;
			margin-bottom: 6rpx;
			background-color: #fff;
			border-radius: 10rpx;

			.top {

				.name {
					font-size: $middleFontSize;
					color: $seconFontColor;
					line-height: 38rpx;
					font-weight: bold;
				}
			}

			.content {
				margin-top: 10rpx;

				.item-label {
					margin-right: 80rpx;
				}

				.left {
					display: flex;
					flex: 1;
				}

				.label {
					color: $mainFontColor;
					font-size: $middleFontSize;
					line-height: 38rpx;
					margin-right: 6rpx;
				}

				.value {
					color: $seconFontColor;
					font-size: $middleFontSize;
					line-height: 38rpx;
				}

				.total {
					color: $errorFontColor;
					font-size: $middleFontSize;
					line-height: 38rpx;
				}
			}
		}
	}

	/deep/ .search-box {
		width: initial;
	}

	/deep/ .content {
		height: initial !important;
	}
</style>


<template>
	<view class="template-page">
		<view class="search-contain">
			<mihuo-search class="search-box" button="inside" @search="getSearch"></mihuo-search>
		</view>
		<view class="list-contain">
			<view class="item-contain" v-for="(item,index) in  materialTemplateList" :key="index"
				@click="getDetails(item)">
				<view class="top display-justify_between">
					<text class="name">{{item.templateName}}</text>
					<u-icon name="arrow-right" size="24" color="#D9D9D9"></u-icon>
				</view>
				<view class="content display-justify_between">
					<view class="left">
						<view v-if="item.customCategory1001Count" class="item-label">
							<text class="label">主材</text>
							<text class="value">{{item.customCategory1001Count }}</text>
						</view>
						<view v-if="item.customCategory1002Count" class="item-label">
							<text class="label">辅材</text>
							<text class="value">{{item.customCategory1002Count }}</text>
						</view>
						<view v-if="item.customCategory1003Count" class="item-label">
							<text class="label">人工</text>
							<text class="value">{{item.customCategory1003Count  }}</text>
						</view>
					</view>
					<view class="right">
						<text class="total">总价：{{item.allAmount}}</text>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="materialTemplateData.length == 0" title="这里空荡荡哒～" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import operation from '@/plugins/mathoperation.js'
	export default {
		data() {
			return {
				option: {},
				currentCompanyId: '',
				currentCompany: '',
				orderMaterialTemplateId: '',
				search: '',
				pageSize: 20,
				currentPage: 1,
				materialTemplateListActive: 0,
				materialTemplateList: [],
				materialTemplateData: [],
				materialTemplateItem: [],
				treeList: [],
				resultList: [],
				tempResultList: []
			}
		},
		computed: {
			...mapState(['nodeInfo']),
		},
		mounted() {

		},
		onShow() {

		},
		watch:{
		},
		onReachBottom() { //与methods 同级
			if (this.materialTemplateList.length == this.materialTemplateData.length) {
				return
			} else {
				if(this.search){
					return
				}
				this.currentPage++
				let start = (this.currentPage - 1) * this.pageSize
				// 结束位置 = 当前页 x 每页的大小
				let end = this.currentPage * this.pageSize
				let list = this.materialTemplateData.slice(start, end)
				this.materialTemplateList = [...this.materialTemplateList, ...list]
			}
		},
		onLoad(option) {
			this.option = option
			this.getTypeList()
			this.getCompanyMaterialTemplateList()
		},
		methods: {
			getSearch(value){
				this.search = value
				this.materialTemplateList = this.materialTemplateData.filter(item =>item.templateName.indexOf(this.search) !== -1)
			},
			getTypeList() { // 查询分类
				this.$httpApi.getListByTreeCodeTree({}).then(res => {
					if (res) {
						this.treeList = JSON.parse(JSON.stringify(res))
					}
				})
			},
			/**
			 * @description 查询sop关联的选材模板
			 * */
			getCompanyMaterialTemplateList() {
				// 如果是工作台节点进入的，开单模板可以不查
				if (uni.getStorageSync('clientBilling')) {
					if (this.nodeInfo.materialTemplateIds) {
						let tempIds = this.nodeInfo.materialTemplateIds.split(',')
						this.$httpApi.getCompanyMaterialTemplateListByIds({
							ids: tempIds
						}).then(res => {
							if (res) {
								this.materialTemplateData = res
								this.materialTemplateList = this.materialTemplateData.slice(this.currentPage - 1,
									this
									.pageSize)


							}
						})
					}
				} else {
					this.getMaterialTemplateByCompanyId()
				}
			},
			getMaterialTemplateByCompanyId() {
				if (this.option.pageType == '快速预算') {
					this.$httpApi.getMaterialTemplateByCompanyId({
						cityOperatorId: uni.getStorageSync('cityOperatorId')
					}).then(res => {
						if (res) {
							this.materialTemplateData = res
							this.materialTemplateList = this.materialTemplateData.slice(this.currentPage - 1, this
								.pageSize)

						}
					})
				}
			},
			getDetails(item) {
				this.toPage(`/pages/construction/billingTemplate/details?id=${item.id}`)
			},
			getMaterialListPrice(item) {
				let tempList = []
				item.dataList.forEach(el => {
					tempList.push(operation.floatMul(el.quantity + '', el.price || 0))
				})
				let resultPice = operation.funCalc(tempList)
				return resultPice
			},
		}
	}
</script>
