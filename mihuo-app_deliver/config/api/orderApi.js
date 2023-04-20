import $http from '@/config/requestConfig'

export default class orderApi {

	/**
	 * @description 工人分页查询 GET
	 */
	getPersonlist(data) {
		return $http.get('order/biz_order/getPersonlist', data)
	}

	/**
	 * @description 榜单查询 GET
	 * 赚钱英雄榜 rankType:1 order/income_tiptop/customer/page
	 * 明星工匠榜 rankType:2 mall/sms_worker_tiptop/customer/page
	 */
	getRankList(rankType, data) {
		if (rankType === 1) return $http.get('order/income_tiptop/customer/page', data)
		else if (rankType === 2) return $http.get('mall/sms_worker_tiptop/customer/page', data)
	}


	/**
	 * @description 根据报价(竞价)ID指派外部订单 POST order/biz_order/publisher/confirmPerson
	 */
	assignByOfferId(offerId) {
		return $http.post(`order/biz_order/publisher/confirmPerson/${offerId}`);
	}

	/**
	 * @description 根据任务ID获取所有报价信息/已指派人员 GET order/biz_order/project/order
	 */
	getPersonByProjectNode(data) {
		return $http.get('order/biz_order/project/order', data);
	}

	/**
	 * @description 获取订单类型 GET order/biz_order/getOrderType
	 */
	getOrderType(data) {
		return $http.get('order/biz_order/getOrderType', data);
	}

	/**
	 * @description 获取我发布的订单 GET order/biz_order/self/publish
	 */
	getMyPublishedOrder(data) {
		return $http.get('order/biz_order/self/publish', data);
	}

	/**
	 * @description 获取我服务的订单 GET order/biz_order/self/receive
	 */
	getMyReceivedOrder(data) {
		return $http.get('order/biz_order/self/receive', data);
	}

	/**
	 * @description 获取我发布的订单详情
	 */
	getPublishDetail(data) {
		return $http.get(`order/biz_order/self/publishDetail/${data.id}`);
	}

	/**
	 * @description 获取我服务的订单详情
	 */
	getReceiveDetail(data) {
		return $http.get(`order/biz_order/self/receiveDetail/${data.id}`);
	}

	/**
	 * @description 发布订单 POST order/biz_order
	 */
	sendOrder(data) {
		return $http.post('order/biz_order', data)
	}

	/**
	 * @description 指派订单 POST order/project/assign
	 */
	assignOrder(data) {
		return $http.post('order/project/assign', data, {
			header: {
				isShowMessage: false
			}
		})
	}

	/**
	 * @description 修改订单 PUT order/biz_order
	 */
	editOrder(data) {
		return $http.put('order/biz_order', data)
	}

	/**
	 * @description 刷新订单 PUT order/biz_order
	 */
	refreshOrder(orderId) {
		return $http.put(`order/biz_order/${orderId}`)
	}

	/**
	 * @description 根据订单ID获取订单及报价信息 GET order/bidorder/${id}
	 */
	getOrderById(id) {
		return $http.get(`order/bidorder/${id}`);
	}

	/**
	 * @description 修改订单报价 POST order/bidorder/priceupdate
	 */
	updateOrderOfferPrice(data) {
		return $http.post('order/bidorder/priceupdate', data);
	}

	/**
	 * @description 新增订单报价 POST order/bidorder/save
	 */
	addOrderOfferPrice(data) {
		return $http.post('order/bidorder/save', data);
	}

	/**
	 * @description 订单分页查询 GET order/biz_order/page
	 */
	getOrderList(data) {
		if (uni.getStorageSync('userInfo')) {
			// 登录时调用，获取是否是企业人员订单
			return $http.get('order/biz_order/getPage', data)
		} else {
			// 未登录时调用
			return $http.get('order/biz_order/page', data)
		}
	}

	/**
	 * @description 取消订单 POST order/biz_order/cancel
	 */
	cancelOrder(data) {
		return $http.post('order/biz_order/cancel', data)
	}


	/**
	 * @description 分页查询
	 */
	selectOrderPage(data) {
		return $http.get('order/bidorder/page', data)
	}


	/**
	 * @description 通过id查询
	 */
	orderBizproject(data) {
		return $http.get(`order/bizproject/${data.id}`)
	}

	/**
	 * @description 18. 获取当前用户的违规扣款记录 GET order/bizorderforfeit/page
	 */
	getPenaltyRecord(data) {
		return $http.get('order/bizorderforfeit/page', data)
	}

	/**
	 * @description 添加浏览订单的足迹 POST order/biztrail/orderTrail
	 */
	addOrderHistory(data) {
		return $http.post('order/biztrail/orderTrail', data)
	}

	/**
	 * @description 添加浏览人的足迹 POST order/biztrail/personTrail
	 */
	addPersonHistory(data) {
		return $http.post('order/biztrail/personTrail', data)
	}


	/**
	 * @description 获取订单已报价人员或SOP节点已指派人员 GET order/bidorder/list/${id}
	 */
	getOfferPeopleList(data) {
		return $http.get(`order/bidorder/list`, data);
	}

	/**
	 * @description 订单详情 GET order/project/queryByOrderId 根据订单id
	 */
	getSopProjectDetails(data) {
		return $http.get(`order/project/queryByOrderId/${data.id}`, );
	}

	/**
	 * @description 项目详情 GET order/project
	 */
	getProjectDetails(data) {
		return $http.get(`order/project/${data.id}`);
	}

	/**
	 * @description 新增待办任务
	 * @param {number}  type:待办类型 （材料类=1异常反馈=2）
	 * POST order/soppendingorder/save
	 */

	bizorderfeedbackSave(data) {
		return $http.post('order/soppendingorder/save', data);
	}

	/**
	 * @description 待办任务分页查询 GET order/soppendingorder/page
	 */
	bizorderfeedbackPage(data) {
		return $http.get('order/soppendingorder/page', data);
	}


	/**
	 * @description 更新待处理状态
	 */
	bizpendingHandle(data) {
		return $http.post(`order/bizpending/handle`, data);
	}

	/**
	 * @description 根据id查询我的待办
	 */
	getBizpendingDetails(data) {
		return $http.get(`order/bizpending/myPendingById`, data);
	}

	/**
	 * @description 通过id查询
	 */
	getBizpendingId(data) {
		return $http.get(`order/bizpending/${data.id}`);
	}


	/**
	 * @description customer-任务task管理 通过id查询 GET /order/biztask/{nodeId}
	 */
	getBiztaskDetails(data) {
		return $http.get(`order/biztask/${data.nodeId}`);
	}

	/**
	 * @description 通过节点id查询节点信息 GET order/project/node/${data.id}
	 */
	sopNodeTemplate(data) {
		return $http.get(`order/project/node`, data);
	}

	/**
	 * @description 开工 POST order/sopConstruction/startWork
	 */
	sopStartWork(data) {
		return $http.post('order/sopConstruction/startWork', data);
	}

	/**
	 * @description 节点上传文件按分组信息获取 GET order/sopupload/group/list
	 */
	sopuploadGroupList(data) {
		return $http.get(`order/sopupload/group/list`, data);
	}

	/**
	 * @description 节点上传文件 POST order/sopupload/create
	 */
	sopuploadCreate(data) {
		return $http.post(`order/sopupload/create`, data);
	}

	/**
	 * @description 节点上传修改 POST order/sopupload/modify
	 */
	sopuploadModify(data) {
		return $http.post(`order/sopupload/modify`, data);
	}


	/**
	 * @description 团队成员列表-岗位分组 GET order/project/member/group
	 * */
	taskMemberList(data) {
		return $http.get(`order/project/member/group`, data);
	}

	/**
	 * @description 终止团队成员服务 post order/project/memberAbortService
	 * */
	terminationService(data) {
		return $http.post(`order/project/memberAbortService?personId=${data.personId}&projectId=${data.projectId}`);
	}

	/**
	 * @description 团队成员列表-无分组 GET order/project/member
	 * */
	getMemberList(data) {
		return $http.get(`order/project/member`, data);
	}

	/**
	 * @description 发表评价 POST order/bizorderreply/save
	 * */
	bizorderreplySave(data) {
		return $http.post(`order/bizorderreply/save`, data);
	}

	/**
	 * @description 评价记录分页 GET order/bizorderreply/getList
	 * */
	bizorderreplyPage(data) {
		return $http.get(`order/bizorderreply/getList`, data);
	}

	/**
	 * @description 获取评价状态 GET order/bizorderreply/getReplyStatus
	 * */
	getReplyStatus(data) {
		return $http.get(`order/bizorderreply/getReplyStatus`, data);
	}

	/**
	 * @description 获取评价状态细节 GET order/bizorderreply/getByDetail
	 * */

	getByDetail(data) {
		return $http.get(`order/bizorderreply/getByDetail`, data);
	}

	/**
	 * @description 工序清单 get order/project/processList
	 * */
	getProcessList(data) {
		return $http.get(`order/project/processList`, data);
	}

	/**
	 * @description 新增服务日志 POST order/construction_journal
	 * */
	getConstructionJournal(data) {
		return $http.post(`order/construction_journal`, data);
	}

	/**
	 * @description 服务日志详情 GET order/construction_journal/one
	 * */
	getConstructionJournalOne(data) {
		return $http.get(`order/construction_journal/one`, data);
	}

	/**
	 * @description 服务日志分页查询 GET order/construction_journal/page
	 * */
	getConstructionJournalPage(data) {
		return $http.get(`order/construction_journal/page`, data);
	}

	/**
	 * @description 服务日志orderId查询 GET /order/construction_journal/byOrderId/{orderId}
	 * */
	getConstructionJournalByOrderId(data) {
		return $http.get(`order/construction_journal/byOrderId/${data}`);
	}

	/**
	 * @description 根据日志id查询施工日志详情 GET order/construction_journal/view
	 * */
	viewDetails(data) {
		return $http.get(`order/construction_journal/view/${data.id}`);
	}

	/**
	 * @description 通过id查询 开工交底 GET order/order_disclose/getDisclose/${data.nodeId}
	 * */
	selectOrderDisclose(data) {
		return $http.get(`order/order_disclose/getDisclose/${data.nodeId}`);
	}


	/**
	 * @description 通过节点Id查询交底列表
	 * */
	selectDiscloseList(data) {
		return $http.get(`order/order_disclose/disclose/list/${data.nodeId}`);
	}


	/**
	 * @description 通过节点Id查询通知
	 * */
	selectNotifyList(data) {
		return $http.get(`order/order_disclose/notify/get/${data.nodeId}`);
	}

	/**
	 * @description 通过id查询 交底内容
	 * */
	discloseDetails(data) {
		return $http.get(`order/order_disclose/disclose/get/${data.id}`);
	}


	/**
	 * @description 获取开工交底记录列表 GET order/order_disclose/getDiscloseRecordList
	 * */
	getDiscloseRecordList(data) {
		return $http.get(`order/order_disclose/list`, data);
	}

	/**
	 * @description 保存开工交底 POST order/order_disclose/save
	 * */
	saveOrderDisclose(data) {
		return $http.post(`order/order_disclose/disclose/save`, data);
	}

	/**
	 * @description 保存开工交底补充 POST order/order_disclose/saveDiscloseAdd
	 * */
	saveDiscloseAdd(data) {
		return $http.post(`order/order_disclose/add/save`, data);
	}

	/**
	 * @description 保存开工交底通知 POST order/order_disclose/saveDiscloseNotify
	 * */
	saveDiscloseNotify(data) {
		return $http.post(`order/order_disclose/notify/save`, data);
	}


	/**
	 * @description 分页查询列表整改 GET order/bizorderabarbeitung/page
	 * */
	getOrderabarbeitungList(data) {
		return $http.get(`order/bizorderabarbeitung/page`, data);
	}

	/**
	 * @description 新增整改 POST order/bizorderabarbeitung/save
	 * */
	getOrderabarbeitungSave(data) {
		return $http.post(`order/bizorderabarbeitung/save`, data);
	}

	/**
	 * @description 获取整改详情 GET order/bizorderabarbeitung/${data.id}
	 * */
	getOrderabarbeitungDetails(data) {
		return $http.get(`order/bizorderabarbeitung/${data.id}`);
	}

	/**
	 * @description 审批整改 POST order/bizorderabarbeitung/updateAbarbeitung
	 * */
	getUpdateAbarbeitung(data) {
		return $http.post(`order/bizorderabarbeitung/updateAbarbeitung`, data);
	}

	/**
	 * @description 获取巡检问题详情 GET order/sopinspect/getCustomInspectById/${data.id}
	 * */
	getCustomInspectById(data) {
		return $http.get(`order/sopinspect/getCustomInspectById/${data.id}`);
	}

	/**
	 * @description 停工复工分页查询 GET order/bizorderworkstatus/page
	 * */
	orderworkstatusPage(data) {
		return $http.get(`order/bizorderworkstatus/page`, data);
	}

	/**
	 * @description 新增 停工复工 POST order/bizorderworkstatus/save
	 * */
	orderworkstatusSave(data) {
		return $http.post(`order/bizorderworkstatus/save`, data);
	}

	/**
	 * @description 获取罚款详情 GET order/bizorderforfeit/${data.id}
	 * */
	orderforfeitDetails(data) {
		return $http.get(`order/bizorderforfeit/${data.id}`);
	}

	/**
	 * @description 获取待评价人员列表 GET order/project/getEvaluateMemberList
	 * */
	getEvaluateMemberList(data) {
		return $http.get(`order/project/getEvaluateMemberList`, data);
	}

	/**
	 * @description 通过id查询验收管理 GET order/bizorderacceptance/getAcceptance/${data.id}
	 * */
	getAcceptanceId(data) {
		return $http.get(`order/bizorderacceptance/getAcceptance/${data.id}`);
	}

	/**
	 * @description 根据明细Id获取验收明细 GET order/bizorderacceptance/getAcceptanceItemById/${data.id}
	 * */
	getAcceptanceItemById(data) {
		return $http.get(`order/bizorderacceptance/getAcceptanceItemById/${data.id}`);
	}

	/**
	 * @description 获取整改状态 GET order/bizorderabarbeitung/getByStatus
	 * */
	getAcceptanceStatus(data) {
		return $http.get(`order/bizorderabarbeitung/getByStatus`, data);
	}


	/**
	 * @description 户型参数 GET order/bizroomareaattribute/getRoomTypeList
	 * */
	getRoomTypeList(data) {
		return $http.get(`order/bizroomareaattribute/getRoomTypeList`, data);
	}

	/**
	 * @description 量房空间参数 GET order/project/attributevalue/getSpaceTypeList
	 * */
	getSpaceTypeList(data) {
		return $http.get(`order/project/attributevalue/getSpaceTypeList`, data);
	}

	/**
	 * @description 房屋参数 GET order/bizroombulid/getBuildTypeList
	 * */
	getBuildTypeList(data) {
		return $http.get(`order/bizroombulid/getBuildTypeList`, data);
	}

	/**
	 * @description 空间&&参数 GET order/bizroomareaattribute/getRoomTypeAndSpaceList
	 * */
	getRoomTypeAndSpaceList(data) {
		return $http.get(`order/bizroomareaattribute/getRoomTypeAndSpaceList`, data);
	}

	/**
	 * @description 空间&&参数 GET order/bizroomareaattribute/getRoomTypeAndSpaceList
	 * */
	selectSpaceParameterConfig(data) {
		return $http.get(`order/bizareaattributevalue/config/${data.projectId}`);
	}

	/**
	 * @description 空间参数值批量修改 POST order/bizroomareaattribute/batchUpdate
	 * */
	spaceBatchUpdate(data) {
		return $http.post(`order/bizroomareaattribute/batchUpdate`, data);
	}

	/**
	 * @description 新增基于工程-房屋参数值 POST order/bizroomareaattribute/save
	 * */
	saveHousingParameter(data) {
		return $http.post(`order/bizroomareaattribute/save`, data);
	}

	/**
	 * @description 修改房屋参数值
	 * */
	saveHousing(data) {
		return $http.post(`order/bizroombulid/save`, data);
	}


	/**
	 * @description 新增或修改户型-房屋参数值 POST order/bizroombulid/saveOrUpdate
	 * */
	saveOrUpdate(data) {
		return $http.post(`order/bizroombulid/saveOrUpdate`, data);
	}

	/**
	 * @description 保存自定义空间 POST order/bizroomareaattribute/custom/saveRoomAreaConfig
	 * */
	saveRoomAreaConfig(data) {
		return $http.post(`order/bizroomareaattribute/custom/saveRoomAreaConfig`, data);
	}

	/**
	 * @description 自定义空间参数值-批量新增 POST order/bizroomareaattribute/custom/batchSave
	 * */
	batchSaveConfig(data) {
		return $http.post(`order/bizroomareaattribute/custom/batchSave`, data);
	}

	/**
	 * @description 参数配置 GET order/bizroomareaattribute/roomAreaAttributeConfig/list
	 * */
	selectSpaceConfig(data) {
		return $http.get(`order/bizroomareaattribute/roomAreaAttributeConfig/list`, data);
	}


	/**
	 * @description 参数配置 GET order/bizroomareaattribute/deleteArea
	 * */
	deleteArea(data) {
		return $http.post(`order/bizroomareaattribute/deleteArea`, data);
	}



	/**
	 * @description 判断是否填写过量房信息 GET order/bizroomareaattribute/custom/checkExist
	 * */
	getCheckExist(data) {
		return $http.get(`order/bizroomareaattribute/custom/checkExist`, data);
	}



	/**
	 * @description 查询内部验收明细 GET order/bizorderacceptance/getInnerAcceptances
	 * */
	getInnerAcceptances(data) {
		return $http.get(`order/bizorderacceptance/getInnerAcceptances`, data);
	}

	/**
	 * @description 查询施工内容及流程(只针对服务商品) POST order/project/getPmsProductProcess
	 * */
	getPmsProductProcess(data) {
		return
		return $http.post(`order/project/getPmsProductProcess`, data);
	}

	/**
	 * @description 通知已读 POST order/order_disclose/readNotify/${data.notifyId}
	 * */
	readNotify(data) {
		return $http.post(`order/order_disclose/notify/read/${data.notifyId}`);
	}

	/**
	 * @description 节点关注-取消关注 POST order/biznodelike/setFocus
	 * */
	setFocus(data) {
		return $http.post(`order/biznodelike/setFocus`, data);
	}

	// 施工订单

	/**
	 * @description 按id查询 GET order/biz_order/one
	 * */
	getOrderDetails(data) {
		return $http.get(`order/biz_order/one`, data);
	}


	/**
	 * @description 拒绝订单（指派模式有效）
	 * */
	setReject(data) {
		return $http.post(`order/biz_order/reject`, {
			orderId: data.orderId,
			reason: data.reason
		});
	}

	/**
	 * @description 接受订单（指派模式有效）
	 * */
	setAccept(data) {
		return $http.post(`order/biz_order/accept?orderId=${data.orderId}`);
	}


	/**
	 * @description 获取已终止订单的预结算信息
	 * */
	getProjectCancelOrderInfo(data) {
		return $http.post(`order/project/getAssignCancelOrderInfo?orderId=${data.orderId}`);
	}

	/**
	 * @description 新增项目阶段收款记录表
	 * */
	sopReceiptRecordsSave(data) {
		return $http.post(`order/sopreceiptrecords/save`, data);
	}

	/**
	 * @description 单页查询
	 * */
	sopReceiptRecordsOnePage(data) {
		return $http.get(`order/sopreceiptrecords/onePage`, data);
	}

	/**
	 * @description 通过id查询收款记录
	 * */
	sopReceiptRecordsFindById(data) {
		return $http.get(`order/sopreceiptrecords/findById/${data.receiptId}`);
	}

	/**
	 * @description 收款记录查询
	 * */
	sopReceiptRecordsOneProjectDetails(data) {
		return $http.post(`order/sopreceiptrecords/oneProjectDetails/${data.projectId}`);
	}

	/**
	 * @description 完成收款记录
	 * */
	overReceipt(data) {
		return $http.get(`order/sopreceiptrecords/overReceipt/${data.nodeId}`);
	}

	/**
	 * @description 获取量房表单信息 GET
	 * */
	selectRoomGet(data) {
		return $http.get(`order/measure/room/get`, data);
	}

	/**
	 * @description 保存量房表单 POST
	 * */
	selectRoomSave(data) {
		return $http.post(`order/measure/room/save`, data);
	}

	/**
	 * @description 交底
	 * */
	orderDiscloseGet(data) {
		return $http.get(`order/order_disclose/get/${data.nodeId}`);
	}

	/**
	 * @description 根据企业Id获取问卷模板 GET
	 * */
	roomSurveyConfigCorpGet(data) {
		return $http.get(`order/room_survey_config/corp/get`, data);
	}


	/**
	 * @description 分页查询
	 * */
	getExecutePerson(data) {
		return $http.get(`order/project/projectNode/executePerson/list`, data);
	}

	/**
	 * @description 认证
	 * */
	getCertification(data) {
		return $http.get(`order/bidorder/checkSkill`, data);
	}

	/**
	 * @description 取消报价
	 * */
	getCancelOrderOffer(data) {
		return $http.post(`order/bidorder/personCancelOrder`, data);
	}

	/**
	 * @description 新增订单变更
	 * */
	saveChange(data) {
		return $http.post(`order/bizorderalteration/saveAlterationItem`, data);
	}
	/**
	 * @description 分页查询
	 * */
	selectChangeList(data) {
		return $http.get(`order/bizorderalteration/getPage`, data);

	}
	/**
	 * @description 变更明细处理
	 * */
	updateAlterationItem(data) {
		return $http.post(`order/bizorderalteration/updateAlteration`, data);
	}

	/**
	 * @description 获取详情
	 * */
	getUpdateAlterationItem(data) {
		return $http.get(`order/bizorderalteration/alterationById?id=${data.id}`);
	}


	orderAcceptanceSave(data) {
		return $http.post(`order/customer/bizorderacceptance/save`, data);
	}

	/**
	 * @description 根据用户Id集合及订单状态获取列表
	 * */
	getUseridsServing(data) {
		return $http.post(`order/biz_order/getUseridsServing`, data);
	}

	/**
	 * @description 提交验收
	 * */
	getsaveAcceptance(data) {
		return $http.post(`order/customer/bizorderacceptance/save`, data);
	}

	/**
	 * @description 通过id查询
	 * */
	saveAcceptanceById(data) {
		return $http.post(`order/bizorderacceptance/saveAcceptanceById`, data);
	}

	/**
	 * @description 根据用户Id集合及订单状态获取列表
	 * */
	getNodeStatistics(data) {
		return $http.get(`order/project/getNodeStatistics/${data.id}?skillId=${data.skillId}`);
	}


	/**
	 * @description 获取user指派工匠
	 * */
	getUserPerson(data) {
		return $http.get('order/capp/bizorderreply/getMyPerson', data);
	}


	/**
	 * @description 打卡
	 * */
	attendanceIng(data) {
		return $http.post('order/sopschedule/saveOrUpdate', data);
	}

	/**
	 * @description 获取打卡记录
	 * */
	getDkList(data) {
		return $http.get('order/sopschedule/list', data);
	}

	/**
	 * @description 获取打卡状态
	 * */
	getDkState(data) {
		return $http.get('order/sopschedulestatistics/page', data);
	}

	/**
	 * @description 提交施工记录
	 * */
	constructionSave(data) {
		return $http.post('order/construction_journal', data);
	}

	/**
	 * @description 获取施工记录
	 * */
	getConstructionRecord(data) {
		return $http.get('order/construction_journal/page/new', data);
	}

	/**
	 * @description 获取施工记录
	 * */
	getConstructionRecordNew(data) {
		return $http.get('order/construction_journal/page/new', data);
	}


	/**
	 * @description 通过orderId查询 服务日志
	 * */
	getConstructionLogs(data) {
		return $http.get(`order/construction_journal/byOrderId/${data.orderId}`);
	}


	/**
	 * @description C端-业主查看拒单记录
	 * */
	getOwnerGetByOrderId(data) {
		return $http.get(`order/bidorder/ownerGetByOrderId`, data);
	}


	/**
	 * @description 获取风险项列表，
	 * */
	getOrderRisk(data) {
		return $http.get(`order/biz_order/orderRisk/${data.id}`);
	}

	/**
	 * @description 添加待确认风险项，
	 * */

	addRisk(data) {
		return $http.post(`order/biz_order/addRisk`, data);
	}

	/**
	 * @description 催付
	 * */
	getDunning(data) {
		return $http.post(`order/biz_order/dunning`, data);
	}


	/**
	 * @description 发布需求
	 * */
	releaseDemand(data) {
		return $http.post('order/bizdemandconsultation/create', data);
	}

	/**
	 * @description 分页查询需求
	 * */
	getDemandPage(data) {
		return $http.get('order/bizdemandconsultation/getPage', data);
	}

	/**
	 * @description id查询需求详情
	 * */
	demandQureyById(data) {
		return $http.get(`order/bizdemandconsultation/queryById/${data}`);
	}

	/**
	 * @description 取消需求
	 * */
	demandCancel(data) {
		return $http.post('order/bizdemandconsultation/cancel', data);
	}

	/**
	 * @description 确认需求
	 * */
	demandConfirm(data) {
		return $http.get(`order/bizdemandconsultation/doneById/${data}`);
	}

	/**
	 * @description 查询我发布的
	 * */
	getMineReleasePage(data) {
		return $http.get('order/bizdemandconsultation/myPage', data);
	}

	/**
	 * @description 编辑需求
	 * */
	editDemand(data) {
		return $http.post('order/bizdemandconsultation/edit', data);
	}

	/**
	 * @description 达成合作需求咨询
	 * */
	cooperationInquiry(data) {
		return $http.post(`order/bizdemandconsultation/cooperation`, data);
	}

	/**
	 * @description 洽谈需求咨询
	 * */
	cooperationTalk(data) {
		return $http.post(`order/bizdemandconsultation/consult`, data);
	}

	/**
	 * @description 洽谈分页查询
	 * */
	negotiationPage(data) {
		return $http.get(`order/bizdemandconsultation/getLogPage`, data);
	}




	/**
	 * @description 项目SOP节点结束 （手动结束）
	 * */
	setProjectNodeComplete(data) {
		return $http.post(`order/project/projectNode/complete`, data);
	}

	/**
	 * @description 项目SOP节点开始（手动开始）
	 * */
	setProjectNodeStart(data) {
		return $http.post(`order/project/projectNode/start`, data);
	}



	/**
	 * @description 获取节点审查列表
	 * */
	getReviewList(data) {
		return $http.get(`order/project/projectNode/review/get/${data.nodeId}`);
	}

	/**
	 * @description 节点审查
	 * */
	setReview(data) {
		return $http.post(`order/project/projectNode/review`, data);
	}

	/**
	 * @description 获取节点审查人员列表
	 * */
	getReviewerList(data) {
		return $http.get(`order/project/projectNode/reviewer/get/${data.nodeId}`);
	}

	/**
	 * @description 节点催促审查
	 * */
	setUrgeReview(data) {
		return $http.post(`order/project/projectNode/urgeReview?reviewId=${data.reviewId}`);
	}


	/**
	 * @description 通过节点id计算需要催收金额
	 * */
	paymentOnlineMoney(data) {
		return $http.get(`order/sopreceiptrecords/paymentOnlineMoney/${data.nodeId}`);
	}

	/**
	 * @description 通过节点id计算需要催收金额
	 * */
	paymentDunning(data) {
		return $http.get(`order/sopreceiptrecords/dunning`, data);
	}


	/**
	 * @description 批量保存量房空间名称
	 * */
	saveForOffer(data) {
		return $http.post('order/bizroombulid/saveForOffer', data);
	}

	/**
	 * @description 基于竞价id查询组合报价
	 * */
	groupPriceByOfferId(data) {
		return $http.get(`order/bizordergroupprice/groupPriceByOfferId/${data.offerId}`);
	}

	/**
	 * @description 基于竞价id新增组合报价
	 * */
	addGroupPriceByOfferId(data) {
		return $http.post(`order/bizordergroupprice/addGroupPriceByOfferId`, data);
	}

	/**
	 * @description 查询企业下已配置的需求类型
	 * */
	enbaledTypeList(data) {
		return $http.get(`order/requirementconfig/enbaledTypeList/${data.companyId}`);
	}



	/**
	 * @description 获取项目报价的服务项目清单
	 * */
	getProjectGroupPriceList(data) {
		return $http.get(`order/project/groupPriceList/${data.projectId}`);
	}


	/**
	 * @description 保存报价
	 * */
	createGroupPrice(data) {
		return $http.post(`order/project/createGroupPrice`, data);
	}

	/**
	 * @description 获取项目预算类的报价清单
	 * */
	getGroupPriceByProject(data) {
		return $http.get(`order/project/getGroupPriceByProject/${data.projectId}`);
	}

	/**
	 * @description 费用类型-根据条件查询
	 * */
	typeByCondition(data) {
		return $http.get(`order/bizordergroupprice/typeByCondition`, data);
	}

	/**
	 * @description  基于项目id保存预算报价
	 * */
	saveCreateGroupPrice(data) {
		return $http.post(`order/bizordergroupprice/createGroupPrice`, data);
	}



	/**
	 * @description  根据竞价id设置是否需要补齐费用(isDiff =1 是，0否)
	 * */
	putIsDiff(data) {
		return $http.post(`order/bidorder/putIsDiff?offerId=${data.offerId}&isDiff=${data.isDiff}`);
	}

	/**
	 * @description  根据竞价id设置是否需要补齐费用(isDiff =1 是，0否)
	 * */
	getIsDiff(data) {
		return $http.get(`order/bidorder/getIsDiff/${data.offerId}`);
	}


	/**
	 * @description  根据项目id和岗位ID生成发单方组价报价
	 * */
	createPublisherGroupPrice(data) {
		return $http.get(`order/project/createPublisherGroupPrice`, data);
	}



	/**
	 * @description  根据订单id查询日志记录
	 * */
	getOrderLogByOrderId(data) {
		return $http.get(`order/bidorder/getOrderLogByOrderId`, data);
	}



	/**
	 * @description  保险套餐列表
	 * */
	getInsuranceSetmealList(data) {
		return $http.get(`order/insurancesetmeal/getInsuranceSetmealList`, data);
	}

	/**
	 * @description  投保下单
	 * */
	saveInsuranceSetmealOrder(data) {
		return $http.post(`order/insurancesetmealorder/saveInsuranceSetmealOrder`, data);
	}

	/**
	 * @description  获取投保记录
	 * */
	getInsuranceSetmealOrderList(data) {
		return $http.get(`order/insurancesetmealorder/getInsuranceSetmealOrderList`, data);
	}

	/**
	 * @description  获取投保记录详情
	 * */
	getInsuranceSetmealOrderDetails(data) {
		return $http.get(`order/insurancesetmealorder/getInsuranceSetmealOrderDetails`, data);
	}

	/**
	 * @description  获取单个用户保单信息
	 * */
	getUserOrderDetails(data) {
		return $http.get(`order/insurancesetmealorder/getUserOrderDetails`, data);
	}

	/**
	 * @description  用户申请退款
	 * */
	applyRefundOrder(data) {
		return $http.post(`order/insurancesetmealorder/applyRefundOrder`, data);
	}


	/**
	 * @description  保险订单支付
	 * */
	insurancePay(data) {
		return $http.post(`order/insurancesetmealorder/pay`, data);
	}



	/**
	 * @description  获取质保金账户信息
	 * */
	retentionAccount(data) {
		return $http.post(`order/customer/pay/retentionAccount`, data);
	}

	/**
	 * @description  获取质保金账户流水
	 * */
	getMyRetentionRecords(data) {
		return $http.post(`order/customer/pay/getMyRetentionRecords?status=${data.status}&size=${data.size}`);
	}

	/**
	 * @description  质保金充值支付
	 * */
	retention(data) {
		return $http.post(`order/customer/pay/retention`, data);
	}

	/**
	 * @description  用户申请质保金退款
	 * */
	userApplyWithdraw(data) {
		return $http.post(`order/customer/pay/retention/userApplyWithdraw`, data);
	}

	/**
	 * @description  项目数
	 * */
	getProjectNum(data) {
		return $http.get(`order/project/getProjectNum/${data.userId}`);
	}


	/**
	 * @description  批量查询模板信息
	 * */
	getCompanyMaterialTemplateListByIds(data) {
		return $http.get(`order/bizordermaterialtemplate/getCityOperatorMaterialTemplateListByIds`, data);
	}


	/**
	 * @description  开单模板下的材料列表
	 * */
	getOrderMaterialTemplateItems(data) {
		return $http.post(`order/bizordermaterialtemplateitem/getOrderMaterialTemplateItems`, data);
	}

	/**
	 * @description  开单模板下的材料列表
	 * */
	getMaterialTemplateByCompanyId(data) {
		return $http.get(
			`order/bizordermaterialtemplate/getMaterialTemplateByCityOperatorId?cityOperatorId=${data.cityOperatorId}`
		);
	}



	/**
	 * @description  根据竞价id添加沟通记录
	 * */
	addCommunicationByOffer(data) {
		return $http.post(`order/biz_order/addCommunicationByOffer`, data);
	}



	/**
	 * @description  新增模拟报价 
	 * */
	addMulationQuote(data) {
		return $http.post(`order/bizsimulationquote/add`, data);
	}

	/**
	 * @description  分页查询 
	 * */
	mulationQuotePage(data) {
		return $http.get(`order/bizsimulationquote/myPage`, data);
	}

	/**
	 * @description  查询详情 
	 * */
	mulationQuoteDetails(data) {
		return $http.get(`order/bizsimulationquote/queryInfo/${data.id}`);
	}

	/**
	 * @description  创建我的报价 
	 * */
	addOrderGroupPrice(data) {
		return $http.post(`order/bizordergroupprice/add`, data);
	}


	/**
	 * @description  删除我的模拟报价 
	 * */
	deleteMulationQuote(data) {
		return $http.post(`order/bizsimulationquote/delById?id=${data.id}`);
	}

	/**
	 * @description  复制我的模拟报价 
	 * */
	copyMulationQuote(data) {
		return $http.post(`order/bizsimulationquote/copyById?id=${data.id}`);
	}

	/**
	 * @description  分享我的模拟报价 
	 * */
	shareById(data) {
		return $http.post(`order/bizsimulationquote/shareById?id=${data.id}&sourceName=${data.sourceName}`);
	}

	/**
	 * @description  新增待办开工交底 
	 * */
	todoDiscloseSave(data) {
		return $http.post(`order/order_disclose/todo/disclose/save`, data);
	}

	/**
	 * @description  删除待办开工交底 
	 * */
	todoDiscloseDelete(data) {
		return $http.post(`order/order_disclose/todo/disclose/delete?todoId=${data.id}`);
	}

	/**
	 * @description  获取待办开工交底 
	 * */
	todoDiscloseList(data) {
		return $http.post(`order/order_disclose/todo/disclose/list`, data);
	}

	/**
	 * @description  完成交底待办 
	 * */
	todoDiscloseHandle(data) {
		return $http.post(`order/order_disclose/todo/disclose/handle?todoId=${data.todoId}`, data);
	}

	/**
	 * @description  交底待办催办 
	 * */
	todoDisclosePending(data) {
		return $http.post(`order/order_disclose/todo/disclose/pending`, data);
	}

	/**
	 * @description  交底待办催办记录 
	 * */
	todoDisclosePendingLogs(data) {
		return $http.post(`order/order_disclose/todo/disclose/pending/logs`, data);
	}


	/**
	 * @description  交底待办催办记录 
	 * */
	todoDisclosePendingLogs(data) {
		return $http.get(`order/order_disclose/todo/disclose/pending/logs`, data);
	}

	/**
	 * @description  居于快速预算id生成订单预览 
	 * */
	getUpdateBySkus(data) {
		return $http.post(`order/bizsimulationquote/updateBySkus`, data);
	}

	/**
	 * @description 撤销开工-完工 
	 * */
	revokeWork(data) {
		return $http.post(`order/sopConstruction/revokeWork`, data);
	}


	/**
	 * @description 撤销开工-完工 
	 * */
	selfGroupTask(data) {
		return $http.get(`order/biz_order/selfGroupTask`, data);
	}


	/**
	 * @description 添加协作订单
	 * */
	outsourcingAdd(data) {
		return $http.post(`order/biz_order/outsourcing/add `, data);
	}


	/**
	 * @description 接受协作订单
	 * */
	outsourcingAccept(data) {
		return $http.post(`order/biz_order/outsourcing/accept/${data.orderId} `);
	}

	/**
	 * @description 查询协作订单
	 * */
	outsourcingPage(data) {
		return $http.get(`order/biz_order/outsourcing/page`, data);
	}

	/**
	 * @description 查询协作订单 通过nodeId查询任务验收管理列表
	 * */
	outsourcingDetails(data) {
		return $http.get(`order/biz_order/outsourcing/get/${data.id}`);
	}


	getAcceptanceTemplate(data) {
		return $http.get(`order/bizorderacceptance/getAcceptanceTemplate/${data}`);
	}

	/**
	 * @description  通过nodeId查询任务验收管理列表
	 * */
	getAcceptancesByTaskId(data) {
		return $http.get(`order/bizorderacceptance/getAcceptancesByTaskId/${data}`);
	}

	/**
	 * @description  
	 * */
	getAcceptanceNotify(data) {
		return $http.get(`order/bizorderacceptance/getAcceptanceNotify/${data}`);
	}

	/**
	 * @description  新增验收管理
	 * */
	saveAcceptance(data) {
		return $http.post(`order/bizorderacceptance/saveAcceptance`, data);
	}


	/**
	 * @description 客户-修改验收状态
	 * */
	editStatus(data) {
		return $http.post(`order/customer/bizorderacceptance/editStatus`, data);
	}

	/**
	 * @description 执行验收外协订单
	 * */
	execAcceptance(data) {
		return $http.post(`order/biz_order/outsourcing/execAcceptance`, data);
	}


	/**
	 * @description 分页查询 申请、申述 GET order/bizapply/list
	 * */
	getBizapplyPage(data) {
		return $http.get(`order/bizapply/list`, data);
	}
	/**
	 * @description 师傅取消报价 
	 * */
	personCancelOrderOffer(data) {
		return $http.post(`order/bidorder/personCancelOrderOffer`, data);
	}


	/**
	 * @description 新增申请、申述 POST order/bizapply/create
	 * */
	getBizapplyCreate(data) {
		return $http.post(`order/bizapply/create`, data);
	}

	/**
	 * @description 查询 申请、申述详情 GET order/bizapply/${data.id}
	 * */
	getApplyDetails(data) {
		return $http.get(`order/bizapply/${data.id}`);
	}

	/**
	 * @description 审批 POST order/bizapply/update
	 * */
	applyUpdate(data) {
		return $http.post(`order/bizapply/update`, data);
	}


	/**
	 * @description 添加变更
	 * */
	addChange(data) {
		return $http.post(`order/projectalterationrecord/add`, data);
	}


	/**
	 * @description 查询与我相关的项目变更
	 * */
	getMyPageChange(data) {
		return $http.get(`order/projectalterationrecord/myQuery`, data);
	}

	/**
	 * @description 详情查询
	 * */
	getMyPageChangeDetails(data) {
		return $http.get(`order/projectalterationrecord/queryById/${data.id}`);
	}

	/**
	 * @description 审核变更
	 * */
	getVerify(data) {
		return $http.post(`order/projectalterationrecord/verify`, data);
	}


	/**
	 * @description 根据id获取单个节点审查
	 * */
	getReviewView(data) {
		return $http.get(`order/project/projectNode/review/view/${data.id}`);
	}


	/**
	 * @description 撤销验收
	 * */
	revokeAcceptance(data) {
		return $http.post(`order/bizorderacceptance/revokeAcceptance/${data.acceptanceId}`);
	}

	/**
	 * @description 获取项目列表带节点信息
	 * */
	getProjectListWithNodeInfo(data) {
		return $http.get(`order/project/getProjectListWithNodeInfo`, data);
	}
	
	/**
	 * @description 根据条件及sku输入创建组合报价（仅计算sku价格<无补齐费，无运费，无安装费>）
	 * */
	addByCondition(data) {
		return $http.post(`order/bizordergroupprice/addByCondition`, data);
	}
	
	/**
	 * @description 
	 * */
	constructionPlan(data) {
		return $http.get(`order/project/constructionPlan`, data);
	}
	
	/**
	 * @description 
	 * */
	sopGroup(data) {
		return $http.get(`order/bizproject/detail/sop/group`, data);
	}
	
	/**
	 * @description 
	 * */
	selfTask(data) {
		return $http.get(`order/biz_order/selfTask`, data);
	}
	
	/**
	 * @description 
	 * */
	downloadBudgetExcel(data) {
		return $http.get(`order/bizsimulationquote/downloadBudgetExcel/${data.id}`);
	}
	
	/**
	 * @description 
	 * */
	omsOrderPayPending(data) {
		return $http.post(`order/bizpending/omsOrderPayPending?orderId=${data.orderId}`);
	}
	
	
	
}
