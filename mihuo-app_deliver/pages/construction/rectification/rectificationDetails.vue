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
						<text class="name">{{item.skillName}}({{item.name}})</text>
						<text class="time" v-if="item.dealTime">{{item.dealTime.substring(0,16)}}</text>
						<text class="title" v-if="item.status !== 2">{{index === 0 ? '发起':'处理'}}整改</text>
						<text class="title" v-if="item.status === 2">通过整改</text>
					</view>
					<view class="item-records">
						<view v-if="index === 0 && item.issueContents" class="records-header">
							<view class="left">{{item.issueContents}}</view>
						</view>
						<view v-if="item.status === 2 && item.issueContents" class="records-header">
							<view class="left">{{item.issueContents}}</view>
						</view>
						<view v-else class="text-contain">
							<view class="text-desc">
								{{item.contents}}
							</view>
						</view>
						<view class="image-contain" v-if="item.pics">
							<image-show :imgSrc="item.pics" right="20"></image-show>
						</view>
						<view class="audio-contain" v-if="item.audio">
							<journal-audio :formDate="item.audio" class="voice" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-text-contain-all">
			<view :class="[item.status === 1?'refused-to': details.status == 0 ?'submit-text-all' :'submit-text']"
				@click="submit(item.label)" v-for="(item,index) in getButtonShow" :key="index">{{item.label}}</view>
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
				option: {},
				details: {},
				typeNameStatus: false,
				typeNameStatusAll: true,
				list: [],
				buttonList: [
					// {
					// 	label: '去申述',
					// 	value: 1,
					// 	status: 1
					// },
					{
						label: '去整改',
						value: 1,
						status: 2
					},
					{
						label: '不通过',
						value: 2,
						status: 1
					},
					{
						label: '确认通过',
						value: 2,
						status: 2
					}
				],
				personListTemp: [],
				personId: ''
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.setParameter()
			this.getDetails()
			this.list = []
		},
		computed: {
			...mapState(['userPersonInfo']),
			getButtonShow() {
				switch (this.details.status) {
					case 0: // 待整改
						if (this.personListTemp.includes(this.personId)) {
							return this.buttonList = this.buttonList.filter(item => item.value === 1)
						} else {
							return []
						}
						break
					case 1: // 待审核
						if (this.details.personId === this.personId) {
							return this.buttonList = this.buttonList.filter(item => item.value === 2)
						} else {
							return []
						}
						break
					case 2: // 已审核
						return []
						break
					case 3: // 审核失败
						break
						return []
				}

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
			setParameter() {
				this.personId = this.userPersonInfo.personId
			},
			preview(ul) {
				uni.previewImage({
					current: 1,
					urls: [ul],
				})
			},
			getDetails() {
				this.$httpApi.getOrderabarbeitungDetails({
					id: this.option.id,
				}).then(res => {
					if (res) {
						res.abarbeitungDetailList && res.abarbeitungDetailList.map(item => {
							item.pics = item.pics
							item.audio = item.audio !== '' && JSON.parse(item.audio)
							item.contents = item.contents
							item.avatar = item.person.avatar
							item.skillName = item.person.skillName
							item.name = item.person.name
						})
						this.list = res.abarbeitungDetailList || []
						this.list.unshift({
							avatar: res.person.avatar,
							skillName: res.person.skillName,
							name: res.person.name,
							dealTime: res.created,
							issueContents: res.issueContents,
							pics: res.issuePics
						})
						this.personListTemp = []
						if (res.personList.length > 0) {
							res.personList.map(item => {
								this.personListTemp.push(item.personId)
							})
						}
						this.details = res
					}
				})
			},
			submit(val) {
				this.debounce(() => {
					if (['不通过', '确认通过'].includes(val)) {
						this.$httpApi.getOrderabarbeitungSave({
							personId: this.personId,
							parentId: this.details.id,
							contents: val,
							status: val === '不通过' ? 3 : 2
						}).then(res => {
							if (res) {
								this.$util.toast(`确认成功`);
								uni.navigateBack()
							}
						})
					} else {
						if (val === '去申述') {
							uni.setStorageSync('typeName', '申述')
							this.toPage(
								`/pages/construction/complaint/complaintForm?punishment=整改&id=${this.details.id}&typeName=${this.details.source === 1 ? '验收':'巡检'}`
							)
						} else {
							if (!this.details.id) {
								return
							}

							if (this.option.toDoType) {
								this.toPage(
									`/pages/construction/rectification/rectificationForm?id=${this.details.id}&toDoType=${this.option.toDoType}&bizPendingDetailId=${this.option.bizPendingDetailId}`
								)
							} else {
								this.toPage(
									`/pages/construction/rectification/rectificationForm?id=${this.details.id}`
								)
							}

						}
					}

				}, 200)
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
						margin-right: 20rpx;
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
					background-color: #FFFFFF;
					padding: 30rpx 44rpx 52rpx 46rpx;
					border-radius: 10rpx;

					.records-header {
						display: flex;
						justify-content: space-between;
						// margin-bottom: 24rpx;

						.left {
							font-weight: bold;
							font-size: 30rpx;
							color: $seconFontColor;
						}

						.right {
							font-size: 26rpx;
							color: $themeColor;

						}
					}

					.text-contain {
						margin-top: 24rpx;
						display: flex;

						.title {
							font-size: 28rpx;
							color: #909199;
							min-width: 130rpx;
						}

						.text-desc {
							font-size: 28rpx;
							color: $seconFontColor;
						}

					}

					.image-contain {
						margin-top: 28rpx;
						display: flex;
						flex-wrap: wrap;
						margin-bottom: 20rpx;

						.record-item-img {
							width: 150rpx;
							margin-right: 16rpx;
							margin-bottom: 16rpx;

							&:nth-of-type(3n+ 0) {
								margin-right: 0rpx;
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

		.submit-text {
			display: flex;
			justify-content: center;
			width: 624rpx;
			height: 88rpx;
			background: $themeColor;
			color: #FFFFFF;
			font-weight: bold;
			font-size: 28rpx;
			align-items: center;
			border-radius: 10rpx;
		}
	}

	.submit-text-contain-all {
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

		.submit-text-all {
			display: flex;
			justify-content: center;
			width: 624rpx;
			height: 88rpx;
			background: $themeColor;
			color: #FFFFFF;
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
