import $http from '@/config/requestConfig'

export default class MallApi {
	/**
	* @description 获取维修安装工
	*/
	defaultJobSkill() {
		return $http.get(`admin/sysjobskill/getDefaultJobSkill`)
	}
	
	/**
	* @description 秒杀订阅
	*/
	seckillSubscribe(id) {
		return $http.post(`mall/flashpromotion/subscribe?promotionProductRelationId=${id}`)
	}

	/**
	* @description 取消秒杀订阅
	*/
	seckillUnSubscribe(id) {
		return $http.post(`mall/flashpromotion/unSubscribe?promotionProductRelationId=${id}`)
	}
	/**
	* @description 查询我的秒杀订阅
	*/
	seckillMySubscribe() {
		return $http.get('mall/flashpromotion/queryMySubscriptions')
	}
	
	/**
	* @description 查询商品拼团信息 GET mall/flashpromotion/queryGroup
	*/
	getProductGroupList(data) {
		return $http.get('mall/flashpromotion/queryGroup', data)
	}
	
	/**
	* @description 分页获取秒杀、团购商品清单 GET mall/flashpromotion/queryFlashPromotion
	* @param type 类型 0=团购 1=秒杀
	*/
	getProductActivityPage(data) {
		return $http.get('mall/flashpromotion/queryFlashPromotion', data)
	}
	
	/**
	* @description 首页获取秒杀、团购商品清单 GET mall/flashpromotion/content
	*/
	getProductActivityList(data) {
		return $http.get('mall/flashpromotion/content', data)
	}
	
	/**
	 * @description 预付款退款 mall/order/ApplyPrepaymentRefund
	 */
	applyPrepaymentRefund(data) {
		return $http.post('mall/order/ApplyPrepaymentRefund', data);
	}
	
	/**
	* @description 根据已选商品获取可用优惠券 GET mall/coupon/listByProductIds
	*/
	getCouponByProducts(data) {
		return $http.get('mall/coupon/listByProductIds/' + data)
	}
	
	/**
	* @description 获取我的优惠券列表 GET mall/coupon/list
	*/
	getMyCouponList(data) {
		return $http.get('mall/coupon/list', data)
	}
	
	/**
	* @description 获取我的优惠券历史列表 GET mall/coupon/listHistory
	*/
	getMyCouponHistory(data) {
		return $http.get('mall/coupon/listHistory', data)
	}
	
	/**
	* @description 获取优惠券数量 GET mall/coupon/statistics
	*/
	getCouponCount(data) {
		return $http.get('mall/coupon/statistics', data)
	}
	
	/**
	 * @description @description 领取优惠券 POST mall/coupon/receive
	 */
	receiveCoupon(data) {
		return $http.post('mall/coupon/receive/' + data.id, data)
	}
	
	/**
	* @description 根据ID获取优惠券详情 GET mall/coupon/queryById
	*/
	getCouponById(data) {
		return $http.get('mall/coupon/queryById/' + data.id)
	}
	
	/**
	* @description 获取可领取的优惠券 GET mall/coupon/mainViewList
	*/
	getAvailableCoupon(data) {
		return $http.get('mall/coupon/mainViewList', data)
	}
	
	/**
	* @description 获取预付款记录 GET mall/order/getPrepaymentRecords
	*/
	getPrepaymentRecord(data) {
		return $http.get('mall/order/getPrepaymentRecords', data)
	}

	/**
	 * @description @description 评价商品 POST mall/omsorderreply/save	
	 */
	addProductComment(data) {
		return $http.post('mall/omsorderreply/save', data)
	}

	/**
	* @description 获取商品评价回复 GET mall/omsorderreply/getReplies
	*/
	getCommentReplyById(data) {
		return $http.get('mall/omsorderreply/getReplies', data)
	}

	/**
	 * @description 获取商品评价 GET mall/omsorderreply/getComments
	 */
	getProductComments(data) {
		return $http.get('mall/omsorderreply/getComments', data)
	}
	
	/**
	 * @description 根据ID获取评价 POST mall/omsorderreply/getById
	 */
	getProductCommentsById(data) {
		return $http.post('mall/omsorderreply/getById?id=' + data)
	}
	

	/**
	 * @description 修改收货地址 POST mall/order/standardOrderGenerateForQuote
	 */
	getOrderConfirmPreview(id) {
		return $http.post('mall/order/standardOrderGenerateForQuote?quoteId=' + id)
	}

	/**
	 * @description 修改收货地址 POST mall/order/changeOrderAddress
	 */
	changeOrderAddress(data) {
		return $http.post('mall/order/changeOrderAddress', data);
	}

	/**
	 * @description 确认收货 GET mall/order/confirmReceiveOrder
	 */
	confirmReceiveOrder(data) {
		return $http.get('mall/order/confirmReceiveOrder/' + data);
	}

	/**
	 * @description 获取退款项分页 GET mall/order/refundItem/list
	 */
	getRefundOrder(data) {
		return $http.get('mall/order/refundItem/list', data);
	}

	/**
	 * @description 通过我的订单状态统计 GET mall/order/count
	 */
	getOrderStatusCount(data) {
		return $http.get('mall/order/count', data);
	}

	/**
	 * @description 根据订单ID查询商城订单 GET mall/order/detail
	 */
	getMallOrderDetailById(orderId) {
		return $http.get(`mall/order/detail/${orderId}`)
	}

	/**
	 * @description 生成支付订单 POST mall/order/carOrderPay
	 */
	payOrder(data) {
		return $http.post('mall/order/carOrderPay', data);
	}

	/**
	 * @description 批量取消商城订单 POST mall/order/batchCancelUserOrder
	 */
	cancelMallOrderBatch(data) {
		return $http.post(`mall/order/batchCancelUserOrder`, data)
	}
	
	/**
	 * @description 取消商城订单 POST mall/order/cancelUserOrder
	 */
	cancelMallOrder(id) {
		return $http.post(`mall/order/cancelUserOrder/${id}`)
	}

	/**
	 * @description 删除商城订单 GET mall/order/deleteOrder/{orderId}
	 */
	deleteMallOrder(data) {
		return $http.get(`mall/order/deleteOrder/${data}`);
	}

	/**
	 * @description 提交退款申请 POST mall/order/applyRefund
	 */
	applyRefund(data) {
		return $http.post('mall/order/applyRefund', data);
	}

	/**
	 * @description 获取我的评价 GET mall/omsorderreply/myReply
	 */
	getMyReply(data) {
		return $http.get('mall/omsorderreply/myReply', data);
	}

	/**
	 * @description 获取内容素材 GET mall/cms_content_manager/customer/page
	 */
	getCMSContent(data) {
		return $http.get('mall/cms_content_manager/customer/page', data);
	}

	/**
	 * @description cms 内容分类分页查询
	 */
	getCmsContentType(data) {
		return $http.get('mall/cms_content_type/customer/page', data);
	}

	/**
	 * @description 根据ID获取内容素材 GET mall/cms_content_manager/customer
	 */
	getCMSContentById(data) {
		return $http.get('mall/cms_content_manager/customer', data);
	}

	/**
	 * @description 获取收藏的商品 GET mall/product/customer/getMyLikeProduct
	 */
	getFavProduct(data) {
		return $http.get('mall/product/customer/getMyLikeProduct', data);
	}

	/**
	 * @description 获取收藏的工人 GET mall/customer/case/getLikePersonInfo
	 */
	getFavMaster() {
		return $http.get('mall/customer/case/caseLike/getLikePersonInfo');
	}

	/**
	 * @description 查询店铺所有商品 GET mall/product/page
	 */
	getAllCommodity(data) {
		return $http.get(`mall/product/page`, data);
	}

	/**
	 * @description 查询店铺所有品牌 GET mall/brand/getByCompanyId
	 */
	getAllBrand(data) {
		return $http.get('mall/brand/getByCompanyId', data);
	}

	/**
	 * @description 查询店铺所有分类 GET mall/customer/productcategory/category
	 */
	getAllCategory(data) {
		return $http.get('mall/customer/productcategory/category', data);
	}

	/**
	 * @description 首页获取设计案例、商品列表
	 */
	getCaseAndProject() {
		return $http.get('mall/home/caseAndProject');
	}

	/**
	 * @description 首页获取服务
	 */
	getServers() {
		return $http.get('mall/cms_content_type/customer');
	}

	/**
	 * @description 删除购物车商品 POST mall/cart/delete
	 */
	deleteShoppingCartItem(data) {
		return $http.post('mall/cart/delete', data)
	}

	/**
	 * @description 添加商品到购物车 POST mall/cart/add
	 */
	addItemToShoppingCart(data) {
		return $http.post('mall/cart/add', data)
	}

	/**
	 * @description 生成标准商品订单 POST mall/order/standardGenerateOrder
	 */
	generateMallOrder(data, isShowMessage = true) {
		return $http.post('mall/order/standardGenerateOrder', data, { header: { isShowMessage: isShowMessage }})
	}

	/**
	 * @description 计算标准商品订单金额 POST mall/order/standardOrderCalculateAmount
	 */
	calculateMallOrderAmount(data) {
		return $http.post('mall/order/standardOrderCalculateAmount', data)
	}

	/**
	 * @description 计算标准商品订单金额 POST mall/order/standardOrderSave
	 */
	submitMallOrder(data) {
		return $http.post('mall/order/standardOrderSave', data)
	}

	// --------------购物车页面--------------

	/**
	 * @description 获取购物车列表 GET mall/cart/list
	 */
	getShoppingCart(data) {
		return $http.get('mall/cart/list', data)
	}

	/**
	 * @description 根据商品id获取sku列表 GET mall/product/customer/getSkuStocks
	 */
	getSkuListByProductId(data) {
		return $http.post(`mall/product/customer/getSkuStocks?productId=${data}`, data)
	}

	/**
	 * @description 修改购物车商品数量 POST mall/cart/quantity
	 */
	editCartItemQuantity(data) {
		return $http.post('mall/cart/quantity', data)
	}

	/**
	 * @description 修改购物车商品规格 POST mall/cart/changeSku
	 */
	editCartItemSku(data) {
		return $http.post('mall/cart/changeSku', data)
	}

	// --------------分类页面--------------

	/**
	 * @description 获取商品列表
	 */
	getMallData(data) {
		return $http.get('mall/product/customer/getPage', data);
	}

	/**
	 * @description 获取推荐商品 GET mall/product/customer/recommend
	 * @param id 商品id
	 */
	getRecommendProduct(id) {
		return $http.get('mall/product/customer/recommend/' + id);
	}

	/**
	 * @description 搜索商品
	 */
	searchProductPage(data) {
		return $http.get('mall/product/customer/search', data);
	}

	/**
	 * @description 获取平台分类树
	 */
	getCategoryDataByTreeCode(data) {
		return $http.get('mall/customer/pmscategorycontent/categoryTree', data);
	}

	/**
	 * @description 获取三级分类树
	 */
	getThirdCategoryByTreeCode(data) {
		return $http.get('mall/product/customer/platform_category', data)
	}

	/**
	 * @description 根据分类ID获取分类内容页
	 */
	getCategoryContentPageById(data) {
		return $http.get(`mall/customer/pmscategorycontent/detail/${data.categoryId}`, data);
	}

	/**
	 * @description 根据treeCode获取热销推荐商品
	 */
	getHotSaleByTreeCode(data) {
		return $http.get('mall/product/customer/hotsale', data);
	}

	/**
	 * @description 根据treeCode获取品牌
	 */
	getBrandsByTreeCode(data) {
		return $http.get('mall/customer/brand/getPage', data);
	}

	/**
	 * @description 根据类型获取品牌
	 */
	getBrandsByDataType(data) {
		return $http.get('mall/product/customer/result/brand', data);
	}

	/**
	 * @description 获取品牌 参数: 1 = top10， 2 = 全部
	 */
	getBrands(type) {
		return $http.get(`mall/customer/brand/list/${type}`);
	}

	/**
	 * @description 设置为默认收货地址
	 */
	setDefaultPostAddress(id) {
		return $http.post(`mall/member/address/updateDefaultStatus/${id}`);
	}

	/**
	 * @description 获取收货地址
	 */
	getPostAddress() {
		return $http.get(`mall/member/address/list`);
	}

	/**
	 * @description 删除收货地址
	 */
	deletePostAddress(id) {
		return $http.get(`mall/member/address/delete/${id}`);
	}

	/**
	 * @description 新增收货地址
	 */
	addPostAddress(data) {
		return $http.post(`mall/member/address/add`, data);
	}

	/**
	 * @description 修改收货地址
	 */
	updatePostAddress(id, data) {
		return $http.post(`mall/member/address/update/${id}`, data);
	}

	/**
	 * @description 获取收获地址明细
	 */
	getAddressDetail(id) {
		return $http.get(`mall/member/address/getItem/${id}`);
	}

	/**
	 * @description  获取已评价用户商城订单和工人订单 POST mall/order/list
	 */
	getAllReplyOrder(data) {
		return $http.post('mall/order/reply/list', data);
	}

	/**
	 * @description  获取用户商城订单和工人订单 POST mall/order/list
	 */
	getAllOrder(data) {
		return $http.post('mall/order/list', data);
	}

	/**
	 * @description 设计案例列表查询
	 */
	getCasePage(data) {
		return $http.get('mall/customer/case/page', data);
	}

	/**
	 * @description 根据ID获取设计案例详情
	 */
	getCaseDetail(data) {
		return $http.get(`mall/customer/case/${data.id}`, data);
	}

	/**
	 * @description 生成订单前的检测 （是否可以下单）POST mall/order/productCheck
	 * */
	checkPlaceOrder(data) {
		return $http.post('mall/order/productCheck', data);
	}

	/**
	 * @description 获取开单记录
	 * */
	getBillList(data) {
		return $http.get('mall/order/getOrderInfoByAddressId', data);
	}

	/**
	 * @description 查询平台分类
	 * */
	getListByTreeCode(data) {
		return $http.get(`mall/customer/platformcategory/tree`, data);
	}
	
	/**
	 * @description 获取我的足迹 GET mall/pmstrail/page
	 * */
	getMyHistory(data) {
		return $http.get('mall/pmstrail/page', data);
	}

	// --------------商品详情页面--------------

	/**
	 * @description 添加足迹
	 * 参数1: dataId -> 商品id/案例id/工匠id
	 * 参数2: dataType -> 1:商品 2:案例 3:工匠
	 */
	addItemToHistory(data) {
		return $http.get('mall/pmstrail', data);
	}

	/**
	 * @description 获取购物车商品总数
	 */
	getShoppingCartCount() {
		return $http.get('mall/cart/getCount');
	}

	/**
	 * @description 获取商品是否已收藏 GET mall/product/customer/getLike
	 * 
	 */
	getCommodityIsHold(commodityId) {
		return $http.get(`mall/product/customer/getLike/${commodityId}`);
	}

	/**
	 * @description 查询商品配送时长 GET mall/freightTemplate/customer/days
	 * 
	 */
	getCommodityDeliveryTime(data) {
		return $http.get('mall/freightTemplate/customer/days', data)
	}

	/**
	 * @description 获取材料型商品运费
	 *  type=1 单个模版 type=2 多个模版
	 */
	getCommodityFreight(data, type) {
		let url = type === 1 ? 'mall/freightTemplate/customer/calculateFreight/single' :
			'mall/freightTemplate/customer/calculateFreight/list'
		return $http.post(url, data)
	}

	/**
	 * @description 获取材料型商品安装费
	 *  type=1 单个模版 type=2 多个模版
	 */
	getCommodityInstallation(data, type) {
		let url = type === 1 ? 'mall/freightTemplate/customer/calculateInstallation/single' :
			'mall/freightTemplate/customer/calculateInstallation/list'
		return $http.post(url, data)
	}

	/**
	 * @description 获取商品入户搬运费模版 GET mall/freightTemplate/customer/installation
	 */
	getCommodityInstallationTemplate(data) {
		return $http.get(`mall/freightTemplate/customer/installation?templateId=${data}`);
	}

	/**
	 * @description 获取商品运费模版 GET mall/freightTemplate/customer/freight
	 */
	getCommodityFreightTemplate(data) {
		return $http.get(`mall/freightTemplate/customer/freight?templateId=${data}`);
	}

	/**
	 * @description 获取商品基本信息
	 */
	getCommodityOverView(data) {
		return $http.get('mall/product/customer/overview', data);
	}

	/**
	 * @description 获取商品详细信息
	 */
	getCommodityDetail(data) {
		return $http.get('mall/product/customer/detail', data);
	}

	/**
	 * @description 收藏/点赞
	 * 参数1: id -> 商品id/案例id/工匠id
	 * 参数2: operation -> operation=1点赞, operation=2收藏, operation=3取消点赞, operation=4取消收藏, 商品收藏=5, 商品取消收藏=6
	 */
	addItemToFav(data) {
		return $http.post('mall/customer/case/setProjectCase', data);
	}

	/**
	 * @description 提交反馈 mall/pmsfeedback/save
	 */
	addFeedback(data) {
		return $http.post('mall/pmsfeedback/save', data);
	}

	/**
	 * @description 获取工人英雄排行榜
	 * 参数1: type -> 1=设计榜, 2=管家榜, 3=监理榜, 4=工人榜
	 */
	getRanking(type) {
		return $http.get(`mall/sms_worker_tiptop/customer/page`, type);
	}

	/**
	 * @description 根据ID删除我的家
	 * 参数 id
	 */
	delHomeById(id) {
		return $http.post(`mall/projecthome/delete/${id}`);
	}

	// --------------觅友圈--------------

	/**
	 * @description 新增觅友圈
	 */
	postNewMiYou(data) {
		return $http.post('mall/smsfindcircle/customer/publish', data)
	}

	/**
	 * @description 觅友圈分页
	 * 
	 */
	getMiYouList(data) {
		return $http.get('mall/smsfindcircle/customer/page', data)
	}

	/**
	 * @description 根据ID获取觅友圈
	 * @param 觅友圈id circleID
	 */
	getMiYouById(data) {
		return $http.get('mall/smsfindcircle/customer/info', data)
	}

	/**
	 * @description 根据ID获取觅友圈评论/评论回复
	 * @param 觅友圈id circleID
	 * @param 评论id commentId
	 */
	getMiyouComment(data) {
		return $http.post(
			`mall/smsfindcircle/customer/comment/page?size=${data.size || 5}&current=${data.current || 1}`, data
			)
	}
	
	/**
	 * @description 评论觅友圈
	 * @param
	 */
	commentMiYou(data) {
		return $http.post(`mall/smsfindcircle/customer/comment/publish`, data)
	}

	/**
	 * @description 觅友圈评论点赞
	 * @param commentId 评论id
	 */
	likeMiYouComment(commentId) {
		return $http.put(`mall/smsfindcircle/customer/comment/like?commentId=${commentId}`)
	}

	/**
	 * @description 觅友圈点赞
	 * @param circleId 觅友圈id
	 */
	likeMiYou(circleId) {
		return $http.put(`mall/smsfindcircle/customer/like?circleId=${circleId}`)
	}

	/**
	 * @description 觅友圈收藏
	 * @param circleId 觅友圈id
	 */
	collectMiYou(circleId) {
		return $http.put(`mall/smsfindcircle/customer/collect?circleId=${circleId}`)
	}

	/**
	 * @description 删除觅友圈评论
	 * @param id 觅友圈评论id
	 */
	deleteMiYouComment(id) {
		return $http.delete(`mall/smsfindcircle/customer/comment/remove?commentId=${id}`)
	}

	/**
	 * @description 获取觅友圈话题
	 * 
	 */
	getMiyouTag(data) {
		return $http.get('mall/smsfindcircle/customer/topic/recommend', data)
	}

	// --------------施工案例--------------

	/**
	 * @description 获取施工案例列表
	 * @param 纬度 latitude
	 * @param 经度 longitude
	 */
	getConstructionList(data) {
		return $http.get('mall/constructioncase/customer/page', data)
	}

	/**
	 * @description 获取施工案例列表(不需登录)
	 * 参数 纬度 latitude
	 * 参数 经度 longitude
	 */
	getAnonymityConstructionList(data) {
		return $http.get('mall/constructioncase/customer/anonymityPage', data)
	}

	/**
	 * @description 根据ID获取施工案例
	 * 参数 adcode 区域编码 如5301
	 * 参数 纬度 latitude
	 * 参数 经度 longitude
	 */
	getConstructionById(id) {
		return $http.get(`mall/constructioncase/customer/${id}`)
	}

	/**
	 * @description 根据ID获取施工日志
	 * 参数 caseId 案例id
	 */
	getConstructionLogByCaseId(data) {
		return $http.get(`mall/constructioncase/customer/journal`, data)
	}

	/**
	 * @description 根据ID点赞施工案例
	 * 参数 isLike 是否点赞 1点赞 0取消
	 * 参数 caseId 案例id
	 */
	likeConstructionById(data) {
		return $http.post(`mall/constructioncase/customer/case/like`, data)
	}

	/**
	 * @description 根据ID收藏施工案例
	 * 参数 isLike 是否收藏 1收藏 0取消
	 * 参数 caseId 案例id
	 */
	collectConstructionById(data) {
		return $http.post(`mall/constructioncase/customer/case/collect`, data)
	}

	/**
	 * @description 点赞施工日志
	 * 参数 isLike 是否点赞 1点赞 0取消
	 * 参数 journalId 日志id
	 */
	likeConstructionLogById(data) {
		return $http.post(`mall/constructioncase/customer/journal/like`, data)
	}

	/**
	 * @description 评论施工日志 POST mall/constructioncase/customer/journal/comment
	 * 参数 content 评论内容
	 * 参数 journalId 日志id
	 */
	commentConstructionLogById(data) {
		return $http.post(`mall/constructioncase/customer/journal/comment`, data)
	}

	/**
	 * @description 根据ID获取施工日志评论 GET mall/constructioncase/customer/journal/comments
	 * 参数 journalId 日志id
	 */
	getConstructionCommentById(data) {
		return $http.get(`mall/constructioncase/customer/journal/comments`, data)
	}

	/**
	 * @description 检查是否需要绑定手机号 POST mall/order/phoneCheck
	 */
	checkPhoneBeforePay() {
		return $http.post('mall/order/phoneCheck');
	}

	/**
	 * @description 根据工种获取服务项
	 */
	getSkillSku(data) {
		return $http.get('mall/product/customer/skill', data);
	}

	/**
	 * @description 获取当前运营区域下品牌列表
	 */
	getProductSift(data) {
		return $http.get('mall/customer/brand/listByTreeCode', data);
	}

	/**
	 * @description 获取当前运营区域下品牌列表并附带推荐商品
	 */
	getProductHot(data) {
		return $http.get('mall/customer/brand/listByWithProduct', data);
	}
}
