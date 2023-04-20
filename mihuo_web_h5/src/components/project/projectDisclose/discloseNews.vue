<template>
  <div class="disclose">
    <div
      v-if="
        noticeData &&
          noticeData.ccPersons &&
          noticeData.ccPersons.length
      "
    >
      <div class="disclose-header">
        <div class="disclose-header_user">
          <div
            style="
                            display: flex;
                            align-items: center;
                            flex-wrap: nowrap;
                        "
          >
            <avatarImg
              v-if="noticeData.createBy"
              :styles="{ width: '3.6rem', height: '3.6rem' }"
              :avatar-id="noticeData.createBy"
            />
            <i>{{ noticeData.notifyTitle }}</i>
            <div class="disclose-header_img">
              <avatarImg
                v-for="(item, index) in noticeData.ccPersons"
                :key="index"
                :styles="{
                  height: '2.2rem',
                  width: '2.2rem'
                }"
                :avatar-id="item.handleUserId"
              />
            </div>
          </div>
          <p class="disclose-header_remark">
            {{ noticeData.notifyContent }}
          </p>
        </div>
        <look-dropdown
          v-model="showPopover"
          :title="noticeData.notifyTitle"
          :data="noticeData"
        >
          <template #dropdown>
            <div
              class="disclose-header_btn"
              @click="showPopover = true"
            >
              查看
            </div>
          </template>
        </look-dropdown>
      </div>
    </div>
    <el-empty
      v-else
      class="empty"
      description="暂无交底通知~"
      :image-size="20"
      :image="require('@/assets/img/empty/no_data.png')"
    />
    <div class="template-disclose">
      <div class="disclose-main">
        <div v-if="executeInfo && executeInfo.executeUserId">
          <div class="col">
            <span>交底日期</span>
            <span>{{
              executeInfo.expectFinishTime &&
                executeInfo.expectFinishTime.slice(0, 16)
            }}</span>
          </div>
          <div v-if="executeInfo.executeUserId" class="col">
            <span style="padding-left: 1.5rem">交底人</span>
            <span>
              <avatarImg
                :styles="{
                  width: '2.4rem',
                  height: '2.4rem',
                  marginRight: '1rem'
                }"
                :avatar-id="executeInfo.executeUserId"
              />
              <span>{{ executeInfo.executePersonName }}</span>
              <i>{{ executeInfo.executeSkillName }}</i>
            </span>
          </div>
        </div>
        <div v-if="surveyTemplate && surveyTemplate.id">
          <div class="col">
            <el-button
              type="primary"
              :loading="isLoading"
              @click="downloadReport"
            >下载报告</el-button>
          </div>
          <!-- 交底内容 -->
          <room-info-disclose
            :data="surveyTemplate"
          />
        </div>
      </div>
      <el-empty
        v-if="!executeInfo.executeUserId && !surveyTemplate.id"
        :image-size="130"
        :description="
          props.data.cardType == 0
            ? '该节点尚未开始~'
            : '暂无数据~'
        "
        :image="require('@/assets/img/empty/no_data.png')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref, defineProps } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { avatarImage } from '@/utils/utils'
import { thumbnailImage } from '@/components/project/projectItem/projectDetailNewData'
import { async } from '@antv/x6/lib/registry/marker/main'
import { imageGlobal } from '@/global'
import { get_env } from '@/utils/env'
const { proxy } = getCurrentInstance() as any
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const showPopover = ref<boolean>(false)
const listData = ref<any>({}) // 交底列表
const surveyTemplate = ref<any>([]) // 问卷模板
const executeInfo = ref<any>({}) // 执行人信息
const noticeData = ref<any>({}) // 交底通知信息

// 查询交底通知
const getNotice = async () => {
  await fetch({
    url: `/order/order_disclose/notify/get/${props.data.nodeId}`,
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0) {
      noticeData.value = res.data
    }
  })
}

// 根据项目的nodeId查询项目节点
const getSurveyTemplate = async () => {
  await fetch({
    url: `/order/project/node?nodeId=${props.data.nodeId}`,
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0) {
      executeInfo.value = res.data
    }
  })
}

// 查询交底列表
const getListData = async () => {
  await fetch({
    url: `/order/order_disclose/disclose/list/${props.data.nodeId}`,
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0 && res.data) {
      listData.value = res.data
      if (res.data && res.data[0]) {
        fetch({
          url: `/order/order_disclose/disclose/get/${res.data[0].id}`,
          method: 'get'
        }).then((res2: any) => {
          if (res2.code == 0) {
            surveyTemplate.value = res2.data
            surveyTemplate.value.toParseContent =
                            res2.data &&
                            res2.data.answer &&
                            res2.data.answer.answerContent
                              ? JSON.parse(res2.data.answer.answerContent)
                              : []
          }
        })
      }
    }
  })
}

const isLoading = ref(false)
// 下载交底报告
const downloadReport = async () => {
  isLoading.value = true
  const env = get_env(process.env.VUE_APP_API_ENV)
  let type = 0
  if (env === 'dev') {
    type = 1
  } else if (env === 'test') {
    type = 2
  } else if (env === 'uat') {
    type = 3
  } else if (env === 'prod') {
    type = 4
  }
  const dataId = listData.value[0].id
  const fileName =
        (surveyTemplate.value.answer?.surveyName || '') +
            '-' +
            listData.value[0].discloseAddress || ''
  const url = `reports?type=2&id=${dataId}&urlEnv=${type}&log=1&fileName=${fileName}`
  await fetch({
    url,
    method: 'get'
  }).then((res: any) => {
    if (res.code === 0 && res.data.url) {
      isLoading.value = false
      window.open(imageGlobal + res.data.url)
      ElMessage.success('下载成功')
    }
  }).finally(() => {
    isLoading.value = false
  })
}

watchEffect(() => {
  getNotice()
  getListData()
  getSurveyTemplate()
})
</script>

<style scoped lang="less">
.disclose {
    margin-bottom: 2rem;
    width: 100%;
    position: relative;
    .disclose-header {
        box-sizing: border-box;
        width: 100%;
        height: 7.6rem;
        border-bottom: 1px solid #f3f4f8;
        padding: 0 4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.4rem;
        .disclose-header_user {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: start;
            box-sizing: border-box;
            width: calc(100% - 5rem);
            i {
                font-style: normal;
                color: #0969da;
                background: #ecf5ff;
                padding: 0.5rem 1.5rem 0.5rem 2rem;
                border-top-right-radius: 2rem;
                border-bottom-right-radius: 2rem;
                display: inline-block;
                margin-left: -1rem;
                margin-right: 0.5rem;
            }

            .disclose-header_img {
                display: flex;
                justify-content: start;
                align-items: center;
                flex-wrap: nowrap;
            }

            p {
                flex: 1;
                padding: 0 1rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .disclose-header_btn {
            color: #0969da;
            border: 1px solid #0969da;
            border-radius: 0.6rem;
            width: 10rem;
            height: 2.4rem;
            line-height: 2.4rem;
            width: 4.8rem;
            text-align: center;
            cursor: pointer;
        }
    }

    .disclose-main {
        padding: 2rem 4rem;

        .col {
            color: #909399;
            font-size: 1.6rem;
            display: flex;
            justify-content: start;
            align-items: center;

            span {
                padding-bottom: 1rem;

                &:first-child {
                    text-align: right;
                }

                &:last-child {
                    color: #1a1a1a;
                    padding-left: 2rem;
                    display: flex;
                    justify-content: start;
                    align-items: center;

                    span {
                        margin-right: 1rem;
                        padding: 0;
                    }

                    i {
                        font-style: normal;
                        color: #67c23a;
                        font-size: 1.4rem;
                        border: 1px solid #e1f3d8;
                        background: #f0f9eb;
                        border-radius: 0.6rem;
                        padding: 0.3rem;
                    }
                }
            }
        }
    }

    .empty {
        padding-top: 0 !important;
    }
}
</style>
