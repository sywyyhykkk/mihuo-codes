<template>
  <div v-if="visibleSync" class="productpage">
    <el-dialog
      v-model="visibleSync"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      append-to-body
      width="110rem"
      title="选择需要跳转的链接内容"
    >
      <div>
        <div v-if="pageType === 0" class="app-container">
          <div class="department_content">
            <div class="left">
              <div class="add">
                <el-input
                  v-model="filterText"
                  style="width: 100%"
                  size="mini"
                  placeholder="输入关键字进行过滤"
                />
              </div>
              <el-tree
                ref="tree"
                :data="treeData"
                :props="defaultProps"
                style="height: 55vh; overflow-y: scroll"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
              >
                <template #default="{ node }">
                  <div class="custom">
                    <span>{{ node.label }}</span>
                  </div>
                </template>
              </el-tree>
            </div>
            <div class="right">
              <el-table
                ref="productAttrCateTable"
                v-loading="loading"
                stripe
                highlight-current-row
                :data="tableData"
                height="90%"
                row-key="id"
                border
                @current-change="handleSelectionChange"
              >
                <el-table-column
                  type="index"
                  width="50"
                  align="center"
                  label="序号"
                />
                <el-table-column label="标题" align="center">
                  <template #default="scope">{{ scope.row.title }}</template>
                </el-table-column>
                <el-table-column label="分类名称" align="center">
                  <template #default="scope">{{ scope.row.typeName }}</template>
                </el-table-column>
                <el-table-column label="封面图片" align="center">
                  <template #default="scope">
                    <el-image
                      preview-teleported
                      :src="$getUrl.getPicUrl(scope.row.facePic, true)"
                      :preview-src-list="$getUrl.getPicUrl(scope.row.facePic)"
                      style="height: 30px; width: 30px"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="描述" align="center">
                  <template #default="scope">{{ scope.row.desc }}</template>
                </el-table-column>
              </el-table>
              <el-pagination-new
                class="cms-pagination"
                :current-page="currentPage"
                :page-size="pagesize"
                :total="total"
                layout="total, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="appendData">确定</el-button>
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
  watch
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  props: {
    modelValue: Boolean,
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
    },
    cityOperatorId: {
      type: Number || String,
      default: ''
    },
    cityId: {
      type: Number || String,
      default: 0
    }
  },
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const productAttrCateTable = ref<any>('')
    const visibleSync = ref(props.modelValue)
    const tree = ref<any>('')
    const state = reactive<any>({
      filterText: '',
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
      treeData: [],
      mallIds: [],
      typeTreeCode: '',
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'typeName',
        value: 'id'
      },
      form: {
        cityId: props.cityId,
        // cityOperatorId: props.cityOperatorId,
        desc: '',
        typeName: '',
        id: 0 as any,
        content: '[]' as any,
        facePic: '',
        title: '',
        type: [] as any
      },
      options: []
    })
    watch(
      () => props.modelValue,
      (newValue, oldValue) => {
        visibleSync.value = props.modelValue
        visibleSync.value && getData()
      }
    )
    watch(visibleSync, () => {
      if (!visibleSync.value) {
        emit('update:modelValue', false)
      }
    })
    const addProductAttrCate = () => {
      state.dialogVisible = true
      state.isEdit = false
      state.dialogTitle = '添加内容'
      state.form.desc = ''
      state.form.typeName = ''
      state.form.id = 0
      state.form.content = '[]'
      state.form.facePic = ''
      state.form.title = ''
      state.form.type = []
    }
    const rules = reactive({
      type: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
    })
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑内容'
      state.isEdit = true
      state.form = { ...row }
      // state.form.content = '[]'
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除此条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.id)
      })
    }
    const handleConfirm = () => {
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          console.log(state.form)
          if (!state.isEdit) {
            const obj = {
              desc: state.form.desc,
              // typeName: state.form.typeName,
              // cityId: state.form.cityId,
              // cityOperatorId: state.form.cityOperatorId,
              content: state.form.content,
              facePic: state.form.facePic,
              title: state.form.title,
              type:
                state.form.type.length > 0
                  ? state.form.type[state.form.type.length - 1]
                  : 0
            }
            addData(obj)
          }
          if (state.isEdit) {
            const obj = {
              desc: state.form.desc,
              // typeName: state.form.typeName,
              id: state.form.id,
              // cityId: state.form.cityId,
              // cityOperatorId: state.form.cityOperatorId,
              content: state.form.content,
              facePic: state.form.facePic,
              title: state.form.title,
              type: state.form.type
            }
            editData(obj)
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }
    const addData = async (obj: any) => {
      await fetch({
        url: '/mall/cms_content_manager',
        method: 'post',
        data: obj
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('添加成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const getData = async () => {
      await fetch({
        url: '/mall/cms_content_manager/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          typeTreeCode: state.typeTreeCode,
          type: '' // 分类
        }
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }
    const getContentList = async () => {
      await fetch({
        url: '/mall/cms_content_type/customer/page',
        method: 'get',
        params: {
          size: 9999,
          current: 1,
          // companyId: props.companyId,
          type: '',
          cityId: props.cityId
          // cityOperatorId: props.cityOperatorId
        }
      }).then((res: any) => {
        state.options = res.data.records
      })
    }
    const editData = async (obj: any) => {
      await fetch({
        url: '/mall/cms_content_manager',
        method: 'put',
        data: obj
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/cms_content_manager/' + id,
        method: 'delete'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const handleNodeClick = async (v: any) => {
      // console.log(v)
      state.typeTreeCode = v.typeTreeCode
      getData()
    }
    const updateTableData = () => {
      state.typeTreeCode = ''
      getData()
    }
    const getTreeData = async () => {
      await fetch({
        url: '/mall/cms_content_type/tree',
        method: 'get'
      }).then((res: any) => {
        state.treeData = [...state.treeData, ...res.data]
        state.loading = false
      })
    }

    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 350
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    const filterNode = (value: any, treeData: any) => {
      if (!value) return true
      return treeData.typeName.indexOf(value) !== -1
    }
    watch(state, (value) => {
      tree.value && tree.value.filter(state.filterText)
    })
    onMounted(() => {
      getTreeData()
      getContentList()
      getData()
    })
    const appendData = () => {
      if (!state.mallIds.length) {
        ElMessage.warning('请选择内容')
        return
      }
      emit('getGeneralMaterial', ref(state.mallIds))
      visibleSync.value = false
      emit('update:modelValue', false)
      emit('input', false)
    }
    const handleClose = () => {
      state.tableData = []
      state.currentPage = 1
      visibleSync.value = false
      state.tableData = []
      emit('update:modelValue', false)
      emit('input', false)
    }
    const handleSelectionChange = (row: any) => {
      state.mallIds = []
      state.mallIds.push(row)
    }
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    return {
      rules,
      tree,
      productAttrCateTable,
      handleClose,
      appendData,
      ruleForms,
      handleSelectionChange,
      addProductAttrCate,
      handleConfirm,
      handleUpdate,
      handleDelete,
      addData,
      getData,
      visibleSync,
      editData,
      deleteData,
      getContentList,
      filterNode,
      handleNodeClick,
      handleCurrentChange,
      updateTableData,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.cms-pagination {
  position: relative;
}

.department_content {
  display: flex;
  margin-top: 15px;
  justify-content: space-between;

  :deep(.el-dialog) {
    overflow: auto;
  }

  .left {
    width: 30%;
    margin-right: 20px;
    height: auto;
    background-color: white;
    border-radius: 5px;
    text-align: center;

    .add {
      margin-top: 20px;
      margin-bottom: 20px;
      width: calc(100% - 40px);
      margin-left: 20px;
    }

    .custom {
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-right: 10px;
    }

    .woker-ul {
      list-style: none;
      background-color: #fff;
      line-height: 25px;
      padding: 10px;
      box-sizing: border-box;
      color: #666;
      font-size: 12px;

      li {
        cursor: pointer;
      }
    }
  }

  .right {
    width: 70%;
    height: auto;
    padding: 0 2rem 0 0 !important;
  }
}

.table-container {
  margin-top: 15px;
}
</style>
