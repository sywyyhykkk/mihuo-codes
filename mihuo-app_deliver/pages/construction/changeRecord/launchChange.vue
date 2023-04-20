<template>
	<view class="launch-change">
		<change-introduction v-model="form" :team="team"> </change-introduction>

		<view class="form-contain">
			<view class="item-form_contain">
				<view class="item-form">
					<mihuo-input type="select" v-model="form.typeName" required label="签证类型" placeholder="请选择"
						@click="getSelect('签证类型', visaTypeList)">
					</mihuo-input>
				</view>
				<view class="item-form">
					<!-- labelRight="常用语" -->
					<mihuo-input type="textarea" v-model="form.content" label="签证"  placeholder="请输入">
					</mihuo-input>
				</view>
			</view>
			<view class="item-form_contain">
				<view class="item-form">
					<mihuo-input type="select" v-model="form.stageName" required label="当前工序" placeholder="请选择"
						@click="getSelect('当前工序', selfGroupTaskList)"></mihuo-input>
				</view>
				<view class="item-form">
					<!-- labelRight="常用语" -->
					<mihuo-input type="textarea" v-model="form.description" label="变更描述" 
						placeholder="请输入">
					</mihuo-input>
				</view>
			</view>

			<view class="item-form_contain">
				<view class="item-form">
					<mihuo-input type="select" v-model="form.changeTypeName" required label="变动起因" placeholder="请选择"
						@click="getSelect('变动起因', changeTypeList)"></mihuo-input>
				</view>
			</view>

			<view class="item-form_contain">
				<view class="item-form">
					<mihuo-input type="select" v-model="form.handleUserInputsName" required label="定责合议"
						placeholder="请选择" @click="getSelect('定责合议',workTypeList)">
					</mihuo-input>
				</view>
			</view>

			<view class="item-form_contain">
				<view class="item-form">
					<mihuo-input type="textarea" v-model="form.remark" label="备注" placeholder="请输入"></mihuo-input>
				</view>
			</view>
		</view>


		<mihuo-popup ref="mihuoPopup" :title="popTitle" :typeList="typeList" :singleStatus="singleStatus" type="list"
			height="600" v-model="showPopup" @close="showPopup = false" :buttonShow="true" @confirm="confirm"
			@click="getPopupClick">
		</mihuo-popup>
		
		<mihuo-bottom-button :buttonList="buttonList" @click="getButton"></mihuo-bottom-button>
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
				popTitle: '',
				typeList: [],
				typeActive: -1,
				inputValue: '',
				inputValueList: [],
				singleStatus: true, // 选项单选
				form: {
					changeTypeName: '',
					handleUserInputsName: '',
					handleUserInputs: [], // 定责
					changeType: '', //	变动起因（1项目实施增减，2实施标准改变，3主辅材料变更，4图纸方案改动，5工况环境变化，6设备参数变动，7不可预知情况）			
					content: '', //	签证内容		
					description: '', //	变更描述		
					refusalReason: '', //	拒绝原因		
					status: 0, //	状态 0-待确认 1-拒绝 2-通过		
					name: '', //	变更名称		
					personId: '', //	发起人人员id			
					projectId: '', //	项目编号			
					projectStageId: '', //	项目阶段id		
					remark: '', //	备注		
					stageName: '', //	阶段名称	
					typeName: '',
					type: '', //	签证类型（1人工费，2服务费，3订单款，4工期，5材料定额，6验收标准）			
				},
				workTypeList: [],
				workTypeListData: [],
				selfGroupTaskList: [],
				team: [],
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
				buttonList: [{
					name: '发送各方确认',
					status: true
				}],
			}
		},
		computed: {
			...mapState(['orderInfo', 'projectInfo', 'userPersonId']),
			getClass() {
				let style = {};
				style.height = this.height + 'rpx'
				// style = Object.assign(style, this.customStyle);
				return style;
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getGroupTask()
			this.getWorkTypeList()
			this.setParamter()
		},
		methods: {
			setParamter() {
				this.form.projectId = this.projectInfo.projectId
				this.form.personId = this.userPersonId
			},
			getSelect(name, list) {
				this.popTitle = name
				this.showPopup = !this.showPopup
				this.typeList = list
				this.singleStatus = name == '定责合议' ? false : true
			},
			getGroupTask() {
				if (!this.orderInfo.orderId) {
					console.error('订单id不能为空')
					return
				}
				this.selfGroupTaskList = []
				this.$httpApi.selfGroupTask({
					orderId: this.orderInfo.orderId
				}).then((res) => {
					if (res) {
						res.forEach(el => {
							this.selfGroupTaskList.push({
								name: el.stageName,
								value: el.stageId
							})
						})
					}
				})
			},
			getWorkTypeList() {
				if (!this.projectInfo.projectId) {
					return
				}
				this.$httpApi.taskMemberList({
					projectId: this.projectInfo.projectId
				}).then((res) => {
					this.workTypeListData = res
					this.workTypeList.push({
						name: '客户',
						value: '',
						activeStatus: false
					})
					this.team = []
					res.forEach(el => {
						this.workTypeList.push({
							name: el.skillName,
							value: el.skillId,
							activeStatus: false
						})

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
			},
			getPopupClick(event) {
				let {item} = event
				if (Array.isArray(event)) {
					this.inputValueList = event
				} else {
					this.inputValue = item
				}
			},
			confirm() {
				switch (this.popTitle) {
					case '签证类型':
						this.form.typeName = this.inputValue.name
						this.form.type = this.inputValue.value
						break
					case '当前工序':
						this.form.stageName = this.inputValue.name
						this.form.projectStageId = this.inputValue.value
						break
					case '变动起因':
						this.form.changeTypeName = this.inputValue.name
						this.form.changeType = this.inputValue.value
						break
					case '定责合议':
						let nameList = this.inputValueList.map(item => {
							return item.name
						})
						this.form.handleUserInputs = []
						this.form.handleUserInputsName = nameList.join('、')

						if (this.form.handleUserInputsName.indexOf('客户') !== -1) {
							this.form.handleUserInputs.push({
								handleSkillId: '-10',
								handleSkillName: '客户',
								handleTime: "",
								handleUserId: this.orderInfo.userId,
								handleUserName: this.orderInfo.userName,
								handlePersonId: '',
								refusalReason: "",
								status: 0
							})
						}
						// console.table(this.inputValueList)
						this.workTypeListData.forEach(item => {
							this.inputValueList.forEach(item2 => {
								if (item.skillId == item2.value) {
									if (item.members) {
										item.members.forEach(item3 => {
											this.form.handleUserInputs.push({
												handleSkillId: item3.skillId,
												handleSkillName: item3.skillName,
												handlePersonId: item3.personId,
												handleTime: "",
												handleUserId: item3.userId,
												handleUserName: item3.name,
												refusalReason: "",
												status: 0
											})
										})
									}
								}
							})
						})
						break
				}
			},
			getButton(item) {
				// this.form = {
				// 	"changeTypeName": "项目标准改变",
				// 	"handleUserInputsName": "客户、项目管家、工人",
				// 	"handleUserInputs": [
				// 		{
				// 			"handleSkillId": "-10",
				// 			"handleSkillName": "客户",
				// 			"handleTime": "",
				// 			"handleUserId": "92",
				// 			"handleUserName": "付刚",
				// 			"handlePersonId": "",
				// 			"refusalReason": "",
				// 			"status": 0
				// 		},
				// 		{
				// 			"handleSkillId": "1",
				// 			"handleSkillName": "项目管家",
				// 			"handlePersonId": "440",
				// 			"handleTime": "",
				// 			"handleUserId": "194",
				// 			"handleUserName": "付刚",
				// 			"refusalReason": "",
				// 			"status": 0
				// 		},
				// 		// {
				// 		// 	"handleSkillId": "11",
				// 		// 	"handleSkillName": "木工",
				// 		// 	"handlePersonId": "409",
				// 		// 	"handleTime": "",
				// 		// 	"handleUserId": "207",
				// 		// 	"handleUserName": "付刚",
				// 		// 	"refusalReason": "",
				// 		// 	"status": 0
				// 		// }
				// 	],
				// 	"changeType": 2,
				// 	"content": "水电费水电费水电费",
				// 	"description": "水电费水电费水电费",
				// 	"refusalReason": "",
				// 	"status": 0,
				// 	"name": "",
				// 	"personId": 440,
				// 	"projectId": "1146",
				// 	"projectStageId": "199",
				// 	"remark": "士大夫撒的发送到发送到分",
				// 	"stageName": "第二个阶段",
				// 	"typeName": "服务费变更",
				// 	"type": 2
				// }

				if (!this.form.type) {
					this.$util.toast('请选择签证类型')
					return
				}

				if (!this.form.projectStageId) {
					this.$util.toast('请选择当前工序')
					return
				}

				if (!this.form.changeType) {
					this.$util.toast('请选择变动起因')
					return
				}

				if (!this.form.handleUserInputsName) {
					this.$util.toast('请选择定责合议')
					return
				}

				this.$httpApi.addChange(this.form).then(res => {
					if (res) {
						this.$util.toast('发送成功')
						setTimeout(()=>{
							this.goBack()
						},1000)
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.launch-change {
		padding: 20rpx 0rpx 0rpx 0rpx;

		.form-contain {
			margin-top: 4rpx;
		}

		.item-form_contain {
			padding: 34rpx 0rpx;
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 4rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.item-form {
				margin-bottom: 26rpx;
				padding: 0rpx 40rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}
		}
	}
</style>
