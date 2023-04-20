<template>
	<view class="custom-nodes-add">
		<view class="view-content">
			<view class="view-content-contain" v-if="JSON.stringify(details) !== '{}'">
				<view class="initiate-contain">
					<view class="public-item-top">
						<view class="item-left">
							<u-avatar class="icon-image" :src="$util.thumbnailImage(setPortrait(details.userId),true)"
								size="36">
							</u-avatar>
							<text class="item-name">{{details.userName}}</text>
						</view>
						<text class="item-right">{{details.created && details.created.substring(0,16)}}</text>
					</view>
					<view class="item-other">
						<view class="item-comment" v-if="details.comment">
							{{details.comment}}
						</view>
						<view class="attachments" v-if="imagesList">
							<image-show :enable="true" width="200" :key="imagesList" height="200" quantityPerLine="3"
								:imgSrc="imagesList"></image-show>
						</view>
						<view class="item-audio" v-if="audioObject">
							<mihuo-audio :formData="audioObject" class="voice" />
						</view>
					</view>
				</view>
				<view class="result-contian" v-if="details.bizPendingDetailList && details.status">
					<view class="item-title">
						处理结果
					</view>
					<view class="item-contain" v-for="(item,index) in details.bizPendingDetailList" :key="index">
						<view class="public-item-top">
							<view class="item-left">
								<u-avatar class="icon-image"
									:src="$util.thumbnailImage(setPortrait(item.handleUserId),true)" size="36">
								</u-avatar>
								<text class="item-name">{{item.handlePersonName}}</text>
							</view>
						</view>
						<view class="item-other">
							<view class="item-comment" v-if="details.comment">
								{{item.comment}}
							</view>
							<view class="attachments" v-if="item.imagesList">
								<image-show :enable="true" width="200" :key="item.imagesList" height="200"
									quantityPerLine="3" :imgSrc="item.imagesList"></image-show>
							</view>
							<view class="item-audio" v-if="item.audioObject">
								<mihuo-audio :formData="item.audioObject" class="voice" />
							</view>
						</view>
					</view>
				</view>
			</view>
			<mh-empty v-else title="暂无数据～～" />
		</view>

		<view class="custom-nodes-add-form" v-if="this.details.status == 0">
			<view class="top-contain">
				<view class="item-title"> <text class="icon-item">*</text>备注</view>
				<view class="public-item-bottom ">
					<u-input v-model="form.comment" class="describe-input" maxlength="200" height="200" type="textarea"
						placeholder="请输入备注" :border="true" />
				</view>
				<view class="item-attachment">
					<view class="file-contain">
						<image-upload-new :uploadType="uploadType" :count="9" v-model="images" />
					</view>
					<view class="voice-contain">
						<sound-recording @chooseVoice="chooseVoice" />
					</view>
				</view>
			</view>
		</view>
		<!-- 0->已发起待处理 1->撤销 2->同意 3->驳回 4->发起方确认 -->
		<view class="custom-nodes-page-button" v-if="this.details.status == 0">
			<view class="item-button-list">
				<view class="item-button-default" :class="[ item.active?'item-button-active':'item-button']"
					v-for="(item,index) in buttonList" :key="index" @click="getButton(item)">
					{{item.lable}}
				</view>
			</view>
		</view>
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
				uploadType: ['图片', '视频'],
				images: '[]',
				attachment: [],
				buttonList: [{
					value: 1,
					lable: '取消',
					active: false
				}, {
					value: 2,
					lable: '确认',
					active: true
				}],
				details: {},
				imagesList: '',
				audioObject: '',
				form: {
					bizPendingDetailId: 0, // 待办明细id
					comment: '', // 待办内容	
					handlePersonId: '', // 当前人员编号	
					attachments: []
				},
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
		},
		methods: {
			setPortrait(item) {
				return `avatar/${item}.png`
			},
			setParameter() {
				this.form.bizPendingDetailId = this.option.pendingDetailId
				this.form.handlePersonId = this.userPersonId
				this.getDetails()
			},
			getDetails() {
				if (!this.option.detailId) {
					return
				}
				this.$httpApi.getBizpendingId({
					id: this.option.detailId
				}).then(res => {
					if (res) {
						this.details = res
						let tempStartAttachments = res.attachments && JSON.parse(res.attachments)
						let tempImages = tempStartAttachments.filter(item => item.type == 'img' || item.type == 'video' )
						this.imagesList = JSON.stringify(tempImages)
						this.audioObject = tempStartAttachments.find(item => item.type == 'audio')
						if (this.details.bizPendingDetailList.length > 0) {
							this.details.bizPendingDetailList.forEach(el => {
								el['attachmentsList'] = el.attachments && JSON.parse(el.attachments)
							})
							this.details.bizPendingDetailList.forEach(el => {
								el['imagesList'] = el.attachmentsList && JSON.stringify(el.attachmentsList.filter(item => item
									.type == 'img' || item.type == 'video'))
								el['audioObject'] = el.attachmentsList && el.attachmentsList.find(item => item.type == 'audio')
							})
							this.details.bizPendingDetailList.filter(item =>item.handlePersonId == this.userPersonId)
						}
					}
				})
			},
			getButton(item) {
				if (item.lable == '取消') {
					this.goBack()
				} else {
					if (!this.form.comment) {
						this.$util.toast("请填写备注");
						return
					}
					let tempImages = JSON.parse(this.images)
					if (tempImages.length > 0) {
						tempImages.forEach(el => {
							this.attachment.push({
								type: 'img',
								url: el.url
							})
						})
					}
					this.form.attachments = this.attachment
					this.$httpApi.bizpendingHandle(this.form).then(res => {
						if (res) {
							this.$util.toast("操作成功,将返回上一页");
							setTimeout(() => {
								this.goBack()
							}, 2000)
						}
					})
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

	.icon-item {
		color: #FF5D35;
	}

	.custom-nodes-add {
		margin-top: 8rpx;

		.view-content {
			margin-bottom: 4rpx;

			.view-content-contain {
				padding: 26rpx;
				background-color: #fff;
			}

			.item-comment {
				font-size: 28rpx;
				color: #303133;
				margin-bottom: 20rpx;
			}

			.initiate-contain {
				border-bottom: 2rpx solid #f5f5f5;
				padding-bottom: 30rpx;
				margin-bottom: 30rpx;
			}

			.public-item-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16rpx;

				.item-left {
					display: flex;
					align-items: center;

					.item-name {
						color: #303133;
						font-size: 26rpx;
						margin-left: 8rpx;
					}
				}

				.item-right {
					color: #909299;
					font-size: 26rpx;
				}
			}

			.result-contian {
				.item-title {
					font-size: 28rpx;
					color: #303133;
					margin-bottom: 30rpx;
				}
			}
		}

		.custom-nodes-add-form {
			.top-contain {
				background-color: #fff;
				padding: 26rpx;

				.item-title {
					color: $seconFontColor;
					font-size: 28rpx;
					margin-bottom: 32rpx;
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
