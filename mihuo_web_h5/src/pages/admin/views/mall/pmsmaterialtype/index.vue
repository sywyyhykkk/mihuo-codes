<template>
    <materialType platform-type="1" company-id="" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import materialType from '_c/mall/materialType/index.vue'
export default defineComponent({
  components: {
    materialType
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
