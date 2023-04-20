<template>
	<view>
		<public-module></public-module>
		<z-nav-bar>
			<view class="nav-bar" backState="1000">余额提现</view>
			<view class="icon_setUp" slot="right" @click="goWithdrawalRecord">
				提现记录
			</view>
		</z-nav-bar>

		<!-- 提现 -->
		<view>
			<view class="withdrawal_value">
				<view class="withdrawal_title">提现金额</view>
				<input v-model="withdrawalMoney" type="digit" @input="checkNum" :maxlength="maxlength"
					placeholder="请输入提现金额" class="withdrawal_input" placeholder-style="color:#303" />
				<view class="fgx"></view>
				<view class="withdrawal_hint">可提现金额<text>￥{{Number(balance).toFixed(2)}}</text></view>
				<view class="all_withdrawal" @click="allMoney">全部提现</view>
			</view>
			<view class="withdrawal_select">
				<view class="withdrawal_select_title">提现到</view>

				<view class="withdrawal_select_select" @click="showBank">
					<image class="withdrawal_select_image" :src="$util.thumbnailImage(bankInfo.iconUrl)" />
					<view class="account">{{bankInfo.name}}</view>
					<view class="account_value">{{bankInfo.cardNo}}</view>
					<image src="/static/demo/icon_right.png" class="withdrawal_select_right"></image>
					<view style="clear:both;"></view>
				</view>
			</view>
			<view class="withdrawal_explain">
				提现说明
				<br />
				单笔提现最低金额：{{explainWithdraw.limit}}元；
				<br />
				今日剩余提现次数：{{explainWithdraw.count}}次
			</view>

		</view>

		<!-- 输入支付密码的弹框 -->
		<pay-popup v-if="popupType" @finalConfirm="finalConfirm" @popupCancel="popupCancel" :needVerify="needVerify"
		 :tipsShow="true" :money="withdrawalMoney" :serviceCharge="explainWithdraw.service" />
		<!-- 选择到账银行卡的弹框 -->
		<u-popup v-model="binkShow" mode="bottom" border-radius="30">
			<view class="bank_con">
				<view class="popup_title">选择银行卡
					<image class="close_icon" src="/static/icon/close.png" @click="binkShow = false"></image>
				</view>
				<view class="bank_item" v-for="(item,index) in bankList" :key="index">
					<view class="left">
						<image class="head_image" :src="$util.thumbnailImage(item.iconUrl)" />
						<view class="bank_info">
							<view class="bank">{{item.name}}({{item.cardNo}})</view>
							<view class="bank_address">预计2小时内到账</view>
						</view>
					</view>
					<view class="right">
						<u-radio-group v-model="bankCardId">
							<u-radio
								style="width: 28px;"
								:active-color="$styleColor.themeColor"
								@change="radioboxChange"
								:name="item.id"
								shape="circle"
								size=40
							/>
						</u-radio-group>
					</view>
				</view>
				<view class="add_bink" @click="goAddBank">
					<image src="/static/images/mine/add.png" class="icon" />
					<view class="test">添加储蓄卡提现</view>
				</view>
			</view>
		</u-popup>
		
		<view class="withdrawal_button" @click="goWithdrawal">提现</view>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	export default {
		data() {
			return {
				maxlength: 10,
				bankCardId: null,
				bankInfo: {},
				showNum: 0,
				withdrawalMoney: null,
				binkShow: false,
				balance: '0',
				value: '',
				hide: true, //隐藏文字
				popupType: false,
				stepIndex:1,
				numList: [{
					name: '提现申请已提交'
				}, {
					name: '银行处理中'
				}, {
					name: '到账时间视银行情况而定'
				}],
				bankList:[],
				needVerify: false,
				explainWithdraw: {}
			}
		},
		
		onLoad(option) {
			this.balance = option.balance
			this.getNeedVerify()
			this.getUserBank()
			this.getLimitWithdraw()
		},
		
		methods: {
			getLimitWithdraw(){
				this.$httpApi.getLimitWithdraw().then(res => {
					if(res){
						this.explainWithdraw = res
					}
				})
			},
			//获取银行卡图标和主题色
			getUserBankIcon(list,temNames){
				let names = []
					names = temNames.slice(0,temNames.length-1).split(',')
				this.$httpApi.getPaymentAccountBankCardIcon(names).then(res => {
					if(res){
						list.map(item => {
							res.map(m => {
								if(item.name === m.name){
									item['iconUrl'] = m.url
								}
							})
						})
						this.bankList = list
						this.bankList.map((m,i) => {
							if(i === 0){
								this.bankInfo = m
								this.bankCardId = m.id
							}
						})
					}
				}).catch(() => {
					this.bankList = list
					this.bankList.map((m,i) => {
						if(i === 0){
							this.bankInfo = m
							this.bankCardId = m.id
						}
					})
				})
			},
			//获取银行卡
			getUserBank(){
				let list = [],temNames = '',names = '';
				this.$httpApi.getPaymentAccountBankCard().then(res => {
					if(res){
						this.bankList = res
						list = res
						res.map(item => {
							temNames += item.name + ','
						})
						this.getUserBankIcon(list,temNames)
					}
				})
			},
			
			// 全部提现
			allMoney(){
				if(!this.balance){
					uni.showToast({
						title: '您还没有可提现的余额',
						icon: 'none'
					});
					return;
				}
				this.withdrawalMoney = this.balance
			},
			
			// 获取是否需要二次校验
			getNeedVerify(){
				this.$httpApi.mfaConf().then(res => {
					this.needVerify = res.needVerify
				}).catch(err => console.log(err))
			},
			
			// 选择银行卡
			radioboxChange(value){
				this.bankCardId = value
				this.bankList.map(item => {
					if(item.id === value){
						this.bankInfo = item
					}
				})
			},

			finalConfirm(num,flag,ticket){
				this.$httpApi.paymentAccountWithdraw({
					amount: this.withdrawalMoney,
					bankCardId: Number(this.bankCardId),
				},{header:{
					'mfa-verify-ticket': ticket
				}}).then( res => {
					if(res){
						setTimeout(()=>{
							uni.showModal({
								title: '提示',
								content: '提现成功',
								showCancel: false,
								success: res => {
									if(res.confirm){
										uni.navigateBack();
									}
								}
							});
						},100)
					}
				}).catch(err => {
					if(err){
						this.$util.toast(err.errMsg)
					}
				})
			},
			
			goWithdrawal() {
				let val = operation.floatSub(parseFloat(this.balance),parseFloat(this.withdrawalMoney))
				let isVal = operation.floatSub(parseFloat(this.explainWithdraw.limit),parseFloat(this.withdrawalMoney))
				if(!this.balance || val<0){
					uni.showToast({
						title: '余额不足',
						icon: 'none'
					});
					return;
				}
				if(isVal>0){
					uni.showToast({
						title: '单笔提现最低金额：' + this.explainWithdraw.limit + '元',
						icon: 'none'
					});
					return;
				}
				if(this.withdrawalMoney<=0){
					uni.showToast({
						title: '请输入提现金额',
						icon: 'none'
					});
					return;
				}
				this.popupType = true
			},
			checkNum(e) {
				let value = e.detail.value;
				let dot = value.indexOf('.'); //包含小数点
				let reg = /^[0-9]+$/; //正整数
				if (dot > -1) {
					this.maxlength = dot + 3; //长度是小数点后两位
				}
				if (reg.test(value)) { //如果是正整数不包含小数点
					this.maxlength = 10;
				}
				this.payMoney = this.amount
			},
			goAddBank(){
				uni.navigateTo({
					url: '/pages/user/bindCard'
				})
			},
			popupCancel(flag) {
				this.popupType = flag;
			},
			goWithdrawalRecord() {
				uni.navigateTo({
					url: '/pages/mine/withdrawalRecord'
				});
			},
			showBank(){
				this.binkShow = !this.binkShow
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: $fontColor33;
	}
	.info_of {
		border-top: solid 2rpx #EEEEEE;
		margin-left: 26rpx;
		margin-right: 26rpx;
		margin-top: 60rpx;
	}

	.info_title {
		font-weight: 400;
		font-size: $middleFontSize;
		line-height: 40rpx;
		color: $viceFontColor;
		margin-top: 40rpx;
		float: left;
		margin-left: 100rpx;
	}

	.info_value {
		font-weight: 700;
		font-size: $middleFontSize;
		line-height: 40rpx;
		color: $viceFontColor;
		margin-top: 40rpx;
		float: right;
		margin-right: 70rpx;
	}

	.icon_setUp {
		font-weight: bold;
		font-size: $middleFontSize;
		line-height: 40rpx;
		color: #909299;
		margin-right: 20rpx;
	}

	.withdrawal_button {
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		line-height: 88rpx;
		margin: 294rpx 60rpx 0 60rpx;
		text-align: center;
		font-weight: bold;
		font-size: $middleFontSize;
		color: #FFFFFF;

	}

	.withdrawal_explain {
		margin: 54rpx 40rpx 0 40rpx;
		font-weight: 400;
		font-size: $smiddleFontSize;
		line-height: 158.5%;
		color: $fontColor99;

	}

	.withdrawal_select {
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 20rpx;
		height: 174rpx;
		padding: 24rpx 24rpx 20rpx 36rpx;

		.withdrawal_select_title {
			font-weight: 400;
			font-size: $middleFontSize;
			line-height: 40rpx;
			color: #909299;

		}

		.withdrawal_select_select {
			margin-top: 32rpx;

			.withdrawal_select_image {
				height: 40rpx;
				width: 40rpx;
				float: left;
			}

			.withdrawal_select_right {
				height: 40rpx;
				width: 40rpx;
				float: right;
			}

			.account {
				font-weight: 400;
				font-size: $middleFontSize;
				line-height: 40rpx;
				color: #606266;
				margin-left: 16rpx;
				float: left;
			}

			.account_value {
				font-weight: 400;
				font-size: $middleFontSize;
				line-height: 40rpx;
				margin-left: 16rpx;
				color: $themeColor;
				float: left;
			}

		}

	}

	.withdrawal_value {
		background: #FFFFFF;
		border-radius: 10rpx;
		height: 252rpx;
		margin: 20rpx;
		padding: 24rpx 24rpx 20rpx 36rpx;

		.withdrawal_title {
			font-weight: 400;
			font-size: $smiddleFontSize;
			line-height: 40rpx;
			color: #909299;
		}

		.withdrawal_input {
			font-weight: 400;
			font-size: $middleAddFontSize;
			height: 64rpx;
			color: $seconFontColor;
			margin-top: 12rpx;
		}
		.fgx{
			border-bottom: 2rpx solid #F6F6F6;
			margin-top: 20rpx;
		}

		.withdrawal_hint {
			font-weight: 400;
			font-size: $smallFontSize;
			line-height: 40rpx;
			color: $fontColor99;
			margin-top: 26rpx;
			float: left;
			text{
				font-size: $smallFontSize;
				font-weight: bold;
				color: $themeColor;
			}
		}

		.all_withdrawal {
			float: right;
			font-weight: 400;
			font-size: $smiddleFontSize;
			line-height: 40rpx;
			margin-top: 26rpx;
			text-align: right;
			color: $themeColor;
		}
	}
	.popup_title{
		line-height: 140rpx;
		text-align: center;
		font-size: $middleAddFontSize;
		color: $mainFontColor;
		border-bottom: 1px dashed $borderColorEE;
		position: relative;
		.close_icon{
			width: 42rpx;
			height: 42rpx;
			position: absolute;
			right: 0;
			top: 45rpx;
		}
	}
	.bank_con{
		background: #FFFFFF;
		margin-top: 8rpx;
		padding: 0 26rpx;
		.bank_item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1px dashed $borderColorEE;
			.left{
				display: flex;
				align-items: center;
				.head_image{
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
				.bank_info{
					.bank{
						font-size: $middleFontSize;
						color: $seconFontColor;
					}
					.bank_address{
						font-size: $smiddleFontSize;
						color: $viceFontColor;
					}
				}
			}
		}
	}
	.add_bink{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 46rpx;
		.icon{
			width: 48rpx;
			height: 48rpx;
			margin-right: 12rpx;
		}
		.text{
			font-size: $middleFontSize;
			color: $themeColor;
		}
	}
</style>
