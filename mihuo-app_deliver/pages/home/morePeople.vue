<template>
	<view>
		<public-module></public-module>
		<z-nav-bar>
			<view slot="default" class="nav-bar-title">
				我要找人
			</view>
			<image slot="right" class="right-icon" src="../../static/icon/search_icon.png" @click="goToSearch"></image>
		</z-nav-bar>
		<u-dropdown active-color="#002FA5" ref="uDropdown" class="dropdown-menu" title-size="26">
			<u-dropdown-item height="600" v-model="optionModel1" :title="title1" :options="options1"
				@change="selectClick($event, 1)">
			</u-dropdown-item>
			<u-dropdown-item v-model="optionModel2" :title="title2" :options="options2"
				@change="selectClick($event, 2)">
			</u-dropdown-item>
			<u-dropdown-item v-model="optionModel3" :title="title3" :options="options3"
				@change="selectClick($event, 3)">
			</u-dropdown-item>
		</u-dropdown>
		<scroll-view class="list-container" :scroll-y="true" @scrolltolower="scrollToLower">
			<block v-if="peopleList && peopleList.length">
				<view v-for="(item, index) in peopleList" :key="item.id">
					<hr-card :person="item" v-on:clicked="goToWorkerDetail(item)"></hr-card>
				</view>
			</block>
			<mh-empty style="padding-bottom: 40rpx" v-else title="当前区域暂无匹配的工人~"></mh-empty>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchName: '',
				status: 'loadmore',
				peopleList: [],
				jobCode: '',
				current: 1,
				title1: '人才类型',
				title2: '工作经验',
				title3: '筛选',
				optionModel1: '', // 人才类型
				optionModel2: '', // 工作经验
				optionModel3: '', // 工人等级
				options1: [{
					label: "全部",
					value: '',
				}],
				options2: [{
						label: "全部",
						value: '',
					},
					{
						label: "一到三年",
						value: "一到三年", // 用中文value值匹配数据库里的数据
					},
					{
						label: "三到五年",
						value: "三到五年", // 用中文value值匹配数据库里的数据
					},
					{
						label: "五年以上",
						value: "五年以上", // 用中文value值匹配数据库里的数据
					}
				],
				options3: [{
						label: "全部",
						value: '',
					},
					{
						label: "一星工匠",
						value: "1",
					},
					{
						label: "二星工匠",
						value: "2",
					},
					{
						label: "三星工匠",
						value: "3",
					},
					{
						label: "四星工匠",
						value: "4",
					},
					{
						label: "五星工匠",
						value: "5",
					}
				],
			}
		},
		onLoad(option) {
			if (option.typeId && option.typeId !== '') {
				this.optionModel1 = option.typeId // 工种id
				this.title1 = option.typeName // 工种名称
			}
			if(option.jobCode){
				// 查找工人
				this.jobCode = option.jobCode
			}
			this.getWorkType()
		},
		onShow() {
			this.searchName = uni.getStorageSync('searchKeyword') || ''
			this.getDataList()
		},
		methods: {
			// 跳转工人详情
			goToWorkerDetail(item) {
				
			},
			goToSearch() {
				uni.navigateTo({
					url: '/pages/searchPage/searchPage'
				})
			},
			// 加载更多
			scrollToLower() {
				if (this.total === this.peopleList.length) {
					return
				} else {
					this.current++
					this.getDataList()
				}
			},
			// 获取工人数据
			getDataList() {
				this.$httpApi.getPeopleList({
					current: this.current,
					skillId: this.optionModel1,
					skillYearNum: this.optionModel2,
					level: this.optionModel3,
					name: this.searchName,
					jobCode: this.jobCode
				}).then(res => {
					if (res) {
						this.peopleList = this.current === 1 ? res.records : this.peopleList.concat(res.records)
						this.total = res.total
						this.status = this.peopleList.length < res.total ? 'loadmore' : 'nomore'
					}
				})
			},
			// 获取工种类型(人才类型)
			getWorkType() {
				this.$httpApi.getWorkType({
					clientType: 'platform',
					size:999
				}).then(res => {
					if (res) {
						res.records.forEach(item => {
							this.options1.push({
								label: item.skillName,
								value: item.skillId
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
						// 人才类型
						if (e !== '') {
							this.title1 = this.options1.find(item => item.value === e).label
						} else {
							this.title1 = '人才类型'
						}
						break
					case 2:
						if (e !== '') {
							this.title2 = this.options2.find(item => item.value === e).label
						} else {
							this.title2 = '工作经验'
						}
						break
					case 3:
						if (e !== '') {
							this.title3 = this.options3.find(item => item.value === e).label
						} else {
							this.title3 = '筛选'
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
