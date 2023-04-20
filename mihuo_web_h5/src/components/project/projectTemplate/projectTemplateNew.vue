<template>
  <div>
    <div style="display: flex">
      <div
        v-if="pageType == 1"
        class="left-container"
      >
        <div class="left-container_top">
          <el-button
            v-if="pageType == 1"
            icon="plus"
            type="text"
            @click="
              templateOperation(
                { defaultFlag: 0 },
                'add',
                state.templateDataList.length
              )
            "
          >新增模板
          </el-button>
        </div>
        <div v-if="state.templateDataList && state.templateDataList.length">
          <el-button
            class="main-button"
            type="text"
            :icon="isMenuCollapse ? 'arrow-right' : 'arrow-left'"
            @click="menuCollapse"
          >
            {{ isMenuCollapse ? '展开' : '收起' }}
          </el-button>
          <el-menu
            :collapse="isMenuCollapse"
            :default-active="0"
          >
            <el-menu-item
              v-for="(item, index) in state.templateDataList"
              :key="index"
              :index="index"
              :class="[templateActive === index ? 'template-item-active' : '']"
              class="template-item"
              @click="templateOperation(item, 'select', index)"
            >
              {{ index + 1 }}、
              <template #title>
                <div class="name name_left" :title="item.name">
                  <el-icon
                    v-if="item.showStatus === 0"
                    size="12px"
                    color="#f7c4a7"
                  ><remove /></el-icon>
                  {{ item.name }}
                </div>
                <div class="operation">
                  <el-icon
                    size="12px"
                    color="#409EFF"
                    @click.stop="templateOperation(item, 'edit')"
                  >
                    <edit />
                  </el-icon>
                  <el-icon
                    size="12px"
                    color="#F56C6C"
                    @click.stop="templateOperation(item, 'delete')"
                  >
                    <delete />
                  </el-icon>
                </div>
              </template>
            </el-menu-item>
          </el-menu>
        </div>
        <el-empty v-else description="暂无模板~" />
      </div>
      <div class="right-container" :style="{ width: tableWidth }">
        <el-card>
          <div class="el-card-right">
            <el-button
              size="mini"
              icon="plus"
              type="primary"
              @click="handleNode({}, '新增阶段')"
            >
              新增阶段
            </el-button>
          </div>
        </el-card>
        <el-table
          ref="multipleTable"
          :class="{ inittable: pageType == 1, server: pageType == 2 }"
          width="70rem"
          :data="state.tableData"
          style="height: calc(100vh - 29rem) !important"
          row-key="id"
          border
          :height="'0'"
          :tree-props="{ children: 'nodes', hasChildren: 'hasChildren' }"
          :row-class-name="tableRowClassName"
          default-expand-all
          highlight-current-row
        >
          <el-table-column
            prop="name"
            label="节点"
            header-align="center"
            width="280"
            fixed
          />
          <el-table-column
            prop="executeJob"
            label="执行岗位"
            width="200"
            align="center"
          >
            <template #default="scope">
              <el-tag
                v-for="(item, index) in scope.row.executeJobNames"
                :key="index"
                :style="
                  scope.row.executeJobNames.length == index + 1
                    ? 'margin-bottom: 0.4rem;'
                    : 'margin-bottom: 0.4rem;margin-right: 1rem'
                "
                type="success"
              >{{ item || '暂无' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="skillId"
            label="被派单岗位"
            width="160"
            align="center"
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.businessType == '1002'"
              >{{ scope.row.skillName || '暂无' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="planDay" label="计划天数" align="center">
            <template #default="scope">
              {{ scope.row.planDay && scope.row.planDay + '天' }}
            </template>
          </el-table-column>
          <el-table-column prop="businessType" label="关联功能" align="center">
            <template #default="scope">
              {{ setBusinessTypeName(scope.row.businessType) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="preNode"
            label="前置节点"
            header-align="center"
            align="left"
            width="200"
          >
            <template #default="scope">
              <div style="display: flex; flex-flow: wrap">
                <span
                  v-for="(item, index) in scope.row.preNodeNames"
                  :key="index"
                  style="
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    margin-right: 1rem;
                  "
                >
                  <el-icon><operation /></el-icon>{{ item }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableExpressTranslate"
            label="启用条件"
            header-align="center"
            align="center"
            width="150"
          />
          <el-table-column
            prop="startWay"
            label="施工开始方式"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.startWay == 0">自动开始</span>
              <span v-if="scope.row.startWay == 1">手动开始</span>
              <span v-if="scope.row.startWay == 2">按规则开始</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="finishWay"
            label="施工结束方式"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.finishWay == 0">自动结束</span>
              <span v-if="scope.row.finishWay == 1">手动结束</span>
              <span v-if="scope.row.finishWay == 2">按规则结束</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="verifyRelative"
            label="校验条件"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.verifyFlag == 1">
                <span>
                  {{ setVerify(scope.row.verifyRelative) }}
                </span>
                <span v-if="scope.row.verifyOffsetDay">
                  {{ scope.row.verifyOffsetDay }}天
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reviewer"
            label="审核人"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.reviewFlag == 1">{{
                setReviewer(scope.row.reviewer)
              }}</span>
            </template>
          </el-table-column>
          <!--      <el-table-column prop="offsetDay" label="偏移天数" align="center">-->
          <!--        <template #default="scope">-->
          <!--          {{ scope.row.offsetDay && scope.row.offsetDay + '天' }}-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <el-table-column
            prop="settlementStatus"
            label="完成后结算"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.settlementStatus ? '结算' : '不结算' }}
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="节点分组" align="center" />
          <el-table-column
            width="100"
            prop="remark"
            label="备注"
            header-align="center"
            align="left"
          />
          <el-table-column
            prop="created"
            width="200"
            label="创建时间"
            align="center"
          />
          <el-table-column
            width="200"
            prop="updated"
            label="更新时间"
            align="center"
          />
          <el-table-column
            label="操作"
            fixed="right"
            width="200"
            align="center"
          >
            <template #default="scope">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <el-button
                  v-show="!scope.row.businessType"
                  type="text"
                  size="mini"
                  class="danger"
                  icon="plus"
                  @click="handleNode(scope.row, '新增节点')"
                >
                  新增节点
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="edit"
                  @click="
                    handleNode(
                      scope.row,
                      !scope.row.businessType === true ? '编辑阶段' : '编辑节点'
                    )
                  "
                >
                  {{ !scope.row.businessType === true ? '' : '编辑' }}
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  class="danger"
                  icon="delete"
                  @click="
                    handleNode(
                      scope.row,
                      !scope.row.businessType === true ? '删除阶段' : '删除节点'
                    )
                  "
                >{{ !scope.row.businessType === true ? '' : '删除' }}
                </el-button>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="拖动排序"
                  placement="left"
                >
                  <el-icon
                    v-show="scope.row.businessType"
                    size="1.4rem"
                    class="el-sort move-icon"
                  >
                    <MoreFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!--    创建项目阶段，编辑项目阶段 isEdit=true编辑，=false创建, stageData=form表单的参数-->
        <projectStage
          v-model="projectStageShow"
          :is-edit="stageIsEdit"
          :stage-data="state.stageForm"
          @getData="getData()"
        />
      </div>

      <settingNode
        v-if="settingNodeShow"
        v-model="settingNodeShow"
        type="SOP"
        :is-edit="nodeIsEdit"
        :node-data="state.nodeForm"
        :node-id="state.nodeId"
        @getData="getData()"
      />
      <!--    //配置项目模板？-->
      <addProjectTemplate
        v-if="addTemplateShow"
        v-model="addTemplateShow"
        :data="state.templateForm"
        :is-edit="templateIsEdit"
        @getData="getTemplateDataList()"
        @handelClose="handleClose"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  defineEmits,
  defineProps,
  watchEffect,
  watch,
  onUnmounted,
  nextTick
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import Sortable from 'sortablejs'
let dragTable
// 查询项目模板
import {
  nodeDelete,
  projectGetChildList,
  sysjobsList,
  templateCreate,
  templateDelete,
  templateGetList
} from '_@/api/basicConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deepClone } from '@/utils'

const props = defineProps({
  pageType: {
    // 1服务包sop,//2项目模板sop
    type: String || Number,
    default: 2
  }
})

const isMenuCollapse = ref<any>(false) // 菜单是否收起
const pageType = ref<any>(2) // 1服务包sop,//2项目模板sop
const stageIsEdit = ref<any>(false) // 是否编辑阶段
const nodeIsEdit = ref<any>(false) // 是否编辑节点
const settingNodeShow = ref<any>(false) // 配置节点
const projectStageShow = ref<any>(false) // 配置阶段
const addTemplateShow = ref<any>(false) // 配置项目模板
const templateActive = ref<any>(0) // 选中的模板
const templateIsEdit = ref<any>(false) // 是否编辑项目模板
const performJobsList = ref<any>([]) // 岗位列表
const businessTypeList = ref<any>([
  { label: '选材', value: 1001 },
  { label: '交底', value: 1010 },
  { label: '量房', value: 1011 },
  { label: '派单', value: 1002 },
  { label: '预算', value: 1003 },
  { label: '施工', value: 1004 },
  { label: '上传', value: 1006 },
  { label: '验收', value: 1005 },
  { label: '评价', value: 1009 },
  { label: '收款', value: 1012 },
  { label: '材料申请', value: 1013 },
  { label: '材料管理', value: 1014 },
  { label: '开单', value: 1015 },
  { label: '无', value: 1000 }
])
const state = reactive({
  templateForm: {
    showStatus: 1,
    parentId: 0,
    name: '',
    jobCode: ''
  } as any, // 模板信息
  templateDataList: [] as any, // 模板列表
  tableData: [] as any, // 表格内容
  templateList: {}, // 模板信息
  templateId: 0, // 模板id
  nodeId: 0, // 节点id
  nodeForm: {} as any, // 节点form
  stageForm: {} as any, // 阶段form
  jobsList: [] as any // 岗位和工种
})

const tableWidth = ref<any>(0)

const getWidth = () => {
  tableWidth.value = pageType.value == 2 ? '100%'
    : isMenuCollapse.value ? `calc(${document.documentElement.clientWidth}px - 310px)`
      : `calc(${document.documentElement.clientWidth}px - 440px)`
}

watchEffect(() => {
  getWidth()
  // 增加监听事件，窗口变化时得到高度。
  window.addEventListener('resize', getWidth, false)
})

// 菜单展开/收起
const menuCollapse = () => {
  isMenuCollapse.value = !isMenuCollapse.value
}

const handleClose = () => {
  templateActive.value = templateActive.value - 1
}

// 列拖拽
const rowDrop = () => {
  // 此时找到的元素是要拖拽元素的父容器
  const tablename: any = pageType.value == 1 ? '.inittable' : '.server'
  const tbody: any = document.querySelector(
    `${tablename} .el-table__body-wrapper tbody`
  )
  dragTable = Sortable.create(tbody, {
    disabled: false,
    key: pageType.value,
    filter: '.expanded', // 过滤器，不需要进行拖动的元素
    //  指定父元素下可被拖拽的子元素
    draggable: '.el-table__row',
    handle: '.move-icon',
    // 元素被选中
    onChoose: (evt: any) => {
      evt.oldIndex
      console.log(evt.oldIndex)
    },
    onStart: () => {
      console.log('开始拖动')
    },
    onEnd({ newIndex, oldIndex }: any) {
      // state.tableData.splice(newIndex, 0, currRow)
      console.log(newIndex, oldIndex)
      const stageIndex = 0
      const stageNextIndex = 0
      let nodeId = 0
      let sort = 0
      state.tableData.forEach((res: any, idx: any) => {
        res.nodes.forEach((res2: any, idx2: any) => {
          if (res2.index == oldIndex) {
            nodeId = res2.id
          }
          if (res2.index == newIndex) {
            sort = res2.sort
          }
        })
      })
      saveModifySort({
        newSort: sort,
        templateNodeId: nodeId
      })
    }
  })
}

const setReviewer = (data: any) => {
  const tempData = data ? JSON.parse(data) : []
  let tempSkillNmmes = ''
  const list = [] as any
  tempData.map((item: any) => {
    state.jobsList.map((item2: any) => {
      item.skillIds.map((item3: any) => {
        if (item2.skillId == item3) {
          list.push(item2.skillName)
        }
      })
    })
    if (item.type == 1) {
      // type 0：岗位 1：业主
      list.push('业主')
    }
    tempSkillNmmes = list.join()
  })
  return tempSkillNmmes
}

const setVerify = (status: any) => {
  switch (status) {
    case 0:
      return '服务开始时间' + '后'
    case 1:
      return '施工开始时间' + '后'
    case 2:
      return '节点开始时间' + '后'
    case 3:
      return '节点完成时间' + '后'
  }
}

// 获取岗位和工种
const getSysjobsList = () => {
  sysjobsList({}).then((res) => {
    state.jobsList = res.data
  })
}

const templateOperation = (e: any, name: any, index: any) => {
  state.templateId = e.id
  switch (name) {
    case 'add':
      templateActive.value = index
      state.templateForm = { ...e }
      templateIsEdit.value = false
      addTemplateShow.value = true
      break
    case 'select':
      templateActive.value = index
      isMenuCollapse.value = false
      getProjectGetChildList()
      break
    case 'edit':
      state.templateForm = { ...e }
      templateIsEdit.value = true
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
            templateActive.value = 0
            getTemplateDataList()
          }
        })
      })
      break
  }
}
// 根据模板id查询模板信息
const getProjectGetChildList = () => {
  if (state.templateDataList.length == 0) {
    return
  }
  projectGetChildList({
    id: state.templateDataList[templateActive.value].id
  }).then((res) => {
    if (res.data) {
      state.tableData = res.data.stages || []
      let index = 0
      state.tableData.forEach((data1: any) => {
        data1.index = index
        index++
        data1.nodes.forEach((data2: any) => {
          data2.index = index
          index++
        })
      })
    }
  })
}

const saveModifySort = async (data: any) => {
  await fetch({
    url: '/order/soptemplate/node/modifySort',
    method: 'post',
    params: data
  }).then((res: any) => {
    if (res.code == 0) {
      getData()
    }
  })
}

const handleNode = (row: any, index: any) => {
  if (index == '新增阶段') {
    console.log(state.templateId)
    state.stageForm = {
      name: '',
      sort: state.tableData.length + 1,
      templateId: state.templateId
    }
    projectStageShow.value = true
    stageIsEdit.value = false
  }

  if (index == '编辑阶段') {
    state.stageForm = JSON.parse(JSON.stringify(row))
    projectStageShow.value = true
    stageIsEdit.value = true
  }

  if (index == '删除阶段') {
    ElMessageBox.confirm(`此操作将永久删除${row.name}阶段, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteProjectStage(row.id)
    })
  }
  if (index == '删除节点') {
    ElMessageBox.confirm(`此操作将永久删除${row.name}节点, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteNodeData(row.id)
    })
  }
  if (index == '新增节点') {
    state.nodeId = 0
    nodeIsEdit.value = false
    state.nodeForm = {
      stageId: row.id, // 阶段id
      templateId: state.templateDataList[templateActive.value]?.id
    }
    settingNodeShow.value = true
    // console.log(state.templateDataList[templateActive.value].id, 'templateId')
  }
  if (index == '编辑节点') {
    state.nodeId = row.id
    state.templateId = state.templateDataList[templateActive.value]?.id
    nodeIsEdit.value = true
    settingNodeShow.value = true
    state.nodeForm = JSON.parse(JSON.stringify(row))
  }
}

// 根据节点id删除节点
const deleteNodeData = async (id: any) => {
  await fetch({
    url: `/order/soptemplate/node/${id}`,
    method: 'delete'
  }).then((res: any) => {
    if (res.data) {
      ElMessage({
        type: 'success',
        message: `删除成功!`
      })
      getData()
    }
  })
}

// 自定义row设置table行的背景色
const tableRowClassName = ({ row, rowIndex }: any) => {
  if (row.nodes) {
    return 'warning-row'
  }
}

// 删除阶段
const deleteProjectStage = async (id: any) => {
  await fetch({
    url: `/order/soptemplate/stage/delete/${id}`,
    method: 'post'
  }).then((res: any) => {
    if (res.data.code === 0) {
      ElMessage({
        type: 'success',
        message: `删除成功!`
      })
      getData()
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

// 根据执行岗位或被派单岗位id获取岗位名
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

// 根据节点类型code获取类型name
const setBusinessTypeName = (e: any) => {
  if (e) {
    let tempBusinessName: any = []
    tempBusinessName = businessTypeList.value.filter(
      (item: any) => item.value === Number(e)
    )
    return tempBusinessName[0] && tempBusinessName[0].label
  }
}

// 获取当前企业的项目模板列表,没有值时则初始化创建一个模板,并命名为默认模板
const getTemplateList = async () => {
  // 页面初始化时调用
  await fetch({
    url: `/order/soptemplate/default`,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      state.templateList = res.data
      state.templateId = res.data.id
    }
    if (!res.data && !res.msg) {
      // 当没有模板时默认创建一个模板
      addTemplate()
    }
    if (state.templateList) {
      // 当有模板时
      // 获取项目模板下对应的阶段和节点
      // getTemplateList()()
      state.tableData = res.data.stages
      let index = 0
      state.tableData.forEach((data1: any) => {
        data1.index = index
        index++
        data1.nodes.forEach((data2: any) => {
          data2.index = index
          index++
        })
      })
    }
  })
}

// 新增一个默认模板
const addTemplate = async () => {
  await fetch({
    url: '/order/soptemplate/create',
    method: 'post',
    data: {
      showStatus: 1, // 是否启用,默认启用
      parentId: 0,
      name: '默认模板',
      defaultFlag: '1'
    }
  }).then((res:any) => {
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: `新增项目模板成功!`
      })
      getData()
    }
  })
}

// 查询项目模板列表
const getTemplateDataList = () => {
  // 页面初始化时调用
  templateGetList({
    size: 99
  }).then((res) => {
    state.templateDataList = res.data || []
    state.templateDataList = state.templateDataList.filter((item: any) => {
      if (item.defaultFlag === 0) {
        return true
      }
    })
    if (state.templateDataList.length > 0) {
      state.templateId = state.templateDataList[templateActive.value]?.id
      getProjectGetChildList()
    }
  })
}
nextTick(() => {
  rowDrop()
})
onUnmounted(() => {})
const getData = () => {
  if (pageType.value == 1) {
    getTemplateDataList()
  }
  if (pageType.value == 2) {
    getTemplateList()
  }
}
watchEffect(() => {
  pageType.value = props.pageType
  getData()
  getSysjobsList()
})
</script>

<style scoped lang="less">
.el-sort {
  margin-left: 1rem;
  cursor: move;
  transform: rotate(90deg);
}

.left-container {
  width: max-content;
  max-width: 28rem;
  padding-right: 1rem;
  .left-container_top{
    padding: 2rem 0;
  }
  .el-empty{
    width: 28rem;
    height: calc(100% - 8rem);
  }
}

.right-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: width ease-in 0.3s;
}
/deep/.el-menu{
  border: none !important;
}
.name_left{
  width: calc(100%);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
