<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.order-user-information-item {
		margin: 2rpx 20rpx;
	}

	.outermost_layer {
		padding-bottom: 188rpx;
	}

	.release {
		margin: 2rpx 20rpx;

		.top_nav {
			.left_nav {
				font-weight: bold;
				font-size: $middleFontSize;
				color: $darkTitle;
			}

			.right_nav {
				font-size: 24rpx;
				color: $themeColor;
			}
		}

		.bg_fff {
			padding: 30rpx;
			background: #FFFFFF;
			border-radius: 10rpx;

			.inp_box {
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

	.btm_type {
		background: #fff;
		padding: 28rpx 32rpx;
		margin: 12rpx 0;
		border-radius: 10rpx;

		.type_title {
			font-weight: bold;
			font-size: $middleFontSize;
			color: $darkTitle;
		}

		.type {
			margin-top: 12rpx;
		}

		.type_select {
			font-weight: bold;
			font-size: $middleFontSize;
			color: $fontColor99;

		}
	}

	.btm_btn {
		width: 100%;
		position: fixed;
		bottom: 0;
		@include safearea();
		display: flex;
		justify-content: center;

		button {
			width: 268rpx;
			height: 88rpx;
			line-height: 88rpx;
			font-weight: bold;
			font-size: $middleFontSize;
			border-radius: 10rpx;
		}

		.cancel {
			margin-right: 24rpx;
			border: 1.5rpx solid #E0E0E0;
			background: #FFFFFF;
			color: #909299;
		}

		.confirm {
			background: $themeColor;
		}
	}

	.cancel_title_confirm {
		background-color: #FFFFFF;
		padding: 48rpx 40rpx;

		.cancel {
			font-size: 28rpx;
			color: #909199;
		}

		.title {
			font-weight: bold;
			font-size: 30rpx;
			color: #303133;
		}

		.confirm {
			font-weight: bold;
			font-size: 28rpx;
			color: $themeColor;
		}
	}

	.type_view:after {
		content: '';
		display: block;
		width: 200rpx;
		height: 80rpx;
	}

	.type_view {
		padding: 12rpx 40rpx 54rpx;
		background-color: #FFFFFF;
		flex-wrap: wrap;

		.type_item {
			padding: 0 30rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin-bottom: 16rpx;
			border: 2rpx solid #EEEEEE;
			color: #303133;
			font-size: 28rpx;
			// text-align: center;
			border-radius: 10rpx;
		}

		.isSelect {
			border: 2rpx solid $themeColor;
			color: $themeColor;
			background-image: url(../../static/icon/isselect.png);
			background-repeat: no-repeat;
			background-position: right bottom;
			background-size: auto;
		}
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-form-contian {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 34rpx 30rpx 0rpx 30rpx;

		/deep/ .u-input__input {
			color: #303133;
			font-size: 30rpx;
		}

		.item-label {
			color: #303133;
			font-size: 28rpx;
			line-height: 38rpx;
			font-weight: bold;
		}


		.item-value {
			margin-top: 12rpx;
			background-color: #F6F7F9;
			border-radius: 10rpx;
			height: 88rpx;
			display: flex;
			align-items: center;
			padding: 0rpx 26rpx;
			flex: 1;
		}

		.item-value_stage {
			margin-top: 12rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			flex: 1;

			.icon-contain {
				background-color: #F6F7F9;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 110rpx;
				border-radius: 10rpx;
			}

			.item-value_text {
				background-color: #F6F7F9;
				display: flex;
				flex: 1;
				height: 100rpx;
				margin-right: 6rpx;
				padding-left: 26rpx;
				border-radius: 10rpx;
			}
		}

		.item-text {
			font-size: 26rpx;
		}

		.item-value_time {
			display: flex;
			justify-content: space-between;
		}

		.item-text_placeholder {
			color: #909199;
		}
	}

	.work-log_form {
		border-radius: 10rpx;
		background-color: #fff;
		margin: 8rpx 20rpx 12rpx 20rpx;
		padding: 0rpx 0rpx 30rpx 0rpx;

		.item-contain {
			display: flex;
			align-items: center;


			.item-time_label {
				color: #002FA5;
				font-size: 24rpx;
			}

			.item-time_input {
				background-color: #F6F7F9;
				border-radius: 10rpx;
				margin: 0 10rpx;
			}
		}
	}

	.log-contain {

		.list-contain {
			margin: 8rpx 20rpx 14rpx 20rpx;
			background-color: #fff;
			border-radius: 10rpx;

			.service-list {
				padding: 30rpx;

				.title {
					font-weight: bold;
					font-size: 28rpx;
					color: #303133;
					line-height: 38rpx;
					margin-bottom: 24rpx;
				}

				.item-contain {
					&:last-child {
						.log-other {
							padding-bottom: 0rpx;
						}
					}
				}

				.top {
					display: flex;
					align-items: center;
					padding-bottom: 20rpx;

					/deep/ .u-checkbox__label {
						display: none;
					}

					.title-name {
						color: #303133;
						font-size: 28rpx;
						margin: 0rpx 12rpx 0rpx 12rpx;
						line-height: 36rpx;
					}

					.item-tag {
						width: 72rpx;
						// padding: 0 12rpx;
						height: 32rpx;
						border-radius: 50rpx;
						// background-color: rgba(255, 230, 223, 1.000);
						display: flex;
						align-items: center;

						text {
							font-size: 24rpx;
							transform: scale(0.85);
							transform-origin: center;
							color: #FF5D35;
							display: inline-block;
						}
					}

					.item-status {
						width: 100rpx;
						font-size: 24rpx;
						border-radius: 20rpx;
						text-align: center;
						padding: 4rpx 0;
						margin-left: 10rpx;
					}


				}

				.log-other {
					padding-bottom: 30rpx;

					.status {
						margin-bottom: 16rpx;
					}

					.upload {}
				}


			}

		}

		.desc-contain {
			margin: 0rpx 20rpx 14rpx 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 30rpx 22rpx;

			.title-text {
				color: #303133;
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 30rpx;
			}

			.voice-contain {
				margin-top: 20rpx;
			}


		}

		.tomorrow-contain {
			margin: 0rpx 20rpx 14rpx 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 30rpx 22rpx;

			.title-text {
				color: #303133;
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 30rpx;
			}

			/deep/ .u-checkbox__label {
				display: none;
			}

			.item-contain {
				&:last-child {
					.top {
						margin-bottom: 0rpx;
					}
				}
			}

			.top {
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;

				.title-name {
					color: #303133;
					font-size: 28rpx;
					line-height: 36rpx;
					margin: 0rpx 12rpx 0rpx 12rpx;
				}
			}
		}
	}

	.item-value {
		margin-top: 12rpx;
		background-color: #F6F7F9;
		border-radius: 10rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 26rpx;
		flex: 1;
	}


	.no-list-image {
		width: 160rpx;
		height: 132rpx;
	}

	.construction-contain {
		border-radius: 10rpx;
		background-color: #fff;
		margin: 0rpx 20rpx 12rpx 20rpx;
		padding: 30rpx;

		.top {
			display: flex;
			justify-content: space-between;
			margin-bottom: 28rpx;

			.name {
				font-size: 28rpx;
				color: #303133;
				font-weight: bold;
			}

			.add {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.tips {
			font-size: 26rpx;
			font-weight: normal;
			line-height: 38rpx;
			letter-spacing: 0px;
			color: #303133;
		}

		.no-list {
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 32rpx 0rpx 64rpx 0rpx;

			text {
				color: #909199;
				font-size: 26rpx;
			}
		}

		.icon-delete {
			width: 32rpx;
			height: 32rpx;
		}

		.list-data {
			padding-top: 20rpx;

			.item-data-contain {
				margin-bottom: 20rpx;
				background: #F6F7F9;
				padding: 16rpx 20rpx;
				border-radius: 16rpx;
			}

			.item-data {
				margin-bottom: 30rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}

			.data-top-contain {
				display: flex;
				align-items: center;
				margin-bottom: 22rpx;

				.top-left {
					display: flex;
					align-items: center;
				}

				&:last-child {
					margin-bottom: 0rpx;
				}

				text {
					margin-right: 16rpx;
					font-size: 24rpx;
					color: #606166;
				}

				image {
					margin-left: 16rpx;
				}

				.item-name {
					font-size: 24rpx;
					color: #606166;
				}
			}

			.data-top {
				display: flex;
				align-items: center;
				margin-bottom: 22rpx;
				justify-content: space-between;

				.top-left {
					display: flex;
					align-items: center;
				}

				&:last-child {
					margin-bottom: 0rpx;
				}

				text {
					margin-right: 16rpx;
					font-size: 24rpx;
					color: #606166;
				}

				image {
					margin-left: 16rpx;
				}

				.item-name {
					font-size: 24rpx;
					color: #606166;
				}
			}
		}
	}

	.other-desc {
		margin-top: 20rpx;
		// background-color: #F6F7F9;
		border-radius: 5px;
		font-size: 26rpx;
		color: #303133;
		// padding: 26rpx;
	}

	/deep/ .no-data-list {
		margin: 0rpx;
	}
</style>


<template>
	<view class="outermost_layer">
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>

		<view class="order-user-information-item">
			<order-user-information :projectId="projectId" />
		</view>

		<!-- 日志时间、施工人员、当前阶段 -->
		<view class="work-log_form">
			<view class="item-form-contian">
				<text class="item-label">施工人员</text>
				<view class="item-value item-value_time" @click="goToSelect()">
					<view class="item-text" :class="[form.personName == '请选择施工人员' ? 'item-text_placeholder':'']">
						{{form.personName}}
					</view>
					<u-icon name="arrow-right" color="#C4C4C4" size="28"></u-icon>
				</view>
			</view>
			<view class="item-form-contian">
				<text class="item-label">日志时间</text>
				<view class="item-value item-value_time" @click="timeShow = true">
					<view class="item-text">{{form.workingTime}}</view>
					<u-icon name="arrow-right" color="#C4C4C4" size="28"></u-icon>
				</view>
			</view>
			<view class="item-form-contian">
				<view class="item-contain">
					<text class="item-time_label">施工第</text>
					<u-input class="item-time_input" input-align="center" placeholder="" height="60"
						v-model="form.workingStart" :clearable="false" type="number" :border="false" />
					<text class="item-time_label">天，</text>
					<text class="item-time_label">预计还需</text>
					<u-input class="item-time_input" input-align="center" placeholder="" height="60"
						v-model="form.workingEnd" :clearable="false" type="number" :border="false" />
					<text class="item-time_label">天完成</text>
				</view>
			</view>

			<view class="item-form-contian">
				<text class="item-label">当前阶段</text>
				<view class=" item-value_time item-value_stage">
					<view class="item-value_text">
						<u-input v-model="form.stageName" placeholder="请选择或输入当前阶段" placeholder-style="color:#909199"
							height="100" :clearable="false" :border="false" />
					</view>
					<view class="icon-contain" @click="stageShow = true">
						<u-icon name="arrow-right" color="#C4C4C4" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 今日施工 -->
		<view class="construction-contain">
			<view class="top">
				<text class="name">今日施工内容</text>
				<image class="add" src="@/static/images/add-new.png" @click="addWork('today')" mode=""></image>
			</view>
			<view class="no-list" v-if="todayWorkList.length == 0">
				<image class="no-list-image" src="@/static/images/no_order_2.png" mode=""></image>
				<text>点击右上角+号，选择今日施工内容</text>
			</view>
			<view class="list-data" v-else>
				<view class="item-data-contain">
					<u-input v-model="todayWorkListStr" class="describe-input" maxlength="200" height="140"
						type="textarea" placeholder="今日施工内容" :border="false" />
				</view>
				<view class="file-contain">
					<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo"
						:uploadType="uploadType" :count="9" v-model="form.pic" />
				</view>
				<view class="other-desc" v-if="form.desc">
					{{form.desc}}
				</view>
			</view>
		</view>
		<!-- 明日施工 -->
		<view class="construction-contain">
			<view class="top">
				<text class="name">明日施工内容</text>
				<image class="add" src="@/static/images/add-new.png" @click="addWork('tomorrow')" mode=""></image>
			</view>
			<view class="no-list" v-if="tomorrowWorkList.length == 0">
				<image class="no-list-image" src="@/static/images/no_order_2.png" mode=""></image>
				<text>点击右上角+号，选择明日施工内容</text>
			</view>
			<view class="list-data" v-else>
				<view class="item-data-contain">
					<u-input v-model="tomorrowWorkListStr" class="describe-input" maxlength="200" height="140"
						type="textarea" placeholder="明日施工内容" :border="false" />
				</view>
				<view class="other-desc" v-if="form.futureDesc">
					{{form.futureDesc}}
				</view>
			</view>
		</view>
		<!-- 补充内容 -->
		<view class="construction-contain">
			<view class="top">
				<text class="name">补充内容</text>
				<image class="add" src="@/static/images/add-new.png" @click="add()" mode=""></image>
			</view>
			<view class="no-list" v-if="dataList.length == 0">
				<image class="no-list-image" src="@/static/images/no_order_2.png" mode=""></image>
				<text>点击右上角+号，选择补充内容</text>
			</view>
			<view class="list-data" v-else>
				<view class="item-data" v-for="(item,index) in dataList" :key="index">
					<view class="data-top-contain">
						<text>{{index + 1}}.</text>
						<view class="item-value">
							<u-input placeholder="请输入标题" placeholder-style="color:#909199" height="52"
								v-model="item.name" :clearable="false" type="text" :border="false" />
						</view>
						<image class="icon-delete" src="@/static/images/delete_icon/delete_3.png" mode=""
							@click="deleteData(index)"></image>
					</view>
					<view class="file-contain">
						<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo"
							:uploadType="uploadType" :count="9" v-model="item.pic" />
					</view>
				</view>
			</view>
		</view>

		
		<mihuo-bottom-button :buttonList="buttonList" @click="getButton"></mihuo-bottom-button>
		
		<!-- 选择时间 -->
		<u-picker v-model="timeShow" mode="time" :params="params" @confirm="confirmTime" :is-allow-passed-time="true"
			:start-year="(new Date().getFullYear() -1 )">
		</u-picker>

		<!-- 阶段选择 -->
		<u-picker mode="selector" v-model="stageShow" :default-selector="[stageIndex]" :range="stageList" range-key="label"
			@confirm="confirmStage">
		</u-picker>
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
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				stageIndex:0,
				typeCurrent: 0,
				timeShow: false,
				typeShow: false,
				typeList: [],
				chooseVoiceObject: {},
				uploadType: ['图片', '视频'],
				fileObj: {},
				projectId: '',
				option: '',
				waterAddress: '',
				waterUserInfo: '',
				checked: false,
				dataList: [],
				stageShow: false,
				params: {
					year: true,
					month: true,
					day: true,
				},
				buttonList: [{
						name: '返回',
						status: false
					},
					{
						name: '提交',
						status: true
					}
				],
				list: [{
						name: '已开工',
						status: 1
					},
					{
						name: '完工',
						status: 2
					}
				],
				value: 'orange',
				serviceList: [],
				serviceListCopy: [],
				colorList: [{
						status: 0,
						name: '未开始',
						color: '#FFFFFF',
						bgColor: '#C0C0C0'
					},
					{
						status: 1,
						name: '进行中',
						color: '#FF5D35',
						bgColor: '#FEF1E3'
					},
					{
						status: 2,
						name: '已完成',
						color: '#10C57D',
						bgColor: '#D5FFEE'
					}
				],
				todayWorkList: [],
				todayWorkListStr: '',
				tomorrowWorkList: [],
				tomorrowWorkListStr: '',
				currentUser: {},
				stageList: [],
				userId: uni.getStorageSync('userData').sysUser.userId,
				currentUserList: [],
				form: {
					address: '',
					jobName: '',
					orderId: '',
					personIds: [],
					personId: '',
					personName: '请选择施工人员',
					audio: '',
					desc: '',
					productDesc: '', // 日志标题
					pic: '',
					status: 3,
					type: '',
					skillName: '',
					projectId: '',
					detailList: [],
					futures: '',
					futureDesc: '',
					workingTime: moment().format('YYYY-MM-DD'), // 本次施工时间
					workingStart: 1, // 本次施工开始时间
					workingEnd: '', // 本次施工结束时间
					futurePic: '', // 明天施工图片
					stageId: '', // 阶段id
					stageName: '',
					source: 'CONSTRUCTION'
				},
			}
		},
		onUnload() {
			uni.$off('todayWork')
			uni.$off('tomorrowWork')
			uni.$off('checkList')
			uni.$off('selectUserId')
		},
		onShow() {
			// uni.$once('checkList', function(data) {
			// 	let list = data ? JSON.parse(data) : [];
			// 	console.log('list', list);
			// })
			uni.$once('selectUserId', (data) => {
				if (data) {
					this.userId = data
					this.getUserDetails(data)
				} else {
					this.userId = ''
					this.form.personId = ''
					this.form.personName = '请选择施工人员'
				}
			})

			uni.$once('todayWork', (data) => {
				this.getWork('todayWork', data)
			})
			uni.$once('tomorrowWork', (data) => {
				this.getWork('tomorrowWork', data)
			})
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.setWorkTime()
			this.getLocaltion()
			this.getGroupTask()
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'nodeInfo', 'userPersonInfo']),

		},
		methods: {
			setWorkTime() {
				// 1.该节点实际开始时间
				// 2.计算现在是施工第几天workingStart? 根据节点实际开始时间跟当前时间计算
				const today = moment().format('YYYY-MM-DD')
				const diffTime = moment(today).diff(this.nodeInfo.realStartTime, 'day')
				this.form.workingStart = diffTime
				// 3.如果未超期，则计算还需几天完成？workingEnd
				const tempWorkingEnd = this.getDateNumber(
					this.nodeInfo.expectFinishTime, // 预计完工时间
					this.nodeInfo.realEndTime, // 实际完成时间
					this.getStatus(this.nodeInfo)
				).time
				if (tempWorkingEnd.indexOf('超') == -1) {
					// 预计完工时间expectFinishTime 、预计开工时间expectStartTime
					const timeDiff = moment(this.nodeInfo.expectFinishTime).diff(this.nodeInfo
						.expectStartTime, 'day')
					//timeDiff大于1时才显示 workingEnd		
					if (Number(timeDiff) > 1) {
						this.form.workingStart = timeDiff
					}
				}
			},
			confirmStage(ev) {
				this.stageIndex = ev[0]
				this.form.stageName = this.stageList[ev[0]] && this.stageList[ev[0]].label
				this.form.stageId = this.stageList[ev[0]] && this.stageList[ev[0]].value
			},
			getGroupTask() {
				if (!this.orderInfo.skillId) {
					return
				}
				this.$httpApi.getServiceStageList({
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					skillId: this.orderInfo.skillId
				}).then(res => {
					if (res) {
						this.stageList = []
						res.map((item, index) => {
							if (index == 0) {
								this.form.stageId = item.id // 阶段id
								this.form.stageName = item.stageName // '请选择当前阶段'
							}
							this.stageList.push({
								value: item.id,
								label: item.stageName
							})
						})
					}
				})
			},
			getUserDetails(data) {
				this.currentUserList = []
				if (data) {
					let ids
					if (data.indexOf(',') !== -1) {
						ids = data.split(',')
					} else {
						ids = [data]
					}
					if (ids.length > 0) {
						ids.forEach(item1 => {
							this.$httpApi.getPersonSettingInfo({
								userId: item1,
							}).then(res => {
								if (res) {
									// 审核状态（0已提交、1未通过、2已通过）
									res.personageList = res.personageList.filter(item => item
										.auditStatus == 2)
									this.currentUserList.push(res)

									if (ids.length == this.currentUserList.length) {
										this.setCurrentUserList()
									}
								}
							})
						})
					}
				}
			},
			setCurrentUserList() {
				let personIds = []
				let personName = []
				this.currentUserList.forEach(item => {
					if (item.personageList.length > 0) {
						item.personageList.forEach(item1 => {
							if (item1.skillId == this.orderInfo.skillId) {
								personIds.push(item1.personId)
								personName.push(`${item.realName}(${item1.skillName})`)
							}
						})
					}
				})
				this.form.personIds = personIds
				this.form.personName = personName.join(',')
			},
			goToSelect() {
				// multiple=true&
				this.toPage(
					`/pages/user/userTeam?userId=${this.userId}&skillName=${this.orderInfo.skillName}&multiple=true`)
				return
				if (this.projectInfo.source != 0) {
					this.toPage('/pages/publishTask/selectPick?multiple=false')
					return
					this.toPage('/pages/user/userTeam')
				} else {
					this.toPage('/pages/publishTask/selectPick?multiple=false')
				}
			},
			confirmTime(value) {
				this.form.workingTime = `${value.year}-${value.month}-${value.day}`
			},
			getWork(type, data) {
				if (type == 'todayWork') {
					this.todayWorkList = [...this.todayWorkList, ...data.list]
					this.todayWorkList = this.unique(this.todayWorkList, 'id')
					// this.todayWorkList = data.list
					if (data.desc) {
						this.form.desc = data.desc
					}
				} else {
					this.tomorrowWorkList = [...this.tomorrowWorkList, ...data.list]
					this.tomorrowWorkList = this.unique(this.tomorrowWorkList, 'id')
					// this.tomorrowWorkList = data.list
					if (data.desc) {
						this.form.futureDesc = data.desc
					}
				}
				this.getTodayWorkList(type)
			},
			getTodayWorkList(type) {
				let resultStr = ''
				if (type == 'todayWork') {
					this.todayWorkList.forEach((el, index) => {
						resultStr += `${index+1}.${el.name}${ this.todayWorkList.length == index+1?'':'\n' }`
					})
					this.todayWorkListStr = resultStr
				} else {
					this.tomorrowWorkList.forEach((el, index) => {
						resultStr += `${index+1}.${el.name}${ this.tomorrowWorkList.length == index+1?'':'\n' }`
					})
					this.tomorrowWorkListStr = resultStr
				}
			},
			unique(arr, key) { // 数据去重
				let map = new Map()
				arr.forEach((item, index) => {
					if (!map.has(item[key])) {
						map.set(item[key], item)
					}
				})
				return [...map.values()]
			},
			//得到当前位置
			getLocaltion() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (data) => {
						this.waterAddress = data.address ? data.address.city + data.address.district + data
							.address.street + data.address.streetNum + data.address.poiName : ''
					}
				})
			},
			setParameter() {
				this.projectId = this.projectInfo.projectId
				this.form.address = this.projectInfo.address
				this.form.jobName = this.projectInfo.pioneerJobName
				this.form.orderId = this.orderInfo.orderId
				this.form.personId = this.userPersonInfo.personId // 执行人员
				this.form.skillName = this.userPersonInfo.skillName
				this.userId = this.userPersonInfo.userId
				this.form.personName = this.userPersonInfo.name + `(${this.userPersonInfo.skillName})` // 施工人员
				this.form.personIds = [this.userPersonInfo.personId] // 施工人员
				this.form.projectId = Number(this.projectInfo.projectId)
				this.waterUserInfo = this.userPersonInfo.name + `(${this.userPersonInfo.skillName})`;
			},

			confirmSelect() {
				this.typeList.map((item, index) => {
					if (index === this.typeCurrent) {
						this.form.type = Number(item.value);
						this.typeName = item.label
					}
				})
				this.typeShow = false
			},
			selectType(item, index) {
				this.typeCurrent = index;
			},
			chooseVoice(file) {
				this.chooseVoiceObject = file
			},
			add() {
				this.dataList.push({
					name: '',
					pic: '[]',
					status: 1
				})
			},
			deleteWork(type, index) {
				if (type == 'today') {
					this.todayWorkList.splice(index, 1)
				} else {
					this.tomorrowWorkList.splice(index, 1)
				}
			},
			deleteData(index) {
				this.dataList.splice(index, 1)
			},
			submit() {
				if (!this.$checkUploadProcess(this.form.pic)) {
					return;
				}
				this.debounce(() => {
					this.getUploadFile()
				}, 300)
			},
			/**
			 * 
			 * description 数组合并
			 * 
			 * */
			getArrDifference(arr1, arr2) {
				return arr1.concat(arr2).filter(function(v, i, arr) {
					return arr.indexOf(v) === arr.lastIndexOf(v);
				});
			},
			setWorkStr(event, type) {
				if (!event || this[type].length == 0) {
					return []
				}
				const resultList = event.split('\n')
				// 1.自定义添加的数据
				const customList = resultList.filter(item => item) // 过滤空串
				let tempList = customList.map(item => {
					return {
						name: item,
						id: '',
						status: 0
					}
				})
				// 2.修改数据 
				tempList.forEach(item3 => {
					this[type].forEach(item2 => {
						if (item3.name.indexOf(item2.name) !== -1) {
							item3['id'] = item2.id
							item3['status'] = item2.status
						}
					})
				})
				return tempList
			},
			getButton(item) {
				if (item.name == '提交') {
					if (!this.form.personId) {
						this.$util.toast(`请选择施工人员`);
						return
					}

					if (!this.form.stageName) {
						this.$util.toast(`请选择或输入当前阶段`);
						return
					}

					if (this.todayWorkList.length == 0) {
						this.$util.toast(`请填写今日施工内容`);
						return
					}
					let tempFutureDesc = []
					// 今天
					this.form.detailList = this.setWorkStr(this.todayWorkListStr, 'todayWorkList')
					// 明天
					this.form.futures = JSON.stringify(this.setWorkStr(this.tomorrowWorkListStr, 'tomorrowWorkList'))
					let tempsStatus = true
					if (this.dataList.length > 0) {
						try {
							this.dataList.forEach((el, index) => {
								if (!el.name) {
									throw index
								}
							})
						} catch (e) {
							tempsStatus = false
							this.$util.toast(`第${e+1}项标题不能为空`);
						}
					}
					if (!tempsStatus) {
						return
					}

					if (this.form.workingTime.indexOf('00:00:00') == -1) {
						this.form.workingTime = `${this.form.workingTime} 00:00:00`
					}
					// 补充内容
					this.form.supplementaryContent = JSON.stringify(this.dataList)
					this.debounce(() => {
						this.getUploadFile()
					}, 300)
				} else {
					this.goBack()
				}
			},
			async getUploadFile(callback) {
				// if (this.$remarksVerification(this.form, '服务日志')) {
				// 	return
				// }
				this.$httpApi.constructionSave(this.form).then(res => {
					uni.showToast({
						title: '提交成功',
						icon: 'none',
						success: (res) => {
							uni.navigateBack()
						}
					})
					this.form = {}
				}).catch(err => {
					console.log(err)
				})
			},
			checkboxChange(item) {
				setTimeout(() => {
					this.serviceList.forEach(el => {
						if (el.id == item.id && !el.checked) {
							el.status = el.statusData
							el.radio = ''
						}
					})
				}, 200)
			},
			radioGroupChange(even, item) {
				let resultName = this.list.find(item => item.name == even)
				this.serviceList.forEach(el => {
					if (el.id == item.id) {
						el.status = resultName.status
					}
				})
			},
			radioChange(even, item) {
				// console.log('even3', even, item);
			},
			getStatus(status, typeName) {
				switch (typeName) {
					case 'text':
						return this.colorList.find(item => item.status === status).name
					case 'color':
						return this.colorList.find(item => item.status === status).color
					case 'bg':
						return this.colorList.find(item => item.status === status).bgColor
				}

			},
			addWork(name) {
				uni.navigateTo({
					url: '/pages/construction/selectConstruction/selectConstruction',
					success: (res) => {
						res.eventChannel.emit('getSelectConstruction', {
							type: name == 'today' ? 1 : 2,
							// list: name == 'today' ? this.todayWorkList : this.tomorrowWorkList
						});
					}
				})
			}
		}
	}
</script>
