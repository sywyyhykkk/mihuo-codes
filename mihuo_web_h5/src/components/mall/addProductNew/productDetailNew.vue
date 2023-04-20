<template>
  <div class="product-info">
    <el-form
      ref="ruleForms"
      :model="state.form"
      :rules="rules"
      label-width="12rem"
    >
      <el-form-item label="质保">
        <el-input v-model="state.form.qualityAssurance" />
      </el-form-item>
      <el-form-item label="计价">
        <el-input v-model="state.form.pricingRules" />
      </el-form-item>
      <el-form-item label="详细页标题">
        <el-input v-model="state.form.detailTitle" />
      </el-form-item>
      <el-form-item>
        <AppTextEdit
          :key="1"
          v-model="state.form.detailDesc"
          platform-type="2"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>

import { defineEmits, defineProps, reactive, defineExpose } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: {}
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits()

const state = reactive({
  form: props.modelValue as any
})

const handleFinishCommit = (callBack: any) => {
  callBack(true)
}
defineExpose({ handleFinishCommit })

</script>

<style scoped lang="less">
.product-info {
  //background: #FFFFFF;
  //border-radius: 4px;
  position: absolute;
  top: 8.6rem;
  bottom: 8.6rem;
  left: 2rem;
  right: 2rem;
  padding: 0 2rem;
  background: #FFFFFF;
  border-radius: 4px;
  padding: 2rem;
  margin: 2rem 0;
  overflow-y: auto;
}

</style>
