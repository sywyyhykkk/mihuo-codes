<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '套餐查看',
  components: {},
  setup() {}
})
</script>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { fetch } from '../../axios-config/axios'

const state = ref({
  loading: false,
  tableData: [],
  total: 0,
  current: 1
})

const insuranceNames = [
  '意外事故',
  '意外残疾',
  '意外医疗',
  '意外住院补贴',
  '猝死'
]
const insuranceInfo = {
  insuranceName: '',
  indemnifyManner: '',
  description: null,
  sort: null
}

const insuranceInfoList = insuranceNames.map((item) => ({
  ...insuranceInfo,
  insuranceName: item
}))

const showDialog = ref(false)
const formRef = ref()
const formData = ref<any>({
  insuranceInfoList
})
const formRules = reactive({
  setmealName: [
    { required: true, message: '套餐名称不能为空', trigger: 'blur' }
  ],
  setmealAmount: [
    { required: true, message: '套餐金额不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  state.value.loading = true
  try {
    const res: any = await fetch({
      url: '/order/insurancesetmeal/getInsuranceSetmealPage',
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

const handleAdd = () => {
  formRef.value?.resetFields()
  formData.value = {
    insuranceInfoList: JSON.parse(JSON.stringify(insuranceInfoList))
  }
  showDialog.value = true
}

const handleEdit = (row: any) => {
  formRef.value?.resetFields()
  const cur = JSON.parse(JSON.stringify(row))
  formData.value = { ...row, insuranceInfoList: cur.insuranceInfos }
  showDialog.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `将永久删除 <strong>${row.setmealName}</strong> 的套餐？ 是否继续？`,
    {
      dangerouslyUseHTMLString: true,
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }
  ).then(async () => {
    try {
      const res: any = await fetch({
        method: 'post',
        url: '/order/insurancesetmeal/updateOrDeleteInsuranceSetmeal',
        data: {
          deleteStatus: 1,
          id: row.id
        }
      })
      if (res.code === 0) {
        ElMessage.success('套餐删除成功!')
        fetchData()
      }
    } catch (error) {
      ElMessage.error('套餐删除失败!')
      console.error(error)
    }
  })
}

const onColsed = (formEl: any) => {
  formEl.resetFields()
  showDialog.value = false
}

const onSubmit = async (formEl: any) => {
  const indemnifyManner = formData.value.insuranceInfoList.every(
    (item: any) => item.indemnifyManner
  )
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid && indemnifyManner) {
      if (formData.value.id) onEditSave()
      else onAddSave()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onAddSave = async () => {
  try {
    const res: any = await fetch({
      method: 'post',
      url: '/order/insurancesetmeal/addInsuranceSetmeal',
      data: {
        setmealAmount: formData.value.setmealAmount,
        setmealName: formData.value.setmealName,
        insuranceInfoList: formData.value.insuranceInfoList
      }
    })
    if (res.code === 0) {
      ElMessage.success('修改成功!')
      showDialog.value = false
      formRef.value?.resetFields()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}

const onEditSave = async () => {
  try {
    const res: any = await fetch({
      method: 'post',
      url: '/order/insurancesetmeal/updateOrDeleteInsuranceSetmeal',
      data: {
        deleteStatus: 0,
        id: formData.value.id,
        setmealAmount: formData.value.setmealAmount,
        setmealName: formData.value.setmealName,
        insuranceInfoList: formData.value.insuranceInfoList
      }
    })

    if (res.code === 0) {
      ElMessage.success('修改成功!')
      showDialog.value = false
      formRef.value?.resetFields()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="set-meal">
    <el-card>
      <div />
      <el-button type="primary" size="large" @click="handleAdd"
        >新增套餐</el-button
      >
    </el-card>
    <el-table
      v-loading="state.loading"
      border
      stripe
      :data="state.tableData"
      :row-style="{ height: '40px' }"
      :header-row-style="{ height: '50px' }"
    >
      <el-table-column width="220" align="center" label="套餐名称">
        <template #default="{ row }">
          <el-space :size="8">
            <span> {{ row.setmealName }} </span>
            <el-popover placement="right-start" :width="320" trigger="hover">
              <template #default>
                <div
                  v-for="(item, index) of row.insuranceInfos"
                  :key="index"
                  class="popover-item"
                >
                  <strong style="font-size: 12px">{{
                    item.insuranceName
                  }}</strong>
                  <p style="margin-top: 5px">
                    保障额度 {{ item.indemnifyManner }}
                  </p>
                  <p style="margin-top: 10px; font-size: 10px">
                    {{ item.description }}
                  </p>
                </div>
              </template>
              <template #reference>
                <el-icon :size="14">
                  <Warning />
                </el-icon>
              </template>
            </el-popover>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column align="center" label="套餐金额">
        <template #default="{ row }">
          <span> ￥{{ getSeparator(row.setmealAmount) }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="意外事故">
        <template #default="{ row }">
          <span> {{ row.contingency }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="意外残疾">
        <template #default="{ row }">
          <span> {{ row.deformity }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="意外医疗">
        <template #default="{ row }">
          <span> {{ row.treatment }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="意外住院补贴">
        <template #default="{ row }">
          <span> {{ row.hospitalization }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="猝死">
        <template #default="{ row }">
          <span> {{ row.suddenDeath }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">修改</el-button>
          <el-button
            type="text"
            @click="handleDelete(row)"
            style="color: #f56c6c"
            >删除</el-button
          >
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
      v-model="showDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      z-index="99"
      title="新增套餐"
      width="40rem"
      @closed="onColsed(formRef)"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        class="combo-form"
        label-width="12rem"
      >
        <el-form-item label="套餐名称" prop="setmealName">
          <el-input v-model="formData.setmealName" placeholder="套餐名称" />
        </el-form-item>
        <el-form-item label="套餐金额/￥" prop="setmealAmount">
          <el-input-number
            v-model="formData.setmealAmount"
            :controls="false"
            :min="0"
            placeholder="套餐金额"
          />
        </el-form-item>
        <template
          v-for="(item, index) in formData.insuranceInfoList"
          :key="index"
        >
          <el-divider content-position="center">{{
            item.insuranceName
          }}</el-divider>
          <!-- <el-form-item label="套餐名称">
            <el-input
              v-model="item.insuranceName"
              readonly
              placeholder="套餐名称"
            />
          </el-form-item> -->
          <el-form-item required label="保障金额">
            <el-input v-model="item.indemnifyManner" placeholder="保障金额" />
          </el-form-item>
          <el-form-item label="保险描述">
            <el-input
              v-model="item.description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="保险描述"
            />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="onColsed(formRef)">取 消</el-button>
          <el-button type="primary" @click="onSubmit(formRef)">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.set-meal {
  :deep(.el-card) {
    .el-card__body {
      justify-content: space-between;
    }

    .el-button {
      width: 12rem;
      height: 4rem;
    }
  }
}

.query-wper {
  margin: 2rem 0;
  :deep(.el-input) {
    width: 30rem !important;
  }
}

.popover-item + .popover-item {
  margin-top: 20px;
}
</style>
