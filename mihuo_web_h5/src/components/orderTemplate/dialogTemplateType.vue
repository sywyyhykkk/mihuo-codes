<template>
    <el-dialog
        v-model="templateShow"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="配置模板"
        top="8rem"
        @close="handelClose"
    >
        <div class="c">
            <el-form
                ref="templateFormRef"
                :rules="rules"
                :model="formData"
                label-width="11rem"
            >
                <el-form-item label="模板名称" prop="templateName">
                    <el-input v-model="formData.templateName" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formData.remark" type="textarea" :rows="4"/>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="formData.sort" type="number" :min="0" @change="changeSort"/>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="saveTemplate">确 定</el-button>
                <el-button @click="handelClose">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: {}
    },
})
const emit = defineEmits(['update:modelValue', 'getData'])
const templateShow = ref<any>(false)
const templateFormRef = ref<any>('')
const formData:any = inject('formData') 
const rules = reactive({
    templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
})
const getTemplateData:any = inject("getTemplateData")
const saveTemplate = () =>{
     templateFormRef.value.validate(async (valid: boolean) => {
        if(valid){
            formData.value.deleteStatus = 0;
            await fetch({
                url: `/order/bizordermaterialtemplate/saveOrUpdateOrderMaterialTemplate`,
                method: 'post',
                data:formData.value
            }).then((res) => {
                if (res.data) {
                    ElMessage.success("操作成功");
                    handelClose();
                    getTemplateData();
                }
            })
        }
     })
}
const handelClose = () => {
    emit('update:modelValue', false)
}
const changeSort = (e:any) => {
    let sort = Number(e)
    formData.value.sort = sort<0?0:e
}
watchEffect(() => {
    templateShow.value = props.modelValue
})
</script>
<style scoped lang="less">
</style>