<template>
    <div class="container">
        <el-card shadow="never">
            <el-form class="container-search" ref="formRef" :model="formSearch">
                <el-form-item prop="orderCode">
                   <el-input v-model="formSearch.orderCode" placeholder="订单编号" clearable prefix-icon="search"></el-input>
                </el-form-item>
                <el-form-item prop="skillId">
                    <el-select 
                        v-model="formSearch.skillId" 
                        clearable
                        placeholder="工种"
                        style="width:12rem !important">
                        <el-option
                            v-for="item in skillList"
                            :key="item.skillId"
                            :label="item.skillName"
                            :value="item.skillId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="source">
                    <el-select 
                        v-model="formSearch.source" 
                        clearable
                        placeholder="订单来源"
                        style="width:12rem !important">
                        <el-option
                            v-for="item in sourceOrder"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
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
                            >
                            <template #default="scope">
                                <template v-if="item.prop == 'orderStatus'">
                                    <div>{{ getName(scope.row.orderStatus, orderStatus)}}</div>
                                </template>
                                <template v-else-if="item.prop == 'source'">
                                   <div>{{ getName(scope.row.source, sourceOrder)}}</div>
                                </template>
                                <template v-else-if="item.prop == 'payStatus'">
                                   <div>{{ getName(scope.row.payStatus, payStatus)}}</div>
                                </template>
                                <template v-else-if="item.prop == 'address'">
                                    <div>
                                        {{scope.row?.provinceName}}
                                        {{scope.row?.provinceName == scope.row?.cityName?'':scope.row?.cityName}}
                                        {{scope.row?.districtName}}
                                        {{scope.row?.latAddress}}
                                        {{scope.row?.poiName}}
                                        {{scope.row?.address}}
                                    </div>
                                </template>
                                <template v-else>
                                    {{scope.row[item.prop]}}
                                </template>
                            </template>
                            
                        </el-table-column>
                    </template>
                    <el-table-column
                        label="操作"
                        fixed="right"
                        width="100"
                        align="center"
                    >
                        <template #default="scope">
                            <el-button 
                                link 
                                type="text" 
                                @click="handlePay(scope.row)" 
                                :disabled="scope.row.payStatus !== 'waiting'"
                                >支付</el-button>
                        </template>
                    </el-table-column>
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
import { serviceManage, orderStatus, getName, sourceOrder, payStatus} from '../index'
import { ElMessageBox } from 'element-plus'
import { Message } from '@/components/Message'
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const tableData = ref([])
const skillList = ref([])
const formSearch = reactive({}as any)
const tableSetting = reactive(serviceManage)
const page = reactive({
    size:20,
    currentPage:1,
    total:0
} as Page)

onMounted(()=>{
    getListData();
    querykillAsync();
})

const getListData=async()=>{
    loading.value = true;
    await fetch({
        url: `/order/platform/finance/order/records?size=${page.size}&current=${page.currentPage}`,
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
const handlePay =(data:any)=>{
    ElMessageBox.confirm(
    '是否确认支付？',
    '提示',
    {
        confirmButtonText: '继续支付',
        cancelButtonText: '取消',
        type: 'warning',
        }
    )
    .then(() => {
        if(data.bizOrderNo) surPay(data)
    })
}
const surPay = async(bizOrderNo:any)=>{
    await fetch({
        url: `/pay/tradeorder/appTransferExecute?bizOrderNo=${bizOrderNo}`,
        method:'get',
    }).then((res: any) => {
        if(res.code == '0'){
            Message.success("支付成功")
        }
    })
}
// 获取工种数据
const querykillAsync = async() => {
    await fetch({
        url: `/admin/sysjobskill/list/platform`,
        method:'get',
    }).then((res: any) => {
        if(res.code == '0'){
            skillList.value = res.data;
        }
    })
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
:deep(.only-item){
    .el-select{
        margin-right: 0 !important;
        .el-input__inner{
            border-bottom-right-radius: 0 !important;
            border-top-right-radius: 0 !important;
            border-right: none !important;
        }
    }
}
.status{
    color: #409EFF;
    &.status_1{
        color: #F56C6C;
    }
    &.status_2{
        color: #E6A23C;
    }
    &.status_3{
        color: #67C23A;
    }
}
.avatar{
    display: flex;
    align-content: center;
    justify-content: center;
    .avatar-img{
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        margin-right: 10px;
    }
}
</style>
