import { App } from 'vue'
import { createStore } from 'vuex'
import form from './modules/form'

const store = createStore({
  modules: { form }
})

export function setupStore(app: App<Element>) {
  app.use(store)
}

export default store
