<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="pageTitle"
        width="110rem"
    >
        <!-- <el-steps :active="active" finish-status="success" align-center>
            <el-step title="完善基本信息" />
            <el-step title="证件上传"/>
        </el-steps>
        <FormSetMainCapital ref="ruleForm_d"  v-if="active == 0"></FormSetMainCapital>
        <FormUpload ref="ruleForm_u" v-if="active == 1"></FormUpload>
        <template #footer>
            <span class="dialog-footer" v-if="active == 0">
                <el-button type="primary" @click="savePre(true)" :loading="loadingBtn">下一步</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
            <span class="dialog-footer" v-else>
                <el-button type="primary" @click="active=0" >上一步</el-button>
            </span>
        </template> -->
        <el-steps :active="active" finish-status="success" align-center>
            <el-step title="完善基本信息" />
            <el-step title="证件上传"/>
        </el-steps>
        <FormSetMainCapital ref="ruleForm_d"  v-if="active == 0"></FormSetMainCapital>
        <FormUpload ref="ruleForm_u" v-if="active == 1"></FormUpload>
        <template #footer>
            <span class="dialog-footer" v-if="active == 0">
                <el-button type="primary" @click="savePre(true)" :loading="loadingBtn">下一步</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
            <span class="dialog-footer" v-else>
                <el-button @click="savePre(false)">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, provide, reactive, ref, watch} from 'vue';
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
        let dialogVisible:any = inject('dialogVisible')
        let pageTitle = inject('pageTitle')
        let formData:any = inject('formData');
        let active = inject('active') as any
        async function savePre(flag:boolean){
            //验证数据
            if(ruleForm_d && ruleForm_d.value){
                let res=await ruleForm_d.value.valid();
                if(res){
                    if(flag == true){
                            save()
                    }else{
                        lookCompanyStatus()
                    }
                }
            }
            if(flag == false){
                lookCompanyStatus()
            }
            // if(ruleForm_u && ruleForm_u.value){
            //     let res=await ruleForm_u.value.valid();
            //     if(res){
            //         if(flag == true){
            //                 save()
            //         }else{
            //             lookCompanyStatus()
            //             dialogVisible.value = false
            //         }
            //     }
            // }
        }
        return {
            dialogVisible,
            ruleForm_d,
            ruleForm_u,
            loadingBtn,
            pageTitle,
            formData,
            savePre,
            active,
        }
    }
})
</script>

<style scoped lang="less">
.el-steps{
    margin-top: 1.5rem;
}
</style>
