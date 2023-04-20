<template>
  <div>
    <div class="order-card">
      <div class="order-card-detail">
        <div class="detail-item" style="margin-top: 0">
          <el-icon size="1.4rem">
            <tickets />
          </el-icon>
          <div class="order-code">{{ props.orderData.orderCode }}</div>
          <div class="order-tags">
            {{
              props.orderData.personName || props.orderData.requirementTypeName
            }}
          </div>
          <div v-if="props.orderData.orderStatus == -1" class="order-state">
            已关闭
          </div>
          <div class="order-date">
            {{ getDateByDiff(props.orderData.created) }}
          </div>
        </div>
        <div class="detail-item">
          {{ props.orderData.requirementDesc }}
        </div>
        <div class="detail-item">
          <div class="detail-info">
            <span>上门时间</span>
            <span class="info-value">{{ props.orderData.expectDate }}</span>
          </div>
          <div class="detail-info">
            <span>预计工期</span>
            <span class="info-value"
              >{{ props.orderData.expectDuration }}天</span
            >
          </div>
          <div class="detail-info">
            <span>预估费用</span>
            <span class="info-value" style="color: #f56c6c"
              >{{ props.orderData.referencePrice }}元</span
            >
          </div>
        </div>
      </div>
      <div class="order-card-footer">
        <div
          v-if="
            props.orderData.assignType == 2 &&
            props.orderData.orderOfferList.length > 0 &&
            props.orderData.orderStatus < 30
          "
          class="footer-left-data"
        >
          <div v-for="item in props.orderData.orderOfferList" :key="item.id">
            <img
              class="person-img"
              :src="$getUrl.avatarImage(item.bidUserId)"
              @error="$getUrl.imageError($event)"
            />
          </div>
          <div class="data-text">
            共有{{ props.orderData.orderOfferList.length }}人参与抢单
          </div>
        </div>

        <div
          v-else-if="
            props.orderData.assignType == 2 &&
            props.orderData.orderOfferList.length == 0
          "
          class="footer-left-data"
        >
          暂时无人抢单
        </div>

        <div
          v-for="item in props.orderData.orderOfferList"
          v-else-if="
            (props.orderData.assignType == 1 &&
              props.orderData.orderOfferList.length > 0) ||
            props.orderData.orderStatus >= 30
          "
          :key="item.id"
          class="footer-left-data"
        >
          <div
            v-if="item.bidStatus == 3"
            style="display: flex; align-items: center"
          >
            <img
              class="person-img"
              :src="$getUrl.avatarImage(item.bidUserId)"
              @error="$getUrl.imageError($event)"
            />
            <div class="person-name">{{ item.personName }}</div>
            <img
              v-if="item.personInfo.level == 5"
              :src="require('@/assets/img/v/v5.png')"
              class="data-v"
            />
            <img
              v-if="item.personInfo.level == 4"
              :src="require('@/assets/img/v/v4.png')"
              class="data-v"
            />
            <img
              v-if="item.personInfo.level == 3"
              :src="require('@/assets/img/v/v3.png')"
              class="data-v"
            />
            <img
              v-if="item.personInfo.level == 2"
              :src="require('@/assets/img/v/v2.png')"
              class="data-v"
            />
            <img
              v-if="item.personInfo.level == 1"
              :src="require('@/assets/img/v/v1.png')"
              class="data-v"
            />
            <el-tag class="ml-2" type="success">{{ item.skillName }}</el-tag>
            <img
              :src="require('@/assets/img/message.png')"
              class="data-message"
              @click="openIm({ userId: item.bidUserId })"
            />
          </div>
        </div>
        <div v-else class="footer-left-data" />
        <div class="footer-button">
          <!-- 订单状态: 10=已发布/待确认；15=已报价；20=已确认/待付款；30=已付款/服务中；35=已申请/待验收；40=待结算；50=已完成/待评价；51=已完成/已评价；-1=已取消 -->
          <template v-if="props.isLook">
            <el-button
              v-if="props.orderData.orderStatus === 10"
              class="button-data"
              @click="handelButton('关闭订单')"
              >关闭订单
            </el-button>
            <!-- <el-button
              v-if="props.orderData.orderStatus === 10"
              class="button-data"
              @click="handelButton('修改订单')"
              >修改订单
            </el-button> -->
            <el-button
              v-if="
                props.orderData.orderStatus < 50 &&
                props.orderData.orderStatus != -1
              "
              class="button-data button-hover"
              style="color: #0969da"
              type="primary"
              plain
              @click="handelButton('终止服务')"
              >终止服务
            </el-button>
          </template>
          <el-button
            class="button-data button-hover"
            style="color: #0969da"
            type="primary"
            plain
            @click="handelButton('查看订单')"
            >查看订单
          </el-button>
        </div>
      </div>
    </div>
    <!-- 查看订单详情-->
    <orderDetailDrawer
      v-model="showDrawer"
      :data="props.orderData"
      @getSendOrderList="getSendOrderList"
    />
    <!-- 修改订单-->
    <orderProjectEdit
      v-model="showEditOrder"
      :data="props.orderData"
      @getSendOrderList="getSendOrderList"
    />
    <!-- 关闭订单-->
    <orderProjectClose
      v-model="showCloseOrder"
      :data="props.orderData"
      @getSendOrderList="getSendOrderList"
    />
    <!-- 终止服务订单-->
    <orderProjectClose
      v-model="showTerminateOrderDialog"
      type="2"
      :data="props.orderData"
      @getSendOrderList="getSendOrderList"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watch } from 'vue'
import { openIm } from '@/utils/chat'
import { getDateByDiff } from '@/utils/moment'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  orderData: {
    type: Object,
    default: {}
  },
  isLook: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['getSendOrderList'])
const showDialog = ref<boolean>(false)
const showDrawer = ref<boolean>(false)
const showEditOrder = ref<boolean>(false)
const showCloseOrder = ref<boolean>(false)
const showTerminateOrderDialog = ref<boolean>(false)
const state = reactive({
  form: {} as any
})

const getSendOrderList = (val: number) => {
  emit('getSendOrderList', val)
}
const handelButton = (row: any) => {
  if (row === '查看订单') {
    showDrawer.value = true
  }
  if (row === '修改订单') {
    showEditOrder.value = true
  }
  if (row === '关闭订单') {
    showCloseOrder.value = true
  }
  if (row === '终止服务') {
    showTerminateOrderDialog.value = true
  }
}
</script>

<style scoped lang="less">
.order-card {
  background: #ffffff;
  border: 1px solid #f3f4f8;
  border-radius: 6px;
  margin-bottom: 2rem;

  &:first-child {
    margin-top: 2rem;
  }

  .order-card-footer {
    height: 7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .footer-left-data {
      padding-left: 2rem;
      display: flex;
      font-size: 12px;
      font-weight: 400;
      color: #f56c6c;
      align-items: center;

      .data-v {
        width: 18px;
        height: 18px;
        margin-left: 10px;
      }

      .data-message {
        width: 14px;
        height: auto;
        image-rendering: -moz-crisp-edges;
        image-rendering: -o-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
        margin-left: 10px;
        color: #0969da;
        cursor: pointer;
      }

      .ml-2 {
        margin-left: 10px;
      }

      .person-name {
        font-size: 14px;
        font-weight: 400;
        color: #1a1a1a;
        margin-left: 16px;
      }

      .data-text {
        margin-left: 16px;
      }

      .person-img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: -6px;
      }
    }

    .footer-button {
      padding-right: 2rem;

      .button-data {
        margin-left: 2rem;
        border-radius: 15px;
        height: 30px;
        background: #ffffff !important;
      }

      .button-hover {
        &:hover {
          color: #0969da !important;
          opacity: 0.7 !important;
        }
      }
    }
  }

  .order-card-detail {
    padding: 20px;
    border-bottom: solid 1px #f3f4f8;

    .detail-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: #1a1a1a;
      margin-top: 20px;

      .detail-info {
        font-size: 12px;
        font-weight: 400;
        color: #909399;
        margin-right: 4rem;

        .info-value {
          margin-left: 10px;
          color: #303133;
        }
      }

      .order-code {
        font-size: 12px;
        font-weight: bold;
        color: #303133;
        margin-left: 6px;
      }

      .order-tags {
        font-size: 12px;
        font-weight: 400;
        color: #0969da;
        height: 16px;
        line-height: 16px;
        background: #ecf5ff;
        border-radius: 8px;
        padding: 0 5px;
        margin-left: 10px;
      }

      .order-state {
        font-size: 12px;
        font-weight: 400;
        color: #909399;
        margin-left: 10px;
      }

      .order-date {
        flex: 1;
        text-align: right;
        font-size: 12px;
        font-weight: 400;
        color: #909399;
      }
    }
  }
}
</style>
