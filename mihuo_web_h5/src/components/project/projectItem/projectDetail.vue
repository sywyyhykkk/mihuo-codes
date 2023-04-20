<template>
  <div>
    <div style="float: left; width: calc(80% - 15px); padding-top: 2rem">
      <div class="card-top">
        <div>
          <img src="@/assets/img/houses.png" class="houses">
          <div class="address">{{ detailFrom.address }}</div>
          <div class="news">
            <img src="@/assets/img/news.png" class="news-image">
            <span class="news-title">群消息</span>
          </div>
          <el-button
            type="primary"
            class="button-down"
            :plain="projectTemplateId === '0' ? true : false"
            icon="download"
            @click="importTemplate()"
          >
            导入模板
          </el-button>
          <div style="clear: both" />
        </div>

        <div class="table">
          <div class="table_box">姓名</div>
          <div class="table_box">联系电话</div>
          <div class="table_box">施工合同金额</div>
          <div class="table_box">合同工期</div>
          <div class="table_box">户型</div>
          <div class="table_box">房型</div>
          <div class="table_box">实用面积</div>
          <div class="table_box">第一执行人</div>
          <div class="table_box2">{{ detailFrom.customerName }}</div>
          <div class="table_box2">{{ detailFrom.customerPhone }}</div>
          <div class="table_box2">
            ￥{{
              detailFrom.contractAmount
                ? detailFrom.contractAmount.toFixed(2)
                : ''
            }}
          </div>
          <div class="table_box2">{{ detailFrom.contractDuration }}天</div>
          <div class="table_box2">{{ detailFrom.model }}</div>
          <div class="table_box2">{{ detailFrom.roomType }}</div>
          <div class="table_box2">{{ detailFrom.usableArea }}㎡</div>
          <div class="table_box2">{{ pioneerName }}</div>
        </div>
      </div>

      <div class="card-bottom">
        <div v-if="projectTemplateId === '0'">
          <img src="@/assets/img/no_content.png" class="no-content">
          <div class="no-content-text">暂无项目视图</div>
          <el-button
            type="primary"
            class="button-down2"
            icon="download"
            @click="importTemplate()"
          >
            导入模板
          </el-button>
        </div>
        <div v-else style="display: flex">
          <div v-for="item in projectDetialList" class="card-tree">
            <projectDetailTree
              v-if="item.groups.length > 0"
              :tree-data="item"
              @showAdd="showAdd"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="card-right">
      <div
        v-for="(item2, index2) in personType"
        :key="index2"
        class="right-data"
      >
        <div class="card-right-top">
          <span
            class="person-title"
            :style="
              index2 == 0
                ? ''
                : index2 == 1
                  ? 'color:#F2AA3D'
                  : index2 == 2
                    ? 'color: #F56C6C;'
                    : 'color: #67C23A;'
            "
          >{{ item2.name }}</span>
        </div>
        <div
          v-for="(item, index) in jobMenList[item2.type]"
          v-if="jobMenList[item2.type]"
          :key="index"
          class="person"
        >
          <!--          <div class="personImage"></div>-->
          <img class="personImage" :src="$getUrl.getPicUrl(item.avatar)">
          <div class="person-name">
            {{ item.name ? item.name : '无名' }}
          </div>
          <div class="person-phone">{{ item.phone }}</div>
          <img
            src="@/assets/img/message.png"
            class="person-message"
            @click="openIm(item)"
          >
        </div>
        <div style="clear: both" />
      </div>
    </div>

    <el-dialog
      v-model="downloadType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="导入模板"
      width="55rem"
    >
      <el-form
        ref="ruleForms"
        :model="form"
        :rules="rules"
        label-width="11rem"
      >
        <el-form-item label="模板名称" prop="templateId">
          <el-select
            v-model="form.templateId"
            disabled
            filterable
            placeholder="请选择模板"
          >
            <el-option
              v-for="(item, index) in templateList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择日期"
            style="width: 19rem"
          />
        </el-form-item>
        <el-form-item label="节假日施工" prop="ignoreGovHoliday">
          <el-radio-group v-model="form.ignoreGovHoliday">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="周末施工" prop="ignoreWeekend">
          <el-radio-group v-model="form.ignoreWeekend">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="loading"
            @click="handleConfirm()"
          >确 定</el-button>
          <el-button @click="downloadType = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <addNode
      v-model="showNodeType"
      :project-stage-id="projectStageId"
      :node-data="nodeData"
      :company-project-id="detailFrom.id"
      @getTree="getProjectData"
    />

    <el-dialog
      v-model="selectType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="选择第一执行人"
    >
      <el-form ref="ruleForms" :model="formProject" label-width="9rem">
        <el-form-item label="第一执行人" prop="pioneerJobId">
          <el-select
            v-model="formProject.pioneer"
            filterable
            placeholder="请选择第一执行人"
            @change="changePioneerJob"
          >
            <el-option
              v-for="(item, index) in jobMembers"
              :key="index"
              :label="item.skillName + '-' + item.name"
              :value="item.personId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="loading"
            @click="handleProjectConfirm()"
          >确 定</el-button>
          <el-button @click="selectType = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import projectDetailTree from '_c/project/projectItem/projectDetailTree.vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Format } from '@/getDate'
import addNode from '_c/project/projectItem/addNode.vue'
import { appStore } from '_@/store/modules/app'
import { template } from 'lodash-es'
import { ImStore } from '_@/store/modules/im'

export default defineComponent({
  components: { projectDetailTree, addNode },
  props: {
    detailForm: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    const state = reactive({
      ruleForms: '' as any,
      rules: {
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        templateId: [{ required: true, message: '请选择模板', trigger: 'blur' }]
      },
      detailForm: JSON.parse(
        sessionStorage.getItem('detailFrom') as string
      ) as any,
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
      projectTemplateId: '0',
      jobMenList: [],
      projectDetailList: [] as any,
      loading: false,
      disabledDate(time: any) {
        return time.getTime() > Date.now()
      },
      downloadType: false,
      form: {
        companyProjectId: '',
        startDate: '',
        templateId: '',
        ignoreGovHoliday: 0,
        ignoreWeekend: 0
      },
      projectStageId: '',
      templateList: [] as any,
      personType: [
        {
          type: 'JOB_MANAGER',
          name: '项目管家'
        },
        {
          type: 'JOB_SUPERVISION',
          name: '项目监理'
        },
        {
          type: 'JOB_DESIGNER',
          name: '设计师'
        },
        {
          type: 'JOB_WORKER',
          name: '工人'
        }
      ]
    })
    const openIm = (data: any) => {
      console.log(data)
      fetch({
        url: `/basic/im/getimidbyuserid/${data.userId}`,
        method: 'get'
      }).then((res) => {
        ImStore.AddSessionList({
          targetName: data.name,
          targetId: res.data
        })
        ImStore.SetToUser({
          targetName: data.name,
          targetId: res.data
        })
        ImStore.SetImShow(true)
      })
    }
    const getJobMenList = async () => {
      await fetch({
        url: `/order/biztask/taskMemberList?projectId=${state.detailForm.id}`,
        method: 'get'
      }).then((res: any) => {
        state.jobMenList = res.data
      })
    }

    const getOneNode = async () => {
      await fetch({
        url: `/order/bizproject/sop/tops/${state.detailForm.id}`,
        method: 'get',
        showErrorMessage: false
      }).then((res: any) => {
        if (res.data) {
          state.jobMembersData = res.data
          state.formProject.companyProjectNodeId = res.data[0].nodeId
          state.jobMembers = res.data[0].jobMembers
          console.log(state.jobMembers)
          // res.data.map((item: any) => {
          //   state.jobMembers.push(...item.jobMembers)
          // })
          if (state.jobMembers.length > 0) {
            state.selectType = true
          } else {
            ElMessage.warning('暂无符合条件的项目管理员')
          }
        } else {
          ElMessage.warning(res.msg || '暂无符合条件的第一执行节点')
        }
      })
    }
    const changePioneerJob = (val: any) => {
      state.jobMembers.map((res: any) => {
        if (res.personId === val) {
          state.formProject.pioneerJobId = res.skillId
          state.formProject.pioneerJobName = res.skillName
          state.formProject.pioneerUserId = res.userId
          state.formProject.pioneerName = res.name
          state.formProject.pioneerJobCode = res.jobCode
        }
      })
    }
    const showAdd = (
      val: boolean,
      projectStageId: any,
      treeDataGroups: any
    ) => {
      state.showNodeType = val
      state.projectStageId = projectStageId
      const nodes: any = []
      treeDataGroups.map((res: any) => {
        nodes.push(...res.nodes)
      })
      state.nodeData = nodes
    }
    const importTemplate = () => {
      if (state.projectTemplateId !== '0') {
        ElMessageBox.confirm(`此操作将覆盖当前项目视图, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          state.downloadType = true
          state.form = {
            companyProjectId: state.detailForm.id,
            startDate: '',
            templateId: state.form.templateId,
            ignoreGovHoliday: 0,
            ignoreWeekend: 0
          }
        })
      } else {
        state.downloadType = true
        state.form = {
          companyProjectId: state.detailForm.id,
          startDate: '',
          templateId: state.form.templateId,
          ignoreGovHoliday: 0,
          ignoreWeekend: 0
        }
      }
    }
    const handleConfirm = () => {
      state.ruleForms.validate((valid: any) => {
        if (valid) {
          state.loading = true
          state.form.startDate = Format(state.form.startDate, 'yyyy-MM-dd')
          addImportTemplate()
          state.loading = false
        } else {
          alert('请完善信息')
          return false
        }
      })
    }
    const getProjectData = async () => {
      await fetch({
        url: `/order/bizproject/detail/sop/${state.detailForm.id}`,
        method: 'get'
      }).then((res: any) => {
        state.projectDetailList = res.data.stages
        // state.jobMenList = res.data.jobMen
        state.projectTemplateId = res.data.projectTemplateId
        state.pioneerName = res.data.pioneerName
          ? res.data.pioneerName
          : '暂无指派'
        if (res.data.pioneerName) {
          getJobMenList()
        }
        if (
          res.data.pioneer === '0' &&
          !res.data.pioneerName &&
          state.projectTemplateId !== '0'
        ) {
          getOneNode()
        }
      })
    }
    const handleProjectConfirm = () => {
      setTopEmployee()
    }
    const setTopEmployee = async () => {
      state.formProject.companyProjectId = state.detailForm.id
      await fetch({
        url: ` /order/bizproject/setTopEmployee`,
        method: 'put',
        data: state.formProject
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('指定成功')
          getProjectData()
          getJobMenList()
          state.selectType = false
        }
      })
    }
    const getTemplateList = async () => {
      await fetch({
        url: ` /order/soptemplate/getList`,
        method: 'get',
        params: {
          showStatus: 0
        }
      }).then((res: any) => {
        state.templateList = res.data
        if (state.templateList.length === 0) {
          ElMessage.warning('您还没创建项目模板')
        }
        if (state.templateList.length > 0) {
          state.form.templateId = state.templateList[0].id
        }
      })
    }
    const addImportTemplate = async () => {
      await fetch({
        url: ` /order/bizproject/soptempalte`,
        method: 'put',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('导入成功')
          state.downloadType = false
          getProjectData()
        }
      })
    }
    onMounted(() => {
      getProjectData()
      getTemplateList()
      // getJobMenList()
    })
    return {
      getJobMenList,
      setTopEmployee,
      handleProjectConfirm,
      changePioneerJob,
      getOneNode,
      showAdd,
      addImportTemplate,
      handleConfirm,
      importTemplate,
      getTemplateList,
      getProjectData,
      openIm,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
@-webkit-keyframes right-data {
  0% {
    -webkit-transform: scale(1) translateX(2000px);
    transform: scale(1) translateX(2000px);
  }
  50% {
    -webkit-transform: scale(1) translateX(1000px);
    transform: scale(1) translateX(1000px);
  }
  100% {
    -webkit-transform: scale(1) translateX(0px);
    transform: scale(1) translateX(0px);
  }
}

@keyframes right-data {
  0% {
    -webkit-transform: scale(1) translateX(2000px);
    transform: scale(1) translateX(2000px);
  }
  50% {
    -webkit-transform: scale(1) translateX(1000px);
    transform: scale(1) translateX(1000px);
  }
  100% {
    -webkit-transform: scale(1) translateX(0px);
    transform: scale(1) translateX(0px);
  }
}

.card-right {
  float: right;
  width: 15%;
  height: 84vh;
  background: #ffffff;
  padding: 0 20px 0 20px;
  -webkit-animation: right-data 0.65s linear both;
  animation: right-data 0.65s linear both;
  overflow-y: auto;

  .person {
    padding-top: 15px;
    padding-bottom: 15px;

    .person-message {
      width: 14px;
      height: 14px;
      margin-left: 10px;
      margin-top: 6px;
    }

    .person-phone {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #bfbfbf;
      margin-top: 7px;
      margin-left: 10px;
      float: left;
    }

    .person-name {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
      float: left;
      padding-right: 10px;
      margin-left: 10px;
      margin-top: 6px;
      border-right: solid #e6e6e6 1px;
      width: 60px;
      text-overflow: ellipsis;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      -moz-text-overflow: ellipsis;
      white-space: nowrap;
    }

    .personImage {
      width: 24px;
      height: 24px;
      //background: #3172db;
      border-radius: 50%;
      float: left;
    }
  }

  .card-right-top {
    border-bottom: solid #f5f7fa 1px;
    border-top: solid #f5f7fa 1px;

    .person-title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #409eff;
      line-height: 50px;
    }
  }
}

.no-content {
  width: 300px;
  height: 260px;
  margin-left: calc((100% - 300px) / 2);
}

.no-content-text {
  width: 100%;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #c0c4cc;
  text-align: center;
  margin-top: 10px;
}

.button-down2 {
  width: 120px;
  margin-left: calc((100% - 120px) / 2);
  margin-top: 15px;
}

@-webkit-keyframes rotate-scale-up {
  0% {
    -webkit-transform: scale(1) translateY(2000px);
    transform: scale(1) translateY(2000px);
  }
  50% {
    -webkit-transform: scale(1) translateY(1000px);
    transform: scale(1) translateY(1000px);
  }
  100% {
    -webkit-transform: scale(1) translateY(0px);
    transform: scale(1) translateY(0px);
  }
}

@keyframes rotate-scale-up {
  0% {
    -webkit-transform: scale(1) translateY(2000px);
    transform: scale(1) translateY(2000px);
  }
  50% {
    -webkit-transform: scale(1) translateY(1000px);
    transform: scale(1) translateY(1000px);
  }
  100% {
    -webkit-transform: scale(1) translateY(0px);
    transform: scale(1) translateY(0px);
  }
}

@-webkit-keyframes rotate {
  0% {
    -webkit-transform: scale(1) translateY(-2000px);
    transform: scale(1) translateY(-2000px);
  }
  50% {
    -webkit-transform: scale(1) translateY(-1000px);
    transform: scale(1) translateY(-1000px);
  }
  100% {
    -webkit-transform: scale(1) translateY(0px);
    transform: scale(1) translateY(0px);
  }
}

@keyframes rotate {
  0% {
    -webkit-transform: scale(1) translateY(-2000px);
    transform: scale(1) translateY(-2000px);
  }
  50% {
    -webkit-transform: scale(1) translateY(-1000px);
    transform: scale(1) translateY(-1000px);
  }
  100% {
    -webkit-transform: scale(1) translateY(0px);
    transform: scale(1) translateY(0px);
  }
}

.card-tree {
  //display: flex;
  //  float: left;
  //  white-space:nowrap;
  //  overflow-x: auto;
}

.card-bottom {
  width: calc(100% - 40px);
  background: #ffffff;
  border-radius: 4px;
  margin-top: 15px;
  overflow: auto;
  padding: 40px;
  height: calc(100vh - 420px);
  box-shadow: 0px 0px 15px 10px #e4e7ed;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  -webkit-animation: rotate-scale-up 0.65s linear both;
  animation: rotate-scale-up 0.65s linear both;
}

.card-top {
  background: #ecf5ff;
  border-radius: 4px;
  width: 100%;
  padding: 20px;
  box-shadow: 0px 0px 15px 10px rgb(#000, 0.01);
  -webkit-animation: rotate 0.65s linear both;
  animation: rotate 0.65s linear both;

  .table {
    // display: -webkit-flex;
    // /* Safari */
    // display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // line-height: 100rpx;
    align-items: center;
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto auto;
    margin-top: 20px;

    .table_box {
      flex-wrap: nowrap;
      font-weight: normal;
      text-align: left;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
      line-height: 40px;
    }

    .table_box2 {
      flex-wrap: nowrap;
      font-weight: normal;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      line-height: 40px;
    }
  }

  .houses {
    float: left;
    width: 50px;
    height: 50px;
  }

  .address {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #0969da;
    float: left;
    line-height: 50px;
    margin-left: 10px;
  }

  .news {
    height: 26px;
    width: 82px;
    background: #ffffff;
    border: 1px solid #e9e9eb;
    border-radius: 4px;
    float: left;
    margin-left: 10px;
    margin-top: 12px;
    text-align: center;

    .news-image {
      width: 12px;
      height: 12px;
      margin: 0 auto;
    }

    .news-title {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      margin-left: 5px;
      line-height: 26px;
    }
  }

  .button-down {
    float: right;
  }
}
</style>
