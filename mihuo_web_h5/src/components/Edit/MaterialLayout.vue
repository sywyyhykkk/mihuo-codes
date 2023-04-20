<template>
  <div>
    <div class="setStyle">边距设置</div>
    <div class="block">
      <span class="demonstration">上边距</span>
      <el-slider
        :min="0"
        :max="80"
        height="20px"
        v-model="list.layout.spacing.marginTop"
      ></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">左边距</span>
      <el-slider
        :min="0"
        :max="80"
        v-model="list.layout.spacing.marginLeft"
      ></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">下边距</span>
      <el-slider
        :min="0"
        :max="8"
        v-model="list.layout.spacing.marginBottom"
      ></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">右边距</span>
      <el-slider
        :min="0"
        :max="80"
        v-model="list.layout.spacing.marginRight"
      ></el-slider>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'MaterialLayout',
  props: ['data'],
  setup(props) {
    const list = reactive(props.data)
    console.log(list)
    return {
      list
    }
  }
})
</script>

<style scoped>
</style>
