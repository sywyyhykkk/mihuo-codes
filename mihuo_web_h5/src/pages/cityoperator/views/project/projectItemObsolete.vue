<template>
  <el-card>
    <el-input
      v-model="state.address"
      prefix-icon="Search"
      clearable
      placeholder="项目地址"
    />
    <div class="el-card-right">
      <el-button
        type="primary"
        icon="Search"
        @click="loadRecoverProjectPage()"
      >
        查询
      </el-button>
    </div>
  </el-card>
  <el-table
    v-loading="state.loading"
    border
    stripe
    :data="state.data"
    highlight-current-row
    height="100vh"
  >
    <!--            <el-table-column type="selection" width="60" align="center" />-->
    <el-table-column
      type="index"
      width="50"
      align="center"
      label="序号"
    />
    <!-- <el-table-column label="项目地址" prop="latAddress" width="220" /> -->
    <el-table-column label="项目地址" align="left" width="260">
      <template #default="{ row }">
        <span>{{ row.poiName || '' }} {{ row.address }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="客户姓名"
      width="140"
      align="center"
      prop="customerName"
    />
    <el-table-column label="客户性别" width="100" align="center">
      <template #default="{ row }">
        <div>
          {{
            row.customerGender == 2 ? '女' : row.customerGender == 1 ? '男' : ''
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="客户电话"
      width="140"
      align="center"
      prop="customerPhone"
    />
    <el-table-column
      label="客户编码"
      width="180"
      align="center"
      prop="customerCode"
    />
    <el-table-column
      label="施工合同编号"
      align="center"
      width="180"
      prop="contractCode"
    />
    <el-table-column
      label="合同工期(天)"
      align="center"
      width="150"
      prop="contractDuration"
    />
    <el-table-column label="合同金额(元)" align="center" width="150">
      <template #default="scope">
        <div class="contract-amount">￥{{ scope.row.contractAmount }}</div>
      </template>
    </el-table-column>
    <el-table-column
      label="户型"
      width="100"
      align="center"
      prop="model"
    />
    <el-table-column
      label="房型"
      width="100"
      align="center"
      prop="roomType"
    />
    <el-table-column
      label="面积(m²)"
      width="100"
      align="center"
      prop="usableArea"
    />
    <el-table-column
      label="装修方式"
      width="160"
      align="center"
      prop="way"
    />
    <!-- <el-table-column label="操作" fixed="right" width="120" align="center">
      <template #default="{ row }">
        <el-button
          link
          size="small"
          type="text"
          icon="documentChecked"
          @click="handleRecover(row)"
          v-if="$getPression('order_bizproject_recover')"
          >恢复</el-button
        >
      </template>
    </el-table-column> -->
  </el-table>

  <el-pagination
    :total="state.total"
    :current-page="state.current"
    layout="total, prev, pager, next, jumper"
    @current-change="currentChange"
  />
</template>
<script lang="ts">
export default {
  name: '作废项目管理'
}
</script>
<script setup lang="ts">
import { onMounted, ref, defineProps } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '../../axios-config/axios'

const state = ref({
  loading: false,
  total: 0,
  current: 1,
  address: '',
  data: []
})

onMounted(() => {
  loadRecoverProjectPage()
})

const loadRecoverProjectPage = () => {
  state.value.loading = true
  fetch({
    url: ' /order/bizproject/recoverProjectPage',
    method: 'get',
    params: { current: state.value.current, address: state.value.address }
  }).then((res:any) => {
    if (res.code === 0) {
      const { total, current, records } = res.data
      state.value.total = Number(total)
      state.value.current = Number(current)
      state.value.data = records
      state.value.loading = false
    }
  })
}

function handleRecover(row: any) {
  ElMessageBox.confirm(
    `是否恢复<strong>【${row.poiName} ${row.address}】</strong>的项目?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      type: 'warning'
    }
  ).then(() => {
    fetch({
      url: '/order/bizproject/recover',
      method: 'post',
      params: { projectId: row.id }
    }).then((res: any) => {
      if (res.code == 0) {
        ElMessage.success('作废成功!')
        loadRecoverProjectPage()
      }
    })
  })
}

function currentChange(page: number) {
  state.value.current = page
  loadRecoverProjectPage()
}
</script>

<style scoped lang="less"></style>
