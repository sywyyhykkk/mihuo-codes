<template>
    <div class="container" :style="heightContainer">
        <el-table
            stripe
            ref="multipleTable"
            :data="tableData"
            border
            v-loading="loading"
            :height="'100%'"
            row-key="id"
            :span-method="arraySpanMethod"
            :tree-props="{ children: 'orderItemList'}"
            default-expand-all
            >
            <el-table-column prop="product" label="商品" header-align="center" width="200">
                <template #default="scope">
                    <div v-if="scope.row.productPic" class="goods">
                        <el-image
                        v-if="scope.row.productPic"
                        :src="$getUrl.getPicUrl(scope.row.productPic)"
                        :preview-src-list="$getUrl.getPicUrl(scope.row.productPic)"
                        :preview-teleported="true"
                        />
                        <div class="goods_right">
                            <div class="productName">{{scope.row.productName||''}}</div>
                            <el-tag type="info">{{ scope.row.customProductCategoryName || '' }}</el-tag>
                        </div>
                    </div>
                    <div v-else class="product_pr">
                        <div class="product_pr-left">
                            <div class="product_pr">
                                <div v-if="[0].includes(scope.row.orderType)">
                                    <div v-if="!(scope.row.status == 1 || scope.row.status == 2)">
                                        <el-tag :type="getOrderStatus(scope.row.status, scope.row.orderType)?.type"
                                        >
                                            {{getOrderStatus(scope.row.status, scope.row.orderType)?.text}}
                                        </el-tag>
                                    </div>
                                    <div v-if="scope.row.status == 1 || scope.row.status == 2">
                                        <el-tag
                                            :type="
                                            getDeliveryStatus(
                                                scope.row.deliveryType
                                            ).type
                                            "
                                        >
                                            {{
                                            getDeliveryStatus(
                                                scope.row.deliveryType
                                            ).label
                                            }}
                                        </el-tag>
                                    </div>
                                </div>
                                <div v-if="[1,2].includes(scope.row.orderType)">
                                    <el-tag
                                    :type=" getOrderStatus(scope.row.status, scope.row.orderType)
                                        .type"
                                    >
                                    {{
                                        getOrderStatus(scope.row.status, scope.row.orderType).text
                                    }}
                                    </el-tag>
                                </div>
                                <div>
                                    收货人：{{ scope.row?.receiverName}}
                                    ({{ scope.row?.receiverPhone}})&nbsp;&nbsp;
                                    收货地址：{{ scope.row?.receiverPoiName}}
                                    {{ scope.row?.receiverDetailAddress}}
                                </div>
                            </div>
                            <div>
                                订单编号：{{ scope.row?.orderSn}}&nbsp;&nbsp;
                                创建时间：{{ scope.row?.updateTime}}&nbsp;&nbsp;
                                开单人：{{ scope.row?.agentName}}【{{scope.row?.agentSkillName}}】&nbsp; 
                            </div>
                            <div>
                                <!-- 卖家已支付：￥{{ scope.row?.payAmount || 0 }}&nbsp;&nbsp; -->
                                运费：￥{{ scope.row?.freightAmount || 0 }}&nbsp;&nbsp;
                                安装费：￥{{ scope.row?.freightInstallationAmount || 0 }}&nbsp;&nbsp;
                                上楼费：￥{{ scope.row?.freightStairwayAmount || 0 }}&nbsp;&nbsp;
                                补齐金额：￥{{ scope.row?.diffAmount || 0 }}&nbsp;&nbsp;
                                优惠金额：￥{{ scope.row?.promotionAmount || 0 }}
                            </div>
                        </div>
                        <div class="product_pr-right">￥{{ scope.row?.totalAmount }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="productAttr" label="规格" header-align="center" align="center">
                <template #default="scope">
                    <div v-if="scope.row.productAttr && scope.row.productAttr !='[]'" class="productAttr">
                        <div v-for="item,index in JSON.parse(scope.row.productAttr)" :key="index">
                            <span>{{ item.value || ''}}</span>
                            <span v-if="JSON.parse(scope.row.productAttr).length-1>index">-</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="单价(元)/单位" header-align="center" align="center">
                <template #default="scope">
                    <div v-if="scope.row.productId">
                        ￥{{ scope.row.productPrice || 0}}/{{scope.row.productUnit || ''}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="productQuantity" label="数量" header-align="center" align="center"/>
            <el-table-column
                label="退款状态"
                prop="payAmount"
                align="center"
            >
                <template #default="scope">
                    <div
                        v-if="scope.row.refundStatus > 0"
                        style="cursor: pointer"
                        :style="getRefundStatus(scope.row.refundStatus).style"
                        @click="refundLogs(scope.row.id)"
                    >
                        <div>{{ getRefundStatus(scope.row.refundStatus).label }}</div>
                        <div>￥{{ scope.row.refundAmount.toFixed(2) }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="totalAmounts" label="小计" header-align="center" align="center">
                <template #default="scope">
                    <div v-if="scope.row.productId">￥{{ scope.row.totalAmount || 0}}</div>
                </template>
            </el-table-column>
        </el-table>
        <!--    //订单退款查看-->
        <checkRefund v-model="checkRefundShow" :order-item-id="orderItemId" />
    </div>
</template>

<script lang='ts' setup>
import { fetch } from '_@/axios-config/axios'
import { tSeting } from './billingInformation'
import {
  getRefundStatus,
  getOrderStatus,
  getDeliveryStatus
} from '@/components/orderManagement/order'
const tableSetting = reactive(tSeting)
const props = defineProps({
    data: {
        type: Object,
        default: {}
    }, 
    projectId: {
        type: [String,Number],
        default: 0
    }
})
const heightContainer = computed(() =>{
    if(inject('isOpen')){
        return {
            height:'calc(100% - 5rem)'
        }
    }else{
        return {
            height:'calc(100% - 10rem)'
        }
    }
})
const loading = ref<boolean>(false)
const checkRefundShow = ref<boolean>(false)
const orderItemId = ref<any>('')
const tableData = ref<any>([])
const getBillList =async()=>{
    loading.value = true;
    await fetch({
        url:`/mall/order/page`,
        method:"get",
        params:{
            nodeId: props.data.nodeId,
            sourceType:4,
            projectId:props.projectId,
            serveProjectId:props.projectId,
            size:999,
        }
    }).then((res:any)=>{
        tableData.value = res.data.records
    }).finally(()=>{
        loading.value = false;
    })
}

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
    if(row.orderItemList){
        return [1, 8]
    }
}
// 退款记录
const refundLogs =(e:any)=>{
    orderItemId.value = e;
    checkRefundShow.value = true;
}
onMounted(()=>{
    getBillList()
})
</script>

<style scoped lang="less">
.goods{
    display: flex;
    .el-image{
        height: 8rem;
        width: 8rem;
        flex-shrink: 0;
    }
    .goods_right{
        padding-left: 2rem;
        .productName{
            padding-bottom: 1rem;
        }
    }
}
.productAttr{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
.product_pr{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .product_pr-right{
        font-size: 16px;
        font-weight: bold;
    }
}
</style>
