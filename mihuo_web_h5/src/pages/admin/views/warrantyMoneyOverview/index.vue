<template>
  <div>
    <el-card shadow="never">
      <el-input
        v-model="listQuery.userName"
        style="margin-right: 10px; width: 150px"
        prefix-icon="search"
        placeholder="姓名"
      />
      <!-- <el-select
        v-model="listQuery.publishStatus"
        style="margin-right: 10px; width: 150px"
        placeholder="交款情况"
        clearable
      >
        <el-option
          v-for="item in paymentStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.verifyStatus"
        style="margin-right: 10px; width: 150px"
        placeholder="退款状态"
        clearable
      >
        <el-option
          v-for="item in refundStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <el-select
        v-model="listQuery.skillId"
        style="margin-right: 10px; width: 150px"
        placeholder="工种"
        clearable
      >
        <el-option
          v-for="item in skillOptions"
          :key="item.skillId"
          :label="item.skillName"
          :value="item.skillId"
        />
      </el-select>
      <el-button
        style="margin-right: 10px"
        :type="buttonType"
        size="small"
        class="btn-add"
        icon="Search"
        @click="handleSearchList()"
      >
        查询
      </el-button>
      <el-button
        style="margin-right: 10px"
        size="small"
        @click="handleResetSearch()"
      >
        重置
      </el-button>
    </el-card>

    <div class="amount-money">质保金余额：{{ totalRetentionAmount }}元</div>

    <div>
      <el-table
        ref="productCateTable"
        v-loading="loading"
        stripe
        style="width: 100%"
        :data="tableData"
        :height="tableHeight"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" align="center" label="序号" />
        <el-table-column label="姓名" align="center" prop="realName" />
        <el-table-column label="手机号" align="center" prop="phone" />
        <el-table-column label="工种" align="center">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.persons" :key="index">
              {{
                item.skillName +
                '（' +
                '默认金额：' +
                item.maxRetentionAmount +
                '）'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="上次订单完成时间"
          align="center"
          prop="lastOrderTime"
        >
          <template #default="scope">
            {{ scope.row.lastOrderTime || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="应缴质保金金额" align="center" prop="maxRetentionAmount" />
        <el-table-column label="账户余额" align="center" prop="retentionAmount" />

        <el-table-column label="操作" fixed="right" width="220" align="center">
          <template #default="scope">
            <el-button type="text" @click="handleApplye(scope.row, '充值')">
              充值申请
            </el-button>
            <el-button type="text" @click="handleApplye(scope.row, '退费')">
              退费申请
            </el-button>
            <el-button type="text" @click="handleApplye(scope.row, '使用')">
              质保金使用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="+pageSize"
      :total="+total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />

    <!-- 充值 -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="rechargeVisible"
      title="充值申请"
      width="35rem"
    >
      <el-form
        ref="rechargeForm"
        :model="formData"
        class="form_flex-rech"
        label-width="2rem"
        :rules="rules"
      >
        <div class="title" style="padding-top: 2rem; padding-bottom: 0">
          充值金额
        </div>
        <el-form-item prop="amount">
          <el-input
            class="only"
            v-model="formData.amount"
            type="number"
            :min="0"
          >
            <template #prefix>
              <img
                style="width: 2.5rem; height: 2rem; padding-left: 4rem"
                src="@/assets/img/amount.png"
                alt=""
              />
            </template>
          </el-input>
        </el-form-item>
        <div class="title">充值金备注</div>
        <el-form-item prop="applyRemark">
          <el-input
            class="textarea-remarks"
            v-model="formData.applyRemark"
            type="textarea"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirm" :loading="loadingBtn"
            >确认</el-button
          >
          <el-button @click="rechargeVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 退费、使用 -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="refundVisible"
      v-if="operationType"
      :title="operationType + '申请'"
      width="35rem"
    >
      <el-form
        ref="refundForm"
        :model="formData2"
        class="form_flex-rech"
        label-width="2rem"
        :rules="rules"
      >
        <div class="title" style="padding-top: 2rem; padding-bottom: 0">
          {{operationType}}金额
        </div>
        <el-form-item prop="amount">
          <el-input
            class="only"
            v-model="formData2.amount"
            type="number"
            @input="(value) => changeVal(value)"
            :min="0"
          >
            <template #prefix>
              <img
                style="width: 2.5rem; height: 2rem; padding-left: 4rem"
                src="@/assets/img/amount.png"
                alt=""
              />
            </template>
          </el-input>
        </el-form-item>
        <div class="title">{{operationType}}金备注</div>
        <el-form-item prop="applyRemark">
          <el-input
            class="textarea-remarks"
            v-model="formData2.applyRemark"
            type="textarea"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirm" :loading="loadingBtn"
            >确认</el-button
          >
          <el-button @click="refundVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import { useRouter } from 'vue-router'
import { async } from '@antv/x6/lib/registry/marker/main'
import TemplateNode from '@/pages/enterprise/views/basicConfiguration/templateNode.vue'

export default defineComponent({
  components: { TemplateNode },
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    },
    companyId: {
      // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    },
    buttonType: {
      type: String,
      default: 'primary'
    }
  },
  setup(props) {
    const router = useRouter()
    const tableHeight = ref<any>(0)
    const refundAmount = ref<any>(0)
    const totalRetentionAmount = ref<any>(0)
    const loadingBtn = ref<boolean>(false)
    const rechargeVisible = ref<boolean>(false)
    const refundVisible = ref<boolean>(false)
    const rechargeForm = ref<any>('')
    const refundForm = ref<any>('')
    const operationType = ref<any>('')
    const formData = reactive({
      amount: null,
      applyRemark: '',
      userId: null
    } as any)
    const formData2 = reactive({
      amount: null,
      applyRemark: '',
      userId: null
    } as any)
    const rules = reactive({
      amount: [
        { required: true, message: '请输入申请充值金额', trigger: 'change' }
      ],
      applyRemark: [
        { required: true, message: '请输入申请充值金备注', trigger: 'change' }
      ]
    })
    const state = reactive<any>({
      loading: false,
      tableData: [],
      mallIds: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      paymentStatusOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '已交清'
        },
        {
          value: 2,
          label: '未交清'
        }
      ],
      refundStatusOptions: [
        {
          value: 2,
          label: '申请退款中'
        },
        {
          value: 1,
          label: '退款失败'
        },
        {
          value: 0,
          label: '已退款'
        }
      ],
      skillOptions: [],
      listQuery: {
        userName: '',
        skillId: ''
      }
    })

    const changeVal = (val: any) => {
      const volid = {
        validator: (rule: any, value: any, callback: any) => {
          if (value === '') {
            callback(new Error('请输入退款金额'))
          } else {
            if (parseFloat(val) > refundAmount.value) {
              callback(new Error('不能大于实缴金额'))
            }
          }
        },
        required: true,
        message: '不能大于实缴金额',
        trigger: 'blur'
      }
      if (rules.amount.length === 2) {
        rules.amount.pop()
      }
      rules.amount.push(volid)
    }

    //充值
    const handleApplye = (row: any, type: string) => {
      operationType.value = type
      if (type === '充值') {
        rechargeVisible.value = true
        formData.userId = row.userId
      } else {
        refundVisible.value = true
        formData2.userId = row.userId
        formData2.amount = refundAmount.value = row.retentionAmount
      }
    }

    //确认
    const confirm = () => {
      loadingBtn.value = true
      if (operationType.value === '充值') {
        rechargeForm.value.validate((valid: any) => {
          if (valid) {
            //申请充值
            fetch({
              url: '/order/admin/retention/applyDeposit',
              method: 'post',
              data: formData
            }).then((res: any) => {
              if (res.code == 0) {
                ElMessage.success({
                  message: '操作成功',
                  type: 'success'
                })
                loadingBtn.value = false
                rechargeVisible.value = false
                getData()
              }
            })
          }
        })
      } else if (operationType.value === '退费') {
        refundForm.value.validate((valid: any) => {
          if (valid) {
            //申请退费
            fetch({
              url: '/order/admin/retention/applyWithdraw',
              method: 'post',
              data: formData2
            }).then((res: any) => {
              if (res.code == 0) {
                ElMessage.success({
                  message: '操作成功',
                  type: 'success'
                })
                loadingBtn.value = false
                refundVisible.value = false
                getData()
              }
            })
          }
        })
      } else {
        // 质保金使用
        refundForm.value.validate((valid: any) => {
          if (valid) {
            fetch({
              url: '/order/admin/retention/consume',
              method: 'post',
              data: formData2
            }).then((res: any) => {
              if (res.code == 0) {
                ElMessage.success({
                  message: '操作成功',
                  type: 'success'
                })
                loadingBtn.value = false
                refundVisible.value = false
                getData()
              }
            })
          }
        })
      }
    }

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 200
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    onMounted(() => {
      getData()
      getJobSkill()
    })

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getData = async () => {
      let skillIds = []
      state.listQuery.skillId ? skillIds.push(state.listQuery.skillId) : []
      state.loading = true
      await fetch({
        url: '/order/admin/retention/overview',
        method: 'post',
        data: {
          size: state.pageSize,
          current: state.currentPage,
          skillIds: skillIds,
          userName: state.listQuery.userName
        }
      })
        .then((res: any) => {
          state.tableData = res.data.overviews.records
          state.total = res.data.overviews.total
          state.loading = false
          totalRetentionAmount.value = res.data.totalRetentionAmount
        })
        .finally(() => {
          state.loading = false
        })
    }

    const getJobSkill = async () => {
      await fetch({
        url: '/admin/sysjobskill/list/platform',
        method: 'get'
      }).then((res: any) => {
        if (res.code == 0) {
          state.skillOptions = res.data
        }
      })
    }

    const handleSearchList = () => {
      getData()
    }

    const handleResetSearch = () => {
      state.listQuery.userName = ''
      state.listQuery.skillId = ''
      getData()
    }

    const handleSelectionChange = (row: any) => {
      state.mallIds = []
      row.map((item: any) => {
        state.mallIds.push(item.id)
      })
    }

    watch(
      () => rechargeVisible.value,
      (newv: boolean) => {
        if (newv) {
          if (rechargeForm && rechargeForm.value) {
            rechargeForm.value.resetFields()
          }
        }
      }
    )

    watch(
      () => refundVisible.value,
      (newv: boolean) => {
        if (newv) {
          if (refundForm && refundForm.value) {
            refundForm.value.resetFields()
          }
        }
      }
    )

    return {
      totalRetentionAmount,
      changeVal,
      refundAmount,
      confirm,
      rechargeForm,
      refundForm,
      operationType,
      rechargeVisible,
      refundVisible,
      formData,
      formData2,
      rules,
      handleApplye,
      tableHeight,
      handleSelectionChange,
      getData,
      handleSearchList,
      handleResetSearch,
      handleCurrentChange,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.amount-money {
  padding-bottom: 1.1em;
  font-size: 20px;
  font-weight: bold;
}

.tableList {
  margin-top: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.operate-container {
  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
  }
}

.m-container-footer {
  text-align: right;
  margin-top: 25px;
}

.title {
  display: flex;
  justify-content: center;
  font-size: 2.2rem;
}

/deep/.only {
  width: calc(100% - 3.5rem);
  .el-input__inner {
    height: 8rem !important;
    line-height: 8rem !important;
    border: none;
    background: #f3f4f8;
    text-align: center;
    color: #303133;
    font-size: 2.4rem;
    padding-left: 9rem;
    position: relative;
    &:focus {
      border-color: transparent !important;
    }
    &:active {
      border: none !important;
    }
  }
}
/deep/.el-input__prefix-inner {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/.textarea-remarks {
  width: calc(100% - 3.5rem);
  .el-textarea__inner {
    height: 16rem !important;
    border: none;
    background: #f3f4f8;
    // text-align: center;
    color: #303133;
    font-size: 2.4rem;
    &:focus {
      border-color: transparent !important;
    }
    &:active {
      border: none !important;
    }
  }
}

/deep/.el-input-number.is-controls-right .el-input__inner {
  width: 120px;
}
</style>
