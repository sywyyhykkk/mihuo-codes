<template>
	<view class="information-page">
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<z-nav-bar bgColor="#002FA5" fontColor="#FFFFFF">
			<view class="nav-bar" slot="default">
				{{title}}
			</view>
		</z-nav-bar>
		<view class="contain">
			<view class="workers-type" v-show="option.name === '工人' && workTypeList.length > 0">
				<view class="workers-type-item-label"><text class="must-be">*</text>选择工种</view>
				<view class="workers-type-item-value">
					<view v-for="(item, index) in workTypeList" :key="index" @click="workersType(item,index)"
						:style="{opacity: item.disabled ? 0.2 : 1} " class="workers-type-item"
						:class="[workTypeIndex === index ? 'workers-type-item-active':'']">{{ item.skillName }}
						<view class="selected" v-show="workTypeIndex === index && !item.disabled ">
							<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<u-form :model="form" ref="uForm" class="form-page" :class="{ other: option.name !== '工人' }">
				<view class="form-item">
					<view class="form-page-item">
						<view class="form-lable" :class="{ otherLable: option.name !== '工人' }"><text
								class="must-be">*</text>从业年限</view>
						<u-cell-item border=true :label='yearsLable' @click="yearsShowLoading=true" class="nav_list1">
							<u-action-sheet @click="getYears" :list="yearList" v-model="yearsShowLoading">
							</u-action-sheet>
						</u-cell-item>
					</view>
					<view class="form-page-item">
						<view class="form-lable"><text class="must-be">*</text>工作类型</view>
						<u-cell-item border=true :label='workLabel' @click="workShowLoading=true" class="nav_list1">
							<u-action-sheet @click="getWorkList" :list="workList" v-model="workShowLoading">
							</u-action-sheet>
						</u-cell-item>
					</view>
					<view class="form-page-item">
						<view class="form-lable"><text class="must-be">*</text>是否有资格证书</view>
						<u-cell-item :borderBottom="false" border=true :label='certificateLable'
							@click="certificateShowLoading=true" class="nav_list1">
							<u-action-sheet @click="getCertificate" :list="certificateList"
								v-model="certificateShowLoading">
							</u-action-sheet>
						</u-cell-item>
					</view>
				</view>
				<view class="form-item form-item-padding-top">
					<view class="form-page-item">
						<view class="form-lable">资格证书</view>
						<text class="form-lable-text">请上传清晰完整的照片</text>
						<image-upload-new :count="2" v-model="form.certificateImage" />
					</view>
				</view>
				<view class="form-item form-item-padding-top">
					<view class="form-page-item">
						<view class="form-lable">我的工地</view>
						<text class="form-lable-text">请上传清晰完整的照片</text>
						<image-upload-new :count="3" v-model="form.projectImage" />
					</view>
				</view>
				<view class="form-item form-item-padding-top introduce-item">
					<view class="form-page-item">
						<view class="form-lable introduce">自我介绍</view>
						<u-input v-model="form.selfIntroduce" height="190" type="textarea" placeholder="请填写自我介绍"
							:custom-style="{paddingLeft:'20rpx'}" />
					</view>
				</view>
			</u-form>
		</view>
		<bottom-button title="确认提交" @click="saveForm()"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					selfIntroduce: '', // 自我介绍
					skillYearNum: '', // 从业年限
					workType: '', // 工作类型
					certificateFlag: '', // 是否有资格证书 0 暂无  1 有
					certificateImage: '', // 资格证书照片
					projectImage: '', // 项目照片
					skillId: '', // 工种id
					skillName: '', // 工种name
					jobCode: '',
					cityOperatorId:uni.getStorageSync('cityOperatorId'),
				},
				rules: {
					name: [{
						required: false
					}, ],
					selfIntroduce: [{
						required: false
					}, ]
				},
				option: {},
				workShowLoading: false, // 选择工作类型弹窗
				certificateShowLoading: false, // 选择是否有无资格证书弹窗
				yearsShowLoading: false, // 选择工作年限弹窗
				certificateList: [{
					text: '有',
				}, {
					text: '暂无'
				}], // 是否有资格证书
				workList: [{
					text: '全职',
				}, {
					text: '兼职'
				}], // 工作类型
				yearList: [{
					text: '一到三年',
				}, {
					text: '三到五年'
				}, {
					text: '五年以上'
				}],
				workTypeList: [],
				workTypeIndex: -1,
				workLabel: '请选择全职或兼职',
				certificateLable: '请选择是否有资格证书', // 0 暂无  1 有
				yearsLable: '请输入从业年限',
				userPersonList: uni.getStorageSync('userSetting').personageList || [],
				isNeedCertification: false,
				title: ''
			}
		},
		onLoad(option) {
			this.option = option
			this.form.jobCode = this.option.jobCode
			if (option.name === '工人') {
				this.title = `工人技能认证`
				this.getWorkTypeList()
			} else {
				this.form.skillId = this.option.skillId
				this.form.skillName = this.option.skillName
				this.title = `${this.form.skillName}技能认证`
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.form);
		},
		onUnload() {
			uni.$off('saveCertification')
		},
		methods: {
			getYears(index) {
				this.yearsLable = this.yearList[index].text
				this.form.skillYearNum = this.yearsLable
			},
			getWorkList(index) {
				this.workLabel = this.workList[index].text
				this.form.workType = index
			},
			getCertificate(index) {
				this.certificateLable = this.certificateList[index].text
				this.form.certificateFlag = this.certificateLable === '有' ? 1 : 0
			},
			workersType(item, index) {
				if (item.disabled) {
					return
				}
				this.workTypeIndex = index
				this.form.skillId = item.skillId
				this.form.skillName = item.skillName
				if (item.skillName.includes('电')) {
					// 如果是电工相关工种, 则要求上传资格证书
					this.isNeedCertification = true
				} else {
					this.isNeedCertification = false
				}
			},
			getWorkTypeList() {
				this.$httpApi.getWorkType({
					type: 2, // 工人
					clientType: 'platform',
					size: 999
				}).then(res => {
					let indexFlag = false
					let index = 0
					res.records.forEach((item, num) => {
						let obj
						let flag = this.userPersonList.find(up => up.skillId === item.skillId)
						if (flag && (flag.auditStatus == 2 || flag.auditStatus == 0)) {
							// 已认证过该工种
							obj = {
								disabled: true,
								...item
							}
						} else {
							obj = {
								disabled: false,
								...item
							}
							if (!indexFlag) {
								this.form.skillId = item.skillId
								this.form.skillName = item.skillName
								this.form.jobCode = item.jobCode
								this.workTypeIndex = index

								indexFlag = true
							}
							if (this.option.skillId) {
								if (item.skillId == this.option.skillId) {
									this.form.skillId = item.skillId
									this.form.skillName = item.skillName
									this.form.jobCode = item.jobCode
									this.workTypeIndex = num
								}
							}
						}
						if (obj.jobCode === 'JOB_WORKER') {
							this.workTypeList.push(obj)
						}
						index++
					})
				})
			},
			saveForm() {
				if (!this.form.skillYearNum) {
					this.$util.toast('请选择从业年限');
					return
				}
				if (this.form.workType === '') {
					this.$util.toast('请选择工作类型');
					return
				}
				if (this.form.certificateFlag === '') {
					this.$util.toast('请选择是否有资格证书');
					return
				}

				if (this.form.skillName.includes('电')) {
					this.isNeedCertification = true
				} else {
					this.isNeedCertification = false
				}

				if (this.isNeedCertification && this.form.certificateImage == '[]') {
					this.$util.toast(`请上传${this.form.skillName}资格证书`);
					return
				}
				if (this.form.certificateFlag === 1 && this.form.certificateImage == '[]') {
					// 如果有资格证书, 则要求上传资格证书
					this.$util.toast('请上传资格证书');
					return
				}
				if (!this.$checkUploadProcess(this.form.certificateImage) || !this.$checkUploadProcess(this.form
						.projectImage)) {
					// 图片还没上传完
					return
				}
				this.$httpApi.applyToSkillAuth({
					...this.form,
				}).then(res => {
					if (res) {
						uni.navigateTo({
							url: '/pages/certification/results'
						});
					}
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	$orangeColor:linear-gradient(90deg, $themeColor 10%, $themeColor 100%);

	@import '@/style/mixin.scss';

	.nav-bar {
		@include nav-bar-title(#FFFFFF)
	}

	/deep/ .u-input {
		background: #F7F7F7;

		.uni-textarea-textarea {
			color: #000000;
		}
	}

	.information-page {
		.workers-type {
			display: flex;
			flex-direction: column;
			padding: 0rpx 20rpx;
			background-color: #FFFFFF;
			margin-top: 16rpx;
			padding-bottom: 46rpx;
		}

		.must-be {
			color: $errorColor;
		}

		.checkmark-icon {
			position: relative;
			top: 12rpx;
			left: -24rpx;
			transform: scale(0.8);
		}

		.workers-type-item-label {
			margin: 36rpx 0 32rpx 0;
		}

		.workers-type-item-value {
			.workers-type-item {
				font-size: 28rpx;
				font-weight: bold;
				color: #666666;
				// padding: 24rpx 70rpx;
				min-width: 210rpx;
				height: 86rpx;
				text-align: center;
				line-height: 86rpx;
				display: inline-block;
				text-align: center;
				border-radius: 10rpx;
				border: 1rpx solid #E5E5E5;
				margin-bottom: 20rpx;
				position: relative;
				margin-right: 20rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding: 0 20rpx;

				&:nth-of-type(3n) {
					// margin-right: 0rpx;
				}
			}

			.workers-type-item-active {
				border: 2rpx solid #002FA5;
				color: #002FA5;
			}

			.selected {
				width: 0;
				height: 0;
				border-bottom: 44rpx solid $themeColor;
				border-left: 44rpx solid transparent;
				position: absolute;
				right: 0rpx;
				bottom: 0rpx;

				.checkmark-icon {
					top: -12rpx;
				}
			}
		}

		.other {
			margin-top: 16rpx;
		}

		.otherLable {
			padding-top: 30rpx;
		}

		.form-page {

			.form-item {
				margin-bottom: 10rpx;
				background-color: #FFFFFF;

				.form-page-item {

					&:last-child {
						border: 0;
					}
				}
			}

			.introduce-item {
				padding-bottom: 40rpx;
			}

			.form-item-padding-top {
				padding-top: 30rpx;
				padding-bottom: 32rpx;
			}

			.introduce {
				margin-bottom: 20rpx;
			}

			.form-page-item {
				border-bottom: 1rpx solid #EEEEEE;
				margin: 0 40rpx 32rpx 40rpx;

				.form-lable-text {
					font-size: 28rpx;
					color: #909399;
					display: inline-block;
					margin: 6rpx 0 14rpx 0;
				}

				&:last-child {
					margin-bottom: 0px;
				}

				.u-cell {
					padding: 12rpx 0 36rpx 0;
				}

				.u-cell__label {
					color: #000000;
				}
			}
		}

		.next-form {
			background: $orangeColor;
			border-radius: 10px;
			text-align: center;
			padding: 24rpx 0;
			color: #FFFFFF;
		}

		.contain-bottom {
			padding: 50rpx 64rpx 64rpx 50rpx;
		}
	}
</style>
