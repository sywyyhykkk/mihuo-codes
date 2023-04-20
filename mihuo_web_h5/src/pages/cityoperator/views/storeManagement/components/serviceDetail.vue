<template>
  <div>
    <el-drawer
      v-model="drawerShow"
      title="查看"
      direction="rtl"
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
          <div class="label">服务标题：</div>
          <div class="info">{{ detailInfo.title }}</div>
        </div>

        <div class="detail-item">
          <div class="label">服务主图：</div>
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
          <div class="label">服务价格：</div>
          <div class="info" v-if="detailInfo.price">
            ￥{{ detailInfo.price.toFixed(2) + '/' + detailInfo.unit }}
          </div>
        </div>

        <div class="detail-item">
          <div class="label">服务内容：</div>
          <div class="info">
            <p>{{ detailInfo.content }}</p>
          </div>
        </div>

        <div class="detail-item">
          <div class="label">服务区域：</div>
          <div class="info">
            <p>{{ detailInfo.address }}</p>
          </div>
        </div>
      </div>

      <div class="detail-con">
        <div class="detail-item" v-for="(itm, ind) in customContent" :key="ind">
          <div class="label">{{ itm.name + '：' }}</div>
          <div class="info">
            <div class="sub-info" v-for="(im, ix) in itm.list" :key="ix">
              <p :style="ix === 0 ? 'margin-top:0' : ''">
                {{ ix + 1 + '、' + im.title }}
              </p>
              <el-image
                class="imgs"
                v-for="(m, i) in im.pics
                  ? imgSrcList(JSON.stringify(im.pics))
                  : []"
                :key="i"
                preview-teleported
                lazy
                fit="cover"
                :src="m"
                :initial-index="i"
                :preview-src-list="
                  im.pics ? imgSrcList(JSON.stringify(im.pics)) : []
                "
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

      <div class="detail-con">
        <div class="detail-item">
          <div class="label">注意事项：</div>
          <div class="info">
            <p>1、审核项目水电施工图纸的质量，并且及时提出修改建议；</p>
            <p>2、编写水电施工组织方案，制定施工安全、质量控制措施；</p>
            <p>
              1、对水电工程施工过程中出现的各种问题，能及时提出解决方案并独立处理；
            </p>
            <p>1、负责监督、协调各项水电工程的质量、进度和安全；</p>
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
    url: `/mall/pmsserviceitems/queryById/${props.id}`,
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
      flex: 10;
      .imgs {
        width: 13rem;
        height: 8rem;
        margin-right: 1rem;
      }
      p {
        margin-bottom: 0.5rem;
      }
      .sub-info {
        p {
          margin: 1rem 0;
        }
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
