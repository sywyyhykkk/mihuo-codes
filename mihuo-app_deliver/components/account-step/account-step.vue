<template>
	<view class="my_step">
		<view v-for="(item,index) in accountStep" :key="index">
			<view class="step_border" :class="index<=stepIndex?'is_step_border':''" v-if="index+1!==1"></view>
			<view class="step">
				<view :class="index<=stepIndex?'step_value_border':'step_value_unborder'">
					<view :class="index<=stepIndex?'step_view':''">
						<view class="step_value">{{index+1}}</view>
					</view>
				</view>
				<view class="step_title"  :class="index<=stepIndex?'is_step_title':''">{{item.name}}</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "account-step",
		data() {
			return {
				accountStep: [{
					name: '验证手机并设置支付密码'
				}, {
					name: '实名认证'
				}, {
					name: '绑卡'
				}, {
					name: '签订电子合同'
				}, ],
				stepIndex: 0
			};
		},
		mounted() {
			// 用户账户状态
			this.$httpApi.getPaymentAccountStatus().then(res => {
				if(res){
					for(var key in res){
						if(key==0){
							this.stepIndex = 0
						}else{
							this.stepIndex = Number(key)-1
						}
					}
				}
			})
		},
		destroyed(){}
	}
</script>

<style lang="scss" scoped>
	.my_step {
		margin-top: 44rpx;
		padding-left: 23rpx;

		.step {
			width: 14%;
			height: 160rpx;
			float: left;

			.step_value_border {
				background-color: #FFFFFF;
				width: 52rpx;
				height: 52rpx;
				border-radius: 52rpx;
				margin: auto;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}

			.step_value_unborder {
				width: 52rpx;
				height: 52rpx;
				border-radius: 52rpx;
				margin:8rpx auto;
			}
			.step_view{
				width: 52rpx;
				height: 52rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				background: rgba(0,47,165,.5);
				.step_value{
					background: $themeColor;
					color: #FFFFFF;
				}
			}
			.step_value {
				font-size: 24rpx;
				color: #909199;
				background-color: #D6D9E0;
				width: 40rpx;
				height: 40rpx;
				border-radius: 40rpx;
				text-align: center;
				line-height: 40rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}

			.step_title {
				text-align: center;
				font-size: 24rpx;
				color: #909199;
				margin-top: 16rpx;
			}
			.is_step_title{
				color: $themeColor;
			}
		}

		.step_border {
			height: 2rpx;
			width: calc(14.5% - 24rpx);
			background-color: #D6D9E0;
			float: left;
			margin-top: 28rpx;
			margin-left: 10rpx;
			margin-right: 10rpx;
		}
		.is_step_border{
			background-color: $themeColor;
		}

	}
</style>
