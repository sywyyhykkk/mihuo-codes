<template>
	<view class="abnormalFeedback-contain">
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<view class="u-tabs-contain">
			<u-tabs :list="drawingsType" font-size="26" :is-scroll="false" inactive-color="#909199" bar-height="4"
				:current="current" @change="change"></u-tabs>
		</view>
		<view class="list-contain">
			<view class="list-contain-item" @click="getDetails(item)" v-for="(item,index) in list" :key="index">
				<view class="header-title pulic-bottom">
					<view class="left">异常来源：{{setSource(item)}}{{item.issueName}}</view>
					<view class="right" :style="{ 'color':getColor(item.status) }">{{getText((item.status))}}</view>
				</view>
				<view class="record-time pulic-bottom">
					<view class="name">{{item.orderSource === 0 ? '巡 检 人':'发起人'}}：{{item.person.skillName}}
						{{item.person.name}}
					</view>
					<image class="item-call" src="/static/images/bg-call.png"></image>
				</view>
				<view class="record-time pulic-bottom record-new">
					<view class="name">{{item.created}}</view>
					<image class="shouqi" src="/static/images/shouqi.png">
					</image>
				</view>
			</view>
		</view>
		<mh-empty v-show="list.length === 0" icon="/static/images/no_recommend.png" title="您还没有整改记录～～" />
	</view>
</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	export default {
		data() {
			return {
				current: 0,
				drawingsType: [{
						name: '全部',
						value: -1
					},
					{
						name: '待整改',
						value: 0
					},
					{
						name: '待审核',
						value: 1
					},
					{
						name: '已整改',
						value: 2
					}
				],
				colorList: [{
						color: '#10BF78',
						status: 1,
						text: '待审核'
					}, {
						color: '#FF5D35',
						status: 0,
						text: '待整改'
					},
					{
						color: '#10BF78',
						status: 2,
						text: '已整改'
					}
				],
				uploadType: ['图片', '视频'],
				tempPersonIdListNew: [],
				list: [],
				status: -1,
				pageCurrent: 1,
				size: 6,
				total: 0,
				personId: '',
				projectId:''
			}
		},
		onLoad(option) {
			this.option = option
		},
		onReachBottom() {
			if (this.list.length === this.total) return
			this.pageCurrent += 1
			this.getList()
		},
		onShow() {
			this.pageCurrent = 1
			this.setParameter()
			this.getList()
		},
		computed: {
		   ...mapState(['projectInfo','userPersonInfo'])
		  },
		methods: {
			setParameter(){
				this.projectId = this.projectInfo.projectId
				this.personId = this.userPersonInfo.personId
			},
			setSource(item) {
				if (item.source) {
					return '验收'
				} else {
					return '巡检'
				}
			},
			getColor(status) {
				return this.colorList.filter(item => item.status === Number(status))[0].color
			},
			getText(status) {
				return this.colorList.filter(item => item.status === Number(status))[0].text
			},
			change(index) {
				this.current = index
				this.status = this.drawingsType[index].value
				this.pageCurrent = 1
				this.getList()
			},
			getList() {
				if(!this.projectId){
					return
				}

				this.$httpApi.getOrderabarbeitungList({
					projectId: this.projectId,
					status: this.status,
					size: this.size,
					current: this.pageCurrent
				}).then(res => {
					if (res) {
						this.tempPersonIdListNew = []
						this.total = res.total
						this.list = this.pageCurrent > 1 ? this.list.concat(res.records) : res.records
						this.list.map(item => {
							this.tempPersonIdListNew.push(item.personId)
						})

					}
				})
			},
			getUserList() { // 初始化人员信息
				let tempList = [...new Set(this.tempPersonIdListNew)]
				this.$getPersonIdUser(tempList, (res) => {
					if (res.length > 0) {} {
						this.list.map(item => {
							res.map(el => {
								if (Number(item.personId) === Number(el.personId)) {
									item['jobName'] = el.skillName
									item['name'] = el.name
								}
							})
						})
					}
					// this.$forceUpdate()

				})
			},
			getDetails(item) {
				this.toPage(`/pages/construction/rectification/rectificationDetails?id=${item.id}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pulic-bottom {
		margin-bottom: 10rpx;
	}

	.abnormalFeedback-contain {
		padding-bottom: 40rpx;

		.u-tabs-contain {
			margin: 0rpx 20rpx 2rpx 20rpx;
		}

		.list-contain {
			margin: 0rpx 20rpx;

			.list-contain-item {
				background-color: #FFFFFF;
				padding: 36rpx 56rpx 34rpx 28rpx;
				margin-bottom: 4rpx;

				.header-title {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						font-weight: bold;
						font-size: 28rpx;
						color: #333333;
					}

					.right {
						font-weight: normal;
						font-weight: bold;
						font-size: 26rpx;
						line-height: 36rpx;
						text-align: right;
						color: #A7A7A7;
						display: flex;
						align-items: center;

					}
				}

				.record-time {
					font-weight: bold;
					font-size: 28rpx;
					color: #999999;
					display: flex;
					align-items: center;

					.name {
						font-weight: bold;
						font-size: 28rpx;
						color: #999999;
						margin-right: 12rpx;
					}

					.item-call {
						width: 34rpx;
						height: 34rpx;
					}

					.shouqi {
						width: 16rpx;
						height: 16rpx;
						transform: rotate(-90deg);
						transition: all .2s;
					}
				}

				.record-new {
					display: flex;
					justify-content: space-between;
				}
			}
		}

	}
</style>
