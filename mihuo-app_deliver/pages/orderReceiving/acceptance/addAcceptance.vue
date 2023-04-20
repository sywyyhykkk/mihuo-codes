<template>
	<view class="processList-contain">
		<view class="acceptance-describe public-m">
			<view class="public-title title">
				<view class="item-left">
					验收描述
				</view>
				<view class="acceptance-criteria">
					<view class="item-criteria" @click="getView()">验收标准</view>
					<image class="public-block public-arrow" src="/static/images/bottom-icon.png"></image>
				</view>
			</view>
			<u-input v-model="form.applyDesc" class="describe-input" height="190" maxlength="200" type="textarea"
				placeholder="请输入验收描述" :border="true" />
		</view>
		<view class="acceptance-file public-m">
			<view class="public-title title">请上传附件</view>
			<view class="img-contain">
				<image-upload-new :uploadType="['图片','视频','文件','拍摄']" :count="9" v-model="form.picFiles" />
			</view>
			<view class="voice-contain">
				<sound-recording @chooseVoice="chooseVoice" />
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
		
		<bottom-button title="提交" @click="submit"></bottom-button>
	</view>
</template>

<script>
	/*********工人发起验收**********/
	import {
		mapState,
	} from 'vuex'
	import {
		debounce
	} from "@/plugins/utils.js"
	export default {
		data() {
			return {
				option: {},
				current: 1,
				shouqiShow: false,
				details: {},
				risksResult:[],
				riskList: [{
					attachments: "",
					name: "",
				}],
				form: {
					applyDesc: '', // 验收申请描述		false	
					orderId: '', // 订单编号		true	
					picFiles: '', // 图片文件		false	
					voiceFiles: '',
					applyPersonName: '',
					applySkillId: '',
					applySkillName: '',
					applyPersonId: '',
					productIds: '' //服务集合
				},
				file: '',
				detailsShow: false,
				projectId: '',
				isDisabled: true
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
		},
		onShow() {

		},
		computed: {},
		watch: {
			form: {
				handler() {
					if (!this.form.coment || !this.form.orderId || !this.form.imgFile) {
						this.isDisabled = true
					} else {
						this.isDisabled = false
					}
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			setParameter() {
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.on('addAcceptanceParameter', (data) => {
					this.form.orderId = data.id
					this.form.applySkillId = data.skillId
					this.form.applySkillName = data.skillName
					this.form.applyPersonName = data.userName
					this.form.applyPersonId = data.personId
					this.form.productIds = data.productIds
				});
			},
			preview(ul) {
				uni.previewImage({
					current: 1,
					urls: [ul],
				})
			},

			async chooseVoice(file) {
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.form.voiceFiles = JSON.stringify(temp)
				} else {
					this.form.voiceFiles = ''
				}
			},
			getView() {
				this.toPage(`/pages/orderReceiving/acceptance/viewAcceptanceCriteria?skillId=${this.form.applySkillId}`)
			},
			submit() {
				debounce(() => {
					if (!this.$checkUploadProcess(this.form.imgFile)) {
						return;
					}
					this.setRisksResult()
					this.$httpApi.getsaveAcceptance(this.form).then(res => {
						if (res) {
							if(this.risksResult.length > 0){
								this.addRisk()
							}else{
								this.$util.toast(`操作成功`);
								uni.navigateBack({
									delta: 1
								})
							}
						}
					})
				}, 200)
			},
			setRisksResult(){
				this.risksResult = []
				this.riskList.forEach(el =>{
					if(el.name || el.attachments !== '[]'){
						this.risksResult.push(el)
					}
				})
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
			addRisk(){
				this.$httpApi.addRisk({
					orderId: this.form.orderId,
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

<style lang="scss" scoped>
	.public-block {
		transition: all .2s;
		transform: rotate(0deg);
	}

	.public-arrow {
		margin-left: 10rpx;
		width: 16rpx;
		height: 16rpx;
		transform: rotate(0deg);
	}

	.processList-contain {
		padding-bottom: 20rpx;
		padding-top: 20rpx;

		.public-m {
			background-color: #FFFFFF;
			border-radius: 16rpx;
			margin-left: 20rpx;
			margin-right: 20rpx;
		}

		.public-title {
			font-weight: bold;
			font-size: 30rpx;
			color: $seconFontColor;
			display: flex;
			justify-content: space-between;
		}

		.acceptance-criteria {
			display: flex;
			align-items: center;

			.item-criteria {
				color: #002FA5;
				font-size: 24rpx;
			}


			.title {
				margin-bottom: 30rpx;
			}

			.criteria-contain {

				.item-contain {
					margin-bottom: 28rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}
				}

				.item-title {
					font-size: 28rpx;
					color: #606166;
					margin-bottom: 16rpx;
				}
			}
		}

		.acceptance-describe {
			margin-bottom: 2rpx;
			padding: 28rpx 32rpx 32rpx 38rpx;

			.title {
				margin-bottom: 20rpx;
			}

			.describe-input {
				background-color: #F7F7F7;
				margin-bottom: 20rpx;
				border: 0px;
			}
		}

		.acceptance-file {
			padding: 24rpx 32rpx 40rpx 32rpx;

			.title {
				margin-bottom: 20rpx;
			}

			.img-contain {
				margin-bottom: 20rpx;
			}
		}

		.submit-text {
			background: $themeColor;
			border-radius: 10rpx;
			margin: 80rpx 60rpx;
			padding: 24rpx 256rpx;
			text-align: center;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}
	
	.risk-statement {
		padding: 32rpx;
		background-color: #FFFFFF;
		margin: 2rpx 20rpx 0rpx 20rpx;
		border-radius: 16rpx;
	
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
