<template>
    <div>
        <el-dialog
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            v-model="dialogVisible"
            title="提现"
            width="40rem"
        >
            <el-form 
            ref="formDom" 
            :model="formData"
            class="form_flex"
            label-width="3rem"
            :rules="rules"
            >
                <div class="title">提现金额</div>
                <el-form-item prop="cashType">
                    <span style="margin-right:1rem;font-size:1.5rem">提现方式</span>
                    <el-radio-group v-model="formData.cashType">
                        <el-radio :label="2">企业对公账户</el-radio>
                        <el-radio :label="1">个人银行卡</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="amount">
                    <el-input 
                    class="only"
                    v-model="formData.amount"
                    type="number"
                    min="0"
                    >
                        <template #prefix>
                            <img
                                style="width:2.5rem;height:2rem;padding-left:4rem"
                                src="@/assets/img/amount.png"
                                alt="" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>账户余额</span>
                    <div style="margin-left: 1rem;color:#0969DA;font-size:1.5rem">{{formData.moeny || 0.00}}</div>
                </el-form-item>
                <el-form-item prop="bankCardId">
                    <el-select v-model="formData.bankCardId" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" v-if="formData.cashType == 1" @click="sign">签订协议</el-button>
                    <el-button type="primary" @click="savePre">确认提现</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 安全校验 -->
        <!-- 支付密码 -->
        <paymentCode 
        v-model="showDialogPwa"
        v-if="showDialogPwa"
        :title="'安全性检测'"
        @forgetPwd="()=>dialogVisibleForget=true"
        @getHandelData="handelConfirmPay">
        </paymentCode>
        <!-- 忘记密码 -->
        <forget-password></forget-password>
        <!-- 协议签订校验 -->
    </div>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, provide, reactive, ref, watch, watchEffect} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetch } from '_@/axios-config/axios'
export default defineComponent({
    setup(props,{emit}) {
        const dialogVisible:any = inject('dialogVisibleWD')
        const showDialogPwa = ref<boolean>(false)
        const dialogVisibleForget = ref<boolean>(false)
        provide('dialogVisibleForget',dialogVisibleForget)
        const formData = reactive({
            amount:null,
            moeny:0,
            bankCardId:'',
            cashType:2
        }as any)
        const formDom:any = ref(null)
        const loadingBtn = ref<boolean>(false)
        const options:any = ref([])
        const rules = reactive({
            amount:[{required: true, message: '请输入提现金额', trigger: 'blur'}],
            bankCardId:[{required: true, message: '请选择提现银行卡', trigger: 'blur'}],
            cashType:[{required: true, message: '请选择提现方式', trigger: 'blur'}]
        } as any)
        const savePre = async () =>{
            let res = await formDom.value.validate().then((valid:any)=>{
                return valid
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                if(Number(formData.amount)>Number(formData.moeny)){
                    return ElMessage.warning("提现金额大于账户余额，请重新输入")
                }
                if(Number(formData.amount)<=0){
                    return ElMessage.warning("提现金额无效，请重新输入")
                }
                showDialogPwa.value = true
            }
        }
        const handelConfirmPay = async (data:any,ticket:any)=>{
            if(ticket && ticket.mfaVerifyTicket){
                await fetch({
                    url: '/pay/account/company/applyWithdraw',
                    method: 'post',
                    headers:{
                        'mfa-verify-ticket':ticket.mfaVerifyTicket
                    },
                    data:formData
                }).then((res: any) => {
                    if (res.code == 0) {
                        ElMessage.success('提现成功');
                        dialogVisible.value = false;
                        showDialogPwa.value = false;
                        // 提现成功
                        emit('withdrawalSuccess ',true)
                    }
                })
            }
        }
        // 获取银行卡
        const getBankCards = async (type:number) =>{
            await fetch({
                url: '/pay/account/company/getBankCards',
                method: 'get',
                showErrorMessage:false
            }).then((res: any) => {
                if(res.code == '0'){
                    let backData = res.data;
                    if(backData.length){
                        backData.map((item:any)=>{
                            item.name = item.name +'('+item.cardNo.substring(item.cardNo.length-4,item.cardNo.length)+')'
                        })
                    }
                    options.value = []
                    backData.map((val:any)=> {
                        if(val.cardProperty == type){
                            options.value.push(val)
                        }
                    })
                }
            })
        }
        // 查询余额
        const queryBalance = async () =>{
            await fetch({
                url: '/pay/account/company/queryBalance',
                method: 'get',
            }).then((res: any) => {
                if(res.code == '0'){
                    formData.moeny = res.data;
                }
            })
        }
        // 签订协议
        let windows = window as any
        const sign = async() =>{
            let hostUrl = window.location.host;//获取URL 的 hostname 和 端口
            let protocol = window.location.protocol;//设置或获取 URL 的协议部分
            let url = protocol + "//" + hostUrl 
            let params = {
                jumpUrl: url + '/#/capital/assetsBalance',
                noContractUrl: url + '/#/capital/assetsBalance'
            }
            await fetch({
                url: '/pay/account/company/signPersonContract',
                method: 'post',
                data: params
            }).then((res: any) => {
                if(res.code == '0'){
                    windows.open(res.data.url)
                }
            })
        }
        watch(()=>dialogVisible,(newv:any)=>{
            if(newv.value){
                if(formDom && formDom.value){
                    formDom.value.resetFields()
                }
                queryBalance()
            }
        },{deep:true,immediate:true})
        watch(()=>formData.bankCardId,(newv:any)=>{
            if(newv){
                if(formDom && formDom.value){
                    formDom.value.clearValidate(['bankCardId']);
                }
            }
        },{deep:true,immediate:true})
        watch(()=>[formData.cashType,dialogVisible.value],(newv:any)=>{
            if(newv[0] && newv[1]){
                formData.bankCardId = ''
                getBankCards(newv[0]-1)
            }
        },{deep:true,immediate:true})
        onMounted(() => {
        })
        return {
            dialogVisible,
            formData,
            options,
            formDom,
            rules,
            savePre,
            showDialogPwa,
            handelConfirmPay,
            dialogVisibleForget,
            sign
        }
    }
})
</script>

<style scoped lang="less">
.form_flex{
    .title{
        display: flex;
        justify-content: center;
        align-items: center;
        color: #303133;
        font-size: 2.2rem;
        margin: 2rem 0;
    }
    ::v-deep .el-form-item{
        margin: 1rem 0 !important;
        .el-input{
            width: calc(100% - 4rem);
        }
        .el-select{
            width: 100%;
        }
        .el-form-item__content{
            width: 100%;
        }
        &:last-child{
            margin-bottom: 2.5rem !important;
        }
        &:nth-child(2){
            span{
                color: #606266;
            }
        }
    }
}
/deep/.only {
    .el-input__inner{
        height: 8rem !important;
        line-height: 8rem !important;
        border: none;
        background: #F3F4F8;
        text-align: center;
        color: #303133;
        font-size: 2rem;
        padding-left: 9rem;
        position: relative;
        &:focus{
            border-color:transparent !important
        }
        &:active{
            border: none !important;
        }
    }
}
/deep/.el-input__prefix-inner {
        display: flex;
        justify-content: center;
        align-items: center;
    }
.pay-title-tip{
    color: #303133;
    font-size: 2.4rem;
    text-align: center;
    margin-top: 2rem;
}
</style>
