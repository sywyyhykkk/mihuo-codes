<template>
  <div>
    <el-drawer
      v-model="state.showDrawer"
      title="订单修改记录"
      direction="rtl"
      @close="closeHandelDrawer"
    >
      <div class="detail-drawer edit-record">
        <el-empty
          v-if="state.orderHistoryList.length==0"
          style="margin-top:2rem"
          :image-size="130"
          description="暂无数据~"
          :image="require('@/assets/img/empty/no_data.png')"
        />
        <dotStep v-if="state.orderHistoryList.length>0"
                 v-for="(item,index) in state.orderHistoryList"
                 :key="index"
                 :wireType="index==(state.orderHistoryList.length-1)?false:true">
          <template #stepTitle>
            <div class="step-time">{{ item.createTime }}</div>
          </template>
          <template #stepDetial>
            <div class="record-person">
              <img :src="$getUrl.avatarImage(item.creatorId)" @error="$getUrl.imageError($event)" />
              <span>{{ item.operateMan }}（系统后台管理员）</span>
            </div>
            <div v-if="!item.payload">
              <div class="record-info-hander">订单信息</div>
              <div class="edit-item-as">{{ item.note }}</div>
            </div>
            <div v-if="item.payload&&JSON.parse(item.payload).category=='收货信息'">
              <div class="record-info-hander">收货信息</div>
              <div class="edit-item" v-for="item2 in JSON.parse(item.payload).modifyRecords">
                {{ item2.property }}：{{ item2.originalValue }}
              </div>
              <div class="record-info-hander">修改为</div>
              <div class="edit-item-as" v-for="item2 in JSON.parse(item.payload).modifyRecords">
                {{ item2.property }}：{{ item2.newValue }}
              </div>

            </div>
            <div
              v-if="item.payload&&(JSON.parse(item.payload).category=='商品信息'||JSON.parse(item.payload).category=='删除商品')">
              <div class="record-info-hander">{{ JSON.parse(item.payload).category }}</div>
              <div class="goods" style="margin-top: 1rem">
                <el-image
                  :src="$getUrl.getPicUrl(JSON.parse(item.payload).productPic)"
                  :preview-src-list="$getUrl.getPicUrl(JSON.parse(item.payload).productPic)"
                  :preview-teleported="true"
                  :fit="fit"></el-image>
                <div class="goods-info">
                  <div class="product-name">{{ JSON.parse(item.payload).productName }}</div>
                  <div class="goods-tag">
                    <el-tag type="info">{{ JSON.parse(item.payload).productSn }}</el-tag>
                    <el-tag type="info">{{ JSON.parse(item.payload).productBrand }}</el-tag>
                  </div>
                </div>
              </div>
              <div class="edit-item" v-for="item2 in JSON.parse(item.payload).modifyRecords">
                {{ item2.property }}：{{ item2.originalValue }}
              </div>
              <div class="record-info-hander">修改为</div>
              <div class="edit-item-as" v-for="item2 in JSON.parse(item.payload).modifyRecords">
                {{ item2.property }}：{{ item2.newValue }}
              </div>
            </div>
          </template>
        </dotStep>
      </div>
    </el-drawer>

  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, onMounted, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: { //控制抽屉是否显示
    type: Boolean,
    default: false
  },
  orderId: {//订单id
    type: String || Number,
    default: 0
  }

})
const emit = defineEmits(['update:modelValue'])


const state = reactive({
  showDrawer: false,
  orderHistoryList: [] as any,
  data: {} as any
})

onMounted(() => {
  state.showDrawer = props.modelValue
  if (state.showDrawer) {
    getOrderHistory()
  }
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}

const getOrderHistory = async () => {
  await fetch({
    url: `/mall/order/orderOperateHistory/list/${props.orderId}`,
    method: 'get'
  }).then((res: any) => {
    state.orderHistoryList = res.data || []

  })
}

</script>

<style scoped lang="less">
@import "../orderTable";

.step-time {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #909399;
}


</style>
