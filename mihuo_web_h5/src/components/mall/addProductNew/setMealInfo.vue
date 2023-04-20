<template>
    <div class="set-meal">
            <div class="title">套餐价格</div>
            <el-form :model="state.form" ref="ruleForms">
                <el-form-item label="基础价格：" prop="basePrice"
                    :rules="[{ required: true, message: '请输入基础价格', trigger: 'blur' }]">
                    <el-input v-model="state.form.basePrice" placeholder="请输入基础价格" type="number"></el-input>
                </el-form-item>
                <el-form-item label="基础数量：" prop="baseQuantity"
                    :rules="[{ required: true, message: '请输入基础数量', trigger: 'blur' }]">
                    <el-input v-model="state.form.baseQuantity" placeholder="请输入基础数量" type="number"></el-input>
                </el-form-item>
                <el-form-item label="增项单价：" prop="additionPrice"
                    :rules="[{ required: true, message: '请输入增项单价', trigger: 'blur' }]">
                    <el-input v-model="state.form.additionPrice" placeholder="请输入增项单价" type="number"></el-input>
                </el-form-item>
                <el-form-item label="减项单价：" prop="reducePrice"
                    :rules="[{ required: true, message: '请输入减项单价', trigger: 'blur' }]">
                    <el-input v-model="state.form.reducePrice" placeholder="请输入减项单价" type="number"></el-input>
                </el-form-item>
                <div class="flex-center">
                    <span class="title">套餐商品</span>
                    <el-button type="primary" size="mini" icon="Plus" @click="handle('全部')">添加</el-button>
                </div>
            </el-form>
            <div class="set-meal_product">
                <div class="product-item" v-for="(item,index) in productPackageList" :key="index">
                    <div class="product-item_icon" v-if="index != 0">
                        <el-icon title="删除" @click="handle('删除整级',index)"><DeleteFilled /></el-icon>
                    </div>
                    <div class="marginBottom product-item_one">
                        <div>
                            <span><i>*</i>分类：</span>
                            <el-select v-model="item.category" placeholder="请选择分类">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button type="primary" size="mini" icon="Plus" @click="handle('添加二级',item.children,index)">添加</el-button>
                    </div>
                        <div class="marginBottom product-item_two" v-for="(val,ind) in item.children" :key="ind">
                        <div class="product-item_icon">
                            <el-icon title="删除" @click="handle('删除二级',val.products,index,ind)"><DeleteFilled /></el-icon>
                        </div>
                        <div>
                            <div class="marginBottom">
                                <span><i>*</i>商品类型：</span>
                                <el-input clearable v-model="val.type" placeholder="请输入商品类型"></el-input>
                            </div>
                            <div class="marginBottom product-item_one">
                                <span>可选商品</span>
                                <el-button type="primary" size="mini" icon="Plus" @click="handle('商品',index,ind,item)">添加</el-button>
                            </div>
                            <el-table 
                                :data="val.products" 
                                stripe
                                border
                            >
                            <el-table-column label="商品名称" align="center" prop="productName"/>
                            <el-table-column label="操作" align="center" width="80">
                                <template #default="scope">
                                <el-link type="danger" @click="handle('del',val.products,scope.row)">删除</el-link>
                                </template>
                            </el-table-column>
                            </el-table>
                        </div>
                        </div>
                </div>
            </div>
        <!-- 添加套餐商品 -->
        <add-materials v-model="dialogVisible" :is-show="false" @addProductList="addProductList"/>
    </div>
</template>

<script lang='ts' setup>
import { Message } from '@/components/Message'
import { ElMessage } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
let {ctx:that, proxy}:any = getCurrentInstance()
const props = defineProps<{
    modelValue: Object
}>()
const state = reactive({
    form:{}
} as any)
const emit = defineEmits(["updata"])
const addType = ref<any>()
provide("addType",addType)
const addPro = reactive<any>({
    parentIndex:null,
    childIndex:null,
})
const parentTempalte = reactive<any>(
    {
        category:'',  //分类
        children:[
            {
                type:'', //类型
                products:[]
            }    
        ]
    },
)
const productPackageList = ref<any>([])
const ruleForms = ref<any>(null)
const dialogVisible = ref<any>(false)
const options = ref<any>([
    {name:'主材',value:'1001'},
    {name:'辅材',value:'1002'},
    {name:'人工',value:'1003'}
])
const activeNames = ref<any>([])
const collapse = ref<any>(null)
const handleChange = (val: string[]) => {
}
const handle = (type:string,data:any,pos:any,item:any)=>{
    switch (type) {
        case "全部":
            productPackageList.value.push(
                {
                    category:'',  //分类
                    children:[
                        {
                            type:'', //类型
                            products:[]
                        }    
                    ]
                })
            break;
        case "添加二级":
            data.push({
                type:'', //类型
                products:[]
            })
            break;
        case "商品":
            if(!item.category){
                return ElMessage.warning("请选择分类")
            }
            addPro.parentIndex = data;
            addPro.childIndex = pos;
            let curType = options.value.find((data:any)=>data.value == item.category)
            addType.value = curType.name
            dialogVisible.value = true;
            break;
        case "删除整级":
            let arrProuduct = [] as any
            let cur = productPackageList.value[data]
            cur.children.some((item:any)=>{
                arrProuduct = arrProuduct.concat(item.products)
            })
            let idalls = arrProuduct.map((item:any)=>{ if(item.id){
                return item.id
            }})
            if(idalls && idalls.length){
                let res = editDelect(arrProuduct)
                if(!res) return
            }
            productPackageList.value.splice(data,1)
            break;
        case "删除二级":
            let parent = productPackageList.value[pos]
            let ids = data.map((val:any)=>{ if(val.id){
                return val.id
            }})
            if(ids && ids.length){
                let res =  editDelect(data)
                if(!res) return
            }
            parent.children.splice(item,1)
            break;
        case "del":
            let index = data.findIndex((item:any)=>item.productId == pos.productId)
            if(pos.id){
                let res = editDelect([pos])
                if(!res) return
            }
            data.splice(index,1)
            break;
    
        default:
            break;
    }
}

const childTemplate = reactive({
    type:'', //类型
    products:[]
})
const editDelect = async(arr:any) =>{
    let ids = arr.map((item:any)=>{ return item.id })
    let res = await fetch({
        url: '/mall/product/delPackageProduct',
        method: 'post',
        data : ids
    })
    return res
    // .then((res:any)=>{
    //     emit("updata",true)
    // })
}

const addProductList = (e:any)=>{
    let arr = [] as any
    e.map((item:any)=>{
        let dic = {} as any
        dic.productId= item.productId;
        dic.productImg=item.coverImg;
        dic.productName=item.name;
        dic.productSku=item.spData&&item.spData.length?JSON.stringify(item.spData):'';
        dic.skuId=item.skuId;
        arr.push(dic)
    })
    let parent = productPackageList.value[addPro.parentIndex]
    let child = parent.children[addPro.childIndex]
    child.products = child.products.concat(arr)
}
// 完成保存的事件
const handleFinishCommit = (callback: any) => {
    let empty = [] as any
    ruleForms.value.validate((valid: any) => {
        if (valid) {
            state.form.productPackageList = productGroup()
            state.form.productPackageList.map((item:any)=>{
                if(!item.type){
                    empty.push(item)
                }
            })
            let emptyList = empty.reduce((item:any, next:any)=> {
                empty[next.category] ? '' : empty[next.category] = true && item.push(next);
                return item;
            }, []);
            if(emptyList.length == 0){
                setTimeout(() => {
                    callback(true)
                }, 300)
                return
            }else{
                let tips = [] as any
                emptyList.map((item:any)=>{
                    tips.push(`检测到分类为${getTypeName(item.category)}下,商品类型没有填写,请填写!<br/>`)
                })
                Message({
                    dangerouslyUseHTMLString:true,
                    message: tips.join(","),
                    type: 'warning',
                })
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}
const getTypeName = (category:any)=>{
    let name = ''
    let res = options.value.find((item:any)=>item.value == category)?.name
    if (res) return res
    return name
}
// 组装为后端需要的数组格式
const productGroup = () =>{
    let arr = [] as any
    if(productPackageList.value && productPackageList.value.length){
        productPackageList.value.some((item:any)=>{
            if(item.children && item.children.length){
                item.children.map((child:any)=>{
                    child.products.forEach((e:any)=>{
                        e.category = item.category || '',
                        e.type = child.type || ''
                        arr.push(e)
                    })
                })
            }
        })
        return arr
    }
    return null
}
// 重置为页面需要的格式
const resetProduct = () =>{
    let data = state.form;
    let optionsCopy = options.value
    if(data && data.productPackageList && data.productPackageList.length){
        optionsCopy.map((item:any)=>{
            let childrenList = [] as any
            item.category = item.value
            item.children=[]
            data.productPackageList.forEach((val:any)=>{
                if(item.value == val.category){
                    childrenList.push(val)
                }
            })
            item.children = childrenList.reduce((pre:any, cur:any)=> {
                var findIfTypeExist = pre.findIndex((cd:any)=> {
                    return cd.type === cur.type;
                })
                if (findIfTypeExist === -1) {
                    let obj = {
                        'type': cur.type,
                        "products": [cur]
                    }
                    pre.push(obj)
                } else {
                    pre[findIfTypeExist].products.push(cur)
                }
                return pre;
            },[]);
        })
        productPackageList.value = optionsCopy.filter((item:any)=>item.children && item.children.length)
    }else{
        productPackageList.value = [parentTempalte]
    }
}
defineExpose({ handleFinishCommit })
onMounted(()=>{
    state.form = props.modelValue as any
    resetProduct()
})
</script>

<style scoped lang="less">
.set-meal {
    position: absolute;
    top: 8.6rem;
    bottom: 8.6rem;
    left: 2rem;
    right: 2rem;
    padding: 0 2rem;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 2rem;
    margin: 2rem 0;
    overflow-y: auto;
    .set-meal_item{
        display: flex;
        flex-direction: column;
    }
    .set-meal_product{
        width:100%;
        .product-item{
            padding: 2rem;
            margin: 2rem 0 0;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            .product-item_icon{
                display: flex;
                justify-content: end;
                padding: 2rem 0;
                .el-icon{
                    color: #F56C6C;
                    font-size: 2rem;
                    cursor: pointer;
                    margin-right: 0;
                }
            }
            .product-item_one{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .product-item_two{
                border: 1px dashed #d7dae2;
                padding: 2rem;
            }

        }
    }
}
.flex-center{
    display: flex;
    align-items: center;
}
.title{
    font-size: 1.8rem;
    color: #000000;
    margin-right: 2rem;
}
.marginBottom{
    margin-bottom: 2rem;
    span{
        display: inline-block;
        i{
            color: red;
            padding-right: .5rem;
        }
    }
}
.flex-beet{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
:deep(.el-collapse){
    .el-collapse-item div{
        border-style: none !important;
    }
    .el-collapse-item__header{
        height: auto;
        line-height: normal;
    }
}
</style>
