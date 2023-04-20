<template>
	<view>
		<u-popup v-model="checkShow" @close="close" mode="bottom" border-radius="30" :height="height">
			<view class="popup_con" :style="styleObj">
				<view class="header">
					<view :style="{textAlign:align}" class="header_title">{{title}}</view>
					<u-icon @click="close" class="header_close" name="close" size="20"></u-icon>
				</view>
				<view class="main display-left">
					<view class="left_avater" v-if="masterObj.personInfo">
						<u-avatar class="avatar" size="132" :src="$util.avatarImage(masterObj.personInfo.userId)" />
						<view class="ident_V">V{{masterObj.personInfo.level}}</view>
					</view>
					<view class="right_info">
						<view class="name">{{checkedData.applyPersonName}}</view>
						<view class="describe">{{checkedData.applyDesc}}</view>
					</view>
				</view>
				<view class="tips">
					为了保证您的权益，请确认师傅完成服务并查看验收报告后再确认验收
				</view>
				<view class="btn" @click="confirmCheck">确认验收</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "check-popup",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			height: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '确认'
			},
			align: {
				type: String,
				default: 'center'
			},
			styleObj: {
				type: Object,
				default: () => {}
			},
			checkedData: {
				type: Object,
				default: () => {}
			},
			masterObj: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				checkShow: true,
			};
		},
		watch: {
			value: {
				handler(val) {
					this.checkShow = val
				},
				immediate: true
			}
		},
		
		methods: {
			confirmCheck(){
				this.$emit('confirmChecked')
			},
			close() {
				this.checkShow = false;
				this.$emit('input', false);
				this.$emit('clearCur')
			}
		},
	}
</script>

<style lang="scss" scoped>
	.popup_con {
		padding: 20rpx 40rpx;
		height: 100%;
		box-sizing: border-box;

		.header {
			display: flex;
			align-items: center;
			height: 80rpx;

			.header_title {
				flex: 1;
				font-size: 30rpx;
				font-weight: bold;
				color: #141414;
			}

			.header_close {
				background: #EBEBEB;
				border-radius: 50%;
				padding: 10rpx;
			}
		}

		.main {
			width: 100%;
			border: 1rpx solid #808080;
			border-left: none;
			border-right: none;
			padding: 25rpx 48rpx;
			margin: 50rpx 0 70rpx;
			// height: calc(100% - 80rpx);
		}
	}

	.left_avater {
		margin-right: 47rpx;
		position: relative;

		.ident_V {
			position: absolute;
			top: 0;
			right: -10rpx;
			font-size: 15rpx;
			font-family: FZRuiZhengHei_GBK;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			width: 38rpx;
			line-height: 24rpx;
			background: linear-gradient(90deg, #333333, #666666);
			border-radius: 10rpx 2rpx 10rpx 0rpx;
		}
	}
	.right_info{
		.name{
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #141414;
		}
		.describe{
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #808080;
			line-height: 36rpx;
			margin-top: 22rpx;
			@include bov();
		}
	}
	.tips{
		text-align: center;
		padding: 0 116rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #141414;
		line-height: 39rpx;
	}
	
	.btn {
		margin: 40rpx 0;
		@include button;
	}

	.display-left {
		display: flex;
		align-items: center;
	}
</style>
