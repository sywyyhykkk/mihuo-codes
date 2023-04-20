<template>
  <div class="statement">
    <el-card>
      <el-space :size="20">
        <el-space :size="20">
          <span>发布时间:</span>
          <el-date-picker
            v-model="queryState.picker"
            type="datetimerange"
            range-separator="~"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-space>
        <el-select
          v-model="queryState.isverify"
          class="m-2"
          placeholder="审核状态"
        >
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" style="width: 80px" @click="handleQuery"
          >查询</el-button
        >
        <el-button style="width: 80px" @click="handleReset">重置</el-button>
      </el-space>
    </el-card>

    <el-table
      v-loading="state.loading"
      border
      stripe
      :data="state.tableData"
      :header-cell-style="headerStyle"
      :span-method="arraySpanMethod"
      height="100vh"
      row-style="height: 50px;"
      style="width: 100%"
    >
      <el-table-column label="发布时间">
        <el-table-column width="20px">
          <template #default="{ row }">
            <el-space
              v-if="row.customerId"
              :size="20"
              style="margin-left: 10px"
            >
              <span>姓名: {{ row.customerName }}</span>
              <span>电话: {{ row.customerPhone }}</span>
              <span>
                是否实名:
                {{ row.customerRealStatus === 1 ? '已实名' : '未实名' }}
              </span>
              <!-- <span>注册来源: {{ row.customerRealStatus }}</span> -->
            </el-space>
            <div v-else style="text-align: center">{{ row.created }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created" align="center" />
      </el-table-column>
      <el-table-column prop="verifyStatus" align="center" label="审核状态">
        <template #default="{ row }">
          <span>{{ getVerifyState(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" width="220" label="需求描述" />
      <el-table-column prop="poiName" width="200" label="施工地点" />
      <el-table-column prop="views" align="center" label="浏览量" />
      <el-table-column prop="efficientNum" align="center" label="有效量" />
      <el-table-column align="center" label="有效率">
        <template #default="{ row }">
          <span v-if="row.efficientRate === 0">
            {{ row.efficientRate }}
          </span>
          <el-link
            v-else
            type="primary"
            @click="
              $router.push({
                path: '/statement/effective-dose',
                query: { id: row.id }
              })
            "
          >
            {{ (row.efficientRate * 1000) / 10 + '%' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="cooperationNum"
        align="center"
        label="达成合作量"
      />
      <el-table-column align="center" label="达成合作率">
        <template #default="{ row }">
          <span>
            <span v-if="row.cooperationRate === 0">
              {{ row.cooperationRate }}
            </span>
            <el-link
              v-else
              type="primary"
              @click="
                $router.push({
                  path: '/statement/measurable-actions',
                  query: { id: row.id }
                })
              "
            >
              {{ (row.cooperationRate * 1000) / 10 + '%' }}
            </el-link>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="state.total"
      :current-page="state.current"
      layout="total, prev, pager, next, jumper"
      @current-change="currentChange"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '统计报表',
  components: {},
  setup() {}
})
</script>
<script setup lang="ts">
import { ref } from 'vue'
import { fetch } from '../../axios-config/axios'

const queryState = reactive({
  picker: '',
  isverify: ''
})
const stateOptions = [
  {
    value: '0',
    label: '待审核'
  },
  {
    value: '1',
    label: '已通过'
  },
  {
    value: '2',
    label: '未通过'
  }
]
const state = ref({
  loading: false,
  tableData: [],
  total: 0,
  current: 1
})

onMounted(() => {
  fetchData()
})

const headerStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  if (rowIndex === 1) {
    return { display: 'none' }
  }
}

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (row.customerId) {
    if (columnIndex === 0) {
      return [1, 10]
    } else if (columnIndex >= 1) {
      return [0, 0]
    }
  } else {
    if (columnIndex === 0) {
      return [1, 2]
    } else if (columnIndex === 1) {
      return [0, 0]
    }
  }
}

const fetchData = async () => {
  state.value.loading = true
  try {
    const res: any = await fetch({
      url: '/order/bizdemandconsultation/page',
      method: 'get',
      params: {
        startDate: queryState.picker[0] || '',
        endDate: queryState.picker[1] || '',
        verifyStatus: queryState.isverify,
        current: state.value.current
      }
    })
    if (res.code === 0) {
      const { total, current, records } = res.data
      state.value.total = Number(total)
      state.value.current = Number(current)
      state.value.tableData = groupData(records)
    } else {
      throw new Error(res)
    }
    state.value.loading = false
  } catch (error) {
    console.error(error)
    state.value.loading = false
  }
}

const currentChange = (page: any) => {
  state.value.current = page
  fetchData()
}

const handleQuery = () => {
  fetchData()
}
const handleReset = () => {
  queryState.isverify = ''
  queryState.picker = ''
  fetchData()
}

const groupData = (data: any) => {
  const temps = Object.create(null)
  for (const item of data) {
    const userItem = {
      customerId: item.customerId,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      customerRealStatus: item.customerRealStatus
    }
    Reflect.deleteProperty(item, 'customerId')
    Reflect.deleteProperty(item, 'customerName')
    Reflect.deleteProperty(item, 'customerPhone')
    Reflect.deleteProperty(item, 'customerRealStatus')
    const key = `${userItem.customerId}_${userItem.customerName}`
    if (!Reflect.has(temps, key)) {
      temps[key] = [userItem, item]
    } else {
      temps[key].push(item)
    }
  }
  const result = Object.entries(temps).reduce(
    (prev, [key, value]) => prev.concat(value as any),
    []
  )
  return result
}

const getVerifyState = (row: any) => {
  if (row.verifyStatus === 1) {
    return '已通过'
  } else if (row.verifyStatus === 2) {
    return '未通过'
  } else {
    return '待审核'
  }
}
</script>

<style scoped lang="less">
:deep(.el-range-editor) {
  width: 40rem !important;
}
</style>
