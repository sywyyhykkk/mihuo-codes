<!-- 充值 -->
<template>
    <div>
        <el-dialog
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            v-model="dialogVisible"
            title="充值"
            width="35rem"
        >
            <el-form
            ref="formDom"
            :model="formData"
            class="form_flex-rech"
            label-width="2rem"
            :rules="rules"
            >
                <div class="title" style="padding-top:2rem;padding-bottom:0">充值金额</div>
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
                <div class="title">充值方式</div>
                <el-form-item prop="payMethodKey">
                    <el-radio-group v-model="formData.payMethodKey">
                        <el-radio
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.id"
                        >
                        <img :src="item.srcUrl" alt="" srcset="">
                        <span>{{item.name}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button type="primary" @click="savePre" :loading="loadingBtn">确认</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 支付密码 -->
        <paymentCode
        v-model="showDialogPwa"
        v-if="showDialogPwa"
        :title="'安全性检测'"
        @getHandelData="handelConfirmPay">
        </paymentCode>
        <!-- 二维码充值 -->
        <el-dialog
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            v-model="dialogVisibleScan"
            title="扫码充值"
            width="50rem"
            @close="closeDialog"
        >
            <div class="main-sys">
                <div>
                    <div id="qrcode" ref="qrCode" class="qrcode-rwm"></div>
                    <span class="qrcode-tip">{{QRcode.msg}}</span>
                </div>
            </div>
        </el-dialog>
        <!-- 忘记密码 -->
        <!-- <forget-password></forget-password> -->
    </div>
</template>

<script lang='ts'>
import { ElMessage } from 'element-plus';
import { defineComponent,inject,nextTick,onMounted, provide, reactive, ref, watch} from 'vue';
import { fetch } from '_@/axios-config/axios'
import QRCode  from "qrcodejs2"
export default defineComponent({
    components:{QRCode},
    setup(props:any,{emit}) {
        const dialogVisible:any = inject('rechargeVisible')
        const showDialogPwa = ref<boolean>(false)
        const dialogVisibleForget = ref<boolean>(false)
        provide('dialogVisibleForget',dialogVisibleForget)
        const dialogVisibleScan = ref<boolean>(false)
        const formData = reactive({
            amount:null,
            payMethodKey:1
        } as any)
        const formDom:any = ref(null)
        const rules = reactive({
            amount:[{required: true, message: '请输入充值金额', trigger: 'blur'}],
            payMethodKey:[{required: true, message: '请选择支付反式', trigger: 'blur'}]
        } as any)

        const loadingBtn = ref<boolean>(false)
        const options = ref([
            {id:1,name:'微信',srcUrl:require('@/assets/img/wx.png')},
            {id:4,name:'支付宝',srcUrl:require('@/assets/img/zfb.png')},
        ])
        const savePre = async () =>{
            let res = await formDom.value.validate().then((valid:any)=>{
                return valid
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                // showDialogPwa.value = true
                handelConfirmPay()
            }
        }
        const closeDialog = () =>{
            emit('rechargeSuccess',true)
        }
        // 存储二维码
        const QRcode:any = ref({
            data: "https://syb.allinpay.com/apiweb/h5unionpay/native?key=nk4xwIZA95oh37aWchBEvX%2Ba",
            msg: "请使用微信扫码支付"
        }as any)
        const handelConfirmPay = async() =>{
            await fetch({
                url: '/pay/platform/amount/applyDeposit',
                method: 'post',
                data:{
                    amount:formData.amount,
                    payMethodKey:formData.payMethodKey
                }
            }).then((res: any) => {
                if (res.code == 0) {
                    QRcode.value = res
                    dialogVisible.value = false;
                    dialogVisibleScan.value = true;
                }
            })
        }
        let documents = document as any
        const qrCode:any = ref(null)
        // 生成二维码
        const qrcode =()=> {
            let qrcode = new QRCode('qrcode', {
                width: 140,
                height: 140,        // 高度
                text: QRcode.value.data,   // 二维码内容
                render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                background: '#f0f',   // 背景色
                foreground: '#ff0'    // 前景色
            })
        }
        watch(()=>dialogVisible.value,(newv:boolean)=>{
            if(newv){
                if(formDom && formDom.value){
                    formDom.value.resetFields()
                }
            }
        })
        watch(()=>dialogVisibleScan.value,(newv:boolean)=>{
            if(newv){
                nextTick(()=>{
                    qrcode()
                })
            }else{
                // 清除二维码
                documents.getElementById("qrcode").innerHTML = "";
            }
        })
        onMounted(() => {

        })
        return {
            dialogVisible,
            formData,
            options,
            rules,
            formDom,
            savePre,
            showDialogPwa,
            handelConfirmPay,
            dialogVisibleScan,
            QRcode,
            closeDialog,
            dialogVisibleForget
        }
    }
})
</script>

<style scoped lang="less">
.title{
    display: flex;
    justify-content: center;
    font-size: 2.2rem;
}
.form_flex-rech{
    .el-form-item{
        /deep/.el-radio-group{
            display: flex;
            flex-flow: column nowrap;
            width: (100% - 5rem);
            .el-radio{
                width: calc(100% - 1rem);
                display: flex;
                justify-content: space-between;
                flex-direction: row-reverse;
                box-sizing: border-box;
                margin-right: 3rem;
                background: #F3F4F8;
                border-radius: .4rem;
                margin-bottom: 1rem;
                color: #303133;
                margin-left: 1.5rem;
                padding: 0 1rem;
                .el-radio__label{
                    display: flex;
                    align-items: center;
                    img{
                        width: 2rem;
                        height: 2rem;
                        border-radius: .2rem;
                        margin-right: 1rem;
                    }
                }

            }
            .is-checked{
                background: #ECF5FF;
            }
        }
    }
}
:deep(.only) {
    width: calc(100% - 3.5rem);
    .el-input__inner{
        height: 8rem !important;
        line-height: 8rem !important;
        border: none;
        background: #F3F4F8;
        text-align: center;
        color: #303133;
        font-size: 2.4rem;
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
:deep(.el-input__prefix-inner) {
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
.main-sys{
    display: flex;
    justify-content: center;
    align-items: center;
    .qrcode-rwm{
        margin-top: 2rem;
    }
    .qrcode-tip{
        display: inline-block;
        padding:2rem 0;
        font-size: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
