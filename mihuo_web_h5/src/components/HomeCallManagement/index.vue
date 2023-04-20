<template>
  <div class="main-container">
    <el-tabs v-model="activeName" @tab-click="onTabClick">
      <el-tab-pane
        v-for="(item, index) in skillOptions"
        :key="index"
        :label="item.skillName"
        :name="item.skillId"
      />
    </el-tabs>
    <el-collapse v-if="!loading" v-model="activeTabs[currentTab]">
      <el-collapse-item name="服务Banner" title="服务Banner">
        <upload-image v-model="homeCallForm.serviceBanner" :max-count="9" :is-edits="true" />
      </el-collapse-item>
      <el-collapse-item name="服务流程" title="服务流程">
        <AppTextEdit v-model="homeCallForm.serviceFlow" />
      </el-collapse-item>
      <el-collapse-item name="适用需求" title="适用需求">
        <AppTextEdit v-model="homeCallForm.suitableRequirement" />
      </el-collapse-item>
      <el-collapse-item name="服务阶段" :title="`服务阶段(${homeCallForm.serviceStage?.length || 0})`">
        <el-button type="primary" @click="addItem('阶段')">新增阶段</el-button>
        <div v-if="homeCallForm.serviceStage?.length" class="item-container flex-center">
          <el-card
            v-for="(stage, sIndex) in homeCallForm.serviceStage"
            :key="sIndex"
            class="stage-item flex-center"
          >
            <span style="margin-right: 2rem">
              {{ sIndex + 1 + '.' }} {{ stage.stageName }}
            </span>
            <el-button
              type="text"
              class="primary"
              icon="edit"
              @click="editStage(stage, sIndex)"
            >编辑
            </el-button>
            <el-button
              type="text"
              class="danger"
              icon="delete"
              style="margin-left: 0 !important;"
              @click="deleteStage(sIndex)"
            >删除
            </el-button>
          </el-card>
        </div>
      </el-collapse-item>
      <el-collapse-item name="服务评价" title="服务评价">
        <el-button type="primary" @click="addItem('评价')">维护评价</el-button>
      </el-collapse-item>
      <el-collapse-item name="明星管家" :title="`明星管家(${homeCallForm.serviceManager?.length || 0})`">
        <el-button type="primary" @click="addItem('管家')">新增管家</el-button>
        <div v-if="homeCallForm.serviceManager?.length" class="item-container flex-center">
          <el-card
            v-for="(manager, mIndex) in homeCallForm.serviceManager"
            :key="mIndex"
            class="stage-item flex-center"
          >
            <el-avatar :size="40" :src="$getUrl.getPicUrl(manager.managerAvatar)" />
            <span style="margin-right: 2rem">
              {{ manager.managerName }}({{ manager.managerLevel }})
            </span>
            <el-button
              type="text"
              class="primary"
              icon="edit"
              @click="editManager(manager, mIndex)"
            >编辑
            </el-button>
            <el-button
              type="text"
              class="danger"
              icon="delete"
              style="margin-left: 0 !important;"
              @click="deleteManager(mIndex)"
            >删除
            </el-button>
          </el-card>
        </div>
      </el-collapse-item>
      <el-collapse-item name="服务活动" title="服务活动">
        <AppTextEdit v-model="homeCallForm.serviceContent" />
      </el-collapse-item>
    </el-collapse>
    <el-button type="primary" style="margin-top: 2rem" @click="saveForm">保存</el-button>
    <!-- 服务阶段 -->
    <service-stage
      v-if="isShowStage"
      v-model="isShowStage"
      :is-edit="isEditForm"
      :stage-data="currentStage"
      @save="saveItem"
    />
    <!-- 服务评价 -->
    <service-comment
      v-if="isShowComment"
      v-model="isShowComment"
      :comment-data="currentComment"
      :is-edit="isEditForm"
      @save="saveItem"
    />
    <!-- 明星管家 -->
    <service-manager
      v-if="isShowManager"
      v-model="isShowManager"
      :manager-data="currentManager"
      :is-edit="isEditForm"
      @save="saveItem"
    />
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'

// 当前tab
const activeName = ref('')
// 当前展开的tab子项
const activeTabs = ref([])
// 平台工种
const skillOptions = ref<any[]>([])
const loading = ref(true)
// 呼叫工匠内容表单
const homeCallForm = ref({
  id: '',
  serviceBanner: '', // 服务banner
  skillName: '', // 工种名称
  serviceFlow: '[]', // 服务流程
  suitableRequirement: '[]', // 适用需求
  serviceStage: [] as any, // 服务阶段
  serviceComment: {}, // 服务评价
  serviceManager: [] as any, // 明星管家
  serviceContent: '[]' // 服务活动
})

// 呼叫工匠数据
const homeCallData = ref({
  id: '',
  skillId: '', // 工种id
  content: '' // 内容
})

// 当前tab
const currentTab = ref(0)

onMounted(() => {
  getPlatformSkills()
})

// 切换tab
const onTabClick = (tab: any) => {
  currentTab.value = tab.index
  activeName.value = tab.paneName
  getData()
}

// 获取数据
const getData = async () => {
  loading.value = true
  homeCallData.value = {
    id: '',
    skillId: '', // 工种id
    content: '' // 内容
  }
  homeCallForm.value = {
    id: '',
    serviceBanner: '', // 服务banner
    skillName: '', // 工种名称
    serviceFlow: '[]', // 服务流程
    suitableRequirement: '[]', // 适用需求
    serviceStage: [], // 服务阶段
    serviceComment: {}, // 服务评价
    serviceManager: [], // 明星管家
    serviceContent: '[]' // 服务活动
  }
  await fetch({
    url: '/basic/basicskillordertemplate/page',
    params: {
      skillId: activeName.value
    },
    method: 'get'
  }).then((res: any) => {
    if (res && res.data && res.data.records.length) {
      homeCallData.value = res.data.records[0]
      homeCallForm.value = JSON.parse(res.data.records[0].content)
    }
    loading.value = false
  })
}

// 获取平台工种
const getPlatformSkills = async () => {
  await fetch({
    url: '/admin/sysjobskill/getPlatformJobSkill',
    method: 'get'
  }).then((res: any) => {
    if (res && res.data) {
      skillOptions.value = res.data.filter((item: any) => item.quickCallFlag === 1)
      activeName.value = skillOptions.value[0].skillId
      getData()
    }
  })
}

// 保存表单
const saveForm = async () => {
  const data = homeCallForm.value
  data['skillName'] = skillOptions.value.find((item: any) => item.skillId === activeName.value).skillName
  fetch({
    url: '/basic/basicskillordertemplate/createOrModify',
    method: 'post',
    data: {
      id: homeCallData.value.id,
      skillId: activeName.value,
      content: JSON.stringify(data)
    }
  }).then((res: any) => {
    if (res && res.code === 0) {
      ElMessage.success('保存成功')
      getData()
    }
  })
}

// 是否显示新增阶段弹窗
const isShowStage = ref(false)
// 是否显示新增评价弹窗
const isShowComment = ref(false)
// 是否显示新增管家弹窗
const isShowManager = ref(false)
// 是否编辑表单
const isEditForm = ref<boolean>(false)

// 新增子项
const addItem = (type: string) => {
  isEditForm.value = false
  switch (type) {
    case '阶段':
      isShowStage.value = true
      break
    case '评价':
      currentComment.value = JSON.parse(JSON.stringify(homeCallForm.value.serviceComment))
      isShowComment.value = true
      break
    case '管家':
      isShowManager.value = true
      break
    default:
      break
  }
}

// 保存子项
const saveItem = (type: string, data: any) => {
  switch (type) {
    case '阶段':
      if (isEditForm.value) {
        homeCallForm.value.serviceStage.splice(currentStageIndex.value, 1, data)
      } else {
        homeCallForm.value.serviceStage.push(data)
      }
      break
    case '评价':
      homeCallForm.value.serviceComment = data
      break
    case '管家':
      if (isEditForm.value) {
        homeCallForm.value.serviceManager.splice(currentManagerIndex.value, 1, data)
      } else {
        homeCallForm.value.serviceManager.push(data)
      }
      break
    default:
      break
  }
  currentStageIndex.value = -1
}

// 当前编辑的阶段
const currentStage = ref({})
// 当前编辑的阶段索引
const currentStageIndex = ref(-1)

// 编辑阶段
const editStage = (stage: any, index: number) => {
  currentStage.value = JSON.parse(JSON.stringify(stage))
  currentStageIndex.value = index
  isEditForm.value = true
  isShowStage.value = true
}

// 删除阶段
const deleteStage = (index: number) => {
  ElMessageBox.confirm('是否删除该阶段？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    homeCallForm.value.serviceStage.splice(index, 1)
  }).catch(e => {})
}

// 服务评价数据
const currentComment = ref({})

// 当前编辑的管家
const currentManager = ref({})
// 当前编辑的管家索引
const currentManagerIndex = ref(-1)

// 编辑管家
const editManager = (manager: any, index: number) => {
  currentManager.value = JSON.parse(JSON.stringify(manager))
  currentManagerIndex.value = index
  isEditForm.value = true
  isShowManager.value = true
}

// 删除管家
const deleteManager = (index: number) => {
  ElMessageBox.confirm('是否删除该管家？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    homeCallForm.value.serviceManager.splice(index, 1)
  }).catch(e => {})
}
</script>

<style lang="less" scoped>
.main-container {
  padding: 2rem;
}

:deep(.el-tabs__header) {
  margin: 0 !important;
}

.item-container {
  margin-top: 2rem;
  flex-wrap: wrap;
  gap: 2rem;

  .stage-item {
    width: max-content;
    min-width: 30rem;
    max-width: 50rem;
    padding: .4rem;
    border: .1rem solid #a8a8a8;
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
