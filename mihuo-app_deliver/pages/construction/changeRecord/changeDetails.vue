<template>
	<view class="change-details">
		<change-introduction v-model="details" :team="team"></change-introduction>
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

		<mh-empty v-if="!detailsShow" icon="/static/images/no_recommend.png" title="加载中～～" />
		<mihuo-popup ref="mihuoPopup" :title="popTitle" height="500" v-model="showPopup" @close="showPopup = false"
			:buttonShow="true" @confirm="confirm">
			<view class="item-form" slot="input">
				<mihuo-input v-model="form.verifyReason" type="textarea" placeholder="请输入拒绝原因"></mihuo-input>
			</view>
		</mihuo-popup>

		<mihuo-bottom-button :buttonList="setButtonList" @click="getButton"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				showPopup: false,
				details: {},
				detailsShow: false,
				team: [],
				currentUserStatus: 0,
				form: {
					id: '',
					verifyReason: '',
					verifyStatus: 2,
				},
				popTitle: '拒绝原因',

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
				buttonShow:false,
				buttonList: [{
						name: '拒绝',
						status: false,
						statusList: [0]
					}, {
						name: '同意',
						status: true,
						statusList: [0]
					},
					{
						name: '下载PDF',
						status: true,
						statusList: [2]
					}
				],
			}
		},
		computed: {
			...mapState(['projectInfo']),
			getTypeName() {
				let result = this.visaTypeList.find(item => item.value == this.details.type)
				return result?.name
			},
			setButtonList() {
				// 如果定责人没有自己，则不需要显示拒绝、同意按钮
				if (this.buttonShow) {
					if (this.details.status == 2) {
						return [{
							name: '下载PDF',
							status: true,
							statusList: [2]
						}]
					}else{
						return []
					}
				}
				// 如果主状态为已拒绝，则不显示按钮
				if (this.details.status == 1) {
					return []
				}
				// 主订单审核通过
				if (this.details.status == 2) {
					return [{
						name: '下载PDF',
						status: true,
						statusList: [2]
					}]
				}
				// 主订单待审核中、自己也未审核
				if (this.details.status == 0) {
					if (this.currentUserStatus == 0) {
						return this.buttonList.filter(item => item.statusList.includes(Number(this.details.status)))
					}
				}
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getDetails()
			this.getWorkTypeList()
		},
		methods: {
			confirm() {
				this.form.verifyStatus = 1
				this.getVerify()
			},
			getButton(item) {
				if (item.name == '拒绝') {
					this.showPopup = true
				} else if (item.name == '同意') {
					this.form.verifyStatus = 2
					this.form.verifyReason = '同意'
					this.getVerify()
				} else {
					this.download()
				}
			},
			download() {
				// 变更=1 交底=2 验收=3 巡检=4  B端变更=5
				const fileName = '现场变更签证确认单'
				this.$util.downloadPdfReport(this.option.id, 5, fileName)
			},
			getVerify() {
				this.form.id = this.option.id
				this.$httpApi.getVerify(this.form).then(res => {
					if (res) {
						this.$util.toast('操作成功')
						this.getDetails()
					}
				})
			},
			getDetails() {
				this.$httpApi.getMyPageChangeDetails({
					id: this.option.id
				}).then(res => {
					if (res) {
						res['changeTypeName'] = this.changeTypeList.find(item => item.value == res.changeType).name
						let handleUserInputsName = res.handleUserInputs.map(item => {
							return item.handleSkillName
						})
						res['handleUserInputsName'] = handleUserInputsName.join('、')
						this.details = res
						this.setCurrentUserStatus()
						this.setTitle()
						this.detailsShow = true

					}
				})
			},
			setCurrentUserStatus() {
				let userId = uni.getStorageSync('userData').sysUser && uni.getStorageSync('userData').sysUser.userId
				let userIds = []
				this.details.handleUserInputs.forEach(item => {
					userIds.push(Number(item.handleUserId))
					if (item.handleUserId == userId) {
						this.currentUserStatus = item.status
					} 
				})
				if(!userIds.includes(userId)){
					this.buttonShow = true
				}
			},
			setTitle() {
				let resultName = this.statusList.find(item => item.value == this.details.status)
				let prefix = ''
				// 自己审核通过 ，单其他人未审核通过
				if (this.details.status == 0 && this.currentUserStatus == 2) {
					prefix = '其他人审核中-现场变更签证确认单'
				}
				let title = `${resultName.name}-现场变更签证确认单`
				uni.setNavigationBarTitle({
					title: prefix ? prefix : title
				})
			},
			getWorkTypeList() {
				if (!this.projectInfo.projectId) {
					return
				}
				this.$httpApi.taskMemberList({
					projectId: this.projectInfo.projectId
				}).then((res) => {
					this.team = []
					res.forEach(el => {
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
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.change-details {
		padding: 20rpx;
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
