<template>
  <addProductNew />
</template>

<script lang="ts" setup>
// 塔台商品分类
const productType = ref([
  { typeName: '材料', type: '1001' },
  { typeName: '线下材料', type: '1010' }
])

provide('productType', productType)
// 交付方式
const deliveryType = ref([
  { name: '简单交付', id: 0 }
])
provide('deliveryType', deliveryType)
</script>

<style scoped>
</style>
