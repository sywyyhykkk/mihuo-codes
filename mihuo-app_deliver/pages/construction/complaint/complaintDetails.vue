<template>
	<view>
		<view class="operation-records">
			<view class="operation-records-item" v-for="(item,index) in list" :key="index">
				<view class="left-contain">
					<u-avatar class="node" size="52" :src="$util.thumbnailImage(item.avatar,true)">
					</u-avatar>
				</view>
				<view class="right-contain">
					<view class="item-header">
						<text class="name">{{item.jobName}}({{item.realName}})</text>
						<text class="time" v-if="item.dealTime">{{item.dealTime.substring(0,16)}} </text>
						<text class="title">{{getStatusName(item,index)}}</text>
					</view>
					<view class="item-records">
						<view v-if="item.typeName === '问题'">
							<penalty-item :info="item"></penalty-item>
						</view>
						<view v-if="item.typeName === '申请'">
							<records-desc-item :info="item"></records-desc-item>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-text-contain">
			<view :class="[item.status === 1?'refused-to':'submit-text']" @click="submit(item.label)"
				v-for="(item,index) in getButtonShow" :key="index">
				{{item.label}}
			</view>
		</view>
	</view>

</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	export default {
		data() {
			return {
				list: [],
				option: {},
				// -1->查询全部 0->已发起待处理 1->撤销 2->同意 3->驳回
				statusType: [1, 2, 3], // 1 撤销  2 通过  3 拒绝
				typeNameStatus: false, // true(申请)  false(申述)
				pageTypeStatus: false, // 我发起的、发送给我的
				personId: '',
				itemTypeList: [],
				buttonList: [{
						label: '拒绝',
						value: 1,
						status: 1
					},
					{
						label: '同意',
						value: 1,
						status: 2
					},
					{
						label: '撤销',
						value: 2,
						status: 1
					},
					{
						label: '催一下',
						value: 2,
						status: 2
					}
				],
				details: {},
				problemList: []
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.setParameter()
			this.getTypeName()
			this.getDetails()
		},
		computed: {
			 ...mapState(['projectInfo','nodeInfo','userPersonInfo','remainingDays']),
			getButtonShow() {
				if (this.details.status === 0) {
					if (this.option.pageType === '我发起的') {
						return this.buttonList = this.buttonList.filter(item => item.value === 2)
					} else {
						return this.buttonList.filter(item => item.value === 1)
					}
				} else {
					return []
				}
			},
		},
		methods: {
			setParameter(){
				this.personId = this.userPersonInfo.personId
			},
			
			getTypeName() {
				if (uni.getStorageSync('typeName') === '申请') {
					this.typeNameStatus = true
					uni.setNavigationBarTitle({
						title: '申请详情'
					})
				} else {
					this.typeNameStatus = false
					uni.setNavigationBarTitle({
						title: '申述详情'
					})
				}
				
				
			},
			getStatusName(item, index) {
				if (item.typeName !== '问题') {
					let tempStatus = ''
					switch (item.status) {
						case 0:
							return index > 0 ? tempStatus = this.typeNameStatus === true ? '发起申请' : '发起申述' : ''
						case 1:
							return '撤销'
						case 2:
							return tempStatus = this.typeNameStatus === true ? '同意申请' : '同意申述'
						case 3:
							return tempStatus = `${uni.getStorageSync('typeName')}失败`
					}
				}
			},
			getDetails() {
				this.list = []
				this.$httpApi.getApplyDetails({
					id: this.option.id,
				}).then(res => {
					this.details = res
					this.getTypeName()
					if (res) {
						if (res.orderForfeit) { // 根据罚款问题申述
							this.list.unshift({ // 向数组开头添加元素
								avatar: res.dealPerson && res.dealPerson.avatar,
								jobName: res.dealPerson && res.dealPerson.skillName,
								realName: res.dealPerson && res.dealPerson.name,
								dealTime: res.created,
								comment: res.comment,
								orderForfeit: res.orderForfeit,
								typeName: '问题',
								audio: res.audio !== '' && JSON.parse(res.audio),
								pics: res.pics
							})
							this.list.push({ // 添加发起人
								avatar: res.person && res.person.avatar,
								jobName: res.person && res.person.skillName,
								realName: res.person && res.person.name,
								dealTime: res.applyTime,
								comment: res.comment,
								typeName: '申请',
								audio: res.audio !== '' && JSON.parse(res.audio),
								pics: res.pics,
								status: 0
							})
							res.applyLogList && res.applyLogList.map(item => { // 添加记录
								this.list.push({
									avatar: item.person && item.person.avatar,
									jobName: item.person && item.person.skillName,
									realName: item.person && item.person.name,
									dealTime: item.dealTime,
									comment: item.contents,
									typeName: '申请',
									status: item.status
								})
							})
						} else {
							//整改问题申述
							if (res.applyTypeName === '整改') {
								this.getRectification(res.businessId, res)
								return
							}
							// 普通申述、申请
							res.applyLogList && res.applyLogList.map(item => {
								item['typeName'] = '申请'
								item['comment'] = item.contents
								item['avatar'] = item.person && item.person.avatar
								item['jobName'] = item.person && item.person.skillName
								item['realName'] = item.person && item.person.name
							})
							this.list = res.applyLogList || []
							this.list.unshift({
								avatar: res.person && res.person.avatar,
								jobName: res.person && res.person.skillName,
								realName: res.person && res.person.name,
								dealTime: res.created,
								comment: res.comment,
								orderForfeit: res.orderForfeit,
								status: 0,
								customAmount: res.customAmount,
								typeName: '申请',
								audio: res.audio !== '' && JSON.parse(res.audio),
								pics: res.pics
							})
						}
						// this.getProblem(res)
					}
				})
			},
			getProblem(res) { // 获取问题
				this.problemList = []
				this.problemList.push({
					avatar: res.person && res.person.avatar,
					jobName: res.person && res.person.skillName,
					realName: res.person && res.person.name,
					dealTime: res.created,
					comment: res.comment,
					orderForfeit: res.orderForfeit,
					status: 0,
					audio: res.audio !== '' && JSON.parse(res.audio),
					pics: res.pics
				})
			},
			getRecord() { // 记录

			},
			preview(ul) {
				uni.previewImage({
					current: 1,
					urls: [ul],
				})
			},
			submit(val) {
				if (val === '催一下') {
					this.$util.toast("操作成功~");
					return
				}

				let tempStatus = 0
				switch (val) {
					case '拒绝':
						tempStatus = 3
						break
					case '同意':
						tempStatus = 2
						break
					case '撤销':
						tempStatus = 1
						break
				}
				this.debounce(() => {
					this.$httpApi.applyUpdate({
						personId: this.personId,
						parentId: this.details.id,
						status: tempStatus,
						contents: this.getContents(tempStatus),
						currSkillName: this.userPersonInfo.skillName, // 操作岗位
						currPersonName: this.userPersonInfo.name, // 操作岗位姓名
						currCityOperatorId: this.userPersonInfo.cityOperatorId, // 当前企业编号
						managerChangeAmount: this.details.customAmount && this.details.customAmount !== '' && JSON
							.parse(this.details.customAmount).managerChangeAmount
					}).then(res => {
						if (res) {
							if(this.option.toDoType){
								this.$httpApi.bizpendingHandle({
									bizPendingDetailId:this.option.bizPendingDetailId,
									handlePersonId:this.personId
								}).then(res =>{
									uni.navigateBack()
								})
							}else{
								uni.navigateBack()
							}
						}
					})
				}, 200)
			},
			getContents(val) {
				switch (val) {
					case 1:
						return uni.getStorageSync('typeName') + '撤销'
					case 2:
						return uni.getStorageSync('typeName') + '同意'
					case 3:
						return uni.getStorageSync('typeName') + '拒绝'
				}
			},
			getRectification(val, resAll) {
				this.list.push({ // 添加发起人
					avatar: resAll.person.avatar,
					jobName: resAll.person.name,
					realName: resAll.person.skillName,
					dealTime: resAll.applyTime,
					comment: resAll.comment,
					orderForfeit: resAll.orderForfeit,
					status: 0,
					typeName: '申请',
					audio: resAll.audio !== '' && JSON.parse(resAll.audio),
					pics: resAll.pics
				})
				resAll.applyLogList && resAll.applyLogList.map(item => { // 添加记录
					this.list.push({
						avatar: item.avatar,
						jobName: item.jobName,
						realName: item.realName,
						dealTime: item.dealTime,
						comment: item.status === 2 ? '同意申述' : '申述失败',
						typeName: '申请',
						audio: res.audio !== '' && JSON.parse(res.audio),
						pics: item.pics,
						status: item.status
					})
				})

				if(val == 0){
					return
				}
				this.$httpApi.getOrderabarbeitungDetails({ // 查询整改问题详情
					id: val
				}).then(res => {
					if (!res) {
						return
					}
					this.list.unshift({ // 添加问题
						avatar: res.person.avatar,
						jobName: res.person.name,
						realName: res.person.skillName,
						dealTime: res.created,
						comment: res.issueName,
						status: 0,
						typeName: '申请',
						audio: res.issueAudio !== '' && JSON.parse(res.issueAudio),
						pics: res.issuePics
					})

				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.operation-records {
		padding: 36rpx 22rpx 130rpx 50rpx;

		.operation-records-item {
			display: flex;
			position: relative;

			&:last-child {
				.right-contain {
					padding-bottom: 0rpx;
				}
			}

			.left-contain {
				border-left: 2rpx dashed #C4C4C4;
				width: 40rpx;

				.node {
					position: absolute;
					left: -24rpx;
					top: -6rpx;
				}
			}

			.right-contain {
				width: 100%;
				padding-bottom: 36rpx;

				.item-header {
					margin-bottom: 34rpx;

					.time {
						// margin-right: 20rpx;
					}

					.name {
						margin-right: 4rpx;
					}

					.time,
					.name,
					.title {
						font-size: 28rpx;
						color: #909199;
					}
				}

				.item-records {
					// background-color: #FFFFFF;
					// padding: 40rpx 44rpx 40rpx 46rpx;
					// border-radius: 10rpx;

					.records-header {
						display: flex;
						justify-content: space-between;
						margin-bottom: 36rpx;

						.left {
							font-weight: bold;
							font-size: 28rpx;
							color: $seconFontColor;
						}

						.right {
							font-size: 26rpx;
							color: $themeColor;

						}
					}

					.text-all-contain {
						padding-left: 20rpx;

						.text-contain {
							margin-bottom: 28rpx;

							.title {
								font-weight: bold;
								font-size: 26rpx;
								color: #606166;
								margin-bottom: 10rpx;
							}

							.text-desc {
								font-size: 28rpx;
								color: $seconFontColor;

								.text-contain {
									margin-right: 66rpx;

									&:last-child {
										margin-right: 0;
									}

									.text-label {
										font-size: 24rpx;
										color: #909199;
										margin-right: 4rpx;

									}

									.text-value {
										font-size: 24rpx;
										color: #FF5D35;
									}
								}
							}

						}

						.image-contain {
							margin-bottom: 44rpx;
							display: flex;
							flex-wrap: wrap;

							.record-item-img {
								width: 160rpx;
								margin-right: 16rpx;
								margin-bottom: 16rpx;
							}
						}
					}

					.total-contain {
						display: flex;

						.left {
							font-weight: bold;
							font-size: 32rpx;
							color: $seconFontColor;
							margin-right: 24rpx;
						}

						.text-contain {
							margin-right: 26rpx;

							&:last-child {
								margin-right: 0rpx;
							}

							.text-label {
								font-size: 28rpx;
								color: #606166;
								margin-right: 4rpx;
							}

							.text-value {
								font-size: 28rpx;
								color: #FF5D35;
							}
						}
					}

				}

			}
		}
	}

	.submit-text-contain {
		// background-color: #FFFFFF;
		padding: 20rpx 64rpx 20rpx 64rpx;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		width: 100%;

		.submit-text,
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

		.submit-text {
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
