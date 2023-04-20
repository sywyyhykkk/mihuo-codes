<template>
	<view class="points-details">

		<view class="type-screen">
			<view class="item-time" @click="timeShow = true">{{time}}
				<u-icon name="arrow-down" color="#303133" size="28"></u-icon>
			</view>
			<view class="item-num">积分奖励{{setReward}}</view>
			<view class="item-num">积分惩罚{{setPunish}}</view>
		</view>

		<view class="type-list">
			<view class="item-type" v-for="(item,index) in typeList" :key="index"
				:class="[ typeActive == index ? 'item-type-active':'']" @click="getType(index,item)">
				{{item.name}}
			</view>
		</view>


		<view class="list-contian" v-if="list.length > 0">
			<view class="item-contain" v-for="(item,index) in list" :key="index">
				<view class="item-name">
					<text class="item-left">{{item.name}}</text>
					<text class="item-right" v-if="item.ruleType == 0">+{{item.integral}}</text>
					<text class="item-green"
						v-if="item.ruleType !== 0 && Number(item.integral) > 0">-{{item.integral}}</text>
				</view>
				<view class="item-time">
					{{item.created}}
				</view>
				<view class="item-desc" v-if="item.remark">
					{{item.remark}}
				</view>
			</view>

		</view>
		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="没有记录～～" />
		<!-- <u-loadmore v-else :status="status" /> -->

		<!-- 保障时间选择 -->
		<u-picker v-model="timeShow" mode="time" :params="params" @confirm="confirmTime" :is-allow-passed-time="true">

		</u-picker>

	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	import moment from "@/static/js/moment.js"
	export default {
		data() {
			return {
				option: {},
				pageSize: 20,
				pageCurrent: 1,
				total: 0,
				typeActive: 0,
				status: 'nomore',
				list: [],
				timeShow: false,
				time: '',
				timeName: '',
				ruleType: -1,
				params: {
					year: true,
					month: true,
					day: false,
				},
				typeList: [{
					name: '全部',
					value: -1
				}, {
					name: '积分奖励',
					value: 0
				}, {
					name: '积分惩罚',
					value: 1
				}]
			}
		},
		computed: {
			setReward() { // 奖励积分统计
				let result = []
				this.list.forEach(el => {
					if (el.ruleType == 0) {
						result.push(el.integral)
					}
				})
				let resultTotal = operation.funCalc(result)
				return resultTotal > 0 ? `(${resultTotal})` : ''
			},
			setPunish() { // 处罚积分统计
				let result = []
				this.list.forEach(el => {
					if (el.ruleType == 1) {
						result.push(el.integral)
					}
				})
				let resultTotal = operation.funCalc(result)
				return resultTotal > 0 ? `(${resultTotal})` : ''
			}
		},
		mounted() {

		},
		onShow() {

		},
		onReachBottom() {
			return
			if (this.list.length === Number(this.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pageCurrent += 1
				this.getReward()
			}
		},
		onLoad(option) {
			this.option = option

			this.setTime()
		},
		methods: {
			setTime() {
				let newYear = moment().format('YYYY')
				let newMonth = moment().format('MM')
				let newTime = moment().format('YYYY-MM')
				this.time = `${newYear}年${newMonth}月`
				this.timeName = newTime
				this.getReward()
			},
			confirmTime(obj) {
				this.time = `${obj.year}年${obj.month}月`
				this.timeName = `${obj.year}-${obj.month}`
				this.getReward()
			},
			getType(index, item) {
				this.typeActive = index
				this.ruleType = item.value
				this.getReward()
			},
			getReward() {
				this.$httpApi.getReward({
					// size: this.pageSize,
					current: this.pageCurrent,
					personId: this.option.personId,
					ruleDate: this.timeName,
					ruleType: this.ruleType == -1 ? '' : this.ruleType
				}).then(res => {
					if (res) {
						this.list = res
						return
						this.total = res.total
						if (this.list && this.list.length === Number(this.total)) {
							this.status = 'nomore'
						}
						console.log('list && ', this.list);
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.u-load-more-wrap {
		margin-top: 40rpx !important;
	}

	.type-list {
		padding: 40rpx 30rpx;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
		background-color: #FFF;
		display: flex;
		justify-content: space-around;
		margin: 0rpx 20rpx 2rpx 20rpx;

		.item-type {
			color: #909299;
			font-size: 30rpx;
		}

		.item-type-active {
			color: #002FA5;
			font-size: 30rpx;
		}
	}

	.type-screen {
		height: 104rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-radius: 16rpx;
		background-color: #FFF;
		margin: 0 20rpx 8rpx 20rpx;

		.item-time {
			color: #32324E;
			font-size: 30rpx;
		}

		.item-num {
			color: #909199;
			font-size: 28rpx;
		}
	}

	.points-details {
		padding: 8rpx 0rpx 80rpx 0rpx;

		.list-contian {
		}

		.item-contain {
			margin: 0 20rpx 2rpx 20rpx;
			background-color: #fff;
			padding: 32rpx 30rpx;


			.item-name {
				display: flex;
				justify-content: space-between;
				margin-bottom: 8rpx;

				.item-left {
					color: #303133;
					font-size: 30rpx;
					line-height: 38rpx;
				}

				.item-right {
					color: #FF5D35;
					font-size: 30rpx;
				}

				.item-green {
					font-size: 30rpx;
					color: #0EBD8D;
				}
			}

			.item-time {
				color: #B4B6BA;
				font-size: 26rpx;
				padding-bottom: 24rpx;
			}

			.item-desc {
				color: #B4B6BA;
				font-size: 26rpx;
				border-top: 2rpx dashed #D8D8D8;
				padding-top: 22rpx;
			}
		}
	}
</style>
