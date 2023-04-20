<template>
	<view class="release-order-details" @click="getMoreShow()">
		<z-nav-bar backState="3000" bgColor="#f5f5f5" fontColor="#979797" @backClick="goBackPage()">
			<view slot="default" class="nav-bar-title">
				{{ setTitle }}
			</view>
			<!-- <view slot="right" class="nav-bar-right" @click="getShare">
				<image src="/static/images/getShare.png" mode=""></image>
			</view> -->
		</z-nav-bar>
		<view class="order-details-data" v-if="orderDetails.id">
			<view class="order-information order-information-default">
				<view class="item-identification" v-if="setOrderModer">
					<view class="bevel-angle">
					</view>
					{{ setOrderModer }}
				</view>
				<!-- <view class="information-top">
					<view class="name-left">
						<text class="requirement-title">{{ setRequirementName }}</text>
					</view>
				</view>
				<view class="item-order-type">
					<view class="item-source" v-if="setSourceType">
						<text class="source-text">{{setSourceType}}</text>
					</view>
					<view class="item-requirement-type" v-if="orderDetails.requirementTypeName">
						<text class="requirement-type-text">{{orderDetails.requirementTypeName}}</text>
					</view>
					<view class="item-work-type-default">
						<text class="type-text">{{ orderDetails.skillName  }}</text>
					</view>
				</view> -->
				<view class="requirements-description">
					<view class="title">
						需求描述
					</view>
					<view v-if="orderDetails.requirementDesc" class="item-desc">
						{{ orderDetails.requirementDesc }}
					</view>
					<view class="attachment-contain">
						<view class="image-contain" v-if="orderDetails.imageList">
							<image-show enable width="150" :key="orderDetails.imageList" height="150"
								quantityPerLine="4" :imgSrc="orderDetails.imageList"></image-show>
						</view>
						<view class="audio-contain" v-if="orderDetails.voice">
							<mihuo-audio :formData="orderDetails.voice" class="voice" />
						</view>
					</view>
				</view>

				<view v-if="setOrderModer !== '上门报价'" class="item-pice">
					<view class="item-pice-left">
						<view class="item-other-contain">
							<text class="pice-num" v-if="setOrderPrice">{{ setOrderPrice }}</text>
							<text class="pice-unit"
								v-if="setOrderPrice && setOrderPrice !== '上门报价'">元/{{ setPiceUnit }}</text>
						</view>
					</view>
					<view class="item-pice-right" v-if="orderDetails.arrivalPrice">
						<text class="pice-text">{{ orderDetails.arrivalPrice }}</text>
						<text class="pice-unit">元/预计到手</text>
					</view>
				</view>
				<!-- 操作日志 -->
				<view class="order-operation-log" v-if="orderDetails.lastLog">
					<u-avatar class="icon-image" :src="$util.thumbnailImage('', true)" size="36">
					</u-avatar>
					<view class="item-log">
						{{ orderDetails.lastLog && orderDetails.lastLog.companyShortName }}
						{{ orderDetails.lastLog && orderDetails.lastLog.created &&
							orderDetails.lastLog.created.substring(0, 16) }}{{ orderDetails.lastLog &&
		orderDetails.lastLog.content }}
					</view>
				</view>

				<!-- 已结费用 -->
				<view class="cost-contain" v-if="this.logList.length > 0 && logListAmount > 0">
					<view class="item-left">已结费用：￥{{ logListAmount }}</view>
					<view class="item-right" @click="getCost">查看明细及原因 <u-icon name="arrow-right" color="#606166"
							size="24"></u-icon>
					</view>
				</view>

				<!-- 订单的价格清单、拒单记录、验收标准 -->
				<view class="brief-information-contain">
					<brief-information :projectId="orderDetails.projectId" :orderId="orderDetails.id"
						:pageType="pageType" :skillId="orderDetails.skillId" :source="orderDetails.source"
						:biddingInfo="biddingInfo">
					</brief-information>
				</view>
			</view>

			<!-- 订单需求描述及其它基本信息 -->
			<view class="order-detailed-information">
				<view class="brief-information">
					<view class="item-brief-information" @click="getNavigation()">
						<view class="item-top">
							<image class="icon-pin" src="/static/images/icon-address/location_pin.png" mode=""></image>
							<view class="item-label">施工地点</view>
						</view>
						<view class="item-bottom">
							<view class="information-item-address" v-if="orderDetails.provinceName">
								<view class="information-item-address-left">
									{{ orderDetails.cityName }}
									{{ orderDetails.districtName ||
										'暂无' }}{{ orderDetails.latAddress }}{{ orderDetails.poiName }}<text
										v-if="addressShow">{{ orderDetails.address }}</text>
								</view>
								<view v-if="resutlDistance" class="information-item-address-right">
									<text class="item-navigation">{{ resutlDistance }}</text>
									<image class="icon-pointer" src="/static/images/icon-address/weizhi_3.png" mode="">
									</image>
								</view>
							</view>
						</view>
					</view>
					<view class="item-brief-information">
						<view class="item-top">
							<image class="icon-user" src="/static/images/icon-phone/call_8.png" mode=""></image>
							<view class="item-label">联系方式</view>
						</view>
						<view v-if="orderDetails.contactName" class="item-bottom">
							{{ setContactName() }}
							{{ orderDetails.contactPhone ? orderDetails.contactPhone.replace(/(\d{3})\d{4}(\d{4})/,
								'$1****$2') : '' }}
						</view>
					</view>
					<view class="item-brief-information">
						<view class="item-top">
							<image class="icon-time" src="/static/images/icon_time/icon_time_1.png" mode=""></image>
							<view class="item-label">期望上门时间</view>
						</view>
						<view v-if="orderDetails.expectDate" class="item-bottom">
							{{ orderDetails.expectDate }}
						</view>
					</view>
				</view>
			</view>


			<!-- 验收资料 -->
			<view class="acceptance-records" v-if="checkedData.length > 0">
				<view class="acceptance-records-contain">
					<view class="title">
						验收资料
					</view>
					<view class="acceptance-records-list" v-for="(item, index) in checkedData" :key="index">
						<view class="item-time">
							<text class="left">0{{ index + 1 }}. 提交时间</text>
							<text class="right">{{ item.applyTime }}</text>
						</view>
						<view class="item-desc">
							{{ item.applyDesc }}
						</view>
						<view class="image-contain" v-if="item.picFiles != '[]'">
							<image-show :imgSrc="item.picFiles" width="200" height="200"></image-show>
						</view>
						<view class="audio-contain" v-if="item.voiceFiles">
							<mihuo-audio :formData="item.voiceFiles" class="voice" />
						</view>
						<!-- <view class="item-result" v-if="item.checkDesc">
							{{item.checkDesc}}
						</view> -->
					</view>
				</view>
			</view>

			<view class="communication-record" v-if="pageType == '接单' && communicationsList.length > 0">
				<view class="record-details" v-for="(item, index) in communicationsList" :key="index">
					<view class="item-title">
						<view class="title">
							<text class="item-left">我的沟通意向</text>
							<text class="more" @click="getRecordMore()">查看更多</text>
						</view>
						<text class="why-content">{{ setResult(item.intention) }} {{ item.abandonedReason }}</text>
					</view>
					<view class="item-title">
						<view class="title"><text class="item-left">沟通详情</text></view>
						<text class="why-content">{{ item.description }}</text>
					</view>
					<view class="image-contain" v-if="item.annexImage">
						<image-show :imgSrc="item.annexImage" width="150" :enable="true" quantityPerLine="4">
						</image-show>
					</view>
					<view class="audio-contain" v-if="item.annexAudio">
						<mihuo-audio ref="mihuoAudioList" :formData="item.annexAudio">
						</mihuo-audio>
					</view>
				</view>
			</view>


			<!-- 报价清单、接单人进来才显示-->
			<view class="quotation-list" v-if="pageType == '接单' && orderDetails.bizOrderOffer && setCurrentUserStatus">
				<view class="quotation-description">
					<!-- 议价-->
					<view class="item-top"
						v-if="[3].includes(Number(orderDetails.priceWay)) && biddingInfo.bidStatus !== 6 && orderDetails.deliveryType !== 1">
						<view class="item-left">
							<text class="pice-num"
								v-if="orderDetails.bizOrderOffer.bidPrice && setBidStatus">{{ orderDetails.bizOrderOffer.bidPrice }}</text>
							<text class="pice-unit" v-if="orderDetails.bizOrderOffer.bidPrice">元/</text>
							<text class="pice-unit">我的报价</text>
						</view>
						<view class="item-right" v-if="orderDetails.bizOrderOffer.arrivalPrice">
							<text class="pice-text">{{ orderDetails.bizOrderOffer.arrivalPrice }}</text>
							<text class="pice-unit">元/预计到手</text>
						</view>
					</view>
					<!-- 竞价 -->
					<view class="item-top"
						v-if="[2].includes(Number(orderDetails.priceWay)) && biddingInfo && biddingInfo.bidStatus !== 6">
						<view class="item-left">
							<text class="pice-num"
								v-if="biddingInfo.bidPrice && setBidStatus">{{ biddingInfo.bidPrice }}</text>
							<text class="pice-unit" v-if="biddingInfo.bidPrice">元/</text>
							<text class="pice-unit">我的报价</text>
						</view>
						<view class="item-right" v-if="biddingInfo && biddingInfo.arrivalPrice">
							<text class="pice-text">{{ biddingInfo.arrivalPrice }}</text>
							<text class="pice-unit">元/预计到手</text>
						</view>
					</view>

					<view class="item-time"
						v-if="[2, 3].includes(Number(orderDetails.priceWay)) && orderDetails.deliveryType !== 1">
						<view class="item-left"
							v-if="orderDetails.bizOrderOffer.bidStatus !== 0 && biddingInfo && biddingInfo.bidStatus !== 6">
							<text class="label">报价时间</text>
							<text>{{ orderDetails.bizOrderOffer.updated }}</text>
						</view>
						<!-- 已沟通待确认,但未报价时显示 -->
						<view class="item-left" v-if="orderDetails.bizOrderOffer.bidStatus == 0">
							<text class="label">暂未报价</text>
						</view>

						<view class="item-right" v-if="paymentScheduleShow" @click="paymentSchedule()">
							<text class="label">查看付款计划</text>
							<image src="/static/images/bottom-icon.png" class="icon-jian"></image>
						</view>
					</view>
					<view class="change-records" v-if="orderDetails.customAlteration">
						<view class="left">
							<text class="num">{{ orderDetails.customAlteration.status == 1 ?
								'-' : '' }}{{ orderDetails.customAlteration.alterationMoney }}</text>
							<text class="other">元/新增变更</text>
						</view>
						<view class="right" @click="getJump('查看变更记录')">
							查看变更记录
							<u-icon name="arrow-right" size="20" color="#C4C4C4"></u-icon>
						</view>
					</view>
					<view class="item-other" v-if="orderDetails.bizOrderOffer.remark">
						<view class="item-title">
							{{ setOfferDesc() }}
						</view>
						<view class="item-desc">
							{{ orderDetails.bizOrderOffer.remark }}
						</view>
					</view>
				</view>
				<!-- 报价清单 -->
				<view class="list-contain" v-if="biddingInfo.groupPrices && biddingInfo.groupPrices.length > 0">
					<quotation-list :list="biddingInfo.groupPrices" :pageType="pageType"
						:orderStatus="orderDetails.orderStatus" :bidStatus="biddingInfo.bidStatus"
						:beforeOrderId="orderDetails.beforeOrderId"
						:spaceMaterialList="orderDetails.bizOrderOffer.groupPrices"> </quotation-list>
				</view>
			</view>

			<!-- 不确认报价 -->
			<view class="no-offer" v-if="pageType == '接单' && biddingInfo && biddingInfo.bidStatus == 8">
				<text class="item-title">不确认报价原因</text>
				<text class="item-time">{{ orderDetails.refreshed }}</text>
				<text class="item-reson">报价不合适，谈一谈重新报价。</text>
			</view>


			<!-- 订单信息，有报价人信息时才显示 -->
			<view class="order-introduction">
				<view class="title">
					订单信息
				</view>
				<view class="item-introduction other-introduction">
					<view class="left">
						<text class="lable">订单编号：</text>
						<text class="value">{{ orderDetails.orderCode }}</text>
					</view>
					<image src="/static/icon/copy.png" class="copy-icon" @click="copy(orderDetails.orderCode)" mode="">
					</image>
				</view>
				<view class="item-introduction">
					<text class="lable">所需工种：</text>
					<text class="value">{{ orderDetails.skillName }}</text>
				</view>
				<view class="item-introduction">
					<text class="lable">装修类型：</text>
					<text class="value">{{ orderDetails.requirementTypeName }}</text>
				</view>
				<view class="item-introduction">
					<text class="lable">发布时间：</text>
					<text class="value">{{ orderDetails.created && orderDetails.created.substring(0, 16) }} <text
							class="lable before-time">{{ orderDetails.beforeTime }}</text> </text>
				</view>
			</view>


			<!-- 底部操作按钮 -->
			<view class="item-bottom-contian">
				<view class="button-all">
					<!-- 更多按钮 -->
					<view v-if="moreButtonList.length > 0 && moreButtonListShow" class="button-more-contain">
						<view class="more-list" v-for="(ev, nums) in moreButtonList" :key="nums"
							@click.stop="getButton(ev.label)">
							{{ ev.label }}
						</view>
					</view>
				</view>

				<!-- 判断当前岗位是否能接单 -->
				<view v-if="checkSkillStatus" class="check-skill-status">
					<text>当前岗位不能接单</text>
				</view>

				<!-- 技能认证 -->
				<view v-if="certificationShow && !checkSkillStatus" @click="getCertification"
					class="certification-contain">
					<text>{{ certificationShowText }}</text>
					<image src="/static/images/jiantou_3.png" mode=""></image>
				</view>
				<view class="item-button-list" :class="setClass"
					v-if="orderDetailsShow && getOperationButton.length > 0">
					<scroll-view :scroll-x="true" class="scroll-X">
						<view v-if="getOperationButton.length == 1" class="button-single">
							<view class="button-single-item" v-for="(item, index) in getOperationButton" :key="index"
								@click="getButton(item.label)">
								{{ item.label }}
							</view>
						</view>
						<view v-else class="button-list"
							:class="getOperationButton.length > 3 ? 'button-list-active' : ''">
							<view v-for="(item, index) in getOperationButton" :key="index"
								:class="[index + 1 == getOperationButton.length ? 'item-button-active' : index == getOperationButton.length - 2 ? 'item-button-border-active' : 'item-button-default']"
								@click.stop="getButton(item.label)">
								{{ item.label }}
								<view v-if="item.label == '查看变更项' && item.num > 0" class="item-num-contain">
									<view class="item-num">{{ item.num }}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<view v-else class="order-details-no-data">
			<mh-empty :title="orderShow ? '加载中~' : '订单被抢了哦~'" />
		</view>


		<!-- 选择师傅弹框 -->
		<modal-new v-model="modalShow" @click="confirm('师傅')" @cancel="modalCancel('师傅')" titleText="确认选择"
			confirmText="确认">
			<view class="modal-label-contain">
				<view class="label">确认选择{{ masterWorker && masterWorker.personInfo.name }}师傅为您服务？</view>
				<view class="label">消息将发送至该人员</view>
			</view>
		</modal-new>

		<!-- 申请换人、投诉、拒绝接单弹窗 -->
		<view class="complaints-contain">
			<sku-popup v-model="showPopup" :title="popupTitle" @clearCur="clearCur" height="55%">
				<view class="content-sku">
					<view class="content-main">
						<scroll-view :scroll-y="true" class="scroll-y">
							<view class="content-main_res_list">
								<view class="content-main_res" @click="radioValue(item, index)"
									v-for="(item, index) in reasonList" :key="index">
									<view class="radio" :class="{ radioSelect: curIndex === index }"></view>
									<view class="reason">{{ item.label }}</view>
								</view>
							</view>
						</scroll-view>
						<textarea class="item-desc-input" placeholder-style="color:#808080" placeholder="请输入补充描述"
							v-model="formData.replaceReason" />
					</view>
					<view class="item-button-contain" @click="confirmSubmit">
						<view class="item-button">
							确认提交
						</view>
					</view>
				</view>
			</sku-popup>
		</view>


		<!-- 认证弹框 -->
		<modal-new :shutDown="true" v-model="certificationShowPrompt" @click="confirm('认证')" @cancel="modalCancel('认证')"
			titleText="温馨提示" cancelText="取消认证" confirmText="去认证">
			<view class="modal-label-contain">
				<view class="label">完成认证后才能接单</view>
				<view class="label">是否去认证？</view>
			</view>
		</modal-new>

		<!-- 取消订单 -->
		<order-cancel-reason :pageType="pageType" :orderId="orderId" :orderOfferId="biddingInfo && biddingInfo.id"
			ref="orderCancelReason" @cancelReason="cancelReason">
		</order-cancel-reason>


		<!-- 付款计划弹框 -->
		<u-popup v-model="paymentSchedulePopup" border-radius="30" height="600" mode="bottom"
			:safe-area-inset-bottom="false" :closeable="true">
			<view class="payment-schedule">
				<view class="tittle">
					付款计划
				</view>
				<view class="list-contain">
					<scroll-view :scroll-y="true" class="scroll-Y">
						<!-- 按比例付款 -->
						<view class="payment-schedule-all"
							v-if="myPayPlan == 2 && paymentScheduleList && paymentScheduleList.length > 0">
							<view class="payment-item" v-for="(item, index) in paymentScheduleList" :key="item.id">
								<view class="item-top">
									<view class="item-left">
										<text>{{ item.templateItemName }}{{ item.ratio * 100 }}%</text>
										<view class="payment-status-default"
											:class="{ 'payment-status-contain-active': item.payStatus == 2 }">
											<text
												class="item-payment-status">{{ item.payStatus == 2 ? '已支付' : '待支付' }}</text>
										</view>
									</view>
									<view class="item-right">
										<text class="payment-price">{{ item.amount }}</text>
										<text class="payment-unit">元</text>
									</view>
								</view>
								<view class="item-bottom">
									<text class="payment-time" v-if="item.payTime">{{ item.payTime }}</text>
									<view @click="toPay(item, '比例')" class="payment-pay-button"
										v-if="item.payStatus !== 2 && orderDetails.orderStatus >= 30">
										催付
									</view>
								</view>
							</view>
						</view>
						<!-- 按工种付款 -->
						<view class="payment-schedule-all"
							v-if="myPayPlan == 1 && paymentGroupPrices && paymentGroupPrices.length > 0">
							<view class="payment-item" v-for="(item, index) in paymentGroupPrices" :key="index">
								<view class="item-top">
									<view class="item-left">
										<text>{{ item.skillName }}</text>
										<view class="payment-status-default"
											:class="{ 'payment-status-contain-active': item.payStatus == 2 }">
											<text
												class="item-payment-status">{{ item.payStatus == 2 ? '已支付' : '待支付' }}</text>
										</view>
									</view>
									<view class="item-right">
										<text class="payment-price">{{ item.totalPrice }}</text>
										<text class="payment-unit">元</text>
									</view>
								</view>
								<view class="item-bottom">
									<text class="payment-time" v-if="item.payTime">{{ item.payTime }}</text>
									<view @click="toPay(item, '工种')" class="payment-pay-button"
										v-if="item.payStatus !== 2 && orderDetails.orderStatus >= 30">
										催付
									</view>
								</view>
							</view>
						</view>
						<!-- <mh-empty v-else title="这里空荡荡哒～" /> -->
					</scroll-view>
				</view>
			</view>
		</u-popup>

		<!-- 联系客户弹框 -->
		<u-popup v-model="contactCustomersShow" border-radius="30" height="320" mode="bottom"
			:safe-area-inset-bottom="false" :closeable="true">
			<view class="contact-customers">
				<view class="tittle">
					选择联系方式
				</view>
				<view class="list-contain">
					<view class="item-contain" v-for="(item, index) in contactCustomersList" :key="index"
						@click="getContactCustomers(item)">
						<image :src="item.url" mode=""></image>
						<text>{{ item.name }}</text>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 已结费用弹框 -->
		<log-pop-up title="查看明细及原因" type="订单详情" :logList="logList" v-model="logShowPopup" @close="logShowPopup = false">
		</log-pop-up>

		<!-- 服务协议弹框 -->
		<service-agreement-popup v-if="serviceAgreementPopupStatus" v-model="serviceAgreementPopupStatus"
			@close="getPopupClose()" @submit="serviceSubmit()" :info="serviceInfo" :typeName="serviceType">
		</service-agreement-popup>

	</view>
</template>

<script>
	/**
	 * 查询订单基本信息使用 order/bidorder/list
	 * 查询报价人信息使用 order/bidorder/xx
	 * **/
	import {
		mapState
	} from 'vuex'
	import customeType from '@/plugins/im/customeType.js'
	import moment from '@/static/js/moment.js'
	import operation from '@/plugins/mathoperation.js'
	import {
		getDistance
	} from "@/plugins/utils.js";
	export default {
		data() {
			return {
				showPopupPay: false,
				showPopup: false,
				curIndex: 0,
				selectActiveIndex: 0,
				openShow: true,
				pageType: '接单',
				pageTitle: '订单详情',
				quotationMasterResultList: [],
				quotationMasterList: [],
				quotationMasterListShow: false,
				quotationMasterListViewShow: false,
				masterWorker: '',
				masterWorkerTitle: '',
				detailsShow: false,
				modalShow: false,
				orderDetails: '',
				orderDetailsData: '',
				orderDetailsShow: false,
				isOnePrice: false, // 是否是一口价
				certificationShow: false,
				certificationShowPrompt: false,
				certificationShowText: '完成实名认证和技能认证后才能接单',
				orderId: '',
				isEditor: true,
				piceUnit: '',
				certificationShowIndex: -1,
				addressShow: false,
				checkedData: [],
				changeRecordsList: [],
				reasonList: [],
				replacementReason: '',
				complaintReason: '',
				formData: {},
				popupTitle: '申请换人原因',
				bidUser: {},
				skillList: [],
				refusalReason: '',
				skillNameList: [],
				workPersonId: '',
				myCraftsman: {
					userInfo: '',
					detailedList: ''
				},
				acceptanceCriteria: {}, // 验收标准
				acceptanceCriteriaShow: false,
				acceptanceRecordList: [],
				moreButtonList: [],
				moreButtonListShow: false,
				userSettingInfo: '',
				paymentSchedulePopup: false,
				paymentScheduleList: [],
				paymentList: [],
				payCurrentGroupPrices: [],
				paymentScheduleShow: false,
				paymentGroupPrices: [],
				myPayPlan: '',
				spaceMaterialList: [],
				currentUser: uni.getStorageSync('userData').sysUser && uni.getStorageSync('userData').sysUser
					.userId, // 当前用户userId
				issuingPartyisAcceptStatus: false,
				contactCustomersShow: false,
				auditStatus: '',
				checkSkillStatus: false,
				orderShow: true,
				communicationsList: [],
				logShowPopup: false,
				logList: [],
				serviceAgreementPopupStatus: false,
				operationButtonName: '',
				serviceInfo: {},
				serviceType: '',
				quotationMasterShow: false,
				contactCustomersList: [{
					name: '拨打电话',
					url: '/static/images/icon-phone/call_6.png'
				}, {
					name: '在线聊天',
					url: '/static/images/icon_im/ej_1.png'
				}],
				defaultCompanyId: uni.getStorageSync('cityOperatorId'),
				// 接单方、发单方操作状态 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受 4=发单方拒绝 5=发单方取消报价 6=接单方取消订单 7=关闭竞价订单 8=接单方不确认报价  
				// 还未沟通  默认为communicateStatus: [0]=>还未沟通  [1]=>已沟通，并愿意接单  [-1]=>已沟通，不愿意接单
				orderButtonList: [{
						label: '联系客户',
						type: '接单',
						signName: '联系客户',
						active: false,
						borderActive: false,
						orderStatus: [10, 15, 20],
						priceWays: [1, 2, 3],
						communicateStatus: [0, 1, -1], // 
						assignTypes: [1, 2],
						bidStatus: [0, 1, 2, 3, 8]
					},
					{
						label: '立即抢单',
						type: '接单',
						active: false,
						borderActive: false,
						orderStatus: [10],
						priceWays: [1, 2, 3],
						communicateStatus: [0],
						assignTypes: [2],
						bidStatus: []
					},
					{
						label: '拒绝接单',
						type: '接单',
						active: false,
						borderActive: false,
						orderStatus: [10],
						priceWays: [1, 3],
						communicateStatus: [0],
						assignTypes: [1],
						bidStatus: [0]
					},
					{
						label: '立即接单',
						type: '接单',
						active: false,
						borderActive: false,
						orderStatus: [10],
						priceWays: [1, 3],
						communicateStatus: [0],
						assignTypes: [1],
						bidStatus: [0]
					},
					{
						label: '开始报价',
						type: '接单',
						signName: '开始报价',
						active: false,
						borderActive: false,
						orderStatus: [15],
						priceWays: [1, 2, 3],
						communicateStatus: [1],
						assignTypes: [1, 2],
						bidStatus: [0]
					},
					{
						label: '取消报价',
						type: '接单',
						signName: '取消报价',
						active: false,
						borderActive: false,
						orderStatus: [10, 15, 20],
						priceWays: [1, 2, 3],
						assignTypes: [1, 2],
						bidStatus: [2, 3],
						communicateStatus: [1, -1]
					},
					{
						label: '取消订单',
						type: '接单',
						signName: '取消订单',
						active: false,
						borderActive: false,
						orderStatus: [15, 20],
						priceWays: [1, 2, 3],
						communicateStatus: [0, 1, -1],
						assignTypes: [1, 2],
						bidStatus: [0, 2]
					},
					{
						label: '沟通确认',
						type: '接单',
						signName: '沟通确认',
						active: false,
						borderActive: false,
						orderStatus: [15],
						priceWays: [1, 2, 3],
						communicateStatus: [0, 1, -1],
						assignTypes: [1, 2],
						bidStatus: [0, 2]
					},
					{
						label: '修改报价',
						type: '接单',
						signName: '修改报价',
						active: false,
						borderActive: false,
						orderStatus: [10, 15, 20],
						priceWays: [2, 3],
						assignTypes: [1, 2],
						bidStatus: [2],
						communicateStatus: [1, -1],
						markName: '已报价'
					},
					{
						label: '沟通确认',
						type: '接单',
						active: true,
						borderActive: false,
						orderStatus: [15],
						priceWays: [1, 2, 3],
						assignTypes: [],
						bidStatus: [],
						communicateStatus: [1, -1],
						markName: '已报价'
					},
					{
						label: '发消息',
						type: '接单',
						active: false,
						borderActive: false,
						orderStatus: [30],
						assignTypes: [1, 2],
						bidStatus: [3],
						priceWays: [1, 2, 3],
						communicateStatus: [0, 1, -1]
					},
					{
						label: '变更价格',
						type: '接单',
						active: false,
						borderActive: false,
						orderStatus: [30],
						assignTypes: [1, 2],
						bidStatus: [3],
						priceWays: [1, 2, 3],
						communicateStatus: [0, 1, -1]
					},
					{
						label: '服务日志',
						type: '接单',
						active: false,
						borderActive: false,
						orderStatus: [30, 35, 40, 50, 51],
						assignTypes: [1, 2],
						priceWays: [1, 2, 3],
						bidStatus: [3],
						communicateStatus: [0, 1, -1]
					},
					{
						label: '打卡',
						type: '接单',
						active: false,
						borderActive: true,
						orderStatus: [30],
						assignTypes: [1, 2],
						bidStatus: [3],
						priceWays: [1, 2, 3],
						communicateStatus: [0, 1, -1]
					},
					{
						label: '开始服务',
						type: '接单',
						active: true,
						borderActive: true,
						orderStatus: [30],
						assignTypes: [1, 2],
						bidStatus: [3],
						priceWays: [1, 2, 3],
						signName: '开始服务',
						communicateStatus: [0, 1, -1]
					},
					{
						label: '提交验收',
						type: '接单',
						active: true,
						borderActive: false,
						orderStatus: [30],
						assignTypes: [1, 2],
						bidStatus: [3],
						priceWays: [1, 2, 3],
						signName: '提交验收',
						communicateStatus: [0, 1, -1]
					},
					{
						label: '风险提示',
						type: '接单',
						signName: '风险提示',
						active: false,
						borderActive: false,
						orderStatus: [20, 30, 35],
						priceWays: [1, 2, 3],
						assignTypes: [1, 2],
						bidStatus: [3],
						communicateStatus: [0, 1, -1]
					},
					{
						label: '联系客服',
						type: '接单',
						active: false,
						borderActive: true,
						orderStatus: [35, 50],
						assignTypes: [1, 2],
						bidStatus: [3],
						priceWays: [1, 2, 3],
						communicateStatus: [0, 1, -1]
					},
					{
						label: '重新报价',
						type: '接单',
						signName: '重新报价',
						active: false,
						borderActive: false,
						orderStatus: [15],
						priceWays: [1, 2, 3],
						communicateStatus: [0, 1],
						assignTypes: [2],
						bidStatus: [8]
					},
				],
				titleList: [{
						label: '待抢单',
						status: 10
					},
					{
						label: '待沟通',
						status: 15,
					},
					{
						label: '等待用户付款',
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
				resutlDistance: '',
				titleTypeList: [{
						label: '订单信息',
						value: 1
					},
					{
						label: '报价师傅',
						value: 2
					}
				]
			}
		},
		computed: {
			...mapState(['skillId', 'serviceGoodsList', 'serviceCityOperatorId', 'offerDetails']),
			/**
			 * @param orderStatus 订单状态: 10=已发布/待确认； 15已报价待确认,  20=已确认/待付款；30=已付款/服务中；35=已申请/待验收；40=待结算；50=已完成/待评价；51=已完成/已评价；-1=已取消
			 * @param bidStatus: 接单方、发单方操作状态 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受 4=发单方拒绝 5=发单方取消报价 6=接单方取消订单 7=关闭竞价订单 8=接单方不确认报价  
			 * @param assignType 1=指派(指派模式下只有 议价，一口价 ) 2=抢单(一口价、竞价、议价)
			 * @param priceWay c端快速呼叫 相当于议价  定价方式: 1=一口价；2-竞价 3=议价
			 * @param source 订单来源 1个人(c端) 2服务者(B端) 3企业 4平台  5案例
			 * */
			getOperationButton() {

				// 报价人员列表接口查询成功之后才执行，避免底部按钮闪烁
				if (!this.quotationMasterShow) {
					return []
				}
				this.getIsEditor()
				let bizOrderOffer = this.biddingInfo

				// 1.订单取消( 接单方拒绝接单、发单方取消订单)
				if (this.orderDetails.orderStatus == -1) {
					return []
				}
				// 接单方取消报价，取消订单
				if (bizOrderOffer) {
					if ([4, 6].includes(Number(bizOrderOffer.bidStatus))) {
						return []
					}
				}
				// 2.从消息列表进入时，订单为sop交付，接单方已接受
				if (this.issuingPartyisAcceptStatus) {
					return []
				}

				// 3.根据接单方、发单方进行筛选
				// let resultList = this.orderButtonList.filter(item => item.type == this.pageType)
				let resultList = this.orderButtonList

				// 4.根据订单模式筛选
				resultList = this.filterByPriceWay(resultList, this.orderDetails.priceWay)

				// 5.根据是否指派进行筛选
				resultList = this.filterByAssignType(resultList, this.orderDetails.assignType)
				//特殊处理  6.对订单模式为一口价、上门开单，且订单状态为15(已沟通，待确认)的单子进行筛选,不显示取消报价
				if (this.orderDetails.orderStatus == 15) {
					if (this.orderDetails.priceWay == 1) {
						resultList = this.filterBySignName(resultList, '取消报价')
					} else if (this.orderDetails.priceWay == 3) {
						// 如果接单方已报价，则不允许取消订单
						if (bizOrderOffer && bizOrderOffer.bidStatus == 2) {
							resultList = this.filterBySignName(resultList, '取消订单')
						}
						// 若 上门开单 的工种配置了sop交付，则不显示开始报价按钮
						if (this.orderDetails.deliveryType) {
							resultList = this.filterBySignName(resultList, '开始报价')
						}
					}
				}

				// 7.根据报价状态进行筛选
				if (bizOrderOffer) {
					resultList = resultList.filter(item => item.bidStatus.includes(bizOrderOffer.bidStatus))
				} else {
					// 7.1还未报价
					// 7.2特殊处理联系客户按钮
					if (this.orderDetails.priceWay == 3) {
						resultList = resultList.filter(item => item.bidStatus.length == 0)
					} else if (this.orderDetails.priceWay == 1) {
						resultList = resultList.filter(item => item.bidStatus.length == 0 || item.signName == '联系客户')
					}
				}
				// 8.根据是否沟通进行筛选
				// resultList = this.filterByCommunicateStatus(resultList, this.communicationsList)
				if (this.communicationsList.length > 0) {
					// intention ==》沟通意向（1愿意接单，0不是平台单，-1个人弃单）
					let itemCommunications = this.communicationsList[0]
					if ([0, -1].includes(itemCommunications.intention)) {
						resultList = resultList.filter(item => item.communicateStatus.includes(-1))
					}
				} else {
					// 还未沟通
					resultList = resultList.filter(item => item.communicateStatus.includes(0))
				}

				// 9.根据订单状态筛选
				console.log('resultList', resultList)
				resultList = this.filterByOrderStatus(resultList, this.orderDetails.orderStatus)
				// resultList = resultList.filter(item => item.orderStatus.includes(Number(this.orderDetails.orderStatus)))

				// 填写服务日志(显示 开始服务、提交验收按钮 )
				if (this.orderDetails.workStatus) {
					// workStatus 	是否开工 0未开工，1开工
					resultList = resultList.filter(item => item.label !== '开始服务')
				} else {
					resultList = resultList.filter(item => item.label !== '提交验收')
				}
				resultList = this.getMoreButton(resultList)
				// console.log('resultList', resultList)
				return resultList
			},
			setTitle() {
				// 2.0
				let resultName = '',
					bizOrderOffer = this.biddingInfo,
					tempBidUserId = this.biddingInfo && this.biddingInfo.bidUserId,
					tempUser = this.currentUser
				if (!this.orderShow) {
					resultName = '订单被抢了哦~'
				}

				if (bizOrderOffer && [4, 6].includes(Number(bizOrderOffer.bidStatus)) && tempBidUserId == this
					.currentUser) {
					return '订单已取消'
				}
				if (this.orderDetails.orderStatus == 15 && bizOrderOffer) {
					if (this.communicationsList.length > 0) {
						if (this.orderDetails.priceWay == 1) {
							if (this.orderDetails.assignType == 2 && bizOrderOffer.bidStatus == 2) {
								resultName = '已沟通-待确认'
							}
						} else {
							// 指派，上门开单，已报价
							if ([1, 2].includes(this.orderDetails.assignType) && bizOrderOffer.bidStatus == 2) {
								resultName = '已报价-待确认'
							} else {
								resultName = this.orderDetails.deliveryType == 1 ? '已沟通-待确认' : '已沟通-待报价'
							}
						}
						if (bizOrderOffer.bidStatus == 8) { // 发单方不确认报价
							resultName = '已报价-客户不确认报价'
						}
					} else {
						if (bizOrderOffer.bidStatus == 0) {
							resultName = '待沟通'
						}
						if (this.orderDetails.priceWay == 1 && this.orderDetails.assignType == 2 && bizOrderOffer
							.bidStatus ==
							2) {
							resultName = '待确认'
						}
					}
				} else {
					let tempLabel = this.titleList.find(item => item.status == this.orderDetails.orderStatus)
					if (tempLabel) {
						resultName = tempLabel.label
					}
					if (this.orderDetails.assignType == 1) {
						if (this.orderDetails.orderStatus == 10) {
							resultName = '待接单'
						}
					}
				}
				return resultName
			},
			selectUser() {
				if (this.pageType == '接单') {
					if (this.orderDetails.orderStatus == 15) {
						return true
					} else {
						return false
					}
				} else {
					if (this.orderDetails.priceWay == 2) {
						if (this.orderDetails.orderStatus == 10) {
							return true
						} else {
							return false
						}
					} else {
						if (this.orderDetails.orderStatus == 15) {
							return true
						} else {
							return false
						}
					}
				}
			},
			setQuotationMasterTitle() {
				let temp = {
					text: '',
					status: 0,
				}
				if (this.quotationMasterResultList.length > 0) {
					if ([10, 15, 20].indexOf(this.orderDetails.orderStatus) !== -1) {
						if (this.orderDetails.priceWay == 2) {
							if (this.orderDetails.orderStatus == 10) {
								temp.text = `已有${this.quotationMasterResultList.length}位师傅报价`
							} else {
								temp.text = `申请换人接单`
							}
						} else {
							if (this.orderDetails.orderStatus == 15) {
								temp.text = `已有${this.quotationMasterResultList.length}位师傅报价`
							} else {
								temp.text = `申请换人接单`
							}
						}
					} else {
						temp.status = 1
						temp.text = `投诉`
					}
				} else {
					temp.text = `等待师傅报价`
				}
				return temp
			},
			setPiceUnit() {
				switch (Number(this.orderDetails.priceWay)) {
					case 1:
						return '一口价'
					case 3:
						return '上门报价'
				}
			},
			setOrderPrice() {
				switch (Number(this.orderDetails.priceWay)) {
					case 1: // 一口价
						return this.orderDetails.price
					case 3: // 上门报价
						if (this.orderDetails.orderStatus >= 30) {
							return this.biddingInfo && this.biddingInfo.bidPrice || ''
						} else {
							return ''
						}
				}
			},
			setOrderModer() {
				switch (Number(this.orderDetails.priceWay)) {
					case 1:
						return '一口价'
					case 3:
						return '上门报价'
				}
			},
			setMoney() {
				switch (Number(this.orderDetails.priceWay)) {
					case 1:
						return this.orderDetails.price
					case 2:
						if (this.quotationMasterResultList.length > 0) {
							return this.quotationMasterResultList[0].bidPrice
						}
						case 3:
							if (this.quotationMasterResultList.length > 0) {
								return this.quotationMasterResultList[0].bidPrice
							}
				}
			},
			isSender() {
				let tempUser = this.currentUser
				if (tempUser) {
					if (this.orderDetails.userId == tempUser) {
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			},
			/**
			 * @description 当前人员是否是接单方
			 */
			setCurrentUserStatus() {
				let currentUser = this.quotationMasterResultList.find(el => el.bidUserId == this.currentUser)
				if (currentUser) {
					if (this.orderDetails.priceWay == 2) {
						if (currentUser.bidStatus == 0) {
							return false
						}
					}
					return true
				} else {
					return false
				}
			},
			/**
			 * @description 返回当前人员报价信息
			 */
			biddingInfo() {
				return this.quotationMasterResultList.find(el => el.bidUserId == this.currentUser)
			},
			setSourceType() {
				switch (this.orderDetails.source) {
					case 1:
						return '个人发布'
					case 2:
						return '服务者发布'
					case 3:
						return '企业发布'
					case 4:
						return '平台发布'
				}
			},
			setBidStatus() {
				// 议价、竞价模式
				//bidStatus:  接单方、发单方操作状态 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受 4=发单方拒绝 5=发单方取消报价 6=接单放取消订单 7=关闭竞价订单
				if (this.orderDetails.bizOrderOffer) {
					if (this.orderDetails.bizOrderOffer.bidStatus >= 2) {
						return true
					}
				} else {
					return false
				}

			},
			setRequirementName() {
				let tempRequirementName = this.orderDetails.requirementName
				let resultName = ''
				if (tempRequirementName) {
					if (tempRequirementName.indexOf('null') !== -1) {
						if (this.orderDetails) {
							resultName =
								`${this.orderDetails && this.orderDetails.poiName}需要${this.orderDetails.requirementTypeName}${this.orderDetails.skillName}`
						}
					} else {
						resultName = tempRequirementName
					}
				} else {
					if (this.orderDetails) {
						resultName =
							`${this.orderDetails && this.orderDetails.poiName}需要${this.orderDetails.requirementTypeName}${this.orderDetails.skillName}`
					}
				}
				if (resultName.indexOf('null') !== -1) {
					resultName = resultName.replace('null', '')
				}
				return resultName
			},
			/**
			 * @description 组合报价信息
			 * 
			 * */
			setGroupPrices() {
				let tempResult = this.quotationMasterList.find(item => item.bidUserId == this.currentUser)
				if (tempResult) {
					return tempResult.groupPrices
				} else {
					return []
				}
			},
			setClass() {
				// #ifdef H5
				return 'item-button-list-android'
				// #endif
				// #ifdef APP-PLUS
				let platform = uni.getSystemInfoSync().platform
				return platform == 'android' ? 'item-button-list-android' : ''
				// #endif
			},
			/**
			 * @description 已结费用总计
			 */
			logListAmount() {
				let tempPice = this.logList.map(item => {
					return item.preAcceptanceAmount
				})
				let result = operation.funCalc(tempPice)
				return result
			},

		},
		onLoad(option) {
			this.option = option
			this.getSkillNameList()
		},
		onShow() {
			this.getDetails()

		},
		onUnload() {
			// 清空组合报价
			if (this.serviceGoodsList.length > 0) {
				this.$store.commit('setServiceGoodsList', [])
			}
			// 在退出订单详情时清除serviceCityOperatorId
			if (this.serviceCityOperatorId) {
				this.$store.commit('setServiceCityOperatorId', '')
			}
			// 清空报价id
			if (this.offerDetails.offerId) {
				this.$store.commit('seOfferDetails', {})
			}

			uni.setStorageSync('resutlDistance', '')
		},
		methods: {
			/**
			 * @description 根据订单状态筛选
			 * */
			filterByOrderStatus(buttonList, orderStatus) {
				if (orderStatus == -1) {
					return [];
				}
				return buttonList.filter(item => item.orderStatus.includes(Number(orderStatus)));
			},
			/**
			 * @description 根据是否沟通进行筛选
			 * */
			filterByCommunicateStatus(buttonList, communicationsList) {
				if (communicationsList.length > 0) {
					let itemCommunications = communicationsList[0]
					if ([0, -1].includes(itemCommunications.intention)) {
						return buttonList.filter(item => item.communicateStatus.includes(-1))
					}
				} else {
					return buttonList.filter(item => item.communicateStatus.includes(0))
				}
			},
			/**
			 * @description 根据订单模式筛选
			 * */
			filterByPriceWay(buttonList, priceWay) {
				return buttonList.filter(item => item.priceWays.includes(Number(priceWay)));
			},
			/**
			 * @description 根据是否指派进行筛选
			 * */
			filterByAssignType(buttonList, assignType) {
				return buttonList.filter(item => item.assignTypes.includes(Number(assignType)));
			},
			filterBySignName(buttonList, signName) {
				return buttonList.filter(item => item.signName !== signName);
			},
			/**
			 * @description 填写服务日志(显示 开始服务、提交验收按钮 )
			 * */
			filterByWorkStatus(buttonList, workStatus) {
				if (workStatus) {
					return buttonList.filter(item => item.workStatus == 1);
				}
				return buttonList.filter(item => item.label !== '提交验收');
			},
			/**
			 * @description 判断是否可编辑
			 * */
			getIsEditor() {
				if (this.orderDetails.priceWay == 2) {
					// 如果有人报价，则不允许修改订单了
					if (this.quotationMasterList.length > 0) {
						this.isEditor = false
					} else {
						this.isEditor = true
					}
				} else {
					// 判断是否可以编辑单据
					if (this.orderDetails.orderStatus !== 10) {
						this.isEditor = false
					} else {
						this.isEditor = true
					}
					// 如果是子订单，暂时不允许编辑
					if (this.orderDetails.source == 4) {
						this.isEditor = false
					}
				}
			},
			/**
			 * @description 更多按钮设置
			 * 1.底部按钮超过4个时，显示更多
			 * 2.orderStatus为30=已付款/服务中，并且当前用户为接单方时，按钮有6个
			 * 3.暂时使用自定义的方式来添加 更多里的选项(发消息、变更价格、风险提示)
			 */
			getMoreButton(list) {
				this.moreButtonList = []
				if (list.length > 4) {
					list.forEach(el => {
						if (['发消息', '变更价格', '风险提示'].includes(el.label)) {
							this.moreButtonList.push(el)
						}
					})
					list.unshift({
						label: '更多',
						type: '接单',
						active: false,
						orderStatus: [30, 35],
						borderActive: false
					})
					list = list.filter(item => !['发消息', '变更价格', '风险提示'].includes(item.label))
					return list
				} else {
					return list
				}
			},
			goBackPage() {
				let pages = getCurrentPages()
				let lastPage = pages[pages.length - 2].route
				if (lastPage === 'pages/publishTask/IssueOrder' || lastPage === 'pages/publishTask/orderRelease') {
					uni.navigateBack({
						delta: 2
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			setOfferDesc() {
				if (this.biddingInfo) {
					if (this.biddingInfo.bidStatus == 6) {
						return '取消原因'
					} else {
						return '报价说明'
					}
				}
			},
			getDetails() { // 获取订单信息
				if (!this.option.id) {
					return
				}
				this.$httpApi.getOrderById(this.option.id).then(res => {
					if (!res) {
						return
					}
					// #见tfs 29900  没有发单方角色了
					this.pageType = '接单'
					// if (this.currentUser == res.userId) {
					// 	this.pageType = '接单'
					// } else {
					// 	this.pageType = '接单'
					// }
					// TODO priceWay = 3 定价方式: 1=一口价；2-竞价 3=议价、快速找人
					if (res.priceWay === 1) {
						// 如果订单价格模式是一口价, 则报价不允许修改报价
						this.isOnePrice = true

					} else if (res.priceWay === 3) {
						// 快速呼叫师傅抢单之后，在报价
						if (res.bizOrderOffer && res.bizOrderOffer.id) {
							// 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受 4=发单方拒绝 5=发单方取消报价 6=接单放取消订单 7=关闭竞价订单
							if (res.bizOrderOffer.bidStatus == 0) {
								this.isOnePrice = false
							} else if (res.bizOrderOffer.bidStatus == 2) {
								// this.isOnePrice = true
								// this.piceUnit = '修改报价'
							}
						} else {
							// 快速呼叫，师傅第一次抢单
							this.isOnePrice = true
						}
					} else {
						// 竞价模式/快速找人模式, 允许自行报价和修改报价
						this.isOnePrice = false
					}
					let tempAttachments = res.attachments && res.attachments !== '' && JSON.parse(res.attachments)
					if (tempAttachments && tempAttachments.length > 0) {
						res['imageList'] = JSON.stringify(tempAttachments.filter(item => item.type == 'img' || item
							.type == 'video'))
						if (tempAttachments.length > 0) {
							tempAttachments.map(item => {
								if (item.timeLength) {
									res['voice'] = item
								}
							})
						}
					}

					res['beforeTime'] = moment(res.created).startOf('minute').fromNow()

					this.orderDetails = res
					this.orderDetailsData = res

					
					this.conversionUnit()
					// 抢单之后才显现完整的地址
					if (this.orderDetails.orderStatus >= 20) {
						this.addressShow = true
					} else {
						this.addressShow = false
					}

					// 判断页面数据是否请求完成	
					this.orderDetailsShow = true
					if (this.pageType == '发单') {
						this.getChangeRecords()
					} else {
						this.setCertificationShow()
						this.setSkill()
					}
					this.getCheckedData()
					// this.setOrderShow()
					this.getBidOrderList()
					this.getProjectCancelOrderInfo()

				})
			},

			getBidOrderList() { // 获取已报价人员
				this.$httpApi.getOfferPeopleList({
					orderId: this.option.id
				}).then(res => {
					if (res) {
						res.offerList.map(item => {
							if (item.groupPrices && item.groupPrices.length > 0) {
								item.groupPrices.map(el => {
									el['productJsonList'] = el.productJson && JSON.parse(el
										.productJson)
								})
							}
						})
						// res.offerList = res.offerList.filter(item => [4, 6].indexOf(item.bidStatus) == -1)
						this.quotationMasterResultList = res.offerList
						this.quotationMasterShow = true

						if (res.offerList.length > 0) {
							if (this.quotationMasterResultList.length > 3) {
								this.quotationMasterList = this.quotationMasterResultList.slice(0, 3)
								this.quotationMasterListShow = false
								this.quotationMasterListViewShow = true
							} else {
								this.quotationMasterListViewShow = false
								this.quotationMasterList = res.offerList
							}
						} else {
							this.quotationMasterListViewShow = false
							this.quotationMasterList = []
						}
						// 分期支付、按工种付款
						let tempPaymentScheduleList = res.offerList.find(item => item.bidUserId == this
							.currentUser)
						if (tempPaymentScheduleList) {
							if (tempPaymentScheduleList.payPlan) {
								// 分期付款
								this.paymentScheduleList = tempPaymentScheduleList.ratioPrices
								// 按工种付款
								this.paymentGroupPrices = tempPaymentScheduleList.groupPrices
								this.myPayPlan = tempPaymentScheduleList.payPlan

								// 是否显示查看付款计划
								// 如果选择了按工种付款，但未选择服务，则不显示查看付款计划
								if (this.myPayPlan == 1 && !this.paymentGroupPrices) {
									this.paymentScheduleShow = false
								} else {
									this.paymentScheduleShow = true
								}
							}
							// 沟通记录
							if (tempPaymentScheduleList.communications) {
								this.communicationsList = tempPaymentScheduleList.communications.splice(0, 1)
								this.communicationsList.forEach(el => {
									if (el.annex) {
										el['annexImage'] = JSON.stringify(JSON.parse(el.annex).filter(
											item => item.type == 'img' || item.type == 'video'))
										el['annexAudio'] = JSON.parse(el.annex).find(item => item.type ==
											'audio')
									}
								})
							}
						}
						this.issuingPartyisAccept()
						this.setOrderShow()
					}
				})
			},
			/**
			 * @description 订单当前状态
			 */
			setOrderShow() {
				if (this.orderDetailsData.orderStatus >= 20) {
					// setTimeout(() => {
					let tempUserId = []
					tempUserId.push(Number(this.orderDetails.userId))
					this.quotationMasterResultList.forEach(el => {
						tempUserId.push(Number(el.bidUserId))
					})
					if (tempUserId.includes(Number(this.currentUser))) {
						this.orderShow = true
						this.orderDetails = this.orderDetailsData
					} else {
						this.orderDetails = ''
						this.orderShow = false
					}
					// }, 200)
				}
			},
			/**
			 * @description 验收资料
			 */
			getCheckedData() {
				this.$http.get("order/customer/bizorderacceptance/getByOrderId", {
					orderId: this.orderDetails.id
				}).then(res => {
					if (res) {
						this.checkedData = res
					}
				})
			},

			/**
			 * @description 已结费用日志
			 */
			getProjectCancelOrderInfo() {
				if (!this.option.id) {
					return
				}
				this.$httpApi.getProjectCancelOrderInfo({
					orderId: this.option.id,
				}).then(res => {
					if (res) {
						this.logList = res
					}
				})
			},
			getCost() {
				this.logShowPopup = true
			},
			/**
			 * @description 变更项查询
			 */
			getChangeRecords() {
				this.$httpApi.selectChangeList({
					orderCode: this.orderDetails.orderCode,
					size: 99,
					orderId: this.orderDetails.id
				}).then(res => {
					if (res) {
						this.changeRecordsList = res.records.filter(item => item.payStatus == 0)
						this.orderButtonList.map(item => {
							if (item.label == '查看变更') {
								item.num = this.changeRecordsList.length
							}
						})
					}
				})
			},
			setCertificationShow() {
				// 如果是直接指派的
				if (this.orderDetails.assignType == 1) {
					// 判断被指派这个人是否以实名认证
					this.$httpApi.getUserInfo().then(res => {
						if (res) {
							if (res.sysUser.userauthFlag == 0 && this.orderDetails.assignType !== 1) {
								this.certificationShow = true
								this.certificationShowText = '完成实名认证才能接单'
								this.certificationShowIndex = 0
							}
						}
					})
					return
				}
				if (this.orderDetails.orderStatus >= 30) {
					return
				}
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						let tempSkillId = ''
						this.userSettingInfo = res
						if (res.personageList.length > 0) {
							let user = res.personageList.find(item => item.skillId == this.orderDetails.skillId)
							if (user) {
								tempSkillId = user.skillId
							} else {
								tempSkillId = this.orderDetails.skillId
							}
						} else {
							tempSkillId = this.orderDetails.skillId
						}

						// -1 = 禁止接单
						//  0 = 可以接单
						//  1 = 未做实名认证
						//  2 = 未做技能认证
						//  3 = 技能认证已申请
						//  4 = 技能认证未通过

						this.$httpApi.getCertification({
							skillId: tempSkillId,
							orderId: this.orderDetails.id
						}).then(res => {
							if (res) {
								switch (res) {
									case -1: // 禁止接单
										this.checkSkillStatus = true
										break
									case 0: // 可以接单
										this.checkSkillStatus = false
										break
									case 1:
										this.certificationShow = true
										this.certificationShowText = '完成实名认证才能接单'
										this.certificationShowIndex = 0
										break
									case 2:
										this.certificationShow = true
										this.certificationShowText =
											`完成${this.orderDetails.skillName || ''}技能认证才能接单`
										this.certificationShowIndex = 1
										break
									case 3:
										this.certificationShowText =
											`${this.orderDetails.skillName || ''}等待审核`
										this.certificationShow = true
										this.certificationShowIndex = 3
										break
									case 4:
										this.certificationShow = true
										this.certificationShowText =
											`完成${this.orderDetails.skillName || ''}技能认证才能接单`
										this.certificationShowIndex = 1
										break
								}
							}
						})
					}
				})
			},
			copy(data) {
				uni.setClipboardData({
					data,
					success: () => { // 复制成功的回调函数
						this.$util.toast("复制成功");
					}
				});
			},
			setSkill() {
				this.$httpApi.getWorkType({
					type: 2, // 工人
					clientType: 'platform',
					size: 99
				}).then(res => {
					if (res) {
						this.skillList = res.records
					}
				})
			},
			getSkillNameList() {
				this.$httpApi.getWorkType({
					clientType: 'platform',
					size: 99
				}).then(res => {
					if (res) {
						this.skillNameList = res.records
					}
				})
			},
			getCertification() {
				if (this.certificationShowIndex !== -1) {
					switch (this.certificationShowIndex) {
						case 0:
							this.toPage("/pages/user/realName")
							break;
						case 1:
							this.$httpApi.getPersonSettingInfo().then(res => {
								if (res) {
									uni.setStorageSync('userSetting', res);
									let tempJobCode = this.skillNameList.find(item => item.skillId == this
										.orderDetails.skillId)
									if (tempJobCode) {
										if (tempJobCode.jobCode == 'JOB_WORKER') {
											tempJobCode['tempSkillName'] = '工人'
										} else {
											tempJobCode['tempSkillName'] = tempJobCode.skillName
										}
										if (this.auditStatus == -1) {
											this.toPage(
												`/pages/certification/information?jobCode=${tempJobCode.jobCode}&name=${tempJobCode.tempSkillName}&skillId=${tempJobCode.skillId}&skillName=${tempJobCode.skillName}`
											)
										} else {
											this.toPage('/pages/setting/skillCertification/skillCertificationPage')
										}
									} else {
										this.$util.toast("该工种不是平台工种,不支持技能认证");
									}
								}
							})
							break;
						case 2:
							this.toPage('/pages/user/realName')
							break
						case 3:
							this.toPage('/pages/setting/skillCertification/skillCertificationPage')
							break
					}
				}
			},
			getOpen() {
				this.openShow = !this.openShow
			},
			getShare() {
				let miniProgramType = process.env.NODE_ENV === 'production' ? 0 : 1
				uni.share({
					provider: 'weixin',
					scene: "WXSceneSession",
					type: 5, // 微信小程序
					imageUrl: '',
					title: '我给你分享了一个订单, 有钱一起赚~',
					miniProgram: {
						id: 'gh_b091d7f9d23e', // 服务端小程序原始id
						path: `pages-order/orderReceiving/orderReceiving?sharedOrderId=${this.option.id}`, // 分享到小程序的页面
						type: miniProgramType, // 0-正式版； 1-测试版； 2-体验版
						webUrl: 'https://www.51mihuo.com/' // 兼容低版本的网页链接
					},
					success: res => {
						this.$util.toast('分享成功~')
					},
				});
			},
			getNavigation() {
				uni.openLocation({
					latitude: this.orderDetails.latitude,
					longitude: this.orderDetails.longitude
				})
			},
			getJump(typeName) {
				switch (typeName) {
					case '查看变更记录':
						this.toPage(
							`/pages/orderReceiving/changeRecords?orderCode=${this.orderDetails.orderCode}&pageType=接单&companyId=${this.defaultCompanyId}&orderId=${this.orderDetails.id}`
						)
						break;
					case '编辑单据':
						this.toPage(
							`/pages/publishTask/IssueOrder?type=update&id=${this.option.id}&configStatus=${this.orderDetails.configStatus}&source=${this.orderDetails.source}`
						)
						break
				}

			},
			getQuotationMasterTitle(type) {
				if (this.quotationMasterList.length > 0) {
					if (['申请换人接单', '投诉'].includes(type)) {
						const tempReason = type === '投诉' ? 'complaint_reason' : 'change_person_reason'
						this.popupTitle = type === '投诉' ? '投诉师傅' : '申请换人原因'
						this.$http.get("admin/dict/type", {
							type: tempReason,
							companyId: this.defaultCompanyId
						}).then(res => {
							if (res) {
								this.reasonList = res
								if (res.length > 0) {
									this.replacementReason = this.reasonList[this.curIndex].label
									this.complaintReason = this.reasonList[this.curIndex].label
									this.formData.replaceReason = this.reasonList[this.curIndex].label
								}
								this.showPopup = true
							}
						})
					}
				}
			},
			getRefusal() {
				this.popupTitle = '拒单原因'
				this.showPopup = true
				this.$http.get("admin/dict/type", {
					type: 'reasons_for_refusal',
					companyId: this.defaultCompanyId
				}).then(res => {
					if (res) {
						this.reasonList = res
						if (res.length > 0) {
							this.refusalReason = this.reasonList[this.curIndex].label
							this.formData.replaceReason = this.reasonList[this.curIndex].label
						}
					}
				})
			},
			confirmSubmit() {
				if (this.popupTitle == '申请换人原因') {
					//待确认可以更换师傅
					this.formData.offerId = this.quotationMasterResultList[0].id;
					if ((this.curIndex == this.reasonList.length - 1) && !this.formData.replaceReason) {
						this.$util.toast("请填写其他原因")
						return false
					}
					if (!this.formData.replaceReason) {
						this.$util.toast("请选择更换原因")
						return false
					}
					this.$http.post('order/biz_order/publisher/replacePerson', this.formData)
						.then(res => {
							if (res) {
								this.$util.toast("更换成功");
								this.$emit('refresh')
								this.showPopup = false;
								this.getBidOrderList()
								this.getDetails()
							} else {
								this.$util.toast()
							}
						})
				} else if (this.popupTitle == '拒单原因') {
					if (!this.formData.replaceReason) {
						this.$util.toast("请选择或输入拒单原因")
						return false
					}
					this.$httpApi.setReject({
						orderId: this.orderDetails.id,
						reason: this.formData.replaceReason,
					}).then(res => {
						if (res) {
							this.getDetails()
							this.showPopup = false
							this.$util.toast('操作成功')
						}
					})
				} else {
					//投诉
					let param = {
						businessType: "order",
						businessCode: this.orderDetails.id,
						reason: this.complaintReason,
						remark: this.remark,
						toName: this.quotationMasterResultList[0].personInfo.name,
						toUserId: this.quotationMasterResultList[0].personInfo.userId
					}
					this.$http.post("order/bizcomplaint", param).then(res => {
						if (res) {
							this.$util.toast('已提交投诉')
							this.getDetails()
							this.remark = ''
							this.showPopup = false
						}
					})
				}
			},
			clearCur() {
				this.curIndex = 0
			},
			radioValue(data, index) {
				this.replacementReason = data.label;
				this.complaintReason = data.label;
				this.refusalReason = data.label;
				this.curIndex = index;
				// 换人接单操作
				this.formData.replaceReason = data.label
				this.curIndex = index;
				// 判断段其他原因清空
				if (this.curIndex == this.reasonList.length - 1) {
					// this.formData.replaceReason = ''
				}
			},
			confirm(type) {
				if (type == '认证') {
					this.certificationShowPrompt = !this.certificationShowPrompt
					this.getCertification()
				} else {
					// this.modalShow = !this.modalShow
					this.$httpApi.assignByOfferId(this.masterWorker.id).then(res => {
						if (res) {
							uni.hideLoading()
							this.$util.toast('选择成功~')
							this.getBidOrderList()
							this.getDetails()
						}
					})
				}
			},
			modalCancel(type) {
				if (type == '认证') {
					this.certificationShowPrompt = !this.certificationShowPrompt
				} else {
					this.modalShow = !this.modalShow
				}
			},
			cancelReason() {
				this.getDetails()
				this.getBidOrderList()
			},

			getMoreShow() {
				this.moreButtonListShow = false
			},
			getOperation(typeName) {
				const dataObj = {
					bidPrice: parseFloat(this.orderDetails.price),
					orderId: this.option.id,
					isStartDate: 0,
					payPlan: 0
				};
				this.$httpApi.addOrderOfferPrice(dataObj).then(data => {
					if (data) {
						uni.hideLoading()
						this.getDetails()
						this.getBidOrderList()
						this.$util.toast(`${typeName}～`)
					}
				}).catch(e => {
					// 提示要求技能认证
					this.$util.toast(e.errMsg)
				});
			},
			getButton(typeName) {
				if (this.orderDetails.orderStatus < 30) {
					if (this.checkSkillStatus) {
						this.$util.toast(`当前岗位不能接单～`)
						return
					}

					if (this.certificationShowIndex == 3) {
						this.$util.toast(`${this.orderDetails.skillName || ''}等待审核~`)
						return
					}

					// 如果是指派的，则不做技能认证校验，只需要做实名认证
					if (this.certificationShow) {
						this.certificationShowPrompt = !this.certificationShowPrompt
						return
					}
				}

				// 快速呼叫模式   立即抢单 =》开始报价 =》修改报价
				// 竞价模式   参与竞价 =》开始报价
				// 一口价模式  立即抢单 =》取消报价

				this.operationButtonName = typeName

				this.debounce(() => {
					switch (typeName) {
						case '更多':
							this.moreButtonListShow = !this.moreButtonListShow
							break
						case '立即抢单':
							this.getServiceAgreement()
							return
							// 一口价抢单之后，不能在报价
							if (this.orderDetails.bizOrderOffer && this.orderDetails.priceWay == 1 && this
								.orderDetails.bidStatus == 0) {
								// 已经报过价
								this.$util.toast('你已经报过价了，请耐心等待')
							} else {
								// 首次报价, 一口价
								this.getOperation('抢单成功')
							}
							break;
						case '参与竞价':
							// TODO priceWay = 3 定价方式: 1=一口价；2-竞价 3=议价、快速找人
							this.getOperation('操作成功，请尽快报价')
							break;
						case '取消报价':
							if (this.orderDetails.bizOrderOffer && this.orderDetails.bizOrderOffer.id) {
								this.$httpApi.getCancelOrderOffer({
									id: this.orderDetails.bizOrderOffer.id
								}).then(res => {
									if (res) {
										uni.hideLoading()
										uni.showToast({
											title: '操作成功~',
											icon: 'none'
										});
										this.getDetails()
										this.getBidOrderList()
									}
								})
							}
							break;
						case '开始报价':
							let formData
							if (this.orderDetails.priceWay == 2) { // 竞价模式
								formData = {
									isEdit: 1,
									orderId: this.option.id,
									orderCode: this.orderDetails.orderCode,
									expectPrice: this.orderDetails.price, // 期望报价
									priceWay: this.orderDetails.priceWay,
									companyId: this.defaultCompanyId,
									cityId: this.orderDetails.cityId,
									skillName: this.orderDetails.skillName,
									bidId: this.biddingInfo.id, // 报价ID
									billUserId: this.orderDetails.userId //  发单方UserID
								}
							} else {
								formData = { // 议价模式
									isEdit: 1,
									orderId: this.option.id,
									bidPrice: this.biddingInfo && this.biddingInfo.bidPrice,
									bidDescription: this.orderDetails.bizOrderOffer.bidDescription ||
										'', // 报价描述
									bidId: this.biddingInfo && this.biddingInfo.id, // 报价ID
									expectPrice: this.orderDetails.price, // 期望报价
									orderCode: this.orderDetails.orderCode,
									companyId: this.defaultCompanyId,
									cityId: this.orderDetails.cityId,
									skillName: this.orderDetails.skillName,
									billUserId: this.orderDetails.userId //  发单方UserID
								}
							}
							this.$store.commit('setServiceCityOperatorId', this.defaultCompanyId)
							this.setOfferForm()
							uni.navigateTo({
								url: '/pages/orderReceiving/expectOffer',
								success: (res) => {
									res.eventChannel.emit('getOrderDetails', formData);
								}
							})
							break
						case '修改报价':
							if (this.orderDetails.priceWay === 1) {
								this.$util.toast('一口价订单不允许修改报价～')
								return
							}
							let tempBizOrderOffer = this.biddingInfo
							this.setOfferForm()
							// 如果是竞价模式
							// this.orderDetails.priceWay
							let obj
							if (this.orderDetails.priceWay == 2) {
								let currentUserId = this.currentUser
								let tempUserId = []
								this.quotationMasterList.forEach(el => {
									if (el.bidUserId == currentUserId) {
										obj = {
											isEdit: 1,
											orderId: this.option.id,
											bidPrice: el.bidPrice,
											bidDescription: el.bidDescription || '', // 报价描述
											bidId: el.id, // 报价ID
											expectPrice: this.orderDetails.price, // 期望报价
											orderCode: this.orderDetails.orderCode,
											endDate: el.endDate,
											startDate: el.startDate,
											isStartDate: el.isStartDate,
											startDateDesc: el.startDateDesc,
											companyId: this.defaultCompanyId,
											cityId: this.orderDetails.cityId,
											skillName: this.orderDetails.skillName,
											risk: el.risk,
											payPlan: el.payPlan,
											payPlanTemplateId: el.payPlanTemplateId,
											productJson: el.groupPrices,
											requirementType: el.requirementType,
											billUserId: this.orderDetails.userId //  发单方UserID
										}
									}
								})
							} else {
								// 分期支付相关
								let tempUser = this.quotationMasterList.find(item => item.personInfo.userId == uni
									.getStorageSync('userData').sysUser.userId)
								obj = {
									isEdit: 1,
									orderId: this.option.id,
									bidPrice: this.orderDetails.bizOrderOffer.bidPrice,
									bidDescription: this.orderDetails.bizOrderOffer.bidDescription ||
										'', // 报价描述
									bidId: this.orderDetails.bizOrderOffer.id, // 报价ID
									expectPrice: this.orderDetails.price, // 期望报价
									orderCode: this.orderDetails.orderCode,
									endDate: tempBizOrderOffer.endDate,
									startDate: tempBizOrderOffer.startDate,
									isStartDate: tempBizOrderOffer.isStartDate,
									startDateDesc: tempBizOrderOffer.startDateDesc,
									risk: tempBizOrderOffer.risk,
									companyId: this.defaultCompanyId,
									cityId: this.orderDetails.cityId,
									skillName: this.orderDetails.skillName,
									payPlan: tempUser && tempUser.payPlan,
									payPlanTemplateId: tempUser && tempUser.payPlanTemplateId,
									requirementType: tempUser && tempUser.requirementType,
									billUserId: this.orderDetails.userId //  发单方UserID
								}
							}
							this.$store.commit('setServiceCityOperatorId', this.defaultCompanyId)
							uni.navigateTo({
								url: '/pages/orderReceiving/expectOffer',
								success: (res) => {
									res.eventChannel.emit('getOrderDetails', obj);
								}
							})
							break;
						case '重新报价':
							let newData = { // 议价模式
								isEdit: 1,
								orderId: this.option.id,
								bidPrice: this.orderDetails.bizOrderOffer.bidPrice,
								bidDescription: this.orderDetails.bizOrderOffer.bidDescription ||
									'', // 报价描述
								bidId: this.orderDetails.bizOrderOffer.id, // 报价ID
								expectPrice: this.orderDetails.price, // 期望报价
								orderCode: this.orderDetails.orderCode,
								companyId: this.defaultCompanyId,
								cityId: this.orderDetails.cityId,
								skillName: this.orderDetails.skillName,
								billUserId: this.orderDetails.userId //  发单方UserID
							}
							this.$store.commit('setServiceCityOperatorId', this.defaultCompanyId)
							this.setOfferForm()
							uni.navigateTo({
								url: '/pages/orderReceiving/expectOffer',
								success: (res) => {
									res.eventChannel.emit('getOrderDetails', newData);
								}
							})
							break
						case '联系客户':
							this.contactCustomersShow = true
							return
							if (this.orderDetails.contactPhone) {
								uni.makePhoneCall({
									phoneNumber: this.orderDetails.contactPhone
								})
							} else {
								this.$util.toast('用户不支持拨打电话~')
							}
							break;
						case '发消息': // 接单方发消息
							this.toPage(
								`/pages/message/chat/index?toUserId=${this.orderDetails.userId}&type=${customeType.constructionOrderKey}&orderId=${this.orderDetails.id}&toUserName=${this.orderDetails.userName}`
							)
							break;
						case '提交验收':
							// 提交验收时，区分是不是子订单
							let tempParameter = this.orderDetails.bizOrderOffer
							if (this.orderDetails.beforeOrderId) {
								if (tempParameter) {
									// 子订单提交验收时需要传服务id，项目经理验收时需要根据服务id查询验收标准
									let tempGroupPrices = JSON.parse(JSON.stringify(this.orderDetails.groupPrices))
									tempGroupPrices.map(item => {
										item.productJson = item.productJson !== '' && JSON.parse(item
											.productJson)
									})
									let tempProductIds = []
									tempGroupPrices.forEach(item => {
										item.productJson.forEach(el => {
											tempProductIds.push(el.id)
										})
									})
									let parameter = {
										id: this.orderDetails.id,
										skillId: tempParameter.skillId,
										skillName: tempParameter.skillName,
										userName: tempParameter.personName,
										personId: tempParameter.personId,
										productIds: tempProductIds.join(',')
									}
									uni.navigateTo({
										url: `/pages/orderReceiving/acceptance/addAcceptance`,
										success(res) {
											res.eventChannel.emit('addAcceptanceParameter', parameter);
										}
									})
								}
							} else {
								this.toPage(
									`/pages/orderReceiving/addAcceptance?orderCode=${this.orderDetails.orderCode}&skillId=${this.orderDetails.skillId}&id=${this.orderDetails.id}&applyPersonId=${tempParameter.personId}&applyPersonName=${tempParameter.personName}&applySkillName=${tempParameter.skillName}`
								)
							}
							break;
						case '变更价格':
							if (this.offerDetails.offerId) {
								this.$store.commit('seOfferDetails', {})
							}
							this.$store.commit('setServiceCityOperatorId', this.defaultCompanyId)
							this.toPage(
								`/pages/orderReceiving/changePrice?orderCode=${this.orderDetails.orderCode}&id=${this.orderDetails.id}&cityId=${this.orderDetails.cityId}`
							)
							break;
						case '取消订单':
							if (this.pageType === '发单') {
								this.orderId = this.option.id
								this.$refs.orderCancelReason.open()
							} else {
								this.orderId = this.option.id
								this.$refs.orderCancelReason.open()
								return
								if (this.biddingInfo && this.biddingInfo.id) {
									this.$httpApi.getCancelOrderOffer({
										orderOfferId: this.biddingInfo.id
									}).then(res => {
										if (res) {
											uni.hideLoading()
											uni.showToast({
												title: '操作成功~',
												icon: 'none'
											});
											this.getDetails()
										}

									})
								}
							}
							break;
						case '修改订单':
							// configStatus 工种是否配置交付模版(0未配置， 其他配置)
							this.toPage(
								`/pages/publishTask/IssueOrder?type=update&id=${this.option.id}&configStatus=${this.orderDetails.configStatus}&source=${this.orderDetails.source}`
							)
							break;
						case '刷新订单':
							if (this.option.id) {
								this.$httpApi.refreshOrder(this.option.id).then(res => {
									if (res) {
										uni.hideLoading()
										uni.showToast({
											title: '刷新成功~',
											icon: 'none'
										});
										this.getDetails()
									}
								})
							}
							break;
						case '联系客服':
							this.$util.goToWeixin()
							return
							this.toPage(
								`/pages/message/group/index?toUserId=${this.defaultCompanyId}&type=constructionOrder&orderId=${this.orderDetails.id}`
							)
							break;
						case '去支付':
							let currentBizOrderOffer = this.orderDetails && this.orderDetails.bizOrderOffer
							this.paymentList = currentBizOrderOffer.ratioPrices
							this.paymentList.forEach(el => {
								el['selectActive'] = false
							})
							this.payCurrentGroupPrices = currentBizOrderOffer.groupPrices
							this.payCurrentGroupPrices.forEach(el => {
								el['selectActive'] = false
							})
							this.myPayPlan = currentBizOrderOffer.payPlan
							this.showPopupPay = !this.showPopupPay
							break;
						case '拒绝接单':
							this.getRefusal()
							break;
						case '立即接单':
							this.getServiceAgreement()
							break
						case '查看变更项':
							let masterOther = this.quotationMasterList[0]
							this.toPage(
								`/pages/orderReceiving/changeRecords?orderCode=${this.orderDetails.orderCode}&companyId=${this.defaultCompanyId}&orderId=${this.orderDetails.id}&toUserId=${masterOther.personInfo.userId}&toUserName=${masterOther.personInfo.name}`
							)
							break;
						case '联系师傅':
							let temPmaster = this.quotationMasterList[0]
							if (temPmaster) {
								this.toPage(
									`/pages/message/chat/index?toUserId=${temPmaster.personInfo.userId}&type=${customeType.constructionOrderKey}&orderId=${this.orderDetails.id}&toUserName=${temPmaster.personInfo.name}`
								)
							}
							break;
						case '确认验收':
							// 如果是子订单，则走类似于sop的确认验收
							if (this.orderDetails.beforeOrderId) {
								if (this.checkedData.length > 0) {
									let tempItem = this.checkedData[0]
									uni.navigateTo({
										url: `/pages/orderReceiving/acceptance/acceptanceManagement?id=${this.option.id}&skillId=${tempItem.applySkillId}&itemId=${tempItem.id}&productIds=${tempItem.productIds}`
									})
								}
							} else {
								if (this.changeRecordsList.length > 0) {
									this.$util.toast('请完成变更项再继续验收～')
									return
								}
								if (this.checkedData.length > 0) {
									this.$http.post("order/customer/bizorderacceptance/editStatus", {
										statusFlag: 1,
										id: Number(this.checkedData[0].id)
									}).then(res => {
										if (res) {
											uni.showToast({
												title: '已确认验收',
												icon: 'none'
											});
											this.getDetails()
										}
									})
								}
							}
							break;
						case '评价服务':
							let that = this
							uni.navigateTo({
								url: '/pages/construction/evaluation/evaluationForm',
								success(res) {
									res.eventChannel.emit('acceptDataFromOpenerPage', {
										type: '评价服务',
										id: that.orderDetails.id,
										orderCode: that.orderDetails.orderCode
									});
								}
							})
							break;
						case '服务日志':
							let tempData = {
								latAddress: this.orderDetails.latAddress,
								orderCode: this.orderDetails.orderCode,
								id: this.orderDetails.id,
								workStatus: this.orderDetails.workStatus,
								skillId: this.orderDetails.skillId,
								personId: this.orderDetails.bizOrderOffer.personId,
								skillName: this.orderDetails.bizOrderOffer.skillName,
								orderStatus: this.orderDetails.orderStatus,
								viewType: '填写'
							}
							this.toPage(
								`/pages/orderReceiving/acceptance/constructionLog?orderDetails=${JSON.stringify(tempData)}`
							)
							break
						case '打卡':
							this.toPage(
								`/pages/orderReceiving/constructionDk?orderDetails=${JSON.stringify(this.orderDetails)}`
							)
							break
						case '开始服务':
							// this.toPage(
							// 	`/pages/orderReceiving/constructionForm?orderDetails=${JSON.stringify(this.orderDetails)}`
							// )
							let _that = this
							uni.navigateTo({
								url: '/pages/orderReceiving/constructionForm',
								success(res) {
									res.eventChannel.emit('orderDetails', {
										orderDetails: _that.orderDetails,
										title: '开始服务'
									});
								}
							})
							break
						case '风险提示':
							this.toPage(
								`/pages/orderReceiving/riskStatementPage?orderId=${this.orderDetails.id}&beforeOrderId=${this.orderDetails.beforeOrderId}`
							)
							break;
						case '验收报告':
							let acceptanceIds = []
							this.checkedData.forEach(item => {
								acceptanceIds.push({
									itemId: item.id,
									skillId: item.applySkillId,
									skillName: item.applySkillName
								})
							})
							if (acceptanceIds.length == this.checkedData.length) {
								uni.navigateTo({
									url: `/pages/orderReceiving/acceptance/acceptanceDetails?acceptanceIds=${JSON.stringify(acceptanceIds)}`
								})
							} else {
								this.$util.toast("还没有验收报告");
							}
							break
						case '沟通确认':
							this.toPage(
								`/pages/orderReceiving/communicationRecord/addRecord?orderId=${this.orderDetails.id}&offerId=${this.orderDetails.bizOrderOffer.id}`
							)
							break;
					}
				}, 200)

			},
			/**
			 * @description 服务协议弹出
			 * */
			getServiceAgreement() {
				if (['管家', '项目管家', '项目经理', '监理', '项目监理'].includes(this.orderDetails.skillName)) {
					if (this.operationButtonName == '立即抢单') {
						// 一口价抢单之后，不能在报价
						if (this.orderDetails.bizOrderOffer && this.orderDetails.priceWay == 1 && this
							.orderDetails.bidStatus == 0) {
							// 已经报过价
							this.$util.toast('你已经报过价了，请耐心等待')
						} else {
							// 首次报价, 一口价
							this.getOperation('抢单成功')
						}
					} else if (this.operationButtonName == '立即接单') {
						this.$httpApi.setAccept({
							orderId: this.orderDetails.id
						}).then(res => {
							if (res) {
								this.getDetails()
								this.$util.toast('操作成功')
							}
						})
					}
				} else {
					this.$serviceInfo(this.orderDetails, (res) => {
						this.serviceInfo = res
						this.serviceType = this.orderDetails.skillName
						this.serviceAgreementPopupStatus = !this.serviceAgreementPopupStatus
					})
				}
			},
			serviceSubmit() {
				if (this.operationButtonName == '立即接单') {
					this.$httpApi.setAccept({
						orderId: this.orderDetails.id
					}).then(res => {
						if (res) {
							this.getDetails()
							this.$util.toast('操作成功')
						}
					})
				} else if (this.operationButtonName == '立即抢单') {
					// 一口价抢单之后，不能在报价
					if (this.orderDetails.bizOrderOffer && this.orderDetails.priceWay == 1 && this
						.orderDetails.bidStatus == 0) {
						// 已经报过价
						this.$util.toast('你已经报过价了，请耐心等待')
					} else {
						// 首次报价, 一口价
						this.getOperation('抢单成功')
					}
				}
			},
			getPopupClose() {
				this.serviceAgreementPopupStatus = !this.serviceAgreementPopupStatus
			},
			paymentSchedule() {
				this.paymentSchedulePopup = !this.paymentSchedulePopup
			},
			/**
			 * @description 催付
			 * @param planItemId: 为工种时传工种skillId，分期则传相应的id
			 */
			toPay(item, type) {
				this.$httpApi.getDunning({
					orderId: this.orderDetails.id,
					planItemId: type == '比例' ? item.id : item.skillId
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功");
					}
				})
			},
			/**
			 * @description 设置项目管家、项目经理报价时所需字段
			 * @param planItemId: 为工种时传工种skillId，分期则传相应的id
			 */
			setOfferForm() {
				let tempParameter = {
					offerId: this.biddingInfo.id,
					orderId: this.orderDetails.id,
					skillName: this.orderDetails.skillName,
					userName: this.orderDetails.userName,
					companyId: this.defaultCompanyId,
					personId: this.biddingInfo.personId,
				}
				this.$store.commit('seOfferDetails', tempParameter)
			},

			/**
			 * @description 
			 * 1.若订单为sop交付，且接单方已接单，则弹出提示
			 * 2.若从消息列表、工作台跳转进入，则不弹出提示，并隐藏按钮
			 * @param deliveryType 交付类型 0-简单 1-SOP
			 * @param configStatus 工种是否配置交付模版(0未配置， 其他配置)
			 * @param priceWay 1 一口价   3上门开单
			 */
			issuingPartyisAccept() {
				if (this.orderDetails.orderStatus >= 30 && this.orderDetails.projectId == -1) {
					return
				}
				if (['消息跳转', '工作台'].includes(this.option.noticeType)) {
					this.issuingPartyisAcceptStatus = true
					return
				}
				if (this.orderDetails.orderStatus >= 30 && this.orderDetails.projectId && this.orderDetails.projectId != -
					1) {
					this.issuingPartyisAcceptStatus = true
					return
				}
				if (this.orderDetails.configStatus && this.orderDetails.deliveryType) {
					if (this.biddingInfo && this.biddingInfo.bidStatus == 3) {
						if (this.orderDetails.priceWay == 1 && this.orderDetails.assignType == 2) {
							if (!this.orderDetails.deliveryType) {

							}
						} else {
							this.issuingPartyisAcceptStatus = true
							switch (this.orderDetails.priceWay) {
								case 1:
									this.$util.toast("操作成功，请到我的订单中查看")
									break;
								case 3:
									this.$util.toast("订单已被确认，请到我的订单中查看");
									break;
							}
						}
					}
				}
			},
			getContactCustomers(item) {
				if (item.name == '拨打电话') {
					if (this.orderDetails.contactPhone) {
						uni.makePhoneCall({
							phoneNumber: this.orderDetails.contactPhone
						})
						this.contactCustomersShow = false
					} else {
						this.$util.toast('用户不支持拨打电话~')
					}
				} else {
					this.toPage(
						`/pages/message/chat/index?toUserId=${this.orderDetails.userId}&type=${customeType.constructionOrderKey}&orderId=${this.orderDetails.id}&toUserName=${this.orderDetails.userName}`
					)
					this.contactCustomersShow = false
				}
			},
			setContactName() {
				if (!this.orderDetails.contactName) return '客户'
				return this.noPassByName(this.orderDetails.contactName)
			},
			getRecordMore() {
				this.toPage(`/pages/orderReceiving/communicationRecord/recordList?orderId=${this.orderDetails.id}`)
			},
			setResult(intention) {
				const tempResultMap = {
					'1': '愿意接单',
					'0': '不是平台单',
					'-1': '个人弃单',
				}
				return tempResultMap[intention] ?? ''
			},
			noPassByName(str) {
				if (null != str && str != undefined) {
					if (str.length == 2) {
						return str.substring(0, 1) + '*' //截取name 字符串截取第一个字符，
					} else if (str.length == 3) {
						return str.substring(0, 1) + "*" + str.substring(2, 3) //截取第一个和第三个字符
					} else if (str.length > 3) {
						return str.substring(0, isNaN(str) ? 2 : 1) + '**' + str.substring(str.length - 1, str.length)
					}
				} else {
					return "";
				}
			},
			conversionUnit() {
				this.resutlDistance = uni.getStorageSync('resutlDistance')
				if(!this.resutlDistance)
				this.$util.conversionUnit(this.orderDetails.latitude, this.orderDetails.longitude, (res) => {
					this.resutlDistance = res
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.icon-editor {
		width: 24rpx;
		height: 24rpx;
	}

	.icon-positioning {
		width: 32rpx;
		height: 32rpx;
	}

	.copy-icon {
		width: 44rpx;
		height: 44rpx;
	}

	.icon-phone {
		width: 40rpx;
		height: 40rpx;
	}

	.icon-zf {
		width: 26rpx;
		height: 26rpx;
	}

	.icon-jian {
		width: 16rpx;
		height: 14rpx;
	}

	.nav-bar-title {
		font-size: 32rpx;
		font-weight: bold;
	}

	.nav-bar-right {
		image {
			width: 36rpx;
			height: 36rpx;
			margin-right: 28rpx;
		}
	}

	.modal-label-contain {
		display: flex;
		justify-content: center;
		flex-direction: column;

		.label {
			display: flex;
			justify-content: center;
			font-size: 28rpx;
			color: #999999;
		}
	}


	.release-order-details {
		padding-bottom: 304rpx;

		.top-title {
			display: flex;
			align-items: center;
			margin-top: 40rpx;

			.item-title {
				display: flex;
				flex: 1;
				justify-content: center;

				.active-label {
					font-weight: bold;
					font-size: $middleFontSize;
					color: $themeColor;
					position: relative;
				}

				.default-label {
					font-size: $smiddleFontSize;
					color: #606266;
					position: relative;
				}

				.item-num {
					position: absolute;
					right: -28rpx;
					background-color: $errorFontColor;
					display: flex;
					align-items: center;
					justify-content: center;
					top: -8rpx;
					width: 28rpx;
					height: 28rpx;
					border-radius: 50%;

					text {
						color: #fff;
						font-size: $smallFontSize;
						transform: scale(0.85);
					}
				}
			}
		}

		.order-information-default {
			margin-top: 0rpx !important;
		}

		.item-identification {
			position: absolute;
			background-color: #FFEDED;
			color: #FF5D35;
			font-size: 26rpx;
			// width: 146rpx;
			height: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			right: 0;
			top: 0;
			border-top-right-radius: 16rpx;
			padding: 0 24rpx;

			.bevel-angle {
				position: absolute;
				width: 0;
				height: 0;
				left: 0;
				top: 0;
				border-top: 42rpx solid transparent;
				border-right: 4rpx solid transparent;
				border-bottom: 10rpx solid #fff;
				border-left: 12rpx solid #fff;
			}
		}

		.order-information {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 48rpx 32rpx 38rpx 32rpx;
			margin-top: 38rpx;
			position: relative;

			.information-top {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item-update {
					display: flex;
					align-items: center;
					min-width: 100rpx;
					flex-wrap: nowrap;

					text {
						color: $themeColor;
						font-size: $smiddleFontSize;
						margin-right: 14rpx;
					}
				}
			}

			.item-address {
				margin-top: 12rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;


				.left {
					display: flex;

					.address {
						font-size: $smiddleFontSize;
						color: $seconFontColor;
						margin-left: 6rpx;
						max-width: 500rpx;

						text {
							font-size: $smiddleFontSize;
							color: $seconFontColor;
						}
					}
				}

				.right {
					display: flex;
					align-items: center;
					min-width: 90rpx;

					text {
						font-size: $middleFontSize;

						color: #909199;
					}

				}


			}

			.item-pice {
				margin-top: 16rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.pice-num {
					font-size: 46rpx;
					color: $errorFontColor;
					margin-right: 6rpx;
				}

				.item-pice-right {
					.pice-text {
						font-size: 28rpx;
						color: #303133;
					}
				}

				.pice-unit {
					font-size: 24rpx;
					color: #606166;
				}

				.pice-unit-other {
					font-size: 40rpx;
					color: $errorFontColor;
					margin-right: 6rpx;
				}
			}

			.item-order-type {
				display: flex;
				align-items: center;
				margin-top: 16rpx;
				margin-left: -6rpx;

				.item-source {
					transform: scale(0.85);
					border-radius: 4rpx;
					background-color: rgba(255, 93, 53, 0.1);
					padding: 4rpx 12rpx;

					.source-text {
						line-height: 1;
						font-size: 24rpx;
						color: #FF5D35;
					}
				}

				.item-work-type-default {
					transform: scale(0.85);
					border-radius: 4rpx;
					background-color: #E5EAF6;
					padding: 4rpx 12rpx;

					.type-text {
						line-height: 1;
						font-size: 24rpx;
						color: $themeColor;
					}
				}

				.item-requirement-type {
					transform: scale(0.85);
					border-radius: 4rpx;
					background-color: #E5EAF6;
					padding: 4rpx 12rpx;

					.requirement-type-text {
						line-height: 1;
						font-size: 24rpx;
						color: $themeColor;
					}
				}
			}

			.item-time-contain {
				font-size: 24rpx;
				color: #909199;
				margin-top: 16rpx;
			}

			.cost-contain {
				background-color: #F7F7F7;
				border-radius: 10rpx;
				height: 72rpx;
				padding: 18rpx 34rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 20rpx;

				.item-left {
					color: #3D3D3D;
					font-size: 26rpx;
				}

				.item-right {
					font-size: 24rpx;
					color: #606166;
				}
			}

		}

		.requirements-description {

			.title {
				font-size: $smallFontSize;
				color: $viceFontColor99;
				font-weight: bold;
			}

			.item-desc {
				margin-top: 12rpx;
				font-size: $middleFontSize;
				color: $seconFontColor;
			}

			.image-contain {
				margin-top: 20rpx;
			}

			.audio-contain {
				margin-top: 8rpx;
			}
		}

		.order-detailed-information {
			background-color: #fff;
			margin-top: 8rpx;
			padding: 40rpx 32rpx;
			border-radius: 16rpx;

			.item-contact {
				display: flex;
				justify-content: space-between;
				padding: 34rpx 0rpx;
				border-top: 2rpx solid #EEEEEE;
				border-bottom: 2rpx solid #EEEEEE;

				.item-contain {
					.label {
						font-size: $smiddleFontSize;
						color: $viceFontColor;
						margin-bottom: 8rpx;
					}

					.value {
						font-size: $middleFontSize;
						color: $seconFontColor;
					}
				}
			}
		}

		.brief-information {
			background-color: #fff;

			.icon-time {
				width: 36rpx;
				height: 36rpx;
			}

			.icon-pin {
				width: 38rpx;
				height: 38rpx;
			}


			.icon-pointer {
				width: 32rpx;
				height: 32rpx;
			}

			.icon-user {
				width: 34rpx;
				height: 34rpx;
			}

			.icon-source {
				width: 34rpx;
				height: 34rpx;
			}

			.item-brief-information {
				display: flex;
				flex-direction: column;
				margin-bottom: 24rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.item-top {
					display: flex;

					.item-label {
						margin-left: 20rpx;
						font-size: $middleFontSize;
						color: $viceFontColor;
					}
				}

				.item-bottom {
					font-size: $middleFontSize;
					color: $seconFontColor;
					padding-left: 50rpx;
					margin-top: 2rpx;
					line-height: 40rpx;

					.information-item-address {
						display: flex;
						justify-content: space-between;
					}

					.information-item-address-left {
						max-width: 500rpx;
						font-size: $middleFontSize;
						color: $seconFontColor;
					}

					.information-item-address-right {
						display: flex;
						align-items: center;

						.icon-pointer {
							display: inline-block;
						}

						.item-navigation {
							font-size: $fontSize26;
							color: $themeColor;
						}
					}
				}
			}
		}

		.quotation-master {
			margin-top: 10rpx;
			border-radius: 0px 0px 16rpx 16rpx;

			.item-title {
				background-color: #ffff;
				padding: 26rpx 50rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 2rpx;
				border-radius: 16rpx 16rpx 0px 0px;

				.left {
					font-size: $middleAddFontSize;
					color: $seconFontColor;
					font-weight: bold;
				}

				.right {
					color: $viceFontColor;
					font-size: 13px;
				}

				.title-active {
					color: #002FA5;
				}
			}

			.list-contain {
				.item-contain {
					padding: 46rpx 32rpx 36rpx 32rpx;
					background-color: #fff;
					margin-bottom: 2rpx;

					&:last-child {
						border-radius: 0px 0px 10rpx 10rpx;
					}

					.item-detailed-list {
						margin-top: 36rpx;

						.select-list {
							display: flex;
							justify-content: space-between;

							.item-list-contain {
								display: flex;
								width: 500rpx;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}

							.select-list-item {
								&:last-child {
									.item-contain-material {
										margin-right: 0rpx;
									}
								}

								.item-contain-material {
									display: flex;
									align-items: center;
									margin-right: 34rpx;


									.icon-zf {
										margin-right: 4rpx;
									}

									.material-name {
										font-size: $smallFontSize;
										color: #303133;
										white-space: nowrap;
									}
								}
							}

							.select-list-right {
								display: flex;
								align-items: center;

								text {
									color: $themeColor;
									font-size: $smallFontSize;
									white-space: nowrap;
									margin-right: 6rpx;
								}
							}
						}

						.no-select-list {
							display: flex;
							align-items: center;
							justify-content: space-between;

							.left,
							.right {
								display: flex;
								align-items: center;

							}

							.left {
								font-size: $smallFontSize;
								color: #909199;
							}

							.right {
								text {
									font-size: $smallFontSize;
									color: #909199;
								}
							}
						}

						.icon-jian {
							margin-left: 6rpx;
						}
					}
				}
			}

			.record-contain {
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 30rpx 0rpx;

				text {
					font-size: $smallFontSize;
					color: #909199;
					margin-right: 6rpx;
				}

				.public-none {
					transition: all 0.2s;
					transform: rotate(90deg);
				}

				.public-block {
					transition: all 0.2s;
					transform: rotate(-90deg);
				}
			}

			.no-user-list {
				background-color: #fff;
				height: 672rpx;
				border-radius: 0px 0px 16rpx 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.custom-title-contain {
					/deep/ .item-image {
						width: 244rpx;
						height: 208rpx;
					}
				}
			}


		}

		.acceptance-records {
			background-color: #fff;
			padding: 0rpx 32rpx 46rpx 32rpx;
			border-radius: 16rpx;
			margin-top: 10rpx;

			.acceptance-records-contain {
				// border-top: 2rpx solid #EEEEEE;
				padding-top: 36rpx;

				.acceptance-records-list {
					// margin-bottom: 20rpx;
				}

				.title {
					font-size: $middleAddFontSize;
					color: $seconFontColor;
					font-weight: bold;
				}

				.item-time {
					margin-top: 8rpx;

					text {
						font-size: $smallFontSize;
						color: $viceFontColor;
					}

					.left {
						margin-right: 10rpx;
					}

				}

				.item-desc {
					margin-top: 12rpx;
					font-size: $middleFontSize;
					color: #666666;
				}

				.image-contain {
					margin-top: 28rpx;

					/deep/.item-image-all {
						&:nth-of-type(3n+0) {
							margin-right: 0rpx !important;
						}
					}
				}

				.audio-contain {
					margin-top: 8rpx;
				}
			}

			.item-result {
				background: #F9F9F9;
				border-radius: 10rpx;
				padding: 10rpx 18rpx;
				font-size: 24rpx;
				margin-top: 10rpx;
			}
		}

		.communication-record {
			padding: 32rpx;
			border-radius: 16rpx;
			background-color: #fff;
			margin-top: 8rpx;

			.record-details {

				.item-title {
					display: flex;
					flex-direction: column;
					margin-bottom: 30rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.title {
						display: flex;
						justify-content: space-between;
						margin-bottom: 8rpx;
						line-height: 42rpx;

						.item-left {
							color: #303133;
							font-size: 28rpx;
							font-weight: bold;
						}

						.more {
							color: #909199;
							font-size: 28rpx;
						}
					}

					.why-content {
						color: #606166;
						font-size: 28rpx;
					}
				}
			}
		}

		.quotation-list {
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 10rpx;

			.quotation-description {
				// padding: 32rpx;

				.item-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 32rpx 32rpx 0rpx 32rpx;


					.pice-num {
						font-size: 46rpx;
						color: $errorFontColor;
						margin-right: 6rpx;
					}

					.pice-unit {
						font-size: $smallFontSize;
						color: $seconFontColor;
					}

					.item-right {
						.pice-text {
							font-size: 26rpx;
							color: #303133;
						}
					}
				}

				.item-time {
					margin-top: 6rpx;
					display: flex;
					justify-content: space-between;
					// padding: 0rpx 32rpx 32rpx 32rpx;

					text {
						font-size: $smallFontSize;
						color: $viceFontColor;
					}

					.label {
						margin-right: 10rpx;
					}


					.item-right {
						display: flex;
						padding: 0rpx 30rpx 32rpx 0rpx;
						align-items: center;
					}

					.item-left {
						padding: 0rpx 0rpx 32rpx 32rpx;
					}

				}

				.change-records {
					// margin-top: 24rpx;
					display: flex;
					padding: 20rpx 32rpx 32rpx 32rpx;

					.left {
						margin-right: 20rpx;

						.num {
							font-size: $middleFontSize;
							color: $errorFontColor;
							font-weight: bold;
							margin-right: 6rpx;
						}

						.other {
							font-size: $middleFontSize;
							color: $seconFontColor;
						}
					}

					.right {
						font-size: $middleFontSize;
						color: $viceFontColor;
					}
				}

				.item-other {
					// margin-top: 36rpx;
					border-bottom: 2rpx solid #EEEEEE;
					padding: 20rpx 32rpx 42rpx 32rpx;

					.item-title {
						color: $seconFontColor;
						font-size: $middleFontSize;
						font-weight: bold;
					}

					.item-desc {
						margin-top: 8rpx;
						font-size: $smiddleFontSize;
						color: $seconFontColor;
					}
				}
			}

			.list-contain {
				margin-top: 26rpx;
				padding: 0rpx 32rpx 32rpx 32rpx;

				.item-title {
					font-size: $middleFontSize;
					color: $seconFontColor;
					font-weight: bold;
				}
			}
		}

		.acceptance-criteria {
			margin-top: 6rpx;
			margin-bottom: 2rpx;
			padding: 24rpx 32rpx;
			background-color: #fff;
			border-radius: 10rpx;

			.item-title {
				font-size: 28rpx;
				color: #303133;
				margin-bottom: 20rpx;
			}

		}

		.order-introduction {
			background-color: #fff;
			margin-top: 8rpx;
			border-radius: 16rpx;

			.title {
				color: $seconFontColor;
				font-size: $middleFontSize;
				padding: 28rpx 0rpx;
				margin: 0rpx 30rpx 32rpx 30rpx;
				border-bottom: 2rpx solid #EEEEEE;
				font-weight: bold;
			}

			.other-introduction {
				display: flex;
				justify-content: space-between;
				padding-right: 50rpx;
			}

			.item-introduction {
				padding-left: 50rpx;
				display: flex;
				align-items: center;
				flex-direction: row;
				margin-bottom: 28rpx;

				&:last-child {
					margin-bottom: 0rpx;
					padding-bottom: 52rpx;
				}

				.lable,
				.value {
					font-size: $middleFontSize;
					color: $viceFontColor;
				}

				.copy-icon {
					margin-left: 94rpx;
				}
			}

			.before-time {
				margin-left: 20rpx;
			}
		}

		.no-offer {
			display: flex;
			flex-direction: column;
			border-radius: 16rpx;
			background-color: #fff;
			padding: 28rpx 0rpx 40rpx 30rpx;
			margin: 4rpx 0rpx;

			.item-title {
				font-size: 28rpx;
				color: $seconFontColor;
				line-height: 40rpx;
			}

			.item-time {
				color: $viceFontColor;
				font-size: 24rpx;
				line-height: 34rpx;
				margin-bottom: 10rpx;
			}

			.item-reson {
				color: #666666;
				font-size: 26rpx;
				line-height: 40rpx;
			}
		}

		.button-all {}

		.item-bottom-contian {
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
			background-color: #FFF;

			.check-skill-status {
				background-color: #FFEDED;
				padding: 28rpx;
				align-items: center;
				display: flex;
				justify-content: center;

				text {
					color: #FF5D35;
					font-size: 26rpx;
					margin-right: 20rpx;
				}

			}

			.certification-contain {
				background: #E5ECFF;
				padding: 28rpx;
				align-items: center;
				display: flex;
				justify-content: center;

				text {
					color: #002FA5;
					font-size: 26rpx;
					margin-right: 20rpx;
				}

				image {
					width: 10rpx;
					height: 16rpx;
				}
			}

			.button-all {
				position: absolute;
				bottom: 120rpx;
			}

			.button-more-contain {
				width: 176rpx;
				padding: 26rpx 18rpx;
				background-color: #fff;
				// position: absolute;
				margin: 0rpx 0rpx 10rpx 20rpx;
				box-shadow: 0rpx 0rpx 8rpx rgba(172, 172, 172, 0.25);
				border-radius: 10rpx;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					width: 0;
					height: 0;
					bottom: -54rpx;
					left: 50%;
					transform: translate(-50%, -50%);
					border-top: 20rpx solid #fff;
					border-right: 34rpx solid transparent;
					border-bottom: 20rpx solid transparent;
					border-left: 34rpx solid transparent;
					filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.1));
				}


				.more-list {
					padding: 0 14rpx 14rpx 14rpx;
					color: #606166;
					font-size: 28rpx;
					border-bottom: 2rpx solid #F6F6F6;
					margin-bottom: 14rpx;

					&:last-child {
						padding: 0 14rpx 0rpx 14rpx;
						border-bottom: 0px;
						margin-bottom: 0rpx;
					}
				}
			}

			.button-single {
				height: 88rpx;
				background: #002FA5;
				border-radius: 10rpx;
				text-align: center;
				line-height: 88rpx;

				.button-single-item {
					color: #fff;
					font-size: 28rpx;
					border-radius: 10rpx;
				}
			}



			.item-button-list {
				background-color: #fff;
				// padding: 28rpx 20rpx;
				padding: 28rpx 20rpx 0rpx 20rpx;
				// overflow-x: auto;
				// border-radius: 10rpx;

				.scroll-X {
					width: 100%;
				}

				.button-list {
					display: flex;
					width: 700rpx;
					justify-content: flex-end;
				}

				.button-list-active {
					justify-content: inherit;
				}

				.item-button-active,
				.item-button-border-active,
				.item-button-default {
					padding: 16rpx;
					min-width: 160rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: $middleFontSize;
					margin-right: 24rpx;
					white-space: nowrap;
					border-radius: 10rpx;

					&:last-child {
						margin-right: 0rpx;
					}
				}

				.item-button-default {
					color: #909299;
					border: 2rpx solid #EBEBEB;


				}

				.item-button-border-active {
					color: #002FA5;
					border: 2rpx solid #002FA5;
				}

				.item-button-active {
					background: $themeColor;
					color: #fff;
					// position: relative;

					.item-num-contain {
						width: 28rpx;
						height: 28rpx;
						border-radius: 50%;
						background-color: #FF5D35;
						margin-top: -20rpx;
						margin-left: 8rpx;

						.item-num {
							font-size: 24rpx;
							color: #fff;
							transform: scale(0.85);
							display: flex;
							align-items: center;
							justify-content: center;

						}

						// position: absolute;
					}
				}
			}

			.item-button-list-android {
				padding: 28rpx 20rpx;
			}
		}

	}

	.public-item-top-contain {
		display: flex;

		.item-top-left {
			position: relative;

			.item-name {
				position: absolute;
				background: $themeColor;
				border-radius: 4rpx;
				width: 112rpx;
				height: 38rpx;
				text-align: center;
				// bottom: 32rpx;
				bottom: 12rpx;
				left: 10rpx;

				text {
					font-size: $smallFontSize;
					color: #fff;
					display: inline-block;
				}
			}
		}

		.item-right {
			width: 100%;
			margin-left: 28rpx;

			.top {
				display: flex;
				align-items: center;

				.left {
					display: flex;
					align-items: center;

					.real-name {
						font-size: $middleAddFontSize;
						color: #333333;
						font-weight: bold;
					}

					.icon-phone {
						margin-left: 20rpx;
					}
				}

				.item-pice {
					display: flex;
					flex: 1;
					justify-content: flex-end;
					align-items: center;

					.label {
						font-size: $smallFontSize;
						color: $viceFontColor;
						margin-right: 10rpx;
					}

					.num {
						font-size: $smallFontSize;
						color: $errorFontColor;
					}
				}
			}

			.label-contain {
				margin-top: 20rpx;
				display: flex;

				.item-label {
					padding: 4rpx 12rpx;
					background: #F1F3FF;
					border-radius: 4rpx;
					font-size: $smallFontSize;
					color: #5382D0;
					margin-right: 14rpx;

				}

				.item-label:last-child {
					margin-right: 0rpx;
				}
			}

			.item-other {
				display: flex;
				margin-top: 18rpx;
				align-items: center;
				justify-content: space-between;

				.item-other-left {
					display: flex;
					justify-content: space-between;

					.item-other-contain {
						margin-right: 30rpx;

						&:last-child {
							margin-right: 0rpx;
						}

						.lable {
							color: $viceFontColor;
							font-size: $smiddleFontSize;
							margin-right: 10rpx;
						}

						.value {
							color: $seconFontColor;
							font-size: $smiddleFontSize;
						}
					}
				}

				.item-other-right {
					.item-button {
						width: 120rpx;
						height: 56rpx;
						text-align: center;
						line-height: 56rpx;
						border-radius: 10rpx;
						background-color: rgba(0, 47, 165, 0.1);
						color: $themeColor;
						font-size: $smallFontSize;
					}
				}
			}
		}
	}



	.quotation-item-list-contain {
		margin-top: 22rpx;

	}


	.quotation-list-total {
		display: flex;
		justify-content: space-between;
		margin-top: 32rpx;
		border-top: 2rpx solid #EEEEEE;
		padding-top: 32rpx;

		.left {
			color: $viceFontColor;
			font-size: $smallFontSize;
		}

		.right {
			.text {
				color: $viceFontColor;
				font-size: $smallFontSize;
				margin-right: 16rpx;
			}

			.pice {
				color: $errorFontColor;
				font-size: 46rpx;
			}

			.unit {
				color: $errorFontColor;
				font-size: $smallFontSize;
			}
		}
	}


	.listing-details-contain {
		height: 100%;
		background-color: #fff;
		padding: 60rpx 58rpx 130rpx 58rpx;

		.scroll-Y {
			height: 100%;

			.item-pice {
				margin-top: 4rpx;

				.num {
					color: $errorFontColor;
					font-size: 46rpx;
					margin-right: 6rpx;
				}

				.unit {
					color: $seconFontColor;
					font-size: $smallFontSize;
				}
			}

			.item-time {
				margin-top: 8rpx;
				color: $viceFontColor;
				font-size: $smallFontSize;
			}

			.item-desc-contain {
				display: flex;
				margin-top: 32rpx;
				padding-bottom: 40rpx;
				border-bottom: 2rpx solid #EEEEEE;
				flex-direction: column;

				.item-desc-title {
					color: $seconFontColor;
					font-size: $middleFontSize;
					font-weight: bold;
				}

				.item-desc {
					color: $seconFontColor;
					font-size: $smiddleFontSize;
					margin-top: 8rpx;
				}
			}

			.construction-period {
				display: flex;
				padding: 32rpx 0rpx;
				flex-direction: column;
				margin-bottom: 32rpx;
				border-bottom: 2rpx solid #EEEEEE;
				border-top: 2rpx solid #EEEEEE;

				.item-title {
					color: #303133;
					font-size: 28rpx;
					margin-bottom: 8rpx;
				}

				.item-desc {
					color: #303133;
					font-size: 26rpx;
				}
			}

			.risk-warning {
				.item-title {
					color: #303133;
					font-size: 28rpx;

				}

				.risk-warning-list {
					margin-top: 18rpx;

					.item-risk-contain {
						margin-bottom: 20rpx;
						display: flex;
						align-items: flex-start;
						flex-direction: column;


						&:last-child {
							margin-bottom: 0rpx;
						}

						.item-other {
							display: flex;
							margin-bottom: 20rpx;
							align-items: center;
						}

						.item-desc {
							color: #303133;
							font-size: 26rpx;
						}
					}

					.radio-default {
						width: 30rpx;
						height: 30rpx;
						border-radius: 50%;
						border: 4rpx solid #BDBDBD;
						margin-right: 10rpx;
					}

					.radio-select-active {
						border: 4rpx solid #002FA5;
						position: relative;
						background-color: #002FA5;

						&::before {
							content: ' ';
							position: absolute;
							top: 48%;
							left: 50%;
							transform: translate(-50%, -50%) rotate(-45deg);
							display: inline-block;
							width: 16rpx;
							height: 8rpx;
							border-width: 0 0 4rpx 4rpx;
							overflow: hidden;
							border-color: #fff;
							border-style: solid;
						}
					}
				}
			}
		}


		.button-list {
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx 0rpx;

			.item-default {
				height: 84rpx;
				line-height: 84rpx;
				text-align: center;
				border-radius: 10rpx;
				font-size: $middleFontSize;
			}

			.item-button {
				width: 204rpx;
				color: #909299;
				border: 1rpx solid #EBEBEB;
				margin-right: 32rpx;
			}

			.item-button-active {
				color: #fff;
				background-color: $themeColor;
				width: 438rpx;
			}
		}
	}

	.content-sku {
		.content-main {
			overflow: hidden;

			.content-main_res_list {
				max-height: 300rpx;
			}

			.content-main_res {
				display: flex;
				align-items: center;
				margin-top: 52rpx;

				.radio {
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					border: 4rpx solid #BDBDBD;
					margin-right: 30rpx;
				}

				.radioSelect {
					border: 4rpx solid #002FA5;
					position: relative;


					&::before {
						content: '';
						position: absolute;
						width: 20rpx;
						height: 20rpx;
						border-radius: 50%;
						background: #002FA5;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.reason {
					color: #141414;
					font-size: 26rpx;
				}
			}

			.item-desc-input {
				width: 100%;
				height: 208rpx;
				padding: 24rpx 26rpx;
				margin-top: 64rpx;
				background: #F7F7F7;
				border-radius: 12rpx;
				font-size: 26rpx;
			}
		}

		.item-button-contain {
			position: absolute;
			bottom: 20rpx;
			padding-left: 20rpx;

			.item-button {
				position: relative;
				width: 624rpx;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				color: #002FA5;
				font-size: 24rpx;
				border: 2rpx solid #002FA5;
				border-radius: 10rpx;
			}
		}
	}


	.complaints-contain {
		/deep/ .sku {
			background-color: #fff !important;
		}
	}

	.name-left {
		// max-width: 590rpx;

		.item-work-type {
			width: 54rpx;
			background-image: url('../../static/icon/skill-name-1.png');
		}

		.item-work-type-medium {
			width: 76rpx;
			background-image: url('../../static/icon/skill-name-2.png');
		}

		.item-work-type-big {
			min-width: 100rpx;
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
			align-items: center;

			.type-text {
				white-space: nowrap;
				color: $themeColor;
				font-size: 24rpx;
				display: inline-block;
				transform: scale(0.8);
				position: relative;
			}
		}



		.requirement-title {
			word-break: break-all;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 900;
			font-size: 30rpx;
			line-height: 44rpx;
			color: #333333;
		}

	}

	.payment-schedule {
		height: 100%;
		background-color: #FFF;

		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.list-contain {
			height: calc(100% - 120rpx);
			padding: 10rpx 40rpx;
		}

		.scroll-Y {
			height: 100%;

			.payment-schedule-all {
				height: 100%;

				.payment-item {
					border-bottom: 2rpx solid #F6F6F6;
					padding: 28rpx 0rpx;
					min-height: 156rpx;

					&:last-child {
						border-bottom: 0rpx
					}

					.item-top {
						display: flex;
						justify-content: space-between;

						.item-left {
							display: flex;

							text {
								color: #303133;
								font-size: 28rpx;
							}

							.payment-status-default {
								width: 76rpx;
								height: 34rpx;
								background: rgba(144, 145, 153, 0.1);
								border-radius: 0px 8px;
								margin-left: 8rpx;

								.item-payment-status {
									display: inline-block;
									color: #909199;
									font-size: 24rpx;
									transform: scale(0.85);
								}
							}

							.payment-status-contain-active {
								background: rgba(255, 93, 53, 0.1);

								.item-payment-status {
									color: #FF5D35;
								}
							}
						}

						.item-right {

							.payment-price {
								font-size: 28rpx;
								color: #FF5D35;
								margin-right: 4rpx;
							}

							.payment-unit {
								font-size: 24rpx;
								color: #909199;
							}
						}
					}

					.item-bottom {
						display: flex;
						justify-content: space-between;
						margin-top: 6rpx;

						.payment-time {
							color: #B4B6BA;
							font-size: 26rpx;
						}

						.payment-pay-button {
							background: rgba(0, 47, 165, 0.1);
							width: 114rpx;
							height: 50rpx;
							border-radius: 4rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							color: #002FA5;
							font-size: 26rpx;
						}
					}
				}
			}

			/deep/ .u-empty {
				margin-top: 60rpx !important;
			}

		}
	}

	.contact-customers {
		height: 100%;
		background-color: #FFF;



		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			margin: 0 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
			font-size: 30rpx;
			font-weight: normal;
		}

		.list-contain {
			display: flex;
			justify-content: center;
			margin-top: 54rpx;
		}

		.item-contain {
			width: 280rpx;
			height: 72rpx;
			border-radius: 6rpx;
			background-color: #F6F6F6;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 34rpx;

			&:last-child {
				margin-right: 0rpx;
			}
		}

		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 16rpx;
		}

		text {
			color: #303133;
			font-size: 28rpx;

		}
	}
</style>
