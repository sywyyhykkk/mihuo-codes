<template>
  <div>
    <div v-if="pageType === 0" class="app-container">
      <el-card shadow="never">
        <el-button
          class="btn-add"
          size="mini"
          icon="plus"
          :type="buttonType"
          @click="addProductAttrCate()"
        >

          添加
        </el-button>
      </el-card>
      <div>
       <el-table
         stripe
         ref="productAttrCateTable"
          v-loading="loading"
          :data="tableData"
          row-key="id"
          border
        >
          <!--          <el-table-column type="admin" width="50" align="center" label="序号"/>-->
          <el-table-column label="节点步骤名称" align="center">
            <template #default="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="节点步骤描述" align="center">
            <template #default="scope">{{ scope.row.description }}</template>
          </el-table-column>
          <el-table-column label="排序" align="center">
            <template #default="scope">{{ scope.row.sort }}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200" align="center">
            <template #default="scope">
              <el-button
                size="mini"
                icon="edit"
                type="text"
                @click="handleUpdate(scope.row)"
              > 编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="delete"
                class="danger"
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
      </div>

      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        :title="dialogTitle"
        width="56rem"
      >
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="12rem"
        >
          <el-form-item label="上级节点步骤" prop="roleName">
            <el-select filterable v-model="form.parentId" placeholder="Select">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="节点步骤名称">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="节点描述">
            <el-input v-model="form.description" autocomplete="off" />
          </el-form-item>
          <el-form-item label="排序" prop="dsType">
            <el-input v-model="form.sort" placeholder="" type="number" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="handleConfirm()">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
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
  watchEffect
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类
      type: Number,
      default: 2
    },
    companyId: {
      // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    },
    buttonType: {
      type: String,
      default: 'primary'
    }
  },
  setup(props) {
    const ruleForms = ref<any>('')
    const state = reactive({
      buttonType: props.buttonType,
      tableType: 0,
      pageType: 0,
      tableData: [],
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 10,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      form: {
        companyId: props.companyId,
        children: [] as any,
        created: '',
        description: '',
        hasChildren: true,
        icon: '',
        id: 0,
        level: 0,
        name: '',
        parentId: '0',
        sort: 0,
        treeCode: 'SCJDBZ_100',
        type: props.protType,
        updated: ''
      },
      options: [
        {
          id: '0',
          name: '无上级节点步骤'
        }
      ]
    })
    const addProductAttrCate = () => {
      state.dialogVisible = true
      state.isEdit = false
      state.dialogTitle = '添加节点步骤'
      state.form.name = ''
      state.form.description = ''
      state.form.sort = 0
      state.form.parentId = '0'
    }
    const rules = reactive({
      name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
    })
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑节点步骤'
      state.isEdit = true
      state.form = { ...row }
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
    const handleConfirm = () => {
      if (state.form.parentId === '0') {
        state.form.level = 0
      } else {
        state.form.level = 1
      }
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          console.log(state.form)
          if (!state.isEdit) {
            addData()
          }
          if (state.isEdit) {
            editData()
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }
    const addData = async () => {
      await fetch({
        url: '/mall/processcategory/create',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('节点步骤添加成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const getData = async () => {
      await fetch({
        url: '/mall/processcategory/tree',
        method: 'get'
      }).then((res: any) => {
        state.tableData = res.data
        state.loading = false
        state.options = [
          {
            id: '0',
            name: '无上级节点步骤'
          }
        ]
        res.data.map((item: any) => {
          state.options.push(item)
        })
      })
    }
    const editData = async () => {
      await fetch({
        url: '/mall/processcategory/update',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('节点步骤编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/processcategory/delete/' + id,
        method: 'post'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 220
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    onMounted(() => {
      getData()
    })
    return {
      rules,
      ruleForms,
      addProductAttrCate,
      handleConfirm,
      handleUpdate,
      handleDelete,
      addData,
      getData,
      editData,
      deleteData,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.table-container {
  margin-top: 15px;
}
</style>
