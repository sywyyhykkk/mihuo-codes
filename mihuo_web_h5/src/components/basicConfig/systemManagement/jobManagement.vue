<template>
  <div>
    <el-card>
      <el-input
        v-model="searchData.skillName"
        placeholder="岗位名称"
        clearable
        prefix-icon="Search"
        @change="onSearch"
      />
      <!--      <el-button-->
      <!--        type="primary" icon="Search"-->
      <!--        @click="onSearch"-->
      <!--      >查询</el-button>-->
      <div class="el-card-right">
        <el-button
          v-if="$getPression('job_add') && protType === 1"
          type="primary"
          icon="plus"
          @click="addForm()"
        >添加
        </el-button>
      </div>
    </el-card>
    <div>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :height="'calc(100vh - 22rem)'"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="50"
          align="center"
          label="序号"
        />
        <el-table-column
          prop="skillName"
          label="岗位名称(工种)"
          align="center"
        />
        <el-table-column
          prop="jobCode"
          label="岗位标识"
          align="center"
        />
        <el-table-column
          prop="type"
          label="类型"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.type == 1 ? '岗位' : scope.row.type == 2 ? '工种' : '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="label"
          label="评价标签"
          align="center"
        />
        <el-table-column
          prop="remarks"
          label="备注描述"
          align="center"
        />
        <el-table-column
          prop="acceptanceTemplateName"
          label="验收模板"
          align="center"
          width="150"
        />
        <el-table-column
          prop="sort"
          label="排序"
          align="center"
        />
        <el-table-column label="数据来源" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.clientType === 'platform'" size="mini">
              平台
            </el-tag>
            <el-tag v-else size="mini"> 企业端</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="240"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-if="$getPression('job_service_config') && protType === 3"
              type="text"
              icon="setting"
              style="color: #67C23A"
              @click="configStage(scope.row)"
            >配置服务阶段
            </el-button>
            <el-button
              v-if="$getPression('job_service_config') && protType === 3"
              type="text"
              icon="setting"
              style="color: #67C23A"
              @click="configService(scope.row)"
            >配置服务项目
            </el-button>
            <el-button
              v-if="protType !== 3"
              type="text"
              icon="setting"
              style="color: #67C23A"
              @click="settingForm(scope.row)"
            >配置
            </el-button>
            <el-button
              v-if="protType !== 3"
              type="text"
              icon="edit"
              :disabled="scope.row.clientType === 'platform' && protType === 2 "
              @click="editForm(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="protType !== 3"
              type="text"
              :disabled="scope.row.clientType === 'platform' && protType === 2"
              class="danger"
              icon="delete"
              @click="deletesForm(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChangee"
      />
    </div>
    <el-dialog
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEdit ? '编辑岗位' : '添加岗位'"
      width="56rem"
    >
      <el-form
        ref="ruleForms"
        :model="form"
        label-width="12rem"
        :rules="rules"
      >
        <el-form-item label="选择类型">
          <el-select
            v-model="form.type"
            filterable
            allow-create
            placeholder="选择类型"
            @change="selectChange"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位名称" prop="skillName">
          <el-input v-model="form.skillName" placeholder="" />
        </el-form-item>
        <el-form-item label="岗位标识" prop="jobCode">
          <el-input
            v-model="form.jobCode"
            :disabled="isEdit || selectType == 'JOB_WORKER' ? true : false"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="评价标签" prop="label">
          <el-select
            v-model="form.label"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择可选评价标签"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注描述" prop="remarks">
          <el-input v-model="form.remarks" placeholder="" />
        </el-form-item>
        <el-form-item label="排序" prop="employeePhone">
          <el-input
            v-model="form.sort"
            type="number"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="验收模板" prop="acceptanceTemplateId">
          <el-select
            v-model="form.acceptanceTemplateId"
            filterable
            placeholder="请选择验收模板"
            @change="selectChange"
          >
            <el-option
              v-for="item in acceptList"
              :key="item.id"
              :label="item.acceptanceName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="验收标准描述" prop="">
          <appTextEdit v-model="form.acceptanceDesc" />
        </el-form-item>
        <el-form-item
          v-if="protType=='1'"
          label="岗位描述"
          prop="description"
        >
          <appTextEdit v-model="form.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirms">确 定</el-button>
          <el-button @click="handleChange">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <job-service-item
      v-if="isShowConfigServiceItem"
      v-model="isShowConfigServiceItem"
      :skill-id="currentRow.skillId"
      :skill-name="currentRow.skillName"
    />
    <job-service-stage
      v-if="isShowConfigStage"
      v-model="isShowConfigStage"
      :skill-id="currentRow.skillId"
      :skill-name="currentRow.skillName"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  watchEffect,
  watch
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isPhone } from '@/utils/validate'
import {
  roleListPage,
  treePage,
  userPage,
  addUser,
  eidtUser,
  deleteUser
} from '_@/api/department'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'
import { useRouter } from 'vue-router'
import JobServiceItem from '_c/basicConfig/systemManagement/jobServiceItem.vue'

export default defineComponent({
  components: { JobServiceItem },
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    }
  },
  setup(props) {
    const { push, addRoute, currentRoute, beforeEach } = useRouter()
    const workertypeList = ref<any>()
    const tableHeight = ref<any>(0)

    const state = reactive<any>({
      selectType: 'JOB_OTHER',
      options: [],
      ruleForms: '' as any,
      isEdit: false,
      searchValue: '',
      tableData: [],
      dialogFormVisible: false,
      loading: false,
      acceptList: [],
      addORupdate: '',
      form: {
        skillName: '',
        jobCode: '',
        sort: null,
        label: [] as any,
        type: 1,
        description: '[]',
        acceptanceTemplateId: '',
        acceptanceDesc: '[]',
        remarks: ''
      },
      formLabelWidth: '120px',
      treeData: [],
      roleData: [],
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'id'
      },
      searchData: {
        skillName: ''
      },
      optionsType: [
        { label: '岗位', value: 1 },
        { label: '工种', value: 2 }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isShowConfigServiceItem: false,
      isShowConfigStage: '',
      currentRow: ''
    })

    // 配置服务项目(运营端)
    const configService = (row: any) => {
      state.currentRow = row
      state.isShowConfigServiceItem = true
    }

    // 配置服务阶段(运营端)
    const configStage = (row: any) => {
      state.currentRow = row
      state.isShowConfigStage = true
    }

    // 配置
    const settingForm = (val: any) => {
      sessionStorage.setItem('skillId', val.skillId)
      push({ path: '/job/jobSetting' })
    }

    const phoneValidator = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!isPhone(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    const rules = reactive({
      skillName: [{ required: true, message: '请输入岗位名称', trigger: 'change' }],
      label: [{ required: true, message: '请输入评价标签' }],
      jobCode: [{ required: true, message: '请输入岗位标识', trigger: 'change' }]
      // acceptanceTemplateId: [{ required: true, message: '请选择验收模板', trigger: 'change' }]
    })

    const onSearch = () => {
      getData()
    }
    const selectChange = (val: any) => {
      if (val === 2) {
        state.form.jobCode = 'JOB_WORKER'
      } else {
        state.form.jobCode = state.isEdit ? state.form.jobCode : ''
      }
    }
    const addForm = () => {
      state.selectType = 'JOB_OTHER'
      state.dialogFormVisible = true
      state.isEdit = false
      state.form = {
        skillName: '',
        jobCode: '',
        sort: null,
        label: [] as any,
        type: 1,
        description: '[]',
        acceptanceTemplateId: '',
        acceptanceDesc: '[]'
      }
    }

    const editForm = (item: any) => {
      state.dialogFormVisible = true
      state.isEdit = true
      state.form = { ...item }
      state.form.description = state.form.description ? state.form.description : '[]'
      state.form.acceptanceDesc = state.form.acceptanceDesc ? state.form.acceptanceDesc : '[]'
      state.form.acceptanceTemplateId = state.form.acceptanceTemplateId ? state.form.acceptanceTemplateId : ''
      state.form.label = state.form.label.split(',')
    }

    const confirms = () => {
      state.ruleForms.validate((valid: any) => {
        state.form.label = state.form.label.toString()
        if (valid) {
          if (!state.isEdit) {
            // 新增
            addData()
          } else {
            // 修改
            editData()
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }
    const handleChange = () => {
      state.dialogFormVisible = false
      // getData()
    }
    const deletesForm = (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(e.skillId)
      })
    }

    // 查询
    const getData = async () => {
      await fetch({
        url: '/admin/sysjobskill/page',
        method: 'get',
        params: {
          size: state.pageSize,
          current: state.currentPage,
          ...state.searchData
        }
      }).then((res) => {
        state.total = res.data.total
        state.tableData = res.data.records
      })
    }

    const addData = async () => {
      await fetch({
        url: '/admin/sysjobskill/create',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.code == '0') {
          state.dialogFormVisible = false
          ElMessage.success('添加成功')
          getData()
        }
      })
    }
    const editData = async () => {
      await fetch({
        url: '/admin/sysjobskill/update',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.code == '0') {
          state.dialogFormVisible = false
          ElMessage.success('编辑成功')
          getData()
        }
      })
    }
    const deleteData = async (skillId: any) => {
      await fetch({
        url: `/admin/sysjobskill/delete/${skillId}`,
        method: 'post'
      }).then((res: any) => {
        if (res.code == '0') {
          state.dialogFormVisible = false
          ElMessage.success('删除成功')
          getData()
        }
      })
    }

    const handleCurrentChangee = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getAcceptData = async () => {
      await fetch({
        url: '/basic/acceptance_template/getTemplates',
        method: 'get',
        params: {
          size: 999,
          enableFlag: 1// 是否启用
        }
      }).then((res: any) => {
        state.acceptList = res.data.records
      })
    }

    onMounted(() => {
      getData()
      getAcceptData()
    })

    return {
      workertypeList,
      tableHeight,
      rules,
      settingForm,
      selectChange,
      handleCurrentChangee,
      addData,
      editData,
      deleteData,
      onSearch,
      confirms,
      handleChange,
      addForm,
      editForm,
      deletesForm,
      phoneValidator,
      configService,
      configStage,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.topTitle {
  line-height: 50px;
  background-color: white;
  border-radius: 5px;
  padding-left: 15px;

  .searchInput {
    width: 300px;
    margin-left: 10px;
  }

  .searchButton {
    margin-left: 10px;
  }
}

.tableList {
  margin-top: 10px;
  height: auto;
  width: calc(100% - 300px);
}

//.wrap {
//  position: fixed;
//  bottom: 15px;
//  //padding-right: 20px;
//  width: 83%;
//  .bottomPaging {
//    line-height: 50px;
//    background-color: white;
//    //bottom: 15px;
//    bottom: 0;
//    padding-left: 10px;
//    width: 100%;
//  }
//}
</style>
