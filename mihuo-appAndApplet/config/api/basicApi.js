import $http from '@/config/requestConfig'

export default class BasicApi {
	
	/**
	 * @description 登录 POST auth/oauth/token
	 * */
	login(data) {
		return $http.post('auth/oauth/token', data)
	}
	
	/**
	 * @description 退出登录 DELETE auth/token/logout
	 * */
	logout() {
		return $http.delete('auth/token/logout');
	}
	
	/**
	 * @description 根据ID获取app活动详情 GET basic/basicevents/queryBy
	 */
	getAppEventById(data) {
		return $http.get('basic/basicevents/queryBy/' + data, data);
	}
	
	/**
	 * @description 活动报名 POST basic/basicevents/submitRegistration
	 */
	submitEvent(data) {
		return $http.post('basic/basicevents/submitRegistration', data);
	}
	
	/**
	 * @description 获取通知列表
	 */
	getBasicMessage(data) {
		return $http.get('basic/notification/group/info', data, {
			header: {
				isShowMessage: false
			}
		});
	}
	
	/**
	 * @description 获取im token GET basic/im/accesstoken
	 */
	imToken() {
		return $http.get('basic/im/accesstoken', {}, {
			header: {
				isShowMessage: false
			}
		});
	}
	
	// im沟通相关
	getSuppllierImInfo(id) {
		const userData = uni.getStorageSync("userData");
		const userId = userData.sysUser.userId;
		return $http.post(`basic/im/getCompanyServiceGroup`, {
			customerId: userId,
			companyId: id
		});
	}
	
	/**
	 * @description 首页 banner信息
	 */
	getBannerList(data) {
		return $http.get('basic/activity/getPage', data);
	}
	
	/**
	 * @description 通过id查询问卷模板明细（无权限） GET basic/surveytemplate/getTemplateInfoById/${data.id}
	 * */
	 getTemplateInfoById(id) {
		return $http.get(`basic/surveytemplate/getTemplateInfoById/${id}`);
	}
	
	/**
	 * @description 通过字典类型查询对应字典
	 */
	getDictByValue(data) {
		return $http.get(`basic/basiccommonstatement/page`, data)
	}

	/**
	 * @description 装修方式
	 */
	getDecorationType(data) {
		return $http.get(`basic/basicservicetemplate/getOne`, data)
	}

	/**
	 * @description 呼叫工种详情
	 */
	callMaster(data) {
		return $http.get(`basic/basicskillordertemplate/getOne`, data)
	}
	
}