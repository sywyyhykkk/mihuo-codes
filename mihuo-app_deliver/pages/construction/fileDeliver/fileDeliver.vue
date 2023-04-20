<template>
	<view>
		<public-module></public-module>
		<view class="release">
			<form>
				<view class="bg_fff" style="margin-top: 10rpx;">
					<view class="top_nav">
						<text class="left_nav">交付内容</text>
					</view>
					<view class="textarea_box">
						<textarea placeholder-style="color:#909199" placeholder="请输入描述" style="width: 100%;
							height: 166rpx;padding: 24rpx 26rpx;box-sizing: border-box;background: #F7F7F7;
							border-radius: 10rpx;font-size: 25rpx;" v-model="form.content" />
						<view class="upload">
							<!-- <image-upload-new v-model="form.pics" :uploadType="uploadType" /> -->
						</view>
					</view>
					<view class="voice-contain">
						<sound-recording @chooseVoice="chooseVoice" />
					</view>
				</view>
				<view class="position align-items">
					<text class="label">当前位置：<text class="address">云纺国际商厦A座</text></text>
					<image src="../../../static/icon/position2.png" mode=""></image>
				</view>
				<view class="btm_btn">
					<button class="confirm" type="primary" @click="submit">确认提交</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from "@/plugins/uploadPic.js";
	import {
		debounce
	} from "@/plugins/utils.js"
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				orderInfo: uni.getStorageSync("orderInfo"),
				uploadType: ['图片'],
				chooseVoiceObject: {},
				fileObj: {},
				conValue: '',
				form: {
					address: uni.getStorageSync("orderInfo").address,
					latitude: uni.getStorageSync("orderInfo").latitude,
					longitude: uni.getStorageSync("orderInfo").longitude,
					content: '',
					audio: '',
					nodeId: '',
					orderId: uni.getStorageSync("orderId"),
					projectId: '',
					pics: '',
					type: 0, //0=未选；1=文件；2=定位；3=文本
				}
			}
		},
		onShow() {
			console.log("");
		},
		methods: {
			...mapMutations(['setLoadingShow']),
			submit() {
				let that = this
				debounce(function() {
					that.debounce()
				}, 200)
			},
			debounce() {
				if (this.form.content === '') {
					this.$util.toast("请输入描述");
					return;
				};
				this.$http.post("order/sopprojectdelivery/save", this.form).then(res => {
					this.$util.toast("提交成功");
					uni.navigateBack(-1)
				}).catch(err => {
					console.log(err)
				})
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
			uploadImg(file) {
				this.fileObj = file;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.release {
		margin: 0 20rpx;

		.top_nav {
			.left_nav {
				font-weight: bold;
				font-size: $middleFontSize;
				color: $darkTitle;
			}
		}

		.bg_fff {
			margin-bottom: 10rpx;
			padding: 30rpx;
			background: #FFFFFF;
			border-radius: 10rpx;

			.inp_box {
				margin-bottom: 25rpx;
				padding: 0 16rpx 15rpx 0;
				border-bottom: 1.5rpx dashed #EEEEEE;
			}

			.textarea_box {
				padding: 25rpx 0;
				padding-bottom: 10rpx;

				.upload {
					margin: 25.5rpx 0;

					.upload_tool {
						width: 108rpx;
						height: 108rpx;
						border: 1.5rpx solid #E0E0E0;
						box-sizing: border-box;
						border-radius: 10rpx;
					}
				}
			}
		}
	}

	.position {
		height: 108rpx;
		margin: 6rpx 0 251rpx;
		padding: 0 42rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.label {
			color: #909199;
			font-size: $middleFontSize;
		}

		.address {
			font-size: $middleFontSize;
			font-weight: bold;
			color: $fontColor33;
		}

		image {
			width: 32rpx;
			height: 36rpx;
		}
	}

	.btm_btn {
		margin: 76rpx 47rpx;
		text-align: center;

		.confirm {
			display: inline-block;
			width: 100%;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			font-weight: bold;
			font-size: $smallFontSize;
			border-radius: 10rpx;
			background: $themeColor;
		}
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
