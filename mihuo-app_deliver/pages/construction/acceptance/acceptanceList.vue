<template>
	<view class="processList-contain">
		<!-- <view class="acceptance-criteria public-m">
			<view class="public-title title">验收标准</view>
			<view class="criteria-contain" v-if="detailsShow">
				<view class="item-contain" v-for="(item,index) in details.buildStandard" :key="index">
					<view class="item-title" v-if="item.title">
						0{{index+1}}.{{item.title}}
					</view>
					<view class="image-contain">
						<u-lazy-load v-if="item.processPic"
							@click="preview($util.thumbnailImage(item.processPic,false))" height="122"
							style="width: 226rpx;" imgMode="aspectFill" border-radius="10"
							:image="$util.thumbnailImage(item.processPic,true)">
						</u-lazy-load>
					</view>
				</view>
			</view>
		</view> -->
		<view class="acceptance-describe public-m">
			<view class="public-title title">验收描述</view>
			<u-input v-model="form.coment" class="describe-input" height="190" maxlength="200" type="textarea"
				placeholder="请输入验收描述" :border="true" />
		</view>
		<view class="acceptance-file public-m">
			<view class="public-title title">请上传附件</view>
			<view class="img-contain">
				<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo"  :uploadType="['图片','视频','文件','拍摄']" :count="9" v-model="form.imgFile" />
			</view>
			<view class="voice-contain">
				<sound-recording @chooseVoice="chooseVoice" />
			</view>
		</view>
		<view class="submit-text" @click="submit" :style="`opacity: ${isDisabled ? 0.5 : 1}`">
			提交
		</view>
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
				form: {
					type: '完工',
					coment: '',
					executeDateTime: "",
					imgFile: '[]',
					voiceFile: "",
					itemType: 3,
					orderId: '',
					nodeId: ''
				},
				file: '',
				waterAddress: '',
				waterUserInfo:'',
				detailsShow: false,
				projectId: '',
				isDisabled: true
			}
		},
		onLoad(option) {
			this.option = option
			this.getLocaltion()
		},
		onShow() {
			this.setParameter()
			this.getDetails()
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'nodeInfo','userPersonInfo'])
		},
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
			//得到当前位置
			getLocaltion() {
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
			preview(ul) {
				uni.previewImage({
					current: 1,
					urls: [ul],
				})
			},
			setParameter() {
				this.form.orderId = this.orderInfo.orderId
				this.form.nodeId = this.nodeInfo.nodeId
				this.projectId = this.projectInfo.projectId
				this.waterUserInfo = this.userPersonInfo.name + `（${this.userPersonInfo.skillName}）`;
			},
			getDetails() {
				if (!this.projectId) {
					return
				}
				return
				this.$httpApi.getPmsProductProcess({
					nodeId: this.nodeInfo.nodeId,
					skillId: this.orderInfo.skillId
				}).then(res => {
					if (res) {
						res.buildStandard = res.checkStandard !== '' && JSON.parse(res.checkStandard)
						console.log("res.buildStandard", res.buildStandard)
						this.details = res
						this.detailsShow = true
					}
				})
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
			submit() {
				debounce(() => {
					if (this.isDisabled) {
						return
					}
					if (!this.$checkUploadProcess(this.form.imgFile)) {
						return;
					}
					this.disabled = true;
					this.$httpApi.sopStartWork(this.form).then(res => {
						if (res) {
							this.$util.toast(`操作成功`);
							uni.navigateBack({
								delta: 1
							})
						}
					})
				}, 200)
			},
		}
	}
</script>

<style lang="scss" scoped>
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
		}

		.acceptance-criteria {
			margin-top: 6rpx;
			margin-bottom: 2rpx;
			padding: 38rpx 66rpx 48rpx 38rpx;

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
</style>
