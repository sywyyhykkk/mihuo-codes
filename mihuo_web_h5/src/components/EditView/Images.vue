<template>
  <div
    class="image-box"
    :class="className"
  >
    <template v-if="data.listdata && data.listdata.length > 0">
      <img
        v-for="(item, index) in data.listdata"
        :key="index"
        :src="$imageGlobal+item.url"
      >
    </template>
  </div>
</template>
<script>
import { defineComponent, markRaw } from 'vue'
export default defineComponent({
  name: 'Images',
  props: ['data', 'className']
})
</script>

<style lang="less" scoped>
.image-box{
    overflow: hidden;
    img{
        width: 355px;
    }
}
</style>
