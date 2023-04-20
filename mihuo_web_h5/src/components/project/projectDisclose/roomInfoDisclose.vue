<template>
  <div class="room">
    <div class="room-info">
      <div class="part">
        <div class="part-name">交底内容: {{ props.data.discloseTitle }}</div>
        <div class="part-name">问卷名称: {{ props.data?.answer?.surveyName }}</div>
        <div v-if="props.data.remark" class="part-desc">备注:{{ props.data.remark }}</div>
      </div>
      <div v-for="(item, i) in props.data.toParseContent" :key="i">
        <div v-for="(item2, index) in item.surveyTemplateQuesDTOList" :key="index" class="room-info_content">
          <div>{{ 1 + index }}、</div>
          <div>
            <p>{{ item2.quesName }}</p>
            <div class="room-info_remark">
              <p>{{ item2.quesDesc }}</p>
              <div v-if="[1, 2].includes(Number(item2.quesType))" class="item-answers">
                <div
                  v-if="[1, 2].includes(Number(item2.quesType)) && (item2.supplementAnswerText || (item2.supplementAnswerFile && item2.supplementAnswerFile !== '[]'))"
                  class="item-answers-other"
                >
                  <div class="room-info_tgs">
                    <div v-for="(item4, index4) in JSON.parse(item2.supplementAnswerFile)" :key="index4">
                      <img
                        v-if="item4.type == 'img'"
                        :src="$getUrl.getPicUrl(item4.url)"
                        @click="lookImage(item2.supplementAnswerFile, item4.url)"
                      >
                      <audioPlay v-if="item4.type == 'audio'" :src="$getUrl.getPicUrl(item4.url)" />
                    </div>
                  </div>
                  <el-tag v-if="item2.supplementAnswerText" class="tag" round>
                    {{ item2.supplementAnswerText }}
                  </el-tag>
                </div>
                <div class="select-answers">
                  <!-- 单选答案 -->
                  <div v-if="[1].includes(Number(item2.quesType))" class="select-answers-text">
                    <el-tag v-if="item2.answer" class="tag" round>
                      {{ item2.answer }}
                    </el-tag>
                  </div>
                  <!-- 单选的补充说明 -->
                  <div
                    v-for="(item3, index3) in item2.surveyTemplateOptionDTOList"
                    :key="index3"
                    class="radio-item_contain"
                  >
                    <!-- 多选答案 -->
                    <div v-if="[2].includes(Number(item2.quesType)) && item3.checked" class="select-answers-text">
                      <el-tag v-if="item3.optionName" class="tag" round>
                        {{ item3.optionName }}
                      </el-tag>
                    </div>
                    <div v-if="item3.radioName == item2.answer || item3.checked" class="radio-item">
                      <div
                        v-if="item3.supplementAnswerFile && JSON.parse(item3.supplementAnswerFile).length > 0"
                        class="room-info_tgs img-min"
                      >
                        <div v-for="(item4, index4) in JSON.parse(item3.supplementAnswerFile)" :key="index4">
                          <img
                            v-if="item4.type == 'img'"
                            :src="$getUrl.getPicUrl(item4.url)"
                            @click="lookImage(item3.supplementAnswerFile, item4.url)"
                          >
                          <audioPlay v-if="item4.type == 'audio'" :src="$getUrl.getPicUrl(item4.url)" />
                        </div>
                      </div>
                      <text class="radio-item_desc">{{ item3.supplementAnswerText }}</text>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 答案为文本输入、补充为文件输入 -->
              <div v-if="[3].includes(Number(item2.quesType))" class="other-answers">
                <div class="room-info_tgs">
                  <div v-for="(item3, index3) in JSON.parse(item2.supplementAnswerFile)" :key="index3">
                    <img
                      v-if="item3.type == 'img'"
                      :src="$getUrl.getPicUrl(item3.url)"
                      @click="lookImage(item2.supplementAnswerFile, item3.url)"
                    >
                    <audioPlay v-if="item3.type == 'audio'" :src="$getUrl.getPicUrl(item3.url)" />
                  </div>
                </div>
                <el-tag v-if="item2.quesType == 3 && item2.answer" class="tag" round>
                  {{ item2.answer }}
                </el-tag>
              </div>
              <!-- 答案为文件输入、补充为文本输入 -->
              <div v-if="[4].includes(Number(item2.quesType))" class="other-answers">
                <div class="room-info_tgs">
                  <div v-for="(item3, index3) in JSON.parse(item2.answer)" :key="index3">
                    <img
                      v-if="item3.type == 'img'"
                      :src="$getUrl.getPicUrl(item3.url)"
                      @click="lookImage(item2.answer, item3.url)"
                    >
                    <audioPlay v-if="item3.type == 'audio'" :src="$getUrl.getPicUrl(item3.url)" />
                  </div>
                </div>
                <el-tag v-if="item2.quesType == 3 && item2.supplementAnswerText" class="tag" round>
                  {{ item2.supplementAnswerText }}
                </el-tag>
              </div>
              <!-- <template v-if="item2.quesType != 4 && item2.answer">
                <el-tag v-for="(item3, i) in item2.answer.split(',')" :key="i" class="tag" round>
                  {{ item3 }}
                </el-tag>
              </template>
              <div v-if="item2.quesType == 4 && item2.answer" class="room-info_tgs">
                <div v-for="(item3, index3) in JSON.parse(item2.answer)" :key="index3">
                  <img v-if="item3.type == 'img'" :src="$getUrl.getPicUrl(item3.url)">
                  <audioPlay v-if="item3.type == 'audio'" :src="$getUrl.getPicUrl(item3.url)" />
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <el-empty
      v-else
      :image-size="130"
      description="暂无数据~"
      :image="require('@/assets/img/empty/no_data.png')"
    /> -->

    <!-- 预览图片 -->
    <preview-image v-model="showViewer" :current="state.initialIndex" :src-list="state.previewList" />
  </div>
</template>

<script lang='ts' setup>
import { defineProps, onMounted, ref, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { thumbnailImage } from '@/components/project/projectItem/projectDetailNewData'
import { log } from 'console'
const props = defineProps({
  data: {
    type: Object,
    default: () => { }
  }
})
const showViewer = ref<boolean>(false)
const state = reactive({
  previewList: [],
  initialIndex: null
} as any)
const surveyTemplate = ref<any>([])
// const surveyTemplate = ref<any>([])
// quesType: '', // 1 单选 2多选 3填空 4文件
watchEffect(() => {

})
onMounted(() => {
})

const lookImage = (urlList: any, url: any) => {
  const list = JSON.parse(urlList)
  const result: any = []
  list.forEach((el: any) => {
    if (el.type === 'img') {
      result.push(thumbnailImage(el.url))
    }
  })
  state.initialIndex = thumbnailImage(url)
  state.previewList = result
  showViewer.value = true
}
</script>

<style scoped lang="less">
.room {
  margin-bottom: 2rem;

  .room-info {
    .part {
      border-bottom: solid 1px #F3F4F8;
      padding: 20px 0 12px 0;

      .part-name {
        font-size: 12px;
        font-weight: bold;
        color: #1A1A1A;
        margin-top: 12px;
      }

      .part-desc {
        font-size: 12px;
        color: #909399;
        margin-top: 12px;
      }
    }

    .room-row {
      border-bottom: 1px solid #F3F4F8;
      padding: 1rem 0;

      p {
        color: #1A1A1A;
        font-size: 1.4rem;
        font-weight: bold;
        padding-bottom: 1rem;
      }

      span {
        color: #909399;
        font-size: 1.4rem;
      }
    }

    .room-info_content {
      padding: 2rem 0;
      border-bottom: 1px solid #F3F4F8;
      display: flex;

      p {
        color: #303133;
        font-size: 14px;
        font-weight: 400;
      }

      .room-info_remark {
        //margin-left: 2.5rem;
        margin-top: 1rem;
        font-size: 12px;

        p {
          color: #909399;
          margin: 1rem 0;
        }

        .tag {
          margin-right: .5rem
        }

        .room-info_tgs {
          margin-top: 1rem;
          display: flex;
          flex-flow: row wrap;
          // margin-bottom: 1rem;

          span {
            color: #0969DA;
            background: #ECF5FF;
            padding: .5rem 1rem;
            border-radius: 1.2rem;
            margin-right: 1rem;
          }

          img {
            height: 10rem;
            width: 10rem;
            border-radius: 1rem;
            margin: 0 1.5rem 0.5rem 0;
          }
        }

        .img-min {
          img {
            height: 8rem;
            width: 8rem;
          }
        }

        .item-answers {

          .radio-item_contain {

            .radio-item {
              margin-bottom: 1.5rem;
            }
          }

          .item-answers-other {
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #f5f5f5;
          }

          .select-answers {
            padding: 1rem 2rem 0rem 0rem;

            .radio-item_desc {
              color: #999999;
              font-size: 1.2rem;
            }

            .radio-item_desc {
              margin-top: 1rem;
              display: inline-block;
            }
          }
        }

        .desc-item-text {
          color: #303133;
          font-size: 1.4rem;
          display: inline-block;
        }
      }
    }
  }
}
</style>
