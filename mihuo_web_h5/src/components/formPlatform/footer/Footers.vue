<template>
  <!--login  -->
  <div class="footer">
    <div class="item0">
      <ul class="item1">
        <li v-for="(item, index) in items" :key="index">{{ item }}</li>
      </ul>
      <p class="copy">
        Copyright © 2021 深圳觅活网络技术有限公司 All Rights Reserved. 粤ICP备50505050号
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const items = reactive(['网站首页', '关于我们', '帮助中心', '联系我们'])
    return {
      items
    }
  }
})
</script>
<style></style>
