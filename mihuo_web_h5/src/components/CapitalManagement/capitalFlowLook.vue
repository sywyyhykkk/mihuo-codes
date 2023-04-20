<template>
    <div class="container">
        <el-card shadow="never">
            <el-form class="container-search" ref="formRef" :model="formSearch">
                <el-form-item label="记录类型：" prop="type">
                    <el-select v-model="formSearch.type" clearable placeholder="记录类型">
                        <el-option
                            v-for="item in flowType"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源类型：" prop="bizType">
                    <el-select v-model="formSearch.bizType" clearable placeholder="来源类型">
                        <el-option
                            v-for="item in orderTypeBiz"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="only-item">
                    <el-select 
                        v-model="formSearch.timeFilter" 
                        placeholder="时间类型"
                        style="width:12rem !important">
                        <el-option
                            v-for="item in timeFilter"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker
                        v-model="formSearch.time"
                        type="daterange"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        @change="changePicker"
                    />
                </el-form-item>
            </el-form>
            <div class="el-card-right">
                <el-button type="primary" icon="search" @click="getListData">查询</el-button>
                <el-button icon="refresh" @click="reset">重置</el-button>
            </div>
        </el-card>
        <div class="container-main">
            <div class="container-main_main">
                <el-table
                    stripe
                    ref="multipleTable"
                    :data="tableData"
                    border
                    v-loading="loading"
                    :height="'calc(100vh - 25rem)'"
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
        <div class="container-footer">
            <el-pagination-new
                :current-page="page.currentPage"
                :page-size="page.size"
                :total="page.total"
                layout="total, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
            />
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
    </div>
</template>

<script lang='ts' setup>
import { fetch } from '_@/axios-config/axios'
import moment from 'moment'
import { useRouter } from 'vue-router';
const Router = useRouter();
import { AccountFunds, Page } from './type'
import { tSeting, flowType, orderTypeBiz, getTypeName, moneyTransform, timeFilter} from './index'
const loading = ref<boolean>(false)
const isDrawer = ref<boolean>(false)
const isCustomDrawer = ref<boolean>(false)
const formRef = ref<any>(null)
const tableData = ref([])
const formSearch = reactive({
    type:0,
    bizType:0,
    timeFilter:0
}as any)
const formData = ref<any>({})
const tableSetting = reactive(tSeting)
const page = reactive({
    size:20,
    currentPage:1,
    total:0
} as Page)

onMounted(()=>{
    getListData()
})
// 获取流水信息
const getListData=async()=>{
    formSearch.type = formSearch.type?formSearch.type:0;
    formSearch.bizType = formSearch.bizType?formSearch.bizType:0;
    loading.value = true;
    await fetch({
        url: `/pay/platform/amount/record?size=${page.size}&current=${page.currentPage}`,
        method:'post',
        data: formSearch
    }).then((res: any) => {
        if(res.code == '0'){
            tableData.value = res.data.records;
            page.total = res.data.total;
        }
    }).finally(()=>{
         loading.value = false;
    })
}
const reset = () => {
    formRef.value.resetFields()
    getListData()
}
const changePicker = (val:any) => {
    if(val && val.length){
        const duration = moment(val[1]).diff(val[0],'day')
        formSearch.startTime = val[0]
        formSearch.endTime = val[1]
    }else{
        formSearch.startTime = null
        formSearch.endTime = null
    }
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
const handleCurrentChange = (val: number) => {
    page.currentPage = val
    getListData()
}
</script>

<style scoped lang="less">
.container{
    padding:0 0 2rem;
    .container-search{
        display: flex;
        align-items: center;
    }
    .container-main{
        .container-main_top{
            display: flex;
            justify-content: flex-end;
            padding-bottom: 2rem;
        }
    }
}
:deep(.el-card__body){
    padding: 0;
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
.only-item{
    /deep/.el-select{
        margin-right: 0 !important;
        .el-input__inner{
            border-bottom-right-radius: 0 !important;
            border-top-right-radius: 0 !important;
            border-right: none !important;
        }
    }
    .el-date-editor{
        border-bottom-left-radius: 0 !important;
        border-top-left-radius: 0 !important;
        border-left: none !important;
    }
}
</style>
