<template>
	<view class="measuring-room-form">
		<z-nav-bar @backClick="goBackPage" backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default">
				<view class="item-type-list">
					<view class="item-type" @click="change(index)" :class="[current == index ? 'item-type-active':'']"
						v-for="(item,index) in drawingsType" :key="index">
						{{item.name}}
						<view class="selsect-tag" v-if="current == index">

						</view>
					</view>
				</view>
			</view>
		</z-nav-bar>

		<!-- <view class="top-contain">
		</view> -->
		<!-- <view class="tab-list">
			<u-tabs height="134" class="u-tabs-contain" :list="drawingsType" font-size="26" bar-height="4"
				inactive-color="#606166" :is-scroll="false" :current="current" @change="change"></u-tabs>
		</view> -->
		<!-- 户型 -->
		<view class="item-measuring-room-form" v-if="current === 0">
			<view class="house-type" v-if="parameterListAll.length > 0">
				<view class="title public-flex-center">
					<view class="left">户型</view>
					<view class="right" @click="addHouseType">
						<view class="add public-flex-center">
							<u-icon size="24" color="#002FA5" name="plus"></u-icon>
						</view>添加空间
					</view>
				</view>
				<calculate-num v-for="(item,index) in parameterListAll" :key="index" :fieldName="item.attributeName"
					v-model="item.attributeValue" :index="index" @calculate="setCalculate($event,item)"></calculate-num>
			</view>
			<view class="space-contain" v-if="spaceParameterList.length > 0">
				<view class="title">户型参数</view>
				<parameter-input v-for="(item,index) in spaceParameterList" :key="index" :index="index"
					:fieldName="item.attributeName" :requiredFlag="item.requiredFlag" :unit="item.attributeUnit"
					v-model="item.attributeValue">
				</parameter-input>

			</view>
			<view class="desc-contain">
				<view class="title">备注</view>
				<u-input v-model="roomRemark" class="describe-input" clearable maxlength="200" height="166"
					type="textarea" placeholder="请输入备注" :border="true" />
			</view>
			<view class="img-contain">
				<view class="title">户型图(选填)</view>
				<image-upload-new v-if="roomImgShow" :count="9" v-model="roomImg"> </image-upload-new>
			</view>
		</view>
		<!-- 空间 -->
		<view class="item-measuring-room-form" v-if="current === 1">
			<view class="space-list" v-if="spaceList.length > 0">
				<view class="list">
					<view class="item-contain" v-for="(item,index) in spaceList" :key="index">
						<view class="children" @click="getSpaceList(el)" v-for="(el,num) in item.children" :key="num">
							<image v-if="el.attributeName.includes('空间名称')"
								:src="setShowStatus(el) ? '/static/images/success-space.png' :'/static/images/no-space.png' ">
							</image>
							<text v-if="el.attributeName.includes('空间名称')">{{el.attributeValue}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="space-item-contain">
				<view class="item-contain-all" v-for="(el,num) in spaceList" :key="num">
					<view class="title public-flex">
						<view class="left">{{el.attributeName}}</view>
						<view class="right public-flex-center">
							<text @click="clickOpen(num)">点击{{el.show?'收起':'展开'}}</text>
							<image :class="[el.show ? 'block':'none']" src="/static/images/bottom-icon.png"></image>
						</view>
					</view>
					<view class="item-list" :style="{'display':el.show ? 'block':'none'}">
						<view class="item-list-contain" :id=" 'item-contain-all-' + item.id"
							v-for="(item,index) in el.children" :key="index">
							<view v-if="item.attributeName.includes('空间名称')">
								<parameter-input :key="index + '_'+ item.attributeUnit"
									:requiredFlag="item.requiredFlag" :fieldName="item.attributeName"
									:unit="item.attributeUnit" v-model="item.attributeValue" bgColor="#F9FAFF">
								</parameter-input>
							</view>
							<parameter-input v-for="(ev,nums) in item.children" :key="nums + '_'+ ev.attributeUnit"
								:requiredFlag="ev.requiredFlag" :fieldName="ev.attributeName" :unit="ev.attributeUnit"
								v-model="ev.attributeValue" bgColor="#F9FAFF">
							</parameter-input>
							<view class="public-operation">
								<view class="left" @click="operation('add',num,item,index)">
									<image src="/static/images/add-new.png" mode=""></image>
									<text>添加参数</text>
								</view>
								<!-- <view class="right" @click="operation('delete',num,item,index)">
									<image src="/static/images/del.png" mode=""></image>
									<text>删除区域</text>
								</view> -->
							</view>
						</view>
					</view>
				</view>
			</view>
			<mh-empty v-show="spaceList.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
		</view>

		<!-- 禁止页面滑动 -->

		<!-- 房屋问卷 -->
		<view class="item-measuring-room-form">
			<roomQuestionnaire v-if="current === 2" ref="questionnaireRef" @callback="getCallback"></roomQuestionnaire>
		</view>

		<!-- 空间添加参数 -->
		<parameter-popup ref="parameterPopup"></parameter-popup>
		<!-- 户型添加 -->
		<space-popup ref="spacePopup"></space-popup>
		<bottom-button title="保存" @click="goSendOrder()"></bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import roomQuestionnaire from './roomQuestionnaire'
	import formCache from '@/plugins/formCache'
	import {
		deepClone
	} from '@/plugins/utils.js'
	export default {
		components: {
			roomQuestionnaire
		},
		data() {
			return {
				details: {},
				info: {},
				detailsShow: true,
				num: 0,
				pics: '',
				jobNameAll: '',
				parameter: {
					id: null,
					areaName: null,
					attributeId: null,
					attributeName: '空间名称',
					attributeValue: null,
					attributeUnit: '',
					children: [],
					created: null,
					custom: null,
					groupNo: null,
					updated: null,
					projectId: null,
					sort: null,
					templateId: null,
					type: 2,
				},
				drawingsType: [{
						name: '户型',
						value: -1
					},
					{
						name: '空间',
						value: 0
					},
					{
						name: '房屋',
						value: 1
					},
				],
				current: 0,
				swiperCurrent: 0,
				parameterListAll: [],
				spaceList: [],
				parameterList: [], // 空间参数列表
				spaceNameList: [],
				spaceParameterList: [], // 户型参数列表
				spaceNameNewList: [], // 中转数组
				addParameterListIndex: 0, // 参数下标
				spaceListIndex: 0, // 分组下标
				spaceAttributeId: '', // 空间id
				spaceAttributeName: '', // 空间名称
				spaceAreaName: '', // 区域名称
				spaceGroupNo: '',
				questionnaireShow: false, //  是否有问卷
				roomImg: '',
				roomRemark: '',
				nodeId: '', // 任务编号
				projectId: '', //项目编号
				houseTypeIsEdit: true,
				spaceIsEdit: true,
				houseIsEdit: true,
				roomImgShow: false,
				coordinatesList: [],
				formCacheStatus: false

			}
		},
		watch: {
			parameterListAll: { // 在户型数量变化时，空间数据也要发生相应变化
				handler(newVal, oldVal) {
					// this.initializeData()
				},
				deep: true
			},
		},
		computed: {
			...mapState(['projectInfo', 'userPersonInfo', 'nodeInfo'])
		},
		onLoad() {
			this.setParameters()
			this.getRoomTypeList()
			this.getBuildTypeList()
			this.setBescImage()
		},
		/**
		 * @description 
		 * 1.离开当前页面时本地保存 户型、户型参数、备注、户型图、空间数据
		 * 2.保存成功之后清除对应数据
		 * */
		onBackPress(options) {

		},
		onShow() {
			// 添加户型
			uni.$on('spaceNameUpdate', (data) => {
				this.houseTypeIsEdit = false
				this.parameterListAll.push({
					areaName: "",
					attributeId: "",
					attributeName: data.parameter.name,
					attributeUnit: "",
					attributeValue: "1",
					created: "",
					groupNo: null,
					id: "",
					custom: 1, // 自定义空间
					projectId: this.projectId,
					type: 1,
				})
			})

			// 添加空间参数
			uni.$on('parameterUpdate', (data) => {
				if (this.spaceList[this.spaceListIndex]) {
					this.spaceIsEdit = false
					this.spaceList[this.spaceListIndex]['children'][this.addParameterListIndex]['children']
						.push({
							areaName: this.spaceAreaName,
							groupNo: this.spaceGroupNo,
							attributeId: this.spaceAttributeId,
							attributeName: data.parameter.name,
							attributeUnit: data.parameter.unit,
							attributeValue: data.parameter.value,
							created: null,
							id: null,
							projectId: this.projectId,
							custom: 1,
							type: 3,
							updated: null,
						})
				}
			})

		},
		onHide() {

		},
		onUnload() {
			uni.$off('parameterUpdate')
			uni.$off('spaceNameUpdate')

			if (!this.formCacheStatus) {
				return
				this.cacheForm('add')
			}

			let measuringRoomObjectList = uni.getStorageSync('measuringRoomObjectList') || []
			let nodeIdList = []
			let tempList = []
			let resultList = []

			let measuringRoomObject = {
				nodeId: this.nodeInfo.nodeId,
				allObject: {
					houseTypeObject: {
						houseTypeList: this.parameterListAll,
						houseTypeParameters: this.spaceParameterList,
						houseTyoeDesc: this.roomRemark,
						houseTyoeImage: this.roomImg,
					},
					spaceList: this.spaceList
				}
			}
			if (measuringRoomObjectList.length > 0) {
				measuringRoomObjectList.map(item => {
					nodeIdList.push(item.nodeId)
					if (item.nodeId == this.nodeInfo.nodeId) {
						item.allObject = measuringRoomObject.allObject
					}
				})
				if (!nodeIdList.includes(this.nodeInfo.nodeId)) {
					tempList.push({
						nodeId: this.nodeInfo.nodeId,
						allObject: measuringRoomObject.allObject
					})
				}
				resultList = [...measuringRoomObjectList, ...tempList]
				uni.setStorageSync('measuringRoomObjectList', resultList)
			} else {
				measuringRoomObjectList.push(measuringRoomObject)
				uni.setStorageSync('measuringRoomObjectList', measuringRoomObjectList)
			}

			if (this.current == 2) {
				this.$refs.questionnaireRef && this.$refs.questionnaireRef.cacheForm('add')
				this.$refs.questionnaireRef && this.$refs.questionnaireRef.eliminateTiming()
			}
		},
		methods: {
			goBackPage() {

			},
			setParameters() {
				this.personId = this.userPersonInfo.personId
				this.nodeId = this.nodeInfo.nodeId
				this.projectId = this.projectInfo.projectId

			},
			setAssignment(type) {
				let measuringRoomObjectList = uni.getStorageSync('measuringRoomObjectList')
				if (measuringRoomObjectList.length > 0) {
					let measuringRoomObject = measuringRoomObjectList.find(item => item.nodeId == this.nodeInfo.nodeId)
					if (measuringRoomObject) {
						switch (type) {
							case '户型':
								if (measuringRoomObject.allObject.houseTypeObject.houseTypeList.length > 0) {
									this.parameterListAll = measuringRoomObject.allObject.houseTypeObject.houseTypeList
									this.parameterListAll = this.filterArr(this.parameterListAll, 'attributeId')
								}
								break;
							case '户型参数':
								if (measuringRoomObject.allObject.houseTypeObject.houseTypeParameters.length > 0) {
									this.spaceParameterList = measuringRoomObject.allObject.houseTypeObject
										.houseTypeParameters
								}
								break;
							case '附件':
								if (measuringRoomObject.allObject.houseTypeObject.houseTyoeDesc) {
									this.roomRemark = measuringRoomObject.allObject.houseTypeObject.houseTyoeDesc
								}
								if (measuringRoomObject.allObject.houseTypeObject.houseTyoeImage) {
									this.roomImg = measuringRoomObject.allObject.houseTypeObject.houseTyoeImage
								}
								break;
							case '空间':
								if (measuringRoomObject.allObject.spaceList.length > 0) {
									this.spaceList = measuringRoomObject.allObject.spaceList
								}
								break;
						}
					}
				}
			},
			eliminateCache(type) {
				let measuringRoomObjectList = uni.getStorageSync('measuringRoomObjectList')
				if (measuringRoomObjectList.length > 0) {
					let measuringRoomObject = measuringRoomObjectList.find(item => item.nodeId == this.nodeInfo.nodeId)
					if (measuringRoomObject) {
						switch (type) {
							case '户型':
								measuringRoomObject.allObject.houseTypeObject.houseTypeList = []
								measuringRoomObject.allObject.houseTypeObject.houseTypeParameters = []
								measuringRoomObject.allObject.houseTypeObject.houseTyoeDesc = ''
								measuringRoomObject.allObject.houseTypeObject.houseTyoeImage = ''
								measuringRoomObject.allObject.spaceList = []
								break;
							case '空间':
								measuringRoomObject.allObject.spaceList = []
								break;
						}
						measuringRoomObjectList.map(item => {
							if (item.nodeId == this.nodeInfo.nodeId) {
								item = measuringRoomObject
							}
						})
						uni.setStorageSync('measuringRoomObjectList', measuringRoomObjectList)
					}
				}
			},
			getRoomTypeList() { // 户型参数
				if (!this.projectId) {
					return
				}

				this.$httpApi.getRoomTypeList({
					id: this.projectId
				}).then(res => {
					if (res) {
						res.map(item => {
							if (!item.attributeValue) {
								item.attributeValue = 0
							}
						})
						res.map(item => {
							item['attributeValueOld'] = item['attributeValue'] // 比较是否发生了改变
						})
						this.parameterListAll = res
						this.parameterListAll = this.filterArr(this.parameterListAll, 'attributeId')
						this.setAssignment('户型')
					}
				})
			},
			getBuildTypeList() { // 房屋参数
				if (!this.projectId) {
					return
				}
				this.$httpApi.getBuildTypeList({
					id: this.projectId
				}).then(res => {
					if (res) {
						res.map(item => {
							item['attributeValueOld'] = item['attributeValue'] // 比较是否发生了改变
						})
						this.spaceParameterList = res
						this.setAssignment('户型参数')
					}
				})
			},
			getRoomTypeAndSpaceList(callbcak) { // 空间&&参数
				this.$httpApi.getRoomTypeAndSpaceList({
					id: this.projectId
				}).then(res => {
					if (res) {
						this.spaceList = res
						this.spaceList.map(item => {
							item['show'] = true
							item.children.map(el => {
								el['attributeValueOld'] = el.attributeValue
								el.children.map(ev => {
									ev['attributeValueOld'] = ev.attributeValue
								})
							})
						})
						this.spaceList = this.spaceList.filter(item => item.attributeValue !== '0')
						this.setAssignment('空间')
						callbcak && callbcak()
						this.setCoordinates()
					}
				})
			},
			addHouseType() {
				this.$refs.spacePopup.show()
			},
			clickOpen(num) {
				this.spaceList[num].show = !this.spaceList[num].show
				this.$forceUpdate()
			},
			change(index) {
				this.changeRemind(this.drawingsType[this.current].name, index)
			},
			changeRemind(typeName, index) { // 判断参数是否修改过
				switch (typeName) {
					case '户型': // houseTypeIsEdit
						this.parameterListAll.map(item => {
							if (item['attributeValueOld'] != item['attributeValue']) {
								this.houseTypeIsEdit = false
							}
						})
						this.spaceParameterList.map(item => {
							if (item['attributeValueOld'] != item['attributeValue']) {
								this.houseTypeIsEdit = false
							}
						})
						if (!this.houseTypeIsEdit) {
							this.$util.toast("请保存户型信息");
						} else {
							this.current = index
							// this.swiperCurrent = index;
						}
						break
					case '空间': // spaceIsEdit
						this.spaceList.map(item => {
							item.children.map(el => {
								if (el.attributeValueOld !== el.attributeValue) {
									this.spaceIsEdit = false
								}
								el.children.map(ev => {
									if (ev.attributeValueOld !== ev.attributeValue) {
										this.spaceIsEdit = false
									}
								})
							})
						})

						if (!this.spaceIsEdit) {
							this.$util.toast("请保存空间信息");
						} else {
							this.current = index
						}
						break
					case '房屋': // houseIsEdit
						this.current = index
						this.$refs.questionnaireRef && this.$refs.questionnaireRef.saveTiming()
						break
				}
				switch (index) {
					case 0:
						break
					case 1:
						this.getRoomTypeAndSpaceList()
						break
					case 2:
						break
				}

			},
			operation(typeName, num, item, index) {
				if (typeName === 'add') {
					this.spaceListIndex = num
					this.addParameterListIndex = index
					this.spaceAreaName = item.attributeValue
					this.spaceGroupNo = item.groupNo
					this.spaceAttributeId = item.attributeId
					this.$refs.parameterPopup.show()
				} else {
					this.$httpApi.deleteArea({
						id: item.id,
						projectId: this.projectId
					}).then(res => {
						this.getRoomTypeAndSpaceList()
					})
					// this.calculateParameterListAll(num)
					// this.spaceIsEdit = false
					// this.spaceList[num]['children'].splice(index, 1)
				}
			},
			setCalculate(ev, item) {
				let tempId = ''
				if (ev == '减') {
					this.spaceList.map(el => {
						if (el.attributeId == item.attributeId) {
							if (el.children.length > 0) {
								tempId = el.children[el.children.length - 1].id
							}
						}
					})
				}
				if (tempId) {
					this.$httpApi.deleteArea({
						id: tempId,
						projectId: this.projectId
					}).then(res => {
						this.getRoomTypeAndSpaceList()
					})
				}
			},
			calculateParameterListAll(index) { // 计算户型数据
				let groupingName = this.spaceList[index].attributeName
				this.parameterListAll.map(item => {
					if (groupingName.includes(item.attributeName)) {
						if (item.attributeValue === 0) {
							item.attributeValue = 0
						} else {
							item.attributeValue--
						}
					}
				})
				this.saveEditorHousingParameter()
			},
			saveEditorHousingParameter() {
				let tempParameter = {
					attributeValueList: this.parameterListAll,
					buildAttributeValueList: this.spaceParameterList,
					roomImg: this.roomImg,
					roomRemark: this.roomRemark,
					id: this.projectId,
					nodeId: this.nodeId
				}
				this.$httpApi.saveOrUpdate(tempParameter).then(res => {
					if (res) {

					}
				})
			},
			goSendOrder() {
				this.debounce(() => {
					switch (this.current) {
						case 0:
							if (this.roomImg && !this.$checkUploadProcess(this.roomImg)) {
								return
							}
							this.saveHousingParameter()
							break
						case 1:
							this.initializeAddList()
							break
						case 2:
							this.$refs.questionnaireRef.submit()
							break
					}
				}, 200)
			},
			initializeAddList() { // 批量新增空间数据
				let tempList = []
				let attributeIdList = []
				this.spaceList.map(item => {
					item.children.map(el => {
						tempList.push({
							areaName: el.areaName,
							attributeId: el.attributeId,
							attributeName: el.attributeName,
							attributeUnit: el.attributeUnit,
							attributeValue: el.attributeValue,
							custom: el.custom,
							groupNo: el.groupNo,
							id: el.id,
							materialType: el.materialType,
							projectId: el.projectId,
							requiredFlag: el.requiredFlag,
							sort: el.sort,
							templateId: el.templateId,
							type: el.type
						})
						el.children && el.children.map(ev => {
							tempList.push(ev)
						})
					})
				})
				for (let i = 0; i < tempList.length; i++) {
					if (Number(tempList[i].requiredFlag)) {
						if (!tempList[i].attributeValue) {
							this.$util.toast(`${tempList[i].areaName + tempList[i].attributeName}不能为空哦`);
							return
						}
					}
				}
				if (tempList.length > 0) {
					this.$httpApi.spaceBatchUpdate({
						id: this.projectId,
						attributeValueList: tempList,
					}).then(res => {
						if (res) {
							this.spaceIsEdit = true
							this.getRoomTypeAndSpaceList(() => {
								this.current = 2
							})
							this.eliminateCache('空间')
							this.$util.toast("操作成功");
						}
					})
				} else {
					this.$util.toast("空间信息不能为空");
					this.spaceIsEdit = true
				}
			},

			setShowStatus(el) {
				let tempStatusList = []
				el.children.map(item => {
					if (item.attributeValue) {
						tempStatusList.push(item.attributeValue)
					}
				})
				if (tempStatusList.length < el.children.length) {
					return false
				} else {
					return true
				}
			},
			setBescImage() { // 显示备注、图片
				if (!this.projectId) {
					return
				}
				this.$httpApi.getProjectDetails({
					id: this.projectId
				}).then(res => {
					if (res) {
						this.roomImg = res.roomImg
						this.roomRemark = res.roomRemark
						this.setAssignment('附件')
						this.roomImgShow = true
					}
				})
			},
			saveHousingParameter() { // 保存户型参数
				for (let i = 0; i < this.spaceParameterList.length; i++) {
					if (Number(this.spaceParameterList[i].requiredFlag)) {
						if (!this.spaceParameterList[i].attributeValue) {
							this.$util.toast(`${this.spaceParameterList[i].attributeName}不能为空哦`);
							return
						}
					}
				}
				let tempParameter = {
					// attributeValueList: this.filterArr(this.parameterListAll,'attributeId'),
					attributeValueList: this.parameterListAll,
					buildAttributeValueList: this.spaceParameterList,
					roomImg: this.roomImg,
					roomRemark: this.roomRemark,
					id: this.projectId,
					nodeId: this.nodeId
				}
				// console.log("tempParameter", tempParameter);
				// let tempList = this.filterArr(this.parameterListAll,'attributeId')
				// console.log('tempList',tempList);
				// return
				this.$httpApi.saveOrUpdate(tempParameter).then(res => {
					if (res) {
						this.houseTypeIsEdit = true
						this.getRoomTypeList()
						this.getBuildTypeList()
						this.eliminateCache('户型')
						this.$util.toast("操作成功");
						this.changeRemind('空间', 1, )

					}
				})
			},
			spaceNextStep() {
				let tempParameter = {
					attributeValueList: this.parameterListAll,
					buildAttributeValueList: this.spaceParameterList,
					roomImg: this.roomImg,
					roomRemark: this.roomRemark,
					id: this.projectId,
					nodeId: this.nodeId
				}
				this.$httpApi.saveOrUpdate(tempParameter).then(res => {
					if (res) {
						this.houseTypeIsEdit = true
						this.getRoomTypeList()
						this.getBuildTypeList()
					}
				})
			},
			tabsChange(index) {
				console.log("tab", index)
				// this.changeRemind(this.drawingsType[this.current].name, index, 'tab')
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				// this.changeRemind(this.drawingsType[this.current].name, current, 'swiper')
			},
			touchmove() {
				console.log("stopTouchMove")
				return true
			},
			onreachBottom() {

			},
			getSpaceList(el) {
				if (el) {
					let resultObj = this.coordinatesList.find(item => item.id == el.id)
					if (resultObj) {
						uni.pageScrollTo({
							duration: 200,
							scrollTop: resultObj.top - 174
						})
					}
				}
			},
			setCoordinates() {
				this.coordinatesList = []
				let tempList = []
				setTimeout(() => {
					this.spaceList.map(item => {
						item.children.map(el => {
							tempList.push({
								id: el.id
							})
						})
					})
					tempList.map((item, index) => {
						uni.createSelectorQuery().select("#item-contain-all-" + item.id)
							.boundingClientRect(res => {
								if (res) {
									this.coordinatesList.push({
										id: item.id,
										top: res.top
									})
								}
							}).exec()
					})
				}, 1000)
			},
			getCallback() {
				setTimeout(() => {
					this.goBack()
				}, 1000);
			},
			cacheForm() {
				let tempCache = new formCache()
				let tempParameter = {
					cacheId: this.getCacheId(),
					items: this.questionnaireObject
				}
				switch (typeName) {
					case 'add':
						tempCache.contrastCache(tempParameter, '问卷')
						break
					case 'remove':
						tempCache.removelCache(tempParameter, '问卷', () => {
							this.formCacheStatus = true
						})
						break
					case 'recovery':
						this.$refs.questionnaireConfig && this.$refs.questionnaireConfig.recovery(() => {
							tempCache.removelCache(tempParameter, '问卷')
							this.$refs.formCacheItem && this.$refs.formCacheItem.eliminate()
						})
						break
				}
			},
			filterArr(arr, u_key) {
				let map = new Map()
				arr.forEach((item, index) => {
					if (!map.has(item[u_key])) {
						map.set(item[u_key], item)
					}
				})
				return [...map.values()]
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-tab-bar {
		bottom: -4rpx;
	}

	.public-flex {
		display: flex;
		align-items: center;
	}

	.public-flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.item-measuring-room-form {
		padding-top: 14rpx;
	}

	.item-type-list {
		display: flex;
		width: 340rpx;

		.item-type {
			margin-right: 90rpx;
			color: #606166;
			font-size: 30rpx;
			position: relative;

			&:last-child {
				margin-right: 0rpx;
			}

			.selsect-tag {
				position: absolute;
				width: 48rpx;
				height: 3px;
				border-radius: 4px;
				background: linear-gradient(90deg, #002FA5 5.22%, rgba(255, 255, 255, 0) 91.79%);
				bottom: -10rpx;
				left: 8rpx;
			}
		}

		.item-type-active {
			margin-right: 90rpx;
			color: #002FA5;
		}
	}

	.measuring-room-form {
		// height: calc(100vh - 88rpx);
		// overflow: hidden !important;
		// position: fixed !important;
		// width: 100%;

		.top-contain {
			height: 134rpx;
			background-color: $themeColor;
		}

		.tab-list {
			margin: 0 20rpx 6rpx 20rpx;
			border-radius: 16rpx 16rpx 0rpx 0rpx;
			// margin-top: -100rpx;


			.u-tabs-contain {
				border-radius: 16rpx 16rpx 0rpx 0rpx;
			}

		}

		.swiper-contain {
			// height: calc(100% - 200rpx);
		}

		.house-type {
			margin: 0 20rpx 6rpx 20rpx;
			background-color: $bgColor;



			.title {
				padding: 42rpx 36rpx 20rpx 32rpx;
				justify-content: space-between;

				.left {
					font-size: 30rpx;
					font-weight: bold;
					color: #000000;
				}

				.right {
					font-size: $smallFontSize;
					color: $themeColor;
					display: flex;

					.add {
						width: 36rpx;
						height: 36rpx;
						margin-right: 6rpx;
						background: #F6F7F9;
						border: 1px solid $themeColor;
						box-sizing: border-box;
						border-radius: $miniBorderRadius;
					}

					image {
						width: 14rpx;
						height: 14rpx;
					}
				}
			}
		}

		.space-list-sticky {
			margin: 0 20rpx;
		}

		.space-list {
			background-color: $bgColor;
			margin: 0rpx 20rpx 6rpx 20rpx;
			padding: 40rpx 34rpx 36rpx 72rpx;
			border-radius: $miniBorderRadius;

			position: -webkit-sticky;
			position: sticky;
			// width: 100%;
			top: calc(88rpx + var(--status-bar-height));
			z-index: 99;


			.list {
				white-space: nowrap;
				overflow-x: scroll;
				display: flex;
				border-radius: $miniBorderRadius;
				// justify-content: center;

				.item-contain {
					display: flex;

					&:last-child {
						.children {
							&:last-child {
								margin-right: 0rpx;
							}
						}
					}
				}

				.children {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-right: 96rpx;

					image {
						width: 36rpx;
						height: 36rpx;
					}

					text {
						font-size: $middleFontSize;
						color: #666666;

					}
				}
			}
		}

		.space-contain {
			margin: 0 20rpx 6rpx 20rpx;
			background-color: $bgColor;

			.title {
				font-weight: bold;
				padding: 42rpx 36rpx 0rpx 32rpx;
				font-size: $middleFontSize;
				color: $seconFontColor;
			}
		}

		.desc-contain {
			margin: 0 20rpx 6rpx 20rpx;
			background-color: $bgColor;
			padding: 28rpx 32rpx 40rpx 32rpx;

			.title {
				margin-bottom: 20rpx;
			}

			.describe-input {
				background-color: #F7F7F7;
				margin-bottom: 20rpx;
				border: 0px;
			}
		}

		.img-contain {
			margin: 0 20rpx 6rpx 20rpx;
			background-color: $bgColor;
			padding: 28rpx 32rpx 40rpx 32rpx;

			.title {
				font-weight: bold;
				font-size: $middleFontSize;
				color: $fontColor46E;
				margin-bottom: 18rpx;
			}
		}

		.space-item-contain {
			margin: 0 20rpx 6rpx 20rpx;

			.item-contain-all {
				margin-bottom: 12rpx;
				background-color: $bgColor;
				border-radius: $miniBorderRadius;
			}

			.title {
				padding: 42rpx 42rpx 42rpx 46rpx;
				background-color: $bgColor;
				// margin-bottom: 2rpx;
				justify-content: space-between;
				border-radius: $miniBorderRadius;

				.left {
					font-size: $middleFontSize;
					color: $fontColor46E;
				}

				.right {
					text {
						font-size: $smiddleFontSize;
						color: $viceFontColor;
					}

					image {
						margin-left: 10rpx;
						width: 16rpx;
						height: 16rpx;
						transform: rotate(90deg);
					}

					.none {
						transition: all .2s;
						transform: rotate(0deg);
					}

					.block {
						transition: all .2s;
						transform: rotate(90deg);
					}
				}
			}

			.item-list {
				padding: 0 20rpx 20rpx 20rpx;

				.item-list-contain {
					margin-bottom: 20rpx;
				}
			}

			.public-operation {
				background-color: #F9FAFF;
				display: flex;
				justify-content: center;
				padding: 42rpx 0rpx 40rpx 0rpx;

				.left,
				.right {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 42rpx;
						height: 42rpx;
						margin-right: 10rpx;
					}
				}

				.left {
					text {
						color: $themeColor;
					}
				}

				.right {
					text {
						color: $errorColor;
					}
				}

				text {
					font-size: $middleFontSize;
				}

			}
		}

		.questionnaire {
			margin: 0 20rpx 6rpx 20rpx;
			background-color: $bgColor;
			padding: 28rpx 32rpx 40rpx 32rpx;
		}
	}
</style>
