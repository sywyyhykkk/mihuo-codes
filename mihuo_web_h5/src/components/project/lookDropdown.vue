<template>
    <div>
        <el-popover 
            class="dropdown-news" 
            ref="dropdown" 
            trigger="click" 
            :append-to-body="false"
            :hide-on-click="false"
            v-model="showPopover"
            width="300">
            <template #reference>
                <slot name="dropdown"></slot>
            </template>
            <template #default>
                <div class="dropdown-menu-news" v-if="notifyContent">
                    <div class="dropdown-menu_header">
                        <span style="font-size: 1.8rem;">{{props.title}}</span>
                        <el-icon class="close" @click="onClose"><close /></el-icon>
                    </div>
                    <div class="dropdown-menu_main">
                        <div class="dropdown-menu_main-header">
                            <avatarImg
                                :styles="{width: '2.2rem', height: '2.2rem',marginRight:'1rem'}"
                                :avatarId="notifyContent.createBy"
                             />
                            <span>{{notifyContent.createPersonName + notifyContent.createSkillName?'['+notifyContent.createSkillName+']':''}}</span>
                            <i>{{notifyContent.notifyDate}}</i>
                            <i>发起交底</i>
                        </div>
                        <div class="dropdown-menu_main-content">
                            <div class="dropdown-menu_main-title">
                                <span>交底日期</span>
                                <span>{{notifyContent.notifyDate.split(' ')[0]}}</span>
                            </div>
                            <p>{{notifyContent.notifyContent}}</p>
                        </div>
                        <!-- 图片 -->
                        <div class="dropdown-menu_main-img" v-if="notifyContent.notifyImg">
                            <template v-for="(item,index) in notifyContent.notifyImg"  :key="index">
                                <img v-if="item.type == 'img'" @click="lookPreview(thumbnailImage(item.url))" :src="thumbnailImage(item.url)" />
                                <!-- <el-image v-if="item.type == 'img'" :src="thumbnailImage(item.url)" :preview-src-list="srcList" fit="cover"/> -->
                            </template>
                        </div>
                        <!-- 音频 -->
                        <div style="display: flex;margin-left:3rem" v-if="notifyContent.notifyImg">
                            <template v-for="(item,index) in notifyContent.notifyImg"  :key="index">
                                <audio-play v-if="item.type == 'audio'" :src="thumbnailImage(item.url)"></audio-play>
                            </template>
                        </div>
                    </div>
                    <div class="dropdown-menu_footer" v-if="notifyContent.ccPersons && notifyContent.ccPersons.length">
                        <div class="dropdown-menu_main-user" v-for="(v,i) in notifyContent.ccPersons" :key="i">
                            <div>
                                <avatarImg
                                    v-if="v.handleUserId"
                                    :styles="{width: '2.2rem',height: '2.2rem', marginRight:'1rem'}"
                                    :avatarId="v.handleUserId"
                                 />
                                <span>{{v.handlePersonName}}</span>
                            </div>
                            <span 
                            :class="'dropdown-do dropdown-do'+v.readFlag">
                                <i></i>{{v.readFlag == "1"?'已读':'未读'}}
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </el-popover>
        <!-- 预览图片 -->
        <preview-image 
            v-model="showViewer"
            :current="initialIndex"
            :src-list="previewList"
        ></preview-image>
    </div>
</template>

<script lang='ts' setup>
import { ref, defineProps,onMounted,computed } from 'vue';
import { thumbnailImage } from '@/components/project/projectItem/projectDetailNewData';
const props = defineProps({
    modelValue:{
        type: Boolean,
        default: ()=> false
    },
    title: {
        type: String,
        default: ()=> ''
    },
    data: {
        type: [Object,Array],
        default: ()=> {}
    }
})
const emit = defineEmits(['onClose','update:modelValue']);
const showViewer:any = ref<boolean>(false);
const initialIndex:any = ref();
const previewList:any = ref([]);
const dropdown:any = ref(null);
const notifyContent:any = ref(null);
const showPopover = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});
const onClose = () =>{
    dropdown.value.hide()
    showPopover.value = false
}
const lookPreview = (url:string) =>{
    initialIndex.value = url;
    // showViewer.value = true
}
watch(()=>showPopover.value,(news)=>{
    if(news){
        notifyContent.value = props.data;
        let imgs:any = []
        if(notifyContent.value.notifyAttachments && JSON.parse(notifyContent.value.notifyAttachments).length){
            notifyContent.notifyImg = JSON.parse(notifyContent.value.notifyAttachments)
            JSON.parse(notifyContent.value.notifyAttachments).map((v:any)=>{
                if(v.type == 'img'){
                    imgs.push(thumbnailImage(v.url))
                }
            })
        }
        previewList.value = imgs
    }
},{deep:true,immediate:true})

</script>

<style lang="less">
    .dropdown-menu-news{
        max-height: 45rem !important;
        max-width: 42rem !important;
        overflow-y: auto;
        .dropdown-menu_header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:0 2rem;
            padding-top: 1rem;
            .close{
                font-size: 1.6rem;
                cursor: pointer;
                padding: .3rem;
                &:hover{
                    border-radius: 50%;
                    background: #dcdfe6;
                }
            }
        }
        .dropdown-menu_main{
            padding: 2rem;
            border-bottom: 1px solid #E4E7ED;
            .dropdown-menu_main-header{
                display: flex;
                align-items: center;
                font-size: 1.4rem;
                span{
                    color: #1A1A1A;
                }
                i{
                    font-style: normal;
                    padding-left: 1rem;
                    color: #909399;
                }
            }
            .dropdown-menu_main-content{
                margin-left: 3rem;
                .dropdown-menu_main-title{
                    padding: 1rem 0;
                    span{
                        color: #909399;
                        &:last-child{
                            padding-left: 2rem;
                            color: #1A1A1A;
                        }
                    }
                }
            }
            .dropdown-menu_main-img{
                display: flex;
                flex-flow: row wrap;
                margin-left: 3rem;
                margin-top: 1rem;
                img{
                    height: 10rem;
                    width: 10rem;
                    border-radius: 1rem;
                    background: #0969DA;
                    margin:0 1.5rem 1rem 0;
                }
            }
        }
        .dropdown-menu_footer{
            padding: 0 2rem;
            .dropdown-menu_main-user{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 2rem;
                &:last-child{
                    padding-bottom: 1rem;
                }
                div{
                    display: flex;
                    align-items: center;
                    span{
                        color: #4D4D4D;
                    }
                }
                .dropdown-do{
                    font-style: normal;
                    color: #F56C6C;
                    i{
                        display: inline-block;
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        background: #F56C6C;
                        margin: 0 .5rem;
                        top: 50%;
                        transform: translateY(-50%);
                        font-style: normal;
                }
                &.dropdown-do0{
                    color: #F56C6C;
                    i{
                            background: #F56C6C;
                        }
                }
                &.dropdown-do1{
                    color: #909399;
                    i{
                            background: #909399;
                        }
                }
                }
            }
        }
    }
</style>
