<template>
	<view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback"
			@up="upCallback">
			<view>
				<view v-for="item in list" :key="item.id" class="notice-content" @click="toDetail(item)">
					<view v-if="!item.readFlag" class="node"></view>
					<view><text class="title">{{item.title}}</text>
						<image @click.stop="()=>deleteNotice(item)" class="delete"
							src="@/static/images/delete_icon/notice_delete.png" />
						</image>
					</view>
					<view class="date-content">
						{{getNoticeDate(item.created)}}
					</view>
					<view style="margin-top: 14rpx;"><text class="content">{{item.content}}</text></view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		getShowDate,
		getNoticeDate
	} from '@/static/js/chat.js';
	import {
		getQueryString
	} from '@/plugins/utils.js'
	export default {
		data() {
			return {
				downOption: {
					auto: false,
					page: {
						num: 1,
						size: 20 // 每页数据的数量,默认10
					}
				},
				upOption: {
					auto: true,
					page: {
						num: 1,
						size: 30 // 每页数据的数量,默认10
					},
					empty: {
						use: true, // 是否显示空布局
						icon: "/static/images/wait_examine.png", // 图标路径 (建议放入static目录, 如 /static/images/mescroll-empty.png )
						tip: '暂时还没有任何记录～' // 提示
					},
					toTop: {
						src: ''
					},
					onScroll: true,
					textNoMore: ''
				},
				mescroll: null,
				title: '',
				current: 1,
				size: 10,
				list: [],
				tempRemindUrlNew: '',
				taskTypeUrl: '',
				jumpPathList: [{
						label: '选材',
						value: 1001,
						url: '/pages/construction/selectMaterial/selectMaterialPage'
					},
					{
						label: '交底',
						value: 1010,
						url: '/pages/construction/disclosure/disclosurePage'
					},
					{
						label: '量房',
						value: 1011,
						url: '/pages/construction/measuringRoom/measuringRoomPage'
					},
					{
						label: '派单',
						value: 1002,
						url: '/pages/construction/middleOrder'
					},
					{
						label: '预算',
						value: 1003,
						url: 'pages/construction/budget/budgetPage'
					},
					{
						label: '施工',
						value: 1004,
						url: '/pages/construction/middleConstruction'
					},
					{
						label: '上传',
						value: 1006,
						url: '/pages/construction/drawings/uploadDrawings'
					},
					{
						label: '验收',
						value: 1005,
						url: '/pages/construction/middleExternalAccept'
					},
					{
						label: '评价',
						value: 1009,
						url: '/pages/construction/evaluation/evaluationPage'
					},
					{
						label: '收款',
						value: 1012,
						url: '/pages/construction/collection/collectionPage'
					},
					{
						label: '订单详情',
						value: '',
						url: '/pages/orderReceiving/releaseOrderDetails'
					},
					{
						label: '新订单',
						value: '',
						url: '/pages/orderReceiving/releaseOrderDetails'
					},
					{
						label: '施工计划',
						value: '',
						url: '/pages/construction/constructionPlan'
					},
					{
						label: '服务团队',
						value: '',
						url: '/pages/construction/assignmentDetail/common/serviceTeam'
					},
					{
						label: '服务日志',
						value: '',
						url: '/pages/construction/constructionLog'
					},
					{
						label: '查看图纸',
						value: '',
						url: '/pages/construction/drawings/drawings'
					},
					{
						label: '停工复工',
						value: '',
						url: '/pages/construction/shutdownReturnWork/shutDownDetails'
					},
					{
						label: '工人工费',
						value: '',
						url: '/pages/construction/laborCost/laborCostDetails'
					},
					{
						label: '申请',
						value: '',
						url: '/pages/construction/complaint/complaintList'
					},
					{
						label: '申述',
						value: '',
						url: '/pages/construction/complaint/complaintList'
					},
					{
						label: '变更',
						value: '',
						url: '/pages/construction/changeRecord/changeIndex'
					},
					{
						label: '处罚',
						value: '',
						url: '/pages/construction/punish/punishIndex'
					},
					{
						label: '交底通知',
						value: '',
						url: '/pages/construction/disclosure/viewDisclosureNotice'
					},
					{
						label: '交底内容',
						value: '',
						url: '/pages/construction/disclosure/viewDisclosureText'
					}
				],

			}
		},
		onBackPress() {
			uni.$off('updateNotice');
		},
		onLoad(option) {
			this.title = option.title;
			uni.setNavigationBarTitle({
				title: option.title
			})
			uni.$on('updateNotice', (data) => {
				const findIndex = this.list.findIndex(item => item.id == data.id);
				const find = this.list.find(item => item.id == data.id);
				if (this.list[findIndex]) {
					this.list[findIndex].readFlag = 1
				};
			})
		},
		methods: {
			toDetail(item) {
				//先把状态更新为已读
				item.readFlag = true;
				this.$http.get(`basic/basicmessage/updateById/${item.id}`).then(res => {})
				
				if (!item.navUrl) {
					return
				}
				this.debounce(() => {
					if (item.classification !== '其它') {
						if (!item.navUrl) {
							return
						}
						const query = JSON.parse(item.navUrl)
						let tempUrl = this.jumpPathList.find(item => item.label == query.type)
						// 单独提出来技能审核
						if(query.type == '技能审核'){
							this.getSkill(query)
							return
						}
						
						if (!tempUrl) {
							return
						}
						if (query.type == '订单详情' || query.type == '新订单') {
							let orderId = query.orderId
							if (!orderId) {
								return
							}
							this.orderDetailsJump(orderId,(res,item)=>{
								if(res){
									tempUrl['callbackStatus'] = true
									tempUrl['projectId'] = item.projectId
									tempUrl['nodeId'] = query.nodeId
									this.$notificationsJump(tempUrl, () => {
										this.toPage(`/pages/construction/assignmentDetail/assignmentDetail?noticeType=消息跳转`)
									})
								}else{
									this.toPage(`${tempUrl.url}?id=${orderId}&noticeType=消息跳转`)
								}
							})	
						} else {
							tempUrl['callbackStatus'] = true
							tempUrl['projectId'] = query.projectId
							tempUrl['nodeId'] = query.nodeId
							this.$notificationsJump(tempUrl, () => {
								let pageUrl = `${tempUrl.url}?noticeType=消息跳转`
								if(query.discloseId){
									pageUrl = `${tempUrl.url}?noticeType=消息跳转&detailsId=${query.discloseId}`
								}
								this.toPage(pageUrl)
							})
						}
					} else {
						this.toPage(`/pages/noticeDetaile/noticeDetaile?title=${item.title}&id=${item.id}`)
					}
				}, 200)
			},
			/**
			 * 
			 * @description orderStatus 订单状态: 10=已发布/待确认； 15已报价待确认,  20=已确认/待付款；30=已付款/服务中；35=已申请/待验收；40=待结算；50=已完成/待评价；51=已完成/已评价；-1=已取消
			 * 1.如果该订单绑定了sop模板、并且orderStatus 大于等于30,则直接跳转sop 工作台
			 * 
			 * */
			orderDetailsJump(orderId,callback) {
				this.$httpApi.getOrderById(orderId).then(res => {
					if (!res) {
						return
					}
					if (res.deliveryType && res.orderStatus >= 30) {
						callback && callback(true,res)
						return
					}
					callback && callback(false,res)

				})
			},
			functionPageJump(item) {
				item['callbackStatus'] = true
				const query = JSON.parse(item.navUrl)
				item['projectId'] = query.projectId
				item['nodeId'] = query.nodeId
				this.$notificationsJump(item, () => {
					this.toPage(`/${item.navUrl}&noticeType=消息跳转`)
				})
			},
			/**
			 * @description 如果当前工种审核失败则跳转详情页,否则跳转列表页
			 * auditStatus	审核状态（0已提交、1未通过、2已通过）
			 * */
			getSkill(event){
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						let tempUser = res.personageList.find(item =>item.skillId == event.skillId)
						if(tempUser){
							if(tempUser.auditStatus == 1){
								uni.navigateTo({
									url: '/pages/setting/skillCertification/skillCertificationDetails',
									success(res) {
										res.eventChannel.emit('skillDetails', {
											details: tempUser,
										});
									}
								})
							}else{
								this.toPage('/pages/setting/skillCertification/skillCertificationPage')
							}
						}
					}
				})
			},
			getParam(path, name) {
				var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
				if (reg.test(path)) {
					return unescape(RegExp.$2.replace(/\+/g, " "));
				}
				return "";
			},
			getBiztaskDetails(item) {
				if (item.nodeId) {
					this.$httpApi.sopNodeTemplate({
						nodeId: item.nodeId
					}).then(res => {
						if (res) {
							this.$store.commit('setNodeInfo', res)
							// 根据任务详情计算距离该节点完成时间还剩多少天
							this.$remainingDays()
							item['callbackStatus'] = true
							this.$notificationsJump(item, () => {
								this.toPage(
									`${this.taskTypeUrl}?optionType=提醒通知&remindUrl=${this.tempRemindUrlNew.remindUrl}`
								)
							})
						}
					})
				} else {
					this.$util.toast('没有节点id');
				}
			},
			getList() {
				this.$http.get(
						`basic/basicmessage/page?classification=${this.title}&current=${this.current}&size=${this.size}`)
					.then(res => {
						console.log(res)
						this.list = [...this.list, ...res.records];
						//this.mescroll.endBySize(10, true);
						this.mescroll.endBySize(10, true)
					})
			},
			getNoticeDate(date) {
				return getNoticeDate(date)
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			async downCallback() {
				const params = {
					pageno: this.downOption.page.num,
					pagesize: this.downOption.page.size
				}
				const data = await this.$http.get(
					`basic/basicmessage/page?classification=${this.title}&current=${params.pageno}&size=${params.pagesize}`
				)
				const records = data.records ? data.records : []
				this.list = records

				this.mescroll && this.mescroll.endSuccess(data.length)
			},
			async upCallback(page) {
				this.upOption.page.num = page.num
				const params = {
					pageno: this.upOption.page.num,
					pagesize: page.size ? page.size : this.upOption.page.size
				}
				const data = await this.$http.get(
					`basic/basicmessage/page?classification=${this.title}&current=${params.pageno}&size=${params.pagesize}`
				)
				const records = data.records ? data.records : []
				this.list = this.list.concat(records)
				this.mescroll && this.mescroll.endSuccess(this.list.length)
			},
			deleteNotice(item) {
				uni.showModal({
					content: "确定删除消息么",
					success: (res) => {
						if (res.confirm) {
							const index = this.list.findIndex(data => data.id == item.id);
							this.$http.get(`basic/basicmessage/removeById/${item.id}`).then(res => {
								this.list.splice(index, 1)
								this.upCallback({
									num: this.upOption.page.num += 1
								})
								this.$util.toast("已删除")
							})
						}
					}
				})

			}
		},
		onNavigationBarButtonTap(e) {
			if (!this.list.length) {
				this.$util.toast('还没有通知消息');
				return;
			}
			this.$http.get(`basic/basicmessage/updateBatch?classification=${this.title}`).then(async res => {
				const params = {
					pageno: this.downOption.page.num,
					pagesize: this.downOption.page.size
				}
				const data = await this.$http.get(
					`basic/basicmessage/page?classification=${this.title}&current=${params.pageno}&size=${params.pagesize}`
				)
				const records = data.records ? data.records : []
				this.list = records
				this.mescroll && this.mescroll.endSuccess(data.length)
			})
		}
	}
</script>

<style lang="scss" scoped>
	.notice-content {
		background: #fff;
		border-radius: 16rpx;
		margin: 20rpx;
		padding: 36rpx;
		position: relative;

		.date-content {
			border-bottom: 2rpx solid $divider;
			padding-bottom: 20rpx;
			margin-top: 3rpx;
			line-height: 100%;
			color: $viceFontColor;
			font-size: 24rpx;
		}

		.node {
			position: absolute;
			top: 49%;
			left: 10rpx;
			width: 10rpx;
			height: 10rpx;
			border-radius: 10rpx;
			background-color: $linghtWarningColor;
		}

		.title {
			color: $seconFontColor;
			font-size: 30rpx;
			flex: 1;
		}

		.content {
			color: $viceFontColor;
			font-size: 26rpx;
		}

		.delete {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
