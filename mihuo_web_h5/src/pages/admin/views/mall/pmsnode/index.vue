<template>
  <div>
    <div class="contain-header">
      <span>数据列表</span>
      <div class="c">
        <el-button size="mini" type="primary" @click="saveFormChildNodes"
          >新增基础节点</el-button
        >
      </div>
    </div>
   <el-table stripe  v-loading="childNodesTable.loading"
      :data="childNodesTable.tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        width="200"
        label="节点名称"
        align="center"
      />
      <el-table-column prop="description" label="分类描述" align="center" />
      <el-table-column label="操作" fixed="right" align="center" width="300">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="updateMaterialTypeNode(scope.row)"
            >修改
          </el-button>
          <el-button
            type="danger"
            size="mini"
            plain
            @click="deleteMaterialTypeNode(scope.row)"
            >删除节点
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      :current-page="childNodesTable.currentPage"
      :page-size="childNodesTable.pageSize"
      :total="childNodesTable.total"
      small
      layout="total, prev, pager,next, jumper"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="childNodes"
      :title="childNodesFormType === 'add' ? '新增基础节点' : '编辑基础节点'"
      :before-close="childNodesHandleClose"
    >
      <el-form
        ref="childNodesForms"
        :rules="childNodesFormRules"
        :model="childNodesForm"
      >
        <el-form-item label="基础节点名称" prop="name">
          <el-input v-model="childNodesForm.name" />
        </el-form-item>
        <el-form-item label="基础节点描述" prop="description">
          <el-input
            v-model="childNodesForm.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetNode();childNodes = false">取 消</el-button>
          <el-button type="primary" @click="onSubmitChildNodes">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, unref } from 'vue'
import { useRoute } from 'vue-router'
import {
  addPmsProcessNode,
  selectPmsProcessNode,
  deletePmsProcessNode,
  updatePmsProcessNode,
} from '_@/api/mall.ts'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  props: {
    platformType: {
      type: String,
      default: '',
    },
  },
  setup() {
    const dialogVisible = ref<boolean>(false)
    const childNodes = ref<boolean>(false)
    const parentId = ref('')
    const route = useRoute()
    const rulesForm = ref()
    const childNodesForms = ref()
    const childNodesForm = reactive({
      name: '',
      sort: 0,
      icon: '',
      id: '',
      description: '',
    })
    const childNodesTable = reactive({
      tableData: [],
      loading: true,
      total: 0,
      pageSize: 5,
      currentPage: 1,
    })
    const state = reactive({
      tableData: [],
      loading: true,
      total: 0,
      formType: '',
      childNodesFormType: '',
      pageSize: 5,
      currentPage: 1,
      form: { name: '', description: '' },
    })

    const childNodesFormRules = reactive({
      name: [
        { required: true, message: '请输入基础节点名称', trigger: 'blur' },
      ],
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getData = async () => {
      getSelectPmsProcessNode()
    }

    onMounted(() => {
      getSelectPmsProcessNode()
    })

    const saveFormChildNodes = () => {
      childNodes.value = true
      state.childNodesFormType = 'add'
      resetNode()
    }

    const childNodesHandleClose = () => {
      resetNode()
      childNodes.value = false
    }

    /**
     * 查询子节点信息列表
     * */
    const getSelectPmsProcessNode = () => {
      selectPmsProcessNode({
        size: childNodesTable.pageSize,
        current: childNodesTable.currentPage,
      }).then((res) => {
        if (res) {
          childNodesTable.tableData = res.data.records
          childNodesTable.total = res.data.total
          childNodesTable.loading = false
        }
      })
    }

    const updateMaterialTypeNode = (e: any) => {
      childNodes.value = true
      state.childNodesFormType = 'update'
      childNodesForm.description = e.description
      childNodesForm.icon = e.icon
      childNodesForm.id = e.id
      childNodesForm.name = e.name
      childNodesForm.sort = e.sort
    }

    const resetNode = () => {
      const form = unref(childNodesForms)
      form.resetFields()
    }

    const onSubmitChildNodes = () => {
      const forms = unref(childNodesForms)
      forms.validate((valid: boolean) => {
        if (valid) {
          if (state.childNodesFormType === 'add') {
            /**
             * 新增子节点类型信息
             * */
            addPmsProcessNode(childNodesForm).then((res) => {
              if (res) {
                ElMessage.success({
                  message: '新增成功',
                  type: 'success',
                })
                getData()
                childNodes.value = false
              }
            })
          } else {
            /**
             * 修改子节点类型信息
             * */
            updatePmsProcessNode(childNodesForm).then((res) => {
              if (res) {
                ElMessage.success({
                  message: '修改成功',
                  type: 'success',
                })
                childNodes.value = false
                getData()
              }
            })
          }
        }
      })
    }

    /**
     * 删除子节点信息
     * */
    const deleteMaterialTypeNode = (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePmsProcessNode({ id: e.id }).then((res: any) => {
          if (res) {
            ElMessage.success({
              message: '删除成功',
              type: 'success',
            })
            getSelectPmsProcessNode()
          }
        })
      })
    }
    return {
      dialogVisible,
      route,
      childNodesFormRules,
      childNodes,
      childNodesForm,
      parentId,
      childNodesTable,
      rulesForm,
      childNodesForms,
      resetNode,
      updateMaterialTypeNode,
      deleteMaterialTypeNode,
      childNodesHandleClose,
      getData,
      open,
      handleCurrentChange,
      saveFormChildNodes,
      onSubmitChildNodes,
      ...toRefs(state),
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
}
</style>
