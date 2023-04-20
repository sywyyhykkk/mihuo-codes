<template>
  <div>
    <div class="sortedContent">
      <span type="number" class="unSortIndex" />
      <div
        class="wordInput" :class="list.options.classname"
        contenteditable @input="getText"
      >{{ list.content }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'UnSorted',
  props: ['data'],
  setup(props) {
    const list = reactive(props.data)
    const getText = (value) => {
      list.content = value.target.innerText
    }
    return {
      list,
      getText
    }
  }
})
</script>

<style scoped lang="less">
.sortedContent {
  display: flex;
  align-items: center;

  .unSortIndex {
    background: #666;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    margin: 0 15px 0 0;
  }

  .wordInput {
    padding: 10px 10px 10px 0;
    border-bottom: 1px solid #EBEBEB;
    outline: none;
    flex: 1;
    line-height: 20px;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    color: #606166;
  }
}
</style>
