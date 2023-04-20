<template>
	<view class="assign">
		<z-nav-bar>
			<view slot="default" class="nav-bar"> {{setTitle}} </view>
		</z-nav-bar>
		<form>
			<view class="uni-form-item uni-column" v-if="nodeInfo && nodeInfo.reviewDesc">
				<view class="title">{{nodeInfo.reviewDesc || '' }}</view>
			</view>
			<view class="uni-form-item uni-column">
				<textarea v-model="remark" maxlength="140"
					style="padding:6px 9px;border-radius: 8rpx;background: #F7F7F7;width: 100%;height:200rpx;font-size:28rpx"
					:placeholder="setPlaceholder" placeholder-style="color:#909199;font-size: 13px" />
			</view>
			<view class="uni-form-item uni-column" @click="()=>isSignature=true" v-if="nodeInfo && nodeInfo.signFlag == 1">
				<image class="signature" v-if="signBolbImg" :src="$util.thumbnailImage(signBolbImg, false)" mode="scaleToFill"/>
				<view class="signature" v-else>
					<text>点击进行签名</text>
				</view>
			</view>
			<!-- B端填写变更拒绝原因时不显示图片、语音 -->
			<view v-if="options.type !== 'changeRecordPage'" class="uni-form-item uni-column">
				<image-upload-new v-model="uplodIamge" count="9" />
			</view>
			<view v-if="options.type !== 'changeRecordPage'" class="uni-form-item uni-column">
				<sound-recording style="width:100%" @chooseVoice="chooseVoice" />
			</view>
		</form>
		<!-- <view class="status-item">
			<view class="title">
				审查意见
			</view>
			<u-radio-group v-model="status">
				<u-radio v-for="(item, index) in statusList" :key="index" :name="item.value">
					{{ item.name }}
				</u-radio>
			</u-radio-group>
		</view> -->
		<myHome-mh-signature v-if="isSignature" v-model="isSignature" @success="(e)=>signBolbImg=e"></myHome-mh-signature>
		<bottom-button title="确认" @click="save"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusList: [{
						name: '通过',
						value: 2
					},
					{
						name: '不通过',
						value: 1
					}
				],
				status: '2', // 审查状态 0-待审查 1-审查不通过 2-审查通过
				remark: '', // 审查意见
				uplodIamge: '', // 图片
				attachments: [], // 附件
				audioList: [], // 音频
				options: {},
				title: '',
				nodeInfo: {},
				isSignature: false,
				signImg:'',
				signBolbImg:'',
			}
		},
		computed: {
			setTitle() {
				if (this.options.type) {
					if (this.options.type == 'changeRecordPage') {
						return '拒绝原因'
					}
				} else {
					return '服务内容确认'
				}
			},
			setPlaceholder() {
				if (this.options.type) {
					if (this.options.type == 'changeRecordPage') {
						return '请填写拒绝原因'
					}
				} else {
					return '对于我的工作，您有什么要补充的吗~~'
				}
			}
		},
		onLoad(options) {
			this.options = options
			if(options.reviewId){
				this.getNode()
			}
		},
		onShow() {
		},
		methods: {
			save() {
				// 判断是否有文件
				if (this.uplodIamge) {
					this.attachments = JSON.parse(this.uplodIamge)
				}
				if (this.audioList && this.audioList.length) {
					this.attachments = this.attachments ? this.attachments.concat(this.audioList) : this.audioList
				}
				if(this.nodeInfo.signFlag == 1){
					if(!this.signBolbImg){
						this.$util.toast('该节点需要业主签字，请先签字')
						return
					}
				}
				uni.showLoading({
					title: '保存中',
					mask: true
				})
				if (this.options.type) {
					if (this.options.type == 'changeRecordPage') {
						this.getVerify()
					}
				} else {
					this.$httpApi
						.handleToDoPending({
							id: this.options.reviewId,
							status: this.options.status,
							remark: this.remark,
							signImg: this.signBolbImg,
							attachments: this.attachments
						})
						.then(res => {
							if (res) {
								this.$util.toast('处理成功')
								setTimeout(() => {
									this.goBack()
								}, 500)
							}
						}).finally(()=>{
							uni.hideLoading()
						})
				}
			},
			saveData(result){
				this.$httpApi
				.handleToDoPending({
					id: this.options.reviewId,
					status: this.options.status,
					remark: this.remark,
					signImg: result,
					attachments: this.attachments
				})
				.then(res => {
					if (res) {
						this.$util.toast('处理成功')
						uni.hideLoading()
						setTimeout(() => {
							this.goBack()
						}, 500)
					}
				})
			},
			dataURLtoBlob(dataurl) {
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], { type: mime });
			},
			// 获取音频
			async chooseVoice(file, flag) {
				if (file.path != '{}') {
					let temp = [{
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}]
					this.audioList = temp
				}
				if (flag) {
					this.audioList = []
				}
			},
			getVerify() {
				let parm = {
					id: this.options.reviewId,
					verifyStatus: 1,
					verifyReason: this.remark
				}
				this.$httpApi.getVerify(parm).then(res => {
					if (res) {
						this.$util.toast('处理成功')
						uni.hideLoading()
						setTimeout(() => {
							this.goBack()
						}, 500)
					}
				})
			},
			// 查询节点详情信息
			getNode(){
				this.$httpApi.getCheckNode(this.options.reviewId).then((res) => {
					this.nodeInfo = res;
				});
			},
			signBack(e){
				this.signBolbImg = e.bas64
				this.signImg = e.image
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.assign {
		padding: 0 30rpx;
	}

	.nav-bar {
		@include nav-bar-title(#000000);
	}
	.uni-column{
		.title{
			color: #000000;
    		font-size: 14px;
		}
	}
	.uni-form-item {
		margin-bottom: 30rpx;
		.signature{
			background: #f7f7f7;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10rpx;
			height: 300rpx;
			width: 100%;
			text{
				font-size: 26rpx;
				color: #a8a8a8;
			}
		}
		&:first-child {
			margin-top: 10rpx;
		}

		&:last-child {
			margin-bottom: 0;
		}

		.uni-form_row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #f7f7f7;
			border-radius: 8rpx;
			padding: 20rpx;

			.arrow {
				margin-left: 10rpx;
			}

			.uni-form_row_flex {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.uni-form-flex_title {
					font-weight: bold;
					width: 140rpx;
					flex-shrink: 0;
				}

				.uni-form-flex_content {
					width: 450rpx;
					text-align: right;
					@include toe();
				}

				view {
					font-size: 28rpx;
					color: #000000;
				}

				.uni-form_row-title {
					color: #a8a8a8;
				}
			}
			
		}
	}

	.status-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 60rpx;

		.title {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
			line-height: 34rpx;
		}
	}
</style>
