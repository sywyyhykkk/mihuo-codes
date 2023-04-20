<template>
	<view class="construction-log">
		<view class="list-contian" v-if="journalList.length > 0">
			<view class="operation-records-item" v-for="(item,index) in journalList" :key="index">
				<view class="left-contain">
					<u-avatar class="node" v-if="item.person" size="52"
						:src="$util.thumbnailImage(item.person.avatar,true)">
					</u-avatar>
				</view>
				<view class="right-contain">
					<view class="item-header">
						<text class="name" v-if="item.person">{{item.person.skillName}}({{item.person.name}})</text>
						<text class="time" v-show="item.created">{{item.created.substring(0,16)}} </text>
						<view class="item-records">
							<view class="item-desc">
								{{item.desc}}
							</view>
							<view class="image-contain" v-if="item.pic">
								<image-show :imgSrc="item.pic" right="20"></image-show>
							</view>
							<view class="audio-contain" v-if="item.audio">
								<mihuo-audio :formData="item.audio" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-else title="这里空荡荡哒～" />
		<bottom-button v-if="Number(parameter.orderStatus) < 50 && parameter.viewType == '填写' " title="填写服务日志"
			@click="submit()"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				parameter: {},
				journalList: []
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {
			this.setParameter()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			submit() {
				this.toPage(
					`/pages/orderReceiving/acceptance/addConstructionLog?orderDetails=${this.option.orderDetails}`
				)
			},
			setParameter() {
				let data = JSON.parse(this.option.orderDetails)
				this.parameter.id = data.id
				this.parameter.latAddress = data.latAddress
				this.parameter.orderCode = data.orderCode
				this.parameter.workStatus = data.workStatus
				this.parameter.skillId = data.skillId
				this.parameter.personId = data.personId
				this.parameter.viewType = data.viewType
				this.parameter.orderStatus = data.orderStatus
				console.log("this.parameter.orderStatus", this.parameter.orderStatus);
				console.log("this.parameter.viewType", this.parameter.viewType);
				this.getDetailsList()
			},
			setUserData() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						if (res.personageList.length > 0) {
							let user = res.personageList.find(item => item.skillId == this.parameter.skillId)
							if (user) {
								this.parameter.personId = user.personId
								this.getDetailsList()
							}
						}
					}
				})
			},
			getDetailsList() {
				this.$httpApi.getConstructionLogs({
					orderId: this.parameter.id || 0
				}).then(res => {
					if (res) {
						this.journalList = res;
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.construction-log {
		padding: 36rpx 22rpx 130rpx 50rpx;
	}

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

		&:last-child {

			.right-contain {
				.item-header {
					margin-bottom: 0rpx;
				}
			}
		}

		.right-contain {
			width: 100%;

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
				padding: 30rpx 44rpx 20rpx 46rpx;
				border-radius: 10rpx;
				margin-top: 30rpx;

				.item-desc {
					font-size: 24rpx;
					color: #303133;
					margin-bottom: 18rpx;
				}

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
</style>
