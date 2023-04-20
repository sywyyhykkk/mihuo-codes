<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				发布需求
			</view>
		</z-nav-bar>
		<view class="home-sticky_page">
			<view key="repair" class="list-item">
				<view class="c-input borderRadius">
					<u-input v-model="formData.requirementDesc"
						placeholder-style="color: #999999;fontSize: 24rpx;background:#F7F7F7"
						style="background:#F7F7F7;border-radius: 12rpx" maxlength="200" height="150" type="textarea"
						placeholder="我要办件什么事～" :border="true" />
				</view>
				<view class="useful" v-if="usefulList && usefulList.length">
					<scroll-view class="useful-contain" :scroll-x="true" :enable-flex="true">
						<view class="useful-tabs-item flex-center">
							<div v-for="(item, index) in usefulList" :key="index" class="tabs-item_label"
								:class="{'tabs-active':currentTag === index}" @click="()=>currentTag=index">
								{{ item.label|| '' }}
								<span class="arrow"></span>
							</div>
						</view>
					</scroll-view>
					<view class="useful-tips">
						<view v-if="!isFresh">
							<template v-if="usefulList[currentTag].children && usefulList[currentTag].children.length">
								<view class="useful-tips_item" v-for="(dax,idx) in usefulList[currentTag].children"
									:key="idx">
									<view class="useful-tips_label">{{ dax||''}}</view>
									<span class="useful-tips_data" @click="addDesc(dax)">一键填入</span>
								</view>
							</template>
							<view v-else class="useful-tips_item empty">空空如也~</view>
						</view>
						<view v-else class="useful-tips_item empty">空空如也~</view>
					</view>
					<view class="change-tips">
						<span @click="changeData">换一换</span>
						<!-- #ifdef APP-PLUS -->
						<image class="fresh-img" mode="aspectToFit" src="@/pages-homeCall/static/icon/fresh.png" />
						<!-- #endif -->
						<!-- #ifndef APP-PLUS -->
						<mihuo-image class="fresh-img" src="https://www.51mihuo.com/static/icon/home_v3/fresh.png" />
						<!-- #endif -->
					</view>
				</view>
				<view class="cameras">
					<image-upload-new :is-show="false" size="216" iconIsChange :count="9"
						v-model="formData.uplodIamge" />
				</view>
				<view class="address borderRadius" @click="selectAddress">
					<mihuo-image class="address-img maps" src="https://www.51mihuo.com/static/icon/address.png" />
					<view v-if="callAddress && callAddress.id" class="text-select">
						<view>
							<text>{{ callAddress.poiName || ''}}</text>
							<text
								class="min-text padding">({{(callAddress.province || '') + (callAddress.city || '') + (callAddress.region || '')}})</text>
						</view>
						<view>
							<text class="min-text">{{callAddress.name || ''}}</text>
							<text class="min-text padding">{{callAddress.phoneNumber || ''}}</text>
						</view>
					</view>
					<view v-else class="text">请选择房屋地址</view>
				</view>
				<!-- 详细说明 -->
				<view class="description borderRadius">
					<sound-recording style="width:100%" @chooseVoice="chooseVoice" v-model="audioObj" />
				</view>
				<view class="text-tips">
					接单师傅会根据实际情况按平台透明报价服务
				</view>
			</view>
			<bottom-button title="发布需求" :styleObj="{ backgroundColor: '#000000' }" @click="save"></bottom-button>
		</view>
		<!-- 验证手机号的弹框 -->
		<view class="popup" v-if="verificationTelShow" @click.stop>
			<view class="popup_with">
				<image src="@/pages-homeCall/static/icon/popup_cancel.png" class="popup_cancel"
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
		<!-- 滑块验证 -->
		<homeCall-mh-verify @success="success" :mode="'pop'" :captchaType="'blockPuzzle'"
			:imgSize="{ width: '330px', height: '155px' }" ref="verify" />
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js';
	export default {
		data() {
			return {
				timer: null,
				content: '',
				formData: {
					priceWay: 3,
					contactGender: 1,
					expectDuration: 0,
					publishType: 1,
					referencePrice: 0,
					requirementType: 1,
					assignType: 2,
					requirementTypeName: '装修',
					requirementType: 1,
					source: 1,
				},
				address: {},
				audioList: [],
				audioObj: {},
				currentTag: 0,
				// 首页呼叫navList 装修服务、维修安装、呼叫工人
				currentTab: 0, // 显示首页呼叫的当前tab的index
				HomeCallList: [{
					label: '需求',
					value: 0
				}],
				homeCallContentTypeList: [],
				curArr: [],
				verificationTelShow: false,
				mobile: '',
				code: '',
				times: 60,
				send: '获取验证码',
				sendType: false,
				accountState: '',
				verificationTelShow: false,
				callAddress: {},
				options: {},
				placeholderStyle: 'font-size: 28rpx; font-family: Noto Sans S Chinese;font-weight: 400; color: #909090; line-height: 34rpx;',
				usefulList: [],
				page: {
					size: 4,
					current: 1,
					pages: 0
				},
				isFresh: false
			}
		},
		onLoad(options) {
			this.options = options;
			// TODO isFromShare = 1
			if (options.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('呼叫师傅', url, this.options.userId)
			}
			this.getDefaultJob();
			if (options.orderId) {
				this.getAgainOrder();
				if (uni.getStorageSync('roomAddress')) {
					this.callAddress = uni.getStorageSync('roomAddress');
				}
			} else {
				this.getMyAddress()
			}
			this.getTypeTags()
		},
		onShareAppMessage() {
			const coverImg = ''
			const path =
				`/pages-homeCall/repairNotFilled/repairNotFilled?skillId=${this.options.skillId}&skillName=${this.options.skillName}`
			const result = this.$util.shareToWechat('遇事不决，可问觅活', coverImg, path, '发布需求', true, 1)
			return result
		},
		onShow() {
			uni.$once('roomAddress', (data) => {
				if (data) {
					this.callAddress = data
					let address = (data.province || '') + (data.city == data.province ? '' : data.city || '') + (
							data.region || '') +
						(data.latAddress || '') + (data.poiName || '') + (data.detailAddress || '') + (data
							.address || '');
					this.$set(this.formData, 'completeAddress', address);
				}
			})
			this.getAccountStatus()
		},
		methods: {
			// 获取默认工种(工匠)
			getDefaultJob(){
				this.$httpApi.defaultJobSkill().then(res=>{
					if(res){
						this.formData.skillName = res.skillName;
						this.formData.skillId = res.skillId;
					}
				})
			},
			// 获取默认收获地址
			getMyAddress() {
				this.$httpApi.getPostAddress().then((res) => {
					if (res) {
						let data = res.filter(item => item.defaultStatus === 0);
						if (data && data.length) {
							this.callAddress = data[0];
							let address = (data.province || '') + (data.city == data.province ? '' : data.city ||
									'') + (
									data.region || '') +
								(data.latAddress || '') + (data.poiName || '') + (data.detailAddress || '') + (data
									.address || '');
							this.$set(this.formData, 'completeAddress', address);
						}
					}
				})
			},
			// 重新发单
			getAgainOrder() {
				this.$http.get(`order/biz_order/self/publishDetail/${this.options.orderId}`).then(res => {
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
					}
				})
			},
			async chooseVoice(file, flag) {
				if (file.path != '{}') {
					let temp = [{
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}]
					this.audioList = temp;
					this.audioObj = temp[0];
				}
				if (flag) {
					this.audioList = [];
					this.audioObj = {}
				}
			},
			selectAddress() {
				this.toPage(`/pages-common/addressList/addressList?isShow=${true}`);
			},
			changeType(index, data) {
				let repeatArr = []; //重复元素计算
				this.curArr.push(data);
				for (var i = 0; i < this.curArr.length; i++) {
					if (this.curArr[i] == data) {
						repeatArr.push(data)
					}
				}
				if ((repeatArr.length) % 2 === 0) {
					for (var i = 0; i < this.curArr.length; i++) {
						if (this.curArr[i] == data) {
							this.curArr.splice(i, 1);
							i--
						}
					}
				} else {
					this.curArr = Array.from(new Set(this.curArr))
				}
				this.getDesc();
			},
			closeTabs(index) {
				this.curArr.splice(index, 1);
				this.getDesc();
			},
			async save() {
				let date = new Date();
				const roomAddress = this.callAddress;
				if (!this.callAddress.id) {
					this.$util.toast("请选择地址")
					return false
				}
				if (!roomAddress.adcode) {
					this.$util.toast("地址不合规，请选择合规地址")
					return false
				}
				if (!this.formData.requirementDesc) {
					this.$util.toast("请输入需求描述（我要办什么事）")
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
					this.formData.attachments = JSON.parse(this.formData.uplodIamge)
				}
				if (this.audioList && this.audioList.length) {
					this.formData.attachments = this.formData.attachments ? this.formData.attachments.concat(this
						.audioList) : this.audioList
				}
				// if (!this.$checkUploadProcess(this.formData.uplodIamge)) {
				// 	this.$util.toast("图片正在上传中,请稍作等待")
				// 	return
				// }
				this.formData.requirementName = `${roomAddress.poiName || ''}需要${this.formData.skillName || ''}`
				this.formData.expectDate = date.getFullYear() + '-' + (date.getMonth() + 1 >= 10 ? (date.getMonth() +
					1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date
					.getDate());
				/**
				 * 发布需求验证，一小时内发布多条需求，第二条后需要安全验证；反之则无需认证
				 */
				if (uni.getStorageSync('releaseTime')) {
					let lastTime = uni.getStorageSync('releaseTime')
					let intervalTime = new Date() - lastTime
					if (intervalTime < 3600000) {
						this.$refs.verify.show();
					} else {
						this.saveConfirm();
					}
				} else {
					this.saveConfirm()
				}

			},
			saveConfirm() {
				//如果首次发单没有验证手机号就关闭后台返回的‘先验证手机号；’提示，只关闭此提示
				let isShowMessage = true
				if (this.accountState == 1) {
					isShowMessage = false
				}
				uni.showLoading({
					title: '发布中，请稍等',
					mask: true
				});
				this.$httpApi.issueRequirementOrder(this.formData, {
						header: {
							isShowMessage: isShowMessage
						}
					})
					.then(res => {
						if (res) {
							this.$util.toast("发布成功")
							this.verificationTelShow = false;
							uni.setStorageSync('releaseTime', new Date())
							uni.removeStorageSync('roomAddress')
							if (res.id) {
								uni.$emit('refreshPage', res)
							}
							this.toPage(`/pages-order/callOrderDetails?id=${res.id}&back=home`)
						} else {
							this.$util.toast(res.msg)
						}
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
			},
			// 验证成功
			success(params) {
				this.$refs.verify.closeBox();
				this.saveConfirm()
				// params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
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
						this.timer = setInterval(() => {
							this.times--;
							if (this.times <= 0) {
								this.send = '获取验证码';
								clearInterval(this.timer);
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
								this.save()
							}, 500)
						}
					})
					.catch(err => console.log(err))
					.finally(() => {
						uni.hideLoading()
					});
			},
			// 获取发布需求常用语标签
			getTypeTags() {
				this.$httpApi.getDictByType({
					type:'issue_statement_label'
				}).then(res=>{
					this.usefulList = res;
					if(res && res.length) this.getDictByTag()
				})
			},
			// 获取对应标签的字典项
			getDictByTag(){
				this.$httpApi.getPlatformSkills({
						type: '', // 查询全部
						clientType: 'platform'
					}).then((res) => {
						if (res) {
							let master = res.find((item)=>item.jobCode == 'JOB_DEFAULT')
							if(master){
								this.isFresh = true;
								this.$httpApi.getDictByValue({
									size: this.page.size,
									current: this.page.current,
									categoryFlag:'ORDER_'+ master.skillId
								}).then(res=>{
									this.page.pages = res.pages
									this.usefulList.some((item)=>{
										item.children = []
										res.records.map((dic)=>{
											if (dic.labels && dic.labels.length){
												dic.labels.forEach((ele)=>{
													if (ele == item.label) {
														item.children.push(dic.content)
													}
												})
											}
										})
									})
								}).finally(()=>{
									this.isFresh = false;
								})
							}
						}
					})
			},
			// 一键填入
			addDesc(data) {
				let des = (this.formData.requirementDesc || '') + data
				this.$set(this.formData, 'requirementDesc', des);
			},
			// 刷新
			changeData() {
				this.page.current += 1;
				if (this.page.pages < this.page.current) this.page.current = 1;
				this.getTypeTags()
			},
		}
	}
</script>
<style lang="scss" scoped>
	/deep/ .u-size-default {
		/* #ifdef H5 */
		font-size: 15px;
		height: 70rpx;
		line-height: 70rpx;
		width: 98%;
		background-color: #000000;
		color: #fff;
		margin: auto;
		// #endif
		// #ifdef APP-PLUS 
		font-size: 25rpx;
		height: 70rpx;
		line-height: 70rpx;
		width: 98%;
		background-color: #000000;
		color: #fff;
		margin: auto;
		// #endif
		// // #ifdef MP-WEIXIN
		// width: 240rpx;
		// color:#A8A8A8;
		// margin: auto ;
		// // #endif
	}

	/deep/ button {
		// #ifdef MP-WEIXIN
		width: 98%;
		margin: auto;
		height: 90rpx;
		line-height: 90rpx;
		color: #fff !important;
		background: #000000 !important;
		// #endif
	}

	/deep/ .u-size-default {
		background: #000000;
		color: #fff;
	}

	// /deep/ .u-input {
	// 	background: #F7F7F7;
	// }

	// /deep/ .u-input--border {
	// 	border: none;
	// }


	// /deep/ .uni-input-placeholder {
	// 	color: #000000 !important;
	// 	font-weight: bold;
	// }

	// /deep/ .u-input__input {
	// 	// #ifdef APP-PLUS || MP-WEIXIN
	// 	color: #000000 !important;
	// 	font-weight: bold;
	// 	// #endif
	// }

	/deep/ .u-input--border {
		border: none !important
	}

	.list-item {
		padding: 20rpx 30rpx !important;

		.description {
			background: #F7F7F7 !important;
			margin-top: 40rpx;

			.text {
				padding: 30rpx;
				color: #A8A8A8;
				font-size: 24rpx;
				font-family: NotoSansHans;
			}
		}

		.tabs {
			display: flex;
			flex-flow: row wrap;

			.tabs-item {
				background: #FFF0E8;
				margin-top: 20rpx;
				margin-right: 20rpx;
				padding: 10rpx 20rpx;
				border-radius: 10rpx;
				position: relative;

				.tabs-label {
					color: #FE6E32;
					font-size: 24rpx;
				}

				.tabs-close {
					position: absolute;
					right: -12rpx;
					top: -10rpx;
					background: #A8A8A8;
					padding: 6rpx;
					border-radius: 50%;
				}
			}
		}

		.address {
			display: flex;
			align-items: center;
			background: #F7F7F7;
			padding: 30rpx;
	
			.address-img {
				height: 35rpx;
				width: 35rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}		
			.text-select {
				color: #000000;

				.min-text {
					font-size: 24rpx;
				}

				.padding {
					padding-left: 10rpx;
				}
			}

			/deep/ .uni-input {
				height: 65rpx;
				line-height: 65rpx;
			}

			.text {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #A8A8A8;
				line-height: 34rpx;
			}
		}

		.text-tips {
			padding: 20rpx 0;
			color: #000000;
			font-size: 24rpx;
		}

		.content-address {
			background: #fff;
			margin: 20rpx 0;
			border-radius: 24rpx;
			padding: 20rpx 40rpx;
			display: flex;
			align-items: center;
			position: relative;

			.maps {
				margin-right: 30rpx;
				height: 40rpx;
				width: 40rpx;
				flex-shrink: 0;
			}

			text {
				font-size: 26rpx;
				font-weight: bold;
				margin-right: 10rpx;
				@include bov(2);
			}

			.arrow-right {
				position: absolute;
				right: 0;
				padding-right: 20rpx;
			}
		}
		.useful{
			margin-bottom: 40rpx;
			width: 690rpx;
			.useful-contain {
				width: 100%;
				white-space: nowrap;
				.useful-tabs-item {
					width: 100%;
					padding-bottom: 20rpx;
					.tabs-item_label {
						color: #333333;
						font-size: 24rpx;
						font-family: NotoSansHans-Regular;
						background: #F7F7F7;
						padding: 10rpx;
						border-radius: 8rpx;
						margin-right: 20rpx;
						border: 2rpx solid #e4e7ed;
						/*  #ifdef  MP-WEIXIN  */
						// margin-top: 30rpx;
						/*  #endif  */
						position: relative;
					}

					.tabs-active {
						color: #FE6E32;
						border: 2rpx solid #FE6E32;
						background: #FFF0EA;
						position: relative;
						.arrow {
							width: 0;
							height: 0;
							border-style:solid;
							border-width: 0 15rpx 15rpx;
							border-color: transparent transparent #F7F7F7;
							position: absolute;
							left: 50%;
							transform: translateX(-50%);
							bottom: -23rpx;
							z-index: 99;
							&::before{
								position: absolute;
								left: 50%;
								transform: translateX(-50%);
								bottom: -22rpx;
								content: '';
								border-style: solid;
								border-width: 0 20rpx 20rpx;
								border-color: transparent transparent #fff;
							}
						}
					}
				}
			}
			.useful-tips{
				border: 2rpx solid #F7F7F7;
				padding: 10rpx;
				border-radius: 8rpx;
				.useful-tips_item{
					display: flex;
					padding-bottom: 15rpx;
					white-space: normal;
					&.empty{
						color: #C0C4CC;
						font-size: 24rpx;
						text-align: center;
					}
					&:last-child{
						padding-bottom: 0;
					}
					.useful-tips_label{
						flex: 1;
						font-size: 24rpx;
						overflow: hidden;
					}
					.useful-tips_data{
						flex-shrink: 0;
						color: #FE6E32;
						font-size: 20rpx;
						padding-left: 20rpx;
					}
				}
			}
			.change-tips{
				width: 100%;
				margin-top: 10rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				span{
					color: #FE6E32;
					font-size: 20rpx;
					padding-right: 10rpx;
				}
				.fresh-img{
					width: 16rpx;
					height: 16rpx;
				}
			}
		}
		.cameras {
			margin: 0 0 30rpx;
		}

		.c-input {
			width: 690rpx;
			margin-bottom: 45rpx;
			background: #F7F7F7;
		}
		.content-type {
			border-bottom: 2rpx solid #F0F0F0;

			.content {
				margin: 15rpx 0;
				font-size: 28rpx;

				.c-center {
					.text {
						border-left: 1px solid #FE6E32;
						border-width: 6rpx;
						margin: 6rpx 0;
						padding: 0 8rpx;
						color: #FE6E32;
						font-size: 24rpx
					}
				}
			}

			.type-item {
				width: max-content;
				height: 52rpx;
				color: #000000;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				display: inline-block;
				text-align: center;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				background: rgba(247, 247, 247, 0);
				border: 2rpx solid #000000;
				border-radius: 26rpx;
				line-height: 52rpx;
				padding: 0 20rpx;

				&.active {
					background-color: #000;
					color: #FFFFFF;
				}
			}
		}
	}

	.borderRadius {
		border-radius: 15rpx;
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
	
	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
