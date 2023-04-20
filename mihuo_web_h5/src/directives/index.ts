import type { App } from 'vue'

import { clipboard } from './clipboard'
import { defaultTagDel } from './tagsDel'

export function setupDirectives(app: App) {
  app.directive('clipboard', clipboard)
  app.directive('defaultTagDel', defaultTagDel)
}
