<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="pageTitle"
        width="56rem"
    >
            <el-form 
            ref="formDom" 
            :model="formData.val" 
            label-width="12rem" 
            :rules="rules">
                <el-form-item label="绑定手机号" prop="phone">
                    <el-input v-model.number="formData.val.phone"
                        oninput="value=value.replace(/[^\d]/g,'')" autocomplete="off" class="no-padding">
                        <template #append>
                            <div @click="getVerificationCode" style="padding:0 1.2rem;text-align:center;color: #0969DA;cursor: pointer;">{{send}}</div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="verifyCode">
                    <el-input v-model="formData.val.verifyCode"></el-input>
                </el-form-item>
                <el-form-item label="支付密码" prop="password">
                    <el-input 
                    maxlength="6" 
                    v-model.number="formData.val.password" 
                    oninput="value=value.replace(/[^\d]/g,'')"
                    show-password></el-input>
                </el-form-item>
                <el-form-item label="确认支付密码" prop="password1">
                    <el-input 
                    maxlength="6" 
                    v-model.number="formData.val.password1" 
                    oninput="value=value.replace(/[^\d]/g,'')"
                    show-password></el-input>
                </el-form-item>
            </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button type="primary" @click="savePre" :loading="loadingBtn">确认</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
import { ElMessage } from 'element-plus';
import { defineComponent,inject,nextTick,onMounted, reactive, ref, watch} from 'vue';
import { fetch } from '_@/axios-config/axios';

export default defineComponent({
    setup(props:any,{emit}) {
        const formDom:any=ref(null);//绑定子组件ref
        const loadingBtn:any = ref<boolean>(false);
        const dialogVisible:any = inject('dialogVisibleSafety')
        const lookCompanyStatus:any = inject('lookCompanyStatus')
        const pageTitle = inject('pageTitle')
        const formData = reactive({
            val:{}
        } as any);
        async function savePre(){
            let res = await formDom.value.validate().then((valid:any)=>{
                return valid
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                await fetch({
                url: '/pay/account/company/bindphonepassword',
                method: 'post',
                data:formData.val
            }).then((res: any) => {
                if(res.code == '0'){
                    ElMessage.success('设置成功');
                    dialogVisible.value = false
                    lookCompanyStatus()
                }
            })
            }
        }
        const validatePass = (rule: any, value: any, callback: any) => {
            if (value === '') {
                callback(new Error('请确认支付密码'))
            } else if (value !== formData.val.password) {
                callback(new Error("两次密码不一致"))
            } else {
                callback()
            }
        }
        const rules = reactive({
            phone:[{ required: true, message: '请输入绑定手机号', trigger: 'blur' }],
            verifyCode:[{ required: true, message: '请输入验证码', trigger: 'blur' }],
            password:[
                { required: true, message: '请输入支付密码', trigger: 'blur' },
                { pattern: /^([1-9]{1})(\d{5})$/, message: '请输入6位数密码', trigger: 'blur' }
            ],
            password1:[{ validator:validatePass , required: true, trigger: 'blur' }],
        } as any)
        const times = ref<number>(60)
        const send = ref('发送验证码')
        // 获取验证码
        const getVerificationCode = async () => {
            if(!formData.val.phone){
                ElMessage.warning('请输入绑定手机后发送')
                return false
            }
            let params = {
                phone:formData.val.phone
            }
            await fetch({
                url: '/pay/account/company/sendverifycode/bind',
                method: 'post',
                data:params
            })
            .then((res: any) => {
            if (res.data) {
                ElMessage.success('短信已发送，请注意查收')
                const timer = setInterval(() => {
                times.value--
                if (times.value <= 0) {
                    send.value = '发送验证码'
                    clearInterval(timer)
                    times.value = 60
                } else {
                    send.value = times.value + '秒后重试'
                }
                }, 1000)
            } else {
                ElMessage.error(res.msg)
            }
            })
            .catch((erro) => {
                ElMessage.error(erro)
            })
        }
        
        watch(()=>dialogVisible,(newVal:any)=>{
            //dialog显示,清除form验证
            if(newVal && newVal.value){
                nextTick(()=>{
                    if(formDom && formDom.value){
                        formDom.value.resetFields();
                    }
                })
            }
        },{immediate:true,deep:true,})
        onMounted(() => {
        })
        return {
            dialogVisible,
            formDom,
            loadingBtn,
            pageTitle,
            formData,
            savePre,
            getVerificationCode,
            times,
            send,
            rules,
        }
    }
})
</script>

<style scoped lang="less">
:deep(.no-padding){
    .el-input__inner{
        border-right: transparent;
    }
}

</style>
