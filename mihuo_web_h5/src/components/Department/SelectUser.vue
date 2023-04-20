<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    v-model="visible"
    :append-to-body="true"
    title="选择用户"
    :before-close="handleClose"
  >
    <el-form ref="rulesForm" label-width="100px" :model="form" :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.name" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号" prop="name">
            <el-input v-model="form.name" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label=" " prop="sort">
            <el-button type="primary" size="mini">查询</el-button>
            <el-button type="primary" size="mini">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table stripe  v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="选择" align="center" width="80">
        <template #default="scope">
          <el-radio
            v-model="currentRowId"
            :label="scope.row.userId"
            @change="changeRedio($event, scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户id" />
      <el-table-column prop="username" label="用户名称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="createTime" label="创建时间" />
    </el-table>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="pagesize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirms">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, unref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userPage } from '_@/api/department'

interface FormModule {
  name: string | number
  parentId: string | number
  sort: number | string
}

interface StateVerify {
  tableData: Array<any>
  loading: Boolean
  forms: {}
}
export default defineComponent({
  emits: ['Add', 'username'],
  setup(props, { emit }) {
    const visible = ref<boolean>(false)
    const rulesForm = ref<HTMLElement | null>(null)
    const currentRowId = ref<null>(null)
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(10)
    const handleClose = () => {
      visible.value = false
      emit('Add')
    }
    const form = reactive<FormModule>({
      name: '',
      parentId: '',
      sort: '',
    })
    const changeRedio = (val: any, v: any) => {
      console.log('object :>> ', v.username)
      emit('username', v.username)
    }

    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const state = reactive<StateVerify>({
      tableData: [{ id: 1 }, { id: 2 }, { id: 3 }],
      loading: true,
      forms: {},
    })
    const initForm = () => {
      return {
        employeeName: '',
        name: '',
        employeeTitle: '',
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    const getData = async () => {
      state.loading = true
      const res = await userPage({
        size: pagesize.value,
        current: currentPage.value,
      })
      if (res) {
        console.log('res :>> ', res)
        state.tableData = res.data.records
        total.value = res.data.total
        state.loading = false
      }
    }

    onMounted(() => {
      getData()
    })

    const open = (e: any) => {
      visible.value = true

      console.log('visible :>> ', visible.value)
    }
    const confirms = async () => {
      const formWrap = unref(rulesForm) as any
      if (!formWrap) return
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
            // const res = await addDepartment(form)
            // if (res) {
            //   ElMessage({
            //     type: 'success',
            //     message: `新增${form.name}成功`
            //   })
            //   visible.value = false
            //   emit('Add', true)
            // }
          } else {
            return false
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
    return {
      currentRowId,
      changeRedio,
      reset,
      total,
      currentPage,
      pagesize,
      handleCurrentChange,
      rulesForm,
      confirms,
      visible,
      open,
      handleClose,
      form,
      ...toRefs(state),
    }
  },
})
</script>
<style scoped lang="less">
:deep(.el-image__preview).el-radio__input {
  position: relative;
  left: 5px;
}
</style>
