<template>
  <div class="effective-dose">
    <el-table
      v-loading="state.loading"
      border
      stripe
      :data="state.tableData"
      height="100vh"
      row-style="height: 50px;"
      header-row-style="height: 50px;"
      style="width: 100%"
    >
      <el-table-column type="index" align="center" width="60px" label="编号" />
      <el-table-column prop="userName" align="center" label="反馈者" />
      <el-table-column align="center" label="是否实名">
        <template #default="{ row }">
          <span>
            {{ row.userRealStatus === 1 ? '已实名' : '未实名' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="userPhone" align="center" label="联系电话" />
      <el-table-column align="center">
        <template #header>
          <el-select
            v-model="isReal"
            size="small"
            placeholder="信息是否真实"
            clearable
            @change="changeReal"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #default="{ row }">
          {{ row.isReal === 1 ? '真实' : '不真实' }}
        </template>
      </el-table-column>
      <!-- <el-table-column
      prop="reason"
      width="340px"
      align="center"
      label="反馈信息"
    /> -->
      <el-table-column prop="created" align="center" label="创建时间" />
    </el-table>
    <div class="statistics">
      <span
        >统计：{{ parseInt(state.stat.total) }}人反馈，{{
          parseInt(state.stat.efficientNum)
        }}人反馈真实，{{
          parseInt(state.stat.total) - parseInt(state.stat.efficientNum)
        }}人反馈不真实</span
      >
    </div>
    <el-pagination
      :total="state.total"
      :current-page="state.current"
      layout="total, prev, pager, next, jumper"
      @current-change="currentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetch } from '../../axios-config/axios'

const route = useRoute()

const isReal = ref('')
const state = ref<any>({
  loading: false,
  tableData: [],
  total: 0,
  current: 1,
  stat: {}
})

const stateOptions = [
  {
    value: '1',
    label: '真实'
  },
  {
    value: '0',
    label: '不真实'
  }
]

onMounted(() => {
  fetchData()
  fetchDataStat()
})

const fetchData = async () => {
  state.value.loading = true
  try {
    const res: any = await fetch({
      url: '/order/bizdemandconsultation/getRecordPage',
      method: 'get',
      params: {
        consultationId: route.query.id,
        current: state.value.current,
        isReal: isReal.value
      }
    })
    if (res.code === 0) {
      const { total, current, records } = res.data
      state.value.total = Number(total)
      state.value.current = Number(current)
      state.value.tableData = records
    } else {
      throw new Error(res)
    }
    state.value.loading = false
  } catch (error) {
    console.error(error)
    state.value.loading = false
  }
}

const fetchDataStat = async () => {
  try {
    const res: any = await fetch({
      url: `/order/bizdemandconsultation/recordChart/${route.query.id}`,
      method: 'get'
    })
    if (res.code === 0) {
      state.value.stat = res.data
    } else {
      throw new Error(res)
    }
  } catch (error) {
    console.error(error)
  }
}

const changeReal = () => {
  fetchData()
}

const currentChange = (page: any) => {
  state.value.current = page
  fetchData()
}
</script>

<style scoped lang="less">
:deep(.el-select) {
  width: auto !important;
}

.statistics {
  display: flex;
  justify-content: end;

  margin-top: 28px;

  color: #dd7f07;
}
</style>
