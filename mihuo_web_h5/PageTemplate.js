const pageTemplate = (name) => {
  return `<template>
  <div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: ${name},
  components: {

  },
  setup() {
    return {

    }
  }
})
</script>

<style lang="less" scoped>
.chart__wrap {
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: @contentBg;
  padding: 10px;
}
</style>
`
}
module.exports = pageTemplate
