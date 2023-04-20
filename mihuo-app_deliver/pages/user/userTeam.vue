<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar-title" slot="default">团队管理</view>
			<image class="add_icon" slot="right" src="/static/icon/team_add.png" @click="addTeamMember" />
		</z-nav-bar>
		<view class="top-contain">
			<view class="search-contain">
				<u-search placeholder="请输入完整电话号码" v-model="keyword" :show-action="true" :clearabled="true"
					:color="$styleColor.themeColor" search-icon-color="#999999" action-text="搜索" @custom="getSearch"
					@search="getSearch" />
				<!-- <u-icon name="search" color="#999999" size="28"></u-icon>
				<u-input class="describe-input" type="text" :clearable="false" @confirm="getSearch" v-model="keyword"
					confirm-type="send" placeholder-style="color: #999999;font-size: 26rpx;" placeholder="请输入关键字搜索"
					:border="false" />
				<view class="search_text">搜索</view> -->
			</view>
		</view>
		<view class="main">
			<scroll-view class="scroll-con" scroll-y @scrolltolower="onRefresh" v-if="teamList.length > 0">
				<view class="member_view" v-for="item in teamList" :key="item.id" @click="getDetails(item)">
					<view class="member_item display-center" :class="[item.display ? 'member_item_display':'']">
						<view v-if="option.pageType !== '派单'" class="left display-left">
							<u-avatar size="86" :src="$util.avatarImage(item.userId)" v-if="item.userId" />
							<view class="name_view">
								<view class="name">{{item.realName}}</view>
								<view class="skill_name display-left">
									<view class="skill_name_item" v-for="(m,i) in item.label&&item.label.split(',')"
										:key="i">{{m}}</view>
								</view>
							</view>
						</view>
						<view v-else class="left display-left">
							<u-avatar size="86" :src="$util.avatarImage(item.workerUserId)" v-if="item.workerUserId" />
							<view class="name_view">
								<view class="name">{{item.workerName}}</view>
								<view class="skill_name display-left">
									<view class="skill_name_item" >{{item.workerSkillName}}</view>
								</view>
							</view>
						</view>
						<view class="right">
							<image v-if="item.checked" src="/static/icon/assignment_detail/checked.png" class="checked">
							</image>
							<image v-if="!item.checked" src="/static/icon/search.png" @click.stop="setPopup(item)" />
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="loadmoreShow" />
			</scroll-view>
			<mh-empty v-else newIcon="/static/images/no_member.png" title="暂无团队成员" />
		</view>

		<u-popup v-model="setShow" mode="bottom">
			<view class="popup_con">
				<view class="set_item" v-for="(itm,ind) in setList" :key="ind" @click="setMember(itm)">
					{{itm}}
				</view>
			</view>
		</u-popup>

		<mihuo-bottom-button v-if="option.multiple" :buttonList="buttonList" @click="submit()"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				setShow: false,
				loadmoreShow: true,
				status: 'loadmore',
				keyword: '',
				teamList: [],
				page: 1,
				size: 10,
				pages: 0,
				total: 0,
				keyWord: '',
				setList: ['删除', '取消'],
				buttonList: [{
					name: '确认',
					status: true
				}],
				deleteId: '',
				option: {}
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.getTeamListData()
			this.getPersonTeam()
		},
		computed: {
			...mapState(['nodeInfo'])
		},
		methods: {
			setMember(type) {
				switch (type) {
					case '删除':
						this.$httpApi.deleteMember(this.deleteId).then(res => {
							if (res) {
								uni.showToast({
									title: "已删除该成员",
									icon: "none",
								});
								this.getTeamListData()
								this.setShow = false
							}
						}).catch(err => console.log(err))
						break;
					case '取消':
						this.setShow = false
						break;
					default:
						this.setShow = false
				}
			},
			setPopup(info) {
				this.setShow = true
				this.deleteId = info.id
			},
			getSearch() {
				this.page = 1
				this.getTeamListData(this.keyword)
			},
			addTeamMember() {
				this.toPage('/pages/user/addTeamMember')
			},
			onRefresh() {
				if (this.teamList.length == this.total) {
					return;
				}
				this.status = "loading";
				setTimeout(() => {
					this.page = this.page + 1;
					this.getTeamListData()
				}, 1000)
			},
			getTeamListData() {
				if (this.option.pageType == '派单') {
					return
				}
				if (this.keyWord && !this.$base.phoneRegular.test(this.keyWord)) {
					uni.showToast({
						title: "手机号码格式不正确",
						icon: "none",
					});
					return
				}
				let params = {
					keyword: this.keyWord,
					current: this.page,
					size: this.size,
				}
				this.$httpApi.getSysuserTeam(params).then(res => {
					this.total = res.total;

					// 1.通过userId 回显  
					if (this.option.userId) {
						res.records.forEach(item => {
							let userIds
							if (this.option.userId.indexOf(',')) {
								userIds = this.option.userId.split(',')
							} else {
								userIds = [userIds]
							}
							userIds = userIds.map(ev => {
								return Number(ev)
							})
							if (userIds.includes(Number(item.userId))) {
								item['checked'] = true
								item['display'] = false
							} else {
								item['checked'] = false
							}
						})
					}

					// 2.不属于当前工种的，禁用
					if (this.option.skillName) {
						res.records.forEach(item => {
							// 判断是否包含当前工种
							if (item.label) {
								// 不属于当前工种的，禁用
								if (item.label.indexOf(this.option.skillName) == -1) {
									item['display'] = true
									item['checked'] = false
								}
							} else {
								// 没有认证工种、禁用
								item['display'] = true
								item['checked'] = false
							}
						})
					}


					if (res.records.length !== 0) {
						if (this.page == 1) {
							this.teamList = res.records;
						} else {
							this.teamList = this.teamList.concat(res.records);
						}
						if (this.page == res.pages) {
							this.loadmoreShow = false
							this.status = "nomore";
						} else {
							this.status = "loadmore";
						}
					} else {
						this.teamList = []
						this.status = "nomore";
					}
				}).catch(err => this.status = "nomore")
			},
			getPersonTeam() {
				if (this.option.pageType !== '派单') {
					return
				}

				this.$httpApi.getPersonTeam({
					keyword: this.keyWord,
					current: this.page,
					size: this.size,
					skillId: this.nodeInfo.skillId
				}).then(res => {
					if (res) {

						if (res.records.length !== 0) {
							if (this.page == 1) {
								this.teamList = res.records;
							} else {
								this.teamList = this.teamList.concat(res.records);
							}
							if (this.page == res.pages) {
								this.loadmoreShow = false
								this.status = "nomore";
							} else {
								this.status = "loadmore";
							}
						} else {
							this.teamList = []
							this.status = "nomore";
						}
					}
				})
			},
			getDetails(item) {
				if (this.option.multiple) {
					if (!item['display']) {
						item['checked'] = !item['checked']
					}
					return
				}
				if (this.option.skillName) {
					if (item.display) {
						return
					} else {
						item['checked'] = !item['checked']
					}
				}
				
				if(this.option.pageType == '派单'){
					if (!item.workerUserId) {
						return
					}
					uni.$emit('selectUserId', item.workerUserId)
				}else{
					if (!item.userId) {
						return
					}
					uni.$emit('selectUserId', item.userId)
				}
				uni.navigateBack({
					delta: 1
				})
			},
			submit() {
				const tempResult = this.teamList.filter(item => item.checked)
				const tempUserId = tempResult.map(item => {
					return item.userId
				})
				const result = tempUserId.join(',')
				uni.$emit('selectUserId', result)
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.checked {
		width: 50rpx;
		height: 50rpx;
	}

	.nav-bar-title {
		font-weight: bold;
		font-size: 30rpx;
		color: $fontColor33;
	}

	.top-contain {
		background-color: $bgColor;
		padding: 30rpx 20rpx;

		.search-contain {
			background-color: #f2f2f2;
			border-radius: 50rpx;
			padding-right: 18rpx;
		}
	}

	.add_icon {
		width: 50rpx;
		height: 50rpx;
		margin-right: 40rpx;
	}

	.main {
		margin-top: 3rpx;
		height: calc(100vh - var(--status-bar-height) - 226rpx);
		background: $bgColor;
		overflow: hidden;
	}

	.scroll-con {
		height: 100%;
		background: #f6f6f6;
	}

	.member_view {
		.member_item {
			padding: 34rpx 54rpx;
			background: #FFFFFF;
			margin-bottom: 2rpx;

			.left {
				.name_view {
					margin-left: 24rpx;

					.name {
						font-size: $middleFontSize;
						color: $fontColor33;

					}

					.skill_name {
						flex-wrap: wrap;

						.skill_name_item {
							background: #EFF1FF;
							border-radius: 2rpx;
							padding: 6rpx 12rpx;
							font-size: 20rpx;
							color: $themeColor;
							margin: 10rpx 8rpx 0 0;
						}
					}
				}
			}

			.right {
				display: flex;
				align-items: center;

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}

		.member_item_display {
			background-color: #f2f2f2;
			opacity: 0.5;
		}
	}

	.popup_con {
		background: #FFFFFF;
		padding: 10rpx 0;

		.set_item {
			padding: 20rpx 0;
			text-align: center;
			font-size: $mainFontSize;
			color: $errorColor;
			border-bottom: 1rpx solid #E5E5E5;

			&:nth-last-child(1) {
				border: none;
				color: #333;
			}

		}
	}

	.display-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.display-left {
		display: flex;
		align-items: center;
	}
</style>
