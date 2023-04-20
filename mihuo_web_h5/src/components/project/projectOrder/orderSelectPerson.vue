<template>
  <div>
    <el-dialog
      v-model="showDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="找人接单"
      width="70rem"
      @close="handelClose"
    >
      <div class="dialog-data">
        <el-card>
          <el-form class="container-search" :model="searchData">
            <el-form-item prop="name" label="姓名：">
              <el-input v-model="searchData.name" clearable placeholder="请输入姓名"/>
            </el-form-item>
            <el-form-item prop="phone" label="电话：">
              <el-input v-model="searchData.phone" clearable placeholder="请输入电话"/>
            </el-form-item>
          </el-form>
        </el-card>
        <div style="margin-top: 0.5rem;" class="master-select" v-if="workerList && workerList.length">
          <div v-for="(item,index) in workerList" :key="index">
            <workerCard :data="item">
              <template #cardRight>
                <el-button class="send-order-button" @click="saveSendOrder(item)">
                  给他派单
                </el-button>
              </template>
            </workerCard>
          </div>
        </div>
        <el-empty
          v-else
          description="暂无该类型工种~"
          :image-size="200"
          :image="require('@/assets/img/empty/no_data.png')"
        />
      </div>
    </el-dialog>
    <el-dialog
      v-model="showConfirmDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="确认信息"
      width="56rem"
      @close="handelConfirmClose"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
      >
        <el-form-item label="需求描述" prop="requirementDesc">
          <el-input v-model="state.form.requirementDesc" style="width: 80%;" placeholder="需求描述" />
        </el-form-item>
        <div class="node-detail-input">
          <el-form-item label="上门时间" prop="expectDate">
            <el-date-picker
              v-model="state.form.expectDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 17rem"
              type="date"
            />
          </el-form-item>
          <el-form-item label="预计工期" prop="expectDuration">
            <el-input
              v-model="state.form.expectDuration"
              style="width: 17rem"
              type="tel"
              oninput="value=value.replace(/[^0-9.]/g, '').replace('.','')"
            >
              <template #append>天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="预估费用" prop="price">
            <el-input
              v-model="state.form.price"
              disabled
              style="width: 17rem"
              type="number"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确认派单</el-button>
          <el-button @click="handelConfirmClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, watchEffect, ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import getDate from '@/getDate'
import wsCache from '@/cache'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  projectId: {
    type: String || Number,
    default: 0
  },
  orderSkillId: {
    type: String || Number,
    default: 0
  }

})
const proxy = getCurrentInstance()
const emit = defineEmits(['getSendOrderList', 'saveData', 'update:modelValue'])
const showDialog = ref<boolean>(true)
const showConfirmDialog = ref(false)
const activeName = ref<any>('1')
const workerList = ref<any>([])
const searchData = reactive({
  name:'',
  phone:''
})// 搜索内容

const state = reactive({
  form: {
    price: 0
  } as any
})
const orderData = ref<any>({})
const page = reactive({
    size:999,
    currentPage:1,
    total:0
} as any)
// 当前查看的项目
const project = ref(wsCache.get('projectDetail'))

onMounted(() => {
  if (project.value) {
    getOrderPrice()
  }
})

// 获取开单价格
const getOrderPrice = async () => {
  await fetch({
    url: '/order/project/createPublisherGroupPrice',
    method: 'get',
    params: {
      projectId: project.value?.id,
      skillId: props.orderSkillId
    }
  }).then((res: any) => {
    if (res.data) {
      if (res.data.length === 0) {
        // 为0时说明还未开单 订单价格为0
        state.form.price = 0
      } else {
        state.form.price = res.data.reduce((pre: any, next: { payAmount: any; }) => {
          return pre + next.payAmount
        }, 0)
      }
    }
  })
}

const handelClose = () => {
  showConfirmDialog.value = false
  emit('update:modelValue', false)
}

// 取消确认派单
const handelConfirmClose = () => {
  showConfirmDialog.value = false
}

// 最终确认派单
const handleConfirm = async () => {
  await fetch({
    url: '/order/project/assign',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('派单成功')
      handelClose()
      emit('getSendOrderList')
    }
  })
}

// 派单接口
const saveSendOrder = async (row: any) => {
  if (!props.projectId) {
    emit('saveData', row)
    return
  }

  state.form = {
    publishType: 2,
    personId: 0, // 创建人id
    assignType: 1, // 指派方式1，直接指派，2抢单
    assignPersonId: row.personId,
    assignPersonName: row.name,
    expectDuration: props.data.expectDuration || 0,
    nodeId: props.data.nodeId,
    price: state.form.price, // 从接口获取
    priceWay: 1, // 定价方式1一口价,2议价
    projectId: props.projectId,
    referencePrice: 0, // 参考价格
    requirementDesc: props.data.requirementDesc,
    expectDate: getDate.Format(props.data.expectDate || new Date(), 'yyyy-MM-dd')// 期望工期
  }

  showConfirmDialog.value = true
}

// 查询工人
const getWorkerList = async () => {
  await fetch({
    url: 'admin/person/page',
    method: 'get',
    params: {
      cityOperatorId: wsCache.get('cityOperator')?.id,
      size:page.size,
      skillId: props.orderSkillId,
      ...searchData
    }
  }).then((res: any) => {
    workerList.value = res.data.records
    page.total = res.data.total
  })
}
const handleCurrentChange = (e:any)=>{
  page.currentPage = e
  getWorkerList()
}
watchEffect(() => {
  showDialog.value = props.modelValue
  orderData.value = props.data
  if (showDialog.value) {
    getWorkerList()
  }
})

</script>

<style scoped lang="less">
.send-order-button {
  background: linear-gradient(90deg, #0969DA, #228FFE);
  border-radius: 18px;
  font-size: 12px;
  font-weight: 400;
  color: #FFFFFF;
}

.dialog-data {
  padding: 2rem 4rem 2rem 2rem;
  height: 70vh;
  .master-select{
    height: calc(100% - 5rem);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
:deep(.el-card__body){
  padding: 0 !important;
}
.container-search{
  display: flex;
  align-items: center;
  :deep(.el-form-item){
    margin: 0 !important;
  }
}
</style>
