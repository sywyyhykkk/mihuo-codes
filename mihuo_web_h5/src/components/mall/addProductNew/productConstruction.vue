<template>
  <div class="product-info">

    <el-form ref="productAttrForm" :model="state.form.productProcess" label-width="120px"
             style="width:calc( 100% - 150px)"
             size="small">
      <el-form-item label="施工内容">
        <AppTextEdit v-model="state.form.productProcess.buildContent" platform-type="2" />
      </el-form-item>
      <el-form-item label="施工流程">
        <title-add v-model="state.form.productProcess.buildProcess" title="添加施工流程" />
      </el-form-item>
      <el-form-item label="施工标准">
        <AppTextEdit v-model="state.form.productProcess.buildStandard" :key="4" platform-type="2" />
      </el-form-item>
      <el-form-item label="验收标准">
        <title-add v-model="state.form.productProcess.checkStandard" title="添加验收标准" :standard="true" />
      </el-form-item>
      <el-form-item label="施工现场">
        <title-add v-model="state.form.productProcess.constructionScene" />
      </el-form-item>
      <el-form-item label="注意事项">
        <AppTextEdit v-model="state.form.productProcess.prompt" :key="2" platform-type="2" />
      </el-form-item>
      <el-form-item label="适用范围">
        <AppTextEdit v-model="state.form.productProcess.scope" :key="2" platform-type="2" />
      </el-form-item>
      <el-form-item label="报价说明">
        <AppTextEdit v-model="state.form.productProcess.priceDescription" :key="2" platform-type="2" />
      </el-form-item>
      <el-form-item label="工程质保权益">
        <AppTextEdit v-model="state.form.productProcess.qualityRight" :key="3" platform-type="2" />
      </el-form-item>
    </el-form>

  </div>

</template>

<script lang="ts" setup>

import { defineEmits, defineExpose, defineProps, reactive } from 'vue'

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
