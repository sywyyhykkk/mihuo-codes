<template>
  <div>
    <div class="contain-header">
      <span>数据列表---工序分类</span>
      <div>
        <el-button size="mini" type="primary" @click="saveForm">新增</el-button>
        <slot />
      </div>
    </div>
    <el-table
      stripe
      v-loading="loading"
      :data="tableData"
      border
      :height="tableHeight"
      style="width: 100%"
    >
      <el-table-column prop="name" width="200" label="名称" align="center" />
      <el-table-column
        prop="treeCode"
        width="200"
        label="编码"
        align="center"
      />
      <el-table-column prop="level" width="200" label="等级" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column prop="icon" label="图标" align="center">
        <template #default="scope">
          <el-image
            preview-teleported
            lazy
            :src="scope.row.icon"
            :preview-src-list="[scope.row.icon]"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="updateMaterialType(scope.row)"
            >修改
          </el-button>
          <el-button
            v-if="scope.row.auditStatus !== 2"
            type="danger"
            size="mini"
            plain
            @click="deleteMaterialType(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager,next, jumper"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :title="formType === 'add' ? '新增工序分类' : '编辑工序分类'"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="rulesForm" :rules="rules" :model="form">
        <el-form-item label="分类等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分类编码" prop="treeCode">
          <el-input v-model="form.treeCode" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="onsubmit">确 定</el-button>
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
  unref,
  watchEffect,
} from 'vue'
import { useRoute } from 'vue-router'
import {
  addProcessCategory,
  deleteProcessCategory,
  selectProcessCategory,
  updateProcessCategory,
} from '_c/util/api/mall'

import { thumbnailImage } from '@/utils/utils'

import fileUpload from '_c/fileUpload/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {
    // fileUpload
  },
  props: {
    platformType: {
      type: String,
      default: '',
    },
    companyId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const dialogVisible = ref<boolean>(false)
    const route = useRoute()
    const rulesForm = ref()
    const fileType = ref('img')
    const levelList = ref([
      {
        label: '一级',
        value: 1,
        id: 1,
      },
      {
        label: '二级',
        value: 2,
        id: 2,
      },
      {
        label: '三级',
        value: 3,
        id: 3,
      },
      {
        label: '四级',
        value: 4,
        id: 4,
      },
    ])
    const fileTypeList = ref([
      { value: 1, label: '图片', fileType: 'img' },
      { value: 2, label: '视频', fileType: 'video' },
      { value: 3, label: '音频', fileType: 'audio' },
    ])
    const tableData = ref([])
    const tableHeight = ref<any>(0)
    const state = reactive({
      // tableData: [],
      loading: true,
      total: 0,
      formType: '',
      pageSize: 5,
      currentPage: 1,
      materialTypeList: [],
      form: {
        materialTypeId: '',
        name: '',
        treeCode: '',
        level: '',
        type: Number(props.platformType),
        url: '',
      },
    })
    const rules = reactive({
      name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      treeCode: [
        { required: true, message: '请输入分类编码', trigger: 'blur' },
      ],
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 220
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    const getData = async () => {
      selectProcessCategory({
        size: state.pageSize,
        current: state.currentPage,
        type: state.form.type,
      }).then((res: any) => {
        tableData.value = res.data.records
        // res.data.records.map((item:any) => {
        //   item.urlYl = thumbnailImage(item.url, false, '')
        //   item.urlSl = thumbnailImage(item.url, true, '')
        //   item.urlInfo = thumbnailImage(item.url, false, 'info')
        // })
        state.total = res.data.total
        state.loading = false
      })
    }

    onMounted(() => {
      getData()
    })

    const handleClose = () => {
      resetNode()
      dialogVisible.value = false
    }
    const saveForm = () => {
      state.formType = 'add'
      dialogVisible.value = true
      resetNode()
    }
    const onsubmit = () => {
      const forms = unref(rulesForm)
      forms.validate((valid: boolean) => {
        if (valid) {
          if (state.formType === 'add') {
            addProcessCategory(state.form).then((res: any) => {
              if (res) {
                resetNode()
                dialogVisible.value = false
                state.form.name = ''
                getData()
              }
            })
          } else {
            updateProcessCategory(state.form).then((res: any) => {
              if (res) {
                ElMessage.success({
                  message: '修改成功',
                  type: 'success',
                })
                dialogVisible.value = false
                getData()
              }
            })
          }
        }
      })
    }

    const updateMaterialType = (e: any) => {
      state.form = e
      state.formType = ''
      dialogVisible.value = true
    }

    const changeUpload = (e: any) => {
      state.form.url = e.value[0]
    }

    const getFileType = (e: any) => {
      fileType.value = fileTypeList.value[e - 1].fileType
    }

    const deleteMaterialType = (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteProcessCategory({ id: e.id, type: state.form.type }).then(
          (res: any) => {
            if (res) {
              ElMessage.success({
                message: '删除成功',
                type: 'success',
              })
              getData()
            }
          }
        )
      })
    }
    const resetNode = () => {
      const form = unref(rulesForm)
      form.resetFields()
    }

    return {
      rulesForm,
      dialogVisible,
      route,
      rules,
      tableHeight,
      fileType,
      fileTypeList,
      levelList,
      tableData,
      resetNode,
      updateMaterialType,
      deleteMaterialType,
      saveForm,
      getData,
      open,
      onsubmit,
      handleCurrentChange,
      handleClose,
      changeUpload,
      getFileType,
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
