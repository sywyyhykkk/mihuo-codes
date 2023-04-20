<template>
    <div class="collection">
        <div class="collection-header">
            <div>共计 {{formData.company.contractAmount + formData.company.alterationPrice}}元</div>
            <div>
                <div class="collection-header_col">
                    <span>合同金额<i>{{formData.company.contractAmount}}元</i></span>
                    <span>变更金额<i>{{formData.company.alterationPrice}}元</i></span>
                </div>
                <div class="collection-header_moeny">
                    <span>总收款</span>
                    <i>{{formData.company.paidAmount}}</i>
                    <span>元</span>
                </div>
            </div>
            <div class="collection-header_progess">
                <span :style="{width: getProgress()+'%'}"></span>
            </div>
            <div class="skju">
                <span>收款进度</span>
                <span>{{getProgress()+'%'}}</span>
            </div>
        </div>
        <div class="collection-main">
            <el-table
                ref="factory_table"
                v-loading="loading"
                stripe
                :data="tableData.srrRes"
                border
                style="height: calc(100vh - 50rem) !important;"
                height="0"
                >
                <template v-slot:empty >
                    <img style="width:120px;height:100px" src="@/assets/img/empty/no_data.png" alt="" srcset="">
                    <p :class="{'el-table-empty-p':tableText}">{{tableText}}</p>
                </template>
                <el-table-column
                    type="index"
                    width="50"
                    align="center"
                    label="排序"
                />
                <el-table-column width="135" label="订单编号" align="center" prop="receiptCode"></el-table-column>
                <el-table-column label="收款时间" align="center" prop="created" width="90"></el-table-column>
                <el-table-column label="收款方式" align="center" prop="typeName"></el-table-column>
                <el-table-column label="收款人" align="center" prop="createByName" width="140">
                    <template #default="scope">
                        <div>
                            <div :class="scope.row.userName?'coll-user':''">
                                {{scope.row.userName}}
                            </div>
                            <div>
                                {{scope.row.skillName}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="收款备注" align="left" header-align="center" prop="remark" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="凭证" align="center" width="80">
                    <template #default="scope">
                        <div v-if="scope.row.attachmentsPics && scope.row.attachmentsPics.length" class="attachmentsPics">
                            <img style="width: 8rem; height: 8rem;border-radius: 1rem;"
                                :src="thumbnailImage(scope.row.attachmentsPics[0].url)"
                                @click="previewLook(thumbnailImage(scope.row.attachmentsPics[0].url),scope.row.attachmentsPics)"
                               />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="收款语音" align="center" width="100">
                    <template #default="scope">
                        <div v-if="scope.row.attachmentsVoice && scope.row.attachmentsVoice.fileList">
                            <audio-play :src="thumbnailImage(scope.row.attachmentsVoice.fileList)"></audio-play>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="收款金额" align="center" prop="price">
                    <template #default="scope">
                        <span class="money">￥{{scope.row.price}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="collection-table-footer">
                <tr>
                    <td></td>
                    <td><div class="title">当前页收款合计</div></td>
                    <td></td>
                    <td>￥{{tableData.receiptPrice}}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><div class="title">当前节点收款合计</div></td>
                    <td></td>
                    <td>￥{{tableData.receiptPrice}}</td>
                </tr>
            </div>
            <!-- <div class="collection-footer">
                <el-pagination-new
                :current-page="pageObj.currentPage"
                :page-size="pageObj.pageSize"
                :total="pageObj.total"
                layout="total, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
                />
            </div> -->
        </div>
        <preview-image 
          v-model="showViewer"
          :current="initialIndex"
          :src-list="previewList"
          ></preview-image>
    </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, reactive, defineProps, getCurrentInstance, inject } from 'vue';
import { fetch } from '_@/axios-config/axios';
import { thumbnailImage } from '@/components/project/projectItem/projectDetailNewData';
const { proxy } = getCurrentInstance() as any
const props = defineProps({
    data: {
        type: Object,
        default:()=> {}
    }
})
//分页
const pageObj:any=reactive({
    currentPage: 1,
    rows: 15,
    total: 0,
    pageSize: 20,
})
const tableData = ref({
    receiptPrice:0,
    srrRes:[]
})
const projectId:any = inject('projectId')
const tableText = ref('暂无数据~')
const loading = ref<boolean>(false)
const formData = reactive({
    company:{} as any
})
const collectionDetail = ref(null)
const showViewer = ref<boolean>(false)
const initialIndex = ref<any>('')
const previewList = ref<any>([])
const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val
    getListData()
}
const getListData = async () =>{
    loading.value = true;
    await fetch({
        url: `/order/sopreceiptrecords/onePage`,
        method: 'get',
        params: {
            nodeId: props.data.nodeId,
            projectId: projectId
        }
    }).then((res: any) => {
        if(res.code == '0'){
            if(res.data && res.data.srrRes){
                tableData.value = res.data;
                let imgList:any = []
                if(tableData.value && tableData.value.srrRes){
                    tableData.value.srrRes.forEach((v:any)=>{
                        v.attachmentsPics = v.attachmentsPics?JSON.parse(v.attachmentsPics):[];
                        v.attachmentsVoice = v.attachmentsVoice?JSON.parse(v.attachmentsVoice):'';
                        if(v.attachmentsPics.length){
                            v.attachmentsPics.some((item:any)=>{
                                imgList.push(thumbnailImage(item.url))
                            })
                        }
                    })
                }
            }
        }
    }).finally(()=>{
        loading.value = false;
    })
}

// 收款进度
const getProgress = () =>{
    let totalMoney = Number(formData.company.contractAmount) + Number(formData.company.alterationPrice);
    let putMoney = Number(formData.company.paidAmount);
    let progress = 0 as any
    if(totalMoney>=0){
        progress = Number((Number(putMoney/totalMoney)*100).toFixed(2))
        if(progress>=0 && progress<100){
            return progress
        }
        return 100
    }
    return progress
    
}
// 图片预览
const previewLook = (url:string,data:any) =>{
    let urls:any = []
    if(data.length){
        data.map((v:any)=>{
            urls.push(thumbnailImage(v.url))
        })
    }
    previewList.value = urls;
    initialIndex.value = url;
    showViewer.value = true;
}
const json = JSON as any
const getNodes = async () =>{
    let res = await fetch({url:` /order/project/${projectId}`,method:'get'})
    if(res.data){
        formData.company = res.data ||{};
    }
}
onMounted(async()=>{
    getNodes();
    getListData();
})
</script>

<style scoped lang="less">
.collection{
    padding: 3rem 4rem 2rem 4rem;
    box-sizing: border-box;
    .collection-header{
        div{
            margin-bottom: 1rem;
            &:first-child{
                color: #262626;
                font-size: 1.8rem;
            }
            &:nth-child(2){
                display: flex;
                justify-content: space-between;
                .collection-header_col{
                    font-size: 1.4rem;
                    span{
                        color: #909399;
                         margin-right: 2rem;
                        i{
                            font-style: normal;
                            margin-left: 1rem;
                        }
                    }
                }
                .collection-header_moeny{
                    color: #2DA44E;
                    span{
                        font-size: 1.8rem;
                        color: #2DA44E;
                        font-family: MicrosoftYaHei-Bold;
                        &:first-child{
                            padding-right: 1rem;
                        }
                    }
                    i{
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        font-style: normal;
                        font-size: 1.8rem;
                    }
                }
            }
            &:last-child{
                display: flex;
                justify-content: space-between;
                span{
                    font-size: 1.6rem;
                    color: #909399;
                    &:last-child{
                        color: #2DA44E;
                    }
                }
            }
        }
        .collection-header_progess{
            width: 100%;
            height: .6rem;
            border-radius: .3rem;
            background: #ebeef5;
            margin-bottom: 2rem;
            span{
                display: inline-block;
                height: .6rem;
                border-radius: .3rem;
                background: #2DA44E;
                margin-bottom: 2rem;
            }
        }
    }
    .collection-main{
        padding-top: 2rem;
        .collection-table-footer{
                tr{
                    width: calc(100% - .2rem);
                    display: flex;
                    border: 1px solid #EBEEF5;
                    border-top: transparent;
                    background: #F5F7FA;
                    td{
                        height: 4.9rem;
                        line-height: 4.9rem;
                        text-align: center;
                        border-right: 1px solid #EBEEF5;
                        font-size: 1.2rem;
                        width: calc((100%) - 30rem);
                        .title{
                            text-align: center;
                        }
                        &:first-child{
                            width: 6rem !important;
                        }
                        &:nth-child(2){
                            width: 17rem !important;
                        }
                        &:last-child{
                            border-right: transparent;
                            width: 12rem !important;
                            font-size: 1.8rem;
                            font-family: SimSun;
                            color: #67C23A;
                        }
                    }
                }
            }
    }
}
.el-table-empty-p{
    color: #C0C4CC;
}
:deep(.el-scrollbar__view){
	height: 100%;
}
.money{
    font-size: 1.8rem;
    font-family: SimSun;
    color: #67C23A;
}
.attachmentsPics{
    display: flex;
    flex-flow: row wrap;
}
.coll-user{
  background: #ECF5FF;
  padding: .3125rem;
  padding-left: 3rem;
  padding-right: 1.5rem;
  display: inline-block;
  border-radius: 14px;
  position: relative;
  margin-bottom: .5rem;
  &::before{
    content:'';
    position: absolute;
    background: #409EFF;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    left: .5rem;
  }
}
</style>
