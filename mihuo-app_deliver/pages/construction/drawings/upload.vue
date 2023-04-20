<template>
	<view class="upload-page">
		<public-module></public-module>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar-title">
				{{title}}
			</view>
		</z-nav-bar>
		<view class="title" v-if="isShowTabs">
			选择类型
		</view>
		<view class="options-container" v-if="isShowTabs">
			<view class="type_view flex-center">
				<view class="type_item"
					:class="[typeCurrent === index ? 'isSelect' : '',item.disableButton ? 'type-active':'type-disable']"
					v-for="(item, index) in optionsList" :key="index" @click="selectType(item, index)">{{item.label}}
				</view>
			</view>
		</view>
		<u-select selectAreaHeight="" v-model="showGroups" mode="single-column" :list="groups" @confirm="confirmGroup">
		</u-select>
		</u-picker>
		<view class="group flex-center" v-if="isShowTabs" @click="setShowGroups">
			<view class="left">
				分组
			</view>
			<view class="right">
				<view v-if="option.isShowTabs === 'false' && option.groupName !== '' " class="item-imageGroup">
					{{uploadImageGroup}}
				</view>
				<view v-if="option.isShowTabs === 'false' && option.groupName === '' " class="item-imageGroup">
					{{ uploadImageGroup !== '' ? uploadImageGroup : '请选择分组'}}
				</view>
				<view v-if="option.isShowTabs === 'true'" class="upload-imageGroup">
					<u-input v-model="uploadImageGroup" placeholder="请输入分组名称" input-align="right" :clearable="false"
						:showLength="true" type="text" height="88" :border="false" />
				</view>
			</view>
		</view>
		<view class="input-container flex-center">
			<view class="img-area">
				<view class="title2">上传文件</view>
				<view class="image-contain">
					<image-upload-new :uploadType="uploadType" v-model="fileJson" style="margin-top: 20rpx;" />
				</view>
			</view>
			<view class="input-area">
				<view class="title2">
					备注
				</view>
				<view class="input-field">
					<u-input v-model="note" placeholder="请输入备注" :clearable="false" :showLength="true" type="textarea"
						maxlength="200" height="88" :border="true" />
				</view>
			</view>
		</view>
		<view class="btn-contain">
			<view class="item-btn" @click="uploadFile" :style="`opacity: ${loading ? 0.5 : 1}`">
				上传
			</view>
		</view>
		<!-- <view class="btn-contain" @click="uploadFile" :style="`opacity: ${loading ? 0.5 : 1}`">
			上传
		</view> -->
	</view>
</template>

<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				title: '上传文件',
				isShowTabs: false,
				showGroups: false,
				typeCurrent: 0,
				optionsList: [],
				uploadGroup: '', // 上传文件类型 如户型图 剖面图等
				uploadImageGroup: '', // 图片类型 如餐厅图 客厅图等
				imgObject: {}, // 图片
				note: '', // 备注
				uploadType: ['文件','电脑快传'],
				groups: [],
				defaultIndex: [],
				loading: true,
				isEditable: true,
				option: {},
				randomTimer: null,
				time: 0,
				personId: '',
				current: 0,
				fileJson: '',
				nodeId: '',
				drawingsType: [{
						name: '上传图片',
						value: 0
					},
					{
						name: '上传附件',
						value: 1
					}
				],
			}
		},
		watch: {
			fileJson() {
				if (!this.fileJson || !this.uploadImageGroup) {
					this.loading = true
				} else {
					this.loading = false
				}
			},
			uploadImageGroup() {
				if (!this.fileJson || !this.uploadImageGroup) {
					this.loading = true
				} else {
					this.loading = false
				}
			}
		},
		onLoad(option) {
			this.option = option
			if (option.options) {
				JSON.parse(option.options).forEach((item, index) => {
					this.groups.push({
						label: item.name,
						value: index
					})
				})
			}

			// 如果已上传过图片
			if (option.itemName) {
				this.uploadImageGroup = option.itemName
				this.isEditable = false
			}

			//默认选中分组的第一个数据
			if (this.isEditable) {
				if (option.isShowTabs !== 'true') {
					this.uploadImageGroup = this.groups[0].label
				}
			}
			if (option.isShowTabs !== 'true') {
				this.isShowTabs = false
				this.title = option.itemName
			} else {
				this.isShowTabs = true
			}
			this.setParameters()

		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'remainingDays', 'examineType'])
		},
		methods: {
			setParameters() {
				this.nodeId = this.nodeInfo.nodeId
				this.personId = this.userPersonInfo.personId
				this.projectId = this.projectInfo.projectId
				this.getType();
				this.setTypeId()
			},
			change(index) {
				this.current = index
				if (this.current) {
					this.attachment = this.tempAttachment
				}
			},
			setTypeId() {
				if (this.option.valueId) {
					this.optionsList.map((item, index) => {
						if (item.value == this.option.valueId) {
							this.typeCurrent = index
						} else {
							if (this.option.isShowTabs === 'false') {
								item['disableButton'] = false
							} else {
								item['disableButton'] = true
							}

						}
					})
				}
			},
			setShowGroups() {
				if (this.option.isShowTabs === 'false') {
					if (this.option.itemName) {
						this.showGroups = false
					} else {
						this.showGroups = !this.showGroups
					}
				}
			},
			confirmGroup(el) {
				if (!this.isEditable) {
					return
				}
				this.uploadImageGroup = el[0].label
			},
			selectType(item, index) {
				if (item.disableButton) {
					this.typeCurrent = index;
					this.uploadGroup = item.value;
				}
			},
			getType() {
				this.optionsList = uni.getStorageSync('SOP_UPLOAD_FILE_TYPE') || [];
				this.optionsList.map(item => {
					item['disableButton'] = true
				})
				// if (this.option.isShowTabs === 'false') {
				// 	this.uploadGroup = this.option.valueId
				// } else {
				// 	this.uploadGroup = this.optionsList[0].value
				// }
				this.uploadGroup = this.option.valueId
			},
			uploadImg(file) {
				this.imgObject = file;
			},
			uploadFile() {
				if (JSON.parse(this.fileJson).length == 0) {
					this.$util.toast('请选择文件');
					return
				}
				if (this.loading) {
					return
				}
				this.loading = true
				if (!this.$checkUploadProcess(this.fileJson)) {
					return
				}
				this.sopuploadNodeUploadfile()
			},
			sopuploadNodeUploadfile() {
				let tempUploadItemList = this.fileJson !== '' ? JSON.parse(this.fileJson) : []
				this.$httpApi.sopuploadCreate({
					groupName: this.uploadImageGroup,
					nodeId: this.option.isShowTabs === 'false' ? this.nodeId : null,
					personId: this.personId,
					projectId: this.projectId,
					type: 1,
					uploadGroup: this.uploadGroup,
					remark: this.note,
					uploadItemList: tempUploadItemList
				}).then(res => {
					this.loading = false;
					this.$util.toast('操作成功');
					setTimeout(() => {
						this.goBack()
					}, 1000);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.upload-page {
		// padding: 20rpx 0rpx 160rpx 0rpx;
		padding-top: 20rpx;
	}

	page {
		// padding: 0 20rpx;
	}

	/deep/ .u-drawer-content {
		background-color: #FFFFFF;
	}

	.loading {
		position: absolute;
		z-index: 999;
		width: 100%;
		height: 100vh;
		top: 0px;
		background: #000000;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-bar-title {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: $mainFontSize;
		text-align: center;
		color: $seconFontColor;
	}

	.title {
		margin: 32rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: $middleFontSize;
		line-height: 40rpx;
		color: #303133;
	}

	.options-container {
		height: max-content;
		margin: 0 20rpx;
		background-color: $bgColor;
		border-radius: $miniBorderRadius;

		.type_view {
			height: max-content;
			padding: 24rpx;
			flex-wrap: wrap;

			.type_item {
				margin-bottom: 16rpx;
				border: 2rpx solid $borderColorEE;
				color: #303133;
				font-size: $middleFontSize;
				text-align: center;
				border-radius: $miniBorderRadius;
				padding: 16rpx 32rpx;
				margin-right: 20rpx;
			}

			.type-disable {
				opacity: 0.6;
			}

			.isSelect {
				border: 2rpx solid $themeColor;
				color: $themeColor;
				background-image: url(../../../static/icon/isselect.png);
				background-repeat: no-repeat;
				background-position: right bottom;
				background-size: auto;
			}
		}
	}

	.group {
		height: 124rpx;
		margin: 0 20rpx;
		margin-top: 2rpx;
		padding: 0 40rpx;
		background-color: $bgColor;
		border-radius: $miniBorderRadius;
		justify-content: space-between;

		.left {
			width: 50%;
			height: 36rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: $smiddleFontSize;
			line-height: 36rpx;
			color: $fontColor46E;
		}

		.right {

			.item-imageGroup,
			.upload-imageGroup {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: $middleFontSize;
				line-height: 36rpx;
				text-align: right;
				color: $fontColor99;
			}
		}
	}

	.input-container {
		width: 710rpx;
		height: max-content;
		margin: 2rpx 20rpx 0 20rpx;
		background-color: $bgColor;
		border-radius: $middleBorderRadius;
		padding: 20rpx 0;
		padding-bottom: 0;
		flex-direction: column;

		.title2 {
			width: 100%;
			height: 36rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: $smiddleFontSize;
			line-height: 36rpx;
			color: $fontColor46E;
		}

		.img-area {
			width: 100%;
			min-height: 200rpx;
			height: max-content;
			padding: 0 40rpx;
		}


		.input-area {
			width: 100%;
			min-height: 200rpx;
			height: max-content;
			padding: 0 40rpx;
			padding-bottom: 20rpx;
			margin-top: 20rpx;

			.input-field {
				width: 100%;
				min-height: 88rpx;
				height: max-content;
				margin-top: 20rpx;
			}
		}
	}

	.btn-contain {
		position: fixed;
		bottom: 0rpx;
		@include safearea();
		width: 100%;
		display: flex;
		justify-content: center;
		padding-bottom: 20rpx;

		.item-btn {
			width: 624rpx;
			height: 88rpx;
			border-radius: $miniBorderRadius;
			background-color: $themeColor;
			color: $bgColor;
			font-size: $middleFontSize;
			text-align: center;
			line-height: 88rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
		}


	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
