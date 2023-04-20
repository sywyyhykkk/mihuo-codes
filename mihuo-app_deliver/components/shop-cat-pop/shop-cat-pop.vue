<template>
	<u-popup v-model="showPopup" border-radius="30" :height="popupHeight" mode="bottom" @close="close"
		:safe-area-inset-bottom="false" :popup="false" :closeable="false">
		<view class="select-material-list">
			<view class="tittle">
				<u-tabs item-width="187" active-color="#002FA5" height="72" inactive-color="#787878" font-size="28"
					:list="typeList" :is-scroll="true" :current="typeActive" :active-item-style="activeItemStyle"
					@change="change" bar-width="28" bar-height="6" bg-color="#fff"></u-tabs>
			</view>
			<view class="list-contain">
				<scroll-view :scroll-y="true" class="scroll-Y" :style="{'height': listHeight + 'rpx'}" @scroll="scroll"
					@scrolltolower="scrolltolower">
					<!--可视区域里所有数据的渲染区域-->
					<!-- <div class='list-phantom' :style="{ height: getTotalHeight }"></div> -->
					<!-- :style="{transform: getTransform}" -->
					<view class="item-all" v-if="dataList.length > 0">
						<!--单条数据渲染区域-->
						<view class="item-select-material" :id=" 'item-select-material-'+ index "
							:class="[item.itemShow? '':'item-select-material-none']" v-for="(item,index) in dataList"
							:key="index">
							<view class="details-contain">
								<image-lazy-load v-show="item.itemShow && item.coverImg" :viewStatus="false" :image="item.coverImg"
									:key="index" height="146">
								</image-lazy-load>
								<view v-show="item.itemShow" class="item-other-contian">
									<view class="item-left">
										<view class="item-name">{{item.name}}</view>
										<view v-if="item.treeCode == '3000'" class="set-meal-num">{{item.totalNum}}
										</view>
										<view v-if="$isJSON(item.productSku)" class="item-specifications">
											{{$isJSON(item.productSku) && JSON.parse(item.productSku)[0]&& JSON.parse(item.productSku)[0].value}}
										</view>
										<view class="item-specifications"
											v-if="item.makeExpensesShow && makeUpExpensesStatus && Number(item.makeExpenses) > 0">
											应补{{item.makeExpenses}}</view>
										<view class="item-price">
											<text class="item-unit">￥</text>
											<text class="price-num">{{item.price}}</text>
											<text class="price-symbol" v-if="item.unit">/ {{item.unit}}</text>
										</view>
									</view>
									<view class="item-right">
										<image src="/static/images/delete_icon/delete-service.png" mode=""
											@click="getDelete(item)">
										</image>

										<!-- 套餐不允许修改数量 -->
										<view v-if="item.customCategory !== '1003'" class="public-item-calculate">
											<view class="item-operation item-operation-border-active"
												:class="[item.selectNum == 1 ? 'item-operation-display':'']"
												@click="calculate('减',item)">
												<u-icon size="24" color="#C4C4C4" name="minus"></u-icon>
											</view>
											<view class="public-input-contain">
												<u-input @input="setInput($event,item)" class="public-input-num"
													input-align="center" height="52" v-model="item.selectNum"
													:clearable="false" type="number" placeholder="" :border="false" />
											</view>
											<view class="item-operation item-operation-active"
												@click="calculate('加',item)">
												<u-icon size="24" color="#fff" name="plus"></u-icon>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view v-if="item.isPackageList && item.itemShow" class="switch-contain">
								<text class="switch-name">是否套餐内商品</text>
								<u-switch v-model="item.packageFlagSwitch" size="24" :key="item.skuId"
									active-color="#002FA5" inactive-color="#929292"
									@change="setPackageFlagSwitch($event,item)">
								</u-switch>
							</view>
							<view v-show="item.itemShow" class="input-contain_textarea">
								<textarea class="input_textarea" v-model="item.remark" @blur="syncRemark"
									maxlength="100" placeholder="请输入说明"
									placeholder-style="color:#909199;font-size: 13px" />
							</view>
						</view>
					</view>
					<mh-empty v-if="dataList.length == 0" title="这里空荡荡哒～" />
				</scroll-view>
			</view>
			<view class="bottom-add">
				<view class="item-add" @click="addResult()">
					确定
				</view>
			</view>
		</view>
	</u-popup>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	export default {
		props: {
			title: {
				type: String,
				default: '选择我的角色'
			},
			typeList: {
				type: Array,
				default: function() {
					return []
				}
			},
			value: {
				type: Boolean,
				default: false
			},
			makeUpExpensesStatus: {
				type: Boolean,
				default: false
			},

		},
		data() {
			return {
				showPopup: false,
				certifiedList: [],
				resultList: [],
				imageList: [],
				typeActive: 0,
				dataList: [],
				pageSize: 5,
				currentPage: 1,
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '30rpx'
				},
				listHeight: 1000,
				popupHeight: '1000',
				totalHeight: '1000rpx',
				listAll: [], //所有数据
				showList: [], //可视区域显示的数据				
				itemHeight: 320, //每条数据所占高度
				showNum: 6, //每次加载到可视区域的数量，itemHeight X showNum 要大于可视区域高度 ，否则页面滚动不了。
				top: 0, //偏移量
				scrollTop: 0, //卷起的高度
				startIndex: 0, //可视区域第一条数据的索引
				endIndex: 0, //可视区域最后一条数据后面那条数据的的索引，因为后面要用slice(start,end)方法取需要的数据，但是slice规定end对应数据不包含在里面	
			}
		},
		computed: {
			...mapState(['shoppingCart', 'serviceCityOperatorId', 'projectInfo', 'orderInfo', 'nodeInfo']),
			getTransform() {
				return `translate3d(0,${this.top}rpx,0)`;
			},
			getTotalHeight() {
				let len = this.shoppingCart.filter(item => item.itemShow)
				return `${len.length * this.itemHeight}rpx`;
			},
			//获取真实显示列表数据
			visibleData() {
				// 过滤数据
				let resultList = this.shoppingCart.filter(item => item.itemShow)
				return resultList.slice(this.currentPage - 1, this.pageSize)
				//可视区域显示的数据，即最后要渲染的数据。实际的数据索引是从this.startIndex到this.endIndex-1
				// console.log('this.dataList', result.length,this.startIndex, this.endIndex);
				// return result.slice(this.startIndex, this.endIndex)
			},
			//可显示的列表项数
			visibleCount() {
				// console.log('this.listHeight',this.listHeight,this.itemHeight);
				return Math.ceil(this.listHeight / this.itemHeight)
			},
		},
		watch: {
			value(val) {
				if (val) {
					this.open();
				} else if (!this.showPopup) {
					this.close();
				}
				this.showPopup = false;
			}
		},
		mounted() {
			this.value && this.open();
		},
		methods: {
			scroll(e) {
				return
				this.scrollTop = e.detail.scrollTop
				this.getShowList()
			},
			scrolltolower() {
				let resultList = this.shoppingCart.filter(item => item.itemShow)
				if (this.dataList.length == resultList.length) {
					return
				} else {
					this.currentPage++
					let start = (this.currentPage - 1) * this.pageSize
					// 结束位置 = 当前页 x 每页的大小
					let end = this.currentPage * this.pageSize

					let resultList = this.shoppingCart.filter(item => item.itemShow)
					let list = resultList.slice(start, end)

					this.dataList = [...this.dataList, ...list]
				}
			},
			//计算可视区域数据
			getShowList() {
				//可视区域第一条数据的索引
				this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
				//可视区域最后一条数据的后面那条数据的索引
				this.endIndex = this.startIndex + this.showNum;
				//在这需要获得一个可以被itemHeight整除的数来作为item的偏移量，这样随机滑动时第一条数据都是完整显示的
				this.top = this.scrollTop - (this.scrollTop % this.itemHeight);
			},
			open() {
				this.$nextTick(() => {
					this.initData()
					// this.getShowList()
					this.setTypeList()
					this.getHeight()
					this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('close')
					this.showPopup = false
				})
			},
			change(index) {
				this.typeActive = index
				this.currentPage = 1
				this.pageSize = 5
				let tempItem = this.typeList[index].name
				let activeItem = this.typeList[index]

				this.shoppingCart.forEach(item => {
					if (tempItem == '全部') {
						item['itemShow'] = true
					} else {
						if (item.treeCode.indexOf(activeItem.treeCode) !== -1) {
							item['itemShow'] = true
						} else {
							item['itemShow'] = false
						}
					}
				})

				let resultList = this.shoppingCart.filter(item => item.itemShow)
				this.dataList = resultList.slice(this.currentPage - 1, this.pageSize)

				// this.getShowList()
			},
			addResult() {
				let tempStatus = true
				try {
					this.dataList.forEach(el => {
						if (!el.selectNum) {
							this.$util.toast("商品数量不能为0");
							throw el
						}
					})
				} catch (e) {
					tempStatus = false
				}

				if (tempStatus) {
					this.close()
					this.$emit('submit')
				}
			},
			/**
			 * @description 加减数量
			 * */
			calculate(type, item) {
				if (type == '加') {
					item.selectNum++
				} else {
					if (item.selectNum > 0) {
						if (item.selectNum == 1) {
							this.$util.toast('数量不能为0')
							return
						}
						item.selectNum--
					}
				}
				this.$emit('syncList', item)
			},
			setInput(even, item) {
				this.debounce(() => {
					even = even.replace(/[^\d]/g, "")
					this.$emit('syncList', item)
				}, 200)
			},
			getDelete( item) {
				item.selectNum = 0
				
				let resultList = this.shoppingCart.filter(item1 => item1.itemShow)
				resultList = resultList.filter(item1 => item1.skuId !== item.skuId)
				this.dataList = resultList.slice(this.currentPage - 1, this.pageSize)

				let shoppingCart = this.shoppingCart.filter(item1 => item1.skuId !== item.skuId)
				this.$store.commit('setShoppingCart', shoppingCart)
				this.$emit('syncList', item, 'delete')
			},
			setTypeList() {
				let codeList = this.shoppingCart.map(item => {
					return item.treeCode
				})
				// 如果有套餐数据，则新增一个tab
				if (codeList.includes('3000')) {
					let temp = this.typeList.find(item => item.name == '套餐')
					if (!temp) {
						this.typeList.splice(1, 0, {
							name: '套餐',
							treeCode: '3000'
						})
					}
				}
			},
			syncRemark() {
				this.$emit('syncRemark')
			},
			setPackageFlagSwitch(event, item) {
				item.packageFlag = item.packageFlagSwitch ? 1 : 0
				item.price = item.packageFlagSwitch ? 0 : item.priceBack
				this.$emit('setPackageFlagSwitch', item, 'materialList')
			},
			getHeight() {
				this.$nextTick(() => {
					let classStr = '',
						classStrList = ['.tittle', '.bottom-add']
					classStr = classStrList.join(', ')
					uni.createSelectorQuery().selectAll(classStr)
						.boundingClientRect(res => {
							if (res) {
								let total = 0
								res.forEach(el => {
									total += el.height
								})
								let result = Number(uni.upx2px(this.popupHeight)) - total
								this.listHeight = this.$util.pxToRpx(result)
							}
						}).exec()

					uni.createSelectorQuery().select('#item-select-material-0')
						.boundingClientRect(res => {
							if (res) {
								this.itemHeight = this.$util.pxToRpx(res.height)
							}
						}).exec()

				})
			},
			initData() {
				// this.showPopup = true
				// this.top = 0
				// this.scrollTop = 0
				// this.startIndex = 0
				// this.endIndex = this.startIndex + this.showNum

				this.typeActive = 0
				this.showPopup = true
				this.pageSize = 5
				this.currentPage = 1

				this.shoppingCart.forEach(item => {
					item.itemShow = true
				})
				let resultList = this.shoppingCart.filter(item => item.itemShow)
				this.dataList = resultList.slice(this.currentPage - 1, this.pageSize)

			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */


	.mh-empty-page {
		/deep/ .u-empty {
			margin-top: 120rpx !important;
		}
	}


	.public-images {
		width: 116rpx;
		height: 116rpx;
		border-radius: 50%;
		background-color: #E9EFFF;
		margin-bottom: 10rpx;

	}

	.list-skill-contain {
		display: flex;
		// flex-wrap: wrap;
		padding: 0rpx 60rpx 0rpx 60rpx;
		justify-content: space-around;

		.item-skill-contain {
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 40rpx;
			// margin-right: 82rpx;
			margin-bottom: 16rpx;

		}

		.item-bottom {
			display: flex;
			flex-direction: column;

			.item-text {
				font-size: 28rpx;
				color: #303133;
				white-space: nowrap;
			}

			.item-time {
				font-size: 24rpx;
				color: #909199;
			}
		}
	}

	.select-material-list {
		height: 100%;
		background-color: #FFF;

		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			// margin: 0 20rpx;
			// border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.list-contain {
			// height: calc(100% - 280rpx);


			.scroll-Y {
				// height: 750rpx;
				position: relative;
			}

			.list-phantom {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
			}

			.item-all {
				display: flex;
				width: 100%;
				position: absolute;
				flex-direction: column;
			}

			.item-select-material {
				// transform: translate3d(0, 0, 0);
				display: flex;
				flex-direction: column;
				flex-direction: column;
				padding: 16rpx 42rpx 16rpx 62rpx;
				// max-height: 326rpx;
				// overflow: hidden;

				.item-other-contian {
					margin-left: 20rpx;
					display: flex;
					justify-content: space-between;
					flex: 1;
					padding-top: 10rpx;

					.set-meal-num,
					.item-specifications {
						font-size: 24rpx;
						color: #999999;
						@include bov(1);
					}

				}

				.item-left {
					.item-name {
						color: $seconFontColor;
						font-size: $middleFontSize;
						// margin-bottom: 4rpx;
						@include bov(2);
					}


					.item-price {
						.item-unit {
							color: $errorFontColor;
							font-size: 24rpx;
						}

						.price-num {
							color: $errorFontColor;
							font-size: $mainFontSize;
						}

						.price-symbol {
							margin-left: 6rpx;
							color: $errorFontColor;
							font-size: 26rpx;
						}
					}


				}

				.item-right {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					justify-content: space-between;

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
					}

					.item-price {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-bottom: 16rpx;
					}
				}
			}

			.item-select-material-none {
				padding: 0rpx;

			}
		}

		.bottom-add {
			display: flex;
			position: absolute;
			bottom: 0rpx;
			justify-content: center;
			padding: 0 26rpx;
			padding-bottom: 20rpx;
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

	.public-input-contain {
		width: 68rpx;
		// background-color: #F6F6F6;
		border-radius: 4rpx;
		font-size: 24rpx;
		height: 52rpx;
		margin: 0 2rpx 0 2rpx;
		border: 0.5px solid #EEEEEE;


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
			border: 1rpx solid #EEEEEE;
			border-radius: 4rpx;
		}

		.item-operation-active {
			background-color: $themeColor;
		}

		.item-operation-border-active {
			border-color: $themeColor;
		}

		.item-operation-display {
			background-color: #e3e1e1;
			border-color: #e3e1e1;
		}
	}

	.details-contain {
		display: flex;
	}

	.switch-contain {
		display: flex;
		align-items: center;
		margin-top: 30rpx;

		.switch-name {
			color: $mainFontColor;
			font-size: $middleFontSize;
			margin-right: 10rpx;
		}
	}

	.all-contain {
		display: flex;
	}

	.input-contain_textarea {
		margin-top: 20rpx;
		background-color: #F6F7F9;
		border-radius: 10rpx;
		padding: 10rpx 16rpx;

		/deep/ .u-input__input {
			color: #303133;
		}

		.input_textarea {
			border-radius: 8rpx;
			background: #F7F7F7;
			width: 100%;
			height: 100rpx;
			font-size: 28rpx
		}
	}
</style>
