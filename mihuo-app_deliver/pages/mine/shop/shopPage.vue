<template>
	<view class="shop-page">
		<!-- 店铺基本信息 -->
		<view class="shop-top-contain" v-if="myShopDetails">
			<view class="user-contain">
				<view class="item-top">
					<u-avatar class="icon-image" :src="$util.avatarImage(myShopDetails.userId)" size="134">
					</u-avatar>
					<view class="user-right">
						<view class="user-name">{{userInfo.nickName}}</view>
						<view class="user-stars">
							<view class="item-images" v-if="myShopDetails.score">
								<image src="@/static/images/xing_1.png" mode=""></image>
							</view>
							<text class="stars-num" v-if="myShopDetails.score">{{myShopDetails.score}}分</text>
						</view>
						<view class="user-tag">
							<view class="item-tag" v-for="(item,index) in skillList" :key="index">
								<text>{{item}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="item-other">
					<view class="statistics">
						<text class="item-num">{{statisticsForm.workNum}}</text>
						<text class="item-text">作品数量</text>
					</view>
					<view class="statistics">
						<text class="item-num">{{statisticsForm.serviceNum}}</text>
						<text class="item-text">累计服务</text>
					</view>
					<view class="statistics">
						<text class="item-num">{{statisticsForm.collectionNum}}</text>
						<text class="item-text">被收藏数</text>
					</view>
				</view>
			</view>
			<view class="brief-introduction">
				<view class="item-information ranking">
					<text class="item-label">我的工匠榜</text>
					<text class="item-value">昆明市设计师明星工匠榜第1名</text>
				</view>
				<view class="item-information">
					<view class="item-left">
						<text class="item-label">服务区域</text>
						<text class="item-value address">{{myShopDetails.address}}</text>
					</view>
					<view class="item-text-other" @click="getAddress">修改</view>
				</view>
				<view class="item-information">
					<view class="item-left">
						<text class="item-label introduction">个人简介</text>
						<text class="item-value">{{myShopDetails.summary}}</text>
					</view>
					<view class="item-other-image">
						<image src="@/static/images/icon_edit/editor_4.png" @click="setSummary()" mode=""></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 店铺数据 -->
		<view class="data-contain" v-if="myShopDetails">
			<!-- <message-tabs :items="typeList" :current="titleIndex" @clickItem="changeTitle" ref="mytabs" /> -->

			<view class="type-all">
				<view class="data-type">
					<view class="item-type" :class="[dataTypeIndex == index ? 'item-type-active':'']"
						v-for="(item,index) in typeList" :key="index" @click="getDataType(index)">
						<view class="item-text">{{item}}</view>
						<view class="item-tag" :class="[dataTypeIndex == index ? 'item-tag-active':'']"></view>
					</view>
				</view>
				<view class="type-contain">
					<view class="item-type" :class="[listTypeIndex == index ? 'item-type-active':'']"
						v-for="(item,index) in listType" :key="index" @click="getType(index)">
						<text>{{item.name}}</text><text v-if="item.num">({{item.num}})</text>
					</view>
				</view>
			</view>

			<view class="list-data">
				<!-- <scroll-view :scroll-y="true" class="scroll-y" @scrolltolower="scrolltolower"> -->
				<view class="list-contain" v-if="dataTypeIndex !== 2">
					<view class="item-contain" v-for="(item,index) in getList" :key="index">
						<view class="item-top">
							<view class="item-top-left">
								<view class="item-checkbox" v-if="batchOperationStatus">
									<u-checkbox v-model="item.checked" @change="checkbox(item)"></u-checkbox>
								</view>
							</view>
							<view class="item-top-right" @click.stop="getDetails(item)">
								<view class="image-contain">
									<u-lazy-load class="item-image" height="140" :style="{ width: '140rpx' }"
										imgMode="aspectFill" border-radius="10" :image="item.coverImgUrl">
									</u-lazy-load>
									<view class="item-status" v-if="getStatus(item)">{{getStatus(item)}}</view>
								</view>
								<view class="item-left">
									<text class="item-name">{{item.title}}</text>
									<text class="item-unit">
										<text class="num">{{item.price}}</text>
										<text class="unit">元</text>
										<text class="unit" v-if="item.unit">/{{item.unit}}</text>
									</text>
									<view class="item-tag" v-if="dataTypeIndex == 1">
										<text class="tag" v-for="(ev,num) in  item.tagList" :key="num">
											{{ev}}
										</text>
									</view>
									<text class="item-time">
										<text class="time">{{item.created.substring(0,16)}} 上传</text>
									</text>
								</view>
							</view>
						</view>
						<view class="item-relation" v-if="dataTypeIndex == 1 && item.relationServiceName">
							<text class="item-value">关联服务</text>
							<image src="@/static/images/relation.png" mode=""></image>
							<text class="item-name">{{item.relationServiceName}}</text>
						</view>
						<view class="item-operation">
							<view class="operation" :class="[ev.display ? 'operation-display':'']"
								v-for="(ev,num) in getOperationList(item)" :key="num" @click="getOperation(ev,item)">
								<text>{{ev.name}}</text>
								<image :src="ev.icon" mode=""></image>
							</view>
						</view>
					</view>
					<mh-empty v-if="getList.length == 0" icon="/static/images/no_recommend.png" title="没有记录～～" />
				</view>

				<view class="evaluate-contain" v-if="dataTypeIndex == 2">
					<view class="rating-bar align-center">
						<view class="left align-center">
							<view class="title">
								98%
							</view>
							<view class="text">
								好评率
							</view>
						</view>
						<view class="right">
							<view class="rating-item align-center">
								<view class="text">
									好评
								</view>
								<u-line-progress height="12" style="width: 380rpx;" inactive-color="#DDDDDD"
									active-color="#002FA5" :show-percent="false" :percent="98"></u-line-progress>
								<view class="text">
									98%
								</view>
							</view>
							<view class="rating-item align-center">
								<view class="text">
									中评
								</view>
								<u-line-progress height="12" style="width: 380rpx;" inactive-color="#DDDDDD"
									active-color="#002FA5" :show-percent="false" :percent="2"></u-line-progress>
								<view class="text">
									2%
								</view>
							</view>
							<view class="rating-item align-center">
								<view class="text">
									差评
								</view>
								<u-line-progress height="12" style="width: 380rpx;" inactive-color="#DDDDDD"
									active-color="#002FA5" :show-percent="false" :percent="0"></u-line-progress>
								<view class="text">
									0%
								</view>
							</view>
						</view>
					</view>
					<view class="tags align-center">
						<view class="tag">
							服务很好(156)
						</view>
						<view class="tag">
							认真负责(588)
						</view>
						<view class="tag">
							相应迅速(186)
						</view>
						<view class="tag">
							价格合理(587)
						</view>
						<view class="tag">
							效率高(53)
						</view>
						<view class="tag">
							水平非常专业(58)
						</view>
					</view>
					<view class="comment-cards">
						<comment-card></comment-card>
						<comment-card></comment-card>
						<comment-card></comment-card>
					</view>
				</view>
				<!-- </scroll-view> -->




				<!-- <mh-empty icon="/static/images/no_recommend.png" title="你还没有添加服务哦～～" /> -->
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="bottom-contain" v-if="setButtonList.length > 0 && myShopDetails">
			<view class="item-left" v-if="batchOperationStatus">
				<u-checkbox v-model="selectChecked" @change="checkboxChangeAll()">全选</u-checkbox>
			</view>
			<view class="button-list">
				<view class="item-button" :class="[item.active ? 'item-button-active':'']"
					v-for="(item,index) in setButtonList" :key="index" @click="getButton(item)"> {{item.name}}</view>
			</view>
		</view>

		<!-- 个人简介弹框 -->
		<u-popup v-model="modelShow" border-radius="30" height="600" mode="bottom" :safe-area-inset-bottom="false"
			:closeable="true">
			<view class="form-contain">
				<view class="title">
					编辑个人简介
				</view>
				<view class="item-contain">
					<view class="desc-contian">
						<text class="public-name">个人简介</text>
						<view class="public-item-bottom">
							<!-- u-input v-model="summary" class="describe-input" maxlength="50" height="50"  type="textarea"
								placeholder="请输入个人简介" :border="true" :auto-height="false" /> -->
							<textarea v-model="summary" maxlength="140"
								style="padding:6px 9px;border-radius: 8rpx;background: #F7F7F7;width: 100%;height:200rpx;font-size:28rpx"
								placeholder="请输入个人简介" placeholder-style="color:#909199;font-size: 13px" />
						</view>
					</view>
				</view>
				<view class="bottom-add">
					<view class="item-add" @click="addSummary()">
						保存
					</view>
				</view>
			</view>
		</u-popup>


		<modal-new :shutDown="true" v-model="deleteShow" @click="deleteConfirm" @cancel="deleteModalCancel">
			<view class="label">{{deleteTitle}}</view>
		</modal-new>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				loading: true,
				modelShow: false,
				deleteShow: false,
				deleteTitle: '是否删除',
				summary: '',
				skeleton1: {
					avatarSize: '52px',
					row: 3,
					showTitle: true,
				},
				// typeList: ['服务项目', '工作案例', '用户评价'],
				typeList: ['服务项目', '工作案例'],
				titleIndex: 0,
				list: [],
				listTypeIndex: 0,
				selectChecked: false,
				dataTypeIndex: 0,
				myShopDetails: '',
				userInfo: uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser,
				buttonList: [{
						name: '删除',
						active: false,
						batchOperationStatus: true,
						listTypeIndexList: [0, 1, 2, 3, 4]
					},
					{
						name: '取消',
						active: false,
						batchOperationStatus: true,
						listTypeIndexList: [0, 1, 2, 3, 4]
					},
					{
						name: '批量操作',
						active: false,
						batchOperationStatus: false,
					},
					{
						name: '添加服务',
						active: true,
						batchOperationStatus: false,
					},
					{
						name: '添加案例',
						active: true,
						batchOperationStatus: false
					},
					{
						name: '上架',
						active: true,
						batchOperationStatus: true,
						listTypeIndexList: [2]
					},
					{
						name: '下架',
						active: true,
						batchOperationStatus: true,
						listTypeIndexList: [0]
					},
					{
						name: '发布',
						active: true,
						batchOperationStatus: true,
						listTypeIndexList: [3]
					},
				],
				operationList: [{
						name: '编辑',
						icon: '/static/images/icon_edit/editor_5.png',
						display: false
					},
					{
						name: '上架',
						icon: '/static/images/upload_folder.png',
						display: false
					},
					{
						name: '下架',
						icon: '/static/images/upload_folder.png',
						display: false
					},
					{
						name: '发布',
						icon: '/static/images/upload_folder.png',
						display: false
					},
					{
						name: '删除',
						icon: '/static/images/delete_icon/delete_1.png',
						display: false
					}
				],
				serviceList: [],
				caseList: [],
				verifyStatus: 1, // 审核状态：0->未审核；1->审核通过 2-->审核不通过
				publishStatus: 1, //上架状态：0->下架；1->上架
				currentCase: {},
				currentService: {},
				batchOperationStatus: false,
				statisticsForm: {
					workNum: 0, // 作品
					serviceNum: 0, // 服务
					collectionNum: 0, // 收藏
				},
				skillList: [],
				listTypeName: '展示中',
				serviceTotal: 0,
				caseTotal: 0,
				pageSize: 20,
				serviceCurrentPageSize: 1,
				serviceCurrent: 1,
				caseCurrent: 1,
				caseCurrentPageSize: 1,
				listType: [{
						name: '展示中',
						status: 1,
						num: 0
					}, {
						name: '审核中',
						status: 0,
						num: 0
					},
					{
						name: '已下架',
						status: 2,
						num: 0
					},
					{
						name: '草稿',
						status: 0,
						num: 0
					},
					{
						name: '审核未通过',
						num: 0,
						status: 2,
					}
				]

			}
		},
		computed: {
			setButtonList() {
				if (this.batchOperationStatus) {
					let result = this.buttonList.filter(item => item.batchOperationStatus)


					let tempList = result.filter(item => item.listTypeIndexList.includes(this.listTypeIndex))
					return tempList
				} else {
					if (this.typeList[this.dataTypeIndex] == '服务项目') {
						// 若服务列表为0
						if (this.getList.length == 0) {
							return this.buttonList.filter(item => item.name == '添加服务')
						}
						return this.buttonList.filter(item => item.name !== '添加案例' && !item.batchOperationStatus)
					} else if (this.typeList[this.dataTypeIndex] == '工作案例') {
						// 若服务列表为0
						if (this.getList.length == 0) {
							return this.buttonList.filter(item => item.name == '添加案例')
						}
						return this.buttonList.filter(item => item.name !== '添加服务' && !item.batchOperationStatus)
					} else {
						return []
					}
				}
			},
			getList() {
				if (this.dataTypeIndex == 0) {
					return this.serviceList
				} else if (this.dataTypeIndex == 1) {
					return this.caseList
				}
			},
		},
		mounted() {

		},
		onReachBottom() {
			if (this.dataTypeIndex == 0) {
				if (this.serviceList.length < this.serviceTotal) {
					this.serviceCurrent++
					this.myServicePage()
				}
			} else if (this.dataTypeIndex == 1) {
				if (this.caseList.length < this.caseTotal) {
					this.caseCurrent++
					this.myCasePage()
				}
			}
		},
		onShow() {
			this.getInit()
		},
		onLoad(option) {
			this.option = option
			this.statistics()
			this.getPersonInfo()
		},
		methods: {
			/**
			 * @@description  获取并展示岗位信息
			 * 
			 * */
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.skillList = []
						// auditStatus  审核状态（0已提交、1未通过、2已通过）
						this.personInfo = res;
						this.personInfo.personageList.forEach(el => {
							if (el.auditStatus == 2) {
								this.skillList.push(el.skillName)
							}
						})
					}
				})
			},

			/**
			 * @@description  统计作品、服务、收藏数量
			 * 
			 * */
			statistics() {
				let tempUserId = uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser.userId
				this.$httpApi.caseNum({
					userId: tempUserId
				}).then(res => {
					if (res) {
						this.statisticsForm.workNum = res
					}
				})
				this.$httpApi.getLikeNum({
					userId: tempUserId
				}).then(res => {
					if (res) {
						this.statisticsForm.collectionNum = res
					}
				})
				this.$httpApi.getProjectNum({
					userId: tempUserId
				}).then(res => {
					if (res) {
						this.statisticsForm.serviceNum = res
					}
				})
			},
			/**
			 * 服务、案例、按钮显示
			 * verifyStatus 审核状态：0->未审核；1->审核通过 2-->审核不通过
			 * */
			getOperationList(item) {
				let tempOperationList = JSON.parse(JSON.stringify(this.operationList))
				switch (this.listTypeName) {
					case '展示中': // 审核通过
						tempOperationList = tempOperationList.filter(ev => ev.name !== '上架')
						break;
					case '审核中':
						tempOperationList.forEach(el => {
							if (item.verifyStatus == 0 && el.name == '上架') {
								el.display = true
							}
						})
						tempOperationList = tempOperationList.filter(ev => ev.name !== '下架')
						break;
					case '已下架':
						tempOperationList = tempOperationList.filter(ev => ev.name !== '下架')
						break;
					case '审核未通过':
						tempOperationList.forEach(el => {
							if (item.verifyStatus == 2 && el.name == '上架') {
								el.display = true
							}
						})
						tempOperationList = tempOperationList.filter(ev => ev.name !== '下架')
						break;
					case '草稿':
						tempOperationList = tempOperationList.filter(ev => !['上架', '下架'].includes(ev.name))
						break
					default:
						break;
				}

				if (this.listTypeName !== '草稿') {
					tempOperationList = tempOperationList.filter(ev => ev.name !== '发布')
				}
				return tempOperationList
			},
			getInit() {
				this.getMyShop()
				if (this.dataTypeIndex == 0) {
					this.serviceCurrent = 1
					this.myServicePage()
					this.getServiceStatusNum()
				} else if (this.dataTypeIndex == 1) {
					this.caseCurrent = 1
					this.myCasePage()
					this.getCaseStatusNum()
				}

				if (this.selectChecked) {
					this.selectChecked = false
				}
			},
			getMyShop() {
				this.$httpApi.myShop().then(res => {
					if (res) {
						this.myShopDetails = res
					}
				})
			},
			myServicePage() {
				let parameter = this.getParameter()
				this.$httpApi.myServicePage(parameter).then(res => {
					if (res) {
						this.serviceTotal = res.total
						if (this.serviceCurrent > 1) {
							if (this.serviceCurrent !== this.serviceCurrentPageSize) {
								this.serviceList = this.serviceList.concat(res.records)
								this.serviceCurrentPageSize = this.serviceCurrent
							}
						} else {
							this.serviceList = res.records
							this.serviceCurrentPageSize = this.serviceCurrent
						}
						this.serviceList.forEach(el => {
							el['checked'] = false
							if (this.$isJSON(el.coverImg)) {
								el['coverImgList'] = JSON.parse(el.coverImg)
								let tempFile = el['coverImgList'][0]
								if (tempFile) {
									el['coverImgUrl'] = tempFile.type == 'img' ? this.$util.thumbnailImage(
										tempFile.url, false) : this.$util.thumbnailVideo(tempFile.url)
								}
							}
						})
					}
				})
			},
			myCasePage() {
				let parameter = this.getParameter()
				this.$httpApi.myCasePage(parameter).then(res => {
					if (res) {
						this.caseTotal = res.total
						if (this.caseCurrent > 1) {
							if (this.caseCurrent !== this.caseCurrentPageSize) {
								this.caseList = this.caseList.concat(res.records)
								this.caseCurrentPageSize = this.caseCurrent
							}
						} else {
							this.caseList = res.records
							this.caseCurrentPageSize = this.caseCurrent
						}
						this.caseList.forEach(el => {
							el['checked'] = false
							el['tagList'] = el.tags && el.tags.split('，')
							if (this.$isJSON(el.coverImg)) {
								el['coverImgList'] = JSON.parse(el.coverImg)
								let tempFile = el['coverImgList'][0]
								if (tempFile) {
									el['coverImgUrl'] = tempFile.type == 'img' ? this.$util.thumbnailImage(
										tempFile.url, false) : this.$util.thumbnailVideo(tempFile.url)
								}
							}

						})
					}
				})
			},
			getParameter() {
				let parameter
				let current = this.dataTypeIndex == 0 ? this.serviceCurrent : this.caseCurrent

				switch (this.listTypeName) {
					case '展示中':
						parameter = {
							verifyStatus: 1,
							publishStatus: 1,
							status: 1,
							size: this.pageSize,
							current: current
						}
						break;
					case '审核中':
						parameter = {
							verifyStatus: 0,
							status: 1,
							size: this.pageSize,
							current: current
						}
						break;
					case '已下架':
						parameter = {
							verifyStatus: 1,
							publishStatus: 0,
							status: 1,
							size: this.pageSize,
							current: current
						}
						break;
					case '审核未通过':
						parameter = {
							verifyStatus: 2,
							size: this.pageSize,
							current: current
						}
						break;
					case '草稿':
						parameter = {
							status: 0,
							size: this.pageSize,
							current: current
						}
						break;
					default:
						break;
				}

				return parameter

			},
			/**
			 * 
			 * @deprecated 服务type显示
			 * */
			getServiceStatusNum() {
				this.$httpApi.getServiceStatusNum().then(res => {
					if (res) {
						this.setListType(res)
					}
				})
			},
			/**
			 * 
			 * @deprecated 案例type显示
			 * */
			getCaseStatusNum() {
				this.$httpApi.getCaseStatusNum().then(res => {
					if (res) {
						this.setListType(res)
					}
				})
			},
			/**
			 * 
			 * @deprecated 服务、type统计
			 * */
			setListType(item) {
				this.listType.forEach(el => {
					switch (el.name) {
						case '展示中':
							el.num = item.showNum
							break
						case '审核中':
							el.num = item.reviewNum
							break
						case '已下架':
							el.num = item.takeDownNum
							break
						case '审核未通过':
							el.num = item.failedNum
							break
						case '草稿':
							el.num = item.draftNum
							break
					}
				})
			},
			/**
			 * 
			 * @deprecated 服务、案例标签显示
			 * */
			getStatus(item) {
				return this.listTypeName == '展示中' ? '' : this.listTypeName

				// if (item.status == 1) {
				// 	// verifyStatus 审核状态：0->未审核；1->审核通过 2-->审核不通过
				// 	// publishStatus: 1, //上架状态：0->下架；1->上架
				// 	if (item.publishStatus == 0) {
				// 		return '已下架'
				// 	} else {
				// 		let tempMap = {
				// 			0: '审核中',
				// 			1: '审核通过',
				// 			2: '审核不通过'
				// 		}
				// 		return tempMap[item.verifyStatus] ?? ''
				// 	}
				// } else {
				// 	// status 状态：0->草稿 1->发布
				// 	let tempMap = {
				// 		0: '草稿'
				// 	}
				// 	return tempMap[item.status] ?? ''
				// }

			},
			/**
			 * 
			 * @deprecated 修改服务区域
			 * */
			getAddress() {
				this.toPage(
					`/pages/permanentResidence/permanentResidence?type=多选&typeName=觅活小店&shopId=${this.myShopDetails.id}&addressIds=${this.myShopDetails.addressIds}`
				)
			},
			/**
			 * 
			 * @deprecated 设置个人简介
			 * */
			setSummary() {
				this.summary = this.myShopDetails.summary
				this.modelShow = true
			},
			/**
			 * 
			 * @deprecated 设置个人简介
			 * */
			addSummary() {
				this.$httpApi.updateSummary({
					summary: this.summary,
					id: this.myShopDetails.id
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.getMyShop()
					}
				})
				this.modelShow = false
			},
			changeTitle(e) {
				this.titleIndex = e.currentIndex
			},
			/**
			 * 
			 * @deprecated 切换服务、案例、用户评价
			 * */
			getDataType(index) {
				this.dataTypeIndex = index
				this.setCheckbox()
				if (this.dataTypeIndex == 0) {
					this.serviceCurrent = 1
					this.myServicePage()
					this.getServiceStatusNum()
				} else if (this.dataTypeIndex == 1) {
					this.caseCurrent = 1
					this.myCasePage()
					this.getCaseStatusNum()
				}
			},

			/**
			 * 
			 * @deprecated 切换 展示中、审核中、已下架、草稿、审核未通过
			 * */
			getType(index) {
				this.listTypeIndex = index
				this.verifyStatus = this.listType[index].status
				this.listTypeName = this.listType[index].name
				if (this.dataTypeIndex == 0) {
					this.serviceCurrent = 1
					this.myServicePage()
				} else if (this.dataTypeIndex == 1) {
					this.caseCurrent = 1
					this.myCasePage()
				}
			},
			/**
			 * 
			 * @deprecated 底部按钮操作
			 * */
			getButton(item) {
				switch (item.name) {
					case '删除':
						if (this.isCheck()) {
							return
						}
						this.deleteShow = !this.deleteShow
						this.deleteTitle = '是否删除所选数据'
						break
					case '批量操作':
						this.batchOperationStatus = !this.batchOperationStatus
						break
					case '取消':
						this.batchOperationStatus = !this.batchOperationStatus
						break
					case '添加服务':
						this.toPage(`/pages/mine/shop/addService?shopId=${this.myShopDetails.id}`)
						break
					case '添加案例':
						this.toPage(`/pages/mine/shop/addCase?shopId=${this.myShopDetails.id}`)
						break
					case '上架':
						if (this.isCheck()) {
							return
						}
						this.goodsOnTheShelves(1)
						break
					case '下架':
						if (this.isCheck()) {
							return
						}
						this.goodsOnTheShelves(0)
						break
					case '发布':
						this.getBatchPublish()
						break
				}
			},
			/**
			 * 
			 * @deprecated 判断是否勾选了数据
			 * */
			isCheck() {
				let tempServiceList = [],
					tempCaseList = []
				this.serviceList.forEach(item => {
					if (item.checked) {
						tempServiceList.push(item.id)
					}
				})
				this.caseList.forEach(item => {
					if (item.checked) {
						tempCaseList.push(item.id)
					}
				})
				if ([...tempServiceList, ...tempCaseList].length == 0) {
					this.$util.toast("请选择数据~");
					return true
				}
				return false
			},
			/**
			 * 
			 * @deprecated 批量发布、服务跟案例
			 * */
			getBatchPublish() {
				let tempServiceList = [],
					tempCaseList = []
				this.serviceList.forEach(item => {
					if (item.checked) {
						tempServiceList.push(item.id)
					}
				})
				this.caseList.forEach(item => {
					if (item.checked) {
						tempCaseList.push(item.id)
					}
				})

				if ([...tempServiceList, ...tempCaseList].length == 0) {
					this.$util.toast("请选择数据~");
					return true
				}
				if (tempServiceList.length > 0) {
					this.batchPublish(tempServiceList, 1)
				}
				if (tempCaseList.length > 0) {
					this.updateCaseByStatus(tempCaseList, 1)
				}

			},
			/**
			 * 
			 * @deprecated 批量上架、下架 服务跟案例
			 * */
			goodsOnTheShelves(status) {
				let tempServiceList = [],
					tempCaseList = []
				this.serviceList.forEach(item => {
					if (item.checked) {
						tempServiceList.push(item.id)
					}
				})
				this.caseList.forEach(item => {
					if (item.checked) {
						tempCaseList.push(item.id)
					}
				})
				if (tempServiceList.length > 0) {
					this.updateServiceByPublish(tempServiceList, status)
				}
				if (tempCaseList.length > 0) {
					this.updateServiceByPublish(tempCaseList, status)
				}


			},
			/**
			 * 
			 * @deprecated 单个服务、按钮按钮操作
			 * */
			getOperation(ev, item) {
				if (ev.display) {
					return
				}
				if (this.typeList[this.dataTypeIndex] == '服务项目') {
					switch (ev.name) {
						case '删除':
							this.deleteShow = !this.deleteShow
							this.deleteTitle = '是否删除该服务项目'
							this.currentService = item
							break
						case '编辑':
							this.toPage(
								`/pages/mine/shop/addService?shopId=${this.myShopDetails.id}&serviceId=${item.id}&type=编辑&listTypeName=${this.listTypeName}`
							)
							break
						case '上架':
							this.updateServiceByPublish([item.id], 1)
							break
						case '下架':
							this.updateServiceByPublish([item.id], 0)
							break
						case '发布':
							this.batchPublish([item.id], 1)
							break
					}
				} else {
					switch (ev.name) {
						case '删除':
							this.deleteShow = !this.deleteShow
							this.deleteTitle = '是否删除该案例'
							this.currentCase = item
							break
						case '编辑':
							this.toPage(
								`/pages/mine/shop/addCase?shopId=${this.myShopDetails.id}&caseId=${item.id}&type=编辑`)
							break
						case '上架':
							this.updateCaseByPublish([item.id], 1)
							break
						case '下架':
							this.updateCaseByPublish([item.id], 0)
							break
						case '发布':
							this.updateCaseByStatus([item.id], 1)
							break
					}
				}
			},
			/**
			 * 
			 * @deprecated 删除服务、案例(批量、单个)
			 * */
			deleteConfirm() {
				this.deleteShow = !this.deleteShow
				if (this.batchOperationStatus) {
					this.deleteData()
				} else {
					if (this.typeList[this.dataTypeIndex] == '服务项目') {
						this.deleteByIdsService([this.currentService.id])
					} else {
						this.deleteByIdsCase([this.currentCase.id])
					}
				}
			},
			deleteModalCancel() {
				this.deleteShow = !this.deleteShow
			},
			/**
			 * 
			 * @deprecated 批量删除服务
			 * */
			deleteByIdsService(ids) {
				this.$httpApi.deleteByIdsService(ids).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.getInit()
					}
				})
			},
			/**
			 * 
			 * @deprecated 批量删除案例
			 * */
			deleteByIdsCase(ids) {
				this.$httpApi.deleteByIdsCase(ids).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.getInit()
					}
				})
			},
			updateServiceByPublish(ids, status) {
				this.$httpApi.updateServiceByPublish({
					ids: ids,
					status: status
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.getInit()
					}
				})
			},
			updateCaseByPublish(ids, status) {
				this.$httpApi.updateCaseByPublish({
					ids: ids,
					status: status
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.getInit()
					}
				})
			},
			/**
			 * @description 批量发布服务
			 * */
			batchPublish(ids, status) {
				this.$httpApi.updateByStatus({
					ids: ids,
					status: status
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.getInit()
					}
				})
			},
			/**
			 * @description 批量发布案例
			 * */
			updateCaseByStatus(ids, status) {
				this.$httpApi.updateCaseByStatus({
					ids: ids,
					status: status
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功~");

						this.getInit()
					}
				})
			},
			getDetails(item) {
				let type = this.typeList[this.dataTypeIndex] == '服务项目' ? '服务' : '案例'
				this.toPage(
					`/pages/mine/shop/caseDetails?type=${type}&detailsId=${item.id}&shopId=${this.myShopDetails.id}&listTypeName=${this.listTypeName}`
				)
			},
			checkboxChangeAll() {
				this.selectChecked = !this.selectChecked
				if (this.dataTypeIndex == 0) {
					this.serviceList.forEach(el => {
						if (this.selectChecked) {
							if (!el['checked']) {
								el['checked'] = true
							}
						} else {
							if (el['checked']) {
								el['checked'] = false
							}
						}
					})
				} else if (this.dataTypeIndex == 1) {
					this.caseList.forEach(el => {
						if (this.selectChecked) {
							if (!el['checked']) {
								el['checked'] = true
							}
						} else {
							if (el['checked']) {
								el['checked'] = false
							}
						}
					})
				}
			},
			checkbox(item) {
				item['checked'] = !item['checked']
				this.setCheckbox()
				this.$forceUpdate()
			},
			setCheckbox() {
				let serviceIndex = 0
				let caseIndex = 0
				if (this.dataTypeIndex == 0) {
					this.serviceList.forEach(ev => {
						if (ev['checked']) {
							serviceIndex++
						}
					})
					if (serviceIndex > 0 && serviceIndex == this.serviceList.length) {
						this.selectChecked = true
					} else {
						this.selectChecked = false
					}
				} else {
					this.caseList.forEach(ev => {
						if (ev['checked']) {
							caseIndex++
						}
					})
					if (caseIndex > 0 && caseIndex == this.caseList.length) {
						this.selectChecked = true
					} else {
						this.selectChecked = false
					}
				}
			},
			deleteData() {
				let tempServiceList = [],
					tempCaseList = []
				this.serviceList.forEach(item => {
					if (item.checked) {
						tempServiceList.push(item.id)
					}
				})
				this.caseList.forEach(item => {
					if (item.checked) {
						tempCaseList.push(item.id)
					}
				})
				if (tempServiceList.length > 0) {
					this.deleteByIdsService(tempServiceList)
				}
				if (tempCaseList.length > 0) {
					this.deleteByIdsCase(tempCaseList)
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.align-center {
		display: flex;
		align-items: center;
	}

	/deep/ .u-empty {
		margin-top: 100rpx !important;
	}

	.label {
		color: #999999;
		font-size: $middleFontSize;
		text-align: center;
	}

	.shop-page {
		padding-top: 14rpx;
		padding-bottom: 180rpx;

		.shop-top-contain {
			border-radius: $maxBorderRadius $maxBorderRadius $miniBorderRadius $miniBorderRadius;
			background: #FFFFFF;
			padding: 40rpx 46rpx;

			.user-contain {
				.item-top {
					display: flex;
					padding-bottom: 40rpx;
					border-bottom: 2rpx dashed #EEEEEE;


					.user-right {
						margin-left: 16rpx;

						.user-name {
							font-size: $middleAddFontSize;
							color: #333333;
							font-weight: bold;
							margin-bottom: 10rpx;
						}

						.user-stars {
							margin-bottom: 10rpx;

							image {
								width: 28rpx;
								height: 28rpx;
								margin-right: 4rpx;
							}

							.stars-num {
								color: $errorFontColor;
								font-size: $middleFontSize;
							}
						}

						.user-stars {
							display: flex;
							align-items: center;
						}

						.user-tag {
							display: flex;
							flex-wrap: wrap;

							.item-tag {
								padding: 0rpx 6rpx;
								border-radius: 4rpx;
								background: #EFF1FF;
								margin-right: 10rpx;
								white-space: nowrap;
								margin-bottom: 10rpx;

								text {
									display: block;
									font-size: 24rpx;
									color: #002FA5;
									transform: scale(0.85);
								}

							}
						}
					}
				}

				.item-other {
					display: flex;
					justify-content: space-around;
					padding-top: 34rpx;
					margin-bottom: 40rpx;

					.statistics {
						display: flex;
						flex-direction: column;

						.item-num {
							font-size: 28rpx;
							line-height: 40rpx;
							text-align: center;
							color: #303133;
						}

						.item-text {
							font-size: 26rpx;
							color: #999999;
						}

						&:nth-of-type(2) {
							position: relative;

							&::before {
								content: "";
								position: absolute;
								width: 2rpx;
								height: 32rpx;
								background-color: #DEDEDE;
								top: 20rpx;
								left: -60rpx;
							}

							&::after {
								content: "";
								position: absolute;
								width: 2rpx;
								height: 32rpx;
								top: 20rpx;
								right: -60rpx;
								background-color: #DEDEDE;
							}


						}
					}
				}
			}

			.brief-introduction {

				.item-information {
					margin-bottom: 30rpx;
					display: flex;
					justify-content: space-between;


					&:last-child {
						margin-bottom: 0rpx;
					}

					.item-left {
						margin-right: 20rpx;
					}
					
					

					.item-label {
						line-height: 40rpx;
						margin-right: 62rpx;
						font-size: 26rpx;
						font-weight: bold;
					}
					
					.introduction{
						margin-right: 30rpx;
					}

					.item-value {
						line-height: 40rpx;
						font-size: 28rpx;
					}

					.address {
						color: #002FA5;
					}

					.item-text-other {
						color: #909199;
						font-size: 24rpx;
						// width: 80rpx;
						white-space: nowrap;
					}

					.item-other-image {
						// width: 80rpx;
					}

					image {
						width: 42rpx;
						height: 42rpx;
					}
				}

				.ranking {
					background-color: #FFF2D0;
					border-radius: 16rpx;
					padding: 16rpx;
					justify-content: initial;

					.item-label {
						color: #9E570A;
						font-size: 26rpx;
						margin-right: 60rpx;
					}

					.item-value {
						color: #B58042;
					}
				}
			}
		}

		.data-contain {
			.message-tabs {}

			.type-all {
				position: -webkit-sticky;
				position: sticky;
				width: 100%;
				// top: calc(88rpx + var(--status-bar-height));
				// top: calc(var(--status-bar-height));
				top: 0rpx;
				z-index: 99;
			}

			.data-type {
				display: flex;
				height: 110rpx;
				display: flex;
				align-items: center;
				padding: 0 46rpx;
				justify-content: space-around;
				background-color: #f5f5f5;

				.item-type {
					.item-text {
						color: #303133;
						font-size: 30rpx;
						margin-bottom: 10rpx;
					}
				}

				.item-type-active {
					.item-text {
						color: #002FA5;
						font-size: 30rpx;
						margin-bottom: 10rpx;
					}
				}

				.item-tag {
					background-color: #f5f5f5;
					width: 50rpx;
					height: 6rpx;
					border-radius: 6rpx;
					margin: 0 auto;
				}

				.item-tag-active {
					background: linear-gradient(90deg, #002FA5 5%, rgba(255, 255, 255, 0.00) 91%);
					width: 50rpx;
					height: 6rpx;
					border-radius: 6rpx;
					margin: 0 auto;
				}
			}

			.type-contain {
				border-radius: 10rpx;
				background: #FFFFFF;
				padding: 40rpx 30rpx 30rpx 30rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 2rpx;

				.item-type {
					text {
						color: #909199;
						font-size: 28rpx;
					}

				}

				.item-type-active {
					text {
						color: #002FA5;
						font-size: 28rpx;
					}
				}
			}

			.list-data {
				// height: calc(100vh - 220rpx);

				.scroll-y {
					// height: 100%;
				}

				.list-contain {
					.item-contain {
						background: #FFFFFF;
						margin-bottom: 6rpx;
						border-radius: 10rpx;
						padding-top: 34rpx;


						.item-top {
							padding-left: 46rpx;
							margin-bottom: 30rpx;
							display: flex;
							padding-right: 40rpx;

							.item-top-right {
								display: flex;
								flex: 1;
							}

							.item-top-left {
								display: flex;
								align-items: center;
							}

							.image-contain {
								position: relative;

								.item-status {
									position: absolute;
									border-radius: 10rpx 0rpx 10rpx 0rpx;
									background-color: rgba(0, 0, 0, 0.3);
									left: 0;
									top: 0;
									padding: 6rpx 10rpx;
									color: #fff;
									font-size: 24rpx;
								}
							}

							.item-left {
								margin-left: 30rpx;
								display: flex;
								flex-direction: column;

								.item-name {
									color: #333333;
									font-size: 30rpx;
									line-height: 42rpx;
									margin-bottom: 4rpx;
									word-break: break-all;
									@include bov();
								}

								.item-unit {
									margin-bottom: 8rpx;


									.unit {
										line-height: 20rpx;
										color: #303133;
										font-size: 26rpx;
									}

									.num {
										color: #FF4D35;
										font-size: 28rpx;
									}
								}

								.item-tag {
									margin-bottom: 8rpx;

									.tag {
										border-radius: 5px;
										background: rgba(255, 93, 53, 0.1);
										color: #FF5D35;
										font-size: 24rpx;
										padding: 4rpx 8rpx;
										margin-right: 10rpx;
									}
								}

								.item-time {


									.time {
										color: #909199;
										font-size: 26rpx;
									}

								}
							}
						}

						.item-relation {
							padding-left: 46rpx;
							margin-bottom: 34rpx;
							display: flex;

							.item-value {
								color: #909199;
								font-size: 28rpx;
							}

							.item-name {
								font-size: 28rpx;
								color: #002FA5;
								@include bov();
							}

							image {
								width: 32rpx;
								height: 32rpx;
								margin: 0 8rpx;
							}

						}

						.item-operation {
							margin: 0 20rpx;
							display: flex;
							justify-content: space-between;
							padding: 40rpx;
							border-top: 1rpx solid #F6F6F6;

							.operation {
								display: flex;

								text {
									color: #303133;
									font-size: 28rpx;
									margin-right: 6rpx;
								}

								image {
									width: 36rpx;
									height: 36rpx;
								}
							}

						}

						.operation-display {
							opacity: 0.4;
						}
					}
				}

				.evaluate-contain {
					.rating-bar {
						justify-content: space-around;
						margin: 4rpx 0rpx 0rpx 0rpx;
						height: 120rpx;
						background-color: #fff;
						padding-top: 40rpx;
						// width: 710rpx;

						.left {
							width: 124rpx;
							height: 100rpx;
							text-align: center;
							justify-content: space-around;
							flex-direction: column;

							.title {
								font-family: PingFang SC;
								font-style: normal;
								font-weight: 900;
								font-size: $largeTitleSize;
								// line-height: 78rpx;
								color: $themeColor;
								// margin-left: 20rpx;
							}

							.text {
								font-family: PingFang SC;
								font-style: normal;
								font-size: $middleFontSize;
								// line-height: 40rpx;
								color: $themeColor;
							}
						}

						.right {
							width: 550rpx;
							// height: 120rpx;

							.rating-item {
								justify-content: space-around;

								.text {
									font-family: PingFang SC;
									font-style: normal;
									font-weight: bold;
									font-size: 26rpx;
									// line-height: 36rpx;
									color: #909199;
									width: 60rpx;
								}
							}
						}
					}

					.tags {
						flex-wrap: wrap;
						background-color: #fff;
						padding: 40rpx 36rpx 40rpx 36rpx;

						.tag {
							padding: 0 26rpx;
							margin: 5rpx 7rpx;
							height: 58rpx;
							background: #F8F8F8;
							border: 2rpx solid #E7E7E7;
							box-sizing: border-box;
							border-radius: 25rpx;
							font-family: PingFang SC;
							font-style: normal;
							font-size: $smallFontSize;
							text-align: center;
							line-height: 58rpx;
							color: $viceFontColor;
						}
					}

					.comment-cards {
						margin-top: 4rpx;

						.card {
							width: 750rpx;
						}
					}
				}
			}
		}

		.bottom-contain {
			width: 100%;
			position: fixed;
			background-color: #FFF;
			z-index: 10;
			box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
			display: flex;
			align-items: center;
			padding-left: 54rpx;
			@include buttonsafearea();

			.item-left {
				margin-right: 28rpx;

				.u-checkbox__label {
					font-size: 28rpx;
					color: #303133;
				}
			}

			.button-list {
				display: flex;
				margin: 20rpx 20rpx 2rpx 20rpx;
				flex: 1;
				justify-content: flex-end;
				overflow-y: hidden;
				align-items: center;
				// height: 104rpx;

				.item-button {
					width: 164rpx;
					height: 80rpx;
					border-radius: 10rpx;
					background: #FFFFFF;
					box-sizing: border-box;
					border: 1px solid #EEEEEE;
					margin-right: 14rpx;
					text-align: center;
					line-height: 80rpx;
					color: #303133;
					font-size: 28rpx;
				}

				.item-button-active {
					width: 164rpx;
					height: 80rpx;
					border-radius: 10rpx;
					background: #002FA5;
					box-sizing: border-box;
					border: 1px solid #fff;
					margin-right: 14rpx;
					text-align: center;
					line-height: 80rpx;
					font-size: 28rpx;
					color: #fff;
				}
			}
		}
	}

	.public-name {
		color: #303133;
		font-size: 28rpx;
	}

	.public-item-bottom {
		background-color: #F7F7F7;
		margin-top: 14rpx;

		.u-input {
			border: 0rpx;
		}
	}

	.form-contain {
		height: 100%;
		background-color: #FFF;

		.title {
			text-align: center;
			padding: 36rpx 0rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.item-contain {
			height: calc(100% - 280rpx);

			.desc-contian {
				border-radius: 10rpx;
				background: #FFFFFF;
				padding: 24rpx 32rpx 38rpx 34rpx;
				margin-top: 4rpx;
				margin-bottom: 8rpx;
			}

			.scroll-Y {
				height: 100%;
			}

		}

		.images-contain {
			padding: 0 32rpx;
		}

		.bottom-add {
			position: fixed;
			bottom: 30rpx;
			display: flex;
			justify-content: center;
			width: 100%;

			.item-add {
				width: 624rpx;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: $themeColor;
				border-radius: $miniBorderRadius;
				color: #fff;

			}
		}
	}
</style>
