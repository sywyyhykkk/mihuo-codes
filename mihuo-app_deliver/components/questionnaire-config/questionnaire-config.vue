<template>
	<view class="questionnaire">
		<view class="space-list-sticky">
			<view v-if="uTabsFalse && questionnaireList && questionnaireList.length > 0" class="u-tabs-list">
				<u-tabs class="u-tabs-contain" height="98" font-size="28" inactive-color="#909199"
					active-color="#002FA5" :active-item-style="activeItemStyle" :list="questionnaireList"
					:is-scroll="true" :current="tabCurrent" @change="change">
				</u-tabs>
			</view>
		</view>
		<view class="questionnaire-item" :id="'questionnaire-item-'+index" v-for="(item,index) in questionnaireList"
			:key="item.id">
			<view v-if="item" class="title-top" :class="[uTabsFalse ? 'title-top-active':'']"
				:style="{backgroundColor:titleObejct.backgroundColor}">
				<view class="left">
					<view class="item-title" v-if="item.partName">
						<image class="icon-image" src="/static/images/title.png" mode=""></image>
						{{item.partName}}
					</view>
					<view class="item-describe" v-if="item.partDesc">{{item.partDesc}}</view>
				</view>
			</view>
			<view v-if="item">
				<view class="questions-item" v-for="(el,num) in item.surveyTemplateQuesDTOList" :key="num">
					<view class="questions-item-contain">
						<view :id="'questions-item-title-'+ el.id " class="questions-item-title"
							:class="el.quesDesc ? 'title-margin-default':'title-margin' ">
							<view class="item-left">
								<text v-if="Number(el.requiredFlag)" class="required-flag">*</text>
								{{num + 1}}.{{el.quesName}}
								{{el.quesType == 2 ? '(多选)':''}}
							</view>
							<view v-if="confirmStatus && el.allowTempUnConfirmFlag == 1" class="item-right">
								<text :class="el.confirmStatus? 'text-warring':''">暂不确认</text>
								<u-switch v-model="el.confirmStatus" size="24" :key="el.id" active-color="#FF5D35"
									inactive-color="#929292" @change="getConfirmStatus($event,el)">
								</u-switch>
							</view>
						</view>
						<view v-if="el.quesDesc" class="questions-item-title-desc">
							{{el.quesDesc}}
						</view>
					</view>

					<view class="answer-contain">
						<!-- 答案为文本输入、补充为文件输入 -->
						<view v-if="[3].includes(Number(el.quesType))" class="data-input">
							<view v-if="el.allowUploadFileFlag == 1 && el.answer" class="image-contain">
								<image-upload-new v-model="el.supplementAnswerFile" count="9"
									:key="el.supplementAnswerFile" />
							</view>
							<view class="input-contain">
								<u-input v-model="el.answer" placeholder-style="color: #999999;font-size: 26rpx;"
									class="describe-input" height="156" type="textarea" placeholder="请输入描述信息"
									:border="true" />
							</view>
						</view>
						<!-- 答案为文件输入、补充为文本输入 -->
						<view v-if="[4].includes(Number(el.quesType))" class="data-input">
							<view class="image-contain">
								<image-upload-new v-model="el.answer" count="9" :key="el.answer" />
							</view>
							<view v-if="el.allowAddDescFlag == 1 && el.answer !== '[]'" class="input-contain">
								<u-input v-model="el.supplementAnswerText"
									placeholder-style="color: #999999;font-size: 26rpx;" class="describe-input"
									height="156" type="textarea" placeholder="请输入描述信息" :border="true" />
							</view>
						</view>
						<!-- 多选或者单选 -->
						<view
							v-if="[1,2].includes(Number(el.quesType)) && (el.allowUploadFileFlag == 1 || el.allowAddDescFlag == 1 )"
							class="no-input">
							<view class="image-contain" v-if="el.allowUploadFileFlag == 1">
								<image-upload-new v-model="el.supplementAnswerFile" count="9"
									:key="el.supplementAnswerFile" />
							</view>
							<view v-if="el.allowAddDescFlag == 1 " class="input-contain data-supplement_input">
								<u-input v-model="el.supplementAnswerText"
									placeholder-style="color: #999999;font-size: 26rpx;" class="describe-input"
									height="156" type="textarea" placeholder="请输入描述信息" :border="true" />
							</view>
						</view>

						<view v-if="[1,2].includes(Number(el.quesType))" class="questions-item-optionList">
							<!-- 单选 -->
							<view v-if="el.quesType == 1" class="optionName">
								<u-radio-group v-model="el.answer">
									<view class="option-name-item" v-for=" (ev,nums) in el.surveyTemplateOptionDTOList"
										:key="ev.id">
										<u-radio @change="radioGroupItemChange($event,el,nums)" active-color="#002FA5"
											:name="ev.optionName">
											<text class="item-option-name">{{ev.optionName}}</text>
										</u-radio>
										<view v-if="[1].includes(Number(el.quesType)) && ev.radioName == ev.optionName"
											class="no-input_item">
											<view class="image-contain" v-if="ev.allowUploadFileFlag == 1">
												<image-upload-new v-model="ev.supplementAnswerFile" count="9"
													:key="ev.supplementAnswerFile" />
											</view>
											<view v-if="ev.allowAddDescFlag == 1 "
												class="input-contain data-supplement_input">
												<u-input v-model="ev.supplementAnswerText"
													placeholder-style="color: #999999;font-size: 26rpx;"
													class="describe-input" height="106" type="textarea"
													placeholder="请输入描述信息" :border="true" />
											</view>
										</view>
									</view>
								</u-radio-group>
							</view>

							<!-- 多选 -->
							<view v-if="el.quesType == 2" class="optionName">
								<u-checkbox-group @change="checkboxGroupChange(index,num)">
									<view class="option-name-item" v-for=" (ev,nums) in el.surveyTemplateOptionDTOList"
										:key="nums">
										<u-checkbox active-color="#002FA5" shape="circle" v-model="ev.checked"
											:name="ev.optionName">
											<text class="item-option-name">{{ev.optionName}}</text>
										</u-checkbox>

										<view v-if="[2].includes(Number(el.quesType)) && ev.checked"
											class="no-input_item">
											<view class="image-contain" v-if="ev.allowUploadFileFlag == 1">
												<image-upload-new v-model="ev.supplementAnswerFile" count="9"
													:key="ev.supplementAnswerFile" />
											</view>
											<view v-if="ev.allowAddDescFlag == 1 "
												class="input-contain data-supplement_input">
												<u-input v-model="ev.supplementAnswerText"
													placeholder-style="color: #999999;font-size: 26rpx;"
													class="describe-input" height="106" type="textarea"
													placeholder="请输入描述信息" :border="true" />
											</view>
										</view>
									</view>
								</u-checkbox-group>
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>

		<!-- 暂不确认原因 -->
		<u-popup v-model="showPopup" border-radius="30" height="600" mode="bottom" :safe-area-inset-bottom="false"
			:closeable="true" :mask-close-able="false" @close="getClose()">
			<view class="form-contain">
				<view class="title">
					请输入原因
				</view>
				<view class="item-contain">
					<view class="desc-contian">
						<!-- <text class="public-name">个人简介</text> -->
						<view class="public-item-bottom">
							<textarea v-model="reason" maxlength="140"
								style="padding:6px 9px;border-radius: 8rpx;width: 100%;height:200rpx;background: #F7F7F7;font-size:28rpx"
								placeholder="请输入不确认原因" placeholder-style="color:#909199;font-size: 13px" />
						</view>
					</view>
				</view>
				<view class="item-button-contain">
					<view class="button-list">
						<view class="item-button" :class="[item.status ? 'item-button-active':'']"
							v-for="(item,index) in buttonList" :key="index" @click="getButton(item)">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	// answerType   1 单选  2多选  3文字输入  4上传
	import {
		mapState,
	} from 'vuex'
	import formCache from '@/plugins/formCache'
	import {
		deepClone
	} from '@/plugins/utils.js'
	export default {
		name: 'questionnaire-config',
		props: {
			type: {
				type: String,
				default: ''
			},
			isEditStatus: { // 编辑
				type: Boolean,
				default: false
			},
			isEditStatusId: { // 编辑交底id
				type: String,
				default: ''
			},
			cacheId: { // 缓存id
				type: String,
				default: ''
			},
			id: {
				type: String,
				default: ''
			},
			titleObejct: {
				type: Object,
				default: {
					backgroundColor: '#f5f5f5',
					showStatus: true
				}
			},
			formCacheObejct: {
				type: Object,
				default: () => {}
			},
			uTabsFalse: {
				type: Boolean,
				default: false
			},
			confirmStatus: { // 暂不确认
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				questionnaireList: [],
				questionnaireDataList: [],
				tempSelectName: [],
				tabsList: [],
				tabCurrent: 0,
				value: '',
				questionnaireObject: {},
				answerObject: {},
				surveyTemplateId: '',
				recoveryFormCache: '',
				imageUploadNewIndex: 0,
				titlePositionList: [],
				checked: false,
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '28rpx'
				},
				showPopup: false,
				reason: '',
				questionId: '',
				todoDiscloseList: [],
				buttonName: '',
				buttonList: [{
						name: '取消',
						status: false
					},
					{
						name: '确认',
						status: true
					}
				],
				rollStatus: true,
			}
		},
		mounted() {
			this.getQuestionnaire()

		},
		watch: {
			questionnaireObject: {
				handler(newVal, oldVal) {},
				deep: true
			},

		},
		computed: {
			...mapState(['orderInfo', 'nodeInfo', 'projectInfo']),
			setQuestionnaireList() {
				if (this.uTabsFalse) {
					return [this.questionnaireList[this.tabCurrent]]
				} else {
					return this.questionnaireList
				}
			}
		},
		methods: {
			handleScroll() {

			},
			getQuestionnaire() {
				if (this.id) {
					switch (this.type) {
						case '量房':
							this.setAmountOfRoom()
							break;
						case '测量':
							this.clarificaiton()
							break;
						case '交底':
							this.clarificaiton()
							break;
						default:
							break
					}
				}
			},
			getDetails() {
				this.$httpApi.discloseDetails({
					id: this.isEditStatusId
				}).then(res => {
					if (res) {
						if (res.answer && this.$isJSON(res.answer.answerContent)) {
							this.questionnaireList = JSON.parse(res.answer.answerContent)
						}
						//  获取待办开工交底
						if (this.confirmStatus) {
							this.getTodoDiscloseList()
						}
						// 在组件form-cache-item  中用到
						this.getFormCache()
						this.setFormCache()
						uni.$emit('saveTiming')
					}
				})
			},
			setAmountOfRoom() {
				this.$httpApi.selectRoomGet({
					nodeId: this.id,
				}).then(res => {
					if (res) {
						this.answerObject = res
						this.surveyTemplateId = res.answer.surveyTemplateId
						this.questionnaireList = res.answer.answerContent !== '' && JSON.parse(res
							.answer
							.answerContent)


						uni.$emit('saveTiming')

						this.getFormCache()
						this.setFormCache()
						this.getInput()
					} else {
						this.roomSurveyConfigCorpGet()
					}
				})
			},
			clarificaiton() {
				this.$httpApi.getTemplateInfoById({
					id: this.id
				}).then(res => {
					if (res) {
						this.questionnaireObject = res
						res.surveyTemplatePartDTOList.map((item, index) => {
							item.surveyTemplateQuesDTOList.map(el => {
								el['groupingIndex'] = this.initializeOptions(
									el) // 初始化选项
								el['answer'] = this.initializeAnswer(el) // 初始化答案
								el['supplementAnswerFile'] = '[]' // 初始化补充说明文件字段
								el['supplementAnswerText'] = '' // 初始化补充说明文本字段
							})
						})
						// 1.是否允许补充说明(文本输入 = allowAddDescFlag)、是否允许(上传文件 = allowUploadFileFlag)
						// 2.若该问题答案为文本录入类型，则补充录入类型只能为上传类型

						this.questionnaireList = res.surveyTemplatePartDTOList || []
						this.questionnaireDataList = res.surveyTemplatePartDTOList
						// 编辑交底问卷
						if (this.isEditStatus) {
							this.getDetails()
						} else {
							// 在组件form-cache-item  中用到
							this.getFormCache()
							this.setFormCache()
							//  获取待办开工交底
							if (this.confirmStatus) {
								this.getTodoDiscloseList()
							}
							uni.$emit('saveTiming')
						}

						// 避免问卷组件还未加载成功就提交数据
						this.$emit('getLoading')
						this.setUtabsList()
						this.getInput()
						this.initSupplementField()
					}
				})
			},
			/**
			 * 恢复缓存
			 * 
			 * */
			recovery(callback) {
				this.questionnaireList = this.recoveryFormCache
				this.getInput()
				callback && callback()
			},
			setFormCache() {
				new formCache().initCache({
					cacheId: this.cacheId,
					items: {
						details: this.questionnaireObject,
						questionnaireList: this.questionnaireList
					},
					formRemark: this.formCacheObejct && this.formCacheObejct.formRemark,
					fileAudio: this.formCacheObejct && this.formCacheObejct.fileAudio,
					fileImage: this.formCacheObejct && this.formCacheObejct.fileImage
				}, (item) => {
					if (item) {
						if (item.data) {
							// 处理保存的是空数据时
							this.recoveryFormCache = item.data.items.questionnaireList || this
								.questionnaireDataList
						}
					}
					this.getInput()
				})
			},
			setUtabsList() {
				if (this.uTabsFalse && this.questionnaireList) {
					this.questionnaireList.map(item => {
						item['name'] = item.partName
					})
				}
			},
			roomSurveyConfigCorpGet() { // 查询企业的量房问卷id
				this.$httpApi.roomSurveyConfigCorpGet({
					companyId: this.orderInfo.companyId
				}).then(res => {
					if (res) {
						this.getTemplateDetailsById(res)
					}
				})
			},
			getTemplateDetailsById(res) { // 查询问卷详情
				this.$httpApi.getTemplateDetailsById({
					id: res
				}).then(res => {
					if (res) {
						this.surveyTemplateId = res.id
						res.surveyTemplatePartDTOList.map(item => {
							item.surveyTemplateQuesDTOList.map(el => {

								el['groupingIndex'] = this.initializeOptions(el) // 初始化选项
								el['answer'] = this.initializeAnswer(el) // 初始化答案
								el['supplementAnswerFile'] = '[]' // 初始化补充说明文件字段
								el['supplementAnswerText'] = '' // 初始化补充说明文本字段
							})
						})
						this.questionnaireList = res.surveyTemplatePartDTOList
						this.questionnaireDataList = res.surveyTemplatePartDTOList

						this.setUtabsList()
						// this.$forceUpdate()
						this.getFormCache()
						this.setFormCache()
						this.getInput()
					}
				})
			},
			initializeOptions(el) {
				if (el.quesType === '2') { // 多选
					el.surveyTemplateOptionDTOList.map(item => {
						item['checked'] = false
						item['supplementAnswerFile'] = '[]' // 初始化补充说明文件字段
						item['supplementAnswerText'] = '' // 初始化补充说明文本字段
					})
				} else if (el.quesType === '1') { // 单选
					el.surveyTemplateOptionDTOList.map(item => {
						item['radioName'] = ''
						item['supplementAnswerFile'] = '[]' // 初始化补充说明文件字段
						item['supplementAnswerText'] = '' // 初始化补充说明文本字段
					})
				}
			},
			initializeAnswer(el) {
				if ([3, 4].includes(Number(el.quesType))) {
					el.surveyTemplateOptionDTOList = []
					if ([4].includes(Number(el.quesType))) {
						return '[]'
					}
				} else {
					if (el.quesType == 1) {
						let tempAnswer = ''
						el.surveyTemplateOptionDTOList.map(item => {
							if (item.defaultFlag == 1) {
								tempAnswer = item.optionName
								item['radioName'] = tempAnswer
							}
						})
						return tempAnswer
					} else {
						let tempAnswer = ''
						let tempAnswerList = []
						el.surveyTemplateOptionDTOList.map(item => {
							if (item.defaultFlag == 1) {
								item['checked'] = true
								tempAnswerList.push(item.optionName)
							}
						})
						return tempAnswerList.join(',')
					}
				}
			},
			radioGroupItemChange(event, ev, index) {
				ev.surveyTemplateOptionDTOList.forEach((el, num) => {
					if (num == index) {
						el['radioName'] = event
					} else {
						el['radioName'] = ''
						// 切换时清空
						el['supplementAnswerFile'] = '[]'
						el['supplementAnswerText'] = ''
					}
				})
				this.getInput()
			},
			checkboxGroupChange(index, num) {
				let tempList = this.questionnaireList[index]['surveyTemplateQuesDTOList'][num][
					'surveyTemplateOptionDTOList'
				]
				let tempOptionName = []
				tempList.map(item => {
					if (item.checked) {
						tempOptionName.push(item.optionName)
					}
				})
				this.questionnaireList[index]['surveyTemplateQuesDTOList'][num]['answer'] = tempOptionName.join(',')
				// 切换时清空
				this.questionnaireList[index]['surveyTemplateQuesDTOList'][num].surveyTemplateOptionDTOList.forEach(el => {
					if (!el.checked) {
						el['supplementAnswerFile'] = '[]'
						el['supplementAnswerText'] = ''
					}
				})
				// this.$forceUpdate()
				this.getInput()
			},
			/**
			 * @description 初始化题目位置,用于自动定位到未作答的题目附近
			 * */
			saveTitlePosition() {
				this.questionnaireList.map((item, index) => {
					item.surveyTemplateQuesDTOList.map(ev => {
						uni.createSelectorQuery().select("#questions-item-title-" + ev.id)
							.boundingClientRect(res => {
								if (res) {
									ev['top'] = res.top
								}
							}).exec()
					})
				})
				this.getInput()
			},
			/**
			 * @description 定位到未作答的题目附近
			 * */
			titleLocation(item) {
				// 偏移值
				// #ifdef APP-PLUS
				const offset = 80
				// #endif
				// #ifdef H5
				const offset = 25
				// #endif	
				uni.createSelectorQuery().select('#add-disclosure-contain')
					.boundingClientRect(data => {
						uni.createSelectorQuery().select("#questions-item-title-" + item.id)
							.boundingClientRect(
								res => {
									uni.pageScrollTo({
										duration: 0,
										scrollTop: res.top - data.top - 53 - 44 -
											offset // 目标盒子 - 最外层盒子 -  顶部tab - 导航栏 - 偏移
									})
								}).exec()
					}).exec()
			},
			/**
			 * @description 定位段落
			 * */
			change(index) {
				this.tabCurrent = index
				// 导航栏高度
				// #ifdef H5
				const offset = 44
				// #endif
				// #ifdef APP-PLUS
				const offset = 100
				// #endif

				// 不用去触发setLocationType方法
				this.rollStatus = false
				uni.createSelectorQuery().select('#add-disclosure-contain')
					.boundingClientRect(data => {
						uni.createSelectorQuery().select("#questionnaire-item-" + index)
							.boundingClientRect(res => {
								if (res) {
									// 目标盒子 -  偏移
									let result = res.top - data.top - offset
									uni.pageScrollTo({
										duration: 0,
										scrollTop: result
									})
									// 延时放开限制
									setTimeout(() => {
										this.rollStatus = true
									}, 100)
								}
							}).exec()

					}).exec()

			},
			/**
			 * @description 因为内容高度不确定，只能滚动的时候计算
			 * */
			setLocationType(ev) {
				if (!this.rollStatus) {
					return
				}
				// 设置10 的偏移值
				const offset = 10
				// 导航栏高度
				// #ifdef H5
				const navigationHeight = 44
				// #endif
				// #ifdef APP-PLUS
				const navigationHeight = 80
				// #endif

				// 避免直接滑动到顶部
				if (ev.scrollTop + offset < 90) {
					this.tabCurrent = 0
					return
				}

				// 避免滚动时一直在计算
				this.debounce(() => {
					this.questionnaireList.forEach((item1, index) => {
						uni.createSelectorQuery().select('#add-disclosure-contain')
							.boundingClientRect(data => {

								uni.createSelectorQuery().select("#questionnaire-item-" + index)
									.boundingClientRect(res => {
										if (res) {
											// 目标盒子 - 最外层盒子  - 偏移
											let result = res.top - data.top - navigationHeight
											// 滚动距离+目标高度 >= 页面滚动条高度 && 页面滚动条高度 + 偏移 >= 滚动距离
											if (result + res.height >= ev.scrollTop && ev
												.scrollTop + navigationHeight >= result) {
												this.tabCurrent = index
											}
										}
									}).exec()
							}).exec()
					})
				}, 200)
			},
			getFormCache() {
				uni.$emit('formCache', {
					cacheId: this.cacheId,
					items: {
						details: this.questionnaireObject,
						questionnaireList: this.questionnaireList
					},
					formRemark: this.formCacheObejct && this.formCacheObejct.formRemark,
					fileAudio: this.formCacheObejct && this.formCacheObejct.fileAudio,
					fileImage: this.formCacheObejct && this.formCacheObejct.fileImage
				})
			},
			getInput() {
				switch (this.type) {
					case '量房':
						this.$emit('input', {
							details: this.answerObject,
							questionnaireList: this.questionnaireList,
							surveyTemplateId: this.surveyTemplateId
						})
						break;
					case '测量':
						this.$emit('input', {
							details: this.questionnaireObject,
							questionnaireList: this.questionnaireList
						})
						break;
					case '交底':
						this.$emit('input', {
							details: this.questionnaireObject,
							questionnaireList: this.questionnaireList
						})
						break;
					default:
						break
				}


			},
			/**
			 * @description 获取待办开工交底 
			 * */
			getTodoDiscloseList() {
				this.$httpApi.todoDiscloseList({
					nodeId: this.nodeInfo.nodeId,
					projectId: this.projectInfo.projectId
				}).then(res => {
					if (res) {
						this.todoDiscloseList = res
						let resultIds = []
						this.todoDiscloseList.forEach(es => {
							resultIds.push(Number(es.questionId))
						})
						// 触发视图更新
						let result = deepClone(this.questionnaireList)
						result.map((item, index) => {
							item.surveyTemplateQuesDTOList.map(el => {
								let confirmStatus = false
								if (resultIds.length > 0) {
									if (resultIds.includes(Number(el.id))) {
										el['confirmStatus'] = true
									} else {
										el['confirmStatus'] = false
									}
								} else {
									el['confirmStatus'] = false
								}
							})
						})
						this.questionnaireList = result
						this.getInput()
						this.$store.commit('setTemplatePendingCount', this.todoDiscloseList.length)
					}
				})
			},
			/**
			 * @description 填写、删除不确认原因
			 * */
			getConfirmStatus(item, ev) {
				this.questionId = ev.id
				this.questionInfo = ev
				if (ev.confirmStatus) {
					this.showPopup = true
				} else {
					this.showPopup = false
					if (this.todoDiscloseList.length > 0) {
						let todoId = this.todoDiscloseList.find(el => el.questionId == ev.id)
						if (todoId) {
							this.$httpApi.todoDiscloseDelete({
								id: todoId.id
							}).then(res => {
								this.getTodoDiscloseList()
							})
						}

					}
				}
			},
			getClose() {
				this.questionnaireList.map((item, index) => {
					item.surveyTemplateQuesDTOList.map(el => {
						if (this.questionId == el.id) {
							if (this.buttonName !== '确认') {
								el['confirmStatus'] = false
							}
						}
					})
				})
				this.reason = ''
				// this.$forceUpdate()
			},
			getButton(item) {
				this.buttonName = item.name
				if (item.name == '取消') {
					this.questionnaireList.map((item, index) => {
						item.surveyTemplateQuesDTOList.map(el => {
							if (this.questionId == el.id) {
								el['confirmStatus'] = false
							}
						})
					})
				} else {
					if (!this.reason) {
						this.$util.toast("请输入原因");
						return
					}
					this.$httpApi.todoDiscloseSave({
						nodeId: this.nodeInfo.nodeId,
						projectId: this.projectInfo.projectId,
						questionId: this.questionId,
						reason: this.reason,
						discloseId: this.isEditStatusId ? this.isEditStatusId : '',
						surveyId: this.id, // 问卷id
					}).then(res => {
						if (res) {
							this.$util.toast("添加成功");

							this.getTodoDiscloseList()
						}
					})
				}
				this.reason = ''
				this.showPopup = false
			},
			/**
			 * @description 初始化补充字段
			 * 1.是否允许补充说明(文本输入 = allowAddDescFlag)、是否允许(上传文件 = allowUploadFileFlag)
			 * 2.若该问题答案为文本录入类型，则补充录入类型只能为上传类型
			 * */
			initSupplementField() {
				this.questionnaireList.map((item, index) => {
					item.surveyTemplateQuesDTOList.map(el => {
						if (el.quesType == 3) { // 答案类型为文本
							if (el.allowAddDescFlag == 1) {
								el.allowAddDescFlag = 0
							}
						} else if (el.quesType == 4) { // 答案类型为文件
							if (el.allowUploadFileFlag == 1) {
								el.allowUploadFileFlag = 0
							}
						}
					})
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.icon-image {
		margin-right: 10rpx;
		width: 44rpx;
		height: 30rpx;
	}

	.u-radio-group,
	.u-checkbox-group {
		display: flex;
		flex-direction: column;

		.u-radio {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}

		.item-option-name {
			display: inline-block;
			width: 600rpx;
			text-align: left;
			font-size: 28rpx;
			color: $seconFontColor;
			word-break: break-all;
		}

		.option-name-item {
			margin-left: 6rpx;
			line-height: 64rpx;

			.no-input_item {
				padding: 0rpx 20rpx 0rpx 0rpx;
			}
		}

	}

	.u-tabs-list {
		margin-bottom: 2rpx;

		.u-tabs-contain {
			margin-bottom: 2rpx;
			border-top-left-radius: $miniBorderRadius;
			border-top-right-radius: $miniBorderRadius;
		}

		/deep/ .u-tab-bar {
			bottom: -6rpx;
		}
	}

	.no-template {
		padding-top: 10rpx;
	}

	.input-contain {
		.describe-input {
			border: 0;
			background-color: #F7F7F7;
		}
	}

	.public-arrow {
		margin-left: 10rpx;
		width: 16rpx;
		height: 16rpx;
		transform: rotate(90deg)
	}

	.public-none {
		transform: rotate(0deg);
		transition: all .2s;
	}

	.public-block {
		transform: rotate(90deg);
		transition: all .2s;
	}

	.questionnaire {
		margin-bottom: 2rpx;

		.item-title {
			display: flex;
			align-items: center;
			line-height: 42rpx;
			font-weight: bold;
			font-size: 30rpx;
			color: $seconFontColor;
			// padding-left: 34rpx;
		}

		.item-describe {
			line-height: 36rpx;
			// padding-left: 34rpx;
			font-size: 26rpx;
			color: #909199;
		}

		.space-list-sticky {
			position: sticky;
			top: calc(88rpx + var(--status-bar-height));
			z-index: 99;
			width: 100%;
		}
	}

	.questionnaire-item {
		// margin-bottom: 20rpx;
		margin: 0rpx 20rpx 20rpx;

		.title-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-height: 132rpx;

			.right {
				display: flex;
				align-items: center;
				margin-left: 20rpx;
				margin-right: 20rpx;
				min-width: 130rpx;

				text {
					font-size: 26rpx;
					color: #A7A7A7;
				}
			}
		}

		.title-top-active {
			// padding-top: 30rpx;
		}

		.questions-item {
			margin-bottom: 20rpx;
			padding: 30rpx 0rpx;
			border-radius: 20rpx;
			background-color: #FFF;

			// padding: 20rpx 38rpx 0rpx 38rpx;
			&:last-child {
				margin-bottom: 0rpx;
				padding-bottom: 52rpx;
			}

			.questions-item-contain {
				padding: 0rpx 28rpx;
				border-bottom: 2rpx solid #f5f5f5;
			}

			.answer-contain {

				.data-input,
				.no-input {
					padding: 28rpx 28rpx 0rpx;
				}

				.no-input {
					margin-bottom: 20rpx;
				}

				.image-contain {
					margin-bottom: 20rpx;
				}
			}

			.questions-item-title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item-left {
					// max-width: 460rpx;
					line-height: 40rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: $themeColor;
				}

				.item-right {
					display: flex;
					align-items: center;
					white-space: nowrap;
					margin-left: 10rpx;

					text {
						margin-right: 6rpx;
						font-size: 26rpx;
						color: #303133;
					}

					.text-warring {
						margin-right: 6rpx;
						font-size: 26rpx;
						color: #FF5D35;
					}

				}
			}

			.required-flag {
				display: inline-block;
				height: 28rpx;
				vertical-align: middle;
				color: #FF5D35;
			}

			.questions-item-title-desc {
				margin-bottom: 20rpx;
				font-weight: bold;
				font-size: 24rpx;
				color: #999;
				// padding-left: 28rpx;
				white-space: pre-wrap;
			}

			.title-margin-default {
				margin-bottom: 10rpx;
			}

			.title-margin {
				margin-bottom: 20rpx
			}

			.questions-item-optionList {
				display: flex;
				flex-flow: row wrap;
				border-top: 2rpx solid #f5f5f5;

				.optionName {
					padding: 28rpx 28rpx 0rpx;
					text-align: center;
					font-size: 26rpx;
					color: #666;
					// border-top: 2rpx solid #f5f5f5;
					// margin-top: 28rpx;
				}

				.no-input {
					.input-contain {
						margin-right: 20rpx;
					}
				}

			}
		}
	}

	.form-contain {
		height: 100%;
		background-color: #FFF;

		.public-name {
			font-size: 28rpx;
			color: #303133;
		}

		.public-item-bottom {
			margin-top: 14rpx;
			background-color: #F7F7F7;

			.u-input {
				border: 0rpx;
			}
		}

		.title {
			padding: 36rpx 0rpx;
			border-bottom: 2rpx solid #EEE;
			text-align: center;
			color: $seconFontColor;
		}

		.item-contain {
			height: calc(100% - 280rpx);

			.desc-contian {
				margin-top: 4rpx;
				margin-bottom: 8rpx;
				padding: 24rpx 32rpx 38rpx 34rpx;
				border-radius: 10rpx;
				background: #FFF;
			}

			.scroll-Y {
				height: 100%;
			}

		}

		.images-contain {
			padding: 0 32rpx;
		}

		.item-button-contain {
			display: flex;
			position: fixed;
			justify-content: center;
			padding-left: 26rpx;
			padding-right: 26rpx;
			width: 100%;
			@include buttonsafearea();

			.button-list {
				display: flex;
				position: relative;
				bottom: 20rpx;
				width: 100%;

				.item-button {
					display: flex;
					justify-content: center;
					flex: 1;
					border: 2rpx solid #002FA5;
					border-radius: 10rpx;
					height: 88rpx;
					background-color: #fff;
					line-height: 88rpx;
					text-align: center;
					font-weight: bold;
					font-size: 24rpx;
					color: #002FA5;
				}

				.item-button-active {
					margin-left: 8rpx;
					background-color: #002FA5;
					font-weight: bold;
					color: #fff;
				}
			}
		}
	}

	.list-container {
		position: relative;

		.list-phantom {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			z-index: -1;
			height: 19908rpx;
		}

		.list {
			position: absolute;
			left: 0;
			top: 0;
		}
	}
</style>
