import $http from '@/config/requestConfig'

export default class PayApi {
	
	/**
	 * @description 获取用户支付账号状态 GET pay/account/person/status
	 */
	getPaymentAccountStatus() {
		return $http.get('pay/account/person/status')
	}
	
	/**
	 * @description 1. 注册个人支付账户 POST pay/account/person/register
	 */
	registerPaymentAccount(data, isShowMessage = true) {
		return $http.post('pay/account/person/register', data, {
			header: {
				isShowMessage: isShowMessage
			}
		})
	}
	
	/**
	 * @description 2. 发送绑定手机验证码 POST pay/account/person/sendverifycode/bind
	 */
	sendPaymentAccountVerifyCode(data) {
		return $http.post('pay/account/person/sendverifycode/bind', data)
	}
	
	
	/**
	 * @description 2. 绑定手机
	 */
	cBindPhone(data) {
		return $http.post('pay/account/person/cBindPhone', data)
	}
	
	/**
	 * @description 3. 绑定手机 POST pay/account/person/bindphonepassword
	 */
	bindPaymentAccountPhonePwd(data) {
		return $http.post('pay/account/person/bindphonepassword', data)
	}
	
	/**
	 * @description 4. 实名认证 POST pay/account/person/realNameCheck
	 */
	paymentAccountRealName(data) {
		return $http.post('pay/account/person/realNameCheck', data)
	}
	
	/**
	 * @description 5. 签署电子合同 POST pay/account/person/signContract
	 */
	signPaymentAccountContract(data) {
		return $http.post('pay/account/person/signContract', data)
	}
	
	/**
	 * @description 6. 绑定银行卡 POST pay/account/person/applyBindBankCard
	 */
	bindPaymentAccountBankCard(data, header) {
		return $http.post('pay/account/person/applyBindBankCard', data, header)
	}
	
	/**
	 * @description 7. 解除绑定银行卡 POST pay/account/person/unBindBankCard
	 */
	unbindPaymentAccountBankCard(data, header) {
		return $http.post('pay/account/person/unBindBankCard', data, header)
	}
	
	/**
	 * @description 8. 获取用户支付账号绑定银行卡 GET pay/account/person/getBankCard
	 */
	getPaymentAccountBankCard(data, isShowMessage = false) {
		return $http.get('pay/account/person/getBankCards', data, {
			header: {
				isShowMessage: isShowMessage
			}
		})
	}
	
	/**
	 * @description 9. 获取用户支付账号余额 GET pay/account/person/queryBalance
	 */
	getPaymentAccountBalance(data, isShowMessage = true) {
		return $http.get('pay/account/person/queryBalance', data, {
			header: {
				isShowMessage: isShowMessage
			}
		})
	}
	
	/**
	 * @description 10. 用户支付账号充值 POST pay/account/person/applyDeposit
	 */
	paymentAccountDeposit(data) {
		return $http.post('pay/account/person/applyDeposit')
	}
	
	/**
	 * @description 11. 用户支付账号提现 POST pay/account/person/applyWithdraw
	 */
	paymentAccountWithdraw(data, header) {
		return $http.post('pay/account/person/applyWithdraw', data, header)
	}
	
	
	/**
	 * @description 14. 获取当前用户的提现记录 GET pay/tradeorder/withdrawrecord/page
	 */
	withdrawalRecord(data) {
		return $http.get('pay/tradeorder/withdrawrecord/page', data)
	}
	
	/**
	 * @description 15. 获取当前用户的充值记录 GET pay/tradeorder/depositrecordrecord/page
	 */
	rechargeRecord(data) {
		return $http.get('pay/tradeorder/depositrecordrecord/page', data)
	}
	
	/**
	 * @description 16. 获取当前用户的金额流水记录收支明细 GET pay/tradeorder/amountchangerecord/page
	 */
	incomeExpenditure(data) {
		return $http.get('pay/tradeorder/amountchangerecord/page', data)
	}
	
	/**
	 * @description 17. 获取当前用户的金额流水合计金额 GET pay/tradeorder/amountchangerecord/total
	 */
	incomeExpenditureTotal(data, isShowMessage = true) {
		return $http.get('pay/tradeorder/amountchangerecord/total', data, {
			header: {
				isShowMessage: isShowMessage
			}
		})
	}
	
	/**
	 * @description 21. 获取提现限制相关参数 GET pay/account/person/limitWithdraw
	 */
	getLimitWithdraw() {
		return $http.get('pay/account/person/limitWithdraw')
	}
	
	/**
	 * @description 支付费用 POST pay/tradeorder/pay
	 * */
	tradeorderPay(data) {
		return $http.post(`pay/tradeorder/pay`, data);
	}
	
	/**
	 * @description 确认支付
	 * */
	payConfirm(data) {
		return $http.post(`pay/tradeorder/payConfirm`, data);
	}
	
	
	/**
	 * @description 查看当前用户的安全状态
	 * */
	payPwdStatus(data) {
		return $http.get('pay/account/person/mfaStatus');
	}
}