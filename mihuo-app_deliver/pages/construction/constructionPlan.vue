<template>
	<view class="construction-plan">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				施工计划
			</view>
			<view slot="right" class="nav-bar-right" @click="cutView">
				切换视图
			</view>
		</z-nav-bar>
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<view v-if="viewType==0" class="type-lsit">
			<view class="item-type" :class="[selectIdx == index ? 'item-type-active':'']" @click="getType(item,index)"
				v-for="(item,index) in selectList" :key="index">
				{{item.name}}
			</view>
		</view>
		<view v-if="viewType==0">
			<!-- <view class="select_switch" @click="selectStatus">
				<image src="../../static/icon/me_lise_more.png" :style="selectIndex?'transform: rotate(90deg);':''"
					class="me_lise_more"></image>
				<view class="hint_text">{{screenName}}</view>
				<view style="clear: both;"></view>
			</view>
			<view v-if="selectIndex" class="select-content">
				<view class="select-content-backg">
					<view :class="index==3?'select-content-node':'select-content-node2'"
						:style="index==selectIdx?'color:#002FA5':''" @click="selectTab(item,index)"
						v-for="(item,index) in selectList" :key="index">
						{{item.name}}
					</view>
				</view>
			</view> -->
			<construction-step @getDataList="getData" v-for="(item,index) in nodeData" :stepIndex="index"
				:nodeData="item" :key="index" />
			<!-- <mh-empty v-if="!nodeData.nodeList" icon="/static/images/no_recommend.png" title="您还没有计划～～" /> -->
		</view>
		<view v-if="viewType==1">
			<construction-worker v-for="(item,index) in workerViewList" :key="index" :workerView="item">
			</construction-worker>
		</view>
		<!-- 		<view class="add_button" >新增施工计划</view>
		<view style="height: 60rpx;" v-if="userRole==='R_PROJECT_MANAGER'"></view>
		<bottom-button title="新增施工计划" v-if="userRole==='R_PROJECT_MANAGER'"></bottom-button> -->
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				viewType: 0,
				selectIdx: 1,
				selectIndex: false,
				screenName: '只看我的',
				selectList: [{
						name: '全部',
						value: 0
					},
					{
						name: '只看我的',
						value: 1
					}, {
						name: '今日完成',
						value: 2
					}, {
						name: '已超期',
						value: 3
					}, {
						name: '未完成',
						value: 4
					}
				],
				nodeData: [],
				orderInfo: {},
				workerViewList: [],
				condition: 1,
				option: {},
				projectId: ''
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.parameterType()
		},
		computed: {
			...mapState(['projectInfo', 'userRole', 'userPersonInfo'])
		},
		methods: {
			parameterType() {
				if (this.option.type == '施工计划') {
					if (!this.option.noticeType) {
						this.$notificationsJump(this.option)
					}
					this.projectId = this.option.projectId
				} else {
					this.projectId = this.projectInfo.projectId
				}
				this.getData()
				this.getWorkerView()
			},
			getType(item, index) {
				this.condition =  item.value
				this.selectIdx = index
				this.getData()
			},
			selectTab(item, index) {
				this.condition = index == this.selectIdx ? 0 : item.value
				this.selectIdx = index == this.selectIdx ? -1 : index
				this.screenName = item.name
				this.getData()
			},
			cutView() {
				this.viewType = this.viewType == 0 ? 1 : 0
			},
			selectStatus() {
				this.selectIndex = this.selectIndex ? false : true
			},
			getData() {
				if (!this.projectId ||　!this.userPersonInfo.skillId) {
					return
				}
				this.$httpApi.constructionPlan( {
					condition: this.condition,
					projectId: this.projectId,
					skillId: this.userPersonInfo.skillId,
				}).then(res => {
					if (res) {
						this.nodeData = res
						this.setNodeData()
					}
				})
			},
			setNodeData(){
				this.nodeData.forEach(el =>{
					if(el.nodeList){
						el.nodeList = this.setSorting(el.nodeList)
					}
				})
			},
			setSorting(list) {
				// 排序标记 1=可验收，5=已验收，待整改 6待审核 10=未开始 15=等待中 20=未开始 25=已完成   
				if (list.length === 0) {
					return []
				}
			
				list.map(item => {
					if (item.businessType == 1005) {
						// 施工类节点：0-未完工 1-待验收 2-待整改 3-已验收通过\n验收类节点：0-未验收 1-待验收 2-验收不通过 3-验收通过\n其它类节点无效
						switch (item.checkStatus) {
							case 0:
								switch (item.status) {
									case 0: // 未开始
										item['sorting'] = 10
										break;
									case 1: // 等待中
										item['sorting'] = 15
										break;
									case 2: // 进行中
										item['sorting'] = 20 // 不知道
										break;
									case 3: // 已完成
										item['sorting'] = 25
										break;
								}
								break;
							case 1:
								item['sorting'] = 1
								break;
							case 2:
								item['sorting'] = 20
								break;
							case 3:
								switch (item.status) {
									case 3: // 已完成
										item['sorting'] = 25
										break;
									case 5: // 已完成
										item['sorting'] = 6
										break;
								}
								break;
						}
					} else {
						switch (item.status) {
							case 0: // 未开始
								item['sorting'] = 10
								break;
							case 1: // 等待中
								item['sorting'] = 15
								break;
							case 2: // 进行中
								item['sorting'] = 20 // 不知道
								break;
							case 3: // 已完成
								item['sorting'] = 25
								break;
							case 5: // 待审核
								item['sorting'] = 6
								break;
						}
					}
				})
				return list.sort(this.sortArr('sorting'))
			},
			sortArr(attr) {
				return function(a, b) {
					return a[attr] - b[attr]
				}
			},
			getWorkerView() {
				if (!this.projectId) {
					return
				}

				this.$http.get(`order/project/constructionView/${this.projectId }`).then(res => {
					if (res) {
						this.workerViewList = res
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.construction-plan{
		padding-bottom: 40rpx;
	}
	.nav-bar-right {
		font-size: 28rpx;
		text-align: center;
		color: #013E75;
		margin-right: 50rpx;

	}

	.nav-bar-title {
		font-size: 36rpx;
		color: #333333;
	}

	.add_button {
		background: $themeColor;
		border-radius: 10rpx;
		margin: 60rpx;
		line-height: 90rpx;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;

	}

	.type-lsit {
		background-color: #fff;
		display: flex;
		border-radius: 8px 8px 0px 0px;
		padding: 32rpx;
		margin: 0 20rpx;

		.item-type {
			font-size: $smiddleFontSize;
			color: $viceFontColor;
			margin-right: 60rpx;
			white-space: nowrap;

			&:last-child {
				margin-right: 0rpx;
			}
		}

		.item-type-active {
			color: $themeColor;
			font-weight: bold;
		}
	}

	.select-content {
		position: absolute;
		z-index: 20;
		right: 34rpx;
		margin-top: -10rpx;

		.select-content-backg {
			width: 182rpx;
			height: 400rpx;
			background: url(../../static/icon/bg.png);
			background-repeat: no-repeat;
			background-size: cover;
			position: relative;
			padding-top: 12rpx;

			.select-content-node {
				font-weight: bold;
				font-size: 24rpx;
				line-height: 76rpx;
				text-align: center;
				color: #909199;
				border-bottom: 2rpx dashed #EEEEEE;

			}

			.select-content-node2 {
				font-weight: bold;
				font-size: 24rpx;
				line-height: 76rpx;
				text-align: center;
				color: #909199;
				border-bottom: 2rpx dashed #EEEEEE;

			}
		}
	}

	.select_switch {
		margin-top: 40rpx;
		margin-bottom: 20rpx;
		padding-right: 60rpx;
	}

	.switch {
		height: 40rpx;
		float: left;
		margin-left: 50rpx;
		margin-right: 20rpx;
		color: $themeColor;
	}

	.me_lise_more {
		width: 18rpx;
		height: 26rpx;
		float: right;
		margin-left: 10rpx;
		opacity: 0.8;
	}

	.hint_text {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 26rpx;
		line-height: 26rpx;
		color: #606166;
		float: right;

	}
</style>
