import $http from '@/config/requestConfig'
import store from '@/store';

export default class MallApi {
	/**
	 * @description 提交反馈 mall/pmsfeedback/save
	 */
	addFeedback(data) {
		return $http.post('mall/pmsfeedback/save', data);
	}
	
	/**
	 * @description 获取内容素材分类 GET mall/cms_content_type/customer/page
	 */
	getCMSType(data) {
		return $http.get('mall/cms_content_type/customer/page', data);
	}
	
	/**
	 * @description 获取内容素材 GET mall/cms_content_manager/customer/page
	 */
	getCMSContent(data) {
		return $http.get('mall/cms_content_manager/customer/page', data);
	}
	
	/**
	 * @description 根据ID获取内容素材 GET mall/cms_content_manager/customer
	 */
	getCMSContentById(data) {
		return $http.get('mall/cms_content_manager/customer', data);
	}
	
	/**
	 * @description 商品分页查询
	 */
	selectCustomerPage(data) {
		return $http.get(`mall/product/customer/page`, data);
	}
	
	
	/**
	 * @description 商品下单页 GET mall/product/customer/overview
	 */
	selectProductDetails(data) {
		return $http.get('mall/product/customer/overview', data);
	}
	
	/**
	 * @description 服务端查看商品信息 GET mall/product/customer/info
	 */
	selectProductDetailsNew(data) {
		return $http.get('mall/product/customer/info', data);
	}
	
	/**
	 * @description 商品详情页 GET mall/product/customer/info
	 * */
	getCustomerDetail(data) {
		return $http.get(`mall/product/customer/info`, data);
	}
	
	/**
	 * @description 材料验收，安装数据获取 GET mall/order/getOrderItemOperateLog/${id}
	 * */
	getMaterialProcess(id) {
		return $http.get(`mall/order/getOrderItemOperateLog/${id}`);
	}
	
	/**
	 * @description 根据ID获取订单详情 GET mall/order/supplierOrderdetail?currentCompanyId=${currentCompanyId}&orderId=${id}
	 * */
	getMaterialDetail(currentCompanyId, id) {
		return $http.get(`mall/order/supplierOrderdetail?currentCompanyId=${currentCompanyId}&orderId=${id}`);
	}
	
	/**
	 * @description 材料验收，安装录入 POST mall/order/saveOrdermOperate
	 * */
	saveMaterialProcess(data) {
		return $http.post(`mall/order/saveOrdermOperate`, data);
	}
	
	/**
	 * @description 添加商品到购物车 POST mall/cart/add
	 * */
	saveCartAdd(data) {
		return $http.post(`mall/cart/add`, data);
	}
	
	/**
	 * @description B端-获取当前项目的购物车列表 GET mall/cart/getByProjectId
	 * */
	selectCartList(data) {
		return $http.get(`mall/cart/getByProjectId`, data);
	}
	
	/**
	 * @description B端-下单 POST mall/order/updateSupplierOrder
	 * */
	updateSupplierOrder(data) {
		data['currSkillName'] = store.state.userPersonInfo.skillName // 操作岗位
		data['currPersonName'] = store.state.userPersonInfo.name // 操作岗位
		data['currCompanyId'] = store.state.userPersonInfo.companyId // 操作岗位
		return $http.post(`mall/order/updateSupplierOrder`, data);
	}
	
	/**
	 * @description 服务端app-根据选材信息生成订单 POST mall/order/createMaterialOrder
	 * */
	createMaterialOrder(data) {
		return $http.post(`mall/order/createMaterialOrder`, data);
	}
	
	/**
	 * @description 修改购物车中某个商品的数量 POST mall/cart/quantity
	 * */
	editCartQuantity(data) {
		return $http.post(`mall/cart/quantity`, data);
	}
	
	/**
	 * @description 清空购物车 GET mall/cart/clear
	 * */
	cartClear(data) {
		return $http.get(`mall/cart/clear`, data);
	}
	
	/**
	 * @description 批量修改购物车中某个商品的数量 POST mall/cart/updateBatchQuantity
	 * */
	updateBatchQuantity(data) {
		return $http.post(`mall/cart/updateBatchQuantity`, data);
	}
	
	/**
	 * @description 批量修改购物车中某个商品的数量 POST mall/cart/delete
	 * */
	cartDelete(data) {
		return $http.post(`mall/cart/delete`, data);
	}
	
	/**
	 * @description 服务端app-根据projectId获取订单明细 GET mall/order/getSelfOrderItemList
	 * */
	getSelfOrderItemList(data) {
		return $http.get(`mall/order/getSelfOrderItemList`, data);
	}
	
	/**
	 * @description 服务端app-订单明细-测量 POST mall/order/setOrderItemMeasureFlag
	 * */
	setOrderItemMeasureFlag(data) {
		return $http.post(`mall/order/setOrderItemMeasureFlag`, data);
	}
	
	/**
	 * @description 企业商品分类 GET mall/customer/productcategory/category
	 * */
	productCategory(data) {
		return $http.get(`mall/customer/productcategory/category`, data);
	}
	
	/**
	 * @description 新增、编辑自定义服务
	 * */
	addCustomService(data) {
		return $http.post(`mall/pmscustomservicepack`, data);
	}
	
	/**
	 * @description 个人分页查询
	 * */
	selectCustomService(data) {
		return $http.get(`mall/pmscustomservicepack/getPage`, data);
	}
	
	
	/**
	 * @description 查询平台分类
	 * */
	getListByTreeCodeTree(data) {
		return $http.get(`mall/customer/platformcategory/tree`, data);
	}
	
	
	/**
	 * @description 查询常用商品
	 * */
	selectCommonlyUser(data) {
		return $http.post(`mall/product/customer/getList`, data);
	}
	
	/**
	 * @description 根据商品id集合获取验收标准
	 * */
	getProductAcceptanceList(data) {
		return $http.get(`mall/product/customer/getProductAcceptanceList`, data);
	}
	
	/**
	 * @description 获取分类树，
	 * */
	getCategoryTree(data) {
		return $http.get('mall/customer/pmscategorycontent/categoryTree', data);
	}
	
	/**
	 * @description 开单统计
	 * */
	getAllAmount(data) {
		return $http.get(`mall/order/getAllAmount`, data);
	}
	
	/**
	 * @description  合并支付订单
	 * */
	carOrderPay(data) {
		return $http.post(`mall/order/carOrderPay`, data);
	}
	
	
	
	/**
	 * @description  根据skus批量生成确认单
	 * */
	confirmOrderBySkus(data) {
		return $http.post(`mall/order/confirmOrderBySkus`, data);
	}
	
	/**
	 * @description  根据skus批量生成确认单
	 * */
	submitStorePreview(data) {
		return $http.post(`mall/order/submitStorePreview/${data.isDiff}`, data.list);
	}
	
	
	/**
	 * @description  (C端)按状态分页获取用户订单列表
	 * */
	selectMallOrderPage(data) {
		return $http.get(`mall/order/page`, data);
	}
	
	/**
	 * @description  根据ID获取订单详情
	 * */
	selectOrderDetails() {
		return $http.get(`mall/order/detail/${data.orderId}`);
	}
	
	
	/**
	 * @description  
	 * */
	saveOrderBySkus(data) {
		return $http.post(`mall/order/saveOrderBySkus`, data);
	}
	
	/**
	 * @description  B端-根据ID获取订单详情
	 * */
	supplierOrderdetail(data) {
		return $http.get(`mall/order/detail/${data.orderId}`);
	}
	
	/**
	 * @description  下单-批量下单
	 * */
	saveStoreOrder(data) {
		return $http.post(`mall/order/saveStoreOrder/${data.isDiff}`, data.list);
	}
	
	/**
	 * @description  根据ID获取订单状态
	 * */
	statusByOrder(data) {
		return $http.get(`mall/order/statusByOrder/${data.orderId}`);
	}
	
	/**
	 * @description  根据ids批量获取订单详情
	 * */
	detailByOrderIds(data) {
		return $http.post(`mall/order/detailByOrderIds`, data);
	}
	
	/**
	 * @description  标准商品订单生成
	 * */
	standardGenerateOrder(data) {
		return $http.post(`mall/order/standardGenerateOrder`, data);
	}
	
	/**
	 * @description 标准商品订单提交
	 * */
	standardOrderSave(data) {
		return $http.post(`mall/order/standardOrderSave`, data);
	}
	
	/**
	 * @description  已登录用户查询我的觅活小店
	 * */
	myShop(data) {
		return $http.get(`mall/pmsshop/myShop`, data);
	}
	
	/**
	 * @description  添加觅活小店
	 * */
	addMyShop(data) {
		return $http.post(`mall/pmsshop/add`, data);
	}
	
	
	/**
	 * @description  修改觅活小店区域
	 * */
	updateReceiver(data) {
		return $http.post(`mall/pmsshop/updateReceiver`, data);
	}
	
	
	/**
	 * @description  修改觅活小店个人简介
	 * */
	updateSummary(data) {
		return $http.post(`mall/pmsshop/updateSummary`, data);
	}
	
	/**
	 * @description  添加服务项目
	 * */
	serviceitemsAdd(data) {
		return $http.post(`mall/pmsserviceitems/add`, data);
	}
	
	/**
	 * @description  批量删除-B端 服务项目
	 * */
	deleteByIdsService(data) {
		return $http.post(`mall/pmsserviceitems/deleteByIds`, data);
	}
	
	/**
	 * @description  批量上下架-B端 服务项目
	 * */
	updateServiceByPublish(data) {
		return $http.post(`mall/pmsserviceitems/updateByPublish`, data);
	}
	
	/**
	 * @description  详情查询 服务项目
	 * */
	serviceDetails(data) {
		return $http.get(`mall/pmsserviceitems/queryById/${data.id}`);
	}
	
	/**
	 * @description  更新-B端
	 * */
	updateService(data) {
		return $http.post(`mall/pmsserviceitems/updateInfo`, data);
	}
	
	
	/**
	 * @description  分页查询-我的小店服务
	 * */
	myServicePage(data) {
		return $http.get(`mall/pmsserviceitems/myPage`, data);
	}
	
	
	/**
	 * @description  各状态数量查询服务
	 * */
	getServiceStatusNum(data) {
		return $http.get(`mall/pmsserviceitems/getStatusNum`, data);
	}
	
	
	/**
	 * @description 草稿状态更新-B端
	 * */
	updateByStatus(data) {
		return $http.post(`mall/pmsserviceitems/updateByStatus`, data);
	}
	
	/**
	 * @description  添加案例
	 * */
	saveCase(data) {
		return $http.post(`mall/smsworkcases/add`, data);
	}
	
	/**
	 * @description  批量删除案例
	 * */
	deleteByIdsCase(data) {
		return $http.post(`mall/smsworkcases/deleteByIds`, data);
	}
	
	/**
	 * @description  批量上下架-B端案例
	 * */
	updateCaseByPublish(data) {
		return $http.post(`mall/smsworkcases/updateByPublish`, data);
	}
	
	
	/**
	 * @description  批量发布案例
	 * */
	updateCaseByStatus(data) {
		return $http.post(`mall/smsworkcases/updateByStatus`, data);
	}
	
	/**
	 * @description  案例详情查询
	 * */
	caseDetails(data) {
		return $http.get(`mall/smsworkcases/queryById/${data.id}`);
	}
	
	/**
	 * @description  分页查询-我的小店案例
	 * */
	myCasePage(data) {
		return $http.get(`mall/smsworkcases/myPage`, data);
	}
	
	/**
	 * @description  更新-B端案例
	 * */
	updateCase(data) {
		return $http.post(`mall/smsworkcases/updateInfo`, data);
	}
	
	
	/**
	 * @description  作品数
	 * */
	caseNum(data) {
		return $http.get(`mall/smsworkcases/caseNum/${data.userId}`);
	}
	
	/**
	 * @description  收藏数
	 * */
	getLikeNum(data) {
		return $http.get(`mall/customer/case/getLikeNum/${data.userId}`);
	}
	
	
	/**
	 * @description  各状态数量查询案例
	 * */
	getCaseStatusNum(data) {
		return $http.get(`mall/smsworkcases/getStatusNum`, data);
	}
	
	
	/**
	 * @description  添加收货地址且返回地址信息 
	 * */
	addAddress(data) {
		return $http.post(`mall/member/address/addResult`, data);
	}
	
	
	/**
	 * @description  获取收货地址详情 
	 * */
	getItemAddress(data) {
		return $http.get(`mall/member/address/getItem/${data.id}`);
	}
	
	/**
	 * @description  居于快速预算id生成订单预览 
	 * */
	standardOrderGenerateForQuote(data) {
		return $http.post(`mall/order/standardOrderGenerateForQuote?quoteId=${data.id}`);
	}
	
	
	/**
	 * @description  根据项目id查询套餐商品订单子项
	 * */
	queryPackageOrderItems(data) {
		return $http.get(`mall/order/queryPackageOrderItems`,data);
	}
	
	/**
	 * @description  标准商品订单金额计算
	 * */
	standardOrderCalculateAmount(data) {
		return $http.post(`mall/order/standardOrderCalculateAmount`,data);
	}
	
}