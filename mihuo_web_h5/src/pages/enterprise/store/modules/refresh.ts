interface States {
    allowRefresh:Boolean,
  }
  const state = {
    allowRefresh: false,//页面返回是否允许刷新
  }
  const getters = {
    getAllowRefresh: (state:States) => state.allowRefresh
  }
  const mutations = {
    setAllowRefresh(state:States, val:Boolean) {
      state.allowRefresh = val
    },
  }
  export default {
    namespaced: true,
    state,
    getters,
    mutations
  }
  