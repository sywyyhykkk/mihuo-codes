<template>
  <el-drawer
    v-model="drawerShow"
    title="商品"
    :direction="'rtl'"
    @close="closeHandelDrawer"
    size="49rem"
  >
    <div class="product-detail-page">
      <productDetailPage v-if="drawerShow" :productId="productId" />
    </div>

  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watchEffect, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }, productId: {
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['update:modelValue'])

const productId = ref<any>(0)
const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}


const drawerShow = ref<boolean>(false)

watchEffect(() => {
  drawerShow.value = props.modelValue
  productId.value = props.productId
})

</script>

<style scoped lang="less">
.product-detail-page {
  border-radius: 6px;
  border: 1px solid #909399;
  overflow-y: auto;
  overflow-x: hidden;
  width: 450px;
  height: calc(100% - 40px);
  margin: 20px calc((100% - 450px) / 2);
}


</style>
