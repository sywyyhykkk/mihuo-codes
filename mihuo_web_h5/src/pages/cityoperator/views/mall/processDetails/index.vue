<template>
  <div>
    <processDetails platform-type="3">
<!--      <template #import>-->
<!--        <el-button-->
<!--          class="btn-add"-->
<!--          size="mini"-->
<!--          style="margin-right: 10px"-->
<!--          @click="handleAddProductCate()"-->
<!--        >-->
<!--          导入工序详情-->
<!--        </el-button>-->
<!--      </template>-->
    </processDetails>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import processDetails from '_c/mall/processDetails/index.vue'
export default defineComponent({
  components: {
    processDetails
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
