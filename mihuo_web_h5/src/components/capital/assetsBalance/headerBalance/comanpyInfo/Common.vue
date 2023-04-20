<template>
    <el-drawer
        v-model="drawer"
        :title="titlePage"
        :direction="'rtl'"
        v-if="drawer"
        size="35%"
    >
    <div class="container">
        <div class="hearder">
            <span><el-icon><warning-filled /></el-icon>审核中</span>
            <el-button :icon="EditPen" type="primary" @click="edit">修改</el-button>
        </div>
        <div class="main">
            <List></List>
        </div>
    </div>
  </el-drawer>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, provide, ref, watch} from 'vue';
import { EditPen } from '@element-plus/icons-vue';
import { fetch } from '_@/axios-config/axios';
import List from './List.vue'

export default defineComponent({
    components:{
        List
    },
    setup(props:any,{emit}) {
        const titlePage = inject('titlePage')
        const drawer:any = inject('drawer')
        const formDemo:any = ref(null)
        const formData:any = inject('formDataEnter')
        const enumObj:any=inject('enumObj');
        const dialogVisibleWD = ref<boolean>(false)
        const dialogVisible:any = inject('dialogVisible')
        const pageTitle:any = inject('pageTitle')
        provide("dialogVisibleWD",dialogVisibleWD)
        const edit = () =>{
            // pageTitle.value = '修改企业信息';
            // dialogVisible.value = true
            emit('auditFailed',true)
        }
        const addressDetail = async () =>{
            let params = {
                provinceCode:formData.val.provinceCode,
                cityCode:formData.val.cityCode,
                areaCode:formData.val.areaCode,
            }
            let res:any = await fetch({url:'/basic/region/names',method: 'post',data:params,showErrorMessage:false})
            if(res.code == '0'){
                formData.val.address = res.data.provinceCode + res.data.cityCode + res.data.areaCode + formData.val.completeAddress
            }
        }
        // 获取更改后的企业信息
        const changeCompanyInfo = async() =>{
            await fetch({
                url: '/pay/account/company/getCompanyInfo',
                method: 'get',
            }).then((res: any) => {
                if(res.code == '0'){
                    formData.val.authType = res.data.authType;  //认证类型
                    formData.val.taxRegister = res.data.taxRegister;    //税务登记证
                    formData.val.expLicense = res.data.expLicense;    //统一社会信用/ 营业执照号到期时间
                    formData.val.beginEnd = res.data.identityBeginDate && res.data.identityEndDate?res.data.identityBeginDate + '--' + res.data.identityEndDate:'';    //证件有效日期
                    formData.val.accountNo = res.data.accountNo;    //企业对公账户
                    formData.val.legalPerson = res.data.legalName;    //法人
                    formData.val.legalPhone = res.data.legalPhone;    //法人电话
                    formData.val.parentBankName = res.data.parentBankName;    //开户银行名称
                    formData.val.bankName = res.data.bankName;    //开户行支行名称
                    formData.val.unionBank = res.data.unionBank;    //支付行号
                    formData.val.telephone = res.data.telephone;    //支付行号
                }
            })
        }
        const getUploadImg = async () =>{
            //营业执照
            let res = fetch({url:`/pay/account/company/images/1`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.certificateImge = res.data || ''
            })
            //证件正面
            let res1:any = fetch({url:`/pay/account/company/images/8`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.legalIdcardFront = res.data || ''
            })
            //证件反面
            let res2:any = fetch({url:`/pay/account/company/images/9`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.legalIdcardBack = res.data || ''
            })
            //组织机构代码证
            let res3:any = fetch({url:`/pay/account/company/images/2`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.organizationImg = res.data || ''
            })
            //税务登记证
            let res4:any = fetch({url:`/pay/account/company/images/3`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.taxRegisterImg = res.data || ''
            })
            //统一社会信用代码证
            let res5:any = fetch({url:`/pay/account/company/images/5`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.uniCreditImg = res.data || ''
            })
        }
        onMounted(() => {
            
        })
        watch(()=>drawer.value,(newv)=>{
            if(newv){
                addressDetail();
                changeCompanyInfo();
                getUploadImg()
            }
        })
        return {
            titlePage,
            drawer,
            EditPen,
            formDemo,
            formData,
            dialogVisibleWD,
            edit,
            addressDetail,
            enumObj,
            changeCompanyInfo
        }
    }
})
</script>

<style scoped lang="less">
.el-drawer{
    .el-drawer__body{
        .container{
            height: 100%;
            box-sizing: border-box;
            .hearder{
                padding: 2rem 4rem 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span{
                    color: #F2AA3D;
                    display: flex;
                    align-items: center;
                    .el-icon{
                        padding-right: .5rem;
                    }
                }
            }
            .main{
                height: calc(100% - 7rem);
                overflow: auto;
                .el-form{
                    padding:0 4rem;
                    /deep/.el-form-item{
                        margin: 1rem 0;
                        .el-form-item__label{
                            color: #909399;
                        }
                        .el-form-item__content{
                            justify-content: end;
                        }
                        .el-input{
                             .el-input__inner{
                                 border: transparent;
                                 padding: 0;
                                 background: none;
                                 color: #1A1A1A;
                                 cursor: default;
                                 text-align: right;
                             }
                             
                        }
                    }
                }
            }
        }
    }
}
</style>
