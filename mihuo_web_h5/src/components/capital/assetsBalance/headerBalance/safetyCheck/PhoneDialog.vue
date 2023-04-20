<template>
    <div>
        <!-- 绑定新手机 -->
        <el-dialog
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            v-model="dialogVisible"
            v-if="dialogVisible"
            :title="pageTitle"
            width="57rem"
        >
                <el-form 
                ref="formDome" 
                :model="formData.val" 
                label-width="13rem" 
                :rules="rules">
                    <el-form-item label="法人手机号">
                        <div class="my-phone">
                            <div class="phone">
                                {{phone(formData.val.legalPhones)}}
                            </div>
                            <el-button type="primary" @click="getVerificationCodeLegal">{{sendLegal}}</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="验证码" prop="smsCode">
                        <el-input v-model="formData.val.smsCode"></el-input>
                    </el-form-item>
                    <el-form-item label="绑定手机号" prop="phone">
                        <el-input v-model="formData.val.phone" autocomplete="off" class="no-padding">
                            <template #append>
                                <div  @click="getVerificationCode" style="padding:0 1.2rem;text-align:center;color: #0969DA;cursor: pointer;">{{send}}</div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="verifyCode">
                        <el-input v-model="formData.val.verifyCode"></el-input>
                    </el-form-item>
                    <el-form-item label="支付密码" prop="password">
                        <el-input 
                        v-model.number="formData.val.password" 
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
        <!-- 解绑手机号 -->
        <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisiblePhone"
        v-if="dialogVisiblePhone"
        :title="'解绑校验'"
        width="57rem"
    >
            <el-form 
                ref="formDom" 
                :model="formData.val" 
                label-width="13rem"
                class="form-margin"
                :rules="rules">
                    <el-form-item label="解绑手机号">
                        <div class="my-phone">
                            <div class="phone">
                                {{formData.val.phone}}
                            </div>
                            <el-button type="primary" @click="getVerificationCode">{{send}}</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="验证码" prop="verifyCode">
                        <el-input v-model="formData.val.verifyCode"></el-input>
                    </el-form-item>
                </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button type="primary" @click="savePreUnbound" :loadingBtn="loadingBtn">确 认</el-button>
                <el-button @click="dialogVisiblePhone = false">取 消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang='ts'>
import { ElMessage } from 'element-plus';
import { defineComponent,inject,nextTick,onMounted, reactive, ref, watch} from 'vue';
import { fetch } from '_@/axios-config/axios';

export default defineComponent({
    setup(props:any,{emit}) {
        const formDom:any=ref(null);//绑定子组件ref
        const formDome:any=ref(null);//绑定子组件ref
        const loadingBtn:any = ref<boolean>(false);
        const dialogVisible:any = inject('dialogVisibleAddPhone');
        const dialogVisiblePhone:any = inject('dialogVisiblePhone')
        const pageTitle:any = inject('pageTitle')
        const getPhone:any = inject('getPhone')
        const isBindingPhone:any = inject('isBindingPhone')
        const formData = reactive({
            val:{}
        } as any);
        // 绑定新手机
        async function savePre(){
            let res = await formDome.value.validate().then((valid:any)=>{
                return valid
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                loadingBtn.value = true;
                await fetch({
                    url: '/pay/account/company/bindphone',
                    method: 'post',
                    data:formData.val
                }).then((res: any) => {
                    if(res.code == '0'){
                        ElMessage.success('设置成功');
                        dialogVisible.value = false;
                        getPhone();
                        isBindingPhone()
                    }
                }).finally(()=>{
                    loadingBtn.value = false;
                })
            }
        }
        // 解绑手机
        async function savePreUnbound(){
            let res = await formDom.value.validate().then((valid:any)=>{
                return valid
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                loadingBtn.value = true;
                await fetch({
                    url: '/pay/account/company/unbindphone',
                    method: 'post',
                    data:formData.val
                }).then((res: any) => {
                    if(res.code == '0'){
                        ElMessage.success('解绑手机成功,请绑定新的手机号码');
                        dialogVisiblePhone.value = false;
                        dialogVisible.value = true;
                        pageTitle.value = '更改手机'
                    }
                }).finally(()=>{
                    loadingBtn.value = false;
                })
            }
        }
        const rules = reactive({
            phone:[{ required: true, message: '请输入绑定手机号', trigger: 'blur' }],
            verifyCode:[{ required: true, message: '请输入验证码', trigger: 'blur' }],
            password:[{ required: true, message: '请输入支付密码', trigger: 'blur' }],
            smsCode:[{ required: true, message: '请输入法人验证码', trigger: 'blur' }],
        } as any)
        const times = ref<number>(60)
        const send = ref('发送验证码')
        const timer:any = ref()
        // 获取验证码
        const getVerificationCode = async () => {
            if(!formData.val.phone){
                ElMessage.error("手机号不能为空")
                return false
            }
            if(times.value < 60){
                ElMessage.error("该短信已经在发送中，请不要重复请求")
                return false
            }
            let params = {
                phone:formData.val.phone
            }
            let url:any = dialogVisiblePhone.value?'/pay/account/company/sendverifycode/unbind':'/pay/account/company/sendverifycode/bind'
            await fetch({
                url: url,
                method: 'post',
                data:params
            })
            .then((res: any) => {
            if (res.data) {
                ElMessage.success('短信已发送，请注意查收')
                timer.value = setInterval(() => {
                times.value--
                if (times.value <= 0) {
                    send.value = '发送验证码'
                    clearInterval(timer.value)
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
                    formData.val.smsSessionKey = res.data.sessionKey
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
        // 获取企业绑定手机号
        const getComPhone = async() =>{
            await fetch({
                url: '/admin/mfa/info/get',
                method: 'get',
            }).then((res: any) => {
                if (res.code == 0) {
                    formData.val.phone = res.data.phone
                }
            })
        }
        const phone =(tel:any)=>{
            tel = "" + tel;
            return tel.substr(0,3) + "****" + tel.substr(7)
        }
        watch(()=>dialogVisible,(newVal:any)=>{
            //dialog显示,清除form验证
            if(newVal && newVal.value){
                legalPhone()
                formData.val = {}
                times.value = 60;
                send.value = '发送验证码'
                clearInterval(timer.value)
                nextTick(()=>{
                    formData.val = {}
                    if(formDome && formDome.value){
                        formDome.value.clearValidate();
                    }
                })
            }
        },{immediate:true,deep:true,})
        watch(()=>dialogVisiblePhone,(newVal:any)=>{
            //dialog显示,清除form验证
            if(newVal && newVal.value){
                formData.val = {}
                nextTick(()=>{
                    if(formDom && formDom.value){
                        formDom.value.clearValidate();
                    }
                })
                getComPhone()
            }
        },{immediate:true,deep:true,})
        onMounted(() => {
        })
        return {
            dialogVisible,
            formDom,
            formDome,
            loadingBtn,
            pageTitle,
            formData,
            savePre,
            getVerificationCode,
            times,
            send,
            rules,
            dialogVisiblePhone,
            getComPhone,
            savePreUnbound,
            timer,
            legalPhone,
            phone,
            timesLegal,
            sendLegal,
            getVerificationCodeLegal
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
.my-phone{
    width: calc(100% - 4rem);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .phone{
        color: #1A1A1A;
    }
}
</style>
