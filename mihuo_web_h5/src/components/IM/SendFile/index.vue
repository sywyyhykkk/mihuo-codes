<template>
  <div class="toolsBox">
    <template v-if="showEmoji">
      <el-popover
        placement="top-start"
        trigger="click"
        ref="popover"
        width="auto"
      >
        <ul class="emjioBox">
          <li v-for="item in emoji" :key="item" @click="selectEmit(item)">
            <span style="font-size: 20px">{{ item }}</span>
          </li>
        </ul>
        <template #reference>
          <Icon style="font-size: 18px" type="icon-xiaolian" title="表情" />
        </template>
      </el-popover>
    </template>
    <template v-for="(item, k) in showkeys">
      <span v-if="toolConfig[item]" :key="item">
        <span @click="bindButton(item)">
          <Icon
            style="font-size: 18px"
            :type="toolConfig[item].icon"
            :title="iconTitle(item, k)"
          />
        </span>
      </span>
      <i :key="k" v-else :class="item" @click="bindButton(item)"></i>
    </template>
    <slot name="tools" />
  </div>
</template>

<script>
import emoji from '@/utils/emoji'
import imrequest from '@/utils/imrequest.ts'
import { ImStore } from '_@/store/modules/im'
import { appStore } from '_@/store/modules/app'
import wsCache from '@/cache'
import {
  defineComponent,
  ref,
  markRaw,
  computed,
  getCurrentInstance
} from 'vue'
export default defineComponent({
  name: 'SendFile',
  props: {
    tools: {
      type: Object,
      default: () => {
        return {
          show: ['img'],
          showEmoji: true
        }
      }
    }
  },
  setup(props, { emit }) {
    const proxy = getCurrentInstance()?.appContext.config.globalProperties
    const content = getCurrentInstance().proxy
    const toolConfig = markRaw({
      img: { icon: 'icon-xiangce', title: '图片' },
      hongbao: { icon: 'icon-hongbao', title: '红包' },
      history: { icon: 'icon-lishi', title: '历史' },
      more: { icon: 'icon-gengduo', title: '更多' }
    })
    const newTitle = ref('')
    const showEmoji = computed(() => {
      const { showEmoji = true } = props.tools || {}
      return showEmoji
    })
    const showkeys = computed(() => {
      let keys = Object.keys(toolConfig)
      const { show = [] } = props.tools || {}
      let _key = []
      if (show.length > 0) {
        show.forEach((i) => {
          if (Array.isArray(i)) {
            newTitle = i
            return
          }
          if (keys.includes(i)) _key.push(i)
        })
        // keys = _key
      }
      return _key
    })
    const iconTitle = (key, index) => {
      let title = ''
      // newTitle = ['自定义标题1', '自定义标题2']
      if (newTitle) {
        title = newTitle[index] || ''
      }
      if (!title) {
        title = toolConfig[key].title
      }
      return title
    }

    const selectEmit = (type) => {
      emit('emoji', type)
      //content.$refs.popover.doClose()
    }
    //文件消息的处理
    const sendFiles = (type, files) => {
      for (let item of files) {
        let data = new FormData()
        // 创建一个表单数据
        data.append('file', item)
        let config = {
          headers: { 'Content-Type': 'multipart/form-data' } //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
        }
        imrequest
          .post('/api/Common/UploadSmallFile', data, config)
          .then((res) => {
            console.log(res)
            const { toUser } = ImStore
            let user = wsCache.get(appStore.userInfoDetail)
            const data = {
              Id: 0,
              TargetId: parseInt(toUser.TargetId),
              Type: proxy.$imsdk.enums.ContentType.Image,
              SourceId: parseInt(user.sysUser.imId),
              Content: '',
              FileId: res.Data,
              GroupId: parseInt(toUser.TargetId || 0),
              CustomContent: JSON.stringify({
                GuidMini: proxy.$imsdk.common.GuidMini()
              })
            }
            const messageInfo =
              toUser.Type == proxy.$imsdk.enums.SessionType.Group
                ? proxy.$imsdk.messages.GroupMessage.fromMap(data)
                : proxy.$imsdk.messages.NormalMessage.fromMap(data)
            console.log(messageInfo)
            const buffder = proxy.$imsdk.common.ToMessagePackBuffer(messageInfo)
            ImStore.websocket.send(buffder)
          })
      }
    }
    const bindButton = (type) => {
      if (type === 'file') {
        openFile(type, sendFiles)
      } else if (type === 'img') {
        openFile(type, sendFiles)
      } else {
      }
    }
    const openFile = (type, callback) => {
      var input = document.createElement('input')
      input.type = 'file'
      type === 'img'
        ? (input.accept = 'image/gif,image/jpeg,image/jpg,image/png,image/svg')
        : ''
      input.multiple = 'multiple'
      input.click()
      input.onchange = function () {
        console.log(input.files)
        var file = input.files
        callback(type, file)
      }
    }
    const emojiStyle = (item) => {
      const emojiitem = emoji[item]
      if (!emojiitem) return {}
      return {
        display: 'inline-block',
        background: `url('https://res.wx.qq.com/a/wx_fed/webwx/res/static/img/6AfH8-r.png')  no-repeat`,
        width: `28px`,
        height: `28px`,
        'background-position': emojiitem.position
      }
    }

    return {
      emoji,
      toolConfig,
      newTitle,
      showkeys,
      showEmoji,
      iconTitle,
      selectEmit,
      sendFiles,
      bindButton,
      openFile,
      emojiStyle
    }
  }
})
</script>

<style lang='less' scoped>
.toolsBox {
  position: relative;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 20px 0;
}
i {
  padding-left: 6px;
  font-size: 50px;
  color: #888a91;
  margin: 0 15px;
}
i:hover {
  color: #76b1f9;
}
.emjioBox {
  background: #fff;
  height: 350px;
  width: 500px;
  overflow: auto;
  text-align: left;
  padding: 0;
  li {
    display: inline-block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
