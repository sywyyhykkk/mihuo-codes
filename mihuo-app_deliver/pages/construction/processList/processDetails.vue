<template>
	<view class="contain-all">
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title"
				style="width:60%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">
				{{ pageTitle }}
			</view>
			<view slot="right" class="nav-bar-right" @click="cutView">
				施工记录
			</view>
		</z-nav-bar>
		<view class="details-contain">
			<view class="detail-title">
				<view class="process-item">
					<u-lazy-load height="132" imgMode="aspectFill" class="record-item-img" border-radius="10"
						:image="$util.thumbnailImage(details.coverImg,false)">
					</u-lazy-load>
					<view class="information">
						<view class="title">
							{{details.name}}
						</view>
						<view class="instructions">
							{{details.description}}
						</view>
					</view>
				</view>
			</view>
			<view class="details-information" v-if="detailsStatus">
				<!-- <view class="header-title">施工标准</view> -->
				<custom-title title="施工标准"></custom-title>
				<!-- 	<view class="item-information" v-for="(item,index) in details.productProcess.buildProcess" :key="index">
					<view class="title">{{index + 1}}.{{item.title}}</view>
					<view class="title">{{item.description}}</view>
					<view class="file-contain">
						<u-lazy-load height="132" imgMode="aspectFill" class="record-item-img" border-radius="10"
							:image="$util.thumbnailImage(item.processPic,false)">
						</u-lazy-load>
					</view>
				</view> -->
				<edit-view :value="details.productProcess.buildStandard"></edit-view>
			</view>
		</view>
		<!-- <view class="file-contain-all">
			<view class="text-contain">
				<view class="title-left">描述内容</view>
				<u-input v-model="form.desc" class="describe-input" height="176" type="textarea" placeholder="请输入描述"
					:border="true" />
			</view>
			<view class="img-contain">
				<image-upload-new :uploadType="uploadType" v-model="form.pic" />
			</view>
			<view class="voice-contain">
				<sound-recording @chooseVoice="chooseVoice" />
			</view>
		</view>
		<view class="details-status">
			<view class="title">完成状态</view>
			<u-radio-group v-model="form.status" @change="radioGroupChange">
				<u-radio v-for="(item, index) in list" :key="index" :name="item.name">
					{{item.status}}
				</u-radio>
			</u-radio-group>
		</view>
		<bottom-button title="确认并生成服务日志" @click="submit()" :disable="isDisabled"></bottom-button> -->
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				isDisabled: true,
				option: {},
				uploadType: ['图片', '视频'],
				call: require("@/static/images/call.png"),
				details: {},
				detailsStatus: false,
				fileList: {},
				fileListNew: {},
				pageTitle: '',
				form: {
					status: 0,
					audio: '',
					desc: '',
					orderId: '',
					personId: '',
					projectId: '', //项目编号
					jobName: '',
					productId: '',
					pic: '[]',
					productDesc: '',
					address:''
				},
				list: [{
						name: 2,
						status: '完成'
					},
					{
						name: 1,
						status: '未完成'
					},
				],

			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getDetails()
		},
		onReachBottom() {

		},
		watch: {
			form: {
				handler() {
					if (this.form.status === 'undefined' || !this.form.orderId || !this.form.pic) {
						this.isDisabled = true
					} else {
						this.isDisabled = false
					}
				},
				immediate: true,
				deep: true
			}
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'orderInfo', 'userPersonInfo', 'remainingDays'])
		},
		methods: {
			setParameter() {
				this.form.address = this.projectInfo.address
				this.form.orderId = this.orderInfo.orderId
				this.form.personId = this.userPersonInfo.personId
				this.form.projectId = this.projectInfo.projectId
				this.form.nodeId = this.nodeInfo.nodeId
			},
			cutView() {
				this.toPage(`/pages/construction/processList/operationRecords?productId=${this.details.id}`)
			},
			async chooseVoice(file) {
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.form.audio = JSON.stringify(temp)
				} else {
					this.form.audio = ''
				}
			},
			getDetails() {
				this.$httpApi.getCustomerDetail({
					id: this.option.id,
					clientType: 'APP'
				}).then(res => {
					if (res) {
						res.productProcess.buildProcess = JSON.parse(res.productProcess.buildProcess)
						this.details = res
						this.form.status = this.details.status + ''
						this.detailsStatus = true
						this.pageTitle = this.details.name + '-' + '工序清单'
					}
				})
			},
			change(index) {
				this.current = index
			},
			radioGroupChange(val) {},
			submit() {
				this.debounce(() => {
					if (this.isDisabled) {
						return
					}
					// 先判断上传是否完成，上传完成后的url才是网络路径
					if(!this.$checkUploadProcess(this.form.imgFile)){
						return
					}else{
						this.isDisabled = true
					}
					
					this.form.productId = this.details.id
					this.form.productDesc = this.details.name
					this.form.servicePackId = this.option.groupId
					this.$httpApi.getConstructionJournal(this.form).then(res => {
						if (res) {
							this.$util.toast("操作成功");
							uni.navigateBack()
						}
					})
				}, 200)
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	
	.add-text{
		background-color: '#f5f5f5';
	}
	
	
	.custom-title-contain {
		margin: 0rpx;
		padding: 0rpx;
		height: 80rpx;
	}

	.contain-all {
		padding-bottom: 100rpx;
	}

	.nav-bar-right {
		font-size: $middleFontSize;
		color: $viceFontColor;
		padding-right: 28rpx;
	}

	.details-contain {
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 6rpx 20rpx 12rpx 20rpx;
		padding: 36rpx 68rpx 42rpx 32rpx;

		.detail-title {
			border-bottom: 2rpx dashed #E2E2E2;
			margin-bottom: 30rpx;

			.process-item {
				background: #FFFFFF;
				border-radius: 16rpx;
				padding: 0rpx 32rpx 34rpx 0rpx;
				display: flex;


				.record-item-img {
					width: 132rpx;
					margin-right: 26rpx;
				}

				.information {
					padding-top: 8rpx;

					.title {
						font-weight: bold;
						font-size: 30rpx;
						color: $seconFontColor;
						margin-bottom: 8rpx;

					}

					.instructions {
						font-size: 26rpx;
						color: #909199;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 360rpx;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}

			}
		}

		.details-information {

			.header-title {
				font-weight: bold;
				font-size: 26rpx;
				margin-bottom: 12rpx;
				color: #283555;
			}

			.title {
				font-weight: normal;
				font-size: 28rpx;
				color: #909199;
				margin-bottom: 18rpx;
			}

			.file-contain {
				padding-left: 26rpx;

				.record-item-img {
					width: 132rpx;
				}
			}
		}

		.operation {
			.title {
				font-weight: bold;
				font-size: 26rpx;
				color: #283555;
				margin-bottom: 38rpx;
			}
		}
	}

	.details-status {
		background: #FFFFFF;
		margin: 0rpx 20rpx 76rpx 20rpx;
		padding: 20rpx 0rpx 20rpx 40rpx;
		border-radius: 10rpx;

		.title {
			font-weight: bold;
			font-size: 28rpx;
			color: #283555;
			margin-bottom: 14rpx;
		}

		.u-radio {
			margin-right: 182rpx;
		}
	}

	.file-contain-all {
		background: #FFFFFF;
		margin: 0rpx 20rpx 4rpx 20rpx;
		padding: 30rpx 40rpx 42rpx 40rpx;
		border-radius: 10rpx;

		.text-contain {
			.title-left {
				font-weight: bold;
				font-size: 30rpx;
				color: #46464E;
				margin-bottom: 22rpx;
			}

			.describe-input {
				background-color: #F7F7F7;
				margin-bottom: 20rpx;
				border: 0px;
			}
		}


		.img-contain {
			margin-bottom: 16rpx;
		}

		.file-title {
			font-size: 30rpx;
			color: $seconFontColor;
			font-weight: bold;
			margin-bottom: 22rpx;
		}
	}

	.submit-text {
		margin: 0 64rpx;
		padding: 24rpx 138rpx;
		background: $themeColor;
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
	}
</style>
