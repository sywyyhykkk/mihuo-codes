export const state = {
	// 选择材料数据
	materialParameter:{}
};

export const mutations = {
	setMaterialParameter(state, data){
		if (data) {
			state.materialParameter = Object.assign({}, state.materialParameter, data);
			// uni.setStorageSync('materialParameter', state.materialParameter);
		}
	}
}

export const actions = {

};
