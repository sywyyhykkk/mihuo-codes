<template>
	<view>
		<view class="order-info">
			<view class="info-item">
				<view class="item-title">施工地点</view>
				<view class="item-text" v-if="form.project">
					{{ form.project.provinceName}}{{form.project.cityName}}{{form.project.districtName}}{{form.project.latAddress}}{{form.project.poiName}}{{form.project.address}}
				</view>
			</view>
			<view class="info-item">
				<view class="item-title">上门时间</view>
				<view class="item-text">{{form.expectDate}}</view>
			</view>
			<view class="info-item">
				<view class="item-title">预计工期</view>
				<view class="item-text">
					{{form.expectDate}}至{{form.expectCompleteDate}}
					<text v-if="getTime"> 共{{getTime}}天</text>
				</view>
			</view>
			<view class="info-item" v-if="nodeInfo.skillName">
				<view class="item-title ">岗位/工种</view>
				<view class="item-text worker-text">{{ nodeInfo && nodeInfo.skillName ? nodeInfo.skillName : '' }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from "@/static/js/moment.js"
	import {
		mapState,
	} from 'vuex'
	export default {
		props: {
			orderId: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				form: ''
			}
		},
		mounted() {
			this.getDetails()
		},
		computed: {
			...mapState(['nodeInfo']),
			getTime() {
				let time = moment(this.form.expectDate).diff(this.form.expectCompleteDate, 'day')
				if (time) {
					return Math.abs(time) + 1
				} else {
					return ''
				}
			}
		},
		methods: {
			getDetails() {
				if (!this.orderId) {
					return
				}
				this.$httpApi.getReceiveDetail({
					id: this.orderId
				}).then(res => {
					if (res) {
						this.form = res
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-info {
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 20rpx;
		padding: 36rpx;

		.info-item {
			display: flex;
			align-items: center;
			height: 74rpx;

			.item-title {
				flex: 2;
				font-weight: normal;
				font-size: 28rpx;
				color: #909199;
			}

			.worker-type {
				letter-spacing: 2em;
			}

			.item-text {
				flex: 8;
				font-weight: bold;
				font-size: 28rpx;
				color: #303133;
				margin-left: 30rpx;
				@include bov(2);

				text {
					font-size: 28rpx;
					margin-left: 10rpx;
				}
			}

			.worker-text {
				margin-left: calc(30rpx - 0.2rem);
			}
		}
	}
</style>
