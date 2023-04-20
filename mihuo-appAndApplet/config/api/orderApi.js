import $http from '@/config/requestConfig'

export default class OrderApi {
	
	/**
	 * @description 上报分享链接打开事件 POST order/bizsharecode/add
	 */
	reportShareEvent(data){
		return $http.post('order/bizsharecode/add', data);
	}
	
	/**
	 * @description 获取用户推荐统计数据 POST order/bizsharecode/shareStatisticByUserId
	 */
	getUserRecommendStats(data){
		return $http.get('order/bizsharecode/shareStatisticByUserId', data);
	}
	
	/**
	 * @description 发布需求 POST order/biz_order
	 */
	issueRequirementOrder(data){
		return $http.post('order/biz_order', data);
	}
	
	/**
	 * @description 根据节点id获取上传问卷 GET order/sopupload/group/list
	 */
	getUploadFileByNodeId(data){
		return $http.get('order/sopupload/group/list', data);
	}
	
	/**
	 * @description 设置我的家报告已读状态
	 */
	readMyHomeReport(data){
		return $http.get(`order/customer/bizorderacceptance/updateReadStatus`, data);
	}
	
	/**
	 * @description 根据项目id获取验收报告 GET order/bizorderacceptance/getAcceptancesByProjectId
	 */
	getAcceptancesByProjectId(data){
		return $http.get(`order/bizorderacceptance/getAcceptancesByProjectId`, data);
	}
	
	/**
	 * @description 根据地址id获取验收报告 GET order/customer/bizorderacceptance/getByAddressId?addressId
	 */
	getAcceptanceReportByAddressId(data){
		return $http.get(`order/customer/bizorderacceptance/getByAddressId?addressId=${data}`);
	}
	
	/**
	 * @description 取消正在呼叫的订单工种 GET order/capp/biz_order/cancelCall
	 */
	cancelOrderBySkillId(data){
		return $http.post(`order/capp/biz_order/cancelCall?skillId=${data}`);
	}
	
	/**
	 * @description 查询正在呼叫的订单工种 GET order/capp/biz_order/getOrderSkillIds
	 */
	getOrderSkillTypeStatus(data){
		return $http.get('order/capp/biz_order/getOrderSkillIds', data);
	}
	
	// --------------我的家/收货地址--------------
	
	/**
	 * @description 获取服务日历详情 GET order/project/getServiceCalendarDetail
	 */
	getServiceCalendarDetail(data) {
		return $http.get('order/project/getServiceCalendarDetail', data)
	}
	
	/**
	 * @description 获取服务日历总览 GET order/project/getServiceCalendarInfo
	 */
	getServiceCalendarOverview(data) {
		return $http.get('order/project/getServiceCalendarInfo', data)
	}
	
	/**
	 * @description 获取服务计划 GET order/project/stage/list
	 */
	getServicePlan(data) {
		return $http.get('order/project/stage/list', data)
	}
	
	/**
	 * @description 根据记账类型ID获取装修花费明细 GET order/bookkeeping/getByTypeIdForClien
	 */
	getCostDetailByTypeId(data) {
		return $http.get('order/bookkeeping/getByTypeIdForClient', data)
	}
	
	/**
	 * @description 获取我的家装修花费 GET order/bookkeeping/statisticalLedgerForClient
	 */
	getHomeCost(data) {
		return $http.get('order/bookkeeping/statisticalLedgerForClient', data)
	}
	
	/**
	 * @description 新增记账 POST order/bookkeeping/save
	 */
	addCostNote(data) {
		return $http.post('order/bookkeeping/save', data)
	}
	
	/**
	 * @description 删除记账类型 POST order/bookkeepingtype/removeById
	 */
	deleteCostNoteType(data) {
		return $http.post(`order/bookkeepingtype/removeById?id=${data}`)
	}
	
	/**
	 * @description 新增记账类型 POST order/bookkeepingtype/save
	 */
	addCostNoteType(data) {
		return $http.post('order/bookkeepingtype/save', data)
	}
	
	/**
	 * @description 获取记账类型 GET order/bookkeepingtype/list
	 */
	getCostNoteType(data) {
		return $http.post('order/bookkeepingtype/list', data)
	}
	
	/**
	 * @description 获取记账类型 GET order/bookkeepingtype/list
	 */
	getCostNoteType(data) {
		return $http.get('order/bookkeepingtype/list', data)
	}
	
	/**
	 * @description 根据项目获取服务计划 GET order/project/servicePlan/${projecId}
	 */
	getServiceProject(projecId) {
		return $http.get(`order/project/servicePlan/${projecId}`)
	}
	
	/**
	 * @description 待办发起方确认
	 */
	 senderConfirm(id) {
		return $http.post('order/bizpending/senderConfirm?pendingId='+ id)
	}
	
	/**
	 * @description 获取代办详情 GET order/bizpending/${id}
	 */
	getAssignedDetail(id) {
		return $http.get(`order/bizpending/${id}`)
	}
	
	/**
	 * @description 根据项目或收获地址查询图纸 GET order/sopupload/group/myhome
	 */
	getSopupload(data) {
		return $http.get('order/sopupload/group/myhome',data)
	}
	
	/**
	 * @description 根据项目ID获取团队成员
	 */
	getProjectMemberByProject(data) {
		return $http.get(`order/project/member`, data)
	}
	
	/**
	 * @description 根据收货地址ID获取项目列表
	 */
	getProjectsByAddressId(data) {
		return $http.get(`order/project/myHomes/${data}`)
	}
	
	/**
	 * @description 根据项目获取团队成员
	 */
	getProjectsTeam(data) {
		return $http.get('order/project/member',data)
	}
	
	/**
	 * @description 通过节点id查询金额 GET order/sopreceiptrecords/paymentOnlineMoney
	 */
	getMoenyByNodeId(nodeId) {
		return $http.get(`order/sopreceiptrecords/paymentOnlineMoney/${nodeId}`);
	}
	
	/**
	 * @description 通过节点id查询节点信息 GET order/project/node
	 */
	getSopNodeByNodeId(data) {
		return $http.get(`order/project/node`, data);
	}

	/**
	 * @description 处理待办项 POST order/project/projectNode/review
	 */
	handleToDoPending(data) {
		return $http.post('order/project/projectNode/review', data);
	}

	/**
	 * @description 查询节点审查人
	 */
	getCheckPerson(nodeId) {
		return $http.get(`order/project/projectNode/review/get/${nodeId}`);
	}
	
	
	/**
	 * @description 根据收货地址获取待确认项 GET order/bizpending/getByAddressId
	 */
	getMyTodoPending(data) {
		return $http.get(`order/bizpending/getByAddressId?addressId=${data}`);
	}
	
	/**
	 * @description 添加服务待确认项
	 */
	addMyTodoPending(data) {
		return $http.post(`order/bizpending`, data);
	}
	
	/**
	 * @description 交底列表记录
	 * */
	 orderDiscloseGet(data) {
		return $http.get(`order/order_disclose/disclose/list/${data.nodeId}`);
	}
	
	/**
	 * @description 根据交底记录获取详情
	 * */
	 getDiscloseContent(id) {
		return $http.get(`order/order_disclose/disclose/get/${id}`);
	}
	
	/**
	 * @description 施工单报价状态查询分页
	 * */
	 getBidOrderList(data) {
		return $http.get('order/bidorder/page', data);
	}
	
	/**
	 * @description 施工单报价记录查询
	 * */
	 getByOrderList(data) {
		return $http.get('order/bidorder/ownerGetOrderLogByOrderId', data);
	}
	
	/**
	 * @description 获取订单日志 GET order/bidorder/getOrderLogByOrderId
	 * */
	 getOrderLog(data) {
		return $http.get('order/bidorder/getOrderLogByOrderId', data);
	}
	
	/**
	 * @description 获取开单记录（装修用料）
	 * */
	 getBillRecord(data) {
		return $http.get('order/bizordergroupprice/typeByConditionForClient', data);
	}
	
	
	/**
	 * @description 获取模拟报价详情
	 * */
	 mulationQuoteDetails(data) {
		return $http.get(`order/bizsimulationquote/queryInfo/${data.id}`);
	}
	
	
	
	/**
	 * @description 获取报价记录
	 * */
	 getOfferRecord(data) {
		return $http.get('order/bidorder/getOrderOfferLogInfo', data);
	}
	
	/**
	 * @description 设置施工日志已读
	 * */
	 constructionRead(data) {
		return $http.post('order/construction_journal/confirm', data);
	}
	
	/**
	 * @description 设置打卡记录已读
	 * */
	sopscheduleRead(data) {
		return $http.post('order/sopschedule/confirm', data);
	}

	/**
	 * @description 获取施工案例（推荐案例）
	 * */
	getConstructionCase(data) {
		return $http.get('order/bizconstructioncase/getPage', data);
	}

	/**
	 * @description 获取施工案例详情（推荐案例）
	 * */
	getConstruCaseDetail(data) {
		return $http.get(`order/bizconstructioncase/queryByid`,data);
	}
	
	/**
	 * @description 组合报价查询
	 * */
	 getGroupBid(data) {
		return $http.get('order/bizordergroupprice/queryByCondition',data);
	}
	
	/**
	 * @description 获取收藏的案例 GET order/bizconstructioncase/getMyLikeCase
	 */
	 getFavCase(data) {
		return $http.get(`order/bizconstructioncase/getMyLikeCase?current=${data.current}&size=${data.size}`);
	}

	/**
	 * @description 案例收藏/取消
	 */
	 postCollectCase(data) {
		return $http.post(`order/bizconstructioncase/case/collect?caseId=${data.caseId}&isLike=${data.isLike}`);
	}
	/**************************装修用料***********************************/
	
	/**
	 * @description 按竞价id查询选材且按空间分组
	 * */
	getBizRoomGroupByOfferId(data) {
		return $http.get('order/bizroommaterial/getBizRoomGroupByOfferId',data);
	}
	
	/**
	 * @description 批量-新增或者修改选材 POST order/bizroommaterial/batchsaveOrUpdate
	 * */
	batchsaveOrUpdate(data) {
		return $http.post(`order/bizroommaterial/batchsaveOrUpdate`, data);
	}
	
	/**
	 * @description 获取开工交底记录
	 * */
	getDiscloseById(data) {
		return $http.get(`order/order_disclose/get/${data}`);
	}
	
	/**
	 * @description 获取分类及已选材料
	 * */
	getMaterialTypeList(data) {
		return $http.get('order/bizroommaterial/getMaterialTypeList',data);
	}
	
	/**
	 * @description  选材-空间区域分组及材料
	 * */
	getBizRoomGroupDTO(data) {
		return $http.get('order/bizroommaterial/getBizRoomGroupDTO',data);
	}
	
	/**************************装修用料***********************************/
	
	/**
	 * @description  基于竞价id新增组合报价
	 * */
	addGroupPriceByOfferId(data) {
		return $http.get('order/bizordergroupprice/addGroupPriceByOfferId',data);
	}
	
	/**
	 * @description  基于竞价id查询组合报价
	 * */
	groupPriceByOfferId(data) {
		return $http.get(`order/bizordergroupprice/groupPriceByOfferId/${data.offerId}`);
	}

	/**
	 * @description  居于报价单id查询沟通记录
	 * */
	getExchangeRecord(data) {
		return $http.post(`order/biz_order/addCommunicationByOffer`,data);
	}

	/**
	 * @description  查询节点审查详情
	 * */
	 getCheckNode(id) {
		return $http.get(`order/project/projectNode/review/view/${id}`);
	}

	/**
	 * @description  根据节点id查询验收记录
	 * */
	 getCheckNodeAcceptance(nodeId) {
		return $http.get(`order/sopConstruction/completeWorkAndAcceptList?nodeId=${nodeId}`);
	}

	/**
	 * @description  获取施工日志
	 * */
	 getBuildLog(data) {
		return $http.get(`order/construction_journal/page/new`,data);
	}

	/**
	 * @description  获取不确认项通知记录
	 * */
	 getNotConfirm(data) {
		return $http.post(`order/order_disclose/todo/disclose/list`,data);
	}

	/**
	 * @description  获取催办记录
	 * */
	 getNotToDo(data) {
		return $http.get(`order/order_disclose/todo/disclose/pending/logs`,data);
	}

	/**
	 * @description  不确认项问卷保存
	 * */
	 notConfirmSave(data,id) {
		return $http.post(`order/order_disclose/todo/disclose/handle?todoId=${id}`,data);
	}

	/**
	 * @description 发布需求
	 * */
	releaseDemand(data) {
		return $http.post('order/bizdemandconsultation/create', data);
	}
	
	
	/**
	 * @description 打印详情查询
	 * */
	queryDetailByPrint(data) {
		return $http.get(`order/projectalterationrecord/queryDetailByPrint/${data.id}`);
	}
	
	/**
	 * @description 审核变更
	 * */
	getVerify(data) {
		return $http.post(`order/projectalterationrecord/verify`, data);
	}
}