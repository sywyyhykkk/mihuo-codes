<template>
    <div>
        <el-drawer
            v-model="drawer"
            v-if="drawer"
            :title="'安全性设置'"
            :direction="'rtl'"
            size="60rem"
            :before-close="closeDrawer"
            >
            <div class="container">
                <!-- <span @click="()=> dialogVisibleSV = true">忘记密码</span> -->
                <div class="hearder">
                    <div>
                        <span><el-icon><cellphone /></el-icon>绑定手机</span>
                        <span>{{formData.val.phone}}</span>
                        <!-- <span @click="()=> showDialogPwa = true">更改手机</span> -->
                        <span @click="changePhone">{{phoneTitle}}</span>
                    </div>
                    <div>
                        <span><el-icon><scale-to-original /></el-icon>支付密码</span>
                        <span>已设置</span>
                        <span @click="resetPwd">重置密码</span>
                    </div>
                    <div>
                        <div>
                            <div>金额预警</div>
                            <div>设置不同订单类型/岗位的结算金额，超出则会预警！</div>
                        </div>
                        <el-switch v-model="switchOpen" :active-value="1" :inactive-value="0" @change="switchChange"/>
                    </div>
                    
                </div>
                <div class="main" v-if="switchOpen==1">
                    <div class="btn">
                        <span v-if="!isEdit" @click="()=>isEdit=true"><el-icon><edit-pen /></el-icon>修改</span>
                        <el-button v-else type="primary" @click="save">保存</el-button>
                    </div>
                    <div class="table">
                        <el-table
                            ref="factory_table"
                            v-loading="loading"
                            stripe
                            :data="tableData"
                            border
                            style="width:100%;height: calc(100vh - 37rem)!important;"
                            height="0"
                            class="el-table-only"
                            >
                            <template v-slot:empty >
                                <img src="@/assets/img/no_content.png" alt="" srcset="">
                                <p :class="{'el-table-empty-p':tableText}">{{tableText}}</p>
                            </template>
                            <el-table-column label="岗位" align="center" prop="skillName"></el-table-column>
                            <el-table-column label="外派订单" header-align="center" align="right" prop="outerAmount">
                                <template #default="scope">
                                    <el-input size="mini" @change="valueChange" v-if="isEdit" style="width:100%" v-model="scope.row.outerAmount" type="number"></el-input>
                                    <span v-else>{{scope.row.outerAmount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="企业内派订单"  header-align="center" align="right" prop="innerAmount">
                                <template #default="scope">
                                    <el-input size="mini" @change="valueChange" v-if="isEdit" style="width:100%" v-model="scope.row.innerAmount" type="number"></el-input>
                                    <span v-else>{{scope.row.innerAmount}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </el-drawer>

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
        <!-- 修改手机 -->
        <phone-dialog></phone-dialog>
    </div>
</template>

<script lang='ts'>
import { EditPen } from '@element-plus/icons-vue';
import { defineComponent,inject,onMounted, provide, reactive, ref, watch} from 'vue';
import paymentCode from '@/components/capital/paymentCode.vue';
import ForgetPassword from './safetyCheck/ForgetPassword.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetch } from '_@/axios-config/axios'
import PhoneDialog from './safetyCheck/PhoneDialog.vue';
export default defineComponent({
    components:{
        paymentCode,
        ForgetPassword,
        PhoneDialog
    },
    setup(props:any,{emit}) {
        const drawer:any = inject('safetyDrawer');
        const loading = ref<boolean>(false)
        const switchOpen = ref<number>(0)
        const dialogVisiblePhone = ref<boolean>(false)
        const dialogVisibleAddPhone = ref<boolean>(false)
        provide('dialogVisiblePhone',dialogVisiblePhone)
        provide('dialogVisibleAddPhone',dialogVisibleAddPhone)
        const showDialogPwa = ref<boolean>(false)
        const isEdit = ref<boolean>(false)
        const isButtom = ref<boolean>(false)
        const tableData = ref([])
        const tableText = ref("暂无数据~")
        const pageTitle:any = ref("更改手机")
        const phoneTitle:any = ref("更改手机")
        provide("pageTitle",pageTitle)
        const showDialog = ref<boolean>(false)
        provide("showDialog",showDialog)

        // 忘记密码
        const dialogVisibleForget = ref<boolean>(false)
        provide("dialogVisibleForget",dialogVisibleForget)
        const formData = reactive({
            val:{}
        } as any)
        provide("formData",formData)
        // 重置密码
        const resetPwd = () =>{
            dialogVisibleForget.value = true;
            pageTitle.value = "重置密码"
        }
        // 安全验证
        const dialogVisibleSV = ref<boolean>(false)
        provide("dialogVisibleSV",dialogVisibleSV)

        // 手机号更改
        const changePhone = () =>{
            if(isBinding.value){
                dialogVisiblePhone.value = true;
            }else{
                dialogVisibleAddPhone.value = true;
            }
        }

        // 预警开关，编辑校验
        const switchChange = async (flag:number) =>{
            if(flag==1){
                switchOpen.value=0
                showDialogPwa.value = true;
                return false;
            }
            await fetch({
                url: `/admin/company/alarmflag/update/0`,
                method: 'post',
            }).then((res: any) => {
                if (res.code == 0) {
                    ElMessage.success('预警设置关闭成功');
                }
            })
        }
        // 修改校验
        const isClickEdit = ref<boolean>(false)
        const editInfo = () =>{
            isEdit.value = true
        }
        const handelConfirmPay = async(data:any,ticket:any) =>{
            // 开启预警开关前的回调
            if(ticket && ticket.mfaVerifyTicket && switchOpen.value==0){
                await fetch({
                    url: `/admin/company/alarmflag/update/1`,
                    method: 'post',
                }).then((res: any) => {
                    if (res.code == 0) {
                        ElMessage.success('预警设置开启成功');
                        showDialogPwa.value = false;
                        warnStatus()
                    }else{
                        switchOpen.value == 0;
                    }
                })
            }
            // 开启预警后保存校验
            if(ticket && ticket.mfaVerifyTicket && switchOpen.value == 1){
                await fetch({
                    url: '/basic/basicskillalarmconfig/save',
                    method: 'post',
                    headers:{
                        'mfa-verify-ticket':ticket.mfaVerifyTicket
                    },
                    data: tableData.value
                }).then((res: any) => {
                    if (res.code == 0) {
                        ElMessage.success('保存成功');
                        sessionStorage.setItem('moreSave','true')
                        showDialogPwa.value = false;
                        getListData()
                    }
                })
            }
        }
        // 关闭窗口回调
        const closeDrawer = () =>{
            if(isCahnge.value){
                ElMessageBox.confirm(
                    '检测到数据发生更改,请保存后在关闭!',
                    '提示',
                    {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    }
                )
                .then(() => {
                
                })
                .catch(() => {
                    drawer.value = false
                })
            }else{
                drawer.value = false
            }
        }
        
        // 检测数据是否发生变化
        const isCahnge = ref<boolean>(false)
        const valueChange = () =>{
            isCahnge.value = true
        }
        // 获取岗位金额预警配置
        const getListData = async () =>{
            loading.value = true
            await fetch({
                url: '/basic/basicskillalarmconfig/list',
                method: 'get',
            }).then((res: any) => {
                if (res.code == 0) {
                    tableData.value = res.data;
                    isCahnge.value = false;
                }
            }).finally(()=>{
                loading.value = false;
            })
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
        provide('getPhone',getPhone)
        // 获取企业公费预警状态
        const warnStatus = async () =>{
            await fetch({
                url: '/admin/company/alarmflag/get',
                method: 'get',
            }).then((res: any) => {
                if (res.code == 0) {
                    switchOpen.value = Number(res.data)
                }
            })
        }
        const save = async() =>{
            if(sessionStorage.getItem('moreSave') == 'true'){
                await fetch({
                    url: '/basic/basicskillalarmconfig/save',
                    method: 'post',
                    data: tableData.value
                }).then((res: any) => {
                    if (res.code == 0) {
                        ElMessage.success('保存成功');
                        showDialogPwa.value = false;
                        getListData()
                    }
                })
            }else{
                showDialogPwa.value = true
            }
        }
        // 判断是否绑定手机号
        const isBinding = ref<boolean>(false)
        const isBindingPhone = async()=>{
            await fetch({
                    url: '/pay/account/company/phone/check',
                    method: 'get'
                }).then((res: any) => {
                    if (res.data) {
                        phoneTitle.value = '更改手机';
                        isBinding.value = res.data;
                    }else{
                        phoneTitle.value = '绑定手机';
                        isBinding.value = false;
                    }
                })
        }
        provide('isBindingPhone',isBindingPhone)
        watch(()=>drawer,(newV)=>{
            if(newV.value){
                isEdit.value = false;
                getPhone()
                getListData()
                warnStatus()
                isBindingPhone()
            }
        },{immediate:true,deep:true})
        onMounted(() => {
        })
        return {
            drawer,
            loading,
            switchOpen,
            tableData,
            tableText,
            EditPen,
            isEdit,
            pageTitle,
            handelConfirmPay,
            showDialogPwa,
            isButtom,
            dialogVisibleForget,
            dialogVisibleSV,
            switchChange,
            closeDrawer,
            isCahnge,
            valueChange,
            getListData,
            changePhone,
            getPhone,
            formData,
            editInfo,
            isClickEdit,
            warnStatus,
            resetPwd,
            save,
            dialogVisibleAddPhone,
            phoneTitle,
            isBindingPhone,
            isBinding
        }
    }
})
</script>

<style scoped lang="less">
.pay-title-tip{
    color: #303133;
    font-size: 2.4rem;
    text-align: center;
    margin-top: 2.2rem;
}
.el-drawer{
    .el-drawer__body{
        .container{
            height: calc(100%);
            box-sizing: border-box;
            .main{
                padding: 0 4rem;
                box-sizing: border-box;
                height: calc(100% - 21rem);
                .btn{
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 2rem;
                    span{
                        border: 1px solid #0969DA;
                        color: #0969DA;
                        padding: 1rem 1.3rem;
                        border-radius: .4rem;
                        font-size: 1.2rem;
                        cursor: pointer;
                        &:hover{
                            background: #ECF5FF;
                        }
                        .el-icon{
                            padding-right: 1rem;
                        }
                    }
                }
                .table{
                    height: calc(100% - 6rem);
                    box-sizing: border-box;
                    padding-top: 1rem;
                }
            }
            .hearder{
                padding: 2rem 0 1rem;
                &>div{
                    display: flex;
                    align-items: center;
                    padding:0 4rem 2rem;
                    &:last-child{
                        border-top: 1px solid #E4E7ED;
                        padding: 2rem 4rem 1rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        &>div{
                            display: flex;
                            align-items: center;
                            div{
                                &:first-child{
                                    color: #4C4C4C;
                                    font-weight: bold;
                                    padding-right: .5rem;
                                }
                                &:last-child{
                                    color: #F56C6C;
                                }
                            }
                        }
                    }
                    span{
                        &:first-child{
                            color: #909399;
                            display: flex;
                            align-items: center;
                            .el-icon{
                                padding-right: 1rem;
                            }
                            padding-right: 3rem;
                        }
                        &:nth-child(2){
                            color: #1A1A1A;
                            width: 15rem;
                        }
                        &:last-child{
                            border: 1px solid #0969DA;
                            border-radius: .4rem;
                            padding: 1rem;
                            color: #0969DA;
                            font-size: 1.2rem;
                            cursor: pointer;
                        }
                    }

                }
            }
        }
    }
}
.no-nodding{
    padding: 0 1.2rem;
}
::v-deep .el-table-only{
    .el-input{
        .el-input__inner{
            border: transparent;
            background: transparent;
        }
    }
}
</style>
