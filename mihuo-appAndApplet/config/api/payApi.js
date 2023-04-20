import $http from '@/config/requestConfig'

export default class PayApi {
	
	/**
	 * @description 获取预付款余额 POST pay/account/person/getPrepaymentAmount
	 */
	getUserPrepaymentAmount(data) {
		return $http.get('pay/account/person/getPrepaymentAmount', data)
	}
	
	/**
	 * @description 退款拆分单 POST pay/tradeorder/refundSubConsumePay
	 */
	refundInstallmentOrder(data) {
		return $http.post('pay/tradeorder/refundSubConsumePay?payOrderNo=' + data.payOrderNo)
	}
	
	/**
	 * @description 确认支付拆分单 POST pay/tradeorder/subConsumePay
	 */
	confirmPayInstallmentOrder(data) {
		return $http.post('pay/tradeorder/subConsumePay', data)
	}
	
	/**
	 * @description 获取支付拆分单 GET pay/tradeorder/getSubConsumePay
	 */
	getInstallmentPaymentOrder(data) {
		return $http.get('pay/tradeorder/getSubConsumePay', data)
	}
	
	/**
	 * @description 获取用户支付账号状态 GET pay/account/person/status
	 */
	getPaymentAccountStatus() {
		return $http.get('pay/account/person/status')
	}
	
	/**
	 * @description 绑定手机 POST pay/account/person/bindphonepassword
	 */
	bindPaymentAccountPhonePwd(data) {
		return $http.post('pay/account/person/bindphonepassword', data)
	}
	
	/**
	 * @description 实名认证 POST pay/account/person/realNameCheck
	 */
	paymentAccountRealName(data) {
		return $http.post('pay/account/person/realNameCheck', data)
	}
	
	/**
	 * @description 注册个人支付账户 POST pay/account/person/register
	 */
	registerPaymentAccount(data, isShowMessage = false) {
		return $http.post('pay/account/person/register', data, {
			header: {
				isShowMessage: isShowMessage
			}
		})
	}
	
	/**
	 * @description 发送绑定手机验证码 POST pay/account/person/sendverifycode/bind
	 */
	sendPaymentAccountVerifyCode(data) {
		return $http.post('pay/account/person/sendverifycode/bind', data)
	}
	
	/**
	 * @description 只是实名认证 POST pay/account/person/realNameCheck
	 */
	accountRealName(data) {
		return $http.post('pay/account/person/realNameCheck', data)
	}
	
	/**
	 * @description 绑定手机 POST pay/account/person/cBindPhone
	 */
	bindPhone(data) {
		return $http.post('pay/account/person/cBindPhone', data)
	}
	
	/**
	 * @description 查看当前用户的安全状态
	 * */
	payPwdStatus(data) {
		return $http.get('pay/account/person/mfaStatus');
	}
}