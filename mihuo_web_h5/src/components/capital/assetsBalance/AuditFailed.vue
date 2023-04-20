<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="pageTitle"
        width="110rem"
    >
        <FormSetMainCapital ref="ruleForm_d" v-if="(status >= 1 && status <3) || status>=5"></FormSetMainCapital>
        <FormUpload ref="ruleForm_u" v-if="status >= 3 && status<5"></FormUpload>
        <template #footer v-if="status<5">
            <span class="dialog-footer" >
                <el-button type="primary" @click="savePre(status == '1'?true:status == '2'?true:status == '3'?false:'')" :loading="loadingBtn">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, provide, ref, watch} from 'vue';
import FormUpload from './FormUpload.vue'
import { fetch } from '_@/axios-config/axios';

export default defineComponent({
    components:{
        FormUpload
    },
    setup(props:any,{emit}) {
        let ruleForm_d:any=ref(null);//绑定子组件ref
        let ruleForm_u:any=ref(null);//绑定子组件ref
        let save:any = inject('save');
        let lookCompanyStatus:any = inject('lookCompanyStatus');
        let loadingBtn:any = inject('loadingBtn');
        let dialogVisible:any = inject('dialogVisibleFaile')
        let pageTitle = inject('pageTitle')
        let formData:any = inject('formData');
        let status:any = inject('status');
        let active = ref<number>(0)
        async function savePre(flag:boolean){
            //验证数据
            if(flag==true){
                let res=await ruleForm_d.value.valid();
                if(res){
                    save()
                }
            }
            if(flag==false){
                let res=await ruleForm_u.value.valid();
                if(res){
                    dialogVisible.value = false;
                    lookCompanyStatus()
                }
            }
        }
        // 获取更改后的企业信息
        const changeCompanyInfo = async() =>{
            await fetch({
                url: '/pay/account/company/getCompanyInfo',
                method: 'get',
            }).then((res: any) => {
                if(res.code == '0'){
                    formData.val.companyName=res.data.companyName?res.data.companyName:formData.val.companyName
                    formData.val.authType=res.data.authType?res.data.authType:formData.val.authType
                    formData.val.taxRegister = res.data.taxRegister;    //税务登记证
                    formData.val.expLicense = res.data.expLicense;    //统一社会信用/ 营业执照号到期时间
                    formData.val.beginEnd = res.data.identityBeginDate && res.data.identityEndDate?[res.data.identityBeginDate,res.data.identityEndDate]:'';    //证件有效日期
                    formData.val.accountNo = res.data.accountNo;    //企业对公账户
                    formData.val.legalPerson = res.data.legalName?res.data.legalName:formData.val.legalPerson;    //法人
                    formData.val.legalPhone = res.data.legalPhone;    //法人电话
                    formData.val.parentBankName = res.data.parentBankName;    //开户银行名称
                    formData.val.bankName = res.data.bankName;    //开户行支行名称
                    formData.val.unionBank = res.data.unionBank;    //支付行号
                    formData.val.uniCredit = res.data.uniCredit;    //统一社会信用代码
                    formData.val.businessLicense = res.data.businessLicense;    //营业执照号
                    formData.val.identityType = res.data.identityType;    //法人证件类型
                    formData.val.organizationCode = res.data.organizationCode;    //组织机构代码
                    formData.val.legalIds = res.data.legalIds;    //法人证件号码
                    formData.val.telephone = res.data.telephone;    //联系电话
                }
            })
        }
        watch(()=>dialogVisible.value,(newv)=>{
            if(newv){
                changeCompanyInfo();
            }
        },{deep:true,immediate:true})
        onMounted(() => {
        })
        return {
            dialogVisible,
            ruleForm_d,
            ruleForm_u,
            loadingBtn,
            pageTitle,
            formData,
            savePre,
            active,
            status,
            changeCompanyInfo
        }
    }
})
</script>

<style scoped lang="less">
.el-steps{
    margin-top: 1.5rem;
}
</style>
