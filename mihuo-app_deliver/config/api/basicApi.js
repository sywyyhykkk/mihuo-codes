import $http from '@/config/requestConfig'
export default class BasicApi {
	
	
	login(data) {
		return $http.post('auth/oauth/token', data);
	}
	
	logout() {
		return $http.delete('auth/token/logout');
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
	
	
	/**
	 * @description 交易快报分页查询 GET basic/express/page
	 */
	getExpressList(data) {
		return $http.get('basic/express/page', data)
	}
	
	/**
	 * @description Banner分页查询 GET basic/activity/getPage
	 */
	getBannerList(data) {
		return $http.get('basic/activity/getPage', data)
	}
	
	/**
	 * @description 获取协议 GET basic/protocol/getByProtocolType/${type}
	 */
	getProtocol(type) {
		return $http.get(`basic/protocol/getByProtocolType/${type}`)
	}
	
	/**
	 * @description 查询罚款明细 GET basic/basicrewardrule/page
	 * */
	getProblems(data) {
		return $http.get(`basic/basicrewardrule/page`, data);
	}
	
	/**
	 * @description 通过id查询问卷模板明细（无权限） GET basic/surveytemplate/getTemplateInfoById/${data.id}
	 * */
	getTemplateInfoById(data) {
		return $http.get(`basic/surveytemplate/getTemplateInfoById/${data.id}`);
	}
	
	/**
	 * @description 通过ids查询问卷模板明细 POST basic/surveytemplate/getTemplateDetailsByIds
	 * */
	getTemplateDetailsByIds(data) {
		return $http.post(`basic/surveytemplate/getTemplateDetailsByIds`, data);
	}
	
	/**
	 * @description 通过id查询问卷模板明细
	 * */
	getTemplateDetailsById(data) {
		return $http.get(`basic/surveytemplate/getTemplateDetailsById/${data.id}`);
	}
	
	/**
	 * @description 通过ids查询问卷模板明细及答案 POST basic/surveytemplate/getSurveyAnswer
	 * */
	getSurveyAnswer(data) {
		uni.setStorageSync('lastVisitedUrl', ''); //解除限流
		return $http.post(`basic/surveytemplate/getSurveyAnswer`, data);
	}
	
	//im沟通相关
	getSuppllierImInfo(id) {
		const userData = uni.getStorageSync("userData");
		const userId = userData.sysUser.userId;
		return $http.post(`basic/im/getCompanyServiceGroup`, {
			customerId: userId,
			companyId: id
		});
	}
	
	/**
	 * @description 根据条件获取问卷单条答案 GET
	 * */
	surveyanswerGet(data) {
		return $http.get(`basic/surveyanswer/get`, data);
	}
	
	/**
	 * @description 根据条件获取问卷答案列表 GET
	 * */
	surveyanswerList(data) {
		return $http.get(`basic/surveyanswer/list`, data);
	}
	
	/**
	 * @description 分页查询
	 * */
	selectPhrase(data) {
		return $http.get(`basic/basiccommonstatement/page`, data);
	}
	
	/**
	 * @description 通过id查询模板
	 * */
	getTemplateById(data) {
		return $http.get(`basic/acceptance_template/getTemplateInfo/${data.templateId}`);
	}
	
	/**
	 * @description 分页查询
	 * */
	getPaymentBy(data) {
		return $http.get(`basic/basicperiodizationtemplate/page`, data);
	}
	
	
	/**
	 * @description  获取当前工匠提示信息
	 * */
	userInfOgetPersonMsg(data) {
		return $http.get(`basic/customer/integral/getPersonMsg`, data);
	}
	
	/**
	 * @description  查询工匠等级权益信息
	 * */
	getSkillConfigInfo(data) {
		return $http.get(`basic/skillconfig/getSkillConfigInfo`, data);
	}
	
	
	/**
	 * @description  工人管理-工人积分记录
	 * */
	getPersonIntegralInfo(data) {
		return $http.get(`basic/skillconfig/getPersonIntegralInfo`, data);
	}
	
	/**
	 * @description  获取工匠规则-1平台，大于0为企业id
	 * */
	getRewardRule(data) {
		return $http.get(`basic/basicrewardrule/getRewardRule`, data);
	}
	
	/**
	 * @description  获取工匠规则-1平台，大于0为企业id
	 * */
	getRuleCategoryInfo(data) {
		return $http.get(`basic/basicrewardrule/getRuleCategoryInfo`, data);
	}
	
	
	/**
	 * @description  
	 * */
	getRuleCategory(data) {
		return $http.get(`basic/basicrewardrule/getRuleCategory`, data);
	}
	
	/**
	 * @description  
	 * */
	getAppPage(data) {
		return $http.get(`basic/basicrewardrule/getAppPage`, data);
	}
	
}