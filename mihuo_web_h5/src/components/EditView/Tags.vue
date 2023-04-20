<template>
  <div class="block">
    <div v-if="list.listdata.length">
      <el-tag
        v-for="item in list.listdata" :key="item.name"
        :color="item.color"
      >
        <span :style="{color:item.fontColor}">{{ item.name }}</span>
      </el-tag>
    </div>
    <el-tag v-else>请添加标签</el-tag>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'Tags',
  props: ['data'],
  setup(props) {
    const list = reactive(props.data)
    return {
      list
    }
  }
})
</script>

<style scoped>

</style>
