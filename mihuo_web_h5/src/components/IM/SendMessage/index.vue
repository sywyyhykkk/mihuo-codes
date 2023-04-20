<template>
  <div>
    <SendFile @emoji="getEmoji" />
    <div class="web__msg">
      <textarea
        v-model="currentMsg"
        rows="3"
        @keyup.enter="handleSend"
        :placeholder="placeholder"
        class="web__msg-input"
        ref="msgBox"
      />
      <div class="web__msg-menu">
        <el-button
          class="web__msg-submit"
          type="primary"
          size="mini"
          @click="handleSend"
          >发送</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, getCurrentInstance, watch } from 'vue'
import { ImStore } from '_@/store/modules/im'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
export default defineComponent({
  name: 'SendMessage',
  props: {
    value: {
      type: String,
      default: ''
    },
    insert: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    let currentMsg = ref('')
    const placeholder = ref('请输入聊天消息')
    let user = wsCache.get(appStore.userInfoDetail)
    const proxy = getCurrentInstance()?.appContext.config.globalProperties
    //用户主动发送
    const handleSend = (e) => {
      const { toUser } = ImStore
      if (!currentMsg.value) return
      //console.log(toUser)
      const data = {
        Id: 0,
        TargetId: parseInt(toUser.TargetId || 0),
        Type: proxy.$imsdk.enums.ContentType.Text,
        Content: currentMsg.value,
        GroupId: parseInt(toUser.TargetId || 0),
        CustomContent: JSON.stringify({
          GuidMini: proxy.$imsdk.common.GuidMini()
        })
      }
      const messageInfo =
        toUser.Type == proxy.$imsdk.enums.SessionType.Group
          ? proxy.$imsdk.messages.GroupMessage.fromMap(data)
          : proxy.$imsdk.messages.NormalMessage.fromMap(data)
      const buffder = proxy.$imsdk.common.ToMessagePackBuffer(messageInfo)
      console.log("fasong")
      ImStore.websocket.send(buffder)
      currentMsg.value = ''
    }
    const joinToMsg = (str) => {
      /* eslint-disable */
      const myField = proxy.$refs.msgBox
      let afterMsg = currentMsg
      //IE浏览器
      if (document.selection) {
        var sel = null
        myField.focus()
        sel = document.selection.createRange()
        sel.text = str
        sel.select()
      }
      //火狐/网景 浏览器
      else if (myField.selectionStart || myField.selectionStart == '0') {
        //得到光标前的位置
        var startPos = myField.selectionStart
        //得到光标后的位置
        var endPos = myField.selectionEnd
        // 在加入数据之前获得滚动条的高度
        var restoreTop = myField.scrollTop
        afterMsg =
          afterMsg.substring(0, startPos) +
          str +
          afterMsg.substring(endPos, afterMsg.length)
        //如果滚动条高度大于0
        if (restoreTop > 0) {
          // 返回
          myField.scrollTop = restoreTop
        }
        myField.focus()
        myField.selectionStart = startPos + str.length
        myField.selectionEnd = startPos + str.length
      } else {
        afterMsg += str
        myField.focus()
      }
      currentMsg = afterMsg
    }
    const getEmoji = (emoji) => {
      currentMsg.value = currentMsg.value + emoji
    }
    watch(
      () => props.insert,
      (newval) => {
        if (newval) {
          joinToMsg(newval)
        }
      }
    )
    return {
      currentMsg,
      getEmoji,
      placeholder,
      handleSend
    }
  }
})
</script>
<style scoped lang='less'>
.web__msg {
  padding: 0 10px;
  overflow: hidden;
  &-input {
    display: block;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    resize: none;
    outline: 0;
    background-color: #fff;
    border: 0;
    word-break: break-all;
    font-size: 18px;
    color: #333;
    -webkit-appearance: none;
  }
  &-menu {
    text-align: right;
    margin-bottom: 20px;
  }
  &-submit {
    display: inline-block;
    outline: none;
    cursor: pointer;
    text-align: center;
  }
}
.class {
  -webkit-animation: swing_image 0.8s linear 0s 1 normal;
  -moz-animation: swing_image 0.8s linear 0s 1 normal;
  -ms-animation: swing_image 0.8s linear 0s 1 normal;
  -o-animation: swing_image 0.8s linear 0s 1 normal;
  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  -ms-animation-fill-mode: both;
  -o-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes swing_image {
  0% {
    -webkit-transform: rotate(0deg);
  }
  15% {
    -webkit-transform: rotate(0deg);
  }
  20% {
    -webkit-transform: rotate(-5.5deg);
  }
  40% {
    -webkit-transform: rotate(7deg);
  }
  60% {
    -webkit-transform: rotate(-2deg);
  }
  70% {
    -webkit-transform: rotate(3deg);
  }
  80% {
    -webkit-transform: rotate(-1deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
  }
}
@-moz-keyframes swing_image {
  0% {
    -moz-transform: rotate(0deg);
  }
  15% {
    -moz-transform: rotate(0deg);
  }
  20% {
    -moz-transform: rotate(-5.5deg);
  }
  40% {
    -moz-transform: rotate(7deg);
  }
  60% {
    -moz-transform: rotate(-2deg);
  }
  70% {
    -moz-transform: rotate(3deg);
  }
  80% {
    -moz-transform: rotate(-1deg);
  }
  100% {
    -moz-transform: rotate(0deg);
  }
}
@-ms-keyframes swing_image {
  0% {
    -ms-transform: rotate(0deg);
  }
  15% {
    -ms-transform: rotate(0deg);
  }
  20% {
    -ms-transform: rotate(-5.5deg);
  }
  40% {
    -ms-transform: rotate(7deg);
  }
  60% {
    -ms-transform: rotate(-2deg);
  }
  70% {
    -ms-transform: rotate(3deg);
  }
  80% {
    -ms-transform: rotate(-1deg);
  }
  100% {
    -ms-transform: rotate(0deg);
  }
}
@-o-keyframes swing_image {
  0% {
    -o-transform: rotate(0deg);
  }
  15% {
    -o-transform: rotate(0deg);
  }
  20% {
    -o-transform: rotate(-5.5deg);
  }
  40% {
    -o-transform: rotate(7deg);
  }
  60% {
    -o-transform: rotate(-2deg);
  }
  70% {
    -o-transform: rotate(3deg);
  }
  80% {
    -o-transform: rotate(-1deg);
  }
  100% {
    -o-transform: rotate(0deg);
  }
}
@keyframes swing_image {
  0% {
    transform: rotate(0deg);
  }
  5% {
    transform: rotate(-5.5deg);
  }
  25% {
    transform: rotate(7deg);
  }
  45% {
    transform: rotate(-2deg);
  }
  55% {
    transform: rotate(3deg);
  }
  65% {
    transform: rotate(-1deg);
  }
  80% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
