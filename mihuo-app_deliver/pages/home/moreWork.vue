<template>
	<view>
		<public-module></public-module>
		<z-nav-bar>
			<view slot="default" class="nav-bar-title">
				我要找活
			</view>
			<image slot="right" class="right-icon" src="../../static/icon/search_icon.png" @click="goToSearch"></image>
		</z-nav-bar>
		<u-dropdown active-color="#002FA5" ref="uDropdown" class="dropdown-menu" title-size="26">
			<u-dropdown-item v-model="optionModel1" :title="title1" :options="options1"
				@change="selectClick($event, 1)">
			</u-dropdown-item>
			<u-dropdown-item height="800" v-model="optionModel2" :title="title2" :options="options2"
				@change="selectClick($event, 2)">
			</u-dropdown-item>
			<u-dropdown-item height="800" v-model="optionModel3" :title="title3" :options="options3"
				@change="selectClick($event, 3)">
			</u-dropdown-item>
			<u-dropdown-item v-model="optionModel4" :title="title4" :options="options4"
				@change="selectClick($event, 4)">
			</u-dropdown-item>
		</u-dropdown>
		<scroll-view class="list-container" :scroll-y="true" @scrolltolower="scrollToLower">
			<block v-if="worksList && worksList.length">
				<view v-for="(item, index) in worksList" :key="item.id">
					<work-card :work="item" v-on:clicked="goToOrderReceiving(item)"></work-card>
				</view>
				<u-loadmore :status="status" style="margin: 40rpx 0" />
			</block>
			<mh-empty style="padding-bottom: 40rpx;" v-else title="当前区域暂无匹配的订单~"></mh-empty>
		</scroll-view>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				keywords: '',
				total: 0,
				cityOperatorId: uni.getStorageSync('cityOperatorId') || uni.getStorageSync('userAddress').areaCode || -1,
				current: 1,
				latitude: uni.getStorageSync('latitude') || 0, // 纬度
				longitude: uni.getStorageSync('longitude') || 0, // 经度
				worksList: [],
				status: 'loadmore',
				title1: '定价类型',
				title2: '订单类型',
				title3: '技能要求',
				title4: '排序',
				optionModel1: '', // 定价类型
				optionModel2: '', // 订单类型
				optionModel3: '', // 技能要求
				optionModel4: '', // 排序
				options1: [{
						label: "全部",
						value: '',
					},
					{
						label: "一口价",
						value: 1,
					},
					{
						label: "议价",
						value: 2,
					},
				],
				options2: [{
					label: "全部",
					value: '',
				}],
				options3: [{
					label: "全部",
					value: '',
				}],
				options4: [{
						label: "默认排序",
						value: '',
					},
					{
						label: "距我最近",
						value: 'DISTANCE',
					},
					{
						label: "金额最高",
						value: 'AMOUNT',
					}
				],
			}
		},
		onLoad(option) {
			if(option.typeId && option.typeId !== ''){
				this.optionModel3 = option.typeId // 工种id
				this.title3 = option.typeName // 工种名称
			}
			if(option.typeId === '-1'){
				this.optionModel3 = '' // 工种id
				this.title3 = '全部' // 工种名称
			}
			this.getWorkType()
			this.getRequirementType()
		},
		onShow() {
			this.keywords = uni.getStorageSync('searchKeyword') || ''
			this.getDataList()
		},
		methods: {
			goToSearch() {
				uni.navigateTo({
					url: '/pages/searchPage/searchPage'
				})
			},
			// 加载更多
			scrollToLower() {
				if (this.total === this.worksList.length) {
					return
				} else {
					this.current++
					this.getDataList()
				}
			},
			// 获取订单数据
			getDataList() {
				this.$httpApi.getOrderList({
					cityId: this.cityOperatorId,
					current: this.current,
					latitude: this.latitude,
					longitude: this.longitude,
					priceWay: this.optionModel1, // 议价类型
					requirementType: this.optionModel2, // 需求类型
					skillType: this.optionModel3, // 技能要求
					'orders[0].asc': this.optionModel4 === 'AMOUNT' ? false : true,
					'orders[0].column': this.optionModel4 ,// 金额正序或距离倒序
					keyWords: this.keywords ,// 关键字搜索
				}).then(res => {
					if (res) {
						this.worksList = this.current === 1 ? res.records : this.worksList.concat(res.records)
						this.total = res.total
						this.status = this.worksList.length < res.total ? 'loadmore' : 'nomore'
						this.worksList.map((item) => {
							item['timeNew'] = moment(item.created).format('MMMDo HH:mm')
							item['beforeTime'] = moment(item.created)
								.startOf('minute')
								.fromNow()
						})
					}
				})
			},
			// 跳转订单详情
			goToOrderReceiving(item) {
				let userId = uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser.userId
				uni.navigateTo({
					url: `/pages/orderReceiving/releaseOrderDetails?id=${item.id}&pageType=${item.userId == userId ? '发单':'接单'}` //跳转地址
				})
			},
			// 获取工种类型
			getWorkType() {
				this.$httpApi.getWorkType({
					size: 99,
					clientType: 'platform'
				}).then(res => {
					if (res) {
						res.records.forEach(item => {
							this.options3.push({
								label: item.skillName,
								value: item.skillId
							})
						})
					}
				})
			},
			// 获取需求类型
			getRequirementType() {
				this.$httpApi.getOrderType({
					size: 99
				}).then(res => {
					if (res) {
						res.forEach(item => {
							this.options2.push({
								label: item.label,
								value: item.value
							})
						})
					}
				})
			},
			// 下拉菜单
			selectClick(e, type) {
				this.current = 1
				this.getDataList()
				switch (type) {
					case 1:
						// 定价类型
						if (e !== '') {
							this.title1 = this.options1.find(item => item.value === e).label
						} else {
							this.title1 = '定价类型'
						}
						break
					case 2:
						// 订单类型
						if (e !== '') {
							this.title2 = this.options2.find(item => item.value === e).label
						} else {
							this.title2 = '订单类型'
						}
						break
					case 3:
						// 技能要求
						if (e !== '') {
							this.title3 = this.options3.find(item => item.value === e).label
						} else {
							this.title3 = '技能要求'
						}
						break
					case 4:
						// 排序
						if (e !== '') {
							this.title4 = this.options4.find(item => item.value === e).label
						} else {
							this.title4 = '排序'
						}
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.nav-bar-title {
		@include nav-bar-title(#333333)
	}

	.right-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 40rpx;
	}

	.dropdown-menu {
		width: 100vw;
		height: 84rpx;
		background-color: #FFFFFF;
	}

	.list-container {
		width: 710rpx;
		height: calc(100vh - 276rpx);
		margin: 10rpx 20rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
