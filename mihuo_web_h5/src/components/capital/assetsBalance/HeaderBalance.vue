<template>
    <div class="header">
        <div class="header-item">
            <div class="header-left">
                <div class="preview">
                    账户预览
                    <img @click="preview" :src="imgSrc" alt="" srcset="">
                </div>
                <div class="amount">
                    金额
                </div>
                <div>
                    <span v-if="isShow">{{state.balance}}</span>
                    <span v-else>*********</span>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="recharge">充值</el-button>
                    <el-button @click="withdrawal">提现</el-button>
                </div>
            </div>
            <div class="header-right">
                <div>
                    <img  src="../../../assets/img/company-setting.png" alt="" srcset="">
                    <div class="title">企业信息</div>
                    <div class="tag">
                        <template  v-if="status">
                            <i v-if="Number(status)>=5" @click="auditFailed" style="cursor: pointer;">已完善</i>
                            <template v-else>
                                <span class="tag_1" @click="company" v-if="Number(status)<4">未完善</span>
                                <span class="tag_2" v-if="(1<Number(status) && Number(status)<5 )" @click="companyInfo">审核中</span>
                                <!-- <span class="tag_3" @click="auditFailed">审核失败</span>  -->
                            </template>
                        </template>
                        <span class="check" v-else>检测中...</span>
                    </div>
                </div>
                <div>
                    <img  src="../../../assets/img/sign-setting.png" alt="" srcset="">
                    <div class="title">签约信息</div>
                    <div class="tag">
                        <template  v-if="status">
                            <i v-if="Number(status)==7" style="cursor: pointer;" @click="sign">已签约</i>
                            <span v-else class="tag_1" @click="sign">未签约</span>
                        </template>
                        <span class="check" v-else>检测中...</span>
                    </div>
                </div>
                <div>
                    <img src="../../../assets/img/bank-setting.png" alt="" srcset="">
                    <div class="title">银行卡</div>
                    <div class="tag">
                        <template v-if="isUseEnd">
                            <span  @click="bankCard" v-if="!backTitle" class="tag_1">未绑定</span>
                            <i  @click="bankCard" v-else style="cursor: pointer;">已绑定</i>
                        </template>
                        <span class="check" v-else>检测中...</span>
                    </div>
                </div>
                <div>
                    <img  src="../../../assets/img/safety-setting.png" alt="" srcset="">
                    <div class="title">安全性设置</div>
                    <div class="tag">
                        <template  v-if="status">
                            <i @click="()=> safetyDrawer = true" v-if="Number(status)>5" style="cursor: pointer;">已设置</i>
                            <span @click="safety" class="tag_1" v-else>未设置</span>
                        </template>
                        <span class="check" v-else>检测中...</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 充值 -->
        <recharge-dialog @rechargeSuccess="doSuccess"></recharge-dialog>
        <!-- 提现 -->
        <cash-out @withdrawalSuccess="doSuccess"></cash-out>
        <!-- 公司信息 -->
        <DialogCompany></DialogCompany>
        <!-- 签约 -->
        <!-- <sign-dialog></sign-dialog> -->
        <!-- 未设置安全 -->
        <safety-dialog></safety-dialog>
        <!-- 已设置安全 -->
        <safety-edit-drawer></safety-edit-drawer>
        <!-- 查看企业信息 -->
        <common @auditFailed="auditFailed"></common>
        <!-- 银行卡 -->
        <bank-card-dialog></bank-card-dialog>
        <!-- 审核失败 -->
        <audit-failed></audit-failed>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent,inject,onMounted, provide, reactive, ref, watch} from 'vue';
import RechargeDialog from './RechargeDialog.vue';
import SafetyDialog from './headerBalance/SafetyDialog.vue';
import { formFiled } from './config/FormSet'
import AuditFailed from './AuditFailed.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import Common from './headerBalance/comanpyInfo/Common.vue';
import BankCardDialog from './headerBalance/BankCardDialog.vue';
import SafetyEditDrawer from './headerBalance/SafetyEditDrawer.vue';
import CashOut from './CashOut.vue';
import { fetch } from '_@/axios-config/axios';
import { useStore } from 'vuex'

export default defineComponent({
    components: { RechargeDialog, SafetyDialog , Common, BankCardDialog, SafetyEditDrawer, AuditFailed, CashOut},
    setup(props:any,{emit}) {
        const imgSrc:any = ref(require('@/assets/img/close.png'))
        const isShow = ref<boolean>(false)
        const dialogVisibleWD = ref<boolean>(false)
        const dialogVisibleRD = ref<boolean>(false)
        const dialogVisibleSign = ref<boolean>(false)
        const dialogVisibleSafety = ref<boolean>(false)
        const backTitle = ref<boolean>(false)
        provide('dialogVisibleWD',dialogVisibleWD)
        provide('dialogVisibleRD',dialogVisibleRD)
        provide('dialogVisibleSign',dialogVisibleSign)
        provide('dialogVisibleSafety',dialogVisibleSafety)
        provide('backTitle',backTitle)

        //form设定
        let {formSetting,formRules}= formFiled;
        let loadingBtn = ref<boolean>(false)
        provide('formSetting',formSetting);
        provide('formRules',formRules);
        provide('loadingBtn',loadingBtn);
        let enumObj={
            authType:[
                { text:"三证" ,id:'1'},
                { text:"一证" ,id:'2'},
            ],
            cardType:[],
            bankType:[]
        } as any;
        provide('enumObj',enumObj);
        const active = ref<number>(0)
        provide('active',active)
        //弹出框
        let dialogVisible=ref(false);
        let pageTitle=ref('');
        provide('pageTitle', pageTitle)
        provide('dialogVisible', dialogVisible)
        const formData = reactive({
            val:{}
        } as any)
        provide('formData',formData)

        const formDataWD = reactive({} as any)
        provide('formDataWD',formDataWD)
        const store = useStore()
        const registerCark = computed(()=>{
            return store.state.registerAct
        })
        store.commit('registerAccount', false)
        const state = reactive({
            balance:0,
            status:''
        } as any)
        const getListDataL:any = inject('getListDataL')
        const times = ref(10) as any
        const preview = () =>{
            isShow.value = !isShow.value
            if(isShow.value){
                imgSrc.value = require('@/assets/img/open.png')
                queryBalance()
            }else{
                imgSrc.value = require('@/assets/img/close.png')
            }
        }
        // 提现
        const withdrawal = () =>{
            if(Number(status.value) == 0){
                ElMessage.warning("请先开通企业支付账户")
                return false
            }
            if(Number(status.value)<5){
                notification()
                return false
            }
            if(Number(status.value)<=6){
                lookCompanyStatus()
                return false
            }
            dialogVisibleWD.value = true;
        }
        // 充值,提现成功回调
        const doSuccess = () =>{
            queryBalance();
            getListDataL()
        }
        // 获取银行卡
        const isUseEnd = ref<boolean>(false)
        const getBankCards = async () =>{
            await fetch({
                url: '/pay/account/company/getBankCards',
                method: 'get',
                showErrorMessage:false
            }).then((res: any) => {
                if(res.code == '0'){
                    if(res.data.length>0){
                        backTitle.value = true;
                    };
                }
            }).finally(()=>{
                isUseEnd.value = true
            })
        }
        // 公司信息
        const company = (flag:boolean) =>{
            if(Number(status.value) == 0){
                ElMessage.warning("请先开通企业支付账户")
                return false
            }
            if(Number(status.value == 1)){
                if(flag == true){
                    pageTitle.value = "修改企业信息";
                }else{
                    pageTitle.value = "完善企业信息";
                }
                dialogVisible.value = true;
            }else{
                auditFailed()
            }
        }
        // 签约
        const windows = window as any
        const sign = async() =>{
            if(Number(status.value) == 0){
                ElMessage.warning("请先开通企业支付账户")
                return false
            }
            if(Number(status.value)<5){
                notification()
                return false
            }
            let hostUrl = window.location.host;//获取URL 的 hostname 和 端口
            let protocol = window.location.protocol;//设置或获取 URL 的协议部分
            let url = protocol + "//" + hostUrl
            let params = {
                jumpUrl: url + '/#/capital/assetsBalance',
                noContractUrl: url + '/#/capital/assetsBalance'
            }
            await fetch({
                url: '/pay/account/company/signContract',
                method: 'post',
                data: params
            }).then((res: any) => {
                if(res.code == '0'){
                    windows.open(res.data.url,'_self')
                }
            })
        }
        // 充值
        const recharge = () =>{
            if(Number(status.value) == 0){
                ElMessage.warning("请先开通企业支付账户")
                return false
            }
            if(Number(status.value)<5){
                notification()
                return false
            }
            if(Number(status.value)<=6){
                lookCompanyStatus()
                return false
            }
            dialogVisibleRD.value = true
        }
        // 安全性设置
        const safety = () =>{
            if(Number(status.value) == 0){
                ElMessage.warning("请先开通企业支付账户")
                return false
            }
            if(Number(status.value)<5){
                notification()
                return false
            }
            pageTitle.value = "安全性设置";
            dialogVisibleSafety.value = true;
        }
        const safetyDrawer = ref<boolean>(false)
        provide("safetyDrawer",safetyDrawer)
        const safetyEdit = () =>{

        }
        // 查看企业信息
        const drawer = ref<boolean>(false)
        const titlePage = ref('')
        const formDataEnter = reactive({
            val:{}
        }as any)
        provide("drawer",drawer)
        provide("titlePage",titlePage)
        provide("formDataEnter",formDataEnter)
        const companyInfo = () =>{
            drawer.value = true;
            titlePage.value = "企业信息";
            // formDataEnter.val = Object.assign({},formData.val)
        }
        // 银行卡
        const bankDrawer = ref<boolean>(false)
        provide('bankDrawer',bankDrawer)
        const bankCard = () =>{
            if(Number(status.value) == 0){
                ElMessage.warning("请先开通企业支付账户")
                return false
            }
            if(Number(status.value)<5){
                notification()
                return false
            }
            bankDrawer.value = true;
        }
        const notification = () =>{
            ElMessageBox.confirm(
                '请先完善企业信息',
                '提示',
                {
                confirmButtonText: '去完善',
                cancelButtonText: '取消',
                type: 'warning',
                }
            )
            .then(() => {
                company(false)
            })
        }
        // 查看企业目前状态
        const lookCompanyStatus = async () =>{
            await fetch({
                url: '/pay/account/company/status',
                method: 'get',
            }).then((res: any) => {
                if(res.code == '0'){
                    let keys:any = Object.keys(res.data);
                    status.value = keys;
                    let values:any = Object.values(res.data);
                    if(Number(status.value)<7 && Number(status.value)>0){
                        ElMessage.warning(values.join(','))
                    }
                    if(Number(status.value)>6){
                        store.commit('ispPerfect', true)
                    }
                    store.commit('registerAct', false)
                }
            })
        }
        provide('lookCompanyStatus',lookCompanyStatus)
        // 保存企业信息
        const save = async() =>{
            loadingBtn.value = true;
            formData.val.companyAddress = formData.val.completeAddress;    //地址
            formData.val.legalName = formData.val.legalPerson
            await fetch({
                url: '/pay/account/company/setinfo',
                method: 'post',
                data:formData.val
            }).then((res: any) => {
                if(res.code == '0'){
                    ElMessage.success('保存成功');
                    active.value = 1;
                    dialogVisible.value = true;
                    formDataEnter.val = Object.assign({},formData.val)
                    lookCompanyStatus()
                }
            }).finally(()=>{
                loadingBtn.value = false;
            })
        }
        provide('save',save)
        // 查询账户余额
        const queryBalance = async() =>{
            await fetch({
                url: '/pay/account/company/queryBalance',
                method: 'get',
                showErrorMessage:false
            }).then((res: any) => {
                if(res.code == '0'){
                    state.balance = res.data
                }
            })
        }
        const getCompanyInfo = async() =>{
            await fetch({
                url: '/admin/company/infos/basic',
                method: 'get',
            }).then((res: any) => {
                if(res.code == '0'){
                    formData.val = res.data;
                    formData.val.provinceCode = Number(formData.val.provinceCode)
                    formData.val.cityCode = Number(formData.val.cityCode)
                    formData.val.areaCode = Number(formData.val.areaCode)
                    formData.val.provinceCode_ = formData.val.provinceCode
                    formData.val.cityCode_ = formData.val.cityCode
                    formData.val.areaCode_ = formData.val.areaCode
                    formData.val.authType = formData.val.authType?formData.val.authType:'1';
                    formData.val.identityType = formData.val.identityType?formData.val.identityType:'1';
                    changeCompanyInfo()
                }
            })
        }
        // 获取更改后的企业信息
        const changeCompanyInfo = async() =>{
            await fetch({
                url: '/pay/account/company/getCompanyInfo',
                method: 'get',
            }).then((res: any) => {
                if(res.code == '0'){
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
                    formData.val.telephone = res.data.telephone;    //联系电话
                    formDataEnter.val = Object.assign({},formData.val)
                }
            })
        }
        // 审核失败
        const dialogVisibleFaile = ref<boolean>(false)
        provide('dialogVisibleFaile',dialogVisibleFaile)
        const status = ref(null) as any
        provide('status',status)
        const auditFailed = () =>{
            if(status.value==1){
                pageTitle.value = "完善企业信息"
            }else if(status.value < 5){
                pageTitle.value = "上传证件照"
            }else if (status.value>=5){
                pageTitle.value = "企业信息"
            }
            dialogVisibleFaile.value = true;
        }
        // 获取上传图片
        const getUploadImg = async () =>{
            //营业执照
            let res = await fetch({url:`/pay/account/company/images/1`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.certificateImge = res.data || ''
            })
            //证件正面
            let res1:any =await fetch({url:`/pay/account/company/images/8`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.legalIdcardFront = res.data || ''
            })
            //证件反面
            let res2:any =await fetch({url:`/pay/account/company/images/9`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.legalIdcardBack = res.data || ''
            })
            //组织机构代码证
            let res3:any =await fetch({url:`/pay/account/company/images/2`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.organizationImg = res.data || ''
            })
            //税务登记证
            let res4:any =await fetch({url:`/pay/account/company/images/3`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.taxRegisterImg = res.data || ''
            })
            //统一社会信用代码证
            let res5:any =await fetch({url:`/pay/account/company/images/5`,method:"get",showErrorMessage:false})
            .then((res:any)=>{
                formData.val.uniCreditImg = res.data || ''
            })
        }
        onMounted(async() => {
            // await queryBalance();
            // 获取证件类型
            let res = await fetch({url: '/pay/common/IdentityType',method: 'get',})
            if(res.data){
                for (let key in res.data) {
                    let obj = {} as any
                    obj.text =  res.data[key];
                    obj.id =  key;
                    enumObj.cardType.push(obj)
                }
            }
            // 获取银行类型
            let res1 = await fetch({url: '/pay/common/CompanyBank/parentName',method: 'get',})
            if(res1.data){
                for (let key in res1.data) {
                    let obj = {} as any
                    obj.text =  res1.data[key];
                    obj.id =  key;
                    enumObj.bankType.push(obj)
                }
            }
            lookCompanyStatus();
            getBankCards();
            getCompanyInfo();
            getUploadImg();
        })
        watch(()=>registerCark.value,(newv:any)=>{
            if(newv){
                lookCompanyStatus()
            }
        },{deep:true,immediate:true})
        return {
            dialogVisibleFaile,
            auditFailed,
            imgSrc,
            isShow,
            preview,
            withdrawal,
            formDataWD,
            dialogVisibleSign,
            dialogVisibleSafety,
            formData,
            company,
            sign,
            recharge,
            times,
            safety,
            dialogVisibleRD,
            notification,
            companyInfo,
            drawer,
            titlePage,
            bankCard,
            bankDrawer,
            safetyDrawer,
            safetyEdit,
            lookCompanyStatus,
            save,
            state,
            status,
            active,
            backTitle,
            registerCark,
            doSuccess,
            formDataEnter,
            changeCompanyInfo,
            isUseEnd
        }
    }
})
</script>

<style scoped lang="less">
.header{
    height: 100%;
    padding: 4rem 4rem 0;
    box-sizing: border-box;
    .header-item{
        height: 100%;
        display: flex;
        justify-content: space-between;
    }
    .header-left{
        color: #303133;
        &>div{
            margin-bottom: 4.5rem;
            &:first-child{
                display: flex;
                align-items: center;
                font-size: 1.8rem;
                img{
                    padding-left: 1rem;
                    width: 2rem;
                    height: 2rem;
                    cursor: pointer;
                }
            }
            &:nth-child(2){
                color: #909399;
                font-size: 1.4rem;
                margin-bottom: 1rem;
            }
            &:nth-child(3){
                font-weight: bold;
                font-size: 2.6rem;
                margin-bottom: 4rem;
            }
        }
    }
    .header-right{
        display: flex;
        justify-content: space-between;
        margin-top: 5rem;
        &>div{
            margin: 0 3rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            img{
                height: 6rem;
                width: 6rem;
            }
            .title{
                display: inline-block;
                font-size: 1.2rem;
                color: #4D4D4D;
                padding-bottom: 1.4rem;
            }
            .tag{
                display: flex;
                flex-direction: column;
                align-items: center;
                i{
                    font-size: 1.2rem;
                    margin-bottom: .5rem;
                    border-radius: 1.3rem;
                    padding: .8rem;
                    background: rgb(240, 249, 235);
                    color: #67C23A;
                    font-style:normal
                }
                span{
                    font-size: 1.2rem;
                    margin-bottom: .5rem;
                    border-radius: 1.3rem;
                    padding: .8rem;
                    cursor: pointer;
                    &.check{
                        background: #EBEEF5;
                        color: #A8ABB2;
                        cursor: not-allowed;
                    }
                    &.tag_1{
                        background: #FEF0F0;
                        color: #F56C6C;
                    }
                    &.tag_2{
                        background: #FDF6EC;
                        color: #F2AA3D;
                    }
                    &.tag_3{
                        background: #FEF0F0;
                        color: #F56C6C;
                    }
                }
            }
        }
    }
}
</style>
