<template>
	<view class="add-acceptance">
		<view class="desc-contain">
			<view class="title-desc">验收描述</view>
			<view class="public-item-bottom">
				<u-input v-model="form.applyDesc" class="describe-input" maxlength="200" height="140" type="textarea"
					placeholder="请输入验收描述" :border="true" />
			</view>
			<view class="item-attachment">
				<view class="file-contain">
					<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo" :uploadType="uploadType" :count="9" v-model="form.picFiles" />
				</view>
				<view class="voice-contain" @click="isShowButton = false">
					<sound-recording @chooseVoice="chooseVoice" @close="isShowButton = true"/>
				</view>
			</view>
		</view>
		<view class="risk-statement">
			<view class="risk_title">风险提示</view>
			<view class="risk-statement-list" v-for="(item,index) in riskList" :key="index">
				<view class="risk-contian">
					<view class="item-desc">
						<u-input v-model="item.name" placeholder-style="color: #999999;fontSize: 26rpx;"
							class="describe-input" maxlength="200" height="100" type="textarea"
							placeholder="请输入一条说明内容" :border="true" />
					</view>
					<view class="img-contain">
						<image-upload-new :uploadType="['图片','拍摄']" :count="9" v-model="item.attachments" />
					</view>
				</view>
				<view class="risk_add" v-if=" riskList.length > 1" @click="addRiskOperation('delete',index)">
					<u-icon name="minus" size="24" color="#002FA5"></u-icon>
					<text>删除</text>
				</view>
				<view class="risk_add" v-if="index + 1 == riskList.length" @click="addRiskOperation('add')">
					<u-icon name="plus" size="24" color="#002FA5"></u-icon>
					<text>新增</text>
				</view>
			</view>
		</view>
		<bottom-button v-if="isShowButton" title="确认提交" @click="submit()"></bottom-button>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				isShowButton: true,
				uploadType: ['图片'],
				waterAddress: '',
				waterUserInfo:'',
				form: {
					applyPersonName: '',
					applySkillName:'',
					applySkillId: '',
					picFiles: '',
					voiceFiles: '',
					orderCode: '',
					applyDesc: '',
					orderId:'',
					applyPersonId: '',
				},
				risksResult:[],
				riskList: [{
					attachments: "",
					name: "",
				}],
				option: {}
			}
		},
		async onLoad(option) {
			this.option = option
			this.getLocaltion()
			this.setUserData()
		},
		computed: {
			...mapState(['skillId', 'userPersonInfo']),
		},
		methods: {
			getLocaltion() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success:(data)=>{
						this.waterAddress = data.address?data.address.city+data.address.district+data.address.street+data.address.streetNum + data.address.poiName:''
					}
				})
			},
			setUserData() {
				// this.form.applyPersonId = this.option.applyPersonId
				// this.form.applyPersonName = this.option.applyPersonName
				// this.form.applySkillId = this.option.skillId
				// this.form.applySkillName = this.option.applySkillName
				// return
				this.$httpApi.getPersonSettingInfo().then(res => {
					if(res){
						if(res.personageList.length > 0){
							let user = res.personageList.find(item => item.skillId == this.option.skillId)
							if(user){
								this.form.applyPersonId = user.personId
								this.form.applyPersonName = res.realName
								this.form.applySkillId = user.skillId
								this.form.applySkillName = user.skillName
								this.waterUserInfo = res.realName+"（"+user.skillName+"）"
							}
						}
					}
				})
			},
			async chooseVoice(file) {
				this.isShowButton = true
				let audioFile = {
					type:'audio',
					url:'',
					timeLength:''
				}
				if (file.duration > 0 && file.path) {
					audioFile.url = await CommonUpload(file.path)
					audioFile.timeLength = file.duration
					this.form.voiceFiles = JSON.stringify(audioFile) 
				}
			},
			addRiskOperation(type, index) {
				if (type == 'add') {
					this.riskList.push({
						attachments: "",
						name: "",
					})
				} else {
					this.riskList.splice(index, 1)
				}
			},
			setRisksResult(){
				this.risksResult = []
				this.riskList.forEach(el =>{
					if(el.name || el.attachments  !== '[]'){
						this.risksResult.push(el)
					}
				})
			},
			submit() {
				if(!this.form.applyDesc){
					this.$util.toast('请填写验收描述~')
					return
				}
				this.setRisksResult()
				this.form.orderCode = this.option.orderCode;
				this.form.orderId = this.option.id;
				this.$httpApi.orderAcceptanceSave(this.form).then(res => {
					if (res) {
						uni.hideLoading()
						if(this.risksResult.length > 0){
							this.addRisk()
						}else{
							uni.showToast({
								title: '操作成功~',
								icon: 'none'
							});
							setTimeout(() => {
								this.goBack()
							}, 1500)
						}
						
					}

				})
			},
			addRisk(){
				this.$httpApi.addRisk({
					orderId: this.option.id,
					risks: this.risksResult,
				}).then(res => {
					if (res) {
						uni.showToast({
							title: '操作成功~',
							icon: 'none'
						});
						setTimeout(() => {
							this.goBack()
						}, 1000)
					}
				})
			}
		}
	}
</script>

<style>
	/* page {
		height: 100%;
		background-color: #FFFFFF;
	} */
</style>

<style lang="scss" scoped>
	.add-acceptance {
		border-top: 12rpx solid #f5f5f5;
		// padding: 48rpx 52rpx;

		.desc-contain {
			padding: 32rpx;
			background-color: #FFFFFF;
			.title-desc {
				font-size: $middleFontSize;
				color: $seconFontColor;
			}

			.describe-input {
				border: 0rpx;
			}

			.public-item-bottom {
				background: #F6F7F9;
				border-radius: 5px;
				margin-top: 16rpx;
			}

			.item-attachment {
				margin-top: 28rpx;

				.voice-contain {
					margin-top: 28rpx;
				}
			}
		}


	}
	
	.risk-statement {
		padding: 32rpx;
		background-color: #FFFFFF;
		margin-top: 2rpx;
	
		.risk_title {
			font-size: 30rpx;
			margin-bottom: 18rpx;
			color: #333333;
		}
	
		.risk-contian {
			width: 80%;
		}
	
		.risk-statement-list {
			display: flex;
			margin-bottom: 20rpx;
		}
	
		.risk_add {
			border: 2rpx solid #002FA5;
			border-radius: 10rpx;
			width: 112rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 72rpx;
			margin-left: 20rpx;
	
			text {
				font-size: 24rpx;
				color: #002FA5;
				margin-left: 4rpx;
			}
		}
	
		.item-desc {
			background: #F6F7F9;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
	
			.describe-input {
				border: 0px;
			}
		}
	}
</style>
