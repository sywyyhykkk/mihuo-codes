<template>
  <div>
    <commodityType :company-id="0" button-type="primary" :prot-type="1" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import commodityType from '@/components/mall/commodityType/commodityType.vue'

export default defineComponent({
  components: {
    commodityType
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="less"></style>
