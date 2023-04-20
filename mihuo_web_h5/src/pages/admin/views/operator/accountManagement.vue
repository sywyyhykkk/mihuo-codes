<template>
  <div class="contain">
    <div class="contain-header">
      <div class="operator-name">{{ accountProp.name }}</div>
      <div class="button-contain">
        <el-button
          class="btn-add"
          size="mini"
          type="primary"
          icon="refreshLeft"
          @click="backPage"
        >
          返回
        </el-button>
        <el-button size="mini" type="primary" @click="saveAccount"
          >绑定账号</el-button
        >
      </div>
    </div>
   <el-table stripe  v-loading="loading"
      :data="tableData"
      border
      :height="tableHeight"
      style="width: 100%"
    >
      <el-table-column prop="username" label="姓名" align="center" />
      <el-table-column prop="phone" label="手机号码" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column label="操作" fixed="right" align="center" width="100">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="getRemoveUser(scope.row)"
            >解绑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination-new
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager,next, jumper"
      @current-change="handleCurrentChange"
    /> -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :title="formType === 'add' ? '绑定账号' : `编辑账号`"
      :before-close="handleClose"
    >
      <el-input
        v-model="search.username"
        placeholder="姓名"
        class="input-with-select"
        style="max-width: 240px; margin-bottom: 15px"
      >
        <template #append>
          <el-button
            size="mini"
            type="primary"
            icon="Search"
            @click="getScreening"
          />
        </template>
      </el-input>
     <el-table stripe  v-loading="userLoading"
        :data="userTableData"
        border
        :height="tableHeight - 170"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="姓名" align="center" />
        <el-table-column prop="phone" label="手机号码" align="center" />
        <el-table-column prop="lockFlag" label="是否有效" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.lockFlag === '0'" type="success"
              >有 效</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
      </el-table>
      <el-pagination-new
        :current-page="userCurrentPage"
        :page-size="userPageSize"
        :total="userTotal"
        layout="total, prev, pager,next, jumper"
        @current-change="userHandleCurrentChange"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="onSubmit">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
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
  watchEffect,
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  addUserPage,
  removeUser,
  selectCityOperatorList,
  selectUserPage,
} from '_@/api/cityOperator'

export default defineComponent({
  props: {
    accountProp: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['backPage'],
  setup(props, { emit }) {
    const tableHeight = ref<any>(0)
    const rulesForm = ref()
    const dialogVisible = ref<boolean>(false)
    const userIdList = ref<any>([])
    const userList = ref<any>([])
    const state = reactive({
      tableData: [],
      loading: true,
      total: 0,
      formType: '',
      pageSize: 20,
      currentPage: 1,
      cityOperatorId: props.accountProp.id,
      search: {
        username: null,
      },
      form: {
        materialTypeId: '',
        materialName: '',
        isImport: 0,
        materialTypeName: '',
        url: '',
      },
    })
    const userState = reactive({
      userTableData: [],
      userLoading: true,
      userTotal: 0,
      userFormType: '',
      userPageSize: 20,
      userCurrentPage: 1,
    })

    const rules = reactive({
      materialName: [
        { required: true, message: '请输入素材名称', trigger: 'blur' },
      ],
      materialTypeId: [
        { required: true, message: '请选择素材类型', trigger: 'change' },
      ],
      fileType: [
        { required: true, message: '请选择文件类型', trigger: 'change' },
      ],
    })

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 220
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      // getData()
    }

    const userHandleCurrentChange = (val: number) => {
      userState.userCurrentPage = val
      getSelectUserPage()
    }

    const getData = async () => {
      selectCityOperatorList({
        id: state.cityOperatorId,
        size: state.pageSize,
        current: state.currentPage,
      }).then((res: any) => {
        state.tableData = res.data
        state.total = res.total
        state.loading = false
      })
    }

    onMounted(() => {
      getData()
    })

    const saveAccount = () => {
      state.formType = 'add'
      dialogVisible.value = !dialogVisible.value
      getSelectUserPage()
    }

    const getSelectUserPage = () => {
      selectUserPage({
        current: userState.userCurrentPage,
        size: userState.userPageSize,
        ...state.search,
      }).then((res) => {
        if (res) {
          userState.userTableData = res.data.records
          userState.userTotal = res.data.total
          userState.userLoading = false
        }
      })
    }

    const updateAccount = () => {
      state.formType = 'edit'
      dialogVisible.value = !dialogVisible.value
    }

    const onSubmit = () => {
      if (state.formType === 'add') {
        userIdList.value = []
        userList.value.map((item: any) => {
          userIdList.value.push(item.userId)
        })
        addUserPage({
          cityOperatorId: state.cityOperatorId,
          userIds: userIdList.value,
        }).then((res) => {
          if (res) {
            ElMessage.success({
              message: '绑定成功',
              type: 'success',
            })
            dialogVisible.value = false
            getData()
          }
        })
      } else {
        ElMessage.success({
          message: '修改成功',
          type: 'success',
        })
      }
    }

    const handleClose = () => {
      dialogVisible.value = !dialogVisible.value
    }

    const backPage = (e: any) => {
      emit('backPage')
    }

    const handleSelectionChange = (val: any) => {
      userList.value = val
    }

    const getScreening = () => {
      getSelectUserPage()
    }

    const getRemoveUser = (e: any) => {
      ElMessageBox.confirm(`是否确定要解绑此${e.username}用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        removeUser({
          cityOperatorId: Number(state.cityOperatorId),
          userId: e.userId,
        }).then((res) => {
          if (res) {
            ElMessage.success({
              message: '解绑成功',
              type: 'success',
            })
            getData()
          }
        })
      })
    }

    return {
      tableHeight,
      dialogVisible,
      rules,
      rulesForm,
      userIdList,
      userList,
      getRemoveUser,
      getScreening,
      handleSelectionChange,
      backPage,
      onSubmit,
      handleClose,
      saveAccount,
      updateAccount,
      handleCurrentChange,
      userHandleCurrentChange,
      ...toRefs(state),
      ...toRefs(userState),
    }
  },
})
</script>

<style lang="less" scoped>
.contain-header {
  border-radius: 4px;
  padding: 10px 20px;
  background: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .operator-name {
    color: #2d8cf0;
  }
}
</style>
