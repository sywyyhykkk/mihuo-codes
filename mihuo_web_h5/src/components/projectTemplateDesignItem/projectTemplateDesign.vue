<template>
  <div style="height: calc(100vh - 20rem); padding-top: 2rem">
    <div>
      <section class="section-cot">
        <div id="container">
          <header>
            <el-tooltip
              class="item"
              effect="dark"
              content="添加阶段"
              placement="bottom"
            >
              <el-icon size="14px" @click="addPhase()">
                <circle-plus-filled color="#666" />
              </el-icon>
            </el-tooltip>
          </header>
          <div id="graph-container" ref="container" />
        </div>
      </section>
    </div>
    <el-dialog
      v-if="addTemplatePhaseShow"
      v-model="addTemplatePhaseShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="配置阶段"
    >
      <div class="c">
        <el-form
          ref="templateFormPhaseRef"
          :rules="rulesPhase"
          :model="state.templatePhaseForm"
          label-width="9rem"
        >
          <el-form-item label="阶段名称" prop="name">
            <el-input v-model="state.templatePhaseForm.name" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input
              v-model="state.templatePhaseForm.sort"
              type="number"
              style="width: 19rem"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveTemplatePhase">确 定</el-button>
          <el-button @click="addTemplatePhaseShow = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-if="addTemplatePhaseChildShow"
      v-model="addTemplatePhaseChildShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="配置子节点"
      width="56rem"
    >
      <el-form
        ref="templateFormPhaseChildRef"
        :rules="rulesChildNode"
        :model="state.templatePhaseChildForm"
        label-width="12rem"
      >
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="state.templatePhaseChildForm.name" />
        </el-form-item>
        <el-form-item label="关联功能" prop="businessType">
          <div class="business-type-contain">
            <el-radio-group
              v-model="state.templatePhaseChildForm.businessType"
              @change="businessTypeChange"
            >
              <el-radio
                v-for="(item, index) in businessTypeList"
                :key="index"
                class="el-radio-item"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item
          v-if="state.templatePhaseChildForm.businessType === 1001"
          label="材料分类"
          prop="materialType"
        >
          <el-select
            v-model="state.templatePhaseChildForm.materialType"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in materialTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div v-if="state.templatePhaseChildForm.businessType === 1002">
          <el-form-item label="自动派单" prop="orderType">
            <el-switch
              v-model="state.templatePhaseChildForm.orderType"
              active-color="#409EFF "
              :active-value="1"
              :inactive-value="0"
              inactive-color="#E4E7ED"
            />
          </el-form-item>
          <el-form-item
            v-if="state.templatePhaseChildForm.orderType === 1"
            label="提前派单天数"
            prop="materialType"
          >
            <el-input
              v-model="state.templatePhaseChildForm.orderSendDay"
              type="number"
              style="width: 19rem"
            >
              <template #append>天</template>
            </el-input>
          </el-form-item>
        </div>
        <!--          派单、评价-->
        <el-form-item
          v-if="
            [1002, 1009].includes(state.templatePhaseChildForm.businessType)
          "
          :label="jobLabel"
          prop="skillId"
        >
          <el-select
            v-model="state.templatePhaseChildForm.skillId"
            placeholder="请选择"
            @change="getOrderSendJob"
          >
            <el-option
              v-for="item in state.executeJobList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>

        <!--          派单、施工 显示服务包-->
        <div v-if="[1002].includes(state.templatePhaseChildForm.businessType)">
          <el-form-item
            v-if="state.templatePhaseChildForm.orderType === 0"
            label="服务内容"
            prop="materialType"
          >
            <el-input v-model="state.templatePhaseChildForm.executeJob" />
          </el-form-item>
        </div>

        <!--          派单 显示工费、预计人数-->
        <div v-if="state.templatePhaseChildForm.businessType === 1002">
          <el-form-item label="工费" prop="costs">
            <el-input v-model="state.templatePhaseChildForm.costs" />
          </el-form-item>
          <el-form-item label="预计人数" prop="personNumber">
            <el-input
              v-model="state.templatePhaseChildForm.personNumber"
              type="number"
              style="width: 19rem"
            >
              <template #append>人</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="state.templatePhaseChildForm.businessType === 1006">
          <el-form-item label="上传文件类型" prop="offsetDay">
            <el-radio-group v-model="state.templatePhaseChildForm.uploadType">
              <el-radio
                v-for="(item, index) in uploadTypeList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文件分组" prop="uploadGroup">
            <el-select
              v-model="state.templatePhaseChildForm.uploadGroup"
              placeholder="请选择"
            >
              <el-option
                v-for="item in state.dictTypeList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件名" prop="uploadFile">
            <div
              v-for="(item, index) in uploadFileList"
              :key="index"
              class="uploadFile-item"
            >
              <el-input v-model="item.name" style="width: 19rem" />
              <span class="uploadFile-operation">
                <el-icon
                  v-show="index > 0 && index < uploadFileList.length"
                  size="16"
                  color="#f56c6c"
                  @click="editorUploadFileList(index, 'delete')"
                ><delete /></el-icon>
                <el-icon
                  v-show="index + 1 === uploadFileList.length"
                  size="16"
                  style="margin-left: 8px"
                  @click="editorUploadFileList(index, 'add')"
                ><plus /></el-icon>
              </span>
            </div>
          </el-form-item>
        </div>

        <div v-if="state.templatePhaseChildForm.businessType === 1005">
          <el-form-item label="验收内容" prop="checkName">
            <el-input v-model="state.templatePhaseChildForm.checkName" />
          </el-form-item>
          <el-form-item label="验收类型" prop="checkType">
            <el-select
              v-model="state.templatePhaseChildForm.checkType"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in acceptanceTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="state.templatePhaseChildForm.checkType === 1"
            label="工种"
            prop="skillId"
          >
            <el-select
              v-model="state.templatePhaseChildForm.skillId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in state.executeJobList"
                :key="item.skillId"
                :label="item.skillName"
                :value="item.skillId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="state.templatePhaseChildForm.checkType === 2"
            label="验收模板"
            prop="checkTemplateId"
          >
            <el-select
              v-model="state.templatePhaseChildForm.checkTemplateId"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in acceptanceTypePageList"
                :key="index"
                :label="item.acceptanceName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <!--          用于在自动派单情况下显示执行岗位,去除校验-->
        <el-form-item
          v-if="
            state.templatePhaseChildForm.businessType === 1002 &&
              state.templatePhaseChildForm.orderType !== 0
          "
          label="执行岗位"
          prop=""
        >
          <el-select
            :disabled="
              state.templatePhaseChildForm.businessType === 1002 &&
                state.templatePhaseChildForm.orderType !== 0
            "
            placeholder="请选择"
          />
        </el-form-item>
        <!-- 不是自动派单、验收的情况下都显示-->
        <el-form-item
          v-if="
            !(
              (state.templatePhaseChildForm.businessType === 1002 &&
                state.templatePhaseChildForm.orderType === 1) ||
              state.templatePhaseChildForm.businessType === 1005
            )
          "
          label="执行岗位"
          prop="executeJobIdList"
        >
          <el-select
            v-model="state.templatePhaseChildForm.executeJobIdList"
            :multiple="selectSkillTypeStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in state.executeJobList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <!-- 只在验收节点下显示-->
        <el-form-item
          v-if="state.templatePhaseChildForm.businessType === 1005"
          label="执行岗位"
          prop="executeJobIdList"
        >
          <el-select
            v-model="state.templatePhaseChildForm.executeJobIdList"
            placeholder="请选择"
          >
            <el-option
              v-for="item in performJobsList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <!-- 只在验收节点下显示-->

        <!-- 测量、交底-->
        <el-form-item
          v-if="
            [1010, 1011].includes(state.templatePhaseChildForm.businessType) &&
              state.questionnaireList.length > 0
          "
          label="关联问卷"
          prop="quesId"
        >
          <el-select
            v-model="state.templatePhaseChildForm.quesId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in state.questionnaireList"
              :key="item.id"
              :label="item.surveyName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划天数" prop="planDay">
          <el-input
            v-model="state.templatePhaseChildForm.planDay"
            type="number"
            style="width: 19rem"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="前置节点">
          <el-table
            v-if="listByCodeSelectList.length > 0"
            ref="multipleTable"
            stripe
            :data="listByCodeList"
            tooltip-effect="dark"
            style="
              height: auto;
              margin-bottom: 10px;
              width: 38rem;
              height: auto !important;
            "
            size="mini"
            :border="true"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="节点名称" prop="name" />
          </el-table>
          <div v-if="listByCodeSelectList.length === 0" class="node-name">
            还没创建过节点
          </div>
          <el-popover
            v-if="listByCodeSelectList.length > 0"
            placement="bottom-start"
            :width="300"
            trigger="click"
          >
            <template #reference>
              <el-button class="node-name">配置前置节点</el-button>
            </template>
            <el-checkbox-group
              v-model="checkNodeList"
              @change="changeCheckNodeList"
            >
              <div>
                <p
                  v-for="(item, index) in listByCodeSelectList"
                  :key="index"
                  class="node-item"
                >
                  <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
                </p>
              </div>
            </el-checkbox-group>
          </el-popover>
        </el-form-item>
        <el-form-item label="偏移天数" prop="offsetDay">
          <el-input
            v-model="state.templatePhaseChildForm.offsetDay"
            type="number"
            style="width: 19rem"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="节点分组" prop="groupNo">
          <el-select
            v-model="state.templatePhaseChildForm.groupNo"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in groupCodeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="state.templatePhaseChildForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveTemplatePhaseChild">{{
            nodeIsEdit === true ? '编辑节点' : '创建节点'
          }}</el-button>
          <el-button
            @click="addTemplatePhaseChildShow = false"
          >取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-if="edionShow"
      v-model="edionShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="条件编辑器"
      width="110rem"
    >
      <conditionalEditor v-model="expressForm" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="edionHandel">确 定</el-button>
          <el-button @click="edionShow = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  unref,
  watch,
  watchEffect,
  onMounted
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  dictType,
  getListByCode,
  nodeCreate,
  nodeDelete,
  nodeUpdate,
  projectGetChildList,
  stageCreate,
  stageDelete,
  stageUpdate,
  sysjobsList,
  templateCreate,
  templateDelete,
  templateGetList,
  templateUpdate,
  getAllTemplates,
  surveyTemplates,
  templateGetOne
} from '@/pages/enterprise/api/basicConfig'
import { ports } from '_v/basicConfiguration/config'
import { Graph, Cell, CellView, Node, Shape } from '@antv/x6'
import '@antv/x6-vue-shape'
import projectTemplateDesignItem from '_c/projectTemplateDesignItem/projectTemplateDesignItem.vue'
import projectItem from '_c/projectTemplateDesignItem/projectItem.vue'
import phaseItem from '_c/projectTemplateDesignItem/phaseItem.vue'
import { fetch } from '_@/axios-config/axios'

const edionShow = ref<boolean>(false)
const expressForm = ref<any>({
  express: '',
  expressMacro: '',
  expressVar: '',
  id: 0,
  templateId: 0,
  templateNodeId: 0,
  type: '',
  expressJson: ''
})
const data = ref(0)
const container: any = ref()
const graph: any = ref()
const addTemplateShow = ref<boolean>(false)
const addTemplatePhaseShow = ref<boolean>(false)
const addTemplatePhaseChildShow = ref<boolean>(false)
const preNodeIdListShow = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const phaseIsEdit = ref<boolean>(false)
const nodeIsEdit = ref<boolean>(false)
const templateFormRef = ref()
const templateFormPhaseRef = ref()
const skillStatus = ref(false)
const multipleTable = ref()
const templateFormPhaseChildRef = ref()
const tableHeight = ref<any>(0)
const listByCodeList = ref<any>([])
const listByCodeSelectList = ref<any>([])
const preNodeIdList = ref<any>()
const jobLabel = ref<any>('被派单岗位')
const uploadFileList = ref<any>([{ name: '文件' }])
const templateActive = ref<any>(0)
const acceptanceType = ref<any>(1)
const acceptanceTypePageList = ref<any>([])
const selectSkillType = ref<any>(null)
const selectSkillTypeStatus = ref<any>(true)
const performJobsList = ref<any>([])
const workList = ref<any>([])
const acceptanceTypeList = ref<any>([
  { label: '内部验收', value: 1 },
  { label: '外部验收', value: 2 }
])
const uploadTypeList = ref<any>([
  { label: '文件', value: 1 },
  { label: '定位', value: 2 },
  { label: '文本', value: 3 }
])
const businessTypeList = ref<any>([
  { label: '选材', value: 1001 },
  { label: '交底', value: 1010 },
  { label: '测量', value: 1011 },
  { label: '派单', value: 1002 },
  { label: '预算', value: 1003 },
  { label: '施工', value: 1004 },
  { label: '上传', value: 1006 },
  { label: '验收', value: 1005 },
  { label: '评价', value: 1009 }
])

const groupCodeList = ref<any>([
  { label: '材料', value: 1001 },
  { label: '人工', value: 1002 },
  { label: '财务', value: 1003 }
])
const materialTypeList = ref<any>([
  { label: '主材', value: 1001 },
  { label: '辅材', value: 1002 },
  { label: '人工', value: 1003 },
  { label: '服务', value: 1004 },
  { label: '服务包', value: 1005 }
])
const state = reactive<any>({
  selectJobCode: '',
  auditStatusV: 0,
  hotsaleStatus: 0,
  tableData: [],
  form: {},
  currentPage: 1,
  total: 0,
  cell: '',
  pageSize: 10,
  loading: true,
  templateList: [],
  templateIsEdit: true,
  templateId: 84,
  phaseId: 0,
  treeCode: 0,
  stageId: 0,
  executeJobList: [] as any,
  dictTypeList: [],
  checkNodeList: [],
  skillTypeList: [],
  questionnaireList: [],
  templateForm: {
    showStatus: 1,
    parentId: 0,
    name: ''
  } as any,
  templatePhaseForm: {
    name: '',
    projectTemplateId: '',
    sort: 1
  },
  templatePhaseChildForm: {
    name: '',
    businessType: 1001, // 默认节点
    executeJob: 0,
    executeJobIdList: '' as any, // 执行岗位
    jobCode: '',
    skillName: '',
    skillId: '', // 被派岗位id
    planDay: '',
    offsetDay: '',
    groupName: '',
    groupNo: 1001,
    remark: '',
    treeCode: '',
    materialType: 1001,
    orderServicePack: '' as any,
    checkName: '',
    uploadGroup: 0,
    uploadFile: [] as any,
    preNode: '',
    orderType: 1,
    uploadType: 1,
    orderSendDay: '',
    quesId: 0,
    quesName: '',
    checkTemplateId: '',
    checkType: 1,
    personNumber: '',
    costs: ''
  }
})
const rules = reactive({
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
})
const rulesPhase = reactive({
  name: [{ required: true, message: '请输入阶段名称', trigger: 'blur' }]
})
const rulesChildNode = reactive({
  name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  executeJobIdList: [
    { required: true, message: '请选择执行岗位', trigger: 'change' }
  ],
  planDay: [{ required: true, message: '请输入计划天数', trigger: 'blur' }],
  groupNo: [{ required: true, message: '请选择节点分组', trigger: 'change' }],
  sendSkillId: [
    { required: true, message: '请选择被派单岗位', trigger: 'change' }
  ],
  skillId: [
    {
      required: true,
      message: `必选`,
      trigger: 'change'
    }
  ],
  quesId: [{ required: true, message: '请关联问卷', trigger: 'change' }],
  checkTemplateId: [
    { required: true, message: '请选择验收模板', trigger: 'change' }
  ],
  checkType: [{ required: true, message: '请选择验收类型', trigger: 'change' }],
  orderServicePack: [
    { required: true, message: '请选择服务包', trigger: 'change' }
  ]
})
watch(
  () => state.templatePhaseChildForm.businessType, // 监听节点选择更换name
  (newStr, oldStr) => {
    switch (newStr) {
      case 1002:
        jobLabel.value = '被派单岗位'
        break
      case 1009:
        jobLabel.value = '被评价岗位'
        break
    }

    if ([1004, 1005].includes(newStr)) {
      selectSkillTypeStatus.value = false
      state.executeJobList = workList.value
    } else {
      selectSkillTypeStatus.value = true
      console.log('ssdds', performJobsList.value)
      state.executeJobList = performJobsList.value
    }

    if (!nodeIsEdit.value) {
      // 添加节点时
      state.templatePhaseChildForm.executeJobIdList = ''
    }
  }
)

watch(
  () => state.templatePhaseChildForm.checkType,
  (newVal, oldVal) => {
    if (newVal === 1) {
      state.executeJobList = workList.value
    }
  }
)

watch(
  () => state.templatePhaseChildForm.skillId,
  (newVal, oldVal) => {
    const tempName = state.executeJobList.filter(
      (item: any) => Number(item.skillId) === Number(newVal)
    )
    if (tempName.length === 0) {
      return
    }
    state.templatePhaseChildForm.skillName = tempName[0].skillName
    state.templatePhaseChildForm.jobCode = tempName[0].jobCode
  }
)

watch(
  () => state.templatePhaseChildForm.quesId,
  (val, perValue) => {
    const tempName = state.questionnaireList.filter(
      (item: any) => item.id === val
    )
    if (tempName.length > 0) {
      state.templatePhaseChildForm.quesName = tempName[0].surveyName
    }
  }
)

watch(
  () => state.templatePhaseChildForm.checkType,
  (val, perValue) => {
    if (val === 1) {
      state.templatePhaseChildForm.checkTemplateId = 0
    }
  }
)
// 条件编辑器的确定
const edionHandel = async () => {
  await fetch({
    url: '/order/sopnodeexpressconfig/saveOrUpdateExpress',
    method: 'post',
    data: expressForm.value
  }).then((res: any) => {
    if (res) {
      edionShow.value = false
      ElMessage.success('启用条件设置成功')
    }
  })
}

// 模版的获取
const getTemplateList = async () => {
  await templateGetOne(state.templateId).then((res: any) => {
    console.log(res)
    state.templateForm = res.data
  })
}
// 模版的保存
const setExecuteJob = (e: any) => {
  if (e) {
    const temp = e.split(',')
    const tempExecuteJobList = performJobsList.value
    if (tempExecuteJobList && tempExecuteJobList.length > 0) {
      let tempName: any = []
      tempName = tempExecuteJobList.filter(
        (item: any) => temp.indexOf(item.skillId) !== -1
      )
      return tempName
    } else {
      return e
    }
  }
}

const setBusinessTypeName = (e: any) => {
  if (e) {
    let tempBusinessName: any = []
    tempBusinessName = businessTypeList.value.filter(
      (item: any) => item.value === Number(e)
    )
    return tempBusinessName[0] && tempBusinessName[0].label
  }
}

const getDictTypeList = () => {
  dictType({ type: 'sop_upload_file_type' }).then((res) => {
    if (res.data) {
      state.dictTypeList = res.data
    }
  })
}

const getQuestionnaireList = () => {
  state.questionnaireList = []
  getAllTemplates({}).then((res) => {
    if (res.data) {
      acceptanceTypePageList.value = res.data
    }
  })
}

const getSurveyTemplatesList = () => {
  state.questionnaireList = []
  surveyTemplates({}).then((res: any) => {
    if (res.data) {
      state.questionnaireList = res.data
    }
  })
}

const savePhase = () => {
  state.templatePhaseForm.name = ''
  state.templatePhaseForm.sort = state.tableData.length + 1
  addTemplatePhaseShow.value = true
  phaseIsEdit.value = false
}

const saveTemplateShow = () => {
  state.templateForm.name = ''
  addTemplateShow.value = true
  state.templateIsEdit = false
}

const getListByCodeAll = (e: any) => {
  getListByCode({ stageId: state.stageId }).then((res) => {
    if (res.data) {
      listByCodeSelectList.value = res.data.filter(
        (item: any) => item.id !== e.id
      )
    }
  })
}

const getTemplateDateInitial = async () => {
  // 页面初始化时调用
  await templateGetList({}).then((res) => {
    if (res.data) {
      state.templateId = (res.data.length > 0 && res.data[0].id) || 0
    }
  })
  await getTemplateList()
}

const getTemplateDate = () => {
  templateGetList({}).then((res) => {
    if (res) {
      state.templateList = res.data
      if (res.data.length === 1) {
        state.templateId = res.data[0].id
      }
      res.data.length > 0 && getProjectGetChildList()
    }
  })
}

const getSysjobsList = async () => {
  await sysjobsList({}).then((res) => {
    performJobsList.value = res.data
    state.executeJobList = res.data
  })

  await sysjobsList({ type: 2 }).then((res) => {
    workList.value = res.data
  })
}
// 通过id换取岗位名称
const getPostName = (ids: any) => {
  if (!ids) return ''
  const tids = ids.split(',')
  const postName: any = []
  state.executeJobList.forEach((item: any) => {
    if (tids.includes(item.skillId)) {
      return postName.push(item.skillName)
    }
  })
  return postName.join(',')
}

const getHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 150
}

watchEffect(() => {
  getHeight()
  window.addEventListener('resize', getHeight, false)
})
// ----------------------------请空--------------------------
// templateUpdate({
//   ...state.templateForm,
//   templateJson: '',
//   id: 115 || state.templateId || 115
// })
const saveTemplate = () => {
  templateUpdate({
    ...state.templateForm,
    templateJson: JSON.stringify(graph.value.toJSON()),
    id: state.templateId
  }).then((res) => {
    if (res.data) {
      // ElMessage({
      //   type: 'success',
      //   message: `修改模板成功!`,
      // })
      addTemplateShow.value = false
      // getTemplateDate()
      removeTempLate()
    }
  })
  // const forms = unref(templateFormRef)
  // forms.validate((valid: boolean) => {
  //   if (valid) {
  //     if (state.templateIsEdit) {
  //       templateUpdate({
  //         ...state.templateForm,
  //         templateJson: graph.value.toJSON(),
  //         id: state.templateId,
  //       }).then((res) => {
  //         if (res.data) {
  //           ElMessage({
  //             type: 'success',
  //             message: `修改模板成功!`,
  //           })
  //           addTemplateShow.value = false
  //           getTemplateDate()
  //           removeTempLate()
  //         }
  //       })
  //     } else {
  //       templateCreate(state.templateForm).then((res) => {
  //         if (res.data) {
  //           // ElMessage({
  //           //   type: 'success',
  //           //   message: `新增模板成功!`,
  //           // })
  //           addTemplateShow.value = false
  //           getTemplateDate()
  //           removeTempLate()
  //         }
  //       })
  //     }
  //   }
  // })
}

const removeTempLate = () => {
  state.templateForm.showStatus = 0
  state.templateForm.name = ''
}

const templateOperation = (e: any, name: any, index: any) => {
  state.templateId = e.id
  switch (name) {
    case 'select':
      templateActive.value = index
      getProjectGetChildList()
      break
    case 'edit':
      state.templateForm.showStatus = e.showStatus
      state.templateForm.name = e.name
      state.templateIsEdit = true
      addTemplateShow.value = true
      break
    case 'delete':
      ElMessageBox.confirm(`此操作将永久删除${e.name}模板, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        templateDelete({ id: e.id }).then((res) => {
          if (res.data) {
            ElMessage({
              type: 'success',
              message: `删除成功!`
            })
            getTemplateDate()
          }
        })
      })
      break
  }
}

const saveTemplatePhase = () => {
  const forms = unref(templateFormPhaseRef)
  forms.validate((valid: boolean) => {
    if (valid) {
      if (phaseIsEdit.value) {
        stageUpdate({
          ...state.templatePhaseForm,
          id: state.phaseId,
          projectTemplateId: state.templateId
        }).then((res) => {
          if (res.data) {
            ElMessage({
              type: 'success',
              message: `修改阶段成功!`
            })
            addTemplatePhaseShow.value = false
            console.log(state.cell)
            state.cell.setData({
              ...res.data
            })
            saveTemplate()
            // getTemplateDate()
            removeTempLate()
          }
        })
      } else {
        ElMessage({
          type: 'success',
          message: `阶段创建成功，点击空白处确定摆放位置`
        })
        addTemplatePhaseShow.value = false
      }
    }
  })
}
const businessTypeChange = (e: any) => {
  if (nodeIsEdit.value) {
    if (selectSkillTypeStatus.value) {
      state.templatePhaseChildForm.executeJobIdList = []
    } else {
      state.templatePhaseChildForm.executeJobIdList = 0
    }
  }
}

const saveTemplatePhaseChild = () => {
  const forms = unref(templateFormPhaseChildRef)
  forms.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    const tempState: any = { ...state.templatePhaseChildForm }
    tempState.uploadFile = JSON.stringify(uploadFileList.value)
    tempState.executeJob =
      Array.isArray(tempState.executeJobIdList) === true
        ? tempState.executeJobIdList.join(',')
        : tempState.executeJobIdList
    if (tempState.businessType === 1002 && tempState.orderType === 1) {
      tempState.executeJob = 0
    } else if (![1002, 1009, 1004, 1005].includes(tempState.businessType)) {
      // 不是派单、评价、施工、验收
      tempState.skillId = 0
      tempState.skillName = ''
      tempState.skillId = ''
    }
    // return
    if (nodeIsEdit.value) {
      nodeUpdate(tempState).then((res) => {
        if (res.data) {
          ElMessage({
            type: 'success',
            message: `修改子节点成功!`
          })
          addTemplatePhaseChildShow.value = false
          state.cell.setData({
            ...res.data
          })
          state.templatePhaseChildForm.name = ''
          saveTemplate()
          // getTemplateDate()
        }
      })
    } else {
      ElMessage({
        type: 'success',
        message: `新增子节点成功, 点击阶段确定摆放位置`
      })
      addTemplatePhaseChildShow.value = false
    }
  })
}

const getProjectGetChildList = () => {
  projectGetChildList({ id: state.templateId }).then((res) => {
    if (res.data) {
      state.tableData = res.data
    }
  })
}

const conversion = (e: any) => {
  const tempItem: any = JSON.parse(JSON.stringify(e))
  state.templatePhaseChildForm = JSON.parse(JSON.stringify(e))
  state.templatePhaseChildForm.businessType = Number(tempItem.businessType)
  if ([1004, 1005].includes(Number(tempItem.businessType))) {
    // 验收、施工单选
    state.templatePhaseChildForm.executeJobIdList = tempItem.executeJob
  } else {
    state.templatePhaseChildForm.executeJobIdList =
      tempItem.executeJob.split(',')
  }
  state.templatePhaseChildForm.groupNo = Number(tempItem.groupNo)
  state.templatePhaseChildForm.materialType = Number(tempItem.materialType)
}

const handleNode = (e: any, typeName: any, cell: any) => {
  switch (typeName) {
    case 'setting':
      expressForm.value = {
        express: '',
        expressMacro: '',
        expressVar: '',
        id: 0,
        templateId: state.templateId,
        templateNodeId: e.id,
        type: '',
        expressJson: ''
      }
      edionShow.value = true
      break
    case 'add':
      state.selectJobCode = ''
      state.phaseId = e.id
      state.treeCode = e.treeCode
      state.stageId = e.id
      state.checkNodeList = []
      resetTemplatePhaseChildForm()
      getListByCodeAll(e)
      nodeIsEdit.value = false
      state.templatePhaseChildForm.preNodeList = null
      addTemplatePhaseChildShow.value = true
      uploadFileList.value = [{ name: '文件' }]
      listByCodeList.value = []
      break
    case 'edit':
      state.selectJobCode = ''
      if (!e.businessType) {
        // 编辑阶段
        state.phaseId = e.id
        phaseIsEdit.value = true
        state.templatePhaseForm.name = e.name
        state.templatePhaseForm.sort = e.sort
        addTemplatePhaseShow.value = true
        state.cell = cell
      } else {
        // 编辑子节点
        nodeIsEdit.value = true
        state.stageId = e.stageId
        state.cell = cell
        getListByCodeAll(e)
        conversion(e)
        getOrderSendJob(e.skillId)
        const tempItem: any = { ...e }
        if (tempItem.preNode) {
          // 回显选中
          state.checkNodeList = tempItem.preNode.split(',')
        } else {
          state.checkNodeList = []
        }
        if (tempItem.preNodeList) {
          listByCodeList.value = tempItem.preNodeList && tempItem.preNodeList
        } else {
          listByCodeList.value = []
        }
        uploadFileList.value = JSON.parse(
          state.templatePhaseChildForm.uploadFile
        )
        addTemplatePhaseChildShow.value = true
      }
      break
    case 'delete':
      if (!e.businessType) {
        ElMessageBox.confirm(
          `此操作将永久删除${e.name}阶段, 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            stageDelete({ id: e.id }).then((res: any) => {
              if (res.data.code === 0) {
                ElMessage({
                  type: 'success',
                  message: `删除成功!`
                })
                graph.value.removeNode(cell.id)
                saveTemplate()
                // getTemplateDate()
              } else {
                ElMessage.error(res.data.msg)
              }
            })
          })
          .catch((error) => {
            // console.log(error)
          })
      } else {
        // 子节点
        ElMessageBox.confirm(
          `此操作将永久删除${e.name}节点, 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          nodeDelete({ id: e.id }).then((res) => {
            if (res.data) {
              ElMessage({
                type: 'success',
                message: `删除成功!`
              })
              graph.value.removeNode(cell.id)
              saveTemplate()
              // getTemplateDate()
            }
          })
        })
      }

      break
  }
}

const editorUploadFileList = (index: any, typeName: any) => {
  if (typeName === 'add') {
    uploadFileList.value.push({ name: '' })
  } else {
    uploadFileList.value.splice(index, 1)
  }
}

const resetTemplatePhaseChildForm = () => {
  for (var key in state.templatePhaseChildForm) {
    state.templatePhaseChildForm[key] = ''
    state.templatePhaseChildForm.businessType = 1001
    state.templatePhaseChildForm.materialType = 1001
    state.templatePhaseChildForm.executeJobIdList = []
    state.templatePhaseChildForm.orderType = 1
    state.templatePhaseChildForm.uploadType = 1
  }
}

const handleSelectionChange = (e: any) => {}

const changeCheckNodeList = (e: any) => {
  const tempList: any = []
  listByCodeSelectList.value.length > 0 &&
    listByCodeSelectList.value.map((item: any) => {
      e.map((el: any) => {
        if (Number(el) === Number(item.id)) {
          tempList.push(item)
        }
      })
    })
  listByCodeList.value = tempList
  state.templatePhaseChildForm.preNode = e.join(',')
}

const getOrderSendJob = (e: any) => {
  state.executeJobList.map((res: any) => {
    if (e === res.skillId) {
      state.selectJobCode = res.jobCode
      return
    }
  })
  console.log(e)
}
const addPhase = (x: any, y: any, data: any) => {
  addTemplatePhaseShow.value = true
}
const phaseAddNode: any = (x: any, y: any, parent: any, data: any) => {
  graph.value.addNode({
    id: 'projectItem' + data.id,
    shape: 'vue-shape',
    component: 'projectItem',
    width: 200,
    height: 118,
    parent: 'phaseItem' + parent.id,
    zIndex: 100,
    position: {
      x: x,
      y: y
    },
    data: { ...data, postName: getPostName(data.executeJob) },
    ports: { ...ports }
  })
}
const addPhaseNode = (x: any, y: any, data: any) => {
  graph.value.addNode({
    id: 'phaseItem' + data.id,
    shape: 'vue-shape',
    component: 'phaseItem',
    width: 400,
    height: 600,
    zIndex: 1,
    position: {
      x: x,
      y: y
    },
    data: {
      ...data
    }
  })
}
// 防抖
const debounce = (func: any, wait: any, immediate: any) => {
  let timeout: any
  return function () {
    const context = this
    const args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

onMounted(async () => {
  await getTemplateDateInitial()
  await getSysjobsList() // 查询岗位、工种
  await getQuestionnaireList() // 查询模板
  await getDictTypeList() // 文件分组
  await getSurveyTemplatesList() // 问卷

  Graph.registerNode(
    'lane',
    {
      inherit: 'rect',
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },
        {
          tagName: 'rect',
          selector: 'name-rect'
        },
        {
          tagName: 'text',
          selector: 'name-text'
        }
      ],
      children: [
        {
          tagName: 'circle',
          with: 100,
          height: 100,
          attrs: {}
        },
        {
          tagName: 'text',
          attrs: {
            class: 'del'
          }
        }
      ],
      attrs: {
        body: {
          fill: '#FFF',
          stroke: '#5F95FF',
          strokeWidth: 1
        },
        'name-rect': {
          width: 300,
          height: 30,
          fill: '#0969DA',
          stroke: '#fff',
          strokeWidth: 0,
          x: -1
        },
        'name-text': {
          ref: 'name-rect',
          refY: 0.5,
          refX: 0.5,
          textAnchor: 'middle',
          fontWeight: 'bold',
          fill: '#fff',
          fontSize: 12
        }
      }
    },
    true
  )
  Graph.registerVueComponent(
    'phaseItem',
    {
      template: `<phaseItem :name='${12}' />`,
      components: {
        phaseItem
      }
    },

    true
  )
  Graph.registerVueComponent(
    'projectItem',
    {
      template: `
        <projectItem />`,
      components: {
        projectItem
      }
    },
    true
  )
  Graph.registerVueComponent(
    'projectTemplateDesignItem',
    {
      template: `
        <projectTemplateDesignItem />`,
      components: {
        projectTemplateDesignItem
      }
    },
    true
  )
  graph.value = new Graph({
    container: container.value as HTMLElement,
    width: 1200,
    height: 800,
    panning: {
      enabled: true,
      eventTypes: ['leftMouseDown', 'mouseWheel']
    },
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3
    },
    embedding: true,
    interacting: {
      vertexDeletable: true,
      vertexMovable: true
    },
    connecting: {
      allowMulti: false,
      allowLoop: false,
      router: {
        name: 'manhattan',
        args: {
          // startDirections: ['bottom'],
          // endDirections: ['top'],
          padding: 10
        }
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: {
        radius: 20
      },
      validateEdge({ edge, type, previous }) {
        return true
      },
      createEdge() {
        return new Shape.Edge({
          zIndex: 100,
          tools: {
            name: 'button-remove',
            args: { distance: -40 }
          },
          attrs: {
            line: {
              stroke: '#42a1ff',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          }
        })
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF'
          }
        }
      }
    },
    resizing: true,
    rotating: true,
    selecting: {
      enabled: false,
      rubberband: true,
      showNodeSelectionBox: true
    },
    snapline: true,
    keyboard: true,
    clipboard: true
  })
  graph.value.fromJSON(JSON.parse(state.templateForm.templateJson || '[]'))
  // 控制连接桩显示/隐藏
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  // 删除
  graph.value.on('edge:removed', ({ e, x, y, edge, view }) => {
    console.log(edge)
    const source = edge.source
    const target = edge.target
    const sourceNode = graph.value.getCellById(source.cell)
    const targetNode = graph.value.getCellById(target.cell)
    if (!sourceNode || !targetNode || !sourceNode.data || !targetNode.data) { return }
    const sourceData = { ...sourceNode.data }
    const targetData = { ...targetNode.data }
    let plist = targetData.preNode.split(',')
    plist = plist.filter((item: any) => item !== sourceData.id)
    targetData.preNode = plist.join(',')
    nodeUpdate(targetData).then((res) => {
      if (res.data) {
        ElMessage({
          type: 'success',
          message: `前置节点删除成功!`
        })
        targetNode.setData({ ...res.data })
        saveTemplate()
        // getTemplateDate()
      }
    })
  })
  // 监听画布改变
  graph.value.on(
    'node:resized',
    debounce(
      ({ node, options }) => {
        saveTemplate()
      },
      1000,
      false
    )
  )
  graph.value.on(
    'node:moved',
    debounce(
      ({ e, x, y, node, view }) => {
        // saveTemplate()
        // 这里拖动的时候，让节点的位置和拖动的位置一致
        // 数据同步
        if (node.component == 'phaseItem') return
        if (!node.parent) {
          ElMessage({
            type: 'error',
            message: `节点不能不属于任何节点!`
          })
        }
        const saveData = node.data
        const parentData = node.parent.data
        saveData.stageId = parentData.id
        saveData.checkTemplateId = saveData.checkTemplateId || '0'
        nodeUpdate(saveData).then((res) => {
          if (res.data) {
            // ElMessage({
            //   type: 'success',
            //   message: `修改子节点成功!`,
            // })
            saveTemplate()
            // getTemplateDate()
          }
        })
      },
      500,
      false
    )
  )
  graph.value.on('edge:connected', ({ isNew, edge }) => {
    if (isNew) {
      console.log(graph)
      const source = edge.source
      const target = edge.target
      const sourcNode = graph.value.getCellById(source.cell)
      const targetNode = graph.value.getCellById(target.cell)
      const sourceData = { ...sourcNode.data }
      const targetData = { ...targetNode.data }
      // console.log(sourceData, targetData)
      targetData.checkTemplateId = targetData.checkTemplateId || '0'
      targetData.preNode =
        (targetData.preNode ? targetData.preNode + ',' : '') +
        `${sourceData.id}`
      nodeUpdate(targetData).then((res) => {
        if (res.data) {
          ElMessage({
            type: 'success',
            message: `前置节点设置成功!`
          })
          targetNode.setData({ ...res.data })
          console.log(graph.value.toJSON())
          saveTemplate()
          // getTemplateDate()
        }
      })
    }
  })
  graph.value.on('node:mouseenter', () => {
    const container = document.getElementById('graph-container')!
    const ports = container.querySelectorAll(
      '.x6-port-body'
    ) as NodeListOf<SVGElement>
    showPorts(ports, true)
  })
  graph.value.on('edge:mouseenter', () => {
    const container = document.getElementById('graph-container')!
    const delebutton = container.querySelectorAll(
      '.x6-cell-tool-button'
    ) as NodeListOf<SVGElement>
    showPorts(delebutton, true)
  })
  graph.value.on('edge:mouseleave', () => {
    const container = document.getElementById('graph-container')!
    const delebutton = container.querySelectorAll(
      '.x6-cell-tool-button'
    ) as NodeListOf<SVGElement>
    showPorts(delebutton, false)
  })
  graph.value.on('node:mouseleave', () => {
    const container = document.getElementById('graph-container')!
    const ports = container.querySelectorAll(
      '.x6-port-body'
    ) as NodeListOf<SVGElement>
    showPorts(ports, false)
  })
  graph.value.on('node:click', ({ e, x, y, cell, view }) => {
    // return
    // 阶段的添加小节点
    switch (cell.component) {
      case 'phaseItem':
        if (e.target.className.indexOf('add') > -1) {
          handleNode(cell.data, 'add', cell)
          return
        }
        // 阶段删除
        if (e.target.className.indexOf('edit') > -1) {
          state.templatePhaseForm = { ...cell.data }
          handleNode(cell.data, 'edit', cell)
          return
        }
        if (e.target.className.indexOf('delete') > -1) {
          handleNode(cell.data, 'delete', cell)
          return
        } else if (e.target.className.indexOf('phasecontent') > -1) {
          if (!state.templatePhaseChildForm.name) return
          const tempState: any = state.templatePhaseChildForm
          tempState.uploadFile = JSON.stringify(uploadFileList.value)
          tempState.executeJob =
            Array.isArray(tempState.executeJobIdList) === true
              ? tempState.executeJobIdList.join(',')
              : tempState.executeJobIdList
          if (tempState.businessType === 1002 && tempState.orderType === 1) {
            tempState.executeJob = 0
          } else if (
            ![1002, 1009, 1004, 1005].includes(tempState.businessType)
          ) {
            // 不是派单、评价、施工、验收
            tempState.skillId = 0
            tempState.skillName = ''
            tempState.skillId = ''
          }
          const tempGroupName: any =
            state.templatePhaseChildForm.groupNo &&
            groupCodeList.value.filter(
              (item: any) => item.value === state.templatePhaseChildForm.groupNo
            )[0].label
          nodeCreate({
            ...state.templatePhaseChildForm,
            stageId: cell.data.id,
            groupName: tempGroupName
          }).then((res) => {
            if (res.data) {
              ElMessage({
                type: 'success',
                message: `新增子节点成功!`
              })
              state.templatePhaseChildForm.name = ''
              phaseAddNode(x, y, cell.data, res.data)
              getTemplateDate()
            }
          })
        }
        // 否则就是添加子节点

        break
      case 'projectItem':
        if (e.target.className.indexOf('edit') > -1) {
          state.templatePhaseChildForm = { ...cell.data }
          state.cell = cell
          handleNode(state.templatePhaseChildForm, 'edit', cell)
          return
        }
        if (e.target.className.indexOf('delete') > -1) {
          handleNode(cell.data, 'delete', cell)
          return
        }
        if (e.target.className.indexOf('setting') > -1) {
          handleNode(cell.data, 'setting', cell)
          return
        }
        break
      case 'projectTemplateDesignItem':
        addTemplatePhaseShow.value = false
        break
    }
    // console.log(e, x, y, cell, view)
  })
  graph.value.on(
    'blank:click',
    debounce(
      ({ e, x, y }) => {
        if (!state.templatePhaseForm.name) return
        stageCreate({
          name: state.templatePhaseForm.name,
          projectTemplateId: state.templateId,
          sort: state.templatePhaseForm.sort
        }).then((res) => {
          if (res.data) {
            if (res.data) {
              state.templatePhaseForm.name = ''
              addPhaseNode(x, y, res.data)
              getTemplateDate()
            }
            saveTemplate()
            // getTemplateDate()
          }
        })
      },
      500,
      false
    )
  )
})
</script>
<style scoped lang="less">
.business-type-contain {
  padding-top: 0.3rem;
  width: 100%;
  margin-bottom: -2rem;

  .el-radio {
    margin-right: 4rem;
    /*margin-bottom: 10px;*/
  }
}

.el-radio-item {
  margin-bottom: 0.5rem;
}

.node-name {
  font-size: 12px;
  color: #f2aa3d;
  cursor: pointer;
}

#container :deep(body) {
  box-sizing: border-box;
  margin: 0;
  min-width: 0 !important;
}

header {
  display: flex;
  width: 100%;
  height: 50px;
}

header i {
  margin: 8px;
  font-size: 30px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.my-selecting {
  border: 1px solid red;
  display: block;
  z-index: 0;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.x6-node foreignObject > body) {
  min-width: none !important;
}

:deep(.x6-cell-tool-button) {
  visibility: hidden;
}

.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}

.x6-node-selected .node.success {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}

.x6-node-selected .node.failed {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
}

.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

.section-cot {
  display: flex;
}

.section-cot #container {
  position: relative;
  flex: 1;
}

.section-cot #container #draw-cot {
  width: 100%;
  height: 100%;
}

::-webkit-scrollbar {
  width: 0;
}
</style>
