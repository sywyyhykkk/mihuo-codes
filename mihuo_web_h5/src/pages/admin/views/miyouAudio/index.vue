<template>
  <div>
    <MiyouCircle prot-type="3" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import MiyouCircle from '_c/MiyouCircle/index.vue'

export default defineComponent({
  components: {
    MiyouCircle
  },
  setup() {}
})
</script>

<style scoped lang="less">
</style>
