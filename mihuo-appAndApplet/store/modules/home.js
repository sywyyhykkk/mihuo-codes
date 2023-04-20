export const state = {
    caseCacheList: [],   //案例
    mallCacheList: [],   //推荐商品
    miyouCacheList: [],   //密友圈
};
export const mutations = {
    setCaseList(state, data) {
		state.caseCacheList = data;
	},
    setMallList(state, data) {
		state.mallCacheList = data;
	},
    setMiyouList(state, data) {
		state.miyouCacheList = data;
	},
};
export const actions = {
  
};
