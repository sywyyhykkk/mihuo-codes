<template>
  <div class="rule-setting">
    <el-divider border-style="none" />
    <el-table
      v-loading="state.loading"
      border
      stripe
      :data="state.tableData"
      row-style="height: 50px;"
      header-row-style="height: 50px;"
      style="width: 100%"
    >
      <el-table-column width="220" align="center" label="工种">
        <template #default="{ row }">
          <span> {{ row.skillName }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="质保金额">
        <template #default="{ row }">
          <span v-if="row.createBy === '-1'" key="retentionMoney-status">
            未设置
          </span>
          <span v-else key="retentionMoney-result">
            ￥{{ getSeparator(row.retentionMoney) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工费扣除比例">
        <template #default="{ row }">
          <span v-if="row.createBy !== '-1'" key="costDeductRatio-result">
            {{ row.costDeductRatio * 100 }}% / 次
          </span>
          <span v-else key="costDeductRatio-status"> 未设置 </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="质保金期限">
        <template #default="{ row }">
          <span v-if="row.createBy === '-1'" key="createBy-status">
            未设置
          </span>
          <span v-else key="createBy-result"> {{ row.retentionDays }} 天 </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间 ">
        <template #default="{ row }">
          <span v-if="row.createBy === '-1'"> - </span>
          <span v-else> {{ row.createTime }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="state.total"
      :current-page="state.current"
      layout="total, prev, pager, next, jumper"
      @current-change="currentChange"
    />

    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="规则设置"
      :before-close="handleClose"
      width="50rem"
    >
      <el-form
        class="rule-setting-form"
        label-width="12rem"
        :model="dialogData"
      >
        <el-form-item label="工种">
          <el-input v-model="dialogData.skillName" placeholder="姓名" />
        </el-form-item>

        <el-form-item label="质保金额">
          <el-space>
            <el-input-number
              v-model="dialogData.retentionMoney"
              :controls="false"
              :min="0"
              placeholder="质保金额"
            />
            <span>元</span>
          </el-space>
        </el-form-item>
        <el-form-item label="工费扣除比例">
          <el-space>
            <el-input-number
              v-model="dialogData.costDeductRatio"
              :controls="false"
              :min="0"
              :max="100"
              placeholder="工费扣除比例"
            />
            <span>% / 次</span>
          </el-space>
        </el-form-item>
        <el-form-item label="质保金期限">
          <el-space>
            <el-input-number
              v-model="dialogData.retentionDays"
              :controls="false"
              :min="0"
              placeholder="质保金期限"
            />
            <span>天</span>
          </el-space>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" style="width: 80px" @click="handleConfirm"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { fetch } from '../../axios-config/axios'

const dialogVisible = ref(false)
const dialogData = ref<any>({})

const state = ref({
  loading: false,
  tableData: [],
  total: 0,
  current: 1
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  state.value.loading = true
  try {
    const res: any = await fetch({
      url: '/admin/skillRetentionMoneyConfig/configs',
      method: 'get',
      params: {
        current: state.value.current
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

const currentChange = (page: any) => {
  state.value.current = page
  fetchData()
}

const getSeparator = (value: number) => {
  const reg = /(?!^)(?=(\d{3})+$)/g
  return value
    .toString()
    .replace(/\d+/, (n) => n.replace(reg, ($1) => $1 + ','))
}

const handleEdit = ({
  skillId,
  skillName,
  retentionMoney,
  costDeductRatio,
  retentionDays
}: any) => {
  dialogData.value = {
    skillId,
    skillName,
    retentionMoney,
    costDeductRatio: costDeductRatio * 100,
    retentionDays
  }
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleConfirm = async () => {
  dialogVisible.value = false
  state.value.loading = true
  delete dialogData.value.skillName

  try {
    const res: any = await fetch({
      url: '/admin/skillRetentionMoneyConfig/config',
      method: 'put',
      data: {
        ...dialogData.value,
        costDeductRatio: dialogData.value.costDeductRatio / 100
      }
    })
    if (res.code === 0) {
      ElMessage.success('编辑成功!')
      fetchData()
    } else {
      throw new Error(res)
    }
  } catch (error) {
    console.error(error)
  }
  dialogVisible.value = false
  state.value.loading = false
}
</script>

<style scoped lang="less">
.query-wper {
  margin: 2rem 0;
  :deep(.el-input) {
    width: 30rem !important;
  }
}
</style>
