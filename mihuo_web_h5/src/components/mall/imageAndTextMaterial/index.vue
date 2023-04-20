<template>
  <div class="materialpage">
    <el-container>
      <el-main>
        <el-card>
          <el-input
            v-model="search.materialName"
            clearable
            prefix-icon="Search"
            placeholder="素材名称"
            @change="getData"
          />
<!--          <el-button icon="Search" type="primary" @click="getData">查询</el-button>-->
          <div class="el-card-right">
            <el-button icon="plus" type="primary" @click="saveForm" v-if="$getPression('generator_pmsmaterialtype_add')">新增</el-button>
          </div>
        </el-card>
        <el-table
          stripe
          v-loading="loading"
          :data="tableData"
          style="height: calc(100vh - 31rem)!important;"
          :height="'0'"
          border
        >
          <el-table-column
            prop="materialTypeName"
            width="200"
            label="分类名称"
            align="center"
          />
          <el-table-column
            prop="materialName"
            width="200"
            label="名称"
            align="center"
          />
          <el-table-column prop="url" label="创建日期" align="center">
            <template #default="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="编辑日期" align="center">
            <template #default="scope">
              <span>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="200">
            <template #default="scope">
              <el-button
                type="text"
                size="mini"
                icon="edit"
                @click="updateMaterialType(scope.row)"
                v-if="$getPression('generator_pmsmaterialtype_edit')"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.auditStatus !== 2 && $getPression('generator_pmsmaterialtype_del')"
                type="text"
                class="danger"
                icon="delete"
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
      </el-main>
    </el-container>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :title="formType === 'add' ? '新增图文素材' : '编辑图文素材'"
      custom-class="dialogAdd"
      destroy-on-close
      :before-close="handleClose"
    >
      <div style="height: 72vh; overflow-y: auto">
        <el-form ref="formRef" label-width="9rem" :rules="rules" :model="form">
          <el-form-item label="素材类型" prop="materialTypeId">
            <el-cascader
              v-model="form.materialTypeId"
              :options="materialTypeList"
              :props="defaultProps"
              clearable
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="素材名称" prop="materialName">
            <el-input v-model="form.materialName" />
          </el-form-item>
          <el-form-item label="素材内容" prop="materialName">
            <AppTextEdit :key="form.id" v-model="form.materialContent" />
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
  watch,
  watchEffect
} from 'vue'
import AppTextEdit from '@/components/AppTextEdit/index.vue'
import { useRoute } from 'vue-router'
import {
  getSourceTree,
  addTextImageMaterial,
  deleteTextImageMaterial,
  selectImageAndTextMaterial,
  selectImageAndTextMaterialNew,
  updateImagesAndTextMaterial,
  selectPmsMaterialTypeList
} from '_c/util/api/mall'

import { thumbnailImage } from '@/utils/utils'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {
    AppTextEdit
  },
  props: {
    platformType: {
      type: String,
      default: ''
    },
    companyId: {
      type: String,
      default: ''
    },
    materialTypeId: {
      type: String || Number,
      default: ''
    }
  },
  setup(props) {
    const tree = ref<any>('')
    const json = ref('[]')
    const formRef = ref()
    const dialogVisible = ref<boolean>(false)
    const route = useRoute()
    const isEditor = ref(false)
    const fileType = ref('img')
    const fileTypeList = ref([
      { value: 1, label: '图片', fileType: 'img' },
      { value: 2, label: '视频', fileType: 'video' },
      { value: 3, label: '音频', fileType: 'audio' }
    ])
    const tableHeight = ref<any>(0)
    const state = reactive({
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'id',
        multiple: false
      },
      treeData: [] as any,
      tableData: [],
      loading: true,
      total: 0,
      formType: '',
      pageSize: 15,
      currentPage: 1,
      search: {
        materialTypeId: '0'
      },
      materialTypeList: [],
      form: {
        materialTypeName: '',
        formType: '',
        createTime: '',
        deleteStatus: 0,
        id: 0,
        materialContent: '[]',
        materialName: '',
        materialTypeId: '',
        memberId: 0,
        updateTime: ''
      }
    })
    const rules = reactive({
      materialTypeId: [
        { required: true, message: '请选择分类', trigger: 'change' }
      ],
      materialName: [
        { required: true, message: '请输入素材名称', trigger: 'blur' }
      ]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const handleChange = (val: any) => {
      state.form.materialTypeId =
        state.form.materialTypeId[state.form.materialTypeId.length - 1]
    }
    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 250
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    watch(() => props.materialTypeId, () => {
      state.search.materialTypeId = props.materialTypeId
      state.form.materialTypeId = props.materialTypeId
      state.loading = true
      getData()
    })
    const getData = async () => {
      selectImageAndTextMaterialNew({
        ...state.search,
        size: state.pageSize,
        current: state.currentPage
      }).then((res: any) => {
        state.tableData = res.data.records
        // state.materialTypeList.map((item:any) => {
        //   state.tableData.map((el:any) => {
        //     if (Number(item.id) === Number(el.materialTypeId)) {
        //       el['materialTypeName'] = item.name
        //     }
        //   })
        // })
        res.data.records.map((item: any) => {
          if (item.type !== 1) {
            item.urlYl = thumbnailImage(item.url, false)
            item.urlSl = thumbnailImage(item.url, true)
          }
        })
        state.total = res.data.total
        state.loading = false
      })
    }

    onMounted(() => {
      selectPmsMaterialTypeList({}).then((res) => {
        state.materialTypeList = res.data
        getData()
        getTreeData()
      })
    })
    const getTreeData = async () => {
      getSourceTree().then((res: any) => {
        state.treeData = res.data
      })
    }
    const handleClose = () => {
      state.form = {
        materialTypeName: '',
        formType: '',
        createTime: '',
        deleteStatus: 0,
        id: 0,
        materialContent: '[]',
        materialName: '',
        materialTypeId: '',
        memberId: 0,
        updateTime: ''
      }
      dialogVisible.value = false
    }
    const saveForm = () => {
      state.formType = 'add'
      dialogVisible.value = true
    }
    const onsubmit = () => {
      formRef.value.validate((validate: Boolean) => {
        if (validate) {
          if (state.formType === 'add') {
            addTextImageMaterial(state.form).then((res: any) => {
              if (res) {
                ElMessage.success({
                  message: '新增成功',
                  type: 'success'
                })
                dialogVisible.value = false
                handleClose()
                getData()
              }
            })
          } else {
            updateImagesAndTextMaterial(state.form).then((res: any) => {
              if (res) {
                ElMessage.success({
                  message: '修改成功',
                  type: 'success'
                })
                dialogVisible.value = false
                handleClose()
                getData()
              }
            })
          }
        }
      })
    }

    const updateMaterialType = (e: any) => {
      state.form = { ...state.form, ...JSON.parse(JSON.stringify(e)) }
      state.formType = ''
      isEditor.value = true
      fileType.value =
        e.fileType === 1 ? 'img' : e.fileType === 2 ? 'video' : 'audio'
      dialogVisible.value = true
    }

    const changeUpload = (e: any) => {
    }

    const getFileType = (e: any) => {
      fileType.value = fileTypeList.value[e - 1].fileType
    }
    const getMaterialName = (e: any) => {
      state.form.materialTypeName = (
        state.materialTypeList.filter((item: any) => item.id === e)[0] as any
      ).name
    }
    const deleteMaterialType = (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTextImageMaterial({ id: e.id }).then((res: any) => {
          if (res) {
            ElMessage.success({
              message: '删除成功',
              type: 'success'
            })
            getData()
          }
        })
      })
    }
    return {
      tree,
      dialogVisible,
      route,
      rules,
      tableHeight,
      fileType,
      fileTypeList,
      updateMaterialType,
      deleteMaterialType,
      saveForm,
      getData,
      handleChange,
      open,
      getMaterialName,
      json,
      onsubmit,
      isEditor,
      handleCurrentChange,
      handleClose,
      changeUpload,
      getFileType,
      formRef,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.materialpage {
  .contain-header {
    border-radius: 4px;
    padding: 10px 20px;
    background: #ffffff;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .el-form-item__label {
    text-align: left;
  }

  .el-card .el-dialog__body {
    color: #606266;
    font-size: 0.875rem;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
  }
}
</style>
