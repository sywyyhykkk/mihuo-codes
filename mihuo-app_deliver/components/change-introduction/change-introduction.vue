<template>
	<view class="change-introduction">
		<view class="desc">
			由于<text v-if="info.content" class="item-desc">{{info.content}}</text> 的原因，工地地址在<text
				v-if="info.stageName" class="item-desc">{{info.stageName}}</text> 发生现场变更，经双方合议,本次变更签证起因为:<text
				v-if="info.changeTypeName" class="item-desc">{{info.changeTypeName}}</text>，双方确认变更责任方为:<text
				v-if="info.handleUserInputsName"
				class="item-desc">{{info.handleUserInputsName}}</text>，甲乙双方确定签证内容，相关方同意合同条款附加本次签证确认单内容执行。
		</view>
		<view class="address display-flex_direction">
			<text class="label">工作地址</text>
			<text class="value">{{projectInfo.poiName}}{{projectInfo.address}}{{projectInfo.latAddress}}</text>
		</view>
		<view v-if="team.length > 0" class="team display-flex_direction">
			<text class="label">服务团队</text>
			<view class="list">
				<view class="item display-justify_between" v-for="(item,index) in team" :key="index">
					<view class="left">
						<text class="skill-name">{{item.skillName}}</text>
						<text class="skill-value">{{item.name}}</text>
						<text
							class="skill-value">{{item.phone ? item.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') :''}}</text>
					</view>
					<text class="item-phone" @click="callPhone(item.phone)">拨打</text>
				</view>
			</view>
		</view>
		<view class="time">
			<text class="label">工期计划</text>
			<view class="time-text display-justify_between">
				<text>{{projectInfo.expectStartTime}}至{{projectInfo.expectFinishTime}}</text>
				<text v-if="timeDiff">共{{timeDiff}}个工作日</text>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from "@/static/js/moment.js"
	import {
		mapState
	} from 'vuex'
	export default {
		props: {
			value: {
				type: Object,
				default: () => {}
			},
			team: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				option: {},
				info: {}
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo']),
			timeDiff() {
				if (this.projectInfo.expectStartTime && this.projectInfo.expectFinishTime) {
					let time = moment(this.projectInfo.expectFinishTime).diff(this.projectInfo.expectStartTime, 'day')
					return Math.abs(time) 
				}
				return ''
			}
		},
		watch: {
			value: {
				handler(newVal, oldVal) {
					this.info = newVal
				},
				deep: true
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.change-introduction {
		padding: 24rpx 40rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.desc {
			color: #606166;
			font-size: $middleFontSize;

			.item-desc {
				color: #3D3D3D;
				font-weight: bold;
				font-size: $middleFontSize;
			}
		}

		.label {
			color: #3D3D3D;
			font-size: $middleFontSize;
			line-height: 38rpx;
			font-weight: bold;
		}

		.address {
			margin-top: 30rpx;

			.value {
				color: #606166;
				font-size: 28rpx;
			}
		}

		.team {
			margin-top: 30rpx;

			.list {
				margin-top: 10rpx;

				.item {
					line-height: 38rpx;
					margin-bottom: 10rpx;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.skill-name {
						color: #3D3D3D;
						font-size: $middleFontSize;
					}

					.skill-value {
						font-size: $middleFontSize;
						color: #606166;
						margin-left: 20rpx;
					}

					.item-phone {
						color: $themeColor;
						font-size: $smallFontSize;
					}

				}

			}
		}

		.time {
			margin-top: 30rpx;

			.time-text {
				text {
					color: #3D3D3D;
					font-size: $middleFontSize;
				}
			}
		}
	}
</style>
