<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="$getPression('admin_syscompanybasicinfo_view')" label="基本信息" name="0">
        <basic-info ref="basic_d" />
      </el-tab-pane>
      <el-tab-pane v-if="isAdmin" label="管理员" name="1">
        <Admin ref="admin_d" />
      </el-tab-pane>
      <el-tab-pane v-if="$getPression('admin_syscompanycustomerservicestaffs_view')" label="客服设置" name="2">
        <Customer ref="customer_d" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, provide, ref, watch } from 'vue'
import BasicInfo from '@/components/CompanyInfo/BasicInfo/index.vue'
import Admin from '@/components/CompanyInfo/admin/index.vue'
import Customer from '@/components/CompanyInfo/customer/index.vue'
import { fetch } from '_@/axios-config/axios'
export default defineComponent({
  components: {
    BasicInfo,
    Admin,
    Customer
  },
  setup(props:any, { emit }) {
    const activeName = ref<string>('0')
    const labelPosition = ref('top')
    provide('labelPosition', labelPosition)
    const disabled = ref<boolean>(true)
    provide('disabled', disabled)
    const basic_d:any = ref(null)
    const admin_d:any = ref(null)
    const customer_d:any = ref(null)
    const api_config:any = ref(null)
    const isAdmin = ref<boolean>(false)
    // 判断当前登录账号是否是管理员
    const judgeAdmim = async() => {
      await fetch({ url: '/admin/company/admin/check', method: 'post' })
        .then((res:any) => {
          if (res.code == '0') {
            isAdmin.value = res.data
            activeName.value = '0'
          }
        })
    }
    provide('judgeAdmim', judgeAdmim)
    watch(() => activeName.value, (newv) => {
      switch (newv) {
        case '0':
          basic_d.value.getCompanyData()
          break
        case '1':
          break
        case '2':
          customer_d.value.getTableList()
          break
        case '3':
          api_config.value.getConfig()
          break
        default:
          break
      }
    })
    onMounted(async() => {
      judgeAdmim()
    })
    return {
      activeName,
      basic_d,
      admin_d,
      customer_d,
      api_config,
      judgeAdmim,
      isAdmin
    }
  }
})
</script>

<style scoped lang="less">
.container{
    height: 100%;
    /deep/.el-tabs{
        height: 100%;
        .el-tabs__header{
            margin: 0;
        }
        .el-tabs__content{
            height: calc(100% - 40px);
            overflow-y: auto;
            .el-tab-pane{
                height: 100%;
            }
        }
    }
}
</style>
