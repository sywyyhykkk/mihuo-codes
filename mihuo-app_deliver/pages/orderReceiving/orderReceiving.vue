<template>
	<view>
		<z-nav-bar backState="3000" fontColor="#303133" @backClick="goBackPage()">
			<view class="nav-bar" slot="default">
				{{ pageTitle }}
			</view>
		</z-nav-bar>
		<!-- 发单方详情 -->
		<view class="detail-page" v-if="sendOrderDetialStatus">
		<!-- 	<my-step v-if="orderList.orderStatus !== 65 && orderList.orderStatus !== -1" :stepIndex="stepIndex">
			</my-step> -->
			<view class="requirement-description" v-if="orderList.orderStatus === 65 || orderList.orderStatus === -1">
				<view class="demand_data_title">订单已取消</view>
				<view class="description_information">取消原因: {{ orderList.reason }}</view>
			</view>
			<u-tabs :list="tabList" class="tab-container" active-color="#002FA5" inactive-color="#606266"
				:offset="[10, 100]" :is-scroll="false" bg-color="transparent" :current="currentTab" @change="changeTab">
			</u-tabs>
			<!-- 订单信息 -->
			<view class="order-info" v-if="currentTab === 0">
				<view class="order-information">
					<view class="order-title flex-center">
						<view class="order-title-icon" v-if="orderList.skillName">
							{{ orderList.skillName }}
						</view>
						{{ orderList.requirementName }}
					</view>
					<view class="order_information">
						<view class="information_title">施工地点</view>
						<view class="information_text">{{ orderList.address }}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">上门时间</view>
						<view class="information_text">{{ orderList.expectDate }}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">预计工期</view>
						<view class="information_text">{{ orderList.expectDuration }}天</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">下单人员</view>
						<view class="information_text">{{ orderList.userName }}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">订单编号</view>
						<view class="information_text">{{ orderList.orderCode }}</view>
						<image src="/static/icon/copy.png" class="copy-icon" @click="copy(orderList.orderCode)" mode="">
						</image>
						<view style="clear: both;"></view>
					</view>
				</view>
				<view class="order-information">
					<view class="demand_data_title">价格信息</view>
					<view class="order_information">
						<view class="information_title">所需工种</view>
						<view class="information_text">{{orderList.skillName}}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">报价方式</view>
						<view class="information_text">{{ orderList.priceWay === 1 ? '一口价' : '议价' }}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">{{ orderList.priceWay === 1 ? '订单价格' : '期望报价' }}</view>
						<view class="information_text">{{ orderList.price }}元</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information" v-if="orderList.bizOrderOffer">
						<view class="information_title">我的报价</view>
						<view class="information_text">{{ orderList.bizOrderOffer.bidPrice }}元</view>
						<view style="clear: both;"></view>
					</view>
				</view>
				<view class="requirement-description" v-if="orderList.requirementDesc">
					<view class="demand_data_title">需求描述</view>
					<view class="description_information">{{orderList.requirementDesc}}</view>
				</view>
				<view class="demand-data" v-if="orderList.attachments">
					<view class="demand_data_title">需求资料</view>
					<view class="demand_data_center" v-if="audioObject && audioObject.timeLength !== 0">
						<mihuo-audio :formDate="audioObject"></mihuo-audio>
					</view>
					<view class="demand_data_bottom">
						<view class="my_img" @click="previewImage" v-if="imgFile.length>0">
							<u-image class="bottom_image" border-radius="10rpx" width="204rpx" height="204rpx"
								:src="$util.thumbnailImage(imgFile[0])">
							</u-image>
							<view class="imgLength">
								<span>
									{{ imgLength }}
								</span>
							</view>
						</view>
						<view class="my_img" @click="toVideo">
							<view class="bottom_image">
								<view v-html="content">
								</view>
							</view>
						</view>
					</view>
					<view style="clear: both;"></view>
				</view>
			</view>
			<!-- 报价信息 -->
			<view class="offer-info" v-else>
				<view v-show="sendOrderDetialStatus" class="registration-personnel">
					<view class="contain">
						<view class="item-contain-no" v-if="bidOrderList.length === 0">
							<image :src="offerNo" class="offer-no"></image>
							<text class="no-text">暂无报价的师傅</text>
						</view>
						<view class="item-contain-data" v-if="bidOrderList.length > 0">
							<view class="item-personnel" v-for="(item, index) in bidOrderList" :key="item.id">
								<view class="personnel-contain">
									<u-avatar class="personnel-image" :src="$util.avatarImage(item.personInfo.userId)"
										size="136"></u-avatar>
									<view class="personnel-detail">
										<view class="name-detail">
											<view class="item-name-detail">
												<view class="real-name">{{item.personInfo.name || '未知'}}</view>
												<skill-level-tag style="transform: scale(0.9);"
													:title="item.personInfo.skillName" :level="item.personInfo.level">
												</skill-level-tag>
											</view>
											<view class="item-price">报价:
												<text class="price">{{item.bidPrice}}元</text>
											</view>
										</view>
										<view class="personnel-introduce" v-show="item.personInfo.servicePromise">
											{{item.personInfo.servicePromise || '客户就是上帝，永远把售后放在第一位。'}}
										</view>
										<view class="personnel-tags">
											<u-tag class="tag" :text="item.personInfo.skillYearNum" :closeable="false"
												color="#5382D0" bg-color="#F1F3FF" border-color="#F1F3FF" />
											<u-tag class="tag" text="保证金" :closeable="false" color="#5382D0"
												bg-color="#F1F3FF" border-color="#F1F3FF" />
											<u-tag class="tag" text="响应迅速" :closeable="false" color="#5382D0"
												bg-color="#F1F3FF" border-color="#F1F3FF" />
										</view>
										<view class="personnel-statistical">
											<view class="item-statistical flex-center">
												<view class="item-text">好评率
													<text class="item-num">
														{{item.personInfo.evaluationRate || '100%'}}
													</text>
												</view>
												<view class="item-text">服务
													<text class="item-num">
														{{item.personInfo.serviceNum || 0}}次
													</text>
												</view>
											</view>
											<!-- <view class="communication" @click="()=>communicationIm(item)">
												<image :src="communication" class="communication" mode=""></image>
											</view> -->
											<view class="button-choose" v-if="item.bidStatus < 3"
												@click="confirmPerson(item)">
												<text class="text">
													选择TA
												</text>
											</view>
											<view class="button-choose" v-else>
												<text class="text">
													已选择
												</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="item-an" @click="lookAll" v-if="standbyBidOrderList.length > 2">
								<u-icon v-show="lookAllStatus" class="item-icon-down" size="28" color="#909199"
									name="arrow-left-double"></u-icon>
								<u-icon v-show="!lookAllStatus" class="item-icon-up" size="28" color="#909199"
									name="arrow-left-double"></u-icon>
								<text class="item-an-text" v-show="lookAllStatus">展开查看全部</text>
								<text class="item-an-text" v-show="!lookAllStatus">收起</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 接单方详情 -->
		<view v-else class="detail-page">
			<!-- <my-step v-if="orderList.orderStatus !== 65 && orderList.orderStatus !== -1" :stepIndex="stepIndex">
			</my-step> -->
			<view class="requirement-description" v-if="orderList.orderStatus === 65 || orderList.orderStatus === -1">
				<view class="demand_data_title">订单已取消</view>
				<view class="description_information">取消原因: {{ orderList.reason }}</view>
			</view>
			<view class="order-info">
				<view class="order-header">
					<view class="topper flex-center">
						<view class="left flex-center">
							<view class="price-sign">
								￥
							</view>
							<view class="price">
								{{ orderList.price }}
							</view>
							<view class="price-tag">
								{{ orderList.priceWay === 1 ? '订单价格' : '期望报价' }}
							</view>
						</view>
						<!-- <view class="right">
							查看报价明细
						</view> -->
					</view>
					<view class="center flex-center">
						<view class="order-title flex-center" style="padding-left: 0;">
							<view class="order-title-icon">
								{{ orderList.skillName }}
							</view>
							{{ orderList.requirementName }}
						</view>
						<view class="title" style="width: 100%;">
							上门时间 <text class="des">{{ orderList.expectDate }}</text>
						</view>
						<view class="title" style="width: 40%;">
							预期工期 <text class="des">{{ orderList.expectDuration }}天</text>
						</view>
						<view class="title flex-center" style="width: 60%;" v-if="orderList.priceWay === 2">
							我的报价 <text class="des-price">{{ orderList.bizOrderOffer ? orderList.bizOrderOffer + '元' : '未报价' }}</text>
							<image src="../../static/icon/edit.png" class="edit-icon" @click="expectOffer"></image>
						</view>
						<view class="title" style="width: 100%;">
							施工地点
						</view>
						<view class="address" v-if="orderList.contactPhone">
							{{ orderList.contactName }}<text class="phone">{{ orderList.contactPhone.substr(0, 3) + '****' + orderList.contactPhone.substr(7) }}</text>
						</view>
						<view class="address flex-center" style="margin-top: 8rpx;">
							<image src="../../static/icon/address_2.png" class="address-icon"></image>
							{{ orderList.address }}
						</view>
					</view>
					<view class="bottom flex-center">
						<view class="icon-button flex-center" @click="goToLocation">
							<image src="../../static/icon/location.png" class="icon"></image>
							立即导航
						</view>
						<view class="divider"></view>
						<view class="icon-button flex-center" @click="makePhoneCall">
							<image src="../../static/icon/phone_call.png" class="icon"></image>
							拨打电话
						</view>
					</view>
				</view>
				<view class="demand-data" v-if="orderList.requirementDesc || orderList.attachments"
					style="margin-top: 0; border-radius: 0 0 16rpx 16rpx; padding: 0 40rpx 40rpx 40rpx;">
					<view class="demand_data_title" style="border-top: 1rpx solid #EEEEEE; border-bottom: 0; line-height: 80rpx;">需求描述</view>
					<view class="description_information" style="padding: 0 20rpx;" v-if="orderList.requirementDesc">{{ orderList.requirementDesc }}
					</view>
					<view class="demand_data_bottom" v-if="orderList.attachments">
						<view class="my_img" @click="previewImage" v-if="imgFile.length>0">
							<u-image class="bottom_image" border-radius="10rpx" width="204rpx" height="204rpx"
								:src="$util.thumbnailImage(imgFile[0])">
							</u-image>
							<view class="imgLength">
								<span>
									{{ imgLength }}
								</span>
							</view>
						</view>
						<view class="my_img" @click="toVideo">
							<view class="bottom_image">
								<view v-html="content">
								</view>
							</view>
						</view>
					</view>
					<view class="demand_data_center" v-if="audioObject && audioObject.timeLength !== 0">
						<mihuo-audio :formDate="audioObject"></mihuo-audio>
					</view>
					<view style="clear: both;"></view>
				</view>
				<view class="order-information" style="margin-top: 6rpx; padding: 0 40rpx">
					<view class="demand_data_title">订单信息</view>
					<view class="order_information">
						<view class="information_title">订单编号</view>
						<view class="information_text">{{ orderList.orderCode }}</view>
						<image src="/static/icon/copy.png" class="copy-icon" @click="copy(orderList.orderCode)" mode="">
						</image>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">订单类型</view>
						<view class="information_text">{{ orderList.requirementTypeName }}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">所需工种</view>
						<view class="information_text">{{ orderList.skillName }}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">预计工期</view>
						<view class="information_text">{{ orderList.expectDuration }}天</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">上门日期</view>
						<view class="information_text">{{ orderList.expectDate }}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">{{ orderList.priceWay === 1 ? '订单价格' : '期望报价' }}</view>
						<view class="information_price">{{ orderList.price }}元</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">下单时间</view>
						<view class="information_text">{{ orderList.created }}</view>
						<view style="clear: both;"></view>
					</view>
					<view class="order_information">
						<view class="information_title">下单人员</view>
						<view class="information_text">{{ orderList.userName }}</view>
						<view style="clear: both;"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="share-friends" v-if="orderList.orderStatus !== 65 && orderList.orderStatus !== -1">
			<view class="item-offer" v-show="!sendOrderDetialStatus">
				<view class="offer-immediately" v-show="orderList.priceWay === 1" v-if="orderList.orderStatus < 25 && !orderList.bidOrder"
					@click="expectOffer">立即抢单</view>
				<view class="offer-immediately" v-show="orderList.priceWay === 2" v-if="orderList.orderStatus < 25 && !orderList.bidOrder"
					@click="expectOffer">{{ orderList.bizOrderOffer ? '修改报价' : '立即报价' }}</view>
				<view class="share-with-friends" @click="shareWithFriends">分享给好友</view>
			</view>
			<view v-show="sendOrderDetialStatus" class="send-order-operation">
				<view class="cancel" v-if="orderList.orderStatus < 25" @click="orderPeration('取消订单')">取消订单</view>
				<view class="fresh" v-if="orderList.orderStatus < 20" @click="orderPeration('刷新订单')">刷新订单</view>
				<!-- <view class="share-the-inquiry" @click="orderPeration('分享询价')">分享询价</view> -->
			</view>
		</view>
		<view class="video-popup" v-if="videoType">
			<image src="../../static/demo/ic_close_white.png" class="pupo_image" @click="closeVedio"></image>
			<view class="video_bac">
				<video :src="videoFile[0]" class="video_image" enable-danmu danmu-btn controls></video>
			</view>
		</view>
		<order-cancel-reason v-if="option.typeName === '发单详情'" :orderId="orderId" ref="orderCancelReason"
			@cancelReason="cancelReason">
		</order-cancel-reason>
		<mihuo-protocol v-if="isShowProtocol" protocolType="IM" @hide-modal="hideModal"></mihuo-protocol>
	</view>
</template>

<script>
	import {
		certification,
		debounce,
		getImgByJobCode,
		clickDateDiff
	} from "@/plugins/utils.js"
	export default {
		data() {
			return {
				tabList: [{
						name: '订单信息',
						count: 0
					},
					{
						name: '报价信息',
						count: 0
					}
				],
				currentTab: 0,
				isCancel: false, // 订单是否已经被取消
				addressUrl: require("@/static/images/address-max.png"),
				offerNo: require("@/static/images/offer-no.png"),
				communication: require("@/static/images/communication.png"),
				tempApi: '',
				stepIndex: 1,
				orderList: {},
				attachments: [],
				option: {},
				sendOrderDetialStatus: false,
				imgLength: 0,
				imgFile: [],
				videoLength: 0,
				videoFile: [],
				videoType: false,
				liImage: '../../static/images/icon.png',
				content: '',
				orderId: '',
				sendOrderCover: '',
				isShowProtocol: false,
				bidOrderList: [],
				bidUser: {},
				lookAllStatus: true,
				audioObject: '',
				standbyBidOrderList: [],
				pageTitle: '', // 页面标题,
				orderStatusDict: {
					0: 1, // 发布订单
					5: 2, // 等待报价
					25: 3, // 订单确认/待开工
					30: 3, // 开工中
					35: 3, // 待验收
					40: 3, // 待结算
					45: 3, // 待评价
					50: 4 // 订单完成
				},
				isOnePrice: false, // 是否是一口价
			}
		},
		onLoad(option) {
			this.option = option
			if (this.option.typeName === '发单详情') {
				this.sendOrderDetialStatus = true
			}
			this.pageTitle = this.option.typeName
		},
		onShow() {
			this.getOrder()
		},
		computed: {
			setUrl() {
				return getImgByJobCode(this.orderList.jobCode)
			}
		},
		methods: {
			goBackPage(){
				let pages = getCurrentPages()
				let lastPage = pages[pages.length - 2].route
				if(lastPage === 'pages/publishTask/issueOrder' || lastPage === 'pages/publishTask/orderRelease'){
					uni.navigateBack({
						delta: 2
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			// 复制订单号
			copy(data) {
				uni.setClipboardData({
					data, // 要被复制的内容
					success: () => { // 复制成功的回调函数
						this.$util.toast("复制成功");
					}
				});
			},
			// 切换tab
			changeTab(e) {
				this.currentTab = e
			},
			shareWithFriends() {
				let miniProgramType = process.env.NODE_ENV === 'production' ? 0 : 1
				uni.share({
					provider: 'weixin',
					scene: "WXSceneSession",
					type: 5, // 微信小程序
					imageUrl: getImgByJobCode(this.orderList.jobCode),
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
			// 立即导航
			goToLocation(){
				uni.openLocation({
					latitude: this.orderList.latitude,
					longitude: this.orderList.longitude
				})
			},
			// 拨打电话
			makePhoneCall() {
				let phone = this.orderList.contactPhone
				if (!phone) return
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			confirmPerson(item) {
				uni.showLoading()
				this.$httpApi.assignByOfferId(item.id).then(res => {
					if (res) {
						uni.hideLoading()
						this.$util.toast('确认成功~')
						this.getBidOrderList()
					}
				})
			},
			previewImage() {
				let imgList = this.imgFile.map(item => this.$image.imageGlobal + item)
				uni.previewImage({
					current: 0, //预览图片的下标
					urls: imgList //预览图片的地址，必须要数组形式
				})
			},
			previewImageOne(url) {
				uni.previewImage({
					current: 0,
					urls: [url]
				})
			},
			// 打开全屏视频
			toVideo() {
				this.videoType = true
			},
			// closeVedio关闭
			closeVedio() {
				this.videoType = false
			},
			// 获取订单信息
			getOrder() {
				this.$httpApi.getOrderById(this.option.id).then(data => {
					if (!data) {
						return
					}
					if (data.priceWay === 1) {
						// 如果订单价格模式是一口价, 则报价不允许修改报价
						this.isOnePrice = true
					} else {
						// 议价模式, 允许自行报价和修改报价
						this.isOnePrice = false
					}
					if (data.orderStatus === 65) {
						// 订单已被取消
						this.stepIndex = -1
						this.isCancel = true
					} else {
						this.stepIndex = this.orderStatusDict[+data.orderStatus]
					}
					this.orderList = data
					this.attachments = data.attachments ? JSON.parse(data.attachments) : [],
						this.imgLength = 0
					this.videoLength = 0
					this.attachments.forEach((item, index) => {
						if (!item) {
							return
						}
						if (item.type === 'img') {
							this.imgLength++
							this.imgFile.push(item.url)
						}
						if (item.type === 'video') {
							this.videoLength++
							this.videoFile.push(item.url.replace(
								'/admin/sys-file/mihuo-test/', ''))
							this.content =
								`<video src="${this.videoFile[0]}" style="width:102px;max-height:97px;border-radius: 5px;" show-play-btn="false" show-center-play-btn="false" object-fit="fill" enable-danmu danmu-btn controls></video>`
						}
						if (item.type === 'audio') {
							item.url = item.url.replace(
								'/admin/sys-file/mihuo-test/', '')
							this.audioObject = item
						}
					})
					this.getBidOrderList()
				})
			},
			// 获取已报价人员
			getBidOrderList() {
				this.$httpApi.getOfferPeopleList({
orderId:this.option.id
				}).then(res => {
					if (res) {
						this.tabList[1].count = res.offerList.length
						res.offerList.map(item => {
							if (item.personInfo.avatar) {
								item.personInfo.avatar = this.$image.imageGlobal + item.personInfo.avatar
									.replace(
										'/admin/sys-file/mihuo-test/', '')
							}
						})
						if (this.lookAllStatus) {
							this.bidOrderList = res.offerList.slice(0, 2);
						} else {
							// 如果当前是展开全部的状态则不用截取前2个
							this.bidOrderList = res.offerList;
						}
						this.standbyBidOrderList = res.offerList
					}
				})
			},
			// 报价或修改报价
			expectOffer() {
				if (this.orderList.orderStatus >= 25) {
					return
				}
				if (this.isOnePrice) {
					// 一口价模式
					if (this.orderList.bizOrderOffer) {
						// 已经报过价
						this.$util.toast('你已经报过价了，请耐心等待')
					} else {
						// 首次报价, 一口价
						const dataObj = {
							bidPrice: parseFloat(this.orderList.price),
							orderId: this.option.id
						};
						this.$httpApi.addOrderOfferPrice(dataObj).then(data => {
							if (data) {
								uni.hideLoading()
								this.$util.toast('报价成功～')
							}
						}).catch(e => {
							// 提示要求技能认证
							this.$util.toast(e.errMsg)
						});
					}
				} else {
					// 议价模式
					if (this.orderList.bizOrderOffer) {
						// 修改报价
						let obj = {
							isEdit: 1,
							orderId: this.option.id,
							bidPrice: this.orderList.bizOrderOffer.bidPrice,
							bidDescription: this.orderList.bizOrderOffer.bidDescription || '', // 报价描述
							bidId: this.orderList.bizOrderOffer.id, // 报价ID
							expectPrice: this.orderList.price, // 期望报价
							orderCode: this.orderList.orderCode
						}
						let url = `/pages/orderReceiving/expectOffer?data=${JSON.stringify(obj)}`
						uni.navigateTo({
							url
						});
					} else {
						// 首次报价, 议价
						let obj = {
							isEdit: 2,
							orderId: this.option.id,
							orderCode: this.orderList.orderCode,
							expectPrice: this.orderList.price, // 期望报价
						}
						// 新增报价
						let url = `/pages/orderReceiving/expectOffer?data=${JSON.stringify(obj)}`
						uni.navigateTo({
							url
						});
					}
				}
			},
			//立即沟通
			immediatelyCommunicate() {},
			cancelReason() {
				this.getOrder()
			},
			orderPeration(typeName) {
				let that = this
				switch (typeName) {
					case '取消订单':
						debounce(function() {
							that.orderId = that.option.id
							that.$refs.orderCancelReason.open()
						}, 300)
						break;
					case '刷新订单':
						uni.showLoading()
						debounce(function() {
							that.$httpApi.refreshOrder(that.option.id).then(res => {
								uni.hideLoading()
								uni.showToast({
									title: '刷新成功~',
									icon: 'none'
								});
							})
						}, 1000)
						break;
					case '分享询价':
						uni.showToast({
							title: '正在开发',
							icon: 'none'
						});
						break;
				}
			},
			communicationIm(item) {
				// this.isShowProtocol = true;
				this.bidUser = item;
				// 这里不需要再同意用户协议了
				this.hideModal(true)
			},
			hideModal(isConfirm) {
				// this.isShowProtocol = false;
				if (!isConfirm) {
					return
				}
				uni.showLoading()
				// 沟通协议同意 有群id直接跳转 没有则去建群跳转
				if (this.bidUser.groupId) {
					this.$store.commit('WEBSOCKET_GROUP', {
						TargetId: this.bidUser.groupId
					});
					uni.hideLoading()
					uni.navigateTo({
						url: `/pages/message/orderChat/orderChat?toUserId=${this.bidUser.groupId}&bidId=${this.bidUser.id}&toUserName=${this.orderList.contactName}的服务群`
					})
					return;
				}
				this.$http.post('order/bidorder/createGroup', {
					"customField": "",
					"id": this.bidUser.id,
					"isConfirm": false,
					"name": `${this.orderList.contactName}的服务群`
				}).then(res => {
					if (!res) {
						this.$util.toast('创建聊天失败, 请稍后再试~')
						return
					}
					this.$store.commit('WEBSOCKET_GROUP', {
						TargetId: res.groupId,
					});
					uni.hideLoading()
					uni.navigateTo({
						url: `/pages/message/orderChat/orderChat?toUserId=${res.groupId}&bidId=${this.bidUser.id}&toUserName=${this.orderList.contactName}的服务群`
					})
				}).catch(res => {
					console.log(res)
				})
			},
			lookAll() {
				this.lookAllStatus = !this.lookAllStatus
				if (this.lookAllStatus) {
					this.bidOrderList = this.standbyBidOrderList.slice(0, 2)
				} else {
					this.bidOrderList = this.standbyBidOrderList
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.nav-bar {
		@include nav-bar-title(#303133)
	}

	.detail-page {
		width: 100vw;
		height: calc(100vh - 300rpx);
		overflow-y: auto;

		.tab-container {
			width: 100vw;
			margin: 20rpx 0;
		}

		.order-info {
			width: 100%;

			.order-header {
				width: 710rpx;
				height: 584rpx;
				border-radius: 16rpx 16rpx 0 0;
				background-color: #FFFFFF;
				margin: 20rpx 20rpx 0 20rpx;

				.topper {
					width: 90%;
					height: 108rpx;
					padding: 22rpx;
					margin: auto;
					border-bottom: 1rpx #EEEEEE solid;

					.left {
						width: 50%;

						.price-sign {
							margin-top: 12rpx;
							font-size: 30rpx;
							font-style: normal;
							font-weight: 600;
						}

						.price-tag {
							width: max-content;
							height: 40rpx;
							margin-left: 4rpx;
							padding: 0rpx 20rpx;
							font-family: 'PingFang SC';
							font-style: normal;
							font-weight: 300;
							font-size: 20rpx;
							line-height: 40rpx;
							color: #002FA5;
							background-position: center;
							background-repeat: no-repeat;
							background-size: 100% 100%;
							background-image: url(../../static/icon/Union.png);
						}

						.price {
							font-family: 'PingFang SC';
							font-style: normal;
							font-weight: 400;
							font-size: 48rpx;
							line-height: 34rpx;
							color: #303133;
						}
					}

					.right {
						width: 50%;
						font-family: 'PingFang SC';
						font-style: normal;
						font-weight: 500;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #002FA5;
						text-align: right;
					}
				}

				.center {
					width: 90%;
					margin: auto;
					padding: 0 22rpx;
					flex-wrap: wrap;

					.title {
						font-family: 'PingFang SC';
						font-style: normal;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #909199;
						margin-top: 16rpx;
						margin-bottom: 20rpx;

						.des {
							font-family: 'PingFang SC';
							font-style: normal;
							font-weight: 500;
							font-size: 28rpx;
							line-height: 36rpx;
							color: #303133;
							margin-left: 20rpx;
						}

						.des-price {
							font-family: 'PingFang SC';
							font-style: normal;
							font-size: 28rpx;
							line-height: 36rpx;
							color: #FC4429;
							margin-left: 20rpx;
						}
						
						.edit-icon {
							width: 32rpx;
							height: 32rpx;
							margin-left: 30rpx;
						}
					}

					.address {
						width: 100%;
						font-family: 'PingFang SC';
						font-style: normal;
						font-weight: 400;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #303133;
						
						.address-icon {
							width: 22rpx;
							height: 26rpx;
							margin-right: 6rpx;
						}
					}

					.phone {
						font-family: 'PingFang SC';
						font-style: normal;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #878787;
						margin-left: 20rpx;
					}
				}

				.bottom {
					width: 90%;
					height: 108rpx;
					margin: auto;
					padding: 0 22rpx;
					padding-bottom: 50rpx;
					border-bottom: 1rpx #EEEEEE solid;
					
					.divider {
						width: 1rpx;
						height: 18rpx;
						background: #C4C4C4;
					}

					.icon-button {
						width: 50%;
						height: 40rpx;
						text-align: center;
						font-family: 'PingFang SC';
						font-style: normal;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #909199;
						justify-content: center;

						.icon {
							width: 32rpx;
							height: 32rpx;
							margin-right: 6rpx;
						}
					}
				}
			}

			.quote {
				margin-left: 20rpx;
				margin-right: 20rpx;
				margin-bottom: 10rpx;
				background-color: #fff;
				height: 422rpx;
				border-radius: 16rpx;
				padding: 20rpx;

				.quote_bottom {
					.quote_bottom_image {
						margin-top: 44rpx;
						width: 52rpx;
						height: 52rpx;
						float: left;
						margin-right: 20rpx;
					}

					.quote_bottom_center {
						float: left;
						width: calc(100% - 130rpx);

						.quote_bottom_address {
							margin-top: 30rpx;
							font-size: 28rpx;
						}

						.quote_bottom_visitors {
							color: #999999;
							font-size: 24rpx;
							margin-top: 10rpx;
						}
					}

					.quote_phone {
						margin-top: 50rpx;
						margin-right: 10rpx;
						width: 40rpx;
						height: 39rpx;
						float: right;
					}
				}

				.quote_center {
					height: 108rpx;
					line-height: 108rpx;
					border-bottom: solid 1rpx #EEEEEE;

					.expect-offer {
						float: left;
						width: 50%;

						.Offer {
							float: left;
							font-size: 28rpx;
						}

						.price {
							float: left;
							color: #fd6d35;
							font-size: 28rpx;
						}

						.expect-offer-image {
							float: left;
							height: 28rpx;
							width: 28rpx;
							margin-top: 40rpx;
							margin-left: 10rpx;
						}
					}
				}

				.quote_top {
					border-bottom: solid 1rpx #eeeeee;
					padding-bottom: 20rpx;

					.quote_image {
						width: 130rpx;
						height: 130rpx;
						background-color: #eeeeee;
						float: left;
						margin-right: 20rpx;
						border-radius: 10rpx;
					}

					.requirementTypeName {
						float: left;
						color: $seconFontColor;
						font-size: 30rpx;
					}

					.skillTypeName {
						font-size: 16rpx;
						float: left;
						padding-left: 10rpx;
						padding-right: 20rpx;
						background: url(../../static/icon/skill_type_tag_2.png);
						background-size: cover;
						background-repeat: no-repeat;
						width: max-content;
						min-width: 76rpx;
						height: 32rpx;
						margin-top: 4rpx;
						line-height: 32rpx;
						margin-left: 6rpx;
						color: #333333;
						text-align: center;
					}

					.projectTime {
						margin-top: 6rpx;
						font-size: 24rpx;
						color: #999999;
					}

					.offer-people {
						margin-top: 16rpx;

						.offer-people-image {
							width: 40rpx;
							height: 40rpx;
							border-radius: 40rpx;
							background-color: #aaff00;
							float: left;
							margin-right: -10rpx;
							border: solid 1rpx #fff;
						}

						.offer-people-text {
							float: left;
							font-size: 24rpx;
							line-height: 40rpx;
							color: #999999;
							margin-left: 30rpx;
						}
					}
				}
			}
		}

		.offer-info {
			.registration-personnel {
				margin: 0 20rpx 10rpx 20rpx;
				border-radius: 16rpx;

				.contain {
					.item-contain-no {
						background-color: #FFFFFF;
						min-height: 240rpx;
						display: flex;
						justify-content: center;
						flex-direction: column;
						align-items: center;
						border-bottom-left-radius: 16rpx;
						border-bottom-right-radius: 16rpx;

						.offer-no {
							width: 146rpx;
							height: 130rpx;
						}

						.no-text {
							font-size: 28rpx;
							color: #909199;
						}
					}

					.item-contain-data {
						width: 100%;
						position: relative;
						border-radius: 16rpx;

						.item-personnel {
							margin-top: 6rpx;
							background-color: #FFFFFF;
							border-radius: 16rpx;
							padding-bottom: 10rpx;
						}

						.item-an {
							text-align: center;
							background-color: #FFFFFF;

							.item-icon-down {
								transform: rotate(270deg);
								margin-right: 20rpx;
							}

							.item-icon-up {
								transform: rotate(90deg);
								margin-right: 20rpx;
							}
						}

						.item-an-text {
							font-size: 28rpx;
							color: #909199;
							display: inline-block;
							padding-bottom: 26rpx;
						}

						.dont-like {
							width: 154rpx;
							height: 154rpx;
							position: absolute;
							z-index: 99;
						}

						.image-icon {
							position: absolute;
							z-index: 99;
						}

						.personnel-image {
							margin-top: 18rpx;
						}

						.personnel-contain {
							display: flex;
							margin-bottom: 32rpx;
							padding: 30rpx 32rpx 0 26rpx;
						}

						.personnel-detail {
							flex: 1;
							margin-left: 36rpx;

							.name-detail {
								font-size: 32rpx;
								font-weight: bold;
								display: flex;
								justify-content: space-between;
								font-family: PingFang SC;
								margin-bottom: 8rpx;
							}

							.item-name-detail {
								display: flex;
								flex-direction: row;
								align-items: center;

								.real-name {
									margin-right: 8rpx;
								}
							}

							.item-name {
								color: #333333;
							}

							.item-price {
								margin-top: 10rpx;
								color: #909199;
								font-family: 'PingFang SC';
								font-style: normal;
								font-weight: 500;
								font-size: 24rpx;
								line-height: 34rpx;

								.price {
									color: #FF5D35;
									font-style: normal;
									font-weight: 500;
									font-size: 24rpx;
									line-height: 34rpx;
								}
							}
						}

						.personnel-introduce {
							color: #999999;
							font-size: 24rpx;
							margin-bottom: 12rpx;
						}

						.personnel-tags {
							display: flex;
							position: relative;
							left: -10rpx;
							margin-bottom: 14rpx;
							margin-top: 20rpx;

							.u-tag {
								font-size: 20rpx;
								transform: scale(0.9);
							}
						}

						.personnel-statistical {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-top: 20rpx;

							.item-statistical {
								.item-text {
									font-size: 26rpx;
									color: #999999;
									margin-right: 82rpx;

									&:last-child {
										margin-right: 0;
									}
								}

								.item-num {
									font-size: 26rpx;
									color: #FF5D35;
								}
							}

							.communication {
								width: 44rpx;
								height: 44rpx;
							}

							.button-choose {
								width: 120rpx;
								height: 56rpx;
								text-align: center;
								background-color: #e1e5f4;
								border-radius: 10rpx;

								.text {
									color: #002FA5;
									font-size: 24rpx;
									font-style: normal;
									font-weight: 400;
									line-height: 56rpx;
								}
							}
						}
					}
				}
			}
		}
	}

	.video-popup {
		position: fixed;
		bottom: 0;
		left: 0;
		top: 0;
		right: 0;
		height: 100vh;
		width: 100vw;
		background: #000000;
		z-index: 666;

		.video_bac {
			width: 100vw;
			height: 40vh;
			margin-top: 30vh;
			padding: 20rpx;
			background-color: #FFFFFF;
		}

		.video_image {
			width: 100%;
			height: 100%;
		}

		.pupo_image {
			width: 40rpx;
			height: 40rpx;
			float: right;
			margin: 20rpx;
			margin-top: 80rpx;
		}
	}

	.demand-data {
		margin: 0 20rpx 10rpx 20rpx;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 0 20rpx 20rpx 20rpx;

		.demand_data_bottom {
			margin-top: 20rpx;
			height: calc(100% - 230rpx);

			.my_img {
				.bottom_image {
					border-radius: 10rpx;
					width: calc(33.3% - 20rpx);
					height: 204rpx;
					margin-right: 10rpx;
					margin-left: 10rpx;
					margin-bottom: 10rpx;
					float: left;
				}

				.imgLength {
					height: 40rpx;
					width: 86rpx;
					background: #000000;
					opacity: 0.5;
					border-radius: 30rpx;
					z-index: 999;
					float: left;
					margin-left: -96rpx;
					margin-top: 156rpx;
					color: #FFFFFF;
					text-align: center;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}

		.demand_data_center {
			height: 130rpx;
			border-bottom: solid 1rpx #EEEEEE;
			padding-top: 20rpx;

			.voice {
				border: solid 1rpx #EEEEEE;
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 10rpx;

				.voice_image {
					width: 40rpx;
					height: 40rpx;
					margin-top: 25rpx;
					margin-left: 20rpx;
					float: left;
				}

				.voice_time {
					float: left;
					width: 80rpx;
					text-align: center;
					color: #909399;
					font-size: 24rpx;
				}

				.voice_text {
					float: left;
					text-align: center;
					width: calc(100% - 280rpx);
					color: #909399;
					font-size: 26rpx;
				}
			}
		}

		.demand_data_title {
			font-weight: 500;
			line-height: 100rpx;
			border-bottom: solid 1rpx #EEEEEE;
		}
	}

	.requirement-description {
		margin: 0 20rpx 10rpx 20rpx;
		background-color: #fff;
		height: max-content;
		border-radius: 16rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;

		.description_information {
			padding: 20rpx;
			font-size: 28rpx;
			color: #666666;
			word-wrap: break-word;
			word-break: break-all;
			overflow: hidden;
		}

		.demand_data_title {
			font-weight: 500;
			line-height: 100rpx;
			border-bottom: solid 1rpx #EEEEEE;
		}
	}

	.order-title {
		padding: 20rpx 0;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 700;
		font-size: 30rpx;
		line-height: 42rpx;
		color: #303133;
		padding-left: 20rpx;
		margin-top: 10rpx;
	
		.order-title-icon {
			width: max-content;
			height: 40rpx;
			padding: 0rpx 20rpx;
			background-position: center;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			background-image: url(@/static/icon/order-title.png);
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 20rpx;
			line-height: 40rpx;
			color: #002FA5;
			margin-right: 12rpx;
		}
	}
	
	.order-information {
		margin: 0 20rpx 10rpx 20rpx;
		background-color: #fff;
		height: max-content;
		border-radius: 16rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;

		.demand_data_title {
			font-weight: 500;
			line-height: 100rpx;
			border-bottom: solid 1rpx #EEEEEE;
		}

		.order_information {
			padding: 20rpx;
			line-height: 40rpx;
			display: flex;

			.information_title {
				font-size: 28rpx;
				color: #909199;
			}

			.information_price {
				width: 70%;
				font-size: 28rpx;
				color: #FC4429;
				margin-left: 20rpx;
				@include bov(2);
			}
			
			.information_text {
				width: 70%;
				font-size: 28rpx;
				color: #666666;
				margin-left: 20rpx;
				@include bov(2);
			}

			.copy-icon {
				width: 40rpx;
				height: 40rpx;
				float: right;
			}
		}

		.demand_data_title {
			font-weight: 500;
			line-height: 100rpx;
			border-bottom: solid 1rpx #EEEEEE;
		}
	}

	.share-friends {
		width: 100vw;
		height: max-content;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0rpx;
		z-index: 333;
		padding: 20rpx 20rpx 0 20rpx;

		.share-with-friends {
			line-height: 88rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			border: solid 1rpx #EBEBEB;
			border-radius: 10rpx;
			max-width: 240rpx;
			text-align: center;
			font-weight: 500;
			float: right;
			font-size: 24rpx;
		}

		.offer-immediately {
			line-height: 88rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			margin-left: 20rpx;
			color: #fff;
			border-radius: 10rpx;
			width: 184rpx;
			text-align: center;
			font-size: 24rpx;
			font-weight: 500;
			float: right;
			background: linear-gradient(to right, $themeColor, $themeColor);
		}

		.send-order-operation {
			display: flex;
			float: right;

			.cancel,
			.fresh {
				font-size: 28rpx;
				padding: 24rpx 36rpx;
				border-radius: 10rpx;
				margin-right: 18rpx;
			}

			.fresh {
				border: 1rpx solid $themeColor;
				color: $themeColor;
			}

			.cancel {
				border: 1rpx solid #EBEBEB;
				color: #909299;
			}

			.share-the-inquiry {
				padding: 24rpx 78rpx;
				color: #FFFFFF;
				border-radius: 10rpx;
				background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			}

			.type-contain {
				padding-top: 42rpx;

				.type-title {
					font-size: 32rpx;
					color: $seconFontColor;
					margin: 0 20rpx;
					line-height: 1;
					padding-bottom: 36rpx;
					border-bottom: 1rpx solid #EEEEEE;
					display: flex;
					justify-content: flex-end;
					align-items: center;
				}

				.workers-type-item-value {
					padding: 40rpx;
					display: flex;
					flex-wrap: wrap;
				}

				.u-radio {
					margin-bottom: 40rpx;
					font-size: 28rpx;
					line-height: 1;
					color: #606266;

					&:last-child {
						margin-bottom: 0;
					}
				}

				.button-determine {
					background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
					border-radius: 10rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					text-align: center;
					padding: 24rpx 284rpx;
					margin: 0 64rpx 54rpx 62rpx;
				}

				.close-img {
					width: 42rpx;
					height: 42rpx;
				}

				.text-item {
					margin-right: 220rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	@keyframes turn {
		0% {
			-webkit-transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(90deg);
		}
	}
</style>
