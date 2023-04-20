<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.top {
		background-color: #FFFFFF;
		padding: 26rpx 60rpx;
		position: -webkit-sticky;
		position: sticky;
		// width: 100%;
		// top: calc(88rpx + var(--status-bar-height));
		// top: calc(var(--status-bar-height));
		top: 0rpx;
		z-index: 99;
	}

	.search {
		display: flex;
		background: #F4F4F4;
		border-radius: 50rpx;
		padding-left: 38rpx;


		.item-search-button {
			text-align: center;
			line-height: 72rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			width: 108rpx;
			border-radius: 0px 40rpx 40rpx 0px;
			background-color: $themeColor;
			justify-content: center;
		}
	}

	.service {
		background-color: #FFFFFF;
		margin: 6rpx 20rpx 0rpx 20rpx;
		min-height: 360rpx;

		.tomorrow-contain {
			border-radius: 10rpx;


			.title-text {
				color: #303133;
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 30rpx;
			}

			.list-contain {
				padding: 20rpx 22rpx 30rpx 22rpx;
			}

			.type-left {
				padding-top: 10rpx;
				border-bottom: 2rpx solid #F4F4F4;
			}

			/deep/ .u-checkbox__label {
				display: none;
			}

			.item-contain {
				&:last-child {
					.top {
						margin-bottom: 0rpx;
					}
				}
			}

			.item-top {
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;


			}
		}
	}

	.item-checkbox {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.title-name {
		color: #303133;
		font-size: 28rpx;
		line-height: 36rpx;
		margin: 0rpx 0rpx 0rpx 12rpx;
		max-width: 500rpx;
	}

	.no-list {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 32rpx 0rpx 64rpx 0rpx;
		height: 360rpx;

		text {
			color: #909199;
			font-size: 26rpx;
			margin-top: 10rpx;
		}


		.no-list-image {
			width: 160rpx;
			height: 132rpx;
		}
	}

	.desc-contain {
		margin: 12rpx 20rpx 14rpx 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx 22rpx;

		.title-text {
			color: #303133;
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.voice-contain {
			margin-top: 20rpx;
		}


	}

	.service-list {
		padding: 30rpx;

		.title {
			font-weight: bold;
			font-size: 28rpx;
			color: #303133;
			line-height: 38rpx;
			margin-bottom: 24rpx;
		}

		.item-contain {
			&:last-child {
				.log-other {
					padding-bottom: 0rpx;
				}
			}
		}

		.item-top {
			display: flex;
			align-items: center;
			padding-bottom: 20rpx;

			/deep/ .u-checkbox__label {
				display: none;
			}

			.item-tag {
				width: 72rpx;
				// padding: 0 12rpx;
				height: 32rpx;
				border-radius: 50rpx;
				// background-color: rgba(255, 230, 223, 1.000);
				display: flex;
				align-items: center;

				text {
					font-size: 24rpx;
					transform: scale(0.85);
					transform-origin: center;
					color: #FF5D35;
					display: inline-block;
				}
			}

			.item-status {
				width: 100rpx;
				font-size: 24rpx;
				border-radius: 20rpx;
				text-align: center;
				padding: 4rpx 0;
				margin-left: 10rpx;
				white-space: nowrap;
			}
		}

		.log-other {
			padding-bottom: 30rpx;

			.status {
				margin-bottom: 16rpx;
			}

			.upload {}
		}


	}

	.tomorrow-contain {
		.title-name {
			max-width: initial;
		}
	}
</style>

<template>
	<view class="select-construction">
		<view class="top">
			<view class="search">
				<u-icon name="search" color="#999999" size="28"></u-icon>
				<u-input confirm-type="确定" class="describe-input" v-model="search" @confirm="getSearch" height="72"
					type="text" :clearable="false" placeholder-style="fontSize:26rpx;color:#999999"
					placeholder="请输入关键字搜索" :border="false" />
				<view class="item-search-button" @click="getSearch">
					搜索
				</view>
			</view>
		</view>

		<!-- 当前项目 -->
		<view class="service">
			<view class="no-list" v-if="serviceList.length == 0">
				<image class="no-list-image" src="@/static/images/no_order_2.png" mode=""></image>
				<text>今日施工内容~</text>
			</view>
			<view class="service-list" v-else>
				<view class="title">当前项目包含</view>
				<view class="item-contain" v-for="(item,index) in serviceList" :key="index">
					<view class="item-top">
						<view class="item-checkbox">
							<u-checkbox v-model="item.checked" @change="checkboxChange(item)"></u-checkbox>
						</view>
						<view class="title-name">{{item.name}}</view>
						<view v-if="Number(option.type) !== 2" class="item-status"
							:style="{ color: getStatus(item.status,'color'),background:getStatus(item.status,'bg')}">
							{{getStatus(item.status,'text')}}
						</view>
					</view>
					<view class="log-other" v-if="item.checked">
						<view class="status">
							<u-radio-group v-model="item.radio" @change="radioGroupChange($event,item)">
								<u-radio label-size="26" active-color="#002FA5" @change="radioChange"
									v-for="(item, index) in list" :key="index" :name="item.name">
									{{item.name}}
								</u-radio>
							</u-radio-group>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 其他工作项	 -->
		<view class="service">
			<view class="no-list" v-if="barList.length == 0">
				<image class="no-list-image" src="@/static/images/no_order_2.png" mode=""></image>
				<text>其他工作项~</text>
			</view>
			<view class="tomorrow-contain" v-if="barList.length > 0">
				<!-- <view class="title-text">其他工作项</view> -->
				<view class="type-left">
					<u-tabs  active-color="#002FA5" height="72" inactive-color="#787878" font-size="28"
						:list="barList" :is-scroll="true" :current="tabCurrent" :active-item-style="activeItemStyle"
						@change="changTab" bar-width="28" bar-height="6" bg-color="#fff"></u-tabs>
				</view>
				<view class="list-contain">
					<view class="item-contain" v-for="(item,index) in setList" :key="index">
						<view class="item-top">
							<view class="item-checkbox">
								<u-checkbox v-model="item.checked"></u-checkbox>
							</view>
							<view class="title-name">{{item.name}}</view>
						</view>
					</view>
				</view>

			</view>
		</view>
		<!-- 补充内容 -->
		<view class="desc-contain">
			<view class="title-text">补充内容</view>
			<textarea placeholder-style="color:#909199" placeholder="请输入补充内容" style="width: 100%;
					height: 166rpx;padding: 24rpx 26rpx;box-sizing: border-box;background: #F7F7F7;
					border-radius: 10rpx;font-size: 25rpx;" v-model="desc" />
		</view>

		<mihuo-bottom-button :buttonList="buttonList" @click="submit()"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				option: {}, // type 1=>今天  2明天
				search: '',
				buttonList: [{
					name: '确认',
					status: true
				}],
				desc: '',
				tabCurrent: 0,
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '30rpx'
				},
				serviceList: [],
				otherService: [],
				list: [{
						name: '施工中',
						status: 1
					},
					{
						name: '已完工',
						status: 2
					}
				],
				barList: [],
				colorList: [{
						status: 0,
						name: '未开工',
						color: '#FF5D35',
						bgColor: '#FEF1E3'
					},
					{
						status: 1,
						name: '施工中',
						color: '#002FA5',
						bgColor: '#E5EAF6'
					},
					{
						status: 2,
						name: '已完工',
						color: '#10C57D',
						bgColor: '#D5FFEE'
					}
				],
			}
		},
		watch: {
			search: {
				handler(newVal, oldVal) {
					this.debounce(() => {
						this.selectCustomerPage()
					}, 100)
				},
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'nodeInfo', 'userRole', 'userPersonInfo', 'remainingDays']),
			setList() {
				return this.barList[this.tabCurrent] && this.barList[this.tabCurrent].list
			}
		},

		mounted() {

		},
		onShow() {

		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('getSelectConstruction', (data) => {
				this.option = data
				uni.setNavigationBarTitle({
					title: this.option.type == 1 ? '今日施工内容' : '明日施工计划'
				});
			});
			this.getServiceList()
			this.selectCustomerPage()
		},
		methods: {
			getSearch() {

			},
			getServiceList() {
				if (!this.projectInfo.projectId) {
					console.error('项目id不能为空')
					return
				}
				this.$httpApi.getProcessList({
					projectId: this.projectInfo.projectId,
					skillId: this.userPersonInfo.skillId
				}).then(res => {
					if (res) {
						let result = []
						res.forEach(ev => {
							ev.details.forEach((item, index) => {
								item['checked'] = false
								item['radio'] = item.status == 2 ? '已完工' : ''
								item['pic'] = '[]'
								item['id'] = item.productId
								item['statusData'] = item.status
								result.push(item)
							})
						})

						// 回显
						if (this.option.list && this.option.list.length > 0) {
							this.option.list.forEach(item1 => {
								res.forEach(ev => {
									ev.details.forEach((item2, index) => {
										if (item1.id == item2.id) {
											item2['checked'] = true
											item2['status'] = item1.status
											item2['radio'] = item1.status == 1 ? '施工中' :
												item1.status == 2 ? '已完工' : ''
										}
									})
								})
							})
						}
						this.serviceList = result

					}
				})
			},
			selectCustomerPage() {
				this.$httpApi.getServiceItemList({
					keywords: this.search,
					skillId: this.orderInfo.skillId,
					operatorId: uni.getStorageSync('cityOperatorId')
				}).then(res => {
					if (res) {
						res.forEach(item => {
							item.groupName = item.groupName || '其它'
							item['checked'] = false
							item['status'] = 1
							item['name'] = item.itemName
						})
						if (this.option.list && this.option.list.length > 0) {
							this.option.list.forEach(item1 => {
								res.forEach(item => {
									if (item1.id == item.id) {
										item['checked'] = true
										item['status'] = item1.status
									}
								})
							})
						}
						let resultList = this.setGroup(res, 'groupName')
						resultList.forEach(el => {
							el['name'] = el.type 
						})
						this.barList = resultList
					}
				})
			},
			changTab(index) {
				this.tabCurrent = index
			},
			getStatus(status, typeName) {
				switch (typeName) {
					case 'text':
						return this.colorList.find(item => item.status === status).name
					case 'color':
						return this.colorList.find(item => item.status === status).color
					case 'bg':
						return this.colorList.find(item => item.status === status).bgColor
				}

			},
			radioChange(even, item) {
				// console.log('even3', even, item);
			},
			checkboxChange(item) {
				this.$nextTick(() => {
					this.serviceList.forEach(el => {
						if (el.checked) {
							if (el.id == item.id && (el.status == 0 || el.status == 1)) {
								el.status = 1
								el.radio = '施工中'
							}
						} else {
							if (el.id == item.id) {
								el.status = el.statusData
								el.radio = ''
							}
						}
					})
				})
			},
			radioGroupChange(even, item) {
				let resultName = this.list.find(item => item.name == even)
				this.serviceList.forEach(el => {
					if (el.id == item.id) {
						el.status = resultName.status
					}
				})
			},
			submit() {
				// 今日施工内容
				let tempServiceList = this.serviceList.filter(item => item.checked)
				// 其他施工内容
				let tempOtherService = []
				this.barList.forEach(item => {
					item.list.forEach(item2 => {
						if (item2.checked) {
							tempOtherService.push(item2)
						}
					})
				})

				if (tempOtherService.length == 0) {
					if (tempServiceList.length == 0) {
						this.$util.toast(`请选择工作项`);
						return
					}
				}
				if (tempServiceList.length == 0) {
					if (tempOtherService.length == 0) {
						this.$util.toast(`请选择工作项`);
						return
					}
				}

				let tempResult = [...tempServiceList, ...tempOtherService]
				let result = []
				tempResult.forEach(item => {
					result.push({
						name: item.name,
						status: item.status,
						id: item.productId || item.id
					})
				})
				
				// console.log('result',result)
				// return
				if (this.option.type == 1) {
					uni.$emit('todayWork', {
						list: result,
						desc: this.desc
					})
				} else {
					uni.$emit('tomorrowWork', {
						list: result,
						desc: this.desc
					})
				}
				this.goBack()
			},
			setGroup(result, type) {
				let map = {}
				let dest = []
				let resultList = []
				result.forEach(item => {
					if (!map[item[type]]) {
						dest.push({
							type: item[type],
							list: [item]
						})
						map[item[type]] = item
					} else {
						dest.forEach(el => {
							if (el.type == item[type]) {
								el.list.push(item)
							}
						})
					}

				})
				resultList = [...dest]
				return resultList
			},
		}
	}
</script>
