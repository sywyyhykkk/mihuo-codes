<template>
	<view class="release-order-details">
		<z-nav-bar backState="3000" bgColor="#f5f5f5" fontColor="#979797" @backClick="goBackPage()">
			<view slot="default" class="nav-bar-title">
				{{setTitle}}
			</view>
			<!-- <view slot="right" class="nav-bar-right" @click="getShare">
				<image src="/static/images/getShare.png" mode=""></image>
			</view> -->
		</z-nav-bar>
		<view class="top-title" v-if="pageType == '发单'">
			<view class="item-title" v-for="(item,index) in titleTypeList" :key="index" @click="setSelectActive(index)">
				<view :class="[selectActiveIndex == index ? 'active-label':'default-label']">{{item.label}}
					<view v-if="item.label == '报价师傅' && quotationMasterList.length > 0" class="item-num">
						<text>{{quotationMasterList.length}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-information" :class="[pageType == '发单' ?'':'order-information-default']">
			<view class="item-identification" v-if="setOrderModer">
				<view class="bevel-angle">
				</view>
				{{setOrderModer}}
			</view>
			<view class="information-top">
				<view class="name-left">

					<text class="requirement-title">{{ setRequirementName }}</text>
				</view>
				<view class="item-update" v-if="pageType == '发单' && isEditor" @click="getJump('编辑单据')">
					<text>编辑</text>
					<image class="icon-editor" src="/static/images/icon_edit/editor_3.png" mode=""></image>
				</view>
			</view>
			<view class="item-pice">
				<view class="item-pice-left">
					<view class="item-other" v-if="setContractPrice == '协议价'">
						<text class="pice-num">协议价</text>
					</view>
					<view class="item-other-contain" v-else>
						<text class="pice-num" v-if="setPiceUnit && setPiceUnit !== '议价'">{{orderDetails.price}}</text>
						<text class="pice-unit" v-if="setPiceUnit && setPiceUnit !== '议价'">元/{{setPiceUnit}}</text>
						<text class="pice-unit-other" v-if="setPiceUnit && setPiceUnit == '议价'">{{setPiceUnit}}</text>
					</view>
				</view>
				<view class="item-pice-right" v-if="orderDetails.arrivalPrice && setArrivalPrice">
					<text class="pice-text">{{orderDetails.arrivalPrice}}</text>
					<text class="pice-unit">元/预计到手</text>
				</view>
			</view>
			<view class="item-order-type">
				<view class="item-source" v-if="setSourceType">
					<text class="source-text">{{setSourceType}}</text>
				</view>
				<view class="item-requirement-type" v-if="orderDetails.requirementTypeName">
					<text class="requirement-type-text">{{orderDetails.requirementTypeName}}</text>
				</view>
				<text class="item-work-type-default">
					<text class="type-text">{{ orderDetails.skillName || '其他' }}</text>
				</text>
			</view>

			<view class="item-time-contain">
				发布时间:{{orderDetails.created && orderDetails.created.substring(0,16)}} {{orderDetails.beforeTime}}
			</view>
			<!-- 发单方的报价清单 -->
			<!-- 	<view class="send-order-quotation">
				<quotation-list :list="orderDetails.groupPrices" :beforeOrderId="orderDetails.beforeOrderId"
					pageType="发单" :bidStatus="orderDetails.bizOrderOffer && orderDetails.bizOrderOffer.bidStatus"
					:orderStatus="orderDetails.orderStatus"></quotation-list>
			</view> -->
			<!-- 订单的价格清单、拒单记录、验收标准 -->
			<view class="brief-information-contain">
				<brief-information :priceList="orderDetails.groupPrices" :orderId="orderDetails.id" :pageType="pageType"
					:skillId="orderDetails.skillId">
				</brief-information>
			</view>
		</view>

		<!-- 发单方联系信息 -->
		<view class="order-detailed-information">
			<view class="requirements-description">
				<view class="title">
					需求描述
				</view>
				<view class="item-desc">
					{{orderDetails.requirementDesc}}
				</view>
				<view class="attachment-contain" v-if="openShow">
					<view class="image-contain" v-if="orderDetails.imageList">
						<image-show :enable="true" width="204" :key="orderDetails.imageList" height="204"
							quantityPerLine="3" :imgSrc="orderDetails.imageList"></image-show>
					</view>
					<view class="audio-contain" v-if="orderDetails.voice">
						<mihuo-audio :formData="orderDetails.voice" class="voice" />
					</view>
				</view>
			</view>
			<view class="brief-information" v-if="openShow">
				<view class="item-brief-information">
					<image class="icon-time" src="/static/images/icon_time/icon_time_1.png" mode=""></image>
					<view class="item-other">
						<view class="item-left">
							<view class="item-label">期望上门时间</view>
							<view class="item-value" v-if="orderDetails.expectDate">{{orderDetails.expectDate}}
							</view>
						</view>
					</view>
				</view>
				<view class="item-brief-information" @click="getNavigation()">
					<image class="icon-pin" src="/static/images/icon-address/location_pin.png" mode=""></image>
					<view class="item-other">
						<view class="item-left">
							<view class="item-label">施工地点</view>
							<view class="item-value information-item-address" v-if="orderDetails.provinceName">
								<view class="information-item-address-left">
									{{orderDetails.provinceName}}{{orderDetails.districtName || '暂无'}}{{orderDetails.latAddress}}{{orderDetails.poiName}}<text
										v-if="addressShow">{{orderDetails.address}}</text>
								</view>
								<view class="information-item-address-right">
									<image class="icon-pointer" src="/static/images/icon-address/pointer.png" mode="">
									</image>
									<text class="item-navigation">导航</text>
								</view>

							</view>
						</view>
					</view>
				</view>
				<view class="item-brief-information">
					<image class="icon-user" src="/static/images/icon_user/icon_user_1.png" mode=""></image>
					<view class="item-other">
						<view class="item-left">
							<view class="item-label">联系方式</view>
							<view class="item-value" v-if="orderDetails.contactName">
								{{orderDetails.contactName}}
								{{orderDetails.contactPhone?orderDetails.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'):''}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="item-bottom-unfold" @click="getOpen()">
				<text>点击{{ openShow ? '收起' : '展开' }}</text>
				<image :class="[openShow ? 'public-block' : 'public-none']" src="/static/images/bottom-icon.png"
					class="icon-jian"></image>
			</view>
		</view>


		<!-- 报价师傅，发单方才显示 -->
		<view class="quotation-master" v-if="pageType == '发单'">
			<view class="item-title" id="item-title-master">
				<text class="left">报价师傅</text>
				<text class="right" @click="getQuotationMasterTitle(setQuotationMasterTitle.text)"
					:class="[setQuotationMasterTitle.status == 1 ? 'title-active':'']">{{setQuotationMasterTitle.text}}</text>
			</view>
			<view class="list-contain" v-if="quotationMasterList.length > 0">
				<view class="item-contain" v-for="(item,index) in quotationMasterList" :key="index">
					<view class="public-item-top-contain">
						<view class="item-top-left">
							<u-avatar class="personnel-image" :src="$util.thumbnailImage(item.personInfo.avatar)"
								size="136">
							</u-avatar>
							<!-- <u-avatar class="personnel-image" :src="$util.avatarImage(item.personInfo.avatar)" size="136">
							</u-avatar> -->
							<!-- <u-avatar size="120" :src="$util.thumbnailImage(details.avatar,false)" mode="circle"></u-avatar> -->
							<view class="item-name">
								<text>我的工匠</text>
							</view>
						</view>
						<view class="item-right">
							<view class="top">
								<view class="left">
									<view class="real-name">{{item.personInfo.name}}师傅</view>
									<skill-level-tag style="transform: scale(0.9);" :title="item.personInfo.skillName"
										:level="item.personInfo.level">
									</skill-level-tag>
									<image class="icon-phone" src="/static/images/chat_1.png" @click="getIm(item)"
										mode=""></image>
								</view>
								<view class="item-pice">
									<text class="label">报价</text>
									<text class="num" v-if="item.bidPrice">{{item.bidPrice}}元</text>
								</view>
							</view>
							<view class="label-contain">
								<view class="item-label">
									{{item.personInfo.skillYearNum}}
								</view>
								<view class="item-label">
									金牌认证
								</view>
							</view>
							<view class="item-other">
								<view class="item-other-left">
									<view class="item-other-contain">
										<text class="lable">好评率</text>
										<text class="value">{{item.personInfo.evaluationRate || '100'}}%</text>
									</view>
									<view class="item-other-contain">
										<text class="lable">合作过</text>
										<text class="value">{{item.personInfo.serviceNum || 0}}次</text>
									</view>
								</view>
								<view class="item-other-right" v-if="selectUser &&　isSender"
									@click="selectPersonnel(item)">
									<view class="item-button">
										选择TA
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="item-detailed-list" v-if="item.groupPrices && item.groupPrices.length > 0">
						<view class="select-list">
							<view class="item-list-contain" v-if="item.groupPrices[0]">
								<view class="select-list-item"
									v-for="(item,index) in item.groupPrices[0].productJsonList" :key="index">
									<view class="item-contain-material">
										<image class="icon-zf" src="/static/images/zhengfangx.png" mode=""></image>
										<text class="material-name">{{item.name}}</text>
									</view>
								</view>
							</view>
							<view class="select-list-right" @click="getListingDetails(item)">
								<text>查看清单</text>
								<image src="/static/images/bottom-icon.png" class="icon-jian"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="record-contain" v-if="quotationMasterListViewShow" @click="getAuotationMasterListShow">
				<text>{{ quotationMasterListShow ? '收起' : '展开' }}报价记录</text>
				<image :class="[quotationMasterListShow ? 'public-block' : 'public-none']"
					src="/static/images/bottom-icon.png" class="icon-jian"></image>
			</view>
			<view class="no-user-list" v-if="quotationMasterList.length == 0">
				<custom-no-data title="暂无报价的师傅" src="/static/images/no_order_2.png"></custom-no-data>
			</view>
		</view>

		<!-- 验收资料 -->
		<view class="acceptance-records" v-if="checkedData.length > 0">
			<view class="acceptance-records-contain">
				<view class="title">
					验收资料
				</view>
				<view class="acceptance-records-list" v-for="(item,index) in checkedData" :key="index">
					<view class="item-time">
						<text class="left">0{{index+1}}. 提交时间</text>
						<text class="right">{{item.applyTime}}</text>
					</view>
					<view class="item-desc">
						{{item.applyDesc}}
					</view>
					<view class="image-contain" v-if="item.picFiles != '[]'">
						<image-show :imgSrc="item.picFiles" width="200" height="200"></image-show>
					</view>
					<view class="audio-contain" v-if="item.voiceFiles">
						<mihuo-audio :formData="item.voiceFiles" class="voice" />
					</view>
				</view>
			</view>
		</view>

		<!-- 订单简要信息 -->
		<view class="order-introduction">
			<view class="title">
				订单信息
			</view>
			<view class="item-introduction">
				<text class="lable">订单编号：</text>
				<text class="value">{{orderDetails.orderCode}}</text>
				<image src="/static/icon/copy.png" class="copy-icon" @click="copy(orderDetails.orderCode)" mode="">
				</image>
			</view>
			<view class="item-introduction">
				<text class="lable">上门日期：</text>
				<text class="value">{{orderDetails.expectDate}}</text>
			</view>
			<view class="item-introduction">
				<text class="lable">下单时间：</text>
				<text class="value">{{orderDetails.created}}</text>
			</view>
		</view>


		<!-- 底部操作按钮 -->
		<view class="item-bottom-contian">
			<!-- 技能认证 -->
			<view v-if="certificationShow" @click="getCertification" class="certification-contain">
				<text>{{certificationShowText}}</text>
				<image src="/static/images/jiantou_3.png" mode=""></image>
			</view>
			<view class="item-button-list" v-if="setButtonList.length > 0 && orderDetailsShow  ">
				<scroll-view :scroll-x="true" class="scroll-X">
					<view v-if="setButtonList.length == 1" class="button-single">
						<view class="button-single-item" v-for="(item,index) in setButtonList" :key="index"
							@click="getButton(item.label)">
							{{item.label}}
						</view>
					</view>
					<view v-else class="button-list" :class="setButtonList.length > 3 ? 'button-list-active':'' ">
						<view
							:class="[ item.active ? 'item-button-active': item.borderActive ? 'item-button-border-active':'item-button-default' ]"
							v-for="(item,index) in setButtonList" :key="index" @click="getButton(item.label)">
							{{item.label}}
							<view v-if="item.label == '查看变更项' && item.num > 0 " class="item-num-contain">
								<view class="item-num">{{item.num}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>


		<!-- 查看清单 -->
		<u-popup v-model="detailsShow" border-radius="30" height="1000" mode="bottom" :safe-area-inset-bottom="true"
			:closeable="true">
			<view class="listing-details-contain">
				<scroll-view :scroll-y="true" class="scroll-Y">
					<view class="personnel-contain">
						<view class="public-item-top-contain">
							<view class="item-top-left">
								<u-avatar class="personnel-image"
									:src="$util.thumbnailImage(myCraftsman.userInfo.avatar)" size="136"></u-avatar>
								<!--
									<u-avatar class="personnel-image" :src="$util.thumbnailImage(item.personInfo.avatar)"
										size="136">
									</u-avatar> -->
								<view class="item-name">
									<text>我的工匠</text>
								</view>
							</view>
							<view class="item-right">
								<view class="top">
									<view class="left">
										<view class="real-name">{{myCraftsman.userInfo.personName}}师傅</view>
										<skill-level-tag style="transform: scale(0.9);" title="电工" level="4">
										</skill-level-tag>
										<image class="icon-phone" src="/static/images/chat_1.png"
											@click="getIm(myCraftsman.userInfo)" mode=""></image>
									</view>
								</view>
								<view class="label-contain">
									<view class="item-label">
										三年从业经验
									</view>
									<view class="item-label">
										金牌认证
									</view>
								</view>
								<view class="item-other">
									<view class="item-other-left">
										<view class="item-other-contain">
											<text class="lable">好评率</text>
											<text class="value">{{myCraftsman.evaluationRate || 100}}%</text>
										</view>
										<view class="item-other-contain">
											<text class="lable">合作过</text>
											<text class="value">{{myCraftsman.serviceNum || 0}}次</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="item-pice">
						<text class="num">{{myCraftsman.userInfo.bidPrice}}</text>
						<text class="unit">元/TA的报价</text>
					</view>
					<view class="item-time">
						报价时间 {{myCraftsman.userInfo.created}}
					</view>
					<view class="item-desc-contain" v-if="myCraftsman.userInfo.remark">
						<view class="item-desc-title">
							报价说明
						</view>
						<view class="item-desc">
							{{myCraftsman.userInfo.remark}}
						</view>
					</view>
					<quotation-list :list="myCraftsman.groupPrices" :pageType="pageType"
						:beforeOrderId="orderDetails.beforeOrderId"
						:bidStatus="orderDetails.bizOrderOffer && orderDetails.bizOrderOffer.bidStatus"
						:orderStatus="orderDetails.orderStatus"></quotation-list>
				</scroll-view>
				<view class="button-list" v-if="orderDetails.orderStatus <= 15">
					<view class="item-default item-button">
						发消息
					</view>
					<view class="item-default item-button-active" @click="selectPersonnel()">
						选他接单
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 选择师傅弹框 -->
		<modal-new v-model="modalShow" @click="confirm('师傅')" @cancel="modalCancel('师傅')" titleText="确认选择"
			confirmText="确认">
			<view class="modal-label-contain">
				<view class="label">确认选择{{masterWorker && masterWorker.personInfo.name}}师傅为您服务？</view>
				<view class="label">消息将发送至该人员</view>
			</view>
		</modal-new>

		<!-- 申请换人、投诉、拒绝接单弹窗 -->
		<view class="complaints-contain">
			<sku-popup v-model="showPopup" :title="popupTitle" @clearCur="clearCur">
				<view class="content-sku">
					<view class="content-main">
						<scroll-view :scroll-y="true" class="scroll-y">
							<view class="content-main_res_list">
								<view class="content-main_res" @click="radioValue(item,index)"
									v-for="(item,index) in reasonList" :key="index">
									<view class="radio" :class="{radioSelect:curIndex === index}"></view>
									<view class="reason">{{item.label}}</view>
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

		<!-- 取消订单 -->
		<order-cancel-reason v-if="option.pageType === '发单'" :orderId="orderId" ref="orderCancelReason"
			@cancelReason="cancelReason">
		</order-cancel-reason>

		<!-- 支付弹框 -->
		<order-pay-popup v-model="showPopupPay" @callback="payConfirm" :money="setMoney"></order-pay-popup>

		<!-- 支付成功 -->
		<!-- <pay-success :orderInfo="orderDetails" @setPayFinish="setPayFinish" :paySuccessData="paySuccessData"
			v-if="finished" /> -->

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import customeType from '@/plugins/im/customeType.js'
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
				orderDetailsShow: false,
				isOnePrice: false, // 是否是一口价
				certificationShow: false,
				certificationShowPrompt: false,
				certificationShowText: '完成实名认证和技能认证后才能接单',
				orderId: '',
				isEditor: true,
				piceUnit: '',
				certificationShowIndex: -1,
				finished: false,
				addressShow: false,
				paySuccessData: {},
				checkedData: '',
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
				myCraftsman: {
					userInfo: '',
					detailedList: ''
				},
				buttonList: [{
						label: '取消订单',
						type: '发单',
						active: false,
						orderStatus: [10, 15, 20],
						borderActive: false,
					},
					{
						label: '修改订单',
						type: '发单',
						active: false,
						orderStatus: [10],
						borderActive: false
					},
					{
						label: '刷新订单',
						type: '发单',
						active: false,
						orderStatus: [10],
						borderActive: true
					},
					{
						label: '联系客服',
						type: '发单',
						active: false,
						orderStatus: [15, 20, 30, 35],
						borderActive: true
					},
					{
						label: '去支付',
						type: '发单',
						active: true,
						orderStatus: [20],
						borderActive: true
					},
					{
						label: '联系师傅',
						type: '发单',
						active: false,
						orderStatus: [30, 35],
						borderActive: true
					},
					{
						label: '查看变更项',
						type: '发单',
						active: true,
						orderStatus: [30, 35, 40],
						borderActive: false,
						num: 0,
					},
					{
						label: '确认验收',
						type: '发单',
						active: true,
						orderStatus: [35],
						borderActive: false
					},
					{
						label: '评价服务',
						type: '发单',
						active: true,
						orderStatus: [50],
						borderActive: false
					}
				],
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
			...mapState(['skillId', 'serviceGoodsList']),
			setButtonList() {
				// orderStatus 订单状态: 10=已发布/待确认；20=已确认/待付款；30=已付款/服务中；35=已申请/待验收；40=待结算；50=已完成/待评价；51=已完成/已评价；-1=已取消
				// bidStatus 0=待确认，1=接单方确认失败，2=接单方确认成功（接单方尚未确认）3=发单方接受4=发单方拒绝 5=发单方取消报价6=接单放取消订单 7=关闭竞价订单
				if (this.isSender) {
					let tempList = this.buttonList.filter(item => item.type !== '接单')
					tempList = tempList.filter(item => item.orderStatus.includes(Number(this.orderDetails
						.orderStatus)))

					// 判断是否可以编辑单据
					if (this.orderDetails.orderStatus !== 10) {
						this.isEditor = false
					} else {
						this.isEditor = true
					}
					return tempList
				} else {
					return []
				}
			},
			setTitle() {
				switch (this.orderDetails.orderStatus) {
					case -1:
						return '订单已取消'
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
				}
			},
			selectUser() {
				if (this.orderDetails.orderStatus == 15) {
					return true
				} else {
					return false
				}
			},
			setQuotationMasterTitle() {
				let temp = {
					text: '',
					status: 0,
				}
				if (this.quotationMasterResultList.length > 0) {
					if ([10, 15, 20].indexOf(this.orderDetails.orderStatus) !== -1) {
						if (this.orderDetails.orderStatus == 15) {
							temp.text = `已有${this.quotationMasterResultList.length}位师傅报价`
						} else {
							temp.text = `申请换人接单`
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
					case 2:
						return '竞价'
					case 3:
						return '议价'
					default:
						return '暂无'
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
				let tempUser = uni.getStorageSync('userData').sysUser.userId
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
			isOrderReceiving() {
				// 避免接单方A点击单据之后停留在当前页面未进行操作，把应用切到后台，然后接单方B进入之后进行相关操作之后(该单已属于B)，此时接单方A再次进入操作接单方B单子的情况
				let tempStatus = true
				if (this.orderDetails.orderStatus >= 20) {
					this.quotationMasterList.map(item => {
						if (item.personInfo.userId != uni.getStorageSync('userData').sysUser.userId) {
							tempStatus = false
						}
					})
				}
				return tempStatus
			},
			setArrivalPrice() {
				if (this.orderDetails.bizOrderOffer) {
					return false
				} else {
					return true
				}
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
			setContractPrice() {
				// 服务端企业但，发布抢单，但价格为0
				if ([2, 3].indexOf(Number(this.orderDetails.publishType)) !== -1) {
					if (this.orderDetails.price) {
						return ''
					} else {
						return '协议价'
					}
				}
			},
			setRequirementName() {
				let tempRequirementName = this.orderDetails.requirementName
				if (tempRequirementName) {
					return tempRequirementName
				} else {
					return this.orderDetails &&
						`${this.orderDetails && this.orderDetails.poiName}需要${this.orderDetails.requirementTypeName}${this.orderDetails.skillName}`
				}
			},
			setOrderModer() {
				switch (Number(this.orderDetails.priceWay)) {
					case 1:
						return '一口价模式'
					case 2:
						return '竞价模式'
					case 3:
						return '议价模式'
				}
			},
		},
		onLoad(option) {
			this.option = option
			this.getSkillNameList()
		},
		onShow() {
			this.setPageType()
		},
		methods: {
			goBackPage() {
				let pages = getCurrentPages()
				let lastPage = pages[pages.length - 2].route

				// 清空组合报价
				if (this.serviceGoodsList.length > 0) {
					this.$store.commit('setServiceGoodsList', [])
				}
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
			setPageType() {
				this.pageType = this.option.pageType
				this.getBidOrderList()
				this.getDetails()
			},
			getDetails() { // 获取订单信息
				if (!this.option.id) {
					return
				}
				this.$httpApi.getOrderById(this.option.id).then(res => {
					if (!res) {
						return
					}
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
						res['imageList'] = JSON.stringify(tempAttachments.filter(item => item.type == 'img' || item.type == 'video'))
						if (tempAttachments.length > 0) {
							tempAttachments.map(item => {
								if (item.timeLength) {
									res['voice'] = item
								}
							})
						}
					}

					// 发单方组合报价
					if (res.groupPrices && res.groupPrices.length > 0) {
						res.groupPrices.map(item => {
							item['productJsonList'] = item.productJson && JSON.parse(item.productJson)
						})
					}

					// 接单方组合报价
					if (res.bizOrderOffer && res.bizOrderOffer.groupPrices && res.bizOrderOffer.groupPrices
						.length > 0) {
						res.bizOrderOffer.groupPrices.map(item => {
							item['productJsonList'] = item.productJson && JSON.parse(item.productJson)
						})
					}
					this.orderDetails = res
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
					}
					if (this.orderDetails.orderStatus >= 30) {
						this.getPaySuccessData()
					}
					this.getCheckedData()
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
						res.offerList = res.offerList.filter(item => [4, 6].indexOf(item.bidStatus) == -1)
						this.quotationMasterResultList = res.offerList
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
					}
				})
			},
			getCheckedData() { // 验收资料
				this.$http.get("order/customer/bizorderacceptance/getByOrderId", {
					orderId: this.orderDetails.id
				}).then(res => {
					if (res) {
						this.checkedData = res
					}
				})
			},
			getChangeRecords() { // 变更项
				this.$httpApi.selectChangeList({
					orderCode: this.orderDetails.orderCode,
					size: 999,
					orderId: this.orderDetails.id
				}).then(res => {
					if (res) {
						this.changeRecordsList = res.records.filter(item => item.payStatus == 0)
						this.buttonList.map(item => {
							if (item.label == '查看变更') {
								item.num = this.changeRecordsList.length
							}
						})
					}
				})
			},
			setSelectActive(index) {
				this.selectActiveIndex = index
				if (index) {
					uni.createSelectorQuery().select("#item-title-master")
						.boundingClientRect(res => {
							if (res) {
								uni.pageScrollTo({
									duration: 200,
									scrollTop: res.top
								})
							}
						}).exec()
				}
			},
			copy(data) {
				uni.setClipboardData({
					data,
					success: () => { // 复制成功的回调函数
						this.$util.toast("复制成功");
					}
				});
			},
			getSkillNameList() {
				this.$httpApi.getWorkType({
					clientType: 'platform',
					size: 999
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
									let tempJobCode = this.skillNameList.find(item => this.orderDetails.skillId ==
										item.skillId)
									if (tempJobCode) {
										if (tempJobCode.jobCode == 'JOB_WORKER') {
											tempJobCode['tempSkillName'] = '工人'
										} else {
											tempJobCode['tempSkillName'] = tempJobCode.skillName
										}
										this.toPage(
											`/pages/certification/information?jobCode=${tempJobCode.jobCode}&name=${tempJobCode.tempSkillName}&skillId=${tempJobCode.skillId}`
										)
									} else {
										this.$util.toast("该工种不是平台工种,不支持技能认证");
									}
								}
							})
							break;
						case 2:
							this.toPage('/pages/user/realName')
							break
					}
				}
			},
			getOpen() {
				this.openShow = !this.openShow
			},
			getAuotationMasterListShow() {
				this.quotationMasterListShow = !this.quotationMasterListShow
				if (this.quotationMasterListShow) {
					this.quotationMasterList = this.quotationMasterResultList
				} else {
					this.quotationMasterList = this.quotationMasterResultList.slice(0, 3)
				}
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
							`/pages/orderReceiving/changeRecords?orderCode=${this.orderDetails.orderCode}&pageType=接单&companyId=${this.orderDetails.companyId}&orderId=${this.orderDetails.id}`
						)
						break;
					case '编辑单据':
						this.toPage(`/pages/publishTask/IssueOrder?type=update&id=${this.option.id}`)
						break
				}

			},
			getQuotationMasterTitle(type) {
				if (this.quotationMasterList.length > 0) {
					if (['申请换人接单', '投诉'].includes(type)) {
						const tempReason = type === '投诉' ? 'complaint_reason' : 'change_person_reason'
						this.popupTitle = type === '投诉' ? '投诉师傅' : '申请换人原因'
						this.$http.get("admin/dict/type", {
							type: tempReason
						}).then(res => {
							if (res) {
								this.reasonList = res
								this.replacementReason = this.reasonList[this.curIndex].label
								this.complaintReason = this.reasonList[this.curIndex].label
								this.formData.replaceReason = this.reasonList[this.curIndex].label
								this.showPopup = true
							}
						})
					}
				}
			},
			getRefusal() {
				this.popupTitle = '拒单原因'
				this.$http.get("admin/dict/type", {
					type: 'reasons_for_refusal'
				}).then(res => {
					if (res) {
						this.reasonList = res
						this.refusalReason = this.reasonList[this.curIndex].label
						this.formData.replaceReason = this.reasonList[this.curIndex].label
						this.showPopup = true
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
					this.$httpApi.setReject({
						orderId: this.orderDetails.id,
						reason: this.refusalReason,
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
					this.formData.replaceReason = ''
				}
			},
			getListingDetails(item) {
				this.myCraftsman.userInfo = item
				this.myCraftsman.detailedList = ''
				this.myCraftsman['evaluationRate'] = item.personInfo.evaluationRate
				this.myCraftsman['serviceNum'] = item.personInfo.serviceNum
				item.groupPrices.map(item => {
					if (!Array.isArray(item.productJson)) {
						item['productJson'] = item.productJson && JSON.parse(item.productJson)
					}
				})
				this.myCraftsman['groupPrices'] = item.groupPrices
				this.detailsShow = !this.detailsShow
			},
			selectPersonnel(item) {
				this.modalShow = !this.modalShow
				this.masterWorker = item
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
			},
			getButton(typeName) {
				if (this.orderDetails.orderStatus < 30) {
					if (this.certificationShow) {
						this.certificationShowPrompt = !this.certificationShowPrompt
						return
					}
				}
				this.debounce(() => {
					switch (typeName) {
						case '提交验收':
							let tempParameter = this.orderDetails.bizOrderOffer
							if (tempParameter) {
								this.toPage(
									`/pages/orderReceiving/addAcceptance?orderCode=${this.orderDetails.orderCode}&skillId=${this.orderDetails.skillId}&id=${this.orderDetails.id}&applyPersonId=${tempParameter.personId}&applyPersonName=${tempParameter.personName}&applySkillName=${tempParameter.skillName}`
								)
							}
							break;
						case '取消订单':
							this.orderId = this.option.id
							this.$refs.orderCancelReason.open()
							break;
						case '修改订单':
							this.toPage(`/pages/publishTask/IssueOrder?type=update&id=${this.option.id}`)
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
							this.toPage(
								`/pages/message/group/index?toUserId=${this.orderDetails.companyId}&type=constructionOrder&orderId=${this.orderDetails.id}`
							)
							break;
						case '去支付':
							this.showPopupPay = !this.showPopupPay
							break;
						case '查看变更项':
							let masterOther = this.quotationMasterList[0]
							this.toPage(
								`/pages/orderReceiving/changeRecords?orderCode=${this.orderDetails.orderCode}&companyId=${this.orderDetails.companyId}&orderId=${this.orderDetails.id}&toUserId=${masterOther.personInfo.userId}&toUserName=${masterOther.personInfo.name}`
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

					}
				}, 200)

			},
			payConfirm(data) {
				let param = {
						payMethod: data.payType,
						orderId: this.orderDetails.id,
						clientId: 'bmini'
					},
					payType = '';
				if (data.payType === 3) {
					plus.share.getServices((res) => {
						let sweixin = null
						for (let i in res) {
							if (res[i].id == 'weixin') {
								sweixin = res[i]
							}
						}
						//唤醒微信小程序
						if (sweixin) {
							this.$util.requestPay(data.payType, this.orderDetails.id, 'workOrder')
							// const userInfo = uni.getStorageSync('userInfo');
							// const token = userInfo.token_type + ' ' + userInfo.access_token;
							// let miniProgramType = process.env.NODE_ENV === 'production' ? 0 : 1
							// const search =
							// 	`amount=${Math.abs(Number(this.masterObj.bidPrice))}&payMethodKey=${data.payType}&token=${token}`
							// sweixin.launchMiniProgram({
							// 	id: 'gh_b091d7f9d23e', //
							// 	type: miniProgramType, //小程序版本  0-正式版； 1-测试版； 2-体验版。
							// 	path: `pages/wxPay/wxPay?${search}` //小程序的页面,用传的参数在小程序接值判断跳转指定页面
							// });
						}
					})
				} else {
					this.$http.post('order/customer/pay/order', param).then((res) => {
						if (res && res.payInfo) {
							this.$util.requestPay(data.payType, res.payInfo, 'workOrder')
						}
					})
				}
			},
			// 获取订单支付信息
			getPaySuccessData() {
				if (uni.getStorageSync('curOrder') != this.orderDetails.id) {
					this.$http.get("order/orderpaylog/getOrderByBusinessId", {
						businessId: this.orderDetails.id
					}).then(res => {
						if (res) {
							uni.setStorageSync('curOrder', this.orderDetails.id);
							this.paySuccessData = res;
							this.finished = true;
						} else {
							this.finished = false;
						}
					})
				}
			},
			setPayFinish(val) {
				this.finished = val;
				this.showPopupPay = false;
				this.getDetails()
			},
			getIm(item) {
				if (!item.personInfo.userId) {
					return
				}
				if (!this.orderDetails.id) {
					return
				}
				this.toPage(
					`/pages/message/chat/index?toUserId=${item.personInfo.userId}&type=constructionOrder&orderId=${this.orderDetails.id}&toUserName=${item.personInfo.name}`
				)
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
						default:
							return 'item-work-type-big'
					}
				}
			}
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

	.certification-contain {}

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
				margin-top: 4rpx;
				margin-left: -6rpx;

				.item-source {
					transform: scale(0.85);
					border-radius: 4rpx;
					background-color: rgba(255, 93, 53, 0.1);
					padding: 2rpx 4rpx;

					.source-text {
						font-size: 24rpx;
						color: #FF5D35;
					}
				}

				.item-requirement-type {
					transform: scale(0.85);
					border-radius: 4rpx;
					background-color: #E5EAF6;
					padding: 2rpx 8rpx;

					.requirement-type-text {
						font-size: 24rpx;
						color: $themeColor;
					}
				}

				.item-work-type-default {
					transform: scale(0.85);
					border-radius: 4rpx;
					background-color: #E5EAF6;
					padding: 4rpx 8rpx;

					.type-text {
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

			.brief-information-contain {
				margin-left: -38rpx;
			}

		}




		.order-detailed-information {
			background-color: #fff;
			margin-top: 8rpx;
			padding: 24rpx 32rpx;

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

			.requirements-description {

				.title {
					font-size: $middleAddFontSize;
					color: $seconFontColor;
					font-weight: bold;
				}

				.item-desc {
					margin-top: 12rpx;
					font-size: $middleFontSize;
					color: #666666;
				}

				.image-contain {
					margin-top: 20rpx;
				}

				.audio-contain {
					margin-top: 8rpx;
				}
			}


			.item-bottom-unfold {
				display: flex;
				align-items: center;
				margin-top: 40rpx;
				justify-content: center;

				image {
					margin-left: 10rpx;
				}

				text {
					font-size: $smiddleFontSize;
					color: #A7A7A7;
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
		}

		.brief-information {
			margin-top: 32rpx;
			background-color: #fff;
			padding-top: 36rpx;
			border-top: 2rpx solid #F6F6F6;

			.icon-time {
				width: 36rpx;
				height: 36rpx;
			}

			.icon-pin {
				width: 38rpx;
				height: 38rpx;
			}

			.icon-pointer {
				width: 28rpx;
				height: 28rpx;
			}

			.icon-pointer {
				width: 28rpx;
				height: 28rpx;
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
				margin-bottom: 24rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.item-other {
					margin-left: 20rpx;
					display: flex;
					flex: 1;

					.item-left {
						width: 100%;

						.item-label {
							line-height: 1;
							font-size: $middleFontSize;
							color: $viceFontColor;
							margin-bottom: 6rpx;
						}

						.information-item-address {
							display: flex;
							justify-content: space-between;
						}

						.item-value {
							font-size: $middleFontSize;
							color: $seconFontColor;


							.information-item-address-left {
								max-width: 500rpx;
								font-size: $middleFontSize;
								color: $seconFontColor;
							}

							.information-item-address-right {
								width: 90rpx;
								white-space: nowrap;

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
					padding: 46rpx 52rpx 36rpx 40rpx;
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
			padding: 0rpx 50rpx 46rpx 50rpx;
			border-radius: 16rpx;
			margin-top: 10rpx;

			.acceptance-records-contain {
				// border-top: 2rpx solid #EEEEEE;
				padding-top: 36rpx;

				.acceptance-records-list {
					margin-bottom: 20rpx;
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

		.quotation-list {
			padding: 34rpx 32rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 10rpx;

			.quotation-description {
				.item-top {
					display: flex;
					align-items: center;
					justify-content: space-between;

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

					text {
						font-size: $smallFontSize;
						color: $viceFontColor;
					}

					.label {
						margin-right: 10rpx;
					}
				}

				.change-records {
					margin-top: 8rpx;
					display: flex;

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
					margin-top: 36rpx;
					padding-bottom: 50rpx;
					border-bottom: 2rpx solid #EEEEEE;

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

				.item-title {
					font-size: $middleFontSize;
					color: $seconFontColor;
					font-weight: bold;
				}


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
		}

		.item-bottom-contian {
			position: fixed;
			bottom: 0rpx;
			width: 100%;

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
				padding: 28rpx 20rpx;
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
					// padding: 16rpx 24rpx;
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

	.send-order-quotation {
		// padding: 0 18rpx;
	}

	.quotation-item-list-contain {
		margin-top: 22rpx;

		.item-title {
			color: $seconFontColor;
			font-size: $smiddleFontSize;
			font-weight: bold;
			margin-bottom: 22rpx;
		}

		.item-title-contain {
			font-size: 28rpx;
			color: #303133;
			margin-bottom: 16rpx;
		}

		.icon-image {
			width: 32rpx;
			height: 30rpx;
		}


		.item-quotation {
			margin-bottom: 26rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.item-quotation-contain {
				display: flex;
				justify-content: space-between;

				.left {
					.item-index {
						color: $viceFontColor;
						font-size: $smallFontSize;
						margin-right: 4rpx;
					}

					.item-name {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-right: 8rpx;
					}

					.item-specifications {
						color: $viceFontColor;
						font-size: $smallFontSize;
					}
				}

				.right {
					font-size: $middleFontSize;
					color: $errorFontColor;
				}
			}
		}

		.listing-contian {

			.item-title-contian {
				display: flex;
				justify-content: space-between;
				margin-bottom: 22rpx;
			}

			.item-title-left {
				display: flex;
				align-items: center;

				.item-skill-name {
					color: #000000;
					font-size: 28rpx;
				}
			}

			.item-title-right {
				.item-active {
					font-size: 26rpx;
					color: #002FA5;
				}
			}

			.item-quotation-contain {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;

				.left {
					.item-index {
						color: $viceFontColor;
						font-size: $smallFontSize;
						margin-right: 4rpx;
					}

					.item-name {
						color: $seconFontColor;
						font-size: $middleFontSize;
						margin-right: 8rpx;
					}

					.item-specifications {
						color: $viceFontColor;
						font-size: $smallFontSize;
					}
				}

				.right {
					font-size: $middleFontSize;
					color: $errorFontColor;
				}
			}

			.item-total {
				background: #F9F9F9;
				border-radius: 10rpx;
				padding: 0rpx 18rpx;
				height: 84rpx;
				line-height: 84rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.item-total-left {
					font-size: 24rpx;
					color: #909199;
				}

				.item-total-right {

					.item-text {
						font-size: 24rpx;
						color: #909199;
					}

					.item-price {
						font-size: 46rpx;
						color: #FF5D35;

					}

					.item-unit {
						font-size: 24rpx;
						color: #FF5D35;
					}
				}
			}
		}
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
				margin-top: 32rpx;
				padding-bottom: 40rpx;
				border-bottom: 2rpx solid #EEEEEE;

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
				max-height: 380rpx;
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

	.sku-main {}

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
</style>
