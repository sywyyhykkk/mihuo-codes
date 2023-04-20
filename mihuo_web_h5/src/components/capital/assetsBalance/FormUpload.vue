<template>
    <el-form 
        ref="formDom"
        :rules="rules"
        :model="formData.val"
        class="flex_form"
        :label-position="labelPosition"
        label-width="14rem">
        <el-row>
            <el-col :span="9">
                <el-form-item label="营业执照" prop="certificateImge">
                    <Upload
                    v-model="formData.val.certificateImge" 
                    :max-count="1"
                    :pictureKey="1" />
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="法人身份证正面" prop="legalIdcardFront">
                    <Upload
                    v-model="formData.val.legalIdcardFront" 
                    :max-count="1" 
                    :pictureKey="8"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="9">
                <el-form-item label="组织机构代码证" prop="organizationImg"  v-if="formData.val.authType == '1'">
                    <Upload
                    v-model="formData.val.organizationImg" 
                    :max-count="1" 
                    :pictureKey="2"/>
                </el-form-item>
                <el-form-item label="统一社会信用证"  v-if="formData.val.authType == '2'">
                    <Upload
                    v-model="formData.val.uniCreditImg" 
                    :max-count="1"
                    :pictureKey="5"/>
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="法人身份证反面照" prop="legalIdcardBack">
                    <Upload
                    v-model="formData.val.legalIdcardBack" 
                    :max-count="1" 
                    :pictureKey="9"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="formData.val.authType == '1'">
            <el-col :span="9">
                <el-form-item label="税务登记证" prop="taxRegisterImg">
                    <Upload
                    v-model="formData.val.taxRegisterImg" 
                    :max-count="1" 
                    :pictureKey="3"/>
                </el-form-item>
            </el-col>
            <el-col :span="9"></el-col>
        </el-row>
    </el-form>
</template>

<script lang='ts'>
import { defineComponent, inject, reactive, ref} from 'vue';
import Upload from './Upload.vue';
import { fetch } from '_@/axios-config/axios'
export default defineComponent({
    components:{
        Upload
    },
    setup(props:any,{emit}) {
        const rules = reactive({
            legalIdcardFront: [{ required: true, message: '请上传证件照正面照片', trigger: 'blur' }],
            legalIdcardBack: [{ required: true, message: '请上传证件照反面照片', trigger: 'blur' }],
            certificateImge: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
            organizationImg: [{ required: true, message: '请上传组织机构代码证', trigger: 'blur' }],
            taxRegisterImg: [{ required: true, message: '请上传税务登记证', trigger: 'blur' }],
            uniCreditImg: [{ required: true, message: '请上传统一社会信用代码证', trigger: 'blur' }],
        });
        const formData:any = inject('formData');
        const enumObj = inject('enumObj');
        const dialogVisible:any = inject('dialogVisible')
        const dialogVisibleFaile:any = inject('dialogVisibleFaile')
        const savePre:any = inject('savePre');
        //验证数据
        const formDom:any=ref(null);
        async function valid() {
            let res=await formDom.value.validate().then((valid:any)=>{
                return valid;
            }).catch(()=>{
                throw new Error("表单验证失败！");
            })
            return res
        }
        
        return {
            rules,
            formData,
            enumObj,
            valid,
            formDom,
            dialogVisible,
        }
    }
})
</script>

<style scoped lang="less">
.el-row{
    display: flex;
    justify-content: center;
}
</style>
