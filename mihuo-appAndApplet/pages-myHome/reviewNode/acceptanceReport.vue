<template>
	<view>
		<z-nav-bar fontColor="#000" backState="1000">
			<view slot="default">报告</view>
		</z-nav-bar>
		<u-tabs :list="reportTypes" bgColor="#FFFFFF" :show-bar="true" font-size="28" :gutter="60"
			inactive-color="#808080" active-color="#000000" :is-scroll="false" :current="currentIndex"
			@change="changeReportType">
		</u-tabs>
		<scroll-view scroll-y class="report-content">
			<view class="report-item" v-for="(item, index) of currentList" :key="index" @click="goToDetail(item)">
				<view class="item-header flex-center">
					<view class="left flex-center">
						<view class="report-type">
							{{ item.type || reportData[currentType]['title'] }}
						</view>
						<view class="report-creator flex-center" v-if="item.userId" >
							<u-avatar :src="$util.avatarImage(item.userId)" size="24"></u-avatar>
							<view class="name">
								{{ item.personName }}
							</view>
							<view class="skill-name">
								{{ item.skillName }}
							</view>
						</view>
					</view>
					<view class="right" v-if="item.customerReadStatus == 0" />
				</view>
				<view class="item-title">
					{{ item.name || item.nodeName || item.title || ''}}
				</view>
				<view class="item-footer flex-center">
					<view class="left">
						{{ item.createTime || item.created }}
					</view>
					<view class="right flex-center">
						查看 <uni-icons style="margin-left: 10rpx;" color="#000000" type="right" size="10"></uni-icons>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressId: '',
				currentList: [],
				currentIndex: 0,
				currentType: '',
				reportTypes: [{
						name: '全部',
						value: ''
					},
					// {
					// 	name: '变更确认',
					// 	value: 'alterationList'
					// },
					{
						name: '交底报告',
						value: 'discloseList'
					},
					{
						name: '巡检报告',
						value: 'inspectionList'
					},
					{
						name: '验收报告',
						value: 'acceptanceList'
					},
				],
				tempData: {},
				reportData: {
					alterationList: {
						title: '变更确认',
						list: [], //变更
					},
					discloseList: {
						title: '交底报告',
						list: [], //交底
					},
					inspectionList: {
						title: '巡检报告',
						list: [] //巡检
					},
					acceptanceList: {
						title: '验收报告',
						list: [], //验收
					},
				},
			}
		},
		onLoad(option) {
			this.addressId = option.id
		},
		onShow() {
			this.getReport()
		},
		methods: {
			// 切换报告类型
			changeReportType(e) {
				this.currentIndex = e
				if (e == 0) {
					// 查看全部
					this.currentType = ''
					this.currentList = []
					for (let key in this.tempData) {
						if (this.tempData[key]) {
							this.tempData[key].forEach(item => {
								if (key == 'acceptanceList') item.created = item.createTime
								const obj = {
									type: this.reportData[key]['title'],
									...item
								}
								this.currentList.push(obj)
							})
						}
					}
				} else {
					this.currentType = this.reportTypes[e]['value']
					this.currentList = this.reportData[this.currentType].list
				}
				/**
				 * 按照时间进行排序
				 * 正序:pre-next
				 * 倒序:next-pre
				 */
				this.currentList = this.currentList && this.currentList.sort((pre,next)=>{
					return Date.parse(next.created) - Date.parse(pre.created);
				})
			},
			// 查看报告详情
			goToDetail(item) {
				const {
					id,
					nodeId,
					customerReadStatus
				} = item
				let { type } = item
				let obj = {
					id: id || nodeId,
					type: 0,
				}
				if(!type){
					type = this.reportData[this.currentType]['title']
				}
				let url = ''
				switch (type) {
					case '变更确认':
						obj.type = 1
						url = `/pages-myHome/changeItem?itemId=${id}&sopNode=true`
						break;
					case '交底报告':
						obj.type = 2
						url = `/pages-myHome/reviewNode/discloseReport?nodeId=${nodeId}&type=download`
						break;
					case '巡检报告':
						obj.type = 3
						url = `/pages-myHome/onSiteInspection?id=${id}`
						break;
					case '验收报告':
						obj.type = 4
						url = `/pages-order/acceptance/acceptance-report-template?nodeId=${nodeId}&type=download`
						break;
				}
				if(customerReadStatus == 0){
					// customerReadStatus为0=未读时 先设置为已读
					this.$httpApi.readMyHomeReport(obj).then(res => {
						if(res){
							this.toPage(url)
						}
					})
				} else {
					this.toPage(url)
				}
			},
			getReport() {
				this.$httpApi.getAcceptanceReportByAddressId(this.addressId).then(res => {
					if (res) {
						this.tempData = res
						for (let key in this.reportData) {
							for (let key2 in res) {
								if (key == key2) {
									this.reportData[key].list = res[key2] && res[key2]
								}
							}
						}
						this.changeReportType(this.currentIndex)
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.report-content {
		width: 100vw;
		height: calc(100vh - 168rpx - env(safe-area-inset-bottom));
		background-color: #F7F7F7;
		padding: 20rpx 30rpx 0;

		.report-item {
			width: 690rpx;
			height: 197rpx;
			padding: 30rpx;
			border-radius: 30rpx;
			background-color: #FEFEFE;
			margin-bottom: 20rpx;

			.item-header {
				width: 100%;
				height: 36rpx;
				justify-content: space-between;

				.left {
					.report-type {
						width: max-content;
						height: 36rpx;
						padding: 0 10rpx;
						line-height: 36rpx;
						background: rgba(254, 110, 50, 0.1);
						border-radius: 18rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #FE6E32;
						line-height: 36rpx;
						margin-right: 20rpx;
					}

					.report-creator {
						.name {
							height: 36rpx;
							font-size: 24rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 400;
							color: #000000;
							line-height: 36rpx;
							margin-left: 10rpx;
						}

						.skill-name {
							width: max-content;
							height: 36rpx;
							padding: 0 10rpx;
							background: rgba(254, 110, 50, 0.1);
							border-radius: 6rpx;
							font-size: 18rpx;
							font-family: HuXiaoBo-NanShen;
							font-weight: 500;
							color: #FE6E32;
							line-height: 36rpx;
							margin-left: 10rpx;
						}
					}
				}

				.right {
					width: 10rpx;
					height: 10rpx;
					background: #ED3832;
					border-radius: 50%;
				}
			}

			.item-title {
				width: 100%;
				height: 36rpx;
				font-size: 32rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 36rpx;
				margin-top: 20rpx;
			}

			.item-footer {
				width: 100%;
				height: 36rpx;
				margin-top: 25rpx;
				justify-content: space-between;

				.left,
				.right {
					width: 50%;
				}

				.left {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #999999;
					line-height: 36rpx;
				}

				.right {
					justify-content: flex-end;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #000000;
					line-height: 36rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
