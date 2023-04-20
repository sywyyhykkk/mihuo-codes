<template>
	<view>
		<public-module></public-module>
		<z-nav-bar fontColor="white" :bgColor="[$styleColor.themeColor,$styleColor.themeColor]">
			<view class="nav-bar" slot="default">账户余额</view>
			<!-- <view class="icon_setUp" slot="right" @click="isMenuOpen=!isMenuOpen">
				提现规则
			</view> -->
		</z-nav-bar>
		<view class="title_back">
			<view class="balance">
				<view class="balance_text">账户余额（元）</view>
				<view class="balance_value">{{balance}}</view>
			</view>
			<view class="withdraw_button" @click="goBalanceWithdrawal">提现</view>
			<view class="withdraw_button" style="margin-right: 8rpx;" @click="goRecharge">充值</view>
			<view style="clear: both;"></view>

			<view class="money_List">
				<view class="wire"></view>
				<view v-for="(item,index) in moneyList" :key="index">
					<!-- <view class="wire" v-if="index!=0"></view> -->
					<view class="money_value">
						<view class="money_text">{{item.value}}</view>
						<view class="money_text">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text_list">
			<view :class="index===0?'text_list_li2':'text_list_li'" v-for="(item,index) in textList" :key="index"
				@click="goPage(item)">
				<view class="list_text">{{item}}</view>
				<image src="/static/demo/icon_right.png" class="list_image"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isBind: false,
				balance: 0,
				moneyList: [{
					name: '结算中金额',
					value: '0'
				}, {
					name: '可提现金额',
					value: '0'
				},
				// {
				// 	name: '我的积分',
				// 	value: '0'
				// }
				],
				// textList: ['收支明细', '结算中明细', '提现记录', '违规扣款记录', '积分记录', '银行卡'],
				textList: ['收支明细','违规扣款记录','银行卡']
			}
		},
		
		onShow() {
			this.queryBalance()
		},
		
		onLoad(option) {
			this.isBind = option.isBind === 'true' ? true : false
		},
		
		methods: {
			//余额查询
			queryBalance(){
				this.$httpApi.getPaymentAccountBalance().then(res => {
					if(res){
						this.balance = res
						this.moneyList.map(item => {
							if(item.name === '可提现金额'){
								item.value = res
							}
						})
					}
				})
			},
			goPage(index) {
				switch (index) {
					case '收支明细':
						uni.navigateTo({
							url: '/pages/mine/incomeExpense'
						})
						break;
					// case 1:
					// 	uni.navigateTo({
					// 		url: '/pages/mine/moneyingRecord'
					// 	})
					// 	break;
					// case 2:
					// 	uni.navigateTo({
					// 		url: '/pages/mine/withdrawalRecord'
					// 	})
						break;
					case '违规扣款记录':
						uni.navigateTo({
							url: '/pages/mine/penaltyRecord'
						})
						break;
					// case '银行卡':
					// 	this.toPage('/pages/mine/incomeExpense?pageType=我的积分')
					// 	break;
					case '银行卡':
						uni.navigateTo({
							url: '/pages/setting/addBankCard'
						})
						break;
				}

			},
			
			goBalanceWithdrawal() {
				if(!this.isBind){
					uni.showModal({
						title: '确认操作',
						content: '您还未绑定银行卡，是否去绑定?',
						success: res => {
							if (res.confirm) {
								this.toPage('/pages/user/bindCardStep')
							}
						}
					});
				}else{
					this.toPage(`/pages/mine/balanceWithdrawal?balance=${this.balance}`)
				}
			},
			
			goRecharge(){
				uni.navigateTo({
					url: '/pages/mine/recharge'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: #FFFFFF;
	}
	.icon_setUp {
		font-weight: bold;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #FFFFFF;
		margin-right: 48rpx;

	}

	.text_list {
		margin: -80rpx 20rpx 0 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;


		.text_list_li {
			border-top: solid 2rpx #e6e6e6;
			padding-left: 46rpx;
			padding-right: 46rpx;
			height: 120rpx;
		}

		.text_list_li2 {

			padding-left: 46rpx;
			padding-right: 46rpx;
			height: 120rpx;
		}

		.list_text {
			line-height: 120rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 28rpx;
			color: $seconFontColor;
			float: left;
		}

		.list_image {
			float: right;
			width: 35rpx;
			height: 45rpx;
			margin-top: 37rpx;
		}


	}
	.money_List{
		margin-top: 40rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: relative;
	}
	.money_value {
		.money_text {
			font-weight: blod;
			font-size: 28rpx;
			line-height: 40rpx;
			text-align: center;
			color: #FFFFFF;

		}
	}

	.wire {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		background: #FFFFFF;
		opacity: 0.5;
		border-radius: 4rpx;
		height: 30rpx;
		width: 4rpx;
		// margin-top: 25rpx;
	}

	.title_back {
		/* position: absolute; */
		width: 100vw;
		height: 382rpx;
		background: linear-gradient(90deg, $themeColor 10%, $themeColor 100%);
		border-radius: 0rpx 0rpx 30rpx 30rpx;
		padding: 26rpx 0 0 0;
	}

	.balance {
		float: left;
		margin-left: 80rpx;
	}

	.withdraw_button {
		float: right;
		margin-top: 26rpx;
		width: 136rpx;
		height: 60rpx;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 10rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 400;
		font-size: 28rpx;
		line-height: 60rpx;
		text-align: center;
		color: $themeColor;
		margin-right: 48rpx;
	}

	.balance_text {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 44rpx;

		color: #FFFFFF;
	}

	.balance_value {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 400;
		font-size: 48rpx;
		line-height: 68rpx;
		color: #FFFFFF;
	}
</style>
