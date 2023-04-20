<template>
  <div class="drawer-data" :style="{ width: props.width }">
    <div v-for="(item, index) in state.partList" :key="index" class="paragraph">
      <div class="paragraph-name">{{ item.partName }}</div>
      <div class="paragraph-desc">{{ item.partDesc }}</div>
      <div v-for="(item2,index2) in item.surveyTemplateQuesDTOList" :key="index2" class="questions">
        <div class="questions-name">{{ index2 + 1 }}、</div>
        <div style="width: 100%">
          <div class="questions-title">
            <div class="questions-name">{{ item2.quesName }}</div>
            <div v-if="props.disabled" class="questions-type">{{ getQuesType(item2.quesType) }}</div>
          </div>
          <div class="questions-desc">{{ item2.quesDesc }}</div>
          <!-- 问题-允许补充说明 -->
          <el-input
            v-if="item2.allowAddDescFlag === '1'"
            v-model="item2.supplementAnswerText"
            style="margin-top: 1rem"
            :disabled="props.disabled"
            placeholder="请输入问题补充说明"
          />
          <!-- 单选 -->
          <div v-if="item2.quesType === '1'" class="questions-center">
            <el-button style="margin-top: 1rem" size="small" @click="cancelSelect(item2)">取消选择</el-button>
            <div
              v-for="(item3, index3) in item2.surveyTemplateOptionDTOList"
              :key="index3"
            >
              <el-radio
                v-model="item2.answer"
                class="option-check"
                :disabled="props.disabled"
                :label="item3.optionName"
              />
              <!-- 选项-允许补充说明 -->
              <!-- 选中当前选项时可以添加补充说明 -->
              <el-input
                v-if="item3.allowAddDescFlag === '1' && item2.answer === item3.optionName"
                v-model="item3.supplementAnswerText"
                :disabled="props.disabled"
                placeholder="请输入选项补充说明"
              />
              <uploadFile
                v-if="item3.allowUploadFileFlag === '1' && item2.answer === item3.optionName"
                v-model="item3.supplementAnswerFile"
                :is-json="true"
                :disabled="props.disabled"
              />
            </div>
          </div>
          <!-- 多选 -->
          <div v-if="item2.quesType === '2'" class="questions-center">
            <div v-for="(item3, idx) in item2.surveyTemplateOptionDTOList" :key="idx">
              <div>
                <el-checkbox
                  v-model="item3.checked"
                  :disabled="props.disabled"
                  :label="item3.optionName"
                />
              </div>
              <!-- 选项-允许补充说明 -->
              <!-- 选中当前选项时可以添加补充说明 -->
              <el-input
                v-if="item3.allowAddDescFlag === '1' && item3.checked"
                v-model="item3.supplementAnswerText"
                :disabled="props.disabled"
                placeholder="请输入选项补充说明"
              />
              <uploadFile
                v-if="item3.allowUploadFileFlag === '1' && item3.checked"
                v-model="item3.supplementAnswerFile"
                :is-json="true"
                :disabled="props.disabled"
                style="margin-top: 1rem"
              />
            </div>
          </div>
          <!-- 文本 -->
          <div v-if="item2.quesType === '3'" class="questions-center" style="margin-top: 1.8rem">
            <el-input
              v-model="item2.answer"
              :disabled="props.disabled"
              type="textarea"
            />
          </div>
          <!-- 文件 -->
          <div v-if="item2.quesType === '4'" class="questions-center" style="margin-top: 1.8rem">
            <uploadFile v-model="item2.answer" :is-json="true" :disabled="props.disabled" />
          </div>
        </div>
      </div>
      <el-empty
        v-if="state.partList.length === 0"
        :image-size="218"
        description="暂未配置问卷~"
        :image="require('@/assets/img/empty/no_data.png')"
      />
    </div>
    <div v-if="!props.disabled && props.isShowButton" class="drawer-header">
      <div class="right">
        <el-button
          type="primary"
          @click="saveAnswer"
        >保存答案</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watchEffect } from 'vue'
import { getTemplateDetailsById } from '_@/api/basicConfig'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  surveyId: { // 问卷id
    type: String || Number,
    default: '0'
  },
  surveyName: { // 问卷名称
    type: String,
    default: ''
  },
  data: { // 问卷内容
    type: String,
    default: ''
  },
  disabled: { // 是否禁用
    type: Boolean,
    default: true
  },
  type: { // 类型product_measure->材料测量,order_disclose->开工交底,room_measure->量房
    type: String,
    default: ''
  },
  surveyType: { // 问卷类型 checkRoom：验房 checkAccept 验收
    type: String,
    default: ''
  },
  isShowButton: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '100%'
  },
  reportTime: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['saveSurvey', 'deleteReport'])
const drawerShow = ref<boolean>(false)
const state = reactive({
  surveyName: '',
  partList: [] as any
})

const getQuesType = (val: any) => {
  if (val === '1') {
    return '单选'
  }
  if (val === '2') {
    return '多选'
  }
  if (val === '3') {
    return '文本'
  }
  if (val === '4') {
    return '文件'
  }
}

// 获取问卷信息
const getSurveyData = () => {
  getTemplateDetailsById({ id: props.surveyId }).then((res) => {
    if (res.data) {
      state.surveyName = res.data.surveyName
      state.partList = JSON.parse(JSON.stringify(res.data.surveyTemplatePartDTOList))
    }
  })
}

watchEffect(() => {
  drawerShow.value = true
  state.partList = []
  setTimeout(() => {
    if (drawerShow.value) {
      if (props.data.length === 0 && props.surveyId) {
        getSurveyData()
      } else {
        state.surveyName = props.surveyName
        const data = JSON.parse(props.data)
        state.partList = data.surveyTemplatePartDTOList
      }
    }
  }, 200)
})

const saveAnswer = () => {
  emit('saveSurvey', JSON.parse(JSON.stringify(state.partList)))
}

// 文件上传
const handleChange = (file: any, fileList: any) => {
  console.log(file)
}

// 上传至服务器
const uploadFileToServer = async (file: any) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res: any = await fetch({
      url: '/admin/sys-file/upload',
      method: 'post',
      headers: {
        'content-type': 'multipart/form-data'
      },
      data: formData
    })
    if (res.code === 0) {
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}

// 单选题取消选择
const cancelSelect = (item: any) => {
  item.answer = ''
}
</script>

<style scoped lang="less">
.drawer-data {
  padding: 2rem 2rem 0 2rem;

  .drawer-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .right {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .drawer-footer {
    height: 68px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: solid 1px #F3F4F8;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    z-index: 2000;

    .footer-button {
      height: 30px;
      border-radius: 15px;
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }

  .paragraph {
    border-bottom: solid 1px #F3F4F8;
    margin-bottom: 8rem;

    .questions {
      border-top: 1px dashed #F3F4F8;
      padding: 2rem 0;
      display: flex;

      .questions-title {
        display: flex;
        justify-content: space-between;
        height: 24px;
      }

      .questions-type {
        height: 24px;
        background: #ECF5FF;
        border-radius: 12px;
        line-height: 24px;
        padding: 0 9px;
        font-size: 12px;
        font-weight: 400;
        color: #0969DA;
        margin-left: 20px;
        min-width: 30px;
      }

      .questions-name {
        font-size: 14px;
        font-weight: 400;
        color: #303133;
        line-height: 20px;
      }

      .questions-desc {
        font-size: 12px;
        font-weight: 400;
        color: #909399;
        margin-top: 0.7rem;
        line-height: 20px;
      }

      .questions-center {
        .option-check {
          min-width: 40%;
          margin-top: 1.8rem;
        }
      }
    }

    .paragraph-name {
      font-size: 12px;
      font-weight: bold;
      color: #1A1A1A;
      margin-top: 30px;
      margin-bottom: 12px;
    }

    .paragraph-desc {
      font-size: 12px;
      font-weight: 400;
      color: #909399;
      margin-bottom: 12px;
      line-height: 20px;
    }
  }
}

</style>
