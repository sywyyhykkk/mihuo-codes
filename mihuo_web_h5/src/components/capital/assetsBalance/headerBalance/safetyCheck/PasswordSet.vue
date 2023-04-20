<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="pageTitle"
        width="55rem"
    >
            <el-form 
            ref="formDom"
            class="form_d"
            :model="formData.val" 
            label-width="11rem" 
            style="margin-top:3rem"
            :rules="rules">
                <el-form-item label="电话号码" prop="phone" class="only">
                    <el-input v-model="formData.val.phone" autocomplete="off" disabled>
                        <template #append>
                            <div @click="getVerificationCode" style="padding:0 1.5rem;text-align:center;cursor: pointer;">{{send}}</div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="formData.val.code"></el-input>
                </el-form-item>
            </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button type="primary" @click="savePre" :loading="loadingBtn">确 认</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, reactive, ref} from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetch } from '_@/axios-config/axios';
export default defineComponent({
    setup(props:any,{emit}) {
        const loadingBtn = ref<boolean>(false)
        const formDom:any = ref(null)
        const dialogVisible:any = inject("dialogVisiblePwo")
        const formData:any = inject("formData")
        const pageTitle:any = inject("pageTitle")


        const validatePass = (rule: any, value: any, callback: any) => {
            if (value === '') {
                callback(new Error('请确认新密码'))
            } else if (value !== formData.val.paw) {
                callback(new Error("两次密码不一致"))
            } else {
                callback()
            }
        }
        const rules = reactive({
            sessionKey:[{required: true, message: '请输入短信验证码', trigger: 'blur'}],
            paw:[{required: true, message: '请输入新密码', trigger: 'blur'}],
            paw1:[{validator:validatePass , required: true, trigger: 'blur'}],
        } as any)

        const savePre = async ()=>{
            let res = await formDom.value.validate().then((valid:any)=>{
                return valid
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                await fetch({
                    url: '/admin/mfa/verify/sms',
                    method: 'post',
                    data:formData.val
                }).then(async(res: any) => {
                    if (res.code == 0) {
                        await fetch({
                            url: '/pay/account/company/resetPassword',
                            method: 'post',
                            headers:{
                                'mfa-verify-ticket':res.data.mfaVerifyTicket
                            },
                            data:{
                                password:123456
                            }
                        }).then((res: any) => {
                            if (res.code == 0) {
                                ElMessage.success("重置密码成功,初始密码为:123456");
                                dialogVisible.value = false
                            }
                        })
                    }
                })
            }
        }
        const sessionKey = ref() as any
        const send = ref('发送验证码') as any
        const times = ref<number>(60)
        const getVerificationCode = async() =>{
            await fetch({
                url: '/admin/mfa/smscode/send',
                method: 'post',
            }).then((res: any) => {
                if (res.code == 0) {
                    ElMessage.success('短信已发送，请注意查收')
                    formData.val.sessionKey = res.data.sessionKey
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
                }
            })
        }
        onMounted(() => {

        })
        return {
            dialogVisible,
            loadingBtn,
            formData,
            rules,
            formDom,
            savePre,
            pageTitle,
            getVerificationCode,
            sessionKey,
            send,
            times
        }
    }
})
</script>

<style scoped lang="less">
.my-phone{
    width: calc(100% - 4rem);
    display: flex;
    justify-content: space-between;
    .phone{
        color: #1A1A1A;
    }
}
::v-deep.only{
    .el-input{
        .el-input__inner{
            border: transparent;
            background: #fff;
            color: #303133;
        }
        .el-input-group__append{
            background: #0969DA;
            color: #fff;
            border-radius: .4rem;
        }
    }
}
</style>
