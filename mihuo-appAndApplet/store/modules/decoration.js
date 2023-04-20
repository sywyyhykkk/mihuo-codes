export const state = {
	curIndex: 0,   //当前索引
	curColor: "#262626",   //当前颜色
};
export const mutations = {
	setCurIndex(state, data) {
		state.curIndex = data;
	},
	setCurColor(state, data) {
		state.curColor = data;
	},
};
