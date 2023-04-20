<template>
	<view class="add-record">
		<view class="form-contian">
			<view class="item-form">
				<view class="item-title">沟通方式</view>
				<view class="communicate-type">
					<view class="item-communicate-type"
						:class="[index == communicateTypeIndex ? 'item-communicate-type-active':'' ]"
						v-for="(item,index) in communicateType" :key="index" @click="getCommunicateType(index)">
						<text class="item-name">{{item.name}}</text>
						<text class="item-desc">{{item.desc}}</text>

						<view class="selected-type" v-if="communicateTypeIndex == index">
							<u-icon name="checkmark" class="decoration-checkmark-icon" color="#fff" size="24">
							</u-icon>
						</view>
					</view>
				</view>
			</view>

			<view class="item-form">
				<view class="item-accept-contian">
					<text class="item-label">接单意愿</text>
					<view class="item-right">
						<text class="item-switch" :class="[ isAccept ? '':'item-switch-warring']">
							{{ isAccept　? '愿意':'不愿意' }}</text>
						<u-switch v-model="isAccept" active-color="#002FA5" inactive-color="#FF5D35" size=26 />
					</view>
				</view>

				<view class="no-accept" v-if="!isAccept">
					<u-radio-group v-model="form.intention" @change="radioGroupChange">
						<u-radio @change="radioChange" active-color="#002FA5" v-for="(item, index) in intentionType"
							:key="index" :name="item.value">
							<text class="item-radio-default"
								:class="[form.intention == item.value ? 'item-radio-text-active':'item-radio-text' ]">{{item.name}}</text>
						</u-radio>
					</u-radio-group>
				</view>
			</view>

			<view class="item-form renovation-contain" v-if="isAccept">
				<view class="item-title">装修类型</view>
				<view class="item-list">
					<view class="item-contian" v-for="(item,index) in reasonList" :key="index"
						:class="[ reasonListIndex == index ? 'item-contian-active':'']" @click="getReasonList(index)">
						<text class="item-text">{{item.label}}</text>
						<view class="selected-type" v-if="reasonListIndex == index">
							<u-icon name="checkmark" class="decoration-checkmark-icon" color="#fff" size="24">
							</u-icon>
						</view>
					</view>
				</view>
			</view>

			<view class="desc-contian">
				<text class="public-name">沟通详情</text>
				<view class="public-item-bottom">
					<u-input v-model="form.description" class="describe-input" maxlength="200" height="180"
						type="textarea" placeholder="请输入沟通详情" :border="true" />
				</view>
				<view class="images-contain">
					<image-upload-new :uploadType="uploadType" :count="9" v-model="fileImage" />
				</view>

				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
		</view>

		<view class="bottom-contain">
			<view class="button-list" :class="[setClass]">
				<view class="item-button"
					:class="[item.active ? 'item-button-active':'',item.activeBorder ? 'item-button-border-active':'']"
					v-for="(item,index) in buttonList" :key="index" @click="getButton(item)"> {{item.name}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				modelShow: false,
				uploadType: ['图片', '视频'],
				modelTitle: '沟通意向',
				modelHeight: '650',
				modelTextShow: false,
				buttonList: [{
					name: '取消',
					activeBorder: true
				}, {
					name: '提交',
					active: true
				}],
				communicateTypeIndex: 0,
				communicateType: [{
					name: '线下沟通',
					desc: '电话或面对面沟通',
					value: 1,
				}, {
					name: '线上沟通',
					desc: '通过在线聊天沟通',
					value: 0,
				}],
				intentionTypeIndex: -2,
				isAccept: true,
				intentionType: [
					// {
					// 	name: '愿意接单',
					// 	typeName: '愿意接单',
					// 	value: 1
					// },
					{
						name: '不是平台单',
						typeName: '不愿意接单',
						value: 0
					}, {
						name: '个人原因不能接单',
						typeName: '不愿意接单',
						value: -1
					}
				],
				fileAudio: '',
				fileImage: '',
				attachment: [],
				curIndex: -1,
				reasonList: [],
				intention: '请选择沟通意向',
				abandonedReason: '请选择或填写原因',
				reasonListIndex: 0,
				noPlatformList: [],
				personalList: [],
				form: {
					abandonedReason: '', //	弃单原因			
					annex: '', //	描述附件			
					description: '', //	详情			
					intention: 1, //	沟通意向（1愿意接单，0不是平台单，-1个人弃单）			
					offerId: '', //	竞价id			
					orderId: '', //	订单id			
					remark: '', //	备注			
					requirementType: '', //	需求类型：1=装修，2=维修，3=安装，4=设计，5=其他			
					requirementTypeName: '', //	需求类型名称			
					type: 1, //	沟通方式(0线上沟通，1线下沟通)			
				}
			}
		},
		computed: {
			setClass() {
				// #ifdef H5
				return 'button-list-android'
				// #endif
				// #ifdef APP-PLUS
				let platform = uni.getSystemInfoSync().platform
				return platform == 'android' ? 'button-list-android' : ''
				// #endif
			},
		},
		watch: {
			isAccept: {
				handler(newVal, oldVal) {
					if (newVal) {
						this.form.intention = 1
						this.getRequirementList()
					} else {
						this.form.requirementType = ''
						this.form.requirementTypeName = ''
						this.reasonListIndex = 0
						this.form.intention = 0
					}
				},
				deep: true
			},
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getRequirementList()
		},
		methods: {
			getRequirementList() {
				this.$httpApi.getDicType({
					type: 'order_requirement_type',
				}).then(res => {
					if (res) {
						this.reasonList = res
						if (res.length > 0) {
							this.form.requirementType = this.reasonList[0].value
							this.form.requirementTypeName = this.reasonList[0].label
						}
					}
				})

				return
				// 不是平台单 字典
				this.$httpApi.getDicType({
					type: 'communication_no_platform'
				}).then(res => {
					if (res) {
						this.noPlatformList = res
					}
				})

				// 个人原因 字典
				this.$httpApi.getDicType({
					type: 'communication_personal'
				}).then(res => {
					if (res) {
						this.personalList = res
					}
				})
			},
			setParameter() {
				this.form.offerId = this.option.offerId
				this.form.orderId = this.option.orderId
			},
			getCommunicateType(index) {
				this.communicateTypeIndex = index
				this.form.type = this.communicateType[index].value
			},
			radioGroupChange() {

			},
			radioChange() {

			},
			getReasonList(index) {
				this.reasonListIndex = index
				this.form.requirementType = this.reasonList[index].value
				this.form.requirementTypeName = this.reasonList[index].label
			},
			async chooseVoice(file) {
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.fileAudio = temp
				} else {
					this.fileAudio = ''
				}
			},
			getButton(type) {
				if (type == '取消') {
					this.goBack()
				} else {
					this.attachment = []
					let tempImages = JSON.parse(this.fileImage)
					if (tempImages.length > 0) {
						tempImages.forEach(el => {
							this.attachment.push({
								name: '',
								timeLength: '',
								type: this.$setFileType(el.url),
								url: el.url
							})
						})
					}

					if (this.fileAudio) {
						this.attachment.push({
							name: '',
							timeLength: this.fileAudio.timeLength,
							type: this.fileAudio.type,
							url: this.fileAudio.url
						})
					}

					if (this.attachment.length > 0) {
						this.form.annex = JSON.stringify(this.attachment)
					}

					if (!this.form.offerId || !this.form.orderId) {
						console.error('offerId或者orderId能为空')
						return
					}
					this.$httpApi.addCommunicationByOffer(this.form).then(res => {
						if (res) {
							this.$util.toast("操作成功，将返回上一页~");
							setTimeout(() => {
								this.goBack()
							}, 300)
						}
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.public-item-bottom {
		background-color: #F7F7F7;
		margin-top: 32rpx;
		border-radius: 10rpx;

		.u-input {
			border: 0rpx;
		}
	}

	.add-record {
		padding: 12rpx 0rpx 160rpx 0rpx;

		.form-contian {
			margin: 0 20rpx;
		}


		.item-form {
			border-radius: 10rpx;
			background: #FFFFFF;
			margin-bottom: 2rpx;
			padding: 28rpx 40rpx;

			.item-title {
				color: #333333;
				font-size: 28rpx;
				font-weight: bold;
			}

			.item-accept-contian {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item-label {
					color: #333333;
					font-size: 28rpx;
					font-weight: bold;
				}

				.item-right {
					display: flex;
					align-items: center;
				}

				.item-switch {
					margin-right: 8rpx;
					color: #002FA5;
					font-size: 28rpx;
				}

				.item-switch-warring {
					margin-right: 8rpx;
					color: #FF5D35;
					font-size: 28rpx;
				}
			}

			.no-accept {
				padding-top: 30rpx;

				.item-radio-text {
					font-size: 28rpx;
					color: #666666;
				}

				.item-radio-text-default {
					font-size: 28rpx;
				}

				.item-radio-text-active {
					font-size: 28rpx;
					color: #002FA5;
				}

				.u-radio-group {
					// width: 100%;
					display: flex;
					justify-content: space-between;

					.u-radio {
						display: flex;
						flex: 1 !important;

						&:last-child {
							justify-content: end;
							
							/deep/ .u-radio__label{
								margin-right: 0rpx ;
							}
						}
					}
				}
			}

			.communicate-type {
				margin-top: 18rpx;
				display: flex;
				justify-content: space-between;

				.item-communicate-type {
					display: flex;
					flex-direction: column;
					background-color: #F6F6F6;
					border-radius: 10rpx;
					border: 2rpx solid #EEEEEE;
					width: 300rpx;
					height: 124rpx;
					padding: 22rpx 26rpx;


					.item-name {
						color: #303133;
						font-size: 26rpx;
						line-height: 36rpx;
						margin-bottom: 2rpx;
					}

					.item-desc {
						color: #909199;
						font-size: 24rpx;
						line-height: 32rpx;
					}
				}

				.item-communicate-type-active {
					border: 2rpx solid #002FA5;
					position: relative;
					overflow: hidden;
					box-sizing: border-box;

					.item-name {
						color: #002FA5;

					}

					.item-desc {
						color: rgba(0, 47, 165, 0.7);

					}

					.selected-type {
						width: 0;
						height: 0;
						border-bottom: 44rpx solid $themeColor;
						border-left: 44rpx solid transparent;
						position: absolute;
						right: 0rpx;
						bottom: 0rpx;


						.decoration-checkmark-icon {
							position: relative;
							bottom: -10rpx;
							right: 24rpx;
							transform: scale(0.8);
						}
					}
				}
			}

			.input-contain {
				display: flex;
				justify-content: space-between;
				margin-top: 8rpx;

				text {
					font-size: 26rpx;
					line-height: 36rpx;
					color: #909199;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

		}

		.renovation-contain {
			padding: 28rpx 0rpx 28rpx 32rpx;

			.item-list {
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;

				.item-contian {
					border-radius: 10rpx;
					padding: 16rpx 46rpx;
					border: 2rpx solid #D9D9D9;
					margin: 0rpx 12rpx 12rpx 0rpx;

					.item-text {
						color: #666666;
						font-size: 28rpx;
					}

					&:nth-of-type(4n) {
						// margin-right: 0rpx;
					}
				}

				.item-contian-active {
					border: 2rpx solid #002FA5;
					position: relative;
					box-sizing: border-box;

					.item-text {
						color: #002FA5;
					}

					.selected-type {
						width: 0;
						height: 0;
						border-bottom: 44rpx solid $themeColor;
						border-left: 44rpx solid transparent;
						position: absolute;
						right: 0rpx;
						bottom: 0rpx;


						.decoration-checkmark-icon {
							position: relative;
							bottom: -10rpx;
							right: 24rpx;
							transform: scale(0.8);
						}
					}
				}
			}
		}

		.desc-contian {
			border-radius: 10rpx;
			background: #FFFFFF;
			padding: 24rpx 32rpx 38rpx 34rpx;
			margin-top: 4rpx;
			margin-bottom: 8rpx;

			.public-name {
				color: #333333;
				font-size: 28rpx;
				font-weight: bold;
			}

			.item-desc {
				font-size: 28rpx;
				color: #303133;
				margin-bottom: 14rpx;
				display: inline-block;
			}

			.images-contain {
				margin-top: 26rpx;
				margin-bottom: 26rpx;
			}


		}

		.bottom-contain {
			width: 100%;
			position: fixed;
			bottom: 0rpx;
			background-color: #FFF;
			z-index: 10;
			// box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			display: flex;
			align-items: center;



			.button-list {
				display: flex;
				padding: 20rpx 20rpx 0rpx 20rpx;
				flex: 1;

				.item-button {
					// width: 164rpx;
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;

					height: 84rpx;
					border-radius: 10rpx;
					background: #FFFFFF;
					box-sizing: border-box;
					border: 1px solid #EEEEEE;
					margin-right: 14rpx;
					color: #303133;
					font-size: 28rpx;

					&:last-child {
						margin-right: 0rpx;
					}
				}

				.item-button-active {
					// width: 164rpx;
					height: 84rpx;
					border-radius: 10rpx;
					background: #002FA5;
					box-sizing: border-box;
					border: 1px solid #fff;
					margin-right: 14rpx;
					text-align: center;
					line-height: 84rpx;
					font-size: 28rpx;
					color: #fff;
				}

				.item-button-border-active {
					border: 2rpx solid #002FA5;
					color: #002FA5;
				}
			}

			.button-list-android {
				padding: 20rpx;
			}
		}

		.intention-contian {
			padding: 20rpx 0rpx 0rpx 0rpx;
			display: flex;
			flex-direction: column;

			.item-intention {
				border-radius: 6rpx;
				opacity: 1;
				background: #F6F6F6;
				padding: 16rpx 20rpx;
				border: 1px solid #fff;
				margin-right: 32rpx;
				position: relative;

				text {
					font-size: 26rpx;
					color: #303133;
				}

				.selected-type {
					width: 0;
					height: 0;
					border-bottom: 36rpx solid $themeColor;
					border-left: 36rpx solid transparent;
					position: absolute;
					right: 0rpx;
					bottom: 0rpx;


					.decoration-checkmark-icon {
						position: relative;
						bottom: -8rpx;
						right: 24rpx;
						transform: scale(0.8);
					}
				}
			}

			.item-intention-active {
				border: 1px solid #002FA5;

				text {
					font-size: 26rpx;
					color: #002FA5;
				}
			}

			.item-intention-contain {
				margin-bottom: 40rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.item-title {
					color: #333333;
					font-size: 28rpx;
					margin-bottom: 20rpx;
				}

				.item-intention-list {
					display: flex;

				}
			}

		}

		.form-contain {
			height: 100%;
			background-color: #FFF;

			.title {
				text-align: center;
				padding: 36rpx 0rpx;
				border-bottom: 2rpx solid #EEEEEE;
				color: $seconFontColor;
			}

			.contain-all {
				height: calc(100% - 280rpx);

				.scroll-y-contian {
					height: 100%;
					padding: 0 60rpx;
				}

				.scroll-Y {
					height: 100%;
				}

				.content-main_res_list {
					max-height: 300rpx;

					.content-main_res {
						display: flex;
						align-items: center;
						margin-top: 52rpx;

						.radio {
							width: 36rpx;
							height: 36rpx;
							border-radius: 50%;
							border: 4rpx solid #BDBDBD;
							margin-right: 30rpx;
						}

						.radioSelect {
							border: 4rpx solid #002FA5;
							position: relative;


							&::before {
								content: '';
								position: absolute;
								width: 20rpx;
								height: 20rpx;
								border-radius: 50%;
								background: #002FA5;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
							}
						}

						.reason {
							color: #141414;
							font-size: 26rpx;
						}
					}
				}



			}

			.images-contain {
				padding: 0 32rpx;
			}

			.bottom-add {
				position: fixed;
				bottom: 40rpx;
				display: flex;
				justify-content: center;
				width: 100%;
				padding: 0 60rpx;

				.item-add {
					height: 88rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: $themeColor;
					border-radius: $miniBorderRadius;
					color: #fff;
					flex: 1;
				}

				.item-delete {
					height: 88rpx;
					color: #909199;
					font-size: 28rpx;
					border-radius: 10rpx;
					background: #E5E5E5;
					text-align: center;
					line-height: 88rpx;
					width: 250rpx;
					margin-right: 26rpx;
				}
			}
		}

	}
</style>
