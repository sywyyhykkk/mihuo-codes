<template>
  <div class="pdf-container" v-if="props.data.data">
    <img
      src="https://www.51mihuo.com/static/images/mihuo-logo-dark.png"
      class="mihuo-logo"
    />
    <img
      src="https://www.51mihuo.com/static/images/mihuo-applet.png"
      class="mihuo-applet"
    />
    <h2 id="title" class="main-title">
      {{ props.data.data.answer.surveyName }}
    </h2>
    <div class="header-info flex-center" style="margin-top: 25px">
      <div>
        <span id="label">地址：</span
        ><span id="address">
          {{ props.data.data.discloseAddress }}
        </span>
      </div>
      <div v-if="props.data.data.execPersonName">
        <span id="name">
          报告人：{{ props.data.data.execPersonName }}-{{
            props.data.data.execPersonTel || 17308805508
          }}({{ props.data.data.execSkillName }})
        </span>
      </div>
    </div>
    <div class="disclosure-table" v-if="props.data.data.answer">
      <div
        id="disclosure-item"
        v-for="(item, index) in getAnswerContentArr(
          props.data.data.answer.answerContent
        )"
        :key="index"
      >
        <div id="disclosure-header">
          {{ item.partName }}
        </div>
        <div
          id="disclosure-table"
          v-if="
            item.surveyTemplateQuesDTOList &&
            item.surveyTemplateQuesDTOList.length
          "
        >
          <div
            id="disclosure-table-info"
            v-for="(surveyItem, index2) in item.surveyTemplateQuesDTOList"
            :key="index2"
          >
            <div class="grid-container">
              <div id="disclosure-table-info-1" class="flex-center">
                {{ index2 + 1 }}
              </div>
              <div id="disclosure-table-info-2" class="flex-center">
                {{ surveyItem.quesName }}
              </div>
              <div
                id="disclosure-table-info-des"
                v-if="surveyItem.quesNote"
                class="flex-center"
                v-html="
                  surveyItem.quesNote
                    .replace(/。/g, '。<br />')
                    .replace(/：/g, '：<br />')
                "
              ></div>
            </div>
            <!-- 问题补充图片 问题答案为上传类型时不显示 -->
            <div
              id="disclosure-table-info-3"
              v-if="
                surveyItem.supplementAnswerFile &&
                getAnswerImage(surveyItem.supplementAnswerFile).length &&
                surveyItem.quesType !== '4'
              "
              class="flex-center img-container bg-color"
              style="width: 95%; padding-bottom: 0 !important"
            >
              <img
                v-for="(img, imgIndex) in getAnswerImage(
                  surveyItem.supplementAnswerFile
                )"
                :key="imgIndex"
                :src="img.url || img"
                class="item-img"
              />
            </div>
            <!-- 问题补充说明 问题答案为文本类型时不显示 -->
            <div
              id="disclosure-table-info-3"
              v-if="
                surveyItem.supplementAnswerText && surveyItem.quesType !== '3'
              "
              class="bg-color"
            >
              <span style="padding-left: 5%; font-size: 14px; color: #808080">
                {{ surveyItem.supplementAnswerText }}
              </span>
            </div>
            <!-- 单选类型 -->
            <div
              v-if="surveyItem.quesType === '1'"
              class="bg-color"
              style="
                border-top: 1px solid #d9d9d9;
                padding-bottom: 0 !important;
              "
            >
              <div
                v-for="(
                  option, optionIndex
                ) in surveyItem.surveyTemplateOptionDTOList"
                :key="optionIndex"
                class="option-container"
                :style="{
                  display:
                    option.optionName === option.radioName ? 'flex' : 'none'
                }"
              >
                <div
                  class="answer-option flex-center"
                  v-if="option.optionName === option.radioName"
                >
                  {{ option.optionName }}
                </div>
                <div class="option-images">
                  <div
                    class="flex-center img-container"
                    style="
                      padding-left: 0 !important;
                      padding-bottom: 5px !important;
                    "
                  >
                    <img
                      v-for="(img, imgIndex) in getAnswerImage(
                        option.supplementAnswerFile
                      )"
                      :key="imgIndex"
                      :src="img || img.url"
                      class="item-img-s"
                    />
                  </div>
                  <span
                    style="font-size: 14px; color: #808080"
                    v-if="option.supplementAnswerText"
                  >
                    {{ option.supplementAnswerText }}
                  </span>
                </div>
              </div>
            </div>
            <!-- 多选类型 -->
            <div
              v-if="surveyItem.quesType === '2'"
              class="bg-color"
              style="
                border-top: 1px solid #d9d9d9;
                padding-bottom: 0 !important;
              "
            >
              <div
                v-for="(
                  option, optionIndex
                ) in surveyItem.surveyTemplateOptionDTOList"
                :key="optionIndex"
                class="option-container"
                :style="{
                  display: option.checked ? 'flex' : 'none'
                }"
              >
                <div class="answer-option flex-center" v-if="option.checked">
                  {{ option.optionName }}
                </div>
                <div class="option-images">
                  <div
                    class="flex-center img-container"
                    style="
                      padding-left: 0 !important;
                      padding-bottom: 5px !important;
                    "
                  >
                    <img
                      v-for="(img, imgIndex) in getAnswerImage(
                        option.supplementAnswerFile
                      )"
                      :key="imgIndex"
                      :src="img.url || img"
                      class="item-img-s"
                    />
                  </div>
                  <span
                    v-if="option.supplementAnswerText"
                    style="font-size: 14px; color: #808080"
                  >
                    {{ option.supplementAnswerText }}
                  </span>
                </div>
              </div>
            </div>
            <!-- 文本类型 -->
            <div
              v-else-if="surveyItem.quesType === '3' && surveyItem.answer"
              class="flex-center bg-color"
              style="padding-top: 8px"
            >
              <span style="padding-left: 5%; font-size: 14px">
                {{ surveyItem.answer }}
              </span>
            </div>
            <!-- 上传类型 -->
            <div
              v-else-if="
                surveyItem.quesType === '4' && surveyItem.answer !== '[]'
              "
              class="flex-center img-container bg-color"
              style="width: 95%"
            >
              <img
                v-for="(img, imgIndex) in getAnswerImage(surveyItem.answer)"
                :key="imgIndex"
                :src="img || img.url"
                class="item-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-center mihuo-footer">
      <div class="mihuo-text flex-center">自装支持：觅活科技</div>
      <div class="download-time">报告生成日期：{{ getCurrentTime() }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {
        data: {}
      }
    }
  },
  isShowLog: {
    type: Boolean,
    default: false
  }
})

const getAnswerContentArr = (jsonStr: string) => {
  if (!jsonStr) return []
  const arr = JSON.parse(jsonStr)
  return arr
}

const getCurrentTime = () => {
  dayjs.extend(utc)
  dayjs.extend(timezone)

  return dayjs()
    .locale('zh-cn')
    .tz('Asia/Shanghai')
    .format('YYYY-MM-DD HH:mm:ss')
}

console.log('------------当前node环境------------', process.env.NODE_ENV)
const config = useRuntimeConfig()
const IMAGE_URL = config.public.IMAGE_URL
const IMAGE_THUMBNAIL =
  '?x-image-process=image/resize,m_fixed,w_100/marker,u_plus'

console.log('------------文件服务器地址------------', IMAGE_URL)

const getAnswerImage = (jsonStr: string) => {
  if (!jsonStr) return []
  const arr = JSON.parse(jsonStr).map(
    (item: any) =>
      (item.url =
        item.type === 'img'
          ? IMAGE_URL + item.url.replace(IMAGE_URL, '') + IMAGE_THUMBNAIL
          : '')
  )
  return arr
}

if (props.isShowLog) {
  console.log('-------------交底报告-------------', props.data.data)
}
</script>

<style scoped>
.disclosure-table {
  width: 100%;
  height: max-content;
  border: 1px #cccccc solid;
  border-bottom: none;
  margin-top: 5px;
}

#disclosure-header {
  width: calc(100% - 20px);
  height: 40px;
  background-color: #e5e5e5;
  line-height: 40px;
  font-weight: bold;
  font-size: 16px;
  padding: 0 10px;
  border-left: 1px #d9d9d9 solid;
  border-right: 1px #d9d9d9 solid;
}

#disclosure-table-info {
  width: 100%;
  min-height: 20px;
  height: max-content;
  border-bottom: 1px #d9d9d9 solid;
}

.grid-container {
  display: grid;
  grid-template-columns: 5% 40% 50%;
  grid-template-rows: auto;
  grid-gap: 0px 0px;
}

#disclosure-table-info-1 {
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  justify-content: center;
  padding: 10px 0;
}

#disclosure-table-info-2 {
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  padding-left: 4px;
  border-left: 1px dashed #e5e5e5;
  padding: 15px 0 15px 4px;
}

#disclosure-table-info-des {
  line-height: 20px;
  font-size: 12px;
  color: #808080;
  padding: 10px calc(5% + 2px);
  border-left: 1px dashed #e5e5e5;
}

#disclosure-table-info-3 {
  width: 100%;
  height: max-content;
  min-height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  padding: 10px 0 10px 0;
  color: #404040;
}

#disclosure-standard-item {
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #a8a8a8;
  border-right: 1px #d9d9d9 solid;
  border-bottom: 1px #d9d9d9 solid;
}

#disclosure-standard-item-content {
  width: calc(67% - 0.5px);
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #a8a8a8;
  border-right: 1px #d9d9d9 solid;
  text-align: left;
  padding-left: 4px;
}

#disclosure-standard-item-status {
  width: calc(100% - 67% + 2.5px);
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
}

.img-container {
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 20px;
  padding-left: 5% !important;
}

.item-img {
  width: 100px;
  height: 100px;
}

.item-img-s {
  width: 60px;
  height: 60px;
}

.bg-color {
  width: 100%;
  background-color: #f6f6f6;
  padding-bottom: 8px;
}

.option-container {
  width: 100%;
  border-bottom: 1px #e5e5e5 dashed;
}

.option-container:last-child {
  border-bottom: none;
}

.answer-option {
  width: calc(30% - 30px);
  margin-left: 30px;
  font-size: 14px;
  font-weight: 500;
  justify-content: center;
  padding: 20px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}

.option-images {
  width: 70%;
  color: #a6a6a6;
  padding: 10px;
}
</style>
