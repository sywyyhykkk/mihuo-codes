<template>
  <div class="main-container">
    <el-button type="primary" :disabled="serviceList.length === 3" @click="addNewService()">
      新增服务
    </el-button>
    <home-service-selector
      v-if="isShowAddServiceDialog"
      v-model="isShowAddServiceDialog"
      :service-list-options="serviceListOptions"
      @close="onCloseServiceSelector"
      @save="saveNewService"
    />
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in serviceList"
        :key="index"
        :label="item.name || JSON.parse(item.content).name"
        :name="item.code"
      >
        <div v-if="!loading">
          <div>
            <el-button type="primary" @click="saveData">保存</el-button>
            <el-button
              type="text"
              class="danger"
              icon="remove"
              @click="clearData(item.content)"
            >清空</el-button>
          </div>
          <home-service v-if="item.content" v-model="item.content" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { homeServiceData, processFormRules as flowFormRules } from '_c/HomeServiceManagement/data'
import { fetch } from '_@/axios-config/axios'
import HomeServiceSelector from '_c/HomeServiceManagement/homeServiceSelector.vue'

// 当前tab
const activeName:any = ref('')
provide('current', activeName)
// 首页服务列表
const serviceList = ref<any[]>([])

const serviceListOptions = ref([
  {
    name: '全屋装修',
    code: 'home_service_1',
    ...homeServiceData
  },
  {
    name: '精装改造',
    code: 'home_service_2',
    ...homeServiceData
  },
  {
    name: '旧房局改',
    code: 'home_service_3',
    ...homeServiceData
  }
])
// 工种列表
const skillOptions = ref<any[]>([])

onMounted(() => {
  getData()
  getPlatformSkills()
})

// 获取平台工种
const getPlatformSkills = async () => {
  await fetch({
    url: '/admin/sysjobskill/getPlatformJobSkill',
    method: 'get'
  }).then((res: any) => {
    if (res && res.data) {
      skillOptions.value = res.data.filter((item: any) => item.quickCallFlag === 1)
    }
  })
}

const loading = ref(true)
const getData = async () => {
  loading.value = true
  await fetch({
    url: '/basic/basicservicetemplate/page',
    method: 'get'
  }).then((res: any) => {
    setTimeout(() => {
      loading.value = false
    }, 100)
    if (res && res.code === 0 && res.data.records !== 0) {
      serviceList.value = res.data.records
      serviceList.value.forEach((item: any) => {
        item.content = JSON.parse(item.content)
        item.content['serviceBanner'] = item.content.serviceBanner && item.content.serviceBanner.length ? item.content.serviceBanner : []
        item.content['aiPrice'] = item.content.aiPrice ? item.content.aiPrice : ''
        item['name'] = item.content.name
        item.content = JSON.stringify(item.content)
      })
      activeName.value = serviceList.value[0]?.code
    }
  })
}

// 保存数据
const saveData = async () => {
  const find = serviceList.value.find((item: any) => item.code === activeName.value)
  if ((find.content).constructor === Object) {
    find.content = JSON.stringify(find.content)
  }
  await fetch({
    url: '/basic/basicservicetemplate/createOrModify',
    data: {
      code: activeName.value,
      content: find
    },
    method: 'post'
  }).then((res: any) => {
    if (res && res.code === 0) {
      ElMessage.success('保存成功')
      getData()
    }
  })
}

// 清空数据
const clearData = async (item: any) => {
  const obj = {
    ...homeServiceData,
    code: activeName.value,
    name: JSON.parse(item).name
  }
  ElMessageBox.confirm(`确定删除${JSON.parse(item).name}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await fetch({
      url: '/basic/basicservicetemplate/createOrModify',
      data: {
        code: activeName.value,
        content: JSON.stringify(obj)
      },
      method: 'post'
    }).then((res: any) => {
      if (res && res.code === 0) {
        ElMessage.success('清空成功')
        getData()
      }
    })
  }).catch(e => {})
}

// 是否显示新增首页服务弹窗
const isShowAddServiceDialog = ref(false)

// 显示新增首页服务弹窗
const addNewService = () => {
  isShowAddServiceDialog.value = true
}

// 保存新增首页服务
const saveNewService = (newService: any, serviceValue: string) => {
  const findIndex = serviceList.value.findIndex((item: any) => item.code === newService.code)
  if (findIndex != -1) {
    ElMessage.warning(`已有${newService.name}`)
    return
  }
  const obj = {
    code: newService.code,
    name: newService.name,
    content: JSON.stringify({
      ...newService,
      name: newService.name
    })
  }
  serviceList.value.push(obj)
  activeName.value = serviceValue
  serviceListOptions.value.forEach((item: any) => {
    if (item.code === serviceValue) {
      item.disabled = true
    }
  })
}

// 关闭新增首页服务弹窗
const onCloseServiceSelector = () => {
  isShowAddServiceDialog.value = false
}

// 编辑装修流程
const editProcess = (index: number) => {

}

// 删除装修流程
const deleteProcess = (index: number) => {
  ElMessageBox.confirm('确定删除该装修流程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {

  }).catch(e => {})
}

// 移动装修流程
const moveProcess = (item: any, index: number) => {

}

</script>

<style lang="less" scoped>
.main-container {
  padding: 2rem;
}
</style>
