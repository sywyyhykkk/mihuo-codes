<template>
    <div>
        <el-dialog
            v-model="dialogVisible"
            v-if="dialogVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            title="订单拒绝"
            @close="handelClose"
            width="54rem"
        >
            <el-form
                ref="ruleForms"
                :model="state.form"
                :rules="rules"
                label-width="10rem"
                :scrollToError="true"
            >
                <el-form-item label="拒绝理由" prop="reason">
                    <el-input
                        v-model="state.form.reason"
                        autocomplete="off"
                        type="textarea"
                        :autosize="{ minRows: 4}"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        type="primary"
                        :loading="state.loading"
                        @click="handleConfirm()"
                        >确定</el-button
                    >
                    <el-button @click="handelClose">取 消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import {
    defineEmits,
    defineProps,
    ref,
    onMounted,
    watchEffect,
    reactive,
    watch
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    orderId: {
        type: [String,Number],
        default: ''
    },
})
const emit = defineEmits(['update:modelValue', 'getData'])
const dialogVisible = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
    form:{
        orderId: props.orderId,
        reason:''
    }
} as any)
const rules = reactive({
    reason:[
        { required: true, message: '请输入拒绝理由', trigger: 'blur' }
    ]
})

const handleConfirm = () => {
    ruleForms.value.validate((valid: any) => {
        if (valid) {
            saveData()
        }
    })
}

const saveData = async () => {
    fetch({
        url: '/order/biz_order/rejectRequirementOrder',
        method: 'post',
        data: state.form
    }).then((res: any) => {
        if (res.code == '0') {
            ElMessage.success(`拒绝订单成功`)
            handelClose()
            emit('getData')
        }
    })
}

const handelClose = () => {
    state.form = {}
    emit('update:modelValue', false)
}

watchEffect(() => {
    dialogVisible.value = props.modelValue
})
</script>

<style scoped lang="less">
</style>
