<template>
    <div class="container">
        <ul v-for="(item,index) in formSetting_" :key="index">
            <li>{{item.label}}</li>
            <el-image
                v-if="item.type=='image'" 
                preview-teleported
                style="height: 9.6rem; width: 9.6rem;border: 0.1rem dashed #F2F6FC;background:#fff;border-radius: 0.6rem"
                lazy
                :src="formData.val[item.prop]"
                :preview-src-list="formData.val[item.prop]"
            />
                <!-- :src="$getUrl.getPicUrl(formData.val[item.prop], true)"
                :preview-src-list="$getUrl.getPicUrl(formData.val[item.prop])" -->
            <el-image
                v-else-if="item.type=='imageOne' && formData.val.authType == '1'" 
                preview-teleported
                style="height: 9.6rem; width: 9.6rem;border: 0.1rem dashed #F2F6FC;background:#fff;border-radius: 0.6rem"
                lazy
                :src="formData.val[item.prop]"
                :preview-src-list="formData.val[item.prop]"
            />
            <li v-else-if="item.prop=='authType'">{{formData.val[item.prop]=='1'?'三证':'一证'}}</li>
            <li v-else-if="item.prop=='identityType'">{{getTypeName(formData.val[item.prop],enumObj.cardType)}}</li>
            <!-- <li v-else-if="item.prop=='parentBankName'">{{getTypeName(formData.val[item.prop],enumObj.bankType)}}</li> -->
            <li v-else>{{formData.val[item.prop]}}</li>
        </ul>
    </div>
</template>

<script lang='ts'>
import { defineComponent,inject,onMounted} from 'vue';
import { formSetting } from './FormSet'
export default defineComponent({
    setup(props:any,{emit}) {
        const formData:any = inject('formDataEnter')
        const enumObj:any=inject('enumObj');
        const getTypeName =(value:string,list:any) =>{
            let name='';
            value=''+value;
            if(value){
                if(list && list.length>0){
                    list.some((val:any)=>{
                        if(val.id==value){
                            name=val.text;
                            return true;
                        }
                    })
                }
            }
            return name;
        }
        onMounted(() => {
            // console.log(enumObj.bankType,"enumObj.bankType")
        })
        return {
            formData,
            formSetting_:formSetting,
            getTypeName,
            enumObj
        }
    }
})
</script>

<style scoped lang="less">
.container{
    padding: 0 4rem;
    ul{
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: .5rem;
        li{
            &:first-child{
                font-size: 1.2rem;
                color: #909399;
            }
            &:last-child{
                color: #1A1A1A;
                font-size: 1.4rem;
            }
        }
    }
}
</style>
