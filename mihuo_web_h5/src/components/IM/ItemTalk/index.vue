<template>
  <span class="item_msg" @click="itemCallback">
    <div v-if="message.Type == $imsdk.enums.ContentType.Link">
      <!-- 如果数据里有orderSn字段,说明是材料订单, 否则是普通订单 -->
      <MaterialBillItem
        v-if="getJSON(message.CustomContent).orderSn"
        :key="getJSON(message.CustomContent).GuidMini"
        :orderDetail="getJSON(message.CustomContent)"
      />
    </div>
    <!--地图-->
    <div
      v-if="
        message.Type == $imsdk.enums.ContentType.Custom &&
        getJSON(message.CustomContent).contentType == 12
      "
      class="content map"
    >
      <div class="title">
        {{ getJSON(message.CustomContent).name }}
      </div>
      <div class="subtitle">
        {{ getJSON(message.CustomContent).address }}
      </div>
      <img mode="aspectFill" class="box" src="@/assets/img/address_icon.png" />
    </div>
    <span
      v-if="message.Type === $imsdk.enums.ContentType.Text"
      class="textmessage"
      >{{ message.Content || '[空白消息]' }}</span
    >
    <el-image
      prediv-teleported
      class="web__msg--img"
      style="max-height: 200px"
      :style="{ height: loaded ? 'auto' : '200px' }"
      fit="contain"
      v-if="message.Type === $imsdk.enums.ContentType.Image"
      :src="getUrl(true)"
      :prediv-src-list="[getUrl(false)]"
      :z-index="9999"
      alt
      @click="showDialog()"
      @load="load('img')"
    />
    <video
      class="web__msg--video"
      v-if="message.Type === $imsdk.enums.ContentType.Video"
      :src="getUrl(false)"
      controls="controls"
      @click="showDialog()"
      @canplaythrough="load('video')"
    />
    <audio
      class="web__msg--audio"
      v-if="message.Type === $imsdk.enums.ContentType.Voice"
      style="width: 20rem; height: 20px"
      :src="getUrl(false)"
      controls="controls"
      @canplaythrough="load('audio')"
    />
  </span>
</template>

<script>
import {
  defineComponent,
  markRaw,
  ref,
  computed,
  reactive,
  onMounted,
  getCurrentInstance,
  watch
} from '@vue/runtime-core'
import emojiParser from 'wechat-emoji-parser'
import wsCache from '@/cache'
import imrequest from '@/utils/imrequest'
import { appStore } from '_@/store/modules/app'
import MaterialBillItem from '../MaterialBillItem/index.vue'
export default defineComponent({
  name: 'ItemTalk',
  components: {
    MaterialBillItem
  },
  props: {
    message: {
      type: Object,
      default: {}
    }
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const imUserInfo = wsCache.get('imUserInfo')
    let url = imUserInfo.baseUrl + '/api/Common/GetFile'
    let tags = markRaw(['img', 'video', 'audio'])
    let message = reactive(props.message)
    /* 查看文件详情 */
    let show = ref(false)
    let loaded = ref(false)
    let filesSrc = ref('')
    let loadState = ref(false)
    const getTag = computed(() => {})
    const getData = computed(() => {})
    const getJSON = (jsonstring) => {
      //这里是json字符串而不是单纯的字符串
      return JSON.parse(jsonstring) || {}
    }
    const getUrl = (isThumb = false) => {
      const token = wsCache.get('imToken')
      return url + `?fileId=${message.FileId}&isThumb=${isThumb}&token=${token}`
    }
    const load = (type) => {
      //if (loadState) return
      //修整附件加载无法滚动到底部
      loadState = true
      loaded.value = true
      console.log('load', type)
      //emit('loadDone')
    }
    const handleClose = (done) => {
      filesSrc = null
      done()
    }
    const showDialog = () => {
      show = true
    }
    const itemCallback = () => {
      emit('systemEvent', '')
    }
    const parseText = () => {
      let { text } = this
      if (!text) return
      text = text.replace(/\n/g, '<br/>')
      const html = emojiParser(text).replace(
        /<img src/g,
        '<img data-class="iconBox" src'
      )
      return html
    }
    onMounted(() => {
      const type = getTag
      if (tags.includes(type)) return
      proxy.$nextTick(() => {
        emit('loadDone', { type, target: '' })
      })
    })
    return {
      tags,
      /* 查看文件详情 */
      show,
      message,
      loaded,
      filesSrc,
      loadState,
      getData,
      load,
      getJSON,
      handleClose,
      showDialog,
      itemCallback,
      parseText,
      getUrl
    }
  }
})
</script>
<style lang='less' scoped>
.item_msg {
  display: flex;
  .textmessage {
    line-height: 2.5rem;
    font-weight: 600;
  }
  .web__msg--img,
  .web__msg--video,
  .web__msg--file {
    max-width: 200px;
    min-width: 50px;
    width: auto;
    margin: 0 0;
    overflow: hidden;
    border-radius: 5px;
    cursor: pointer;
    display: block;
  }
  .web__msg--img[data-class='iconBox'] {
    min-width: 200px;
    border: none;
    margin: 0;
    vertical-align: bottom;
    display: inline-block;
  }
}
</style>
