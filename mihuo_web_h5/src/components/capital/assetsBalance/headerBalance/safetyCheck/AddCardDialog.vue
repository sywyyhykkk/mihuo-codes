<template>
    <div>
        <el-dialog
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            v-model="dialogVisible"
            v-if="dialogVisible"
            :title="'添加银行卡'"
            width="64rem"
        >
                <el-form 
                    ref="formDom"
                    :model="formData.val" 
                    label-width="20rem" 
                    :rules="rules">
                        <el-form-item label="银行卡账户类型" prop="bankAccount">
                            <el-radio-group v-model="formData.val.bankAccount">
                                <el-radio :label="1">企业对公账户</el-radio>
                                <el-radio :label="2">法人个人银行卡</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <template v-if="formData.val.bankAccount==2">
                            <!-- <el-form-item label="支付行号(联行号)" prop="unionBank">
                                <el-input v-model="formData.val.unionBank"></el-input>
                            </el-form-item> -->
                            <el-form-item label="银行卡号" prop="cardNo">
                                <el-input v-model.number="formData.val.cardNo" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            </el-form-item>
                            <el-form-item label="预留手机号" prop="phone">
                                <el-input v-model.number="formData.val.phone" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            </el-form-item>
                        </template>
                        <template v-else>
                            <el-form-item label="开户银行名称" prop="parentBankName">
                                <el-select v-model="formData.val.parentBankName" filterable placeholder="请选择">
                                    <el-option
                                        v-for="(item,index) in enumObj.cardType"
                                        :key="index"
                                        :label="item.text"
                                        :value="item.text">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="开户银行支行名称" prop="bankName">
                                <sub-branch @nodeClick="selectChange" @visible="visibleStatus"  v-model="formData.val.bankName">
                                    <template #header>
                                        <div>
                                            <el-input
                                            placeholder="请选择"
                                            v-model="formData.val.bankName"
                                            readonly
                                            :suffix-icon="suffixIcon"
                                            ></el-input>
                                        </div>
                                    </template>
                                </sub-branch>
                            </el-form-item>
                            <el-form-item label="支付行号(联行号)" prop="unionBank">
                                <el-input readonly v-model="formData.val.unionBank"></el-input>
                            </el-form-item>
                            <el-form-item label="企业对公账户(银行卡号)" prop="accountNo">
                                <el-input 
                                v-model.number="formData.val.accountNo"
                                oninput="value=value.replace(/[^\d]/g,'')"
                                ></el-input>
                            </el-form-item>
                            <!-- <el-form-item label=" 开户行所在省份" prop="province">
                                <el-input v-model="formData.val.province"></el-input>
                            </el-form-item>
                            <el-form-item label="开户行所在市" prop="city">
                                <el-input v-model="formData.val.city"></el-input>
                            </el-form-item> -->
                        </template>
                </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button type="primary" @click="savePre">确 认</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </template>
        </el-dialog>
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
    </div>
</template>

<script lang='ts'>
import { Options } from '@antv/x6/lib/graph/options';
import { ElMessage } from 'element-plus';
import { defineComponent,inject,onMounted, provide, reactive, ref, watch} from 'vue';
import { fetch } from '_@/axios-config/axios';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
export default defineComponent({
    setup(props:any,{emit}) {
        const dialogVisible:any = inject('dialogVisibleCard');
        const getBankCards:any = inject('getBankCards');
        const showDialogPwa = ref<boolean>(false);
        const dialogVisibleForget = ref<boolean>(false);
        provide('dialogVisibleForget',dialogVisibleForget)
        const formDom:any = ref(null)
        const formData:any = reactive({
            val:{
                bankAccount:1,
            }
        }as any)
        provide('formData',formData)
        const suffixIcon = ref(ArrowDown)
        
        const enumObj=reactive({
            cardType:[],
        } as any);
        const rules = reactive({
            parentBankName:[{required: true, message: '请选择开户银行名称', trigger: 'blur'}],
            bankName:[{required: true, message: '请输入开户银行支行名称', trigger: 'blur'}],
            province:[{required: true, message: '请输入开户行所在省份', trigger: 'blur'}],
            city:[{required: true, message: '请输入开户行所在市', trigger: 'blur'}],
            unionBank:[
                {required: true, message: '请输入支付行号', trigger: 'blur'},
            ],
            accountNo:[
                {required: true, message: '请输入企业对公账户', trigger: 'blur'},
                {pattern: /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/, message: '请输入正确的企业对公账户(银行卡号)', trigger: 'blur'},
            ],
            cardNo:[
                {required: true, message: '请输入银行卡号', trigger: 'blur'},
                {pattern: /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/, message: '请输入正确的银行卡号', trigger: 'blur'},
            ],
            bankAccount:[{required: true, message: '请选择银行卡账户类型', trigger: 'blur'}],
        })
        // 获取对公账户支持的银行列表
        const addCardType = async() =>{
            await fetch({
                url: '/pay/common/CompanyBank/parentName',
                method: 'get',
            }).then((res: any) => {
                if (res.code == 0) {
                    for (let key in res.data) {
                        let obj = {} as any
                        obj.text =  res.data[key];
                        obj.id =  key;
                        enumObj.cardType.push(obj)
                    }
                }
            })
        }
        const savePre = async () =>{
            let res = await formDom.value.validate().then((valid:any)=>{
                return valid
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                showDialogPwa.value = true
            }
        }
        const handelConfirmPay = async (data:any,ticket:any)=>{
            if(ticket && ticket.mfaVerifyTicket){
                if(formData.val.bankAccount==1){
                    await fetch({
                        url: '/pay/account/company/bindCompanyBank',
                        method: 'post',
                        headers:{
                            'mfa-verify-ticket':ticket.mfaVerifyTicket
                        },
                        data:formData.val
                    }).then((res: any) => {
                        if(res.code == '0'){
                            ElMessage.success('添加成功');
                            getBankCards()
                            showDialogPwa.value = false;
                            dialogVisible.value = false;
                        }
                    })
                }else{
                    await fetch({
                        url: '/pay/account/company/bindBankCard',
                        method: 'post',
                        headers:{
                            'mfa-verify-ticket':ticket.mfaVerifyTicket
                        },
                        data:{
                            cardNo:formData.val.cardNo,
                            phone:formData.val.phone,
                            unionBank:formData.val.unionBank
                        }
                    }).then((res: any) => {
                        if(res.code == '0'){
                            ElMessage.success('添加成功');
                            getBankCards()
                            showDialogPwa.value = false;
                            dialogVisible.value = false;
                        }
                    })
                }
            }
        }

        // 获取银行支行好
        const selectChange =(data:any)=>{
            formData.val.unionBank = data.unionBank
        }
        const visibleStatus = (flag:boolean) =>{
            if(flag){
                suffixIcon.value = ArrowUp
            }else{
                suffixIcon.value = ArrowDown
            }
        }
        watch(()=>dialogVisible.value,(newv)=>{
            if(newv){
                formData.val ={
                    bankAccount:1,
                }
                // addCardType();
                if(formDom && formDom.value){
                    formDom.value.resetFields()
                }
            }
        },{deep:true,immediate:true})
        watch(()=>formData.val,(newv)=>{
            if(newv.bankName){
                if(formDom && formDom.value){
                    formDom.value.clearValidate(['bankName'])
                }
            }
        },{deep:true,immediate:true})
        onMounted(() => {
            addCardType()
        })
        return {
            formDom,
            formData,
            showDialogPwa,
            rules,
            enumObj,
            dialogVisible,
            addCardType,
            savePre,
            handelConfirmPay,
            dialogVisibleForget,
            selectChange,
            suffixIcon
        }
    }
})
</script>

<style scoped lang="scss">

</style>
