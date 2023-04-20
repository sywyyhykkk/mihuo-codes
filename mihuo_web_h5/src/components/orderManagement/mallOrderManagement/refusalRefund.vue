<template>
    <el-dialog
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="拒绝退款原因"
        width="60rem"
        @close="handelClose"
    >
        <el-form
            ref="ruleForms"
            :model="formData"
            :rules="rules"
            label-width="14rem"
            :scroll-to-error="true"
        >
            <el-form-item label="拒绝退款原因" prop="reason">
                <el-input
                    v-model="formData.reason"
                    :autosize="{ minRows: 4 }"
                    type="textarea"
                />
            </el-form-item>
            <!-- <el-form-item prop="pics">
                <uploadFile
                    v-model="formData.pics"
                    :maxCount="9"
                />
            </el-form-item> -->
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleConfirm()"
                    >确定</el-button
                >
                <el-button @click="handelClose">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: () => ({})
    },
    orderId: {
        type: [Number,String],
        default: () => ''
    },
})
const formData = reactive({
    reason:'',
    pics:[],
    orderId: props.orderId,
    id:''
})
const ruleForms = ref<any>(null)
const rules = reactive({
  reason: [
    { required: true, message: '请填写拒绝退款原因', trigger: 'change' }
  ],
})
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'getSendOrderList'): void
}>()

const dialogVisible = computed({
    set(newVal: boolean) {
        emit('update:modelValue', newVal)
    },
    get() {
        return props.modelValue
    }
})

const handleConfirm =()=>{
    formData.id = props.data.id;
    ruleForms.value.validate(async(valid: any) => {
        if(valid){
            await fetch({
            url: '/mall/order/rejectRefund',
            method: 'post',
            data: formData
          }).then((res: any) => {
            if (res.code == '0') {
              ElMessage.success('拒绝退款成功')
              handelClose()
              emit('getSendOrderList')
            }
          })
        }
    })
}
const handelClose = () => {
    ruleForms.value.resetFields();
    formData.pics = [];
    emit('update:modelValue', false)
}
</script>

<style scoped lang="less">
</style>
