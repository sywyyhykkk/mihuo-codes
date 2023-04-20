<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="pageTitle"
        width="50rem"
    >
        <div class="upload-tip">仅支持上传doc、docx、xlsx、xls、pdf、ppt、pptx、cad、png、jpeg、jpg格式文件</div>
        <el-form
            ref="formDom"
            :model="formData.val"
            label-width="9rem"
            :rules="rules"
            >
            <el-form-item label="文件">
                <uploadFile
                v-model="formData.val.uploadItemList"
                :prantMsg="prantMsg"
                :max-count="9" />
            </el-form-item>
            <el-form-item label="备注" v-if="!disabled">
                <el-input :autosize="{ minRows: 3}" type="textarea" v-model="formData.val.remark"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="savePre" :loading="loadingBtn">提 交</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
import { defineComponent,inject,nextTick,onMounted, reactive, ref, watch} from 'vue';
export default defineComponent({
    props:{
        prantMsg:{
            type:Object
        }
    },
    setup(props:any,{emit}) {
        const formDom:any = ref(null)
        const pageTitle = inject('pageTitle')
        const dialogVisible:any = inject('dialogVisible')
        const loadingBtn = inject('loadingBtn')
        const formData:any = inject('formData')
        const disabled:any = inject('disabled')
        const userInfo:any = ref({})
        const save:any = inject('save')
        const rules = reactive({})
        const projectId = inject('projectId')
        const savePre = async()=>{
            //验证数据
            let res=await formDom.value.validate().then((valid:any)=>{
                return valid;
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            if(res){
                formData.val.groupName = props.prantMsg.uploadName;
                formData.val.type = 1;
                formData.val.nodeId = props.prantMsg.nodeId;
                formData.val.projectId = projectId;
                // formData.val.uploadGroup = props.prantMsg.uploadGroup;
                // formData.val.personId = userInfo.value.sysUser.userId;
                save()
            }
        }
        watch(()=>dialogVisible.value,(newv)=>{
            if(newv){
                nextTick(()=>{
                    if(formDom && formDom.value){
                        formDom.value.resetFields();
                    }
                })
            }
        },{deep:true,immediate:true})
        const json = JSON as any
        onMounted(() => {
            if(sessionStorage.getItem('userInfoDetail')){
                const user = json.parse(sessionStorage.getItem('userInfoDetail'));
                userInfo.value = json.parse(user.v)
            }
        })
        return {
            pageTitle,
            formDom,
            dialogVisible,
            loadingBtn,
            formData,
            rules,
            userInfo,
            savePre,
            disabled
        }
    }
})
</script>

<style scoped lang="less">
.upload-tip{
    color: red;
    margin-top: 2rem;
}
</style>
