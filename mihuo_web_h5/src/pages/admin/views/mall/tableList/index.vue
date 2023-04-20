<template>
  <div>
    <tableList company-id="0" button-type="primary" prot-type="1"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs, watchEffect} from 'vue'
import tableList from '@/components/mall/tableList/index.vue'

export default defineComponent({
  components: {
    tableList
  },
  setup() {
    return {}
  }
})

</script>

<style scoped lang="less">


</style>
