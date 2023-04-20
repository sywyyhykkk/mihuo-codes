<template>
  <div class="column">
    <projectTemplateNew pageType="1" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '服务包SOP'
})
</script>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue'

const state = reactive({
  activeName: 0
})
</script>

<style scoped>
</style>
