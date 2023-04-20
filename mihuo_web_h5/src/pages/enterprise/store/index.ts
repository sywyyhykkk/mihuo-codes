import { App } from 'vue'
import { createStore } from 'vuex'
import form from './modules/form'

const store = createStore({
  state:{
    registerAct:false,
    menuClick:false,
    ispPerfect:false
  },
  mutations:{
    registerAccount(state:any, val:Boolean) {
      state.registerAct = val
    },
    menuClick(state:any, val:Boolean) {
      state.menuClick = val
    },
    // 资金余额用于判断是否开户信息是否全部完善
    ispPerfect(state:any, val:Boolean) {
      state.ispPerfect = val
    },
  },
  modules: { form }
})

export function setupStore(app: App<Element>) {
  app.use(store)
}

export default store
