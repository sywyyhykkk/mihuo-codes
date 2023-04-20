<template>
  <div>
    <el-drawer
      v-model="drawerShow"
      title="订单详情"
      direction="rtl"
      :append-to-body="true"
      @close="closeHandelDrawer"
      size="70rem"
    >
      <div class="drawer-item">
        <!--        <div class="drawer-detail-title">-->
        <!--          <div class="title-text">订单关闭</div>-->
        <!--        </div>-->
        <!--        <div class="person-info" style="background: #FEF0F0;">-->
        <!--          <img class="person-img" :src="require('@/assets/img/avatar.png')" />-->
        <!--          <span>王婉（管理员）2022-04-01 14:00</span>-->
        <!--          <span style="color:#F56C6C;margin-left: 10px">发布了抢单</span>-->
        <!--        </div>-->
        <!--        <div style="height: 1px;background: #F3F4F8;margin-top: 2rem"></div>-->
        <div class="drawer-detail-title">
          <div class="title-text">订单信息</div>
        </div>
        <div style="display: flex">
          <div class="person-info">
            <img
              class="person-img"
              :src="$getUrl.avatarImage(props.data.userId)"
              @error="$getUrl.imageError($event)"
            />
            <span>{{ props.data.userName }}&nbsp;{{ props.data.created }}</span>
            <span
              v-if="props.data.assignType == 2"
              style="color: #f56c6c; margin-left: 10px"
              >发布了抢单</span
            >
            <span
              v-if="props.data.assignType == 1"
              style="color: #2da44e; margin-left: 10px"
              >指派了{{ props.data.orderOfferList[0].skillName }}</span
            >
          </div>
          <div style="flex: 1; text-align: right"></div>
        </div>

        <div class="order-detail">
          <div class="detail-label">订单编号</div>
          <div class="detail-center">{{ props.data.orderCode }}</div>
        </div>
        <div class="order-detail">
          <div class="detail-label">需求类型</div>
          <div class="detail-center">{{ props.data.requirementTypeName }}</div>
        </div>
        <div class="order-detail">
          <div class="detail-label">需求描述</div>
          <div class="detail-center">{{ props.data.requirementDesc }}</div>
        </div>
        <div class="order-detail" v-if="props.data.attachments">
          <div class="detail-label">图片</div>
          <div class="detail-center" style="display: flex; flex-wrap: wrap">
            <div
              v-if="props.data.attachments"
              v-for="(item, index) in JSON.parse(
                JSON.parse(props.data.attachments)[0].attachments
              )"
              :key="index"
              style="margin-right: 1rem; margin-bottom: 1rem"
            >
              <el-image
                class="center-img"
                v-if="item.type == 'img'"
                :src="$getUrl.getPicUrl(item.url)"
                :preview-src-list="
                  $getUrl.getPicUrl(
                    JSON.parse(
                      JSON.parse(props.data.attachments)[0].attachments
                    )
                  )
                "
              />
              <videoNew
                class="center-img"
                v-if="item.type == 'video'"
                :src="$getUrl.getPicUrl(item.url)"
              />
            </div>
          </div>
        </div>
        <div class="order-detail" v-if="props.data.attachments">
          <div class="detail-label">语音</div>
          <div class="detail-center">
            <div
              v-for="(item, index) in JSON.parse(
                JSON.parse(props.data.attachments)[0].attachments
              )"
              :key="index"
            >
              <audioPlay
                v-if="item.type == 'audio'"
                :src="$getUrl.getPicUrl(item.url)"
              />
            </div>
          </div>
        </div>
        <div class="order-detail">
          <div class="detail-label">施工地点</div>
          <div class="detail-center">{{ props.data.address }}</div>
        </div>
        <div class="order-detail">
          <div class="detail-label">上门时间</div>
          <div class="detail-center">{{ props.data.expectDate }}</div>
        </div>
        <div class="order-detail">
          <div class="detail-label">预计工期</div>
          <div class="detail-center">{{ props.data.expectDuration }}天</div>
        </div>
        <div class="order-detail">
          <div class="detail-label">预估费用</div>
          <div class="detail-center">{{ props.data.referencePrice }}元</div>
        </div>
        <div class="order-detail">
          <div class="detail-label">订单类型</div>
          <div class="detail-center">
            {{ props.data.assignType == 2 ? '企业抢单/外部抢单' : '直接指派' }}
          </div>
        </div>
        <div class="order-detail">
          <div class="detail-label">计价类型</div>
          <div class="detail-center">
            {{ props.data.priceWay == 1 ? '一口价' : '议价' }}
          </div>
        </div>

        <div style="height: 1px; background: #f3f4f8; margin-top: 2rem"></div>
        <div class="drawer-detail-title">
          <div class="title-text">接单信息</div>
        </div>
        <div
          class="no-data"
          v-if="
            !props.data.orderOfferList || props.data.orderOfferList.length == 0
          "
        >
          <img
            class="no-data-img"
            :src="require('@/assets/img/empty/no_data.png')"
          />
          <div style="margin-top: 3rem">暂无数据~~</div>
        </div>
        <workerCard
          class="worker-card"
          v-for="item in props.data.orderOfferList"
          :data="item"
          :orderData="props.data"
          :key="item.id"
        >
          <template #cardRight>
            <div
              v-if="
                props.data.assignType == 2 &&
                props.data.orderStatus != -1 &&
                props.data.orderStatus < 50
              "
            >
              <div class="card-accept">
                <span>{{ item.bidStatus > 2 ? '已确认接单' : '' }}</span>
              </div>
              <div class="card-price">报价 {{ item.bidPrice }}元</div>
              <div class="card-date">{{ item.created }}</div>
              <el-button
                class="send-order-button"
                @click="saveOffer(item.id)"
                v-if="item.bidStatus != 3"
              >
                让他接单
              </el-button>
              <el-button
                style="margin-top: 1.7rem"
                type="danger"
                icon="close"
                @click="handelButton('终止服务', item)"
                v-if="item.bidStatus == 3"
              >
                终止服务
              </el-button>
            </div>
          </template>
        </workerCard>
      </div>
      <div class="drawer-footer" v-if="props.data.assignType == 2">
        <el-button class="footer-button" @click="handelButton('关闭订单', {})"
          >关闭订单</el-button
        >
        <el-button class="footer-button" @click="handelButton('修改订单', {})"
          >修改订单</el-button
        >
      </div>
    </el-drawer>
    <!--    修改订单-->
    <orderProjectEdit v-model="showEditOrder" />
    <!--    关闭订单、终止合作订单-->
    <orderProjectClose
      v-model="showCloseOrder"
      :type="state.type"
      :data="state.constructionOrder"
      @getSendOrderList="getOrderDetail"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watchEffect } from 'vue'
import { getRequirementType } from '@/components/project/projectItem/projectDetailNewData'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['getSendOrderList', 'update:modelValue'])
const drawerShow = ref<boolean>(false)
const showEditOrder = ref<boolean>(false)
const showCloseOrder = ref<boolean>(false)
const state = reactive({
  form: {} as any,
  type: '',
  constructionOrder: {}
})

const saveOffer = async (offerId: any) => {
  await fetch({
    url: `order/biz_order/publisher/confirmPerson/${offerId}`,
    method: 'post'
  }).then((res: any) => {
    console.log(res)
    if (res.data) {
      ElMessage.success('指派成功')
      emit('getSendOrderList')
    }
  })
}

const handelButton = (row: any, data: any) => {
  if (row == '修改订单') {
    showEditOrder.value = true
  }
  if (row == '关闭订单') {
    showCloseOrder.value = true
    state.type = '1'
  }
  if (row == '终止服务') {
    showCloseOrder.value = true
    state.type = '2'
    state.constructionOrder = data
  }
}

const getOrderDetail = () => {
  emit('getSendOrderList')
}

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}
watchEffect(() => {
  drawerShow.value = props.modelValue
})
</script>

<style scoped lang="less">
.no-data {
  margin-top: 4rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: #c0c4cc;
}

.drawer-footer {
  height: 68px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: solid 1px #f3f4f8;
  display: flex;
  justify-content: center;
  align-items: center;

  .footer-button {
    height: 30px;
    border-radius: 15px;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}

.drawer-item {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 68px;
  overflow-y: auto;

  .worker-card {
    margin: 0rem 4rem 2rem 4rem;
    border: 1px solid #f3f4f8;
    border-radius: 4px;
    padding: 2rem;
    .card-accept {
      margin: 0.8rem 0;
      color: var(--el-color-success);
      font-size: 1.2rem;
    }

    .send-order-button {
      margin-top: 24px;
      background: linear-gradient(90deg, #0969da, #228ffe);
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
    }

    .card-date {
      font-size: 12px;
      font-weight: 400;
      color: #909399;
      margin-top: 10px;
    }

    .card-price {
      font-size: 14px;
      font-weight: bold;
      color: #f56c6c;
    }
  }

  //padding: 0 0;
  .order-detail {
    display: flex;
    margin-top: 20px;
    padding-left: 60px;

    align-items: center;

    .detail-label {
      font-size: 14px;
      font-weight: 400;
      color: #909399;
      min-width: 76px;
    }

    .detail-center {
      font-size: 14px;
      font-weight: 400;
      color: #1a1a1a;
      //margin-left: 20px;

      .center-img {
        width: 112px;
        height: 112px;
        border-radius: 4px;
        background: #0969da;
      }
    }
  }

  .person-info {
    display: flex;
    margin-left: 2rem;
    padding: 0 10px;
    height: 34px;
    background: #f5f7fa;
    border-radius: 17px;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    color: #4c4c4c;

    .person-img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}

.drawer-detail-title {
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 20px;

  .title-text {
    font-size: 14px;
    font-weight: 400;
    color: #0969da;
    height: 13px;
    padding-left: 7px;
    border-left: solid 3px #0969da;
  }
}
</style>
