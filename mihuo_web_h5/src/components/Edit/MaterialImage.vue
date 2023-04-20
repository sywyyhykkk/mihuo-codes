<template>
  <!-- Banner & Image 通用组件 -->
  <div class="image-content">
    <p class="desc">添加图片 (最多{{ len }}张，可拖动排序）</p>
    <vuedraggable
      v-if="list.listdata && list.listdata.length > 0"
      v-model="list.listdata"
      tag="ul"
      draggable="li"
      class="image-list"
      :class="{ disable: data.tabType == 2 }"
    >
      <li v-for="(item, index) in list.listdata" :key="index">
        <div class="l-info">
          <p>
            <span class="sort">排序{{ index + 1 }}</span>
          </p>
          <p>
            <span>名称：</span>
            <span class="text">{{ item && item.name }}</span>
          </p>
          <p>
            <span>链接：</span>
            <el-tooltip
              v-if="item.link"
              effect="dark"
              :content="item.link"
              placement="top"
            >
              <span class="text" @click="urlPopup(index, item.link)">{{
                item.link
              }}</span>
            </el-tooltip>
            <span v-else class="link" @click="urlPopup(index)"
              >请输入跳转链接</span
            >
          </p>
        </div>
        <div class="r-image">
          <span class="el-icon-close" @click="removeImage(index)" />
          <div class="image-box">
            <img :src="item && item.url" />
            <span class="el-icon-edit-outline" @click="addImage(index)" />
          </div>
        </div>
      </li>
    </vuedraggable>
    <template v-if="list.listdata && list.listdata.length < len">
      <el-button
        type="primary"
        class="add-image"
        @click="addImage(null)"
        icon="plus"
      >
        添加图片
      </el-button>
      <p class="size">（建议尺寸：{{ size }}）</p>
    </template>
    <el-upload
      ref="uploadBox"
      :http-request="upload"
      :show-file-list="false"
      multiple
      action
      style="display: none"
    />
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="show"
      title="请填写图片跳转链接"
      @close="close"
    >
      <el-form label-width="100px">
        <el-form-item label="跳转链接">
          <el-input v-model="url" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="confirm()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, ref, markRaw } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { fetch } from '_@/axios-config/axios'
import { imageGlobal } from '@/global'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'MaterialImage',
  components: {
    vuedraggable: VueDraggableNext
  },
  props: ['data'],
  setup(props, context) {
    console.log(props)
    const list = reactive(props.data)
    let url = ref('')
    let index = ref(0)
    let show = ref(false)
    let imageIndex = ref(0)
    const uploadBox = ref(null)

    const size = computed(() => {
      return list.type === 'images' ? '750*750' : '750*400'
    })
    const len = computed(() => {
      return list.type === 'images' ? 8 : 10
    })
    const close = () => {
      show = false
      url = ''
    }
    const confirm = () => {
      list['data'][index]['link'] = url
      close()
    }
    const urlPopup = (indexNum) => {
      show = true
      index = indexNum
      // eslint-disable-next-line no-undef
      url = link
    }
    const removeImage = (index) => {
      list.listdata.splice(index, 1)
    }
    const addImage = (index) => {
      imageIndex = index
      uploadBox.value.$refs.uploadRef.$refs.inputRef.click()
    }
    const upload = (params) => {
      console.log(list.listdata)
      const currenlen = list.listdata ? 0 : list.listdata.length
      if (currenlen >= len.value) {
        this.$message.error(`最多添加${this.len}张图片!`)
        return
      }
      const file = params.file
      const fileType = file.type
      const verifyList = [
        {
          text: '只能上传图片格式png、jpg、gif!',
          result: fileType.indexOf('image') != -1
        },
        {
          text: '只能上传大小小于5M',
          result: file.size / 1024 / 1024 < 5
        }
      ]

      for (const item of verifyList) {
        if (!item.result) {
          this.$message.error(item.text)
          return
        }
      }

      const form = new FormData()
      form.append('file', file)
      form.append('clientType', 'multipart/form-data')

      const index = imageIndex

      fetch({ url: '/admin/sys-file/upload', method: 'post', data: form }).then(
        (res) => {
          if (res.data.fileName) {
            console.log(res.data.fileName)
            const data = {
              name: res.data.fileName,
              url: res.data.url
            }
            if (index !== null) {
              list.listdata[index] = data
            } else {
              list.listdata.push(data)
            }
            ElMessage.success('上传成功')
          } else {
            ElMessage.error('上传失败')
          }
        }
      )
    }
    return {
      list,
      url,
      index,
      show,
      imageIndex,
      close,
      confirm,
      urlPopup,
      removeImage,
      addImage,
      uploadBox,
      size,
      len,
      upload
    }
  }
})
</script>

<style lang="less" scoped>
.image-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  .desc {
    text-align: center;
    font-size: 12px;
    color: #666;
    margin: 18px 0;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ddd;
  }

  .size {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-bottom: 0;
  }

  .add-image {
    width: calc(100% - 20px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 10px;
    margin-top: 10px;
  }

  .image-list {
    margin: 0;
    padding: 0 10px;
    overflow: auto;

    &::-webkit-scrollbar-thumb {
      background: #dbdbdb;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
      background: #f6f6f6;
      border-radius: 10px;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    li {
      list-style: none;
      background: #f7f8f9;
      border-radius: 4px;
      padding: 6px 14px 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      &.disable div {
        pointer-events: none;
        user-select: none;
      }

      .l-info {
        font-size: 12px;
        padding-top: 8px;
        width: calc(100% - 70px);

        p {
          margin: 12px 0 0;
          white-space: nowrap;
          overflow: hidden;
          display: flex;

          .link {
            color: #1b8bff;
            cursor: pointer;
          }

          .text {
            white-space: nowrap;
            text-align: -webkit-auto;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

      .r-image {
        text-align: right;

        .el-icon-close {
          color: #999;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
          cursor: pointer;

          &:hover {
            color: red;
          }
        }

        .image-box {
          width: 70px;
          height: 70px;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: all 0.3s;
          }

          span {
            position: absolute;
            top: 50%;
            left: 50%;
            color: #fff;
            transform: translate(-50%, -50%);
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s;
          }

          img {
            max-width: 100%;
          }

          &:hover {
            &::before,
            span {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
</style>
