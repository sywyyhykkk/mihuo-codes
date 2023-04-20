<template>
  <div>
    <template v-if="data.listdata && data.listdata.length > 0">
      <video v-for="item in data.listdata" :key="item.name" :src="$imageGlobal+item.url" controls  style="width: 100%;" />
    </template>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'Video',
  props: ['data']
})
</script>

<style scoped>

</style>
