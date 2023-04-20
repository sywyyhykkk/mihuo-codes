<template>
  <div>
    <columnIndex
      :company-id="companyId"
      :cityOperatorId="cityOperatorId"
      button-type="primary"
      prot-type="3"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import columnIndex from '_c/mall/columnGroup/column.vue'

export default defineComponent({
  name: '栏目管理',
  components: {
    columnIndex
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
