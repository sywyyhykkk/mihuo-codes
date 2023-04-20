<template>
	<view class="order-new-item-contain">
		<!-- 我服务的订单 -->
		<view v-if="!isSender" class="orde-item" @click="goToAssignmentDetail">
			<!-- 无sop的订单 -->
			<view v-if="orderData.project && orderData.project.source !== 0 " class="order-item-title">
				<view class="order-item-contain">
					<view class="order-no-text">编号</view>
					<view class="order-no">{{ orderData.orderCode }}</view>
				</view>
				<view class="order-status">{{ setOrderStatus }}</view>
			</view>
			<!-- 有sop的订单 -->
			<view v-else class="order-title-contain">
				<view class="item-left">
					<u-avatar class="icon-image" :src="$util.thumbnailImage(setPortrait(orderData),true)" size="36">
					</u-avatar>
					<text class="corporate-name">{{ setContactName}}</text>
				</view>
				<view class="item-right">
					{{setOrderStatus}}
				</view>
			</view>
			<view class="other-bottom-contain">
				<view class="other-left">
					<view class="other-node">
						<view class="other-node-text">
							{{ orderData.requirementTypeName }}
						</view>
					</view>
					<image @click.stop="imagePreview(setUrl)" class="order-image" :src="setUrl">
					</image>
				</view>
				<view class="order-hint">
					<view class="order-name-top">
						<view v-if="Number(orderData.projectId) !== -1" class="order-name">
							<view class="item-publish-type"
								:class="setPublishType == '指派'? 'item-publish-type-active':'item-publish-type-default' ">
								{{setPublishType}}
							</view>
							<view class="requirement-desc-contain">
								{{ orderData.project.poiName }}{{ orderData.skillName }}{{ setRole() }}
							</view>
						</view>
						<view v-else class="order-name">
							<view class="item-publish-type"
								:class="setPublishType == '指派'? 'item-publish-type-active':'item-publish-type-default' ">
								{{setPublishType}}
							</view>
							<view class="requirement-desc-contain">
								{{ setRequirementTitle }}
							</view>
						</view>
					</view>
					<view class="order-address">
						<view v-if="orderData.projectId !== -1 && orderData.project && orderData.project.latAddress"
							class="order-address-text">
							{{ orderData.project.latAddress }}{{orderData.project.poiName}}
						</view>
						<view v-else class="order-address-text">
							<!-- {{ orderData.cityNam || '暂无地址' }} -->
							{{ orderData.latAddress || '暂无地址' }}{{orderData.poiName}}
						</view>
						<view v-if="orderData.projectId !== -1 &&  orderData.project && orderData.project.latAddress"
							class="item-address">
							<image v-if="isShowDistance" src="../../static/icon/position2.png"
								class="order-address-image"></image>
							<view v-if="orderData.distance && isShowDistance" class="order-address-position">
								{{ orderData.distance }}
							</view>
						</view>
						<view class="item-address" v-else>
							<image v-if="isShowDistance" src="../../static/icon/position2.png"
								class="order-address-image"></image>
							<view v-if="orderData.distance && isShowDistance" class="order-address-position">
								{{ orderData.distance }}
							</view>
						</view>
					</view>
					<view v-if="orderData.projectId !== -1 && orderData.project" class="order-bottom-date">
						<!-- 合同开工日期-合同完工日期 -->
						<!-- expectDate  期望上门时间 -->
						<view v-if="orderData.project.contractStartDate" class="order-date">
							合同工期：{{ orderData.project.contractStartDate }}至{{orderData.project.contractFinishDate }}
						</view>
						<view v-else="orderData.project.contractStartDate" class="order-date">
							期望上门时间：{{ orderData.expectDate }}
						</view>
					</view>
					<view v-else class="order-bottom-date">
						<!-- 期望上门日期，expectDate yyyy-MM-dd 预计完工日期: expectCompleteDate-->
						<view class="order-date">
							合同工期：{{ orderData.expectDate }}至{{orderData.expectCompleteDate }}
						</view>
					</view>
				</view>
			</view>
			<view class="order-finish-ststus"
				v-if="orderData.project && orderData.project.statisticsDTO && orderData.orderStatus > 10 ">
				<view class="table_box-item">
					<view class="table_box">
						{{orderData.project.statisticsDTO.dangerNum == 0? '--': orderData.project.statisticsDTO.dangerNum }}
					</view>
					<view class="table_box2">风险</view>
				</view>
				<view class="table_box-item">
					<view class="table_box" style="color: #ff9b26">
						{{ orderData.project.statisticsDTO.unfinishNum == 0 ? '--': orderData.project.statisticsDTO.unfinishNum }}
					</view>
					<view class="table_box2">未完成</view>
				</view>
				<view class="table_box-item">
					<view class="table_box" style="color: #10bf78">
						{{orderData.project.statisticsDTO.finishNum == null? '--': orderData.project.statisticsDTO.finishNum }}
					</view>
					<view class="table_box2">已完成</view>
				</view>
				<view class="table_box-item">
					<view class="table_box" style="color: $themeColor">{{ orderData.project.statisticsDTO.allNum }}
					</view>
					<view class="table_box2">全部</view>
				</view>
			</view>
			<view class="order-task"
				v-if=" tabIndex == 0 && orderData.project && orderData.project.statisticsDTO.firstNode && orderData.projectId !== -1">
				<view class="order-task-left">
					<view class="order-task-top">我的任务</view>
					<view class="order-task-bottom">
						<view class="order-task-title">
							<text>
								{{orderData.project.statisticsDTO.firstNode.nodeName }}
							</text>
						</view>
						<view class="order-task-right">
							<view class="default-task" :class="getNodeStatus && getNodeStatus.class">
								{{getNodeStatus && getNodeStatus.text}}
							</view>
							<text
								v-if="orderData.project.statisticsDTO && orderData.project.statisticsDTO.firstNode.planDay"
								:class="[getDateNumber(orderData.project.statisticsDTO.firstNode.expectFinishTime || orderData.project.expectFinishTime, orderData.project.statisticsDTO.firstNode.realEndTime).status ? 'default-time' : 'beyond-the']">{{
								getDateNumber(
									orderData.project.statisticsDTO.firstNode.expectFinishTime || orderData.project.expectFinishTime,
									orderData.project.statisticsDTO.firstNode.realEndTime,
									getStatus(orderData.project.statisticsDTO.firstNode)
								).time
							}}</text>
						</view>
					</view>
				</view>
				<image src="@/static/icon/arrow.png" class="right-icon">
				</image>
			</view>

			<!-- 操作日志 -->
			<view v-if="orderData.pendingList && orderData.pendingList.length > 0" class="order-operation-log"
				@click.stop="getLogDetails(orderData)">
				<u-avatar class="icon-image"
					:src="$util.avatarImage(orderData.pendingList[0] && orderData.pendingList[0].userId,true)" size="36">
				</u-avatar>
				<view class="item-log" v-if="orderData.pendingList[0]">
					{{orderData.pendingList[0].userName}}({{orderData.pendingList[0].skillName}}){{ orderData.pendingList[0].title}}
				</view>
			</view>
			<!-- 操作按钮 -->
			<view v-if="setButtonList.length > 0" class="order-bottom-button">
				<view class="item-button" :class="[item.active ? 'item-button-active':'']"
					v-for="(item,index) in setButtonList" :key="index" @click.stop="getButton(item.lable,orderData)">
					{{item.lable}}
				</view>
			</view>
		</view>
		<!-- 我服务的 -->
		<view v-else class="orde-item" @click="goOrderReceiving(orderData.id)">
			<view class="order-item-title">
				<view class="order-item-contain">
					<view class="order-no-text">编号</view>
					<view class="order-no">{{ orderData.orderCode }}</view>
				</view>
				<view class="order-status">{{ getOrderStatus }}</view>
			</view>
			<view class="other-bottom-contain">
				<view class="other-left">
					<view class="other-node">
						<view class="other-node-text">
							{{ orderData.requirementTypeName }}
						</view>
					</view>
					<image class="order-image" @click.stop="imagePreview(setUrl)" :src="setUrl" />
				</view>
				<view class="order-hint">
					<view class="release-name-top">
						<text class="item-left">
							<text class="item-work-type-default" :class="setSkillNameLength(orderData.skillName)">
								<view class="type-text">{{ orderData.skillName || '其他' }}</view>
							</text>
							<text class="release-order-name">{{ setRequirementTitle }}</text>
						</text>
						<text v-if="setPrice" class=" release-order-offer">{{ setPrice }}元</text>
					</view>
					<view class="order-address order-address-release">
						<view class="order-address-text">{{orderData.latAddress}}{{ orderData.poiName }}</view>
						<image v-if="isShowDistance" src="../../static/icon/position2.png" class="order-address-image">
						</image>
						<view v-if="orderData.distance && isShowDistance" class="order-address-position">
							{{ orderData.distance }}
						</view>
					</view>
					<view v-if="orderData.competitionCount == 0" class="order-bottom-date">
						<view class="order-date2">发布时间：{{ orderData.created &&  orderData.created.substring(0,16)}}
						</view>
						<view class="order-skill-type">所需工种：{{ orderData.skillName || '暂无' }}</view>
					</view>
					<view v-else class="order-offer-person">
						<image v-if="orderData.avatarList" :src="$util.thumbnailImage(item)" class="person-image"
							v-for="(item, index) in orderData.avatarList" :key="index" />
						<view class="order-person-number">{{ orderData.competitionCount }}人报价</view>
					</view>
				</view>
			</view>
			<order-cancel-reason :orderId="orderData.id" ref="orderCancelReason" @cancelReason="cancelReason">
			</order-cancel-reason>
		</view>
	</view>
</template>

<script>
	import {
		getImgByJobCode,
		getDistance
	} from '@/plugins/utils.js'
	export default {
		name: 'order-new-item',
		props: {
			orderData: {},
			tabIndex: 0, // 0 我服务的 1 我发布的
			isSender: false,
			reloadDataList: {
				type: Function,
				default: () => {}
			},
			isShowDistance: true
		},
		data() {
			// orderStatus 订单状态: 10=已发布/待确认；20=已确认/待付款；30=已付款/服务中；35=已申请/待验收；40=待结算；50=已完成/待评价；51=已完成/已评价；-1=已取消
			return {
				modalShow: false,
				showPopup: false,
				titleList: [{
						label: '待抢单',
						status: 10
					},
					{
						label: '待确认',
						status: 15,
					},
					{
						label: '待付款',
						status: 20
					}, {
						label: '服务中',
						status: 30
					}, {
						label: '待验收',
						status: 35
					}, {
						label: '待结算',
						status: 40
					},
					{
						label: '待评价',
						status: 50
					},
					{
						label: '已评价',
						status: 51
					},
					{
						label: '订单已取消',
						status: -1
					}
				],
				buttonList: [{
						lable: '拒绝接单',
						active: false,
						status: [10]
					},
					{
						lable: '立即接单',
						active: true,
						status: [10]
					},
					{
						lable: '联系客户',
						active: false,
						tagName: '市场',
						status: [30, 40]
					},
					{
						lable: '提交验收',
						active: true,
						tagName: '市场',
						status: [30]
					},
					{
						lable: '开始服务',
						active: true,
						tagName: '市场',
						status: [30]
					},
					{
						lable: '联系客服',
						active: true,
						tagName: '市场',
						status: [40, 35, 50]
					},
				]
			}
		},
		computed: {
			setOrderStatus() {
				let resultName = ''
				if (this.orderData.orderStatus == 15) {
					if (this.orderData.communicateStatus !== 1) {
						if (this.orderData.bidStatus == 0) {
							resultName = '待沟通'
						}
						// 如果是一口价、并且是抢单模式，用户已经抢单
						if (this.orderData.priceWay == 1 && this.orderData.assignType == 2 && this.orderData.bidStatus ==
							2) {
							resultName = '待确认'
						}
					} else {
						// 一口价模式的都是简单交付，跟工种是否配置sop模板 无关
						if (this.orderData.priceWay == 1) {
							if (this.orderData.assignType == 2 && this.orderData.bidStatus == 2) {
								resultName = '已沟通-待确认'
							}
						} else {
							if ([1, 2].includes(this.orderData.assignType) && this.orderData.bidStatus == 2) {
								resultName = '已报价-待确认'
							} else {
								resultName = this.orderData.deliveryType == 1 ? '已沟通-待确认' : '已沟通-待报价'
							}
						}
						if (this.orderData.bidStatus == 8) {
							resultName = '不确认报价'
						}
					}
				} else {
					resultName = this.titleList.find(item => item.status == this.orderData.orderStatus).label
					if (this.orderData.assignType == 1) {
						if (this.orderData.orderStatus == 10) {
							resultName = '待接单'
						}
					}
					if ([4, 6].includes(Number(this.orderData.bidStatus))) {
						resultName = '已取消'
					}
				}

				return resultName

				if ([0, 2].includes(this.orderData.bidStatus)) {
					if ([0].includes(this.orderData.bidStatus)) {
						if (this.orderData.communicateStatus) {
							return '已沟通-待确认'
						}
						return '待沟通'
					}
					if (this.orderData.priceWay == 1) {
						if (this.orderData.communicateStatus) {
							return '已沟通-待确认'
						}
						return '待沟通'
					}
					return '已沟通-待确认'
				}

				if ([4, 6].includes(Number(this.orderData.bidStatus))) {
					return '已取消'
				}
				let tempTitle = this.titleList.filter(item => item.status == this.orderData.orderStatus)

				if (tempTitle) {
					if (this.orderData.assignType == 1) {
						if (this.orderData.orderStatus == 10) {
							return '待接单'
						}
					}
					if (this.orderData.priceWay == 3) {
						tempTitle = tempTitle.filter(item => item.priceWayNama !== '一口价')
					} else {
						tempTitle = tempTitle.filter(item => item.priceWayNama !== '议价')
					}
					// 如果是商城单，则通过omsOrderItemId 判断，大于等于40则该单子已完成
					if (this.orderData.omsOrderItemId && this.orderData.orderStatus >= 40) {
						return ''
					} else {
						return tempTitle.length > 0 && tempTitle[0].label
					}
				}
			},
			setButtonList() {
				// 指派过来的，才显示 拒绝、接受
				// source 1 个人 2服务者 3企业 4平台
				// assignType 1 指派  2抢单
				//bidStatus:  接单方、发单方操作状态 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受 4=发单方拒绝 5=发单方取消报价 6=接单放取消订单 7=关闭竞价订单
				if ([4, 6].includes(Number(this.orderData.bidStatus))) {
					return []
				}
				let tempList = []
				if (this.orderData.projectId != -1) { // 公司sop单
					if (this.orderData.assignType == 1) {
						if (this.orderData.orderStatus == 10) {
							tempList = this.buttonList.filter(item => item.tagName !== '市场')
						}
					}
				} else { //市场单 
					if (this.orderData.bidStatus != 2) { // 
						tempList = this.buttonList.filter(item => item.status.includes(Number(this.orderData.orderStatus)))
						if (this.orderData.assignType != 1) {
							tempList = tempList.filter(item => !['拒绝接单', '立即接单'].includes(item.lable))
						}
						// 填写服务日志(显示 开始服务、提交验收按钮 )
						if (this.orderData.workStatus) {
							// workStatus 	是否开工 0未开工，1开工
							tempList = tempList.filter(item => item.lable !== '开始服务')
						} else {
							tempList = tempList.filter(item => item.lable !== '提交验收')
						}
					}
				}
				return tempList

			},
			setPrice() {
				switch (this.orderData.priceWay) {
					case 1:
						return this.orderData.price || ''
					case 2:
						return this.orderData.price || ''
					case 3:
						return this.orderData.offerPrice || ''
				}
			},
			setRequirementTitle() {
				// let temp = this.orderData.requirementDesc
				let temp = this.orderData.requirementName
				if (temp) {
					if (temp.length > 24) {
						temp = temp.substring(0, 24) + '...'
					}
				} else {
					// 25195 默认模板：{POIName}需要{需求类型}{岗位}
					temp = this.orderData &&
						`${this.orderData.poiName != null ? this.orderData.poiName:''}需要${this.orderData.requirementTypeName || ''}${this.orderData.skillName || ''}`
				}
				return temp
			},
			getRequirementType() {
				switch (this.orderData.requirementType) {
					case 1:
						return '装修'
					case 2:
						return '维修'
					case 3:
						return '安装'
					case 4:
						return '设计'
					case 5:
						return '其他'
					default:
						return '其他'
				}
			},
			getOrderStatus() {
				switch (this.orderData.orderStatus) {
					case 10:
						return '待报价'
					case 15:
						return '已报价-待确认'
					case 20:
						return '待付款'
					case 30:
						return '服务中'
					case 35:
						return '待验收'
					case 40:
						return '待结算'
					case 50:
						return '待评价'
					case 51:
						return '已评价'
					case -1:
						return '已取消'
					default:
						return '其他'
				}
			},
			setContactName() {
				if (this.orderData.lastLog) {
					if ([3, 4].includes(this.orderData.source) && this.orderData.lastLog.source == 1) {
						return this.orderData.companyName
					}
				}
				if (this.orderData.contactGender) {
					return this.orderData.contactName.substring(0, 1) + '先生'
				} else {
					return this.orderData.contactName.substring(0, 1) + '女士'
				}
			},
			setUrl() {
				return getImgByJobCode(this.orderData.jobCode)
			},
			setPublishType() {
				if (this.orderData.assignType == 1) {
					return '指派'
				} else {
					return '抢单'
				}
			},
			getNodeStatus() {
				if (this.orderData.project && this.orderData.project.statisticsDTO && this.orderData.project.statisticsDTO
					.firstNode) {
					let tempStatus = Number(this.orderData.project.statisticsDTO.firstNode.status)
					let checkStatus = Number(this.orderData.project.statisticsDTO.firstNode.checkStatus)
					let tempFirstNode = this.orderData.project.statisticsDTO.firstNode

					let tempResult = {
						text: '',
						class: ''
					}
					if (this.orderData.project.statisticsDTO.firstNode.businessType == 1005) {
						switch (checkStatus) {
							case 0:
								tempResult = this.setTempResult(tempFirstNode)
								break
							case 1:
								tempResult = {
									text: '可验收',
									class: 'task-check'
								}
								break
							case 2:
								tempResult = {
									text: '已验收,待整改',
									class: 'task-check'
								}
								break
							case 3:
								tempResult = {
									text: '已完成',
									class: 'task-status3'
								}
								break
							default:
								tempResult = this.setTempResult(tempFirstNode)
								break
						}
					} else {
						tempResult = this.setTempResult(tempFirstNode)
					}
					return tempResult
				} else {
					return {
						text: '',
						class: ''
					}
				}
			}
		},
		mounted() {
			this.getStatusName()
		},
		methods: {
			getStatusName() {
				return
				let resultName = ''
				if (this.orderData.orderStatus == 15) {
					if (this.orderData.communicateStatus !== 1) {
						if (this.orderData.bidStatus == 0) {
							resultName = '待沟通'
						}
					} else {
						if (this.orderData.bidStatus == 0) {
							resultName = this.orderData.deliveryType == 1 ? '已沟通-待确认' : '已沟通-待报价'
						} else if (this.orderData.bidStatus == 2) {
							resultName = '已报价-待确认'
						} else if (this.orderData.bidStatus == 8) { // 发单方不确认报价
							resultName = '已报价-客户不确认报价'
						}
					}
				} else {
					resultName = this.titleList.find(item => item.status == this.orderData.orderStatus).label
					if (this.orderData.assignType == 1) {
						if (this.orderData.orderStatus == 10) {
							resultName = '待接单'
						}
					}
				}
			},
			getLogDetails(item) {
				this.$emit('getLog', {
					orderId: item.id
				})
			},
			setPortrait(item) {
				if (item.lastLog) {
					if ([3, 4].includes(item.source) && item.lastLog.source == 1) {
						return item.lastLog.companyLogo
					} else {
						return `avatar/${item.userId}.png`
					}
				} else {
					return `avatar/${item.userId}.png`
				}
			},
			cancelReason() {
				this.reloadDataList()
			},
			getButton(label, item) {
				this.$store.commit("setOrderInfo", item)
				this.$emit('getButton', {
					typeName: label,
					orderData: item
				})
			},
			setRole() {
				switch (this.orderData.jobCode) {
					case 'JOB_MANAGER':
						return '服务'
					case 'JOB_SUPERVISION':
						return '服务'
					case 'JOB_DESIGNER':
						return '服务'
					case 'JOB_WORKER':
						return '施工'
				}
			},
			getButtonOperation(operation) {
				// 0=发布订单，5=等待报价，10=待确认接单，15=待付款，20=已付款，
				// 25=待开工，30=开工中，35=待验收，40=待结算，45=待评价(结算完成)，
				// 50=已完成，55=待售后，60=售后中，65=取消
				switch (operation) {
					case '取消订单':
						this.$refs.orderCancelReason.open()
						break
					default:
						console.log(this.orderData.orderStatus, operation)
				}
			},
			getAttachments(attachments) {
				var attachmentsList = attachments ? JSON.parse(attachments) : []
				var imgLength = 0
				var imgFile = []
				attachmentsList.forEach((item, index) => {
					if (!item) {
						return
					}
					if (item.type === 'img') {
						imgLength++
						imgFile.push(
							this.$image.imageGlobal +
							item.fileList.replace('/admin/sys-file/mihuo-test/', '')
						)
					}
				})
				return imgFile[0]
			},
			imagePreview(url) {
				return
				uni.previewImage({
					current: 0, //预览图片的下标
					urls: [url]
				})
			},
			goOrderReceiving(id) {
				this.toPage(`/pages/orderReceiving/releaseOrderDetails?id=${this.orderData.id}`)
			},
			getStatus(item) {
				if (item.status == 3 || (item.status == 1 && item.taskType == '1002')) {
					return true
				} else {
					return false
				}
			},
			goToAssignmentDetail() {
				// if (this.orderData.projectId != -1) {
				// 	if (this.setButtonList.length > 0) {
				// 		this.$util.toast(`确认是否接受或拒绝该单据`);
				// 		return
				// 	}
				// }
				// 报价阶段
				this.debounce(() => {
					uni.setStorageSync('resutlDistance',this.orderData.resultDistance)
					if (this.orderData.project) {
						if ([10, 15].includes(Number(this.orderData.orderStatus))) {
							this.toPage(
								`/pages/orderReceiving/releaseOrderDetails?id=${this.orderData.id}&orderType=订单列表&companyType=公司订单`
							)
							return
						}
						this.$storeSetProjectInfo(this.orderData.project)
						this.$storeOrderInfo(this.orderData)
						// 报价人员id
						this.$store.commit('setUserPersonId', this.orderData.offerPersonId)
						this.$store.commit('setIsAddCustomSpace', '')

						// 服务中
						switch (this.orderData.jobCode) {
							case 'JOB_MANAGER':
								this.$store.commit('setUserRole', 'R_PROJECT_MANAGER')
								break
							case 'JOB_SUPERVISION':
								this.$store.commit('setUserRole', 'R_PROJECT_SUPERVISION')
								break
							case 'JOB_DESIGNER':
								this.$store.commit('setUserRole', 'R_DESGINER')
								break
							case 'JOB_WORKER':
								this.$store.commit('setUserRole', 'R_WORKER')
								break
							default:
								//不是这几个的默认为设计师
								this.$store.commit('setUserRole', 'R_DESGINER')
						}
						this.toPage(`/pages/construction/assignmentDetail/assignmentDetail`)
					} else {
						this.toPage(
							`/pages/orderReceiving/releaseOrderDetails?id=${this.orderData.id}&orderType=订单列表`
						)
					}
				}, 200)
			},
			setSkillNameLength(item) {
				if (item) {
					switch (item.length) {
						case 2:
							return 'item-work-type'
						case 3:
							return 'item-work-type-medium'
						case 4:
							return 'item-work-type-big'
					}
				}
			},
			setTempResult(item) {
				let tempResult = {
					text: '',
					class: ''
				}
				switch (item.status) {
					case 1:
						tempResult = {
							text: '等待中',
							class: 'task-waiting'
						}
						break;
					case 2:
						tempResult = {
							text: '已开始',
							class: 'task-status2'
						}
						break;
					case 3:
						tempResult = {
							text: '已完成',
							class: 'task-status3'
						}
						break;

					case 5:
						if (item.reviewFlag) {
							tempResult = {
								text: '待审核',
								class: 'task-status2'
							}
						}
						break;
					case 6:
						tempResult = {
							text: '审核失败',
							class: 'task-status2'
						}
						break;
					case 10:
						tempResult = {
							text: '等待中',
							class: 'task-waiting'
						}
						break
					default:
						tempResult = {
							text: '未开始',
							class: 'task-waiting'
						}
						break;
				}
				return tempResult
			},
			setLog() {
				if (!this.orderData.lastLog) {
					return
				}
				let tempContent, tempName, tempResult;
				if (this.$isJSON(this.orderData.lastLog.content)) {
					tempContent = JSON.parse(this.orderData.lastLog.content)
				} else {
					tempContent = this.orderData.lastLog
					tempContent['createDate'] = this.orderData.lastLog.created
				}

				tempName = this.$getLogTypeName(this.orderData.lastLog.type)
				tempResult = tempContent.createDate + ' ' + tempName
				return tempResult
			}
		},

	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.right-icon {
		width: 48rpx;
		height: 48rpx;
	}

	.order-task {
		padding: 16rpx 20rpx 20rpx 30rpx;
		background: #f9f9f9;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;

		.go-start {
			width: 130rpx;
			height: 50rpx;
			background: $themeColor;
			border-radius: 130rpx;
			font-weight: bold;
			font-size: 24rpx;
			line-height: 50rpx;
			text-align: center;
			color: #ffffff;
		}

		.order-task-top {
			font-weight: bold;
			font-size: 26rpx;
			line-height: 36rpx;
			color: #303133;
		}

		.order-task-bottom {
			display: flex;
			margin-top: 18rpx;
			align-items: center;
			max-width: 560rpx;
			overflow: hidden;
		}

		.order-task-title {
			opacity: 0.6;
			display: flex;
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			text {
				font-weight: normal;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #000000;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

		}

		.order-task-right {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.order-task-date {
			font-weight: normal;
			font-size: 20rpx;
			border-radius: 4rpx;
			line-height: 34rpx;
			text-align: center;
			color: $themeColor;
			background: #d8eaff;
			margin-left: 10rpx;
			padding-left: 10rpx;
			padding-right: 10rpx;
		}
	}

	.order-finish-ststus {
		justify-content: space-around;
		flex-wrap: wrap;
		align-items: center;
		display: flex;
		margin-top: 20rpx;

		.table_box {
			flex-wrap: nowrap;
			font-weight: normal;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 44rpx;
			text-align: center;
			color: #fe4444;
		}

		.table_box2 {
			flex-wrap: nowrap;
			font-weight: normal;
			font-weight: normal;
			font-size: 24rpx;
			line-height: 44rpx;
			text-align: center;
			color: #606166;
		}
	}



	.order-operation-log {
		background: #F9F9F9;
		border-radius: 4rpx;
		padding: 22rpx;
		margin-top: 10rpx;
		display: flex;

		.item-log {
			// max-width: 560rpx;
			// overflow: hidden;
			// text-overflow: ellipsis;
			// white-space: nowrap;
			font-size: $fontSize26;
			color: $seconFontColor;
			margin-left: 16rpx;

			.log-name {
				font-size: $fontSize26;
				color: $seconFontColor;
				margin-right: 16rpx;
			}
		}
	}


	.order-bottom-button {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: 28rpx;

		.item-button {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 176rpx;
			height: 64rpx;
			color: #909199;
			white-space: nowrap;
			font-size: 26rpx;
			border-radius: 10rpx;
			border: 2rpx solid #ebebeb;
			margin-right: 28rpx;

			&:last-child {
				margin-right: 0rpx;
			}
		}

		.item-button-active {
			font-size: 28rpx;
			background-color: $themeColor;
			color: #ffffff;
		}
	}

	.order-title-contain {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #F6F6F6;
		margin-bottom: 20rpx;

		.corporate-name {
			margin-left: 8rpx;
			font-size: 28rpx;
			color: #303133;
		}

		.item-left {
			display: flex;
			align-items: center;
		}

		.item-right {
			font-size: 28rpx;
			color: #002FA5;
		}


	}

	.other-bottom-contain {
		display: flex;
		flex-direction: row;

		.other-left {
			position: relative;

			.order-image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 10rpx;
			}

			.other-node {
				position: absolute;
				padding: 3rpx 13rpx;
				background-color: rgba(0, 47, 165, 0.2);
				border-radius: 10rpx 0rpx 20rpx;
				// font-weight: bold;
				text-align: center;
				z-index: 10;

				.other-node-text {
					transform: scale(0.85);
					font-size: 24rpx;
					color: $themeColor;
				}
			}
		}
	}

	.order-item-title {
		border-bottom: 4rpx dashed #eeeeee;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		display: flex;

		justify-content: space-between;

		.order-item-contain {
			display: flex;
			align-items: center;
		}

		.order-status {
			font-size: 28rpx;
			color: $themeColor;
		}

		.order-no {
			font-size: 28rpx;
			color: #7c7676;
			margin-left: 30rpx;
		}

		.order-no-text {
			font-size: 28rpx;
			color: #999999;
		}
	}

	.order-hint {
		margin-left: 12rpx;
		width: calc(100% - 190rpx);

		.order-offer-person {
			margin-top: 12rpx;
			display: flex;
			align-items: center;

			.order-person-number {
				font-size: 28rpx;
				line-height: 40rpx;
				color: #999999;
				margin-left: 20rpx;
			}

			.person-image {
				width: 34rpx;
				height: 34rpx;
				border-radius: 34rpx;
				margin-right: -10rpx;
			}
		}

		.order-bottom-date {
			margin-top: 10rpx;

			.order-date {
				font-weight: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909199;
				margin-top: 20rpx;
			}

			.order-date2 {
				font-weight: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909199;
			}

			.order-skill-type {
				font-weight: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909199;
			}
		}

		.order-address-release {
			margin-top: 8rpx !important;
		}

		.order-address {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.item-address {
				display: flex;
				align-items: center;
				white-space: nowrap;
			}

			.order-address-position {
				font-weight: normal;
				font-size: 24rpx;
				line-height: 36rpx;
				color: #999999;
			}

			.order-address-text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #606166;
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.order-address-image {
				width: 24rpx;
				height: 28rpx;
				margin-right: 10rpx;
			}
		}



		.order-name-top {
			display: flex;
			align-items: center;

			.skill-type {
				font-weight: bold;
				font-size: 20rpx;
				color: #ffffff;
			}

			.order-name {
				display: flex;
				align-items: center;
				flex-direction: row;

				.requirement-desc-contain {
					font-size: 30rpx;
					color: #303133;
					font-weight: bold;
					max-width: 440rpx;
					@include toe();
				}
			}

			.item-publish-type {
				display: flex;
				align-items: center;
				white-space: nowrap;
				font-size: 20rpx;
				border-radius: 4rpx;
				transform: scale(0.85);
				transform-origin: center;
				text-align: center;
				margin-right: 8rpx;
				padding: 2rpx 4rpx;
				font-weight: bold // line-height: 1.6;
					// width: 48rpx;
					// height: 32rpx;
			}

			.item-publish-type-active {
				color: #002FA5;
				position: relative;
				background-color: rgba(0, 47, 165, 0.1);

				&::before {
					content: '';
					position: absolute;
					width: 0;
					height: 0;
					right: -22rpx;
					top: 8rpx;
					border-top: 8rpx solid transparent;
					border-right: 12rpx solid transparent;
					border-bottom: 8rpx solid transparent;
					border-left: 12rpx solid rgba(0, 47, 165, 0.1);
				}
			}

			.item-publish-type-default {
				color: #FF5D35;

				background-color: rgba(255, 93, 53, 0.1);

				&::before {
					content: '';
					position: absolute;
					width: 0;
					height: 0;
					right: -22rpx;
					top: 8rpx;
					border-top: 8rpx solid transparent;
					border-right: 12rpx solid transparent;
					border-bottom: 8rpx solid transparent;
					border-left: 12rpx solid rgba(255, 93, 53, 0.1);
				}
			}


		}

		.release-name-top {
			display: flex;
			justify-content: space-between;

			.item-left {}

			.release-order-name {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 40rpx;
				color: #303133;
				// @include toe();
			}

			.release-order-offer {
				font-style: normal;
				font-weight: 900;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #ff5d35;
				white-space: nowrap;
			}
		}
	}

	.orde-item {
		margin: 20rpx;
		background: #ffffff;
		border-radius: 12rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.beyond-the {
		margin-left: 20rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 500;
		font-size: 26rpx;
		line-height: 36rpx;
		color: $errorColor;
	}

	.default-time {
		margin-left: 20rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 500;
		font-size: 26rpx;
		line-height: 36rpx;
		color: $themeColor;
	}


	.default-task {
		line-height: 40rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
		border-radius: 40rpx;
		font-size: 20rpx;
		margin-left: 16rpx;
		white-space: nowrap;
	}

	.task-status {
		color: #909199;
		background: #efefef;
	}

	.task-status2 {
		background: rgba(250, 208, 160, 0.3);
		color: #ff5d35;
	}

	.task-waiting {
		background: rgba(218, 218, 218, 0.3);
		color: #909199;
	}


	.task-status3 {
		background: #d5ffee;
		color: #10c57d;
	}

	.task-check {
		background: rgba(0, 47, 165, 0.1);
		color: #002FA5;
	}

	.item-work-type {
		width: 54rpx;
		background-image: url('../../static/icon/skill-name-1.png');
	}

	.item-work-type-medium {
		width: 76rpx;
		background-image: url('../../static/icon/skill-name-2.png');
	}

	.item-work-type-big {
		width: 100rpx;
		background-image: url('../../static/icon/skill-name-3.png');
	}

	.item-work-type-default {
		background-size: cover;
		background-repeat: round;
		height: 32rpx;
		text-align: center;
		line-height: 32rpx;
		margin-right: 4rpx;
		display: inline-flex;

		.type-text {
			white-space: nowrap;
			color: $themeColor;
			font-size: 24rpx;
			display: inline-block;
			transform: scale(0.8);
			// transform-origin: center;
			position: relative;
		}
	}
</style>
