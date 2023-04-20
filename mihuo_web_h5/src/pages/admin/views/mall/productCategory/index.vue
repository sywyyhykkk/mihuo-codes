<template>
  <div>
    <productCategory platform-type="1" :prop-company-id="0">

    </productCategory>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import productCategory from '_c/mall/classification/index.vue'
export default defineComponent({
  components: {
    productCategory
  },
  setup() {
    const handleAddProductCate = () => {

    }
    return {
      handleAddProductCate
    }
  }
})
</script>
<style lang="less" scoped>
  .contain-header{
    border-radius:4px ;
    padding: 10px 20px;
    background: #ffffff;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

</style>
