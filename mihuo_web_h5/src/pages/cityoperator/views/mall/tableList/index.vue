<template>
  <div>
    <TableList button-type="primary" :prot-type="3" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import TableList from '@/components/mall/tableList/index.vue'

export default defineComponent({
  name: '商品列表',
  components: {
    TableList
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

<style scoped lang="less"></style>
