<template>
  <div>
    <generalMaterial platform-type="1" companyId="1" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import generalMaterial from '_c/mall/generalMaterial/index.vue'
export default defineComponent({
  components: {
    generalMaterial
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
