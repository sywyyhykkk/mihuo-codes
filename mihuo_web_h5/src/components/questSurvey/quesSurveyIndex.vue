<template>
  <div>
    <div class="el-card-form" v-show="!settingSurveyShow">
      <div
        class="el-card-formLeft"
        :style="{ height: tableHeight + 60 + 'px' }"
      >
        <el-button
          icon="plus"
          @click="handelChangeItem('新增分类', {})"
          type="text"
          style="margin: 1rem 0 2rem 1rem"
          class="main-button"
          >新增分类
        </el-button>
        <div class="left-data">
          <div
            v-for="(item, index) in state.surveyTypeList"
            :key="index"
            :class="[state.current === index ? 'template-item-active' : '']"
            class="template-item"
            @click="handelChangeItem('选择分类', item, index)"
          >
            <div class="left-data_item">
              <span class="name">
                <el-icon
                  v-if="Number(item.enableFlag) === 0"
                  size="12px"
                  color="#F56C6C"
                  ><remove
                /></el-icon>
                {{ item.typeName }}
              </span>
              <div class="operation" v-if="index != 0">
                <el-icon
                  @click.stop="handelChangeItem('编辑分类', item)"
                  size="12px"
                  :color="state.current === index ? '#FFFFFF' : '#409EFF'"
                >
                  <edit />
                </el-icon>
                <el-icon
                  @click.stop="handelChangeItem('删除分类', item)"
                  size="12px"
                  color="#F56C6C"
                >
                  <delete />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="el-card-formRight">
        <el-card>
          <el-input
            prefix-icon="Search"
            @change="getTemplateData"
            v-model="searchData.templateName"
            placeholder="问卷名称"
            clearable
          />
          <div class="el-card-right">
            <el-button
              size="mini"
              icon="plus"
              type="primary"
              @click="handelChangeItem('新增问卷')"
            >
              新增问卷
            </el-button>
          </div>
        </el-card>
        <div>
          <el-table
            stripe
            ref="multipleTable"
            :data="state.tableData"
            border
            :height="'calc(100vh - 25rem)'"
            default-expand-all
          >
            <el-table-column
              prop="surveyName"
              label="问卷名称"
              align="center"
              header-align="center"
              width="200"
            />
            <el-table-column
              prop="relationNodes"
              label="已关联节点"
              align="center"
              header-align="center"
              width="300"
            >
              <template #default="scope">
                <div style="display: flex; flex-wrap: wrap">
                  <div
                    v-if="scope.row.relationNodes"
                    v-for="item in scope.row.relationNodes.split(',')"
                    style="margin-bottom: 5px; margin-right: 5px"
                    :key="item"
                  >
                    <el-tag>{{ item }}</el-tag>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="enableFlag"
              label="是否启用"
              width="200"
              align="center"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.enableFlag"
                  active-value="1"
                  inactive-value="0"
                  @change="changeSwitch(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="surveyDesc"
              label="备注"
              header-align="center"
              align="left"
            />
            <el-table-column
              label="操作"
              fixed="right"
              width="300"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-show="!scope.row.businessType"
                  type="text"
                  icon="View"
                  style="color: #f2aa3d"
                  @click="handelChangeItem('预览问卷', scope.row)"
                  >预览
                </el-button>
                <el-button
                  v-show="!scope.row.businessType"
                  type="text"
                  icon="setting"
                  style="color: #67c23a"
                  @click="handelChangeItem('配置问卷', scope.row)"
                  >配置
                </el-button>
                <el-button
                  icon="edit"
                  type="text"
                  @click="handelChangeItem('编辑问卷', scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  icon="delete"
                  class="danger"
                  @click="handelChangeItem('删除模板', scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination-new
            :current-page="state.currentPage"
            :page-size="state.pageSize"
            :total="state.total"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!--    新增和编辑分类-->
    <settingSurveyClassify
      v-model="surveyClassifyShow"
      :isEdit="surveyClassifyIsEdit"
      :data="state.surveyClassifyForm"
      @getData="getSurveyTypeList"
    />
    <!--    新增和编辑问卷模板-->
    <settingTemplateData
      v-model="templateShow"
      :isEdit="templateIsEdit"
      :data="state.templateForm"
      @getData="getTemplateData"
    />
    <!--    预览问卷信息-->
    <surveyPreview
      v-model="surveyPreviewShow"
      :surveyId="state.templateForm.id"
    />
    <!--配置问卷-->
    <settingSurvey
      v-show="settingSurveyShow"
      :surveyId="state.templateForm.id"
      v-model="settingSurveyShow"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import {
  surveyTemplateDelete,
  surveyTemplatePage,
  surveyTemplateUpdate
} from '_@/api/basicConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import { useRouter } from 'vue-router'
import LockManager from '@/utils/Lock'

//问卷分类
const surveyClassifyShow = ref<boolean>(false) //是否显示弹出层
const surveyClassifyIsEdit = ref<boolean>(false) //是否编辑

//问卷模板
const templateShow = ref<boolean>(false) //是否显示弹出层
const templateIsEdit = ref<boolean>(false) //是否编辑
const route = useRouter()
//预览问卷
const surveyPreviewShow = ref<boolean>(false)

//配置问卷
const settingSurveyShow = ref<boolean>(false)

const state = reactive<any>({
  currentPage: 1,
  pageSize: 10,
  total: 1,
  current: 0,
  surveyTypeList: [],
  tableData: [],
  surveyClassifyForm: {} as any, //问卷分类form
  templateForm: {} as any //模板form
})
const searchData = reactive<any>({
  surveyTypeId: '',
  templateName: ''
})

const handelChangeItem = (val: any, row: any, index: number) => {
  switch (val) {
    case '选择分类':
      searchData.surveyTypeId = row.id
      state.current = index
      getTemplateData()
      break
    case '新增分类':
      surveyClassifyIsEdit.value = false
      surveyClassifyShow.value = true
      state.surveyClassifyForm = {}
      break
    case '编辑分类':
      surveyClassifyIsEdit.value = true
      surveyClassifyShow.value = true
      state.surveyClassifyForm = JSON.parse(JSON.stringify(row))
      break
    case '删除分类':
      state.surveyClassifyForm = JSON.parse(JSON.stringify(row))
      ElMessageBox.confirm(
        `此操作将永久删除${state.surveyClassifyForm.typeName}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteSurveyType(state.surveyClassifyForm.id)
      })
      break
    case '新增问卷':
      templateIsEdit.value = false
      templateShow.value = true
      state.templateForm = {}
      break
    case '编辑问卷':
      templateIsEdit.value = true
      templateShow.value = true
      state.templateForm = JSON.parse(JSON.stringify(row))
      break
    case '删除模板':
      templateDelete(row)
      break
    case '预览问卷':
      state.templateForm = JSON.parse(JSON.stringify(row))
      surveyPreviewShow.value = true
      break
    case '配置问卷':
      state.templateForm = JSON.parse(JSON.stringify(row))
      console.log(route.currentRoute.value.fullPath)
      LockManager.getLock(
        {
          name: 'question' + state.templateForm.id,
          path: route.currentRoute.value.fullPath,
          interval: setInterval(() => {
            LockManager.addLock({
              name: 'question' + state.templateForm.id,
              path: route.currentRoute.value.fullPath,
              interval: ''
            })
          }, 300000)
        },
        () => {
          settingSurveyShow.value = true
        }
      )
      break
  }
}

////启用模板,关闭模板
const changeSwitch = (row: any) => {
  console.log(row)
  surveyTemplateUpdate(row).then((res: any) => {
    if (res.code == 0) {
      ElMessage({
        type: 'success',
        message: `${row.enableFlag == '1' ? '启用' : '关闭'}问卷模板成功!`
      })
    }
    getTemplateData()
  })
}

//删除模板
const templateDelete = (item: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除${item.surveyName}模板, 是否继续?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    surveyTemplateDelete({ id: item.id }).then((res: any) => {
      if (res.code == '0') {
        ElMessage({
          type: 'success',
          message: `删除成功!`
        })

        getTemplateData()
      }
    })
  })
}

//分页事件
const handleCurrentChange = (val: number) => {
  state.currentPage = val
  getTemplateData()
}

//删除分类
const deleteSurveyType = async (id: any) => {
  await fetch({
    url: `/basic/surveytype/delete/${id}`,
    method: 'post'
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('删除成功')
      getSurveyTypeList()
    }
  })
}
//查询全部分类
const getSurveyTypeList = async () => {
  await fetch({
    url: '/basic/surveytype/list',
    method: 'get'
  }).then((res: any) => {
    state.surveyTypeList = [
      {
        enableFlag: '1',
        id: '',
        typeDesc: '全部',
        typeName: '全部'
      },
      ...res.data
    ]
  })
}
//查询问卷模板
const getTemplateData = () => {
  surveyTemplatePage({
    size: state.pageSize,
    current: state.currentPage,

    ...searchData
  }).then((res: any) => {
    if (res.data) {
      state.tableData = res.data.records
      state.total = res.data.total
    }
  })
}
onMounted(() => {
  getSurveyTypeList()
  getTemplateData()
})
</script>

<style lang="less" scoped>
.left-data {
  height: calc(100vh - 25rem) !important;
  box-sizing: border-box;
  width: calc(100% - 2rem);
  .left-data_item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .operation {
      flex-shrink: 0;
    }
  }
}
</style>
