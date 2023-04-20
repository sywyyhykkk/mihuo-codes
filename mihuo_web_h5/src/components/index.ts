import type { App } from 'vue'
import SvgIcon from './SvgIcon/index.vue'// svg组件
import Dialog from './Dialog/index.vue'// Dialog组件
import ComTable from './Table/index.vue'// Table组件
//import ComSearch from './MySearch/index.vue'// Search组件
import ComDetail from './Detail/index.vue'// Detail组件
import BoxshowContainer from './BoxshowContainer/index.vue' // 悬停阴影组件
import '@/assets/icons' // 引入svg图标
import videoPlay from './videoPlay/index.vue'
import fileUpload from './fileUpload/index.vue'
import Chat from './IM/Chat/index.vue'
import SessionBar from './IM/SessionBar/index.vue'
import ChatEmpty from './IM/ChatEmpty/index.vue'
import RightList from './IM/RightList/index.vue'
import Header from './IM/Header/index.vue'
import SendMessage from './IM/SendMessage/index.vue'
import Icon from './IM/Icon/index.vue'
import SendFile from './IM/SendFile/index.vue'
import SessionItem from './IM/SessionItem/index.vue';
import UserItem from './IM/UserItem/index.vue';
import ChatList from './IM/ChatList/index.vue';
import ItemTalk from './IM/ItemTalk/index.vue';
import SystemTalk from './IM/SystemTalk/index.vue';
import MhImage from './MhImage/index.vue'
const components = [
  SessionBar,
  ChatEmpty,
  RightList,
  Header,
  SendMessage,
  Icon,
  SendFile,
  SessionItem,
  UserItem,
  ChatList,
  Chat,
  ItemTalk,
  SystemTalk,
  MhImage
]
export function setupGlobCom(app: App<Element>): void {
  app.component('ComDialog', Dialog)
  app.component('ComTable', ComTable)
  //app.component('ComSearch', ComSearch)
  app.component('ComDetail', ComDetail)
  app.component('SvgIcon', SvgIcon)
  app.component('BoxshowContainer', BoxshowContainer)
  app.component('videoPlay', videoPlay)
  app.component('fileUpload', fileUpload)
  app.component('Chat', Chat)
  const requireComponent = require.context(
    '@/components',
    true,
    /\.vue$/
  )
  let index = 0;
  requireComponent.keys().forEach((fileName) => {
    //console.log(requireComponent.keys())
    const miniName = fileName.split('/');
    const vueName = miniName[miniName.length - 1].split('.')[0];
    const componentConfig = requireComponent(fileName)
    index++
    //console.log((componentConfig.default.name || vueName) == "index")
    if ((componentConfig?.default.name || vueName) != "index") {
      app.component(componentConfig.default.name || vueName, componentConfig.default)
    }
  })
}
