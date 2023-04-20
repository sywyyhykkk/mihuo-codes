<template>
	<view >
		<view class="desc-contain">
			<view class="item-attachment">
				<view class="title-desc">上传图片</view>
				<view class="file-contain">
					<image-upload-new :uploadType="uploadType" :count="9" v-model="form.pic" />
				</view>
				<view class="voice-contain" @click="isShowButton = false">
					<sound-recording @chooseVoice="chooseVoice" @close="isShowButton = true"/>
				</view>
			</view>
			
			<view class="title-desc">备注内容</view>
			<view class="public-item-bottom">
				<u-input v-model="form.desc" class="describe-input" maxlength="200" height="140" type="textarea"
					placeholder="请输入备注" :border="true" />
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
				orderDetails: {},
				isShowButton: true,
				uploadType: ['图片'],
				form: {
					personId: '',
					address: '',
					orderId: '',
					audio: '',
					desc: '',
					pic: '',
					skillName: '',
					projectId: 0,
					status: 0
				}
			}
		},
		onLoad(option) {
			this.orderDetails = JSON.parse(option.orderDetails)
			// this.setUserData()
		},
		
		methods: {
			setUserData() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if(res){
						
						console.log('this.orderDetails.skillId',this.orderDetails.skillId);
						if(res.personageList.length > 0){
							let user = res.personageList.find(item => item.skillId == this.orderDetails.skillId)
							if(user){
								this.form.skillName = user.skillName;
								this.form.personId = user.personId
							}
						}
					}
				})
			},
			seeRecord(){
				this.toPage(`/pages/orderReceiving/constructionRecord?orderId=${this.orderDetails.id}&personId=${this.form.personId}`)
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
					this.form.audio = JSON.stringify(audioFile) 
				}
			},
			submit() {
				if (this.form.pic == '[]') {
					if(this.form.audio == ''){
						if (!this.form.desc) {
							this.$util.toast('请填写备注~')
							return
						}
					}
				}
				
				if (this.form.audio == '') {
					if(this.form.pic == '[]'){
						if (!this.form.desc) {
							this.$util.toast('请填写备注~')
							return
						}
					}
				}
				
				this.form.address = this.orderDetails.latAddress;
				this.form.orderCode = this.orderDetails.orderCode;
				this.form.orderId = this.orderDetails.id;
				this.form.skillName = this.orderDetails.skillName;
				this.form.personId =  this.orderDetails.personId
				this.form.status = this.orderDetails.workStatus==0?1:2;//status==1开工status==2完工 workStatus==0未开工 workStatus==1开工
				this.$httpApi.constructionSave(this.form).then(res => {
					if (res) {
						uni.hideLoading()
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

<style lang="scss" scoped>
	.nav-bar {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 36rpx;
		line-height: 50rpx;
		text-align: center;
		color: $darkTitle;
	}
	.right-record {
		font-size: $smallFontSize;
		color: $fontColor99;
		margin-right: 30rpx;
	}
	.desc-contain {
		padding: 20rpx 30rpx 30rpx;
		margin: 10rpx 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		.title-desc {
			font-size: $middleFontSize;
			color: $seconFontColor;
			margin-bottom: 24rpx;
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
			.voice-contain {
				margin: 24rpx 0;
			}
		}
	}
</style>
