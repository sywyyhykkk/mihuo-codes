<template>
  <div class="wordPage">
    <el-input
      :key="fontStyle.key"
      v-model="list.content"
      :class="list.options.classname"
      type="textarea"
      :input-style="fontStyle"
      autosize
      placeholder="请输入内容"
      @input="handelInput"
    />
  </div>
</template>
<script>
import { defineComponent, reactive, computed, ref, toRefs, watchEffect } from 'vue'

export default defineComponent({
  name: 'Word',
  components: {},
  props: ['data'],
  setup(props) {
    const radio1 = ref('')
    const radio2 = ref('')
    const colors = reactive(['#909199', '#303133', '#606166'])
    const list = reactive(props.data)
    list.style.color.color = list.style.color.color || '#909199'
    const fontStyle = computed(() => {
      const sizeStyle = {}
      for (const key in list.style.size) {
        sizeStyle[key] =
          key === 'fontWeight' || key === 'textAlign'
            ? list.style.size[key]
            : list.style.size[key] + 'px'
      }
      sizeStyle['lineHeight'] = parseInt(list.style.size['fontSize']) + 5 + 'px'
      return {
        ...sizeStyle,
        ...{ color: list.style.color.color },
        ...{ key: new Date().getTime() }
      }
    })
    const handelInput = (val) => {
    }
    const getText = (value) => {
      list.content = value.target.innerText
    }
    return {
      handelInput,
      list,
      colors,
      getText,
      radio1,
      radio2,
      fontStyle
    }
  }
})
</script>

<style scoped lang="less">
.wordPage {
  :deep(.el-textarea__inner) {
    padding: 0;
    border: none;
    resize: none;
  }

  :deep(.el-textarea) {
    width: 100% !important;
  }

  .wordInput {
    outline: none;
  }

  .small {
    font-size: 1em;
    line-height: 1.2em;
  }

  .default {
    font-size: 1.1em;
    line-height: 1.3em;
  }

  .middle {
    font-size: 1.2em;
    line-height: 1.3em;
  }

  .large {
    font-size: 1.3em;
    line-height: 1.4em;
  }
}
</style>
