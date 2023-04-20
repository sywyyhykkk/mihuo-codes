<template>
	<view class="custom-nodes-add">
		<view class="custom-nodes-add-form">
			<view class="top-contain">
				<view v-if="reviewDesc" class="item-title">{{reviewDesc}}</view>
				<view class="item-form">
					<mihuo-input type="textarea" v-model="form.remark" :required="option.type == '审查不通过' ? true :false"
						:label="option.type == '审查不通过' ? '原因':'备注'" placeholder="请输入备注">
					</mihuo-input>
				</view>
				

				<view class="signature-contain display-center" @click="()=>signPopup=!signPopup"
					v-if="details && details.signFlag == 1">
					<image class="signature-image" v-if="form.signImg"
						:src="$util.thumbnailImage(form.signImg, false)" mode="scaleToFill" />
					<view class="signature " v-else>
						<text>点击进行签名</text>
					</view>
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


		<!-- <view class="custom-nodes-page-button">
			<view class="item-button-list">
				<view class="item-button-default" :class="[ item.active?'item-button-active':'item-button']"
					v-for="(item,index) in buttonList" :key="index" @click="getButton(item)">
					{{item.lable}}
				</view>
			</view>
		</view> -->

		<mihuo-bottom-button :buttonList="buttonList" @click="getButton"></mihuo-bottom-button>

		<!-- 签名弹框 -->
		<sign-popup v-model="signPopup" @success="success" @close="signPopup =false"></sign-popup>
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
				reviewDesc: '',
				buttonList: [{
					value: 1,
					name: '取消',
					status: false
				}, {
					value: 2,
					name: '确认',
					status: true
				}],
				signPopup: false,
				details: '',
				form: {
					id: '',
					attachments: [],
					startPersonId: 0,
					remark: '',
					signImg: '',
					status: 0 //审查状态 0-待审查 1-审查不通过 2-审查通过
				},
			}
		},
		computed: {

		},
		mounted() {

		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonId'])
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getReviewView()
		},
		methods: {
			setParameter() {
				uni.setNavigationBarTitle({
					title: this.option.type
				});
				this.form.id = this.option.detailsId
				this.form.status = this.option.type == '审查不通过' ? 1 : 2
				this.form.startPersonId = this.userPersonId
				this.form.remark = this.option.type
			},
			getButton(item) {
				if (item.name == '取消') {
					this.goBack()
				} else {
					if (this.details.signFlag && !this.form.signImg) {
						this.$util.toast("本次审查需要签名");
						return
					}
					if (this.option.type == '审查不通过') {
						if (!this.form.remark) {
							this.$util.toast("请填写备注");
							return
						}
					}
					let tempImages = JSON.parse(this.images)
					if (tempImages.length > 0) {
						this.attachment = []
						tempImages.forEach(el => {
							this.attachment.push({
								type: 'img',
								url: el.url
							})
						})
					}
					this.form.attachments = this.attachment
					this.$httpApi.setReview(this.form).then(res => {
						this.$util.toast("操作成功,将返回上一页");
						setTimeout(() => {
							this.goBack()
						}, 2000)
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
			getReviewView() {
				if (!this.option.detailsId) {
					return
				}
				this.$httpApi.getReviewView({
					id: this.option.detailsId
				}).then(res => {
					if (res) {
						this.reviewDesc = res.reviewDesc
						this.details = res
					}
				})
			},
			success(res) {
				this.form.signImg = res
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.signature-contain {
		padding: 10rpx;
		background-color: #F6F7F9;
	}
	.signature {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10rpx;
		border-radius: 8rpx;
		width: 100%;
		height: 300rpx;
		background: #F6F7F9;
		text {
			margin: 0 auto;
			font-size: 26rpx;
			color: #a8a8a8;
		}
	}
	.signature-image {
		height: 300rpx;
	}
	
	.item-form{
		margin-bottom: 20rpx;
	}
	.custom-nodes-add {
		margin-top: 8rpx;
		.custom-nodes-add-form {
			.top-contain {
				padding: 26rpx;
				background-color: #fff;
				.item-title {
					margin-bottom: 32rpx;
					font-size: 28rpx;
					color: $seconFontColor;
					.text-icon {
						color: $errorFontColor;
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
				margin-top: 2rpx;
				background-color: #fff;
				.send-user {
					margin-top: 2rpx;
					padding: 36rpx 42rpx;
					border-top: 2rpx solid #f5f5f5;
					.item-label {
						margin-right: 74rpx;
						font-size: 28rpx;
						color: #303133;
					}
					.item-value {
						font-size: 26rpx;
						color: #999;
					}
				}
			}
		}
		.custom-nodes-page-button {
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			.item-button-list {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 14px 10px;
				background-color: #fff;
				.item-button-default {
					border: 2rpx solid #fff;
					border-radius: 10rpx;
					width: 268rpx;
					height: 88rpx;
					line-height: 88rpx;
					text-align: center;
					font-size: $middleFontSize;
					color: #909299;
				}
				.item-button {
					margin-right: 24rpx;
					border: 2rpx solid #E0E0E0;
				}
				.item-button-active {
					border: 2rpx solid $themeColor;
					background-color: $themeColor;
					color: #fff;
				}
			}
		}
	}
</style>
