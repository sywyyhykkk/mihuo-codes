<template>
  <div>
    <Rank type="1" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Rank from '@/components/Rank/index.vue'

export default defineComponent({
  name: '明星工匠管理',
  components: {
    Rank
  },
  setup() {}
})
</script>

<style scoped lang="less">
</style>
