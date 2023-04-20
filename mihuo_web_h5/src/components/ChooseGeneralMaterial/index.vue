<template>
  <div v-if="visibleSync" class="page">
    <el-dialog
      v-model="visibleSync"
      :destroy-on-close="true"
      :title="chooseFileType.label"
      append-to-body
      :before-close="handleClose"
      width="110rem"
    >
      <div style="height: 65vh">
        <el-container>
          <el-aside width="150px" style="height: 58vh; overflow-y: scroll">
            <ul class="materialClass">
              <li
                v-for="item in materialTypeList"
                :key="item.id"
                :class="{ active: item.id === selectedId.id }"
                @click="selectType(item)"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top-start"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </li>
            </ul>
          </el-aside>
          <el-main>
            <div style="width: 30em; margin: 0 25px">
              <el-input
                v-model="searchText"
                placeholder="请输入素材名称"
                class="input-with-select"
              >
                <template #append>
                  <el-button type="primary" icon="Search" @click="search()" />
                </template>
              </el-input>
            </div>
            <div style="height: 55vh; overflow-y: scroll; margin-top: 10px">
              <ul
                v-if="title != 4"
                v-infinite-scroll="getMaterialData"
                :infinite-scroll-immediate="false"
                :infinite-scroll-distance="50"
                class="infinite-list"
              >
                <ElEmpty
                  v-if="!cload && !tableData.length"
                  description="您还没有素材，快去添加吧~~"
                />
                <el-checkbox-group v-else v-model="checkList" @change="onChangeCheckBox">
                  <div style="display: flex; flex-wrap: wrap; padding-top: 8rem;">
                    <div
                      v-for="(item, i) in tableData"
                      :key="item.id"
                    >
                      <div class="fileContent">
                        <el-checkbox :label="item.id">
                          <el-image
                            v-if="item.fileType === 1"
                            :preview-src-list="imgSrcList()"
                            :initial-index="i"
                            preview-teleported
                            fit="none"
                            class="imageMaterial"
                            lazy
                            :src="getThumbnailImage(item.url)"
                          />
                          <div
                            v-else-if="item.fileType === 2"
                            style="background: #f5f5f5"
                          >
                            <!--                            <p class="name-text">-->
                            <!--                              {{ item.materialName || ' ' }}-->
                            <!--                            </p>-->
                            <video
                              controls
                              :src="$imageGlobal + item.url"
                              style="height: 100px; width: 100px"
                            />
                          </div>
                          <div v-else style="background: #f5f5f5">
                            <!--                            <p class="name-text">-->
                            <!--                              {{ item.materialName || ' ' }}-->
                            <!--                            </p>-->
                            <audio
                              style="height: 35px"
                              controls
                              :src="$imageGlobal + item.url"
                            />
                          </div>
                        </el-checkbox>
                      </div>
                      <!--                      <el-tooltip-->
                      <!--                        class="box-item"-->
                      <!--                        effect="dark"-->
                      <!--                        :content="item.materialName"-->
                      <!--                        placement="top-start"-->
                      <!--                      >-->
                      <!--                        <span v-if="item.fileType == 1" class="materialName">-->
                      <!--                          {{ item.materialName || ' ' }}-->
                      <!--                        </span>-->
                      <!--                      </el-tooltip>-->
                    </div>
                  </div>
                </el-checkbox-group>
                <div v-loading="cload" style="height: 60px; width: 100%" />
              </ul>
              <ul
                v-else
                v-infinite-scroll="getMaterialData"
                :infinite-scroll-immediate="false"
                :infinite-scroll-distance="50"
                class="infinite-list"
              >
                <el-checkbox-group v-model="checkList">
                  <div
                    v-for="item in tableData"
                    :key="item.url"
                    style="
                      display: inline-block;
                      margin: 15px;
                      background: #f5f5f5;
                      padding-left: 10px;
                    "
                  >
                    <el-checkbox :label="item.materialContent">
                      <div style="">
                        <p style="color: #999999; padding: 10px 15px 10px 0">
                          {{ item.materialName || '暂无名称' }}
                        </p>
                      </div>
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
                <div v-loading="cload" style="height: 60px; width: 100%" />
              </ul>
            </div>
          </el-main>
        </el-container>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="appendData">确定</el-button>
          <el-button
            v-if="title != 4"
            icon="cloudy"
            type="primary"
            @click="AddDialogVisible = true"
          ><i
            class="el-icon-upload"
          />没有满意的？立即上传</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-if="AddDialogVisible"
      v-model="AddDialogVisible"
      title="新增通用素材"
      :before-close="addHandleClose"
      append-to-body
    >
      <div style="height: 60vh; overflow: auto">
        <materialForm
          ref="rulesForm"
          v-model="form"
          :is-edit="false"
          :rules="rules"
          :file-type="fileType"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="onsubmit">确 定</el-button>
          <el-button @click="addHandleClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, defineComponent, reactive, watch, toRefs, unref } from 'vue'
import { ElMessage, ElEmpty } from 'element-plus'
import { thumbnailImage } from '@/utils/utils'
import {
  addPmsCommonMaterial,
  addPmsCommonMaterialSaveBatch,
  selectImageAndTextMaterial,
  selectPmsCommonMaterial,
  selectPmsMaterialType
} from '_c/util/api/mall'
import { fetch } from '_@/axios-config/axios'
import materialForm from '@/components/mall/generalMaterial/form.vue'
import table from '_c/Table'

export default defineComponent({
  components: {
    ElEmpty,
    materialForm
  },
  props: {
    modelValue: Boolean,
    title: {
      type: Number,
      default: 0
    }
  },
  emits: ['getGeneralMaterial'],
  setup(props, { emit }) {
    const visibleSync = ref(props.modelValue)
    const cload = ref(false)
    const ButtonLoading = ref(false)
    const typeload = ref(false)
    const editorRef = ref(null)
    const drawer = ref(false)
    const rulesForm = ref()
    const dialogVisible = ref(false)
    const AddDialogVisible = ref(false)
    const fileType = ref('img')
    const fileList = ref([])
    const isEditor = ref(false)
    const propUrlList = ref([])
    const fileUrlList = ref([])
    const fileListIndex = ref(0)
    const formBatch = ref(false)
    const fileAllList = ref([])
    const fileTypeList = ref([
      { value: 1, label: '图片', fileType: 'img' },
      { value: 2, label: '视频', fileType: 'video' },
      { value: 3, label: '音频', fileType: 'audio' }
    ])
    const materialFileType = toRefs([
      { value: 1, label: '图片', fileType: 'img' },
      { value: 2, label: '视频', fileType: 'video' },
      { value: 3, label: '音频', fileType: 'audio' },
      { value: 4, label: '图文', fileType: 'all' }
    ])

    const chooseFileType = ref({})
    const checkList = ref([])
    const finalCheckList = ref([])
    const state = reactive({
      rules: {
        materialTypeId: [
          { required: true, message: '请选择素材类型', trigger: 'blur' }
        ],
        fileType: [
          { required: true, message: '请选择文件类型', trigger: 'blur' }
        ],
        materialName: [
          { required: true, message: '请输入素材名称', trigger: 'blur' }
        ]
      },
      tableData: [],
      searchText: '',
      loading: true,
      selectedId: { id: 0, name: '全部' },
      total: 0,
      totalPage: 0,
      formType: '',
      pageSize: 15,
      currentPage: 0,
      materialTypeList: [],
      form: {
        fileType: props.title,
        materialTypeId: '',
        materialName: '',
        name: '',
        url: '',
        fileList: []
      }
    })

    watch(
      () => props.modelValue,
      (newValue, oldValue) => {
        chooseFileType.value =
          props.title > 0 ? materialFileType[props.title - 1].value : {}
        state.selectedId = { id: 0, name: '全部' }
        state.tableData = []
        state.form.fileType = props.title
        visibleSync.value = props.modelValue
        visibleSync.value && getMaterialType()
      }
    )

    const getThumbnailImage = (url) => {
      return thumbnailImage(url, true)
    }

    const getMaterialType = () => {
      typeload.value = true
      selectPmsMaterialType({ current: 1, size: 9999 }).then((res) => {
        typeload.value = false
        state.materialTypeList = [{ id: 0, name: '全部' }, ...res.data.records]
        getMaterialData()
      })
    }

    const selectType = (item) => {
      state.selectedId = item
      state.form.materialTypeId = item.id
      state.form.fileList = []
      state.currentPage = 0
      state.tableData = []
      getMaterialData()
    }

    const getMaterialData = async () => {
      state.currentPage++
      if (state.currentPage > state.totalPage && state.totalPage > 0) return
      cload.value = true
      if (Number(props.title) === 4) {
        selectImageAndTextMaterial({
          materialName: state.searchText,
          materialTypeId: state.selectedId.id || '',
          size: state.pageSize,
          current: state.currentPage,
          fileType: chooseFileType.value.value,
          type: state.form.type
        }).then((res) => {
          cload.value = false
          state.totalPage = res.data.pages
          const newArr = [...state.tableData, ...res.data.records]
          newArr.sort(function(a, b) {
            return new Date(b.updateTime) - new Date(a.updateTime)
          })
          state.tableData = newArr
        })
        return
      }
      selectPmsCommonMaterial({
        materialName: state.searchText,
        materialTypeId: state.selectedId.id || '',
        size: state.pageSize,
        current: state.currentPage,
        fileType: chooseFileType.value.value,
        type: state.form.type
      }).then((res) => {
        cload.value = false
        state.totalPage = res.data.pages
        const newArr = [...state.tableData, ...res.data.records]
        newArr.sort(function(a, b) {
          return new Date(b.updateTime) - new Date(a.updateTime)
        })
        state.tableData = newArr
      })
    }

    const onChangeCheckBox = (list) => {
      finalCheckList.value = []
      list.forEach(el => {
        const findItem = state.tableData.find(e => '' + e.id === '' + el)
        if (findItem && findItem.id) {
          finalCheckList.value.push(findItem.url)
        }
      })
    }

    const appendData = () => {
      if (Number(props.title) === 4) {
        const initdata = []
        checkList.value.forEach((item) => {
          initdata.push(...JSON.parse(item || '[]'))
        })
        finalCheckList.value = initdata
      }
      emit('getGeneralMaterial', finalCheckList)
      checkList.value = []
      finalCheckList.value = []
      state.tableData = []
      state.currentPage = 0
      visibleSync.value = false
      emit('update:modelValue', false)
      emit('input', false)
    }

    const handleClose = () => {
      state.tableData = []
      state.currentPage = 0
      visibleSync.value = false
      state.tableData = []
      emit('update:modelValue', false)
      emit('input', false)
    }

    const addHandleClose = () => {
      AddDialogVisible.value = false
      state.form = {
        fileType: props.title,
        materialTypeId: '',
        materialName: '',
        name: '',
        url: ''
      }
    }

    const search = () => {
      state.currentPage = 0
      state.tableData = []
      getMaterialData()
    }
    // const getFileUpload = (callback) => {
    //   state.form.fileList.map(async(item) => {
    //     const formData = new FormData()
    //     formData.append('file', item)
    //     await fetch({ url: '/admin/sys-file/upload', method: 'post', data: formData }).then((res) => {
    //       fileUrlList.value.push(res.data.url)
    //       state.form.url = res.data.url
    //       callback()
    //     })
    //   })
    // }
    const getFileUpload = (callback) => {
      state.form.fileList.map(async (item) => {
        const formData = new FormData()
        formData.append('file', item)
        await fetch({
          url: '/admin/sys-file/upload',
          method: 'post',
          data: formData
        }).then((res) => {
          fileAllList.value.push({
            materialTypeId: state.form.materialTypeId,
            fileType: state.form.fileType,
            materialName:
              state.form.fileList.length > 1
                ? item.name.split('.')[0]
                : state.form.materialName,
            url: res.data.url
          })
          callback()
        })
      })
    }

    const changeUpload = (e) => {
      state.form.materialName = e.value[0].name
      state.form.url = ''
      fileList.value = e.value
    }

    const onsubmit = () => {
      // ButtonLoading.value = true
      fileListIndex.value = 0
      rulesForm.value.validate((valid) => {
        if (valid) {
          if (state.form.fileList && state.form.fileList.length > 0) {
            getFileUpload(() => {
              fileListIndex.value++
              if (state.form.fileList.length === fileListIndex.value) {
                getAddPmsCommonMaterialItem()
                ButtonLoading.value = false
              }
            })
            ButtonLoading.value = false
          } else {
            getAddPmsCommonMaterial()
            ButtonLoading.value = false
          }
        }
      })
    }

    const getAddPmsCommonMaterialItem = () => {
      addPmsCommonMaterialSaveBatch(fileAllList.value).then((res) => {
        if (res) {
          ElMessage.success({
            message: '新增成功',
            type: 'success'
          })
          state.currentPage = 0
          state.tableData = []
          getMaterialData()
          AddDialogVisible.value = false
          state.form = {
            fileType: props.title,
            materialTypeId: state.form.materialTypeId,
            materialName: '',
            name: '',
            url: '',
            fileList: []
          }
        }
      })
    }

    const getAddPmsCommonMaterial = () => {
      addPmsCommonMaterial(state.form).then((res) => {
        if (res) {
          ElMessage.success({
            message: '新增成功',
            type: 'success'
          })
          state.tableData.push(state.form)
          AddDialogVisible.value = false
          state.form = {
            fileType: props.title,
            materialTypeId: '',
            materialName: '',
            name: '',
            url: '',
            fileList: []
          }
        }
      })
    }

    const getMaterialName = (e) => {
      state.form.materialTypeName = state.materialTypeList.filter(
        (item) => item.id === e
      )[0].name
    }

    const getFileType = (e) => {
      fileType.value = fileTypeList.value[e - 1].fileType
    }

    const imgSrcList = () => {
      const arr = []
      state.tableData.forEach((item) => {
        arr.push(thumbnailImage(item.url, false))
      })
      return arr
    }

    return {
      imgSrcList,
      editorRef,
      fileListIndex,
      handleClose,
      addHandleClose,
      onsubmit,
      drawer,
      cload,
      getAddPmsCommonMaterial,
      getAddPmsCommonMaterialItem,
      changeUpload,
      getFileUpload,
      dialogVisible,
      AddDialogVisible,
      ...toRefs(state),
      materialFileType,
      getMaterialData,
      checkList,
      selectType,
      search,
      appendData,
      chooseFileType,
      visibleSync,
      getThumbnailImage,
      fileType,
      fileList,
      isEditor,
      propUrlList,
      getMaterialName,
      fileUrlList,
      getFileType,
      rulesForm,
      typeload,
      fileTypeList,
      onChangeCheckBox
    }
  }
})
</script>

<style lang="less" scoped>
.activeContent {
  padding: 10px 0;
  background: #fff;
  border-bottom: 1px solid #fff;

  button {
    margin: 0 10px;
  }
}

.fileContent {
  width: 20rem;
  height: 20rem;

  .imageMaterial {
    width: 140px;
    height: 140px;
  }

  .name-text {
    text-align: center;
    color: #999999;
    padding: 10px;
  }

  :deep(.el-checkbox-group) {
    /* display: flex; */
    width: 86rem;
    justify-items: center;
  }

  :deep(.el-checkbox__input) {
    position: absolute;
    top: 10px;
    left: 20px;
    background: transparent;
  }
}

.materialClass {
  border-right: 1px solid #f5f5f5;
  padding: 0 10px;

  li {
    text-align: center;
    padding: 10px 0;
    font-size: 18px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  li.active {
    background: #2d8cf0;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }
}

.materialName {
  bottom: 5px;
  color: #999;
  z-index: 9;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  transform: scale(0.8);
  text-overflow: ellipsis;
  max-width: 180px;
  display: block;
  text-align: center;
}

.preview {
  width: auto;
  max-width: 400px;
  position: relative;
  background: #fff;
  border-radius: 5px;
  margin: auto;
  box-shadow: 0px 15px 15px -15px #666;
  border: 1px solid #f5f5f5;
  overflow: hidden;

  .top-nav {
    position: absolute;
    top: 0;
    height: 75px;
    background: #fff;
    z-index: 999;
    transition: all 0.3s;

    & * {
      pointer-events: none;
    }

    .tit {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
    }

    img {
      max-width: 100%;
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
  }

  .view-content {
    width: 400px;
    height: 700px;
    background: #f5f5f5;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 75px;
    box-shadow: 0 2px 6px #ccc;

    &::-webkit-scrollbar {
      width: 0px;
    }

    &::-webkit-scrollbar-thumb {
      background: #dbdbdb;
    }

    &::-webkit-scrollbar-track {
      background: #f6f6f6;
    }

    p {
      background: #fff;
    }

    div {
      transition: all 0.3s;
      background: #fff;

      div {
        pointer-events: none;
      }

      .wait {
        background: #deedff;
        height: 35px;
        text-align: center;
        line-height: 35px;
        font-size: 12px;
        color: #666;
      }

      .el-icon-error {
        position: absolute;
        right: -10px;
        top: -6px;
        color: red;
        font-size: 25px;
        cursor: pointer;
        display: none;
        z-index: 9999;
      }
    }
  }
}

.infinite-list {
  height: 600px;
  padding: 0;
  margin: 0;
  list-style: none;
  :deep(.el-checkbox-group) {
    display: block;
    width: 86rem;
    //justify-items: center;
  }

  .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);

    & + .list-item {
      margin-top: 10px;
    }
  }
}

.page {
  .el-card__body,
  .el-main {
    padding: 0;
  }
}
</style>
