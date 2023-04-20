<template>
  <div>
    <el-drawer
      v-model="drawerShow"
      title="查看"
      direction="rtl"
      width="50%"
      @close="closeDrawer"
    >
      <div class="detail-con">
        <div class="detail-item">
          <div class="label">发布者：</div>
          <div class="info">{{ detailInfo.userName }}</div>
        </div>

        <div class="detail-item">
          <div class="label">发布时间：</div>
          <div class="info">{{ detailInfo.created }}</div>
        </div>

        <div class="detail-item">
          <div class="label">案例标题：</div>
          <div class="info">{{ detailInfo.title }}</div>
        </div>

        <div class="detail-item">
          <div class="label">案例主图：</div>
          <div class="info">
            <div style="display: flex;flex-wrap:wrap">
              <div
                v-for="(m, i) in detailInfo.fileList ? detailInfo.fileList : []"
                :key="i"
              >
                <el-image
                  v-if="m.type === 'img'"
                  class="imgs"
                  preview-teleported
                  lazy
                  fit="cover"
                  :src="$getUrl.getPicUrl(m.url, true)"
                  :initial-index="i"
                  :preview-src-list="[$getUrl.getPicUrl(m.url, false)]"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon :size="30"><PictureFilled /></el-icon>
                    </div>
                  </template>
                </el-image>

                <video
                  v-if="m.type === 'video'"
                  :id="'myVideo1' + i"
                  :ref="video + i"
                  :src="$getUrl.getPicUrl(m.url, false)"
                  style="width: 130px; height: 80px; margin-right: 1rem"
                  autoplay="false"
                  controls
                  muted
                />

                <audio
                  v-if="m.type === 'audio'"
                  controls
                  :src="$getUrl.getPicUrl(m.url, false)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="detail-item">
          <div class="label">案例总预算：</div>
          <div class="info" v-if="detailInfo.price">
            ￥{{ detailInfo.price.toFixed(2) }}
          </div>
        </div>

        <div class="detail-item">
          <div class="label">案例标签：</div>
          <div class="info">
            <el-tag
              type="info"
              v-for="(m, i) in detailInfo.tags &&
              detailInfo.tags.split(/,|，|\s+/)"
              :key="i"
              >{{ m }}</el-tag
            >
          </div>
        </div>

        <div class="detail-item">
          <div class="label">案例描述：</div>
          <div class="info">
            <p>{{ detailInfo.description }}</p>
            <el-image
              class="imgs"
              v-for="(m, i) in detailInfo.annex
                ? imgSrcList(detailInfo.annex)
                : []"
              :key="i"
              preview-teleported
              lazy
              fit="cover"
              :src="m"
              :initial-index="i"
              :preview-src-list="
                detailInfo.annex ? imgSrcList(detailInfo.annex) : []
              "
            >
              <template #error>
                <div class="image-slot">
                  <el-icon :size="30"><PictureFilled /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </div>

      <div class="detail-con">
        <div v-for="(itm, ind) in customContent" :key="ind">
          <div class="detail-item" v-if="itm.name">
            <div class="label">自定义标题{{ ind + 1 + '：' }}</div>
            <div class="info">{{ itm.name }}</div>
          </div>
          <div class="detail-item">
            <div class="label">自定义内容{{ ind + 1 + '：' }}</div>
            <div class="info">
              <p>{{ itm.desc }}</p>
              <el-image
                class="imgs"
                v-for="(m, i) in itm.pics
                  ? JSON.parse(itm.pics)
                  : []
                  ? imgSrcList(itm.pics)
                  : []"
                :key="i"
                preview-teleported
                lazy
                fit="cover"
                :src="m"
                :initial-index="i"
                :preview-src-list="itm.pics ? imgSrcList(itm.pics) : []"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon :size="20"><PictureFilled /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="closeDrawer">确 定</el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, onMounted, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { imgSrcList } from '@/utils/utils'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  id: {
    //查询id
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['update:modelValue'])

const drawerShow = ref<boolean>(false)
const detailInfo = ref<any>({})
const customContent = ref<any>([])

watchEffect(() => {
  drawerShow.value = props.modelValue
  if (drawerShow.value) {
    getDetailData()
  }
})

const closeDrawer = () => {
  emit('update:modelValue', false)
}

const getDetailData = async () => {
  await fetch({
    url: `/mall/smsworkcases/queryById/${props.id}`,
    method: 'get'
  }).then((res: any) => {
    detailInfo.value = res.data || {}
    customContent.value = res.data?.customContent
      ? JSON.parse(res.data.customContent)
      : []

    let urls: any = [],
      arr: any = []
    if (detailInfo.value.coverImg != '') {
      urls = JSON.parse(detailInfo.value.coverImg)
    }
    if (!urls) return []
    urls.forEach((item: any) => {
      arr.push({
        type: item.type,
        url: item.url
      })
    })
    detailInfo.value['fileList'] = arr
  })
}
onMounted(() => {
  drawerShow.value = props.modelValue
})
</script>

<style scoped lang="less">
.detail-con {
  .detail-item {
    display: flex;
    margin-bottom: 3rem;
    .label {
      flex: 3;
    }
    .info {
      flex: 9;
      .imgs {
        width: 13rem;
        height: 8rem;
        margin-right: 0.5rem;
      }
      p {
        margin-bottom: 0.5rem;
      }
      .el-tag {
        margin: 0 0.5rem 0.5rem 0;
      }
      .image-slot {
        text-align: center;
        line-height: 8rem;
        .el-icon {
          color: #909990;
        }
      }
    }
  }
}
</style>
