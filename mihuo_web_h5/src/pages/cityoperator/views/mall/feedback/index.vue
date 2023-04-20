<template>
  <div>
    <feedback
      :company-id="companyId"
      button-type="primary"
      prot-type="3"
      :cityOperatorId="cityOperatorId"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watchEffect
} from 'vue'
import feedback from '@/components/mall/feedback/feedback.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '意见反馈',
  components: {
    feedback
  },
  setup() {
    const state = reactive({
      companyId: 0
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
