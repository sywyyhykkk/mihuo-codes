<template>
	<view class="custom-nodes-add">
		<view class="custom-nodes-add-form">
			<view class="top-contain">
				<view class="item-title">
					<view class="item-describe">备注</view>
					<view class="item-right">
						<u-icon name="list-dot" :color="$styleColor.themeColor" size="32"></u-icon><text
							class="item-phrase-text" @click="getRequirementListShow('sendOrderPopupPhrase')">常用语</text>
					</view>
				</view>
				<view class="public-item-bottom ">
					<u-input v-model="form.startRemark" class="describe-input" maxlength="200" height="200"
						type="textarea" placeholder="请输入备注" :border="true" />
				</view>
				<view class="item-attachment">
					<view class="file-contain">
						<image-upload-new :address="waterAddress" :userInfo="waterUserInfo" :uploadType="uploadType" :count="9" v-model="images" />
					</view>
					<view class="voice-contain">
						<sound-recording @chooseVoice="chooseVoice" />
					</view>
				</view>
			</view>
			<view class="bottom-contian" v-if="sendList.length > 0">
				<view class="send-user">
					<text class="item-label">发送至</text>
					<text class="item-value" v-for="(item,index) in sendList" :key="index">
						{{item.skillName}}({{item.personName}})
					</text>
				</view>
			</view>
		</view>
		<view class="custom-nodes-page-button">
			<view class="item-button-list">
				<view class="item-button-default" :class="[ item.active?'item-button-active':'item-button']"
					v-for="(item,index) in buttonList" :key="index" @click="getButton(item)">
					{{item.lable}}
				</view>
			</view>
		</view>



		<send-order-popup ref="sendOrderPopupPhrase" titleName="请选择常用语" :commitStatus="false">
			<view class="workers-type-item-value phrase-list">
				<scroll-view class="left-nav-bar" :scroll-y="true">
					<view @click="getPhraseListType(item)" v-for="(item,index) in phraseList" :key="index"
						class="item-phrase2">{{ item.content }}</view>
				</scroll-view>
			</view>
		</send-order-popup>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				uploadType: ['图片'],
				images: '[]',
				attachment: [],
				waterAddress: '',
				waterUserInfo:'',
				buttonList: [{
					value: 1,
					lable: '取消',
					active: false
				}, {
					value: 2,
					lable: '确认',
					active: true
				}],
				form: {
					nodeId: 0,
					projectId: 0,
					startAttachments: [],
					startPersonId: 0,
					startRemark: ""
				},
				endForm: {
					nodeId: 0,
					projectId: 0,
					finishRemark: '',
					finishAttachments: [],
					executePersonId: ''
				},
				sendList: [],
				sendStatus: false,
				phraseList: []
			}
		},
		computed: {

		},
		mounted() {

		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'userPersonId'])
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getReviewerList()
			this.selectPhrase()
		},
		methods: {
			setParameter() {
				uni.setNavigationBarTitle({
					title: this.nodeInfo.nodeName
				});
				if (this.option.type == '开始') {
					this.form.nodeId = this.nodeInfo.nodeId
					this.form.projectId = this.projectInfo.projectId
					this.form.startPersonId = this.userPersonId
				} else {
					this.endForm.nodeId = this.nodeInfo.nodeId
					this.endForm.projectId = this.projectInfo.projectId
					this.endForm.executePersonId = this.userPersonId
				}
				this.waterUserInfo = this.userPersonInfo.name + `（${this.userPersonInfo.skillName}）`;
			},
			selectPhrase() {
				let tempStatus = this.option.type == '开始' ? 'NODESTART_' : 'NODEFINISH_'
				this.$httpApi.selectPhrase({
					categoryFlag: tempStatus + this.nodeInfo.templateNodeId,
				}).then(res => {
					if (res) {
						this.phraseList = res.records
					}
				})
			},
			getRequirementListShow(str) {
				this.$refs[str].requirementListShow = true
			},
			getPhraseListType(item){
				this.form.startRemark = item.content
			},
			getButton(item) {
				if (item.lable == '取消') {
					this.goBack()
				} else {
					if (!this.form.startRemark) {
						this.$util.toast("请填写备注");
						return
					}
					let tempImages = JSON.parse(this.images)
					if (tempImages.length > 0) {
						tempImages.forEach(el => {
							this.attachment.push({
								type: this.setFileType(el.url),
								url: el.url
							})
						})
					}
					if (this.option.type == '开始') {
						this.form.startAttachments = this.attachment
						this.$httpApi.setProjectNodeStart(this.form).then(res => {
							if (res) {
								this.$util.toast("操作成功,将返回上一页");
								setTimeout(() => {
									this.goBack()
								}, 2000)
							}
						})
					} else {
						this.endForm.finishRemark = this.form.startRemark
						this.endForm.finishAttachments = this.attachment
						this.$httpApi.setProjectNodeComplete(this.endForm).then(res => {
							this.$util.toast("操作成功,将返回上一页");
							setTimeout(() => {
								this.goBack()
							}, 2000)
						})
					}
				}
			},
			async chooseVoice(file) {
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.attachment.push(temp)
				} else {
					this.attachment = this.attachment.filter(item => item.type !== 'audio')
				}
			},
			getReviewerList() {
				// reviewFlag 0不需要审核 1审核
				if (this.nodeInfo.reviewFlag) {
					this.$httpApi.getReviewerList({
						nodeId: this.nodeInfo.nodeId
					}).then(res => {
						if (res) {
							this.sendList = res
							if (this.sendList.length > 0) {
								this.sendStatus = true
							}
						}
					})
				}
			},
			setFileType(item) {
				let suffix = item.substring(item.lastIndexOf("."));
				if (['.mp3', '.mp4', '.3gp'].includes(suffix)) {
					return 'video'
				} else {
					return 'img'
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.public-item-bottom {
		background: #F6F7F9;
		border-radius: 5px;

		.u-input {
			border: 0rpx;
		}
	}

	.workers-type-item-value {
		padding: 40rpx;
		display: flex;
		flex-direction: column;
	}

	.phrase-list {
		// overflow-y: scroll;
		height: 400rpx;
		padding-top: 16rpx;

		.left-nav-bar {
			height: 100%;
		}
	}
	
	
	.item-phrase2 {
		width: 100%;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 2rpx dashed #E4E4E4;
	
		&:hover {
			color: #7b7878;
		}
	}

	.custom-nodes-add {
		margin-top: 8rpx;

		.custom-nodes-add-form {
			.top-contain {
				background-color: #fff;
				padding: 26rpx;

				.item-title {
					margin-bottom: 32rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.item-describe {
						font-weight: normal;
						font-size: 28rpx;
						color: #606166;
					}

					.item-phrase-text {
						margin-left: 6rpx;
						font-size: 28rpx;
						color: #606166;
					}
				}

				.item-attachment {
					margin-top: 26rpx;

					.voice-contain {
						margin-top: 28rpx;
					}
				}
			}

			.bottom-contian {
				background-color: #fff;
				margin-top: 2rpx;

				.send-user {
					margin-top: 2rpx;
					padding: 36rpx 42rpx;
					border-top: 2rpx solid #f5f5f5;

					.item-label {
						color: #303133;
						font-size: 28rpx;
						margin-right: 74rpx;
					}

					.item-value {
						color: #999999;
						font-size: 26rpx;
					}
				}
			}
		}

		.custom-nodes-page-button {
			position: fixed;
			bottom: 0rpx;
			width: 100%;

			.item-button-list {
				background-color: #fff;
				padding: 14px 10px;
				display: flex;
				align-items: center;
				justify-content: center;

				.item-button-default {
					width: 268rpx;
					height: 88rpx;
					text-align: center;
					line-height: 88rpx;
					color: #909299;
					border: 2rpx solid #fff;
					border-radius: 10rpx;
					font-size: $middleFontSize;
				}

				.item-button {
					border: 2rpx solid #E0E0E0;
					margin-right: 24rpx;
				}

				.item-button-active {
					border: 2rpx solid $themeColor;
					color: #fff;
					background-color: $themeColor;
				}
			}
		}
	}
</style>
