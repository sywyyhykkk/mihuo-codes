<template>
  <div class="wrapper" :style="boxSize" ref="scroller">
    <div class="scroller">
      <div v-loading="historyLoding || scrollTop"></div>
      <div class="web__main" ref="mainRef">
        <template v-for="(item, index) in messageList" :key="item.Id">
          <!-- <el-divider>{{ item.text }}</el-divider> -->
          <div class="recall">
            <div class="imdate" v-if="getDiffDate(messageList, item, index)">
              {{ getDate(item.CreateTime) }}
            </div>
            <div
              v-if="item.Type === $imsdk.enums.ContentType.ReCall"
              style="margin-top: 10px"
            >
              {{ getRecallImName(item) }}撤回了一条消息
            </div>
          </div>
          <div
            class="web__main-item"
            v-if="item.Type != $imsdk.enums.ContentType.ReCall"
            :id="'item' + item.SourceId"
            :class="{
              'web__main-item--mine': item.SourceId == userImId
            }"
          >
            <div class="web__main-user">
              <ImAvatar :detail="item" />
            </div>
            <div
              class="we__name"
              v-if="
                item.SourceId != userImId &&
                item.MessageType == imsskpage.enums.MessageTypeEnum.Group
              "
            >
              {{ getImName(item) }}
            </div>
            <div class="web__main-text">
              <div class="web__main-arrow"></div>
              <ItemTalk
                :message="item"
                @systemEvent="taskEvent"
                @loadDone="loadDone"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getShowDate } from '@/utils/chat.js'
import Scroll from '@/utils/scroll'
import Remind from '@/utils/remind'
import { ImStore } from '_@/store/modules/im'
import { base64Avatar } from '@/global'
import {
  defineComponent,
  ref,
  watch,
  computed,
  onMounted,
  getCurrentInstance
} from 'vue'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import imrequest from '@/utils/imrequest'
import { param2Obj } from '@/utils'
const imsdk = require('@/xsoftimsdk.js')
export default defineComponent({
  name: 'ChatList',
  components: {},
  props: {
    pageConfig: {
      type: Object,
      default: () => ({
        width: '100vw'
      })
    },
    config: {
      type: Object,
      default: () => ({
        width: '525px',
        height: '100%'
      })
    }
  },
  setup(props) {
    let user = wsCache.get(appStore.userInfoDetail)
    let imsskpage = ref(imsdk)
    let scroll = ref('')
    let remind = ref('')
    let scrollTop = ref(false)
    let historyLoding = ref(false)
    let stopScroll = ref(false)
    let stopScrollTimer = ref('')
    let scrollType = ref('roll')
    let userImId = ref(user.sysUser.imId)
    let pageSize = ref(20)
    let pageIndex = ref(1)
    let mainRef = ref('')
    let scrollX = ref(0) // 滚动条横向位置
    let scrollY = ref(0) // 滚动条纵向位置
    const proxy = getCurrentInstance().proxy
    const messageList = computed(() => {
      const { sessionList, toUser } = ImStore
      //console.log(toUser)
      return toUser.Message
    })
    //获取用户信息
    const getImUserInfo = async () => {
      const { userList, toUser } = ImStore
      const user = userList.find((item) => item.ImId == toUser.TargetId)
      if (!user) {
        if (toUser.Type == imsdk.enums.SessionType.Normal) {
          const { Data } = await imrequest.post('/api/Sync/SyncUserInfo', {
            ids: [toUser.TargetId]
          })
          ImStore.GetUserList([{ ImId: Data[0].UserId, ...Data[0] }])
        } else {
          //先获取群
          const resGroup = await imrequest.get(
            '/api/Group/GetGroup?groupId=' + toUser.TargetId
          )
          const resUser = await imrequest.get(
            '/api/Group/GetGroupUsers?groupId=' + toUser.TargetId
          )
          const group = resGroup.Data
          const userList =
            resUser.Data &&
            resUser.Data.map((item) => {
              return {
                ImId: item.UserId,
                ...item
              }
            })
          //console.log([{ ImId: group.GroupId, ...group }, ...userList])
          ImStore.GetUserList([{ ImId: group.GroupId, ...group }, ...userList])
        }
      }
    }
    const imAvatart = (item) => {
      const imUser = wsCache.get('imUserInfo')
      return (
        imUser.baseUrl +
        '/api/Common/GetAvatar?isThumb=true&userId=' +
        item.SourceId
      )
    }
    //获取所有聊天记录
    const getAllMessage = async (loadMore = true) => {
      const { toUser } = ImStore
      //这里如果我有消息了 说明已经请求过了。其他消息scoket会同步
      if (!loadMore && toUser.Message.length) return
      if (toUser.Type == imsdk.enums.SessionType.Group) {
        const res = await imrequest({
          url: '/api/Message/GetGroupMessages',
          params: {
            groupId: toUser.TargetId,
            index: pageIndex.value,
            size: pageSize.value
          }
        })
        if (res.Data.length) {
          ImStore.LoadGroupMessageList(res.Data.reverse())
        }
      } else {
        const res = await imrequest({
          url: 'api/Message/GetNormalMessages',
          params: {
            targetId: toUser.TargetId,
            index: pageIndex.value,
            size: pageSize.value
          }
        })
        if (res.Data.length) {
          ImStore.LoadNormalMessageList(res.Data.reverse())
          scroll.scrollTo(0, scroll.maxScrollY, 200)
        }
      }
    }
    const getRecallImName = (data) => {
      const { userList } = ImStore
      const user = userList.find((item) => item.ImId == data.SourceId)
      //单聊
      if (data.MessageType == imsdk.enums.MessageTypeEnum.Normal) {
        return user.ImId == userImId.value ? '"你"' : '"对方"'
      } else {
        return user.ImId == userImId.value ? '"你"' : `"${user.Name}"`
      }
    }
    const getImName = (data) => {
      const { userList } = ImStore
      const user = userList.find((item) => item.ImId == data.SourceId)
      return user ? user.Name : ''
    }
    const boxSize = computed(() => {
      let { height = '100%', width = '525px' } = props.config || {}
      if (`${height}`.match(/\d$/)) {
        height += 'px'
      }
      if (`${width}`.match(/\d$/)) {
        width += 'px'
      }
      const style = { height, width }
    })
    const historyConfig = computed(() => {
      const { historyConfig: { tip = '历史消息', show = false } = {} } =
        props.config
      return { tip, show }
    })
    const unread = computed(() => {
      const { unread = 0 } = scroll || {}
      return unread
    })
    const loadDone = () => {
      let callback = scrollBottom
      if (scrollType.value === 'noroll') {
        stopScroll = true
        callback = null
      }
      scrollRefresh(callback)
      childnodeLoad()
    }
    const scrollBottom = () => {
      const stop = stopScroll.value
      clearTimeout(stopScrollTimer)
      if (stop || historyLoding.value)
        return (stopScrollTimer = setTimeout(() => {
          stopScroll.value = false
        }, 500))
      if (scroll) {
        scroll.scrollTo(0, scroll.maxScrollY, 200)
      }
    }
    const createScroll = () => {
      scroll = new Scroll('.wrapper', {
        click: true,
        snap: true,
        scrollbars: false,
        mouseWheel: true,
        preventDefault: false,
        interactiveScrollbars: true,
        hijackInternalLinks: true
        // useTransform: false,
      })
      // scroll done callback
      scroll.on('scrollEnd', async () => {
        scrollX.value = scroll.x
        scrollY.value = scroll.y
        const { isTop } = scroll
        if (isTop) {
          historyLoding.value = true
          pageIndex.value++
          await getAllMessage()
          historyLoding.value = false
          scrollType.value = 'noroll'
          //scroll.scrollToElement('#item968284728786950', 0, 20)
          if (scroll) {
            console.log('scroll.maxScrollY', scroll.maxScrollY)
            //scroll.scrollTo(0, scroll.maxScrollY, 200)
          }
        }
      })
      scroll.on('scroll', function () {})
    }
    const showHistoryBtn = async () => {
      const { isTop } = scroll
      // 当前滚动条是否在顶端
      if (isTop) {
        if (scrollTop.value) {
          historyLoding.value = true
        } else {
          scrollTop.value = true
          pageIndex.value++
          historyLoding.value = false
          await getAllMessage()
          scrollBottom()
          scrollType.value = 'noroll'
        }
        return
      }
      resetHistoryFlag()
    }
    const resetHistoryFlag = async () => {
      scrollTop.value = false
      historyLoding.value = false
    }
    const childnodeLoad = () => {
      if (scrollType !== 'noroll') return
      const parent = mainRef
      if (!parent.value) return
      const childs = parent.value.children
      scroll.saveNodes({
        nodes: Array.prototype.slice.call(childs),
        dataList: messageList
      })
    }
    const scrollRefresh = (callback = null) => {
      if (!scroll) return
      scroll.refresh()
      callback &&
        proxy.$nextTick(() => {
          callback()
        })
    }
    const systemEvent = (itemData) => {
      //this.$emit('click', { type: 'systemItem', data: itemData })
    }
    const taskEvent = (itemData) => {
      //this.$emit('click', { type: 'taskItem', data: itemData })
    }
    const handleHistory = () => {
      proxy.$nextTick(() => {
        resetHistoryFlag()
      })
    }
    const getDiffDate = (list, item, index) => {
      if (index == 0) return true
      if (item.CreateTime - list[index - 1].CreateTime > 500) {
        return true
      }
    }
    const getDate = (temp) => {
      return getShowDate(temp)
    }
    watch(
      () => props.config.scrollToButton,
      (newval) => {
        if (newval) {
          scrollBottom()
        }
      }
    )
    watch(
      () => ImStore.toUser,
      async (newval) => {
        console.log(newval)
        if (newval.TargetId) {
          pageIndex.value = 1
          await getImUserInfo()
          await getAllMessage(false)
          scrollBottom()
        }
      }
    )
    onMounted(async () => {
      createScroll()
    })
    return {
      scroll,
      remind,
      scrollTop,
      historyLoding,
      stopScroll,
      stopScrollTimer,
      messageList,
      boxSize,
      historyConfig,
      scrollType,
      unread,
      mainRef,
      userImId,
      loadDone,
      getRecallImName,
      scrollBottom,
      createScroll,
      showHistoryBtn,
      resetHistoryFlag,
      childnodeLoad,
      scrollRefresh,
      systemEvent,
      taskEvent,
      imAvatart,
      getImName,
      imsskpage,
      handleHistory,
      getDiffDate,
      getDate
    }
  }
})
</script>
<style  scoped lang='less'>
:deep(.iScrollVerticalScrollbar.iScrollLoneScrollbar) {
  z-index: 1 !important;
}

.wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #f5f7fa;
  /* Prevent native touch events on Windows */
  touch-action: none;
  /* Prevent text resize on orientation change, useful for web-apps */
  text-size-adjust: none;
  .recall {
    font-size: 14px;
    color: @toastFontColor;
    text-align: center;
    margin: 10px 0;
  }
  .downBtn {
    position: absolute;
    cursor: pointer;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    bottom: 2rem;
    &::before {
      content: 'V';
      position: absolute;
      background: rgba(204, 204, 204, 0.2);
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      border-radius: 50%;
      top: 60%;
      left: 50%;
      transform: translateX(-50%);
    }
    span {
      padding: 0.1rem 0.5rem;
      font-size: 0.7rem;
      border-radius: 0.5rem;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .scroller {
    position: absolute;
    width: calc(100% - 1.5rem);
    padding: 0.5rem;
    padding-right: 1.5rem;

    /* Prevent elements to be highlighted on tap */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    /* Put the scroller into the HW Compositing layer right from the start */
    transform: translateZ(0);
    .avatarImage {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
    .web__main-item {
      position: relative;
      font-size: 0;
      margin-bottom: 10px;
      padding-left: 60px;
      min-height: 68px;
      text-align: left;
      margin: 35px 0;
      .map {
        flex-direction: column;
        position: relative;
        color: #666;

        .title {
          font-size: 30rpx;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .subtitle {
          color: #666;
          font-size: 24rpx;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .box {
          width: 100%;
          height: 140rpx;
          margin-top: 10rpx;
        }
      }
      &:not(.web__main-item--mine) .we__name {
        font-size: 14px;
        color: #999;
        position: absolute;
        top: -20px;
        min-width: 100px;
        height: 20px;
        left: 65px;
      }
      &:not(.web__main-item--mine) .web__main-text {
        &::before {
          content: ' ';
          display: block;
          position: absolute;
          top: 10px;
          left: -5px;
          border-top: 5px solid transparent;
          border-right: 5px solid #fff;
          border-bottom: 5px solid transparent;
        }
      }
    }
    .sysTip {
      font-size: 1rem;
      text-align: center;
    }
    .web__main-user,
    .web__main-text {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
    }

    .web__main-user {
      position: absolute;
      cursor: pointer;
      left: 3px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 5px;
      }
      cite {
        position: absolute;
        left: 60px;
        top: -2px;
        /* width: 500px; */
        line-height: 48px;
        font-size: 14px;
        white-space: nowrap;
        color: #999;
        text-align: left;
        font-style: normal;
        i {
          padding-left: 15px;
          font-style: normal;
        }
      }
    }

    .web__main-text {
      max-width: 65%;
      position: relative;
      font-size: 16px;
      line-height: 18px;
      padding: 14px 17px;
      background-color: #fff;
      border-radius: 10px;
      border: 1px solid #f0f0f0;
      color: #333;
      word-break: break-all;
      :deep(.map) {
        flex-direction: column;
        position: relative;
        color: #666;

        .title {
          font-size: 15px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .subtitle {
          color: #666;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .box {
          width: 100%;
          height: 80px;
          margin-top: 10px;
        }
      }
    }
    .web__main-arrow {
      top: 60px;
      left: -80px;
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-width: 8px;
      border-left-width: 0;
      border-right-color: #ebeef5;
    }

    .web__main-item--mine .web__main-text .web__main-arrow {
      left: auto;
      right: -5px;
      border-color: transparent;
      border-style: solid;
      border-width: 8px;
      border-right-width: 0;
      border-radius: 10px 10px 30px 10px;
    }

    .web__main-list {
      margin: 10px 0;
      li {
        height: 30px;
        color: #409eff;
        line-height: 30px;
      }
    }

    .web__main-item--mine {
      text-align: right;
      padding-left: 0;
      padding-right: 60px;

      .we__name {
        font-size: 14px;
        color: #999;
        position: absolute;
        top: -20px;
        right: 65px;
        width: 100px;
        height: 20px;
      }
      .web__main-user {
        left: auto;
        right: 3px;
        cite {
          left: auto;
          right: 60px;
          text-align: right;
          i {
            padding-left: 0;
            padding-right: 15px;
          }
        }
      }
      .web__main-text {
        margin-left: 0;
        text-align: left;
        padding: 17px 14px;
        font-size: 18px;
        background: #409eff;
        border-radius: 10px;
        color: #fff;
        .map {
          background: #333;
        }
        &::before {
          content: ' ';
          display: block;
          position: absolute;
          top: 10px;
          right: -5px;
          border-top: 5px solid transparent;
          border-left: 5px solid #409eff;
          border-bottom: 5px solid transparent;
        }
        img {
          max-width: 200px;
        }
      }
    }
  }
}
</style>
