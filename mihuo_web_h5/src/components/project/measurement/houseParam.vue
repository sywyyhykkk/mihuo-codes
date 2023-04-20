<template>
  <div>
    <el-table
      ref="productAttrCateTable"
      v-loading="loading"
      stripe
      :data="tableData"
      style="height: calc(100vh - 31rem) !important;"
      :height="'0'"
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
      <el-table-column v-if="pageStatus===1" label="适用区域" align="center">
        <template #default="scope">{{ getObj(scope.row.areaAttributeList) }}</template>
      </el-table-column>
      <el-table-column v-if="pageStatus===1" label="排序" align="center">
        <template #default="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="单位" align="center">
        <template #default="scope">{{ scope.row.unit }}</template>
      </el-table-column>
      <el-table-column label="是否必填" align="center">
        <template #default="scope">{{ scope.row.requiredFlag == 0 ? '否' : '是' }}</template>
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
        <el-form-item label="单位" prop="title">
          <el-input v-model="form.unit" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="pageStatus===1" label="排序" prop="title">
          <el-input v-model="form.sort" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否必填" prop="title">
          <el-radio-group v-model="form.requiredFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="pageStatus===1" label="适用区域" prop="attributeIds">
          <el-select
            v-model="form.attributeIds"
            multiple
            filterable
            placeholder="请选择适用区域"
            @change="changeSelectAttr"
          >
            <el-option
              v-for="item in dataList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
    },
    pageStatus: {
      type: Number,
      default: 1
    },
    pageTitle: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const state = reactive({
      isEdit: false,
      showDialog: false,
      pageType: 0,
      tableData: [],
      dataList: [],
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 10,
      dialogTitle: `新增${props.pageTitle}参数`,
      form: {
        attributeIds: [],
        name: '',
        projectId: 0,
        requiredFlag: 0 as any,
        sort: 0,
        unit: ''
      }
    })
    const rules = reactive({
      // treeCode: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      attributeIds: [{ required: true, message: '请选择适用区域', trigger: 'blur' }]
    })
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
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
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
      emit('update:modelValue', false)
      state.isEdit = false
      state.dialogTitle = `新增${props.pageTitle}参数`
      state.form = {
        attributeIds: [],
        name: '',
        projectId: 0,
        requiredFlag: 0,
        sort: 0,
        unit: ''
      }
    }
    const changeSelectAttr = () => {
      ruleForms.value.validate((valid: any) => {
        if (valid) {
        }
      })
    }
    const handleUpdate = (val: any) => {
      emit('update:modelValue', true)
      state.isEdit = true
      var obj: any = []
      if (val.areaAttributeList) {
        val.areaAttributeList.map((res: any) => {
          obj.push(res.id)
        })
      }
      // state.form = {
      //   id: val.id,
      //   attributeIds: obj,
      //   name: val.name,
      //   projectId: val.projectId,
      //   requiredFlg: val.requiredFlg,
      //   sort: val.sort,
      //   unit: val.unit
      // }
      state.form = val
      state.form.attributeIds = obj
      state.form.requiredFlag = parseInt(val.requiredFlag)
      state.dialogTitle = `编辑${props.pageTitle}参数`
    }
    const addData = async () => {
      var url = '/order/bizbuildattributevalue'
      if (props.pageStatus === 1) {
        url = '/order/bizareaattributevalue'
      }
      await fetch({
        url: url,
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          handleCancel()
          state.form = {
            attributeIds: [],
            name: '',
            projectId: 0,
            requiredFlag: 0,
            sort: 0,
            unit: ''
          }
          ElMessage.success(`${props.pageTitle}参数添加成功`)
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const editData = async () => {
      var url = '/order/bizbuildattributevalue/updateById'
      if (props.pageStatus === 1) {
        url = '/order/bizareaattributevalue/updateById'
      }
      await fetch({
        url: url,
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          handleCancel()
          state.isEdit = false
          state.dialogTitle = `新增${props.pageTitle}参数`
          state.form = {
            attributeIds: [],
            name: '',
            projectId: 0,
            requiredFlag: 0,
            sort: 0,
            unit: ''
          }
          ElMessage.success(`${props.pageTitle}参数编辑成功`)
          getData()
        } else {
          ElMessage.error(res.msg)
          state.loading = false
        }
      })
    }
    const deleteData = async (id: any) => {
      var url = '/order/bizbuildattributevalue/removeById/'
      if (props.pageStatus === 1) {
        url = '/order/bizareaattributevalue/removeById/'
      }
      await fetch({
        url: url + id,
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
      var url = '/order/bizbuildattributevalue/page'
      if (props.pageStatus === 1) {
        url = '/order/bizareaattributevalue/page'
      }
      state.loading = true
      await fetch({
        url: url,
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          cityOperatorId: wsCache.get('cityOperator')?.id
        }
      }).then((res: any) => {
        state.loading = false
        if (props.pageStatus === 1) {
          state.tableData = res.data.data.records
          state.total = res.data.data.total
        } else {
          state.tableData = res.data.records
          state.total = res.data.total
        }
      })
    }
    const getDoorList = async () => {
      await fetch({
        url: '/order/bizareaattribute/page',
        method: 'get',
        params: {
          size: 1000,
          current: 1,
          custom: '0',
          usingFlag: 1,
          cityOperatorId: wsCache.get('cityOperator')?.id
        }
      }).then((res: any) => {
        state.dataList = res.data.records
      })
    }
    onMounted(() => {
      getData()
      getDoorList()
      // rowDrop()
    })
    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 250
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
      state.showDialog = props.modelValue
    })
    const getObj = (val: any) => {
      var obj: any = []
      if (val) {
        val.map((res: any) => {
          obj.push(res.name)
        })
      }
      return obj.toString()
    }
    return {
      ruleForms,
      rules,
      changeSelectAttr,
      handleCurrentChange,
      addData,
      getData,
      editData,
      deleteData,
      handleConfirm,
      handleDelete,
      handleCancel,
      handleUpdate,
      getHeight,
      getObj,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>

</style>

