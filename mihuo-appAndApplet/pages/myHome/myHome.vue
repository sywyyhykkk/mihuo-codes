<template>
	<view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="topHeight" :topbar="true" :down="downOption"
			:up="upOption" @down="downCallback" @up="upCallback" @scroll="onScroll">
			<view class="sticky-content" :style="{ top: isShowStickyContent ? '0' : '-999rpx' }">
				<view class="nav-bar title">
					{{ myHomeInfo && myHomeInfo.id ? myHomeInfo.poiName + (myHomeInfo.detailAddress || '') : '开启我的家' }}
				</view>
			</view>
			<view class="main-page">
				<view class="header-bg">
					<view class="title flex-center" id="sticky-query">
						<view class="left flex-center" @click="changeMyHome">
							<view class="title-text flex-center">
								{{ myHomeInfo && myHomeInfo.id ? myHomeInfo.poiName + (myHomeInfo.detailAddress || '') : '开启我的家' }}
							</view>
							<view class="arrow flex-center" v-if="myHomeList.length != 0">
								<view class="arrow-icon"></view>
							</view>
						</view>
						<mihuo-image @click="addMyHome" src="https://www.51mihuo.com/static/icon/my-home/add-home.png"
							class="icon"></mihuo-image>
					</view>
					<view class="sub-title" v-if="!isMyHome"> 装修第一步 </view>
					<view class="sub-title" v-else>
						{{ myHomeInfo.area || '' }}&#x33A1; · {{ myHomeInfo.model || '' }} ·
						{{ myHomeInfo.isElevator == 0 ? '无电梯' : '有电梯' }}
						{{ myHomeInfo.floor ? myHomeInfo.floor + '楼' : '' }}
					</view>
				</view>
				<!-- 当前我的家没有项目 -->
				<view class="work-type" v-if="!isMyHome">
					<view class="type-item flex-center" v-for="(item, index) in getWorkTypeList" :key="index"
						@click="viewDetail(item)">
						<mihuo-image :src="getImg(item.skillName)" class="icon"></mihuo-image>
						<view class="text-container">
							<view class="title flex-center">
								{{ item.skillName }}
								<view class="arrow"></view>
							</view>
							<view class="des"> {{ item.remarks }} </view>
						</view>
					</view>
					<view v-if="workTypeList.length" class="type-item flex-center"
						@click="viewDetail(workTypeList[3], true)">
						<mihuo-image :src="getImg()" class="icon"></mihuo-image>
						<view class="text-container">
							<view class="title flex-center">
								施工工人 <view class="arrow"></view>
							</view>
							<view class="des"> {{ getWorkerLabel() }} </view>
						</view>
					</view>
				</view>
				<!-- 当前我的家有项目 -->
				<view class="my-home" v-else>
					<!-- 待办项目 -->
					<view class="my-todo">
						<view class="todo-title flex-center">
							<view class="title-text"> 需要您确认 </view>
							<mihuo-image class="more-icon" src="https://www.51mihuo.com/static/icon/home_v3/more.png"
								@click="goToMore('更多待办')"></mihuo-image>
						</view>
						<view class="todo-items">
							<view v-for="(item, index) in myHomeTodo" :key="index">
								<view class="todo-item flex-center" v-if="item.businessCode.indexOf('disclose_') == -1">
									<view class="todo-item_flex">
										<view class="dot"></view>
										<!-- 无 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1000'">
											{{ item.skillName || '' }}已提交{{
											item.businessParams.nodeName || ''
											}}，请及时确认
										</view>
										<!-- 选材 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1001'">
											选材清单已提交，请及时确认
										</view>
										<!-- 派单 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1002'">
											{{ item.businessParams.offerSkillName || '' }} [{{
											item.businessParams.offerPersonName
											}}]已接单，请及时确认
										</view>
										<!-- 预算 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1003'">
											预算清单已提交，请及时确认
										</view>
										<!-- 施工 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1004'">
											{{ item.businessParams.nodeName || '' }}已完成，请及时确认
										</view>
										<!-- 验收 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1005'">
											{{ item.skillName || '' }}已完成{{
											item.businessParams.nodeName || ''
											}}验收，请及时确认
										</view>
										<!-- 上传 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1006'">
											{{ item.skillName || '' }}已完成{{
											item.businessParams.nodeName || ''
											}}资料，请及时确认
										</view>
										<!-- 评价 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1009'">
											{{ item.skillName || '' }}已完成评价，请及时确认
										</view>
										<!-- 交底 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1010'">
											{{ item.skillName || '' }}已提交{{
											item.businessParams.nodeName || ''
											}}，请及时确认
										</view>
										<!-- 量房 -->
										<view class="todo-info" v-if="item.businessParams.nodeType == '1011'">
											{{ item.skillName || '' }}已提交{{
											item.businessParams.nodeName || ''
											}}信息，请及时确认
										</view>
										<!-- 收款 -->
										<view class="todo-info"
											v-if="['1012','1013','1014','1015'].includes(item.businessParams.nodeType)">
											{{ item.comment || '' }}
										</view>
										<view v-if="!item.businessParams.nodeType">
											<view v-if="item.businessParams.omsOrderId" class="todo-info">
												{{ item.comment || '所需材料已申请，为避免工期延迟，请及时确认并付款'}}
											</view>
											<view v-else class="todo-info">{{ item.comment || '' }}</view>
										</view>
									</view>
									<view v-if="item.status == 2" class="todo-button todo-button_end">已处理</view>
									<view v-else class="todo-button" @click="handleTodo(item)">
										去处理
									</view>
								</view>
							</view>
						</view>
						<view class="add-todo flex-center">
							<mihuo-image src="https://www.51mihuo.com/static/icon/my-home/add-todo.png" class="add-icon"
								@click="addTodo"></mihuo-image>
						</view>
					</view>
					<!-- <view class="home-header flex-center">
						<view class="title"> 当前服务 </view>
						<view class="right flex-center" @click="changeCurrentService">
							切换 <view class="arrow"></view>
						</view>
					</view> -->

					<!-- 按钮区域 -->
					<view class="button-container flex-center">
						<view class="button-item flex-center" @click="buttonClick('方案图纸')">
							<mihuo-image class="button-icon"
								src="https://www.51mihuo.com/static/icon/my-home/button1.png" borderRadius="20"
								:upperRadius="true" :bottomRadius="true">
							</mihuo-image>
							<view class="button-text"> 方案图纸 </view>
						</view>
						<view class="button-item flex-center" @click="buttonClick('装修花费')">
							<mihuo-image class="button-icon"
								src="https://www.51mihuo.com/static/icon/my-home/button3.png" borderRadius="20"
								:upperRadius="true" :bottomRadius="true">
							</mihuo-image>
							<view class="button-text"> 装修花费 </view>
						</view>
						<view class="button-item flex-center" @click="buttonClick('装修用料')">
							<mihuo-image class="button-icon"
								src="https://www.51mihuo.com/static/icon/my-home/button4.png" borderRadius="20"
								:upperRadius="true" :bottomRadius="true">
							</mihuo-image>
							<view class="button-text"> 装修用料 </view>
						</view>
						<view class="button-item flex-center" @click="buttonClick('报告')">
							<mihuo-image class="button-icon"
								src="https://www.51mihuo.com/static/icon/my-home/button2.png" borderRadius="20"
								:upperRadius="true" :bottomRadius="true">
							</mihuo-image>
							<view class="button-text"> 报告 </view>
						</view>
					</view>

					<!-- 项目切换 -->
					<view class="project-tabs">
						<scroll-view class="project-contain flex-center" :scroll-x="true" :enable-flex="true">
							<view class="tabs-item flex-center">
								<view v-for="(item, index) in myAllServices" :key="index" class="tabs-item_label"
									:class="{'tabs-active':currentTab === index}"
									@click="confirmSelectService(item,index)">
									{{ item.projectName|| '' }} · {{item.contactName || ''}}
								</view>
							</view>
						</scroll-view>
					</view>
					<!-- 当前服务人员 -->
					<view class="service-info flex-center">
						<u-avatar size="96" :src="$util.avatarImage(currentService.contactUserId)"></u-avatar>
						<view class="info-content">
							<view class="upper">
								{{ currentService.projectName || '' }}
							</view>
							<view class="lower">
								{{ currentService.contactName || '' }}
							</view>
						</view>
						<view class="info-button flex-center">
							<mihuo-image class="icon" src="https://www.51mihuo.com/static/icon/work_type/phone.png"
								style="margin-right: 30rpx" v-if="currentService.contactPhone"
								@click="contactManager('phone')">
							</mihuo-image>
							<mihuo-image class="icon" src="https://www.51mihuo.com/static/images/order_details/chat.png"
								@click="contactManager('im')"></mihuo-image>
						</view>
					</view>
					<!-- 装修图纸 -->
					<view v-if="currentService.jobCode == 'JOB_DESIGNER'">
						<view class="drawing" v-if="sopuploadList && sopuploadList.length">
							<view v-for="(item,index) in sopuploadList" :key="index">
								<view v-for="(v,i) in item.sopUploadList" :key="i">
									<view class="drawing-title">{{ v.groupName }}</view>
									<view class="" v-if="v.uploadItemList && v.uploadItemList.length">
										<image-show :num="999" width="210" height="210"
											:imgSrc="JSON.stringify(v.uploadItemList)" />
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 服务日历 服务团队 -->
					<view class="service-container">
						<view class="service-tabs flex-center">
							<view class="left flex-center">
								<view class="tab-item flex-center" @click="changeServiceTab(0)"
									:class="{ 'tab-active': currentServiceTab == 0 }">
									服务日志
									<view class="tab-icon" :style="{ opacity: currentServiceTab == 0 ? '1' : '0' }">
									</view>
								</view>
								<view class="tab-item flex-center" @click="changeServiceTab(1)"
									v-if="currentService.jobCode != 'JOB_DESIGNER'"
									:class="{ 'tab-active': currentServiceTab == 1 }">
									服务团队
									<view class="tab-icon" :style="{ opacity: currentServiceTab == 1 ? '1' : '0' }">
									</view>
								</view>
								<view class="tab-item flex-center" @click="changeServiceTab(2)"
									:class="{ 'tab-active': currentServiceTab == 2 }">
									服务计划
									<view class="tab-icon" :style="{ opacity: currentServiceTab == 2 ? '1' : '0' }">
									</view>
								</view>
							</view>
						</view>
						<view class="service-swiper">
							<!-- 服务日历 -->
							<view class="swiper-item" v-if="currentServiceTab == 0">
								<view class="service-calendar">
									<view v-if="currentService.jobCode != 'JOB_DESIGNER'">
										<view class="step-nodes flex-center">
											<view class="node-item flex-center" v-for="(item, index) in projectPlan"
												:key="index">
												<mihuo-image class="node-icon"
													v-if="item.totalCount == item.completeCount"
													src="https://www.51mihuo.com/static/icon/my-home/node-fin.png">
												</mihuo-image>
												<mihuo-image v-else class="node-icon"
													src="https://www.51mihuo.com/static/icon/my-home/node-un.png">
												</mihuo-image>
												<view class="node-text"> {{ item.groupName }} </view>
												<view v-if="index < projectPlan.length - 1" class="node-line"
													:style="[getNodeItemStyle(index)]">
												</view>
											</view>
										</view>
										<view class="service-duration">
											已施工{{ serviceDuration.fromToday || 0 }}天 ·
											{{
											serviceDuration.stillLeft < 0
												? `已延期${Math.abs(serviceDuration.stillLeft) || 0}天`
												: `距离竣工${serviceDuration.stillLeft || 0}天`
											}}
										</view>
										<view class="calendar-container" v-if="currentWeek.length != 0">
											<view class="year-month flex-center">
												<uni-icons type="left" @click="preWeek"></uni-icons>
												{{ currentYear }}年{{ currentMonth }}月
												<uni-icons type="right" @click="nextWeek"></uni-icons>
											</view>
											<view class="week-container">
												<view class="week-days flex-center">
													<view class="weekday flex-center">
														<view class="date"> 一 </view>
													</view>
													<view class="weekday flex-center">
														<view class="date"> 二 </view>
													</view>
													<view class="weekday flex-center">
														<view class="date"> 三 </view>
													</view>
													<view class="weekday flex-center">
														<view class="date"> 四 </view>
													</view>
													<view class="weekday flex-center">
														<view class="date"> 五 </view>
													</view>
													<view class="weekday flex-center">
														<view class="date"> 六 </view>
													</view>
													<view class="weekday flex-center">
														<view class="date"> 日 </view>
													</view>
												</view>
												<view class="week-days flex-center">
													<view class="weekday flex-center"
														v-for="(item, index) in currentWeek" :key="index"
														@click="selectDay(item)">
														<view class="date" :class="{
														'day-active': selectedDay == item.fullDate
														}">
															{{ item.date }}
														</view>
														<view class="event-dot" v-if="item.hadEvent"></view>
														<!-- <view class="plan-dot" v-if="item.hasPlan"></view> -->
													</view>
												</view>
											</view>
										</view>
									</view>
									<!-- 服务日志 -->
									<view v-if="buildLogList && buildLogList.length" class="log">
										<view v-for="(item,index) in buildLogList" :key="index" class="log-list">
											<view class="log-list_left">
												<view class="left-time">{{ getNoticeDate(item.created) }}</view>
												<text class="left-tips">日志</text>
											</view>
											<view class="log-list_right">
												<view v-if="item.person" class="list-right_item">
													<view class="flex-center">
														<u-avatar :src="$util.avatarImage(item.person.userId)"
															size="30"></u-avatar>
														<view class="name"> {{ item.person.name }} </view>
														<view class="skill-name"> {{ item.person.skillName }} </view>
													</view>
													<view class="flex-center right-item_right"
														v-if="reportType.indexOf(item.source) != -1"
														@click="gotoDetail(item)">
														<text>查看</text>
														<u-icon color="#000000" size="20" name="arrow-right"></u-icon>
													</view>
												</view>
												<view v-if="item.source == 'CONSTRUCTION'">
													<view v-if="item.detailList && item.detailList.length">
														<view class="log_desc">今日施工内容</view>
														<view v-for="con,ind in item.detailList" :key="ind">
															<view class="name_sup">{{ con.name || ''}}</view>
														</view>
													</view>
													<view class="log_desc" v-else>{{ item.desc }}</view>
												</view>
												<view class="log_desc" v-else>{{ item.desc }}</view>
												<image-show class="image-show" :num="9" v-if="item.pic"
													:imgSrc="item.pic"></image-show>
											</view>
										</view>
									</view>
									<!-- 验收报告 -->
									<view class="calendar-content" v-if="acceptanceList && acceptanceList.length">
										<view class="content-title"> 验收 </view>
										<view class="acceptance-report">
											<view class="report-item" v-for="(report, index) in acceptanceList"
												:key="index">
												<view class="title-container flex-center"
													@click="goToReportDetail(report)">
													<view class="left">
														<view class="report-title">
															{{ report.name }}
														</view>
														<view class="report-time">
															{{ report.acceptanceCreateTime }}
														</view>
													</view>
													<view class="right flex-center" :style="{
														color:
															report.statusFlag == '1' ? '#187518' : '#B32A25'
														}">
														{{
														report.statusFlag == '1'
															? '验收通过'
															: '验收不通过'
														}}
														<u-icon style="margin-left: 6rpx" size="24" name="arrow-right"
															color="#000" />
													</view>
												</view>
												<view class="report-record flex-center"
													v-for="(record, index2) in report.items" :key="index2">
													<view class="record-name">
														{{ ('0' + (index2 + 1)).slice(-2) }}
														{{ record.itemName }}
													</view>
													<view :class="'record-status status_'+record.passFlag">
														{{ record.passFlag == '1' ? '通过' : '不通过' }}
													</view>
												</view>
												<view class="report-images flex-center" v-if="report.picFiles != '[]'">
													<image class="report-img"
														v-for="(img, index3) in JSON.parse(report.picFiles)"
														:key="index3" :src="$util.thumbnailImage(img.url || img)">
													</image>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<!-- 服务团队 -->
							<view class="swiper-item" v-if="currentServiceTab == 1">
								<view class="service-team">
									<view class="team-member flex-center" v-for="(item, index) in currentTeamMember"
										:key="index">
										<u-avatar size="96" :src="$util.avatarImage(item.userId)"></u-avatar>
										<view class="team-right">
											<view class="info-content">
												<view class="upper"> {{ item.skillName }} </view>
												<view class="lower"> {{ item.name }} </view>
											</view>
											<view>
												<view class="info-button flex-center">
													<mihuo-image class="icon"
														src="https://www.51mihuo.com/static/icon/work_type/phone.png"
														style="margin-right: 30rpx" @click="contactTeam('phone', item)">
													</mihuo-image>
													<mihuo-image class="icon"
														src="https://www.51mihuo.com/static/images/order_details/chat.png"
														@click="contactTeam('im', item)"></mihuo-image>
												</view>
												<view class="agreement" @click="lookagreement(item)">
													《{{ getAgreementName(item)}}》</view>
											</view>

										</view>
									</view>
								</view>
							</view>
							<view class="swiper-item" v-if="currentServiceTab == 2">
								<view class="service-plan" v-if="isShowServicePlan">
									<!-- 服务计划 -->
									<service-plan :projectId="currentService.projectId"></service-plan>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<u-popup v-model="isShowDetail" mode="bottom" :safe-area-inset-bottom="true" border-radius="20"
			:mask-close-able="false" height="80%">
			<view class="popup">
				<view class="info-close">
					<u-icon @click="closePopup" class="info-close_icon" name="close" size="32"></u-icon>
				</view>
				<view class="worker-tab" v-if="isWorker">
					<u-tabs :is-scroll="false" name="skillName" :current="currentTab" active-color="#ff5d35"
						:list="workTypeList.filter(item => item.type != 1 && item.quickCallFlag == 1)"
						@change="changeTab"></u-tabs>
				</view>
				<view class="info-main">
					<image class="image" v-if="selectedDetail.img" :src="selectedDetail.img" mode="scaleToFill" />
					<mihuo-image class="image" v-else src="https://www.51mihuo.com/static/icon/work_type/other.png" />
					<view class="info-main_content">
						<view class="info-main_content-title">
							<text>{{ selectedDetail.skillName }}</text>
							<mihuo-image class="image" :src="'https://www.51mihuo.com/static/icon/major.png'" />
						</view>
						<view class="info-main_content-text">
							{{ selectedDetail.label }}
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" class="scroll-view">
					<edit-view v-if="isShowEditView" class="edit-view" v-model="selectedDetail.description" />
					<bottom-button :title="canCall ? '立即呼叫' : '取消呼叫'" @click="goToCall"></bottom-button>
				</scroll-view>
			</view>
		</u-popup>
		<u-select v-model="isShowPicker" :defaultValue="myHomeDefaultIndex" mode="single-column" value-name="id"
			:list="myHomeList" @confirm="confirmSelectHome"></u-select>
		<!-- 抖音小程序支付要单独处理 -->
		<!-- #ifndef MP-TOUTIAO -->
		<pay-popup v-model="isShowPayPopup" @callback="payConfirm" :money="payAmount"></pay-popup>
		<!-- #endif -->
		<!-- 上门报价师傅-->
		<call-master v-model="isCallMaster" :data="selectedDetail" @isOK="onSubmitCallOrder"
			:completeAddress="completeAddress"></call-master>
		<!-- 服务协议 -->
		<mh-agreement v-model="isAgreement" v-if="isAgreement" :info="masterObj" @close="closeagreement"></mh-agreement>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	import {
		masterAvatar
	} from '@/plugins/orderStatus'
	import {
		getNoticeDate
	} from '@/static/js/chat.js'
	import {
		toDoPage
	} from '@/static/js/toDo.js'
	export default {
		data() {
			return {
				myHomeDefaultIndex: [0],
				isShowStickyContent: false, // 是否显示顶部吸顶内容
				stickyHeight: 0, // 吸顶高度
				topHeight: -188, // mescroll-uni组件顶部高度
				payNodeId: 0, // 需要支付的节点id
				payAmount: 0, // 需要支付的金额
				isShowPayPopup: false, // 是否显示支付弹窗
				isShowServicePlan: false, // 是否显示服务计划
				logList: [], // 当前服务日历的施工日志
				acceptanceList: [], // 验收报告
				startDate: '', // 查询服务日历周一
				endDate: '', // 查询服务日历周日
				currentYear: moment().year(), // 当前年份
				currentMonth: moment().month() + 1, // 当前月份
				weekNumber: 0, // 当前周在一年中是第几周
				serviceDuration: {}, // 服务持续时间
				projectPlan: [], // 服务计划
				currentTeamMember: [], // 当前服务团队成员
				myAllServices: [], // 当前我的家全部服务
				myHomeInfo: {}, // 当前我的家
				currentService: {}, // 我的家当前服务
				isShowServicePicker: false, // 是否显示切换当前服务的弹窗
				isShowPicker: false, // 是否显示切换当前我的家的弹窗
				selectedDay: moment().format('YYYY-MM-DD'), // 当前选中的日期
				currentWeek: [], // 当前星期
				currentServiceTab: 0, // 当前显示的服务信息 0=服务日历 1=服务团队 2=服务计划
				isMyHome: false, // 是否显示我的家服务页面
				myHomeList: [], // 我的家列表
				selectedDetail: {}, // 当前显示的工种
				workTypeList: [], // 平台工种列表
				isShowDetail: false, // 是否显示工种详情
				isWorker: false, // 当前显示的工种详情是否是工人
				currentTab: 0, // 显示工人详情时的当前工种index
				isShowEditView: false, // 是否显示富文本内容
				myHomeTodo: [], // 我的家待办
				downOption: {
					auto: false
				},
				upOption: {
					auto: false,
					use: false,
					onScroll: true
				},
				mescroll: null,
				isCallMaster: false, // 呼叫师傅弹窗
				ipImage: masterAvatar, // 师傅图片
				completeAddress: {},
				canCall: true, // 是否允许呼叫该工种
				node: {},
				completeAddress: {},
				buildLogList: [],
				sopuploadList: [],
				loginTime: 0,
				getNoticeDate: getNoticeDate,
				toDoPage: toDoPage,
				isAgreement: false,
				masterObj: {},
				reportType: ["DISCLOSE", "ACCEPTANCE", "UPLOAD", "CONSTRUCTION"], //交底/验收/上传,
				options: null,
				curUser: uni.getStorageSync('userData').sysUser,
			}
		},
		onHide() {
			this.isShowDetail = false
		},
		onLoad(options) {
			this.options = options;
			// #ifdef H5
			this.topHeight = 0
			// #endif
			this.getTypeWork()
		},
		mounted() {
			// 获取标签距离顶部的高度
			const query = uni.createSelectorQuery()
			query
				.select('#sticky-query')
				.boundingClientRect(data => {
					if (data) {
						this.stickyHeight = data.top
					}
				})
				.exec()
		},
		onShow() {
			const defaultIndex = uni.getStorageSync('myHomeDefaultIndex')
			this.myHomeDefaultIndex = defaultIndex ? [defaultIndex] : [0]
			if (uni.getStorageSync('userInfo')) {
				const roomAddress = uni.getStorageSync('roomAddress') || {}
				if (!roomAddress.id) {
					this.currentService = {}
					this.myHomeInfo = {}
					this.getMyAddress(true)
					this.checkIsCalling()
				} else if (roomAddress.id && !this.currentService.projectId) {
					this.getMyAddress()
					this.checkIsCalling()
				} else {
					this.getMyAddress(false)
					this.checkIsCalling()
				}
			}
			if (this.isCallMaster) {
				uni.hideTabBar({
					animation: true
				})
			}
			uni.$once('roomAddress', data => {
				if (data) {
					this.completeAddress = data
				}
			})
		},
		onTabItemTap(event) {
			const {
				index,
				pagePath
			} = event
			if (index > 1) {
				if (!uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					uni.setStorageSync('navigatePage', '/' + pagePath)
				}
			}
		},
		watch: {
			isShowDetail() {
				if (this.isShowDetail) {
					uni.hideTabBar({
						animation: true
					})
				} else {
					if (!this.isCallMaster) {
						uni.showTabBar({
							animation: true
						})
					}
				}
			},
			isShowPayPopup() {
				if (this.isShowPayPopup) {
					uni.hideTabBar({
						animation: true
					})
				} else {
					uni.showTabBar({
						animation: true
					})
				}
			}
		},
		computed: {
			getWorkTypeList() {
				return this.workTypeList.filter(item => item.type == 1 && item.quickCallFlag == 1)
			}
		},
		methods: {
			// 跳转到验收报告详情
			goToReportDetail(report) {
				this.toPage(
					`/pages-order/acceptance/acceptance-report-template?nodeId=${report.nodeId}`
				)
			},
			onScroll(e) {
				if (e.scrollTop >= this.stickyHeight) {
					this.isShowStickyContent = true
				} else {
					this.isShowStickyContent = false
				}
			},
			// 呼叫师傅以后的回调
			onSubmitCallOrder() {
				this.isCallMaster = false
				this.checkIsCalling()
				uni.$emit('updateWorkerInfo')
			},
			checkIsCalling() {
				if (!uni.getStorageSync('userInfo')) return
				this.$httpApi.getOrderSkillTypeStatus().then(res => {
					if (res) {
						const found = res.find(
							item => item.skillId == this.selectedDetail.skillId
						)
						if (found) {
							this.canCall = false
						} else {
							this.canCall = true
						}
					}
				})
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			downCallback() {
				this.getMyAddress(true)
				this.getTypeWork()
				setTimeout(() => {
					this.mescroll.endBySize(10, true)
				}, 500)
			},
			upCallback() {},
			// 确认支付
			async payConfirm(data) {
				this.isShowPayPopup = false
				uni.showTabBar({
					animation: true
				})
				// 材料支付
				if (this.node.businessCode.startsWith('payment')) {
					if (data.payType == 4) {
						// 支付宝支付
						const payRes = await this.$httpApi.payOrder({
							orderIds: [this.node.materOredrId],
							payMethod: data.payType
						})
						if (payRes.payInfo) {
							this.$util.requestPay(
								payType, {
									orderId: payRes.payInfo
								},
								'mallOrder'
							)
						}
					} else {
						this.$util.requestPay(
							payType, {
								orderId: this.node.materOredrId
							},
							'mallOrder',
							() => {
								this.getMyPendingTodo()
							}
						)
					}
				} else {
					//施工订单支付
					let param = {
						payMethod: data.payType,
						nodeId: this.payNodeId,
						clientId: 'bmini',
						payAmount: this.payAmount
					}
					if (data.payType === 3) {
						this.$util.requestPay(data.payType, param, 'nodePay', () => {
							this.isShowPayPopup = false
						})
					} else {
						uni.showLoading({
							mask: true
						})
						this.$http
							.post('order/sopreceiptrecords/pay', param)
							.then(res => {
								if (res && res.payInfo) {
									this.$util.requestPay(
										data.payType,
										res.payInfo,
										'workOrder',
										() => {
											this.isShowPayPopup = false
										}
									)
								}
							})
							.finally(() => {
								uni.hideLoading()
							})
					}
				}
			},
			// 计算每周的周一和周日 然后获取服务日历
			getWeekByWeekNumber(weeknumber) {
				var date = moment()
					.isoWeek(weeknumber || 1)
					.startOf('week'),
					weeklength = 7,
					result = []
				while (weeklength--) {
					result.push(date.format('YYYY-MM-DD'))
					date.add(1, 'day')
				}
				this.startDate = result[0]
				this.endDate = result[6]
				this.currentYear = this.startDate.split('-')[0]
				this.currentMonth = this.startDate.split('-')[1]
				this.getServiceCalendar()
			},
			// 获取上一周的服务日历
			preWeek() {
				// 如果所选的时间早于项目开始时间或者晚于项目结束时间，不获取数据
				if (
					Date.parse(this.serviceDuration['startDate']) >
					Date.parse(this.startDate)
				) {
					this.$util.toast('没有更多数据')
					return
				}
				this.weekNumber--
				this.calculateWeekNumber(false)
			},
			// 获取下一周的服务日历
			nextWeek() {
				// 如果所选的时间早于项目开始时间或者晚于项目结束时间，不获取数据
				if (this.serviceDuration.stillLeft > 0) {
					// 项目未延期
					if (
						Date.parse(this.serviceDuration['endDate']) < Date.parse(this.endDate)
					) {
						this.$util.toast('没有更多数据')
						return
					}
				} else {
					// 项目已经延期 允许查看结束时间以后的数据 但范围不超过延期的天数
					// 新的结束日期 = 项目的原结束日期 + 延期的天数
					const newEndDate =
						Date.parse(this.serviceDuration['endDate']) +
						Math.abs(this.serviceDuration.stillLeft) * 24 * 60 * 60 * 1000
					if (newEndDate < Date.parse(this.endDate)) {
						this.$util.toast('没有更多数据')
						return
					}
				}
				this.weekNumber++
				this.calculateWeekNumber(false)
			},
			// 获取当前周是一年内的第几周
			calculateWeekNumber(isReset = true) {
				if (isReset) {
					// isReset = true -> 首次进入页面、切换服务、切换我的家
					this.weekNumber = moment().week()
				}
				this.getWeekByWeekNumber(this.weekNumber)
			},
			// 获取服务日历
			getServiceCalendar() {
				this.$httpApi
					.getServiceCalendarOverview({
						projectId: this.currentService.projectId,
						startDate: this.startDate,
						endDate: this.endDate
					})
					.then(res => {
						if (res) {
							if (!res.projectConstructions.length) return
							const today = moment().valueOf()
							const startDate = Date.parse(res.simpleProject.startDate)
							const endDate = Date.parse(res.simpleProject.endDate)
							let fromToday = (today - startDate) / (1 * 24 * 60 * 60 * 1000) // 计算已施工天数
							let stillLeft = (endDate - today) / (1 * 24 * 60 * 60 * 1000) // 计算距离竣工的天数
							if (fromToday < 0) {
								fromToday = 0
							}
							// stillLeft < 0 说明项目延期
							if (stillLeft < 0) {
								// 延期时已施工天数加上延期的天数
								fromToday += Math.abs(stillLeft)
							}
							this.serviceDuration['fromToday'] = Math.round(fromToday)
							this.serviceDuration['stillLeft'] = Math.round(stillLeft)
							this.serviceDuration['startDate'] = res.simpleProject.startDate
							this.serviceDuration['endDate'] = res.simpleProject.endDate
							const result = []
							res.projectConstructions.forEach(item => {
								if (item.constructionDate) {
									result.push({
										date: item.constructionDate.split('-')[2],
										fullDate: item.constructionDate,
										hadEvent: item.status == 0, // 是否有发生事件
										hasPlan: item.status == 1 // 是否有施工计划、节点相关等
									})
								}
							})
							// 避免页面重新渲染时闪一下
							this.currentWeek = result;
						}
					})
			},
			// 跳转到呼叫师傅页面
			goToCall() {
				if (!uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					return
				}
				if (this.canCall) {
					// 打开呼叫师傅的弹窗
					this.isShowDetail = !this.isShowDetail
					this.isCallMaster = !this.isCallMaster
				} else {
					this.isShowDetail = false
					// 取消订单
					uni.showModal({
						title: '确认操作',
						content: '是否确认取消呼叫',
						cancelText: '再等等',
						confirmText: '确认',
						confirmColor: '#FE6E32',
						success: res => {
							if (res.confirm) {
								uni.showLoading({
									title: '取消中',
									mask: true
								})
								this.$httpApi
									.cancelOrderBySkillId(this.selectedDetail.skillId)
									.then(res => {
										if (res) {
											this.$util.toast('取消呼叫成功')
											this.checkIsCalling()
											uni.$emit('updateWorkerInfo')
										}
									})
									.finally(() => {
										uni.hideLoading()
									})
							}
						}
					})
				}
			},
			// 获取服务计划节点样式
			getNodeItemStyle(index) {
				if (this.projectPlan.length == 0) return
				let obj = {
					width: `100rpx`,
					backgroundColor: '#ff5d35'
				}
				let nextNode = this.projectPlan[index + 1]
				if (nextNode && nextNode.completeCount != nextNode.totalCount) {
					obj['backgroundColor'] = '#F7F7F7'
				}
				return obj
			},
			// 获取服务计划
			getProjectPlan() {
				this.projectPlan = []
				this.$httpApi
					.getServicePlan({
						projectId: this.currentService.projectId
					})
					.then(res => {
						if (res) {
							this.isShowServicePlan = true
							this.projectPlan = res.groups
							// 在所有服务节点的开头和末尾增加开工和完工节点 tfs 26929
							if (this.projectPlan.length != 0) {
								const firstNode = this.projectPlan[0]
								const lastNode = this.projectPlan[this.projectPlan.length - 1]
								const startNode = {
									completeCount: 0,
									// totalCount: res.startFlag ? 0 : 99,
									totalCount: res.startFlag ? 0 : 99,
									groupName: '开工'
								}
								const endNode = {
									completeCount: 0,
									totalCount: res.finishFlag ? 0 : 99,
									groupName: '完工'
								}
								this.projectPlan.unshift(startNode)
								this.projectPlan.push(endNode)
							}
						}
					})
			},
			// 获取验收报告
			getAcceptance() {
				this.acceptanceList = []
				this.$httpApi
					.getAcceptancesByProjectId({
						projectId: this.currentService.projectId,
						includeDetail: true
					})
					.then(res => {
						if (res) {
							this.acceptanceList = res
						}
					})
			},
			// 根据项目ID获取团队成员
			getProjectMember() {
				this.currentTeamMember = []
				this.$httpApi
					.getProjectMemberByProject({
						projectId: this.currentService.projectId
					})
					.then(res => {
						if (res) {
							this.currentTeamMember = res
						}
					})
			},
			// 根据收货地址ID获取项目/服务列表
			getHomeService() {
				this.myAllServices = []
				this.currentService = {}
				this.logList = []
				this.currentTeamMember = []
				this.isShowServicePlan = false
				this.buildLogList = []
				this.sopuploadList = []
				this.$httpApi.getProjectsByAddressId(this.myHomeInfo.id).then(res => {
					if (res && res.length != 0) {
						this.isMyHome = true
						this.myAllServices = res.map(item => {
							return {
								...item,
								label: item.projectName + item.created.split(' ')[0],
								value: item.id,
								extra: item
							}
						})
						// 跳转业定位到指定项目，首页默认第一个项目
						if (this.options && this.options.projectId) {
							this.myAllServices.some((item, index) => {
								if (item.projectId == this.options.projectId) {
									this.currentService = item;
									this.currentTab = index;
									return true
								}
							})
							this.options = null;
						} else {
							this.currentService = res[0]
						}
						// 获取服务团队
						this.getProjectMember()
						// 获取服务日历
						this.calculateWeekNumber()
						// 获取服务计划
						this.getProjectPlan()
						// 获取验收报告
						this.getAcceptance()
						if (this.currentService.jobCode == "JOB_DESIGNER") {
							// 设计类获取服务日志
							this.getBuildLogList("设计")
							// 设计类图纸
							this.getSopuploadImg()
						} else {
							this.getBuildLogList("施工")
						}
					}
				})
			},
			// 获取当前我的家待确认项
			getMyPendingTodo() {
				this.$httpApi.getMyTodoPending(this.myHomeInfo.id).then(res => {
					if (res.records) {
						res.records.map(item => {
							item.businessParams = JSON.parse(item.businessParams)
						})
						this.myHomeTodo = []
						this.myHomeTodo = res.records
					}
				})
			},
			// 获取施工日志
			getBuildLogList(type) {
				let params = {
					projectId: this.currentService.projectId,
					size: 9999
				}
				if (type == "施工") {
					params.time = this.selectedDay
				}
				this.$httpApi.getBuildLog(params).then(res => {
					if (res.records && res.records.length) {
						// 服务日志特殊处理
						res.records.some((item) => {
							item.images = []
							if (item.source == "CONSTRUCTION") {
								if (item.pic) {
									item.images = JSON.parse(item.pic)
								}
								if (item.supplementaryContent && item.supplementaryContent != '[]') {
									JSON.parse(item.supplementaryContent).map((v) => {
										if (v.pic) {
											item.images = item.images.concat(JSON.parse(v.pic))
										}
									})
								}
								if (item.images.length) {
									item.pic = JSON.stringify(item.images)
								}
							}
						})
					}
					this.buildLogList = res.records
				})
			},
			// 获取装修图纸
			getSopuploadImg() {
				this.$httpApi.getSopupload({
					projectId: this.currentService.projectId
				}).then(res => {
					this.sopuploadList = res
				})
			},
			// 点击日历
			selectDay(item) {
				this.selectedDay = item.fullDate
				this.getBuildLogList("施工")
			},
			// 滑动切换服务日历/服务团队/服务计划
			onSwiperChange(e) {
				this.currentServiceTab = e.detail.current
			},
			// 点击切换服务日历/服务团队/服务计划
			changeServiceTab(index) {
				this.currentServiceTab = index
			},
			// 添加交办事项
			addTodo() {
				this.toPage(`/pages-myHome/confirmItems?addressId=${this.myHomeInfo.id}`)
			},
			// 处理待办
			handleTodo(item) {
				const data = item.businessParams
				this.node = item
				if (item.businessCode.startsWith('payment')) {
					// 支付收款
					this.$httpApi.getMoenyByNodeId(data.nodeId).then(response => {
						this.isShowPayPopup = !this.isShowPayPopup
						this.payAmount = response
						this.payNodeId = data.nodeId
					})
				} else if (item.businessCode.startsWith('nodeReview')) {
					// 1000=无 1001=选材 1002=派单 1003=预算 1004=施工 1005=验收 1006=上传 1009=评价 1010=交底 1011=量房 1012=收款 1013=材料申请 1014=材料管理
					this.toDoPage(data)
				} else if (item.businessCode.startsWith('materialPayment')) {
					// 材料支付
					// 解析明细id
					let mater = this.node.businessCode.split('_')
					this.node.materOredrId = mater[1]
					this.toPage(`/pages-order/payOrderDetails?id=${this.node.materOredrId}`)
				} else if (item.businessCode.startsWith('discloseTodo')) {
					this.toPage(`/pages-myHome/giveNotice?projectId=${data.projectId}`)
				} else if (item.businessCode.startsWith('alteration')) {
					let mater = this.node.businessCode.split('_')
					this.toPage(`/pages-myHome/changeRecordPage?businessCodeId=${mater[1]}`)
				}
			},
			// 方案图纸 装修花费 装修用料 报告点击事件
			buttonClick(type) {
				switch (type) {
					case '方案图纸':
						this.toPage(`/pages-myHome/houseView?addressId=${this.myHomeInfo.id}`)
						break
					case '装修花费':
						this.toPage(
							`/pages-myHome/serviceCost?addressId=${this.myHomeInfo.id}`
						)
						break
					case '装修用料':
						this.toPage(
							`/pages-myHome/decorationMaterials/decorationMaterials?offerId=${this.currentService.projectId}`
						)
						break
					case '报告':
						this.toPage(`/pages-myHome/reviewNode/acceptanceReport?id=${this.myHomeInfo.id}`)
						break
					default:
						break
				}
			},
			// 确认切换服务
			confirmSelectService(item, index) {
				this.currentTab = index;
				this.selectedDay = moment().format('YYYY-MM-DD');
				this.buildLogList = [];
				this.sopuploadList = [];
				this.currentServiceTab = 0;
				setTimeout(() => {
					this.currentService = item
					// 获取团队成员
					this.getProjectMember()
					// 获取服务日历
					this.calculateWeekNumber(true)
					// 获取服务计划
					this.getProjectPlan()
					if (item.jobCode == "JOB_DESIGNER") {
						this.getBuildLogList("设计")
						// 设计类图纸
						this.getSopuploadImg()
					} else {
						this.getBuildLogList("施工")
					}
					this.isShowServicePlan = true
				}, 100)
			},
			// 确认切换我的家
			confirmSelectHome(e) {
				uni.setStorageSync('myHomeDefaultIndex', e[0].extra.index)
				this.myHomeDefaultIndex = [e[0].extra.index]
				uni.setStorageSync('roomAddress', e[0].extra)
				this.myHomeInfo = e[0].extra
				this.completeAddress = e[0].extra
				this.isMyHome = false;
				this.currentTab = 0;
				this.getHomeService()
				this.getMyPendingTodo()
				this.checkIsCalling()
			},
			// 切换我的家
			changeMyHome() {
				if (this.myHomeList.length == 0) {
					this.$util.toast('请先添加我的家信息')
					return
				}
				this.isShowPicker = true
			},
			// 联系团队成员
			contactTeam(type, member) {
				if (type == 'phone') {
					if (member.phone) {
						uni.makePhoneCall({
							phoneNumber: member.phone
						})
					}
				} else {
					this.$util.goToChat(member.userId, member.name, 'serviceTeam')
				}
			},
			// 联系项目管家
			contactManager(type, item) {
				let phone = this.currentService.contactPhone || ''
				let userId = this.currentService.contactUserId || ''
				let name = this.currentService.contactName || ''
				if (item && item.contactUserId) {
					phone = item.contactPhone
					userId = item.contactUserId
					name = item.contactName
				}
				if (type == 'phone') {
					if (phone) {
						uni.makePhoneCall({
							phoneNumber: phone
						})
					}
				} else if (userId) {
					this.$util.goToChat(userId, name, 'serviceTeam')
				}
			},
			// 切换当前显示的服务
			changeCurrentService() {
				this.isShowServicePicker = !this.isShowServicePicker
			},
			// 查看更多页面跳转
			goToMore(type) {
				switch (type) {
					case '更多待办':
						this.toPage(
							`/pages-myHome/confirmItems?addressId=${this.myHomeInfo.id}&projectId=${this.currentService.projectId}`
						)
						break
					default:
						break
				}
			},
			// 跳转到添加我的家页面
			addMyHome() {
				if (!uni.getStorageSync('userInfo')) {
					this.$util.goToLoginPage()
					return
				}
				uni.$once('updateMyhome', data => {
					this.getMyAddress()
				})
				// this.toPage('/pages-myHome/addMyHome')
				this.toPage(`/pages-common/handleAddress/handleAddress?myHome=${true}`)
			},
			// 切换显示的工种详情
			changeTab(index) {
				this.isShowEditView = false
				this.currentTab = index
				this.selectedDetail = this.workTypeList[3 + index]
				this.checkIsCalling()
				setTimeout(() => {
					this.isShowEditView = true
				}, 100)
			},
			// 获取我的收货地址
			getMyAddress(status = true) {
				this.$httpApi.getPostAddress().then(res => {
					if (res) {
						this.myHomeList = res
						this.myHomeList = this.myHomeList.map((item, index) => {
							return {
								...item,
								label: item.poiName + (item.detailAddress || ''),
								extra: {
									...item,
									index
								}
							}
						})
						if (status) {
							if (this.myHomeList.length !== 0) {
								this.currentTab = 0;
								// 默认选择第一个我的家作为当前我的家
								if (!this.myHomeInfo.id) {
									if (this.options && this.options.addressId) {
										this.myHomeInfo = this.myHomeList.find((item) => item.id == this.options
											.addressId);
										this.completeAddress = this.myHomeList.find((item) => item.id == this
											.options.addressId);
									} else {
										// 从缓存里取上一次选择的地址或默认0
										// 注意 this.myHomeDefaultIndex是数组 所以取this.myHomeDefaultIndex[0]
										this.myHomeInfo = this.myHomeList[this.myHomeDefaultIndex[0]]
										this.completeAddress = this.myHomeList[this.myHomeDefaultIndex[0]]
									}
									uni.setStorageSync('roomAddress', this.myHomeInfo)
								}
								// 获取当前我的家关联的所有项目
								this.getHomeService()
							}
						}
						if (this.myHomeInfo && this.myHomeInfo.id) {
							// 获取当前我的家待办事项
							this.getMyPendingTodo()
						}
					}
				})
			},
			// 获取平台工种
			getTypeWork() {
				this.$httpApi
					.getPlatformSkills({
						clientType: 'platform'
					})
					.then(res => {
						if (res) {
							res.map(item => {
								this.ipImage.some((v, i) => {
									if (item.skillName.indexOf(v.name) != -1) {
										item.img = v.img
									}
								})
							})
							this.workTypeList = res.filter(
								item => item.skillName != '维修安装工'
							)
						}
					})
			},
			// 查看工种详情
			viewDetail(item, isWorker = false) {
				if(item.jobCode != "JOB_WORKER"){
					this.toPage(
					`/pages-homeCall/callMasterPage/callMasterPage?title=${item.skillName}&skillId=${item.skillId}`)
				}else{
					this.selectedDetail = item
					this.isShowDetail = true
					this.isWorker = isWorker
					this.isShowEditView = true
					this.currentTab = 0
					this.checkIsCalling()
				}
			},
			closeServicePopup() {
				this.isShowServicePicker = false
				uni.showTabBar({
					animation: true
				})
			},
			closePopup() {
				this.isShowDetail = false
				this.isWorker = false
				uni.showTabBar({
					animation: true
				})
			},
			getImg(skillName) {
				switch (skillName) {
					case '项目管家':
						return 'https://www.51mihuo.com/static/icon/my-home/xmgj.png'
					case '项目监理':
						return 'https://www.51mihuo.com/static/icon/my-home/jl.png'
					case '设计师':
						return 'https://www.51mihuo.com/static/icon/my-home/sjs.png'
					default:
						return 'https://www.51mihuo.com/static/icon/my-home/worker.png'
				}
			},
			getWorkerLabel(skillName) {
				let label = this.workTypeList.reduce((pre, cur) => pre + (cur.jobCode === 'JOB_WORKER' && cur
					.quickCallFlag === 1 ? '、' + cur.skillName : ''), '')
				label = label.substring(1, label.length)
				return label
			},
			// 获取协议名称
			getAgreementName(data) {
				let name = "服务协议"
				if (data.jobCode == "JOB_MANAGER") {
					name = "管家服务协议";
				}
				if (data.jobCode == "JOB_DESIGNER") {
					name = "设计服务协议";
				}
				if (data.jobCode == "JOB_SUPERVISION") {
					name = "监理服务协议";
				}
				if (data.jobCode == "JOB_WORKER") {
					name = "服务用工协议";
				}
				return name;
			},
			lookagreement(data) {
				let obj = {
					...data
				}
				obj.address = this.myHomeInfo?.province + this.myHomeInfo?.city + this.myHomeInfo?.region +
					this.myHomeInfo?.latAddress + this.myHomeInfo?.poiName;
				obj.bName = data.name;
				obj.bPhone = data.phone;
				obj.name = this.curUser?.realName || this.curUser?.nickName;
				obj.phone = this.curUser.phone;
				this.masterObj = obj;
				this.isAgreement = true;
				uni.hideTabBar({
					animation: true
				})
			},
			closeagreement() {
				uni.showTabBar({
					animation: true
				})
			},
			// 报告详情
			gotoDetail(data) {
				switch (data.source) {
					case 'DISCLOSE': //交底
						this.toPage(`/pages-myHome/reviewNode/discloseReport?nodeId=${data.nodeId || ''}`)
						break;
					case 'UPLOAD': //上传
						this.toPage(
							`/pages-myHome/houseUploadView?nodeId=${data.nodeId || ''}&projectId=${data.projectId || ''}`
						)
						break;
					case 'ACCEPTANCE': //验收
						this.toPage(`/pages-order/acceptance/acceptance-report-template?nodeId=${data.nodeId || ''}`)
						break;
					case 'ASSIGN':
						this.toPage(`/pages-order/constructionLogDetail/constructionLogDetail?id=${data.id}`);
						break;
					case 'CONSTRUCTION':
						this.toPage(`/pages-order/constructionLogDetail/constructionLogDetail?id=${data.id}`);
						break;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sticky-content {
		width: 100vw;
		height: calc(88rpx + var(--status-bar-height));
		/* #ifdef APP-PLUS */
		height: calc(88rpx + var(--status-bar-height) / 2);
		/* #endif */
		position: fixed;
		background-color: #ffffff;
		z-index: 999;
		padding-top: var(--status-bar-height);
		/* #ifdef APP-PLUS */
		padding-top: calc(var(--status-bar-height) / 2);
		/* #endif */
		transition: top 0.5s ease;

		.title {
			line-height: calc(88rpx);
		}
	}

	.main-page {
		width: 100vw;
	}

	.header-bg {
		width: 100vw;
		height: 400rpx;
		border-radius: 0 0 50rpx 50rpx;
		background-image: url('https://www.51mihuo.com/static/images/home_work_bg.JPG');
		background-size: cover;
		background-position: center;
		padding-left: 30rpx;
		padding-top: 190rpx;
		/* #ifndef H5 */
		margin-top: 88rpx;
		/* #endif */

		.title {
			width: 690rpx;
			height: max-content;
			min-height: 48rpx;
			max-height: 96rpx;
			justify-content: space-between;

			.left {
				width: 600rpx;

				.title-text {
					width: max-content;
					height: max-content;
					min-height: 48rpx;
					max-height: 96rpx;
					max-width: 80%;
					font-size: 46rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #ffffff;
					line-height: 48rpx;
					@include bov(2);
				}

				.arrow {
					position: relative;
					width: 40rpx;
					height: 40rpx;
					background-color: #f7f7f7;
					border-radius: 6rpx;
					justify-content: center;
					margin-left: 20rpx;

					.arrow-icon {
						margin-top: -4rpx;
						box-sizing: border-box;
						height: 12rpx;
						width: 12rpx;
						border-style: solid;
						border-color: #000000;
						border-width: 0rpx 2rpx 2rpx 0rpx;
						transform: rotate(45deg);
						transition: border-width 150ms ease-in-out;
					}
				}
			}

			.icon {
				width: 48rpx;
				height: 48rpx;
			}
		}

		.sub-title {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #ffffff;
			line-height: 34rpx;
			margin-top: 26rpx;
		}
	}

	.work-type {
		width: 100vw;
		padding: 0 30rpx;
		height: max-content;
		margin-top: 60rpx;

		.type-item {
			width: 690rpx;
			height: 150rpx;
			margin-bottom: 30rpx;
			background-color: #f7f7f7;
			border-radius: 20rpx;
			padding-left: 30rpx;

			.icon {
				width: 100rpx;
				height: 100rpx;
			}

			.text-container {
				max-width: 500rpx;
				margin-left: 30rpx;
				@include bov(2);

				.title {
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;

					.arrow {
						margin-left: 10rpx;
						border-top: 10rpx solid transparent;
						border-bottom: 10rpx solid transparent;
						border-left: 14rpx solid #000000;
					}
				}

				.des {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #808080;
					line-height: 34rpx;
					margin-top: 20rpx;
				}
			}
		}
	}

	.service-info {
		width: 690rpx;
		margin: 30rpx 30rpx 0 30rpx;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		background-color: #f7f7f7;

		.info-content {
			width: 400rpx;
			margin-left: 30rpx;

			.upper {
				width: 400rpx;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
				@include toe();
			}

			.lower {
				width: 400rpx;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #808080;
				line-height: 34rpx;
				margin-top: 10rpx;
				@include toe();
			}
		}

		.info-button {
			margin-left: 30rpx;

			.icon {
				width: 30rpx;
				height: 30rpx;
			}
		}
	}

	.my-home {
		width: 100vw;
		height: max-content;

		.more-icon {
			width: 98rpx;
			height: 40rpx;
		}

		.home-header {
			width: 100vw;
			padding: 0 30rpx;
			justify-content: space-between;

			.title {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
			}

			.right {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;

				.arrow {
					width: 0;
					height: 0;
					border-left: 8rpx solid transparent;
					border-right: 8rpx solid transparent;
					border-top: 8rpx solid #000000;
					margin-left: 10rpx;
				}
			}
		}

		.button-container {
			width: 100vw;
			height: 150rpx;
			margin-top: 30rpx;

			.button-item {
				width: 25%;
				height: 150rpx;
				justify-content: center;
				flex-direction: column;

				.button-text {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					color: #000000;
					line-height: 34rpx;
				}

				.button-icon {
					width: 52rpx;
					height: 52rpx;
					border-radius: 20rpx;
					margin-bottom: 20rpx;
				}
			}
		}

		.my-todo {
			width: 690rpx;
			height: max-content;
			margin: 30rpx;
			border-radius: 20rpx;
			background-color: #f7f7f7;
			padding: 30rpx;

			.todo-title {
				justify-content: space-between;

				.title-text {
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					color: #000000;
					line-height: 34rpx;
				}

				.more-icon {
					width: 68rpx;
					height: 18rpx;
				}
			}

			.todo-items {
				margin-top: 10rpx;

				.todo-item {
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					box-sizing: border-box;

					.todo-item_flex {
						display: flex;
						align-items: center;
						flex: 1;
					}

					.dot {
						width: 6rpx;
						height: 6rpx;
						border-radius: 50%;
						background-color: $themeColor;
					}

					.todo-info {
						width: 500rpx;
						height: 60rpx;
						margin-left: 10rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						color: #000000;
						line-height: 60rpx;
						@include toe();
					}

					.todo-button {
						padding: 10rpx 20rpx;
						// height: 40rpx;
						border-radius: 40rpx;
						// width: 140rpx;
						text-align: center;
						background-color: #000000;
						font-size: 20rpx;
						font-family: SourceHanSansSC;
						font-weight: 400;
						color: #ffffff;

						&.todo-button_end {
							font-size: 20rpx;
							color: #808080;
							background-color: transparent;
							padding: 5rpx 0;
						}
					}
				}
			}

			.add-todo {
				width: 100%;
				justify-content: center;
				margin-top: 30rpx;

				.add-icon {
					width: 158rpx;
					height: 24rpx;
				}
			}
		}

		.project-tabs {
			.project-contain {
				width: 690rpx;
				margin: 20rpx 30rpx 0;
				white-space: nowrap;

				.tabs-item {
					width: 100%;

					.tabs-item_label {
						color: #333333;
						font-size: 24rpx;
						font-family: NotoSansHans-Regular;
						background: #F7F7F7;
						padding: 18rpx 24rpx;
						border-radius: 50rpx;
						margin: 0 20rpx 0 10rpx;
						border: 2rpx solid #F7F7F7;
						/*  #ifdef  MP-WEIXIN  */
						margin-top: 40rpx;
						/*  #endif  */
					}

					.tabs-active {
						color: #FE6E32;
						border: 2rpx solid #FE6E32;
						background: #FFF0EA;
					}
				}
			}
		}

		.drawing {
			padding: 0 30rpx;

			.drawing-title {
				color: #000000;
				font-size: 28rpx;
				font-weight: bold;
				font-family: NotoSansHans-Medium;
				margin: 30rpx 0;
			}
		}

		.service-container {
			width: 100vw;
			margin-top: 30rpx;
			padding: 0 30rpx;

			.service-tabs {
				justify-content: space-between;
				align-items: flex-start;

				.left {
					width: 100%;

					.tab-item {
						flex-direction: column;
						font-size: 28rpx;
						font-family: Noto Sans S Chinese;
						line-height: 34rpx;
						margin-right: 60rpx;
						color: #626262;
					}

					.tab-active {
						font-weight: 500;
						color: #000000;
						transition: all 0.5s ease;
					}

					.tab-icon {
						width: 80rpx;
						height: 10rpx;
						border-radius: 20rpx;
						margin-top: 10rpx;
						background: linear-gradient(90deg,
								#ff5d35 20%,
								rgba(255, 255, 255, 0) 80%);
						transition: all 0.5s ease;
					}
				}
			}

			.service-swiper {
				width: 690rpx;
				height: max-content;
				min-height: calc(20vh - var(--status-bar-height) - 88rpx);
				max-height: calc(100vh - var(--status-bar-height) - 88rpx);
				margin-top: 30rpx;

				.swiper-item {
					width: 690rpx;
					// 给一个默认的高度，不然日志会一直在底部，切换天数的时候页面会上下跳动
					min-height: 1000rpx;
				}

				.log {
					margin-top: 30rpx;
				}

				.log-list {
					display: flex;

					.log-list_left {
						flex-shrink: 0;
						width: 160rpx;
						padding-right: 16rpx;
						border-right: 2rpx solid #F0F0F0;
						position: relative;
						text-align: right;

						&::before {
							position: absolute;
							content: '';
							width: 7rpx;
							height: 7rpx;
							border-radius: 50%;
							background: #FE6E32;
							top: 10rpx;
							right: -5rpx;
						}

						.left-time {
							color: #999999;
							font-size: 24rpx;
							font-family: NotoSansHans-Regular;
						}

						.left-tips {
							color: #000000;
							font-size: 20rpx;
							font-family: NotoSansHans-Medium;
						}
					}

					.log-list_right {
						flex: 1;
						padding: 0 0 20rpx 26rpx;

						.list-right_item {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.right-item_right {
								text {
									color: #000000;
									font-size: 20rpx;
									font-weight: bold;
									font-family: NotoSansHans-Medium;
								}
							}
						}

						.name {
							color: #000000;
							font-size: 24rpx;
							font-family: NotoSansHans-Regular;
							padding: 0 10rpx;
						}

						.skill-name {
							color: #FE6E32;
							font-family: HuXiaoBo-NanShen;
							font-weight: bold;
							font-size: 18rpx;
							background: #FFF0EA;
							border-radius: 10rpx 0;
							padding: 5rpx 7rpx;
						}

						.log_desc {
							font-size: 24rpx;
							color: #4D4D4D;
							font-family: NotoSansHans-Regular;
							padding: 20rpx 0;
						}
					}

					.row {
						padding: 20rpx 0;

						.right-item_index {
							margin-left: 60rpx;
						}
					}
				}

				.service-calendar {
					width: 100%;

					.step-nodes {
						width: 100%;
						margin-top: 30rpx;
						overflow-x: scroll;
						overflow-y: hidden;
						flex-flow: row nowrap;

						.node-item {
							width: 140rpx;
							flex-shrink: 0;
							height: 100rpx;
							flex-direction: column;
							margin-right: 10rpx;
							position: relative;

							// &:first-child{
							// 	width: 80rpx;
							// 	.node-line{
							// 		margin-left: 45rpx !important;
							// 		/*  #ifdef  H5  */
							// 		margin-left: 70rpx !important;
							// 		/*  #endif  */
							// 		/*  #ifdef  MP-WEIXIN  */
							// 		margin-left: 90rpx !important;
							// 		/*  #endif  */
							// 	}
							// }
							&:last-of-type {
								margin-right: 0;
							}

							.node-icon {
								width: 40rpx;
								height: 40rpx;
								z-index: 99;
							}

							.node-text {
								text-align: center;
								font-weight: bold;
								font-size: 20rpx;
								line-height: 20rpx;
								font-family: Noto Sans S Chinese;
								margin-top: 20rpx;
							}
						}

						.node-line {
							position: absolute;
							height: 4rpx;
							border-radius: 2rpx;
							left: calc(50% + 24rpx);
							margin-top: 18rpx;
						}
					}

					.service-duration {
						width: 100%;
						margin-top: 20rpx;
						padding: 30rpx;
						border-radius: 20rpx;
						background-color: #f7f7f7;
						font-size: 30rpx;
						font-family: Noto Sans S Chinese;
						line-height: 34rpx;
						color: #000000;
					}

					.calendar-container {
						width: 690rpx;
						margin-top: 30rpx;

						.year-month {
							font-size: 26rpx;
							font-family: Noto Sans S Chinese;
							line-height: 34rpx;
							color: #000000;
							font-weight: bold;
						}

						.week-container {
							width: 100%;

							.week-days {
								width: 100%;
								margin-top: 20rpx;
								display: grid;
								grid-template-columns: repeat(auto-fill, 50rpx);
								grid-column-gap: 50rpx;
								justify-content: center;

								.weekday {
									width: 50rpx;
									height: 60rpx;
									flex-direction: column;
									justify-content: flex-start;

									.date {
										width: 40rpx;
										height: 40rpx;
										font-size: 26rpx;
										font-family: Noto Sans S Chinese;
										color: #000000;
										text-align: center;
										line-height: 40rpx;
									}

									.day-active {
										line-height: 40rpx;
										border-radius: 50%;
										background-color: $themeColor;
										color: #ffffff;
									}

									.event-dot {
										width: 6rpx;
										height: 6rpx;
										margin-top: 6rpx;
										border-radius: 50%;
										background-color: $themeColor;
									}

									.plan-dot {
										width: 6rpx;
										height: 6rpx;
										margin-top: 6rpx;
										border-radius: 50%;
										background-color: #999999;
									}
								}
							}
						}
					}

					.calendar-content {
						width: 100%;
						margin-top: 30rpx;

						.contetn-item {
							margin-bottom: 30rpx;

							.item-header {
								.name {
									margin-left: 20rpx;
									font-size: 28rpx;
									font-family: Noto Sans S Chinese;
									color: #000000;
									line-height: 40rpx;
								}

								.skill-name {
									margin-left: 20rpx;
									font-size: 18rpx;
									font-weight: 400;
									line-height: 34rpx;
									color: $themeColor;
									background-color: #ffece6;
									padding: 0 10rpx;
									font-weight: bold;
									border-radius: 10rpx 2rpx 10rpx 0;
								}
							}

							.item-info {
								margin-top: 10rpx;
								margin-left: 90rpx;
								font-size: 24rpx;
								font-family: Noto Sans S Chinese;
								font-weight: 400;
								color: #808080;
								line-height: 34rpx;
							}

							.item-img {
								width: 600rpx;
								height: max-content;
								margin-top: 10rpx;
								margin-left: 90rpx;
								flex-wrap: wrap;

								.img {
									width: 200rpx;
									height: 200rpx;
									margin-left: 10rpx;
									margin-bottom: 10rpx;
								}
							}
						}

						.content-title {
							width: 100%;
							font-size: 32rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #141414;
							line-height: 34rpx;
						}

						.acceptance-report {
							width: 100%;
							height: max-content;

							.report-item {
								width: 100%;

								.title-container {
									width: 100%;
									height: 123rpx;
									padding: 30rpx;
									margin-top: 30rpx;
									background: #f7f7f7;
									border-radius: 20rpx;
									justify-content: space-between;

									.left {
										.report-title {
											width: 100%;
											font-size: 28rpx;
											font-family: PingFang SC;
											font-weight: bold;
											color: #141414;
											line-height: 34rpx;
										}

										.report-time {
											font-size: 20rpx;
											font-family: PingFang SC;
											font-weight: 500;
											color: #999999;
											line-height: 34rpx;
											margin-top: 10rpx;
										}
									}

									.right {
										font-size: 24rpx;
										font-family: PingFang SC;
										font-weight: bold;
										line-height: 34rpx;
									}
								}

								.report-record {
									width: 100%;
									height: 84rpx;
									justify-content: space-between;
									padding: 30rpx;

									.record-name {
										@include toe();
										max-width: 500rpx;
										font-size: 24rpx;
										font-family: PingFang SC;
										font-weight: 500;
										color: #000000;
										line-height: 34rpx;
									}

									.record-status {
										width: max-content;
										padding: 0 10rpx;
										height: 40rpx;
										background: rgba(254, 110, 50, 0.1);
										border-radius: 6rpx;
										font-size: 24rpx;
										font-family: Noto Sans S Chinese;
										font-weight: 500;
										color: #fe6e32;
										line-height: 40rpx;
										&.status_1{
											color: #187518;
    										background: #E7F1E7;
										}
									}
								}

								.report-images {
									width: 100%;
									padding: 30rpx;
									padding-bottom: 0rpx;
									flex-wrap: wrap;

									.report-img {
										margin: 0 20rpx 20rpx 0;
										width: 120rpx;
										height: 120rpx;
										border-radius: 20rpx;
										margin-bottom: 30rpx;
									}
								}
							}
						}
					}
				}

				.service-team {
					.team-member {
						width: 100%;
						padding: 20rpx 0rpx;

						.team-right {
							flex: 1;
							display: flex;
							justify-content: space-between;

							.agreement {
								color: #FE6E32;
								font-size: 28rpx;
								padding-top: 10rpx;
							}
						}

						.info-content {
							margin-left: 30rpx;

							.upper {
								font-size: 28rpx;
								font-family: Noto Sans S Chinese;
								font-weight: 500;
								color: #000000;
								line-height: 34rpx;
							}

							.lower {
								font-size: 24rpx;
								font-family: Noto Sans S Chinese;
								font-weight: 400;
								color: #808080;
								line-height: 34rpx;
								margin-top: 10rpx;
							}
						}

						.info-button {
							display: flex;
							justify-content: flex-end;

							.icon {
								width: 30rpx;
								height: 30rpx;
							}
						}
					}
				}

				.service-plan {}
			}
		}
	}

	.popup {
		width: 100vw;
		border-radius: 20rpx 20rpx 0 0;
		padding-top: 20rpx;
		height: 100%;
		.info-close {
			display: flex;
			justify-content: flex-end;
			padding: 0 15rpx;
		}
		.worker-tab {
			margin: 10rpx 0;
		}
		.info-main {
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			border-bottom: 2rpx solid #f0f0f0;
			padding-bottom: 20rpx;
			.image {
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.info-main_content {
				.info-main_content-title {
					display: flex;

					text {
						color: #141414;
						font-weight: bold;
						font-size: $mainFontSize;
						padding-right: 20rpx;
					}

					.image {
						width: 48rpx;
						height: 26rpx;
						image-rendering: optimize-contrast;
						image-rendering: -webkit-optimize-contrast;
					}
				}

				.info-main_content-text {
					font-size: 26rpx;
				}
			}
		}

		.scroll-view {
			height: calc(100% - 300rpx);
			overflow-y: auto;
			.edit-view {
				width: 100%;
				height: 100%;
				padding: 10rpx 30rpx 0;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.name_sup {
		font-size: 26rpx;
		color: #4D4D4D;
		font-family: NotoSansHans-Regular;
	}

	.image-show {
		margin-top: 20rpx;
	}
</style>
