<template>
    <div class="sub-dropdown">
        <el-dropdown :hide-on-click="false" trigger="click" @visible-change="visibleChange" placement='bottom-start'>
            <slot name="header"></slot>
            <template #dropdown>
                <div class="sub-dropdown-item" v-if="treeProvince.length">
                    <div>
                        <el-tree
                        :data="treeProvince"
                        @node-click="nodeClickProvince"
                        >
                        <template #default="{ node }">
                            <span class="custom-tree-node">
                                <span>{{ node.label }}</span>
                                <el-icon><arrow-right /></el-icon>
                            </span>
                        </template>
                        </el-tree>
                    </div>
                    <div>
                        <el-tree
                        v-if="treeCity.length"
                        :data="treeCity"
                        @node-click="nodeClickCity"
                        >
                        <template #default="{ node }">
                            <span class="custom-tree-node">
                                <span>{{ node.label }}</span>
                                <el-icon><arrow-right /></el-icon>
                            </span>
                        </template>
                        </el-tree>
                    </div>
                    <div>
                        <el-tree
                        style="padding-right:1rem"
                        v-if="treeBackName.length"
                        ref="bankNameNode"
                        node-key="unionBank"
                        :data="treeBackName"
                        :props="{
                            label:'bankName',
                        }"
                        @node-click="nodeClickBankName"
                        >
                        </el-tree>
                    </div>
                </div>
                <div class="sub-dropdown-item" v-else>
                    <span class="sub-dropdown-item_empyt">暂无数据</span>
                </div>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang='ts' setup>
import { inject, reactive, ref, defineProps, nextTick } from 'vue';
import { fetch } from '_@/axios-config/axios';
const props = defineProps({
    modelValue: {
        type: Object || String || Number,
        default:()=>''
    }
})
const emit = defineEmits(['visible','nodeClick','update:modelValue'])
const formData = inject('formData') as any
const treeProvince:any = ref([])
const treeCity:any = ref([])
const treeBackName:any = ref([])
const bankNameNode:any = ref(null)


const nodeClickProvince =(node:any)=>{
    formData.val.province = node.label;
    treeCity.value = [];
    treeBackName.value = [];
    getBankArea()
}
const nodeClickCity =(node:any)=>{
    formData.val.area = node.label;
    treeBackName.value = [];
    getBankName()
}
const nodeClickBankName =(node:any)=>{
    emit('nodeClick',node)
    emit('update:modelValue',node.bankName)
}
// 获取指定对公账户支持的省份
const getBankProvince = async() =>{
    await fetch({
        url: '/pay/common/CompanyBank/Province',
        method: 'get',
        params:{
            name:formData.val.parentBankName
        }
    }).then((res: any) => {
        if (res.code == 0) {
            for (let key in res.data) {
                let obj = {} as any
                obj.label =  res.data[key];
                obj.id =  key + 1;
                treeProvince.value.push(obj)
            }
        }
    })
    
}
// 获取指定对公账户支持的市
const getBankArea = async() =>{
    await fetch({
        url: '/pay/common/CompanyBank/area',
        method: 'get',
        params:{
            name:formData.val.parentBankName,
            province:formData.val.province,
        }
    }).then((res: any) => {
        if (res.code == 0) {
            for (let key in res.data) {
                let obj = {} as any
                obj.label =  res.data[key];
                obj.id =  key + 1;
                treeCity.value.push(obj)
            }
        }
    })
}
// 获取银行支行名称
const getBankName = async() =>{
    treeBackName.value=[]
    await fetch({
        url: '/pay/common/CompanyBank/bandName',
        method: 'get',
        params:{
            name:formData.val.parentBankName,
            province:formData.val.province,
            area:formData.val.area
        }
    }).then((res: any) => {
        if (res.code == 0) {
            treeBackName.value = res.data || []
        }
    })
}
const visibleChange =(visible: any)=> {
    emit('visible', visible)
}
watch(()=>formData.val,(news)=>{
    if(news.parentBankName){
        getBankProvince()
    }
},{deep:true,immediate:true})
watch(()=>treeBackName.value,(news)=>{
    if(news.length){
        if(formData.val.unionBank && bankNameNode && bankNameNode.value){
            nextTick(()=>{
                bankNameNode.value.setCurrentKey(formData.val.unionBank)
            })
        }
    }
},{deep:true,immediate:true})
</script>

<style scoped lang="less">
.sub-dropdown{
    width: 100%;
    .el-dropdown{
        width: 100%;
        :deep(.el-dropdown--default){
            width: 100%;
        }
    }
}
    .sub-dropdown-item{
        display: flex;
        justify-content: space-between;
        .sub-dropdown-item_empyt{
            display: block;
            height: 10rem;
            line-height: 10rem;
            text-align: center;
            width: 20rem;
            color: #C0C4CC;
        }
        &>div{
            max-height: 30rem;
            overflow-y: auto;
            .el-tree{
                margin: 1rem 0 0 1rem;
            }
        }
    }
    .custom-tree-node{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.4rem;
        min-width: 15rem
    }
</style>
