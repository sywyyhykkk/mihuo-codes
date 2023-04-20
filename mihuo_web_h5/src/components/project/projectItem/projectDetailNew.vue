<template>
  <div style="display: flex">
    <div class="module-left" @click="scaleHandel">
      <div class="module-left-top">
        <div v-if="state.projectGroupList.length > 0" class="status-lockout">
          <!--        <div class="status-lockout" v-if="isLockout">-->
          <img
            v-if="state.detailForm.projectStatus == 1"
            style="margin-right: 0.6rem; width: 1.2rem; height: 1.2rem"
            :src="require('@/assets/img/project/statusLockout.png')"
          >
          <!--          已停工-->
          <span>{{ state.detailForm.expectStartTime }} 至
            {{ state.detailForm.expectFinishTime }} &nbsp;{{
              getDaysBetween(
                state.detailForm.expectStartTime,
                state.detailForm.expectFinishTime
              )
            }}天工期</span>
          &nbsp;
          <span v-if="state.detailForm.obsoleteFlag == 1" style="color:#f56c6c">【已作废】</span>
          <span
            v-else
            v-html="getProjectStatus(state.detailForm.projectStatus, state.detailForm)"
          />
        </div>
        <div
          v-for="(item, index) in tabs"
          :key="index"
          :class="tabsIndex == index ? 'tabs-button-active' : 'tabs-button'"
          @click="handelSelect(index)"
        >
          <img
            style="width: 1.4rem; height: 1.4rem"
            :src="
              require(`@/assets/img/project/${
                tabsIndex == index ? item.img2 : item.img
              }`)
            "
          >
          <span style="margin-left: 0.6rem">{{ item.title }}</span>
        </div>

        <div class="pantograph-ratio">
          <el-button
            type="text"
            class="column-button"
            :style="proportionValue <= 10 ? 'color: #DCDFE6 !important;' : ''"
            icon="minus"
            :disabled="proportionValue <= 10"
            @click="proportionButton('缩小')"
          />
          <div class="zoom-ratio-column">{{ proportionValue }}%</div>
          <el-button
            type="text"
            class="column-button"
            :style="proportionValue == 100 ? 'color: #DCDFE6 !important;' : ''"
            icon="plus"
            :disabled="proportionValue == 100"
            @click="proportionButton('放大')"
          />
        </div>
      </div>
      <div
        v-if="state.projectGroupList.length == 0"
        class="module-left-buttom"
        style="justify-content: center"
      >
        <el-empty
          :image-size="300"
          description="暂未导入模板~"
          :image="require('@/assets/img/empty/no_data.png')"
        />
      </div>
      <div
        v-if="state.projectGroupList.length > 0"
        class="module-left-buttom"
        :class="state.detailForm.projectStatus == 1 ? 'shut-down' : ''"
        :style="styleStatus"
      >
        <div>
          <div class="group-list" :style="proprotionStyle">
            <div v-for="(item, index) in state.projectGroupList" :key="index">
              <div
                class="stage-card"
                style="min-width: 254px; min-height: 100%; padding-bottom: 1rem"
                :style="getStyle(item.groupType)"
              >
                <div class="stage-card-title">
                  <div class="stage-name">{{ item.groupName }}</div>
                  <progressStep
                    :percentage="
                      parseFloat(
                        $getNum.numDiv(item.completeCount, item.totalCount)
                      ).toFixed(2)
                    "
                    :all-project="item.totalCount"
                    :finish-project="item.completeCount"
                  />
                </div>
                <div class="node-list">
                  <projectCard
                    v-for="(item2, index2) in item.nodes"
                    :key="index2"
                    v-model="item2.cardStatus"
                    :data="item2"
                    :active="
                      showDrawer && item2.nodeId == state.data.content.nodeId
                    "
                    @click.stop="cardClick(item, item2)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module-right">
      <el-card>
        <div class="project-button">
          <el-button
            v-if="$getPression('order_bizproject_edit')"
            type="primary"
            icon="plus"
            size="small"
            style="margin: 0 !important;"
            @click="addNode('customAdd')"
          >
            添加节点
          </el-button>
          <el-button
            v-if="$getPression('order_bizproject_edit')"
            type="primary"
            :plain="!state.projectTemplateId"
            icon="refresh"
            size="small"
            style="margin: 0 !important;"
            @click="syncTemplate()"
          >
            同步模板
          </el-button>
          <el-button
            v-if="$getPression('order_bizproject_edit')"
            type="primary"
            :plain="!state.projectTemplateId"
            icon="download"
            size="small"
            style="margin: 0 !important;"
            @click="importTemplate()"
          >
            导入模板
          </el-button>
        </div>
      </el-card>
      <div style="position: relative">
        <div
          class="right-top-card"
          :style="
            state.detailForm.projectStatus == 1
              ? 'background: linear-gradient(90deg, #DE4343, #F77C7C);'
              : ''
          "
        >
          <div class="address-info">
            <div class="top-address">
              <el-icon
                size="2.5rem"
                color="#ffffff"
                style="position: absolute; top: 2rem"
              >
                <office-building />
              </el-icon>

              <div class="address-text">
                {{ state.detailForm.poiName }}{{ state.detailForm.address }}
              </div>
              <div class="person-message">
                <el-icon size="1.2rem" color="#ffffff">
                  <chat-line-round />
                </el-icon>
                <div style="margin-left: 0.5rem">业主群</div>
              </div>
            </div>
            <div class="address-text-data">
              {{ state.detailForm.provinceName }}{{ state.detailForm.cityName
              }}{{ state.detailForm.region }}{{ state.detailForm.latAddress
              }}{{ state.detailForm.poiName }}{{ state.detailForm.address }}
            </div>
            <div class="person-info-msg">
              <div style="display: flex; align-items: center">
                <el-icon size="1.6rem">
                  <user />
                </el-icon>
                <span class="person-name" style="margin-left: 0.5rem">{{
                  state.detailForm.customerName
                }}</span>
              </div>
              <div style="display: flex; align-items: center">
                <el-icon size="1.6rem">
                  <iphone />
                </el-icon>
                <span class="person-phone" style="margin-left: 0.5rem">{{
                  state.detailForm.customerPhone
                }}</span>
              </div>
              <el-icon
                size="1.6rem"
                style="cursor: pointer"
                @click="editProjectHandel"
              >
                <editPen />
              </el-icon>
            </div>
          </div>
        </div>

        <div class="project-info">
          <div
            v-for="(item, index) in projectItem"
            :key="index"
            class="project-info-item"
          >
            <div class="item-title">{{ item.title }}</div>
            <div class="item-img">
              <img
                class="item-img-icon"
                :src="require(`@/assets/img/project/${item.imgUrl}`)"
              >
              <div class="item-text">
                {{ index == 0 ? '￥' : '' }}
                {{
                  index == 6 ? state.pioneerName : state.detailForm[item.data]
                }}
                {{ index == 5 ? 'm²' : index == 1 ? '天' : '' }}
              </div>
            </div>
          </div>
        </div>

        <div class="health">
          <div class="health-title">
            <div
              class="score"
              :style="
                state.detailForm.lastScoreTime && state.detailForm.score < 60
                  ? 'color: #DF4646'
                  : state.detailForm.score < 80 && state.detailForm.score >= 60
                    ? 'color: #E67524'
                    : ''
              "
            >
              <span>{{
                state.detailForm.lastScoreTime ? state.detailForm.score : '--'
              }}</span>
              <span style="font-size: 1.4rem">分</span>
              <span
                style="font-size: 1.4rem; color: #909399; margin-left: 0.6rem"
              >项目健康分数</span>
            </div>
            <div
              v-if="
                state.detailForm.lastScoreTime && state.detailForm.score >= 80
              "
              class="health-type"
            >
              低风险
            </div>
            <div
              v-if="
                state.detailForm.lastScoreTime &&
                  state.detailForm.score < 80 &&
                  state.detailForm.score >= 60
              "
              class="health-type"
              style="color: #e67524; background: rgba(230, 220, 36, 0.16)"
            >
              中风险
            </div>
            <div
              v-if="
                state.detailForm.lastScoreTime && state.detailForm.score < 60
              "
              class="health-type"
              style="color: #df4646; background: #fef0f0"
            >
              高风险
            </div>
          </div>
          <div class="test-time">
            <span>{{
              state.detailForm.lastScoreTime
                ? `上次检测时间 ${state.detailForm.lastScoreTime}`
                : '还没检测过，快去检测吧'
            }}</span>
            <sapn
              v-if="
                state.detailForm.lastScoreTime &&
                  getDaysBetween(state.detailForm.lastScoreTime, new Date()) > 20
              "
              style="color: #df5330; font-weight: bold"
            >
              (已{{
                getDaysBetween(state.detailForm.lastScoreTime, new Date())
              }}天未检测)
            </sapn>
          </div>
          <div class="test-item">
            <div class="test-button" @click="goProjectTest">项目健康检测</div>
            <img
              class="test-item-img"
              :src="require('@/assets/img/project/projectScore.png')"
            >
          </div>
        </div>
        <div class="person-im">
          <div v-for="item in jobMenList" :key="item.skillId">
            <div v-if="item.skillId != -1" class="skill-name">
              <span>{{ item.skillName }}</span>
            </div>
            <div
              v-for="(item2, index) in item.members"
              v-if="item.skillId != -1"
              :key="index"
              class="person-info"
            >
              <div style="display: flex; align-items: center; flex: 1">
                <img
                  class="person-info-img"
                  :src="$getUrl.getPicUrl(item2.avatar)"
                >
                <span class="person-name person-name-text">{{
                  item2.name ? item2.name : '无名'
                }}</span>
                <span class="person-name" style="color: #bfbfbf">|</span>
                <span class="person-name" style="color: #bfbfbf">{{
                  item2.phone
                }}</span>
              </div>
              <img
                :src="require('@/assets/img/message.png')"
                class="person-message"
                @click="openImPage(item2)"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    项目检测-->
    <projectTest
      v-model="showDialog"
      :project-id="state.projectId"
      @getProjectDetial="getProjectById"
      @handelDispose="cardClick"
    />
    <!--导入模板-->
    <importTemplateProject
      v-if="downloadType"
      v-model="downloadType"
      :data="state.form"
      @getProjectData="getProjectData"
    />
    <!--    <addNode-->
    <!--      v-model="showNodeType"-->
    <!--      :projectStageId="projectStageId"-->
    <!--      :nodeData="nodeData"-->
    <!--      :companyProjectId="detailFrom.id"-->
    <!--      @getTree="getProjectData"-->
    <!--    />-->

    <!-- 项目Drawer 抽屉 -->
    <project-drawer
      v-model="showDrawer"
      size="100rem"
      :data="state.data"
      @nodeClick="nodeClick"
      @handleEdit="showEditProjectNode = true"
      @handleDel="deleteProjectNode"
    >
      <template #content>
        <!--        派单-->
        <projectSendOrder
          v-if="state.data.content.businessType === '1002'"
          :node-data="state.data.content"
          :project-id="state.projectId"
          :detail-form="state.detailForm"
          @getByData="getByData"
        />
        <!-- 上传 -->
        <project-upload
          v-if="state.data.content.businessType == '1006'"
          v-model="showDrawer"
          :data="state.data"
          @getByData="getByData"
        />
        <!-- 选材 -->
        <material-selection
          v-if="state.data.content.businessType == '1001'"
          :data="state.data.content"
        />
        <!-- 量房 -->
        <measuring-room
          v-if="state.data.content.businessType == '1011'"
          :data="state.data.content"
        />
        <!-- 交底 -->
        <disclose-news
          v-if="state.data.content.businessType == '1010'"
          :data="state.data.content"
        />
        <!-- 收款 -->
        <collection-news
          v-if="state.data.content.businessType == '1012'"
          :data="state.data.content"
        />
        <!-- 评价 -->
        <evaluate-news
          v-if="state.data.content.businessType == '1009'"
          :data="state.data.content"
        />
        <!-- 施工-->
        <projectConstruction
          v-if="state.data.content.businessType == '1004'"
          :data="state.data.content"
          :project-id="state.projectId"
        />
        <!-- 验收-->
        <projectAccept
          v-if="state.data.content.businessType == '1005'"
          :data="state.data.content"
          :project-id="state.projectId"
        />
        <!-- 无类型-->
        <noType
          v-if="state.data.content.businessType == '1000'"
          :data="state.data.content"
          :project-id="state.projectId"
        />
        <!-- 开单节点-->
        <billingInformation
          v-if="state.data.content.businessType == '1015'"
          :data="state.data.content"
          :project-id="state.projectId"
        />
      </template>
    </project-drawer>

    <!--    //新增编辑项目-->
    <projectSetting
      v-if="dialogVisible"
      v-model="dialogVisible"
      :is-edit="true"
      :project-id="state.projectId"
      @getData="getProjectById"
    />
    <!--    添加节点-->
    <settingNode
      v-if="settingNodeShow"
      v-model="settingNodeShow"
      :is-edit="false"
      :add-type="addType"
      :node-data="state.detailForm"
      :project-id="state.projectId"
      :node-id="0"
      @getData="getProjectData()"
    />

    <!--    编辑项目节点-->
    <editProjectNode
      v-if="showEditProjectNode"
      v-model:nodeData="state.data.content"
      v-model="showEditProjectNode"
      @getData="getProjectData()"
    />
  </div>
</template>

<script lang="ts" setup>
import wsCache from '@/cache'
import {
  ref,
  reactive,
  onMounted,
  defineEmits,
  getCurrentInstance,
  provide
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ImStore } from '_@/store/modules/im'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Format } from '@/getDate'
import { openIm } from '@/utils/chat.js'
import {
  getDaysBetween,
  getCardType,
  getGroupType,
  getStatusImg,
  getStyle,
  getProjectStatus,
  getGroupByWorker
} from '@/components/project/projectItem/projectDetailNewData'
import { useRoute } from 'vue-router'
import { baseDecode } from '@/utils/utils'

const { proxy } = getCurrentInstance() as any
const proportionValue = ref<any>(100)
const proprotionStyle = ref<any>('')
const imsdk = require('@/xsoftimsdk.js')
const styleStatus = ref<any>({})
const showEditProjectNode = ref<boolean>(false)
const showOrderSelectPerson = ref(false) // 找人接单
const showDrawer = ref(false) // 项目Drawer 抽屉
const titleName = ref() // 项目Drawer抽屉标题
const isLockout = ref(false) // 是否停工
const settingNodeShow = ref(false) // 添加节点
const dialogVisible = ref(false) // 编辑项目
const showDialog = ref(false)
const downloadType = ref(false)
const selectType = ref(false)
const tabsIndex = ref(0)
const jobMenList = ref([])
const ruleForms = ref<any>('')
const addType = ref<any>('')
const route = useRoute()
const state = reactive({
  projectId: baseDecode(
    JSON.parse(
      JSON.stringify(route.path.substring(route.path.lastIndexOf('/') + 1))
    )
  ), // 项目id
  detailForm: {} as any, // 项目信息
  projectGroupList: [],
  form: {} as any,
  projectDetailList: [],
  pioneerName: '',
  formProject: {
    companyProjectId: '',
    companyProjectNodeId: 0,
    pioneer: '',
    pioneerJobId: '0' as any,
    pioneerJobName: '',
    pioneerUserId: 0,
    pioneerName: '',
    pioneerJobCode: ''
  },
  jobMembers: [] as any,
  jobMembersData: [] as any,
  selectType: false,
  nodeData: [],
  showNodeType: false,
  projectTemplateId: false,
  data: {
    stage: null,
    content: null,
    groupList: null
  } as any
})
provide('projectId', state.projectId)
provide('nodeData', state.data.content)
// const personType = reactive([
//   { type: 'JOB_MANAGER', name: '项目管家' },
//   { type: 'JOB_SUPERVISION', name: '项目监理' },
//   { type: 'JOB_DESIGNER', name: '设计师' },
//   { type: 'JOB_WORKER', name: '工人' }
// ])
const tabs = reactive([
  { title: '阶段模式', img: 'stageModule1.png', img2: 'stageModule2.png' },
  { title: '分组模式', img: 'groupModule1.png', img2: 'groupModule2.png' },
  { title: '状态模式', img: 'statusModule1.png', img2: 'statusModule2.png' },
  { title: '岗位模式', img: 'skillModule1.png', img2: 'skillModule2.png' }
])
const projectItem = reactive([
  {
    title: '施工合同金额',
    imgUrl: 'contractAmount.png',
    data: 'contractAmount'
  },
  { title: '合同工期', imgUrl: 'contractDate.png', data: 'contractDuration' },
  { title: '户型', imgUrl: 'houseType.png', data: 'model' },
  { title: '房型', imgUrl: 'roomType.png', data: 'roomType' },
  { title: '装修方式', imgUrl: 'decorateWay.png', data: 'way' },
  { title: '实用面积', imgUrl: 'area.png', data: 'usableArea' }
  // { title: '第一执行人', imgUrl: 'area.png', data: 'usableArea' }
])
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
  { label: '开单', value: 1015 },
])

const scaleHandel = () => {
  showDrawer.value = false
}

// 添加节点
const addNode = (type:string) => {
  if (state.projectTemplateId) {
    settingNodeShow.value = true
    addType.value = type// 业务类型，导入模板后的添加
  } else {
    ElMessage.warning('您还没导入模板，请先导入模板后再试')
  }
}
// 编辑项目信息
const editProjectHandel = () => {
  dialogVisible.value = true
}

// 节点卡片区域的放大缩小
const proportionButton = (row: any) => {
  if (row == '放大') {
    if (proportionValue.value >= 100) {
      return
    } else {
      proportionValue.value = proxy.$getNum.numAdd(proportionValue.value, 10)
      const scale = proxy.$getNum.numDiv(proportionValue.value, 100)
      const translate = proxy.$getNum.numDiv(
        proxy.$getNum.numSub(100, proportionValue.value),
        2
      )
      proprotionStyle.value = `
 -webkit-transform: translate(-${translate}%,-${translate}%) scale(${scale});
  transform: translate(-${translate}%,-${translate}%) scale(${scale});
  min-height:${proportionValue.value}%;
      `
    }
  }
  if (row == '缩小') {
    if (proportionValue.value <= 10) {
      return
    } else {
      proportionValue.value = proxy.$getNum.numAdd(proportionValue.value, -10)
      const scale = proxy.$getNum.numDiv(proportionValue.value, 100)
      const translate = proxy.$getNum.numDiv(
        proxy.$getNum.numSub(100, proportionValue.value),
        2
      )
      proprotionStyle.value = `
 -webkit-transform: translate(-${translate}%,-${translate}%) scale(${scale});
  transform: translate(-${translate}%,-${translate}%) scale(${scale});
 min-height:${proportionValue.value}%;
   `
    }
  }
}
const goProjectTest = () => {
  if (state.projectTemplateId) {
    showDialog.value = true
  } else {
    ElMessage.warning('您还没导入模板，请先导入模板后再试')
  }
}
// 点击节点卡片
const cardClick = (data: any, item: any) => {
  state.data.stage = data
  state.data.content = item
  state.data.groupList = state.projectGroupList
  showDrawer.value = true
  switch (item.businessType) {
    case '1002': // 派单类节点
      break
    case '1006': // 上传类节点
      break
    default:
      break
  }
}

// 节点点击事件
const nodeClick = (node: any) => {}

const handelSelect = (index: number) => {
  tabsIndex.value = index
  getProjectDetailData()
}
// 获取imid并聊天
const openImPage = (data: any) => {
  openIm(data)
}

// 同步模板节点
const syncTemplate = () => {
  ElMessageBox.confirm(`此操作同步该项目模板节点, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await fetch({
      url: `/order/bizproject/syncSopTemplateNode/${state.projectId}`,
      method: 'post'
    }).then((res: any) => {
      if (res.code === 0 && res.data) {
        ElMessage.success('同步模板节点成功')
        getProjectData()
      } else {
        ElMessage.error('同步模版节点失败')
      }
    })
  })
}

// 导入模板的事件
const importTemplate = () => {
  if (state.projectTemplateId) {
    ElMessageBox.confirm(`此操作将覆盖当前项目视图, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      downloadType.value = true
      state.form = {
        projectId: state.projectId,
        startDate: '',
        templateId: state.form.templateId,
        ignoreGovHoliday: 0,
        ignoreWeekend: 0
      }
    })
  } else {
    downloadType.value = true
    state.form = {
      projectId: state.projectId,
      startDate: '',
      templateId: state.form.templateId,
      ignoreGovHoliday: 0,
      ignoreWeekend: 0
    }
  }
}
const getByData = () => {
  getJobMenList()
  getProjectDetailData()
}

// 删除节点
const deleteProjectNode = async () => {
  ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await fetch({
      url: `/order/bizproject/projectnode/remove/${state.data.content.nodeId}`,
      method: 'post'
    }).then((res: any) => {
      if (res.code == '0') {
        ElMessage.success('删除节点成功')
        showDrawer.value = false
        getProjectData()
      }
    })
  })
}

// 获取人员信息
const getJobMenList = async () => {
  await fetch({
    url: `/order/project/member/group?projectId=${state.projectId}`,
    method: 'get'
  }).then((res: any) => {
    jobMenList.value = res.data ? getGroupByWorker(res.data) : []
  })
}

// 查询是否导入了项目模板
const getProjectData = async () => {
  getProjectById()
  // await fetch({
  //   url: `/order/bizproject/detail/sop/${state.projectId}`,
  //   method: 'get'
  // }).then((res: any) => {
  //   state.projectDetialList = res.data.stages
  //   // state.jobMenList = res.data.jobMen
  //   state.projectTemplateId = res.data.projectTemplateId || '0'
  getProjectDetailData()
  getJobMenList()
  // })
}

// 按分组查询项目详情
const getProjectDetailData = async () => {
  await fetch({
    url: `/order/bizproject/detail/sop/group`,
    method: 'get',
    params: {
      groupType: tabsIndex.value,
      projectId: state.projectId
      // projectId: 293
    }
  }).then((res: any) => {
    if (res.data?.groups.length > 0) {
      state.projectTemplateId = true
    }
    state.projectGroupList = res.data.groups
      ? getGroupType({
        row: res.data.groups,
        time: state.detailForm?.expectFinishTime
      })
      : []
  })
}
// 编辑时根据项目id查询项目信息
const getProjectById = async () => {
  await fetch({
    url: `/order/bizproject/${state.projectId}`,
    method: 'get'
  }).then((res: any) => {
    state.detailForm = res.data
    wsCache.set('projectDetail', res.data)
    sessionStorage.setItem('detailFrom', JSON.stringify(res.data))
  })
}
onMounted(() => {
  getProjectData()
})
</script>

<style scoped lang="less">
.status-lockout {
  position: absolute;
  left: 2rem;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #303133;
  transform: translateX(-10%) scale(0.8);
}

::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 8px;
}

.group-list {
  display: flex;
  height: auto;
}

.person-im {
  margin: 2rem;
  padding: 2rem 0;

  .skill-name {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #0969da;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .person-info {
    margin-bottom: 2rem;
    display: flex;
    align-items: center;

    .person-message {
      width: 12px;
      height: 12px;
      text-align: right;
    }

    .person-name-text {
      width: 7rem;
      text-overflow: ellipsis;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      -moz-text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-name {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #303133;
      margin: 0 1rem;
    }

    .person-info-img {
      width: 30px;
      height: 30px;
      //background: #0969DA;
      border-radius: 50%;
    }
  }
}

.module-left {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 39rem;

  .module-left-top {
    display: flex;
    justify-content: center;
    height: 7.6rem;
    align-items: center;

    .pantograph-ratio {
      position: absolute;
      right: 0rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      border: 1px solid #e4e7ed;
      border-radius: 15px;
      color: #606266;

      .column-button {
        height: 3rem;
        color: #606266 !important;
        margin: 0 1.2rem;
      }

      .zoom-ratio-column {
        font-size: 12px;
        font-weight: 400;
        //min-width: 5rem;
        height: 30px;
        text-align: center;
        line-height: 3rem;
      }
    }
  }

  .tabs-button-active {
    padding: 0 2.5rem;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #0969da;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .tabs-button {
    padding: 0 2.5rem;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #909399;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .shut-down {
    border: 1px solid #f56c6c;
  }

  .module-left-buttom {
    position: absolute;
    bottom: 0;
    left: 2rem;
    right: 0;
    top: 7.6rem;
    background: #ffffff;
    display: flex;
    white-space: nowrap;
    overflow-x: auto;

    .stage-card {
      width: 25.4rem;
      min-height: auto;
      //min-width: 25.4rem;
      border: solid 1px #ffffff;
      background: #f0f9eb;

      .node-list {
        position: relative;
        height: calc(100% - 15rem);
        width: 100%;
        padding-bottom: 2rem;
        //overflow-y: auto;
      }

      .stage-card-title {
        padding: 3rem 2rem;
        border-bottom: solid 1px #ffffff;

        .stage-name {
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #303133;
          margin-bottom: 1.5rem;
        }
      }
    }
  }
}

.module-right {
  position: absolute;
  width: 35rem;
  padding: 0 2rem 2rem 2rem;
  top: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;

  .project-button {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: .5rem;
  }
}

.health {
  margin: 2rem 0rem 0rem 0rem;
  padding: 3rem 2rem 2rem 2rem;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.03);
  border-radius: 6px;

  .test-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .test-item-img {
      height: 8.5rem;
      width: 8.5rem;
    }

    .test-button {
      line-height: 3.6rem;
      margin-top: 1.5rem;
      height: 3.6rem;
      padding: 0 1.5rem;
      background: linear-gradient(90deg, #2da44e, #3bcf64);
      border-radius: 18px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
    }
  }

  .test-time {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #1a1a1a;
    margin-top: 2rem;
  }

  .health-title {
    height: 2.4rem;
    display: flex;
    justify-content: space-between;

    .score {
      font-size: 30px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2da44e;
    }
  }

  .health-type {
    height: 22px;
    line-height: 22px;
    background: #f0f9eb;
    border-radius: 11px;
    padding: 0 8px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #2da44e;
    margin-top: 1rem;
  }
}

.project-info {
  padding: 2rem 0 0 0;
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.03);
  border-radius: 6px;

  .project-info-item {
    width: calc(50% - 2rem);
    //display: flex;
    margin-bottom: 2rem;
    padding-left: 2rem;

    .item-title {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #909399;
    }

    .item-img {
      display: flex;
      margin-top: 1rem;
      // height: 1.6rem;
      align-items: center;

      .item-text {
        line-height: 2rem;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #303133;
        margin-left: 0.7rem;
      }

      .item-img-icon {
        width: 1.4rem;
        height: 1.4rem;
      }
    }
  }
}

.right-top-card {
  //height: 12.5rem;
  background: linear-gradient(90deg, #0969da, #409eff);
  border-radius: 6px 6px 0 0;
  width: 35rem;
  padding: 2rem 0;
  display: flex;

  .address-info {
    margin-left: 1.5rem;
    width: calc(100% - 4rem);
  }

  .person-info-msg {
    margin-top: 2rem;
    margin-left: 3.6rem;
    height: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.5rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;

    .person-name {
      max-width: 7rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-phone {
      max-width: 11rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .address-text-data {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #d9ecff;
    margin-top: 1rem;
    margin-left: 3.6rem;
    line-height: 20px;
  }

  .top-address {
    display: flex;
    color: #ffffff;
    min-height: 2rem;
    align-items: center;
    justify-content: space-between;

    .person-message {
      position: absolute;
      top: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      height: 2rem;
      font-size: 1.2rem;
      //margin-left: 1rem;
      flex: 1;
      justify-content: right;
    }

    .address-text {
      font-size: 18px;
      color: #ffffff;
      display: flex;
      flex-wrap: wrap;
      line-height: 25px;
      margin-left: 3.5rem;
      width: calc(100% - 10rem);
      text-align: left;
    }
  }
}
</style>
