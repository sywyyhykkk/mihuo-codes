<template>
    <div class="container">
        <div class="container-header">
            <div class="container-header_top">账户预览
                <img @click="preview" :src="imgSrc" alt="" srcset="" v-if="$getPression('platform_pay_view')">
            </div>
            <el-card shadow="never" class="container-header_main">
                <div class="el-card-left">
                    <div class="header_main-col">
                        <div>余额</div>
                        <span v-if="isShow">{{ moneyTransform(accountFunds.allAmount) }}</span>
                        <span v-else>******</span>
                    </div>
                    <div class="header_main-col">
                        <div>收入</div>
                        <span v-if="isShow">{{ moneyTransform(accountFunds.receiverAmount) }}</span>
                        <span v-else>******</span>
                    </div>
                    <div class="header_main-col">
                        <div>支出</div>
                        <span v-if="isShow">{{ moneyTransform(accountFunds.payerAmount) }}</span>
                        <span v-else>******</span>
                    </div>
                </div>
                <div class="el-card-right">
                    <el-button type="primary" v-if="$getPression('platform_pay_deposit')" @click="()=>rechargeVisible=true">充值</el-button>
                    <!-- <el-button v-if="$getPression('platform_pay_withdraw')" @click="()=>withdrawVisible=true">提现</el-button> -->
                </div>
           </el-card>
        </div>
        <div class="container-main">
            <div class="container-main_top">
                <el-button type="primary" plain round v-if="$getPression('platform_pay_view')" @click="look">查看资金流水</el-button>
            </div>
            <div class="container-main_main">
                <el-table
                    stripe
                    ref="multipleTable"
                    :data="tableData"
                    border
                    v-loading="loading"
                    :height="'calc(100vh - 30rem)'"
                    >
                    <el-table-column type="index" label="序号" width="50" align="center" />
                    <template v-for="(item,index) in tableSetting" :key="index">
                        <el-table-column 
                            :prop="item.prop" :label="item.label" :min-width="item.min_width"
                            :show-overflow-tooltip="item.show_overflow" :align="item.align"
                            :header-align="item.header_align" :fixed="item.fixed"
                            :width="item.width"
                            >
                            <template #default="scope">
                                <template v-if="item.prop == 'capitalTye'">
                                    <el-tag type="success" v-if="scope.row.receiverBizUserId == '#yunBizUserId_B2C#'">收入</el-tag>
                                    <el-tag type="danger" v-if="scope.row.payerBizUserId == '#yunBizUserId_B2C#'">支出</el-tag>
                                </template>
                                <template v-else-if="item.prop == 'bizType'">
                                    {{ getTypeName(scope.row.bizType)}}
                                </template>
                                <template v-else-if="item.prop == 'bizOrder'">
                                    <template v-if="scope.row.order">
                                        <div v-if="scope.row['bizType'] == 40 || scope.row['bizType'] == 90 ">{{scope.row.order['orderSn']}}</div>
                                        <div v-if="scope.row['bizType'] == 30 || scope.row['bizType'] == 31 || scope.row['bizType'] == 80">{{scope.row.order['orderCode']}}</div>
                                    </template>
                                </template>
                                <template v-else-if="item.prop == 'amount'">
                                    <div 
                                    class="money-font"
                                    :class="{
                                            'add':scope.row['receiverBizUserId'] == '#yunBizUserId_B2C#',
                                            'subtract':scope.row['payerBizUserId'] == '#yunBizUserId_B2C#',
                                    }"
                                   >    
                                        <span v-if="scope.row['payerBizUserId'] == '#yunBizUserId_B2C#'">-</span>
                                        <span>{{ moneyTransform(scope.row[item.prop]) }}</span>
                                   </div>
                                </template>
                                <template v-else-if="item.prop == 'bizOrderList'">
                                    <div v-for="item,index in scope.row.orders" :key="index">
                                        <el-link  @click="lookOrder(scope.row,item)" type="primary">
                                            {{ item.orderSn || ''}}
                                        </el-link>
                                    </div>
                                </template>
                                <template v-else>
                                    {{scope.row[item.prop]}}
                                </template>
                            </template>
                            
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div>
        <!-- 查看订单 -->
        <orderDrawer 
            v-if="isDrawer"
            v-model="isDrawer"
            :order-type="formData.orderType"
            :order-id="formData.id"
            :order-data="formData"
        />
        <!-- 查看用户订单 -->
        <customDrawer 
            v-if="isCustomDrawer"
            v-model="isCustomDrawer"
            :order-type="formData.orderType"
            :order-id="formData.id"
            :order-data="formData"
        />
         <!-- 充值 -->
        <recharge @rechargeSuccess="getAccountFunds"/>
        <!-- 提现 -->
        <withdrawDeposit @withdrawalSuccess="getAccountFunds" :data="accountFunds"/>
    </div>
</template>

<script lang='ts' setup>
import { fetch } from '_@/axios-config/axios'
import { useRouter } from 'vue-router';
const Router = useRouter();
import { AccountFunds } from './type'
import { tSeting, getTypeName, moneyTransform } from './index'
const imgSrc:any = ref(require('@/assets/img/close.png'))
const isShow = ref<boolean>(false)
const loading = ref<boolean>(false)
const isDrawer = ref<boolean>(false)
const isCustomDrawer = ref<boolean>(false)
const tableData = ref([])
const formData = ref({})
const withdrawVisible = ref<boolean>(false) //提现
provide('withdrawVisible',withdrawVisible)  
const rechargeVisible = ref<boolean>(false) //充值
provide('rechargeVisible',rechargeVisible)
const tableSetting = reactive(tSeting)
const accountFunds = ref<AccountFunds>({
    allAmount: 0,
    payerAmount: 0,
    receiverAmount: 0,
    phone: 15758303924
})

onMounted(()=>{
    getListData()
    getAccountFunds()
})
const preview = () =>{
    isShow.value = !isShow.value
    if(isShow.value){
        imgSrc.value = require('@/assets/img/open.png')
    }else{
        imgSrc.value = require('@/assets/img/close.png')
    }
}
// 获取账户资金信息
const getAccountFunds = async() =>{
    await fetch({
        url: '/pay/platform/amount/overview',
        method: 'get',
    }).then((res: any) => {
        if(res.code == 0){
            accountFunds.value = res.data
        }
    })
}
// 获取流水信息
const getListData=async()=>{
    loading.value = true;
    await fetch({
        url:'/pay/platform/amount/record',
        method:'post',
    }).then((res: any) => {
        if(res.code == 0){
            tableData.value = res.data.records
        }
    }).finally(()=>{
         loading.value = false;
    })
}
const look = () =>{
    Router.push({path:'/capital_management/capitalFlow'})
}
const lookOrder =(data:any,row:any)=>{
    formData.value = row;
    // 商品订单/服务订单/协作订单
    if([40,90].includes(data.bizType) || (data.bizType==70 && [0,1,2].includes(row.orderType))){
        isDrawer.value=true;
    }
    // 用户订单
    if([30,31,80].includes(data.bizType) || (data.bizType==70 && [3].includes(row.orderType))){
        isCustomDrawer.value=true;
    }
}
</script>

<style scoped lang="less">
.container{
    padding: 2rem 0;
    .container-header{
        .container-header_top{
            display: flex;
            align-items: center;
            font-size: 2rem;
            img{
                width: 2.5rem;
                height: 2.5rem;
                margin-left: 1rem;
            }
        }
        .container-header_main{
            .el-card-left{
                display: flex;
                align-items: center;
                flex: 1;
                justify-content: space-between;
                .header_main-col{
                    flex: 1;
                    div{
                        font-size: 1.6rem;
                        color: #909399;
                        margin-bottom: 1rem;
                    }
                    span{
                        font-size: 2.2rem;
                        font-weight: bold;
                    }
                }
            }
        }
    }
    .container-main{
        .container-main_top{
            display: flex;
            justify-content: flex-end;
            padding-bottom: 2rem;
        }
    }
}
.money-font{
    font-family: SimSun;
    font-size: 1.6rem;
}
.add{
    color: #67C23A;
}
.subtract{
    color: #F56C6C;
}
</style>
