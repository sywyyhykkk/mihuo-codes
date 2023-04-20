<template>
  <div>
    <div class="sortedContent">
      <el-tooltip
        class="item" effect="dark"
        content="序号" placement="top-start"
      >
        <div
          class="sortIndex" contenteditable
          @input="getTextIndex"
        >{{ list.data.sortIndex }}
        </div>
      </el-tooltip>
      <el-tooltip
        class="item" effect="dark"
        content="内容" placement="top-start"
      >
        <div
          class="wordInput" :class="list.options.classname"
          contenteditable @input="getText"
        >{{ list.content }}
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watchEffect } from 'vue'

export default defineComponent({
  name: 'Sorted',
  props: ['data'],
  setup(props) {
    const list = reactive(props.data)
    const getText = (value) => {
      list.content = value.target.innerText
    }
    const getTextIndex = (value) => {
      list.data.sortIndex = value.target.innerText
    }
    return {
      list,
      getTextIndex,
      getText
    }
  }
})
</script>

<style scoped lang="less">
.sortedContent {
  display: flex;
  align-items: center;

  .sortIndex {
    outline: none;
    border: none;
    height: 21px;
    left: 30px;
    top: 554px;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 21px;
    /* identical to box height */
    color: #BFBFBF;
    min-width: 20px;
  }

  .wordInput {
    padding: 10px 10px 10px 0;
    border-bottom: 1px solid #EBEBEB;
    outline: none;
    flex: 1;
    font-style: normal;
    font-weight: bold;
    color: #606166;
    margin-left: 15px;

    &.small {
      font-size: 1em;
      line-height: 1.5;
    }

    &.default {
      font-size: 1.2em;
      line-height: 1.5;
    }

    &.middle {
      font-size: 1.3em;
      line-height: 1.5;
    }

    &.large {
      font-size: 1.4em;
      line-height: 1.5;
    }
  }
}
</style>
