<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="pageTitle?pageTitle:'忘记密码'"
        width="57rem"
    >
            <el-form 
            ref="formDom" 
            :model="formData.val"
            label-width="13rem"
            class="form-margin"
            :rules="rules">
                <el-form-item label="绑定手机号">
                    <div class="my-phone">
                        <div class="phone">
                            {{formData.val.phone}}
                        </div>
                        <el-button type="primary" @click="getVerificationCode">{{send}}</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="formData.val.code"></el-input>
                </el-form-item>
                <el-form-item label="法人手机号">
                    <div class="my-phone">
                        <div class="phone">
                            {{phone(formData.val.legalPhones)}}
                        </div>
                        <el-button type="primary" @click="getVerificationCodeLegal">{{sendLegal}}</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="验证码" prop="legalCode">
                    <el-input v-model="formData.val.legalCode"></el-input>
                </el-form-item>
                <el-form-item label="新支付密码" prop="password">
                    <el-input 
                    maxlength="6" 
                    v-model.number="formData.val.password" 
                    oninput="value=value.replace(/[^\d]/g,'')"
                    show-password></el-input>
                </el-form-item>
                <el-form-item label="确认新支付密码" prop="password1">
                    <el-input 
                     maxlength="6" 
                    v-model.number="formData.val.password1" 
                    oninput="value=value.replace(/[^\d]/g,'')"
                    show-password
                    ></el-input>
                </el-form-item>
            </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button type="primary" @click="savePre" :loadingBtn="loadingBtn">确 认</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, reactive, ref, watch} from 'vue';
import { ElMessage } from 'element-plus';
import { fetch } from '_@/axios-config/axios';
export default defineComponent({
    setup(props:any,{emit}) {
        const loadingBtn = ref<boolean>(false)
        const formDom:any = ref(null)
        const dialogVisible:any = inject("dialogVisibleForget")
        const pageTitle = inject("pageTitle")
        // const formData:any = inject("formData")
        const formData = reactive({
            val:{}
        }as any)
        const send = ref('发送验证码')
        const validatePass = (rule: any, value: any, callback: any) => {
            if (value === '') {
                callback(new Error('请确认新密码'))
            } else if (value !== formData.val.password) {
                callback(new Error("两次密码不一致"))
            } else {
                callback()
            }
        }
        const rules = reactive({
            code:[{required: true, message: '请输入绑定手机号验证码', trigger: 'blur'}],
            legalPhones:[{required: true, message: '请输入法人手机号', trigger: 'blur'}],
            legalCode:[{required: true, message: '请输入法人手机号验证码', trigger: 'blur'}],
            password:[{ required: true, message: '请输入新密码', trigger: 'blur' },
                    { pattern: /^([1-9]{1})(\d{5})$/, message: '请输入6位数密码', trigger: 'blur' }
                    ],
            password1:[{ validator:validatePass , required: true, trigger: 'blur' }],
        })
        
        const times = ref<number>(60)
        // 获取绑定手机验证码
        const getVerificationCode = async () => {
            await fetch({
                url: '/admin/mfa/smscode/send',
                method: 'post'
            })
            .then((res: any) => {
            if (res.data) {
                formData.val.sessionKey = res.data.sessionKey
                ElMessage.success('短信已发送至绑定手机号，请注意查收')
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
        const timesLegal = ref<number>(60)
        const sendLegal = ref<any>('发送验证码')
        // 获取法人手机验证码
        const getVerificationCodeLegal = async () => {
            let params = {
                phone:formData.val.legalPhones
            }
            await fetch({
                url: '/pay/account/company/sendLegalPhone',
                method: 'post',
                data:params
            })
            .then((res: any) => {
                if (res.data) {
                    formData.val.sessionKeyLegal = res.data.sessionKey
                    ElMessage.success('短信已发送至法人手机号，请注意查收')
                    const timer = setInterval(() => {
                        timesLegal.value--
                        if (timesLegal.value <= 0) {
                            sendLegal.value = '发送验证码'
                            clearInterval(timer)
                            timesLegal.value = 60
                        } else {
                            sendLegal.value = timesLegal.value + '秒后重试'
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

        const savePre = async ()=>{
            let res = await formDom.value.validate().then((valid:any)=>{
                return valid
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                loadingBtn.value = true;
                await fetch({
                    url: '/admin/mfa/verify/sms',
                    method: 'post',
                    data:{
                        code:formData.val.code,
                        sessionKey:formData.val.sessionKey
                    }
                }).then(async (res: any) => {
                    if (res.code == 0) {
                        await fetch({
                            url: '/pay/account/company/resetPassword',
                            method: 'post',
                            headers:{
                                'mfa-verify-ticket':res.data.mfaVerifyTicket
                            },
                            data:{
                                smsCode:formData.val.legalCode,
                                password:formData.val.password,
                                smsSessionKey:formData.val.sessionKeyLegal
                            }
                        }).then((res: any) => {
                            if (res.code == 0) {
                                ElMessage.success('密码设置成功');
                                dialogVisible.value = false;
                            }
                        })
                    }
                }).finally(()=>{
                    loadingBtn.value = false;
                })
            }
        }
        // 获取企业绑定手机号
        const getPhone = async() =>{
            await fetch({
                url: '/admin/mfa/info/get',
                method: 'get',
            }).then((res: any) => {
                if (res.code == 0) {
                    formData.val.phone = res.data.phone
                }
            })
        }
        // 获取法人手机号
        const legalPhone = async() =>{
            await fetch({
                url: '/pay/account/company/getCompanyInfo',
                method: 'get',
            }).then((res: any) => {
                if(res.code == '0'){
                    formData.val.legalPhones = res.data.legalPhone;    //法人电话
                }
            })
        }
        const phone =(tel:any)=>{
            tel = "" + tel;
            return tel.substr(0,3) + "****" + tel.substr(7)
        }
        watch(()=>dialogVisible.value,(newv)=>{
            if(newv){
                if(formDom && formDom.value){
                    formDom.value.resetFields()
                }
                formData.val = {}
                getPhone()
                legalPhone()
            }
        },{deep:true,immediate:true})
        onMounted(() => {

        })
        return {
            dialogVisible,
            loadingBtn,
            formData,
            send,
            sendLegal,
            rules,
            formDom,
            savePre,
            timesLegal,
            times,
            getVerificationCode,
            getVerificationCodeLegal,
            getPhone,
            phone,
            pageTitle
        }
    }
})
</script>

<style scoped lang="less">
.form-margin{
    margin: 5rem 0;
}
.my-phone{
    width: calc(100% - 4rem);
    display: flex;
    justify-content: space-between;
    .phone{
        color: #1A1A1A;
    }
}
:deep(.yzm){
    .el-input{
        .el-input__inner{
            border-right: transparent;
        }
    }
}
</style>
