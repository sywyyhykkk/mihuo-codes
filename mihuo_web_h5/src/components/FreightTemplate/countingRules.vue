<template>
  <el-card class="box-card" shadow="always">
    <template #header>
      <div class="card-header flex-center">
        <span class="title">计费规则</span>
      </div>
    </template>
    <div style="margin-top: 2rem;">
      <div v-if="chargeRule === '1'" class="card-content">
        <span class="content">
          若多个sku对应同一运费模版，则这几个sku先按件数叠加后，再按该运费模版的规则计算
        </span>
      </div>
      <div v-else class="card-content">
        <span class="content">
          以运费最高的商品的费用作为总费用
        </span>
      </div>
      <div class="rules-radio flex-center">
        <el-radio-group v-model="chargeRule">
          <el-radio label="1" size="large">叠加费用</el-radio>
          <el-radio label="2" size="large">按最高商品费用计算</el-radio>
        </el-radio-group>
        <el-button
          style="margin: 0 0 0 4rem !important;"
          type="primary"
          @click="saveChargeRule"
        >保存</el-button>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { setFreightTemplateRule, getFreightTemplateRule, getInstallationTemplateRule, setInstallationTemplateRule } from '_c/FreightTemplate/api'
import { ElMessage } from 'element-plus'

// 计费规则 0=叠加运费 1=按最高商品运费计算
const chargeRule = ref<String>('')

const props = defineProps({
  // type=1 运费模版计费规则 type=2 入户/安装费模版计费规则
  type: {
    type: Number,
    default: 1
  }
})

onMounted(() => {
  getRules()
})

// 保存设置计费规则
const saveChargeRule = async () => {
  if (props.type === 1) {
    // 保存运费模版计费规则
    const res: any = await setFreightTemplateRule(
      chargeRule.value
    )
    if (res && res.code === 0) {
      ElMessage.success('设置计费规则成功')
      await getRules()
    }
  } else {
    // 保存入户/安装费模版计费规则
    const res: any = await setInstallationTemplateRule(
      chargeRule.value
    )
    if (res && res.code === 0) {
      ElMessage.success('设置计费规则成功')
      await getRules()
    }
  }
}

const getRules = async () => {
  if (props.type === 1) {
    // 保存运费模版计费规则
    const res: any = await getFreightTemplateRule()
    if (res && res.code === 0) {
      chargeRule.value = res.data + ''
    }
  } else {
    // 保存入户/安装费模版计费规则
    const res: any = await getInstallationTemplateRule()
    if (res && res.code === 0) {
      chargeRule.value = res.data + ''
    }
  }
}

</script>

<style lang="less" scoped>
.box-card {
  width: 45rem;
  height: 20rem;
  padding: 2rem;
  margin-right: 5rem;
  box-shadow: var(--el-box-shadow-light) !important;

  .card-header{
    justify-content: space-between;

    .title {
      font-size: 2rem;
      font-weight: bold;
    }
  }

  .card-content {
    width: 100%;
    height: 5rem;

    .content {
      line-height: 3rem;
      color: #666;
    }
  }

  .rules-radio {
    margin-top: 2rem;
  }
}
</style>
