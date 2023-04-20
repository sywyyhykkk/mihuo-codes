<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="pageTitle"
        width="54rem"
    >
        <FormSetMain ref="ruleForm_d"></FormSetMain>
        <template #footer>
            <span class="dialog-footer">
            <el-button type="primary" @click="savePre" :loading="loadingBtn">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted, ref} from 'vue';
import FormSetMain from '../FormSetMain.vue'
export default defineComponent({
    components:{
        FormSetMain
    },
    setup(props:any,{emit}) {
        let ruleForm_d:any=ref(null);//绑定子组件ref
        let save:any = inject('save');
        let loadingBtn:any = inject('loadingBtn');
        let dialogVisible = inject('dialogVisibleBasic')
        let pageTitle = inject('pageTitle')
        let formData:any = inject('formData');

        async function savePre(){
            //验证数据
            let res=await ruleForm_d.value.valid();
            if(res){
                save()
            }
        }
        onMounted(() => {

        })
        return {
            dialogVisible,
            ruleForm_d,
            loadingBtn,
            pageTitle,
            formData,
            savePre
        }
    }
})
</script>

<style scoped lang="scss">

</style>
