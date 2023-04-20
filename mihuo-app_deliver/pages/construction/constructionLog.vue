<template>
	<view>
		<view class="list-scroll-content">
			<!-- <order-user-information v-if="navDisplay" :projectId="projectId" /> -->
			<mihuo-order-information v-if="navDisplay" :projectId="projectId"></mihuo-order-information>
			<view class="select_wrap align-items" v-if="navDisplay">
				<view class="select_left display-left">
					<image class="title_icon" src="/static/icon/group3.png" mode=""></image>
					<text class="title">服务日志</text>
				</view>
				<view class="select_switch display-left" @click="selectStatus">
					<view class="hint_text">筛选</view>
					<image src="/static/icon/select_dwon_arrow.png" class="select_dwon_arrow" />
				</view>
			</view>
			<view style="overflow: hidden;">
				<view v-show="journalList && journalList.length > 0" style="margin-top: 34rpx;">
					<view class="journal_item" v-for="(item,index) in journalList" :key="index">
						<view class="in_time" v-if="!navDisplay && item.person">
							<!-- <text class="time">{{item.updated}}</text> -->
							<view class="staff_info display-left">
								<u-avatar class="avatar" size="40" :src="$util.avatarImage(item.person.userId)"
									v-if="item.person" />
								<view class="staff">
									<view class="name_view display-left">
										<view class="info">{{item.person.name}}</view>
										<view class="info">({{item.person.skillName}})</view>
										<text class="info">{{item.created.slice(0,item.created.length-3)}}</text>
									</view>
								</view>
							</view>
						</view>

						<view :class="!navDisplay?'other_post_style':''">
							<view class="item_con" :style="navDisplay ? 'margin-bottom: 16rpx' : ''"
								@click.stop="toPage(`/pages/construction/selectConstruction/logDetails?id=${item.id}`)">
								<view class="staff_info display-left" v-if="navDisplay && item.person">
									<u-avatar class="avatar" size="88" :src="$util.avatarImage(item.person.userId)"
										v-if="item.person" />
									<view class="staff">
										<view class="name_view display-left">
											<view class="name">{{item.person.name}}</view>
											<view class="job_name">{{item.person.skillName}}</view>
										</view>
										<text class="info">{{item.created}}</text>
									</view>
								</view>

								<view class="details-list" v-if="item.detailList">
									<view class="title-contain">
										<text class="item-label">今日施工内容</text>
										<view class="item-right">
											<text class="item-text">查看详情</text>
											<image :src="'/static/images/shouqi.png'" class="icon-jian"></image>
										</view>
									</view>
									<view class="item-details" v-for="(item1,index1) in item.detailList" :key="index1">
										<view v-if="index1 < 3" class="list-contain">
											<view class="item-list_contain">
												<view class="item-title">{{item1.name}}</view>
												<view class="item-status"
													:style="{ color: getStatus(item1.status,'color'),background:getStatus(item1.status,'bg')}">
													{{getStatus(item1.status,'text')}}
												</view>
											</view>
											<view class="image-contain" v-if="item1.pic && item1.pic !== '[]'">
												<image-show :imgSrc="item1.pic" width="144" height="144"
													:key="item.pic">
												</image-show>
											</view>
										</view>
										<view v-if="index1 == 3" class="list-contain">
											................
										</view>
									</view>
								</view>

								<!-- 项目经理查看服务日志 -->
								<!-- v-if="navDisplay" -->
								<view>
									<text class="text">{{item.desc}}</text>
									<view class="image_show" v-if="item.pic">
										<image-show :imgSrc="item.pic" :key="item.pic" />
									</view>
								</view>

								<!-- 点赞、评论 -->
								<view class="interaction align-items">
									<text class="left_title">{{item.statusName}}</text>
									<view class="right align-items">
										<view class="give_up">
											<image class="give_up_icon" src="/static/icon/give-up.png"
												@click.stop="giveUp(item.id,item.likeFlag)" />
											<text class="count">{{item.agrees}}</text>
										</view>
										<image class="comment" @click.stop="goComment(item.id)"
											src="/static/icon/comment3.png" />
									</view>
								</view>

								<view class="comment_con"
									v-if="item.journalDiscussList && item.journalDiscussList.length">
									<view class="comment_item" v-for="(i,x) in item.journalDiscussList" :key="i.id">
										<view class="display-left">
											<u-avatar v-if="i.userId" size="40" class="avatar"
												:src="$util.avatarImage(i.userId)" />
											<text class="owner">{{i.realName}}</text>
											<text class="skill_name">({{i.skillName}})</text>
										</view>
										<view class="content">{{i.desc}}</view>
									</view>
								</view>

								<view v-if="item.audio">
									<journal-audio :formDate="JSON.parse(item.audio)" />
								</view>
							</view>
						</view>
					</view>
					<u-loadmore :status="status" v-if="loadmoreShow" />
				</view>
			</view>

			<mh-empty v-show="journalList.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
		</view>
		
		
		<!-- <bottom-button title="填写服务日志" @click="goAddConstructionLog()" /> -->
		
		<mihuo-bottom-button :buttonList="buttonList" @click="goAddConstructionLog()"></mihuo-bottom-button>
		
		
		<u-popup v-model="commentShow" mode="bottom">
			<view class="comment_view align-items">
				<textarea focus placeholder-style="color:#606166" placeholder="留下您精彩的评论" style="width: 90%;
					height: 104rpx;padding: 28rpx 24rpx;box-sizing: border-box;background: #F6F7F9;
					border-radius: 10rpx;font-size: 25rpx;" v-model="commentDesc" />
				<button class="release_btn" type="default" @click="releaseComment">发布</button>
			</view>
		</u-popup>
		<u-popup v-model="typeShow" mode="bottom" class="u-popup">
			<view class="popup_con">
				<view class="cancel_title_confirm align-items">
					<text class="cancel" @click="typeShow = false">取消</text>
					<text class="title">筛选</text>
					<text class="confirm" @click="confirmSelect">确认</text>
				</view>
				<view>
					<view class="nav_view">
						<view class="left">按岗位筛选</view>
						<view class="right" @click.stop="postOpen">
							{{isOpen?'收起':'展开'}}
							<image class="open_arrow" src="/static/icon/open_arrow.png"
								:style="isOpen?'transform:rotate(90deg);':''">
						</view>
					</view>
					<view class="type_view align-items">
						<view class="type_item" :class="{'isSelect':typeCurrent.includes(x)}"
							v-for="(item,x) in postType" :key="x" @click="selectType(item,x)">{{item}}</view>
					</view>
					<view class="nav_view">
						<view class="left">按工种筛选</view>
						<view class="right" @click.stop="workOpen">
							{{isOpen2?'收起':'展开'}}
							<image class="open_arrow" src="/static/icon/open_arrow.png"
								:style="isOpen2?'transform:rotate(90deg);':''">
						</view>
					</view>
					<view class="type_view align-items">
						<view class="type_item" :class="{'isSelect':typeCurrent2.includes(x)}"
							v-for="(item,x) in workType" :key="x" @click="selectType2(item,x)">{{item}}</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				isOpen: false,
				isOpen2: false,
				isSelected: true,
				loadmoreShow: true,
				journalId: '',
				typeCurrent: [],
				typeCurrent2: [],
				typeShow: false,
				typeList: [],
				postType: [],
				workType: [],
				postSkillName: [],
				workSkillName: [],
				personId: '',
				commentDesc: '',
				commentShow: false,
				status: 'loadmore',
				selectIdx: 0,
				selectList: [{
					name: '只看我的'
				}, {
					name: '设计师'
				}, {
					name: '工人'
				}],
				imgList: [],
				journalList: [],
				videoContext: '',
				currentTime: 0,
				page: 1,
				size: 10,
				pages: 0,
				total: 0,
				imageGlobal: this.$image.imageGlobal,
				projectId: '',
				option: {},
				position: '',
				colorList: [
					{
						status: 0,
						// name: '未开工',
						// color: '#FF5D35',
						// bgColor: '#FEF1E3'
						name: '',
						color: '',
						bgColor: ''
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
				buttonList: [{
					name: '填写服务日志',
					status: true
				}],
			}
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userRole', 'orderInfo', 'userPersonInfo', 'remainingDays']),
			navDisplay() {
				if (this.position.indexOf('R_PROJECT_MANAGER') !== -1) {
					return true
				} else {
					return false
				}
			},
		},

		onShow() {
			this.parameterType();
			this.getType();
		},
		onLoad(option) {
			this.option = option
		},
		onReachBottom() {
			if (this.journalList.length === this.total) return;
			this.status = "loading";
			setTimeout(() => {
				this.page = this.page + 1;
				this.getJournal(this.page)
			}, 1000)
		},
		methods: {
			//岗位展开收起
			postOpen() {
				this.isOpen = !this.isOpen
				if (!this.isOpen) {
					this.postType = this.typeList[0].slice(0, 3)
				} else {
					this.postType = this.typeList[0]
				}
			},
			//工种展开收起
			workOpen() {
				this.isOpen2 = !this.isOpen2
				if (!this.isOpen2) {
					this.workType = this.typeList[1].slice(0, 3)
				} else {
					this.workType = this.typeList[1]
				}
			},
			parameterType() {
				if (this.option.type == '服务日志') {
					if (!this.option.noticeType) {
						this.$notificationsJump(this.option)
					}
					this.projectId = this.option.projectId
				} else {
					this.projectId = this.projectInfo.projectId
				}
				this.position = this.userRole
				this.personId = this.userPersonInfo.personId
				this.getJournal(this.page)
			},
			confirmSelect() {
				let skillName = [...this.postSkillName, ...this.workSkillName];
				//筛选可多选传多个岗位和工种
				this.getJournal(this.page, skillName.join(','));
				this.typeShow = false;
				//查完清空状态
				this.typeCurrent = [];
				this.typeCurrent2 = [];
				this.postSkillName = [];
				this.workSkillName = []
				skillName = ''
			},
			selectType(val, index) {
				if (this.typeCurrent.includes(index)) {
					let idx = this.typeCurrent.indexOf(index)
					this.typeCurrent.map((item, i) => {
						if (idx == i) {
							//取消选中
							this.typeCurrent.splice(i, 1)
							//取消选中岗位
							this.postSkillName.splice(i, 1)
						}
					})
				} else {
					//添加选中
					this.typeCurrent.push(index)
					this.postSkillName.push(val)
				}
			},
			selectType2(val, index) {
				if (this.typeCurrent2.includes(index)) {
					let idx = this.typeCurrent2.indexOf(index)
					this.typeCurrent2.map((item, i) => {
						if (idx == i) {
							//取消选中
							this.typeCurrent2.splice(i, 1)
							//取消选中岗位
							this.workSkillName.splice(i, 1)
						}
					})
				} else {
					//添加选中
					this.typeCurrent2.push(index)
					this.workSkillName.push(val)
				}
			},
			//获取筛选的岗位工种类型
			getType() {
				if (!this.projectId) {
					return
				}
				this.$http.get("order/bizproject/getProjectMemberAll", {
					projectId: Number(this.projectId)
				}).then(res => {
					if (res) {
						let list = [],
							tempList = [],
							tempList2 = [];
						Object.keys(res).map((m, i) => {
							list.push({
								name: m
							})
						})
						list.map((item, index) => {
							item['value'] = Object.values(res)[index]
						})
						list.map(item => {
							if (item.value === 'JOB_WORKER') {
								tempList.push(item.name)
							} else {
								tempList2.push(item.name)
							}
						})
						this.typeList.push([...tempList2])
						this.typeList.push([...tempList])
						this.postType = this.typeList[0].slice(0, 3)
						this.workType = this.typeList[1].slice(0, 3)
					}
				})
			},
			//发布评价
			releaseComment() {
				this.$http.post("order/construction_journal_discuss", {
					desc: this.commentDesc,
					journalId: this.journalId,
					personId: this.userPersonInfo.personId,
					realName: this.userPersonInfo.name,
					avatar: this.userPersonInfo.avatar,
					skillName: this.userPersonInfo.skillName,
					pic: ""
				}).then(res => {
					if (res) {
						this.$util.toast("发布成功")
						this.getJournal(this.page)
						this.commentShow = false;
						this.commentDesc = ''
					}

				}).catch(err => console.log(err))
			},

			onpullingdown() {
				this.page = 1;
			},

			// 点赞
			giveUp(id, flag) {
				this.$http.post("order/bizconstructionjournallike/saveOrEdit", {
					businessId: Number(id),
					personId: this.personId
				}).then(res => {
					this.$util.toast(!flag ? "点赞成功!" : '取消成功!')
					this.getJournal(this.page);
				}).catch(err => console.log(err))
			},

			goComment(id) {
				this.journalId = id;
				this.commentShow = true
			},
			// 获取日志
			getJournal(currentPage, job) {
				let data = {
					projectId: Number(this.projectId),
					personId: this.position !== 'R_PROJECT_MANAGER' ? Number(this.personId) : '',
					currentPersonId: Number(this.personId),
					current: currentPage,
					size: this.size,
					skillNames: job ? job : '',
					// orderId: this.orderInfo.orderId
				}
				this.$httpApi.getConstructionRecord(data).then(res => {
					this.pages = Number(res.pages);
					this.total = Number(res.total);

					if (res.records.length !== 0) {
						if (currentPage === 1) {
							this.journalList = res.records;
						} else {
							this.journalList = this.journalList.concat(res.records);
						}
						if (currentPage === Number(res.pages)) {
							this.loadmoreShow = false
							this.status = "nomore";
						} else {
							this.status = "loadmore";
						}
					} else if (res.records.length === 0) {
						this.status = "nomore";
						this.journalList = []
					}
				}).catch(e => console.log(e))
			},
			goAddConstructionLog() {
				uni.navigateTo({
					url: '/pages/construction/addConstructionLog'
				})
			},
			selectStatus() {
				this.typeShow = true;
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
			
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	page {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.icon-jian {
		width: 16rpx;
		height: 14rpx;

	}

	.list-scroll-content {
		// height: calc(100vh - 200rpx - var(--status-bar-height));
	}

	.select_wrap {
		height: 88rpx;
		margin: 0 10rpx;

		.select_left {
			.title_icon {
				width: 40rpx;
				height: 30rpx;
			}

			.title {
				font-weight: bold;
				font-size: $middleFontSize;
				color: $seconFontColor;
			}
		}

		.select_dwon_arrow {
			width: 38rpx;
			height: 38rpx;
			margin: 0 10rpx;
		}

		.hint_text {
			font-weight: bold;
			font-size: $middleFontSize;
			color: #909199;
		}

		.select_switch {
			padding-right: 26rpx;
			position: relative;

			.select-content {
				position: absolute;
				z-index: 20;
				right: 20rpx;
				top: 46rpx;
				overflow: hidden;
			}
		}
	}

	.other_post_style {
		margin-left: 42rpx;
		padding: 28rpx 20rpx 28rpx 40rpx;
		border-left: 2rpx dashed #C4C4C4;
		overflow: hidden;
	}

	.journal_item {

		&:last-child {
			.other_post_style {
				padding: 28rpx 20rpx 0rpx 40rpx;
			}
		}

		.in_time {
			margin-left: 24rpx;
			// padding-top: 54rpx;
			position: relative;

			.time {
				font-weight: bold;
				font-size: 26rpx;
				color: #909199;
			}
		}

		.staff_info {
			.avatar {
				margin-right: 16rpx;
			}

			.name_view {
				.name {
					font-size: 30rpx;
					color: $seconFontColor;
				}

				.job_name {
					padding: 6rpx 12rpx 6rpx 16rpx;
					margin-left: 6rpx;
					color: #FFFFFF;
					font-size: 20rpx;
					// background: linear-gradient(180deg, #80BDFF 0%, #278BFF 100%);
					background: $themeColor;
					border-radius: 50rpx 4rpx 4rpx 50rpx;
				}

				.job_name2 {
					font-size: 26rpx;
					color: #909199;
				}
			}

			.info {
				font-size: 26rpx;
				color: #909199;
			}
		}

		.item_con {
			padding: 28rpx 30rpx;
			background: #FFFFFF;
			border-radius: 20rpx;

			.text {
				margin-top: 26rpx;
				text-align: justify;
				font-size: 26rpx;
				color: #606166;
				@include bov(3);
			}

		}

		.image_show {
			margin: 28rpx 0;
		}
	}

	.interaction {
		margin-top: 20rpx;

		.left_title {
			font-weight: bold;
			font-size: 26rpx;
			color: #909199;
		}

		.right {

			// width: 140rpx;
			.give_up {
				position: relative;
				margin-right: 86rpx;

				.give_up_icon {
					width: 42rpx;
					height: 42rpx;
				}

				.count {
					font-size: $smallFontSize;
					color: $themeColor;
					position: absolute;
					top: -15rpx;
					right: -25rpx;
				}
			}

			.comment {
				width: 42rpx;
				height: 42rpx;
			}
		}
	}

	.comment_con {
		max-height: 320rpx;
		padding: 10rpx 20rpx 20rpx;
		margin: 12rpx 0 32rpx 0;
		background: #F7F7F7;
		border-radius: 10rpx;
		overflow-y: scroll;

		.comment_item {
			margin-top: 20rpx;

			.owner {
				font-weight: bold;
				font-size: 26rpx;
				color: $darkTitle;
			}

			.skill_name {
				font-size: 26rpx;
				color: #909199;
			}

			.avatar {
				margin-right: 4rpx;
			}
		}

		.content {
			margin-top: 6rpx;
			text-align: justify;
			font-size: 26rpx;
			color: #909199;
			@include bov();

		}
	}

	.comment_view {
		background-color: #FFFFFF;
		padding: 30rpx 18rpx 18rpx;

		.release_btn {
			letter-spacing: 2rpx;
			background: transparent;
			color: $themeColor;
			font-weight: bold;
			font-size: $smallFontSize;
		}
	}

	.popup_con {
		background: #FFFFFF;
	}

	.cancel_title_confirm {
		padding: 48rpx 40rpx;

		.cancel {
			font-size: 28rpx;
			color: #909199;
		}

		.title {
			font-weight: bold;
			font-size: 30rpx;
			color: #303133;
		}

		.confirm {
			font-weight: bold;
			font-size: 28rpx;
			color: $themeColor;
		}
	}

	.type_view:after {
		content: '';
		display: block;
		width: 200rpx;
		height: 80rpx;
	}

	.nav_view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 44rpx 28rpx 68rpx;

		.left,
		.right {
			font-size: 14px;
			color: #909199;
		}

		.open_arrow {
			display: inline-block;
			width: 16rpx;
			height: 16rpx;
			margin-left: 8rpx;
			transition: all .2s;
		}
	}

	.type_view {
		padding: 12rpx 40rpx 54rpx;
		flex-wrap: wrap;

		.type_item {
			width: 200rpx;
			line-height: 80rpx;
			margin-bottom: 16rpx;
			border: 2rpx solid #EEEEEE;
			color: #303133;
			font-size: 28rpx;
			text-align: center;
			border-radius: 10rpx;
		}

		.isSelect {
			border: 2rpx solid $themeColor;
			color: $themeColor;
			background-image: url(../../static/icon/isselect.png);
			background-repeat: no-repeat;
			background-position: right bottom;
			background-size: auto;
		}
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.display-left {
		display: flex;
		justify-content: left;
		align-items: center;
	}


	.details-list {
		// margin-top: 20rpx;

		.title-contain {
			display: flex;
			justify-content: space-between;
			margin-bottom: 18rpx;

			.item-label {
				color: #303133;
				font-size: 28rpx;
				font-weight: bold;
				line-height: 38rpx;
			}

			.item-right {
				display: flex;
				align-items: center;

				text {
					color: #303133;
					font-size: 24rpx;
				}

				image {
					margin-left: 10rpx;
					transform: rotate(-90deg)
				}
			}
		}

		// .title {
		// 	color: #303133;
		// 	font-size: 28rpx;
		// 	font-weight: bold;
		// 	margin-bottom: 18rpx;
		// 	line-height: 38rpx;
		// }

		.item-details {

			.item-title {
				color: #303133;
				font-size: 28rpx;
				line-height: 38rpx;
				max-width: 470rpx;
			}
			
			&:last-child{
				.item-list_contain{
					margin-bottom: 0rpx;
				}
			}
			
			.list-contain{
				
				
				.item-list_contain{
					display: flex;
					align-items: center;
					margin-bottom: 16rpx;
					
					.item-status {
						width: 100rpx;
						font-size: 24rpx;
						border-radius: 20rpx;
						text-align: center;
						padding: 4rpx 0;
						margin-left: 10rpx;
					}
				}
				
				
			}
		}

		.image-contain {
			margin-top: 22px;
			margin-bottom: 22px;
		}
	}

	.tomorrow-contain {
		border-top: 2rpx solid #F6F6F6;
		padding-top: 30rpx;
		margin-top: 30rpx;

		.title {
			color: #303133;
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 18rpx;
			line-height: 38rpx;
		}


		.tomorrow-desc {
			color: #303133;
			font-size: 28rpx;
			line-height: 38rpx;
		}
	}
</style>
