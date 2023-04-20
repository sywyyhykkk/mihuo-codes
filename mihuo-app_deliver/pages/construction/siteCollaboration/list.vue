<template>
	<view class="site-collaboration">
		<mihuo-order-information :projectId="projectInfo.projectId"></mihuo-order-information>
		<view class="tab-contain">
			<list-tab :list="tabList" @change="changTab"></list-tab>	
		</view>
		<view v-if="list.length > 0" class="list-contain">
			<view class="item" v-for="(item,index) in list" :key="index" @click="getDetails(item)">
				<view class="top display-justify_between">
					<text class="time">时间：{{item.created && item.created.substring(0,16) }}</text>
					<text class="status">{{getStatusName(item)}}</text>
				</view>
				<view class="middle">
					<view class="title">{{item.requirementName}}</view>
					<view class="start-time">
						<text class="label">开工时间：</text>
						<text class="value">{{item.expectDate}}至{{item.expectCompleteDate}}</text>
					</view>
					<view v-if="item.requirementDesc" class="text-contain">
						<text class="label">委托内容：</text>
						<text class="value">{{item.requirementDesc}}</text>
					</view>
					<view class="skill">
						<text class="label">所需工种：</text>
						<text class="value">{{item.skillName}}</text>
					</view>
				</view>
			</view>
		</view>
		<mihuo-bottom-button :buttonList="buttonList" @click="getButton()"></mihuo-bottom-button>
		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="没有待处理项～～" />
		<!-- <u-loadmore v-else :status="status" /> -->
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				list: [],
				pageSize: 10,
				total: 0,
				pages: 0,
				contrast: 0,
				status: 'loadmore',
				orderStatus: -1,
				buttonList: [{
					name: '发起协作',
					status: true
				}],
				// 10-已发布/待确认，20-已确认/待付款，30-已付款/服务中，35-已申请/待验收，40-待结算，50-已完成/待评价，51-已完成/已评价，-1-已取消
				tabList: [{
					name: '全部',
					value: '-1'
				}, {
					name: '已发起',
					value: 10
				}, {
					name: '工作中',
					value: 30
				}, {
					name: '待验收',
					value: 35
				},
				{
					name: '已完成',
					value: 50
				}],
				tabCurrent: 0,
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '30rpx'
				},
			}
		},
		computed: {
			...mapState(['projectInfo']),

		},
		mounted() {

		},
		onShow() {
			this.getList()
		},
		onReachBottom() { //与methods 同级
			if (this.list.length === Number(this.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pages += 1
				this.getList()
			}
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getStatusName(ev) {
				let resultName = this.tabList.find(item => item.value == ev.orderStatus)
				if (resultName) {
					return resultName.name == '全部' ? '' : resultName.name
				}
				return ''
			},
			changTab(index) {
				this.tabCurrent = index
				this.orderStatus = this.tabList[index].value
				this.getList()
			},
			getButton() {
				this.toPage('/pages/construction/siteCollaboration/add')
			},
			getDetails(item) {
				this.toPage(`/pages/construction/siteCollaboration/details?id=${item.hashId}`)
			},
			getList() {
				this.$httpApi.outsourcingPage({
					current: this.pages,
					size: this.pageSize,
					projectId: this.projectInfo.projectId,
					orderStatus: this.orderStatus == -1 ? '': this.orderStatus,
				}).then((res) => {
					if (!res) {
						return
					}
					this.total = res.total
					if (this.pages > 1) {
						if (this.pages !== this.contrast) {
							this.list = [...this.list, ...res.records]
							this.contrast = this.pages
						}
					} else {
						this.list = res.records
						this.contrast = this.pages
					}
					if (this.list.length === Number(this.total)) {
						this.status = 'nomore'
					}
					if (this.total == 0) {
						this.status = 'nomore'
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.tab-contain {
		margin: 0 20rpx 4rpx 20rpx;
		border-radius: 10rpx;
		position: -webkit-sticky;
		position: sticky;
		top: 0rpx;
		z-index: 9;
	}

	.list-contain {
		margin: 0 20rpx;
		// padding-bottom: 200rpx;

		.item {
			border-radius: 16rpx;
			background-color: #fff;
			margin-bottom: 10rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}


			.top {
				padding: 28rpx 0rpx;
				border-bottom: 2rpx solid #F6F7F9;
				margin: 0rpx 26rpx;

				.time {
					color: $viceFontColor99;
					font-size: $smallFontSize;
					line-height: 32rpx;
				}

				.status {
					color: $themeColor;
					font-size: $smallFontSize;
				}
			}

			.middle {
				padding: 20rpx 26rpx 26rpx 26rpx;

				.title {
					font-size: $middleFontSize;
					color: #3D3D3D;
					line-height: 32rpx;
				}

				.start-time {
					margin-top: 14rpx;

					text {
						font-size: $fontSize26;
						color: $seconFontColor;
					}

				}

				.text-contain {
					margin-top: 20rpx;

					text {
						font-size: $fontSize26;
						color: $seconFontColor;
					}
				}

				.skill {
					margin-top: 20rpx;

					text {
						font-size: $fontSize26;
						color: $viceFontColor;
					}
				}
			}
		}
	}
</style>
