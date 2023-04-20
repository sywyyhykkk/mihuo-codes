<template>
	<view class="integral-rule-list" :class="[filterRulesListShow ? 'integral-rule-list-show':'' ]">

		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#fff" fontColor="#303133">
			<view slot="default" class="nav-bar-title" @click="getTitle()">
				{{topRuleCategory}}
				<image src="@/static/images/icon_arrow/icon_arrow_2.png" mode=""></image>
			</view>
		</z-nav-bar>

		<view  class="type-list">
			<view class="type-top">
				<view class="item-type" v-for="(item,index) in  typeList" :key="index"
					:class="[typeIndex == index ? 'item-type-active':'']" @click="setTypeList(index)">
					{{item.name}}
					<view class="item-tag" v-if="typeIndex == index"></view>
				</view>
			</view>
			<view class="type-children">
				<view class="type-children-list">
					<view class="item-children" v-for="(item,index) in  typeListChildren" :key="index"
						:class="[typeChildrenIndex == index ? 'item-children-active':'']"
						@click="setTypeListChildren(index)">
						{{item.ruleCategory}}
						<view class="item-tag" v-if="typeChildrenIndex == index"></view>
					</view>
				</view>
				<u-icon name="arrow-down" v-if="filterRulesList.length > 0" @click="getMore()" class="arrow-down"
					color="#C5C5C5" size="28"></u-icon>
			</view>
		</view>

		<view v-if="filterRulesListShow" class="filter-rules" @click.stop="filterRulesListShow = false">
			<view class="rules-contian">
				<view class="item-title">筛选规则</view>
				<view class="item-list">
					<scroll-view class="scroll-view-contain" :scroll-y="true">
						<view class="item-list-contian">
							<view class="item-contain" v-for="(item,index) in filterRulesList" :key="index"
								:class="[ filterRulesIndex == index ? 'item-contain-active':'']"
								@click="setFilterRulesList(index)">
								{{item.ruleCategory}}
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<view class="list-contain">
			<view class="item-grouping" v-for="(item,index) in list" :key="index">
				<view class="item-title">
					<view class="item-tag"></view>
					<text>{{item.ruleCategory}}</text>
				</view>
				<view class="item-children-list">
					<view class="item-contain">
						<view class="item-name">
							<text class="item-left">{{item.name}}</text>
							<text class="item-right text-waring" v-if="item.ruleType == 0">+{{item.points}}分</text>
						</view>
						<view class="item-desc">
							{{item.content}}
						</view>
						<view class="statistics-contain" v-if="item.ruleType !== 0">
							<view class="item-statistics">
								<text class="item-left">积分</text>
								<text class="item-right text-waring">-{{item.points}}分</text>
							</view>
							<view class="item-statistics">
								<text class="item-left">罚款</text>
								<text class="item-right text-waring"> {{ item.money < 0 ? '-':''}}{{item.money}}元</text>
							</view>
							<view class="item-statistics">
								<text class="item-left">禁单</text>
								<text
									class="item-right text-waring">{{ item.forbidDay < 0 ? '-':''}}{{item.forbidDay}}天</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="没有记录～～" />


		<!-- 规则切换弹框 -->
		<u-picker v-model="rulesShow" mode="selector" :range="ruleList" @confirm="confirmTime"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				list: [],
				filterRulesListShow: false,
				rulesShow: false,
				filterRulesList: [],
				typeList: [{
					name: '奖励规则',
					value: 1
				}, {
					name: '惩罚规则',
					value: 2
				}, {
					name: '红线规则',
					value: 3
				}],
				typeListChildren: [],
				typeIndex: 0,
				typeChildrenIndex: 0,
				filterRulesIndex: -1,
				ruleType: 0, // 规则类型 0-奖励 1-处罚
				ruleCategory: '',
				topRuleCategory: '积分规则',
				topRuleCategoryIndex: 0,
				topType: 2,
				ruleList: [],
				pageSize: 20,
				current: 1,
				total: 0
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getTopTypeList()

		},
		onReachBottom() {
			if (this.list.length < this.total) {
				this.current++
				this.getList()
			}
		},
		methods: {
			/**
			 * @description 切换顶级分类
			 * */
			confirmTime(data) {
				this.topRuleCategory = this.ruleList[data[0]]
				this.current = 1
				this.getTypeList()
			},
			getTitle() {
				this.rulesShow = true
			},
			/**
			 * @description 切换一级分类
			 * */
			setTypeList(index) {
				this.typeIndex = index
				this.ruleType = index
				this.current = 1
				this.filterRulesIndex = -1
				this.getTypeList()
			},
			/**
			 * @description 切换二级分类
			 * */
			setTypeListChildren(index) {
				this.typeChildrenIndex = index
				this.filterRulesIndex = -1
				this.ruleCategory = this.typeListChildren[index].ruleCategory
				this.current = 1
				this.getList()
				this.filterRulesListShow = false
			},
			/**
			 * @description 更多二级分类
			 * */
			setFilterRulesList(index) {
				this.filterRulesIndex = index
				this.typeChildrenIndex = -1
				this.ruleCategory = this.filterRulesList[index].ruleCategory
				this.filterRulesListShow = false
				this.current = 1
				this.getList()
			},
			getMore() {
				this.filterRulesListShow = !this.filterRulesListShow
			},
			/**
			 * @description 获取顶级分类
			 * */
			getTopTypeList() {
				this.$httpApi.getRuleCategoryInfo({
					type: 1,
				}).then(res => {
					if (res) {
						this.ruleList = res
						if (res.length > 0) {
							this.topRuleCategory = res[0]
						}
						this.getTypeList()
					}
				})
			},
			/**
			 * @description 获取二级分类
			 * */
			getTypeList() {
				this.$httpApi.getRuleCategoryInfo({
					ruleCategory: this.topRuleCategory,
					ruleType: this.ruleType, // 规则类型 0-奖励 1-处罚
					type: this.topType,
					forbidFlag: this.ruleType == 2 ? 1 : 0 // 是否红线规则 0否 1是
				}).then(res => {
					if (res) {
						this.typeListChildren = []
						this.filterRulesList = []
						res.unshift('全部')
						// 默认显示4个，多余的显示在更多中
						res.map((item, index) => {
							if (index <= 4) {
								this.typeListChildren.push({
									ruleCategory: item
								})
							} else {
								this.filterRulesList.push({
									ruleCategory: item
								})
							}
						})

						if (this.typeChildrenIndex) {
							if (this.typeListChildren[this.typeChildrenIndex]) {
								this.ruleCategory = this.typeListChildren[this.typeChildrenIndex].ruleCategory
							} else {
								this.typeChildrenIndex = 0
								this.ruleCategory = this.typeListChildren[0] && this.typeListChildren[0]
									.ruleCategory
							}
						} else {
							this.ruleCategory = this.typeListChildren[0] && this.typeListChildren[0].ruleCategory
						}
					}
					this.getList()
				})
			},
			getList() {
				if (!this.ruleCategory) {
					this.list = []
					return
				}
				let tempParameter
				if (this.ruleCategory == '全部') {
					tempParameter = {
						ruleType: this.ruleType, // 规则类型 0-奖励 1-处罚
						forbidFlag: this.ruleType == 2 ? 1 : 0,
						type: this.topType,
						size: this.pageSize,
						current: this.current
					}
				} else {
					tempParameter = {
						ruleType: this.ruleType, // 规则类型 0-奖励 1-处罚
						ruleCategory: this.ruleCategory,
						forbidFlag: this.ruleType == 2 ? 1 : 0,
						type: this.topType,
						size: this.pageSize,
						current: this.current
					}
				}
				this.$httpApi.getRewardRule(tempParameter).then(res => {
					if (res) {
						this.total = res.total
						if (this.current > 1) {
							this.list = this.list.concat(res.records)
						} else {
							this.list = res.records
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	/deep/ .u-select__header {
		background-color: #fff;
	}

	/deep/.u-drawer {
		// background-color: rgba(0, 0, 0, 0.6);
		// transition: all 0.25s ease-in-out 0s;
		// transform: scale(1.2, 1.2);
	}


	.nav-bar-title {
		display: flex;
		align-items: center;

		image {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.integral-rule-list-show {
		overflow: hidden !important;
		position: fixed !important;
		height: 100%;
		width: 100%;

		.type-list {
			top: 0rpx;
		}
	}


	.integral-rule-list {
		padding-bottom: 80rpx;
	}

	.type-list {
		margin: 0rpx 0rpx 10rpx 0rpx;
		background-color: #fff;
		border-radius: 0rpx 0rpx 16rpx 16rpx;
		position: sticky;
		// top: 0rpx;
		top: calc(88rpx + var(--status-bar-height));
		border-top: 4rpx solid #f5f5f5;

		.type-top {
			display: flex;
			justify-content: space-around;
			padding: 32rpx 0rpx;

			.item-type {
				color: #303133;
				font-size: 28rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
			}

			.item-tag {
				width: 86rpx;
				height: 10rpx;
				border-radius: 110px;
				margin-top: 8rpx;
				background: linear-gradient(90deg, #002FA5 5%, rgba(255, 255, 255, 0.00) 91%);
			}

		}

		.type-children {
			display: flex;
			justify-content: space-between;
			padding: 0rpx 30rpx 12rpx 30rpx;

		}

		.type-children-list {
			display: flex;
			flex-wrap: nowrap;
			overflow-x: auto;
			width: 700rpx;

			.item-children {
				margin-right: 20rpx;
				// min-width: 156rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				font-size: 24rpx;
				border-radius: 10rpx;
				background-color: #eeeeee;
				padding: 0 30rpx;
				margin-bottom: 20rpx;
				white-space: nowrap;
			}

			.item-children-active {
				background-color: #DFEAFF;
				color: #002FA5;
			}
		}

		.arrow-down {
			margin-bottom: 20rpx;
		}

	}

	.list-contain {

		.item-grouping {
			background-color: #fff;
			border-radius: 30rpx;
			margin-bottom: 6rpx;

			.item-title {
				padding: 40rpx 0rpx 0rpx 20rpx;
				display: flex;
				align-items: center;

				.item-tag {
					width: 6rpx;
					height: 18rpx;
					background-color: #002FA5;
					border-radius: 50rpx;
					margin-right: 10rpx;
				}

				text {
					color: #002FA5;
					font-size: 30rpx;
				}
			}

			.item-children-list {

				.item-contain {
					margin: 20rpx 44rpx 6rpx 44rpx;
					padding-bottom: 32rpx;
					border-bottom: 2rpx solid #F6F6F6;

					&:last-child {
						border-bottom: 0rpx;
					}

					.item-name {
						display: flex;
						justify-content: space-between;
						margin-bottom: 10rpx;

						.item-left {
							font-size: 28rpx;
							line-height: 38rpx;
							color: #303133;
						}

						.item-right {}
					}

					.item-desc {
						color: #606166;
						font-size: 28rpx;
						line-height: 36rpx;
						margin-bottom: 20rpx;
					}

					.statistics-contain {
						display: flex;
						justify-content: space-between;
						line-height: 50rpx;


						.item-statistics {
							display: flex;
							flex-direction: row;
							align-items: center;
						}

						.item-left {
							color: #909199;
							font-size: 24rpx;
							margin-right: 6rpx;
						}
					}

				}
			}
		}
	}

	.filter-rules {
		position: absolute;
		z-index: 999;
		width: 100%;
		height: calc(100vh - 96rpx);
		top: calc(var(--status-bar-height) + 120rpx); // 页面title + tab筛选
		background: #000000;
		background-color: rgba(0, 0, 0, .5);

		.rules-contian {
			height: 400rpx;
			overflow: hidden;
			background-color: #fff;
			border-radius: 0rpx 0rpx 10rpx 10rpx;
			padding: 0rpx 24rpx 16rpx 24rpx;

			.item-title {
				font-size: 28rpx;
				color: #303133;
				margin-bottom: 20rpx;


			}

			.item-list {
				height: calc(100% - 40rpx);
				padding-bottom: 40rpx;

				.scroll-view-contain {
					height: 100%;

					.item-list-contian {
						display: flex;
						flex-wrap: wrap;
					}
				}

				.item-contain {
					min-width: 210rpx;
					height: 72rpx;
					text-align: center;
					line-height: 72rpx;
					border-radius: 10rpx;
					border: 2rpx solid #EEEEEE;
					color: #909299;
					font-size: 26rpx;
					margin-right: 20rpx;
					padding: 0 24rpx;
					margin-bottom: 26rpx;
					// overflow: hidden;
					// text-overflow: ellipsis;
					// white-space: nowrap;
				}

				.item-contain-active {
					border: 2rpx solid #002FA5;
					color: #002FA5;
				}
			}
		}

	}

	.text-waring {
		font-size: 24rpx;
		color: #FF5D35;
	}
</style>
