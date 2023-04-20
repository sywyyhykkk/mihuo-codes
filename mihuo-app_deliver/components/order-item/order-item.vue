<template>
	<view class="order-item-page">
		<view class="order-top">
			<view class="order-code">
				<text class="order-title">编号</text>
				<text>{{formDate.orderCode}}</text>
			</view>
			<view class="order-status">{{getOrderStatus}}</view>
		</view>
		<view class="order-middle" @tap="toViewOffer">
			<view class="order-attachments-coverNew" @tap.stop>
				<u-image @click="imagePreview(formDate.attachmentsCoverNew)" class="order-middle-image"
					border-radius="10rpx" width="176rpx" height="176rpx" :src="formDate.attachmentsCoverNew">
				</u-image>
				<view class="order-requirementName">{{getRequirementType}}</view>
			</view>
			<view class="order-information">
				<view class="skill-type-contain">
					<view class="skill-type-all">
						<skill-type-tag class="skill-type" :title="getSkillType"></skill-type-tag>
						<text class="order-name">{{formDate.requirementTypeName}}</text>
					</view>
					<text class="order-offer">报价</text>
				</view>
				<view class="order-address-contain">
					<view class="order-address">{{formDate.cityName}}</view><text class="distance">0.8km</text>
				</view>
				<view class="offer-personnel">
					<view class="offer-personnel-contain">
						<u-avatar v-for="(item,index) in formDate.avatarList" :key="index" class="item-image" size="36"
							:src="$image.imageGlobal + item.replace('/admin/sys-file/mihuo-test/','')">
						</u-avatar>
						<text class="personnel-num" v-show="formDate.competitionCount > 0">
							<text v-show="formDate.competitionCount > 4">...</text>
							{{formDate.competitionCount}}人报价
						</text>
						<text class="personnel-num" v-show="formDate.competitionCount === '0'">暂无报价</text>
					</view>
					<view v-show="tabIndex === 1" class="communication"
						@click.stop="()=>communicationIm()">
						<image :src="communication" class="communication" mode=""></image>
					</view>

				</view>
			</view>
		</view>
		<view class="order-bottom">
			<text class="cancel item-button" v-show="formDate.orderStatus === 2 && tabIndex === 0"
				@click="getButtonOperation('取消订单')">取消订单</text>
			<text class=" item-button"
				v-show="tabIndex === 0 && (formDate.orderStatus === 5 || formDate.orderStatus === 6)"
				@click="getButtonOperation('退款/售后')">退款/售后</text>
			<text class=" item-button item-button-orange" v-show="formDate.orderStatus === 4"
				@click="getButtonOperation('去付款')">去付款</text>
			<text class=" item-button item-button-orange"
				v-show="tabIndex === 0 && (formDate.orderStatus === 5 || formDate.orderStatus === 6)"
				@click="getButtonOperation('联系师傅')">联系师傅</text>
			<text class=" item-button item-button-orange" v-show="formDate.orderStatus === 0"
				@click="getButtonOperation('修改报价')">修改报价</text>
			<text class=" item-button item-button-orange" v-show="formDate.orderStatus === 3"
				@click="getButtonOperation('确认订单')">确认订单</text>
			<text class=" item-button item-button-orange" v-show="formDate.orderStatus === 5 && tabIndex === 1"
				@click="getButtonOperation('开始施工')">开始施工</text>
<!-- 			<text class="item-button item-button-orange" @click="getButtonOperation('接受订单')">接受订单</text>
			<text class="item-button item-button-orange" @click="getButtonOperation('拒绝订单')">拒绝订单</text> -->
		</view>
	</view>
</template>

<script>
	import {
		debounce
	} from "@/plugins/utils.js"
	export default {
		props: {
			formDate: {
				type: Object,
				default: function() {
					return {};
				},
			},
			tabIndex: {
				type: Number,
				default: 0,
			},
		},
		data() {
			return {
				option: {},
				list: [],
				userInfo: {},
				communication: require("@/static/images/communication.png"),
			}
		},
		mounted() {
			this.userInfo = uni.getStorageSync('userInfo').user_info
		},
		computed: {
			getSkillType() {
				switch (this.formDate.skillType) {
					case 1:
						return '水电';
					case 2:
						return '木工';
					case 3:
						return '泥瓦';
					case 4:
						return '拆除';
					case 5:
						return '美缝';
					case 6:
						return '油漆';
					default:
						return '其他';
				}
			},
			getRequirementType() {
				switch (this.formDate.requirementType) {
					case 1:
						return '装修';
					case 2:
						return '维修';
					case 3:
						return '安装';
					case 4:
						return '设计';
					case 5:
						return '其他';
					default:
						return '其他';
				}
			},
			getOrderStatus() {
				switch (this.formDate.orderStatus) {
					case 2:
						return '待报价';
					case 3:
						return '待确认';
					case 4:
						return '待付款';
					case 5:
						return '待开工';
					case 6:
						return '开工中';
					case 7:
						return '待验收';
					case 8:
						return '待结算';
					case 9:
						return '待评价';
					case 10:
						return '已完成';
					case 11:
						return '待售后';
					case 12:
						return '售后中';
					default:
						return '其他';
				}
			}
		},
		methods: {
			toViewOffer() {
				this.$emit('toViewOffer')
			},
			getButtonOperation(typeName) {
				let that = this
				debounce(function() {
					switch (typeName) {
						case '取消订单':
							that.$emit('orderCancel', that.formDate.id)
							break;
						case '去付款':
							that.$util.toast('待开发');
							break;
						case '联系师傅':
							that.$util.toast('待开发');
							break;
						case '退款/售后':
							that.$util.toast('待开发');
							break
						case '确认订单':
							that.$util.toast('待开发');
							break;
						case '开始施工':
							that.$util.toast('开始施工');
							break
						case '修改报价':
							that.$emit("updateOrderOffer", that.formDate)
							break;
						case '接受订单':
							that.$util.toast('待开发');
							break;
						case '拒绝订单':
							that.$util.toast('待开发');
							break;
					}
				}, 300)

			},
			imagePreview(url) {
				uni.previewImage({
					current: 0, //预览图片的下标
					urls: [url]
				})
			},
			communicationIm() {
				this.$emit('communicationIm', this.formDate)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.order-item-page {
		background-color: #FFFFFF;
		margin: 0 20rpx 24rpx 20rpx;
		border-radius: 16rpx;
		padding: 30rpx;

		.order-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 26rpx;
			border-bottom: 2rpx dashed #EEEEEE;
			margin-bottom: 28rpx;

			.order-code {
				font-size: 28rpx;

				.order-title {
					color: #999999;
					margin-right: 20rpx;
				}
			}

			.order-status {
				font-size: 32rpx;
				color: $themeColor;
				font-weight: bold;
			}

		}

		.order-middle {
			padding-bottom: 28rpx;
			margin-bottom: 30rpx;
			display: flex;
			border-bottom: 2rpx solid #EEEEEE;

			.order-middle-image {
				margin-right: 28rpx;
				width: 130rpx;
				height: 130rpx;
			}

			.order-requirementName {
				background: linear-gradient(90deg, #FCBF51 -2.99%, #FF9831 97.01%);
				border-radius: 10rpx 0px 20rpx;
				color: #FFFFFF;
				width: 86rpx;
				height: 36rpx;
				font-size: 20rpx;
				text-align: center;
				position: absolute;
				top: 0px;
			}

			.order-attachments-coverNew {
				position: relative;
			}

			.order-information {
				display: flex;
				flex-direction: column;
				flex: 1;

				.skill-type-contain {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 8rpx;
					margin-top: 10rpx;

					.skill-type {
						margin-top: 6rpx;
					}

					.skill-type-all {
						display: flex;
						flex-direction: row;
					}

					.order-offer {
						font-size: 32rpx;
						color: $themeColor;
						font-weight: bold;
					}
				}

				.order-address-contain {
					display: flex;
					width: 100%;
					align-items: center;
					margin-bottom: 10rpx;
				}

				.distance {
					margin-left: 20rpx;
				}

				.distance,
				.order-address {
					color: #909299;
					font-size: 28rpx;
				}

				.order-address {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					max-width: 352rpx;

				}


				.order-name {
					color: #303133;
					font-size: 32rpx;
					font-weight: bold;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					max-width: 240rpx;
				}

				.item-image {
					&:first-child {
						margin-left: 0
					}

					margin-left: -10rpx;
				}

				.offer-personnel {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				.offer-personnel-contain{
					display: flex;
				}

				.personnel-num {
					color: #999999;
					font-size: 28rpx;
					margin-left: 4rpx;
				}

			}
		}

		.order-bottom {
			display: flex;
			justify-content: flex-end;
		}

		.cancel {
			font-size: 26rpx;
		}

		.item-button {
			display: flex;
			justify-content: center;
			align-items: center;
			white-space: nowrap;
			width: 176rpx;
			height: 64rpx;
			color: #909199;
			font-size: 28rpx;
			border-radius: 10rpx;
			border: 2rpx solid #EBEBEB;
			margin-right: 34rpx;

			&:last-child {
				margin-right: 0rpx;
			}
		}

		.item-button-orange {
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			color: #FFFFFF;
		}

		.communication {
			width: 44rpx;
			height: 44rpx;
		}
	}
</style>
