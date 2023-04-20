<template>
	<view class="add-disclosure-contain">
	<!-- 	<view class="form-contain public-mg">
			<view class="form-item">
				<view class="form-lable">选择类型</view>
				<u-input placeholder v-model="form.type" disabled type="text" :border="false" input-align="right"
					placeholder="请选择" />
				<image :src="'../../static/demo/icon_right.png'" class="right-image"></image>
				<u-picker v-model="typeShow" :range="typeColumns" mode="selector" @confirm="typeConfirm"></u-picker>
			</view>
		</view> -->
		<view class="questionnaire public-mg">
			<view class="describe-contain">
				<view class="describe-label">{{form.type.replace('去','')}}描述</view>
				<u-input v-model="form.coment" class="describe-input" height="190" maxlength="200" type="textarea"
					:placeholder="'请输入'+form.type+'描述'" :border="true" count />

			</view>
			<view class="file-contain">
				<view class="title">上传图片</view>
				<view class="img-contain">
					<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo" :uploadType="['图片','视频']" v-model="form.imgFile" />
				</view>
				<view class="voice-contain" style="margin-top: 20rpx;">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
			<view class="form-contain">
				<view class="form-item">
					<view class="form-lable">{{form.type.replace('去','')}}时间</view>
					<u-input placeholder class="form-input" v-model="executeDateTime" @click="timeShow = true"
						disabled input-align="right" placeholder="请选择" />
					<u-picker v-model="timeShow" mode="time" @confirm="confirmTime" :params="params"></u-picker>
					<image :src="'../../static/demo/icon_right.png'" class="right-image"></image>
				</view>
			</view>
		</view>

		<!-- <view class="submit-text" @click="submit">确认提交</view> -->
		<view class="submit-button">
			<view class="button-cancel">取消</view>
			<view class="button-confirm" @click="saveData">确定</view>
		</view>
	</view>
</template>

<script>
	// 开工交底
	// answerType   1 单选  2多选  3文字输入  4上传
	import {
	  mapState,
	 } from 'vuex'
	 import moment from "@/static/js/moment.js"
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	export default {
		data() {
			return {
				key: '',
				timeShow: false,
				typeShow: false,
				typeColumns: ['开工', '完工'],
				resultIndex: 0,
				chooseVoiceObject: {},
				fileObject: {},
				executeDateTime:'',
				waterAddress: '',
				waterUserInfo:'',
				form: {
					type: '开工',
					coment: '',
					executeDateTime: "",
					imgFile: "",
					voiceFile: "",
					itemType: 2,
					orderId: '',
					nodeId: '',
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					// second: true
				},
			}
		},
		onLoad(postion) {
			this.setParameter()
			this.form.type = postion.type
			if (postion.type == '完工') {
				this.form.itemType = 3
			}
			this.getLocaltion();
			this.executeDateTime = moment().format("YYYY-MM-DD HH:mm")
		},
		computed: {
		   ...mapState(['projectInfo', 'nodeInfo', 'orderInfo', 'userPersonInfo', 'userRole']),
		  },
		methods: {
			//得到当前位置
			getLocaltion() {
				this.waterUserInfo = this.userPersonInfo.name + `（${this.userPersonInfo.skillName}）`;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success:(data)=>{
						console.log(data);
						this.waterAddress = data.address?data.address.city+data.address.district+data.address.street+data.address.streetNum + data.address.poiName:''
					    console.log(this.waterAddress)
					}
				})
			},
			setParameter(){
				this.form.orderId = this.orderInfo.orderId
				this.form.nodeId = this.nodeInfo.nodeId
			},
			saveData() {
				this.debounce(()=>{
					if (!this.form.orderId) {
						return
					}
					
					if (!this.form.coment) {
						this.$util.toast(`请填写描述`);
						return
					}
					if (!this.executeDateTime) {
						this.$util.toast(`请选择时间`);
						return
					}
					
					if(!this.$checkUploadProcess(this.form.imgFile)){
						return;
					}
					
					this.form.executeDateTime = this.executeDateTime + ':00'
					this.$httpApi.sopStartWork(this.form).then(res => {
						if (res) {
							this.$util.toast(`操作成功`);
							uni.navigateBack({
								delta: 1
							})
						}
					})
				},200)
			},
			typeConfirm(e) {
				this.form.itemType = parseInt(e.toString()) + 1
				this.form.type = this.typeColumns[parseInt(e.toString())]
			},
			confirmTime(even) {
				console.log("even",even);
				// this.form.executeDateTime = even.year + '-' + even.month + '-' + even.day
				this.executeDateTime = even.year + '-' + even.month + '-' + even.day + ' ' +  even.hour + ':' + even.minute
			},
			getActive(index, num, nums, el) {
				if (el.answerType === 2) { // 多选
					this.details[index]['questionsList'][num]['groupingIndex'].push(nums)
				} else if (el.answerType == 1) { // 单选
					this.details[index]['questionsList'][num]['groupingIndex'][0] = nums
					this.$forceUpdate()
				}
			},
			getMultiSelect() {

			},
			async chooseVoice(file) {
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.form.voiceFile = JSON.stringify(temp)
				} else {
					this.form.voiceFile = ''
				}
			},
			getConstructionSite() {
				uni.navigateTo({
					url: '/pages/mapChoose/mapChoose',
					animationType: 'slide-in-bottom',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.submit-button {
		display: flex;
		justify-content: center;
		// grid-template-columns: auto auto;
		margin-top: 100rpx;

		.button-cancel {
			background: #FFFFFF;
			border: 2rpx solid #E0E0E0;
			border-radius: 10rpx;
			line-height: 90rpx;
			width: 268rpx;
			text-align: center;
			font-size: 28rpx;
			color: #909299;
			margin-right: 12rpx;

		}

		.button-confirm {
			background: $themeColor;
			border-radius: 10rpx;
			line-height: 90rpx;
			width: 268rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 28rpx;
			margin-left: 12rpx;

		}
	}

	.public-mg {
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.add-disclosure-contain {
		padding-top: 12rpx;
		padding-bottom: 20rpx;

		.form-contain {
			margin-bottom: 2rpx;
		}

		.send-user {
			margin-bottom: 98rpx;
		}

		.form-contain,
		.send-user {

			.form-item {
				display: flex;
				border-radius: 10rpx;
				justify-content: space-between;
				align-items: center;
				height: 120rpx;
				padding: 0rpx 48rpx 0rpx 48rpx;
				margin-bottom: 2rpx;
				background-color: #FFFFFF;

				&:last-child {
					margin-bottom: 0;
				}

				.form-lable {
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
				}

				.form-input {
					font-size: 28rpx;
					text-align: right;
					color: #999999;

				}

				.right-image {
					height: 32rpx;
					width: 32rpx;
					margin-left: 20rpx;
				}
			}
		}

		.questionnaire {
			margin-bottom: 2rpx;

			.item-title {
				font-weight: bold;
				font-size: 30rpx;
				color: $seconFontColor;
				line-height: 42rpx;
				padding-left: 34rpx;
			}

			.item-describe {
				padding-left: 34rpx;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #909199;
				margin-bottom: 24rpx;
			}

			.questions-item {
				background-color: #FFFFFF;
				padding: 48rpx 0 52rpx 38rpx;
				margin-bottom: 2rpx;

				.questions-item-title {
					margin-bottom: 36rpx;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333333;

				}

				.questions-item-optionList {
					display: flex;
					flex-direction: row;

					.optionName {
						display: flex;
						width: 152rpx;
						justify-content: center;
						padding: 16rpx 0 20rpx 0;
						border: 2rpx solid #D9D9D9;
						font-size: 26rpx;
						color: #666666;
						text-align: center;
						border-radius: 10rpx;
						margin-right: 38rpx;

						&:last-child {
							margin-right: 0rpx;
						}
					}

					.results-status-active {
						border: 2rpx solid $themeColor !important;
						color: $themeColor !important;
						position: relative;

						.selected {
							width: 0;
							height: 0;
							border-bottom: 44rpx solid $themeColor;
							border-left: 44rpx solid transparent;
							position: absolute;
							right: 0rpx;
							bottom: 0rpx;
						}

						.checkmark-icon {
							position: relative;
							top: 12rpx;
							left: -24rpx;
							transform: scale(0.8);
						}
					}

				}
			}

			.describe-contain {
				padding: 48rpx 32rpx 52rpx 32rpx;
				background-color: #FFFFFF;
				margin-bottom: 2rpx;

				.describe-label {
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
					margin-bottom: 20rpx;
					padding-left: 20rpx;
				}

				.describe-input {
					background-color: #F7F7F7;
					margin-bottom: 20rpx;
					border: 0px;
				}
			}

			.file-contain {
				.title {
					font-size: 28rpx;
					color: #46464E;
					margin-bottom: 24rpx;
				}

				padding: 24rpx 50rpx 32rpx 50rpx;
				background-color: #FFFFFF;
			}

		}

		.submit-text {
			background: $themeColor;
			border-radius: 10rpx;
			padding: 24rpx 156rpx;
			text-align: center;
			color: #FFFFFF;
			margin: 68rpx 60rpx 114rpx 60rpx;
		}
	}
</style>
