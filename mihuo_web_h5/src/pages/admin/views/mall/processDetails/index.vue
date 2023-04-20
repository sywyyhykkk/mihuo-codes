<template>
  <div>
    <processDetails platformType="1"/>
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
