<template>
    <div class="container">
        <el-card shadow="never">
            <el-form class="container-search" ref="formRef" :model="formSearch">
                <el-form-item prop="projectName">
                   <el-input v-model="formSearch.projectName" placeholder="项目名称" clearable prefix-icon="search"></el-input>
                </el-form-item>
                <el-form-item prop="poiName">
                   <el-input v-model="formSearch.poiName" placeholder="小区/商圈" clearable prefix-icon="search"></el-input>
                </el-form-item>
                <el-form-item class="only-item" :prop="formSearch.customer">
                    <el-select 
                        v-model="formSearch.customer" 
                        placeholder="客户"
                        style="width:12rem !important"
                        @change="customerChange">
                        <el-option
                            v-for="item in customerList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                     <el-input 
                        v-model="formSearch[formSearch.customer]"
                        prefix-icon="search"
                        :placeholder="formSearch.customer=='customerName'?'客户姓名':'客户电话'" 
                        clearable/>
                </el-form-item>
                <el-form-item label="" prop="projectStatus">
                    <el-select 
                        v-model="formSearch.projectStatus" 
                        clearable
                        placeholder="项目状态"
                        style="width:12rem !important">
                        <el-option
                            v-for="item in projectStatusList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="创建日期：" prop="date">
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
                </el-form-item> -->
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
                                <template v-if="item.prop == 'projectStatus'">
                                    <div :class="'status status_'+ scope.row.projectStatus">{{ getName(scope.row.projectStatus, projectStatusList)}}</div>
                                </template>
                                <template v-else-if="item.prop == 'manager'">
                                    <div class="avatar">
                                        <img
                                            class="avatar-img"
                                            :src="$getUrl.getPicUrl(scope.row.manager?.avatar)"
                                            @error="$getUrl.imageError($event)"
                                        >
                                        <div class="avatar-name">{{scope.row.manager?.name || ''}}</div>
                                    </div>
                                </template>
                                <template v-else-if="item.prop == 'designer'">
                                    <div class="avatar" v-if="scope.row.designer">
                                        <img
                                            class="avatar-img"
                                            :src="$getUrl.getPicUrl(scope.row.designer?.avatar)"
                                            @error="$getUrl.imageError($event)"
                                        >
                                        <div class="avatar-name">{{scope.row.designer.name || ''}}</div>
                                    </div>
                                    <div v-else>-</div>
                                </template>
                                <template v-else-if="item.prop == 'servers'">
                                    <div v-if="scope.row.servers && scope.row.servers.length">
                                        <template v-for="item,index in scope.row.servers" :key="index">
                                            <div class="avatar" v-if="index===0">
                                                <img
                                                    class="avatar-img"
                                                    :src="$getUrl.getPicUrl(item?.avatar)"
                                                    @error="$getUrl.imageError($event)"
                                                >
                                                <div class="avatar-name">{{item?.name || ''}}（{{item?.skillName || ''}}）</div>
                                                <el-popover
                                                    v-if="scope.row.servers.length>1"
                                                    placement="right"
                                                    title="其他服务人员"
                                                    width="160"
                                                    >
                                                    <template #reference>
                                                        <el-icon class="avatar"><InfoFilled/></el-icon>
                                                    </template>
                                                    <template #default>
                                                        <div v-if="scope.row.servers && scope.row.servers.length">
                                                            <template v-for="item,index in scope.row.servers" :key="index">
                                                                <div class="avatar avatar_tip">
                                                                    <span>{{ index + 1}}、</span>
                                                                    <img
                                                                        class="avatar-img"
                                                                        :src="$getUrl.getPicUrl(item?.avatar)"
                                                                        @error="$getUrl.imageError($event)"
                                                                    >
                                                                    <div class="avatar-name">{{item?.name || ''}}（{{item?.skillName || ''}}）</div>
                                                                </div>
                                                            </template>
                                                        </div>
                                                        <div v-else class="avatar">暂无人员~</div>
                                                    </template>
                                                </el-popover>
                                            </div>
                                        </template>
                                    </div>
                                    <div v-else>-</div>
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
import { settlementManage, projectStatusList, getName, customerList, checkList} from '../index'
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const tableData = ref([])
const formSearch = reactive({
    customer:'customerName'
}as any)
const tableSetting = reactive(settlementManage)
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
    loading.value = true;
    await fetch({
        url: `/order/platform/finance/project/records?size=${page.size}&current=${page.currentPage}`,
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
    formRef.value.resetFields()
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
const customerChange = (data:any) =>{
    if(data == 'customerName') formSearch.customerPhone = '';
    if(data == 'customerPhone') formSearch.customerName = '';
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
    }
    .avatar-name{
        padding: 0 10px;
    }
}
.avatar_tip{
    justify-content: start;
}
/deep/.el-table__cell{
    div{
        align-items: center;
    }
}
</style>
