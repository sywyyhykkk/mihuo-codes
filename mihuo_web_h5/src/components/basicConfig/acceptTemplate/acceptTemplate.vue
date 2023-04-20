<template>
  <div class="el-card-form">
    <div class="el-card-formLeft" :style="{ height: tableHeight + 60 + 'px' }">
      <el-button
        v-if="$getPression('basic_acceptancetemplate_save')"
        icon="plus"
        type="text"
        style="margin: 1rem 0 2rem 1rem"
        class="main-button"
        @click="saveTemplateShow()"
      >新增验收模板
      </el-button>
      <div class="left-data">
        <div
          v-for="(item, index) in templateList"
          :key="index"
          :class="[templateActive === index ? 'template-item-active' : '']"
          class="template-item"
          @click="templateOperation(item, 'select', index)"
        >
          <span class="name">
            <!--            <i v-if="Number(item.enableFlag) === 0" class="el-icon-remove-outline" />-->
            <el-icon
              v-if="Number(item.enableFlag) === 0"
              size="12px"
              color="#F56C6C"
            ><remove /></el-icon>
            {{ item.acceptanceName }}
          </span>

          <div class="operation">
            <!--            <i class="el-icon-edit" @click.stop="templateOperation(item, 'edit')" />-->
            <el-icon
              v-if="$getPression('basic_acceptancetemplate_save')"
              size="12px"
              :color="templateActive === index?'#FFFFFF':'#409EFF'"
              @click.stop="templateOperation(item, 'edit')"
            >
              <edit />
            </el-icon>
            <!--            <i class="el-icon-delete" @click.stop="templateOperation(item, 'delete')" />-->
            <el-icon
              v-if="$getPression('basic_acceptancetemplate_del')"
              size="12px"
              color="#F56C6C"
              @click.stop="templateOperation(item, 'delete')"
            >
              <delete />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="el-card-formRight">
      <el-card>
        <div class="el-card-right">
          <el-button
            v-if="templateList.length > 0"
            size="mini"
            icon="plus"
            type="primary"
            @click="saveGrouping()"
          >
            新增
          </el-button>
        </div>
      </el-card>
      <div class="right-table">
        <el-table
          ref="multipleTable"
          stripe
          :data="tableData"
          row-key="id"
          border
          :height="tableHeight"
          default-expand-all
        >
          <el-table-column
            prop="itemName" label="验收项目"
            align="center"
          />
          <el-table-column
            prop="score" label="分数"
            align="center"
          />
          <el-table-column
            prop="standard" label="标准"
            header-align="center"
          />
          <el-table-column
            label="标准图片" width="80"
            align="center"
          >
            <template #default="scope">
              <el-image
                preview-teleported
                lazy
                style="height: 50px; width: 50px"
                :src="$getUrl.getPicUrl(scope.row.standardImg, true)"
                :preview-src-list="$getUrl.getPicUrl(scope.row.standardImg)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="责任岗位" width="150"
            align="center"
          >
            <template #default="scope">
              <el-tag v-for="item in getSkillData(scope.row.dealJobIds)" style="margin-right: 1rem">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="验收方式" width="150"
            align="center"
          >
            <template #default="scope">
              {{ getMethodData(scope.row.method) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="checkFlag" label="硬性指标"
            align="center"
          >
            <template #default="scope">
              <span
                v-show="Number(scope.row.checkFlag) === 1"
                style="color: #ff5722"
              >是</span>
              <span v-show="Number(scope.row.checkFlag) === 0">否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="150"
            align="center"
          >
            <template #default="scope">
              <el-button
                v-if="$getPression('basic_acceptancetemplate_save')"
                type="text"
                size="mini"
                icon="edit"
                @click="handleNode(scope.row, 'edit')"
              >
                编辑
              </el-button>
              <el-button
                v-if="$getPression('basic_acceptancetemplate_del')"
                class="danger"
                type="text"
                icon="delete"
                @click="handleNode(scope.row, 'delete')"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination-new
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      v-if="addTemplateShow"
      v-model="addTemplateShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="配置模板"
    >
      <div class="c">
        <el-form
          ref="templateFormRef"
          :rules="rules"
          :model="templateForm"
          label-width="9rem"
        >
          <el-form-item label="模板名称" prop="acceptanceName">
            <el-input v-model="templateForm.acceptanceName" />
          </el-form-item>
          <el-form-item label="描述" prop="name">
            <el-input v-model="templateForm.acceptanceDesc" type="textarea" />
          </el-form-item>
          <el-form-item label="启用" prop="enableFlag">
            <el-switch
              v-model="templateForm.enableFlag"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveTemplate">确 定</el-button>
          <el-button @click="addTemplateShow = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-if="addTemplatePhaseShow"
      v-model="addTemplatePhaseShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="配置项目"
    >
      <el-form
        ref="templateFormPhaseRef"
        :rules="rulesPhase"
        :model="templatePhaseForm"
        label-width="9rem"
      >
        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="templatePhaseForm.itemName" type="textarea" />
        </el-form-item>
        <el-form-item label="分组名称" prop="part">
          <el-input v-model="templatePhaseForm.part" />
        </el-form-item>
        <el-form-item label="责任岗位" prop="dealJobIds">
          <el-select
            v-model="templatePhaseForm.dealJobIds"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in executeJobList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标准" prop="standard">
          <el-input v-model="templatePhaseForm.standard" type="textarea" />
        </el-form-item>
        <el-form-item label="验收方式" prop="method">
          <el-select
            v-model="templatePhaseForm.method"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in methodList"
              :key="item.id"
              :label="item.label"
              :value="item.id.toString()"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标准图片" prop="standardImg">
          <uploadImage
            v-model="templatePhaseForm.standardImg"
            :max-count="9"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item label="硬性指标" prop="checkFlag">
          <el-switch
            v-model="templatePhaseForm.checkFlag"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input
            v-model="templatePhaseForm.score"
            type="number"
            style="width: 19rem"
          >
            <template #append>分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="templatePhaseForm.sort"
            type="number"
            style="width: 19rem"
          >
            <template #append>#</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveTemplatePhase">确 定</el-button>
          <el-button @click="addTemplatePhaseShow = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  watch,
  watchEffect
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import {
  getListByCode,
  acceptanceTemplateGetTemplates,
  acceptanceTemplateSave,
  acceptanceTemplateDelete,
  acceptanceTemplateGetTemplateItemById,
  acceptanceTemplateSaveItem,
  acceptanceTemplateDeleteItem,
  acceptanceTemplateGetTemplate,
  sysjobsList
} from '_@/api/basicConfig'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  components: { uploadFile },
  setup() {
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
    const executeJobList = ref<any>([])
    const jobLabel = ref<any>('被派单岗位')
    const dealJobIdsTempList = ref<any>([])
    const uploadFileList = ref<any>([{ name: '文件' }])
    const templateActive = ref<any>(0)
    const uploadTypeList = ref<any>([
      { label: '文件', value: 1 },
      { label: '定位', value: 2 },
      { label: '文本', value: 3 }
    ])
    const businessTypeList = ref<any>([
      { label: '选材', value: 1001 },
      { label: '派单', value: 1002 },
      { label: '预算', value: 1003 },
      { label: '施工', value: 1004 },
      { label: '上传', value: 1006 },
      { label: '验收', value: 1005 },
      { label: '评价', value: 1009 },
      { label: '交底', value: 1010 }
    ])

    const state = reactive<any>({
      tableData: [],
      form: {},
      currentPage: 1,
      total: 0,
      pageSize: 10,
      loading: true,
      templateList: [],
      templateIsEdit: false,
      templateId: 0,
      orderServicePackList: [],
      methodList: [],
      skillTypeList: [],
      templateForm: {
        enableFlag: 1,
        acceptanceDesc: '',
        acceptanceName: ''
      },
      templatePhaseForm: {
        itemName: '',
        score: '',
        sort: 1,
        standard: '',
        standardImg: '',
        checkFlag: 1,
        dealJobIds: '',
        part: ''
      }
    })
    const rules = reactive({
      acceptanceName: [
        { required: true, message: '请输入模板名称', trigger: 'blur' }
      ]
    })
    const rulesPhase = reactive({
      itemName: [
        { required: true, message: '请输入项目名称', trigger: 'blur' }
      ],
      part: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
      standard: [{ required: true, message: '请输入标准', trigger: 'blur' }],
      sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
      score: [{ required: true, message: '请输分数', trigger: 'blur' }],
      dealJobIds: [
        { required: true, message: '请选择责任岗位', trigger: 'blur' }
      ]
    })

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getProjectGetChildList()
    }
    // 解析岗位
    const getSkillData = (val: any) => {
      const skillName: any = []
      executeJobList.value.forEach((item: any) => {
        val.split(',').forEach((res: any) => {
          if (res == item.skillId) {
            skillName.push(item.skillName)
            return
          }
        })
      })
      return skillName
    }
    // 查询验收方式列表
    const getmethod = async () => {
      await fetch({ url: `/admin/dict/type?type=acceptance_method`, method: 'get' }).then((res: any) => {
        state.methodList = res.data
      })
    }

    onMounted(() => {
      getmethod()
      getTemplateDateInitial()
      // getSkillType()
      getSysjobsList() // 查询岗位、工种
    })

    const getMethodData = (data: any) => {
      if (data) {
        const list = JSON.parse(JSON.stringify(data))
        const val: any = []
        list.split(',').forEach((res: any) => {
          state.methodList.forEach((res2: any) => {
            if (res2.id == res) {
              val.push(res2.label)
            }
          })
        })
        return val.toString()
      } else {
        return ''
      }
    }

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 190
    }

    watchEffect(() => {
      getHeight()
      window.addEventListener('resize', getHeight, false)
    })

    const saveTemplateShow = () => {
      (state.templateForm.enableFlag = 1),
      (state.templateForm.acceptanceDesc = ''),
      (state.templateForm.acceptanceName = ''),
      (addTemplateShow.value = true)
      state.templateIsEdit = false
    }

    const getSysjobsList = () => {
      sysjobsList({}).then((res) => {
        executeJobList.value = res.data
      })
    }

    const getTemplateDateInitial = () => {
      // 页面初始化时调用
      acceptanceTemplateGetTemplates({
        size: 999,
        current: 1
      }).then((res) => {
        if (res.data) {
          state.templateList = res.data.records
          state.templateId =
            res.data.records.length > 0 && res.data.records[0].id
          res.data.records.length > 0 && getProjectGetChildList()
        }
      })
    }

    const getProjectGetChildList = () => {
      acceptanceTemplateGetTemplate({
        templateId: state.templateId,
        size: state.pageSize,
        current: state.currentPage
      }).then((res) => {
        if (res.data) {
          state.tableData = res.data.records
          state.total = res.data.total
        }
      })
    }

    const getTemplateDate = () => {
      acceptanceTemplateGetTemplates({
        size: 999,
        current: 1
      }).then((res) => {
        if (res) {
          state.templateList = res.data.records
          if (res.data.records.length === 1) {
            state.templateId = res.data.records[0].id
          }
          res.data.records.length > 0 && getProjectGetChildList()
        }
      })
    }

    const saveTemplate = (typeName: any) => {
      const forms = unref(templateFormRef)
      forms.validate((valid: boolean) => {
        if (valid) {
          acceptanceTemplateSave(state.templateForm).then((res) => {
            if (res.data) {
              ElMessage({
                type: 'success',
                message:
                  state.templateIsEdit === true
                    ? `修改模板成功!`
                    : `新增模板成功!`
              })
              addTemplateShow.value = false
              getTemplateDate()
              removeTempLate()
            }
          })
        }
      })
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
          state.templateForm = JSON.parse(JSON.stringify(e))
          state.templateForm.enableFlag = Number(e.enableFlag)
          // smethod

          state.templateIsEdit = true
          addTemplateShow.value = true
          break
        case 'delete':
          ElMessageBox.confirm(
            `此操作将永久删除${e.acceptanceName}模板, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            acceptanceTemplateDelete({ id: e.id }).then((res) => {
              if (res.data) {
                ElMessage({
                  type: 'success',
                  message: `删除成功!`
                })
                getTemplateDate()
                removeTempLate()
              }
            })
          })
          break
      }
    }

    const saveGrouping = () => {
      resetTemplatePhaseChildForm()
      addTemplatePhaseShow.value = true
      phaseIsEdit.value = false
    }

    const saveTemplatePhase = () => {
      const forms = unref(templateFormPhaseRef)
      forms.validate((valid: boolean) => {
        if (valid) {
          state.templatePhaseForm.dealJobIds =
            state.templatePhaseForm.dealJobIds.join(',')
          state.templatePhaseForm.method = state.templatePhaseForm.method.toString()

          acceptanceTemplateSaveItem({
            ...state.templatePhaseForm,
            templateId: state.templateId
          }).then((res) => {
            if (res.data) {
              ElMessage({
                type: 'success',
                message: phaseIsEdit.value === true ? `修改成功` : `新增成功!`
              })
              addTemplatePhaseShow.value = false
              getTemplateDate()
              resetTemplatePhaseChildForm()
            }
          })
        }
      })
    }

    const handleNode = (e: any, typeName: any) => {
      switch (typeName) {
        case 'edit':
          state.templatePhaseForm = JSON.parse(JSON.stringify(e))
          state.templatePhaseForm.checkFlag = Number(e.checkFlag)
          state.templatePhaseForm.dealJobIds = state.templatePhaseForm.dealJobIds.split(',')
          state.templatePhaseForm.method = state.templatePhaseForm.method?.split(',')
          addTemplatePhaseShow.value = true
          phaseIsEdit.value = true
          break
        case 'delete':
          ElMessageBox.confirm(
            `此操作将永久删除${e.itemName}验收项, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            acceptanceTemplateDeleteItem({ templateItemId: e.id }).then(
              (res) => {
                if (res.data) {
                  ElMessage({
                    type: 'success',
                    message: `删除成功!`
                  })
                  getTemplateDate()
                }
              }
            )
          })
          break
      }
    }

    const resetTemplatePhaseChildForm = () => {
      for (var key in state.templatePhaseForm) {
        state.templatePhaseForm[key] = ''
        state.templatePhaseForm.checkFlag = 1
      }
    }

    const getSkillType = async () => {
      await fetch({
        url: '/admin/sysjobskill/getJobSkillList',
        method: 'get',
        params: {
          type: 2
        }
      }).then((res: any) => {
        state.skillTypeList = res.data
      })
    }

    return {
      addTemplateShow,
      isEdit,
      templateFormRef,
      templateFormPhaseRef,
      rules,
      tableHeight,
      templateActive,
      addTemplatePhaseShow,
      rulesPhase,
      templateFormPhaseChildRef,
      addTemplatePhaseChildShow,
      businessTypeList,
      phaseIsEdit,
      nodeIsEdit,
      uploadTypeList,
      uploadFileList,
      listByCodeList,
      preNodeIdList,
      preNodeIdListShow,
      multipleTable,
      listByCodeSelectList,
      skillStatus,
      jobLabel,
      executeJobList,
      dealJobIdsTempList,
      getMethodData,
      getSkillData,
      getSysjobsList,
      handleCurrentChange,
      getSkillType,
      saveTemplateShow,
      saveGrouping,
      resetTemplatePhaseChildForm,
      saveTemplatePhase,
      getTemplateDate,
      saveTemplate,
      templateOperation,
      removeTempLate,
      getProjectGetChildList,
      handleNode,
      getTemplateDateInitial,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
.left-header {
  padding: 10px;
  background-color: #ffffff;
}

p {
  cursor: pointer;
  margin-bottom: 18px;
  color: @mainColor;
  font-size: 14px;

  i {
    margin-right: 5px;
  }
}

.projectTemplate-contain {
  display: flex;

  .left-contain {
    width: 20%;
    min-width: 206px;
    background-color: #ffff;
    padding: 10px 0px;
    border-right: 1px solid #f0f1f2;
    position: relative;
    overflow: hidden;
  }

  .right-contain {
    width: 80%;
    padding: 20px 20px 0px 20px;
    background-color: #ffff;

    .right-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .right-table {
    }
  }
}

.uploadFile-item {
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0px;
  }
}

.uploadFile-operation {
  margin-left: 10px;

  i {
    cursor: pointer;
  }
}

.el-radio-item {
  margin-bottom: 5px;
}

.node-name {
  font-size: 12px;
  color: #f2aa3d;
  cursor: pointer;
}

/deep/ .el-radio__input {
  margin-bottom: 4px;
}

.order-send-job {
  display: flex;
  align-items: center;
  justify-content: center;
}

.business-type-contain {
  width: 90%;

  .el-radio {
    margin-right: 50px;
    /*margin-bottom: 10px;*/
  }
}
</style>
