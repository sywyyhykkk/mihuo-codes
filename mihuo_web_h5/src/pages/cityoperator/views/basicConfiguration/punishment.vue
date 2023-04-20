<template>
  <Punishment pro-type-name="运营端" />
</template>

<script>
import { defineComponent, toRefs } from 'vue'
import Punishment from '../../../../components/TemplateConfig/index'

export default defineComponent({
  name: '奖惩规则',
  components: { Punishment },
  setup() {
    return {}
  }
})
</script>

<style scoped>
</style>
