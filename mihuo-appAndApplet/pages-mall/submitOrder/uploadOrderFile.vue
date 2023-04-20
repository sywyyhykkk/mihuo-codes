<template>
	<view>
		<z-nav-bar backState="1000" color="#fff">
			<view slot="default" class="nav-bar">上传附件</view>
		</z-nav-bar>
		<view class="attach-content flex-center">
			<view class="attach-item">
				<sound-recording @chooseVoice="chooseVoice" v-model="currentVoice" />
			</view>
			<view class="attach-item" style="margin-top: 20rpx;">
				<image-upload-new :uploadType="uploadType" :count="9" v-model="fileObject" />
			</view>
		</view>
		<bottom-button title="确认" @click="saveFile"></bottom-button>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from "@/plugins/uploadPic.js";

	export default {
		data() {
			return {
				uploadType: ["图片", "视频"],
				fileObject: '',
				chooseVoiceObject: {},
				attachments: {},
				isShowCurrent: false,
				currentVoice: {}
			}
		},
		onLoad(option) {
			if (option.data) {
				this.attachments = option.data
				if (this.attachments ) {
					this.isShowCurrent = true
					const attObj = JSON.parse(this.attachments)
					const imgList = []
					attObj.forEach(item => {
						if (item.type == 'audio') {
							this.currentVoice = item
							this.chooseVoiceObject = item
						} else if (item.type == 'img') {
							imgList.push(item)
						}
					})
					this.fileObject = JSON.stringify(imgList)
				}
			}
		},
		methods: {
			// 重新录音
			record(){
				uni.showModal({
					title: '确认操作',
					content: '确认重新录制语音？',
					success: res => {
						if (res.confirm) {
							this.currentVoice = {}
							this.chooseVoiceObject = {}
							const attObj = JSON.parse(this.attachments)
							this.attachments = JSON.stringify(attObj.filter(item => item.type == 'audio'))
							this.isShowCurrent = false
						}
					}
				});
			},
			// 选择音频文件
			chooseVoice(file) {
				this.isShowButton = false
				this.chooseVoiceObject = file;
			},
			async saveFile() {
				const audioFile = [];
				if (this.chooseVoiceObject.path) {
					audioFile.push({
						type: "audio",
						url: await CommonUpload(this.chooseVoiceObject.path),
						timeLength: this.chooseVoiceObject.duration,
					});
				} else {
					if(this.chooseVoiceObject.url){
						audioFile.push({
							type: this.chooseVoiceObject.type,
							url: this.chooseVoiceObject.url,
							timeLength: this.chooseVoiceObject.timeLength,
						});
					}
				}
				const fileAll = [...audioFile];
				if (this.fileObject) {
					fileAll.push(...JSON.parse(this.fileObject))
				}
				this.attachments = JSON.stringify(fileAll);
				uni.$emit('uploadOrderFile', this.attachments)
				this.goBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.attach-content {
		width: 750rpx;
		height: max-content;
		background-color: #fff;
		flex-direction: column;
		margin-top: 30rpx;

		.attach-item {
			width: 690rpx;
			height: max-content;
		}
	}
	
	.title {
		width: 100%;
		text-align: right;
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.current-attach {
		width: 750rpx;
		margin: 0rpx 30rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
