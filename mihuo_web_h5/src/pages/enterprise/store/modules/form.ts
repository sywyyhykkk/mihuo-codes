interface States {
  register:Boolean,
}
const state = {
  register: false,
}
const getters = {
  getRegister: (state:States) => state.register
}
const mutations = {
  setRegister(state:States, val:Boolean) {
    state.register = val
  },
}
export default {
  namespaced: true,
  state,
  getters,
  mutations
}
