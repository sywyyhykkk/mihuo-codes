<template>
    <div class="container">
        <el-card shadow="never">
            <el-form class="container-search" ref="formRef" :model="formSearch">
                <el-form-item prop="orderSn">
                   <el-input v-model="formSearch.orderSn" placeholder="订单编号" clearable prefix-icon="search"></el-input>
                </el-form-item>
                <el-form-item label="" prop="companyName">
                    <el-autocomplete
                        v-model="formSearch.companyName"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="供应商"
                        value-key="companyName"
                        @select="handleSelect"
                        clearable
                        prefix-icon="search"
                    />
                </el-form-item>
                <!-- <el-form-item label="" prop="statusFoot">
                    <el-select 
                        v-model="formSearch.status" 
                        clearable
                        placeholder="结算状态"
                        style="width:12rem !important">
                        <el-option
                            v-for="item in statusFoot"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sourceType">
                    <el-select 
                        v-model="formSearch.sourceType" 
                        placeholder="单据来源"
                        style="width:12rem !important">
                        <el-option
                            v-for="item in sourceType"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="创建日期：" prop="date">
                    <el-date-picker
                        v-model="formSearch.date"
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
                            :type="item.prop == 'items'?'expand':''"
                            >
                            <template #default="scope">
                                <template v-if="item.prop == 'address'">
                                    <div>
                                        {{scope.row.receiverProvince || ''}}
                                        {{scope.row.receiverProvince==scope.row.receiverCity?'':scope.row.receiverCity}}
                                        {{scope.row.receiverRegion || ''}}
                                        {{scope.row.receiverLatAddress || ''}}
                                        {{scope.row.receiverPoiName || ''}}
                                        {{scope.row.receiverDetailAddress || ''}}
                                    </div>
                                </template>
                                <template v-else-if="item.prop == 'items'">
                                    <el-table 
                                        :data="scope.row.items" 
                                        :header-cell-style="tableHeaderColor"
                                        :cell-style="tableHeaderColor"
                                        border
                                        >
                                        <el-table-column prop="productName" header-align="center" align="center" label="商品名称"/>
                                        <el-table-column prop="productAttr" header-align="center" align="center" label="规格/属性">
                                            <template #default="scopes">
                                                <div v-if="scopes.row.productAttr">
                                                    <template v-for="v,i in JSON.parse(scopes.row.productAttr)" :key="i">
                                                        <span>{{ v.value}}</span><span v-if="(i+1) != JSON.parse(scopes.row.productAttr).length">/</span>
                                                    </template>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="productPrice" header-align="center" align="center" label="价格"/>
                                        <el-table-column prop="productPurchasePrice" header-align="center" align="center" label="结算价格"/>
                                        <el-table-column prop="productQuantity" header-align="center" align="center" label="数量"/>
                                    </el-table>
                                </template>
                                <template v-else-if="item.prop == 'amount'">
                                    <div>{{amountToall(scope.row)}}</div>
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
    </div>
</template>

<script lang='ts' setup>
import { fetch } from '_@/axios-config/axios'
import { Page } from '../type'
import { supplierMange, statusFoot, sourceType} from '../index'
const loading = ref<boolean>(false)
const loadingSearch = ref<boolean>(false)
const formRef = ref<any>(null)
const tableData = ref([])
const companyList = ref([])
const formSearch = reactive({
    customer:'customerName'
}as any)
const tableSetting = reactive(supplierMange)
const page = reactive({
    size:20,
    currentPage:1,
    total:0
} as Page)

onMounted(()=>{
    getListData()
})

const getListData=async()=>{
    loading.value = true;
    await fetch({
        url: `/order/platform/finance/supplier/records?size=${page.size}&current=${page.currentPage}`,
        method:'get',
        params: formSearch
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
    formSearch.createStartDate = '';
    formSearch.createEndingDate = '';
    formSearch.companyId = '';
    formRef.value.resetFields();
    getListData()
}
const changePicker = (val:any) => {
    if(val && val.length){
        formSearch.createStartDate = val[0];
        formSearch.createEndingDate = val[1];
    }else{
        formSearch.createStartDate = '';
        formSearch.createEndingDate = '';
    }
}
const handleCurrentChange = (val: number) => {
    page.currentPage = val
    getListData()
}
// 供应商查询
const querySearchAsync = async(queryString: string, cb: (arg: any) => void) => {
    if(!queryString) formSearch.companyId = ''
    await fetch({
        url: `/admin/company/page?size=999&companyName=${queryString}`,
        method:'get',
    }).then((res: any) => {
        if(res.code == '0'){
            cb(res.data.records)
        }
    })
}
const handleSelect = (item: any) => {
    if(item && item.companyId){
        formSearch.companyId = item.companyId
    }else{
        formSearch.companyId=''
    }
}
const amountToall=(data:any)=>{
    /**  1 价格累加 */
    // return data.items.reduce((cur:any, prev:any) => cur + Number(prev.productPrice), 0)
    /**  2 结算金额+优惠金额 */
    return (Number(data.payAmount) + Number(data.promotionAmount)).toFixed(2)
}

const tableHeaderColor = ()=>{
    return { background: '#f5f7fa' }
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
</style>
