<template>
  <div class="main">
    <div class="container">
      <div
        v-for="(item,index) in state.distType" :key="index"
        class="container-header"
      >
        <div class="container-info">
          <span>{{ `${item.groupName}（${item.sopUploadList.length || 0}）` }}</span>
          <el-button type="primary" @click="upload(item)">上传</el-button>
        </div>
        <div v-if="item.sopUploadList && item.sopUploadList.length">
          <template v-for="(v,i) in item.sopUploadList" :key="i">
            <div class="container-user">
              <div class="img-user">
                <img v-if="v.creatorId" :src="$getUrl.avatarImage(v.creatorId)">
                <img v-else :src="require('@/assets/img/avatar.png')">
                <span>
                  <i>{{ v.creatorName }}</i>{{ v.skillName ? '（' + v.skillName + '）' : '' }}<i>{{ v.created }}</i> <i>上传了{{ v.uploadItemList.length
                  }}个文件</i>
                </span>
              </div>
              <el-icon @click="edit(v)">
                <edit-pen />
              </el-icon>
            </div>
            <div class="container-img">
              <div
                v-for="(itm,ind) in v.uploadItemList" :key="ind"
                class="container-img_content"
              >
                <div
                  class="image"
                  @mouseover="mouseChange(true,v,ind,itm)"
                  @mouseleave="mouseChange(false,v,ind,itm)"
                >
                  <img
                    v-if="getFileHouzhui(itm.url) == 'pdf'" class="image-only"
                    :src="require('@/assets/img/pdf.png')" alt=""
                    srcset="" @click="dowm(itm)"
                  >
                  <img
                    v-else-if="getFileHouzhui(itm.url) == 'doc' || getFileHouzhui(itm.url) == 'docx'" class="image-only"
                    :src="require('@/assets/img/word.png')" alt=""
                    srcset=""
                  >
                  <img
                    v-else-if="getFileHouzhui(itm.url)== 'xlsx' || getFileHouzhui(itm.url) == 'xls'" class="image-only"
                    :src="require('@/assets/img/excel.png')" alt=""
                    srcset=""
                  >
                  <img
                    v-else-if="getFileHouzhui(itm.url)== 'ppt' || getFileHouzhui(itm.url)== 'pptx'" class="image-only"
                    :src="require('@/assets/img/ppt.png')" alt=""
                    srcset=""
                  >
                  <img
                    v-else-if="getFileHouzhui(itm.url)== 'cad'" class="image-only"
                    :src="require('@/assets/img/cad.png')" alt=""
                    srcset=""
                  >

                  <div
                    class="video-box"
                    v-else-if="itm.type=='video'"
                    @click="getStartVideo(getThumbnailImage(itm.url, false))"
                  >
                    <el-icon :size="30"><CaretRight /></el-icon>
                  </div>
                  <img
                    v-else :src="thumbnailImage(itm.url)"
                    alt="" srcset=""
                    @click="lookImage(itm.url)"
                  >
                  <!-- <el-image
                                        v-else
                                        :src="thumbnailImage(itm.url)"
                                        :preview-src-list="[thumbnailImage(itm.url)]"
                                        fit="cover"
                                        :initial-index="ind"
                                        ref="previewImg"
                                    /> -->
                  <!-- <span
                    v-show="state.isHover && ind == state.current && v.id == state.currentId"
                    class="image-shaom"
                  >
                    <el-icon title="下载" @click="downloadFile(itm)"><download /></el-icon>
                  </span> -->
                </div>
                <!-- <span :title="itm.name?itm.name:itm.url">{{itm.name?itm.name:itm.url}}</span> -->
              </div>
            </div>
            <p class="container-remark">{{ v.remark }}</p>
          </template>
        </div>
        <el-empty
          v-else
          style="padding:0"
          :image-size="130"
          :description="props.data.content.cardType == 0 ? '该节点尚未开始~' : '暂无数据~'"
          :image="require('@/assets/img/empty/no_data.png')"
        />
      </div>
    </div>
    <upload-dialog :prant-msg="state.prantMsg" />
    <!-- 预览图片 -->
    <preview-image
      v-model="showViewer"
      :current="state.initialIndex"
      :src-list="state.previewList"
    />
    <!-- 视频预览 -->
    <videoPlay
      :props-src="state.options.src"
      :dialog-status="videoPlayStatus"
      @getClose="videoPlayStatus = false"
    />
  </div>
</template>

<script lang='ts' setup>
import { ElMessage } from 'element-plus'
import { defineEmits, inject, ref, defineProps, watchEffect, reactive, provide, watch, nextTick } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { thumbnailImage } from '@/components/project/projectItem/projectDetailNewData'


const emit = defineEmits(['getByData'])
const showDrawer = ref<boolean>(false)
const videoPlayStatus = ref(false)
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => false
  },
  data: {
    type: Object,
    default: () => {
    }
  }
})
const state = reactive({
  options: {},
  list: {},
  distType: [],
  previewList: [],
  initialIndex: null,
  prantMsg: {},
  isHover: false, // 鼠标动作
  current: null, // 鼠标动作当前对象下标
  currentId: null // 鼠标动作当前对象id
} as any)
const formData = reactive({
  val: {},
  company: {}
} as any)
const projectId = inject('projectId')
const dialogVisible = ref<boolean>(false)
const disabled = ref<boolean>(false)
const showViewer = ref<boolean>(false)
const pageTitle = ref<any>('')
provide('formData', formData)
provide('dialogVisible', dialogVisible)
provide('pageTitle', pageTitle)
provide('disabled', disabled)
const upload = (item: any) => {
  pageTitle.value = item.groupName
  state.prantMsg.nodeId = state.list.content.nodeId
  // state.prantMsg.uploadGroup = item.value;
  state.prantMsg.uploadName = item.groupName
  formData.val = {
    flag: 1
  }
  disabled.value = false
  dialogVisible.value = true
}

// 鼠标移入移除事件
const mouseChange = (flag: boolean, data: any, index: number, file: any) => {
  if (flag) {
    if (getFileHouzhui(file.url) == 'png' || getFileHouzhui(file.url) == 'jpeg' || getFileHouzhui(file.url) == 'jpg') {
      state.isHover = false
    } else {
      state.isHover = flag
    }
  } else {
    state.isHover = flag
  }
  state.currentId = data.id
  state.current = index
}

const getThumbnailImage = (url: any, thumbnail: any) => {
  return thumbnailImage(url)
}

const getStartVideo = (e: any) => {
  state.options.src = e
  videoPlayStatus.value = !videoPlayStatus.value
}

// 下载
const downloadFile = (data: any) => {
  // window.fetch(thumbnailImage(data.url))
  // .then((res:any) =>res.blob())
  // .then((blob:any)=>{
  //     var link = document.createElement('a')
  //     link.href = window.URL.createObjectURL(blob)
  //     link.download = data.name?data.name:data.url
  //     link.click()
  //     //释放内存
  //     window.URL.revokeObjectURL(link.href)
  // })
  window.open(thumbnailImage(data.url), '_self')
}
// 预览照片
const lookImage = (url: any) => {
  // PreviewImage(state.previewList,thumbnailImage(url))
  state.initialIndex = thumbnailImage(url)
  showViewer.value = true
}
// 预览照片
const closeViewer = () => {
  showViewer.value = false
}

// 获取上传文件字典
const getFileType = async () => {
  // await fetch({
  //     url: `/admin/dict/type/sop_upload_file_type`,
  //     method: 'get',
  //     data:formData.val
  // }).then((res: any) => {
  //     if(res.code == '0'){
  //         state.distType = res.data;
  //         // bizTaskUpload()
  //         if(state.distType.length){
  //             state.distType.forEach((v:any,i:any)=>{
  //                 bizTaskUpload(v)
  //             })
  //         }
  //     }
  // })
  state.previewList = []
  const params = {
    nodeId: state.list.content.nodeId,
    projectId: projectId
  }
  const res: any = await fetch({ url: `/order/sopupload/group/list`, method: 'get', params: params })
  if (res.code == '0') {
    state.distType = res.data
    state.distType.map((item: any) => {
      if (item.sopUploadList && item.sopUploadList.length) {
        item.sopUploadList.forEach((v: any) => {
          if (v.uploadItemList && v.uploadItemList.length) {
            v.uploadItemList.forEach((val: any) => {
              if (getFileHouzhui(val.url) == 'png' || getFileHouzhui(val.url) == 'jpeg' || getFileHouzhui(val.url) == 'jpg') {
                state.previewList.push(thumbnailImage(val.url))
              }
            })
          }
        })
      }
    })
  }
}
// 获取图片上传信息
const bizTaskUpload = async (item: any) => {
  const params = {
    nodeId: state.list.content.nodeId,
    uploadGroup: item.value,
    projectId: projectId
  }
  const res: any = await fetch({ url: `/order/sopupload/group/list`, method: 'get', params: params })
  if (res.code == '0') {
    if (state.distType.length) {
      state.distType.map((item: any) => {
        res.data.forEach((v: any) => {
          if (item.label == v.groupName) {
            item.sopUploadList = v.sopUploadList
          }
        })
      })
    }
  }
}
const deleteFile = (data: any, item: any) => {
  const objData = data
  objData.uploadItemList.forEach((v: any, i: number) => {
    if (v.url == item.url) {
      objData.uploadItemList.splice(i, 1)
    }
  })
  formData.val = Object.assign({}, objData)
  save()
}
const edit = (data: any) => {
  formData.val = Object.assign({}, data)
  pageTitle.value = data.groupName
  disabled.value = true
  dialogVisible.value = true
}
const save = async () => {
  await fetch({
    url: `/order/sopupload/${formData.val.flag == '1' ? 'create' : 'modify'}`,
    method: 'post',
    data: formData.val
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('保存成功')
      getFileType()
      emit('getByData')
      dialogVisible.value = false
    }
  })
}
provide('save', save)

const getFileHouzhui = (type: any) => {
  if (type) {
    return (type.split('.')[1]).toLowerCase()
  }
  return ''
}
const json = JSON as any

watchEffect(() => {
  showDrawer.value = props.modelValue
  state.list = props.data
})

watch(() => [props.data, showDrawer.value], (newv: any) => {
  if (newv[0] || newv[1]) {
    nextTick(() => {
      getFileType()
    })
  }
}, { deep: true, immediate: true })
</script>

<style scoped lang="less">
.main {
  width: 100%;
  height: 100%;
}

.container {
  width: 100%;
  height: 100%;
  overflow: auto;

  .container-header {
    margin: 0 4rem;
    padding-bottom: .5rem;
    border-bottom: 1px solid #F3F4F8;

    &:last-child {
      margin-bottom: 2rem;
      border-bottom: none;
    }

    .container-info {
      padding: 2rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.8rem;
      color: #1A1A1A;
      font-weight: 400;
    }

    .container-user {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .img-user {
        display: flex;
        align-items: center;

        img {
          height: 2.4rem;
          width: 2.4rem;
          border-radius: 50%;
          margin-right: 1rem;
        }

        span {
          i {
            font-style: normal;
            color: #0969DA;
            margin-left: 1rem;

            &:nth-child(2) {
              color: #909399;
            }
          }
        }
      }

      .el-icon {
        color: #409EFF;
        cursor: pointer;
        font-size: 1.6rem;
      }
    }

    .container-remark {
      color: #909399;
      margin: 0 0 2rem 4.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #F3F4F8;
    }

    .container-img {
      margin-left: 4.5rem;
      display: flex;
      flex-flow: row wrap;
      margin-top: 2rem;

      .container-img_content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // margin: 1rem 0;
        margin-right: 2rem;
        margin-bottom: 2rem;

        .image {
          width: 12rem;
          height: 12rem;
          border-radius: .6rem;
          box-sizing: border-box;
          background: #F5F7FA;
          position: relative;
          .video-box{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);

          }
          .el-image {
            width: 12rem;
            height: 12rem;
            border-radius: .6rem;
          }

          .image-shaom {
            position: absolute;
            width: 100%;
            height: calc(100% - 1rem);
            border-radius: .6rem;
            left: 0;
            background: rgba(9, 105, 218, 0.2);
            position: relative;

            &:hover {
              opacity: 1;
            }

            .el-icon {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: #fff;
              font-size: 2.4rem;
              background: #fff;
              border-radius: 50%;
              cursor: pointer;
              color: #409EFF;
              padding: 1rem;
            }
          }

          img {
            width: 100%;
            height: 100%;
            border-radius: .6rem;
            object-fit: cover;

            &.image-only {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 50%;
              height: 50%;
            }
          }
        }

        span {
          display: inline-block;
          text-align: center;
          width: 100%;
          padding-top: 1rem;
          color: #4C4C4C;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }
      }
    }
  }
}

:deep(.custom-dialog) {
  .el-dialog__body {
    padding: 2rem;
    box-sizing: border-box;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
  }
}
</style>
