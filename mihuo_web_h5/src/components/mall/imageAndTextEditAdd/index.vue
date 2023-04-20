<template>
  <div>
    <div class="activeContent">
      <el-button
        type="primary"
        icon="el-icon-picture"
        @click="chooseMaterial(0)"
      >
        图片素材
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-video-camera-solid"
        @click="chooseMaterial(1)"
      >
        视频素材
      </el-button>
      <el-button
        type="danger"
        icon="el-icon-service"
        @click="chooseMaterial(2)"
      >
        音频素材
      </el-button>
      <el-button type="info" icon="el-icon-s-unfold" @click="redo">
        全部重做
      </el-button>
      <el-button
        type="success"
        icon="el-icon-s-management"
        @click="drawer = true"
      >
        效果预览
      </el-button>
    </div>
    <Editor ref="editorRef" :value="editcontent" @change="handleChange" />
    <div style="margin-top: 20px; text-align: center" />
    <el-dialog
      v-model="dialogVisi.ble"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="chooseFileType.label"
      :before-close="handleClose"
    >
      <el-container>
        <el-aside width="150px">
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
          <ul
            v-infinite-scroll="getData"
            class="infinite-list"
            style="overflow: auto"
          >
            <el-checkbox-group v-model="checkList">
              <div
                v-for="item in tableData"
                :key="item.url"
                class="fileContent"
                style="display: inline-block; margin: 15px"
              >
                <el-checkbox :label="item.url">
                  <el-image
                    v-if="item.fileType == 1"
                    preview-teleported
                    style="width: 100px; height: 100px"
                    :src="getThumbnailImage(item.url)"
                  />

                  <video
                    v-else-if="item.fileType == 2"
                    controls
                    :src="item.url"
                    style="height: 100px; width: 100px"
                  />
                  <audio
                    v-else
                    style="height: 35px"
                    controls
                    :src="item.url"
                  />
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </ul>
        </el-main>
      </el-container>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendHtml">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer" title="效果预览" direction="rtl">
      <section class="preview">
        <!-- header 不可拖拽 -->
        <div class="top-nav">
          <img src="@/assets/img/topNavBlack.jpg">
          <span class="tit">效果预览</span>
        </div>
        <div class="view-content" v-html="modelValue" />
      </section>
    </el-drawer>
  </div>
</template>

<script>
import { ref, unref, defineComponent, reactive, watch, toRefs } from 'vue'
import Editor from '_c/Editor/index'
import { thumbnailImage } from '@/utils/utils'
import {
  addPmsCommonMaterial,
  deletePmsCommonMaterial,
  selectPmsCommonMaterial,
  selectPmsMaterialType,
  selectPmsMaterialTypeList,
  updatePmsCommonMaterial
} from '_c/util/api/mall'

export default defineComponent({
  components: { Editor },
  props: {
    modelValue: String,
    platformType: {
      type: String,
      default: ''
    },
    companyId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const editcontent = ref(props.modelValue)
    const editorRef = ref(null)
    const drawer = ref(false)
    const dialogVisible = ref(false)
    const materialFileType = toRefs([
      { value: 1, label: '图片', fileType: 'img' },
      { value: 2, label: '视频', fileType: 'video' },
      { value: 3, label: '音频', fileType: 'audio' }
    ])
    const chooseFileType = ref({})
    const checkList = ref([])
    const state = reactive({
      tableData: [],
      loading: true,
      selectedId: { id: 0, name: '全部' },
      total: 0,
      formType: '',
      pageSize: 5,
      currentPage: 1,
      materialTypeList: [],
      form: {
        materialTypeId: '',
        name: '',
        // companyId: Number(props.companyId),
        type: Number(props.platformType),
        url: ''
      }
    })
    const getThumbnailImage = (url) => {
      return thumbnailImage(url, true)
    }
    const getMaterialType = () => {
      selectPmsMaterialType({
        current: 1,
        size: 9999,
        type: props.platformType
      }).then((res) => {
        if (Number(props.platformType) === 1) {
          // 平台
          state.materialTypeList = res.data.records.filter(
            (item) => Number(item.type) === 1
          )
          state.materialTypeList = [
            { id: 0, name: '全部' },
            ...state.materialTypeList
          ]
        } else {
          state.materialTypeList = [
            { id: 0, name: '全部' },
            ...res.data.records
          ]
        }
        getData()
      })
    }
    const selectType = (item) => {
      state.selectedId = item
      getData()
    }
    const getData = async () => {
      selectPmsCommonMaterial({
        materialName: '',
        materialTypeId: state.selectedId.id || '',
        size: state.pageSize,
        current: state.currentPage,
        fileType: chooseFileType.value.value,
        type: state.form.type
      }).then((res) => {
        state.tableData = res.data.records
      })
    }
    const chooseMaterial = (type) => {
      dialogVisible.value = true
      chooseFileType.value = materialFileType[type].value
      getMaterialType()
      getData()
    }
    const handleChange = (html) => {
      // console.log(html)
      emit('update:modelValue', html)
      emit('input', html)
    }
    const appendHtml = () => {
      let filesHtml = ''
      switch (chooseFileType.value.label) {
        case '图片':
          checkList.value.forEach((value) => {
            filesHtml += `<p><img src=${value} style="max-width: 100%"></p>`
          })
          break
        case '视频':
          checkList.value.forEach((value) => {
            filesHtml += `<video src=${value} controls="controls" style="max-width: 100%">`
          })
          break
      }
      unref(editorRef).append(filesHtml)
      checkList.value = []
      dialogVisible.value = false
    }
    const redo = () => {
      unref(editorRef).clear()
    }
    const showHtml = () => {
      console.log(unref(editorRef).getHtml())
    }

    const showText = () => {
      console.log(unref(editorRef).getText())
    }

    const showJson = () => {
      console.log(unref(editorRef).getJSON())
    }
    const handleClose = () => {
      dialogVisible.value = false
    }
    return {
      editcontent,
      editorRef,
      handleChange,
      showHtml,
      showText,
      drawer,
      dialogVisible,
      showJson,
      ...toRefs(state),
      materialFileType,
      chooseMaterial,
      getData,
      checkList,
      selectType,
      appendHtml,
      chooseFileType,
      getThumbnailImage,
      redo,
      handleClose
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
  position: relative;
  .el-checkbox__input {
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
</style>
