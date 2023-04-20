import $http from '@/config/requestConfig'

export default class AdminApi {
	
	/**
	 * @description 注册 POST admin/user/register
	 * */
	register(data) {
		return $http.post('admin/user/register', data)
	}
	
	/**
	 * @description 用户注销 POST admin/user/cancellation	
	 * */
	userLogOff(data) {
		return $http.post('admin/user/cancellation', data)
	}
	
	/**
	 * @description  获取C端小程序码 
	 * */
	getWxMaQrcode(data) {
		return $http.post(`admin/weChat/wxMaQrcode`, data);
	}
	
	/**
	 * @description 用户绑定邀请码 get admin/user/bindReferrerInviteCode
	 * */
	bindInvitationCode(data) {
		return $http.get(`admin/user/bindReferrerInviteCode/${data}`, )
	}
	
	/**
	 * @description 修改昵称 POST admin/user/changeNickname
	 */
	changeNickname(data){
		return $http.post(`admin/user/changeNickname?nickname=${data}`)
	}
	
	/**
	 * @description 获取短信验证码 GET admin/mobile/${phoneNum}/${type}
	 * SMSLOGIN 登录
	 * SMSMSG 短信通知
	 * SMSREGISTER 注册
	 */
	getMSGCode(phoneNum, type,header) {
		return $http.get(`admin/mobile/${phoneNum}/${type}?code=${encodeURIComponent(header.code)}`, {}, {
			header: {
				isShowMessage: false,
				...header
			}
		})
	}
	
	getPersonInfo() {
		return $http.get('admin/person/info');
	}
	
	registerClientId(data){
		return $http.post('admin/user/cid', data)
	}
	
	/**
	 * @description 获取是否需要多重因素认证 GET admin/mfa/check
	 *
	 */
	mfaConf(data) {
		return $http.get(`admin/mfa/check`, data, {
			header: {
				isShowMessage: false
			}
		});
	}
	
	/**
	 * @description 获取会话列表用户工种信息 POST admin/person/getPersonsByIMIds
	 *
	 */
	getIMPersonsByIMIds(data,header){
		return $http.post('admin/person/getPersonsByIMIds', data, header);
	}
	
	/**
	 * @description 获取平台工种 GET admin/sysjobskill/getPlatformJobSkill
	 */
	getPlatformSkills(data){
		return $http.get('admin/sysjobskill/getPlatformJobSkill', data);
	}
	
	/**
	 * @description 通过jobCode查询工种
	 */
	getSkillJobcode(type){	
		return $http.get(`admin/sysjobskill/getByCode?jobCode=${type}`);
	}
	
	/**
	 * @description 获取收藏的店铺 GET admin/company/focus/list
	 */
	getFavShop() {
		return $http.get('admin/company/focus/list');
	}
	
	/**
	 * @description 判断是收藏过店铺 GET admin/company/isFocus/{companyId}
	 */
	getFavShopCollect(companyId) {
		return $http.get(`admin/company/isFocus/${companyId}`);
	}
	
	/**
	 * @description 修改用户信息 PUT admin/person/updateByUserId
	 */
	updateByUserId(data) {
		return $http.put('admin/person/updateByUserId', data)
	}
	
	/**
	 * @description 批量获取店铺详情
	 */
	getShopNews(data){
		return $http.get(`admin/company/companies`,data)
	}
	
	/**
	 * @description 运营商列表
	 */
	getCityOperator() {
		return $http.get('admin/cityoperator/list');
	}
	
	/**
	 * @description 通过personId查询人员信息 POST admin/person/getPersonsByIds
	 * */
	 getListById(data) {
		return $http.post(`admin/person/getPersonsByIds`, data);
	}
	
	/**
	 * @description 版本检测
	 * 参数1: type - 端类型
	 */
	getAppVersion(type) {
		return $http.get(`admin/appversion/getNewVersion?type=${type}`)
	}
	
	/**
	 * @description 获取字典
	 * 参数1: type - 字典类型
	 */
	getDictByType(data) {
		return $http.get(`admin/dict/type`, data)
	}
	
	/**
	 * @description 获取当前用户工种信息 GET admin/person/getPersonInfo
	 */
	getPersonSettingInfo(data) {
		return $http.get('admin/person/getPersonInfo', data);
	}

	/**
	 * @description 获取工匠列表
	 */
	 getCraftsmanList(data) {
		return $http.get('admin/person/getlist',data);
	}
	/**
	 * @description 通过userId获取电话好嘛
	 */
	 getPhoneNumber(userId) {
		return $http.post(`admin/user/phone/${userId}`);
	}
}