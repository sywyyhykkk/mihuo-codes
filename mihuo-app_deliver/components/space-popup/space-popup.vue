<template>
	<uni-popup ref="spacePopup" type="center" :customeStyle="{borderRadius:'10rpx',background:'#fff'}">
		<view class="popup-container">
			<view class="title">
				<text>添加空间</text>
				<image src="/static/images/icon_close/close.png" class="close" @click="close"></image>
			</view>
			<view class="content">
				<view class="item-contain">
					<view class="left">
						名称
					</view>
					<view class="right">
						<u-input class="input-contain" v-model="name" :maxlength="200" :clearable="false"
							height="72" placeholder="请输入空间名称" trim :border="false"  />
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

	export default {
		name: "space-popup",
		props: [],
		data() {
			return {
				name:''
			};
		},
		methods: {
			submit() {
				if(!this.name){
					this.$util.toast("请输入空间名称");
					return
				}
				
				uni.$emit('spaceNameUpdate', {
					parameter: {name:this.name},
				})
				this.close()
			},
			close() {
				this.name = ''
				this.$refs.spacePopup.close()
			},
			show() {
				this.$refs.spacePopup.open();
			},
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
				margin-bottom: 80rpx;

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
