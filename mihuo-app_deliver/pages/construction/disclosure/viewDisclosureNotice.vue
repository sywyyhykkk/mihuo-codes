<template>
	<view class="initiate-page">
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<view class="file-contain-all">
			<view class="text-contain">
				<view class="title">通知内容</view>
				<view class="text">
					{{details.notifyContent}}
				</view>
			</view>
			<view class="img-contain" v-if="details.notifyAttachmentsImage">
				<image-show :imgSrc="details.notifyAttachmentsImage" right="20"></image-show>
			</view>
			<view class="voice-contain" v-if='details.notifyAttachmentsAudio'>
				<mihuo-audio :formData="details.notifyAttachmentsAudio"></mihuo-audio>
			</view>
		</view>
		<view class="x6-form-item">
			<view class="item-contain">
				<view class="left">发起人</view>
				<view class="right" >
					<text>{{details.createPersonName}}</text>
					<text>{{details.createSkillName}}</text>
				</view>
			</view>
			<view class="item-contain">
				<view class="left">交底日期</view>
				<view class="right" v-if="details.notifyDate">{{details.notifyDate.substring(0,10)}}</view>
			</view>
		</view>
		<!-- <view v-if="buttonShow" class="submit-text iphonex-bottom" @click="submit">
			确认
		</view> -->
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				details: {

				},
				buttonShow: true,
				option: {},
				projectId:'',
				nodeId:'',
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
		
		},
		onShow() {
			this.getTypeName()
		},
		computed: {
			...mapState(['nodeInfo','projectInfo','userPersonInfo'])
		},
		methods: {
			setParameter(){
				if(this.option.type === '交底通知'){
					this.nodeId = this.option.nodeId
				}else{
					this.nodeId = this.nodeInfo.nodeId
				}
				this.getDetails()
				this.readNotifyUsingPOST()
			},
			getTypeName() {
				this.projectId = this.projectInfo.projectId
				if (this.option.typeName === '查看通知') {
					this.buttonShow = false
				}
				uni.setNavigationBarTitle({
					title:this.nodeInfo.nodeName ? this.nodeInfo.nodeName : '' + '通知',
				})
			},
			getDetails() {
				if(!this.nodeId){
					return
				}
				
				this.$httpApi.selectNotifyList({
					nodeId: this.nodeId
				}).then(res => {
					if (res) {
						this.details = res
						this.details['notifyAttachmentsImage'] = JSON.stringify(JSON.parse(this.details
								.notifyAttachments)
							.filter(item => item.type == 'img' ||　item.type == 'video'))
						this.details['notifyAttachmentsAudio'] = JSON.parse(this.details.notifyAttachments)
							.find(item => item.type == 'audio')		
							
							
						if(this.option.toDoType){
							this.setReadNotifyUsing()
						}

					}
				})
			},
			submit() {
				this.debounce(() => {
					this.goBack()
				}, 200)
			},
			setReadNotifyUsing(){
				let personId  = this.userPersonInfo.personId
				if(personId){
					let tempNotify = this.details.ccPersons.find(item =>item.handlePersonId == personId)
					if(tempNotify){
						this.$httpApi.readNotify({
							notifyId:tempNotify.id
						}).then(res =>{
						})
					}
				}
			},
			readNotifyUsingPOST() {
				if (this.option.notifyId) {
					this.$httpApi.readNotify({
						notifyId: this.option.notifyId
					}).then(res => {

					})
				}


				if(this.option.toDoType){
					this.$httpApi.bizpendingHandle({
						bizPendingDetailId:this.option.bizPendingDetailId,
						handlePersonId:this.userPersonInfo.personId
					}).then(res =>{

					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.file-contain-all {
		margin: 0rpx 20rpx 4rpx 20rpx;
		border-radius: 10rpx;
		padding: 30rpx 40rpx 42rpx 40rpx;
		background: #FFFFFF;
		border-radius: $miniBorderRadius;

		.text-contain {
			margin-bottom: 32rpx;

			.title {
				font-size: $middleFontSize;
				color: $mainFontColor;
				margin-bottom: 20rpx;
			}

			.text {
				font-size: $middleFontSize;
				color: $seconFontColor;
				line-height: 1.5;
			}

		}


		.img-contain {
			display: flex;
			flex-wrap: wrap;
			background-color: #FFFFFF;
			margin-bottom: 32rpx;

			.record-item-img {
				width: 180rpx;
				margin-right: 22rpx;
			}
		}

		.voice-contain {
			background: #FFFFFF;
			margin-bottom: 2rpx;
		}

	}


	.submit-text {
		display: flex;
		position: fixed;
		bottom: 0;
		justify-content: center;
		width: 624rpx;
		margin: 20rpx 64rpx 20rpx 64rpx;
		background: $themeColor;
		color: #FFFFFF;
		font-weight: bold;
		font-size: 28rpx;
		line-height: 88rpx;
		border-radius: 10rpx;
	}

	.x6-form-item {
		.item-contain {
			padding: 42rpx 84rpx 40rpx 48rpx;
			background: #FFFFFF;
			border-radius: $miniBorderRadius;
			margin: 0rpx 20rpx 4rpx 20rpx;
			display: flex;
			justify-content: space-between;

			.left {
				font-size: $smiddleFontSize;
				color: $mainFontColor;
			}

			.right {

				text {
					font-weight: bold;
					font-size: $middleFontSize;
					color: $seconFontColor;

					&:nth-of-type(1) {
						margin-right: 20rpx;
					}
				}
			}
		}

	}
</style>
