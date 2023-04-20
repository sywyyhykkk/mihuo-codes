<template>
	<uni-popup ref="parameterPopup" type="center" :customeStyle="{borderRadius:'10rpx',background:'#fff'}">
		<view class="popup-container">
			<view class="title">
				<text>添加参数</text>
				<image src="/static/images/icon_close/close.png" class="close" @click="close"></image>
			</view>
			<view class="content">
				<view class="item-contain">
					<view class="left">
						名称
					</view>
					<view class="right">
						<u-input class="input-contain" v-model="parameterLabel" :maxlength="200" :clearable="false"
							height="72" placeholder="请输入参数名称" trim :border="false" />
					</view>
				</view>
				<view class="item-contain">
					<view class="left">
						单位
					</view>
					<view class="right">
						<u-input class="input-contain" v-model="parameteUnit" :clearable="false" height="72"
							placeholder="请输入单位" trim :border="false" />
					</view>
				</view>
				<view class="measurement">
					<view class="left"></view>
					<view class="item-title">测量参数</view>
					<view class="right"></view>
				</view>
				<view class="item-contain results-contain">
					<view class="left">
						{{parameterLabel}}
					</view>
					<view class="right">
						<u-input class="input-contain" v-model="parameterValue" @blur="setBlur" :clearable="false"
							height="72" placeholder="请输入" trim :border="false" />
						<text>{{parameteUnit}}</text>
					</view>
				</view>
			</view>
			<view class="btn">
				<view class="left" @click="close">取消</view>
				<view class="right" @click="submit()">确认</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import {
		CommonUpload
	} from "@/plugins/uploadPic.js";

	export default {
		name: "parameter-popup",
		props: [],
		data() {
			return {
				parameterLabel: '层高',
				parameterValue: '',
				parameteUnit: 'm'
			};
		},
		methods: {
			submit() {
				this.debounce(() => {
					uni.$emit('parameterUpdate', {
						parameter: {
							name: this.parameterLabel,
							value: this.parameterValue,
							unit: this.parameteUnit
						},
					})
					this.parameterLabel = '层高'
					this.parameteUnit = 'm'
					this.parameterValue = ''
				}, 200)
				this.close()
			},
			close() {
				this.$refs.parameterPopup.close()
			},
			show() {
				this.$refs.parameterPopup.open();
			},
			setBlur(){
				if (!isNaN(parseFloat(this.parameterValue)) && isFinite(this.parameterValue)) {
					this.parameterValue = Math.abs(this.parameterValue)
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	.popup-container {
		width: 616rpx;
		height: max-content;

		.title {
			padding: 40rpx;
			position: relative;

			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			color: #303133;
			text-align: center;

			.close {
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				right: 30rpx;
				top: 30rpx;
			}
		}

		.content {
			padding: 0 40rpx;

			.item-contain {
				display: flex;
				align-items: center;
				margin-bottom: 12rpx;

				.left {
					color: $seconFontColor;
					font-size: $smiddleFontSize;
					margin-right: 20rpx;
				}

				.right {
					background: #F6F6F6;
					border-radius: 5px;
					flex: 1;
					display: flex;
					align-items: center;
					padding: 0 18rpx;

					text {
						font-size: $smiddleFontSize;
						color: #999999;
					}
				}
			}

			.results-contain {
				margin-bottom: 34rpx;
			}

			.measurement {
				display: flex;
				align-items: center;
				margin: 24rpx 0rpx;

				.left,
				.right {
					border: 1px dashed #EEEEEE;
					width: 35%;
				}

				.item-title {
					width: 30%;
					color: $viceFontColor;
					font-size: 20rpx;
					text-align: center;
				}
			}

		}

		.input-area {
			width: 100%;
			height: 160rpx;
			margin-top: 20rpx;

			.title {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #909199;
			}

			.input-field {
				width: 100%;
				height: 88rpx;
				margin-top: 10rpx;
			}
		}

		.img-area {
			margin-top: 40rpx;
		}

		.btn {
			border-top: 2rpx solid #EEEEEE;
			display: flex;

			.left,
			.right {
				flex: 1;
				text-align: center;
				padding: 26rpx 0 30rpx 0rpx;


			}

			.left {
				font-size: $middleFontSize;
				color: #909199;
				border-right: 1px solid #EEEEEE;
			}

			.right {
				font-weight: bold;
				color: $themeColor;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
