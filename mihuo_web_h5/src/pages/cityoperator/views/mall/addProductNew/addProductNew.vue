<template>
  <addProductNew />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '添加商品'
})
</script>
<script lang="ts" setup>
// 运营商分类
const productType = ref([
  { typeName: '服务', type: '1002' },
  { typeName: '套餐', type: '1003' },
  { typeName: '优惠券', type: '1020' },
  { typeName: '预付款', type: '1025' }
])

provide('productType', productType)
// 交付方式
const deliveryType = ref([
  { name: '简单交付', id: 0 },
  { name: 'sop交付', id: 1 }
])
provide('deliveryType', deliveryType)
</script>

<style scoped></style>
