<template>
  <el-container>
    <el-header class="header">
      <div class="company">
        <el-image
          preview-teleported
          style="width: auto; height: 60px; border-radius: 6px"
          lazy
          :src="$getUrl.getPicUrl(url.companyLogo, true)"
          :preview-src-list="$getUrl.getPicUrl(url.companyLogo)"
        />
        <div class="company-name">{{ url.companyName }}</div>
      </div>
    </el-header>
    <el-main>
      <company-tabs />
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { defineComponent, onMounted, provide, ref } from 'vue'
import CompanyTabs from '@/components/CompanyInfo/CompanyTabs.vue'
// import { getCompany } from '@/pages/admin/api/companyInfo';
import { fetch } from '_@/axios-config/axios'
export default defineComponent({
  name: '企业信息',
  components: {
    CompanyTabs
  },
  setup(props: any, { emit }) {
    let url: any = ref('')
    provide('url', url)
    onMounted(async () => {})
    return {
      url
    }
  }
})
</script>

<style scoped lang="less">
.el-container {
  height: calc(100vh - 110px);
  .header {
    height: 200px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .el-image {
      width: auto !important;
      margin-bottom: 20px;
      image-rendering: -webkit-optimize-contrast;
    }
    .company-name {
      font-size: 16px;
      color: #262626;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-weight: 400;
    }
  }
}
</style>
