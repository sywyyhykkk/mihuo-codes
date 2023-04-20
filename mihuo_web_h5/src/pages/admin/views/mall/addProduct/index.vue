<template>
  <div>
    <addProduct company-id="0" button-type="primary" prot-type="1"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs, watchEffect} from 'vue'
import addProduct from '@/components/mall/addProduct/addProduct.vue'

export default defineComponent({
  components: {
    addProduct
  },
  setup() {
    return {}
  }
})

</script>

<style scoped lang="less">


</style>
