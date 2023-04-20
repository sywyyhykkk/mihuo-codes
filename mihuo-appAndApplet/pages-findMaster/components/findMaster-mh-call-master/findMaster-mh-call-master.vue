<template>
	<view >
		<u-popup v-model="isCallMaster" height="90%" border-radius="20" mode="bottom" @close="closePopup">
			<!-- 内容 -->
			<view class="call">
				<view class="call-close">
					<u-icon @click="closePopup" name="close"></u-icon>
				</view>
				<view class="call-main">
					<image v-if="data.img" :src="data.img" mode="scaleToFill" />
					<image v-else src="@/pages-findMaster/static/icon/work_type/other.png" />
					<view class="call-main_content">
						<view class="call-main_content-title" @click="()=>isExhibition=!isExhibition">
							<text>{{ data.skillName}}</text>
							<u-icon size="18" class="arrow-down" color="#FFFFFF" :name="isExhibition?'arrow-up':'arrow-down'"></u-icon>
						</view>
						<view class="call-main_content-text">{{ data.label }}</view>
					</view>
				</view>
			</view>
			<scroll-view class="scroll" :scroll-y="true" :scroll-with-animation="true"
				:show-scrollbar="false" :style="'height:' + windowHeight">
                <view v-if="isExhibition" style="padding-bottom:20rpx">
                    <findMaster-mh-edit-view v-if="data.description &&  JSON.parse(data.description).length" class="edit_view"
					v-model="data.description" />
				    <findMaster-mh-empty v-else marginTop="0" size="120"  title="暂无师傅服务流程简介" />
                </view>
				<view class="form">
					<form>
						<view class="uni-form-item uni-column">
							<view class="title">请选择呼叫类型</view>
							<view>
								<view v-model="formData.priceWay">
									<view class="button-group">
										<view v-for="(item,index) in buttonGroup" class="button"
											:class="{buttonClick:curClick===index}"
											@click="selectButton(item,index)" :key="index">
											{{ item.name }}
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
										<input style="flex: 1;font-size:28rpx" disabled type="text"
											v-model="formData.completeAddress" placeholder="请选择"
											placeholder-style="font-size: 26rpx;">
										<u-icon class="arrow" name="arrow-down" size="22" color="#808080"></u-icon>
									</view>
								</view>
							</view>
						</view>
						<view class="uni-form-item uni-column" v-if="curClick === 1">
							<view class="title">期望报价</view>
							<view class="content-price">
								<input style="height: auto !important" placeholder-style="font-size: 26rpx;" 
									placeholder="请填写" class="input" type="digit" v-model="formData.price">
								<text>元</text>
							</view>
						</view>
						<view class="uni-form-item uni-column" v-if="curClick === 2">
							<view class="title">一口价</view>
							<view class="content-price">
								<input style="height: auto !important" placeholder-style="font-size: 26rpx;" 
									placeholder="请填写" class="input" type="digit" v-model="formData.price">
								<text>元</text>
							</view>
						</view>
						<view class="uni-form-item uni-column">
							<view class="column-item">
								<view class="title">需求描述</view>
								<view class="icon-right" @click="()=> showUse=true">
									<image :src="require('@/pages-findMaster/static/icon/work_type/list.png')" />
									<text>常用语</text>
								</view>
							</view>
							<view>
								<textarea
									style="padding:6px 9px;border-radius: 8rpx;background: #F7F7F7;width: 100%;height:200rpx;font-size:28rpx"
									class="textarea" v-model="formData.requirementDesc"
									placeholder-style="color:#909199;font-size: 13px" placeholder="请填写您的家装需求" />
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
								<sound-recording style="width:100%" @chooseVoice="chooseVoice"
									@close="isShowButton = true" />
							</view>
						</view>
					</form>
				</view>
				<view style="height:200rpx"></view>
			</scroll-view>
			<bottom-button v-if="isShowButton" isShow title="确认提交" @click="reSave"></bottom-button>
		</u-popup>
		<!-- 常用语列表 -->
		<view @click.stop>
			<u-select v-model="showUse" :list="commonUseList" @confirm="confirm" value-name="content"
				label-name="content"></u-select>
		</view>
		
		<!-- 验证手机号的弹框 -->
		<view class="popup" v-if="verificationTelShow" @click.stop>
			<view class="popup_with">
				<image src="@/pages-findMaster/static/images/mine/popup_cancel.png" class="popup_cancel" @click="verificationTelShow=false">
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
				},
				cityInfo: uni.getStorageSync('oldLocation'),
				curUser: uni.getStorageSync('userData').sysUser,
                isCallMaster:false,
                isExhibition:false
			}
		},
		props:{
            value:{
                type:Boolean,
                default:()=>false
            },
            data:{
                type:Object,
                default:()=>{}
            },
        },
        watch:{
            value(news){
                this.isCallMaster = news;
                if(news){
                    if (uni.getStorageSync('roomAddress')) {
                        let data = uni.getStorageSync('roomAddress');
                        let address = (data.province || '') + (data.city == data.province ? '' : data.city || '') + (
                                data.region || '') +
                            (data.latAddress || '') + (data.poiName || '') + (data.detailAddress || '') + (data.address || '');
                        this.$set(this.formData, 'completeAddress', address);
                    };
                    this.getAccountStatus()
                }
            }
        },
		methods: {
			// 获取工种类型数据字典
			getTypeDirs(){
				this.$httpApi.getDictByType({
					type:order_requirement_type,
					cityOperatorId: this.orderInfo.cityOperatorId || ''
				}).then(res=>{
					if(res){
						res.some(v=>{
							if(v.label.indexOf('装修') != -1){
								this.getUserInfo(v.value)
								return true
							}
						})
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
			async getUserInfo(type) {
				let res = await this.$http.get('basic/basiccommonstatement/page', {
					size: 20,
					current: 1,
					categoryFlag: `ORDER_${type}_${this.data.skillId}`
				})
				if (res) {
					this.commonUseList = res.records;
				}
			},
			closePopup() {
				this.isCallMaster = false;
				this.$emit('input', false)
			},
			// 按钮切换选择
			selectButton(data, index) {
				this.curClick = index;
				this.formData.priceWay = data.type;
			},
			// 获取音频
			async chooseVoice(file, flag) {
				if(file.buttonType !== 'clear'){
					this.isShowButton = true
				}
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
			// 选择收获地址
			selectAddress() {
				this.toPage('/pages-findMaster/selectAddress')
			},
			// 常用语
			confirm(e) {
				if (e && e.length) {
					this.formData.requirementDesc = this.formData.requirementDesc ? this.formData.requirementDesc + e[0]
						.value : e[0].value
				}
			},
			async reSave() {
				let date = new Date();
				const roomAddress = JSON.parse(uni.getStorageSync('roomAddress'))
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
				if(!roomAddress.adcode){
					this.$util.toast("地址不合规，请选择合规地址")
					return false
				}
				// 判断所选房屋地址是否与所选运营商在同一区域
				let curCity = await this.$http.post(
					`admin/cityoperator/getbyareacode/${roomAddress.adcode}`)
				if (curCity && curCity.id) {
					this.formData.cityId = curCity.id;
					this.formData.companyId = curCity.defaultCompanyId;
				} else {
					this.$util.toast("您的房屋地址未匹配到运营商,请重新选择")
					return false
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
					this.formData.attachments = JSON.parse(this.formData.uplodIamge)
				}
				if (this.audioList && this.audioList.length) {
					this.formData.attachments = this.formData.attachments ? this.formData.attachments.concat(this
						.audioList) : this.audioList
				}
				if (!this.$checkUploadProcess(this.formData.uplodIamge)) {
					this.$util.toast("图片正在上传中,请稍作等待")
					return
				}
				this.formData.requirementName = `${roomAddress.poiName || ''}需要${this.formData.requirementTypeName}类的${this.data.skillName || ''}` 
				this.formData.expectDate = date.getFullYear() + '-' + (date.getMonth() + 1 >= 10 ? (date.getMonth() +
					1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date
					.getDate());
				//如果首次发单没有验证手机号就关闭后台返回的‘先验证手机号；’提示，只关闭此提示
				let isShowMessage = true
				if (this.accountState == 1) {
					isShowMessage = false
				}
				// 保存
				uni.showLoading({
					title: '保存中',
					mask: true
				});
				this.$http.post('order/biz_order', this.formData, {
						header: {
							isShowMessage: isShowMessage
						}
					})
					.then(res => {
						if (res) {
							this.$util.toast("订单发布成功")
							this.$emit('getTypeWork')
							this.toPage('/pages-findMaster/callOrder');
							this.callShow = false;
							this.verificationTelShow = false
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
			// handleTop(){
			// 	 uni.pageScrollTo({
			// 		scrollTop: 400,
			// 		duration: 0
			// 	})
			// },
		}
	}
</script>

<style lang="scss">
	.call-master {
		overflow: hidden;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #FFFFFF;
	}
    .call {
        padding: 20rpx 30rpx 0;
        box-sizing: border-box;
        border-radius: 20rpx 20rpx 0 0;
        background: #FFFFFF;
        overflow: hidden;
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
                        background: #000000;
                        border-radius: 50%;
                        height: 26rpx;
                        width: 26rpx;
                        padding: 5rpx;
                        flex-shrink: 0;
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
	.scroll {
		height: 100%;
		padding-bottom: 100rpx;
		.edit_view{
            padding: 0 30rpx 20rpx;
        }
		.form {
			padding: 0 30rpx;
			.uni-form-item {
				margin-bottom: 40rpx;
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

			.arrow{
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
</style>
