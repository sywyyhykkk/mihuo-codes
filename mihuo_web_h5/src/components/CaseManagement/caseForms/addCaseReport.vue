<template>
  <div>
    <el-drawer
      v-model="isShowDrawer"
      size="45%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="案例报告维护"
      @close="hideDrawer"
    >
      <el-tabs
        v-model="activeName"
        editable
        @edit="handleTabsEdit"
      >
        <el-tab-pane
          v-for="(item, index) in caseReports"
          :key="index"
          :label="item.label + `(${item.reports.length})`"
          :name="item.value"
        >
          <div class="box-card">
            <div
              class="flex-center"
              style="justify-content: space-between; margin-bottom: 2rem"
            >
              <span>{{ item.label }}</span>
              <div class="flex-center">
                <el-button plain @click="getTemplateByType(item.type, index)">
                  {{ `新增${item.label}` }}
                </el-button>
                <el-button plain @click="editReportGroup(item, index)">
                  编辑分组
                </el-button>
              </div>
            </div>
            <div>
              <div
                v-for="(reportItem, index2) in item.reports"
                :key="index2"
                class="report-item"
              >
                <!-- 问卷模版 -->
                <div v-if="item.type === 1">
                  <el-collapse v-model="collapseName">
                    <el-collapse-item :name="index2" style="padding: 0 1rem !important;">
                      <template #title>
                        <div class="drawer-header">
                          <div class="left">
                            {{ reportItem.report.surveyName }}
                            <div class="time">({{ reportItem.time }})</div>
                            <el-icon :size="16" style="margin-left: .4rem" @click.stop="editReportTime(index, index2)">
                              <Edit />
                            </el-icon>
                          </div>
                          <div class="right">
                            <el-button
                              type="text"
                              class="danger"
                              icon="delete"
                              @click.stop="deleteReport(item.label, index, index2)"
                            >删除报告
                            </el-button>
                          </div>
                        </div>
                      </template>
                      <survey-preview-box
                        :report-time="reportItem.time"
                        width="68rem"
                        :disabled="false"
                        :survey-id="reportItem.report.id"
                        :data="JSON.stringify(reportItem.report)"
                        :is-show-button="true"
                        @saveSurvey="saveAnswer($event, index, index2)"
                        @deleteReport="deleteReport($event, index, index2)"
                      />
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <!-- 验收模版 -->
                <div v-else>
                  <el-collapse v-model="collapseName">
                    <el-collapse-item :name="index2" style="padding: 0 1rem !important;">
                      <template #title>
                        <div class="drawer-header">
                          <div class="left">
                            {{ reportItem.acceptanceName }}
                            <div class="time">({{ reportItem.time }})</div>
                            <el-icon :size="16" style="margin-left: .4rem" @click.stop="editReportTime(index, index2)">
                              <Edit />
                            </el-icon>
                          </div>
                          <div class="right">
                            <el-button
                              type="text"
                              class="danger"
                              icon="delete"
                              @click.stop="deleteReport(item.label, index, index2)"
                            >删除报告
                            </el-button>
                          </div>
                        </div>
                      </template>
                      <div style="padding: 0 1rem;">
                        <div>验收结论</div>
                        <div>
                          <el-radio-group v-model="reportItem.isPass">
                            <el-radio label="1" size="large">验收通过</el-radio>
                            <el-radio label="2" size="large">验收不通过</el-radio>
                          </el-radio-group>
                        </div>
                        <el-divider />
                        <div v-for="(child, index3) in reportItem.items" :key="index3">
                          <div style="font-size: 1.5rem"> {{ index3 + 1 }}. {{ child.itemName }}</div>
                          <div style="display: flex; flex-direction: column; justify-content: flex-start">
                            <div>标准: {{ child.standard }}</div>
                            <div v-if="child.standardImg">
                              标准图片:
                              <div style="display: flex; flex-wrap: wrap">
                                <img
                                  v-for="(img, imgIndex) in child.standardImg ? child.standardImg.split(',') : []"
                                  :key="imgIndex"
                                  class="standard-img"
                                  :src=" $getUrl.getPicUrl(img)"
                                >
                              </div>
                            </div>
                          </div>
                          <div style="margin-top: .1rem">
                            现场图片:
                            <uploadImage
                              v-model="child.realImg"
                              :max-count="9"
                              :is-edits="false"
                            />
                          </div>
                          <el-radio-group v-model="child.isPass">
                            <el-radio label="1" size="large">通过</el-radio>
                            <el-radio label="2" size="large">不通过</el-radio>
                          </el-radio-group>
                          <el-divider />
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <div
                  v-if="item.reports.length === 0"
                  style="color: #a8a8a8; font-size: 1.4rem"
                >
                  暂无{{ item.label }}报告
                  <span />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveDrawer">保存</el-button>
          <el-button @click="hideDrawer">取消</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog
      v-model="isShowTemplatesDialog"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="关联模版"
      @close="hideDialog"
    >
      <div>
        <el-form>
          <el-form-item label="关联模版">
            <el-select
              v-if="currentType === 1"
              v-model="relatedSurveyReportId"
              filterable
              placeholder="请选择关联问卷模版"
            >
              <el-option
                v-for="(option, index) in surveyTemplatesList"
                :key="index"
                :label="option.surveyName"
                :value="option.id"
              />
            </el-select>
            <el-select
              v-else
              v-model="relatedAcceptanceReportId"
              filterable
              placeholder="请选择关联验收模版"
            >
              <el-option
                v-for="(option, index) in acceptanceTemplatesList"
                :key="index"
                :label="option.acceptanceName"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间" prop="time">
            <el-date-picker
              v-model="reportTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              placeholder="请选择报告提交时间"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveTemplateForm">保存</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="isShowTempTimeDialog"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="修改报告时间"
      @close="hideDialog"
    >
      <div style="padding: 2rem">
        <el-date-picker
          v-model="tempTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          placeholder="请选择报告提交时间"
        />
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveTempReportTime">保存</el-button>
          <el-button @click="hideTempReportTimeDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="isShowAddGroup"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="新增报告类型"
      @close="hideGroupDialog"
    >
      <el-form
        ref="reportGroupFormRef"
        :model="reportGroupForm"
        :rules="reportGroupFormRules"
        label-width="10rem"
      >
        <el-form-item label="分组名称" prop="label">
          <el-input
            v-model="reportGroupForm.label"
            maxlength="8"
            placeholder="请输入分组名称"
          />
        </el-form-item>
        <el-form-item label="分组类型" prop="type">
          <el-select
            v-model="reportGroupForm.type"
          >
            <el-option
              v-for="(item, index) in [{label: '问卷模版', value: 1}, {label: '验收模版', value: 2}]"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveReportGroup">保存</el-button>
          <el-button @click="hideGroupDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  editCase,
  getSurveyTemplate,
  getSurveyTemplateById,
  getAcceptanceTemplate
} from '_c/CaseManagement/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: () => ({})
  }
})

// 当前tab
const activeName = ref(1)
// 报告类型
// type=1交底报告和巡检报告关联问卷模版 type=2管家自检和专项验收关联验收模版
const caseReports = ref(
  props.row.homeInspection === null ? []
    : JSON.parse(props.row.homeInspection)?.length === 0
      ? []
      : JSON.parse(props.row.homeInspection)
)

// 是否显示新增按钮
const isShowAddGroup = ref(false)
// 是否是编辑分组
const isEditReportGroup = ref(false)
// 当前编辑的分组index
const currentReportGroupIndex = ref(-1)
const reportGroupFormRef = ref()
const reportGroupForm = ref({
  label: '',
  type: 1,
  value: 0,
  reports: [] as any
})
const reportGroupFormRules = {
  label: [
    { required: true, message: '分组名称不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '分组类型不能为空', trigger: 'blur' }
  ]
}

// 隐藏新增报告类型弹窗
const hideGroupDialog = () => {
  reportGroupForm.value = {
    label: '',
    type: 1,
    value: 0,
    reports: [] as any
  }
  isShowAddGroup.value = false
  isEditReportGroup.value = false
  currentReportGroupIndex.value = -1
}

// 保存新增报告类型
const saveReportGroup = () => {
  const forms: any = unref(reportGroupFormRef)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      const fIndex = caseReports.value.findIndex((item: any) => (item.label === reportGroupForm.value.label) && item.value !== reportGroupForm.value.value)
      if (fIndex !== -1) {
        ElMessage.warning(`已存在${reportGroupForm.value.label}!`)
        return
      }
      if (isEditReportGroup.value) {
        // 编辑
        const obj = JSON.parse(JSON.stringify(reportGroupForm.value))
        caseReports.value[currentReportGroupIndex.value] = obj
      } else {
        // 新增
        const obj = JSON.parse(JSON.stringify(reportGroupForm.value))
        obj['value'] = caseReports.value.length + 1
        caseReports.value.push(obj)
      }
      hideGroupDialog()
    }
  })
}

// 编辑报告类型
const editReportGroup = (item: any, index: number) => {
  const oldGroup = JSON.parse(JSON.stringify(item))
  reportGroupForm.value = { ...oldGroup }
  isShowAddGroup.value = true
  isEditReportGroup.value = true
  currentReportGroupIndex.value = index
}

// 新增报告类型
const handleTabsEdit = (targetName: string, action: 'remove' | 'add') => {
  if (action === 'add') {
    // 新增类型
    isShowAddGroup.value = true
  } else {
    // 删除类型
    ElMessageBox.confirm(`此操作将删除该分组及该分组内所有报告, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const tabs = caseReports.value
      if (activeName.value === +targetName) {
        tabs.forEach((tab: any, index: number) => {
          if (tab.value === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName.value = nextTab.value
            }
          }
        })
      }
      ElMessage.success('删除成功')
      caseReports.value = tabs.filter((tab: any) => tab.value !== +targetName)
    }).catch(e => {})
  }
}

const collapseName = ref('')
const emit = defineEmits(['update:modelValue', 'getData'])
// 案例ID
const caseId = ref(props.row?.id)
// 控制表单的显示/隐藏
const isShowDrawer = ref(false)

watchEffect(() => {
  isShowDrawer.value = props.modelValue
})

// 问卷模版列表
const surveyTemplatesList = ref([])
// 验收模版列表
const acceptanceTemplatesList = ref([])
// 当前显示的问卷模版类型
const currentType = ref(0)
// 是否显示关联问卷模版弹窗
const isShowTemplatesDialog = ref(false)
// 关联问卷模版id
const relatedSurveyReportId = ref('')
// 关联验收模版id
const relatedAcceptanceReportId = ref('')
// 报告提交时间
const reportTime = ref('')
// 当前选择的报告index
const currentReportIndex = ref(-1)
// 获取模版
const getTemplateByType = async (type: number, index: number) => {
  currentType.value = type
  currentReportIndex.value = index
  if (type === 1) {
    // 获取问卷模版
    const res = await getSurveyTemplate({
      size: 99
    })
    if (res && res.data) {
      if (res.data.records.length === 0) {
        ElMessage.warning(`当前运营商未配置问卷模版`)
      } else {
        surveyTemplatesList.value = res.data.records
        isShowTemplatesDialog.value = true
      }
    }
  } else {
    // 获取验收模版
    const res = await getAcceptanceTemplate({})
    if (res && res.data) {
      if (res.data.length === 0) {
        ElMessage.warning(`当前运营商未配置验收模版`)
      } else {
        acceptanceTemplatesList.value = res.data
        isShowTemplatesDialog.value = true
      }
    }
  }
}

// 修改报告时间绑定值
const tempTime = ref('')
// 当前修改的报告时间表单index array
const reportIndexArr = ref<any>([])
const isShowTempTimeDialog = ref(false)

// 修改报告时间
const editReportTime = (index: number, index2: number) => {
  reportIndexArr.value.push(index)
  reportIndexArr.value.push(index2)
  const currentType = JSON.parse(JSON.stringify(caseReports.value[index]))
  tempTime.value = currentType.reports[index2].time
  isShowTempTimeDialog.value = true
}

// 保存修改报告时间
const saveTempReportTime = () => {
  caseReports.value[reportIndexArr.value[0]].reports[reportIndexArr.value[1]].time = tempTime.value
  hideTempReportTimeDialog()
}

// 取消修改报告时间
const hideTempReportTimeDialog = () => {
  tempTime.value = ''
  reportIndexArr.value = []
  isShowTempTimeDialog.value = false
}

// 删除报告
const deleteReport = (name: string, index: number, index2: number) => {
  ElMessageBox.confirm(`此操作将删除该${name}报告, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const currentType = JSON.parse(JSON.stringify(caseReports.value[index]))
      currentType.reports.splice(index2, 1)
      caseReports.value[index]['reports'] = currentType.reports
    })
    .catch((e) => {})
}

// 保存答案
const saveAnswer = (data: any, index: number, index2: number) => {
  caseReports.value[index].reports[index2].report.surveyTemplatePartDTOList =
    data
  ElMessage.success('保存答案成功')
}

// 保存关联问卷模版弹窗
const saveTemplateForm = () => {
  if (!reportTime.value) {
    ElMessage.warning('请选择报告提交时间')
    return
  }
  if (currentType.value === 1) {
    if (!relatedSurveyReportId.value) {
      ElMessage.warning('请选择要关联的模版')
      return
    }
    getTemplateById()
  } else {
    if (!relatedAcceptanceReportId.value) {
      ElMessage.warning('请选择要关联的模版')
      return
    }
    getAcceptanceTemplateById()
  }
}

// 当前选择的验收模版
const currentAcceptanceReport = ref<any>({})

// 保存验收模版到报告
const getAcceptanceTemplateById = async () => {
  await fetch({
    url: `/basic/acceptance_template/getTemplateItems?templateId=${relatedAcceptanceReportId.value}`,
    method: 'get'
  }).then((res: any) => {
    if (res.data && res.data.records) {
      const report = acceptanceTemplatesList.value.find((item: any) => item.id === relatedAcceptanceReportId.value)
      currentAcceptanceReport.value = report || {}
      const arr = res.data.records
      arr.forEach((template: any) => {
        template.acceptanceName = template.itemName
        template['isPass'] = '1' // 验收模版默认通过
      })
      caseReports.value[currentReportIndex.value]['reports'].push({
        id: currentAcceptanceReport.value.acceptanceName,
        acceptanceName: currentAcceptanceReport.value.acceptanceName,
        items: arr,
        time: reportTime.value
      })
      currentReportIndex.value = -1
      relatedAcceptanceReportId.value = ''
      reportTime.value = ''
      isShowTemplatesDialog.value = false
    }
  })
}

// 获取问卷模版
const getTemplateById = async () => {
  const res = await getSurveyTemplateById(relatedSurveyReportId.value)
  if (res && res.data) {
    caseReports.value[currentReportIndex.value]['reports'].push({
      report: res.data,
      time: reportTime.value
    })
    relatedSurveyReportId.value = ''
    reportTime.value = ''
    isShowTemplatesDialog.value = false
  }
}

// 隐藏日志表单
const hideDialog = () => {
  isShowTemplatesDialog.value = false
}

const hideDrawer = () => {
  isShowDrawer.value = false
  emit('update:modelValue', false)
}

// 保存问卷维护
const saveDrawer = async () => {
  const response = await editCase({
    id: caseId.value,
    ...props.row,
    homeInspection: JSON.stringify(caseReports.value) // 案例报告
  })
  if (response && response.data) {
    ElMessage.success('保存成功')
    emit('update:modelValue', false)
    emit('getData')
  }
}

</script>

<style lang="less" scoped>
.box-card {
  width: 74rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.report-item {
  border: 1px #a8a8a8 solid;
  margin-bottom: 2rem;
}

.standard-img {
  width: 10rem;
  height: 10rem;
  border-radius: .5rem;
  margin-right: 1rem;
}

.drawer-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    flex: 1;
    font-weight: bold;
    display: flex;
    align-items: center;

    .time {
      margin-left: 1rem;
      font-size: .8rem;
      color: #a8a8a8;
      font-weight: normal;
    }
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.flex-center {
  display: flex;
  align-items: center;
}

:deep(.el-tabs__new-tab){
  color: #000000;
  border-color: #000000;
}

:deep(.el-collapse-item:last-child){
  margin-bottom: 0;
}
</style>
