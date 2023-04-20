<template>
	<view class="order">
		<u-form class="u-form" :model="formData" ref="uForm" labelPosition="top" :labelStyle="{
				fontSize: '28rpx',
				fontWeight: 'bold',
				color:'#141414',
				fontFamily:'PingFang-SC-Bold'
			}" :borderBottom="false">
			<u-form-item label="请选择呼叫类型" prop="type" required :borderBottom="false">
				<view v-model="formData.priceWay">
					<view class="button-group">
						<view v-for="(item,index) in buttonGroup" class="button" :class="{buttonClick:curClick===index}"
							@click="selectButton(item,index)" :key="index">
							{{ item.name }}
						</view>
					</view>
					<view class="button-tips">{{ buttonGroup[curClick].tips }}</view>
				</view>
			</u-form-item>
			<u-form-item v-if="curClick === 1" label="期望报价" prop="price" :borderBottom="false" required>
				<view class="select-input">
					<view class="input">
						<u-input type="digit" v-model="formData.price" placeholder="请填写" :custom-style="{
							padding:'6px 9px',
							color:'#141414',
						}"></u-input>
					</view>
					<text class="tips">元</text>
				</view>
			</u-form-item>
			<u-form-item label="一口价" prop="price" :borderBottom="false" required v-if="curClick === 2">
				<view class="select-input">
					<view class="input">
						<u-input type="digit" v-model="formData.price" placeholder="请填写" :custom-style="{
							padding:'6px 9px',
							color:'#141414',
						}"></u-input>
					</view>
					<text class="tips">元</text>
				</view>
			</u-form-item>
			<u-form-item label="需求工种" prop="skillName" required :borderBottom="false">
				<view class="select-input">
					<view class="input">
						<u-input @click="()=> showUse=true" v-model="formData.skillName" placeholder="请选择" disabled
							:custom-style="{
							padding:'6px 9px',
							color:'#141414',
							flex:1
						}"></u-input>
					</view>
					<u-icon class="icon" name="arrow-down" color="#808080" :size="22"></u-icon>
				</view>
			</u-form-item>
			<u-form-item label="需求描述" prop="requirementDesc" :borderBottom="false">
				<!-- <textarea
					style="padding:6px 9px;background: #F7F7F7;width: 100%;height:200rpx;font-size:28rpx;border-radius: 8rpx;display:block"
					class="textarea" v-model="formData.requirementDesc"
					placeholder-style="color:#C0C4CC;font-size: 14px;" placeholder="请填写您的家装需求" /> -->
					<uni-easyinput v-model="formData.requirementDesc" type="text" maxlength="120" style="background: #F7F7F7;"
								placeholder="请填写您的家装需求"  />
				<view slot="right" class="icon-right" @click="commonUsed">
					<findMaster-mh-mihuo-image class="image" :src="'https://www.51mihuo.com/static/icon/work_type/list.png'" />
					<text>常用语</text>
				</view>
			</u-form-item>
			<u-form-item :borderBottom="false">
				<image-upload-new :key="uplodIamge" v-model="formData.uplodIamge" count="9" />
			</u-form-item>
			<u-form-item :borderBottom="false">
				<sound-recording style="width:100%" v-model="audioObj" @chooseVoice="chooseVoice" />
			</u-form-item>
			<u-form-item label="房屋地址" prop="completeAddress" required :borderBottom="false">
				<view class="select-input" @click="selectCrea">
					<view class="input">
						<u-input @click="selectCrea" v-model="formData.completeAddress" placeholder="请选择" disabled
							:custom-style="{
							padding:'9px',
							color:'#141414',
						}"></u-input>
					</view>
					<u-icon class="icon" name="arrow-down" color="#808080" :size="22"></u-icon>
				</view>
			</u-form-item>
			<u-form-item label="期望上门时间" prop="expectDate" required :borderBottom="false">
				<view class="select-input" @click="()=> showCalendar = true">
					<view class="input">
						<u-input @click="()=> showCalendar = true" v-model="formData.expectDate" placeholder="请选择" disabled
							:custom-style="{
							padding:'6px 9px',
							color:'#141414',
						}"></u-input>
					</view>
					<u-icon class="icon" name="arrow-down" color="#808080" :size="22"></u-icon>
				</view>
			</u-form-item>
			<u-form-item label="联系人姓名" prop="contactName" required :borderBottom="false">
				<!-- <u-input class="input-border" placeholder="请填写" v-model="formData.contactName" :custom-style="{
					padding:'6px 9px',
					color:'#141414'
				}"></u-input> -->
				<uni-easyinput v-model="formData.contactName" type="text" maxlength="120" style="background: #F7F7F7;"
								placeholder="请填写"  />
			</u-form-item>
			<u-form-item label="联系电话" prop="contactPhone" required :borderBottom="false">
				<!-- <u-input class="input-border" type="number" placeholder="请填写" v-model="formData.contactPhone"
					:custom-style="{
					padding:'6px 9px',
					color:'#141414',
				}"></u-input> -->
				<uni-easyinput v-model="formData.contactPhone" type="text" maxlength="120" style="background: #F7F7F7;"
								placeholder="请填写"  />
			</u-form-item>
		</u-form>
		<bottom-button title="确认提交" isShow @click="reSave" bgColor="#FFFFFF"></bottom-button>
		<!-- 日历 -->
		<!-- <u-calendar v-model="showCalendar" mode="date" @change="change" max-date="9999-12-31"></u-calendar> -->
		<u-picker mode="time" v-model="showCalendar" :params="params" @confirm="change" :is-allow-passed-time="false"
			:start-year="(new Date().getFullYear())"></u-picker>
		<!-- 需求工种 -->
		<u-select v-model="showUse" :list="commonTypeList" @confirm="confirm" label-name="skillName"
			value-name="skillId"></u-select>
		<!-- 常用语 -->
		<u-select v-model="useLanguage" :list="commonUseList" @confirm="confirmUse" value-name="content"
			label-name="content"></u-select>
		<!-- 验证手机号的弹框 -->
		<view class="popup" v-show="verificationTelShow" @click="verificationTelShow=false">
			<view class="popup_with" @click.stop="verificationTelShow=true">
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
	import {
		debounce
	} from "@/plugins/utils.js"
	export default {
		data() {
			return {
				formData: {
					priceWay: 3,
					uplodIamge: '[]',
					address: '',
					latitude: null,
					longitude: null,
					contactGender: 1,
					expectDuration: 0,
					publishType: 1,
					referencePrice: 0,
					requirementType: 1,
					assignType: 2,
					requirementTypeName: '装修',
					source: 1
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				// 文字提示
				errorType: ['message'],
				// 校验
				rules: {
					type: [{
						required: true,
						message: '请选择呼叫类型',
						trigger: ['change', 'blur'],
					}],
					remark: [{
						required: true,
						message: '请填写需求描述',
						trigger: ['change', 'blur'],
					}, ],
					date: [{
						required: true,
						message: '请选择期望上门时间',
						trigger: ['change', 'blur'],
					}, ],
					telName: [{
						required: true,
						message: '请填写联系人姓名',
						trigger: ['change', 'blur'],
					}],
				},
				curClick: 0,
				buttonGroup: [{
						name: "上门报价",
						tips: '上门报价：直接呼叫师傅，师傅上门/聊天后根据需求给出报价',
						type: 3
					},
					{
						name: "竞价模式",
						tips: '竞价模式：用户填写期望价格，多位师傅报价后从中选择一个',
						type: 2
					},
					{
						name: "一口价",
						tips: '一口价模式：用户填写订单总价，师傅根据需求和价格自行接单',
						type: 1
					},
				],
				showCalendar: false,
				showUse: false,
				useLanguage: false,
				commonTypeList: [],
				audioList: [],
				audioObj: {},
				audioPath: '',
				commonUseList: [],
				cityInfo: uni.getStorageSync('oldLocation'),
				curType: "",
				mobile: '',
				code: '',
				times: 60,
				send: '获取验证码',
				sendType: false,
				accountState: '',
				verificationTelShow: false,
				uplodIamge: null, //判断是否刷新
				typeValue: '' ,//工种类型
				jobCode:'',
				completeAddress:{}
			}
		},
		onLoad(option) {
			/**
			 * @type
			 * add 新增
			 * edit 编辑
			 */
			this.curType = option.type;
			if (option.type == 'edit') {
				this.$http.get(`order/biz_order/self/publishDetail/${option.id}`).then(res => {
					if (res) {
						if (res.attachments) {
							this.uplodIamge = this.formData.uplodIamge
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
							this.uplodIamge = ''
						}
						this.formData = res;
						this.formData.completeAddress = (res.cityName == res
							.provinceName ? '' : res.cityName || '') + (res.districtName || '') + (res
							.latAddress || '') + (res.poiName || '') + (res.address || '')
						this.curClick = this.formData.priceWay == 1 ? 2 : this.formData.priceWay == 2 ? 1 : this
							.formData.priceWay == 3 ? 0 : 0;
						this.getCommonUse(res.skillName);
						this.getCurAddress(res.addressId)
					}
				})
			}
			if (option.type == 'add') {
				this.formData.skillName = option.skillName;
				this.formData.skillId = option.skillId;
				this.formData.jobCode = option.jobCode;
			}
		},
		onShow() {
			this.getTypeWork();
			uni.$once('roomAddress', (data) => {
				if (data) {
					this.completeAddress = data;
					this.formData.contactName = data.name;
					this.formData.contactPhone = data.phoneNumber;
					let address = (data.city == data.province ? '' : data.city || '') + (
							data.region || '') +
						(data.latAddress || '') + (data.poiName || '') + (data.detailAddress || '') + (data.address || '');
					this.$set(this.formData, 'completeAddress', address);
				}
			})
		},
		methods: {
			// 获取编辑对应得地址
			getCurAddress(id){
				this.$httpApi.getPostAddress().then(res => {
					if(res && res.length){
						res.some((item)=>{
							if(item.id == id){
								this.completeAddress = item;
								return true
							}
						})
					}
				})
			},
			getCode() {},
			// 保存
			async reSave() {
				const roomAddress = this.completeAddress;
				if (!this.formData.priceWay) {
					this.$util.toast("请选择呼叫类型")
					return false
				}
				if (this.curClick == 1 && !this.formData.price) {
					this.$util.toast("请填写期望报价")
					return false
				}
				if (this.curClick == 2 && !this.formData.price) {
					this.$util.toast("请填写一口价")
					return false
				}
				if (!this.formData.skillName) {
					this.$util.toast("请选择需求工种")
					return false
				}
				if (!this.formData.completeAddress) {
					this.$util.toast("请选择房屋地址")
					return false
				}
				if(!roomAddress.adcode){
					this.$util.toast("地址不合规，请选择合规地址")
					return false
				}
				if (!this.formData.expectDate) {
					this.$util.toast("请选择期望上门时间")
					return false
				}
				if (!this.formData.contactName) {
					this.$util.toast("请填写联系人姓名")
					return false
				}
				if (!this.formData.contactPhone) {
					this.$util.toast("请填写联系电话")
					return false
				}
				if (this.formData.uplodIamge) {
					this.formData.attachments = JSON.parse(this.formData.uplodIamge);
				}
				if (this.audioList && this.audioList.length) {
					this.formData.attachments = this.formData.attachments ? this.formData.attachments.concat(this
						.audioList) : this.audioList;
				}
				// 判断所选房屋地址是否与所选运营商在同一区域
				if (this.curType == 'add') {
					let curCity = await this.$http.post(
						`admin/cityoperator/getbyareacode/${roomAddress.adcode.substr(0, 4)}`)
					if (curCity && curCity.id) {
						this.formData.cityId = curCity.id;
						this.formData.companyId = curCity.defaultCompanyId;
						// this.formData.cityName = curCity.address;
					} else {
						this.$util.toast("您的房屋地址未匹配到运营商,请重新选择")
						return false
					}
					this.formData.homeId = roomAddress.id;
					this.formData.latitude = roomAddress.latitude;
					this.formData.longitude = roomAddress.longitude;
					this.formData.provinceName = roomAddress.province; //省
					this.formData.cityName = roomAddress.city; //省
					this.formData.districtName = roomAddress.region; //区
					this.formData.latAddress = roomAddress.latAddress; //街道地址
					this.formData.poiName = roomAddress.poiName; //POI名称
					this.formData.address = roomAddress.detailAddress;
					this.formData.requirementName = `${roomAddress.poiName || ''}需要${this.formData.requirementTypeName}类的${this.formData.skillName || ''}` 
					this.formData.addressId = roomAddress.id
				}
				uni.showLoading({
					title: '保存中',
					mask: true
				});
				if (this.curType == 'edit') { //编辑保存
					this.$http.put('order/biz_order', this.formData)
						.then(res => {
							if (res) {
								this.$util.toast("订单修改成功");
								this.toPage('/pages-order/callOrderDetails?id=' + this.formData.id)
							}
						}).finally(() => {
							uni.hideLoading();
						})
				} else { //新增保存
					this.$http.post('order/biz_order', this.formData)
						.then(res => {
							if (res) {
								this.$util.toast("订单发布成功");
								this.toPage('/pages-findMaster/callOrder')
							}
						}).catch(e => {
							let err = e.data
							if (err.code == 1 && err.data == 6) {
								this.getAccountStatus()
								this.verificationTelShow = true
							}
						}).finally(() => {
							uni.hideLoading();
						})
				}
			},
			//获取账户状态 如果账户没开通默认开通下账户
			getAccountStatus() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.mobile = res.phone
					}
				}).catch(err => console.log(err))
				this.$httpApi.getPaymentAccountStatus().then(res => {
					for (let key in res) {
						this.accountState = key
					}
				}).catch(err => console.log(err))
				if (this.accountState == 0) {
					this.$httpApi.registerPaymentAccount().catch(err => console.log(err))
				}
			},
			// 获取常用语
			async getCommonUse(skillId) {
				let res = await this.$http.get('basic/basiccommonstatement/page', {
					size: 20,
					current: 1,
					categoryFlag: `ORDER_${skillId}`
				})
				if (res) {
					this.commonUseList = res.records;
				}
			},
			commonUsed(){
				if(this.commonUseList && this.commonUseList.length){
					this.useLanguage = true;
					return
				}
				this.$util.toast("暂无常用语");
			},
			// 按钮切换选择
			selectButton(data, index) {
				this.formData.priceWay = data.type;
				this.curClick = index;
			},
			// 日历选择
			change(e) {
				if (e) {
					// this.formData.expectDate = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:00`
					this.formData.expectDate = `${e.year}-${e.month}-${e.day}`
				}
			},
			// 房屋地址
			selectCrea() {
				this.toPage(`/pages-common/addressList/addressList?isShow=${true}`)
			},
			confirm(e) {
				if (e) {
					this.formData.skillName = e[0].label;
					this.formData.skillId = e[0].value;
					this.getCommonUse(e[0].value)
					// this.commonTypeList.some(v => {
					// 	if (v.skillId == e[0].value) {
					// 		this.getCommonUse(v);
					// 		return true
					// 	}
					// })
				}
			},
			// 常用语
			confirmUse(e) {
				if (e && e.length) {
					this.formData.requirementDesc = this.formData.requirementDesc ? this.formData.requirementDesc + e[0]
						.value : e[0].value
				}
			},
			getTypeWork() {
				this.$http.get('admin/sysjobskill/getPlatformJobSkill', {
					type: '',
					clientType: "platform"
				}).then(res => {
					// this.commonTypeList = res;
					this.getServerWork(res)
				})
			},
			getServerWork(data) {
				let newArr = []
				this.$http.get('order/capp/biz_order/getOrderSkillIds')
					.then(res => {
						if (res && res.length) {
							res.map((item) => {
								data.forEach(ele => {
									if (item == ele.skillId) {
										// true:代表服务中
										ele.isServe = true
									}
								})
							})
						}
						this.commonTypeList = data.filter(function(ele) {
							return ele.isServe != true;
						})
					})

				if (this.formData.skillId) {
					this.confirm([{
						label: this.formData.skillName,
						value: this.formData.skillId,
					}])
				}
			},
			// 获取音频
			async chooseVoice(file, flag) {
				if (file.path != '{}') {
					let temp = [{
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}]
					this.audioList = temp;
				}
				if (flag) {
					this.audioList = [];
				}
			},
			// 验证手机号
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
				uni.showLoading()
				debounce(() => {
					this.$httpApi.bindPhone(httpData).then(res => {
							if (res) {
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
				}, 500)
			},
		}
	}
</script>

<style lang="scss">
	::v-deep .getsound {
		padding: 0;
	}
	::v-deep .u-input {
		background: #F7F7F7 !important;
	}
	.order {
		width: 100vw;
		// height: calc(100vh - var(--status-bar-height) - env(safe-area-inset-bottom));
		// overflow: scroll;
		padding: 0 40rpx;
		box-sizing: border-box;
		background: #FFFFFF !important;

		.u-form {
			.u-form-item {
				position: relative;
				.icon-right {
					display: flex;
					align-items: center;
					position: absolute;
					right: 0;
					top: 10rpx;

					.image {
						width: 20rpx;
						height: 20rpx;
						margin-right: 10rpx;
					}

					text {
						font-size: 24rpx;
					}
				}

				.button-group {
					display: flex;

					.button {
						width: 170rpx;
						height: 70rpx;
						line-height: 70rpx;
						font-weight: bold;
						text-align: center;
						font-size: $smallFontSize;
						margin-right: 20rpx;
						border-radius: 12rpx;
						border: 2rpx solid #141414;

						&:last-child {
							margin-right: 0;
						}
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

				.select-input{
					display: flex;
					width: 100%;
					min-height: 70rpx;
					background: #F7F7F7;
					border-radius: 8rpx;
					.input{
						flex: 1;
						.u-input{
							border-top-left-radius: 8rpx;
							border-bottom-left-radius: 8rpx;
							
						}
					}
					.icon{
						padding-right:20rpx;
					}
				}
				.tips {
					color: #141414;
					font-size: 26rpx;
					background: #F7F7F7;
					padding-right: 20rpx;
				}
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
				top: -10rpx;
				right: 10rpx;
				// float: right;
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
		line-height: 80rpx;
		height: 80rpx;
		border-radius: 10rpx;
		margin: 20rpx 20rpx 0;
		background: #424242;
		display: flex;
		justify-content: center;
		font-size: 28rpx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.input-border {
		border-radius: 8rpx;
	}
</style>
