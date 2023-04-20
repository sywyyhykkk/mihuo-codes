export const state = {
	serviceGoodsList: [], // 组合报价
	serviceCityOperatorId:'', // 订单所属公司id
	offerDetails:{},
	shoppingCart:[],
	skuIdList:[],
	createGroupPrice:{},
	groupByOfferCost:[],// 组合报价人工费
	groupByOfferMaterial:[],// 组合报价材料费
	// serviceSkillType:'',// 订单所属工种
};

export const mutations = {
	setServiceGoodsList(state, data) {
		state.serviceGoodsList = data;
	},
	setServiceCityOperatorId(state, data) {
		state.serviceCityOperatorId = data;
	},
	seOfferDetails(state, data) {
		state.offerDetails = data;
	},
	setGroupByOfferCost(state, data) {
		state.groupByOfferCost = data;
	},
	setGroupByOfferMaterial(state, data) {
		state.groupByOfferMaterial = data;
	},
	setShoppingCart(state, data) {
		state.shoppingCart = data;
	},
	setSkuIdList(state, data) {
		state.skuIdList = data;
	},
	setCreateGroupPrice(state, data) {
		state.createGroupPrice = data;
	},
	// setServiceSkillType(state, data) {
	// 	state.serviceSkillType = data;
	// },
}
export const actions = {

};
