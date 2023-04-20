<template>
  <div class="app-wrapper" style="position: relative">
    <Vue3DraggableResizable
      v-if="ImShow"
      :initW="1200"
      :initH="600"
      style="z-index: 99"
      :x="300"
      :y="10"
      w="800"
      h="400"
    >
      <div class="chat" style="width: 100%; height: 100%">
        <el-container style="height: 100%">
          <el-aside style="width: auto"><SessionBar /></el-aside>
          <el-container>
            <el-header style="padding: 0; height: auto"><Header /></el-header>
            <el-main style="padding: 0">
              <Chat />
            </el-main>
            <el-footer style="height: auto">
              <SendMessage />
            </el-footer>
          </el-container>
        </el-container>
      </div>
    </Vue3DraggableResizable>
    <component :is="layout" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  onMounted,
  getCurrentInstance
} from 'vue'
import Classic from './modules/Classic.vue'
import Top from './modules/Top.vue'
import LeftTop from './modules/LeftTop.vue'
import { appStore } from '_@/store/modules/app'
import { ImStore } from '_@/store/modules/im'
import imrequest from '@/utils/imrequest'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'
import { getNoticeDate } from '@/utils/moment'
import { Calendar, Search } from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Layout',
  components: {
    Classic,
    Top,
    LeftTop
  },
  setup() {
    const x = ref(100)
    const y = ref(100)
    const layout = computed(() => appStore.layout)
    const ImShow = computed(() => ImStore.imShow)
    const proxy = getCurrentInstance()?.appContext.config.globalProperties
    let data = reactive({
      data: [
        {
          x: 100,
          y: 100,
          name: '哈哈',
          drag: false,
          resize: true,
          rotate: true,
          active: false
        },
        {
          x: 200,
          y: 200,
          name: '哈哈2',
          drag: true,
          resize: true,
          rotate: true,
          active: true
        }
      ]
    })
    const moveHandler = (data: object) => {
      console.log(data, '移动')
    }
    const downHandler = (data: object) => {
      console.log(data, '按下')
    }
    const mouseUpHandler = (data: object) => {
      console.log(data, '抬起')
    }
    const resizeHandler = (data: object) => {
      console.log(data, '缩放')
    }
    const rotateHandler = (data: object) => {
      console.log(data, '旋转')
    }
    const activated = (data: object) => {
      console.log(data, '激活')
    }
    const deactivated = (data: object) => {
      console.log(data, '取消激活')
    }
    const getSsionList = async () => {
      imrequest.get('/api/Sync/SyncSessionInfos').then((res) => {
        ImStore.AddSessionList(res['Data'].reverse())
      })
    }
    let currentIndex = ref(-1) // 临时存储当前激活组件的index
    //   自制激活事件 点击组件激活
    const activeMouseDown = (item: any, index: number) => {
      if (currentIndex.value === index) return
      console.log(data)
      data.data.forEach((item, i) => {
        if (i === index) {
          item['active'] = true
        } else {
          item['active'] = false
        }
      })
      currentIndex.value = index
    }
    //   保存复制的数据
    let copyData = reactive<any>({
      allData: [],
      copy: {}
    })
    document.onkeydown = function (e: any) {
      // 绑定键盘事件
      e = e || window.event //标准化事件处理
      if (e.keyCode == 46) {
        // delete  按键盘delete删除
        data.data = data.data.filter(
          (item, index) => index != currentIndex.value
        )
      } else if (e.ctrlKey && e.keyCode == 67) {
        // Ctrl + C  // 复制
        if (currentIndex.value >= 0) {
          copyData.allData = [...data.data]
          copyData.copy = JSON.parse(
            JSON.stringify(copyData.allData[currentIndex.value])
          )
        }
      } else if (e.ctrlKey && e.keyCode == 86) {
        // Ctrl + V  // 粘贴
        copyData.allData.push(copyData.copy)
        data.data = copyData.allData
      } else if (e.ctrlKey && e.keyCode == 90) {
        // Ctrl + Z  // 撤回
        //   暂时没写
      } else if (e.ctrlKey) {
        //   暂时没写
      } else if (
        e.keyCode == 37 ||
        e.keyCode == 38 ||
        e.keyCode == 39 ||
        e.keyCode == 40
      ) {
        // 键盘上下左右移动激活中的组件
        //      左                  上                  右                下
        if (currentIndex.value >= 0) {
          switch (e.keyCode) {
            case 37:
              data.data[currentIndex.value].x--
              break
            case 38:
              data.data[currentIndex.value].y--
              break
            case 39:
              data.data[currentIndex.value].x++
              break
            case 40:
              data.data[currentIndex.value].y++
              break
          }
        }
      }
    }
    const toDescription = (message: any) => {
      const customer = message.CustomContent
        ? JSON.parse(message.CustomContent || '{}')
        : ''
      switch (message.Type) {
        case proxy!.$imsdk.enums.ContentType.Text:
          return message.Content
        case proxy!.$imsdk.enums.ContentType.Link:
          return '[链接]'
        case proxy!.$imsdk.enums.ContentType.Image:
          return '[图片]'
        case proxy!.$imsdk.enums.ContentType.Voice:
          return '[语音]'
        case proxy!.$imsdk.enums.ContentType.Video:
          return '[视频]'
        case proxy!.$imsdk.enums.ContentType.File:
          return '[文件]'
        case proxy!.$imsdk.enums.ContentType.ReCall:
          if (message.MeaageType == proxy!.$imsdk.enums.MessageTypeEnum.Group) {
            return ``
          }
          return "'对方'撤回了一条消息]"
        case proxy!.$imsdk.enums.ContentType.Custom:
          switch (customer.contentType) {
            case 1:
              return '[电话号码交换]'
            case 2:
              return '[订单确认]'
            case 12:
              return '[地理位置]'
          }
      }
    }
    onMounted(() => {
      let user = wsCache.get(appStore.userInfoDetail)
      let userImid = user.sysUser.imId || 0
      fetch({ url: '/basic/im/accesstoken', method: 'get' }).then(
        async (res) => {
          user.sysUser.imId = Number(res.data.imId)
          wsCache.set(appStore.userInfoDetail, user)
          wsCache.set('imToken', res.data.token)
          wsCache.set('imUserInfo', res.data)
          await getSsionList()
          const iminit = new proxy!.$imsdk.httphelper.IMRequest(
            'deviceGuid',
            res.data.baseUrl,
            res.data.socketUrl,
            res.data.token,
            proxy?.$imsdk.enums.Platform.PC,
            'deviceName'
          )
          ImStore.SetRequestIm(iminit)
          ImStore.SetWebScoket(new WebSocket(ImStore.requestIm.getWsConnetc()))
          ImStore.websocket.onopen = function () {
            console.log('链接已经打开')
          }
          ImStore.requestIm.initMessageCallback({
            onReceiveNormalMessage: (normal: any) => {
              console.log('set2', normal)
              let user = wsCache.get(appStore.userInfoDetail)
              let userImid = user.sysUser.imId || 0
              const session = {
                SessionId: 0,
                UserId: userImid,
                TargetId:
                  normal.SourceId == userImid
                    ? normal.TargetId
                    : normal.SourceId,
                TargetName: '',
                TargetAvatarFileId: 0,
                Type: proxy?.$imsdk.enums.SessionType.Normal,
                LastTime: normal.ChangeTime,
                LastContent: toDescription(normal),
                UnreadCount: 0,
                IsTopMost: 0,
                ChangeTime: normal.ChangeTime,
                CustomField: ''
              }
              let userInfo = ImStore.userList.find(
                (item) => item.ImId == session.TargetId
              )
              if (!userInfo) {
                imrequest
                  .post('/api/Sync/SyncUserInfo', { ids: [session.TargetId] })
                  .then((res: any) => {
                    ImStore.GetUserList([
                      { ImId: res.Data[0].UserId, ...res.Data[0] }
                    ])
                    session.TargetName = res.Data[0].Name
                    session.TargetAvatarFileId = res.Data[0].UserId
                    ImStore.ChangeSession(session)
                    ImStore.SetIsNewMessage(true)
                    ImStore.LoadNormalMessageList([normal])
                  })
              } else {
                session.TargetName = userInfo.Name
                session.TargetAvatarFileId = userInfo.UserId
                ImStore.ChangeSession(session)
                ImStore.SetIsNewMessage(true)
                ImStore.LoadNormalMessageList([normal])
              }
            },
            onReceiveGroupMessage: (group: any) => {
              console.log(group)
              let userInfo = ImStore.userList.find(
                (item) => item.ImId == group.GroupId
              )
              const session = {
                SessionId: 0,
                UserId: group.SourceId,
                TargetId: group.GroupId,
                TargetName: userInfo.Name,
                TargetAvatarFileId: 0,
                Type: proxy?.$imsdk.enums.SessionType.Group,
                LastTime: group.ChangeTime,
                LastContent: toDescription(group),
                UnreadCount: 0,
                IsTopMost: 0,
                ChangeTime: group.ChangeTime
              }
              if (!userInfo) {
                imrequest
                  .post('/api/Sync/SyncUserInfo', {
                    ids: [group.SourceId]
                  })
                  .then((res: any) => {
                    ImStore.GetUserList([res.data])
                    session.TargetName = res.data.Name
                    session.TargetAvatarFileId = res.data.UserId
                    ImStore.ChangeSession(session)
                    ImStore.SetIsNewMessage(true)
                    ImStore.LoadGroupMessageList([{ ...group }])
                  })
              } else {
                session.TargetName = userInfo.Name
                session.TargetAvatarFileId = userInfo.ImId
                ImStore.ChangeSession(session)
                ImStore.SetIsNewMessage(true)
                ImStore.LoadGroupMessageList([group])
              }
            },
            onGroupUpdate: (group: any) => {
              console.log(group)
              const { sessionList } = ImStore
              const groupItem = sessionList.find(
                (item) => item.TargetId == group.GroupId
              )
              groupItem.TargetName = group.Name
            },
            onPing: (userid: Number) => {
              //console.log('ping', userid)
            },
            onReceiveNotifyMessage: (notify: any) => {},
            onWsClose: (message: any) => {
              //console.log(message)
            },
            onGroupInvite: (creator: any, groupId: any, isConfirm: any) => {},
            onMessageRecall: async (
              sourceId: any,
              messageId: any,
              targetId: any,
              isGroup: any
            ) => {
              let imUser = res.data
              //群聊的撤回
              if (isGroup) {
                //判断群否存在
                console.log(ImStore.userList)
                let groupInfo = ImStore.userList.find(
                  (item) => item.ImId == targetId
                )
                let userInfo = ImStore.userList.find(
                  (item) => item.ImId == sourceId
                )
                console.log('userinfo', groupInfo)
                const session = {
                  SessionId: 0,
                  UserId: imUser.imId == targetId ? targetId : sourceId,
                  TargetId: imUser.imId == targetId ? sourceId : targetId,
                  TargetAvatarFileId: 0,
                  TargetName: '',
                  Type: proxy?.$imsdk.enums.SessionType.Group,
                  LastTime: new Date().getTime() / 1000,
                  LastContent: '',
                  UnreadCount: 0,
                  IsTopMost: 0,
                  ChangeTime: new Date().getTime() / 1000
                }
                if (!groupInfo) {
                  const group = await imrequest.get(
                    '/api/Group/GetGroup?groupId=' + targetId
                  )
                  session.TargetName = group['Name']
                  imrequest
                    .post('/api/Sync/SyncUserInfo', {
                      ids: [sourceId]
                    })
                    .then((res: any) => {
                      ImStore.GetUserList([res.data])
                      session.LastContent =
                        imUser.imId == sourceId
                          ? '你撤回了一条消息'
                          : `${res.data.Name}撤回了一条消息`
                      ImStore.ChangeSession(session)
                      ImStore.SetIsNewMessage(true)
                      console.log(sourceId, messageId, targetId, isGroup)
                      ImStore.RecallMessage({
                        sourceId,
                        messageId,
                        targetId,
                        isGroup
                      })
                    })
                } else {
                  session.TargetName = groupInfo.Name
                  session.TargetAvatarFileId = groupInfo.ImId
                  session.LastContent =
                    imUser.imId == sourceId
                      ? '你撤回了一条消息'
                      : `${userInfo.Name}撤回了一条消息`
                  ImStore.ChangeSession(session)
                  ImStore.SetIsNewMessage(true)
                  console.log(sourceId, messageId, targetId, isGroup)
                  ImStore.RecallMessage({
                    sourceId,
                    messageId,
                    targetId,
                    isGroup
                  })
                }
              } else {
                const TargetId = imUser.imId == targetId ? sourceId : targetId
                let userInfo = ImStore.userList.find(
                  (item) => item.ImId == TargetId
                )
                const session = {
                  SessionId: 0,
                  UserId: imUser.imId == targetId ? targetId : sourceId,
                  TargetId: imUser.imId == targetId ? sourceId : targetId,
                  TargetName: userInfo ? userInfo.Name : '',
                  TargetAvatarFileId: 0,
                  Type: proxy?.$imsdk.enums.SessionType.Number,
                  LastTime: new Date().getTime() / 1000,
                  LastContent: '',
                  UnreadCount: 0,
                  IsTopMost: 0,
                  ChangeTime: new Date().getTime() / 1000
                }
                if (!userInfo) {
                  imrequest
                    .post('/api/Sync/SyncUserInfo', {
                      ids: [TargetId]
                    })
                    .then((res: any) => {
                      ImStore.GetUserList([res.data])
                      session.TargetName = res.Data.Name
                      session.TargetAvatarFileId = res.data.UserId
                      session.LastContent =
                        imUser.imId == sourceId
                          ? '你撤回了一条消息'
                          : `${res.data.Name}撤回了一条消息`
                      ImStore.ChangeSession(session)
                      ImStore.SetIsNewMessage(true)
                      ImStore.RecallMessage({
                        sourceId,
                        messageId,
                        targetId,
                        isGroup
                      })
                    })
                } else {
                  session.TargetName = userInfo.Name
                  session.TargetAvatarFileId = userInfo.ImId
                  session.LastContent =
                    imUser.imId == sourceId
                      ? '你撤回了一条消息'
                      : `对方撤回了一条消息`
                  ImStore.ChangeSession(session)
                  ImStore.SetIsNewMessage(true)
                  ImStore.RecallMessage({
                    sourceId,
                    messageId,
                    targetId,
                    isGroup
                  })
                }
              }
            }
          })
          ImStore.websocket.onmessage = async (res: any) => {
            var reader = new FileReader()
            if (typeof res.data != 'string') {
              reader.readAsArrayBuffer(res.data as Blob)
              reader.onload = () => {
                var buffer = new Uint8Array(reader.result as ArrayBufferLike)
                ImStore.requestIm.onWsData(buffer)
              }
            } else {
              ImStore.requestIm.onWsData(res.data)
            }
          }
          ImStore.websocket.onclose = function (e: any) {
            //console.log(e)
          }
        }
      )
    })
    return {
      layout,
      data,
      ImShow,
      x,
      y,
      moveHandler,
      downHandler,
      mouseUpHandler,
      resizeHandler,
      rotateHandler,
      deactivated,
      activated,
      activeMouseDown
    }
  }
})
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  .chat {
    background: #fff;
    width: 820px;
    height: 820px;
    z-index: 999;
    bottom: 50px;
    right: 50px;
    box-shadow: 0px 0px 15px 8px #e6e6e6;
    border-radius: 15px;
    overflow: hidden;
  }
}
</style>
