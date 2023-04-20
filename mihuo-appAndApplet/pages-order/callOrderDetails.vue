<template>
	<view>
		<z-nav-bar fontColor="#141414" bgColor="#FFFFFF" :backState="3000" @backClick="goBack">
			<view class="nav-bar-title" slot="default">需要一名{{ orderInfo.skillName || '工人' }}</view>
		</z-nav-bar>
		<view>
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="88" :topbar="true" :down="downOption"
				:up="upOption" @down="downCallback">
				<view class="order-stage">
					<!-- 已拒绝 -->
					<view v-if="orderInfo.orderStatus == '-2' " class="confirm-quotation">
						<view class="order-stage_tips">拒绝原因</view>
						<view class="order-stage_remarks">{{ orderInfo.reason ||'' }}</view>
					</view>
					<view v-if="orderInfo.orderStatus == 10 " class="confirm-quotation">
						<view class="order-stage_tips">订单已发布</view>
						<view class="order-stage_remarks">正在等待师傅接单中...</view>
						<view class="order-stage_bottom">
						</view>
					</view>
					<view v-if="orderInfo.orderStatus == 15" class="confirm-quotation">
						<view v-if="curDoSteps == 2">
							<view class="order-stage_top">
								<view>
									<text class="bidPrice">{{ Math.floor(masterObj.bidPrice) || 0 }}</text>
									<text class="bidPrice"
										style="font-size:32rpx">{{ masterObj.bidPrice | priceFormat }}</text>
									<text class="price_tips">{{ orderInfo.priceWay == 1?"元/一口价":"元/TA的报价" }}</text>
								</view>
								<view class="bid_time">报价时间 {{ masterObj.updated || ''}}</view>
							</view>
							<view class="order-stage_title"><text>报价说明</text></view>
							<view class="order-stage_content">{{ masterObj.bidDescription || '暂无报价说明'}}</view>
						</view>
						<view class="order-communication"
							v-if="communicationRecord && communicationRecord.length">
							<view class="order-stage_title">
								<text>师傅沟通信息</text>
								<view v-if="communicationRecord.length>1" @click="moreRecord()">
									更多沟通记录
									<u-icon name="arrow-right" color="#808080" size="22"></u-icon>
								</view>
							</view>
							<view v-for="(item,index) in communicationRecord" :key="index" class="order-communication_item">
								<view v-if="index === 0">
									<view class="flex-Record">
										<u-avatar class="avatar" size="50" :src="$util.avatarImage(communicationRecordInfo.bidUserId)"/>
										<view class="name">{{ communicationRecordInfo.personName }}</view>
										<text class="skillName">{{ communicationRecordInfo.skillName }}</text>
									</view>
									<view class="order-communication_tags">
										<view>
											<text class="tags-tag">{{ item.type==0?"线上沟通":"线下沟通" }}</text>
											<text v-if="item.intention == 1">
												<text class="tags-tag">{{ setResult(item.intention) }}</text>
												<text class="tags-tag" v-if="item.requirementTypeName">
													{{ item.requirementTypeName}}</text>
												<text class="tags-tag" v-if="item.abandonedReason">
													{{ item.abandonedReason}}</text>
											</text>
										</view>
										<text class="tags-time">{{item.created && item.created.substring(0,16)}}</text>
									</view>
									<view class="order-communication_content">
										{{ item.intention == 1?
										`[${communicationRecordInfo.skillName || ''}]${communicationRecordInfo.personName || ''}
										已经和您进行了详细沟通，如果您觉得他还不错，请确认选择他作为您的${communicationRecordInfo.skillName || ''}帮您落地装修事宜。`:
										`[${communicationRecordInfo.skillName || ''}]${communicationRecordInfo.personName || ''}
										已经和您进行了详细沟通，平台数据分析判断他不适合您，您可以重新发布订单再选择！`
										}}
									</view>
									<view class="communication-image" v-if="item.annexImage">
										<image-show :imgSrc="item.annexImage" width="210" height="210"></image-show>
									</view>
									<view class="communication-audio" v-if="item.annexAudio">
										<mihuo-audio :formDate="item.annexAudio" />
									</view>
								</view>
							</view>
						</view>
						<view v-else>
							<view v-if="orderInfo.pendingList && orderInfo.pendingList.length">
								<view class="order-stage_content" v-for="(v,i) in orderInfo.pendingList" :key="i">{{ v.title || ''}}</view>
							</view>
							<view class="order-stage_bottom">
								<text class="look_bottom" @click="goChat">联系师傅</text>
							</view>
						</view>
						<view class="order-stage_bottom">
							<view v-if="communicationRecord && communicationRecord.length">
								<text v-if="communicationRecord[0].intention != 1" class="confin_bottom"
									@click="againBid">重新发布</text>
								<view v-else>
									<view v-if="orderInfo.deliveryType != 0 || masterObj.bidStatus == 2">
										<text v-if="masterObj.bidStatus == 2" class="look_bottom" :class="{
											'contact-no':masterObj.bidStatus == 8,
											'contact':masterObj.bidStatus != 8,
										}" @click="noConfirm">不确认</text>
										<text class="look_bottom" v-if="curDoSteps == 2"
											@click="saveFirmOrder">查看报价清单</text>
										<text class="confin_bottom"
											@click="saveFirmOrder">{{ curDoSteps == 2?'确认报价':'确认选TA'}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 风险项确认 -->
					<view v-if="curDoSteps == 3" class="confirm-quotation">
						<view class="order-stage_remarks" style="padding-bottom:20rpx">{{riskObj.num}}个风险项需您确认</view>
						<view v-for="(item, index) in riskList" :key="index" class="risk-item">
							<view class="risk-list">
								<view class="seq">{{ index + 1 > 10 ? index + 1 : '0' + (index + 1) }}、</view>
								<view class="name">{{ item.name }}</view>
								<view class="buttom" v-if="item.status == 0" @click="riskConfirm(item.id)">确认</view>
								<view class="buttom buttom_row" v-else>已确认</view>
							</view>
							<view class="image_show" v-if="item.attachments">
								<order-mh-image-show :imgSrc="item.attachments" width="100" height="100" right="20" />
							</view>
						</view>
					</view>
					<!-- 待支付 -->
					<view v-if="curDoSteps == 4 && orderInfo.orderStatus == 20" class="confirm-quotation">
						<view class="order-stage_top">
							<view>
								<text class="bidPrice">{{ Math.floor(masterObj.bidPrice) || 0}}</text>
								<text class="bidPrice" style="font-size:32rpx">{{ masterObj.bidPrice | priceFormat }}</text>
								<text>元/订单总价</text>
							</view>
						</view>
						<view class="order-agreement">
							<u-checkbox size="30" class="checkbox" v-model="agreement" shape="circle"></u-checkbox>
							<view class="order-agreement_title" @click="()=>agreement = !agreement">我已阅读并同意</view>
							<text @click="lookAgreement">《发单协议》</text>
						</view>
						<view class="order-stage_bottom">
							<!-- <text class="look_bottom" @click="cancelOrder">取消订单</text> -->
							<text class="confin_bottom" :class="{'confin_bottom_no':!agreement}" @click="arousePay">去支付</text>
						</view>
					</view>
					<!-- 服务中 -->
					<view v-if="curDoSteps==5">
						<!-- 变更项 -->
						<view class="confirm-quotation" v-if="changeObj && changeObj.id">
							<view class="order-stage_tips">师傅增加了{{changeList.length}}个变更项</view>
							<view class="order-stage_remarks">
								变更金额为{{ Math.abs(changeObj.alterationMoney) || '' }}元，为了不影响施工进度，请您尽快确认</view>
							<view class="order-stage_bottom">
								<text class="confin_bottom" @click="seeChangeData">变更确认</text>
							</view>
						</view>
						<view class="confirm-quotation" v-else>
							<view class="order-stage_tips">服务中</view>
							<view class="order-stage_remarks">
								{{(masterObj.skillName || '') + (masterObj.personName || '')}}正在加班加点赶工中...
							</view>
						</view>
					</view>
					<!-- 验收 -->
					<view v-if="curDoSteps==6 || orderInfo.orderStatus == 35" class="confirm-quotation">
						<view class="order-stage_tips">师傅已完工请您验收</view>
						<view class="order-stage_remarks">{{ checkedData.applyDesc || ''}}</view>
						<view class="order-stage_bottom">
							<text class="confin_bottom" @click="confirmCheck">去验收</text>
						</view>
					</view>
					<!-- 评价 -->
					<view v-if=" orderInfo.orderStatus == 40 || orderInfo.orderStatus == 50 " class="confirm-quotation">
						<view class="order-stage_tips">订单已完成</view>
						<view class="order-stage_remarks">感谢您对觅活的支持，对师傅的服务做个评价吧~</view>
						<view class="order-stage_bottom">
							<text class="confin_bottom" @click="evaluate">去评价</text>
						</view>
					</view>
					<!-- 重新发布 -->
					<view v-if="orderInfo.orderStatus == -1 " class="confirm-quotation">
						<view class="order-stage_tips">订单已取消发布</view>
						<view class="order-stage_remarks">您可以重新发布</view>
						<view class="order-stage_bottom">
							<text class="confin_bottom" @click="againBid">重新发布</text>
						</view>
					</view>
					<!-- 材料订单支付 -->
					<view v-if="curDoSteps == 8 && curMasterObj" class="confirm-quotation">
						<view class="order-stage_remarks">{{ curMasterObj.title}}</view>
						<view class="order-stage_bottom">
							<text class="confin_bottom" @click="goShopMall(curMasterObj)">去支付</text>
						</view>
					</view>
				</view>
				<!-- 订单日志 -->
				<view v-if="orderInfo.lastLog && orderInfo.lastLog.id">
					<view @click="lookOrderLog" class="order_log">
						<view class="order_log-left">
							<u-icon class="order-log_info" name="info-circle" color="#808080"></u-icon>
							<text>{{ orderInfo.lastLog.content }}</text>
						</view>
						<u-icon name="arrow-right" size="20" color="#808080"></u-icon>
					</view>
				</view>
				<view class="main-container" :class="{
					'other':orderInfo.priceWay != 2 || orderInfo.orderStatus >=20
				}">
					<!-- 师傅信息 -->
					<view class="worker-info" v-if="orderInfo.orderStatus >=20">
						<order-mh-worker-info :orderInfo="orderInfo" :workerInfo="workerInfo" :masterObj="masterObj"
							@contactMe="contactWork" @orderReceiving="choiceWorker" @refresh="backRefresh"
							:subOrder="workerInfo.afterOfferList" />
					</view>
				</view>
				<!-- 确认后订单信息统计概述 -->
				<view v-if="orderInfo.orderStatus>=20" style="padding:0 30rpx 30rpx">
					<order-mh-confirm-order ref="order" :orderInfo="orderInfo" :subOrder="workerInfo.afterOfferList"
						:masterObj="masterObj" @callback="backRefresh" />
				</view>
				<!-- 订单信息 -->
				<view class="order-info">
					<mh-order-info :communicationRecord="communicationRecord" :orderInfo="orderInfo"
						:newChangeData="newChangeData" :masterObj="masterObj" />
				</view>
				<!-- 底部按钮 -->
				<view class="btn_view">
					<!-- 联系客服 -->
					<view class="action-content">
						<!-- sop交互跳转到我的家查看进度 -->
						<view class="btm-btn" v-if="orderInfo.deliveryType !=0 && [30].indexOf(orderInfo.orderStatus) !== -1 && orderInfo.projectId>0">
							<button class="cancel" type="default" @click="lookProgress">查看进度</button>
						</view>
						<view class="btm-btn" v-if="[15, 20, 30, 35, 40, 50, 51].indexOf(orderInfo.orderStatus) !== -1">
							<button class="cancel" type="default" @click="contactService">联系客服</button>
						</view>
						<!-- 项目管家类型订单 服务中时不允许取消 -->
						<view class="btm-btn" style="left: 240rpx;"
							v-if="[5,10, 15, 20].indexOf(orderInfo.orderStatus) !== -1">
							<button class="cancel" type="default" v-if="orderInfo.cancelFlag != 1"
								@click="cancelOrder">取消订单</button>
							<button class="cancel" type="default" v-else @click="cancelOrder">已申请取消</button>
						</view>
						<!-- 其他单工种类型订单 服务中时允许取消 -->
						<view class="btm-btn" style="left: 240rpx;"
							v-if="orderInfo.deliveryType == 0 && [30].indexOf(orderInfo.orderStatus) !== -1">
							<button class="cancel" type="default" v-if="orderInfo.cancelFlag != 1"
								@click="cancelOrder">取消订单</button>
							<button class="cancel" type="default" v-else @click="cancelOrder">已申请取消</button>
						</view>
					</view>
				</view>
			</mescroll-uni>
			<!-- 订单各阶段信息 -->
			<!-- 选择师傅接单详情 -->
			<mh-order-receiving v-model="choiceWorkerPopup" @confirmChoice="confirmChoice" :orderInfo="orderInfo"
				:workerInfo="curWorkerInfo" />

			<!-- 取消订单原因弹窗 -->
			<order-mh-sku-popup v-model="showCancelPopup" title="取消订单原因" @clearCur="clearCur">
				<view class="content-sku">
					<view class="content-main">
						<view class="content-main_res" @click="radioValue(item, index)"
							v-for="(item, index) in cancelOrderReasonList" :key="index">
							<view class="radio" :class="{ radioSelect: curIndex === index }"></view>
							<view class="reason">{{ item.label }}</view>
						</view>
					</view>
					<bottom-button title="确认取消" color="#141414" :styleObj="{ background: '#EBEBEB' }"
						@click="confirmCancel" />
				</view>
			</order-mh-sku-popup>

			<!-- 报价不确认弹窗（上门报价,竞价模式） -->
			<order-mh-sku-popup v-model="showUnconfirmedPopup" title="不确认报价" align="left" height="40%">
				<view class="content-sku">
					<view class="content-main">
						<view class="content-main_res" @click="radioValue(item, index)"
							v-for="(item, index) in unconfirmedReasonList" :key="index">
							<view class="reason2">
								<view>{{ item.label }}</view>
								<view>{{ item.tips }}</view>
							</view>
							<view class="radio2" :class="{ radioSelect2: curIndex === index }"></view>
						</view>
					</view>
					<bottom-button title="确认提交" color="#141414" :styleObj="{ background: '#EBEBEB' }"
						@click="unconfirmed" />
				</view>
			</order-mh-sku-popup>
			<!-- 报价不确认弹窗（一口价） -->
			<order-mh-sku-popup v-model="showFixedPricePopup" height="400rpx" title="">
				<view class="content-sku">
					<view class="content-main">
						<view class="content-main_row">是否换人接单？</view>
						<view class="content-main_row1">不合适不满意，换个师傅接单再谈</view>
					</view>
					<view class="button">
						<view @click="() => (showFixedPricePopup = false)">暂时不用</view>
						<view @click="replacement">换个师傅</view>
					</view>
				</view>
			</order-mh-sku-popup>

			<!-- 支付弹窗 -->
			<order-mh-pay-popup v-model="showPopupPay" @callback="payConfirm" :money="amount" />

			<!-- 重新发布 -->
			<call-master v-model="isCallMaster" :data="curMaster" :completeAddress="completeAddress"
				:orderId="orderInfo.id" @getWorkerInfo="backRefresh">
			</call-master>
			<!-- 服务协议 -->
			<mh-agreement
				v-model="isAgreement"
				v-if="isAgreement"
				:info="agreementInfo"
			></mh-agreement>
		</view>
	</view>
</template>

<script>
	import {
		masterAvatar
	} from "@/plugins/orderStatus"
	export default {
		data() {
			return {
				newChangeData: {},
				ipImage: masterAvatar,
				paySuccessData: {},
				checkedData: {},
				finished: false,
				offerId: '',
				orderInfo: {},
				workerInfo: {},
				curWorkerInfo: {},
				detailId: '',
				turnClass: '',
				contactPopup: false,
				contactInfo: {},
				choiceWorkerPopup: false,
				showCancelPopup: false,
				showUnconfirmedPopup: false,
				showFixedPricePopup: false,
				showPopupPay: false,
				isWorker: false,
				curIndex: null,
				cancelReason: '',
				unconfirmedReason: '',
				cancelOrderReasonList: [],
				unconfirmedReasonList: [{
						label: '报价不合适，谈一谈重新报个价',
						tips: '多和师傅沟通，好价格谈出来'
					},
					{
						label: '协商无法达成一致，换个人接单',
						tips: '沟通协商无效，换个师傅接单再谈'
					}
				],
				masterObj: {}, //接单师傅信息
				formData: {},
				orderCloseTime: '',
				changeList: [],
				changePrice: null,
				orderCode: '',
				url: '',
				timer: null,
				subOrder: [],
				amount: 0,
				isCallMaster: false,
				completeAddress: {},
				curMaster: {},
				riskList: [],
				riskObj: {
					isCheck: false, //是否有待确认风险项
					num: 0 //待确认风险项条数
				},
				changeObj: {},
				options: {},
				curMasterObj: null,
				// curDoSteps:null,
				communicationRecord: [],
				communicationRecordInfo: {},
				offerRecordId: '',
				agreement:true,
				isAgreement:false,
				downOption: {
					auto: false
				},
				upOption: {
					auto: false,
					use: false,
					onScroll: true
				},
				mescroll: null,
				isRefresh:false,
				isBackHome: false, // 是否返回首页
				agreementInfo:{},	//协议内容
			}
		},
		computed: {
			curDoSteps() {
				let flag = -1;
				this.curMasterObj = null;
				if (!this.orderInfo.pendingList) return flag
				let businessCode = this.orderInfo.pendingList.map((item) => {
					return item.businessCode //拿出接口的businessCode值
				})

				let sellerBusinessCode = Array.from(new Set(businessCode));
				if (sellerBusinessCode.find((v => v.indexOf('no_order_offer') != -1)) ||
					sellerBusinessCode.find((v => v.indexOf('no_again_order_offer') != -1))) {
					// 抢单，未报价 || 业主不确认报价
					flag = 1;;
				}
				if (sellerBusinessCode.find((v => v.indexOf('confirm_order_offer') != -1)) ||
					sellerBusinessCode.find((v => v.indexOf('modify_order_offer') != -1))) {
					// 修改报价 || 未确认报价
					flag = 2;
				}
				if (this.orderInfo.orderStatus >= 20 || this.orderInfo.orderStatus < 40) {
					let isRisk = sellerBusinessCode.find((v => (v.indexOf('no_risk_order_offer') != -1 || v.indexOf(
						'add_risk') != -1)))
					if (isRisk) {
						// 有风险项
						flag = 3;
					} else {
						// 待支付
						if (sellerBusinessCode.find((v => v.indexOf('no_pay_order_offer') != -1))) {
							flag = 4;
						}
						// 变更
						if (sellerBusinessCode.find((v => v.indexOf('change') != -1))) {
							flag = 5;
						}
						// 待验收
						if (sellerBusinessCode.find((v => v.indexOf('submit_acceptance') != -1))) {
							flag = 6;
						}
						// 开单支付
						if (sellerBusinessCode.find((v => v.indexOf('materialPayment') != -1))) {
							flag = 8;
							this.curMasterObj = this.orderInfo.pendingList.find(item => {
								if (item.businessCode.indexOf('materialPayment') != -1) {
									return item
								}
							})
						}
					}
				}
				if (sellerBusinessCode.find((v => v.indexOf('confirm_acceptance') != -1))) {
					// 待评价
					flag = 7;
				}
				return flag
			}
		},
		onLoad(option) {
			this.options = option;
			if(option.back === 'home'){
				this.isBackHome = true
			}
			if(option.noticeId){
				this.$util.readNotice(option.noticeId)
			}
			this.getWorkerInfo();
			const autoCheck = this.options.autoCheck || ''
			if (autoCheck == 'pay') {
				// 支付订单
				setTimeout(() => {
					this.arousePay();
				}, 2000)
			} else if (autoCheck == 'confirmOffer') {
				// 确认报价
				setTimeout(() => {
					this.saveFirmOrder();
				}, 2000)
			} else if (autoCheck == 'again') {
				// 确认报价
				setTimeout(() => {
					this.againBid();
				}, 2000)
			}
		},
		onShow() {
			/** 整体页面刷新 */
			uni.$on('refresh', (data) => {
				this.getWorkerInfo();
			})
			uni.$once('refreshPage', (data) => {
				if (data) {
					this.options.id = data.id;
				}
			})
			uni.$once('roomAddress', (data) => {
				if (data) {
					this.completeAddress = data;
				}
			})
			uni.$on('success', (data) => {
				if (data.type == 'check') {
					this.toPage(
						`/pages-common/successPage/successPage?mode=1&id=${this.options.id}&personId=${this.masterObj.personInfo.personId}`
					)
				}
				if (data.type == 'evaluation') {
					this.toPage(`/pages-common/successPage/successPage?mode=2&id=${this.id}`)
				}
			})
		},
		onHide() {
			uni.$off('success')
			uni.$off('refresh')
		},
		methods: {
			// 下拉刷新
			downCallback(){
				this.getWorkerInfo()
				setTimeout(() => {
					this.mescroll.endBySize(10, true)
				}, 500)
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			goBack(){
				if(this.isBackHome){
					uni.switchTab({
						url: '/pages/home/home'
					})
				} else {
					uni.navigateBack();
				}
				if(this.isRefresh) uni.$emit('refresh');
			},
			goShopMall(item) {
				if (item) {
					let mater = item.businessCode.split('_');
					this.toPage(`/pages-order/orderDetails?id=${mater[1]}`)
				}
			},
			backRefresh(id){
				this.getWorkerInfo(id?id:null,true)
			},
			//获取是否有新的师傅报价
			getOrderOfferIsRead() {
				this.$http.get(`order/capp/biz_order/getOrderOfferIsRead?orderId=${this.options.id}`).then(res => {
					// 0有未读的数据，1是都读了
					if (res == 1) {
						this.isWorker = false
					} else {
						this.isWorker = true
					}
				})
			},
			// 获取订单支付信息
			getPaySuccessData() {
				if (uni.getStorageSync('curOrder') != this.orderInfo.id) {
					this.$http
						.get('order/orderpaylog/getOrderByBusinessId', {
							businessId: this.orderInfo.id
						})
						.then((res) => {
							if (res) {
								uni.setStorageSync('curOrder', this.orderInfo.id)
								this.paySuccessData = res
								this.finished = true
							} else {
								this.finished = false
							}
						})
				}
			},
			//获取验收报告
			getCheckedData() {
				this.$http
					.get('order/customer/bizorderacceptance/getByOrderId', {
						orderId: this.orderInfo.id
					})
					.then((res) => {
						if (res && res.length) {
							this.checkedData = res[res.length - 1]
						}
					})
			},
			//选他接单
			confirmChoice() {
				this.$http
					.post(`order/biz_order/publisher/confirmPerson/${this.offerId}`)
					.then((res) => {
						if (res) {
							this.$util.toast('操作成功')
							this.choiceWorkerPopup = false
							this.timer = setInterval(() => {
								this.getWorkerInfo(null,true)
							}, 1000)
						}
					})
			},
			//选择师傅
			choiceWorker(data) {
				this.offerId = Number(data.id)
				this.curWorkerInfo = data
				this.choiceWorkerPopup = true;
			},
			//联系师傅
			contactWork(data) {
				this.contactInfo = data
				this.contactPopup = true
			},
			// 直接联系师傅
			goChat(){
				// this.$util.goToChat(
				// 			this.communicationRecordInfo.bidUserId,
				// 			this.communicationRecordInfo.personName,
				// 			"constructionOrder",
				// 			this.orderInfo.id
				// 		)
				if (this.communicationRecordInfo && this.communicationRecordInfo.phone) {
					uni.makePhoneCall({
						phoneNumber: this.communicationRecordInfo.phone
					})
				}else{
					this.$util.toast('未检测到师傅信息')
				}
			},
			//获取师傅信息和订单信息
			async getWorkerInfo(id,flag) {
				if (id) {
					this.options.id = id;
				}
				uni.showLoading({
					mask: true
				})
				this.isRefresh = false;
				this.$http.get(`order/bidorder/list?orderId=${this.options.id}`).then(res => {
					if (res) {
						res.offerList.map(item => {
							if (item.bidStatus == 3) {
								clearInterval(this.timer)
							}
							this.ipImage.some((v, i) => {
								if (item.skillName.indexOf(v.name) != -1) {
									item['defAvatar'] = v.img //每个工种添加一个默认头像
								}
							})
						})
						this.workerInfo = res;
						this.orderInfo = res.bizOrder;
						// if (this.orderInfo.pendingList && this.orderInfo.pendingList) {
						// 	this.orderInfo.pendingList = this.orderInfo.pendingList.filter(item => 
						// 	item.detailStatus == 0 )
						// }
						this.masterObj = {}
						if (this.workerInfo.offerList && this.workerInfo.offerList.length) {
							this.communicationRecordInfo = this.workerInfo.offerList[0]
							this.communicationRecord = this.workerInfo.offerList[0].communications || []
							this.offerRecordId = this.workerInfo.offerList[0].id;
							this.workerInfo.offerList.some((v) => {
								if (v.communications && v.communications.length) {
									v.communications.forEach(el => {
										if (el.annex) {
											el['annexImage'] = JSON.stringify(JSON.parse(el
												.annex).filter(item => item.type !=
												'audio'))
											el['annexAudio'] = JSON.parse(el.annex).find(
												item => item.type == 'audio')
										}
									});
								}
								if (v.bidStatus == 2 || v.bidStatus == 3 || v.bidStatus == 8) {
									this.masterObj = v;
									this.offerId = this.masterObj.id
									return true
								}
							})
						}
						if(flag) this.isRefresh = true;
						this.getChang()
						this.getCheckedData()
						this.getNewChang()
						this.getOrderOfferIsRead()
						this.getRiskList()
					}
				}).finally(() => {
					this.options.autoCheck = ''
					uni.hideLoading();
				});
			},
			// 判断订单是否已读
			getIsRead(id) {
				this.$http.post('order/capp/biz_order/updateBatchOrderReadFlag', [id]).then(res => {})
			},
			// 获取最新的变更项
			getNewChang() {
				this.$http.get("order/bizorderalteration/getNewAlteration", {
					orderId: this.orderInfo.id
				}).then(res => {
					if (res) {
						this.newChangeData = res
					}
				})
			},
			//获取是否有变更项
			getChang() {
				this.$http
					.get('order/bizorderalteration/getPage', {
						orderId: this.orderInfo.id,
						size: 9999
					})
					.then((res) => {
						if (res && res.records.length) {
							this.changeList = res.records;
							this.changeList.some((v) => {
								if (v.payStatus < 2) {
									this.changeObj = v;
									return true
								}
							})
						}
					})
			},
			//联系师傅 确认订单以后才可以联系师傅 才显示按钮
			contactWorker() {
				this.$util.goToChat(
					this.masterObj.personInfo.userId,
					this.masterObj.personInfo.name,
					"constructionOrder",
					this.orderInfo.id
				)
			},
			//重新呼叫
			againCall() {
				this.toPage('/pages-findMaster/findMasterWorker')
			},
			//支付
			arousePay() {
				if(!this.agreement){
					this.$util.toast('请先同意协议')
					return
				}
				// #ifdef APP-PLUS
				let param = {
					amount: Math.abs(this.masterObj.bidPrice),
					payMethod: 3,
					orderId: { orderIds: this.options.id },
					clientId: 'cmini',
				}
				// #endif
				// #ifndef APP-PLUS
				let param = {
					amount: Math.abs(this.masterObj.bidPrice),
					payMethod: 3,
					orderId: this.options.id,
					clientId: 'cmini',
				}
				// #endif
				this.amount = this.masterObj.bidPrice;
				// #ifdef APP-PLUS || H5
				this.showPopupPay = true
				// #endif
				// #ifdef MP-WEIXIN
				this.$util.requestPay(3, param, 'workOrder', () => {
					this.getWorkerInfo(null,true)
				})
				// #endif
				// })
			},
			// 去付款
			payConfirm(data) {
				// #ifdef APP-PLUS
				let param = {
					amount: Math.abs(this.masterObj.bidPrice),
					payMethod: data.payType,
					orderId: { orderIds: this.options.id },
					clientId: 'cmini',
				}
				// #endif
				// #ifndef APP-PLUS
				let param = {
					amount: Math.abs(this.masterObj.bidPrice),
					payMethod: data.payType,
					orderId: this.options.id ,
					clientId: 'cmini',
				}
				// #endif
				if (data.payType === 3) {
					// 小程序支付
					this.$util.requestPay(data.payType, param, 'workOrder', () => {
						this.showPopupPay = false
					})
				} else {
					// 支付宝
					uni.showLoading({
						mask: true
					});
					param['orderId'] = this.options.id
					this.$http.post('order/customer/pay/order', param).then((res) => {
						if (res && res.payInfo) {
							this.$util.requestPay(data.payType, res.payInfo, 'workOrder', () => {
								this.showPopupPay = false
							})
						}
					}).finally(() => {
						uni.hideLoading();
					})
				}
			},
			// 确认验收,判断是否未确认风险项
			confirmCheck(type = 0, callback) {
				this.toPage(`/pages-order/acceptance/acceptance-report?id=${this.orderInfo.id}&isDo=${true}`)
			},
			// 评价服务
			evaluate() {
				this.toPage(
					'/pages-findMaster/serviceEvaluation?user=' +
					this.masterObj.personInfo.personId +
					'&id=' +
					this.options.id +
					'&orderCode=' +
					this.masterObj.orderCode
				)
			},
			//订单信息
			getOrderDetails() {
				this.$http
					.get(`order/biz_order/self/publishDetail/${this.options.id}`)
					.then((res) => {
						if (res) {
							// this.orderInfo = res
							if (res.orderStatus >= 30) {
								uni.setStorageSync('curOrder', this.orderInfo.id)
							}
						}
					})
			},
			cancelOrder() {
				if (this.orderInfo.cancelFlag == 1) {
					this.$util.toast('已申请取消，请耐心等待')
					return
				}
				this.getCancelReason()
			},
			//取消订单的原因
			getCancelReason() {
				this.$httpApi.getDictByType({
						type: 'cancel_order_reason',
						cityOperatorId: this.orderInfo.cityOperatorId || ''
					})
					.then((res) => {
						if (res) {
							this.cancelOrderReasonList = res
							this.showCancelPopup = true
						}
					})
			},
			//确认取消订单
			confirmCancel() {
				this.$http
					.post('order/biz_order/cancel', {
						id: this.options.id,
						reason: this.cancelReason
					})
					.then((res) => {
						if (res) {
							this.showCancelPopup = false
							this.$util.toast('订单已取消')
							this.getWorkerInfo(null,true)
						}
					})
			},

			radioValue(data, index) {
				this.cancelReason = data.label
				this.formData.replaceReason = data.label
				this.curIndex = index
			},
			clearCur() {
				this.curIndex = 0
			},
			saveFirmOrder() {
				this.curWorkerInfo = this.masterObj;
				// 报价之后确认
				if (this.masterObj && this.masterObj.id) {
					this.choiceWorkerPopup = true;
				} else {
					uni.showModal({
					content: `亲，确认选择${this.communicationRecordInfo.skillName || ''}${this.communicationRecordInfo.personName || ''}为您服务吗？`,
					cancelText: "取消",
					confirmText: "确认",
					confirmColor: "#FE6E32",
					success: (res) => {
						if (res.confirm) {
							this.confirmOrder()
						}
					},
				});
				}
			},
			// 确认报价
			confirmOrder() {
				uni.showLoading()
				this.$http
					.post(
						`order/biz_order/publisher/confirmPerson/${this.offerRecordId}`
					)
					.then(res => {
						if (res) {
							this.$util.toast('确认成功')
							this.getWorkerInfo(null,true)
							// this.timer = setInterval(() => {
							// }, 1000)
						}
					}).finally(()=>{
						uni.hideLoading();
					})
			},
			// 不确认报价
			noConfirm() {
				if (this.orderInfo.priceWay == 1) {
					this.showFixedPricePopup = true
					return false
				}
				if (this.masterObj.bidStatus == 8) {
					this.$util.toast('您已不确认过报价,请勿重复操作')
					return false
				}
				this.showUnconfirmedPopup = true
			},
			// 不确认报价弹窗按钮操作
			unconfirmed() {
				if (!this.formData.replaceReason) {
					this.$util.toast('请选择不确认报价原因')
					return false
				}
				if (this.unconfirmedReasonList.length - 1 == this.curIndex) {
					// 第二种原因，直接更换师傅
					this.replacement();
				} else {
					// 第一种原因，发推送信息给师傅，更改价格
					this.$http.get('order/bidorder/sendOfferRemind?orderOfferId=' + this.masterObj.id)
						.then((res) => {
							if (res) {
								this.$util.toast('不确认成功')
								this.getWorkerInfo(null,true)
								this.showFixedPricePopup = false
								this.showUnconfirmedPopup = false
							}
						})
				}
			},
			// 换个师傅
			replacement() {
				this.formData.offerId = this.masterObj.id || this.offerRecordId
				if (this.orderInfo.priceWay == 1) {
					this.formData.replaceReason = '协商无法达成一致，换个人接单'
				}
				this.$http
					.post('order/biz_order/publisher/replacePerson', this.formData)
					.then((res) => {
						if (res) {
							this.$util.toast('更换成功')
							this.getWorkerInfo()
							this.formData = {}
							this.showFixedPricePopup = false
							this.showUnconfirmedPopup = false
						}
					})
			},
			//修改已读状态
			setReadState() {
				if (this.masterObj.id) {
					this.$http.post(`order/capp/biz_order/updateOrderOfferReadFlag?offerId=${this.masterObj.id}`).then(
						res => {
							if (res) {
								this.getOrderOfferIsRead()
							}
						})
				}
			},

			// 重新发布
			againBid() {
				if (this.orderInfo.skillName.indexOf('维修安装') !== -1) {
					this.toPage(`/pages-homeCall/repairNotFilled/repairNotFilled?orderId=${this.orderInfo.id}`)
				} else {
					this.$httpApi.getPlatformSkills({
						type: '', // 查询全部
						clientType: 'platform'
					}).then(res => {
						if (res && res.length) {
							res.some((item) => {
								if (item.skillId == this.orderInfo.skillId) {
									this.curMaster = item;
									this.isCallMaster = true;
									return
								}
							})
						}
					})
				}
				this.getAgainAddress();
			},
			//获取上一次发单地址，写进缓存
			getAgainAddress() {
				this.$httpApi.getPostAddress().then(res => {
					if (res && res.length) {
						res.some((v) => {
							if (v.id == this.orderInfo.addressId) {
								uni.setStorageSync("roomAddress", v);
								this.completeAddress = v;
								return
							}
						})
					}
				})
			},
			//联系客服
			contactService() {
				let data = this.orderInfo
				this.$util.goToWeixin();
				//this.$util.goToChat(data.companyId, data.companyName, 'constructionOrder', data.id, 1);
			},
			// 获取风险项
			getRiskList() {
				this.$http.get(`order/biz_order/orderRisk/${this.orderInfo.id}`)
					.then((res) => {
						this.riskList = res
						// 确认状态（0待确认，1已确认）
						let arr = res.filter((item) => item.status == 0);
						this.riskObj.num = arr.length;
						if (arr && arr.length) {
							this.riskObj.isCheck = true
						} else {
							this.riskObj.isCheck = false
						}
					})
			},
			// 确认风险项
			riskConfirm(id) {
				this.$http.get(`order/biz_order/doneRisk/${id}`).then((res) => {
					if (res) {
						this.$util.toast('确认成功')
						this.getWorkerInfo(null,true);
						this.$refs.order.getRiskList();
					}
				})
			},
			//查看变更项
			seeChangeData() {
				let url = ''
				if (this.orderInfo.projectId && this.orderInfo.projectId > 0) {
					url = `/pages-findMaster/changeItemList?projectId=${this.orderInfo.projectId}`
				} else {
					url = `/pages-findMaster/changeItemList?orderId=${this.orderInfo.id}`
				}
				this.toPage(url)
			},
			// 查看订单日志
			lookOrderLog() {
				this.toPage(`/pages-order/orderTrends?orderId=${this.orderInfo.id}`)
			},
			setResult(intention) {
				const tempResultMap = {
					'1': '愿意接单',
					'0': '不是平台单',
					'-1': '个人弃单',
				}
				return tempResultMap[intention] ?? ''
			},
			// 查看沟通记录
			moreRecord() {
				this.toPage(`/pages-order/communicationRecord?orderId=${this.orderInfo.id}`)
			},
			// 查看进度
			lookProgress(){
				uni.reLaunch({
					url:`/pages/myHome/myHome?addressId=${this.orderInfo.addressId || ''}&projectId=${this.orderInfo.projectId || ''}`
				})
			},
			// 发单协议
			lookAgreement(){
				let order = this.orderInfo;
				let master = this.masterObj;
				this.agreementInfo.requirementName = order.requirementName;
				this.agreementInfo.bName = master?.personName;
				this.agreementInfo.bPhone = master?.phone;
				this.agreementInfo.name = order.contactName;
				this.agreementInfo.phone = order.contactPhone;
				this.agreementInfo.amount = master?.bidPrice;
				this.agreementInfo.created = master?.created;
				this.agreementInfo.bidCreated = order.created;
				this.agreementInfo.jobCode = order.jobCode;
				this.agreementInfo.address = `${ order.provinceName || "" }${ order.cityName || ""
                    }${ order.cityName || "" }${ order.latAddress || "" }${ order.poiName || "" }`;
				this.isAgreement = true;
			}
		}
	}
</script>
<style lang="scss">
	page {
		background: #F5F5F5
	}
</style>
<style lang="scss" scoped>
	.nav-view {
		height: 205rpx;
		background: #f5f5f5;

		.nav-bar-title {
			font-weight: bold;
			color: #141414;
		}

		.arrow_back {
			width: 38rpx;
			height: 38rpx;
			margin-left: 30rpx;
		}

		.nav-bar-share {
			width: 34rpx;
			height: 33rpx;
			margin-right: 30rpx;
		}

		.tab_view {
			width: 100%;
			position: fixed;
			z-index: 999;
		}
	}

	.zw_box {
		height: 56rpx;
	}

	.main-container {
		padding: 0 30rpx;
		background: #ffffff;
		margin-bottom: 30rpx;
		box-shadow: 0px 2rpx 10rpx rgba(0, 0, 0, .2);

		.sub-order {
			padding-top: 20rpx;
		}
	}

	.other {
		padding: 0 30rpx;
		background: #f5f5f5;
		box-shadow: none;
	}

	.order-info {
		background: #ffffff;
		padding: 30rpx;
	}

	.btn_view {
		height: 188rpx;
		background: #F5F5F5;
	}

	.action-content {
		width: 100%;
		padding: 0 10rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
		z-index: 99;
		padding-top: 10rpx;
		@include buttonsafearea();
        background: #ffff;
		.btm-btn {

			button,
			view {
				// width: 268rpx;
				// height: 88rpx;
				line-height: 84rpx;
				font-weight: bold;
				font-size: $fontSize26;
				border-radius: 12rpx;
				margin: 0 10rpx;
			}

			.empty_btn {
				background: transparent;
			}

			.cancel {
				width: 185rpx;
				background: #e6e6e6;
				color: #808080;
			}

			.confirm {
				width: 268rpx;
				border-radius: 12upx;
				background: #FE6E32;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 25rpx;
					height: 25rpx;
					margin-right: 12rpx;
				}

				text {
					font-weight: bold;
					font-size: $fontSize26;
					color: #ffffff;
				}

				.refresh_rotate {
					animation: turn 1s linear infinite;
				}

				@keyframes turn {
					0% {
						-webkit-transform: rotate(0deg);
					}

					100% {
						-webkit-transform: rotate(360deg);
					}
				}
			}
		}
	}

	.content-sku {
		.button {
			display: flex;
			align-items: center;
			position: absolute;
			bottom: 0;
			right: 0;
			left: 0;
			height: 100rpx;
			padding: 0 40rpx;

			view {
				flex: 1;
				color: #141414;
				font-size: $fontSize26;
				border-radius: 24rpx;
				background: #e0e0e0;
				text-align: center;
				padding: 20rpx 0;

				&:first-child {
					background: #ebebeb;
					margin-right: 10rpx;
				}

				&:last-child {
					margin-left: 10rpx;
				}
			}
		}

		.content-main {
			overflow: hidden;

			.content-main_row {
				color: #141414;
				font-size: 34rpx;
				font-weight: bold;
				text-align: center;
			}

			.content-main_row1 {
				color: #808080;
				font-size: $smallFontSize;
				padding: 20rpx 0;
				text-align: center;
			}

			.content-main_res {
				display: flex;
				align-items: center;
				margin-top: 40rpx;

				.radio {
					width: 25rpx;
					height: 25rpx;
					border-radius: 50%;
					border: 4rpx solid #bdbdbd;
					margin-right: 30rpx;
				}

				.radioSelect {
					border: 4rpx solid #ff5f00;
					position: relative;

					&::before {
						content: '';
						position: absolute;
						width: 15rpx;
						height: 15rpx;
						border-radius: 50%;
						background: #ff5f00;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.reason {
					color: #141414;
					font-size: 26rpx;
				}

				.radio2 {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					border: 4rpx solid #bdbdbd;
					margin-right: 30rpx;
				}

				.radioSelect2 {
					border: 4rpx solid #ff5f00;
					position: relative;

					&::before {
						content: '✔';
						position: absolute;
						color: #ff5f00;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.reason2 {
					flex: 1;

					&>view {
						color: #141414;
						font-size: 26rpx;

						&:last-child {
							color: #808080;
							font-size: 24rpx;
							padding-top: 10rpx;
						}
					}
				}
			}
		}
	}

	.display-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.order-stage {
		background: #ffffff;
		margin-bottom: 30rpx;
		.confirm-quotation {
			padding: 30rpx;
			box-shadow: 5rpx 8rpx 10rpx rgba(0,0,0,0.1);
			.order-stage_top {
				display: flex;
				justify-content: space-between;
				align-items: baseline;
			}
			.order-agreement{
				display: flex;
				align-items: center;
				padding-top: 20rpx;
				.order-agreement_title{
					color: #000000;
					font-size: 28rpx;
				}
				.checkbox{
					display: block;
					margin-right: 10rpx;
				}
				text{
					color: #FE6E32;
					font-size: 28rpx;
				}
			}
			text {
				color: #141414;
				font-size: 24rpx;
			}

			.bidPrice {
				color: #FE6E32;
				font-size: 60rpx;
				font-weight: bold;
			}

			.price_tips {
				margin-left: 20rpx;
			}

			.bid_time {
				font-size: 22rpx;
				color: #808080;
				font-family: PingFang-SC;
			}

			.order-stage_title {
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					color: #000000;
					font-size: 28rpx;
					font-family: PingFang-SC;
					padding: 30rpx 0;
					font-weight: bold;

				}

				view {
					color: #808080;
					font-size: 24rpx;
				}
			}

			.order-stage_content {
				color: #000000;
				font-size: 26rpx;
				font-family: PingFang-SC;
			}

			.order-stage_bottom {
				display: flex;
				justify-content: flex-end;
				padding-top: 30rpx;

				text {
					font-size: 24rpx;
					color: #141414;
					// font-weight: bold;
					border-radius: 12rpx;
					padding: 20rpx 30rpx;
				}

				.look_bottom {
					border: 2rpx solid #000000;
					margin-right: 20rpx;
				}

				.confin_bottom {
					color: #ffffff;
					background: #FE6E32;
					&.confin_bottom_no{
						background: #cccccc;
					}
				}
			}

			.order-stage_tips {
				color: #141414;
				font-size: 24rpx;
				padding-bottom: 30rpx;
			}

			.order-stage_remarks {
				color: #000000;
				font-size: 28rpx;
			}

			.order-communication {
				.order-communication_item {
					margin-bottom: 40rpx;

					&:last-child {
						margin-bottom: 0;
					}
				}

				.order-communication_tags {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.tags-tag {
						color: #FE6E32;
						font-size: 24rpx;
						font-family: NotoSansHans;
						padding: 10rpx;
						background: #FFF0EA;
						border-radius: 12rpx;
						font-weight: 550;
						margin-right: 20rpx;
					}

					.tags-time {
						color: #999999;
						font-size: 20rpx;
						font-family: MicrosoftYaHei;
					}
				}

				.order-communication_content {
					color: #000000;
					font-size: 28rpx;
					font-family: NotoSansHans-Regular;
					padding-top: 20rpx;
				}

				.communication-image {
					margin-top: 20rpx;
				}
			}
		}

		.risk-list {
			display: flex;
			align-items: center;
			padding-bottom: 20rpx;

			view {
				color: #000000;
				font-size: 28rpx;
			}

			.seq {
				white-space: nowrap;
			}

			.name {
				flex: 1;
			}

			.buttom {
				color: #FFFFFF;
				background: #FE6E32;
				padding: 10rpx 20rpx;
				border-radius: 10rpx;
				font-family: HuXiaoBo-NanShen;
				font-size: 24rpx;
				margin-left: 20rpx;
				white-space: nowrap;

				&.buttom_row {
					color: #FE6E32;
					background: transparent;
					padding: 10rpx 0;
				}
			}
		}
	}

	.contact {
		color: #141414;
		border: 3rpx solid #141414;
	}

	.contact-no {
		color: #cccccc !important;
		border: 3rpx solid #cccccc !important;
	}

	.order_log {
		margin: 0 30rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.order_log-left {
			display: flex;
			align-items: center;

			text {
				color: #808080;
				font-size: 24rpx;
			}

			.order-log_info {
				margin-right: 10rpx;
			}
		}
	}
	.flex-Record{
		display: flex;
		align-items: center;
		padding-bottom: 20rpx;
		.name{
			color: #141414;
			font-size: 28rpx;
			font-weight: bold;
			padding-right:9rpx;
			padding: 0 10rpx;
		}
		.skillName{
			color: #FE6E32 !important;
			border: 2rpx solid #FE6E32;
			font-size: 16rpx !important;
			font-weight: bold;
			padding: 5rpx 4rpx;
			border-radius: 6rpx;
			font-family: HuXiaoBo-NanShen;
			// height: 30rpx;
			// line-height: 30rpx;
		}
	}
</style>
