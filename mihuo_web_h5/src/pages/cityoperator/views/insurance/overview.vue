<template>
  <div class="overview">
    <div class="overview-header">
      <div class="query-wper">
        <el-space :size="40">
          <el-input
            v-model="queryState.userName"
            prefix-icon="search"
            clearable
            placeholder="输入姓名搜索"
            @change="handleUserName"
          />
          <el-date-picker
            v-model="queryState.datetime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="根据日期算出收入/支出，流水"
            @change="handleDatetime"
          />
        </el-space>
        <div style="height: 10px" />
        <el-space :size="40">
          <el-space :size="35">
            <el-radio
              v-model="queryState.allStatus"
              :label="true"
              size="large"
              @change="handleChangeAllStatus"
              >全部</el-radio
            >
            <el-radio-group
              v-model="queryState.insuranceStatus"
              @change="handleInsuranceStatus"
            >
              <el-space>
                <el-radio
                  v-for="item in insuranceStatusOptions"
                  :key="item.label"
                  :label="item.label"
                  size="large"
                  >{{ item.title }}</el-radio
                >
              </el-space>
            </el-radio-group>
            <el-radio-group
              v-model="queryState.refundStatus"
              @change="handleRefundStatus"
            >
              <el-space>
                <!-- <el-radio :label="0" size="large">未退款</el-radio> -->
                <!-- <el-radio :label="1" size="large">已申请</el-radio> -->
                <el-radio :label="2" size="large">待退款</el-radio>
                <el-radio :label="3" size="large">已退款</el-radio>
                <el-radio :label="4" size="large">退款失败</el-radio>
              </el-space>
            </el-radio-group>
          </el-space>
        </el-space>
      </div>
      <el-card>
        <el-space>
          <el-button type="primary" style="width: 100px" @click="handleManually"
            >手动录入</el-button
          >
          <el-button
            :type="refundStatus ? 'primary' : 'info'"
            :disabled="!refundStatus"
            style="width: 100px"
            @click="batchRefundForm.showDialog = true"
            >批量退款</el-button
          >
        </el-space>
      </el-card>
    </div>

    <div class="overview-table">
      <el-table
        ref="multipleTableRef"
        v-loading="tableState.loading"
        border
        stripe
        row-key="id"
        :data="tableState.tableData"
        :row-style="{ height: '50px' }"
        :header-row-style="{ height: '50px' }"
        :style="{ width: '100%' }"
        :max-height="'calc(100vh - 40rem)'"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          fixed="left"
          align="center"
          width="40"
          :selectable="setCheckdDisabled"
        />
        <el-table-column
          type="index"
          fixed="left"
          width="50"
          align="center"
          label="序号"
        />
        <el-table-column align="center" width="160" label="订单号/时间">
          <template #default="{ row }">
            <div>{{ row.orderCode }}</div>
            <div>{{ row.createTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          align="center"
          width="120"
          label="姓名"
        />
        <el-table-column
          prop="phone"
          align="center"
          width="140"
          label="手机号"
        />
        <el-table-column
          prop="idcard"
          align="center"
          width="160"
          label="身份证"
        />
        <el-table-column
          prop="setmealName"
          align="center"
          width="100"
          label="套餐名称"
        />
        <el-table-column align="center" width="100" label="购买方式">
          <template #default="{ row }">
            <span>{{ row.buyType === 1 ? '平台购买' : '用户购买' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="180" label="保障期限/剩余天数">
          <template #default="{ row }">
            <div>{{ row.insuranceTime }}</div>
            <div>剩余 {{ row.surplusDays }} 天</div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="保费状态">
          <template #default="{ row }">
            <span>{{ setInsuranceStatus(row.insuranceStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" label="用户支付金额">
          <template #default="{ row }">
            <span style="color: #f56c6c">{{
              row.payAmount ? `+${row.payAmount}` : '-'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="用户支付时间">
          <template #default="{ row }">
            <span>{{ setRowEmptyStatus(row.payTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="购买支出金额">
          <template #default="{ row }">
            <span style="color: #67c23a">{{
              row.buyAmount ? `-${row.buyAmount}` : '-'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="实际购买时间">
          <template #default="{ row }">
            <span>{{ setRowEmptyStatus(row.buyTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="insuranceEffectTime"
          align="center"
          width="160"
          label="保险生效日期"
        />
        <el-table-column
          prop="created"
          align="center"
          width="100"
          label="退款状态"
        >
          <template #default="{ row }">
            <el-space>
              <span>{{ setRefundStatus(row.refundStatus) }}</span>
              <el-popover
                v-if="row.refundStatus"
                :width="120"
                trigger="hover"
                placement="bottom-start"
              >
                <template #default>
                  <p v-if="row.refundStatus === 1">
                    退款原因: <strong>{{ row.adminRemarks }}</strong>
                  </p>
                  <p v-if="row.refundStatus === 3">
                    备注：<strong>{{ row.adminRemarks }}</strong>
                  </p>
                  <p v-if="row.refundStatus === 4">
                    失败原因：<strong>{{ row.refundRemarks }}</strong>
                  </p>
                  <p
                    v-if="row.refundStatus === 3 || row.refundStatus === 4"
                    style="margin-top: 5px"
                  >
                    {{ row.refundEndTime }}
                  </p>
                  <p v-if="row.refundStatus === 1" style="margin-top: 5px">
                    {{ row.refundStartTime }}
                  </p>
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
        <el-table-column align="center" width="160" label="发起退款时间">
          <template #default="{ row }">
            <span>{{ setRowEmptyStatus(row.refundStartTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="实际退款时间">
          <template #default="{ row }">
            <span>{{ setRowEmptyStatus(row.refundEndTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" width="220" label="操作">
          <template #default="{ row }">
            <el-space :size="15">
              <el-button
                v-if="row.insuranceStatus === 0 || row.insuranceStatus === 1"
                type="text"
                @click="handleTagToBuy(row)"
                >标记购买</el-button
              >
              <el-button
                v-if="row.buyType === 0 && row.refundStatus === 1"
                type="text"
                @click="handleRefund(row)"
                >退款</el-button
              >
              <el-button
                v-if="
                  row.insuranceStatus === 2 ||
                  row.insuranceStatus === 3 ||
                  row.insuranceStatus === 4
                "
                type="text"
                @click="handleToViewGuaranteeSlip(row)"
                >查看保单</el-button
              >
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="overview-stat">
      <el-descriptions border :column="3" size="large">
        <el-descriptions-item>当前页合计</el-descriptions-item>
        <el-descriptions-item />
        <el-descriptions-item>
          <div class="total">
            <el-popover
              placement="top"
              effect="dark"
              popper-class="popper-item"
              trigger="hover"
            >
              <template #reference>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </template>
              <p>
                收入:
                <span
                  style="
                    margin-left: 1rem;
                    color: #f56c6c;
                    font-family: SimSun;
                    font-size: 1.6rem;
                  "
                  >{{ currentExpenditure.income?.toFixed(2) }}</span
                >
              </p>
              <p>
                支出:
                <span
                  style="
                    margin-left: 1rem;
                    color: #67c23a;
                    font-family: SimSun;
                    font-size: 1.6rem;
                  "
                  >{{ currentExpenditure.expenses?.toFixed(2) }}</span
                >
              </p>
            </el-popover>
            <span>{{ currentExpenditure.income?.toFixed(2) }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>和总计</el-descriptions-item>
        <el-descriptions-item />
        <el-descriptions-item>
          <div class="total">
            <el-popover
              placement="top"
              effect="dark"
              popper-class="popper-item"
              trigger="hover"
            >
              <template #reference>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </template>
              <p>
                收入:
                <span
                  style="
                    margin-left: 1rem;
                    color: #f56c6c;
                    font-family: SimSun;
                    font-size: 1.6rem;
                  "
                  >{{ expenditure.income?.toFixed(2) }}</span
                >
              </p>
              <p>
                支出:
                <span
                  style="
                    margin-left: 1rem;
                    color: #67c23a;
                    font-family: SimSun;
                    font-size: 1.6rem;
                  "
                  >{{ expenditure.expenses?.toFixed(2) }}</span
                >
              </p>
            </el-popover>
            <span>{{ expenditure.income?.toFixed(2) }}</span>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-pagination
      :total="tableState.total"
      :current-page="tableState.current"
      layout="total, prev, pager, next, jumper"
      @current-change="currentChange"
    />

    <el-dialog
      v-model="showTagToBuy"
      class="overview-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="标记购买"
      z-index="9"
      :before-close="() => closeTagToBuyForm(TagToBuyRef)"
      width="40rem"
    >
      <el-form
        ref="TagToBuyRef"
        :model="tagToBuyForm"
        :rules="tagToBuyRules"
        class="overview-tag-buy"
        label-width="13rem"
      >
        <el-form-item label="购买金额" prop="buyAmount">
          <el-space>
            <el-input-number
              v-model="tagToBuyForm.buyAmount"
              :controls="false"
              :min="0"
              placeholder="输入金额"
            />
            <span>元</span>
          </el-space>
        </el-form-item>
        <el-form-item label="上传保单" prop="documentsImg">
          <el-upload
            ref="uploadRef2"
            class="avatar-uploader"
            :show-file-list="false"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleTagToBuySuccess"
            :on-preview="handleTagToBuyPreview"
            accept="image/*,.pdf"
          >
            <img
              v-if="tagToBuyForm.documentsImg"
              :src="tagToBuyForm.documentsImg"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <!-- <el-dialog
            v-model="tagToBuyUpload"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="400"
          >
            <img
              style="width: 100%; object-fit: contain"
              :src="tagToBuyPreviewImageUrl"
              alt=""
            />
          </el-dialog> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeTagToBuyForm(TagToBuyRef)">取消</el-button>
          <el-button
            type="primary"
            style="width: 80px"
            @click="submitTagToBuyForm(TagToBuyRef)"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showManually"
      class="overview-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="手动录入"
      z-index="9"
      :before-close="() => closeManuallyForm(manuallyRef)"
      width="65rem"
    >
      <el-form
        ref="manuallyRef"
        :model="manuallyForm"
        :rules="manuallyRules"
        class="overview-form"
        label-width="14rem"
      >
        <el-form-item label="选择平台工人">
          <el-space>
            <el-switch v-model="selectorMode" />
          </el-space>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-select
            v-if="selectorMode"
            key="selection"
            v-model="manuallyForm.userName"
            fit-input-width
            default-first-option
            filterable
            remote
            reserve-keyword
            remote-show-suffix
            :loading="selectLoading"
            placeholder="搜索平台工人"
            :remote-method="remoteMethod"
            @change="changeWorkers"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
              <!-- <template #default>
                <avatar size="small" :src="item.avatar" mode="cover" />
                <span>{{ item.name }}</span>
              </template> -->
            </el-option>
          </el-select>
          <el-input
            v-else
            key="manually"
            v-model="manuallyForm.userName"
            placeholder="输入姓名"
          />
        </el-form-item>
        <el-form-item required label="手机号" prop="phone">
          <el-input
            v-model="manuallyForm.phone"
            :controls="false"
            placeholder="输入手机号"
          />
        </el-form-item>
        <el-form-item required label="身份证号" prop="idcard">
          <el-input
            v-model="manuallyForm.idcard"
            :controls="false"
            placeholder="输入身份证号"
          />
        </el-form-item>
        <el-form-item label="套餐类型" prop="setmealId">
          <el-radio-group v-model="manuallyForm.setmealId" class="ml-4">
            <el-radio
              v-for="item in setmealList"
              :key="item.id"
              :label="item.id"
              size="large"
              >{{ item.setmealName }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="保障期限" prop="insuranceDuration">
          <el-space>
            <el-input-number
              v-model="manuallyForm.insuranceDuration"
              :controls="false"
              :min="0"
              placeholder="输入保障期限"
            />
            <span>个月</span>
          </el-space>
        </el-form-item>
        <el-form-item label="用户支付金额" prop="payAmount">
          <el-space>
            <el-input-number
              v-model="manuallyForm.payAmount"
              :controls="false"
              :min="0"
              placeholder="输入用户支付金额"
            />
            <span>元</span>
          </el-space>
        </el-form-item>
        <el-form-item label="用户支付日期" prop="payTime">
          <el-date-picker
            v-model="manuallyForm.payTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择用户支付日期"
          />
        </el-form-item>
        <el-form-item label="购买支出金额" prop="buyAmount">
          <el-space>
            <el-input-number
              v-model="manuallyForm.buyAmount"
              :controls="false"
              :min="0"
              placeholder="输入购买支出金额"
            />
            <span>元</span>
          </el-space>
        </el-form-item>
        <el-form-item required label="上传保单" prop="documentsImg">
          <el-upload
            ref="uploadRef1"
            class="avatar-uploader"
            :show-file-list="false"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleManuallySuccess"
            :on-preview="handleManuallyPreview"
            accept="image/*,.pdf"
          >
            <img
              v-if="manuallyForm.documentsImg"
              :src="manuallyForm.documentsImg"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <!-- <el-dialog
            v-model="manuallyUpload"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="400"
          >
            <img
              style="width: 100%; object-fit: contain"
              :src="manuallyPreviewImageUrl"
              alt=""
            />
          </el-dialog> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeManuallyForm(manuallyRef)">取消</el-button>
          <el-button
            type="primary"
            style="width: 80px"
            @click="submitManuallyForm(manuallyRef)"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showRefund"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      z-index="9"
      title="退款"
      width="40rem"
    >
      <el-form
        :model="refundForm"
        class="oreder-report-form"
        label-width="10rem"
      >
        <el-form-item label="退款信息">
          <!-- <el-input
          v-model="refundForm.payAmount"
          readonly
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        /> -->
          <div style="padding: 2.6px 0">
            <p>{{ refundForm.refundStartTime }}</p>
            <p>{{ refundForm.payAmount }}元</p>
          </div>
        </el-form-item>
        <el-form-item label="用户备注">
          <!-- <el-input v-model="refundForm.refundRemarks" readonly /> -->
          <p>{{ refundForm.refundRemarks }}</p>
        </el-form-item>
        <el-form-item label="是否同意">
          <el-radio-group v-model="refundForm.isConfirm">
            <el-space :size="20">
              <el-radio :label="1" size="large">同意</el-radio>
              <el-radio :label="2" size="large">拒绝</el-radio>
            </el-space>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="refundForm.adminRemarks"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="closeRefundForm">取 消</el-button>
          <el-button type="primary" @click="sumbitRefundForm">确 认</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showGuaranteeSlip"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="保单信息"
      z-index="9"
      width="40rem"
    >
      <el-space
        direction="vertical"
        style="width: 100%; min-height: 17rem; justify-content: center"
      >
        <el-image
          style="margin-right: 2rem"
          fit="contain"
          :src="guaranteeSlipForm.documentsImg"
          hide-on-click-modal
          :preview-src-list="[guaranteeSlipForm.documentsImg]"
        />
      </el-space>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="closeGuaranteeSlip">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="batchRefundForm.showDialog"
      title="批量退款"
      :append-to-body="true"
      width="40rem"
    >
      <el-form
        :model="batchRefundForm"
        class="oreder-report-form"
        label-width="10rem"
      >
        <el-form-item label="是否同意">
          <el-radio-group v-model="batchRefundForm.isConfirm">
            <el-space :size="20">
              <el-radio :label="1" size="large">同意</el-radio>
              <el-radio :label="2" size="large">拒绝</el-radio>
            </el-space>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchRefundForm.showDialog = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleBatchRefund">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '保险总览',
  components: {},
  setup() {}
})
</script>
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { imageGlobal } from '@/global'
import { fetch } from '../../axios-config/axios'
import { isPhone, isIdCard } from '@/utils/validate'

const queryState = ref({
  userName: '',
  datetime: '',
  insuranceStatus: '',
  refundStatus: '',
  allStatus: true
})

const expenditure = ref({
  income: 0,
  expenses: 0
})

const currentExpenditure = ref({
  income: 0,
  expenses: 0
})

const insuranceStatusOptions = [
  // { label: 0, title: '未支付' },
  { label: 1, title: '已支付' },
  { label: 2, title: '待生效' },
  { label: 3, title: '生效中' },
  { label: 4, title: '已过保' }
]

const tagToBuyUpload = ref(false)
const showTagToBuy = ref(false)
const tagToBuyForm = ref<any>({ buyAmount: 0, documentsImg: '' })
const TagToBuyRef = ref()
const tagToBuyRules = reactive({
  buyAmount: [
    { required: true, message: '购买金额不能为空', trigger: 'change' }
  ],
  documentsImg: [{ required: true, message: '保单不能为空', trigger: 'change' }]
})

const manuallyUpload = ref(false)
const selectLoading = ref(false)
const list = ref<any[]>([])
const options = ref<any[]>([])
const selectorMode = ref(false)
const showManually = ref(false)
const manuallyForm = ref<any>({})
const manuallyRef = ref()
const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('输入电话号码'))
  } else if (!isPhone(value)) {
    callback(new Error('电话号码格式不正确'))
  } else {
    callback()
  }
}
const validateIdcard = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('输入证件号码'))
  } else if (!isIdCard(value)) {
    callback(new Error('证件号格式不正确'))
  } else {
    callback()
  }
}
const manuallyRules = reactive({
  userName: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
  phone: [
    { required: true, message: '电话号码不能为空', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ],
  idcard: [
    { required: true, message: '证件号码不能为空', trigger: 'blur' },
    { validator: validateIdcard, trigger: 'blur' }
  ],
  setmealId: [
    { required: true, message: '套餐类型不能为空', trigger: 'change' }
  ],
  insuranceDuration: [
    { required: true, message: '保障期限不能为空', trigger: 'change' }
  ],
  payAmount: [
    { required: true, message: '支付金额不能为空', trigger: 'change' }
  ],
  payTime: [{ required: true, message: '支付日期不能为空', trigger: 'change' }],
  buyAmount: [
    { required: true, message: '支出金额不能为空', trigger: 'change' }
  ],
  documentsImg: [{ required: true, message: '保单不能为空', trigger: 'change' }]
})

const showRefund = ref(false)
const refundForm = ref<any>({ isConfirm: 1 })

const showGuaranteeSlip = ref(false)
const guaranteeSlipForm = ref<any>({})

const tagToBuyImage = ref<any>({})
const manuallyImage = ref<any>({})
const tagToBuyPreviewImageUrl = ref('')
const manuallyPreviewImageUrl = ref('')

const setmealList = ref<any>([])
const multipleSelection = ref<any[]>([])
const multipleTableRef = ref()

const batchRefundForm = ref<any>({ isConfirm: 1, showDialog: false })

const uploadRef1 = ref()
const uploadRef2 = ref()

const tableState = ref({
  loading: false,
  tableData: [],
  total: 0,
  current: 1
})

const refundStatus = computed(() => {
  if (multipleSelection.value.length) return true
  else return false
})

onMounted(() => {
  fetchData()
})

const remoteMethod = async (query: string) => {
  await fetchPerson(query)
  options.value = list.value.filter((item) => {
    return item.name.toLowerCase().includes(query.toLowerCase())
  })
}

const changeWorkers = (evt: any) => {
  manuallyForm.value.userName = evt.name
  manuallyForm.value.phone = evt.phone
  manuallyForm.value.idcard = evt.idcard
}

const fetchPerson = async (query: string) => {
  selectLoading.value = true
  try {
    const res: any = await fetch({
      url: '/admin/person/page',
      method: 'get',
      params: {
        code: 'JOB_MANAGER',
        size: 20,
        name: query
      }
    })
    if (res.code === 0) {
      list.value = res.data.records
    } else {
      list.value = []
    }
  } catch (error) {
    console.error(error)
    list.value = []
  } finally {
    selectLoading.value = false
  }
}

const fetchSetmeal = async () => {
  try {
    const res: any = await fetch({
      url: '/order/insurancesetmeal/getInsuranceSetmealPage',
      method: 'get'
    })
    if (res.code === 0) {
      const { records } = res.data
      setmealList.value = records
      manuallyForm.value.setmealId = setmealList.value?.[0].id
    }
  } catch (error) {
    console.error(error)
    ElMessage.warning('套餐列表获取失败!')
  }
}

const fetchData = async () => {
  tableState.value.loading = true
  try {
    const res: any = await fetch({
      url: '/order/insurancesetmealorder/getInsuranceSetmealOrderPage',
      method: 'get',
      params: {
        current: tableState.value.current,
        userName: queryState.value.userName,
        payTime: queryState.value.datetime,
        insuranceStatus: queryState.value.insuranceStatus,
        refundStatus: queryState.value.refundStatus
      }
    })
    if (res.code === 0) {
      const { expenditure: fund, pages } = res.data
      if (fund) {
        expenditure.value.income = fund.income ?? 0
        expenditure.value.expenses = fund.expenses ?? 0
      }
      tableState.value.total = Number(pages.total)
      tableState.value.current = Number(pages.current)
      tableState.value.tableData = pages.records
      // eslint-disable-next-line no-return-assign
      currentExpenditure.value.income = tableState.value.tableData.reduce(
        (pre, cur: any) => (pre += cur.payAmount),
        0
      )
      currentExpenditure.value.expenses = tableState.value.tableData.reduce(
        (pre, cur: any) => (pre += cur.buyAmount),
        0
      )
    }
    tableState.value.loading = false
  } catch (error) {
    console.error(error)
    tableState.value.loading = false
  }
}

const setCheckdDisabled = (row: any) => {
  if (row.buyType === 0 && row.refundStatus === 1) {
    return true
  } else {
    return false
  }
}

const setRefundStatus = (refundStatus: number) => {
  if (refundStatus === 3) {
    return '已退款'
  } else if (refundStatus === 4) {
    return '退款失败'
  } else {
    return '待退款'
  }
}

const setInsuranceStatus = (insuranceStatus: number) => {
  switch (insuranceStatus) {
    case 1:
      return '已支付'
    case 2:
      return '待生效'
    case 3:
      return '生效中'
    case 4:
      return '已过保'
    default:
      return '未支付'
  }
}

const handleSelectionChange = (rows: any[]) => {
  multipleSelection.value = rows

  console.log(multipleSelection.value)
}

const setRowEmptyStatus = (value: any) => {
  if (!value) return '-'
  else return value
}

const currentChange = (page: any) => {
  tableState.value.current = page
  fetchData()
}

const handleChangeAllStatus = (val: boolean) => {
  if (val) {
    queryState.value.insuranceStatus = ''
    queryState.value.refundStatus = ''
    queryState.value.allStatus = true
  }
  fetchData()
}

const handleInsuranceStatus = () => {
  queryState.value.allStatus = false
  queryState.value.refundStatus = ''
  fetchData()
}

const handleRefundStatus = () => {
  queryState.value.allStatus = false
  queryState.value.insuranceStatus = ''
  fetchData()
}

const handleUserName = () => {
  fetchData()
}

const handleDatetime = () => {
  fetchData()
}

const closeTagToBuyForm = (formEl: any) => {
  if (!formEl) return
  formEl.resetFields()
  uploadRef2.value.clearFiles()
  tagToBuyImage.value = {}
  tagToBuyForm.value = {}
  showTagToBuy.value = false
}

const closeManuallyForm = (formEl: any) => {
  if (!formEl) return
  formEl.resetFields()
  uploadRef1.value.clearFiles()
  manuallyImage.value = {}
  showManually.value = false
}

const closeRefundForm = () => {
  showRefund.value = false
}

const sumbitRefundForm = async () => {
  try {
    const res: any = await fetch({
      url: '/order/insurancesetmealorder/refundInsuranceSetmealOrder',
      method: 'post',
      data: {
        orderCodes: Array.of(refundForm.value.orderCode),
        isConfirm: refundForm.value.isConfirm,
        remarks: refundForm.value.remark
      }
    })
    if (res.code === 0) {
      ElMessage.success('退款成功!')
      showRefund.value = false
      refundForm.value = {}
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}

const closeGuaranteeSlip = () => {
  showGuaranteeSlip.value = false
}

const handleToViewGuaranteeSlip = (row: any) => {
  showGuaranteeSlip.value = true
  guaranteeSlipForm.value = row
}

const handleRefund = (row: any) => {
  showRefund.value = true
  refundForm.value = { ...row, isConfirm: 1 }
  console.log(row)
}

const handleTagToBuy = (row: any) => {
  showTagToBuy.value = true
  tagToBuyForm.value = row
}

const handleManually = () => {
  showManually.value = true
  fetchSetmeal()
}

const handleBatchRefund = async () => {
  const orderCodes = multipleSelection.value.map((item: any) => item.orderCode)
  try {
    const res: any = await fetch({
      url: '/order/insurancesetmealorder/refundInsuranceSetmealOrder',
      method: 'post',
      data: {
        orderCodes,
        isConfirm: batchRefundForm.value.isConfirm
      }
    })
    if (res.code === 0) {
      batchRefundForm.value.showDialog = false
      ElMessage.success('退款成功!')
      fetchData()
    } else {
      ElMessage.error('退款失败!')
    }
  } catch (error) {
    ElMessage.error('退款失败!')
    console.error(error)
  }
}

const submitTagToBuyForm = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      if (!tagToBuyImage.value.raw) return
      saveTagToBuy()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const submitManuallyForm = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      saveManually()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const saveManually = async () => {
  try {
    const data = await uploadImage(manuallyImage.value.raw)
    const res: any = await fetch({
      url: '/order/insurancesetmealorder/addInsuranceSetmealOrder',
      method: 'post',
      data: { ...manuallyForm.value, documentsImg: imageGlobal + data.fileName }
    })
    if (res.code === 0) {
      showManually.value = false
      ElMessage.success('购买成功!')
      manuallyForm.value = {}
      manuallyImage.value = {}
      manuallyRef.value.resetFields()
      uploadRef1.value.clearFiles()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}

const saveTagToBuy = async () => {
  try {
    const data = await uploadImage(tagToBuyImage.value.raw)
    const res: any = await fetch({
      url: '/order/insurancesetmealorder/modifyInsuranceSetmealOrder',
      method: 'post',
      data: {
        orderCode: tagToBuyForm.value.orderCode,
        buyAmount: tagToBuyForm.value.buyAmount,
        documentsImg: imageGlobal + data.fileName
      }
    })

    if (res.code === 0) {
      showTagToBuy.value = false
      ElMessage.success('购买成功!')
      tagToBuyForm.value = {}
      tagToBuyImage.value = {}
      TagToBuyRef.value.resetFields()
      uploadRef2.value.clearFiles()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}

const uploadImage = async (file: any) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res: any = await fetch({
      url: '/admin/sys-file/upload',
      method: 'post',
      headers: {
        'content-type': 'multipart/form-data'
      },
      data: formData
    })
    if (res.code === 0) {
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}

const handleManuallySuccess = (file: any) => {
  manuallyImage.value = file
  manuallyForm.value.documentsImg = file.url
}

const handleManuallyPreview = (file: any) => {
  manuallyUpload.value = true
  manuallyPreviewImageUrl.value = file.url
}

const handleTagToBuySuccess = (file: any) => {
  tagToBuyImage.value = file
  tagToBuyForm.value.documentsImg = file.url
}

const handleTagToBuyPreview = (file: any) => {
  tagToBuyUpload.value = true
  tagToBuyPreviewImageUrl.value = file.url
}
</script>

<style scoped lang="less">
.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.overview-stat {
  width: calc(100% - 24rem);

  position: fixed;
  bottom: 8rem;

  :deep(.el-descriptions__body) {
    .el-descriptions__cell {
      background-color: #f5f7fa;
    }
  }
}

.query-wper {
  display: flex;
  flex-flow: column nowrap;

  margin: 2rem 0;
  margin-left: 1rem;

  :deep(.el-input) {
    width: 20rem !important;
  }

  :deep(.el-date-editor--datetime) {
    width: 25rem !important;
  }

  :deep(.el-range-editor.el-input__inner) {
    width: 45rem !important;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 44px;
  height: 44px;
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.total {
  font-size: 1.6rem;
  font-family: SimSun;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-form-item--default .el-form-item__error) {
  padding-top: 0.6rem;
  zoom: 0.8;
}
</style>
