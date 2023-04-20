<template>
	<view>
		<view class="suppose_you">
			<view class="suppose">问题举报</view>
			<view class="button_item" v-for="(item,index) in buttonList" :key="index">
				<view :class="index===buttonIndex?'button_name2':'button_name'" @click="changeButtonItem(index)">
					{{item.label}}
				</view>
			</view>
			<view style="clear: both;"></view>
			<view class="describe">请描述具体问题</view>
			<view class="describe_conter">
				<textarea v-model="form.description" class="describe_input"
					placeholder="您的举报平台审核通过后将会及时通知您,感谢您对觅活社区整洁做出的贡献" />
				<!-- <view>
					<view class="microphone_text">语音识别</view>
					<image src="@/pages-message/static/images/microphone.png" class="microphone"></image>
					<view style="clear: both;"></view>
				</view> -->
			</view>
			<view class="upload_img">
				<image-upload-new :uploadType="uploadType" v-model="form.urls" />
			</view>
			<view style="height: 28rpx; clear: both;"></view>
		</view>

		<view class="suppose_you lx_borrder_radius">
			<view class="describe">联系方式（选填）</view>
			<input v-model="form.phone" type="digit" maxlength="11" class="contact_way"
				placeholder="填写联系方式，便于我们更好地联系您" />
			<view style="height: 50rpx;"></view>
		</view>

		<view class="submit" @click="submit">确认举报</view>
		<view style="height: 60rpx;"></view>
	</view>
</template>


<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js'

	export default {
		data() {
			return {
				uploadType: ['图片', '视频'],
				buttonList: [],
				buttonIndex: 0,
				form: {
					description: "",
					id: 0,
					isReply: 0,
					problemType: '1001',
					merchantReplyContent: "",
					merchantReplyId: 0,
					merchantReplyTime: "",
					phone: "",
					urls: "",
					userId: 0
				},
				imageList: [],
				imageUrls: [],
				liList: []
			}
		},
		onLoad() {},
		methods: {
			submit() {
				setTimeout(() => {
					uni.showToast({
						title: "举报成功",
						icon: "none"
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1000)
				}, 1000)
			},
			changeButtonItem(index) {
				this.buttonIndex = index
				this.form.problemType = index == 0 ? '1001' : index == 1 ? '1002' : '1003'
			}
		}
	}
</script>

<style scoped lang="scss">
	.submit {
		margin: 80rpx 60rpx 0 60rpx;
		line-height: 90rpx;
		background: $themeColor;
		border-radius: 10rpx;
		text-align: center;
		font-weight: bold;
		font-size: $middleFontSize;
		color: #FFFFFF;

	}

	.suppose_you {
		padding: 44rpx 44rpx 0 36rpx;
		background-color: #FFFFFF;
		margin: 2rpx 0 15rpx;

		.contact_way {
			font-size: 26rpx;
			line-height: 60rpx;
			height: 60rpx;
			font-weight: normal;
			color: #909199;

		}

		.describe_conter {
			background: #F3F3F3;
			border: 2rpx solid #FFFFFF;
			box-sizing: border-box;
			border-radius: 10rpx;
			padding: 24rpx;
			margin-top: 14rpx;

			.microphone {
				width: 26rpx;
				height: 26rpx;
				float: right;
				margin-top: 8rpx;

			}

			.microphone_text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: $smallFontSize;
				line-height: 40rpx;
				color: $mainFontColor;
				margin-left: 10rpx;
				float: right;
			}

			.describe_input {
				height: 140rpx;
				width: 100%;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: $smiddleFontSize;
				line-height: 36rpx;
				color: $viceFontColor;

			}
		}

		.upload_img {
			margin-top: 24rpx;
		}

		.describe {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: $middleFontSize;
			line-height: 40rpx;
			color: $seconFontColor;
		}

		.button_item {
			width: 33.3%;
			float: left;
			height: 136rpx;
			padding-top: 36rpx;

			.button_name {
				margin: 0 auto;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 400;
				font-size: $smiddleFontSize;
				line-height: 64rpx;
				color: #909199;
				width: 186rpx;
				border: 2rpx solid #EFEFEF;
				box-sizing: border-box;
				border-radius: 50rpx;
				text-align: center;
				transition: all .2s;
			}

			.button_name2 {
				margin: 0 auto;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 400;
				font-size: $smiddleFontSize;
				line-height: 64rpx;
				color: $themeColor;
				width: 186rpx;
				border: 2rpx solid $themeColor;
				box-sizing: border-box;
				border-radius: 50rpx;
				text-align: center;
				transition: all .2s;
			}
		}

		.suppose {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: $middleAddFontSize;
			line-height: 44rpx;
			color: $seconFontColor;
		}

		.my_problem {
			height: 90rpx;
			border-bottom: solid 2rpx #E7E7E7;

			.dot {
				background: $themeColor;
				width: 12rpx;
				height: 12rpx;
				border-radius: 12rpx;
				float: left;
				margin-top: 39rpx;
			}

			.problem {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 400;
				font-size: 28rpx;
				line-height: 90rpx;
				color: $seconFontColor;
				float: left;
				margin-left: 10rpx;
			}
		}

	}

	.lx_borrder_radius {
		border-radius: 0px 0px 2r0px 20rpx;
	}
</style>
