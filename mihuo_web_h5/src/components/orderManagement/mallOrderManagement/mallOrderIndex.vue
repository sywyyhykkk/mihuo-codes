<template>
  <div class="order-index">
    <el-card>
      <el-radio-group
        v-model="state.formSearch.orderType"
        size="large"
        @change="onChangeTab"
      >
        <el-radio-button v-if="props.protType !== 2" label="-1"> 总览 </el-radio-button>
        <el-radio-button
          v-for="(item, index) in checkTabs"
          :key="index"
          :label="index+''"
        >
          {{ item }}
        </el-radio-button>
      </el-radio-group>
    </el-card>
    <div v-if="state.formSearch.orderType < 0 && props.protType !== 2" class="statusContent">
      <el-card
        v-for="(item, index) in checkTabs"
        :key="item"
        class="box-card"
      >
        <template #header>
          <div class="card-header">
            <el-tag class="ml-2" type="success">{{ item }}</el-tag>
          </div>
        </template>
        <div class="statusBody">
          <div
            v-for="o in allStatus[index]"
            :key="o.value"
            class="orderStatusstyle"
          >
            <el-link
              type="primary"
              @click="() => chooseStatus(index, o)"
            >{{ o.label
            }}<span style="margin: 0 0.5rem">({{ o.count }})</span></el-link>
          </div>
        </div>
      </el-card>
    </div>
    <el-card v-if="state.formSearch.orderType >= 0" style="margin-top: -2rem">
      <!--      订单编号，物流编号-->
      <groupComponent>
        <template #left>
          <el-select v-model="selectSn" placeholder="请选择">
            <el-option
              v-for="item in optionSn"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #right>
          <el-input
            v-model="state.formSearch[selectSn]"
            prefix-icon="Search"
            :placeholder="getPlaceHolder(optionSn, selectSn)"
          />
        </template>
      </groupComponent>
      <!--      商品名称，商品id-->
      <groupComponent v-if="!['3'].includes(state.formSearch.orderType)">
        <template #left>
          <el-select v-model="selectProduct" placeholder="请选择">
            <el-option
              v-for="item in optionProduct"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #right>
          <el-input
            v-model="state.formSearch[selectProduct]"
            prefix-icon="Search"
            :placeholder="getPlaceHolder(optionProduct, selectProduct)"
          />
        </template>
      </groupComponent>
      <!--      收货人姓名，收货人手机号-->
      <groupComponent v-if="!['3'].includes(state.formSearch.orderType)">
        <template #left>
          <el-select v-model="selectLogistics" placeholder="请选择">
            <el-option
              v-for="item in optionLogistics"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #right>
          <el-input
            v-model="state.formSearch[selectLogistics]"
            prefix-icon="Search"
            :placeholder="getPlaceHolder(optionLogistics, selectLogistics)"
          />
        </template>
      </groupComponent>
      <!--      //下单时间-->
      <groupComponent>
        <template #left>
          <el-select
            v-model="state.formSearch.timeCategory"
            placeholder="请选择"
          >
            <el-option
              v-for="item in optionDate"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #right>
          <el-date-picker
            v-model="selectedDateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          />
        </template>
      </groupComponent>
    </el-card>
    <el-card v-if="state.formSearch.orderType >= 0" style="margin-top: -2rem">
      <el-select
        v-model="state.formSearch.sourceType"
        placeholder="订单来源"
        clearable
      >
        <el-option
          v-for="item in sourceTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="state.formSearch.type"
        placeholder="订单分类"
        clearable
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- <el-select
        v-if="['0', '1', '2'].includes(state.formSearch.orderType)"
        v-model="state.formSearch.status1"
        placeholder="支付方式"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <!-- <el-select
        v-if="['3'].includes(state.formSearch.orderType)"
        v-model="state.formSearch.status1"
        placeholder="呼叫类型"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select> -->
      <el-select
        v-if="statusOptions.length"
        v-model="state.formSearch.orderStatus"
        placeholder="订单状态"
        clearable
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <!-- <el-select
        v-if="state.formSearch.orderType.includes([0])"
        v-model="state.formSearch.serviceType"
        placeholder="配送方式"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <el-select
        v-if="['1', '2', '3'].includes(state.formSearch.orderType)"
        v-model="state.formSearch.skillId"
        placeholder="所需工种"
        clearable
      >
        <el-option
          v-for="item in state.skillList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-if="['1', '2'].includes(state.formSearch.orderType)"
        v-model="state.formSearch.serviceType"
        placeholder="派单状态"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-if="['1', '2'].includes(state.formSearch.orderType)"
        v-model="state.formSearch.serviceType"
        placeholder="验收状态"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-if="['1', '2'].includes(state.formSearch.orderType)"
        v-model="state.formSearch.serviceType"
        placeholder="客户确认状态"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button icon="Search" type="primary" @click="search()">
        查询
      </el-button>
      <el-button icon="refreshLeft" @click="resetSearch()">重置</el-button>
    </el-card>
    <el-tabs
      v-if="state.formSearch.orderType >= 0"
      v-model="state.formSearch.status"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="item.value"
        :label="item.label + getOrderCount(index)"
        :name="item.value"
      />
      <!-- 商品订单、服务订单、协作订单表格 -->
      <mall-order-table
        v-show="state.formSearch.orderType != 3"
        ref="myOrder"
        :search-data="state.formSearch"
        :current="state.currentTab"
        :prot-type="props.protType"
      />
      <!-- 用户订单表格 -->
      <custom-order-table
        v-show="state.formSearch.orderType == 3"
        ref="customOrder"
        :search-data="state.formSearch"
      />
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { fetch } from '_@/axios-config/axios'
import { getPlaceHolder } from '@/components/orderManagement/order'
import {
  tabs0,
  tabs1,
  tabs2,
  tabs3,
  optionProduct0,
  optionProduct1,
  optionProduct2,
  optionLogistics0,
  optionLogistics1,
  optionDate0,
  optionDate1
} from '@/components/orderManagement/mallOrderManagement/allOrder'
import { List, orderBy } from 'lodash'
import { status } from 'nprogress'
const myOrder = ref<any>('')
const allStatus = ref<any>([])
const customOrder = ref<any>('')
const tabs = ref<any>(tabs0)
const checkTabs = computed(() => {
  if (props.protType === 2) {
    // 企业端
    return ['商品订单']
  } else {
    return ['商品订单', '服务订单', '协作订单', '用户订单']
  }
})
const selectSn = ref('orderSn')
const optionSn = ref<any>([
  { label: '订单编号', value: 'orderSn' },
  { label: '物流编号', value: 'deliverySn' }
])

const props = defineProps({
  protType: {
    type: Number,
    default: 3 // 1=平台端 2=企业端 3=运营端
  }
})

const statusOptions = []
const selectProduct = ref('productName')
const optionProduct = ref<any>(optionProduct0)
const selectLogistics = ref('receiverName')
const optionLogistics = ref<any>(optionLogistics0)
const optionDate = ref<any>(optionDate0)
const sourceTypeOptions = ref<any>([
  { label: '全部', value: '' },
  { label: 'PC订单', value: '0' },
  { label: 'app订单', value: '1' },
  { label: '供应商订单', value: '2' }
])
const typeOptions = ref<any>([
  { label: '全部', value: '2' },
  { label: '正常订单', value: '0' },
  { label: '秒杀订单', value: '1' }
])
// 时间选择器的绑定值
const selectedDateRange = ref([])
const state = reactive({
  options: [],
  skillList: [] as any,
  allTabs: [],
  currentTab: 0,
  formSearch: {
    status: '-1',
    orderType: '-1',
    skillId: '',
    timeCategory: 'createTime',
    cityOperatorFlag: 1
  } as any
})

const dateChange = () => {
  state.formSearch.startTime = state.formSearch.date[0]
  state.formSearch.endTime = state.formSearch.date[1]
  console.log(state.formSearch)
}

// 总览的这切换状态
const chooseStatus = (orderType: any, status: any) => {
  state.formSearch.orderType = orderType + ''
  state.formSearch.status = status.value
  state.formSearch.cityOperatorFlag = orderType == 0 ? 2 : 1
  handleClick()
}

// 搜索
const search = () => {
  settingData()
  if (state.formSearch.orderType == 3) {
    customOrder.value && customOrder.value.getData(true)
    return
  }
  getAllStatus()
  myOrder.value.getData(true)
}

// 重置
const resetSearch = () => {
  if (state.formSearch.orderType !== -1) {
    state.formSearch.status = '-1'
    state.formSearch.skillId = ''
    state.formSearch.timeCategory = 'createTime'
    state.formSearch.productName = ''
    state.formSearch.orderSn = null
    selectProduct.value = 'productName'
    selectLogistics.value = 'receiverName'
    state.formSearch[selectSn.value] = null
    state.formSearch[selectProduct.value] = null
    state.formSearch[selectLogistics.value] = null
    state.formSearch.startTime = ''
    state.formSearch.endTime = ''
    selectedDateRange.value = []
    state.formSearch.sourceType = null
    state.formSearch.type = null
    if (state.formSearch.orderType == 3) {
      // 用户订单
      state.formSearch.orderSn = null
      state.formSearch.orderCode = null
      customOrder.value && customOrder.value.getData(false)
      return
    }
    myOrder.value.getData(false)
  }
}

// 不能直接绑定handleClick
const onChangeTab = (e: any) => {
  state.formSearch.cityOperatorFlag = (e == 0) ? 2 : 1
  handleClick()
  state.currentTab = e
  state.formSearch.status = '-1'
}

const handleClick = () => {
  state.formSearch = {
    status: state.formSearch.status,
    skillId: '',
    timeCategory: 'createTime',
    orderType: state.formSearch.orderType,
    orderSn: null,
    cityOperatorFlag: state.formSearch.cityOperatorFlag
  }
  if (!['3'].includes(state.formSearch.orderType)) {
    typeOptions.value = [
      { label: '全部', value: 2 },
      { label: '正常订单', value: 0 },
      { label: '秒杀订单', value: 1 }
    ]
  }
  if (state.formSearch.orderType == '-1') {
    // 初始化时 orderType = '-1'
    getAllStatus()
  }
  // 商品订单
  if (state.formSearch.orderType === '0') {
    tabs.value = tabs0
    optionProduct.value = optionProduct0
    optionLogistics.value = optionLogistics0
    optionDate.value = optionDate0
  }
  // 服务订单
  if (['1'].includes(state.formSearch.orderType)) {
    tabs.value = tabs1
    optionProduct.value = optionProduct1
    optionLogistics.value = optionLogistics1
    optionDate.value = optionDate1
  }
  // 协作订单
  if (['2'].includes(state.formSearch.orderType)) {
    tabs.value = tabs2
    optionProduct.value = optionProduct2
    optionLogistics.value = optionLogistics1
    optionDate.value = optionDate1
  }
  // 用户订单
  if (['3'].includes(state.formSearch.orderType)) {
    tabs.value = tabs3
    optionProduct.value = optionProduct1
    optionLogistics.value = optionLogistics1
    optionDate.value = optionDate1
    sourceTypeOptions.value = [
      { label: '全部', value: 0 },
      { label: 'C端', value: 1 },
      { label: '服务端', value: 2 },
      { label: '企业端', value: 3 },
      { label: '平台端', value: 4 }
    ]
    typeOptions.value = [
      { label: '全部', value: 0 },
      { label: '指派', value: 1 },
      { label: '抢单', value: 2 }
    ]
    nextTick(() => {
      customOrder.value && customOrder.value.getData(true, true)
    })
  } else {
    nextTick(() => {
      myOrder.value && myOrder.value.getData(true, true)
    })
  }
  settingData()
}

// 得到工种
const getSkill = () => {
  fetch({
    url: `/admin/sysjobskill/getJobSkillList`,
    method: 'get'
  }).then((res: any) => {
    const skillList: any = res.data.map((item: any) => ({
      label: item.skillName,
      value: item.skillId
    }))
    state.skillList.push(...skillList)
  })
}

const settingData = () => {
  const data = {}
  Object.keys(state.formSearch).forEach((res: any) => {
    if (state.formSearch[res]) {
      data[res] = state.formSearch[res]
    }
  })
  state.formSearch = data
}

// 获取总览的未读数量
// 1=服务订单 2-协作订单 3-用户
const getAllStatus = () => {
  fetch({
    url: `/mall/order/overview`,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      const biz = res.data.biz
      const products = res.data.products
      const service = res.data.service
      const sop = res.data.sop
      const newproducts = products.map((item: any, index: any) => {
        const miniitem = {
          ...item,
          ...tabs0[index + 1]
        }
        return miniitem
      })
      const newservice = service.map((item: any, index: any) => {
        const miniitem = {
          ...item,
          ...tabs1[index + 1]
        }
        return miniitem
      })
      newservice.pop()
      const newsop = sop.map((item: any, index: any) => {
        const miniitem = {
          ...item,
          ...tabs2[index + 1]
        }
        return miniitem
      })
      const newbiz = biz.map((item: any, index: any) => {
        const miniitem = {
          ...item,
          ...tabs3[index + 1]
        }
        return miniitem
      })
      allStatus.value = [newproducts, newservice, newsop, newbiz]
    }
  })
}

// 企业端 获取商品订单数量
const getOrderCount = (index: number) => {
  if (index === 0) return ''
  if (props.protType === 2 && allStatus.value.length) {
    return `(${allStatus.value[0][index - 1].count})`
  }
  return ''
}

onMounted(() => {
  getSkill()
  getAllStatus()
  if (props.protType === 2) {
    // 企业端自动切换到商品订单
    state.formSearch.orderType = '0'
  }
})
</script>

<style scoped lang="less">
.demo-tabs {
  // margin-top: -26px;
}
.orderStatusstyle {
  display: block;
  font-size: 1.3rem;
  margin: 2rem;
  cursor: pointer;
  color: #999;
}
.statusBody {
  text-align: center;
  width: 100%;
}
.card-header {
  text-align: center;
}
.statusContent {
  display: flex;
  .box-card{
    flex: 1;
  }
}
</style>
