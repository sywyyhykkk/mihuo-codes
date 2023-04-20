<template>
  <div>
    <div class="el-card-form">
      <div class="el-card-formLeft">
        <el-button
          icon="plus"
          type="text"
          style="margin-top: 2rem; margin-bottom: 2rem"
          @click="nodeAdd(1)"
        >
          新增部门
        </el-button>
        <!--        <div class="add" style="width: 200px; margin-left: 20px">-->
        <!--          <el-input-->
        <!--            v-model="filterText"-->
        <!--            size="mini"-->
        <!--            style="width:100%"-->
        <!--            placeholder="输入关键字进行过滤"-->
        <!--          />-->
        <!--        </div>-->

        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div class="el-card-custom">
                <img
                  src="@/assets/img/24gf-folder.png"
                  style="width: 1.8rem; height: 1.6rem; margin-right: 5px"
                >
                <span :style="data.id === nodeId ? 'color: #0969DA;' : ''">{{
                    node.label
                  }}</span>
              </div>
              <el-dropdown>
                <el-icon
                  v-if="data.id === nodeId"
                  size="10"
                  color="#0969DA"
                  class="tree-node-icon"
                >
                  <more-filled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.stop="nodeAdd(2)">
                      添加子部门
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.stop="nodeEdit"
                    >编辑部门
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.stop="handleDelete"
                    >删除部门
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-tree>
      </div>
      <div class="el-card-formRight">
        <el-card>
          <el-input
            v-model="searchValue" placeholder="员工姓名"
            clearable
            prefix-icon="Search"
            @change="onSearch"
          />
          <!--          <el-button type="primary" @click="onSearch">查询</el-button>-->
          <div class="el-card-right">
            <el-button
              type="primary" icon="plus"
              @click="addForm()"
            >添加
            </el-button>
          </div>
        </el-card>
        <el-table
          v-loading="loading"
          stripe
          :data="tableData"
          :height="tableHeight"
          style="width: 100%"
          border
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="employeeName"
            label="员工姓名"
            width="150"
            sortable
            align="center"
          />
          <el-table-column
            prop="employeePhone"
            label="手机号"
            width="150"
            sortable
            align="center"
          />
          <el-table-column
            prop="employeeTitle"
            label="职称"
            width="150"
            sortable
            align="center"
          />
          <el-table-column
            prop="roleList"
            label="角色"
            sortable
            align="center"
            width="300"
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.adminFlag == 1"
                style="margin-left: 5px; margin-top: 5px"
                type="success"
                size="mini"
                disable-transitions
              >管理员
              </el-tag>
              <span v-for="item in scope.row.roleList" :key="item.roleId">
                <el-tag
                  style="margin-left: 5px; margin-top: 5px"
                  type="primary"
                  size="mini"
                  disable-transitions
                >{{ item.roleName }}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="adminFlag"
            label="状态"
            sortable
            align="center"
          >
            <template #default="scope">
              <el-tag
                style="margin-left: 5px; margin-top: 5px"
                type="primary"
                size="mini"
                disable-transitions
              >{{ scope.row.adminFlag == 0 ? '有效' : '锁定' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="220"
            align="center"
          >
            <template #default="scope">
              <el-button
                size="mini"
                icon="MostlyCloudy"
                type="text"
                style="color: #67c23a"
                @click="authorization(scope.row)"
              >
                授权
              </el-button>
              <el-button
                size="mini"
                icon="edit"
                type="text"
                @click="editForm(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="delete"
                class="danger"
                @click="deletesForm(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination-new
          :current-page="currentPage"
          :page-size="pagesize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog
        v-model="authFormVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="角色授权"
      >
        <el-checkbox-group v-model="authForm" style="margin: 20px 0">
          <el-checkbox
            v-for="(item, index) in roleData"
            :key="index"
            :label="item.roleId"
            :value="item.roleId"
          >
            {{ item.roleName }}
          </el-checkbox>
        </el-checkbox-group>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="submitAuth">确 定</el-button>
            <el-button @click="authFormVisible = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog
        v-if="dialogFormVisible"
        v-model="dialogFormVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :title="addORupdate === 'add' ? '添加员工' : '编辑员工信息'"
      >
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="9rem"
        >
          <el-form-item label="员工姓名" prop="employeeName">
            <el-input
              v-model="form.employeeName"
              autocomplete="off"
              :disabled="addORupdate === 'edit' ? true : false"
            />
          </el-form-item>
          <el-form-item label="所属部门" prop="deptId">
            <el-cascader
              v-model="form.deptId"
              :options="treeData"
              :props="defaultProps"
              placeholder="部门"
              clearable
            />
          </el-form-item>
          <el-form-item label="手机号" prop="employeePhone">
            <el-input v-model="form.employeePhone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="职称" prop="employeeTitle">
            <el-input v-model="form.employeeTitle" />
          </el-form-item>
          <!--          <el-form-item label="角色" prop="roleIds">-->
          <!--            <el-select v-model="form.roleIds" multiple placeholder="请选择角色">-->
          <!--              <el-option-->
          <!--                v-for="(item, index) in roleData"-->
          <!--                :key="index"-->
          <!--                :label="item.roleName"-->
          <!--                :value="item.roleId"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="状态" prop="adminFlag">
            <el-radio-group v-model="form.adminFlag">
              <el-radio label="0">有效</el-radio>
              <el-radio label="9">锁定</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="confirms">确 定</el-button>
            <el-button @click="handleChange">取 消</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :title="dialogTitle"
      >
        <el-form
          ref="ruleForms"
          :model="nodeForm"
          :rules="rules"
          label-width="85px"
        >
          <el-form-item label="上级部门">
            <el-cascader
              v-model="nodeForm.parentId"
              :options="treeData"
              :props="defaultProps"
              placeholder="无上级部门视为根节点"
              clearable
              :disabled="isEdit"
              @change="handleSelectParent"
            />
          </el-form-item>
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="nodeForm.name" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input
              v-model="nodeForm.sort"
              type="number"
              style="width: 19rem"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary" @click="handleNodeConfirm"
            >确 定</el-button>
            <el-button @click="handleNodeChange">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
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
import { sysworkertype } from '_@/api/worker'

export default defineComponent({
  setup() {
    const workertypeList = ref<any>()
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(10)
    const tableHeight = ref<any>(0)
    const tree = ref<any>('')
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData(state.nodeId)
    }

    const state = reactive<any>({
      ruleForms: '' as any,
      isEdit: false,
      dialogVisible: false,
      dialogTitle: '新增部门',
      nodeData: {} as any,
      nodeId: '' as any,
      employeeId: 0,
      nodeForm: {
        children: [],
        companyId: 0,
        createBy: 0,
        createTime: '',
        delFlag: '',
        hasChildren: true,
        id: 0,
        name: '',
        parentId: 0,
        sort: 0,
        updateBy: 0,
        updateTime: ''
      },
      workType: false,
      objList: [],
      searchValue: '',
      tableData: [],
      dialogFormVisible: false,
      authFormVisible: false,
      authForm: [],
      loading: false,
      addORupdate: '',
      form: {
        jobIds: [],
        deptId: '',
        employeeIdcard: '',
        employeeName: '',
        employeePhone: '',
        employeeTitle: '',
        remarks: '',
        roleIds: [],
        adminFlag: '0'
      },
      formLabelWidth: '80px',
      treeData: [],
      roleData: [],
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'id'
      },
      filterText: ''
    })
    const nodeAdd = (row: any) => {
      state.isEdit = false
      state.dialogVisible = true
      state.dialogTitle = '新增部门'
      console.log(state.nodeData)
      state.nodeForm = {
        children: [],
        companyId: 0,
        createBy: 0,
        createTime: '',
        delFlag: '',
        hasChildren: true,
        id: 0,
        name: '',
        parentId: row === 1 ? 0 : state.nodeData.id,
        sort: 0,
        updateBy: 0,
        updateTime: ''
      }
    }
    const handleSelectParent = (val: any) => {
      state.nodeForm.parentId = val[val.length - 1]
    }
    const nodeEdit = () => {
      state.isEdit = true
      state.dialogVisible = true
      state.dialogTitle = '编辑部门'
      console.log(state.nodeData)
      state.nodeForm = state.nodeData
    }
    const handleNodeConfirm = () => {
      state.ruleForms.validate((valid: any) => {
        if (valid) {
          console.log(state.form)
          if (!state.isEdit) {
            nodeAddData()
          }
          if (state.isEdit) {
            // editData()
            nodeEditData()
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }
    const handleNodeChange = () => {
      state.isEdit = false
      state.dialogVisible = false
      state.dialogTitle = '新增部门'
    }
    const handleDelete = () => {
      ElMessageBox.confirm(
        `此操作将永久删除${state.nodeData.name}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteNodeData()
      })
    }
    // 授权
    const authorization = (row: any) => {
      state.authFormVisible = true
      state.employeeId = row.employeeId
      state.authForm = row.roleList.map((item: any) => item.roleId)
    }
    // 授权确定
    const submitAuth = (row: any) => {
      console.log(row)
      state.authFormVisible = false
      fetch({
        url: `/admin/companyemployee/assignPermission/${state.employeeId}`,
        method: 'post',
        data: state.authForm
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('授权成功')
          state.authFormVisible = false
          getData(0)
        }
      })
    }
    const deleteNodeData = async () => {
      await fetch({
        url: `/admin/companydept/${state.nodeData.id}`,
        method: 'delete'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          ElMessageBox.close()
          getTreePage()
        }
      })
    }
    const nodeAddData = async () => {
      await fetch({
        url: '/admin/companydept',
        method: 'post',
        data: state.nodeForm
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('添加成功')
          getTreePage()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const nodeEditData = async () => {
      await fetch({
        url: '/admin/companydept',
        method: 'put',
        data: state.nodeForm
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('编辑成功')
          getTreePage()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const handleSelectChange = (val: any) => {
      var jobId: any = 0
      state.objList.map((res: any) => {
        if (res.jobCode === 'G_003') {
          jobId = res.id
        }
      })
      // console.log(val.indexOf(jobId))
      // state.workType = true
    }
    const handleSelectWork = (val: any) => {
      console.log(val)
      workertypeList.value.map((res: any) => {
        if (val === res.skillId) {
          state.form.skillName = res.skillName
        }
      })
    }

    const handleNodeClick = async (v: any) => {
      console.log('object :>> ', v)
      state.nodeData = v
      state.nodeId = v.id
      getData(v.id)
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
      employeeName: [
        { required: true, message: '请输入员工姓名', trigger: 'change' }
      ],
      employeeIdcard: [
        { required: true, message: '请输入身份证号', trigger: 'change' }
      ],
      roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
      jobIds: [
        { required: true, message: '请选择所属岗位', trigger: 'change' }
      ],
      employeePhone: [
        { required: true, message: '请输入员工手机号', trigger: 'change' }
      ],
      employeeTitle: [
        { required: true, message: '请输入职称', trigger: 'change' }
      ],
      adminFlag: [{ required: true, message: '请选择状态', trigger: 'change' }],
      skillId: [{ required: true, message: '请选择工种', trigger: 'change' }],
      deptId: [
        { required: true, message: '请选择所属部门', trigger: 'change' }
      ],
      parentId: [
        { required: true, message: '请选择所属部门', trigger: 'change' }
      ],
      name: [{ required: true, message: '子部门名称', trigger: 'change' }],
      sort: [{ required: true, message: '排序', trigger: 'change' }]
    })

    const onSearch = () => {
      console.log(state.searchValue)
      getData(0)
    }
    const addForm = () => {
      state.dialogFormVisible = true
      state.addORupdate = 'add'
      state.form = {
        jobIds: [],
        deptId: '',
        employeeIdcard: '',
        employeeName: '',
        employeePhone: '',
        employeeTitle: '',
        remarks: '',
        roleIds: [],
        adminFlag: '0'
      }
    }
    const getWorkerType = async () => {
      const list = await sysworkertype(2)
      workertypeList.value = list.data
    }
    const editForm = (item: any) => {
      state.form = { ...item }
      const roleIds: any = []
      item.roleList.forEach((item2: any) => {
        roleIds.push(item2.roleId)
      })
      state.form.roleIds = roleIds

      state.dialogFormVisible = true
      state.addORupdate = 'edit'
    }
    const confirms = async () => {
      console.log(state.form.deptId)
      state.form.deptId =
        typeof state.form.deptId === 'object' && state.form.deptId
          ? state.form.deptId[state.form.deptId.length - 1]
          : state.form.deptId
      state.ruleForms.validate((valid: any) => {
        if (valid) {
          if (state.addORupdate === 'add') {
            // 新增
            addUser(state.form).then((res: any) => {
              if (res.code == 0) {
                state.dialogFormVisible = false
                ElMessage.success({
                  message: '新增成功',
                  type: 'success'
                })
                state.nodeId=state.form.deptId
                getData(state.form.deptId)
              }
            })
          } else {
            // 修改
            eidtUser(state.form).then((res: any) => {
              if (res.code == 0) {
                state.dialogFormVisible = false
                ElMessage.success({
                  message: '修改成功',
                  type: 'success'
                })
                state.nodeId=state.form.deptId
                getData(state.form.deptId)
              }
            })
          }
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
        deleteUser(e.employeeId).then((res: any) => {
          if (res.data) {
            ElMessage({
              type: 'success',
              message: `删除成功!`
            })
            getData(e.deptId)
          } else {
            ElMessage.error(`删除失败!`)
          }
        })
      })
    }
    // 查询
    const getData = async (e: any) => {
      state.loading = true

      userPage({
        size: pagesize.value,
        current: currentPage.value,
        deptId: e,
        employeeName: state.searchValue
      }).then((res) => {
        if (res) {
          state.tableData = res.data.records
          total.value = res.data.total
          state.loading = false
        }
      })
    }
    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      tableHeight.value = document.documentElement.clientHeight - 190
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    const getTreePage = () => {
      treePage()
        .then((res) => {
          if (res) {
            state.treeData = res.data
          }
        })
        .catch((error) => {
          console.log(error)
          state.loading = false
        })
    }
    onMounted(() => {
      // getWorkerType()
      getTreePage()
      roleListPage().then((res) => {
        if (res) {
          state.roleData = res.data
        }
      })
      getData(0)
      getObjList()
    })
    const getObjList = async () => {
      await fetch({
        url: '/admin/sysjobskill/getJobSkillList',
        method: 'get',
        params: {
          type: 1
        }
      }).then((res: any) => {
        state.objList = res.data
      })
    }
    const filterNode = (value: any, treeData: any) => {
      if (!value) return true
      return treeData.name.indexOf(value) !== -1
    }
    watch(state, (value) => {
      tree.value.filter(state.filterText)
    })

    return {
      total,
      currentPage,
      pagesize,
      workertypeList,
      tableHeight,
      rules,
      tree,
      handleSelectParent,
      submitAuth,
      authorization,
      handleDelete,
      handleNodeConfirm,
      handleNodeChange,
      nodeAdd,
      nodeEdit,
      handleSelectWork,
      handleSelectChange,
      getWorkerType,
      getObjList,
      onSearch,
      confirms,
      handleChange,
      handleNodeClick,
      handleCurrentChange,
      addForm,
      editForm,
      deletesForm,
      phoneValidator,
      filterNode,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
