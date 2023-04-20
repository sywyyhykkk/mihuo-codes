<template>
  <div>
    <cmsClassify  button-type="primary" prot-type="1"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import cmsClassify from '@/components/mall/CMS/index.vue'
import wsCache from "@/cache"

export default defineComponent({
  components: {
    cmsClassify
  },
  setup() {
    const state = reactive({

    })
    return {
      ...toRefs(state)
    }
  }
})

</script>

<style scoped lang="less">

</style>
