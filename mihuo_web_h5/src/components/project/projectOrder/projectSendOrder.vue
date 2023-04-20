<template>
  <div style="position: relative;height: 100%">
    <div class="send-order">
      <div class="order-detail-form">
        <div class="node-detail-input form-dialog-footer">
          <el-button
            :disabled="checkOrderStatus"
            type="primary"
            @click="buttonClickHandel('找人接单')"
          >找人接单</el-button>
          <el-button
            :disabled="checkOrderStatus"
            type="danger"
            class="form-button"
            @click="buttonClickHandel('发布抢单')"
          >发布抢单</el-button>
        </div>
      </div>
      <div class="order-table-data">
        <div class="table-title">订单（{{ state.orderList.length }}）</div>
        <div v-if="state.orderList.length === 0" class="no-data">
          <img class="no-data-img" :src="require('@/assets/img/empty/no_data.png')">
          <div style="margin-top: 3rem">{{ props.nodeData.cardType === 0 ? '该节点尚未开始' : '暂无数据' }}~~</div>
        </div>
        <div v-for="(item,index) in state.orderList" :key="index">
          <orderCard :order-data="item" @getSendOrderList="getSendOrderList" />
        </div>
      </div>
    </div>
    <!--    找人接单-->
    <orderSelectPerson
      v-if="showOrderSelectPerson"
      v-model="showOrderSelectPerson"
      :data="state.nodeData"
      :project-id="props.projectId"
      :order-skill-id="orderSkillId"
      @getSendOrderList="getSendOrderList"
    />
    <!--    发布抢单-->
    <pushGrabSingle
      v-if="showGrabSingle"
      v-model="showGrabSingle"
      :data="state.nodeData"
      :project-source="props.projectSource"
      :project-id="props.projectId"
      :order-skill-id="orderSkillId"
      @getSendOrderList="getSendOrderList"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, watchEffect, ref, reactive, onMounted, watch, inject } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getDaysBetween } from '@/components/project/projectItem/projectDetailNewData'
import { sysjobsList } from '_@/api/basicConfig'

const props = defineProps({
  nodeData: {
    type: Object,
    default: {}
  },
  projectId: {
    type: String || Number,
    default: 0
  },
  detailForm: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['getByData'])
const ruleForms = ref<any>('')
const nodeData = ref<any>({})
const showOrderSelectPerson = ref<boolean>(false)
const showGrabSingle = ref<boolean>(false)
const state = reactive({
  nodeData: {} as any,
  orderList: [] as any
})

const rules = reactive({
  requirementDesc: [{ required: true, message: '请输入需求描述', trigger: 'change' }]
  // expectDate: [{ required: true, message: '请输入期望上门时间', trigger: 'change' }],
  // expectDuration: [{ required: true, message: '请输入期望工期', trigger: 'change' }],
  // price: [{ required: true, message: '请输入预估费用', trigger: 'change' }]
})

const orderSkillId = ref('')
const buttonClickHandel = (row: any) => {
  orderSkillId.value = state.nodeData.skillId
  if (row === '找人接单') {
    showOrderSelectPerson.value = true
  }
  if (row === '发布抢单') {
    showGrabSingle.value = true
  }
}

const getSendOrderList = (val:number) => {
  getOrderList(val)
  emit('getByData')
}

// 获取已派订单列表
const getOrderList = async (val:number) => {
  await fetch({
    url: '/order/biz_order/project/order',
    method: 'get',
    params: {
      nodeId: state.nodeData.nodeId,
      projectId: props.projectId,
      cancelStatus: val || 1// cancelStatus 取消单是否查询，1>查询; 0>不查询，默认为0或者null  不查询取消单
    }
  }).then((res: any) => {
    state.orderList = res.data
  })
}

// 判断订单列表状态
const checkOrderStatus = computed(() => {
  // 如果订单列表为空 则允许发布抢单和找人接单
  // 如果订单列表不为空 则不允许发布新订单
  // 订单列表不为空时，如果订单已关闭，则允许发布新订单
  if (state.orderList.length === 0) {
    return false
  } else {
    const newArr = state.orderList.filter((item: any) => item.orderStatus !== -1)
    if (newArr.length === 0) return false
    else return true
  }
})

onMounted(() => {
  // getOrderList()
})

watch(() => state.nodeData.price, () => {
  state.nodeData.price = state.nodeData.price ? state.nodeData.price.replace(/[^0-9.]/g, '') : null
})

watchEffect(() => {
  state.nodeData = JSON.parse(JSON.stringify(props.nodeData))
  if (state.nodeData.nodeId) {
    getOrderList(1)
  }
  if (props.detailForm) {
    state.nodeData.requirementDesc = '\n'
    sysjobsList({}).then((res) => {
      let serviceName: any = ''
      res.data.some((item: any) => {
        if (item.skillId === state.nodeData.skillId) {
          if (item.jobCode === 'JOB_WORKER') {
            serviceName = '施工'
          } else {
            serviceName = '服务'
          }
          return
        }
      })
      state.nodeData.requirementDesc = props.detailForm.poiName + '需要' + state.nodeData.skillName + serviceName
    })
  }
})

</script>

<style scoped lang="less">
.send-order {
  width: 100%;
  background: #FAFAFA;
  position: absolute;
  bottom: 0;
  top: 0;
}

.no-data {
  margin-top: 4rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: #C0C4CC;
}

.order-table-data {
  background: #FAFAFA;
  padding: 2rem 4rem;

  .table-title {
    font-size: 16px;
    font-weight: bold;
    color: #1A1A1A;
    height: 100%;
    //margin-top: 3rem;
  }
}

.form-dialog-footer {
  justify-content: right !important;

  .form-button {
    margin-left: 2rem;
  }
}

.order-detail-form {
  background: #ffffff;
  padding: 3rem 4rem;
}

.node-detail-input {
  display: flex;
  justify-content: space-between;
  margin-top: 0rem;

  .order-form {
    display: flex;
    align-items: center;

    .input-form-lable {
      font-size: 14px;
      font-weight: 400;
      color: #606266;
      margin-right: 1.4rem;
    }
  }
}

.node-detail-text {
  height: 4rem;
  //border: 1px solid #E4E7ED;
  //border-radius: 4px;
  //font-size: 14px;
  //font-weight: 400;
  //color: #1A1A1A;
  //line-height: 4rem;
  //padding: 0 1.5rem;
}

</style>
