<template>
	<view class="record-list">
		<view class="item-record-cotain" v-for="(item,index) in communicationsList" :key="index">
			<view class="item-left">
				<view class="node">
					<u-avatar size="52" :src="$util.avatarImage(currentUser,true)">
					</u-avatar>
				</view>
			</view>
			<view class="item-right">
				<view class="item-top">
					<text class="refuse-time">{{item.created && item.created.substring(0,16)}}发起沟通</text>
				</view>
				<view class="item-bottom">
					<view class="item-title">
						<text class="title">我的沟通意向</text>
						<text class="why-content">{{ setResult(item.intention) }} {{item.abandonedReason}}</text>
					</view>
					<view class="item-title" v-if="item.description">
						<text class="title">沟通详情</text>
						<text class="why-content">{{item.description}}</text>
					</view>
					<view class="image-contain" v-if="item.annexImage">
						<image-show :imgSrc="item.annexImage" width="170" height="170" ></image-show>
					</view>
					<view class="audio-contain" v-if="item.annexAudio">
						<mihuo-audio ref="mihuoAudioList" :refAudioList="refAudioList" :audioIndex="index" :formData="item.annexAudio">
						</mihuo-audio>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="communicationsList.length == 0" title="这里空荡荡哒～" />

	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				num: 0,
				refAudioList: [],
				communicationsList: [],
				currentUser: uni.getStorageSync('userData').sysUser.userId, // 当前用户userId
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getList()
		},
		methods: {
			getList() {
				this.$httpApi.getOfferPeopleList({
					orderId: this.option.orderId
				}).then(res => {
					if (res) {
						let tempPaymentScheduleList = res.offerList.find(item => item.bidUserId == this
							.currentUser)
						if (tempPaymentScheduleList) {
							// 沟通记录
							if (tempPaymentScheduleList.communications) {
								this.communicationsList = tempPaymentScheduleList.communications
								this.communicationsList.forEach(el =>{
									if(el.annex){
										el['annexImage'] = JSON.stringify(JSON.parse(el.annex).filter(item => item.type == 'img' || item.type == 'video'))
										el['annexAudio'] = JSON.parse(el.annex).find(item => item.type == 'audio')
									}
								})
								setTimeout(() => {
									this.refAudioList = this.$refs.mihuoAudioList
								}, 200)
							}
						}
					}
				})
			},
			setResult(intention) {
				const tempResultMap = {
					'1': '愿意接单',
					'0': '不是平台单',
					'-1': '个人弃单',
				}
				return tempResultMap[intention] ?? ''
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.record-list {
		padding: 20rpx;

		.mh-empty-page {
			/deep/ .u-empty {
				margin-top: 50rpx !important;
			}
		}

		.item-record-cotain {
			display: flex;
			padding-left: 20rpx;

			&:last-child {
				.item-bottom {
					margin-bottom: 0rpx !important;
				}
			}

			.item-left {
				width: 40rpx;
				border-left: 2rpx dashed #C4C4C4;
				position: relative;

				.node {
					position: absolute;
					left: -28rpx;
					width: 26rpx;
					height: 26rpx;
				}
			}

			.item-right {
				display: flex;
				flex-direction: column;
				flex: 1;


				.item-top {
					display: flex;
					justify-content: space-between;
					margin-bottom: 30rpx;
					padding-left: 10rpx;

					.refuse-title {
						font-size: 28rpx;
						color: #303133;

					}

					.refuse-time {
						font-size: 28rpx;
						color: #909199;
					}
				}

				.item-bottom {
					padding: 24rpx 40rpx;
					background: #fff;
					border-radius: 20rpx;
					font-size: 26rpx;
					color: #303133;
					margin-bottom: 40rpx;

					.item-title {
						display: flex;
						flex-direction: column;
						margin-bottom: 18rpx;

						&:last-child {
							margin-bottom: 0rpx;
						}

						.title {
							font-size: 28rpx;
							color: #303133;
							font-weight: bold;
						}

						.why-content {
							font-size: 28rpx;
							color: #606166;
							margin-top: 8rpx;
						}
					}

					.audio-contain {}
				}
			}
		}
	}
</style>
