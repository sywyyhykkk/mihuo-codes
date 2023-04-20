<template>
	<view class="worker-people" :style="imType?'':'border-bottom:0;'">
		<view class="people-info" :style="imType ? '' : 'border: 0;'">
			<view class="info-photo">
				<u-avatar size="130" :src="$util.avatarImage(workerData.userId)" />
				<view class="photo-text" v-if="workerStatus === 1">
					{{setWorkerStatusName}}
				</view>
				<view class="photo-text2" v-if="workerStatus === 0">
					{{setWorkerStatusName}}
				</view>
			</view>
			<view class="info-right">
				<view class="right-title" style="height: 50rpx;margin-bottom: 10rpx;margin-top: 10rpx;">
					<view class="people-name" v-if="workerData">
						{{ workerData[prop.personName] || workerData[prop.name] }}
					</view>
					<view class="people-worker-type">
						<view class="woker-class">v{{ workerData.level || 0 }}</view>
						<view class="type-text" v-if="workerData">{{workerData[prop.workerType]||workerData['jobName']}}
						</view>
					</view>
					<view class="people-price" v-if="priceType && workerData.bidPrice > 0">价格{{ workerData.bidPrice }}元</view>
				</view>
				<view class="right-title" v-if="tagitem">
					<view class="tag-item">{{ workerData.skillYearNum }}</view>
					<view class="tag-item">认真负责</view>
					<view class="tag-item">响应迅速</view>
				</view>
				<view class="right-bottom" v-if="statisticsType">
					<view class="other-item">合作过 <text>3次</text></view>
					<view class="other-item">好评率 <text>98%</text></view>
					<view class="other-item">在施工 <text>3单</text></view>
				</view>
				<view class="right-im" v-if="rightIm">
					<view style="flex: 1;display: flex;">
						<image src="../../static/images/tel.png" class="im-image" @click="getPhone(workerData.phone)">
						</image>
						<image src="../../static/images/chat.png" class="im-image" style="margin-left: 20rpx;"
							@click="goToIM()"></image>
					</view>
					<view class="im-confirm" v-if="workerStatus === 0" @click="confirmPersonClicked(workerData)">
						{{setButtonStatusName}}
					</view>
				</view>
			</view>
		</view>
		<view class="people-im" v-if="imType">
			<view class="im-go">
				<view class="go-text">在线聊天</view>
				<!-- <image src="../../static/images/groupInfo.png" class="go-image"></image> -->
			</view>
			<view class="people-select" @click.stop="selectChange">{{selectType?'取消选择':'选择'}}</view>
		</view>
	</view>
</template>

<script>
	import tabInit from '@/plugins/im/tabInit.js';
	import {
		tabSqls
	} from '@/plugins/im/tabSqls.js';

	export default {
		props: {
			bidPrice: {
				type: [Number, String],
				default: 0
			},
			// 报价信息ID
			bidId: {
				type: [Number, String],
				default: ''
			},
			// 确认选择报价人员
			confirmPerson: {
				type: Function,
				default: () => {}
			},
			priceType: {
				type: Boolean,
				default: true
			}, //控制价格是否显示，true显示，默认为显示
			workerData: {
				type: Object,
				default () {
					return {}
				}
			}, //工人信息，如姓名，工种，岗位之类的
			prop: {
				type: Object,
				default () { //当字段不符合要求时，自定义对应的key，用法如:prop="{name:'employeeName',workerType:'jobName'}"
					return {
						name: 'name', //姓名
						workerType: 'skillName', //工种
						personName: 'personName'
					}
				}
			},
			multiple: {
				type: Boolean,
				default: false
			}, //是否支持多选
			statisticsType: {
				type: Boolean,
				default: true
			}, //控制是否合作过，好评率栏的显示
			imType: {
				type: Boolean,
				default: true
			}, //是否支持聊天
			tagitem: {
				type: Boolean,
				default: true
			}, //控制标签的显示
			rightIm: {
				type: Boolean,
				default: false
			}, //控制右边im
			workerStatus: {
				type: Number,
				default: 0
			},
			buttonStatus: {
				type: Number,
				default: 0
			},
			selectTypeName: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				selectType: false,
				confirmStatus: true
			}
		},
		computed: {
			setButtonStatusName() {
				// <!-- bidStatus 0=待确认，1=接单方确认失败，2=接单方确认成功（发单方尚未确认）3=接单方接受4=发单方拒绝 5=发单方取消报价6=接单放取消订单 7=关闭竞价订单 -->
				if (this.selectTypeName) {
					switch (this.buttonStatus) {
						case 0:
							this.confirmStatus = false
							return '待确认'
						case 1:
							return '接单方确认失败'
						case 2:
							this.confirmStatus = true
							return '确认选他'
					}
				} else {
					return '确认选他'
				}

			},
			setWorkerStatusName() {
				if (this.selectTypeName) {
					switch (this.buttonStatus) {
						case 0:
							return '待确认'
						case 3:
							return '已确认'
						default:
							return ''
					}
				} else {
					if(this.workerStatus == 1){
						return '已指派'
					}else{
						return ''
					}
				}
			}
		},
		mounted() {},
		methods: {
			confirmPersonClicked(item) {
				if (this.confirmStatus) {
					this.$emit('confirmPerson', item, this.bidId, this.bidPrice)
				}
			},
			selectChange() {
				this.selectType = !this.selectType
				this.$emit('selectChange')
			},
			getPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			goToIM() {
				// 创建IM
				if (this.workerData.userId == this.$store.state.imUserInfo.appUserId.split('_')[1]) {
					this.$util.toast('您不能给自己发送消息')
					return
				}
				this.toPage(
					`/pages/message/chat/index?type=serviceTeam&toUserId=${this.workerData.userId}&toUserName=${this.workerData.realName || this.workerData.name || this.workerData.phone}`
				)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.worker-people {
		padding: 30rpx 30rpx 0rpx 30rpx;
		border-bottom: 2rpx solid #E5E5E5;
		background: #FFFFFF;
		border-radius: 6rpx;

		.people-im {
			display: flex;
			height: 100rpx;
			align-items: center;

			.people-select {
				font-weight: bold;
				font-size: 24rpx;
				line-height: 46rpx;
				text-align: center;
				min-width: 100rpx;
				padding-left: 16rpx;
				padding-right: 16rpx;
				color: #FFFFFF;
				background: $themeColor;
				border-radius: 10rpx;
			}

			.im-go {
				flex: 1;
				display: flex;

				.go-text {
					font-weight: normal;
					font-size: 26rpx;
					color: #606166;
				}

				.go-image {
					height: 36rpx;
					width: 36rpx;
					margin-left: 10rpx;
				}
			}
		}

		.people-info {
			display: flex;
			padding-bottom: 24rpx;
			border-bottom: 2rpx dashed #EEEEEE;

			.info-right {
				width: 100%;

				.right-im {
					display: flex;
					height: 50rpx;
					align-items: center;
					margin-top: 16rpx;

					.im-image {
						width: 48rpx;
						height: 48rpx;
					}

					.im-confirm {
						font-weight: bold;
						font-size: 24rpx;
						color: #FFFFFF;
						background: #002FA5;
						border-radius: 10rpx;
						height: 46rpx;
						padding-left: 20rpx;
						padding-right: 20rpx;
						line-height: 46rpx;
					}
				}

				.right-bottom {
					display: flex;
					height: 50rpx;
					align-items: center;
					justify-content: space-between;

					.other-item {
						font-weight: normal;
						font-size: 26rpx;
						color: #909199;
					}

					.other-item text {
						font-weight: normal;
						font-size: 26rpx;
						margin-left: 10rpx;
						color: #FF5D35;
					}
				}

				.right-title {
					display: flex;
					height: 50rpx;
					align-items: center;

					.tag-item {
						background: #F1F3FF;
						border-radius: 4rpx;
						line-height: 40rpx;
						padding-left: 10rpx;
						padding-right: 10rpx;
						color: #5382D0;
						margin-right: 10rpx;
						font-size: 22rpx;
					}

					.people-name {
						font-weight: bold;
						font-size: 30rpx;
						color: #333333;
					}

					.people-worker-type {
						display: flex;
						height: 36rpx;
						background: $themeColor;
						border-radius: 8rpx;
						margin-left: 30rpx;

						.woker-class {
							font-weight: normal;
							font-size: 24rpx;
							color: #FFFFFF;
							width: 50rpx;
							height: 50rpx;
							text-align: center;
							border-radius: 50rpx;
							margin-top: -10rpx;
							background-color: $themeColor;
							margin-left: -10rpx;
							line-height: 42rpx;
							border: 6rpx solid #FFFFFF;
							font-style: italic;
						}

						.type-text {
							font-weight: normal;
							font-size: 20rpx;
							line-height: 36rpx;
							color: #FFFFFF;
							padding-left: 10rpx;
							padding-right: 10rpx;
						}
					}

					.people-price {
						flex: 1;
						font-weight: normal;
						font-size: 24rpx;
						color: #FF5D35;
						text-align: right;
					}
				}
			}

			.info-photo {
				position: relative;
				width: 130rpx;
				margin-right: 20rpx;
				display: flex;
				align-items: center;

				.photo-image {
					height: 130rpx;
					width: 130rpx;
					border-radius: 130rpx;
				}

				.photo-text {
					position: absolute;
					z-index: 10;
					bottom: 0rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 110rpx;
					background: #EFF6FF;
					border-radius: 4rpx;
					line-height: 34rpx;
					font-size: 20rpx;
					text-align: center;
					color: $themeColor;
				}

				.photo-text2 {
					position: absolute;
					z-index: 10;
					bottom: 0rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 110rpx;
					background: #EEEEEE;
					border-radius: 4rpx;
					line-height: 34rpx;
					font-size: 20rpx;
					text-align: center;
					color: #333333;
				}
			}
		}
	}
</style>
