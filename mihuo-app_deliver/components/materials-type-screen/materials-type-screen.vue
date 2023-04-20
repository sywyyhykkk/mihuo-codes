<template>
	<view class="materials-type-screen">
		<view class="top-contain">
			<view class="item-contain" @click="getTopActive(index,item)" v-for="(item,index) in list" :key="item.id"
				:class="[(topActiveIndex === index && item.selectActive) ? 'item-contain-active':'']">
				{{item.name}}
				<u-icon class="icon-down" name="arrow-down"
					:color=" (topActiveIndex === index && item.selectActive) ? '#002FA5' :'#909199'" size="20"></u-icon>
			</view>
		</view>
		<view class="screen-middle">
			<view class="left-contain">
				<scroll-view class="left-nav-bar" :scroll-y="true">
					<view class="type-contain-default"
						:class="[(leftTypeActiveIndex == index && item.selectActive) ? 'type-contain-active':'type-contain']"
						v-for="(item,index) in setLeftTypeList" :key="index" @click="getLeftTypeActive(index,item)">
						{{ setName(item.name) }}
					</view>
				</scroll-view>
			</view>
			<view class="right-contain">
				<scroll-view class="right-nav-bar" :scroll-y="true">
					<view class="right-list-contain" v-if="rightTypeList.length >0">
						<view class="item-type-contain" v-for="(item,index) in rightTypeList" :key="index">
							<view class="item-right-title">
								{{item.title}}
							</view>
							<view class="item-children-list" v-if="item.list.length > 0">
								<view class="item-children-default"
									:class="[(rightTypeActiveIndex == el.id && el.selectActive) ? 'item-children-active':'item-children']"
									v-for="(el,num) in item.list" :key="num" @click="getRightTypeActive(el,index,num)">
									{{el.name}}
								</view>
							</view>
						</view>
					</view>
					<!-- <view v-else class="no-material-list">
						<view class="item-no">
							<image src="/static/images/sousuo.png" mode=""></image>
							<view class="desc">
								<view class="no-text">暂无数据</view>
							</view>
						</view>
					</view> -->
				</scroll-view>
			</view>
		</view>
		<view class="screen-button-bottom">
			<view class="item-contain" @click="cancel()">取消</view>
			<view class="item-contain" @click="determine()">确定</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 材料类型筛选
	 */
	import {
		mapState,
	} from 'vuex'
	import {
		deepClone
	} from '@/plugins/utils.js'
	export default {
		name: 'materials-type-screen',
		props: {

		},
		data() {
			return {
				topActiveIndex: -1,
				list: [],
				tempList: [],
				childrenActiveIndex: 0,
				selectActiveObject: {},
				leftTypeActiveIndex: -1,
				rightTypeActiveParentIndex: 0,
				rightTypeActiveIndex: 0,
				rightTypeList: []
			}
		},
		mounted() {
			this.getTypeList()
		},
		computed: {
			...mapState(['orderInfo', 'screeningIndex']),
			setLeftTypeList() {
				if (this.list[this.topActiveIndex]) {
					return this.list[this.topActiveIndex].children
				} else {
					return []
				}
			},
			setRightTypeList() {
				if (this.list[this.topActiveIndex]) {
					if (this.list[this.topActiveIndex].children) {
						if (this.list[this.topActiveIndex].children[this.leftTypeActiveIndex]) {
							return this.list[this.topActiveIndex].children[this.leftTypeActiveIndex].children
						} else {
							return []
						}
					} else {
						return []
					}
				} else {
					return []
				}
			},
			setRightTitle() {
				if (this.list[this.topActiveIndex]) {
					if (this.list[this.topActiveIndex].children) {
						if (this.list[this.topActiveIndex].children[this.leftTypeActiveIndex]) {
							return this.list[this.topActiveIndex].children[this.leftTypeActiveIndex].name
						}
						return ''
					} else {
						return ''
					}
				} else {
					return ''
				}
			},
			

		},
		methods: {
			getTypeList() {
				this.$httpApi.productCategory({
					companyId: this.orderInfo.companyId,
				}).then(res => {
					if (res) {
						this.list = res
						if (this.list.length > 0) {
							this.setIteration(this.list)
						}
						this.tempList = deepClone(this.list)
						this.setActiveIndex()

					}
				})
			},
			setIteration(data) {
				// data.map(el => {
				// 	el['show'] = true
				// 	el['tempChildren'] = el.children
				// 	el.children && el.children.map(item => {
				// 		item['show'] = true
				// 		el['tempChildren'] = el.children
				// 		if (item.children && item.children.length > 0) {
				// 			this.setIteration(item.children)
				// 		}
				// 	})
				// })
				data.map(el => {
					el['selectActive'] = false
					el['treeCodeData'] = el.treeCode
					el.children && el.children.map(item => {
						item['selectActive'] = false
						item['treeCodeData'] = item.treeCode
						if (item.children && item.children.length > 0) {
							this.setIteration(item.children)
						}
					})
				})
			},
			setActiveIndex() {
				if (this.screeningIndex.topActiveIndex !== -1) {
					this.topActiveIndex = this.screeningIndex.topActiveIndex
					this.list[this.topActiveIndex].selectActive = true
				}
				if (this.screeningIndex.leftTypeActiveIndex !== -1) {
					this.leftTypeActiveIndex = this.screeningIndex.leftTypeActiveIndex
					this.setLeftTypeList[this.leftTypeActiveIndex].selectActive = true
					this.setChildrenNumber()
				}
				if (this.screeningIndex.rightTypeActiveIndex !== 0) {
					this.rightTypeActiveIndex = this.screeningIndex.rightTypeActiveIndex
					this.rightTypeList[this.screeningIndex.rightTypeActiveParentIndex]['list'].map(item => {
						if (item.id == this.rightTypeActiveIndex) {
							item.selectActive = true
						}
					})
				}

				if (this.screeningIndex.selectActiveObject) {
					this.selectActiveObject = this.screeningIndex.selectActiveObject
				}
			},
			getTopActive(index, item) {
				this.topActiveIndex = index
				this.list = this.setSelectActive(this.list, item)
				if (this.list[this.topActiveIndex].selectActive) {
					item.treeCode = item.treeCodeData
					this.selectActiveObject = item
					this.list[this.topActiveIndex].children = this.tempList[this.topActiveIndex].children
				} else {
					this.topActiveIndex = ''
					this.selectActiveObject = {}
					if(this.list[this.topActiveIndex]){
						this.list[this.topActiveIndex].children = []
					}
				}
				this.rightTypeList = []
				this.leftTypeActiveIndex = -1
				this.rightTypeActiveIndex = 0
				this.setInitialize()				
			},
			setInitialize(){
				// 数据置空了，但引用好像还存在
				if(this.list[this.topActiveIndex]){
					this.list[this.topActiveIndex].children.map(item =>{
						item.selectActive = false
					})
				}
			},
			setChildren() {
				return this.list[this.topActiveIndex] && this.list[this.topActiveIndex].children
			},
			selectActive(data) {
				if (data) {
					this.selectActiveObject = data
				}
			},
			getLeftTypeActive(index, item) {
				this.rightTypeActiveIndex = 0
				this.rightTypeList = []
				this.list[this.topActiveIndex].children = this.setSelectActive(this.list[this.topActiveIndex].children,
					item)
				this.leftTypeActiveIndex = index
				if (this.list[this.topActiveIndex].children[this.leftTypeActiveIndex].selectActive) {
					item.treeCode = item.treeCodeData
					this.selectActiveObject = item
					this.setChildrenNumber()
					this.rightTypeList.map(item =>{
						item.list.map(ev =>{
							ev.selectActive = false
						})
					})
				} else {
					this.leftTypeActiveIndex = ''
					this.selectActiveObject = this.setTreeCode(item, 2)
				}
			},
			getRightTypeActive(item, index, num) {
				this.rightTypeList = this.setSelectActive(this.rightTypeList, item)
				if (this.rightTypeList[index]['list'][num].selectActive) {
					this.rightTypeActiveIndex = item.id
					this.rightTypeActiveParentIndex = index
					item.treeCode = item.treeCodeData
					this.selectActiveObject = item
				} else {
					this.rightTypeActiveIndex = 0
					this.selectActiveObject = this.setTreeCode(item, 3)
				}
			},
			setSelectActive(list, item) {
				if (list && list.length > 0) {
					list.map(en => {
						if (en.list) {
							en.list.map(el => {
								if (el.id == item.id) {
									el.selectActive = !el.selectActive
								} else {
									el.selectActive = false
								}
							})
						} else {
							if (en.id == item.id) {
								en.selectActive = !en.selectActive
							} else {
								en.selectActive = false
							}
						}
					})
					return list
				} else {
					return []
				}
			},
			setTreeCode(item, num) {
				let tempCodeList = item.treeCodeData.split('-')
				item.treeCode = tempCodeList.slice(0, num).join('-')
				return JSON.parse(JSON.stringify(item))
			},
			setChildrenNumber() {
				let tempParameter = {
					title: this.setRightTitle,
					level: 1,
					list: [],
				}
				this.setRightTypeList.map(item => {
					if (!item.children) {
						tempParameter.list.push(item)
					}
				})
				this.rightTypeList.push(tempParameter)
				this.isChildren()
				// this.rightTypeList.map(item => {
				// 	if (item.list.length > 0) {
				// 		item.list.map(ev => {
				// 			ev['selectActive'] = false
				// 			ev['treeCodeData'] = ev.treeCode
				// 		})
				// 	}
				// })
			},
			isChildren() {
				this.setRightTypeList.map((item, index) => {
					this.isRecursive(item.children, item)
				})
			},
			isRecursive(list, event) {
				if (!list) {
					return
				}
				if (list.length == 0) {
					return
				}
				let tempParameter = {
					title: '',
					level: '',
					list: [],
				}
				list.map(item => {
					tempParameter.title = event.name
					tempParameter.level = event.level
					tempParameter.list.push(item)
					this.isRecursive(item.children, item)
				})
				this.rightTypeList.push(tempParameter)
				this.rightTypeList = this.rightTypeList.sort(this.sortArr('level'))
			},
			sortArr(attr) {
				return function(a, b) {
					return a[attr] - b[attr]
				}
			},
			setName(str) {
				if (str && str.length > 4) {
					str = str.substring(0, 4) + '...'
				}
				return str
			},
			determine() {
				let screeningIndex = {
					topActiveIndex: this.topActiveIndex,
					leftTypeActiveIndex: this.leftTypeActiveIndex,
					rightTypeActiveIndex: this.rightTypeActiveIndex,
					rightTypeActiveParentIndex: this.rightTypeActiveParentIndex,
					selectActiveObject: this.selectActiveObject
				}
				this.$store.commit('setScreeningIndex', screeningIndex)
				this.$emit('determine', this.screeningIndex.selectActiveObject)
			},
			cancel() {
				this.$emit('cancel')
			}

		}
	}
</script>

<style lang="scss" scoped>
	.materials-type-screen {
		background-color: #FFFFFF;
		height: calc(100vh - 88rpx);
		position: relative;
		z-index: 20;

		.top-contain {
			font-size: $smallFontSize;
			display: flex;
			border-bottom: 2rpx solid #ebebeb;
			border-top: 2rpx solid #ebebeb;
			overflow-y: auto;
			padding: 20rpx 20rpx;
			min-height: 110rpx;

			.item-contain {
				// padding-right: 30rpx;
				white-space: nowrap;
				margin-right: 14rpx;
				padding: 14rpx 20rpx;
				font-size: $middleFontSize;
				color: #909199;


				.icon-down {
					margin-left: 12rpx;
				}

			}

			.item-contain-active {
				color: $themeColor;
				// border-bottom: 4rpx solid $themeColor;
			}
		}

		.screen-middle {
			display: flex;
			height: calc(100vh - var(--status-bar-height) - 332rpx);

			.left-contain {
				height: 100%;
				width: 200rpx;
				border-right: 2rpx solid #f5f5f5;
				padding: 50rpx 0rpx;

				.left-nav-bar {
					height: 100%;
				}

				.type-contain-default {
					margin-bottom: 60rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}
				}

				.type-contain {
					color: #606166;
					font-size: 26rpx;
					text-align: center;
				}

				.type-contain-active {
					font-size: 15px;
					color: #303133;
					text-align: center;
					position: relative;

					&:before {
						content: '';
						width: 6rpx;
						height: 16rpx;
						border-radius: 10rpx;
						position: absolute;
						left: 20rpx;
						background: #002FA5;
						top: 14rpx;
					}
				}
			}

			.right-contain {
				height: 100%;
				width: calc(100vw - 200rpx);
				padding: 26rpx 32rpx;

				.right-nav-bar {
					height: 100%;

					.right-list-contain {
						height: 100%;
					}

					.right-no-list {
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.item-right-title {
						font-size: 28rpx;
						color: #303133;
						margin-bottom: 26rpx;
					}

					.item-children-list {
						display: flex;
						flex-wrap: wrap;

						.item-children-default {
							border-radius: 5px;
							font-size: 26rpx;
							width: 140rpx;
							height: 72rpx;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							text-align: center;
							line-height: 72rpx;
							margin-right: 28rpx;
							margin-bottom: 20rpx;
							padding: 0 12rpx;

							&:nth-of-type(3n + 0) {
								margin-right: 0rpx;
							}
						}

						.item-children-active {
							background: rgba(0, 47, 165, 0.1);
							color: #002FA5;
						}

						.item-children {
							background: #F8F8F8;
							color: #303133;
						}
					}
				}
			}
		}

		.screen-button-bottom {
			background-color: #FFFFFF;
			display: flex;
			position: fixed;
			justify-content: center;
			z-index: 20;
			width: 100%;
			bottom: 20rpx;
			padding: 20rpx 20rpx 0 20rpx;
			border-top: 2rpx solid #E0E0E0;

			.item-contain {
				display: flex;
				flex: 1;
				justify-content: center;
				height: 88rpx;
				line-height: 88rpx;
				font-size: $middleFontSize;
				border: 2rpx solid #E0E0E0;
				border-radius: $miniBorderRadius;

				&:nth-of-type(1) {
					color: #909299;
					margin-right: 20rpx;
				}

				&:nth-of-type(2) {
					color: #FFF;
					background-color: $themeColor;
				}
			}

		}
	}

	.no-material-list {
		height: 60%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 400rpx;

		.item-no {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		image {
			width: 142rpx;
			height: 142rpx;
			margin-bottom: 40rpx;
		}

		.desc {
			display: flex;
			justify-content: center;
			flex-direction: column;
		}

		.no-text {
			font-size: $middleFontSize;
			color: #909199;
			text-align: center;
		}
	}
</style>
