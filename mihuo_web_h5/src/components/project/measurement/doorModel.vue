<template>
  <div>
    <el-table
      ref="productAttrCateTable"
      v-loading="loading"
      stripe
      :data="tableData"
      :height="'0'"
      style="height: calc(100vh - 31rem) !important;"
      row-key="id"
      border
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
        label="序号"
      />
      <el-table-column label="名称" align="center">
        <template #default="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <!--      <el-table-column label="是否必填" align="center">-->
      <!--        <template #default="scope">{{ scope.row.requiredFlag == 0 ? '否' : '是' }}</template>-->
      <!--      </el-table-column>-->
      <el-table-column label="是否启用" align="center">
        <template #default="scope">{{ scope.row.usingFlag == 0 ? '否' : '是' }}</template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="200"
        align="center"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="mini"
            icon="edit"
            @click="handleUpdate(scope.row)"
          > 编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            class="danger"
            icon="delete"
            @click="handleDelete(scope.row)"
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

    <el-dialog
      v-if="showDialog"
      v-model="showDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="dialogTitle"
      @close="handleCancel"
    >

      <el-form
        ref="ruleForms"
        :model="form"
        :rules="rules"
        label-width="9rem"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" autocomplete="off" />
        </el-form-item>
        <!--          <el-form-item label="单位" prop="title">-->
        <!--            <el-input v-model="form.unit" autocomplete="off" />-->
        <!--          </el-form-item>-->
        <!--          <el-form-item label="是否必填" prop="title">-->
        <!--            <el-radio-group v-model="form.requiredFlag">-->
        <!--              <el-radio :label="1">是</el-radio>-->
        <!--              <el-radio :label="0">否</el-radio>-->
        <!--            </el-radio-group>-->
        <!--          </el-form-item>-->
        <el-form-item label="是否启用" prop="title">
          <el-radio-group v-model="form.usingFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="loading" @click="handleConfirm()">确 定</el-button>
          <el-button @click="handleCancel()">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const state = reactive({
      isEdit: false,
      showDialog: false,
      pageType: 0,
      tableData: [],
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 10,
      dialogTitle: '新增空间区域',
      form: {
        name: '',
        projectId: 0,
        requiredFlag: 0 as any,
        usingFlag: 0 as any,
        sort: 0,
        unit: '',
        remark: ''
      }
    })
    const rules = reactive({
      // treeCode: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const handleConfirm = () => {
      state.loading = true
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          if (!state.isEdit) {
            addData()
          }
          if (state.isEdit) {
            editData()
          }
          state.loading = false
        } else {
          alert('请完善信息')
          state.loading = false
          return false
        }
      })
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.id)
      })
    }
    const handleCancel = () => {
      state.isEdit = false
      state.dialogTitle = '新增空间区域'
      state.form = {
        name: '',
        projectId: 0,
        requiredFlag: 0,
        usingFlag: 0,
        sort: 0,
        unit: '',
        remark: ''
      }
      emit('update:modelValue', false)
    }
    const handleUpdate = (val: any) => {
      state.form = val
      state.dialogTitle = '编辑空间区域'
      state.form.requiredFlag = parseInt(state.form.requiredFlag)
      state.form.usingFlag = parseInt(state.form.usingFlag)
      emit('update:modelValue', true)
      state.isEdit = true
    }
    const addData = async () => {
      await fetch({
        url: '/order/bizareaattribute',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          handleCancel()
          ElMessage.success('空间区域添加成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const editData = async () => {
      await fetch({
        url: '/order/bizareaattribute/updateById',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          handleCancel()
          ElMessage.success('空间区域编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
          state.loading = false
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/order/bizareaattribute/removeById/' + id,
        method: 'get'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/order/bizareaattribute/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          custom: '0',
          cityOperatorId: wsCache.get('cityOperator')?.id
        }
      }).then((res: any) => {
        state.loading = false
        state.tableData = res.data.records
        state.total = res.data.total
        // console.log(res.data.records)
      })
    }
    onMounted(() => {
      getData()
      // rowDrop()
    })
    watchEffect(() => {
      state.showDialog = props.modelValue
    })
    return {
      ruleForms,
      rules,
      handleCurrentChange,
      addData,
      getData,
      editData,
      deleteData,
      handleConfirm,
      handleDelete,
      handleCancel,
      handleUpdate,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>

</style>

