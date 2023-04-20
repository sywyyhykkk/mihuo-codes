<template>
    <el-dialog
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="收集信息设置"
        @close="handelClose"
        width="55rem"
    >
        <el-form :model="formData" ref="roleDialogRef" :rules="rules" label-width="10rem">
            <el-form-item label="标题信息" prop="title">
                <el-input v-model="formData.title" placeholder="请输入标题信息" clearable></el-input>
            </el-form-item>
            <el-form-item label="填写类型" prop="type">
                <el-select v-model="formData.type" placeholder="请选择填写类型" @change="select">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="formData.type === 1">
                <el-input :autosize="{ minRows: 4}"
                    type="textarea" clearable v-model="formData.remark" placeholder="请输入文本描述" />
            </el-form-item>
            <div v-if="formData.type === 2" class="box-label">
                <div v-for="(item,index) in formData.radioList" :key="index">
                    <el-form-item :label="item.label">
                        <el-input clearable v-model="item.value" placeholder="请输入选项" />
                        <el-button v-if="index>0" type="text" class="danger" icon="delete" @click="del(item,index)"></el-button>
                    </el-form-item>
                </div>
                <el-link @click="addBox" type="primary" :underline="false">添加选项</el-link>
            </div>
            <div v-if="formData.type === 3" class="box-label">
                <div v-for="(item,index) in formData.checkboxList" :key="index">
                    <el-form-item :label="item.label">
                        <el-input clearable v-model="item.value" placeholder="请输入选项" />
                        <el-button v-if="index>0" type="text" class="danger" icon="delete" @click="del(item,index)"></el-button>
                    </el-form-item>
                </div>
                <el-link @click="addBox" type="primary" :underline="false">添加选项</el-link>
            </div>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="save">确 定</el-button>
                <el-button @click="handelClose">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  content: {
    type: [String,Object],
    default: ''
  },
})
const emit = defineEmits(['update:modelValue','collback'])
const dialogVisible = ref<boolean>(false)
const roleDialogRef = ref<any>(null)
const formData = ref<any>({
    radioList:[{label:"选项A",value:""}],
    checkboxList:[
        {label:"选项A",value:''},
        {label:"选项B",value:''},
    ]
})
const rules = reactive({
  title: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  type: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
})
const options = ref([
    {label:'文本框',value:1},
    {label:'单选',value:2},
    {label:'多选',value:3},
])
const curSelect = ref<any>()
const a_z = ref<any>(["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z"])
const curList = ref<any>([])
const handelClose = () => {
    formData.value = {
        radioList:[{label:"选项A",value:""}],
        checkboxList:[
            {label:"选项A",value:'',checked:false},
            {label:"选项B",value:'',checked:false},
        ]
    };
    emit('update:modelValue', false)
}
const save =()=>{
    roleDialogRef.value.validate((valid: any) => {
        if(valid){
            emit("collback",formData.value)
            handelClose()
        }
    })
}
const addBox = ()=>{
    if(formData.value.type === 2){
        formData.value.radioList.push({
            label:"选项" + a_z.value[formData.value.radioList.length]
        })
    }
    if(formData.value.type === 3){
        formData.value.checkboxList.push({
            label:"选项" + a_z.value[formData.value.checkboxList.length],
            checked:false
        })
    }
}
const del = (row:any,i:number)=>{
    if(formData.value.type === 2){
        formData.value.radioList.splice(i,1)
    }
    if(formData.value.type === 3){
        formData.value.checkboxList.splice(i,1)
    }
}
watchEffect(()=>{
    dialogVisible.value = props.modelValue
})
watch(()=>dialogVisible.value,(news)=>{
    if(news){
        formData.value = {
            radioList:[{label:"选项A",value:""}],
            checkboxList:[
                {label:"选项A",value:'',checked:false},
                {label:"选项B",value:'',checked:false},
            ]
        }
        if(props.content){
            formData.value = props.content
        }
    }
  }
)
</script>
<style scoped lang="less">
.box-label{
    .el-link{
        margin:0 0 2rem 8rem;
    }
    .el-button{
        margin-left: 1rem;
    }
}
:deep(.el-dialog__body){
    padding:0 2rem !important;
}
</style>