<template>
  <!--login  -->
  <div class="footer">
    <div class="item0">
      <ul class="item1">
        <li v-for="(item, index) in items" :key="index">{{ item }}</li>
      </ul>
      <p class="copy">
        深圳觅活科技有限公司
        <a href="https://beian.miit.gov.cn/">粤ICP备2021133502号</a
        ><a href="https://beian.miit.gov.cn/">粤B2-20211518</a>
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
      items,
    }
  },
})
</script>
<style lang="less" scope>
.copy {
  a {
    list-style: none;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.2);
  }
}
</style>
