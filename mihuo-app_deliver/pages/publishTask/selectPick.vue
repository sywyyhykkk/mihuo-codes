<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#002FA5" fontColor="#FFF">
			<view slot="default" style="font-weight: 900;font-size: 32rpx;color: #FFFFFF;">选择成员</view>
			<view slot="right" style="margin-right: 20rpx;color:#FFFFFF;" @click="toConfirm">
				确定
			</view>
		</z-nav-bar>
		<view class="search-input">
			<u-search placeholder="成员姓名/手机号" :showAction="showAction" class="search" type="text" v-model="searchData">
			</u-search>
		</view>
		<view class="" v-if="postion.pageType == '团队成员'">
			<view v-for="(item,index) in selectTeamMembersList" :key="index" class="jobMemberList"
				@click="selectItem(index,item[userIden],item)" :style="item.disabled?'background:#eeeeee':''">
				<work-people :priceType="false" :workerData="item" :prop="dataProp"
					:workerStatus="item.disabled||postion.assign=='1'?1:0" :multiple="true" :statisticsType="false"
					:imType="false" :style="item.disabled?'background:#eeeeee':''">
				</work-people>
				<image v-if="item.chicked||item.disabled" src="../../static/icon/assignment_detail/checked.png"
					class="checked"></image>
			</view>

			<mh-empty v-show="selectTeamMembersList.length === 0" icon="/static/images/no_recommend.png"
				title="您还没有数据～～" />
		</view>
		<view v-else class="">
			<view v-for="(item,index) in jobMemberList2" :key="index" class="jobMemberList"
				@click="selectItem(index,item[userIden],item)" :style="item.disabled?'background:#eeeeee':''">
				<work-people :priceType="false" :workerData="item" :prop="dataProp"
					:workerStatus="item.disabled||postion.assign=='1'?1:0" :multiple="true" :statisticsType="false"
					:imType="false" :style="item.disabled?'background:#eeeeee':''">
				</work-people>
				<image v-if="item.chicked||item.disabled" src="../../static/icon/assignment_detail/checked.png"
					class="checked"></image>
			</view>

			<mh-empty v-show="jobMemberList2.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
		</view>

	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				showAction: false,
				searchData: '',
				checked: [],
				jobMemberList: [],
				userIden: 'userId',
				personType: [{
					type: 'JOB_MANAGER',
					name: '项目管家'
				}, {
					type: 'JOB_SUPERVISION',
					name: '项目监理'
				}, {
					type: 'JOB_DESIGNER',
					name: '设计师'
				}, {
					type: 'JOB_WORKER',
					name: '工人'
				}],
				dataProp: {
					name: 'name',
					workerType: 'skillName'
				},
				postion: {
					multiple: true
				},
				offerList: [],
				projectId: '',
				teamMembersList: []
			}
		},

		async onLoad(postion) {
			this.setParameters()
			this.postion = postion
			//新增团队成员的时候用来判断选择成员里面有没有团队成员，有的话默认选中
			if (this.postion.pageType == '新增成员') {
				await this.getPunishList()
			}
			//multiple是否多选，true是，false否，默认多选
			if (postion.pageType == '团队成员') {
				this.dataProp = {
					name: 'name',
					workerType: 'skillName'
				}
				this.userIden = 'personId'
				await this.getPunishList() //团队成员列表
			} else {
				await this.getEmployeeList(postion.jobId, postion.companyId)
			}
		},
		computed: {
			...mapState(['projectInfo', 'userPersonInfo']),
			jobMemberList2() {
				if (this.searchData) {
					return this.jobMemberList.filter(item => {
						return item[this.dataProp.name].indexOf(this.searchData) > -1 || item.phone.indexOf(this
							.searchData) > -1
					})
				} else {
					return this.jobMemberList;
				}
			},
			selectTeamMembersList() {
				if (this.searchData) {
					return this.teamMembersList.filter(item => {
						return item[this.dataProp.name].indexOf(this.searchData) > -1 || item.phone.indexOf(this
							.searchData) > -1
					})
				} else {

					console.log('this.teamMembersList', this.teamMembersList);

					return this.teamMembersList;
				}
			}
		},
		onShow() {},
		methods: {
			setParameters() {
				this.projectId = this.projectInfo.projectId
			},
			toConfirm() {
				var checkList = [];
				this.jobMemberList.map(res => {
					if (res.chicked) {
						checkList.push(res)
					}
				})
				uni.$emit('checkList', JSON.stringify(checkList))
				uni.navigateBack({
					delta: 1
				})
			},
			selectItem(index, userId, item) {
				if (this.postion.pageType == '团队成员') {
					if (this.postion.multiple == 'false' || (this.postion.multiple !== undefined && !this.postion
							.multiple)) {
						this.teamMembersList.map(res => {
							if (res[this.userIden] == userId) {
								res.chicked = res.chicked ? false : true
								return;
							} else {
								res.chicked = false
							}
						})
					} else {
						this.teamMembersList.map(res => {
							if (res[this.userIden] == userId) {
								res.chicked = res.chicked ? false : true
								return;
							}
						})
					}
					this.jobMemberList = JSON.parse(JSON.stringify(this.teamMembersList))
				} else {
					if (item.disabled) {
						return;
					}
					if (this.postion.multiple == 'false' || (this.postion.multiple !== undefined && !this.postion
							.multiple)) {
						this.jobMemberList.map(res => {
							if (res[this.userIden] == userId) {
								res.chicked = res.chicked ? false : true
								return;
							} else {
								res.chicked = false
							}
						})
					} else {
						this.jobMemberList.map(res => {
							if (res[this.userIden] == userId) {
								res.chicked = res.chicked ? false : true
								return;
							}
						})
					}
					this.jobMemberList = JSON.parse(JSON.stringify(this.jobMemberList))
				}

			},
			getEmployeeList(jobId, companyId) {
				this.$httpApi.jobMemberWithEmployee({
					companyId: companyId,
					skillIds: jobId.split(',')
				}).then(res => {
					if (this.postion.pageType == '加派' || this.postion.pageType == '新增成员') {
						this.offerList = this.postion.pageType == '加派' ? uni.getStorageSync('nodeOrderData') : this
							.jobMemberList
						if (this.offerList.length > 0) {
							this.offerList.map(item1 => {
								res.map(item2 => {
									if (item1.personId == item2.personId) {
										item2.disabled = true
									}
								})
							})
						}
						if (this.teamMembersList.length > 0) {
							this.teamMembersList.map(item => {
								res.map(ev => {
									if (ev.personId == item.personId) {
										ev.disabled = true
									}
								})
							})
						}
						this.jobMemberList = res
					} else {
						this.jobMemberList = res
					}
				})
			},
			async getPunishList() {
				const res = await this.$httpApi.taskMemberList({
					projectId: this.projectId
				})
				if (res) {
					res.map(item => {
						item.members.map(el => {
							el['chicked'] = false
							this.teamMembersList.push(el)
						})
					})
					if (this.postion.pageType == '团队成员') {
						let list = []
						// 不能自己抄送给自己
						this.teamMembersList.forEach(item1 => {
							if (item1.userId !== this.userPersonInfo.userId && item1.personId !== this
								.userPersonInfo.personId) {
								list.push(item1)
							}
						})
						this.teamMembersList = list
					}
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-input {
		background: $themeColor;
		padding: 10rpx;
		background: $themeColor;

		.search {
			background: #FFFFFF;
			line-height: 70rpx;
			height: 70rpx;
			border-radius: 70rpx;
		}

		.search-text {
			width: 15%;
			float: left;
			text-align: center;
			line-height: 70rpx;
			color: #FFFFFF;
		}
	}

	.jobMemberList {
		margin: 20rpx;
		background: #FFFFFF;
		border-radius: 4rpx;
		padding-right: 20rpx;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;

		.jobName {
			font-weight: bold;
			font-size: 28rpx;
			line-height: 50rpx;
			color: #333333;
		}

		.employeeName {
			font-weight: normal;
			font-size: 26rpx;
			line-height: 50rpx;
			color: #909199;

		}

		.checked {
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
