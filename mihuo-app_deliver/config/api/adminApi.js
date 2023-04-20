import store from '@/store';
import $http from '@/config/requestConfig'

export default class AdminApi {
	
	register(data) {
		return $http.post('admin/user/register', data)
	}
	
	registerClientId(data) {
		return $http.post('admin/user/cid', data)
	}
	
	/**
	 * @description 版本检测
	 * 参数1: type - 端类型
	 */
	getAppVersion(type) {
		return $http.get(`admin/appversion/getNewVersion?type=${type}`)
	}
	
	/**
	 * @description 获取短信验证码 GET admin/mobile/${phoneNum}/${type}
	 * SMSLOGIN 登录
	 * SMSMSG 短信通知
	 * SMSREGISTER 注册
	 */
	getMSGCode(phoneNum, type, isShowMsg, header) {
		return $http.get(
			`admin/mobile/${phoneNum}/${type}?code=${header ? encodeURIComponent(header.code) : ''}`, {}, {
				header: {
					isShowMessage: false,
				}
			})
	}
	
	/**
	 * @description 根据personId获取个人信息 GET admin/person/${personId}
	 */
	getPersonInfoByPersonId(personId) {
		return $http.get(`admin/person/${personId}`);
	}
	
	/**
	 * @description 根据userId获取手机号码 GET admin/user/phone/{userId}
	 */
	getPhoneNumberByUserId(userId) {
		return $http.post(`admin/user/phone/${userId}`);
	}
	
	/**
	 * @description 获取当前用户个人信息 GET admin/person/info
	 */
	getPersonInfo(data) {
		return $http.get('admin/person/info', data);
	}
	
	/**
	 * @description 获取当前用户工种信息 GET admin/person/getPersonInfo
	 */
	async getPersonSettingInfo(data) {
		// let person = await $http.get('admin/person/getPersonInfo', data);
		// // 过滤默认岗位
		// person.personageList = person.personageList.filter(item => item.jobCode !== 'JOB_DEFAULT')
		// return new Promise((resolev, reject) => {
		// 	resolev(person)
		// })
		
		return $http.get('admin/person/getPersonInfo', data)
	}
	
	/**
	 * @description 修改用户工种信息 PUT admin/person
	 */
	editWorkTypeInfo(data) {
		return $http.put('admin/person', data)
	}
	
	/**
	 * @description 修改用户信息 PUT admin/person/updateByUserId
	 */
	updateByUserId(data) {
		return $http.put('admin/person/updateByUserId', data)
	}
	
	/**
	 * @description 通过personId查询人员信息 POST admin/person/getPersonsByIds
	 * */
	getListById(data) {
		return $http.post(`admin/person/getPersonsByIds`, data);
	}
	
	/**
	 * @description 工人分页查询 GET admin/person/getlist
	 */
	getPeopleList(data) {
		return $http.get('admin/person/getlist', data)
	}
	
	/**
	 * @description 获取工种信息 GET admin/customer/sysjobskill/page
	 * */
	getWorkType(data) {
		return $http.get('admin/customer/sysjobskill/page', data);
	}
	
	/**
	 * @description 申请技能认证 POST admin/person/skillauth
	 * */
	applyToSkillAuth(data) {
		return $http.post('admin/person/skillauth', data);
	}
	
	/**
	 * @description 12. 获取用户绑定手机号码 GET admin/mfa/user/conf
	 */
	getUserPhone(data) {
		return $http.get('admin/mfa/user/conf', data, {
			header: {
				isShowMessage: false
			}
		})
	}
	
	/**
	 * @description 13. 发送验证码到用户绑定手机号 GET admin/mfa/user/smscode/send
	 */
	sendCodeUserPhone() {
		return $http.get('admin/mfa/user/smscode/send')
	}
	
	/**
	 * @description 21. 获取用户支付账号绑定银行卡 post admin/sysbankcard/icons
	 */
	getPaymentAccountBankCardIcon(data, isShowMessage = true) {
		return $http.post('admin/sysbankcard/icons', data, {
			header: {
				isShowMessage
			}
		})
	}
	
	/**
	 * @description 通过字典类型查找字典 GET admin/dict/type/${data.type}
	 * */
	getDicType(data) {
		return $http.get(
			`admin/dict/type?type=${data.type}&cityOperatorId=${uni.getStorageSync('cityOperatorId')}`);
	}
	
	/**
	 * @description 根据岗位id列表获取岗位信息 GET admin/sysjobskill/listJobByIds
	 * */
	listJobByIds(data) {
		return $http.get(`admin/sysjobskill/listJobByIds`, data);
	}
	
	/**
	 * @description 运营商列表 GET admin/cityoperator/list
	 */
	getCityOperator() {
		return $http.get('admin/cityoperator/list');
	}
	
	/**
	 * @description 获取是否需要多重因素认证 GET admin/mfa/check
	 * */
	mfaConf(data) {
		return $http.get(`admin/mfa/check`, data, {
			header: {
				isShowMessage: false
			}
		});
	}
	
	/**
	 * @description 校验用户-企业支付密码并获取ticket POST admin/mfa/verify/ppwd
	 * */
	corpVerifyPpwd(data) {
		return $http.post(`admin/mfa/verify/ppwd`, data);
	}
	
	/**
	 * @description 发送验证码到用户-企业绑定手机号 POST admin/mfa/smscode/send
	 * */
	smscodeSend(data) {
		return $http.post(`admin/mfa/smscode/send`, data);
	}
	
	/**
	 * @description 校验短信验证码并获取ticket POST admin/mfa/verify/sms
	 * */
	verifySms(data) {
		return $http.post(`admin/mfa/verify/sms`, data);
	}
	
	/**
	 * @description 校验短信验证码并获取ticket GET admin/mfa/info/get
	 * */
	infoGet(data) {
		return $http.get(`admin/mfa/info/get`);
	}
	
	
	/**
	 * @description 通过id查询 平台工种信息
	 * */
	getSysjobskill(data) {
		return $http.get(`admin/sysjobskill/${data.skillId}`);
	}
	
	/**
	 * @description 通过id查询
	 * */
	selectSysjobskill(data) {
		return $http.get(`admin/sysjobskill/${data.skillId}`, );
	}
	
	/**
	 * @description 校验原手机号，并获取ticket
	 * */
	checkOldPhone(data) {
		return $http.put('admin/user/checkOldPhone', data);
	}
	
	
	/**
	 * @description 获取用户团队成员
	 * */
	getSysuserTeam(data) {
		return $http.get('admin/sysuserteam/page', data);
	}
	
	/**
	 * @description 搜索成员
	 * */
	searchMember(data) {
		return $http.get(`admin/user/search/${data}`);
	}
	
	/**
	 * @description 添加成员
	 * */
	addMember(data) {
		return $http.post(`admin/sysuserteam?userId=${data}`);
	}
	
	/**
	 * @description 通过id删除user团队成员
	 * */
	deleteMember(data) {
		return $http.post(`admin/sysuserteam/removeById?id=${data}`);
	}
	
	/**
	 * @description 通过userId查询用户信息
	 * */
	getUserInfo(data) {
		return $http.get(`admin/user/info`);
	}
	
	/**
	 * @description 扫码登录   
	 * */
	loginQr(data) {
		return $http.post(`admin/sys-fast/loginQr`, data);
	}
	
	/**
	 * @description  获取文件清单 
	 * */
	getFileList(data) {
		return $http.get(`admin/sys-fast/getFileList`, data);
	}
	
	/**
	 * @description  获取登录状态 
	 * */
	getLoginResult(data) {
		return $http.get(`admin/sys-fast/getLoginResult?guid=${data.guid}`);
	}
	
	/**
	 * @description  获取C端小程序码 
	 * */
	getWxMaQrcode(data) {
		return $http.post(`admin/weChat/wxMaQrcode`, data);
	}
	
	/**
	 * @description 根据指定运营商和工种的服务项
	 */
	 getServiceItemList(data) {
		return $http.get('admin/sysjobskill/serviceItem/list',data);
	}
	
	/**
	 * @description 根据指定运营商和工种的服务阶段
	 */
	 getServiceStageList(data) {
		return $http.get('admin/sysjobskill/serviceStage/list',data);
	}
	
	/**
	 * @description 根据指定运营商和工种的服务阶段
	 */
	 sysjobskillList(data) {
		return $http.get('admin/sysjobskill/list/platform',data);
	}
	
	
	/**
	 * @description 根据指定运营商和工种的服务阶段
	 */
	 userDetails(data) {
		return $http.get(`admin/user/details/${data}`);
	}
	
	/**
	 * @description 根据指定运营商和工种的服务阶段
	 */
	 hasPermission(data) {
		return $http.get(`admin/cityoperator/hasPermission?permission=${data.permission}&cityOperatorId=${data.cityOperatorId}`);
	}
	
	
	/**
	 * @description 根据指定运营商和工种的服务阶段
	 */
	 jobMemberWithEmployee(data) {
		return $http.get(`admin/person/jobMemberWithEmployee`,data);
	}
	
	/**
	 * @description 根据工种获取我的工匠
	 */
	 getPersonTeam(data) {
		return $http.get(`admin/sysuserteam/getPersonTeam`,data);
	}
}