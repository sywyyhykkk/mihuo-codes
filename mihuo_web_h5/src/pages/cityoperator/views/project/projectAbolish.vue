<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <h3>作废项目</h3>
        <span>（作废项目需要处理所有订单信息）</span>
        <el-popover
          class="dropdown-news"
          ref="dropdown"
          trigger="click"
          :append-to-body="false"
          :hide-on-click="false"
          v-model="showPopover"
          width="300"
        >
          <template #reference>
            <div class="header_btn" @click="showPopover = true">查看</div>
          </template>
          <template #default>
            <div class="close-box" style="text-align: right">
              <el-icon class="close" @click="onClose"><close /></el-icon>
            </div>

            <div class="address-info" style="padding: 1rem">
              <div class="top-address" style="display: flex">
                <el-icon size="2.5rem">
                  <office-building />
                </el-icon>
                <div style="margin-left: 0.5rem">
                  <div class="address-text">
                    {{ projectData.poiName }}{{ projectData.address }}
                  </div>
                  <div class="address-text-data" style="width: 30rem">
                    {{ projectData.provinceName }}{{ projectData.cityName
                    }}{{ projectData.region }}{{ projectData.latAddress
                    }}{{ projectData.poiName }}{{ projectData.address }}
                  </div>
                </div>
              </div>

              <div class="person-info-msg">
                <div style="display: flex; align-items: center">
                  <el-icon size="1.6rem">
                    <user />
                  </el-icon>
                  <span class="person-name" style="margin-left: 0.5rem">{{
                    projectData.customerName
                  }}</span>
                </div>
                <div style="display: flex; align-items: center">
                  <el-icon size="1.6rem">
                    <iphone />
                  </el-icon>
                  <span class="person-phone" style="margin-left: 0.5rem">{{
                    projectData.customerPhone
                  }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-popover>
      </div>
      <el-button
          type="primary"
          :loading="confirmLoading"
          size="large"
          @click="submitForm"
          >确认</el-button
        >
    </el-header>
    <el-main>
      <el-form
        ref="ruleForms"
        :model="form"
        label-width="0"
        :scroll-to-error="true"
        :rules="rules"
      >
        <el-table
          :data="form.skillOrders"
          border
          :cell-style="{ borderRight: 'none' }"
          :show-header="false"
          v-loading="loading"
          default-expand-all
          height="0"
          style="height:calc(100vh - 22rem)"
        >
          <template v-slot:empty>
            <div class="empty-slot">
              <img src="@/assets/img/no_content.png" />
              <p class="empty-p">暂无数据</p>
            </div>
          </template>
          <el-table-column type="expand">
            
            <template #default="props">
              <!-- 派单 -->
              <div class="props-table" style="margin-top: -0.9rem">
                <p>派单</p>
                <el-table
                  border
                  :data="props.row.bizOrders"
                  row-key="id"
                  size="small"
                  align="center"
                  :span-method="sendArraySpanMethod"
                  header-align="center"
                  :tree-props="{
                    children: 'orderItems',
                    hasChildren: 'hasChildren'
                  }"
                  default-expand-all
                >
                  <el-table-column
                    label="需求描述"
                    width="260"
                    header-align="center"
                  >
                    <template #default="scope">
                      <span v-if="scope.row.orderItems" class="order-item">
                        <span class="order-sn marginRight">
                          订单编号：{{ scope.row.orderCode }}
                        </span>
                        <span class="order-sn marginRight">
                          创建时间：{{ scope.row.created }}
                        </span>
                        <span class="user marginRight">
                          <span class="people">
                            <img
                              class="avatar-img"
                              :src="$getUrl.avatarImage(scope.row.userId)"
                              @error="$getUrl.imageError($event)"
                            />
                            <span>{{
                              scope.row.userName || scope.row.userName
                            }}({{ scope.row.contactPhone }})</span>
                          </span>
                          <img
                            @click="
                              openIM({
                                userId: scope.row.userId,
                                name: scope.row.userName
                              })
                            "
                            src="@/assets/img/message.png"
                            class="message-avatar"
                          />
                        </span>
                        
                      </span>
                      <div
                        class="goods"
                        v-if="
                          !scope.row.orderItems && scope.row.requirementDesc
                        "
                      >
                        <div class="goods-info">
                          <div class="product-name">
                            {{ scope.row.requirementDesc }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="位置" align="center" width="500">
                    <template #default="scope">
                      <div v-if="!scope.row.orderItems">
                        {{
                          (scope.row.provinceName || '') +
                          (scope.row.cityName || '') +
                          (scope.row.districtName || '') +
                          (scope.row.latAddress || '') +
                          (scope.row.poiName || '')
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="呼叫类型"
                    align="center"
                    prop="source"
                  >
                    <template #default="scope">
                      <div v-if="!scope.row.orderItems">
                        {{ getPriceWay(scope.row.priceWay) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="期望报价"
                    prop="price"
                    align="center"
                  />
                  <el-table-column
                    label="需求工种"
                    prop="skillName"
                    align="center"
                  />
                  <el-table-column
                    label="期望上门时间"
                    prop="expectDate"
                    align="center"
                    width="200"
                  />
                  <el-table-column label="付款金额" prop="" align="center" />

                  <el-table-column label="变更金额" prop="" align="center">
                    <template #default="scope">
                      <div
                        v-if="!scope.row.orderItems"
                        :class="{
                          'change-amount-positive':
                            Number(scope.row.changeAmount || 0) > 0,
                          'change-amount-minus':
                            Number(scope.row.changeAmount || 0) < 0
                        }"
                      >
                        {{
                          Number(scope.row.changeAmount || 0) > 0
                            ? '+'
                            : Number(scope.row.changeAmount || 0) < 0
                            ? '-'
                            : ''
                        }}
                        ￥{{ scope.row.changeAmount?.toFixed(2) || 0 }}
                        {{ scope.row.changedList?.length }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="合计金额"
                    prop="orderCode"
                    align="center"
                  >
                    <template #default="scope">
                      <div v-if="!scope.row.orderItems" class="total-amount">
                        ￥{{ scope.row.totalAmount }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="订单来源"
                    align="center"
                    prop="source"
                  >
                    <template #default="scope">
                      <div v-if="!scope.row.orderItems">
                        {{ getSource(scope.row.source) }}
                      </div>
                    </template></el-table-column
                  >
                  <el-table-column
                    label="订单状态"
                    prop="orderCode"
                    align="center"
                  >
                    <template #default="scope">
                      <div v-if="!scope.row.orderItems">
                        <el-tag
                          :type="
                            getCustomOrderStatus(scope.row.orderStatus)?.type
                          "
                        >
                          {{
                            getCustomOrderStatus(scope.row.orderStatus)?.label
                          }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="客户确认"
                    prop="orderCode"
                    align="center"
                  >
                    <template #default="scope">
                      <div v-if="!scope.row.orderItems">
                        <span
                          :style="getCustomStatus(scope.row.orderStatus)?.type"
                        >
                          {{ getCustomStatus(scope.row.orderStatus)?.label }}
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="已结算金额"
                    prop="orderCode"
                    fixed="right"
                    align="center"
                    width="150"
                  >
                    <template #default="scope">
                      <span>{{ scope.row.confirmedOderOffer?.payCost }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 开单 -->

              <div class="props-table">
                <p>开单</p>
                <el-table
                  border
                  :data="props.row.omsOrders"
                  row-key="id"
                  size="small"
                  align="center"
                  header-align="center"
                  :tree-props="{
                    children: 'orderItems',
                    hasChildren: 'hasChildren'
                  }"
                  default-expand-all
                >
                  <el-table-column
                    label="商品"
                    width="700"
                    header-align="center"
                  >
                    <template #default="scope">
                      <span v-if="scope.row.orderItems" class="order-item">
                        <span class="order-sn marginRight">
                          订单编号：{{
                            scope.row.orderSn || scope.row.orderCode
                          }}
                        </span>
                        <el-tag
                          v-if="scope.row.deliveryType"
                          :type="
                            scope.row.deliveryType == '0'
                              ? 'success'
                              : scope.row.deliveryType == '1'
                              ? ''
                              : 'warning'
                          "
                          effect="dark"
                          >{{ getDeliveryType(scope.row.deliveryType) }}
                        </el-tag>
                        <span class="order-sn marginRight">
                          创建时间：{{ scope.row.createTime }}
                        </span>
                        <span class="user marginRight">
                          <div class="people">
                            <img
                              class="avatar-img"
                              :src="$getUrl.avatarImage(scope.row.memberId)"
                              @error="$getUrl.imageError($event)"
                            />
                            <span>{{
                              scope.row.memberUsername ||
                              scope.row.memberUsername
                            }}</span>
                          </div>
                          <img
                            src="@/assets/img/message.png"
                            class="message-avatar"
                            @click="
                              openIM({
                                userId: scope.row.memberId,
                                name: scope.row.memberUsername
                              })
                            "
                          />
                        </span><br />
                        <span class="marginRight" v-if="scope.row.receiverName" style="margin-left:2.2rem">
                          {{ scope.row.receiverName }}({{
                            scope.row.receiverPhone
                          }})
                        </span>
                        <span class="marginRight">
                          位置：{{
                            (scope.row.receiverProvince || '') +
                            (scope.row.receiverCity || '') +
                            (scope.row.receiverRegion || '') +
                            (scope.row.receiverLatAddress || '') +
                            (scope.row.receiverDetailAddress || '')
                          }}
                        </span>
                        <span class="marginRight">
                          来源：{{ scope.row.projectId ? '项目' : '业主' }}
                        </span>
                      </span>
                      <div v-if="scope.row.productPic" class="goods">
                        <el-image
                          :src="$getUrl.getPicUrl(scope.row.productPic)"
                          :preview-src-list="
                            $getUrl.getPicUrl(scope.row.productPic)
                          "
                          :preview-teleported="true"
                          :fit="fit"
                        />
                        <div class="goods-info">
                          <div class="product-name">
                            {{ scope.row.productName }}
                          </div>
                          <div class="goods-tag">
                            <el-tag type="info">{{
                              scope.row.productSn
                            }}</el-tag>
                            <el-tag type="info">{{
                              scope.row.productBrand
                            }}</el-tag>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="商品（单价）元/单位"
                    prop="productPrice"
                    align="center"
                    width="200"
                  >
                    <template #default="scope">
                      <span
                        >￥{{ scope.row.productPrice?.toFixed(2) }}/{{
                          scope.row.productUnit
                        }}</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="数量"
                    prop="productQuantity"
                    align="center"
                  >
                    <template #default="scope">
                      <span v-if="![3].includes(scope.row.orderType)">{{
                        scope.row.productQuantity
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="小计" align="center">
                    <template #default="scope">
                      <span>￥{{ scope.row.totalAmount?.toFixed(2) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="商品留言"
                    width="180"
                    align="center"
                    prop="serviceNotes"
                    show-overflow-tooltip
                  >
                    <template #default="scope">
                      <span v-if="![3].includes(scope.row.orderType)">{{
                        scope.row.serviceNotes
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="实收金额"
                    header-align="center"
                    prop="payAmount"
                    width="180"
                    align="center"
                  >
                    <template #default="scope">
                      <div>
                        <div
                          style="
                            color: #4d4d4d;
                            font-size: 12px;
                            font-weight: bold;
                          "
                        >
                          ￥{{ scope.row.totalAmount?.toFixed(2) }}
                        </div>
                        <div style="color: #909399; font-size: 12px">
                          （含运费￥{{ scope.row.freightAmount?.toFixed(2) }}）
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="订单状态" align="center" width="150">
                    <template #default="scope">
                      <div>
                        <div>
                          <el-tag
                            v-if="scope.row.orderItems"
                            :type="
                              getOrderStatus(
                                scope.row.status,
                                scope.row.orderType
                              )?.type
                            "
                          >
                            {{
                              getOrderStatus(
                                scope.row.status,
                                scope.row.orderType
                              )?.text
                            }}
                          </el-tag>
                        </div>
                        <div
                          v-if="
                            !scope.row.orderItems &&
                            (scope.row.status == 1 || scope.row.status == 2)
                          "
                        >
                          <el-tag
                            :type="
                              getDeliveryStatus(
                                scope.row.deliveryStatus,
                                scope.row.orderType
                              ).type
                            "
                          >
                            {{
                              getDeliveryStatus(
                                scope.row.deliveryStatus,
                                scope.row.orderType
                              ).label
                            }}
                          </el-tag>
                        </div>
                      </div>
                      <div
                        v-if="
                          !scope.row.orderItems &&
                          [1, 2].includes(scope.row.orderType)
                        "
                      >
                        <el-tag
                          :type="
                            getOrderStatus(
                              scope.row.status,
                              scope.row.orderType
                            ).type
                          "
                        >
                          {{
                            getOrderStatus(
                              scope.row.status,
                              scope.row.orderType
                            ).text
                          }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100" fixed="right" align="center">
                      <template #default="scope">
                        <el-button
                          v-if="scope.row.status !=7 && scope.$index === 0"
                          type="text"
                          class="danger"
                          icon="money"
                          @click="refund(scope.row)"
                        >退款
                        </el-button>
                      </template>
                  </el-table-column>
                  <!-- <el-table-column
                    label="退款金额"
                    align="center"
                    width="150"
                    fixed="right"
                  >
                    <template #default="scope">
                      <el-form-item
                        v-if="scope.$index === 0"
                        label-width="2.5rem"
                        style="margin: 0 !important"
                      >
                        <el-input
                          v-model="scope.row.amount"
                          style="max-width: 14rem"
                          type="number"
                          @input="(val) => changePrice(val, scope.row,props.$index,scope.$index,'amount')"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="退款备注"
                    prop="orderChanges"
                    align="center"
                    width="150"
                    fixed="right"
                  >
                    <template #default="scope">
                      <el-form-item
                        v-if="scope.$index === 0"
                        label-width="2.5rem"
                        style="margin: 0 !important"
                      >
                        <el-input
                          type="text"
                          v-model="scope.row.remark"
                          style="max-width: 14rem"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column> -->
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="岗位/工种" prop="skillName">
            <template #default="scope">
              <h3>{{ scope.row.jobSkill.skillName }}</h3>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-main>
    <!-- 退款 -->
    <orderRefund
      v-if="orderRefundShow"
      v-model="orderRefundShow"
      :order-data="productList"
      @getData="getTableData"
    />
  </el-container>
</template>

<script lang="ts">
import {
  getSkuData,
  openIM,
  groupData,
  getDeliveryType,
  getOrderStatus,
  getCustomOrderStatus,
  getDeliveryStatus
} from '@/components/orderManagement/order'
import { async } from '@antv/x6/lib/registry/marker/main'
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  getCurrentInstance
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { baseDecode } from '@/utils/utils'
import { useRoute,useRouter } from 'vue-router'
import { valid } from 'mockjs'
import { inputLimtPrice } from '@/utils/utils'
import { ElMessage } from 'element-plus'
import store from '_@/store'

export default defineComponent({
  setup() {
    const {ctx:_this} :any = getCurrentInstance()
    const ruleForms = ref<any>('')
    const route = useRoute()
    const $router = useRouter()
    const loading = ref<boolean>(false)
    const showPopover = ref<boolean>(false)
    const confirmLoading = ref<boolean>(false)
    const orderRefundShow = ref<boolean>(false)
    const dropdown: any = ref(null)
    const productList: any = ref([])
    const form: any = ref({})
    const state = reactive({
      formData: {}  as any,
      skilllsTableData: [],
      projectData: {},
      projectId: baseDecode(
        JSON.parse(
          JSON.stringify(route.path.substring(route.path.lastIndexOf('/') + 1))
        )
      ) //项目id
    })

    const rules = reactive([{ required: true, message: '请输入退款金额', trigger: 'blur' }])

    // 输入的退款金额校验
    const changePrice = (val: any, row: any,i:number, ii: number, name: string) => {
      let v = inputLimtPrice(val)
      if (parseFloat(v) > row.payAmount){
        ElMessage.error('不能大于实付金额')
        form.value.skillOrders[i].omsOrders[ii][name] = ''
         _this.$forceUpdate()
      }
      form.value.skillOrders[i].omsOrders[ii][name] = v
    }

    //表单提交
    const submitForm = async () => {
      let list1 = [] as any,list2 = [] as any;
      state.formData.projectId = state.projectId,
      form.value.skillOrders.map((item:any) => {
        item.omsOrders.map((item2:any) => {
          list1.push({
            amount: item2.amount ? item2.amount : 0,
            orderId: item2.id,
            remark: item2.remark ? item2.remark : ''
          })
        })
        item.bizOrders.map((item2:any) => {
          list2.push({
            amount: item2.amount ? item2.amount : 0,
            orderId: item2.id.replace('order',''),
            remark: item2.remark ? item2.remark : '无'
          })
        })
      })
      state.formData.orderChanges = list1
      // await ruleForms.value.validateField((valid: any) => {
        // if (valid) {
          confirmLoading.value = true
          await fetch({
            url: '/order/bizproject/obsolete',
            method: 'post',
            data: state.formData
          }).then((res: any) => {
            if (res.code == 0) {
              ElMessage.success('操作成功')
              store.commit('setAllowRefresh',true)//修改值页面返回允许刷新列表
              setTimeout(() => {
                 $router.go(-1)
              },1000)
            }
          }).finally(() =>  confirmLoading.value = false)
        // }
      // })
    }

    const getCustomStatus = (status: any) => {
      if (status > 15) {
        return {
          type: { color: '#C0C4CC' },
          label: '已确认'
        }
      } else {
        return {
          type: { color: '#409EFF' },
          label: '待确认'
        }
      }
    }

    const getSource = (data: any) => {
      switch (data) {
        case 1:
          return 'C端'
        case 2:
          return '服务端'
        case 3:
          return '企业端'
        default:
          return '其他'
      }
    }

    const getPriceWay = (data: any) => {
      switch (data) {
        case 1:
          return '一口价'
        case 2:
          return '议价模式'
        case 3:
          return '快速呼叫'
        default:
          return '其他'
      }
    }

    const onClose = () => {
      dropdown.value.hide()
      showPopover.value = false
    }

    const sendArraySpanMethod = ({
      row,
      column,
      rowIndex,
      columnIndex
    }: any) => {
      if (row.orderItems) {
        if (columnIndex == 0) {
          return [1, 12]
        } else if (columnIndex >= 1) {
          return [0, 0]
        }
      }
    }

    // 获取项目信息
    const getTableData = async () => {
      loading.value = true
      await fetch({
        url: `/order/bizproject/applyObsolete?projectId=${state.projectId}`,
        method: 'get'
      })
        .then((res: any) => {
          if (res.code == 0) {
            state.projectData = res.data.project
            let result = res.data.skillOrders || []
            res.data.skillOrders.forEach((item: any, index: any) => {
              item.bizOrders.forEach((item2: any) => {
                if (!item2.orderItems) {
                  item2.orderItems = [{ ...item2, id: item2.id }]
                  item2.id = 'order' + item2.id
                }
              })
            })
            form.value = res.data;
            loading.value = false
          }
        })
        .finally(() => (loading.value = false))
    }
    const refund=(data:any)=>{
      productList.value = data.orderItems
      orderRefundShow.value = true
    }
    onMounted(() => {
      getTableData()
    })

    return {
      $router,
      form,
      changePrice,
      inputLimtPrice,
      rules,
      confirmLoading,
      orderRefundShow,
      submitForm,
      ruleForms,
      getCustomStatus,
      getSource,
      getPriceWay,
      sendArraySpanMethod,
      dropdown,
      onClose,
      showPopover,
      loading,
      route,
      getSkuData,
      openIM,
      groupData,
      getDeliveryType,
      getOrderStatus,
      getCustomOrderStatus,
      getDeliveryStatus,
      refund,
      productList,
      getTableData,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.el-header {
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-left{
    display: flex;
    align-items: center;
  }
  h3 {
    display: inline-block;
  }
  .header_btn {
    color: #0969da;
    border: 1px solid #0969da;
    border-radius: 0.6rem;
    width: 10rem;
    height: 2.4rem;
    line-height: 2.4rem;
    width: 4.8rem;
    text-align: center;
    cursor: pointer;
  }
}
.el-main{
  padding: 2rem 0 0;
}
.dropdown-news {
  .close-box {
    text-align: right;
  }
  .address-info {
    margin: 3rem 0 0 1.5rem;
    width: calc(100% - 4rem);
    .person-info-msg {
      margin-top: 2rem;
      margin-left: 3.6rem;
      height: 1.6rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.5rem;
      font-weight: 400;
      color: #ffffff;

      .person-name {
        max-width: 7rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .person-phone {
        max-width: 11rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .top-address {
      display: flex;
      color: #ffffff;
      min-height: 2rem;
      align-items: center;

      .address-text-data {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #d9ecff;
        margin-top: 1rem;
        margin-left: 3.6rem;
        line-height: 20px;
      }

      .address-text {
        font-size: 18px;
        color: #ffffff;
        display: flex;
        flex-wrap: wrap;
        line-height: 25px;
        margin-left: 3.5rem;
        width: calc(100% - 10rem);
        text-align: left;
      }
    }
  }
}
.empty-slot {
  margin-top: 10rem;
}
.props-table {
  display: flex;
  align-items: center;
  .el-table {
    height: auto;
  }
  p {
    width: 6.7rem;
    text-align: center;
  }
}

.footer-btn {
  padding: 1.5rem 10rem 0;
  text-align: right;
}

.order-item {
  .order-sn {
    font-size: 12px;
    font-weight: bold;
    color: #303133;
    margin-right: 10px;
  }
  .marginRight {
    margin-right: 3rem;
  }
}
.user {
  flex: 1;
  text-align: center;
  .people {
    display: inline-block;
    background: #ecf5ff;
    border-radius: 15px;
    height: 3rem;
    padding-right: 1rem;
    padding-left: 0.5rem;
    display: inline-flex;
    align-items: center;

    .avatar-img {
      width: 1.8rem;
      height: 1.8rem;
      background: #0969da;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
  }

  .message-avatar {
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 1rem;
    cursor: pointer;
  }
}

.goods-info {
  box-sizing: border-box;
  padding-left: 1rem;
  width: calc(100% - 9rem);
  height: 6rem;

  .product-name {
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .speci {
    margin: 1rem 0 0;
    color: #666;
    font-size: 12px;
  }

  .el-tag {
    margin: 1rem 0.5rem 0 0;
  }
}
.goods {
  display: flex;
  width: 100%;

  .el-image {
    width: 10rem;
    height: 10rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
  }

  .goods-info {
    box-sizing: border-box;
    padding-left: 1rem;
    width: calc(100% - 9rem);
    height: 6rem;

    .product-name {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .speci {
      margin: 1rem 0 0;
      color: #666;
      font-size: 12px;
    }

    .el-tag {
      margin: 1rem 0.5rem 0 0;
    }
  }
}
</style>
