<template>
    <div class="container">
        <el-card shadow="never">
            <el-form class="container-search" ref="formRef" :model="formSearch">
                <el-form-item label="活动时间：" prop="date">
                    <el-date-picker
                        v-model="formSearch.date"
                        type="daterange"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        @change="(e)=>{
                            formSearch.startDate= e?e[0]:'';
                            formSearch.endDate=e?e[1]:''
                        }"
                    />
                </el-form-item>
                <el-form-item label="活动名称：" prop="title">
                   <el-input v-model="formSearch.title" placeholder="活动名称" clearable prefix-icon="search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="search" @click="getListData">查询</el-button>
                    <el-button icon="refresh" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="el-card-right">
                <el-button type="primary" v-if="$getPression('basic_basicevents_add')" icon="plus" @click="add">新增</el-button>
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
                    style="width:100%"
                    >
                    <el-table-column label="编号" align="center" prop="id"/>
                    <el-table-column label="活动名称" align="center" prop="title"> </el-table-column>
                    <el-table-column label="活动时间" align="center" width="300">
                        <template #default="scope">
                            {{ scope.row.startDate }}至{{ scope.row.endDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="报名人数" align="center" prop="registrationCount"/>
                    <el-table-column label="活动状态" align="center" />
                    <!-- <el-table-column label="二维码" align="center" /> -->
                    <el-table-column label="活动备注" header-align="center" align="left" prop="remark"/>
                    <el-table-column
                        label="操作"
                        fixed="right"
                        width="150"
                        align="center"
                    >
                        <template #default="scope">
                            <el-button size="small" type="text" 
                            icon="edit" 
                            @click="edit(scope.row)"
                            v-if="$getPression('basic_basicevents_edit')">
                                编辑
                            </el-button>
                            <el-button 
                                size="small" 
                                type="text" 
                                class="danger" 
                                icon="delete"
                                @click="del(scope.row)"
                                v-if="$getPression('basic_basicevents_del')">
                                删除
                            </el-button>
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
        <el-dialog
            v-model="dialogVisible"
            v-if="dialogVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :before-close="handleClose"
            title="活动报名"
            append-to-body
            width="70rem"
            >
            <el-form label-width="10rem" style="width: 100%" :model="fromData" :rules="rule" ref="ruleForm">
                <label class="label_title">基础信息</label>
                <el-form-item label="活动名称" prop="title">
                    <el-input v-model="fromData.title" placeholder="请输入活动名称" clearable/>
                </el-form-item>
                <el-form-item label="信息收集">
                    <el-link @click="addConfig" type="primary" :underline="false">点击添加</el-link>
                    （请添加配置需要收集的信息）
                    <template v-if="fromData.news && fromData.news.length">
                        <div v-for="item,indx in fromData.news" :key="indx" class="content-item">
                            <div>
                                <div>
                                    <div>活动信息</div>
                                    <el-input v-model="item.title" placeholder="请输入活动名称" clearable/>
                                </div>
                                <div>
                                    <div>填写类型</div>
                                    <el-select v-model="item.type" placeholder="请选择填写类型">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        />
                                    </el-select>
                                </div>
                                <div v-if="item.type == 1">
                                    <div>文本</div>
                                    <el-input v-model="item.remark"  placeholder=""></el-input>
                                </div>
                                <div v-if="item.type == 2">
                                    <div>单选</div>
                                    <el-radio-group v-model="radio">
                                        <el-radio v-for="(val,idx) in item.radioList" :key="idx" :label="val.value"></el-radio>
                                    </el-radio-group>
                                </div>
                                <div v-if="item.type == 3">
                                    <div>多选</div>
                                    <el-checkbox-group>
                                        <el-checkbox v-for="(val,idx) in item.checkboxList" :key="idx" :label="val.value" />
                                    </el-checkbox-group>
                                </div>
                            </div>
                            <el-button 
                                size="small" 
                                type="text" 
                                icon="edit"
                                @click="editContent(item,indx)"
                                >
                                编辑
                            </el-button>
                            <el-button 
                                size="small" 
                                type="text" 
                                class="danger"
                                icon="delete"
                                @click="delContent(item,indx)">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-form-item>
                <label class="label_title">其他信息</label>
                <el-form-item label="活动时间" prop="date">
                    <el-date-picker
                        style="width: 100%;"
                        v-model="fromData.date"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        @change="(e)=>{
                            fromData.startDate= e?e[0]:'';
                            fromData.endDate=e?e[1]:''
                        }"
                    />
                </el-form-item>
                <!-- <el-form-item label="报名人数" prop="registrationCount">
                    <el-input-number :min="0" v-model="fromData.registrationCount"></el-input-number>
                </el-form-item> -->
                <el-form-item label="活动配文" prop="backgroundImage">
                    <AppTextEdit v-model="fromData.backgroundImage" />
                </el-form-item>
                <el-form-item label="活动备注" prop="remark">
                    <el-input :autosize="{ minRows: 4}"
                    type="textarea" clearable v-model="fromData.remark" placeholder="请输入活动备注" />
                </el-form-item>
            </el-form>
            <configDialog v-model="configVisible" @collback="configSave" :content="content"></configDialog>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang='ts' setup>
import { fetch } from '_@/axios-config/axios'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Message } from '@/components/Message'
import { useRouter } from 'vue-router'
const loading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const productVisible = ref<boolean>(false)
const configVisible = ref<boolean>(false)
const formRef = ref<any>(null)
const ruleForm = ref<any>(null)
const id = ref<any>(null)
const tableData = ref([])
const formSearch = reactive({}as any)
const fromData = ref({
    isFlag:1,
    news:[]
}as any)
const content = ref<any>()
provide("content",content)
const options = ref([
    {label:'文本框',value:1},
    {label:'单选',value:2},
    {label:'多选',value:3},
])
const rule = reactive({
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  date: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
})
const page = reactive({
    size:20,
    currentPage:1,
    total:0
} as any)

onMounted(()=>{
    getListData();
})

const getListData=async()=>{
    loading.value = true;
    await fetch({
        url: `/basic/basicevents/page?size=${page.size}&current=${page.currentPage}`,
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
const add = ()=>{
    dialogVisible.value=true;
}
const reset = () => {
    formRef.value.resetFields();
    formSearch.startDate= '';
    formSearch.endDate=''
    getListData()
}

const save = () => {
    let url = ''
    if(fromData.value.isFlag == 1){
        url = `/basic/basicevents/add`
    }else{
        url = `/basic/basicevents/edit`
    }
    ruleForm.value.validate((valid: any) => {
        if (valid) {
            if(fromData.value.news && fromData.value.news.length){
                fromData.value.content = JSON.stringify(fromData.value.news)
            }
            fetch({
                url: url,
                method:'post',
                data:fromData.value
            }).then((res: any) => {
                if(res.code == 0){
                    ElMessage.success("保存成功");
                    dialogVisible.value = false;
                    getListData()
                }
            })
        }
    })
}
const edit = async(row:any)=>{
    row.date = [row.startDate,row.endDate];
    if(row.content){
        row.news = JSON.parse(row.content)
    }else{
        row.news = []
    }
    fromData.value = Object.assign({},row); 
    dialogVisible.value = true
}
const del = (row:any)=>{
    ElMessageBox.confirm(`是否确定要删除${row.title}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async(res) => {
        await fetch({
            url: `/basic/basicevents/del/${row.id}`,
            method:'post',
        }).then((res: any) => {
            if(res.code == 0){
                ElMessage.success("删除成功")
                getListData()
            }
        })
    })
}
const handleClose=()=>{
    ruleForm.value.resetFields();
    fromData.value = {
        isFlag:1,
        news:[]
    }
    dialogVisible.value = false;
}

const addConfig = ()=>{
    content.value = ''
    configVisible.value = true;
}
const configSave = (e:object)=>{
    fromData.value.news.push(e)
}
const handleCurrentChange = (val: number) => {
    page.currentPage = val
    getListData()
}
const editContent = (item:any,i:number)=>{
    content.value = item
    configVisible.value = true;
}
const delContent = (item:any,i:number)=>{
    fromData.value.news.splice(i,1)
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
:deep(.el-input-number .el-input){
    width: auto !important;
}
:deep(.el-input){
    width: 100% !important;
}
:deep(.el-textarea){
    width: 100% !important;
}
:deep(.el-dialog__body){
    padding:0 2rem !important;
}
.label_title{
    font-size: 1.8rem;
    font-weight: bold;
    display: block;
    margin-top: 2rem;
}
.content-item{
    padding: 2rem;
    border: 1px dashed #dcdfe6;
    margin: 5px 0;
    display: flex;
}
</style>
