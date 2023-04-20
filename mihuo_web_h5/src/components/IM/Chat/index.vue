<template>
  <div class="chatPage">
    <div class="taleBox">
      <ChatList
        :list="taleList"
        @click="$emit('clickTalk', $event)"
        @loadHistory="loadHistoryHandler"
        :config="chatListConfig"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, watch, ref, computed } from 'vue'
export default defineComponent({
  name: 'Chat',
  components: {},
  props: {
    taleList: {
      type: Array,
      default: () => []
    },
    scroll: {
      type: Number,
      default: -1
    },
    height: {
      default: '500px'
    },
    width: {
      default: '550px'
    },
    value: {
      default: ''
    },
    scrollType: {
      default: ''
    },
    toolConfig: {
      type: Object
    },
    config: {},
    quickList: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const msg = ref('')
    const insert = ref('')
    const bindEmoji = (emoji) => {
      insert = emoji
      // this.$nextTick(() => {
      //   this.insert = ''
      // })
    }
    const loadHistoryHandler = () => {
      const { historyConfig: { callback = null } = {} } = this.chatListConfig
      callback && callback()
    }
    const quickSubmit = (target) => {
      const { text } = target
      msg = text
      // this.$nextTick(() => {
      //   this.$emit('enter', target)
      //   this.msg = ''
      // })
    }
    watch('value', (o, n) => {
      this.msg = value
    })
    watch('msg', (o, n) => {
      this.$emit('input', msg)
    })
    const setStyle = computed(() => {
      let height = props.height
      let width = props.width
      if (`${height}`.match(/\d$/)) {
        height += 'px'
      }
      if (`${width}`.match(/\d$/)) {
        width += 'px'
      }
      const style = { height, width }
      return style
    })
    const talkHeight = computed(() => {
      let height = height
      if (`${height}`.match(/\d$/)) {
        height -= 140
      } else height = `calc(${height} - 140px)`
      return height
    })
    return {
      msg: '',
      insert: '',
      quickSubmit,
      loadHistoryHandler,
      bindEmoji,
      talkHeight,
      setStyle
    }
  }
})
</script>
<style lang='less' scoped>
.chatPage {
  margin: 0 auto;
  height: 100%;
  position: relative;
  background: #f5f5f5;
  overflow: hidden;
  .taleBox {
    height: calc(100%);
    overflow: hidden;
  }
  .toolBox {
    height: 140px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    position: relative;
    .quickList {
      transform: translateY(-100%);
      background: #fff;
      position: absolute;
      z-index: 5;
    }
  }
}
</style>
