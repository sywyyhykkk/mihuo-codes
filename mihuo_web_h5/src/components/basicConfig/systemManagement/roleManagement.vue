<template>
  <div>
    <el-card>
      <el-input
        v-model="searchValue"
        placeholder="角色名称"
        clearable
        prefix-icon="Search"
        @change="onSearch"
      />
      <!--      <el-button-->
      <!--        type="primary" icon="Search"-->
      <!--        @click="onSearch"-->
      <!--      >查询-->
      <!--      </el-button>-->
      <div class="el-card-right">
        <el-button
          v-if="$getPression('sys_role_add')"
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
        :height="tableHeight"
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
          prop="roleName"
          label="角色名称"
          sortable
          align="center"
        />
        <el-table-column
          prop="roleCode"
          label="角色标识"
          sortable
          align="center"
        />
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          sortable
          align="center"
        />
        <el-table-column
          prop="dsType"
          label="数据权限"
          sortable
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.dsType === 0">全部</span>
            <span v-if="scope.row.dsType === 1">自定义</span>
            <span v-if="scope.row.dsType === 2">本级及子级</span>
            <span v-if="scope.row.dsType === 3">本级</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable
          align="center"
        />
        <el-table-column
          label="操作"
          fixed="right"
          width="250"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-if="$getPression('sys_role_perm')"
              type="text"
              icon="plus"
              style="color: #67C23A"
              @click="addUserRoles(scope.row)"
            >
              权限
            </el-button>
            <el-button
              v-if="$getPression('sys_role_edit')"
              type="text"
              size="mini"
              icon="edit"
              @click="editForm(scope.row)"
            >
              编辑
            </el-button>

            <el-button
              v-if="$getPression('sys_role_del')"
              type="text"
              class="danger"
              icon="delete"
              @click="deletesForm(scope.row)"
            >删除
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
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="addORupdate === 'add' ? '添加角色' : '编辑角色'"
    >
      <el-form
        :model="form"
        size="mini"
        :rules="rules"
        label-width="9rem"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleCode">
          <el-input v-model="form.roleCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.roleDesc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数据权限" prop="dsType">
          <el-select v-model="form.dsType" placeholder="请选择数据权限">
            <el-option
              v-for="item in dsTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
      v-model="dialogTree"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="分配权限"
    >
      <div style="height: 65vh; overflow-y: auto">
        <el-tree
          ref="tree"
          :data="treeData"
          :default-checked-keys="selectCheck"
          :check-strictly="false"
          :props="defaultProps"
          show-checkbox
          class="filter-tree"
          node-key="id"
          highlight-current
          default-expand-all
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handConfirms">确 定</el-button>
          <el-button @click="handleChange">取 消</el-button>
        </span>
      </template>
    </el-dialog>
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
  unref
} from 'vue'
import { addRole, rolePage, addUpdate, deleteRole } from '_@/api/role'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isPhone } from '@/utils/validate'
import wsCache from '@/cache'
import {
  getcompanyPermissions,
  addUserPermissions,
  getUserPermissions
} from '_@/api/department'
import { ElTree } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  setup() {
    const workertypeList = ref<any>()
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(10)
    const tableHeight = ref<any>(0)
    const companys = ref<any>(wsCache.get('companys'))
    const tree = ref<any>(null)
    const loadingData = ref<boolean>(true)
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const state = reactive<any>({
      searchValue: '',
      tableData: [],
      dialogFormVisible: false,
      loading: false,
      addORupdate: '',
      form: {
        clientId: '',
        companyId: '',
        createTime: '',
        delFlag: '',
        dsScope: '',
        dsType: 0,
        roleCode: '',
        roleDesc: '',
        roleId: 0,
        roleName: '',
        updateTime: ''
      },
      formLabelWidth: '80px',
      dsTypeList: [
        { value: 0, label: '全部' },
        { value: 1, label: '自定义' },
        { value: 2, label: '本级及子级' },
        { value: 2, label: '本级' }
      ],
      treeData: [],
      dialogTree: false,
      selectCheck: []
    })
    const defaultProps = reactive({
      children: 'children',
      label: 'name'
    })

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
      // dsType: [
      //   { required: true, message: '请选择数据权限', trigger: 'change' }
      // ],
      roleName: [
        { required: true, message: '请输入角色名称', trigger: 'change' }
      ],
      roleCode: [
        { required: true, message: '请输入角色标识', trigger: 'change' }
      ]
    })

    const onSearch = () => {
      getData()
    }
    const addForm = () => {
      state.addORupdate = 'add'
      state.form.roleName = ''
      state.form.roleCode = ''
      state.form.roleDesc = ''
      state.form.roleType = ''
      state.form.dsType = ''
      state.form.roleId = 0
      state.dialogFormVisible = true
    }
    const editForm = (item: any) => {
      state.dialogFormVisible = true
      state.addORupdate = 'edit'
      state.form.roleName = item.roleName
      state.form.roleCode = item.roleCode
      state.form.roleDesc = item.roleDesc
      state.form.roleType = item.dsScope
      state.form.dsType = item.dsType
      state.form.roleId = item.roleId
    }
    const addUserRoles = async (e: any) => {
      state.form.roleId = e.roleId
      loadingData.value = true
      state.dialogTree = true
      getUserPermissions(e.roleId).then((res: any) => {
        tree.value.setCheckedKeys([])
        state.selectCheck = resolveAllEunuchNodeId(state.treeData, res.data, [])
        loadingData.value = false
      })
    }
    const resolveAllEunuchNodeId = (json: any, idArr: any, temp: any) => {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter((id: any) => id === item.id))
        }
      }
      return temp
    }
    const handConfirms = async () => {
      await addUserPermissions({
        roleId: state.form.roleId,
        menuIds: tree.value
          .getCheckedNodes(false, true)
          .map((item: any) => item.id)
          .join(',')
      }).then((res: any) => {
        if (res.data) {
          state.dialogTree = false
          state.selectCheck = []
          ElMessage.success('权限分配成功')
        }
      })
    }
    const confirms = async () => {
      // for (var item of workertypeList.value) {
      //   if (state.form.skillId === item.value) {
      //     state.form.skillName = item.label
      //   }
      // }
      if (state.addORupdate === 'add') {
        // 新增
        addRole(state.form).then((res) => {
          if (res.data) {
            state.dialogFormVisible = false
            ElMessage.success({
              message: '新增成功',
              type: 'success'
            })
            getData()
          } else {
            ElMessage.success({
              message: '新增失败，请检查手机号和姓名是否重复',
              type: 'success'
            })
            getData()
          }
        })
      } else {
        // 修改
        addUpdate(state.form).then((res) => {
          if (res.data) {
            state.dialogFormVisible = false
            ElMessage.success({
              message: '修改成功',
              type: 'success'
            })
            getData()
          }
        })
      }
    }
    const handleChange = () => {
      state.dialogFormVisible = false
      state.dialogTree = false
      state.selectCheck = []
      // getData()
    }
    const deletesForm = (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(e.roleId).then((res) => {
          if (res) {
            ElMessage({
              type: 'success',
              message: `${e.name}删除成功!`
            })
            getData()
          }
        })
      })
    }
    // 查询
    const getData = async () => {
      state.loading = true
      rolePage({
        size: pagesize.value,
        current: currentPage.value,
        roleName: state.searchValue
      }).then((res) => {
        if (res) {
          state.tableData = res.data.records
          total.value = res.data.total
          state.loading = false
        }
      })
    }
    const getRole = async () => {
      await fetch({
        url: '/admin/menu/treeMenuByClientId',
        method: 'get'
      }).then((res: any) => {
        state.treeData = res.data[0].children
        state.loading = false
      })
    }
    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      tableHeight.value = document.documentElement.clientHeight - 190
    }
    const filterNode = (value: any, data: any) => {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    onMounted(() => {
      getData()
      getRole()
    })

    return {
      total,
      currentPage,
      pagesize,
      workertypeList,
      tableHeight,
      rules,
      companys,
      defaultProps,
      tree,
      onSearch,
      confirms,
      handleChange,
      handleCurrentChange,
      addForm,
      editForm,
      deletesForm,
      phoneValidator,
      addUserRoles,
      loadingData,
      handConfirms,
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
