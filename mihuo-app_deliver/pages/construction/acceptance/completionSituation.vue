<template>
	<view>
		<view class="completion-situation">
			<view class="situation-title" v-if="workList.length > 0">{{workList.length > 0 && workList[0].name}}</view>
			<view class="situation-address">
				<image :src="'../../../static/icon/position2.png'" class="address-image"></image>
				<view class="address-text">{{projectInfo.address}}</view>
			</view>
			<view class="situation-conter" v-for="(item,index) in workList" :key="index">
				<view class="conter-title">{{item.applyDesc}}</view>
				<view class="image-list">
					<image-show :imgSrc="item.picFiles" :key="item.picFiles" right="20"></image-show>
				</view>
				<view class="audio-contain" v-if="item.voiceFiles">
					<mihuo-audio :formData="item.voiceFiles"></mihuo-audio>
				</view>
				<view class="conter-date">{{item.applyTime && item.applyTime.substring(0,16) }}</view>
			</view>
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
				list: [],
				option: '',
				workList: [],
			}
		},
		onLoad(option) {
			this.option = option
			this.getInnerAcceptances()
		},
		computed: {
			...mapState(['projectInfo','nodeInfo'])
		},
		methods: {
			getInnerAcceptances() {
				if (this.option.skillId !== 'undefined') {
					this.$httpApi.getInnerAcceptances({
						projectId: this.projectInfo.projectId,
						skillId: this.option.skillId,
						nodeId:this.nodeInfo.nodeId,
					}).then(res => {
						if (res) {
							this.workList = res
						}
					})
				}

			},
		}
	}
</script>

<style lang="scss" scoped>
	.completion-situation {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 40rpx;
		margin: 20rpx;

		.situation-conter {
			padding: 40rpx 0 0rpx 0;
			border-top: 2rpx dashed #EEEEEE;

			.conter-date {
				font-weight: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909199;
				margin-top: 30rpx;
			}

			.image-list {
				display: grid;
				grid-template-columns: auto auto auto;
				margin-top: 10rpx;

				.conter-image {
					width: 200rpx;
					height: 200rpx;
					margin: 0 auto;
					border-radius: 16rpx;
					margin-top: 20rpx;
				}
			}

			.conter-title {
				font-weight: normal;
				font-size: 28rpx;
				line-height: 40rpx;
				letter-spacing: -0.6rpx;
				color: $seconFontColor;
			}
		}

		.situation-address {
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			padding-bottom: 30rpx;

			.address-image {
				width: 26rpx;
				height: 26rpx;
			}

			.address-text {
				font-weight: normal;
				font-size: 28rpx;
				color: #606166;
				margin-left: 10rpx;
			}
		}

		.situation-title {
			font-weight: bold;
			font-size: 36rpx;
			line-height: 50rpx;
			letter-spacing: -0.6rpx;
			color: $seconFontColor;
		}
	}
</style>
