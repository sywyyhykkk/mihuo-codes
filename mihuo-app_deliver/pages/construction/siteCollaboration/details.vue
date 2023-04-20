<template>
	<view class="details-page">
		<view class="information">
			<view class="top">
				<text v-if="details.requirementName" class="title">{{details.requirementName}}</text>
				<text v-if="details.expectDate"
					class="time">开工时间：{{details.expectDate}}至{{details.expectCompleteDate}}</text>
				<text v-if="details.requirementDesc" class="text-desc">委托内容：{{details.requirementDesc}}</text>
			</view>
			<view class="middle">
				<view v-if="achmentsImage" class="image-contain">
					<image-show width="140" height="140" :imgSrc="achmentsImage" :key="achmentsImage" enable quantityPerLine="4"></image-show>
				</view>
				<view v-if="attachmentsAudio" class="audio-contain">
					<journal-audio :formDate="attachmentsAudio" />
				</view>
			</view>
			<view class="bottom">
				<text v-if="details.created" class="time">
					{{details.created && details.created.substring(0,16)}}发起</text>
				<text v-if="details.contactName" class="skill">委托人：{{details.contactName}}</text>
				<text v-if="details.skillName" class="skill">所需工种：{{details.skillName}}</text>
			</view>
		</view>

		<view v-if="details.orderStatus > 30" class="information">
			<view class="top">
				<view class="item-top display-justify_between">
					<text class="title">验收描述</text>
					<!-- <text class="status">{{acceptDetails.applyDesc}}</text> -->
				</view>
				<text class="text-desc">{{acceptDetails.applyDesc}}</text>
			</view>
			<view class="middle">
				<view v-if="acceptDetails.picFiles !== '[]'" class="image-contain">
					<image-show right="20" :imgSrc="acceptDetails.picFiles" :key="acceptDetails.picFiles" width="140" height="140" enable quantityPerLine="4"></image-show>
				</view>
				<view v-if="acceptDetails.voiceFiles" class="audio-contain">
					<journal-audio :formDate="JSON.parse(acceptDetails.voiceFiles)" />
				</view>
			</view>
			<view class="bottom">
				<text class="time">开始时间：{{acceptDetails.createTime}}发起</text>
				<text class="skill">发起人：{{acceptDetails.applyPersonName}}</text>
			</view>
		</view>

		<mihuo-bottom-button :buttonList="setButtonList" @click="getButton"></mihuo-bottom-button>
	</view>
</template>

<script>
	import baseConfig from '@/config/common.js';
	export default {
		data() {
			return {
				option: {},
				details: {},
				acceptDetails: {},
				achmentsImage: '',
				attachmentsAudio: '',
				detailsShow:false,
				buttonList: [{
						name: '确认验收',
						status: true,
						statusList:[35]
					},
					{
						name: '分享至微信',
						status: true,
						statusList:[10]
					}
				]
			}
		},
		computed: {
			setButtonList() {
				if (!this.detailsShow) {
					return []
				}
				return this.buttonList.filter(item => item.statusList.includes(this.details.orderStatus))
			}
		},
		mounted() {

		},
		onShow() {
			this.getDetails()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {

			getDetails() {
				this.$httpApi.outsourcingDetails({
					id: this.option.id
				}).then(res => {
					if (res) {
						let attachments = JSON.parse(res.attachments)
						if (attachments && attachments.length > 0) {
							this.achmentsImage = attachments.filter(item => item.type == 'img' || item.type ==
								'video')
							this.achmentsImage = JSON.stringify(this.achmentsImage)
							this.attachmentsAudio = attachments.find(item => item.type == 'audio')
						}
						this.details = res
						this.detailsShow = true
						this.getAcceptancesByTaskId()
					}
				})
			},
			getAcceptancesByTaskId() {
				this.$httpApi.getInnerAcceptances({
					skillId: this.details.skillId,
					projectId: this.details.projectId
				}).then(res => {
					if (res) {
						this.acceptDetails = res[0]
					}
				})
			},
			getButton(item) {
				if (item.name == '分享至微信') {
					this.getShare()
				} else {
					if (this.details.nodeId != 0 && this.acceptDetails.nodeId) {
						if(Number(this.acceptDetails.nodeId) !== 0){
							this.$httpApi.sopNodeTemplate({
								nodeId: this.acceptDetails.nodeId
							}).then(res => {
								if (res) {
									this.$store.commit('setNodeInfo', res)
									this.$remainingDays()
									this.toPage(`/pages/construction/middleExternalAccept`)
								}
							})
						}else{
							this.$util.toast(`未成功配置验收节点~`);
						}
					} else {
						this.$httpApi.execAcceptance({
							orderId:this.details.id,
							acceptanceId:this.acceptDetails.id,
							statusFlag:1 // 验收状态 1通过 2 失败,可用值:1,2
						}).then(res=>{
							if(res){
								this.$util.toast(`验收成功~`);
								this.getDetails()
							}
						})
					}
				}
			},
			getShare() {
				const userData = uni.getStorageSync('userData')
				const title = `收到一个项目委托，请点击查看`
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 5, // 微信小程序
					imageUrl: 'https://www.51mihuo.com/static/images/mihuo-share.JPG',
					title: title,
					miniProgram: {
						id: baseConfig.WeChatApplet.site, // 工地协作小程序
						path: `/pages-order/collaborationDetails/collaborationDetails?id=${this.option.id}&shareType=1&userId=${userData.sysUser.userId}`, // 分享到小程序的页面
						type: baseConfig.appletVersion, // 小程序版本  0-正式版； 1-开发版； 2-体验版。
						webUrl: 'https://www.51mihuo.com/' // 兼容低版本的网页链接
					},
					success: res => {
						// this.$util.toast('分享成功~')
					},
					complete: res => {
						uni.hideLoading();
					}
				})
			},

		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.information {
		margin: 20rpx;
		border-radius: 16rpx;
		background-color: #fff;
		padding: 30rpx 0rpx;

		.item-top {}

		.top {
			display: flex;
			flex-direction: column;
			padding: 0rpx 28rpx;

			.title {
				color: #3D3D3D;
				font-size: $middleFontSize;
				font-weight: bold;
			}

			.status {
				color: $themeColor;
				font-size: $middleFontSize;
			}

			.time {
				margin-top: 14rpx;
				font-size: $fontSize26;
				color: $seconFontColor;
				line-height: 32rpx;
			}


			.text-desc {
				margin-top: 14rpx;
				font-size: $fontSize26;
				color: $seconFontColor;
				line-height: 32rpx;
			}
		}

		.middle {
			margin-top: 18rpx;
			padding-left: 28rpx;
		}

		.bottom {
			display: flex;
			flex-direction: column;
			margin-top: 40rpx;
			padding: 0rpx 28rpx;

			.time {
				font-size: $fontSize26;
				color: $mainFontColor;
				line-height: 32rpx;
			}

			.skill {
				margin-top: 14rpx;
				font-size: $fontSize26;
				color: $mainFontColor;
				line-height: 32rpx;
			}
		}
	}
	
	.audio-contain{
		padding-right: 28rpx;
	}
</style>
