<template>
	<view class="change-record-page">
		<z-nav-bar bgColor="#F5F5F5">
			<view slot="default" class="nav-bar">{{title}}</view>
		</z-nav-bar>
		<view class="change-introduction">
			<view class="desc">
				由于<text v-if="details.content" class="item-desc">{{details.content}}</text> 的原因，工地地址在<text
					v-if="details.stageName" class="item-desc">{{details.stageName}}</text> 发生现场变更，经双方合议,本次变更签证起因为:<text
					v-if="details.changeTypeName" class="item-desc">{{details.changeTypeName}}</text>，双方确认变更责任方为:<text
					v-if="details.handleUserInputsName"
					class="item-desc">{{details.handleUserInputsName}}</text>，甲乙双方确定签证内容，相关方同意合同条款附加本次签证确认单内容执行。
			</view>
			<view v-if="details.projectInfo" class="address display-flex_direction">
				<text class="label">工作地址</text>
				<text
					class="value">{{details.projectInfo.cityName}}{{details.projectInfo.districtName}}{{details.projectInfo.latAddress}}</text>
			</view>
			<view v-if="team.length > 0" class="team display-flex_direction">
				<text class="label">服务团队</text>
				<view class="list">
					<view class="item display-justify_between" v-for="(item,index) in team" :key="index">
						<view class="left">
							<text class="skill-name">{{item.skillName}}</text>
							<text class="skill-value">{{item.name}}</text>
							<text
								class="skill-value">{{item.phone ? item.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') :''}}</text>
						</view>
						<text class="item-phone" @click="callPhone(item.phone)">拨打</text>
					</view>
				</view>
			</view>
			<view v-if="details.projectInfo" class="time">
				<text class="label">工期计划</text>
				<view class="time-text display-justify_between">
					<text>{{details.projectInfo.expectStartTime}}至{{details.projectInfo.expectFinishTime}}</text>
					<text v-if="timeDiff">共{{timeDiff}}个工作日</text>
				</view>
			</view>
		</view>

		<view v-if="detailsShow" class="item-contain">
			<view class="item ">
				<text class="label">签证类型</text>
				<text class="value">{{getTypeName}}</text>
			</view>
			<view v-if="details.content" class="item">
				<text class="label">签证内容</text>
				<text class="value">{{details.content}}</text>
			</view>
		</view>
		<view v-if="detailsShow" class="item-contain">
			<view class="item">
				<text class="label">当前工序</text>
				<text class="value">{{details.stageName}}</text>
			</view>
			<view v-if="details.description" class="item">
				<text class="label">变更描述</text>
				<text class="value">{{details.description}}</text>
			</view>
		</view>
		<view v-if="detailsShow" class="item-contain">
			<view class="item">
				<text class="label">变动起因</text>
				<text class="value">{{details.changeTypeName}}</text>
			</view>
			<view class="item">
				<text class="label">定责合议</text>
				<text class="value">{{details.handleUserInputsName}}</text>
			</view>
		</view>
		<!-- 如果主状态为已拒绝，则不显示按钮 -->
		<myHome-mh-form-bottom-button v-if="details.status !== 1 && currentUserStatus == 0" cancelText="拒绝" sureText="同意"
			@onCancel="()=>toDealt('拒绝')" @onSure="()=>toDealt('同意')">
		</myHome-mh-form-bottom-button>

		<!-- 主订单审核通过 -->
		<bottom-button v-if="details.status == 2" title="下载PDF" @click="downPdf" :styleObj="{
		    background: '#000'
		  }"></bottom-button>

	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				option: {},
				info: {},
				projectInfo: {},
				orderInfo: {},
				detailsShow: false,
				details: {},
				team: [],
				title: '变更单',
				currentUserStatus: 0,
				changeTypeList: [{
						name: '项目实施增减',
						value: 1
					}, {
						name: '项目标准改变',
						value: 2
					}, {
						name: '主辅材料改变',
						value: 3
					}, {
						name: '图纸方案改变',
						value: 4
					}, {
						name: '工况环境变化',
						value: 5
					}, {
						name: '设备参数变化',
						value: 6
					},
					{
						name: '不可预知情况',
						value: ''
					}
				],
				statusList: [{
					name: '审核中',
					value: 0
				}, {
					name: '已拒绝',
					value: 1
				}, {
					name: '已同意',
					value: 2
				}],
				visaTypeList: [{
					name: '人工费变更',
					value: 1
				}, {
					name: '服务费变更',
					value: 2
				}, {
					name: '订单费变更',
					value: 3
				}, {
					name: '工期变更',
					value: 4
				}, {
					name: '材料定额变更',
					value: 5
				}, {
					name: '验收标准变更',
					value: 6
				}],
			}
		},
		computed: {
			timeDiff() {
				let startTime = this.details.projectInfo.expectStartTime
				let finisTime = this.details.projectInfo.expectFinishTime
				if (this.details.projectInfo && startTime) {
					return moment(finisTime).diff(startTime, 'day')
				}
				return ''
			},
			getTypeName() {
				let result = this.visaTypeList.find(item => item.value == this.details.type)
				return result?.name
			},
		},
		mounted() {

		},
		onShow() {
			this.getDetails()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			confirm() {
				this.form.verifyStatus = 1
				this.getVerify()
			},
			toDealt(item) {
				if (item == '同意') {
					this.getVerify()
				} else {
					this.toPage(
						`/pages-myHome/commonHandleTodo?reviewId=${this.option.businessCodeId}&status=1&type=changeRecordPage`
					)
				}
			},
			getVerify() {
				let parm = {
					id: this.option.businessCodeId,
					verifyStatus: 2,
					verifyReason: '同意'
				}
				this.$httpApi.getVerify(parm).then(res => {
					if (res) {
						this.$util.toast('操作成功')
						this.getDetails()
					}
				})
			},
			getDetails() {
				this.$httpApi.queryDetailByPrint({
					id: this.option.businessCodeId
				}).then(res => {
					if (res) {
						res['changeTypeName'] = this.changeTypeList.find(item => item.value == res.changeType).name
						let handleUserInputsName = res.handleUserInputs.map(item => {
							return item.handleSkillName
						})
						res['handleUserInputsName'] = handleUserInputsName.join('、')
						this.details = res
						
						this.team = []
						this.setCurrentUserStatus()
						this.detailsShow = true
						res.projectMemberGroupOutputs.forEach(el => {
							if (el.members) {
								el.members.forEach(item => {
									this.team.push({
										skillName: el.skillName,
										name: item.name,
										phone: item.phone
									})
								})
							}
						})
					}
				})
			},
			setCurrentUserStatus() {
				let userId = uni.getStorageSync('userData').sysUser && uni.getStorageSync('userData').sysUser.userId
				this.details.handleUserInputs.map(item => {
					if (item.handleUserId == userId) {
						this.currentUserStatus = item.status
					}
				})
				this.setTitle()
			},
			setTitle() {
				let resultName = this.statusList.find(item => item.value == this.details.status)
				let prefix = ''
				// 自己审核通过 ，单其他人未审核通过
				if (this.details.status == 0 && this.currentUserStatus == 2) {
					prefix = '其他人审核中-现场变更签证确认单'
				}
				let title = `${resultName.name}-现场变更签证确认单`
				this.title = prefix ? prefix : title
			},
			downPdf() {
				const fileName = '现场变更签证确认单'
				// 变更=1 交底=2 验收=3 巡检=4 B端变更=5
				this.$util.downloadPdfReport(this.option.businessCodeId, 5, fileName)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.display-flex_direction {
		display: flex;
		flex-direction: column;
	}

	.display-justify_between {
		display: flex;
		align-content: center;
		justify-content: space-between;
	}

	.change-introduction {
		padding: 24rpx 40rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.desc {
			color: #606166;
			font-size: $middleFontSize;

			.item-desc {
				color: #3D3D3D;
				font-weight: bold;
				font-size: $middleFontSize;
			}
		}

		.label {
			color: #3D3D3D;
			font-size: $middleFontSize;
			line-height: 38rpx;
			font-weight: bold;
		}

		.address {
			margin-top: 30rpx;

			.value {
				color: #606166;
				font-size: 28rpx;
			}
		}

		.team {
			margin-top: 30rpx;

			.list {
				margin-top: 10rpx;

				.item {
					line-height: 38rpx;
					margin-bottom: 10rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.skill-name {
						color: #3D3D3D;
						font-size: $middleFontSize;
					}

					.skill-value {
						font-size: $middleFontSize;
						color: #606166;
						margin-left: 20rpx;
					}

					.item-phone {
						color: $themeColor;
						font-size: $smallFontSize;
					}

				}

			}
		}

		.time {
			margin-top: 30rpx;

			.time-text {
				text {
					color: #3D3D3D;
					font-size: $middleFontSize;
				}
			}
		}
	}

	.item-contain {
		margin-top: 6rpx;
		padding: 24rpx 26rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.item {
			display: flex;
			flex-direction: column;
			margin-bottom: 40rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.label {
				color: $seconFontColor;
				font-size: $middleFontSize;
				line-height: 38rpx;
				font-weight: bold;
			}

			.value {
				margin-top: 6rpx;
				color: #606166;
				font-size: $middleFontSize;
			}
		}
	}
</style>
