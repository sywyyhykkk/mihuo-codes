<template>
    <div>
        <el-drawer
            v-model="drawer"
            :title="'银行卡'"
            :direction="'rtl'"
            size="90rem"
            v-if="drawer"
            >
            <div class="container">
                <div class="hearder">
                    <span></span>
                    <el-button :icon="Plus" type="primary" @click="add">添加银行卡</el-button>
                </div>
                <div class="main">
                    <el-table
                        ref="factory_table"
                        v-loading="loading"
                        stripe
                        :data="tableData"
                        border
                        style="width:100%;height:calc(100vh - 17rem) !important;max-height:calc(100vh - 17rem) !important"
                        height="0"
                        >
                        <template v-slot:empty >
                            <img src="@/assets/img/no_content.png" alt="" srcset="">
                            <p :class="{'el-table-empty-p':tableText}">{{tableText}}</p>
                        </template>
                        <el-table-column label="账户名称" align="center" prop="name"></el-table-column>
                        <el-table-column label="账户类型" align="center" prop="cardProperty">
                            <template #default="scope">
                                {{scope.row.cardProperty=='0'?'个人银行卡':scope.row.cardProperty=='1'?'企业对公账户':''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="开户银行" align="center" prop="subName"></el-table-column>
                        <el-table-column label="银行卡号" align="center" prop="cardNo"></el-table-column>
                        <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template #default="scope">
                                <el-button :icon="Paperclip" type="text" style="color:#F2AA3D" @click="unBindBankCard(scope.row)">解绑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-drawer>
        <paymentCode 
            v-model="showDialogPwa" 
            v-if="showDialogPwa"
            :title="'安全性检测'"
            @forgetPwd="()=>dialogVisibleForget=true"
            @getHandelData="handelConfirmPay">
        </paymentCode>
        <!-- 添加银行卡 -->
        <add-card-dialog></add-card-dialog>
        <!-- 忘记密码 -->
        <forget-password></forget-password>
        
    </div>
</template>

<script lang='ts'>
import { Plus, Paperclip } from '@element-plus/icons-vue';
import { defineComponent,inject,onMounted, provide, reactive, ref, watch} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetch } from '_@/axios-config/axios'
export default defineComponent({
    setup(props:any,{emit}) {
        const drawer = inject('bankDrawer');
        const backTitle:any = inject('backTitle');
        const tableData = ref([])
        const tableText = ref("暂无数据~")
        const loading = ref<boolean>(true)
        const showDialogPwa = ref<boolean>(false)
        const dialogVisible = ref<boolean>(false)
        const dialogVisibleCard = ref<boolean>(false)
        const dialogVisibleForget = ref<boolean>(false)
        provide('dialogVisibleCard',dialogVisibleCard)
        provide('dialogVisibleForget',dialogVisibleForget)
        const formData:any = ref()
        const getBankCards = async () =>{
            loading.value = true;
            await fetch({
                url: '/pay/account/company/getBankCards',
                method: 'get',
            }).then((res: any) => {
                if(res.code == '0'){
                    tableData.value = res.data;
                    if(tableData.value.length>0){
                        backTitle.value = true
                    }
                }
            }).finally(()=>{
                loading.value = false
            })
        }
        provide('getBankCards',getBankCards)
        const unBindBankCard = async (row:any) =>{
            formData.value = row
            showDialogPwa.value = true
        }
        const handelConfirmPay = async (data:any,ticket:any)=>{
            if(ticket && ticket.mfaVerifyTicket){
                await fetch({
                    url: '/pay/account/company/unBindBankCard',
                    method: 'post',
                    headers:{
                        'mfa-verify-ticket':ticket.mfaVerifyTicket
                    },
                    data:{
                        bankCardId:formData.value.id
                    }
                }).then((res: any) => {
                    if(res.code == '0'){
                        ElMessage.success('解绑成功');
                        showDialogPwa.value = false;
                        getBankCards()
                    }
                })
            }
        }
        const add = () =>{
            // dialogVisible.value = true
            dialogVisibleCard.value=true
        }
        watch(()=>drawer,(newv:any)=>{
            if(newv.value){
                getBankCards()
            }
        },{deep:true,immediate:true})
        onMounted(() => {
            
        })
        return {
            drawer,
            Plus,
            Paperclip,
            tableData,
            tableText,
            unBindBankCard,
            backTitle,
            showDialogPwa,
            handelConfirmPay,
            formData,
            dialogVisibleCard,
            add,
            dialogVisible,
            dialogVisibleForget
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
            }
            .main{
                max-height: calc(100% - 8rem);
                padding: 1rem 4rem 0;
                box-sizing: border-box;
            }
        }
    }
}
.el-table__empty-text{
	img{
		height: 15rem;
	}
	.el-table-empty-p{
		color: #C0C4CC;
	}
}
.pay-title-tip{
    color: #303133;
    font-size: 2.4rem;
    text-align: center;
    margin-top: 2rem;
}
</style>
