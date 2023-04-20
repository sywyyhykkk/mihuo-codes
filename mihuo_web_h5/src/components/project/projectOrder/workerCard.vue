<template>
  <div class="worker-card">
    <div class="card-left">
      <img
        class="worker-img"
        :src="
          props.data.avatar
            ? $getUrl.getPicUrl(props.data.avatar, true)
            : $getUrl.avatarImage(props.data.bidUserId)
        "
        @error="$getUrl.imageError($event)"
      />
      <!--      <div style="height: 1rem"></div>-->
      <!--      <div class="worker-tags ">-->
      <!--        <div class="tags-text">-->
      <!--          我的工匠-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="worker-tags2">-->
      <!--        <div class="tags-text">-->
      <!--          企业工匠-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="worker-tags3">-->
      <!--        <div class="tags-text">-->
      <!--          市场工匠-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div class="card-center">
      <div class="center-title">
        <div class="worker-name">
          {{ props.data.personName || props.data.name || props.data.phone }}
        </div>
        <img
          v-if="props.data.level == 5"
          :src="require('@/assets/img/v/v5.png')"
          class="worker-v"
        />
        <img
          v-if="props.data.level == 4"
          :src="require('@/assets/img/v/v4.png')"
          class="worker-v"
        />
        <img
          v-if="props.data.level == 3"
          :src="require('@/assets/img/v/v3.png')"
          class="worker-v"
        />
        <img
          v-if="props.data.level == 2"
          :src="require('@/assets/img/v/v2.png')"
          class="worker-v"
        />
        <img
          v-if="props.data.level == 1"
          :src="require('@/assets/img/v/v1.png')"
          class="worker-v"
        />
        <el-tag
          v-if="props.data.skillName"
          style="margin-left: 1rem"
          type="success"
          >{{ props.data.skillName }}</el-tag
        >
        <img
          :src="require('@/assets/img/message.png')"
          class="data-message"
          @click="openIm({ userId: props.data.userId || props.data.bidUserId })"
        />
      </div>
      <!--      <div class="center-title">-->
      <!--        <div class="worker-text-tags" v-for="item in 4">‘从业经验’</div>-->
      <!--      </div>-->
      <!-- <div v-if="props.data.bidUserId" class="center-title">
        <div class="worker-data-info">
          <span class="totaltext">共计</span>
          <span class="totalMoney">{{ props.data.bidPrice }}</span>
        </div>
      </div> -->
      <div class="center-title" v-if="props.showReceived">
        <!--        <div class="worker-data-info">-->
        <!--          <span>合作过</span>-->
        <!--          <span class="info-value">3次</span>-->
        <!--        </div>-->
        <div class="worker-data-info">
          <span>好评率</span>
          <span class="info-value">{{
            props.data.personInfo?.evaluationRate
              ? `${props.data.personInfo.evaluationRate}%`
              : '--'
          }}</span>
        </div>
        <div class="worker-data-info">
          <span>在施工</span>
          <span class="info-value"
            >{{ props.data.personInfo?.serviceNum }}单</span
          >
        </div>
      </div>
      <div
        style="color: #f56c6c"
        v-if="props.data.bidStatus == 3 && props.orderData.orderStatus == -1"
      >
        已终止
      </div>
      <div
        :style="props.data.bidStatus == 3 ? 'color:#67c23a' : 'color:#f56c6c'"
        v-else
      >
        {{ setAccept() }}
      </div>
    </div>
    <div class="worker-card-right">
      <slot name="cardRight"> </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref } from 'vue'
import { openIm } from '@/utils/chat'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  cardType: {
    type: Number,
    default: 0
  },
  data: {
    type: Object,
    default: {}
  },
  showReceived: {
    type: Boolean,
    default: true
  },
  orderData: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits()

const setAccept = () => {
  switch (props.data?.bidStatus) {
    case 0:
    case 1:
    case 2:
      return '未确认订单'
    case 3:
      return '已确认订单'
    case 4:
      return '发单方已拒绝'
    case 6:
      return '工人已拒绝'
    default:
      return ''
  }
}
</script>

<style scoped lang="less">
.worker-card {
  //height: 120px;
  display: flex;
  align-items: center;
  justify-content: start;
  border-bottom: solid 1px #f0f0f0;
  padding: 2rem 0;

  .worker-card-right {
    flex: 1;
    text-align: right;
  }

  .card-center {
    margin-left: 20px;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .data-info {
      justify-content: space-between;
    }

    .center-title {
      display: flex;
      align-items: center;
      height: 3rem;

      .data-message {
        //width: 14px;
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

      .worker-data-info {
        font-size: 12px;
        font-weight: 400;
        color: #1a1a1a;
        margin-right: 2rem;
        .totaltext {
          font-size: 12px;
          font-weight: bold;
          color: #1a1a1a;
        }
        .totalMoney {
          color: #f56c6c;
          font-weight: bold;
          margin-left: 9px;
          font-size: 12px;
        }
        .info-value {
          color: #f56c6c;
          margin-left: 9px;
        }
      }

      .worker-text-tags {
        font-size: 12px;
        font-weight: 400;
        color: #909399;
      }

      .worker-name {
        font-size: 16px;
        font-weight: bold;
        color: #1a1a1a;
      }

      .worker-v {
        width: 18px;
        height: 18px;
        margin-left: 10px;
      }
    }
  }

  .card-left {
    display: flex;
    flex-flow: column;
    text-align: center;
    align-items: center;
    position: relative;

    .tags-text {
      //margin-right: -20px;
      //margin-left: -5px;
      white-space: nowrap;
    }

    .worker-tags {
      position: absolute;
      width: 80px;
      height: 20px;
      line-height: 20px;
      background: #0969da;
      border-radius: 2px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 50px;
      flex-wrap: nowrap;
      transform: translate(0, -15%) scale(0.7);
    }

    .worker-tags2 {
      position: absolute;
      width: 50px;
      height: 20px;
      line-height: 20px;
      background: #ecf5ff;
      border-radius: 2px;
      color: #0969da;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      align-items: center;
      top: 50px;
      flex-wrap: nowrap;
    }

    .worker-tags3 {
      position: absolute;
      width: 50px;
      height: 20px;
      line-height: 20px;
      background: #fdf6ec;
      border-radius: 2px;
      color: #f2aa3d;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      align-items: center;
      top: 50px;
      flex-wrap: wrap;
      transform: translate(-10%, 0) scale(0.7);
    }

    .worker-img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
}
</style>
