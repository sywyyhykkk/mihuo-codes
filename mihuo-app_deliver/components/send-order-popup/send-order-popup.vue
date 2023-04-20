<template>
	<view class="type-contain">
		<u-popup mode="bottom" v-model="requirementListShow" close-icon-pos="top-right" border-radius="14">
			<view class="type-title">
				<text class="text-item">{{titleName}}</text>
				<image :src="closeImg" class="close-img" mode=""  @click="requirementListShow = false" />
			</view>
			<slot ></slot>
			<view v-show="commitStatus" class="button-determine" @click="requirementListShow = false">确定</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			titleName: {
				type: String,
				default: ''
			},
			commitStatus:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				requirementListShow: false,
				closeImg: require("@/static/images/icon_close/close.png"),
			}
		},
		methods: {
			close(){
				this.requirementListShow = false
			},
			saveDetermine() {
				this.requirementListShow = false
			}
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-drawer__scroll-view{
		background: #FFFFFF !important;
	}
	.type-contain{
		// padding-top: 42rpx;

		.type-title {
			font-size: 32rpx;
			color: #303133;
			margin: 0 20rpx;
			 padding-top: 42rpx;
			line-height: 1;
			padding-bottom: 36rpx;
			border-bottom: 2rpx solid #EEEEEE;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.close-img {
			position: absolute;
			right: 20rpx;
			width: 42rpx;
			height: 42rpx;
		}

		.button-determine {
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			text-align: center;
			padding: 24rpx 284rpx;
			margin: 0 64rpx 54rpx 62rpx;
		}

	}

</style>
