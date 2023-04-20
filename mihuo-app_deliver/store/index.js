import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const files = require.context("./modules", false, /\.js$/);

// 数据持久化
// #ifdef H5 
// import createPersistedState from "@/static/js/vuexPersistedstate.js"
// const vuexPersisted = new createPersistedState({
//     storage: {
//     	getItem: key => uni.getStorageSync(key),
//         setItem: (key, value) => uni.setStorageSync(key, value),
//         removeItem: key => uni.removeStorageSync(key)
//     }
// })
// #endif

let modules = {
	state: {},
	mutations: {},
	actions: {},
	// #ifdef H5 
	// plugins:[vuexPersisted],
	// #endif
};

files.keys().forEach((key) => {
	Object.assign(modules.state, files(key)["state"]);
	Object.assign(modules.mutations, files(key)["mutations"]);
	Object.assign(modules.actions, files(key)["actions"]);
});

const store = new Vuex.Store(modules);
export default store;
