<template>
	<view class="operation-records">
		<view class="list">
			<view class="operation-records-item" v-for="(item,index) in list" :key="index">
				<view class="left-contain">
					<view class="node"></view>
				</view>
				<view class="right-contain">
					<view class="item-header">
						<view class="time">{{item.productDesc}} </view>
						<!-- <view class="title">开槽钻孔工序{{getStatusName(item.status)}}</view> -->
					</view>
					<view class="item-records"
						@click.stop="toPage(`/pages/construction/selectConstruction/logDetails?id=${item.id}`)">
						<view class="title-contain">
							<text class="item-label">施工内容</text>
							<view class="item-right">
								<text class="item-text">查看详情</text>
								<image :src="'/static/images/shouqi.png'" class="icon-jian"></image>
							</view>
						</view>
						<view class="details-list" v-if="item.detailList">
							<view class="title">今日施工内容</view>
							<view class="item-details" v-for="(item1,index1) in item.detailList" :key="index1">
								<view v-if="index1 < 3" class="list-contain">
									<text class="item-title">{{item1.name}}</text>
									<view class="item-status"
										:style="{ color: getStatus(item1.status,'color'),background:getStatus(item1.status,'bg')}">
										{{getStatus(item1.status,'text')}}
									</view>
									<!-- <view class="image-contain" v-if="item1.pic && item.pic !== '[]'">
										<image-show :imgSrc="item1.pic" width="144" height="144" :key="item.pic">
										</image-show>
									</view> -->
								</view>
								<view v-if="index1 > 3" class="list-contain">
									................
								</view>
							</view>
						</view>
						<!-- <view class="text-contain">
							{{item.desc || '今日工作已完成。'}}
						</view> -->
						<!-- <view class="image-contain" v-if="item.pic && item.pic !== '[]'">
							<image-show :imgSrc="item.pic" width="144" height="144" :key="item.pic"></image-show>
						</view> -->
						<view class="audio-contain" v-if="item.audio">
							<journal-audio :formDate="JSON.parse(item.audio)"></journal-audio>
						</view>
						<view class="item-user">
							<u-avatar size="40" :src="$util.thumbnailImage(item.avatar,false)" mode="circle"
								class="portrait">
							</u-avatar>
							<view class="item-text">
								{{item.skillName}}{{item.created.substring(0,16)}}
							</view>
						</view>
			
						<!-- <view class="tomorrow-contain" v-if="item.futureDesc">
							<view class="title">明日施工内容</view>
							<view class="tomorrow-desc">{{item.futureDesc}}</view>
						</view> -->
					</view>
				</view>
			</view>
		</view>
		
		<mh-empty v-show="list.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
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
				total: 0,
				size: 10,
				pageCurrent: 1,
				option: '',
				colorList: [{
						status: 0,
						// name: '未开工',
						// color: '#FF5D35',
						// bgColor: '#FEF1E3'
						name: '',
						color: '',
						bgColor: ''
					},
					{
						status: 1,
						name: '施工中',
						color: '#002FA5',
						bgColor: '#E5EAF6'
					},
					{
						status: 2,
						name: '已完工',
						color: '#10C57D',
						bgColor: '#D5FFEE'
					}
				],
			}
		},
		onLoad(option) {
			this.option = option
			this.getDetails()
		},
		onReachBottom() {
			if (this.list.length === this.total) return
			this.getDetails()
		},
		computed: {
			...mapState(['userPersonInfo', 'orderInfo'])
		},
		methods: {
			getStatusName(status) {
				switch (status) {
					case 0:
						return '未开始'
					case 1:
						return '进行中'
					case 2:
						return '完成'
				}
			},
			getStatus(status, typeName) {
				switch (typeName) {
					case 'text':
						return this.colorList.find(item => item.status === status).name
					case 'color':
						return this.colorList.find(item => item.status === status).color
					case 'bg':
						return this.colorList.find(item => item.status === status).bgColor
				}

			},
			getDetails() {
				if (!this.orderInfo.orderId) {
					console.error('订单id不能为空')
					return
				}

				this.$httpApi.getConstructionRecordNew({
					orderId: this.orderInfo.orderId,
					size: this.size,
					current: this.pageCurrent,
					currentPersonId: this.userPersonInfo.personId,
					// servicePackId: '',
					productId: this.option && this.option.productId,
				}).then(res => {
					if (res) {
						this.total = res.total
						this.list = this.pageCurrent > 1 ? this.list.concat(res.records) : res.records
						this.pageCurrent += 1
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.operation-records {
		padding: 36rpx 22rpx 0 32rpx;
		
		
		


		.operation-records-item {
			display: flex;
			position: relative;
			
			&:last-child {
				.right-contain{
					padding-bottom: 0rpx;
				}
			}

			.left-contain {
				border-left: 2rpx dashed #C4C4C4;
				width: 22rpx;
				margin-top: 8rpx;

				.node {
					position: absolute;
					left: -10rpx;
					width: 24rpx;
					height: 24rpx;
					background: #ffffff;
					border-radius: 50%;
					border: 8rpx solid #C4C4C4;
				}
			}

			.right-contain {
				width: 100%;
				padding-bottom: 28rpx;

				.item-header {
					display: flex;
					align-items: center;
					margin-bottom: 22rpx;

					.time {
						margin-right: 20rpx;
					}

					.time,
					.title {
						font-size: 28rpx;
						color: #909199;
					}
				}

				.item-records {
					background-color: #FFFFFF;
					padding: 30rpx 44rpx 30rpx 46rpx;
					border-radius: 10rpx;

					.text-contain {
						font-weight: bold;
						font-size: 30rpx;
						color: #333333;

					}

					.title-contain {
						display: flex;
						justify-content: space-between;
						margin-bottom: 18rpx;

						.item-label {
							color: #303133;
							font-size: 28rpx;
							font-weight: bold;
							line-height: 38rpx;
						}

						.item-right {
							display: flex;
							align-items: center;

							text {
								color: #303133;
								font-size: 24rpx;
							}

							image {
								margin-left: 10rpx;
								width: 16rpx;
								height: 14rpx;
								transform: rotate(-90deg)
							}
						}
					}

					.image-contain {
						margin-top: 22rpx;
						;
						margin-bottom: 22rpx;

						.record-item-img {
							width: 180rpx;
						}
					}

					.item-user {
						display: flex;
						align-items: center;
						margin-top: 30rpx;

						.item-text {
							font-size: 24rpx;
							color: #909199;
							margin-left: 12rpx;
						}

					}
				}

			}
		}
	}

	.details-list {

		.title {
			color: #303133;
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 18rpx;
			line-height: 38rpx;
		}

		.item-details {

			.item-title {
				color: #303133;
				font-size: 28rpx;
				line-height: 38rpx;
				max-width: 470rpx;
			}

			.item-status {
				width: 100rpx;
				font-size: 24rpx;
				border-radius: 20rpx;
				text-align: center;
				padding: 4rpx 0;
				margin-left: 10rpx;
				white-space: nowrap;
			}

			.list-contain {
				display: flex;
				align-items: center;
				align-items: center;
				margin-bottom: 14rpx;
			}

			&:last-child {
				.list-contain {
					margin-bottom: 0rpx;
				}
			}
		}
	}

	.tomorrow-contain {
		border-top: 2rpx solid #F6F6F6;
		padding-top: 30rpx;
		margin-top: 30rpx;

		.title {
			color: #303133;
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 18rpx;
			line-height: 38rpx;
		}


		.tomorrow-desc {
			color: #303133;
			font-size: 28rpx;
			line-height: 38rpx;
		}
	}
</style>
