<template>
  <div>
    <el-container>
      <el-main>
        <el-card>
          <el-input
            v-model="search.materialName"
            clearable
            prefix-icon="Search"
            placeholder="素材名称"
            @change="getScreening"
          />
<!--          <el-button icon="Search" type="primary" @click="getScreening">-->
<!--            查询-->
<!--          </el-button>-->
          <div class="el-card-right">
            <el-button icon="plus" type="primary" @click="saveFormBatch"
              v-if="$getPression('generator_pmsmaterialtype_add')"
              >新增</el-button
            >
          </div>
        </el-card>
        <el-table
          stripe
          v-loading="loading"
          :data="tableData"
          :height="tableHeight"
          border
          style="height: calc(100vh - 31rem) !important"
        >
          <el-table-column
            prop="fileType"
            label="文件类型"
            width="100"
            align="center"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.fileType === 1" type="success"
                >图片
              </el-tag>
              <el-tag v-if="scope.row.fileType === 2" type="danger"
                >视频
              </el-tag>
              <el-tag v-if="scope.row.fileType === 3" type="primary"
                >音频
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialTypeName"
            width="200"
            label="素材类型"
            align="center"
          />
          <el-table-column
            prop="materialName"
            label="素材名称"
            align="center"
          />
          <el-table-column prop="url" label="图片" align="center" width="320">
            <template #default="scope">
              <el-image
                preview-teleported
                v-if="scope.row.fileType === 1"
                style="height: 50px"
                lazy
                :src="getThumbnailImage(scope.row.url, true)"
                :preview-src-list="[getThumbnailImage(scope.row.url, false)]"
              />
              <div
                v-if="scope.row.fileType === 2"
                @click="getStartVideo(getThumbnailImage(scope.row.url, false))"
              >
                <el-image
                  style="height: 50px"
                  :src="require('@/assets/video/video.png')"></el-image>
              </div>
              <div v-if="scope.row.fileType === 3" class="item-audio">
                <audio
                  style="height: 35px"
                  controls
                  :src="getThumbnailImage(scope.row.url, false)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            width="100"
            label="数据来源"
            align="center"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.type === 1" type="success"
                >平台端
              </el-tag>
              <el-tag v-if="scope.row.type === 3" type="danger">运营端</el-tag>
              <el-tag v-if="scope.row.type === 2" type="primary"
                >企业端
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="200"
          >
            <template #default="scope">
              <div v-if="platform.type === 3">
                <el-button
                  type="text"
                  icon="edit"
                  :disabled="scope.row.type === 1"
                  @click="updateMaterialType(scope.row)"
                  v-if="$getPression('generator_pmsmaterialtype_edit')"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.auditStatus !== 2 && $getPression('generator_pmsmaterialtype_del')"
                  type="text"
                  class="danger"
                  icon="delete"
                  :disabled="scope.row.type === 1"
                  @click="deleteMaterialType(scope.row)"
                  >删除
                </el-button>
              </div>
              <div v-if="platform.type === 1 && scope.row.type === 1">
                <el-button
                  type="text"
                  icon="edit"
                  @click="updateMaterialType(scope.row)"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  class="danger"
                  icon="delete"
                  @click="deleteMaterialType(scope.row)"
                  >删除
                </el-button>
              </div>
              <div v-if="platform.type === 2">
                <el-button
                  type="text"
                  icon="edit"
                  :disabled="scope.row.type === 1 || scope.row.type === 3"
                  @click="updateMaterialType(scope.row)"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  class="danger"
                  icon="delete"
                  :disabled="scope.row.type === 1 || scope.row.type === 3"
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
      </el-main>
    </el-container>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-if="dialogVisible"
      v-model="dialogVisible"
      class="general-material"
      :title="
        formType === 'add'
          ? '新增通用素材'
          : formType === 'addBatch'
          ? '批量添加'
          : `编辑通用素材`
      "
      :before-close="handleClose"
    >
      <div style="height: 65vh; overflow-y: auto">
        <materialForm
          v-model="form"
          :isEdit="isEditor"
          :propUrlList="propUrlList"
          ref="rulesForm"
          :rules="rules"
          :fileType="fileType"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="onsubmit">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <videoPlay
      :props-src="options.src"
      :dialog-status="videoPlayStatus"
      @getClose="videoPlayStatus = false"
    />
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
  watch
} from 'vue'
import { useRoute } from 'vue-router'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import materialForm from './form.vue'
import {
  addPmsCommonMaterial,
  deletePmsCommonMaterial,
  selectPmsCommonMaterial,
  selectPmsCommonMaterialNew,
  updatePmsCommonMaterial,
  selectPmsMaterialTypeList,
  selectPmsMaterialType,
  addPmsCommonMaterialSaveBatch,
  getSourceTree
} from '_c/util/api/mall'

import { thumbnailImage } from '@/utils/utils'
import _ from 'lodash'
import platformListChange from '_c/platformListChange/index.vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import { getPic } from '@/getPic'

export default defineComponent({
  components: {
    materialForm
    // platformListChange
    // uploadFile
  },
  props: {
    platformType: {
      type: String,
      default: ''
    },
    companyId: {
      type: String || Number,
      default: 0
    },
    cityOperatorId: {
      type: String || Number,
      default: ''
    },
    materialTypeId: {
      type: String || Number,
      default: ''
    }
  },
  setup(props) {
    const tree = ref<any>('')
    const dialogVisible = ref<boolean>(false)
    const route = useRoute()
    const rulesForm = ref()
    const videoPlayStatus = ref(false)
    const fileType = ref('img')
    const fileList = ref<any>([])
    const fileAllList = ref<any>([])
    const fileListIndex = ref(0)
    const fileListBatchIndex = ref(0)
    const isEditor = ref(false)
    const formBatch = ref(false)
    const propUrlList = ref<any>([])
    const platform = reactive({
      type: Number(props.platformType)
    })
    const fileUrlStr = ref('')
    const fileTypeList = ref([
      { value: 1, label: '图片', fileType: 'img' },
      { value: 2, label: '视频', fileType: 'video' },
      { value: 3, label: '音频', fileType: 'audio' }
    ])
    const tableHeight = ref<any>(0)
    const getPics = (e: any) => {
      return getPic(e)
    }
    const state = reactive({
      tableData: [],
      treeData: [] as any,
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'id',
        multiple: false
      },
      loading: true,
      total: 0,
      formType: '',
      pageSize: 10,
      currentPage: 1,
      materialTypeList: [],
      search: {
        materialName: null,
        materialTypeId: '' as any
      },
      form: {
        materialTypeId: '',
        materialName: '',
        isImport: 0,
        fileType: 1,
        materialTypeName: '',
        url: '',
        fileList: []
      },
      isEdit: false
    })
    const options = reactive({
      src: 'https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/adc635d8af3f43a68a0ce529b73f0528.mp4' // 视频源
    })

    const rules = reactive({
      materialName: [
        { required: true, message: '请输入素材名称', trigger: 'blur' }
      ],
      materialTypeId: [
        { required: true, message: '请选择素材类型', trigger: 'change' }
      ],
      fileType: [
        { required: true, message: '请选择文件类型', trigger: 'change' }
      ],
      fileList: [{ required: true, message: '请上传图片', trigger: 'change' }]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 250
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      console.log(fileList.value)
      if (fileList.value.length === 1) {
        state.form.materialName = state.form.materialName
          ? state.form.materialName
          : fileList.value[0].name
      }
      window.addEventListener('resize', getHeight, false)
    })
    watch(
      () => props.materialTypeId,
      () => {
        state.search.materialTypeId = props.materialTypeId
        state.form.materialTypeId = props.materialTypeId
        state.loading = true
        getData()
      }
    )
    const getData = async () => {
      selectPmsCommonMaterialNew({
        ...state.search,
        size: state.pageSize,
        descs: 'id',
        current: state.currentPage
      }).then((res: any) => {
        state.tableData = res.data.records
        state.materialTypeList.map((item: any) => {
          state.tableData.map((el: any) => {
            if (Number(item.id) === Number(el.materialTypeId)) {
              el['materialTypeName'] = item.name
            }
          })
        })
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

    const getThumbnailImage = (url: any, thumbnail: any) => {
      return thumbnailImage(url, thumbnail)
    }

    onMounted(() => {
      selectPmsMaterialTypeList({}).then((res) => {
        if (Number(props.platformType) === 1) {
          // 平台
          state.materialTypeList = res.data.filter(
            (item: any) => Number(item.type) === 1
          )
        } else {
          state.materialTypeList = res.data
        }
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
      dialogVisible.value = false
    }

    const onsubmit = () => {
      fileUrlStr.value = ''
      fileListIndex.value = 0
      fileAllList.value = []
      rulesForm.value.validate((valid: boolean) => {
        if (valid) {
          // if (state.form.fileList.length === 0 && state.formType === 'addBatch') {
          //   ElMessage.warning({
          //     message: '请上传文件!!!',
          //     type: 'warning'
          //   })
          //   return
          // }

          ElLoading.service({
            target: 'general-material',
            background: 'rgba(0, 0, 0, 0.8)'
          })
          switch (state.formType) {
            case 'add':
              if (fileList.value.length > 0) {
                getFileUpload(() => {
                  getAddPmsCommonMaterial()
                })
              } else {
                getAddPmsCommonMaterial()
              }
              break
            case 'addBatch':
              if (state.form.fileList.length > 0) {
                getFileUpload(() => {
                  fileListIndex.value++
                  if (state.form.fileList.length === fileListIndex.value) {
                    getAddPmsCommonMaterialItem()
                  }
                })
              } else {
                getAddPmsCommonMaterial()
              }
              break
            default:
              if (state.form.fileList.length > 0) {
                getFileUpload(() => {
                  getUpdatePmsCommonMaterial()
                })
              } else {
                getUpdatePmsCommonMaterial()
              }
              break
          }
        }
      })
    }

    const getAddPmsCommonMaterialItem = () => {
      addPmsCommonMaterialSaveBatch(fileAllList.value).then((res: any) => {
        if (res) {
          ElMessage.success({
            message: '新增成功',
            type: 'success'
          })
          const loadingInstance = ElLoading.service({
            target: 'general-material',
            background: 'rgba(0, 0, 0, 0.8)'
          })
          loadingInstance.close()
          getReset()
          fileListIndex.value = 0
          formBatch.value = false
          dialogVisible.value = false
          getData()
        }
      })
    }

    const getAddPmsCommonMaterial = () => {
      addPmsCommonMaterial(state.form).then((res: any) => {
        if (res) {
          ElMessage.success({
            message: '新增成功',
            type: 'success'
          })
          const loadingInstance = ElLoading.service({
            target: 'general-material',
            background: 'rgba(0, 0, 0, 0.8)'
          })
          loadingInstance.close()
          getReset()
          dialogVisible.value = false
          getData()
        }
      })
    }

    const getUpdatePmsCommonMaterial = () => {
      updatePmsCommonMaterial(state.form).then((res: any) => {
        if (res) {
          ElMessage.success({
            message: '修改成功',
            type: 'success'
          })
          getReset()
          dialogVisible.value = false
          const loadingInstance = ElLoading.service({
            target: 'general-material'
          })
          loadingInstance.close()
          getData()
        }
      })
    }

    const getFileUpload = (callback: any) => {
      if (typeof state.form.fileList[0] === 'string') {
        callback()
        return
      }
      state.form.fileList.map(async (item: any) => {
        const formData = new FormData()
        formData.append('file', item)
        await fetch({
          url: '/admin/sys-file/upload',
          method: 'post',
          data: formData
        }).then((res: any) => {
          if (formBatch.value) {
            fileAllList.value.push({
              materialTypeId: state.form.materialTypeId,
              fileType: state.form.fileType,
              materialName:
                state.form.fileList.length > 1
                  ? item.name.split('.')[0]
                  : state.form.materialName,
              url: res.data.url
            })
          } else {
            state.form.url = res.data.url
          }
          callback()
        })
      })
    }

    const updateMaterialType = (e: any) => {
      state.form = JSON.parse(JSON.stringify(e))
      state.form.fileList = e.url.split(',')
      state.formType = ''
      isEditor.value = true
      // state.isEdit = true
      fileType.value =
        e.fileType === 1 ? 'img' : e.fileType === 2 ? 'video' : 'audio'
      propUrlList.value = [getThumbnailImage(e.url, false)]
      dialogVisible.value = true
    }

    const changeUpload = (e: any) => {
      state.form.url = ''
      fileList.value = e.value
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
        deletePmsCommonMaterial({ id: e.id }).then((res: any) => {
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

    const getStartVideo = (e: any) => {
      options.src = e
      videoPlayStatus.value = !videoPlayStatus.value
    }

    const getPlatformListChange = (e: any) => {
      // state.search.type = e.typeId
    }

    const getScreening = () => {
      if (state.search.materialName === '') {
        state.search.materialName = null
      }
      if (state.search.materialTypeId === '') {
        state.search.materialTypeId = null
      }
      // if (state.search.type === '') {
      //   state.search.type = null
      // }
      getData()
    }

    const saveFormBatch = () => {
      state.form.materialName = ''
      state.form.fileType = 1
      state.form.isImport = 0
      state.form.materialTypeName = ''
      state.form.materialTypeId = state.search.materialTypeId
      state.form.url = ''
      state.isEdit = false
      state.formType = 'addBatch'
      dialogVisible.value = true
      formBatch.value = true
      fileListIndex.value = 0
      console.log(state.form)
      getReset()
    }
    const saveForm = () => {
      state.formType = 'add'
      dialogVisible.value = true
      formBatch.value = false
      fileAllList.value = []
      getReset()
    }

    const getReset = () => {
      state.form.materialTypeId = state.search.materialTypeId
      state.form.materialTypeName = ''
      state.form.materialName = ''
      state.form.url = ''
      fileType.value = 'img'
      propUrlList.value = []
    }
    return {
      dialogVisible,
      route,
      rules,
      tableHeight,
      fileType,
      fileTypeList,
      rulesForm,
      fileList,
      isEditor,
      propUrlList,
      formBatch,
      options,
      videoPlayStatus,
      platform,
      fileListIndex,
      fileAllList,
      fileListBatchIndex,
      tree,
      getTreeData,
      getAddPmsCommonMaterialItem,
      saveFormBatch,
      getPics,
      getScreening,
      getPlatformListChange,
      getAddPmsCommonMaterial,
      getReset,
      getMaterialName,
      getFileUpload,
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
      getStartVideo,
      getThumbnailImage,
      ...toRefs(options),
      ...toRefs(state)
    }
  }
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

  .screening {
    display: flex;
    align-items: center;
  }

  .screening-contain {
    display: flex;

    .screening-item {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      margin-right: 10px;
    }
  }

  .label {
    color: #606266;
    font-size: 16px;
    margin: 0 10px 0 10px;
    min-width: 70px;
  }
}

.item-video {
  cursor: pointer;
  display: inline-block;
}
</style>
