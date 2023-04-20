<template>
  <div>
    <processType platform-type="3">
      <el-button
        class="btn-add"
        size="mini"
        @click="handleAddProductCate()"
      >
        导入平台分类
      </el-button>
    </processType>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import processType from '_c/mall/processType/index.vue'
export default defineComponent({
  components: {
    processType
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
