<template>
	<view>
		<view class="operation-records">
			<view class="operation-records-item" v-for="(item,index) in list" :key="index">
				<view class="left-contain">
					<u-avatar class="node" size="52" :src="$util.thumbnailImage(item.person.avatar,true)">
					</u-avatar>
				</view>
				<view class="right-contain">
					<view class="item-header">
						<text class="name">{{item.person.skillName}}({{item.person.name}})</text>
						<text class="time" v-show="item.created">{{item.created.substring(0,16)}} </text>
						<text class="title">发起</text>
						<text class="type-name"
							:class="[item.status === 0 ? 'shutdown':'return ']">{{getStatus(item.status)}}</text>
					</view>
					<view class="item-records">
						<view v-if="item.status === 0">
							<view class="records-header">
								<view class="item-title">
									<text class="label">停工类型</text>
									<text class="value">{{item.typeName}}</text>
								</view>
								<view class="item-title">
									<text class="label">计划停工</text>
									<text
										class="value">{{item.startTime.substring(0,10)}}至{{item.endTime.substring(0,10)}}
										共{{item.totalDay}}天</text>
								</view>
							</view>
							<view class="text-contain">
								<view class="title">停工原因:</view>
								<view class="text-desc">
									{{item.reason}}
								</view>
							</view>
						</view>

						<view v-if="item.status !== 0">
							<view class="records-header">
								<view class="item-title">
									<text class="label">复工时间</text>
									<text class="value">{{item.startTime.substring(0,10)}}</text>
								</view>
								<view class="item-title">
									<text class="label">复工备注</text>
									<text class="value">{{item.reason}}</text>
								</view>
							</view>
						</view>
						<view class="image-contain" v-if="item.pics">
							<image-show :imgSrc="item.pics" right="20"></image-show>
							<!-- <image-upload-new v-model="form.pics" /> -->
						</view>
						<view class="audio-contain" v-if="item.audio">
							<mihuo-audio :formDate="item.audio" />
						</view>
					</view>
				</view>
			</view>
			<mh-empty v-show="list.length === 0" icon="/static/images/no_recommend.png" title="您还没有记录～～" />
		</view>

		<mihuo-bottom-button :buttonList="buttonList" @click="submit()"></mihuo-bottom-button>
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
				typeName: '停工',
				typeNameStatus: true,
				total: 0,
				pageCurrent: 1,
				size: 20,
				option: {},
				projectId: '',

			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.parameterType()
		},
		onReachBottom() {
			if (this.list.length === this.total) return
			this.pageCurrent += 1
			this.getDetails()
		},
		computed: {
			...mapState(['projectInfo']),
			buttonList() {
				let buttonList = [{
					name: this.typeName,
					status: true
				}]
				return buttonList
			}
		},
		methods: {
			parameterType() {
				if (this.option.type == '停工复工') {
					if (!this.option.noticeType) {
						this.$notificationsJump(this.option)
					}
					this.projectId = this.option.projectId
				} else {
					this.projectId = this.projectInfo.projectId
				}
				this.getDetails()
			},
			getDetails() {
				this.$httpApi.orderworkstatusPage({
					projectId: this.projectId,
					size: this.size,
					current: this.pageCurrent,
				}).then(res => {
					if (res) {
						this.list = this.pageCurrent > 1 ? this.list.concat(res.records) : res.records
						this.total = Number(res.total)
						if (res.status) {
							this.typeName = '复工'
							this.typeNameStatus = false
						} else {
							this.typeName = '停工'
							this.typeNameStatus = true
						}
					}
				})
			},
			preview(ul) {
				uni.previewImage({
					current: 1,
					urls: [ul],
				})
			},
			getStatus(val) {
				if (!val) {
					return '停工'
				} else {
					return '复工'
				}
			},
			submit() {
				this.toPage(`/pages/construction/shutdownReturnWork/shutDownForm?typeName=${this.typeName}`)
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
					.type-name,
					.title {
						font-size: 28rpx;
						color: #909199;
					}

					.shutdown {
						color: #FF5D35;
					}

					.return {
						color: $themeColor;
					}
				}

				.item-records {
					background-color: #FFFFFF;
					padding: 30rpx 44rpx 52rpx 46rpx;
					border-radius: 10rpx;

					.item-title {
						margin-bottom: 28rpx;

						.label {
							font-size: 28rpx;
							color: #909199;
							margin-right: 22rpx;

						}

						.value {
							font-size: 28rpx;
							color: $seconFontColor;
						}
					}

					.text-contain {
						margin-bottom: 28rpx;
						display: flex;
						flex-direction: column;

						.title {
							font-size: 28rpx;
							color: #909199;
							margin-bottom: 12rpx;
						}

						.text-desc {
							font-size: 28rpx;
							color: $seconFontColor;
						}

					}

					.image-contain {
						margin-bottom: 22rpx;
						display: flex;
						flex-wrap: wrap;

						.record-item-img {
							width: 132rpx;
							margin-right: 10rpx;

							&:last-child {
								margin-right: 0rpx;
							}
						}
					}
				}

			}
		}
	}

	.submit-text-contain {
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
</style>
