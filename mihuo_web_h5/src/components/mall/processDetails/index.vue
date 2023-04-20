<template>
  <div>
    <div class="contain-header">
      <span>数据列表---工序分类详情</span>
      <div class="c">
        <el-button size="mini" type="primary" @click="saveForm">新增</el-button>
        <slot name="import" />
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
      <el-table-column
        prop="processCategoryName"
        width="200"
        label="分类名称"
        align="center"
      />
      <el-table-column prop="name" width="200" label="名称" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column prop="processImg" label="工艺图片" align="center">
        <template #default="scope">
          <el-image
            preview-teleported
            lazy
            :src="scope.row.processImg"
            :preview-src-list="[scope.row.processImg]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="processVideo" label="工艺说明视频" align="center">
        <template #default="scope">
          <el-image
            preview-teleported
            lazy
            :src="scope.row.processVideo"
            :preview-src-list="[scope.row.processVideo]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="showVideo" label="展示视频" align="center">
        <template #default="scope">
          <el-image
            preview-teleported
            lazy
            :src="scope.row.showVideo"
            :preview-src-list="[scope.row.showVideo]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="standardVideo" label="验收标准视频" align="center">
        <template #default="scope">
          <el-image
            preview-teleported
            lazy
            :src="scope.row.standardVideo"
            :preview-src-list="[scope.row.standardVideo]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="数据来源" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 1" type="success">平台端 </el-tag>
          <el-tag v-if="scope.row.type === 3" type="danger">运营端 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template #default="scope">
          <div v-if="form.type === 3">
            <el-button
              type="primary"
              size="mini"
              :disabled="scope.row.type === 1"
              @click="updateMaterialType(scope.row)"
              >修改
            </el-button>
            <el-button
              type="danger"
              size="mini"
              :disabled="scope.row.type === 1"
              @click="deleteMaterialType(scope.row)"
              >删除
            </el-button>
            <!--            <el-button-->
            <!--              v-if="form.type === 3 && scope.row.type === 1"-->
            <!--              type="primary"-->
            <!--              size="mini"-->
            <!--              @click="updateMaterialType(scope.row)"-->
            <!--            >查看-->
            <!--            </el-button>-->
          </div>
          <div v-if="form.type === 1 && scope.row.type === 1">
            <el-button
              type="primary"
              size="mini"
              @click="updateMaterialType(scope.row)"
              >修改
            </el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              @click="deleteMaterialType(scope.row)"
              >删除
            </el-button>
          </div>
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
      :before-close="handleClose"
    >
      <div style="height: 70vh; overflow: auto" class="c">
        <el-form ref="rulesForm" :rules="rules" :model="form">
          <el-form-item label="工序分类" prop="materialTypeId">
            <el-select
              v-model="form.processCategoryId"
              placeholder="请选择"
              @change="getProcessTypeList"
            >
              <el-option
                v-for="item in processTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="工艺图片" prop="processImg">
            <uploadImage v-model="form.processImg" />
            <!--          <uploadImage v-model="form.processImg" :is-edits="isEdit"/>-->
          </el-form-item>
          <el-form-item label="工艺说明视频" prop="processVideo">
            <el-input v-model="form.processVideo" />
          </el-form-item>
          <el-form-item label="展示视频" prop="showVideo">
            <el-input v-model="form.showVideo" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="form.sort" type="number" />
          </el-form-item>
          <el-form-item label="验收标准图文" prop="standardImg">
            <el-input v-model="form.standardImg" />
          </el-form-item>
          <el-form-item label="验收标准视频" prop="standardVideo">
            <el-input v-model="form.standardVideo" />
          </el-form-item>
        </el-form>
      </div>
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
  watchEffect,
} from 'vue'
import { useRoute } from 'vue-router'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import {
  addPmsProcessDetail,
  deletePmsProcessDetail,
  selectProcessCategoryPage,
  updateProcessCategoryPage,
  selectProcessCategoryList,
  selectProcessCategoryTree,
} from '_c/util/api/mall'

import { thumbnailImage } from '@/utils/utils'

import fileUpload from '_c/fileUpload/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {
    uploadFile,
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
    const fileTypeList = ref([
      { value: 1, label: '图片', fileType: 'img' },
      { value: 2, label: '视频', fileType: 'video' },
      { value: 3, label: '音频', fileType: 'audio' },
    ])
    const tableHeight = ref<any>(0)
    const state = reactive({
      tableData: [],
      loading: true,
      total: 0,
      formType: '',
      pageSize: 5,
      currentPage: 1,

      processTypeList: [],
      form: {
        processCategoryId: '',
        processCategoryName: '',
        processImg: '',
        processVideo: '',
        showVideo: '',
        standardImg: '',
        standardVideo: '',
        materialTypeId: '',
        description: '',
        typeName: '',
        name: '',
        sort: '',
        url: '',
        type: Number(props.platformType),
      },
    })
    const rules = reactive({
      name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
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
      selectProcessCategoryPage({
        size: state.pageSize,
        current: state.currentPage,
        type: props.platformType,
      }).then((res: any) => {
        state.tableData = res.data.records
        // res.data.records.map((item:any) => {
        //   item.urlYl = thumbnailImage(item.url, false, '')
        //   item.urlSl = thumbnailImage(item.url, true, '')
        //   item.urlInfo = thumbnailImage(item.url, false, 'info')
        // })
        state.total = res.data.total
        state.loading = false
      })

      // processTypeList
      selectProcessCategoryTree({ type: props.platformType }).then((res) => {
        if (res) {
          state.processTypeList = res.data
        }
      })
    }

    onMounted(() => {
      getData()
    })

    const handleClose = () => {
      dialogVisible.value = false
    }
    const saveForm = () => {
      state.formType = 'add'
      dialogVisible.value = true
    }
    const onsubmit = () => {
      if (state.formType === 'add') {
        addPmsProcessDetail(state.form).then((res: any) => {
          if (res) {
            ElMessage.success({
              message: '新增成功',
              type: 'success',
            })
            dialogVisible.value = false
            state.form.name = ''
            getData()
          }
        })
      } else {
        updateProcessCategoryPage(state.form).then((res: any) => {
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
        deletePmsProcessDetail({ id: e.id }).then((res: any) => {
          if (res) {
            ElMessage.success({
              message: '删除成功',
              type: 'success',
            })
            getData()
          }
        })
      })
    }

    const getProcessTypeList = (e: any) => {
      state.form.processCategoryName = (
        state.processTypeList.filter((item: any) => item.id === e)[0] as any
      ).name
    }
    return {
      dialogVisible,
      route,
      rules,
      tableHeight,
      fileType,
      fileTypeList,
      getProcessTypeList,
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
