<template>
  <el-container class="container">
    <el-header>
      <div class="form-con">
        <el-form
          ref="formDmo"
          class="form_d"
          :model="formData.val"
          size="small"
        >
          <el-form-item prop="userName">
            <el-input
              clearable
              v-model="formData.val.userName"
              :prefix-icon="Search"
              placeholder="姓名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="date">
            <el-date-picker
              placeholder="开始时间"
              v-model="state.startTime"
              type="daterange"
              @change="dateChange"
              range-separator="至"
              value-format="YYYY-MM-DD"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model="formData.val.type" placeholder="充值、退款类型">
              <el-option
                v-for="item in state.methodsType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select v-model="formData.val.status" placeholder="状态">
              <el-option
                v-for="item in state.statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="status">
            <el-radio-group
              v-model="formData.val.status"
              @change="changeRadioGroup"
            >
              <el-radio
                v-for="(item, index) in state.statusOptions"
                :key="index"
                :label="item.value"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
        <div class="btn">
          <el-button type="primary" icon="Search" @click="submitForm"
            >查询</el-button
          >
          <el-button :icon="RefreshLeft" @click="resetForm">重置</el-button>
        </div>
      </div>
    </el-header>

    <el-main>
      <el-table
        ref="factory_table"
        v-loading="loading"
        stripe
        :data="tableData"
        border
        style="width: 100%; height: calc(100vh - 27rem) !important"
        height="0"
      >
        <template v-slot:empty>
          <img src="@/assets/img/no_content.png" alt="" srcset="" />
          <p :class="{ 'el-table-empty-p': tableText }">{{ tableText }}</p>
        </template>
        <el-table-column type="index" width="50" align="center" label="序号" />
        <el-table-column label="订单号/时间" width="200" align="center">
          <template #default="scope">
            <div>{{ scope.row.retentionSn }}</div>
            <div>{{ scope.row.applyTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="姓名/手机号" width="200" align="center">
          <template #default="scope">
            <div>{{ scope.row.userName || '' }} {{ scope.row.userPhone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150" align="center" prop="status">
          <template #default="scope">
            <div class="status-step">
              <span class="text">{{
                setText(scope.row.status, scope.row.type)
              }}</span>
              <el-popover
                placement="top"
                effect="dark"
                popper-class="popper-item"
                trigger="hover"
              >
                <template #reference>
                  <el-icon :size="15"><Warning /></el-icon>
                </template>
                <p>
                  {{ scope.row.applyTime && scope.row.applyTime.slice(0, 16) }}
                  {{setSponsor(scope.row.type)}}
                </p>
                <p v-if="scope.row.status == 2">
                  {{(scope.row.executedTime && scope.row.executedTime.slice(0, 16)) || '--'}}
                  {{scope.row.type > 0 ? '充值' : scope.row.type < 0 ? '退费' : ''}}完成
                </p>
                <p v-if="scope.row.status == 3">
                  {{(scope.row.executedTime && scope.row.executedTime.slice(0, 16)) || '--' }}
                  {{ scope.row.type > 0 ? '充值' : scope.row.type < 0 ? '退费' : '' }}失败
                </p>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          header-align="center"
          align="center"
          prop="type"
        >
          <template #default="scope">
            <span>{{ setType(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="摘要" align="center" prop="summary" />
        <el-table-column
          label="金额"
          header-align="center"
          align="center"
          prop="amount"
        >
          <template #default="scope">
            <span
              >{{ scope.row.type > 0 ? '+' : scope.row.type < 0 ? '-' : ''
              }}{{ scope.row.amount }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="质保金余额" align="center" prop="totalAmount" />
        <el-table-column
          label="申请操作人"
          align="center"
          prop="createByName"
          width="150"
        >
          <template #default="scope">
            <div class="people">
              <el-image
                class="avatar-img"
                :src="
                  scope.row.applyUserId
                    ? avatarImage(scope.row.applyUserId)
                    : require('@/assets/img/avatar.png')
                "
              >
                <template #error>
                  <img
                    class="avatar-img"
                    :src="require('@/assets/img/avatar.png')"
                  />
                </template>
              </el-image>
              <span>{{ scope.row.applyUserName }}</span>
            </div>
            <p>备注：{{ scope.row.applyRemark }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="执行操作人"
          align="center"
          prop="userName"
          width="150"
        >
          <template #default="scope">
            <div class="people">
              <el-image
                class="avatar-img"
                :src="
                  scope.row.executedUserId
                    ? avatarImage(scope.row.executedUserId)
                    : require('@/assets/img/avatar.png')
                "
              >
                <template #error>
                  <img
                    class="avatar-img"
                    :src="require('@/assets/img/avatar.png')"
                  />
                </template>
              </el-image>
              <span>{{ scope.row.executedUserName }}</span>
            </div>
            <p>备注：{{ scope.row.executedRemark }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="250">
          <template #default="scope">
            <el-button
              :disabled="scope.row.status > 1"
              type="text"
              @click="handleExecute(scope.row, '同意')"
            >
              同意
            </el-button>
            <el-button
              :disabled="scope.row.status > 1"
              type="text"
              :style="scope.row.status > 1 ? 'color: #ccc' : 'color: red'"
              @click="handleExecute(scope.row, '拒绝')"
            >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination-new
        :current-page="pageObj.currentPage"
        :page-size="pageObj.pageSize"
        :total="pageObj.total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </el-footer>

    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="state.dialogVisible"
      :title="state.operationType"
      width="35rem"
    >
      <div class="dialog-con">
        <div class="label">备注</div>
        <el-input
          class="textarea-remarks"
          v-model="state.remark"
          type="textarea"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirm">确认</el-button>
          <el-button @click="state.dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts" setup>
import { avatarImage } from '@/utils/utils'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import { inject, nextTick, ref, reactive, provide, onMounted } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const formDmo: any = ref(null)
const loading = ref<boolean>(false)
const tableData: any = ref([])
const tableText: any = ref('暂无数据~')
const state = reactive({
  startTime: '',
  operationId: 0,
  dialogVisible: false,
  operationType: '',
  remark: '',
  type: 0,
  methodsType: [
    { value: 0, label: '全部' },
    { value: 1, label: '用户充值' },
    { value: 2, label: '管理员充值' },
    { value: 3, label: '公费扣除' },
    { value: -1, label: '用户退款' },
    { value: -2, label: '管理员退款' }
  ],

  statusOptions: [
    { value: 0, label: '全部' },
    { value: 1, label: '转入' },
    { value: 2, label: '转出' },
    { value: 3, label: '进行中' }
  ]
})

const setSponsor = (type:any) => {
  switch(type){
    case 1:
      return '用户发起充值'
    case 2:
      return '管理员发起充值'
    case 3:
      return '公费扣除'
    case -1:
      return '用户发起退款'
    case -2:
      return '管理员发起退款'
    default: 
      return ''
  }
}

const setType = (type:any) => {
  switch(type){
    case 1:
      return '用户充值'
    case 2:
      return '管理员充值'
    case 3:
      return '公费扣除'
    case -1:
      return '用户退款'
    case -2:
      return '管理员退款'
  }
}

const changeRadioGroup = () => {
  getData()
}

const setText = (status: any, type: any) => {
  // status 0-支付申请，1-用户/管理员申请，2-已完成，3-已拒绝
  // type 正数-充值，负数-提现
  if (type >= 0) {
    switch (status) {
      case 0:
      case 1:
        return '申请充值中'
      case 2:
        return '充值成功'
      case 3:
        return '充值失败'
    }
  } else {
    switch (status) {
      case 0:
      case 1:
        return '申请退费中'
      case 2:
        return '退费成功'
      case 3:
        return '退费失败'
    }
  }
}

const handleExecute = (row: any, type: string) => {
  state.dialogVisible = true
  state.operationType = type
  state.type = row.type
  state.operationId = row.id
}

const confirm = () => {
  let httpUrl = ''
  if (state.type > 0) {
    httpUrl = '/order/admin/retention/executeDeposit'
  } else if (state.type < 0) {
    httpUrl = '/order/admin/retention/executeWithdraw'
  }

  fetch({
    url: httpUrl,
    method: 'post',
    data: {
      executeRemark: state.remark,
      executeState: state.operationType === '同意' ? 1 : 2,
      recordId: state.operationId
    }
  }).then((res: any) => {
    if (res.code == 0) {
      ElMessage.success({
        message: '操作成功',
        type: 'success'
      })
      state.dialogVisible = false
      getData()
    }
  })
}

const submitForm = () => {
  getData()
}
const resetForm = () => {
  nextTick(() => {
    formDmo.value.resetFields()
    formData.val = {}
    getData()
  })
}
const dateChange = (date: any) => {
  formData.val.startTime = date[0] + ' ' + '00:00:00'
  formData.val.endTime = date[1] + ' ' + '00:00:00'
}
const formData = reactive({
  val: {}
} as any)

//分页
const pageObj = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 20
})
const total = reactive({
  val: {}
} as any)
const handleCurrentChange = (val: number) => {
  pageObj.currentPage = val
  getData()
}
const getData = async () => {
  loading.value = true
  await fetch({
    url: '/order/admin/retention/records',
    method: 'post',
    data: {
      current: pageObj.currentPage,
      size: pageObj.pageSize,
      ...formData.val
    }
  })
    .then((res: any) => {
      if (res.code == 0) {
        tableData.value = res.data.records
        pageObj.total = res.data.total
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const moneyTransform = (money: any) => {
  if (money && money != null) {
    money = Number(money) / 100
    money = String(money)
    let left = money.split('.')[0],
      right = money.split('.')[1]
    right = right
      ? right.length >= 2
        ? '.' + right.substr(0, 2)
        : '.' + right + '0'
      : '.00'
    let temp = left
      .split('')
      .reverse()
      .join('')
      .match(/(\d{1,3})/g)
    return (
      (Number(money) < 0 ? '-' : '') +
      temp.join(',').split('').reverse().join('') +
      right
    )
  } else if (money === 0) {
    return '0.00'
  } else {
    return '0.00'
  }
}
const getSummaries = (type: any) => {
  let nums = 0
  let values = tableData.value.map((item: any) => Number(item.amount))
  // 代表收入
  if (type == true) {
    values = values.filter((item: number) => {
      return item > 0
    })
  } else if (type == false) {
    values = values.filter((item: number) => {
      return item < 0
    })
  }
  nums = values.reduce((prev: any, curr: any) => {
    let value = Number(curr)
    if (!isNaN(value)) {
      return prev + value
    } else {
      return prev
    }
  }, 0)
  return moneyTransform(nums)
}
let document_ = document as any
const onResize = () => {
  let searcH: any = document_.querySelector('#form-search').offsetHeight
  let tableH: any = document_.querySelector('.el-table')
  tableH.style.height = `calc(100vh - 50rem) !important`
}
onMounted(() => {
  //监听窗口变化
  window.addEventListener('resize', (e) => {
    onResize()
  })
  getData()
})
</script>

<style scoped lang="less">
.form-con {
  display: flex;
  align-items: center;
  .form_d {
    display: flex;
    flex-flow: row nowrap;
    .el-form-item {
      margin-right: 2rem !important;
      .el-form-item__content {
        .el-input {
          width: 100%;
        }
        .el-select {
          width: calc(100%);
          .el-input__inner {
            color: #606266;
          }
        }
      }
    }
    .btn {
      margin-top: 2rem;
    }
  }
}

.status-step {
  display: flex;
  justify-content: center;
  align-items: center;
  .text {
    margin-right: 1rem;
  }
}

.container {
  height: calc(100vh - 11rem);
}
:deep(.el-scrollbar__view) {
  height: 100%;
}
.el-table__empty-text {
  img {
    height: 15rem;
  }
  .el-table-empty-p {
    color: #c0c4cc;
  }
}

.people {
  display: inline-block;
  background: #ecf5ff;
  border-radius: 1.1rem;
  height: 2.2rem;
  line-height: 2.2rem;
  padding-right: 1rem;
  padding-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  .avatar-img {
    display: inline-block;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
}

.popper-item {
  width: auto !important;
  p {
    font-size: 1.4rem;
    span {
      font-family: MicrosoftYaHei;
      &:last-child {
        font-size: 1.2rem;
      }
    }
  }
}

.dialog-con {
  margin-top: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .label {
    margin-right: 2rem;
  }
}
</style>
