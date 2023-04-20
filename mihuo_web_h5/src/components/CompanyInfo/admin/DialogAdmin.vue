<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="pageTitle"
        width="55rem"
    >
        <el-form  
        ref="ruleForm_d"
        :rules="rules"
        :model="formData.val">
            <el-form-item label="新管理员账号" prop="userId">
                <select-org @visible="visibleStatus"  v-model="formData.val.employee">
                    <template #header>
                        <div class="other-person">
                            <div class="add-person">
                                <el-input
                                placeholder="请选择"
                                v-model="formData.val.employee.employeePhone"
                                readonly
                                :suffix-icon="suffixIcon"
                                ></el-input>
                            </div>
                        </div>
                    </template>
                </select-org>
            </el-form-item>
        </el-form>
        <!-- <FormSetMainAdmin ref="ruleForm_d"></FormSetMainAdmin> -->
        <template #footer>
            <span class="dialog-footer">
            <el-button type="primary" @click="savePre" :loading="loadingBtn">确认修改</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, ref, watch} from 'vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
export default defineComponent({
    setup(props:any,{emit}) {
        let ruleForm_d:any=ref(null);//绑定子组件ref
        let save:any = inject('save');
        let loadingBtn:any = inject('loadingBtn');
        let dialogVisible = inject('dialogVisible')
        let pageTitle = inject('pageTitle')
        let formData:any = inject('formData');
        let suffixIcon = ref(ArrowDown)
        async function savePre(){
            formData.val.userId = formData.val.employee?.userId
            formData.val.employee.employeeName = formData.val.employee?.employeeName
            //验证数据
            let res=await ruleForm_d.value.validate().then((valid:any)=>{
                return valid;
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                save()
            }
            

        }
        let visibleStatus = (flag:boolean) =>{
            if(flag){
                suffixIcon.value = ArrowUp
            }else{
                suffixIcon.value = ArrowDown
            }
        }
        watch(()=>formData.val.employee,(newVal:any)=>{
            if(newVal){
                formData.val.userId = newVal.userId;
                if(ruleForm_d && ruleForm_d.value){
                    ruleForm_d.value.clearValidate(['userId']);
                }
            }
        },{immediate:true,deep:true,})
        onMounted(() => {
        })
        return {
            dialogVisible,
            ruleForm_d,
            loadingBtn,
            pageTitle,
            formData,
            savePre,
            suffixIcon,
            visibleStatus
        }
    }
})
</script>

<style scoped lang="less">
</style>
