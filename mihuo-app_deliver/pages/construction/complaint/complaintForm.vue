<template>
	<view class="complaint-contain-all">
		<view class="complaint-contain">
			<!-- 显示整改问题详情 -->
			<view class="rectification-details-contain" v-if="rectificationDetailsStatus">
				<view class="title">{{rectificationDetails.contents}}</view>
				<view class="img-contain" v-if="rectificationDetails.pics">
					<image-show :imgSrc="rectificationDetails.pics" right="20"></image-show>
				</view>
				<view class="audio-contain" v-if="rectificationDetails.audio">
					<mihuo-audio :formDate="rectificationDetails.audio"></mihuo-audio>
				</view>
			</view>
			<!-- 显示罚款问题详情 -->
			<view class="punishment-contain" v-if="punishmentStatus">
				<view class="forfeit-logList" v-for="(item,index) in problemDetails.forfeitLogList" :key="index">
					<view class="title">{{item.name}}</view>
					<view class="item-contain">
						<view class="label">处罚金额 <text> {{item.money}}元</text></view>
						<view class="label">积分 <text>{{item.integral}}分</text></view>
						<view class="label">禁单天数 <text>{{item.day}}天</text></view>
					</view>
				</view>
				<view class="file" v-if="problemDetails.pics">
					<image-show :imgSrc="problemDetails.pics" right="20"></image-show>
				</view>
				<!-- <view class="punishment-type">
					<view class="title">申述类型</view>
					<u-radio-group v-model="form.applyType" width="25%">
						<u-radio @change="radioChange" v-for="(item, index) in applyNewTypeList" :key="index"
							:name="item.value">
							{{item.label}}
						</u-radio>
					</u-radio-group>
				</view> -->
			</view>
			<!-- 显示验收问题详情 -->
			<view class="rectification-details-contain" v-if="acceptanceDetailsStatus">
				<view class="title">{{acceptanceDetails.appendQues}}</view>
				<view class="img-contain" v-if="acceptanceDetails.standardImg">
					<image-show :imgSrc="acceptanceDetails.standardImg" right="20"></image-show>
				</view>
				<view class="audio-contain" v-if="acceptanceDetails.appendVoiceFile">
					<mihuo-audio :formDate="acceptanceDetails.appendVoiceFile"></mihuo-audio>
				</view>
			</view>
			<!-- 表单 -->
			<view class="complaint-type" v-if="!punishmentStatus" @click="getApplyListShow">
				<view class="item-label">{{typeNameStatus === true ? '申请类型':'申述类型' }}</view>
				<view class="item-value">
					<text>{{form.applyTypeName}}</text>
					<image src="/static/images/right-vector.png" mode=""></image>
				</view>
			</view>
			<view class="file-contain-all">
				<view class="text-contain">
					<view class="title-left">{{typeNameStatus === true ? '申请原因':'申述内容' }}</view>
					<u-input v-model="form.comment" class="describe-input" height="176" type="textarea"
						:placeholder=" typeNameStatus === true ? '请详细填写申请原因':'请详细填写申述内容' " :border="true" />
				</view>
				<view class="img-contain">
					<view class="title">上传图片</view>
					<image-upload-new :uploadType="uploadType" v-model="form.pics" />
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
			<view class="complaint-type" @click="getUser">
				<view class="item-label">发送至</view>
				<view class="item-value">
					<text>{{name}}</text>
					<image src="/static/images/right-vector.png" mode=""></image>
				</view>

			</view>
			<u-select v-model="show" :list="list" selectAreaHeight="" @confirm="confirm"></u-select>
		</view>
		<u-popup mode="bottom" v-model="applyListShow" close-icon-pos="top-right" border-radius="14">
			<view class="apply-list-contain">
				<view class="type-title">
					<view class="left" @click="applyListShow = false">取消</view>
					<view class="right">
						<view class="title">标题</view>
						<view class="determine" @click="determine">确定</view>
					</view>
				</view>
				<scroll-view :scroll-y="true" :scroll-with-animation="true" class="list-contain-all">
					<view class="list-contain">
						<view class="grouping-contain" v-for="(item,index) in applyTypeList" :key="index">
							<view class="name">{{item.title}}</view>
							<view class="options-list">
								<view class="options-item "
									:class="[activeIndex === el.value ? 'options-item-acitve':'']"
									v-for="(el,num) in item.list" :key="num" @click="getTypeActive(el.value)">
									{{el.name}}
									<text class="selected" v-show="activeIndex ===  el.value">
										<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24"></u-icon>
									</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<u-select v-model="appealTypeShow" :list="applyNewTypeList" selectAreaHeight="" @confirm="confirmAppealType">
		</u-select>

		<mihuo-bottom-button :buttonList="buttonList" @click="submit"></mihuo-bottom-button>
	</view>

</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				show: false,
				list: [{
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}
				],
				option: {},
				activeIndex: 0,
				uploadType: ['图片'],
				typeName: '请选择申述类型',
				applyListShow: false,
				appealTypeShow: false,
				applyTypeList: [],
				applyNewTypeList: [],
				name: '请选择人员',
				punishmentStatus: false,
				form: {
					desc: '',
					pic: '',
					applyType: '',
					applyTypeName: '',
					audio: '',
					businessId: '0', // 普通申述businessId为0
					classification: '',
					comment: '',
					projectId: '', // 订单id
					dealPersonId: '',
					dealUserId: '',
					execPersonId: '',
					pics: '',
					currSkillName: '', // 操作岗位
					currPersonName: '', // 操作岗位姓名
					currCityOperatorId: '' // 当前企业编号
				},
				typeNameStatus: false,
				problemDetails: {},
				rectificationDetails: {},
				rectificationDetailsStatus: false,
				acceptanceDetails: {},
				acceptanceDetailsStatus: false,
				projectId: '',
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getTypeName()
		},
		onShow() {
			uni.$on('checkList', (data) => {
				this.name = JSON.parse(data)[0].name
				this.form.dealPersonId = JSON.parse(data)[0].personId
				this.form.dealUserId = JSON.parse(data)[0].userId
			})
		},
		onUnload() {
			uni.$off('checkList')
		},
		computed: {
			...mapState(['projectInfo', 'userPersonInfo', 'orderInfo']),
			buttonList() {
				let buttonList = this.typeNameStatus ? [{
					name: '取消',
					status: false
				}, {
					name: '申请',
					status: true
				}] : [{
					name: '提交申述',
					status: true
				}]
				return buttonList
			}
		},
		methods: {
			setParameter() {
				this.form.projectId = this.projectInfo.projectId
				this.form.execPersonId = this.userPersonInfo.personId
				this.form.currSkillName = this.userPersonInfo.skillName
				this.form.currPersonName = this.userPersonInfo.name
				this.form.currCityOperatorId = this.orderInfo.cityOperatorId
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
			getTypeName() {
				if (uni.getStorageSync('typeName') === '申请') {
					this.typeNameStatus = true
					this.form.applyTypeName = '请选择申请类型'
				} else {
					this.typeNameStatus = false
					this.form.applyTypeName = '请选择申述类型'
				}

				if (this.option.punishment === '罚款') {
					this.punishmentStatus = true
					this.getOrderForfeit()
					this.form.businessId = this.option.id
				} else if (this.option.punishment === '整改') {
					this.punishmentStatus = true
					this.getRectification()
					this.form.businessId = this.option.id
				} else {
					this.punishmentStatus = false
				}
				if (this.typeNameStatus) {
					uni.setNavigationBarTitle({
						title: '申请'
					})
				} else {
					uni.setNavigationBarTitle({
						title: '申述'
					})
				}
				this.getDicType()
			},
			getDicType() {
				this.$httpApi.getDicType({
					type: this.typeNameStatus === true ? 'order_apply_type' : 'order_appeal_type'
				}).then(res => {
					if (res) {
						let tempNameList = []
						let tempTypeList = []
						this.applyNewTypeList = res
						// 回显选中 罚款、整改
						if (this.option.punishment) {
							this.form.applyType = this.applyNewTypeList.filter(item => item.label === this.option
								.punishment)[0].value
							this.form.applyTypeName = this.applyNewTypeList.filter(item => item.label === this
								.option.punishment)[0].label
						}

						// 用于对申请类型分组
						res.map(item => {
							if (tempNameList.indexOf(item.label) === -1) {
								tempNameList.push(item.label)
							}
						})
						tempNameList.map(el => {
							let tempListAll = []
							res.map(item => {
								if (el === item.label) {
									tempListAll.push({
										name: item.description,
										value: item.value
									})
								}
							})
							tempTypeList.push({
								title: el,
								list: tempListAll
							})
						})
						this.applyTypeList = tempTypeList
					}
				})
			},
			confirm(e) {
				this.typeName = e[0].label
			},
			getApplyListShow() {
				if (this.typeNameStatus === true) {
					this.applyListShow = true
				} else {
					this.appealTypeShow = true
				}
			},
			confirmAppealType(e) {
				this.form.applyTypeName = e[0].label
				this.form.applyType = e[0].value
			},
			radioChange(e) {
				this.form.applyTypeName = this.applyNewTypeList.filter(item => item.value === e)[0].label
			},

			getTypeActive(val) {
				this.activeIndex = val
			},
			determine() {
				this.form.applyType = this.applyNewTypeList.filter(item => item.value === this.activeIndex)[0].value
				this.form.applyTypeName = this.applyNewTypeList.filter(item => item.value === this.activeIndex)[0]
					.description
				// uni.setNavigationBarTitle({
				// 	title: this.form.applyTypeName
				// })
				this.applyListShow = false
			},
			getOrderForfeit() { // 罚款问题详情
				this.$httpApi.orderforfeitDetails({
					id: this.option.id
				}).then(res => {
					this.problemDetails = res
				})
			},
			getRectification() {
				if (this.option.typeName === '验收') { // 巡检整改问题详情
					this.$httpApi.getAcceptanceItemById({
						id: this.option.id
					}).then(res => { // 验收整改问题详情
						if (res) {
							this.acceptanceDetails = res
							this.acceptanceDetailsStatus = true
						}
					})
				} else {
					this.$httpApi.getCustomInspectById({
						id: this.option.id
					}).then(res => {
						if (res) {
							this.rectificationDetails = res
							this.rectificationDetailsStatus = true
						}
					})
				}
			},
			getUser() {
				this.toPage('/pages/publishTask/selectPick?pageType=团队成员&multiple=false&assign=1')
			},
			submit(item) {
				if (item.name === '取消') {
					uni.navigateBack()
					return
				}
				if (this.form.applyType === '' || this.applyTypeName === '') {
					this.$util.toast('请选择申' + `${this.typeNameStatus ? '请':'述'}` + '类型');
					return;
				}
				if (!this.form.comment) {
					this.$util.toast('请填写申' + `${this.typeNameStatus ? '请':'述'}` + '内容');
					return;
				}
				if (!this.form.dealPersonId) {
					this.$util.toast("请选择人员");
					return;
				}
				if (!this.$checkUploadProcess(this.form.pics)) {
					return;
				}
				this.form.classification = this.typeNameStatus === true ? 1 : 2
				if (this.option.id) {
					this.form.businessId = this.option.id
				}
				// 5001 罚款  5002 整改  字典需要同步到测试版跟正式版，否则会出错
				this.form.applyType = this.option.punishment === '罚款' ? 5001 : this.option.punishment === '整改' ? 5002 :
					Number(this.form.applyType)
				this.debounce(() => {
					this.$httpApi.getBizapplyCreate(this.form).then(res => {
						if (res) {
							this.$util.toast(`${this.typeNameStatus === true? '申请成功':'申述成功' }`);
							uni.navigateBack()
						}
					})
				}, 200)
			}

		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-radio-group {
		width: 100%;
	}



	/deep/ .u-select__header {
		background-color: #FFFFFF;
	}

	.complaint-contain-all {
		padding-bottom: 140rpx;
	}

	.punishment-contain {
		background-color: #FFFFFF;
		margin: 0rpx 20rpx 0rpx 20rpx;
		padding: 30rpx 40rpx 30rpx 40rpx;

		.forfeit-logList {
			margin-bottom: 20rpx;
		}

		.file {
			display: flex;
			flex-wrap: wrap;

			.item-image {
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
		}

		.item-contain {
			display: flex;

			.label {
				padding-left: 20rpx;
				font-size: 24rpx;
				color: #909199;

				text {
					padding-left: 10rpx;
					font-size: 24rpx;
					color: #ff5d35;
				}
			}
		}

		.title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333333;
			margin-bottom: 10rpx;
		}

		.file {
			margin-bottom: 46rpx;
			margin-top: 28rpx;
			padding-left: 20rpx;

			.record-item-img {
				width: 150rpx;

			}
		}

		.punishment-type {
			.title {
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
				margin-bottom: 28rpx;
			}
		}
	}

	.rectification-details-contain {
		background-color: #FFFFFF;
		margin: 0rpx 20rpx 4rpx 20rpx;
		padding: 30rpx 40rpx 30rpx 40rpx;

		.title {
			font-weight: bold;
			font-size: 30rpx;
			color: $seconFontColor;
			margin-bottom: 20rpx;
		}

		.img-contain {
			margin-bottom: 20rpx;
		}

		.audio-contain {
			// width: 500rpx;
		}
	}

	.apply-list-contain {
		background-color: #FFFFFF;
		padding: 48rpx 48rpx 56rpx 40rpx;

		.type-title {
			display: flex;
			justify-content: space-between;
			margin-bottom: 34rpx;

			.left {
				flex: 1;
				font-size: 28rpx;
				color: #909199;
			}

			.right {
				flex: 1;
				justify-content: space-between;
				display: flex;

				.title {
					font-weight: bold;
					font-size: 30rpx;
					color: $seconFontColor;
				}

				.determine {
					font-weight: bold;
					font-size: 28rpx;
					color: $themeColor;
				}
			}
		}

		.list-contain-all {
			height: 880rpx;
		}

		.grouping-contain {
			margin-bottom: 28rpx;

			.name {
				font-size: 28rpx;
				color: #909199;
				padding-left: 28rpx;
				margin-bottom: 28rpx;
			}

			.options-list {
				display: flex;
				flex-flow: wrap;
			}

			.options-item {
				display: flex;
				min-width: 210rpx;
				padding: 24rpx 0rpx;
				border: 2rpx solid #D9D9D9;
				font-size: 26rpx;
				color: #666666;
				justify-content: center;
				border-radius: 10rpx;
				margin-right: 10rpx;
				margin-bottom: 16rpx;

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.options-item-acitve {
				border: 2rpx solid $themeColor !important;
				color: $themeColor !important;
				position: relative;

				.selected {
					width: 0;
					height: 0;
					border-bottom: 44rpx solid $themeColor;
					border-left: 44rpx solid transparent;
					position: absolute;
					right: 0rpx;
					bottom: 0rpx;
				}

				.checkmark-icon {
					position: relative;
					top: 12rpx;
					left: -24rpx;
					transform: scale(0.8);
				}
			}
		}
	}

	.complaint-contain {
		padding-top: 16rpx;

		.complaint-type {
			display: flex;
			margin: 0rpx 20rpx 4rpx 20rpx;
			padding: 42rpx 40rpx 42rpx 36rpx;
			justify-content: space-between;
			background-color: #FFFFFF;
			border-radius: 5px;

			.item-label {
				font-weight: bold;
				font-size: 28rpx;
				color: #333333;
			}

			.item-value {
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					font-size: 28rpx;
					color: #909199;
					margin-right: 32rpx;
				}

				image {
					width: 14rpx;
					height: 26rpx;
				}

			}
		}

		.file-contain-all {

			margin: 0rpx 20rpx 4rpx 20rpx;

			border-radius: 10rpx;

			.text-contain {
				padding: 30rpx 40rpx 42rpx 40rpx;
				margin-bottom: 2rpx;
				background: #FFFFFF;
				border-radius: 10rpx;

				.title-left {
					font-weight: bold;
					font-size: 30rpx;
					color: #46464E;
					margin-bottom: 22rpx;
				}

				.describe-input {
					background-color: #F7F7F7;
					border: 0px;
				}
			}


			.img-contain {
				padding: 30rpx 40rpx 42rpx 40rpx;
				background: #FFFFFF;
				border-radius: 10rpx;

				.title {
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
					margin-bottom: 24rpx;
				}
			}

			.voice-contain {
				padding: 0rpx 40rpx 42rpx 40rpx;
				background: #FFFFFF;
				border-radius: 10rpx;
			}

			.file-title {
				font-size: 30rpx;
				color: $seconFontColor;
				font-weight: bold;
				margin-bottom: 22rpx;
			}
		}

		.personnel-information {
			background-color: #FFFFFF;
			box-shadow: inset 0px 3px 3px rgba(183, 183, 183, 0.25);
			min-height: 142rpx;
			padding: 46rpx 42rpx 24rpx 38rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 34rpx;

			.left {
				display: flex;

				.name-contain {
					display: flex;
					align-items: center;
					margin-left: 16rpx;

					.label {
						font-size: 28rpx;
						line-height: 40rpx;
						color: $seconFontColor;
						font-weight: bold;
						margin-right: 16rpx;
					}

					.value {
						font-size: 26rpx;
						line-height: 36rpx;
						color: #909199;
						font-weight: bold;
					}
				}
			}

			.right {
				display: flex;

				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 14rpx;
				}

				text {
					font-size: 13px;
					font-weight: bold;
					line-height: 18px;
					color: #606166;
				}
			}
		}

		.image-contain {
			.image-item {
				padding: 0 20rpx 34rpx 20rpx;

				.image-title {
					margin-bottom: 32rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: $seconFontColor;
					padding-left: 46rpx;
				}

				.record-item-img {
					margin-bottom: 20rpx;
				}
			}
		}

		/deep/ .u-tab-bar {
			bottom: -4rpx;
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


	.submit-text-contain {
		// background-color: #FFFFFF;
		padding: 20rpx 64rpx 20rpx 64rpx;
		position: fixed;
		bottom: 0;
		@include safearea();
		display: flex;
		justify-content: center;
		width: 100%;

		.submit-agree,
		.refused-to {
			display: flex;
			justify-content: center;
			width: 268rpx;
			height: 88rpx;
			font-weight: bold;
			font-size: 28rpx;
			align-items: center;
			border-radius: 10rpx;
		}

		.submit-agree {
			background: $themeColor;
			color: #FFFFFF;

		}

		.refused-to {
			background: #FFFFFF;
			border: 2rpx solid #E0E0E0;
			color: #909299;
			margin-right: 24rpx;
		}
	}
</style>
