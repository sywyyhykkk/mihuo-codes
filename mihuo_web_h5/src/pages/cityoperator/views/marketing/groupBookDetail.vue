<template>
    <div class="container">
        <el-card shadow="never" class="el-card">
            <div class="card-left">
                <div class="group-name">活动名称：{{ formData.title || ''}}</div>
                <ul class="group-info">
                    <li>商品数量：<i>{{ formData.promotionProductRelationList && formData.promotionProductRelationList.length || 0}}</i>种</li>
                    <li>参与拼团人数：<i>{{ statistics.groupNum || 0}}</i>人</li>
                    <li>待成团人数：<i>{{ statistics.waitGroupNum || 0}}</i>人</li>
                </ul>
            </div>
            <div class="el-card-right">
                <!-- <el-link type="primary" :underline="false">操作日志</el-link> -->
            </div>
        </el-card>
        <el-table
            stripe
            :data="formData.promotionProductRelationList"
            border
            v-loading="loading"
            :height="'calc(100vh - 20rem)'"
            style="width:100%"
            >
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column label="商品名称" align="center" prop="productName"/>
            <el-table-column label="参与拼团人数" align="center" prop="currentGroupCount"/>
            <el-table-column label="待成团人数" align="center">
                <template #default="scope">
                    <span>{{$getNum.numSub(scope.row.currentGroupCount, scope.row.groupBuyersCount)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="拼团库存" align="center" prop="flashPromotionStock"/>
            <el-table-column label="拼团价格" align="center" prop="flashPromotionPrice"/>
            <el-table-column label="成团人数" align="center" prop="groupBuyersCount"/>
        </el-table>
    </div>
</template>

<script lang='ts' setup>
import { fetch } from '_@/axios-config/axios'
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter() as any
const formData = ref<any>({})
const loading = ref<boolean>(false)
const statistics = reactive({
    productNum:0,   //商品数量
    groupNum:0,      //参与拼团人数
    waitGroupNum:0,   //待成团人数
})
const getGroupBook = async()=>{
    loading.value = true
    await fetch({
        url: `/mall/smsflashpromotion/query/${currentRoute.value.params.id}`,
        method:'get',
    }).then((res: any) => {
        if(res.code == 0){
            formData.value = res.data;
            if(res.data.promotionProductRelationList?.length){
                statistics.productNum = res.data.promotionProductRelationList.reduce((pre: any, next: { flashPromotionStock: any; }) => {
                    return pre + next.flashPromotionStock
                }, 0)
                statistics.groupNum = res.data.promotionProductRelationList.reduce((pre: any, next: { currentGroupCount: any; }) => {
                    return pre + next.currentGroupCount
                }, 0)
                statistics.waitGroupNum = res.data.promotionProductRelationList.reduce((pre: any, next:any) => {
                    return pre + ( Number(next.currentGroupCount)- Number(next.groupBuyersCount))
                }, 0)
            }
        }
    }).finally(()=>{
        loading.value = false
    })
}

onMounted(()=>{
    getGroupBook()
})
</script>

<style scoped lang="less">
.card-left{
    flex: 1;
    .group-name{
        font-size: 1.8rem;
    }
    ul{
        display: flex;
        justify-content: space-between;
        margin: 2rem 0;
        list-style:none;
        font-size: 1.8rem;
        i{
            font-size: 2rem;
        }
    }
}
</style>
