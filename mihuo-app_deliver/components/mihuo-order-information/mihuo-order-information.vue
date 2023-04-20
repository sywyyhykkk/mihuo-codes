<template>
		<view v-if="projectDetails.id" class="mihuo-order-information-page">
			<view class="item-project-name" v-if="projectDetails.address">
				{{projectDetails.poiName}}{{projectDetails.address}}
			</view>
			<view class="item-address">
				<view class="item-left" v-if="projectDetails.latAddress">
					<image src="/static/images/icon-address/weizhi.png" mode=""></image>
					<view class="address-text">{{projectDetails.latAddress}}</view>
				</view>
				<view class="item-right" @click="navigation" v-if="projectDetails.latAddress">
					<image src="/static/images/icon-address/address-1.png" mode=""></image>
					<view class="item-text">导航</view>
				</view>
			</view>
			<view class="item-phone">
				<view class="item-left" v-if="projectDetails.customerName">
					<image src="/static/images/icon-phone/call-1.png" mode=""></image>
					<text class="name">{{projectDetails.customerName}}</text>
					<text
						class="phone">{{projectDetails.customerPhone?projectDetails.customerPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'):''}}</text>
				</view>
				<view class="item-right" v-if="projectDetails.customerName"
					@click="callPhone(projectDetails.customerPhone)">
					<image src="/static/images/icon-phone/call.png" mode=""></image>
					<text class="item-text">电话</text>
				</view>

			</view>
		</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		props: {
			name: 'mihuo-order-information',
			projectId: {
				type: [String, Number],
				default: ''
			},
		},
		data() {
			return {
				projectDetails: {}
			}
		},
		computed: {
			...mapState(['projectInfo'])
		},
		mounted() {
			this.getProjectDetails()
		},
		methods: {
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			navigation() {
				let {
					latitude,
					longitude
				} = this.projectDetails
				if (latitude === null && longitude === null) {
					this.$util.toast('当前项目未维护地址信息, 请维护地址后重试')
					return
				}
				if (latitude === 0 && longitude === 0) {
					this.$util.toast('当前项目未维护地址信息, 请维护地址后重试')
					return
				}
				// 获取位置的经纬度
				uni.openLocation({
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
					scale: 15
				})
			},
			getProjectDetails() {
				if (this.projectId || this.projectInfo.projectId) {
					this.$httpApi.getProjectDetails({
						id: this.projectId || this.projectInfo.projectId
					}).then(res => {
						if (res) {
							this.projectDetails = res
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.no-data-list {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 20rpx 0;
		background-color: #FFFFFF;
		margin: 8rpx 20rpx;
		border-radius: 10rpx;


		.no-image {
			width: 234rpx;
			height: 208rpx;
			margin-bottom: 18rpx;
		}

		.no-title {
			font-weight: 400;
			font-size: 13px;
			color: #A9B9DE;
		}
	}

	.mihuo-order-information-page {
		background-color: #fff;
		margin: 10rpx 20rpx;
		border-radius: 10rpx;
		padding: 32rpx 28rpx 20rpx 28rpx;
		min-height: 196rpx;

		.item-project-name {
			font-size: $middleFontSize;
			color: $seconFontColor;
			font-weight: bold;
		}

		.item-address {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-top: 14rpx;

			.item-left {
				display: flex;
				align-items: flex-start;

				.address-text {
					font-size: $smiddleFontSize;
					max-width: 470rpx;
					color: $seconFontColor;
				}
			}

			.item-right {}
		}

		.item-phone {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 16rpx;

			.item-left {
				.name {
					color: $viceFontColor;
					font-size: $smiddleFontSize;
					margin-right: 4rpx;
				}

				.phone {
					color: $seconFontColor;
					font-size: $middleFontSize;
				}
			}

			.item-right {}
		}

		.item-left {
			display: flex;
			align-items: center;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 6rpx;
			}
		}

		.item-right {
			display: flex;
			flex-direction: row;
			align-items: center;
			white-space: nowrap;

			image {
				width: 24rpx;
				height: 28rpx;
				margin-right: 4rpx;
			}

			.item-text {
				color: $viceFontColor;
				font-size: $smallFontSize;
			}
		}
	}
</style>
