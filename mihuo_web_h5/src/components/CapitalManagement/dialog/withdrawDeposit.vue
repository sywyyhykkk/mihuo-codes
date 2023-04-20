<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="提现"
      width="40rem"
      @close="closeDialog"
    >
      <el-form
        ref="formDom"
        :model="formData"
        class="form_flex"
        label-width="3rem"
        :rules="rules"
      >
        <div class="title">提现金额</div>
        <el-form-item prop="amount">
          <el-input
            v-model="formData.amount"
            class="only"
            type="number"
            min="0"
          >
            <template #prefix>
              <img
                style="width:2.5rem;height:2rem;padding-left:4rem"
                src="@/assets/img/amount.png"
                alt=""
              >
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <span>账户余额</span>
          <div style="margin-left: 1rem;color:#0969DA;font-size:1.5rem">{{ data.allAmount || 0.00 }}</div>
        </el-form-item>
        <el-form-item prop="phone">
          <div style="display: flex;justify-content: space-between;width: calc(100% - 4rem);align-items: center">
            <div class="flex-center">
              <span>绑定手机号</span>
              <div style="margin-left: 1rem;color:#0969DA;font-size:1.5rem">{{ ('15758303924').replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") }}</div>
            </div>
            <el-button type="primary" @click="getVerificationCode">{{ send }}</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="phoneCode">
          <div style="display: flex;width: calc(100% - 4rem);align-items: center">
            <span style="width:6rem">验证码</span>
            <el-input v-model="formData.phoneCode" placeholder="请输入短信验证码" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="savePre">确认提现</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, inject, onMounted, provide, reactive, ref, watch, watchEffect, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const { data } = toRefs(props) as any
    const dialogVisible:any = inject('withdrawVisible')
    const formData = reactive({
      amount: null
    }as any)
    const send = ref<any>('发送验证码')
    const times = ref<number>(60)
    const timer = ref<any>(null)
    const formDom:any = ref(null)
    const loadingBtn = ref<boolean>(false)
    const showDialogPwa = ref<boolean>(false)
    const dialogVisibleForget = ref<boolean>(false)
    provide('dialogVisibleForget', dialogVisibleForget)
    const options:any = ref([])
    const rules = reactive({
      amount: [{ required: true, message: '请输入提现金额', trigger: 'blur' }],
      phoneCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }]
    } as any)
    const savePre = async () => {
      const res = await formDom.value.validate().then((valid:any) => {
        return valid
      }).catch(() => {
        throw new Error('表单验证失败！')
      })
      if (res) {
        if (Number(formData.amount) > Number(data.allAmount)) {
          return ElMessage.warning('提现金额大于账户余额，请重新输入')
        }
        if (Number(formData.amount) <= 0) {
          return ElMessage.warning('提现金额无效，请重新输入')
        }
        handelConfirmPay()
      }
    }
    const handelConfirmPay = async () => {
      await fetch({
        url: '/pay/platform/amount/applyWithdraw',
        method: 'post',
        data: formData
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success('提现成功')
          dialogVisible.value = false
          // 提现成功
          emit('withdrawalSuccess ', true)
        }
      })
    }
    // 获取验证码
    const getVerificationCode = () => {
      if (times.value != 60) {
        ElMessage.warning('操作太频繁！')
        return
      }
      // await fetch({
      //     url: '/admin/mfa/smscode/send',
      //     method: 'post'
      // }).then((res: any) => {
      //     if (res.data) {
      //         ElMessage.success('短信已发送，请注意查收')
      //         const timer = setInterval(() => {
      //             times.value--
      //             if (times.value <= 0) {
      //                 send.value = '发送验证码'
      //                 clearInterval(timer)
      //                 times.value = 60
      //             } else {
      //                 send.value = times.value + '秒后重试'
      //             }
      //         }, 1000)
      //     }
      // })
      // .catch((erro) => {
      //     ElMessage.error(erro)
      // })
    }
    const closeDialog = () => {
      // send.value = '发送验证码'
      // clearInterval(timer.value)
      // times.value = 60
    }
    // 签订协议
    const windows = window as any
    watch(() => dialogVisible, (newv:any) => {
      if (newv.value) {
        if (formDom.value && formDom.value) {
          formDom.value.resetFields()
        }
      }
    }, { deep: true, immediate: true })
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
      send,
      times,
      timer,
      getVerificationCode,
      closeDialog
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
.flex-center{
    display: flex;
    align-items: center;
}
</style>
