<template>
    <div class="container">
        <div class="main">
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                :model="formData.val"
                size="small"
                disabled
                class="flex_form"
            >
                <el-form-item label="管理员姓名">
                    <el-input v-model="formData.val.employee.employeeName" />
                </el-form-item>
                <el-form-item label="管理员账号">
                    <el-input v-model="formData.val.employee.employeePhone" />
                </el-form-item>
                
            </el-form>
            <div class="button">
                <el-button type="primary" :icon="EditPen" @click="edit" v-if="$getPression('admin_syscompanybasicinfo_edit')">修改</el-button>
            </div>
        </div>
        <DialogAdmin />
    </div>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, provide, reactive, ref, toRefs} from 'vue';
import { EditPen } from '@element-plus/icons-vue'
import { fetch } from '_@/axios-config/axios';
import { ElMessage } from 'element-plus';
export default defineComponent({
    setup(props:any,{emit}) {
        //form设定
        let loadingBtn = ref<boolean>(false)
        provide('loadingBtn',loadingBtn);

        //弹出框
        let dialogVisible=ref(false);        
        let pageTitle=ref('编辑');
        provide('pageTitle', pageTitle)
        provide('dialogVisible', dialogVisible)
        let labelPosition = inject('labelPosition');
        let judgeAdmim:any = inject('judgeAdmim');
        let formData = reactive({
            val:{
                userId:'',
                employee:{}
            },
        }as any)
        provide('formData',formData)
        let userInfo:any = ref()
        let edit = () => {
            pageTitle.value = '转让企业管理员';
            dialogVisible.value = true
        }

        let save = async() =>{
            if(formData.val.userId == userInfo.value.sysUser?.userId){
                ElMessage.warning('当前登录账号，已是管理员');
                return
            }
            await fetch({url:'/admin/company/admin/change',method:'post',data:formData.val.userId})
            .then((res:any)=>{
                if(res.code == '0'){
                    ElMessage.success('转让企业管理员成功');
                    dialogVisible.value = false;
                    judgeAdmim()
                }
            })
        }
        provide('save',save)
        let json = JSON as any
        onMounted(() => {
            if(sessionStorage.getItem('userInfoDetail')){
                let data:any = json.parse(sessionStorage.getItem('userInfoDetail'))
                userInfo.value = json.parse(data.v)
            }
            formData.val.userId = userInfo.value.sysUser?.userId;
            formData.val.employee.employeePhone = userInfo.value.sysUser?.phone
            formData.val.employee.userId = userInfo.value.sysUser?.userId
            formData.val.employee.employeeName = userInfo.value.sysUser?.realName || userInfo.value.sysUser?.nickName;
        })
        return {
            labelPosition,
            formData,
            dialogVisible,
            loadingBtn,
            pageTitle,
            EditPen,
            edit,
            save,
        }
    }
})
</script>

<style scoped lang="less">
.main{
    display: flex;
    justify-content: space-between;
    .button{
        margin-top: 20px;
    }
    .flex_form{
        /deep/.el-form-item{
        &:first-child{
            margin-top: 20px !important;
        }
        .el-form-item__label{
            color: #909399;
        }
        .el-form-item__content{
            .el-input{
                // width: 100%;
                .el-input__inner{
                    color: #303133;
                    border: none !important;
                    cursor: default;
                }
            }
        }
        }
        .textarea{
            width: 100%;
        }
    }
}
:deep(.el-dialog__body){
    display: flex !important;
    align-items: center !important;
}
</style>