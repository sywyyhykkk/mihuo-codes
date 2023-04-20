<template>
	<view>
		<u-popup v-model="isCallMaster" :mask-close-able="false" :safe-area-inset-bottom="true" height="85%"
			border-radius="20" mode="bottom">
			<view class="call-master">
				<!-- 内容 -->
				<view class="call">
					<!-- #ifdef APP-PLUS -->
					<u-mask :show="!isShowButton" :duration="0" :zoom="false"
						:customStyle="{ width: '100%', height: '200rpx' }"></u-mask>
					<!-- #endif -->
					<view class="call-close">
						<u-icon @click="closePopup" size="35" name="close"></u-icon>
					</view>
					<view class="call-main">
						<image v-if="data.img" :src="data.img" mode="scaleToFill" />
						<image v-else src="https://www.51mihuo.com/static/icon/work_type/cchu.png" />
						<view class="call-main_content">
							<view class="call-main_content-title">
								<text>{{ data.skillName}}</text>
								<image class="arrow-down" src="https://www.51mihuo.com/static/icon/arrow-down.png" />
							</view>
							<view class="call-main_content-text">{{ data.label }}</view>
						</view>
					</view>
				</view>
				<scroll-view class="form" scroll-y>
					<view class="uni-form-item uni-column">
						<view class="title">请选择呼叫类型</view>
						<view v-if="data && data.skillId">
							<view v-model="formData.priceWay">
								<view class="button-group">
									<view v-for="(item,index) in buttonGroup" :key="index" class="button-item">
										<view class="button" :class="{buttonClick:curClick===index}"
											@click="selectButton(item,index)"
											v-if="data.jobCode.indexOf('JOB_WORKER') == -1 || index === 0">
											{{ item.name }}
										</view>
										<!-- <text  class="button-title">{{ item.name }}</text> -->
									</view>
								</view>
								<view class="button-tips">{{ buttonGroup[curClick].tips }}</view>
							</view>
						</view>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">房屋地址</view>
						<view>
							<view class="common-input" @click="selectAddress">
								<view class="input-content">
									<view class="input_text"
										style="border-radius: 8rpx;background: #F7F7F7;font-size:28rpx;">
										<text style="font-size: 28rpx"
											v-if="formData.completeAddress">{{ formData.completeAddress }}</text>
										<text v-else style="color:#909199;font-size: 26rpx">请选择房屋地址</text>
									</view>
									<u-icon class="arrow" name="arrow-down" size="22" color="#808080"></u-icon>
								</view>
							</view>
						</view>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">期望上门时间</view>
						<view class="common-input" @click="()=>showCalendar=true">
							<view class="input-content">
								<view class="input_text"
									style="border-radius: 8rpx;background: #F7F7F7;font-size:28rpx;">
									<input placeholder-style="font-size: 24rpx;" disabled placeholder="请选择期望上门时间"
										class="input" v-model="formData.expectDate">
								</view>
								<u-icon class="arrow" name="arrow-down" size="22" color="#808080"></u-icon>
							</view>
						</view>
					</view>
					<view v-if="curClick === 1">
						<view class="uni-form-item uni-column">
							<view class="flex-box">
								<view class="title">一口价</view>
								<view class="title-right" v-if="formData.price">
									<text>￥</text>
									<!-- <text style="font-size:32rpx">{{ formData.price.toFixed(0) || ''}}</text> -->
									<text style="font-size:32rpx">{{ formData.price }}</text>
								</view>
							</view>
							<view v-for="(item,index) in offerList" :key="index" class="offer-flex"
								:class="{active:curOffer === index}">
								<view class="offer-flex_right" @click="offerType(item,index)">
									<view class="offer-top">
										<icon type='success' color='#FE6E32' size='18' class='icon_circle'
											v-if="curOffer === index" />
										<text v-else class="icon_circle icon_circle-no"></text>
										<view class="offer-top_left">{{ item.tips || ''}}</view>
									</view>
									<!-- <view class="offer-bottom">{{ item.tips }}</view> -->
								</view>
								<view class="offer-top_right" @click="toProduct(item)">
									<text>￥</text>
									<text style="font-size:32rpx">{{Math.floor(item.price)|| 0 }}</text>
									<text>{{ item.price | priceFormat }}/{{ item.unit || ''}}</text>
									<u-icon size="20" class="arrow-right" name="arrow-right"></u-icon>
								</view>
								<!-- <view class="offer-bottom" v-for="item,index in item.productSku" :key="index">
									{{item.key || ''}}: {{ item.value || ''}}
								</view> -->
							</view>
						</view>
						<view class="uni-form-item uni-column flex-box"
							v-if="['JOB_MANAGER','JOB_DESIGNER'].indexOf(data.jobCode) !== -1 && isShow">
							<view class="flex-box" style="flex-shrink:0;align-items: center;">
								<div class="title" style="margin-bottom:0">房屋面积</div>
								<text class="uni-column_tips">（实用面积，包含建筑外框墙体）</text>
							</view>
							<view class="content-price">
								<input style="height: auto !important" placeholder-style="font-size: 24rpx;"
									placeholder="请输入面积" class="input" type="digit" v-model="formData.area"
									@input="areaChange">
								<text>㎡</text>
							</view>
						</view>
						<!-- <view class="uni-form-item uni-column flex-box"
							v-if="['JOB_SUPERVISION'].indexOf(data.jobCode) !== -1">
							<view class="title" style="margin-bottom:0">数量</view>
							<u-number-box input-height="36" :value="Number(formData.area)"
								@change="amountChange($event)" :min="1">
							</u-number-box>
						</view> -->
					</view>
					<view class="uni-form-item uni-column" style="margin-top: 100rpx;">
						<view class="column-item">
							<view class="title">需求描述</view>
							<view class="icon-right" @click="commonUsed">
								<image src="https://www.51mihuo.com/static/icon/work_type/list.png" />
								<text>常用语</text>
							</view>
						</view>
						<view>
							<uni-easyinput type="textarea" :cursorSpacing="80" :autoHeight="true" v-model="formData.requirementDesc"
								maxlength="120" placeholder="请填写您的家装需求" :inputBorder="true" />
							<!-- <textarea placeholder-style="color:#F76260" placeholder="占位符字体是红色的" /> -->
						</view>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title title-no"></view>
						<view>
							<image-upload-new v-model="formData.uplodIamge" count="9" />
						</view>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title title-no"></view>
						<view @click="isShowButton = false">
							<sound-recording style="width:100%" @chooseVoice="chooseVoice" v-model="audioObj"
								@close="isShowButton = true" />
						</view>
					</view>
					<!-- #ifndef APP -->
					<view style="height: 100rpx;"></view>
					<!-- #endif -->
					<bottom-button v-if="isShowButton" title="确认提交" isShow @click="reSave"></bottom-button>
				</scroll-view>
			</view>
		</u-popup>
		<!-- 常用语列表 -->
		<view @click.stop>
			<u-select v-model="showUse" :list="commonUseList" @confirm="confirm" value-name="content"
				label-name="content"></u-select>
		</view>
		<u-picker mode="time" v-model="showCalendar" :params="params" @confirm="confirmDate"
			:start-year="(new Date().getFullYear())"></u-picker>
		<!-- 验证手机号的弹框 -->
		<view class="popup" v-if="verificationTelShow" @click.stop>
			<view class="popup_with">
				<image src="@/pages-findMaster/static/images/mine/popup_cancel.png" class="popup_cancel"
					@click="verificationTelShow=false">
					<view class="tel_title">验证手机号</view>
					<view class="tips">为了保障您的权益,首次发单需要验证手机号</view>
					<view class="inp_con">
						<view class="inputItem">
							<view class="title">手机号</view>
							<view class="info">
								<input type="number" maxlength="11" v-model="mobile" disabled placeholder="手机号" />
							</view>
						</view>
						<view class="inputItem" style="border: none;">
							<view class="title">短信验证</view>
							<view class="info">
								<input type="number" v-model="code" maxlength="6" placeholder="验证码" />
							</view>
							<view class="get_code" @click="getCode">{{send}}</view>
						</view>
						<view class="add-text" @click="onSubmit">确认</view>
					</view>
			</view>
		</view>
	</view>
</template>
<script>
	let timer;
	export default {
		data() {
			return {
				windowHeight: uni.getSystemInfoSync().windowHeight - 100 + "px",
				isShowButton: true,
				mobile: '',
				code: '',
				times: 60,
				send: '获取验证码',
				sendType: false,
				accountState: '',
				verificationTelShow: false,
				callShow: true,
				rules: [],
				curClick: 0,
				curOffer: null,
				buttonGroup: [{
						name: "上门开单",
						tips: '上门开单：直接呼叫师傅，师傅上门/聊天后根据需求给出报价',
						type: 3
					},
					// {
					// 	name: "竞价模式",
					// 	tips: '竞价模式：用户填写期望价格，多位师傅报价后从中选择一个',
					// 	type: 2
					// },
					{
						name: "一口价",
						tips: '一口价模式：用户填写订单总价，师傅根据需求和价格自行接单',
						type: 1
					},
				],
				showUse: false,
				commonUseList: [],
				audioList: [],
				formData: {
					priceWay: 3,
					contactGender: 1,
					expectDuration: 0,
					publishType: 1,
					referencePrice: 0,
					requirementType: 1,
					assignType: 2,
					requirementTypeName: '装修',
					source: 1,
					uplodIamge: null,
					attachments:[],
					requirementDesc:''
				},
				cityInfo: uni.getStorageSync('oldLocation'),
				curUser: uni.getStorageSync('userData').sysUser,
				isCallMaster: false,
				isExhibition: false,
				audioObj: {},
				offerList: [],
				curServiceItem: null,
				isShow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				showCalendar: false,
				isAllowPassedTime: false,
				curAddress:{}
			}
		},
		props: {
			value: {
				type: Boolean,
				default: () => false
			},
			data: {
				type: Object,
				default: () => {}
			},
			completeAddress: {
				type: Object,
				default: () => {
					return {}
				}
			},
			// 如何有值，说明改单时重新居于上个订单发单
			orderId: {
				type: [Number, String],
				default: () => {
					return ''
				}
			},
		},
		watch: {
			value(news) {
				this.isCallMaster = news;
				if (news) {
					this.getAccountStatus();
					this.getCommonUse();
					if (this.orderId) {
						this.getAgainOrder()
					}else{
						if(this.completeAddress && this.completeAddress.id){
						}else{
							this.getMyAddress()
						}
					}
					if (this.data && this.data.skillId) {
						this.getOfferList(this.data.skillId);
						if (this.data.jobCode.indexOf('JOB_SUPERVISION') != -1) {
							this.$set(this.formData, 'area', 1);
						}
					}
				}
			},
			completeAddress(data) {
				if (data && data.id) {
					this.curAddress = data;
					let address = (data.city == data.province ? '' : data.city || '') + (
							data.region || '') +
						(data.latAddress || '') + (data.poiName || '') + (data.detailAddress || '') + (data.address || '');
					this.$set(this.formData, 'completeAddress', address);
					this.$set(this.formData, 'area', data.area);
					this.$set(this.formData, 'price', null);
					this.totalPrice()
				}
			}
		},
		methods: {
			// 获取默认收获地址
			getMyAddress() {
				this.$httpApi.getPostAddress().then((res) => {
					if (res) {
						let data = res.filter(item => item.defaultStatus === 0);
						if (data && data.length) {
							this.curAddress = data[0];
							let address = (data[0].city == data[0].province ? '' : data[0].city || '') + (
								data[0].region || '') +
							(data[0].latAddress || '') + (data[0].poiName || '') + (data[0].detailAddress || '') + (data[0].address || '');
							this.$set(this.formData, 'completeAddress', address);
							this.$set(this.formData, 'area', data[0].area);
							this.$set(this.formData, 'price', null);
							uni.setStorageSync('roomAddress', data[0]);
						}
					}
				})
			},
			// 重新发单
			getAgainOrder() {
				this.$http.get(`order/biz_order/self/publishDetail/${this.orderId}`).then(res => {
					if (res) {
						if (res.attachments) {
							let data = JSON.parse(res.attachments)
							data.some((v, i) => {
								if (v.type == 'audio') {
									this.audioList = [v];
									this.audioObj = v;
								}
							})
							let img = data.filter(function(ele) {
								return ele.type != 'audio';
							})
							res.uplodIamge = JSON.stringify(img);
						}
						res.oldOrderId = res.id;
						this.formData = res;
						this.formData.completeAddress = (res.cityName == res
							.provinceName ? '' : res.cityName || '') + (res.districtName || '') + (res
							.latAddress || '') + (res.poiName || '') + (res.address || '')
						this.curClick = this.formData.priceWay == 1 ? 1 : this.formData.priceWay == 3 ? 0 : 0;
						this.getCommonUse();
					}
				})
			},
			//获取账户状态 如果账户没开通默认开通下账户
			async getAccountStatus() {
				await this.$httpApi.getPaymentAccountStatus().then(res => {
					for (let key in res) {
						this.accountState = key
					}
				}).catch(err => console.log(err))
				if (this.accountState == 0) {
					this.$httpApi.registerPaymentAccount().catch(err => console.log(err))
				}
			},
			getPhone() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.mobile = res.phone
					}
				}).catch(err => console.log(err))
			},

			getCode() {
				if (!this.mobile) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					});
					return;
				}
				if (this.sendType) {
					return;
				}
				//用于用户账户绑定手机号发送验证码
				this.$httpApi.sendPaymentAccountVerifyCode({
					phone: this.mobile
				}).then(res => {
					if (res) {
						timer = setInterval(() => {
							this.times--;
							if (this.times <= 0) {
								this.send = '获取验证码';
								clearInterval(timer);
								this.times = 60;
								this.sendType = false;
							} else {
								this.send = this.times + '秒后重试';
								this.sendType = true;
							}
						}, 1000)
						uni.showToast({
							title: '验证码发送成功',
							icon: 'none'
						});
					}
				})
			},

			async onSubmit() {
				if (!this.code) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return;
				}
				let httpData = {
					phone: this.mobile,
					verifyCode: this.code
				};
				uni.showLoading({
					mask: true
				})
				this.$httpApi.bindPhone(httpData).then(res => {
						if (res) {
							this.getAccountStatus()
							this.verificationTelShow = false
							uni.showToast({
								title: '验证成功',
								icon: 'none'
							})
							setTimeout(() => {
								this.reSave()
							}, 500)
						}
					})
					.catch(err => console.log(err))
					.finally(() => {
						uni.hideLoading()
					});
			},
			// 获取常用语
			async getCommonUse() {
				let res = await this.$http.get('basic/basiccommonstatement/page', {
					size: 20,
					current: 1,
					categoryFlag: `ORDER_${this.data.skillId}`
				})
				if (res) {
					this.commonUseList = res.records;
				}
			},
			commonUsed() {
				if (this.commonUseList.length) {
					this.showUse = true;
					return
				}
				this.$util.toast("暂无常用语")
			},
			closePopup() {
				this.isCallMaster = false;
				this.formData = {
					priceWay: 3,
					contactGender: 1,
					expectDuration: 0,
					publishType: 1,
					referencePrice: 0,
					requirementType: 1,
					assignType: 2,
					requirementTypeName: '装修',
					source: 1,
					price: '',
					area: '',
					expectDate: '',
					attachments:[],
					uplodIamge: null,
					skuName:'',
					skuId:'',
				}
				this.curClick = 0;
				this.audioObj = {};
				this.offerList = [],
				this.curServiceItem = null,
				this.curOffer = null;
				uni.showTabBar({
					animation: true
				});
				this.$emit('input', false)
				this.$emit('isOK');
				uni.removeStorageSync('roomAddress')
				this.isShow = false;
			},
			// 按钮切换选择
			selectButton(data, index) {
				this.curClick = index;
				this.formData.priceWay = data.type;
			},
			// 获取音频
			async chooseVoice(file, flag) {
				if (file.buttonType !== 'clear') {
					this.isShowButton = true
				}
				if (file.path != '{}') {
					let temp = [{
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}]
					this.audioList = temp;
					this.audioObj = temp[0]
				}
				if (file.buttonType == 'clear') {
					this.audioList = [];
					this.audioObj = {}
				}
			},
			// 选择收获地址
			selectAddress() {
				this.toPage(`/pages-common/addressList/addressList?isShow=${true}`)
			},
			// 常用语
			confirm(e) {
				if (e && e.length) {
					this.formData.requirementDesc = this.formData.requirementDesc ? this.formData.requirementDesc + e[0]
						.value : e[0].value;
					if(this.formData.requirementDesc.length>120){
						this.formData.requirementDesc = this.formData.requirementDesc.substring(0,120);
					}
				}
			},
			// 日期选择
			confirmDate(e) {
				if (e) {
					this.formData.expectDate = `${e.year}-${e.month}-${e.day}`
				}
			},
			async reSave() {
				let date = new Date();
				this.formData.id = null;
				const roomAddress = this.curAddress;
				if (!this.formData.priceWay) {
					this.$util.toast("请选择呼叫类型")
					return false
				}
				if (!this.formData.completeAddress) {
					this.$util.toast("请选择房屋地址")
					return false
				}
				if (!this.formData.expectDate) {
					this.$util.toast("请选择期望上门时间")
					return false
				}
				if (this.curClick == 1 && !this.curServiceItem) {
					this.$util.toast("请选择一口价服务类型")
					return false
				}
				if (this.curClick == 1 && !this.formData.area) {
					this.$util.toast("请填写房屋面积")
					return false
				}
				if (!roomAddress.adcode) {
					this.$util.toast("地址不合规，请选择合规地址")
					return false
				}
				// 判断所选房屋地址是否与所选运营商在同一区域
				let curCity = await this.$http.post(
					`admin/cityoperator/getbyareacode/${roomAddress.adcode.substr(0, 4)}`)
				if (curCity && curCity.id) {
					this.formData.cityId = curCity.id;
					this.formData.cityOperatorId = curCity.id;
					this.formData.companyId = curCity.defaultCompanyId;
				} else {
					this.$util.toast("您的房屋地址未匹配到运营商,请重新选择")
					return false
				}
				if(this.curClick == 0){
					this.formData.price = null;
				}
				this.formData.skillName = this.data.skillName;
				this.formData.skillId = this.data.skillId;
				this.formData.homeId = roomAddress.id;
				this.formData.latitude = roomAddress.latitude;
				this.formData.longitude = roomAddress.longitude;
				this.formData.provinceName = roomAddress.province; //省
				this.formData.cityName = roomAddress.city; //市
				this.formData.districtName = roomAddress.region; //区
				this.formData.latAddress = roomAddress.latAddress; //街道地址
				this.formData.poiName = roomAddress.poiName; //POI名称
				this.formData.address = roomAddress.detailAddress;
				this.formData.contactName = roomAddress.name,
				this.formData.contactPhone = roomAddress.phoneNumber,
				this.formData.addressId = roomAddress.id
				// 判断是否有文件
				if (this.formData.uplodIamge) {
					this.formData.attachments = JSON.parse(this.formData.uplodIamge) || []
				}
				if (this.audioList && this.audioList.length) {
					this.formData.attachments = this.formData.attachments ? this.formData.attachments.concat(this
						.audioList) : this.audioList
				}
				this.formData.requirementName =
					`${roomAddress.poiName || ''}需要${this.formData.requirementTypeName}类的${this.data.skillName || ''}`
				//如果首次发单没有验证手机号就关闭后台返回的‘先验证手机号；’提示，只关闭此提示
				let isShowMessage = true
				if (this.accountState == 1) {
					isShowMessage = false
				}
				/**  一口价模式直接跳转到商城对应suk订单支付 */
				if(this.curClick == 1 ){
					this.$httpApi.generateMallOrder({
						shoppingCart: false,
						enableDiffAmount: true,
						memberReceiveAddressId: roomAddress.id,
						products:[{
							count: this.formData.area,
							skuId: this.formData.skuId,
							remark: this.formData.requirementDesc || '',
						}],
						sourceType: 1 // app订单
					}).then(res => {
						if (res) {
							if(res.companyOrders && res.companyOrders.length){
								res.companyOrders.map((item)=>{
									if(item.orders&&item.orders.length){
										item.orders.some(v=>{
											v.note = this.formData.requirementDesc || ''
										})
									}
								})
							}
							uni.setStorageSync('orderConfirmInfo', res);
							this.toPage('/pages-mall/submitOrder/submitOrder');
							this.closePopup();
						}
					})
				}else{
					// 保存
					uni.showLoading();
					this.$http.post('order/biz_order', this.formData, {
						header: {
							isShowMessage: isShowMessage
						}
					})
					.then(res => {
						if (res) {
							this.$util.toast("订单发布成功");
							this.callShow = false;
							this.verificationTelShow = false;
							this.closePopup();
							// 用于刷新重新发布的新订单
							if (res.id) {
								this.$emit('getWorkerInfo', res.id)
							}
						} else {
							this.$util.toast(res.msg)
							this.isCallMaster = false;
						}
						uni.showTabBar({
							animation: true
						});
					})
					.catch(e => {
						let err = e.codeData
						if (err.code == 1 && err.data == 6) {
							this.getPhone()
							this.verificationTelShow = true
						}
					})
					.finally(() => {
						uni.hideLoading();
					})
				}
			},
			// handleTop(){
			// 	 uni.pageScrollTo({
			// 		scrollTop: 400,
			// 		duration: 0
			// 	})
			// },
			// 根据工种获取服务项
			getOfferList(skillId) {
				this.$httpApi.getSkillSku({
					skillId: skillId
				}).then(res => {
					if (res && res.length) {
						res.map(item => {
							let sku = []
							item.productSku = JSON.parse(item.productSku);
							item.productSku.map((v) => {
								sku.push(v.value)
							})
							item.tips = sku.join(',')
						})
						this.offerList = res;
					}
				})
			},
			offerType(data, index) {
				this.formData.skuName = data.name;
				this.formData.skuId = data.skuId;
				this.curOffer = index;
				this.curServiceItem = data;
				if (data.unit.indexOf('平方') !== -1 || data.unit.indexOf('㎡') !== -1 || data.unit.indexOf('米') !== -1) {
					this.isShow = true;
					this.formData.area = this.completeAddress.area || ''
					this.totalPrice();
				} else {
					this.isShow = false;
					this.formData.area = 1;
					this.formData.price = data.price || 0
				}
			},
			areaChange(e){
				this.formData.area = e.detail.value
				this.totalPrice()
			},
			totalPrice() {
				if (this.curServiceItem) {
					if(this.curServiceItem.unit.indexOf('平方') !== -1 || this.curServiceItem.unit.indexOf('㎡') !== -1 || this.curServiceItem.unit.indexOf('米') !== -1){
						if(this.formData.area){
							let num = this.$math.floatMul(this.curServiceItem.price, Number(this.formData.area));
							this.$set(this.formData, 'price', num);
						}else{
							this.formData.price = null
						}
					}else{
						this.formData.area = 1;
						this.$set(this.formData, 'price', this.curServiceItem.price);
					}
				}
				this.$forceUpdate();
			},
			toProduct(data) {
				this.toPage(`/pages-mall/productDetail/productDetail?id=${data.id}&type=callMaster`)
			},
			amountChange(e) {
				this.formData.area = e.value;
				this.totalPrice();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.call-master {
		height: 100%;
	}

	.call {
		height: 200rpx;
		padding: 20rpx 30rpx 0;
		box-sizing: border-box;
		border-radius: 20rpx 20rpx 0 0;
		background: #FFFFFF;

		.call-close {
			display: flex;
			justify-content: flex-end;
		}

		.call-main {
			display: flex;
			align-items: center;

			image {
				width: 140rpx;
				height: 120rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.call-main_content {
				.call-main_content-title {
					display: flex;
					align-items: center;

					text {
						color: #141414;
						font-weight: bold;
						font-size: $mainFontSize;
						padding-right: 20rpx;
					}

					.arrow-down {
						height: 27rpx;
						width: 27rpx;
					}
				}

				.call-main_content-text {
					color: #808080;
					font-size: 26rpx;
				}
			}
		}
	}

	/* 滑块 */
	.form {
		height: calc(100% - 200rpx);
		overflow-y: scroll;
		.uni-form-item {
			margin-bottom: 40rpx;
			padding: 0 30rpx;

			.content-price {
				display: flex;
				align-items: center;
				background: #F7F7F7;
				border-radius: 8rpx;

				.input {
					padding: 12rpx 18rpx;
					flex: 1;
				}

				text {
					font-size: 26rpx;
					padding: 14rpx 20rpx;
					padding-left: 0;
					background: #F7F7F7;
					display: block;
					border-top-right-radius: 8rpx;
					border-bottom-right-radius: 8rpx;
				}
			}

			.column-item {
				display: flex;
				justify-content: space-between;
				position: relative;

				.icon-right {
					display: flex;
					align-items: center;
					position: absolute;
					right: 0;
					top: 0;

					image {
						width: 20rpx;
						height: 20rpx;
						margin-right: 10rpx;
					}

					text {
						font-size: 24rpx;
					}
				}
			}

			.title {
				margin-bottom: 20rpx;
				font-weight: bold;
				font-size: $middleFontSize;
			}

			.button-group {
				display: flex;

				.button-item {
					margin-right: 20rpx;

					&:last-child {
						margin-right: 0;
					}
				}

				.button {
					width: 170rpx;
					height: 70rpx;
					line-height: 70rpx;
					font-weight: bold;
					text-align: center;
					font-size: $smallFontSize;
					border-radius: 12rpx;
					border: 2rpx solid #141414;

				}

				.buttonClick {
					background: #141414;
					color: #FFFFFF;
				}
			}

			.button-tips {
				font-size: 22rpx;
				padding-top: 20rpx;
			}
		}
	}

	::v-deep.u-form-item--right__content {
		background: #F7F7F7 !important;
	}

	.common-input {
		background: #F7F7F7;
		border-radius: 8rpx;
		width: 100%;
		padding: 12rpx 18rpx;
		min-height: 1.4em;
		line-height: 1.4em;

		.input-emtpy {
			display: flex;
			justify-content: space-between;

			text {
				color: #808080;
				font-size: 26rpx;
			}
		}

		.input-content {
			display: flex;
			justify-content: space-between;

			.input-content_item {
				flex: 1;
			}

			.arrow {
				margin-left: 10rpx;
			}
		}
	}

	.popup {
		position: fixed;
		bottom: 0;
		left: 0;
		top: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 99999;

		.popup_with {
			position: absolute;
			left: 46rpx;
			right: 46rpx;
			top: 20%;
			background: #FFFFFF;
			border-radius: 30rpx;
			padding: 30rpx 20rpx;

			.popup_cancel {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
				width: 50rpx;
				height: 50rpx;
				margin-left: -50rpx;
			}

			.tips {
				margin: 10rpx 23rpx 0;
				font-size: 26rpx;
				color: #909090;
			}
		}
	}

	.tel_title {
		text-align: center;
	}

	.inputItem {
		background-color: #fff;
		display: flex;
		padding: 0 25rpx;
		border-bottom: 1rpx solid #f6f6f6;
	}

	.inputItem .title {
		min-width: 150rpx;
		height: 100rpx;
		line-height: 100rpx;
		flex-shrink: 0;
		font-size: 30rpx;
		white-space: nowrap;
	}

	.inputItem .info {
		flex: 1;
		display: flex;
		align-items: center;
		color: #999;
	}

	.inputItem .info input {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 30rpx;
		width: 60%;
	}

	.get_code {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #FFFFFF;
		text-align: center;
		margin-right: 40rpx;
		margin-top: 20rpx;
	}

	.btnContent {
		margin: 248rpx 64rpx 64rpx 64rpx;
		text-align: center;

		.button {
			width: 624rpx;
			line-height: 88rpx;
			display: inline-block;
			color: #FFFFFF;
			background: #FE6E32;
			font-size: $middleFontSize;
			border-radius: $miniBorderRadius;
		}
	}

	.add-text {
		margin: 20rpx 20rpx 0;
		@include button;
	}

	.flex-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title-right {
		text {
			color: #FE6E32;
			font-size: 24rpx;
			font-family: PingFang-SC;
			font-weight: bold;
		}
	}

	.offer-flex {
		margin-bottom: 20rpx;
		display: flex;
		width: 690rpx;
		box-sizing: border-box;
		.icon_circle {
			margin-right: 10rpx;
		}

		.icon_circle-no {
			width: 37rpx;
			height: 37rpx;
			border-radius: 50%;
			border: 2rpx solid #141414;
		}

		.offer-flex_right {
			flex: 1;
			padding-right: 20rpx;
			box-sizing: border-box;
		}
		.offer-top {
			display: flex;
			align-items: center;
			.offer-top_left {
				color: #333333;
				font-size: 24rpx;
				font-weight: bold;
				@include toe;
			}

		}

		.offer-top_right {
			flex-shrink: 0;
			text {
				color: #000000;
				font-size: 20rpx;
				font-weight: bold;
			}

			.arrow-right {
				margin-left: 10rpx;
			}
		}

		.offer-bottom {
			font-size: 20rpx;
			color: #808080;
			margin-left: 50rpx;
		}
	}

	.active {
		.offer-top_left {
			color: #FE6E32 !important;
		}
	}

	.uni-column_tips {
		color: #808080;
		font-size: 20rpx;
		margin-right: 30rpx;
	}
</style>
